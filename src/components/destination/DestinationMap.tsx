import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMapboxToken } from '@/hooks/useMapboxToken';
import { Map, Loader2 } from 'lucide-react';

interface DestinationMapProps {
  coordinates: { lat: number; lng: number };
  title: string;
}

export const DestinationMap = ({ coordinates, title }: DestinationMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const { data: token, isLoading, error } = useMapboxToken();

  useEffect(() => {
    if (!mapContainer.current || !token || map.current) return;

    mapboxgl.accessToken = token;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      center: [coordinates.lng, coordinates.lat],
      zoom: 12,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({ visualizePitch: true }),
      'top-right'
    );

    // Add marker for the destination
    new mapboxgl.Marker({ color: '#c9a86c' })
      .setLngLat([coordinates.lng, coordinates.lat])
      .setPopup(new mapboxgl.Popup().setHTML(`<strong>${title}</strong>`))
      .addTo(map.current);

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [token, coordinates, title]);

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
    <div 
      ref={mapContainer} 
      className="aspect-square rounded-lg overflow-hidden"
    />
  );
};
