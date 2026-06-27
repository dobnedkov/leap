import { LeapTab, fromChromeTab } from "../types/tab";

/** Fetch all tabs across all windows */
export async function getAllTabs(): Promise<LeapTab[]> {
  const tabs = await chrome.tabs.query({});
  return tabs.map(fromChromeTab);
}

/** Fetch tabs in the current window */
export async function getCurrentWindowTabs(): Promise<LeapTab[]> {
  const tabs = await chrome.tabs.query({ currentWindow: true });
  return tabs.map(fromChromeTab);
}

/** Switch to a specific tab, focusing its window */
export async function activateTab(tabId: number): Promise<void> {
  const tab = await chrome.tabs.get(tabId);
  await chrome.windows.update(tab.windowId, { focused: true });
  await chrome.tabs.update(tabId, { active: true });
}

/** Close a tab by ID */
export async function closeTab(tabId: number): Promise<void> {
  await chrome.tabs.remove(tabId);
}

/** Open a URL in a new tab */
export async function openTab(url: string): Promise<chrome.tabs.Tab> {
  return chrome.tabs.create({ url });
}

/** Open multiple URLs as new tabs (for session restore) */
export async function openTabs(urls: string[]): Promise<void> {
  for (const url of urls) {
    await chrome.tabs.create({ url, active: false });
  }
}

/** Get the currently active tab in the focused window */
export async function getActiveTab(): Promise<LeapTab | null> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab ? fromChromeTab(tab) : null;
}
