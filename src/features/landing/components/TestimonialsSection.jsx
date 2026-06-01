import React, { useState, useEffect, useRef } from 'react';

const TestimonialsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const testimonials = [
    {
      quote: "SBMS transformed how we manage attendance across three offices. The AI anomaly detection caught issues we didn't even know existed. Saved us 15 hours of manual work every week.",
      author: "Sarah Chen",
      role: "VP of People Operations",
      company: "TechFlow Inc.",
      avatar: "SC",
      rating: 5,
      color: "#4f46e5",
    },
    {
      quote: "We evaluated six different platforms. SBMS was the only one that actually understood multi-company structure. Set up three subsidiaries in one afternoon. Incredible.",
      author: "Marcus Rodriguez",
      role: "Chief Operating Officer",
      company: "Nexus Holdings",
      avatar: "MR",
      rating: 5,
      color: "#0891b2",
    },
    {
      quote: "The AI meeting summaries alone are worth the subscription. Our leadership team actually reads them. Decision velocity increased noticeably within the first month.",
      author: "Elena Park",
      role: "Head of Strategy",
      company: "Velocity Labs",
      avatar: "EP",
      rating: 5,
      color: "#059669",
    },
    {
      quote: "As a growing startup, we needed something that scales without enterprise complexity. SBMS grew with us from 12 to 120 people seamlessly. No re-platforming needed.",
      author: "James Okonkwo",
      role: "Founder & CEO",
      company: "BrightPath",
      avatar: "JO",
      rating: 5,
      color: "#d97706",
    },
    {
      quote: "The predictive insights feature flagged a team burnout pattern before it became a retention problem. That's the kind of proactive intelligence HR actually needs.",
      author: "Rachel Thompson",
      role: "Senior HR Director",
      company: "Meridian Health",
      avatar: "RT",
      rating: 5,
      color: "#7c3aed",
    },
    {
      quote: "Integration was seamless. Our existing tools connected in hours, not weeks. The workflow automation replaced three separate tools we were paying for.",
      author: "David Kim",
      role: "IT Director",
      company: "Summit Manufacturing",
      avatar: "DK",
      rating: 5,
      color: "#dc2626",
    },
  ];

  const trustIndicators = [
    { value: "1,200+", label: "Companies" },
    { value: "99.9%", label: "Uptime" },
    { value: "20+", label: "Countries" },
    { value: "4.9/5", label: "Rating" },
  ];

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-white py-28 md:py-32">
      {/* Background Depth */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-slate-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDuration: '12s', animationDelay: '3s' }} />
        
        {/* Subtle Grid */}
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #6366f1 1px, transparent 0)`,
            backgroundSize: '48px 48px'
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div 
          className={`text-center max-w-3xl mx-auto mb-20 transition-all duration-1000 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-sm font-semibold mb-6">
            <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>Customer Stories</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight mb-6">
            Trusted by Teams That{' '}
            <span className="relative inline-block">
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">
                Move Fast
              </span>
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-indigo-100 -z-0" viewBox="0 0 200 12" preserveAspectRatio="none">
                <path d="M0,8 Q50,0 100,8 T200,8" stroke="currentColor" strokeWidth="8" fill="none" strokeLinecap="round" />
              </svg>
            </span>
          </h2>
          
          <p className="text-lg text-slate-600 leading-relaxed">
            From startups to enterprises, teams rely on SBMS to streamline operations, 
            reduce manual work, and make smarter decisions every day.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`relative transition-all duration-700 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div 
                className={`relative bg-white rounded-2xl border border-slate-200 p-8 transition-all duration-500 ease-out ${
                  hoveredCard === index 
                    ? 'border-indigo-300 shadow-xl shadow-indigo-500/10 -translate-y-3 scale-[1.02]' 
                    : 'shadow-sm'
                }`}
              >
                {/* Quote Icon Background */}
                <div className="absolute top-4 right-4 opacity-5 pointer-events-none">
                  <svg className="w-24 h-24 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>

                {/* Inner Glow */}
                <div 
                  className={`absolute inset-0 rounded-2xl transition-opacity duration-500 pointer-events-none ${
                    hoveredCard === index ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    background: `radial-gradient(circle at 50% 0%, ${testimonial.color}08 0%, transparent 70%)`
                  }}
                />

                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="relative z-10 text-slate-700 leading-relaxed mb-8 text-[15px]">
                  "{testimonial.quote}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md"
                    style={{ background: `linear-gradient(135deg, ${testimonial.color}, ${testimonial.color}dd)` }}
                  >
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{testimonial.author}</p>
                    <p className="text-slate-500 text-xs">{testimonial.role}</p>
                    <p className="text-slate-400 text-xs">{testimonial.company}</p>
                  </div>
                </div>

                {/* Bottom Accent Line */}
                <div 
                  className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl transition-all duration-500 ${
                    hoveredCard === index ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{ 
                    background: `linear-gradient(90deg, transparent, ${testimonial.color}, transparent)`,
                    transform: hoveredCard === index ? 'scaleX(1)' : 'scaleX(0)',
                    transition: 'transform 0.5s ease, opacity 0.5s ease'
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div 
          className={`mt-20 pt-12 border-t border-slate-200 transition-all duration-700 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {trustIndicators.map((indicator, index) => (
              <div key={index} className="text-center group cursor-default">
                <p className="text-3xl font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors duration-300">
                  {indicator.value}
                </p>
                <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">
                  {indicator.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div 
          className={`text-center mt-16 transition-all duration-700 delay-600 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <a
            href="/case-studies"
            className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-700 transition-colors duration-200 group"
          >
            <span>Read full case studies</span>
            <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;