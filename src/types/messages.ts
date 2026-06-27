export type MessageType =
  | "OPEN_SIDE_PANEL"
  | "SAVE_SESSION_COMMAND"
  | "SEARCH_TABS_COMMAND"
  | "TABS_UPDATED"
  | "PING";

export interface LeapMessage {
  type: MessageType;
  payload?: unknown;
}

export interface PingMessage extends LeapMessage {
  type: "PING";
}

export interface TabsUpdatedMessage extends LeapMessage {
  type: "TABS_UPDATED";
}
