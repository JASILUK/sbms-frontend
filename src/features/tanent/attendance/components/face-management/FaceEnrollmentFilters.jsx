import React from 'react';
import { Search } from 'lucide-react';
import { STATUS_FILTER_OPTIONS, SOURCE_FILTER_OPTIONS } from '../../constants/faceManagementConstants';

export function FaceEnrollmentFilters({ search, onSearchChange, status, onStatusChange, source, onSourceChange }) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-3xs flex flex-col md:flex-row items-center gap-3 w-full">
      <div className="relative w-full md:flex-1">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search corporate profile identifier (username)..."
          className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 font-medium transition-all"
        />
      </div>
      <div className="flex gap-2 w-full md:w-auto">
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="w-full md:w-40 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold focus:outline-hidden cursor-pointer text-xs"
        >
          {STATUS_FILTER_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
        <select
          value={source}
          onChange={(e) => onSourceChange(e.target.value)}
          className="w-full md:w-40 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold focus:outline-hidden cursor-pointer text-xs"
        >
          {SOURCE_FILTER_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      </div>
    </div>
  );
}