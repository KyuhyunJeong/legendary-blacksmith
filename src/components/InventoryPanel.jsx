import { BASE_STORAGE_CAPACITY, WEAPON_NAMES } from '../constants/gameConfig.js';
import { getWeaponSpriteStyle, getRarityKey } from '../utils/weaponAssets.js';

export default function InventoryPanel({ storage, storageUpgradeCount, activeSword, onEquip, onClose }) {
  const capacity   = BASE_STORAGE_CAPACITY + storageUpgradeCount * 10;
  const emptySlots = capacity - storage.length;

  return (
    <div className="panel-overlay" onClick={onClose}>
      <aside className="panel-box inventory-panel" onClick={(e) => e.stopPropagation()}>
        <div className="panel-header">
          <h2>보관함 ({storage.length}/{capacity})</h2>
          <button className="panel-close" onClick={onClose}>✕</button>
        </div>

        <div className="inv-section-label">장착 중</div>
        <div className="inv-list">
          {activeSword ? (
            <InventorySlotItem sword={activeSword} isActive />
          ) : (
            <div className="inv-empty-card">장착된 무기가 없습니다.</div>
          )}
        </div>

        <div className="inv-section-label">보관 중</div>
        <div className="inv-list">
          {storage.map((sword) => (
            <InventorySlotItem key={sword.id} sword={sword} onEquip={onEquip} />
          ))}
          {emptySlots > 0 && (
            <div className="inv-empty-card">빈 슬롯 {emptySlots}칸</div>
          )}
        </div>
      </aside>
    </div>
  );
}

function InventorySlotItem({ sword, onEquip, isActive = false }) {
  const spriteStyle = getWeaponSpriteStyle(sword.level);
  const className = `inv-card inv-rarity-${getRarityKey(sword.level)} ${isActive ? 'is-active' : ''}`;

  return (
    <div className={className}>
      <div className="inv-card-head">
        <div className="inv-thumb" aria-hidden="true">
          {spriteStyle ? (
            <div className="inv-sprite" style={spriteStyle} />
          ) : (
            <span className="inv-icon">⚔️</span>
          )}
        </div>
        <div className="inv-meta">
          <div className="inv-title-row">
            <strong>{WEAPON_NAMES[sword.level] ?? sword.name}</strong>
            <span className="inv-level">+{sword.level}</span>
          </div>
          <small>{isActive ? '현재 장착 중' : '보관함 무기'}</small>
        </div>
      </div>
      {!isActive && (
        <button
          className="btn-primary btn-sm"
          onClick={() => onEquip(sword.id)}
          title={`${sword.name} +${sword.level} — 클릭하여 장착`}
        >
          장착
        </button>
      )}
    </div>
  );
}
