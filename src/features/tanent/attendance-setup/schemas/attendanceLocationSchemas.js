import { z } from 'zod';

export const attendanceLocationFormSchema = z.object({
  name: z.string()
    .min(2, { message: 'Location marker name must comprise at least 2 structural characters.' })
    .max(150, { message: 'Location marker name length cannot exceed 150 characters.' }),
  address: z.string().optional().default(''),
  
  // FIXED: Preprocess ensures floats round to exactly 6 decimal places before executing number checks
  latitude: z.preprocess((val) => {
    const parsed = parseFloat(val);
    return isNaN(parsed) ? val : parseFloat(parsed.toFixed(6));
  }, z.number()
    .min(-90, { message: 'Latitude spatial bound value must sit between -90 and 90.' })
    .max(90, { message: 'Latitude spatial bound value must sit between -90 and 90.' })),

  // FIXED: Preprocess ensures floats round to exactly 6 decimal places before executing number checks
  longitude: z.preprocess((val) => {
    const parsed = parseFloat(val);
    return isNaN(parsed) ? val : parseFloat(parsed.toFixed(6));
  }, z.number()
    .min(-180, { message: 'Longitude spatial bound value must sit between -180 and 180.' })
    .max(180, { message: 'Longitude spatial bound value must sit between -180 and 180.' })),

  radius_meters: z.preprocess((val) => parseInt(val, 10), z.number()
    .min(50, { message: 'Geofence tracking envelope requires at least a 50m radius perimeter bounds constraint.' })
    .max(2000, { message: 'Geofence validation rules cap maximum perimeter boundaries limits at 2000m.' }))
});