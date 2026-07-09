import React, { useState } from "react";
import PropTypes from "prop-types";

export const ReviewNoteDialog = React.memo(({ isOpen, onCancel, onConfirm, isSubmitting }) => {
  const [noteText, setNoteText] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (noteText.trim().length < 5) {
      alert("Validation Error: Investigative discussion text must possess minimal narrative contents (min 5 characters).");
      return;
    }
    onConfirm(noteText);
    setNoteText("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs" role="dialog" aria-modal="true" aria-labelledby="note-dialog-title">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 flex flex-col gap-4">
        <h3 id="note-dialog-title" className="text-base font-bold text-slate-900">Append Investigative Audit Note</h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          Write internal remarks or tracking status details onto the unalterable shared audit modifications timeline logs without resolving the exception flag.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="audit-note-text" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Investigation Notes Text
            </label>
            <textarea
              id="audit-note-text"
              rows={3}
              required
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Enter ongoing research details or observations concerning this log trace anomaly..."
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-slate-50 text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white leading-relaxed"
            />
          </div>

          <div className="flex justify-end gap-2 text-xs font-semibold pt-2 border-t border-slate-100">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => { setNoteText(""); onCancel(); }}
              className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              {isSubmitting && <span className="h-3 w-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />}
              Append Audit Note
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

ReviewNoteDialog.displayName = "ReviewNoteDialog";
ReviewNoteDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
};