import React from "react";
import { Eye, Calendar } from "lucide-react";
import LeaveStatusBadge from "./LeaveStatusBadge";
import { formatDate } from "../../utils/attendanceHelpers";

export default function LeaveRequestList({ records, onOpenDetail }) {
  if (records.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-12 flex flex-col items-center justify-center text-center space-y-3 shadow-3xs w-full">
        <div className="p-3 bg-slate-50 rounded-full border border-slate-100"><Calendar className="h-5 w-5 text-slate-400" /></div>
        <div className="space-y-0.5">
          <h4 className="text-xs font-bold text-slate-800">No Historical Records Traced</h4>
          <p className="text-[11px] text-slate-400 max-w-xs">No active execution workflows meet your active address filters.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-3xs overflow-hidden w-full">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-100">
              <th className="p-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Employee</th>
              <th className="p-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Policy Type</th>
              <th className="p-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Duration Timeline</th>
              <th className="p-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Net Days</th>
              <th className="p-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">State status</th>
              <th className="p-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {records.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50/30 transition-colors group">
                <td className="p-3 text-xs font-bold text-slate-800">{row.employee_name || "Workspace Member"}</td>
                <td className="p-3 text-xs text-slate-600 font-mono font-bold">
                  <span className="bg-slate-100 px-1.5 py-0.5 border border-slate-200 rounded-md text-[10px]">{row.leave_type?.code}</span>
                </td>
                {/*  FIXED: Swapped LaTeX syntax out for clean text character arrow */}
                <td className="p-3 text-xs text-slate-600 font-mono">{formatDate(row.start_date)} → {formatDate(row.end_date)}</td>
                <td className="p-3 text-xs font-black text-slate-800 font-mono">{row.total_days} d</td>
                <td className="p-3"><LeaveStatusBadge status={row.status} /></td>
                <td className="p-3 text-right">
                  <button onClick={() => onOpenDetail(row.id)} className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 text-slate-700 font-bold text-[10px] rounded-lg hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all cursor-pointer"><Eye className="h-3 w-3" />Audit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}