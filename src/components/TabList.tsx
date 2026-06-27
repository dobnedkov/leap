import React from "react";
import { Layers } from "lucide-react";
import { LeapTab } from "../types/tab";
import { TabItem } from "./TabItem";
import { EmptyState } from "./EmptyState";

interface TabListProps {
  tabs: LeapTab[];
  searchQuery: string;
  onActivate: (tabId: number) => void;
  onClose: (tabId: number) => void;
}

export const TabList: React.FC<TabListProps> = ({
  tabs,
  searchQuery,
  onActivate,
  onClose,
}) => {
  if (tabs.length === 0) {
    return (
      <EmptyState
        icon={<Layers size={28} />}
        title={searchQuery ? "No tabs match" : "No tabs open"}
        description={
          searchQuery
            ? "Try a different search term."
            : "Open a website to see it here."
        }
      />
    );
  }

  return (
    <div className="tab-list">
      <div className="section-header">
        <span className="section-label">Open Tabs</span>
        <span className="section-count">{tabs.length}</span>
      </div>
      <div className="tab-list-items">
        {tabs.map((tab) => (
          <TabItem
            key={tab.id}
            tab={tab}
            onActivate={onActivate}
            onClose={onClose}
          />
        ))}
      </div>
    </div>
  );
};
