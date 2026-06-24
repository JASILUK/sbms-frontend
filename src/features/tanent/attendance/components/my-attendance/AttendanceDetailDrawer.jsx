/**
 * AttendanceDetailDrawer — right slide-in detail panel.
 *
 * Props:
 *   recordId: number | null
 *   onClose:  () => void
 */

import React, { useEffect, useMemo } from "react";
import {
  X,
  LogIn,
  LogOut,
  Coffee,
  Briefcase,
  MapPin,
  Clock,
  Timer,
  Zap,
  AlertTriangle,
  CalendarDays,
  ShieldCheck,
  RotateCcw,
  Fingerprint,
  ScanFace,
  QrCode,
  Smartphone,
  Monitor,
  Sun,
} from "lucide-react";
import { useGetMyAttendanceDetailQuery } from "../../api/attendanceApi";
import {
  formatDate,
  formatUtcToLocal,
  formatMinutesToHours,
  getStatusColor,
  getStatusLabel,
} from "../../utils/attendanceHelpers";

/* ── config ─────────────────────────────────────────────────────────────────── */

const TIMELINE_CONFIG = {
  CHECK_IN: {
    Icon: LogIn,
    label: "Check in",
    dotBg: "bg-emerald-500",
    ring:  "ring-emerald-100",
    text:  "text-emerald-700",
  },
  CHECK_OUT: {
    Icon: LogOut,
    label: "Check out",
    dotBg: "bg-rose-500",
    ring:  "ring-rose-100",
    text:  "text-rose-700",
  },
  BREAK_OUT: {
    Icon: Coffee,
    label: "Break out",
    dotBg: "bg-amber-400",
    ring:  "ring-amber-100",
    text:  "text-amber-700",
  },
  BREAK_IN: {
    Icon: Briefcase,
    label: "Break in",
    dotBg: "bg-indigo-500",
    ring:  "ring-indigo-100",
    text:  "text-indigo-700",
  },
};

const METHOD_ICON = {
  FACE:      ScanFace,
  GPS:       MapPin,
  QR:        QrCode,
  BIOMETRIC: Fingerprint,
  MOBILE:    Smartphone,
  WEB:       Monitor,
};

/* ── sub-components ─────────────────────────────────────────────────────────── */

function MetricCard({ Icon, label, value, accent = false }) {
  return (
    <div
      className={`flex items-center gap-3 rounded-xl border p-3.5 transition-all
        ${accent
          ? "border-amber-200 bg-amber-50/60"
          : "border-slate-100 bg-slate-50/50"
        }`}
    >
      <div
        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg
          ${accent ? "bg-amber-100" : "bg-white border border-slate-100"}`}
      >
        <Icon className={`h-4 w-4 ${accent ? "text-amber-600" : "text-slate-400"}`} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 leading-none mb-0.5">
          {label}
        </p>
        <p className={`text-sm font-bold truncate leading-tight
          ${accent ? "text-amber-700" : "text-slate-800"}`}>
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

function FlagPill({ label, className }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1
        text-[10px] font-bold uppercase tracking-wide ${className}`}
    >
      {label}
    </span>
  );
}

function TimelineEvent({ event, isLast }) {
  const cfg = TIMELINE_CONFIG[event.event_type] ?? {
    Icon:  Clock,
    label: event.event_type,
    dotBg: "bg-slate-400",
    ring:  "ring-slate-100",
    text:  "text-slate-600",
  };
  const { Icon } = cfg;
  const MethodIcon = METHOD_ICON[(event.attendance_method || "").toUpperCase()] ?? Monitor;

  return (
    <div className="relative flex gap-4">
      {!isLast && (
        <div className="absolute left-[19px] top-10 bottom-0 w-px bg-slate-200" />
      )}

      <div
        className={`relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center
          rounded-full ${cfg.dotBg} ring-4 ${cfg.ring}`}
      >
        <Icon className="h-4 w-4 text-white" />
      </div>

      <div className="flex-1 pb-6">
        <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between">
          <span className={`text-sm font-bold ${cfg.text}`}>{cfg.label}</span>
          <span className="text-xs font-mono font-semibold text-slate-500">
            {formatUtcToLocal(event.event_time)}
          </span>
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          {event.attendance_method && (
            <span className="inline-flex items-center gap-1 rounded-md bg-slate-100
              px-2 py-0.5 text-[10px] font-semibold text-slate-600">
              <MethodIcon className="h-3 w-3" />
              {event.attendance_method}
            </span>
          )}
          {event.location_name && (
            <span className="inline-flex items-center gap-1 text-[10px] text-slate-400">
              <MapPin className="h-3 w-3" />
              {event.location_name}
            </span>
          )}
        </div>
        {event.notes && (
          <p className="mt-1.5 text-[11px] italic text-slate-400">{event.notes}</p>
        )}
      </div>
    </div>
  );
}

function DrawerSkeleton() {
  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-5">
      <div className="h-14 rounded-xl bg-slate-100 animate-pulse" />
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-16 rounded-xl bg-slate-100 animate-pulse" />
        ))}
      </div>
      <div className="h-48 rounded-xl bg-slate-100 animate-pulse" />
    </div>
  );
}

function DrawerError({ onRetry }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
      <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100
        flex items-center justify-center mb-4">
        <AlertTriangle className="h-8 w-8 text-rose-400" />
      </div>
      <p className="text-sm font-bold text-slate-800">Failed to load details</p>
      <p className="text-xs text-slate-400 mt-1 max-w-[200px] leading-relaxed">
        Could not fetch this attendance record.
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800
            text-white text-xs font-semibold rounded-xl shadow-sm transition-all cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Retry
        </button>
      )}
    </div>
  );
}

/* ── main ────────────────────────────────────────────────────────────────────── */

export default function AttendanceDetailDrawer({ recordId, onClose }) {
  const {
    data: rawData,
    isLoading,
    isError,
    refetch,
  } = useGetMyAttendanceDetailQuery(recordId, {
    skip: !recordId,
    refetchOnMountOrArgChange: true,
  });

  const payload  = rawData?.data ?? rawData;
  const record   = payload?.daily_record;
  const timeline = payload?.timeline ?? [];

  const colors = useMemo(() => getStatusColor(record?.attendance_status), [record]);

  /* Escape key */
  useEffect(() => {
    if (!recordId) return;
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [recordId, onClose]);

  /* Scroll lock */
  useEffect(() => {
    document.body.style.overflow = recordId ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [recordId]);

  if (!recordId) return null;

  const isLate      = record?.is_late || record?.late_minutes > 0;
  const isEarlyExit = record?.is_early_exit || record?.early_exit_minutes > 0;
  const hasOvertime = record?.overtime_minutes > 0;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-[2px] transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Attendance record details"
        className="fixed right-0 top-0 z-50 flex h-full w-full flex-col bg-white shadow-2xl
          sm:w-[440px] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4 flex-shrink-0">
          <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${colors?.bg ?? "bg-slate-100"}`}>
            <CalendarDays className={`h-5 w-5 ${colors?.text ?? "text-slate-500"}`} />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-bold text-slate-900 leading-tight truncate">
              {record ? formatDate(record.attendance_date) : "Loading…"}
            </h2>
            {record && (
              <span
                className={`mt-0.5 inline-flex rounded-full border px-2 py-0.5
                  text-[10px] font-bold uppercase tracking-wide
                  ${colors?.bg} ${colors?.text} ${colors?.border}`}
              >
                {getStatusLabel(record.attendance_status)}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close panel"
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl
              text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all
              focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        {isLoading ? (
          <DrawerSkeleton />
        ) : isError ? (
          <DrawerError onRetry={refetch} />
        ) : (
          <div className="flex-1 overflow-y-auto p-5 space-y-5">

            {/* Flag pills */}
            {(isLate || isEarlyExit || record?.is_half_day || hasOvertime || record?.needs_review || record?.is_auto_closed) && (
              <div className="flex flex-wrap gap-2">
                {isLate && (
                  <FlagPill label="Late arrival" className="bg-amber-50 border-amber-200 text-amber-700" />
                )}
                {isEarlyExit && (
                  <FlagPill label="Early exit" className="bg-rose-50 border-rose-200 text-rose-700" />
                )}
                {record?.is_half_day && (
                  <FlagPill label="Half day" className="bg-orange-50 border-orange-200 text-orange-700" />
                )}
                {hasOvertime && (
                  <FlagPill label="Overtime" className="bg-violet-50 border-violet-200 text-violet-700" />
                )}
                {record?.needs_review && (
                  <FlagPill label="Needs review" className="bg-red-50 border-red-200 text-red-700" />
                )}
                {record?.is_auto_closed && (
                  <FlagPill label="Auto-closed" className="bg-slate-100 border-slate-200 text-slate-500" />
                )}
              </div>
            )}

            {/* Review reason banner */}
            {record?.review_reason && (
              <div className="flex gap-2.5 rounded-xl border border-amber-200 bg-amber-50/60 p-3.5">
                <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-amber-800 mb-0.5">Review required</p>
                  <p className="text-xs text-amber-700 leading-relaxed">{record.review_reason}</p>
                </div>
              </div>
            )}

            {/* Metrics grid */}
            <div className="grid grid-cols-2 gap-2.5">
              <MetricCard Icon={LogIn}       label="Check in"    value={formatUtcToLocal(record?.first_check_in_at)} />
              <MetricCard Icon={LogOut}      label="Check out"   value={formatUtcToLocal(record?.last_check_out_at)} />
              <MetricCard Icon={Timer}       label="Work hours"  value={formatMinutesToHours(record?.total_work_minutes)} />
              <MetricCard Icon={ShieldCheck} label="Required"    value={formatMinutesToHours(record?.required_work_minutes)} />
              <MetricCard
                Icon={Clock}
                label="Late"
                value={isLate ? formatMinutesToHours(record.late_minutes) : "On time"}
                accent={isLate}
              />
              <MetricCard
                Icon={Sun}
                label="Early exit"
                value={isEarlyExit ? formatMinutesToHours(record.early_exit_minutes) : "None"}
                accent={isEarlyExit}
              />
              <MetricCard Icon={Coffee}      label="Break"       value={formatMinutesToHours(record?.total_break_minutes)} />
              <MetricCard Icon={Zap}         label="Overtime"    value={formatMinutesToHours(record?.overtime_minutes)} />
            </div>

            {/* Method chip */}
            {record?.attendance_method_summary && (
              <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-slate-100">
                  <Monitor className="h-4 w-4 text-slate-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Method</p>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">{record.attendance_method_summary}</p>
                </div>
              </div>
            )}

            {/* Timeline */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px flex-1 bg-slate-100" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex-shrink-0">
                  Activity timeline
                </span>
                <div className="h-px flex-1 bg-slate-100" />
              </div>

              {timeline.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl bg-slate-50 py-8">
                  <Clock className="h-8 w-8 text-slate-300" />
                  <p className="mt-2 text-xs text-slate-400">No activity recorded</p>
                </div>
              ) : (
                <div className="pl-2">
                  {timeline.map((event, idx) => (
                    <TimelineEvent
                      key={`${event.event_type}-${idx}`}
                      event={event}
                      isLast={idx === timeline.length - 1}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Footer meta */}
            <div className="rounded-xl border border-slate-100 bg-slate-50/30 divide-y divide-slate-100">
              {record?.source && (
                <div className="flex items-center justify-between px-3.5 py-2.5 text-[11px]">
                  <span className="text-slate-400">Source</span>
                  <span className="font-mono font-semibold text-slate-600">{record.source}</span>
                </div>
              )}
              {record?.finalized_at && (
                <div className="flex items-center justify-between px-3.5 py-2.5 text-[11px]">
                  <span className="text-slate-400">Finalized</span>
                  <span className="font-mono font-semibold text-slate-600">{formatUtcToLocal(record.finalized_at)}</span>
                </div>
              )}
              <div className="flex items-center justify-between px-3.5 py-2.5 text-[11px]">
                <span className="text-slate-400">Record ID</span>
                <span className="font-mono font-semibold text-slate-600">#{record?.id}</span>
              </div>
            </div>

          </div>
        )}
      </div>
    </>
  );
}