import { useState, useEffect, useRef } from "react";

const TYPING_WORDS = ["Attendance", "Meetings", "Teams", "Workflows", "Insights"];

function useTypingEffect(words, speed = 80, pause = 1800) {
  const [display, setDisplay] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIdx];
    let timeout;
    if (!deleting && charIdx < current.length) {
      timeout = setTimeout(() => setCharIdx((c) => c + 1), speed);
    } else if (!deleting && charIdx === current.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => setCharIdx((c) => c - 1), speed / 2);
    } else if (deleting && charIdx === 0) {
      setDeleting(false);
      setWordIdx((i) => (i + 1) % words.length);
    }
    setDisplay(current.slice(0, charIdx));
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);

  return display;
}

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); observer.disconnect(); }
    }, { threshold });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, inView];
}

const MetricCard = ({ label, value, delta, color, delay }) => (
  <div
    className="bg-white rounded-xl border border-slate-200 px-4 py-3 shadow-sm flex items-center gap-3 min-w-[140px]"
    style={{ animationDelay: delay }}
  >
    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
      <span className="text-white text-xs font-bold">{value[0]}</span>
    </div>
    <div>
      <p className="text-[11px] text-slate-400 leading-none mb-0.5">{label}</p>
      <p className="text-[15px] font-semibold text-slate-900 leading-none">{value}</p>
      {delta && <p className="text-[10px] text-emerald-600 font-medium mt-0.5">{delta}</p>}
    </div>
  </div>
);

const ActivityRow = ({ name, action, time, avatar, online }) => (
  <div className="flex items-center gap-3 py-2">
    <div className="relative flex-shrink-0">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white text-[10px] font-semibold">
        {avatar}
      </div>
      {online && <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full border border-white" />}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[12px] text-slate-800 font-medium leading-none truncate">{name}</p>
      <p className="text-[11px] text-slate-400 mt-0.5 truncate">{action}</p>
    </div>
    <span className="text-[10px] text-slate-400 flex-shrink-0">{time}</span>
  </div>
);

const MeetingBadge = ({ title, time, attendees, type }) => (
  <div className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-slate-50 transition-colors">
    <div className={`w-1.5 h-8 rounded-full flex-shrink-0 ${type === "now" ? "bg-emerald-500" : type === "soon" ? "bg-amber-400" : "bg-indigo-300"}`} />
    <div className="flex-1 min-w-0">
      <p className="text-[12px] font-medium text-slate-800 truncate">{title}</p>
      <p className="text-[11px] text-slate-400">{time} · {attendees} people</p>
    </div>
    {type === "now" && (
      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 flex-shrink-0">Live</span>
    )}
  </div>
);

const AttendanceBar = ({ dept, pct, color }) => (
  <div className="mb-2.5">
    <div className="flex justify-between mb-1">
      <span className="text-[11px] text-slate-500">{dept}</span>
      <span className="text-[11px] font-semibold text-slate-700">{pct}%</span>
    </div>
    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
      <div className={`h-full rounded-full ${color} transition-all duration-1000`} style={{ width: `${pct}%` }} />
    </div>
  </div>
);

function DashboardMockup({ inView }) {
  return (
    <div className="relative w-full max-w-[560px] mx-auto lg:mx-0">
      <div
        className={`absolute -inset-4 bg-gradient-to-br from-indigo-100 via-slate-100 to-sky-100 rounded-3xl blur-2xl opacity-60 transition-opacity duration-1000 ${inView ? "opacity-60" : "opacity-0"}`}
      />

      <div
        className={`relative bg-white rounded-2xl border border-slate-200 shadow-2xl shadow-indigo-100/50 overflow-hidden transition-all duration-700 delay-300 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <div className="bg-slate-900 px-4 py-2.5 flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="bg-slate-700 rounded-md px-6 py-1 text-[10px] text-slate-400 font-mono">
              app.sbms.io/dashboard
            </div>
          </div>
        </div>

        <div className="flex h-[400px]">
          <div className="w-14 bg-slate-50 border-r border-slate-100 flex flex-col items-center py-4 gap-4">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
                <rect x="2" y="2" width="5" height="5" rx="1" fill="white" opacity="0.9" />
                <rect x="11" y="2" width="5" height="5" rx="1" fill="white" opacity="0.5" />
                <rect x="2" y="11" width="5" height="5" rx="1" fill="white" opacity="0.5" />
                <rect x="11" y="11" width="5" height="5" rx="1" fill="white" opacity="0.9" />
              </svg>
            </div>
            {[
              <path key="1" d="M3 6h10M3 10h7M3 14h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />,
              <path key="2" d="M9 3a6 6 0 100 12A6 6 0 009 3zM9 7v2l1.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />,
              <path key="3" d="M5 8a4 4 0 108 0 4 4 0 00-8 0zM3 15a6 6 0 0112 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />,
              <path key="4" d="M3 9h12M9 3l4 6-4 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />,
            ].map((icon, i) => (
              <button
                key={i}
                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${i === 0 ? "bg-indigo-100 text-indigo-600" : "text-slate-400 hover:bg-slate-200"}`}
              >
                <svg width="14" height="14" viewBox="0 0 18 18" fill="none">{icon}</svg>
              </button>
            ))}
          </div>

          <div className="flex-1 p-4 overflow-hidden flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[13px] font-semibold text-slate-900">Good morning, Sarah 👋</h3>
                <p className="text-[10px] text-slate-400">Wednesday, Feb 21 · 3 meetings today</p>
              </div>
              <div className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 rounded-lg px-2.5 py-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                <span className="text-[10px] font-medium text-indigo-700">AI Active</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Present Today", value: "94%", color: "text-emerald-600", bg: "bg-emerald-50" },
                { label: "Meetings", value: "12", color: "text-indigo-600", bg: "bg-indigo-50" },
                { label: "Departments", value: "8", color: "text-sky-600", bg: "bg-sky-50" },
              ].map(({ label, value, color, bg }) => (
                <div key={label} className={`${bg} rounded-xl p-3`}>
                  <p className={`text-[18px] font-bold ${color}`}>{value}</p>
                  <p className="text-[10px] text-slate-500 leading-tight">{label}</p>
                </div>
              ))}
            </div>

            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <p className="text-[11px] font-semibold text-slate-700 mb-2">Today's Meetings</p>
              <MeetingBadge title="Product Standup" time="9:00 AM" attendees="8" type="now" />
              <MeetingBadge title="Client Review – Acme Corp" time="11:30 AM" attendees="5" type="soon" />
              <MeetingBadge title="Team Retrospective" time="3:00 PM" attendees="12" type="later" />
            </div>

            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <p className="text-[11px] font-semibold text-slate-700 mb-2.5">Attendance by Dept</p>
              <AttendanceBar dept="Engineering" pct={97} color="bg-indigo-500" />
              <AttendanceBar dept="Marketing" pct={88} color="bg-sky-500" />
              <AttendanceBar dept="Sales" pct={92} color="bg-emerald-500" />
            </div>
          </div>
        </div>
      </div>

      <div
        className={`absolute -bottom-4 -right-4 bg-white border border-slate-200 shadow-xl rounded-2xl px-4 py-3 flex items-center gap-3 transition-all duration-700 delay-700 ${inView ? "opacity-100 translate-y-0 translate-x-0" : "opacity-0 translate-y-4 translate-x-4"}`}
      >
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center flex-shrink-0 shadow-sm">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <path d="M10 2a8 8 0 100 16A8 8 0 0010 2z" stroke="white" strokeWidth="1.5" />
            <path d="M7 10l2 2 4-4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <p className="text-[12px] font-semibold text-slate-900 leading-none">AI Insight</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Attendance up 12% this week</p>
        </div>
      </div>

      <div
        className={`absolute -top-4 -left-4 bg-white border border-slate-200 shadow-xl rounded-2xl px-3 py-2.5 transition-all duration-700 delay-500 ${inView ? "opacity-100 translate-y-0 translate-x-0" : "opacity-0 -translate-y-4 -translate-x-4"}`}
      >
        <div className="flex items-center gap-2">
          <div className="flex -space-x-1.5">
            {["SK", "MJ", "AR"].map((init, i) => (
              <div key={i} className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 border-2 border-white flex items-center justify-center text-[7px] font-bold text-white">{init[0]}</div>
            ))}
          </div>
          <div>
            <p className="text-[10px] font-semibold text-slate-800">3 companies</p>
            <p className="text-[9px] text-slate-400">synced right now</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HeroSection() {
  const typedWord = useTypingEffect(TYPING_WORDS);
  const [heroRef, heroInView] = useInView(0.1);
  const [mockRef, mockInView] = useInView(0.1);

  return (
    <section
      ref={heroRef}
      className="relative overflow-hidden bg-slate-50 py-20 lg:py-28"
      aria-labelledby="hero-headline"
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-indigo-100/60 via-slate-50/30 to-transparent rounded-b-full blur-3xl" />
        <div className="absolute top-20 left-0 w-72 h-72 bg-sky-100/40 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-0 w-80 h-80 bg-indigo-100/30 rounded-full blur-3xl" />
        <svg className="absolute inset-0 w-full h-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#6366f1" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          <div className="flex-1 text-center lg:text-left max-w-xl mx-auto lg:mx-0">
            <div
              className={`inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200/80 rounded-full px-4 py-1.5 mb-6 transition-all duration-500 ${heroInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
              <span className="text-[12px] font-semibold text-indigo-700 tracking-wide uppercase">Now with AI Automation</span>
            </div>

            <h1
              id="hero-headline"
              className={`text-[2.6rem] sm:text-5xl lg:text-[3.25rem] font-extrabold text-slate-900 leading-[1.08] tracking-tight mb-5 transition-all duration-600 delay-100 ${heroInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            >
              Manage{" "}
              <span className="relative inline-block">
                <span className="text-indigo-600">{typedWord}</span>
                <span className="inline-block w-0.5 h-[0.9em] bg-indigo-500 ml-0.5 align-middle animate-pulse" aria-hidden="true" />
              </span>
              <br />
              <span className="text-slate-900">Smarter.</span>
            </h1>

            <p
              className={`text-[1.05rem] text-slate-600 leading-relaxed mb-8 max-w-[460px] mx-auto lg:mx-0 transition-all duration-600 delay-200 ${heroInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            >
              The all-in-one platform to track attendance, schedule meetings, manage multi-company teams, and unlock AI-powered insights — all from a single workspace.
            </p>

            <div
              className={`flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start mb-10 transition-all duration-600 delay-300 ${heroInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            >
              <a
                href="/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-[14.5px] font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 active:bg-indigo-700 shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5 transition-all duration-150"
              >
                Start Free Trial
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a
                href="#demo"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 text-[14.5px] font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:text-indigo-700 hover:bg-indigo-50 hover:-translate-y-0.5 shadow-sm hover:shadow-md transition-all duration-150"
              >
                <span className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                  <svg width="10" height="10" viewBox="0 0 12 14" fill="white" aria-hidden="true">
                    <path d="M1 1l10 6L1 13V1z" />
                  </svg>
                </span>
                Watch Demo
              </a>
            </div>

            <div
              className={`flex flex-wrap items-center gap-x-5 gap-y-2 justify-center lg:justify-start transition-all duration-600 delay-400 ${heroInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            >
              {[
                { icon: "✓", text: "Free 14-day trial" },
                { icon: "✓", text: "No credit card required" },
                { icon: "✓", text: "Cancel anytime" },
              ].map(({ icon, text }) => (
                <span key={text} className="flex items-center gap-1.5 text-[12.5px] text-slate-500">
                  <span className="text-emerald-500 font-bold">{icon}</span>
                  {text}
                </span>
              ))}
            </div>
          </div>

          <div
            ref={mockRef}
            className={`flex-1 w-full lg:max-w-none transition-all duration-700 delay-200 ${heroInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <DashboardMockup inView={mockInView} />
          </div>

        </div>

        
      </div>
    </section>
  );
}