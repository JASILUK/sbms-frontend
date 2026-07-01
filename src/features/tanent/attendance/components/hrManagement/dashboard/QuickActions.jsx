import React from 'react';
import { Link } from 'react-router-dom';
import { HR_ROUTES } from '../../../constants/hrAttendance';

export default function QuickActions() {
  return (
    <section className="bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl shadow-xs p-5 space-y-4" aria-label="Administrative shortcut matrices panel">
      <h2 className="text-base font-bold text-slate-900 dark:text-white">Quick Shortcuts</h2>
      <div className="grid grid-cols-2 gap-2 text-center text-xs font-semibold">
        <Link 
          to={HR_ROUTES.DIRECTORY}
          className="p-3 rounded-xl border border-slate-100 dark:border-slate-900 bg-slate-50/40 dark:bg-slate-900/20 hover:bg-slate-100/60 dark:hover:bg-slate-900/60 text-slate-700 dark:text-slate-300 transition-colors"
        >
          Employee Directory
        </Link>
        <Link 
          to={HR_ROUTES.REVIEW_QUEUE}
          className="p-3 rounded-xl border border-slate-100 dark:border-slate-900 bg-slate-50/40 dark:bg-slate-900/20 hover:bg-slate-100/60 dark:hover:bg-slate-900/60 text-slate-700 dark:text-slate-300 transition-colors"
        >
          Review Queue
        </Link>
      </div>
    </section>
  );
}