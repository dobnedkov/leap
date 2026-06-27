import { create } from "zustand";
import { Workspace, WorkspaceColor } from "../types/workspace";
import { workspaceService } from "../services/workspaceService";

interface WorkspaceState {
  workspaces: Workspace[];
  activeWorkspaceId: string | null;
  loading: boolean;

  // Actions
  load: () => Promise<void>;
  setActiveWorkspace: (id: string) => Promise<void>;
  createWorkspace: (name: string, color?: WorkspaceColor) => Promise<void>;
  renameWorkspace: (id: string, name: string) => Promise<void>;
  deleteWorkspace: (id: string) => Promise<void>;
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  workspaces: [],
  activeWorkspaceId: null,
  loading: true,

  load: async () => {
    set({ loading: true });
    const [workspaces, activeId] = await Promise.all([
      workspaceService.getAll(),
      workspaceService.getActiveId(),
    ]);

    // If no workspaces exist, create a default one
    if (workspaces.length === 0) {
      const defaultWs = await workspaceService.ensureDefault();
      await workspaceService.setActiveId(defaultWs.id);
      set({ workspaces: [defaultWs], activeWorkspaceId: defaultWs.id, loading: false });
      return;
    }

    const resolvedActiveId = activeId ?? workspaces[0].id;
    set({ workspaces, activeWorkspaceId: resolvedActiveId, loading: false });
  },

  setActiveWorkspace: async (id: string) => {
    await workspaceService.setActiveId(id);
    set({ activeWorkspaceId: id });
  },

  createWorkspace: async (name: string, color: WorkspaceColor = "indigo") => {
    const workspace = await workspaceService.create(name, color);
    set((state) => ({ workspaces: [...state.workspaces, workspace] }));
  },

  renameWorkspace: async (id: string, name: string) => {
    await workspaceService.rename(id, name);
    set((state) => ({
      workspaces: state.workspaces.map((w) =>
        w.id === id ? { ...w, name, updatedAt: Date.now() } : w
      ),
    }));
  },

  deleteWorkspace: async (id: string) => {
    await workspaceService.delete(id);
    const remaining = get().workspaces.filter((w) => w.id !== id);
    const newActiveId =
      get().activeWorkspaceId === id ? (remaining[0]?.id ?? null) : get().activeWorkspaceId;

    if (newActiveId) await workspaceService.setActiveId(newActiveId);

    set({ workspaces: remaining, activeWorkspaceId: newActiveId });
  },
}));
