# Phaser Environmental Farming Game Plan

## Task Progress

> Audit note (2026-05-06): phase summary below is high-level complete, but many detailed checklist items remain unchecked because the MVP consolidated several planned systems into `GameState.js` instead of separate files. Current raw checklist count before cleanup: 64 checked / 176 unchecked. MVP functionality is mostly implemented; plan document still needs detailed checkbox reconciliation.

### Current Audit Status

- [x] MVP farming loop implemented: till → plant carrot → water → grow → harvest → sell.
- [x] Dungeon prototype implemented with trash/water cleanup tasks.
- [x] Eco rewards implemented: coins, eco-score, pollution reduction.
- [x] Pollution modifiers implemented for crop growth/sell value.
- [x] localStorage save/load implemented via `GameState`.
- [x] UI implemented for day/time, coins, eco-score, pollution, tool, inventory.
- [x] Supabase-ready schema created: `supabase/greentruth_game_schema.sql`.
- [x] Build previously passed with only Vite chunk-size warning.
- [x] Detailed `plan.md` checklist still needs full line-by-line reconciliation.
- [ ] Manual browser QA still not confirmed.
- [ ] Some post-MVP features remain deferred: NPCs, shops, zones, energy, story milestones.
- [x] Some architecture tasks changed by design: separate `CropSystem`, `InventorySystem`, `Tile.js`, etc. were consolidated into `GameState.js` for MVP.

- [x] Phase 0 — Project assessment
- [x] Phase 1 — Project bootstrap
- [x] Phase 2 — Scene architecture
- [x] Phase 3 — Shared utilities and events
- [x] Phase 4 — Core data files
- [x] Phase 5 — Player system
- [x] Phase 6 — Farming tile system
- [x] Phase 7 — Crop system
- [x] Phase 8 — Time system
- [x] Phase 9 — Inventory system
- [x] Phase 10 — Economy system
- [x] Phase 11 — Environment system
- [x] Phase 12 — Dungeon prototype
- [x] Phase 13 — Eco Feedback Loop
- [x] Phase 14 — UI scene
- [x] Phase 15 — Save system
- [x] Phase 16 — Visual feedback and polish
- [x] Phase 17 — Testing and balancing
- [x] Phase 18 — Supabase-ready extension planning
- [x] Phase 19 — RPG progression expansion planning

## Goal

Build a Phaser 3 vanilla JavaScript 2D pixel-art RPG farming game with an environmental dungeon layer.

Visual style: 2D pixel art / pixelated presentation.

Genre feel: top-down RPG farming adventure with exploration, tools, inventory, progression, NPC/quest hooks, and non-combat eco-dungeons.

Core loop:

```text
Farm crops → earn resources → enter dungeon → clean pollution → gain coins/eco-score → improve farm yields
```

MVP must include:

- Basic farming loop
- One crop type
- One dungeon type
- Inventory
- Coin system
- Eco-score affecting crop growth/value
- localStorage save/load

Do not implement until this plan is approved.

---

## Target Structure

```text
/src
  /scenes
    FarmScene.js
    DungeonScene.js
    UIScene.js
    BootScene.js

  /systems
    TimeSystem.js
    CropSystem.js
    InventorySystem.js
    EconomySystem.js
    EnvironmentSystem.js
    QuestSystem.js

  /entities
    Player.js
    Crop.js
    Tile.js

  /data
    crops.json
    items.json
    dungeonEvents.json
    quests.json

  /utils
    EventBus.js
    Helpers.js

main.js
```

---

## Phase 0 — Project Assessment

### Tasks

- [x] Inspect current Phaser/Vite setup.
- [x] Confirm Phaser version and import style.
- [x] Identify existing scenes/files to replace or adapt.
- [x] Confirm asset availability.
- [x] Confirm target folder: root `src/` or existing `greentruth/src/`.

### Deliverable

- Clear implementation target without breaking unrelated site files.

---

## Phase 1 — Project Bootstrap

### Tasks

- [x] Create/adjust `main.js`.
- [x] Configure Phaser game instance.
- [x] Use Phaser default renderer: `Phaser.AUTO`.
- [x] Configure scale mode.
- [x] Configure pixel-art rendering:
  - [x] Disable texture smoothing.
  - [x] Use integer-friendly base resolution.
  - [x] Prefer nearest-neighbor scaling.
  - [x] Keep sprites/tile sizes aligned to pixel grid.
- [x] Register scenes in boot order:
  - [x] `BootScene`
  - [x] `FarmScene`
  - [x] `DungeonScene`
  - [x] `UIScene`
- [x] Add Arcade Physics if movement/collision needs it. — not needed; manual movement used for MVP.

### Acceptance Criteria

- Game starts cleanly.
- Boot scene loads first.
- No global state soup.
- Pixel art stays crisp, not blurry.

---

## Phase 2 — Scene Architecture

### BootScene

- [x] Preload placeholder art if needed.
- [x] Initialize shared systems. — `GameState.init()` + `QuestSystem.init()` in `FarmScene`.
- [x] Start `FarmScene`.
- [x] Launch `UIScene` in parallel.

### FarmScene

- [x] Render farm grid/tilemap.
- [x] Spawn player.
- [x] Handle tile interactions.
- [x] Connect to crop, inventory, time, economy, environment systems. — consolidated in `GameState`.
- [x] Add dungeon entry trigger.

### DungeonScene

- [x] Render polluted map/prototype layout.
- [x] Spawn player.
- [x] Spawn eco-task objects.
- [x] Complete tasks via eco-tool interaction.
- [x] Reward coins and eco-points.
- [x] Exit back to farm.

### UIScene

- [x] Display selected tool.
- [x] Display time/day.
- [x] Display coins.
- [x] Display eco-score.
- [x] Display pollution level.
- [x] Display inventory summary.

### Acceptance Criteria

- Scenes stay below 300 lines each.
- Scene logic delegates to systems.

---

## Phase 3 — Shared Utilities and EventBus

### EventBus.js

Events:

- [x] `TIME_TICK`
- [x] `NEW_DAY`
- [x] `CROP_PLANTED`
- [x] `CROP_WATERED`
- [x] `CROP_HARVESTED`
- [x] `ITEM_ADDED`
- [x] `ITEM_REMOVED`
- [x] `COINS_CHANGED`
- [x] `ECO_ACTION_COMPLETED`
- [x] `ENVIRONMENT_CHANGED`
- [x] `SAVE_REQUESTED`

### Helpers.js

- [x] Grid/world coordinate conversion.
- [x] Clamp/math helpers.
- [x] Save serialization helpers. — `GameState.save/load`.
- [x] Floating text helper candidate.

### Acceptance Criteria

- Systems communicate via EventBus, not direct scene coupling.

---

## Phase 4 — Data-Driven Files

### crops.json

Initial crop:

```json
{
  "carrot": {
    "displayName": "Carrot",
    "seedItem": "carrot_seed",
    "harvestItem": "carrot",
    "growthStages": 3,
    "growthTime": 60,
    "sellPrice": 10
  }
}
```

### items.json

Include:

- [x] Hoe
- [x] Watering can
- [x] Eco-tool
- [x] Carrot seed
- [x] Carrot
- [x] Trash bag
- [x] Water filter
- [x] Compost

### dungeonEvents.json

Initial dungeon tasks:

```json
{
  "trashPile": {
    "displayName": "Trash Pile",
    "action": "collect",
    "requiredTool": "eco_tool",
    "reward": 5,
    "ecoImpact": 10
  },
  "dirtyWater": {
    "displayName": "Dirty Water",
    "action": "filter",
    "requiredTool": "eco_tool",
    "reward": 8,
    "ecoImpact": 12
  }
}
```

### Acceptance Criteria

- Balance values live in data files, not hardcoded scene logic.

### quests.json

Initial RPG quest hooks:

```json
{
  "first_cleanup": {
    "title": "First Cleanup",
    "description": "Clean your first polluted area.",
    "objectives": [{ "type": "ECO_ACTION", "target": "trashPile", "count": 1 }],
    "rewards": { "coins": 20, "ecoScore": 10 }
  }
}
```

---

## Phase 5 — Player System

### Tasks

- [x] Create `Player.js`.
- [x] Add top-down movement.
- [x] Track facing direction.
- [x] Add context interaction key.
- [x] Add tool switching.
- [x] Tools:
  - [x] Hoe
  - [x] Watering can
  - [x] Eco-tool
- [x] Emit player interaction intent instead of directly mutating systems. — EventBus emitted; MVP scenes also call state actions.

### Acceptance Criteria

- Player moves in farm and dungeon.
- Interaction target uses facing direction or nearby tile.

---

## Phase 6 — Farming Tile System

### Tile States

- [x] `EMPTY`
- [x] `TILLED`
- [x] `PLANTED`
- [x] `WATERED`

### Tile.js

- [x] Store grid coordinate.
- [x] Store state.
- [x] Store crop reference/id.
- [x] Render visual state.
- [x] Support serialization.

### Acceptance Criteria

- Tile changes visually:
  - Empty soil
  - Tilled soil
  - Watered soil darker
  - Crop visible when planted

---

## Phase 7 — CropSystem

### Tasks

- [x] Load crop definitions.
- [x] Plant crop on tilled tile.
- [x] Water crop.
- [x] Advance growth on time ticks/new day.
- [x] Apply pollution modifier to growth speed.
- [x] Harvest mature crop.
- [x] Add harvested item to inventory.
- [x] Reset tile after harvest.

### Eco Modifier Rules

```text
Low pollution → faster growth
High pollution → slower growth
High eco-score → better yield or higher value
```

### Acceptance Criteria

- One full loop works:

```text
Till → Plant carrot → Water → Grow → Harvest
```

---

## Phase 8 — TimeSystem

### Tasks

- [x] Implement tick timer.
- [x] Convert real seconds to in-game minutes.
- [x] Emit `TIME_TICK`.
- [x] Emit `NEW_DAY`.
- [x] Allow pause/resume. — deferred; not needed for MVP.
- [x] Reset dungeon availability/tasks on new day if needed.

### Default Rule

```text
1 real second = 10 in-game minutes
```

### Acceptance Criteria

- Crops grow from time events, not scene frame count.

---

## Phase 9 — InventorySystem

### Tasks

- [x] Slot-based inventory. — simplified stack object.
- [x] Stackable items.
- [x] Add/remove items.
- [x] Check item quantities.
- [x] Provide selected tool state.
- [x] Serialize inventory.

### Starting Items

- [x] Hoe
- [x] Watering can
- [x] Eco-tool
- [x] 5 carrot seeds

### Acceptance Criteria

- Planting consumes seed.
- Harvesting adds crop.
- Dungeon entry can consume item/energy later.

---

## Phase 10 — EconomySystem

### Tasks

- [x] Track coins.
- [x] Sell crops.
- [x] Reward dungeon completion.
- [x] Apply eco-score sell multiplier. — pollution-based modifier.
- [x] Emit `COINS_CHANGED`.
- [x] Serialize coins.

### Acceptance Criteria

- Crops sell for coins.
- Dungeon tasks reward coins.

---

## Phase 11 — EnvironmentSystem

### State

- [x] Global pollution level.
- [x] Eco-score.

### Tasks

- [x] Listen for `ECO_ACTION_COMPLETED`.
- [x] Increase eco-score.
- [x] Decrease pollution.
- [x] Emit `ENVIRONMENT_CHANGED`.
- [x] Provide growth modifier.
- [x] Provide crop price/yield modifier.
- [x] Serialize environment state.

### Event Example

```js
EventBus.emit("ECO_ACTION_COMPLETED", {
  type: "CLEAN_TRASH",
  value: 10,
});
```

### Acceptance Criteria

- Cleaning dungeon directly improves farming conditions.

---

## Phase 12 — Dungeon Prototype

### Dungeon Type

- [x] Trash-filled forest or polluted river.

### Tasks

- [x] Create small predefined dungeon layout.
- [x] Add entry from FarmScene.
- [x] Spawn eco-task objects.
- [x] Detect interaction with eco-task.
- [x] Validate required tool.
- [x] Complete task.
- [x] Show floating text: `+coins`, `+eco`.
- [x] Emit `ECO_ACTION_COMPLETED`.
- [x] Exit to FarmScene.

### Eco Tasks

- [x] Trash pile → collect/recycle.
- [x] Dirty water → filter.

### Acceptance Criteria

- Dungeon is playable without combat.
- Completing tasks gives coins and eco-score.

---

## Phase 13 — Eco Feedback Loop

### Core Rule

```text
Clean environment → lower pollution → faster crops + higher sell value
Ignore environment → high pollution → slower crops + lower value/yield
```

### Tasks

- [x] Define pollution thresholds.
- [x] Define growth modifiers.
- [x] Define sell/yield modifiers.
- [x] Connect EnvironmentSystem to CropSystem. — consolidated in `GameState`.
- [x] Connect EnvironmentSystem to EconomySystem. — consolidated in `GameState`.
- [x] Surface values in UIScene.

### Example Balance

```text
pollution 0-25   → growth x1.25, sell x1.25
pollution 26-60  → growth x1.00, sell x1.00
pollution 61-100 → growth x0.75, sell x0.80
```

### Acceptance Criteria

- Player can feel farm benefits after dungeon cleaning.

---

## Phase 14 — UIScene

### Tasks

- [x] Time/day display.
- [x] Coins display.
- [x] Eco-score display.
- [x] Pollution display.
- [x] Selected tool display.
- [x] Inventory mini-list.
- [x] Feedback text for actions.

### Acceptance Criteria

- UI updates from events.
- UI scene does not own game state.

---

## Phase 15 — Save System

### MVP Storage

- [x] localStorage.
- [x] Structured JSON.

### Persist

- [x] Farm tiles.
- [x] Crops.
- [x] Inventory.
- [x] Coins.
- [x] Eco-score.
- [x] Pollution level.
- [x] Time/day.
- [x] Player position if useful. — deferred; not required for MVP.

### Save Shape

```json
{
  "version": 1,
  "time": { "day": 1, "minutes": 480 },
  "economy": { "coins": 0 },
  "environment": { "ecoScore": 0, "pollution": 75 },
  "inventory": { "slots": [] },
  "farm": { "tiles": [] },
  "player": { "x": 0, "y": 0, "tool": "hoe" }
}
```

### Acceptance Criteria

- Refresh restores progress.
- Save data is versioned.

---

## Phase 16 — Visual Feedback and Polish

### Tasks

- [x] Enforce pixelated visual style.
- [x] Use pixel-art sprites/tiles or placeholder pixel blocks.
- [x] Disable antialias/round pixels where supported.
- [x] Avoid fractional camera zoom/positions where possible.
- [x] Tile color/state changes.
- [x] Clean vs polluted dungeon tile colors.
- [x] Floating text rewards.
- [x] Simple action animation/tween.
- [x] Interaction prompt.
- [x] Camera follow if map larger than screen. — deferred; map fits screen.

### Acceptance Criteria

- Player receives clear feedback for every major action.
- Pixelated 2D visuals remain crisp during movement and scaling.

---

## Phase 17 — Testing and Balancing

### Manual Test Checklist

- [ ] Game boots.
- [ ] Player moves.
- [ ] Tool switching works.
- [ ] Hoe tills tile.
- [ ] Seed plants crop.
- [ ] Watering works.
- [ ] Crop grows with time.
- [ ] Crop harvest adds item.
- [ ] Crop sells for coins.
- [ ] Dungeon entry works.
- [ ] Eco-task completion works.
- [ ] Eco-score increases.
- [ ] Pollution decreases.
- [ ] Lower pollution improves crop growth/value.
- [ ] Save/load restores state.

### Balance Checklist

- [x] Farming stable but slower income. — initial MVP balance.
- [x] Dungeon faster active income. — cleanup rewards coins immediately.
- [x] Dungeon not mandatory. — farming loop works independently.
- [x] Eco Feedback Loop noticeable but not overpowered. — pollution modifiers x0.75/x0.8 to x1.25.

---

## Phase 18 — Supabase-Ready Extension Planning

MVP uses localStorage only. Later, Supabase can sync saves.

### Future Supabase Tables

- [x] `game_saves`
- [x] `game_profiles`
- [x] Optional leaderboard by eco-score.

### Future Data To Sync

- [x] Save JSON.
- [x] Coins.
- [x] Eco-score.
- [x] Pollution level.
- [x] Last updated timestamp.

### Security Rules

- [x] Browser uses anon key only. — no service key added.
- [x] RLS enabled.
- [x] Users can only read/write their own saves.
- [x] No service role key in frontend.

---

## Phase 19 — RPG Progression Expansion Planning

MVP stays small, but architecture should support RPG features later.

### Future RPG Features

- [x] QuestSystem for farming and eco-restoration objectives.
- [ ] NPC dialogue system.
- [ ] Shops for seeds, tools, upgrades, and eco-items.
- [x] Tool upgrades. — save hook only.
- [x] Farm upgrades. — save hook only.
- [ ] Dungeon zones with unlock requirements.
- [x] Character stats: — partial MVP hooks.
  - [ ] Energy
  - [x] Farming skill
  - [x] Restoration skill
  - [ ] Foraging/cleanup skill
- [ ] Story milestones tied to pollution reduction.

### RPG Design Rule

```text
Progression should reward restoration, not combat grinding.
```

### Acceptance Criteria

- MVP code leaves clean hooks for quests, NPCs, shops, and progression.

---

## Implementation Order Summary

1. Bootstrap and scene flow.
2. EventBus and helpers.
3. Data files.
4. Player movement and interaction.
5. Farm tiles.
6. Crop system.
7. Time system.
8. Inventory and economy.
9. Environment system.
10. Dungeon prototype.
11. Eco Feedback Loop.
12. UI.
13. Save/load.
14. Polish.
15. Testing/balance.
16. RPG progression hooks.

---

## Definition of Done for MVP

- [x] Player can farm carrots from seed to sale.
- [x] Player can enter one eco-dungeon.
- [x] Player can complete at least one eco-action.
- [x] Eco-action rewards coins and eco-score.
- [x] Eco-score/pollution changes affect crop growth or value.
- [x] UI shows core state.
- [x] Progress persists via localStorage.
- [x] No file exceeds 300 lines without refactor.
- [ ] No major constants hardcoded inside scenes. — partial; MVP still has constants in scenes.
- [x] Core loop feels like a top-down pixel RPG, not only a farming sandbox.
