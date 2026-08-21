import type { AbilityName, AbilityScores, Character, DnDClass, Race, SkillName } from '../types';
import { SKILL_ABILITIES } from '../types';
import { getClass } from '../data/classes';
import { getRace } from '../data/races';

/** The SRD ability modifier formula: floor((score - 10) / 2). */
export function abilityModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

export function formatModifier(mod: number): string {
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

/** SRD proficiency bonus by character level (a level 1 character is always +2). */
export function proficiencyBonus(level: number): number {
  return 2 + Math.floor((level - 1) / 4);
}

export function applyRacialBonuses(base: AbilityScores, race: Race): AbilityScores {
  const result = { ...base };
  for (const [ability, bonus] of Object.entries(race.abilityBonuses) as [AbilityName, number][]) {
    result[ability] += bonus;
  }
  return result;
}

export function finalAbilityScores(character: Character): AbilityScores {
  const race = getRace(character.raceId);
  return applyRacialBonuses(character.baseAbilityScores, race);
}

/** Max HP at level 1 = hit die max + CON modifier (+1/level for Dwarven Toughness). */
export function computeMaxHP(character: Character): number {
  const dndClass = getClass(character.classId);
  const scores = finalAbilityScores(character);
  const conMod = abilityModifier(scores.CON);
  let hp = dndClass.hitDie + conMod;
  if (character.raceId === 'hill-dwarf') hp += 1; // Dwarven Toughness
  return Math.max(hp, 1);
}

export function computeArmorClass(character: Character): number {
  const dndClass = getClass(character.classId);
  const scores = finalAbilityScores(character);
  const dexMod = abilityModifier(scores.DEX);
  let ac = dndClass.baseAC;
  if (dndClass.armorCategory === 'light' || dndClass.armorCategory === 'none') {
    ac += dexMod;
  } else if (dndClass.armorCategory === 'medium') {
    ac += Math.min(dexMod, 2);
  }
  // heavy armor: no Dex bonus
  if (dndClass.addShield) ac += 2;
  return ac;
}

export function isSkillProficient(character: Character, skill: SkillName): boolean {
  return character.skillProficiencies.includes(skill);
}

export function skillModifier(character: Character, skill: SkillName): number {
  const scores = finalAbilityScores(character);
  const ability = SKILL_ABILITIES[skill];
  const mod = abilityModifier(scores[ability]);
  const prof = isSkillProficient(character, skill) ? proficiencyBonus(character.level) : 0;
  return mod + prof;
}

export function savingThrowModifier(character: Character, ability: AbilityName): number {
  const dndClass = getClass(character.classId);
  const scores = finalAbilityScores(character);
  const mod = abilityModifier(scores[ability]);
  const prof = dndClass.savingThrowProficiencies.includes(ability) ? proficiencyBonus(character.level) : 0;
  return mod + prof;
}

export function attackToHitBonus(character: Character): number {
  const dndClass = getClass(character.classId);
  const scores = finalAbilityScores(character);
  const abilityMod = abilityModifier(scores[dndClass.attack.ability]);
  return abilityMod + proficiencyBonus(character.level);
}

export function spellSaveDC(character: Character): number {
  const dndClass = getClass(character.classId);
  const scores = finalAbilityScores(character);
  const abilityMod = abilityModifier(scores[dndClass.attack.ability]);
  return 8 + proficiencyBonus(character.level) + abilityMod;
}

export function buildCharacter(params: {
  name: string;
  raceId: string;
  classId: string;
  backgroundId: string;
  baseAbilityScores: AbilityScores;
  skillProficiencies: SkillName[];
}): Character {
  const partial: Character = {
    name: params.name,
    raceId: params.raceId,
    classId: params.classId,
    backgroundId: params.backgroundId,
    baseAbilityScores: params.baseAbilityScores,
    skillProficiencies: params.skillProficiencies,
    maxHP: 0,
    currentHP: 0,
    armorClass: 0,
    level: 1,
  };
  partial.maxHP = computeMaxHP(partial);
  partial.currentHP = partial.maxHP;
  partial.armorClass = computeArmorClass(partial);
  return partial;
}

export const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];

export function classById(id: string): DnDClass {
  return getClass(id);
}
