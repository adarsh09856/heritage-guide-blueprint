import { useDestinations } from '@/hooks/useDestinations';
import { DestinationCard } from '@/components/cards/DestinationCard';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { sampleDestinations } from '@/data/sampleData';

export function FeaturedDestinations() {
  const { data: destinations, isLoading } = useDestinations({ featured: true, published: true });
  
  // Use sample data if database is empty
  const displayDestinations = destinations?.length 
    ? destinations.slice(0, 4)
    : sampleDestinations.filter(d => d.isFeatured).slice(0, 4).map(d => ({
        id: d.id,
        title: d.title,
        slug: d.slug,
        region: d.region,
        country: d.country || '',
        heritage_type: d.heritageType,
        era: d.era || null,
        description: d.description || null,
        history: d.history || null,
        images: d.images,
        coordinates: d.coordinates || null,
        features: d.features,
        best_time_to_visit: d.bestTimeToVisit || null,
        rating: d.rating || null,
        review_count: d.reviewCount || null,
        is_featured: d.isFeatured || false,
        is_published: true,
        created_at: null,
        updated_at: null,
        created_by: null
      }));

  const [main, ...rest] = displayDestinations;

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-gold font-medium tracking-wide uppercase text-sm">Explore</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mt-2">
              Featured Destinations
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl">
              Journey through time and discover the world's most remarkable heritage sites, each telling a unique story of human civilization.
            </p>
          </div>
          <Link to="/destinations" className="mt-6 md:mt-0">
            <Button variant="outline" className="group">
              View All Destinations
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Destination Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="md:col-span-2 md:row-span-2 h-[500px] rounded-xl" />
            <Skeleton className="h-56 rounded-xl" />
            <Skeleton className="h-56 rounded-xl" />
            <Skeleton className="h-56 rounded-xl" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {main && (
              <div className="md:col-span-2 md:row-span-2">
                <DestinationCard destination={main} featured />
              </div>
            )}
            {rest.map((destination) => (
              <DestinationCard key={destination.id} destination={destination} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default FeaturedDestinations;
