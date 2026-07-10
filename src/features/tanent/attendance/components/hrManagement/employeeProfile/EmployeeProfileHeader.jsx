import React, { memo, useCallback, useState } from "react";
import {
  Calendar,
  Mail,
  Building2,
  Briefcase,
  UserCheck,
  Shield,
  Clock,
  Search,
  Filter,
  X,
  ChevronDown,
} from "lucide-react";
import { ORDERING_OPTIONS } from "../../../constants/hrAttendance";

/**
 * EmployeeProfileHeader — Premium Hero Header
 *
 * Contains: Back navigation, employee identity, status badges,
 * date range picker, quick filters, and search.
 */
const EmployeeProfileHeader = memo(
  ({ employee, metadata, filters, onFilterChange, onResetFilters }) => {
    const [showFilters, setShowFilters] = useState(false);

    const handleDateChange = useCallback(
      (field, value) => {
        onFilterChange({ [field]: value });
      },
      [onFilterChange]
    );

    const handleSearchChange = useCallback(
      (e) => {
        onFilterChange({ search_notes: e.target.value });
      },
      [onFilterChange]
    );

    const handleOrderingChange = useCallback(
      (e) => {
        onFilterChange({ ordering: e.target.value });
      },
      [onFilterChange]
    );

    const toggleFilter = useCallback(
      (key) => {
        onFilterChange({ [key]: !filters[key] });
      },
      [filters, onFilterChange]
    );

    if (!employee) return null;

    const avatarUrl = employee.avatar_url || "";
    const initials = employee.full_name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "??";

    const statusColorMap = {
      PRESENT: "bg-emerald-50 text-emerald-700 border-emerald-200",
      ABSENT: "bg-rose-50 text-rose-700 border-rose-200",
      HALF_DAY: "bg-amber-50 text-amber-700 border-amber-200",
      LEAVE: "bg-violet-50 text-violet-700 border-violet-200",
      HOLIDAY: "bg-blue-50 text-blue-700 border-blue-200",
      WEEKEND: "bg-slate-50 text-slate-600 border-slate-200",
      INCOMPLETE: "bg-orange-50 text-orange-700 border-orange-200",
      REVIEW_REQUIRED: "bg-red-50 text-red-700 border-red-200",
    };

    const currentStatusClass =
      statusColorMap[employee.current_attendance_status] ||
      "bg-slate-50 text-slate-600 border-slate-200";

    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Hero Identity Section */}
        <div className="p-6 pb-4">
          <div className="flex items-start gap-5">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={employee.full_name}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-100 shadow-sm"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 border-2 border-slate-100 flex items-center justify-center text-xl font-bold text-slate-500 shadow-sm">
                  {initials}
                </div>
              )}
            </div>

            {/* Identity Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {employee.full_name}
                </h1>
                <span className="text-sm text-slate-400 font-medium">
                  @{employee.username}
                </span>
              </div>

              <div className="mt-2 flex items-center gap-4 flex-wrap text-sm text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  {employee.department_name}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5" />
                  {employee.role_name}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  {employee.email}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  Joined {employee.joined_date}
                </span>
              </div>

              {/* Status Badges */}
              <div className="mt-3 flex items-center gap-2 flex-wrap">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${currentStatusClass}`}
                >
                  <UserCheck className="w-3 h-3" />
                  {employee.current_attendance_status || "Unknown"}
                </span>

                {employee.current_attendance_source && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-50 text-slate-600 border border-slate-200">
                    <Shield className="w-3 h-3" />
                    {employee.current_attendance_source}
                  </span>
                )}

                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-50 text-slate-600 border border-slate-200">
                  <Clock className="w-3 h-3" />
                  {employee.current_shift_name || "No Shift"}
                </span>

                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-50 text-slate-600 border border-slate-200">
                  {employee.employment_status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Toolbar */}
        <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-3">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Date Range */}
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="date"
                value={filters.date_from}
                onChange={(e) => handleDateChange("date_from", e.target.value)}
                className="px-2.5 py-1.5 text-xs font-medium bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-300"
                aria-label="Date from"
              />
              <span className="text-slate-400 text-xs">to</span>
              <input
                type="date"
                value={filters.date_to}
                onChange={(e) => handleDateChange("date_to", e.target.value)}
                className="px-2.5 py-1.5 text-xs font-medium bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-300"
                aria-label="Date to"
              />
            </div>

            <div className="w-px h-6 bg-slate-200" />

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search notes..."
                value={filters.search_notes}
                onChange={handleSearchChange}
                className="pl-8 pr-3 py-1.5 text-xs font-medium bg-white border border-slate-200 rounded-lg text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-300 w-48"
              />
            </div>

            {/* Ordering */}
            <div className="relative">
              <select
                value={filters.ordering}
                onChange={handleOrderingChange}
                className="appearance-none pl-3 pr-8 py-1.5 text-xs font-medium bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-300 cursor-pointer"
                aria-label="Sort order"
              >
                {ORDERING_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>

            {/* Toggle Filters Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                showFilters
                  ? "bg-slate-800 text-white border-slate-800"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              Filters
            </button>

            {/* Clear Filters */}
            {(filters.attendance_status ||
              filters.late_only ||
              filters.needs_review ||
              filters.auto_closed ||
              filters.missing_checkout ||
              filters.holiday_only ||
              filters.weekend_only ||
              filters.leave_only ||
              filters.search_notes) && (
              <button
                onClick={onResetFilters}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-rose-600 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors"
              >
                <X className="w-3 h-3" />
                Clear
              </button>
            )}
          </div>

          {/* Expanded Quick Filters */}
          {showFilters && (
            <div className="mt-3 pt-3 border-t border-slate-200 flex items-center gap-2 flex-wrap">
              {[
                { key: "late_only", label: "Late Only", color: "amber" },
                { key: "needs_review", label: "Needs Review", color: "rose" },
                { key: "auto_closed", label: "Auto Closed", color: "cyan" },
                { key: "missing_checkout", label: "Missing Checkout", color: "pink" },
                { key: "holiday_only", label: "Holidays", color: "blue" },
                { key: "weekend_only", label: "Weekends", color: "slate" },
                { key: "leave_only", label: "Leave", color: "violet" },
              ].map((filter) => {
                const isActive = filters[filter.key];
                const colorMap = {
                  amber: isActive
                    ? "bg-amber-100 text-amber-800 border-amber-300"
                    : "bg-white text-slate-500 border-slate-200 hover:bg-amber-50",
                  rose: isActive
                    ? "bg-rose-100 text-rose-800 border-rose-300"
                    : "bg-white text-slate-500 border-slate-200 hover:bg-rose-50",
                  cyan: isActive
                    ? "bg-cyan-100 text-cyan-800 border-cyan-300"
                    : "bg-white text-slate-500 border-slate-200 hover:bg-cyan-50",
                  pink: isActive
                    ? "bg-pink-100 text-pink-800 border-pink-300"
                    : "bg-white text-slate-500 border-slate-200 hover:bg-pink-50",
                  blue: isActive
                    ? "bg-blue-100 text-blue-800 border-blue-300"
                    : "bg-white text-slate-500 border-slate-200 hover:bg-blue-50",
                  slate: isActive
                    ? "bg-slate-200 text-slate-800 border-slate-300"
                    : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50",
                  violet: isActive
                    ? "bg-violet-100 text-violet-800 border-violet-300"
                    : "bg-white text-slate-500 border-slate-200 hover:bg-violet-50",
                };
                return (
                  <button
                    key={filter.key}
                    onClick={() => toggleFilter(filter.key)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${colorMap[filter.color]}`}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }
);

EmployeeProfileHeader.displayName = "EmployeeProfileHeader";

export default EmployeeProfileHeader;