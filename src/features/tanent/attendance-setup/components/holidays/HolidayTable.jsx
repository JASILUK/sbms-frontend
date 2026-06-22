import React from "react";
import { formatHumanReadableDate, getHolidayTypeBadgeStyles } from "../../utils/holidayHelpers";
import { HolidayRowActions } from "./HolidayRowActions";
import { Check, AlertCircle } from "lucide-react";

export const HolidayTable = ({ holidays = [], onEdit, onDelete, onView }) => {
  return (
    <div className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <th className="px-6 py-4">Holiday Name</th>
              <th className="px-6 py-4">Classification</th>
              <th className="px-6 py-4">Operational Date</th>
              <th className="px-6 py-4">Paid State</th>
              <th className="px-6 py-4">Duration Context</th>
              <th className="px-6 py-4 text-right pr-8">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {holidays.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-semibold text-slate-900">{item.name}</div>
                  {item.holiday_provider && (
                    <div className="text-xs text-slate-400 mt-0.5">Fed via {item.holiday_provider}</div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center border rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${getHolidayTypeBadgeStyles(item.holiday_type)}`}>
                    {item.holiday_type}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium text-slate-600">
                  {formatHumanReadableDate(item.holiday_date)}
                </td>
                <td className="px-6 py-4">
                  {item.is_paid ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">
                      <Check className="h-3 w-3" /> Paid Holiday
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md">
                      Unpaid Day
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {item.is_half_day ? (
                    <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                      Half-Day Shift
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                      Full Day Lock
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right pr-8">
                  <HolidayRowActions
                    onEdit={() => onEdit(item)}
                    onDelete={() => onDelete(item.id)}
                    onView={() => onView(item)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};