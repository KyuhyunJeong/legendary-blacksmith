import { useEffect, useRef, useState } from 'react';
import { FRAGMENT_LABELS, FRAGMENT_LABELS_EN } from '../constants/gameConfig.js';
import iconFrag1   from '../../image/icon_fragment_1.png';
import iconFrag2   from '../../image/icon_fragment_2.png';
import iconFrag3   from '../../image/icon_fragment_3.png';
import iconFrag4   from '../../image/icon_fragment_4.png';
import iconFrag5   from '../../image/icon_fragment_5.png';
import iconShield  from '../../image/icon_방지권.png';
import iconStorage from '../../image/icon_보관함.png';
import iconCodex   from '../../image/icon_도감.png';
import iconJournal from '../../image/icon_일기.png';
import iconSell    from '../../image/icon_판매하기.png';

const FRAG_ICONS = {
  worn:    iconFrag1,
  steel:   iconFrag2,
  rune:    iconFrag3,
  ancient: iconFrag4,
  legend:  iconFrag5,
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
  lang,
  onLangChange,
}) {
  const headerRef = useRef(null);
  const resourceRowRef = useRef(null);
  const [, setTick] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [rowOverflows, setRowOverflows] = useState(false);

  // Detect if resource row actually overflows (to enable scroll only when needed)
  useEffect(() => {
    const el = resourceRowRef.current;
    if (!el || resourcesOpen) return;
    const check = () => setRowOverflows(el.scrollWidth > el.clientWidth + 2);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [fragments, protectionTickets, activeBoost, resourcesOpen]);

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
  const en = lang === 'en';
  const fragLabels = en ? FRAGMENT_LABELS_EN : FRAGMENT_LABELS;
  const m = en ? {
    inventory: 'Inventory', codex: 'Codex', journal: 'Journal',
    help: 'Help', cheat: 'Cheat', exit: 'Exit', shield: 'Shield',
  } : {
    inventory: '보관함', codex: '도감', journal: '일기',
    help: '도움말', cheat: '치트', exit: '나가기', shield: '방지권',
  };

  return (
    <>
      {menuOpen && <div className="quick-menu-backdrop" onClick={() => setMenuOpen(false)} />}
      <header ref={headerRef} className="gold-bar">
        {/* Resources — always visible, single-row swipe; expanded = multi-row */}
        <div
          ref={resourceRowRef}
          className={`gold-resource-row${resourcesOpen ? ' is-expanded' : rowOverflows ? ' is-scrollable' : ''}`}
        >
          {/* Gold chip */}
          <button
            className="frag-chip frag-protection gold-chip-btn secret-tap-target"
            onMouseDown={onSecretPressStart} onMouseUp={onSecretPressEnd}
            onMouseLeave={onSecretPressEnd} onTouchStart={onSecretPressStart}
            onTouchEnd={onSecretPressEnd} onTouchCancel={onSecretPressEnd}
            title="골드 5초 롱프레스: 치트 해금"
          >
            <img className="chip-icon" src={iconSell} alt="" /> {gold.toLocaleString()} G
          </button>

          {/* Protection tickets */}
          {tickets > 0 && (
            <span className="frag-chip frag-protection" title={en ? 'Break Shield' : '파손 방지권'}>
              <img className="chip-icon" src={iconShield} alt="" />{resourcesOpen && <span className="frag-label">{m.shield}</span>} ×{tickets}
            </span>
          )}

          {/* Fragments — hide if 0 */}
          {Object.entries(FRAG_ICONS).map(([key]) => {
            const count = fragments[key] ?? 0;
            if (count === 0) return null;
            return (
              <span key={key} className={`frag-chip frag-${key}`} title={fragLabels[key]}>
                <img className="chip-icon" src={FRAG_ICONS[key]} alt="" />{resourcesOpen && <span className="frag-label">{fragLabels[key]}</span>} ×{count}
              </span>
            );
          })}

          {/* Boost */}
          {boosting && (
            <span className="frag-chip boost-chip">
              <span className="frag-label">+{boostBonus}%</span> {mins}:{secs}
            </span>
          )}
        </div>

        {/* Right controls */}
        <div className="gold-menu-wrap">
          {/* Resources expand toggle */}
          <button
            className={`resource-expand-btn${resourcesOpen ? ' is-open' : ''}`}
            onClick={() => setResourcesOpen((v) => !v)}
            title="리소스 펼치기"
          >
            {resourcesOpen ? '▴' : '▾'}
          </button>

          {menuOpen && (
            <div className="quick-menu-popup quick-menu-popup--header">
              {/* Lang segmented toggle — same width as other items */}
              <div className="quick-menu-lang-seg">
                <button className={`quick-menu-lang-half${lang === 'ko' ? ' is-active' : ''}`} onClick={() => onLangChange('ko')}>KO</button>
                <button className={`quick-menu-lang-half${lang === 'en' ? ' is-active' : ''}`} onClick={() => onLangChange('en')}>EN</button>
              </div>
              <button className="quick-menu-item" onClick={() => { onOpenPanel('inventory'); setMenuOpen(false); }}><img className="chip-icon" src={iconStorage} alt="" /> {m.inventory}</button>
              <button className="quick-menu-item" onClick={() => { onOpenPanel('codex'); setMenuOpen(false); }}><img className="chip-icon" src={iconCodex} alt="" /> {m.codex}</button>
              <button className="quick-menu-item" onClick={() => { onOpenPanel('journal'); setMenuOpen(false); }}><img className="chip-icon" src={iconJournal} alt="" /> {m.journal}</button>
              <button className="quick-menu-item" onClick={() => { onOpenPanel('help'); setMenuOpen(false); }}>{m.help}</button>
              {cheatUnlocked && (
                <button className="quick-menu-item" onClick={() => { onOpenPanel('cheat'); setMenuOpen(false); }}>{m.cheat}</button>
              )}
              <button className="quick-menu-item quick-menu-item--return" onClick={() => { setMenuOpen(false); onReturnMenu(); }}>{m.exit}</button>
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
