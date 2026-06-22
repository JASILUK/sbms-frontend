import React from 'react';
import { Clock, CheckCircle2, XCircle, Ban } from 'lucide-react';

export function FaceOverviewCards({ metrics }) {
  const items = [
    { label: 'Pending Requests', count: metrics.pending, icon: Clock, color: 'text-amber-500 bg-amber-50 border-amber-100' },
    { label: 'Approved Profiles', count: metrics.approved, icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-50 border-emerald-100' },
    { label: 'Rejected Profiles', count: metrics.rejected, icon: XCircle, color: 'text-rose-500 bg-rose-50 border-rose-100' },
    { label: 'Revoked Profiles', count: metrics.revoked, icon: Ban, color: 'text-slate-500 bg-slate-50 border-slate-100' }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {items.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div key={idx} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-3xs flex items-center justify-between hover:shadow-2xs transition-all duration-200">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">{card.label}</span>
              <span className="text-2xl font-black text-slate-900 tracking-tight block">{card.count}</span>
            </div>
            <div className={`p-3 border rounded-xl ${card.color}`}>
              <Icon className="h-5 w-5 stroke-[1.75]" />
            </div>
          </div>
        );
      })}
    </div>
  );
}