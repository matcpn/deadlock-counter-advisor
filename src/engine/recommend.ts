import type { Catalog, Goal, Recommendation, Scenario, Weights } from '../domain/types';
import { parseCatalog, validateScenario, validateWeights } from '../domain/validate';
export const goals: Goal[] = ['survive', 'disrupt', 'punish'];
export interface RecommendationOptions { demo?: boolean; patch?: string; allowSourceReviewed?: boolean; asOf?: string }
/** Demo opt-in is explicit. Production must default to verified rules and items. */
export function recommend(catalog: Catalog, scenario: Scenario, weights: Weights,
  options: RecommendationOptions = {}): Recommendation[] {
  parseCatalog(catalog);
  validateScenario(scenario, catalog);
  validateWeights(weights);
  const asOf = options.asOf ?? new Date().toISOString().slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(asOf) || !Number.isFinite(Date.parse(asOf)) || new Date(asOf).toISOString().slice(0,10) !== asOf) throw new Error('Invalid evaluation date');
  const eligible = (e: Catalog['items'][number]['evidence']) => options.demo
    ? e.status === 'demo'
    : catalog.manifest.kind === 'production' && (e.status === 'verified' ||
      (options.allowSourceReviewed === true && e.status === 'source-reviewed')) && !!options.patch &&
      catalog.manifest.gamePatchId === options.patch && e.patch === options.patch &&
      (!e.expiresAt || asOf < e.expiresAt) && (!e.reviewedAt || asOf >= e.reviewedAt);
  const results: Recommendation[] = [];
  for (const item of catalog.items) {
    if (!eligible(item.evidence) || scenario.ownedItemIds.includes(item.id) ||
        (!scenario.allowActives && item.activation === 'active')) continue;
    for (const goal of goals) {
      const rules = catalog.rules.filter(r => r.itemId === item.id && r.goal === goal &&
        eligible(r.evidence) && scenario.enemyHeroIds.includes(r.enemyHeroId) &&
        (!r.playerHeroIds || r.playerHeroIds.includes(scenario.heroId)) &&
        !(scenario.responseWindow === 'stunned-or-slept' && (r.response === 'before-control' || r.response === 'after-debuff')) &&
        r.stages.includes(scenario.stage) && r.problems.some(p => scenario.problems.includes(p)));
      if (!rules.length) continue;
      // More rules for a single enemy must not manufacture multi-enemy coverage.
      const coveredEnemyIds = [...new Set(rules.map(r => r.enemyHeroId))];
      const best = Math.max(...rules.map(r => r.strength));
      const score = best * weights.strength + item.fit[scenario.build] * weights.buildFit +
        (coveredEnemyIds.length - 1) * weights.extraEnemy;
      results.push({ item, goal, score, affordable: item.cost <= scenario.budget, coveredEnemyIds, rules });
    }
  }
  return results.sort((a,b) => Number(b.affordable)-Number(a.affordable) || b.score-a.score || a.item.id.localeCompare(b.item.id));
}
