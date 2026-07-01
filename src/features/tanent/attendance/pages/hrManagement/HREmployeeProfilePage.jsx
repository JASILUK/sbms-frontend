import React, { useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import PageContainer from "../../components/hrManagement/shared/PageContainer";
import PermissionWrapper from "../../components/hrManagement/shared/PermissionWrapper";
import SkeletonLoader from "../../components/hrManagement/shared/SkeletonLoader";
import { useProfileQueryFilters } from "../../hooks/hrAttendance/useProfileQueryFilters";
import { useGetEmployeeAttendanceProfileDetailQuery } from "../../api/hrAttendance/employeeProfileApi";
import { serializeFilters } from "../../utils/hrAttendance";

import EmployeeProfileHeader from "../../components/hrManagement/employeeProfile/EmployeeProfileHeader";
import EmployeeIdentityCard from "../../components/hrManagement/employeeProfile/EmployeeIdentityCard";
import AttendanceSummaryCards from "../../components/hrManagement/employeeProfile/AttendanceSummaryCards";
import AttendanceCalendar from "../../components/hrManagement/employeeProfile/AttendanceCalendar";
import AttendanceRecordsTable from "../../components/hrManagement/employeeProfile/AttendanceRecordsTable";

/**
 * HREmployeeProfilePage - Acts as the primary personal auditing workspace panel for a single user.
 * Manages parametric date ranges and server-side limit-offset pagination configurations.
 */
export default function HREmployeeProfilePage() {
  const { membership_id } = useParams();
  const { filters, updateFilters } = useProfileQueryFilters();

  const serializedQueryParams = useMemo(() => {
    return serializeFilters({
      ...filters,
      membershipId: membership_id,
    });
  }, [filters, membership_id]);

  // Combined single query data transfer profile execution boundary check
  const {
    data: profileResponse,
    isLoading: isProfileLoading,
    isFetching: isProfileFetching,
    refetch: refetchProfileDetail,
    isError: isProfileError,
  } = useGetEmployeeAttendanceProfileDetailQuery(serializedQueryParams, { skip: !membership_id });

  const handleRefreshAll = useCallback(() => {
    refetchProfileDetail();
  }, [refetchProfileDetail]);

  const handlePageChange = useCallback((newOffset) => {
    updateFilters({ offset: newOffset });
  }, [updateFilters]);

  if (isProfileError) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center min-h-[400px] border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center" role="alert">
          <p className="text-sm font-medium text-rose-600 dark:text-rose-400">Failed to load the single employee analytics graph data lines.</p>
          <button type="button" onClick={handleRefreshAll} className="mt-4 px-4 py-2 text-xs font-medium text-white bg-indigo-600 rounded-xl transition-colors">
            Retry Synchronize
          </button>
        </div>
      </PageContainer>
    );
  }

  // Safely extract properties out of your custom backend standard ApiResponse data envelope
  const profileGraph = profileResponse?.data || profileResponse;
  
  const recordsList = profileGraph?.records?.results || profileGraph?.records || [];
  const totalRecordsCount = profileGraph?.records?.pagination?.count || profileGraph?.records?.meta?.pagination?.count || 0;

  return (
    <PermissionWrapper requiredPermission="canViewProfile">
      <PageContainer>
        <EmployeeProfileHeader 
          employeeMeta={profileGraph?.employee}
          filters={filters}
          onFilterChange={updateFilters}
          onRefresh={handleRefreshAll}
          isFetching={isProfileFetching}
        />

        {isProfileLoading ? (
          <div className="space-y-6">
            <SkeletonLoader variant="card" count={4} />
            <SkeletonLoader variant="table" count={4} />
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in w-full">
            <EmployeeIdentityCard employee={profileGraph?.employee} />
            
            <AttendanceSummaryCards summary={profileGraph?.summary} />
            
            <AttendanceCalendar calendarData={profileGraph?.calendar || profileGraph?.charts} />
            
            <AttendanceRecordsTable records={recordsList} />

            {/* Server-Side Sliced Pagination Controller Links */}
            {totalRecordsCount > filters.limit && (
              <div className="flex justify-end pt-2 w-full">
                <nav className="inline-flex gap-1" aria-label="History profile tables pagination navigation">
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
                    disabled={filters.offset + filters.limit >= totalRecordsCount}
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
      </PageContainer>
    </PermissionWrapper>
  );
}