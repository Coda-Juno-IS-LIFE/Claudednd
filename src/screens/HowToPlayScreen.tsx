import { useGame } from '../state/GameContext';

export function HowToPlayScreen() {
  const { dispatch } = useGame();
  return (
    <div className="screen">
      <h2>How to Play D&amp;D</h2>

      <div className="card">
        <h3>The basic idea</h3>
        <p>
          Dungeons &amp; Dragons is collaborative storytelling with rules. Normally, a <strong>Dungeon Master (DM)</strong>{' '}
          describes the world and its people, you describe what your character does, and dice decide the outcome
          whenever there's real uncertainty. This app plays the DM's part for a short solo tutorial.
        </p>
      </div>

      <div className="card">
        <h3>Dice notation</h3>
        <p>
          You'll see things like <strong>1d20</strong> or <strong>2d6</strong>. The number before "d" is how many dice
          to roll, and the number after is how many sides each die has. "1d20" means "roll one 20-sided die."
        </p>
      </div>

      <div className="card">
        <h3>Ability scores &amp; modifiers</h3>
        <p>
          Six scores — Strength, Dexterity, Constitution, Intelligence, Wisdom, Charisma — describe your character.
          Each gives a <strong>modifier</strong> you add to related rolls. A score of 10-11 gives +0; every 2 points
          above or below shifts the modifier by 1 (so 14 is +2, 8 is −1, and so on).
        </p>
      </div>

      <div className="card">
        <h3>The core loop</h3>
        <p>
          <strong>Ability checks:</strong> roll 1d20 + a modifier against a <strong>Difficulty Class (DC)</strong> the
          DM sets, to see if you succeed at something uncertain (climbing, persuading, noticing a clue).
        </p>
        <p>
          <strong>Attack rolls:</strong> roll 1d20 + your attack bonus against a target's <strong>Armor Class (AC)</strong>.
          Meet or beat it, and you hit — then roll separate dice for damage.
        </p>
        <p>
          <strong>Saving throws:</strong> when something targets you (a trap, a spell), you roll 1d20 + a modifier
          against a DC to avoid or reduce the effect. Spellcasters can force enemies to make saves too.
        </p>
      </div>

      <div className="card">
        <h3>Advantage &amp; disadvantage</h3>
        <p>
          Sometimes circumstances tilt a roll in your favor (advantage) or against you (disadvantage). Roll two d20s
          instead of one — keep the higher result for advantage, the lower for disadvantage.
        </p>
      </div>

      <div className="card">
        <h3>Joining a live table</h3>
        <p>Once you're comfortable with the ideas above, here's what to expect at an actual session:</p>
        <p>
          • Bring a set of polyhedral dice (or a dice-roller app) and a pencil.
          <br />• Your DM will describe the scene — ask questions, and describe what you want to try.
          <br />• You don't need to know every rule. Say what your character wants to do, and the DM (or the table)
          will tell you what to roll.
          <br />• Combat moves in rounds with an initiative order — pay attention for your turn, but it's fine to
          plan while you wait.
          <br />• The most important skill is showing up curious and having fun with the story.
        </p>
      </div>

      <div className="spacer" />
      <button className="btn btn-primary" onClick={() => dispatch({ type: 'GO_TO', screen: 'home' })}>
        Back to Home
      </button>
    </div>
  );
}
