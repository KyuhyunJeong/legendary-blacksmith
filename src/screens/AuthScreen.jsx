import { useState } from 'react';
import { registerUser, loginUser } from '../utils/storage.js';

export default function AuthScreen({ onLogin }) {
  const [mode, setMode]         = useState('login'); // 'login' | 'register'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password.trim()) {
      setError('아이디와 비밀번호를 입력해주세요.');
      return;
    }
    setLoading(true);
    try {
      if (mode === 'register') {
        const res = await registerUser(username.trim(), password);
        if (!res.ok) { setError(res.error); return; }
        // Auto-login after register
        await loginUser(username.trim(), password);
      } else {
        const res = await loginUser(username.trim(), password);
        if (!res.ok) { setError(res.error); return; }
      }
      onLogin(username.trim());
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <h1 className="auth-title">전설의 대장장이</h1>
        <p className="auth-subtitle">Legendary Blacksmith</p>

        <div className="auth-tabs">
          <button
            type="button"
            className={mode === 'login' ? 'tab active' : 'tab'}
            onClick={() => { setMode('login'); setError(''); }}
          >
            로그인
          </button>
          <button
            type="button"
            className={mode === 'register' ? 'tab active' : 'tab'}
            onClick={() => { setMode('register'); setError(''); }}
          >
            회원가입
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <label className="auth-label">
            아이디
            <input
              className="auth-input"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
          </label>
          <label className="auth-label">
            비밀번호
            <input
              className="auth-input"
              type="password"
              autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button className="btn-primary auth-submit" type="submit" disabled={loading}>
            {loading ? '...' : mode === 'login' ? '로그인' : '가입하기'}
          </button>
        </form>
      </div>
    </div>
  );
}
