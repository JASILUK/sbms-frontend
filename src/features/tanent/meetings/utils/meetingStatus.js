export const MEETING_STATUS = {
  SCHEDULED: "scheduled",
  LIVE: "live",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

export const MEETING_STATUS_CONFIG = {
  [MEETING_STATUS.SCHEDULED]: {
    label: "Scheduled",
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
    dot: "bg-blue-500",
    pulse: false,
    badge: "bg-blue-100 text-blue-700 border-blue-200",
  },
  [MEETING_STATUS.LIVE]: {
    label: "Live",
    color: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-200",
    dot: "bg-red-500",
    pulse: true,
    badge: "bg-red-100 text-red-700 border-red-200",
  },
  [MEETING_STATUS.COMPLETED]: {
    label: "Completed",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
    pulse: false,
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  [MEETING_STATUS.CANCELLED]: {
    label: "Cancelled",
    color: "text-slate-600",
    bg: "bg-slate-100",
    border: "border-slate-200",
    dot: "bg-slate-400",
    pulse: false,
    badge: "bg-slate-100 text-slate-600 border-slate-200",
  },
};

export const isMeetingLive = (status) => status === MEETING_STATUS.LIVE;
export const isMeetingScheduled = (status) => status === MEETING_STATUS.SCHEDULED;
export const isMeetingCompleted = (status) => status === MEETING_STATUS.COMPLETED;
export const isMeetingCancelled = (status) => status === MEETING_STATUS.CANCELLED;
