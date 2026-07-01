import React, { useState, useMemo, useCallback, useEffect } from "react";
import PageContainer from "../../components/hrManagement/shared/PageContainer";
import PermissionWrapper from "../../components/hrManagement/shared/PermissionWrapper";
import SkeletonLoader from "../../components/hrManagement/shared/SkeletonLoader";
import { useDirectoryQueryFilters } from "../../hooks/hrAttendance/useDirectoryQueryFilters";
import { useGetHRDashboardSummaryQuery } from "../../api/hrAttendance/dashboardApi";
import { useGetEmployeeAttendanceDirectoryQuery } from "../../api/hrAttendance/employeeDirectoryApi";
import { serializeFilters } from "../../utils/hrAttendance";

import DirectoryHeader from "../../components/hrManagement/employeeDirectory/DirectoryHeader";
import StatisticsStrip from "../../components/hrManagement/employeeDirectory/StatisticsStrip";
import DirectoryToolbar from "../../components/hrManagement/employeeDirectory/DirectoryToolbar";
import EmployeeAttendanceTable from "../../components/hrManagement/employeeDirectory/EmployeeAttendanceTable";
import BulkActionsToolbar from "../../components/hrManagement/employeeDirectory/BulkActionsToolbar";

/**
 * HREmployeeDirectoryPage - Manages filter states, search parameters, row selections,
 * and server-side pagination for the enterprise employee attendance directory.
 */
export default function HREmployeeDirectoryPage() {
  const { filters, updateFilters, clearFilters } = useDirectoryQueryFilters();
  const [searchInputValue, setSearchInputValue] = useState(filters.search);
  const [selectedRowIds, setSelectedRowIds] = useState(new Set());

  // Debounce the local query search input string
  useEffect(() => {
    const timer = setTimeout(() => {
      updateFilters({ search: searchInputValue });
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInputValue, updateFilters]);

  // Clean and serialize query parameters for API calls
  const serializedQueryParams = useMemo(() => serializeFilters(filters), [filters]);

  // Query 1: Fetch total aggregate counts for the Statistics Strip
  const { 
    data: summaryRes, 
    isFetching: isSummaryFetching, 
    refetch: refetchSummary 
  } = useGetHRDashboardSummaryQuery({ date: filters.date });

  // Query 2: Fetch the primary data grid records list
  const {
    data: directoryRes,
    isLoading: isDirectoryLoading,
    isFetching: isDirectoryFetching,
    refetch: refetchDirectory
  } = useGetEmployeeAttendanceDirectoryQuery(serializedQueryParams);

  const handleRefreshAll = useCallback(() => {
    refetchSummary();
    refetchDirectory();
  }, [refetchSummary, refetchDirectory]);

  const handleToggleRowSelection = useCallback((id) => {
    setSelectedRowIds((prev) => {
      const nextSet = new Set(prev);
      if (nextSet.has(id)) {
        nextSet.delete(id);
      } else {
        nextSet.add(id);
      }
      return nextSet;
    });
  }, []);

  const handleClearSelection = useCallback(() => setSelectedRowIds(new Set()), []);

  const handlePageChange = useCallback((newOffset) => {
    updateFilters({ offset: newOffset });
  }, [updateFilters]);

  const directoryRows = directoryRes?.data?.results || directoryRes?.results || [];
  const totalCount = directoryRes?.data?.pagination?.count || directoryRes?.meta?.pagination?.count || 0;

  return (
    <PermissionWrapper requiredPermission="canViewDirectory">
      <PageContainer>
        <DirectoryHeader 
          selectedDate={filters.date}
          totalCount={totalCount}
          onRefresh={handleRefreshAll}
          isFetching={isSummaryFetching || isDirectoryFetching}
        />

        <StatisticsStrip 
          summaryStats={summaryRes?.data?.statistics || summaryRes?.data}
          currentActiveStatus={filters.attendance_status || filters.current_state}
          onStatusSelect={(statusVal) => updateFilters({ 
            attendance_status: ["PRESENT", "ABSENT", "REVIEW_REQUIRED"].includes(statusVal) ? statusVal : "",
            current_state: statusVal === "LATE" ? "" : (!["PRESENT", "ABSENT", "REVIEW_REQUIRED"].includes(statusVal) ? statusVal : "")
          })}
        />

        <DirectoryToolbar 
          filters={filters}
          searchInputValue={searchInputValue}
          onSearchValueChange={setSearchInputValue}
          onFilterChange={updateFilters}
          onClear={clearFilters}
        />

        {isDirectoryLoading ? (
          <SkeletonLoader variant="table" count={5} />
        ) : (
          <div className="space-y-4 animate-fade-in">
            <EmployeeAttendanceTable 
              rows={directoryRows}
              selectedRowIds={selectedRowIds}
              onToggleRow={handleToggleRowSelection}
            />

            {/* Integrate global server-side pagination controllers */}
            {totalCount > filters.limit && (
              <div className="flex justify-end pt-2">
                <nav className="inline-flex gap-1" aria-label="Table pagination navigation">
                  <button
                    type="button"
                    disabled={filters.offset === 0}
                    onClick={() => handlePageChange(Math.max(0, filters.offset - filters.limit))}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold disabled:opacity-40 transition-colors bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    disabled={filters.offset + filters.limit >= totalCount}
                    onClick={() => handlePageChange(filters.offset + filters.limit)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold disabled:opacity-40 transition-colors bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </div>
        )}

        <BulkActionsToolbar 
          selectedCount={selectedRowIds.size}
          onClearSelection={handleClearSelection}
        />
      </PageContainer>
    </PermissionWrapper>
  );
}