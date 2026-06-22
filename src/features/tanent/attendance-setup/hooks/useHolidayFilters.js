import { useState, useEffect } from "react";

export const useHolidayFilters = () => {
  const currentYear = new Date().getFullYear();
  
  const [filters, setFilters] = useState({
    year: currentYear,
    month: "all",
    holiday_type: "all",
    upcoming: false,
  });

  const [debouncedFilters, setDebouncedFilters] = useState(filters);

  // Debounce filter modifications to keep query state evaluations smooth and performant
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 200);

    return () => clearTimeout(handler);
  }, [filters]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const getActiveParams = () => {
    const params = {};
    
    // Explicitly map the year baseline tracking parameter
    if (debouncedFilters.year) {
      params.year = debouncedFilters.year;
    }
    
    // Clean evaluation: drop the query parameter completely if set to "all" 
    // to let the backend return the entire year instead of defaulting to a single month filter
    if (debouncedFilters.month && debouncedFilters.month !== "all") {
      params.month = debouncedFilters.month;
    }
    
    if (debouncedFilters.holiday_type && debouncedFilters.holiday_type !== "all") {
      params.holiday_type = debouncedFilters.holiday_type;
    }
    
    if (debouncedFilters.upcoming) {
      params.upcoming = true;
    }
    
    return params;
  };

  return {
    filters,
    updateFilter,
    queryParameters: getActiveParams(),
  };
};