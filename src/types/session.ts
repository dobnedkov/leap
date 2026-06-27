export interface SavedTab {
  url: string;
  title: string;
  favIconUrl: string;
  pinned: boolean;
}

export interface Session {
  id: string;
  name: string;
  workspaceId: string;
  tabs: SavedTab[];
  createdAt: number;
  updatedAt: number;
}
