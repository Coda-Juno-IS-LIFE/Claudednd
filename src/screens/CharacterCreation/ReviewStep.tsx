import { useGame } from '../../state/GameContext';
import { getClass } from '../../data/classes';
import { getRace } from '../../data/races';
import { getBackground } from '../../data/backgrounds';
import { ProgressDots } from '../../components/ProgressDots';
import { buildCharacter, computeArmorClass, computeMaxHP, finalAbilityScores, formatModifier, abilityModifier } from '../../engine/rules';
import { ABILITY_NAMES } from '../../types';

export function ReviewStep() {
  const { state, dispatch } = useGame();
  const race = getRace(state.draftRaceId!);
  const dndClass = getClass(state.draftClassId!);
  const background = getBackground(state.draftBackgroundId!);

  const previewCharacter =
    state.draftAbilityScores &&
    buildCharacter({
      name: state.draftName || 'Adventurer',
      raceId: race.id,
      classId: dndClass.id,
      backgroundId: background.id,
      baseAbilityScores: state.draftAbilityScores,
      skillProficiencies: state.draftSkills,
    });

  const scores = previewCharacter ? finalAbilityScores(previewCharacter) : null;

  function begin() {
    if (!state.draftAbilityScores) return;
    const character = buildCharacter({
      name: state.draftName.trim() || 'Adventurer',
      raceId: race.id,
      classId: dndClass.id,
      backgroundId: background.id,
      baseAbilityScores: state.draftAbilityScores,
      skillProficiencies: state.draftSkills,
    });
    dispatch({ type: 'SET_CHARACTER', character });
    dispatch({ type: 'SET_QUEST_NODE', nodeId: 'start' });
    dispatch({ type: 'GO_TO', screen: 'adventure' });
  }

  return (
    <div className="screen">
      <ProgressDots total={6} current={5} />
      <h2>Name your character</h2>

      <input
        className="card"
        style={{ width: '100%', fontSize: '1.1rem', fontFamily: 'Cinzel, serif', color: 'var(--text)' }}
        placeholder="Enter a name…"
        value={state.draftName}
        maxLength={40}
        onChange={(e) => dispatch({ type: 'SET_DRAFT_NAME', name: e.target.value })}
      />

      <h3 style={{ marginTop: 8 }}>Summary</h3>
      <div className="card">
        <p style={{ marginBottom: 4 }}>
          <strong>{state.draftName || 'Adventurer'}</strong> — {race.name} {dndClass.name} ({background.name})
        </p>
        {scores && (
          <div className="stat-grid" style={{ marginTop: 10 }}>
            {ABILITY_NAMES.map((a) => (
              <div className="stat-box" key={a}>
                <div className="label">{a}</div>
                <div className="value">{scores[a]}</div>
                <div className="mod">{formatModifier(abilityModifier(scores[a]))}</div>
              </div>
            ))}
          </div>
        )}
        {previewCharacter && (
          <div style={{ display: 'flex', gap: 10, marginTop: 12, justifyContent: 'center' }}>
            <span className="tag">HP {computeMaxHP(previewCharacter)}</span>
            <span className="tag">AC {computeArmorClass(previewCharacter)}</span>
          </div>
        )}
        <p className="muted" style={{ marginTop: 10, marginBottom: 0 }}>
          Skills: {state.draftSkills.join(', ')}
        </p>
      </div>

      <div className="spacer" />
      <div className="btn-row">
        <button className="btn btn-ghost" onClick={() => dispatch({ type: 'GO_TO', screen: 'create-skills' })}>
          Back
        </button>
        <button className="btn btn-primary" onClick={begin}>
          Begin Adventure
        </button>
      </div>
    </div>
  );
}
