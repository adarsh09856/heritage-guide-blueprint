import { Link } from 'react-router-dom';
import { useNearbyDestinations } from '@/hooks/useNearbyDestinations';
import { formatDistance, estimateTravelTime } from '@/lib/distance';
import { MapPin, Clock, Navigation, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface NearbyDestinationsProps {
  currentCoordinates: { lat: number; lng: number } | null;
  currentId?: string;
}

export const NearbyDestinations = ({ currentCoordinates, currentId }: NearbyDestinationsProps) => {
  const { nearbyDestinations, isLoading } = useNearbyDestinations(
    currentCoordinates,
    currentId,
    500, // within 500km
    4    // max 4 results
  );

  if (isLoading || nearbyDestinations.length === 0) return null;

  return (
    <div className="card-heritage p-6">
      <div className="flex items-center gap-2 mb-4">
        <Navigation className="w-5 h-5 text-primary" />
        <h3 className="font-serif text-lg font-semibold">Nearby Attractions</h3>
      </div>
      
      <div className="space-y-3">
        {nearbyDestinations.map((dest) => (
          <Link 
            key={dest.id} 
            to={`/destination/${dest.slug}`}
            className="group block p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
          >
            <div className="flex gap-3">
              {dest.images?.[0] && (
                <img 
                  src={dest.images[0]} 
                  alt={dest.title}
                  className="w-16 h-16 rounded-md object-cover shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm group-hover:text-primary transition-colors truncate">
                  {dest.title}
                </h4>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate">{dest.region}</span>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <Badge variant="outline" className="text-xs px-2 py-0">
                    {formatDistance(dest.distance)}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {estimateTravelTime(dest.distance)}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground self-center opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
