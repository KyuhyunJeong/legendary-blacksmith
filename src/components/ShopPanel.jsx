import { SHOP_ITEMS } from '../constants/gameConfig.js';
import { storageUpgradeCost, protectionTicketPrice } from '../utils/formulas.js';
import iconShop from '../../image/icon_상점.png';

const SHOP_ITEM_LABELS_EN = {
  prot:    'Break Shield',
  skip10:  '+10 Skip Ticket',
  skip20:  '+20 Skip Ticket',
  skip30:  '+30 Skip Ticket',
  skip40:  '+40 Skip Ticket',
  boost5:  '+5% Boost (10 min)',
  boost10: '+10% Boost (10 min)',
  storage: 'Storage +10',
};

export default function ShopPanel({
  gold,
  storageUpgradeCount,
  protectionTicketsPurchased,
  enhanceWarningsEnabled,
  onToggleEnhanceWarnings,
  onBuy,
  onClose,
  lang,
}) {
  const en = lang === 'en';
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
          <h2>
            <img src={iconShop} className="shop-header-icon" alt="" />
            <span className="shop-header-gold">{gold.toLocaleString()} G</span>
          </h2>
          <button className="panel-close" onClick={onClose}>✕</button>
        </div>

        <div className="shop-setting-card">
          <span>{en ? 'Enhance Warnings' : '강화 경고 팝업'}</span>
          <div className="shop-toggle-row">
            <button
              type="button"
              className={`shop-toggle ${enhanceWarningsEnabled ? 'is-active' : ''}`}
              onClick={() => onToggleEnhanceWarnings(true)}
            >
              {en ? 'Show' : '표시'}
            </button>
            <button
              type="button"
              className={`shop-toggle ${!enhanceWarningsEnabled ? 'is-active' : ''}`}
              onClick={() => onToggleEnhanceWarnings(false)}
            >
              {en ? 'Hide' : '끄기'}
            </button>
          </div>
        </div>

        <div className="shop-list">
          {orderedEntries.map(([key, item]) => {
            const price = key === 'storage' ? nextStorageCost
                        : key === 'prot'    ? nextProtCost
                        : item.price;
            const canAfford = gold >= price;
            const label = en ? (SHOP_ITEM_LABELS_EN[key] ?? item.label) : item.label;

            return (
              <div key={key} className="shop-item">
                <div className="shop-item-info">
                  <span className="shop-item-name">{label}</span>
                  {key === 'storage' && (
                    <span className="shop-item-sub">
                      {en
                        ? `${20 + storageUpgradeCount * 10} slots → ${20 + (storageUpgradeCount + 1) * 10} slots`
                        : `현재 ${20 + storageUpgradeCount * 10}칸 → ${20 + (storageUpgradeCount + 1) * 10}칸`}
                    </span>
                  )}
                  {item.type === 'protection' && (
                    <span className="shop-item-sub">
                      {en
                        ? 'Prevents blade destruction on fail (qty/zone: 1/3/7/13/31)'
                        : '강화 실패 시 파손 방지 (구간별 소모량: 1/3/7/13/31)'}
                    </span>
                  )}
                  {item.type === 'skip' && (
                    <span className="shop-item-sub">
                      {en
                        ? `Add +${item.value} blade to storage`
                        : `+${item.value} 무기를 보관함에 추가`}
                    </span>
                  )}
                  {item.type === 'boost' && (
                    <span className="shop-item-sub">
                      {en
                        ? `+${item.value}% success rate for 10 min (max 95%)`
                        : `10분간 강화 성공률 +${item.value}% (최대 95%)`}
                    </span>
                  )}
                </div>
                <div className="shop-item-footer">
                  <div className={`shop-buy-pill${canAfford ? '' : ' is-disabled'}`}>
                    <span className="shop-item-price">{price.toLocaleString()} G</span>
                    <button
                      className="shop-buy-btn"
                      disabled={!canAfford}
                      onClick={() => onBuy(key, price)}
                    >
                      {en ? 'Buy' : '구매'}
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
