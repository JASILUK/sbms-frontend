/**
 * AttendanceListTable — fully responsive, no horizontal scroll.
 *
 * Strategy:
 *   xs  (< 640px)  → mobile cards only
 *   sm  (640–900px) → table: Date, Status, Hours, View  [4 cols]
 *   md  (900–1100px)→ table: + Check in / Check out     [6 cols]
 *   lg  (> 1100px) → table: + Late, Method              [8 cols]
 *
 * Props:
 *   records        — Array | { results, count, page_size, current_page } | ApiResponse
 *   isLoading      — boolean
 *   isError        — boolean
 *   onRetry        — () => void
 *   onPageChange   — (page: number) => void
 *   onSort         — (field: string, direction: "asc" | "desc") => void
 *   sortField      — string
 *   sortDirection  — "asc" | "desc"
 *   onOpenDetail   — (id: number) => void
 *   onResetFilters — () => void
 */

import React, { useState, useMemo, useCallback } from "react";
import {
  Eye, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  ArrowUpDown, ArrowUp, ArrowDown, Search, CalendarDays,
  AlertCircle, RefreshCw, Fingerprint, MapPin, QrCode,
  ScanFace, Smartphone, Monitor, Clock,
  CheckCircle2, XCircle, Coffee, Plane, CalendarCheck,
} from "lucide-react";
import {
  getStatusColor, getStatusLabel,
  formatDate, formatUtcToLocal, formatMinutesToHours,
} from "../../utils/attendanceHelpers";

/* ─── data helpers ──────────────────────────────────────────────────────────── */

function extractRecords(raw) {
  if (!raw) return [];
  if (raw?.success === true && raw?.data) {
    const d = raw.data;
    return Array.isArray(d) ? d : (d?.results ?? []);
  }
  if (Array.isArray(raw?.results)) return raw.results;
  if (Array.isArray(raw)) return raw;
  return [];
}

function extractPagination(raw) {
  const def = { count: 0, pageSize: 20, currentPage: 1, totalPages: 1 };
  if (!raw) return def;
  const src = (raw?.success === true && raw?.data) ? raw.data : raw;
  if (Array.isArray(src)) return { ...def, count: src.length };
  if (src?.count !== undefined) {
    const ps = src.page_size ?? 20;
    return { count: src.count, pageSize: ps, currentPage: src.current_page ?? 1,
             totalPages: Math.max(1, Math.ceil(src.count / ps)) };
  }
  return def;
}

function pageNumbers(current, total) {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, "…", total];
  if (current >= total - 2) return [1, "…", total - 2, total - 1, total];
  return [1, "…", current, "…", total];
}

/* ─── icon maps ─────────────────────────────────────────────────────────────── */

const METHOD_ICON  = { FACE: ScanFace, GPS: MapPin, QR: QrCode, BIOMETRIC: Fingerprint, MOBILE: Smartphone, WEB: Monitor };
const METHOD_LABEL = { FACE: "Face ID", GPS: "GPS", QR: "QR code", BIOMETRIC: "Biometric", MOBILE: "Mobile", WEB: "Web" };
const STATUS_ICON  = { PRESENT: CheckCircle2, ABSENT: XCircle, LATE: Clock, LEAVE: Plane, HALF_DAY: Coffee, WEEKEND: CalendarCheck, HOLIDAY: CalendarDays };

/* ─── atoms ─────────────────────────────────────────────────────────────────── */

function StatusBadge({ status }) {
  const colors = getStatusColor(status);
  const label  = getStatusLabel(status);
  const Icon   = STATUS_ICON[status] ?? CalendarDays;
  return (
    <span className={`inline-flex items-center gap-1 rounded-lg border px-2 py-1
      text-[11px] font-bold uppercase tracking-wide whitespace-nowrap
      ${colors.bg} ${colors.text} ${colors.border}`}>
      <Icon className="h-3 w-3 flex-shrink-0" />
      {label}
    </span>
  );
}

function MethodChip({ method }) {
  const key  = (method || "").toUpperCase().split(",")[0].trim();
  const Icon = METHOD_ICON[key] ?? Monitor;
  const lbl  = METHOD_LABEL[key] ?? method ?? "—";
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-slate-100
      border border-slate-200/60 px-2 py-1 text-[10px] font-semibold text-slate-600 whitespace-nowrap">
      <Icon className="h-3 w-3 flex-shrink-0" />
      {lbl}
    </span>
  );
}

function Mono({ children, empty = false }) {
  if (empty || !children) return <span className="text-slate-300 text-xs">—</span>;
  return <span className="text-xs font-mono text-slate-600 whitespace-nowrap">{children}</span>;
}

function SortTh({ field, active, direction, onClick, children, className = "" }) {
  return (
    <th className={`px-3 py-3 ${className}`}>
      <button type="button" onClick={() => onClick(field)}
        className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest
          text-slate-400 hover:text-slate-700 transition-colors focus:outline-none whitespace-nowrap">
        {children}
        {active
          ? direction === "asc"
            ? <ArrowUp   className="h-3 w-3 text-slate-600" />
            : <ArrowDown className="h-3 w-3 text-slate-600" />
          : <ArrowUpDown className="h-3 w-3 text-slate-300" />}
      </button>
    </th>
  );
}

function PlainTh({ children, className = "" }) {
  return (
    <th className={`px-3 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 ${className}`}>
      {children}
    </th>
  );
}

/* ─── states ─────────────────────────────────────────────────────────────────── */

function EmptyState({ hasFilters, onReset }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100
        flex items-center justify-center mb-3">
        <CalendarDays className="h-7 w-7 text-slate-300" />
      </div>
      <p className="text-sm font-semibold text-slate-700">No records found</p>
      <p className="text-xs text-slate-400 mt-1 max-w-[220px] leading-relaxed">
        {hasFilters
          ? "No records match these filters. Try a different date range or status."
          : "No attendance records for this period."}
      </p>
      {hasFilters && onReset && (
        <button onClick={onReset}
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900
            hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer">
          <RefreshCw className="h-3.5 w-3.5" /> Clear filters
        </button>
      )}
    </div>
  );
}

function ErrorState({ onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100
        flex items-center justify-center mb-3">
        <AlertCircle className="h-7 w-7 text-rose-400" />
      </div>
      <p className="text-sm font-semibold text-slate-700">Failed to load records</p>
      <p className="text-xs text-slate-400 mt-1 max-w-[220px] leading-relaxed">
        Something went wrong. Check your connection.
      </p>
      {onRetry && (
        <button onClick={onRetry}
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900
            hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer">
          <RefreshCw className="h-3.5 w-3.5" /> Try again
        </button>
      )}
    </div>
  );
}

function SkeletonRow({ cols }) {
  const widths = ["w-20", "w-24", "w-14", "w-16", "w-14", "w-12", "w-16", "w-8"];
  return (
    <tr className="animate-pulse border-b border-slate-50">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-3 py-3.5">
          <div className={`h-4 rounded-md bg-slate-100 ${widths[i] ?? "w-16"}`} />
        </td>
      ))}
    </tr>
  );
}

/* ─── mobile card ────────────────────────────────────────────────────────────── */

function MobileCard({ record, onOpenDetail }) {
  return (
    <div
      role="button" tabIndex={0}
      onClick={() => onOpenDetail?.(record.id)}
      onKeyDown={(e) => e.key === "Enter" && onOpenDetail?.(record.id)}
      className="flex items-start justify-between gap-3 px-4 py-3.5
        hover:bg-slate-50 cursor-pointer transition-colors
        focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500"
    >
      <div className="min-w-0 space-y-1.5 flex-1">
        {/* Date row */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-800">{formatDate(record.attendance_date)}</span>
          <span className="text-[10px] text-slate-400">
            {new Date(record.attendance_date + "T00:00:00").toLocaleDateString("en-US", { weekday: "short" })}
          </span>
        </div>

        {/* Badge */}
        <StatusBadge status={record.attendance_status} />

        {/* Time + hours row */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
          {record.first_check_in_at && (
            <span>In <span className="font-mono font-semibold text-slate-700">{formatUtcToLocal(record.first_check_in_at)}</span></span>
          )}
          {record.last_check_out_at && (
            <span>Out <span className="font-mono font-semibold text-slate-700">{formatUtcToLocal(record.last_check_out_at)}</span></span>
          )}
          {record.total_work_minutes > 0 && (
            <span className="font-semibold text-slate-700">{formatMinutesToHours(record.total_work_minutes)}</span>
          )}
          {record.late_minutes > 0 && (
            <span className="flex items-center gap-0.5 text-amber-600 font-semibold">
              <Clock className="h-3 w-3" />
              {formatMinutesToHours(record.late_minutes)} late
            </span>
          )}
        </div>
      </div>

      {/* View button */}
      <button
        onClick={(e) => { e.stopPropagation(); onOpenDetail?.(record.id); }}
        aria-label="View details"
        className="flex-shrink-0 p-2 rounded-lg border border-slate-200 text-slate-400
          hover:border-slate-300 hover:text-slate-700 transition-all"
      >
        <Eye className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

/* ─── main ───────────────────────────────────────────────────────────────────── */

export default function AttendanceListTable({
  records:      recordsProp,
  isLoading     = false,
  isError       = false,
  onRetry,
  onPageChange,
  onSort,
  sortField,
  sortDirection = "desc",
  onOpenDetail,
  onResetFilters,
}) {
  const [search, setSearch] = useState("");

  const records    = useMemo(() => extractRecords(recordsProp),    [recordsProp]);
  const pagination = useMemo(() => extractPagination(recordsProp), [recordsProp]);

  const visible = useMemo(() => {
    if (!search.trim()) return records;
    const q = search.toLowerCase();
    return records.filter((r) =>
      (r.attendance_date   || "").includes(q) ||
      (r.attendance_status || "").toLowerCase().includes(q)
    );
  }, [records, search]);

  const handleSort = useCallback((field) => {
    const dir = sortField === field && sortDirection === "desc" ? "asc" : "desc";
    onSort?.(field, dir);
  }, [sortField, sortDirection, onSort]);

  const goPage = useCallback((p) => {
    if (p >= 1 && p <= pagination.totalPages) onPageChange?.(p);
  }, [onPageChange, pagination.totalPages]);

  const startItem = (pagination.currentPage - 1) * pagination.pageSize + 1;
  const endItem   = Math.min(pagination.currentPage * pagination.pageSize, pagination.count);
  const hasFilters = !!search;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

      {/* ── Header ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-4 py-4 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Attendance Records</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {pagination.count > 0 ? `Showing ${startItem}–${endItem} of ${pagination.count}` : "No entries"}
          </p>
        </div>
        <div className="relative w-full sm:w-56">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          <input
            type="search"
            placeholder="Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl
              text-slate-700 placeholder-slate-400 focus:outline-none focus:border-slate-300
              focus:bg-white focus:ring-2 focus:ring-slate-100 transition-all"
          />
        </div>
      </div>

      {/* ── Body ── */}
      {isError ? (
        <ErrorState onRetry={onRetry} />
      ) : isLoading && records.length === 0 ? (
        <>
          {/* Mobile skeleton */}
          <div className="sm:hidden divide-y divide-slate-50">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="px-4 py-4 animate-pulse space-y-2">
                <div className="h-3.5 w-24 bg-slate-100 rounded" />
                <div className="h-5 w-20 bg-slate-100 rounded-lg" />
                <div className="h-3 w-40 bg-slate-100 rounded" />
              </div>
            ))}
          </div>
          {/* Desktop skeleton */}
          <div className="hidden sm:block">
            <table className="w-full table-fixed text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  {["Date", "Status", "In", "Out", "Hours", "Method", ""].map((h, i) => (
                    <th key={i} className="px-3 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} cols={7} />)}
              </tbody>
            </table>
          </div>
        </>
      ) : visible.length === 0 ? (
        <EmptyState hasFilters={hasFilters} onReset={hasFilters ? () => setSearch("") : onResetFilters} />
      ) : (
        <>
          {/* ── Mobile cards (< sm) ── */}
          <div className="sm:hidden divide-y divide-slate-50/80">
            {visible.map((r) => <MobileCard key={r.id} record={r} onOpenDetail={onOpenDetail} />)}
          </div>

          {/* ── Responsive table (≥ sm) ── */}
          {/*
            Column visibility by breakpoint (all within viewport width, zero scroll):
              sm:   Date · Status · Hours · [action]
              md:   + Check In · Check Out
              lg:   + Late · Method
          */}
          <div className="hidden sm:block">
            <table className="w-full table-fixed text-left">
              <colgroup>
                {/* Date */}       <col className="w-[22%]" />
                {/* Status */}     <col className="w-[18%]" />
                {/* Check in */}   <col className="hidden md:table-column w-[14%]" />
                {/* Check out */}  <col className="hidden md:table-column w-[14%]" />
                {/* Hours */}      <col className="w-[12%]" />
                {/* Late */}       <col className="hidden lg:table-column w-[11%]" />
                {/* Method */}     <col className="hidden lg:table-column w-[13%]" />
                {/* Action */}     <col className="w-[9%]" />
              </colgroup>

              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  <SortTh field="attendance_date" active={sortField === "attendance_date"} direction={sortDirection} onClick={handleSort}>
                    Date
                  </SortTh>

                  <PlainTh>Status</PlainTh>

                  <PlainTh className="hidden md:table-cell">Check in</PlainTh>
                  <PlainTh className="hidden md:table-cell">Check out</PlainTh>

                  <SortTh field="total_work_minutes" active={sortField === "total_work_minutes"} direction={sortDirection} onClick={handleSort}>
                    Hours
                  </SortTh>

                  <PlainTh className="hidden lg:table-cell">Late</PlainTh>
                  <PlainTh className="hidden lg:table-cell">Method</PlainTh>

                  <th className="px-3 py-3"><span className="sr-only">View</span></th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">
                {visible.map((record) => (
                  <tr
                    key={record.id}
                    onClick={() => onOpenDetail?.(record.id)}
                    className="group cursor-pointer hover:bg-slate-50/70 transition-colors"
                  >
                    {/* Date */}
                    <td className="px-3 py-3.5">
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-slate-800 truncate">
                          {formatDate(record.attendance_date)}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(record.attendance_date + "T00:00:00")
                            .toLocaleDateString("en-US", { weekday: "short" })}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-3 py-3.5">
                      <StatusBadge status={record.attendance_status} />
                    </td>

                    {/* Check in — md+ */}
                    <td className="hidden md:table-cell px-3 py-3.5">
                      <Mono empty={!record.first_check_in_at}>
                        {formatUtcToLocal(record.first_check_in_at)}
                      </Mono>
                    </td>

                    {/* Check out — md+ */}
                    <td className="hidden md:table-cell px-3 py-3.5">
                      <Mono empty={!record.last_check_out_at}>
                        {formatUtcToLocal(record.last_check_out_at)}
                      </Mono>
                    </td>

                    {/* Hours */}
                    <td className="px-3 py-3.5">
                      {record.total_work_minutes > 0
                        ? <span className="text-xs font-bold text-slate-700">{formatMinutesToHours(record.total_work_minutes)}</span>
                        : <span className="text-xs text-slate-300">—</span>}
                    </td>

                    {/* Late — lg+ */}
                    <td className="hidden lg:table-cell px-3 py-3.5">
                      {record.late_minutes > 0
                        ? <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600">
                            <Clock className="h-3 w-3" />
                            {formatMinutesToHours(record.late_minutes)}
                          </span>
                        : <span className="text-xs text-slate-300">—</span>}
                    </td>

                    {/* Method — lg+ */}
                    <td className="hidden lg:table-cell px-3 py-3.5">
                      {record.attendance_method_summary
                        ? <MethodChip method={record.attendance_method_summary} />
                        : <span className="text-xs text-slate-300">—</span>}
                    </td>

                    {/* View */}
                    <td className="px-3 py-3.5 text-right">
                      <button
                        onClick={(e) => { e.stopPropagation(); onOpenDetail?.(record.id); }}
                        aria-label="View details"
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg
                          border border-slate-200 text-slate-400 bg-white
                          opacity-0 group-hover:opacity-100 focus-visible:opacity-100
                          hover:border-slate-900 hover:bg-slate-900 hover:text-white
                          transition-all active:scale-95 focus:outline-none
                          focus-visible:ring-2 focus-visible:ring-slate-900 cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ── Pagination ── */}
      {!isError && pagination.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3
          px-4 py-3.5 border-t border-slate-100 bg-slate-50/30">

          <span className="text-[11px] text-slate-400 order-2 sm:order-1">
            Page{" "}
            <span className="font-bold text-slate-700">{pagination.currentPage}</span>
            {" "}of{" "}
            <span className="font-bold text-slate-700">{pagination.totalPages}</span>
          </span>

          <div className="flex items-center gap-1 order-1 sm:order-2">
            <button onClick={() => goPage(1)} disabled={pagination.currentPage <= 1}
              aria-label="First page"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200
                text-slate-400 hover:bg-slate-100 hover:text-slate-700
                disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer">
              <ChevronsLeft className="h-3.5 w-3.5" />
            </button>

            <button onClick={() => goPage(pagination.currentPage - 1)} disabled={pagination.currentPage <= 1}
              aria-label="Previous page"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200
                text-slate-400 hover:bg-slate-100 hover:text-slate-700
                disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer">
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>

            {pageNumbers(pagination.currentPage, pagination.totalPages).map((p, i) =>
              p === "…"
                ? <span key={`e${i}`} className="flex h-8 w-8 items-center justify-center text-xs text-slate-400">…</span>
                : <button key={p} onClick={() => goPage(p)}
                    aria-label={`Page ${p}`}
                    aria-current={p === pagination.currentPage ? "page" : undefined}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold
                      transition-all cursor-pointer
                      ${p === pagination.currentPage
                        ? "bg-slate-900 text-white shadow-sm"
                        : "border border-slate-200 text-slate-600 hover:bg-slate-100"}`}>
                    {p}
                  </button>
            )}

            <button onClick={() => goPage(pagination.currentPage + 1)} disabled={pagination.currentPage >= pagination.totalPages}
              aria-label="Next page"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200
                text-slate-400 hover:bg-slate-100 hover:text-slate-700
                disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer">
              <ChevronRight className="h-3.5 w-3.5" />
            </button>

            <button onClick={() => goPage(pagination.totalPages)} disabled={pagination.currentPage >= pagination.totalPages}
              aria-label="Last page"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200
                text-slate-400 hover:bg-slate-100 hover:text-slate-700
                disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer">
              <ChevronsRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}