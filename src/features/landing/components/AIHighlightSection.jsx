import React, { useState, useEffect, useRef } from 'react';

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

function useTilt(strength = 8) {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * strength * 2;
    const y = ((e.clientY - r.top) / r.height - 0.5) * strength * -2;
    el.style.transform = `perspective(1000px) rotateX(${y}deg) rotateY(${x}deg) translateZ(12px)`;
    el.style.transition = "transform 0.1s ease";
  };
  const onLeave = () => {
    if (ref.current) {
      ref.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)";
      ref.current.style.transition = "transform 0.5s cubic-bezier(0.23,1,0.32,1)";
    }
  };
  return { ref, onMove, onLeave };
}

const AI_FEATURES = [
  {
    id: 1,
    color: "#4f46e5",
    lightBg: "#eef2ff",
    border: "#c7d2fe",
    label: "Chat",
    title: "AI Chat Assistant",
    description: "Ask anything in plain English — team stats, KPIs, attendance trends. Get boardroom-quality answers in seconds.",
    icon: (
      <svg viewBox="0 0 22 22" fill="none" className="w-5 h-5">
        <path d="M4 4h14a2 2 0 012 2v8a2 2 0 01-2 2H8l-4 3V6a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        <path d="M8 9h6M8 12h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 2,
    color: "#0891b2",
    lightBg: "#ecfeff",
    border: "#a5f3fc",
    label: "Detection",
    title: "Smart Attendance Anomaly",
    description: "AI flags unusual absences, location mismatches, and repetitive patterns before they become payroll or compliance issues.",
    icon: (
      <svg viewBox="0 0 22 22" fill="none" className="w-5 h-5">
        <circle cx="11" cy="11" r="8.5" stroke="currentColor" strokeWidth="1.7" />
        <path d="M11 7v4l2.5 2.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4.5 4.5l13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 3,
    color: "#7c3aed",
    lightBg: "#f5f3ff",
    border: "#ddd6fe",
    label: "Auto",
    title: "Meeting Auto-Summaries",
    description: "Every meeting transcribed and summarized automatically — action items, owners, and decisions delivered to all attendees.",
    icon: (
      <svg viewBox="0 0 22 22" fill="none" className="w-5 h-5">
        <rect x="3" y="3" width="16" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
        <path d="M7 8h8M7 11.5h5M7 15h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 4,
    color: "#059669",
    lightBg: "#ecfdf5",
    border: "#a7f3d0",
    label: "Predict",
    title: "Predictive Team Insights",
    description: "Surface burnout risk, performance dips, and hiring gaps weeks early — powered by behavioral pattern analysis.",
    icon: (
      <svg viewBox="0 0 22 22" fill="none" className="w-5 h-5">
        <path d="M3 17l4-5 3.5 3 4-6 4.5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18 6l2 2-2 2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="3" y1="17" x2="19" y2="17" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
];

const CHAT_MESSAGES = [
  { id: 1, role: "user", text: "Which departments had the most absences last month?" },
  { id: 2, role: "ai", text: "Engineering had 14 unplanned absences (+38% vs prior month), followed by Sales at 9. I've flagged 3 employees with repeat patterns — want a detailed report?" },
  { id: 3, role: "user", text: "Summarize yesterday's leadership meeting." },
  { id: 4, role: "ai", text: "Q3 headcount approved (+12 roles). New attendance policy from Aug 1. Action items assigned to 4 owners. Full transcript available." },
];

const STATS = [
  { value: "97%", label: "Detection Accuracy", sub: "AI anomaly detection", color: "#4f46e5", bg: "#eef2ff" },
  { value: "< 2s", label: "Response Time", sub: "Natural language queries", color: "#0891b2", bg: "#ecfeff" },
  { value: "80%", label: "Admin Time Saved", sub: "Per manager monthly", color: "#7c3aed", bg: "#f5f3ff" },
  { value: "50+", label: "AI Integrations", sub: "Native workflow hooks", color: "#059669", bg: "#ecfdf5" },
];

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3 bg-indigo-50 border border-indigo-100 rounded-2xl rounded-bl-sm w-fit">
      {[0, 180, 360].map((d) => (
        <span
          key={d}
          className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce"
          style={{ animationDelay: `${d}ms`, animationDuration: "0.9s" }}
        />
      ))}
    </div>
  );
}

function ChatMockup({ inView }) {
  const [shown, setShown] = useState([]);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    if (!inView) return;
    const timers = [];
    CHAT_MESSAGES.forEach((msg, i) => {
      const base = 500 + i * 800;
      if (msg.role === "ai") {
        timers.push(setTimeout(() => setTyping(true), base - 400));
        timers.push(setTimeout(() => { setTyping(false); setShown((p) => [...p, msg.id]); }, base));
      } else {
        timers.push(setTimeout(() => setShown((p) => [...p, msg.id]), base));
      }
    });
    return () => timers.forEach(clearTimeout);
  }, [inView]);

  const tilt = useTilt(5);

  return (
    <div
      className="relative"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(36px)",
        transition: "opacity 0.8s ease 0.35s, transform 0.8s ease 0.35s",
      }}
    >
      {/* Layered 3D shadow planes */}
      <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-3xl bg-indigo-200/50 blur-sm -z-10" />
      <div className="absolute inset-0 translate-x-6 translate-y-6 rounded-3xl bg-indigo-100/40 blur-md -z-20" />

      {/* Glow ring */}
      <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-indigo-300/40 via-sky-200/20 to-violet-300/30 blur-lg -z-10" />

      {/* Main card with 3D tilt */}
      <div
        ref={tilt.ref}
        onMouseMove={tilt.onMove}
        onMouseLeave={tilt.onLeave}
        className="relative bg-white rounded-2xl border border-slate-200 overflow-hidden will-change-transform"
        style={{ boxShadow: "0 20px 60px rgba(99,102,241,0.15), 0 4px 16px rgba(0,0,0,0.06)" }}
      >
        {/* Title bar */}
        <div
          className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100"
          style={{ background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)" }}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <svg viewBox="0 0 18 18" fill="none" className="w-4 h-4">
                <path d="M9 2a5 5 0 015 5v2l1.5 1.5V12h-1.5A5 5 0 014 12h-1.5v-1.5L4 9V7a5 5 0 015-5z" stroke="white" strokeWidth="1.6" strokeLinejoin="round" />
                <path d="M6.5 9.5h.01M9 9.5h.01M11.5 9.5h.01" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <p className="text-[12px] font-bold text-white leading-none">SBMS AI Assistant</p>
              <p className="text-[10px] text-indigo-200 mt-0.5 flex items-center gap-1 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 inline-block animate-pulse" />
                Online · Ready
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {["bg-red-400", "bg-amber-300", "bg-emerald-400"].map((c) => (
              <span key={c} className={`w-2.5 h-2.5 rounded-full ${c} opacity-80`} />
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="px-4 py-5 space-y-3.5 min-h-[300px] max-h-[300px] overflow-hidden bg-slate-50/50">
          {CHAT_MESSAGES.map((msg) => {
            const vis = shown.includes(msg.id);
            return (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                style={{
                  opacity: vis ? 1 : 0,
                  transform: vis ? "translateY(0)" : "translateY(10px)",
                  transition: "opacity 0.4s ease, transform 0.4s ease",
                }}
              >
                {msg.role === "ai" && (
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center mr-2 mt-0.5 flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}
                  >
                    <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
                      <path d="M2 8l2-2 2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
                <div
                  className={`max-w-[78%] text-[12px] leading-relaxed px-3.5 py-2.5 rounded-2xl ${
                    msg.role === "user"
                      ? "text-white rounded-br-sm shadow-sm"
                      : "bg-white text-slate-700 border border-slate-200 rounded-bl-sm shadow-sm"
                  }`}
                  style={msg.role === "user" ? { background: "linear-gradient(135deg, #4f46e5, #6d28d9)" } : {}}
                >
                  {msg.text}
                </div>
              </div>
            );
          })}
          {typing && (
            <div className="flex justify-start">
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center mr-2 mt-0.5 flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}
              >
                <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
                  <path d="M2 8l2-2 2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <TypingIndicator />
            </div>
          )}
        </div>

        {/* Input bar */}
        <div className="px-4 pb-4 pt-2 bg-white border-t border-slate-100">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5">
            <input
              readOnly
              className="flex-1 bg-transparent text-[12px] text-slate-400 placeholder:text-slate-400 outline-none cursor-default"
              placeholder="Ask SBMS AI anything…"
            />
            <button
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 hover:opacity-90 transition-opacity"
              style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}
              aria-label="Send"
            >
              <svg viewBox="0 0 14 14" fill="none" className="w-3.5 h-3.5">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Floating badge — top right */}
      <div
        className="absolute -top-5 -right-5 bg-white border border-slate-200 rounded-2xl px-4 py-2.5 shadow-xl"
        style={{
          opacity: inView ? 1 : 0,
          transition: "opacity 0.6s ease 1.5s",
          animation: inView ? "floatBadge 4s ease-in-out infinite 1.5s" : "none",
          boxShadow: "0 8px 24px rgba(99,102,241,0.15)",
        }}
      >
        <p className="text-[13px] font-bold text-indigo-600 leading-none">97% Accuracy</p>
        <p className="text-[10px] text-slate-400 mt-0.5">Anomaly detection</p>
      </div>

      {/* Floating badge — bottom left */}
      <div
        className="absolute -bottom-5 -left-5 bg-white border border-slate-200 rounded-2xl px-4 py-2.5 shadow-xl"
        style={{
          opacity: inView ? 1 : 0,
          transition: "opacity 0.6s ease 1.7s",
          animation: inView ? "floatBadge 4.5s ease-in-out infinite 1.7s reverse" : "none",
          boxShadow: "0 8px 24px rgba(8,145,178,0.12)",
        }}
      >
        <p className="text-[13px] font-bold text-cyan-600 leading-none">80% Less Work</p>
        <p className="text-[10px] text-slate-400 mt-0.5">HR admin saved</p>
      </div>
    </div>
  );
}

function FeatureBlock({ feature, index, inView }) {
  return (
    <div
      className="group flex items-start gap-4 px-5 py-4 rounded-2xl border border-slate-200/80 bg-white hover:border-transparent hover:shadow-lg cursor-default transition-all duration-300"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateX(0)" : "translateX(-20px)",
        transition: `opacity 0.5s ease ${150 + index * 100}ms, transform 0.5s ease ${150 + index * 100}ms, box-shadow 0.3s ease, border-color 0.3s ease`,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = feature.border; e.currentTarget.style.boxShadow = `0 8px 28px ${feature.color}18`; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = ""; e.currentTarget.style.boxShadow = ""; }}
    >
      {/* Colored icon */}
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 transition-transform duration-300 group-hover:scale-110"
        style={{ background: feature.lightBg, color: feature.color, border: `1.5px solid ${feature.border}` }}
      >
        {feature.icon}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-[14.5px] font-semibold text-slate-900 leading-none">{feature.title}</p>
          <span
            className="text-[9.5px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
            style={{ color: feature.color, background: feature.lightBg, border: `1px solid ${feature.border}` }}
          >
            {feature.label}
          </span>
        </div>
        <p className="text-[13px] text-slate-500 leading-relaxed">{feature.description}</p>
      </div>
    </div>
  );
}

function StatCard({ stat, index, inView }) {
  const tilt = useTilt(4);
  return (
    <div
      ref={tilt.ref}
      onMouseMove={tilt.onMove}
      onMouseLeave={tilt.onLeave}
      className="group relative bg-white border border-slate-200 rounded-2xl p-5 text-center will-change-transform cursor-default overflow-hidden"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.5s ease ${500 + index * 80}ms, transform 0.5s ease ${500 + index * 80}ms`,
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 12px 32px ${stat.color}20`; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)"; }}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
        style={{ background: `radial-gradient(circle at 50% 0%, ${stat.bg} 0%, transparent 70%)` }}
      />
      <p
        className="text-[1.9rem] font-extrabold tabular-nums leading-none mb-1 relative z-10"
        style={{ color: stat.color }}
      >
        {stat.value}
      </p>
      <p className="text-[12.5px] font-semibold text-slate-700 relative z-10">{stat.label}</p>
      <p className="text-[11px] text-slate-400 mt-0.5 relative z-10">{stat.sub}</p>
    </div>
  );
}

export default function AIHighlightSection() {
  const [sectionRef, inView] = useInView(0.06);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-28 bg-slate-50"
      aria-labelledby="ai-heading"
    >
      {/* ── Rich layered background ─── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {/* Gradient mesh */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 10% 20%, rgba(238,242,255,0.9) 0%, transparent 55%), " +
              "radial-gradient(ellipse 60% 50% at 90% 80%, rgba(236,254,255,0.8) 0%, transparent 50%), " +
              "radial-gradient(ellipse 50% 40% at 50% 50%, rgba(245,243,255,0.6) 0%, transparent 60%)",
          }}
        />
        {/* Blurred orbs */}
        <div className="absolute -top-24 -left-24 w-[480px] h-[480px] bg-indigo-200/50 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-32 w-[420px] h-[420px] bg-sky-200/40 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 w-72 h-72 bg-violet-200/40 rounded-full blur-3xl" />
        <div className="absolute top-20 right-1/4 w-56 h-56 bg-emerald-100/50 rounded-full blur-3xl" />
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle, #6366f1 1.5px, transparent 1.5px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ─── */}
        <div
          className="text-center mb-16"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.65s ease, transform 0.65s ease",
          }}
        >
          <div className="inline-flex items-center gap-2.5 bg-white border border-indigo-200 rounded-full px-5 py-2 mb-6 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500 opacity-50" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600" />
            </span>
            <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-[0.16em]">
              AI-Powered Intelligence
            </span>
          </div>

          <h2
            id="ai-heading"
            className="text-3xl md:text-[2.85rem] font-bold text-slate-900 tracking-tight leading-[1.08] mb-5"
          >
            AI that works{" "}
            <span
              className="relative inline-block"
              style={{
                backgroundImage: "linear-gradient(135deg, #4f46e5 0%, #0891b2 50%, #7c3aed 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              alongside
            </span>
            {" "}your team.
          </h2>

          <p className="text-[16px] text-slate-600 leading-relaxed max-w-2xl mx-auto">
            SBMS embeds intelligence into every workflow — cutting admin work by{" "}
            <strong className="text-indigo-600 font-semibold">80%</strong>, predicting issues before they arise, and answering your toughest operational questions in seconds.
          </p>
        </div>

        {/* ── Split layout ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center mb-16">

          {/* Left: Features + CTA */}
          <div className="space-y-3">
            {AI_FEATURES.map((f, i) => (
              <FeatureBlock key={f.id} feature={f} index={i} inView={inView} />
            ))}

            {/* CTA row */}
            <div
              className="pt-4 flex flex-wrap items-center gap-3"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(14px)",
                transition: "opacity 0.6s ease 0.7s, transform 0.6s ease 0.7s",
              }}
            >
              <a
                href="/signup"
                className="inline-flex items-center gap-2 text-white font-semibold text-[14px] px-6 py-3 rounded-xl hover:-translate-y-0.5 transition-all duration-150 shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                  boxShadow: "0 6px 20px rgba(79,70,229,0.35)",
                }}
              >
                Try AI Features Free
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a
                href="#ai-demo"
                className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-indigo-600 hover:text-indigo-700 transition-colors duration-150"
              >
                See how it works
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </div>

          {/* Right: Chat UI */}
          <div className="flex items-center justify-center lg:justify-end">
            <div className="w-full max-w-[430px]">
              <ChatMockup inView={inView} />
            </div>
          </div>
        </div>

        {/* ── Stats row ─── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((s, i) => (
            <StatCard key={s.label} stat={s} index={i} inView={inView} />
          ))}
        </div>

      </div>

      <style>{`
        @keyframes floatBadge {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33%       { transform: translateY(-6px) rotate(0.5deg); }
          66%       { transform: translateY(-3px) rotate(-0.5deg); }
        }
      `}</style>
    </section>
  );
}