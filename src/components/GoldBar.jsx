import { useEffect, useRef, useState } from 'react';
import { FRAGMENT_LABELS } from '../constants/gameConfig.js';

const FRAG_ICONS = {
  worn:    '🪨',
  steel:   '⚔️',
  rune:    '🔮',
  ancient: '🏅',
  legend:  '✨',
};

export default function GoldBar({
  gold,
  fragments,
  activeBoost,
  protectionTickets,
  onReturnMenu,
  onOpenPanel,
  cheatUnlocked,
  onSecretPressStart,
  onSecretPressEnd,
}) {
  const headerRef = useRef(null);
  const [, setTick] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  // Keep boost countdown ticking without remounting
  useEffect(() => {
    if (!activeBoost) return;
    const t = setInterval(() => setTick((n) => n + 1), 1000);
    return () => clearInterval(t);
  }, [activeBoost]);

  useEffect(() => {
    const el = headerRef.current;
    // Apply compact immediately if already scrolled past threshold
    if (el && window.scrollY > 56) el.classList.add('gold-bar--compact');

    function onScroll() {
      const el = headerRef.current;
      if (!el) return;
      const compact = el.classList.contains('gold-bar--compact');
      if (!compact && window.scrollY > 56) el.classList.add('gold-bar--compact');
      else if (compact && window.scrollY < 24) el.classList.remove('gold-bar--compact');
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const now        = Date.now();
  const boostLeft  = activeBoost ? Math.max(0, Math.ceil((activeBoost.expiresAt - now) / 1000)) : 0;
  const boosting   = boostLeft > 0;
  const boostBonus = activeBoost?.bonusPct ?? 0;
  const mins = Math.floor(boostLeft / 60);
  const secs = String(boostLeft % 60).padStart(2, '0');

  const tickets = protectionTickets ?? 0;

  return (
    <>
      {menuOpen && <div className="quick-menu-backdrop" onClick={() => setMenuOpen(false)} />}
      <header ref={headerRef} className="gold-bar">
        {/* Resources */}
        <div className="gold-resource-row">
          {/* Gold chip */}
          <button
            className="frag-chip frag-protection gold-chip-btn secret-tap-target"
            onMouseDown={onSecretPressStart} onMouseUp={onSecretPressEnd}
            onMouseLeave={onSecretPressEnd} onTouchStart={onSecretPressStart}
            onTouchEnd={onSecretPressEnd} onTouchCancel={onSecretPressEnd}
            title="골드 5초 롱프레스: 치트 해금"
          >
            🪙 {gold.toLocaleString()} G
          </button>

          {/* Protection tickets */}
          {tickets > 0 && (
            <span className="frag-chip frag-protection" title="파손 방지권">
              🛡️ <span className="frag-label">방지권</span> ×{tickets}
            </span>
          )}

          {/* Fragments — hide if 0 */}
          {Object.entries(FRAG_ICONS).map(([key]) => {
            const count = fragments[key] ?? 0;
            if (count === 0) return null;
            return (
              <span key={key} className={`frag-chip frag-${key}`} title={FRAGMENT_LABELS[key]}>
                {FRAG_ICONS[key]} <span className="frag-label">{FRAGMENT_LABELS[key]}</span> ×{count}
              </span>
            );
          })}

          {/* Boost */}
          {boosting && (
            <span className="frag-chip boost-chip">
              ⚡ <span className="frag-label">+{boostBonus}%</span> {mins}:{secs}
            </span>
          )}
        </div>

        {/* Menu button (top-right) */}
        <div className="gold-menu-wrap">
          {menuOpen && (
            <div className="quick-menu-popup quick-menu-popup--header">
              <button className="quick-menu-item" onClick={() => { onOpenPanel('inventory'); setMenuOpen(false); }}>📦 보관함</button>
              <button className="quick-menu-item" onClick={() => { onOpenPanel('codex'); setMenuOpen(false); }}>📖 도감</button>
              <button className="quick-menu-item" onClick={() => { onOpenPanel('journal'); setMenuOpen(false); }}>📜 일기</button>
              <button className="quick-menu-item" onClick={() => { onOpenPanel('help'); setMenuOpen(false); }}>❓ 도움말</button>
              {cheatUnlocked && (
                <button className="quick-menu-item" onClick={() => { onOpenPanel('cheat'); setMenuOpen(false); }}>🧪 치트</button>
              )}
              <div className="quick-menu-divider" />
              <button className="quick-menu-item quick-menu-item--return" onClick={() => { setMenuOpen(false); onReturnMenu(); }}>← 메뉴로</button>
            </div>
          )}
          <button
            className={`quick-menu-fab quick-menu-fab--header${menuOpen ? ' is-open' : ''}`}
            onClick={() => setMenuOpen((v) => !v)}
            title="메뉴"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </header>
    </>
  );
}
