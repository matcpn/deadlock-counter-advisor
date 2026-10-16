import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect,it } from 'vitest';
import { groupAdvice } from './advice-groups';
import { browseBoard } from './browse';
import { reviewedCatalog as catalog } from '../data/reviewed';
import profiles from '../data/advice-groups.json';
import gameJson from '../data/game-catalog.json';
import type { GameSnapshot } from '../domain/game-data';
import { AdviceBoard } from '../components/AdviceBoard';
const options={patch:'client-6785',allowSourceReviewed:true,asOf:'2026-10-16'};
const preferences={enemyHeroIds:['hero-6'],allowActives:true,ownedItemIds:[],responseWindow:'unknown' as const};
const board=browseBoard(catalog,preferences,options);

it('places all eight Abrams items once in their price tiers and keeps deliberate comparisons',()=>{
  const ids=profiles[0].groups.flatMap(g=>g.itemIds);
  expect(new Set(ids).size).toBe(ids.length);
  expect(new Set(ids)).toEqual(new Set(catalog.rules.filter(r=>r.enemyHeroId==='hero-6').map(r=>r.itemId)));
  for(const column of board){
    const groups=groupAdvice(column.results,'hero-6')!;
    const flattened=groups.flatMap(g=>g.results);
    expect(flattened.map(r=>r.item.id).sort()).toEqual(column.results.map(r=>r.item.id).sort());
    expect(flattened.every(r=>column.results.includes(r))).toBe(true); // Keep full rule/player scope.
  }
  expect(groupAdvice(board[0].results,'hero-6')![0].results.map(r=>r.item.name)).toEqual(['Debuff Reducer','Reactive Barrier','Grit']);
  expect(groupAdvice(board[0].results,'hero-6')![1].results.map(r=>r.item.name)).toEqual(['Rebuttal','Close Quarters']);
  expect(groupAdvice(board[0].results,'hero-6')![2].results.map(r=>r.item.name)).toEqual(['Healbane']);
  expect(groupAdvice(board[1].results,'hero-6')!.map(g=>[g.id,g.results.map(r=>r.item.name)])).toEqual([['healing',['Toxic Bullets']]]);
  expect(groupAdvice(board[2].results,'hero-6')!.map(g=>[g.id,g.results.map(r=>r.item.name)])).toEqual([['stun-setup',['Unstoppable']]]);
});

it('does not group other or mixed selections, resurrect filtered results, or hide future items',()=>{
  expect(groupAdvice(board[1].results)).toBeNull();
  expect(groupAdvice(board[1].results,'hero-19')).toBeNull();
  const mixed=browseBoard(catalog,{...preferences,enemyHeroIds:['hero-6','hero-19']},options);
  expect(groupAdvice(mixed[1].results,'hero-6')).toBeNull();
  const filtered=browseBoard(catalog,{...preferences,allowActives:false,ownedItemIds:['item-1047818222']},options);
  const groups=groupAdvice(filtered[0].results,'hero-6')!;
  expect(groups.flatMap(g=>g.results).every(r=>r.item.activation!=='active'&&r.item.id!=='item-1047818222')).toBe(true);
  expect(groupAdvice([], 'hero-6')).toEqual([]);
  const future={...board[1].results[0],item:{...board[1].results[0].item,id:'synthetic-unmapped-item'}};
  expect(groupAdvice([...board[1].results,future],'hero-6')!.at(-1)?.results).toEqual([future]);
});

it('renders compact closed problem rows and two primary cards with overflow while keeping evidence',()=>{
  const html=renderToStaticMarkup(<AdviceBoard board={[board[0]]} catalog={catalog} game={gameJson as GameSnapshot} focusHeroId="hero-6"/>);
  expect((html.match(/class="problem-group"/g)||[]).length).toBe(3);
  expect(html).toContain('His stun sets up the kill');
  expect(html).toContain('His melee hits hurt too much');
  expect(html).toContain('He keeps healing through our damage');
  expect(html).toContain('More options (1)');
  expect(html).toContain('800 / 1,600 souls');
  expect(html).not.toContain('<details class="problem-group" open');
  expect(html).toContain('application reviewed for Infernus');
  expect(html).toContain('When to use, limits &amp; sources');
  const regular=renderToStaticMarkup(<AdviceBoard board={[board[1]]} catalog={catalog} game={gameJson as GameSnapshot}/>);
  expect(regular).not.toContain('class="problem-group"');
});
