import React, { useState, useEffect } from "react"; // 👈 Added useEffect
import { X, Upload } from "lucide-react";
import { useCreateLeaveRequestMutation } from "../../api/leaveApi";

export default function LeaveRequestForm({ isOpen, leaveTypes, prefilledDates, onClose }) {
  const [createRequest, { isLoading }] = useCreateLeaveRequestMutation();
  const [typeId, setTypeId] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [halfDay, setHalfDay] = useState(false);
  const [session, setSession] = useState("");
  const [reason, setReason] = useState("");
  const [file, setFile] = useState(null);

  // Get today's date string format to limit historical inputs
  const todayStr = new Date().toISOString().split("T")[0];

  // 👈 Sync form state immediately when incoming pre-fill context updates
  useEffect(() => {
    if (prefilledDates?.start) setStart(prefilledDates.start);
    if (prefilledDates?.end) setEnd(prefilledDates.end);
  }, [prefilledDates, isOpen]);

  if (!isOpen) return null;

  const activePolicy = leaveTypes.find(t => t.id === parseInt(typeId));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (start < todayStr || end < todayStr) {
      alert("Past date allocations are restricted.");
      return;
    }
    
    const form = new FormData();
    form.append("leave_type_id", typeId);
    form.append("start_date", start);
    form.append("end_date", end);
    form.append("is_half_day", halfDay);
    if (halfDay) form.append("half_day_session", session);
    form.append("reason", reason);
    if (file) form.append("attachment", file);

    try {
      await createRequest(form).unwrap();
      onClose();
    } catch (err) {
      alert(err?.data?.message || "Validation limits violation verified.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-fadeIn">
      <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-3xs" onClick={onClose} />
      <form onSubmit={handleSubmit} className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col p-5 space-y-4 animate-slideLeft">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div>
            <h3 className="text-sm font-black text-slate-900">Apply Leave Authorization</h3>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold font-mono">Register payload schema</p>
          </div>
          <button type="button" onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"><X className="h-4 w-4" /></button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Leave Policy Configuration</label>
            <select required value={typeId} onChange={(e) => setTypeId(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 shadow-3xs focus:outline-hidden">
              <option value="">Select Leave Contract</option>
              {leaveTypes.map(t => <option key={t.id} value={t.id}>{t.name} ({t.code})</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Start Date</label>
              {/* Added min={todayStr} to prevent past selections */}
              <input type="date" min={todayStr} required value={start} onChange={(e) => setStart(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 shadow-3xs focus:outline-hidden" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">End Date</label>
              {/* Added min={start || todayStr} to prevent end date being before start date */}
              <input type="date" min={start || todayStr} required value={end} onChange={(e) => setEnd(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 shadow-3xs focus:outline-hidden" />
            </div>
          </div>

          {activePolicy?.allow_half_day && (
            <div className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-xl">
              <input type="checkbox" checked={halfDay} onChange={(e) => setHalfDay(e.target.checked)} id="hd_toggle" className="rounded text-indigo-600 focus:ring-0" />
              <label htmlFor="hd_toggle" className="text-xs font-bold text-slate-700 cursor-pointer">Register sub-day half split</label>
            </div>
          )}

          {halfDay && (
            <div className="space-y-1 animate-fadeIn">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Split Target Session</label>
              <select required value={session} onChange={(e) => setSession(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 shadow-3xs focus:outline-hidden">
                <option value="">Select Session segment</option>
                <option value="first_half">First Half (Morning)</option>
                <option value="second_half">Second Half (Afternoon)</option>
              </select>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Justification Statement</label>
            <textarea required rows={3} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Minimum 10 character statement description requested..." className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 shadow-3xs focus:outline-hidden resize-none" />
          </div>

          {activePolicy?.requires_attachment && (
            <div className="space-y-1 border border-dashed border-slate-200 rounded-2xl p-4 text-center bg-slate-50/40 relative">
              <input type="file" required={!file} onChange={(e) => setFile(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
              <div className="flex flex-col items-center gap-1 text-slate-400">
                <Upload className="h-5 w-5 text-slate-300" />
                <span className="text-[11px] font-bold text-slate-600">{file ? file.name : "Upload compliance certificates"}</span>
                <span className="text-[9px]">PDF, PNG bounds up to 5MB</span>
              </div>
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2 flex-shrink-0">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-100 cursor-pointer">Dismiss</button>
          <button type="submit" disabled={isLoading} className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 shadow-xs cursor-pointer disabled:opacity-40">{isLoading ? "Validating Vector..." : "Commit Petition"}</button>
        </div>
      </form>
    </div>
  );
}