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

// Each logo has a unique color palette and SVG mark — designed to look like real brand logos
const LOGOS = [
  {
    name: "Acme Corp",
    accent: "#2563eb",       // blue-600
    bg: "#eff6ff",           // blue-50
    border: "#bfdbfe",       // blue-200
    textColor: "#1d4ed8",    // blue-700
    industry: "Manufacturing",
    mark: (
      <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polygon points="18,3 33,30 3,30" fill="#2563eb" fillOpacity="0.15" stroke="#2563eb" strokeWidth="2" strokeLinejoin="round" />
        <line x1="18" y1="14" x2="18" y2="22" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="18" cy="25.5" r="1.5" fill="#2563eb" />
      </svg>
    ),
    wordmark: "ACME",
    tagline: "Corp",
  },
  {
    name: "Vertix",
    accent: "#7c3aed",
    bg: "#f5f3ff",
    border: "#ddd6fe",
    textColor: "#6d28d9",
    industry: "Technology",
    mark: (
      <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="4" width="12" height="12" rx="3" fill="#7c3aed" />
        <rect x="20" y="4" width="12" height="12" rx="3" fill="#7c3aed" fillOpacity="0.3" />
        <rect x="4" y="20" width="12" height="12" rx="3" fill="#7c3aed" fillOpacity="0.3" />
        <rect x="20" y="20" width="12" height="12" rx="3" fill="#7c3aed" />
      </svg>
    ),
    wordmark: "VERTIX",
    tagline: "",
  },
  {
    name: "Loomis Global",
    accent: "#0891b2",
    bg: "#ecfeff",
    border: "#a5f3fc",
    textColor: "#0e7490",
    industry: "Finance",
    mark: (
      <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="18" cy="18" r="13" stroke="#0891b2" strokeWidth="2" fill="none" />
        <circle cx="18" cy="18" r="5" fill="#0891b2" />
        <line x1="18" y1="5" x2="18" y2="10" stroke="#0891b2" strokeWidth="2" strokeLinecap="round" />
        <line x1="18" y1="26" x2="18" y2="31" stroke="#0891b2" strokeWidth="2" strokeLinecap="round" />
        <line x1="5" y1="18" x2="10" y2="18" stroke="#0891b2" strokeWidth="2" strokeLinecap="round" />
        <line x1="26" y1="18" x2="31" y2="18" stroke="#0891b2" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    wordmark: "LOOMIS",
    tagline: "Global",
  },
  {
    name: "Nexon",
    accent: "#059669",
    bg: "#ecfdf5",
    border: "#a7f3d0",
    textColor: "#047857",
    industry: "Logistics",
    mark: (
      <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 29 L7 7 L18 29 L29 7 L29 29" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    ),
    wordmark: "NEXON",
    tagline: "Ltd",
  },
  {
    name: "Stratum",
    accent: "#d97706",
    bg: "#fffbeb",
    border: "#fde68a",
    textColor: "#b45309",
    industry: "Consulting",
    mark: (
      <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="8" width="28" height="5" rx="2.5" fill="#d97706" />
        <rect x="4" y="15.5" width="20" height="5" rx="2.5" fill="#d97706" fillOpacity="0.6" />
        <rect x="4" y="23" width="24" height="5" rx="2.5" fill="#d97706" fillOpacity="0.3" />
      </svg>
    ),
    wordmark: "STRATUM",
    tagline: "",
  },
  {
    name: "Orion Group",
    accent: "#dc2626",
    bg: "#fef2f2",
    border: "#fecaca",
    textColor: "#b91c1c",
    industry: "Aerospace",
    mark: (
      <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 4 L32 30 L4 30 Z" stroke="#dc2626" strokeWidth="2" strokeLinejoin="round" fill="#dc2626" fillOpacity="0.1" />
        <circle cx="18" cy="17" r="3" fill="#dc2626" />
        <circle cx="12" cy="26" r="2" fill="#dc2626" fillOpacity="0.5" />
        <circle cx="24" cy="26" r="2" fill="#dc2626" fillOpacity="0.5" />
      </svg>
    ),
    wordmark: "ORION",
    tagline: "Group",
  },
  {
    name: "Crestfield",
    accent: "#0f766e",
    bg: "#f0fdfa",
    border: "#99f6e4",
    textColor: "#0d5e57",
    industry: "Healthcare",
    mark: (
      <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 32 C18 32 5 24 5 14 C5 9 11 5 18 5 C25 5 31 9 31 14 C31 24 18 32 18 32Z" stroke="#0f766e" strokeWidth="2" fill="#0f766e" fillOpacity="0.1" />
        <path d="M13 16 L17 20 L24 13" stroke="#0f766e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    wordmark: "CREST",
    tagline: "field",
  },
  {
    name: "Halcyon",
    accent: "#4f46e5",
    bg: "#eef2ff",
    border: "#c7d2fe",
    textColor: "#4338ca",
    industry: "SaaS",
    mark: (
      <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 18 Q18 6 30 18" stroke="#4f46e5" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M6 18 Q18 30 30 18" stroke="#4f46e5" strokeWidth="2.5" strokeLinecap="round" fill="none" strokeOpacity="0.35" />
        <circle cx="18" cy="18" r="3.5" fill="#4f46e5" />
      </svg>
    ),
    wordmark: "HALCYON",
    tagline: "",
  },
];

const STATS = [
  {
    value: "1,200+",
    label: "Companies Onboarded",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M3 21V9l9-6 9 6v12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="9" y="14" width="4" height="7" rx="1" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" />
        <rect x="15" y="11" width="3" height="10" rx="1" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    value: "50,000+",
    label: "Employees Managed",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="9" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.7" />
        <path d="M3 20c0-3.9 2.7-7 6-7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <circle cx="17" cy="9" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M14 20c0-3.2 1.8-5.8 3.8-6.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    value: "99.9%",
    label: "Platform Uptime SLA",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 2a10 10 0 100 20A10 10 0 0012 2z" stroke="currentColor" strokeWidth="1.7" />
        <path d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    value: "4.9 / 5",
    label: "Customer Rating",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 2l2.9 6.1 6.6.9-4.8 4.6 1.2 6.5L12 17l-5.9 3.1 1.2-6.5L2.5 9l6.6-.9z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" fill="currentColor" fillOpacity="0.12" />
      </svg>
    ),
  },
];

// Duplicate logos array for seamless infinite marquee
const MARQUEE_LOGOS = [...LOGOS, ...LOGOS];

function LogoCard({ name, accent, bg, border, textColor, industry, mark, wordmark, tagline }) {
  return (
    <div
      className="group flex-shrink-0 w-48 flex items-center gap-3 px-4 py-3.5 rounded-2xl border bg-white cursor-default select-none
        hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out"
      style={{ borderColor: border }}
      title={name}
      aria-label={name}
    >
      {/* Colored icon mark */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
        style={{ background: bg }}
      >
        {mark}
      </div>

      {/* Text */}
      <div className="min-w-0">
        <p
          className="text-[13px] font-extrabold tracking-wide leading-none"
          style={{ color: textColor }}
        >
          {wordmark}
          {tagline && (
            <span className="font-medium ml-0.5 tracking-normal" style={{ color: accent }}>
              {tagline}
            </span>
          )}
        </p>
        <p className="text-[10px] text-slate-400 mt-0.5 font-medium truncate">{industry}</p>
      </div>
    </div>
  );
}

function StatBlock({ value, label, icon, index, inView, isLast }) {
  return (
    <div
      className={`group flex-1 flex flex-col items-center justify-center px-8 py-10 relative overflow-hidden
        hover:bg-indigo-50/50 transition-colors duration-300
        ${!isLast ? "border-b md:border-b-0 md:border-r border-slate-200" : ""}`}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(16px)",
        transition: `opacity 0.55s ease ${400 + index * 100}ms, transform 0.55s ease ${400 + index * 100}ms`,
      }}
    >
      <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-500 mb-4 group-hover:bg-indigo-100 transition-colors duration-200">
        {icon}
      </div>
      <span className="text-[2rem] font-extrabold text-indigo-600 tracking-tight tabular-nums leading-none group-hover:text-indigo-700 transition-colors duration-200">
        {value}
      </span>
      <span className="mt-2 text-[12.5px] text-slate-500 font-medium text-center leading-snug max-w-[120px]">
        {label}
      </span>
      {/* Bottom accent line */}
      <div className="absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-300 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
}

export default function TrustedSection() {
  const [sectionRef, inView] = useInView(0.08);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-white py-24"
      aria-labelledby="trusted-heading"
    >
      {/* ── Decorative background blobs ─── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-indigo-100 rounded-full blur-3xl opacity-25" />
        <div className="absolute top-1/2 -right-40 w-[460px] h-[460px] bg-sky-100 rounded-full blur-3xl opacity-20" />
        <div className="absolute -bottom-28 left-1/3 w-80 h-80 bg-violet-100 rounded-full blur-3xl opacity-20" />
      </div>

      {/* ── Faint dot grid ─── */}
      <div aria-hidden="true" className="absolute inset-0 opacity-[0.022]"
        style={{
          backgroundImage: "radial-gradient(circle, #6366f1 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ─── */}
        <div
          className="text-center mb-14"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(22px)",
            transition: "opacity 0.65s ease, transform 0.65s ease",
          }}
        >
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200/80 rounded-full px-4 py-1.5 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-[11px] font-semibold text-indigo-600 uppercase tracking-[0.15em]">
              Trusted Worldwide
            </span>
          </div>

          <h2
            id="trusted-heading"
            className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight"
          >
            Trusted by{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-indigo-600">Forward-Thinking</span>
              <span
                aria-hidden="true"
                className="absolute -bottom-1 left-0 w-full h-3 bg-indigo-100 rounded-full -z-0"
              />
            </span>{" "}
            Businesses
          </h2>

          <p className="mt-4 text-[15.5px] text-slate-600 max-w-lg mx-auto leading-relaxed">
            Over{" "}
            <strong className="text-slate-800 font-semibold">1,200 companies</strong>{" "}
            rely on SBMS to manage teams, attendance, and operations — at any scale.
          </p>
        </div>

        {/* ── Marquee Logo Ticker ─── */}
        <div
          className="relative mb-14 overflow-hidden"
          style={{
            opacity: inView ? 1 : 0,
            transition: "opacity 0.7s ease 0.2s",
          }}
        >
          {/* Fade masks left & right */}
          <div
            aria-hidden="true"
            className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
            style={{ background: "linear-gradient(to right, white 0%, transparent 100%)" }}
          />
          <div
            aria-hidden="true"
            className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
            style={{ background: "linear-gradient(to left, white 0%, transparent 100%)" }}
          />

          {/* Track */}
          <div className="flex gap-3 w-max animate-marquee">
            {MARQUEE_LOGOS.map((logo, i) => (
              <LogoCard key={`${logo.name}-${i}`} {...logo} />
            ))}
          </div>
        </div>

        {/* ── Stats Row ─── */}
        <div
          className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(18px)",
            transition: "opacity 0.65s ease 0.3s, transform 0.65s ease 0.3s",
          }}
        >
          <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-200">
            {STATS.map((stat, i) => (
              <StatBlock
                key={stat.label}
                {...stat}
                index={i}
                inView={inView}
                isLast={i === STATS.length - 1}
              />
            ))}
          </div>
        </div>

      </div>

      {/* ── Marquee keyframe injected via style tag ─── */}
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 32s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}