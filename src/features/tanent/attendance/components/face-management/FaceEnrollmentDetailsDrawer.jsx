import React from 'react';
import { X } from 'lucide-react';
import { useGetFaceEnrollmentDetailQuery } from '../../api/faceManagementApi';
import { FaceStatusBadge } from './FaceStatusBadge';

export function FaceEnrollmentDetailsDrawer({ id, isOpen, onClose }) {
  const { data: serverPayload, isLoading } = useGetFaceEnrollmentDetailQuery(id, { skip: !id });
  if (!isOpen) return null;

  const record = serverPayload?.data;

  return (
    <div className="fixed inset-0 z-40 flex justify-end animate-fadeIn">
      <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-3xs" onClick={onClose} />
      <div className="w-full max-w-md bg-white border-l border-slate-200 h-full shadow-2xl relative flex flex-col z-10 animate-slideLeft">
        
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Profile Audit Insight</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-50 text-slate-400 rounded-xl cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>

        {isLoading || !record ? (
          <div className="p-6 space-y-4 flex-1 overflow-y-auto animate-pulse">
            <div className="h-4 bg-slate-100 rounded-md w-1/3" />
            <div className="h-10 bg-slate-50 rounded-xl w-full" />
            <div className="h-20 bg-slate-50 rounded-xl w-full" />
          </div>
        ) : (
          <div className="p-6 space-y-5 flex-1 overflow-y-auto text-[11px] font-medium text-slate-600">
            <div className="flex justify-between items-center bg-slate-50 border border-slate-100 rounded-xl p-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Status</span>
                <span className="text-xs font-bold text-slate-900 block mt-0.5">{record.employee_username}</span>
              </div>
              <FaceStatusBadge status={record.status} />
            </div>

            <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-slate-400 block">Corporate Email</span>
                <span className="text-slate-800 font-semibold block">{record.employee_email}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Enrollment Source</span>
                <span className="text-slate-800 font-semibold block">{record.enrollment_source}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-slate-400 block">Embedding Version</span>
                <span className="text-slate-800 font-mono font-bold block">{record.embedding_version || 'v1.0.0'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Similarity Threshold</span>
                <span className="text-slate-800 font-mono block">{(record.similarity_threshold * 100) || '85'}%</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Liveness Checked</span>
                <span className="font-bold text-emerald-600">{record.liveness_verified ? 'YES' : 'NO'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Authorized Auditor</span>
                <span className="text-slate-800 font-semibold">{record.approver_username || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Audit Completion At</span>
                <span className="text-slate-700 font-mono">{record.approved_at ? new Date(record.approved_at).toLocaleString() : '—'}</span>
              </div>
            </div>

            {(record.rejection_reason || record.revocation_reason) && (
              <div className="p-3 bg-rose-50/50 border border-rose-100 rounded-xl text-rose-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-rose-700 tracking-wider block">Operational Action Note</span>
                <p className="leading-relaxed font-semibold">{record.rejection_reason || record.revocation_reason}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}