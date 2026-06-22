import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Sliders, MapPin, ShieldCheck } from 'lucide-react';

export const MethodsAccessTabs = React.memo(({ activeSection, onSectionChange }) => {
  const containerRef = useRef(null);
  const activeTabRef = useRef(null);

  const sectionsConfig = [
    { id: 'methods', label: '1. Validation Methods', icon: Sliders },
    { id: 'locations', label: '2. Deployed Geofences', icon: MapPin },
    { id: 'access', label: '3. Cascading Access Rules', icon: ShieldCheck }
  ];

  // Auto-scrolling feature ensuring responsive mobile horizontal touch bars slide into view smoothly
  useEffect(() => {
    if (activeTabRef.current && containerRef.current) {
      const container = containerRef.current;
      const tab = activeTabRef.current;
      
      const containerScrollLeft = container.scrollLeft;
      const containerWidth = container.clientWidth;
      const tabLeft = tab.offsetLeft;
      const tabWidth = tab.clientWidth;

      if (tabLeft < containerScrollLeft) {
        container.scrollTo({ left: tabLeft, behavior: 'smooth' });
      } else if (tabLeft + tabWidth > containerScrollLeft + containerWidth) {
        container.scrollTo({ left: tabLeft + tabWidth - containerWidth, behavior: 'smooth' });
      }
    }
  }, [activeSection]);

  return (
    <div className="border-b border-slate-200 sticky top-0 bg-white z-10">
      <div 
        ref={containerRef}
        className="flex space-x-8 overflow-x-auto scrollbar-none pb-px"
        style={{ scrollbarWidth: 'none' }}
      >
        {sectionsConfig.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          
          return (
            <button
              key={section.id}
              ref={isActive ? activeTabRef : null}
              onClick={() => onSectionChange(section.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex items-center gap-2.5 py-3.5 px-1 border-b-2 font-semibold text-xs tracking-wide transition-colors whitespace-nowrap relative focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 ${
                isActive ? 'text-slate-900 border-slate-900' : 'border-transparent text-slate-400 hover:text-slate-800'
              }`}
            >
              <Icon className={`h-4 w-4 flex-shrink-0 ${isActive ? 'text-slate-900' : 'text-slate-400'}`} />
              {section.label}

              {isActive && (
                <motion.div 
                  layoutId="primarySectionUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
});

MethodsAccessTabs.displayName = 'MethodsAccessTabs';