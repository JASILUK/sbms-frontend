import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useForgotPasswordMutation } from "../authApi";
import { 
  Mail, 
  ArrowLeft, 
  Loader2, 
  CheckCircle2, 
  KeyRound,
  ArrowRight
} from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await forgotPassword({ email }).unwrap();
      setIsSuccess(true);
    } catch (err) {
      console.log(err);
    }
  };

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
              {isSuccess ? "Check your email" : "Forgot your password?"}
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
                  If an account exists for <span className="font-medium text-slate-700">{email}</span>, we've sent you a password reset link.
                </motion.p>
              ) : (
                <motion.p 
                  key="form-desc"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-slate-500 text-sm sm:text-base leading-relaxed"
                >
                  Enter your email address and we'll send you a link to reset your password.
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
                      <p className="font-medium mb-1">Reset link sent</p>
                      <p className="text-green-700/80">Please check your inbox and follow the instructions to reset your password.</p>
                    </div>
                  </div>

                  <Link 
                    to="/login"
                    className="flex items-center justify-center w-full py-3.5 px-4 rounded-xl font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all duration-200 gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Login
                  </Link>

                  <button
                    onClick={() => {
                      setIsSuccess(false);
                      setEmail("");
                    }}
                    className="w-full text-center text-sm text-slate-500 hover:text-slate-700 font-medium transition-colors"
                  >
                    Didn't receive it? Try again
                  </button>
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
                  {/* Email Input */}
                  <div className="space-y-2">
                    <label 
                      htmlFor="email" 
                      className="block text-sm font-semibold text-slate-700"
                    >
                      Email address
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                      </div>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@company.com"
                        required
                        className="block w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isLoading || !email}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={`
                      w-full py-3.5 px-4 rounded-xl font-semibold text-white
                      transition-all duration-200 flex items-center justify-center gap-2
                      ${isLoading || !email
                        ? "bg-slate-300 cursor-not-allowed"
                        : "bg-slate-900 hover:bg-slate-800 shadow-lg shadow-slate-900/20 hover:shadow-xl hover:shadow-slate-900/30"
                      }
                    `}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Sending link...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Reset Link</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>

                  {/* Back to Login Link */}
                  <div className="pt-4 text-center">
                    <Link 
                      to="/login"
                      className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 font-medium transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Remember your password? Sign in
                    </Link>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Security Note */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-xs text-slate-400 mt-6 flex items-center justify-center gap-1"
        >
          <KeyRound className="w-3 h-3" />
          Secure, encrypted connection
        </motion.p>
      </motion.div>
    </div>
  );
}