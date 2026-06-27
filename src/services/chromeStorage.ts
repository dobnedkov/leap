/**
 * Type-safe wrapper around chrome.storage.local.
 * All data is stored under namespaced keys.
 */

const KEYS = {
  workspaces: "leap:workspaces",
  activeWorkspaceId: "leap:activeWorkspaceId",
  sessions: "leap:sessions",
} as const;

type StorageKey = (typeof KEYS)[keyof typeof KEYS];

async function get<T>(key: StorageKey): Promise<T | null> {
  const result = await chrome.storage.local.get(key);
  return (result[key] as T) ?? null;
}

async function set<T>(key: StorageKey, value: T): Promise<void> {
  await chrome.storage.local.set({ [key]: value });
}

async function remove(key: StorageKey): Promise<void> {
  await chrome.storage.local.remove(key);
}

export const storage = {
  KEYS,
  get,
  set,
  remove,

  /** Convenience: get all Leap-related storage at once */
  async getAll(): Promise<Record<StorageKey, unknown>> {
    return chrome.storage.local.get(Object.values(KEYS)) as Promise<
      Record<StorageKey, unknown>
    >;
  },

  /** Clear all Leap data (useful for reset / dev) */
  async clearAll(): Promise<void> {
    await chrome.storage.local.remove(Object.values(KEYS));
  },
};
