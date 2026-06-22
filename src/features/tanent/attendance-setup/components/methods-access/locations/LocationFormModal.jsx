import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Search, Navigation } from 'lucide-react';

import { attendanceLocationFormSchema } from '../../../schemas/attendanceLocationSchemas';
import { RADIUS_PRESETS } from '../../../constants/attendanceLocationConstants';
import { searchAddressNominatim, reverseGeocodeNominatim } from '../../../utils/nominatimHelpers';
import { captureDeviceCurrentPosition } from '../../../utils/geolocationHelpers';
import { RadiusPreviewCard } from './RadiusPreviewCard';
import { LocationMapPicker } from './LocationMapPicker';

export function LocationFormModal({ editRecord, onClose, onSave }) {
  const [addressQuery, setAddressQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);
  const [isLocatingDevice, setIsLocatingDevice] = useState(false);

  const { register, handleSubmit, control, setValue, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(attendanceLocationFormSchema),
    defaultValues: editRecord || {
      name: '',
      address: '',
      latitude: 11.258753,
      longitude: 75.780411,
      radius_meters: 150
    }
  });

  const watchedLat = watch('latitude');
  const watchedLon = watch('longitude');
  const watchedRadius = watch('radius_meters');

  // Address Search Autocomplete Debounce Logic (600ms)
  useEffect(() => {
    if (!addressQuery || addressQuery.trim().length < 4) {
      setSuggestions([]);
      return;
    }
    const delayTimer = setTimeout(async () => {
      setIsSearchingAddress(true);
      const res = await searchAddressNominatim(addressQuery);
      setSuggestions(res);
      setIsSearchingAddress(false);
    }, 600);

    return () => clearTimeout(delayTimer);
  }, [addressQuery]);

  const handleSelectSuggestion = (sug) => {
    setValue('address', sug.address, { shouldDirty: true, shouldValidate: true });
    setValue('latitude', sug.latitude, { shouldDirty: true, shouldValidate: true });
    setValue('longitude', sug.longitude, { shouldDirty: true, shouldValidate: true });
    setSuggestions([]);
    setAddressQuery('');
  };

  const handleFetchCurrentLocation = async () => {
    setIsLocatingDevice(true);
    try {
      const coords = await captureDeviceCurrentPosition();
      setValue('latitude', coords.latitude, { shouldDirty: true, shouldValidate: true });
      setValue('longitude', coords.longitude, { shouldDirty: true, shouldValidate: true });
      const revAddr = await reverseGeocodeNominatim(coords.latitude, coords.longitude);
      if (revAddr) setValue('address', revAddr, { shouldDirty: true, shouldValidate: true });
    } catch (err) {
      alert(err.message || 'Unable to resolve browser coordinates sets.');
    } finally {
      setIsLocatingDevice(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-2xs" onClick={onClose} />
      
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col relative animate-scaleUp max-h-[90vh]">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/60 text-xs">
          <h3 className="font-bold uppercase tracking-wider text-slate-900">
            {editRecord ? 'Modify Geofence Tracking Perimeter' : 'Establish Corporate Geofence Boundary Site'}
          </h3>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSave)} className="p-5 overflow-y-auto space-y-4 text-xs flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
          
          <div className="sm:col-span-2 space-y-1">
            <label className="font-bold text-slate-700 block">Location Perimeter Name</label>
            <input
              type="text"
              {...register('name')}
              placeholder="e.g., Calicut Cyberpark Main Tower Node"
              className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-900 text-xs font-medium"
            />
            {errors.name && <p className="text-red-600 font-semibold">{errors.name.message}</p>}
          </div>

          {/* Method 1: Geocoding Autocomplete Lookup Address Field */}
          <div className="sm:col-span-2 space-y-1 relative">
            <label className="font-bold text-slate-700 block">Search Public Address (OSM Autocomplete)</label>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={addressQuery}
                onChange={(e) => setAddressQuery(e.target.value)}
                placeholder="Type structural node markers (e.g. Cyberpark Kozhikode)..."
                className="w-full pl-8 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-900 text-xs font-medium placeholder-slate-400"
              />
            </div>
            {isSearchingAddress && <p className="text-[10px] text-slate-400 italic mt-0.5 animate-pulse">Querying OpenStreetMap servers list...</p>}
            
            {suggestions.length > 0 && (
              <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-20 divide-y divide-slate-100 max-h-40 overflow-y-auto font-medium text-slate-600">
                {suggestions.map((sug, i) => (
                  <div
                    key={i}
                    onClick={() => handleSelectSuggestion(sug)}
                    className="p-2 hover:bg-slate-50 cursor-pointer truncate leading-normal"
                  >
                    {sug.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="sm:col-span-2 space-y-1">
            <label className="font-bold text-slate-700 block">Resolved Formal Address Record</label>
            <textarea
              rows={2}
              {...register('address')}
              className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-900 text-xs font-medium resize-none"
            />
          </div>

          {/* Method 2: Live Leaflet Interaction Mapping Component */}
          <div className="sm:col-span-2 space-y-1">
            <label className="font-bold text-slate-700 block">Visual Geofence Selection (Click Map to Move Marker Pin)</label>
            <LocationMapPicker
              latitude={parseFloat(watchedLat)}
              longitude={parseFloat(watchedLon)}
              radius={parseInt(watchedRadius, 10)}
              onLocationChange={(newCoords) => {
                setValue('latitude', newCoords.latitude, { shouldDirty: true, shouldValidate: true });
                setValue('longitude', newCoords.longitude, { shouldDirty: true, shouldValidate: true });
                if (newCoords.address) {
                  setValue('address', newCoords.address, { shouldDirty: true, shouldValidate: true });
                }
              }}
            />
          </div>

          {/* Method 3: Browser Framework Geolocation Device Context Ingestion */}
          <div className="sm:col-span-2 pt-1">
            <button
              type="button"
              disabled={isLocatingDevice}
              onClick={handleFetchCurrentLocation}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 bg-slate-50 hover:bg-slate-100 rounded-lg font-bold text-slate-700 shadow-2xs transition-all disabled:opacity-50"
            >
              <Navigation className={`h-3.5 w-3.5 ${isLocatingDevice ? 'animate-spin text-indigo-600' : ''}`} />
              Use My Current Device Coordinates Position
            </button>
          </div>

          {/* Method 4: High Precision Coordinate Fallbacks Inputs */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">Latitude Vector</label>
            <input
              type="number"
              step="any"
              {...register('latitude')}
              className="w-full p-2 border border-slate-200 rounded-lg font-mono focus:outline-none text-xs font-medium"
            />
            {errors.latitude && <p className="text-red-600 font-semibold">{errors.latitude.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">Longitude Vector</label>
            <input
              type="number"
              step="any"
              {...register('longitude')}
              className="w-full p-2 border border-slate-200 rounded-lg font-mono focus:outline-none text-xs font-medium"
            />
            {errors.longitude && <p className="text-red-600 font-semibold">{errors.longitude.message}</p>}
          </div>

          <div className="sm:col-span-2 space-y-2 border-t border-slate-100 pt-3">
            <label className="font-bold text-slate-700 block">Geofence Validation Radius Bounds</label>
            <Controller
              name="radius_meters"
              control={control}
              render={({ field }) => (
                <div className="space-y-2">
                  <div className="grid grid-cols-4 gap-2">
                    {RADIUS_PRESETS.map((preset) => (
                      <div
                        key={preset.value}
                        onClick={() => field.onChange(preset.value)}
                        className={`border rounded-lg p-2 text-center cursor-pointer transition-all ${
                          field.value === preset.value 
                            ? 'border-slate-900 bg-slate-50/80 ring-1 ring-slate-900 font-bold text-slate-900' 
                            : 'border-slate-200 bg-white text-slate-500 font-medium'
                        }`}
                      >
                        <span className="block">{preset.label}</span>
                        <span className="text-[9px] text-slate-400 block font-normal">{preset.accuracy}</span>
                      </div>
                    ))}
                  </div>
                  <input
                    type="range"
                    min={50}
                    max={1000}
                    step={25}
                    value={field.value}
                    onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                    className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
                  />
                </div>
              )}
            />
          </div>

          <div className="sm:col-span-2 pt-2">
            <RadiusPreviewCard lat={parseFloat(watchedLat)} lon={parseFloat(watchedLon)} radius={watchedRadius} />
          </div>

          <div className="sm:col-span-2 p-4 border-t border-slate-100 bg-slate-50 -mx-5 -mb-5 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 border border-slate-200 rounded-lg font-semibold text-slate-700 bg-white hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-3 py-1.5 border border-transparent rounded-lg font-semibold text-white bg-slate-900 hover:bg-slate-800 shadow-sm disabled:opacity-40"
            >
              {isSubmitting ? 'Syncing row data...' : 'Commit Geofence Node'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}