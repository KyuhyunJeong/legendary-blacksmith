export default function ActionBar({ onEnhance, onSell, onStore, onShop, hasSword }) {
  return (
    <div className="action-bar">
      <button
        className="action-btn btn-enhance"
        onClick={onEnhance}
        disabled={!hasSword}
      >
        🔨 강화하기
      </button>
      <button
        className="action-btn btn-sell"
        onClick={onSell}
        disabled={!hasSword}
      >
        💰 판매하기
      </button>
      <button
        className="action-btn btn-store"
        onClick={onStore}
        disabled={!hasSword}
      >
        📦 보관하기
      </button>
      <button className="action-btn btn-shop" onClick={onShop}>
        🏪 상점
      </button>
    </div>
  );
}
