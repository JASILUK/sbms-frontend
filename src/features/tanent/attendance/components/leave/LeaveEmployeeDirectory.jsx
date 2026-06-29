import React from "react";
import { Users, ShieldCheck, ChevronRight, Activity } from "lucide-react";

export default function LeaveEmployeeDirectory({ employees, onSelectEmployee }) {
  return (
    <div className="space-y-3 w-full">
      <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Corporate Workspace Members Directory</h3>
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-3xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-gray-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="px-4 py-3">Member Employee</th>
              <th className="px-4 py-3">Department</th>
              <th className="px-4 py-3">Designation Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Ledger View</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-xs text-slate-700">
            {employees.map((member) => (
              <tr key={member.id} className="hover:bg-slate-50/40 transition-colors group">
                <td className="px-4 py-3 font-bold text-slate-900">
                  <div className="flex flex-col">
                    <span>{member.username || "System Member"}</span>
                    <span className="text-[10px] text-slate-400 font-mono font-medium">{member.user_email}</span>
                  </div>
                </td>
                <td className="px-4 py-3 font-medium text-slate-600">{member.department_name || "Unassigned"}</td>
                <td className="px-4 py-3 text-slate-500">{member.job_title || member.role_name}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold ${member.is_active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-400"}`}>
                    <span className={`h-1 w-1 rounded-full ${member.is_active ? "bg-emerald-500 animate-pulse" : "bg-slate-300"}`} />
                    {member.is_active ? "Active" : "Blocked"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => onSelectEmployee(member.id)} className="inline-flex items-center gap-1 px-2 py-1 bg-slate-50 border border-slate-200 text-slate-700 font-bold text-[10px] rounded-lg group-hover:bg-slate-900 group-hover:text-white transition-all cursor-pointer">
                    Inspect Profile Ledger
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}