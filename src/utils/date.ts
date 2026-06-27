/** Format a Unix timestamp as a human-readable relative string */
export function formatRelativeTime(timestamp: number): string {
  const delta = Date.now() - timestamp;
  const minutes = Math.floor(delta / 60_000);
  const hours = Math.floor(delta / 3_600_000);
  const days = Math.floor(delta / 86_400_000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return new Date(timestamp).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

/** Format a timestamp as a short date string for display */
export function formatShortDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
