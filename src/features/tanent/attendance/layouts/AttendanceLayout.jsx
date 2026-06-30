import { Outlet, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { usePermission } from "../../../auth/usePermission";
import { useTenantContext } from "../../tanatContextHook";

// ─── Sub-Navigation Configuration ────────────────────────────────────────────

// Items visible to ALL users with attendance.view
const commonNavItems = [
  { label: "Dashboard", path: "/app/attendance" },
  { label: "Leaves", path: "/app/attendance/leaves" },
  { label: "My Attendance", path: "/app/attendance/my-attendance" },
  { label: "Requests", path: "/app/attendance/requests" },
  { label: "Face Enrolment", path: "/app/attendance/face-enrolment" },
  
];

// Items visible ONLY to users with attendance.manage permission
const manageNavItems = [
  { label: "Team Attendance", path: "/app/attendance/hr-management" },
  { label: "Reports", path: "/app/attendance/reports" },
  
  // ✅ ENTERPRISE NAVIGATION HOOK ADDITION
  { label: "Face Management", path: "/app/attendance/face-management" }
];

// ─── Attendance Sub-Navbar ───────────────────────────────────────────────────

function AttendanceSubNav() {
  const location = useLocation();
  const { permissions } = useTenantContext();
  const { hasPermission } = usePermission(permissions);

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

  return (
    <nav className="w-full border-b border-slate-200/60 bg-white">
      <div className="flex items-center gap-1 px-4 py-2 overflow-x-auto scrollbar-hide">
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
    </nav>
  );
}

// ─── Attendance Layout ───────────────────────────────────────────────────────

export default function AttendanceLayout() {
  return (
    <div className="flex flex-col h-full">
      <AttendanceSubNav />
      <div className="flex-1 overflow-auto p-6">
        <Outlet />
      </div>
    </div>
  );
}