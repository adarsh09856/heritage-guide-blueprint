import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface MapPlace {
  id: string;
  name: string;
  category: string;
  address: string;
  coordinates: { lat: number; lng: number };
  distance?: number;
}

interface SearchPlacesParams {
  lat?: number | null;
  lng?: number | null;
  query?: string;
  radius?: number;
  limit?: number;
}

export function useMapPlaces({ lat, lng, query, radius = 50000, limit = 20 }: SearchPlacesParams) {
  return useQuery({
    queryKey: ['map-places', lat, lng, query, radius, limit],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('search-places', {
        body: { lat, lng, query, radius, limit }
      });

      if (error) throw error;
      return (data?.places || []) as MapPlace[];
    },
    enabled: !!(lat && lng) || !!query,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}

export function useNearbyMapPlaces(lat: number | null, lng: number | null, limit: number = 15) {
  return useMapPlaces({ lat, lng, limit });
}

export function useSearchMapPlaces(query: string, lat?: number | null, lng?: number | null) {
  return useMapPlaces({ lat, lng, query, limit: 15 });
}
