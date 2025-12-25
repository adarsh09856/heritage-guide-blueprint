import { Helmet } from 'react-helmet-async';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { DestinationCard } from '@/components/cards/DestinationCard';
import { useDestinations } from '@/hooks/useDestinations';
import { useUserLocation } from '@/hooks/useUserLocation';
import { NearbyDestinationsMap } from '@/components/destination/NearbyDestinationsMap';
import { NearbyPlacesList } from '@/components/destination/NearbyPlacesList';
import { useNearbyMapPlaces } from '@/hooks/useMapPlaces';
import { sampleDestinations, regions, heritageTypes } from '@/data/sampleData';
import { useState, useMemo } from 'react';
import { Search, MapPin, Grid, List, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { calculateDistance, formatDistance } from '@/lib/distance';

const Destinations = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [selectedType, setSelectedType] = useState('All Types');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortByDistance, setSortByDistance] = useState(false);

  const { data: dbDestinations, isLoading } = useDestinations({ published: true });
  const { 
    location: userLocation, 
    error: locationError, 
    isLoading: isLoadingLocation, 
    requestLocation 
  } = useUserLocation(true);
  
  // Fetch nearby places from map
  const { data: nearbyPlaces = [], isLoading: placesLoading } = useNearbyMapPlaces(
    userLocation?.lat || null,
    userLocation?.lng || null,
    20
  );

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
    const filtered = allDestinations.filter((dest) => {
      const matchesSearch = dest.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (dest.country?.toLowerCase() || '').includes(searchQuery.toLowerCase());
      const matchesRegion = selectedRegion === 'All Regions' || dest.region === selectedRegion;
      const matchesType = selectedType === 'All Types' || dest.heritage_type === selectedType;
      return matchesSearch && matchesRegion && matchesType;
    });

    // Add distance and sort if user location is available
    if (userLocation) {
      const withDistance = filtered.map(dest => {
        const coords = dest.coordinates as unknown as { lat: number; lng: number } | null;
        const distance = coords?.lat && coords?.lng
          ? calculateDistance(userLocation.lat, userLocation.lng, coords.lat, coords.lng)
          : null;
        return { ...dest, distance };
      });

      if (sortByDistance) {
        withDistance.sort((a, b) => {
          if (a.distance === null) return 1;
          if (b.distance === null) return -1;
          return a.distance - b.distance;
        });
      }

      return withDistance;
    }

    return filtered.map(dest => ({ ...dest, distance: null as number | null }));
  }, [searchQuery, selectedRegion, selectedType, allDestinations, userLocation, sortByDistance]);

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

        {/* Map Section */}
        <section className="py-6 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Navigation className="w-5 h-5 text-primary" />
                <h2 className="font-serif text-xl font-semibold">Explore on Map</h2>
              </div>
              {userLocation && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  Location enabled
                </Badge>
              )}
            </div>
            <NearbyDestinationsMap
              userLocation={userLocation}
              onRequestLocation={requestLocation}
              isLoadingLocation={isLoadingLocation}
              locationError={locationError}
            />
            
            {/* Nearby Places List */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-lg font-semibold">
                  {userLocation ? 'Nearby Attractions' : 'Discover Attractions'}
                </h3>
                {nearbyPlaces.length > 0 && (
                  <span className="text-sm text-muted-foreground">
                    {nearbyPlaces.length} places found
                  </span>
                )}
              </div>
              <NearbyPlacesList 
                places={nearbyPlaces} 
                isLoading={placesLoading} 
                userLocation={userLocation}
              />
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

                {/* Distance Sort Toggle */}
                {userLocation && (
                  <Button
                    variant={sortByDistance ? 'heritage' : 'outline'}
                    size="sm"
                    onClick={() => setSortByDistance(!sortByDistance)}
                    className="gap-2"
                  >
                    <Navigation className="w-4 h-4" />
                    {sortByDistance ? 'Sorted by distance' : 'Sort by distance'}
                  </Button>
                )}

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
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{filteredDestinations.length} destinations found</span>
              </div>
              {userLocation && sortByDistance && (
                <span className="text-sm text-muted-foreground">
                  Showing nearest first
                </span>
              )}
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
