import React, { useEffect, useCallback, useRef } from "react";
import { Zap } from "lucide-react";
import { useWorkspaceStore } from "../state/useWorkspaceStore";
import { useTabStore } from "../state/useTabStore";
import { onMessage } from "../services/chromeRuntime";
import { SearchBar } from "./SearchBar";
import { WorkspaceList } from "./WorkspaceList";
import { TabList } from "./TabList";
import { SessionList } from "./SessionList";
import { WorkspaceColor } from "../types/workspace";

export const Sidebar: React.FC = () => {
  const searchInputFocusRef = useRef<(() => void) | null>(null);

  // ── Workspace store ────────────────────────────────────────────────────────
  const {
    workspaces,
    activeWorkspaceId,
    load: loadWorkspaces,
    setActiveWorkspace,
    createWorkspace,
    renameWorkspace,
    deleteWorkspace,
  } = useWorkspaceStore();

  // ── Tab + Session store ────────────────────────────────────────────────────
  const {
    loading,
    searchQuery,
    sessions,
    loadTabs,
    loadSessions,
    activateTab,
    closeTab,
    setSearchQuery,
    saveSession,
    restoreSession,
    deleteSession,
    renameSession,
    filteredTabs,
  } = useTabStore();

  // ── Initial load ──────────────────────────────────────────────────────────
  useEffect(() => {
    loadWorkspaces();
    loadTabs();
  }, [loadWorkspaces, loadTabs]);

  // Load sessions when active workspace changes
  useEffect(() => {
    if (activeWorkspaceId) {
      loadSessions(activeWorkspaceId);
    }
  }, [activeWorkspaceId, loadSessions]);

  // ── Background message bus ────────────────────────────────────────────────
  useEffect(() => {
    const unsubscribe = onMessage((msg) => {
      if (msg.type === "TABS_UPDATED") {
        loadTabs();
      }
      if (msg.type === "SAVE_SESSION_COMMAND") {
        // Trigger save via a synthetic UI event — we can't call hooks here
        document.dispatchEvent(new CustomEvent("leap:save-session"));
      }
      if (msg.type === "SEARCH_TABS_COMMAND") {
        searchInputFocusRef.current?.();
      }
    });
    return unsubscribe;
  }, [loadTabs]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleSaveSession = useCallback(
    async (name: string) => {
      if (!activeWorkspaceId) return;
      await saveSession(name, activeWorkspaceId);
    },
    [activeWorkspaceId, saveSession]
  );

  const handleWorkspaceCreate = useCallback(
    (name: string, color: WorkspaceColor) => {
      createWorkspace(name, color);
    },
    [createWorkspace]
  );

  if (loading) {
    return (
      <div className="sidebar-loading">
        <div className="spinner" />
      </div>
    );
  }

  const tabs = filteredTabs();

  return (
    <div className="sidebar">
      {/* Header */}
      <header className="sidebar-header">
        <div className="sidebar-logo">
          <Zap size={16} className="logo-icon" />
          <span className="logo-text">Leap</span>
        </div>
      </header>

      {/* Search */}
      <div className="sidebar-search">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search tabs…"
        />
      </div>

      {/* Scrollable body */}
      <div className="sidebar-body">
        {/* Workspaces */}
        <WorkspaceList
          workspaces={workspaces}
          activeWorkspaceId={activeWorkspaceId}
          onSelect={setActiveWorkspace}
          onCreate={handleWorkspaceCreate}
          onRename={renameWorkspace}
          onDelete={deleteWorkspace}
        />

        {/* Divider */}
        <div className="divider" />

        {/* Open tabs */}
        <TabList
          tabs={tabs}
          searchQuery={searchQuery}
          onActivate={activateTab}
          onClose={closeTab}
        />

        {/* Divider */}
        <div className="divider" />

        {/* Sessions */}
        <SessionList
          sessions={sessions}
          onSave={handleSaveSession}
          onRestore={restoreSession}
          onDelete={deleteSession}
          onRename={renameSession}
        />
      </div>
    </div>
  );
};
