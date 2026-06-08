// hooks/useActiveCompany.js
import { useMemo, useCallback } from "react";

export function useActiveCompany(companies) {
  const STORAGE_KEY = "activeCompanyId";

  // Memoized valid IDs to prevent recalculation
  const validCompanyIds = useMemo(() => 
    companies.map(c => c.id.toString()), 
    [companies]
  );

  // Get active company with validation
  const getActiveCompany = useCallback(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    const isValid = validCompanyIds.includes(stored);
    if (!isValid) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return stored;
  }, [validCompanyIds]);

  // Set active company (only if changed and valid)
  const setActiveCompany = useCallback((companyId) => {
    const strId = companyId?.toString();
    
    // Validation
    if (!strId || !validCompanyIds.includes(strId)) {
      console.error("Invalid company ID:", companyId);
      return false;
    }

    const current = localStorage.getItem(STORAGE_KEY);
    if (current !== strId) {
      localStorage.setItem(STORAGE_KEY, strId);
      console.log("Active company set:", strId);
    }
    return true;
  }, [validCompanyIds]);

  // Clear active company
  const clearActiveCompany = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { getActiveCompany, setActiveCompany, clearActiveCompany, validCompanyIds };
}