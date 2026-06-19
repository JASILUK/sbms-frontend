import React from "react";

const StartSessionModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-lg font-semibold text-slate-900">Start Session</h2>
        <p className="text-sm text-slate-500 mt-1">This will start the meeting session and notify all participants.</p>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Not Now</button>
          <button onClick={onConfirm} className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Start Session</button>
        </div>
      </div>
    </div>
  );
};

export default StartSessionModal;
