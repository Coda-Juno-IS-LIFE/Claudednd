import { useState } from 'react';
import { useGame } from '../state/GameContext';
import { GOBLIN } from '../data/monsters';
import { getClass } from '../data/classes';
import { resolvePlayerAttack, resolveMonsterAttack, type AttackResolution } from '../engine/combat';
import { rollD20WithMode } from '../engine/dice';
import { abilityModifier, finalAbilityScores, formatModifier } from '../engine/rules';
import { DiceRollDisplay } from '../components/DiceRollDisplay';
import { TutorialTip } from '../components/TutorialTip';

type Phase = 'pre' | 'initiative' | 'player-turn' | 'monster-turn' | 'victory' | 'defeat';

export function CombatScreen() {
  const { state, dispatch } = useGame();
  const character = state.character!;
  const dndClass = getClass(character.classId);
  const monster = GOBLIN;

  const [phase, setPhase] = useState<Phase>('pre');
  const [monsterHP, setMonsterHP] = useState(state.monsterCurrentHP ?? monster.maxHP);
  const [playerHP, setPlayerHP] = useState(character.currentHP);
  const [playerFirst, setPlayerFirst] = useState(true);
  const [advantageAvailable, setAdvantageAvailable] = useState(state.hasAmbushAdvantage);
  const [lastWho, setLastWho] = useState<'player' | 'monster' | null>(null);
  const [lastResolution, setLastResolution] = useState<AttackResolution | null>(null);
  const [initiativeInfo, setInitiativeInfo] = useState<null | {
    playerRoll: ReturnType<typeof rollD20WithMode>;
    playerBonus: number;
    monsterRoll: ReturnType<typeof rollD20WithMode>;
    monsterBonus: number;
    playerGoesFirst: boolean;
  }>(null);

  function log(line: string) {
    dispatch({ type: 'APPEND_LOG', line });
  }

  function beginCombat() {
    if (state.hasAmbushAdvantage) {
      log('You strike from hiding before the goblin knows you\'re there!');
      setPlayerFirst(true);
      setPhase('player-turn');
      return;
    }
    const scores = finalAbilityScores(character);
    const playerBonus = abilityModifier(scores.DEX);
    const monsterBonus = abilityModifier(monster.abilityScores.DEX);
    const playerRoll = rollD20WithMode('normal');
    const monsterRoll = rollD20WithMode('normal');
    const playerTotal = playerRoll.result + playerBonus;
    const monsterTotal = monsterRoll.result + monsterBonus;
    const goesFirst = playerTotal >= monsterTotal;
    setInitiativeInfo({ playerRoll, playerBonus, monsterRoll, monsterBonus, playerGoesFirst: goesFirst });
    setPlayerFirst(goesFirst);
    setPhase('initiative');
  }

  function confirmInitiative() {
    setPhase(playerFirst ? 'player-turn' : 'monster-turn');
  }

  function playerAttack() {
    const mode = advantageAvailable ? 'advantage' : 'normal';
    const res = resolvePlayerAttack(character, monster, mode);
    if (advantageAvailable) setAdvantageAvailable(false);
    dispatch({ type: 'SET_AMBUSH_ADVANTAGE', value: false });

    const newHP = Math.max(0, monsterHP - res.damageTotal);
    setMonsterHP(newHP);
    dispatch({ type: 'SET_MONSTER_HP', hp: newHP });

    if (res.hit) {
      log(`You hit the goblin with your ${dndClass.attack.name} for ${res.damageTotal} ${res.damageType} damage${res.isCrit ? ' — critical hit!' : ''}.`);
    } else {
      log(`Your ${dndClass.attack.name} misses.`);
    }
    setLastWho('player');
    setLastResolution(res);
  }

  function continueAfterPlayer() {
    setLastResolution(null);
    if (monsterHP <= 0) {
      log('The goblin collapses!');
      setPhase('victory');
    } else {
      setPhase('monster-turn');
    }
  }

  function monsterAttack() {
    const res = resolveMonsterAttack(monster, character);
    const newHP = Math.max(0, playerHP - res.damageTotal);
    setPlayerHP(newHP);
    const updatedChar = { ...character, currentHP: newHP };
    dispatch({ type: 'UPDATE_CHARACTER', character: updatedChar });

    if (res.hit) {
      log(`The goblin's ${monster.attackName} hits you for ${res.damageTotal} ${res.damageType} damage${res.isCrit ? ' — critical hit!' : ''}.`);
    } else {
      log(`The goblin's ${monster.attackName} misses you.`);
    }
    setLastWho('monster');
    setLastResolution(res);
  }

  function continueAfterMonster() {
    setLastResolution(null);
    if (playerHP <= 0) {
      setPhase('defeat');
    } else {
      setPhase('player-turn');
    }
  }

  function finishCombat(outcome: 'victory' | 'defeat') {
    dispatch({ type: 'SET_QUEST_NODE', nodeId: outcome });
    dispatch({ type: 'GO_TO', screen: 'adventure' });
  }

  const attackDescription = dndClass.attack.kind === 'spellSave' ? `Cast ${dndClass.attack.name}` : `Attack with ${dndClass.attack.name}`;

  return (
    <div className="screen">
      <h2>Combat: Goblin Ambush</h2>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <strong>{character.name}</strong>
          <span>
            {playerHP} / {character.maxHP} HP
          </span>
        </div>
        <div className="hp-bar-track">
          <div className="hp-bar-fill" style={{ width: `${Math.max(0, (playerHP / character.maxHP) * 100)}%` }} />
        </div>
      </div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <strong>Goblin</strong>
          <span>
            {monsterHP} / {monster.maxHP} HP
          </span>
        </div>
        <div className="hp-bar-track">
          <div className="hp-bar-fill" style={{ width: `${Math.max(0, (monsterHP / monster.maxHP) * 100)}%` }} />
        </div>
      </div>

      {phase === 'pre' && (
        <>
          <TutorialTip label="How does combat work?">
            <p>
              Combat happens in <strong>rounds</strong>. Each round, everyone gets one turn, in an order set by{' '}
              <strong>initiative</strong>. On your turn you can move and take one <strong>action</strong> — usually an
              attack. This repeats until one side is defeated.
            </p>
          </TutorialTip>
          {state.hasAmbushAdvantage && (
            <p className="muted">You snuck up on the goblin — you'll get a free attack with advantage before it can react.</p>
          )}
          <button className="btn btn-primary" onClick={beginCombat}>
            {state.hasAmbushAdvantage ? 'Strike!' : 'Roll Initiative'}
          </button>
        </>
      )}

      {phase === 'initiative' && initiativeInfo && (
        <div className="card">
          <TutorialTip label="What is initiative?">
            <p>
              Everyone rolls a d20 + their Dexterity modifier. Whoever rolls highest acts first, and turn order
              continues from there for the whole fight.
            </p>
          </TutorialTip>
          <p className="muted">Your initiative:</p>
          <DiceRollDisplay roll={initiativeInfo.playerRoll} bonus={initiativeInfo.playerBonus} />
          <p className="muted" style={{ marginTop: 10 }}>
            Goblin's initiative:
          </p>
          <DiceRollDisplay roll={initiativeInfo.monsterRoll} bonus={initiativeInfo.monsterBonus} />
          <p style={{ marginTop: 10 }}>{initiativeInfo.playerGoesFirst ? 'You act first!' : 'The goblin acts first!'}</p>
          <button className="btn btn-primary" onClick={confirmInitiative}>
            Continue
          </button>
        </div>
      )}

      {phase === 'player-turn' && !lastResolution && (
        <div className="card">
          <p className="muted">{dndClass.attack.description}</p>
          {advantageAvailable && <p className="tag">Advantage on this attack</p>}
          <button className="btn btn-primary" onClick={playerAttack}>
            {attackDescription}
          </button>
        </div>
      )}

      {phase === 'monster-turn' && !lastResolution && (
        <div className="card">
          <p className="muted">The goblin lashes out with its {monster.attackName}.</p>
          <button className="btn btn-danger" onClick={monsterAttack}>
            Resolve goblin's attack
          </button>
        </div>
      )}

      {lastResolution && lastWho === 'player' && (
        <div className="card">
          {lastResolution.kind === 'attackRoll' ? (
            <>
              <TutorialTip label="What just happened?">
                <p>
                  You rolled a d20{lastResolution.roll.mode === 'advantage' ? ' twice (advantage) and kept the higher roll' : ''}, added your attack bonus, and compared it to the
                  goblin's <strong>Armor Class (AC {monster.armorClass})</strong>. Meet or beat it to hit.
                </p>
              </TutorialTip>
              <DiceRollDisplay roll={lastResolution.roll} bonus={lastResolution.bonusOrDC} />
            </>
          ) : (
            <>
              <TutorialTip label="What just happened?">
                <p>
                  Instead of you rolling to hit, the goblin rolled a Dexterity saving throw against your{' '}
                  <strong>spell save DC ({lastResolution.bonusOrDC})</strong>. If it rolls below that number, the spell
                  takes effect.
                </p>
              </TutorialTip>
              <DiceRollDisplay roll={lastResolution.roll} bonus={0} label="Goblin's DEX save" />
            </>
          )}
          <p style={{ marginTop: 8 }}>
            {lastResolution.hit ? (
              <>
                Damage: {lastResolution.damageRolls?.join(' + ')}
                {lastResolution.damageBonus ? ` + ${lastResolution.damageBonus}` : ''} = <strong>{lastResolution.damageTotal - (lastResolution.extraDamageTotal ?? 0)}</strong>
                {lastResolution.extraDamageTotal ? (
                  <>
                    {' '}
                    + {lastResolution.extraDamageTotal} {lastResolution.extraDamageLabel} = <strong>{lastResolution.damageTotal}</strong>
                  </>
                ) : null}{' '}
                {lastResolution.damageType} damage
              </>
            ) : (
              'No damage.'
            )}
          </p>
          <button className="btn btn-primary" onClick={continueAfterPlayer}>
            Continue
          </button>
        </div>
      )}

      {lastResolution && lastWho === 'monster' && (
        <div className="card">
          <TutorialTip label="What just happened?">
            <p>
              The goblin rolled a d20 + its attack bonus ({formatModifier(monster.attackToHit)}) against{' '}
              <strong>your Armor Class ({character.armorClass})</strong>.
            </p>
          </TutorialTip>
          <DiceRollDisplay roll={lastResolution.roll} bonus={lastResolution.bonusOrDC} />
          <p style={{ marginTop: 8 }}>
            {lastResolution.hit ? (
              <>
                Damage: {lastResolution.damageRolls?.join(' + ')} + {lastResolution.damageBonus} = <strong>{lastResolution.damageTotal}</strong> {lastResolution.damageType} damage
              </>
            ) : (
              'No damage.'
            )}
          </p>
          <button className="btn btn-danger" onClick={continueAfterMonster}>
            Continue
          </button>
        </div>
      )}

      {phase === 'victory' && (
        <button className="btn btn-primary" onClick={() => finishCombat('victory')}>
          Continue the story
        </button>
      )}
      {phase === 'defeat' && (
        <button className="btn btn-primary" onClick={() => finishCombat('defeat')}>
          Continue the story
        </button>
      )}

      {state.combatLog.length > 0 && (
        <details style={{ marginTop: 14 }}>
          <summary className="muted" style={{ cursor: 'pointer' }}>
            Combat log
          </summary>
          <div className="combat-log" style={{ marginTop: 8 }}>
            {[...state.combatLog].reverse().map((line, i) => (
              <div className="entry" key={i}>
                {line}
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
