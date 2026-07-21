import { Outlet, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { usePermission } from "../../../auth/usePermission";
import { useTenantContext } from "../../tanatContextHook";

// ─── Sub-Navigation Configuration ────────────────────────────────────────────

// Items visible to ALL users with attendance.view
const commonNavItems = [
  { label: "Dashboard", path: "/app/attendance" },
  { label: "Leaves", path: "/app/attendance/leaves" },
  { label: "My Attendance", path: "/app/attendance/my-attendance" },
  { label: "Face Enrolment", path: "/app/attendance/face-enrolment" },
  // Reports visible to all employees
  { label: "Reports", path: "/app/attendance/reports" },
];

// Items visible ONLY to users with attendance.manage permission
const manageNavItems = [
  { label: "Team Attendance", path: "/app/attendance/hr/dashboard" },
  // ENTERPRISE NAVIGATION HOOK ADDITION
  { label: "Face Management", path: "/app/attendance/face-management" },
];

// ─── Mobile Menu Button ────────────────────────────────────────────────────

function MenuButton({ isOpen, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
    >
      <div className="flex flex-col gap-1 w-5">
        <motion.span
          animate={isOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.2 }}
          className="block h-0.5 bg-slate-700 rounded-full origin-center"
        />
        <motion.span
          animate={isOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.2 }}
          className="block h-0.5 bg-slate-700 rounded-full"
        />
        <motion.span
          animate={isOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.2 }}
          className="block h-0.5 bg-slate-700 rounded-full origin-center"
        />
      </div>
      <span className="hidden sm:inline">Menu</span>
    </button>
  );
}

// ─── Attendance Sub-Navbar ───────────────────────────────────────────────────

function AttendanceSubNav() {
  const location = useLocation();
  const { permissions } = useTenantContext();
  const { hasPermission } = usePermission(permissions);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const canManage = hasPermission("tenant.attendance.manage");

  const visibleItems = [
    ...commonNavItems,
    ...(canManage ? manageNavItems : []),
  ];

  const isActive = (path) => {
    if (path === "/app/attendance") {
      return location.pathname === "/app/attendance";
    }
    return location.pathname.startsWith(path);
  };

  const activeItem = visibleItems.find((item) => isActive(item.path));

  return (
    <nav className="w-full border-b border-slate-200/60 bg-white shrink-0">
      {/* Mobile Header: Active Item + Hamburger */}
      <div className="flex items-center justify-between px-4 py-2 lg:hidden">
        <span className="text-sm font-semibold text-slate-900 truncate">
          {activeItem?.label || "Attendance"}
        </span>
        <MenuButton
          isOpen={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((prev) => !prev)}
        />
      </div>

      {/* Desktop Horizontal Nav */}
      <div className="hidden lg:flex items-center gap-1 px-4 py-2 overflow-x-auto scrollbar-hide">
        {visibleItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                relative px-3 py-1.5 rounded-lg text-[13px] font-medium whitespace-nowrap
                transition-all duration-200
                ${active
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                }
              `}
            >
              {item.label}
              {active && (
                <motion.div
                  layoutId="attendanceActiveTab"
                  className="absolute inset-0 bg-slate-900 rounded-lg -z-10"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden border-t border-slate-100"
          >
            <div className="flex flex-col px-2 py-2 gap-1">
              {visibleItems.map((item) => {
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                      relative px-3 py-2.5 rounded-lg text-sm font-medium
                      transition-all duration-200
                      ${active
                        ? "bg-slate-900 text-white"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <span>{item.label}</span>
                      {active && (
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// ─── Attendance Layout ───────────────────────────────────────────────────────

export default function AttendanceLayout() {
  return (
    <div className="flex flex-col h-full min-h-0">
      <AttendanceSubNav />
      {/**
       * RESPONSIVE FIX:
       * - min-w-0 prevents flex child from expanding beyond parent width
       * - overflow-auto allows both horizontal and vertical scroll
       * - p-4 mobile → sm:p-5 → lg:p-6 responsive padding
       */}
      <div className="flex-1 min-w-0 min-h-0 overflow-auto p-4 sm:p-5 lg:p-6">
        <Outlet />
      </div>
    </div>
  );
}