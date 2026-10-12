import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { demoCatalog, weights } from './data/demo';
import { goals, recommend } from './engine/recommend';
import type { Build, Problem, Scenario, Stage } from './domain/types';
import './styles.css';
const initial: Scenario = {heroId:'infernus',build:'spirit',enemyHeroIds:['abrams','shiv'],problems:['burst','control'],stage:'mid',budget:1800,ownedItemIds:[],allowActives:true};
function App() {
  const [scenario,setScenario] = useState(initial);
  const update = <K extends keyof Scenario>(key: K,value: Scenario[K]) => setScenario(s=>({...s,[key]:value}));
  const results = recommend(demoCatalog,scenario,weights,{demo:true});
  return <main>
    <header><span className="eyebrow">DEADLOCK / COUNTER ADVISOR</span><h1>What’s stopping you?</h1><p>Find a response to the fight you’re actually losing.</p></header>
    <aside className="notice"><strong>Scaffold · synthetic demo data</strong><br/>These invented items demonstrate the interface and ranking. No live game recommendations are included. Hero-specific player synergies and advanced constraints are planned.</aside>
    <section className="controls" aria-label="Your scenario">
      <label>Your hero<select value={scenario.heroId} onChange={e=>setScenario(s=>({...s,heroId:e.target.value,enemyHeroIds:s.enemyHeroIds.filter(id=>id!==e.target.value)}))}>{demoCatalog.heroes.map(h=><option key={h.id} value={h.id}>{h.name}</option>)}</select></label>
      <label>Your build<select value={scenario.build} onChange={e=>update('build',e.target.value as Build)}>{['spirit','weapon','hybrid'].map(b=><option key={b}>{b}</option>)}</select></label>
      <label>Game stage<select value={scenario.stage} onChange={e=>update('stage',e.target.value as Stage)}>{['lane','mid','late'].map(s=><option key={s}>{s}</option>)}</select></label>
      <label>Available souls<input type="number" min="0" value={scenario.budget} onChange={e=>update('budget',Math.min(Number.MAX_SAFE_INTEGER,Math.max(0,Math.floor(Number(e.target.value)||0))))}/></label>
      <fieldset><legend>Enemy threats</legend>{demoCatalog.heroes.filter(h=>h.id!==scenario.heroId).map(h=><label className="check" key={h.id}><input type="checkbox" checked={scenario.enemyHeroIds.includes(h.id)} onChange={e=>update('enemyHeroIds',e.target.checked?[...scenario.enemyHeroIds,h.id]:scenario.enemyHeroIds.filter(id=>id!==h.id))}/>{h.name}</label>)}</fieldset>
      <fieldset><legend>What’s going wrong?</legend>{([['burst','Burst down'],['control','Caught in a combo'],['sustain','Cannot finish them'],['escape','Cannot keep them in reach']] as [Problem,string][]).map(([id,label])=><label className="check" key={id}><input type="checkbox" checked={scenario.problems.includes(id)} onChange={e=>update('problems',e.target.checked?[...scenario.problems,id]:scenario.problems.filter(p=>p!==id))}/>{label}</label>)}</fieldset>
      <label className="check"><input type="checkbox" checked={scenario.allowActives} onChange={e=>update('allowActives',e.target.checked)}/>Include active items</label>
    </section>
    <p className="legend"><span className="weapon">Weapon</span> · <span className="vitality">Vitality</span> · <span className="spirit">Spirit</span> — activation is labeled separately. Demo palette; verify against current game.</p>
    <section className="results" aria-live="polite">{goals.map(goal=><div key={goal}><h2>{goal}</h2><p className="sub">{{survive:'Stay alive through the threat.',disrupt:'Break their sequence.',punish:'Make their weakness matter.'}[goal]}</p>{results.filter(r=>r.goal===goal).map(r=><article className={'card '+r.item.category} key={r.item.id}>
      <div className="badges"><span>{r.item.category}</span><span className={r.item.activation==='active'?'active':''}>{r.item.activation==='active'?'⚡ ACTIVE':r.item.activation.toUpperCase()}</span></div>
      <h3>{r.item.name}</h3><strong>{r.item.cost.toLocaleString()} souls · {r.affordable?'Within budget':'Save for later'}</strong><p className="coverage">Covers {r.coveredEnemyIds.map(id=>demoCatalog.heroes.find(h=>h.id===id)?.name).join(' + ')}</p>
      {r.rules.map(rule=><div key={rule.id}><p>{rule.mechanism}</p><details><summary>Timing and limitations</summary><p>{rule.timing}</p><p>{rule.limitation}</p></details></div>)}
    </article>)}{!results.some(r=>r.goal===goal)&&<div className="empty">No demo match for this goal. Try another problem or stage.</div>}</div>)}</section>
    <footer>Prototype 0.1 · No current patch verified · Read docs/HANDOFF.md to continue.</footer>
  </main>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);

