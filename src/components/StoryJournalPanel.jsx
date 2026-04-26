import { useMemo } from 'react';
import { STORY_PHASES } from '../constants/gameConfig.js';
import { getStoryPhaseImage, STORY_PHASE_ORDER } from '../utils/weaponAssets.js';

export default function StoryJournalPanel({
  maxSuccessLevel,
  seenStoryPhases = [],
  storyPopupsEnabled = true,
  onToggleStoryPopups,
  onOpenStoryPhase,
  onClose,
}) {
  const seenSet = useMemo(() => new Set(seenStoryPhases), [seenStoryPhases]);

  const records = useMemo(() => {
    return STORY_PHASE_ORDER.map((key, idx) => {
      const phase = STORY_PHASES[key];
      const unlocked = seenSet.has(key) || isUnlockedByProgress(key, maxSuccessLevel ?? 0);
      return {
        key,
        title: phase?.title ?? key,
        caption: phase?.caption ?? '',
        previewLine: phase?.monologue?.[0] ?? '',
        imageSrc: getStoryPhaseImage(key),
        unlocked,
        orderLabel: idx === 0 ? 'Prologue' : (idx === STORY_PHASE_ORDER.length - 1 ? 'Epilogue' : `Phase ${idx}`),
      };
    });
  }, [maxSuccessLevel, seenSet]);

  return (
    <div className="panel-overlay" onClick={onClose}>
      <aside className="panel-box journal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="panel-header">
          <h2>대장장이의 일기</h2>
          <button className="panel-close" onClick={onClose}>✕</button>
        </div>

        <section className="journal-settings">
          <span>스토리 자동 표시</span>
          <div className="journal-toggle-row">
            <button
              type="button"
              className={`journal-toggle ${storyPopupsEnabled ? 'is-active' : ''}`}
              onClick={() => onToggleStoryPopups?.(true)}
            >
              ON
            </button>
            <button
              type="button"
              className={`journal-toggle ${!storyPopupsEnabled ? 'is-active' : ''}`}
              onClick={() => onToggleStoryPopups?.(false)}
            >
              OFF
            </button>
          </div>
          <small>OFF여도 새로 해금되는 phase는 최소 1회 표시됩니다.</small>
        </section>

        <div className="journal-list">
          {records.map((item) => (
            <article
              key={item.key}
              className={`journal-card ${item.unlocked ? 'is-clickable' : 'is-locked'}`}
              onClick={() => item.unlocked && onOpenStoryPhase?.(item.key)}
              role={item.unlocked ? 'button' : undefined}
              tabIndex={item.unlocked ? 0 : undefined}
              onKeyDown={(e) => {
                if (!item.unlocked) return;
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onOpenStoryPhase?.(item.key);
                }
              }}
            >
              <div className="journal-thumb-wrap" title={item.unlocked ? '클릭해서 스토리 보기' : '해금 후 확인 가능'}>
                {item.imageSrc ? (
                  <img src={item.imageSrc} alt={item.title} className="journal-thumb" />
                ) : (
                  <div className="journal-thumb journal-empty">NO IMAGE</div>
                )}
              </div>

              <div className="journal-meta">
                <span className="journal-order">{item.orderLabel}</span>
                <strong>{item.unlocked ? item.title : '???'}</strong>
                <small>{item.unlocked ? item.caption : '해금 필요'}</small>
                {item.unlocked && item.previewLine && <p>{item.previewLine}</p>}
              </div>
            </article>
          ))}
        </div>
      </aside>
    </div>
  );
}

function isUnlockedByProgress(phaseKey, maxLevel) {
  if (phaseKey === 'phase0' || phaseKey === 'phase1') return maxLevel >= 1;
  if (phaseKey === 'phase2') return maxLevel >= 11;
  if (phaseKey === 'phase3') return maxLevel >= 21;
  if (phaseKey === 'phase4') return maxLevel >= 31;
  if (phaseKey === 'phase5') return maxLevel >= 41;
  if (phaseKey === 'phaseOmega') return maxLevel >= 50;
  return false;
}
