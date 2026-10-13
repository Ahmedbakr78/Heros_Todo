# Changelog — Heros Todo

All notable changes, newest first. Format follows Keep a Changelog. Versions are SemVer: patch = fixes, minor = features, major = breaking or manifest changes.

## [2.1.0] — 2026-10-13 — Wave 3: the max-out release

### Added (57 documented rows, 229 in-app cards)

- **Files:** collapsible folder-tree groups, 6 sort orders, workspace pins + colors + filter, rename/duplicate/delete with real disk ops, daily note, random note, reading progress bar.
- **Read:** in-file find with counts + jump, regex search mode, read-aloud TTS with speed, system-following theme (dark → light → system).
- **Write:** auto-save drafts + dirty dot + restore, word-wrap toggle, live edit counts, table generator, TOC inserter, `Ctrl+Enter` task toggle.
- **Time:** due filters (Anytime/Overdue/Today/Upcoming), Today modal, overdue red, priority badges.
- **Directory:** 8 category chips over the feature list, 40+ command palette.

### Fixed

- Rendered `- [ ]` checkboxes are now real and clickable (wired for both renderers, `disabled` removed); parser skips fenced code so click-mapping is exact.
- `[object DOMException]` is gone: named errors, ↻ re-pick recovery, per-file guards, quota-safe storage.

## [2.0.0] — 2026-10-13 — Power release

### Added

- Markdown (marked GFM), offline KaTeX math, lazy Mermaid diagrams, TEX/BIB viewers.
- In-panel PDF studio (pdf.js lazy pages, search, outline, merge via pdf-lib).
- Marker Studio, flashcards + quiz + Anki, stopwatch, pomodoro, counters, habits, goals.
- Builder lab (lint, summary, keywords, readability, diff, spell, templates, custom CSS).
- Command palette, 152-card feature directory, backup/restore v2.

## [1.0.0] — 2026-10-13 — First release

### Added

- Panel-only Markdown todo app: multi-workspaces, file list, task manager, workspace search, dark/light, backup/restore v1.
- Heros PDF design system (tokens, cards, pills, toasts, modal).
