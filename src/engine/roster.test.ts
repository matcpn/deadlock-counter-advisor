import {describe,it,expect} from 'vitest';
import {reviewedCatalog,reviewAvailability} from '../data/reviewed';
import gameJson from '../data/game-catalog.json';
import reviewJson from '../../data/research/roster-review.json';
import type {GameSnapshot} from '../domain/game-data';
import type {Scenario} from '../domain/types';
import {auditRosterReview,buildCoverage,type RosterReview} from '../domain/research';
import {recommend} from './recommend';
import {weights} from '../data/demo';
const game=gameJson as GameSnapshot, review=reviewJson as RosterReview;
const options={patch:'client-6785',allowSourceReviewed:true,asOf:'2026-10-16'};
const base:Scenario={heroId:'hero-1',enemyHeroIds:[],problems:['burst'],stage:'mid',budget:1800,build:'spirit',ownedItemIds:[],allowActives:true};
const run=(s:Partial<Scenario>)=>recommend(reviewedCatalog,{...base,...s},weights,options);

describe('roster completion means bounded advice, not universal coverage',()=>{
  it.each(game.heroes.filter(h=>h.selectable))('has usable evidence and a scenario for $name',h=>{
    const player=h.id==='hero-1'?'hero-12':'hero-1';
    const results=(['lane','mid','late'] as const).flatMap(stage=>run({heroId:player,enemyHeroIds:[h.id],stage,problems:['burst','control','dot','escape','sustain']}));
    expect(results.length).toBeGreaterThan(0);
    expect(results.every(r=>r.rules.every(rule=>rule.evidence.status==='source-reviewed'))).toBe(true);
    expect(results.every(r=>r.coveredEnemyIds.join()===h.id)).toBe(true);
  });
  it('retains honest problem gaps and a separate pass record',()=>{
    expect(auditRosterReview(game,reviewedCatalog,review).every(h=>h.status==='partial-source-reviewed')).toBe(true);
    expect(buildCoverage(game,reviewedCatalog,options.asOf).flatMap(h=>h.cells).some(c=>c.status==='needs-research')).toBe(true);
    expect(reviewedCatalog.manifest.coverage.completeRoster).toBe(false);
    expect(reviewAvailability(game,options.asOf)).toBeNull();
  });
  it('withholds completion when source data changes or a new hero arrives',()=>{
    const changed=structuredClone(game);changed.heroes.find(h=>h.id==='hero-77')!.abilities[0].description+=' Changed';
    changed.heroes.push({...structuredClone(changed.heroes[0]),id:'hero-9999',sourceId:9999,name:'New'});
    const audit=auditRosterReview(changed,reviewedCatalog,review);
    expect(audit.find(h=>h.heroId==='hero-77')!.status).toBe('needs-review');
    expect(audit.find(h=>h.heroId==='hero-9999')!.status).toBe('unreviewed');
    expect(auditRosterReview({...game,clientVersion:6786},reviewedCatalog,review).every(h=>h.status==='needs-review')).toBe(true);
  });
  it('rejects missing rules, borrowed identities and unregistered evidence',()=>{
    for(const mutation of [
      (r:RosterReview)=>{r.heroes[0].ruleIds=[];},
      (r:RosterReview)=>{r.heroes[0].ruleIds.push(r.heroes[1].ruleIds[0]);},
      (r:RosterReview)=>{r.heroes[0].sourceUrls.push('https://example.com/unread');},
      (r:RosterReview)=>{r.heroes[0].remainingQuestions=[];},
      (r:RosterReview)=>{r.heroes.push(r.heroes[0]);}
    ]){const altered=structuredClone(review);mutation(altered);expect(()=>auditRosterReview(game,reviewedCatalog,altered)).toThrow();}
  });
  it('does not sell flight disruption in lane or when the player cannot activate it',()=>{
    const s={enemyHeroIds:['hero-3','hero-17'],problems:['escape'] as Scenario['problems']};
    const results=run(s);
    expect(results.map(r=>[r.item.name,r.goal,r.affordable,r.coveredEnemyIds.length])).toEqual([['Knockdown','disrupt',false,2]]);
    for(const change of [{stage:'lane' as const},{allowActives:false},{responseWindow:'stunned-or-slept' as const}])expect(run({...s,...change})).toEqual([]);
    expect(run({...s,budget:3200})[0].affordable).toBe(true);
  });
  it('uses affordable movement denial only for the reviewed new-cast windows',()=>{
    const s={enemyHeroIds:['hero-77','hero-16','hero-31','hero-63'],problems:['escape'] as Scenario['problems'],stage:'lane' as const};
    const r=run(s)[0];expect(r.item.name).toBe('Slowing Hex');expect(r.item.category).toBe('spirit');expect(r.affordable).toBe(true);expect(r.goal).toBe('disrupt');expect(r.coveredEnemyIds).toHaveLength(4);
    expect(run({...s,ownedItemIds:[r.item.id]})).toEqual([]);
    expect(run({...s,allowActives:false})).toEqual([]);
    expect(r.rules.find(x=>x.enemyHeroId==='hero-63')!.limitation).toContain('Recast suppression is excluded');
    expect(r.rules.find(x=>x.enemyHeroId==='hero-16')!.limitation).toContain('Cannot target Calico');
    expect(r.rules.find(x=>x.enemyHeroId==='hero-31')!.limitation).toContain('Does not cancel Death Slam');
    expect(run({enemyHeroIds:['hero-50','hero-58'],problems:['escape']})).toEqual([]);
  });
  it('shares passive melee protection without converting it into automatic parries',()=>{
    const r=run({enemyHeroIds:['hero-72','hero-16','hero-35','hero-27'],allowActives:false})[0];
    expect(r.item.name).toBe('Rebuttal');expect(r.coveredEnemyIds).toHaveLength(4);expect(r.affordable).toBe(true);
    expect(r.rules.every(x=>x.mechanism.includes('No successful parry'))).toBe(true);
    expect(r.rules.find(x=>x.enemyHeroId==='hero-72')!.limitation).toContain('shockwave is spirit');
    expect(r.rules.find(x=>x.enemyHeroId==='hero-27')!.limitation).toContain('Shadow Transformation');
  });
  it('separates delayed-mark removal from mitigation and omits ult-wide cleanse claims',()=>{
    for(const [enemy,problem] of [['hero-52','burst'],['hero-64','dot'],['hero-76','control']] as const){
      const s={enemyHeroIds:[enemy],problems:[problem]};
      expect(run(s).some(r=>r.item.name==='Dispel Magic')).toBe(true);
      expect(run({...s,responseWindow:'stunned-or-slept'}).some(r=>r.item.name==='Dispel Magic')).toBe(false);
      expect(run({...s,stage:'lane'}).some(r=>r.item.name==='Dispel Magic')).toBe(false);
    }
    expect(run({enemyHeroIds:['hero-50'],problems:['dot']}).map(r=>r.item.name)).toEqual(['Debuff Reducer']);
    expect(run({enemyHeroIds:['hero-69'],problems:['control']}).map(r=>r.item.name)).toEqual(['Reactive Barrier']);
  });
  it('keeps healing denial on Geist under Punish, outside Soul Exchange protection',()=>{
    const s={enemyHeroIds:['hero-4'],problems:['sustain'] as Scenario['problems']};
    const r=run(s);expect(r.map(r=>r.item.name)).toEqual(['Healbane','Toxic Bullets']);
    expect(r.every(r=>r.goal==='punish'&&r.rules[0].limitation.includes('not a counter to Soul Exchange'))).toBe(true);
    expect(run({...s,heroId:'hero-66'})).toHaveLength(2);
    expect(run({...s,heroId:'hero-13'})).toEqual([]);
    expect(run({...s,problems:['burst']})).toEqual([]);
  });
  it('keeps exceptional damage, alternate kits and wake-up limitations visible',()=>{
    const rule=(id:string)=>reviewedCatalog.rules.find(r=>r.id===id)!;
    expect(rule('roster-weapon-78').limitation).toContain('backblast');
    expect(rule('roster-weapon-80').limitation).toContain('transformed damage');
    expect(rule('roster-spirit-60').limitation).toContain('copied ultimates are excluded');
    expect(rule('roster-reactive-65').limitation).toContain('pure damage');
    expect(rule('roster-reactive-79').limitation).toContain('may not count toward waking');
    expect(rule('roster-reactive-14').limitation).toContain('Powder Keg knockup is excluded');
    expect(rule('roster-spirit-85').limitation).toContain('checkmate/execution');
    expect(rule('roster-spirit-88').limitation).toContain('Does not restore stolen Spirit');
  });
});
