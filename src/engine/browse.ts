import type { Catalog, CounterRule, Item, Scenario } from '../domain/types';
import { parseCatalog } from '../domain/validate';
import { evidenceEligibility, type RecommendationOptions } from './recommend';
import tiers from '../data/browse-tiers.json';

export interface BrowseItem { item: Item; rules: CounterRule[]; coveredEnemyIds: string[] }
/** Only summarize matched rules; never borrow guidance from another enemy. */
export function browseExplanations(result: BrowseItem) {
  const groups = new Map<string, { enemyIds: string[]; mechanism: string; decision?: CounterRule['decision'] }>();
  for (const rule of result.rules) {
    const key = JSON.stringify(rule.decision ?? rule.mechanism);
    const group = groups.get(key);
    if (group) {
      if (!group.enemyIds.includes(rule.enemyHeroId)) group.enemyIds.push(rule.enemyHeroId);
    } else groups.set(key, { enemyIds: [rule.enemyHeroId], mechanism: rule.mechanism, decision: rule.decision });
  }
  return [...groups.values()];
}
export interface BrowsePreferences {
  enemyHeroIds: string[]; allowActives: boolean; ownedItemIds: string[];
  responseWindow: Scenario['responseWindow'];
}
/** Price-tier browsing: retain rule scopes; these columns do not evaluate game stage. */
export function browseBoard(catalog: Catalog, preferences: BrowsePreferences, options: RecommendationOptions) {
  parseCatalog(catalog);
  const eligible = evidenceEligibility(catalog, options);
  return tiers.map(tier => {
    const results: BrowseItem[] = [];
    for (const item of catalog.items) {
      if (!tier.costs.includes(item.cost) || !eligible(item.evidence) || preferences.ownedItemIds.includes(item.id) ||
        (!preferences.allowActives && item.activation === 'active')) continue;
      const rules = catalog.rules.filter(rule => rule.itemId === item.id && eligible(rule.evidence) &&
        preferences.enemyHeroIds.includes(rule.enemyHeroId) &&
        (!rule.playerHeroIds || rule.playerHeroIds.some(id => id !== rule.enemyHeroId)) &&
        !(preferences.responseWindow === 'stunned-or-slept' && rule.response && rule.response !== 'passive'));
      if (rules.length) results.push({ item, rules, coveredEnemyIds: [...new Set(rules.map(r => r.enemyHeroId))] });
    }
    // Price-first browsing avoids comparing scores across different objectives or inventing a build.
    results.sort((a,b) => a.item.cost-b.item.cost || b.coveredEnemyIds.length-a.coveredEnemyIds.length || a.item.id.localeCompare(b.item.id));
    return { stage: tier.id, label: tier.label, priceLabel: tier.priceLabel, results };
  });
}
