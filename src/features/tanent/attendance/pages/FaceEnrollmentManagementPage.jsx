import React, { useState } from 'react';
import { toast } from 'sonner';
import { ScanFace } from 'lucide-react';

import { useFaceManagement } from '../hooks/useFaceManagement';
import { useAttendanceMethods } from '../../attendance-setup/hooks/useAttendanceMethods'; 
import { 
  useApproveFaceEnrollmentMutation,
  useRejectFaceEnrollmentMutation,
  useRevokeFaceEnrollmentMutation,
  useHrEnrollEmployeeMutation
} from '../api/faceManagementApi';

import { FaceOverviewCards } from '../components/face-management/FaceOverviewCards';
import { FaceEnrollmentFilters } from '../components/face-management/FaceEnrollmentFilters';
import { FaceEnrollmentTable } from '../components/face-management/FaceEnrollmentTable';
import { FaceEnrollmentDetailsDrawer } from '../components/face-management/FaceEnrollmentDetailsDrawer';
import { ApproveEnrollmentDialog } from '../components/face-management/ApproveEnrollmentDialog';
import { RejectEnrollmentDialog } from '../components/face-management/RejectEnrollmentDialog';
import { RevokeEnrollmentDialog } from '../components/face-management/RevokeEnrollmentDialog';
import { HREnrollmentModal } from '../components/face-management/HREnrollmentModal';
import { FaceManagementEmptyState } from '../components/face-management/FaceManagementEmptyState';
import { FaceManagementSkeleton } from '../components/face-management/FaceManagementSkeleton';

export default function FaceEnrollmentManagementPage() {
  const { methods, isLoading: loadingMethods } = useAttendanceMethods();
  const {
    searchTerm, setSearchTerm,
    statusFilter, setStatusFilter,
    sourceFilter, setSourceFilter,
    records, metrics, isLoading: loadingTable, refetch
  } = useFaceManagement();

  // Dialog & Active Profile Target Management Locks
  const [activeId, setActiveId] = useState(null);
  const [modalState, setModalState] = useState({ 
    drawer: false, 
    approve: false, 
    reject: false, 
    revoke: false, 
    hrEnroll: false 
  });

  // Mutations Configuration Hooks
  const [approveTrigger, { isLoading: isApproving }] = useApproveFaceEnrollmentMutation();
  const [rejectTrigger, { isLoading: isRejecting }] = useRejectFaceEnrollmentMutation();
  const [revokeTrigger, { isLoading: isRevoking }] = useRevokeFaceEnrollmentMutation();
  const [hrEnrollTrigger, { isLoading: isHrEnrolling }] = useHrEnrollEmployeeMutation();

  const toggleModal = (type, state, id = null) => {
    if (id) setActiveId(id);
    setModalState(prev => ({ ...prev, [type]: state }));
  };

  // FIXED: Better skeleton fallback orchestration preventing visual layout shift gaps
  if (loadingMethods || (loadingTable && (!records || records.length === 0))) {
    return (
      <div className="p-4 sm:p-6 w-full max-w-7xl mx-auto">
        <FaceManagementSkeleton />
      </div>
    );
  }

  // Feature Availability Isolation Evaluation Gate
  const isFaceActive = Array.isArray(methods) && methods.some(m => m.method === 'FACE' && m.is_active);
  if (!isFaceActive) {
    return <FaceManagementEmptyState />;
  }

  return (
    <div className="space-y-6 max-w-7xl text-xs font-medium text-slate-700 tracking-tight p-4 sm:p-6 w-full animate-fadeIn mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-0.5">
          <h1 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Face Enrollment Management</h1>
          <p className="text-[11px] text-slate-400 font-normal">Manage biometric enrollment requests, approvals, and employee face profiles corporate-wide.</p>
        </div>
        <button
          type="button"
          onClick={() => toggleModal('hrEnroll', true)}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-2xs transition-all tracking-tight flex items-center justify-center gap-1.5 cursor-pointer self-start sm:self-auto text-xs"
        >
          <ScanFace className="h-4 w-4 stroke-[1.75]" />
          <span>Enroll Employee</span>
        </button>
      </div>

      {/* Metrics Infrastructure Deck */}
      <FaceOverviewCards metrics={metrics} />

      {/* Search Filter Query Anchor Options Grid */}
      <FaceEnrollmentFilters
        search={searchTerm} onSearchChange={setSearchTerm}
        status={statusFilter} onStatusChange={setStatusFilter}
        source={sourceFilter} onSourceChange={setSourceFilter}
      />

      {/* Database Monitoring Queue Records Render Table */}
      <FaceEnrollmentTable
        records={records}
        onView={(id) => toggleModal('drawer', true, id)}
        onApprove={(id) => toggleModal('approve', true, id)}
        onReject={(id) => toggleModal('reject', true, id)}
        onRevoke={(id) => toggleModal('revoke', true, id)}
      />

      {/* Audit Insight Structural Drawer */}
      <FaceEnrollmentDetailsDrawer
        id={activeId}
        isOpen={modalState.drawer}
        onClose={() => toggleModal('drawer', false)}
      />

      {/* Operational Alignment Action Dialog Modules */}
      <ApproveEnrollmentDialog
        isOpen={modalState.approve}
        isSubmitting={isApproving}
        onClose={() => toggleModal('approve', false)}
        onConfirm={async () => {
          try {
            await approveTrigger(activeId).unwrap();
            toast.success('Biometric profile enrollment successfully approved and activated.');
            toggleModal('approve', false);
            refetch();
          } catch (e) { 
            toast.error(e?.data?.message || 'Approval mutation error context encountered.'); 
          }
        }}
      />

      <RejectEnrollmentDialog
        isOpen={modalState.reject}
        isSubmitting={isRejecting}
        onClose={() => toggleModal('reject', false)}
        onConfirm={async (payload) => {
          try {
            const requestData = typeof payload === 'object' && payload !== null ? payload : { reason: payload };
            await rejectTrigger({ id: activeId, ...requestData }).unwrap();
            toast.success('Biometric profile enrollment request rejected.');
            toggleModal('reject', false);
            refetch();
          } catch (e) { 
            toast.error(e?.data?.message || 'Rejection action processing failure.'); 
          }
        }}
      />

      <RevokeEnrollmentDialog
        isOpen={modalState.revoke}
        isSubmitting={isRevoking}
        onClose={() => toggleModal('revoke', false)}
        onConfirm={async (payload) => {
          try {
            const requestData = typeof payload === 'object' && payload !== null ? payload : { reason: payload };
            await revokeTrigger({ id: activeId, ...requestData }).unwrap();
            toast.success('Active biometric profile revoked and deactivated successfully.');
            toggleModal('revoke', false);
            refetch();
          } catch (e) { 
            toast.error(e?.data?.message || 'Revocation assignment mutation breakdown.'); 
          }
        }}
      />

      <HREnrollmentModal
        isOpen={modalState.hrEnroll}
        isSubmitting={isHrEnrolling}
        // ✅ FIXED: Explicitly pass down modelsReady to prevent child initialization crashes
        modelsReady={true}
        onClose={() => toggleModal('hrEnroll', false)}
        onEnroll={async (payload) => {
          try {
            await hrEnrollTrigger(payload).unwrap();
            toast.success('Employee biometric profile explicitly configured and approved by HR.');
            toggleModal('hrEnroll', false);
            refetch();
          } catch (e) { 
            toast.error(e?.data?.message || 'Direct baseline ingestion pipeline breakdown.'); 
          }
        }}
      />
    </div>
  );
}