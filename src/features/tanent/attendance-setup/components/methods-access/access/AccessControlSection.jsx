import React from 'react';
import { useSearchParams } from 'react-router-dom';

import { useAttendanceAccess } from '../../../hooks/useAttendanceAccess';
import { useAttendanceResolution } from '../../../hooks/useAttendanceResolution';
import { AccessControlTabs } from './AccessControlTabs';

import { CompanyDefaultsSection } from './CompanyDefaultsSection';
import { AccessRulesSection } from './AccessRulesSection';
import { EmployeeOverridesSection } from './EmployeeOverridesSection';
import { ResolutionPreviewSection } from './ResolutionPreviewSection';

export function AccessControlSection() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Level-2 Deep Query Tab Selector fallback to defaults policy settings panel
  const activeControlTab = searchParams.get('tab') || 'defaults';

  // ✅ FIXED: Destructure matching the exact production useAttendanceAccess hook contracts
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
    spatialIndexMap = new Map()
  } = useAttendanceAccess();

  const {
    membershipId,
    setMembershipId,
    resolution,
    isLoading: isResolutionLoading
  } = useAttendanceResolution();

  const handleControlTabToggle = (tabId) => {
    setSearchParams({ 
      section: 'access', // Ensure Level-1 section index state remains anchored during tab mutations
      tab: tabId 
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Level-2 Nested Inner Subtabs Layer */}
      <AccessControlTabs 
        activeTab={activeControlTab} 
        onTabChange={handleControlTabToggle} 
        rulesCount={accessRules?.length || 0}
        overridesCount={employeeOverrides?.length || 0}
      />

      <div className="mt-4">
        {activeControlTab === 'defaults' && (
          <CompanyDefaultsSection
            defaults={companyDefaults}
            companyMethodsPool={companyMethodsPool}      
            companyLocationsPool={companyLocationsPool}  
            locationMap={spatialIndexMap}
          />
        )}

        {activeControlTab === 'rules' && (
          <AccessRulesSection
            accessRules={accessRules}
            departmentsPool={departmentsPool}
            companyMethodsPool={companyMethodsPool}
            companyLocationsPool={companyLocationsPool}
            departmentMap={departmentIndexMap}
            locationMap={spatialIndexMap}
          />
        )}

        {activeControlTab === 'overrides' && (
          <EmployeeOverridesSection
            employeeOverrides={employeeOverrides}
            employeesPool={employeesPool}
            companyMethodsPool={companyMethodsPool}
            companyLocationsPool={companyLocationsPool}
            employeeIndexMap={employeeIndexMap}
          />
        )}

        {activeControlTab === 'preview' && (
          <ResolutionPreviewSection
            employeesPool={employeesPool}
            resolution={resolution}
            isLoading={isResolutionLoading}
            activeMembershipId={membershipId}
            onResolve={setMembershipId}
          />
        )}
      </div>
    </div>
  );
}