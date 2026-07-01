import React from 'react';
import PropTypes from 'prop-types';

export default function DepartmentSection({ departments = [] }) {
  if (!departments?.length) return null;

  return (
    <section className="bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl shadow-xs p-5 space-y-4" aria-label="Department-wide operational distribution">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">Department summaries</h2>
        <span className="text-xs text-slate-500 font-medium font-mono">{departments.length} Units Monitored</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse" role="grid">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-900 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-2">Department Name</th>
              <th className="py-3 px-2 text-right">Headcount</th>
              <th className="py-3 px-2 text-right">Present</th>
              <th className="py-3 px-2 text-right">Late</th>
              <th className="py-3 px-2 text-right">Ratio</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-900 text-sm font-mono">
            {departments.map((dept) => (
              <tr key={dept.department_id || dept.department_name} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                <td className="py-3 px-2 font-sans font-medium text-slate-900 dark:text-slate-100">{dept.department_name}</td>
                <td className="py-3 px-2 text-right text-slate-600 dark:text-slate-400">{dept.employee_count || dept.total}</td>
                <td className="py-3 px-2 text-right text-emerald-600 dark:text-emerald-400">{dept.present || dept.present_members}</td>
                <td className="py-3 px-2 text-right text-amber-600 dark:text-amber-400">{dept.late || dept.late_count}</td>
                <td className="py-3 px-2 text-right font-semibold text-slate-900 dark:text-white">
                  {dept.attendance_percentage ?? (dept.total ? Math.round((dept.present_members / dept.total) * 100) : 0)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

DepartmentSection.propTypes = {
  departments: PropTypes.array,
};