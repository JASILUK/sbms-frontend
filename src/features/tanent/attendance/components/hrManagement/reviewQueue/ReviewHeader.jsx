import React from "react";
import PropTypes from "prop-types";

export const ReviewHeader = React.memo(({ onRefresh, isFetching }) => {
  return (
    <div className="border-b border-slate-200 bg-white px-6 py-5 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Attendance Review Queue</h1>
        <p className="text-xs font-medium text-slate-500 mt-1">
          Investigate structural timeline anomalies and clear verified tracking exceptions
        </p>
      </div>
      <button
        type="button"
        onClick={onRefresh}
        disabled={isFetching}
        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-40 shadow-xs cursor-pointer"
      >
        <svg className={`h-4 w-4 text-slate-500 ${isFetching ? "animate-spin text-indigo-600" : ""}`} fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
        Synchronize Queue
      </button>
    </div>
  );
});

ReviewHeader.displayName = "ReviewHeader";
ReviewHeader.propTypes = {
  onRefresh: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
};