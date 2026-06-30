import { useState, useMemo, useCallback } from "react";
import { useGetHRCompanyLedgerQuery } from "../../api/hrAttendanceManagementApi";

const DEFAULT_LIMIT = 20;

const STATUS_FILTER_MAP = {
  present: "PRESENT",
  absent: "ABSENT",
  late: "LATE",
  working: "WORKING",
  checked_out: "CHECKED_OUT",
  on_break: "ON_BREAK",
  leave: "LEAVE",
  holiday: "HOLIDAY",
  weekend: "WEEKEND",
  need_review: "NEEDS_REVIEW",
  overtime: "OVERTIME",
};

/**
 * Drives the EmployeeTable: filters, sorting, search, pagination.
 * `statusFilterKey` is the key clicked from a Today Status card and is
 * translated to the API's `status` query param.
 */
export function useAttendanceLedger({ dateParam, statusFilterKey } = {}) {
  const [filters, setFilters] = useState({
    search: "",
    department: "",
    method: "",
    dateFrom: dateParam || "",
    dateTo: dateParam || "",
    review: "",
    holiday: "",
    weekend: "",
    late: "",
    leave: "",
  });
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState({ field: "attendance_date", direction: "desc" });

  const updateFilter = useCallback((key, value) => {
    setPage(0);
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setPage(0);
    setFilters({
      search: "",
      department: "",
      method: "",
      dateFrom: dateParam || "",
      dateTo: dateParam || "",
      review: "",
      holiday: "",
      weekend: "",
      late: "",
      leave: "",
    });
  }, [dateParam]);

  const queryParams = useMemo(() => {
    const params = {
      limit: DEFAULT_LIMIT,
      offset: page * DEFAULT_LIMIT,
      ordering: `${sort.direction === "desc" ? "-" : ""}${sort.field}`,
    };
    if (filters.search) params.search = filters.search;
    if (filters.department) params.department = filters.department;
    if (filters.dateFrom) params.date_from = filters.dateFrom;
    if (filters.dateTo) params.date_to = filters.dateTo;

    const cardStatus = statusFilterKey ? STATUS_FILTER_MAP[statusFilterKey] : null;
    if (cardStatus) params.status = cardStatus;

    return params;
  }, [filters, page, sort, statusFilterKey]);

  const { data, isLoading, isFetching, isError, error, refetch } = useGetHRCompanyLedgerQuery(queryParams);

  const rows = data?.results ?? [];
  const totalCount = data?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / DEFAULT_LIMIT));

  return {
    filters,
    updateFilter,
    clearFilters,
    sort,
    setSort,
    page,
    setPage,
    totalPages,
    totalCount,
    rows,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    pageSize: DEFAULT_LIMIT,
  };
}
