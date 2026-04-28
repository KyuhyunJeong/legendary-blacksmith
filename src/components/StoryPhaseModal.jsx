import { useMemo, useState } from 'react';
import { STORY_PHASES } from '../constants/gameConfig.js';
import { getStoryPhaseImage } from '../utils/weaponAssets.js';

export default function StoryPhaseModal({ phaseKey, onClose, showHideFutureToggle = true, lang }) {
  const en = lang === 'en';
  const phase = STORY_PHASES[phaseKey];
  const [hideFuture, setHideFuture] = useState(false);
  const closeLabel = en
    ? (phaseKey === 'phaseOmega' ? 'Farewell to the Flame' : 'Light the Forge')
    : (phaseKey === 'phaseOmega' ? '불과의 작별' : '불 지피기');
  const storyLines = useMemo(() => {
    if (!phase) return [];
    if (en) {
      const lines = [...(phase.monologueEn ?? phase.monologue ?? [])];
      if (phase.worldEn ?? phase.world) lines.push(phase.worldEn ?? phase.world);
      return lines;
    }
    const lines = [...(phase.monologue ?? [])];
    if (phase.world) lines.push(phase.world);
    return lines;
  }, [phase, en]);
  const imageSrc = getStoryPhaseImage(phaseKey);

  if (!phase) return null;

  function handleClose() {
    onClose?.({ dontShowAgain: showHideFutureToggle && hideFuture });
  }

  return (
    <div className="modal-overlay story-overlay" onClick={handleClose}>
      <section className="modal-box story-box" onClick={(e) => e.stopPropagation()}>
        <h2 className="story-title">{en ? (phase.subtitle ?? phase.title) : phase.title}</h2>

        {imageSrc && (
          <div className="story-image-wrap">
            <img src={imageSrc} alt={phase.title} className="story-image" />
          </div>
        )}

        <div className="story-content">
          {storyLines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>

        {showHideFutureToggle && (
          <label className="story-hide-toggle">
            <input
              type="checkbox"
              checked={hideFuture}
              onChange={(e) => setHideFuture(e.target.checked)}
            />
            {en ? "Don't show story popups again" : '앞으로 스토리 팝업 표시 안 함'}
          </label>
        )}

        <div className="story-actions">
          <button className="btn-primary" onClick={handleClose}>{closeLabel}</button>
        </div>
      </section>
    </div>
  );
}
