# Changelog — Heros Todo

All notable changes, newest first. Format follows Keep a Changelog. Versions are SemVer: patch = fixes, minor = features, major = breaking or manifest changes.

## [2.2.0] — 2026-10-13 — Read-aloud fix + honest gaps

### Fixed

- **Read aloud `synthesis-failed`:** the engine now sanitizes control/zero-width chars, retries once (first-utterance flake), then **auto-cycles to the next system voice** until one speaks — persisting the working voice. Exhausted voices end silently (console only, no error toast).
- **Read aloud silence (previous):** voice picker, delayed chunked start, sentence chunks with progress, no-voice watchdog.

### Fixed

- **Read aloud actually works now.** The old one-shot `speak()` went silent on systems without voices (common on Linux), on Chrome's cancel-then-speak drop, and on long text. The new engine: explicit voice picker (persisted), `resume()` + delayed start, ~320-char sentence chunks with x/y progress, watchdog that names the real problem (no OS voices → install speech-dispatcher + espeak-ng), PDF text and selections as sources.
- Rendered `- [ ]` wiring hardened further (both renderers, fence-safe mapping — shipped in 2.1.0 follow-up).

### Added (16 cards, 245 total)

- Voice select, speak-selection button, chunk progress, no-voice guidance, PDF read-aloud, live TTS speed.
- Click any heading → Markdown link on clipboard. One-tap file-path copy.
- Editor transforms: dedup, trim, quote toggle, UPPER/lower/Title cycle (insert bar + palette).
- Print selection (clean pop-up), present mode (`P`), fullscreen (`F11`).

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
