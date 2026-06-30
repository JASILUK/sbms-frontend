import React, { useState } from "react";
import { motion } from "framer-motion";

import { useAttendanceDashboard } from "../hooks/hr_attendance_management/useAttendanceDashboard";
import { useAttendanceLedger } from "../hooks/hr_attendance_management/useAttendanceLedger";
import { useAttendanceDetail } from "../hooks/hr_attendance_management/useAttendanceDetail";
import { useAttendanceActions } from "../hooks/hr_attendance_management/useAttendanceActions"

import PageHeader from "../components/hrManagement/PageHeader";
import KpiCards from "../components/hrManagement/KpiCards";
import StatusCards from "../components/hrManagement/StatusCards";
import LiveEventsTimeline from "../components/hrManagement/LiveEventsTimeline";
import FilterBar from "../components/hrManagement/FilterBar";
import EmployeeTable from "../components/hrManagement/EmployeeTable";
import RecordDetailDrawer from "../components/hrManagement/RecordDetailDrawer";
import ConfirmActionDialog from "../components/hrManagement/ConfirmActionDialog";

/**
 * Top-level HR Attendance Management dashboard.
 * Composes the dashboard summary, status cards, live events, the
 * filterable employee ledger table, and the record detail drawer.
 */
export default function HRAttendanceDashboardPage() {
  const [activeRecordId, setActiveRecordId] = useState(null);

  const dashboard = useAttendanceDashboard();
  const ledger = useAttendanceLedger({
    dateParam: dashboard.dateParam,
    statusFilterKey: dashboard.activeStatusFilter,
  });
  const detail = useAttendanceDetail(activeRecordId);
  const actions = useAttendanceActions();

  function handleRefreshAll() {
    dashboard.refetch();
    ledger.refetch();
  }

  function handleExport() {
    // Hook this up to a real export endpoint/CSV generator when available.
    // Intentionally left as a stub since no export API was provided.
  }

  // Live events derived from the dashboard summary payload, if the backend
  // includes a `recent_events` array. Falls back to an empty list otherwise.
  const liveEvents = dashboard.summary?.recent_events ?? [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="mx-auto max-w-[1440px] space-y-6 px-4 py-6 sm:px-6 lg:px-8"
    >
      <PageHeader
        selectedDate={dashboard.selectedDate}
        onDateChange={dashboard.setSelectedDate}
        onRefresh={handleRefreshAll}
        isFetching={dashboard.isFetching || ledger.isFetching}
      />

      <KpiCards summary={dashboard.summary} isLoading={dashboard.isLoading} />

      <StatusCards
        summary={dashboard.summary}
        isLoading={dashboard.isLoading}
        activeFilter={dashboard.activeStatusFilter}
        onToggle={dashboard.toggleStatusFilter}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <FilterBar filters={ledger.filters} updateFilter={ledger.updateFilter} clearFilters={ledger.clearFilters} onExport={handleExport} />
          <EmployeeTable
            rows={ledger.rows}
            isLoading={ledger.isLoading}
            isFetching={ledger.isFetching}
            isError={ledger.isError}
            onRetry={ledger.refetch}
            sort={ledger.sort}
            setSort={ledger.setSort}
            page={ledger.page}
            setPage={ledger.setPage}
            totalPages={ledger.totalPages}
            totalCount={ledger.totalCount}
            pageSize={ledger.pageSize}
            onRowClick={setActiveRecordId}
            onAction={actions.requestAction}
          />
        </div>

        <LiveEventsTimeline events={liveEvents} isLoading={dashboard.isLoading} isError={dashboard.isError} onRetry={dashboard.refetch} />
      </div>

      <RecordDetailDrawer
        recordId={activeRecordId}
        onClose={() => setActiveRecordId(null)}
        dailyRecord={detail.dailyRecord}
        timeline={detail.timeline}
        isLoading={detail.isLoading}
        isError={detail.isError}
        onRetry={detail.refetch}
        onAction={actions.requestAction}
        isActionLoading={actions.isActionRunning}
      />

      <ConfirmActionDialog
        pendingAction={actions.pendingAction}
        onCancel={actions.cancelAction}
        onConfirm={actions.confirmAction}
        isLoading={actions.isActionRunning}
      />
    </motion.div>
  );
}
