# Snaki Backend Roadmap

**Stack:** Convex (real-time DB + server functions) · Clerk (auth) · Beamdrop (file/asset storage)

---

## Current State — All Local

All state lives in `AsyncStorage` via zustand — scores, achievements, daily challenges, skins, settings. This means:

- Switch phones → lose everything
- Uninstall → gone
- Daily challenges are seeded client-side → trivially cheatable
- Skin unlocks are gated by local `highScore` → just set it in AsyncStorage
- No way to track what players actually do

A backend with **Convex** (real-time DB + server functions), **Clerk** (auth), and **Beamdrop** (file/asset storage) changes the game entirely.

---

## Features a Backend Unlocks

### 🏆 Leaderboards

- **Global leaderboard** — all-time, weekly, daily, per-difficulty
- **Friends leaderboard** — see how you stack up against people you know
- **Around me** — show players ranked near you so there's always someone to chase
- Convex's real-time queries mean leaderboards update live as people play

### 👤 User Accounts & Profiles

- **Clerk auth** — Sign in with Apple, Google, or email. Persistent identity across devices
- **Player profiles** — display name, avatar, stats page (total games, total food eaten, best combo, time played)
- **Cross-device sync** — start on your phone, continue on a tablet, nothing is lost

### ☁️ Cloud Sync & Backup

- **All stores sync to Convex** — scores, achievements, challenges, skins, settings
- **Never lose progress** — reinstall, new device, doesn't matter, it's all on Convex
- **Conflict resolution** — merge local high score with server if you played offline

### 🔒 Anti-Cheat

- **Server-validated scores** — game over event submits the game replay to a Convex mutation, which validates the score progression is physically possible given your difficulty curve and speed settings
- **Server-side challenge tracking** — daily challenge progress updates go through Convex, not just local state
- **Legitimate skin unlocks** — Convex verifies you actually hit the required high score before unlocking a skin

### 👥 Social Features

- **Friends list** — add friends via Clerk user search
- **Push notifications** — "Your friend just scored 142! Can you beat it?"
- **Shareable score cards** — `react-native-view-shot` (already installed) generates an image, Beamdrop stores it, share the link
- **Deep links** — `snaki://challenge/abc123` opens the app to a specific challenge or score to beat

### 📊 Analytics & Game Balancing

- **Game session tracking** — every game sends: score reached, time played, death cause (wall/self/obstacle), foods eaten, power-ups collected, difficulty mode
- **Funnel analysis** — how many players complete onboarding? What difficulty do most pick? Where do people quit?
- **Balance tuning** — currently `DIFFICULTY_CURVES` and `OBSTACLE_THRESHOLDS` are hard-coded. With data on where people die most, you can iterate

### 🎨 Dynamic Content via Convex + Beamdrop

- **Server-driven skins** — add new skins to Convex, app pulls them on next launch. No app update needed
- **Server-driven challenge pool** — `CHALLENGE_POOL` lives in Convex, not hardcoded. Rotate seasonal challenges (e.g., "Halloween Special")
- **Server-driven achievements** — same idea, add new achievements without shipping an app update
- **Asset hosting** — Beamdrop stores skin color palettes, achievement badge images, seasonal backgrounds, audio variants

### 🔔 Server-Side Push Notifications

- **Streak reminders** — "You're on a 3-day streak! Don't break it!" (better than the current local-only notification)
- **Social pushes** — friend beat your high score, new skin unlocked, weekend tournament starting
- **Re-engagement** — "You haven't played in 3 days. Your daily challenges miss you."

### 🎮 Competitive / Multiplayer

- **Async races** — both players get the same seed (same food + obstacle layout). Race to a target score. Convex handles matchmaking and result comparison
- **Daily tournament** — everyone plays the same seeded board today. Global rankings reset at midnight
- **Challenge friends** — send a deep link, friend plays the exact same board, compare scores

### 📸 Shareable Replays

- **Replay data** — store the move sequence (direction changes + timestamps) in Convex (~tiny payload)
- **Replay viewer** — Beamdrop hosts a lightweight web replay viewer. Share your best run as a link someone can watch in a browser
- **Social sharing** — game over screen → generate score card image → Beamdrop stores it → share link

### 💰 Monetization Foundation

- **Virtual currency tied to XP** — Convex is the source of truth for currency, not local state
- **Premium skins** — cosmetic skins purchasable with in-game currency or real money
- **Ad reward tracking** — server validates ad-watch rewards (double XP, extra life) instead of trusting the client

---

## Build Phases

```
Phase 1 ─ Clerk Auth + Convex Sync + Global Leaderboard
Phase 2 ─ Anti-Cheat Validation + Server-Driven Challenges + Social Features
Phase 3 ─ Beamdrop Assets + Shareable Replays + Push Notifications + Analytics
```

### Phase 1 — Foundation

Clerk auth + Convex sync + global leaderboard. This is the foundation everything else builds on.

- Set up Clerk for sign-in (Apple, Google, email)
- Create Convex schema for users, scores, achievements
- Migrate zustand stores to sync with Convex (keep local-first, merge on connect)
- Build global leaderboard screen (all-time, weekly, daily, per-difficulty)
- Cross-device state sync

### Phase 2 — Anti-Cheat & Social

- Server-validated score submission (Convex mutation verifies game replay)
- Server-side daily challenge tracking (eliminate client manipulation)
- Legitimate skin unlock verification
- Friends list via Clerk user search
- Push notifications for social events (friend beat your score, etc.)
- Shareable score card generation (view-shot → Beamdrop storage → share link)
- Deep linking (`snaki://challenge/abc123`)

### Phase 3 — Dynamic Content & Growth

- Beamdrop for asset hosting (skins, badges, backgrounds, audio)
- Server-driven challenge pool and achievements (no app update needed)
- Shareable replays (move sequence stored in Convex, web viewer hosted on Beamdrop)
- Async multiplayer races (same seed, compare scores)
- Daily tournaments (global seeded board, midnight reset)
- Analytics dashboard (session tracking, death-cause heatmap, difficulty funnel)
- Game balance tuning from real data
- Monetization hooks (virtual currency, premium skins via Beamdrop-hosted assets)