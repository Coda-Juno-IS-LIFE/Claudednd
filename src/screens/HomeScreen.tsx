import { useGame } from '../state/GameContext';

export function HomeScreen() {
  const { state, dispatch } = useGame();
  const hasSave = !!state.character;

  function newGame() {
    dispatch({ type: 'NEW_GAME' });
    dispatch({ type: 'GO_TO', screen: 'create-race' });
  }

  function resume() {
    dispatch({ type: 'GO_TO', screen: state.screen === 'home' ? 'adventure' : state.screen });
  }

  return (
    <div className="screen">
      <h1 className="home-title">⚔️ Tavern Tutor</h1>
      <p className="home-subtitle">Learn Dungeons &amp; Dragons, one dice roll at a time.</p>

      <div className="spacer" />

      <div className="stack">
        {hasSave && (
          <button className="btn btn-primary" onClick={resume}>
            Continue as {state.character!.name}
          </button>
        )}
        <button className={hasSave ? 'btn btn-ghost' : 'btn btn-primary'} onClick={newGame}>
          {hasSave ? 'Start a New Character' : 'Create Your Character'}
        </button>
        <button className="btn btn-ghost" onClick={() => dispatch({ type: 'GO_TO', screen: 'how-to-play' })}>
          How to Play
        </button>
      </div>

      <p className="muted center-text" style={{ marginTop: 24 }}>
        Built on the official D&amp;D 5th Edition rules (SRD 5.1).
      </p>
    </div>
  );
}
