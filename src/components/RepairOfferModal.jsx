import { useRef, useState, useEffect } from 'react';

export default function RepairOfferModal({
  repairOffer,
  repairUsed,
  maxRepair,
  lang,
  onRepair,
  onAbandon,
}) {
  const en = lang === 'en';

  // Detect coarse pointer (touch) once on mount
  const [isCoarse, setIsCoarse] = useState(false);
  useEffect(() => {
    setIsCoarse(window.matchMedia('(pointer: coarse)').matches);
  }, []);

  // ── Drag state (desktop only) ─────────────────────────────────────────────
  const boxRef      = useRef(null);
  const dragOrigin  = useRef(null); // { pX, pY, rX, rY }
  const [floatPos, setFloatPos] = useState(null); // null = CSS default, {x,y} = dragged

  function onPointerDown(e) {
    if (isCoarse) return;
    // Allow buttons to work without starting a drag
    if (e.target.closest('button')) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const rect = e.currentTarget.getBoundingClientRect();
    dragOrigin.current = { pX: e.clientX, pY: e.clientY, rX: rect.left, rY: rect.top };
  }

  function onPointerMove(e) {
    if (!dragOrigin.current) return;
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
    const dx = e.clientX - dragOrigin.current.pX;
    const dy = e.clientY - dragOrigin.current.pY;
    setFloatPos({ x: dragOrigin.current.rX + dx, y: dragOrigin.current.rY + dy });
  }

  function onPointerUp() {
    dragOrigin.current = null;
  }

  // ── Shared content ────────────────────────────────────────────────────────
  const { cost, pendingGold } = repairOffer;
  const afterGold  = Math.max(0, pendingGold - cost);
  const canAfford  = pendingGold >= cost;

  const body = (
    <>
      <p className="repair-modal-desc">
        {en
          ? 'The blade survived but is damaged. Repair to keep it.'
          : '검이 손상되었습니다. 수리하면 유지할 수 있습니다.'}
      </p>
      <div className="repair-info-grid">
        <span>{en ? 'Repair cost' : '수리비'}</span>
        <strong>{cost.toLocaleString()} G</strong>
        <span>{en ? 'After repair' : '수리 후 보유'}</span>
        <strong className={!canAfford ? 'repair-gold--short' : ''}>
          {afterGold.toLocaleString()} G{!canAfford ? (en ? ' (short)' : ' (부족)') : ''}
        </strong>
        <span>{en ? 'Repairs used' : '수리 횟수'}</span>
        <strong>{repairUsed + 1} / {maxRepair}</strong>
      </div>
      <div className="modal-actions">
        <button className="btn-primary" disabled={!canAfford} onClick={onRepair}>
          {en ? 'Repair' : '수리하기'}
        </button>
        <button className="btn-ghost" onClick={onAbandon}>
          {en ? 'Abandon (Break)' : '포기 (파손)'}
        </button>
      </div>
    </>
  );

  // ── Mobile: bottom sheet ──────────────────────────────────────────────────
  if (isCoarse) {
    return (
      <div className="repair-sheet-root">
        <div className="repair-sheet">
          <div className="repair-sheet-pill" />
          <h3 className="repair-sheet-title">{en ? '⚒️ Forge Fail' : '⚒️ 강화 실패'}</h3>
          {body}
        </div>
      </div>
    );
  }

  // ── Desktop: draggable floating box ──────────────────────────────────────
  const style = floatPos
    ? { left: floatPos.x, top: floatPos.y }
    : {};

  return (
    <div className="repair-float-root" aria-modal="true">
      <div
        ref={boxRef}
        className={`repair-float-box${floatPos ? ' is-dragged' : ''}`}
        style={style}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <div className="repair-drag-handle">
          <span className="repair-drag-grip" aria-hidden="true">⠿</span>
          <h3>{en ? '⚒️ Forge Fail' : '⚒️ 강화 실패'}</h3>
        </div>
        {body}
      </div>
    </div>
  );
}
