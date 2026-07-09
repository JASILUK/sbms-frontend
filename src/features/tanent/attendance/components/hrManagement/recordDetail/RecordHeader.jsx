import React from "react";
import PropTypes from "prop-types";
import { ATTENDANCE_THEME } from "../../../constants/hrAttendance";

export default function RecordDetailHeader({ headerData, onRefresh, isFetching, isDrawerMode, onCloseDrawer }) {
  if (!headerData) return null;
  const theme = ATTENDANCE_THEME[headerData.attendance_status] || { color: "text-slate-600", bg: "bg-slate-50", border: "border-slate-200" };

  return (
    <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between sticky top-0 z-40 shadow-sm gap-4">
      <div className="flex items-center gap-4 min-w-0">
        {!isDrawerMode && (
          <button
            type="button"
            onClick={() => window.history.back()}
            className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            aria-label="Navigate back"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
        )}
        <div className="flex items-center gap-3">
          <img 
            src={headerData.avatar_url || `https://ui-avatars.com/api/?name=${headerData.employee_name}&background=f8fafc&color=334155`} 
            alt="" 
            className="h-12 w-12 rounded-full border border-slate-200 object-cover bg-slate-50 pointer-events-none select-none"
          />
          <div className="truncate">
            <h1 className="text-lg font-bold text-slate-900 truncate tracking-tight">{headerData.employee_name}</h1>
            <p className="text-xs text-slate-500 font-medium">
              #{headerData.membership_id} • {headerData.department_name} • {headerData.attendance_date}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 self-end sm:self-auto">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${theme.bg} ${theme.color} ${theme.border}`}>
          {headerData.attendance_status}
        </span>
        
        <button
          type="button"
          onClick={onRefresh}
          disabled={isFetching}
          className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors disabled:opacity-40"
          aria-label="Refresh record detail"
        >
          <svg className={`h-5 w-5 ${isFetching ? "animate-spin text-indigo-600" : ""}`} fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
        </button>

        {isDrawerMode && (
          <button
            type="button"
            onClick={onCloseDrawer}
            className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-colors"
            aria-label="Close panel"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

RecordDetailHeader.propTypes = {
  headerData: PropTypes.object,
  onRefresh: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  isDrawerMode: PropTypes.bool.isRequired,
  onCloseDrawer: PropTypes.func,
};