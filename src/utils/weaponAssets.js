import sprite1to10 from '../../image/weapon_1_10.png';
import sprite11to20 from '../../image/weapon_11_20.png';
import sprite21to30 from '../../image/weapon_21_30.png';
import sprite31to40 from '../../image/weapon_31_40.png';
import sprite41to50 from '../../image/weapon_41_50.png';
import phase0Prologue from '../../image/phase0_prologue.png';
import phase1 from '../../image/phase1.png';
import phase2 from '../../image/phase2.png';
import phase3 from '../../image/phase3.png';
import phase4 from '../../image/phase4.png';
import phase5 from '../../image/phase5.png';
import phase6Epilogue from '../../image/phase6_epilogue.png';

const SPRITE_BATCHES = [
  { start: 1, end: 10, src: sprite1to10 },
  { start: 11, end: 20, src: sprite11to20 },
  { start: 21, end: 30, src: sprite21to30 },
  { start: 31, end: 40, src: sprite31to40 },
  { start: 41, end: 50, src: sprite41to50 },
];

const STORY_PHASE_IMAGE_BY_KEY = {
  phase0: phase0Prologue,
  phase1,
  phase2,
  phase3,
  phase4,
  phase5,
  phaseOmega: phase6Epilogue,
};

export const STORY_PHASE_ORDER = ['phase0', 'phase1', 'phase2', 'phase3', 'phase4', 'phase5', 'phaseOmega'];

export function hasWeaponImage(level) {
  return level >= 1 && level <= 50;
}

export function getWeaponSpriteStyle(level) {
  if (!hasWeaponImage(level)) return null;

  const batch = SPRITE_BATCHES.find((row) => level >= row.start && level <= row.end);
  if (!batch) return null;

  const index = level - batch.start; // 0..9 in each sheet
  const col = index % 5; // 0..4
  const row = Math.floor(index / 5); // 0..1

  return {
    backgroundImage: `url(${batch.src})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: '500% 200%',
    backgroundPosition: `${col * 25}% ${row * 100}%`,
  };
}

export function getRarityKey(level) {
  if (level <= 10) return 'common';
  if (level <= 20) return 'rare';
  if (level <= 30) return 'epic';
  if (level <= 40) return 'legendary';
  return 'mythic';
}

export function getRarityTheme(level) {
  const key = getRarityKey(level);
  const labelMap = {
    common: '고대',
    rare: '철기',
    epic: '민담',
    legendary: '영웅',
    mythic: '신화',
  };

  return { key, label: labelMap[key] };
}

export function getStoryPhaseImage(phaseKey) {
  return STORY_PHASE_IMAGE_BY_KEY[phaseKey] ?? null;
}
