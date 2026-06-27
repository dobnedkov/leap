# Leap — React + TypeScript Manifest V3 Chrome Extension

> A polished Arc-style sidebar tab and workspace manager built with React, TypeScript, Vite, and the Chrome Side Panel API.

---

## Screenshots

> _Load the extension in Chrome, open the side panel, and screenshot your setup here._

| Sidebar — Open Tabs | Workspaces | Sessions |
|---|---|---|
| ![tabs](screenshots/tabs.png) | ![workspaces](screenshots/workspaces.png) | ![sessions](screenshots/sessions.png) |

---

## Features

- **Side Panel** — Persistent vertical sidebar via Chrome's `sidePanel` API; stays open as you browse.
- **Live Tab List** — See all open tabs in the current window with favicon, title, and hostname. Switch or close tabs from the sidebar.
- **Tab Search** — Real-time filter across tab titles and URLs.
- **Workspaces** — Create, rename, colour-code, and delete named workspaces. The active workspace persists across sessions.
- **Sessions** — Save your open tabs as a named snapshot. Restore or delete sessions at any time.
- **Keyboard Shortcuts**
  - `Ctrl/⌘ + Shift + L` — Open Leap sidebar
  - `Ctrl/⌘ + Shift + S` — Save current tabs as a session
  - `Ctrl/⌘ + Shift + F` — Focus the tab search input
- **Real-time updates** — The tab list refreshes automatically whenever tabs are opened, closed, or updated.

---

## Architecture

```
src/
├── background/
│   └── serviceWorker.ts     # MV3 service worker: panel behaviour, tab events, commands
├── sidepanel/
│   ├── index.html           # Side panel HTML shell
│   ├── main.tsx             # React root mount
│   ├── App.tsx              # Top-level component
│   └── styles.css           # Complete design-token-driven CSS
├── components/
│   ├── Sidebar.tsx          # Orchestrator — wires stores to UI
│   ├── SearchBar.tsx        # Controlled search input
│   ├── WorkspaceList.tsx    # CRUD UI for workspaces
│   ├── TabList.tsx          # Renders filtered tab rows
│   ├── TabItem.tsx          # Single tab row (favicon, title, close)
│   ├── SessionList.tsx      # Save / restore / rename / delete sessions
│   └── EmptyState.tsx       # Reusable empty-state placeholder
├── state/
│   ├── useWorkspaceStore.ts # Zustand store — workspace state + actions
│   └── useTabStore.ts       # Zustand store — tabs, sessions, search
├── services/
│   ├── chromeTabs.ts        # chrome.tabs API wrapper
│   ├── chromeStorage.ts     # chrome.storage.local wrapper (namespaced keys)
│   ├── chromeRuntime.ts     # chrome.runtime messaging helpers
│   ├── workspaceService.ts  # Workspace CRUD over storage
│   └── sessionService.ts    # Session save/restore/delete over storage
├── types/
│   ├── tab.ts               # LeapTab interface + fromChromeTab mapper
│   ├── workspace.ts         # Workspace interface + colour tokens
│   ├── session.ts           # Session + SavedTab interfaces
│   └── messages.ts          # Typed message union for runtime bus
└── utils/
    ├── id.ts                # generateId() — no external dep
    ├── date.ts              # formatRelativeTime(), formatShortDate()
    └── debounce.ts          # Generic debounce helper
```

### Key design decisions

| Decision | Rationale |
|---|---|
| No Chrome API calls inside React components | All Chrome APIs live in `services/`; components only call store actions |
| Zustand for state | Lightweight, no boilerplate, works cleanly with async actions |
| CSS variables, no Tailwind | Keeps the bundle tiny and gives full control over the dark-mode token system |
| Separate Vite entries | `serviceWorker.ts` and the side panel app are built independently to avoid MV3 restrictions |
| `chrome.storage.local` only | No host permissions required; data never leaves the device |

---

## Chrome APIs Used

| API | Usage |
|---|---|
| `chrome.sidePanel` | Open the panel; set `openPanelOnActionClick` behaviour |
| `chrome.tabs` | Query, activate, close tabs; listen to tab lifecycle events |
| `chrome.storage.local` | Persist workspaces and sessions |
| `chrome.runtime.sendMessage` / `onMessage` | Background → side panel event bus |
| `chrome.commands` | Keyboard shortcut registration and handling |
| `chrome.windows` | Focus window when activating a tab from the sidebar |

---

## Setup

### Prerequisites

- Node.js 18+
- npm 9+
- Google Chrome 116+ (Side Panel API)

### Install & Build

```bash
# 1. Install dependencies
npm install

# 2. Build the extension
npm run build

# 3. (Optional) Watch mode during development
npm run dev
```

The production build outputs to `dist/`.

### Load as an Unpacked Extension

1. Open Chrome and navigate to `chrome://extensions`
2. Enable **Developer mode** (toggle, top-right)
3. Click **Load unpacked**
4. Select the `dist/` folder inside this project
5. The Leap icon appears in the toolbar — click it to open the side panel
6. Pin the extension for quick access

### Icons

Place four PNG icons in `public/icons/`:

```
icon16.png   16×16
icon32.png   32×32
icon48.png   48×48
icon128.png  128×128
```

A simple "L" lettermark on `#1a1a2e` background works well. See `public/icons/README.md` for an SVG template you can rasterize.

---

## Scripts

| Command | Description |
|---|---|
| `npm install` | Install all dependencies |
| `npm run build` | Production build → `dist/` |
| `npm run dev` | Incremental watch build |
| `npm run lint` | ESLint check (zero warnings) |
| `npm run type-check` | TypeScript strict type-check |

---

## Manifest V3 Notes

- The background script runs as an **ES module service worker** (`"type": "module"` in `manifest.json`), which means it can import other modules.
- Service workers are **ephemeral** — they spin down when idle. All persistent state is kept in `chrome.storage.local`, not in-memory variables.
- The `sidePanel` permission is required for `chrome.sidePanel.*` APIs (Chrome 116+).
- No `host_permissions` are declared — the extension only needs tab metadata, which the `tabs` permission covers.

---

## Future Improvements

- **Cloud sync** — Back workspaces and sessions with a user account via a simple REST API or Firebase.
- **Drag-and-drop tab reordering** — Use the HTML5 Drag and Drop API or a library like `@dnd-kit` to let users reorder tabs in the sidebar.
- **Keyboard navigation** — Arrow key navigation through the tab list; `Enter` to activate, `Delete` to close.
- **AI tab grouping** — Call an LLM API to suggest and apply tab groups based on topic clustering.
- **Window grouping** — Display tabs grouped by Chrome window, collapsible.
- **Tab preview on hover** — Use `chrome.tabs.captureVisibleTab` to show a thumbnail on hover.
- **Search across sessions** — Let users search saved session content, not just open tabs.
- **Export / import** — JSON export of all workspace and session data for backup or migration.
- **Theme support** — Light mode and system-preference detection.

---

## License

MIT
