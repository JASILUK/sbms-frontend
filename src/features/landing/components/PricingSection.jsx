import React, { useState, useEffect, useRef } from 'react';

const PricingSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isYearly, setIsYearly] = useState(false);
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

  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for small teams getting started with business management.',
      monthlyPrice: 0,
      yearlyPrice: 0,
      period: '14 days free',
      features: [
        'Up to 10 team members',
        'Basic attendance tracking',
        'Meeting scheduling',
        'Email support',
        'Standard reports',
        'Mobile app access',
      ],
      cta: 'Start Free Trial',
      ctaStyle: 'secondary',
      popular: false,
      color: '#64748b',
    },
    {
      name: 'Pro',
      description: 'Everything you need to scale your business with AI-powered insights.',
      monthlyPrice: 29,
      yearlyPrice: 24,
      period: 'per user / month',
      features: [
        'Unlimited team members',
        'AI-powered attendance',
        'Smart meeting summaries',
        'Predictive analytics',
        'Priority support',
        'Advanced workflows',
        'Multi-company support',
        'API access',
      ],
      cta: 'Upgrade to Pro',
      ctaStyle: 'primary',
      popular: true,
      color: '#4f46e5',
    },
    {
      name: 'Enterprise',
      description: 'Advanced security, automation, and dedicated support for large organizations.',
      monthlyPrice: null,
      yearlyPrice: null,
      period: 'Custom pricing',
      features: [
        'Everything in Pro, plus:',
        'Advanced AI automation',
        'Custom integrations',
        'Dedicated account manager',
        'SLA guarantee',
        'On-premise deployment',
        'Advanced security controls',
        '24/7 phone support',
      ],
      cta: 'Contact Sales',
      ctaStyle: 'secondary',
      popular: false,
      color: '#059669',
    },
  ];

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-slate-50 py-28 md:py-32">
      {/* 3D Depth Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-100 rounded-full mix-blend-multiply filter blur-3xl opacity-10" />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #6366f1 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div 
          className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-1000 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-700 text-sm font-semibold mb-6">
            <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
            <span>Transparent Pricing</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight mb-6">
            Simple Pricing.{' '}
            <span className="relative inline-block">
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">
                Powerful Results.
              </span>
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-indigo-200 -z-0" viewBox="0 0 200 12" preserveAspectRatio="none">
                <path d="M0,8 Q50,0 100,8 T200,8" stroke="currentColor" strokeWidth="8" fill="none" strokeLinecap="round" opacity="0.4" />
              </svg>
            </span>
          </h2>
          
          <p className="text-lg text-slate-600 leading-relaxed mb-8">
            Choose the plan that fits your business. All plans include a 14-day free trial. 
            No hidden fees, no surprises.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 p-1.5 bg-white rounded-xl border border-slate-200 shadow-sm">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                !isYearly 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                isYearly 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Yearly
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                isYearly ? 'bg-white/20' : 'bg-emerald-100 text-emerald-700'
              }`}>
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative transition-all duration-700 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              } ${plan.popular ? 'md:-mt-4 md:mb-4' : ''}`}
              style={{ transitionDelay: `${index * 150}ms` }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                  <div className="px-4 py-1.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg shadow-indigo-500/30">
                    Most Popular
                  </div>
                </div>
              )}

              {/* Card */}
              <div 
                className={`relative bg-white rounded-2xl border-2 p-8 transition-all duration-500 ease-out ${
                  plan.popular 
                    ? 'border-indigo-600 shadow-xl shadow-indigo-500/10 md:scale-105' 
                    : 'border-slate-200 shadow-sm'
                } ${
                  hoveredCard === index && !plan.popular
                    ? 'border-indigo-300 shadow-xl -translate-y-2 scale-[1.02]'
                    : ''
                } ${
                  hoveredCard === index && plan.popular
                    ? 'shadow-2xl shadow-indigo-500/20 -translate-y-1'
                    : ''
                }`}
              >
                {/* Inner Gradient for Pro */}
                {plan.popular && (
                  <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/50 via-transparent to-transparent rounded-2xl pointer-events-none" />
                )}

                {/* Glow Effect on Hover */}
                <div 
                  className={`absolute -inset-px rounded-2xl transition-opacity duration-500 pointer-events-none ${
                    hoveredCard === index ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    background: `linear-gradient(135deg, ${plan.color}20 0%, transparent 50%, ${plan.color}10 100%)`,
                  }}
                />

                <div className="relative">
                  {/* Plan Header */}
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{plan.description}</p>
                  </div>

                  {/* Price */}
                  <div className="mb-8">
                    <div className="flex items-baseline gap-2">
                      {plan.monthlyPrice !== null ? (
                        <>
                          <span className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
                            ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                          </span>
                          <span className="text-slate-500 font-medium">{plan.period}</span>
                        </>
                      ) : (
                        <span className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                          {plan.period}
                        </span>
                      )}
                    </div>
                    {plan.monthlyPrice !== null && isYearly && (
                      <p className="text-sm text-emerald-600 font-medium mt-2">
                        Save ${(plan.monthlyPrice - plan.yearlyPrice) * 12} per year
                      </p>
                    )}
                  </div>

                  {/* CTA Button */}
                  <button
                    className={`w-full py-3.5 px-6 rounded-xl font-semibold text-sm transition-all duration-300 mb-8 ${
                      plan.ctaStyle === 'primary'
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 hover:-translate-y-0.5'
                        : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-indigo-300 hover:text-indigo-700 hover:bg-indigo-50'
                    }`}
                  >
                    {plan.cta}
                  </button>

                  {/* Features */}
                  <div className="space-y-4">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      What's included
                    </p>
                    <ul className="space-y-3">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3 group/item">
                          <div 
                            className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 transition-colors duration-300 ${
                              plan.popular ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'
                            } group-hover/item:bg-indigo-100 group-hover/item:text-indigo-600`}
                          >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-sm text-slate-600 group-hover/item:text-slate-900 transition-colors duration-200">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Trust Elements */}
        <div 
          className={`mt-16 flex flex-wrap items-center justify-center gap-8 transition-all duration-700 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>SSL Secured</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <span>Cancel Anytime</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span>24/7 Support</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;