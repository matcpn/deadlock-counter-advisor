import profiles from '../data/advice-groups.json';
import type { BrowseItem } from './browse';

/** Presentation only: use already-eligible results, preserve scopes, show each item once. */
export function groupAdvice(results: BrowseItem[], focusHeroId?: string) {
  const profile=profiles.find(p=>p.heroId===focusHeroId);
  if(!profile || results.some(r=>r.coveredEnemyIds.some(id=>id!==focusHeroId))) return null;
  const remaining=new Map(results.map(r=>[r.item.id,r]));
  const groups=profile.groups.map(group=>({
    id:group.id,title:group.title,description:group.description,
    results:group.itemIds.flatMap(id=>{
      const result=remaining.get(id);
      if(!result)return [];
      remaining.delete(id);
      return [result];
    })
  })).filter(group=>group.results.length);
  // Future reviewed options remain visible even before editorial placement.
  if(remaining.size)groups.push({id:'other',title:'Other reviewed options',description:'Check the individual conditions for these options.',results:[...remaining.values()]});
  return groups;
}
