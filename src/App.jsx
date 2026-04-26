import { useState } from 'react';
import { getSession } from './utils/storage.js';
import AuthScreen     from './screens/AuthScreen.jsx';
import MainMenuScreen from './screens/MainMenuScreen.jsx';
import GameScreen     from './screens/GameScreen.jsx';

function App() {
  const session = getSession();

  const [screen,   setScreen]   = useState(session ? 'menu' : 'auth');
  const [username, setUsername] = useState(session?.username ?? '');
  const [save,     setSave]     = useState(null);

  if (screen === 'auth') {
    return (
      <AuthScreen
        onLogin={(u) => {
          setUsername(u);
          setScreen('menu');
        }}
      />
    );
  }

  if (screen === 'game' && save) {
    return (
      <GameScreen
        initialState={save}
        username={username}
        onReturnMenu={() => {
          setSave(null);
          setScreen('menu');
        }}
      />
    );
  }

  return (
    <MainMenuScreen
      username={username}
      onPlay={(s) => {
        setSave(s);
        setScreen('game');
      }}
      onLogout={() => {
        setUsername('');
        setScreen('auth');
      }}
    />
  );
}

export default App;
