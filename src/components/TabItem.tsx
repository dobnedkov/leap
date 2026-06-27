import React, { useState } from "react";
import { X, Volume2, VolumeX } from "lucide-react";
import { LeapTab } from "../types/tab";

interface TabItemProps {
  tab: LeapTab;
  onActivate: (tabId: number) => void;
  onClose: (tabId: number) => void;
}

const FALLBACK_FAVICON = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><rect width='16' height='16' rx='3' fill='%23334155'/><text x='8' y='12' text-anchor='middle' font-size='10' fill='%2394a3b8'>🌐</text></svg>`;

export const TabItem: React.FC<TabItemProps> = ({ tab, onActivate, onClose }) => {
  const [faviconError, setFaviconError] = useState(false);

  const favicon = faviconError || !tab.favIconUrl ? FALLBACK_FAVICON : tab.favIconUrl;

  const hostname = (() => {
    try {
      return new URL(tab.url).hostname.replace("www.", "");
    } catch {
      return tab.url;
    }
  })();

  return (
    <div
      className={`tab-item ${tab.active ? "tab-item--active" : ""}`}
      onClick={() => onActivate(tab.id)}
      title={tab.title}
    >
      {/* Loading indicator or favicon */}
      <div className="tab-favicon">
        {tab.status === "loading" ? (
          <div className="tab-spinner" />
        ) : (
          <img
            src={favicon}
            alt=""
            width={14}
            height={14}
            onError={() => setFaviconError(true)}
            className="tab-favicon-img"
          />
        )}
      </div>

      {/* Title + URL */}
      <div className="tab-info">
        <span className="tab-title">{tab.title || "Untitled"}</span>
        <span className="tab-url">{hostname}</span>
      </div>

      {/* Right-side indicators */}
      <div className="tab-actions">
        {tab.audible && (
          <span className="tab-badge tab-badge--audio" title="Playing audio">
            <Volume2 size={10} />
          </span>
        )}
        {tab.mutedInfo?.muted && (
          <span className="tab-badge tab-badge--muted" title="Muted">
            <VolumeX size={10} />
          </span>
        )}
        <button
          className="tab-close"
          onClick={(e) => {
            e.stopPropagation();
            onClose(tab.id);
          }}
          aria-label={`Close ${tab.title}`}
        >
          <X size={11} />
        </button>
      </div>
    </div>
  );
};
