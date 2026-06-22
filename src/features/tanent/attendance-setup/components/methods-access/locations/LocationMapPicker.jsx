import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Circle, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { reverseGeocodeNominatim } from '../../../utils/nominatimHelpers';

// Fix for default Leaflet icon missing asset paths in bundler builds
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Dynamic inner controller component to handle map panning auto-recenter
function MapRecenterController({ lat, lon }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lon) {
      map.setView([lat, lon], map.getZoom());
    }
  }, [lat, lon, map]);
  return null;
}

// Dynamic inner controller component capturing map pointer clicks
function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      // Trigger reverse geocoding script to look up address from coordinates
      const resolvedAddress = await reverseGeocodeNominatim(lat, lng);
      onMapClick(lat, lng, resolvedAddress);
    }
  });
  return null;
}

export function LocationMapPicker({ latitude, longitude, radius, onLocationChange }) {
  // Graceful fallbacks to standard corporate coordinates map views if values are unassigned
  const currentCenter = [
    latitude && !isNaN(latitude) ? latitude : 11.258753,
    longitude && !isNaN(longitude) ? longitude : 75.780411
  ];

  const safeRadius = typeof radius === 'number' && !isNaN(radius) ? radius : 150;

  const handleManualPinDrop = (lat, lng, address) => {
    onLocationChange({ latitude: lat, longitude: lng, address });
  };

  return (
    <div className="w-full h-64 sm:h-80 border border-slate-200 rounded-xl overflow-hidden shadow-2xs relative group z-0">
      <MapContainer
        center={currentCenter}
        zoom={14}
        className="w-full h-full"
        zoomControl={true}
      >
        {/* OpenStreetMap public vector tiles distribution line */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Sync view changes state adjustments hooks controllers */}
        <MapRecenterController lat={currentCenter[0]} lon={currentCenter[1]} />
        <MapClickHandler onMapClick={handleManualPinDrop} />

        {/* Visual Geofence Node representation layers */}
        <Marker position={currentCenter} />
        
        <Circle
          center={currentCenter}
          radius={safeRadius}
          pathOptions={{
            color: '#0f172a',       // Slate 900 line border color
            fillColor: '#334155',   // Shaded interior fill area
            fillOpacity: 0.15,
            weight: 2
          }}
        />
      </MapContainer>
      
      <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-xs text-[10px] text-white px-2 py-1 rounded-md font-semibold font-mono z-50 shadow-sm pointer-events-none transition-opacity group-hover:opacity-100">
        Interactive Map Mode: Click anywhere to adjust geofence pivot target pin
      </div>
    </div>
  );
}