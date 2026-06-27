import { Workspace, WorkspaceColor, DEFAULT_WORKSPACE } from "../types/workspace";
import { storage } from "./chromeStorage";
import { generateId } from "../utils/id";

async function loadWorkspaces(): Promise<Workspace[]> {
  return (await storage.get<Workspace[]>(storage.KEYS.workspaces)) ?? [];
}

async function saveWorkspaces(workspaces: Workspace[]): Promise<void> {
  await storage.set(storage.KEYS.workspaces, workspaces);
}

export const workspaceService = {
  async getAll(): Promise<Workspace[]> {
    return loadWorkspaces();
  },

  async getActiveId(): Promise<string | null> {
    return storage.get<string>(storage.KEYS.activeWorkspaceId);
  },

  async setActiveId(id: string): Promise<void> {
    await storage.set(storage.KEYS.activeWorkspaceId, id);
  },

  async create(
    name: string,
    color: WorkspaceColor = "indigo"
  ): Promise<Workspace> {
    const workspaces = await loadWorkspaces();
    const now = Date.now();
    const workspace: Workspace = {
      id: generateId(),
      name,
      color,
      createdAt: now,
      updatedAt: now,
      sessionIds: [],
    };
    await saveWorkspaces([...workspaces, workspace]);
    return workspace;
  },

  async rename(id: string, name: string): Promise<void> {
    const workspaces = await loadWorkspaces();
    const updated = workspaces.map((w) =>
      w.id === id ? { ...w, name, updatedAt: Date.now() } : w
    );
    await saveWorkspaces(updated);
  },

  async updateColor(id: string, color: WorkspaceColor): Promise<void> {
    const workspaces = await loadWorkspaces();
    const updated = workspaces.map((w) =>
      w.id === id ? { ...w, color, updatedAt: Date.now() } : w
    );
    await saveWorkspaces(updated);
  },

  async delete(id: string): Promise<void> {
    const workspaces = await loadWorkspaces();
    await saveWorkspaces(workspaces.filter((w) => w.id !== id));
  },

  async addSessionId(workspaceId: string, sessionId: string): Promise<void> {
    const workspaces = await loadWorkspaces();
    const updated = workspaces.map((w) =>
      w.id === workspaceId
        ? {
            ...w,
            sessionIds: [...w.sessionIds, sessionId],
            updatedAt: Date.now(),
          }
        : w
    );
    await saveWorkspaces(updated);
  },

  async removeSessionId(workspaceId: string, sessionId: string): Promise<void> {
    const workspaces = await loadWorkspaces();
    const updated = workspaces.map((w) =>
      w.id === workspaceId
        ? {
            ...w,
            sessionIds: w.sessionIds.filter((sid) => sid !== sessionId),
            updatedAt: Date.now(),
          }
        : w
    );
    await saveWorkspaces(updated);
  },

  /** Ensure at least one default workspace exists */
  async ensureDefault(): Promise<Workspace> {
    const workspaces = await loadWorkspaces();
    if (workspaces.length > 0) return workspaces[0];
    return workspaceService.create(
      DEFAULT_WORKSPACE.name,
      DEFAULT_WORKSPACE.color
    );
  },
};
