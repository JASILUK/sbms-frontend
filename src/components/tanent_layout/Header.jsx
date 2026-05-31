// Header.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Bell, 
  Menu, 
  Command,
  Sparkles,
  Calendar,
  CheckSquare,
  Clock,
  X,
  ChevronRight
} from "lucide-react";
import { useSession } from "../../features/auth/useSession";
import { useSidebar } from "../../layouts/Tanent_layout";
import { useTenantContext } from "../../features/tanent/tanatContextHook"; // ← Use same as Sidebar!

// Command Palette Component (unchanged)
const CommandPalette = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  
  const commands = [
    { id: 1, title: "Go to Dashboard", shortcut: "⌘D", icon: CheckSquare, category: "Navigation" },
    { id: 2, title: "View Employees", shortcut: "⌘E", icon: Clock, category: "Navigation" },
    { id: 3, title: "Open Projects", shortcut: "⌘P", icon: Calendar, category: "Navigation" },
    { id: 4, title: "Billing Settings", shortcut: "⌘B", icon: Sparkles, category: "Settings" },
  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-50 flex items-start justify-center pt-[20vh]"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200/60"
      >
        <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-100">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search..."
            className="flex-1 text-base outline-none placeholder:text-slate-400 bg-transparent"
            autoFocus
          />
          <kbd 
            onClick={onClose}
            className="px-2 py-1 text-xs font-semibold text-slate-500 bg-slate-100 rounded-lg cursor-pointer hover:bg-slate-200 transition-colors"
          >
            ESC
          </kbd>
        </div>
        
        <div className="max-h-[400px] overflow-y-auto py-2">
          <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            Suggestions
          </div>
          {commands.map((cmd) => (
            <div
              key={cmd.id}
              className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer group mx-2 rounded-lg transition-colors"
            >
              <div className="p-2 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-white group-hover:shadow-sm transition-all">
                <cmd.icon className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">{cmd.title}</p>
                <p className="text-xs text-slate-500">{cmd.category}</p>
              </div>
              <kbd className="px-2 py-1 text-xs font-medium text-slate-400 bg-slate-100 rounded">
                {cmd.shortcut}
              </kbd>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

// Notifications Dropdown (unchanged)
const NotificationsDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = 3;

  const notifications = [
    { 
      id: 1, 
      title: "New team member", 
      desc: "Sarah Chen joined Engineering", 
      time: "2m ago",
      type: "success",
      icon: Sparkles
    },
    { 
      id: 2, 
      title: "Deadline approaching", 
      desc: "Website Redesign due in 2 days", 
      time: "1h ago",
      type: "warning",
      icon: Clock
    },
    { 
      id: 3, 
      title: "Payment received", 
      desc: "Invoice #1234 paid by Acme Corp", 
      time: "3h ago",
      type: "info",
      icon: CheckSquare
    },
  ];

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 hover:bg-slate-100 rounded-xl transition-colors group"
      >
        <Bell className="w-5 h-5 text-slate-600 group-hover:text-slate-900 transition-colors" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
        )}
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
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-xl border border-slate-200/60 z-50 overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <h3 className="font-bold text-slate-900">Notifications</h3>
                <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
                  Mark all read
                </button>
              </div>
              
              <div className="max-h-[320px] overflow-y-auto">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="flex gap-3 p-4 hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-50 last:border-0 group"
                  >
                    <div className={`
                      w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                      ${notif.type === 'success' ? 'bg-emerald-100 text-emerald-600' : 
                        notif.type === 'warning' ? 'bg-amber-100 text-amber-600' : 
                        'bg-blue-100 text-blue-600'}
                    `}>
                      <notif.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900">{notif.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5 truncate">{notif.desc}</p>
                      <p className="text-[10px] text-slate-400 mt-1.5 font-medium">{notif.time}</p>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
              
              <div className="p-3 border-t border-slate-100 bg-slate-50/50">
                <button className="w-full text-center text-sm font-semibold text-slate-600 hover:text-slate-900 py-1.5 flex items-center justify-center gap-1 group">
                  View all
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function TenantHeader() {
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const { toggleSidebar, isMobile } = useSidebar();
  const { session } = useSession();
  
  // 🔥 FIX: Use same context as Sidebar instead of separate query
  const { role, subscription, isLoading: isContextLoading } = useTenantContext();

  const user = session?.user;
  
  // Get role name from context (same as Sidebar)
  const roleName = role?.name || "Member";
  
  // Get plan name from subscription (same as Sidebar)
  const planName = subscription?.plan || 'Free';

  // Keyboard shortcut for command palette
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-30 px-4 lg:px-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleSidebar}
            className="lg:hidden p-2.5 -ml-2 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <Menu className="w-5 h-5 text-slate-700" />
          </motion.button>

          {/* Search Trigger */}
          <button
            onClick={() => setIsCommandOpen(true)}
            className="hidden md:flex items-center gap-3 px-4 py-2.5 bg-slate-100/80 hover:bg-slate-200/80 rounded-xl transition-all duration-200 group min-w-[320px] border border-transparent hover:border-slate-200"
          >
            <Search className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
            <span className="text-sm text-slate-500 group-hover:text-slate-700 font-medium">Search anything...</span>
            <div className="ml-auto flex items-center gap-1 px-2 py-1 bg-white rounded-lg border border-slate-200 shadow-sm">
              <Command className="w-3 h-3 text-slate-400" />
              <span className="text-[11px] font-semibold text-slate-500">K</span>
            </div>
          </button>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          {/* Quick Actions */}
          <div className="hidden sm:flex items-center gap-1">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors group relative"
            >
              <CheckSquare className="w-5 h-5 text-slate-600 group-hover:text-slate-900 transition-colors" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors group"
            >
              <Calendar className="w-5 h-5 text-slate-600 group-hover:text-slate-900 transition-colors" />
            </motion.button>
          </div>

          {/* Notifications */}
          <NotificationsDropdown />

          {/* Upgrade CTA - Only show if not on premium plan */}
          {planName !== 'Premium' && planName !== 'Enterprise' && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="hidden md:flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-amber-100 via-orange-100 to-rose-100 hover:from-amber-200 hover:via-orange-200 hover:to-rose-200 text-amber-900 rounded-xl text-sm font-bold transition-all duration-200 group shadow-sm hover:shadow-md"
            >
              <Sparkles className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
              <span>Upgrade</span>
            </motion.button>
          )}

          {/* User Profile */}
          <div className="flex items-center gap-3 pl-3 ml-1 border-l border-slate-200">
          
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-bold text-slate-900 leading-tight">
                {user?.username || "User"}
              </span>
              {isContextLoading ? (
                <span className="text-xs font-medium text-slate-400 leading-tight">Loading...</span>
              ) : (
                <span className="text-xs font-medium text-slate-500 leading-tight">
                  {roleName} 
                </span>
              )}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative group"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 via-violet-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-500/20 ring-2 ring-white group-hover:ring-indigo-200 transition-all">
                {user?.username?.charAt(0) || "A"}
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
            </motion.button>
          </div>
        </div>
      </header>

      <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />
    </>
  );
}