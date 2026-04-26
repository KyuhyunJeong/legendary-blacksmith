const SAVE_PREFIX = 'lb_save_';
const USERS_KEY   = 'lb_users';
const SESSION_KEY = 'lb_session';

// ─── Auth ────────────────────────────────────────────────────────────────────
export async function hashPassword(password) {
  const buf    = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
}

export async function registerUser(username, password) {
  const users = getUsers();
  if (users[username]) return { ok: false, error: '이미 사용 중인 아이디입니다.' };
  users[username] = await hashPassword(password);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return { ok: true };
}

export async function loginUser(username, password) {
  const users = getUsers();
  if (!users[username]) return { ok: false, error: '존재하지 않는 아이디입니다.' };
  const hash = await hashPassword(password);
  if (hash !== users[username]) return { ok: false, error: '비밀번호가 틀렸습니다.' };
  localStorage.setItem(SESSION_KEY, JSON.stringify({ username }));
  return { ok: true };
}

export function getSession() {
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function logoutUser() {
  localStorage.removeItem(SESSION_KEY);
}

// ─── Save slots ──────────────────────────────────────────────────────────────
function saveKey(username, slot) {
  return `${SAVE_PREFIX}${username}_${slot}`;
}

export function listSaves(username) {
  return [1, 2, 3].map((slot) => {
    const raw = localStorage.getItem(saveKey(username, slot));
    return raw ? { slot, ...JSON.parse(raw) } : null;
  });
}

export function loadSave(username, slot) {
  const raw = localStorage.getItem(saveKey(username, slot));
  return raw ? JSON.parse(raw) : null;
}

export function writeSave(username, slot, state) {
  const data = { ...state, lastSavedAt: Date.now() };
  localStorage.setItem(saveKey(username, slot), JSON.stringify(data));
}

export function deleteSave(username, slot) {
  localStorage.removeItem(saveKey(username, slot));
}
