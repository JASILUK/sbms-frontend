import { useState, useCallback, useMemo } from 'react';
import { debounce } from '../../utils/hrAttendance';

export function useAttendanceFilters(initialFilters = {}) {
  const [filters, setFilters] = useState({
    date_from: '',
    date_to: '',
    department: '',
    shift: '',
    status: '',
    review_status: '',
    work_mode: '',
    search: '',
    limit: 50,
    offset: 0,
    ordering: '-attendance_date',
    ...initialFilters,
  });

  const [searchVal, setSearchVal] = useState(initialFilters.search || '');

  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, offset: 0 }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      date_from: '',
      date_to: '',
      department: '',
      shift: '',
      status: '',
      review_status: '',
      work_mode: '',
      search: '',
      limit: 50,
      offset: 0,
      ordering: '-attendance_date',
    });
    setSearchVal('');
  }, []);

  const debouncedSearchUpdate = useMemo(
    () => debounce((val) => setFilters((prev) => ({ ...prev, search: val, offset: 0 })), 350),
    []
  );

  const handleSearchChange = useCallback((value) => {
    setSearchVal(value);
    debouncedSearchUpdate(value);
  }, [debouncedSearchUpdate]);

  const setPage = useCallback((pageIndex) => {
    setFilters((prev) => ({ ...prev, offset: pageIndex * prev.limit }));
  }, []);

  return {
    filters,
    searchVal,
    updateFilter,
    clearFilters,
    handleSearchChange,
    setPage,
  };
}