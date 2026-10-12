import type { Catalog, Evidence, Weights } from '../domain/types';
const evidence: Evidence = { status: 'demo', patch: 'synthetic-demo', sourceUrls: [], reviewedAt: null, claims: [], reviewer: null,
  note: 'Invented fixture. Not a real item, price, or verified Deadlock interaction.' };
export const weights: Weights = { strength: 10, buildFit: 2, extraEnemy: 3 };
export const demoCatalog: Catalog = {
  manifest: {schemaVersion:1,dataVersion:'demo-0.2',gamePatchId:'synthetic-demo',scoringVersion:'baseline-1',kind:'demo',sources:[],coverage:{completeRoster:false,note:'Three named heroes and invented items; no verified coverage.'}},
  heroes: [{id:'infernus',name:'Infernus'},{id:'abrams',name:'Abrams'},{id:'shiv',name:'Shiv'}],
  items: [
    {id:'demo-guard',name:'Demo Guard',category:'vitality',activation:'conditional',cost:900,componentIds:[],fit:{spirit:1,weapon:1,hybrid:1},evidence},
    {id:'demo-interrupt',name:'Demo Interrupt',category:'weapon',activation:'active',cost:1700,componentIds:[],fit:{spirit:0.3,weapon:1,hybrid:0.7},evidence},
    {id:'demo-pressure',name:'Demo Pressure',category:'spirit',activation:'passive',cost:2600,componentIds:[],fit:{spirit:1,weapon:0.2,hybrid:0.8},evidence}
  ],
  rules: [
    {id:'demo-guard-a',itemId:'demo-guard',enemyHeroId:'abrams',goal:'survive',problems:['burst','control'],stages:['lane','mid','late'],strength:0.7,mechanism:'Illustrates cushioning an incoming combo.',limitation:'Does not interrupt an attacker or guarantee survival.',timing:'Illustrative automatic trigger; real trigger conditions need review.',evidence},
    {id:'demo-guard-s',itemId:'demo-guard',enemyHeroId:'shiv',goal:'survive',problems:['burst'],stages:['lane','mid','late'],strength:0.5,mechanism:'Illustrates one defensive purchase covering a second threat.',limitation:'Does not establish any real execute interaction.',timing:'Synthetic example only.',evidence},
    {id:'demo-interrupt-a',itemId:'demo-interrupt',enemyHeroId:'abrams',goal:'disrupt',problems:['control','burst'],stages:['mid','late'],strength:0.9,mechanism:'Illustrates interrupting a combo before it connects.',limitation:'An active may require advance use; do not assume it works while stunned.',timing:'Preemptive use in this fixture.',evidence},
    {id:'demo-pressure-s',itemId:'demo-pressure',enemyHeroId:'shiv',goal:'punish',problems:['sustain'],stages:['mid','late'],strength:0.8,mechanism:'Illustrates pressure against sustain.',limitation:'A punish tool may do little to stop immediate burst.',timing:'Apply while dealing damage in this fixture.',evidence}
  ]
};

