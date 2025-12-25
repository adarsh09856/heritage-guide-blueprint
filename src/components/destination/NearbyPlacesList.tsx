import { MapPlace } from '@/hooks/useMapPlaces';
import { formatDistance, estimateTravelTime } from '@/lib/distance';
import { MapPin, Clock, Navigation, ExternalLink, Loader2, Building2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface NearbyPlacesListProps {
  places: MapPlace[];
  isLoading: boolean;
  userLocation: { lat: number; lng: number } | null;
}

export const NearbyPlacesList = ({ places, isLoading, userLocation }: NearbyPlacesListProps) => {
  const openDirections = (place: MapPlace) => {
    const destination = `${place.coordinates.lat},${place.coordinates.lng}`;
    const origin = userLocation ? `${userLocation.lat},${userLocation.lng}` : '';
    const url = origin 
      ? `https://www.google.com/maps/dir/${origin}/${destination}`
      : `https://www.google.com/maps/search/?api=1&query=${destination}`;
    window.open(url, '_blank');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Finding nearby attractions...</span>
      </div>
    );
  }

  if (!places.length) {
    return (
      <div className="text-center py-12">
        <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-serif text-lg font-semibold mb-2">No nearby attractions found</h3>
        <p className="text-muted-foreground text-sm">
          Enable location access or search for a specific area to discover attractions
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {places.map((place) => (
        <div 
          key={place.id} 
          className="group card-heritage p-4 hover:shadow-lg transition-shadow"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-base group-hover:text-primary transition-colors line-clamp-1">
                {place.name}
              </h4>
              <Badge variant="outline" className="mt-1 text-xs">
                {place.category}
              </Badge>
            </div>
            {place.distance !== undefined && (
              <Badge className="bg-primary/10 text-primary shrink-0 ml-2">
                {formatDistance(place.distance)}
              </Badge>
            )}
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="line-clamp-2">{place.address}</span>
            </div>
            
            {place.distance !== undefined && (
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{estimateTravelTime(place.distance, 'driving')} by car</span>
                </div>
                <div className="flex items-center gap-1">
                  <Navigation className="w-3 h-3" />
                  <span>{estimateTravelTime(place.distance, 'walking')} walk</span>
                </div>
              </div>
            )}
          </div>

          <Button 
            variant="outline" 
            size="sm" 
            className="w-full gap-2"
            onClick={() => openDirections(place)}
          >
            <Navigation className="w-4 h-4" />
            Get Directions
            <ExternalLink className="w-3 h-3" />
          </Button>
        </div>
      ))}
    </div>
  );
};
