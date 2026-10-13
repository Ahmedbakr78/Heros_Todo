# Release v2.1.0 — Wave 3: the max-out release

**Heros Todo v2.1.0** takes the panel studio to its maximum: **229 in-app feature cards** (220 documented rows in `FEATURES.md`), every one free, unlimited, offline, and panel-only.

## Highlights

| Area | What landed |
|---|---|
| Files | Folder-tree groups, 6 sorts, workspace pins + colors + filter, rename/duplicate/delete on real disk files |
| Read | In-file find with jump, regex search, read-aloud TTS, system theme, progress bar |
| Write | Auto-save drafts, dirty dot, live counts, wrap toggle, table + TOC generators, `Ctrl+Enter` task toggle |
| Time | 4-way due filters, Today modal, overdue red, priority badges |
| Trust | Named errors (no more `[object DOMException]`), ↻ re-pick recovery, per-file guards, quota-safe storage |

## Also in this release

- Rendered `- [ ]` checkboxes are truly clickable and sync to the real file line (both renderers, fenced-code-safe mapping).
- Feature directory with 8 category chips; palette grown to 40+ commands.
- Full repo packaging: website (`docs/`), issue/PR templates, CI, security/support/conduct docs.

## Install

1. Download `Heros_Todo-2.1.0.zip` below (or clone the repo).
2. `chrome://extensions` → Developer mode → **Load unpacked** → `todo-panel-extension/`.
3. Click the Heros Todo toolbar icon — it opens **only in the side panel**.

> Updating from 2.0.x? Press **Reload (↻)** on the extension card. Hub profile must read `v2.1.0`.

## Verify

```bash
node --check todo-panel-extension/app.js
node --check todo-panel-extension/background.js
```

- Manifest: MV3 `2.1.0`, permissions `sidePanel` + `storage` only.
- Checksum mindset: 229 cards in-app (press `F`), 220 rows in `FEATURES.md`.

## What's next

See [README roadmap](./README.md#roadmap) — Firefox port, optional local sync, plugin templates. Free forever (MIT).
