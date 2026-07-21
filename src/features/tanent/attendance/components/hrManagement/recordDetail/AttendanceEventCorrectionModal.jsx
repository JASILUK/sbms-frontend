import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { X, Calendar, Clock, FileText, AlertCircle } from "lucide-react";
import { useCorrectAttendanceEventMutation } from "../../../api/hrAttendance/attendanceRecordApi";

export default function AttendanceEventCorrectionModal({ isOpen, onClose, event, recordContext }) {
  const [eventTime, setEventTime] = useState("");
  const [notes, setNotes] = useState("");
  const [fieldErrors, setFieldErrors] = useState(null);

  const [correctEvent, { isLoading }] = useCorrectAttendanceEventMutation();

  useEffect(() => {
    if (event && event.event_time) {
      const timestamp = Date.parse(event.event_time);
      
      if (!isNaN(timestamp)) {
        const localDate = new Date(timestamp);
        
        // Extract dates and times cleanly using localized pad string builders
        const year = localDate.getFullYear();
        const month = String(localDate.getMonth() + 1).padStart(2, "0");
        const day = String(localDate.getDate()).padStart(2, "0");
        const hours = String(localDate.getHours()).padStart(2, "0");
        const minutes = String(localDate.getMinutes()).padStart(2, "0");
        
        // This formats perfectly to "YYYY-MM-DDTHH:MM" required by datetime-local input
        const safeFormattedTime = `${year}-${month}-${day}T${hours}:${minutes}`;
        
        setEventTime(safeFormattedTime);
        setNotes(event.notes || "");
        setFieldErrors(null); 
      } else {
        setEventTime("");
        setNotes(event.notes || "");
        setFieldErrors(null);
      }
    }
  }, [event, isOpen]);

  if (!isOpen || !event) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors(null);

    const payload = {
      membership_id: recordContext.membership_id || recordContext.record?.membership_id,
      target_date: recordContext.attendance_date || recordContext.record?.attendance_date,
      event_id: event.id || null,
      event_time: eventTime, 
      notes: notes.trim(),
    };

    try {
      await correctEvent({ ...payload, recordId: recordContext.id || recordContext.record?.id }).unwrap();
      onClose();
    } catch (err) {
      if (err?.data?.errors || err?.data) {
        setFieldErrors(err.data.errors || err.data);
      } else {
        alert("Operation Aborted: Timeline constraints validation engine structural checks failed.");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 antialiased">
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity duration-300" onClick={() => !isLoading && onClose()} />
      
      <div className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 flex flex-col gap-4 animate-scale-up transform transition-all duration-300">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Modify Core Ingestion Parameter
            </h3>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">
              Adjust parameters for transaction token <span className="font-mono bg-slate-100 text-slate-600 px-1 py-0.5 rounded">#{event.id}</span>
            </p>
          </div>
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Unified Field Exception Messaging Block */}
        {fieldErrors && (
          <div className="bg-rose-50 border border-rose-100 text-rose-800 text-xs rounded-xl p-3 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold">Timeline Exception Intercept:</span>
              <ul className="list-disc pl-4 space-y-0.5 font-sans text-rose-700 font-medium">
                {Object.entries(fieldErrors).map(([field, msg]) => (
                  <li key={field}>
                    <span className="capitalize font-semibold">{field.replace('_', ' ')}</span>: {Array.isArray(msg) ? msg[0] : msg}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Transaction Operational Scope
            </label>
            <input
              type="text"
              disabled
              value={`${event.event_type} Protocol Window`}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 text-xs px-3 py-2.5 font-semibold text-slate-600 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Targeted Ingestion Timestamp
            </label>
            <input
              type="datetime-local"
              required
              disabled={isLoading}
              value={eventTime}
              onChange={(e) => setEventTime(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white text-xs px-3 py-2.5 font-medium text-slate-800 focus:outline-none focus:border-slate-950 focus:ring-1 focus:ring-slate-950/20 transition-all outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <FileText className="w-3 h-3" /> Audit Trail Justification Statement
            </label>
            <textarea
              rows={3}
              required
              disabled={isLoading}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="State explicit administrative justification details regarding this correction..."
              className="w-full rounded-xl border border-slate-200 bg-white text-xs p-3 font-medium placeholder-slate-400 text-slate-800 focus:outline-none focus:border-slate-950 focus:ring-1 focus:ring-slate-950/20 transition-all outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button 
              type="button" 
              disabled={isLoading}
              onClick={onClose} 
              className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-slate-950 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl flex items-center gap-2 transition-all shadow-xs cursor-pointer focus:ring-2 focus:ring-slate-950/20"
            >
              {isLoading && <span className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              Commit Mutation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

AttendanceEventCorrectionModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  event: PropTypes.object,
  recordContext: PropTypes.object.isRequired,
};