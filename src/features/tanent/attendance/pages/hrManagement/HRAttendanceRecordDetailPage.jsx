import React, { useState } from "react";
import { useParams } from "react-router-dom";
import PageContainer from "../../components/hrManagement/shared/PageContainer";
import PermissionWrapper from "../../components/hrManagement/shared/PermissionWrapper";
import { useGetComprehensiveRecordGraphQuery } from "../../api/hrAttendance/attendanceRecordApi";

import RecordDetailSkeleton from "../../components/hrManagement/recordDetail/RecordDetailSkeleton";
import RecordDetailHeader from "../../components/hrManagement/recordDetail/RecordHeader";
import AttendanceSummaryCard from "../../components/hrManagement/recordDetail/AttendanceSummaryCard";
import AttendanceTimeline from "../../components/hrManagement/recordDetail/AttendanceTimeline";
import WorkingHoursCard from "../../components/hrManagement/recordDetail/WorkingHoursCard";
import ScheduleSnapshotCard from "../../components/hrManagement/recordDetail/ScheduleSnapshotCard";
import PolicySnapshotCard from "../../components/hrManagement/recordDetail/PolicySnapshotCard";
import AttendanceEventsTable from "../../components/hrManagement/recordDetail/AttendanceEventsTable";
import AdministrativeActionsPanel from "../../components/hrManagement/recordDetail/AdministrativeActionsPanel";
import AuditInformationCard from "../../components/hrManagement/recordDetail/AuditInformationCard";

// 🆕 Step 1: Ingest Manual Ingestion Events Management Overlay Drawer
import ManualOperationsDrawer from "../../components/hrManagement/manualOperations/ManualOperationsDrawer";

// 🆕 Step 2: Ingest Administrative Status Overrides and Exceptions Management Overlay Drawer
import StatusOverrideDrawer from "../../components/hrManagement/statusOverride/StatusOverrideDrawer";

/**
 * HREmployeeAttendanceRecordDetailPage - Central Investigative HR Workspace Console.
 * Manages atomic sub-drawer overlay toggle vectors and binds automated background cache revalidations.
 */
export default function HREmployeeAttendanceRecordDetailPage() {
  const { record_id } = useParams();
  const parsedRecordId = parseInt(record_id, 10);

  // 🆕 Local UI State Trackers driving deep orchestration console views asynchronously
  const [isManualOpsOpen, setIsManualOpsOpen] = useState(false);
  const [isOverrideOpsOpen, setIsOverrideOpsOpen] = useState(false);

  // Core high-performance pre-fetched query hook tracking standard entity packets
  const { data: graphRes, isLoading, isFetching, refetch, isError } = useGetComprehensiveRecordGraphQuery(
    parsedRecordId, 
    { skip: !record_id }
  );

  if (isError) {
    return (
      <PageContainer>
        <div className="text-center py-16 bg-white border border-dashed border-slate-200 rounded-2xl shadow-sm" role="alert">
          <svg className="mx-auto h-12 w-12 text-slate-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Record Not Found</h3>
          <p className="text-sm font-medium text-slate-500 mb-6">Failed to retrieve the attendance record graph. It may have been removed or you lack access permissions.</p>
          <button type="button" onClick={() => window.history.back()} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors cursor-pointer">
            Go Back
          </button>
        </div>
      </PageContainer>
    );
  }

  // Handle standard multi-tenant structured payload data envelope extraction safely
  const data = graphRes?.data || graphRes;

  return (
    <PermissionWrapper requiredPermission="canViewRecords">
      {isLoading ? (
        <RecordDetailSkeleton />
      ) : (
        <div className="bg-slate-50 min-h-screen w-full flex flex-col pb-12 animate-fade-in">
          <RecordDetailHeader 
            headerData={data?.record || data?.header} 
            onRefresh={refetch} 
            isFetching={isFetching} 
            isDrawerMode={false} 
          />

          <PageContainer className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto w-full">
            
            {/* 🆕 Operational Navigation Toolbar Sub-Deck Control Row */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsManualOpsOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-xl font-semibold text-xs shadow-xs hover:bg-slate-50/50 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/10 cursor-pointer animate-fade-in"
              >
                <svg className="h-3.5 w-3.5 text-indigo-600" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Manual Operations Console
              </button>

              <button
                type="button"
                onClick={() => setIsOverrideOpsOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-xl font-semibold text-xs shadow-xs hover:bg-slate-50/50 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/10 cursor-pointer animate-fade-in"
              >
                <svg className="h-3.5 w-3.5 text-indigo-600" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
                Override Status & Review
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              {/* Left Column: Data Summaries, Analytical Progress, and Raw Timeline Streams */}
              <div className="lg:col-span-2 space-y-6 min-w-0">
                <AttendanceSummaryCard summary={data?.summary || data?.record} flags={data?.flags || data?.record} />
                <WorkingHoursCard summary={data?.summary || data?.record} />
                <AttendanceTimeline events={data?.timeline} />
                <AttendanceEventsTable events={data?.timeline} />
              </div>
              
              {/* Right Column: Automated Action Modals, Frozen Compliance Roster Policies, and Audit Logs */}
              <div className="space-y-6 min-w-0">
                <AdministrativeActionsPanel recordId={parsedRecordId} allowedActions={data?.allowed_actions} onMutationSuccess={refetch} />
                <ScheduleSnapshotCard snapshot={data?.schedule_snapshot} />
                <PolicySnapshotCard snapshot={data?.policy_snapshot} />
                <AuditInformationCard reviewInfo={data?.audit_history?.[0] || data?.review_info} />
              </div>
            </div>
          </PageContainer>

          {/* 🆕 Injected Portal Node Enclosures appending overlay components directly to the document root element */}
          <ManualOperationsDrawer
            isOpen={isManualOpsOpen}
            onClose={() => setIsManualOpsOpen(false)}
            recordId={parsedRecordId}
            recordContextGraph={data}
            isDataLoading={isFetching}
          />

          <StatusOverrideDrawer
            isOpen={isOverrideOpsOpen}
            onClose={() => setIsOverrideOpsOpen(false)}
            recordId={parsedRecordId}
            recordContextGraph={data}
            isDataLoading={isFetching}
          />
        </div>
      )}
    </PermissionWrapper>
  );
}