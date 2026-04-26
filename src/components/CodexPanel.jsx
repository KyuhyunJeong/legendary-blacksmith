import { useMemo, useState } from 'react';
import {
  successRate,
  enhanceCost,
  fragmentRequirements,
  swordSacrificeRequired,
  protectionRequired,
} from '../utils/formulas.js';
import { FRAGMENT_LABELS, WEAPON_DESCRIPTIONS, WEAPON_NAMES } from '../constants/gameConfig.js';
import { getWeaponSpriteStyle, getRarityKey } from '../utils/weaponAssets.js';

const ZONE_FILTERS = [
  { value: 'all', label: '전체 구간' },
  { value: 'z1', label: '1-10' },
  { value: 'z2', label: '11-20' },
  { value: 'z3', label: '21-30' },
  { value: 'z4', label: '31-40' },
  { value: 'z5', label: '41-50' },
];

const RARITY_FILTERS = [
  { value: 'all', label: '전체 희귀도' },
  { value: 'common', label: '낡은 병기' },
  { value: 'rare', label: '강철 병기' },
  { value: 'epic', label: '룬 병기' },
  { value: 'legendary', label: '영웅 병기' },
  { value: 'mythic', label: '신화 병기' },
];

export default function CodexPanel({ maxSuccessLevel, onClose }) {
  const unlockedMax = Math.max(0, Math.min(50, maxSuccessLevel ?? 0));
  const nextPreviewLevel = unlockedMax < 50 ? unlockedMax + 1 : null;
  const [zoneFilter, setZoneFilter] = useState('all');
  const [rarityFilter, setRarityFilter] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState(null);

  const filteredLevels = useMemo(() => {
    const records = [];
    for (let level = 1; level <= unlockedMax; level += 1) {
      records.push({
        level,
        zone: getZoneBucket(level),
        rarity: getRarityKey(level),
        isPreview: false,
      });
    }
    if (nextPreviewLevel) {
      records.push({
        level: nextPreviewLevel,
        zone: getZoneBucket(nextPreviewLevel),
        rarity: getRarityKey(nextPreviewLevel),
        isPreview: true,
      });
    }

    const visible = records.filter((item) => {
      if (zoneFilter !== 'all' && item.zone !== zoneFilter) return false;
      if (rarityFilter !== 'all' && item.rarity !== rarityFilter) return false;
      return true;
    });

    // Codex order is fixed to ascending level.
    visible.sort((a, b) => a.level - b.level);

    return visible;
  }, [nextPreviewLevel, rarityFilter, unlockedMax, zoneFilter]);

  return (
    <div className="panel-overlay" onClick={onClose}>
      <aside className="panel-box codex-panel" onClick={(e) => e.stopPropagation()}>
        <div className="panel-header">
          <h2>무기 도감</h2>
          <button className="panel-close" onClick={onClose}>✕</button>
        </div>

        <p className="codex-summary">
          현재 강화 성공 최고 단계: <strong>+{unlockedMax}</strong>
        </p>

        <div className="codex-controls">
          <div className="codex-filter-group">
            <span className="codex-filter-title">구간</span>
            <div className="codex-chip-row">
              {ZONE_FILTERS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`codex-chip ${zoneFilter === opt.value ? 'is-active' : ''}`}
                  onClick={() => setZoneFilter(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="codex-filter-group">
            <span className="codex-filter-title">희귀도</span>
            <div className="codex-chip-row">
              {RARITY_FILTERS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`codex-chip ${rarityFilter === opt.value ? 'is-active' : ''}`}
                  onClick={() => setRarityFilter(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="codex-filter-group codex-filter-order">
            <span className="codex-filter-title">정렬</span>
            <span className="codex-order-badge">레벨 오름차순 고정</span>
          </div>
        </div>

        <div className="codex-list">
          {filteredLevels.length === 0 && (
            <div className="codex-empty">
              현재 필터 조건에 맞는 기록이 없습니다.
            </div>
          )}

          {filteredLevels.map(({ level, isPreview }) => {
            const fragReqMap = fragmentRequirements(level);
            const fragEntries = Object.entries(fragReqMap);
            const sacrifices = swordSacrificeRequired(level);
            const spriteStyle = !isPreview ? getWeaponSpriteStyle(level) : null;

            return (
              <article
                key={level}
                className={`codex-card codex-rarity-${getRarityKey(level)} ${isPreview ? 'codex-preview' : ''}`}
                onClick={() => !isPreview && setSelectedLevel(level)}
                role={!isPreview ? 'button' : undefined}
                tabIndex={!isPreview ? 0 : undefined}
                onKeyDown={(e) => {
                  if (isPreview) return;
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedLevel(level);
                  }
                }}
              >
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
                      <h3>{WEAPON_NAMES[level] ?? `+${level} 검`}</h3>
                      <span className="codex-level">+{level}</span>
                      {isPreview && <span className="codex-next-tag">다음 도전</span>}
                    </div>
                    <p className="codex-desc">{WEAPON_DESCRIPTIONS[level] ?? '기록이 없습니다.'}</p>
                  </div>
                </div>

                <div className="codex-stats">
                  <span>성공률 <strong>{successRate(level)}%</strong></span>
                  <span>강화 비용 <strong>{enhanceCost(level).toLocaleString()} G</strong></span>
                  <span>필요 파손 방지권 <strong>{protectionRequired(level)}개</strong></span>
                </div>

                {(fragEntries.length > 0 || sacrifices.length > 0) && (
                  <div className="codex-mats">
                    <span className="codex-mats-label">필요 재료</span>
                    {fragEntries.map(([key, req]) => (
                      <span key={`${level}-${key}`} className="codex-mat-chip">
                        {FRAGMENT_LABELS[key]} ×{req}
                      </span>
                    ))}
                    {sacrifices.map((reqLv) => (
                      <span key={`${level}-sac-${reqLv}`} className="codex-mat-chip codex-mat-sword">
                        검 +{reqLv} 소모
                      </span>
                    ))}
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {selectedLevel && (
          <div className="codex-zoom-overlay" onClick={() => setSelectedLevel(null)}>
            <div className="codex-zoom-box" onClick={(e) => e.stopPropagation()}>
              <div className="journal-zoom-head">
                <h3>{WEAPON_NAMES[selectedLevel] ?? `+${selectedLevel} 검`}</h3>
                <button className="panel-close" onClick={() => setSelectedLevel(null)}>✕</button>
              </div>

              <div className="codex-zoom-body">
                <div className={`codex-zoom-thumb codex-rarity-${getRarityKey(selectedLevel)}`}>
                  {getWeaponSpriteStyle(selectedLevel) ? (
                    <div className="codex-zoom-sprite" style={getWeaponSpriteStyle(selectedLevel)} />
                  ) : (
                    <span className="codex-fallback">⚔️</span>
                  )}
                </div>

                <div className="codex-zoom-copy">
                  <div className="codex-title-row">
                    <h3>{WEAPON_NAMES[selectedLevel] ?? `+${selectedLevel} 검`}</h3>
                    <span className="codex-level">+{selectedLevel}</span>
                  </div>
                  <p className="codex-zoom-desc">{WEAPON_DESCRIPTIONS[selectedLevel] ?? '기록이 없습니다.'}</p>
                  <div className="codex-stats">
                    <span>성공률 <strong>{successRate(selectedLevel)}%</strong></span>
                    <span>강화 비용 <strong>{enhanceCost(selectedLevel).toLocaleString()} G</strong></span>
                    <span>필요 파손 방지권 <strong>{protectionRequired(selectedLevel)}개</strong></span>
                  </div>

                  {(() => {
                    const fragEntries = Object.entries(fragmentRequirements(selectedLevel));
                    const sacrifices = swordSacrificeRequired(selectedLevel);
                    if (fragEntries.length === 0 && sacrifices.length === 0) return null;
                    return (
                      <div className="codex-mats">
                        <span className="codex-mats-label">필요 재료</span>
                        {fragEntries.map(([key, req]) => (
                          <span key={`zoom-${selectedLevel}-${key}`} className="codex-mat-chip">
                            {FRAGMENT_LABELS[key]} ×{req}
                          </span>
                        ))}
                        {sacrifices.map((reqLv) => (
                          <span key={`zoom-sac-${selectedLevel}-${reqLv}`} className="codex-mat-chip codex-mat-sword">
                            검 +{reqLv} 소모
                          </span>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        )}
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
