import React from "react";
import { useFormContext } from "react-hook-form";
import { Power } from "lucide-react";

export const PolicyStatusCard = () => {
  const { register, watch } = useFormContext();
  const isActive = watch("is_active");

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm border-l-4 border-l-indigo-500">
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100">
            <Power className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">Global Strategy Enforcement</h3>
            <p className="text-xs text-slate-500 max-w-xl mt-0.5">
              Control enforcement states dynamically. Turning this policy toggle off bypasses calculations completely across tracking threads.
            </p>
          </div>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={isActive}
          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 ${
            isActive ? "bg-indigo-600" : "bg-slate-200"
          }`}
          onClick={() => document.getElementById("is_active_policy_checkbox")?.click()}
        >
          <span
            aria-hidden="true"
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              isActive ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
        <input
          id="is_active_policy_checkbox"
          type="checkbox"
          {...register("is_active")}
          className="sr-only"
        />
      </div>
    </div>
  );
};