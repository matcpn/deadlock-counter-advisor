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
    signals:{functionId:string;quote:string}[];propertySignals?:PropertySignal[];note:string;gaps?:string[]}[]}[];
}
export interface PropertySignal {
  functionId:string;
  facts:{path:string[];value:string|number|string[]}[];
}
type Signal={functionId:string;quote:string;source?:'properties'};
export interface ThreatAbility {
  className:string;name:string;description:string;
  status:'triaged'|'needs-review'|'untriaged';
  signals:Signal[];note:string;gaps:string[];
}
export interface ThreatInventory {
  schemaVersion:1;clientVersion:number;triagedAt:string;sourceUrl:string;
  heroes:{heroId:string;name:string;abilities:ThreatAbility[]}[];
  retiredHeroIds:string[];
}
export interface RosterReview {
  schemaVersion:number;clientVersion:number;reviewedAt:string;meaning:string;
  heroes:{heroId:string;name:string;status:string;ruleIds:string[];
    sourceUrls:string[];remainingQuestions:string[];
    abilityBaselines:{className:string;description:string}[]}[];
}

/** Audit completion separately from coverage. A new/changed hero must not inherit a completed review. */
export function auditRosterReview(game:GameSnapshot,catalog:Catalog,review:RosterReview){
  if(review.schemaVersion!==1||!validDate(review.reviewedAt)||!unique(review.heroes.map(h=>h.heroId))) throw new Error('Invalid roster review');
  for(const h of review.heroes){
    if(!h.remainingQuestions.length||h.remainingQuestions.some(q=>!q?.trim())||!unique(h.ruleIds)||!h.ruleIds.length||
      !unique(h.abilityBaselines.map(a=>a.className))||!h.abilityBaselines.length||
      h.sourceUrls.some(url=>!catalog.manifest.sources.some(s=>s.url===url))||
      h.ruleIds.some(id=>!catalog.rules.some(r=>r.id===id&&r.enemyHeroId===h.heroId))) throw new Error('Invalid roster review evidence');
    const rules=catalog.rules.filter(r=>r.enemyHeroId===h.heroId);
    if(rules.some(r=>!h.ruleIds.includes(r.id))||rules.some(r=>r.evidence.sourceUrls.some(url=>!h.sourceUrls.includes(url)))) throw new Error('Roster review is missing rules or sources');
  }
  return game.heroes.filter(h=>h.selectable).map(h=>{
    const record=review.heroes.find(r=>r.heroId===h.id);
    const current=record&&review.clientVersion===game.clientVersion&&
      record.abilityBaselines.length===h.abilities.length&&h.abilities.every(a=>record.abilityBaselines.some(b=>b.className===a.className&&b.description===normalized(a.description)));
    return {heroId:h.id,status:!record?'unreviewed':current?'partial-source-reviewed':'needs-review',record};
  });
}
const normalized=(text:string)=>text.replace(/\s+/g,' ').trim();
const unique=(values:string[])=>new Set(values).size===values.length;
const sourceValue=(record:unknown,path:string[]):unknown=>path.reduce<unknown>((value,key)=>
  value!==null&&typeof value==='object'&&Object.hasOwn(value,key)?(value as Record<string,unknown>)[key]:undefined,record);

/** Exact, manually selected source spans. Never interpret words as counter rules. */
export function buildThreatInventory(game:GameSnapshot,seeds:ThreatSeeds,taxonomy:ResearchFunctions,rawAbilities:Record<string,unknown>[]=[]):ThreatInventory {
  if(seeds.schemaVersion!==1||taxonomy.schemaVersion!==1) throw new Error('Unsupported research schema');
  if(!unique(seeds.profiles.map(p=>p.heroId))) throw new Error('Duplicate threat hero');
  if(!unique(taxonomy.functions.map(f=>f.id))||!unique(taxonomy.responses.map(r=>r.id))) throw new Error('Duplicate research function');
  const functionIds=new Set(taxonomy.functions.map(f=>f.id));
  const responseIds=new Set(taxonomy.responses.map(r=>r.id));
  for(const f of taxonomy.functions) if(f.responseIds.some(id=>!responseIds.has(id))) throw new Error('Unknown response function');
  for(const p of seeds.profiles){
    if(!unique(p.abilities.map(a=>a.className))) throw new Error('Duplicate threat ability');
    for(const a of p.abilities){
      if(!a.note.trim()||!unique([...a.signals,...a.propertySignals??[]].map(s=>s.functionId))) throw new Error('Invalid threat annotation');
      for(const s of a.signals) if(!functionIds.has(s.functionId)||!s.quote.trim()||!a.baselineDescription.includes(s.quote)) throw new Error('Invalid evidence span or function');
      for(const s of a.propertySignals??[]) if(!functionIds.has(s.functionId)||!s.facts.length||s.facts.some(f=>
        !f.path.length||!['properties','behaviours'].includes(f.path[0])||f.path.some(k=>!k||['__proto__','constructor','prototype'].includes(k))||
        !(typeof f.value==='string'||typeof f.value==='number'||(Array.isArray(f.value)&&f.value.every(v=>typeof v==='string'))))) throw new Error('Invalid property evidence');
    }
  }
  const heroes=game.heroes.filter(h=>h.selectable).map(h=>{
    const profile=seeds.profiles.find(p=>p.heroId===h.id);
    return {heroId:h.id,name:h.name,abilities:h.abilities.map(a=>{
      const seed=profile?.abilities.find(s=>s.className===a.className);
      const description=normalized(a.description);
      const raw=rawAbilities.filter(r=>r.class_name===a.className);
      const propertiesCurrent=!seed?.propertySignals?.length||(raw.length===1&&seed.propertySignals.every(s=>s.facts.every(f=>
        JSON.stringify(sourceValue(raw[0],f.path))===JSON.stringify(f.value))));
      const current=seed&&seeds.clientVersion===game.clientVersion&&seed.baselineDescription===description&&propertiesCurrent;
      const status:ThreatAbility['status']=!seed?'untriaged':current?'triaged':'needs-review';
      return {className:a.className,name:a.name,description,status,
        signals:current?[...seed.signals,...(seed.propertySignals??[]).map(s=>({functionId:s.functionId,source:'properties' as const,
          quote:s.facts.map(f=>`${f.path.join('.')} = ${JSON.stringify(f.value)}`).join('; ')}))]:[],gaps:current?(seed.gaps??[]):['Source triage required.'],note:!seed?'New or unmapped ability: inspect the source before assigning functions.':!current?'Snapshot, ability text or supporting properties changed or are missing. Previous tags are withheld until re-triaged.':seed.note};
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
/** A build-neutral option, or an option for both damage-category preferences. */
export function hasBuildCoverage(categories:Catalog['items'][number]['category'][]){
  return categories.includes('vitality')||(categories.includes('spirit')&&categories.includes('weapon'));
}
/** Depth counts distinct available items, never repeated stages/problems/rules. */
export function itemDepth(coverage:HeroCoverage[],catalog:Catalog,minimum=2){
  return coverage.map(hero=>{
    const ruleIds=new Set(hero.cells.flatMap(cell=>cell.ruleIds));
    const itemIds=[...new Set(catalog.rules.filter(r=>ruleIds.has(r.id)).map(r=>r.itemId))].sort();
    const categories=[...new Set(catalog.items.filter(i=>itemIds.includes(i.id)).map(i=>i.category))].sort();
    return {heroId:hero.heroId,itemIds,count:itemIds.length,needsResearch:itemIds.length<minimum,categories,buildCovered:hasBuildCoverage(categories)};
  }).sort((a,b)=>a.count-b.count||a.heroId.localeCompare(b.heroId));
}
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
