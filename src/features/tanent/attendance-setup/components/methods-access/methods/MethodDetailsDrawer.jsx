import React, { useEffect } from 'react';
import { X, ArrowRight, HelpCircle } from 'lucide-react';
import { METHOD_META_REGISTRY } from '../../../constants/attendanceMethodsConstants';

export function MethodDetailsDrawer({ methodKey, onClose, onNavigateNext }) {
  const meta = METHOD_META_REGISTRY[methodKey];

  useEffect(() => {
    const escapeInterceptor = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', escapeInterceptor);
    return () => window.removeEventListener('keydown', escapeInterceptor);
  }, [onClose]);

  if (!methodKey || !meta) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden text-xs animate-fadeIn" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-2xs transition-opacity" onClick={onClose} />
      
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-slate-200 flex flex-col justify-between shadow-2xl h-full animate-slideLeft">
          
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Sub-Module Matrix Details</span>
              <h3 className="text-xs font-bold text-slate-900">{meta.label} Verification Node</h3>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto space-y-6 flex-1 leading-normal">
            <div className="space-y-2">
              <span className="font-bold text-slate-700 block uppercase text-[10px] tracking-wide">Functional Scope Statement</span>
              <p className="text-slate-600 font-medium bg-slate-50 p-3 rounded-xl border border-slate-200/50">{meta.description}</p>
            </div>

            <div className="space-y-2 border-t border-slate-100 pt-4">
              <span className="font-bold text-slate-700 block uppercase text-[10px] tracking-wide">Infrastructure Prerequisites</span>
              <ul className="space-y-2">
                {meta.requirements.map((req, i) => (
                  <li key={i} className="flex gap-2 items-start text-slate-600 font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-900 mt-1.5 flex-shrink-0" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="p-4 border-t border-slate-100 bg-slate-50 flex flex-col gap-2">
            <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200/40 text-amber-800 flex gap-2 items-start text-[11px] mb-1">
              <HelpCircle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
              <span>Access parameters routing dependencies cascading profiles cascade following channel unlocks steps.</span>
            </div>
            <button
              onClick={() => { onNavigateNext(meta.nextStepLink); onClose(); }}
              className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-xl font-semibold text-white bg-slate-900 hover:bg-slate-800 shadow-sm transition-colors"
            >
              {meta.nextStepLabel}
              <ArrowRight className="h-3.5 w-3.5 ml-2" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}