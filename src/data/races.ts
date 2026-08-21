import type { Race } from '../types';

// Ability bonuses, traits, and speeds drawn from the SRD 5.1 "Races" section.
export const RACES: Race[] = [
  {
    id: 'human',
    name: 'Human',
    abilityBonuses: { STR: 1, DEX: 1, CON: 1, INT: 1, WIS: 1, CHA: 1 },
    speed: 30,
    size: 'Medium',
    languages: ['Common', 'one language of your choice'],
    blurb:
      'The most adaptable and ambitious people among the common races. Balanced at everything, masters of nothing in particular — which is exactly why they are a great first character to learn the game with.',
    traits: [
      {
        name: 'Ability Score Increase',
        description: 'Every one of your ability scores increases by 1.',
      },
      {
        name: 'Versatile',
        description:
          'No unusual bonuses or drawbacks — humans keep the rules simple while you\'re learning them.',
      },
    ],
  },
  {
    id: 'hill-dwarf',
    name: 'Hill Dwarf',
    abilityBonuses: { CON: 2, WIS: 1 },
    speed: 25,
    size: 'Medium',
    languages: ['Common', 'Dwarvish'],
    blurb:
      'Bold and hardy, Hill Dwarves are tough to kill and wise to the world. Great if you want a durable character who can take a hit while you learn combat.',
    traits: [
      { name: 'Darkvision', description: 'You can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light (in shades of gray).' },
      { name: 'Dwarven Resilience', description: 'You have advantage on saving throws against poison, and resistance against poison damage.' },
      { name: 'Dwarven Combat Training', description: 'You have proficiency with the battleaxe, handaxe, light hammer, and warhammer.' },
      { name: 'Stonecunning', description: 'You have expertise (double proficiency bonus) on History checks related to the origin of stonework.' },
      { name: 'Dwarven Toughness', description: 'Your hit point maximum increases by 1, and increases by 1 again every time you gain a level.' },
    ],
  },
  {
    id: 'high-elf',
    name: 'High Elf',
    abilityBonuses: { DEX: 2, INT: 1 },
    speed: 30,
    size: 'Medium',
    languages: ['Common', 'Elvish', 'one language of your choice'],
    skillProficiencies: ['Perception'],
    blurb:
      'Graceful and keen-eyed, High Elves favor finesse over brute force. A strong pick if you like precision and a little magic on the side.',
    traits: [
      { name: 'Darkvision', description: 'You can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light (in shades of gray).' },
      { name: 'Keen Senses', description: 'You have proficiency in the Perception skill.' },
      { name: 'Fey Ancestry', description: 'You have advantage on saving throws against being charmed, and magic can\'t put you to sleep.' },
      { name: 'Trance', description: 'Elves don\'t need to sleep. Instead, they meditate deeply for 4 hours a day.' },
      { name: 'Elf Weapon Training', description: 'You have proficiency with the longsword, shortsword, shortbow, and longbow.' },
      { name: 'Cantrip', description: 'You know one cantrip of your choice from the wizard spell list.' },
    ],
  },
  {
    id: 'lightfoot-halfling',
    name: 'Lightfoot Halfling',
    abilityBonuses: { DEX: 2, CHA: 1 },
    speed: 25,
    size: 'Small',
    languages: ['Common', 'Halfling'],
    blurb:
      'Small, quick, and lucky almost to the point of magic. A fun choice if you want to dodge danger and talk your way out of trouble.',
    traits: [
      { name: 'Lucky', description: 'When you roll a 1 on a d20 for an attack roll, ability check, or saving throw, you can reroll the die and must use the new roll.' },
      { name: 'Brave', description: 'You have advantage on saving throws against being frightened.' },
      { name: 'Halfling Nimbleness', description: 'You can move through the space of any creature that is of a size larger than yours.' },
      { name: 'Naturally Stealthy', description: 'You can attempt to hide even when you are obscured only by a creature that is at least one size larger than you.' },
    ],
  },
];

export function getRace(id: string): Race {
  const race = RACES.find((r) => r.id === id);
  if (!race) throw new Error(`Unknown race: ${id}`);
  return race;
}
