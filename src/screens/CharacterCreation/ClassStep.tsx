import { useGame } from '../../state/GameContext';
import { CLASSES } from '../../data/classes';
import { ProgressDots } from '../../components/ProgressDots';
import { TutorialTip } from '../../components/TutorialTip';

export function ClassStep() {
  const { state, dispatch } = useGame();

  function choose(id: string) {
    dispatch({ type: 'SET_DRAFT_CLASS', classId: id });
  }

  return (
    <div className="screen">
      <ProgressDots total={6} current={1} />
      <h2>Choose your class</h2>
      <TutorialTip label="What is a 'class'?">
        <p>
          Your class is your character's profession and the biggest driver of how they play: what you're good at,
          how you fight, and whether you cast spells. Each class below plays differently, so pick whichever sounds
          most fun — you can't get this wrong.
        </p>
      </TutorialTip>
      <div className="stack">
        {CLASSES.map((c) => (
          <button
            key={c.id}
            className={`card ${state.draftClassId === c.id ? 'selected' : ''}`}
            style={{ textAlign: 'left', width: '100%', cursor: 'pointer' }}
            onClick={() => choose(c.id)}
          >
            <h3 style={{ marginBottom: 4 }}>{c.name}</h3>
            <p className="muted" style={{ marginBottom: 8 }}>
              {c.blurb}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              <span className="tag">Hit die d{c.hitDie}</span>
              <span className="tag">{c.armorName}</span>
              <span className="tag">Attack: {c.attack.name}</span>
            </div>
          </button>
        ))}
      </div>
      <div className="spacer" />
      <div className="btn-row">
        <button className="btn btn-ghost" onClick={() => dispatch({ type: 'GO_TO', screen: 'create-race' })}>
          Back
        </button>
        <button className="btn btn-primary" disabled={!state.draftClassId} onClick={() => dispatch({ type: 'GO_TO', screen: 'create-background' })}>
          Continue
        </button>
      </div>
    </div>
  );
}
