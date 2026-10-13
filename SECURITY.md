# Security Policy — Heros Todo

## Design guarantees

- **100% local.** After install, the only network use is a URL *you* explicitly open (Open from URL). No servers, no analytics, no accounts, no telemetry.
- **Minimal permissions.** Only `sidePanel` (show the panel) and `storage` (prefs). No `<all_urls>`, no tabs, no scripting.
- **Safe rendering.** Markdown is rendered through an allowlist pipeline: raw HTML from notes is escaped, scripts/iframes/event handlers never reach the DOM.
- **User-gated file access.** Every folder/file touch goes through your picker, drag & drop, or a persisted handle you granted. Nothing is scanned silently.

## Reporting a vulnerability

**Do not open a public issue.** Instead:

1. Open a *private* report via GitHub Security Advisories on this repo, or
2. Contact the maintainer through the profile at <https://github.com/Ahmedbakr78> with `[HEROS-TODO-SECURITY]` in the subject and:
   - affected version (Hub profile line),
   - browser + OS,
   - steps to reproduce,
   - what an attacker could gain (data read? file write? spoof?).

You will get a first response within 7 days. Fixes ship as patch releases with a CHANGELOG entry crediting the reporter (unless anonymity is requested).

## Scope

In scope: the extension code in `todo-panel-extension/` (panel, background worker, vendored libs as configured). Out of scope: upstream vendor bugs (report those to marked/KaTeX/Mermaid/PDF.js projects; we will bump the vendored copy), and social-engineering a user into pasting malicious content (use Backup before opening untrusted notes).

## Supported versions

| Version | Supported |
|---|---|
| 2.1.x (current) | Yes |
| 2.0.x | Security fixes only |
| 1.x | No — please update |
