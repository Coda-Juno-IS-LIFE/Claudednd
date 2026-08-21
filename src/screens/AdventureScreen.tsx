import { useState } from 'react';
import { useGame } from '../state/GameContext';
import { QUEST_NODES, type QuestChoice } from '../data/quest';
import { TutorialTip } from '../components/TutorialTip';
import { DiceRollDisplay } from '../components/DiceRollDisplay';
import { rollD20WithMode } from '../engine/dice';
import { skillModifier } from '../engine/rules';
import type { D20Roll } from '../engine/dice';

interface PendingResult {
  choice: QuestChoice;
  roll: D20Roll;
  bonus: number;
  total: number;
  success: boolean;
}

export function AdventureScreen() {
  const { state, dispatch } = useGame();
  const [pending, setPending] = useState<PendingResult | null>(null);
  const node = QUEST_NODES[state.questNodeId];
  const character = state.character!;

  function goToNode(nodeId: string) {
    if (nodeId === 'ambush_setup') {
      dispatch({ type: 'SET_AMBUSH_ADVANTAGE', value: true });
    }
    setPending(null);
    dispatch({ type: 'SET_QUEST_NODE', nodeId });
    const nextNode = QUEST_NODES[nodeId];
    if (nextNode?.triggersCombat) {
      dispatch({ type: 'GO_TO', screen: 'combat' });
    }
  }

  function pickChoice(choice: QuestChoice) {
    if (!choice.check) {
      goToNode(choice.next);
      return;
    }
    const bonus = skillModifier(character, choice.check.skill);
    const roll = rollD20WithMode('normal');
    const total = roll.result + bonus;
    const success = total >= choice.check.dc;
    setPending({ choice, roll, bonus, total, success });
  }

  function confirmPending() {
    if (!pending) return;
    const nextId = pending.success ? pending.choice.next : pending.choice.failNext ?? pending.choice.next;
    goToNode(nextId);
  }

  if (!node) return null;

  return (
    <div className="screen">
      <div className="top-bar">
        <h1>{character.name}</h1>
        <button className="btn btn-ghost" style={{ width: 'auto', minHeight: 36, padding: '6px 12px' }} onClick={() => dispatch({ type: 'GO_TO', screen: 'sheet' })}>
          Sheet
        </button>
      </div>

      <div className="narrative">{node.text}</div>

      {node.isEnding && (
        <TutorialTip label="Where would this go at a real table?">
          <p>
            A real session keeps going from here: your DM would award experience points, maybe let you level up, and
            spin the next adventure hook out of what just happened. This tutorial stops here, but that loop —
            roleplay, explore, resolve with dice, repeat — is the whole game.
          </p>
        </TutorialTip>
      )}

      {!pending &&
        node.choices.map((choice, i) => (
          <button key={i} className="btn" style={{ marginBottom: 10 }} onClick={() => pickChoice(choice)}>
            {choice.label}
          </button>
        ))}

      {pending && (
        <div className="card">
          {pending.choice.check && (
            <>
              <p className="muted" style={{ marginBottom: 6 }}>
                {pending.choice.check.skill} check — DC {pending.choice.check.dc} (need {pending.choice.check.dc} or higher)
              </p>
              <TutorialTip label="What just happened?">
                <p>
                  You rolled a d20, added your {pending.choice.check.skill} modifier ({pending.bonus >= 0 ? '+' : ''}
                  {pending.bonus}), and compared the total to the <strong>Difficulty Class (DC)</strong> the DM set for
                  this task. Meet or beat the DC and you succeed.
                </p>
              </TutorialTip>
              <DiceRollDisplay roll={pending.roll} bonus={pending.bonus} />
            </>
          )}
          <p style={{ marginTop: 10, fontWeight: pending.success ? 700 : 400, color: pending.success ? 'var(--success)' : 'var(--danger-strong)' }}>
            {pending.success ? 'Success!' : 'Not quite.'}
          </p>
          <p className="muted">{pending.success ? pending.choice.successText : pending.choice.failText}</p>
          <button className="btn btn-primary" onClick={confirmPending}>
            Continue
          </button>
        </div>
      )}

      {node.isEnding && !pending && (
        <div className="stack" style={{ marginTop: 10 }}>
          <button className="btn btn-primary" onClick={() => dispatch({ type: 'GO_TO', screen: 'ending' })}>
            Finish
          </button>
        </div>
      )}
    </div>
  );
}
