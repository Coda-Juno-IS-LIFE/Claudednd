import { useMemo, useState } from 'react';
import { useGame } from '../../state/GameContext';
import { ProgressDots } from '../../components/ProgressDots';
import { TutorialTip } from '../../components/TutorialTip';
import { ABILITY_FULL_NAMES, ABILITY_NAMES, type AbilityName, type AbilityScores } from '../../types';
import { STANDARD_ARRAY, abilityModifier, formatModifier } from '../../engine/rules';
import { getRace } from '../../data/races';

const RECOMMENDED: Record<string, AbilityScores> = {
  fighter: { STR: 15, DEX: 13, CON: 14, INT: 10, WIS: 12, CHA: 8 },
  rogue: { STR: 10, DEX: 15, CON: 14, INT: 12, WIS: 13, CHA: 8 },
  wizard: { STR: 8, DEX: 13, CON: 14, INT: 15, WIS: 12, CHA: 10 },
  cleric: { STR: 13, DEX: 12, CON: 14, INT: 10, WIS: 15, CHA: 8 },
};

export function AbilityScoresStep() {
  const { state, dispatch } = useGame();
  const [assignments, setAssignments] = useState<Partial<Record<AbilityName, number>>>(
    (state.draftAbilityScores as Partial<Record<AbilityName, number>>) ?? {},
  );
  const [selectedValue, setSelectedValue] = useState<number | null>(null);

  const usedValues = Object.values(assignments);
  const pool = useMemo(() => {
    const remaining = [...STANDARD_ARRAY];
    for (const v of usedValues) {
      const idx = remaining.indexOf(v as number);
      if (idx >= 0) remaining.splice(idx, 1);
    }
    return remaining;
  }, [usedValues]);

  const isComplete = ABILITY_NAMES.every((a) => assignments[a] !== undefined);
  const race = state.draftRaceId ? getRace(state.draftRaceId) : null;

  function placeValue(ability: AbilityName, value: number) {
    setAssignments((prev) => ({ ...prev, [ability]: value }));
    setSelectedValue(null);
  }

  function clearSlot(ability: AbilityName) {
    setAssignments((prev) => {
      const next = { ...prev };
      delete next[ability];
      return next;
    });
  }

  function useRecommended() {
    if (state.draftClassId && RECOMMENDED[state.draftClassId]) {
      setAssignments({ ...RECOMMENDED[state.draftClassId] });
    }
  }

  function onSlotTap(ability: AbilityName) {
    if (assignments[ability] !== undefined) {
      clearSlot(ability);
      return;
    }
    if (selectedValue !== null) {
      placeValue(ability, selectedValue);
    }
  }

  function continueOn() {
    dispatch({ type: 'SET_DRAFT_ABILITY_SCORES', scores: assignments as AbilityScores });
    dispatch({ type: 'GO_TO', screen: 'create-skills' });
  }

  return (
    <div className="screen">
      <ProgressDots total={6} current={3} />
      <h2>Assign ability scores</h2>
      <TutorialTip label="What are ability scores?">
        <p>
          Six numbers — Strength, Dexterity, Constitution, Intelligence, Wisdom, Charisma — that describe your
          character's raw capabilities. Every score gives you a <strong>modifier</strong> (roughly (score − 10) ÷ 2,
          rounded down) that gets added to almost every roll: attacks, skill checks, saving throws. This game uses
          the <strong>standard array</strong>: a fixed set of six numbers (15, 14, 13, 12, 10, 8) that you assign to
          whichever abilities you want. It's the simplest, most balanced way to build a character.
        </p>
      </TutorialTip>

      {state.draftClassId && (
        <button className="btn btn-ghost" style={{ marginBottom: 12 }} onClick={useRecommended}>
          ✨ Use recommended array for my class
        </button>
      )}

      <p className="muted">Tap a number below, then tap an ability to place it. Tap a filled ability to take it back.</p>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16, justifyContent: 'center' }}>
        {pool.map((v, i) => (
          <button
            key={`${v}-${i}`}
            className="die-face"
            style={{
              minWidth: 40,
              height: 40,
              fontSize: '1.1rem',
              cursor: 'pointer',
              background: selectedValue === v ? 'var(--accent)' : undefined,
              color: selectedValue === v ? 'var(--accent-contrast)' : undefined,
            }}
            onClick={() => setSelectedValue(v)}
          >
            {v}
          </button>
        ))}
        {pool.length === 0 && <span className="muted">All values placed.</span>}
      </div>

      <div className="stack">
        {ABILITY_NAMES.map((ability) => {
          const base = assignments[ability];
          const racialBonus = race?.abilityBonuses[ability] ?? 0;
          const final = base !== undefined ? base + racialBonus : undefined;
          return (
            <button
              key={ability}
              className="card"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                cursor: 'pointer',
                textAlign: 'left',
              }}
              onClick={() => onSlotTap(ability)}
            >
              <span>
                <strong>{ABILITY_FULL_NAMES[ability]}</strong>
                {racialBonus !== 0 && <span className="muted"> (+{racialBonus} racial)</span>}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {base !== undefined ? (
                  <>
                    <span className="tag">{base}</span>
                    {racialBonus !== 0 && <span>→ {final}</span>}
                    {final !== undefined && <span className="muted">({formatModifier(abilityModifier(final))})</span>}
                  </>
                ) : (
                  <span className="muted">tap to fill</span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      <div className="spacer" />
      <div className="btn-row">
        <button className="btn btn-ghost" onClick={() => dispatch({ type: 'GO_TO', screen: 'create-background' })}>
          Back
        </button>
        <button className="btn btn-primary" disabled={!isComplete} onClick={continueOn}>
          Continue
        </button>
      </div>
    </div>
  );
}
