import { Outlet, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

// ─── Sub-Navigation Configuration ────────────────────────────────────────────


export const setupNavItems = [
  { label: "Overview",          path: "/app/setup-attendance" },
  { label: "Working Schedules", path: "/app/setup-attendance/working-schedules" },
  { label: "Holidays",          path: "/app/setup-attendance/holidays" },
  { label: "Policies",          path: "/app/setup-attendance/policies" },
  { label: "Face Enrollment",   path: "/app/setup-attendance/face-enrollment" }, // ✅ ADDED: Nav Item Anchor
  { label: "Methods",           path: "/app/setup-attendance/methods" },
  { label: "Shift Templates",   path: "/app/setup-attendance/shift-templates" },
  { label: "Shift Assignments", path: "/app/setup-attendance/shift-assignments" },
];

// ─── Sub-Navigation ───────────────────────────────────────────────────────────

function AttendanceSetupSubNav() {
  const location = useLocation();
  const navRef = useRef(null);

  const isActive = (path) =>
    path === "/app/setup-attendance"
      ? location.pathname === "/app/setup-attendance"
      : location.pathname.startsWith(path);

  // Auto-scroll active item into view on mount and route change
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const activeEl = nav.querySelector('[aria-current="page"]');
    if (activeEl) {
      activeEl.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
    }
  }, [location.pathname]);

  return (
    <nav
      aria-label="Attendance setup"
      className="sticky top-0 z-20 w-full border-b border-slate-200 bg-white"
    >
      <div
        ref={navRef}
        className="
          flex items-center
          overflow-x-auto scrollbar-hide
          px-4 lg:px-8
          gap-0
        "
        role="tablist"
      >
        {setupNavItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              role="tab"
              aria-current={active ? "page" : undefined}
              className={`
                relative flex items-center h-11 px-3.5
                text-[13px] font-medium whitespace-nowrap
                border-b-2 transition-colors duration-[120ms] ease-out
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-slate-900 focus-visible:ring-offset-1
                ${active
                  ? "border-slate-900 text-slate-900 font-semibold"
                  : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
                }
              `}
            >
              {item.label}

              {/* Framer Motion animated underline indicator */}
              {active && (
                <motion.span
                  layoutId="attendanceSetupIndicator"
                  className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-slate-900 rounded-full"
                  transition={{
                    type: "tween",
                    duration: 0.17,
                    ease: "easeOut",
                  }}
                  aria-hidden="true"
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

// ─── Attendance Setup Layout ──────────────────────────────────────────────────

export default function AttendanceSetupLayout() {
  return (
    <div className="flex h-full flex-col bg-white">
      <AttendanceSetupSubNav />

      {/* Scrollable content region */}
      <div className="flex-1 overflow-auto">
        <div
          className="
            mx-auto w-full max-w-[1280px]
            px-4 sm:px-6 lg:px-8
            pt-10 sm:pt-8 lg:pt-12
            pb-16
          "
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}