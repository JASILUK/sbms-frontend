import React from 'react';
import { Link } from 'react-router-dom';
import { Inbox } from 'lucide-react';

export const DashboardPendingRequests = React.memo(({ pending }) => {
  const visibleItems = pending?.items?.slice(0, 3) || [];

  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex flex-col justify-between space-y-4">
      <div className="space-y-0.5">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Regularization Queue</h3>
        <p className="text-[11px] text-slate-400 font-normal">Active review applications tracked by governance.</p>
      </div>

      {visibleItems.length === 0 ? (
        <div className="border border-dashed border-slate-100 bg-slate-50/20 rounded-xl p-5 text-center flex flex-col items-center justify-center space-y-1.5 my-auto">
          <Inbox className="h-4 w-4 text-slate-400 stroke-[1.5]" />
          <p className="text-[10px] text-slate-400 font-normal">No pending requests.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {visibleItems.map((item, index) => (
            <div key={index} className="p-3 border border-slate-100 rounded-xl bg-slate-50/30 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <p className="font-bold text-slate-800">{item.title}</p>
                <p className="text-[10px] text-slate-400 font-normal">{item.date}</p>
              </div>
              <span className="px-2 py-0.5 bg-amber-100 border border-amber-200/50 rounded-md text-amber-800 text-[9px] font-mono uppercase font-bold">
                {item.status || 'Pending'}
              </span>
            </div>
          ))}
        </div>
    )}

      <div className="pt-1 border-t border-slate-100 flex w-full">
        <Link 
          to="/app/attendance/requests" 
          className="text-[11px] font-bold tracking-tight text-indigo-600 hover:text-indigo-800 transition-colors focus:outline-hidden focus:underline"
        >
          View All Requests
        </Link>
      </div>
    </div>
  );
});

DashboardPendingRequests.displayName = 'DashboardPendingRequests';