// # attendance/pages/hrManagement/HRDashboardPage.jsx (COMPLETE REPLACEMENT)

import React, { useMemo, useCallback } from 'react';
import PageContainer from '../../components/hrManagement/shared/PageContainer';
import PermissionWrapper from '../../components/hrManagement/shared/PermissionWrapper';
import { useAttendancePermissions } from '../../hooks/hrAttendance/useAttendancePermissions';
import { useGetHRDashboardSummaryQuery } from '../../api/hrAttendance/dashboardApi';
import { useGetLiveWorkforceQuery } from '../../api/hrAttendance/liveWorkforceApi';
import { useLiveWorkforceFilters } from '../../hooks/hrAttendance/useLiveWorkforceFilters';

// Components
import DashboardSkeleton from '../../components/hrManagement/dashboard/DashboardSkeleton';
import { DashboardHeader } from '../../components/hrManagement/dashboard/DashboardHeader';
import { DashboardSummaryCards } from '../../components/hrManagement/dashboard/DashboardSummaryCards';
import { WorkforceDoughnutChart } from '../../components/hrManagement/dashboard/WorkforceDoughnutChart';
import { ShiftDistributionCards } from '../../components/hrManagement/dashboard/ShiftDistributionCards';
import { DepartmentPerformanceTable } from '../../components/hrManagement/dashboard/DepartmentPerformanceTable';
import { LiveWorkforceTable } from '../../components/hrManagement/dashboard/LiveWorkforceTable';
import { LiveWorkforceToolbar } from '../../components/hrManagement/dashboard/LiveWorkforceToolbar';
import { ActivityTimeline } from '../../components/hrManagement/dashboard/ActivityTimeline';
import { QuickActions } from '../../components/hrManagement/dashboard/QuickActions';
import { DashboardCardsSkeleton } from '../../components/hrManagement/dashboard/DashboardCardsSkeleton';
import { DashboardChartsSkeleton } from '../../components/hrManagement/dashboard/DashboardChartsSkeleton';
import { ShiftDistributionChart } from '../../components/hrManagement/dashboard/ShiftDistributionChart';

/**
 * HRDashboardPage - Premium operational dashboard.
 * Integrates Dashboard Summary API + Live Workforce API.
 */
export default function HRDashboardPage() {
  const perms = useAttendancePermissions();

  // ── Dashboard Summary Query ─────────────────────────────────────────
  const targetDateStr = useMemo(() => {
    return new Date().toISOString().split('T')[0];
  }, []);

  const dashboardParams = useMemo(() => ({ date: targetDateStr }), [targetDateStr]);

  const {
    data: dashboardResponse,
    isLoading: dashboardLoading,
    isFetching: dashboardFetching,
    refetch: refetchDashboard,
    isError: dashboardError,
  } = useGetHRDashboardSummaryQuery(dashboardParams, { skip: !perms.canViewDashboard });

  const dashboardData = dashboardResponse?.data || dashboardResponse;

  // ── Live Workforce Filters & Query ────────────────────────────────────
  const {
    filters,
    searchVal,
    updateFilter,
    setStatusFilter,
    setNeedsReview,
    clearFilters,
    handleSearchChange,
    setPage,
    setOrdering,
  } = useLiveWorkforceFilters({ date: targetDateStr });

  const {
    data: workforceResponse,
    isLoading: workforceLoading,
    isFetching: workforceFetching,
    refetch: refetchWorkforce,
    isError: workforceError,
  } = useGetLiveWorkforceQuery(filters, { skip: !perms.canViewDashboard });

  const workforceData = workforceResponse?.data || workforceResponse;
  const workforceRows = workforceData?.results || [];
  const workforceSummary = workforceData?.summary || {};
  const workforceMeta = workforceData?.filter_metadata || {};
  const workforcePagination = workforceData?.pagination || {};

  // ── Card Click Handler ───────────────────────────────────────────────
  const handleCardClick = useCallback((statusKey) => {
    if (statusKey === 'REVIEW_REQUIRED') {
      setNeedsReview('true');
    } else {
      setStatusFilter(statusKey);
    }
  }, [setStatusFilter, setNeedsReview]);

  // ── Shift Card Click Handler ───────────────────────────────────────
  const handleShiftClick = useCallback((shiftId) => {
    updateFilter('shift', filters.shift === String(shiftId) ? '' : String(shiftId));
  }, [updateFilter, filters.shift]);

  // ── Refresh All ─────────────────────────────────────────────────────
  const handleRefreshAll = useCallback(() => {
    refetchDashboard();
    refetchWorkforce();
  }, [refetchDashboard, refetchWorkforce]);

  return (
    <PermissionWrapper requiredPermission="canViewDashboard">
      <PageContainer>
        <div className="space-y-6 w-full max-w-7xl mx-auto pb-12 animate-fade-in">

          <DashboardHeader
            metadata={dashboardData?.metadata}
            onRefresh={handleRefreshAll}
            isFetching={dashboardFetching || workforceFetching}
          />

          {/* ── Summary KPI Cards ───────────────────────────────────── */}
          {dashboardLoading ? (
            <DashboardCardsSkeleton />
          ) : dashboardError ? (
            <div className="bg-white border border-dashed border-rose-200 rounded-2xl p-8 text-center">
              <p className="text-sm font-bold text-rose-600 mb-4">Dashboard data unavailable.</p>
              <button
                type="button"
                onClick={refetchDashboard}
                className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors"
              >
                Retry
              </button>
            </div>
          ) : (
            <DashboardSummaryCards
              summary={dashboardData?.summary}
              onCardClick={handleCardClick}
              activeStatus={filters.status}
              activeNeedsReview={filters.needs_review}
            />
          )}

          {/* ── Charts Row ────────────────────────────────────────────── */}
          {dashboardLoading ? (
            <DashboardChartsSkeleton />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <WorkforceDoughnutChart
                summary={workforceSummary}
              />
              <ShiftDistributionChart
                shifts={dashboardData?.shift_distribution}
                activeShift={filters.shift ? parseInt(filters.shift, 10) : null}
                onShiftClick={handleShiftClick}
              />
            </div>
          )}

          {/* ── Department Performance ────────────────────────────────── */}
          <DepartmentPerformanceTable
            departments={dashboardData?.departments}
          />

          {/* ── Live Workforce Section ──────────────────────────────── */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Live Workforce</h2>
              <span className="text-xs font-medium text-slate-500">
                {workforceFetching && !workforceLoading ? 'Refreshing...' : ''}
              </span>
            </div>

            <LiveWorkforceToolbar
              filters={filters}
              searchVal={searchVal}
              filterMetadata={workforceMeta}
              onSearchChange={handleSearchChange}
              onFilterChange={updateFilter}
              onClear={clearFilters}
              isLoading={workforceLoading}
            />

            <LiveWorkforceTable
              employees={workforceRows}
              isLoading={workforceLoading}
              isError={workforceError}
              onRetry={refetchWorkforce}
              pagination={workforcePagination}
              onPageChange={setPage}
              filters={filters}
              onOrderingChange={setOrdering}
            />
          </div>

          {/* ── Activity + Quick Actions ────────────────────────────── */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
            <div className="xl:col-span-2">
              <ActivityTimeline activities={dashboardData?.activity_feed} />
            </div>
            <div>
              <QuickActions />
            </div>
          </div>

        </div>
      </PageContainer>
    </PermissionWrapper>
  );
}