import { useState } from 'react';
import { useUserLocation } from '@/hooks/useUserLocation';
import { useNearbyMapPlaces, MapPlace } from '@/hooks/useMapPlaces';
import { NearbyPlacesList } from '@/components/destination/NearbyPlacesList';
import { formatDistance } from '@/lib/distance';
import { MapPin, Navigation, Search, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export const AdminMapExplorer = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const { 
    location: userLocation, 
    error: locationError, 
    isLoading: isLoadingLocation, 
    requestLocation 
  } = useUserLocation(true);
  
  const { data: nearbyPlaces = [], isLoading: placesLoading, refetch } = useNearbyMapPlaces(
    userLocation?.lat || null,
    userLocation?.lng || null,
    30
  );

  const filteredPlaces = searchQuery 
    ? nearbyPlaces.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.address.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : nearbyPlaces;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold">Map Explorer</h1>
          <p className="text-muted-foreground">Discover nearby tourism attractions from map data</p>
        </div>
        <div className="flex items-center gap-2">
          {userLocation ? (
            <Badge variant="outline" className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              Location active
            </Badge>
          ) : (
            <Button 
              variant="heritage" 
              size="sm" 
              onClick={requestLocation}
              disabled={isLoadingLocation}
            >
              {isLoadingLocation ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <MapPin className="w-4 h-4" />
              )}
              Enable Location
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => refetch()}
            disabled={placesLoading}
          >
            <RefreshCw className={`w-4 h-4 ${placesLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {locationError && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-lg text-sm">
          {locationError}. Please enable location access to discover nearby places.
        </div>
      )}

      {userLocation && (
        <div className="p-4 bg-secondary rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Navigation className="w-5 h-5 text-primary" />
              <span className="font-medium">Your Location</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {userLocation.lat.toFixed(4)}°N, {userLocation.lng.toFixed(4)}°E
            </span>
          </div>
        </div>
      )}

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Filter places..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <span className="text-sm text-muted-foreground">
          {filteredPlaces.length} places found
        </span>
      </div>

      <NearbyPlacesList 
        places={filteredPlaces} 
        isLoading={placesLoading} 
        userLocation={userLocation}
      />
    </div>
  );
};
