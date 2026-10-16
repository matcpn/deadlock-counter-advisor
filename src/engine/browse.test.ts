import { expect, it } from 'vitest';
import { browseBoard, type BrowsePreferences } from './browse';
import { reviewedCatalog } from '../data/reviewed';
import { demoCatalog } from '../data/demo';

const options={patch:'client-6785',allowSourceReviewed:true,asOf:'2026-10-16'};
const preferences:BrowsePreferences={enemyHeroIds:['hero-6','hero-19'],allowActives:true,ownedItemIds:[],responseWindow:'unknown'};
it('combines problems and objectives into one item while retaining every scoped rule',()=>{
  const board=browseBoard(reviewedCatalog,preferences,options);
  for(const column of board){
    expect(new Set(column.results.map(r=>r.item.id)).size).toBe(column.results.length);
    const expected=reviewedCatalog.rules.filter(r=>preferences.enemyHeroIds.includes(r.enemyHeroId)&&r.stages.includes(column.stage));
    expect(column.results.flatMap(r=>r.rules.map(rule=>rule.id)).sort()).toEqual(expected.map(r=>r.id).sort());
    expect(column.results.map(r=>r.item.cost)).toEqual(column.results.map(r=>r.item.cost).sort((a,b)=>a-b));
  }
  const scoped=board.flatMap(c=>c.results).flatMap(r=>r.rules).find(r=>r.playerHeroIds?.length===1);
  expect(scoped?.playerHeroIds).toEqual(['hero-1']);
});
it('allows Infernus as an enemy without a hidden player selection',()=>{
  const board=browseBoard(reviewedCatalog,{...preferences,enemyHeroIds:['hero-1']},options);
  expect(board.some(c=>c.results.length)).toBe(true);
  expect(board.flatMap(c=>c.results).every(r=>r.coveredEnemyIds.every(id=>id==='hero-1'))).toBe(true);
});
it('preserves ownership, active and response filters without budget claims',()=>{
  const base=browseBoard(reviewedCatalog,preferences,options);
  const owned=base[0].results[0].item.id;
  const filtered=browseBoard(reviewedCatalog,{...preferences,allowActives:false,ownedItemIds:[owned],responseWindow:'stunned-or-slept'},options);
  expect(filtered.some(c=>c.results.length)).toBe(true);
  for(const r of filtered.flatMap(c=>c.results)){
    expect(r.item.id).not.toBe(owned);
    expect(r.item.activation).not.toBe('active');
    expect(r.rules.every(rule=>rule.response==='passive')).toBe(true);
    expect(r).not.toHaveProperty('affordable');
  }
});
it('keeps expired, mismatched and synthetic evidence out of the browse board',()=>{
  for(const config of [{...options,asOf:'2026-11-14'},{...options,patch:'client-other'}])
    expect(browseBoard(reviewedCatalog,preferences,config).every(c=>!c.results.length)).toBe(true);
  expect(browseBoard(demoCatalog,{...preferences,enemyHeroIds:['abrams']},options).every(c=>!c.results.length)).toBe(true);
  expect(browseBoard(reviewedCatalog,{...preferences,enemyHeroIds:[]},options).every(c=>!c.results.length)).toBe(true);
});
