import { expect, it } from 'vitest';
import { recommendationBoard } from './board';
import { demoCatalog, weights } from '../data/demo';
import type { Scenario } from '../domain/types';
const scenario:Scenario={heroId:'infernus',build:'spirit',enemyHeroIds:['abrams','shiv'],stage:'mid',problems:['burst'],budget:1000,ownedItemIds:[],allowActives:true};
it('shows all stages and keeps later-only items out of early lists',()=>{const board=recommendationBoard(demoCatalog,scenario,'burst',weights,{demo:true});expect(board.map(b=>b.stage)).toEqual(['lane','mid','late']);expect(board[0].results.map(r=>r.item.id)).toEqual(['demo-guard']);expect(board[1].results.some(r=>r.item.id==='demo-interrupt')).toBe(true);});
it('changes problem lists without merging punish with survival',()=>{const board=recommendationBoard(demoCatalog,scenario,'sustain',weights,{demo:true});expect(board[0].results).toEqual([]);expect(board[1].results.every(r=>r.goal==='punish'&&!r.affordable)).toBe(true);});
