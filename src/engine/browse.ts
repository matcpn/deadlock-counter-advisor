import type { Catalog, CounterRule, Item, Scenario } from '../domain/types';
import { parseCatalog } from '../domain/validate';
import { evidenceEligibility, type RecommendationOptions } from './recommend';
import { stages } from './board';

export interface BrowseItem { item: Item; rules: CounterRule[]; coveredEnemyIds: string[] }
export interface BrowsePreferences {
  enemyHeroIds: string[]; allowActives: boolean; ownedItemIds: string[];
  responseWindow: Scenario['responseWindow'];
}
/** Unpersonalized options: retain per-rule player scope and never claim affordability. */
export function browseBoard(catalog: Catalog, preferences: BrowsePreferences, options: RecommendationOptions) {
  parseCatalog(catalog);
  const eligible = evidenceEligibility(catalog, options);
  return stages.map(stage => {
    const results: BrowseItem[] = [];
    for (const item of catalog.items) {
      if (!eligible(item.evidence) || preferences.ownedItemIds.includes(item.id) ||
        (!preferences.allowActives && item.activation === 'active')) continue;
      const rules = catalog.rules.filter(rule => rule.itemId === item.id && eligible(rule.evidence) &&
        preferences.enemyHeroIds.includes(rule.enemyHeroId) && rule.stages.includes(stage.id) &&
        (!rule.playerHeroIds || rule.playerHeroIds.some(id => id !== rule.enemyHeroId)) &&
        !(preferences.responseWindow === 'stunned-or-slept' && rule.response && rule.response !== 'passive'));
      if (rules.length) results.push({ item, rules, coveredEnemyIds: [...new Set(rules.map(r => r.enemyHeroId))] });
    }
    // Price-first browsing avoids comparing scores across different objectives or inventing a build.
    results.sort((a,b) => a.item.cost-b.item.cost || b.coveredEnemyIds.length-a.coveredEnemyIds.length || a.item.id.localeCompare(b.item.id));
    return { stage: stage.id, label: stage.label, results };
  });
}
