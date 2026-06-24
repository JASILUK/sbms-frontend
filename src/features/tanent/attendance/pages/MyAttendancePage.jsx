import React from "react";
import { useMyAttendance } from "../hooks/useMyAttendance";
import AttendanceSummaryCards from "../components/my-attendance/AttendanceSummaryCards";
import AttendanceTrends from "../components/my-attendance/AttendanceTrends";
import AttendanceCalendar from "../components/my-attendance/AttendanceCalendar";
import AttendanceListTable from "../components/my-attendance/AttendanceListTable";
import AttendanceDetailDrawer from "../components/my-attendance/AttendanceDetailDrawer";
import AttendanceFilters from "../components/my-attendance/AttendanceFilters";
import { RefreshCw, CalendarDays, AlertTriangle, SlidersHorizontal } from "lucide-react";

// ─── Skeleton Loader ─────────────────────────────────────────────────────────
function SkeletonCard({ className = "" }) {
  return (
    <div
      className={`bg-white border border-slate-100 rounded-2xl animate-pulse ${className}`}
      aria-hidden="true"
    />
  );
}

function PageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} className="h-28" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <SkeletonCard className="h-52" />
          <SkeletonCard className="h-72" />
        </div>
        <SkeletonCard className="h-[480px]" />
      </div>
    </div>
  );
}

// ─── Error State ──────────────────────────────────────────────────────────────
function ErrorState({ onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 px-8 text-center">
      <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center">
        <AlertTriangle className="h-5 w-5 text-rose-500" />
      </div>
      <div className="space-y-1 max-w-xs">
        <p className="text-sm font-semibold text-slate-800">Couldn't load attendance data</p>
        <p className="text-xs text-slate-400 leading-relaxed">
          There was a problem fetching your records. Check your connection and try again.
        </p>
      </div>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 cursor-pointer"
      >
        <RefreshCw className="h-3.5 w-3.5" />
        Try again
      </button>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function MyAttendancePage() {
  const {
    currentYear,
    currentMonth,
    statusFilter,
    dateFrom,
    dateTo,
    listData,
    summaryData,
    trendData,
    calendarData,
    isLoading,
    isError,
    activeDrawerId,
    isFiltersOpen,
    setIsFiltersOpen,
    setActiveDrawerId,
    handleMonthChange,
    handleApplyFilters,
    handleResetFilters,
    handleRefreshAll,
  } = useMyAttendance();

  return (
    <div className="w-full min-h-screen bg-slate-50/70 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* ── Page Header ── */}
        <header className="flex items-center justify-between flex-wrap gap-4">
          <div className="space-y-1">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                <li>Home</li>
                <li aria-hidden="true" className="text-slate-300">/</li>
                <li>Attendance</li>
                <li aria-hidden="true" className="text-slate-300">/</li>
                <li className="text-slate-600">My Attendance</li>
              </ol>
            </nav>

            {/* Title */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm flex-shrink-0">
                <CalendarDays className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                My Attendance
              </h1>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFiltersOpen((v) => !v)}
              aria-pressed={isFiltersOpen}
              className={`
                inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-all
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 cursor-pointer
                ${isFiltersOpen
                  ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
                  : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 shadow-sm"
                }
              `}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Filters
            </button>

            <button
              onClick={handleRefreshAll}
              disabled={isLoading}
              aria-label="Refresh attendance data"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl hover:bg-slate-50 hover:border-slate-300 shadow-sm disabled:opacity-40 disabled:pointer-events-none transition-all focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-1 cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
              Sync
            </button>
          </div>
        </header>

        {/* ── Error ── */}
        {isError && (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">
            <ErrorState onRetry={handleRefreshAll} />
          </div>
        )}

        {/* ── Loading ── */}
        {!isError && isLoading && listData.length === 0 && <PageSkeleton />}

        {/* ── Content ── */}
        {!isError && !(isLoading && listData.length === 0) && (
          <div className="space-y-6">

            {/* Summary Cards */}
            <AttendanceSummaryCards summary={summaryData} />

            {/* Filters panel — collapsible */}
            <AttendanceFilters
              isOpen={isFiltersOpen}
              setIsOpen={setIsFiltersOpen}
              statusFilter={statusFilter}
              dateFrom={dateFrom}
              dateTo={dateTo}
              onApply={handleApplyFilters}
              onReset={handleResetFilters}
            />

            {/* Main two-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              {/* Left: Trends + Table */}
              <div className="lg:col-span-2 space-y-6">
                <AttendanceTrends trends={trendData} />
                <AttendanceListTable
                  records={listData}
                  onOpenDetail={setActiveDrawerId}
                />
              </div>

              {/* Right: Calendar */}
              <div className="lg:col-span-1 sticky top-6">
                <AttendanceCalendar
                  calendarData={calendarData}
                  currentMonth={currentMonth}
                  currentYear={currentYear}
                  onMonthChange={handleMonthChange}
                  onOpenDetail={setActiveDrawerId}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Detail drawer — portal/overlay */}
      <AttendanceDetailDrawer
        recordId={activeDrawerId}
        onClose={() => setActiveDrawerId(null)}
      />
    </div>
  );
}