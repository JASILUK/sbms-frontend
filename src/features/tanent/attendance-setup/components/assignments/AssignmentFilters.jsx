import React from "react";
import { useGetShiftsQuery } from "../../api/attendanceSetupApi";
import { useGetEmployeesQuery } from "../../../emplyees/emplyeeApi";
import { Search } from "lucide-react";


export const AssignmentFilters = ({ filters, onFilterChange }) => {
  const { data: shiftsBody } = useGetShiftsQuery();
  const { data: employeesBody } = useGetEmployeesQuery();

  const shiftsList = shiftsBody?.data?.results || shiftsBody?.data || [];
  const employeesList = employeesBody?.data || employeesBody || [];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-3xs">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        
        {/* Client Side Debounced Lookup */}
        <div className="relative">
          <label htmlFor="assignment-search" className="sr-only">Search Headcount</label>
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            id="assignment-search"
            type="search"
            placeholder="Search employee..."
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            className="block w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </div>

        {/* Shift Matrices Dropdown */}
        <div>
          <select
            aria-label="Shift Filter Matrix"
            value={filters.shift_id}
            onChange={(e) => onFilterChange("shift_id", e.target.value)}
            className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-hidden cursor-pointer"
          >
            <option value="all">All Available Shifts</option>
            {shiftsList.map((s) => (
              <option key={s.public_id || s.id} value={s.public_id || s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        {/* Individual Profile Selection Vector */}
        <div>
          <select
            aria-label="Individual Employee Profile Filter"
            value={filters.membership_id}
            onChange={(e) => onFilterChange("membership_id", e.target.value)}
            className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-hidden cursor-pointer"
          >
            <option value="all">All Staff Members</option>
            {employeesList.map((emp) => (
              <option key={emp.id} value={emp.id}>{emp.first_name || emp.username || "Staff Profile"}</option>
            ))}
          </select>
        </div>

        {/* Operational Status */}
        <div>
          <select
            aria-label="Lifecycle Status Flag Filter"
            value={filters.active_only}
            onChange={(e) => onFilterChange("active_only", e.target.value)}
            className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-hidden cursor-pointer"
          >
            <option value="all">All Lifecycle Contexts</option>
            <option value="true">Active Allocation Layers</option>
            <option value="false">Historical Logs Only</option>
          </select>
        </div>

        {/* Ordering Constraints */}
        <div>
          <select
            aria-label="Chronological Ordering Criteria"
            value={filters.ordering}
            onChange={(e) => onFilterChange("ordering", e.target.value)}
            className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-hidden cursor-pointer"
          >
            <option value="-effective_from">Allocation: Newest First</option>
            <option value="effective_from">Allocation: Oldest First</option>
          </select>
        </div>

      </div>
    </div>
  );
};