import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMapboxToken } from '@/hooks/useMapboxToken';
import { useDestinations } from '@/hooks/useDestinations';
import { calculateDistance, formatDistance } from '@/lib/distance';
import { Map, Loader2, MapPin, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NearbyDestinationsMapProps {
  userLocation: { lat: number; lng: number } | null;
  onRequestLocation: () => void;
  isLoadingLocation: boolean;
  locationError: string | null;
}

export const NearbyDestinationsMap = ({
  userLocation,
  onRequestLocation,
  isLoadingLocation,
  locationError,
}: NearbyDestinationsMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const { data: token, isLoading: tokenLoading } = useMapboxToken();
  const { data: destinations } = useDestinations({ published: true });

  useEffect(() => {
    if (!mapContainer.current || !token) return;

    // Clean up existing map
    if (map.current) {
      map.current.remove();
      map.current = null;
    }

    mapboxgl.accessToken = token;

    const center: [number, number] = userLocation
      ? [userLocation.lng, userLocation.lat]
      : [20, 20]; // Default world center

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      center,
      zoom: userLocation ? 6 : 2,
    });

    map.current.addControl(
      new mapboxgl.NavigationControl({ visualizePitch: true }),
      'top-right'
    );

    // Add user location marker
    if (userLocation) {
      const userMarker = document.createElement('div');
      userMarker.className = 'user-location-marker';
      userMarker.innerHTML = `
        <div style="
          width: 20px;
          height: 20px;
          background: #3b82f6;
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        "></div>
      `;

      new mapboxgl.Marker({ element: userMarker })
        .setLngLat([userLocation.lng, userLocation.lat])
        .setPopup(new mapboxgl.Popup().setHTML('<strong>Your Location</strong>'))
        .addTo(map.current);
    }

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
    };
  }, [token, userLocation]);

  // Add destination markers
  useEffect(() => {
    if (!map.current || !destinations) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const bounds = new mapboxgl.LngLatBounds();
    let hasValidCoords = false;

    if (userLocation) {
      bounds.extend([userLocation.lng, userLocation.lat]);
      hasValidCoords = true;
    }

    destinations.forEach((dest) => {
      const coords = dest.coordinates as unknown as { lat: number; lng: number } | null;
      if (!coords?.lat || !coords?.lng || !map.current) return;

      bounds.extend([coords.lng, coords.lat]);
      hasValidCoords = true;

      let distanceText = '';
      if (userLocation) {
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          coords.lat,
          coords.lng
        );
        distanceText = `<p style="font-size: 12px; color: #666; margin: 4px 0 0;">${formatDistance(distance)} from you</p>`;
      }

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div style="padding: 4px; max-width: 200px;">
          <strong style="font-size: 14px;">${dest.title}</strong>
          <p style="font-size: 12px; color: #888; margin: 2px 0;">${dest.region}</p>
          ${distanceText}
          <a href="/destination/${dest.slug}" style="font-size: 12px; color: #c9a86c; text-decoration: none;">View details →</a>
        </div>
      `);

      const marker = new mapboxgl.Marker({ color: '#c9a86c' })
        .setLngLat([coords.lng, coords.lat])
        .setPopup(popup)
        .addTo(map.current!);

      markersRef.current.push(marker);
    });

    if (hasValidCoords && map.current) {
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: userLocation ? 8 : 4,
      });
    }
  }, [destinations, userLocation]);

  if (tokenLoading) {
    return (
      <div className="h-[400px] bg-secondary rounded-xl flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!token) {
    return (
      <div className="h-[400px] bg-secondary rounded-xl flex items-center justify-center">
        <div className="text-center">
          <Map className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Map unavailable</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div ref={mapContainer} className="h-[400px] rounded-xl overflow-hidden" />

      {/* Location Request Overlay */}
      {!userLocation && (
        <div className="absolute bottom-4 left-4 right-4 bg-background/95 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-border">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <div className="flex items-center gap-2 mb-1">
                <Navigation className="w-4 h-4 text-primary" />
                <span className="font-medium text-sm">Find nearby attractions</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {locationError || 'Allow location access to see destinations near you'}
              </p>
            </div>
            <Button
              onClick={onRequestLocation}
              disabled={isLoadingLocation}
              size="sm"
              variant="heritage"
            >
              {isLoadingLocation ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <MapPin className="w-4 h-4" />
              )}
              {isLoadingLocation ? 'Finding...' : 'Use My Location'}
            </Button>
          </div>
        </div>
      )}

      {/* User location indicator */}
      {userLocation && (
        <div className="absolute top-4 left-4 bg-background/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-border">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow" />
            <span className="text-muted-foreground">Showing destinations near you</span>
          </div>
        </div>
      )}
    </div>
  );
};
