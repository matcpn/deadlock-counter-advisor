import type { Catalog, Goal, Recommendation, Scenario, Weights } from '../domain/types';
import { parseCatalog, validateScenario, validateWeights } from '../domain/validate';
export const goals: Goal[] = ['survive', 'disrupt', 'punish'];
/** Demo opt-in is explicit. Production must default to verified rules and items. */
export function recommend(catalog: Catalog, scenario: Scenario, weights: Weights,
  options: { demo?: boolean; patch?: string } = {}): Recommendation[] {
  parseCatalog(catalog);
  validateScenario(scenario, catalog);
  validateWeights(weights);
  const eligible = (e: Catalog['items'][number]['evidence']) => options.demo
    ? e.status === 'demo'
    : catalog.manifest.kind === 'production' && e.status === 'verified' && !!options.patch &&
      catalog.manifest.gamePatchId === options.patch && e.patch === options.patch;
  const results: Recommendation[] = [];
  for (const item of catalog.items) {
    if (!eligible(item.evidence) || scenario.ownedItemIds.includes(item.id) ||
        (!scenario.allowActives && item.activation === 'active')) continue;
    for (const goal of goals) {
      const rules = catalog.rules.filter(r => r.itemId === item.id && r.goal === goal &&
        eligible(r.evidence) && scenario.enemyHeroIds.includes(r.enemyHeroId) &&
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
