import { Helmet } from 'react-helmet-async';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { TourCard } from '@/components/cards/TourCard';
import { useVirtualTours } from '@/hooks/useVirtualTours';
import { sampleVirtualTours } from '@/data/sampleData';
import { Globe, Play, Monitor, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const VirtualTours = () => {
  const { data: dbTours, isLoading } = useVirtualTours({ published: true });

  // Use database data or fall back to sample data
  const tours = dbTours?.length ? dbTours : sampleVirtualTours.map(t => ({
    id: t.id,
    title: t.title,
    description: t.description || null,
    thumbnail_url: t.thumbnailUrl || null,
    tour_url: t.tourUrl || null,
    tour_type: t.tourType || '360',
    duration: t.duration || null,
    destination_id: t.destinationId || null,
    is_published: true,
    hotspots: null,
    created_at: null,
    updated_at: null,
    created_by: null,
    destinations: null
  }));

  return (
    <>
      <Helmet>
        <title>Virtual Tours | Heritage Guide - Immersive Heritage Experiences</title>
        <meta 
          name="description" 
          content="Experience world heritage sites through immersive 360° virtual tours, video experiences, and 3D walkthroughs from anywhere in the world." 
        />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Navbar />
        
        {/* Hero */}
        <section className="pt-24 pb-16 bg-gradient-to-b from-forest/10 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-forest/10 mb-6">
                <Globe className="w-4 h-4 text-forest" />
                <span className="text-forest text-sm font-medium">Virtual Experiences</span>
              </div>
              <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6">
                Explore From Anywhere
              </h1>
              <p className="text-muted-foreground text-lg mb-8">
                Step inside ancient wonders, explore hidden chambers, and walk through history with our cutting-edge virtual tour experiences.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button variant="forest" size="lg">
                  <Play className="w-5 h-5" />
                  Start Featured Tour
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Device Support */}
        <section className="py-12 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {[
                { icon: Monitor, label: 'Desktop', desc: 'Full immersive experience' },
                { icon: Smartphone, label: 'Mobile', desc: 'Touch-enabled 360°' },
                { icon: Globe, label: 'VR Ready', desc: 'Compatible with VR headsets' }
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-4 p-4 bg-background rounded-lg">
                  <div className="w-12 h-12 rounded-full bg-forest/10 flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-forest" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{item.label}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tours Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="font-serif text-2xl md:text-3xl font-bold mb-8">
              Available Virtual Tours
            </h2>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-72 rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tours.map((tour: any) => (
                  <TourCard key={tour.id} tour={tour} />
                ))}
                {tours.length < 6 && [1, 2, 3].slice(0, 6 - tours.length).map((i) => (
                  <div key={`placeholder-${i}`} className="card-heritage p-6 flex items-center justify-center min-h-[280px]">
                    <div className="text-center">
                      <Globe className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-serif text-lg font-semibold mb-2">Coming Soon</h3>
                      <p className="text-sm text-muted-foreground">New virtual tour in development</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default VirtualTours;
