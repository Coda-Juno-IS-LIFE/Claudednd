import type { Monster } from '../types';

// Stat block from the SRD 5.1 "Monsters" appendix (Goblin).
export const GOBLIN: Monster = {
  id: 'goblin',
  name: 'Goblin',
  armorClass: 15,
  maxHP: 7,
  speed: 30,
  abilityScores: { STR: 8, DEX: 14, CON: 10, INT: 10, WIS: 8, CHA: 8 },
  attackName: 'Scimitar',
  attackToHit: 4,
  damageDice: '1d6',
  damageBonus: 2,
  damageType: 'slashing',
  challengeRating: '1/4',
  passivePerception: 9,
  blurb:
    'A small, black-hearted humanoid that lives in tribes throughout the wilderness. Wears scavenged leather armor and carries a wicked, curved scimitar.',
};

export function getMonster(id: string): Monster {
  if (id === 'goblin') return GOBLIN;
  throw new Error(`Unknown monster: ${id}`);
}
