# GreenTruth Grid Farming/Life Sim Redesign

Goal: rebuild the current prototype into an original, grid-based farming/life sim inspired by classic farm RPG loops, keeping the GreenTruth eco theme. Do not copy copyrighted assets, code, dialogue, names, maps, music, or exact balance from Stardew Valley.

## Core Pillars

- Grid-first gameplay: all movement, targeting, farming, collision, and interactions use tile coordinates.
- Offline-first saves: localStorage always works; Supabase syncs authenticated users.
- Eco theme: crops, cleanup, restoration, pollution, recycling, renewable upgrades.
- Modular systems: game logic independent from Phaser rendering where possible.
- Data-driven content: crops, items, NPCs, quests, zones, prices, seasons in JSON/config.

## World Layout

- Farm: player house, crop plots, shipping bin, compost/recycling station.
- Town: shops, NPC homes, quest board.
- Forest: forage, trees, pollution cleanup encounters.
- Pond/River: fishing.
- Mine/Factory Ruins: mining, hazards, restoration tasks.
- Community Eco Center: upgrades, achievements, story quests.

## Grid Rules

- Tile size: 16 or 32 logical pixels.
- Player position: `{ mapId, x, y, facing }`.
- Movement: one tile per step, blocked by collision layer.
- Interact target: tile in front of player.
- Tile record: `{ terrain, object, crop, water, pollution, passable }`.
- Renderer reads grid state; systems mutate grid state.

## Game Systems

### State

- Single canonical `GameState.data` object.
- Versioned save format.
- Migrations run on load.
- Emits events after mutations.

### SaveService

- `load()` order: Supabase authenticated save → localStorage save → new game.
- `save()` order: localStorage immediate → Supabase async upsert.
- Queue dirty saves when offline.
- Track `lastSavedAt`, `lastSyncAt`, `syncStatus`.

### TimeSystem

- Day/time ticks.
- Seasons: spring/summer/fall/winter equivalent but original naming optional.
- Weather affects watering/growth/energy.
- Sleep advances day, restores energy, grows crops, processes shipping bin.

### FarmSystem

- Hoe soil.
- Plant seeds.
- Water crops.
- Crop growth by day.
- Harvest.
- Compost/fertilizer/eco upgrades.

### EconomySystem

- Shops sell seeds/tools/upgrades.
- Shipping bin sells overnight or instant MVP.
- Prices configurable.
- Pollution can affect crop quality/prices.

### NPCSystem

- NPC definitions: schedule, dialogue, likes, dislikes, friendship.
- Talk once per day bonus.
- Gift system.
- Quests unlocked by friendship/eco score.

### ActivitySystem

- Fishing minigame placeholder → chance-based MVP.
- Mining → stone/ore/materials.
- Foraging → berries/herbs/recyclables.
- Cleanup → reduces pollution, earns eco score.

### QuestSystem

- Story quests: restore town zones.
- Daily board quests.
- Rewards: coins, seeds, friendship, eco score.

### UI

- HUD: day, time, season, weather, energy, coins, selected tool.
- Inventory bar.
- Dialogue box.
- Shop menu.
- Save/sync indicator.

## Save Data Shape

```js
{
  version: 2,
  meta: { slot: 1, updatedAt, syncStatus },
  player: { mapId, x, y, facing, energy, maxEnergy },
  calendar: { day, minute, season, weather },
  wallet: { coins, ecoScore },
  inventory: { carrot_seed: 5, carrot: 0 },
  world: {
    pollution: 75,
    maps: {
      farm: { width, height, tiles: [] },
      town: { width, height, tiles: [] }
    }
  },
  npc: { mayor: { friendship, talkedToday, giftsToday } },
  quests: { active: [], complete: [] },
  stats: { shippedValue, cropsHarvested, trashCleaned }
}
```

## Supabase Design

- Auth required for cloud saves.
- Anonymous/local players use localStorage only.
- RLS protects saves by `auth.uid()`.
- Save conflicts resolved by newer `updated_at` initially.

Tables:

- `game_profiles`: one per user.
- `game_saves`: one row per user + slot.
- `game_leaderboard`: view from save summaries.

## Implementation Phases

1. Planning/schema/skeleton.
2. New save shape + migrations.
3. SaveService with localStorage fallback.
4. Grid player movement + interact targeting.
5. Farm grid renderer + farming actions.
6. World zones + collision/interactions.
7. Shop/shipping/economy.
8. NPC dialogue/friendship/gifts.
9. Activities: fishing/mining/forage/cleanup.
10. Supabase client integration + auth UI.
11. Polish, balancing, assets, sound.

## Controls MVP

- WASD/arrows: grid move.
- E/Space: interact target tile.
- Q: cycle tools.
- I: inventory.
- M: map.
- Z: sleep at bed.
- X: quick ship at bin.

## First Engineering Target

Create new system files without deleting current prototype:

- `src/game/services/SaveService.js`
- `src/game/services/SupabaseClient.js`
- `src/game/systems/GridSystem.js`
- `src/game/systems/TimeSystem.js`
- `src/game/systems/FarmSystem.js`
- `src/game/systems/EconomySystem.js`
- `src/game/systems/NPCSystem.js`
- `src/game/systems/ActivitySystem.js`
- `src/game/data/defaultSave.js`
