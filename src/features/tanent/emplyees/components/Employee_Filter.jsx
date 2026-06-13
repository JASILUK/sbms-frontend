// components/EmployeeFilters.jsx
import { motion } from "framer-motion";
import { Search, X, ChevronDown, Building2, Shield, UserCheck } from "lucide-react";
import { useState, useRef, useEffect } from "react";

function FilterDropdown({ icon: Icon, label, value, onChange, options }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel = options.find(o => o.value === value)?.label || label;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border transition-all duration-200 min-w-[140px] justify-between ${
          value !== "all" 
            ? "bg-blue-50 border-blue-200 text-blue-700" 
            : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
        }`}
      >
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4" />
          <span className="hidden sm:inline">{selectedLabel}</span>
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl border border-gray-200 shadow-lg shadow-gray-200/50 py-1 z-20"
        >
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                value === option.value ? "text-blue-600 font-medium bg-blue-50/50" : "text-gray-700"
              }`}
            >
              {option.label}
              {value === option.value && (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
}

export default function EmployeeFilters({ 
  searchQuery, 
  onSearchChange, 
  filters, 
  onFilterChange, 
  departments, 
  roles,
  hasActiveFilters,
  onClearFilters 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
      className="bg-white rounded-xl border border-gray-200 shadow-sm p-4"
    >
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search employees by name or email"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
          />
          {searchQuery && (
            <button 
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <FilterDropdown
            icon={Building2}
            label="Department"
            value={filters.department}
            onChange={(value) => onFilterChange("department", value)}
            options={[
              { value: "all", label: "All Departments" },
              ...(departments?.map(d => ({ value: d.id, label: d.name })) || [])
            ]}
          />
          
          <FilterDropdown
            icon={Shield}
            label="Role"
            value={filters.role}
            onChange={(value) => onFilterChange("role", value)}
            options={[
              { value: "all", label: "All Roles" },
              ...(roles?.map(r => ({ value: r.id, label: r.name })) || [])
            ]}
          />
          
          <FilterDropdown
            icon={UserCheck}
            label="Status"
            value={filters.status}
            onChange={(value) => onFilterChange("status", value)}
            options={[
              { value: "all", label: "All Status" },
              { value: "active", label: "Active" },
              { value: "blocked", label: "Blocked" }
            ]}
          />
          
          {hasActiveFilters && (
            <button 
              onClick={onClearFilters}
              className="text-sm text-gray-500 hover:text-gray-700 underline underline-offset-2 transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}