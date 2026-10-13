# Contributing — Heros Todo

Thanks for helping! The project is intentionally small and dependency-free — please keep it that way.

## Ground rules

1. **Never add a build step, framework, or network call.** Vanilla HTML/CSS/JS only. New vendors must be vendored under `todo-panel-extension/vendor/` with license + version noted in the PR.
2. **No new permissions** without opening an issue first (panel-only `sidePanel` + `storage` is the whole model).
3. **One logical change per PR**, with before/after screenshots or a short screen recording for UI changes.
4. **Mobile/panel parity** — every control must work at 360 px width, touch-sized (32 px+ targets).
5. **Silent boot & speed budget** — no startup animations; search capped (800/300), lists capped, PDF pages lazy, diagrams idle-time. If you add work, cap it or idle-schedule it.
6. **Privacy first** — no analytics, no external fetches except user-opened URLs. Sanitize anything rendered from note content.
7. **Tests** — run `node --check` on every JS file you touch and extend the pure-function checks (parse, counts, tags, dates, tables) when you change them.

## Workflow

```bash
git clone https://github.com/Ahmedbakr78/Heros_Todo.git
cd Heros_Todo
# chrome://extensions → Developer mode → Load unpacked → todo-panel-extension/
git checkout -b feat/my-thing
# …edit, test in the panel (dark + light, 360px width)…
node --check todo-panel-extension/app.js && node --check todo-panel-extension/background.js
git commit -m "feat: ..." && git push -u origin feat/my-thing
# open a PR with the template filled in
```

Commit style: `feat:`, `fix:`, `docs:`, `style:`, `perf:`, `chore:`.

## What gets merged fast

- Real bug fixes with a failing case + the fix.
- Speed wins with before/after render timings (see Hub render meter).
- Accessibility (labels, focus rings, keyboard paths, reduced-motion).
- Docs, diagrams, translations of templates.

## Release process (maintainers)

1. Bump `todo-panel-extension/manifest.json` + `CHANGELOG.md` + `RELEASE_vX.Y.Z.md` together (CI enforces this).
2. Reload unpacked, smoke-test: folder workspace, PDF, TEX math, diagram, backup/restore.
3. Tag `vX.Y.Z`, push, `gh release create` with the release notes file.
