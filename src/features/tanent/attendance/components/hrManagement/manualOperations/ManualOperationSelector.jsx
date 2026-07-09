import React from "react";
import PropTypes from "prop-types";

export default function ManualOperationSelector({ activeOp, onOpChange }) {
  const options = [
    { id: "check-in", title: "Check In", icon: "In" },
    { id: "check-out", title: "Check Out", icon: "Out" },
    { id: "break-start", title: "Break Start", icon: "⏸" },
    { id: "break-end", title: "Break End", icon: "▶" },
    { id: "advanced", title: "Advanced Punch", icon: "⚙" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 w-full" role="radiogroup" aria-label="Select manual tracking operation workflow">
      {options.map((op) => {
        const isSelected = activeOp === op.id;
        return (
          <button
            key={op.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onOpChange(op.id)}
            className={`p-3 rounded-xl border text-center transition-all duration-200 focus:outline-none flex flex-col items-center justify-center gap-1 select-none ${
              isSelected
                ? "border-indigo-600 bg-indigo-50/40 text-indigo-700 ring-2 ring-indigo-600/10 font-bold"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50/50"
            }`}
          >
            <span className="text-xs font-mono opacity-60" aria-hidden="true">{op.icon}</span>
            <span className="text-xs tracking-tight">{op.title}</span>
          </button>
        );
      })}
    </div>
  );
}

ManualOperationSelector.propTypes = {
  activeOp: PropTypes.string.isRequired,
  onOpChange: PropTypes.func.isRequired,
};