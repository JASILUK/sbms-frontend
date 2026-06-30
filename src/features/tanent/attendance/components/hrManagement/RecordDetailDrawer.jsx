import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Avatar from "./Avatar";
import StatusBadge from "./StatusBadge";
import SummaryGrid from "./SummaryGrid";
import PolicySnapshotCard from "./PolicySnapshotCard";
import ScheduleSnapshotCard from "./ScheduleSnapshotCard";
import AttendanceTimeline from "./AttendanceTimeline";
import ActionBar from "./ActionBar";
import { DrawerSkeleton } from "./Skeletons";
import ErrorState from "./ErrorState";

export default function RecordDetailDrawer({
  recordId,
  onClose,
  dailyRecord,
  timeline,
  isLoading,
  isError,
  onRetry,
  onAction,
  isActionLoading,
}) {
  const open = Boolean(recordId);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-neutral-900/30 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 300 }}
            role="dialog"
            aria-modal="true"
            aria-label="Attendance record details"
            className="absolute right-0 top-0 h-full w-full max-w-[520px] overflow-y-auto bg-white shadow-2xl dark:bg-neutral-950 sm:rounded-l-2xl"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-100 bg-white/95 px-5 py-4 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/95">
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Attendance Record</h2>
              <button
                onClick={onClose}
                aria-label="Close drawer"
                className="rounded-md p-1.5 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {isLoading && <DrawerSkeleton />}

            {!isLoading && isError && (
              <div className="p-6">
                <ErrorState message="Couldn't load this record." onRetry={onRetry} />
              </div>
            )}

            {!isLoading && !isError && dailyRecord && (
              <div className="space-y-6 p-5">
                <div className="flex items-center gap-3">
                  <Avatar name={dailyRecord.employee_name} src={dailyRecord.employee_avatar} size="lg" />
                  <div className="min-w-0">
                    <p className="truncate text-base font-semibold text-neutral-900 dark:text-neutral-100">
                      {dailyRecord.employee_name || "Employee"}
                    </p>
                    <p className="truncate text-sm text-neutral-500 dark:text-neutral-400">
                      {dailyRecord.department_name} {dailyRecord.designation ? `· ${dailyRecord.designation}` : ""}
                    </p>
                    <div className="mt-1.5">
                      <StatusBadge status={dailyRecord.attendance_status} />
                    </div>
                  </div>
                </div>

                <SummaryGrid record={dailyRecord} />

                <div>
                  <h3 className="mb-3 text-sm font-semibold text-neutral-900 dark:text-neutral-100">Timeline</h3>
                  <AttendanceTimeline events={timeline} isLoading={false} />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <PolicySnapshotCard snapshot={dailyRecord.policy_snapshot} />
                  <ScheduleSnapshotCard snapshot={dailyRecord.schedule_snapshot} />
                </div>

                <ActionBar recordId={recordId} onAction={onAction} isLoading={isActionLoading} />
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
