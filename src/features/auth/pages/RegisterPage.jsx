import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLazyGetMeQuery, useRegisterWithCompanyMutation } from "../authApi";
import useGoogleAuth from "../useGoogle";
import MfaLoginModal from "../AuthGuard/Mfa_Modal";

const InputField = ({ label, type = "text", value, onChange, placeholder, icon }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-slate-700">{label}</label>
    <div className="relative">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          {icon}
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 ${icon ? 'pl-10' : ''}`}
      />
    </div>
  </div>
);

const PasswordStrength = ({ password }) => {
  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : /[A-Z]/.test(password) && /[0-9]/.test(password) ? 4 : 3;
  
  const colors = ['bg-slate-200', 'bg-red-400', 'bg-amber-400', 'bg-blue-400', 'bg-emerald-400'];
  const labels = ['Enter password', 'Weak', 'Fair', 'Good', 'Strong'];
  
  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? colors[strength] : 'bg-slate-200'}`} />
        ))}
      </div>
      <p className="text-xs text-slate-500">{labels[strength]}</p>
    </div>
  );
};

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

export default function RegisterPage() {
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterWithCompanyMutation();
    const [getMe] = useLazyGetMeQuery();
    const [tempToken, setTempToken] = useState(null);
const [devices, setDevices] = useState([]);


  const [form, setForm] = useState({
    email: "",
    password: "",
    username: "",
    company_name: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await register(form).unwrap();
      navigate("/verify-email", {
        state: { email: res.data.email }
      });
    } catch (err) {
      console.log(err);
    }
  };


const handleGoogleCredential = async (response) => {
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
      throw new Error(data.message || "Google authentication failed");
    }

    if (data.mfa_required) {
      // show MFA modal
      setTempToken(data.temp_token);
      setDevices(data.devices);
      return;
    }

    await getMe().unwrap();

    navigate("/dashboard");

  } catch (err) {
    console.error(err);
  }
};

useGoogleAuth(handleGoogleCredential, "google-signin-register");

  const updateField = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const isFormValid = form.email && form.username && form.company_name && form.password.length >= 6;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-5/12 bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-20" />
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16">
          <div className="mb-8">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center mb-6">
              <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </div>
            <h1 className="text-4xl xl:text-5xl font-bold text-white tracking-tight mb-4">
              Build your business faster
            </h1>
            <p className="text-lg text-indigo-100 leading-relaxed max-w-md">
              Join thousands of companies using SBMS to streamline operations, manage teams, and scale with confidence.
            </p>
          </div>
          
          <div className="space-y-4">
            {[
              { icon: "⚡", text: "Set up in minutes, not days" },
              { icon: "🔒", text: "Enterprise-grade security" },
              { icon: "🚀", text: "Free 14-day trial, no credit card" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-indigo-100">
                <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sm">{item.icon}</span>
                <span className="text-sm font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-8 xl:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Create your account</h2>
            <p className="text-slate-600">Start your free trial today</p>
          </div>

          {/* OAuth */}
          <div
          id="google-signin-register"
          className="w-full h-[48px] flex items-center justify-center"
          />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-slate-50 text-slate-500">Or continue with email</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <InputField
              label="Email address"
              type="email"
              value={form.email}
              onChange={updateField('email')}
              placeholder="you@company.com"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              }
            />

            <InputField
              label="Username"
              value={form.username}
              onChange={updateField('username')}
              placeholder="johnsmith"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
            />

            <InputField
              label="Company name"
              value={form.company_name}
              onChange={updateField('company_name')}
              placeholder="Acme Inc."
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              }
            />

            <div className="space-y-2">
              <InputField
                label="Password"
                type="password"
                value={form.password}
                onChange={updateField('password')}
                placeholder="••••••••"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                }
              />
              <PasswordStrength password={form.password} />
            </div>

            <button
              type="submit"
              disabled={isLoading || !isFormValid}
              className={`w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold rounded-xl px-4 py-3.5 shadow-lg shadow-indigo-500/25 transition-all duration-200 ${
                isLoading || !isFormValid
                  ? 'opacity-60 cursor-not-allowed'
                  : 'hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5'
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating account...
                </>
              ) : (
                <>
                  Start free trial
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="space-y-4 text-center">
            <p className="text-sm text-slate-600">
              Already have an account?{' '}
              <a href="/login" className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
                Log in
              </a>
            </p>
            
            <p className="text-xs text-slate-500 leading-relaxed">
              By creating an account, you agree to our{' '}
              <a href="#" className="underline hover:text-slate-700">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="underline hover:text-slate-700">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
              {tempToken && (
          <MfaLoginModal
            tempToken={tempToken}
            devices={devices}
            onClose={() => {
              setTempToken(null);
              setDevices([]);
            }}
          />
        )}
    </div>
  );
}