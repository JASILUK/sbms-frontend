import React, { useState } from "react";
import PropTypes from "prop-types";
import { useMarkReviewMutation, useClearReviewMutation } from "../../../api/hrAttendance/statusOverrideApi";

export default function ReviewPanel({ recordId, flags, onActionSuccess }) {
  const [reviewReason, setReviewReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [markReviewFn] = useMarkReviewMutation();
  const [clearReviewFn] = useClearReviewMutation();

  const handleReviewToggle = async (actionMode) => {
    if (reviewReason.trim().length < 5) {
      alert("Validation Failure: An audit justification note is mandatory (min 5 characters).");
      return;
    }

    setIsLoading(true);
    try {
      if (actionMode === "mark") {
        await markReviewFn({ recordId, reason: reviewReason }).unwrap();
      } else {
        await clearReviewFn({ recordId, reason: reviewReason }).unwrap();
      }
      setReviewReason("");
      if (onActionSuccess) onActionSuccess();
      alert(`Success: Timesheet row exception review state updated.`);
    } catch (err) {
      alert(`Review workflow error: ${err?.data?.message || "Internal mutation failure."}`);
    } finally {
      setIsLoading(false);
    }
  };

  const isUnderReview = flags?.needs_review;

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-4">
      <div>
        <h4 className="text-xs font-bold text-slate-900 tracking-tight uppercase">Exception Review Operations</h4>
        <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
          Mark records to hold for processing or clear audit anomalies directly from this sub-console window box.
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="review-panel-text" className="sr-only">Review rationale comments</label>
        <textarea
          id="review-panel-text"
          rows={2}
          value={reviewReason}
          onChange={(e) => setReviewReason(e.target.value)}
          placeholder="Provide required descriptive notes context for marking or resolving exception flags..."
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 leading-relaxed"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          disabled={isLoading || isUnderReview}
          onClick={() => handleReviewToggle("mark")}
          className="flex-1 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-xs py-2 rounded-xl transition-colors shadow-xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          Flag Needs Review
        </button>
        <button
          type="button"
          disabled={isLoading || !isUnderReview}
          onClick={() => handleReviewToggle("clear")}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-2 rounded-xl transition-colors shadow-xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          Clear Exception Review
        </button>
      </div>
    </div>
  );
}

ReviewPanel.propTypes = {
  recordId: PropTypes.number.isRequired,
  flags: PropTypes.object,
  onActionSuccess: PropTypes.func.isRequired,
};