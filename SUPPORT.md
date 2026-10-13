# Support — Heros Todo

Need help? Start here. The app is 100% local, so most issues are solved in 2 minutes.

## First checks (fixes 9 of 10 cases)

| Symptom | Fix |
|---|---|
| Panel shows an old version | `chrome://extensions` → press **Reload (↻)** on Heros Todo. Hub profile line must read `v2.1.0`. |
| `Could not read folder: NotFoundError…` | The saved folder link died (moved folder / revoked permission). Open **Spaces → ↻** on that workspace to re-pick it. |
| `Could not read folder: NotAllowedError…` | Click **Allow** when the browser asks, then re-pick via Spaces → ↻. |
| Local files won't open | Extension Details → enable **Allow access to file URLs** (needed only for `file://` auto-flows; picker and drag & drop always work). |
| A PDF shows "too large" | Files over 12 MB picked as loose files can't be stored — add their **folder** as a workspace instead (PDFs stream from disk, unlimited size). |
| Checkboxes `- [ ]` don't click | Reload the extension (old cached copy). In v2.1+ every rendered checkbox toggles the real file line. |
| Speech / read aloud missing | That browser has no speech engine — everything else still works. |
| Storage full warnings | Hub → Backup, then Reset; or keep big PDFs in folder workspaces (streamed, not stored). |

## Where to ask

- **Bugs:** open an issue with the template (`Bug report`) — include browser + version, extension version from Hub, and the exact status-bar message.
- **Ideas:** open a `Feature request` issue — one idea per issue.
- **Security problems:** do NOT open a public issue — see [SECURITY.md](./SECURITY.md).

## What to include in a bug report

1. Browser + OS (e.g. Chrome 131, Windows 11).
2. Heros Todo version (Hub → profile line).
3. Steps to reproduce (3–6 steps).
4. Expected vs actual behavior.
5. The exact toast / status-bar text (it carries the real error name since v2.0.1-hardening).
6. Workspace kind (folder / picked files / demo) and file type (md / pdf / tex / txt).

## Data safety

Back up before experimenting: **Hub → Backup** downloads one JSON file with prefs, workspaces, marks, cards, tasks, counters, habits and notes. **Restore** rebuilds everything on any machine. Uninstalling the extension wipes local data — export first.
