import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useResetPasswordMutation } from "../authApi";
import { 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck,
  ArrowLeft,
  KeyRound
} from "lucide-react";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const token = params.get("token");
  const email = params.get("email");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const checkPasswordStrength = (value) => {
    let strength = 0;
    if (value.length >= 8) strength += 1;
    if (/[A-Z]/.test(value)) strength += 1;
    if (/[0-9]/.test(value)) strength += 1;
    if (/[^A-Za-z0-9]/.test(value)) strength += 1;
    setPasswordStrength(strength);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    checkPasswordStrength(value);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    try {
      await resetPassword({
        email: email,
        token: token,
        new_password: password
      }).unwrap();

      setIsSuccess(true);
    } catch (err) {
      setError("Reset link is invalid or has expired. Please request a new one.");
    }
  };

  if (!token || !email) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
        >
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-semibold text-slate-900 mb-2">Invalid Reset Link</h2>
          <p className="text-slate-500 mb-6">This password reset link is invalid or has expired.</p>
          <Link 
            to="/forgot-password" 
            className="inline-flex items-center justify-center px-6 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors"
          >
            Request New Link
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="w-full max-w-md"
      >
        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
          
          {/* Header Section */}
          <div className="px-8 pt-10 pb-6 text-center">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 mb-6 shadow-sm"
            >
              {isSuccess ? (
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              ) : (
                <KeyRound className="w-8 h-8 text-indigo-600" />
              )}
            </motion.div>
            
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight mb-3">
              {isSuccess ? "Password updated" : "Create a new password"}
            </h1>
            
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.p 
                  key="success-desc"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-slate-500 text-sm sm:text-base leading-relaxed"
                >
                  Your password has been successfully updated.
                </motion.p>
              ) : (
                <motion.p 
                  key="form-desc"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-slate-500 text-sm sm:text-base leading-relaxed"
                >
                  Your new password must be different from your previous password.
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Content Section */}
          <div className="px-8 pb-10">
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-green-800">
                      <p className="font-medium mb-1">Success</p>
                      <p className="text-green-700/80">You can now log in with your new password.</p>
                    </div>
                  </div>

                  <motion.button
                    onClick={() => navigate("/login")}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full py-3.5 px-4 rounded-xl font-semibold text-white bg-slate-900 hover:bg-slate-800 shadow-lg shadow-slate-900/20 hover:shadow-xl hover:shadow-slate-900/30 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <span>Continue to Login</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  {/* Error Message */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-start gap-2 text-red-600 text-sm bg-red-50 px-4 py-3 rounded-xl"
                      >
                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>{error}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* New Password Input */}
                  <div className="space-y-2">
                    <label 
                      htmlFor="password" 
                      className="block text-sm font-semibold text-slate-700"
                    >
                      New password
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                      </div>
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={handlePasswordChange}
                        placeholder="Enter new password"
                        required
                        className="block w-full pl-11 pr-12 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    
                    {/* Password Strength Indicator */}
                    {password && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="space-y-1 pt-1"
                      >
                        <div className="flex gap-1 h-1">
                          {[1, 2, 3, 4].map((level) => (
                            <div
                              key={level}
                              className={`flex-1 rounded-full transition-colors duration-300 ${
                                passwordStrength >= level
                                  ? passwordStrength <= 2
                                    ? "bg-yellow-400"
                                    : "bg-green-500"
                                  : "bg-slate-200"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-slate-500">
                          {passwordStrength <= 2 && "Weak password"}
                          {passwordStrength === 3 && "Good password"}
                          {passwordStrength === 4 && "Strong password"}
                        </p>
                      </motion.div>
                    )}
                  </div>

                  {/* Confirm Password Input */}
                  <div className="space-y-2">
                    <label 
                      htmlFor="confirmPassword" 
                      className="block text-sm font-semibold text-slate-700"
                    >
                      Confirm password
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                      </div>
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          setError("");
                        }}
                        placeholder="Confirm new password"
                        required
                        className={`block w-full pl-11 pr-12 py-3.5 bg-white border rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 transition-all duration-200 ${
                          confirmPassword && password !== confirmPassword
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                            : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/10"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {confirmPassword && password !== confirmPassword && (
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-red-500"
                      >
                        Passwords do not match
                      </motion.p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isLoading || !password || !confirmPassword || password !== confirmPassword}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={`
                      w-full py-3.5 px-4 rounded-xl font-semibold text-white
                      transition-all duration-200 flex items-center justify-center gap-2
                      ${isLoading || !password || !confirmPassword || password !== confirmPassword
                        ? "bg-slate-300 cursor-not-allowed"
                        : "bg-slate-900 hover:bg-slate-800 shadow-lg shadow-slate-900/20 hover:shadow-xl hover:shadow-slate-900/30"
                      }
                    `}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Updating password...</span>
                      </>
                    ) : (
                      <>
                        <span>Reset Password</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>

                  {/* Security Note */}
                  <div className="flex items-start gap-2 text-xs text-slate-400 bg-slate-50 p-3 rounded-lg">
                    <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>This reset link will expire shortly for security reasons.</span>
                  </div>

                  {/* Back Link */}
                  <div className="pt-2 text-center">
                    <Link 
                      to="/login"
                      className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 font-medium transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to login
                    </Link>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Security Footer */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-xs text-slate-400 mt-6 flex items-center justify-center gap-1"
        >
          <ShieldCheck className="w-3 h-3" />
          Secure, encrypted connection
        </motion.p>
      </motion.div>
    </div>
  );
}