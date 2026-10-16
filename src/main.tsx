import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import snapshotJson from './data/game-catalog.json';
import type { GameItem, GameSnapshot } from './domain/game-data';
import { reviewedCatalog, reviewAvailability } from './data/reviewed';
import { AdviceBoard } from './components/AdviceBoard';
import { Artwork } from './components/Artwork';
import { ItemDetails } from './components/ItemDetails';
import { ResearchCoverage } from './components/ResearchCoverage';
import { browseBoard } from './engine/browse';
import './styles.css';
const game = snapshotJson as GameSnapshot;
const heroes = game.heroes.filter(h=>h.selectable);
const reviewDates = [...new Set([...reviewedCatalog.items,...reviewedCatalog.rules].map(r=>r.evidence.reviewedAt))].sort().join(' / ');
const heroName = (id:string) => heroes.find(h=>h.id===id)?.name ?? id;
function ItemCard({item}:{item:GameItem}) {
  return <article className={'card '+item.category} style={{'--item':game.colors[item.category]} as React.CSSProperties}>
    <div className="item-heading"><ItemDetails item={item} game={game}/><strong>{item.cost.toLocaleString()} souls</strong></div>
    <div className="badges"><span>{item.category}</span><span className={item.activation==='active'?'active':''}>{item.activation==='active'?'ACTIVE':'NON-ACTIVE · trigger varies'}</span></div>
    <details><summary>Tooltip & source facts</summary><p className="tooltip">{item.description||'No description supplied; inspect source properties below.'}</p><p>Source activation: {item.sourceActivation}. A non-active item may have a conditional trigger.</p>
      <p>This catalog shows imported facts. Matchup advice is limited to the sourced cards above; mode availability remains unreviewed.</p>
      {item.componentIds.length>0&&<p>Components: {item.componentIds.map(id=>game.items.find(i=>i.id===id)?.name??id).join(', ')}. No discount is assumed.</p>}
      <details><summary>Raw property values</summary><dl>{item.properties.filter(p=>p.value!==null).map(p=><React.Fragment key={p.name}><dt>{p.label}</dt><dd>{p.value}</dd></React.Fragment>)}</dl></details>
      <a href={`https://api.deadlock-api.com/v1/assets/items/${item.sourceId}?client_version=${game.clientVersion}`} target="_blank" rel="noreferrer">Version-pinned source</a>
    </details>
  </article>;
}
function App() {
  const [enemies,setEnemies]=useState<string[]>([]);
  const [heroSearch,setHeroSearch]=useState('');
  const [itemSearch,setItemSearch]=useState(''),[category,setCategory]=useState('all'),[tag,setTag]=useState('all');
  const reviewIssue=reviewAvailability(game);
  const liveBoard=reviewIssue?[]:browseBoard(reviewedCatalog,{enemyHeroIds:enemies,allowActives:true,ownedItemIds:[],responseWindow:'unknown'},{patch:`client-${game.clientVersion}`,allowSourceReviewed:true});
  const covered=new Set(liveBoard.flatMap(column=>column.results.flatMap(r=>r.coveredEnemyIds)));
  const uncovered=enemies.filter(id=>!covered.has(id));
  const filtered=game.items.filter(i=>(category==='all'||i.category===category)&&(tag==='all'||i.sourceTags.includes(tag))&&i.name.toLowerCase().includes(itemSearch.toLowerCase()));
  const tags=[...new Set(game.items.flatMap(i=>i.sourceTags))].sort();
  return <main style={{'--weapon':game.colors.weapon,'--vitality':game.colors.vitality,'--spirit':game.colors.spirit} as React.CSSProperties}>
    <section className="scenario" aria-label="Enemy selection">
      <fieldset className="threats"><legend>Who is causing problems? · {enemies.length} selected</legend>
        <label className="search"><span className="sr-only">Find a hero</span><input type="search" value={heroSearch} onChange={e=>setHeroSearch(e.target.value)} placeholder="Find a hero"/></label>
        <div className="hero-grid">{heroes.filter(h=>h.name.toLowerCase().includes(heroSearch.toLowerCase())).map(h=><label title={h.name} className={'hero-choice '+(enemies.includes(h.id)?'selected':'')} key={h.id}><input type="checkbox" checked={enemies.includes(h.id)} onChange={e=>setEnemies(ids=>e.target.checked?[...ids,h.id]:ids.filter(id=>id!==h.id))}/><Artwork src={h.portrait}/><span>{h.name}</span></label>)}</div>
        {!heroes.some(h=>h.name.toLowerCase().includes(heroSearch.toLowerCase()))&&<p>No matching heroes.</p>}
      </fieldset>
      {!!enemies.length&&<p className="selected-threats">Selected threats: {enemies.map(heroName).join(' + ')}</p>}
    </section>
    <section aria-label="Item options" className="advisor"><h2>Item options</h2>
      {reviewIssue?<div className="empty" role="status">{reviewIssue}</div>:<>
        {(!enemies.length||uncovered.length>0)&&<p className="coverage-note" role="status">{enemies.length?'No eligible advice for '+uncovered.map(heroName).join(' + ')+'.':'Select enemies to see options.'}</p>}
        <AdviceBoard board={liveBoard} catalog={reviewedCatalog} game={game}/>
      </>}
    </section>
    <ResearchCoverage game={game} catalog={reviewedCatalog}/>
    <section className="shop" aria-label="Imported item catalog"><h2>Explore the item catalog</h2><p>Shop tiers give you compact lists to browse. They describe price tiers, not verified early/mid/late suitability or enemy counters. Tier 5 is kept separate because mode availability needs review.</p>
      <div className="catalog-filters"><label>Find an item<input type="search" placeholder="Search items" value={itemSearch} onChange={e=>setItemSearch(e.target.value)}/></label><label>Item category<select value={category} onChange={e=>setCategory(e.target.value)}>{['all','weapon','vitality','spirit'].map(c=><option key={c}>{c}</option>)}</select></label><label>Source shop tag<select value={tag} onChange={e=>setTag(e.target.value)}><option value="all">All tags</option>{tags.map(t=><option key={t} value={t}>{t.replaceAll('_',' ')}</option>)}</select></label></div>
      <p className="legend">{filtered.length} matching items · <span className="weapon">Weapon</span> · <span className="vitality">Vitality</span> · <span className="spirit">Spirit</span> · active status labeled independently.</p>
      <div className="shop-tiers">{[1,2,3,4].map(tier=>{const items=filtered.filter(i=>i.tier===tier);return <section key={tier}><h3>Tier {tier} · {['','Entry purchases','Lower-cost options','Larger investments','Late-cost options'][tier]}</h3><p>{items.length} items</p>{items.slice(0,4).map(i=><ItemCard key={i.id} item={i}/>)}{items.length>4&&<details className="more-items"><summary>Show {items.length-4} more items</summary>{items.slice(4).map(i=><ItemCard key={i.id} item={i}/>)}</details>}{!items.length&&<p className="small-empty">No items match these filters.</p>}</section>;})}</div>
      <details className="special"><summary>Special tier 5 · {filtered.filter(i=>i.tier===5).length} items · availability unreviewed</summary><div className="shop-tiers">{filtered.filter(i=>i.tier===5).map(i=><ItemCard key={i.id} item={i}/>)}</div></details>
    </section>
    <footer><details><summary>Data & review details</summary><p>Client {game.clientVersion} · {game.counts.selectableHeroes} source-selectable heroes · {game.items.length} source shop items · pulled {game.importedAt.slice(0,10)} UTC.</p><p>Source reviews: {reviewDates}. Advice is conditional and has not been tested in-game. Community data may lag the game.</p></details><p>Data and asset URLs: <a href={game.source} target="_blank" rel="noreferrer">Deadlock API</a> · Game artwork belongs to Valve. Unofficial community project.</p><p>Snapshot client {game.clientVersion}. Limited source-reviewed advice; see card evidence and review dates. <a href="https://github.com/matcpn/deadlock-counter-advisor">Source & refresh instructions</a></p></footer>
  </main>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
