import { useGame } from '../state/GameContext';
import { getClass } from '../data/classes';
import { getRace } from '../data/races';
import { getBackground } from '../data/backgrounds';
import { ABILITY_NAMES, SKILL_ABILITIES, type SkillName } from '../types';
import {
  abilityModifier,
  finalAbilityScores,
  formatModifier,
  isSkillProficient,
  proficiencyBonus,
  savingThrowModifier,
  skillModifier,
} from '../engine/rules';

const ALL_SKILLS = Object.keys(SKILL_ABILITIES) as SkillName[];

export function CharacterSheetScreen() {
  const { state, dispatch } = useGame();
  const character = state.character!;
  const race = getRace(character.raceId);
  const dndClass = getClass(character.classId);
  const background = getBackground(character.backgroundId);
  const scores = finalAbilityScores(character);
  const prof = proficiencyBonus(character.level);

  return (
    <div className="screen">
      <div className="top-bar">
        <h1>{character.name}</h1>
        <button
          className="btn btn-ghost"
          style={{ width: 'auto', minHeight: 36, padding: '6px 12px' }}
          onClick={() => dispatch({ type: 'GO_TO', screen: 'adventure' })}
        >
          Back
        </button>
      </div>
      <p className="muted" style={{ marginTop: -8 }}>
        Level {character.level} {race.name} {dndClass.name} · {background.name}
      </p>

      <div className="card">
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 12 }}>
          <span className="tag">HP {character.currentHP}/{character.maxHP}</span>
          <span className="tag">AC {character.armorClass}</span>
          <span className="tag">Proficiency {formatModifier(prof)}</span>
        </div>
        <div className="stat-grid">
          {ABILITY_NAMES.map((a) => (
            <div className="stat-box" key={a}>
              <div className="label">{a}</div>
              <div className="value">{scores[a]}</div>
              <div className="mod">{formatModifier(abilityModifier(scores[a]))}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>Saving Throws</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {ABILITY_NAMES.map((a) => (
            <span className="tag" key={a}>
              {a} {formatModifier(savingThrowModifier(character, a))}
            </span>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>Skills</h3>
        <div className="stack">
          {ALL_SKILLS.map((skill) => {
            const proficient = isSkillProficient(character, skill);
            return (
              <div key={skill} style={{ display: 'flex', justifyContent: 'space-between', opacity: proficient ? 1 : 0.55 }}>
                <span>
                  {proficient ? '● ' : '○ '}
                  {skill} <span className="muted">({SKILL_ABILITIES[skill]})</span>
                </span>
                <strong>{formatModifier(skillModifier(character, skill))}</strong>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card">
        <h3>Attack</h3>
        <p style={{ marginBottom: 4 }}>
          <strong>{dndClass.attack.name}</strong>
        </p>
        <p className="muted">{dndClass.attack.description}</p>
      </div>

      <div className="card">
        <h3>Race: {race.name}</h3>
        {race.traits.map((t) => (
          <p key={t.name} style={{ marginBottom: 6 }}>
            <strong>{t.name}.</strong> {t.description}
          </p>
        ))}
      </div>

      <div className="card">
        <h3>Class: {dndClass.name}</h3>
        {dndClass.features.map((f) => (
          <p key={f.name} style={{ marginBottom: 6 }}>
            <strong>{f.name}.</strong> {f.description}
          </p>
        ))}
      </div>

      <div className="card">
        <h3>Background: {background.name}</h3>
        <p>
          <strong>{background.feature.name}.</strong> {background.feature.description}
        </p>
      </div>

      <div className="card">
        <h3>Equipment</h3>
        <p className="muted">{[...new Set([...dndClass.startingEquipment, ...background.equipment])].join(', ')}</p>
      </div>
    </div>
  );
}
