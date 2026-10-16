import { useEffect, useId, useRef, useState } from 'react';
import type { GameItem, GameSnapshot } from '../domain/game-data';
import { Artwork } from './Artwork';

/** Native popover gives keyboard dismissal, light-dismiss and an unclipped top layer. */
export function ItemDetails({item,game}:{item:GameItem;game:GameSnapshot}) {
  const id=useId(),trigger=useRef<HTMLButtonElement>(null),panel=useRef<HTMLDivElement>(null);
  const closeButton=useRef<HTMLButtonElement>(null),pinned=useRef(false),timer=useRef<ReturnType<typeof setTimeout>|null>(null);
  const [open,setOpen]=useState(false);
  const cancel=()=>{if(timer.current)clearTimeout(timer.current);timer.current=null;};
  const position=()=>{
    if(!panel.current||!trigger.current)return;
    const box=trigger.current.getBoundingClientRect(),p=panel.current;
    const width=p.offsetWidth,height=p.offsetHeight,gap=10;
    p.style.left=`${Math.max(gap,Math.min(box.left,window.innerWidth-width-gap))}px`;
    const below=box.bottom+gap;
    p.style.top=`${Math.max(gap,Math.min(below+height<=window.innerHeight-gap?below:box.top-height-gap,window.innerHeight-height-gap))}px`;
  };
  const show=(pin=false)=>{
    cancel();pinned.current=pin||pinned.current;
    panel.current?.showPopover();position();
    if(pin)closeButton.current?.focus({preventScroll:true});
  };
  const hide=(restoreFocus=false)=>{
    cancel();pinned.current=false;panel.current?.hidePopover();
    if(restoreFocus)trigger.current?.focus({preventScroll:true});
  };
  const scheduleHide=()=>{
    cancel();
    if(!pinned.current)timer.current=setTimeout(()=>{
      if(!panel.current?.contains(document.activeElement))hide();
    },250);
  };
  useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current);},[]);
  useEffect(()=>{
    if(!open)return;
    const outside=(event:MouseEvent)=>{
      if(event.target instanceof Node&&!panel.current?.contains(event.target)&&!trigger.current?.contains(event.target))hide();
    };
    document.addEventListener('click',outside);
    window.addEventListener('resize',position);
    // A pinned panel remains usable while scrolling; keep it inside the viewport.
    window.addEventListener('scroll',position,true);
    return ()=>{document.removeEventListener('click',outside);window.removeEventListener('resize',position);window.removeEventListener('scroll',position,true);};
  },[open]);
  return <>
    <h3 className="item-details-heading"><button ref={trigger} className="item-details-trigger" aria-label={`Item stats and tooltip: ${item.name}`} aria-haspopup="dialog" aria-expanded={open} aria-controls={id}
      onPointerEnter={e=>{if(e.pointerType==='mouse')show();}} onPointerLeave={scheduleHide} onClick={()=>show(true)}>
      <Artwork src={item.image}/><span className="item-details-name">{item.name}<span className="item-details-hint">Stats & tooltip ⓘ</span></span>
    </button></h3>
    <div id={id} ref={panel} popover="auto" role="dialog" aria-labelledby={`${id}-title`} className={`item-popover ${item.category}`}
      onToggle={e=>{const shown=e.newState==='open';setOpen(shown);if(!shown){pinned.current=false;cancel();}}}
      onPointerEnter={cancel} onPointerLeave={scheduleHide}
      onKeyDown={e=>{if(e.key==='Escape'){e.preventDefault();hide(true);}}}>
      <div className="item-popover-header"><Artwork src={item.image}/><div><h3 id={`${id}-title`}>{item.name}</h3><p>{item.cost.toLocaleString()} souls · {item.category}</p></div><button ref={closeButton} className="item-popover-close" aria-label={`Close ${item.name} details`} onClick={()=>hide(true)}>×</button></div>
      <p className="item-base-note">Base item · client {game.clientVersion}. Before upgrades or scaling.</p>
      {!item.tooltipSections.some(s=>s.description)&&<p className="tooltip">{item.description||'No tooltip text supplied by the source.'}</p>}
      {item.tooltipSections.map((section,index)=><section className="item-stat-section" key={index}><h4>{section.heading}</h4>{section.description&&<p className="tooltip">{section.description}</p>}<dl>{section.stats.map(stat=><div key={stat.name}><dt>{stat.label}</dt><dd>{stat.value}</dd></div>)}</dl></section>)}
      {!!item.componentIds.length&&<p className="item-components">Components: {item.componentIds.map(id=>game.items.find(i=>i.id===id)?.name??id).join(', ')}.</p>}
      <nav aria-label={`${item.name} sources`} className="item-source-links"><a href={`https://deadlock.wiki/${encodeURIComponent(item.name.replaceAll(' ','_'))}`} target="_blank" rel="noreferrer">Item wiki ↗</a><a href={`https://api.deadlock-api.com/v1/assets/items/${item.sourceId}?client_version=${game.clientVersion}`} target="_blank" rel="noreferrer">Snapshot source ↗</a></nav>
    </div>
  </>;
}
