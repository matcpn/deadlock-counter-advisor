import type { Catalog, Scenario, Weights } from './types';

// No dependency or browser API needed: unknown imports cross this boundary first.
type Row = Record<string, unknown>;
function fail(path: string, message: string): never { throw new Error(`${path}: ${message}`); }
function row(value: unknown, path: string): Row {
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail(path, 'Expected object');
  return value as Row;
}
function list(value: unknown, path: string): unknown[] {
  if (!Array.isArray(value)) fail(path, 'Expected array');
  return value;
}
function string(value: unknown, path: string): string {
  if (typeof value !== 'string' || !value.trim()) fail(path, 'Expected nonempty string');
  return value;
}
function choice(value: unknown, values: readonly unknown[], path: string) {
  if (!values.includes(value)) fail(path, 'Invalid enum value');
}
function number(value: unknown, min: number, max: number, path: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max) fail(path, 'Invalid numeric range');
  return value;
}
function strings(value: unknown, path: string): string[] {
  const result = list(value, path).map((v, i) => string(v, `${path}[${i}]`));
  if (new Set(result).size !== result.length) fail(path, 'Duplicate value');
  return result;
}
function date(value: unknown, path: string) {
  const text = string(value, path);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text) || !Number.isFinite(Date.parse(text)) || new Date(text).toISOString().slice(0, 10) !== text) fail(path, 'Expected calendar date YYYY-MM-DD');
}
function url(value: unknown, path: string): string {
  const text = string(value, path);
  try { if (!['https:', 'http:'].includes(new URL(text).protocol)) fail(path, 'Expected HTTP source URL'); }
  catch { fail(path, 'Expected HTTP source URL'); }
  return text;
}
function entities(value: unknown, path: string): Row[] {
  const result = list(value, path).map((v, i) => row(v, `${path}[${i}]`));
  const ids = result.map((v, i) => string(v.id, `${path}[${i}].id`));
  if (new Set(ids).size !== ids.length) fail(path, 'Duplicate ID');
  return result;
}

export function parseCatalog(input: unknown): Catalog {
  const c = row(input, 'catalog');
  const m = row(c.manifest, 'manifest');
  choice(m.schemaVersion, [1], 'manifest.schemaVersion');
  for (const key of ['dataVersion', 'gamePatchId', 'scoringVersion']) string(m[key], `manifest.${key}`);
  choice(m.kind, ['demo', 'production'], 'manifest.kind');
  const coverage = row(m.coverage, 'manifest.coverage');
  choice(coverage.completeRoster, [true, false], 'coverage.completeRoster');
  string(coverage.note, 'coverage.note');
  const sources = entities(m.sources, 'sources');
  const urls = new Set(sources.map(s => {
    string(s.title, 'source.title'); date(s.accessedAt, 'source.accessedAt');
    return url(s.url, 'source.url');
  }));
  const heroes = entities(c.heroes, 'heroes');
  const items = entities(c.items, 'items');
  const rules = entities(c.rules, 'rules');
  const heroIds = new Set(heroes.map(h => h.id));
  const itemIds = new Set(items.map(i => i.id));
  const reference = (value: unknown, ids: Set<unknown>, path: string) => {
    if (!ids.has(value)) fail(path, 'Unresolved reference');
  };
  const evidence = (value: unknown, path: string, requiredClaims: string[]) => {
    const e = row(value, path);
    choice(e.status, ['demo', 'verified', 'source-reviewed', 'needs-review'], `${path}.status`);
    string(e.patch, `${path}.patch`); string(e.note, `${path}.note`);
    const claims = strings(e.claims, `${path}.claims`);
    const links = strings(e.sourceUrls, `${path}.sourceUrls`);
    for (const link of links) { url(link, path); if (!urls.has(link)) fail(path, 'Source absent from manifest'); }
    if (e.reviewedAt !== null) date(e.reviewedAt, `${path}.reviewedAt`);
    if (e.reviewer !== null) string(e.reviewer, `${path}.reviewer`);
    if (m.kind === 'demo' && e.status !== 'demo') fail(path, 'Demo catalog must contain only demo evidence');
    if (m.kind === 'production' && e.status === 'demo') fail(path, 'Synthetic evidence forbidden in production catalog');
    if (e.expiresAt !== undefined) {
      date(e.expiresAt, `${path}.expiresAt`);
      if (!e.reviewedAt || String(e.expiresAt) <= String(e.reviewedAt)) fail(path, 'Expiry must follow review');
    }
    if (e.status === 'source-reviewed' && !e.expiresAt) fail(path, 'Source review requires expiry');
    if (e.status === 'verified' || e.status === 'source-reviewed') {
      if (e.patch !== m.gamePatchId) fail(path, 'Verified evidence patch differs from manifest');
      if (!links.length || !e.reviewedAt || !e.reviewer || requiredClaims.some(claim => !claims.includes(claim))) fail(path, 'Verified evidence is incomplete');
    }
  };
  for (const h of heroes) string(h.name, 'hero.name');
  for (const i of items) {
    const path = `item.${i.id}`;
    string(i.name, `${path}.name`);
    choice(i.category, ['weapon', 'vitality', 'spirit'], `${path}.category`);
    choice(i.activation, ['active', 'passive', 'conditional'], `${path}.activation`);
    const cost = number(i.cost, 1, Number.MAX_SAFE_INTEGER, `${path}.cost`);
    if (!Number.isSafeInteger(cost)) fail(path, 'Cost must be a whole number');
    const fit = row(i.fit, `${path}.fit`);
    for (const build of ['spirit', 'weapon', 'hybrid']) number(fit[build], 0, 1, `${path}.fit.${build}`);
    for (const id of strings(i.componentIds, `${path}.componentIds`)) reference(id, itemIds, path);
    evidence(i.evidence, `${path}.evidence`, ['cost', 'category', 'activation', 'components']);
  }
  const visiting = new Set<unknown>(), visited = new Set<unknown>();
  const byId = new Map(items.map(i => [i.id, i]));
  const visit = (id: unknown) => {
    if (visiting.has(id)) fail('components', 'Upgrade cycle');
    if (visited.has(id)) return;
    visiting.add(id);
    for (const child of byId.get(id)!.componentIds as string[]) visit(child);
    visiting.delete(id); visited.add(id);
  };
  for (const id of itemIds) visit(id);
  for (const r of rules) {
    const path = `rule.${r.id}`;
    reference(r.itemId, itemIds, `${path}.itemId`); reference(r.enemyHeroId, heroIds, `${path}.enemyHeroId`);
    choice(r.goal, ['survive', 'disrupt', 'punish'], `${path}.goal`);
    for (const [key, allowed] of [['problems', ['burst', 'sustain', 'control', 'escape', 'dot']], ['stages', ['lane', 'mid', 'late']]] as const) {
      const values = strings(r[key], `${path}.${key}`);
      if (!values.length) fail(path, 'Rule scope must not be empty');
      values.forEach(v => choice(v, allowed, `${path}.${key}`));
    }
    number(r.strength, 0, 1, `${path}.strength`);
    for (const key of ['mechanism', 'limitation', 'timing']) string(r[key], `${path}.${key}`);
    evidence(r.evidence, `${path}.evidence`, ['interaction', 'timing', 'limitations']);
    if (r.playerHeroIds !== undefined) {
      const players = strings(r.playerHeroIds, `${path}.playerHeroIds`);
      if (!players.length) fail(path, 'Player scope must not be empty');
      players.forEach(id => reference(id, heroIds, path));
    }
    if (r.conditions !== undefined && !strings(r.conditions, `${path}.conditions`).length) fail(path, 'Conditions must not be empty');
    if (r.response !== undefined) choice(r.response, ['passive', 'before-control', 'after-debuff', 'while-actionable'], `${path}.response`);
    if (r.stageReason !== undefined) string(r.stageReason, `${path}.stageReason`);
    if (row(r.evidence, path).status === 'source-reviewed' &&
        (!r.playerHeroIds || !r.conditions || !r.response || !r.stageReason)) fail(path, 'Source-reviewed rule requires scope, conditions, response and stage rationale');
  }
  return input as Catalog;
}

export function validateScenario(input: unknown, catalog: Catalog): asserts input is Scenario {
  const s = row(input, 'scenario');
  const heroIds = new Set(catalog.heroes.map(h => h.id));
  const enemies = strings(s.enemyHeroIds, 'enemyHeroIds');
  if (!heroIds.has(s.heroId as string) || enemies.some(id => !heroIds.has(id))) fail('scenario', 'Unknown hero');
  if (enemies.includes(s.heroId as string)) fail('scenario', 'Player hero cannot also be an enemy');
  choice(s.build, ['spirit', 'weapon', 'hybrid'], 'build');
  choice(s.stage, ['lane', 'mid', 'late'], 'stage');
  strings(s.problems, 'problems').forEach(p => choice(p, ['burst', 'sustain', 'control', 'escape', 'dot'], 'problems'));
  if (s.responseWindow !== undefined) choice(s.responseWindow, ['unknown', 'can-act', 'stunned-or-slept'], 'responseWindow');
  if (typeof s.budget !== 'number' || !Number.isSafeInteger(s.budget) || s.budget < 0) fail('budget', 'Invalid budget');
  const items = new Set(catalog.items.map(i => i.id));
  if (strings(s.ownedItemIds, 'ownedItemIds').some(id => !items.has(id))) fail('ownedItemIds', 'Unknown owned item');
  choice(s.allowActives, [true, false], 'allowActives');
}

export function validateWeights(weights: Weights) {
  const w = row(weights, 'weights');
  for (const key of ['strength', 'buildFit', 'extraEnemy']) number(w[key], 0, Number.MAX_SAFE_INTEGER, `weights.${key}`);
}
