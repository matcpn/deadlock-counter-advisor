import type { GameSnapshot } from './game-data.ts';
import type { Catalog, Evidence, Goal, Problem, Stage } from './types.ts';

export interface ResearchFunctions {
  schemaVersion: number;
  functions: {id:string;label:string;problems:string[];responseIds:string[];question:string}[];
  responses: {id:string;label:string;itemIds:string[]}[];
}
export interface ThreatSeeds {
  schemaVersion:number;clientVersion:number;triagedAt:string;reviewer:string;
  profiles:{heroId:string;abilities:{className:string;baselineDescription:string;
    signals:{functionId:string;quote:string}[];note:string;gaps?:string[]}[]}[];
}
export interface ThreatAbility {
  className:string;name:string;description:string;
  status:'triaged'|'needs-review'|'untriaged';
  signals:{functionId:string;quote:string}[];note:string;gaps:string[];
}
export interface ThreatInventory {
  schemaVersion:1;clientVersion:number;triagedAt:string;sourceUrl:string;
  heroes:{heroId:string;name:string;development:boolean;abilities:ThreatAbility[]}[];
  retiredHeroIds:string[];
}
const normalized=(text:string)=>text.replace(/\s+/g,' ').trim();
const unique=(values:string[])=>new Set(values).size===values.length;

/** Exact, manually selected source spans. Never interpret words as counter rules. */
export function buildThreatInventory(game:GameSnapshot,seeds:ThreatSeeds,taxonomy:ResearchFunctions):ThreatInventory {
  if(seeds.schemaVersion!==1||taxonomy.schemaVersion!==1) throw new Error('Unsupported research schema');
  if(!unique(seeds.profiles.map(p=>p.heroId))) throw new Error('Duplicate threat hero');
  if(!unique(taxonomy.functions.map(f=>f.id))||!unique(taxonomy.responses.map(r=>r.id))) throw new Error('Duplicate research function');
  const functionIds=new Set(taxonomy.functions.map(f=>f.id));
  const responseIds=new Set(taxonomy.responses.map(r=>r.id));
  for(const f of taxonomy.functions) if(f.responseIds.some(id=>!responseIds.has(id))) throw new Error('Unknown response function');
  for(const p of seeds.profiles){
    if(!unique(p.abilities.map(a=>a.className))) throw new Error('Duplicate threat ability');
    for(const a of p.abilities){
      if(!a.note.trim()||!unique(a.signals.map(s=>s.functionId))) throw new Error('Invalid threat annotation');
      for(const s of a.signals) if(!functionIds.has(s.functionId)||!s.quote.trim()||!a.baselineDescription.includes(s.quote)) throw new Error('Invalid evidence span or function');
    }
  }
  const heroes=game.heroes.filter(h=>h.selectable).map(h=>{
    const profile=seeds.profiles.find(p=>p.heroId===h.id);
    return {heroId:h.id,name:h.name,development:h.development,abilities:h.abilities.map(a=>{
      const seed=profile?.abilities.find(s=>s.className===a.className);
      const description=normalized(a.description);
      const current=seed&&seeds.clientVersion===game.clientVersion&&seed.baselineDescription===description;
      const status:ThreatAbility['status']=!seed?'untriaged':current?'triaged':'needs-review';
      return {className:a.className,name:a.name,description,status,
        signals:current?seed.signals:[],gaps:current?(seed.gaps??[]):['Source triage required.'],note:!seed?'New or unmapped ability: inspect the source before assigning functions.':!current?'Snapshot or ability text changed. Previous tags are withheld until re-triaged.':seed.note};
    })};
  });
  return {schemaVersion:1,clientVersion:game.clientVersion,triagedAt:seeds.triagedAt,
    sourceUrl:`https://api.deadlock-api.com/v1/assets/items?client_version=${game.clientVersion}`,
    heroes,retiredHeroIds:seeds.profiles.filter(p=>!heroes.some(h=>h.heroId===p.heroId)).map(p=>p.heroId)};
}

export const coverageProblems:Problem[]=['burst','control','dot','sustain','escape'];
const stages:Stage[]=['lane','mid','late'];
export interface CoverageCell {
  problem:Problem;status:'conditional'|'verified'|'needs-review'|'needs-research';
  ruleIds:string[];stages:Record<Stage,number>;goals:Goal[];playerHeroIds:string[];
}
export interface HeroCoverage {heroId:string;cells:CoverageCell[]}
const validDate=(date:string)=>/^\d{4}-\d{2}-\d{2}$/.test(date)&&Number.isFinite(Date.parse(date))&&new Date(date).toISOString().slice(0,10)===date;
const available=(e:Evidence,patch:string,asOf:string)=>
  (e.status==='verified'||e.status==='source-reviewed')&&e.patch===patch&&
  !!e.reviewedAt&&validDate(e.reviewedAt)&&e.reviewedAt<=asOf&&
  (e.status!=='source-reviewed'||!!e.expiresAt)&&(!e.expiresAt||(validDate(e.expiresAt)&&asOf<e.expiresAt));

/** Catalog-level availability across all player scopes, not scenario eligibility or complete threat coverage. */
export function buildCoverage(game:GameSnapshot,catalog:Catalog,asOf:string):HeroCoverage[] {
  if(!validDate(asOf)) throw new Error('Invalid coverage date');
  const patch=`client-${game.clientVersion}`;
  // Mirror the published adapter's conservative whole-release pause on drift/expiry.
  const paused=catalog.manifest.kind!=='production'||catalog.manifest.gamePatchId!==patch||
    [...catalog.items,...catalog.rules].some(row=>
      (row.evidence.status==='source-reviewed'||row.evidence.status==='verified')&&!available(row.evidence,patch,asOf))||
    catalog.items.some(i=>{const imported=game.items.find(g=>g.id===i.id);return !imported||i.name!==imported.name||i.cost!==imported.cost||i.category!==imported.category||
      (i.activation==='active')!==(imported.activation==='active')||JSON.stringify(i.componentIds)!==JSON.stringify(imported.componentIds);});
  return game.heroes.filter(h=>h.selectable).map(h=>({heroId:h.id,cells:coverageProblems.map(problem=>{
    const candidates=catalog.rules.filter(r=>r.enemyHeroId===h.id&&r.problems.includes(problem)&&r.evidence.status!=='demo');
    const rules=paused?[]:candidates.filter(r=>available(r.evidence,patch,asOf)&&
      catalog.items.some(i=>i.id===r.itemId&&available(i.evidence,patch,asOf))&&
      (r.playerHeroIds??catalog.heroes.map(h=>h.id)).some(id=>id!==h.id&&game.heroes.some(h=>h.id===id&&h.selectable)));
    const status:CoverageCell['status']=rules.length?(rules.every(r=>r.evidence.status==='verified'&&catalog.items.find(i=>i.id===r.itemId)?.evidence.status==='verified')?'verified':'conditional'):candidates.length?'needs-review':'needs-research';
    return {problem,status,ruleIds:rules.map(r=>r.id),stages:Object.fromEntries(stages.map(s=>[s,rules.filter(r=>r.stages.includes(s)).length])) as Record<Stage,number>,
      goals:[...new Set(rules.map(r=>r.goal))],playerHeroIds:[...new Set(rules.flatMap(r=>r.playerHeroIds??catalog.heroes.map(h=>h.id)).filter(id=>id!==h.id&&game.heroes.some(h=>h.id===id&&h.selectable)))]};
  })}));
}

export function researchBacklog(inventory:ThreatInventory,coverage:HeroCoverage[],taxonomy:ResearchFunctions){
  const hasAdvice=(heroId:string)=>coverage.find(h=>h.heroId===heroId)?.cells.some(c=>c.ruleIds.length);
  return taxonomy.functions.map(f=>{
    const occurrences=inventory.heroes.flatMap(h=>h.abilities.filter(a=>a.signals.some(s=>s.functionId===f.id)).map(a=>({heroId:h.heroId,heroName:h.name,ability:a.name})));
    const heroIds=[...new Set(occurrences.map(o=>o.heroId))];
    return {functionId:f.id,label:f.label,question:f.question,responseIds:f.responseIds,occurrences,
      heroCount:heroIds.length,uncoveredHeroCount:heroIds.filter(id=>!hasAdvice(id)).length};
  }).filter(f=>f.heroCount).sort((a,b)=>b.uncoveredHeroCount-a.uncoveredHeroCount||b.heroCount-a.heroCount||a.functionId.localeCompare(b.functionId));
}
