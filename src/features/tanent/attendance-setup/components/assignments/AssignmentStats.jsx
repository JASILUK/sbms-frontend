import React, { useMemo } from "react";
import { differenceInDays, parseISO } from "date-fns";
import { ShieldCheck, Users, ClipboardList, Clock } from "lucide-react";

export const AssignmentStats = ({ assignments = [] }) => {
  const calculations = useMemo(() => {
    const total = assignments.length;
    const active = assignments.filter((a) => a.is_active).length;
    
    const uniqueEmployees = new Set(assignments.map((a) => a.membership_id || a.employee?.id).filter(Boolean));
    const employeesCount = uniqueEmployees.size;

    const today = new Date();
    const endingSoon = assignments.filter((a) => {
      if (!a.effective_to || !a.is_active) return false;
      const diff = differenceInDays(parseISO(a.effective_to), today);
      return diff >= 0 && diff <= 30;
    }).length;

    return { total, active, employeesCount, endingSoon };
  }, [assignments]);

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Workforce Allocation Analytics">
      <div className="rounded-xl border border-slate-200 bg-white p-5 flex items-center gap-4 shadow-3xs">
        <div className="p-3 bg-slate-50 text-slate-500 rounded-xl border border-slate-100">
          <ClipboardList className="h-5 w-5" />
        </div>
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Tracked</span>
          <span className="text-xl font-bold text-slate-900">{calculations.total} Assignments</span>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 flex items-center gap-4 shadow-3xs">
        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Active Allocation</span>
          <span className="text-xl font-bold text-slate-900">{calculations.active} Confirmed</span>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 flex items-center gap-4 shadow-3xs">
        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
          <Users className="h-5 w-5" />
        </div>
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Assigned Heads</span>
          <span className="text-xl font-bold text-slate-900">{calculations.employeesCount} Employees</span>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 flex items-center gap-4 shadow-3xs">
        <div className="p-3 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
          <Clock className="h-5 w-5" />
        </div>
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Ending Soon</span>
          <span className="text-xl font-bold text-slate-900">{calculations.endingSoon} Within 30d</span>
        </div>
      </div>
    </section>
  );
};