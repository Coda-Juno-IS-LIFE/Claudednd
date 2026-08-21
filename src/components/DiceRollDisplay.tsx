import type { D20Roll } from '../engine/dice';
import { formatModifier } from '../engine/rules';

interface Props {
  roll: D20Roll;
  bonus: number;
  label?: string;
}

/** Renders a d20 roll breakdown: individual dice (highlighting which was kept), the modifier, and the total. */
export function DiceRollDisplay({ roll, bonus, label }: Props) {
  const total = roll.result + bonus;
  return (
    <div className="dice-roll">
      {label && <span className="muted">{label}:</span>}
      {roll.rolls.map((r, i) => {
        const isKept = roll.rolls.length === 1 || r === roll.result;
        const isCrit = r === 20;
        const isFumble = r === 1;
        return (
          <span
            key={i}
            className={`die-face ${isCrit ? 'crit' : ''} ${isFumble ? 'fumble' : ''}`}
            style={{ opacity: isKept ? 1 : 0.4, textDecoration: isKept ? 'none' : 'line-through' }}
          >
            {r}
          </span>
        );
      })}
      <span>{formatModifier(bonus)}</span>
      <span>=</span>
      <span className="die-face" style={{ background: 'var(--accent)', color: 'var(--accent-contrast)' }}>
        {total}
      </span>
    </div>
  );
}
