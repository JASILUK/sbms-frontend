// components/DepartmentHeader.jsx
import { motion } from "framer-motion";
import { Building2, Plus, ChevronRight } from "lucide-react";

export default function DepartmentHeader({ onCreate }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      {/* Breadcrumb */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="flex items-center gap-1.5 mb-4 sm:mb-5"
      >
        <span className="text-[0.75rem] font-medium text-gray-400 hover:text-gray-500 transition-colors cursor-pointer">
          Organization
        </span>
        <ChevronRight className="w-3.5 h-3.5 text-gray-300" strokeWidth={2} />
        <span className="text-[0.75rem] font-semibold text-gray-700">
          Departments
        </span>
      </motion.nav>

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-6">
        {/* Title Section */}
        <div className="flex items-start gap-3.5 sm:gap-4">
          {/* Premium icon container with gradient glow */}
          <motion.div
            whileHover={{ scale: 1.05, rotate: 2 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="relative flex-shrink-0"
          >
            <div className="absolute inset-0 bg-violet-500/20 rounded-2xl blur-xl scale-150" />
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-violet-500 via-violet-600 to-indigo-600 shadow-lg shadow-violet-500/25 flex items-center justify-center">
              <Building2 className="w-6 h-6 sm:w-7 sm:h-7 text-white" strokeWidth={1.5} />
            </div>
          </motion.div>

          <div className="pt-0.5">
            <h1 
              className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight leading-tight"
              style={{ fontFamily: "'Inter', 'DM Sans', system-ui, sans-serif" }}
            >
              Departments
            </h1>
            <p className="text-sm sm:text-[0.9rem] text-gray-500 mt-1 leading-relaxed max-w-lg">
              Manage organizational structure, team hierarchies, and department configurations across your workspace.
            </p>
          </div>
        </div>

        {/* Premium CTA Button */}
        <motion.button
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.97 }}
          onClick={onCreate}
          className="group relative flex-shrink-0 inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 
            bg-gradient-to-r from-violet-600 via-violet-600 to-indigo-600 
            text-white text-sm font-semibold rounded-xl 
            shadow-lg shadow-violet-500/30 hover:shadow-violet-500/40 
            transition-all duration-300 ease-out
            active:shadow-md
            w-full sm:w-auto"
        >
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Plus className="w-4 h-4 relative z-10" strokeWidth={2.5} />
          <span className="relative z-10">Create Department</span>
        </motion.button>
      </div>
    </motion.div>
  );
}