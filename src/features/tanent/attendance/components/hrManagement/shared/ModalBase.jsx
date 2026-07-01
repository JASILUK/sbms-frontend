import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';

export default function ModalBase({ isOpen, onClose, title, children, footerAction = null, footerLabel = "Confirm" }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-x-hidden overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" onClick={onClose} />
      
      <div 
        ref={dialogRef}
        className="relative w-full max-w-lg transform rounded-2xl bg-white dark:bg-slate-950 p-6 shadow-2xl transition-all border border-slate-200 dark:border-slate-800 flex flex-col gap-4 animate-scale-up"
      >
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-900 pb-3">
          <h3 id="modal-title" className="text-lg font-semibold text-slate-900 dark:text-white">
            {title}
          </h3>
          <button 
            type="button" 
            className="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300 p-1 rounded-md" 
            onClick={onClose}
            aria-label="Close dialog modal"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="text-sm text-slate-600 dark:text-slate-400">
          {children}
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-100 dark:border-slate-900 pt-3">
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          {footerAction && (
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              onClick={footerAction}
            >
              {footerLabel}
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

ModalBase.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  footerAction: PropTypes.func,
  footerLabel: PropTypes.string,
};