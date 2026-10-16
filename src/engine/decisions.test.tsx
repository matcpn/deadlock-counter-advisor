import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it } from 'vitest';
import { browseBoard, browseExplanations, type BrowsePreferences } from './browse';
import { reviewedCatalog as catalog } from '../data/reviewed';
import { parseCatalog } from '../domain/validate';
import { recommend } from './recommend';
import { AdviceBoard } from '../components/AdviceBoard';
import gameJson from '../data/game-catalog.json';
import type { GameSnapshot } from '../domain/game-data';

const targets=['hero-15','hero-1','hero-25','hero-4','hero-27'];
const options={patch:'client-6785',allowSourceReviewed:true,asOf:'2026-10-16'};
const preferences:BrowsePreferences={enemyHeroIds:targets,allowActives:true,ownedItemIds:[],responseWindow:'unknown'};
const board=(extra:Partial<BrowsePreferences>={})=>browseBoard(catalog,{...preferences,...extra},options);
const newRules=catalog.rules.filter(r=>r.id.startsWith('defining-'));

it('adds specific responses for the five thin heroes and guides every option in that batch',()=>{
  expect(newRules).toHaveLength(6);
  expect(new Set(newRules.map(r=>r.enemyHeroId))).toEqual(new Set(targets));
  for(const hero of targets){
    const rules=catalog.rules.filter(r=>r.enemyHeroId===hero);
    expect(new Set(rules.map(r=>r.itemId)).size).toBeGreaterThanOrEqual(3);
    expect(rules.every(r=>r.decision?.chooseWhen&&r.decision.tradeoff)).toBe(true);
  }
  const dis=board()[0].results.find(r=>r.item.name==='Dispel Magic');
  expect(dis).toBeUndefined(); // The 3,200-soul item belongs only in Mid.
  const mid=board()[1].results.find(r=>r.item.name==='Dispel Magic')!;
  const explanations=browseExplanations(mid);
  expect(explanations).toHaveLength(4);
  expect(explanations.find(e=>e.enemyIds.includes('hero-15'))?.decision?.tradeoff).toContain('still explodes');
  expect(explanations.find(e=>e.enemyIds.includes('hero-4'))?.decision?.tradeoff).toContain('Soul Exchange');
});

it('keeps decisions within eligible rules and retains passive choices when actions are impossible',()=>{
  for(const extra of [{allowActives:false},{responseWindow:'stunned-or-slept' as const}]){
    const results=board(extra).flatMap(c=>c.results);
    expect(results.some(r=>r.rules.some(rule=>rule.id==='defining-healbane-27'))).toBe(true);
    expect(results.every(r=>r.item.activation!=='active')).toBe(true);
  }
  const infernus=board({enemyHeroIds:['hero-1']}).flatMap(c=>c.results).flatMap(browseExplanations);
  expect(infernus.every(e=>e.enemyIds.every(id=>id==='hero-1'))).toBe(true);
  expect(JSON.stringify(infernus)).not.toContain('Sticky Bomb');
  const owned=board({ownedItemIds:['item-3731635960']});
  expect(owned.every(c=>c.results.every(r=>r.item.name!=='Dispel Magic'))).toBe(true);
  expect(browseBoard(catalog,preferences,{...options,asOf:'2026-11-14'}).every(c=>!c.results.length)).toBe(true);
});

it('does not broaden anti-heal player delivery or promise protection through excluded mechanics',()=>{
  const run=(heroId:string)=>recommend(catalog,{heroId,build:'spirit',enemyHeroIds:['hero-27'],stage:'mid',problems:['sustain'],budget:6400,ownedItemIds:[],allowActives:true},{strength:1,buildFit:1,extraEnemy:1},options);
  expect(run('hero-1').some(r=>r.rules.some(rule=>rule.id==='defining-healbane-27'))).toBe(true);
  expect(run('hero-13')).toEqual([]);
  expect(newRules.filter(r=>r.enemyHeroId==='hero-27').every(r=>r.limitation.includes('Shadow Transformation'))).toBe(true);
  expect(newRules.find(r=>r.enemyHeroId==='hero-1')?.limitation).toContain('cannot be interrupted once cast');
  expect(newRules.find(r=>r.enemyHeroId==='hero-25')?.limitation).toContain('second cage');
});

it('renders concise choices, keeps full mechanisms in details and preserves other heroes fallback advice',()=>{
  const html=renderToStaticMarkup(<AdviceBoard board={board({enemyHeroIds:['hero-15','hero-4','hero-50']})} catalog={catalog} game={gameJson as GameSnapshot}/>);
  expect(html).toContain('Choose when:');
  expect(html).toContain('The bomb still explodes on the ground.');
  expect(html).toContain('Life Drain is tethered to you');
  expect(html).toContain('Passive debuff resistance can shorten the remaining duration of Affliction.');
  expect(html).toContain('When to use, limits &amp; sources');
  expect(html).toContain('Dispel Magic detaches an applied Sticky Bomb');
  expect(html).not.toContain('Flame Dash');
});

it('requires both parts of a decision and deduplicates repeated guidance without losing enemies',()=>{
  const invalid=structuredClone(catalog);
  invalid.rules.find(r=>r.decision)!.decision!.tradeoff='';
  expect(()=>parseCatalog(invalid)).toThrow('decision.tradeoff');
  const result=board({enemyHeroIds:['hero-15']})[1].results.find(r=>r.item.name==='Dispel Magic')!;
  const repeated={...result,rules:[...result.rules,...result.rules]};
  expect(browseExplanations(repeated)).toEqual(browseExplanations(result));
});
