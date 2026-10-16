import {describe,it,expect} from 'vitest';
import gameJson from '../data/game-catalog.json';
import seedsJson from '../../data/research/hero-threats.json';
import taxonomy from '../data/research-functions.json';
import inventoryJson from '../data/threat-inventory.json';
import {reviewedCatalog} from '../data/reviewed';
import {buildThreatInventory,buildCoverage,researchBacklog,type ThreatSeeds} from './research';
import type {GameSnapshot} from './game-data';
const game=gameJson as GameSnapshot;
const seeds=seedsJson as ThreatSeeds;
const build=(snapshot=game,annotations=seeds)=>buildThreatInventory(snapshot,annotations,taxonomy);
const coverage=(asOf='2026-10-15')=>buildCoverage(game,reviewedCatalog,asOf);

describe('source-traced all-hero inventory',()=>{
  it('reproduces the stored inventory with every selectable main ability and exact evidence spans',()=>{
    const inventory=build();
    expect(inventory).toEqual(inventoryJson);
    expect(inventory.heroes.map(h=>h.heroId)).toEqual(game.heroes.filter(h=>h.selectable).map(h=>h.id));
    expect(inventory.heroes.flatMap(h=>h.abilities)).toHaveLength(168);
    for(const hero of inventory.heroes)for(const a of hero.abilities){
      expect(a.status).toBe('triaged');
      for(const signal of a.signals)expect(a.description).toContain(signal.quote);
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
  it('adds unknown heroes/abilities without copying another kit and records retired heroes',()=>{
    const changed=structuredClone(game),added={...structuredClone(changed.heroes[0]),id:'hero-9999',sourceId:9999,name:'New source hero',selectable:true};
    changed.heroes.push(added);
    changed.heroes.find(h=>h.id==='hero-6')!.selectable=false;
    const inventory=build(changed);
    expect(inventory.heroes.find(h=>h.heroId===added.id)!.abilities.every(a=>a.status==='untriaged'&&!a.signals.length)).toBe(true);
    expect(inventory.retiredHeroIds).toContain('hero-6');
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
  it('reports all problem cells but only six enemies with partial reviewed advice',()=>{
    const matrix=coverage();
    expect(matrix).toHaveLength(42);
    expect(matrix.flatMap(h=>h.cells)).toHaveLength(210);
    expect(matrix.filter(h=>h.cells.some(c=>c.ruleIds.length))).toHaveLength(6);
    expect(matrix.find(h=>h.heroId==='hero-2')!.cells.every(c=>c.status==='needs-research')).toBe(true);
    expect(matrix.flatMap(h=>h.cells).filter(c=>c.ruleIds.length).every(c=>c.status==='conditional')).toBe(true);
    expect(matrix.flatMap(h=>h.cells).every(c=>!c.goals.includes('disrupt'))).toBe(true);
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
      const matrix=buildCoverage(snapshot,reviewedCatalog,'2026-10-15');
      expect(matrix.flatMap(h=>h.cells).every(c=>!c.ruleIds.length)).toBe(true);
      expect(matrix.find(h=>h.heroId==='hero-6')!.cells.find(c=>c.problem==='burst')!.status).toBe('needs-review');
    }
    expect(()=>coverage('2026-02-30')).toThrow('Invalid coverage date');
  });
  it('never counts demo or needs-review records as available coverage',()=>{
    for(const status of ['demo','needs-review'] as const){
      const changed=structuredClone(reviewedCatalog);changed.rules.forEach(r=>r.evidence.status=status);
      expect(buildCoverage(game,changed,'2026-10-15').flatMap(h=>h.cells).every(c=>!c.ruleIds.length)).toBe(true);
    }
  });
  it('produces a deterministic reusable queue without mutating or inventing rules',()=>{
    const before=structuredClone(reviewedCatalog),matrix=coverage();
    const backlog=researchBacklog(build(),matrix,taxonomy);
    expect(backlog).toEqual(researchBacklog(build(),matrix,taxonomy));
    expect(backlog.find(f=>f.functionId==='channel')!.occurrences.some(o=>o.heroId==='hero-2')).toBe(true);
    expect(backlog.every((f,i)=>i===0||backlog[i-1].uncoveredHeroCount>=f.uncoveredHeroCount)).toBe(true);
    expect(reviewedCatalog).toEqual(before);
    expect(reviewedCatalog.rules).toHaveLength(25);
  });
});
