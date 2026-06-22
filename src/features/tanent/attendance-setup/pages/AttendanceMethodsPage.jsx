import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ShieldAlert } from 'lucide-react';

import { useAttendanceAccess } from '../hooks/useAttendanceAccess';
import { MethodsHeader } from '../components/methods-access/methods/MethodsHeader';
import { MethodsAccessTabs } from '../components/methods-access/MethodsAccessTabs';
import { CompanyDefaultsSection } from '../components/methods-access/access/CompanyDefaultsSection';
import { AccessRulesSection } from '../components/methods-access/access/AccessRulesSection';
import { EmployeeOverridesSection } from '../components/methods-access/access/EmployeeOverridesSection';
import { ResolutionPreviewSection } from '../components/methods-access/access/ResolutionPreviewSection';
import { LocationsSkeleton } from '../components/methods-access/locations/LocationsSkeleton';

export default function AttendanceMethodsPage() {
  const [searchParams] = useSearchParams();
  const activeTabSection = searchParams.get('section') || 'methods';
  const [activeSubViewTab, setActiveSubViewTab] = useState('overview');

  const {
    companyDefaults,
    accessRules = [],
    employeeOverrides = [],
    employeesPool = [],
    departmentsPool = [],
    companyMethodsPool = [],
    companyLocationsPool = [],
    employeeIndexMap = new Map(),
    departmentIndexMap = new Map(),
    spatialIndexMap = new Map(),
    isAccessDataLoading,
    isMethodsLoading,
    isLocationsLoading
  } = useAttendanceAccess();

  if (isAccessDataLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-6 bg-white min-h-screen">
        <LocationsSkeleton />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 bg-white min-h-screen text-xs">
      <Toaster position="top-right" richColors closeButton />
      
      <MethodsHeader />
      <MethodsAccessTabs activeSection={activeTabSection} />

      <div className="pt-2">
        {activeTabSection === 'access' ? (
          <div className="space-y-6">
            <div className="flex border-b border-slate-200 font-bold text-slate-400 gap-2 text-[11px]">
              {['overview', 'rules', 'overrides', 'resolution'].map((view) => (
                <button
                  key={view}
                  type="button"
                  onClick={() => setActiveSubViewTab(view)}
                  className={`px-4 py-2 border-b-2 font-black uppercase tracking-wider transition-all ${
                    activeSubViewTab === view 
                      ? 'border-slate-900 text-slate-900' 
                      : 'border-transparent hover:text-slate-600'
                  }`}
                >
                  {view} Configuration
                </button>
              ))}
            </div>

            <div className="pt-2">
              {activeSubViewTab === 'overview' && (
                <CompanyDefaultsSection
                  defaults={companyDefaults}
                  companyMethodsPool={companyMethodsPool}      
                  companyLocationsPool={companyLocationsPool}  
                  locationMap={spatialIndexMap}
                  isMethodsLoading={isMethodsLoading}
                  isLocationsLoading={isLocationsLoading}
                />
              )}

              {activeSubViewTab === 'rules' && (
                <AccessRulesSection
                  accessRules={accessRules}
                  departmentsPool={departmentsPool}
                  companyMethodsPool={companyMethodsPool}
                  companyLocationsPool={companyLocationsPool}
                  departmentMap={departmentIndexMap}
                  locationMap={spatialIndexMap}
                />
              )}

              {activeSubViewTab === 'overrides' && (
                <EmployeeOverridesSection
                  employeeOverrides={employeeOverrides}
                  employeesPool={employeesPool}
                  companyMethodsPool={companyMethodsPool}
                  companyLocationsPool={companyLocationsPool}
                  employeeIndexMap={employeeIndexMap}
                />
              )}

              {activeSubViewTab === 'resolution' && (
                <ResolutionPreviewSection employeesPool={employeesPool} />
              )}
            </div>
          </div>
        ) : (
          <div className="p-8 border border-dashed border-slate-200 rounded-xl text-center text-slate-400 bg-slate-50/40 font-bold flex flex-col items-center justify-center gap-2">
            <ShieldAlert className="h-6 w-6 text-slate-300" />
            <span>The selected workspace configuration module boundaries display path components are loaded through Phase 1 or Phase 2 sub-module layout structures hooks.</span>
          </div>
        )}
      </div>
    </div>
  );
}