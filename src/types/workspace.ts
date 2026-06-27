export interface Workspace {
  id: string;
  name: string;
  color: WorkspaceColor;
  createdAt: number;
  updatedAt: number;
  /** IDs of sessions that belong to this workspace */
  sessionIds: string[];
}

export type WorkspaceColor =
  | "indigo"
  | "violet"
  | "sky"
  | "emerald"
  | "rose"
  | "amber"
  | "slate";

export const WORKSPACE_COLORS: Record<WorkspaceColor, string> = {
  indigo: "#6366f1",
  violet: "#8b5cf6",
  sky: "#0ea5e9",
  emerald: "#10b981",
  rose: "#f43f5e",
  amber: "#f59e0b",
  slate: "#64748b",
};

export const DEFAULT_WORKSPACE: Omit<Workspace, "id" | "createdAt" | "updatedAt"> = {
  name: "Personal",
  color: "indigo",
  sessionIds: [],
};
