import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useDestinationBySlug } from '@/hooks/useDestinations';
import { useToggleBookmark, useIsBookmarked } from '@/hooks/useBookmarks';
import { useVirtualTours } from '@/hooks/useVirtualTours';
import { useAuth } from '@/contexts/AuthContext';
import { sampleDestinations } from '@/data/sampleData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DestinationMap } from '@/components/destination/DestinationMap';
import { VirtualTourPlayer } from '@/components/destination/VirtualTourPlayer';
import { NearbyDestinations } from '@/components/destination/NearbyDestinations';
import { 
  MapPin, Star, Calendar, Clock, Globe, Play, ArrowLeft, 
  Camera, Map, Bookmark, Share2, ChevronRight, Loader2, Heart
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const DestinationDetail = () => {
  const { id: slug } = useParams(); // Route param is actually slug
  const { user } = useAuth();
  const { data: dbDestination, isLoading } = useDestinationBySlug(slug || '');
  const { data: virtualTours = [] } = useVirtualTours({ published: true });
  
  // Find linked virtual tour for this destination
  const destinationTour = dbDestination?.id 
    ? virtualTours.find(tour => tour.destination_id === dbDestination.id)
    : null;
  
  // Use actual destination ID for bookmarks
  const destinationId = dbDestination?.id;
  const { data: isBookmarked } = useIsBookmarked(destinationId || '');
  const toggleBookmark = useToggleBookmark();

  // Fall back to sample data if not in DB
  const sampleDest = sampleDestinations.find(d => d.slug === slug || d.id === slug);
  
  const destination = dbDestination || (sampleDest ? {
    id: sampleDest.id,
    title: sampleDest.title,
    slug: sampleDest.slug,
    region: sampleDest.region,
    country: sampleDest.country || '',
    heritage_type: sampleDest.heritageType,
    era: sampleDest.era || null,
    description: sampleDest.description || null,
    history: sampleDest.history || null,
    images: sampleDest.images,
    coordinates: sampleDest.coordinates || null,
    features: sampleDest.features,
    best_time_to_visit: sampleDest.bestTimeToVisit || null,
    rating: sampleDest.rating || null,
    review_count: sampleDest.reviewCount || null,
    is_featured: sampleDest.isFeatured || false,
    is_published: true,
    created_at: null,
    updated_at: null,
    created_by: null
  } : null);

  const handleBookmark = async () => {
    if (!user) {
      toast({ title: 'Please sign in to save destinations', variant: 'destructive' });
      return;
    }
    if (!destination?.id) return;
    
    try {
      const result = await toggleBookmark.mutateAsync(destination.id);
      toast({ title: result.action === 'added' ? 'Destination saved!' : 'Removed from saved' });
    } catch {
      toast({ title: 'Failed to update bookmark', variant: 'destructive' });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-2xl font-bold mb-4">Destination not found</h1>
          <Link to="/destinations">
            <Button variant="heritage">
              <ArrowLeft className="w-4 h-4" />
              Back to Destinations
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const imageUrl = destination.images?.[0] || 'https://images.unsplash.com/photo-1569060708400-2b0f1d024648?w=1200';
  const coords = destination.coordinates as { lat: number; lng: number } | null;

  return (
    <>
      <Helmet>
        <title>{destination.title} | Heritage Guide</title>
        <meta name="description" content={destination.description || ''} />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Navbar />
        
        {/* Hero Image */}
        <section className="relative h-[60vh] min-h-[400px]">
          <img src={imageUrl} alt={destination.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
          
          <Link to="/destinations" className="absolute top-24 left-4 md:left-8 flex items-center gap-2 text-sand hover:text-gold transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Destinations</span>
          </Link>

          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
            <div className="container mx-auto">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary" className="bg-sand/90 text-foreground">{destination.heritage_type}</Badge>
                <Badge className="bg-forest text-sand">UNESCO Site</Badge>
              </div>
              
              <h1 className="font-serif text-3xl md:text-5xl font-bold text-sand mb-4">{destination.title}</h1>
              
              <div className="flex flex-wrap items-center gap-6 text-sand/80">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>{destination.country}, {destination.region}</span>
                </div>
                {destination.era && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span>{destination.era}</span>
                  </div>
                )}
                {destination.rating && (
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 fill-gold text-gold" />
                    <span className="text-sand">{destination.rating}</span>
                    <span>({destination.review_count?.toLocaleString()} reviews)</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Action Bar */}
        <section className="sticky top-16 md:top-20 bg-background/95 backdrop-blur-md border-b border-border z-40">
          <div className="container mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {destination.features?.slice(0, 3).map((feature) => (
                <span key={feature} className="px-3 py-1 bg-secondary rounded-full text-xs font-medium">{feature}</span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleBookmark} disabled={toggleBookmark.isPending}>
                {isBookmarked ? <Heart className="w-4 h-4 fill-destructive text-destructive" /> : <Bookmark className="w-4 h-4" />}
                {isBookmarked ? 'Saved' : 'Save'}
              </Button>
              <Button variant="ghost" size="sm"><Share2 className="w-4 h-4" />Share</Button>
              <Button variant="gold" size="sm"><Play className="w-4 h-4" />Start Virtual Tour</Button>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-12">
                <div>
                  <h2 className="font-serif text-2xl font-semibold mb-4">About This Site</h2>
                  <p className="text-muted-foreground leading-relaxed text-lg">{destination.description}</p>
                </div>

                {destination.history && (
                  <div>
                    <h2 className="font-serif text-2xl font-semibold mb-4">Historical Significance</h2>
                    <p className="text-muted-foreground leading-relaxed">{destination.history}</p>
                  </div>
                )}

                <div>
                  <h2 className="font-serif text-2xl font-semibold mb-4">Virtual Tour</h2>
                  <VirtualTourPlayer 
                    tour={destinationTour} 
                    fallbackImage={imageUrl} 
                  />
                </div>

                {destination.images && destination.images.length > 1 && (
                  <div>
                    <h2 className="font-serif text-2xl font-semibold mb-4">Gallery</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {destination.images.map((image, index) => (
                        <div key={index} className="aspect-square rounded-lg overflow-hidden group cursor-pointer">
                          <img src={image} alt={`${destination.title} ${index + 1}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                        </div>
                      ))}
                      <div className="aspect-square rounded-lg bg-secondary flex items-center justify-center cursor-pointer hover:bg-secondary/80 transition-colors">
                        <div className="text-center">
                          <Camera className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">View All Photos</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="card-heritage p-6">
                  <h3 className="font-serif text-lg font-semibold mb-4">Quick Information</h3>
                  <dl className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <dt className="text-sm text-muted-foreground">Location</dt>
                        <dd className="font-medium">{destination.country}, {destination.region}</dd>
                      </div>
                    </div>
                    {destination.era && (
                      <div className="flex items-start gap-3">
                        <Calendar className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <dt className="text-sm text-muted-foreground">Era</dt>
                          <dd className="font-medium">{destination.era}</dd>
                        </div>
                      </div>
                    )}
                    {destination.best_time_to_visit && (
                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <dt className="text-sm text-muted-foreground">Best Time to Visit</dt>
                          <dd className="font-medium">{destination.best_time_to_visit}</dd>
                        </div>
                      </div>
                    )}
                    <div className="flex items-start gap-3">
                      <Globe className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <dt className="text-sm text-muted-foreground">Heritage Type</dt>
                        <dd className="font-medium">{destination.heritage_type}</dd>
                      </div>
                    </div>
                  </dl>
                </div>

                {destination.features && destination.features.length > 0 && (
                  <div className="card-heritage p-6">
                    <h3 className="font-serif text-lg font-semibold mb-4">Available Features</h3>
                    <ul className="space-y-2">
                      {destination.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm">
                          <ChevronRight className="w-4 h-4 text-gold" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="card-heritage p-6">
                  <h3 className="font-serif text-lg font-semibold mb-4">Location</h3>
                  {coords ? (
                    <>
                      <DestinationMap 
                        coordinates={coords} 
                        title={destination.title} 
                        destinationId={destination.id}
                        showNearby={true}
                      />
                      <p className="text-xs text-muted-foreground mt-2 text-center">{coords.lat}°N, {coords.lng}°E</p>
                    </>
                  ) : (
                    <div className="aspect-square bg-secondary rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Map className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Location not available</span>
                      </div>
                    </div>
                  )}
                </div>

                <NearbyDestinations 
                  currentCoordinates={coords} 
                  currentId={destination.id} 
                />
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default DestinationDetail;
