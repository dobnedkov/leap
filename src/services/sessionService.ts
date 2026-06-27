import { Session, SavedTab } from "../types/session";
import { LeapTab } from "../types/tab";
import { storage } from "./chromeStorage";
import { openTabs } from "./chromeTabs";
import { generateId } from "../utils/id";

async function loadSessions(): Promise<Session[]> {
  return (await storage.get<Session[]>(storage.KEYS.sessions)) ?? [];
}

async function saveSessions(sessions: Session[]): Promise<void> {
  await storage.set(storage.KEYS.sessions, sessions);
}

export const sessionService = {
  async getAll(): Promise<Session[]> {
    return loadSessions();
  },

  async getByWorkspace(workspaceId: string): Promise<Session[]> {
    const all = await loadSessions();
    return all.filter((s) => s.workspaceId === workspaceId);
  },

  async getById(id: string): Promise<Session | null> {
    const all = await loadSessions();
    return all.find((s) => s.id === id) ?? null;
  },

  /** Save open tabs as a new named session */
  async saveFromTabs(
    name: string,
    workspaceId: string,
    tabs: LeapTab[]
  ): Promise<Session> {
    const sessions = await loadSessions();
    const now = Date.now();

    const savedTabs: SavedTab[] = tabs
      .filter((t) => t.url && !t.url.startsWith("chrome://"))
      .map((t) => ({
        url: t.url,
        title: t.title,
        favIconUrl: t.favIconUrl,
        pinned: t.pinned,
      }));

    const session: Session = {
      id: generateId(),
      name,
      workspaceId,
      tabs: savedTabs,
      createdAt: now,
      updatedAt: now,
    };

    await saveSessions([...sessions, session]);
    return session;
  },

  /** Restore all tabs from a session */
  async restore(sessionId: string): Promise<void> {
    const session = await sessionService.getById(sessionId);
    if (!session) throw new Error(`Session ${sessionId} not found`);
    const urls = session.tabs.map((t) => t.url).filter(Boolean);
    await openTabs(urls);
  },

  async rename(id: string, name: string): Promise<void> {
    const sessions = await loadSessions();
    const updated = sessions.map((s) =>
      s.id === id ? { ...s, name, updatedAt: Date.now() } : s
    );
    await saveSessions(updated);
  },

  async delete(id: string): Promise<void> {
    const sessions = await loadSessions();
    await saveSessions(sessions.filter((s) => s.id !== id));
  },
};
