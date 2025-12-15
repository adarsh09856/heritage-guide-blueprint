import { MapPin, Navigation, Clock, Plane, Car, Star } from 'lucide-react';
import { formatDistance, estimateTravelTime } from '@/lib/distance';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface Destination {
  id: string;
  title: string;
  slug: string;
  region: string;
  country: string | null;
  heritage_type: string;
  rating: number | null;
  images: string[] | null;
  distance?: number;
}

interface DestinationSearchCardProps {
  destination: Destination;
  isSelected: boolean;
  onSelect: () => void;
}

export function DestinationSearchCard({ destination, isSelected, onSelect }: DestinationSearchCardProps) {
  const hasDistance = destination.distance !== undefined;
  
  return (
    <div 
      onClick={onSelect}
      className={`group relative bg-card rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${
        isSelected 
          ? 'ring-2 ring-primary shadow-lg scale-[1.02]' 
          : 'hover:shadow-md hover:scale-[1.01]'
      }`}
    >
      <div className="flex gap-4 p-4">
        {/* Image */}
        <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0">
          <img
            src={destination.images?.[0] || 'https://images.unsplash.com/photo-1569060708400-2b0f1d024648?w=200'}
            alt={destination.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {destination.rating && (
            <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-foreground/80 rounded text-xs text-background flex items-center gap-1">
              <Star className="w-3 h-3 fill-gold text-gold" />
              {destination.rating.toFixed(1)}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-serif font-bold text-base truncate">{destination.title}</h3>
          <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
            <MapPin className="w-3 h-3" />
            <span className="truncate">{destination.country || destination.region}</span>
          </div>
          <span className="inline-block px-2 py-0.5 bg-gold/10 text-gold text-xs font-medium rounded-full mt-2">
            {destination.heritage_type}
          </span>

          {/* Distance info */}
          {hasDistance && (
            <div className="flex items-center gap-4 mt-3 text-xs">
              <div className="flex items-center gap-1 text-primary font-medium">
                <Navigation className="w-3 h-3" />
                {formatDistance(destination.distance!)}
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Plane className="w-3 h-3" />
                {estimateTravelTime(destination.distance!, 'flying')}
              </div>
              {destination.distance! < 1000 && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Car className="w-3 h-3" />
                  {estimateTravelTime(destination.distance!, 'driving')}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* View button on selection */}
      {isSelected && (
        <div className="px-4 pb-4">
          <Link to={`/destinations/${destination.slug}`}>
            <Button variant="heritage" size="sm" className="w-full">
              View Destination
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default DestinationSearchCard;
