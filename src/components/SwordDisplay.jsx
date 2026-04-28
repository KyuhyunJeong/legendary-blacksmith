import { useState } from 'react';
import {
  successRate, enhanceCost, sellPrice, fragmentRequirements,
  swordSacrificeRequired, zoneKey,
} from '../utils/formulas.js';
import {
  FRAGMENT_LABELS,
  FRAGMENT_LABELS_EN,
  WEAPON_NAMES,
  WEAPON_DESCRIPTIONS,
  WEAPON_DESCRIPTIONS_EN,
} from '../constants/gameConfig.js';
import { getWeaponSpriteStyle, getRarityKey } from '../utils/weaponAssets.js';

function parseName(raw = '') {
  const parts = raw.split(' / ');
  return {
    ko: parts[0]?.trim() ?? '???',
    en: parts[1]?.trim() ?? parts[0]?.trim() ?? '???',
  };
}

export default function SwordDisplay({ sword, fragments, storage, activeBoost, lang, cardNotif }) {
  const [overlayOpen, setOverlayOpen] = useState(false);

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
  const sellNext  = sellPrice(nextLevel);
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

  const { ko: nameKo, en: nameEn } = parseName(WEAPON_NAMES[level] ?? sword.name ?? '');
  const weaponName = lang === 'ko' ? nameKo : nameEn;

  const loreKo = WEAPON_DESCRIPTIONS[level] ?? getSwordDescription(level, 'ko');
  const loreEn = WEAPON_DESCRIPTIONS_EN[level] ?? getSwordDescription(level, 'en');
  const lore = lang === 'ko' ? loreKo : loreEn;

  const t = lang === 'ko' ? {
    chronicle:  '전승 기록',
    successRate:'강화 성공률',
    cost:       '강화 비용',
    sell:       '판매가',
    sellNext:   '강화 후 판매가',
    mats:       '강화 재료',
    swordReq:   '검',
    consume:    '소모',
    missing:    '재료가 부족합니다',
    owned:      '보유',
  } : {
    chronicle:  'Chronicle',
    successRate:'Success',
    cost:       'Cost',
    sell:       'Sell',
    sellNext:   'Next Sell',
    mats:       'Materials',
    swordReq:   'Sword',
    consume:    'req.',
    missing:    'Insufficient materials',
    owned:      'owned',
  };

  return (
    <div className={`sword-stage sword-theme-${rarityKey}`} onClick={() => setOverlayOpen(true)}>
      {/* Name row (no +level badge) */}
      <div className="sword-name-row">
        <span className="sword-name">{weaponName}</span>
      </div>

      <div className="sword-showcase">
        <div className="sword-image-box" aria-label="무기 이미지">
          {spriteStyle ? (
            <div className="sword-sprite" style={spriteStyle} />
          ) : (
            <span className="sword-placeholder-icon">⚔️</span>
          )}
          {cardNotif && (
            <div className={`sword-card-notif sword-card-notif--${cardNotif.type}`}>
              {cardNotif.message}
            </div>
          )}
        </div>

        <aside className="sword-lore">
          <div className="sword-lore-head">
            <span>{t.chronicle}</span>
          </div>
          <p className="sword-lore-text">{lore}</p>
        </aside>
      </div>

      {/* Stats row */}
      <div className="sword-stats">
        <span className="stat-chip">{t.successRate} <strong>{displayRate}%</strong>{boosting ? ' ⚡' : ''}</span>
        <span className="stat-chip">{t.cost} <strong>{cost.toLocaleString()} G</strong></span>
        <span className="stat-chip">{t.sell} <strong>{sell.toLocaleString()} G</strong></span>
      </div>

      {/* Materials */}
      {(fragEntries.length > 0 || sacrifices.length > 0) && (
        <div className="sword-materials">
          <span className="mat-label">{t.mats}</span>
          {fragEntries.map(([key, req]) => {
            const has = (fragments[key] ?? 0) >= req;
            return (
              <span key={key} className={`mat-chip ${has ? '' : 'missing'}`}>
                {(lang === 'en' ? FRAGMENT_LABELS_EN : FRAGMENT_LABELS)[key]} ×{req}
                &nbsp;({fragments[key] ?? 0} {t.owned})
              </span>
            );
          })}
          {sacrifices.map((lv) => {
            const has = storage.some((s) => s.level === lv);
            return (
              <span key={lv} className={`mat-chip ${has ? '' : 'missing'}`}>
                {t.swordReq} +{lv} {t.consume}
              </span>
            );
          })}
          {!canEnhance && (
            <span className="mat-warn">{t.missing}</span>
          )}
        </div>
      )}

      {/* Mobile info overlay */}
      <div
        className={`sword-info-overlay${overlayOpen ? ' is-open' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="sio-close" onClick={() => setOverlayOpen(false)}>✕</button>

        {/* Chronicle / Lore */}
        <div className="sio-section">
          <div className="sio-label">{t.chronicle}</div>
          <p className="sio-lore">{lore}</p>
        </div>

        {/* Stats */}
        <div className="sio-section">
          <div className="sio-label">{lang === 'ko' ? '강화 정보' : 'Enhance Info'}</div>
          <div className="sio-chips">
            <span className="stat-chip">{t.successRate} <strong>{displayRate}%</strong>{boosting ? ' ⚡' : ''}</span>
            <span className="stat-chip">{t.cost} <strong>{cost.toLocaleString()} G</strong></span>
            <span className="stat-chip">{t.sell} <strong>{sell.toLocaleString()} G</strong></span>
            <span className="stat-chip">{t.sellNext} <strong>{sellNext.toLocaleString()} G</strong></span>
          </div>
        </div>

        {/* Materials */}
        {(fragEntries.length > 0 || sacrifices.length > 0) && (
          <div className="sio-section">
            <div className="sio-label">{t.mats}</div>
            <div className="sio-mats">
              {fragEntries.map(([key, req]) => {
                const has = (fragments[key] ?? 0) >= req;
                return (
                  <span key={key} className={`mat-chip ${has ? '' : 'missing'}`}>
                    {(lang === 'en' ? FRAGMENT_LABELS_EN : FRAGMENT_LABELS)[key]} ×{req}
                    &nbsp;({fragments[key] ?? 0} {t.owned})
                  </span>
                );
              })}
              {sacrifices.map((lv) => {
                const has = storage.some((s) => s.level === lv);
                return (
                  <span key={lv} className={`mat-chip ${has ? '' : 'missing'}`}>
                    {t.swordReq} +{lv} {t.consume}
                  </span>
                );
              })}
              {!canEnhance && (
                <span className="mat-warn">{t.missing}</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function getSwordDescription(level, lang = 'ko') {
  if (lang === 'en') {
    if (level === 0)  return 'A plain iron sword. Every journey begins here.';
    if (level <= 10)  return 'The heat of the forge begins to settle into the blade.';
    if (level <= 20)  return 'A sharp energy radiates from the entire sword.';
    if (level <= 30)  return 'A mysterious light emanates from the rune-etched blade.';
    if (level <= 40)  return 'Ancient power dwells within, making the air tremble.';
    if (level < 50)   return 'The legendary flame burns within the sword.';
    return 'The world\'s greatest blade. Enemies flee at its name alone.';
  }
  if (level === 0)  return '평범한 철검입니다. 모든 여정이 여기서 시작됩니다.';
  if (level <= 10)  return '단조의 열기가 검에 어리기 시작했습니다.';
  if (level <= 20)  return '날카로운 기운이 검 전체에 퍼져 있습니다.';
  if (level <= 30)  return '룬이 새겨진 검에서 신비한 빛이 납니다.';
  if (level <= 40)  return '고대의 힘이 검에 깃들어 공기를 진동시킵니다.';
  if (level < 50)   return '전설의 불꽃이 검에 타오르고 있습니다.';
  return '세계 최강의 검. 그 이름만으로도 적들이 도망칩니다.';
}

