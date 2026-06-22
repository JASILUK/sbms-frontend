import React from 'react';
import { ShieldCheck, Clock, XCircle, AlertCircle, Fingerprint, Calendar, Shield } from 'lucide-react';

export function FaceEnrollmentStatusCard({ activeRecord, onReenrollTrigger, isHrRestricted }) {
  const formatDate = (ds) => ds ? new Date(ds).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

  const stateConfigs = {
    APPROVED: {
      icon: ShieldCheck,
      bg: 'bg-emerald-50/30 border-emerald-200/80',
      box: 'bg-emerald-500 text-white shadow-sm shadow-emerald-100',
      title: 'Biometric Profile Active',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      desc: 'Your unique mathematical facial descriptor matrix is active. You can execute authentication checkpoints across organizational clock-in interfaces.'
    },
    PENDING: {
      icon: Clock,
      bg: 'bg-amber-50/30 border-amber-200/80',
      box: 'bg-amber-500 text-white shadow-sm shadow-amber-100',
      title: 'Awaiting HR Verification Review',
      badge: 'bg-amber-50 text-amber-700 border-amber-200',
      desc: 'Your biometric registration coordinates have been ingested successfully. Access privileges remain locked pending manual verification audit matches by HR.'
    },
    REJECTED: {
      icon: XCircle,
      bg: 'bg-rose-50/30 border-rose-200/80',
      box: 'bg-rose-500 text-white shadow-sm shadow-rose-100',
      title: 'Biometric Profile Request Denied',
      badge: 'bg-rose-50 text-rose-700 border-rose-200',
      desc: 'The administration compliance controllers denied your recent face registration capture submission sequence parameters logs.'
    },
    REVOKED: {
      icon: AlertCircle,
      bg: 'bg-slate-50 border-slate-200',
      box: 'bg-slate-500 text-white shadow-sm shadow-slate-100',
      title: 'Template Mapping Has Been Revoked',
      badge: 'bg-slate-100 text-slate-600 border-slate-300',
      desc: 'This tracking signature has been deactivated. Historical hashes remain preserved inside corporate compliance audit frameworks registers.'
    }
  };

  const current = stateConfigs[activeRecord.status] || stateConfigs.REVOKED;
  const StatusIcon = current.icon;

  return (
    <div className={`border rounded-2xl p-6 shadow-2xs flex flex-col gap-5 bg-white animate-fadeIn ${current.bg}`}>
      <div className="flex gap-4 items-start">
        <div className={`p-2.5 rounded-xl flex-shrink-0 ${current.box}`}>
          <StatusIcon className="h-5 w-5 stroke-[2]" />
        </div>
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">{current.title}</h3>
            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border ${current.badge}`}>
              {activeRecord.status}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-normal max-w-xl leading-relaxed">{current.desc}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50/50 border border-slate-100 p-4 rounded-xl text-[11px]">
        <div className="space-y-0.5">
          <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
            <Fingerprint className="h-3 w-3 text-slate-400" /> Core Version
          </span>
          <p className="font-mono font-bold text-slate-800">{activeRecord.embedding_version || 'v1.0.0'}</p>
        </div>
        <div className="space-y-0.5">
          <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
            <Calendar className="h-3 w-3 text-slate-400" /> Synchronized At
          </span>
          <p className="font-bold text-slate-800">{formatDate(activeRecord.created_at)}</p>
        </div>
        
        {activeRecord.status === 'APPROVED' && (
          <div className="space-y-0.5">
            <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
              <Shield className="h-3 w-3 text-slate-400" /> Liveness Scan
            </span>
            <p className="font-bold text-emerald-600">VERIFIED ✓</p>
          </div>
        )}

        {activeRecord.status === 'REJECTED' && activeRecord.rejection_reason && (
          <div className="space-y-0.5 col-span-2">
            <span className="text-[9px] uppercase font-bold text-rose-400 tracking-wider">Rejection Justification Context</span>
            <p className="font-semibold text-rose-700 italic truncate">"{activeRecord.rejection_reason}"</p>
          </div>
        )}

        {activeRecord.status === 'REVOKED' && activeRecord.revocation_reason && (
          <div className="space-y-0.5 col-span-2">
            <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Deactivation Reason</span>
            <p className="font-semibold text-slate-600 italic truncate">"{activeRecord.revocation_reason}"</p>
          </div>
        )}
      </div>

      {activeRecord.status !== 'PENDING' && !isHrRestricted && (
        <div className="border-t border-slate-100 pt-4 flex justify-end">
          <button
            type="button"
            onClick={onReenrollTrigger}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-xs hover:shadow-sm active:scale-98 transition-all duration-150 text-xs cursor-pointer"
          >
            {activeRecord.status === 'APPROVED' ? 'Request Re-enrollment Re-scan' : 'Submit New Face Profile'}
          </button>
        </div>
      )}
    </div>
  );
}