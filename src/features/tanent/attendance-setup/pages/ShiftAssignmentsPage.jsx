import React, { useState, useMemo } from "react";
import { useGetAssignmentsQuery, useGetShiftsQuery } from "../api/attendanceSetupApi";
// FIXED: Corrected spelling layout and relative path indicators to resolve standard compilation dependencies
import { useGetEmployeesQuery } from "../../emplyees/emplyeeApi";
import { useAssignmentFilters } from "../hooks/useAssignmentFilters";

// Component Manifest Import Block
import { AssignmentHeader } from "../components/assignments/AssignmentHeader";
import { AssignmentStats } from "../components/assignments/AssignmentStats";
import { AssignmentFilters } from "../components/assignments/AssignmentFilters";
import { AssignmentTable } from "../components/assignments/AssignmentTable";
import { AssignmentCard } from "../components/assignments/AssignmentCard";
import { AssignmentDrawer } from "../components/assignments/AssignmentDrawer";
import { AssignmentFormModal } from "../components/assignments/AssignmentFormModal";
import { EditAssignmentModal } from "../components/assignments/EditAssignmentModal";
import { TransferAssignmentModal } from "../components/assignments/TransferAssignmentModal";
import { EndAssignmentDialog } from "../components/assignments/EndAssignmentDialog";
import { DeactivateAssignmentDialog } from "../components/assignments/DeactivateAssignmentDialog";
import { BulkAssignModal } from "../components/assignments/BulkAssignModal";
import { AssignmentSkeleton } from "../components/assignments/AssignmentSkeleton";
import { EmptyAssignmentState } from "../components/assignments/EmptyAssignmentState";
import { AssignmentErrorState } from "../components/assignments/AssignmentErrorState";

export default function ShiftAssignmentsPage() {
  const { filters, debouncedSearch, updateFilter, queryParameters } = useAssignmentFilters();

  // Primary RTK Query Data Streams Connections Hook calls
  const { data: assignmentsBody, isLoading, isFetching, error, refetch } = useGetAssignmentsQuery(queryParameters);
  const { data: shiftsBody } = useGetShiftsQuery();
  const { data: employeesBody } = useGetEmployeesQuery();

  // Cache data normalization loops
  const rawAssignmentsList = useMemo(() => {
    if (!assignmentsBody) return [];
    return assignmentsBody?.data?.results || assignmentsBody?.data || [];
  }, [assignmentsBody]);

  const shiftsMap = useMemo(() => {
    const list = shiftsBody?.data?.results || shiftsBody?.data || [];
    const map = new Map();
    list.forEach((s) => {
      const id = s.public_id || s.id;
      if (id) {
        map.set(id, s);
        map.set(String(id), s);
      }
    });
    return map;
  }, [shiftsBody]);

  const employeesMap = useMemo(() => {
    const list = employeesBody?.data || employeesBody || [];
    const map = new Map();
    list.forEach((e) => {
      if (e.id) {
        map.set(e.id, e);
        map.set(String(e.id), e);
      }
    });
    return map;
  }, [employeesBody]);

  // CLIENT SIDE DEBOUNCED SEARCH MATCHING FILTER
  const recordsAfterClientSearchFiltering = useMemo(() => {
    if (!debouncedSearch.trim()) return rawAssignmentsList;
    return rawAssignmentsList.filter((record) => {
      // Look up target references inside nested backend properties safely
      const targetEmpId = record.membership?.id || record.membership_id;
      const employee = record.employee || employeesMap.get(targetEmpId);
      if (!employee) return false;
      
      const username = employee.username || record.membership?.username || "";
      const email = employee.user_email || "";
      return `${username} ${email}`.toLowerCase().includes(debouncedSearch.toLowerCase());
    });
  }, [rawAssignmentsList, debouncedSearch, employeesMap]);

  // Window Sheet Portal State Handlers
  const [assignSingleOpen, setAssignSingleOpen] = useState(false);
  const [bulkAssignOpen, setBulkAssignOpen] = useState(false);
  const [drawerState, setDrawerState] = useState({ isOpen: false, id: null });
  const [editModal, setEditModal] = useState({ isOpen: false, record: null });
  const [transferModal, setTransferModal] = useState({ isOpen: false, record: null });
  const [endDialog, setEndDialog] = useState({ isOpen: false, id: null });
  const [deactivateDialog, setDeactivateDialog] = useState({ isOpen: false, id: null });

  const checkIsSearchActive = filters.search.trim() !== "" || filters.shift_id !== "all" || filters.membership_id !== "all";

  if (isLoading && rawAssignmentsList.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 space-y-6">
        <div className="h-10 bg-slate-100 rounded-lg w-1/4 animate-pulse" />
        <AssignmentSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <AssignmentErrorState onRetry={() => refetch()} />
      </div>
    );
  }

  const hasDataToShow = recordsAfterClientSearchFiltering.length > 0;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 space-y-6 select-none transition-all duration-200">
      
      <AssignmentHeader onAssignSingle={() => setAssignSingleOpen(true)} onAssignBulk={() => setBulkAssignOpen(true)} />

      <AssignmentStats assignments={rawAssignmentsList} />

      <AssignmentFilters filters={filters} onFilterChange={updateFilter} />

      <div className={isFetching ? "opacity-60 pointer-events-none transition-opacity duration-150" : "transition-opacity duration-150"}>
        {hasDataToShow ? (
          <>
            {/* Desktop Screen Presentation Sheet Table View */}
            <AssignmentTable
              assignments={recordsAfterClientSearchFiltering}
              lookupEmployee={(id) => employeesMap.get(id)}
              lookupShift={(id) => shiftsMap.get(id)}
              onView={(id) => setDrawerState({ isOpen: true, id })}
              onEdit={(record) => setEditModal({ isOpen: true, record })}
              onTransfer={(record) => setTransferModal({ isOpen: true, record })}
              onEnd={(id) => setEndDialog({ isOpen: true, id })}
              onDeactivate={(id) => setDeactivateDialog({ isOpen: true, id })}
            />
            
            {/* Mobile View Layout Cards Loop */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {recordsAfterClientSearchFiltering.map((record) => (
                <AssignmentCard
                  key={record.id}
                  record={record}
                  lookupEmployee={(id) => employeesMap.get(id)}
                  lookupShift={(id) => shiftsMap.get(id)}
                  onView={(id) => setDrawerState({ isOpen: true, id })}
                  onEdit={(record) => setEditModal({ isOpen: true, record })}
                  onTransfer={(record) => setTransferModal({ isOpen: true, record })}
                  onEnd={(id) => setEndDialog({ isOpen: true, id })}
                  onDeactivate={(id) => setDeactivateDialog({ isOpen: true, id })}
                />
              ))}
            </div>
          </>
        ) : (
          <EmptyAssignmentState
            isSearchFilterActive={checkIsSearchActive}
            onAssignClick={() => setAssignSingleOpen(true)}
          />
        )}
      </div>

      {/* Data Insertion Modals Portal Enclosures */}
      <AssignmentFormModal isOpen={assignSingleOpen} onClose={() => setAssignSingleOpen(false)} />
      <BulkAssignModal isOpen={bulkAssignOpen} onClose={() => setBulkAssignOpen(false)} />
      <EditAssignmentModal isOpen={editModal.isOpen} activeRecord={editModal.record} onClose={() => setEditModal({ isOpen: false, record: null })} />
      <TransferAssignmentModal isOpen={transferModal.isOpen} activeRecord={transferModal.record} onClose={() => setTransferModal({ isOpen: false, record: null })} />

      {/* Audit Actions Dialog Popups Box */}
      <EndAssignmentDialog isOpen={endDialog.isOpen} targetId={endDialog.id} onClose={() => setEndDialog({ isOpen: false, id: null })} />
      <DeactivateAssignmentDialog isOpen={deactivateDialog.isOpen} targetId={deactivateDialog.id} onClose={() => setDeactivateDialog({ isOpen: false, id: null })} />

      {/* Operational Inspector Right Drawer */}
      <AssignmentDrawer isOpen={drawerState.isOpen} recordId={drawerState.id} onClose={() => setDrawerState({ isOpen: false, id: null })} />

    </main>
  );
}