import React from 'react';
import { motion } from 'framer-motion';
import { ToggleLeft, LayoutList, UserMinus, ShieldAlert } from 'lucide-react';

export const AccessControlTabs = React.memo(({ activeTab, onTabChange, rulesCount, overridesCount }) => {
  const tabsMeta = [
    { id: 'defaults', label: 'Company Defaults', icon: ToggleLeft },
    { id: 'rules', label: 'Access Rules', icon: LayoutList, count: rulesCount },
    { id: 'overrides', label: 'Employee Overrides', icon: UserMinus, count: overridesCount },
    { id: 'preview', label: 'Resolution Preview', icon: ShieldAlert }
  ];

  return (
    <div className="flex bg-slate-100/80 p-1 rounded-xl max-w-2xl border border-slate-200/40">
      <div className="grid grid-cols-4 w-full gap-1 text-[11px] font-bold">
        {tabsMeta.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2 px-1 rounded-lg transition-colors relative focus:outline-none ${
                isActive ? 'text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="text-center sm:text-left">{tab.label}</span>
              
              {tab.count !== undefined && tab.count > 0 && (
                <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-bold ${
                  isActive ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {tab.count}
                </span>
              )}

              {isActive && (
                <motion.div
                  layoutId="innerAccessSubtabBackground"
                  className="absolute inset-0 bg-white rounded-lg shadow-xs border border-slate-200/50 z-[-1]"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
});

AccessControlTabs.displayName = 'AccessControlTabs';