import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  useVerifyEmailMutation, 
  useResendVerificationMutation, 
  useLazyGetMeQuery 
} from "../authApi";
import { 
  Mail, 
  ArrowLeft, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw,
  ShieldCheck
} from "lucide-react";

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const email = location.state?.email;
  
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [activeInput, setActiveInput] = useState(0);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const inputRefs = useRef([]);
  
  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();
  const [resendVerification, { isLoading: isResending }] = useResendVerificationMutation();
  const [getMe] = useLazyGetMeQuery();

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0 && !canResend) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !canResend) {
      setCanResend(true);
    }
  }, [countdown, canResend]);

  // Auto-focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Take only last character
    setOtp(newOtp);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
      setActiveInput(index + 1);
    }

    // Auto-submit when complete
    if (index === 5 && value) {
      const completeOtp = [...newOtp];
      completeOtp[5] = value.slice(-1);
      handleVerify(completeOtp.join(""));
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
      setActiveInput(index - 1);
    }
    
    // Arrow key navigation
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1].focus();
      setActiveInput(index - 1);
    }
    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1].focus();
      setActiveInput(index + 1);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    
    if (!/^\d+$/.test(pastedData)) {
      setError("Please paste numbers only");
      return;
    }

    const newOtp = [...otp];
    pastedData.split("").forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtp(newOtp);

    // Focus appropriate input
    const focusIndex = Math.min(pastedData.length, 5);
    inputRefs.current[focusIndex].focus();
    setActiveInput(focusIndex);

    // Auto-submit if complete
    if (pastedData.length === 6) {
      handleVerify(pastedData);
    }
  };

  const handleVerify = async (code = otp.join("")) => {
    if (code.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    setError("");
    
    try {
      await verifyEmail({
        email: email,
        token: code
      }).unwrap();

      setIsSuccess(true);
      
      // Small delay for success animation
      setTimeout(async () => {
        await getMe().unwrap();
        navigate("/dashboard", { replace: true });
      }, 800);

    } catch (err) {
      setError("Invalid verification code. Please try again.");
      // Clear inputs on error
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0].focus();
      setActiveInput(0);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    
    try {
      await resendVerification({ email }).unwrap();
      setCountdown(30);
      setCanResend(false);
      setError("");
      // Clear inputs
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0].focus();
      setActiveInput(0);
    } catch (err) {
      setError("Failed to resend code. Please try again.");
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
        >
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-slate-900 mb-2">Invalid Request</h2>
          <p className="text-slate-600 mb-6">No email address found. Please start the verification process again.</p>
          <Link 
            to="/login" 
            className="inline-flex items-center justify-center px-6 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
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
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
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
              <Mail className="w-8 h-8 text-indigo-600" />
            </motion.div>
            
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight mb-2">
              Verify your email
            </h1>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              Enter the 6-digit code sent to
            </p>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-2 inline-flex items-center px-4 py-1.5 rounded-full bg-slate-50 border border-slate-100"
            >
              <span className="text-sm font-medium text-slate-700">{email}</span>
            </motion.div>
          </div>

          {/* Form Section */}
          <div className="px-8 pb-10">
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col items-center py-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mb-4"
                  >
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </motion.div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">Email Verified!</h3>
                  <p className="text-slate-500 text-sm">Redirecting to dashboard...</p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -20 }}
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleVerify();
                  }}
                  className="space-y-6"
                >
                  {/* OTP Input Grid */}
                  <div className="flex justify-center gap-2 sm:gap-3">
                    {otp.map((digit, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <input
                          ref={(el) => (inputRefs.current[index] = el)}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleChange(index, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          onPaste={handlePaste}
                          onFocus={() => setActiveInput(index)}
                          className={`
                            w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-semibold rounded-xl
                            border-2 transition-all duration-200 outline-none
                            ${error 
                              ? "border-red-300 bg-red-50 text-red-900 focus:border-red-500 focus:ring-4 focus:ring-red-500/10" 
                              : digit 
                                ? "border-indigo-500 bg-indigo-50/30 text-indigo-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                                : "border-slate-200 bg-white text-slate-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                            }
                            ${activeInput === index ? "ring-4 ring-indigo-500/10 scale-105" : ""}
                          `}
                          aria-label={`Digit ${index + 1} of 6`}
                        />
                      </motion.div>
                    ))}
                  </div>

                  {/* Error Message */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center gap-2 text-red-600 text-sm bg-red-50 px-4 py-3 rounded-lg"
                      >
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>{error}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Verify Button */}
                  <motion.button
                    type="submit"
                    disabled={isLoading || otp.join("").length !== 6}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={`
                      w-full py-3.5 px-4 rounded-xl font-semibold text-white
                      transition-all duration-200 flex items-center justify-center gap-2
                      ${isLoading || otp.join("").length !== 6
                        ? "bg-slate-300 cursor-not-allowed"
                        : "bg-slate-900 hover:bg-slate-800 shadow-lg shadow-slate-900/20 hover:shadow-xl hover:shadow-slate-900/30"
                      }
                    `}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-5 h-5" />
                        <span>Verify Email</span>
                      </>
                    )}
                  </motion.button>

                  {/* Resend Section */}
                  <div className="flex flex-col items-center gap-3 pt-2">
                    <div className="text-sm text-slate-500">
                      Didn't receive the code?{" "}
                      {canResend ? (
                        <motion.button
                          type="button"
                          onClick={handleResend}
                          disabled={isResending}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1 disabled:opacity-50"
                        >
                          {isResending ? (
                            <>
                              <Loader2 className="w-3 h-3 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <RefreshCw className="w-3 h-3" />
                              Resend Code
                            </>
                          )}
                        </motion.button>
                      ) : (
                        <span className="font-medium text-slate-400">
                          Resend in {countdown}s
                        </span>
                      )}
                    </div>

                    {/* Divider */}
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent my-2" />

                    {/* Footer Links */}
                    <div className="flex items-center justify-center gap-4 text-sm">
                      <Link 
                        to="/login" 
                        className="text-slate-500 hover:text-slate-700 font-medium inline-flex items-center gap-1 transition-colors"
                      >
                        <ArrowLeft className="w-3 h-3" />
                        Back to login
                      </Link>
                      <span className="text-slate-300">•</span>
                      <button 
                        type="button"
                        onClick={() => navigate("/signup", { state: { email } })}
                        className="text-slate-500 hover:text-slate-700 font-medium transition-colors"
                      >
                        Change email
                      </button>
                    </div>
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
          <ShieldCheck className="w-3 h-3" />
          Secured with 256-bit encryption
        </motion.p>
      </motion.div>
    </div>
  );
}