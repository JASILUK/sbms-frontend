import { useState, useEffect, useCallback } from "react";
import { Outlet } from "react-router-dom";

// ─── ScrollToTopButton Component ─────────────────────────────────────────────
const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={`fixed bottom-6 right-6 z-40 w-11 h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-1 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
        isVisible 
          ? "opacity-100 scale-100 pointer-events-auto" 
          : "opacity-0 scale-95 pointer-events-none"
      }`}
    >
      <svg 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d="M18 15l-6-6-6 6" />
      </svg>
    </button>
  );
};

// ─── Design Tokens ────────────────────────────────────────────────────────────
const Logo = () => (
  <a href="/" className="flex items-center gap-2.5 group" aria-label="SBMS Home">
    <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md group-hover:bg-indigo-700 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-indigo-500/20">
      <svg width="20" height="20" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <rect x="2" y="2" width="6" height="6" rx="1" fill="white" opacity="0.95" />
        <rect x="10" y="2" width="6" height="6" rx="1" fill="white" opacity="0.55" />
        <rect x="2" y="10" width="6" height="6" rx="1" fill="white" opacity="0.55" />
        <rect x="10" y="10" width="6" height="6" rx="1" fill="white" opacity="0.95" />
      </svg>
    </div>
    <span className="text-[16px] font-semibold tracking-tight text-slate-900">SBMS</span>
  </a>
);

const NavLink = ({ href, children, onClick }) => {
  const handleClick = (e) => {
    e.preventDefault();
    const sectionId = href.replace('#', '');
    onClick(sectionId);
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className="relative text-[14px] font-medium text-slate-600 hover:text-slate-900 transition-colors duration-200 py-2 group cursor-pointer"
    >
      {children}
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all duration-300 ease-out rounded-full" />
    </a>
  );
};

const MobileNavLink = ({ href, children, onClick }) => {
  const handleClick = (e) => {
    e.preventDefault();
    const sectionId = href.replace('#', '');
    onClick(sectionId);
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className="block px-4 py-3 text-[15px] font-medium text-slate-600 hover:text-slate-900 hover:bg-indigo-50/50 rounded-lg transition-colors duration-200 cursor-pointer"
    >
      {children}
    </a>
  );
};

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "AI", href: "#ai" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "Testimonials", href: "#testimonials" },
];

const TwitterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const GitHubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

const SocialLink = ({ href, label, children }) => (
  <a
    href={href}
    aria-label={label}
    className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
  >
    {children}
  </a>
);

const FOOTER_LINKS = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Changelog", href: "#" },
    { label: "Roadmap", href: "#" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Press", href: "#" },
  ],
  Support: [
    { label: "Documentation", href: "#" },
    { label: "Help Center", href: "#" },
    { label: "Status", href: "#" },
    { label: "Contact", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Security", href: "#" },
    { label: "Cookie Policy", href: "#" },
  ],
};

export default function PublicLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Smooth scroll handler
  const scrollToSection = useCallback((sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navHeight = 80; // Height of fixed navbar + buffer
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
    setMenuOpen(false);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      {/* ── Sticky Nav with Glass Effect ───────────────────────────────────── */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ease-in-out ${
          scrolled
            ? "bg-white/70 backdrop-blur-xl border-b border-slate-200/50 shadow-sm"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <nav
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between"
          aria-label="Primary navigation"
        >
          <Logo />

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-8" role="list">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={label}>
                <NavLink href={href} onClick={scrollToSection}>{label}</NavLink>
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="/login"
              className="px-4 py-2 text-[14px] font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100/80 transition-all duration-200"
            >
              Log in
            </a>
            <a
              href="/signup"
              className="px-4 py-2 text-[14px] font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-md hover:shadow-lg hover:shadow-indigo-500/25 hover:scale-105 active:scale-100 transition-all duration-200 whitespace-nowrap"
            >
              Start Free Trial
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-slate-600 hover:bg-slate-100/80 transition-colors duration-200 -mr-1"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
            {menuOpen ? (
              <svg width="20" height="20" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                <path d="M3 3l12 12M15 3L3 15" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                <path d="M2 5h14M2 9h14M2 13h14" />
              </svg>
            )}
          </button>
        </nav>

        {/* Mobile Menu */}
        <div
          id="mobile-menu"
          className={`md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-slate-200/50 shadow-lg transition-all duration-300 ease-in-out overflow-hidden ${
            menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-4 py-4">
            <ul className="flex flex-col gap-1 mb-4" role="list">
              {NAV_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <MobileNavLink href={href} onClick={scrollToSection}>{label}</MobileNavLink>
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-2 pt-4 border-t border-slate-200/60">
              <a
                href="/login"
                className="block text-center px-4 py-3 text-[15px] font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors duration-200"
              >
                Log in
              </a>
              <a
                href="/signup"
                className="block text-center px-4 py-3 text-[15px] font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-md transition-colors duration-200"
              >
                Start Free Trial
              </a>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {menuOpen && (
          <div 
            className="md:hidden fixed inset-0 top-16 bg-slate-900/20 backdrop-blur-sm z-40"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
        )}
      </header>

      {/* ── Main Content ────────────────────────────────────────────────────── */}
      <main className="flex-1" id="main-content">
        <Outlet/>
      </main>

      {/* ── Scroll to Top Button ────────────────────────────────────────────── */}
      <ScrollToTopButton />

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-18">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 lg:grid-cols-6 mb-12">
            <div className="col-span-2">
              <Logo />
              <p className="mt-4 text-[14px] text-slate-500 leading-relaxed max-w-[260px]">
                Streamline your business operations with a single, unified platform built for modern teams.
              </p>
              <div className="flex items-center gap-1 mt-5">
                <SocialLink href="#" label="Follow us on X"><TwitterIcon /></SocialLink>
                <SocialLink href="#" label="Connect on LinkedIn"><LinkedInIcon /></SocialLink>
                <SocialLink href="#" label="View on GitHub"><GitHubIcon /></SocialLink>
              </div>
            </div>

            {Object.entries(FOOTER_LINKS).map(([group, links]) => (
              <div key={group}>
                <h3 className="text-[12px] font-semibold text-slate-900 uppercase tracking-wider mb-4">
                  {group}
                </h3>
                <ul className="space-y-3" role="list">
                  {links.map(({ label, href }) => (
                    <li key={label}>
                      <FooterLink href={href} onClick={scrollToSection}>{label}</FooterLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[13px] text-slate-400">
              &copy; {new Date().getFullYear()} SBMS. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-[13px] text-slate-400">
              <a href="#" className="hover:text-slate-600 transition-colors duration-200">Privacy</a>
              <a href="#" className="hover:text-slate-600 transition-colors duration-200">Terms</a>
              <a href="#" className="hover:text-slate-600 transition-colors duration-200">Cookies</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}

// Footer link component with scroll handler
const FooterLink = ({ href, children, onClick }) => {
  const handleClick = (e) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const sectionId = href.replace('#', '');
      onClick(sectionId);
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className="text-[13px] text-slate-500 hover:text-indigo-600 transition-colors duration-200 cursor-pointer"
    >
      {children}
    </a>
  );
};