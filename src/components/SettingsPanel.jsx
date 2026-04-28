export default function SettingsPanel({
  enhanceWarningsEnabled,
  goldWarningEnabled,
  autoBreakWarningEnabled,
  storyPopupsEnabled,
  onToggle,
  onClose,
  lang,
}) {
  const en = lang === 'en';

  const rows = [
    {
      key:   'enhanceWarningsEnabled',
      label: en ? 'Repair exhaustion warning' : '수리 소진 경고',
      desc:  en
        ? 'Warn before enhancing when all repairs are used up'
        : '수리 횟수 소진 시 강화 전 경고 팝업 표시',
      value: enhanceWarningsEnabled,
    },
    {
      key:   'goldWarningEnabled',
      label: en ? 'Low gold warning' : '수리비 부족 경고',
      desc:  en
        ? 'Warn before enhancing if you cannot afford repair on failure'
        : '강화비 지불 후 수리비가 부족할 경우 강화 전 경고 팝업 표시',
      value: goldWarningEnabled,
    },
    {
      key:   'autoBreakWarningEnabled',
      label: en ? 'Cannot repair notice' : '수리 불가 파손 안내',
      desc:  en
        ? 'Show an explanation when the blade is destroyed because repair is unaffordable'
        : '수리비 부족으로 자동 파손될 때 설명 팝업 표시',
      value: autoBreakWarningEnabled,
    },
    {
      key:   'storyPopupsEnabled',
      label: en ? 'Story popups' : '스토리 팝업',
      desc:  en
        ? 'Automatically show story cutscenes when reaching milestones'
        : '특정 강화 달성 시 스토리 팝업 자동 표시',
      value: storyPopupsEnabled,
    },
  ];

  return (
    <div className="panel-overlay" onClick={onClose}>
      <aside className="panel-box settings-panel" onClick={(e) => e.stopPropagation()}>
        <div className="panel-header">
          <h2>{en ? 'Settings' : '설정'}</h2>
          <button className="panel-close" onClick={onClose}>✕</button>
        </div>
        <div className="settings-list">
          {rows.map(({ key, label, desc, value }) => (
            <div key={key} className="settings-row">
              <div className="settings-row-info">
                <span className="settings-row-label">{label}</span>
                <span className="settings-row-desc">{desc}</span>
              </div>
              <div className="shop-toggle-row">
                <button
                  type="button"
                  className={`shop-toggle ${value ? 'is-active' : ''}`}
                  onClick={() => onToggle(key, true)}
                >
                  ON
                </button>
                <button
                  type="button"
                  className={`shop-toggle ${!value ? 'is-active' : ''}`}
                  onClick={() => onToggle(key, false)}
                >
                  OFF
                </button>
              </div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
