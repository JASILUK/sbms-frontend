export const CARD_STATUS_KEYS = {
  TOTAL: 'TOTAL',
  WORKING: 'WORKING',
  BREAK: 'BREAK',
  CHECKED_OUT: 'CHECKED_OUT',
  NOT_CHECKED_IN: 'NOT_CHECKED_IN',
};

export const STATUS_BADGE_THEMES = {
  WORKING: { text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', label: 'Working' },
  BREAK: { text: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', label: 'On Break' },
  CHECKED_OUT: { text: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200', label: 'Checked Out' },
  ABSENT: { text: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200', label: 'Absent' },
  LEAVE: { text: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-200', label: 'On Leave' },
  NOT_STARTED: { text: 'text-slate-500', bg: 'bg-slate-100', border: 'border-slate-200', label: 'Not Started' },
};