import { describe, expect, it } from 'vitest';
import { demoCatalog, weights } from '../data/demo';
import type { Catalog, Scenario } from './types';
import { parseCatalog } from './validate';
import { recommend } from '../engine/recommend';

const scenario: Scenario = {heroId:'infernus',build:'spirit',enemyHeroIds:['abrams'],problems:['burst'],stage:'mid',budget:1800,ownedItemIds:[],allowActives:true};
const copy = () => structuredClone(demoCatalog);
// Entirely synthetic verification metadata tests the release gate, not game facts.
function productionFixture(): Catalog {
  const c = copy();
  c.manifest.kind = 'production'; c.manifest.gamePatchId = 'test-patch';
  c.manifest.sources = [{id:'test',url:'https://example.com/test',title:'Synthetic test protocol',accessedAt:'2026-10-11'}];
  for (const entity of [...c.items, ...c.rules]) entity.evidence = {status:'verified',patch:'test-patch',sourceUrls:['https://example.com/test'],reviewedAt:'2026-10-11',reviewer:'Test fixture',note:'Synthetic test only',claims:['cost','category','activation','components','interaction','timing','limitations']};
  return c;
}
describe('catalog import and release boundary', () => {
  it('loads the explicitly synthetic catalog', () => expect(parseCatalog(copy()).manifest.kind).toBe('demo'));
  it.each([null, {}, {manifest:[]}, {manifest:{schemaVersion:2}}])('rejects malformed input %j', value => expect(()=>parseCatalog(value)).toThrow());
  it('rejects duplicate IDs', () => {const c=copy(); c.items.push(c.items[0]); expect(()=>parseCatalog(c)).toThrow('Duplicate ID');});
  it('rejects dangling rule references', () => {const c=copy(); c.rules[0].itemId='missing'; expect(()=>parseCatalog(c)).toThrow('Unresolved reference');});
  it.each([-1, NaN, Infinity, 1.5])('rejects invalid costs %s', cost => {const c=copy(); c.items[0].cost=cost; expect(()=>parseCatalog(c)).toThrow();});
  it('rejects unknown enums', () => {const c=copy(); Object.assign(c.items[0],{category:'unknown'}); expect(()=>parseCatalog(c)).toThrow('Invalid enum');});
  it('rejects missing upgrade components', () => {const c=copy(); c.items[0].componentIds=['missing']; expect(()=>parseCatalog(c)).toThrow('Unresolved reference');});
  it('rejects cyclic upgrades', () => {const c=copy(); c.items[0].componentIds=[c.items[1].id]; c.items[1].componentIds=[c.items[0].id]; expect(()=>parseCatalog(c)).toThrow('Upgrade cycle');});
  it('rejects synthetic evidence in production', () => {const c=copy(); c.manifest.kind='production'; expect(()=>parseCatalog(c)).toThrow('Synthetic evidence');});
  it('rejects verified claims without provenance', () => {const c=productionFixture(); c.rules[0].evidence.sourceUrls=[]; expect(()=>parseCatalog(c)).toThrow('incomplete');});
  it('requires interaction evidence beyond an item page', () => {const c=productionFixture(); c.rules[0].evidence.claims=['cost']; expect(()=>parseCatalog(c)).toThrow('incomplete');});
  it('requires source manifest membership', () => {const c=productionFixture(); c.manifest.sources=[]; expect(()=>parseCatalog(c)).toThrow('Source absent');});
  it('rejects unsafe source URLs', () => {const c=productionFixture(); c.manifest.sources[0].url='javascript:alert(1)'; expect(()=>parseCatalog(c)).toThrow('HTTP');});
  it('rejects impossible review dates', () => {const c=productionFixture(); c.rules[0].evidence.reviewedAt='2026-02-30'; expect(()=>parseCatalog(c)).toThrow('calendar date');});
  it('rejects stale evidence still labeled verified', () => {const c=productionFixture(); c.rules[0].evidence.patch='old-patch'; expect(()=>parseCatalog(c)).toThrow('patch differs');});
  it('allows needs-review records but excludes them from advice', () => {const c=productionFixture(); c.items[0].evidence.status='needs-review'; c.items[0].evidence.patch='old-patch'; expect(recommend(c,scenario,weights,{patch:'test-patch'}).some(r=>r.item.id===c.items[0].id)).toBe(false);});
  it('requires explicit matching production patch', () => {const c=productionFixture(); expect(recommend(c,scenario,weights)).toEqual([]); expect(recommend(c,scenario,weights,{patch:'other'})).toEqual([]); expect(recommend(c,scenario,weights,{patch:'test-patch'})).toHaveLength(2);});
  it.each([{enemyHeroIds:['infernus']},{enemyHeroIds:['abrams','abrams']},{ownedItemIds:['unknown']},{stage:'unknown'},{budget:1.5},{allowActives:'yes'}])('rejects impossible scenario %j', change => expect(()=>recommend(copy(),{...scenario,...change} as Scenario,weights,{demo:true})).toThrow());
  it('rejects invalid scoring configuration', () => expect(()=>recommend(copy(),scenario,{...weights,strength:NaN},{demo:true})).toThrow('weights'));
});

