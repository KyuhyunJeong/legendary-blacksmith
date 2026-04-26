import { SHOP_ITEMS } from '../constants/gameConfig.js';
import { storageUpgradeCost, protectionTicketPrice } from '../utils/formulas.js';

export default function ShopPanel({
  gold,
  storageUpgradeCount,
  protectionTicketsPurchased,
  enhanceWarningsEnabled,
  onToggleEnhanceWarnings,
  onBuy,
  onClose,
}) {
  const nextStorageCost = storageUpgradeCost(storageUpgradeCount);
  const nextProtCost    = protectionTicketPrice(protectionTicketsPurchased ?? 0);
  const orderedEntries = Object.entries(SHOP_ITEMS).sort(([a], [b]) => {
    if (a === 'prot') return -1;
    if (b === 'prot') return 1;
    return 0;
  });

  return (
    <div className="panel-overlay panel-overlay-shop" onClick={onClose}>
      <aside className="panel-box shop-panel shop-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="panel-header">
          <h2>🏪 상점</h2>
          <button className="panel-close" onClick={onClose}>✕</button>
        </div>

        <p className="shop-gold">보유 골드: <strong>{gold.toLocaleString()} G</strong></p>

        <div className="shop-setting-card">
          <span>강화 경고 팝업</span>
          <div className="shop-toggle-row">
            <button
              type="button"
              className={`shop-toggle ${enhanceWarningsEnabled ? 'is-active' : ''}`}
              onClick={() => onToggleEnhanceWarnings(true)}
            >
              표시
            </button>
            <button
              type="button"
              className={`shop-toggle ${!enhanceWarningsEnabled ? 'is-active' : ''}`}
              onClick={() => onToggleEnhanceWarnings(false)}
            >
              끄기
            </button>
          </div>
        </div>

        <div className="shop-list">
          {orderedEntries.map(([key, item]) => {
            const price = key === 'storage' ? nextStorageCost
                        : key === 'prot'    ? nextProtCost
                        : item.price;
            const canAfford = gold >= price;

            return (
              <div key={key} className="shop-item">
                <div className="shop-item-info">
                  <span className="shop-item-name">{item.label}</span>
                  {key === 'storage' && (
                    <span className="shop-item-sub">
                      현재 {20 + storageUpgradeCount * 10}칸 →{' '}
                      {20 + (storageUpgradeCount + 1) * 10}칸
                    </span>
                  )}
                  {item.type === 'protection' && (
                    <span className="shop-item-sub">
                      강화 실패 시 파손 방지 (구간별 소모량: 1/3/7/13/31)
                    </span>
                  )}
                  {item.type === 'skip' && (
                    <span className="shop-item-sub">
                      +{item.value} 무기를 보관함에 추가
                    </span>
                  )}
                  {item.type === 'boost' && (
                    <span className="shop-item-sub">
                      10분간 강화 성공률 +{item.value}% (최대 95%)
                    </span>
                  )}
                </div>
                <div className="shop-item-buy">
                  <span className="shop-item-price">{price.toLocaleString()} G</span>
                  <button
                    className={`btn-sm ${canAfford ? 'btn-primary' : 'btn-ghost'}`}
                    disabled={!canAfford}
                    onClick={() => onBuy(key, price)}
                  >
                    구매
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="shop-footer-actions">
          <button className="btn-ghost btn-wide" onClick={onClose}>
            게임으로 돌아가기
          </button>
        </div>
      </aside>
    </div>
  );
}
