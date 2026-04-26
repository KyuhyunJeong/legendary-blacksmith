import { useState, useEffect, useCallback, useRef } from 'react';
import { writeSave }           from '../utils/storage.js';
import {
  successRate, enhanceCost, sellPrice,
  fragmentRequirements, swordSacrificeRequired,
  fragmentDropRoll, zoneKey, protectionRequired,
} from '../utils/formulas.js';
import {
  FRAGMENT_LABELS, BASE_STORAGE_CAPACITY, SHOP_ITEMS, STARTING_STATE, WEAPON_NAMES, SELL_FRAGMENT_REWARDS,
} from '../constants/gameConfig.js';

import GoldBar         from '../components/GoldBar.jsx';
import SwordDisplay    from '../components/SwordDisplay.jsx';
import ActionBar       from '../components/ActionBar.jsx';
import InventoryPanel  from '../components/InventoryPanel.jsx';
import ShopPanel       from '../components/ShopPanel.jsx';
import CodexPanel      from '../components/CodexPanel.jsx';
import StoryJournalPanel from '../components/StoryJournalPanel.jsx';
import CheatPanel      from '../components/CheatPanel.jsx';
import StoryPhaseModal from '../components/StoryPhaseModal.jsx';
import Toast           from '../components/Toast.jsx';

// ─── Toast helper ─────────────────────────────────────────────────────────────
let _toastId = 0;
function makeToast(text, type = 'info') {
  return { id: ++_toastId, text, type };
}

export default function GameScreen({ initialState, username, onReturnMenu }) {
  // Migrate saves from old multi-tier ticket format to single number
  function migrateState(s) {
    const normalizeSword = (sword) => {
      if (!sword) return sword;
      if ((sword.level ?? 0) <= 0) {
        return {
          ...sword,
          level: 1,
          name: WEAPON_NAMES[1],
        };
      }
      return sword;
    };

    const source = s ?? STARTING_STATE;
    const normalizedActive = normalizeSword(source?.activeSword);
    const normalizedStorage = (source?.storage ?? []).map(normalizeSword);
    const existingLevels = [
      normalizedActive?.level ?? 0,
      ...normalizedStorage.map((it) => it.level ?? 0),
    ];
    const inferredMaxSuccess = Math.max(0, ...existingLevels);
    const inferredSeenStoryPhases = inferSeenStoryPhases(inferredMaxSuccess);

    let migrated = {
      ...source,
      activeSword: normalizedActive,
      storage: normalizedStorage,
    };
    if (migrated?.activeBoost && migrated.activeBoost.bonusPct === undefined) {
      migrated = {
        ...migrated,
        activeBoost: {
          ...migrated.activeBoost,
          bonusPct: 100,
        },
      };
    }
    if (s && typeof s.protectionTickets === 'object' && s.protectionTickets !== null) {
      const total = Object.values(s.protectionTickets).reduce((a, b) => a + b, 0);
      migrated = {
        ...migrated,
        protectionTickets: total,
        protectionTicketsPurchased: s.protectionTicketsPurchased ?? 0,
      };
    }
    if (migrated && migrated.protectionTicketsPurchased === undefined) {
      migrated = { ...migrated, protectionTicketsPurchased: 0 };
    }

    if (migrated && migrated.maxSuccessLevel === undefined) {
      migrated = { ...migrated, maxSuccessLevel: inferredMaxSuccess };
    }

    if (migrated && migrated.seenStoryPhases === undefined) {
      migrated = { ...migrated, seenStoryPhases: inferredSeenStoryPhases };
    }

    if (migrated && migrated.storyPopupsEnabled === undefined) {
      migrated = { ...migrated, storyPopupsEnabled: true };
    }

    if (migrated && migrated.cheatUnlocked === undefined) {
      migrated = { ...migrated, cheatUnlocked: false };
    }

    if (migrated && migrated.cheatForceOutcome === undefined) {
      migrated = { ...migrated, cheatForceOutcome: 'none' };
    }

    if (migrated && migrated.cheatIgnoreRequirements === undefined) {
      migrated = { ...migrated, cheatIgnoreRequirements: false };
    }

    if (migrated && migrated.enhanceWarningsEnabled === undefined) {
      migrated = { ...migrated, enhanceWarningsEnabled: true };
    }

    return migrated;
  }
  const [state,    setState]    = useState(() => migrateState(initialState));
  const [panel,    setPanel]    = useState(null);   // null | 'inventory' | 'shop' | 'codex' | 'journal' | 'cheat'
  const [toasts,   setToasts]   = useState([]);
  const [modal,    setModal]    = useState(null);   // null | { type, data }
  const [enhanceWarning, setEnhanceWarning] = useState(null); // null | { nextLevel, reqTickets, ticketCount, missingTickets }
  const [enhanceWarningDontShowAgain, setEnhanceWarningDontShowAgain] = useState(false);
  const [boostTick, setBoostTick] = useState(0);    // force re-render for countdown
  const [storyQueue, setStoryQueue] = useState([]);
  const [journalStoryPhase, setJournalStoryPhase] = useState(null);
  const [pendingEnhanceToast, setPendingEnhanceToast] = useState(null);
  const startupStoryQueued = useRef(false);
  const cheatLongPressTimerRef = useRef(null);

  // Persist on every state change
  useEffect(() => {
    writeSave(username, state.slot, state);
  }, [state]);

  // Countdown ticker for boost
  useEffect(() => {
    const t = setInterval(() => setBoostTick((n) => n + 1), 1000);
    return () => clearInterval(t);
  }, []);

  // ── Helpers ─────────────────────────────────────────────────────────────────
  function pushToast(text, type = 'info') {
    const toast = makeToast(text, type);
    setToasts((prev) => [...prev, toast]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== toast.id)), 3200);
  }

  function dismissToast(id) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  function update(partial) {
    setState((prev) => ({ ...prev, ...partial }));
  }

  function enqueueStoryPhases(phaseKeys) {
    const seenStoryPhases = state.seenStoryPhases ?? [];
    setStoryQueue((prev) => {
      const nextQueue = [...prev];
      for (const phaseKey of phaseKeys) {
        if (!phaseKey) continue;
        if (seenStoryPhases.includes(phaseKey) || nextQueue.includes(phaseKey)) continue;
        nextQueue.push(phaseKey);
      }
      return nextQueue;
    });
  }

  function closeStoryPhase(options = {}) {
    const { dontShowAgain = false } = options;
    const currentPhase = storyQueue[0];
    if (!currentPhase) return;

    setState((prev) => ({
      ...prev,
      seenStoryPhases: [...new Set([...(prev.seenStoryPhases ?? []), currentPhase])],
      storyPopupsEnabled: dontShowAgain ? false : (prev.storyPopupsEnabled ?? true),
    }));
    setStoryQueue((prev) => prev.slice(1));

    if (dontShowAgain) {
      pushToast('앞으로 스토리 팝업이 표시되지 않습니다. 도감에서 일러스트와 내용을 확인할 수 있어요.', 'info');
    }

    if ((storyQueue.length ?? 0) <= 1 && pendingEnhanceToast) {
      pushToast(pendingEnhanceToast, 'success');
      setPendingEnhanceToast(null);
    }
  }

  function zoneFragKey(level) {
    return zoneKey(level);
  }

  function isBoostActive() {
    return state.activeBoost && Date.now() < state.activeBoost.expiresAt;
  }

  function handleCheatLongPressStart() {
    if (state.cheatUnlocked) return;

    if (cheatLongPressTimerRef.current) {
      clearTimeout(cheatLongPressTimerRef.current);
    }

    cheatLongPressTimerRef.current = setTimeout(() => {
      update({ cheatUnlocked: true });
      pushToast('치트 모드가 해금되었습니다. 우측 하단의 🧪 버튼을 확인하세요.', 'warn');
      cheatLongPressTimerRef.current = null;
    }, 5000);
  }

  function handleCheatLongPressEnd() {
    if (!cheatLongPressTimerRef.current) return;
    clearTimeout(cheatLongPressTimerRef.current);
    cheatLongPressTimerRef.current = null;
  }

  useEffect(() => {
    return () => {
      if (cheatLongPressTimerRef.current) {
        clearTimeout(cheatLongPressTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (startupStoryQueued.current) return;

    const seen = state.seenStoryPhases ?? [];
    if ((state.maxSuccessLevel ?? 0) === 0 && !seen.includes('phase1')) {
      enqueueStoryPhases(['phase1']);
    }
    startupStoryQueued.current = true;
  }, [state.maxSuccessLevel, state.seenStoryPhases, state.storyPopupsEnabled]);

  // ── Enhance ──────────────────────────────────────────────────────────────────
  function handleEnhance(skipProtectionWarning = false) {
    const shouldSkipProtectionWarning = skipProtectionWarning === true;
    const sword     = state.activeSword;
    if (!sword) return;

    const nextLevel  = sword.level + 1;
    if (nextLevel > 50) { pushToast('이미 최고 강화 단계입니다.', 'warn'); return; }

    const fragReqMap = fragmentRequirements(nextLevel);
    const sacrifices = swordSacrificeRequired(nextLevel);
    const cost       = enhanceCost(nextLevel);
    const ignoreRequirements = state.cheatIgnoreRequirements === true;

    // In cheat ignore mode, enhancement can proceed without gold.
    if (!ignoreRequirements && state.gold < cost) {
      pushToast(`골드가 부족합니다. (필요: ${cost.toLocaleString()} G)`, 'error'); return;
    }
    // Check fragments
    if (!ignoreRequirements) {
      for (const [key, req] of Object.entries(fragReqMap)) {
        if ((state.fragments[key] ?? 0) < req) {
          pushToast(`${FRAGMENT_LABELS[key]}이 부족합니다. (필요: ${req}개)`, 'error');
          return;
        }
      }
    }
    // Check sword sacrifices
    if (!ignoreRequirements) {
      for (const reqLv of sacrifices) {
        if (!state.storage.some((s) => s.level === reqLv)) {
          pushToast(`+${reqLv} 검이 보관함에 없습니다.`, 'error'); return;
        }
      }
    }

    // Warn before enhancement if protection tickets are insufficient.
    const reqTickets  = protectionRequired(nextLevel);
    const ticketCount = state.protectionTickets ?? 0;
    if (!shouldSkipProtectionWarning && (state.enhanceWarningsEnabled ?? true) && ticketCount < reqTickets) {
      setEnhanceWarning({
        nextLevel,
        reqTickets,
        ticketCount,
        missingTickets: reqTickets - ticketCount,
      });
      setEnhanceWarningDontShowAgain(false);
      return;
    }

    // Deduct cost and materials
    let newGold      = ignoreRequirements ? state.gold : state.gold - cost;
    let newFragments = { ...state.fragments };
    if (!ignoreRequirements) {
      for (const [key, req] of Object.entries(fragReqMap)) {
        newFragments[key] -= req;
      }
    }

    // Remove sacrificed swords (one of each required level)
    let newStorage = [...state.storage];
    if (!ignoreRequirements) {
      for (const reqLv of sacrifices) {
        const idx = newStorage.findIndex((s) => s.level === reqLv);
        if (idx !== -1) newStorage.splice(idx, 1);
      }
    }

    // Roll success
    const baseRate   = successRate(nextLevel);
    const bonusPct   = isBoostActive() ? (state.activeBoost?.bonusPct ?? 0) : 0;
    const rate       = Math.min(baseRate + bonusPct, 95);
    const forcedOutcome = state.cheatForceOutcome ?? 'none';
    const success = forcedOutcome === 'success'
      ? true
      : forcedOutcome === 'fail'
        ? false
        : Math.random() * 100 < rate;

    if (success) {
      const upgraded = { ...sword, level: nextLevel, name: WEAPON_NAMES[nextLevel] ?? sword.name };
      const currentMax = state.maxSuccessLevel ?? 0;
      const storyPhase = getStoryPhaseForMilestone(nextLevel);
      update({
        gold: newGold,
        fragments: newFragments,
        storage: newStorage,
        activeSword: upgraded,
        maxSuccessLevel: Math.max(currentMax, nextLevel),
      });
      enqueueStoryPhases([storyPhase]);

      if (storyPhase) {
        setPendingEnhanceToast(`🎉 강화 성공! +${nextLevel}`);
      } else {
        pushToast(`🎉 강화 성공! +${nextLevel}`, 'success');
      }
    } else {
      if (ticketCount >= reqTickets) {
        const remaining = ticketCount - reqTickets;
        update({ gold: newGold, fragments: newFragments, storage: newStorage, protectionTickets: remaining });
        pushToast(`🛡️ 파손 방지권 발동! 검이 보호되었습니다. (${reqTickets}개 소모 → ${remaining}개 남음)`, 'warn');
      } else {
        // Destroy — drop fragments, auto-give free +1
        const dropZoneKey = zoneFragKey(nextLevel);
        const dropCount   = fragmentDropRoll(nextLevel);
        const newFrags    = { ...newFragments };
        if (dropCount > 0) newFrags[dropZoneKey] = (newFrags[dropZoneKey] ?? 0) + dropCount;

        const freeId    = state.nextSwordId;
        const freeSword = { id: freeId, name: WEAPON_NAMES[1], level: 1 };
        update({
          gold: newGold,
          fragments: newFrags,
          storage: newStorage,
          activeSword: freeSword,
          nextSwordId: freeId + 1,
        });

        const msg = dropCount > 0
          ? `💥 강화 실패! 검 파괴. ${FRAGMENT_LABELS[dropZoneKey]} ×${dropCount} 획득 | 기초 검 +1 지급`
          : '💥 강화 실패! 검이 파괴되었습니다. 기초 검 +1 지급';
        pushToast(msg, 'error');
      }
    }
  }

  // ── Sell ─────────────────────────────────────────────────────────────────────
  function handleSell() {
    if (!state.activeSword) return;
    setModal({ type: 'sell', data: state.activeSword });
  }

  function confirmSell() {
    const sword      = state.activeSword;
    const gold       = sellPrice(sword.level);
    const zone       = zoneFragKey(Math.max(1, sword.level));
    const fragReward = SELL_FRAGMENT_REWARDS[zone] ?? 0;
    const newFrags   = { ...state.fragments, [zone]: (state.fragments[zone] ?? 0) + fragReward };

    const freeId    = state.nextSwordId;
    const freeSword = { id: freeId, name: WEAPON_NAMES[1], level: 1 };
    update({
      gold:        state.gold + gold,
      fragments:   newFrags,
      activeSword: freeSword,
      nextSwordId: freeId + 1,
    });

    pushToast(
      `💰 판매 완료! +${gold.toLocaleString()} G, ${FRAGMENT_LABELS[zone]} ×${fragReward} 획득 | 기초 검 +1 지급`,
      'success'
    );
    setModal(null);
  }

  // ── Store ─────────────────────────────────────────────────────────────────────
  function handleStore() {
    const sword    = state.activeSword;
    if (!sword) return;
    const capacity = BASE_STORAGE_CAPACITY + state.storageUpgradeCount * 10;
    if (state.storage.length >= capacity) {
      pushToast('보관함이 꽉 찼습니다. 상점에서 확장하세요.', 'error'); return;
    }
    const freeId    = state.nextSwordId;
    const freeSword = { id: freeId, name: WEAPON_NAMES[1], level: 1 };
    update({
      storage: [...state.storage, sword],
      activeSword: freeSword,
      nextSwordId: freeId + 1,
    });
    pushToast(`📦 ${sword.name} +${sword.level} 보관 완료 | 기초 검 +1 지급`, 'info');
  }

  // ── Equip from inventory ──────────────────────────────────────────────────────
  function handleEquip(swordId) {
    const sword    = state.storage.find((s) => s.id === swordId);
    if (!sword) return;
    const capacity = BASE_STORAGE_CAPACITY + state.storageUpgradeCount * 10;

    // If active sword exists, swap it into storage
    let newStorage = state.storage.filter((s) => s.id !== swordId);
    if (state.activeSword) {
      if (newStorage.length >= capacity) {
        pushToast('보관함이 꽉 차서 교체할 수 없습니다.', 'error'); return;
      }
      newStorage = [...newStorage, state.activeSword];
    }

    update({ activeSword: sword, storage: newStorage });
    setPanel(null);
    pushToast(`⚔️ ${sword.name} +${sword.level} 장착`, 'info');
  }

  // ── Shop ──────────────────────────────────────────────────────────────────────
  function handleBuy(key, price) {
    if (state.gold < price) {
      pushToast('골드가 부족합니다.', 'error'); return;
    }

    const item       = SHOP_ITEMS[key];
    let   newGold    = state.gold - price;
    let   extra      = {};

    if (item.type === 'skip') {
      const capacity = BASE_STORAGE_CAPACITY + state.storageUpgradeCount * 10;
      if (state.storage.length >= capacity) {
        pushToast('보관함이 꽉 찼습니다.', 'error'); return;
      }
      const newId    = state.nextSwordId;
      const skipSword = { id: newId, name: WEAPON_NAMES[item.value] ?? `+${item.value} 검`, level: item.value };
      extra = {
        storage:     [...state.storage, skipSword],
        nextSwordId: newId + 1,
      };
      pushToast(`📦 +${item.value} 검이 보관함에 추가되었습니다.`, 'success');
    } else if (item.type === 'boost') {
      extra = { activeBoost: { expiresAt: Date.now() + 10 * 60 * 1000, bonusPct: item.value ?? 5 } };
      pushToast(`⚡ 10분간 성공확률 +${item.value ?? 5}% 부스트 활성화!`, 'success');
    } else if (item.type === 'protection') {
      const cur = state.protectionTickets ?? 0;
      extra = {
        protectionTickets: cur + 1,
        protectionTicketsPurchased: (state.protectionTicketsPurchased ?? 0) + 1,
      };
      pushToast(`🛡️ 파손 방지권 구매 완료 (${cur + 1}개 보유)`, 'success');
    } else if (item.type === 'storage') {
      extra = { storageUpgradeCount: state.storageUpgradeCount + 1 };
      pushToast(`📦 보관함이 +10칸 확장되었습니다.`, 'success');
    }

    update({ gold: newGold, ...extra });
  }

  // ─── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className={`game-layout ${getPhaseThemeClass(state.activeSword?.level ?? 0)}`}>
      <GoldBar
        gold={state.gold}
        fragments={state.fragments}
        activeBoost={state.activeBoost}
        protectionTickets={state.protectionTickets ?? 0}
        onReturnMenu={onReturnMenu}
        onSecretPressStart={handleCheatLongPressStart}
        onSecretPressEnd={handleCheatLongPressEnd}
        key={boostTick}
      />

      <div className="game-body">
        <SwordDisplay
          sword={state.activeSword}
          fragments={state.fragments}
          storage={state.storage}
          activeBoost={state.activeBoost}
        />

        <ActionBar
          hasSword={!!state.activeSword}
          onEnhance={handleEnhance}
          onSell={handleSell}
          onStore={handleStore}
          onShop={() => setPanel('shop')}
        />
      </div>

      {/* Inventory panel */}
      {panel === 'inventory' && (
        <InventoryPanel
          storage={state.storage}
          storageUpgradeCount={state.storageUpgradeCount}
          activeSword={state.activeSword}
          onEquip={handleEquip}
          onClose={() => setPanel(null)}
        />
      )}

      {/* Shop panel */}
      {panel === 'shop' && (
        <ShopPanel
          gold={state.gold}
          storageUpgradeCount={state.storageUpgradeCount}
          protectionTicketsPurchased={state.protectionTicketsPurchased ?? 0}
          enhanceWarningsEnabled={state.enhanceWarningsEnabled ?? true}
          onToggleEnhanceWarnings={(enabled) => {
            update({ enhanceWarningsEnabled: enabled });
            pushToast(
              enabled
                ? '강화 경고 팝업이 다시 켜졌습니다.'
                : '강화 경고 팝업 자동 표시를 끕니다.',
              'info'
            );
          }}
          onBuy={handleBuy}
          onClose={() => setPanel(null)}
        />
      )}

      {/* Codex panel */}
      {panel === 'codex' && (
        <CodexPanel
          maxSuccessLevel={state.maxSuccessLevel ?? 0}
          onClose={() => setPanel(null)}
        />
      )}

      {panel === 'journal' && (
        <StoryJournalPanel
          maxSuccessLevel={state.maxSuccessLevel ?? 0}
          seenStoryPhases={state.seenStoryPhases ?? []}
          storyPopupsEnabled={state.storyPopupsEnabled ?? true}
          onToggleStoryPopups={(enabled) => {
            update({ storyPopupsEnabled: enabled });
            pushToast(
              enabled
                ? '스토리 팝업이 다시 켜졌습니다.'
                : '스토리 팝업 자동 표시를 끕니다. 단, 새 phase는 1회 표시됩니다.',
              'info'
            );
          }}
          onOpenStoryPhase={(phaseKey) => setJournalStoryPhase(phaseKey)}
          onClose={() => setPanel(null)}
        />
      )}

      {panel === 'cheat' && state.cheatUnlocked && (
        <CheatPanel
          gold={state.gold}
          cheatForceOutcome={state.cheatForceOutcome ?? 'none'}
          cheatIgnoreRequirements={state.cheatIgnoreRequirements === true}
          fragments={state.fragments}
          protectionTickets={state.protectionTickets ?? 0}
          onSetForceOutcome={(mode) => update({ cheatForceOutcome: mode })}
          onToggleIgnoreRequirements={(enabled) => update({ cheatIgnoreRequirements: enabled })}
          onAdjustGold={(delta) => {
            const current = state.gold ?? 0;
            update({ gold: Math.max(0, current + delta) });
          }}
          onAdjustFragment={(key, delta) => {
            const current = state.fragments?.[key] ?? 0;
            update({
              fragments: {
                ...state.fragments,
                [key]: Math.max(0, current + delta),
              },
            });
          }}
          onAdjustProtection={(delta) => {
            const current = state.protectionTickets ?? 0;
            update({ protectionTickets: Math.max(0, current + delta) });
          }}
          onClose={() => setPanel(null)}
        />
      )}

      {/* Sell confirmation modal */}
      {modal?.type === 'sell' && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>검 판매</h3>
            <p>
              <strong>{modal.data.name} +{modal.data.level}</strong>을 판매합니다.
            </p>
            <p>
              획득: <strong>{sellPrice(modal.data.level).toLocaleString()} G</strong>
              &nbsp;+&nbsp;
              <strong>
                {(() => {
                  const z = zoneFragKey(Math.max(1, modal.data.level));
                  return `${FRAGMENT_LABELS[z]} ×${SELL_FRAGMENT_REWARDS[z] ?? 0}`;
                })()}
              </strong>
            </p>
            <div className="modal-actions">
              <button className="btn-primary" onClick={confirmSell}>판매</button>
              <button className="btn-ghost"   onClick={() => setModal(null)}>취소</button>
            </div>
          </div>
        </div>
      )}

      {/* Enhance warning modal */}
      {enhanceWarning && (
        <div
          className="modal-overlay"
          onClick={() => {
            if (enhanceWarningDontShowAgain) {
              update({ enhanceWarningsEnabled: false });
            }
            setEnhanceWarningDontShowAgain(false);
            setEnhanceWarning(null);
          }}
        >
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>강화 경고</h3>
            <p>
              <strong>+{enhanceWarning.nextLevel}</strong> 강화 시 파손 방지권이 부족합니다.
            </p>
            <p>
              필요: <strong>{enhanceWarning.reqTickets}개</strong>
              &nbsp;|&nbsp;
              보유: <strong>{enhanceWarning.ticketCount}개</strong>
              &nbsp;|&nbsp;
              부족: <strong>{enhanceWarning.missingTickets}개</strong>
            </p>
            <p>실패하면 검이 파괴됩니다. 그래도 강화하시겠습니까?</p>
            <label className="story-hide-toggle">
              <input
                type="checkbox"
                checked={enhanceWarningDontShowAgain}
                onChange={(e) => setEnhanceWarningDontShowAgain(e.target.checked)}
              />
              다시 띄우지 않기
            </label>
            <div className="modal-actions">
              <button
                className="btn-primary"
                onClick={() => {
                  if (enhanceWarningDontShowAgain) {
                    update({ enhanceWarningsEnabled: false });
                  }
                  setEnhanceWarningDontShowAgain(false);
                  setEnhanceWarning(null);
                  handleEnhance(true);
                }}
              >
                계속 강화
              </button>
              <button
                className="btn-ghost"
                onClick={() => {
                  if (enhanceWarningDontShowAgain) {
                    update({ enhanceWarningsEnabled: false });
                  }
                  setEnhanceWarningDontShowAgain(false);
                  setEnhanceWarning(null);
                }}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {storyQueue.length > 0 && (
        <StoryPhaseModal phaseKey={storyQueue[0]} onClose={closeStoryPhase} />
      )}

      {journalStoryPhase && (
        <StoryPhaseModal
          phaseKey={journalStoryPhase}
          showHideFutureToggle={false}
          onClose={() => setJournalStoryPhase(null)}
        />
      )}

      {/* Inventory FAB */}
      <button
        className="inv-fab"
        onClick={() => setPanel(panel === 'inventory' ? null : 'inventory')}
        title="보관함"
      >
        📦 보관함
      </button>

      <button
        className="codex-fab"
        onClick={() => setPanel(panel === 'codex' ? null : 'codex')}
        title="도감"
      >
        📖 도감
      </button>

      <button
        className="journal-fab"
        onClick={() => setPanel(panel === 'journal' ? null : 'journal')}
        title="대장장이의 일기"
      >
        📜 일기
      </button>

      {state.cheatUnlocked && (
        <button
          className="cheat-fab"
          onClick={() => setPanel(panel === 'cheat' ? null : 'cheat')}
          title="치트 모드"
        >
          🧪 치트
        </button>
      )}

      <Toast messages={toasts} onDismiss={dismissToast} />
    </div>
  );
}

function inferSeenStoryPhases(maxSuccessLevel) {
  const phases = [];
  if (maxSuccessLevel >= 1) phases.push('phase0', 'phase1');
  if (maxSuccessLevel >= 11) phases.push('phase2');
  if (maxSuccessLevel >= 21) phases.push('phase3');
  if (maxSuccessLevel >= 31) phases.push('phase4');
  if (maxSuccessLevel >= 41) phases.push('phase5');
  if (maxSuccessLevel >= 50) phases.push('phaseOmega');
  return phases;
}

function getStoryPhaseForMilestone(level) {
  if (level === 11) return 'phase2';
  if (level === 21) return 'phase3';
  if (level === 31) return 'phase4';
  if (level === 41) return 'phase5';
  if (level === 50) return 'phaseOmega';
  return null;
}

function getPhaseThemeClass(maxSuccessLevel) {
  if (maxSuccessLevel >= 50) return 'theme-phase-omega';
  if (maxSuccessLevel >= 41) return 'theme-phase-5';
  if (maxSuccessLevel >= 31) return 'theme-phase-4';
  if (maxSuccessLevel >= 21) return 'theme-phase-3';
  if (maxSuccessLevel >= 11) return 'theme-phase-2';
  if (maxSuccessLevel >= 1) return 'theme-phase-1';
  return 'theme-phase-0';
}
