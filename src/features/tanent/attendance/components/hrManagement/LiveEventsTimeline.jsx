import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, LogOut, Coffee, MapPin, ScanFace, Fingerprint, Pencil } from "lucide-react";
import { relativeTime } from "./relativeTime";
import { TimelineSkeleton } from "./Skeletons";
import EmptyState from "./EmptyState";
import ErrorState from "./ErrorState";

const EVENT_ICONS = {
  CHECK_IN: LogIn,
  CHECK_OUT: LogOut,
  BREAK_OUT: Coffee,
  BREAK_IN: Coffee,
};

const METHOD_ICONS = {
  MANUAL: Pencil,
  GPS: MapPin,
  FACE: ScanFace,
  BIOMETRIC: Fingerprint,
};

/**
 * Recent attendance events across the company, newest first.
 * `events` should be a flattened list with: employee_name, department,
 * event_type, event_time, attendance_method, location_name.
 */
export default function LiveEventsTimeline({ events, isLoading, isError, onRetry }) {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
        <TimelineSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
        <ErrorState message="Live events couldn't be loaded." onRetry={onRetry} />
      </div>
    );
  }

  if (!events?.length) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
        <EmptyState title="No recent activity" description="Punch events will appear here as they happen." />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
      <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Live Events</h3>
      <div className="mt-4 max-h-[420px] space-y-0 overflow-y-auto pr-1">
        <AnimatePresence initial={false}>
          {events.map((event, idx) => {
            const EventIcon = EVENT_ICONS[event.event_type] || LogIn;
            const MethodIcon = METHOD_ICONS[event.attendance_method?.toUpperCase()] || Pencil;
            return (
              <motion.div
                key={event.id ?? idx}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: Math.min(idx, 10) * 0.03 }}
                className="relative flex gap-3 pb-5 last:pb-0"
              >
                {idx !== events.length - 1 && (
                  <span className="absolute left-[15px] top-8 h-full w-px bg-neutral-200 dark:bg-neutral-800" />
                )}
                <div className="z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-100 ring-4 ring-white dark:bg-neutral-800 dark:ring-neutral-900">
                  <EventIcon className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {event.employee_name || "Employee"}{" "}
                    <span className="font-normal text-neutral-400">
                      · {event.department || "—"}
                    </span>
                  </p>
                  <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-500 dark:text-neutral-400">
                    <span className="inline-flex items-center gap-1">
                      <MethodIcon className="h-3 w-3" /> {event.attendance_method}
                    </span>
                    {event.location_name && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {event.location_name}
                      </span>
                    )}
                    <span>{relativeTime(event.event_time)}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
