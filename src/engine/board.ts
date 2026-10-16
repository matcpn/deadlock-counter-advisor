import type { Catalog, Problem, Scenario, Stage, Weights } from '../domain/types';
import { recommend, type RecommendationOptions } from './recommend';
export const problemAreas: {id:Problem;label:string;description:string}[] = [
  {id:'burst',label:'Burst damage',description:'Survive the opening hit and find room to respond.'},
  {id:'control',label:'Control & combos',description:'Reduce control, disrupt setup, or escape a sequence.'},
  {id:'dot',label:'Damage over time',description:'Deal with ongoing damage after a debuff has landed.'},
  {id:'sustain',label:'Enemy sustain',description:'Find ways to finish enemies who keep healing.'},
  {id:'escape',label:'Chase & escape',description:'Stay in reach or create distance.'}
];
export const stages: {id:Stage;label:string}[] = [{id:'lane',label:'Early / lane'},{id:'mid',label:'Mid game'},{id:'late',label:'Late game'}];
/** Browsing a problem returns every stage, without treating budget as game stage. */
export function recommendationBoard(catalog:Catalog,scenario:Scenario,problem:Problem,weights:Weights,options:RecommendationOptions) {
  return stages.map(stage=>({stage:stage.id,label:stage.label,
    results:recommend(catalog,{...scenario,stage:stage.id,problems:[problem]},weights,options)}));
}
