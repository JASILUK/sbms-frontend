export const formatDateTime = (dateString, timezone = "UTC") => {
  if (!dateString) return "—";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: timezone || "UTC",
  }).format(date);
};

export const formatTime = (dateString, timezone = "UTC") => {
  if (!dateString) return "—";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: timezone || "UTC",
  }).format(date);
};

export const formatDate = (dateString, timezone = "UTC") => {
  if (!dateString) return "—";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: timezone || "UTC",
  }).format(date);
};

export const formatRelativeTime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateString);
};

export const getDuration = (start, end) => {
  if (!start || !end) return null;
  const diffMs = new Date(end) - new Date(start);
  const mins = Math.round(diffMs / 60000);
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  if (hours > 0) return `${hours}h ${remainingMins > 0 ? `${remainingMins}m` : ""}`;
  return `${mins}m`;
};

// Aliases for detail page components
export const formatDurationShort = (start, end) => {
  const duration = getDuration(start, end);
  return duration || "—";
};

export const capitalize = (str) => {
  if (!str) return "";
  return str.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

export const formatParticipantRole = (role) => {
  if (!role) return "Member";
  return role.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
};

export const formatParticipantStatus = (status) => {
  const map = { invited: "Invited", joined: "Joined", declined: "Declined", removed: "Removed" };
  return map[status] || status;
};
