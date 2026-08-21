// Core data types for the game, modeled on the D&D 5th Edition System
// Reference Document (SRD 5.1), which Wizards of the Coast makes freely
// available under the Creative Commons Attribution 4.0 International
// License. See README.md for full attribution.

export type AbilityName = 'STR' | 'DEX' | 'CON' | 'INT' | 'WIS' | 'CHA';

export const ABILITY_NAMES: AbilityName[] = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];

export const ABILITY_FULL_NAMES: Record<AbilityName, string> = {
  STR: 'Strength',
  DEX: 'Dexterity',
  CON: 'Constitution',
  INT: 'Intelligence',
  WIS: 'Wisdom',
  CHA: 'Charisma',
};

export type SkillName =
  | 'Acrobatics'
  | 'Animal Handling'
  | 'Arcana'
  | 'Athletics'
  | 'Deception'
  | 'History'
  | 'Insight'
  | 'Intimidation'
  | 'Investigation'
  | 'Medicine'
  | 'Nature'
  | 'Perception'
  | 'Performance'
  | 'Persuasion'
  | 'Religion'
  | 'Sleight of Hand'
  | 'Stealth'
  | 'Survival';

export const SKILL_ABILITIES: Record<SkillName, AbilityName> = {
  Acrobatics: 'DEX',
  'Animal Handling': 'WIS',
  Arcana: 'INT',
  Athletics: 'STR',
  Deception: 'CHA',
  History: 'INT',
  Insight: 'WIS',
  Intimidation: 'CHA',
  Investigation: 'INT',
  Medicine: 'WIS',
  Nature: 'INT',
  Perception: 'WIS',
  Performance: 'CHA',
  Persuasion: 'CHA',
  Religion: 'INT',
  'Sleight of Hand': 'DEX',
  Stealth: 'DEX',
  Survival: 'WIS',
};

export type AbilityScores = Record<AbilityName, number>;

export interface RacialTrait {
  name: string;
  description: string;
}

export interface Race {
  id: string;
  name: string;
  abilityBonuses: Partial<AbilityScores>;
  speed: number;
  size: 'Small' | 'Medium';
  traits: RacialTrait[];
  skillProficiencies?: SkillName[];
  languages: string[];
  blurb: string;
}

export interface ClassFeature {
  name: string;
  description: string;
}

export type WeaponAttackKind = 'melee' | 'ranged' | 'spellAttack' | 'spellSave';

export interface AttackOption {
  name: string;
  kind: WeaponAttackKind;
  ability: AbilityName; // ability used to hit / set save DC
  damageDice: string; // e.g. "1d8"
  damageBonus: 'ability' | 'none';
  damageType: string;
  description: string;
  saveAbility?: AbilityName; // for spellSave kind: ability the TARGET saves with
}

export type ArmorCategory = 'none' | 'light' | 'medium' | 'heavy';

export interface DnDClass {
  id: string;
  name: string;
  hitDie: number; // e.g. 10 for d10
  savingThrowProficiencies: AbilityName[];
  skillChoices: SkillName[];
  numSkillChoices: number;
  primaryAbility: AbilityName;
  features: ClassFeature[];
  startingEquipment: string[];
  armorName: string;
  armorCategory: ArmorCategory;
  baseAC: number; // base AC granted by the starting armor (10 if unarmored)
  addShield: boolean; // +2 AC
  attack: AttackOption;
  blurb: string;
}

export interface Background {
  id: string;
  name: string;
  skillProficiencies: SkillName[];
  equipment: string[];
  feature: ClassFeature;
  blurb: string;
}

export interface Character {
  name: string;
  raceId: string;
  classId: string;
  backgroundId: string;
  baseAbilityScores: AbilityScores; // before racial bonuses, as assigned from the standard array
  skillProficiencies: SkillName[];
  maxHP: number;
  currentHP: number;
  armorClass: number;
  level: number;
}

export interface Monster {
  id: string;
  name: string;
  armorClass: number;
  maxHP: number;
  speed: number;
  abilityScores: AbilityScores;
  attackName: string;
  attackToHit: number;
  damageDice: string;
  damageBonus: number;
  damageType: string;
  challengeRating: string;
  passivePerception: number;
  blurb: string;
}
