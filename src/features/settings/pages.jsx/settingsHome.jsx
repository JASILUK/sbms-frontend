// features/settings/pages/SettingsHome.jsx
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  User, 
  Shield, 
  ChevronRight, 
  Settings,
  Bell,
  Palette,
  CreditCard,
  Globe
} from "lucide-react";

// Extended settings categories
const SETTINGS_CATEGORIES = [
  {
    id: "profile",
    to: "profile",
    icon: User,
    title: "Profile",
    description: "Manage your personal information, email address, and profile picture",
    color: "blue",
    badge: null,
  },
  {
    id: "security",
    to: "security",
    icon: Shield,
    title: "Security",
    description: "Password, two-factor authentication, backup codes, and active sessions",
    color: "violet",
    badge: "2 devices",
  },
  {
    id: "notifications",
    to: "notifications",
    icon: Bell,
    title: "Notifications",
    description: "Email preferences, push notifications, and alert settings",
    color: "amber",
    badge: null,
    },
  {
    id: "appearance",
    to: "appearance",
    icon: Palette,
    title: "Appearance",
    description: "Theme, language, and display preferences",
    color: "emerald",
    badge: "Soon",
    disabled: true,

  },
  {
    id: "billing",
    to: "billing",
    icon: CreditCard,
    title: "Billing",
    description: "Payment methods, invoices, and subscription management",
    color: "rose",
    badge: "Soon",
    disabled: true,
  },
  {
    id: "integrations",
    to: "integrations",
    icon: Globe,
    title: "Integrations",
    description: "Connect Google Calendar, Outlook Calendar, and other services",
    color: "cyan",
    badge: null,
    disabled: false,
  },
];

const COLOR_STYLES = {
  blue: {
    bg: "bg-blue-50",
    icon: "text-blue-600",
    border: "border-blue-200",
    shadow: "shadow-blue-100",
    gradient: "from-blue-500 to-blue-600",
  },
  violet: {
    bg: "bg-violet-50",
    icon: "text-violet-600",
    border: "border-violet-200",
    shadow: "shadow-violet-100",
    gradient: "from-violet-500 to-purple-600",
  },
  amber: {
    bg: "bg-amber-50",
    icon: "text-amber-600",
    border: "border-amber-200",
    shadow: "shadow-amber-100",
    gradient: "from-amber-500 to-orange-600",
  },
  emerald: {
    bg: "bg-emerald-50",
    icon: "text-emerald-600",
    border: "border-emerald-200",
    shadow: "shadow-emerald-100",
    gradient: "from-emerald-500 to-green-600",
  },
  rose: {
    bg: "bg-rose-50",
    icon: "text-rose-600",
    border: "border-rose-200",
    shadow: "shadow-rose-100",
    gradient: "from-rose-500 to-pink-600",
  },
  cyan: {
    bg: "bg-cyan-50",
    icon: "text-cyan-600",
    border: "border-cyan-200",
    shadow: "shadow-cyan-100",
    gradient: "from-cyan-500 to-blue-600",
  },
};

function SettingsCard({ item, onClick }) {
  const Icon = item.icon;
  const colors = COLOR_STYLES[item.color];

  return (
    <motion.button
      onClick={() => !item.disabled && onClick(item.to)}
      whileHover={!item.disabled ? { scale: 1.01, y: -2 } : {}}
      whileTap={!item.disabled ? { scale: 0.99 } : {}}
      className={`
        group w-full flex items-center gap-4 p-5 
        bg-white rounded-2xl border-2 
        transition-all duration-300 relative overflow-hidden
        ${item.disabled 
          ? "border-gray-100 opacity-60 cursor-not-allowed" 
          : `border-gray-100 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-100/50 cursor-pointer`
        }
      `}
    >
      {/* Animated background gradient on hover */}
      {!item.disabled && (
        <div className={`
          absolute inset-0 bg-gradient-to-r ${colors.gradient} opacity-0 
          group-hover:opacity-5 transition-opacity duration-500
        `} />
      )}

      {/* Icon */}
      <div className={`
        relative flex-shrink-0 w-14 h-14 rounded-2xl 
        ${colors.bg} ${colors.icon}
        flex items-center justify-center
        transition-all duration-300 
        ${!item.disabled && "group-hover:scale-110 group-hover:shadow-lg"}
      `}>
        <Icon className="w-6 h-6" strokeWidth={2} />
      </div>

      {/* Content */}
      <div className="flex-1 text-left relative">
        <div className="flex items-center gap-3 mb-1">
          <h3 className="font-semibold text-gray-900 text-lg">
            {item.title}
          </h3>
          {item.badge && (
            <span className={`
              text-xs font-medium px-2.5 py-0.5 rounded-full
              ${item.disabled 
                ? "bg-gray-100 text-gray-500" 
                : "bg-violet-100 text-violet-700"
              }
            `}>
              {item.badge}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 leading-relaxed">
          {item.description}
        </p>
      </div>

      {/* Arrow */}
      <div className={`
        flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
        transition-all duration-300
        ${item.disabled 
          ? "text-gray-300" 
          : "text-gray-400 group-hover:text-violet-600 group-hover:bg-violet-50"
        }
      `}>
        <ChevronRight className={`
          w-5 h-5 transition-transform duration-300
          ${!item.disabled && "group-hover:translate-x-1"}
        `} />
      </div>
    </motion.button>
  );
}

export default function SettingsHome() {
  const navigate = useNavigate();

  const activeItems = SETTINGS_CATEGORIES.filter(i => !i.disabled);
  const comingSoonItems = SETTINGS_CATEGORIES.filter(i => i.disabled);

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white shadow-xl shadow-violet-200 mx-auto mb-6"
        >
          <Settings className="w-10 h-10" />
        </motion.div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Settings
        </h1>
        <p className="text-gray-500 text-lg max-w-md mx-auto">
          Manage your account preferences, security, and personalization options
        </p>
      </motion.div>

      {/* Active Settings */}
      <div className="space-y-4 mb-8">
        {activeItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <SettingsCard item={item} onClick={navigate} />
          </motion.div>
        ))}
      </div>

      {/* Coming Soon Section */}
      {comingSoonItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 px-2">
            Coming Soon
          </h3>
          <div className="space-y-3 opacity-60">
            {comingSoonItems.map((item, index) => (
              <SettingsCard 
                key={item.id} 
                item={item} 
                onClick={() => {}} 
              />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}