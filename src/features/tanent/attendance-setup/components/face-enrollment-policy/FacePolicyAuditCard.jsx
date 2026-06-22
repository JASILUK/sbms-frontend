import React from 'react';
import { Controller } from 'react-hook-form';
import { Eye, ShieldAlert, History } from 'lucide-react';


export function FacePolicyAuditCard({ policyData }) {
  if (!policyData) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs space-y-4">
      <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
        <History className="h-4 w-4 text-slate-500" /> Operational Audit Logs Trace
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50/50 border border-slate-100 p-4 rounded-xl">
        <div className="space-y-0.5">
          <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Policy Registry ID</span>
          <p className="font-mono text-xs font-black text-slate-900">#{policyData.id}</p>
        </div>
        <div className="space-y-0.5">
          <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Created Timestamp</span>
          <p className="text-xs font-bold text-slate-800">{formatDate(policyData.created_at)}</p>
        </div>
        <div className="space-y-0.5">
          <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Last Sync Mutation</span>
          <p className="text-xs font-bold text-slate-800">{formatDate(policyData.updated_at)}</p>
        </div>
        <div className="space-y-0.5">
          <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">System Index Status</span>
          <span className={`inline-block px-1.5 py-0.2 rounded font-black text-[9px] border uppercase ${
            policyData.is_active ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-100 border-slate-300 text-slate-500'
          }`}>
            {policyData.is_active ? 'Active Engine' : 'Deactivated'}
          </span>
        </div>
      </div>
    </div>
  );
}