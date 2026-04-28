import iconEnhance from '../../image/icon_강화하기.png';
import iconSell    from '../../image/icon_판매하기.png';
import iconStore   from '../../image/icon_보관하기.png';
import iconShop    from '../../image/icon_상점.png';

export default function ActionBar({ onEnhance, onSell, onStore, onShop, hasSword, locked, lang }) {
  const en = lang === 'en';
  return (
    <div className="action-bar">
      <button className="action-btn btn-enhance" onClick={onEnhance} disabled={!hasSword || locked}>
        <img className="action-icon" src={iconEnhance} alt="" />
        <span className="action-label">{en ? 'Enhance' : '강화하기'}</span>
      </button>
      <button className="action-btn btn-sell" onClick={onSell} disabled={!hasSword || locked}>
        <img className="action-icon" src={iconSell} alt="" />
        <span className="action-label">{en ? 'Sell' : '판매하기'}</span>
      </button>
      <button className="action-btn btn-store" onClick={onStore} disabled={!hasSword || locked}>
        <img className="action-icon" src={iconStore} alt="" />
        <span className="action-label">{en ? 'Store' : '보관하기'}</span>
      </button>
      <button className="action-btn btn-shop" onClick={onShop} disabled={!!locked}>
        <img className="action-icon" src={iconShop} alt="" />
        <span className="action-label">{en ? 'Shop' : '상점'}</span>
      </button>
    </div>
  );
}

