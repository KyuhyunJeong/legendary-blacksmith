import {
  ZONE_NAMES,
  ENHANCEMENT_TABLE,
  FRAGMENT_DROP_TABLE,
  SWORD_SACRIFICE,
  REPAIR_UNLOCK_MILESTONES,
  BASE_MAX_REPAIR,
  STORAGE_TIERS,
} from '../constants/gameConfig.js';

// ─── Rounding ────────────────────────────────────────────────────────────────
export function roundNice(v) {
  if (v < 1000)   return Math.round(v / 10)    * 10;
  if (v < 10000)  return Math.round(v / 100)   * 100;
  if (v < 100000) return Math.round(v / 1000)  * 1000;
  return            Math.round(v / 10000) * 10000;
}

// ─── Zone helpers ─────────────────────────────────────────────────────────────
// Returns 0-based zone index (0 = levels 1-10, 4 = levels 41-50)
export const zoneIndex = (level) => Math.min(4, Math.floor((Math.max(1, level) - 1) / 10));
export const zoneKey   = (level) => ZONE_NAMES[zoneIndex(level)];

// ─── Enhancement table helpers ────────────────────────────────────────────────
// ENHANCEMENT_TABLE is 0-indexed: entry 0 = lv1 data, entry 49 = lv50 data
const row = (level) => ENHANCEMENT_TABLE[level - 1] ?? ENHANCEMENT_TABLE[0];

export const successRate        = (level) => row(level).s;
export const repairableFailRate = (level) => row(level).r;
export const destroyRate        = (level) => row(level).d;
export const enhanceCost        = (level) => row(level).cost;
export const firstRepairCost    = (level) => row(level).repair;
export const sellPrice          = (level) => row(level).sell;

// Actual repair cost scales by 8% per repair already used this weapon
export const actualRepairCost = (level, repairUsed) =>
  Math.round(firstRepairCost(level) * (1 + 0.08 * repairUsed));

// ─── Max repair count (by maxSuccessLevel reached ever in this run) ──────────
export const maxRepairCount = (maxSuccessLv) => {
  let cap = BASE_MAX_REPAIR;
  for (const [lvStr, newCap] of Object.entries(REPAIR_UNLOCK_MILESTONES)) {
    if (maxSuccessLv >= Number(lvStr)) cap = newCap;
  }
  return cap;
};

// ─── Fragment requirements per target level ───────────────────────────────────
const FRAGMENT_REQUIREMENTS = {
  12: { worn:    2 },
  20: { worn:    3 },
  24: { steel:   3 },
  30: { steel:   4 },
  36: { rune:    5 },
  41: { ancient: 4 },
  46: { worn:    3 },
  47: { steel:   3 },
  48: { rune:    3 },
  49: { ancient: 3, legend: 1 },
  50: { legend:  2 },
};

export const fragmentRequirements = (level) => FRAGMENT_REQUIREMENTS[level] ?? {};

// Backward compatibility helper
export const fragmentRequired = (level) =>
  Object.values(fragmentRequirements(level)).reduce((sum, n) => sum + n, 0);

// ─── Sword sacrifice / storage requirement ────────────────────────────────────
// Returns { consume: [], require: [] }
export const swordSacrificeRequired = (level) =>
  SWORD_SACRIFICE[level] ?? { consume: [], require: [] };

// ─── Fragment drop on destroy ─────────────────────────────────────────────────
export function fragmentDropRoll(level) {
  let tableKey;
  if (level <= 10)       tableKey = 'worn';
  else if (level <= 20)  tableKey = 'steel';
  else if (level <= 30)  tableKey = 'rune';
  else if (level <= 40)  tableKey = 'ancient';
  else if (level <= 45)  tableKey = 'legend_lo';
  else                   tableKey = 'legend_hi';

  const table = FRAGMENT_DROP_TABLE[tableKey] ?? FRAGMENT_DROP_TABLE.worn;
  const totalWeight = table.reduce((s, e) => s + e.weight, 0);
  const r = Math.random() * totalWeight;
  let acc = 0;
  for (const entry of table) {
    acc += entry.weight;
    if (r < acc) return entry.count;
  }
  return 0;
}

// ─── Storage upgrade ──────────────────────────────────────────────────────────
// Returns the next tier entry ({ slots, price }) or null if already at max
export const storageNextTier = (currentSlots) =>
  STORAGE_TIERS.find((t) => t.slots > currentSlots) ?? null;

export const storageNextTierCost = (currentSlots) =>
  storageNextTier(currentSlots)?.price ?? null;

