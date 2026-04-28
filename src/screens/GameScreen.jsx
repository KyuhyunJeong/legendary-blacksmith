import { useState, useEffect, useCallback, useRef } from 'react';
import { writeSave }           from '../utils/storage.js';
import {
  successRate, repairableFailRate, destroyRate,
  enhanceCost, sellPrice, actualRepairCost, firstRepairCost,
  fragmentRequirements, swordSacrificeRequired,
  fragmentDropRoll, zoneKey, maxRepairCount,
  storageNextTier,
} from '../utils/formulas.js';
import {
  FRAGMENT_LABELS, FRAGMENT_LABELS_EN,
  BASE_STORAGE_CAPACITY, BASE_MAX_REPAIR,
  STARTING_STATE, WEAPON_NAMES,
  SKIP_TICKETS, CHALLENGE_PACKAGE,
  FRAGMENT_EXCHANGE_RATES, STORAGE_TIERS,
} from '../constants/gameConfig.js';

import GoldBar         from '../components/GoldBar.jsx';
import SwordDisplay    from '../components/SwordDisplay.jsx';
import ActionBar       from '../components/ActionBar.jsx';
import InventoryPanel  from '../components/InventoryPanel.jsx';
import ShopPanel       from '../components/ShopPanel.jsx';
import CodexPanel      from '../components/CodexPanel.jsx';
import StoryJournalPanel from '../components/StoryJournalPanel.jsx';
import CheatPanel      from '../components/CheatPanel.jsx';
import HelpPanel       from '../components/HelpPanel.jsx';
import SettingsPanel   from '../components/SettingsPanel.jsx';
import RepairOfferModal from '../components/RepairOfferModal.jsx';
import StoryPhaseModal from '../components/StoryPhaseModal.jsx';
import Toast           from '../components/Toast.jsx';

// ─── Toast helper ─────────────────────────────────────────────────────────────
let _toastId = 0;
function makeToast(text, type = 'info') {
  return { id: ++_toastId, text, type };
}

export default function GameScreen({ initialState, username, onReturnMenu }) {
  // Migrate saves from old formats to new
  function migrateState(s) {
    const normalizeSword = (sword) => {
      if (!sword) return sword;
      if ((sword.level ?? 0) <= 0) {
        return { ...sword, level: 1, name: WEAPON_NAMES[1] };
      }
      return sword;
    };

    const source = s ?? STARTING_STATE;
    const normalizedActive  = normalizeSword(source?.activeSword);
    const normalizedStorage = (source?.storage ?? []).map(normalizeSword);
    const existingLevels    = [normalizedActive?.level ?? 0, ...normalizedStorage.map((it) => it.level ?? 0)];
    const inferredMaxSuccess = Math.max(0, ...existingLevels);

    let migrated = {
      ...source,
      activeSword: normalizedActive,
      storage: normalizedStorage,
    };

    // ── Remove old fields ─────────────────────────────────────────────────
    delete migrated.protectionTickets;
    delete migrated.protectionTicketsPurchased;
    delete migrated.activeBoost;
    delete migrated.storageUpgradeCount;

    // ── Add new fields if missing ─────────────────────────────────────────
    if (migrated.repairUsed === undefined)              migrated.repairUsed = 0;
    if (migrated.challengeBoostWeaponId === undefined)  migrated.challengeBoostWeaponId = null;
    if (migrated.usedBoostThisGame === undefined)       migrated.usedBoostThisGame = false;
    if (migrated.usedSkipThisGame === undefined)        migrated.usedSkipThisGame = false;

    // storageSlots: migrate from old storageUpgradeCount if present
    if (migrated.storageSlots === undefined) {
      const oldUpgrades = source?.storageUpgradeCount ?? 0;
      migrated.storageSlots = BASE_STORAGE_CAPACITY + oldUpgrades * 10;
    }

    if (migrated.maxSuccessLevel === undefined)         migrated.maxSuccessLevel = inferredMaxSuccess;
    if (migrated.seenStoryPhases === undefined)         migrated.seenStoryPhases = inferSeenStoryPhases(inferredMaxSuccess);
    if (migrated.storyPopupsEnabled === undefined)      migrated.storyPopupsEnabled = true;
    if (migrated.cheatUnlocked === undefined)           migrated.cheatUnlocked = false;
    if (migrated.cheatForceOutcome === undefined)       migrated.cheatForceOutcome = 'none';
    if (migrated.cheatIgnoreRequirements === undefined) migrated.cheatIgnoreRequirements = false;
    if (migrated.enhanceWarningsEnabled === undefined)   migrated.enhanceWarningsEnabled = true;
    if (migrated.goldWarningEnabled === undefined)        migrated.goldWarningEnabled = true;
    if (migrated.autoBreakWarningEnabled === undefined)  migrated.autoBreakWarningEnabled = true;

    return migrated;
  }

  const [state,    setState]    = useState(() => migrateState(initialState));
  const [panel,    setPanel]    = useState(null);
  const [lang,     setLang]     = useState('ko');
  const [toasts,   setToasts]   = useState([]);
  const [modal,    setModal]    = useState(null);   // null | { type, data }
  const [repairOffer, setRepairOffer] = useState(null); // null | { level, cost, pendingGold, pendingFragments, pendingStorage }
  const [enhanceWarning, setEnhanceWarning] = useState(null); // null | { nextLevel }
  const [enhanceWarningDontShowAgain, setEnhanceWarningDontShowAgain] = useState(false);
  const [goldWarning, setGoldWarning] = useState(null); // null | { nextLevel }
  const [cannotRepairModal, setCannotRepairModal] = useState(null); // null | { repairCost, pendingGold, pendingFragments, pendingStorage }
  const [storyQueue, setStoryQueue] = useState([]);
  const [journalStoryPhase, setJournalStoryPhase] = useState(null);
  const [cardNotif, setCardNotif] = useState(null);
  const startupStoryQueued = useRef(false);
  const cheatLongPressTimerRef = useRef(null);

  // Persist on every state change
  useEffect(() => {
    writeSave(username, state.slot, state);
  }, [state]);

  // ── Helpers ─────────────────────────────────────────────────────────────────
  function pushToast(text, type = 'info') {
    const toast = makeToast(text, type);
    setToasts((prev) => [...prev, toast]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== toast.id)), 3200);
  }

  function dismissToast(id) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  function showCardNotif(type, message) {
    setCardNotif({ type, message });
    setTimeout(() => setCardNotif(null), 3000);
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
      pushToast(lang === 'en'
        ? 'Story popups disabled. Check the Codex for art and content.'
        : '앞으로 스토리 팝업이 표시되지 않습니다. 도감에서 일러스트와 내용을 확인할 수 있어요.', 'info');
    }

  }

  function zoneFragKey(level) {
    return zoneKey(level);
  }

  function currentMaxRepair() {
    return maxRepairCount(state.maxSuccessLevel ?? 0);
  }

  function isChallengeBoostActive() {
    return state.challengeBoostWeaponId != null &&
           state.activeSword?.id === state.challengeBoostWeaponId;
  }

  function handleCheatLongPressStart() {
    if (state.cheatUnlocked) return;

    if (cheatLongPressTimerRef.current) {
      clearTimeout(cheatLongPressTimerRef.current);
    }

    cheatLongPressTimerRef.current = setTimeout(() => {
      update({ cheatUnlocked: true });
      pushToast(lang === 'en' ? 'Cheat mode unlocked. Check the 🧪 button below.' : '치트 모드가 해금되었습니다. 우측 하단의 🧪 버튼을 확인하세요.', 'warn');
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
  function handleEnhance(skipRepairWarning = false, skipGoldWarning = false) {
    const sword = state.activeSword;
    if (!sword) return;

    const nextLevel = sword.level + 1;
    if (nextLevel > 50) {
      pushToast(lang === 'en' ? 'Already at max enhancement.' : '이미 최고 강화 단계입니다.', 'warn');
      return;
    }

    const fragReqMap = fragmentRequirements(nextLevel);
    const sacrifice  = swordSacrificeRequired(nextLevel); // { consume:[], require:[] }
    const cost       = enhanceCost(nextLevel);
    const ignore     = state.cheatIgnoreRequirements === true;

    // ── Requirement checks ────────────────────────────────────────────────
    if (!ignore && state.gold < cost) {
      pushToast(lang === 'en'
        ? `Insufficient gold. (Need: ${cost.toLocaleString()} G)`
        : `골드가 부족합니다. (필요: ${cost.toLocaleString()} G)`, 'error');
      return;
    }
    if (!ignore) {
      for (const [key, req] of Object.entries(fragReqMap)) {
        if ((state.fragments[key] ?? 0) < req) {
          pushToast(lang === 'en'
            ? `Not enough ${FRAGMENT_LABELS_EN[key]}. (Need: ${req})`
            : `${FRAGMENT_LABELS[key]}이 부족합니다. (필요: ${req}개)`, 'error');
          return;
        }
      }
    }
    if (!ignore) {
      for (const lv of sacrifice.consume) {
        if (!state.storage.some((s) => s.level === lv)) {
          pushToast(lang === 'en' ? `+${lv} sword not in storage.` : `+${lv} 검이 보관함에 없습니다.`, 'error');
          return;
        }
      }
      for (const lv of sacrifice.require) {
        if (!state.storage.some((s) => s.level === lv)) {
          pushToast(lang === 'en' ? `+${lv} sword must be in storage (not consumed).` : `+${lv} 검이 보관함에 있어야 합니다 (소모 안 됨).`, 'error');
          return;
        }
      }
    }

    // ── Warn if repair capacity exhausted (any failure = instant destroy) ─
    const repairCap = currentMaxRepair();
    const repairUsed = state.repairUsed ?? 0;
    if (!skipRepairWarning && (state.enhanceWarningsEnabled ?? true) && repairUsed >= repairCap) {
      setEnhanceWarning({ nextLevel });
      setEnhanceWarningDontShowAgain(false);
      return;
    }

    // ── Warn if gold after cost won't cover repair on failure ──────────────
    const repairCostIfFail = actualRepairCost(nextLevel, repairUsed);
    if (!skipGoldWarning && (state.goldWarningEnabled ?? true)
        && repairUsed < repairCap && !ignore
        && (state.gold - cost) < repairCostIfFail) {
      setGoldWarning({ nextLevel });
      return;
    }

    // ── Deduct cost & materials ────────────────────────────────────────────
    let newGold      = ignore ? state.gold : state.gold - cost;
    let newFragments = { ...state.fragments };
    if (!ignore) {
      for (const [key, req] of Object.entries(fragReqMap)) newFragments[key] -= req;
    }
    let newStorage = [...state.storage];
    if (!ignore) {
      for (const lv of sacrifice.consume) {
        const idx = newStorage.findIndex((s) => s.level === lv);
        if (idx !== -1) newStorage.splice(idx, 1);
      }
    }

    // ── Roll outcome ───────────────────────────────────────────────────────
    const baseSuccess   = successRate(nextLevel);
    const baseRepair    = repairableFailRate(nextLevel);
    const boostPct      = isChallengeBoostActive() ? 5 : 0;
    // Boost adds to success, subtracts from repairable-fail (not destroy)
    const adjSuccess    = Math.min(baseSuccess + boostPct, 99);
    const adjRepair     = Math.max(baseRepair  - boostPct, 0);
    // adjDestroy = 100 - adjSuccess - adjRepair (kept same)

    const forcedOutcome = state.cheatForceOutcome ?? 'none';
    let roll;
    if (forcedOutcome === 'success')      roll = 0;
    else if (forcedOutcome === 'fail')    roll = adjSuccess + adjRepair / 2 + 0.001; // repairable
    else if (forcedOutcome === 'destroy') roll = 100 - 0.001;                         // destroy
    else                                  roll = Math.random() * 100;

    const isSuccess        = roll < adjSuccess;
    const isRepairableFail = !isSuccess && roll < (adjSuccess + adjRepair);
    // isDestroy = !isSuccess && !isRepairableFail

    // ── SUCCESS ────────────────────────────────────────────────────────────
    if (isSuccess) {
      const upgraded   = { ...sword, level: nextLevel, name: WEAPON_NAMES[nextLevel] ?? sword.name };
      const prevMax    = state.maxSuccessLevel ?? 0;
      const newMax     = Math.max(prevMax, nextLevel);

      // Hidden ending checks
      let storyPhase = getStoryPhaseForMilestone(nextLevel);
      if (nextLevel === 50) {
        if (!state.usedBoostThisGame && !state.usedSkipThisGame) {
          storyPhase = 'phaseHiddenB';
        } else if (!state.usedBoostThisGame) {
          storyPhase = 'phaseHiddenA';
        }
      }

      update({
        gold: newGold,
        fragments: newFragments,
        storage: newStorage,
        activeSword: upgraded,
        maxSuccessLevel: newMax,
      });
      enqueueStoryPhases([storyPhase]);
      showCardNotif('success', lang === 'en' ? `Forge success +${nextLevel}` : `강화 성공 +${nextLevel}`);
      return;
    }

    // ── REPAIRABLE FAIL ────────────────────────────────────────────────────
    if (isRepairableFail && repairUsed < repairCap) {
      const repairCost = actualRepairCost(nextLevel, repairUsed);
      if (newGold >= repairCost) {
        // Can afford repair → show repair offer modal
        setRepairOffer({
          level: nextLevel,
          cost:  repairCost,
          pendingGold:      newGold,
          pendingFragments: newFragments,
          pendingStorage:   newStorage,
        });
        setState((prev) => ({
          ...prev,
          gold:      newGold,
          fragments: newFragments,
          storage:   newStorage,
        }));
        showCardNotif('warn', lang === 'en'
          ? `Forge fail! Repair: ${repairCost.toLocaleString()} G (${repairUsed + 1}/${repairCap})`
          : `강화 실패! 수리비: ${repairCost.toLocaleString()} G (${repairUsed + 1}/${repairCap})`);
        return;
      }
      // Can't afford repair
      if (state.autoBreakWarningEnabled ?? true) {
        // Show explanation modal, user confirms → destroy
        setCannotRepairModal({ repairCost, pendingGold: newGold, pendingFragments: newFragments, pendingStorage: newStorage });
        setState((prev) => ({
          ...prev,
          gold:      newGold,
          fragments: newFragments,
          storage:   newStorage,
        }));
        return;
      }
      // autoBreakWarningEnabled = false → fall through to DESTROY silently
    }

    // ── DESTROY (or repairable fail with repair cap exhausted) ─────────────
    const dropKey   = zoneFragKey(sword.level);
    const dropCount = fragmentDropRoll(sword.level);
    if (dropCount > 0) newFragments[dropKey] = (newFragments[dropKey] ?? 0) + dropCount;

    const freeId    = state.nextSwordId;
    const freeSword = { id: freeId, name: WEAPON_NAMES[1], level: 1 };
    update({
      gold: newGold,
      fragments: newFragments,
      storage: newStorage,
      activeSword: freeSword,
      nextSwordId: freeId + 1,
      repairUsed: 0,
    });
    const fragMsg = dropCount > 0
      ? ` ${lang === 'en' ? FRAGMENT_LABELS_EN[dropKey] : FRAGMENT_LABELS[dropKey]} ×${dropCount}.`
      : '';
    showCardNotif('error', lang === 'en'
      ? `Break.${fragMsg}`
      : `파손.${fragMsg}`);
  }

  // ── Repair / Abandon after a repairable fail ──────────────────────────────
  function handleRepair() {
    if (!repairOffer) return;
    const { level, cost, pendingGold, pendingStorage } = repairOffer;
    if (pendingGold < cost) {
      pushToast(lang === 'en' ? 'Not enough gold to repair.' : '수리비가 부족합니다.', 'error');
      return;
    }
    update({
      gold: pendingGold - cost,
      repairUsed: (state.repairUsed ?? 0) + 1,
    });
    setRepairOffer(null);
    pushToast(lang === 'en'
      ? `Blade repaired. (${((state.repairUsed ?? 0) + 1)}/${currentMaxRepair()} repairs used)`
      : `검 수리 완료. (${((state.repairUsed ?? 0) + 1)}/${currentMaxRepair()} 수리 사용)`, 'info');
  }

  function handleAbandonRepair() {
    if (!repairOffer) return;
    const { pendingFragments, pendingStorage } = repairOffer;
    const level  = state.activeSword?.level ?? 1;
    const dropKey   = zoneFragKey(level);
    const dropCount = fragmentDropRoll(level);
    const newFrags  = { ...pendingFragments };
    if (dropCount > 0) newFrags[dropKey] = (newFrags[dropKey] ?? 0) + dropCount;

    const freeId    = state.nextSwordId;
    const freeSword = { id: freeId, name: WEAPON_NAMES[1], level: 1 };
    update({
      fragments:   newFrags,
      storage:     pendingStorage,
      activeSword: freeSword,
      nextSwordId: freeId + 1,
      repairUsed:  0,
    });
    setRepairOffer(null);
    const fragMsg = dropCount > 0
      ? ` ${lang === 'en' ? FRAGMENT_LABELS_EN[dropKey] : FRAGMENT_LABELS[dropKey]} ×${dropCount}.`
      : '';
    showCardNotif('error', lang === 'en'
      ? `Break.${fragMsg}`
      : `파손.${fragMsg}`);
  }

  function handleCannotRepairDestroy() {
    if (!cannotRepairModal) return;
    const { pendingFragments, pendingStorage } = cannotRepairModal;
    const level = state.activeSword?.level ?? 1;
    const dropKey   = zoneFragKey(level);
    const dropCount = fragmentDropRoll(level);
    const newFrags  = { ...pendingFragments };
    if (dropCount > 0) newFrags[dropKey] = (newFrags[dropKey] ?? 0) + dropCount;

    const freeId    = state.nextSwordId;
    const freeSword = { id: freeId, name: WEAPON_NAMES[1], level: 1 };
    update({
      fragments:   newFrags,
      storage:     pendingStorage,
      activeSword: freeSword,
      nextSwordId: freeId + 1,
      repairUsed:  0,
    });
    setCannotRepairModal(null);
    const fragMsg = dropCount > 0
      ? ` ${lang === 'en' ? FRAGMENT_LABELS_EN[dropKey] : FRAGMENT_LABELS[dropKey]} ×${dropCount}.`
      : '';
    showCardNotif('error', lang === 'en'
      ? `Break.${fragMsg}`
      : `파손.${fragMsg}`);
  }



  // ── Sell ─────────────────────────────────────────────────────────────────────
  function handleSell() {
    if (!state.activeSword) return;
    setModal({ type: 'sell', data: state.activeSword });
  }

  function handleSellFromStorage(swordId) {
    const sword = state.storage.find(s => s.id === swordId);
    if (!sword) return;
    setModal({ type: 'sellStorage', data: sword });
  }

  function confirmSellFromStorage() {
    const sword = modal?.data;
    if (!sword) return;
    const gold = sellPrice(sword.level);
    update({
      gold:    state.gold + gold,
      storage: state.storage.filter(s => s.id !== sword.id),
    });
    pushToast(
      lang === 'en'
        ? `💰 Sold +${sword.level} blade! +${gold.toLocaleString()} G`
        : `💰 +${sword.level} 검 판매 완료! +${gold.toLocaleString()} G`,
      'success'
    );
    setModal(null);
  }

  function confirmSell() {
    const sword = state.activeSword;
    if (!sword) return;

    // +50 sell = betrayal ending — strong warning then full reset
    if (sword.level === 50) {
      setModal({ type: 'sell50Confirm', data: sword });
      return;
    }

    const gold    = sellPrice(sword.level);
    const freeId  = state.nextSwordId;
    const freeSword = { id: freeId, name: WEAPON_NAMES[1], level: 1 };
    update({
      gold:        state.gold + gold,
      activeSword: freeSword,
      nextSwordId: freeId + 1,
      repairUsed:  0,
    });
    pushToast(
      lang === 'en'
        ? `💰 Sold! +${gold.toLocaleString()} G | +1 base blade granted`
        : `💰 판매 완료! +${gold.toLocaleString()} G | 기초 검 +1 지급`,
      'success'
    );
    setModal(null);
  }

  function confirmSell50() {
    // Betrayal ending: give gold display, then full game reset
    const bigGold = 1_000_000_000;
    setModal({ type: 'sell50Final', gold: bigGold });
    setTimeout(() => {
      // Reset game to fresh state, keep username
      setState(() => migrateState(null));
      setModal(null);
      pushToast(lang === 'en'
        ? '태초의 불꽃을 배신한 자에게는 그 어떠한 업적도 주어질 수 없다.'
        : '태초의 불꽃을 배신한 자에게는 그 어떠한 업적도 주어질 수 없다.',
        'error');
    }, 3000);
  }



  // ── Store ─────────────────────────────────────────────────────────────────────
  function handleStore() {
    const sword    = state.activeSword;
    if (!sword) return;
    const capacity = state.storageSlots ?? BASE_STORAGE_CAPACITY;
    if (state.storage.length >= capacity) {
      pushToast(lang === 'en' ? 'Storage full. Expand in the shop.' : '보관함이 꽉 찼습니다. 상점에서 확장하세요.', 'error'); return;
    }
    const freeId    = state.nextSwordId;
    const freeSword = { id: freeId, name: WEAPON_NAMES[1], level: 1 };
    update({
      storage:     [...state.storage, { ...sword, repairUsed: state.repairUsed ?? 0 }],
      activeSword: freeSword,
      nextSwordId: freeId + 1,
      repairUsed:  0,
    });
    pushToast(lang === 'en' ? `📦 ${sword.name} +${sword.level} stored | +1 base blade granted` : `📦 ${sword.name} +${sword.level} 보관 완료 | 기초 검 +1 지급`, 'info');
  }

  // ── Equip from inventory ──────────────────────────────────────────────────────
  function handleEquip(swordId) {
    const sword    = state.storage.find((s) => s.id === swordId);
    if (!sword) return;
    const capacity = state.storageSlots ?? BASE_STORAGE_CAPACITY;

    let newStorage = state.storage.filter((s) => s.id !== swordId);
    if (state.activeSword) {
      if (newStorage.length >= capacity) {
        pushToast(lang === 'en' ? 'Storage full. Cannot swap.' : '보관함이 꽉 차서 교체할 수 없습니다.', 'error'); return;
      }
      newStorage = [...newStorage, { ...state.activeSword, repairUsed: state.repairUsed ?? 0 }];
    }

    update({ activeSword: sword, storage: newStorage, repairUsed: sword.repairUsed ?? 0 });
    setPanel(null);
    pushToast(lang === 'en' ? `⚔️ ${sword.name} +${sword.level} equipped` : `⚔️ ${sword.name} +${sword.level} 장착`, 'info');
  }

  // ── Fragment exchange ─────────────────────────────────────────────────────────
  function handleFragmentExchange(fromKey) {
    const rule = FRAGMENT_EXCHANGE_RATES.find((r) => r.from === fromKey);
    if (!rule) return;
    const have = state.fragments[fromKey] ?? 0;
    if (have < rule.ratio) {
      pushToast(lang === 'en'
        ? `Not enough ${FRAGMENT_LABELS_EN[fromKey]}. (Need ${rule.ratio})`
        : `${FRAGMENT_LABELS[fromKey]}이 부족합니다. (${rule.ratio}개 필요)`, 'error');
      return;
    }
    update({
      fragments: {
        ...state.fragments,
        [fromKey]: have - rule.ratio,
        [rule.to]:  (state.fragments[rule.to] ?? 0) + 1,
      },
    });
    pushToast(lang === 'en'
      ? `Exchanged ${rule.ratio}× ${FRAGMENT_LABELS_EN[fromKey]} → 1× ${FRAGMENT_LABELS_EN[rule.to]}`
      : `${FRAGMENT_LABELS[fromKey]} ${rule.ratio}개 → ${FRAGMENT_LABELS[rule.to]} 1개 교환`, 'success');
  }

  // ── Shop ──────────────────────────────────────────────────────────────────────
  function handleBuy(key) {
    const storageCapacity = state.storageSlots ?? BASE_STORAGE_CAPACITY;

    // Skip ticket
    const skipTicket = SKIP_TICKETS.find((t) => t.key === key);
    if (skipTicket) {
      const { price, value, unlockLevel, labelEn, label } = skipTicket;
      if ((state.maxSuccessLevel ?? 0) < unlockLevel) {
        pushToast(lang === 'en' ? `Requires +${unlockLevel} reached first.` : `+${unlockLevel} 달성 후 구매 가능합니다.`, 'error');
        return;
      }
      if (state.gold < price) {
        pushToast(lang === 'en' ? 'Insufficient gold.' : '골드가 부족합니다.', 'error');
        return;
      }
      if (state.usedSkipThisGame) {
        pushToast(lang === 'en' ? 'Skip ticket already used this run.' : '이번 게임에서 이미 스킵권을 사용했습니다.', 'error');
        return;
      }
      if (state.storage.length >= storageCapacity) {
        pushToast(lang === 'en' ? 'Storage full.' : '보관함이 꽉 찼습니다.', 'error');
        return;
      }
      const newId   = state.nextSwordId;
      const newSword = { id: newId, name: WEAPON_NAMES[value] ?? `+${value} 검`, level: value };
      update({
        gold:             state.gold - price,
        storage:          [...state.storage, newSword],
        nextSwordId:      newId + 1,
        usedSkipThisGame: true,
      });
      pushToast(lang === 'en'
        ? `📦 +${value} sword added to storage.`
        : `📦 +${value} 검이 보관함에 추가되었습니다.`, 'success');
      return;
    }

    // Challenge package
    if (key === CHALLENGE_PACKAGE.key) {
      const { price, value, unlockLevel, boostPct } = CHALLENGE_PACKAGE;
      if ((state.maxSuccessLevel ?? 0) < unlockLevel) {
        pushToast(lang === 'en' ? `Requires +${unlockLevel} reached first.` : `+${unlockLevel} 달성 후 구매 가능합니다.`, 'error');
        return;
      }
      if (state.gold < price) {
        pushToast(lang === 'en' ? 'Insufficient gold.' : '골드가 부족합니다.', 'error');
        return;
      }
      if (state.usedBoostThisGame) {
        pushToast(lang === 'en' ? 'Challenge boost already used this run.' : '이번 게임에서 이미 챌린지 부스트를 사용했습니다.', 'error');
        return;
      }
      if (state.usedSkipThisGame) {
        pushToast(lang === 'en' ? 'Skip ticket already used this run.' : '이번 게임에서 이미 스킵권을 사용했습니다.', 'error');
        return;
      }
      if (state.storage.length >= storageCapacity) {
        pushToast(lang === 'en' ? 'Storage full.' : '보관함이 꽉 찼습니다.', 'error');
        return;
      }
      const newId    = state.nextSwordId;
      const newSword = { id: newId, name: WEAPON_NAMES[value] ?? `+${value} 검`, level: value };
      update({
        gold:                 state.gold - price,
        storage:              [...state.storage, newSword],
        nextSwordId:          newId + 1,
        challengeBoostWeaponId: newId,
        usedBoostThisGame:    true,
        usedSkipThisGame:     true,
      });
      pushToast(lang === 'en'
        ? `📦 +${value} Challenge blade added (+${boostPct}% boost on that blade).`
        : `📦 +${value} 챌린지 검 추가 (해당 검에만 성공률 +${boostPct}% 부스트).`, 'success');
      return;
    }

    // Storage upgrade
    if (key === 'storage') {
      const nextTier = storageNextTier(storageCapacity);
      if (!nextTier) {
        pushToast(lang === 'en' ? 'Storage is already at max.' : '보관함이 이미 최대입니다.', 'warn');
        return;
      }
      if (state.gold < nextTier.price) {
        pushToast(lang === 'en' ? 'Insufficient gold.' : '골드가 부족합니다.', 'error');
        return;
      }
      update({
        gold:         state.gold - nextTier.price,
        storageSlots: nextTier.slots,
      });
      pushToast(lang === 'en'
        ? `📦 Storage expanded to ${nextTier.slots} slots.`
        : `📦 보관함이 ${nextTier.slots}칸으로 확장되었습니다.`, 'success');
      return;
    }
  }



  // ─── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className={`game-layout ${getPhaseThemeClass(state.activeSword?.level ?? 0)}`}>
      <GoldBar
        gold={state.gold}
        fragments={state.fragments}
        repairUsed={state.repairUsed ?? 0}
        maxRepair={currentMaxRepair()}
        onReturnMenu={onReturnMenu}
        onOpenPanel={setPanel}
        cheatUnlocked={state.cheatUnlocked ?? false}
        onSecretPressStart={handleCheatLongPressStart}
        onSecretPressEnd={handleCheatLongPressEnd}
        lang={lang}
        onLangChange={setLang}
      />

      <div className="game-body">
        <SwordDisplay
          sword={state.activeSword}
          fragments={state.fragments}
          storage={state.storage}
          repairUsed={state.repairUsed ?? 0}
          maxRepair={currentMaxRepair()}
          hasChallengeBoost={isChallengeBoostActive()}
          lang={lang}
          cardNotif={cardNotif}
        />

        <ActionBar
          hasSword={!!state.activeSword}
          locked={!!repairOffer}
          onEnhance={handleEnhance}
          onSell={handleSell}
          onStore={handleStore}
          onShop={() => setPanel('shop')}
          lang={lang}
        />
      </div>

      {/* Inventory panel */}
      {panel === 'inventory' && (
        <InventoryPanel
          storage={state.storage}
          storageSlots={state.storageSlots ?? BASE_STORAGE_CAPACITY}
          activeSword={state.activeSword}
          onEquip={handleEquip}
          onSell={handleSellFromStorage}
          onClose={() => setPanel(null)}
          lang={lang}
        />
      )}

      {/* Shop panel */}
      {panel === 'shop' && (
        <ShopPanel
          gold={state.gold}
          storageSlots={state.storageSlots ?? BASE_STORAGE_CAPACITY}
          maxSuccessLevel={state.maxSuccessLevel ?? 0}
          usedSkipThisGame={state.usedSkipThisGame ?? false}
          usedBoostThisGame={state.usedBoostThisGame ?? false}
          fragments={state.fragments}
          onBuy={handleBuy}
          onExchange={handleFragmentExchange}
          onClose={() => setPanel(null)}
          lang={lang}
        />
      )}

      {/* Codex panel */}
      {panel === 'codex' && (
        <CodexPanel
          maxSuccessLevel={state.maxSuccessLevel ?? 0}
          onClose={() => setPanel(null)}
          lang={lang}
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
              lang === 'en'
                ? (enabled ? 'Story popups re-enabled.' : 'Story popups disabled. New phases still show once.')
                : (enabled ? '스토리 팝업이 다시 켜졌습니다.' : '스토리 팝업 자동 표시를 끓니다. 단, 새 phase는 1회 표시됩니다.'),
              'info'
            );
          }}
          onOpenStoryPhase={(phaseKey) => setJournalStoryPhase(phaseKey)}
          onClose={() => setPanel(null)}
          lang={lang}
        />
      )}

      {panel === 'help' && (
        <HelpPanel onClose={() => setPanel(null)} lang={lang} />
      )}

      {panel === 'cheat' && state.cheatUnlocked && (
        <CheatPanel
          gold={state.gold}
          cheatForceOutcome={state.cheatForceOutcome ?? 'none'}
          cheatIgnoreRequirements={state.cheatIgnoreRequirements === true}
          fragments={state.fragments}
          repairUsed={state.repairUsed ?? 0}
          maxRepair={currentMaxRepair()}
          onSetForceOutcome={(mode) => update({ cheatForceOutcome: mode })}
          onToggleIgnoreRequirements={(enabled) => update({ cheatIgnoreRequirements: enabled })}
          onAdjustGold={(delta) => {
            const current = state.gold ?? 0;
            update({ gold: Math.max(0, current + delta) });
          }}
          onAdjustFragment={(key, delta) => {
            const current = state.fragments?.[key] ?? 0;
            update({ fragments: { ...state.fragments, [key]: Math.max(0, current + delta) } });
          }}
          onAdjustRepairUsed={(delta) => {
            const current = state.repairUsed ?? 0;
            update({ repairUsed: Math.max(0, current + delta) });
          }}
          onClose={() => setPanel(null)}
          lang={lang}
        />
      )}

      {panel === 'settings' && (
        <SettingsPanel
          enhanceWarningsEnabled={state.enhanceWarningsEnabled ?? true}
          goldWarningEnabled={state.goldWarningEnabled ?? true}
          autoBreakWarningEnabled={state.autoBreakWarningEnabled ?? true}
          storyPopupsEnabled={state.storyPopupsEnabled ?? true}
          onToggle={(key, value) => update({ [key]: value })}
          onClose={() => setPanel(null)}
          lang={lang}
        />
      )}
      {modal?.type === 'sell' && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>{lang === 'en' ? 'Sell Blade' : '검 판매'}</h3>
            <p>
              {lang === 'en'
                ? <><strong>{modal.data.name} +{modal.data.level}</strong> will be sold.</>
                : <><strong>{modal.data.name} +{modal.data.level}</strong>을 판매합니다.</>}
            </p>
            <p>
              {lang === 'en' ? 'Receive: ' : '획득: '}
              <strong>{sellPrice(modal.data.level).toLocaleString()} G</strong>
            </p>
            <div className="modal-actions">
              <button className="btn-primary" onClick={confirmSell}>{lang === 'en' ? 'Sell' : '판매'}</button>
              <button className="btn-ghost"   onClick={() => setModal(null)}>{lang === 'en' ? 'Cancel' : '취소'}</button>
            </div>
          </div>
        </div>
      )}

      {modal?.type === 'sellStorage' && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>{lang === 'en' ? 'Sell Blade' : '검 판매'}</h3>
            <p>
              {lang === 'en'
                ? <><strong>{modal.data.name} +{modal.data.level}</strong> will be sold.</>
                : <><strong>{modal.data.name} +{modal.data.level}</strong>을 판매합니다.</>}
            </p>
            <p>
              {lang === 'en' ? 'Receive: ' : '획득: '}
              <strong>{sellPrice(modal.data.level).toLocaleString()} G</strong>
            </p>
            <div className="modal-actions">
              <button className="btn-primary" onClick={confirmSellFromStorage}>{lang === 'en' ? 'Sell' : '판매'}</button>
              <button className="btn-ghost"   onClick={() => setModal(null)}>{lang === 'en' ? 'Cancel' : '취소'}</button>
            </div>
          </div>
        </div>
      )}

      {/* +50 sell — betrayal warning */}
      {modal?.type === 'sell50Confirm' && (
        <div className="modal-overlay">
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ color: 'var(--color-error, #e55)' }}>
              {lang === 'en' ? '⚠️ Betray the Flame?' : '⚠️ 불꽃을 배신하겠습니까?'}
            </h3>
            <p>
              {lang === 'en'
                ? 'Selling the Final Flame will grant 1,000,000,000 G — then all progress will be PERMANENTLY ERASED.'
                : '태초의 불꽃을 판매하면 10억 골드를 받지만, 모든 게임 데이터가 완전히 초기화됩니다.'}
            </p>
            <p style={{ fontWeight: 'bold' }}>
              {lang === 'en' ? 'This cannot be undone.' : '되돌릴 수 없습니다.'}
            </p>
            <div className="modal-actions">
              <button className="btn-danger" onClick={confirmSell50}>{lang === 'en' ? 'Betray (Reset All)' : '배신 (전체 초기화)'}</button>
              <button className="btn-ghost"  onClick={() => setModal(null)}>{lang === 'en' ? 'Go back' : '돌아가기'}</button>
            </div>
          </div>
        </div>
      )}

      {/* +50 sell — final display before reset */}
      {modal?.type === 'sell50Final' && (
        <div className="modal-overlay">
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>{lang === 'en' ? 'The Flame has been sold.' : '불꽃이 팔려나갔다.'}</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-gold, gold)' }}>
              +{(modal.gold ?? 1_000_000_000).toLocaleString()} G
            </p>
            <p>{lang === 'en' ? 'The world forgets…' : '세상은 잊는다…'}</p>
          </div>
        </div>
      )}

      {/* Repair offer modal */}
      {repairOffer && (
        <RepairOfferModal
          repairOffer={repairOffer}
          repairUsed={state.repairUsed ?? 0}
          maxRepair={currentMaxRepair()}
          lang={lang}
          onRepair={handleRepair}
          onAbandon={handleAbandonRepair}
        />
      )}

      {/* Enhance warning modal — repair capacity exhausted */}
      {enhanceWarning && (
        <div
          className="modal-overlay"
          onClick={() => {
            if (enhanceWarningDontShowAgain) update({ enhanceWarningsEnabled: false });
            setEnhanceWarningDontShowAgain(false);
            setEnhanceWarning(null);
          }}
        >
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>{lang === 'en' ? 'Enhancement Warning' : '강화 경고'}</h3>
            <p>
              {lang === 'en'
                ? <>Repair capacity exhausted (<strong>{currentMaxRepair()}/{currentMaxRepair()}</strong>). Any failure will <strong>destroy</strong> the blade.</>
                : <>수리 횟수가 소진되었습니다 (<strong>{currentMaxRepair()}/{currentMaxRepair()}</strong>). 실패 시 검이 <strong>파괴</strong>됩니다.</>}
            </p>
            <p>{lang === 'en' ? 'Proceed?' : '계속 강화하시겠습니까?'}</p>
            <label className="story-hide-toggle">
              <input
                type="checkbox"
                checked={enhanceWarningDontShowAgain}
                onChange={(e) => setEnhanceWarningDontShowAgain(e.target.checked)}
              />
              {lang === 'en' ? "Don't show again" : '다시 띄우지 않기'}
            </label>
            <div className="modal-actions">
              <button
                className="btn-primary"
                onClick={() => {
                  if (enhanceWarningDontShowAgain) update({ enhanceWarningsEnabled: false });
                  setEnhanceWarningDontShowAgain(false);
                  setEnhanceWarning(null);
                  handleEnhance(true);
                }}
              >
                {lang === 'en' ? 'Proceed' : '계속 강화'}
              </button>
              <button
                className="btn-ghost"
                onClick={() => {
                  if (enhanceWarningDontShowAgain) update({ enhanceWarningsEnabled: false });
                  setEnhanceWarningDontShowAgain(false);
                  setEnhanceWarning(null);
                }}
              >
                {lang === 'en' ? 'Cancel' : '취소'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Gold warning modal — can't afford repair if fail */}
      {goldWarning && (() => {
        const nLv = goldWarning.nextLevel;
        const enhCost   = enhanceCost(nLv);
        const repCost   = actualRepairCost(nLv, state.repairUsed ?? 0);
        const remaining = state.gold - enhCost;
        return (
          <div className="modal-overlay" onClick={() => setGoldWarning(null)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <h3>{lang === 'en' ? '⚠️ Repair Cost Warning' : '⚠️ 수리비 부족 경고'}</h3>
              <p>
                {lang === 'en'
                  ? <>After paying the enhance cost, remaining gold: <strong>{remaining.toLocaleString()} G</strong></>
                  : <>강화비 지불 후 잔여 골드: <strong>{remaining.toLocaleString()} G</strong></>}
              </p>
              <p>
                {lang === 'en'
                  ? <>Repair cost (if fail): <strong>{repCost.toLocaleString()} G</strong> — insufficient!</>
                  : <>수리비 (실패 시): <strong>{repCost.toLocaleString()} G</strong> — 부족합니다!</>}
              </p>
              <p>
                {lang === 'en'
                  ? 'On failure the blade will be destroyed. Proceed?'
                  : '실패 시 수리가 불가하여 검이 파손됩니다. 계속하시겠습니까?'}
              </p>
              <div className="modal-actions">
                <button
                  className="btn-primary"
                  onClick={() => { setGoldWarning(null); handleEnhance(false, true); }}
                >
                  {lang === 'en' ? 'Proceed' : '계속 강화'}
                </button>
                <button className="btn-ghost" onClick={() => setGoldWarning(null)}>
                  {lang === 'en' ? 'Cancel' : '취소'}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Cannot repair modal — repairable fail but gold insufficient */}
      {cannotRepairModal && (() => {
        const { repairCost, pendingGold } = cannotRepairModal;
        return (
          <div className="modal-overlay">
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <h3>{lang === 'en' ? '⚒️ Cannot Repair — Break' : '⚒️ 수리 불가 — 파손'}</h3>
              <p>
                {lang === 'en'
                  ? <>Forge failed. Repair cost: <strong>{repairCost.toLocaleString()} G</strong></>
                  : <>강화 실패. 수리비: <strong>{repairCost.toLocaleString()} G</strong></>}
              </p>
              <p>
                {lang === 'en'
                  ? <>Remaining gold: <strong>{pendingGold.toLocaleString()} G</strong> — cannot afford repair.</>
                  : <>잔여 골드: <strong>{pendingGold.toLocaleString()} G</strong> — 수리비가 부족합니다.</>}
              </p>
              <p>
                {lang === 'en'
                  ? 'The blade will be destroyed.'
                  : '검이 파손됩니다.'}
              </p>
              <div className="modal-actions">
                <button className="btn-primary" onClick={handleCannotRepairDestroy}>
                  {lang === 'en' ? 'OK' : '확인'}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {storyQueue.length > 0 && (
        <StoryPhaseModal phaseKey={storyQueue[0]} onClose={closeStoryPhase} lang={lang} />
      )}

      {journalStoryPhase && (
        <StoryPhaseModal
          phaseKey={journalStoryPhase}
          showHideFutureToggle={false}
          onClose={() => setJournalStoryPhase(null)}
          lang={lang}
        />
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
