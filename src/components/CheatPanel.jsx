import { FRAGMENT_LABELS, FRAGMENT_LABELS_EN } from '../constants/gameConfig.js';

const OUTCOME_OPTIONS_KO = [
  { value: 'none',    label: '기본 확률' },
  { value: 'success', label: '무조건 성공' },
  { value: 'fail',    label: '무조건 실패' },
];
const OUTCOME_OPTIONS_EN = [
  { value: 'none',    label: 'Default' },
  { value: 'success', label: 'Always Win' },
  { value: 'fail',    label: 'Always Fail' },
];

export default function CheatPanel({
  gold,
  cheatForceOutcome,
  cheatIgnoreRequirements,
  fragments,
  repairUsed,
  maxRepair,
  onSetForceOutcome,
  onToggleIgnoreRequirements,
  onAdjustGold,
  onAdjustFragment,
  onAdjustRepairUsed,
  onClose,
  lang,
}) {
  const en = lang === 'en';
  const fragLabels = en ? FRAGMENT_LABELS_EN : FRAGMENT_LABELS;
  const OUTCOME_OPTIONS = en ? OUTCOME_OPTIONS_EN : OUTCOME_OPTIONS_KO;

  return (
    <div className="panel-overlay" onClick={onClose}>
      <aside className="panel-box cheat-panel" onClick={(e) => e.stopPropagation()}>
        <div className="panel-header">
          <h2>{en ? 'Cheat Mode' : '테스트 치트 모드'}</h2>
          <button className="panel-close" onClick={onClose}>✕</button>
        </div>

        <section className="cheat-block">
          <h3>{en ? 'Force Outcome' : '강화 결과 고정'}</h3>
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
          <h3>{en ? 'Requirements' : '강화 재료 규칙'}</h3>
          <div className="cheat-toggle-row">
            <button
              type="button"
              className={`cheat-toggle ${!cheatIgnoreRequirements ? 'is-active' : ''}`}
              onClick={() => onToggleIgnoreRequirements(false)}
            >
              {en ? 'Normal' : '정상 적용'}
            </button>
            <button
              type="button"
              className={`cheat-toggle ${cheatIgnoreRequirements ? 'is-active' : ''}`}
              onClick={() => onToggleIgnoreRequirements(true)}
            >
              {en ? 'Skip Req.' : '부속품 필요 없음'}
            </button>
          </div>
        </section>

        <section className="cheat-block">
          <h3>{en ? 'Adjust Gold' : '골드 조정'}</h3>
          <div className="cheat-row">
            <span>{en ? 'Gold' : '골드'}</span>
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
          <h3>{en ? 'Adjust Fragments' : '파편 조정'}</h3>
          <div className="cheat-list">
            {Object.entries(fragLabels).map(([key, label]) => (
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
          </div>
        </section>

        <section className="cheat-block">
          <h3>{en ? 'Repair Used' : '수리 사용 횟수'}</h3>
          <div className="cheat-row">
            <span>{en ? 'Used / Max' : '사용 / 최대'}</span>
            <strong>{repairUsed ?? 0} / {maxRepair ?? 2}</strong>
            <div className="cheat-actions">
              <button type="button" onClick={() => onAdjustRepairUsed(-1)}>-1</button>
              <button type="button" onClick={() => onAdjustRepairUsed(1)}>+1</button>
            </div>
          </div>
        </section>
      </aside>
    </div>
  );
}
