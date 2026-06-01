import React, { useState, useEffect, useRef } from 'react';

const FinalCTASection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 20,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 20,
    });
  };

  return (
    <section 
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative overflow-hidden bg-white py-28 md:py-32"
    >
      {/* 3D Animated Background Container */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Primary Gradient Mesh */}
        <div 
          className="absolute inset-0 transition-transform duration-700 ease-out"
          style={{
            transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)`,
          }}
        >
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-violet-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse" style={{ animationDuration: '12s', animationDelay: '4s' }} />
        </div>

        {/* Secondary Floating Orbs - 3D Parallax */}
        <div 
          className="absolute inset-0 transition-transform duration-500 ease-out"
          style={{
            transform: `translate(${mousePos.x * 1.5}px, ${mousePos.y * 1.5}px)`,
          }}
        >
          <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-indigo-300 to-blue-300 rounded-full opacity-40 filter blur-2xl animate-bounce" style={{ animationDuration: '6s', animationDelay: '0s' }} />
          <div className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-br from-violet-300 to-purple-300 rounded-full opacity-30 filter blur-xl animate-bounce" style={{ animationDuration: '8s', animationDelay: '1s' }} />
          <div className="absolute bottom-32 left-40 w-20 h-20 bg-gradient-to-br from-cyan-300 to-blue-300 rounded-full opacity-35 filter blur-xl animate-bounce" style={{ animationDuration: '7s', animationDelay: '2s' }} />
          <div className="absolute bottom-20 right-20 w-28 h-28 bg-gradient-to-br from-indigo-200 to-violet-200 rounded-full opacity-45 filter blur-2xl animate-bounce" style={{ animationDuration: '9s', animationDelay: '3s' }} />
        </div>

        {/* Animated Gradient Rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div 
            className="w-[800px] h-[800px] rounded-full border border-indigo-200/30 animate-spin"
            style={{ animationDuration: '30s' }}
          />
          <div 
            className="absolute w-[600px] h-[600px] rounded-full border border-blue-200/20 animate-spin"
            style={{ animationDuration: '25s', animationDirection: 'reverse' }}
          />
          <div 
            className="absolute w-[400px] h-[400px] rounded-full border border-violet-200/20 animate-spin"
            style={{ animationDuration: '20s' }}
          />
        </div>

        {/* Grid Pattern with 3D Perspective */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(99, 102, 241, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(99, 102, 241, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            transform: `perspective(1000px) rotateX(${mousePos.y * 0.2}deg) rotateY(${mousePos.x * 0.2}deg)`,
            transformOrigin: 'center center',
          }}
        />

        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-indigo-300 rounded-full opacity-20 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDuration: `${3 + Math.random() * 4}s`,
                animationDelay: `${Math.random() * 2}s`,
                transform: `translateZ(${Math.random() * 100}px)`,
              }}
            />
          ))}
        </div>

        {/* Glass Morphism Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-transparent to-white/80 pointer-events-none" />
      </div>

      {/* Content Container */}
      <div className="relative max-w-5xl mx-auto px-6 lg:px-8">
        {/* 3D Card Container */}
        <div 
          className={`relative bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl shadow-indigo-500/10 p-12 md:p-16 transition-all duration-1000 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
          style={{
            transform: `perspective(1000px) rotateX(${mousePos.y * 0.05}deg) rotateY(${mousePos.x * 0.05}deg)`,
            boxShadow: '0 25px 50px -12px rgba(99, 102, 241, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
          }}
        >
          {/* Inner Glow */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-50/50 via-transparent to-blue-50/30 pointer-events-none" />

          {/* Content */}
          <div className="relative text-center">
            {/* Badge */}
            <div 
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100/80 border border-indigo-200 text-indigo-700 text-sm font-semibold mb-8 transition-all duration-700 delay-200 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
              <span>Free 14-day trial • No credit card required</span>
            </div>

            {/* Headline */}
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight mb-6 leading-tight">
              Start Managing{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">
                  Smarter
                </span>
                <svg className="absolute -bottom-2 left-0 w-full h-4 text-indigo-200 -z-0" viewBox="0 0 200 16" preserveAspectRatio="none">
                  <path d="M0,8 Q50,0 100,8 T200,8" stroke="currentColor" strokeWidth="8" fill="none" strokeLinecap="round" />
                </svg>
              </span>
              {' '}Today.
            </h2>

            {/* Subtext */}
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed mb-10 max-w-2xl mx-auto">
              Everything your business needs — attendance, meetings, AI insights, and automation — 
              unified in one intelligent platform.
            </p>

            {/* CTA Buttons */}
            <div 
              className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-400 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              {/* Primary Button with 3D Effect */}
              <div className="relative group">
                {/* Multi-layer Shadow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-all duration-500" />
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl blur-md opacity-40 group-hover:opacity-60 transition-all duration-500" />
                
                <a
                  href="/signup"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className="relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold text-base rounded-xl shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-2xl"
                  style={{
                    boxShadow: isHovered ? '0 20px 40px -10px rgba(79, 70, 229, 0.5)' : '0 10px 30px -10px rgba(79, 70, 229, 0.3)',
                  }}
                >
                  Start Free Trial
                  <svg className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
              </div>

              {/* Secondary Link */}
              <a
                href="/contact-sales"
                className="inline-flex items-center gap-2 text-slate-600 font-semibold hover:text-indigo-600 transition-colors duration-200 group px-6 py-4"
              >
                <span className="border-b border-slate-300 group-hover:border-indigo-300 transition-colors duration-200">
                  Talk to Sales
                </span>
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>

            {/* Trust Indicators */}
            <div 
              className={`mt-12 flex flex-wrap items-center justify-center gap-8 text-slate-500 text-sm transition-all duration-700 delay-600 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="flex items-center gap-2 group cursor-default">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <span>Enterprise security</span>
              </div>
              <div className="flex items-center gap-2 group cursor-default">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span>5-minute setup</span>
              </div>
              <div className="flex items-center gap-2 group cursor-default">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Decorative Elements */}
        <div 
          className="absolute -top-8 -left-8 w-16 h-16 bg-gradient-to-br from-indigo-400 to-blue-400 rounded-2xl rotate-12 opacity-20 animate-pulse"
          style={{ animationDuration: '4s' }}
        />
        <div 
          className="absolute -bottom-8 -right-8 w-20 h-20 bg-gradient-to-br from-violet-400 to-purple-400 rounded-full opacity-20 animate-pulse"
          style={{ animationDuration: '5s', animationDelay: '1s' }}
        />
      </div>
    </section>
  );
};

export default FinalCTASection;