import React, { useState } from "react";
import {
  Bookmark,
  Play,
  Trash2,
  Pencil,
  Check,
  X,
  ChevronDown,
  ChevronRight,
  Plus,
} from "lucide-react";
import { Session } from "../types/session";
import { formatRelativeTime } from "../utils/date";
import { EmptyState } from "./EmptyState";

interface SessionListProps {
  sessions: Session[];
  onSave: (name: string) => void;
  onRestore: (sessionId: string) => void;
  onDelete: (sessionId: string) => void;
  onRename: (sessionId: string, name: string) => void;
}

export const SessionList: React.FC<SessionListProps> = ({
  sessions,
  onSave,
  onRestore,
  onDelete,
  onRename,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sessionName, setSessionName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const handleSave = () => {
    const name = sessionName.trim() || `Session ${new Date().toLocaleTimeString()}`;
    onSave(name);
    setSessionName("");
    setSaving(false);
  };

  const handleRename = (id: string) => {
    const name = editName.trim();
    if (!name) return;
    onRename(id, name);
    setEditingId(null);
  };

  return (
    <div className="session-list">
      <div className="section-header">
        <button
          className="section-header-toggle"
          onClick={() => setCollapsed((v) => !v)}
          aria-label={collapsed ? "Expand sessions" : "Collapse sessions"}
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
          <span className="section-label">Sessions</span>
          <span className="section-count">{sessions.length}</span>
        </button>
        <button
          className="icon-btn"
          onClick={() => setSaving((v) => !v)}
          aria-label="Save current tabs as session"
          title="Save current session"
        >
          <Plus size={13} />
        </button>
      </div>

      {!collapsed && (
        <>
          {saving && (
            <div className="session-save-form">
              <input
                type="text"
                className="ws-name-input"
                placeholder={`Session ${new Date().toLocaleTimeString()}`}
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSave();
                  if (e.key === "Escape") setSaving(false);
                }}
                autoFocus
              />
              <div className="ws-form-actions">
                <button className="btn btn--ghost" onClick={() => setSaving(false)}>
                  Cancel
                </button>
                <button className="btn btn--primary" onClick={handleSave}>
                  Save
                </button>
              </div>
            </div>
          )}

          {sessions.length === 0 && !saving ? (
            <EmptyState
              icon={<Bookmark size={22} />}
              title="No saved sessions"
              description="Save your open tabs as a session to restore them later."
              action={
                <button className="btn btn--primary" onClick={() => setSaving(true)}>
                  Save current tabs
                </button>
              }
            />
          ) : (
            <div className="session-rows">
              {sessions.map((session) => (
                <div key={session.id} className="session-row">
                  <div className="session-info">
                    {editingId === session.id ? (
                      <input
                        className="ws-edit-input"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleRename(session.id);
                          if (e.key === "Escape") setEditingId(null);
                        }}
                        autoFocus
                      />
                    ) : (
                      <span className="session-name">{session.name}</span>
                    )}
                    <span className="session-meta">
                      {session.tabs.length} tab{session.tabs.length !== 1 ? "s" : ""} ·{" "}
                      {formatRelativeTime(session.createdAt)}
                    </span>
                  </div>

                  <div className="session-actions">
                    {editingId === session.id ? (
                      <>
                        <button
                          className="icon-btn icon-btn--success"
                          onClick={() => handleRename(session.id)}
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
                          className="icon-btn icon-btn--success"
                          onClick={() => onRestore(session.id)}
                          aria-label="Restore session"
                          title="Restore tabs"
                        >
                          <Play size={11} />
                        </button>
                        <button
                          className="icon-btn"
                          onClick={() => {
                            setEditingId(session.id);
                            setEditName(session.name);
                          }}
                          aria-label="Rename session"
                        >
                          <Pencil size={11} />
                        </button>
                        <button
                          className="icon-btn icon-btn--danger"
                          onClick={() => onDelete(session.id)}
                          aria-label="Delete session"
                        >
                          <Trash2 size={11} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
