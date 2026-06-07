// features/auth/LoginPage.jsx
import { useState, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useLoginMutation, useLazyGetMeQuery } from "../authApi";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  AlertCircle, 
  CheckCircle2,
  Github,
  Loader2
} from "lucide-react";
import MfaLoginModal from "../AuthGuard/Mfa_Modal";
import useGoogleAuth from "../useGoogle";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] }
  }
};

const slideInLeft = {
  hidden: { x: -60, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { duration: 0.8, ease: [0.23, 1, 0.32, 1] }
  }
};

// GitHub OAuth Button Component
const GithubButton = ({ onClick, disabled }) => (
  <motion.button
    whileHover={{ scale: disabled ? 1 : 1.02, y: disabled ? 0 : -2 }}
    whileTap={{ scale: disabled ? 1 : 0.98 }}
    onClick={onClick}
    disabled={disabled}
    type="button"
    className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl border-2 border-slate-900 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0 shadow-sm hover:shadow-md"
  >
    <Github className="w-5 h-5" />
    <span>Continue with GitHub</span>
  </motion.button>
);

const InputField = ({ 
  label, 
  type, 
  value, 
  onChange, 
  placeholder, 
  icon: Icon,
  showPasswordToggle,
  onTogglePassword,
  showPassword,
  error,
  disabled
}) => (
  <div className="space-y-1.5">
    <label className="block text-sm font-semibold text-slate-700">
      {label}
    </label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
        <Icon className="w-5 h-5" />
      </div>
      <input
        type={showPasswordToggle ? (showPassword ? "text" : "password") : type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full pl-12 ${showPasswordToggle ? "pr-12" : "pr-4"} py-3.5 bg-white border-2 rounded-xl text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 ${
          error 
            ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10" 
            : "border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 hover:border-slate-300"
        } disabled:bg-slate-50 disabled:cursor-not-allowed`}
      />
      {showPasswordToggle && (
        <button
          type="button"
          onClick={onTogglePassword}
          disabled={disabled}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:text-indigo-500 transition-colors disabled:opacity-50"
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      )}
    </div>
    {error && (
      <motion.p 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xs font-medium text-red-500 flex items-center gap-1"
      >
        <AlertCircle className="w-3 h-3" />
        {error}
      </motion.p>
    )}
  </div>
);

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [login, { isLoading }] = useLoginMutation();
  const [getMe] = useLazyGetMeQuery();
  
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [tempToken, setTempToken] = useState(null);
  const [devices, setDevices] = useState([]);

  const from = location.state?.from?.pathname || "/dashboard";

  // Google OAuth Handler
  const handleGoogleCredential = useCallback(async (response) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}users/v1/auth/google/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify({
            id_token: response.credential
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || data.message || "Google login failed");
      }

      if (data.mfa_required) {
        setTempToken(data.temp_token);
        setDevices(data.devices);
        return;
      }

      await getMe().unwrap();
      navigate(from, { replace: true });

    } catch (err) {
      console.error("Google login failed:", err);
      setError(err.message || "Google login failed. Please try again.");
    }
  }, [getMe, navigate, from]);

  // Initialize Google Auth
  useGoogleAuth(handleGoogleCredential, "google-signin-button");

  const validateForm = () => {
    const errors = {};
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email";
    }
    
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    if (!validateForm()) return;

    try {
      const res = await login({
        email: formData.email,
        password: formData.password
      }).unwrap();

      if (res.mfa_required) {
        setTempToken(res.temp_token);
        setDevices(res.devices);
        return;
      }

      await getMe().unwrap();
      navigate(from, { replace: true });

    } catch (err) {
      console.error("Login error:", err);
      
      let message = "Login failed. Please try again.";
      
      if (err?.data) {
        message = err.data.detail || err.data.message || err.data.non_field_errors?.[0];
        
        if (err.data.email) {
          setFieldErrors(prev => ({ ...prev, email: err.data.email[0] }));
        }
        if (err.data.password) {
          setFieldErrors(prev => ({ ...prev, password: err.data.password[0] }));
        }
      }
      
      setError(message);
    }
  };

  const handleGithubLogin = () => {
    // TODO: Implement GitHub OAuth
    console.log("GitHub OAuth - pending implementation");
    setError("GitHub login coming soon");
  };

  const handleCloseMfaModal = () => {
    setTempToken(null);
    setDevices([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden">
      {/* Left Panel - Visual */}
      <motion.div 
        variants={slideInLeft}
        initial="hidden"
        animate="visible"
        className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative overflow-hidden bg-slate-900"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/30 via-slate-900 to-slate-900" />
        
        {/* Floating Orbs */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-20 w-96 h-96 bg-indigo-500 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-violet-500 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-500 rounded-full blur-3xl"
        />

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 h-full">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Link 
              to="/"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-all duration-300 group"
            >
              <div className="w-10 h-10 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium">Back to home</span>
            </Link>
          </motion.div>

          <div className="max-w-lg">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm font-medium text-slate-300">Secure Enterprise Platform</span>
              </div>
              
              <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
                Welcome back to{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-400 animate-gradient">
                  SBMS
                </span>
              </h1>
              
              <p className="text-lg text-slate-400 leading-relaxed">
                Streamline your business operations with intelligent automation, 
                real-time analytics, and enterprise-grade security.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-8 space-y-3"
            >
              {[
                "JWT HTTP-only Cookie Auth",
                "Auto Token Refresh",
                "99.99% Uptime SLA"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-indigo-400" />
                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex items-center gap-6 text-slate-500 text-sm"
          >
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              1,200+ Companies
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-600" />
            <span>Enterprise Ready</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-24 py-12 relative overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden mb-8"
        >
          <Link 
            to="/"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back to home</span>
          </Link>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md mx-auto"
        >
          <motion.div variants={itemVariants} className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
              Sign in to your account
            </h2>
            <p className="text-slate-500">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors inline-flex items-center gap-1 group"
              >
                Get started
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </p>
          </motion.div>

          {/* OAuth Section */}
          <motion.div variants={itemVariants} className="space-y-3 mb-8">
            {/* Google Sign-In Button Container */}
            <div 
              id="google-signin-button" 
              className="w-full h-[48px] flex items-center justify-center"
            >
              {/* Google renders its button here */}
            </div>
            
            <GithubButton
              onClick={handleGithubLogin}
              disabled={isLoading}
            />

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-slate-50 text-sm text-slate-400 font-medium">
                  or continue with email
                </span>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.form 
            variants={itemVariants}
            onSubmit={handleSubmit} 
            className="space-y-5"
          >
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm font-medium text-red-700">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <InputField
              label="Email address"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="you@company.com"
              icon={Mail}
              error={fieldErrors.email}
              disabled={isLoading}
            />

            <InputField
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              icon={Lock}
              showPasswordToggle
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
              error={fieldErrors.password}
              disabled={isLoading}
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={isLoading}
                    className="peer sr-only"
                  />
                  <div className="w-5 h-5 border-2 border-slate-300 rounded-md peer-checked:bg-indigo-600 peer-checked:border-indigo-600 transition-all duration-200" />
                  <CheckCircle2 className="w-3.5 h-3.5 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 transition-opacity" />
                </div>
                <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                  Remember me
                </span>
              </label>
              
              <Link 
                to="/forgot-password" 
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <motion.button
              whileHover={{ scale: isLoading ? 1 : 1.02, y: isLoading ? 0 : -2 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0 disabled:shadow-none"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign in</span>
              )}
            </motion.button>
          </motion.form>

          <motion.div 
            variants={itemVariants}
            className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400"
          >
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-medium text-emerald-700">HTTP-only Cookies</span>
            </div>
            <span className="text-slate-300">•</span>
            <span>256-bit Encryption</span>
          </motion.div>

          <motion.p 
            variants={itemVariants}
            className="mt-8 text-center text-xs text-slate-400 leading-relaxed"
          >
            By signing in, you agree to our{' '}
            <Link to="/terms" className="text-slate-500 hover:text-slate-700 underline transition-colors">
              Terms of Service
            </Link>
            {' '}and{' '}
            <Link to="/privacy" className="text-slate-500 hover:text-slate-700 underline transition-colors">
              Privacy Policy
            </Link>
          </motion.p>
        </motion.div>
      </div>

      {/* MFA Modal */}
      <AnimatePresence>
        {tempToken && (
          <MfaLoginModal
            tempToken={tempToken}
            devices={devices}
            onClose={handleCloseMfaModal}
          />
        )}
      </AnimatePresence>

      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 8s ease infinite;
        }
      `}</style>
    </div>
  );
}