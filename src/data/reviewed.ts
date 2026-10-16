import data from './reviewed-catalog.json';
import { parseCatalog } from '../domain/validate';
import type { GameSnapshot } from '../domain/game-data';
export const reviewedCatalog = parseCatalog(data);

/** Fail closed after a refresh or review expiry; fetching facts never renews advice. */
export function reviewAvailability(game: GameSnapshot, asOf = new Date().toISOString().slice(0, 10)): string | null {
  if (reviewedCatalog.manifest.gamePatchId !== `client-${game.clientVersion}`) return 'The game snapshot changed. These recommendations need a new source review.';
  const evidence = [...reviewedCatalog.items, ...reviewedCatalog.rules].map(row => row.evidence);
  if (evidence.some(e => !e.expiresAt || asOf >= e.expiresAt || asOf < e.reviewedAt!)) return 'The recommendation review has expired or is outside its review period. Refresh and review the sources before using this advice.';
  for (const item of reviewedCatalog.items) {
    const imported = game.items.find(i => i.id === item.id);
    if (!imported || item.name !== imported.name || item.cost !== imported.cost || item.category !== imported.category ||
        (item.activation === 'active') !== (imported.activation === 'active') ||
        JSON.stringify(item.componentIds) !== JSON.stringify(imported.componentIds)) return 'Reviewed item facts differ from the imported catalog. Advice is paused pending review.';
  }
  return null;
}
