import { Link } from 'react-router-dom';
import { Play, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TourCardProps {
  tour: {
    id: string;
    title: string;
    description?: string | null;
    thumbnail_url?: string | null;
    thumbnailUrl?: string;
    tour_type?: string | null;
    tourType?: string;
    duration?: string | null;
  };
}

export function TourCard({ tour }: TourCardProps) {
  const tourTypeLabels: Record<string, string> = {
    '360': '360° View',
    'video': 'Video Tour',
    '3d': '3D Experience'
  };

  const thumbnailUrl = tour.thumbnail_url || tour.thumbnailUrl || 'https://images.unsplash.com/photo-1569060708400-2b0f1d024648?w=400';
  const tourType = tour.tour_type || tour.tourType || '360';

  return (
    <div className="group card-heritage overflow-hidden">
      <div className="relative h-48 overflow-hidden">
        <img
          src={thumbnailUrl}
          alt={tour.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-foreground/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button variant="gold" size="lg" className="rounded-full">
            <Play className="w-5 h-5 fill-current" />
            Start Tour
          </Button>
        </div>
        
        {/* Tour Type Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 bg-forest text-sand text-xs font-medium rounded-full">
            {tourTypeLabels[tourType] || tourType}
          </span>
        </div>
        
        {/* Duration */}
        {tour.duration && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 bg-foreground/80 text-sand text-xs rounded-md">
            <Clock className="w-3 h-3" />
            {tour.duration}
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-serif text-lg font-semibold mb-2 line-clamp-1">
          {tour.title}
        </h3>
        <p className="text-muted-foreground text-sm line-clamp-2">
          {tour.description}
        </p>
      </div>
    </div>
  );
}
