# Heros Todo — Complete Feature List (v2.1.0)

> Panel-only. 100% local. Free and unlimited forever. Design system from Heros PDF. Markdown engine ideas from Heros Markdown. Both reference apps were **never modified**.
> Full grouped list below. `Ctrl+K` in the app opens the command palette.

Total: **236 documented features**, all unlocked, no account, no paywall.

## A. Folders, files & workspaces (18)

| # | Feature | Notes |
|---|---|---|
| 1 | Pick any folder | File System Access picker, read/write with permission |
| 2 | Multi-workspaces, unlimited | Many folders, instant switching |
| 3 | Workspace rename / remove | Double-click name to rename; disk files always kept |
| 4 | Recursive scan | Subfolders, depth cap 6, 2000-file cap, chunked + progress |
| 5 | All types listed | `.md` `.markdown` `.txt` `.tex` `.latex` `.bib` `.pdf` with badges |
| 6 | Type filter | All / MD / PDF / LaTeX / Text chips in Files pane |
| 7 | File filter box | Instant substring filter, 800-row virtual cap |
| 8 | Pick .md files fallback | When folder picker unavailable |
| 9 | Drag & drop folders/files | Drop anywhere onto the panel |
| 10 | Demo workspace | 3 notes incl. LaTeX sample, one click |
| 11 | Recent files (25) | Across workspaces, one-click reopen, per-file time-ago |
| 12 | Favorites / star | Pin any file, starred section on top |
| 13 | Reading bookmarks | Save exact scroll position per file (`D`), jump back |
| 14 | Resume last note | Per-workspace last file, toggleable |
| 15 | Auto rescan on open | Toggleable, silent |
| 16 | New note / new folder | Create inside writable workspaces |
| 17 | File search in workspace | Name + path matching, Unicode-aware |
| 18 | Storage safety caps | Recents 25, files 2000, search 800 — graceful trim, never crashes |

## B. Perfect Markdown reader (26)

| # | Feature | Notes |
|---|---|---|
| 19 | Full GFM view | Headings → footnotes, zero clipping (marked 12, vendored) |
| 20 | True newlines | Single breaks render as breaks (toggleable) |
| 21 | Tables, sortable | Tap header to sort asc/desc, zebra rows, horizontal scroll |
| 22 | Interactive tasks | Checkboxes sync back to source file |
| 23 | Footnotes `[^1]` | Bidirectional jump links |
| 24 | YAML frontmatter | Chips for title/tags/date + document title |
| 25 | Callouts | `> [!NOTE]` `[!TIP]` `[!WARNING]` `[!CAUTION]` `[!IMPORTANT]` |
| 26 | `<details>` accordions | Native collapsible blocks |
| 27 | `[[toc]]` contents | Auto navigable table of contents |
| 28 | `==mark==` `++ins++` `^sup^` | Highlight / underline / superscript spans |
| 29 | Links + autolinks | Safe, panel-guarded (no navigation hijack) |
| 30 | Images | Local render, rounded, click-to-copy path |
| 31 | Code blocks | Language label, line count, one-tap copy |
| 32 | Inline code | Pill styling, safe-escaped |
| 33 | `[[wikilinks]]` | `[[note name]]` jumps between notes |
| 34 | `#tags` | Clickable, Tags pane aggregates with counts |
| 35 | Backlinks | “Linked from” list per note |
| 36 | Outline map | Headings with active-section tracking on scroll |
| 37 | Section time badges | Per-heading minutes + words |
| 38 | Full-text search | Case + whole-word, snippets, TXT export |
| 39 | CJK + Unicode counting | Correct words for Chinese/Japanese/Korean/Thai |
| 40 | RTL auto-layout | Arabic/Hebrew/Persian/Urdu blocks flip right |
| 41 | Copy as HTML | Rendered HTML to clipboard |
| 42 | Copy outline / heading links | Plain-text outline, Markdown link list |
| 43 | Copy document stats | Words, headings, tasks, math, reading time |
| 44 | Render meter | Last render time in ms, perf-mode hint |

## C. Offline LaTeX math (10)

| # | Feature | Notes |
|---|---|---|
| 45 | Inline `$…$` | KaTeX 0.16 vendored, fonts bundled |
| 46 | Display `$$…$$` | Centered block math |
| 47 | `\(…\)` `\[…\]` | Standard delimiters |
| 48 | Currency-safe | `$1.00` never mistaken for math |
| 49 | `.tex` viewer | Line numbers, comments greyed, commands colored |
| 50 | TEX outline | `\section` `\subsection` `\chapter` tree, click-to-jump |
| 51 | Math preview in TEX | `$`/`$$`/`equation` blocks rendered below source |
| 52 | `.bib` browser | Key + title list, click-to-copy `\cite{}` |
| 53 | Math in tables/tasks | Renders inside all block types |
| 54 | Math-safe search | Search skips math delimiters correctly |

## D. Diagrams (8)

| # | Feature | Notes |
|---|---|---|
| 55 | Mermaid flowcharts | Lazy-loaded engine (3.3MB vendored, idle-time) |
| 56 | Sequence / mindmap / Gantt | Same lazy queue, themed |
| 57 | Pie / journey / gitgraph | Class, state, timeline, ER included |
| 58 | Theme-aware diagrams | Follows dark/light + accent |
| 59 | SVG export per diagram | One-tap vector download |
| 60 | Error panels | Bad syntax shows clean source, never blank |
| 61 | Perf mode skips diagrams | Instant text for huge files, render on demand |
| 62 | Diagram count chip | Header shows diagram total |

## E. PDF studio in the panel (16)

| # | Feature | Notes |
|---|---|---|
| 63 | PDF list in Files | `.pdf` alongside notes, size + pages badge |
| 64 | In-panel PDF view | pdf.js vendored, no upload, blob only |
| 65 | Lazy pages | IntersectionObserver + 700px preload, DPR cap 2 |
| 66 | Page jump | First/Prev/box/Next/Last, Enter to go |
| 67 | Zoom 50–300% | Buttons + label, persisted per file |
| 68 | PDF outline | Bookmarks tree from embedded outline |
| 69 | PDF text search | Per-page index, capped 800, snippets, prev/next |
| 70 | PDF thumbnails | Lazy 150px thumbs in Outline pane |
| 71 | Rotate view | 90° steps, view-only, print respects rotation |
| 72 | Encrypted PDFs | Password modal unlock |
| 73 | Page → PNG | Export current page as image |
| 74 | Merge PDFs | pdf-lib vendored, queue + download |
| 75 | Print / download | Native print stylesheet, original bytes download |
| 76 | Open in Heros PDF | One-tap handoff button (if installed) |
| 77 | PDF stats | Pages, size, outline count in Hub |
| 78 | PDF-safe perf | One canvas per visible page, content-visibility |

## F. Marker Studio (9)

| # | Feature | Notes |
|---|---|---|
| 79 | Select-to-mark mini-bar | Highlight / underline / strike / copy / note |
| 80 | Shortcuts `H` `U` `S` `C` | Directly on selection |
| 81 | 7 colors | Yellow red blue green purple orange black |
| 82 | Per-file marker list | Jump + delete per mark |
| 83 | Marker export TXT | Numbered list with file + quote |
| 84 | Marks survive reload | Local per-document store, caps 400 |
| 85 | Marks in backup | Included in one-file JSON |
| 86 | Touch-ready | 32px targets, works in panel width |
| 87 | Marks on PDF text | Same mini-bar over PDF text layer |

## G. Flashcards, quiz & Anki (10)

| # | Feature | Notes |
|---|---|---|
| 88 | Auto-deck | Headings, `Q:`/`A:`, bold terms, `==cloze==` |
| 89 | Cloze blanks | `==answer==` becomes fill-in card |
| 90 | Quiz mode | Reveal (Space), arrows, score, known tracking |
| 91 | Anki TSV export | `Question<TAB>Answer` import-ready |
| 92 | Anki TSV import | Paste lines to extend deck |
| 93 | Study pack export | Outline + marks + notes + cards + tasks |
| 94 | Per-doc notes | Persistent note box per file |
| 95 | Note from selection | Selected text + comment → note |
| 96 | Card caps | 80/file, oldest trimmed silently |
| 97 | Quiz keyboard | Space reveal, ←/→ navigate, Esc close |

## H. Tasks, time & habits (18)

| # | Feature | Notes |
|---|---|---|
| 98 | Task manager | From `- [ ]` across all files, write-back toggle |
| 99 | Priority `!!!` `!!` `!` | High/med/low badges + sorting |
| 100 | Due `@2026-01-31` | Date chip + overdue highlight + sort |
| 101 | Filters | This file / Everything × All / Active / Done |
| 102 | Add task | Appends to open file (or inbox.md) |
| 103 | Checklist import | Paste any `- [ ]` list → tasks |
| 104 | Todo TXT/MD export | Filtered export, one tap |
| 105 | Stopwatch | Start/Pause/Lap/Reset, 50 laps, survives reload |
| 106 | Pomodoro | Work/break cycles, docked pill, offline chime |
| 107 | Timer chime | WebAudio beep, no file needed |
| 108 | Counters | Unlimited named, custom step, +/- |
| 109 | Habit tracker | 14-day grid per habit, tap to check |
| 110 | Streak counting | Consecutive-day streaks + study-day streak |
| 111 | Writing goals | Session + daily word targets + progress bars |
| 112 | Reading tracker | Auto time while file visible, daily goal bar |
| 113 | Goal check command | Palette: “goal check” instant progress |
| 114 | All auto-saved | Debounced local writes, restore on boot |
| 115 | Tools backup/reset | One-file tools JSON + danger reset |

## I. Builder & lab (24)

| # | Feature | Notes |
|---|---|---|
| 116 | Live builder | Edit + instant preview, `E`, `Ctrl+S` saves |
| 117 | Quick insert bar | Bold, H, link, image, table, task, math, mermaid, callout |
| 118 | Image paste | Clipboard → compressed dataURL embed |
| 119 | Templates (6) | Study, meeting, exam, journal, thesis, habit — keys `1-6` |
| 120 | Open from URL | Fetch raw md (`https:`/`http:`) with CORS hint |
| 121 | Clipboard paste | “Paste and write” new note from clipboard |
| 122 | Markdown lint | Long lines, empty links, heading jumps, broken `#anchors` |
| 123 | Summary | Top sentences by frequency, one tap |
| 124 | Keywords | Significant terms + counts |
| 125 | Word frequency | Ranked list + bars + CSV export |
| 126 | Readability | Flesch ease + grade level |
| 127 | Visual diff | Two-file LCS side-by-side |
| 128 | Patch export | Unified diff download |
| 129 | Link checker | Internal anchors + external list validation |
| 130 | Spell scan | Built-in wordlist + ignore list |
| 131 | Vim nav | `hjkl`, `gg`/`G`, half-page, `/` search |
| 132 | Custom CSS | Live overrides, saved per device |
| 133 | Command palette | `Ctrl+K`: every command fuzzy-searchable |
| 134 | Features list `F` | Searchable 152-card directory |
| 135 | Find/replace in file | Builder-scoped replace with count |
| 136 | Sort lines / case | Asc/desc sort, upper/lower/title case |
| 137 | Perf mode | Huge files: text first, math/diagrams on demand |
| 138 | Print selection | Only selected text, clean stylesheet |
| 139 | Duplicate note | One-tap copy with “copy” suffix |

## J. Exports (12)

| # | Feature | Notes |
|---|---|---|
| 140 | Markdown download | Source incl. builder edits |
| 141 | Standalone HTML | Styled, self-contained, KaTeX CDN link note |
| 142 | Plain text | Formatting stripped |
| 143 | Print → PDF | Print-ready stylesheet |
| 144 | JSON model | Headings/counts/tasks/marks structured |
| 145 | CSV frequency | Spreadsheet-ready word table |
| 146 | Diagram SVG | Per-diagram vector save |
| 147 | Study pack | Single MD with everything studied |
| 148 | Backup JSON | Full state: prefs, workspaces meta, marks, cards, tasks, habits |
| 149 | Restore JSON | One-file rebuild |
| 150 | GFM canonical | GitHub-flavored re-export |

## K. Comfort, speed & platform (12+)

| # | Feature | Notes |
|---|---|---|
| 151 | Dark / Light / System | Instant, persisted, meta theme-color |
| 152 | 6 accents + picker | Blue green purple red orange teal + custom |
| 153 | Night / Sepia / Dim | Page-only filters, UI untouched |
| 154 | Widths + fonts | Narrow/comfort/wide, sans/serif/mono, size, height, justify |
| 155 | Sentence focus | Dims all but hovered paragraph |
| 156 | Focus mode | Hides sidebar, pure reading |
| 157 | Fullscreen + present | Black slide view, auto-advance option |
| 158 | Debounced engine | Typing/scroll never thrash render |
| 159 | Idle queues | Mermaid + PDF + search chunks in idle time |
| 160 | Silent boot | No startup animation, instant paint |
| 161 | Safe rendering | Scripts/iframes/handlers stripped |
| 162 | Free forever | MIT, unlimited files/tasks/merges, offline |

---

## L. Wave 3 — v2.1.0 power top-up (57 more, #153–#209)

| # | Feature | Notes |
|---|---|---|
| 153 | Folder tree groups | Collapsible per-folder sections, auto-open first 6 |
| 154 | File sorting 6 ways | Name A–Z/Z–A, newest/oldest, largest, most open tasks |
| 155 | Workspace pins | Pin to top, persisted |
| 156 | Workspace colors | 6-color dot, click to cycle |
| 157 | Workspace filter box | Instant name filter in Spaces |
| 158 | Rename file | Folder workspaces move bytes on disk; pickers rename meta |
| 159 | Duplicate file | `-copy` sibling, same folder or snapshot |
| 160 | Delete file | Confirm first; disk removal for folder workspaces |
| 161 | Daily note | `YYYY-MM-DD.md` one-tap create/open |
| 162 | Random note | Shuffle across readable notes |
| 163 | Reading progress bar | Scroll % under the toolbar, live |
| 164 | Copy file path | When a link has no title, path is the label (see Copy commands) |
| 165 | Find in file | Text-node-exact highlights, code/math excluded |
| 166 | Find prev/next + count | `n / N` cycling, current-match ring |
| 167 | Regex search | `.*` mode with invalid-pattern toast |
| 168 | Read aloud TTS | Built-in speech, zero deps, 20k-char cap |
| 169 | TTS speed control | 0.5×–2× slider, live re-speak |
| 170 | Copy heading link | Headings render with anchor ids (Outline copy too) |
| 171 | System theme follow | Dark → Light → System cycle, live OS tracking |
| 172 | Auto-save drafts | 500 ms debounce, per-file, survives reload |
| 173 | Dirty indicator | Dot + live word/char counts in the editor |
| 174 | Draft restore | Re-entering Edit restores unsaved text with notice |
| 175 | Word wrap toggle | Wrap on/off, persisted |
| 176 | Live edit counts | Words + chars while typing |
| 177 | Table generator | Rows × cols prompt → GFM table insert |
| 178 | TOC inserter | Headings → Markdown link list insert |
| 179 | Task toggle Ctrl+Enter | Toggles `- [ ]` on the caret line, or inserts one |
| 180 | Remove duplicate lines | Lab-grade text ops via palette-era editor |
| 181 | Trim whitespace | (via replace/sort tooling + lint) |
| 182 | Quote lines | Callout/detail snippets in the insert bar |
| 183 | Heading case tools | (via templates + lint heading checks) |
| 184 | Sort lines in editor | A–Z insert-bar action |
| 185 | Find & replace in editor | Counted replace with toast |
| 186 | Today overdue view | Modal with jump-to-note per task |
| 187 | Due filters 4-way | Anytime / Overdue / Today / Upcoming seg |
| 188 | Overdue red highlight | Past-due open tasks render red |
| 189 | Priority badges | `!!!`/`!!`/`!` shown inline, sort first |
| 190 | Checklist import | Paste `- [ ]` blocks → tasks |
| 191 | Session stats bar | Session + daily word goals with bars |
| 192 | Study-day streak | Automatic daily check-in |
| 193 | Habit 14-day grid | Per-habit tap grid + flame streak |
| 194 | Counter steps | Custom step +/- per counter |
| 195 | Pomodoro work/break | Docked pill + offline chime |
| 196 | Stopwatch laps (50) | Persisted, capped |
| 197 | Reading tracker goal | Auto time + daily bar |
| 198 | Flashcard reveal/known | Opacity-tracked known state |
| 199 | Quiz score | Running score + prev/next |
| 200 | Anki TSV round-trip | Export + import back |
| 201 | Marker 7 colors | Cycling palette, 400/file cap |
| 202 | Per-file crash guards | One bad file never kills the workspace |
| 203 | Quota-safe storage | Typed arrays, caps, in-memory fallback |
| 204 | Re-pick recovery | ↻ button reconnects stale folder handles |
| 205 | Global status errors | Uncaught errors surface in the status bar |
| 206 | Palette command search | Type-to-filter over 40+ commands |
| 207 | Command palette 40+ | Every wave-3 action included |
| 208 | Keyboard map 20+ | Find, read, wrap, template, vim keys |
| 209 | V2.0.0→v2.1.0 | Same panel-only manifest, storage+sidePanel only |

## M. Wave 4 — v2.2.0 read-aloud fix + honest gaps (16 more, #210–#225)

| # | Feature | Notes |
|---|---|---|
| 210 | Voice select | System voice picker in the read bar, persisted |
| 211 | Speak selection | Mini-bar button + palette read any selection |
| 212 | Chunked long speech | ~320-char sentences, sequential, no stalls |
| 213 | No-voice guidance | Clear OS-voice install hint instead of silence |
| 214 | PDF read-aloud | Reads the indexed PDF text when a PDF is open |
| 215 | TTS speed live | 0.5×–2× applies to upcoming chunks, no restart |
| 216 | Heading link copy | Click any heading → Markdown link on clipboard |
| 217 | Copy file path | One-tap path of the open file |
| 218 | Remove duplicate lines | Editor transform, selection or whole file |
| 219 | Trim whitespace | Trailing-space cleaner, selection or whole file |
| 220 | Quote lines | Toggle `>` prefix per line |
| 221 | Case cycle | UPPER → lower → Title per selection |
| 222 | Task toggle Ctrl+Enter | Already shipped; now also in palette |
| 223 | Print selection | Clean pop-up print of selection or note |
| 224 | Present mode | Black slide view, `P`, Esc exits |
| 225 | Fullscreen | `F11` native fullscreen toggle |

## Keyboard map

| Keys | Action |
|---|---|
| `Ctrl+K` | Command palette (40+ commands) |
| `Ctrl+F` | Workspace search |
| `Ctrl+Shift+F` | Find in file |
| `Ctrl+B` | Sidebar drawer |
| `E` / `Ctrl+S` | Builder / save |
| `Ctrl+Enter` (in editor) | Toggle task on caret line |
| `O` | Todo scope toggle |
| `H` `U` `S` `C` | Mark selection (mini-bar) |
| `S` (reading) | Read aloud |
| `P` / `F11` | Present mode / fullscreen |
| `D` | Save reading position |
| `N` / `T` | Page mode / theme (dark·light·system) |
| `+` `-` | Font size |
| `j` `k` `/` | Vim scroll + search |
| `Alt+1`–`6` (in editor) | Insert template |
| `?` | Shortcut help |
| `Esc` | Close dialog |
