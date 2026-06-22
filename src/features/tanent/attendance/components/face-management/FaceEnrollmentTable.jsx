import React from 'react';
import { Eye, Check, X, ShieldAlert, Cpu } from 'lucide-react';
import { FaceStatusBadge } from './FaceStatusBadge';
import { ENROLLMENT_STATUS } from '../../constants/faceManagementConstants';

export function FaceEnrollmentTable({ records, onView, onApprove, onReject, onRevoke }) {
  if (records.length === 0) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center shadow-3xs w-full">
        <Cpu className="h-8 w-8 text-slate-300 mx-auto stroke-[1.5] mb-2" />
        <h5 className="text-slate-800 font-bold text-sm">No profiles found</h5>
        <p className="text-slate-400 max-w-sm mx-auto mt-0.5">No face data records match the specified query configuration options.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-3xs overflow-hidden w-full">
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              <th className="py-3.5 px-5 sticky top-0 bg-slate-50">Employee</th>
              <th className="py-3.5 px-4 sticky top-0 bg-slate-50">Status</th>
              <th className="py-3.5 px-4 sticky top-0 bg-slate-50">Source</th>
              <th className="py-3.5 px-4 sticky top-0 bg-slate-50 text-center">Liveness</th>
              <th className="py-3.5 px-4 sticky top-0 bg-slate-50">Approver</th>
              <th className="py-3.5 px-4 sticky top-0 bg-slate-50">Approved At</th>
              <th className="py-3.5 px-5 sticky top-0 bg-slate-50">Created At</th>
              <th className="py-3.5 px-5 text-right sticky top-0 bg-slate-50">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {records.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50/50 transition-colors text-slate-700">
                <td className="py-3.5 px-5 font-bold text-slate-900">{row.employee_username}</td>
                <td className="py-3.5 px-4"><FaceStatusBadge status={row.status} /></td>
                <td className="py-3.5 px-4 font-semibold text-slate-500 text-[11px]">{row.enrollment_source}</td>
                <td className="py-3.5 px-4 text-center">
                  <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${row.liveness_verified ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                    {row.liveness_verified ? 'VERIFIED' : 'FAILED'}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-medium text-slate-500">{row.approver_username || '—'}</td>
                <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                  {row.approved_at ? new Date(row.approved_at).toLocaleDateString() : '—'}
                </td>
                <td className="py-3.5 px-5 font-mono text-slate-400 text-[11px]">
                  {new Date(row.created_at).toLocaleDateString()}
                </td>
                <td className="py-3.5 px-5 text-right">
                  <div className="flex justify-end items-center gap-1.5">
                    <button
                      onClick={() => onView(row.id)}
                      className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors cursor-pointer"
                      title="View Profile Metrics"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    {row.status === ENROLLMENT_STATUS.PENDING && (
                      <>
                        <button
                          onClick={() => onApprove(row.id)}
                          className="p-1.5 hover:bg-emerald-50 text-emerald-600 rounded-lg transition-colors cursor-pointer"
                          title="Approve Alignment"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onReject(row.id)}
                          className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg transition-colors cursor-pointer"
                          title="Reject Validation"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    )}
                    {row.status === ENROLLMENT_STATUS.APPROVED && (
                      <button
                        onClick={() => onRevoke(row.id)}
                        className="p-1.5 hover:bg-slate-100 text-rose-600 rounded-lg transition-colors cursor-pointer"
                        title="Revoke Token Matrix"
                      >
                        <ShieldAlert className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}