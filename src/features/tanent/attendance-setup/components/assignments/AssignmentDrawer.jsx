import React from "react";
import { useGetAssignmentQuery } from "../../api/attendanceSetupApi";
import { motion, AnimatePresence } from "framer-motion";
import { format, parseISO } from "date-fns";
import { X, Clock, User, Briefcase, FileText } from "lucide-react";

export const AssignmentDrawer = ({ isOpen, onClose, recordId }) => {
  const { data: response, isLoading } = useGetAssignmentQuery(recordId, { skip: !recordId });
  const assignment = response?.data || response;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/30 backdrop-blur-xs" onClick={onClose} />
          <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "tween", duration: 0.2 }} className="w-screen max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col h-full">
              
              <div className="px-6 py-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Allocation Inspector</h3>
                <button onClick={onClose} className="p-1 rounded-md text-slate-400 hover:text-slate-600 cursor-pointer"><X className="h-4 w-4" /></button>
              </div>

              {isLoading ? (
                <div className="p-6 space-y-4 flex-1 animate-pulse">
                  <div className="h-12 bg-slate-100 rounded-lg w-3/4" />
                  <div className="h-32 bg-slate-50 rounded-xl" />
                </div>
              ) : assignment ? (
                <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm">
                  
                  {/* Associate Info Card */}
                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-4 rounded-xl">
                    <div className="h-10 w-10 bg-indigo-600 text-white font-bold rounded-full flex items-center justify-center text-sm shadow-xs">
                      {(assignment.employee?.first_name || "E").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-base">{assignment.employee?.first_name} {assignment.employee?.last_name}</h4>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5"><Briefcase className="h-3 w-3" /> {assignment.employee?.job_title || "Enterprise Associate"}</p>
                    </div>
                  </div>

                  {/* Core Metrics List */}
                  <div className="space-y-4 border-t border-slate-100 pt-4">
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-medium">Shift Blueprint</span>
                      <span className="font-bold text-slate-800">{assignment.shift?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-medium">Core Active Time Block</span>
                      <span className="font-mono font-bold text-indigo-600">{assignment.shift?.start_time?.substring(0,5)} - {assignment.shift?.end_time?.substring(0,5)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-medium">Lifecycle Start</span>
                      <span className="font-mono font-semibold text-slate-700">{assignment.effective_from ? format(parseISO(assignment.effective_from), "dd MMM yyyy") : "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-medium">Lifecycle Termination</span>
                      <span className="font-mono font-semibold text-slate-700">{assignment.effective_to ? format(parseISO(assignment.effective_to), "dd MMM yyyy") : "Ongoing Range"}</span>
                    </div>
                  </div>

                  {/* Operational Notes Audit Trail Block */}
                  <div className="bg-slate-50/50 rounded-xl border border-slate-100 p-4 space-y-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5"><FileText className="h-3.5 w-3.5" /> Contextual Audit Logs</span>
                    <p className="text-xs text-slate-600 italic leading-relaxed">{assignment.notes || "No custom operational audit logs attached to this tracking record."}</p>
                  </div>

                </div>
              ) : (
                <div className="p-6 text-center text-slate-400">Failed to pull target allocation record metrics.</div>
              )}

            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};