/**
 * Formats a date/timestamp into a relative, human-friendly string
 * for chat lists and recommendations — e.g. "Just now", "2 hours ago",
 * "Yesterday", or a full date for older items.
 */
export function formatRelativeTime(dateInput) {
  if (!dateInput) return "";

  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "";

  const now = new Date();
  const diffMs = now - date;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} min${diffMinutes > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;

  return formatFullDate(date);
}

/**
 * Formats a date as a readable full date — e.g. "24 Aug 2026".
 * Used for saved recommendations, pet profiles, and older conversations.
 */
export function formatFullDate(dateInput) {
  if (!dateInput) return "";

  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Formats a date with time — e.g. "24 Aug 2026, 6:45 PM".
 * Useful for detailed views (e.g. inside an open conversation).
 */
export function formatDateTime(dateInput) {
  if (!dateInput) return "";

  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "";

  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}