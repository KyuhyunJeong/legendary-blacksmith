import { useState } from 'react';
import { listSaves, writeSave, deleteSave, logoutUser } from '../utils/storage.js';
import { STARTING_STATE, MAX_SAVE_SLOTS } from '../constants/gameConfig.js';
import StoryPhaseModal from '../components/StoryPhaseModal.jsx';

export default function MainMenuScreen({ username, onPlay, onLogout }) {
  const [saves, setSaves] = useState(() => listSaves(username));
  const [confirmDelete, setConfirmDelete] = useState(null); // slot number
  const [pendingNewGame, setPendingNewGame] = useState(null);

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

  return (
    <div className="menu-bg">
      <div className="menu-card">
        <h1 className="menu-title">전설의 대장장이</h1>
        <p className="menu-user">반갑습니다, <strong>{username}</strong>님</p>

        <section className="save-slots">
          {saves.map((save, i) => {
            const slot = i + 1;
            const displaySword = save ? getHighestSword(save) : null;
            return (
              <div key={slot} className={`save-slot ${save ? 'occupied' : 'empty'}`}>
                <div className="slot-label">슬롯 {slot}</div>
                {save ? (
                  <>
                    <div className="slot-info">
                      <span className="slot-sword">
                        {displaySword
                          ? `${displaySword.name} +${displaySword.level}`
                          : '검 없음'}
                      </span>
                      <span className="slot-gold">Gold {(save.gold ?? 0).toLocaleString()}</span>
                    </div>
                    <div className="slot-actions">
                      <button className="btn-primary btn-sm" onClick={() => handleLoad(slot)}>
                        불러오기
                      </button>
                      <button
                        className="btn-ghost btn-sm btn-danger"
                        onClick={() => setConfirmDelete(slot)}
                      >
                        삭제
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="slot-empty-text">빈 슬롯</p>
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
          {allFull ? '슬롯이 꽉 찼습니다' : '새 게임 시작'}
        </button>

        <button className="btn-ghost btn-wide" onClick={handleLogout}>
          로그아웃
        </button>
      </div>

      {confirmDelete !== null && (
        <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <p>슬롯 {confirmDelete}을 정말 삭제하시겠습니까?</p>
            <div className="modal-actions">
              <button className="btn-primary btn-danger" onClick={handleDeleteConfirm}>
                삭제
              </button>
              <button className="btn-ghost" onClick={() => setConfirmDelete(null)}>
                취소
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
