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
const options={patch:'client-6785',allowSourceReviewed:true,asOf:'2026-10-15'};
const scenario:Scenario={heroId:'hero-1',build:'spirit',enemyHeroIds:['hero-6','hero-19'],problems:['control'],stage:'mid',budget:1800,ownedItemIds:[],allowActives:true};
const run=(overrides:Partial<Scenario>={})=>recommend(reviewedCatalog,{...scenario,...overrides},weights,options);

describe('first source-reviewed slice',()=>{
  it('keeps source-reviewed advice out of verified-only evaluation',()=>expect(recommend(reviewedCatalog,scenario,weights,{...options,allowSourceReviewed:false})).toEqual([]));
  it('offers an affordable passive control response before an expensive active',()=>{
    const results=run();
    expect(results.map(r=>[r.item.name,r.affordable,r.goal])).toEqual([['Debuff Reducer',true,'survive'],['Unstoppable',false,'survive']]);
    expect(results.every(r=>r.coveredEnemyIds.join()==='hero-6')).toBe(true);
  });
  it('never substitutes anti-heal or stun reduction for immediate burst survival',()=>expect(run({problems:['burst']})).toEqual([]));
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
    expect(run({heroId:'hero-2'})).toEqual([]);
    expect(run({enemyHeroIds:['hero-2']})).toEqual([]);
    expect(run({enemyHeroIds:[]})).toEqual([]);
  });
  it('removes unavailable active responses without removing passive purchases',()=>{
    expect(run({allowActives:false}).map(r=>r.item.name)).toEqual(['Debuff Reducer']);
    expect(run({responseWindow:'stunned-or-slept'}).map(r=>r.item.name)).toEqual(['Debuff Reducer']);
    expect(run({responseWindow:'stunned-or-slept',problems:['dot']})).toEqual([]);
  });
  it('uses budget independently of stage and never assumes component credit',()=>{
    const board=recommendationBoard(reviewedCatalog,{...scenario,budget:10000},'control',weights,options);
    expect(board[0].results.map(r=>r.item.name)).toEqual(['Debuff Reducer']);
    const results=run({ownedItemIds:['item-1047818222'],budget:4800});
    expect(results.map(r=>[r.item.name,r.affordable])).toEqual([['Unstoppable',false]]);
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
    expect(reviewAvailability(game,'2026-10-15')).toBeNull();
    expect(reviewAvailability({...game,clientVersion:6786},'2026-10-15')).toContain('snapshot changed');
    expect(reviewAvailability(game,'2026-11-14')).toContain('expired');
    const changed=structuredClone(game); changed.items.find(i=>i.id===reviewedCatalog.items[0].id)!.cost++;
    expect(reviewAvailability(changed,'2026-10-15')).toContain('facts differ');
  });
  it('retains every current selectable hero without claiming complete recommendation coverage',()=>{
    expect(reviewedCatalog.heroes.map(h=>h.id).sort()).toEqual(game.heroes.filter(h=>h.selectable).map(h=>h.id).sort());
    expect(reviewedCatalog.manifest.coverage.completeRoster).toBe(false);
    expect(reviewedCatalog.items.some(i=>i.id.startsWith('demo-'))).toBe(false);
  });
});
