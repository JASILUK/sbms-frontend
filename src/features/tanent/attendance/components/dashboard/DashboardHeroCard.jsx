import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ScanFace, MapPin, Layers, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';
import { getStatusConfig } from '../../utils/dashboardHelpers';

export const DashboardHeroCard = React.memo(({ today, access, actions }) => {
  const navigate = useNavigate();
  const statusConfig = getStatusConfig(today?.status);
  
  const faceStatus = access?.face_enrollment_status || 'NO_ENROLLMENT';
  const isBiometricDeviceOnly = access?.auto_synced || (access?.available_methods?.length === 0 && access?.auto_synced);

  const handleActionNavigation = () => {
    if (!statusConfig.actionable) return;
    
    // Lock checking parameters and redirect to enrollment page if validation demands a missing face artifact
    if (access?.face_required && faceStatus !== 'APPROVED') {
      navigate('/app/attendance/face-enrolment');
      return;
    }
    
    navigate('/app/attendance/check-in');
  };

  const renderAccessStatusDescriptor = () => {
    // 1. Hardware-Only Automation Mode Lockout
    if (isBiometricDeviceOnly) {
      return (
        <div className="flex items-start gap-2.5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-500 font-normal leading-relaxed">
          <ShieldCheck className="h-4 w-4 text-slate-600 mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-bold text-slate-800">Hardware Automation Synced:</span> Your attendance metrics compile automatically from physical biometric terminal logs. Web console interaction is read-only.
          </div>
        </div>
      );
    }

    // 2. Structural Face Ingestion Pipeline State Evaluator
    if (access?.face_required || access?.available_methods?.includes('FACE')) {
      if (faceStatus === 'PENDING') {
        return (
          <div className="flex items-start gap-2.5 p-3.5 bg-amber-50/60 border border-amber-200/50 rounded-xl text-[11px] text-amber-800 font-normal leading-relaxed animate-fadeIn">
            <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-bold text-amber-900">Biometric Profile Pending Approval:</span> Your enrollment is currently undergoing administrative verification. Manual verification routes are blocked.
            </div>
          </div>
        );
      }
      if (faceStatus === 'REJECTED') {
        return (
          <div className="flex items-start gap-2.5 p-3.5 bg-rose-50/60 border border-rose-200/50 rounded-xl text-[11px] text-rose-800 font-normal leading-relaxed animate-fadeIn">
            <AlertCircle className="h-4 w-4 text-rose-600 mt-0.5 flex-shrink-0" />
            <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <span className="font-bold text-rose-900">Enrollment Matrix Rejected:</span> The facial structure vector did not pass internal consistency checks. Please update your data profile.
              </div>
              <button 
                type="button"
                onClick={() => navigate('/app/attendance/face-enrolment')} 
                className="text-[10px] font-bold uppercase tracking-wider text-rose-700 underline hover:text-rose-900 flex-shrink-0 cursor-pointer focus:outline-hidden"
              >
                Re-Enroll Now
              </button>
            </div>
          </div>
        );
      }
      if (faceStatus === 'NO_ENROLLMENT' && access?.face_required) {
        return (
          <div className="flex items-start gap-2.5 p-3.5 bg-indigo-50/60 border border-indigo-200/50 rounded-xl text-[11px] text-indigo-800 font-normal leading-relaxed animate-fadeIn">
            <ScanFace className="h-4 w-4 text-indigo-600 mt-0.5 flex-shrink-0" />
            <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <span className="font-bold text-indigo-900">Biometric Signature Required:</span> Your tracking configuration mandates biometric verification profile registration before operations can clear.
              </div>
              <button 
                type="button"
                onClick={() => navigate('/app/attendance/face-enrolment')} 
                className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 hover:text-indigo-900 bg-white border border-indigo-200 px-2.5 py-1 rounded-lg font-mono shadow-4xs flex-shrink-0 cursor-pointer transition-all active:scale-97 focus:outline-hidden"
              >
                Configure Profile
              </button>
            </div>
          </div>
        );
      }
    }

    // 3. Dynamic Multi-Method Rules Info Panel Layout
    const isStrictAll = access?.validation_mode === 'STRICT_ALL' || access?.validation_mode === 'ALL' || access?.validation_mode === 'FACE_GPS';

    return (
      <div className="space-y-2 pt-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">
            Verification Rules Matrix ({access?.validation_mode || 'ANY'}):
          </span>
          {access?.available_methods?.map((m) => (
            <span key={m} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600 font-mono text-[9px] font-bold uppercase shadow-4xs">
              {m === 'FACE' && <ScanFace className="h-2.5 w-2.5 text-slate-400" />}
              {m === 'GPS' && <MapPin className="h-2.5 w-2.5 text-slate-400" />}
              {m === 'WEB' && <Layers className="h-2.5 w-2.5 text-slate-400" />}
              {m}
            </span>
          ))}
        </div>
        
        <p className="text-[10px] text-slate-400 font-normal leading-normal">
          {isStrictAll ? (
            <span className="text-indigo-600 font-medium">⚠️ Policy enforces strict alignment: Both location bounds checking AND identity validation must resolve simultaneously.</span>
          ) : (
            <span>Policy allows flexible execution routes. Clear checking can complete via any authenticated pipelines displayed above.</span>
          )}
        </p>
      </div>
    );
  };

  // Compute disabled flags blocking CTA visibility parameters
  const isButtonDisabled = 
    !statusConfig.actionable || 
    isBiometricDeviceOnly || 
    (access?.face_required && faceStatus === 'PENDING') ||
    (access?.face_required && faceStatus === 'REJECTED');

  const getDynamicButtonLabel = () => {
    if (access?.face_required && faceStatus === 'NO_ENROLLMENT') {
      return 'Complete Enrollment Setup';
    }
    return statusConfig.ctaLabel;
  };

  return (
    <div className={`w-full border rounded-2xl p-5 sm:p-6 transition-all duration-300 ring-4 ${statusConfig.colorClass}`}>
      <div className="flex flex-col space-y-4">
        
        <div className="flex justify-between items-start w-full">
          <div className="space-y-1">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase border ${statusConfig.badgeClass}`}>
              {statusConfig.label}
            </span>
            <p className="text-xs text-slate-500 font-normal max-w-xl leading-relaxed">
              {statusConfig.description}
            </p>
          </div>
        </div>

        {renderAccessStatusDescriptor()}

        {!isBiometricDeviceOnly && (
          <div className="pt-1 w-full max-w-xs">
            <button
              type="button"
              disabled={isButtonDisabled}
              onClick={handleActionNavigation}
              className="w-full py-2.5 px-4 bg-slate-900 text-white font-bold rounded-xl text-xs tracking-tight transition-all active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 shadow-xs hover:bg-slate-800 group focus:outline-hidden focus:ring-2 focus:ring-slate-950 focus:ring-offset-2"
              aria-label={getDynamicButtonLabel()}
            >
              <span>{getDynamicButtonLabel()}</span>
              <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
});

DashboardHeroCard.displayName = 'DashboardHeroCard';