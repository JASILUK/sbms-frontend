import { MEETING_STATUS } from "../constants/meetingConstants";

/**
 * Check if a meeting is currently live
 */
export const isMeetingLive = (meeting) => {
  if (!meeting) return false;
  return meeting.status === MEETING_STATUS.LIVE;
};

/**
 * Check if meeting is scheduled for today
 */
export const isMeetingToday = (meeting) => {
  if (!meeting?.scheduled_start) return false;
  const today = new Date();
  const start = new Date(meeting.scheduled_start);
  return (
    start.getDate() === today.getDate() &&
    start.getMonth() === today.getMonth() &&
    start.getFullYear() === today.getFullYear()
  );
};

/**
 * Format time for display (e.g., "2:30 PM")
 */
export const formatMeetingTime = (dateString, timezone) => {
  if (!dateString) return "—";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: timezone || undefined,
  }).format(date);
};

/**
 * Format date for display (e.g., "Mon, Jan 15")
 */
export const formatMeetingDate = (dateString, timezone) => {
  if (!dateString) return "—";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: timezone || undefined,
  }).format(date);
};

/**
 * Format relative time (e.g., "Started 5 min ago")
 */
export const formatRelativeTime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return formatMeetingDate(dateString);
};

/**
 * Get duration between two dates in minutes
 */
export const getDurationMinutes = (start, end) => {
  if (!start || !end) return null;
  const diff = new Date(end) - new Date(start);
  return Math.round(diff / 60000);
};

/**
 * Filter meetings by search term
 */
export const filterBySearch = (meetings, searchTerm) => {
  if (!searchTerm?.trim()) return meetings;
  const term = searchTerm.toLowerCase();
  return meetings.filter(
    (m) =>
      m.title?.toLowerCase().includes(term) ||
      m.created_by?.toLowerCase().includes(term) ||
      m.category?.toLowerCase().includes(term)
  );
};
