import { useEffect, useRef, useState } from "react";

function useInView(threshold = 0.08) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function useTilt(strength = 6) {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * strength * 2;
    const y = ((e.clientY - r.top) / r.height - 0.5) * strength * -2;
    el.style.transform = `perspective(900px) rotateX(${y}deg) rotateY(${x}deg) translateY(-6px) scale(1.02)`;
    el.style.transition = "transform 0.1s ease";
  };
  const onLeave = () => {
    if (ref.current) {
      ref.current.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)";
      ref.current.style.transition = "transform 0.5s cubic-bezier(0.23,1,0.32,1)";
    }
  };
  return { ref, onMove, onLeave };
}

const STEPS = [
  {
    num: "01",
    color: "#4f46e5",
    lightBg: "#eef2ff",
    border: "#c7d2fe",
    shadowColor: "rgba(79,70,229,0.14)",
    glowColor: "rgba(79,70,229,0.08)",
    title: "Create Your Account",
    description: "Sign up in under 60 seconds. No credit card required. Your secure workspace is provisioned instantly.",
    detail: "Email · SSO · OAuth",
    icon: (
      <svg viewBox="0 0 28 28" fill="none" className="w-7 h-7">
        <circle cx="14" cy="10" r="5" stroke="currentColor" strokeWidth="1.8" />
        <path d="M5 24c0-5 4-9 9-9s9 4 9 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M20 7l2 2-2 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="17" y1="9" x2="22" y2="9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    checkList: ["Instant provisioning", "Secure by default", "Single sign-on ready"],
  },
  {
    num: "02",
    color: "#0891b2",
    lightBg: "#ecfeff",
    border: "#a5f3fc",
    shadowColor: "rgba(8,145,178,0.13)",
    glowColor: "rgba(8,145,178,0.07)",
    title: "Set Up Your Company",
    description: "Configure departments, roles, attendance policies, and company hierarchy — tailored to how your business actually operates.",
    detail: "Multi-company · Departments · Roles",
    icon: (
      <svg viewBox="0 0 28 28" fill="none" className="w-7 h-7">
        <rect x="3" y="8" width="8" height="16" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
        <rect x="10" y="4" width="8" height="20" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
        <rect x="17" y="10" width="8" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
        <line x1="5" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="12" y1="8" x2="16" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="19" y1="14" x2="23" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    checkList: ["Custom org structure", "Policy templates", "Multi-company ready"],
  },
  {
    num: "03",
    color: "#7c3aed",
    lightBg: "#f5f3ff",
    border: "#ddd6fe",
    shadowColor: "rgba(124,58,237,0.13)",
    glowColor: "rgba(124,58,237,0.07)",
    title: "Invite Your Team",
    description: "Send invitations via email. Assign roles, departments, and access levels. Your team is operational from day one.",
    detail: "Bulk import · Role assignment · RBAC",
    icon: (
      <svg viewBox="0 0 28 28" fill="none" className="w-7 h-7">
        <circle cx="9" cy="9" r="4" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="19" cy="9" r="4" stroke="currentColor" strokeWidth="1.8" />
        <path d="M2 24c0-4 3-7 7-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M14 22c0-3.5 2.5-6 5-6s5 2.5 5 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M22 4l2 2-2 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    checkList: ["Bulk CSV import", "Instant access control", "Department alignment"],
  },
  {
    num: "04",
    color: "#059669",
    lightBg: "#ecfdf5",
    border: "#a7f3d0",
    shadowColor: "rgba(5,150,105,0.13)",
    glowColor: "rgba(5,150,105,0.07)",
    title: "Manage & Scale",
    description: "Track attendance in real time, schedule meetings, run AI-powered reports, and automate workflows as you grow.",
    detail: "Attendance · Meetings · AI · Analytics",
    icon: (
      <svg viewBox="0 0 28 28" fill="none" className="w-7 h-7">
        <path d="M3 21l5-7 4 4 5-8 5 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M22 7l2 2-2 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="3" y1="21" x2="25" y2="21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    checkList: ["Real-time dashboards", "AI-driven insights", "Unlimited scale"],
  },
  {
    num: "05",
    color: "#d97706",
    lightBg: "#fffbeb",
    border: "#fde68a",
    shadowColor: "rgba(217,119,6,0.12)",
    glowColor: "rgba(217,119,6,0.07)",
    title: "AI-Powered Insights",
    description: "Let SBMS AI surface anomalies, predict risks, summarize meetings, and deliver board-ready analytics automatically.",
    detail: "Natural language · Predictions · Reports",
    icon: (
      <svg viewBox="0 0 28 28" fill="none" className="w-7 h-7">
        <path d="M14 4a9 9 0 019 9v3l2 2v2h-2a9 9 0 01-18 0h-2v-2l2-2v-3a9 9 0 019-9z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M10.5 16a3 3 0 007 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M10.5 12h.01M14 12h.01M17.5 12h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    checkList: ["Auto-summaries", "Anomaly detection", "Smart forecasting"],
  },
  {
    num: "06",
    color: "#dc2626",
    lightBg: "#fef2f2",
    border: "#fecaca",
    shadowColor: "rgba(220,38,38,0.12)",
    glowColor: "rgba(220,38,38,0.06)",
    title: "Automate Workflows",
    description: "Build no-code automation rules — trigger approvals, escalations, alerts, and reports on any business event.",
    detail: "No-code · Triggers · Integrations",
    icon: (
      <svg viewBox="0 0 28 28" fill="none" className="w-7 h-7">
        <path d="M15 3L5 16h9l-1 9 10-13h-9l1-9z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" fill="currentColor" fillOpacity="0.1" />
      </svg>
    ),
    checkList: ["No-code builder", "Event-based triggers", "API integrations"],
  },
];

function ConnectorLine({ inView }) {
  return (
    <div className="hidden lg:flex absolute top-[52px] left-[calc(8.33%+24px)] right-[calc(8.33%+24px)] h-0.5 items-center z-0 pointer-events-none">
      <div
        className="relative w-full h-full overflow-hidden rounded-full bg-slate-100"
        style={{ boxShadow: "0 0 8px rgba(99,102,241,0.1)" }}
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            width: inView ? "100%" : "0%",
            background: "linear-gradient(90deg, #4f46e5 0%, #0891b2 25%, #7c3aed 50%, #059669 75%, #d97706 90%, #dc2626 100%)",
            transition: "width 1.8s cubic-bezier(0.4,0,0.2,1) 0.3s",
            boxShadow: "0 0 10px rgba(99,102,241,0.3)",
          }}
        />
        <div
          className="absolute inset-y-0 w-20 rounded-full"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
            left: inView ? "calc(100% + 40px)" : "-80px",
            transition: "left 1.8s cubic-bezier(0.4,0,0.2,1) 0.3s",
          }}
        />
      </div>
    </div>
  );
}

function StepCard({ step, index, inView, isCore }) {
  const { ref, onMove, onLeave } = useTilt(5);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative flex flex-col items-center"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(30px)",
        transition: `opacity 0.55s ease ${index * 100}ms, transform 0.55s ease ${index * 100}ms`,
      }}
    >
      {/* Animated Step Number - Floating with orbit effect */}
      <div
        className="relative z-10 mb-6 will-change-transform"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          animation: inView ? `floatNumber 3s ease-in-out infinite ${index * 200}ms` : "none",
        }}
      >
        {/* Orbit ring */}
        <div 
          className="absolute inset-0 rounded-full transition-all duration-500"
          style={{
            background: `linear-gradient(135deg, ${step.color}20, transparent)`,
            transform: isHovered ? "scale(1.3)" : "scale(1)",
            opacity: isHovered ? 1 : 0,
            transition: "all 0.5s ease",
          }}
        />
        
        {/* Main number badge */}
        <div
          className="relative w-14 h-14 rounded-2xl flex items-center justify-center font-mono text-[13px] font-bold shadow-lg will-change-transform transition-all duration-300"
          style={{
            background: `linear-gradient(135deg, ${step.color}, ${step.color}dd)`,
            color: "white",
            boxShadow: isHovered 
              ? `0 8px 30px ${step.shadowColor}, 0 0 0 4px white, 0 0 0 6px ${step.border}, 0 0 40px ${step.glowColor}`
              : `0 4px 20px ${step.shadowColor}, 0 0 0 3px white, 0 0 0 4px ${step.border}`,
            transform: isHovered ? "scale(1.1) rotate(3deg)" : "scale(1)",
          }}
        >
          {step.num}
          
          {/* Pulse rings */}
          <span 
            className="absolute inset-0 rounded-2xl animate-ping opacity-20"
            style={{ background: step.color, animationDuration: "2s" }}
          />
        </div>
        
        {/* Floating particles */}
        <div className="absolute -top-2 -right-2 w-3 h-3 rounded-full bg-white shadow-sm animate-bounce" style={{ animationDelay: `${index * 100}ms`, animationDuration: "2s" }} />
        <div className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full bg-white/80 shadow-sm animate-pulse" style={{ animationDelay: `${index * 150}ms` }} />
      </div>

      {/* Card with enhanced animations */}
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="group relative bg-white border border-slate-200/80 rounded-2xl p-5 w-full cursor-default will-change-transform overflow-hidden"
        style={{
          boxShadow: "0 2px 8px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)",
          transform: "translateZ(0)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = `0 24px 50px ${step.shadowColor}, 0 8px 20px rgba(0,0,0,0.08)`;
          e.currentTarget.style.borderColor = step.border;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)";
          e.currentTarget.style.borderColor = "";
        }}
      >
        {/* Animated gradient background */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
          style={{ 
            background: `radial-gradient(circle at 30% 20%, ${step.lightBg} 0%, transparent 65%)`,
          }}
        />
        
        {/* Shimmer effect */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-2xl overflow-hidden"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
            transform: "translateX(-100%)",
            animation: "shimmer 2s infinite",
          }}
        />

        {/* Top accent line with glow */}
        <div
          className="absolute top-0 left-4 right-4 h-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
          style={{ 
            background: `linear-gradient(90deg, transparent, ${step.color}, transparent)`,
            boxShadow: `0 0 10px ${step.color}`,
          }}
        />

        <div className="relative z-10">
          {/* Icon with rotation animation */}
          <div className="flex items-start justify-between mb-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
              style={{ 
                background: step.lightBg, 
                color: step.color, 
                border: `1.5px solid ${step.border}`,
                boxShadow: `0 4px 15px ${step.shadowColor}`,
              }}
            >
              <div className="transition-transform duration-500 group-hover:scale-110">
                {step.icon}
              </div>
            </div>
            {!isCore && (
              <span
                className="text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full animate-pulse"
                style={{ 
                  color: step.color, 
                  background: step.lightBg, 
                  border: `1px solid ${step.border}`,
                  animationDuration: "3s",
                }}
              >
                Power
              </span>
            )}
          </div>

          {/* Title with color transition */}
          <h3
            className="text-[14.5px] font-bold mb-2 leading-snug transition-all duration-300"
            style={{ color: "slate-900" }}
          >
            <span 
              className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent group-hover:from-current group-hover:to-current transition-all duration-300"
              style={{ "--tw-gradient-from": step.color, "--tw-gradient-to": step.color }}
            >
              {step.title}
            </span>
          </h3>

          {/* Description */}
          <p className="text-[12.5px] text-slate-500 leading-relaxed mb-4 group-hover:text-slate-600 transition-colors duration-300">
            {step.description}
          </p>

          {/* Animated checklist */}
          <ul className="space-y-2 mb-4">
            {step.checkList.map((item, i) => (
              <li 
                key={item} 
                className="flex items-center gap-2 text-[11.5px] text-slate-500 transition-all duration-300"
                style={{
                  opacity: 0,
                  transform: "translateX(-10px)",
                  animation: inView ? `slideIn 0.4s ease forwards ${index * 100 + i * 100}ms` : "none",
                }}
              >
                <span
                  className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                  style={{ background: step.lightBg }}
                >
                  <svg viewBox="0 0 10 10" fill="none" className="w-2.5 h-2.5">
                    <path d="M2 5l2 2 4-4" stroke={step.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="group-hover:text-slate-600 transition-colors duration-300">{item}</span>
              </li>
            ))}
          </ul>

          {/* Detail tag with hover effect */}
          <div 
            className="pt-3 border-t border-slate-100 transition-all duration-300"
            style={{ borderColor: "rgba(226, 232, 240, 0.5)" }}
          >
            <p 
              className="text-[10.5px] font-medium transition-all duration-300"
              style={{ color: "slate-400" }}
            >
              <span className="group-hover:text-current transition-colors duration-300" style={{ color: step.color }}>
                {step.detail.split(" · ")[0]}
              </span>
              {" · "}
              {step.detail.split(" · ").slice(1).join(" · ")}
            </p>
          </div>
        </div>

        {/* Corner decoration */}
        <div 
          className="absolute -bottom-8 -right-8 w-16 h-16 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500"
          style={{ background: step.lightBg }}
        />
      </div>
    </div>
  );
}

export default function HowItWorksSection() {
  const [sectionRef, inView] = useInView(0.05);
  const coreSteps = STEPS.slice(0, 4);
  const extraSteps = STEPS.slice(4);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-slate-50 py-28"
      aria-labelledby="how-heading"
    >
      {/* Background depth - no top border */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 15% 30%, rgba(238,242,255,0.8) 0%, transparent 55%)," +
              "radial-gradient(ellipse 50% 60% at 85% 70%, rgba(236,254,255,0.7) 0%, transparent 50%)",
          }}
        />
        <div className="absolute -top-32 left-1/4 w-[440px] h-[440px] bg-indigo-200/40 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "8s" }} />
        <div className="absolute bottom-0 right-1/4 w-[380px] h-[380px] bg-sky-200/35 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "10s", animationDelay: "2s" }} />
        <div className="absolute top-1/2 -left-20 w-64 h-64 bg-violet-100/40 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.022]"
          style={{
            backgroundImage: "radial-gradient(circle, #6366f1 1.5px, transparent 1.5px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div
          className="text-center mb-20"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(22px)",
            transition: "opacity 0.65s ease, transform 0.65s ease",
          }}
        >
          <div className="inline-flex items-center gap-2.5 bg-white border border-indigo-200 rounded-full px-5 py-2 mb-5 shadow-sm hover:shadow-md transition-shadow duration-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500 opacity-50" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600" />
            </span>
            <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-[0.16em]">
              How It Works
            </span>
          </div>

          <h2
            id="how-heading"
            className="text-3xl md:text-[2.8rem] font-bold text-slate-900 tracking-tight leading-[1.08] mb-5"
          >
            From signup to smart management{" "}
            <span
              className="relative inline-block"
              style={{
                backgroundImage: "linear-gradient(135deg, #4f46e5 0%, #0891b2 60%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              in minutes.
            </span>
          </h2>

          <p className="text-[16px] text-slate-600 leading-relaxed max-w-2xl mx-auto">
            SBMS is designed for fast deployment. Four straightforward steps get your entire business up and running — no IT team, no long onboarding, no complexity.
          </p>
        </div>

        {/* Core Steps */}
        <div className="relative mb-10">
          <ConnectorLine inView={inView} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-4">
            {coreSteps.map((step, i) => (
              <StepCard key={step.num} step={step} index={i} inView={inView} isCore />
            ))}
          </div>
        </div>

        {/* Power Features label */}
        <div
          className="flex items-center gap-4 my-10"
          style={{
            opacity: inView ? 1 : 0,
            transition: "opacity 0.6s ease 0.5s",
          }}
        >
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-1.5 shadow-sm flex-shrink-0 hover:shadow-md transition-shadow duration-300">
            <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5 text-indigo-500">
              <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">Power Features</span>
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        </div>

        {/* Power Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-20">
          {extraSteps.map((step, i) => (
            <StepCard key={step.num} step={step} index={4 + i} inView={inView} isCore={false} />
          ))}
        </div>

        {/* CTA */}
        <div
          className="flex flex-col items-center gap-4 text-center"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.6s ease 0.65s, transform 0.6s ease 0.65s",
          }}
        >
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <a
              href="/signup"
              className="inline-flex items-center gap-2 text-white font-semibold text-[14.5px] px-7 py-3.5 rounded-xl hover:-translate-y-0.5 transition-all duration-150 shadow-lg hover:shadow-xl"
              style={{
                background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                boxShadow: "0 6px 20px rgba(79,70,229,0.32)",
              }}
            >
              Start Your Free Trial
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a
              href="#demo"
              className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 font-semibold text-[14.5px] px-7 py-3.5 rounded-xl hover:border-indigo-300 hover:text-indigo-700 hover:bg-indigo-50 hover:-translate-y-0.5 transition-all duration-150 shadow-sm hover:shadow-md"
            >
              Watch Demo
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.6" />
                <path d="M6.5 5.5l5 2.5-5 2.5V5.5z" fill="currentColor" />
              </svg>
            </a>
          </div>
          <p className="text-[12.5px] text-slate-400 mt-1">
            Free 14-day trial · No credit card · Setup in under 5 minutes
          </p>
        </div>

      </div>

      <style>{`
        @keyframes floatNumber {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-6px) rotate(2deg); }
          50% { transform: translateY(-3px) rotate(-1deg); }
          75% { transform: translateY(-8px) rotate(1deg); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes slideIn {
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </section>
  );
}