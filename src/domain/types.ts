export type Goal = 'survive' | 'disrupt' | 'punish';
export type Stage = 'lane' | 'mid' | 'late';
export type Problem = 'burst' | 'sustain' | 'control' | 'escape' | 'dot';
export type Build = 'spirit' | 'weapon' | 'hybrid';
export type ReviewStatus = 'verified' | 'source-reviewed' | 'needs-review' | 'demo';
export interface Hero { id: string; name: string }
export interface Evidence {
  status: ReviewStatus; patch: string; sourceUrls: string[];
  reviewedAt: string | null; note: string;
  claims: string[]; reviewer: string | null;
  expiresAt?: string;
}
export interface Source { id: string; url: string; title: string; accessedAt: string }
export interface Manifest {
  schemaVersion: 1; dataVersion: string; gamePatchId: string; scoringVersion: string;
  kind: 'demo' | 'production'; sources: Source[];
  coverage: { completeRoster: boolean; note: string };
}
export interface Item {
  id: string; name: string; category: 'weapon' | 'vitality' | 'spirit';
  activation: 'active' | 'passive' | 'conditional'; cost: number;
  fit: Record<Build, number>; evidence: Evidence;
  componentIds: string[];
}
export interface CounterRule {
  id: string; itemId: string; enemyHeroId: string; goal: Goal;
  problems: Problem[]; stages: Stage[]; strength: number;
  mechanism: string; limitation: string; timing: string; evidence: Evidence;
  playerHeroIds?: string[];
  conditions?: string[];
  response?: 'passive' | 'before-control' | 'after-debuff';
  stageReason?: string;
}
export interface Catalog { manifest: Manifest; heroes: Hero[]; items: Item[]; rules: CounterRule[] }
export interface Scenario {
  heroId: string; build: Build; enemyHeroIds: string[]; problems: Problem[];
  stage: Stage; budget: number; ownedItemIds: string[]; allowActives: boolean;
  responseWindow?: 'unknown' | 'can-act' | 'stunned-or-slept';
}
export interface Weights { strength: number; buildFit: number; extraEnemy: number }
export interface Recommendation {
  item: Item; goal: Goal; score: number; affordable: boolean;
  coveredEnemyIds: string[]; rules: CounterRule[];
}
