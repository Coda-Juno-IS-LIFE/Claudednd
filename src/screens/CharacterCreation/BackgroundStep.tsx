import { useGame } from '../../state/GameContext';
import { BACKGROUNDS } from '../../data/backgrounds';
import { ProgressDots } from '../../components/ProgressDots';
import { TutorialTip } from '../../components/TutorialTip';

export function BackgroundStep() {
  const { state, dispatch } = useGame();

  function choose(id: string) {
    dispatch({ type: 'SET_DRAFT_BACKGROUND', backgroundId: id });
  }

  return (
    <div className="screen">
      <ProgressDots total={6} current={2} />
      <h2>Choose your background</h2>
      <TutorialTip label="What is a 'background'?">
        <p>
          Your background is who your character was <em>before</em> becoming an adventurer. It grants two skill
          proficiencies (things you're reliably good at) and a bit of starting gear and gold, plus a roleplaying
          hook for the Dungeon Master to use in the story.
        </p>
      </TutorialTip>
      <div className="stack">
        {BACKGROUNDS.map((bg) => (
          <button
            key={bg.id}
            className={`card ${state.draftBackgroundId === bg.id ? 'selected' : ''}`}
            style={{ textAlign: 'left', width: '100%', cursor: 'pointer' }}
            onClick={() => choose(bg.id)}
          >
            <h3 style={{ marginBottom: 4 }}>{bg.name}</h3>
            <p className="muted" style={{ marginBottom: 8 }}>
              {bg.blurb}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {bg.skillProficiencies.map((s) => (
                <span className="tag" key={s}>
                  {s}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
      <div className="spacer" />
      <div className="btn-row">
        <button className="btn btn-ghost" onClick={() => dispatch({ type: 'GO_TO', screen: 'create-class' })}>
          Back
        </button>
        <button
          className="btn btn-primary"
          disabled={!state.draftBackgroundId}
          onClick={() => dispatch({ type: 'GO_TO', screen: 'create-abilities' })}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
