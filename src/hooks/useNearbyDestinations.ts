import { useMemo } from 'react';
import { useDestinations } from './useDestinations';
import { calculateDistance } from '@/lib/distance';

interface Coordinates {
  lat: number;
  lng: number;
}

export function useNearbyDestinations(
  currentCoordinates: Coordinates | null,
  currentId: string | undefined,
  maxDistance: number = 500, // km
  limit: number = 5
) {
  const { data: allDestinations, isLoading } = useDestinations({ published: true });

  const nearbyDestinations = useMemo(() => {
    if (!currentCoordinates || !allDestinations) return [];

    return allDestinations
      .filter(dest => {
        // Exclude current destination
        if (dest.id === currentId) return false;
        
        // Must have coordinates
        const coords = dest.coordinates as unknown as Coordinates | null;
        if (!coords?.lat || !coords?.lng) return false;

        // Calculate distance
        const distance = calculateDistance(
          currentCoordinates.lat,
          currentCoordinates.lng,
          coords.lat,
          coords.lng
        );

        return distance <= maxDistance;
      })
      .map(dest => {
        const coords = dest.coordinates as unknown as Coordinates;
        const distance = calculateDistance(
          currentCoordinates.lat,
          currentCoordinates.lng,
          coords.lat,
          coords.lng
        );
        return { ...dest, distance };
      })
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit);
  }, [allDestinations, currentCoordinates, currentId, maxDistance, limit]);

  return { nearbyDestinations, isLoading };
}
