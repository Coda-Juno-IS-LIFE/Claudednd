import { GameProvider, useGame } from './state/GameContext';
import { HomeScreen } from './screens/HomeScreen';
import { HowToPlayScreen } from './screens/HowToPlayScreen';
import { RaceStep } from './screens/CharacterCreation/RaceStep';
import { ClassStep } from './screens/CharacterCreation/ClassStep';
import { BackgroundStep } from './screens/CharacterCreation/BackgroundStep';
import { AbilityScoresStep } from './screens/CharacterCreation/AbilityScoresStep';
import { SkillsStep } from './screens/CharacterCreation/SkillsStep';
import { ReviewStep } from './screens/CharacterCreation/ReviewStep';
import { CharacterSheetScreen } from './screens/CharacterSheetScreen';
import { AdventureScreen } from './screens/AdventureScreen';
import { CombatScreen } from './screens/CombatScreen';
import { EndingScreen } from './screens/EndingScreen';

function Router() {
  const { state } = useGame();

  switch (state.screen) {
    case 'home':
      return <HomeScreen />;
    case 'how-to-play':
      return <HowToPlayScreen />;
    case 'create-race':
      return <RaceStep />;
    case 'create-class':
      return <ClassStep />;
    case 'create-background':
      return <BackgroundStep />;
    case 'create-abilities':
      return <AbilityScoresStep />;
    case 'create-skills':
      return <SkillsStep />;
    case 'create-review':
      return <ReviewStep />;
    case 'sheet':
      return state.character ? <CharacterSheetScreen /> : <HomeScreen />;
    case 'adventure':
      return state.character ? <AdventureScreen /> : <HomeScreen />;
    case 'combat':
      return state.character ? <CombatScreen /> : <HomeScreen />;
    case 'ending':
      return <EndingScreen />;
    default:
      return <HomeScreen />;
  }
}

export default function App() {
  return (
    <GameProvider>
      <div className="app-shell">
        <Router />
      </div>
    </GameProvider>
  );
}
