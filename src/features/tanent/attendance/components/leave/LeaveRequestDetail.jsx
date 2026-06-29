import React, { useState } from "react";
import { X, Check, X as CancelIcon, AlertTriangle, Calendar, User, Building, ClipboardList, FileCheck } from "lucide-react";
import { 
  useGetMyLeaveRequestDetailQuery,
  useGetHRLeaveRequestDetailQuery,
  useApproveLeaveRequestMutation, 
  useRejectLeaveRequestMutation,
  useCancelLeaveRequestMutation,
  useHrCancelLeaveRequestMutation
} from "../../api/leaveApi";
import LeaveStatusBadge from "./LeaveStatusBadge";
import { formatDate } from "../../utils/attendanceHelpers";

export default function LeaveRequestDetail({ requestId, isHR, onClose }) {
  const selfQuery = useGetMyLeaveRequestDetailQuery(requestId, { skip: !requestId || isHR });
  const hrQuery = useGetHRLeaveRequestDetailQuery(requestId, { skip: !requestId || !isHR });

  const { data, isLoading } = isHR ? hrQuery : selfQuery;

  const [approveRequest, { isLoading: isApproving }] = useApproveLeaveRequestMutation();
  const [rejectRequest, { isLoading: isRejecting }] = useRejectLeaveRequestMutation();
  const [cancelRequest, { isLoading: isCancellingSelf }] = useCancelLeaveRequestMutation();
  const [hrCancelRequest, { isLoading: isCancellingHR }] = useHrCancelLeaveRequestMutation();

  const [rejectReason, setRejectReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);

  if (!requestId) return null;

  const row = data?.data;
  const computedEmployeeName = row?.employee_name || row?.membership_name || "Workspace Member";
  const actionExecuting = isApproving || isRejecting || isCancellingSelf || isCancellingHR;

  const handleAction = async (type) => {
    try {
      if (type === "approve") {
        await approveRequest(requestId).unwrap();
      } else if (type === "reject") {
        if (!rejectReason.trim()) return;
        await rejectRequest({ requestId, body: { rejection_reason: rejectReason.trim() } }).unwrap();
      } else if (type === "cancel") {
        if (isHR) {
          await hrCancelRequest({ requestId, body: {} }).unwrap();
        } else {
          await cancelRequest({ requestId, body: {} }).unwrap();
        }
      }
      setShowRejectForm(false);
      setRejectReason("");
      onClose();
    } catch (e) {
      alert(e?.data?.message || "Action authorization exception.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-fadeIn">
      <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-3xs" onClick={onClose} />
      <div className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col p-5 space-y-4 animate-slideLeft">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div>
            <h3 className="text-sm font-black text-slate-900">Audit Leave Profile Ledger</h3>
            <p className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">Verification context node</p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"><X className="h-4 w-4" /></button>
        </div>

        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-2">
            <div className="h-5 w-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Hydrating data stack...</span>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-5 pr-1 text-slate-700">
            
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between shadow-3xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Workflow State Status</span>
              <LeaveStatusBadge status={row?.status} />
            </div>

            <div className="bg-white border border-slate-200 p-4 rounded-2xl space-y-4 shadow-3xs text-xs">
              <div className="flex items-start gap-3">
                <User className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 tracking-wider block uppercase">Applicant Employee</span>
                  <span className="text-slate-900 font-black text-sm">{computedEmployeeName}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-3">
                <div className="flex items-start gap-2.5">
                  <Building className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-400 tracking-wider block uppercase">Department Node</span>
                    <span className="text-slate-800 font-bold uppercase">{row?.department_name || "Not Specified"}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <ClipboardList className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-400 tracking-wider block uppercase">Policy Target Rule</span>
                    <span className="text-slate-800 font-mono font-black text-[10px] bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded">{row?.leave_type?.code || "LEAVE"}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 border-t border-slate-100 pt-3">
                <Calendar className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 tracking-wider block uppercase">Duration Timeline Bounds</span>
                  <span className="text-slate-800 font-mono font-bold block">{formatDate(row?.start_date)} $\rightarrow$ {formatDate(row?.end_date)}</span>
                  <span className="inline-block bg-indigo-50 text-indigo-700 border border-indigo-100 font-bold font-mono px-2 py-0.5 rounded-md mt-1 text-[10px]">Net Impact Weight: {row?.total_days || "0.0"} Days</span>
                </div>
              </div>

              {row?.approved_at && (
                <div className="flex items-start gap-3 border-t border-slate-100 pt-3 text-emerald-700 bg-emerald-50/20 p-2.5 rounded-xl border border-emerald-100/50">
                  <FileCheck className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-emerald-600 tracking-wider block uppercase">Authorized Approver Audit</span>
                    <span className="text-xs font-bold text-slate-800">{row?.approver_name || "System Automated"}</span>
                    <span className="text-[9px] text-slate-400 font-mono block">Validated: {new Date(row.approved_at).toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 tracking-wider block uppercase px-1">Statement Justification</span>
              <p className="text-xs bg-slate-50 p-3 rounded-xl border border-slate-200/60 leading-relaxed text-slate-600 shadow-3xs">{row?.reason || "No written statement attached."}</p>
            </div>

            {row?.rejection_reason && (
              <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl space-y-1 shadow-3xs">
                <span className="text-[10px] font-bold text-rose-500 tracking-wider flex items-center gap-1 uppercase"><AlertTriangle className="h-3 w-3" />HR Administrative Rejection Context</span>
                <p className="text-xs text-rose-700 leading-relaxed font-medium">{row.rejection_reason}</p>
              </div>
            )}

            {showRejectForm && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 animate-fadeIn shadow-3xs">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Reason for Rejection</label>
                <textarea rows={2} required value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-hidden" placeholder="Provide reason string..." />
                <div className="flex justify-end gap-1">
                  <button type="button" onClick={() => setShowRejectForm(false)} className="px-2 py-1 text-xs bg-white border border-slate-200 text-slate-600 font-bold rounded-lg cursor-pointer">Cancel</button>
                  <button type="button" disabled={actionExecuting} onClick={() => handleAction("reject")} className="px-3 py-1 text-xs bg-rose-600 text-white font-bold rounded-lg hover:bg-rose-700 shadow-3xs cursor-pointer disabled:opacity-40">Confirm Reject</button>
                </div>
              </div>
            )}

            {/* System Actions Operations Controllers Panel */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
              
              {/* 1. Pending Workflow Row Actions */}
              {row?.status === "pending" && !showRejectForm && (
                <>
                  {isHR ? (
                    <>
                      <button type="button" disabled={actionExecuting} onClick={() => setShowRejectForm(true)} className="flex items-center gap-1 px-3 py-2 bg-white border border-slate-200 text-rose-600 font-bold text-xs rounded-xl hover:bg-rose-50/50 shadow-3xs cursor-pointer"><CancelIcon className="h-3.5 w-3.5" />Reject</button>
                      <button type="button" disabled={actionExecuting} onClick={() => handleAction("approve")} className="flex items-center gap-1 px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 shadow-xs cursor-pointer"><Check className="h-3.5 w-3.5" />Approve</button>
                    </>
                  ) : (
                    /* Employee can cancel if request is still pending */
                    <button type="button" disabled={actionExecuting} onClick={() => handleAction("cancel")} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-50/70 shadow-3xs cursor-pointer">Revoke Application</button>
                  )}
                </>
              )}

              {/* 2. ✅ FIXED: Approved Workflow Row Actions — strictly visible to HR desk portals only */}
              {row?.status === "approved" && isHR && (
                <button type="button" disabled={actionExecuting} onClick={() => handleAction("cancel")} className="flex items-center gap-1 px-3 py-2 bg-rose-50 border border-rose-200 text-rose-700 font-bold text-xs rounded-xl hover:bg-rose-100 cursor-pointer shadow-3xs"><CancelIcon className="h-3.5 w-3.5" />Revoke Approved Leave</button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}