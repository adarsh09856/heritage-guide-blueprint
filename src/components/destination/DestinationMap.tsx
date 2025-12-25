import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMapboxToken } from '@/hooks/useMapboxToken';
import { useNearbyDestinations } from '@/hooks/useNearbyDestinations';
import { Map, Loader2 } from 'lucide-react';

interface DestinationMapProps {
  coordinates: { lat: number; lng: number };
  title: string;
  destinationId?: string;
  showNearby?: boolean;
}

export const DestinationMap = ({ coordinates, title, destinationId, showNearby = true }: DestinationMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const { data: token, isLoading, error } = useMapboxToken();
  const { nearbyDestinations } = useNearbyDestinations(
    showNearby ? coordinates : null,
    destinationId,
    300,
    6
  );

  useEffect(() => {
    if (!mapContainer.current || !token || map.current) return;

    mapboxgl.accessToken = token;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      center: [coordinates.lng, coordinates.lat],
      zoom: showNearby && nearbyDestinations.length > 0 ? 8 : 12,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({ visualizePitch: true }),
      'top-right'
    );

    // Add marker for the main destination
    const mainMarker = new mapboxgl.Marker({ color: '#c9a86c' })
      .setLngLat([coordinates.lng, coordinates.lat])
      .setPopup(new mapboxgl.Popup().setHTML(`<strong>${title}</strong>`))
      .addTo(map.current);
    
    markersRef.current.push(mainMarker);

    return () => {
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];
      map.current?.remove();
      map.current = null;
    };
  }, [token, coordinates, title, showNearby]);

  // Add nearby destination markers
  useEffect(() => {
    if (!map.current || !showNearby) return;

    // Remove old nearby markers (skip first which is the main marker)
    markersRef.current.slice(1).forEach(m => m.remove());
    markersRef.current = markersRef.current.slice(0, 1);

    // Add new nearby markers
    nearbyDestinations.forEach(dest => {
      const coords = dest.coordinates as unknown as { lat: number; lng: number };
      if (!coords?.lat || !coords?.lng || !map.current) return;

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div style="padding: 4px;">
          <strong style="font-size: 14px;">${dest.title}</strong>
          <p style="font-size: 12px; color: #666; margin: 4px 0 0;">${Math.round(dest.distance)} km away</p>
        </div>
      `);

      const marker = new mapboxgl.Marker({ color: '#2d5a45' })
        .setLngLat([coords.lng, coords.lat])
        .setPopup(popup)
        .addTo(map.current!);
      
      markersRef.current.push(marker);
    });

    // Fit bounds to include all markers if there are nearby destinations
    if (nearbyDestinations.length > 0 && map.current) {
      const bounds = new mapboxgl.LngLatBounds();
      bounds.extend([coordinates.lng, coordinates.lat]);
      
      nearbyDestinations.forEach(dest => {
        const coords = dest.coordinates as unknown as { lat: number; lng: number };
        if (coords?.lat && coords?.lng) {
          bounds.extend([coords.lng, coords.lat]);
        }
      });

      map.current.fitBounds(bounds, { padding: 50, maxZoom: 10 });
    }
  }, [nearbyDestinations, showNearby, coordinates]);

  if (isLoading) {
    return (
      <div className="aspect-square bg-secondary rounded-lg flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !token) {
    return (
      <div className="aspect-square bg-secondary rounded-lg flex items-center justify-center">
        <div className="text-center">
          <Map className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Map unavailable</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div 
        ref={mapContainer} 
        className="aspect-square rounded-lg overflow-hidden"
      />
      {showNearby && nearbyDestinations.length > 0 && (
        <p className="text-xs text-muted-foreground text-center">
          Showing {nearbyDestinations.length} nearby attractions
        </p>
      )}
    </div>
  );
};
