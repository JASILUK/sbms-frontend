import React, { useMemo, useCallback, Suspense } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw } from "lucide-react";

import PageContainer from "../../components/hrManagement/shared/PageContainer";
import PermissionWrapper from "../../components/hrManagement/shared/PermissionWrapper";
import { useProfileQueryFilters } from "../../hooks/hrAttendance/useProfileQueryFilters";
import { useGetEmployeeAttendanceProfileDetailQuery } from "../../api/hrAttendance/employeeProfileApi";
import { serializeFilters } from "../../utils/hrAttendance";
import { HR_ROUTES } from "../../constants/hrAttendance";

import EmployeeProfileHeader from "../../components/hrManagement/employeeProfile/EmployeeProfileHeader";
import AttendanceSummaryGrid from "../../components/hrManagement/employeeProfile/AttendanceSummaryGrid";
import AttendanceChartsSection from "../../components/hrManagement/employeeProfile/AttendanceChartsSection";
import AttendanceRecordsSection from "../../components/hrManagement/employeeProfile/AttendanceRecordsSection";
import ProfileLoadingSkeleton from "../../components/hrManagement/employeeProfile/ProfileLoadingSkeleton";
import ProfileErrorState from "../../components/hrManagement/employeeProfile/ProfileErrorState";
import EmptyAttendanceState from "../../components/hrManagement/employeeProfile/EmptyAttendanceState";

/**
 * HREmployeeProfilePage — Premium Enterprise HR Attendance Workspace
 *
 * Architecture:
 *   Page → Header → Summary Grid → Charts Section → Records Section
 *
 * Navigation: Dashboard → Live Workforce → Employee Profile → Record Detail
 */
export default function HREmployeeProfilePage() {
  const { membership_id } = useParams();
  const navigate = useNavigate();
  const { filters, updateFilters, resetFilters } = useProfileQueryFilters();

  const serializedQueryParams = useMemo(() => {
    return serializeFilters({
      ...filters,
      membershipId: membership_id,
    });
  }, [filters, membership_id]);

  const {
    data: profileResponse,
    isLoading,
    isFetching,
    refetch,
    isError,
  } = useGetEmployeeAttendanceProfileDetailQuery(serializedQueryParams, {
    skip: !membership_id,
    refetchOnMountOrArgChange: true,
  });

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handlePageChange = useCallback(
    (newOffset) => {
      updateFilters({ offset: newOffset });
    },
    [updateFilters]
  );

  const handleNavigateBack = useCallback(() => {
    navigate(HR_ROUTES.DASHBOARD);
  }, [navigate]);

  const handleRecordClick = useCallback(
    (recordId) => {
      navigate(`/app/attendance/hr/records/${recordId}`);
    },
    [navigate]
  );

  // Extract data from ApiResponse envelope
  const profileData = profileResponse?.data || profileResponse;
  const employee = profileData?.employee;
  const summary = profileData?.summary;
  const charts = profileData?.charts;
  const records = profileData?.records?.results || [];
  const pagination = profileData?.records?.pagination || {};
  const metadata = profileData?.metadata;

  const totalRecords = pagination.count || 0;
  const hasRecords = records.length > 0;
  const hasCalendarDays = summary?.calendar_days > 0;

  return (
    <PermissionWrapper requiredPermission="canViewProfile">
      <PageContainer className="bg-slate-50 min-h-screen">
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleNavigateBack}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            aria-label="Back to dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>

          <button
            onClick={handleRefresh}
            disabled={isFetching}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-all disabled:opacity-50"
            aria-label="Refresh profile data"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
            {isFetching ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {isError ? (
          <ProfileErrorState onRetry={handleRefresh} />
        ) : isLoading ? (
          <ProfileLoadingSkeleton />
        ) : (
          <div className="space-y-6 pb-12">
            {/* Employee Hero Header */}
            <EmployeeProfileHeader
              employee={employee}
              metadata={metadata}
              filters={filters}
              onFilterChange={updateFilters}
              onResetFilters={resetFilters}
            />

            {/* Summary KPI Cards */}
            {summary && <AttendanceSummaryGrid summary={summary} />}

            {/* Charts Section */}
            {charts && hasCalendarDays && (
              <AttendanceChartsSection charts={charts} />
            )}

            {/* Attendance Records */}
            {hasRecords ? (
              <AttendanceRecordsSection
                records={records}
                filters={filters}
                onFilterChange={updateFilters}
                onRecordClick={handleRecordClick}
                pagination={{
                  count: totalRecords,
                  offset: filters.offset,
                  limit: filters.limit,
                  onPageChange: handlePageChange,
                }}
              />
            ) : (
              <EmptyAttendanceState
                dateRange={metadata}
                onClearFilters={resetFilters}
              />
            )}
          </div>
        )}
      </PageContainer>
    </PermissionWrapper>
  );
}