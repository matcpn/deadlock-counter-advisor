import { describe, expect, it } from 'vitest';
import { normalizeGameData, diffGameData, plainText } from './game-data';
const hero={id:1,class_name:'hero_test',name:'Test',player_selectable:true,disabled:false,in_development:false,prerelease_only:false,limited_testing:false,assigned_players_only:false,images:{},items:{signature1:'ability_test'}};
const ability={id:2,class_name:'ability_test',name:'Ability',type:'ability',description:{desc:'<b>Test</b>'}};
const item={id:3,class_name:'upgrade_test',name:'Item',type:'upgrade',shopable:true,item_slot_type:'vitality',item_tier:1,cost:800,activation:'passive',is_active_item:false,description:{desc:'<b>Condition</b>'},properties:{Cooldown:{value:4,label:'Cooldown'}}};
const colors={weapon_color:{red:229,green:138,blue:0},armor_color:{red:0,green:255,blue:153},spirit_bright_color:{red:206,green:144,blue:255}};
const run=(heroes:unknown=[hero],items:unknown=[ability,item])=>normalizeGameData(heroes,items,colors,6774,'2026-10-12T02:00:00Z');
describe('repeatable source import',()=>{
  it('keeps source identities and extracts only purchasable upgrades',()=>{const result=run();expect(result.items.map(i=>i.id)).toEqual(['item-3']);expect(result.heroes[0].id).toBe('hero-1');expect(result.status).toBe('imported-unreviewed');});
  it('retains unavailable heroes without making them selectable',()=>expect(run([{...hero,disabled:true} ,{...hero,id:4,class_name:'hero_other'}]).heroes.find(h=>h.id==='hero-1')?.selectable).toBe(false));
  it('ignores upstream development metadata without changing roster eligibility or diffs',()=>{
    const baseline=run();
    for(const in_development of [true,false,undefined]){
      const result=run([{...hero,in_development,development_state:'release'}]);
      expect(result).toEqual(baseline);
      expect(result.heroes[0]).not.toHaveProperty('development');
      expect(result.heroes[0].selectable).toBe(true);
      expect(diffGameData(baseline,result).heroes.changed).toEqual([]);
    }
  });
  it('does not turn non-active tooltips into passive-counter claims',()=>expect(run().items[0].activation).toBe('non-active'));
  it('accepts explicit active input',()=>expect(run([hero],[ability,{...item,activation:'press',is_active_item:true}]).items[0].activation).toBe('active'));
  it('rejects contradictory activation',()=>expect(()=>run([hero],[ability,{...item,is_active_item:true}])).toThrow('Contradictory'));
  it('rejects unknown activation semantics',()=>expect(()=>run([hero],[ability,{...item,activation:'new'}])).toThrow('Unknown source activation'));
  it('rejects component cycles',()=>expect(()=>run([hero],[ability,{...item,component_items:['upgrade_test']}])).toThrow('cycle'));
  it('rejects missing hero availability',()=>expect(()=>run([{...hero,disabled:undefined}])).toThrow('availability'));
  it('rejects unknown item categories and invalid prices',()=>{expect(()=>run([hero],[ability,{...item,item_slot_type:'new'}])).toThrow('category');expect(()=>run([hero],[ability,{...item,cost:-1}])).toThrow();});
  it('rejects duplicate identities',()=>expect(()=>run([hero,hero])).toThrow('Duplicate'));
  it('rejects missing abilities for selectable heroes',()=>expect(()=>run([hero],[item])).toThrow('Unresolved selectable'));
  it('rejects missing component definitions',()=>expect(()=>run([hero],[ability,{...item,component_items:['missing']}])).toThrow('component'));
  it('rejects untrusted image hosts',()=>expect(()=>run([{...hero,images:{icon_image_small:'https://other.example/image.png'}}])).toThrow('asset URL'));
  it('preserves numeric, empty and string property values without inventing values',()=>{const result=run([hero],[ability,{...item,properties:{x:{value:2},y:{value:''},z:{value:'3m'}}}]);expect(result.items[0].properties.map(p=>p.value)).toEqual(['2',null,'3m']);});
  it('detects changes to facts, removals and new identities',()=>{const before=run(),after=structuredClone(before);after.items[0].cost=1600;after.heroes=[];expect(diffGameData(before,after)).toMatchObject({items:{changed:['item-3']},heroes:{removed:['hero-1']}});expect(diffGameData(null,before).items.added).toEqual(['item-3']);});
  it('is deterministic for an unchanged source',()=>expect(diffGameData(run(),run()).items.changed).toEqual([]));
  it('strips markup for text rendering',()=>expect(plainText('<b>Effect</b><br>Limit')).toBe('Effect\nLimit'));
  it('keeps innate and triggered stats separate and preserves source units and signs',()=>{
    const changed={...item,properties:{Health:{value:'90',label:'Health',prefix:'{s:sign}'},Resist:{value:'25',label:'Resist',postfix:'%',prefix:'{s:sign}'},Range:{value:'45m',label:'Range',postfix:'m'},Penalty:{value:'-20',label:'Penalty',postfix:'%'}},tooltip_sections:[
      {section_type:'innate',section_attributes:[{properties:['Health']}]},
      {section_type:'passive',section_attributes:[{loc_string:'<b>When triggered</b>',important_properties:['Resist','StatusIcon'],properties:['Range','Penalty']}]}
    ]};
    const sections=run([hero],[ability,changed]).items[0].tooltipSections;
    expect(sections.map(s=>s.heading)).toEqual(['Innate stats','Passive effect']);
    expect(sections[0].stats.map(s=>s.value)).toEqual(['+90']);
    expect(sections[1].description).toBe('When triggered');
    expect(sections[1].stats.map(s=>s.value)).toEqual(['+25%','45m','-20%']);
  });
  it('shows extra meaningful base values without exposing inactive engine defaults as stats',()=>{
    const changed={...item,properties:{AbilityCooldown:{value:35,label:'Cooldown',postfix:'s'},StunDuration:{value:'0.5',label:'Stun',postfix:'s'},AbilityDuration:{value:0,label:'Duration',disable_value:'0'},AbilityCooldownBetweenCharge:{value:'-1.0',label:'Charge Delay'},Missing:{label:'Missing'},Internal:{value:4}}};
    expect(run([hero],[ability,changed]).items[0].tooltipSections).toEqual([{heading:'Additional base values',description:'',stats:[{name:'AbilityCooldown',label:'Cooldown',value:'35s'},{name:'StunDuration',label:'Stun',value:'0.5s'}]}]);
  });
  it('deduplicates referenced properties while preserving an explicit zero in a source tooltip',()=>{
    const changed={...item,properties:{Value:{value:'0',label:'Value'}},tooltip_sections:[{section_type:'active',section_attributes:[{properties:['Value'],important_properties:['Value']}]}]};
    expect(run([hero],[ability,changed]).items[0].tooltipSections[0].stats).toHaveLength(1);
    expect(run([hero],[ability,changed]).items[0].tooltipSections[0].stats[0].value).toBe('0');
  });
});
