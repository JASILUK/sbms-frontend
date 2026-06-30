import { useState, useMemo, useCallback } from "react";
import { format } from "date-fns";
import { useGetHRDashboardSummaryQuery } from "../../api/hrAttendanceManagementApi";

export function useAttendanceDashboard() {
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [activeStatusFilter, setActiveStatusFilter] = useState(null);

  const dateParam = useMemo(() => format(selectedDate, "yyyy-MM-dd"), [selectedDate]);

  const { data, isLoading, isFetching, isError, error, refetch } = useGetHRDashboardSummaryQuery({
    date: dateParam,
  });

  const summary = data?.data ?? null;

  const toggleStatusFilter = useCallback((statusKey) => {
    setActiveStatusFilter((prev) => (prev === statusKey ? null : statusKey));
  }, []);

  return {
    selectedDate,
    setSelectedDate,
    dateParam,
    summary,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    activeStatusFilter,
    toggleStatusFilter,
    clearStatusFilter: () => setActiveStatusFilter(null),
  };
}
