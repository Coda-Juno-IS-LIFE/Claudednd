import { useGame } from '../../state/GameContext';
import { RACES } from '../../data/races';
import { ProgressDots } from '../../components/ProgressDots';
import { TutorialTip } from '../../components/TutorialTip';
import { ABILITY_FULL_NAMES } from '../../types';

export function RaceStep() {
  const { state, dispatch } = useGame();

  function choose(id: string) {
    dispatch({ type: 'SET_DRAFT_RACE', raceId: id });
  }

  return (
    <div className="screen">
      <ProgressDots total={6} current={0} />
      <h2>Choose your race</h2>
      <TutorialTip label="What is a 'race' in D&D?">
        <p>
          Your race represents your character's ancestry — it gives small bonuses to your <strong>ability scores</strong>{' '}
          (the six core stats that drive almost everything you roll) and grants a few special traits. It's mostly
          flavor and a light mechanical nudge, not a hard limit on what you can play.
        </p>
      </TutorialTip>
      <div className="stack">
        {RACES.map((race) => (
          <button
            key={race.id}
            className={`card ${state.draftRaceId === race.id ? 'selected' : ''}`}
            style={{ textAlign: 'left', width: '100%', cursor: 'pointer' }}
            onClick={() => choose(race.id)}
          >
            <h3 style={{ marginBottom: 4 }}>{race.name}</h3>
            <p className="muted" style={{ marginBottom: 8 }}>
              {race.blurb}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
              {Object.entries(race.abilityBonuses).map(([ability, bonus]) => (
                <span className="tag" key={ability}>
                  {ABILITY_FULL_NAMES[ability as keyof typeof ABILITY_FULL_NAMES]} +{bonus}
                </span>
              ))}
              <span className="tag">Speed {race.speed} ft</span>
            </div>
            <p className="muted" style={{ marginBottom: 0, fontSize: '0.85rem' }}>
              {race.traits.map((t) => t.name).join(' · ')}
            </p>
          </button>
        ))}
      </div>
      <div className="spacer" />
      <button className="btn btn-primary" disabled={!state.draftRaceId} onClick={() => dispatch({ type: 'GO_TO', screen: 'create-class' })}>
        Continue
      </button>
    </div>
  );
}
