import {useMemo,useState} from 'react';
import inventoryJson from '../data/threat-inventory.json';
import taxonomy from '../data/research-functions.json';
import plan from '../../data/research/research-plan.json';
import {buildCoverage,researchBacklog,type ThreatInventory} from '../domain/research';
import type {Catalog} from '../domain/types';
import type {GameSnapshot} from '../domain/game-data';
import {problemAreas} from '../engine/board';

const inventory=inventoryJson as ThreatInventory;
const statusLabels={'conditional':'Conditional','verified':'Reviewed','needs-review':'Needs review','needs-research':'Research gap'};
export function ResearchCoverage({game,catalog}:{game:GameSnapshot;catalog:Catalog}){
  const [search,setSearch]=useState('');
  const asOf=new Date().toISOString().slice(0,10);
  const coverage=useMemo(()=>buildCoverage(game,catalog,asOf),[game,catalog,asOf]);
  const backlog=useMemo(()=>researchBacklog(inventory,coverage,taxonomy),[coverage]);
  const name=(id:string)=>game.heroes.find(h=>h.id===id)?.name??id;
  const label=(id:string)=>taxonomy.functions.find(f=>f.id===id)?.label??id;
  const supported=coverage.filter(h=>h.cells.some(c=>c.ruleIds.length)).length;
  const profiles=inventory.heroes.filter(h=>h.name.toLowerCase().includes(search.trim().toLowerCase()));
  const gaps=inventory.heroes.flatMap(h=>h.abilities.filter(a=>a.gaps.length).map(a=>({hero:h.name,...a})));
  return <details className="research-coverage">
    <summary>Roster research & coverage · {supported}/{coverage.length} enemies with partial advice</summary>
    <p>Every source-selectable hero has a main-ability inventory. Counter research is incomplete. A conditional cell means some advice exists for that problem, not that every ability or build is covered.</p>
    <p>Client {inventory.clientVersion} · tooltip triage {inventory.triagedAt} · advice availability checked {asOf} UTC. This view spans all supported player heroes; your budget, inventory and response window still determine the cards above.</p>
    <label className="search">Find a hero in the research inventory<input type="search" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Filter coverage and abilities"/></label>
    <div className="coverage-scroll" role="region" aria-label="All-hero coverage matrix" tabIndex={0}>
      <table className="coverage-table"><caption>Enemy × problem · expand a populated cell for stages and scope</caption>
        <thead><tr><th scope="col">Enemy hero</th>{problemAreas.map(p=><th scope="col" key={p.id}>{p.label}</th>)}</tr></thead>
        <tbody>{profiles.map(h=><tr key={h.heroId}><th scope="row">{h.name}{h.development&&<small>Development flag</small>}</th>{problemAreas.map(p=>{
          const cell=coverage.find(c=>c.heroId===h.heroId)!.cells.find(c=>c.problem===p.id)!;
          return <td key={p.id}>{cell.ruleIds.length?<details className={'coverage-cell '+cell.status}><summary>{statusLabels[cell.status]} · {cell.ruleIds.length}</summary>
            <p>Rules: early {cell.stages.lane} / mid {cell.stages.mid} / late {cell.stages.late}.</p>
            <p>Goals: {cell.goals.join(', ')}.</p>
            <p>Player scope: {cell.playerHeroIds.length===1?name(cell.playerHeroIds[0]):`${cell.playerHeroIds.length} heroes across these rules; scope can differ per rule`}.</p>
            <p>Item coverage: {[...new Set(cell.ruleIds.map(id=>catalog.items.find(i=>i.id===catalog.rules.find(r=>r.id===id)!.itemId)!.name))].join(', ')}. Check card prerequisites before buying.</p>
          </details>:<span className={'coverage-status '+cell.status}>{statusLabels[cell.status]}</span>}</td>;
        })}</tr>)}</tbody>
      </table>
    </div>
    {!profiles.length&&<p role="status">No heroes match this search.</p>}
    <details><summary>Ability inventory · {profiles.length} {profiles.length===1?'hero':'heroes'}</summary>
      <p>These are manually selected tooltip themes, not verified interactions. Text includes upgrades; a listed effect may require an upgrade or condition. Base weapons, alternate kits and copied abilities are not exhaustively mapped.</p>
      {profiles.map(h=><details key={h.heroId} className="hero-profile"><summary>{h.name} · {h.abilities.length} main abilities</summary>
        {h.abilities.map(a=><article key={a.className}><h4>{a.name}</h4><p className="function-labels">{a.signals.map(s=>label(s.functionId)).join(' · ')||'Unclassified — inspect source'}</p>
          <p>{a.note}</p>{a.gaps.length>0&&<p className="research-gap">Open questions: {a.gaps.join(' ')}</p>}
          <details><summary>Source text & classification evidence</summary><p>{a.status} · client {inventory.clientVersion}</p><p>{a.description||'No description supplied.'}</p><ul>{a.signals.map(s=><li key={s.functionId}>{label(s.functionId)} ({s.source==='properties'?'raw properties':'tooltip'}): {s.quote}</li>)}</ul><a href={inventory.sourceUrl} target="_blank" rel="noreferrer">Pinned ability definitions</a></details>
        </article>)}
      </details>)}
    </details>
    <details><summary>Research queue · {gaps.length} abilities with source gaps</summary>
      <p>{plan.basis}</p>{plan.clientVersion!==game.clientVersion&&<p className="research-gap">The batch plan needs review for this snapshot.</p>}
      {plan.batches.map(batch=><section key={batch.title}><h3>{batch.title}</h3><p>{batch.heroIds.map(name).join(' · ')}</p><p>{batch.status}</p><ul>{batch.questions.map(q=><li key={q}>{q}</li>)}</ul></section>)}
      <details><summary>Source gaps to resolve</summary><ul>{gaps.map(a=><li key={a.className}><strong>{a.hero} / {a.name}:</strong> {a.gaps.join(' ')}</li>)}</ul></details>
      <details><summary>Group research by function</summary><p>Ordered by reach among heroes with no current advice. Function matches suggest questions to investigate; they never create counter rules.</p>
        {backlog.map(f=><article key={f.functionId}><h4>{f.label} · {f.heroCount} heroes</h4><p>{f.uncoveredHeroCount} have no current advice in any problem. {f.question}</p><p>Response families to investigate: {f.responseIds.map(id=>taxonomy.responses.find(r=>r.id===id)!.label).join(', ')||'Resolve this mechanic first.'}</p></article>)}
      </details>
    </details>
  </details>;
}
