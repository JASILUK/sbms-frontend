import React, { useState } from 'react';
import { ShieldOff, Compass, ShieldAlert, AlertTriangle } from 'lucide-react';



export function FacePolicyDeactivateCard({ onDeactivate, disabled }) {
  const [confirmInput, setConfirmInput] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleExecute = () => {
    if (confirmInput !== 'DISABLE') return;
    onDeactivate();
    setShowModal(false);
    setConfirmInput('');
  };

  return (
    <>
      <div className="bg-white border border-red-200 rounded-2xl p-6 shadow-2xs space-y-4 border-dashed bg-gradient-to-r from-red-50/10 to-transparent">
        <div className="space-y-0.5">
          <h3 className="text-xs font-black text-red-700 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="h-4 w-4" /> Danger Zone: Deactivate Face Policy Layer
          </h3>
          <p className="text-[11px] text-slate-400 font-normal leading-normal max-w-xl">
            Deactivating this policy halts all future user self-registrations and backend HR instruction scans instantly across all organizational layers. Historical math vector hashes are preserved safely.
          </p>
        </div>
        <button
          type="button"
          disabled={disabled}
          onClick={() => setShowModal(true)}
          className="px-3 py-1.5 border border-red-200 hover:border-red-300 text-red-600 bg-white hover:bg-red-50 disabled:opacity-50 font-bold rounded-xl shadow-3xs transition-all active:scale-98"
        >
          Disable Face Enrollment Policy
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-3xs" onClick={() => setShowModal(false)} />
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden p-5 z-10 space-y-4 animate-scaleUp text-xs font-medium text-slate-700">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-red-50 border border-red-100 text-red-600 rounded-xl">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 text-sm tracking-tight">Confirm Policy Soft Deactivation</h4>
                <p className="text-slate-400 text-[11px] leading-normal">
                  Are you absolutely certain you want to disable facial enrollment capabilities? Type <span className="font-mono font-black text-red-600 bg-red-50 px-1 rounded">DISABLE</span> to authenticate this change.
                </p>
              </div>
            </div>

            <input
              type="text"
              value={confirmInput}
              onChange={(e) => setConfirmInput(e.target.value)}
              placeholder="Type DISABLE here..."
              className="w-full p-2.5 border border-slate-200 rounded-xl font-bold font-mono text-center uppercase tracking-widest text-slate-900 focus:outline-none focus:border-slate-900"
            />

            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowModal(false)} className="px-3 py-1.5 border border-slate-200 bg-white rounded-xl font-bold shadow-3xs">Cancel</button>
              <button
                type="button"
                disabled={confirmInput !== 'DISABLE'}
                onClick={handleExecute}
                className="px-3 py-1.5 text-white bg-red-600 hover:bg-red-700 disabled:opacity-40 font-bold rounded-xl shadow-sm transition-all"
              >
                Deactivate Strategy
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
