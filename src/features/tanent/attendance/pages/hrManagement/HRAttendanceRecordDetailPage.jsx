import React, { useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AlertTriangle, ArrowLeft } from "lucide-react";
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

import ManualOperationsDrawer from "../../components/hrManagement/manualOperations/ManualOperationsDrawer";
import AttendanceEventCorrectionModal from "../../components/hrManagement/recordDetail/AttendanceEventCorrectionModal";
   
/**
 * HREmployeeAttendanceRecordDetailPage - Premium Investigative HR Workspace Console.
 */
export default function HREmployeeAttendanceRecordDetailPage() {
  const { record_id } = useParams();
  const navigate = useNavigate();
  const parsedRecordId = parseInt(record_id, 10);

  const [isManualOpsOpen, setIsManualOpsOpen] = useState(false);
  const [selectedCorrectionEvent, setSelectedCorrectionEvent] = useState(null);

  const { data: graphRes, isLoading, isFetching, refetch, isError } = useGetComprehensiveRecordGraphQuery(
    parsedRecordId, 
    { skip: !record_id }
  );

  const handleNavigateBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleOpenCorrectionModal = useCallback((eventToken) => {
    setSelectedCorrectionEvent(eventToken);
  }, []);

  const handleCloseCorrectionModal = useCallback(() => {
    setSelectedCorrectionEvent(null);
  }, []);

  if (isError) {
    return (
      <PageContainer>
        <div className="text-center py-16 bg-white border border-dashed border-slate-200 rounded-2xl shadow-sm max-w-xl mx-auto my-12" role="alert">
          <AlertTriangle className="mx-auto h-12 w-12 text-rose-500 mb-4 animate-pulse" />
          <h3 className="text-lg font-bold text-slate-900 mb-2">Record Audit Trace Failure</h3>
          <p className="text-sm font-medium text-slate-500 mb-6 px-6">
            Failed to retrieve the attendance record graph execution chain. It may have been permanently purged, or your workspace access privileges have expired.
          </p>
          <button 
            type="button" 
            onClick={handleNavigateBack} 
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-all shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Return to Ledger
          </button>
        </div>
      </PageContainer>
    );
  }

  const data = graphRes?.data || graphRes;
  const isWorkspaceRecordEditable = data?.allowed_actions?.can_manual_correction ?? true;

  return (
    <PermissionWrapper requiredPermission="canViewRecords">
      {isLoading ? (
        <RecordDetailSkeleton />
      ) : (
        <div className="bg-slate-50 min-h-screen w-full flex flex-col pb-16 antialiased selection:bg-slate-900/10">
          
          <RecordDetailHeader 
            headerData={data?.record || data?.header} 
            onRefresh={refetch} 
            isFetching={isFetching} 
            isDrawerMode={false} 
            onOpenManualOps={isWorkspaceRecordEditable ? () => setIsManualOpsOpen(true) : null}
            navigateBack={handleNavigateBack}
          />

          <PageContainer className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto w-full">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              
              <div className="lg:col-span-2 space-y-6 min-w-0">
                <AttendanceSummaryCard summary={data?.summary || data?.record} flags={data?.flags || data?.record} />
                <WorkingHoursCard summary={data?.summary || data?.record} />
                <AttendanceTimeline events={data?.timeline} />
                
                {/* Embedded Event Table mapped with adjustment parameters bindings */}
                <AttendanceEventsTable 
                  events={data?.timeline} 
                  onEditEvent={handleOpenCorrectionModal}
                  isEditable={isWorkspaceRecordEditable}
                />
              </div>
              
              <div className="space-y-6 min-w-0">
                <AdministrativeActionsPanel 
                  recordId={parsedRecordId} 
                  allowedActions={data?.allowed_actions} 
                  onMutationSuccess={refetch} 
                />
                <ScheduleSnapshotCard snapshot={data?.schedule_snapshot} />
                <PolicySnapshotCard snapshot={data?.policy_snapshot} />
                <AuditInformationCard reviewInfo={data?.audit_history?.[0] || data?.review_info} />
              </div>

            </div>
          </PageContainer>

          {/* Manual Entry Sidebar Panel overlay */}
          <ManualOperationsDrawer
            isOpen={isManualOpsOpen}
            onClose={() => setIsManualOpsOpen(false)}
            recordId={parsedRecordId}
            recordContextGraph={data}
            isDataLoading={isFetching}
          />

          {/* Historical Adjustments Input Modal overlay node */}
          <AttendanceEventCorrectionModal
            isOpen={selectedCorrectionEvent !== null}
            onClose={handleCloseCorrectionModal}
            event={selectedCorrectionEvent}
            recordContext={data?.record || data?.header || { id: parsedRecordId }}
          />
        </div>
      )}
    </PermissionWrapper>
  );
}