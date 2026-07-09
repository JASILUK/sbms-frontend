import React, { useState, useMemo, useEffect, useCallback } from "react";
import PageContainer from "../../components/hrManagement/shared/PageContainer";
import PermissionWrapper from "../../components/hrManagement/shared/PermissionWrapper";
import { useReviewFilters } from "../../hooks/hr_attendance_management/useReviewFilters";
import {
  useGetReviewDashboardQuery,
  useGetReviewQueueQuery,
  useResolveReviewMutation,
  useAddReviewNoteMutation,
} from "../../api/hrAttendance/hrReviewApi";

import { ReviewHeader } from "../../components/hrManagement/reviewQueue/ReviewHeader";
import { ReviewDashboardCards } from "../../components/hrManagement/reviewQueue/ReviewDashboardCards";
import { ReviewToolbar } from "../../components/hrManagement/reviewQueue/ReviewToolbar";
import { ReviewTable } from "../../components/hrManagement/reviewQueue/ReviewTable";
import { ReviewEmptyState } from "../../components/hrManagement/reviewQueue/ReviewEmptyState";
import { ReviewSkeleton } from "../../components/hrManagement/reviewQueue/ReviewSkeleton";
import { ResolveReviewDialog } from "../../components/hrManagement/reviewQueue/ResolveReviewDialog";
import { ReviewNoteDialog } from "../../components/hrManagement/reviewQueue/ReviewNoteDialog";

export default function HRReviewQueuePage() {
  const { filters, searchInputValue, setSearchInputValue, updateFilters, clearFilters } = useReviewFilters();

  const [targetedRecordId, setTargetedRecordId] = useState(null);
  const [dialogViewMode, setDialogViewViewMode] = useState(null); // resolve | note | null

  // Ingest search strings debouncing loops
  useEffect(() => {
    const trackerTimer = setTimeout(() => {
      updateFilters({ search: searchInputValue });
    }, 350);
    return () => clearTimeout(trackerTimer);
  }, [searchInputValue, updateFilters]);

  // Read data streams straight from out of the optimized backend endpoints filters structures
  const { data: dashboardRes, isFetching: isDashboardFetching, refetch: refetchDashboard } = useGetReviewDashboardQuery();
  
  const queryParams = useMemo(() => ({
    ...filters,
    needs_review: "true",
  }), [filters]);

  const { data: queueRes, isLoading: isQueueLoading, isFetching: isQueueFetching, refetch: refetchQueue } = useGetReviewQueueQuery(queryParams);

  const [resolveReviewFn, { isLoading: isResolveSubmitting }] = useResolveReviewMutation();
  const [addNoteFn, { isLoading: isNoteSubmitting }] = useAddReviewNoteMutation();

  const handleRefreshAll = useCallback(() => {
    refetchDashboard();
    refetchQueue();
  }, [refetchDashboard, refetchQueue]);

  const handleOpenDialog = useCallback((mode, id) => {
    setTargetedRecordId(id);
    setDialogViewViewMode(mode);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setTargetedRecordId(null);
    setDialogViewViewMode(null);
  }, []);

  const handleCommitResolution = async (reasonText) => {
    try {
      await resolveReviewFn({ recordId: targetedRecordId, reason: reasonText }).unwrap();
      alert("Success: Attendance review anomaly cleared.");
      handleCloseDialog();
    } catch (err) {
      alert(`Operation failure: ${err?.data?.message || "Internal transaction error."}`);
    }
  };

  const handleCommitNoteAppend = async (noteText) => {
    try {
      await addNoteFn({ recordId: targetedRecordId, reason: noteText }).unwrap();
      alert("Success: Investigative audit note logged onto shared compliance timeline stream.");
      handleCloseDialog();
    } catch (err) {
      alert(`Operation failure: ${err?.data?.message || "Internal log appending error."}`);
    }
  };

  const metricsData = dashboardRes?.data || dashboardRes;
  const reviewRows = queueRes?.data?.results || queueRes?.results || [];
  const totalItemsCount = queueRes?.data?.pagination?.count || queueRes?.meta?.pagination?.count || 0;

  const showLoader = isQueueLoading;
  const showEmptyState = !showLoader && reviewRows.length === 0;

  return (
    <PermissionWrapper requiredPermission="canViewRecords">
      <div className="bg-slate-50 min-h-screen flex flex-col antialiased">
        <ReviewHeader onRefresh={handleRefreshAll} isFetching={isDashboardFetching || isQueueFetching} />

        <PageContainer className="p-6 max-w-7xl w-full mx-auto space-y-6 flex-1">
          {showLoader ? (
            <ReviewSkeleton />
          ) : (
            <div className="space-y-6 animate-fade-in w-full">
              <ReviewDashboardCards metrics={metricsData} />
              
              <ReviewToolbar
                filters={filters}
                searchInputValue={searchInputValue}
                onSearchValueChange={setSearchInputValue}
                onFilterChange={updateFilters}
                onClear={clearFilters}
              />

              {showEmptyState ? (
                <ReviewEmptyState />
              ) : (
                <div className="space-y-4 w-full">
                  <ReviewTable
                    rows={reviewRows}
                    onResolve={(id) => handleOpenDialog("resolve", id)}
                    onNote={(id) => handleOpenDialog("note", id)}
                  />

                  {/* Limit-Offset Pagination Controls Links Base */}
                  {totalItemsCount > filters.limit && (
                    <div className="flex justify-end pt-2 w-full">
                      <nav className="inline-flex gap-1" aria-label="Review anomaly records grid table pagination navigation">
                        <button
                          type="button"
                          disabled={filters.offset === 0}
                          onClick={() => updateFilters({ offset: Math.max(0, filters.offset - filters.limit) })}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold disabled:opacity-40 transition-colors bg-white text-slate-700"
                        >
                          Previous
                        </button>
                        <button
                          type="button"
                          disabled={filters.offset + filters.limit >= totalItemsCount}
                          onClick={() => updateFilters({ offset: filters.offset + filters.limit })}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold disabled:opacity-40 transition-colors bg-white text-slate-700"
                        >
                          Next
                        </button>
                      </nav>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </PageContainer>

        {/* Action Dialog Container Node Injections */}
        <ResolveReviewDialog
          isOpen={dialogViewMode === "resolve"}
          isSubmitting={isResolveSubmitting}
          onCancel={handleCloseDialog}
          onConfirm={handleCommitResolution}
        />

        <ReviewNoteDialog
          isOpen={dialogViewMode === "note"}
          isSubmitting={isNoteSubmitting}
          onCancel={handleCloseDialog}
          onConfirm={handleCommitNoteAppend}
        />
      </div>
    </PermissionWrapper>
  );
}