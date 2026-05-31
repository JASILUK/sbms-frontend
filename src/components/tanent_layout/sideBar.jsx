import { useState, useMemo, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  Users, 
  FolderKanban, 
  CreditCard,
  BarChart3,
  Settings,
  FileText,
  LogOut,
  ChevronLeft,
  ChevronDown,
  Plus,
  Building2,
  Check,
  Sparkles,
  X,
  MoreHorizontal,
  ChevronRight,
  Search,
  Bell,
  Shield,
  Zap,
  TrendingUp,
  Archive,
  Building,
  Receipt
} from "lucide-react";
import { menuSections, filterSectionsByPermissions } from "./menu";
import { usePermission } from "../../features/auth/usePermission";
import { useSession } from "../../features/auth/useSession";
import { useSidebar } from "../../layouts/Tanent_layout";
import { useLogoutMutation } from "../../features/auth/authApi";
import { useTenantContext } from "../../features/tanent/tanatContextHook";

// ─── Constants ───────────────────────────────────────────────────────────────
const ACTIVE_COMPANY_KEY = "activeCompanyId";

// ─── Animated Brand Logo ───────────────────────────────────────────────────────
const BrandLogo = ({ collapsed }) => (
  <div className="flex items-center gap-3">
    <motion.div 
      className="relative w-9 h-9 flex-shrink-0"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 rounded-xl opacity-20 blur-md" />
      <div className="relative w-full h-full bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/25 ring-1 ring-white/20">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" fillOpacity="0.95"/>
          <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
          <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
        </svg>
      </div>
    </motion.div>
    
    <AnimatePresence mode="wait">
      {!collapsed && (
        <motion.div
          initial={{ opacity: 0, x: -8, filter: "blur(4px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, x: -8, filter: "blur(4px)" }}
          transition={{ duration: 0.2 }}
          className="flex flex-col"
        >
          <span className="text-[15px] font-bold text-slate-900 tracking-tight leading-none">
            SBMS
          </span>
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] mt-0.5">
            Business OS
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

// ─── Workspace Switcher ──────────────────────────────────────────────────────
const WorkspaceSwitcher = ({ collapsed }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const { session } = useSession();
  const { role, subscription } = useTenantContext();

  const companies = session?.companies || [];

  const [activeCompanyId, setActiveCompanyId] = useState(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(ACTIVE_COMPANY_KEY);
  });

  useEffect(() => {
    const stored = localStorage.getItem(ACTIVE_COMPANY_KEY);
    if (!stored && companies.length > 0) {
      localStorage.setItem(ACTIVE_COMPANY_KEY, companies[0].id);
      setActiveCompanyId(String(companies[0].id));
    }
  }, [companies]);

  const activeWorkspace = useMemo(() => {
    if (!companies.length) return null;
    return (
      companies.find((c) => String(c.id) === String(activeCompanyId)) ||
      companies[0]
    );
  }, [companies, activeCompanyId]);

  const workspaces = useMemo(() => {
    return companies.map((company) => ({
      id: company.id,
      name: company.name,
      role:
        String(company.id) === String(activeCompanyId)
          ? role?.name
          : "Member",
    }));
  }, [companies, activeCompanyId, role]);

  const switchWorkspace = (companyId) => {
    localStorage.setItem(ACTIVE_COMPANY_KEY, String(companyId));
    window.location.href = "/app/dashboard";
  };

  const initials =
    activeWorkspace?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "WS";

  const handleCreateWorkspace = () => {
    setIsOpen(false);
    navigate("/app/workspaces/new");
  };

  const planName = subscription?.plan || 'Free';

  if (collapsed) {
    return (
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-white"
        >
          {initials}
        </motion.button>
        
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, x: -10, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -10, scale: 0.9 }}
              className="absolute left-full ml-3 top-0 w-64 bg-white rounded-xl shadow-2xl border border-slate-200/60 z-50 overflow-hidden"
            >
              <div className="p-2">
                {workspaces.map((ws) => (
                  <button
                    key={ws.id}
                    onClick={() => {
                      switchWorkspace(ws.id);
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 font-semibold text-xs">
                      {ws.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{ws.name}</p>
                      <p className="text-xs text-slate-500">{role?.name || 'Member'}</p>
                    </div>
                    {String(ws.id) === activeCompanyId && <Check className="w-4 h-4 text-indigo-600" />}
                  </button>
                ))}
                <div className="border-t border-slate-100 mt-2 pt-2">
                  <button
                    onClick={handleCreateWorkspace}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors text-left text-indigo-600"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="text-sm font-medium">Create New Workspace</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/60 transition-all duration-200 group"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center text-white font-bold text-xs shadow-sm">
          {initials}
        </div>
        <div className="flex-1 text-left min-w-0">
          <p className="text-sm font-semibold text-slate-900 truncate leading-tight">
            {activeWorkspace?.name || 'Select Workspace'}
          </p>
          <p className="text-[11px] text-slate-500 font-medium">
            {role?.name || 'Member'} • {planName}
          </p>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
            />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-200/60 z-50 overflow-hidden"
            >
              <div className="p-2">
                <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Switch Workspace
                </div>
                {workspaces.map((ws) => {
                  const isActive = String(ws.id) === activeCompanyId;
                  return (
                    <button
                      key={ws.id}
                      onClick={() => {
                        switchWorkspace(ws.id);
                        setIsOpen(false);
                      }}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left
                        ${isActive ? 'bg-indigo-50 text-indigo-900' : 'hover:bg-slate-50 text-slate-700'}
                      `}
                    >
                      <div className={`
                        w-8 h-8 rounded-lg flex items-center justify-center font-semibold text-xs
                        ${isActive ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-600'}
                      `}>
                        {ws.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{ws.name}</p>
                        <p className="text-xs text-slate-500">{role?.name || 'Member'}</p>
                      </div>
                      {isActive && <Check className="w-4 h-4 text-indigo-600" />}
                    </button>
                  );
                })}
                
                <div className="border-t border-slate-100 mt-2 pt-2">
                  <button
                    onClick={handleCreateWorkspace}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors text-left group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <Plus className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-semibold text-indigo-600 group-hover:text-indigo-700">
                      Create New Workspace
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Navigation Item ───────────────────────────────────────────────────────────
const NavItem = ({ item, isActive, collapsed, isSecondary = false }) => {
  const Icon = item.icon;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        to={item.path}
        className={`
          relative flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 group
          ${isActive 
            ? "bg-slate-900 text-white shadow-md shadow-slate-900/20" 
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          }
          ${isSecondary ? "text-slate-500" : ""}
        `}
      >
        {isActive && (
          <motion.div
            layoutId="activeIndicator"
            className="absolute left-0 w-[3px] h-5 bg-indigo-500 rounded-r-full"
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        )}

        <div className={`
          relative flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200
          ${isActive ? "bg-white/10" : "bg-transparent group-hover:bg-white"}
        `}>
          <Icon className={`
            w-[18px] h-[18px] transition-all duration-200
            ${isActive ? "text-white" : isSecondary ? "text-slate-400 group-hover:text-slate-600" : "text-slate-500 group-hover:text-indigo-600"}
          `} />
          
          {item.badge && (
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
          )}
        </div>

        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="flex items-center justify-between flex-1 min-w-0 overflow-hidden"
            >
              <span className={`
                text-[13px] font-medium whitespace-nowrap truncate
                ${isActive ? "text-white font-semibold" : "text-slate-600 group-hover:text-slate-900"}
              `}>
                {item.label}
              </span>
              
              {item.shortcut && (
                <kbd className={`
                  hidden lg:inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium rounded border
                  ${isActive 
                    ? "bg-white/10 border-white/20 text-white/60" 
                    : "bg-slate-100 border-slate-200 text-slate-400"
                  }
                `}>
                  {item.shortcut}
                </kbd>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </Link>

      <AnimatePresence>
        {collapsed && isHovered && (
          <motion.div
            initial={{ opacity: 0, x: -8, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -8, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 pointer-events-none"
          >
            <div className="bg-slate-900 text-white text-[12px] font-semibold px-3 py-2 rounded-lg shadow-xl whitespace-nowrap flex items-center gap-2">
              {item.label}
              {item.shortcut && (
                <span className="text-slate-400 text-[10px]">{item.shortcut}</span>
              )}
            </div>
            <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Navigation Section ────────────────────────────────────────────────────────
const NavigationSection = ({ section, collapsed, isActive, isLast }) => {
  return (
    <nav className="px-3 py-2">
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-3 mb-2"
          >
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">
              {section.title}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-0.5">
        {section.items.map((item) => (
          <NavItem
            key={item.path}
            item={item}
            isActive={isActive(item.path)}
            collapsed={collapsed}
            isSecondary={section.title !== "Main"}
          />
        ))}
      </div>
    </nav>
  );
};

// ─── Plan Usage Card ───────────────────────────────────────────────────────────
const PlanCard = ({ collapsed }) => {
  const navigate = useNavigate();
  const { subscription } = useTenantContext();
  
  const usage = {
    plan: subscription?.plan || "Starter",
    projects: { used: 8, total: 10 },
    members: { used: 12, total: 20 },
  };

  if (collapsed) {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/app/billing/upgrade")}
        className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-amber-700 shadow-sm border border-amber-200/50"
      >
        <Sparkles className="w-5 h-5" />
      </motion.button>
    );
  }

  return (
    <div className="mx-3 p-4 rounded-xl bg-gradient-to-br from-slate-50 to-white border border-slate-200/60 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-100 text-amber-600">
            <Zap className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            {usage.plan} Plan
          </span>
        </div>
        <span className="text-[10px] font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
          80% used
        </span>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between text-[11px] mb-1.5">
            <span className="text-slate-500 font-medium">Projects</span>
            <span className="text-slate-900 font-semibold">{usage.projects.used} / {usage.projects.total}</span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-500 rounded-full"
              style={{ width: `${(usage.projects.used / usage.projects.total) * 100}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-[11px] mb-1.5">
            <span className="text-slate-500 font-medium">Team Members</span>
            <span className="text-slate-900 font-semibold">{usage.members.used} / {usage.members.total}</span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-violet-500 rounded-full"
              style={{ width: `${(usage.members.used / usage.members.total) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate("/app/billing/upgrade")}
        className="w-full mt-4 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-slate-900/10"
      >
        <TrendingUp className="w-3.5 h-3.5" />
        Upgrade Plan
      </motion.button>
    </div>
  );
};

// ─── Account Section ───────────────────────────────────────────────────────────
const AccountSection = ({ user, collapsed }) => {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();
 
  const handleLogout = async () => {
    try {
      await logout().unwrap();
      localStorage.removeItem(ACTIVE_COMPANY_KEY);
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const displayName = user?.username || user?.email?.split('@')[0] || 'User';
  const email = user?.email || '';
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <div className="relative">
      <motion.button
        onClick={() => setShowMenu(!showMenu)}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className={`
          w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-100 transition-all duration-200 group
          ${collapsed ? "justify-center" : ""}
        `}
      >
        <div className="relative">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-white">
            {initials}
          </div>
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
        </div>

        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="flex-1 min-w-0 text-left overflow-hidden"
            >
              <p className="text-[13px] font-semibold text-slate-900 truncate leading-tight">
                {displayName}
              </p>
              <p className="text-[11px] text-slate-500 truncate font-medium">
                {email}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {!collapsed && (
          <MoreHorizontal className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </motion.button>

      <AnimatePresence>
        {showMenu && !collapsed && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMenu(false)}
              className="fixed inset-0 z-40"
            />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-xl border border-slate-200/60 z-50 overflow-hidden"
            >
              <div className="p-1.5">
                <button
                  onClick={() => {
                    setShowMenu(false);
                    navigate("/settings");
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors text-left"
                >
                  <Settings className="w-4 h-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-700">Account Settings</span>
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-rose-50 transition-colors text-left group"
                >
                  <LogOut className="w-4 h-4 text-slate-500 group-hover:text-rose-500" />
                  <span className="text-sm font-medium text-slate-700 group-hover:text-rose-600">
                    Sign Out
                  </span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Main Sidebar Component ──────────────────────────────────────────────────
export default function TenantSidebar() {
  const location = useLocation();
  const { session } = useSession();
  const { permissions } = useTenantContext();
  const { hasPermission } = usePermission(permissions);
  const { isOpen, isMobile, isMobileOpen, toggleSidebar, closeMobileSidebar } = useSidebar();
  
  const user = session?.user;

  // Filter sections based on user permissions
  const filteredSections = useMemo(() => {
    return filterSectionsByPermissions(menuSections, permissions);
  }, [permissions]);

  const isActive = (path) =>  location.pathname.startsWith(path);
  const collapsed = !isOpen && !isMobile;
  const shouldShow = isMobile ? isMobileOpen : true;

  if (!shouldShow) return null;

  return (
    <motion.aside
      initial={isMobile ? { x: -280 } : false}
      animate={{ 
        width: collapsed ? 80 : 280,
        x: 0
      }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 30 
      }}
      className={`
        fixed left-0 top-0 h-screen bg-white z-50 flex flex-col
        ${isMobile ? 'shadow-2xl' : 'shadow-[4px_0_24px_rgba(0,0,0,0.02)]'}
        border-r border-slate-200/60
      `}
    >
      {/* ── Brand Header ───────────────────────────────────────────────────── */}
      <div className="h-16 flex items-center px-4 border-b border-slate-100/80 shrink-0">
        <BrandLogo collapsed={collapsed} />
        
        {!isMobile && (
          <motion.button
            onClick={toggleSidebar}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`
              absolute -right-3 top-5 w-6 h-6 bg-white border border-slate-200 rounded-full 
              shadow-md flex items-center justify-center hover:shadow-lg hover:border-indigo-300 
              transition-all duration-200 z-50
              ${!isOpen ? "rotate-180" : ""}
            `}
          >
            <ChevronLeft className="w-3.5 h-3.5 text-slate-600" />
          </motion.button>
        )}

        {isMobile && (
          <button 
            onClick={closeMobileSidebar}
            className="ml-auto p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        )}
      </div>

      {/* ── Scrollable Content ──────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
        
        {/* Workspace Switcher */}
        <div className={`
          px-3 py-4 border-b border-slate-100/80
          ${collapsed ? 'flex justify-center' : ''}
        `}>
          <WorkspaceSwitcher collapsed={collapsed} />
        </div>

        {/* Navigation Sections */}
        <div className="py-2 space-y-1">
          {filteredSections.map((section, index) => (
            <div key={section.title}>
              <NavigationSection
                section={section}
                collapsed={collapsed}
                isActive={isActive}
                isLast={index === filteredSections.length - 1}
              />
              {index < filteredSections.length - 1 && (
                <div className="mx-3 my-2 border-t border-slate-100" />
              )}
            </div>
          ))}
        </div>

        {/* Plan Usage Card */}
        <div className={`
          px-3 py-4
          ${collapsed ? 'flex justify-center' : ''}
        `}>
          <PlanCard collapsed={collapsed} />
        </div>
      </div>

      {/* ── Account Section (Fixed Bottom) ─────────────────────────────────── */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/30 shrink-0">
        <AccountSection user={user} collapsed={collapsed} />
      </div>
    </motion.aside>
  );
}