import { useState, useCallback, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  useGetMyAttendanceQuery,
  useGetMyAttendanceSummaryQuery,
  useGetMyAttendanceTrendsQuery,
  useGetMyAttendanceCalendarQuery,
} from "../api/attendanceApi";

const WEEKLY_LIMIT = 12;

export function useMyAttendance() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeDrawerId, setActiveDrawerId] = useState(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [weeklyOffset, setWeeklyOffset] = useState(0);

  // ── Requirements Check: Distinguish state vs values explicitly present in URL ──
  const currentYear = useMemo(() => parseInt(searchParams.get("year") || "2026", 10), [searchParams]);
  const currentMonth = useMemo(() => parseInt(searchParams.get("month") || "6", 10), [searchParams]);
  const statusFilter = useMemo(() => searchParams.get("status") || "", [searchParams]);
  const dateFrom = useMemo(() => searchParams.get("date_from") || "", [searchParams]);
  const dateTo = useMemo(() => searchParams.get("date_to") || "", [searchParams]);

  // Check if we are currently operating in custom date mode
  const hasCustomDates = useMemo(() => !!(dateFrom || dateTo), [dateFrom, dateTo]);

  // ── Params for records API (Build parameters conditionally) ──
  const listParams = useMemo(() => {
    if (hasCustomDates) {
      return {
        ...(dateFrom && { date_from: dateFrom }),
        ...(dateTo && { date_to: dateTo }),
        ...(statusFilter && { status: statusFilter }),
      };
    }
    return {
      month: currentMonth,
      year: currentYear,
      ...(statusFilter && { status: statusFilter }),
    };
  }, [hasCustomDates, currentMonth, currentYear, statusFilter, dateFrom, dateTo]);

  // ── Params for summary API (Build parameters conditionally, NO status filter) ──
  const summaryParams = useMemo(() => {
    if (hasCustomDates) {
      return {
        ...(dateFrom && { date_from: dateFrom }),
        ...(dateTo && { date_to: dateTo }),
      };
    }
    return {
      month: currentMonth,
      year: currentYear,
    };
  }, [hasCustomDates, currentMonth, currentYear, dateFrom, dateTo]);

  // ── Queries ──
  const { 
    data: listData, 
    isLoading: isListLoading, 
    isError: isListError, 
    refetch: refetchList 
  } = useGetMyAttendanceQuery(listParams);

  const { 
    data: summaryData, 
    isLoading: isSummaryLoading, 
    isError: isSummaryError, 
    refetch: refetchSummary 
  } = useGetMyAttendanceSummaryQuery(summaryParams, {
    refetchOnMountOrArgChange: true,
  });

  const { 
    data: trendData, 
    isLoading: isTrendLoading, 
    isError: isTrendError, 
    refetch: refetchTrends 
  } = useGetMyAttendanceTrendsQuery({ 
    year: currentYear, 
    limit: WEEKLY_LIMIT, 
    offset: weeklyOffset 
  });

  const { 
    data: calendarData, 
    isLoading: isCalendarLoading, 
    isError: isCalendarError, 
    refetch: refetchCalendar 
  } = useGetMyAttendanceCalendarQuery({ 
    year: currentYear, 
    month: currentMonth 
  });

  // Force refetch summary when date filters change
  useEffect(() => {
    if (dateFrom || dateTo) {
      refetchSummary();
    }
  }, [dateFrom, dateTo, refetchSummary]);

  // ── Handlers ──
  const handleMonthChange = useCallback((month, year) => {
    setSearchParams((prev) => {
      prev.set("month", month.toString());
      prev.set("year", year.toString());
      prev.delete("date_from");
      prev.delete("date_to");
      return prev;
    });
    setWeeklyOffset(0);
  }, [setSearchParams]);

  const handleYearChange = useCallback((year) => {
    setSearchParams((prev) => {
      prev.set("year", year.toString());
      prev.delete("date_from");
      prev.delete("date_to");
      return prev;
    });
    setWeeklyOffset(0);
  }, [setSearchParams]);

  const handleWeeklyNext = useCallback(() => {
    if (trendData?.data?.next) {
      setWeeklyOffset((prev) => prev + WEEKLY_LIMIT);
    }
  }, [trendData]);

  const handleWeeklyPrev = useCallback(() => {
    if (trendData?.data?.previous && weeklyOffset >= WEEKLY_LIMIT) {
      setWeeklyOffset((prev) => Math.max(0, prev - WEEKLY_LIMIT));
    }
  }, [trendData, weeklyOffset]);

  // ── FIXED: Apply filters with strict custom range vs monthly isolation ──
  const handleApplyFilters = useCallback((filters) => {
    setSearchParams((prev) => {
      if (filters.date_from || filters.date_to) {
        // Custom Date Range applied: completely strip monthly trackers from URL
        prev.delete("month");
        prev.delete("year");
      } else {
        // Clearing or omitting custom dates: safely fall back or stay on monthly tracker mode
        prev.set("month", currentMonth.toString());
        prev.set("year", currentYear.toString());
      }

      if (filters.status) prev.set("status", filters.status);
      else prev.delete("status");

      if (filters.date_from) prev.set("date_from", filters.date_from);
      else prev.delete("date_from");

      if (filters.date_to) prev.set("date_to", filters.date_to);
      else prev.delete("date_to");

      return prev;
    });
  }, [setSearchParams, currentMonth, currentYear]);

  // ── FIXED: Reset filters clears custom range attributes and mandates monthly track configuration ──
  const handleResetFilters = useCallback(() => {
    setSearchParams((prev) => {
      prev.delete("status");
      prev.delete("date_from");
      prev.delete("date_to");

      // Mandate monthly defaults upon absolute filter clearings
      prev.set("month", "6");
      prev.set("year", "2026");

      return prev;
    });
  }, [setSearchParams]);

  const handleRefreshAll = useCallback(() => {
    refetchList();
    refetchSummary();
    refetchTrends();
    refetchCalendar();
  }, [refetchList, refetchSummary, refetchTrends, refetchCalendar]);

  // ── Normalized data ──
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
    weeklyOffset,
    listData: normalizedRecords,
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
    handleYearChange,
    handleWeeklyNext,
    handleWeeklyPrev,
    handleApplyFilters,
    handleResetFilters,
    handleRefreshAll,
  };
}