import type { Character, Monster } from '../types';
import { rollD20WithMode, rollDamageDice, type D20Roll } from './dice';
import { abilityModifier, attackToHitBonus, finalAbilityScores, spellSaveDC } from './rules';
import { getClass } from '../data/classes';

export interface AttackResolution {
  kind: 'attackRoll' | 'savingThrow';
  roll: D20Roll;
  bonusOrDC: number; // to-hit bonus for attackRoll, or the save DC for savingThrow
  hit: boolean; // true if attack hit, or if the target FAILED its save (i.e. took damage)
  isCrit: boolean;
  damageRolls?: number[];
  damageBonus: number;
  damageTotal: number;
  damageType: string;
  extraDamageLabel?: string; // e.g. "Sneak Attack"
  extraDamageTotal?: number;
}

/** Resolve the player's attack (weapon, spell attack, or spell-save cantrip) against the goblin. */
export function resolvePlayerAttack(character: Character, monster: Monster, mode: 'normal' | 'advantage' | 'disadvantage'): AttackResolution {
  const dndClass = getClass(character.classId);
  const attack = dndClass.attack;

  if (attack.kind === 'spellSave') {
    const dc = spellSaveDC(character);
    const monsterSaveMod = attack.saveAbility ? Math.floor((monster.abilityScores[attack.saveAbility] - 10) / 2) : 0;
    const roll = rollD20WithMode('normal'); // the target rolls the save; advantage/disadvantage on saves isn't used in this tutorial
    const total = roll.result + monsterSaveMod;
    const failedSave = total < dc; // failing the save means the monster takes damage
    const dmg = failedSave ? rollDamageDice(attack.damageDice, 0) : { rolls: [], bonus: 0, total: 0, notation: attack.damageDice };
    return {
      kind: 'savingThrow',
      roll,
      bonusOrDC: dc,
      hit: failedSave,
      isCrit: false,
      damageRolls: dmg.rolls,
      damageBonus: 0,
      damageTotal: dmg.total,
      damageType: attack.damageType,
    };
  }

  const toHitBonus = attackToHitBonus(character);
  const roll = rollD20WithMode(mode);
  const isCrit = roll.result === 20;
  const isFumble = roll.result === 1;
  const total = roll.result + toHitBonus;
  const hit = !isFumble && (isCrit || total >= monster.armorClass);

  const scores = finalAbilityScores(character);
  const abilityMod = attack.damageBonus === 'ability' ? abilityModifier(scores[attack.ability]) : 0;

  let damageTotal = 0;
  let damageRolls: number[] = [];
  let extraDamageLabel: string | undefined;
  let extraDamageTotal: number | undefined;

  if (hit) {
    const dmg = rollDamageDice(attack.damageDice, abilityMod);
    damageRolls = dmg.rolls;
    damageTotal = dmg.total;
    if (isCrit) {
      // crits double the dice (not the modifier): roll the dice again and add.
      const critDmg = rollDamageDice(attack.damageDice, 0);
      damageRolls = [...damageRolls, ...critDmg.rolls];
      damageTotal += critDmg.total;
    }
    if (character.classId === 'rogue' && mode === 'advantage') {
      const sneak = rollDamageDice('1d6', 0);
      extraDamageLabel = 'Sneak Attack';
      extraDamageTotal = sneak.total;
      damageTotal += sneak.total;
    }
  }

  return {
    kind: 'attackRoll',
    roll,
    bonusOrDC: toHitBonus,
    hit,
    isCrit,
    damageRolls,
    damageBonus: abilityMod,
    damageTotal,
    damageType: attack.damageType,
    extraDamageLabel,
    extraDamageTotal,
  };
}

/** Resolve the goblin's scimitar attack against the player. */
export function resolveMonsterAttack(monster: Monster, character: Character): AttackResolution {
  const roll = rollD20WithMode('normal');
  const isCrit = roll.result === 20;
  const isFumble = roll.result === 1;
  const total = roll.result + monster.attackToHit;
  const hit = !isFumble && (isCrit || total >= character.armorClass);

  let damageTotal = 0;
  let damageRolls: number[] = [];
  if (hit) {
    const dmg = rollDamageDice(monster.damageDice, monster.damageBonus);
    damageRolls = dmg.rolls;
    damageTotal = dmg.total;
    if (isCrit) {
      const critDmg = rollDamageDice(monster.damageDice, 0);
      damageRolls = [...damageRolls, ...critDmg.rolls];
      damageTotal += critDmg.total;
    }
  }

  return {
    kind: 'attackRoll',
    roll,
    bonusOrDC: monster.attackToHit,
    hit,
    isCrit,
    damageRolls,
    damageBonus: monster.damageBonus,
    damageTotal,
    damageType: monster.damageType,
  };
}
