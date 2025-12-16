import { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMapboxToken } from '@/hooks/useMapboxToken';
import { Loader2 } from 'lucide-react';

interface Destination {
  id: string;
  title: string;
  slug: string;
  region: string;
  country: string | null;
  coordinates: { lat: number; lng: number } | null;
  images: string[] | null;
  distance?: number;
}

interface SearchMapProps {
  destinations: Destination[];
  userLocation: { lat: number; lng: number } | null;
  selectedDestination: Destination | null;
  onSelectDestination: (destination: Destination) => void;
}

export function SearchMap({ 
  destinations, 
  userLocation, 
  selectedDestination,
  onSelectDestination 
}: SearchMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const userMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const lineRef = useRef<string | null>(null);
  
  const { data: mapboxToken, isLoading: isLoadingToken, error: tokenError } = useMapboxToken();
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken || map.current) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      center: userLocation ? [userLocation.lng, userLocation.lat] : [0, 20],
      zoom: userLocation ? 4 : 2,
      pitch: 30,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [mapboxToken]);

  // Update user location marker
  useEffect(() => {
    if (!map.current || !mapLoaded || !userLocation) return;

    // Remove existing user marker
    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
    }

    // Create user location marker with pulsing effect
    const el = document.createElement('div');
    el.className = 'user-location-marker';
    el.innerHTML = `
      <div class="relative">
        <div class="absolute w-8 h-8 bg-blue-500/30 rounded-full animate-ping"></div>
        <div class="relative w-8 h-8 bg-blue-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
          <div class="w-2 h-2 bg-white rounded-full"></div>
        </div>
      </div>
    `;

    userMarkerRef.current = new mapboxgl.Marker({ element: el })
      .setLngLat([userLocation.lng, userLocation.lat])
      .setPopup(new mapboxgl.Popup().setHTML('<strong>Your Location</strong>'))
      .addTo(map.current);

    // Center map on user location
    map.current.flyTo({
      center: [userLocation.lng, userLocation.lat],
      zoom: 4,
      duration: 1500
    });
  }, [userLocation, mapLoaded]);

  // Update destination markers
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Remove existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers
    destinations.forEach((dest) => {
      if (!dest.coordinates) return;

      const el = document.createElement('div');
      el.className = 'destination-marker cursor-pointer';
      el.innerHTML = `
        <div class="w-10 h-10 bg-amber-500 rounded-full border-3 border-white shadow-lg flex items-center justify-center transform transition-transform hover:scale-110">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
      `;

      // Create popup with view button and directions
      const directionsUrl = userLocation
        ? `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${dest.coordinates.lat},${dest.coordinates.lng}&travelmode=driving`
        : `https://www.google.com/maps/dir/?api=1&destination=${dest.coordinates.lat},${dest.coordinates.lng}&travelmode=driving`;

      const popupContent = `
        <div class="p-3 min-w-[220px]">
          <img src="${dest.images?.[0] || 'https://images.unsplash.com/photo-1569060708400-2b0f1d024648?w=200'}" alt="${dest.title}" class="w-full h-28 object-cover rounded-lg mb-3" />
          <h3 class="font-bold text-base mb-1">${dest.title}</h3>
          <p class="text-xs text-gray-600 mb-2">${dest.country || dest.region}</p>
          ${dest.distance !== undefined ? `<p class="text-xs text-blue-600 font-medium mb-3">${Math.round(dest.distance)} km away</p>` : ''}
          <div class="flex gap-2">
            <a href="/destinations/${dest.slug}" class="flex-1 px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium rounded-lg text-center transition-colors">
              View Details
            </a>
            <a href="${directionsUrl}" target="_blank" class="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded-lg text-center transition-colors flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </a>
          </div>
        </div>
      `;

      const popup = new mapboxgl.Popup({ offset: 25, maxWidth: '280px' }).setHTML(popupContent);

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([dest.coordinates.lng, dest.coordinates.lat])
        .setPopup(popup)
        .addTo(map.current!);

      el.addEventListener('click', () => {
        onSelectDestination(dest);
      });

      markersRef.current.push(marker);
    });
  }, [destinations, mapLoaded, onSelectDestination]);

  // Draw line to selected destination
  useEffect(() => {
    if (!map.current || !mapLoaded || !userLocation) return;

    // Remove existing line
    if (lineRef.current && map.current.getSource(lineRef.current)) {
      map.current.removeLayer(lineRef.current);
      map.current.removeSource(lineRef.current);
    }

    if (!selectedDestination?.coordinates) return;

    const lineId = `route-${Date.now()}`;
    lineRef.current = lineId;

    // Add curved line source and layer
    const coords = [
      [userLocation.lng, userLocation.lat],
      [selectedDestination.coordinates.lng, selectedDestination.coordinates.lat]
    ];

    map.current.addSource(lineId, {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: coords
        }
      }
    });

    map.current.addLayer({
      id: lineId,
      type: 'line',
      source: lineId,
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#3b82f6',
        'line-width': 3,
        'line-dasharray': [2, 2]
      }
    });

    // Fit bounds to show both points
    const bounds = new mapboxgl.LngLatBounds()
      .extend([userLocation.lng, userLocation.lat])
      .extend([selectedDestination.coordinates.lng, selectedDestination.coordinates.lat]);

    map.current.fitBounds(bounds, {
      padding: { top: 100, bottom: 100, left: 50, right: 50 },
      duration: 1000
    });
  }, [selectedDestination, userLocation, mapLoaded]);

  if (isLoadingToken) {
    return (
      <div className="w-full h-full bg-secondary rounded-xl flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (tokenError) {
    return (
      <div className="w-full h-full bg-secondary rounded-xl flex items-center justify-center p-8 text-center">
        <div>
          <p className="text-destructive font-medium">Failed to load map</p>
          <p className="text-muted-foreground text-sm mt-1">Please check your Mapbox configuration</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
      {!mapLoaded && (
        <div className="absolute inset-0 bg-secondary flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}
    </div>
  );
}

export default SearchMap;
