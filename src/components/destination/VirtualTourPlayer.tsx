import { useState } from 'react';
import { Play, X, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface VirtualTour {
  id: string;
  title: string;
  description?: string | null;
  thumbnail_url?: string | null;
  tour_url?: string | null;
  tour_type?: string | null;
  duration?: string | null;
}

interface VirtualTourPlayerProps {
  tour: VirtualTour | null;
  fallbackImage?: string;
}

export const VirtualTourPlayer = ({ tour, fallbackImage }: VirtualTourPlayerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const thumbnailUrl = tour?.thumbnail_url || fallbackImage || 'https://images.unsplash.com/photo-1569060708400-2b0f1d024648?w=800';
  const hasTourUrl = tour?.tour_url && tour.tour_url.trim() !== '';

  const handlePlayClick = () => {
    if (hasTourUrl) {
      setIsOpen(true);
      setIsLoading(true);
    }
  };

  const handleOpenExternal = () => {
    if (tour?.tour_url) {
      window.open(tour.tour_url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <>
      <div 
        className="aspect-video bg-gradient-to-br from-secondary to-muted rounded-xl flex items-center justify-center relative overflow-hidden cursor-pointer group"
        onClick={handlePlayClick}
      >
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105" 
          style={{ backgroundImage: `url(${thumbnailUrl})` }} 
        />
        <div className="absolute inset-0 bg-foreground/40 group-hover:bg-foreground/30 transition-colors" />
        
        <div className="relative z-10 text-center">
          <div className={`w-20 h-20 rounded-full bg-gold/90 flex items-center justify-center mx-auto mb-4 shadow-heritage-lg transition-transform ${hasTourUrl ? 'group-hover:scale-110' : 'opacity-50'}`}>
            <Play className="w-8 h-8 text-foreground fill-current ml-1" />
          </div>
          <h3 className="font-serif text-xl font-semibold mb-2 text-sand">
            {tour?.tour_type === '360' ? '360° Virtual Experience' : 
             tour?.tour_type === 'video' ? 'Video Tour' :
             tour?.tour_type === '3d' ? '3D Model Experience' : 
             '360° Virtual Experience'}
          </h3>
          <p className="text-sand/80">
            {hasTourUrl 
              ? `Click to explore this heritage site${tour?.duration ? ` (${tour.duration})` : ''}`
              : 'Virtual tour coming soon'
            }
          </p>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-5xl w-[95vw] h-[85vh] p-0">
          <DialogHeader className="p-4 pb-0 flex flex-row items-center justify-between">
            <DialogTitle className="font-serif">{tour?.title || 'Virtual Tour'}</DialogTitle>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={handleOpenExternal}>
                <ExternalLink className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>
          <div className="flex-1 relative w-full h-full min-h-[500px]">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-secondary">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            )}
            {tour?.tour_url && (
              <iframe
                src={tour.tour_url}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; xr-spatial-tracking"
                allowFullScreen
                onLoad={() => setIsLoading(false)}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
