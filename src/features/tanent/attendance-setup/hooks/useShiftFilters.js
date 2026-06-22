import { useState, useEffect, useMemo } from "react";

export const useShiftFilters = () => {
  const [filters, setFilters] = useState({
    search: "",
    is_active: "all",
    shift_type: "all",
    ordering: "name",
  });

  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 250);
    return () => clearTimeout(timer);
  }, [filters.search]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const queryParameters = useMemo(() => {
    const params = {};
    
    if (debouncedSearch.trim()) {
      params.search = debouncedSearch.trim();
    }
    if (filters.is_active !== "all") {
      params.is_active = filters.is_active === "active";
    }
    if (filters.shift_type !== "all") {
      params.shift_type = filters.shift_type;
    }
    if (filters.ordering) {
      params.ordering = filters.ordering;
    }
    
    return params;
  }, [debouncedSearch, filters.is_active, filters.shift_type, filters.ordering]);

  return {
    filters,
    updateFilter,
    queryParameters,
  };
};