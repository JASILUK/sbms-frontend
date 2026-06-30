import React from "react";
import { motion } from "framer-motion";
import { LogIn, LogOut, Coffee, MapPin, Pencil, Smartphone, ScanFace, Fingerprint } from "lucide-react";
import { TimelineSkeleton } from "./Skeletons";
import EmptyState from "./EmptyState";

const EVENT_META = {
  CHECK_IN: { icon: LogIn, label: "Checked In", color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" },
  CHECK_OUT: { icon: LogOut, label: "Checked Out", color: "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300" },
  BREAK_OUT: { icon: Coffee, label: "Break Started", color: "bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400" },
  BREAK_IN: { icon: Coffee, label: "Break Ended", color: "bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" },
};

const METHOD_ICONS = { MANUAL: Pencil, GPS: MapPin, FACE: ScanFace, BIOMETRIC: Fingerprint, MOBILE: Smartphone };

function formatTime(value) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return value;
  }
}

/**
 * Vertical event timeline used inside the record Drawer.
 * `events` items follow AttendanceTimelineSerializer:
 * { event_type, event_time, attendance_method, location_name, notes }
 */
export default function AttendanceTimeline({ events, isLoading }) {
  if (isLoading) return <TimelineSkeleton />;
  if (!events?.length) {
    return <EmptyState title="No punch events" description="No check-ins or check-outs recorded for this day." />;
  }

  return (
    <div className="space-y-0">
      {events.map((event, idx) => {
        const meta = EVENT_META[event.event_type] || EVENT_META.CHECK_IN;
        const MethodIcon = METHOD_ICONS[event.attendance_method?.toUpperCase()] || Pencil;
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, delay: idx * 0.05 }}
            className="relative flex gap-3.5 pb-6 last:pb-0"
          >
            {idx !== events.length - 1 && (
              <span className="absolute left-[17px] top-9 h-full w-px bg-neutral-200 dark:bg-neutral-800" />
            )}
            <div className={`z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${meta.color}`}>
              <meta.icon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1 rounded-xl border border-neutral-100 bg-neutral-50/60 p-3 dark:border-neutral-800 dark:bg-neutral-900/40">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{meta.label}</p>
                <span className="shrink-0 text-xs tabular-nums text-neutral-400">{formatTime(event.event_time)}</span>
              </div>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500 dark:text-neutral-400">
                <span className="inline-flex items-center gap-1">
                  <MethodIcon className="h-3 w-3" /> {event.attendance_method || "Manual"}
                </span>
                {event.location_name && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {event.location_name}
                  </span>
                )}
              </div>
              {event.notes && (
                <p className="mt-1.5 text-xs italic text-neutral-500 dark:text-neutral-400">"{event.notes}"</p>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
