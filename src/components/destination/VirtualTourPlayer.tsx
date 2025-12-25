import { useState } from 'react';
import { Play, X, ExternalLink, Loader2, Maximize2 } from 'lucide-react';
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

// Check if URL is a direct video file
const isDirectVideoUrl = (url: string): boolean => {
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
  const lowerUrl = url.toLowerCase();
  return videoExtensions.some(ext => lowerUrl.includes(ext)) || 
         url.includes('supabase') && url.includes('/videos/');
};

// Check if URL is an embeddable service
const isEmbeddableUrl = (url: string): boolean => {
  const embeddableServices = ['youtube.com', 'youtu.be', 'vimeo.com', 'matterport.com', 'kuula.co', 'momento360'];
  return embeddableServices.some(service => url.toLowerCase().includes(service));
};

// Convert YouTube URL to embed URL
const getEmbedUrl = (url: string): string => {
  // YouTube
  if (url.includes('youtube.com/watch')) {
    const videoId = new URL(url).searchParams.get('v');
    return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  }
  if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1]?.split('?')[0];
    return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  }
  // Vimeo
  if (url.includes('vimeo.com/')) {
    const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
    return `https://player.vimeo.com/video/${videoId}?autoplay=1`;
  }
  return url;
};

export const VirtualTourPlayer = ({ tour, fallbackImage }: VirtualTourPlayerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const thumbnailUrl = tour?.thumbnail_url || fallbackImage || 'https://images.unsplash.com/photo-1569060708400-2b0f1d024648?w=800';
  const hasTourUrl = tour?.tour_url && tour.tour_url.trim() !== '';
  const tourUrl = tour?.tour_url || '';
  
  const isVideo = isDirectVideoUrl(tourUrl);
  const isEmbed = isEmbeddableUrl(tourUrl);

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
              ? `Click to explore${tour?.duration ? ` (${tour.duration})` : ''}`
              : 'Virtual tour coming soon'
            }
          </p>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-5xl w-[95vw] h-[85vh] p-0 flex flex-col">
          <DialogHeader className="p-4 pb-0 flex flex-row items-center justify-between shrink-0">
            <DialogTitle className="font-serif">{tour?.title || 'Virtual Tour'}</DialogTitle>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={handleOpenExternal} title="Open in new tab">
                <ExternalLink className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>
          <div className="flex-1 relative w-full min-h-0 p-4 pt-2">
            {isLoading && (
              <div className="absolute inset-4 flex items-center justify-center bg-secondary rounded-lg">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            )}
            
            {/* Direct Video Player */}
            {isVideo && tour?.tour_url && (
              <video
                src={tour.tour_url}
                className="w-full h-full rounded-lg bg-black"
                controls
                autoPlay
                onLoadedData={() => setIsLoading(false)}
                onError={() => setIsLoading(false)}
              >
                Your browser does not support the video tag.
              </video>
            )}
            
            {/* Embed iframe for YouTube/Vimeo/Matterport */}
            {isEmbed && tour?.tour_url && (
              <iframe
                src={getEmbedUrl(tour.tour_url)}
                className="w-full h-full border-0 rounded-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; xr-spatial-tracking; fullscreen"
                allowFullScreen
                onLoad={() => setIsLoading(false)}
              />
            )}
            
            {/* Fallback for other URLs */}
            {!isVideo && !isEmbed && tour?.tour_url && (
              <div className="w-full h-full flex flex-col items-center justify-center bg-secondary rounded-lg">
                <Maximize2 className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">This content opens in a new window</p>
                <Button variant="heritage" onClick={handleOpenExternal}>
                  <ExternalLink className="w-4 h-4" />
                  Open Tour
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
