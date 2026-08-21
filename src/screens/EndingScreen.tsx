import { useGame } from '../state/GameContext';

export function EndingScreen() {
  const { state, dispatch } = useGame();
  const won = state.questNodeId === 'victory';

  function playAgain() {
    dispatch({ type: 'SET_QUEST_NODE', nodeId: 'start' });
    dispatch({ type: 'SET_AMBUSH_ADVANTAGE', value: false });
    dispatch({ type: 'SET_MONSTER_HP', hp: 0 });
    dispatch({ type: 'CLEAR_LOG' });
    if (state.character) {
      dispatch({ type: 'UPDATE_CHARACTER', character: { ...state.character, currentHP: state.character.maxHP } });
    }
    dispatch({ type: 'GO_TO', screen: 'adventure' });
  }

  return (
    <div className="screen">
      <h1 className="center-text" style={{ marginTop: '15vh' }}>
        {won ? 'Victory!' : 'The Tale Continues…'}
      </h1>
      <p className="center-text muted">
        {won ? 'You completed The Miller\'s Plea and saved Aldenmoor\'s harvest.' : 'Every hero stumbles once — the story goes on.'}
      </p>

      <div className="card" style={{ marginTop: 24 }}>
        <h3>What you learned</h3>
        <p className="muted">
          Ability scores &amp; modifiers · standard array character building · skill checks against a DC · advantage
          &amp; disadvantage · initiative · attack rolls vs. Armor Class · saving throws vs. a spell save DC · reading
          a character sheet.
        </p>
        <p className="muted" style={{ marginBottom: 0 }}>
          That covers the core loop you'll use at almost every real D&amp;D table. Nice work.
        </p>
      </div>

      <div className="spacer" />
      <div className="stack">
        <button className="btn btn-primary" onClick={playAgain}>
          Replay This Adventure
        </button>
        <button className="btn btn-ghost" onClick={() => dispatch({ type: 'GO_TO', screen: 'sheet' })}>
          View Character Sheet
        </button>
        <button className="btn btn-ghost" onClick={() => dispatch({ type: 'GO_TO', screen: 'home' })}>
          Back to Home
        </button>
      </div>
    </div>
  );
}
