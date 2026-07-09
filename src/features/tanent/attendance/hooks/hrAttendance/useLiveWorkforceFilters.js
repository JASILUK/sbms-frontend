//  attendance/hooks/hrAttendance/useLiveWorkforceFilters.js

import { useState, useCallback, useMemo } from 'react';
import { debounce } from '../../utils/hrAttendance';

const INITIAL_FILTERS = {
  date: '',
  search: '',
  department: '',
  shift: '',
  status: '',
  needs_review: '',
  late_only: '',
  missing_checkout: '',
  auto_closed: '',
  work_mode: '',
  ordering: 'employee_name',
  limit: 20,
  offset: 0,
};

export function useLiveWorkforceFilters(initialFilters = {}) {
  const [filters, setFilters] = useState({
    ...INITIAL_FILTERS,
    ...initialFilters,
  });

  const [searchVal, setSearchVal] = useState(initialFilters.search || '');

  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      offset: 0, // Reset pagination on filter change
    }));
  }, []);

  const setStatusFilter = useCallback((status) => {
    setFilters((prev) => ({
      ...prev,
      status: prev.status === status ? '' : status,
      offset: 0,
    }));
  }, []);

  const setNeedsReview = useCallback((value) => {
    setFilters((prev) => ({
      ...prev,
      needs_review: prev.needs_review === value ? '' : value,
      offset: 0,
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
    setSearchVal('');
  }, []);

  const debouncedSearchUpdate = useMemo(
    () => debounce((val) => {
      setFilters((prev) => ({ ...prev, search: val, offset: 0 }));
    }, 350),
    []
  );

  const handleSearchChange = useCallback((value) => {
    setSearchVal(value);
    debouncedSearchUpdate(value);
  }, [debouncedSearchUpdate]);

  const setPage = useCallback((pageIndex) => {
    setFilters((prev) => ({
      ...prev,
      offset: pageIndex * prev.limit,
    }));
  }, []);

  const setOrdering = useCallback((field) => {
    setFilters((prev) => {
      const current = prev.ordering;
      const isSame = current === field;
      const isReverse = current === `-${field}`;
      let next;
      if (isSame) {
        next = `-${field}`;
      } else if (isReverse) {
        next = field;
      } else {
        next = field;
      }
      return { ...prev, ordering: next, offset: 0 };
    });
  }, []);

  return {
    filters,
    searchVal,
    updateFilter,
    setStatusFilter,
    setNeedsReview,
    clearFilters,
    handleSearchChange,
    setPage,
    setOrdering,
  };
}