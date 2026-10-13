'use strict';
/* Heros Todo — panel-only background worker.
   No tabs, no webNavigation, no content interception.
   Single job: make the toolbar icon open the side panel. */

const PANEL_PATH = 'sidepanel.html';

chrome.runtime.onInstalled.addListener(async () => {
  try {
    await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
  } catch (e) {
    console.warn('[HerosTodo] setPanelBehavior failed:', (e && e.message) || e);
  }
  try {
    await chrome.sidePanel.setOptions({ path: PANEL_PATH, enabled: true });
  } catch (e) { /* older Chrome: ignore */ }
});

chrome.runtime.onStartup.addListener(async () => {
  try {
    await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
  } catch (e) { /* ignore */ }
});

/* Fallback for browsers where openPanelOnActionClick is not honoured. */
chrome.action.onClicked.addListener(async (tab) => {
  try {
    await chrome.sidePanel.open({ windowId: tab.windowId });
  } catch (e) {
    console.warn('[HerosTodo] sidePanel.open failed:', (e && e.message) || e);
  }
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg && msg.type === 'herostodo-open-panel') {
    (async () => {
      try {
        const win = await chrome.windows.getCurrent();
        await chrome.sidePanel.open({ windowId: win.id });
        sendResponse({ ok: true });
      } catch (e) {
        sendResponse({ ok: false, error: String((e && e.message) || e) });
      }
    })();
    return true;
  }
});
