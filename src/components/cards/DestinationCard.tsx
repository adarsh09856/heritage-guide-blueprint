import { Link } from 'react-router-dom';
import { Tables } from '@/integrations/supabase/types';
import { MapPin, Star, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type DbDestination = Tables<'destinations'>;

interface DestinationCardProps {
  destination: DbDestination;
  featured?: boolean;
}

export function DestinationCard({ destination, featured = false }: DestinationCardProps) {
  const imageUrl = destination.images?.[0] || 'https://images.unsplash.com/photo-1569060708400-2b0f1d024648?w=800';
  
  return (
    <Link 
      to={`/destinations/${destination.slug || destination.id}`}
      className={`group card-heritage block ${featured ? 'md:col-span-2 md:row-span-2' : ''}`}
    >
      <div className="relative overflow-hidden">
        <img
          src={imageUrl}
          alt={destination.title}
          className={`w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            featured ? 'h-80 md:h-[500px]' : 'h-48 md:h-56'
          }`}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          <Badge variant="secondary" className="bg-sand/90 text-foreground">
            {destination.heritage_type}
          </Badge>
          {destination.is_featured && (
            <Badge className="bg-gold text-foreground">
              Featured
            </Badge>
          )}
        </div>

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
          <div className="flex items-center gap-2 text-sand/80 text-sm mb-2">
            <MapPin className="w-4 h-4" />
            <span>{destination.country}, {destination.region}</span>
          </div>
          
          <h3 className={`font-serif text-sand font-semibold leading-tight mb-2 ${
            featured ? 'text-2xl md:text-3xl' : 'text-lg md:text-xl'
          }`}>
            {destination.title}
          </h3>
          
          {featured && destination.description && (
            <p className="text-sand/80 text-sm md:text-base line-clamp-2 mb-4 hidden md:block">
              {destination.description}
            </p>
          )}
          
          <div className="flex items-center gap-4 text-sand/70 text-sm">
            {destination.rating && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-gold text-gold" />
                <span className="text-sand">{destination.rating}</span>
                <span>({destination.review_count?.toLocaleString() || 0})</span>
              </div>
            )}
            {destination.era && (
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{destination.era}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
