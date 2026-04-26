export default function HelpPanel({ onClose }) {
  return (
    <div className="panel-overlay" onClick={onClose}>
      <aside className="panel-box help-panel" onClick={(e) => e.stopPropagation()}>
        <div className="panel-header">
          <h2>도움말</h2>
          <button className="panel-close" onClick={onClose}>✕</button>
        </div>

        <div className="help-content">

          <section className="help-section">
            <h3>⚔️ 강화 시스템</h3>
            <p>무기를 강화하여 더 강한 검을 만드세요. 강화에는 <strong>골드</strong>와 <strong>파편</strong>이 소모됩니다.</p>
            <ul>
              <li>강화 레벨이 높을수록 성공 확률이 낮아집니다.</li>
              <li>실패하면 검이 <strong>파괴</strong>됩니다. (파손 방지권으로 막을 수 있어요)</li>
              <li>파괴된 검 대신 <strong>+1 기초 검</strong>이 자동 지급됩니다.</li>
              <li>특정 레벨부터는 <strong>희생검</strong>이 추가로 필요합니다.</li>
            </ul>
          </section>

          <section className="help-section">
            <h3>💰 골드 획득</h3>
            <ul>
              <li>검을 <strong>판매</strong>하면 레벨에 따른 골드와 파편을 획득합니다.</li>
              <li>판매 시 검이 사라지고 +1 기초 검이 지급됩니다.</li>
            </ul>
          </section>

          <section className="help-section">
            <h3>🪨 파편</h3>
            <p>강화에 필요한 재료입니다. 구간별로 다른 파편이 사용됩니다.</p>
            <table className="help-table">
              <thead><tr><th>파편</th><th>사용 구간</th></tr></thead>
              <tbody>
                <tr><td>🪨 시원의 불씨 파편</td><td>+1 ~ +10</td></tr>
                <tr><td>⚔️ 제국의 주괴 파편</td><td>+11 ~ +20</td></tr>
                <tr><td>🔮 민담의 주술 파편</td><td>+21 ~ +30</td></tr>
                <tr><td>🏅 영웅의 맹세 파편</td><td>+31 ~ +40</td></tr>
                <tr><td>✨ 신화의 잔광 파편</td><td>+41 ~ +50</td></tr>
              </tbody>
            </table>
            <p className="help-note">강화 실패 시 해당 구간 파편이 일부 드롭됩니다.</p>
          </section>

          <section className="help-section">
            <h3>🛡️ 파손 방지권</h3>
            <ul>
              <li>강화 실패 시 검 파괴를 막아줍니다.</li>
              <li>레벨이 높을수록 더 많은 방지권이 필요합니다.</li>
              <li>상점에서 구매할 수 있습니다.</li>
            </ul>
          </section>

          <section className="help-section">
            <h3>⚡ 성공 확률 부스트</h3>
            <ul>
              <li>상점에서 부스트권을 구매하면 <strong>10분간</strong> 성공 확률이 올라갑니다.</li>
              <li>헤더의 ⚡ 칩에서 남은 시간을 확인할 수 있습니다.</li>
            </ul>
          </section>

          <section className="help-section">
            <h3>📦 보관함</h3>
            <ul>
              <li>여분의 검을 최대 <strong>10칸</strong>까지 보관할 수 있습니다.</li>
              <li>상점에서 보관함을 10칸씩 확장할 수 있습니다.</li>
              <li>보관함의 검을 탭하면 현재 장착 검과 교체됩니다.</li>
            </ul>
          </section>

          <section className="help-section">
            <h3>📖 도감 · 📜 일기</h3>
            <ul>
              <li><strong>도감</strong>: 달성한 강화 레벨까지의 무기 정보와 강화 요건을 확인합니다.</li>
              <li><strong>일기</strong>: 대장장이의 이야기를 담은 스토리 로그를 다시 볼 수 있습니다.</li>
            </ul>
          </section>

        </div>
      </aside>
    </div>
  );
}
