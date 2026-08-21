import { useEffect, useState } from 'react';
import { useGame } from '../../state/GameContext';
import { getClass } from '../../data/classes';
import { getBackground } from '../../data/backgrounds';
import { ProgressDots } from '../../components/ProgressDots';
import { TutorialTip } from '../../components/TutorialTip';
import type { SkillName } from '../../types';

export function SkillsStep() {
  const { state, dispatch } = useGame();
  const dndClass = getClass(state.draftClassId!);
  const background = getBackground(state.draftBackgroundId!);
  const backgroundSkills = new Set(background.skillProficiencies);
  const choicesAvailable = dndClass.skillChoices.filter((s) => !backgroundSkills.has(s));

  const [selected, setSelected] = useState<SkillName[]>(state.draftSkills.filter((s) => choicesAvailable.includes(s)));

  useEffect(() => {
    // reset if class/background changed since last visit
    setSelected((prev) => prev.filter((s) => choicesAvailable.includes(s)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.draftClassId, state.draftBackgroundId]);

  function toggle(skill: SkillName) {
    setSelected((prev) => {
      if (prev.includes(skill)) return prev.filter((s) => s !== skill);
      if (prev.length >= dndClass.numSkillChoices) return prev;
      return [...prev, skill];
    });
  }

  function continueOn() {
    dispatch({ type: 'SET_DRAFT_SKILLS', skills: [...selected, ...background.skillProficiencies] });
    dispatch({ type: 'GO_TO', screen: 'create-review' });
  }

  const isComplete = selected.length === dndClass.numSkillChoices;

  return (
    <div className="screen">
      <ProgressDots total={6} current={4} />
      <h2>Choose skill proficiencies</h2>
      <TutorialTip label="What is a skill proficiency?">
        <p>
          Skills are specific things you might roll for — sneaking (Stealth), noticing things (Perception), talking
          your way past a guard (Persuasion). Being <strong>proficient</strong> in a skill adds your proficiency
          bonus on top of the relevant ability modifier whenever you roll it, making you noticeably better at that
          specific thing.
        </p>
      </TutorialTip>

      <p className="muted">
        Your <strong>{background.name}</strong> background already grants you{' '}
        <strong>{background.skillProficiencies.join(' and ')}</strong>. As a <strong>{dndClass.name}</strong>, choose{' '}
        {dndClass.numSkillChoices} more ({selected.length}/{dndClass.numSkillChoices} chosen):
      </p>

      <div className="stack">
        {choicesAvailable.map((skill) => {
          const checked = selected.includes(skill);
          const disabled = !checked && selected.length >= dndClass.numSkillChoices;
          return (
            <label key={skill} className={`checkbox-row ${disabled ? 'disabled' : ''}`}>
              <input type="checkbox" checked={checked} disabled={disabled} onChange={() => toggle(skill)} />
              <span>{skill}</span>
            </label>
          );
        })}
      </div>

      <div className="spacer" />
      <div className="btn-row">
        <button className="btn btn-ghost" onClick={() => dispatch({ type: 'GO_TO', screen: 'create-abilities' })}>
          Back
        </button>
        <button className="btn btn-primary" disabled={!isComplete} onClick={continueOn}>
          Continue
        </button>
      </div>
    </div>
  );
}
