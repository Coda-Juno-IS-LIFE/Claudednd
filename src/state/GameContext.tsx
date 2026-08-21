import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react';
import type { AbilityScores, Character, SkillName } from '../types';

export type Screen =
  | 'home'
  | 'how-to-play'
  | 'create-race'
  | 'create-class'
  | 'create-background'
  | 'create-abilities'
  | 'create-skills'
  | 'create-review'
  | 'sheet'
  | 'adventure'
  | 'combat'
  | 'ending';

export interface GameState {
  screen: Screen;
  character: Character | null;
  // in-progress character creation choices
  draftRaceId: string | null;
  draftClassId: string | null;
  draftBackgroundId: string | null;
  draftAbilityScores: AbilityScores | null;
  draftSkills: SkillName[];
  draftName: string;
  // adventure/quest progress
  questNodeId: string;
  hasAmbushAdvantage: boolean;
  investigationSucceeded: boolean;
  // combat scratch state (persisted so a refresh mid-fight doesn't lose it)
  monsterCurrentHP: number | null;
  combatLog: string[];
}

const STORAGE_KEY = 'dnd-tutor-save-v1';

const initialState: GameState = {
  screen: 'home',
  character: null,
  draftRaceId: null,
  draftClassId: null,
  draftBackgroundId: null,
  draftAbilityScores: null,
  draftSkills: [],
  draftName: '',
  questNodeId: 'start',
  hasAmbushAdvantage: false,
  investigationSucceeded: false,
  monsterCurrentHP: null,
  combatLog: [],
};

type Action =
  | { type: 'GO_TO'; screen: Screen }
  | { type: 'SET_DRAFT_RACE'; raceId: string }
  | { type: 'SET_DRAFT_CLASS'; classId: string }
  | { type: 'SET_DRAFT_BACKGROUND'; backgroundId: string }
  | { type: 'SET_DRAFT_ABILITY_SCORES'; scores: AbilityScores }
  | { type: 'SET_DRAFT_SKILLS'; skills: SkillName[] }
  | { type: 'SET_DRAFT_NAME'; name: string }
  | { type: 'SET_CHARACTER'; character: Character }
  | { type: 'UPDATE_CHARACTER'; character: Character }
  | { type: 'SET_QUEST_NODE'; nodeId: string }
  | { type: 'SET_AMBUSH_ADVANTAGE'; value: boolean }
  | { type: 'SET_INVESTIGATION_SUCCEEDED'; value: boolean }
  | { type: 'START_COMBAT'; monsterHP: number }
  | { type: 'SET_MONSTER_HP'; hp: number }
  | { type: 'APPEND_LOG'; line: string }
  | { type: 'CLEAR_LOG' }
  | { type: 'NEW_GAME' };

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'GO_TO':
      return { ...state, screen: action.screen };
    case 'SET_DRAFT_RACE':
      return { ...state, draftRaceId: action.raceId };
    case 'SET_DRAFT_CLASS':
      return { ...state, draftClassId: action.classId };
    case 'SET_DRAFT_BACKGROUND':
      return { ...state, draftBackgroundId: action.backgroundId };
    case 'SET_DRAFT_ABILITY_SCORES':
      return { ...state, draftAbilityScores: action.scores };
    case 'SET_DRAFT_SKILLS':
      return { ...state, draftSkills: action.skills };
    case 'SET_DRAFT_NAME':
      return { ...state, draftName: action.name };
    case 'SET_CHARACTER':
    case 'UPDATE_CHARACTER':
      return { ...state, character: action.character };
    case 'SET_QUEST_NODE':
      return { ...state, questNodeId: action.nodeId };
    case 'SET_AMBUSH_ADVANTAGE':
      return { ...state, hasAmbushAdvantage: action.value };
    case 'SET_INVESTIGATION_SUCCEEDED':
      return { ...state, investigationSucceeded: action.value };
    case 'START_COMBAT':
      return { ...state, monsterCurrentHP: action.monsterHP, combatLog: [] };
    case 'SET_MONSTER_HP':
      return { ...state, monsterCurrentHP: action.hp };
    case 'APPEND_LOG':
      return { ...state, combatLog: [...state.combatLog, action.line] };
    case 'CLEAR_LOG':
      return { ...state, combatLog: [] };
    case 'NEW_GAME':
      return { ...initialState };
    default:
      return state;
  }
}

function loadInitialState(): GameState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw) as GameState;
    return { ...initialState, ...parsed };
  } catch {
    return initialState;
  }
}

interface GameContextValue {
  state: GameState;
  dispatch: React.Dispatch<Action>;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadInitialState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // storage unavailable (private browsing, quota) — game still works, just won't resume later
    }
  }, [state]);

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within a GameProvider');
  return ctx;
}

export function hasSavedGame(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as GameState;
    return !!parsed.character;
  } catch {
    return false;
  }
}
