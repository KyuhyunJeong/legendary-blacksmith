import {
  ZONE_NAMES,
  FRAGMENT_DROP_TABLE,
  SWORD_SACRIFICE,
  PROTECTION_TICKETS_NEEDED,
} from '../constants/gameConfig.js';

// ─── Rounding ───────────────────────────────────────────────────────────────
export function roundNice(v) {
  if (v < 1000)   return Math.round(v / 10)    * 10;
  if (v < 10000)  return Math.round(v / 100)   * 100;
  if (v < 100000) return Math.round(v / 1000)  * 1000;
  return           Math.round(v / 10000) * 10000;
}

// ─── Zone helpers ────────────────────────────────────────────────────────────
// Returns 0-based zone index (0 = levels 1-10, 4 = levels 41-50)
export const zoneIndex = (level) => Math.min(4, Math.floor((Math.max(1, level) - 1) / 10));
export const zoneKey   = (level) => ZONE_NAMES[zoneIndex(level)];

// ─── Success rate ────────────────────────────────────────────────────────────
// Pre-computed rates (index 0 = +1, index 49 = +50)
export const SUCCESS_RATES = [
  // +1 ~ +10  (구간 체감 약 50%)
  98, 97, 96, 95, 94, 93, 92, 91, 90, 89,
  // +11 ~ +20 (구간 체감 약 20%)
  90, 89, 88, 87, 86, 85, 84, 83, 82, 81,
  // +21 ~ +30 (구간 체감 약 5%)
  88, 85, 82, 79, 76, 73, 70, 67, 64, 61,
  // +31 ~ +40 (구간 체감 약 1%)
  72, 70, 68, 66, 64, 62, 60, 58, 56, 54,
  // +41 ~ +50 (구간 체감 약 0.1%)
  65, 62, 59, 56, 53, 50, 47, 44, 41, 38,
];
export const successRate = (level) => SUCCESS_RATES[level - 1] ?? 1;

// ─── Enhancement cost ────────────────────────────────────────────────────────
// Exponential with Fibonacci "feel"
export const enhanceCost = (level) =>
  roundNice(100 * Math.pow(1.18, level - 1));

// ─── Sell price ──────────────────────────────────────────────────────────────
function cumulativeEnhanceCost(level) {
  let total = 0;
  for (let i = 1; i <= level; i++) total += roundNice(100 * Math.pow(1.18, i - 1));
  return total;
}
function getSellMultiplier(level) {
  return Math.min(1.15 + level * 0.035, 2.6);
}
export const sellPrice = (level) => {
  if (level === 0) return 0;
  return roundNice(cumulativeEnhanceCost(level) * getSellMultiplier(level));
};

// ─── Fragment requirements (multi-material) ─────────────────────────────────
const FRAGMENT_REQUIREMENTS = {
  // +11~20: 고대의 철편
  11: { worn: 1 },
  12: { worn: 1 },
  13: { worn: 1 },
  14: { worn: 2 },
  15: { worn: 2 },
  16: { worn: 2 },
  17: { worn: 3 },
  18: { worn: 3 },
  19: { worn: 4 },
  20: { worn: 5 },

  // +21~30: 직전 구간 부산물만 사용 (기사의 강철 조각)
  21: { steel: 1 },
  22: { steel: 1 },
  23: { steel: 2 },
  24: { steel: 2 },
  25: { steel: 3 },
  26: { steel: 3 },
  27: { steel: 4 },
  28: { steel: 4 },
  29: { steel: 5 },
  30: { steel: 6 },

  // +31~40: 직전 구간 부산물만 사용 (도깨비 혼 조각)
  31: { rune: 2 },
  32: { rune: 2 },
  33: { rune: 3 },
  34: { rune: 3 },
  35: { rune: 4 },
  36: { rune: 5 },
  37: { rune: 6 },
  38: { rune: 7 },
  39: { rune: 8 },
  40: { rune: 10 },

  // +41~50: 직전 구간 부산물만 사용 (영웅의 증표)
  41: { ancient: 4 },
  42: { ancient: 5 },
  43: { ancient: 6 },
  44: { ancient: 7 },
  45: { ancient: 9 },
  46: { ancient: 12 },
  47: { ancient: 12 },
  48: { ancient: 16 },
  49: { ancient: 22 },
  50: { ancient: 35 },
};

export const fragmentRequirements = (level) => FRAGMENT_REQUIREMENTS[level] ?? {};

// Backward compatibility: sum of all required fragments
export const fragmentRequired = (level) =>
  Object.values(fragmentRequirements(level)).reduce((sum, n) => sum + n, 0);

// ─── Sword sacrifices required ───────────────────────────────────────────────
// Returns [] if none, or an array of sword levels needed from storage
export const swordSacrificeRequired = (level) =>
  SWORD_SACRIFICE[level] ?? [];

// ─── Storage upgrade cost ────────────────────────────────────────────────────
// upgradeCount = number of upgrades already purchased (0-based)
export const storageUpgradeCost = (upgradeCount) =>
  roundNice(50000 * Math.pow(1.8, upgradeCount));

// ─── Fragment drop on destroy ────────────────────────────────────────────────
export function fragmentDropRoll(level) {
  const key = zoneKey(level);
  const table = FRAGMENT_DROP_TABLE[key] ?? FRAGMENT_DROP_TABLE.worn;
  const r = Math.random() * 100;
  let acc = 0;
  for (const row of table) {
    acc += row.weight;
    if (r < acc) return row.count;
  }
  return 0;
}

// ─── Protection ticket tier for a zone ──────────────────────────────────────
// Number of tickets required to activate protection at a given level
export const protectionRequired = (level) => PROTECTION_TICKETS_NEEDED[zoneIndex(level)];

// Ticket purchase price — scales with cumulative purchase count
export const protectionTicketPrice = (purchasedCount) =>
  roundNice(800 * Math.pow(1.07, purchasedCount));
