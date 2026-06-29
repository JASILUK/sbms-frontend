import React, { useMemo } from "react";
import { ChevronLeft, ChevronRight, HelpCircle } from "lucide-react";
import { getStatusColor } from "../../utils/attendanceHelpers";

export default function LeaveCalendar({ requests, currentMonth, currentYear, onMonthChange, onSelectRange }) {
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handlePrev = () => {
    if (currentMonth === 1) onMonthChange(12, currentYear - 1);
    else onMonthChange(currentMonth - 1, currentYear);
  };

  const handleNext = () => {
    if (currentMonth === 12) onMonthChange(1, currentYear + 1);
    else onMonthChange(currentMonth + 1, currentYear);
  };

  // Pre-process and map out calendar day matrices 
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth - 1, 1).getDay();

  const cells = [];
  for (let i = 0; i < firstDayIndex; i++) {
    cells.push(<div key={`empty-${i}`} className="aspect-square bg-slate-50/20 border border-slate-100 rounded-xl opacity-30" />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayStr = `${currentYear}-${String(currentMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    
    // Cross-verify matching timeline records crossing active days boundary constraints
    const matchedRequest = requests?.find(req => {
      const start = req.start_date;
      const end = req.end_date;
      return dayStr >= start && dayStr <= end;
    });

    let cellStatus = "NOT_MARKED";
    if (matchedRequest) {
      cellStatus = matchedRequest.status === "approved" ? "PRESENT" : "LATE"; // Present handles emerald, Late handles amber styles
    }

    const styles = getStatusColor(cellStatus);
    const isToday = new Date().toISOString().split("T")[0] === dayStr;

    cells.push(
      <div
        key={day}
        onClick={() => onSelectRange(dayStr, dayStr)}
        className={`aspect-square p-2 border border-slate-100 rounded-xl flex flex-col justify-between cursor-pointer group/cell hover:scale-[1.03] transition-all relative ${styles.bg} ${
          isToday ? "ring-2 ring-indigo-600 ring-offset-2" : ""
        }`}
      >
        <span className="text-xs font-black text-slate-800 font-mono">{day}</span>
        {matchedRequest && (
          <div className="flex items-center justify-between w-full">
            <span className={`text-[8px] font-black uppercase tracking-wider ${styles.text}`}>
              {matchedRequest.leave_type?.code || "LEAVE"}
            </span>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/cell:block bg-slate-900 text-white rounded-lg p-2 text-[10px] pointer-events-none z-30 font-mono whitespace-nowrap shadow-xl">
              {matchedRequest.leave_type?.name} ({matchedRequest.status})
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-3xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Leave Scheduler Visualizer</h3>
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-0.5 shadow-3xs">
          <button onClick={handlePrev} className="p-1 rounded-lg hover:bg-white text-slate-600 transition-all cursor-pointer"><ChevronLeft className="h-3.5 w-3.5" /></button>
          <span className="text-[11px] font-bold font-mono text-slate-800 min-w-[90px] text-center">{monthNames[currentMonth - 1].slice(0,3)} {currentYear}</span>
          <button onClick={handleNext} className="p-1 rounded-lg hover:bg-white text-slate-600 transition-all cursor-pointer"><ChevronRight className="h-3.5 w-3.5" /></button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {weekDays.map(wd => <div key={wd} className="text-center text-[9px] font-black uppercase text-slate-400 font-mono py-1">{wd}</div>)}
        {cells}
      </div>
    </div>
  );
}