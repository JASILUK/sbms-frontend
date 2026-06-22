import React, { useState } from 'react';
import { X, UserCheck, Search, Loader2, Sparkles, ArrowLeft } from 'lucide-react';
import { FaceCameraCapture } from '../face-enrollment/FaceCameraCapture'; 
import { useGetEmployeesQuery } from '../../../emplyees/emplyeeApi'; 

export function HREnrollmentModal({ isOpen, onClose, onEnroll, isSubmitting, modelsReady = true }) {
  const [step, setStep] = useState(1); // 1: Select Employee, 2: Camera Pipeline Capture
  const [targetId, setTargetId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [wizardStep, setWizardStep] = useState(1);
  const [hrCachedEmbedding, setHrCachedEmbedding] = useState(null); // ✅ FIXED: Safely caches embedding data locally

  // Ingest real workspace employee memberships using RTK-Query
  const { data: serverResponse, isLoading: loadingEmployees } = useGetEmployeesQuery(undefined, { skip: !isOpen });

  if (!isOpen) return null;

  // Extract the data array correctly from the API envelope wrapper
  const employeesPool = Array.isArray(serverResponse?.data) ? serverResponse.data : [];

  // Performs search filtering using the correct top-level API keys ('username', 'user_email', 'department_name')
  const filteredEmployees = employeesPool.filter(emp => {
    const searchableText = `${emp.username || ''} ${emp.user_email || ''} ${emp.department_name || ''} ${emp.job_title || ''}`.toLowerCase();
    return searchableText.includes(searchQuery.toLowerCase());
  });

  const handleNextToCamera = (e) => {
    e.preventDefault();
    if (targetId) setStep(2);
  };

  // ✅ FIXED: Safely intercept matrix coordinates array, preventing automated continuous API blasts
  const handleDescriptorGenerated = (descriptor) => {
    setHrCachedEmbedding(descriptor);
  };

  // ✅ FIXED: Explicitly triggers mutation submit action only when clicking the primary commit button
  const handleCommitHREnrollment = async () => {
    if (!hrCachedEmbedding || isSubmitting) return;
    try {
      await onEnroll({ membership_id: Number(targetId), embedding: hrCachedEmbedding });
      handleModalCloseCleanup();
    } catch (err) {
      console.error("HR direct profile ingestion failure:", err);
    }
  };

  const handleResetWizardSequence = () => {
    setWizardStep(1);
    setHrCachedEmbedding(null);
  };

  const handleModalCloseCleanup = () => {
    setStep(1);
    setTargetId('');
    setSearchQuery('');
    setWizardStep(1);
    setHrCachedEmbedding(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-100 shadow-2xl relative flex flex-col overflow-hidden max-h-[90vh]">
        
        {/* Header Block */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Direct Biometric Assignment</h3>
          <button 
            type="button" 
            onClick={handleModalCloseCleanup} 
            className="p-1.5 hover:bg-slate-50 text-slate-400 rounded-xl cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Viewport Dock */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col items-center">
          {step === 1 ? (
            <form onSubmit={handleNextToCamera} className="space-y-4 w-full">
              
              {/* Premium Search Query Input */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Search Employee Profile
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Type name, email, or department..."
                    className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600 text-xs font-medium transition-all"
                  />
                </div>
              </div>

              {/* Selection Options Dropdown Container */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Select Target Employee Workspace Record
                </label>
                
                {loadingEmployees ? (
                  <div className="w-full h-9 bg-slate-50 border border-slate-200 rounded-xl flex items-center px-3 gap-2 text-slate-400 animate-pulse text-xs">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-500" />
                    <span>Pulling workspace records directory...</span>
                  </div>
                ) : (
                  <select
                    required
                    value={targetId}
                    onChange={(e) => setTargetId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold text-xs focus:outline-hidden cursor-pointer"
                  >
                    <option value="">
                      {filteredEmployees.length === 0 ? 'No matching employee options found' : 'Choose an active employee...'}
                    </option>
                    {filteredEmployees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.username.toUpperCase()} — {emp.user_email} [{emp.department_name || 'No Dept'}]
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Action Trigger Button */}
              <button
                type="submit"
                disabled={!targetId || loadingEmployees}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <UserCheck className="h-4 w-4" />
                <span>Initialize Hardware Pipeline</span>
              </button>
            </form>
          ) : (
            <div className="w-full flex flex-col items-center space-y-4">
              {/* Camera Pipeline Capture Section Layout */}
              <FaceCameraCapture
                currentStep={wizardStep}
                onStepVerified={() => setWizardStep(prev => prev + 1)}
                onDescriptorGenerated={handleDescriptorGenerated}
                onResetWizard={handleResetWizardSequence}
                isSubmitting={isSubmitting}
                modelsReady={modelsReady}
                isModalContext={true}
              />

              {/* ✅ FIXED: Interactive Commit Actions Deck rendered strictly at preview complete step */}
              {wizardStep === 4 && hrCachedEmbedding && (
                <div className="w-full max-w-sm border-t border-slate-100 pt-4 space-y-2 animate-fadeIn">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleCommitHREnrollment}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-all active:scale-98"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-white" />
                    ) : (
                      <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                    )}
                    <span>Commit and Enroll Employee Profile</span>
                  </button>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => {
                      setStep(1);
                      setHrCachedEmbedding(null);
                      setWizardStep(1);
                    }}
                    className="w-full py-2 border border-slate-200 text-slate-500 hover:bg-slate-50 font-bold rounded-xl text-xs cursor-pointer flex items-center justify-center gap-1.5 transition-all"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Back to Selection List</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}