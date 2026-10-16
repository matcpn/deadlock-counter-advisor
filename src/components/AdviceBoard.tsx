import type { Catalog } from '../domain/types';
import type { GameSnapshot } from '../domain/game-data';
import { goals } from '../engine/recommend';
import type { recommendationBoard } from '../engine/board';
import { Artwork } from './Artwork';

export function AdviceBoard({board,catalog,game,budget,demo=false}:{board:ReturnType<typeof recommendationBoard>;catalog:Catalog;game:GameSnapshot;budget:number;demo?:boolean}) {
  const name=(id:string)=>catalog.heroes.find(h=>h.id===id)?.name??id;
  const unique=(values:string[])=>[...new Set(values)];
  return <div className="stage-board">{board.map(column=><section key={column.stage} aria-label={column.label}>
    <h3>{column.label}</h3>
    {goals.map(goal=><div className="objective" key={goal}><h4>{goal}</h4>
      {!column.results.some(r=>r.goal===goal)?<p className="small-empty">{demo?'No demo option.':'No source-supported option for this goal.'}</p>:[true,false].map(affordable=>{
        const matches=column.results.filter(r=>r.goal===goal&&r.affordable===affordable);
        return <div key={String(affordable)}><h5>{affordable?'Buy now':'Save for later'}</h5>
          {matches.length?matches.slice(0,3).map(r=><article className={'card advice-card '+r.item.category} key={r.item.id}>
            <div className="item-title">{!demo&&<Artwork src={game.items.find(i=>i.id===r.item.id)?.image??null}/>}<div><h3>{r.item.name}</h3><strong>{r.item.cost.toLocaleString()} souls</strong>{!affordable&&<small>{(r.item.cost-budget).toLocaleString()} more souls</small>}</div></div>
            <div className="badges"><span>{r.item.category}</span><span className={r.item.activation==='active'?'active':''}>{r.item.activation==='conditional'?'CONDITIONAL PROC':r.item.activation.toUpperCase()}</span><span>{demo?'SYNTHETIC':r.rules.every(rule=>rule.evidence.status==='verified')?'VERIFIED':'SOURCE-REVIEWED · BETA'}</span></div>
            <p>For {r.coveredEnemyIds.map(name).join(' + ')}{demo?'':' under the conditions below'}.</p>
            {unique(r.rules.map(rule=>rule.mechanism)).map(text=><p key={text}>{text}</p>)}
            {!demo&&<div className="conditions"><strong>Only if</strong><ul>{unique(r.rules.flatMap(rule=>rule.conditions??[])).map(text=><li key={text}>{text}</li>)}</ul></div>}
            <details><summary>When to use, limits & sources</summary>
              <strong>Timing</strong>{unique(r.rules.map(rule=>rule.timing)).map(text=><p key={text}>{text}</p>)}
              <strong>Does not solve</strong>{unique(r.rules.map(rule=>rule.limitation)).map(text=><p key={text}>{text}</p>)}
              {unique(r.rules.flatMap(rule=>rule.stageReason?[rule.stageReason]:[])).map(text=><p key={text}>{text}</p>)}
              {r.item.componentIds.length>0&&<p>Components: {r.item.componentIds.map(id=>catalog.items.find(i=>i.id===id)?.name??id).join(', ')}. Full price shown; upgrade credit is not calculated.</p>}
              {!demo&&<><p>Order uses problem strength, build fit and distinct enemy coverage. These are editorial preferences, not win-rate estimates.</p>{r.rules.map(rule=><div className="evidence-note" key={rule.id}><strong>{name(rule.enemyHeroId)} · reviewed {rule.evidence.reviewedAt}</strong><p>{rule.evidence.note}</p></div>)}<p>{catalog.manifest.gamePatchId} · review expires {r.item.evidence.expiresAt}. No in-game tests performed.</p><ul>{unique([...r.item.evidence.sourceUrls,...r.rules.flatMap(rule=>rule.evidence.sourceUrls)]).map(url=><li key={url}><a href={url} target="_blank" rel="noreferrer">{catalog.manifest.sources.find(s=>s.url===url)?.title??'Evidence source'}</a></li>)}</ul></>}
            </details>
          </article>):<p className="small-empty">{demo?'No demo option.':affordable?'No source-supported affordable option.':'No additional source-supported option.'}</p>}
        </div>;
      })}
    </div>)}
  </section>)}</div>;
}
