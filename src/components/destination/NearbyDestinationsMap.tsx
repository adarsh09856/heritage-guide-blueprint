import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMapboxToken } from '@/hooks/useMapboxToken';
import { useDestinations } from '@/hooks/useDestinations';
import { useNearbyMapPlaces, useSearchMapPlaces, MapPlace } from '@/hooks/useMapPlaces';
import { calculateDistance, formatDistance } from '@/lib/distance';
import { Map, Loader2, MapPin, Navigation, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  
  const { data: token, isLoading: tokenLoading } = useMapboxToken();
  const { data: dbDestinations } = useDestinations({ published: true });
  
  // Fetch nearby places from Mapbox
  const { data: nearbyPlaces, isLoading: placesLoading } = useNearbyMapPlaces(
    userLocation?.lat || null,
    userLocation?.lng || null,
    15
  );
  
  // Search places
  const { data: searchResults, isLoading: searchLoading } = useSearchMapPlaces(
    activeSearch,
    userLocation?.lat,
    userLocation?.lng
  );

  const handleSearch = () => {
    setActiveSearch(searchQuery);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setActiveSearch('');
  };

  useEffect(() => {
    if (!mapContainer.current || !token) return;

    if (map.current) {
      map.current.remove();
      map.current = null;
    }

    mapboxgl.accessToken = token;

    const center: [number, number] = userLocation
      ? [userLocation.lng, userLocation.lat]
      : [20, 20];

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      center,
      zoom: userLocation ? 10 : 2,
    });

    map.current.addControl(
      new mapboxgl.NavigationControl({ visualizePitch: true }),
      'top-right'
    );

    // Add user location marker
    if (userLocation) {
      const userMarker = document.createElement('div');
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

  // Add markers for all places
  useEffect(() => {
    if (!map.current) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const bounds = new mapboxgl.LngLatBounds();
    let hasValidCoords = false;

    if (userLocation) {
      bounds.extend([userLocation.lng, userLocation.lat]);
      hasValidCoords = true;
    }

    // Determine which places to show
    const placesToShow: MapPlace[] = activeSearch && searchResults 
      ? searchResults 
      : nearbyPlaces || [];

    // Add markers for map places (from Mapbox API)
    placesToShow.forEach((place) => {
      if (!place.coordinates?.lat || !place.coordinates?.lng || !map.current) return;

      bounds.extend([place.coordinates.lng, place.coordinates.lat]);
      hasValidCoords = true;

      let distanceText = '';
      if (userLocation && place.distance) {
        distanceText = `<p style="font-size: 12px; color: #666; margin: 4px 0 0;">${formatDistance(place.distance)} from you</p>`;
      }

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div style="padding: 4px; max-width: 220px;">
          <strong style="font-size: 14px;">${place.name}</strong>
          <p style="font-size: 11px; color: #c9a86c; margin: 2px 0;">${place.category}</p>
          <p style="font-size: 11px; color: #888; margin: 2px 0;">${place.address}</p>
          ${distanceText}
        </div>
      `);

      const marker = new mapboxgl.Marker({ color: '#2d5a45' })
        .setLngLat([place.coordinates.lng, place.coordinates.lat])
        .setPopup(popup)
        .addTo(map.current!);

      markersRef.current.push(marker);
    });

    // Add markers for uploaded destinations (different color)
    dbDestinations?.forEach((dest) => {
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
          <p style="font-size: 11px; color: #c9a86c; margin: 2px 0;">Featured Destination</p>
          <p style="font-size: 12px; color: #888; margin: 2px 0;">${dest.region}</p>
          ${distanceText}
          <a href="/destination/${dest.slug}" style="font-size: 12px; color: #c9a86c; text-decoration: none; font-weight: 500;">View details →</a>
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
        maxZoom: userLocation ? 12 : 4,
      });
    }
  }, [dbDestinations, nearbyPlaces, searchResults, activeSearch, userLocation]);

  if (tokenLoading) {
    return (
      <div className="h-[450px] bg-secondary rounded-xl flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!token) {
    return (
      <div className="h-[450px] bg-secondary rounded-xl flex items-center justify-center">
        <div className="text-center">
          <Map className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Map unavailable</span>
        </div>
      </div>
    );
  }

  const isLoading = placesLoading || searchLoading;
  const totalPlaces = (activeSearch ? searchResults?.length : nearbyPlaces?.length) || 0;

  return (
    <div className="relative">
      {/* Search Bar */}
      <div className="absolute top-4 left-4 right-16 z-10 flex gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search museums, temples, monuments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-10 pr-10 bg-background/95 backdrop-blur-sm shadow-lg"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <Button onClick={handleSearch} size="sm" variant="heritage" className="shadow-lg">
          Search
        </Button>
      </div>

      <div ref={mapContainer} className="h-[450px] rounded-xl overflow-hidden" />

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute top-16 left-4 bg-background/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-border">
          <div className="flex items-center gap-2 text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Finding places...</span>
          </div>
        </div>
      )}

      {/* Results count */}
      {!isLoading && (totalPlaces > 0 || dbDestinations?.length) && (
        <div className="absolute top-16 left-4 bg-background/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-border">
          <div className="flex items-center gap-2 text-sm flex-wrap">
            {activeSearch && (
              <Badge variant="secondary" className="text-xs">
                "{activeSearch}"
              </Badge>
            )}
            <span className="text-muted-foreground">
              {totalPlaces} places from map
              {dbDestinations?.length ? ` + ${dbDestinations.length} featured` : ''}
            </span>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-background/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-border">
        <div className="flex flex-col gap-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ background: '#c9a86c' }} />
            <span>Featured destinations</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ background: '#2d5a45' }} />
            <span>Nearby attractions</span>
          </div>
          {userLocation && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500 border-2 border-white" />
              <span>Your location</span>
            </div>
          )}
        </div>
      </div>

      {/* Location Request Overlay */}
      {!userLocation && (
        <div className="absolute bottom-4 left-4 right-4 max-w-md bg-background/95 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-border">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <div className="flex items-center gap-2 mb-1">
                <Navigation className="w-4 h-4 text-primary" />
                <span className="font-medium text-sm">Discover nearby attractions</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {locationError || 'Allow location to find tourism spots near you'}
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
    </div>
  );
};
