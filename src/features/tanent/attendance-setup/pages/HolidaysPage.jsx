import React, { useState, useMemo } from "react";
import { useGetHolidaysQuery } from "../api/attendanceSetupApi";
import { useHolidayFilters } from "../hooks/useHolidayFilters";
import { HolidayHeader } from "../components/holidays/HolidayHeader";
import { HolidayStats } from "../components/holidays/HolidayStats";
import { HolidayFilters } from "../components/holidays/HolidayFilters";
import { HolidayTable } from "../components/holidays/HolidayTable";
import { TablePagination } from "../components/holidays/TablePagination"; // Import here
import { HolidayFormModal } from "../components/holidays/HolidayFormModal";
import { DeleteHolidayDialog } from "../components/holidays/DeleteHolidayDialog";
import { ImportHolidayDialog } from "../components/holidays/ImportHolidayDialog";
import { HolidaySkeleton } from "../components/holidays/HolidaySkeleton";
import { HolidayErrorState } from "../components/holidays/HolidayErrorState";
import { EmptyHolidayState } from "../components/holidays/EmptyHolidayState";

export default function HolidaysPage() {
  const { filters, updateFilter } = useHolidayFilters();
  const [currentPage, setCurrentPage] = useState(1);
  
  // Combine custom dropdown states with explicit paginator control arguments
  const memoizedParams = useMemo(() => {
    return {
      year: filters.year,
      month: filters.month !== "all" ? filters.month : undefined,
      holiday_type: filters.holiday_type !== "all" ? filters.holiday_type : undefined,
      upcoming: filters.upcoming ? true : undefined,
      page: currentPage,
    };
  }, [filters.year, filters.month, filters.holiday_type, filters.upcoming, currentPage]);

  const { data: responseBody, isLoading, isFetching, error, refetch } = useGetHolidaysQuery(memoizedParams);

  // Safely extract the inner records collection array
  const holidaysDataArray = useMemo(() => {
    return responseBody?.data?.results || [];
  }, [responseBody]);

  // Safely unwrap metadata values returned directly by the server
  const serverMeta = useMemo(() => {
    return responseBody?.data?.meta || { count: 0, next: null, previous: null, metrics: {} };
  }, [responseBody]);

  // Local interaction triggers
  const [formModalState, setFormModalState] = useState({ isOpen: false, activeHoliday: null, isReadOnly: false });
  const [deleteDialogState, setDeleteDialogState] = useState({ isOpen: false, targetId: null });
  const [isImportOpen, setIsImportOpen] = useState(false);

  // Extract classification filters dynamically
  const uniqueClassifications = useMemo(() => {
    if (!responseBody?.data?.results) return [];
    return Array.from(new Set(responseBody.data.results.map((h) => h.holiday_type).filter(Boolean)));
  }, [responseBody]);

  if (isLoading && holidaysDataArray.length === 0) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
        <div className="h-12 bg-slate-100 rounded-lg w-1/3 animate-pulse" />
        <HolidaySkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8"><HolidayErrorState onRetry={() => refetch()} /></div>
    );
  }

  const hasData = holidaysDataArray.length > 0;

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 space-y-6 transition-all duration-200">
      <HolidayHeader
        onAddClick={() => setFormModalState({ isOpen: true, activeHoliday: null, isReadOnly: false })}
        onImportClick={() => setIsImportOpen(true)}
      />

      {/* FIXED: Read metric indicators straight from the server summary response */}
      <HolidayStats stats={serverMeta.metrics} />

      <HolidayFilters
        filters={filters}
        onFilterChange={(key, val) => {
          updateFilter(key, val);
          setCurrentPage(1); // Drop index back to page 1 whenever filters change
        }}
        uniqueTypes={uniqueClassifications}
      />

      <div className={isFetching ? "opacity-60 pointer-events-none transition-opacity duration-150" : "transition-opacity duration-150"}>
        {hasData ? (
          <div className="space-y-0">
            <HolidayTable
              holidays={holidaysDataArray}
              onEdit={(item) => setFormModalState({ isOpen: true, activeHoliday: item, isReadOnly: false })}
              onView={(item) => setFormModalState({ isOpen: true, activeHoliday: item, isReadOnly: true })}
              onDelete={(id) => setDeleteDialogState({ isOpen: true, targetId: id })}
            />
            {/* FIXED: Connect pagination tray layout tightly to the list footer */}
            <TablePagination
              currentPage={currentPage}
              totalCount={serverMeta.count}
              onPageChange={(targetPage) => setCurrentPage(targetPage)}
              hasNext={!!serverMeta.next}
              hasPrevious={!!serverMeta.previous}
            />
          </div>
        ) : (
          <EmptyHolidayState
            onAddClick={() => setFormModalState({ isOpen: true, activeHoliday: null, isReadOnly: false })}
            onImportClick={() => setIsImportOpen(true)}
          />
        )}
      </div>

      <HolidayFormModal
        isOpen={formModalState.isOpen}
        activeHoliday={formModalState.activeHoliday}
        isReadOnly={formModalState.isReadOnly}
        onClose={() => setFormModalState({ isOpen: false, activeHoliday: null, isReadOnly: false })}
      />

      <DeleteHolidayDialog
        isOpen={deleteDialogState.isOpen}
        targetId={deleteDialogState.targetId}
        onClose={() => setDeleteDialogState({ isOpen: false, targetId: null })}
      />

      <ImportHolidayDialog
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        refetchHolidays={refetch}
      />
    </main>
  );
}