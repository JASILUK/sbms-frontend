import { useState, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  useGetMyAttendanceQuery,
  useGetMyAttendanceSummaryQuery,
  useGetMyAttendanceTrendsQuery,
  useGetMyAttendanceCalendarQuery,
} from "../api/attendanceApi";

export function useMyAttendance() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeDrawerId, setActiveDrawerId] = useState(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const currentYear = useMemo(() => parseInt(searchParams.get("year") || "2026", 10), [searchParams]);
  const currentMonth = useMemo(() => parseInt(searchParams.get("month") || "6", 10), [searchParams]);
  const statusFilter = useMemo(() => searchParams.get("status") || "", [searchParams]);
  const dateFrom = useMemo(() => searchParams.get("date_from") || "", [searchParams]);
  const dateTo = useMemo(() => searchParams.get("date_to") || "", [searchParams]);

  const listParams = useMemo(() => ({
    month: currentMonth,
    year: currentYear,
    ...(statusFilter && { status: statusFilter }),
    ...(dateFrom && { date_from: dateFrom }),
    ...(dateTo && { date_to: dateTo }),
  }), [currentMonth, currentYear, statusFilter, dateFrom, dateTo]);

  const { data: listData, isLoading: isListLoading, isError: isListError, refetch: refetchList } = useGetMyAttendanceQuery(listParams);
  const { data: summaryData, isLoading: isSummaryLoading, isError: isSummaryError, refetch: refetchSummary } = useGetMyAttendanceSummaryQuery();
  const { data: trendData, isLoading: isTrendLoading, isError: isTrendError, refetch: refetchTrends } = useGetMyAttendanceTrendsQuery({ year: currentYear });
  const { data: calendarData, isLoading: isCalendarLoading, isError: isCalendarError, refetch: refetchCalendar } = useGetMyAttendanceCalendarQuery({ year: currentYear, month: currentMonth });

  const handleMonthChange = useCallback((month, year) => {
    setSearchParams((prev) => {
      prev.set("month", month.toString());
      prev.set("year", year.toString());
      return prev;
    });
  }, [setSearchParams]);

  const handleApplyFilters = useCallback((filters) => {
    setSearchParams((prev) => {
      if (filters.status) prev.set("status", filters.status);
      else prev.delete("status");
      if (filters.date_from) prev.set("date_from", filters.date_from);
      else prev.delete("date_from");
      if (filters.date_to) prev.set("date_to", filters.date_to);
      else prev.delete("date_to");
      return prev;
    });
  }, [setSearchParams]);

  const handleResetFilters = useCallback(() => {
    setSearchParams((prev) => {
      prev.delete("status");
      prev.delete("date_from");
      prev.delete("date_to");
      return prev;
    });
  }, [setSearchParams]);

  const handleRefreshAll = useCallback(() => {
    refetchList();
    refetchSummary();
    refetchTrends();
    refetchCalendar();
  }, [refetchList, refetchSummary, refetchTrends, refetchCalendar]);

  // ✅ FIXED: Safely unpack standard array variants or paginated envelope arrays (.results)
  const normalizedRecords = useMemo(() => {
    if (!listData) return [];
    if (Array.isArray(listData)) return listData;
    if (Array.isArray(listData.data)) return listData.data;
    if (listData.results && Array.isArray(listData.results)) return listData.results;
    if (listData.data?.results && Array.isArray(listData.data.results)) return listData.data.results;
    return [];
  }, [listData]);

  return {
    currentYear,
    currentMonth,
    statusFilter,
    dateFrom,
    dateTo,
    listData: normalizedRecords, // ✅ Returns the flattened, mapped array cleanly to the UI table
    summaryData: summaryData?.data || null,
    trendData: trendData?.data || null,
    calendarData: calendarData?.data || [],
    isLoading: isListLoading || isSummaryLoading || isTrendLoading || isCalendarLoading,
    isError: isListError || isSummaryError || isTrendError || isCalendarError,
    activeDrawerId,
    isFiltersOpen,
    setIsFiltersOpen,
    setActiveDrawerId,
    handleMonthChange,
    handleApplyFilters,
    handleResetFilters,
    handleRefreshAll,
  };
}