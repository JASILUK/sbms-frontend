import React from 'react';
import { useAttendanceDashboard } from '../hooks/useAttendanceDashboard';

import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { DashboardHeroCard } from '../components/dashboard/DashboardHeroCard';
import { DashboardSummaryCards } from '../components/dashboard/DashboardSummaryCards';
import { DashboardHealthSection } from '../components/dashboard/DashboardHealthSection';
import { DashboardQuickStats } from '../components/dashboard/DashboardQuickStats';
import { DashboardLeaveBalance } from '../components/dashboard/DashboardLeaveBalance';
import { DashboardPendingRequests } from '../components/dashboard/DashboardPendingRequests';
import { DashboardUpcoming } from '../components/dashboard/DashboardUpcoming';
import { DashboardSkeleton } from '../components/dashboard/DashboardSkeleton';
import { DashboardErrorState } from '../components/dashboard/DashboardErrorState';
import { DashboardEmptyState } from '../components/dashboard/DashboardEmptyState';

export default function AttendanceDashboardPage() {
  const {
    dashboard,
    isLoading,
    isError,
    error,
    refetch
  } = useAttendanceDashboard();

  if (isLoading) return <DashboardSkeleton />;
  if (isError) return <DashboardErrorState error={error} onRetry={refetch} />;
  if (!dashboard || !dashboard.employee) return <DashboardEmptyState />;

  const {
    employee,
    today,
    attendance_access: access,
    actions,
    monthly_summary: summary,
    pending_requests: pending,
    leave_balance: leave,
    upcoming
  } = dashboard;

  return (
    <div className="space-y-6 max-w-7xl text-xs font-medium text-slate-700 tracking-tight p-3 sm:p-5 w-full mx-auto animate-fadeIn">
      
      {/* 1. Dashboard Header Section */}
      <DashboardHeader 
        employee={employee} 
        shift={today?.shift} 
      />

      {/* 2. Dashboard Hero Card - Central Call to Action Platform */}
      <DashboardHeroCard 
        today={today} 
        access={access} 
        actions={actions} 
      />

      {/* 3. Operational Summary Metrics Panels */}
      <DashboardSummaryCards 
        today={today} 
      />

      {/* Secondary Information Grid Infrastructure Splits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
        
        {/* Analytics Insights Dashboard Core Columns */}
        <div className="md:col-span-2 space-y-5">
          {/* 4. Policy Compliance Health Gauge Metrics */}
          <DashboardHealthSection 
            summary={summary} 
          />
          {/* 5. Compact Context Exception Quick Stats Badge Matrix */}
          <DashboardQuickStats 
            summary={summary} 
            pending={pending} 
          />
        </div>

        {/* Extensions Pipeline Columns */}
        <div className="space-y-5">
          {/* 6. Leave Balance Metrics Container Profile */}
          <DashboardLeaveBalance 
            leave={leave} 
          />
          
          {/* 7. Regularization Application Log Drawer Previews */}
          <DashboardPendingRequests 
            pending={pending} 
          />
          
          {/* ✅ FIXED: Correctly rendering the upcoming events widget card instead of duplicating pending requests */}
          <DashboardUpcoming 
            upcoming={upcoming} 
          />
        </div>

      </div>
    </div>
  );
}