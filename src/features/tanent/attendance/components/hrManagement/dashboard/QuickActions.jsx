import React from 'react';
import { Link } from 'react-router-dom';
import { HR_ROUTES } from '../../../constants/hrAttendance';

export const QuickActions = React.memo(() => {
  const links = [
    { to: HR_ROUTES.DIRECTORY, label: "Employee Directory Grid", subtitle: "Browse workforce registry cards" },
    { to: HR_ROUTES.REVIEW_QUEUE, label: "Unresolved Review Queue", subtitle: "Clear outstanding trace flags" },
  ];

  return (
    <section className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-xs" aria-label="Administrative shortcuts deck panel">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Workspace Shortcuts</h3>
      <div className="flex flex-col gap-2">
        {links.map((lnk, idx) => (
          <Link 
            key={idx}
            to={lnk.to}
            className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 text-left block group transition-all"
          >
            <span className="text-xs font-bold text-slate-800 block group-hover:text-indigo-600 transition-colors">{lnk.label}</span>
            <span className="text-[10px] text-slate-400 font-medium block mt-0.5">{lnk.subtitle}</span>
          </Link>
        ))}
      </div>
    </section>
  );
});

QuickActions.displayName = "QuickActions";