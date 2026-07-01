/**
 * Core Structural Representation & Serialization Utilities
 */

export function debounce(fn, delay) {
  let timer = null;
  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

export function formatMinutesToHours(minutes = 0) {
  if (isNaN(minutes) || minutes < 0) return '0.00h';
  const hours = minutes / 60;
  return `${hours.toFixed(2)}h`;
}

export function formatAttendancePercentage(value = 0) {
  const percentage = typeof value === 'number' ? value : parseFloat(value) || 0;
  return `${percentage.toFixed(1)}%`;
}

export function serializeFilters(filterObj) {
  const cleanParams = {};
  Object.entries(filterObj).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      cleanParams[key] = String(value).trim();
    }
  });
  return cleanParams;
}

export function buildAccessibleTableColumn(id, name, isSortable = false, currentOrdering = '') {
  const isSorted = currentOrdering.replace('-', '') === id;
  const isDesc = currentOrdering.startsWith('-');
  
  return {
    id,
    name,
    isSortable,
    ariaSort: !isSorted ? 'none' : isDesc ? 'descending' : 'ascending',
  };
}