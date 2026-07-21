import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const LIMIT_OPTIONS = [10, 25, 50, 100];

function getPageNumbers(currentPage, totalPages, maxVisible = 5) {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages = [];
  const half = Math.floor(maxVisible / 2);
  let start = Math.max(1, currentPage - half);
  let end = Math.min(totalPages, currentPage + half);

  if (currentPage <= half) {
    end = maxVisible;
  } else if (currentPage >= totalPages - half) {
    start = totalPages - maxVisible + 1;
  }

  if (start > 1) {
    pages.push(1);
    if (start > 2) pages.push("...");
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (end < totalPages) {
    if (end < totalPages - 1) pages.push("...");
    pages.push(totalPages);
  }

  return pages;
}

export function AttendancePagination({
  pagination,
  onPageChange,
  onLimitChange,
  isLoading,
}) {
  const currentPage = pagination?.current_page || 1;
  const totalPages = pagination?.total_pages || 1;
  const count = pagination?.count || 0;
  const limit = pagination?.limit || 25;
  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  const pageNumbers = useMemo(
    () => getPageNumbers(currentPage, totalPages),
    [currentPage, totalPages]
  );

  const startItem = count > 0 ? (currentPage - 1) * limit + 1 : 0;
  const endItem = Math.min(currentPage * limit, count);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      /* RESPONSIVE: flex-col mobile → sm:flex-row */
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6"
    >
      {/* RESPONSIVE: text-center mobile → sm:text-left */}
      <div className="text-sm text-slate-500 text-center sm:text-left">
        <span className="font-medium text-slate-900">{startItem}</span>
        {" — "}
        <span className="font-medium text-slate-900">{endItem}</span>
        <span className="text-slate-400"> of </span>
        <span className="font-medium text-slate-900">{count.toLocaleString()}</span>
        <span className="text-slate-400"> employees</span>
      </div>

      {/* RESPONSIVE: justify-center mobile → sm:justify-end */}
      <div className="flex items-center justify-center sm:justify-end gap-3">
        <div className="flex items-center gap-2">
          <label
            htmlFor="page-limit"
            className="text-xs font-medium text-slate-500"
          >
            Show
          </label>
          <select
            id="page-limit"
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            disabled={isLoading}
            className={cn(
              "rounded-lg border border-slate-200 bg-white",
              "py-1.5 pl-2.5 pr-7 text-xs font-medium text-slate-700",
              "focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/5",
              "hover:border-slate-300",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "transition-all duration-150"
            )}
          >
            {LIMIT_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <nav
          aria-label="Pagination"
          className="flex items-center gap-0.5"
        >
          <PaginationButton
            onClick={() => onPageChange(1)}
            disabled={!hasPrevious || isLoading}
            aria-label="First page"
          >
            <ChevronsLeft className="w-3.5 h-3.5" aria-hidden="true" />
          </PaginationButton>

          <PaginationButton
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!hasPrevious || isLoading}
            aria-label="Previous page"
          >
            <ChevronLeft className="w-3.5 h-3.5" aria-hidden="true" />
          </PaginationButton>

          {pageNumbers.map((page, index) =>
            page === "..." ? (
              <span
                key={`ellipsis-${index}`}
                className="px-2 py-1.5 text-xs text-slate-400 select-none"
              >
                ...
              </span>
            ) : (
              <motion.button
                key={page}
                type="button"
                onClick={() => onPageChange(page)}
                disabled={isLoading}
                whileTap={{ scale: 0.92 }}
                className={cn(
                  "min-w-[2.25rem] h-8 px-2 rounded-lg text-xs font-semibold",
                  "focus:outline-none focus:ring-2 focus:ring-slate-900/20",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "transition-colors duration-150",
                  page === currentPage
                    ? "bg-slate-900 text-white shadow-sm shadow-slate-900/20"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
                aria-label={`Page ${page}`}
                aria-current={page === currentPage ? "page" : undefined}
              >
                {page}
              </motion.button>
            )
          )}

          <PaginationButton
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!hasNext || isLoading}
            aria-label="Next page"
          >
            <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
          </PaginationButton>

          <PaginationButton
            onClick={() => onPageChange(totalPages)}
            disabled={!hasNext || isLoading}
            aria-label="Last page"
          >
            <ChevronsRight className="w-3.5 h-3.5" aria-hidden="true" />
          </PaginationButton>
        </nav>
      </div>
    </motion.div>
  );
}

function PaginationButton({ children, onClick, disabled, ...props }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: 0.9 }}
      className={cn(
        "p-1.5 rounded-lg text-slate-500",
        "hover:text-slate-900 hover:bg-slate-100",
        "focus:outline-none focus:ring-2 focus:ring-slate-900/20",
        "disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent",
        "transition-colors duration-150"
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}