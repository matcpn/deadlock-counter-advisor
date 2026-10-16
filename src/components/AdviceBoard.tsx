import type { Catalog } from '../domain/types';
import type { GameSnapshot } from '../domain/game-data';
import type { browseBoard, BrowseItem } from '../engine/browse';
import { ItemDetails } from './ItemDetails';

export function AdviceBoard({board,catalog,game}:{board:ReturnType<typeof browseBoard>;catalog:Catalog;game:GameSnapshot}) {
  const name=(id:string)=>catalog.heroes.find(h=>h.id===id)?.name??id;
  const unique=(values:string[])=>[...new Set(values)];
  const conditionGroups=(r:BrowseItem)=>r.rules.map(rule=>({
    id:rule.id, enemy:name(rule.enemyHeroId), mechanism:rule.mechanism, conditions:rule.conditions??[],
    playerScope:rule.playerHeroIds && catalog.heroes.some(h=>h.id!==rule.enemyHeroId&&!rule.playerHeroIds!.includes(h.id))
      ? rule.playerHeroIds.map(name).join(', ') : null
  }));
  return <div className="stage-board">{board.map(column=><section key={column.stage} aria-label={column.label}>
    <h3>{column.label}</h3>
    {(()=>{
        const matches=column.results;
        const card=(r:BrowseItem)=><article className={'card advice-card '+r.item.category} key={r.item.id}>
            <div className="item-heading">{(()=>{const item=game.items.find(i=>i.id===r.item.id);return item?<ItemDetails item={item} game={game}/>:<h3>{r.item.name}</h3>;})()}<strong>{r.item.cost.toLocaleString()} souls</strong></div>
            <div className="badges"><span>{r.item.category}</span><span className={r.item.activation==='active'?'active':''}>{r.item.activation==='conditional'?'CONDITIONAL PROC':r.item.activation.toUpperCase()}</span></div>
            <p>For {r.coveredEnemyIds.map(name).join(' + ')}.</p>
            {unique(r.rules.map(rule=>rule.mechanism)).map(text=><p key={text}>{text}</p>)}
            {conditionGroups(r).filter(g=>g.playerScope).map(g=><p className="scope-note" key={g.id}>{g.enemy}: application reviewed for {g.playerScope}.</p>)}
            <details><summary>When to use, limits & sources</summary>
              <div className="conditions">{conditionGroups(r).map(group=><div key={group.id}><strong>{group.enemy}</strong><p>{group.mechanism}</p>{group.playerScope&&<p>Application reviewed for {group.playerScope}.</p>}<ul>{group.conditions.map(text=><li key={text}>{text}</li>)}</ul></div>)}</div>
              <strong>Timing</strong>{unique(r.rules.map(rule=>rule.timing)).map(text=><p key={text}>{text}</p>)}
              <strong>Does not solve</strong>{unique(r.rules.map(rule=>rule.limitation)).map(text=><p key={text}>{text}</p>)}
              {unique(r.rules.flatMap(rule=>rule.stageReason?[rule.stageReason]:[])).map(text=><p key={text}>{text}</p>)}
              {r.item.componentIds.length>0&&<p>Components: {r.item.componentIds.map(id=>catalog.items.find(i=>i.id===id)?.name??id).join(', ')}. Full price shown; upgrade credit is not calculated.</p>}
              <><p>Options are listed by price, then shared enemy coverage. Check the conditions for your hero and situation.</p>{r.rules.map(rule=><div className="evidence-note" key={rule.id}><strong>{name(rule.enemyHeroId)} · reviewed {rule.evidence.reviewedAt}</strong><p>{rule.evidence.note}</p></div>)}<p>{catalog.manifest.gamePatchId} · review expires {r.item.evidence.expiresAt}. No in-game tests performed.</p><ul>{unique([...r.item.evidence.sourceUrls,...r.rules.flatMap(rule=>rule.evidence.sourceUrls)]).map(url=><li key={url}><a href={url} target="_blank" rel="noreferrer">{catalog.manifest.sources.find(s=>s.url===url)?.title??'Evidence source'}</a></li>)}</ul></>
            </details>
          </article>;
        return matches.length?<>{matches.slice(0,4).map(card)}{matches.length>4&&<details className="more-items"><summary>Show {matches.length-4} more items</summary>{matches.slice(4).map(card)}</details>}</>:<p className="small-empty">No options for this stage with these preferences.</p>;
    })()}
  </section>)}</div>;
}
