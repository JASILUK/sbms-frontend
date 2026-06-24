/**
 * Transforms absolute minute counts into an enterprise-grade scannable metric label.
 * @param {number} totalMinutes 
 * @returns {string} E.g., "8h 30m"
 */
export const formatMinutesToHours = (totalMinutes) => {
  if (!totalMinutes || isNaN(totalMinutes) || totalMinutes <= 0) return '0h 0m';
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
};

/**
 * Parses raw 24-hour database time strings into user-friendly AM/PM strings.
 * @param {string} timeString E.g., "22:00:00" or "09:30"
 * @returns {string} E.g., "10:00 PM"
 */
export const formatTimeToAmPm = (timeString) => {
  if (!timeString) return '';
  const parts = timeString.split(':');
  if (parts.length < 2) return timeString;
  
  let hours = parseInt(parts[0], 10);
  const minutes = parts[1];
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  hours = hours % 12;
  hours = hours ? hours : 12;
  
  return `${hours}:${minutes} ${ampm}`;
};

/**
 * Resolves localized system presence states into contextual UI style rules, 
 * descriptors, and action configurations.
 * @param {string} status 
 * @returns {Object} Contextual configuration profile matching the active status
 */
export const getStatusConfig = (status) => {
  const normalize = status?.toUpperCase() || 'NOT_CHECKED_IN';
  
  const matrix = {
    NOT_CHECKED_IN: {
      label: 'Not Checked In',
      colorClass: 'bg-slate-50 border-slate-200 text-slate-700 ring-slate-100',
      badgeClass: 'bg-slate-100 text-slate-800 border-slate-200',
      description: 'Your shift has started. Please verify your identity to log your daily check-in.',
      ctaLabel: 'Check In Now',
      actionable: true,
    },
    PRESENT: {
      label: 'Active on Duty',
      colorClass: 'bg-indigo-50/40 border-indigo-100 text-indigo-900 ring-indigo-50/50',
      badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      description: 'You are securely checked in. Your shift hours are currently accumulating.',
      ctaLabel: 'Check Out Day',
      actionable: true,
    },
    ON_BREAK: {
      label: 'On Break',
      colorClass: 'bg-amber-50/60 border-amber-200/60 text-amber-900 ring-amber-50/30',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
      description: 'Your continuous timing is paused. Remember to resume break once back at work.',
      ctaLabel: 'Resume Break',
      actionable: true,
    },
    CHECKED_OUT: {
      label: 'Shift Completed',
      colorClass: 'bg-emerald-50/40 border-emerald-100 text-emerald-900 ring-emerald-50/30',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      description: 'Your timesheet ledger record for today is finalized. Have a great evening!',
      ctaLabel: 'Day Completed',
      actionable: false,
    },
    HOLIDAY: {
      label: 'Company Holiday',
      colorClass: 'bg-sky-50/50 border-sky-100 text-sky-900 ring-sky-50/30',
      badgeClass: 'bg-sky-100 text-sky-800 border-sky-200',
      description: 'Today is a declared institutional break day. Enjoy your holiday rest!',
      ctaLabel: 'Enjoy Your Holiday',
      actionable: false,
    },
    WEEKEND: {
      label: 'Weekend Rest',
      colorClass: 'bg-purple-50/40 border-purple-100 text-purple-900 ring-purple-50/30',
      badgeClass: 'bg-purple-100 text-purple-800 border-purple-200',
      description: 'Today is your designated weekly rest calendar cycle. See you next week.',
      ctaLabel: 'Weekend Rest',
      actionable: false,
    },
    ON_LEAVE: {
      label: 'Approved Time Off',
      colorClass: 'bg-teal-50/40 border-teal-100 text-teal-900 ring-teal-50/30',
      badgeClass: 'bg-teal-100 text-teal-800 border-teal-200',
      description: 'Your active absence request for today is approved and synchronized by administration.',
      ctaLabel: 'On Leave',
      actionable: false,
    },
    ABSENT: {
      label: 'Marked Absent',
      colorClass: 'bg-rose-50/40 border-rose-100 text-rose-900 ring-rose-50/30',
      badgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
      description: 'No baseline punch metrics were detected within your designated check-in window.',
      ctaLabel: 'Absent Profile',
      actionable: false,
    },
  };

  return matrix[normalize] || matrix.NOT_CHECKED_IN;
};