import React, { useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

import { useAttendanceMethods } from '../../../hooks/useAttendanceMethods';
import { MethodsHeader } from './MethodsHeader';
import { MethodsSkeleton } from './MethodsSkeleton';
import { EmptyMethodsState } from './EmptyMethodsState';
import { MethodsGrid } from './MethodsGrid';
import { MethodDetailsDrawer } from './MethodDetailsDrawer';
import { MethodSelectionModal } from './MethodSelectionModal';

export function AttendanceMethodsSection() {
  const [, setSearchParams] = useSearchParams();
  const [activeModal, setActiveModal] = useState(false);
  const [focusedDrawerKey, setFocusedDrawerKey] = useState(null);

  const {
    methods,
    enabledMethods,
    replaceMethods,
    enableMethod,
    disableMethod,
    isLoading,
    isUpdating
  } = useAttendanceMethods();

  const handleToggleIndividualMethod = useCallback(async (methodName, currentStateActive) => {
    try {
      if (currentStateActive) {
        await disableMethod(methodName);
        toast.success(`Authentication path '${methodName}' deactivated successfully.`);
      } else {
        await enableMethod(methodName);
        toast.success(`Authentication path '${methodName}' enabled cleanly.`);
      }
    } catch (err) {
      toast.error(err?.data?.message || 'Operation rejected by permission policies.');
    }
  }, [enableMethod, disableMethod]);

  const handleBulkMatrixSyncSubmit = async (formData) => {
    try {
      await replaceMethods(formData.methods);
      toast.success('Core tracking vectors structure updated successfully.');
      setActiveModal(false);
    } catch (err) {
      toast.error(err?.data?.message || 'Validation error processing matrix payload.');
    }
  };

  const handleDrawerInterSectionRouting = useCallback((targetSectionLink) => {
    setSearchParams({ section: targetSectionLink });
  }, [setSearchParams]);

  if (isLoading) return <MethodsSkeleton />;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* ✅ FIX: Wrap the structural condition down here so the modals are never blocked from mounting */}
      {!methods || methods.length === 0 ? (
        <EmptyMethodsState onConfigure={() => setActiveModal(true)} />
      ) : (
        <>
          <MethodsHeader 
            onConfigure={() => setActiveModal(true)} 
            onRefetch={() => toast.info('Methods telemetry synchronized.')} 
            isRefetching={isUpdating} 
          />

          <MethodsGrid
            enabledMethods={enabledMethods}
            isUpdating={isUpdating}
            onToggleMethod={handleToggleIndividualMethod}
            onShowDetails={setFocusedDrawerKey}
          />
        </>
      )}

      {/* Modals are placed outside the check so they can execute regardless of data array status */}
      {activeModal && (
        <MethodSelectionModal
          enabledMethods={enabledMethods}
          onClose={() => setActiveModal(false)}
          onSave={handleBulkMatrixSyncSubmit}
        />
      )}

      {focusedDrawerKey && (
        <MethodDetailsDrawer
          methodKey={focusedDrawerKey}
          onClose={() => setFocusedDrawerKey(null)}
          onNavigateNext={handleDrawerInterSectionRouting}
        />
      )}
    </div>
  );
}