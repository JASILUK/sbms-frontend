// # attendance/utils/hrAttendance/statusUtils.js

/**
 * Status color and label mappings for Live Workforce.
 */

export const STATUS_CONFIG = {
  WORKING: {
    label: 'Working',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500',
    chip: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  BREAK: {
    label: 'On Break',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
    chip: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  CHECKED_OUT: {
    label: 'Checked Out',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    dot: 'bg-blue-500',
    chip: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  NOT_STARTED: {
    label: 'Not Started',
    bg: 'bg-slate-50',
    text: 'text-slate-600',
    border: 'border-slate-200',
    dot: 'bg-slate-400',
    chip: 'bg-slate-100 text-slate-700 border-slate-200',
  },
  ABSENT: {
    label: 'Absent',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
    dot: 'bg-rose-500',
    chip: 'bg-rose-100 text-rose-800 border-rose-200',
  },
  LEAVE: {
    label: 'On Leave',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
    dot: 'bg-purple-500',
    chip: 'bg-purple-100 text-purple-800 border-purple-200',
  },
  HOLIDAY: {
    label: 'Holiday',
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
    dot: 'bg-indigo-500',
    chip: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  },
  WEEKEND: {
    label: 'Weekend',
    bg: 'bg-cyan-50',
    text: 'text-cyan-700',
    border: 'border-cyan-200',
    dot: 'bg-cyan-500',
    chip: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  },
  REVIEW_REQUIRED: {
    label: 'Needs Review',
    bg: 'bg-white',
    text: 'text-rose-700',
    border: 'border-rose-300',
    dot: 'bg-rose-500',
    chip: 'bg-white text-rose-700 border-rose-300 ring-1 ring-rose-200',
  },
};

export const getStatusConfig = (status) => {
  return STATUS_CONFIG[status] || STATUS_CONFIG.NOT_STARTED;
};

/**
 * Format minutes into human-readable duration.
 */
export const formatDuration = (minutes) => {
  if (!minutes || minutes <= 0) return '—';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
};

/**
 * Format datetime to time string.
 */
export const formatTime = (datetime) => {
  if (!datetime) return '—';
  const date = new Date(datetime);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

/**
 * Format datetime to full string.
 */
export const formatDateTime = (datetime) => {
  if (!datetime) return '—';
  const date = new Date(datetime);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};