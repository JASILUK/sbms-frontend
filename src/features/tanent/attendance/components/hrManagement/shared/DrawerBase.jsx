import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';

export default function DrawerBase({ isOpen, onClose, title, children }) {
  const overlayRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      closeButtonRef.current?.focus();
      
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
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
      <div className="absolute inset-0 overflow-hidden">
        {/* Backdrop overlay fade transition block */}
        <div 
          ref={overlayRef}
          className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
        />

        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
          <div className="pointer-events-auto w-screen max-w-xl transform bg-white dark:bg-slate-950 shadow-2xl transition-transform duration-300 ease-in-out border-l border-slate-200 dark:border-slate-800">
            <div className="flex h-full flex-col overflow-y-scroll py-6">
              <div className="px-4 sm:px-6 border-b border-slate-100 dark:border-slate-900 pb-4 flex items-center justify-between">
                <h2 id="drawer-title" className="text-lg font-semibold text-slate-900 dark:text-white">
                  {title}
                </h2>
                <button
                  ref={closeButtonRef}
                  type="button"
                  className="rounded-lg p-2 text-slate-400 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:hover:text-slate-300"
                  onClick={onClose}
                  aria-label="Close panel surface"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="relative mt-6 flex-1 px-4 sm:px-6">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

DrawerBase.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};