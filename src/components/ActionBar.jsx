import iconEnhance from '../../image/icon_강화하기.png';
import iconSell    from '../../image/icon_판매하기.png';
import iconStore   from '../../image/icon_보관하기.png';
import iconShop    from '../../image/icon_상점.png';

export default function ActionBar({ onEnhance, onSell, onStore, onShop, hasSword, lang }) {
  const en = lang === 'en';
  return (
    <div className="action-bar">
      <button className="action-btn btn-enhance" onClick={onEnhance} disabled={!hasSword}>
        <img className="action-icon" src={iconEnhance} alt="" /> {en ? 'Enhance' : '강화하기'}
      </button>
      <button className="action-btn btn-sell" onClick={onSell} disabled={!hasSword}>
        <img className="action-icon" src={iconSell} alt="" /> {en ? 'Sell' : '판매하기'}
      </button>
      <button className="action-btn btn-store" onClick={onStore} disabled={!hasSword}>
        <img className="action-icon" src={iconStore} alt="" /> {en ? 'Store' : '보관하기'}
      </button>
      <button className="action-btn btn-shop" onClick={onShop}>
        <img className="action-icon" src={iconShop} alt="" /> {en ? 'Shop' : '상점'}
      </button>
    </div>
  );
}

