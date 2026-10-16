import { describe, expect, it } from 'vitest';
import { reviewedCatalog, reviewAvailability } from '../data/reviewed';
import gameJson from '../data/game-catalog.json';
import type { GameSnapshot } from '../domain/game-data';
import type { Scenario } from '../domain/types';
import { parseCatalog } from '../domain/validate';
import { recommend } from './recommend';
import { recommendationBoard } from './board';
import { weights } from '../data/demo';
const game=gameJson as GameSnapshot;
const options={patch:'client-6785',allowSourceReviewed:true,asOf:'2026-10-16'};
const scenario:Scenario={heroId:'hero-1',build:'spirit',enemyHeroIds:['hero-6','hero-19'],problems:['control'],stage:'mid',budget:1800,ownedItemIds:[],allowActives:true};
const run=(overrides:Partial<Scenario>={})=>recommend(reviewedCatalog,{...scenario,...overrides},weights,options);

describe('source-reviewed defensive coverage',()=>{
  it('keeps source-reviewed advice out of verified-only evaluation',()=>expect(recommend(reviewedCatalog,scenario,weights,{...options,allowSourceReviewed:false})).toEqual([]));
  it('offers an affordable passive control response before an expensive active',()=>{
    const results=run();
    expect(results.map(r=>[r.item.name,r.affordable,r.goal])).toEqual([['Debuff Reducer',true,'survive'],['Reactive Barrier',true,'survive'],['Unstoppable',false,'survive']]);
    expect(results.every(r=>r.coveredEnemyIds.join()==='hero-6')).toBe(true);
  });
  it('offers damage defenses without substituting anti-heal or stun reduction for burst survival',()=>{
    const results=run({problems:['burst']});
    expect(results.map(r=>r.item.name).sort()).toEqual(['Close Quarters','Grit','Reactive Barrier','Rebuttal']);
    expect(results.every(r=>r.goal==='survive')).toBe(true);
    expect(results.find(r=>r.item.name==='Close Quarters')?.item.category).toBe('weapon');
  });
  it('changes DoT results to the applied-knife response',()=>{
    const results=run({problems:['dot']});
    expect(results.map(r=>r.item.name)).toEqual(['Dispel Magic']);
    expect(results[0].rules[0].conditions).toContain('Serrated Knives bleed is already applied.');
    expect(results[0].rules[0].limitation).toContain('Killing Blow');
  });
  it('aggregates healing denial only under punish and retains weapon utility for spirit builds',()=>{
    const results=run({problems:['sustain']});
    expect(results.map(r=>r.item.name)).toEqual(['Healbane','Toxic Bullets']);
    expect(results.every(r=>r.goal==='punish'&&r.coveredEnemyIds.length===2)).toBe(true);
    expect(results.flatMap(r=>r.rules).filter(r=>r.enemyHeroId==='hero-19').every(r=>r.conditions?.some(c=>c.includes('not healing')))).toBe(true);
  });
  it('does not extrapolate player or enemy coverage',()=>{
    expect(run({heroId:'hero-2'}).map(r=>r.item.name)).toContain('Debuff Reducer');
    expect(run({heroId:'hero-2',problems:['sustain']})).toEqual([]);
    expect(run({enemyHeroIds:['hero-12']})).toEqual([]);
    expect(run({enemyHeroIds:[]})).toEqual([]);
  });
  it('removes unavailable active responses without removing passive purchases',()=>{
    expect(run({allowActives:false}).map(r=>r.item.name)).toEqual(['Debuff Reducer','Reactive Barrier']);
    expect(run({responseWindow:'stunned-or-slept'}).map(r=>r.item.name)).toEqual(['Debuff Reducer','Reactive Barrier']);
    expect(run({responseWindow:'stunned-or-slept',problems:['dot']})).toEqual([]);
  });
  it('uses budget independently of stage and never assumes component credit',()=>{
    const board=recommendationBoard(reviewedCatalog,{...scenario,budget:10000},'control',weights,options);
    expect(board[0].results.map(r=>r.item.name)).toEqual(['Debuff Reducer','Reactive Barrier']);
    const results=run({ownedItemIds:['item-1047818222'],budget:4800});
    expect(results.map(r=>[r.item.name,r.affordable])).toEqual([['Reactive Barrier',true],['Unstoppable',false]]);
  });
  it('fails closed for another patch, expired review or future review date',()=>{
    for(const change of [{patch:'client-6786'},{asOf:'2026-11-14'},{asOf:'2026-10-14'}]) expect(recommend(reviewedCatalog,scenario,weights,{...options,...change})).toEqual([]);
    expect(()=>recommend(reviewedCatalog,scenario,weights,{...options,asOf:'bad-date'})).toThrow('Invalid evaluation date');
  });
  it('does not promote needs-review records with the source-reviewed option',()=>{
    const catalog=structuredClone(reviewedCatalog);
    catalog.rules.forEach(r=>r.evidence.status='needs-review');
    expect(recommend(catalog,scenario,weights,options)).toEqual([]);
  });
  it('requires conditions, scope, timing, stage rationale and expiry on source-reviewed records',()=>{
    for(const field of ['conditions','playerHeroIds','response','stageReason'] as const){
      const catalog=structuredClone(reviewedCatalog); delete catalog.rules[0][field];
      expect(()=>parseCatalog(catalog)).toThrow('Source-reviewed rule requires');
    }
    const catalog=structuredClone(reviewedCatalog); delete catalog.items[0].evidence.expiresAt;
    expect(()=>parseCatalog(catalog)).toThrow('requires expiry');
  });
  it('matches the pinned import and pauses on refresh, expiry or price drift',()=>{
    expect(reviewAvailability(game,'2026-10-16')).toBeNull();
    expect(reviewAvailability({...game,clientVersion:6786},'2026-10-16')).toContain('snapshot changed');
    expect(reviewAvailability(game,'2026-11-14')).toContain('expired');
    const changed=structuredClone(game); changed.items.find(i=>i.id===reviewedCatalog.items[0].id)!.cost++;
    expect(reviewAvailability(changed,'2026-10-16')).toContain('facts differ');
  });
  it('retains every current selectable hero without claiming complete recommendation coverage',()=>{
    expect(reviewedCatalog.heroes.map(h=>h.id).sort()).toEqual(game.heroes.filter(h=>h.selectable).map(h=>h.id).sort());
    expect(reviewedCatalog.manifest.coverage.completeRoster).toBe(false);
    expect(reviewedCatalog.items.some(i=>i.id.startsWith('demo-'))).toBe(false);
  });
});

describe('channel disruption and teammate rescue',()=>{
  const enemies=['hero-2','hero-11','hero-18'];
  it('aggregates only reviewed channel matchups under Disrupt across player builds',()=>{
    for(const heroId of ['hero-1','hero-3']){
      const results=run({heroId,build:'weapon',enemyHeroIds:enemies});
      expect(results.map(r=>r.item.name).sort()).toEqual(['Cursed Relic','Knockdown']);
      expect(results.every(r=>r.goal==='disrupt'&&r.coveredEnemyIds.length===3)).toBe(true);
    }
    expect(run({enemyHeroIds:enemies,problems:['burst']})).toEqual([]);
    expect(run({enemyHeroIds:enemies,problems:['sustain']})).toEqual([]);
  });
  it('withholds rescue actives when the player cannot act or excludes actives',()=>{
    for(const restriction of [{allowActives:false},{responseWindow:'stunned-or-slept' as const}])expect(run({enemyHeroIds:enemies,...restriction})).toEqual([]);
    for(const id of ['hero-11','hero-18']){
      const results=run({enemyHeroIds:[id],responseWindow:'can-act'});
      expect(results.every(r=>r.rules[0].conditions?.some(c=>c.includes('free teammate')&&c.includes('not the stunned victim')))).toBe(true);
    }
  });
  it('keeps short-channel delay, immunity and caster damage limits explicit',()=>{
    const results=run({enemyHeroIds:enemies});
    const knockdown=results.find(r=>r.item.name==='Knockdown')!;
    expect(knockdown.rules.every(r=>r.conditions?.some(c=>c.includes('2-second stun delay')))).toBe(true);
    expect(knockdown.rules.find(r=>r.enemyHeroId==='hero-11')!.timing).toContain('2.75s');
    expect(knockdown.rules.find(r=>r.enemyHeroId==='hero-18')!.timing).toContain('2.4s');
    expect(results.flatMap(r=>r.rules).every(r=>r.conditions?.some(c=>c.includes('excludes protected targets')))).toBe(true);
    expect(results.find(r=>r.item.name==='Cursed Relic')!.rules.every(r=>r.limitation.includes('own damage output is reduced'))).toBe(true);
    expect(results.some(r=>r.item.name==='Silence Wave')).toBe(false);
  });
  it('keeps stage, budget and ownership independent for channel purchases',()=>{
    const overrides={enemyHeroIds:enemies,budget:3200};
    expect(run({...overrides,stage:'lane'})).toEqual([]);
    const results=run(overrides);
    expect(results.find(r=>r.item.name==='Knockdown')!.affordable).toBe(true);
    expect(results.find(r=>r.item.name==='Cursed Relic')!.affordable).toBe(false);
    expect(run({...overrides,ownedItemIds:['item-1254091416']}).map(r=>r.item.name)).toEqual(['Cursed Relic']);
  });
});


describe('healing recipients and persistent damage',()=>{
  const enemies=['hero-66','hero-12','hero-8'];
  it('separates affordable anti-heal from damage protection across the new enemies',()=>{
    const sustain=run({enemyHeroIds:enemies,problems:['sustain']});
    expect(sustain.map(r=>r.item.name)).toEqual(['Healbane','Toxic Bullets']);
    expect(sustain.every(r=>r.goal==='punish'&&r.coveredEnemyIds.length===3)).toBe(true);
    expect(sustain.find(r=>r.item.name==='Healbane')!.affordable).toBe(true);
    expect(sustain.find(r=>r.item.name==='Toxic Bullets')!.affordable).toBe(false);
    const dot=run({enemyHeroIds:enemies,problems:['dot']});
    expect(dot.map(r=>r.item.name)).toEqual(['Spirit Shielding']);
    expect(dot[0].goal).toBe('survive');
    expect(dot[0].coveredEnemyIds).toHaveLength(3);
    expect(run({enemyHeroIds:enemies,problems:['burst']})).toEqual([]);
  });
  it('keeps Inhibitor objectives separate and does not sell it as an early emergency fix',()=>{
    for(const [problem,goal] of [['dot','survive'],['sustain','punish']] as const){
      for(const stage of ['lane','mid'] as const)expect(run({enemyHeroIds:['hero-66'],problems:[problem],stage}).some(r=>r.item.name==='Inhibitor')).toBe(false);
      const r=run({enemyHeroIds:['hero-66'],problems:[problem],stage:'late',budget:6400}).find(r=>r.item.name==='Inhibitor')!;
      expect(r.goal).toBe(goal);expect(r.affordable).toBe(true);expect(r.item.category).toBe('vitality');expect(r.item.activation).toBe('conditional');
      expect(r.rules[0].conditions?.join()).toContain('enough bullet hits');
      expect(r.rules[0].limitation).toContain('Shocking Reanimation');
      expect(run({enemyHeroIds:['hero-66'],problems:[problem],stage:'late',ownedItemIds:[r.item.id]}).some(row=>row.item.id===r.item.id)).toBe(false);
    }
  });
  it('limits healing delivery to reviewed player routes without restricting generic defenses',()=>{
    for(const heroId of ['hero-1','hero-12','hero-8'])expect(run({heroId,enemyHeroIds:['hero-66'],problems:['sustain'],allowActives:false}).map(r=>r.item.name)).toEqual(['Healbane','Toxic Bullets']);
    expect(run({heroId:'hero-66',enemyHeroIds:['hero-12'],problems:['sustain']}).map(r=>r.item.name)).toEqual(['Healbane','Toxic Bullets']);
    expect(run({heroId:'hero-13',enemyHeroIds:enemies,problems:['sustain']})).toEqual([]);
    expect(run({heroId:'hero-13',enemyHeroIds:enemies,problems:['dot']}).map(r=>r.item.name)).toEqual(['Spirit Shielding']);
    expect(run({heroId:'hero-12',problems:['sustain']})).toEqual([]); // Older Abrams/Shiv delivery remains Infernus-only.
  });
  it('requires recipient targeting and Kelvin purge reapplication, not healer-wide suppression',()=>{
    const results=run({enemyHeroIds:enemies,problems:['sustain']});
    for(const rule of results.flatMap(r=>r.rules)){
      expect(rule.conditions?.join()).toContain('healing recipient');
      if(rule.enemyHeroId==='hero-12'){
        expect(rule.conditions?.join()).toContain('reapplied');
        expect(rule.limitation).toContain('does not reduce healing received by his allies');
        expect(rule.limitation).toContain('does not open the dome');
      }
      if(rule.enemyHeroId==='hero-8')expect(rule.limitation).toContain('does not suppress her healing output');
      if(rule.enemyHeroId==='hero-66')expect(rule.limitation).toContain('Does not prevent Shocking Reanimation');
    }
  });
  it('keeps shield resistance behind its trigger, including the corrected existing rules',()=>{
    const rules=reviewedCatalog.rules.filter(r=>['item-112198670','item-805079544'].includes(r.itemId));
    expect(rules.length).toBeGreaterThanOrEqual(7);
    expect(rules.every(r=>r.mechanism.includes('not always on')&&r.timing.includes('Survive the trigger'))).toBe(true);
    expect(rules.every(r=>r.limitation.includes('conditional on the proc'))).toBe(true);
    const rockets=rules.find(r=>r.enemyHeroId==='hero-8')!;
    expect(rockets.conditions?.join()).toContain('Heavy Barrage');
    expect(rockets.limitation).toContain('turret damage triggering this item remains unreviewed');
    expect(rules.filter(r=>r.itemId==='item-805079544').every(r=>r.timing.includes('cooldown 35 seconds'))).toBe(true);
  });
});

describe('burst and expanded enemy boundaries',()=>{
  it('uses active defenses only while actionable, with passive options still present',()=>{
    const overrides:Partial<Scenario>={enemyHeroIds:['hero-13','hero-7'],problems:['burst']};
    expect(run(overrides).map(r=>r.item.name)).toEqual(expect.arrayContaining(['Metal Skin','Grit','Weapon Shielding','Reactive Barrier']));
    for(const restriction of [{allowActives:false},{responseWindow:'stunned-or-slept' as const}]){
      const results=run({...overrides,...restriction});
      expect(results.map(r=>r.item.name).sort()).toEqual(['Reactive Barrier','Weapon Shielding']);
    }
  });
  it('keeps reactive follow-up coverage scoped to explicit qualifying disables',()=>{
    const results=run({enemyHeroIds:['hero-6','hero-13','hero-7','hero-15','hero-19'],problems:['burst']});
    const reactive=results.find(r=>r.item.name==='Reactive Barrier')!;
    expect(reactive.coveredEnemyIds.sort()).toEqual(['hero-13','hero-6','hero-7']);
    expect(reactive.rules.every(r=>r.mechanism.includes('triggering')||r.mechanism.includes('triggers it'))).toBe(true);
    expect(reactive.rules.find(r=>r.enemyHeroId==='hero-7')?.conditions?.join()).toContain('silence');
    expect(reactive.rules.every(r=>r.limitation.includes('Does not remove or shorten control'))).toBe(true);
  });
  it('matches shield resistance to the reviewed damage pattern, not every hero attack',()=>{
    const bebop=run({enemyHeroIds:['hero-15'],problems:['burst']});
    expect(bebop.map(r=>r.item.name).sort()).toEqual(['Grit','Spirit Shielding']);
    expect(bebop.find(r=>r.item.name==='Spirit Shielding')?.rules[0].conditions?.join()).toContain('Sticky Bomb');
    const burn=run({heroId:'hero-2',enemyHeroIds:['hero-1'],problems:['dot']});
    expect(burn.map(r=>r.item.name).sort()).toEqual(['Dispel Magic','Spirit Shielding']);
    expect(run({heroId:'hero-2',enemyHeroIds:['hero-1'],problems:['burst']})).toEqual([]);
    expect(run({enemyHeroIds:['hero-13'],problems:['control']}).map(r=>r.item.name).sort()).toEqual(['Debuff Reducer','Reactive Barrier']);
  });
  it('preserves Metal Skin limits and editorial stage placement',()=>{
    const query={enemyHeroIds:['hero-13'],problems:['burst'] as Scenario['problems']};
    const skin=run(query).find(r=>r.item.name==='Metal Skin')!;
    expect(skin.rules[0].limitation).toContain('spirit damage');
    expect(skin.rules[0].limitation).toContain('melee immunity');
    expect(run({...query,stage:'lane'}).map(r=>r.item.name)).not.toContain('Metal Skin');
  });
  it('never discounts the barrier upgrade just because Grit is owned',()=>{
    const results=run({enemyHeroIds:['hero-13'],problems:['burst'],budget:800,ownedItemIds:['item-1672893796']});
    expect(results.some(r=>r.item.name==='Grit')).toBe(false);
    expect(results.filter(r=>['Reactive Barrier','Weapon Shielding'].includes(r.item.name)).map(r=>r.affordable)).toEqual([false,false]);
  });
  it('offers only the limited Grit buffer for Shiv burst, with an explicit execute exclusion',()=>{
    const results=run({enemyHeroIds:['hero-19'],problems:['burst']});
    expect(results.map(r=>r.item.name)).toEqual(['Grit']);
    expect(results[0].rules[0].limitation).toContain('Killing Blow execute');
    expect(run({problems:['escape']})).toEqual([]);
  });
});
