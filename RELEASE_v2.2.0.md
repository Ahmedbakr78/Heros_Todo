# Release v2.2.0 — Read-aloud fix + honest gaps

**Heros Todo v2.2.0** fixes the #1 complaint — the read-aloud button going silent — with a rebuilt speech engine, and closes every gap between the feature list and reality. **245 in-app cards**, all free, unlimited, offline, panel-only.

## Fixed: read aloud

| Old silence | New behavior |
|---|---|
| No OS voices (typical on Linux) → nothing, no message | Voice picker in the read bar + a watchdog that tells you exactly what to install |
| Chrome dropping cancel-then-speak pairs | `resume()` + delayed chunked start |
| Long notes stalling mid-way | ~320-char sentence chunks with `x / y` progress |
| PDFs and selections unreadable | Indexed PDF text and any selection are valid sources |
| Speed needing a restart | Rate slider applies live to upcoming chunks |

## Added (16 cards)

Voice select · speak selection · chunk progress · no-voice guidance · PDF read-aloud · live speed · heading-link copy · file-path copy · dedup / trim / quote / case-cycle transforms · print selection · present mode (`P`) · fullscreen (`F11`).

## Install / update

1. Download `Heros_Todo-2.2.0.zip` below (or pull the repo).
2. `chrome://extensions` → Developer mode → **Load unpacked** → `todo-panel-extension/`
   (updating? press **Reload ↻** — Hub must read `v2.2.0`).
3. Click the toolbar icon — panel only, no tabs.

## Verify

```bash
node --check todo-panel-extension/app.js
node --check todo-panel-extension/background.js
```

Manifest MV3 `2.2.0`, permissions `sidePanel` + `storage` only. Press `F` → 245 cards.
