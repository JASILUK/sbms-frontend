import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Toaster } from 'sonner';

import { useAttendanceAccess } from '../hooks/useAttendanceAccess';
import { MethodsHeader } from '../components/methods-access/methods/MethodsHeader';
import { MethodsAccessTabs } from '../components/methods-access/MethodsAccessTabs';
import { AttendanceMethodsSection } from '../components/methods-access/methods/AttendanceMethodsSection';
import { AttendanceLocationsSection } from '../components/methods-access/locations/AttendanceLocationsSection';
import { AccessControlSection } from '../components/methods-access/access/AccessControlSection';

export default function AttendanceMethodsAccessPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Primary Navigation Section: methods | locations | access
  const activeSection = searchParams.get('section') || 'methods';

  const { isAccessDataLoading, refetch } = useAttendanceAccess();

  const handleSectionToggle = (sectionId) => {
    setSearchParams({ section: sectionId });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 bg-white min-h-screen">
      <Toaster position="top-right" richColors closeButton />
      
      <MethodsHeader
        onRefetch={() => {
          refetch();
        }}
        isRefetching={isAccessDataLoading}
      />

      {/* Primary Module Level-1 Navigation Layout Block */}
      <MethodsAccessTabs 
        activeSection={activeSection} 
        onSectionChange={handleSectionToggle} 
      />

      <div className="pt-2">
        {isAccessDataLoading ? (
          // FIXED: Combined both layout design tokens safely inside a single className property string block
          <div aria-hidden="true" className="space-y-4 animate-pulse">
            <div className="h-8 bg-slate-100 rounded-lg w-1/4" />
            <div className="h-48 bg-slate-50 rounded-xl w-full" />
          </div>
        ) : (
          <div className="transition-all duration-300">
            {activeSection === 'methods' && (
              <AttendanceMethodsSection />
            )}

            {activeSection === 'locations' && (
              <AttendanceLocationsSection />
            )}

            {activeSection === 'access' && (
              <AccessControlSection />
            )}
          </div>
        )}
      </div>
    </div>
  );
}