import React, { useState, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { Search, Check } from "lucide-react";

export const EmployeeMultiSelect = ({ employees = [] }) => {
  const { setValue, watch } = useFormContext();
  const currentSelection = watch("membership_ids") || [];
  const [searchTerm, setSearchTerm] = useState("");

  // FIXED: Adjusted filter matching parameters to parse over username and email fields
  const filteredEmployees = useMemo(() => {
    if (!searchTerm.trim()) return employees;
    const query = searchTerm.toLowerCase();
    return employees.filter((e) => {
      const username = e.username || "";
      const email = e.user_email || "";
      const title = e.job_title || "";
      const dept = e.department_name || "";
      
      return `${username} ${email} ${title} ${dept}`.toLowerCase().includes(query);
    });
  }, [searchTerm, employees]);

  const toggleEmployee = (id) => {
    const stringId = String(id);
    const updated = currentSelection.includes(stringId)
      ? currentSelection.filter((item) => item !== stringId)
      : [...currentSelection, stringId];
    setValue("membership_ids", updated, { shouldValidate: true });
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
          <Search className="h-3.5 w-3.5" />
        </div>
        <input
          type="search"
          placeholder="Filter staff by name or job role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full rounded-lg border border-slate-200 bg-white py-1.5 pl-9 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-hidden"
        />
      </div>

      <div className="border border-slate-200 rounded-xl max-h-56 overflow-y-auto divide-y divide-slate-100 bg-white shadow-inner">
        {filteredEmployees.length === 0 ? (
          <p className="p-4 text-xs text-slate-400 text-center">No staff metrics match search criteria terms.</p>
        ) : (
          filteredEmployees.map((emp) => {
            const isChecked = currentSelection.includes(String(emp.id));
            return (
              <button
                key={emp.id}
                type="button"
                onClick={() => toggleEmployee(emp.id)}
                className="w-full flex items-center justify-between p-3 text-left hover:bg-slate-50/80 transition-colors cursor-pointer focus:outline-hidden"
              >
                <div>
                  {/* FIXED: Swapped out absent name combinations with actual backend username and email fields */}
                  <span className="font-semibold text-slate-900 block text-xs">
                    {emp.username}
                    {emp.user_email && (
                      <span className="text-slate-400 font-normal normal-case ml-1.5">
                        ({emp.user_email})
                      </span>
                    )}
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    {emp.job_title || `${emp.department_name || "ITT"} Associate`}
                  </span>
                </div>
                <div className={`h-4 w-4 rounded border flex items-center justify-center transition-colors border-slate-300 ${
                  isChecked ? "bg-indigo-600 border-indigo-600 text-white" : "bg-white"
                }`}>
                  {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};