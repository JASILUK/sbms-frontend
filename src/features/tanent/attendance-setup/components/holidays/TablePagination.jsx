import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const TablePagination = ({ currentPage, totalCount, limit = 50, onPageChange, hasNext, hasPrevious }) => {
  const totalPages = Math.ceil(totalCount / limit) || 1;

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-slate-200 bg-white px-4 py-3.5 sm:px-6 rounded-b-xl shadow-xs">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrevious}
          className="relative inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNext}
          className="relative ml-3 inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-xs text-slate-500 font-medium">
            Showing page <span className="font-bold text-slate-800">{currentPage}</span> of{" "}
            <span className="font-bold text-slate-800">{totalPages}</span> sheets (
            <span className="font-bold text-slate-700">{totalCount}</span> total entries)
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-2xs" aria-label="Pagination Navigation">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={!hasPrevious}
              className="relative inline-flex items-center rounded-l-md border border-slate-200 bg-white px-2 py-2 text-slate-400 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 disabled:opacity-40 cursor-pointer"
            >
              <span className="sr-only">Previous Page</span>
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            <span className="relative inline-flex items-center border border-slate-200 bg-indigo-50/40 px-4 py-2 text-xs font-bold text-indigo-600 focus:z-20">
              {currentPage}
            </span>

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={!hasNext}
              className="relative inline-flex items-center rounded-r-md border border-slate-200 bg-white px-2 py-2 text-slate-400 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 disabled:opacity-40 cursor-pointer"
            >
              <span className="sr-only">Next Page</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};