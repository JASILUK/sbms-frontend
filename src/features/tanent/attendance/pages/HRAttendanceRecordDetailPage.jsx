import React from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useAttendanceDetail } from "../hooks/hr_attendance_management/useAttendanceDetail";
import { useAttendanceActions } from "../hooks/hr_attendance_management/useAttendanceActions";

import Avatar from "../components/hrManagement/Avatar";
import StatusBadge from "../components/hrManagement/StatusBadge";
import SummaryGrid from "../components/hrManagement/SummaryGrid";
import PolicySnapshotCard from "../components/hrManagement/PolicySnapshotCard";
import ScheduleSnapshotCard from "../components/hrManagement/ScheduleSnapshotCard";
import AttendanceTimeline from "../components/hrManagement/AttendanceTimeline";
import ActionBar from "../components/hrManagement/ActionBar";
import ConfirmActionDialog from "../components/hrManagement/ConfirmActionDialog";
import { DrawerSkeleton } from "../components/hrManagement/Skeletons";
import ErrorState from "../components/hrManagement/ErrorState";

/**
 * Shareable / deep-linkable full-page view of a single attendance record.
 * Mirrors RecordDetailDrawer's content for direct URL access.
 */
export default function HRAttendanceRecordDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const detail = useAttendanceDetail(id);
  const actions = useAttendanceActions();

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <button onClick={() => navigate(-1)} className="mb-4 text-sm text-neutral-500 hover:text-neutral-800">
        ← Back
      </button>

      {detail.isLoading && <DrawerSkeleton />}
      {!detail.isLoading && detail.isError && <ErrorState message="Couldn't load this record." onRetry={detail.refetch} />}

      {!detail.isLoading && !detail.isError && detail.dailyRecord && (
        <div className="space-y-6 rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center gap-3">
            <Avatar name={detail.dailyRecord.employee_name} size="lg" />
            <div>
              <p className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                {detail.dailyRecord.employee_name || "Employee"}
              </p>
              <div className="mt-1">
                <StatusBadge status={detail.dailyRecord.attendance_status} />
              </div>
            </div>
          </div>

          <SummaryGrid record={detail.dailyRecord} />

          <div>
            <h3 className="mb-3 text-sm font-semibold text-neutral-900 dark:text-neutral-100">Timeline</h3>
            <AttendanceTimeline events={detail.timeline} isLoading={false} />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <PolicySnapshotCard snapshot={detail.dailyRecord.policy_snapshot} />
            <ScheduleSnapshotCard snapshot={detail.dailyRecord.schedule_snapshot} />
          </div>

          <ActionBar recordId={id} onAction={actions.requestAction} isLoading={actions.isActionRunning} />
        </div>
      )}

      <ConfirmActionDialog
        pendingAction={actions.pendingAction}
        onCancel={actions.cancelAction}
        onConfirm={actions.confirmAction}
        isLoading={actions.isActionRunning}
      />
    </div>
  );
}
