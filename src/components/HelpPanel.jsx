import iconEnhance  from '../../image/icon_강화하기.png';
import iconSell     from '../../image/icon_판매하기.png';
import iconFrag1    from '../../image/icon_fragment_1.png';
import iconFrag2    from '../../image/icon_fragment_2.png';
import iconFrag3    from '../../image/icon_fragment_3.png';
import iconFrag4    from '../../image/icon_fragment_4.png';
import iconFrag5    from '../../image/icon_fragment_5.png';
import iconShield   from '../../image/icon_방지권.png';
import iconShop     from '../../image/icon_상점.png';
import iconStorage  from '../../image/icon_보관함.png';
import iconCodex    from '../../image/icon_도감.png';
import iconJournal  from '../../image/icon_일기.png';

export default function HelpPanel({ onClose, lang }) {
  const en = lang === 'en';
  return (
    <div className="panel-overlay" onClick={onClose}>
      <aside className="panel-box help-panel" onClick={(e) => e.stopPropagation()}>
        <div className="panel-header">
          <h2>{en ? 'Help' : '도움말'}</h2>
          <button className="panel-close" onClick={onClose}>✕</button>
        </div>

        <div className="help-content">

          <section className="help-section">
            <h3><img className="help-icon" src={iconEnhance} alt="" /> {en ? 'Enhance' : '강화 시스템'}</h3>
            {en ? (
              <>
                <p>Enhance your weapon to forge a stronger blade. <strong>Gold</strong> and <strong>Fragments</strong> are consumed.</p>
                <ul>
                  <li>Higher levels have lower success rates.</li>
                  <li>Failure <strong>destroys</strong> the blade. (Use a Shield to prevent this.)</li>
                  <li>A destroyed blade is replaced with a <strong>+1 base blade</strong> automatically.</li>
                  <li>Higher levels also require a <strong>sacrifice blade</strong>.</li>
                </ul>
              </>
            ) : (
              <>
                <p>무기를 강화하여 더 강한 검을 만드세요. 강화에는 <strong>골드</strong>와 <strong>파편</strong>이 소모됩니다.</p>
                <ul>
                  <li>강화 레벨이 높을수록 성공 확률이 낮아집니다.</li>
                  <li>실패하면 검이 <strong>파괴</strong>됩니다. (파손 방지권으로 막을 수 있어요)</li>
                  <li>파괴된 검 대신 <strong>+1 기초 검</strong>이 자동 지급됩니다.</li>
                  <li>특정 레벨부터는 <strong>희생검</strong>이 추가로 필요합니다.</li>
                </ul>
              </>
            )}
          </section>

          <section className="help-section">
            <h3><img className="help-icon" src={iconSell} alt="" /> {en ? 'Gold' : '골드 획득'}</h3>
            {en ? (
              <ul>
                <li><strong>Selling</strong> a blade grants gold and fragments based on its level.</li>
                <li>The blade disappears and a +1 base blade is given.</li>
              </ul>
            ) : (
              <ul>
                <li>검을 <strong>판매</strong>하면 레벨에 따른 골드와 파편을 획득합니다.</li>
                <li>판매 시 검이 사라지고 +1 기초 검이 지급됩니다.</li>
              </ul>
            )}
          </section>

          <section className="help-section">
            <h3><img className="help-icon" src={iconFrag1} alt="" /> {en ? 'Fragments' : '파편'}</h3>
            {en ? (
              <p>Crafting materials required for enhancing. Different fragments are used per tier.</p>
            ) : (
              <p>강화에 필요한 재료입니다. 구간별로 다른 파편이 사용됩니다.</p>
            )}
            <table className="help-table">
              <thead><tr><th>{en ? 'Fragment' : '파편'}</th><th>{en ? 'Level Range' : '사용 구간'}</th></tr></thead>
              <tbody>
                <tr><td><img className="frag-table-icon" src={iconFrag1} alt="" /> {en ? 'Ember Shard' : '사원의 불씨 파편'}</td><td>+1 ~ +10</td></tr>
                <tr><td><img className="frag-table-icon" src={iconFrag2} alt="" /> {en ? 'Imperial Ingot Shard' : '제국의 주괴 파편'}</td><td>+11 ~ +20</td></tr>
                <tr><td><img className="frag-table-icon" src={iconFrag3} alt="" /> {en ? 'Folk Rune Shard' : '민담의 주술 파편'}</td><td>+21 ~ +30</td></tr>
                <tr><td><img className="frag-table-icon" src={iconFrag4} alt="" /> {en ? "Hero's Oath Shard" : '영웅의 맹세 파편'}</td><td>+31 ~ +40</td></tr>
                <tr><td><img className="frag-table-icon" src={iconFrag5} alt="" /> {en ? 'Mythic Gleam Shard' : '신화의 잔광 파편'}</td><td>+41 ~ +50</td></tr>
              </tbody>
            </table>
            <p className="help-note">{en ? 'Some fragments drop on enhance failure.' : '강화 실패 시 해당 구간 파편이 일부 드롭됩니다.'}</p>
          </section>

          <section className="help-section">
            <h3><img className="help-icon" src={iconShield} alt="" /> {en ? 'Break Shield' : '파손 방지권'}</h3>
            {en ? (
              <ul>
                <li>Prevents blade destruction on enhance failure.</li>
                <li>Higher levels require more shields.</li>
                <li>Purchase from the shop.</li>
              </ul>
            ) : (
              <ul>
                <li>강화 실패 시 검 파괴를 막아줍니다.</li>
                <li>레벨이 높을수록 더 많은 방지권이 필요합니다.</li>
                <li>상점에서 구매할 수 있습니다.</li>
              </ul>
            )}
          </section>

          <section className="help-section">
            <h3><img className="help-icon" src={iconShop} alt="" /> {en ? 'Boost' : '성공 확률 부스트'}</h3>
            {en ? (
              <ul>
                <li>Buying a boost ticket raises success rate for <strong>10 minutes</strong>.</li>
                <li>Check remaining time in the header boost chip.</li>
              </ul>
            ) : (
              <ul>
                <li>상점에서 부스트권을 구매하면 <strong>10분간</strong> 성공 확률이 올라갑니다.</li>
                <li>헤더의 부스트 칩에서 남은 시간을 확인할 수 있습니다.</li>
              </ul>
            )}
          </section>

          <section className="help-section">
            <h3><img className="help-icon" src={iconStorage} alt="" /> {en ? 'Inventory' : '보관함'}</h3>
            {en ? (
              <ul>
                <li>Store up to <strong>10 blades</strong> at a time.</li>
                <li>Expand by 10 slots in the shop.</li>
                <li>Tap a stored blade to swap it with the equipped one.</li>
              </ul>
            ) : (
              <ul>
                <li>여분의 검을 최대 <strong>10칸</strong>까지 보관할 수 있습니다.</li>
                <li>상점에서 보관함을 10칸씩 확장할 수 있습니다.</li>
                <li>보관함의 검을 탭하면 현재 장착 검과 교체됩니다.</li>
              </ul>
            )}
          </section>

          <section className="help-section">
            <h3>
              <img className="help-icon" src={iconCodex} alt="" /> {en ? 'Codex' : '도감'}
              &nbsp;·&nbsp;
              <img className="help-icon" src={iconJournal} alt="" /> {en ? 'Journal' : '일기'}
            </h3>
            {en ? (
              <ul>
                <li><strong>Codex</strong>: Browse weapon info and requirements up to your max enhance level.</li>
                <li><strong>Journal</strong>: Revisit the blacksmith's story log.</li>
              </ul>
            ) : (
              <ul>
                <li><strong>도감</strong>: 달성한 강화 레벨까지의 무기 정보와 강화 요건을 확인합니다.</li>
                <li><strong>일기</strong>: 대장장이의 이야기를 담은 스토리 로그를 다시 볼 수 있습니다.</li>
              </ul>
            )}
          </section>

        </div>
      </aside>
    </div>
  );
}
