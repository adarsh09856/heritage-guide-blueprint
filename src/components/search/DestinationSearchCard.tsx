import { MapPin, Navigation, Plane, Car, Star, ChevronRight, Compass, ExternalLink } from 'lucide-react';
import { formatDistance, estimateTravelTime } from '@/lib/distance';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

interface Coordinates {
  lat: number;
  lng: number;
}

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
  description?: string | null;
  coordinates?: Coordinates | null;
}

interface DestinationSearchCardProps {
  destination: Destination;
  isSelected: boolean;
  onSelect: () => void;
  userLocation?: Coordinates | null;
}

export function DestinationSearchCard({ destination, isSelected, onSelect, userLocation }: DestinationSearchCardProps) {
  const hasDistance = destination.distance !== undefined;
  
  const openDirections = (e: React.MouseEvent, mode: 'driving' | 'walking') => {
    e.stopPropagation();
    if (!destination.coordinates) return;
    
    const origin = userLocation 
      ? `${userLocation.lat},${userLocation.lng}` 
      : '';
    const dest = `${destination.coordinates.lat},${destination.coordinates.lng}`;
    const travelMode = mode === 'driving' ? 'driving' : 'walking';
    
    const url = origin
      ? `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}&travelmode=${travelMode}`
      : `https://www.google.com/maps/dir/?api=1&destination=${dest}&travelmode=${travelMode}`;
    
    window.open(url, '_blank');
  };
  
  return (
    <div 
      onClick={onSelect}
      className={`group relative bg-card border rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${
        isSelected 
          ? 'ring-2 ring-primary shadow-xl border-primary/50' 
          : 'hover:shadow-lg hover:border-primary/30'
      }`}
    >
      <div className="flex gap-4 p-4">
        {/* Image */}
        <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-xl overflow-hidden shrink-0">
          <img
            src={destination.images?.[0] || 'https://images.unsplash.com/photo-1569060708400-2b0f1d024648?w=200'}
            alt={destination.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          
          {destination.rating && (
            <div className="absolute bottom-2 left-2 px-2 py-1 bg-background/90 backdrop-blur-sm rounded-lg text-xs font-medium flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-gold text-gold" />
              {destination.rating.toFixed(1)}
            </div>
          )}
          
          {/* Distance badge on image */}
          {hasDistance && (
            <div className="absolute top-2 right-2 px-2 py-1 bg-primary text-primary-foreground rounded-lg text-xs font-bold">
              {Math.round(destination.distance!)} km
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
          <div>
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-serif font-bold text-lg leading-tight line-clamp-2">{destination.title}</h3>
              <ChevronRight className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform ${isSelected ? 'rotate-90 text-primary' : 'group-hover:translate-x-1'}`} />
            </div>
            
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1 text-muted-foreground text-sm">
                <MapPin className="w-4 h-4 text-primary" />
                <span>{destination.country || destination.region}</span>
              </div>
              <span className="text-muted-foreground/50">•</span>
              <Badge variant="secondary" className="text-xs font-medium">
                {destination.heritage_type}
              </Badge>
            </div>
          </div>

          {/* Travel info */}
          {hasDistance && (
            <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-border/50">
              <div className="flex items-center gap-1.5 text-sm">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <Compass className="w-3.5 h-3.5 text-primary" />
                </div>
                <span className="font-medium text-foreground">{formatDistance(destination.distance!)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Plane className="w-4 h-4" />
                <span>{estimateTravelTime(destination.distance!, 'flying')}</span>
              </div>
              {destination.distance! < 1500 && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Car className="w-4 h-4" />
                  <span>{estimateTravelTime(destination.distance!, 'driving')}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Expanded view on selection */}
      {isSelected && (
        <div className="px-4 pb-4 pt-0 border-t border-border/50 bg-muted/30">
          <div className="flex flex-col gap-3 pt-3">
            <p className="text-sm text-muted-foreground line-clamp-2">
              {destination.description || 'Discover this amazing heritage destination'}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <Link to={`/destinations/${destination.slug}`} className="flex-1">
                <Button variant="default" size="sm" className="w-full">
                  Explore Site
                </Button>
              </Link>
              {destination.coordinates && (
                <>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={(e) => openDirections(e, 'driving')}
                    className="gap-1.5"
                  >
                    <Car className="w-4 h-4" />
                    <span className="hidden sm:inline">Drive</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={(e) => openDirections(e, 'walking')}
                    className="gap-1.5"
                  >
                    <Navigation className="w-4 h-4" />
                    <span className="hidden sm:inline">Walk</span>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DestinationSearchCard;