import React from 'react';
import PropTypes from 'prop-types';

export const DepartmentPerformanceTable = React.memo(({ departments = [] }) => {
  if (departments.length === 0) {
    return (
      <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-10 text-center animate-fade-in">
        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-slate-400">No department data available</p>
        <p className="text-xs text-slate-300 mt-1">Performance metrics will appear here</p>
      </div>
    );
  }

  const getAttendanceColor = (pct) => {
    if (pct >= 80) return { bar: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50' };
    if (pct >= 50) return { bar: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50' };
    return { bar: 'bg-rose-500', text: 'text-rose-700', bg: 'bg-rose-50' };
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden w-full animate-fade-in-up">
      <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Departmental Performance</h3>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">Live workforce distribution by unit</p>
          </div>
        </div>
        <span className="text-[10px] font-bold bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-slate-500 shadow-sm">
          {departments.length} Unit{departments.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse" role="grid">
          <thead>
            <tr className="border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/40">
              <th className="py-3 px-5 text-left min-w-[140px]">Department</th>
              <th className="py-3 px-3 text-right min-w-[70px]">Total</th>
              <th className="py-3 px-3 text-right min-w-[80px]">Working</th>
              <th className="py-3 px-3 text-right min-w-[70px]">Break</th>
              <th className="py-3 px-3 text-right min-w-[70px]">Leave</th>
              <th className="py-3 px-3 text-right min-w-[70px]">Absent</th>
              <th className="py-3 px-3 text-right min-w-[80px]">Pending</th>
              <th className="py-3 px-5 text-right min-w-[140px]">Attendance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs bg-white">
            {departments.map((dept, idx) => {
              const colors = getAttendanceColor(dept.attendance_percentage);
              const isPerfect = dept.attendance_percentage === 100;
              const isZero = dept.attendance_percentage === 0;

              return (
                <tr
                  key={dept.department_id || idx}
                  className="group hover:bg-slate-50/80 transition-all duration-200"
                  style={{ animationDelay: `${idx * 60}ms` }}
                >
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-black shrink-0 ${
                        isPerfect ? 'bg-emerald-100 text-emerald-700' :
                        isZero ? 'bg-rose-100 text-rose-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {dept.department_name?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-[13px] leading-tight">{dept.department_name}</p>
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">ID: {dept.department_id}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-3 text-right">
                    <span className="font-mono font-bold text-slate-700 text-[13px]">{dept.employees_count}</span>
                  </td>

                  <td className="py-3.5 px-3 text-right">
                    <span className={`inline-flex items-center gap-1 font-mono font-bold text-[13px] ${(dept.working_count || 0) > 0 ? 'text-emerald-600' : 'text-slate-300'}`}>
                      {(dept.working_count || 0) > 0 && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
                      {dept.working_count || 0}
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-right">
                    <span className={`font-mono font-bold text-[13px] ${(dept.break_count || 0) > 0 ? 'text-amber-600' : 'text-slate-300'}`}>
                      {dept.break_count || 0}
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-right">
                    <span className={`font-mono font-bold text-[13px] ${(dept.leave_count || 0) > 0 ? 'text-violet-600' : 'text-slate-300'}`}>
                      {dept.leave_count || 0}
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-right">
                    <span className={`font-mono font-bold text-[13px] ${(dept.absent_count || 0) > 0 ? 'text-rose-600' : 'text-slate-300'}`}>
                      {dept.absent_count || 0}
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-right">
                    <span className={`font-mono font-bold text-[13px] ${(dept.not_started_count || 0) > 0 ? 'text-slate-500' : 'text-slate-300'}`}>
                      {dept.not_started_count || 0}
                    </span>
                  </td>

                  <td className="py-3.5 px-5 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <div className="w-20 bg-slate-100 rounded-full h-2 overflow-hidden hidden sm:block">
                        <div className={`h-full rounded-full transition-all duration-700 ease-out ${colors.bar}`} style={{ width: `${dept.attendance_percentage}%` }} />
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-black ${colors.bg} ${colors.text}`}>
                        {dept.attendance_percentage}%
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between text-[10px] text-slate-400 font-medium">
        <span>Showing all {departments.length} departments</span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Live data
        </span>
      </div>
    </div>
  );
});

DepartmentPerformanceTable.displayName = "DepartmentPerformanceTable";
DepartmentPerformanceTable.propTypes = { departments: PropTypes.array };