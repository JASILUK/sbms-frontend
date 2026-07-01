import React from "react";
import PropTypes from "prop-types";

export default function EmployeeIdentityCard({ employee }) {
  if (!employee) return null;

  return (
    <section className="bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl shadow-sm p-5 flex flex-col sm:flex-row items-center sm:items-start gap-5 w-full" aria-label="Employee profile details card">
      <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-indigo-50 dark:bg-indigo-950 border border-indigo-100 dark:border-indigo-900 flex items-center justify-center font-bold text-2xl text-indigo-600 dark:text-indigo-400 font-mono shadow-inner select-none shrink-0">
        {employee.username?.substring(0, 2).toUpperCase() || "EM"}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-3 w-full text-sm">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Workspace Code</span>
          <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">#{employee.membership_id}</span>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Department Unit</span>
          <span className="font-medium text-slate-800 dark:text-slate-200 truncate block">{employee.department_name}</span>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Operational Role</span>
          <span className="font-medium text-slate-800 dark:text-slate-200 truncate block">{employee.role_name}</span>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Employment Status</span>
          <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md mt-0.5 ${
            employee.is_active 
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900"
              : "bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-400 border border-slate-200"
          }`}>
            {employee.is_active ? "Active Duty" : "Separated"}
          </span>
        </div>
        <div className="col-span-2 md:col-span-4 border-t border-slate-100 dark:border-slate-900 pt-2 text-xs text-slate-400">
          Corporate member trackings registered since: <span className="font-mono font-medium text-slate-500">{employee.joined_date}</span>
        </div>
      </div>
    </section>
  );
}

EmployeeIdentityCard.propTypes = {
  employee: PropTypes.object,
};