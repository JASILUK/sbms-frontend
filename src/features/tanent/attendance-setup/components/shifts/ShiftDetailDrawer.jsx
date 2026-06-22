import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatTime12Hour, calculateShiftDuration, formatDurationText } from "../../utils/shiftHelpers";
import { X, Clock, ShieldCheck, AlertCircle, Bookmark } from "lucide-react";

export const ShiftDetailDrawer = ({ isOpen, onClose, shift }) => {
  if (!shift) return null;
  const totalNetHours = calculateShiftDuration(shift.start_time, shift.end_time, shift.break_duration_minutes);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/30 backdrop-blur-xs" onClick={onClose} />
          
          <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "tween", duration: 0.25 }} className="w-screen max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col h-full">
              
              <div className="px-6 py-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bookmark className="h-4 w-4 text-indigo-500" />
                  <h3 className="text-base font-bold text-slate-900">Shift Architecture Specs</h3>
                </div>
                <button onClick={onClose} className="p-1 rounded-md text-slate-400 hover:text-slate-600 cursor-pointer"><X className="h-4 w-4" /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                  <h4 className="text-lg font-bold text-slate-900">{shift.name}</h4>
                  <p className="text-sm text-slate-500 mt-1">{shift.description || "No descriptive contextual framework provided."}</p>
                </div>

                <div className="border-t border-slate-100 pt-5 space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400 font-medium">Shift Identity Token</span>
                    <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-sm text-xs">ID-{shift.id}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400 font-medium">Classification Base</span>
                    <span className="capitalize font-bold text-slate-800">{shift.shift_type} Shift</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400 font-medium">Unpaid Rest Allocation</span>
                    <span className="font-bold text-slate-800">{shift.break_duration_minutes} Minutes</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400 font-medium">System Compliance Scope</span>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      shift.is_active ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                    }`}>
                      {shift.is_active ? <ShieldCheck className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                      {shift.is_active ? "Operational" : "Archived"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400 font-medium">Scheduling Priority Marker</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-sm border ${
                      shift.is_default ? "bg-amber-50 border-amber-200 text-amber-800" : "text-slate-400 border-slate-100"
                    }`}>
                      {shift.is_default ? "Workspace Default" : "Secondary Variant"}
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-5 space-y-4">
                  <div className="flex items-start gap-3">
                    <Clock className="h-4 w-4 text-indigo-500 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Time Block Range Configuration</span>
                      <span className="text-base font-bold text-slate-900 block mt-1">
                        {formatTime12Hour(shift.start_time)} – {formatTime12Hour(shift.end_time)}
                      </span>
                      <span className="text-xs text-slate-500 font-medium block mt-0.5">
                        Net Chronological Weight value equates to <span className="text-slate-900 font-bold">{formatDurationText(totalNetHours)}</span> after accounting for breaks.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button onClick={onClose} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 shadow-xs cursor-pointer">Close Inspection Drawer</button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};