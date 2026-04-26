import { useState } from 'react';
import { listSaves, writeSave, deleteSave, logoutUser } from '../utils/storage.js';
import { STARTING_STATE, MAX_SAVE_SLOTS } from '../constants/gameConfig.js';
import StoryPhaseModal from '../components/StoryPhaseModal.jsx';

export default function MainMenuScreen({ username, onPlay, onLogout }) {
  const [saves, setSaves] = useState(() => listSaves(username));
  const [confirmDelete, setConfirmDelete] = useState(null); // slot number
  const [pendingNewGame, setPendingNewGame] = useState(null);
  const [lang, setLang] = useState('ko'); // 'ko' | 'en'

  function refreshSaves() {
    setSaves(listSaves(username));
  }

  function handleNewGame() {
    const emptySlot = [1, 2, 3].find((s) => saves[s - 1] === null);
    if (!emptySlot) return;
    const newState = {
      ...JSON.parse(JSON.stringify(STARTING_STATE)),
      slot: emptySlot,
      username,
      createdAt: Date.now(),
      seenStoryPhases: ['phase0'],
    };
    setPendingNewGame(newState);
  }

  function handleConfirmNewGame(options = {}) {
    const { dontShowAgain = false } = options;
    if (!pendingNewGame) return;
    const saveState = {
      ...pendingNewGame,
      storyPopupsEnabled: !dontShowAgain,
    };
    writeSave(username, saveState.slot, saveState);
    onPlay(saveState);
    setPendingNewGame(null);
  }

  function handleLoad(slot) {
    const saves = listSaves(username);
    const save  = saves[slot - 1];
    if (save) onPlay(save);
  }

  function handleDeleteConfirm() {
    deleteSave(username, confirmDelete);
    setConfirmDelete(null);
    refreshSaves();
  }

  function handleLogout() {
    logoutUser();
    onLogout();
  }

  const usedSlots  = saves.filter(Boolean).length;
  const allFull    = usedSlots >= MAX_SAVE_SLOTS;

  const t = lang === 'ko' ? {
    title:     '전설의 대장장이',
    slot:      (n) => `슬롯 ${n}`,
    emptySlot: '빈 슬롯',
    noSword:   '검 없음',
    load:      '불러오기',
    delete:    '삭제',
    newGame:   '새 게임 시작',
    slotsFull: '슬롯이 꽉 찼습니다',
    logout:    '로그아웃',
    confirmMsg:(n) => `슬롯 ${n}을 정말 삭제하시겠습니까?`,
    cancel:    '취소',
  } : {
    title:     'Legendary Blacksmith',
    slot:      (n) => `Slot ${n}`,
    emptySlot: 'Empty',
    noSword:   'No weapon',
    load:      'Load',
    delete:    'Delete',
    newGame:   'New Game',
    slotsFull: 'All Slots Full',
    logout:    'Logout',
    confirmMsg:(n) => `Delete Slot ${n}?`,
    cancel:    'Cancel',
  };

  function parseName(fullName) {
    if (!fullName) return '';
    const parts = fullName.split(' / ');
    if (lang === 'en' && parts[1]) return parts[1];
    return parts[0];
  }

  return (
    <div className="menu-bg">
      <div className="menu-lang-toggle">
        <button className={`lang-btn ${lang === 'ko' ? 'active' : ''}`} onClick={() => setLang('ko')}>KO</button>
        <button className={`lang-btn ${lang === 'en' ? 'active' : ''}`} onClick={() => setLang('en')}>EN</button>
      </div>
      <div className="menu-card">
        <h1 className="menu-title">{t.title}</h1>

        <section className="save-slots">
          {saves.map((save, i) => {
            const slot = i + 1;
            const displaySword = save ? getHighestSword(save) : null;
            return (
              <div key={slot} className={`save-slot ${save ? 'occupied' : 'empty'}`}>
                <div className="slot-label">
                  <span>{t.slot(slot)}</span>
                  {save && <span className="slot-label-gold">{(save.gold ?? 0).toLocaleString()} G</span>}
                </div>
                {save ? (
                  <>
                    <div className="slot-info">
                      <span className="slot-sword">
                        {displaySword
                          ? `${parseName(displaySword.name)} +${displaySword.level}`
                          : t.noSword}
                      </span>
                    </div>
                    <div className="slot-actions">
                      <button className="btn-primary btn-sm" onClick={() => handleLoad(slot)}>
                        {t.load}
                      </button>
                      <button
                        className="btn-ghost btn-sm btn-danger"
                        onClick={() => setConfirmDelete(slot)}
                      >
                        {t.delete}
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="slot-empty-text">{t.emptySlot}</p>
                )}
              </div>
            );
          })}
        </section>

        <button
          className="btn-primary btn-wide"
          onClick={handleNewGame}
          disabled={allFull}
        >
          {allFull ? t.slotsFull : t.newGame}
        </button>

        <button className="btn-ghost btn-wide" onClick={handleLogout}>
          {t.logout}
        </button>
      </div>

      {confirmDelete !== null && (
        <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <p>{t.confirmMsg(confirmDelete)}</p>
            <div className="modal-actions">
              <button className="btn-primary btn-danger" onClick={handleDeleteConfirm}>
                {t.delete}
              </button>
              <button className="btn-ghost" onClick={() => setConfirmDelete(null)}>
                {t.cancel}
              </button>
            </div>
          </div>
        </div>
      )}

      {pendingNewGame && (
        <StoryPhaseModal phaseKey="phase0" onClose={handleConfirmNewGame} />
      )}
    </div>
  );
}

function getHighestSword(save) {
  const active = save?.activeSword ? [save.activeSword] : [];
  const storage = Array.isArray(save?.storage) ? save.storage : [];
  const swords = [...active, ...storage].filter(Boolean);
  if (swords.length === 0) return null;

  return swords.reduce((best, current) => {
    if (!best) return current;
    if ((current.level ?? 0) > (best.level ?? 0)) return current;
    return best;
  }, null);
}
