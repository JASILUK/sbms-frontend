import React from "react";
import PropTypes from "prop-types";
import { RotateCw, X, ArrowLeft, PlusCircle } from "lucide-react";
import { ATTENDANCE_THEME } from "../../../constants/hrAttendance";

export default function RecordDetailHeader({ 
  headerData, 
  onRefresh, 
  isFetching, 
  isDrawerMode, 
  onCloseDrawer,
  onOpenManualOps,
  navigateBack
}) {
  if (!headerData) return null;
  
  const theme = ATTENDANCE_THEME[headerData.attendance_status] || { 
    color: "text-slate-600", 
    bg: "bg-slate-50", 
    border: "border-slate-200" 
  };

  return (
    <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
      {/* Profile & Metadata block */}
      <div className="flex items-center gap-3.5 min-w-0">
        {!isDrawerMode && navigateBack && (
          <button
            type="button"
            onClick={navigateBack}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            aria-label="Return to Ledger"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        )}
        
        <div className="flex items-center gap-3.5">
          <img 
            src={headerData.avatar_url || `https://ui-avatars.com/api/?name=${headerData.employee_name}&background=f8fafc&color=334155`} 
            alt="" 
            className="h-11 w-11 rounded-full border border-slate-200 object-cover bg-slate-50 pointer-events-none select-none"
          />
          <div className="truncate">
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-slate-900 truncate tracking-tight">
                {headerData.employee_name}
              </h1>
              <span className="font-mono text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded font-normal">
                #{headerData.membership_id}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              {headerData.department_name} &bull; <span className="text-slate-500 font-semibold">{headerData.attendance_date}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Control Tools block */}
      <div className="flex items-center gap-2.5 self-end sm:self-auto">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider border ${theme.bg} ${theme.color} ${theme.border}`}>
          {headerData.attendance_status}
        </span>

        <div className="h-5 w-[1px] bg-slate-200 mx-1 hidden sm:block" />
        
        <button
          type="button"
          onClick={onRefresh}
          disabled={isFetching}
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all disabled:opacity-40 cursor-pointer"
          aria-label="Synchronize live parameters"
        >
          <RotateCw className={`h-4 w-4 ${isFetching ? "animate-spin text-slate-600" : ""}`} />
        </button>

        {onOpenManualOps && (
          <button
            type="button"
            onClick={onOpenManualOps}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-xl font-semibold text-xs shadow-2xs hover:bg-slate-50 transition-all cursor-pointer"
          >
            <PlusCircle className="h-3.5 w-3.5 text-slate-400" />
            Manual Entry
          </button>
        )}

        {isDrawerMode && onCloseDrawer && (
          <button
            type="button"
            onClick={onCloseDrawer}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            aria-label="Close layout overlay panel"
          >
            <X className="h-4 w-4" />
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
  onOpenManualOps: PropTypes.func,
  navigateBack: PropTypes.func,
};