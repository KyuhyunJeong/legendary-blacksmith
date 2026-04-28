import {
  SKIP_TICKETS, CHALLENGE_PACKAGE,
  FRAGMENT_LABELS, FRAGMENT_LABELS_EN,
  STORAGE_TIERS,
  FRAGMENT_EXCHANGE_RATES,
} from '../constants/gameConfig.js';
import { storageNextTier } from '../utils/formulas.js';
import iconShop from '../../image/icon_상점.png';

export default function ShopPanel({
  gold,
  storageSlots,
  maxSuccessLevel,
  usedSkipThisGame,
  usedBoostThisGame,
  fragments,
  onBuy,
  onExchange,
  onClose,
  lang,
}) {
  const en = lang === 'en';
  const nextTier   = storageNextTier(storageSlots ?? 10);
  const maxLevel   = maxSuccessLevel ?? 0;
  const allTickets = [...SKIP_TICKETS, CHALLENGE_PACKAGE];
  // Show unlocked items + only the single next locked item (lowest unlockLevel not yet reached)
  const nextLockedItem = allTickets
    .filter(item => maxLevel < item.unlockLevel)
    .sort((a, b) => a.unlockLevel - b.unlockLevel)[0];
  const visibleTickets = allTickets.filter(
    item => maxLevel >= item.unlockLevel || item === nextLockedItem
  );

  return (
    <div className="panel-overlay panel-overlay-shop" onClick={onClose}>
      <aside className="panel-box shop-panel shop-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="panel-header">
          <h2>
            <img src={iconShop} className="shop-header-icon" alt="" />
            <span className="shop-header-gold">{gold.toLocaleString()} G</span>
          </h2>
          <button className="panel-close" onClick={onClose}>✕</button>
        </div>

        <div className="shop-list shop-list--full">
          {/* ── Skip tickets & Challenge package ── */}
          {visibleTickets.map((item) => {
            const isUnlocked  = (maxSuccessLevel ?? 0) >= item.unlockLevel;
            const isChallenge = item.key === CHALLENGE_PACKAGE.key;
            const isUsed      = isChallenge ? (usedBoostThisGame || usedSkipThisGame) : usedSkipThisGame;
            const canAfford   = gold >= item.price;
            const canBuy      = isUnlocked && !isUsed && canAfford;
            const label       = en ? item.labelEn : item.label;

            return (
              <div key={item.key} className={`shop-item${!isUnlocked ? ' is-locked' : ''}`}>
                <div className="shop-item-info">
                  <span className="shop-item-name">{label}</span>
                  <span className="shop-item-sub">
                    {!isUnlocked
                      ? (en ? `Unlock at +${item.unlockLevel}` : `+${item.unlockLevel} 달성 시 해금`)
                      : isChallenge
                        ? (en ? `+${item.value} blade with +${item.boostPct}% boost (once per run)` : `+${item.value} 검 + 해당 검 성공률 +${item.boostPct}% (1회)`)
                        : (en ? `Add +${item.value} blade to storage (once per run)` : `+${item.value} 검을 보관함에 추가 (1회)`)}
                  </span>
                  {isUsed && isUnlocked && (
                    <span className="shop-item-sub shop-item-used">
                      {en ? 'Already used this run' : '이번 게임에서 이미 사용함'}
                    </span>
                  )}
                </div>
                <div className="shop-item-footer">
                  <div className={`shop-buy-pill${canBuy ? '' : ' is-disabled'}`}>
                    <span className="shop-item-price">{item.price.toLocaleString()} G</span>
                    <button
                      className="shop-buy-btn"
                      disabled={!canBuy}
                      onClick={() => onBuy(item.key)}
                    >
                      {en ? 'Buy' : '구매'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* ── Storage expansion ── */}
          {nextTier ? (
            <div className="shop-item">
              <div className="shop-item-info">
                <span className="shop-item-name">
                  {en ? `Expand to ${nextTier.slots} slots` : `${nextTier.slots}칸으로 확장`}
                </span>
                <span className="shop-item-sub">
                  {en
                    ? `Current: ${storageSlots ?? 10} / ${nextTier.slots} slots`
                    : `현재: ${storageSlots ?? 10}칸 → ${nextTier.slots}칸`}
                </span>
              </div>
              <div className="shop-item-footer">
                <div className={`shop-buy-pill${gold >= nextTier.price ? '' : ' is-disabled'}`}>
                  <span className="shop-item-price">{nextTier.price.toLocaleString()} G</span>
                  <button
                    className="shop-buy-btn"
                    disabled={gold < nextTier.price}
                    onClick={() => onBuy('storage')}
                  >
                    {en ? 'Buy' : '구매'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="shop-item shop-item-maxed">
              <span className="shop-item-name">{en ? 'Storage at maximum (50 slots)' : '보관함 최대 (50칸)'}</span>
            </div>
          )}

          {/* ── Fragment exchange ── */}
          {FRAGMENT_EXCHANGE_RATES.map((rule) => {
            const have    = fragments?.[rule.from] ?? 0;
            const canEx   = have >= rule.ratio;
            const fromLbl = en ? FRAGMENT_LABELS_EN[rule.from] : FRAGMENT_LABELS[rule.from];
            const toLbl   = en ? FRAGMENT_LABELS_EN[rule.to]   : FRAGMENT_LABELS[rule.to];
            return (
              <div key={rule.from} className="shop-item">
                <div className="shop-item-info">
                  <span className="shop-item-name">
                    {fromLbl} ×{rule.ratio} → {toLbl} ×1
                  </span>
                  <span className="shop-item-sub">
                    {en ? `You have: ${have}` : `보유: ${have}개`}
                  </span>
                </div>
                <div className="shop-item-footer">
                  <div className={`shop-buy-pill${canEx ? '' : ' is-disabled'}`}>
                    <button
                      className="shop-buy-btn"
                      disabled={!canEx}
                      onClick={() => onExchange(rule.from)}
                    >
                      {en ? 'Exchange' : '교환'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="shop-footer-actions">
          <button className="btn-ghost btn-wide" onClick={onClose}>
            {en ? 'Back to Game' : '게임으로 돌아가기'}
          </button>
        </div>
      </aside>
    </div>
  );
}
