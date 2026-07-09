import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { createPortal } from "react-dom";
import { useGetComprehensiveRecordGraphQuery } from "../../../api/hrAttendance/attendanceRecordApi";
import RecordDetailSkeleton from "./RecordDetailSkeleton";
import RecordHeader from "./RecordHeader";
import AttendanceSummaryCard from "./AttendanceSummaryCard";
import AttendanceTimeline from "./AttendanceTimeline";
import WorkingHoursCard from "./WorkingHoursCard";
import ScheduleSnapshotCard from "./ScheduleSnapshotCard";
import PolicySnapshotCard from "./PolicySnapshotCard";
import AttendanceEventsTable from "./AttendanceEventsTable";
import HRActionPanel from "./HRActionPanel";
import AuditPanel from "./AuditPanel";

export default function RecordDetailDrawer({ isOpen, recordId, onClose }) {
  const { data: graphRes, isLoading, isFetching, refetch } = useGetComprehensiveRecordGraphQuery(recordId, {
    skip: !isOpen || !recordId,
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const handleEscape = (e) => { if (e.key === "Escape") onClose(); };
      window.addEventListener("keydown", handleEscape);
      return () => window.removeEventListener("keydown", handleEscape);
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  const data = graphRes?.data || graphRes;

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-label="Attendance record investigation panel drawer">
      <div className="absolute inset-0 overflow-hidden">
        {/* Light overlay background drop mask layer control */}
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300" onClick={onClose} />

        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
          <div className="pointer-events-auto w-screen max-w-4xl transform bg-slate-50 shadow-2xl transition-transform duration-300 border-l border-slate-200 h-full flex flex-col">
            {isLoading ? (
              <RecordDetailSkeleton />
            ) : (
              <div className="h-full flex flex-col overflow-y-auto min-w-0">
                <RecordHeader 
                  headerData={data?.header} 
                  onRefresh={refetch} 
                  isFetching={isFetching} 
                  isDrawerMode={true} 
                  onCloseDrawer={onClose} 
                />

                <div className="flex-1 p-4 sm:p-6 space-y-6 max-w-full overflow-x-hidden">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    <div className="lg:col-span-2 space-y-6 min-w-0">
                      <AttendanceSummaryCard summary={data?.summary} flags={data?.flags} />
                      <AttendanceTimeline events={data?.timeline} />
                      <AttendanceEventsTable events={data?.timeline} />
                    </div>
                    <div className="space-y-6 min-w-0">
                      <HRActionPanel recordId={parseInt(recordId, 10)} allowedActions={data?.allowed_actions} onMutationSuccess={refetch} />
                      <WorkingHoursCard summary={data?.summary} />
                      <ScheduleSnapshotCard snapshot={data?.schedule_snapshot} />
                      <PolicySnapshotCard snapshot={data?.policy_snapshot} />
                      <AuditPanel reviewInfo={data?.review_info} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

RecordDetailDrawer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  recordId: PropTypes.number,
  onClose: PropTypes.func.isRequired,
};