import { create } from "zustand";
import { LeapTab } from "../types/tab";
import { Session } from "../types/session";
import { getCurrentWindowTabs, activateTab, closeTab } from "../services/chromeTabs";
import { sessionService } from "../services/sessionService";

interface TabState {
  tabs: LeapTab[];
  sessions: Session[];
  searchQuery: string;
  loading: boolean;

  // Actions
  loadTabs: () => Promise<void>;
  loadSessions: (workspaceId: string) => Promise<void>;
  activateTab: (tabId: number) => Promise<void>;
  closeTab: (tabId: number) => Promise<void>;
  setSearchQuery: (q: string) => void;
  saveSession: (name: string, workspaceId: string) => Promise<Session>;
  restoreSession: (sessionId: string) => Promise<void>;
  deleteSession: (sessionId: string) => Promise<void>;
  renameSession: (sessionId: string, name: string) => Promise<void>;

  // Derived helper
  filteredTabs: () => LeapTab[];
}

export const useTabStore = create<TabState>((set, get) => ({
  tabs: [],
  sessions: [],
  searchQuery: "",
  loading: true,

  loadTabs: async () => {
    const tabs = await getCurrentWindowTabs();
    set({ tabs, loading: false });
  },

  loadSessions: async (workspaceId: string) => {
    const sessions = await sessionService.getByWorkspace(workspaceId);
    set({ sessions });
  },

  activateTab: async (tabId: number) => {
    await activateTab(tabId);
    // Optimistically mark it active in local state
    set((state) => ({
      tabs: state.tabs.map((t) => ({ ...t, active: t.id === tabId })),
    }));
  },

  closeTab: async (tabId: number) => {
    await closeTab(tabId);
    set((state) => ({
      tabs: state.tabs.filter((t) => t.id !== tabId),
    }));
  },

  setSearchQuery: (q: string) => set({ searchQuery: q }),

  saveSession: async (name: string, workspaceId: string) => {
    const { tabs } = get();
    const session = await sessionService.saveFromTabs(name, workspaceId, tabs);
    set((state) => ({ sessions: [...state.sessions, session] }));
    return session;
  },

  restoreSession: async (sessionId: string) => {
    await sessionService.restore(sessionId);
  },

  deleteSession: async (sessionId: string) => {
    await sessionService.delete(sessionId);
    set((state) => ({
      sessions: state.sessions.filter((s) => s.id !== sessionId),
    }));
  },

  renameSession: async (sessionId: string, name: string) => {
    await sessionService.rename(sessionId, name);
    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.id === sessionId ? { ...s, name, updatedAt: Date.now() } : s
      ),
    }));
  },

  filteredTabs: () => {
    const { tabs, searchQuery } = get();
    if (!searchQuery.trim()) return tabs;
    const q = searchQuery.toLowerCase();
    return tabs.filter(
      (t) =>
        t.title.toLowerCase().includes(q) || t.url.toLowerCase().includes(q)
    );
  },
}));
