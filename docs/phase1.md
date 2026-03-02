## Current State: What You Have

The game has a solid skeleton but several **critical bugs** and **missing features** prevent it from being truly playable.

### What Already Works
- Navigation flow: Splash -> Home -> Play / Settings / About
- Core snake movement with `setInterval` game loop
- Swipe gesture controls (pan gesture handler)
- 4 food types: Normal, Golden, Rainbow, Poison (with different point values)
- Combo system (eat food quickly = multiplier)
- 3 Power-ups: Speed, Slow, DoublePoints
- Difficulty scaling (speed increases at score 0/20/50/100)
- Score persistence via Zustand + AsyncStorage
- Settings: background music, vibration, rounded edges
- Game Over modal with score + high score
- High score history list (ScoreModal)

---

## Critical Bugs Blocking Playability

| # | Bug | File | Impact |
|---|-----|------|--------|
| 1 | **Food collision area=2 is way too generous** — snake eats food from 2 cells away on a 10px grid | checkEatsFood.ts | Game feels broken, food disappears before you reach it |
| 2 | **Food spawns on snake body** — no check against current snake position | randomFoodPosition.ts | Invisible food, frustrating |
| 3 | **Snake segment size (15px) doesn't match grid size (10px)** — `GAME_UNIT_SIZE=10` but snake renders at `width:15, height:15` | Snake.tsx + gameConstants.ts | Visual misalignment, snake overlaps cells, collisions look wrong |
| 4 | **Food sizes are inconsistent** (10-14px) vs grid (10px) | Food.tsx | Food appears offset from grid |
| 5 | **Score only saved when beating high score** — `if (score > localHighScore)` | useGameLoop.ts | Score history missing most games |
| 6 | **No swipe threshold** — any tiny accidental touch changes direction | useGestureHandler.ts | Frustrating accidental deaths |
| 7 | **`" use dom"` directive on index.tsx** — this is invalid and may cause issues | index.tsx | Potential crash on some platforms |
| 8 | **Power-up expiration checked in useEffect** — race condition, power-up can expire mid-frame | useGameState.ts | Inconsistent game speed |
| 9 | **No resize handling** — bounds calculated once on layout, if device rotates or keyboard appears, game breaks | Game.tsx | Edge-case crash |

---

## What's Missing for a Real Playable Game (Phase One)

### Tier 1 — Must Have (Game is unplayable without these)
1. **Fix the 9 bugs above** — especially food collision, grid alignment, and swipe threshold
2. **Pause overlay** — when paused, the game shows nothing; you can accidentally swipe while paused
3. **Starting countdown** — game starts instantly on load, no chance to get ready
4. **Always save score on game over** — not just when beating high score
5. **Prevent food spawn on snake** — pass snake body to `randomFoodPosition`

### Tier 2 — Should Have (Game is boring without these)
6. **Sound effects** — eat food, game over, combo, power-up (you have background music but no SFX)
7. **Grid lines** on the game board — helps the player see where to go
8. **Proper pause screen** with a semi-transparent overlay and "PAUSED" text
9. **Confirm before restart** — tapping reload during gameplay shouldn't instantly reset
10. **"How to Play" / tutorial** — brief overlay on first launch explaining swipe controls, food types, combos
11. **Snake trail/glow effect** on combo streaks

### Tier 3 — Nice to Have (Polish)
12. **Difficulty selector** on home screen (Easy/Medium/Hard presets)
13. **Game stats** tracked locally (total games, total food eaten, longest snake, best combo)
14. **Animated food spawn** (pop-in effect)
15. **Screen shake on death**
16. **Themed snake skins** (just color variations, stored in AsyncStorage)
17. **Back button** from game screen to home

---

## Game Flow (Phase One — Fully Local)

```
┌──────────────────────────────────────────────────────┐
│                    APP LAUNCH                         │
│              SplashScreen (2s)                        │
│         Load settings from AsyncStorage              │
│         Load high scores from AsyncStorage           │
└──────────────┬───────────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────────┐
│                   HOME SCREEN                         │
│                                                      │
│   [🐍 Snaki Logo - bouncing]                         │
│   "Welcome to Snaki!"                                │
│                                                      │
│   [ ▶ Play Now ]  →  /play                           │
│   [ ⚙ Settings ]  →  /settings                      │
│   [ ℹ  About   ]  →  /about                         │
│   [ 🏆 High Scores ] → ScoreModal (bottom sheet)    │
│                                                      │
│   🏆 Best: 142    🎮 Games: 37                       │
└──────────────┬───────────────────────────────────────┘
               │ Tap "Play Now"
               ▼
┌──────────────────────────────────────────────────────┐
│                   GAME SCREEN                         │
│                                                      │
│  ┌─ HEADER ──────────────────────────────────────┐   │
│  │ [⚙] [🔄] [⏸]      Score: 0  │ Level 1 🔥 │ 🏆│   │
│  └───────────────────────────────────────────────┘   │
│                                                      │
│  ┌─ COUNTDOWN OVERLAY ───────────────────────────┐   │
│  │              3... 2... 1... GO!                │   │
│  │         "Swipe to move the snake"             │   │
│  └───────────────────────────────────────────────┘   │
│                                                      │
│  ┌─ GAME BOARD ──────────────────────────────────┐   │
│  │  Grid lines visible                           │   │
│  │  🐍 Snake (head has eye)                      │   │
│  │  🔴 Food (normal=green, golden=gold, etc.)    │   │
│  │                                               │   │
│  │  [POWER-UP INDICATOR] if active (top-right)   │   │
│  │  [COMBO TEXT] if combo >= 3 (center)          │   │
│  │  [POISON OVERLAY] red flash if poison eaten   │   │
│  └───────────────────────────────────────────────┘   │
│                                                      │
│  Swipe ↑ ↓ ← → to change direction                  │
└──────────────────────────────────────────────────────┘

DURING GAMEPLAY:
  • Snake moves automatically in current direction
  • Eat food → grow + score + chance of special food/power-up
  • Combo: eat food within 2s of previous → combo multiplier
  • Power-ups: Speed (1.5x), Slow (0.7x), DoublePoints (2x score) – 5s duration
  • Difficulty auto-increases: Level 1→4 based on score thresholds
  • Poison food: lose points, shrink snake, red flash, combo reset

PAUSE STATE:
  ┌─────────────────────────────────────┐
  │          ⏸ PAUSED                   │
  │                                     │
  │      [ ▶ Resume ]                   │
  │      [ 🔄 Restart ]                 │
  │      [ 🏠 Home ]                    │
  └─────────────────────────────────────┘

GAME OVER:
  ┌─────────────────────────────────────┐
  │       🎮 Game Over                  │
  │                                     │
  │    Score: 42      Best: 142         │
  │                                     │
  │    🐍 crash image                   │
  │                                     │
  │      [ 🔄 Play Again ]             │
  │      [ 🏠 Home ]                    │
  └─────────────────────────────────────┘
  → Score always saved to history
  → Vibration on death (if enabled)

SETTINGS SCREEN:
  • Background Music toggle
  • Vibration toggle  
  • Rounded Edges toggle
  • Dark Theme (coming soon — disabled)
  • Reset to Default button

ABOUT SCREEN:
  • App info, GitHub link, Buy Me a Coffee
```

---

## Phase One Implementation Plan (Ordered)

| Step | Task | Effort |
|------|------|--------|
| 1 | Fix grid alignment — make `GAME_UNIT_SIZE`, snake size, food size all consistent (e.g. 15px) | Small |
| 2 | Fix food collision — use exact cell matching (`head.x === food.x && head.y === food.y`) | Small |
| 3 | Fix food spawn — pass snake body, avoid spawning on it | Small |
| 4 | Add swipe threshold (min 10px) to gesture handler | Small |
| 5 | Always save score on game over (remove the `if > highScore` check) | Tiny |
| 6 | Remove `" use dom"` from index.tsx | Tiny |
| 7 | Add 3-2-1-GO countdown overlay before game starts | Medium |
| 8 | Add pause overlay with Resume/Restart/Home buttons | Medium |
| 9 | Add "Go Home" button to game over modal | Small |
| 10 | Add grid lines to game board | Small |
| 11 | Add basic SFX (eat, die, combo, power-up) | Medium |
| 12 | Add confirm dialog before restart mid-game | Small |
| 13 | Check power-up expiration in the game loop instead of useEffect | Small |
| 14 | Add high score display + games played count to home screen | Small |
