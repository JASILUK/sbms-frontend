// attendance/pages/hrManagement/HRDashboardPage.jsx
import React, { useMemo } from 'react';
import PageContainer from '../../components/hrManagement/shared/PageContainer';
import PermissionWrapper from '../../components/hrManagement/shared/PermissionWrapper';
import SkeletonLoader from '../../components/hrManagement/shared/SkeletonLoader';
import { useAttendanceFilters } from '../../hooks/hrAttendance/useAttendanceFilters';
import { useAttendancePermissions } from '../../hooks/hrAttendance/useAttendancePermissions';
import {
  useGetHRDashboardSummaryQuery,
  useGetHRLiveAttendanceStreamQuery
} from '../../api/hrAttendance/dashboardApi';

import DashboardHeader from '../../components/hrManagement/dashboard/DashboardHeader';
import DashboardToolbar from '../../components/hrManagement/dashboard/DashboardToolbar';
import SummaryGrid from '../../components/hrManagement/dashboard/SummaryGrid';
import DepartmentSection from '../../components/hrManagement/dashboard/DepartmentSection';
import LiveStatusGrid from '../../components/hrManagement/dashboard/LiveStatusGrid';
import ActivityTimeline from '../../components/hrManagement/dashboard/ActivityTimeline';
import AlertPanel from '../../components/hrManagement/dashboard/AlertPanel';
import QuickActions from '../../components/hrManagement/dashboard/QuickActions';

export default function HRDashboardPage() {
  const perms = useAttendancePermissions();
  const { filters, searchVal, updateFilter, clearFilters, handleSearchChange } = useAttendanceFilters();

  const todayStr = useMemo(() => filters.date_from || new Date().toISOString().split('T')[0], [filters.date_from]);

  const queryParams = useMemo(() => ({
    date: todayStr,
    date_from: todayStr, // Aligned for ledger parameter expectations[cite: 1, 2]
    date_to: todayStr,
    department_id: filters.department || undefined,
    search: filters.search || undefined
  }), [todayStr, filters.department, filters.search]);

  // Query 1: Dashboard metrics and counters[cite: 1, 2]
  const {
    data: summaryRes,
    isLoading: isSummaryLoading,
    isFetching: isSummaryFetching,
    refetch: refetchSummary,
    isError: isSummaryError
  } = useGetHRDashboardSummaryQuery(queryParams, { skip: !perms.canViewDashboard });

  // Query 2: Reuses the ledger dataset for real-time overview metrics[cite: 1, 2]
  const {
    data: liveLedgerRes,
    isLoading: isLiveLoading,
    refetch: refetchLive
  } = useGetHRLiveAttendanceStreamQuery(queryParams, { skip: !perms.canViewDashboard });

  const handleRefreshAll = React.useCallback(() => {
    refetchSummary();
    refetchLive();
  }, [refetchSummary, refetchLive]);

  // Client-side computation filter to extract only employees currently clocked in[cite: 1, 2]
  const liveWorkingWorkforce = useMemo(() => {
    const records = liveLedgerRes?.data?.results || liveLedgerRes?.results || [];
    return records.filter(record => record.clock_in && !record.clock_out); // Checked in but has not checked out[cite: 1, 2]
  }, [liveLedgerRes]);

  const isInitialLayoutLoading = isSummaryLoading || isLiveLoading;

  if (isSummaryError) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center min-h-[400px] border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center" role="alert">
          <p className="text-sm font-medium text-rose-600 dark:text-rose-400">Failed to load the operational data dashboard.</p>
          <button type="button" onClick={handleRefreshAll} className="mt-4 px-4 py-2 text-xs font-medium text-white bg-indigo-600 rounded-xl">
            Retry Synchronization
          </button>
        </div>
      </PageContainer>
    );
  }

  const dashboardData = summaryRes?.data || summaryRes;

  return (
    <PermissionWrapper requiredPermission="canViewDashboard">
      <PageContainer>
        <DashboardHeader 
          onRefresh={handleRefreshAll} 
          isFetching={isSummaryFetching} 
          lastUpdated={dashboardData?.summary_date}
        />
        
        <DashboardToolbar 
          filters={filters}
          searchVal={searchVal}
          onFilterChange={updateFilter}
          onSearchChange={handleSearchChange}
          onClear={clearFilters}
        />

        {isInitialLayoutLoading ? (
          <div className="space-y-6">
            <SkeletonLoader variant="card" count={4} />
            <SkeletonLoader variant="table" count={3} />
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            <SummaryGrid metrics={dashboardData?.statistics} />
            
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
              <div className="xl:col-span-2 space-y-6">
                <DepartmentSection departments={dashboardData?.department_breakdown || []} />
                <LiveStatusGrid workforce={liveWorkingWorkforce} />
              </div>
              <div className="space-y-6">
                <AlertPanel alerts={dashboardData?.alerts || []} />
                <ActivityTimeline activities={dashboardData?.recent_activity || []} />
                <QuickActions />
              </div>
            </div>
          </div>
        )}
      </PageContainer>
    </PermissionWrapper>
  );
}