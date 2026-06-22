import React, { useState, useMemo } from "react";
import { useGetShiftsQuery } from "../api/attendanceSetupApi";
import { useShiftFilters } from "../hooks/useShiftFilters";

// Core UI Module Sub-components
import { ShiftHeader } from "../components/shifts/ShiftHeader";
import { ShiftStats } from "../components/shifts/ShiftStats";
import { ShiftFilters } from "../components/shifts/ShiftFilters";
import { ShiftTable } from "../components/shifts/ShiftTable";
import { ShiftCard } from "../components/shifts/ShiftCard";
import { ShiftFormModal } from "../components/shifts/ShiftFormModal";
import { ShiftDetailDrawer } from "../components/shifts/ShiftDetailDrawer";
import { SetDefaultDialog } from "../components/shifts/SetDefaultDialog";
import { DeactivateShiftDialog } from "../components/shifts/DeactivateShiftDialog";
import { ActivateShiftDialog } from "../components/shifts/ActivateShiftDialog";
import { ShiftSkeleton } from "../components/shifts/ShiftSkeleton";
import { EmptyShiftState } from "../components/shifts/EmptyShiftState";
import { ShiftErrorState } from "../components/shifts/ShiftErrorState";

export default function ShiftTemplatesPage() {
  const { filters, updateFilter, queryParameters } = useShiftFilters();

  // 1. Stabilize query objects to avoid infinite execution fetch loops
  const memoizedParams = useMemo(() => {
    return {
      search: queryParameters.search,
      is_active: queryParameters.is_active,
      shift_type: queryParameters.shift_type,
      ordering: queryParameters.ordering,
    };
  }, [queryParameters.search, queryParameters.is_active, queryParameters.shift_type, queryParameters.ordering]);

  // Execute base hook query
  const { data: responseBody, isLoading, isFetching, error, refetch } = useGetShiftsQuery(memoizedParams);

  // 2. Safely extract data arrays across standard or paginated layouts
  const shiftTemplatesArray = useMemo(() => {
    if (!responseBody) return [];
    if (responseBody?.data && Array.isArray(responseBody.data.results)) return responseBody.data.results;
    if (Array.isArray(responseBody?.data)) return responseBody.data;
    if (Array.isArray(responseBody?.results)) return responseBody.results;
    if (Array.isArray(responseBody)) return responseBody;
    return [];
  }, [responseBody]);

  // View state modal toggle controllers
  const [formModal, setFormModal] = useState({ isOpen: false, activeShift: null });
  const [detailDrawer, setDetailDrawer] = useState({ isOpen: false, targetShift: null });
  const [defaultDialog, setDefaultDialog] = useState({ isOpen: false, id: null });
  const [deactivateDialog, setDeactivateDialog] = useState({ isOpen: false, id: null });
  const [activateDialog, setActivateDialog] = useState({ isOpen: false, id: null });

  // 3. Render loading structures only on absolute initial empty states
  if (isLoading && shiftTemplatesArray.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
        <div className="h-10 bg-slate-100 rounded-lg w-1/4 animate-pulse" />
        <ShiftSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <ShiftErrorState onRetry={() => refetch()} />
      </div>
    );
  }

  const hasData = shiftTemplatesArray.length > 0;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 space-y-6 select-none transition-all duration-150">
      
      <ShiftHeader onCreateClick={() => setFormModal({ isOpen: true, activeShift: null })} />

      <ShiftStats templates={shiftTemplatesArray} />

      <ShiftFilters filters={filters} onFilterChange={updateFilter} />

      {/* Dim container slightly during background fetching transitions */}
      <div className={isFetching ? "opacity-65 pointer-events-none transition-opacity duration-150" : "transition-opacity duration-150"}>
        {hasData ? (
          <>
            {/* Desktop Presentation View */}
            <ShiftTable
              shifts={shiftTemplatesArray}
              onView={(item) => setDetailDrawer({ isOpen: true, targetShift: item })}
              onEdit={(item) => setFormModal({ isOpen: true, activeShift: item })}
              onSetDefault={(id) => setDefaultDialog({ isOpen: true, id })}
              onDeactivate={(id) => setDeactivateDialog({ isOpen: true, id })}
              onActivate={(id) => setActivateDialog({ isOpen: true, id })}
            />
            
            {/* Mobile / Small Screen Card Grid View */}
            <div className="grid grid-cols-1 gap-4 lg:hidden">
              {shiftTemplatesArray.map((shift) => (
                <ShiftCard
                  // FIXED: Changed key property mapping from shift.id to shift.public_id
                  key={shift.public_id}
                  shift={shift}
                  onView={(item) => setDetailDrawer({ isOpen: true, targetShift: item })}
                  onEdit={(item) => setFormModal({ isOpen: true, activeShift: item })}
                  onSetDefault={(id) => setDefaultDialog({ isOpen: true, id })}
                  onDeactivate={(id) => setDeactivateDialog({ isOpen: true, id })}
                  onActivate={(id) => setActivateDialog({ isOpen: true, id })}
                />
              ))}
            </div>
          </>
        ) : (
          <EmptyShiftState onCreateClick={() => setFormModal({ isOpen: true, activeShift: null })} />
        )}
      </div>

      {/* Reusable Data Mutation Forms Modal */}
      <ShiftFormModal
        isOpen={formModal.isOpen}
        activeShift={formModal.activeShift}
        onClose={() => setFormModal({ isOpen: false, activeShift: null })}
      />

      {/* Structural Data Inspection Drawer */}
      <ShiftDetailDrawer
        isOpen={detailDrawer.isOpen}
        shift={detailDrawer.targetShift}
        onClose={() => setDetailDrawer({ isOpen: false, targetShift: null })}
      />

      {/* Context Dialogue Portals - Binding directly to defaultDialog.id */}
      <SetDefaultDialog
        isOpen={defaultDialog.isOpen}
        targetId={defaultDialog.id}
        onClose={() => setDefaultDialog({ isOpen: false, id: null })}
      />

      <DeactivateShiftDialog
        isOpen={deactivateDialog.isOpen}
        targetId={deactivateDialog.id}
        onClose={() => setDeactivateDialog({ isOpen: false, id: null })}
      />

      <ActivateShiftDialog
        isOpen={activateDialog.isOpen}
        targetId={activateDialog.id}
        onClose={() => setActivateDialog({ isOpen: false, id: null })}
      />
    </main>
  );
}