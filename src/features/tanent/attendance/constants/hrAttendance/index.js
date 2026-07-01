/**
 * Refactored Enterprise HR Attendance Constants & Enumerations
 * Consolidated strictly down to the two production system permissions.
 */

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

export const REVIEW_STATUS = {
  PENDING: 'PENDING',
  ASSIGNED: 'ASSIGNED',
  IN_REVIEW: 'IN_REVIEW',
  RESOLVED: 'RESOLVED',
  REJECTED: 'REJECTED',
  ESCALATED: 'ESCALATED',
};

export const REVIEW_PRIORITY = {
  CRITICAL: 'CRITICAL',
  HIGH: 'HIGH',
  MEDIUM: 'MEDIUM',
  LOW: 'LOW',
};

export const ANOMALY_TYPE = {
  MISSING_CHECKOUT: 'MISSING_CHECKOUT',
  AUTO_CLOSED: 'AUTO_CLOSED',
  LATE_ARRIVAL: 'LATE_ARRIVAL',
  GPS_VIOLATION: 'GPS_VIOLATION',
  NEEDS_REVIEW: 'NEEDS_REVIEW',
};

export const ATTENDANCE_METHOD = {
  GPS_FACE: 'GPS_FACE',
  GPS_ONLY: 'GPS_ONLY',
  FACE_ONLY: 'FACE_ONLY',
  BIOMETRIC: 'BIOMETRIC',
  MANUAL: 'MANUAL',
};

export const ACTION_TYPES = {
  MANUAL_CHECK_IN: 'MANUAL_CHECK_IN',
  MANUAL_CHECK_OUT: 'MANUAL_CHECK_OUT',
  BREAK_START: 'BREAK_START',
  BREAK_END: 'BREAK_END',
  STATUS_OVERRIDE: 'STATUS_OVERRIDE',
  FINALIZE: 'FINALIZE',
  UNLOCK: 'UNLOCK',
  REPROCESS: 'REPROCESS',
  MARK_REVIEW: 'MARK_REVIEW',
  CLEAR_REVIEW: 'CLEAR_REVIEW',
};

export const EXPORT_FORMATS = {
  CSV: 'CSV',
  EXCEL: 'EXCEL',
  PDF: 'PDF',
};

// Consolidated permissions block mapping directly to your two available codes
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
  REPORTS: '/app/attendance/hr/reports',
};

export const ATTENDANCE_THEME = {
  [ATTENDANCE_STATUS.PRESENT]: {
    color: 'text-emerald-700 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    border: 'border-emerald-200 dark:border-emerald-900',
    badge: 'success',
  },
  [ATTENDANCE_STATUS.ABSENT]: {
    color: 'text-rose-700 dark:text-rose-400',
    bg: 'bg-rose-50 dark:bg-rose-950/40',
    border: 'border-rose-200 dark:border-rose-900',
    badge: 'error',
  },
  [ATTENDANCE_STATUS.HALF_DAY]: {
    color: 'text-amber-700 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    border: 'border-amber-200 dark:border-amber-900',
    badge: 'warning',
  },
  [ATTENDANCE_STATUS.LEAVE]: {
    color: 'text-purple-700 dark:text-purple-400',
    bg: 'bg-purple-50 dark:bg-purple-950/40',
    border: 'border-purple-200 dark:border-purple-900',
    badge: 'purple',
  },
  [ATTENDANCE_STATUS.HOLIDAY]: {
    color: 'text-blue-700 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    border: 'border-blue-200 dark:border-blue-900',
    badge: 'blue',
  },
  [ATTENDANCE_STATUS.WEEKEND]: {
    color: 'text-slate-600 dark:text-slate-400',
    bg: 'bg-slate-50 dark:bg-slate-800/40',
    border: 'border-slate-200 dark:border-slate-700',
    badge: 'neutral',
  },
  [ATTENDANCE_STATUS.REVIEW_REQUIRED]: {
    color: 'text-red-700 dark:text-red-400',
    bg: 'bg-red-50 dark:bg-red-950/40',
    border: 'border-red-200 dark:border-red-900',
    badge: 'critical',
  },
};

export const PRIORITY_THEME = {
  [REVIEW_PRIORITY.CRITICAL]: { bg: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300', ring: 'ring-red-600/20' },
  [REVIEW_PRIORITY.HIGH]: { bg: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300', ring: 'ring-orange-600/20' },
  [REVIEW_PRIORITY.MEDIUM]: { bg: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300', ring: 'ring-amber-600/20' },
  [REVIEW_PRIORITY.LOW]: { bg: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300', ring: 'ring-slate-600/20' },
};