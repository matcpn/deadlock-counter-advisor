import { expect, it } from 'vitest';
import gameJson from '../data/game-catalog.json';
import pass from '../../data/research/item-depth-pass.json';
import { reviewedCatalog } from '../data/reviewed';
import type { GameSnapshot } from '../domain/game-data';
import { buildCoverage, itemDepth, hasBuildCoverage } from '../domain/research';
import { browseBoard } from './browse';
import { recommend } from './recommend';
import { weights } from '../data/demo';
import type { Scenario } from '../domain/types';

const game=gameJson as GameSnapshot;
const options={patch:'client-6785',allowSourceReviewed:true,asOf:'2026-10-16'};
const depth=()=>itemDepth(buildCoverage(game,reviewedCatalog,options.asOf),reviewedCatalog);
const rule=(id:string)=>reviewedCatalog.rules.find(r=>r.id===id)!;
const run=(enemy:string,problem:Scenario['problems'][number],extra:Partial<Scenario>={})=>recommend(reviewedCatalog,{heroId:'hero-1',build:'hybrid',enemyHeroIds:[enemy],problems:[problem],stage:'mid',budget:3200,ownedItemIds:[],allowActives:true,...extra},weights,options);

it('requires green or both purple and orange, not two items of the same color',()=>{
  expect(hasBuildCoverage(['vitality'])).toBe(true);
  expect(hasBuildCoverage(['spirit','weapon'])).toBe(true);
  for(const colors of [[],['spirit'],['weapon'],['spirit','spirit']] as Parameters<typeof hasBuildCoverage>[0][])
    expect(hasBuildCoverage(colors)).toBe(false);
  expect(depth().every(h=>h.buildCovered)).toBe(true);
  expect(itemDepth(buildCoverage(game,reviewedCatalog,'2026-11-14'),reviewedCatalog).every(h=>!h.buildCovered)).toBe(true);
});
it('offers passive green protection for the three formerly purple-only enemies without claiming escape',()=>{
  for(const [hero,item] of [['hero-2','Spirit Shielding'],['hero-11','Reactive Barrier'],['hero-18','Reactive Barrier']]){
    for(const build of ['weapon','spirit'] as const){
      const board=browseBoard(reviewedCatalog,{enemyHeroIds:[hero],allowActives:false,ownedItemIds:[],responseWindow:'stunned-or-slept'},options);
      expect(board.every(c=>c.results.some(r=>r.item.name===item&&r.item.category==='vitality'))).toBe(true);
      expect(run(hero,hero==='hero-2'?'dot':'control',{build,allowActives:false,responseWindow:'stunned-or-slept'}).some(r=>r.item.name===item&&r.goal==='survive')).toBe(true);
    }
  }
  expect(rule('color-reactive-11').limitation).toContain('Kinetic Pulse knockup is excluded');
  expect(rule('color-reactive-18').limitation).toContain('not an escape');
  expect(rule('color-spirit-2').limitation).toContain('Does not interrupt Storm Cloud');
});

it('every selectable hero has at least two distinct eligible items in the actual browse view',()=>{
  expect(depth()).toHaveLength(42);
  for(const h of depth()){
    expect(h.count,h.heroId).toBeGreaterThanOrEqual(2);
    const board=browseBoard(reviewedCatalog,{enemyHeroIds:[h.heroId],allowActives:true,ownedItemIds:[],responseWindow:'unknown'},options);
    expect([...new Set(board.flatMap(c=>c.results.map(r=>r.item.id)))].sort(),h.heroId).toEqual(h.itemIds);
  }
  expect(pass.targets).toHaveLength(19);
  for(const t of pass.targets){
    expect(t.previousItemIds).toHaveLength(1);
    expect(t.addedRuleIds).toHaveLength(1);
    expect(t.previousItemIds).not.toContain(rule(t.addedRuleIds[0]).itemId);
    expect(rule(t.addedRuleIds[0]).enemyHeroId).toBe(t.heroId);
  }
});
it('counts repeated rules across problems and stages only once and withholds stale options',()=>{
  const coverage=buildCoverage(game,reviewedCatalog,options.asOf);
  const baba=coverage.find(h=>h.heroId==='hero-88')!;
  expect(baba.cells.flatMap(c=>c.ruleIds).length).toBeGreaterThan(2);
  expect(depth().find(h=>h.heroId==='hero-88')!.count).toBe(2);
  expect(itemDepth(buildCoverage(game,reviewedCatalog,'2026-11-14'),reviewedCatalog).every(h=>h.count===0&&h.needsResearch)).toBe(true);
  const changed=structuredClone(game);changed.items.find(i=>i.name==='Debuff Reducer')!.cost++;
  expect(itemDepth(buildCoverage(changed,reviewedCatalog,options.asOf),reviewedCatalog).every(h=>h.count===0)).toBe(true);
});
it('keeps passive duration reduction separate from cleanse and damage prevention',()=>{
  expect(run('hero-50','dot').map(r=>r.item.name)).toEqual(['Debuff Reducer']);
  expect(run('hero-79','control',{responseWindow:'stunned-or-slept'}).some(r=>r.item.name==='Debuff Reducer')).toBe(true);
  expect(rule('depth-duration-79').limitation).toContain('wake-up spirit damage');
  expect(rule('depth-duration-25').limitation).toContain('Does not extend the initial escape timer');
  expect(rule('depth-duration-10').limitation).toContain('Does not shorten Kinetic Carbine');
  expect(rule('depth-duration-60').limitation).toContain('copied ultimate');
});
it('requires actionable removal after a debuff and before its damage resolves',()=>{
  for(const [enemy,problem] of [['hero-80','control'],['hero-58','burst']] as const){
    expect(run(enemy,problem).some(r=>r.item.name==='Dispel Magic')).toBe(true);
    for(const extra of [{responseWindow:'stunned-or-slept' as const},{stage:'lane' as const},{allowActives:false},{ownedItemIds:['item-3731635960']}])
      expect(run(enemy,problem,extra).some(r=>r.item.name==='Dispel Magic')).toBe(false);
  }
  expect(rule('depth-dispel-58').limitation).toContain('Activation while Petrified is not certified');
});
it('distinguishes named disable triggers from other abilities and keeps damage types bounded',()=>{
  expect(rule('depth-reactive-88').limitation).toContain('Feed The Birds is excluded');
  expect(rule('depth-reactive-31').limitation).toContain('Ground Strike knockup alone is excluded');
  expect(rule('depth-reactive-69').limitation).toContain('wall-stun upgrade');
  expect(rule('depth-reactive-35').limitation).toContain('Puddle Punch knockup alone');
  expect(rule('depth-spirit-72').limitation).toContain('melee slam');
  expect(rule('depth-spirit-27').limitation).toContain('Flying Slash melee');
  expect(rule('depth-weapon-65').limitation).toContain('pure damage');
  expect(rule('depth-bullets-84').limitation).toContain('Does not reflect bullets');
  expect(run('hero-84','burst',{allowActives:false}).some(r=>r.item.name==='Metal Skin')).toBe(false);
});
