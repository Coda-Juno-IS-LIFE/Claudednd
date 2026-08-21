# Tavern Tutor

A single-player, phone-friendly web app for learning Dungeons & Dragons 5th
Edition before you sit down at a real table. Build a character with the
official character-creation rules, then play through a short guided
adventure — including a tutorial combat encounter — with inline explanations
of what every roll means and why.

## What it does

- **Character creation** — pick a race, class, and background from the
  D&D 5e SRD, assign ability scores with the standard array, choose skill
  proficiencies, and see your derived stats (HP, AC, saving throws) build up
  live.
- **A short solo adventure** ("The Miller's Plea") — a branching story with
  roleplaying choices and skill checks (with real DCs) that leads into a
  goblin encounter.
- **Tutorial combat** — turn-based combat against a goblin, teaching
  initiative, attack rolls vs. Armor Class, damage rolls, advantage/
  disadvantage, and (for the Cleric) a saving-throw-based cantrip.
- **Inline "what does this mean?" tips** throughout, so you're never stuck
  wondering what a term like "proficiency bonus" or "DC" means.
- **A full character sheet** you can review at any time.
- Progress is saved to your browser's local storage, so you can close the
  tab and pick up where you left off.

This is intentionally a *learning* tool, not a full campaign simulator — the
goal is to get you comfortable with the core rules loop (ability checks,
attack rolls, saving throws, advantage) so a real table feels familiar on
day one.

## Running it

```bash
npm install
npm run dev
```

Then open the printed local URL on your phone (same Wi-Fi network) or in
your desktop browser. On a phone, use your browser's "Add to Home Screen"
option for an app-like icon (the app ships a web manifest for this).

To build a static production bundle (e.g. for GitHub Pages or any static
host):

```bash
npm run build
```

The output lands in `dist/`.

## Tech

- React + TypeScript, built with Vite.
- No backend — everything runs client-side, state is kept in React context
  and persisted to `localStorage`.
- No UI framework — hand-rolled, mobile-first CSS with large tap targets.

## Rules content & attribution

The rules content in this project (races, classes, backgrounds, monster
stats, and core mechanics) is adapted from the **Dungeons & Dragons System
Reference Document 5.1 ("SRD 5.1")**, made available by Wizards of the
Coast under the Creative Commons Attribution 4.0 International License
(CC-BY-4.0).

> This work includes material taken from the System Reference Document 5.1
> ("SRD 5.1") by Wizards of the Coast LLC and available at
> https://dnd.wizards.com/resources/systems-reference-document. The SRD 5.1
> is licensed under the Creative Commons Attribution 4.0 International
> License available at https://creativecommons.org/licenses/by/4.0/legalcode.

Content has been trimmed and simplified for a level 1, single-encounter
tutorial (4 races, 4 classes, 4 backgrounds, one monster) — it is not a
complete implementation of the SRD. "Dungeons & Dragons" and "D&D" are
trademarks of Wizards of the Coast LLC; this project is an unofficial fan
project and is not affiliated with or endorsed by Wizards of the Coast.

## Project structure

```
src/
  types.ts              Core TypeScript types for the rules model
  data/                  SRD content: races, classes, backgrounds, monsters, quest
  engine/                Rules math: dice, ability/skill/AC/HP calculations, combat resolution
  state/                 App state (React context + reducer, localStorage persistence)
  components/            Shared UI: dice display, tutorial tooltips, progress dots
  screens/               Screens: home, how-to-play, character creation steps,
                          character sheet, adventure, combat, ending
```
