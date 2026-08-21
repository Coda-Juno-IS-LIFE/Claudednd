import type { Background } from '../types';

// Skill proficiencies, equipment, and features from the SRD 5.1 "Backgrounds" section.
export const BACKGROUNDS: Background[] = [
  {
    id: 'soldier',
    name: 'Soldier',
    skillProficiencies: ['Athletics', 'Intimidation'],
    equipment: ['An insignia of rank', 'A trophy from a fallen enemy', 'A deck of playing cards', 'Common clothes', '10 gp'],
    feature: {
      name: 'Military Rank',
      description: 'You have a military rank from your career as a soldier. Soldiers loyal to your former organization still recognize your authority and influence.',
    },
    blurb: 'You fought in a militia, an army, or a mercenary company before adventuring. Pairs naturally with the Fighter.',
  },
  {
    id: 'sage',
    name: 'Sage',
    skillProficiencies: ['Arcana', 'History'],
    equipment: ['A bottle of black ink', 'A quill', 'A small knife', 'A letter from a dead colleague posing a question you have not yet answered', 'Common clothes', '10 gp'],
    feature: {
      name: 'Researcher',
      description: 'When you attempt to learn or recall a piece of lore, you often know where and from whom you can obtain it if you do not already have the answer.',
    },
    blurb: 'You spent years learning the lore of the multiverse. Pairs naturally with the Wizard.',
  },
  {
    id: 'criminal',
    name: 'Criminal',
    skillProficiencies: ['Deception', 'Stealth'],
    equipment: ['A crowbar', 'A set of dark common clothes including a hood', '15 gp'],
    feature: {
      name: 'Criminal Contact',
      description: 'You have a reliable and trustworthy contact who acts as your liaison to a network of other criminals.',
    },
    blurb: 'You have a history of breaking the law and survive by leveraging that skill set. Pairs naturally with the Rogue.',
  },
  {
    id: 'acolyte',
    name: 'Acolyte',
    skillProficiencies: ['Insight', 'Religion'],
    equipment: ['A holy symbol', 'A prayer book or prayer wheel', 'Incense (5 sticks)', 'Vestments', 'Common clothes', '15 gp'],
    feature: {
      name: 'Shelter of the Faithful',
      description: 'You command the respect of those who share your faith, and can perform religious ceremonies. You and your companions can expect free healing and care at temples of your faith.',
    },
    blurb: 'You spent your life in service to a temple. Pairs naturally with the Cleric.',
  },
];

export function getBackground(id: string): Background {
  const bg = BACKGROUNDS.find((b) => b.id === id);
  if (!bg) throw new Error(`Unknown background: ${id}`);
  return bg;
}
