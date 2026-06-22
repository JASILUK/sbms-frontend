import React from "react";
import { formatHumanReadableDate } from "../../utils/holidayHelpers";

export const HolidayPreviewTable = ({ data = [] }) => {
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden max-h-64 overflow-y-auto shadow-inner">
      <table className="w-full text-left border-collapse text-xs">
        <thead className="bg-slate-50 sticky top-0 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider z-10">
          <tr>
            <th className="px-4 py-2.5">Statutory Title</th>
            <th className="px-4 py-2.5">Date Target</th>
            <th className="px-4 py-2.5">Inferred Type</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-600 bg-white">
          {data.map((item, idx) => (
            <tr key={item.external_id || idx} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-4 py-2.5 font-semibold text-slate-900">{item.name}</td>
              <td className="px-4 py-2.5 font-medium">{formatHumanReadableDate(item.holiday_date)}</td>
              <td className="px-4 py-2.5">
                <span className="px-2 py-0.5 rounded-full bg-slate-100 font-medium text-slate-600 capitalize">
                  {item.holiday_type || "Public"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};