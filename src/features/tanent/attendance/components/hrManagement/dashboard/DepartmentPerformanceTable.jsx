import React from 'react';
import PropTypes from 'prop-types';

export const DepartmentPerformanceTable = React.memo(({ departments = [] }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden w-full">
      <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Departmental Performance Ledger</h3>
        <span className="text-[10px] font-mono font-bold bg-white border px-2 py-0.5 rounded-md text-slate-500">
          Units Monitored: {departments.length}
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse" role="grid">
          <thead>
            <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-white">
              <th className="py-2.5 px-4">Department Unit</th>
              <th className="py-2.5 px-3 text-right">Roster Pool</th>
              <th className="py-2.5 px-3 text-right">Active Working</th>
              <th className="py-2.5 px-3 text-right">Absent</th>
              <th className="py-2.5 px-4 text-right">Ratio Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs font-mono text-slate-600 bg-white">
            {departments.map((dept, idx) => (
              <tr key={dept.department_id || idx} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-3 px-4 font-sans font-semibold text-slate-900">{dept.department_name}</td>
                <td className="py-3 px-3 text-right text-slate-500">{dept.employees_count}</td>
                <td className="py-3 px-3 text-right text-emerald-600 font-bold">+{dept.working_count}</td>
                <td className="py-3 px-3 text-right text-rose-500">{dept.absent_count}</td>
                <td className="py-3 px-4 text-right font-sans font-bold text-slate-800">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden border hidden sm:block">
                      <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${dept.attendance_percentage}%` }} />
                    </div>
                    <span>{dept.attendance_percentage}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

DepartmentPerformanceTable.displayName = "DepartmentPerformanceTable";
DepartmentPerformanceTable.propTypes = {
  departments: PropTypes.array,
};