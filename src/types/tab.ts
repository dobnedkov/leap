// Lean wrapper types over chrome.tabs API shapes

export interface LeapTab {
  id: number;
  windowId: number;
  url: string;
  title: string;
  favIconUrl: string;
  active: boolean;
  pinned: boolean;
  index: number;
  status: "loading" | "complete" | undefined;
  audible: boolean;
  mutedInfo?: { muted: boolean };
  /** Local UI-only state — not persisted */
  highlighted?: boolean;
}

export function fromChromeTab(tab: chrome.tabs.Tab): LeapTab {
  return {
    id: tab.id ?? -1,
    windowId: tab.windowId,
    url: tab.url ?? "",
    title: tab.title ?? "Untitled",
    favIconUrl: tab.favIconUrl ?? "",
    active: tab.active,
    pinned: tab.pinned,
    index: tab.index,
    status: tab.status as LeapTab["status"],
    audible: tab.audible ?? false,
    mutedInfo: tab.mutedInfo,
  };
}
