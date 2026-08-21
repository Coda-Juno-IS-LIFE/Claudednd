import type { DnDClass } from '../types';

// Hit dice, saving throw proficiencies, skill lists, and starting features
// drawn from the SRD 5.1 class sections, trimmed to level 1.
export const CLASSES: DnDClass[] = [
  {
    id: 'fighter',
    name: 'Fighter',
    hitDie: 10,
    savingThrowProficiencies: ['STR', 'CON'],
    skillChoices: ['Acrobatics', 'Animal Handling', 'Athletics', 'History', 'Insight', 'Intimidation', 'Perception', 'Survival'],
    numSkillChoices: 2,
    primaryAbility: 'STR',
    armorName: 'Chain mail',
    armorCategory: 'heavy',
    baseAC: 16,
    addShield: true,
    blurb:
      'A master of martial combat, skilled with a variety of weapons and armor. Straightforward and forgiving — swing your weapon, hit things, take a hit yourself. A great class for learning the combat rules.',
    startingEquipment: ['Chain mail', 'A longsword and shield', 'Five javelins', "An explorer's pack"],
    features: [
      { name: 'Fighting Style', description: 'You adopt a particular style of fighting as your specialty (e.g. Defense: +1 AC while wearing armor).' },
      { name: 'Second Wind', description: 'On your turn, you can use a bonus action to regain hit points equal to 1d10 + your fighter level. Once per short or long rest.' },
    ],
    attack: {
      name: 'Longsword',
      kind: 'melee',
      ability: 'STR',
      damageDice: '1d8',
      damageBonus: 'ability',
      damageType: 'slashing',
      description: 'A reliable martial weapon. Roll a d20, add your Strength modifier and proficiency bonus to hit; on a hit, deal 1d8 + Strength modifier slashing damage.',
    },
  },
  {
    id: 'rogue',
    name: 'Rogue',
    hitDie: 8,
    savingThrowProficiencies: ['DEX', 'INT'],
    skillChoices: ['Acrobatics', 'Athletics', 'Deception', 'Insight', 'Intimidation', 'Investigation', 'Perception', 'Performance', 'Persuasion', 'Sleight of Hand', 'Stealth'],
    numSkillChoices: 4,
    primaryAbility: 'DEX',
    armorName: 'Leather armor',
    armorCategory: 'light',
    baseAC: 11,
    addShield: false,
    blurb:
      'Cunning, agile, and dangerous when nobody is watching. Rogues excel at skill checks and hit hard when they catch an enemy off guard — great for learning about advantage and Sneak Attack.',
    startingEquipment: ['Leather armor', 'Two daggers', 'A shortsword', 'Thieves\' tools', "A burglar's pack"],
    features: [
      { name: 'Expertise', description: 'Choose two of your skill proficiencies. Your proficiency bonus is doubled for checks with those skills.' },
      { name: 'Sneak Attack', description: 'Once per turn, you can deal an extra 1d6 damage to a creature you hit with an attack if you have advantage on the attack roll.' },
      { name: "Thieves' Cant", description: 'A secret mix of dialect, jargon, and code that lets you hide messages in seemingly-normal conversation.' },
    ],
    attack: {
      name: 'Shortsword',
      kind: 'melee',
      ability: 'DEX',
      damageDice: '1d6',
      damageBonus: 'ability',
      damageType: 'piercing',
      description: 'A finesse weapon. Roll a d20, add your Dexterity modifier and proficiency bonus to hit; on a hit, deal 1d6 + Dexterity modifier piercing damage (plus Sneak Attack dice if you have advantage).',
    },
  },
  {
    id: 'wizard',
    name: 'Wizard',
    hitDie: 6,
    savingThrowProficiencies: ['INT', 'WIS'],
    skillChoices: ['Arcana', 'History', 'Insight', 'Investigation', 'Medicine', 'Religion'],
    numSkillChoices: 2,
    primaryAbility: 'INT',
    armorName: 'Robes (unarmored)',
    armorCategory: 'none',
    baseAC: 10,
    addShield: false,
    blurb:
      'A scholarly magic-user who bends reality with careful study rather than muscle. Fragile in a straight fight, but their spells teach you the "spell attack roll" and "saving throw" side of the game.',
    startingEquipment: ['A quarterstaff', 'A component pouch', "A scholar's pack", 'A spellbook'],
    features: [
      { name: 'Spellcasting', description: 'You cast wizard spells prepared from your spellbook, using Intelligence as your spellcasting ability.' },
      { name: 'Arcane Recovery', description: 'Once per day when you finish a short rest, you can recover spell slots.' },
    ],
    attack: {
      name: 'Fire Bolt',
      kind: 'spellAttack',
      ability: 'INT',
      damageDice: '1d10',
      damageBonus: 'none',
      damageType: 'fire',
      description: 'A cantrip — an at-will spell attack. Roll a d20, add your Intelligence modifier and proficiency bonus to hit; on a hit, deal 1d10 fire damage.',
    },
  },
  {
    id: 'cleric',
    name: 'Cleric',
    hitDie: 8,
    savingThrowProficiencies: ['WIS', 'CHA'],
    skillChoices: ['History', 'Insight', 'Medicine', 'Persuasion', 'Religion'],
    numSkillChoices: 2,
    primaryAbility: 'WIS',
    armorName: 'Scale mail',
    armorCategory: 'medium',
    baseAC: 14,
    addShield: true,
    blurb:
      'A holy warrior who channels divine power to heal allies and smite foes. A good middle ground between the Fighter and the Wizard, and a great way to learn saving-throw spells.',
    startingEquipment: ['Scale mail', 'A mace', 'A shield', 'A holy symbol', "A priest's pack"],
    features: [
      { name: 'Spellcasting', description: 'You cast cleric spells, using Wisdom as your spellcasting ability, drawing on the power of your deity.' },
      { name: 'Divine Domain', description: 'You choose a domain related to your deity, granting you additional features (e.g. Life, War, Light).' },
    ],
    attack: {
      name: 'Sacred Flame',
      kind: 'spellSave',
      ability: 'WIS',
      saveAbility: 'DEX',
      damageDice: '1d8',
      damageBonus: 'none',
      damageType: 'radiant',
      description: 'A cantrip that calls down divine fire. The target must make a Dexterity saving throw against your spell save DC (8 + proficiency bonus + Wisdom modifier); on a failure, it takes 1d8 radiant damage.',
    },
  },
];

export function getClass(id: string): DnDClass {
  const dndClass = CLASSES.find((c) => c.id === id);
  if (!dndClass) throw new Error(`Unknown class: ${id}`);
  return dndClass;
}
