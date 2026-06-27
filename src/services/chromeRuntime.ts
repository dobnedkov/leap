import { LeapMessage, MessageType } from "../types/messages";

/** Send a fire-and-forget message to the background service worker */
export async function sendMessage(message: LeapMessage): Promise<unknown> {
  try {
    return await chrome.runtime.sendMessage(message);
  } catch {
    // Extension context might not be ready — suppress gracefully
    console.warn("[Leap] sendMessage failed:", message.type);
    return null;
  }
}

/** Listen for messages from the background (used in the side panel) */
export function onMessage(
  handler: (message: LeapMessage) => void
): () => void {
  const listener = (message: LeapMessage) => {
    handler(message);
  };
  chrome.runtime.onMessage.addListener(listener);
  return () => chrome.runtime.onMessage.removeListener(listener);
}

/** Helper to broadcast a typed message with no payload */
export function broadcast(type: MessageType): Promise<unknown> {
  return sendMessage({ type });
}
