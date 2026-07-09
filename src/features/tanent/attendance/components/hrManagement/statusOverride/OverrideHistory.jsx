import React from "react";
import PropTypes from "prop-types";

export default function OverrideHistory({ auditHistory = [] }) {
  if (!auditHistory?.length) return null;

  return (
    <div className="space-y-2 w-full pt-1">
      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Administrative Override History Log</h4>
      <div className="border border-slate-200/80 bg-white rounded-xl overflow-hidden shadow-xs max-h-[160px] overflow-y-auto">
        <table className="w-full text-left border-collapse font-mono text-[11px]" role="grid">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-sans font-bold uppercase tracking-wider text-[10px]">
              <th className="py-2 px-3">Timestamp</th>
              <th className="py-2 px-3">Override Action Context Reason</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-600 bg-white">
            {auditHistory.map((item, index) => (
              <tr key={item.id || index} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-2 px-3 font-semibold text-slate-900 whitespace-nowrap">
                  {item.created_at ? new Date(item.created_at).toLocaleDateString() : "N/A"}
                </td>
                <td className="py-2 px-3 font-sans leading-relaxed text-slate-700">
                  <span className="font-mono text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-1 rounded mr-1">
                    {item.reason?.substring(0, 15) || "MANUAL_ADJ"}
                  </span>
                  {item.reason || "Manual historical configuration alignment override committed."}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

OverrideHistory.propTypes = {
  auditHistory: PropTypes.array,
};