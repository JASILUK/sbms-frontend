import React, { useState, useMemo, useCallback } from 'react';
import { toast } from 'sonner';

import { useAttendanceLocations } from '../../../hooks/useAttendanceLocations';
import { LocationsHeader } from './LocationsHeader';
import { LocationFilters } from './LocationFilters';
import { LocationsTable } from './LocationsTable';
import { LocationCard } from './LocationCard';
import { LocationFormModal } from './LocationFormModal';
import { LocationDetailsDrawer } from './LocationDetailsDrawer';
import { EmptyLocationsState } from './EmptyLocationsState';
import { LocationsSkeleton } from './LocationsSkeleton';

export function AttendanceLocationsSection() {
  const [filters, setFilters] = useState({ search: '', status: 'all' });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeEditRecord, setActiveEditRecord] = useState(null);
  const [viewDrawerId, setViewDrawerId] = useState(null);

  const {
    locations,
    isLoading,
    isUpdating,
    createLocation,
    updateLocation,
    activateLocation,
    deactivateLocation
  } = useAttendanceLocations(filters);

  const handleSearchMutation = useCallback((val) => {
    setFilters(prev => ({ ...prev, search: val }));
  }, []);

  const handleStatusMutation = useCallback((val) => {
    setFilters(prev => ({ ...prev, status: val }));
  }, []);

  const handleOpenCreateModal = useCallback(() => {
    setActiveEditRecord(null);
    setIsFormOpen(true);
  }, []);

  const handleOpenEditModal = useCallback((record) => {
    setActiveEditRecord(record);
    setIsFormOpen(true);
  }, []);

  const handleSaveGeofenceRecord = async (formData) => {
    try {
      if (activeEditRecord?.id) {
        await updateLocation(activeEditRecord.id, formData);
        toast.success('Location updated successfully.');
      } else {
        await createLocation(formData);
        toast.success('Location created successfully.');
      }
      setIsFormOpen(false);
    } catch (err) {
      toast.error(err?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  const handleToggleGeofenceStatus = useCallback(async (id, currentStateActive) => {
    try {
      if (currentStateActive) {
        await deactivateLocation(id);
        toast.success('Location deactivated successfully.');
      } else {
        await activateLocation(id);
        toast.success('Location activated successfully.');
      }
    } catch (err) {
      toast.error(err?.data?.message || 'Something went wrong. Please try again.');
    }
  }, [activateLocation, deactivateLocation]);

  const activeDrawerRecord = useMemo(() => {
    if (!viewDrawerId) return null;
    return locations.find(l => l.id === viewDrawerId) || null;
  }, [viewDrawerId, locations]);

  if (isLoading) return <LocationsSkeleton />;

  return (
    <div className="space-y-4 animate-fadeIn">
      <LocationsHeader onAddLocation={handleOpenCreateModal} />
      
      <LocationFilters
        search={filters.search}
        onSearchChange={handleSearchMutation}
        status={filters.status}
        onStatusChange={handleStatusMutation}
      />

      {locations.length === 0 ? (
        <EmptyLocationsState onAddLocation={handleOpenCreateModal} />
      ) : (
        <>
          {/* Responsive Layout Switching Logic Layer */}
          <LocationsTable
            locations={locations}
            isUpdating={isUpdating}
            onView={setViewDrawerId}
            onEdit={handleOpenEditModal}
            onToggleStatus={handleToggleGeofenceStatus}
          />
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {locations.map((loc) => (
              <LocationCard
                key={loc.id}
                loc={loc}
                isUpdating={isUpdating}
                onView={setViewDrawerId}
                onEdit={handleOpenEditModal}
                onToggleStatus={handleToggleGeofenceStatus}
              />
            ))}
          </div>
        </>
      )}

      {isFormOpen && (
        <LocationFormModal
          editRecord={activeEditRecord}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSaveGeofenceRecord}
        />
      )}

      {viewDrawerId && (
        <LocationDetailsDrawer
          record={activeDrawerRecord}
          onClose={() => setViewDrawerId(null)}
        />
      )}
    </div>
  );
}