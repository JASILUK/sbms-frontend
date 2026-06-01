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

function useTilt() {
  const ref = useRef(null);

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotateX = ((y - cy) / cy) * -6;
    const rotateY = ((x - cx) / cx) * 6;
    el.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) scale(1.02)`;
  };

  const handleLeave = () => {
    if (ref.current) {
      ref.current.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)";
    }
  };

  return { ref, handleMove, handleLeave };
}

const FEATURES = [
  {
    id: 1,
    badge: "Core",
    badgeColor: "bg-indigo-100 text-indigo-600",
    iconBg: "from-indigo-500 to-indigo-700",
    glowColor: "rgba(99,102,241,0.12)",
    title: "Smart Attendance Management",
    description:
      "Real-time check-ins with geo-fencing, biometric sync, and automatic payroll integration. Eliminate spreadsheets forever.",
    stat: "94%",
    statLabel: "reduction in manual errors",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <rect x="3" y="4" width="18" height="17" rx="2.5" stroke="white" strokeWidth="1.7" />
        <path d="M8 2v4M16 2v4" stroke="white" strokeWidth="1.7" strokeLinecap="round" />
        <line x1="3" y1="9" x2="21" y2="9" stroke="white" strokeWidth="1.5" />
        <path d="M8 13h2M8 17h2M14 13h2M14 17h2" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 2,
    badge: "AI",
    badgeColor: "bg-violet-100 text-violet-600",
    iconBg: "from-violet-500 to-violet-700",
    glowColor: "rgba(139,92,246,0.12)",
    title: "AI-Powered Meeting Summaries",
    description:
      "Automatically transcribe, summarize, and distribute meeting notes with action items — so nothing falls through the cracks.",
    stat: "3×",
    statLabel: "faster post-meeting follow-up",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <path d="M12 2a7 7 0 017 7v3l2 2v2h-2a7 7 0 01-14 0h-2v-2l2-2V9a7 7 0 017-7z" stroke="white" strokeWidth="1.7" strokeLinejoin="round" />
        <path d="M9 17a3 3 0 006 0" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M9 11h.01M12 11h.01M15 11h.01" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 3,
    badge: "Realtime",
    badgeColor: "bg-sky-100 text-sky-600",
    iconBg: "from-sky-500 to-cyan-600",
    glowColor: "rgba(14,165,233,0.12)",
    title: "Real-Time Team Collaboration",
    description:
      "Shared workspaces, live task boards, and instant notifications keep distributed teams perfectly in sync across time zones.",
    stat: "47%",
    statLabel: "faster project completion",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <circle cx="8" cy="7" r="3" stroke="white" strokeWidth="1.7" />
        <circle cx="16" cy="7" r="3" stroke="white" strokeWidth="1.7" />
        <circle cx="12" cy="16" r="3" stroke="white" strokeWidth="1.7" />
        <line x1="8" y1="10" x2="12" y2="13" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="16" y1="10" x2="12" y2="13" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 4,
    badge: "Enterprise",
    badgeColor: "bg-emerald-100 text-emerald-600",
    iconBg: "from-emerald-500 to-teal-600",
    glowColor: "rgba(16,185,129,0.12)",
    title: "Multi-Company Architecture",
    description:
      "Manage unlimited subsidiaries, branches, and entities from a single account — with isolated data and unified reporting.",
    stat: "∞",
    statLabel: "companies, one dashboard",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <rect x="2" y="7" width="7" height="12" rx="1.5" stroke="white" strokeWidth="1.7" />
        <rect x="8.5" y="3" width="7" height="16" rx="1.5" stroke="white" strokeWidth="1.7" />
        <rect x="15" y="9" width="7" height="10" rx="1.5" stroke="white" strokeWidth="1.7" />
        <line x1="5.5" y1="11" x2="5.5" y2="15" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="12" y1="7" x2="12" y2="15" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="18.5" y1="13" x2="18.5" y2="15" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 5,
    badge: "Security",
    badgeColor: "bg-rose-100 text-rose-600",
    iconBg: "from-rose-500 to-rose-700",
    glowColor: "rgba(244,63,94,0.10)",
    title: "Role-Based Access Control",
    description:
      "Granular permissions down to field level — define exactly who sees what, who edits what, across every company and department.",
    stat: "256-bit",
    statLabel: "enterprise-grade encryption",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <rect x="5" y="11" width="14" height="10" rx="2" stroke="white" strokeWidth="1.7" />
        <path d="M8 11V7a4 4 0 018 0v4" stroke="white" strokeWidth="1.7" strokeLinecap="round" />
        <circle cx="12" cy="16" r="1.8" fill="white" fillOpacity="0.9" />
        <line x1="12" y1="17.8" x2="12" y2="19.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 6,
    badge: "Automation",
    badgeColor: "bg-amber-100 text-amber-600",
    iconBg: "from-amber-500 to-orange-500",
    glowColor: "rgba(245,158,11,0.10)",
    title: "Workflow Automation Engine",
    description:
      "Trigger multi-step automations on any event — approvals, escalations, notifications, and reports that run without human touch.",
    stat: "80%",
    statLabel: "of routine tasks eliminated",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="white" strokeWidth="1.7" strokeLinejoin="round" fill="white" fillOpacity="0.15" />
      </svg>
    ),
  },
  {
    id: 7,
    badge: "Analytics",
    badgeColor: "bg-indigo-100 text-indigo-600",
    iconBg: "from-indigo-400 to-blue-600",
    glowColor: "rgba(99,102,241,0.10)",
    title: "Smart Analytics Dashboard",
    description:
      "Interactive charts, KPI tracking, and drill-down reports that surface the insights your executives actually need — in real time.",
    stat: "50+",
    statLabel: "pre-built report templates",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <path d="M3 20l4-7 4 3 4-6 4 4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20 8l-2-2 2-2" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="3" y1="20" x2="21" y2="20" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 8,
    badge: "Insights",
    badgeColor: "bg-sky-100 text-sky-600",
    iconBg: "from-sky-400 to-indigo-500",
    glowColor: "rgba(56,189,248,0.10)",
    title: "Company-Level Intelligence",
    description:
      "Benchmark performance across entities, flag risk early, and make data-driven decisions with AI-generated board-ready summaries.",
    stat: "AI",
    statLabel: "predictive anomaly detection",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.7" />
        <path d="M12 7v5l3 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7.8 19.4l.9-2.5M16.2 19.4l-.9-2.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 9,
    badge: "Scale",
    badgeColor: "bg-teal-100 text-teal-600",
    iconBg: "from-teal-500 to-emerald-600",
    glowColor: "rgba(20,184,166,0.10)",
    title: "Scalable Team Structure",
    description:
      "Hierarchical org charts, dynamic reporting lines, and cross-department visibility that scales from 10 to 10,000 employees seamlessly.",
    stat: "10K+",
    statLabel: "employees per instance",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <circle cx="12" cy="4" r="2.2" stroke="white" strokeWidth="1.6" fill="white" fillOpacity="0.15" />
        <circle cx="5" cy="18" r="2.2" stroke="white" strokeWidth="1.6" fill="white" fillOpacity="0.15" />
        <circle cx="19" cy="18" r="2.2" stroke="white" strokeWidth="1.6" fill="white" fillOpacity="0.15" />
        <line x1="12" y1="6.2" x2="12" y2="12" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="12" y1="12" x2="5" y2="15.8" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="12" y1="12" x2="19" y2="15.8" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

function FeatureCard({ feature, index, inView }) {
  const { ref, handleMove, handleLeave } = useTilt();

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="group relative bg-white border border-slate-200/80 rounded-2xl p-7 cursor-default
        shadow-sm will-change-transform"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView
          ? "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)"
          : "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(28px) scale(1)",
        transition: `opacity 0.55s ease ${index * 70}ms, transform 0.55s ease ${index * 70}ms`,
        boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        transitionProperty: inView ? "box-shadow 0.35s ease" : "opacity, transform",
      }}
    >
      {/* Glow layer */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: `radial-gradient(circle at 30% 30%, ${feature.glowColor} 0%, transparent 65%)` }}
      />

      {/* Top shine on hover */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-300/60 to-transparent opacity-0 group-hover:opacity-100 rounded-t-2xl transition-opacity duration-300 pointer-events-none" />

      <div className="relative z-10">
        {/* Badge + Icon row */}
        <div className="flex items-start justify-between mb-5">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.iconBg} flex items-center justify-center shadow-md flex-shrink-0`}>
            {feature.icon}
          </div>
          <span className={`text-[10.5px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${feature.badgeColor}`}>
            {feature.badge}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-[16.5px] font-semibold text-slate-900 mb-2.5 leading-snug group-hover:text-indigo-700 transition-colors duration-200">
          {feature.title}
        </h3>

        {/* Description */}
        <p className="text-[13.5px] text-slate-500 leading-relaxed mb-6">
          {feature.description}
        </p>

        {/* Stat callout */}
        <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
          <span className="text-[20px] font-extrabold text-indigo-600 tabular-nums leading-none">
            {feature.stat}
          </span>
          <span className="text-[11.5px] text-slate-400 leading-tight">
            {feature.statLabel}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function FeaturesSection() {
  const [sectionRef, inView] = useInView(0.05);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-slate-50 py-24"
      aria-labelledby="features-heading"
    >
      {/* ── Decorative background blobs ─── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-36 -left-36 w-[550px] h-[550px] bg-indigo-100 rounded-full blur-3xl opacity-25" />
        <div className="absolute top-1/3 -right-44 w-[480px] h-[480px] bg-sky-100 rounded-full blur-3xl opacity-20" />
        <div className="absolute -bottom-32 left-1/4 w-96 h-96 bg-violet-100 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-indigo-200 rounded-full blur-3xl opacity-15" />
      </div>

      {/* ── Dot grid ─── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: "radial-gradient(circle, #6366f1 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ─── */}
        <div
          className="text-center mb-16"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(22px)",
            transition: "opacity 0.65s ease, transform 0.65s ease",
          }}
        >
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200/80 rounded-full px-4 py-1.5 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            <span className="text-[11px] font-semibold text-indigo-600 uppercase tracking-[0.15em]">
              Platform Features
            </span>
          </div>

          <h2
            id="features-heading"
            className="text-3xl md:text-[2.8rem] font-bold text-slate-900 tracking-tight leading-[1.1] mb-5"
          >
            Everything you need to{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-indigo-600">run your business</span>
              <span
                aria-hidden="true"
                className="absolute -bottom-1 left-0 w-full h-3 bg-indigo-100 rounded-full -z-0"
              />
            </span>
            <br className="hidden md:block" />
            {" "}efficiently.
          </h2>

          <p className="text-[16px] text-slate-600 leading-relaxed max-w-2xl mx-auto">
            From attendance tracking to AI-powered insights, SBMS gives you complete operational control — built for how modern businesses actually work.
          </p>
        </div>

        {/* ── Feature Grid ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feature, i) => (
            <FeatureCard key={feature.id} feature={feature} index={i} inView={inView} />
          ))}
        </div>

        {/* ── Bottom CTA strip ─── */}
        <div
          className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-4 text-center"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.6s ease 0.7s, transform 0.6s ease 0.7s",
          }}
        >
          <p className="text-[14.5px] text-slate-500">
            Ready to transform how your business operates?
          </p>
          <a
            href="/signup"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white text-[14px] font-semibold px-5 py-2.5 rounded-xl
              hover:bg-indigo-700 hover:-translate-y-0.5 shadow-md shadow-indigo-200 hover:shadow-indigo-300
              transition-all duration-150"
          >
            Start Free Trial
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

      </div>
    </section>
  );
}