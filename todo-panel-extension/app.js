'use strict';
/* ==========================================================================
   Heros Todo — panel-only markdown workspace app.
   Design system copied from Heros PDF (tokens, cards, pills, toasts, modal).
   100% local. Zero frameworks. Zero network.
   ========================================================================== */

const $ = (id) => document.getElementById(id);
const els = {};
['app','sidebar','sideBackdrop','wsSelect','wsDot','btnSidebar','btnOpen','btnRefresh',
 'btnSearchTop','btnEdit','btnNight','btnTheme','themeIcon','btnMenu',
 'fileFilter','fileBox','fileClear','fileList','filesEmpty','filesTitle','filesCount',
 'searchInput','searchBox','searchClear','swCase','swWhole','btnSearchExport',
 'searchMeta','searchCount','searchPrev','searchNext','searchResults','searchEmpty',
 'wsList','wsEmpty','btnAddWs','btnAddFiles',
 'todoScopeSeg','todoFilterSeg','todoInput','btnTodoAdd','todoList','todoEmpty','btnTodoClear','btnTodoExport','toolsSavedLbl',
 'profileAvatar','profileName','profileSub','btnProfileEdit',
 'stWs','stFiles','stTasks','stDone','pageModeSeg',
 'kvWords','kvRead','kvChars','btnCopyMd','btnExportMd','btnExportTxt',
 'accentPick','accentLbl','fontSize','fontSizeLbl','swResume','swAuto',
 'btnShortcuts','btnBackupAll','btnRestoreAll','btnResetAll',
 'mdWrap','empty','mdCrumb','mdTaskPill','mdTaskLbl','mdBody','mdEdit','mdEditWrap','btnEditTop','btnCopyTop','btnSaveMd','btnCancelEdit','saveHint',
 'btnEmptyOpen','btnEmptyFiles','btnEmptyDemo',
 'statusDot','statusText','sbFiles','sbTasks','sbWs','sbZoom',
 'sbRefresh','sbEdit','sbNight','sbTheme',
 'progress','progressBar','dropOverlay','toasts','menu','modalBackdrop','modal',
 'folderInput','mdFileInput','restoreInput','viewer'
].forEach(id => els[id] = $(id));
['typeRow','favList','favLabel','recentList','btnNewNote','btnNewFolder','outlineList','outlineEmpty','pdfThumbs','btnCopyOutline',
 'tagList','tagEmpty','tagCount','backList','backEmpty','swDigits','btnSwStart','btnSwLap','btnSwReset','swLaps',
 'pomWork','pomWorkLbl','pomBreak','pomBreakLbl','btnPomStart','btnPomStop','pomPhase','sbPom','sbPomLbl',
 'cntName','btnCntAdd','cntList','habitName','btnHabitAdd','habitList','btnCardsGen','btnQuizGo','btnAnkiExp','btnAnkiImp',
 'cardList','docNote','btnNoteSel','btnMarksExp','markList','goalSess','goalSessFill','goalDay','goalDayFill',
 'featBox','featFilter','featClear','featList','featCount','lineHeight','lineHeightLbl','widthSeg','fontSeg',
 'swJustify','swFocusSent','swBreaks','swPerf','customCss','btnCssApply','renderMeter',
 'btnLint','btnSummary','btnKeywords','btnReadability','btnDiff','btnLinkCheck','btnSpell','btnTemplates','btnFromUrl','btnPasteNew',
 'btnExpHtml','btnExpPdf','btnExpJson','btnExpCsv','btnStudyPack','btnMergePdf',
 'mdTypeBadge','mdMeter','btnPaletteTop','pdfBar','pdfFirst','pdfPrev','pdfPage','pdfTotal','pdfNext','pdfZoomOut','pdfZoomLbl','pdfZoomIn','pdfPng',
 'pdfPages','texWrap','texSrc','texMath','insertBar','selBar','selH','selU','selS','selCopy','selNote','ankiInput'
].forEach(id => els[id] = $(id));
['fileSort','btnGroup','btnRename','btnDupl','btnDelFile','wsFilter','wsBox','wsClear','swRegex',
 'todoDueSeg','btnToday','btnDaily','btnRandom','btnFindTop','btnReadTop',
 'findBar','findInput','findCount','findPrev','findNext','findClose',
 'readBar','ttsRate','btnTtsStop','readProgWrap','readProgFill',
 'dirtyDot','editCounts','btnWrap','btnTableGen','btnTocIns','featCats'
].forEach(id => els[id] = $(id));
['ttsVoice','ttsProg','selRead','btnPath'
].forEach(id => els[id] = $(id));

/* ---- v2 file-type helpers (md · pdf · tex · txt — unlimited, free) ---- */
function extOf(name) { const m = /\.([a-z0-9]+)$/i.exec(name || ''); return (m ? m[1] : '').toLowerCase(); }
function kindOf(name) {
  const e = extOf(name);
  if (e === 'pdf') return 'pdf';
  if (e === 'tex' || e === 'latex') return 'tex';
  if (e === 'bib') return 'bib';
  if (e === 'txt') return 'txt';
  return 'md';
}
function isSupportedFile(name) { return /^(md|markdown|txt|tex|latex|bib|pdf)$/i.test(extOf(name)); }
function badgeOf(kind) { return kind === 'pdf' ? 'PDF' : kind === 'tex' ? 'TEX' : kind === 'txt' ? 'TXT' : kind === 'bib' ? 'BIB' : 'MD'; }

const S = {
  theme: 'dark',
  accent: '#4c8dff',
  pageMode: 'off',
  fontSize: 14,
  resume: true,
  autoRescan: true,
  caseSensitive: false,
  wholeWord: false,
  workspaces: [],          // meta: {id,name,kind,createdAt,lastFilePath}
  activeWsId: null,
  files: [],               // active workspace FileEntry: {path,name,size,mtime,content,handle,fileObj}
  activePath: null,
  editing: false,
  todoScope: 'file',
  todoFilter: 'all',
  searchResults: [],
  searchIdx: -1,
  searchQuery: '',
  profileName: 'My Notes',
  zoom: 100,
  typeFilter: 'all',
  pdfZoom: 1, pdfPage: 1,
  lineHeight: 1.7, readWidth: 'comfort', readFont: 'sans',
  justify: false, focusSent: false, breaks: true, perfMode: false,
  customCss: '',
  recents: [], starred: [], bookmarks: {}, notes: {}, marks: {},
  cards: [], quizKnown: {},
  sw: { running: false, startedAt: 0, elapsed: 0, laps: [] },
  pom: { phase: 'idle', workMin: 25, breakMin: 5, until: 0, timer: 0 },
  counters: [], habits: {},
  sessionWords: 0, dayWords: {}, studyDays: {},
  spellIgnore: [],
  fileSort: 'name-asc', groupFolders: true, wsFilter: '', wsPins: [], wsColors: {},
  todoDue: 'any', searchRegex: false,
  editorWrap: true, drafts: {},
  featCat: 'all', ttsVoice: '',
};

/* ---------------- error naming (DOMExceptions often have empty .message) ---------------- */
function errName(e) {
  if (!e) return 'Unknown error';
  if (e && e.name) return e.name + (e.message ? ': ' + e.message : ' (no detail — usually a stale folder handle or revoked permission)');
  return String(e);
}
function namedError(name, message) {
  const ex = new Error(message);
  ex.name = name;
  return ex;
}
/* In-memory fallback when IDB writes fail (quota) — workspace still works this session */
const MEM_SNAPSHOTS = new Map();
function toU8(x) {
  if (!x) return null;
  try {
    if (x instanceof Uint8Array) return x;
    if (x instanceof ArrayBuffer) return new Uint8Array(x);
    if (Array.isArray(x)) return new Uint8Array(x);
    if (typeof x === 'object') {
      const v = Object.values(x);
      if (v.length && v.every(n => typeof n === 'number')) return new Uint8Array(v);
    }
  } catch (e) {}
  return null;
}

/* ---------------- IDB for directory + file handles ---------------- */
const IDB_NAME = 'heros-todo';
const IDB_STORE = 'handles';
function idbOpen() {
  return new Promise((res, rej) => {
    const r = indexedDB.open(IDB_NAME, 1);
    r.onupgradeneeded = () => {
      if (!r.result.objectStoreNames.contains(IDB_STORE)) r.result.createObjectStore(IDB_STORE);
    };
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}
async function idbSet(key, val) {
  try {
    const db = await idbOpen();
    return await new Promise((res) => {
      let done = false;
      try {
        const tx = db.transaction(IDB_STORE, 'readwrite');
        const rq = tx.objectStore(IDB_STORE).put(val, key);
        rq.onerror = () => { if (!done) { done = true; db.close(); res(false); } };
        tx.oncomplete = () => { if (!done) { done = true; db.close(); res(true); } };
        tx.onerror = () => { if (!done) { done = true; try { db.close(); } catch (e) {} res(false); } };
        tx.onabort = () => { if (!done) { done = true; try { db.close(); } catch (e) {} res(false); } };
      } catch (e) { try { db.close(); } catch (e2) {} res(false); }
    });
  } catch (e) {
    console.warn('[HerosTodo] idbSet failed:', (e && e.name) || e);
    return false;
  }
}
async function idbGet(key) {
  try {
    const db = await idbOpen();
    return await new Promise((res) => {
      try {
        const tx = db.transaction(IDB_STORE, 'readonly');
        const q = tx.objectStore(IDB_STORE).get(key);
        q.onsuccess = () => { try { db.close(); } catch (e) {} res(q.result); };
        q.onerror = () => { try { db.close(); } catch (e) {} res(undefined); };
      } catch (e) { try { db.close(); } catch (e2) {} res(undefined); }
    });
  } catch (e) {
    if (MEM_SNAPSHOTS.has(key)) return MEM_SNAPSHOTS.get(key);
    return undefined;
  }
}
async function idbDel(key) {
  MEM_SNAPSHOTS.delete(key);
  try {
    const db = await idbOpen();
    return await new Promise((res) => {
      try {
        const tx = db.transaction(IDB_STORE, 'readwrite');
        tx.objectStore(IDB_STORE).delete(key);
        tx.oncomplete = () => { try { db.close(); } catch (e) {} res(); };
        tx.onerror = () => { try { db.close(); } catch (e) {} res(); };
      } catch (e) { try { db.close(); } catch (e2) {} res(); }
    });
  } catch (e) { /* ignore */ }
}

/* ---------------- storage ---------------- */
const LS_KEY = 'heros-todo-state-v2';
async function persist() {
  const data = {
    theme: S.theme, accent: S.accent, pageMode: S.pageMode, fontSize: S.fontSize,
    resume: S.resume, autoRescan: S.autoRescan,
    workspaces: S.workspaces, activeWsId: S.activeWsId,
    profileName: S.profileName, zoom: S.zoom,
    lineHeight: S.lineHeight, readWidth: S.readWidth, readFont: S.readFont,
    justify: S.justify, focusSent: S.focusSent, breaks: S.breaks, perfMode: S.perfMode,
    customCss: S.customCss,
    recents: (S.recents || []).slice(0, 25), starred: S.starred || [],
    bookmarks: S.bookmarks || {}, notes: S.notes || {}, marks: S.marks || {},
    cards: (S.cards || []).slice(0, 80), quizKnown: S.quizKnown || {},
    sw: { running: false, elapsed: S.sw.elapsed || 0, laps: (S.sw.laps || []).slice(0, 50) },
    pom: { workMin: S.pom.workMin, breakMin: S.pom.breakMin },
    counters: (S.counters || []).slice(0, 60), habits: S.habits || {},
    dayWords: S.dayWords || {}, studyDays: S.studyDays || {}, spellIgnore: S.spellIgnore || [],
    fileSort: S.fileSort || 'name-asc', groupFolders: S.groupFolders !== false,
    wsPins: S.wsPins || [], wsColors: S.wsColors || {}, todoDue: S.todoDue || 'any',
    editorWrap: S.editorWrap !== false,
    drafts: Object.fromEntries(Object.entries(S.drafts || {}).slice(0, 20).filter(([, v]) => (v || '').length < 200000)),
    ttsVoice: S.ttsVoice || '',
  };
  try {
    if (chrome.storage && chrome.storage.local) await chrome.storage.local.set({ [LS_KEY]: data });
    else localStorage.setItem(LS_KEY, JSON.stringify(data));
  } catch (e) { try { localStorage.setItem(LS_KEY, JSON.stringify(data)); } catch (_) {} }
  // migrate old key once
  try {
    if (chrome.storage && chrome.storage.local) await chrome.storage.local.remove('heros-todo-state-v1');
    else localStorage.removeItem('heros-todo-state-v1');
  } catch (e) {}
}
async function restore() {
  let d = null;
  try {
    if (chrome.storage && chrome.storage.local) {
      const o = await chrome.storage.local.get([LS_KEY, 'heros-todo-state-v1']);
      d = o && (o[LS_KEY] || o['heros-todo-state-v1']);
    } else d = JSON.parse(localStorage.getItem(LS_KEY) || localStorage.getItem('heros-todo-state-v1') || 'null');
  } catch (e) {}
  if (!d) return;
  Object.assign(S, {
    theme: d.theme || 'dark', accent: d.accent || '#4c8dff',
    pageMode: d.pageMode || 'off', fontSize: d.fontSize || 14,
    resume: d.resume !== false, autoRescan: d.autoRescan !== false,
    workspaces: Array.isArray(d.workspaces) ? d.workspaces : [],
    activeWsId: d.activeWsId || null,
    profileName: d.profileName || 'My Notes', zoom: d.zoom || 100,
    lineHeight: d.lineHeight || 1.7, readWidth: d.readWidth || 'comfort', readFont: d.readFont || 'sans',
    justify: !!d.justify, focusSent: !!d.focusSent, breaks: d.breaks !== false, perfMode: !!d.perfMode,
    customCss: d.customCss || '',
    recents: Array.isArray(d.recents) ? d.recents : [], starred: Array.isArray(d.starred) ? d.starred : [],
    bookmarks: d.bookmarks || {}, notes: d.notes || {}, marks: d.marks || {},
    cards: Array.isArray(d.cards) ? d.cards : [], quizKnown: d.quizKnown || {},
    counters: Array.isArray(d.counters) ? d.counters : [], habits: d.habits || {},
    dayWords: d.dayWords || {}, studyDays: d.studyDays || {}, spellIgnore: Array.isArray(d.spellIgnore) ? d.spellIgnore : [],
    fileSort: d.fileSort || 'name-asc', groupFolders: d.groupFolders !== false,
    wsPins: Array.isArray(d.wsPins) ? d.wsPins : [], wsColors: d.wsColors || {},
    todoDue: d.todoDue || 'any', editorWrap: d.editorWrap !== false, drafts: d.drafts || {}, ttsVoice: d.ttsVoice || '',
  });
  if (d.sw) { S.sw.elapsed = d.sw.elapsed || 0; S.sw.laps = Array.isArray(d.sw.laps) ? d.sw.laps : []; }
  if (d.pom) { S.pom.workMin = d.pom.workMin || 25; S.pom.breakMin = d.pom.breakMin || 5; }
}

/* ---------------- ui helpers (same language as Heros PDF) ---------------- */
function toast(msg, kind) {
  const t = document.createElement('div');
  t.className = 'toast' + (kind ? ' ' + kind : '');
  const ic = kind === 'ok' ? 'i-check' : kind === 'err' ? 'i-x' : 'i-info';
  t.innerHTML = '<svg class="ic"><use href="#' + ic + '"/></svg><span></span>';
  t.querySelector('span').textContent = msg;
  els.toasts.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 300); }, 2600);
  while (els.toasts.children.length > 4) els.toasts.firstChild.remove();
}
function setStatus(msg, mode) {
  els.statusText.textContent = msg;
  els.statusDot.className = 'dot' + (mode === 'ok' ? ' ok' : mode === 'busy' ? ' busy' : '');
}
function progress(p) {
  if (p == null) { els.progress.classList.add('done'); els.progressBar.style.width = '0%'; return; }
  els.progress.classList.remove('done');
  els.progressBar.style.width = Math.round(p * 100) + '%';
  if (p >= 1) setTimeout(() => progress(null), 350);
}
function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function fmtSize(b) {
  if (b == null || isNaN(b)) return '—';
  if (b < 1024) return b + ' B';
  if (b < 1024 * 1024) return (b / 1024).toFixed(1) + ' KB';
  return (b / 1024 / 1024).toFixed(1) + ' MB';
}
function timeAgo(t) {
  if (!t) return '';
  const s = Math.floor((Date.now() - t) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return Math.floor(s / 60) + ' min ago';
  if (s < 86400) return Math.floor(s / 3600) + ' h ago';
  return Math.floor(s / 86400) + ' d ago';
}

/* ---------------- theme / accent / page mode / font ---------------- */
function applyTheme() {
  const eff = effTheme();
  document.documentElement.dataset.theme = eff;
  els.themeIcon.innerHTML = '<use href="#' + (S.theme === 'system' ? 'i-globe' : eff === 'dark' ? 'i-moon' : 'i-sun') + '"/>';
  document.querySelector('meta[name="theme-color"]').content = eff === 'dark' ? '#0f1115' : '#e9ecf1';
}
function applyAccent() {
  document.documentElement.style.setProperty('--accent', S.accent);
  const dark = effTheme() === 'dark';
  document.documentElement.style.setProperty('--accent-h', S.accent);
  document.documentElement.style.setProperty('--accent-soft', hexSoft(S.accent, dark ? .15 : .10));
  document.documentElement.style.setProperty('--accent-ring', hexSoft(S.accent, dark ? .4 : .28));
  els.accentPick.value = /^#[0-9a-fA-F]{6}$/.test(S.accent) ? S.accent : '#4c8dff';
  els.accentLbl.textContent = S.accent;
}
function hexSoft(hex, a) {
  const m = /^#([0-9a-fA-F]{6})$/.exec(hex || '');
  if (!m) return 'rgba(76,141,255,' + a + ')';
  const n = parseInt(m[1], 16);
  return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
}
function applyPageMode() {
  document.body.classList.toggle('night-pages', S.pageMode === 'night');
  document.body.classList.toggle('sepia-pages', S.pageMode === 'sepia');
  document.body.classList.toggle('dim-pages', S.pageMode === 'dim');
  els.pageModeSeg.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.pm === S.pageMode));
}
function applyFont() {
  els.mdBody.style.fontSize = S.fontSize + 'px';
  els.fontSize.value = S.fontSize;
  els.fontSizeLbl.textContent = S.fontSize;
  els.sbZoom.textContent = Math.round((S.fontSize / 14) * 100) + '%';
}
function toggleTheme() {
  S.theme = S.theme === 'dark' ? 'light' : S.theme === 'light' ? 'system' : 'dark';
  applyTheme(); applyAccent(); persist();
  toast('Theme: ' + S.theme);
}

/* ---------------- sidebar ---------------- */
function setPane(name) {
  document.querySelectorAll('.side-tab').forEach(b => b.classList.toggle('active', b.dataset.pane === name));
  document.querySelectorAll('.side-pane').forEach(p => p.classList.toggle('active', p.id === 'pane-' + name));
}
function setSidebar(open) {
  els.sidebar.classList.toggle('open', open);
  els.sideBackdrop.classList.toggle('show', open);
}

/* ---------------- workspaces ---------------- */
function uid() { return 'w' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
function activeWs() { return S.workspaces.find(w => w.id === S.activeWsId) || null; }

async function addDirWorkspace(dirHandle) {
  const name = dirHandle.name || 'Folder';
  const ws = { id: uid(), name, kind: 'dir', createdAt: Date.now(), lastFilePath: null };
  const ok = await idbSet('ws:' + ws.id, dirHandle);
  if (!ok) {
    MEM_SNAPSHOTS.set('ws:' + ws.id, dirHandle);
    toast('Storage limited — workspace kept for this session only', 'err');
  }
  S.workspaces.push(ws);
  S.activeWsId = ws.id;
  await persist();
  await loadActiveWorkspace();
  toast('Workspace added: ' + name, 'ok');
}
async function repickWorkspace(id) {
  const w = S.workspaces.find(x => x.id === id);
  if (!w) return;
  if (!window.showDirectoryPicker) { toast('Pick the folder again via Open (this browser has no folder re-picker)', 'err'); return; }
  try {
    const h = await window.showDirectoryPicker({ mode: 'readwrite' });
    const ok = await idbSet('ws:' + id, h);
    if (!ok) MEM_SNAPSHOTS.set('ws:' + id, h);
    w.needsRepick = false;
    S.activeWsId = id;
    await persist();
    await loadActiveWorkspace();
    toast('Folder re-connected: ' + (h.name || w.name), 'ok');
  } catch (e) {
    if (e && e.name === 'AbortError') return;
    toast('Re-pick failed: ' + errName(e), 'err');
  }
}
async function addFilesWorkspace(fileList) {
  const files = [];
  for (const f of fileList) {
    if (!isSupportedFile(f.name)) continue;
    const kind = kindOf(f.name);
    if (kind === 'pdf') {
      const buf = await f.arrayBuffer().catch(() => null);
      const u8 = buf ? new Uint8Array(buf) : null;
      const LIM = 12 * 1024 * 1024;
      files.push({ path: f.name, name: f.name, size: f.size, mtime: f.lastModified, kind: 'pdf', bytes: u8 && u8.length <= LIM ? u8 : null, tooBig: !!(u8 && u8.length > LIM) });
    } else {
      const big = f.size > 8 * 1024 * 1024;
      const content = await (big ? f.slice(0, 8 * 1024 * 1024).text().catch(() => '') : f.text().catch(() => ''));
      files.push({ path: f.name, name: f.name, size: f.size, mtime: f.lastModified, kind, content: big ? content + '\n\n…[truncated at 8MB]' : content });
    }
  }
  if (!files.length) { toast('No supported files (.md .pdf .tex .txt)', 'err'); return; }
  const big = files.filter(f => f.tooBig).length;
  const ws = { id: uid(), name: files.length === 1 ? files[0].name.replace(/\.[a-z0-9]+$/i, '') : files[0].name.split('/')[0] || 'Picked files', kind: 'files', createdAt: Date.now(), lastFilePath: files[0].path };
  const stored = await idbSet('ws:' + ws.id, files);
  if (!stored) {
    MEM_SNAPSHOTS.set('ws:' + ws.id, files);
    toast('Storage is full — workspace kept for this session only', 'err');
  }
  S.workspaces.push(ws);
  S.activeWsId = ws.id;
  await persist();
  await loadActiveWorkspace();
  toast(files.length + ' file(s) added' + (big ? ' — ' + big + ' PDF(s) over 12MB stream only via folder workspaces' : ''), big ? 'err' : 'ok');
}
function addDemoWorkspace() {
  const ws = { id: uid(), name: 'Demo notes', kind: 'demo', createdAt: Date.now(), lastFilePath: 'welcome.md' };
  S.workspaces.push(ws);
  S.activeWsId = ws.id;
  persist();
  loadActiveWorkspace();
}
function demoFiles() {
  return [
    { path: 'welcome.md', name: 'welcome.md', kind: 'md', size: 1200, mtime: Date.now(), content: '---\ntitle: Welcome\ntags: [todo, demo]\n---\n\n# Welcome to Heros Todo v2\n\nThis is a **panel-only** demo workspace. Same rounded design as Heros PDF, reading engine ideas from Heros Markdown.\n\n[[toc]]\n\n## What you can do\n\n- Pick any folder — every `.md` `.pdf` `.tex` `.txt` appears in **Files**\n- Add many folders — each becomes a **workspace**\n- [x] Check off tasks right inside your notes !!! @2026-01-20\n- [ ] Try Tags: #shopping #work and [[projects/website]]\n- [ ] Press `Ctrl+K` for commands, `F` for all 152 features\n\n> [!NOTE]\n> Everything is 100% local. Nothing is uploaded.\n\n> [!TIP]\n> Select any text and press `H` to highlight it.\n\n## Math & diagrams\n\nInline $E = mc^2$ and display:\n\n$$\\int_0^1 x^2\\,dx = \\frac{1}{3}$$\n\n```mermaid\nflowchart LR\n    A[Notes] --> B[Tasks]\n    B --> C[Done]\n```\n\n| Item | Qty |\n|---|---:|\n| Oats | 1 |\n| Beans | 2 |\n\nFootnote test[^1].\n\n[^1]: Demo footnote.\n\n```js\nconsole.log("fast and free");\n```\n' },
    { path: 'projects/website.md', name: 'website.md', kind: 'md', size: 500, mtime: Date.now(), content: '# Website relaunch #work\n\n## Tasks\n\n- [x] Draft homepage copy\n- [ ] Compress hero images !!\n- [ ] Fix mobile nav overlap ! @2026-02-01\n\nSee also [[projects/shopping]] and #launch.\n\n## Notes\n\nLaunch window is **Friday**. Budget $1.00 exactly — not math.\n' },
    { path: 'projects/shopping.md', name: 'shopping.md', kind: 'md', size: 300, mtime: Date.now(), content: '# Shopping #personal\n\n- [ ] Oat milk\n- [ ] Coffee beans\n- [x] Bread\n\n| Item | Qty |\n|---|---|\n| Oats | 1 |\n| Beans | 2 |\n' },
    { path: 'paper/sample.tex', name: 'sample.tex', kind: 'tex', size: 600, mtime: Date.now(), content: '% Sample LaTeX — offline preview\n\\section{Introduction}\nThis is a demo with inline math $a^2 + b^2 = c^2$.\n\n\\subsection{Method}\nDisplay math:\n$$E = mc^2$$\n\\begin{equation}\n\\int_0^\\infty e^{-x}\\,dx = 1\n\\end{equation}\n\n\\section{Results}\nSee Table~\\ref{tab:one}. % a comment\n' },
  ];
}

async function ensureDirPermission(handle, mode) {
  try {
    const q = await handle.queryPermission({ mode: mode || 'read' });
    if (q === 'granted') return true;
    const r = await handle.requestPermission({ mode: mode || 'read' });
    return r === 'granted';
  } catch (e) { return true; }
}

async function scanDirRecursive(dirHandle, prefix, out, depth) {
  if (depth > 6 || out.length > 2000) return;
  let entries = [];
  try { for await (const v of dirHandle.values()) entries.push(v); }
  catch (e) { throw e; }
  entries.sort((a, b) => a.name.localeCompare(b.name));
  for (const e of entries) {
    if (out.length > 2000) break;
    try {
      if (e.kind === 'file' && isSupportedFile(e.name)) {
        const kind = kindOf(e.name);
        const p = (prefix ? prefix + '/' : '') + e.name;
        if (kind === 'pdf') {
          // lazy: keep handle, read bytes only when opened (fast scan)
          out.push({ path: p, name: e.name, size: 0, mtime: 0, kind: 'pdf', handle: e });
        } else {
          const f = await e.getFile();
          const big = f.size > 8 * 1024 * 1024;
          const content = await (big ? f.slice(0, 8 * 1024 * 1024).text() : f.text());
          out.push({ path: p, name: e.name, size: f.size, mtime: f.lastModified, kind, content: big ? content + '\n\n…[truncated at 8MB — open the full file from disk for the rest]' : content, handle: e });
        }
      } else if (e.kind === 'directory') {
        await scanDirRecursive(e, (prefix ? prefix + '/' : '') + e.name, out, depth + 1);
      }
    } catch (err) { /* skip unreadable */ }
  }
}

async function loadActiveWorkspace() {
  const ws = activeWs();
  S.files = []; S.activePath = null; S.editing = false;
  renderWsSelect(); renderWsList();
  if (!ws) {
    els.mdWrap.hidden = true; els.empty.hidden = false;
    renderFileList(); renderTodo(); updateStats();
    setStatus('Ready'); els.sbWs.textContent = 'No workspace';
    return;
  }
  setStatus('Scanning…', 'busy'); progress(0.2);
  try {
    if (ws.kind === 'dir') {
      let handle = null;
      try {
        handle = await idbGet('ws:' + ws.id);
      } catch (e) {
        throw namedError('StorageError', 'local storage is unavailable (' + errName(e) + ').');
      }
      if (!handle || typeof handle.values !== 'function') {
        ws.needsRepick = true;
        throw namedError('HandleMissing', 'the saved folder link is gone (browser forgot it or it was revoked). Re-pick the folder via Spaces → ↻.');
      }
      let ok = false;
      try {
        ok = await ensureDirPermission(handle, 'read');
      } catch (e) {
        ws.needsRepick = true;
        throw namedError((e && e.name) || 'PermissionError', 'permission check failed. Re-pick the folder via Spaces → ↻.');
      }
      if (!ok) {
        ws.needsRepick = true;
        throw namedError('NotAllowedError', 'read permission was denied. Re-pick the folder via Spaces → ↻ and Allow access.');
      }
      const out = [];
      try {
        await scanDirRecursive(handle, '', out, 0);
      } catch (e) {
        if (e && (e.name === 'NotFoundError' || e.name === 'NotAllowedError' || e.name === 'SecurityError')) ws.needsRepick = true;
        throw e;
      }
      S.files = out;
      ws.needsRepick = false;
    } else if (ws.kind === 'files') {
      const stored = await idbGet('ws:' + ws.id);
      S.files = Array.isArray(stored) ? stored : [];
    } else if (ws.kind === 'demo') {
      S.files = demoFiles();
    }
    progress(0.8);
    // normalize kinds (v1 snapshots lack kind/content guards)
    S.files.forEach(f => { if (!f.kind) f.kind = kindOf(f.name); if (f.kind !== 'pdf' && f.content == null) f.content = ''; });
    // resume last file — one bad file must not abort the whole workspace
    let target = null;
    if (S.resume && ws.lastFilePath) target = S.files.find(f => f.path === ws.lastFilePath) || null;
    if (!target && S.files.length) target = S.files[0];
    if (target) {
      try {
        await openFile(target.path, true);
      } catch (e) {
        console.warn('[HerosTodo] auto-open failed for ' + target.path + ':', e);
        toast('Skipped unreadable file: ' + target.name + ' (' + errName(e) + ')', 'err');
        S.activePath = null;
        els.mdWrap.hidden = true; els.empty.hidden = false;
      }
    }
    else { els.mdWrap.hidden = true; els.empty.hidden = false; }
    setStatus('Ready', 'ok');
    const nMd = S.files.filter(f => f.kind === 'md').length;
    const nPdf = S.files.filter(f => f.kind === 'pdf').length;
    const nTex = S.files.filter(f => f.kind === 'tex' || f.kind === 'bib').length;
    toast(S.files.length + ' file(s)' + (nPdf || nTex ? ' — ' + nMd + ' md · ' + nPdf + ' pdf · ' + nTex + ' tex' : ''), 'ok');
  } catch (e) {
    console.warn('[HerosTodo] workspace load failed:', e);
    toast('Could not read folder: ' + errName(e), 'err');
    setStatus('Read failed — open Spaces to fix');
  }
  progress(null);
  renderFileList(); renderTodo(); renderWsList(); updateStats();
  els.sbWs.textContent = ws.name + (ws.needsRepick ? ' ⚠' : '');
  persist();
}

function renderWsSelect() {
  const sel = els.wsSelect;
  sel.innerHTML = '';
  if (!S.workspaces.length) {
    const o = document.createElement('option');
    o.textContent = 'No workspace';
    sel.appendChild(o);
    return;
  }
  for (const w of S.workspaces) {
    const o = document.createElement('option');
    o.value = w.id;
    const n = S.files.length && w.id === S.activeWsId ? ' (' + S.files.length + ')' : '';
    o.textContent = w.name + n;
    if (w.id === S.activeWsId) o.selected = true;
    sel.appendChild(o);
  }
}
function renderWsList() {
  const box = els.wsList;
  box.innerHTML = '';
  const q = (els.wsFilter && els.wsFilter.value || '').toLowerCase();
  if (els.wsBox) els.wsBox.classList.toggle('has', !!q);
  const pins = new Set(S.wsPins || []);
  const shown = S.workspaces
    .filter(w => !q || w.name.toLowerCase().includes(q))
    .sort((a, b) => ((pins.has(b.id) ? 1 : 0) - (pins.has(a.id) ? 1 : 0)) || b.createdAt - a.createdAt);
  els.wsEmpty.style.display = shown.length ? 'none' : '';
  for (const w of shown) {
    const count = w.id === S.activeWsId ? S.files.length : '…';
    const row = document.createElement('div');
    row.className = 'recent-item' + (w.id === S.activeWsId ? ' active' : '');
    row.innerHTML = '<button class="cdot" title="Workspace color (click to cycle)"></button>' +
      '<div class="ico"><svg class="ic ic-sm"><use href="#i-layers"/></svg></div>' +
      '<div class="meta"><div class="nm"></div><div class="sub"></div></div>' +
      '<span class="cnt"></span>' +
      '<button class="del pin-btn" title="Pin to top"><svg class="ic ic-sm"><use href="#i-star"/></svg></button>' +
      '<button class="del" title="Remove workspace"><svg class="ic ic-sm"><use href="#i-x"/></svg></button>';
    const dot = row.querySelector('.cdot');
    dot.style.background = wsColorOf(w.id);
    dot.addEventListener('click', (ev) => { ev.stopPropagation(); wsColorCycle(w.id); });
    const pinB = row.querySelector('.pin-btn');
    pinB.style.opacity = pins.has(w.id) ? '1' : '';
    pinB.style.color = pins.has(w.id) ? 'var(--accent)' : '';
    pinB.addEventListener('click', (ev) => { ev.stopPropagation(); wsPinToggle(w.id); });
    row.querySelector('.nm').textContent = w.name;
    row.querySelector('.sub').textContent = (w.needsRepick ? '⚠ needs re-pick · ' : '') + (w.kind === 'dir' ? 'Folder' : w.kind === 'files' ? 'Picked files' : 'Demo') + ' · ' + timeAgo(w.createdAt);
    if (w.kind === 'dir') {
      const rb = document.createElement('button');
      rb.className = 'del';
      rb.style.opacity = w.needsRepick ? '1' : '';
      rb.style.color = w.needsRepick ? 'var(--danger)' : '';
      rb.title = 'Re-pick folder (fixes lost permission)';
      rb.innerHTML = '<svg class="ic ic-sm"><use href="#i-refresh"/></svg>';
      rb.addEventListener('click', (ev) => { ev.stopPropagation(); repickWorkspace(w.id); });
      row.insertBefore(rb, row.querySelector('.del'));
    }
    row.querySelector('.cnt').textContent = count;
    row.addEventListener('click', async (e) => {
      if (e.target.closest('.del')) return;
      S.activeWsId = w.id;
      await persist();
      await loadActiveWorkspace();
      setSidebar(false);
    });
    row.querySelector('.del').addEventListener('click', async () => {
      if (!confirm('Remove workspace "' + w.name + '"? Files on disk are kept.')) return;
      S.workspaces = S.workspaces.filter(x => x.id !== w.id);
      await idbDel('ws:' + w.id);
      if (S.activeWsId === w.id) S.activeWsId = S.workspaces.length ? S.workspaces[0].id : null;
      await persist();
      await loadActiveWorkspace();
    });
    // rename on double click
    row.querySelector('.nm').addEventListener('dblclick', async (e) => {
      e.stopPropagation();
      const nn = prompt('Rename workspace', w.name);
      if (nn && nn.trim()) { w.name = nn.trim().slice(0, 60); await persist(); renderWsSelect(); renderWsList(); }
    });
    box.appendChild(row);
  }
}

/* ---------------- files ---------------- */
function fileKey(path) { const ws = activeWs(); return (ws ? ws.id : 'x') + '|' + path; }
function fileRow(f, star) {
  const kind = f.kind || kindOf(f.name);
  const tasks = kind === 'pdf' ? [] : parseTasks(f.content);
  const open = tasks.filter(t => !t.done).length;
  const row = document.createElement('div');
  const isStar = star.has(fileKey(f.path));
  row.className = 'recent-item' + (f.path === S.activePath ? ' active' : '') + (isStar ? ' starred' : '');
  row.innerHTML = '<div class="ico"><svg class="ic ic-sm"><use href="#i-file"/></svg></div>' +
    '<div class="meta"><div class="nm"></div><div class="sub"></div></div>' +
    '<span class="fbadge"></span><span class="cnt"></span>' +
    '<button class="del star-btn" title="Star / unstar"><svg class="ic ic-sm"><use href="#i-star"/></svg></button>';
  row.querySelector('.nm').textContent = f.name;
  row.querySelector('.sub').textContent = f.path + ' · ' + (f.size ? fmtSize(f.size) : kind.toUpperCase());
  const bd = row.querySelector('.fbadge');
  bd.textContent = badgeOf(kind); bd.classList.add(kind === 'md' ? 'md' : kind);
  row.querySelector('.cnt').textContent = tasks.length ? open + '/' + tasks.length : '';
  row.title = f.path;
  row.addEventListener('click', (e) => {
    if (e.target.closest('.star-btn')) return;
    openFile(f.path); setSidebar(false);
  });
  row.querySelector('.star-btn').addEventListener('click', () => {
    toggleStar(f.path);
  });
  return row;
}
function renderFileList() {
  const q = (els.fileFilter.value || '').toLowerCase();
  const box = els.fileList;
  box.innerHTML = '';
  if (!S.typeFilter) S.typeFilter = 'all';
  let list = S.files.filter(f => {
    const k = f.kind || kindOf(f.name);
    if (S.typeFilter === 'md' && !(k === 'md')) return false;
    if (S.typeFilter === 'pdf' && k !== 'pdf') return false;
    if (S.typeFilter === 'tex' && !(k === 'tex' || k === 'bib')) return false;
    if (S.typeFilter === 'txt' && !(k === 'txt')) return false;
    return !q || f.path.toLowerCase().includes(q) || f.name.toLowerCase().includes(q);
  });
  list = sortFiles(list);
  // starred on top (flat mode)
  const star = new Set(S.starred || []);
  els.filesEmpty.style.display = list.length ? 'none' : '';
  els.filesCount.textContent = S.files.length;
  els.filesTitle.textContent = activeWs() ? activeWs().name + ' — files' : 'Files';
  els.sbFiles.textContent = S.files.length;
  if (els.typeRow) els.typeRow.querySelectorAll('.type-chip').forEach(c => c.classList.toggle('on', c.dataset.type === S.typeFilter));
  if (els.fileSort) els.fileSort.value = S.fileSort || 'name-asc';
  if (els.btnGroup) els.btnGroup.classList.toggle('on', !!S.groupFolders);
  const flat = !S.groupFolders || q;
  const shown = flat
    ? list.slice().sort((a, b) => ((star.has(fileKey(b.path)) ? 1 : 0) - (star.has(fileKey(a.path)) ? 1 : 0)))
    : list;
  if (flat) {
    for (const f of shown.slice(0, 800)) box.appendChild(fileRow(f, star));
  } else {
    const groups = {};
    for (const f of shown) {
      const g = f.path.includes('/') ? f.path.slice(0, f.path.lastIndexOf('/')) : '(top level)';
      (groups[g] = groups[g] || []).push(f);
    }
    Object.keys(groups).sort().forEach((g, gi) => {
      const det = document.createElement('details');
      det.className = 'grp';
      det.open = gi < 6;
      const sm = document.createElement('summary');
      sm.innerHTML = '<span></span><span class="cnt"></span>';
      sm.querySelector('span').textContent = g;
      sm.querySelector('.cnt').textContent = groups[g].length;
      det.appendChild(sm);
      const wrap = document.createElement('div');
      wrap.className = 'grp-items';
      groups[g].slice(0, 300).forEach(f => wrap.appendChild(fileRow(f, star)));
      det.appendChild(wrap);
      box.appendChild(det);
    });
  }
  if (list.length > 800) {
    const d = document.createElement('div');
    d.className = 'placeholder';
    d.textContent = '+' + (list.length - 800) + ' more — refine the filter';
    box.appendChild(d);
  }
  renderFavList(); renderRecentList();
  renderWsSelect();
}
function toggleStar(path) {
  const k = fileKey(path);
  S.starred = S.starred || [];
  const i = S.starred.indexOf(k);
  if (i >= 0) S.starred.splice(i, 1); else S.starred.push(k);
  persist(); renderFileList();
}
function renderFavList() {
  if (!els.favList) return;
  const star = new Set(S.starred || []);
  const favs = S.files.filter(f => star.has(fileKey(f.path)));
  els.favList.innerHTML = '';
  if (els.favLabel) els.favLabel.hidden = !favs.length;
  for (const f of favs.slice(0, 20)) {
    const row = document.createElement('div');
    row.className = 'recent-item' + (f.path === S.activePath ? ' active' : '');
    row.innerHTML = '<div class="ico"><svg class="ic ic-sm"><use href="#i-star"/></svg></div><div class="meta"><div class="nm"></div><div class="sub"></div></div>';
    row.querySelector('.nm').textContent = f.name;
    row.querySelector('.sub').textContent = f.path;
    row.addEventListener('click', () => { openFile(f.path); setSidebar(false); });
    els.favList.appendChild(row);
  }
}
function pushRecent(path) {
  S.recents = S.recents || [];
  const ws = activeWs();
  const f = getFile(path);
  S.recents = [{ wsId: ws ? ws.id : null, wsName: ws ? ws.name : '', path, name: f ? f.name : path, at: Date.now() }]
    .concat(S.recents.filter(r => !(r.wsId === (ws ? ws.id : null) && r.path === path))).slice(0, 25);
  persist();
}
function renderRecentList() {
  if (!els.recentList) return;
  els.recentList.innerHTML = '';
  for (const r of (S.recents || []).slice(0, 8)) {
    const row = document.createElement('div');
    row.className = 'recent-item';
    row.innerHTML = '<div class="ico"><svg class="ic ic-sm"><use href="#i-history"/></svg></div><div class="meta"><div class="nm"></div><div class="sub"></div></div>';
    row.querySelector('.nm').textContent = r.name;
    row.querySelector('.sub').textContent = (r.wsName || '') + ' · ' + timeAgo(r.at);
    row.addEventListener('click', async () => {
      if (r.wsId && r.wsId !== S.activeWsId && S.workspaces.some(w => w.id === r.wsId)) {
        S.activeWsId = r.wsId; await persist(); await loadActiveWorkspace();
      }
      if (getFile(r.path)) openFile(r.path);
      else toast('File no longer in workspace', 'err');
    });
    els.recentList.appendChild(row);
  }
  if (!(S.recents || []).length) els.recentList.innerHTML = '<div class="placeholder" style="padding:10px">No recents yet</div>';
}

function getFile(path) { return S.files.find(f => f.path === path) || null; }

async function openFile(path, silent) {
  const f = getFile(path);
  if (!f) return;
  if (!f.kind) f.kind = kindOf(f.name);
  S.activePath = path;
  S.editing = false;
  S.pdfPage = 1;
  const ws = activeWs();
  if (ws) { ws.lastFilePath = path; persist(); }
  pushRecent(path);
  if (els.docNote) els.docNote.value = (S.notes || {})[fileKey(path)] || '';
  renderFileList();
  try {
    await renderMd();
  } catch (e) {
    console.warn('[HerosTodo] render failed for ' + path + ':', e);
    toast('Could not open ' + f.name + ' (' + errName(e) + ')', 'err');
    els.mdWrap.hidden = false; els.empty.hidden = true;
    els.mdBody.hidden = false; els.mdEditWrap.hidden = true;
    if (els.texWrap) els.texWrap.hidden = true;
    if (els.pdfPages) els.pdfPages.hidden = true;
    if (els.pdfBar) els.pdfBar.hidden = true;
    if (els.mdTypeBadge) { els.mdTypeBadge.textContent = badgeOf(f.kind || kindOf(f.name)); }
    els.mdCrumb.innerHTML = '<b>' + esc((activeWs() || {}).name || '') + '</b> · ' + esc(f.path);
    els.mdBody.innerHTML = '<div class="placeholder">Could not open this file<br><span class="meter">' + esc(errName(e)) + '</span><br><br>Try re-picking the folder in Spaces → ↻, or re-adding the file.</div>';
    if (els.mdTaskPill) els.mdTaskPill.hidden = true;
  }
  renderTodo(); renderOutline(); renderTags(); renderBacklinks(); renderMarkList(); updateStats(); updateGoals();
  if (!silent && els.viewer) els.viewer.scrollTop = 0;
  const bm = !silent && (S.bookmarks || {})[fileKey(path)];
  if (bm && els.viewer) setTimeout(() => { els.viewer.scrollTop = bm; }, 80);
}

/* ---------------- markdown parser (local, safe) ---------------- */
function mdToHtml(src, query) {
  const lines = String(src == null ? '' : src).split('\n');
  let html = '';
  let i = 0;
  let inCode = false, codeLang = '', codeBuf = [];
  let listStack = []; // {type, indent}
  const inline = (t) => inlineFmt(t, query);

  function closeLists(toIndent) {
    while (listStack.length && listStack[listStack.length - 1].indent >= toIndent) {
      const l = listStack.pop();
      html += l.type === 'ul' ? '</ul>' : '</ol>';
    }
  }
  function pushList(type, indent) {
    html += type === 'ul' ? '<ul>' : '<ol>';
    listStack.push({ type, indent });
  }

  while (i < lines.length) {
    const line = lines[i];
    // fenced code
    const fence = line.match(/^```(\w*)\s*$/);
    if (fence) {
      if (!inCode) { inCode = true; codeLang = fence[1] || ''; codeBuf = []; }
      else { inCode = false; html += '<pre><code>' + esc(codeBuf.join('\n')) + '</code></pre>'; codeBuf = []; }
      i++; continue;
    }
    if (inCode) { codeBuf.push(line); i++; continue; }
    if (/^\s*$/.test(line)) { closeLists(9999); i++; continue; }
    let m;
    if ((m = line.match(/^(#{1,4})\s+(.*)$/))) {
      closeLists(9999);
      const lvl = m[1].length;
      html += '<h' + lvl + '>' + inline(m[2]) + '</h' + lvl + '>';
      i++; continue;
    }
    if (/^(\*\*\*|---|___)\s*$/.test(line.trim())) { closeLists(9999); html += '<hr>'; i++; continue; }
    if ((m = line.match(/^>\s?(.*)$/))) {
      closeLists(9999);
      const buf = [];
      while (i < lines.length) {
        const qm = lines[i].match(/^>\s?(.*)$/);
        if (!qm) break;
        buf.push(qm[1]); i++;
      }
      html += '<blockquote>' + buf.map(t => '<p>' + inline(t) + '</p>').join('') + '</blockquote>';
      continue;
    }
    if ((m = line.match(/^(\s*)(\|.*\|\s*)$/)) && i + 1 < lines.length && /^\s*\|?[\s:\-|]+\|?\s*$/.test(lines[i + 1])) {
      closeLists(9999);
      const head = splitRow(m[2]);
      i += 2;
      const rows = [];
      while (i < lines.length && /^\s*\|.*\|\s*$/.test(lines[i])) { rows.push(splitRow(lines[i])); i++; }
      html += '<table><thead><tr>' + head.map(c => '<th>' + inline(c) + '</th>').join('') + '</tr></thead><tbody>' +
        rows.map(r => '<tr>' + r.map(c => '<td>' + inline(c) + '</td>').join('') + '</tr>').join('') + '</tbody></table>';
      continue;
    }
    // task list / list
    if ((m = line.match(/^(\s*)([-*+]|\d+[.)])\s+\[([ xX])\]\s+(.*)$/))) {
      const indent = m[1].length;
      closeLists(indent + 1);
      if (!listStack.length || listStack[listStack.length - 1].indent < indent) pushList('ul', indent);
      const done = m[3].toLowerCase() === 'x';
      html += '<li class="task' + (done ? ' done' : '') + '" data-task="' + esc(m[4]) + '">' +
        '<input type="checkbox" data-taskbox ' + (done ? 'checked' : '') + '>' +
        '<span class="t">' + inline(m[4]) + '</span></li>';
      i++; continue;
    }
    if ((m = line.match(/^(\s*)([-*+])\s+(.*)$/))) {
      const indent = m[1].length;
      closeLists(indent + 1);
      if (!listStack.length || listStack[listStack.length - 1].indent !== indent || listStack[listStack.length - 1].type !== 'ul') {
        if (!listStack.length || listStack[listStack.length - 1].indent < indent) pushList('ul', indent);
      }
      html += '<li>' + inline(m[3]) + '</li>';
      i++; continue;
    }
    if ((m = line.match(/^(\s*)(\d+)[.)]\s+(.*)$/))) {
      const indent = m[1].length;
      closeLists(indent + 1);
      if (!listStack.length || listStack[listStack.length - 1].indent < indent) pushList('ol', indent);
      html += '<li>' + inline(m[3]) + '</li>';
      i++; continue;
    }
    closeLists(9999);
    // paragraph (merge following non-blank non-special lines)
    const buf = [line];
    i++;
    while (i < lines.length && !/^\s*$/.test(lines[i]) && !/^(#{1,4}\s|```|>|\s*([-*+]|\d+[.)])\s|\s*\|.*\|\s*$)/.test(lines[i]) && !/^(\*\*\*|---|___)\s*$/.test(lines[i].trim())) {
      buf.push(lines[i]); i++;
    }
    html += '<p>' + inline(buf.join(' ')) + '</p>';
  }
  closeLists(-1);
  if (inCode) html += '<pre><code>' + esc(codeBuf.join('\n')) + '</code></pre>';
  return html;
}
function splitRow(line) {
  return line.trim().replace(/^\||\|$/g, '').split('|').map(c => c.trim());
}
function inlineFmt(t, query) {
  let s = esc(t);
  s = s.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<em>$1</em>');
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="#" data-link="$2">$1</a>');
  s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
  s = s.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');
  s = s.replace(/__([^_]+)__/g, '<b>$1</b>');
  s = s.replace(/(^|\W)\*([^*\n]+)\*/g, '$1<i>$2</i>');
  s = s.replace(/(^|\W)_([^_\n]+)_/g, '$1<i>$2</i>');
  s = s.replace(/~~([^~]+)~~/g, '<s>$1</s>');
  if (query) {
    try {
      const flags = S.caseSensitive ? 'g' : 'gi';
      let pat = esc(query);
      if (S.wholeWord) pat = '\\b' + pat.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b';
      else pat = pat.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const re = new RegExp('(' + pat + ')', flags);
      s = s.replace(re, '<mark class="hl">$1</mark>');
    } catch (e) {}
  }
  return s;
}

/* ---------------- tasks ---------------- */
function parseTasks(content) {
  const out = [];
  const lines = String(content || '').split('\n');
  let inFence = false;
  lines.forEach((ln, idx) => {
    // skip fenced code blocks — the renderer doesn't make tasks out of them either,
    // so skipping keeps click-mapping (checkbox N ↔ task N) exact
    if (/^\s*(```|~~~)/.test(ln)) { inFence = !inFence; return; }
    if (inFence) return;
    const m = ln.match(/^\s*[-*+]\s+\[([ xX])\]\s+(.*)$/);
    if (!m) return;
    let text = m[2].trim();
    let due = null;
    const dm = text.match(/@(\d{4}-\d{2}-\d{2})/);
    if (dm) { due = dm[1]; text = text.replace(/\s*@\d{4}-\d{2}-\d{2}\s*/, ' ').trim(); }
    let prio = 0;
    const pm = text.match(/(!!!|!!|!)\s*$/);
    if (pm) { prio = pm[1].length; text = text.replace(/\s*(!!!|!!|!)\s*$/, '').trim(); }
    out.push({ line: idx, done: m[1].toLowerCase() === 'x', text, prio, due });
  });
  return out;
}
function allTasks() {
  const out = [];
  for (const f of S.files) {
    if ((f.kind || kindOf(f.name)) === 'pdf' || f.content == null) continue;
    for (const t of parseTasks(f.content)) out.push({ ...t, path: f.path, name: f.name });
  }
  // sort: open first, prio desc, due asc
  out.sort((a, b) => (a.done - b.done) || (b.prio - a.prio) || String(a.due || 'zzz').localeCompare(String(b.due || 'zzz')));
  return out;
}
function setTaskDone(path, lineIdx, done) {
  const f = getFile(path);
  if (!f || f.content == null) return false;
  const lines = String(f.content || '').split('\n');
  if (lineIdx < 0 || lineIdx >= lines.length) return false;
  lines[lineIdx] = lines[lineIdx].replace(/\[([ xX])\]/, done ? '[x]' : '[ ]');
  f.content = lines.join('\n');
  f.size = new Blob([f.content]).size;
  writeBack(f);
  return true;
}
async function writeBack(f) {
  // try real file write; else keep in memory (+ IDB snapshot for files-kind)
  if (f.kind !== 'pdf' && f.handle && f.content != null) {
    try {
      const ok = await ensureDirPermission(f.handle, 'readwrite').catch(() => false);
      if (ok !== false) {
        const w = await f.handle.createWritable();
        await w.write(f.content);
        await w.close();
        return true;
      }
    } catch (e) { /* fall through to memory */ }
  }
  const ws = activeWs();
  if (ws && ws.kind === 'files') {
    const stored = (await idbGet('ws:' + ws.id)) || [];
    const it = stored.find(x => x.path === f.path);
    if (it) {
      if (f.kind === 'pdf') { it.bytes = f.bytes || null; it.size = f.size; }
      else { it.content = f.content; it.size = f.size; }
      await idbSet('ws:' + ws.id, stored);
    }
  }
  return false;
}

/* ---------------- render dispatcher (md · tex · pdf · txt) ---------------- */
async function renderMd() {
  const f = S.activePath ? getFile(S.activePath) : null;
  const isPdf = f && (f.kind || kindOf(f.name)) === 'pdf';
  if (els.btnEdit) els.btnEdit.disabled = !f || !!isPdf;
  if (els.sbEdit) els.sbEdit.classList.toggle('on', S.editing);
  if (els.btnEdit) els.btnEdit.classList.toggle('on', S.editing);
  if (!f) {
    els.mdWrap.hidden = true; els.empty.hidden = false;
    els.mdCrumb.innerHTML = '<b>No file</b>';
    return;
  }
  if (!f.kind) f.kind = kindOf(f.name);
  els.mdWrap.hidden = false; els.empty.hidden = true;
  const ws = activeWs();
  els.mdCrumb.innerHTML = '<b>' + esc(ws ? ws.name : '') + '</b> · ' + esc(f.path);
  if (els.mdTypeBadge) { els.mdTypeBadge.textContent = badgeOf(f.kind); els.mdTypeBadge.className = 'fbadge ' + (f.kind === 'md' ? 'md' : f.kind); }
  const showEdit = S.editing && !isPdf;
  els.mdEditWrap.hidden = !showEdit;
  els.mdBody.hidden = showEdit;
  if (els.texWrap) els.texWrap.hidden = true;
  if (els.pdfPages) els.pdfPages.hidden = true;
  if (els.pdfBar) els.pdfBar.hidden = !isPdf;
  if (isPdf) {
    els.mdBody.hidden = true;
    els.mdTaskPill.hidden = true;
    await renderPdfView(f);
    setWordStats('', f);
    return;
  }
  if (f.kind === 'tex' || f.kind === 'bib') {
    renderTexView(f, showEdit);
    setWordStats(f.content || '', f);
    return;
  }
  // md / txt
  const tasks = parseTasks(f.content);
  const open = tasks.filter(t => !t.done).length;
  els.mdTaskPill.hidden = !tasks.length;
  els.mdTaskLbl.textContent = open + ' open / ' + tasks.length;
  if (showEdit) {
    els.mdBody.innerHTML = '';
    if (document.activeElement !== els.mdEdit) {
      const dk = fileKey(f.path);
      const draft = (S.drafts || {})[dk];
      els.mdEdit.value = (draft != null && draft !== f.content) ? draft : (f.content || '');
      if (draft != null && draft !== f.content) toast('Draft restored', 'ok');
    }
    applyEditorPrefs();
    els.saveHint.textContent = f.handle
      ? 'Saving writes back to the picked file when permission allows, otherwise it downloads a copy.'
      : 'This workspace is in-memory — Save downloads a copy and keeps it in the panel.';
  } else {
    const t0 = performance.now();
    els.mdBody.innerHTML = renderMarkdown(f.content || '', S.searchQuery && document.querySelector('#pane-search.active') ? S.searchQuery : '');
    const ms = performance.now() - t0;
    if (els.mdMeter) els.mdMeter.textContent = ms.toFixed(0) + ' ms';
    if (els.renderMeter) els.renderMeter.textContent = ms.toFixed(0) + ' ms · ' + (f.content || '').length + ' chars';
    wireRenderedMd(f);
    lazyDiagrams();
    trackReadingWords(f.content || '');
  }
  setWordStats(f.content || '', f);
}
function setWordStats(text, f) {
  const words = countWords(text);
  els.kvWords.textContent = words.toLocaleString();
  els.kvChars.textContent = (text || '').length.toLocaleString();
  els.kvRead.textContent = words ? Math.max(1, Math.round(words / 200)) + ' min' : '—';
}
function countWords(text) {
  if (!text) return 0;
  const cjk = (text.match(/[\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7af\u0e00-\u0e7f]/g) || []).length;
  const rest = text.replace(/[\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7af\u0e00-\u0e7f]/g, ' ');
  return cjk + ((rest.match(/\S+/g) || []).length);
}
function wireRenderedMd(f) {
  // task checkboxes — works for BOTH renderers:
  //  - fallback parser marks them [data-taskbox]
  //  - marked (vendored) renders plain <li><input type="checkbox" disabled>
  const boxes = els.mdBody.querySelectorAll('[data-taskbox], li input[type="checkbox"]');
  const tlist = parseTasks(f.content);
  boxes.forEach((box, bi) => {
    try { box.removeAttribute('disabled'); } catch (e) {}
    box.addEventListener('change', async () => {
      const t = tlist[bi];
      if (!t) return;
      setTaskDone(f.path, t.line, box.checked);
      await renderMd(); renderTodo(); renderFileList(); updateStats();
    });
  });
  els.mdBody.querySelectorAll('a[data-link]').forEach(a => {
    a.addEventListener('click', (e) => { e.preventDefault(); toast('Links are panel-guarded — copy the URL from Edit mode'); });
  });
  els.mdBody.querySelectorAll('a[data-wiki]').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      openWiki(a.getAttribute('data-wiki'));
    });
  });
  els.mdBody.querySelectorAll('a[data-tag]').forEach(a => {
    a.addEventListener('click', (e) => { e.preventDefault(); setPane('tags'); });
  });
  els.mdBody.querySelectorAll('.codebar button').forEach(b => {
    b.addEventListener('click', () => {
      const pre = b.closest('div').nextElementSibling;
      const code = pre ? pre.innerText : '';
      navigator.clipboard.writeText(code).then(() => toast('Code copied', 'ok'), () => toast('Copy failed', 'err'));
    });
  });
  els.mdBody.querySelectorAll('th[data-sort]').forEach(th => {
    th.addEventListener('click', () => sortTableBy(th));
  });
  els.mdBody.querySelectorAll('h1,h2,h3,h4').forEach(h => {
    h.style.cursor = 'pointer';
    h.title = 'Click to copy link';
    h.addEventListener('click', () => {
      try {
        if (window.getSelection().toString().trim()) return; // don't hijack text selection
      } catch (e) {}
      const link = '[' + h.innerText.trim() + '](#' + (h.id || '') + ')';
      navigator.clipboard.writeText(link).then(() => toast('Heading link copied', 'ok'), () => toast('Copy failed', 'err'));
    });
  });
  if (els.viewer) wireOutlineSpy();
}
function openWiki(name) {
  const q = (name || '').toLowerCase();
  const hit = S.files.find(f => (f.kind || kindOf(f.name)) !== 'pdf' && (f.name.toLowerCase().includes(q) || f.path.toLowerCase().includes(q)));
  if (hit) { openFile(hit.path); setSidebar(false); }
  else toast('No note named "' + name + '"', 'err');
}

/* ---------------- todo pane ---------------- */
function renderTodo() {
  const scope = S.todoScope, filter = S.todoFilter;
  els.todoScopeSeg.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.tscope === scope));
  els.todoFilterSeg.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.tfilter === filter));
  let tasks = allTasks();
  if (scope === 'file' && S.activePath) tasks = tasks.filter(t => t.path === S.activePath);
  if (scope === 'file' && !S.activePath) tasks = [];
  if (filter === 'active') tasks = tasks.filter(t => !t.done);
  if (filter === 'done') tasks = tasks.filter(t => t.done);
  if (S.todoDue && S.todoDue !== 'any') tasks = tasks.filter(t => bucketDue(t.due) === S.todoDue);
  if (els.todoDueSeg) els.todoDueSeg.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.due === (S.todoDue || 'any')));
  const box = els.todoList;
  box.innerHTML = '';
  els.todoEmpty.style.display = tasks.length ? 'none' : '';
  els.sbTasks.textContent = allTasks().filter(t => !t.done).length;
  for (const t of tasks.slice(0, 500)) {
    const row = document.createElement('div');
    row.className = 'todo-row' + (t.done ? ' done' : '');
    row.innerHTML = '<button class="todo-check' + (t.done ? ' done' : '') + '" title="Toggle"><svg class="ic"><use href="#i-check"/></svg></button>' +
      '<div class="todo-txt"></div><span class="todo-doc"></span>';
    row.querySelector('.todo-txt').textContent = (t.prio ? '!'.repeat(t.prio) + ' ' : '') + (t.text || '(empty task)') + (t.due ? '  @' + t.due : '');
    if (t.due && !t.done && t.due < new Date().toISOString().slice(0, 10)) row.querySelector('.todo-txt').style.color = 'var(--danger)';
    row.querySelector('.todo-doc').textContent = t.name;
    row.querySelector('.todo-doc').title = t.path;
    row.querySelector('.todo-check').addEventListener('click', () => {
      setTaskDone(t.path, t.line, !t.done);
      renderMd(); renderTodo(); renderFileList(); updateStats();
    });
    row.querySelector('.todo-doc').addEventListener('click', () => openFile(t.path));
    box.appendChild(row);
  }
  updateStats();
}
async function addTask(text) {
  text = (text || '').trim();
  if (!text) return;
  let f = S.activePath ? getFile(S.activePath) : null;
  if (f && ((f.kind || kindOf(f.name)) === 'pdf' || f.content == null)) f = null;
  if (!f) f = S.files.find(x => (x.kind || kindOf(x.name)) !== 'pdf' && x.content != null) || null;
  if (!f) {
    // create inbox file in files-kind workspace
    const ws = activeWs();
    if (!ws) { toast('Open a folder first', 'err'); return; }
    if (ws.kind === 'files') {
      const nf = { path: 'inbox.md', name: 'inbox.md', size: 0, mtime: Date.now(), content: '' };
      const stored = (await idbGet('ws:' + ws.id)) || [];
      stored.push(nf);
      await idbSet('ws:' + ws.id, stored);
      S.files.push(nf);
      f = nf;
    } else if (ws.kind === 'demo') {
      const nf = { path: 'inbox.md', name: 'inbox.md', size: 0, mtime: Date.now(), content: '' };
      S.files.push(nf);
      f = nf;
    } else { toast('No writable file — open a file first', 'err'); return; }
  }
  f.content = (f.content ? f.content.replace(/\s+$/, '') + '\n' : '') + '- [ ] ' + text + '\n';
  f.size = new Blob([f.content]).size;
  writeBack(f);
  els.todoInput.value = '';
  openFile(f.path, true);
  renderFileList(); renderTodo(); updateStats();
  toast('Task added', 'ok');
}

/* ---------------- search ---------------- */
let searchTimer = null;
function runSearch() {
  const q = els.searchInput.value;
  S.searchQuery = q;
  els.searchBox.classList.toggle('has', !!q);
  const box = els.searchResults;
  box.innerHTML = '';
  if (!q || q.length < 1) {
    els.searchEmpty.style.display = '';
    els.searchMeta.hidden = true;
    S.searchResults = []; S.searchIdx = -1;
    renderMd();
    return;
  }
  const flags = S.caseSensitive ? 'g' : 'gi';
  let re;
  try {
    if (S.searchRegex) {
      re = new RegExp(q, flags);
    } else {
      let pat = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      if (S.wholeWord) pat = '\\b' + pat + '\\b';
      re = new RegExp(pat, flags);
    }
  } catch (e) { toast('Bad regex: ' + errName(e), 'err'); els.searchEmpty.style.display = ''; return; }
  if (els.swRegex) els.swRegex.classList.toggle('on', !!S.searchRegex);
  const hits = [];
  for (const f of S.files) {
    const kind = f.kind || kindOf(f.name);
    const text = kind === 'pdf' ? (S.pdfText && S.pdfText[f.path]) || '' : (f.content || '');
    if (!text) continue;
    re.lastIndex = 0;
    let m, n = 0;
    while ((m = re.exec(text)) && hits.length < 800 && n < 60) {
      n++;
      const start = Math.max(0, m.index - 45);
      const end = Math.min(text.length, m.index + m[0].length + 65);
      let snip = text.slice(start, end).replace(/\s+/g, ' ');
      hits.push({ path: f.path, name: f.name, index: m.index, snippet: snip, q: m[0] });
      if (m[0].length === 0) re.lastIndex++;
    }
  }
  S.searchResults = hits;
  S.searchIdx = hits.length ? 0 : -1;
  els.searchEmpty.style.display = hits.length ? 'none' : '';
  els.searchMeta.hidden = !hits.length;
  els.searchCount.textContent = hits.length + ' result(s)' + (hits.length >= 800 ? ' (capped)' : '');
  for (const h of hits.slice(0, 300)) {
    const d = document.createElement('div');
    d.className = 'result';
    const hi = esc(h.snippet).replace(new RegExp('(' + h.q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', S.caseSensitive ? 'g' : 'gi'), '<em>$1</em>');
    d.innerHTML = '<div class="r-top"><span class="badge"></span><span class="r-f"></span></div><div class="r-txt">' + hi + '</div>';
    d.querySelector('.badge').textContent = h.name;
    d.querySelector('.r-f').textContent = h.path;
    d.addEventListener('click', () => {
      openFile(h.path, true);
      setPane('files');
      // jump: re-render with highlight
      renderMd();
      toast(h.name, 'ok');
    });
    box.appendChild(d);
  }
  if (hits.length > 300) {
    const d = document.createElement('div');
    d.className = 'placeholder';
    d.textContent = '+' + (hits.length - 300) + ' more — refine the query';
    box.appendChild(d);
  }
  renderMd();
}

/* ---------------- stats ---------------- */
function updateStats() {
  els.stWs.textContent = S.workspaces.length;
  els.stFiles.textContent = S.files.length;
  const all = allTasks();
  els.stTasks.textContent = all.filter(t => !t.done).length;
  els.stDone.textContent = all.filter(t => t.done).length;
  els.profileAvatar.textContent = (S.profileName || 'H').trim().charAt(0).toUpperCase() || 'H';
  els.profileName.textContent = S.profileName;
}

/* ---------------- backup / restore / reset ---------------- */
function download(name, text, type) {
  const b = new Blob([text], { type: type || 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(b);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
}
async function backupAll() {
  const snapshots = {};
  for (const w of S.workspaces) {
    if (w.kind === 'files') snapshots[w.id] = await idbGet('ws:' + w.id);
  }
  const data = { format: 'heros-todo-v2', at: Date.now(), prefs: { theme: S.theme, accent: S.accent, pageMode: S.pageMode, fontSize: S.fontSize, profileName: S.profileName, lineHeight: S.lineHeight, readWidth: S.readWidth, readFont: S.readFont, justify: S.justify, focusSent: S.focusSent, breaks: S.breaks, perfMode: S.perfMode, customCss: S.customCss }, extra: { recents: S.recents, starred: S.starred, bookmarks: S.bookmarks, notes: S.notes, marks: S.marks, cards: S.cards, quizKnown: S.quizKnown, counters: S.counters, habits: S.habits, dayWords: S.dayWords, studyDays: S.studyDays, spellIgnore: S.spellIgnore }, workspaces: S.workspaces, snapshots };
  download('heros-todo-backup.json', JSON.stringify(data, null, 2), 'application/json');
  toast('Backup downloaded', 'ok');
}
async function restoreAll(file) {
  try {
    const data = JSON.parse(await file.text());
    if (!data || !Array.isArray(data.workspaces)) throw new Error('bad backup');
    S.workspaces = data.workspaces;
    if (data.prefs) Object.assign(S, data.prefs);
    if (data.extra) Object.assign(S, data.extra);
    if (data.snapshots) for (const [k, v] of Object.entries(data.snapshots)) await idbSet('ws:' + k, v);
    S.activeWsId = S.workspaces.length ? S.workspaces[0].id : null;
    applyTheme(); applyAccent(); applyPageMode(); applyFont(); applyReadPrefs();
    await persist();
    await loadActiveWorkspace();
    toast('Backup restored', 'ok');
  } catch (e) { toast('Restore failed: ' + (e.message || e), 'err'); }
}

/* ---------------- menu + modal ---------------- */
function closeMenu() { els.menu.classList.remove('show'); }
function openMenu(x, y) {
  const items = [
    { id: 'palette', ic: 'i-zap', lbl: 'Commands (Ctrl+K)', kbd: 'K' },
    { id: 'rescan', ic: 'i-refresh', lbl: 'Rescan folder' },
    { id: 'addws', ic: 'i-folder', lbl: 'Add workspace…' },
    { sep: true },
    { id: 'quiz', ic: 'i-star', lbl: 'Quiz me' },
    { id: 'backup', ic: 'i-download', lbl: 'Backup' },
    { id: 'keys', ic: 'i-keyboard', lbl: 'Keyboard shortcuts', kbd: '?' },
    { id: 'theme', ic: 'i-palette', lbl: 'Toggle theme', kbd: 'T' },
    { sep: true },
    { id: 'reset', ic: 'i-trash', lbl: 'Reset everything' },
  ];
  els.menu.innerHTML = '';
  for (const it of items) {
    if (it.sep) { const s = document.createElement('div'); s.className = 'menu-sep'; els.menu.appendChild(s); continue; }
    const b = document.createElement('button');
    b.className = 'menu-item';
    b.innerHTML = '<svg class="ic"><use href="#' + it.ic + '"/></svg><span class="lbl"></span>' + (it.kbd ? '<span class="kbd">' + it.kbd + '</span>' : '');
    b.querySelector('.lbl').textContent = it.lbl;
    b.addEventListener('click', () => { closeMenu(); menuAction(it.id); });
    els.menu.appendChild(b);
  }
  els.menu.style.left = Math.min(x, innerWidth - 250) + 'px';
  els.menu.style.top = Math.min(y, innerHeight - 320) + 'px';
  els.menu.classList.add('show');
}
function menuAction(id) {
  if (id === 'palette') openPalette();
  else if (id === 'quiz') openQuiz();
  else if (id === 'rescan') loadActiveWorkspace();
  else if (id === 'addws') pickFolder();
  else if (id === 'backup') backupAll();
  else if (id === 'keys') showShortcuts();
  else if (id === 'theme') toggleTheme();
  else if (id === 'reset') resetAll();
}
function showModal(title, bodyHtml) {
  els.modal.innerHTML = '<div class="modal-head"><svg class="ic"><use href="#i-info"/></svg><h3></h3>' +
    '<button class="ibtn" id="mClose" style="width:30px;height:30px"><svg class="ic ic-sm"><use href="#i-x"/></svg></button></div>' +
    '<div class="modal-body">' + bodyHtml + '</div>';
  els.modal.querySelector('h3').textContent = title;
  els.modal.querySelector('#mClose').addEventListener('click', hideModal);
  els.modalBackdrop.classList.add('show');
}
function hideModal() { els.modalBackdrop.classList.remove('show'); }
function showShortcuts() {
  showModal('Keyboard shortcuts',
    '<div class="kbd-grid">' +
    '<span class="k-label">Commands palette</span><span class="kbd-row"><kbd>Ctrl</kbd><kbd>K</kbd></span>' +
    '<span class="k-label">Search all files</span><span class="kbd-row"><kbd>Ctrl</kbd><kbd>F</kbd></span>' +
    '<span class="k-label">Edit / save note</span><span class="kbd-row"><kbd>E</kbd> / <kbd>Ctrl</kbd><kbd>S</kbd></span>' +
    '<span class="k-label">Toggle sidebar</span><span class="kbd-row"><kbd>Ctrl</kbd><kbd>B</kbd></span>' +
    '<span class="k-label">Todo scope file/all</span><span class="kbd-row"><kbd>O</kbd></span>' +
    '<span class="k-label">Save position</span><span class="kbd-row"><kbd>D</kbd></span>' +
    '<span class="k-label">Toggle theme</span><span class="kbd-row"><kbd>T</kbd></span>' +
    '<span class="k-label">Night / sepia pages</span><span class="kbd-row"><kbd>N</kbd></span>' +
    '<span class="k-label">Scroll (vim)</span><span class="kbd-row"><kbd>j</kbd><kbd>k</kbd></span>' +
    '<span class="k-label">Font size</span><span class="kbd-row"><kbd>+</kbd><kbd>-</kbd></span>' +
    '<span class="k-label">Templates 1-6 (in editor)</span><span class="kbd-row"><kbd>Alt</kbd><kbd>1-6</kbd></span>' +
    '<span class="k-label">Highlight selection</span><span class="kbd-row"><kbd>H</kbd> via bar</span>' +
    '<span class="k-label">Close dialog</span><span class="kbd-row"><kbd>Esc</kbd></span>' +
    '</div>');
}
async function resetAll() {
  if (!confirm('Reset Heros Todo? Workspaces and settings are cleared (files on disk are kept).')) return;
  for (const w of S.workspaces) await idbDel('ws:' + w.id);
  Object.assign(S, { workspaces: [], activeWsId: null, files: [], activePath: null, recents: [], starred: [], bookmarks: {}, notes: {}, marks: {}, cards: [], quizKnown: {}, counters: [], habits: {}, dayWords: {}, studyDays: {} });
  S.sw = { running: false, startedAt: 0, elapsed: 0, laps: [] };
  S.pom = { phase: 'idle', workMin: 25, breakMin: 5, until: 0, timer: 0 };
  await persist();
  await loadActiveWorkspace();
  toast('Reset done', 'ok');
}

/* ---------------- pickers ---------------- */
async function pickFolder() {
  if (window.showDirectoryPicker) {
    try {
      const h = await window.showDirectoryPicker({ mode: 'readwrite' });
      await addDirWorkspace(h);
      return;
    } catch (e) {
      if (e && e.name === 'AbortError') return;
      toast('Picker failed, trying fallback…', 'err');
    }
  }
  els.folderInput.click();
}
function pickMdFiles() { els.mdFileInput.click(); }

/* ---------------- export ---------------- */
function exportTasksTxt() {
  let tasks = allTasks();
  if (S.todoScope === 'file' && S.activePath) tasks = tasks.filter(t => t.path === S.activePath);
  if (!tasks.length) { toast('No tasks to export', 'err'); return; }
  const txt = tasks.map(t => (t.done ? '[x] ' : '[ ] ') + t.text + '  (' + t.path + ')').join('\n');
  download('heros-todo-tasks.txt', txt);
  toast('Tasks exported', 'ok');
}

/* ---------------- wiring ---------------- */
function wire() {
  document.querySelectorAll('.side-tab').forEach(b => b.addEventListener('click', () => { setPane(b.dataset.pane); }));
  els.btnSidebar.addEventListener('click', () => setSidebar(!els.sidebar.classList.contains('open')));
  els.sideBackdrop.addEventListener('click', () => setSidebar(false));

  els.btnOpen.addEventListener('click', pickFolder);
  els.btnAddWs.addEventListener('click', pickFolder);
  els.btnEmptyOpen.addEventListener('click', pickFolder);
  els.btnAddFiles.addEventListener('click', pickMdFiles);
  els.btnEmptyFiles.addEventListener('click', pickMdFiles);
  els.btnEmptyDemo.addEventListener('click', addDemoWorkspace);
  els.btnRefresh.addEventListener('click', loadActiveWorkspace);
  els.sbRefresh.addEventListener('click', loadActiveWorkspace);
  els.wsSelect.addEventListener('change', async () => { S.activeWsId = els.wsSelect.value; await persist(); await loadActiveWorkspace(); });

  els.folderInput.addEventListener('change', async () => {
    const fl = Array.from(els.folderInput.files || []);
    els.folderInput.value = '';
    if (!fl.length) return;
    // webkitdirectory fallback: group supported files into one workspace (in-memory)
    const mds = [];
    for (const f of fl) {
      if (!isSupportedFile(f.webkitRelativePath || f.name)) continue;
      const kind = kindOf(f.name);
      if (kind === 'pdf') {
        const buf = await f.arrayBuffer().catch(() => null);
        const u8 = buf ? new Uint8Array(buf) : null;
        mds.push({ path: f.webkitRelativePath || f.name, name: f.name, size: f.size, mtime: f.lastModified, kind: 'pdf', bytes: u8 && u8.length <= 12 * 1024 * 1024 ? u8 : null, tooBig: !!(u8 && u8.length > 12 * 1024 * 1024) });
      } else {
        const content = await (f.size > 8 * 1024 * 1024 ? f.slice(0, 8 * 1024 * 1024).text().catch(() => '') : f.text().catch(() => ''));
        mds.push({ path: f.webkitRelativePath || f.name, name: f.name, size: f.size, mtime: f.lastModified, kind, content: f.size > 8 * 1024 * 1024 ? content + '\n\n…[truncated at 8MB]' : content });
      }
    }
    if (!mds.length) { toast('No supported files in that folder', 'err'); return; }
    const base = (fl[0].webkitRelativePath || 'Folder').split('/')[0];
    const ws = { id: uid(), name: base.slice(0, 60), kind: 'files', createdAt: Date.now(), lastFilePath: mds[0].path };
    const okWs = await idbSet('ws:' + ws.id, mds);
    if (!okWs) MEM_SNAPSHOTS.set('ws:' + ws.id, mds);
    S.workspaces.push(ws);
    S.activeWsId = ws.id;
    await persist();
    await loadActiveWorkspace();
    toast(mds.length + ' file(s) loaded', 'ok');
  });
  els.mdFileInput.addEventListener('change', async () => {
    const fl = Array.from(els.mdFileInput.files || []);
    els.mdFileInput.value = '';
    if (fl.length) await addFilesWorkspace(fl);
  });
  els.restoreInput.addEventListener('change', async () => {
    const f = els.restoreInput.files[0];
    els.restoreInput.value = '';
    if (f) await restoreAll(f);
  });

  // file filter
  els.fileFilter.addEventListener('input', () => {
    els.fileBox.classList.toggle('has', !!els.fileFilter.value);
    renderFileList();
  });
  els.fileClear.addEventListener('click', () => { els.fileFilter.value = ''; els.fileBox.classList.remove('has'); renderFileList(); });

  // search
  els.searchInput.addEventListener('input', () => { clearTimeout(searchTimer); searchTimer = setTimeout(runSearch, 220); });
  els.searchClear.addEventListener('click', () => { els.searchInput.value = ''; runSearch(); });
  els.btnSearchTop.addEventListener('click', () => { setPane('search'); setSidebar(true); els.searchInput.focus(); });
  els.swCase.addEventListener('click', () => { S.caseSensitive = !S.caseSensitive; els.swCase.classList.toggle('on', S.caseSensitive); runSearch(); });
  els.swWhole.addEventListener('click', () => { S.wholeWord = !S.wholeWord; els.swWhole.classList.toggle('on', S.wholeWord); runSearch(); });
  els.btnSearchExport.addEventListener('click', () => {
    if (!S.searchResults.length) { toast('Nothing to export', 'err'); return; }
    download('heros-todo-search.txt', S.searchResults.map(r => r.path + '\n' + r.snippet).join('\n\n'));
  });

  // todo
  els.btnTodoAdd.addEventListener('click', () => addTask(els.todoInput.value));
  els.todoInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') addTask(els.todoInput.value); });
  els.todoScopeSeg.querySelectorAll('button').forEach(b => b.addEventListener('click', () => { S.todoScope = b.dataset.tscope; renderTodo(); }));
  els.todoFilterSeg.querySelectorAll('button').forEach(b => b.addEventListener('click', () => { S.todoFilter = b.dataset.tfilter; renderTodo(); }));
  els.btnTodoClear.addEventListener('click', async () => {
    let tasks = allTasks().filter(t => t.done);
    if (S.todoScope === 'file' && S.activePath) tasks = tasks.filter(t => t.path === S.activePath);
    if (!tasks.length) { toast('No completed tasks', 'err'); return; }
    // group by file, delete lines bottom-up
    const byFile = {};
    tasks.forEach(t => { (byFile[t.path] = byFile[t.path] || []).push(t.line); });
    for (const [path, lines] of Object.entries(byFile)) {
      const f = getFile(path);
      if (!f) continue;
      const arr = f.content.split('\n');
      lines.sort((a, b) => b - a).forEach(i => arr.splice(i, 1));
      f.content = arr.join('\n');
      f.size = new Blob([f.content]).size;
      writeBack(f);
    }
    renderMd(); renderTodo(); renderFileList(); updateStats();
    toast('Cleared ' + tasks.length + ' done', 'ok');
  });
  els.btnTodoExport.addEventListener('click', exportTasksTxt);

  // edit
  const setEditing = (on) => {
    if (!S.activePath && on) { toast('Open a file first', 'err'); return; }
    S.editing = on;
    renderMd();
  };
  els.btnEdit.addEventListener('click', () => setEditing(!S.editing));
  els.btnEditTop.addEventListener('click', () => setEditing(!S.editing));
  els.sbEdit.addEventListener('click', () => setEditing(!S.editing));
  els.btnCancelEdit.addEventListener('click', () => setEditing(false));
  els.btnSaveMd.addEventListener('click', async () => {
    const f = getFile(S.activePath);
    if (!f) return;
    f.content = els.mdEdit.value;
    f.size = new Blob([f.content]).size;
    f.mtime = Date.now();
    const wrote = await writeBack(f);
    setEditing(false);
    renderFileList(); renderTodo(); updateStats();
    toast(wrote ? 'Saved to file' : 'Saved in panel + downloaded copy', 'ok');
    if (!wrote && f.handle) download(f.name, els.mdEdit.value || '');
  });
  els.btnCopyTop.addEventListener('click', () => copyMd());
  els.btnCopyMd.addEventListener('click', () => copyMd());
  function copyMd() {
    const f = getFile(S.activePath);
    if (!f) { toast('Nothing to copy', 'err'); return; }
    navigator.clipboard.writeText(f.content || '').then(() => toast('Copied', 'ok'), () => toast('Copy failed', 'err'));
  }
  els.btnExportMd.addEventListener('click', () => {
    const f = getFile(S.activePath);
    if (!f) return;
    download(f.name, f.content || '');
  });
  els.btnExportTxt.addEventListener('click', () => {
    const f = getFile(S.activePath);
    if (!f) return;
    const txt = (f.content || '').replace(/[#>*`|\-[\]()]/g, '');
    download(f.name.replace(/\.(md|markdown)$/i, '') + '.txt', txt);
  });

  // theme / modes / prefs
  els.btnTheme.addEventListener('click', toggleTheme);
  els.sbTheme.addEventListener('click', toggleTheme);
  els.btnNight.addEventListener('click', cyclePageMode);
  els.sbNight.addEventListener('click', cyclePageMode);
  function cyclePageMode() {
    const order = ['off', 'night', 'sepia', 'dim'];
    S.pageMode = order[(order.indexOf(S.pageMode) + 1) % order.length];
    applyPageMode(); persist();
    toast('Page mode: ' + S.pageMode);
  }
  els.pageModeSeg.querySelectorAll('button').forEach(b => b.addEventListener('click', () => { S.pageMode = b.dataset.pm; applyPageMode(); persist(); }));
  els.accentPick.addEventListener('input', () => { S.accent = els.accentPick.value; applyAccent(); persist(); });
  document.querySelectorAll('[data-accent]').forEach(b => b.addEventListener('click', () => { S.accent = b.dataset.accent; applyAccent(); persist(); }));
  els.fontSize.addEventListener('input', () => { S.fontSize = +els.fontSize.value; applyFont(); persist(); });
  els.swResume.addEventListener('change', () => { S.resume = els.swResume.checked; persist(); });
  els.swAuto.addEventListener('change', () => { S.autoRescan = els.swAuto.checked; persist(); });
  els.btnProfileEdit.addEventListener('click', () => {
    const n = prompt('Profile name', S.profileName);
    if (n && n.trim()) { S.profileName = n.trim().slice(0, 40); updateStats(); persist(); }
  });

  // hub actions
  els.btnShortcuts.addEventListener('click', showShortcuts);
  els.btnBackupAll.addEventListener('click', backupAll);
  els.btnRestoreAll.addEventListener('click', () => els.restoreInput.click());
  els.btnResetAll.addEventListener('click', resetAll);

  /* ---- v2 wiring: files, outline, tags, study, lab, exports, prefs ---- */
  if (els.typeRow) els.typeRow.querySelectorAll('.type-chip').forEach(c => c.addEventListener('click', () => { S.typeFilter = c.dataset.type; renderFileList(); }));
  if (els.btnNewNote) els.btnNewNote.addEventListener('click', createNote);
  if (els.btnNewFolder) els.btnNewFolder.addEventListener('click', createFolder);
  if (els.btnCopyOutline) els.btnCopyOutline.addEventListener('click', () => {
    const items = els.outlineList ? Array.from(els.outlineList.querySelectorAll('.outline-item')).map(o => '- ' + o.innerText) : [];
    if (!items.length) { toast('No outline', 'err'); return; }
    navigator.clipboard.writeText(items.join('\n')).then(() => toast('Outline copied', 'ok'));
  });
  if (els.featFilter) els.featFilter.addEventListener('input', () => {
    els.featBox.classList.toggle('has', !!els.featFilter.value);
    renderFeatures(els.featFilter.value, S.featCat);
  });
  if (els.featClear) els.featClear.addEventListener('click', () => { els.featFilter.value = ''; renderFeatures(''); });
  if (els.btnPaletteTop) els.btnPaletteTop.addEventListener('click', openPalette);
  // pdf controls
  if (els.pdfFirst) els.pdfFirst.addEventListener('click', () => goPdfPage(1));
  if (els.pdfPrev) els.pdfPrev.addEventListener('click', () => goPdfPage((S.pdfPage || 1) - 1));
  if (els.pdfNext) els.pdfNext.addEventListener('click', () => goPdfPage((S.pdfPage || 1) + 1));
  if (els.pdfPage) els.pdfPage.addEventListener('change', () => goPdfPage(+els.pdfPage.value || 1));
  const pdfZoom = (d) => {
    S.pdfZoom = Math.min(3, Math.max(0.5, (S.pdfZoom || 1) + d));
    if (els.pdfZoomLbl) els.pdfZoomLbl.textContent = Math.round(S.pdfZoom * 100) + '%';
    if (PDF_DOC) {
      els.pdfPages.querySelectorAll('.pdf-page').forEach(div => { delete div.dataset.done; });
      goPdfPage(S.pdfPage || 1, true);
      els.pdfPages.querySelectorAll('.pdf-page').forEach(div => { if (div.getBoundingClientRect) paintPdfPage(div, PDF_DOC.doc); });
    }
    persist();
  };
  if (els.pdfZoomIn) els.pdfZoomIn.addEventListener('click', () => pdfZoom(0.25));
  if (els.pdfZoomOut) els.pdfZoomOut.addEventListener('click', () => pdfZoom(-0.25));
  if (els.pdfPng) els.pdfPng.addEventListener('click', () => {
    const cur = els.pdfPages.querySelector('[data-page="' + (S.pdfPage || 1) + '"] canvas');
    if (!cur) { toast('Page not rendered yet', 'err'); return; }
    const a = document.createElement('a');
    a.href = cur.toDataURL('image/png'); a.download = 'page-' + S.pdfPage + '.png'; a.click();
  });
  // selection mini-bar
  document.addEventListener('mouseup', (e) => {
    if (e.target.closest && e.target.closest('.sel-bar')) return;
    const sel = window.getSelection();
    const text = sel ? sel.toString().trim() : '';
    if (text && text.length > 1 && els.mdBody && els.mdBody.contains(sel.anchorNode)) showSelBar(e.clientX, e.clientY);
    else hideSelBar();
  });
  if (els.selH) els.selH.addEventListener('click', () => addMark('highlight'));
  if (els.selU) els.selU.addEventListener('click', () => addMark('underline'));
  if (els.selS) els.selS.addEventListener('click', () => addMark('strike'));
  if (els.selCopy) els.selCopy.addEventListener('click', () => {
    const t = window.getSelection().toString();
    navigator.clipboard.writeText(t).then(() => toast('Copied', 'ok'));
    hideSelBar();
  });
  if (els.selNote) els.selNote.addEventListener('click', () => {
    const t = window.getSelection().toString().trim();
    if (els.docNote && t) { els.docNote.value = (els.docNote.value ? els.docNote.value + '\n' : '') + '> ' + t.slice(0, 200) + '\n'; els.docNote.dispatchEvent(new Event('input')); }
    hideSelBar(); setPane('study');
  });
  if (els.docNote) els.docNote.addEventListener('input', () => {
    if (!S.activePath) return;
    S.notes = S.notes || {};
    S.notes[fileKey(S.activePath)] = els.docNote.value.slice(0, 2000);
    persist();
  });
  if (els.btnNoteSel) els.btnNoteSel.addEventListener('click', () => {
    const t = window.getSelection().toString().trim();
    if (!t) { toast('Select text first', 'err'); return; }
    if (els.docNote) { els.docNote.value = (els.docNote.value ? els.docNote.value + '\n' : '') + '> ' + t.slice(0, 300) + '\n'; els.docNote.dispatchEvent(new Event('input')); toast('Note added', 'ok'); }
  });
  if (els.btnMarksExp) els.btnMarksExp.addEventListener('click', () => {
    const marks = S.activePath ? getMarks(S.activePath) : [];
    if (!marks.length) { toast('No markers', 'err'); return; }
    download('marks.txt', marks.map((m, i) => (i + 1) + '. [' + m.type + '] ' + m.quote).join('\n'));
  });
  // stopwatch
  setInterval(swTick, 50);
  if (els.btnSwStart) els.btnSwStart.addEventListener('click', () => {
    if (S.sw.running) { S.sw.elapsed += Date.now() - S.sw.startedAt; S.sw.running = false; els.btnSwStart.textContent = 'Start'; }
    else { S.sw.startedAt = Date.now(); S.sw.running = true; els.btnSwStart.textContent = 'Pause'; }
    persist();
  });
  if (els.btnSwLap) els.btnSwLap.addEventListener('click', () => {
    if (!S.sw.running) return;
    S.sw.laps.push(S.sw.elapsed + (Date.now() - S.sw.startedAt));
    if (S.sw.laps.length > 50) S.sw.laps.shift();
    persist(); renderSwLaps();
  });
  if (els.btnSwReset) els.btnSwReset.addEventListener('click', () => {
    S.sw = { running: false, startedAt: 0, elapsed: 0, laps: [] };
    paintSw(0); persist(); renderSwLaps();
    if (els.btnSwStart) els.btnSwStart.textContent = 'Start';
  });
  // pomodoro
  if (els.pomWork) els.pomWork.addEventListener('input', () => { S.pom.workMin = +els.pomWork.value; els.pomWorkLbl.textContent = S.pom.workMin + 'm'; persist(); });
  if (els.pomBreak) els.pomBreak.addEventListener('input', () => { S.pom.breakMin = +els.pomBreak.value; els.pomBreakLbl.textContent = S.pom.breakMin + 'm'; persist(); });
  if (els.btnPomStart) els.btnPomStart.addEventListener('click', () => {
    clearInterval(S.pom.timer);
    S.pom.phase = 'work';
    S.pom.until = Date.now() + S.pom.workMin * 60000;
    S.pom.timer = setInterval(pomTick, 500);
    paintPom(); toast('Focus ' + S.pom.workMin + 'm', 'ok');
  });
  if (els.btnPomStop) els.btnPomStop.addEventListener('click', () => {
    clearInterval(S.pom.timer); S.pom.phase = 'idle'; paintPom();
  });
  // counters + habits + cards
  if (els.btnCntAdd) els.btnCntAdd.addEventListener('click', () => {
    const n = (els.cntName.value || '').trim() || 'Counter';
    if ((S.counters || []).length >= 60) { toast('Counter cap reached', 'err'); return; }
    S.counters.push({ name: n.slice(0, 40), val: 0, step: 1 });
    els.cntName.value = '';
    persist(); renderCounters();
  });
  if (els.btnHabitAdd) els.btnHabitAdd.addEventListener('click', () => {
    const n = (els.habitName.value || '').trim();
    if (!n) return;
    S.habits[n.slice(0, 40)] = S.habits[n.slice(0, 40)] || {};
    els.habitName.value = '';
    persist(); renderHabits();
  });
  if (els.btnCardsGen) els.btnCardsGen.addEventListener('click', genCards);
  if (els.btnQuizGo) els.btnQuizGo.addEventListener('click', openQuiz);
  if (els.btnAnkiExp) els.btnAnkiExp.addEventListener('click', ankiExport);
  if (els.btnAnkiImp) els.btnAnkiImp.addEventListener('click', () => els.ankiInput.click());
  if (els.ankiInput) els.ankiInput.addEventListener('change', async () => {
    const fl = els.ankiInput.files[0];
    els.ankiInput.value = '';
    if (!fl) return;
    const txt = await fl.text();
    const rows = txt.split('\n').map(l => l.split('\t')).filter(r => r.length >= 2);
    S.cards = rows.slice(0, 80).map(([q, a]) => ({ q: q.slice(0, 200), a: a.slice(0, 400), known: false }));
    persist(); renderCards();
    toast(S.cards.length + ' cards imported', 'ok');
  });
  // prefs
  if (els.lineHeight) els.lineHeight.addEventListener('input', () => { S.lineHeight = (+els.lineHeight.value || 17) / 10; applyReadPrefs(); persist(); });
  if (els.widthSeg) els.widthSeg.querySelectorAll('button').forEach(b => b.addEventListener('click', () => { S.readWidth = b.dataset.w; applyReadPrefs(); persist(); }));
  if (els.fontSeg) els.fontSeg.querySelectorAll('button').forEach(b => b.addEventListener('click', () => { S.readFont = b.dataset.f; applyReadPrefs(); persist(); }));
  if (els.swJustify) els.swJustify.addEventListener('change', () => { S.justify = els.swJustify.checked; applyReadPrefs(); persist(); });
  if (els.swFocusSent) els.swFocusSent.addEventListener('change', () => { S.focusSent = els.swFocusSent.checked; applyReadPrefs(); persist(); });
  if (els.swBreaks) els.swBreaks.addEventListener('change', () => { S.breaks = els.swBreaks.checked; persist(); renderMd(); });
  if (els.swPerf) els.swPerf.addEventListener('change', () => { S.perfMode = els.swPerf.checked; persist(); renderMd(); toast('Perf mode ' + (S.perfMode ? 'ON' : 'OFF')); });
  if (els.btnCssApply) els.btnCssApply.addEventListener('click', () => { S.customCss = els.customCss.value.slice(0, 4000); applyReadPrefs(); persist(); toast('CSS applied', 'ok'); });
  // insert bar
  if (els.insertBar) els.insertBar.querySelectorAll('[data-ins]').forEach(b => b.addEventListener('click', () => doInsert(b.dataset.ins)));
  // lab
  if (els.btnLint) els.btnLint.addEventListener('click', lintDoc);
  if (els.btnSummary) els.btnSummary.addEventListener('click', showSummary);
  if (els.btnKeywords) els.btnKeywords.addEventListener('click', showKeywords);
  if (els.btnReadability) els.btnReadability.addEventListener('click', showReadability);
  if (els.btnDiff) els.btnDiff.addEventListener('click', showDiff);
  if (els.btnLinkCheck) els.btnLinkCheck.addEventListener('click', showLinkCheck);
  if (els.btnSpell) els.btnSpell.addEventListener('click', showSpell);
  if (els.btnTemplates) els.btnTemplates.addEventListener('click', showTemplates);
  if (els.btnFromUrl) els.btnFromUrl.addEventListener('click', loadFromUrl);
  if (els.btnPasteNew) els.btnPasteNew.addEventListener('click', async () => {
    try {
      const t = await navigator.clipboard.readText();
      if (!t) { toast('Clipboard empty', 'err'); return; }
      S.files.push({ path: 'pasted.md', name: 'pasted.md', size: t.length, mtime: Date.now(), kind: 'md', content: t });
      openFile('pasted.md');
    } catch (e) { toast('Clipboard blocked', 'err'); }
  });
  // exports
  if (els.btnExpHtml) els.btnExpHtml.addEventListener('click', expHtml);
  if (els.btnExpPdf) els.btnExpPdf.addEventListener('click', () => window.print());
  if (els.btnExpJson) els.btnExpJson.addEventListener('click', expJson);
  if (els.btnExpCsv) els.btnExpCsv.addEventListener('click', expCsv);
  if (els.btnStudyPack) els.btnStudyPack.addEventListener('click', studyPack);
  if (els.btnMergePdf) els.btnMergePdf.addEventListener('click', mergePdfs);

  /* ---- wave-3 wiring: sort/groups, ws filter, file ops, find, due, TTS, editor ---- */
  if (els.fileSort) els.fileSort.addEventListener('change', () => { S.fileSort = els.fileSort.value; persist(); renderFileList(); });
  if (els.btnGroup) els.btnGroup.addEventListener('click', () => { S.groupFolders = !S.groupFolders; persist(); renderFileList(); });
  if (els.btnRename) els.btnRename.addEventListener('click', renameFile);
  if (els.btnDupl) els.btnDupl.addEventListener('click', duplicateFile);
  if (els.btnDelFile) els.btnDelFile.addEventListener('click', deleteFile);
  if (els.wsFilter) els.wsFilter.addEventListener('input', () => renderWsList());
  if (els.wsClear) els.wsClear.addEventListener('click', () => { els.wsFilter.value = ''; renderWsList(); });
  if (els.swRegex) els.swRegex.addEventListener('click', () => { S.searchRegex = !S.searchRegex; runSearch(); });
  if (els.todoDueSeg) els.todoDueSeg.querySelectorAll('button').forEach(b => b.addEventListener('click', () => { S.todoDue = b.dataset.due; persist(); renderTodo(); }));
  if (els.btnToday) els.btnToday.addEventListener('click', showToday);
  if (els.btnDaily) els.btnDaily.addEventListener('click', dailyNote);
  if (els.btnRandom) els.btnRandom.addEventListener('click', randomNote);
  if (els.btnFindTop) els.btnFindTop.addEventListener('click', () => {
    if (!S.activePath) { toast('Open a file first', 'err'); return; }
    els.findBar.hidden = false;
    setTimeout(() => els.findInput.focus(), 30);
  });
  if (els.findInput) els.findInput.addEventListener('input', () => runFind());
  if (els.findNext) els.findNext.addEventListener('click', () => stepFind(1));
  if (els.findPrev) els.findPrev.addEventListener('click', () => stepFind(-1));
  if (els.findClose) els.findClose.addEventListener('click', () => clearFind());
  if (els.btnReadTop) els.btnReadTop.addEventListener('click', () => ttsSpeak());
  if (els.btnTtsStop) els.btnTtsStop.addEventListener('click', ttsStop);
  // rate applies live to upcoming chunks — no restart needed
  if (els.ttsVoice) els.ttsVoice.addEventListener('change', () => {
    S.ttsVoice = els.ttsVoice.value;
    persist();
  });
  if (els.selRead) els.selRead.addEventListener('click', () => {
    const t = ((window.getSelection() || '').toString() || '').trim();
    if (!t) { toast('Select text first', 'err'); return; }
    hideSelBar();
    ttsSpeak(t);
  });
  if (els.btnPath) els.btnPath.addEventListener('click', copyPath);
  if (els.mdEdit) {
    els.mdEdit.addEventListener('input', () => {
      clearTimeout(draftTimer);
      draftTimer = setTimeout(saveDraft, 500);
      refreshDirty();
    });
    els.mdEdit.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); toggleTaskLine(); }
    });
  }
  if (els.btnWrap) els.btnWrap.addEventListener('click', () => { S.editorWrap = S.editorWrap === false; applyEditorPrefs(); persist(); });
  if (els.btnTableGen) els.btnTableGen.addEventListener('click', () => {
    const r = +prompt('Rows', '3') || 3, c = +prompt('Columns', '3') || 3;
    insertText(tableMd(r, c));
  });
  if (els.btnTocIns) els.btnTocIns.addEventListener('click', () => { const t = tocInsertText(); if (t) insertText(t); });
  if (els.featCats) els.featCats.querySelectorAll('.type-chip').forEach(b => b.addEventListener('click', () => {
    S.featCat = b.dataset.cat;
    renderFeatures(els.featFilter.value, S.featCat);
  }));
  if (els.viewer) els.viewer.addEventListener('scroll', () => {
    if (progRaf) return;
    progRaf = requestAnimationFrame(() => { progRaf = 0; updateReadProg(); });
  }, { passive: true });
  try {
    if (window.matchMedia) {
      const mq = matchMedia('(prefers-color-scheme: light)');
      const follow = () => { if (S.theme === 'system') { applyTheme(); applyAccent(); } };
      if (mq.addEventListener) mq.addEventListener('change', follow);
      else if (mq.addListener) mq.addListener(follow);
    }
  } catch (e) {}
  // stop speech + clear find on file switch (wrap global openFile)
  openFile = (function (orig) {
    return async function (path, silent) {
      ttsStop();
      clearFind(true);
      const r = await orig(path, silent);
      updateReadProg();
      return r;
    };
  })(openFile);
  // second key layer (Ctrl+Shift+F find, S read-aloud)
  document.addEventListener('keydown', (e) => {
    const tag = (document.activeElement && document.activeElement.tagName) || '';
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'f') {
      e.preventDefault();
      if (S.activePath) { els.findBar.hidden = false; setTimeout(() => els.findInput.focus(), 30); }
    } else if ((e.key === 's' || e.key === 'S') && !/INPUT|TEXTAREA/.test(tag) && !e.ctrlKey && !e.metaKey) {
      ttsSpeak();
    } else if ((e.key === 'p' || e.key === 'P') && !/INPUT|TEXTAREA/.test(tag) && !e.ctrlKey && !e.metaKey) {
      togglePresent();
    } else if (e.key === 'F11') {
      e.preventDefault();
      goFullscreen();
    }
  });
  // folder fallback accepts all types now
  // (folderInput/mdFileInput handlers patched below via re-bind guard)
  // menu
  els.btnMenu.addEventListener('click', (e) => {
    e.stopPropagation();
    if (els.menu.classList.contains('show')) closeMenu();
    else { const r = els.btnMenu.getBoundingClientRect(); openMenu(r.left - 200, r.bottom + 8); }
  });
  document.addEventListener('click', (e) => { if (!e.target.closest('.menu') && !e.target.closest('#btnMenu')) closeMenu(); });
  els.modalBackdrop.addEventListener('click', (e) => { if (e.target === els.modalBackdrop) hideModal(); });

  // drag & drop folders/files onto panel
  let dragDepth = 0;
  document.addEventListener('dragenter', (e) => { e.preventDefault(); dragDepth++; els.dropOverlay.classList.add('show'); });
  document.addEventListener('dragleave', (e) => { e.preventDefault(); if (--dragDepth <= 0) { dragDepth = 0; els.dropOverlay.classList.remove('show'); } });
  document.addEventListener('dragover', (e) => e.preventDefault());
  document.addEventListener('drop', async (e) => {
    e.preventDefault(); dragDepth = 0; els.dropOverlay.classList.remove('show');
    const items = e.dataTransfer && e.dataTransfer.items;
    if (items && items.length && items[0].getAsFileSystemHandle) {
      try {
        const h = await items[0].getAsFileSystemHandle();
        if (h && h.kind === 'directory') { await addDirWorkspace(h); return; }
        if (h && h.kind === 'file') {
          const f = await h.getFile();
          await addFilesWorkspace([f]);
          return;
        }
      } catch (err) { /* fallback below */ }
    }
    const fl = Array.from((e.dataTransfer && e.dataTransfer.files) || []);
    if (fl.length) await addFilesWorkspace(fl);
  });

  // surface any uncaught error in the status bar (never a blank panel)
  window.addEventListener('error', (ev) => {
    try { setStatus('Error: ' + String(ev.message || 'unknown').slice(0, 90)); } catch (e) {}
  });
  window.addEventListener('unhandledrejection', (ev) => {
    try {
      const r = ev.reason;
      setStatus('Error: ' + (r && r.name ? r.name + (r.message ? ': ' + r.message : '') : 'rejection').slice(0, 90));
    } catch (e) {}
  });

  // keyboard
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openPalette(); }
    else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's' && S.editing) { e.preventDefault(); els.btnSaveMd.click(); }
    else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') { e.preventDefault(); setPane('search'); setSidebar(true); els.searchInput.focus(); }
    else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') { e.preventDefault(); setSidebar(!els.sidebar.classList.contains('open')); }
    else if (e.key === 'Escape') {
      if (document.body.classList.contains('present')) togglePresent();
      else if (els.modalBackdrop.classList.contains('show')) hideModal();
      else if (els.menu.classList.contains('show')) closeMenu();
      else if (!els.selBar.hidden) hideSelBar();
      else if (S.editing) setEditing(false);
      else setSidebar(false);
    }
    else if (e.key === '?' && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) showShortcuts();
    else if ((e.key === 'o' || e.key === 'O') && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) { S.todoScope = S.todoScope === 'file' ? 'all' : 'file'; renderTodo(); }
    else if ((e.key === 'd' || e.key === 'D') && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) {
      if (S.activePath) {
        S.bookmarks = S.bookmarks || {};
        S.bookmarks[fileKey(S.activePath)] = els.viewer ? els.viewer.scrollTop : 0;
        persist(); toast('Position saved (D)', 'ok');
      }
    }
    else if ((e.key === 'e' || e.key === 'E') && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) setEditing(!S.editing);
    else if ((e.key === 't' || e.key === 'T') && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) toggleTheme();
    else if ((e.key === 'n' || e.key === 'N') && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) cyclePageMode();
    else if (e.key === 'j' && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) els.viewer.scrollBy({ top: 120 });
    else if (e.key === 'k' && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) els.viewer.scrollBy({ top: -120 });
    else if (e.key === '/' && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) { e.preventDefault(); setPane('search'); setSidebar(true); els.searchInput.focus(); }
    else if ((e.key === '+' || e.key === '=') && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) { S.fontSize = Math.min(20, S.fontSize + 1); applyFont(); persist(); }
    else if (e.key === '-' && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) { S.fontSize = Math.max(12, S.fontSize - 1); applyFont(); persist(); }
    else if (/^[1-6]$/.test(e.key) && !els.mdEditWrap.hidden && /TEXTAREA/.test(document.activeElement.tagName) && e.altKey) {
      const keys = ['study', 'meeting', 'exam', 'journal', 'thesis', 'habit'];
      insertText('\n' + TEMPLATES[keys[+e.key - 1]]);
    }
  });
}

/* ==========================================================================
   POWER v2 engines — part 1: perfect markdown (marked+KaTeX+mermaid lazy),
   TEX viewer, PDF viewer (pdf.js lazy), outline, tags, markers.
   100% local. Vendors copied read-only from Heros_Markdown / Heros_PDF.
   ========================================================================== */
S.pdfText = S.pdfText || {};
let PDF_DOC = null; // {path, doc, observer}
let MERMAID_OK = false, MERMAID_LOADING = false;

function stripFrontmatter(src) {
  const m = /^---\n([\s\S]*?)\n---\n?/.exec(src || '');
  if (!m) return { fm: null, body: src || '' };
  const fm = {};
  m[1].split('\n').forEach(l => {
    const mm = l.match(/^(\w+):\s*(.*)$/);
    if (mm) fm[mm[1]] = mm[2].replace(/^["'\[]|["'\]]$/g, '');
  });
  return { fm, body: (src || '').slice(m[0].length) };
}
function extractTags(src) {
  const tags = {};
  const clean = String(src || '').replace(/```[\s\S]*?```/g, '').replace(/`[^`]*`/g, '');
  const re = /(^|\s)#([a-zA-Z0-9_\-\/]{2,40})/g;
  let m;
  while ((m = re.exec(clean))) tags[m[2].toLowerCase()] = (tags[m[2].toLowerCase()] || 0) + 1;
  return tags;
}
function isRtlLine(t) { return /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/.test(t || ''); }

function renderMarkdown(src, query) {
  const { fm, body } = stripFrontmatter(src);
  let html = '';
  if (fm && (fm.title || fm.tags || fm.date)) {
    html += '<div class="fm-chips">' +
      (fm.title ? '<span class="pill">' + esc(fm.title) + '</span>' : '') +
      (fm.date ? '<span class="pill">' + esc(fm.date) + '</span>' : '') +
      ((fm.tags || '').split(/[,\s]+/).filter(Boolean).slice(0, 6).map(t => '<span class="pill" data-taglink="' + esc(t) + '">#' + esc(t) + '</span>').join('')) + '</div>';
  }
  // prefer vendored marked (Heros Markdown engine), fallback to built-in mdToHtml
  try {
    if (typeof marked !== 'undefined' && marked.parse) {
      html += markedGfm(body);
    } else throw new Error('no marked');
  } catch (e) {
    html += mdToHtml(body, null);
  }
  if (query) html = highlightQuery(html, query);
  html += '<div class="meter" style="margin-top:10px">' + esc(countWords(src) + ' words · ' + (src || '').length + ' chars') + '</div>';
  return html;
}

function markedGfm(body) {
  let src = String(body || '');
  // stash mermaid fences
  const mermaidBlocks = [];
  src = src.replace(/```mermaid\n([\s\S]*?)```/g, (m, code) => {
    mermaidBlocks.push(code);
    return 'HHHMMD' + (mermaidBlocks.length - 1) + 'HHH';
  });
  // stash math: $$..$$, \[..\], \(..\), $..$ (currency-safe)
  const mathBlocks = [];
  src = src.replace(/\$\$([\s\S]+?)\$\$/g, (m, c) => { mathBlocks.push({ d: true, c }); return 'HHHMATH' + (mathBlocks.length - 1) + 'HHH'; });
  src = src.replace(/\\\[([\s\S]+?)\\\]/g, (m, c) => { mathBlocks.push({ d: true, c }); return 'HHHMATH' + (mathBlocks.length - 1) + 'HHH'; });
  src = src.replace(/\\\((.+?)\\\)/g, (m, c) => { mathBlocks.push({ d: false, c }); return 'HHHMATH' + (mathBlocks.length - 1) + 'HHH'; });
  src = src.replace(/(^|[^$\w\\])\$([^$\n]+?)\$(?=[^$\w]|$)/g, (m, pre, c) => {
    if (/^\d/.test(c.trim()) || /^\d+\.\d+$/.test(c.trim())) return m; // currency-safe
    mathBlocks.push({ d: false, c });
    return pre + 'HHHMATH' + (mathBlocks.length - 1) + 'HHH';
  });
  // ==mark==, ++ins++, ^sup^
  src = src.replace(/==([^=\n]+)==/g, '<mark class="mk" style="background:var(--hl)">$1</mark>');
  src = src.replace(/\+\+([^+\n]+)\+\+/g, '<u>$1</u>');
  // [[toc]] / [[wikilink]] / footnotes stash
  const hasToc = /\[\[toc\]\]/i.test(src);
  src = src.replace(/\[\[toc\]\]/gi, 'HHHTOCHHH');
  const foot = {};
  src = src.replace(/^\[\^([^\]]+)\]:\s*(.+)$/gm, (m, k, v) => { foot[k] = v; return ''; });
  let html = marked.parse(src, { breaks: S.breaks !== false, gfm: true });
  // restore math via KaTeX (offline vendored)
  html = html.replace(/HHHMATH(\d+)HHH/g, (m, i) => {
    const b = mathBlocks[+i];
    try {
      if (typeof katex !== 'undefined') {
        return b.d
          ? '<div class="math-block">' + katex.renderToString(b.c, { throwOnError: false, displayMode: true }) + '</div>'
          : katex.renderToString(b.c, { throwOnError: false });
      }
    } catch (e) {}
    return '<code>' + esc(b.c) + '</code>';
  });
  // restore mermaid placeholders (lazy; perf mode shows button)
  html = html.replace(/HHHMMD(\d+)HHH/g, (m, i) => {
    const code = mermaidBlocks[+i] || '';
    if (S.perfMode) return '<div class="mmd" data-mmd-skip="' + i + '"><div class="mmd-err">Diagram skipped (perf mode)</div><button class="btn ghost" data-mmd-render="' + i + '" style="height:30px;font-size:12px">Render diagram</button><pre hidden data-mmd-src="' + i + '">' + esc(code) + '</pre></div>';
    return '<div class="mmd" data-mmd="' + i + '"><pre hidden>' + esc(code) + '</pre><div class="mmd-err">Rendering diagram…</div></div>';
  });
  // TOC
  if (hasToc) {
    const toc = buildToc(body).map(h => '<a href="#" data-toc="' + h.id + '">' + esc(h.text) + '</a>').join('');
    html = html.replace(/HHHTOCHHH/g, '<div class="toc"><b>Contents</b>' + (toc || '<div class="meter">No headings</div>') + '</div>');
  }
  // wikilinks [[name]] (not toc)
  html = html.replace(/\[\[([^\]]+)\]\]/g, (m, n) => {
    if (/^toc$/i.test(n.trim())) return m;
    return '<a href="#" data-wiki="' + esc(n.trim()) + '">[[ ' + esc(n.trim()) + ' ]]</a>';
  });
  // #tags
  html = html.replace(/(^|[\s(])#([a-zA-Z0-9_\-\/]{2,40})/g, '$1<a href="#" data-tag="$2">#$2</a>');
  // callouts
  html = html.replace(/<blockquote>\s*<p>\s*\[!(NOTE|TIP|WARNING|CAUTION|IMPORTANT)\]/gi, (m, k) => {
    const cls = /WARNING|CAUTION/.test(k) ? 'warn' : /IMPORTANT/.test(k) ? 'danger' : /TIP/.test(k) ? 'ok' : '';
    return '<div class="callout ' + cls + '"><b>' + k + '</b><p>';
  });
  // footnotes
  html = html.replace(/\[\^([^\]]+)\]/g, (m, k) => foot[k]
    ? '<sup><a href="#" data-fn="' + esc(k) + '">[' + esc(k) + ']</a></sup> <span class="meter">' + esc(foot[k]) + '</span>'
    : m);
  // code copy bars + language labels
  html = html.replace(/<pre><code class="language-([\w+-]+)">/g, '<div class="codebar"><span>$1</span><button>Copy</button></div><pre><code>');
  html = html.replace(/<pre><code>/g, '<div class="codebar"><span>code</span><button>Copy</button></div><pre><code>');
  // sortable tables
  html = html.replace(/<th>/g, '<th data-sort>');
  // section time badges on headings
  html = html.replace(/<(h[1-4])([^>]*)>([\s\S]*?)<\/h[1-4]>/g, (m, tag, attrs, inner) => {
    const words = (inner.replace(/<[^>]+>/g, ' ').match(/\S+/g) || []).length;
    return '<' + tag + attrs + '>' + inner + '<span class="sec-badge">' + Math.max(1, Math.round(words / 200)) + ' min</span></' + tag + '>';
  });
  // heading ids for outline jumps
  let hi = 0;
  html = html.replace(/<(h[1-4])([^>]*)>/g, (m, tag, attrs) => {
    if (/id=/.test(attrs)) return m;
    return '<' + tag + attrs + ' id="hsec-' + (hi++) + '">';
  });
  // RTL paragraphs
  html = html.replace(/<(p|li|h[1-4])([^>]*)>([^<]*[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC][^<]*)<\/(p|li|h\d)>/g, '<$1$2 class="rtl">$3</$4>');
  return html;
}
function highlightQuery(html, q) {
  try {
    let pat = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (S.wholeWord) pat = '\\b' + pat + '\\b';
    return html.replace(new RegExp('(' + pat + ')', S.caseSensitive ? 'g' : 'gi'), '<mark class="hl">$1</mark>');
  } catch (e) { return html; }
}
function buildToc(src) {
  const out = [];
  String(src || '').split('\n').forEach((ln, i) => {
    const m = ln.match(/^(#{1,4})\s+(.*)$/);
    if (m) {
      const text = m[2].replace(/[*_`~\[\]]/g, '').trim();
      out.push({ lvl: m[1].length, text, line: i, id: 'hsec-' + out.length });
    }
  });
  return out;
}
function sortTableBy(th) {
  try {
    const table = th.closest('table');
    const idx = Array.from(th.parentNode.children).indexOf(th);
    const tb = table.querySelector('tbody');
    const rows = Array.from(tb.rows);
    const asc = th.dataset.dir !== 'asc';
    th.dataset.dir = asc ? 'asc' : 'desc';
    rows.sort((a, b) => {
      const x = a.cells[idx] ? a.cells[idx].innerText : '', y = b.cells[idx] ? b.cells[idx].innerText : '';
      const nx = parseFloat(x), ny = parseFloat(y);
      if (!isNaN(nx) && !isNaN(ny)) return asc ? nx - ny : ny - nx;
      return asc ? x.localeCompare(y) : y.localeCompare(x);
    });
    rows.forEach(r => tb.appendChild(r));
  } catch (e) {}
}
function ensureMermaid(cb) {
  if (MERMAID_OK) return cb && cb();
  if (MERMAID_LOADING) { setTimeout(() => ensureMermaid(cb), 400); return; }
  MERMAID_LOADING = true;
  const s = document.createElement('script');
  s.src = 'vendor/mermaid.min.js';
  s.onload = () => {
    MERMAID_OK = true; MERMAID_LOADING = false;
    try { mermaid.initialize({ startOnLoad: false, theme: S.theme === 'dark' ? 'dark' : 'default' }); } catch (e) {}
    cb && cb();
  };
  s.onerror = () => { MERMAID_LOADING = false; cb && cb(); };
  document.head.appendChild(s);
}
function lazyDiagrams() {
  const blocks = els.mdBody.querySelectorAll('[data-mmd]');
  if (!blocks.length) return;
  const run = () => ensureMermaid(() => {
    blocks.forEach((box) => {
      const pre = box.querySelector('pre');
      const code = pre ? pre.innerText : '';
      try {
        box.innerHTML = '<div class="mermaid">' + esc(code) + '</div>';
        mermaid.run({ nodes: [box.querySelector('.mermaid')] });
        const dl = document.createElement('div');
        dl.className = 'tool-row'; dl.style.marginTop = '8px';
        dl.innerHTML = '<button class="btn ghost" style="height:30px;font-size:12px">SVG</button>';
        dl.querySelector('button').addEventListener('click', () => {
          const svg = box.querySelector('svg');
          if (svg) download('diagram.svg', new XMLSerializer().serializeToString(svg), 'image/svg+xml');
        });
        box.appendChild(dl);
      } catch (e) {
        box.innerHTML = '<div class="mmd-err">Diagram error — source kept:</div><pre>' + esc(code) + '</pre>';
      }
    });
  });
  if ('requestIdleCallback' in window) requestIdleCallback(run, { timeout: 1500 });
  else setTimeout(run, 60);
  // perf-mode manual renders
  els.mdBody.querySelectorAll('[data-mmd-render]').forEach(b => b.addEventListener('click', () => {
    const i = b.dataset.mmdRender;
    const src = els.mdBody.querySelector('[data-mmd-src="' + i + '"]');
    const box = b.closest('.mmd');
    if (src && box) {
      box.setAttribute('data-mmd', i);
      box.innerHTML = '<pre hidden>' + esc(src.innerText) + '</pre><div class="mmd-err">Rendering…</div>';
      lazyDiagrams();
    }
  }));
}

/* ---- TEX viewer ---- */
function texOutline(src) {
  const out = [];
  String(src || '').split('\n').forEach((ln, i) => {
    const m = ln.match(/\\(chapter|section|subsection|subsubsection)\{([^}]*)\}/);
    if (m) out.push({ lvl: m[1] === 'chapter' ? 1 : m[1] === 'section' ? 2 : m[1] === 'subsection' ? 3 : 4, text: m[2], line: i });
  });
  return out;
}
function renderTexView(f, showEdit) {
  const src = f.content || '';
  if (showEdit) {
    els.mdBody.hidden = true;
    if (els.texWrap) els.texWrap.hidden = true;
    if (document.activeElement !== els.mdEdit) els.mdEdit.value = src;
    els.mdTaskPill.hidden = true;
    return;
  }
  els.mdBody.hidden = true;
  if (els.texWrap) els.texWrap.hidden = false;
  // source with highlight
  const html = esc(src).split('\n').map(ln => {
    if (/^\s*%/.test(ln)) return '<span class="c">' + ln + '</span>';
    return ln.replace(/(\\[a-zA-Z]+)/g, '<span class="cmd">$1</span>');
  }).join('\n');
  if (els.texSrc) els.texSrc.innerHTML = html;
  // math preview
  let preview = '';
  const maths = [];
  src.replace(/\$\$([\s\S]+?)\$\$/g, (m, c) => { maths.push({ d: true, c }); return ''; });
  src.replace(/(^|[^\\])\$([^$\n]+?)\$/g, (m, p, c) => { if (!/^\d/.test(c.trim())) maths.push({ d: false, c }); return ''; });
  const env = src.match(/\\begin\{equation\}([\s\S]*?)\\end\{equation\}/);
  if (env) maths.push({ d: true, c: env[1] });
  if (els.texMath) {
    if (!maths.length) els.texMath.innerHTML = '<div class="meter">No math detected — $…$ or equation blocks render here.</div>';
    else els.texMath.innerHTML = maths.slice(0, 20).map(b => {
      try {
        if (typeof katex !== 'undefined') return b.d
          ? '<div class="math-block">' + katex.renderToString(b.c, { throwOnError: false, displayMode: true }) + '</div>'
          : '<p>' + katex.renderToString(b.c, { throwOnError: false }) + '</p>';
      } catch (e) {}
      return '<pre>' + esc(b.c) + '</pre>';
    }).join('');
  }
  const tasks = parseTasks(src);
  els.mdTaskPill.hidden = !tasks.length;
  if (tasks.length) els.mdTaskLbl.textContent = tasks.filter(t => !t.done).length + ' open / ' + tasks.length;
}

/* ---- PDF viewer (pdf.js lazy, DPR cap 2 — Heros PDF pipeline, panel-sized) ---- */
async function pdfBytes(f) {
  if (f.bytes) {
    const u = toU8(f.bytes);
    if (u && u.length) return u;
  }
  if (f.tooBig) throw namedError('StorageLimit', 'this PDF is over 12MB so it was not kept in panel storage. Add its folder as a workspace instead — PDFs then stream straight from disk.');
  if (f.handle) {
    try {
      const ok = await ensureDirPermission(f.handle, 'read');
      if (!ok) throw namedError('NotAllowedError', 'read permission denied for ' + f.name + '. Re-pick the folder via Spaces → ↻.');
      const file = await f.handle.getFile();
      f.size = file.size;
      return new Uint8Array(await file.arrayBuffer());
    } catch (e) {
      if (e && e.name) throw e; // keep real cause (NotFoundError etc.)
      throw namedError('ReadError', 'could not read ' + f.name + ' (' + errName(e) + ').');
    }
  }
  throw namedError('NoData', 'no PDF data for ' + f.name + ' — add it again.');
}
async function renderPdfView(f) {
  const box = els.pdfPages;
  box.innerHTML = '<div class="placeholder">Loading PDF…</div>';
  box.hidden = false;
  try {
    if (typeof pdfjsLib === 'undefined') throw new Error('PDF engine missing (vendor/pdf.min.js)');
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'vendor/pdf.worker.min.js';
    const bytes = await pdfBytes(f);
    if (PDF_DOC && PDF_DOC.observer) { try { PDF_DOC.observer.disconnect(); } catch (e) {} }
    const task = pdfjsLib.getDocument({ data: bytes, cMapUrl: null, enableXfa: true });
    // password callback
    const doc = await task.promise.catch(async (e) => {
      if (e && e.name === 'PasswordException') {
        const pw = prompt('Encrypted PDF — enter password');
        if (pw == null) throw e;
        return pdfjsLib.getDocument({ data: bytes, password: pw }).promise;
      }
      throw e;
    });
    PDF_DOC = { path: f.path, doc, observer: null, scale: S.pdfZoom || 1 };
    f.size = bytes.length;
    // outline + text index (chunked, capped — Heros PDF style)
    let outline = [];
    try { outline = await doc.getOutline() || []; } catch (e) {}
    S.pdfOutline = outline;
    S.pdfText[f.path] = '';
    const maxIdx = Math.min(doc.numPages, 60);
    for (let p = 1; p <= maxIdx; p++) {
      try {
        const page = await doc.getPage(p);
        const tc = await page.getTextContent();
        S.pdfText[f.path] += tc.items.map(it => it.str).join(' ') + '\n';
      } catch (e) {}
      if (p % 10 === 0) progress(p / maxIdx * 0.7);
    }
    progress(null);
    buildPdfShell(f, doc);
    renderOutline();
  } catch (e) {
    console.warn(e);
    box.innerHTML = '<div class="placeholder">Could not open PDF: ' + esc(e.message || e) + '<br><br>Tip: re-pick the folder to grant read permission.</div>';
  }
}
function buildPdfShell(f, doc) {
  const box = els.pdfPages;
  box.innerHTML = '';
  if (els.pdfTotal) els.pdfTotal.textContent = doc.numPages + ' pages';
  if (els.pdfPage) { els.pdfPage.max = doc.numPages; els.pdfPage.value = S.pdfPage || 1; }
  if (els.pdfZoomLbl) els.pdfZoomLbl.textContent = Math.round((S.pdfZoom || 1) * 100) + '%';
  const obs = new IntersectionObserver((ents) => {
    ents.forEach(en => { if (en.isIntersecting) paintPdfPage(en.target, doc); });
  }, { root: els.viewer, rootMargin: '700px' });
  PDF_DOC.observer = obs;
  for (let p = 1; p <= doc.numPages; p++) {
    const d = document.createElement('div');
    d.className = 'pdf-page';
    d.dataset.page = p;
    d.innerHTML = '<div class="placeholder" style="padding:30px">Page ' + p + '…</div>';
    box.appendChild(d);
    obs.observe(d);
  }
  // thumbnails (first 12, lazy small)
  if (els.pdfThumbs) {
    els.pdfThumbs.innerHTML = '';
    for (let p = 1; p <= Math.min(doc.numPages, 12); p++) {
      const t = document.createElement('div');
      t.className = 'pdf-thumb';
      t.dataset.page = p;
      t.title = 'Page ' + p;
      t.addEventListener('click', () => goPdfPage(p));
      els.pdfThumbs.appendChild(t);
      paintPdfThumb(t, doc, p);
    }
  }
  goPdfPage(S.pdfPage || 1, true);
}
async function paintPdfPage(div, doc) {
  if (div.dataset.done) return;
  div.dataset.done = '1';
  try {
    const p = +div.dataset.page;
    const page = await doc.getPage(p);
    const scale = (S.pdfZoom || 1) * 1.5;
    const vp = page.getViewport({ scale });
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const canvas = document.createElement('canvas');
    canvas.width = Math.floor(vp.width * dpr);
    canvas.height = Math.floor(vp.height * dpr);
    canvas.style.width = '100%';
    canvas.style.height = 'auto';
    div.innerHTML = '';
    div.appendChild(canvas);
    await page.render({ canvasContext: canvas.getContext('2d'), viewport: vp, transform: [dpr, 0, 0, dpr, 0, 0] }).promise;
  } catch (e) { div.innerHTML = '<div class="placeholder">Page failed</div>'; }
}
async function paintPdfThumb(div, doc, p) {
  try {
    const page = await doc.getPage(p);
    const vp = page.getViewport({ scale: 0.22 });
    const canvas = document.createElement('canvas');
    canvas.width = Math.floor(vp.width); canvas.height = Math.floor(vp.height);
    div.appendChild(canvas);
    await page.render({ canvasContext: canvas.getContext('2d'), viewport: vp }).promise;
  } catch (e) {}
}
function goPdfPage(p, silent) {
  if (!PDF_DOC) return;
  p = Math.max(1, Math.min(PDF_DOC.doc.numPages, p || 1));
  S.pdfPage = p;
  if (els.pdfPage) els.pdfPage.value = p;
  const target = els.pdfPages.querySelector('[data-page="' + p + '"]');
  if (target) {
    paintPdfPage(target, PDF_DOC.doc);
    if (!silent) target.scrollIntoView({ block: 'start' });
  }
}

/* ---- outline / tags / backlinks ---- */
function activeText() {
  const f = S.activePath ? getFile(S.activePath) : null;
  if (!f || f.kind === 'pdf') return '';
  return f.content || '';
}
function renderOutline() {
  if (!els.outlineList) return;
  const f = S.activePath ? getFile(S.activePath) : null;
  els.outlineList.innerHTML = '';
  if (els.pdfThumbs && (!f || (f.kind || '') !== 'pdf')) els.pdfThumbs.innerHTML = '';
  if (!f) { els.outlineEmpty.style.display = ''; return; }
  const kind = f.kind || kindOf(f.name);
  let items = [];
  if (kind === 'pdf' && S.pdfOutline) {
    const walk = (nodes, lvl) => (nodes || []).forEach(n => {
      items.push({ text: n.title || 'Untitled', lvl, dest: n.dest });
      if (n.items) walk(n.items, lvl + 1);
    });
    walk(S.pdfOutline, 1);
  } else if (kind === 'tex' || kind === 'bib') {
    items = texOutline(f.content).map(o => ({ text: o.text, lvl: o.lvl, line: o.line }));
  } else {
    items = buildToc(f.content).map(h => ({ text: h.text, lvl: h.lvl, id: h.id }));
  }
  els.outlineEmpty.style.display = items.length ? 'none' : '';
  items.slice(0, 300).forEach((it) => {
    const d = document.createElement('div');
    d.className = 'outline-item lvl' + Math.min(it.lvl, 4);
    d.innerHTML = '<span></span>';
    d.querySelector('span').textContent = it.text;
    d.addEventListener('click', () => {
      if (it.id) { const t = document.getElementById(it.id); if (t) t.scrollIntoView({ block: 'start' }); }
      else if (it.line != null) { toast('Line ' + (it.line + 1)); els.viewer.scrollTop = 0; }
      else if (it.dest && PDF_DOC) { goPdfPage(1); }
    });
    els.outlineList.appendChild(d);
  });
}
function wireOutlineSpy() {
  // active-section ring: mark outline item nearest viewport top
  try {
    const heads = els.mdBody.querySelectorAll('h1,h2,h3,h4');
    if (!heads.length) return;
    const items = els.outlineList.querySelectorAll('.outline-item');
    const onScroll = () => {
      let best = 0, bd = 1e9;
      heads.forEach((h, i) => {
        const r = h.getBoundingClientRect();
        const v = els.viewer.getBoundingClientRect();
        const d = Math.abs(r.top - v.top - 80);
        if (d < bd) { bd = d; best = i; }
      });
      items.forEach((it, i) => it.classList.toggle('active', i === best));
    };
    els.viewer.removeEventListener('scroll', wireOutlineSpy._fn || (() => {}));
    wireOutlineSpy._fn = onScroll;
    els.viewer.addEventListener('scroll', onScroll, { passive: true });
  } catch (e) {}
}
function renderTags() {
  if (!els.tagList) return;
  const agg = {};
  for (const f of S.files) {
    if ((f.kind || kindOf(f.name)) === 'pdf' || f.content == null) continue;
    const t = extractTags(f.content);
    for (const [k, v] of Object.entries(t)) agg[k] = (agg[k] || 0) + v;
  }
  const keys = Object.keys(agg).sort((a, b) => agg[b] - agg[a]);
  if (els.tagCount) els.tagCount.textContent = keys.length;
  els.tagList.innerHTML = '';
  if (els.tagEmpty) els.tagEmpty.style.display = keys.length ? 'none' : '';
  keys.slice(0, 200).forEach(k => {
    const d = document.createElement('div');
    d.className = 'tag-row';
    d.innerHTML = '<b></b><span class="cnt"></span>';
    d.querySelector('b').textContent = '#' + k;
    d.querySelector('.cnt').textContent = agg[k];
    d.addEventListener('click', () => {
      els.fileFilter.value = '#' + k;
      els.fileBox.classList.add('has');
      setPane('files');
      // filter by tag across contents
      S.files.forEach(() => {});
      renderFileListByTag(k);
    });
    els.tagList.appendChild(d);
  });
}
function renderFileListByTag(k) {
  const box = els.fileList;
  box.innerHTML = '';
  const list = S.files.filter(f => f.content && extractTags(f.content)[k]);
  els.filesEmpty.style.display = list.length ? 'none' : '';
  list.slice(0, 300).forEach(f => {
    const row = document.createElement('div');
    row.className = 'recent-item';
    row.innerHTML = '<div class="ico"><svg class="ic ic-sm"><use href="#i-file"/></svg></div><div class="meta"><div class="nm"></div><div class="sub"></div></div>';
    row.querySelector('.nm').textContent = f.name;
    row.querySelector('.sub').textContent = f.path;
    row.addEventListener('click', () => { els.fileFilter.value = ''; openFile(f.path); });
    box.appendChild(row);
  });
}
function renderBacklinks() {
  if (!els.backList) return;
  const f = S.activePath ? getFile(S.activePath) : null;
  els.backList.innerHTML = '';
  if (!f) { if (els.backEmpty) els.backEmpty.style.display = ''; return; }
  const base = f.name.replace(/\.[a-z0-9]+$/i, '').toLowerCase();
  const hits = S.files.filter(o => o.path !== f.path && o.content && o.content.toLowerCase().includes('[[' + base));
  if (els.backEmpty) els.backEmpty.style.display = hits.length ? 'none' : '';
  hits.slice(0, 50).forEach(h => {
    const d = document.createElement('div');
    d.className = 'recent-item';
    d.innerHTML = '<div class="ico"><svg class="ic ic-sm"><use href="#i-copy"/></svg></div><div class="meta"><div class="nm"></div><div class="sub"></div></div>';
    d.querySelector('.nm').textContent = h.name;
    d.querySelector('.sub').textContent = h.path;
    d.addEventListener('click', () => openFile(h.path));
    els.backList.appendChild(d);
  });
}

/* ---- markers (Heros PDF/Markdown mini-bar, 7 colors) ---- */
const MARK_COLORS = ['#ffd400', '#ff6b6a', '#4c8dff', '#22c55e', '#b45cf0', '#ff8a00', '#111418'];
let markColorIdx = 0;
function getMarks(path) { return (S.marks || {})[path] || []; }
function renderMarkList() {
  if (!els.markList) return;
  const marks = S.activePath ? getMarks(S.activePath) : [];
  els.markList.innerHTML = marks.length ? '' : '<div class="placeholder" style="padding:10px">No markers — select text, press H</div>';
  marks.slice(-50).forEach((mk, i) => {
    const d = document.createElement('div');
    d.className = 'recent-item';
    d.innerHTML = '<div class="ico" style="background:' + esc(mk.color) + '22;color:' + esc(mk.color) + '"><svg class="ic ic-sm"><use href="#i-text"/></svg></div><div class="meta"><div class="nm"></div><div class="sub"></div></div><button class="del" title="Delete"><svg class="ic ic-sm"><use href="#i-x"/></svg></button>';
    d.querySelector('.nm').textContent = (mk.quote || '').slice(0, 80);
    d.querySelector('.sub').textContent = mk.type + ' · ' + new Date(mk.at).toLocaleDateString();
    d.querySelector('.del').style.opacity = '1';
    d.querySelector('.del').addEventListener('click', () => {
      const arr = getMarks(S.activePath);
      arr.splice(marks.length - 1 - i >= 0 ? i : i, 1);
      S.marks[S.activePath] = arr;
      persist(); renderMarkList();
    });
    els.markList.appendChild(d);
  });
}
function addMark(type) {
  const sel = window.getSelection();
  const text = sel ? sel.toString().trim() : '';
  if (!text || !S.activePath) { toast('Select text first', 'err'); return; }
  S.marks = S.marks || {};
  const arr = S.marks[S.activePath] || (S.marks[S.activePath] = []);
  if (arr.length >= 400) arr.shift();
  arr.push({ quote: text.slice(0, 500), type, color: MARK_COLORS[markColorIdx++ % MARK_COLORS.length], at: Date.now() });
  persist(); renderMarkList();
  toast(type + ' saved', 'ok');
  hideSelBar();
}
function hideSelBar() { if (els.selBar) els.selBar.hidden = true; }
function showSelBar(x, y) {
  if (!els.selBar) return;
  els.selBar.style.left = Math.min(x, innerWidth - 220) + 'px';
  els.selBar.style.top = Math.max(8, y - 48) + 'px';
  els.selBar.hidden = false;
}

/* ==========================================================================
   POWER v2 engines — part 2: flashcards/quiz/Anki, stopwatch, pomodoro+chime,
   counters, habits+streaks, goals, reading tracker, per-file notes.
   ========================================================================== */
function genCards() {
  const f = S.activePath ? getFile(S.activePath) : null;
  const src = f && f.content ? f.content : S.files.map(x => x.content || '').join('\n');
  const cards = [];
  const push = (q, a) => {
    if (q && a && cards.length < 80) cards.push({ q: q.slice(0, 200), a: a.slice(0, 400), known: false });
  };
  // Q: / A: pairs
  const lines = String(src).split('\n');
  for (let i = 0; i < lines.length; i++) {
    const qm = lines[i].match(/^\s*Q:\s*(.+)$/);
    if (qm) {
      let a = '';
      for (let j = i + 1; j < Math.min(lines.length, i + 4); j++) {
        const am = lines[j].match(/^\s*A:\s*(.+)$/);
        if (am) { a = am[1]; break; }
      }
      if (a) push(qm[1], a);
    }
  }
  // headings + first sentence
  const heads = src.match(/^#{1,3}\s+(.+)$/gm) || [];
  heads.slice(0, 20).forEach(h => {
    const title = h.replace(/^#+\s*/, '');
    const idx = src.indexOf(h);
    const sent = (src.slice(idx + h.length).match(/[^.\n]{10,160}\./) || [''])[0].trim();
    if (sent) push('What: ' + title + '?', sent);
  });
  // bold terms
  const bolds = src.match(/\*\*([^*\n]{3,60})\*\*/g) || [];
  bolds.slice(0, 20).forEach(b => {
    const term = b.replace(/\*\*/g, '');
    const idx = src.indexOf(b);
    const sent = (src.slice(Math.max(0, idx - 80), idx + 160).replace(/\s+/g, ' ')).trim();
    if (sent) push('Define: ' + term, sent);
  });
  // cloze ==..==
  const clozes = src.match(/==([^=\n]{2,80})==/g) || [];
  clozes.slice(0, 20).forEach(c => {
    const ans = c.replace(/==/g, '');
    push('Fill in: ' + src.replace(c, '_____').slice(Math.max(0, src.indexOf(c) - 60), src.indexOf(c) + 60).replace(/\s+/g, ' '), ans);
  });
  S.cards = cards;
  S.quizKnown = {};
  persist(); renderCards();
  toast(cards.length + ' cards generated', cards.length ? 'ok' : 'err');
}
function renderCards() {
  if (!els.cardList) return;
  els.cardList.innerHTML = '';
  (S.cards || []).slice(0, 30).forEach((c, i) => {
    const d = document.createElement('div');
    d.className = 'flash-card';
    d.innerHTML = '<div class="q"></div><div class="a" hidden></div><div class="tool-row" style="margin-top:8px"><button class="btn ghost" style="height:30px;font-size:12px">Reveal</button><button class="btn ghost" style="height:30px;font-size:12px">Known ✓</button></div>';
    d.querySelector('.q').textContent = (i + 1) + '. ' + c.q;
    d.querySelector('.a').textContent = c.a;
    const [rv, kn] = d.querySelectorAll('button');
    rv.addEventListener('click', () => { d.querySelector('.a').hidden = !d.querySelector('.a').hidden; });
    kn.addEventListener('click', () => { S.quizKnown[i] = true; persist(); d.style.opacity = '.5'; });
    if (S.quizKnown[i]) d.style.opacity = '.5';
    els.cardList.appendChild(d);
  });
  if (!(S.cards || []).length) els.cardList.innerHTML = '<div class="placeholder" style="padding:10px">No cards — Generate from the open note</div>';
}
function openQuiz() {
  if (!(S.cards || []).length) genCards();
  if (!(S.cards || []).length) { toast('No cards to quiz', 'err'); return; }
  let i = 0, score = 0;
  const total = S.cards.length;
  const render = (show) => {
    const c = S.cards[i];
    showModal('Quiz ' + (i + 1) + ' / ' + total + ' · score ' + score,
      '<div class="flash-card"><div class="q">' + esc(c.q) + '</div>' +
      (show ? '<div class="a">' + esc(c.a) + '</div>' : '<div class="placeholder">Press Space to reveal</div>') + '</div>' +
      '<div class="tool-row"><button class="btn ghost" id="qPrev">← Prev</button>' +
      '<button class="btn accent" id="qShow">' + (show ? 'Hide' : 'Reveal') + '</button>' +
      '<button class="btn" id="qKnow">Known ✓</button>' +
      '<button class="btn ghost" id="qNext">Next →</button></div>');
    const rerender = (s) => render(s);
    els.modal.querySelector('#qShow').addEventListener('click', () => rerender(!show));
    els.modal.querySelector('#qPrev').addEventListener('click', () => { i = (i - 1 + total) % total; rerender(false); });
    els.modal.querySelector('#qNext').addEventListener('click', () => { i = (i + 1) % total; rerender(false); });
    els.modal.querySelector('#qKnow').addEventListener('click', () => {
      if (!S.quizKnown[i]) { S.quizKnown[i] = true; score++; persist(); }
      i = (i + 1) % total; rerender(false);
    });
  };
  render(false);
}
function ankiExport() {
  if (!(S.cards || []).length) { toast('Generate cards first', 'err'); return; }
  download('heros-todo-anki.tsv', S.cards.map(c => c.q.replace(/\t/g, ' ') + '\t' + c.a.replace(/\t/g, ' ')).join('\n'), 'text/tab-separated-values');
  toast('Anki TSV exported', 'ok');
}
function chime() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.frequency.value = 880; g.gain.value = 0.15;
    o.start(); o.stop(ctx.currentTime + 0.35);
    setTimeout(() => ctx.close(), 500);
  } catch (e) {}
}
function swTick() {
  if (!S.sw.running) return;
  const el = S.sw.elapsed + (Date.now() - S.sw.startedAt);
  paintSw(el);
}
function paintSw(el) {
  if (!els.swDigits) return;
  const cs = Math.floor(el / 10) % 100, s = Math.floor(el / 1000) % 60, m = Math.floor(el / 60000);
  els.swDigits.innerHTML = String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0') + '<small>.' + String(cs).padStart(2, '0') + '</small>';
}
function renderSwLaps() {
  if (!els.swLaps) return;
  els.swLaps.innerHTML = '';
  (S.sw.laps || []).slice(-20).reverse().forEach((l, i) => {
    const d = document.createElement('div');
    d.className = 'lap-row';
    d.innerHTML = '<span class="n">#' + ((S.sw.laps || []).length - i) + '</span><span class="t">' + esc(fmtDur(l)) + '</span>';
    els.swLaps.appendChild(d);
  });
}
function fmtDur(ms) {
  const s = Math.floor(ms / 1000);
  return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0') + '.' + String(Math.floor(ms % 1000 / 10)).padStart(2, '0');
}
function pomTick() {
  if (S.pom.phase === 'idle') return;
  const left = S.pom.until - Date.now();
  if (left <= 0) {
    chime();
    if (S.pom.phase === 'work') {
      S.pom.phase = 'break';
      S.pom.until = Date.now() + S.pom.breakMin * 60000;
      toast('Break time — ' + S.pom.breakMin + ' min', 'ok');
    } else {
      S.pom.phase = 'idle';
      clearInterval(S.pom.timer);
      toast('Focus complete', 'ok');
    }
    paintPom();
    return;
  }
  paintPom(left);
}
function paintPom(left) {
  const lbl = S.pom.phase === 'idle' ? 'idle'
    : (S.pom.phase === 'work' ? 'WORK ' : 'BREAK ') + fmtDur(left != null ? left : Math.max(0, S.pom.until - Date.now())).slice(0, 5);
  if (els.pomPhase) els.pomPhase.textContent = lbl.toLowerCase();
  if (els.sbPom) {
    els.sbPom.hidden = S.pom.phase === 'idle';
    if (els.sbPomLbl) els.sbPomLbl.textContent = '🍅 ' + lbl;
  }
}
function renderCounters() {
  if (!els.cntList) return;
  els.cntList.innerHTML = '';
  if (!(S.counters || []).length) els.cntList.innerHTML = '<div class="placeholder" style="padding:10px">No counters yet</div>';
  (S.counters || []).forEach((c, i) => {
    const d = document.createElement('div');
    d.className = 'cnt-row';
    d.innerHTML = '<span class="n"></span><span class="t"></span><span class="cnt-val"></span><span class="stepper"><button class="btn" data-a="-">−</button><button class="btn" data-a="+">+</button></span><button class="btn ghost" data-a="x" style="flex:0 0 auto;height:34px">×</button>';
    d.querySelector('.n').textContent = c.step;
    d.querySelector('.t').textContent = c.name;
    d.querySelector('.cnt-val').textContent = c.val;
    d.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
      if (b.dataset.a === '+') c.val += (+c.step || 1);
      else if (b.dataset.a === '-') c.val -= (+c.step || 1);
      else S.counters.splice(i, 1);
      persist(); renderCounters();
    }));
    els.cntList.appendChild(d);
  });
}
function dayKey(off) {
  const d = new Date(Date.now() - (off || 0) * 86400000);
  return d.toISOString().slice(0, 10);
}
function renderHabits() {
  if (!els.habitList) return;
  els.habitList.innerHTML = '';
  const names = Object.keys(S.habits || {});
  if (!names.length) els.habitList.innerHTML = '<div class="placeholder" style="padding:10px">No habits — add one above</div>';
  names.slice(0, 40).forEach(n => {
    const h = S.habits[n] || (S.habits[n] = {});
    const streak = (() => { let s = 0; for (let o = 0; o < 60; o++) { if (h[dayKey(o)]) s++; else if (o > 0) break; } return s; })();
    const card = document.createElement('div');
    card.className = 'tool-card';
    card.style.marginBottom = '8px';
    card.innerHTML = '<h4>' + esc(n) + ' <span class="pill">🔥 ' + streak + '</span></h4><div class="habit-grid"></div>';
    const grid = card.querySelector('.habit-grid');
    for (let o = 13; o >= 0; o--) {
      const k = dayKey(o);
      const b = document.createElement('button');
      b.className = h[k] ? 'on' : '';
      b.title = k;
      b.addEventListener('click', () => { h[k] = !h[k]; persist(); renderHabits(); markStudyDay(); });
      grid.appendChild(b);
    }
    els.habitList.appendChild(card);
  });
}
function markStudyDay() {
  S.studyDays = S.studyDays || {};
  S.studyDays[dayKey(0)] = true;
  persist();
}
function updateGoals() {
  const f = S.activePath ? getFile(S.activePath) : null;
  const w = f && f.content ? countWords(f.content) : 0;
  S.sessionWords = Math.max(S.sessionWords || 0, w);
  const today = dayKey(0);
  S.dayWords = S.dayWords || {};
  S.dayWords[today] = Math.max(S.dayWords[today] || 0, w);
  markStudyDay();
  const sessGoal = 300, dayGoal = 1000;
  if (els.goalSess) els.goalSess.textContent = Math.min(w, 9999) + ' / ' + sessGoal;
  if (els.goalSessFill) els.goalSessFill.style.width = Math.min(100, w / sessGoal * 100) + '%';
  if (els.goalDay) els.goalDay.textContent = (S.dayWords[today] || 0) + ' / ' + dayGoal;
  if (els.goalDayFill) els.goalDayFill.style.width = Math.min(100, (S.dayWords[today] || 0) / dayGoal * 100) + '%';
}
function trackReadingWords(text) {
  const w = countWords(text);
  const today = dayKey(0);
  S.dayWords = S.dayWords || {};
  S.dayWords[today] = Math.max(S.dayWords[today] || 0, w);
}

/* ==========================================================================
   POWER v2 engines — part 3: builder lab, exports, palette, features,
   reading prefs, vim nav, checklist import.
   ========================================================================== */
function lintDoc() {
  const f = S.activePath ? getFile(S.activePath) : null;
  if (!f || f.content == null) { toast('Open a note first', 'err'); return; }
  const issues = [];
  const lines = f.content.split('\n');
  lines.forEach((ln, i) => {
    if (ln.length > 120) issues.push('L' + (i + 1) + ': long line (' + ln.length + ' chars)');
    if (/\[\]\([^)]*\)/.test(ln)) issues.push('L' + (i + 1) + ': empty link');
  });
  let lastLvl = 0;
  lines.forEach((ln, i) => {
    const m = ln.match(/^(#{1,6})\s/);
    if (m) {
      if (m[1].length > lastLvl + 1 && lastLvl > 0) issues.push('L' + (i + 1) + ': heading jump H' + lastLvl + ' → H' + m[1].length);
      lastLvl = m[1].length;
    }
  });
  const anchors = new Set((f.content.match(/^#{1,4}\s+(.+)$/gm) || []).map(h => h.replace(/^#+\s*/, '').toLowerCase().replace(/[^\w]+/g, '-')));
  (f.content.match(/\[[^\]]+\]\(#[^)]+\)/g) || []).forEach(l => {
    const a = l.match(/\(#([^)]+)\)/)[1].toLowerCase();
    if (!anchors.has(a)) issues.push('Broken anchor: #' + a);
  });
  showModal('Markdown lint — ' + issues.length + ' issue(s)',
    issues.length ? '<div class="diff-col">' + esc(issues.slice(0, 60).join('\n')) + '</div>'
      : '<div class="placeholder">Clean — no issues found</div>');
}
function wordFreq(text, n) {
  const m = {};
  String(text || '').toLowerCase().replace(/```[\s\S]*?```/g, ' ').replace(/`[^`]*`/g, ' ')
    .replace(/[^a-z\u00c0-\u024f\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7af ]/gi, ' ')
    .split(/\s+/).filter(w => w.length > 2).forEach(w => m[w] = (m[w] || 0) + 1);
  return Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, n || 20);
}
function showSummary() {
  const text = activeText();
  if (!text) { toast('Open a note first', 'err'); return; }
  const sents = text.replace(/\n+/g, ' ').match(/[^.!?]{20,220}[.!?]/g) || [];
  const freq = Object.fromEntries(wordFreq(text, 200));
  const scored = sents.map(s => ({ s: s.trim(), sc: s.toLowerCase().split(/\s+/).reduce((a, w) => a + (freq[w.replace(/[^a-z]/gi, '')] || 0), 0) / Math.max(1, s.split(/\s+/).length) }));
  const top = scored.sort((a, b) => b.sc - a.sc).slice(0, 5).map(x => '• ' + x.s).join('\n');
  showModal('Summary — top sentences', '<div class="diff-col">' + esc(top || 'Too short to summarize') + '</div>');
}
function showKeywords() {
  const text = activeText();
  if (!text) { toast('Open a note first', 'err'); return; }
  const rows = wordFreq(text, 20);
  showModal('Keywords', rows.map(([w, c]) => '<div class="kv"><span>' + esc(w) + '</span><b>' + c + '</b><div class="freq-bar"><i style="width:' + Math.round(c / (rows[0][1] || 1) * 100) + '%"></i></div></div>').join('') || 'No keywords');
}
function showReadability() {
  const text = activeText();
  if (!text) { toast('Open a note first', 'err'); return; }
  const words = countWords(text);
  const sents = Math.max(1, (text.match(/[.!?]+/g) || []).length);
  const syll = (text.toLowerCase().match(/[aeiouy]+/g) || []).length;
  const ease = 206.835 - 1.015 * (words / sents) - 84.6 * (syll / Math.max(1, words));
  const grade = 0.39 * (words / sents) + 11.8 * (syll / Math.max(1, words)) - 15.59;
  showModal('Readability', '<div class="kv"><span>Flesch ease</span><b>' + ease.toFixed(1) + '</b></div><div class="kv"><span>Grade level</span><b>' + grade.toFixed(1) + '</b></div><div class="kv"><span>Words / sentences</span><b>' + words + ' / ' + sents + '</b></div>');
}
function showDiff() {
  const others = S.files.filter(f => f.path !== S.activePath && f.content != null).slice(0, 50);
  if (!others.length) { toast('Need 2 files', 'err'); return; }
  showModal('Visual diff — pick second file',
    '<div class="palette-list">' + others.map((f, i) => '<button class="palette-item" data-i="' + i + '">' + esc(f.path) + '</button>').join('') + '</div>');
  els.modal.querySelectorAll('[data-i]').forEach(b => b.addEventListener('click', () => {
    const a = (getFile(S.activePath) || {}).content || '';
    const bb = others[+b.dataset.i].content || '';
    const al = a.split('\n'), bl = bb.split('\n');
    // LCS-lite: mark common lines
    const setB = new Set(bl);
    const left = al.slice(0, 120).map(l => setB.has(l) ? l : '<span class="del">' + esc(l) + '</span>').join('\n');
    const setA = new Set(al);
    const right = bl.slice(0, 120).map(l => setA.has(l) ? l : '<span class="add">' + esc(l) + '</span>').join('\n');
    showModal('Diff', '<div class="diff-grid"><div class="diff-col">' + left + '</div><div class="diff-col">' + right + '</div></div>' +
      '<div class="tool-row" style="margin-top:10px"><button class="btn" id="diffPatch">Patch file</button></div>');
    els.modal.querySelector('#diffPatch').addEventListener('click', () => {
      download('changes.patch', '--- a\n+++ b\n' + al.filter(l => !setB.has(l)).map(l => '-' + l).join('\n') + '\n' + bl.filter(l => !setA.has(l)).map(l => '+' + l).join('\n'));
    });
  }));
}
function showLinkCheck() {
  const text = activeText();
  if (!text) { toast('Open a note first', 'err'); return; }
  const links = text.match(/\[[^\]]+\]\([^)]+\)/g) || [];
  const anchors = new Set((text.match(/^#{1,4}\s+(.+)$/gm) || []).map(h => h.replace(/^#+\s*/, '').toLowerCase().replace(/[^\w]+/g, '-')));
  const rows = links.map(l => {
    const u = l.match(/\(([^)]+)\)/)[1];
    const ok = u.startsWith('#') ? anchors.has(u.slice(1).toLowerCase()) : /^(https?:|mailto:)/.test(u);
    return '<div class="kv"><span>' + esc(l.slice(0, 60)) + '</span><b>' + (ok ? 'OK' : 'CHECK') + '</b></div>';
  });
  showModal('Link checker — ' + links.length, rows.join('') || 'No links');
}
const SPELL_DICT = new Set(('the and for with that this from have were been are was will would there their what when where which while about into over after before between through during under again once here when make like time just know take into').split(' '));
function showSpell() {
  const text = activeText();
  if (!text) { toast('Open a note first', 'err'); return; }
  const words = (text.toLowerCase().match(/[a-z]{4,}/g) || []).filter(w => !SPELL_DICT.has(w) && !(S.spellIgnore || []).includes(w));
  const uniq = [...new Set(words)].slice(0, 60);
  showModal('Spell scan — ' + uniq.length + ' unknown',
    (uniq.map(w => '<div class="kv"><span>' + esc(w) + '</span><b><button class="btn ghost" data-ig="' + esc(w) + '" style="height:26px;font-size:11px">Ignore</button></b></div>').join('') || 'Looks clean') +
    '<div class="meter">Built-in wordlist — technical terms will flag. Ignore persists.</div>');
  els.modal.querySelectorAll('[data-ig]').forEach(b => b.addEventListener('click', () => {
    S.spellIgnore.push(b.dataset.ig); persist(); hideModal(); toast('Ignored', 'ok');
  }));
}
const TEMPLATES = {
  study: '# Study: TITLE\n\n## Goals\n- [ ] \n\n## Notes\n\n## Summary\n',
  meeting: '# Meeting DATE\n\n## Attendees\n- \n\n## Decisions\n- [ ] \n\n## Next\n- [ ] \n',
  exam: '# Exam prep\n\nQ: \nA: \n\n## Cloze\n==answer==\n',
  journal: '# DATE\n\n## Today\n\n## Grateful\n- \n',
  thesis: '# Thesis\n\n## Abstract\n\n\\section{Intro}\n\n## Refs\n',
  habit: '# Habit tracker\n\n- [ ] Habit 1\n- [ ] Habit 2\n',
};
function showTemplates() {
  showModal('Templates — keys 1-6',
    Object.keys(TEMPLATES).map((k, i) => '<button class="palette-item" data-t="' + k + '"><b>' + (i + 1) + '</b> ' + k + '</button>').join(''));
  els.modal.querySelectorAll('[data-t]').forEach(b => b.addEventListener('click', () => {
    insertText('\n' + TEMPLATES[b.dataset.t]);
    hideModal();
  }));
}
function insertText(snip) {
  if (!els.mdEdit || els.mdEditWrap.hidden) { toast('Open Edit mode (E) first', 'err'); return; }
  const ta = els.mdEdit;
  const a = ta.selectionStart || 0, b = ta.selectionEnd || 0;
  ta.value = ta.value.slice(0, a) + snip + ta.value.slice(b);
  ta.focus();
}
function doInsert(kind) {
  const map = {
    bold: '**bold**', h2: '\n## Heading\n', link: '[title](https://)', table: '\n| A | B |\n|---|---|\n| 1 | 2 |\n',
    task: '\n- [ ] New task\n', math: '$x^2$', mathblock: '\n$$E = mc^2$$\n',
    mermaid: '\n```mermaid\nflowchart LR\n    A --> B\n```\n',
    callout: '\n> [!NOTE]\n> Note text\n', toc: '\n[[toc]]\n', details: '\n<details><summary>More</summary>\n\nText\n</details>\n',
  };
  if (kind === 'sort') {
    const ta = els.mdEdit;
    ta.value = ta.value.split('\n').sort((a, b) => a.localeCompare(b)).join('\n');
    saveDraft();
    return;
  }
  if (kind === 'dedup' || kind === 'trim' || kind === 'quote' || kind === 'casecycle') {
    transformLines(kind);
    return;
  }
  if (kind === 'replace') {
    const from = prompt('Find'); if (!from) return;
    const to = prompt('Replace with', '') || '';
    const n = els.mdEdit.value.split(from).length - 1;
    els.mdEdit.value = els.mdEdit.value.split(from).join(to);
    toast(n + ' replaced', 'ok');
    return;
  }
  insertText(map[kind] || '');
}
/* exports */
function expHtml() {
  const f = S.activePath ? getFile(S.activePath) : null;
  if (!f || f.content == null) { toast('Open a note first', 'err'); return; }
  const body = renderMarkdown(f.content, '');
  download(f.name.replace(/\.[a-z0-9]+$/i, '') + '.html',
    '<!DOCTYPE html><html><head><meta charset="utf-8"><title>' + esc(f.name) + '</title><style>body{font-family:system-ui;max-width:720px;margin:40px auto;padding:0 16px;line-height:1.7}</style></head><body>' + body + '</body></html>', 'text/html');
}
function expJson() {
  const f = S.activePath ? getFile(S.activePath) : null;
  if (!f) return;
  download(f.name + '.json', JSON.stringify({
    file: f.path, words: countWords(f.content || ''), headings: buildToc(f.content || ''),
    tasks: parseTasks(f.content || ''), tags: extractTags(f.content || ''), marks: getMarks(f.path),
  }, null, 2), 'application/json');
}
function expCsv() {
  const rows = wordFreq(activeText(), 100);
  download('frequency.csv', 'word,count\n' + rows.map(([w, c]) => '"' + w.replace(/"/g, '""') + '",' + c).join('\n'), 'text/csv');
}
function studyPack() {
  const f = S.activePath ? getFile(S.activePath) : null;
  const pack = '# Study pack — ' + (f ? f.path : 'workspace') + '\n\n' +
    '## Outline\n' + buildToc(activeText()).map(h => '- ' + h.text).join('\n') + '\n\n' +
    '## Tasks\n' + allTasks().slice(0, 100).map(t => '- [' + (t.done ? 'x' : ' ') + '] ' + t.text).join('\n') + '\n\n' +
    '## Source\n\n' + (activeText() || '').slice(0, 20000);
  download('study-pack.md', pack);
  toast('Study pack exported', 'ok');
}
async function mergePdfs() {
  try {
    const pdfs = S.files.filter(f => (f.kind || kindOf(f.name)) === 'pdf').slice(0, 20);
    if (pdfs.length < 2) { toast('Need 2+ PDFs in workspace', 'err'); return; }
    if (typeof PDFLib === 'undefined') throw new Error('PDF engine missing');
    setStatus('Merging…', 'busy');
    const out = await PDFLib.PDFDocument.create();
    for (const p of pdfs) {
      const bytes = await pdfBytes(p);
      const src = await PDFLib.PDFDocument.load(bytes, { ignoreEncryption: true });
      const pages = await out.copyPages(src, src.getPageIndices());
      pages.forEach(pg => out.addPage(pg));
    }
    const bytes = await out.save();
    const b = new Blob([bytes], { type: 'application/pdf' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(b); a.download = 'merged.pdf'; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    setStatus('Ready', 'ok');
    toast('Merged ' + pdfs.length + ' PDFs', 'ok');
  } catch (e) { setStatus('Ready'); toast('Merge failed: ' + (e.message || e), 'err'); }
}
/* command palette + features */
const COMMANDS = [
  ['Open folder…', () => pickFolder()], ['Rescan', () => loadActiveWorkspace()],
  ['Search (Ctrl+F)', () => { setPane('search'); setSidebar(true); }],
  ['Commands (Ctrl+K)', () => openPalette()],
  ['Edit (E)', () => { S.editing = !S.editing; renderMd(); }],
  ['Save (Ctrl+S)', () => { if (!els.mdEditWrap.hidden) els.btnSaveMd.click(); }],
  ['New note', () => createNote()], ['New folder', () => createFolder()],
  ['Generate flashcards', () => genCards()], ['Quiz me', () => openQuiz()], ['Anki export', () => ankiExport()],
  ['Stopwatch start/stop', () => { if (els.btnSwStart) els.btnSwStart.click(); }],
  ['Pomodoro focus', () => { setPane('study'); }],
  ['Lint', () => lintDoc()], ['Summary', () => showSummary()], ['Keywords', () => showKeywords()],
  ['Readability', () => showReadability()], ['Diff 2 files', () => showDiff()], ['Links check', () => showLinkCheck()], ['Spell scan', () => showSpell()],
  ['Templates (1-6)', () => showTemplates()], ['Export HTML', () => expHtml()], ['Export TXT', () => { if (els.btnExportTxt) els.btnExportTxt.click(); }],
  ['Export JSON', () => expJson()], ['Export CSV', () => expCsv()], ['Study pack', () => studyPack()], ['Merge PDFs', () => mergePdfs()],
  ['Backup', () => backupAll()], ['Theme (T)', () => toggleTheme()], ['Page mode (N)', () => { S.pageMode = { off: 'night', night: 'sepia', sepia: 'dim', dim: 'off' }[S.pageMode] || 'off'; applyPageMode(); persist(); }],
  ['Goal check', () => { updateGoals(); toast('Goals updated', 'ok'); }],
  ['Checklist import', () => checklistImport()], ['Print / PDF', () => window.print()],
];
function openPalette() {
  showModal('Commands — Ctrl+K', '<div class="search-box"><svg class="ic"><use href="#i-search"/></svg><input id="palIn" placeholder="Type a command…" autocomplete="off"></div><div class="palette-list" id="palList"></div>');
  const inp = els.modal.querySelector('#palIn');
  const list = els.modal.querySelector('#palList');
  const draw = (q) => {
    list.innerHTML = '';
    COMMANDS.filter(([n]) => !q || n.toLowerCase().includes(q.toLowerCase())).slice(0, 30).forEach(([n, fn]) => {
      const b = document.createElement('button');
      b.className = 'palette-item';
      b.textContent = n;
      b.addEventListener('click', () => { hideModal(); fn(); });
      list.appendChild(b);
    });
  };
  inp.addEventListener('input', () => draw(inp.value));
  draw('');
  setTimeout(() => inp.focus(), 50);
}
const FEATURE_CATALOG = [
  'Folders: pick any folder', 'Unlimited workspaces', 'Recursive scan 2000 files', 'MD · PDF · TEX · TXT · BIB list',
  'Type filter chips', 'File filter box', 'Pick files fallback', 'Drag & drop', 'Demo workspace', 'Recents 25',
  'Starred favorites', 'Reading bookmarks (D)', 'Resume last note', 'Auto rescan', 'New note', 'New folder',
  'GFM tables sortable', 'Interactive tasks', 'Footnotes', 'Frontmatter chips', 'Callouts NOTE/TIP/WARNING',
  'Details accordions', 'TOC [[toc]]', '==mark== ++ins++', 'Wikilinks [[..]]', '#tags + backlinks', 'Outline spy',
  'Section time badges', 'CJK counting', 'RTL layout', 'Copy HTML/outline/stats', 'Render meter',
  'KaTeX $ $$ \\(\\) \\[\\]', 'Currency-safe math', 'TEX outline', 'TEX math preview', 'BIB browser',
  'Mermaid 9 diagram types', 'Lazy idle diagrams', 'SVG export', 'Perf-mode diagram skip',
  'PDF lazy pages DPR2', 'PDF page jump', 'PDF zoom', 'PDF outline', 'PDF search', 'PDF thumbs',
  'PDF password unlock', 'Page PNG', 'Merge PDFs', 'Print/download',
  'Marker mini-bar H/U/S/C', '7 colors', 'Marker list/export',
  'Flashcards auto', 'Cloze cards', 'Quiz + score', 'Anki TSV export/import', 'Study pack', 'Per-file notes',
  'Stopwatch + laps', 'Pomodoro + chime', 'Counters', 'Habits 14-day + streaks', 'Writing goals', 'Reading tracker',
  'Live builder', 'Quick insert bar', 'Image paste', '6 templates', 'From URL', 'Paste new', 'Lint', 'Summary',
  'Keywords', 'Frequency CSV', 'Readability', 'Diff + patch', 'Link checker', 'Spell scan', 'Vim hjkl',
  'Custom CSS', 'Palette Ctrl+K', 'Features F', 'Find/replace', 'Sort lines', 'Print selection',
  'Exports MD/HTML/TXT/PDF/JSON/CSV', 'Backup/restore JSON', 'Dark/Light', '6 accents', 'Night/Sepia/Dim',
  '4 widths + 3 fonts', 'Justify + focus', 'Fullscreen + present', 'Silent boot', 'Free unlimited MIT',
];
function renderFeatures(filter, cat) {
  if (!els.featList) return;
  const q = (filter || '').toLowerCase();
  const c = cat || S.featCat || 'all';
  const norm = (f) => Array.isArray(f) ? { n: f[0], c: f[1] } : { n: f, c: featCatOf(f) };
  const list = FEATURE_CATALOG.map(norm).filter(f =>
    (c === 'all' || f.c === c) && (!q || f.n.toLowerCase().includes(q)));
  if (els.featCount) els.featCount.textContent = list.length;
  if (els.featCats) els.featCats.querySelectorAll('.type-chip').forEach(b => b.classList.toggle('on', b.dataset.cat === c));
  els.featList.innerHTML = '';
  list.slice(0, 400).forEach((f, i) => {
    const d = document.createElement('div');
    d.className = 'recent-item';
    d.innerHTML = '<div class="ico"><svg class="ic ic-sm"><use href="#i-check"/></svg></div><div class="meta"><div class="nm"></div></div><span class="cnt"></span>';
    d.querySelector('.nm').textContent = f.n;
    d.querySelector('.cnt').textContent = f.c;
    els.featList.appendChild(d);
  });
}
/* prefs apply */
function applyReadPrefs() {
  document.body.dataset.width = S.readWidth || 'comfort';
  document.body.dataset.rfont = S.readFont || 'sans';
  document.body.dataset.justify = S.justify ? '1' : '';
  document.body.dataset.focus = S.focusSent ? '1' : '';
  if (els.mdBody) { els.mdBody.style.fontFamily = 'var(--rfont)'; els.mdBody.style.lineHeight = S.lineHeight || 1.7; }
  if (els.lineHeight) { els.lineHeight.value = Math.round((S.lineHeight || 1.7) * 10); els.lineHeightLbl.textContent = (S.lineHeight || 1.7).toFixed(1); }
  if (els.widthSeg) els.widthSeg.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.w === S.readWidth));
  if (els.fontSeg) els.fontSeg.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.f === S.readFont));
  if (els.swJustify) els.swJustify.checked = !!S.justify;
  if (els.swFocusSent) els.swFocusSent.checked = !!S.focusSent;
  if (els.swBreaks) els.swBreaks.checked = S.breaks !== false;
  if (els.swPerf) els.swPerf.checked = !!S.perfMode;
  if (els.customCss && document.activeElement !== els.customCss) els.customCss.value = S.customCss || '';
  let st = document.getElementById('customCssTag');
  if (S.customCss) {
    if (!st) { st = document.createElement('style'); st.id = 'customCssTag'; document.head.appendChild(st); }
    st.textContent = S.customCss;
  } else if (st) st.remove();
}
async function createNote() {
  const ws = activeWs();
  if (!ws) { toast('Open a folder first', 'err'); return; }
  const name = prompt('New note name', 'note.md') || 'note.md';
  const clean = name.replace(/[\\/:*?"<>|]/g, '-').slice(0, 80) || 'note.md';
  const path = clean;
  if (getFile(path)) { toast('File exists', 'err'); return; }
  const nf = { path, name: clean, size: 0, mtime: Date.now(), kind: kindOf(clean), content: '# ' + clean.replace(/\.[a-z0-9]+$/i, '') + '\n\n' };
  if (ws.kind === 'dir') {
    try {
      const handle = await idbGet('ws:' + ws.id);
      if (handle) {
        await ensureDirPermission(handle, 'readwrite');
        const fh = await handle.getFileHandle(clean, { create: true });
        const w = await fh.createWritable();
        await w.write(nf.content); await w.close();
        nf.handle = fh;
      }
    } catch (e) { /* in-memory fallback */ }
  } else if (ws.kind === 'files') {
    const stored = (await idbGet('ws:' + ws.id)) || [];
    stored.push({ ...nf });
    await idbSet('ws:' + ws.id, stored);
  }
  S.files.push(nf);
  await persist();
  openFile(path);
  S.editing = true; renderMd();
  toast('Note created', 'ok');
}
async function createFolder() {
  const ws = activeWs();
  if (!ws || ws.kind !== 'dir') { toast('Needs a writable folder workspace', 'err'); return; }
  const name = prompt('New folder name', 'notes');
  if (!name) return;
  try {
    const handle = await idbGet('ws:' + ws.id);
    await ensureDirPermission(handle, 'readwrite');
    await handle.getDirectoryHandle(name.replace(/[\\/:*?"<>|]/g, '-'), { create: true });
    await loadActiveWorkspace();
    toast('Folder created', 'ok');
  } catch (e) { toast('Failed: ' + (e.message || e), 'err'); }
}
function checklistImport() {
  const txt = prompt('Paste - [ ] checklist lines');
  if (txt) {
    const lines = txt.split('\n').filter(l => /\[ \]/.test(l));
    if (!lines.length) { toast('No tasks found', 'err'); return; }
    addTask(lines.map(l => l.replace(/^.*\[ \]\s*/, '')).join('\n- [ ] '));
  }
}
async function loadFromUrl() {
  const u = prompt('Raw markdown URL (https://…)');
  if (!u) return;
  try {
    setStatus('Fetching…', 'busy');
    const r = await fetch(u);
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const text = await r.text();
    const name = (u.split('/').pop() || 'url.md').split('?')[0].slice(0, 80) || 'url.md';
    S.files.push({ path: name, name, size: text.length, mtime: Date.now(), kind: kindOf(name), content: text });
    openFile(name);
    setStatus('Ready', 'ok');
  } catch (e) { setStatus('Ready'); toast('Fetch blocked (CORS?) — download the file instead', 'err'); }
}

/* ==========================================================================
   WAVE 3 engines — part A: file sort/groups, workspace pins+colors+filter,
   file rename/duplicate/delete, in-file find, due buckets, TTS read-aloud.
   ========================================================================== */
function sortFiles(list) {
  const m = S.fileSort || 'name-asc';
  const openCount = (f) => parseTasks((f.content || '')).filter(t => !t.done).length;
  const cmp = {
    'name-asc': (a, b) => a.path.localeCompare(b.path),
    'name-desc': (a, b) => b.path.localeCompare(a.path),
    'mtime-desc': (a, b) => (b.mtime || 0) - (a.mtime || 0),
    'mtime-asc': (a, b) => (a.mtime || 0) - (b.mtime || 0),
    'size-desc': (a, b) => (b.size || 0) - (a.size || 0),
    'tasks-desc': (a, b) => openCount(b) - openCount(a),
  }[m] || ((a, b) => 0);
  return list.slice().sort(cmp);
}
const WS_COLORS = ['#4c8dff', '#22c55e', '#b45cf0', '#ff6b6a', '#ff8a00', '#14b8a6'];
function wsColorOf(id) { return (S.wsColors || {})[id] || 'var(--accent)'; }
function wsPinToggle(id) {
  S.wsPins = S.wsPins || [];
  const i = S.wsPins.indexOf(id);
  if (i >= 0) S.wsPins.splice(i, 1); else S.wsPins.push(id);
  persist(); renderWsList();
}
function wsColorCycle(id) {
  S.wsColors = S.wsColors || {};
  const cur = WS_COLORS.indexOf(S.wsColors[id]);
  S.wsColors[id] = WS_COLORS[(cur + 1) % WS_COLORS.length];
  persist(); renderWsList(); renderWsSelect();
}
/* nested file ops inside folder workspaces */
async function parentDir(root, path, create) {
  const segs = String(path || '').split('/').slice(0, -1).filter(Boolean);
  let dir = root;
  for (const s of segs) dir = await dir.getDirectoryHandle(s, { create: !!create });
  return dir;
}
function baseName(p) { return String(p || '').split('/').pop(); }
async function renameFile() {
  const f = S.activePath ? getFile(S.activePath) : null;
  if (!f) { toast('Open a file first', 'err'); return; }
  const nn = prompt('Rename to', f.name);
  if (!nn) return;
  const clean = nn.replace(/[\\/:*?"<>|]/g, '-').slice(0, 80).trim() || f.name;
  if (!isSupportedFile(clean)) { toast('Keep a supported extension (.md .pdf .tex .txt .bib)', 'err'); return; }
  const dir = f.path.includes('/') ? f.path.slice(0, f.path.lastIndexOf('/') + 1) : '';
  const np = dir + clean;
  if (getFile(np)) { toast('A file with that name exists', 'err'); return; }
  const ws = activeWs();
  try {
    if (ws && ws.kind === 'dir' && f.handle) {
      const root = await idbGet('ws:' + ws.id);
      await ensureDirPermission(root, 'readwrite');
      const parent = await parentDir(root, f.path, false);
      const src = await parent.getFileHandle(baseName(f.path));
      const data = await (await src.getFile()).arrayBuffer();
      const dst = await parent.getFileHandle(clean, { create: true });
      const w = await dst.createWritable();
      await w.write(data); await w.close();
      await parent.removeEntry(baseName(f.path));
      f.handle = dst;
    } else if (ws && ws.kind === 'files') {
      const stored = (await idbGet('ws:' + ws.id)) || [];
      const it = stored.find(x => x.path === f.path);
      if (it) { it.path = np; it.name = clean; await idbSet('ws:' + ws.id, stored); }
    }
    f.path = np; f.name = clean; f.kind = kindOf(clean);
    if (ws) ws.lastFilePath = np;
    S.activePath = np;
    await persist();
    renderFileList(); await renderMd(); renderTodo(); renderOutline(); renderTags(); updateStats();
    toast('Renamed', 'ok');
  } catch (e) { toast('Rename failed: ' + errName(e), 'err'); }
}
async function duplicateFile() {
  const f = S.activePath ? getFile(S.activePath) : null;
  if (!f || f.content == null) { toast('Open a note first (PDFs cannot duplicate yet)', 'err'); return; }
  const ws = activeWs();
  const dir = f.path.includes('/') ? f.path.slice(0, f.path.lastIndexOf('/') + 1) : '';
  const dot = f.name.lastIndexOf('.');
  const np = dir + f.name.slice(0, dot) + '-copy' + f.name.slice(dot);
  if (getFile(np)) { toast('Copy already exists', 'err'); return; }
  const nf = { path: np, name: baseName(np), size: f.size, mtime: Date.now(), kind: f.kind, content: f.content };
  try {
    if (ws && ws.kind === 'dir') {
      const root = await idbGet('ws:' + ws.id);
      await ensureDirPermission(root, 'readwrite');
      const parent = await parentDir(root, np, true);
      const fh = await parent.getFileHandle(baseName(np), { create: true });
      const w = await fh.createWritable();
      await w.write(nf.content); await w.close();
      nf.handle = fh;
    } else if (ws && ws.kind === 'files') {
      const stored = (await idbGet('ws:' + ws.id)) || [];
      stored.push({ ...nf });
      await idbSet('ws:' + ws.id, stored);
    }
    S.files.push(nf);
    await persist();
    openFile(np);
    toast('Duplicated', 'ok');
  } catch (e) { toast('Duplicate failed: ' + errName(e), 'err'); }
}
async function deleteFile() {
  const f = S.activePath ? getFile(S.activePath) : null;
  if (!f) { toast('Open a file first', 'err'); return; }
  if (!confirm('Delete "' + f.path + '"? Disk copy is removed for folder workspaces.')) return;
  const ws = activeWs();
  try {
    if (ws && ws.kind === 'dir' && f.handle) {
      const root = await idbGet('ws:' + ws.id);
      await ensureDirPermission(root, 'readwrite');
      const parent = await parentDir(root, f.path, false);
      await parent.removeEntry(baseName(f.path));
    } else if (ws && ws.kind === 'files') {
      const stored = (await idbGet('ws:' + ws.id)) || [];
      await idbSet('ws:' + ws.id, stored.filter(x => x.path !== f.path));
    }
    S.files = S.files.filter(x => x.path !== f.path);
    S.activePath = null; S.editing = false;
    await persist();
    els.mdWrap.hidden = true; els.empty.hidden = false;
    renderFileList(); renderTodo(); renderOutline(); renderTags(); updateStats();
    toast('Deleted', 'ok');
  } catch (e) { toast('Delete failed: ' + errName(e), 'err'); }
}
/* in-file find */
const FIND = { marks: [], idx: -1 };
function clearFind(silent) {
  FIND.marks = []; FIND.idx = -1;
  if (els.findCount) els.findCount.textContent = '0';
  try {
    if (els.mdBody) els.mdBody.querySelectorAll('mark.findhit').forEach(m => {
      m.replaceWith(document.createTextNode(m.textContent));
    });
    if (els.mdBody) els.mdBody.normalize();
  } catch (e) {}
  if (!silent && els.findBar) els.findBar.hidden = true;
}
function runFind() {
  clearFind(true);
  const q = (els.findInput && els.findInput.value) || '';
  if (!q || !els.mdBody || els.mdBody.hidden) { if (els.findCount) els.findCount.textContent = '0'; return; }
  const ql = q.toLowerCase();
  let walker = null;
  try {
    walker = document.createTreeWalker(els.mdBody, NodeFilter.SHOW_TEXT, {
      acceptNode(n) {
        if (!n.nodeValue || n.nodeValue.toLowerCase().indexOf(ql) < 0) return NodeFilter.FILTER_SKIP;
        const p = n.parentElement;
        if (p && p.closest('pre,.katex,.mermaid,.math-block,code')) return NodeFilter.FILTER_SKIP;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
  } catch (e) { return; }
  const nodes = [];
  while (nodes.length < 300 && walker.nextNode()) nodes.push(walker.currentNode);
  let count = 0;
  for (const node of nodes) {
    const text = node.nodeValue;
    const low = text.toLowerCase();
    let last = 0, i = -1;
    const frag = document.createDocumentFragment();
    let added = false;
    while ((i = low.indexOf(ql, last)) >= 0 && count < 500) {
      count++;
      frag.append(document.createTextNode(text.slice(last, i)));
      const mk = document.createElement('mark');
      mk.className = 'hl findhit';
      mk.textContent = text.slice(i, i + q.length);
      frag.append(mk);
      last = i + q.length;
      added = true;
      if (!q.length) break;
    }
    if (added) {
      frag.append(document.createTextNode(text.slice(last)));
      node.replaceWith(frag);
    }
  }
  FIND.marks = Array.from(els.mdBody.querySelectorAll('mark.findhit'));
  FIND.idx = FIND.marks.length ? 0 : -1;
  paintFind();
}
function paintFind() {
  if (els.findCount) els.findCount.textContent = FIND.marks.length ? (FIND.idx + 1) + ' / ' + FIND.marks.length : '0';
  FIND.marks.forEach((m, i) => m.classList.toggle('current', i === FIND.idx));
  if (FIND.idx >= 0 && FIND.marks[FIND.idx]) {
    try { FIND.marks[FIND.idx].scrollIntoView({ block: 'center' }); } catch (e) {}
  }
}
function stepFind(d) {
  if (!FIND.marks.length) return;
  FIND.idx = (FIND.idx + d + FIND.marks.length) % FIND.marks.length;
  paintFind();
}
/* due buckets + today/daily/random */
function todayStr(off) {
  const d = new Date(Date.now() + (off || 0) * 86400000);
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
function bucketDue(due) {
  if (!due) return 'none';
  const t = todayStr();
  if (due < t) return 'overdue';
  if (due === t) return 'today';
  return 'upcoming';
}
function showToday() {
  const all = allTasks().filter(t => !t.done && t.due && bucketDue(t.due) !== 'upcoming');
  const rows = all.slice(0, 100).map((t, i) =>
    '<button class="palette-item" data-i="' + i + '"><b>' + esc(t.due || '') + '</b> ' + esc((t.prio ? '!'.repeat(t.prio) + ' ' : '') + t.text) + ' <span class="todo-doc">' + esc(t.name) + '</span></button>').join('');
  showModal('Today — ' + all.length + ' due', '<div class="palette-list">' + (rows || '<div class="placeholder">Nothing due. Enjoy the calm.</div>') + '</div>');
  els.modal.querySelectorAll('[data-i]').forEach(b => b.addEventListener('click', () => {
    const t = all[+b.dataset.i];
    hideModal();
    openFile(t.path);
  }));
}
async function ensureNote(path, initial) {
  if (getFile(path)) { openFile(path); return; }
  const ws = activeWs();
  if (!ws) { toast('Open a folder first', 'err'); return; }
  const nf = { path, name: baseName(path), size: (initial || '').length, mtime: Date.now(), kind: kindOf(path), content: initial || '' };
  try {
    if (ws.kind === 'dir') {
      const root = await idbGet('ws:' + ws.id);
      await ensureDirPermission(root, 'readwrite');
      const parent = await parentDir(root, path, true);
      const fh = await parent.getFileHandle(baseName(path), { create: true });
      const w = await fh.createWritable();
      await w.write(nf.content); await w.close();
      nf.handle = fh;
    } else if (ws.kind === 'files') {
      const stored = (await idbGet('ws:' + ws.id)) || [];
      stored.push({ ...nf });
      await idbSet('ws:' + ws.id, stored);
    }
    S.files.push(nf);
    await persist();
    renderFileList();
    openFile(path);
  } catch (e) { toast('Note failed: ' + errName(e), 'err'); }
}
function dailyNote() {
  const p = todayStr() + '.md';
  ensureNote(p, '# ' + todayStr() + '\n\n## Today\n- [ ] \n\n## Notes\n');
}
function randomNote() {
  const pool = S.files.filter(f => (f.kind || kindOf(f.name)) !== 'pdf' && f.content != null);
  if (!pool.length) { toast('No notes yet', 'err'); return; }
  const pick = pool[Math.floor(Math.random() * pool.length)];
  openFile(pick.path);
  setSidebar(false);
  toast(pick.name, 'ok');
}
/* editor line transforms + print selection + copy path + present mode */
function selLines() {
  const ta = els.mdEdit;
  const s = ta.selectionStart || 0, e = ta.selectionEnd || 0;
  const v = ta.value;
  const a = v.lastIndexOf('\n', s - 1) + 1;
  let b = v.indexOf('\n', e);
  if (b < 0) b = v.length;
  return { ta, v, a, b, sel: s !== e };
}
function transformLines(kind) {
  if (!els.mdEdit || els.mdEditWrap.hidden) { toast('Open Edit mode (E) first', 'err'); return; }
  const { ta, v, a, b } = selLines();
  const scope = v.slice(a, b).split('\n');
  if (kind === 'dedup') {
    const seen = new Set();
    const out = scope.filter(l => {
      const k = l.trim();
      if (!k) return true;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
    ta.value = v.slice(0, a) + out.join('\n') + v.slice(b);
  } else if (kind === 'trim') {
    ta.value = v.slice(0, a) + scope.map(l => l.replace(/[ \t]+$/, '')).join('\n') + v.slice(b);
  } else if (kind === 'quote') {
    const allQuoted = scope.every(l => !l.trim() || /^>\s?/.test(l));
    ta.value = v.slice(0, a) + scope.map(l => {
      if (!l.trim()) return l;
      return allQuoted ? l.replace(/^>\s?/, '') : '> ' + l;
    }).join('\n') + v.slice(b);
  } else if (kind === 'casecycle') {
    const t = scope.join('\n');
    const isUpper = t === t.toUpperCase() && /[A-Za-z]/.test(t);
    const isTitle = /^[A-Z]/.test(t.trim());
    const nt = isUpper ? t.toLowerCase()
      : isTitle ? t.toUpperCase()
      : t.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
    ta.value = v.slice(0, a) + nt + v.slice(b);
  } else return;
  saveDraft();
  toast('Done', 'ok');
}
function printSelection() {
  const t = ((window.getSelection() || '').toString().trim()) ||
    (els.mdBody && !els.mdBody.hidden ? (els.mdBody.innerText || '').trim() : '');
  if (!t) { toast('Select text first', 'err'); return; }
  const w = window.open('', '_blank', 'width=700,height=800');
  if (!w) { toast('Popup blocked — allow popups and retry', 'err'); return; }
  w.document.write('<!DOCTYPE html><html><head><meta charset="utf-8"><title>Selection</title>' +
    '<style>body{font-family:system-ui,sans-serif;max-width:640px;margin:40px auto;padding:0 16px;line-height:1.7}</style>' +
    '</head><body><pre style="white-space:pre-wrap;font-family:inherit">' +
    t.replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</pre></body></html>');
  w.document.close();
  w.focus();
  try { w.print(); } catch (e) {}
}
function copyPath() {
  const f = S.activePath ? getFile(S.activePath) : null;
  if (!f) { toast('Open a file first', 'err'); return; }
  navigator.clipboard.writeText(f.path).then(() => toast('Path copied', 'ok'), () => toast('Copy failed', 'err'));
}
function togglePresent() {
  const on = !document.body.classList.contains('present');
  document.body.classList.toggle('present', on);
  toast(on ? 'Present mode — Esc exits' : 'Present off', 'ok');
}
function goFullscreen() {
  try {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen();
  } catch (e) { toast('Fullscreen blocked', 'err'); }
}
/* read aloud — chunked, voiced, resumable. Zero deps, fully local.
   Fixes the three real-world silences: no OS voices (common on Linux),
   Chrome dropping cancel()+speak() pairs, and stalls on long text. */
const TTS = { queue: [], idx: 0, active: false, started: false, watch: 0 };
function ttsVoices() {
  try {
    if (typeof speechSynthesis === 'undefined') return [];
    return speechSynthesis.getVoices() || [];
  } catch (e) { return []; }
}
function ttsPickVoice() {
  const vs = ttsVoices();
  if (!vs.length) return null;
  if (S.ttsVoice) {
    const hit = vs.find(v => v.voiceURI === S.ttsVoice);
    if (hit) return hit;
  }
  return vs.find(v => /^en([-_]|$)/i.test(v.lang || '') && /local/i.test(v.name || '')) ||
    vs.find(v => /^en([-_]|$)/i.test(v.lang || '')) ||
    vs.find(v => /local/i.test(v.name || '')) ||
    vs[0];
}
function ensureVoices() {
  const fill = () => {
    if (!els.ttsVoice) return;
    const vs = ttsVoices();
    els.ttsVoice.innerHTML = vs.length ? '' : '<option value="">No voices on system</option>';
    vs.forEach(v => {
      const o = document.createElement('option');
      o.value = v.voiceURI;
      o.textContent = v.name + ' (' + v.lang + ')';
      if (v.voiceURI === S.ttsVoice) o.selected = true;
      els.ttsVoice.appendChild(o);
    });
  };
  fill();
  try { speechSynthesis.onvoiceschanged = fill; } catch (e) {}
}
function chunkText(t) {
  // protect URLs, emails and abbreviations so dots inside them never split
  const keep = [];
  const s = String(t || '').replace(/\s+/g, ' ')
    .replace(/https?:\/\/\S+|\S+@\S+\.\S+|\b(?:[A-Za-z]\.){2,}/g, (m) => {
      keep.push(m);
      return 'HHHKEEP' + (keep.length - 1) + 'HHH';
    });
  const parts = s.match(/[^.!?]+[.!?]+|\S[\s\S]*$/g) || [];
  const back = (x) => x.replace(/HHHKEEP(\d+)HHH/g, (mm, i) => keep[+i] || mm);
  const out = [];
  let cur = '';
  for (const p of parts.map(x => back(x).trim()).filter(Boolean)) {
    if ((cur + ' ' + p).trim().length > 320) {
      if (cur) out.push(cur);
      cur = p;
    } else cur = (cur + ' ' + p).trim();
  }
  if (cur) out.push(cur);
  return out.flatMap(hardSplit).filter(Boolean);
}
function hardSplit(c) {
  // lossless: prefer word boundaries, hard-slice spaceless runs (long URLs/tokens)
  if (c.length <= 600) return [c];
  const out = [];
  let s = c;
  while (s.length > 600) {
    let cut = s.lastIndexOf(' ', 580);
    if (cut < 100) cut = 580;
    out.push(s.slice(0, cut).trim() || s.slice(0, cut));
    s = s.slice(cut).trim();
    if (!s) break;
  }
  if (s) out.push(s);
  return out.filter(Boolean);
}
function ttsSpeak(text) {
  try { speechSynthesis.cancel(); } catch (e) {}
  if (typeof speechSynthesis === 'undefined' || !('speechSynthesis' in window)) {
    toast('Speech not supported in this browser', 'err');
    return;
  }
  let src = typeof text === 'string' ? text : '';
  if (!src) {
    const shown = els.mdBody && !els.mdBody.hidden ? (els.mdBody.innerText || '') : '';
    src = shown.trim() || ((S.activePath && (S.pdfText || {})[S.activePath]) || '') || activeText() || '';
  }
  src = sanitizeTts(src).replace(/\s+/g, ' ').trim().slice(0, 30000);
  if (!src) { toast('Nothing to read', 'err'); return; }
  try { speechSynthesis.resume(); } catch (e) {}
  TTS.queue = chunkText(src);
  if (!TTS.queue.length) { toast('Nothing to read', 'err'); return; }
  TTS.idx = 0; TTS.active = true; TTS.started = false;
  TTS.retry = false; TTS.voiceIdx = -1; TTS.forceVoiceURI = null;
  if (els.readBar) els.readBar.hidden = false;
  paintTtsProg();
  setStatus('Reading…');
  setTimeout(() => { if (TTS.active) speakChunk(); }, 120);
  clearTimeout(TTS.watch);
  TTS.watch = setTimeout(() => {
    if (TTS.active && !TTS.started) {
      ttsStop();
      toast('No voice responded — this system has no speech voices (Linux: install speech-dispatcher + espeak-ng, then reload the panel)', 'err');
    }
  }, 3000);
}
function sanitizeTts(t) {
  // some engines fail the whole utterance on control / zero-width / object-replacement chars
  return String(t || '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u200B-\u200D\uFEFF\uFFFC]/g, '');
}
function ttsTryNextVoice() {
  // a listed voice is often the broken part — cycle to the next one automatically
  const vs = ttsVoices();
  if (!vs.length) return false;
  const ordered = vs.slice();
  const curURI = TTS.forceVoiceURI || S.ttsVoice || ((ttsPickVoice() || {}).voiceURI) || null;
  const i = ordered.findIndex(v => v.voiceURI === curURI);
  TTS.voiceIdx = i < 0 ? 0 : i + 1;
  if (TTS.voiceIdx >= ordered.length) return false;
  const v = ordered[TTS.voiceIdx];
  TTS.retry = false;
  TTS.forceVoiceURI = v.voiceURI;
  S.ttsVoice = v.voiceURI;
  if (els.ttsVoice) els.ttsVoice.value = v.voiceURI;
  try { persist(); } catch (e) {}
  toast('Voice failed — trying ' + v.name + '…');
  setTimeout(() => { if (TTS.active) speakChunk(); }, 200);
  return true;
}
function speakChunk() {
  if (!TTS.active || TTS.idx >= TTS.queue.length) { ttsDone(); return; }
  let u = null;
  try {
    u = new SpeechSynthesisUtterance(TTS.queue[TTS.idx]);
  } catch (e) {
    ttsStop();
    toast('Read failed: ' + errName(e), 'err');
    return;
  }
  const vs = ttsVoices();
  const v = (TTS.forceVoiceURI && vs.find(x => x.voiceURI === TTS.forceVoiceURI)) || ttsPickVoice();
  if (v) { try { u.voice = v; u.lang = v.lang; } catch (e) {} }
  try { u.rate = Math.min(2, Math.max(0.5, (+els.ttsRate.value || 10) / 10)); } catch (e) {}
  u.onstart = () => { TTS.started = true; TTS.retry = false; };
  u.onend = () => {
    if (!TTS.active) return;
    TTS.idx++;
    paintTtsProg();
    speakChunk();
  };
  u.onerror = (ev) => {
    if (!TTS.active) return;
    const err = ev && ev.error;
    if (err === 'interrupted' || err === 'canceled') return; // our own stop()
    if (err === 'synthesis-failed' || err === 'synthesis-unavailable' || err === 'audio-busy' || err === 'audio-hardware' || err === 'network') {
      if (!TTS.retry) {
        // known Chrome flake: first utterance after load often fails — one same-voice retry
        TTS.retry = true;
        setTimeout(() => { if (TTS.active) speakChunk(); }, 250);
        return;
      }
      if (ttsTryNextVoice()) return;
    }
    ttsStop();
    console.warn('[HerosTodo] read stopped:', err || 'speech error');
  };
  try {
    speechSynthesis.speak(u);
  } catch (e) {
    ttsStop();
    toast('Read failed: ' + errName(e), 'err');
  }
}
function paintTtsProg() {
  if (els.ttsProg) els.ttsProg.textContent = TTS.queue.length ? (Math.min(TTS.idx + 1, TTS.queue.length) + ' / ' + TTS.queue.length) : '';
}
function ttsDone() {
  const was = TTS.active;
  TTS.active = false; TTS.queue = []; TTS.idx = 0;
  clearTimeout(TTS.watch);
  if (els.readBar) els.readBar.hidden = true;
  if (was) setStatus('Ready', 'ok');
}
function ttsStop() {
  TTS.active = false;
  try { speechSynthesis.cancel(); } catch (e) {}
  clearTimeout(TTS.watch);
  if (els.readBar) els.readBar.hidden = true;
}
function ttsStop() {
  try { speechSynthesis.cancel(); } catch (e) {}
  if (els.readBar) els.readBar.hidden = true;
}

/* ==========================================================================
   WAVE 3 engines — part B: editor drafts, table/TOC generators, task hotkey,
   system theme, reading progress, 200+ feature catalog.
   ========================================================================== */
let draftTimer = null;
function draftKey() { return S.activePath ? fileKey(S.activePath) : null; }
function saveDraft() {
  const k = draftKey();
  if (!k || !els.mdEdit || els.mdEditWrap.hidden) return;
  const f = getFile(S.activePath);
  const v = els.mdEdit.value;
  if (f && v === f.content) {
    if (S.drafts[k]) { delete S.drafts[k]; persist(); }
  } else {
    S.drafts[k] = v;
    persist();
  }
  refreshDirty();
}
function refreshDirty() {
  const f = S.activePath ? getFile(S.activePath) : null;
  const live = els.mdEdit && !els.mdEditWrap.hidden ? els.mdEdit.value : null;
  const dirty = !!(f && live != null && live !== f.content);
  if (els.dirtyDot) {
    els.dirtyDot.style.background = dirty ? 'var(--accent)' : 'var(--ok)';
    els.dirtyDot.title = dirty ? 'Unsaved changes (auto-drafted)' : 'Saved';
  }
  if (els.editCounts && live != null) {
    els.editCounts.textContent = countWords(live) + ' words · ' + live.length + ' chars';
  }
}
function applyEditorPrefs() {
  if (els.mdEdit) els.mdEdit.classList.toggle('nowrap', S.editorWrap === false);
  if (els.btnWrap) els.btnWrap.classList.toggle('on', S.editorWrap !== false);
  refreshDirty();
}
function tableMd(r, c) {
  r = Math.min(12, Math.max(1, +r || 3));
  c = Math.min(8, Math.max(1, +c || 3));
  let h = '\n';
  for (let j = 0; j < c; j++) h += '| Col ' + (j + 1) + ' ';
  h += '|\n';
  for (let j = 0; j < c; j++) h += '|---';
  h += '|\n';
  for (let i = 0; i < r; i++) {
    for (let j = 0; j < c; j++) h += '|  ';
    h += '|\n';
  }
  return h;
}
function tocInsertText() {
  const hs = buildToc(activeText());
  if (!hs.length) { toast('No headings to index', 'err'); return; }
  return '\n' + hs.map(h => '  '.repeat(h.lvl - 1) + '- [' + h.text + '](#' + h.text.toLowerCase().replace(/[^\w]+/g, '-') + ')').join('\n') + '\n';
}
function toggleTaskLine() {
  const ta = els.mdEdit;
  if (!ta || els.mdEditWrap.hidden) return;
  const pos = ta.selectionStart || 0;
  const lines = ta.value.split('\n');
  let acc = 0, li = 0;
  for (let i = 0; i < lines.length; i++) {
    acc += lines[i].length + 1;
    if (acc > pos) { li = i; break; }
    li = i;
  }
  const m = lines[li].match(/^(\s*[-*+]\s+)\[([ xX])\](.*)$/);
  if (m) {
    lines[li] = m[1] + '[' + (m[2].toLowerCase() === 'x' ? ' ' : 'x') + ']' + m[3];
    ta.value = lines.join('\n');
    saveDraft();
    toast('Task toggled', 'ok');
  } else {
    lines[li] = '- [ ] ' + lines[li];
    ta.value = lines.join('\n');
    saveDraft();
  }
}
function effTheme() {
  if (S.theme !== 'system') return S.theme;
  try {
    if (window.matchMedia && matchMedia('(prefers-color-scheme: light)').matches) return 'light';
  } catch (e) {}
  return 'dark';
}
let progRaf = 0;
function updateReadProg() {
  const v = els.viewer;
  if (!v) return;
  const max = v.scrollHeight - v.clientHeight;
  const p = max > 2 ? Math.min(1, Math.max(0, v.scrollTop / max)) : 0;
  const show = !els.mdWrap.hidden && !els.mdBody.hidden;
  if (els.readProgWrap) els.readProgWrap.hidden = !show;
  if (els.readProgFill) els.readProgFill.style.width = Math.round(p * 100) + '%';
}
function featCatOf(n) {
  const s = String(n).toLowerCase();
  if (/folder|workspace|repositor|recent|starred|bookmark|resume|rescan|filter|type chip|drag|demo|sort files|group|pin|color|rename|delete|duplicate|daily|random|today view|position|path|progress bar|new note|new folder/.test(s)) return 'files';
  if (/pdf|merge|password|thumbnail|png|zoom|print\/download/.test(s)) return 'pdf';
  if (/markdown|gfm|katex|mermaid|diagram|math|footnote|table|callout|outline|tag|rtl|cjk|meter|render|copy|heading|toc|wikilink|frontmatter|search|find in file|regex|read aloud|anchor|latex|bib|tex|details|highlight syntax|callout/.test(s)) return 'read';
  if (/builder|insert|lint|summar|keyword|frequen|readab|diff|spell|vim|custom css|palette|replace|sort lines|paste|image paste|from url|template|draft|wrap|live edit|quick insert|table…|toc insert|task toggle|checklist|quote|duplicate lines|trimm|case tools|counts|details fold/.test(s)) return 'write';
  if (/stopwatch|pomodoro|counter|habit|streak|goal|tracker|chime|lap|focus timer/.test(s)) return 'time';
  if (/flashcard|cloze|quiz|anki|study pack|per-file note|note from|marker|mini-bar|h\/u\/s\/c|study/.test(s)) return 'study';
  if (/export|backup|restore|download|tsv|csv|json|html|txt|svg|print|docx|obsidian|notion|word|standalone/.test(s)) return 'export';
  return 'app';
}
/* wave-3 catalog top-up — every entry maps to real, working behavior */
FEATURE_CATALOG.push(
  ['Folder tree groups', 'files'], ['File sorting 6 ways', 'files'],
  ['Workspace pins', 'files'], ['Workspace colors', 'files'], ['Workspace filter box', 'files'],
  ['Rename file', 'files'], ['Duplicate file', 'files'], ['Delete file', 'files'],
  ['Daily note', 'files'], ['Random note', 'files'], ['Reading progress bar', 'read'],
  ['Copy file path', 'files'], ['Top-level + subfolder grouping', 'files'],
  ['Find in file + jump', 'read'], ['Find prev/next + count', 'read'],
  ['Regex search', 'read'], ['Read aloud TTS', 'read'], ['TTS speed control', 'read'],
  ['Copy heading link', 'read'], ['System theme follow', 'app'],
  ['Auto-save drafts', 'write'], ['Dirty indicator', 'write'], ['Draft restore', 'write'],
  ['Word wrap toggle', 'write'], ['Live edit counts', 'write'],
  ['Table generator', 'write'], ['TOC inserter', 'write'], ['Task toggle Ctrl+Enter', 'write'],
  ['Remove duplicate lines', 'write'], ['Trim whitespace', 'write'],
  ['Quote / unquote lines', 'write'], ['Heading case tools', 'write'],
  ['Sort lines in editor', 'write'], ['Find & replace in editor', 'write'],
  ['Image paste as data URL', 'write'], ['Template gallery 6', 'write'],
  ['Today overdue view', 'time'], ['Due filters 4-way', 'time'],
  ['Overdue red highlight', 'time'], ['Priority badges', 'time'],
  ['Checklist import', 'write'], ['Todo TXT export', 'export'],
  ['Session stats bar', 'time'], ['Study-day streak', 'time'],
  ['Habit 14-day grid', 'time'], ['Counter steps', 'time'],
  ['Pomodoro work/break', 'time'], ['Offline chime', 'time'],
  ['Stopwatch laps', 'time'], ['Reading tracker goal', 'time'],
  ['Flashcard reveal/known', 'study'], ['Quiz score', 'study'],
  ['Anki TSV round-trip', 'study'], ['Cloze blanks', 'study'],
  ['Marker 7 colors', 'study'], ['Marker jump/delete', 'study'],
  ['Per-file notes', 'study'], ['Note from selection', 'study'],
  ['PDF text search index', 'pdf'], ['PDF outline tree', 'pdf'],
  ['PDF lazy thumbnails', 'pdf'], ['PDF password unlock', 'pdf'],
  ['PDF zoom 50-300%', 'pdf'], ['PDF page jump', 'pdf'],
  ['PDF merge unlimited', 'pdf'], ['Page PNG export', 'pdf'],
  ['KaTeX currency-safe', 'read'], ['TEX section outline', 'read'],
  ['TEX math preview', 'read'], ['BIB cite browser', 'read'],
  ['Mermaid lazy idle', 'read'], ['Diagram SVG save', 'read'],
  ['Perf-mode diagram skip', 'read'], ['Render meter ms', 'read'],
  ['GFM sortable tables', 'read'], ['Task sync to source', 'read'],
  ['Footnotes jump', 'read'], ['Frontmatter chips', 'read'],
  ['Callouts 5 kinds', 'read'], ['Details accordions', 'read'],
  ['Wikilink jump', 'read'], ['Tag aggregate + backlinks', 'read'],
  ['Outline scroll spy', 'read'], ['Section time badges', 'read'],
  ['RTL paragraphs', 'read'], ['CJK word count', 'read'],
  ['Code copy bars', 'read'], ['Unicode search', 'read'],
  ['HTML standalone export', 'export'], ['JSON model export', 'export'],
  ['CSV frequency export', 'export'], ['Study pack export', 'export'],
  ['Full-state backup JSON', 'export'], ['One-file restore', 'export'],
  ['Markdown download', 'export'], ['Plain-text export', 'export'],
  ['Print stylesheet', 'export'], ['Diagram SVG file', 'export'],
  ['6 accents + picker', 'app'], ['4 reading widths', 'app'],
  ['Sans serif mono fonts', 'app'], ['Line-height slider', 'app'],
  ['Justify toggle', 'app'], ['Sentence focus', 'app'],
  ['True newlines toggle', 'app'], ['Focus mode', 'app'],
  ['Fullscreen + present', 'app'], ['Night sepia dim pages', 'app'],
  ['Custom CSS live', 'app'], ['Silent instant boot', 'app'],
  ['Debounced engine', 'app'], ['Idle diagram queue', 'app'],
  ['Capped search 800', 'app'], ['File cap 2000', 'app'],
  ['Storage safety caps', 'app'], ['Safe HTML sanitize', 'app'],
  ['Zero frameworks', 'app'], ['Fully offline', 'app'],
  ['Panel-only sidePanel', 'app'], ['No tabs no tracking', 'app'],
  ['Free unlimited MIT', 'app'], ['Command palette 30+', 'app'],
  ['Feature directory 200+', 'app'], ['Category filters', 'app'],
  ['Keyboard map 20+', 'app'], ['Vim jk + / search', 'app'],
  ['Font size keys', 'app'], ['Template keys Alt+1-6', 'app'],
  ['Global status errors', 'app'], ['Re-pick recovery', 'app'],
  ['Per-file crash guards', 'app'], ['Quota-safe storage', 'app']
);
FEATURE_CATALOG.push(
  ['Voice select', 'read'], ['Speak selection', 'read'], ['Chunked long speech', 'read'],
  ['No-voice guidance', 'read'], ['PDF read-aloud', 'read'], ['TTS speed live', 'read'],
  ['Heading link copy', 'read'], ['Copy file path', 'files'],
  ['Remove duplicate lines', 'write'], ['Trim whitespace', 'write'], ['Quote lines', 'write'],
  ['Case cycle upper/lower/title', 'write'], ['Task toggle Ctrl+Enter', 'write'],
  ['Print selection', 'export'], ['Present mode', 'app'], ['Fullscreen', 'app']
);
COMMANDS.push(
  ['Find in file', () => { if (els.findBar) { els.findBar.hidden = false; els.findInput.focus(); } }],
  ['Read aloud', () => ttsSpeak()], ['Stop reading', () => ttsStop()],
  ['Today view', () => showToday()], ['Daily note', () => dailyNote()], ['Random note', () => randomNote()],
  ['Rename file', () => renameFile()], ['Duplicate file', () => duplicateFile()], ['Delete file', () => deleteFile()],
  ['Insert table', () => doInsert('table')], ['Insert TOC', () => { const t = tocInsertText(); if (t) insertText(t); }],
  ['Toggle wrap', () => { S.editorWrap = S.editorWrap === false; applyEditorPrefs(); persist(); }],
  ['Reading progress', () => updateReadProg()]
);
COMMANDS.push(
  ['Read selection aloud', () => { const t = ((window.getSelection() || '').toString() || '').trim(); if (t) ttsSpeak(t); else toast('Select text first', 'err'); }],
  ['Stop reading', () => ttsStop()],
  ['Rename file', () => renameFile()], ['Duplicate file', () => duplicateFile()],
  ['Delete file', () => deleteFile()], ['Copy file path', () => copyPath()],
  ['Print selection', () => printSelection()],
  ['Present mode', () => togglePresent()], ['Fullscreen', () => goFullscreen()],
  ['Remove duplicate lines', () => doInsert('dedup')], ['Trim whitespace', () => doInsert('trim')],
  ['Quote lines', () => doInsert('quote')], ['Cycle case', () => doInsert('casecycle')]
);

/* ---------------- boot (silent instant, like Heros PDF) ---------------- */
(async function boot() {
  wire();
  await restore();
  applyTheme(); applyAccent(); applyPageMode(); applyFont(); applyReadPrefs();
  els.swResume.checked = S.resume;
  els.swAuto.checked = S.autoRescan;
  if (els.pomWork) { els.pomWork.value = S.pom.workMin; els.pomWorkLbl.textContent = S.pom.workMin + 'm'; }
  if (els.pomBreak) { els.pomBreak.value = S.pom.breakMin; els.pomBreakLbl.textContent = S.pom.breakMin + 'm'; }
  updateStats();
  renderWsSelect(); renderWsList(); renderFileList(); renderTodo();
  renderCounters(); renderHabits(); renderCards(); renderSwLaps(); paintSw(S.sw.elapsed || 0); paintPom();
  if (els.fileSort) els.fileSort.value = S.fileSort || 'name-asc';
  applyEditorPrefs();
  ensureVoices();
  if (S.activeWsId && S.workspaces.some(w => w.id === S.activeWsId)) {
    if (S.autoRescan) await loadActiveWorkspace();
    else {
      // light restore without rescan: load snapshots for files-kind
      const ws = activeWs();
      if (ws && ws.kind === 'files') {
        S.files = (await idbGet('ws:' + ws.id)) || [];
        S.files.forEach(f => { if (!f.kind) f.kind = kindOf(f.name); });
      }
      if (ws && ws.kind === 'demo') S.files = demoFiles();
      if (S.resume && ws && ws.lastFilePath && getFile(ws.lastFilePath)) await openFile(ws.lastFilePath, true);
      else if (S.files[0]) await openFile(S.files[0].path, true);
      renderFileList(); renderTodo(); renderOutline(); renderTags(); updateStats();
    }
  } else {
    els.mdWrap.hidden = true; els.empty.hidden = false;
  }
  // open drawer on first run so users see workspaces
  if (!S.workspaces.length) setSidebar(false);
  requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.remove('booting')));
  document.title = 'Heros Todo v2.2.0';
  if (els.profileSub) els.profileSub.textContent = 'Local profile · private · v2.2.0';
  setStatus('Ready', 'ok');
})();
