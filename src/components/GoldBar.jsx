import { FRAGMENT_LABELS } from '../constants/gameConfig.js';

export default function GoldBar({
  gold,
  fragments,
  activeBoost,
  protectionTickets,
  onReturnMenu,
  onSecretPressStart,
  onSecretPressEnd,
}) {
  const now       = Date.now();
  const boostLeft = activeBoost ? Math.max(0, Math.ceil((activeBoost.expiresAt - now) / 1000)) : 0;
  const boosting  = boostLeft > 0;
  const boostBonus = activeBoost?.bonusPct ?? 0;

  const mins = Math.floor(boostLeft / 60);
  const secs = String(boostLeft % 60).padStart(2, '0');

  return (
    <header className="gold-bar">
      <div className="gold-side gold-side-left">
        <button className="btn-ghost btn-sm gold-menu-btn" onClick={onReturnMenu}>
          ← 메뉴
        </button>
      </div>

      <div className="gold-center">
        <button
          className="gold-amount secret-tap-target"
          onMouseDown={onSecretPressStart}
          onMouseUp={onSecretPressEnd}
          onMouseLeave={onSecretPressEnd}
          onTouchStart={onSecretPressStart}
          onTouchEnd={onSecretPressEnd}
          onTouchCancel={onSecretPressEnd}
          title="골드 5초 롱프레스: 치트 해금"
        >
          <span className="gold-icon">🪙</span>
          <span>{gold.toLocaleString()} G</span>
        </button>

        <div className="fragment-list">
          {(protectionTickets ?? 0) > 0 && (
            <span className="frag-chip frag-protection" title="파손 방지권">
              🛡️ 방지권 ×{protectionTickets}
            </span>
          )}
          {Object.entries(FRAGMENT_LABELS).map(([key, label]) => (
            <span key={key} className={`frag-chip frag-${key}`} title={label}>
              {label} ×{fragments[key] ?? 0}
            </span>
          ))}
        </div>
      </div>

      <div className="gold-side gold-side-right">
        {boosting && (
          <div className="boost-badge">
            ⚡ 성공확률 +{boostBonus}% {mins}:{secs}
          </div>
        )}
      </div>
    </header>
  );
}
