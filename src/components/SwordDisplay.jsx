import {
  successRate, enhanceCost, sellPrice, fragmentRequirements,
  swordSacrificeRequired, zoneKey,
} from '../utils/formulas.js';
import { FRAGMENT_LABELS, WEAPON_NAMES, WEAPON_DESCRIPTIONS } from '../constants/gameConfig.js';
import { getWeaponSpriteStyle, getRarityKey } from '../utils/weaponAssets.js';

export default function SwordDisplay({ sword, fragments, storage, activeBoost }) {
  if (!sword) {
    return (
      <div className="sword-stage empty">
        <p className="no-sword-hint">보관함에서 검을 꺼내거나<br />새 게임을 시작하세요.</p>
      </div>
    );
  }

  const level     = sword.level;
  const rarityKey = getRarityKey(level);
  const spriteStyle = getWeaponSpriteStyle(level);
  const nextLevel = level + 1;
  const zone      = zoneKey(nextLevel);
  const rate      = successRate(nextLevel);
  const cost      = enhanceCost(nextLevel);
  const sell      = sellPrice(level);
  const fragReqMap = fragmentRequirements(nextLevel);
  const fragEntries = Object.entries(fragReqMap);
  const sacrifices = swordSacrificeRequired(nextLevel);

  // Boost
  const boosting = activeBoost && Date.now() < activeBoost.expiresAt;
  const boostBonus = boosting ? (activeBoost?.bonusPct ?? 0) : 0;
  const displayRate = Math.min(rate + boostBonus, 95);

  const hasFragments = fragEntries.every(([key, req]) => (fragments[key] ?? 0) >= req);
  const hasSacrifices = sacrifices.every(
    (reqLv) => storage.some((s) => s.level === reqLv)
  );
  const canEnhance = (fragEntries.length === 0 || hasFragments) && (sacrifices.length === 0 || hasSacrifices);

  return (
    <div className={`sword-stage sword-theme-${rarityKey}`}>
      {/* Name + level */}
      <div className="sword-name-row">
        <span className="sword-name">{WEAPON_NAMES[level] ?? sword.name}</span>
        {level > 0 && <span className="sword-level-badge">+{level}</span>}
      </div>

      <div className="sword-showcase">
        <div className="sword-image-box" aria-label="무기 이미지">
          {spriteStyle ? (
            <div className="sword-sprite" style={spriteStyle} />
          ) : (
            <span className="sword-placeholder-icon">⚔️</span>
          )}
        </div>

        <aside className="sword-lore">
          <div className="sword-lore-head">전승 기록</div>
          <p className="sword-lore-text">{WEAPON_DESCRIPTIONS[level] ?? getSwordDescription(level)}</p>
        </aside>
      </div>

      {/* Stats row */}
      <div className="sword-stats">
        <span className="stat-chip">강화 성공률 <strong>{displayRate}%</strong>{boosting ? ' ⚡' : ''}</span>
        <span className="stat-chip">강화 비용 <strong>{cost.toLocaleString()} G</strong></span>
        <span className="stat-chip">판매가 <strong>{sell.toLocaleString()} G</strong></span>
      </div>

      {/* Materials */}
      {(fragEntries.length > 0 || sacrifices.length > 0) && (
        <div className="sword-materials">
          <span className="mat-label">강화 재료</span>
          {fragEntries.map(([key, req]) => {
            const has = (fragments[key] ?? 0) >= req;
            return (
              <span key={key} className={`mat-chip ${has ? '' : 'missing'}`}>
                {FRAGMENT_LABELS[key]} ×{req}
                &nbsp;({fragments[key] ?? 0} 보유)
              </span>
            );
          })}
          {sacrifices.map((lv) => {
            const has = storage.some((s) => s.level === lv);
            return (
              <span key={lv} className={`mat-chip ${has ? '' : 'missing'}`}>
                검 +{lv} 소모
              </span>
            );
          })}
          {!canEnhance && (
            <span className="mat-warn">재료가 부족합니다</span>
          )}
        </div>
      )}
    </div>
  );
}

function getSwordDescription(level) {
  if (level === 0)  return '평범한 철검입니다. 모든 여정이 여기서 시작됩니다.';
  if (level <= 10)  return '단조의 열기가 검에 어리기 시작했습니다.';
  if (level <= 20)  return '날카로운 기운이 검 전체에 퍼져 있습니다.';
  if (level <= 30)  return '룬이 새겨진 검에서 신비한 빛이 납니다.';
  if (level <= 40)  return '고대의 힘이 검에 깃들어 공기를 진동시킵니다.';
  if (level < 50)   return '전설의 불꽃이 검에 타오르고 있습니다.';
  return '세계 최강의 검. 그 이름만으로도 적들이 도망칩니다.';
}

