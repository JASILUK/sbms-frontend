import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import { getStatusColor } from "../../utils/attendanceHelpers";

const STATUS_META = {
  PRESENT:  { label: "Present",  dot: "#22c55e", bg: "bg-emerald-50",   text: "text-emerald-700", ring: "ring-emerald-200" },
  ABSENT:   { label: "Absent",   dot: "#ef4444", bg: "bg-rose-50",      text: "text-rose-600",    ring: "ring-rose-200"    },
  LATE:     { label: "Late",     dot: "#f59e0b", bg: "bg-amber-50",     text: "text-amber-700",   ring: "ring-amber-200"   },
  LEAVE:    { label: "Leave",    dot: "#818cf8", bg: "bg-indigo-50",    text: "text-indigo-600",  ring: "ring-indigo-200"  },
  HOLIDAY:  { label: "Holiday",  dot: "#06b6d4", bg: "bg-cyan-50",      text: "text-cyan-700",    ring: "ring-cyan-200"    },
  WEEKEND:  { label: "Weekend",  dot: "#94a3b8", bg: "bg-slate-50",     text: "text-slate-400",   ring: "ring-slate-100"   },
};

function StatusDot({ status }) {
  const meta = STATUS_META[status] || STATUS_META.ABSENT;
  return (
    <span
      style={{ background: meta.dot }}
      className="inline-block w-1.5 h-1.5 rounded-full flex-shrink-0"
      aria-hidden="true"
    />
  );
}

export default function AttendanceCalendar({
  calendarData,
  currentMonth,
  currentYear,
  onMonthChange,
  onOpenDetail,
}) {
  const [tooltip, setTooltip] = useState(null);

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];

  const handlePrevMonth = () => {
    if (currentMonth === 1) onMonthChange(12, currentYear - 1);
    else onMonthChange(currentMonth - 1, currentYear);
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) onMonthChange(1, currentYear + 1);
    else onMonthChange(currentMonth + 1, currentYear);
  };

  const safeCalendarArray = Array.isArray(calendarData)
    ? calendarData
    : calendarData?.records || calendarData?.data || [];

  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth - 1, 1).getDay();
  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const todayStr = new Date().toISOString().split("T")[0];

  const resolveStatus = (dayMatch) => {
    if (!dayMatch) return "ABSENT";
    if (dayMatch.is_weekend) return "WEEKEND";
    if (dayMatch.is_holiday) return "HOLIDAY";
    if (dayMatch.is_leave) return "LEAVE";
    if (dayMatch.is_late) return "LATE";
    return dayMatch.status || "ABSENT";
  };

  // Build legend counts
  const statusCounts = {};
  for (let day = 1; day <= daysInMonth; day++) {
    const dayStr = `${currentYear}-${String(currentMonth).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
    const match = safeCalendarArray.find((c) => c?.date === dayStr);
    const s = resolveStatus(match);
    statusCounts[s] = (statusCounts[s] || 0) + 1;
  }

  const cells = [];

  // Empty leading cells
  for (let i = 0; i < firstDayIndex; i++) {
    cells.push(
      <div
        key={`e-${i}`}
        className="aspect-square rounded-xl"
        aria-hidden="true"
      />
    );
  }

  // Day cells
  for (let day = 1; day <= daysInMonth; day++) {
    const dayStr = `${currentYear}-${String(currentMonth).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
    const dayMatch = safeCalendarArray.find((c) => c?.date === dayStr);
    const status = resolveStatus(dayMatch);
    const meta = STATUS_META[status] || STATUS_META.ABSENT;
    const isToday = todayStr === dayStr;
    const isClickable = !!dayMatch;

    cells.push(
      <div
        key={day}
        role={isClickable ? "button" : undefined}
        tabIndex={isClickable ? 0 : undefined}
        aria-label={isClickable ? `${monthNames[currentMonth-1]} ${day}: ${meta.label}` : undefined}
        onClick={() => isClickable && onOpenDetail(dayMatch.id)}
        onKeyDown={(e) => e.key === "Enter" && isClickable && onOpenDetail(dayMatch.id)}
        onMouseEnter={() => setTooltip({ day, status, label: meta.label, dayStr })}
        onMouseLeave={() => setTooltip(null)}
        className={`
          aspect-square rounded-xl flex flex-col items-center justify-center gap-0.5 relative
          transition-all duration-150 select-none
          ${meta.bg}
          ${isClickable ? "cursor-pointer hover:scale-[1.06] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-1 " + meta.ring : ""}
          ${isToday ? "ring-2 ring-offset-2 ring-indigo-500 shadow-sm" : ""}
        `}
      >
        <span className={`
          text-[11px] font-semibold leading-none
          ${status === "WEEKEND" ? "text-slate-400" : "text-slate-700"}
          ${isToday ? "text-indigo-700 font-bold" : ""}
        `}>
          {day}
        </span>
        <StatusDot status={status} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-slate-100">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-0.5">
              Attendance Calendar
            </p>
            <h3 className="text-sm font-bold text-slate-900 leading-tight">
              {monthNames[currentMonth - 1]} {currentYear}
            </h3>
          </div>

          {/* Month Navigator */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl p-1">
            <button
              onClick={handlePrevMonth}
              aria-label="Previous month"
              className="p-1.5 rounded-lg text-slate-500 hover:bg-white hover:text-slate-900 hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 cursor-pointer"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={handleNextMonth}
              aria-label="Next month"
              className="p-1.5 rounded-lg text-slate-500 hover:bg-white hover:text-slate-900 hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 cursor-pointer"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Summary Pills */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {Object.entries(statusCounts)
            .filter(([s]) => s !== "WEEKEND")
            .map(([s, count]) => {
              const m = STATUS_META[s];
              if (!m) return null;
              return (
                <span
                  key={s}
                  className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${m.bg} ${m.text}`}
                >
                  <span
                    style={{ background: m.dot }}
                    className="w-1.5 h-1.5 rounded-full"
                  />
                  {m.label} · {count}
                </span>
              );
            })}
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 mb-2">
          {weekDays.map((wd, i) => (
            <div
              key={wd}
              className={`text-center py-1 text-[10px] font-bold uppercase tracking-wider
                ${i === 0 || i === 6 ? "text-slate-300" : "text-slate-400"}`}
            >
              {wd}
            </div>
          ))}
        </div>

        {/* Day Grid */}
        <div className="grid grid-cols-7 gap-1.5">
          {cells}
        </div>

        {/* Today indicator */}
        {todayStr.startsWith(`${currentYear}-${String(currentMonth).padStart(2,"0")}`) && (
          <p className="text-center text-[10px] text-indigo-500 font-semibold mt-3">
            Today is highlighted with an indigo ring
          </p>
        )}
      </div>

      {/* Legend */}
      <div className="px-4 pb-4">
        <div className="bg-slate-50 rounded-xl p-3 grid grid-cols-3 gap-y-1.5 gap-x-2">
          {Object.entries(STATUS_META).map(([s, m]) => (
            <div key={s} className="flex items-center gap-1.5">
              <span
                style={{ background: m.dot }}
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              />
              <span className="text-[10px] text-slate-500 font-medium">{m.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}