export const MEETING_STATUS = {
  LIVE: "live",
  SCHEDULED: "scheduled",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

export const MEETING_STATUS_CONFIG = {
  [MEETING_STATUS.LIVE]: {
    label: "Live",
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
    dot: "bg-red-500",
    pulse: true,
  },
  [MEETING_STATUS.SCHEDULED]: {
    label: "Scheduled",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    dot: "bg-blue-500",
    pulse: false,
  },
  [MEETING_STATUS.COMPLETED]: {
    label: "Completed",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
    pulse: false,
  },
  [MEETING_STATUS.CANCELLED]: {
    label: "Cancelled",
    color: "text-slate-500",
    bg: "bg-slate-100",
    border: "border-slate-200",
    dot: "bg-slate-400",
    pulse: false,
  },
};

export const MEETING_CATEGORIES = {
  TEAM: "team",
  CLIENT: "client",
  ALL_HANDS: "all_hands",
  ONE_ON_ONE: "one_on_one",
  WORKSHOP: "workshop",
};

export const MEETING_VISIBILITY = {
  PUBLIC: "public",
  PRIVATE: "private",
  TENANT_ONLY: "tenant_only",
};

export const FILTER_OPTIONS = {
  status: [
    { value: "", label: "All Statuses" },
    { value: MEETING_STATUS.LIVE, label: "Live" },
    { value: MEETING_STATUS.SCHEDULED, label: "Scheduled" },
    { value: MEETING_STATUS.COMPLETED, label: "Completed" },
    { value: MEETING_STATUS.CANCELLED, label: "Cancelled" },
  ],
  orderBy: [
    { value: "-scheduled_start", label: "Newest / Upcoming" },
    { value: "scheduled_start", label: "Oldest" },
    { value: "-created_at", label: "Recently Created" },
  ],
};
