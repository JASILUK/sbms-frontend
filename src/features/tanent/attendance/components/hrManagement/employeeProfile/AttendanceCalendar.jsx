import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { ATTENDANCE_STATUS, ATTENDANCE_THEME } from "../../../constants/hrAttendance";

export default function AttendanceCalendar({ calendarData }) {
  const daysGrid = useMemo(() => {
    return calendarData?.days || [];
  }, [calendarData]);

  if (!calendarData) return null;

  return (
    <section className="bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl shadow-sm p-5 space-y-4 w-full" aria-label="Interactive monthly lookup context grid">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-900 pb-2">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">Attendance Calendar</h2>
        <span className="text-xs font-mono font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400 px-2.5 py-1 rounded-xl">
          Period: {calendarData.year}-{String(calendarData.month).padStart(2, "0")}
        </span>
      </div>

      {!daysGrid.length ? (
        <p className="text-sm text-slate-400 text-center py-4">No structured tracking grid recorded within this operational month block.</p>
      ) : (
        <div className="grid grid-cols-7 gap-2 text-center" role="grid" aria-label="Monthly day cell lookups matrix">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((weekday) => (
            <div key={weekday} className="text-xs font-bold text-slate-400 uppercase tracking-wider py-1 font-mono" role="columnheader">
              {weekday}
            </div>
          ))}
          
          {daysGrid.map((day) => {
            const theme = ATTENDANCE_THEME[day.attendance_status] || { bg: "bg-slate-50", color: "text-slate-400" };
            const dayNum = new Date(day.date).getDate();

            return (
              <div
                key={day.date}
                role="gridcell"
                title={`Date: ${day.date} | Status: ${day.attendance_status} | Duration: ${day.total_working_hours}h`}
                className={`p-3 rounded-xl border border-slate-100 dark:border-slate-900 transition-all flex flex-col items-center justify-between min-h-[64px] group hover:scale-[1.03] shadow-inner cursor-help ${theme.bg}`}
              >
                <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">{dayNum}</span>
                <span className={`text-[9px] font-extrabold uppercase mt-1 tracking-wide truncate max-w-full ${theme.color}`}>
                  {day.attendance_status.substring(0, 6)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

AttendanceCalendar.propTypes = {
  calendarData: PropTypes.object,
};