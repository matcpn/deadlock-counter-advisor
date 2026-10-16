import {describe,it,expect} from 'vitest';
import rawJson from '../../data/snapshots/client-6785/items.json';
import gameJson from '../data/game-catalog.json';
import seedsJson from '../../data/research/hero-threats.json';
import taxonomy from '../data/research-functions.json';
import inventoryJson from '../data/threat-inventory.json';
import {reviewedCatalog} from '../data/reviewed';
import {buildThreatInventory,buildCoverage,researchBacklog,type ThreatSeeds} from './research';
import type {GameSnapshot} from './game-data';
const game=gameJson as GameSnapshot;
const seeds=seedsJson as ThreatSeeds;
const rawAbilities=rawJson as Record<string,unknown>[];
const build=(snapshot=game,annotations=seeds)=>buildThreatInventory(snapshot,annotations,taxonomy,rawAbilities);
const coverage=(asOf='2026-10-16')=>buildCoverage(game,reviewedCatalog,asOf);

describe('source-traced all-hero inventory',()=>{
  it('reproduces the stored inventory with every selectable main ability and exact evidence spans',()=>{
    const inventory=build();
    expect(inventory).toEqual(inventoryJson);
    expect(inventory.heroes.map(h=>h.heroId)).toEqual(game.heroes.filter(h=>h.selectable).map(h=>h.id));
    expect(inventory.heroes.flatMap(h=>h.abilities)).toHaveLength(168);
    for(const hero of inventory.heroes)for(const a of hero.abilities){
      expect(a.status).toBe('triaged');
      for(const signal of a.signals)if(signal.source!=='properties')expect(a.description).toContain(signal.quote);
    }
  });
  it('preserves negations, self effects, damage-type gaps and unique mechanics',()=>{
    const inventory=build();
    const ability=(heroId:string,index:number)=>inventory.heroes.find(h=>h.heroId===heroId)!.abilities[index];
    const themes=(heroId:string,index:number)=>ability(heroId,index).signals.map(s=>s.functionId);
    expect(themes('hero-13',0)).toEqual(['sleep']); // Not an interrupt.
    expect(themes('hero-78',1)).not.toContain('stun'); // Self-stun on a missed dive.
    expect(themes('hero-66',1)).not.toContain('spirit'); // Self-damage only.
    expect(themes('hero-19',2)).toEqual(['defense']); // Deferral, not healing.
    expect(themes('hero-4',0)).toContain('unknown-damage');
    expect(themes('hero-4',0)).not.toContain('spirit');
    expect(themes('hero-3',3)).not.toContain('execute');
    expect(ability('hero-76',3).gaps.length).toBeGreaterThan(0);
    expect(ability('hero-80',3).gaps.join()).toContain('Transformed');
  });
  it('withholds all old classifications after a client change',()=>{
    const inventory=build({...game,clientVersion:6786});
    expect(inventory.heroes.flatMap(h=>h.abilities).every(a=>a.status==='needs-review'&&!a.signals.length)).toBe(true);
  });
  it('withholds only the changed ability for same-client text drift',()=>{
    const changed=structuredClone(game),hero=changed.heroes.find(h=>h.id==='hero-6')!;
    hero.abilities[0].description+=' Changed behavior.';
    const abilities=build(changed).heroes.find(h=>h.heroId===hero.id)!.abilities;
    expect(abilities[0].signals).toEqual([]);
    expect(abilities[0].status).toBe('needs-review');
    expect(abilities[1].status).toBe('triaged');
  });
  it('uses raw damage markers and channel flags without inferring from scaling alone',()=>{
    const inventory=build();
    const seven=inventory.heroes.find(h=>h.heroId==='hero-2')!;
    for(const index of [0,2,3]){
      expect(seven.abilities[index].signals).toContainEqual(expect.objectContaining({functionId:'spirit',source:'properties'}));
      expect(seven.abilities[index].signals.some(s=>s.functionId==='unknown-damage')).toBe(false);
      expect(seven.abilities[index].gaps).toEqual([]);
    }
    expect(inventory.heroes.find(h=>h.heroId==='hero-11')!.abilities[3].signals).toContainEqual(expect.objectContaining({functionId:'channel',source:'properties'}));
  });
  it('withholds classifications when property evidence is missing, duplicated or changed',()=>{
    const changed=structuredClone(rawAbilities);
    const ball=changed.find(r=>r.class_name==='citadel_ability_lightning_ball')!;
    (ball.properties as Record<string,Record<string,unknown>>).DPS.icon='different-icon.svg';
    for(const records of [[],changed,[...rawAbilities,rawAbilities.find(r=>r.class_name==='citadel_ability_lightning_ball')!]]){
      const seven=buildThreatInventory(game,seeds,taxonomy,records).heroes.find(h=>h.heroId==='hero-2')!;
      expect(seven.abilities[0].status).toBe('needs-review');
      expect(seven.abilities[0].signals).toEqual([]);
      expect(seven.abilities[1].status).toBe('triaged');
    }
    const invalid=structuredClone(seeds);
    invalid.profiles.find(p=>p.heroId==='hero-2')!.abilities[0].propertySignals![0].facts=[];
    expect(()=>build(game,invalid)).toThrow('Invalid property evidence');
  });
  it('traces movement eligibility and Sinclair damage type without certifying recasts or copied kits',()=>{
    const inventory=build();
    const ability=(hero:string,cls:string)=>inventory.heroes.find(h=>h.heroId===hero)!.abilities.find(a=>a.className===cls)!;
    expect(ability('hero-16','ability_nano_shadow_pulse').signals).toContainEqual(expect.objectContaining({functionId:'mobility',source:'properties'}));
    expect(ability('hero-60','ability_magician_magicbolt').signals).toContainEqual(expect.objectContaining({functionId:'spirit',source:'properties'}));
    const changed=structuredClone(rawAbilities),sigil=changed.find(r=>r.class_name==='ability_fencer_throwblade')!;
    sigil.behaviours=(sigil.behaviours as string[]).filter(b=>!b.endsWith('_MOVEMENT'));
    expect(buildThreatInventory(game,seeds,taxonomy,changed).heroes.find(h=>h.heroId==='hero-77')!.abilities[0].status).toBe('needs-review');
  });
  it('adds unknown heroes/abilities without copying another kit and records retired heroes',()=>{
    const changed=structuredClone(game),added={...structuredClone(changed.heroes[0]),id:'hero-9999',sourceId:9999,name:'New source hero',selectable:true};
    changed.heroes.push(added);
    changed.heroes.find(h=>h.id==='hero-6')!.selectable=false;
    const inventory=build(changed);
    expect(inventory.heroes.find(h=>h.heroId===added.id)!.abilities.every(a=>a.status==='untriaged'&&!a.signals.length)).toBe(true);
    expect(inventory.retiredHeroIds).toContain('hero-6');
  });
  it('traces Power Slash spirit damage to raw markers and withholds it after marker drift',()=>{
    expect(build().heroes.find(h=>h.heroId==='hero-27')!.abilities[0].signals).toContainEqual(expect.objectContaining({functionId:'spirit',source:'properties'}));
    const changed=structuredClone(rawAbilities),slash=changed.find(r=>r.class_name==='citadel_ability_power_slash')!;
    (slash.properties as Record<string,Record<string,unknown>>).FullChargeDamage.css_class='weapon_damage';
    const ability=buildThreatInventory(game,seeds,taxonomy,changed).heroes.find(h=>h.heroId==='hero-27')!.abilities[0];
    expect(ability.status).toBe('needs-review');
    expect(ability.signals).toEqual([]);
  });
  it('rejects invented evidence, unknown functions and duplicate identities',()=>{
    for(const mutation of [
      (s:ThreatSeeds)=>{s.profiles[0].abilities[0].signals[0].quote='invented text';},
      (s:ThreatSeeds)=>{s.profiles[0].abilities[0].signals[0].functionId='universal-counter';},
      (s:ThreatSeeds)=>{s.profiles.push(s.profiles[0]);}
    ]){const changed=structuredClone(seeds);mutation(changed);expect(()=>build(game,changed)).toThrow();}
  });
});

describe('coverage and research are not recommendation generation',()=>{
  it('reports all problem cells but all enemies with partial reviewed advice',()=>{
    const matrix=coverage();
    expect(matrix).toHaveLength(42);
    expect(matrix.flatMap(h=>h.cells)).toHaveLength(210);
    expect(matrix.filter(h=>h.cells.some(c=>c.ruleIds.length))).toHaveLength(42);
    expect(matrix.find(h=>h.heroId==='hero-3')!.cells.filter(c=>['dot','sustain'].includes(c.problem)).every(c=>c.status==='needs-research')).toBe(true);
    expect(matrix.flatMap(h=>h.cells).filter(c=>c.ruleIds.length).every(c=>c.status==='conditional')).toBe(true);
    expect(matrix.find(h=>h.heroId==='hero-2')!.cells.find(c=>c.problem==='control')!.goals).toEqual(['disrupt']);
  });
  it('distinguishes scope, objective and stages from a blanket hero counter',()=>{
    const abrams=coverage().find(h=>h.heroId==='hero-6')!;
    expect(abrams.cells.find(c=>c.problem==='sustain')!.playerHeroIds).toEqual(['hero-1']);
    expect(abrams.cells.find(c=>c.problem==='sustain')!.goals).toEqual(['punish']);
    expect(abrams.cells.find(c=>c.problem==='burst')!.playerHeroIds).toHaveLength(41);
    const haze=coverage().find(h=>h.heroId==='hero-13')!.cells.find(c=>c.problem==='burst')!;
    expect(haze.stages.mid).toBeGreaterThan(haze.stages.lane);
  });
  it('changes expired, future, patch-mismatched and drifted coverage to needs-review',()=>{
    for(const asOf of ['2026-11-14','2026-10-14'])expect(coverage(asOf).flatMap(h=>h.cells).some(c=>c.ruleIds.length)).toBe(false);
    const changed=structuredClone(game);changed.items.find(i=>i.id===reviewedCatalog.items[0].id)!.cost++;
    for(const snapshot of [changed,{...game,clientVersion:6786}]){
      const matrix=buildCoverage(snapshot,reviewedCatalog,'2026-10-16');
      expect(matrix.flatMap(h=>h.cells).every(c=>!c.ruleIds.length)).toBe(true);
      expect(matrix.find(h=>h.heroId==='hero-6')!.cells.find(c=>c.problem==='burst')!.status).toBe('needs-review');
    }
    expect(()=>coverage('2026-02-30')).toThrow('Invalid coverage date');
  });
  it('never counts demo or needs-review records as available coverage',()=>{
    for(const status of ['demo','needs-review'] as const){
      const changed=structuredClone(reviewedCatalog);changed.rules.forEach(r=>r.evidence.status=status);
      expect(buildCoverage(game,changed,'2026-10-16').flatMap(h=>h.cells).every(c=>!c.ruleIds.length)).toBe(true);
    }
  });
  it('produces a deterministic reusable queue without mutating or inventing rules',()=>{
    const before=structuredClone(reviewedCatalog),matrix=coverage();
    const backlog=researchBacklog(build(),matrix,taxonomy);
    expect(backlog).toEqual(researchBacklog(build(),matrix,taxonomy));
    expect(backlog.find(f=>f.functionId==='channel')!.occurrences.some(o=>o.heroId==='hero-2')).toBe(true);
    expect(backlog.every((f,i)=>i===0||backlog[i-1].uncoveredHeroCount>=f.uncoveredHeroCount)).toBe(true);
    expect(reviewedCatalog).toEqual(before);
    expect(reviewedCatalog.rules).toHaveLength(111);
  });
});
