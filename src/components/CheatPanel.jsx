import { FRAGMENT_LABELS } from '../constants/gameConfig.js';

const OUTCOME_OPTIONS = [
  { value: 'none', label: '기본 확률' },
  { value: 'success', label: '무조건 성공' },
  { value: 'fail', label: '무조건 실패' },
];

export default function CheatPanel({
  gold,
  cheatForceOutcome,
  cheatIgnoreRequirements,
  fragments,
  protectionTickets,
  onSetForceOutcome,
  onToggleIgnoreRequirements,
  onAdjustGold,
  onAdjustFragment,
  onAdjustProtection,
  onClose,
}) {
  return (
    <div className="panel-overlay" onClick={onClose}>
      <aside className="panel-box cheat-panel" onClick={(e) => e.stopPropagation()}>
        <div className="panel-header">
          <h2>테스트 치트 모드</h2>
          <button className="panel-close" onClick={onClose}>✕</button>
        </div>

        <section className="cheat-block">
          <h3>강화 결과 고정</h3>
          <div className="cheat-toggle-row">
            {OUTCOME_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`cheat-toggle ${cheatForceOutcome === opt.value ? 'is-active' : ''}`}
                onClick={() => onSetForceOutcome(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </section>

        <section className="cheat-block">
          <h3>강화 재료 규칙</h3>
          <div className="cheat-toggle-row">
            <button
              type="button"
              className={`cheat-toggle ${!cheatIgnoreRequirements ? 'is-active' : ''}`}
              onClick={() => onToggleIgnoreRequirements(false)}
            >
              정상 적용
            </button>
            <button
              type="button"
              className={`cheat-toggle ${cheatIgnoreRequirements ? 'is-active' : ''}`}
              onClick={() => onToggleIgnoreRequirements(true)}
            >
              부속품 필요 없음
            </button>
          </div>
        </section>

        <section className="cheat-block">
          <h3>골드 조정</h3>
          <div className="cheat-row">
            <span>골드</span>
            <strong>{(gold ?? 0).toLocaleString()} G</strong>
            <div className="cheat-actions">
              <button type="button" onClick={() => onAdjustGold(-100000)}>-100K</button>
              <button type="button" onClick={() => onAdjustGold(-10000)}>-10K</button>
              <button type="button" onClick={() => onAdjustGold(10000)}>+10K</button>
              <button type="button" onClick={() => onAdjustGold(100000)}>+100K</button>
            </div>
          </div>
        </section>

        <section className="cheat-block">
          <h3>부속품 조정</h3>
          <div className="cheat-list">
            {Object.entries(FRAGMENT_LABELS).map(([key, label]) => (
              <div key={key} className="cheat-row">
                <span>{label}</span>
                <strong>{fragments?.[key] ?? 0}</strong>
                <div className="cheat-actions">
                  <button type="button" onClick={() => onAdjustFragment(key, -10)}>-10</button>
                  <button type="button" onClick={() => onAdjustFragment(key, -1)}>-1</button>
                  <button type="button" onClick={() => onAdjustFragment(key, 1)}>+1</button>
                  <button type="button" onClick={() => onAdjustFragment(key, 10)}>+10</button>
                </div>
              </div>
            ))}

            <div className="cheat-row cheat-row-highlight">
              <span>파손 방지권</span>
              <strong>{protectionTickets ?? 0}</strong>
              <div className="cheat-actions">
                <button type="button" onClick={() => onAdjustProtection(-10)}>-10</button>
                <button type="button" onClick={() => onAdjustProtection(-1)}>-1</button>
                <button type="button" onClick={() => onAdjustProtection(1)}>+1</button>
                <button type="button" onClick={() => onAdjustProtection(10)}>+10</button>
              </div>
            </div>
          </div>
        </section>
      </aside>
    </div>
  );
}
