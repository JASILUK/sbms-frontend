import { METHOD_TYPES } from '../constants/attendanceMethodsConstants';

/**
 * Rule 3 Execution: Enforce structural parameters deduplication profiles boundaries.
 */
export const normalizeSelectedMethods = (methodsArray = []) => {
  if (!Array.isArray(methodsArray)) return [];
  const cleaned = methodsArray.map(m => String(m).trim().toUpperCase());
  return [...new Set(cleaned)];
};

/**
 * Validates invariant state configs locally before payload transaction dispatch.
 */
export const validateSelectionInvariants = (selectedMethods = []) => {
  if (selectedMethods.length === 0) return false;
  if (selectedMethods.length === 1 && selectedMethods[0] === METHOD_TYPES.MANUAL) return false;
  return true;
};