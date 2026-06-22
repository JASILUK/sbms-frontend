import React from "react";

export const ScheduleHeader = ({ isActive, hasSchedule }) => {
  return (
    <div className="border-b border-gray-200/80 pb-5 md:pb-6 mb-6 md:mb-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        {/* Left Side: Identity & Context */}
        <div className="space-y-1.5 max-w-2xl">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl font-sans">
            Working Schedule
          </h1>
          <p className="text-sm md:text-[15px] leading-relaxed text-gray-500 font-sans">
            Define how working hours and attendance calculations apply across your organization.
          </p>
        </div>

        {/* Right Side: Operational Status */}
        {hasSchedule && (
          <div className="flex items-center shrink-0 sm:mt-1">
            {/* Screen-reader only status announcement for accessibility */}
            <span className="sr-only">Schedule status: {isActive ? "Active" : "Inactive"}</span>
            
            <span
              aria-hidden="true"
              className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold border transition-opacity duration-150 ease-in-out font-sans ${
                isActive
                  ? "bg-green-50 text-green-800 border-green-200/60"
                  : "bg-gray-50 text-gray-700 border-gray-200"
              }`}
            >
              <span 
                className={`h-1.5 w-1.5 rounded-full ${
                  isActive ? "bg-green-600" : "bg-gray-400"
                }`} 
              />
              {isActive ? "Active" : "Inactive"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};