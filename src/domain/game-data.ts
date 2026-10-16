/** Imported game facts are independent of the reviewed recommendation catalog. */
export interface GameHero {
  id: string; sourceId: number; className: string; name: string; portrait: string | null;
  selectable: boolean; disabled: boolean;
  abilities: {className: string; name: string; description: string}[];
}
export interface GameItem {
  id: string; sourceId: number; className: string; name: string;
  category: 'weapon' | 'vitality' | 'spirit'; cost: number; tier: number;
  activation: 'active' | 'non-active'; sourceActivation: string;
  image: string | null; description: string; componentIds: string[]; sourceTags: string[];
  properties: {name: string; value: string | null; label: string}[];
  tooltipSections: {heading: string; description: string; stats: {name: string; label: string; value: string}[]}[];
}
export interface GameSnapshot {
  schemaVersion: 1; clientVersion: number; importedAt: string;
  source: string; status: 'imported-unreviewed';
  heroes: GameHero[]; items: GameItem[];
  colors: Record<'weapon' | 'vitality' | 'spirit', string>;
  counts: {sourceHeroes: number; sourceItems: number; selectableHeroes: number; shopItems: number};
}
type Row = Record<string, unknown>;
const object = (v: unknown): Row => {
  if (!v || typeof v !== 'object' || Array.isArray(v)) throw new Error('Expected source object');
  return v as Row;
};
const text = (v: unknown): string => {
  if (typeof v !== 'string' || !v.trim()) throw new Error('Missing source string');
  return v;
};
const integer = (v: unknown): number => {
  if (typeof v !== 'number' || !Number.isSafeInteger(v) || v < 0) throw new Error('Invalid source number');
  return v;
};
const boolean = (v: unknown): boolean => {
  if (typeof v !== 'boolean') throw new Error('Missing source availability flag');
  return v;
};
const rows = (v: unknown): Row[] => {
  if (!Array.isArray(v) || !v.length) throw new Error('Empty or malformed source list');
  const result = v.map(object);
  const ids = result.map(r => integer(r.id));
  const names = result.map(r => text(r.class_name));
  if (new Set(ids).size !== ids.length || new Set(names).size !== names.length) throw new Error('Duplicate source identity');
  return result;
};
const strings = (v: unknown): string[] => {
  if (v == null) return [];
  if (!Array.isArray(v)) throw new Error('Expected source string list');
  return v.map(text);
};
const image = (v: unknown): string | null => {
  if (v == null) return null;
  const value = text(v), parsed = new URL(value);
  if (parsed.protocol !== 'https:' || parsed.hostname !== 'assets-bucket.deadlock-api.com') throw new Error('Unexpected asset URL');
  return value;
};
// Source markup is displayed as text, never injected as HTML.
export function plainText(v: unknown): string {
  if (typeof v !== 'string') return '';
  return v.replace(/<br\s*\/?\s*>/gi, '\n').replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').trim();
}
const description = (v: unknown): string => [...new Set(Object.values(object(v ?? {})).filter(x => typeof x === 'string').map(plainText).filter(Boolean))].join('\n\n');

/** Preserve source tooltip grouping and units; no item mechanics are supplied by the UI. */
function tooltipSections(item: Row): GameItem['tooltipSections'] {
  const properties=object(item.properties??{}), used=new Set<string>();
  const stat=(name:string)=>{
    const raw=properties[name];
    if(!raw) return []; // Some references are status icons, not numeric properties.
    const p=object(raw),value=p.value==null?'':String(p.value).trim();
    if(!value||!plainText(p.label)||used.has(name)) return [];
    used.add(name);
    const prefix=p.prefix==='{s:sign}'?(Number.parseFloat(value)>0?'+':''):plainText(p.prefix);
    const suffix=plainText(p.postfix);
    // Source strings can already include their unit (e.g. 45m), or a minus sign.
    const formatted=(prefix&& !value.startsWith(prefix)?prefix:'')+value+(suffix&&!value.endsWith(suffix)?suffix:'');
    return [{name,label:plainText(p.label),value:formatted}];
  };
  const sections:GameItem['tooltipSections']=[];
  if(item.tooltip_sections!=null&&!Array.isArray(item.tooltip_sections)) throw new Error('Invalid tooltip sections');
  for(const raw of (item.tooltip_sections??[]) as unknown[]){
    const section=object(raw),attrs=section.section_attributes??[];
    if(!Array.isArray(attrs)) throw new Error('Invalid tooltip attributes');
    const heading=section.section_type==='innate'?'Innate stats':section.section_type==='active'?'Active effect':section.section_type==='passive'?'Passive effect':'Item effect';
    for(const entry of attrs){
      const a=object(entry);
      const names=[...strings(a.elevated_properties),...strings(a.important_properties),...strings(a.properties)];
      const stats=names.flatMap(stat),description=plainText(a.loc_string).replace(/\n{3,}/g,'\n');
      if(stats.length||description)sections.push({heading,description,stats});
    }
  }
  // Useful labeled base values (e.g. Knockdown's stun duration) may be omitted
  // from tooltip_sections. Keep them separate rather than inventing an effect group.
  const extra=Object.entries(properties).filter(([name,raw])=>{
    const p=object(raw),v=p.value==null?'':String(p.value).trim();
    if(!v||!Number.isFinite(Number.parseFloat(v))||Number.parseFloat(v)===0||v===String(p.disable_value))return false;
    if(name==='AbilityCooldownBetweenCharge'&&Number.parseFloat(v)<0)return false;
    return !!plainText(p.label);
  }).flatMap(([name])=>stat(name));
  if(extra.length)sections.push({heading:'Additional base values',description:'',stats:extra});
  return sections;
}

export function normalizeGameData(rawHeroes: unknown, rawItems: unknown, rawColors: unknown,
  clientVersion: number, importedAt: string): GameSnapshot {
  integer(clientVersion);
  if (!Number.isFinite(Date.parse(importedAt))) throw new Error('Invalid import timestamp');
  const heroRows = rows(rawHeroes), itemRows = rows(rawItems);
  const byClass = new Map(itemRows.map(i => [text(i.class_name), i]));
  const visiting = new Set<string>(), visited = new Set<string>();
  const visit = (name: string) => {
    if(visiting.has(name)) throw new Error('Source component cycle');
    if(visited.has(name)) return;
    const item=byClass.get(name);
    if(!item || item.type!=='upgrade') throw new Error(`Unresolved component ${name}`);
    visiting.add(name);
    strings(item.component_items).forEach(visit);
    visiting.delete(name); visited.add(name);
  };
  itemRows.filter(i=>i.type==='upgrade').forEach(i=>visit(text(i.class_name)));
  const heroes: GameHero[] = heroRows.map(h => {
    const disabled = boolean(h.disabled);
    const selectable = boolean(h.player_selectable) && !disabled && !boolean(h.prerelease_only) &&
      !boolean(h.limited_testing) && !boolean(h.assigned_players_only);
    const images = object(h.images ?? {});
    return {id:`hero-${integer(h.id)}`, sourceId:integer(h.id),className:text(h.class_name),name:text(h.name),
      portrait:image(images.icon_image_small_webp ?? images.icon_image_small),selectable,disabled,
      abilities:Object.entries(object(h.items)).filter(([slot]) => /^signature[1-4]$/.test(slot)).map(([,name]) => {
        const ability = byClass.get(text(name));
        if (!ability) {
          if (selectable) throw new Error(`Unresolved selectable hero ability ${name}`);
          return {className:text(name),name:text(name),description:'Ability definition missing from source; unavailable hero.'};
        }
        return {className:text(ability.class_name),name:text(ability.name),description:description(ability.description)};
      })};
  }).sort((a,b) => a.name.localeCompare(b.name, 'en'));
  const items: GameItem[] = itemRows.filter(i => {
    if (!['ability','weapon','upgrade'].includes(text(i.type))) throw new Error('Unknown source entity type');
    if (i.type !== 'upgrade') return false;
    if (i.disabled != null) boolean(i.disabled);
    return boolean(i.shopable) && i.disabled !== true;
  }).map((i): GameItem => {
    const category = text(i.item_slot_type);
    if (!['weapon','vitality','spirit'].includes(category)) throw new Error('Unknown item category');
    const cost = integer(i.cost), tier = integer(i.item_tier);
    if (cost <= 0 || tier < 1 || tier > 5) throw new Error('Invalid shop cost/tier');
    const active = boolean(i.is_active_item), sourceActivation = text(i.activation);
    if(!['hold_toggle','instant_cast','on_button_is_down','passive','press','press_toggle','instant_cast_toggle'].includes(sourceActivation)) throw new Error('Unknown source activation');
    if ((sourceActivation === 'passive') === active) throw new Error('Contradictory activation fields');
    return {id:`item-${integer(i.id)}`,sourceId:integer(i.id),className:text(i.class_name),name:text(i.name),
      category:category as GameItem['category'],cost,tier,activation:active?'active':'non-active',sourceActivation,
      image:image(i.shop_image_webp ?? i.image_webp ?? i.shop_image ?? i.image),description:description(i.description),
      componentIds:strings(i.component_items).map(name => {
        const component = byClass.get(name);
        if (!component || component.type !== 'upgrade') throw new Error(`Unresolved component ${name}`);
        return `item-${integer(component.id)}`;
      }),sourceTags:strings(i.shop_filters),tooltipSections:tooltipSections(i),
      properties:Object.entries(object(i.properties ?? {})).map(([name,value]) => {
        const p = object(value);
        if(p.value != null && typeof p.value !== 'string' && !(typeof p.value === 'number'&&Number.isFinite(p.value))) throw new Error('Invalid property value');
        return {name,value:typeof p.value === 'number'?String(p.value):typeof p.value === 'string'&&p.value.trim()?p.value:null,label:typeof p.label === 'string'?plainText(p.label):name};
      })};
  }).sort((a,b) => a.cost-b.cost || a.name.localeCompare(b.name, 'en'));
  if (!heroes.some(h => h.selectable) || !items.length) throw new Error('No selectable heroes/shop items');
  const colors = object(rawColors);
  const hex = (key: string) => {
    const color = object(colors[key]);
    return '#'+['red','green','blue'].map(k => {const n=integer(color[k]); if(n>255) throw new Error('Invalid color'); return n.toString(16).padStart(2,'0');}).join('');
  };
  return {schemaVersion:1,clientVersion,importedAt,source:'https://api.deadlock-api.com/docs',status:'imported-unreviewed',heroes,items,
    colors:{weapon:hex('weapon_color'),vitality:hex('armor_color'),spirit:hex('spirit_bright_color')},
    counts:{sourceHeroes:heroRows.length,sourceItems:itemRows.length,selectableHeroes:heroes.filter(h=>h.selectable).length,shopItems:items.length}};
}

export function diffGameData(before: GameSnapshot | null, after: GameSnapshot) {
  const diff = <T extends {id: string}>(oldRows: T[], newRows: T[]) => {
    const old = new Map(oldRows.map(r=>[r.id,r])), next = new Map(newRows.map(r=>[r.id,r]));
    return {added:newRows.filter(r=>!old.has(r.id)).map(r=>r.id),removed:oldRows.filter(r=>!next.has(r.id)).map(r=>r.id),
      changed:newRows.filter(r=>old.has(r.id)&&JSON.stringify(old.get(r.id))!==JSON.stringify(r)).map(r=>r.id)};
  };
  return {fromVersion:before?.clientVersion??null,toVersion:after.clientVersion,
    heroes:diff(before?.heroes??[],after.heroes),items:diff(before?.items??[],after.items),
    colorsChanged:!!before&&JSON.stringify(before.colors)!==JSON.stringify(after.colors),
    reviewRequired:'Imported facts only. Review affected mechanics and counter rules before certifying recommendations.'};
}
