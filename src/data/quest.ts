import type { SkillName } from '../types';

export interface QuestCheck {
  skill: SkillName;
  dc: number;
}

export interface QuestChoice {
  label: string;
  check?: QuestCheck;
  /** Node to go to on success (or always, if no check). */
  next: string;
  /** Node to go to on failure, if there's a check. Defaults to `next` if omitted. */
  failNext?: string;
  successText?: string;
  failText?: string;
}

export interface QuestNode {
  id: string;
  text: string;
  choices: QuestChoice[];
  /** If set, entering this node starts the tutorial combat encounter. */
  triggersCombat?: boolean;
  /** If set, this node ends the quest. */
  isEnding?: boolean;
}

// A short, teaching-focused solo adventure: "The Miller's Plea".
// Demonstrates roleplaying choices, skill checks (with DCs), and leads into
// the tutorial combat encounter.
export const QUEST_NODES: Record<string, QuestNode> = {
  start: {
    id: 'start',
    text:
      'The road brings you to the village of Aldenmoor as the sun dips low. Smoke curls from chimneys, but one building ' +
      'stands dark and silent: the old mill on the hill, its wheel unmoving. A miller named Bram flags you down at the ' +
      'village gate, wringing his hands. "Goblins," he says. "They\'ve holed up in my mill and taken this season\'s grain. ' +
      'Please — the village won\'t survive the winter without it."',
    choices: [
      { label: 'Agree to help right away', next: 'the_trail' },
      {
        label: 'Ask Bram more questions first',
        check: { skill: 'Insight', dc: 10 },
        next: 'the_trail_informed',
        failNext: 'the_trail',
        successText:
          'You watch Bram closely as he speaks. He\'s telling the truth — and more afraid than he lets on. There\'s something else in that mill besides goblins, you\'re sure of it. Still, he doesn\'t seem to know what.',
        failText: 'Bram is clearly stressed, but you can\'t tell if he\'s telling you everything. He seems sincere enough.',
      },
    ],
  },
  the_trail_informed: {
    id: 'the_trail_informed',
    text:
      'Armed with Bram\'s nervous warning, you set out for the mill with your guard up, half-expecting trouble beyond mere goblins.',
    choices: [{ label: 'Continue toward the mill', next: 'the_trail' }],
  },
  the_trail: {
    id: 'the_trail',
    text:
      'The path to the mill winds through a stand of birch trees. Halfway up the hill, you spot signs that something ' +
      'has passed this way recently: broken branches, a smear of mud, faint tracks in the soft earth leading off the ' +
      'main path.',
    choices: [
      {
        label: 'Study the tracks (Investigation check, DC 12)',
        check: { skill: 'Investigation', dc: 12 },
        next: 'ambush_setup',
        failNext: 'straight_approach',
        successText:
          'The tracks are goblin-sized, and there are more of them than you\'d like — but they all lead to a side door on the mill\'s lower level, poorly watched. You could slip in that way and get the drop on whoever is inside.',
        failText:
          'You can tell something has come this way, but the trail is too faint to read clearly. Best to approach the mill directly and see what you find.',
      },
      { label: 'Skip the tracks and head straight for the mill', next: 'straight_approach' },
    ],
  },
  ambush_setup: {
    id: 'ambush_setup',
    text:
      'You creep along the tree line to the side door the tracks led you to. Through a gap in the boards, you spot a ' +
      'lone goblin sentry, back turned, muttering to itself over a torch. It has no idea you\'re here.',
    choices: [{ label: 'Strike now while you have the advantage', next: 'combat_start' }],
  },
  straight_approach: {
    id: 'straight_approach',
    text:
      'You approach the mill\'s front door directly. It hangs half-open, and firelight flickers within. As you step ' +
      'inside, a startled goblin spins to face you, scimitar already in hand — this fight will be a fair one.',
    choices: [{ label: 'Draw your weapon and engage', next: 'combat_start' }],
  },
  combat_start: {
    id: 'combat_start',
    text: 'The goblin lunges to meet you. There\'s no more time to think — only to act.',
    choices: [],
    triggersCombat: true,
  },
  victory: {
    id: 'victory',
    text:
      'The goblin falls, and the mill goes quiet. Behind an overturned sack of grain, you find the rest of the stolen ' +
      'harvest, untouched. There\'s no sign of anything larger lurking here after all — just a small, opportunistic band ' +
      'that bit off more than it could chew. You haul the grain back down the hill, and Bram nearly weeps with relief. ' +
      'Word of your deed spreads through Aldenmoor by morning.',
    choices: [],
    isEnding: true,
  },
  defeat: {
    id: 'defeat',
    text:
      'The goblin gets the better of you and you\'re knocked to the ground, vision swimming. This is the moment a real ' +
      'table would call for a death saving throw — a d20 roll with no modifiers, 10 or higher counting as a success, ' +
      'three successes stabilizes you and three failures means your character dies. Fortunately, Bram was following ' +
      'at a distance and drives the goblin off with a torch before it can finish the job. You live to try again.',
    choices: [],
    isEnding: true,
  },
};
