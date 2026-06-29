import React, { useState } from "react";
import { Filter, RotateCcw } from "lucide-react";

export default function LeaveFilters({ isOpen, leaveTypes, onApply, onReset }) {
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  if (!isOpen) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs space-y-4 animate-fadeIn bg-slate-50/20">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Workflow State</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 shadow-3xs focus:outline-hidden">
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Policy Configuration</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 shadow-3xs focus:outline-hidden">
            <option value="">All Leave Types</option>
            {leaveTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">From Date</label>
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 shadow-3xs focus:outline-hidden" />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">To Date</label>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 shadow-3xs focus:outline-hidden" />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <button onClick={() => { setStatus(""); setType(""); setFrom(""); setTo(""); onReset(); }} className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-50 cursor-pointer"><RotateCcw className="h-3.5 w-3.5" />Reset</button>
        <button onClick={() => onApply({ status, leave_type: type, date_from: from, date_to: to })} className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 shadow-xs cursor-pointer">Apply Matrices</button>
      </div>
    </div>
  );
}