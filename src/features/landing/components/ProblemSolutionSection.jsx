import { useEffect, useRef, useState } from "react";

function useInView(threshold = 0.1) {
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

const PROBLEMS = [
  {
    id: 1,
    accent: "#ef4444",
    accentBg: "#fef2f2",
    accentBorder: "#fecaca",
    accentLabel: "Critical",
    title: "Attendance Chaos",
    body: "Spreadsheets, paper logs, and manual check-ins create unreliable records — leading to payroll errors and compliance headaches.",
    icon: (
      <svg viewBox="0 0 28 28" fill="none" className="w-6 h-6">
        <rect x="4" y="6" width="20" height="18" rx="3" stroke="currentColor" strokeWidth="1.8" />
        <path d="M9 4v4M19 4v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="4" y1="11" x2="24" y2="11" stroke="currentColor" strokeWidth="1.5" />
        <path d="M14 16v3M14 22v.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    stat: "62%",
    statLabel: "of HR time wasted on manual tracking",
  },
  {
    id: 2,
    accent: "#f59e0b",
    accentBg: "#fffbeb",
    accentBorder: "#fde68a",
    accentLabel: "High Impact",
    title: "Manual HR Overload",
    body: "HR teams spend hours on data entry, leave approvals, and report generation — time that should go toward people, not paperwork.",
    icon: (
      <svg viewBox="0 0 28 28" fill="none" className="w-6 h-6">
        <circle cx="14" cy="9" r="4.5" stroke="currentColor" strokeWidth="1.8" />
        <path d="M5 23c0-4.4 4-8 9-8s9 3.6 9 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M21 12l2 2-2 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="18" y1="14" x2="23" y2="14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    stat: "8 hrs",
    statLabel: "lost per week per manager on admin",
  },
  {
    id: 3,
    accent: "#f59e0b",
    accentBg: "#fff7ed",
    accentBorder: "#fed7aa",
    accentLabel: "Productivity Risk",
    title: "Communication Gaps",
    body: "Emails, chat apps, and separate portals fragment team communication — leaving employees uninformed and decisions delayed.",
    icon: (
      <svg viewBox="0 0 28 28" fill="none" className="w-6 h-6">
        <path d="M4 7h20v13a2 2 0 01-2 2H6a2 2 0 01-2-2V7z" stroke="currentColor" strokeWidth="1.8" />
        <path d="M4 7l10 8 10-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="18" y1="18" x2="22" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="22" cy="18" r="1" fill="currentColor" />
      </svg>
    ),
    stat: "3.2×",
    statLabel: "more errors from siloed communication",
  },
  {
    id: 4,
    accent: "#ef4444",
    accentBg: "#fef2f2",
    accentBorder: "#fecaca",
    accentLabel: "Revenue Risk",
    title: "Meeting Confusion",
    body: "No-shows, double bookings, and poor meeting notes waste everyone's time and stall decisions that drive your business forward.",
    icon: (
      <svg viewBox="0 0 28 28" fill="none" className="w-6 h-6">
        <circle cx="14" cy="14" r="10" stroke="currentColor" strokeWidth="1.8" />
        <path d="M14 8v6l4 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 5l18 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    stat: "31%",
    statLabel: "of meetings end without clear decisions",
  },
];

const SOLUTIONS = [
  {
    icon: (
      <svg viewBox="0 0 22 22" fill="none" className="w-5 h-5">
        <rect x="2" y="3" width="18" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
        <path d="M7 7h8M7 11h5M7 15h6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    ),
    title: "Unified Dashboard",
    body: "Every metric, every team, every company — visible in one clean workspace.",
  },
  {
    icon: (
      <svg viewBox="0 0 22 22" fill="none" className="w-5 h-5">
        <path d="M4 11l4 4 10-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="11" cy="11" r="9" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
    title: "Automated Workflows",
    body: "Approvals, reminders, and reports run themselves — zero manual effort.",
  },
  {
    icon: (
      <svg viewBox="0 0 22 22" fill="none" className="w-5 h-5">
        <path d="M11 2v4M11 16v4M2 11h4M16 11h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <circle cx="11" cy="11" r="4.5" stroke="currentColor" strokeWidth="1.7" />
      </svg>
    ),
    title: "Smart Attendance",
    body: "Real-time check-ins, geo-fencing, and automatic payroll sync.",
  },
  {
    icon: (
      <svg viewBox="0 0 22 22" fill="none" className="w-5 h-5">
        <circle cx="7" cy="8" r="3" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="15" cy="8" r="3" stroke="currentColor" strokeWidth="1.6" />
        <path d="M3 19c0-2.8 1.8-5 4-5M11 19c0-2.8 1.8-5 4-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
    title: "Team Collaboration",
    body: "Departments, companies, and roles all aligned in a single hub.",
  },
  {
    icon: (
      <svg viewBox="0 0 22 22" fill="none" className="w-5 h-5">
        <path d="M3 17l4-4 3 3 4-5 5 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M17 3l2 2-2 2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "AI-Driven Insights",
    body: "Predict attrition, flag anomalies, and surface growth opportunities automatically.",
  },
  {
    icon: (
      <svg viewBox="0 0 22 22" fill="none" className="w-5 h-5">
        <path d="M4 6h14M4 11h10M4 16h12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <circle cx="17" cy="16" r="3.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M15.5 16l1 1 2-2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Multi-Company Control",
    body: "Manage unlimited entities, departments, and hierarchies — from one account.",
  },
];

function ProblemCard({ card, index, inView }) {
  return (
    <div
      className="group relative bg-white border border-slate-200 rounded-2xl p-6 shadow-sm
        hover:shadow-xl hover:border-slate-300 hover:-translate-y-1 hover:scale-[1.02]
        transition-all duration-300 ease-in-out overflow-hidden"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.55s ease ${index * 80}ms, transform 0.55s ease ${index * 80}ms, box-shadow 0.3s ease, scale 0.3s ease`,
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl opacity-60"
        style={{ background: card.accent }}
      />
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"
        style={{ background: `radial-gradient(circle at 20% 20%, ${card.accentBg} 0%, transparent 70%)` }}
      />
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: card.accentBg, color: card.accent, border: `1.5px solid ${card.accentBorder}` }}
          >
            {card.icon}
          </div>
          <span
            className="text-[10.5px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
            style={{ color: card.accent, background: card.accentBg, border: `1px solid ${card.accentBorder}` }}
          >
            {card.accentLabel}
          </span>
        </div>
        <h3 className="text-[16px] font-bold text-slate-900 mb-2 leading-snug">
          {card.title}
        </h3>
        <p className="text-[13.5px] text-slate-500 leading-relaxed mb-5">
          {card.body}
        </p>
        <div
          className="flex items-center gap-3 pt-4 border-t"
          style={{ borderColor: card.accentBorder }}
        >
          <span
            className="text-[22px] font-extrabold tabular-nums leading-none"
            style={{ color: card.accent }}
          >
            {card.stat}
          </span>
          <span className="text-[11.5px] text-slate-500 leading-tight max-w-[160px]">
            {card.statLabel}
          </span>
        </div>
      </div>
    </div>
  );
}

function SolutionItem({ item, index, inView }) {
  return (
    <div
      className="flex items-start gap-4 group"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateX(0)" : "translateX(-16px)",
        transition: `opacity 0.5s ease ${600 + index * 80}ms, transform 0.5s ease ${600 + index * 80}ms`,
      }}
    >
      <div className="w-9 h-9 rounded-xl bg-indigo-600/10 border border-indigo-200 flex items-center justify-center text-indigo-600 flex-shrink-0 mt-0.5 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all duration-200">
        {item.icon}
      </div>
      <div>
        <p className="text-[14px] font-semibold text-slate-900 leading-none mb-1">{item.title}</p>
        <p className="text-[13px] text-slate-500 leading-relaxed">{item.body}</p>
      </div>
    </div>
  );
}

export default function ProblemSolutionSection() {
  const [sectionRef, inView] = useInView(0.06);
  const [dividerRef, dividerInView] = useInView(0.3);
  const [solutionRef, solutionInView] = useInView(0.1);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-slate-50 py-24"
      aria-labelledby="problem-heading"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -right-40 w-[520px] h-[520px] bg-rose-100 rounded-full blur-3xl opacity-20" />
        <div className="absolute top-1/3 -left-32 w-96 h-96 bg-amber-100 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-indigo-100 rounded-full blur-3xl opacity-20" />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: "radial-gradient(circle, #64748b 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="max-w-3xl mb-14"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(22px)",
            transition: "opacity 0.65s ease, transform 0.65s ease",
          }}
        >
          <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200/80 rounded-full px-4 py-1.5 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[11px] font-semibold text-red-600 uppercase tracking-[0.14em]">
              The Problem
            </span>
          </div>
          <h2
            id="problem-heading"
            className="text-3xl md:text-[2.8rem] font-bold text-slate-900 tracking-tight leading-[1.1] mb-5"
          >
            Managing teams{" "}
            <span className="relative inline-block">
              <span className="relative z-10">shouldn't be</span>
              <svg
                aria-hidden="true"
                className="absolute -bottom-1.5 left-0 w-full"
                viewBox="0 0 200 8"
                preserveAspectRatio="none"
                fill="none"
              >
                <path
                  d="M2 6 C40 2 80 7 120 4 C160 1 190 5 198 3"
                  stroke="#ef4444"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  opacity="0.5"
                />
              </svg>
            </span>{" "}
            <span className="text-red-500">chaotic.</span>
          </h2>
          <p className="text-[16px] text-slate-600 leading-relaxed max-w-2xl">
            Disconnected tools, manual processes, and scattered communication slow down growing teams — costing time, money, and morale every single day.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-20">
          {PROBLEMS.map((card, i) => (
            <ProblemCard key={card.id} card={card} index={i} inView={inView} />
          ))}
        </div>
        <div
          ref={dividerRef}
          className="flex flex-col items-center gap-4 mb-20"
          style={{
            opacity: dividerInView ? 1 : 0,
            transform: dividerInView ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          <div className="flex flex-col items-center gap-1">
            <div className="w-px h-12 bg-gradient-to-b from-slate-200 to-indigo-400" />
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 3v10M4 9l4 4 4-4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="w-px h-12 bg-gradient-to-b from-indigo-400 to-slate-200" />
          </div>
          <div className="text-center">
            <p className="text-[11px] font-semibold text-indigo-500 uppercase tracking-[0.2em] mb-1">
              But it doesn't have to be
            </p>
            <p className="text-[22px] md:text-[28px] font-bold text-slate-900 tracking-tight">
              There's a better way.
            </p>
          </div>
        </div>
        <div
          ref={solutionRef}
          className="relative bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden"
          style={{
            opacity: solutionInView ? 1 : 0,
            transform: solutionInView ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 translate-y-1/2 -translate-x-1/4" />
          <div className="relative px-8 py-12 md:px-16 md:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6"
                  style={{ background: "#eef2ff", color: "#4f46e5", border: "1px solid #c7d2fe" }}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  The Solution
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                  SBMS fixes this.
                </h3>
                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                  One intelligent platform that connects your entire operation. From attendance to AI-powered insights, we handle the complexity so you can focus on growth.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                  {SOLUTIONS.map((item, index) => (
                    <SolutionItem key={item.title} item={item} index={index} inView={solutionInView} />
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="/signup"
                    className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                  >
                    Start Free Trial
                    <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </a>
                  <a
                    href="/demo"
                    className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-indigo-700 bg-indigo-50 rounded-xl hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                  >
                    Schedule Demo
                  </a>
                </div>
              </div>
              <div className="relative hidden lg:block">
                <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 transform rotate-1 hover:rotate-0 transition-transform duration-500">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-amber-400" />
                      <div className="w-3 h-3 rounded-full bg-emerald-400" />
                      <div className="flex-1 ml-4 h-2 bg-slate-100 rounded-full" />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="h-20 bg-indigo-50 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-indigo-600">98%</div>
                          <div className="text-xs text-slate-500">Attendance</div>
                        </div>
                      </div>
                      <div className="h-20 bg-slate-50 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-slate-700">24</div>
                          <div className="text-xs text-slate-500">Meetings</div>
                        </div>
                      </div>
                      <div className="h-20 bg-emerald-50 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-emerald-600">12</div>
                          <div className="text-xs text-slate-500">Teams</div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-slate-100 rounded-full w-full" />
                      <div className="h-3 bg-slate-100 rounded-full w-4/5" />
                      <div className="h-3 bg-slate-100 rounded-full w-3/5" />
                    </div>
                    <div className="flex items-center gap-3 pt-4">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="h-2 bg-slate-100 rounded-full w-32 mb-1" />
                        <div className="h-2 bg-slate-100 rounded-full w-20" />
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-4 -right-4 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-semibold">
                    AI Optimized ✨
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}