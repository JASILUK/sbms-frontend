/**
 * @file nominatimHelpers.js
 * @description Ingestion Engine for Address Resolution using OpenStreetMap Public Nominatim.
 */

export async function searchAddressNominatim(query) {
  if (!query || query.trim().length < 3) return [];
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5`,
      {
        headers: { 'User-Agent': 'SBMS-Enterprise-HRMS-Attendance-Module-Context' }
      }
    );
    if (!response.ok) throw new Error('Network boundary response failure.');
    const data = await response.json();
    return data.map((item) => ({
      label: item.display_name,
      address: item.display_name,
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon)
    }));
  } catch (error) {
    console.error('Nominatim query engine dropped exception:', error);
    return [];
  }
}

export async function reverseGeocodeNominatim(lat, lon) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`,
      {
        headers: { 'User-Agent': 'SBMS-Enterprise-HRMS-Attendance-Module-Context' }
      }
    );
    if (!response.ok) return '';
    const data = await response.json();
    return data.display_name || '';
  } catch (error) {
    console.error('Reverse geocoding tracker dropped exception:', error);
    return '';
  }
}