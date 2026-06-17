// features/settings/pages/SettingsLayout.jsx
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Settings, 
  Shield, 
  User, 
  ChevronRight,
  Home,
  Building2,
  LayoutDashboard
} from "lucide-react";
import { useGetMeQuery } from "../../auth/authApi";

// Breadcrumb component
function Breadcrumb({ items }) {
  return (
    <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {index > 0 && <ChevronRight className="w-4 h-4" />}
          {item.onClick ? (
            <button
              onClick={item.onClick}
              className="hover:text-violet-600 transition-colors flex items-center gap-1.5"
            >
              {item.icon && <item.icon className="w-4 h-4" />}
              {item.label}
            </button>
          ) : (
            <span className="text-gray-900 font-medium flex items-center gap-1.5">
              {item.icon && <item.icon className="w-4 h-4" />}
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}

export default function SettingsLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: userData } = useGetMeQuery();
  
  const isHome = location.pathname === "/settings";
  const isProfile = location.pathname === "/settings/profile";
  const isSecurity = location.pathname === "/settings/security";
  
  // Detect user type
  const isPlatformUser = userData?.account_type === "platform";
  const dashboardPath = isPlatformUser ? "/platform/dashboard" : "/app/dashboard";
  const userLabel = isPlatformUser ? "Platform" : "Workspace";

  // Build breadcrumbs
  const getBreadcrumbs = () => {
    const items = [
      { 
        label: userLabel, 
        icon: isPlatformUser ? Building2 : LayoutDashboard,
        onClick: () => navigate(dashboardPath) 
      },
      { 
        label: "Settings", 
        icon: Settings,
        onClick: isHome ? undefined : () => navigate("/settings") 
      },
    ];

    if (isProfile) {
      items.push({ label: "Profile", icon: User });
    } else if (isSecurity) {
      items.push({ label: "Security", icon: Shield });
    }

    return items;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/50">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Back to Dashboard */}
            <button
              onClick={() => navigate(dashboardPath)}
              className="flex items-center gap-2 text-gray-600 hover:text-violet-600 transition-colors group px-3 py-2 rounded-lg hover:bg-violet-50"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span className="text-sm font-medium hidden sm:inline">Back to {userLabel}</span>
            </button>

            {/* Center: Page Title */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center text-violet-600">
                <Settings className="w-4 h-4" />
              </div>
              <span className="font-semibold text-gray-900">Settings</span>
            </div>

            {/* Right: User Info Placeholder */}
            <div className="w-24" /> {/* Spacer for balance */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs (except on home) */}
        {!isHome && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Breadcrumb items={getBreadcrumbs()} />
          </motion.div>
        )}

        {/* Page Content */}
        <Outlet />
      </div>
    </div>
  );
}