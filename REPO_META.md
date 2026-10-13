# REPO_META — GitHub About, topics, website, release setup for Heros_Todo

Copy-paste source of truth. Nothing here is code; it configures the GitHub page.

## 1. Repository

| Field | Value |
|---|---|
| Owner | `Ahmedbakr78` |
| Name | `Heros_Todo` |
| URL | `https://github.com/Ahmedbakr78/Heros_Todo` |
| Visibility | Public |
| License | MIT (`LICENSE`) |
| Default branch | `main` |
| Website (Pages) | `https://ahmedbakr78.github.io/Heros_Todo/` |
| Extension folder | `todo-panel-extension/` (load unpacked) |

## 2. About box (GitHub Settings page: description + website)

**Description (paste exactly, no emojis, 1 line):**

```text
Heros Todo — fast, private, unlimited Markdown + PDF + LaTeX panel studio. Multi-workspaces, tasks, diagrams, study tools. Dark + Light, 100% local, free forever.
```

**Website (paste exactly):**

```text
https://ahmedbakr78.github.io/Heros_Todo/
```

Check: `Include in the home page` ON for the website.

## 3. Topics (paste, comma-separated — max 20)

```text
markdown, pdf-viewer, latex, todo, task-manager, side-panel, chrome-extension, manifest-v3, offline-first, privacy, flashcards, anki, pomodoro, habit-tracker, mermaid, katex, pdfjs, notes, study-tools, free
```

Apply via CLI:

```bash
gh repo edit Ahmedbakr78/Heros_Todo \
  --add-topic markdown --add-topic pdf-viewer --add-topic latex \
  --add-topic todo --add-topic task-manager --add-topic side-panel \
  --add-topic chrome-extension --add-topic manifest-v3 \
  --add-topic offline-first --add-topic privacy \
  --add-topic flashcards --add-topic anki --add-topic pomodoro \
  --add-topic habit-tracker --add-topic mermaid --add-topic katex \
  --add-topic pdfjs --add-topic notes --add-topic study-tools \
  --add-topic free
```

## 4. Website (GitHub Pages from `docs/`)

```bash
# Settings → Pages → Deploy from branch → main → /docs → Save
# Wait ~1 min → https://ahmedbakr78.github.io/Heros_Todo/
```

Local preview of the site:

```bash
cd Heros_Todo
python3 -m http.server 8000
# → http://localhost:8000/docs/
```

Pages config lives in `_config.yml` (minima, `docs/` site in `docs/index.html`).

## 5. Social preview + README badges

- Social image: `todo-panel-extension/icons/icon128.png` (upload under Settings → Social preview, 1280×640 recommended — any 128px+ PNG works).
- Badges used in README (shields.io, no keys needed).

## 6. Release setup (v2.1.0 and later)

```bash
# 1. version files must agree (CI checks this):
#    todo-panel-extension/manifest.json  ↔  CHANGELOG.md top  ↔  RELEASE_vX.Y.Z.md  ↔  git tag
git tag v2.1.0
git push origin v2.1.0

# 2. pack the extension (store-ready shape, no build step):
cd Heros_Todo
zip -r Heros_Todo-2.1.0.zip todo-panel-extension/ -x "*/vendor/cmaps/*"

# 3. publish (notes = RELEASE file body):
gh release create v2.1.0 Heros_Todo-2.1.0.zip \
  --title "v2.1.0 — Wave 3: the max-out release" \
  --notes-file RELEASE_v2.1.0.md

# 4. mark Latest, tick "Set as the latest release".
```

## 7. Branch protection (recommended)

- `main`: require PR + 1 approval, require CI (`ci.yml`) green, no direct pushes.
- Tags `v*`: restrict creation to maintainers.

## 8. Issue/PR plumbing (already in repo)

- `.github/ISSUE_TEMPLATE/bug_report.md`, `feature_request.md`
- `.github/PULL_REQUEST_TEMPLATE.md`
- `.github/workflows/ci.yml` — files exist, manifest valid + panel-only, version trio agrees, JS syntax, no emojis in docs.

## 9. First-day checklist

- [ ] Repo created + pushed (`main`).
- [ ] About description + website pasted, topics applied.
- [ ] Pages enabled (`main` → `/docs`), site opens.
- [ ] Social preview uploaded.
- [ ] Release v2.1.0 published with ZIP + notes, marked Latest.
- [ ] Pin the repo on the profile + link it from Heros_PDF / Heros_Markdown READMEs (optional, from those repos — not done here).
