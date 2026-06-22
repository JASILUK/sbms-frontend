export const ATTENDANCE_LOCATIONS_TAG = 'ATTENDANCE_LOCATIONS';

export const LOCATION_STATUS_FILTERS = {
  ALL: 'all',
  ACTIVE: 'active',
  INACTIVE: 'inactive'
};

export const RADIUS_PRESETS = [
  { value: 100, label: '100m', accuracy: 'Highly Strict' },
  { value: 150, label: '150m', accuracy: 'Standard Hub' },
  { value: 250, label: '250m', accuracy: 'Regional Hub' },
  { value: 500, label: '500m', accuracy: 'Extended Site' }
];

export const MAP_DEFAULT_CENTER = [11.258753, 75.780411]; // Core Kerala Regional Coordinates
export const MAP_DEFAULT_ZOOM = 14;