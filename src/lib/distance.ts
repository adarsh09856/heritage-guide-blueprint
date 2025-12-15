// Haversine formula to calculate distance between two points
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  } else if (km < 10) {
    return `${km.toFixed(1)} km`;
  } else if (km < 1000) {
    return `${Math.round(km)} km`;
  } else {
    return `${(km / 1000).toFixed(1)}k km`;
  }
}

export function estimateTravelTime(km: number, mode: 'driving' | 'walking' | 'flying' = 'driving'): string {
  const speeds = {
    driving: 60, // km/h average
    walking: 5, // km/h
    flying: 800 // km/h
  };
  
  const hours = km / speeds[mode];
  
  if (hours < 1) {
    return `${Math.round(hours * 60)} min`;
  } else if (hours < 24) {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  } else {
    const days = Math.floor(hours / 24);
    const remainingHours = Math.round(hours % 24);
    return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
  }
}

// Default coordinates for destinations (for demo purposes)
export const destinationCoordinates: Record<string, { lat: number; lng: number }> = {
  'angkor-wat': { lat: 13.4125, lng: 103.8670 },
  'machu-picchu': { lat: -13.1631, lng: -72.5450 },
  'petra': { lat: 30.3285, lng: 35.4444 },
  'colosseum': { lat: 41.8902, lng: 12.4922 },
  'taj-mahal': { lat: 27.1751, lng: 78.0421 },
  'great-wall': { lat: 40.4319, lng: 116.5704 },
  'pyramids-giza': { lat: 29.9792, lng: 31.1342 },
  'stonehenge': { lat: 51.1789, lng: -1.8262 },
  'acropolis': { lat: 37.9715, lng: 23.7267 },
  'chichen-itza': { lat: 20.6843, lng: -88.5678 },
};
