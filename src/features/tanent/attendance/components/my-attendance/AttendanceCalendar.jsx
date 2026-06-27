import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const STATUS_META = {
  PRESENT:      { label: "Present",        dot: "#22c55e", bg: "bg-emerald-50", text: "text-emerald-700", ring: "ring-emerald-200", hover: "hover:bg-emerald-100" },
  PRESENT_LATE: { label: "Present (Late)", dot: "#f59e0b", bg: "bg-amber-50",   text: "text-amber-700",   ring: "ring-amber-200",   hover: "hover:bg-amber-100" },
  ABSENT:       { label: "Absent",         dot: "#ef4444", bg: "bg-rose-50",    text: "text-rose-600",    ring: "ring-rose-200",    hover: "hover:bg-rose-100" },
  LATE:         { label: "Late",           dot: "#f59e0b", bg: "bg-amber-50",   text: "text-amber-700",   ring: "ring-amber-200",   hover: "hover:bg-amber-100" },
  LEAVE:        { label: "Leave",          dot: "#818cf8", bg: "bg-indigo-50",  text: "text-indigo-600",  ring: "ring-indigo-200",  hover: "hover:bg-indigo-100" },
  HOLIDAY:      { label: "Holiday",        dot: "#06b6d4", bg: "bg-cyan-50",    text: "text-cyan-700",    ring: "ring-cyan-200",    hover: "hover:bg-cyan-100" },
  WEEKEND:      { label: "Weekend",        dot: "#94a3b8", bg: "bg-slate-50",   text: "text-slate-400",   ring: "ring-slate-100",   hover: "hover:bg-slate-100" },
  NOT_MARKED:   { label: "Not Marked",     dot: "#cbd5e1", bg: "bg-slate-50",   text: "text-slate-300",   ring: "ring-slate-100",   hover: "" },
};

function resolveDisplayStatus(dayData) {
  if (!dayData) return "NOT_MARKED";
  if (dayData.status === "PRESENT" && dayData.is_late) return "PRESENT_LATE";
  return dayData.status || "NOT_MARKED";
}

function StatusDot({ status }) {
  const meta = STATUS_META[status] || STATUS_META.NOT_MARKED;
  return <span style={{ background: meta.dot }} className="inline-block w-1.5 h-1.5 rounded-full flex-shrink-0" aria-hidden="true" />;
}

function DayTooltip({ dayData }) {
  if (!dayData) return null;
  const displayStatus = resolveDisplayStatus(dayData);
  const meta = STATUS_META[displayStatus] || STATUS_META.NOT_MARKED;
  
  return (
    <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white rounded-lg shadow-xl text-[11px] font-medium whitespace-nowrap pointer-events-none">
      <div className="flex items-center gap-2 mb-1">
        <span style={{ background: meta.dot }} className="w-2 h-2 rounded-full" />
        <span className="font-bold">{meta.label}</span>
      </div>
      {dayData.holiday_name && <div className="text-slate-300 text-[10px]">{dayData.holiday_name}</div>}
      {dayData.check_in && (
        <div className="text-slate-300 text-[10px]">{dayData.check_in} - {dayData.check_out || "--:--"}</div>
      )}
      {dayData.work_hours && <div className="text-slate-300 text-[10px]">{dayData.work_hours} hrs</div>}
      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
    </div>
  );
}

export default function AttendanceCalendar({
  calendarData,
  currentMonth,
  currentYear,
  onMonthChange,
  onOpenDetail, // Receives ID (number) — same as AttendanceListTable
}) {
  const [hoveredDay, setHoveredDay] = useState(null);
  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const handlePrevMonth = () => {
    if (currentMonth === 1) onMonthChange(12, currentYear - 1);
    else onMonthChange(currentMonth - 1, currentYear);
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) onMonthChange(1, currentYear + 1);
    else onMonthChange(currentMonth + 1, currentYear);
  };

  const safeCalendarArray = Array.isArray(calendarData) ? calendarData : [];
  
  const dayMap = useMemo(() => {
    const map = {};
    safeCalendarArray.forEach((day) => { if (day?.date) map[day.date] = day; });
    return map;
  }, [safeCalendarArray]);

  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth - 1, 1).getDay();
  const todayStr = new Date().toISOString().split("T")[0];

  const statusCounts = useMemo(() => {
    const counts = {};
    for (let day = 1; day <= daysInMonth; day++) {
      const dayStr = `${currentYear}-${String(currentMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const dayData = dayMap[dayStr];
      const status = resolveDisplayStatus(dayData);
      counts[status] = (counts[status] || 0) + 1;
    }
    return counts;
  }, [dayMap, currentYear, currentMonth, daysInMonth]);

  const cells = [];

  // Empty leading cells
  for (let i = 0; i < firstDayIndex; i++) {
    cells.push(<div key={`e-${i}`} className="aspect-square rounded-xl" aria-hidden="true" />);
  }

  // Day cells
  for (let day = 1; day <= daysInMonth; day++) {
    const dayStr = `${currentYear}-${String(currentMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const dayData = dayMap[dayStr];
    const displayStatus = resolveDisplayStatus(dayData);
    const meta = STATUS_META[displayStatus] || STATUS_META.NOT_MARKED;
    const isToday = todayStr === dayStr;
    
    // Clickable if has data with an ID (actual attendance record)
    const isClickable = dayData && dayData.id && displayStatus !== "NOT_MARKED";

    cells.push(
      <div
        key={day}
        role={isClickable ? "button" : undefined}
        tabIndex={isClickable ? 0 : undefined}
        aria-label={dayData ? `${monthNames[currentMonth-1]} ${day}: ${meta.label}` : `${monthNames[currentMonth-1]} ${day}`}
        onClick={() => {
          if (isClickable && dayData?.id) {
            // FIX: Pass ID (number) — same as AttendanceListTable
            onOpenDetail(dayData.id);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && isClickable && dayData?.id) {
            onOpenDetail(dayData.id);
          }
        }}
        onMouseEnter={() => setHoveredDay(dayData)}
        onMouseLeave={() => setHoveredDay(null)}
        className={`
          aspect-square rounded-xl flex flex-col items-center justify-center gap-0.5 relative
          transition-all duration-150 select-none
          ${meta.bg}
          ${isClickable ? `cursor-pointer hover:scale-[1.06] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-1 ${meta.ring} ${meta.hover}` : ""}
          ${isToday ? "ring-2 ring-offset-2 ring-indigo-500 shadow-sm" : ""}
          ${displayStatus === "NOT_MARKED" ? "opacity-40" : ""}
        `}
      >
        {hoveredDay?.date === dayStr && <DayTooltip dayData={dayData} />}
        
        <span className={`
          text-[11px] font-semibold leading-none
          ${displayStatus === "WEEKEND" || displayStatus === "NOT_MARKED" ? "text-slate-400" : "text-slate-700"}
          ${isToday ? "text-indigo-700 font-bold" : ""}
        `}>
          {day}
        </span>
        
        <StatusDot status={displayStatus} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-slate-100">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-0.5">Attendance Calendar</p>
            <h3 className="text-sm font-bold text-slate-900 leading-tight">{monthNames[currentMonth - 1]} {currentYear}</h3>
          </div>
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl p-1">
            <button onClick={handlePrevMonth} aria-label="Previous month" className="p-1.5 rounded-lg text-slate-500 hover:bg-white hover:text-slate-900 hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 cursor-pointer">
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button onClick={handleNextMonth} aria-label="Next month" className="p-1.5 rounded-lg text-slate-500 hover:bg-white hover:text-slate-900 hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 cursor-pointer">
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Summary Pills */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {Object.entries(statusCounts)
            .filter(([s]) => s !== "WEEKEND" && s !== "NOT_MARKED")
            .map(([s, count]) => {
              const m = STATUS_META[s];
              if (!m) return null;
              return (
                <span key={s} className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${m.bg} ${m.text}`}>
                  <span style={{ background: m.dot }} className="w-1.5 h-1.5 rounded-full" />
                  {m.label} · {count}
                </span>
              );
            })}
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        <div className="grid grid-cols-7 mb-2">
          {weekDays.map((wd, i) => (
            <div key={wd} className={`text-center py-1 text-[10px] font-bold uppercase tracking-wider ${i === 0 || i === 6 ? "text-slate-300" : "text-slate-400"}`}>
              {wd}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1.5">{cells}</div>
        {todayStr.startsWith(`${currentYear}-${String(currentMonth).padStart(2, "0")}`) && (
          <p className="text-center text-[10px] text-indigo-500 font-semibold mt-3">Today is highlighted with an indigo ring</p>
        )}
      </div>

      {/* Legend */}
      <div className="px-4 pb-4">
        <div className="bg-slate-50 rounded-xl p-3 grid grid-cols-3 gap-y-1.5 gap-x-2">
          {Object.entries(STATUS_META).map(([s, m]) => (
            <div key={s} className="flex items-center gap-1.5">
              <span style={{ background: m.dot }} className="w-1.5 h-1.5 rounded-full flex-shrink-0" />
              <span className="text-[10px] text-slate-500 font-medium">{m.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}