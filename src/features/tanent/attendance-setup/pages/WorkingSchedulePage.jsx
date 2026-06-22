import React, { useState } from "react";
import {
  useGetCompanyScheduleQuery,
  useToggleCompanyScheduleMutation,
} from "../api/attendanceSetupApi";
import { ScheduleHeader } from "../components/schedules/ScheduleHeader";
import { ScheduleOverviewCard } from "../components/schedules/ScheduleOverviewCard";
import { ScheduleEmptyState } from "../components/schedules/ScheduleEmptyState";
import { WorkingScheduleForm } from "../components/schedules/WorkingScheduleForm";
import { ScheduleStatusCard } from "../components/schedules/ScheduleStatusCard";
import { AlertTriangle, RefreshCcw, Edit2 } from "lucide-react";

// ─── Loading Skeleton ─────────────────────────────────────────────────────────
function PageSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading schedule" className="animate-pulse p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="h-4 w-32 rounded bg-slate-200" />
        <div className="h-8 w-56 rounded bg-slate-200" />
        <div className="h-24 rounded-lg bg-slate-100" />
        <div className="h-40 rounded-lg bg-slate-100" />
      </div>
    </div>
  );
}

// ─── Error State ──────────────────────────────────────────────────────────────
function PageError({ onRetry }) {
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-red-100 bg-red-50 text-red-600" aria-hidden="true">
        <AlertTriangle className="h-4 w-4" />
      </div>
      <h2 className="text-base font-semibold text-slate-900 mb-2">Unable to load schedule settings</h2>
      <p className="text-sm text-slate-500 leading-relaxed mb-6"> We couldn't load your schedule settings right now. Your existing schedule remains in effect.</p>
      <button type="button" onClick={onRetry} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
        <RefreshCcw className="h-3.5 w-3.5" /> Retry
      </button>
    </div>
  );
}

function SectionLabel({ children, id }) {
  return <p id={id} className="mb-3 text-[11px] font-semibold uppercase tracking-[0.07em] text-slate-400">{children}</p>;
}

// ─── Read-Only Policy Summary ─────────────────────────────────────────────────
function SchedulePolicySummary({ schedule }) {
  const rows = [
    { label: "Working days", value: schedule.working_days?.join(", ") },
    { label: "Operational hours", value: `${schedule.work_start_time} – ${schedule.work_end_time}` },
    { label: "Break deduction", value: `${schedule.break_minutes} minutes` },
    { label: "Holiday integration", value: schedule.holiday_sync_enabled ? "Synchronized" : "Manual only" },
  ];

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-4">
        <p className="text-sm font-semibold text-slate-900">Current policy</p>
        <p className="mt-0.5 text-xs text-slate-400">Governs attendance calculations organization-wide</p>
      </div>
      <dl className="grid grid-cols-1 sm:grid-cols-2" aria-label="Schedule policy details">
        {rows.map(({ label, value }) => (
          <div key={label} className="flex items-baseline justify-between gap-4 border-b border-slate-50 px-5 py-3.5 last:border-0 sm:[&:nth-last-child(-n+2)]:border-0">
            <dt className="text-xs font-medium text-slate-500">{label}</dt>
            <dd className="text-sm font-semibold text-slate-900 capitalize">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

// ─── WorkingSchedulePage ──────────────────────────────────────────────────────
export default function WorkingSchedulePage() {
  const { data: responseBody, isLoading, error, refetch } = useGetCompanyScheduleQuery();
  const [toggleSchedule, { isLoading: isToggling }] = useToggleCompanyScheduleMutation();
  const [forceFormInitialization, setForceFormInitialization] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const schedule = responseBody?.data;
  const is404 = error?.status === 404 || error?.data?.message?.includes("not found");
  const hasSchedule = schedule && Object.keys(schedule).length > 0;

  const handleToggleState = async (nextActiveState) => {
    if (!hasSchedule) return;
    try {
      await toggleSchedule({ is_active: nextActiveState }).unwrap();
    } catch (err) {
      console.error("Enforcement phase mutation exception:", err);
    }
  };

  if (isLoading) return <PageSkeleton />;
  if (error && !is404) return <PageError onRetry={refetch} />;

  const isFormActive = isEditing || forceFormInitialization || !hasSchedule;

  return (
    <div className="min-h-full bg-slate-50/50">
      
      {/* Dynamic Conditional Header Section Layout */}
      {!isFormActive && (
        <div className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <p className="mb-1 text-[11px] font-medium text-slate-400 uppercase tracking-wider">Attendance Setup</p>
                <ScheduleHeader isActive={schedule?.is_active} hasSchedule={hasSchedule && !is404} />
                <p className="mt-2 text-sm text-slate-500 max-w-2xl">Define attendance rules and operational hours across your organization.</p>
              </div>

              {hasSchedule && !is404 && (
                <div className="flex items-center gap-2 shrink-0 sm:pt-1">
                  <button type="button" onClick={() => refetch()} className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
                    <RefreshCcw className="h-3.5 w-3.5" /> Refresh
                  </button>
                  <button type="button" onClick={() => setIsEditing(true)} className="inline-flex items-center gap-1.5 rounded-md bg-slate-900 px-3 py-2 text-xs font-medium text-white hover:bg-slate-800 transition-colors shadow-sm">
                    <Edit2 className="h-3.5 w-3.5" /> Edit schedule
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main App Content Layout Canvas Node */}
      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-8 pb-16 space-y-8">
        {is404 && !forceFormInitialization ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white px-6 py-10 text-center shadow-sm">
              <h2 className="text-base font-semibold text-slate-900 mb-1.5">No working schedule configured</h2>
              <p className="text-sm text-slate-500 leading-relaxed mb-6">Set up your organization's working schedule to begin tracking and evaluating attendance.</p>
              <ScheduleEmptyState onCreateInit={() => setForceFormInitialization(true)} isInitializing={isLoading} />
            </div>
          </div>
        ) : isFormActive ? (
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <WorkingScheduleForm
              existingSchedule={hasSchedule ? schedule : null}
              onSaveSuccess={() => {
                setIsEditing(false);
                setForceFormInitialization(false);
              }}
              onCancelEdit={() => {
                setIsEditing(false);
                setForceFormInitialization(false);
              }}
            />
          </div>
        ) : (
          <>
            {hasSchedule && (
              <section aria-labelledby="lbl-snapshot">
                <SectionLabel id="lbl-snapshot">Operational snapshot</SectionLabel>
                <ScheduleOverviewCard schedule={schedule} />
              </section>
            )}

            <section aria-labelledby="lbl-config">
              <SectionLabel id="lbl-config">Schedule configuration</SectionLabel>
              <SchedulePolicySummary schedule={schedule} />
            </section>

            {hasSchedule && (
              <section aria-labelledby="lbl-enforcement">
                <SectionLabel id="lbl-enforcement">Attendance enforcement</SectionLabel>
                <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                  <div className="border-b border-slate-100 px-5 py-4">
                    <p className="text-sm font-semibold text-slate-900">Enforcement status</p>
                    <p className="mt-0.5 text-xs text-slate-400">Control whether attendance evaluations are actively enforced across the organization</p>
                  </div>
                  <div className="px-5 py-5 bg-slate-50/40">
                    <ScheduleStatusCard isActive={schedule.is_active} onToggle={handleToggleState} isToggling={isToggling} />
                  </div>
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}