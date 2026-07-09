export const ATTENDANCE_STATUS = {
  PRESENT: 'PRESENT',
  ABSENT: 'ABSENT',
  HALF_DAY: 'HALF_DAY',
  LEAVE: 'LEAVE',
  HOLIDAY: 'HOLIDAY',
  WEEKEND: 'WEEKEND',
  INCOMPLETE: 'INCOMPLETE',
  REVIEW_REQUIRED: 'REVIEW_REQUIRED',
};

export const ATTENDANCE_METHOD = {
  MANUAL: 'MANUAL',
  ADMIN_OVERRIDE: 'ADMIN_OVERRIDE',
  BIOMETRIC: 'BIOMETRIC',
  GPS: 'GPS',
  FACE_RECOGNITION: 'FACE_RECOGNITION',
  QR: 'QR',
};

export const ACTION_TYPES = {
  MANUAL_CHECK_IN: 'MANUAL_CHECK_IN',
  MANUAL_CHECK_OUT: 'MANUAL_CHECK_OUT',
  BREAK_START: 'BREAK_START',
  BREAK_END: 'BREAK_END',
  MANUAL_CORRECTION: 'MANUAL_CORRECTION',
  FINALIZE: 'FINALIZE',
  UNLOCK: 'UNLOCK',
  RECALCULATE: 'RECALCULATE',
  RESOLVE_REVIEW: 'RESOLVE_REVIEW',
};

export const EXPORT_FORMATS = {
  CSV: 'CSV',
  EXCEL: 'EXCEL',
  PDF: 'PDF',
};

export const HR_PERMISSIONS = {
  MANAGE: 'tenant.attendance.manage',
  VIEW: 'tenant.attendance.view',
};

export const HR_ROUTES = {
  DASHBOARD: '/app/attendance/hr/dashboard',
  DIRECTORY: '/app/attendance/hr/directory',
  PROFILE: (membershipId) => `/app/attendance/hr/profile/${membershipId}`,
  RECORD_DETAIL: (recordId) => `/app/attendance/hr/records/${recordId}`,
  REVIEW_QUEUE: '/app/attendance/hr/review-queue',
};

export const ATTENDANCE_THEME = {
  [ATTENDANCE_STATUS.PRESENT]: {
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    badge: 'success',
  },
  [ATTENDANCE_STATUS.ABSENT]: {
    color: 'text-rose-700',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    badge: 'error',
  },
  [ATTENDANCE_STATUS.HALF_DAY]: {
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    badge: 'warning',
  },
  [ATTENDANCE_STATUS.LEAVE]: {
    color: 'text-purple-700',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    badge: 'purple',
  },
  [ATTENDANCE_STATUS.HOLIDAY]: {
    color: 'text-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    badge: 'blue',
  },
  [ATTENDANCE_STATUS.WEEKEND]: {
    color: 'text-slate-600',
    bg: 'bg-slate-50',
    border: 'border-slate-200',
    badge: 'neutral',
  },
  [ATTENDANCE_STATUS.REVIEW_REQUIRED]: {
    color: 'text-red-700',
    bg: 'bg-red-50',
    border: 'border-red-200',
    badge: 'critical',
  },
};
