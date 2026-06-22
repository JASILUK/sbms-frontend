import { useState, useEffect, useMemo } from "react";

export const useAssignmentFilters = () => {
  const [filters, setFilters] = useState({
    search: "",
    shift_id: "all",
    membership_id: "all",
    // FIXED: Changed from "true" to "all" so future/pending allocations are visible right away
    active_only: "all", 
    ordering: "-effective_from",
  });

  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(filters.search), 250);
    return () => clearTimeout(handler);
  }, [filters.search]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const queryParameters = useMemo(() => {
    const params = {
      ordering: filters.ordering,
    };
    if (filters.active_only !== "all") {
      params.active_only = filters.active_only === "true";
    }
    if (filters.shift_id !== "all") {
      params.shift_id = filters.shift_id;
    }
    if (filters.membership_id !== "all") {
      params.membership_id = filters.membership_id;
    }
    return params;
  }, [filters.active_only, filters.shift_id, filters.membership_id, filters.ordering]);

  return {
    filters,
    debouncedSearch,
    updateFilter,
    queryParameters,
  };
};