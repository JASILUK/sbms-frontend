import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { HR_ROUTES } from "../../../constants/hrAttendance";

export const ReviewEmptyState = React.memo(() => {
  const navigate = useNavigate();

  return (
    <div className="text-center py-16 px-4 bg-white border border-slate-200 border-dashed rounded-2xl max-w-full flex flex-col items-center">
      <div className="h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-xs mb-4">
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
        </svg>
      </div>
      <h3 className="text-base font-bold text-slate-900 tracking-tight">No Attendance Anomalies Detected</h3>
      <p className="text-xs text-slate-500 max-w-sm mt-1 leading-relaxed">
        All daily transaction streams across current active departments match compliance policy rules completely.
      </p>
      <button
        type="button"
        onClick={() => navigate(HR_ROUTES.DASHBOARD)}
        className="mt-5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
      >
        Return to Dashboard Overview
      </button>
    </div>
  );
});

ReviewEmptyState.displayName = "ReviewEmptyState";