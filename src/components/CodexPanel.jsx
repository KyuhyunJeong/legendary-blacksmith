import { useMemo, useState } from 'react';
import {
  successRate,
  enhanceCost,
  fragmentRequirements,
  swordSacrificeRequired,
  sellPrice,
} from '../utils/formulas.js';
import {
  FRAGMENT_LABELS,
  FRAGMENT_LABELS_EN,
  WEAPON_DESCRIPTIONS,
  WEAPON_DESCRIPTIONS_EN,
  WEAPON_NAMES,
} from '../constants/gameConfig.js';
import { getWeaponSpriteStyle, getRarityKey } from '../utils/weaponAssets.js';

function parseName(raw = '') {
  const parts = raw.split(' / ');
  return {
    ko: parts[0]?.trim() ?? '???',
    en: parts[1]?.trim() ?? parts[0]?.trim() ?? '???',
  };
}

const ZONE_FILTERS = [
  { value: 'all', ko: '전체 구간',  en: 'All Zones' },
  { value: 'z1',  ko: '1-10',       en: '1–10' },
  { value: 'z2',  ko: '11-20',      en: '11–20' },
  { value: 'z3',  ko: '21-30',      en: '21–30' },
  { value: 'z4',  ko: '31-40',      en: '31–40' },
  { value: 'z5',  ko: '41-50',      en: '41–50' },
];

const RARITY_FILTERS = [
  { value: 'all',       ko: '전체 희귀도', en: 'All' },
  { value: 'common',    ko: '낡은 병기',   en: 'Ancient' },
  { value: 'rare',      ko: '강철 병기',   en: 'Iron' },
  { value: 'epic',      ko: '룬 병기',     en: 'Rune' },
  { value: 'legendary', ko: '영웅 병기',   en: 'Hero' },
  { value: 'mythic',    ko: '신화 병기',   en: 'Mythic' },
];

export default function CodexPanel({ maxSuccessLevel, onClose, lang = 'ko' }) {
  const [zoneFilter, setZoneFilter] = useState('all');
  const [rarityFilter, setRarityFilter] = useState('all');
  const [flipped, setFlipped] = useState(new Set());

  const t = lang === 'ko' ? {
    title:      '무기 도감',
    highest:    '강화 성공 최고 단계',
    zone:       '구간',
    rarity:     '희귀도',
    order:      '레벨 오름차순',
    orderLabel: '정렬',
    empty:      '현재 필터 조건에 맞는 기록이 없습니다.',
    next:       '다음 도전',
    chronicle:  '전승 기록',
    back:       '← 돌아가기',
    flipHint:   '전승 기록 →',
    successRate:'성공률',
    cost:       '강화 비용',
    shields:    '방지권',
    sellCur:    '현재 판매가',
    sellNext:   '다음 판매가',
    mats:       '필요 재료',
    sword:      '검',
    consume:    '소모',
    noRecord:   '이 검에 대한 기록은 전해지지 않는다.',
  } : {
    title:      'Weapon Codex',
    highest:    'Highest Enhancement',
    zone:       'Zone',
    rarity:     'Rarity',
    order:      'Level Ascending',
    orderLabel: 'Order',
    empty:      'No weapons match the current filters.',
    next:       'Next Target',
    chronicle:  'Chronicle',
    back:       '← Back',
    flipHint:   'Chronicle →',
    successRate:'Success',
    cost:       'Cost',
    shields:    'Shields',
    sellCur:    'Sell (cur)',
    sellNext:   'Sell (next)',
    mats:       'Materials',
    sword:      'Sword',
    consume:    'req.',
    noRecord:   'No records found for this weapon.',
  };

  function toggleFlip(level) {
    setFlipped((prev) => {
      const next = new Set(prev);
      if (next.has(level)) next.delete(level);
      else next.add(level);
      return next;
    });
  }

  const unlockedMax = Math.max(0, Math.min(50, maxSuccessLevel ?? 0));
  const nextPreviewLevel = unlockedMax < 50 ? unlockedMax + 1 : null;

  const filteredLevels = useMemo(() => {
    const records = [];
    for (let level = 1; level <= unlockedMax; level += 1) {
      records.push({ level, zone: getZoneBucket(level), rarity: getRarityKey(level), isPreview: false });
    }
    if (nextPreviewLevel) {
      records.push({ level: nextPreviewLevel, zone: getZoneBucket(nextPreviewLevel), rarity: getRarityKey(nextPreviewLevel), isPreview: true });
    }
    return records
      .filter((item) => {
        if (zoneFilter !== 'all' && item.zone !== zoneFilter) return false;
        if (rarityFilter !== 'all' && item.rarity !== rarityFilter) return false;
        return true;
      })
      .sort((a, b) => a.level - b.level);
  }, [nextPreviewLevel, rarityFilter, unlockedMax, zoneFilter]);

  return (
    <div className="panel-overlay" onClick={onClose}>
      <aside className="panel-box codex-panel" onClick={(e) => e.stopPropagation()}>
        <div className="panel-header">
          <h2>{t.title}</h2>
          <button className="panel-close" onClick={onClose}>✕</button>
        </div>

        <p className="codex-summary">
          {t.highest}: <strong>+{unlockedMax}</strong>
        </p>

        <div className="codex-controls">
          <div className="codex-filter-group">
            <span className="codex-filter-title">{t.zone}</span>
            <div className="codex-chip-row">
              {ZONE_FILTERS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`codex-chip ${zoneFilter === opt.value ? 'is-active' : ''}`}
                  onClick={() => setZoneFilter(opt.value)}
                >
                  {opt[lang]}
                </button>
              ))}
            </div>
          </div>

          <div className="codex-filter-group">
            <span className="codex-filter-title">{t.rarity}</span>
            <div className="codex-chip-row">
              {RARITY_FILTERS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`codex-chip ${rarityFilter === opt.value ? 'is-active' : ''}`}
                  onClick={() => setRarityFilter(opt.value)}
                >
                  {opt[lang]}
                </button>
              ))}
            </div>
          </div>

          <div className="codex-filter-group codex-filter-order">
            <span className="codex-filter-title">{t.orderLabel}</span>
            <span className="codex-order-badge">{t.order}</span>
          </div>
        </div>

        <div className="codex-list">
          {filteredLevels.length === 0 && (
            <div className="codex-empty">{t.empty}</div>
          )}

          {filteredLevels.map(({ level, isPreview }) => {
            const fragReqMap = fragmentRequirements(level);
            const fragEntries = Object.entries(fragReqMap);
            const sacrifices = swordSacrificeRequired(level);
            const consumeSwords = sacrifices.consume ?? [];
            const requireSwords = sacrifices.require ?? [];
            const spriteStyle = !isPreview ? getWeaponSpriteStyle(level) : null;
            const isFlipped = flipped.has(level);

            const { ko: nameKo, en: nameEn } = parseName(WEAPON_NAMES[level] ?? '');
            const weaponName = lang === 'ko' ? nameKo : nameEn;

            const lore = lang === 'ko'
              ? (WEAPON_DESCRIPTIONS[level] ?? t.noRecord)
              : (WEAPON_DESCRIPTIONS_EN[level] ?? t.noRecord);

            const curSell = sellPrice(level);
            const nextSell = level < 50 ? sellPrice(level + 1) : null;

            return (
              <article
                key={level}
                className={`codex-card codex-rarity-${getRarityKey(level)} ${isPreview ? 'codex-preview' : ''} ${isFlipped ? 'is-flipped' : ''}`}
                onClick={() => !isPreview && toggleFlip(level)}
                role={!isPreview ? 'button' : undefined}
                tabIndex={!isPreview ? 0 : undefined}
                onKeyDown={(e) => {
                  if (isPreview) return;
                  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleFlip(level); }
                }}
              >
                <div className="codex-card-inner">

                  {/* ── FRONT ── */}
                  <div className="codex-card-front">
                    <div className="codex-card-head">
                      <div className="codex-thumb" aria-hidden="true">
                        {spriteStyle ? (
                          <div className="codex-sprite" style={spriteStyle} />
                        ) : (
                          <span className="codex-fallback">{isPreview ? '???' : '⚔️'}</span>
                        )}
                      </div>
                      <div className="codex-title-wrap">
                        <div className="codex-title-row">
                          <h3 className="codex-weapon-name">{weaponName}</h3>
                          {isPreview && <span className="codex-next-tag">{t.next}</span>}
                          {!isPreview && <span className="codex-flip-hint">{t.flipHint}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="codex-stats">
                      <span>{t.successRate} <strong>{successRate(level)}%</strong></span>
                      <span>{t.cost} <strong>{enhanceCost(level).toLocaleString()} G</strong></span>
                    </div>
                    {(fragEntries.length > 0 || consumeSwords.length > 0 || requireSwords.length > 0) && (
                      <div className="codex-mats">
                        <span className="codex-mats-label">{t.mats}</span>
                        {fragEntries.map(([key, req]) => (
                          <span key={`${level}-${key}`} className="codex-mat-chip">
                          {(lang === 'ko' ? FRAGMENT_LABELS : FRAGMENT_LABELS_EN)[key]} ×{req}
                          </span>
                        ))}
                        {consumeSwords.map((reqLv) => (
                          <span key={`${level}-sac-${reqLv}`} className="codex-mat-chip codex-mat-sword">
                            {t.sword} +{reqLv} {t.consume}
                          </span>
                        ))}
                        {requireSwords.map((reqLv) => (
                          <span key={`${level}-req-${reqLv}`} className="codex-mat-chip codex-mat-sword">
                            {t.sword} +{reqLv} {lang === 'ko' ? '보유 필요' : 'req. (keep)'}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* ── BACK (전승 기록 / Chronicle) ── */}
                  <div className="codex-card-back">
                    <div className="codex-back-header">
                      <div className="codex-thumb" aria-hidden="true">
                        {spriteStyle ? (
                          <div className="codex-sprite" style={spriteStyle} />
                        ) : (
                          <span className="codex-fallback">⚔️</span>
                        )}
                      </div>
                      <div>
                        <h3 className="codex-weapon-name">{weaponName}</h3>
                        <p className="codex-back-subtitle">{t.chronicle}</p>
                      </div>
                    </div>
                    <div className="codex-back-stats">
                      <span>{t.successRate} <strong>{successRate(level)}%</strong></span>
                      <span>{t.cost} <strong>{enhanceCost(level).toLocaleString()} G</strong></span>
                      <span>{t.sellCur} <strong>{curSell.toLocaleString()} G</strong></span>
                      {nextSell !== null && (
                        <span>{t.sellNext} <strong>{nextSell.toLocaleString()} G</strong></span>
                      )}
                    </div>
                    <p className="codex-back-lore">{lore}</p>
                    <p className="codex-flip-hint codex-flip-hint--back">{t.back}</p>
                  </div>

                </div>
              </article>
            );
          })}
        </div>
      </aside>
    </div>
  );
}

function getZoneBucket(level) {
  if (level <= 10) return 'z1';
  if (level <= 20) return 'z2';
  if (level <= 30) return 'z3';
  if (level <= 40) return 'z4';
  return 'z5';
}
