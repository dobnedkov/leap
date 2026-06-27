import React, { useState } from "react";
import { Plus, Check, Pencil, Trash2, X } from "lucide-react";
import { Workspace, WorkspaceColor, WORKSPACE_COLORS } from "../types/workspace";

interface WorkspaceListProps {
  workspaces: Workspace[];
  activeWorkspaceId: string | null;
  onSelect: (id: string) => void;
  onCreate: (name: string, color: WorkspaceColor) => void;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
}

const COLOR_OPTIONS = Object.keys(WORKSPACE_COLORS) as WorkspaceColor[];

export const WorkspaceList: React.FC<WorkspaceListProps> = ({
  workspaces,
  activeWorkspaceId,
  onSelect,
  onCreate,
  onRename,
  onDelete,
}) => {
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState<WorkspaceColor>("indigo");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const handleCreate = () => {
    const name = newName.trim();
    if (!name) return;
    onCreate(name, newColor);
    setNewName("");
    setNewColor("indigo");
    setCreating(false);
  };

  const handleRename = (id: string) => {
    const name = editName.trim();
    if (!name) return;
    onRename(id, name);
    setEditingId(null);
    setEditName("");
  };

  return (
    <div className="workspace-list">
      <div className="section-header">
        <span className="section-label">Workspaces</span>
        <button
          className="icon-btn"
          onClick={() => setCreating((v) => !v)}
          aria-label="New workspace"
          title="New workspace"
        >
          <Plus size={13} />
        </button>
      </div>

      {/* Create form */}
      {creating && (
        <div className="workspace-create-form">
          <input
            type="text"
            className="ws-name-input"
            placeholder="Workspace name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreate();
              if (e.key === "Escape") setCreating(false);
            }}
            autoFocus
          />
          <div className="color-picker">
            {COLOR_OPTIONS.map((c) => (
              <button
                key={c}
                className={`color-dot ${newColor === c ? "color-dot--selected" : ""}`}
                style={{ background: WORKSPACE_COLORS[c] }}
                onClick={() => setNewColor(c)}
                aria-label={c}
              />
            ))}
          </div>
          <div className="ws-form-actions">
            <button className="btn btn--ghost" onClick={() => setCreating(false)}>
              Cancel
            </button>
            <button className="btn btn--primary" onClick={handleCreate} disabled={!newName.trim()}>
              Create
            </button>
          </div>
        </div>
      )}

      {/* Workspace rows */}
      <div className="workspace-rows">
        {workspaces.map((ws) => (
          <div
            key={ws.id}
            className={`workspace-row ${ws.id === activeWorkspaceId ? "workspace-row--active" : ""}`}
            onClick={() => onSelect(ws.id)}
          >
            <span
              className="ws-dot"
              style={{ background: WORKSPACE_COLORS[ws.color] }}
            />

            {editingId === ws.id ? (
              <input
                className="ws-edit-input"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleRename(ws.id);
                  if (e.key === "Escape") setEditingId(null);
                }}
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
            ) : (
              <span className="ws-name">{ws.name}</span>
            )}

            <div className="ws-row-actions" onClick={(e) => e.stopPropagation()}>
              {editingId === ws.id ? (
                <>
                  <button
                    className="icon-btn icon-btn--success"
                    onClick={() => handleRename(ws.id)}
                    aria-label="Confirm rename"
                  >
                    <Check size={11} />
                  </button>
                  <button
                    className="icon-btn"
                    onClick={() => setEditingId(null)}
                    aria-label="Cancel"
                  >
                    <X size={11} />
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="icon-btn"
                    onClick={() => {
                      setEditingId(ws.id);
                      setEditName(ws.name);
                    }}
                    aria-label="Rename workspace"
                  >
                    <Pencil size={11} />
                  </button>
                  {workspaces.length > 1 && (
                    <button
                      className="icon-btn icon-btn--danger"
                      onClick={() => onDelete(ws.id)}
                      aria-label="Delete workspace"
                    >
                      <Trash2 size={11} />
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
