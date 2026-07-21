import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  FileSpreadsheet,
  FileText,
  FileCode,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const EXPORT_OPTIONS = [
  {
    label: "CSV",
    format: "csv",
    icon: FileCode,
    description: "Comma-separated values",
    accent: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    label: "Excel",
    format: "xlsx",
    icon: FileSpreadsheet,
    description: "Microsoft Excel workbook",
    accent: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    label: "PDF",
    format: "pdf",
    icon: FileText,
    description: "Portable document format",
    accent: "text-red-600",
    bg: "bg-red-50",
  },
];

export function AttendanceReportHeader({ onExport, isExporting }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleClickOutside = useCallback((event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setMenuOpen(false);
    }
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [menuOpen, handleClickOutside]);

  const handleExport = (format) => {
    setMenuOpen(false);
    onExport(format);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6 md:mb-8"
    >
      <div>
        {/* RESPONSIVE: text-xl mobile → sm:text-2xl → lg:text-[1.75rem] */}
        <h1 className="text-xl sm:text-2xl lg:text-[1.75rem] font-semibold text-slate-900 tracking-tight leading-tight">
          Attendance Reports
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
          Review, filter, and export employee attendance summaries
        </p>
      </div>

      <div className="relative shrink-0" ref={menuRef}>
        <motion.button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          disabled={isExporting}
          whileTap={{ scale: 0.97 }}
          className={cn(
            "inline-flex items-center gap-2.5 px-4 sm:px-5 py-2.5 rounded-lg text-sm font-medium",
            "bg-slate-900 text-white hover:bg-slate-800",
            "focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:ring-offset-2",
            "shadow-sm shadow-slate-900/10",
            "transition-colors duration-200",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            /* RESPONSIVE: full width on mobile, auto on sm+ */
            "w-full sm:w-auto justify-center sm:justify-start"
          )}
          aria-haspopup="true"
          aria-expanded={menuOpen}
        >
          {isExporting ? (
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
          ) : (
            <Download className="w-4 h-4" aria-hidden="true" />
          )}
          <span>{isExporting ? "Exporting..." : "Export Report"}</span>
          <ChevronDown
            className={cn(
              "w-3.5 h-3.5 transition-transform duration-200",
              menuOpen && "rotate-180"
            )}
            aria-hidden="true"
          />
        </motion.button>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.96 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              /* RESPONSIVE: w-full on mobile, w-64 on sm+ */
              className="absolute right-0 mt-2.5 w-full sm:w-64 bg-white rounded-xl shadow-xl shadow-slate-900/8 border border-slate-200/80 z-50 overflow-hidden"
              role="menu"
            >
              <div className="px-4 py-2.5 text-[11px] font-semibold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                Choose Format
              </div>
              <div className="p-1.5">
                {EXPORT_OPTIONS.map((option, index) => {
                  const Icon = option.icon;
                  return (
                    <motion.button
                      key={option.format}
                      type="button"
                      onClick={() => handleExport(option.format)}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.04, duration: 0.2 }}
                      whileHover={{ backgroundColor: "rgba(248, 250, 252, 1)" }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        "w-full flex items-start gap-3.5 px-3.5 py-3 rounded-lg text-left",
                        "focus:outline-none focus:bg-slate-50",
                        "transition-colors duration-150"
                      )}
                      role="menuitem"
                    >
                      <div
                        className={cn(
                          "flex items-center justify-center w-9 h-9 rounded-lg shrink-0",
                          option.bg
                        )}
                      >
                        <Icon
                          className={cn("w-4.5 h-4.5", option.accent)}
                          aria-hidden="true"
                        />
                      </div>
                      <div className="pt-0.5">
                        <div className="text-sm font-semibold text-slate-900">
                          {option.label}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                          {option.description}
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}