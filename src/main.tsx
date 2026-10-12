import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import snapshotJson from './data/game-catalog.json';
import type { GameItem, GameSnapshot } from './domain/game-data';
import { demoCatalog, weights } from './data/demo';
import { goals } from './engine/recommend';
import { problemAreas, recommendationBoard } from './engine/board';
import type { Build, Problem, Scenario } from './domain/types';
import './styles.css';
const game = snapshotJson as GameSnapshot;
const heroes = game.heroes.filter(h=>h.selectable);
const heroName = (id:string) => heroes.find(h=>h.id===id)?.name ?? id;
function Artwork({src}:{src:string|null}) {
  const [failed,setFailed]=useState(false);
  return src&&!failed?<img src={src} alt="" loading="lazy" onError={()=>setFailed(true)}/>:<span className="art-fallback" aria-hidden="true">◆</span>;
}
function ItemCard({item,budget}:{item:GameItem;budget:number}) {
  return <article className={'card '+item.category} style={{'--item':game.colors[item.category]} as React.CSSProperties}>
    <div className="item-title"><Artwork src={item.image}/><div><h3>{item.name}</h3><span>{item.cost.toLocaleString()} souls · {item.cost<=budget?'Within budget':`${(item.cost-budget).toLocaleString()} more souls`}</span></div></div>
    <div className="badges"><span>{item.category}</span><span className={item.activation==='active'?'active':''}>{item.activation==='active'?'ACTIVE':'NON-ACTIVE · trigger varies'}</span></div>
    <details><summary>Tooltip & source facts</summary><p className="tooltip">{item.description||'No description supplied; inspect source properties below.'}</p><p>Source activation: {item.sourceActivation}. A non-active item may have a conditional trigger.</p>
      <p>Counter interaction and mode availability have not been reviewed.</p>
      {item.componentIds.length>0&&<p>Components: {item.componentIds.map(id=>game.items.find(i=>i.id===id)?.name??id).join(', ')}. No discount is assumed.</p>}
      <details><summary>Raw property values</summary><dl>{item.properties.filter(p=>p.value!==null).map(p=><React.Fragment key={p.name}><dt>{p.label}</dt><dd>{p.value}</dd></React.Fragment>)}</dl></details>
      <a href={`https://api.deadlock-api.com/v1/assets/items/${item.sourceId}?client_version=${game.clientVersion}`} target="_blank" rel="noreferrer">Version-pinned source</a>
    </details>
  </article>;
}
function App() {
  const [heroId,setHero]=useState('hero-1'),[enemies,setEnemies]=useState(['hero-6','hero-19']);
  const [heroSearch,setHeroSearch]=useState(''),[problem,setProblem]=useState<Problem>('burst');
  const [budget,setBudget]=useState(1800),[allowActives,setActives]=useState(true),[build,setBuild]=useState<Build>('spirit');
  const [demo,setDemo]=useState(false),[itemSearch,setItemSearch]=useState(''),[category,setCategory]=useState('all'),[tag,setTag]=useState('all');
  const player=heroes.find(h=>h.id===heroId)!;
  const demoId=(id:string)=>demoCatalog.heroes.find(h=>h.name===heroName(id))?.id;
  const demoPlayer=demoId(heroId);
  const scenario:Scenario={heroId:demoPlayer??'infernus',build,enemyHeroIds:enemies.map(demoId).filter((id):id is string=>!!id&&id!==demoPlayer),stage:'mid',problems:[problem],budget,ownedItemIds:[],allowActives};
  const board=demo&&demoPlayer?recommendationBoard(demoCatalog,scenario,problem,weights,{demo:true}):[];
  const filtered=game.items.filter(i=>(allowActives||i.activation!=='active')&&(category==='all'||i.category===category)&&(tag==='all'||i.sourceTags.includes(tag))&&i.name.toLowerCase().includes(itemSearch.toLowerCase()));
  const tags=[...new Set(game.items.flatMap(i=>i.sourceTags))].sort();
  const selected=problemAreas.find(p=>p.id===problem)!;
  return <main style={{'--weapon':game.colors.weapon,'--vitality':game.colors.vitality,'--spirit':game.colors.spirit} as React.CSSProperties}>
    <header><span className="eyebrow">DEADLOCK / COUNTER ADVISOR</span><h1>Read the fight. Find your options.</h1><p>Your hero and their threats up front. Problems and stages organized below.</p></header>
    <aside className="notice"><strong>Game catalog imported · counter advice still under review</strong><p>Client {game.clientVersion} · {game.counts.selectableHeroes} source-selectable heroes · {game.items.length} source shop items · pulled {game.importedAt.slice(0,10)} UTC.</p><p>Community client data may lag the game. Development heroes and special-tier items are labeled. Imported facts do not establish matchup counters.</p></aside>
    <section className="scenario" aria-label="Your scenario">
      <div className="player-row"><Artwork src={player.portrait}/><label>Your hero<select value={heroId} onChange={e=>{setHero(e.target.value);setEnemies(ids=>ids.filter(id=>id!==e.target.value));}}>{heroes.map(h=><option value={h.id} key={h.id}>{h.name}{h.development?' · development':''}</option>)}</select></label></div>
      <fieldset className="threats"><legend>Who is causing problems? · {enemies.length} selected</legend>
        <label className="search">Find a hero<input type="search" value={heroSearch} onChange={e=>setHeroSearch(e.target.value)} placeholder="Search all heroes"/></label>
        <div className="hero-grid">{heroes.filter(h=>h.id!==heroId&&h.name.toLowerCase().includes(heroSearch.toLowerCase())).map(h=><label className={'hero-choice '+(enemies.includes(h.id)?'selected':'')} key={h.id}><input type="checkbox" checked={enemies.includes(h.id)} onChange={e=>setEnemies(ids=>e.target.checked?[...ids,h.id]:ids.filter(id=>id!==h.id))}/><Artwork src={h.portrait}/><span>{h.name}{h.development&&<small>Development flag</small>}</span></label>)}</div>
        {!heroes.some(h=>h.id!==heroId&&h.name.toLowerCase().includes(heroSearch.toLowerCase()))&&<p>No matching heroes.</p>}
      </fieldset>
      <p className="selected-threats">Selected threats: {enemies.length?enemies.map(heroName).join(' + '):'Choose one or more enemies above.'}</p>
      <details className="preferences"><summary>Optional preferences · {budget.toLocaleString()} souls · {allowActives?'actives included':'no actives'}</summary><div className="controls"><label>Available souls<input type="number" min="0" step="1" value={budget} onChange={e=>setBudget(Math.min(Number.MAX_SAFE_INTEGER,Math.max(0,Math.floor(Number(e.target.value)||0))))}/></label><label className="check"><input type="checkbox" checked={allowActives} onChange={e=>setActives(e.target.checked)}/>Include active items</label>{demo&&<label>Demo build preference<select value={build} onChange={e=>setBuild(e.target.value as Build)}>{['spirit','weapon','hybrid'].map(b=><option key={b}>{b}</option>)}</select></label>}</div></details>
    </section>
    <section aria-label="Problem areas" className="advisor"><h2>Browse by problem</h2><div className="problem-tabs" aria-label="Problem views">{problemAreas.map(p=><button key={p.id} aria-pressed={problem===p.id} onClick={()=>setProblem(p.id)}>{p.label}</button>)}</div><p>{selected.description}</p>
      <label className="check demo-toggle"><input type="checkbox" checked={demo} onChange={e=>setDemo(e.target.checked)}/>Preview layout with invented demo items</label>
      {!demo&&<div className="empty">No reviewed counter rules for {selected.label.toLowerCase()} yet. The catalog below contains real imported items; it is not a recommendation for {enemies.length?enemies.map(heroName).join(' + '):'an enemy'}. Hero selection is ready for reviewed rules.</div>}
      {demo&&<p className="demo-warning">Synthetic layout preview only. Invented items and prices. Demo coverage is limited to Infernus, Abrams and Shiv; other selected heroes have no demo coverage.</p>}
      {demo&&demoPlayer&&<div className="stage-board">{board.map(column=><section key={column.stage}><h3>{column.label}</h3>{goals.map(goal=><div className="objective" key={goal}><h4>{goal}</h4>{[true,false].map(affordable=>{const matches=column.results.filter(r=>r.goal===goal&&r.affordable===affordable);return <div key={String(affordable)}><h5>{affordable?'Buy now':'Save for later'}</h5>{matches.length?matches.slice(0,3).map(r=><article className={'card '+r.item.category} key={r.item.id}><div className="badges"><span>{r.item.category}</span><span>{r.item.activation}</span></div><h3>{r.item.name}</h3><strong>{r.item.cost.toLocaleString()} souls</strong><p>Covers {r.coveredEnemyIds.map(id=>demoCatalog.heroes.find(h=>h.id===id)?.name).join(' + ')}</p><details><summary>Mechanism, timing & limits</summary>{r.rules.map(rule=><div key={rule.id}><p>{rule.mechanism}</p><p>{rule.timing}</p><p>{rule.limitation}</p></div>)}</details></article>):<p className="small-empty">No demo option.</p>}</div>;})}</div>)}</section>)}</div>}
      {demo&&!demoPlayer&&<div className="empty">This player hero has no synthetic fixture. Choose Infernus, Abrams or Shiv to preview the layout.</div>}
    </section>
    <section className="shop" aria-label="Imported item catalog"><h2>Explore the item catalog</h2><p>Shop tiers give you compact lists to browse. They describe price tiers, not verified early/mid/late suitability or enemy counters. Tier 5 is kept separate because mode availability needs review.</p>
      <div className="catalog-filters"><label>Find an item<input type="search" placeholder="Search items" value={itemSearch} onChange={e=>setItemSearch(e.target.value)}/></label><label>Item category<select value={category} onChange={e=>setCategory(e.target.value)}>{['all','weapon','vitality','spirit'].map(c=><option key={c}>{c}</option>)}</select></label><label>Source shop tag<select value={tag} onChange={e=>setTag(e.target.value)}><option value="all">All tags</option>{tags.map(t=><option key={t} value={t}>{t.replaceAll('_',' ')}</option>)}</select></label></div>
      <p className="legend">{filtered.length} matching items · <span className="weapon">Weapon</span> · <span className="vitality">Vitality</span> · <span className="spirit">Spirit</span> · active status labeled independently.</p>
      <div className="shop-tiers">{[1,2,3,4].map(tier=>{const items=filtered.filter(i=>i.tier===tier);return <section key={tier}><h3>Tier {tier} · {['','Entry purchases','Lower-cost options','Larger investments','Late-cost options'][tier]}</h3><p>{items.length} items</p>{items.slice(0,4).map(i=><ItemCard key={i.id} item={i} budget={budget}/>)}{items.length>4&&<details className="more-items"><summary>Show {items.length-4} more items</summary>{items.slice(4).map(i=><ItemCard key={i.id} item={i} budget={budget}/>)}</details>}{!items.length&&<p className="small-empty">No items match these filters.</p>}</section>;})}</div>
      <details className="special"><summary>Special tier 5 · {filtered.filter(i=>i.tier===5).length} items · availability unreviewed</summary><div className="shop-tiers">{filtered.filter(i=>i.tier===5).map(i=><ItemCard key={i.id} item={i} budget={budget}/>)}</div></details>
    </section>
    <footer><p>Data and asset URLs: <a href={game.source} target="_blank" rel="noreferrer">Deadlock API</a> · Game artwork belongs to Valve. Unofficial community project.</p><p>Snapshot client {game.clientVersion}. No verified counter coverage. <a href="https://github.com/matcpn/deadlock-counter-advisor">Source & refresh instructions</a></p></footer>
  </main>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
