/**
 * Pure function sorting corporate scoped access rules based on their operational priority matrix metrics values.
 */
export const orderRulesByPriorityMetrics = (rules = []) => {
  if (!Array.isArray(rules)) return [];
  return [...rules].sort((a, b) => (a.priority || 0) - (b.priority || 0));
};

/**
 * Parses and maps server exception response packets into human-readable user warnings.
 */
export const formatAxiosErrorContext = (error, fallback = 'Operational database execution transaction error.') => {
  if (!error) return fallback;
  if (error.data?.message) return error.data.message;
  if (error.data && typeof error.data === 'object') {
    const vectors = Object.values(error.data);
    if (vectors.length > 0 && Array.isArray(vectors[0])) return vectors[0][0];
  }
  if (error.message) return error.message;
  return fallback;
};

/**
 * Filter criteria verifying employee properties against multi-layered search parameters.
 */
export const matchesEmployeeSearchCriteria = (employee, term = '') => {
  if (!employee) return false;
  const normalized = term.toLowerCase().trim();
  if (!normalized) return true;
  
  return (
    employee.username?.toLowerCase().includes(normalized) ||
    employee.user_email?.toLowerCase().includes(normalized) ||
    employee.department_name?.toLowerCase().includes(normalized) ||
    employee.job_title?.toLowerCase().includes(normalized)
  );
};