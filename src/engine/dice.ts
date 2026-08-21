// Dice-rolling primitives. Everything funnels through rollDie so the whole
// game uses one source of randomness and one place to explain "what a d20 is".

export function rollDie(sides: number): number {
  return Math.floor(Math.random() * sides) + 1;
}

export function rollD20(): number {
  return rollDie(20);
}

export interface D20Roll {
  /** The die/dice actually rolled, in order rolled. */
  rolls: number[];
  /** The die result used (after advantage/disadvantage is applied). */
  result: number;
  mode: 'normal' | 'advantage' | 'disadvantage';
}

/** Roll a d20, optionally with advantage (roll twice, keep higher) or disadvantage (keep lower). */
export function rollD20WithMode(mode: 'normal' | 'advantage' | 'disadvantage' = 'normal'): D20Roll {
  if (mode === 'normal') {
    const r = rollD20();
    return { rolls: [r], result: r, mode };
  }
  const a = rollD20();
  const b = rollD20();
  const result = mode === 'advantage' ? Math.max(a, b) : Math.min(a, b);
  return { rolls: [a, b], result, mode };
}

export interface DamageRoll {
  notation: string;
  rolls: number[];
  bonus: number;
  total: number;
}

/** Parse and roll simple dice notation like "1d8" or "2d6". Does not include the flat bonus. */
export function rollDamageDice(notation: string, bonus = 0): DamageRoll {
  const match = /^(\d+)d(\d+)$/.exec(notation.trim());
  if (!match) throw new Error(`Bad dice notation: ${notation}`);
  const count = Number(match[1]);
  const sides = Number(match[2]);
  const rolls: number[] = [];
  for (let i = 0; i < count; i++) rolls.push(rollDie(sides));
  const total = rolls.reduce((a, b) => a + b, 0) + bonus;
  return { notation, rolls, bonus, total: Math.max(total, 0) };
}
