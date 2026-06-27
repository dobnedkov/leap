/**
 * Leap Background Service Worker (Manifest V3)
 *
 * Responsibilities:
 *  - Open the side panel on action click
 *  - Listen for keyboard commands
 *  - Notify the side panel when tabs change
 */

import { LeapMessage } from "../types/messages";

// ─── Side Panel ──────────────────────────────────────────────────────────────

// Allow the side panel to be opened on action click
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch(console.error);

// ─── Tab Event Listeners ─────────────────────────────────────────────────────

function notifyTabsUpdated(): void {
  const message: LeapMessage = { type: "TABS_UPDATED" };
  chrome.runtime.sendMessage(message).catch(() => {
    // Side panel may not be open — ignore
  });
}

chrome.tabs.onCreated.addListener(notifyTabsUpdated);
chrome.tabs.onRemoved.addListener(notifyTabsUpdated);
chrome.tabs.onUpdated.addListener((_tabId, changeInfo) => {
  // Only notify on meaningful changes (not every loading tick)
  if (changeInfo.status === "complete" || changeInfo.title || changeInfo.favIconUrl) {
    notifyTabsUpdated();
  }
});
chrome.tabs.onMoved.addListener(notifyTabsUpdated);
chrome.tabs.onActivated.addListener(notifyTabsUpdated);
chrome.tabs.onAttached.addListener(notifyTabsUpdated);
chrome.tabs.onDetached.addListener(notifyTabsUpdated);

// ─── Keyboard Commands ────────────────────────────────────────────────────────

chrome.commands.onCommand.addListener((command) => {
  switch (command) {
    case "open-side-panel": {
      chrome.windows.getCurrent().then((win) => {
        if (win.id !== undefined) {
          chrome.sidePanel.open({ windowId: win.id });
        }
      });
      break;
    }

    case "save-session": {
      const message: LeapMessage = { type: "SAVE_SESSION_COMMAND" };
      chrome.runtime.sendMessage(message).catch(console.error);
      break;
    }

    case "search-tabs": {
      const message: LeapMessage = { type: "SEARCH_TABS_COMMAND" };
      chrome.runtime.sendMessage(message).catch(console.error);
      break;
    }
  }
});

// ─── Message Handler ──────────────────────────────────────────────────────────

chrome.runtime.onMessage.addListener(
  (message: LeapMessage, _sender, sendResponse) => {
    if (message.type === "PING") {
      sendResponse({ pong: true });
    }
    return false;
  }
);
