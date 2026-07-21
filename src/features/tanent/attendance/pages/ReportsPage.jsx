import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { useGetAttendanceReportQuery } from "../api/hrAttendance/attendanceReportApi";
import { useAttendanceReportExport } from "../hooks/hr_attendance_management/useAttendanceReportExport";

import { AttendanceReportHeader } from "../components/hrManagement/report/AttendanceReportHeader";
import { AttendanceFilterToolbar } from "../components/hrManagement/report/AttendanceFilterToolbar";
import { AttendanceSummaryCards } from "../components/hrManagement/report/AttendanceSummaryCards";
import { AttendanceReportTable } from "../components/hrManagement/report/AttendanceReportTable";
import { AttendancePagination } from "../components/hrManagement/report/AttendancePagination";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

function parseFiltersFromURL(searchParams) {
  return {
    month: searchParams.get("month") || "",
    year: searchParams.get("year") || "",
    date_from: searchParams.get("date_from") || "",
    date_to: searchParams.get("date_to") || "",
    department_id: searchParams.get("department_id") || "",
    membership_id: searchParams.get("membership_id") || "",
    attendance_status: searchParams.get("attendance_status") || "",
    search: searchParams.get("search") || "",
    ordering: searchParams.get("ordering") || "user__first_name",
    limit: Number(searchParams.get("limit")) || 25,
    offset: Number(searchParams.get("offset")) || 0,
  };
}

function buildApiParams(filters) {
  const params = {};
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== "" && value !== null && value !== undefined) {
      params[key] = value;
    }
  });
  return params;
}

function parseOrdering(ordering) {
  if (ordering.startsWith("-")) {
    return { field: ordering.slice(1), direction: "desc" };
  }
  return { field: ordering, direction: "asc" };
}

export default function ReportsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState(() =>
    parseFiltersFromURL(searchParams)
  );
  const [filtersApplied, setFiltersApplied] = useState(true);

  const apiParams = useMemo(() => buildApiParams(filters), [filters]);

  const {
    data: reportData,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetAttendanceReportQuery(apiParams, {
    skip: !filtersApplied,
    refetchOnMountOrArgChange: true,
  });

  const { exportReport, isExporting } = useAttendanceReportExport();

  useEffect(() => {
    if (filtersApplied) {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
          params.set(key, String(value));
        }
      });
      setSearchParams(params, { replace: true });
    }
  }, [filtersApplied, filters, setSearchParams]);

  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setFiltersApplied(false);
  }, []);

  const handleApplyFilters = useCallback(() => {
    setFiltersApplied(true);
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters({
      month: "",
      year: "",
      date_from: "",
      date_to: "",
      department_id: "",
      membership_id: "",
      attendance_status: "",
      search: "",
      ordering: "user__first_name",
      limit: 25,
      offset: 0,
    });
    setFiltersApplied(true);
  }, []);

  const handleSort = useCallback(
    (field) => {
      const currentOrdering = filters.ordering;
      const isDescending = currentOrdering === field;
      const newOrdering = isDescending ? `-${field}` : field;

      setFilters((prev) => ({
        ...prev,
        ordering: newOrdering,
        offset: 0,
      }));
      setFiltersApplied(true);
    },
    [filters.ordering]
  );

  const { field: sortField, direction: sortDirection } = parseOrdering(
    filters.ordering
  );

  const handlePageChange = useCallback(
    (page) => {
      const newOffset = (page - 1) * filters.limit;
      setFilters((prev) => ({ ...prev, offset: newOffset }));
      setFiltersApplied(true);
    },
    [filters.limit]
  );

  const handleLimitChange = useCallback((limit) => {
    setFilters((prev) => ({ ...prev, limit, offset: 0 }));
    setFiltersApplied(true);
  }, []);

  const handleExport = useCallback(
    (format) => {
      const exportParams = { ...apiParams, export_format: format };
      exportReport(exportParams);
    },
    [apiParams, exportReport]
  );

  const reportPayload = reportData?.data || reportData;
  const results = reportPayload?.results || [];
  const summary = reportPayload?.summary || null;
  const pagination = reportPayload?.pagination || null;

  return (
    <div className="w-full min-w-0">
      <div className="max-w-[88rem] mx-auto">
        <AttendanceReportHeader
          onExport={handleExport}
          isExporting={isExporting}
        />

        <AttendanceFilterToolbar
          filters={filters}
          onChange={handleFilterChange}
          onApply={handleApplyFilters}
          onReset={handleResetFilters}
          isLoading={isLoading || isFetching}
        />

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="mb-6"
            >
              <div className="rounded-xl border border-red-200/80 bg-red-50/80 p-6 sm:p-8 text-center">
                <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-500" aria-hidden="true" />
                </div>
                <h3 className="text-base font-semibold text-red-800">
                  Failed to load report
                </h3>
                <p className="text-sm text-red-600/80 mt-2 max-w-md mx-auto leading-relaxed">
                  {error?.data?.message ||
                    "An unexpected error occurred while fetching the report. Please try again."}
                </p>
                <motion.button
                  type="button"
                  onClick={refetch}
                  whileTap={{ scale: 0.97 }}
                  className={cn(
                    "mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg",
                    "text-sm font-semibold text-white bg-red-600",
                    "hover:bg-red-700",
                    "focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:ring-offset-2",
                    "shadow-sm shadow-red-900/10",
                    "transition-colors duration-200"
                  )}
                >
                  <RefreshCw className="w-4 h-4" aria-hidden="true" />
                  Retry
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!error && (
          <AttendanceSummaryCards
            summary={summary}
            isLoading={isLoading || isFetching}
          />
        )}

        {!error && (
          <AttendanceReportTable
            data={results}
            isLoading={isLoading || isFetching}
            onSort={handleSort}
            sortField={sortField}
            sortDirection={sortDirection}
            onReset={handleResetFilters}
          />
        )}

        {!error && pagination && (
          <AttendancePagination
            pagination={pagination}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
            isLoading={isLoading || isFetching}
          />
        )}
      </div>
    </div>
  );
}