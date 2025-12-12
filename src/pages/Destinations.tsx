import { Helmet } from 'react-helmet-async';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { DestinationCard } from '@/components/cards/DestinationCard';
import { useDestinations } from '@/hooks/useDestinations';
import { sampleDestinations, regions, heritageTypes } from '@/data/sampleData';
import { useState, useMemo } from 'react';
import { Search, MapPin, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

const Destinations = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [selectedType, setSelectedType] = useState('All Types');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data: dbDestinations, isLoading } = useDestinations({ published: true });

  // Use database data or fall back to sample data
  const allDestinations = useMemo(() => {
    if (dbDestinations?.length) {
      return dbDestinations;
    }
    // Convert sample data to DB format
    return sampleDestinations.map(d => ({
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
  }, [dbDestinations]);

  const filteredDestinations = useMemo(() => {
    return allDestinations.filter((dest) => {
      const matchesSearch = dest.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (dest.country?.toLowerCase() || '').includes(searchQuery.toLowerCase());
      const matchesRegion = selectedRegion === 'All Regions' || dest.region === selectedRegion;
      const matchesType = selectedType === 'All Types' || dest.heritage_type === selectedType;
      return matchesSearch && matchesRegion && matchesType;
    });
  }, [searchQuery, selectedRegion, selectedType, allDestinations]);

  return (
    <>
      <Helmet>
        <title>Destinations | Heritage Guide - Explore World Heritage Sites</title>
        <meta 
          name="description" 
          content="Browse our collection of UNESCO World Heritage Sites. Filter by region, heritage type, and era to find your perfect heritage destination." 
        />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Navbar />
        
        {/* Hero Header */}
        <section className="pt-24 pb-12 bg-gradient-to-b from-secondary/50 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
                Explore Destinations
              </h1>
              <p className="text-muted-foreground text-lg">
                Discover remarkable heritage sites from ancient temples to natural wonders across every continent.
              </p>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="py-6 border-b border-border sticky top-16 md:top-20 bg-background/95 backdrop-blur-md z-40">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              {/* Search */}
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search destinations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filter Buttons */}
              <div className="flex flex-wrap gap-2 items-center">
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {regions.map((region) => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>

                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {heritageTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>

                {/* View Toggle */}
                <div className="flex items-center gap-1 border border-border rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {/* Results Count */}
            <div className="flex items-center gap-2 mb-6 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{filteredDestinations.length} destinations found</span>
            </div>

            {/* Grid/List */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-56 rounded-xl" />
                ))}
              </div>
            ) : filteredDestinations.length > 0 ? (
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
                : 'flex flex-col gap-4'
              }>
                {filteredDestinations.map((destination) => (
                  <DestinationCard key={destination.id} destination={destination} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-serif text-xl font-semibold mb-2">No destinations found</h3>
                <p className="text-muted-foreground">Try adjusting your filters or search query</p>
              </div>
            )}
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Destinations;
