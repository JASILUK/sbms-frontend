import React from "react";
import { useFormContext } from "react-hook-form";
import { Cpu } from "lucide-react";

export const AutomationCard = () => {
  const { register } = useFormContext();

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="p-2 bg-slate-50 text-slate-600 rounded-lg border border-slate-200/60">
          <Cpu className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-900">Attendance Automation</h3>
          <p className="text-xs text-slate-500">Configure background cron validation parameters and request operational state behaviors.</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="relative flex items-start rounded-xl border border-slate-100 bg-slate-50/30 p-4 hover:bg-slate-50/60 transition-colors">
          <div className="flex h-5 items-center">
            <input
              id="auto_absent_if_no_checkin"
              type="checkbox"
              {...register("auto_absent_if_no_checkin")}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="auto_absent_if_no_checkin" className="font-semibold text-slate-800">
              Mark employees absent when no check-in exists
            </label>
            <p className="text-xs text-slate-500 mt-0.5">
              Automated end-of-day processes assign structural absence markers if hardware or web check-in sequences are missing.
            </p>
          </div>
        </div>

        <div className="relative flex items-start rounded-xl border border-slate-100 bg-slate-50/30 p-4 hover:bg-slate-50/60 transition-colors">
          <div className="flex h-5 items-center">
            <input
              id="attendance_regularization_enabled"
              type="checkbox"
              {...register("attendance_regularization_enabled")}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="attendance_regularization_enabled" className="font-semibold text-slate-800">
              Allow attendance regularization requests
            </label>
            <p className="text-xs text-slate-500 mt-0.5">
              Empower personnel nodes to dispatch alignment corrections requests to adjust system tracking misalignments.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};