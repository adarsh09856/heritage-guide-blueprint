import { Helmet } from 'react-helmet-async';
import { useState, useEffect, useMemo } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SearchMap } from '@/components/search/SearchMap';
import { DestinationSearchCard } from '@/components/search/DestinationSearchCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search as SearchIcon, 
  MapPin, 
  Loader2, 
  Navigation, 
  Filter,
  SortAsc,
  Globe,
  Locate
} from 'lucide-react';
import { useDestinations } from '@/hooks/useDestinations';
import { calculateDistance, destinationCoordinates } from '@/lib/distance';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Coordinates {
  lat: number;
  lng: number;
}

const Search = () => {
  const { data: destinations, isLoading } = useDestinations({ published: true });
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<any>(null);
  const [sortBy, setSortBy] = useState<'distance' | 'name' | 'rating'>('distance');
  const [filterRegion, setFilterRegion] = useState<string>('all');

  // Request user location
  const requestLocation = () => {
    setIsLocating(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setIsLocating(false);
      },
      (error) => {
        let message = 'Unable to get your location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Location permission denied. Please enable location access.';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'Location information unavailable.';
            break;
          case error.TIMEOUT:
            message = 'Location request timed out.';
            break;
        }
        setLocationError(message);
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // Cache for 5 minutes
      }
    );
  };

  // Auto-request location on mount
  useEffect(() => {
    requestLocation();
  }, []);

  // Process destinations with coordinates and distance
  const processedDestinations = useMemo(() => {
    if (!destinations) return [];

    return destinations.map(dest => {
      // Get coordinates from database or fallback to known coordinates
      let coords: Coordinates | null = null;
      
      if (dest.coordinates && typeof dest.coordinates === 'object') {
        const c = dest.coordinates as any;
        if (c.lat && c.lng) {
          coords = { lat: c.lat, lng: c.lng };
        }
      }
      
      // Fallback to known coordinates
      if (!coords && destinationCoordinates[dest.slug]) {
        coords = destinationCoordinates[dest.slug];
      }

      // Calculate distance if we have both user location and destination coords
      let distance: number | undefined;
      if (userLocation && coords) {
        distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          coords.lat,
          coords.lng
        );
      }

      return {
        ...dest,
        coordinates: coords,
        distance
      };
    });
  }, [destinations, userLocation]);

  // Filter and sort destinations
  const filteredDestinations = useMemo(() => {
    let results = processedDestinations;

    // Text search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(dest =>
        dest.title.toLowerCase().includes(query) ||
        dest.country?.toLowerCase().includes(query) ||
        dest.region.toLowerCase().includes(query) ||
        dest.heritage_type.toLowerCase().includes(query)
      );
    }

    // Region filter
    if (filterRegion !== 'all') {
      results = results.filter(dest => dest.region === filterRegion);
    }

    // Sort
    switch (sortBy) {
      case 'distance':
        results = [...results].sort((a, b) => {
          if (a.distance === undefined) return 1;
          if (b.distance === undefined) return -1;
          return a.distance - b.distance;
        });
        break;
      case 'name':
        results = [...results].sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'rating':
        results = [...results].sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
    }

    return results;
  }, [processedDestinations, searchQuery, filterRegion, sortBy]);

  // Get unique regions
  const regions = useMemo(() => {
    if (!destinations) return [];
    const uniqueRegions = [...new Set(destinations.map(d => d.region))];
    return uniqueRegions.sort();
  }, [destinations]);

  return (
    <>
      <Helmet>
        <title>Search Destinations | Heritage Guide</title>
        <meta name="description" content="Search and explore heritage destinations near you. View distances and plan your cultural journey." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="pt-20">
          {/* Search Header */}
          <section className="bg-gradient-to-b from-earth/10 to-background py-8">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-6">
                  <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">
                    Find Heritage Sites Near You
                  </h1>
                  <p className="text-muted-foreground">
                    Discover cultural treasures and see how far they are from your location
                  </p>
                </div>

                {/* Search & Filters */}
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      placeholder="Search destinations, countries, or heritage types..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 h-12 text-base"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Select value={filterRegion} onValueChange={setFilterRegion}>
                      <SelectTrigger className="w-[140px] h-12">
                        <Globe className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Region" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Regions</SelectItem>
                        {regions.map(region => (
                          <SelectItem key={region} value={region}>{region}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
                      <SelectTrigger className="w-[140px] h-12">
                        <SortAsc className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="distance">Nearest First</SelectItem>
                        <SelectItem value="name">Name A-Z</SelectItem>
                        <SelectItem value="rating">Top Rated</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button 
                      variant="outline" 
                      size="icon"
                      className="h-12 w-12"
                      onClick={requestLocation}
                      disabled={isLocating}
                    >
                      {isLocating ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Locate className="w-5 h-5" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Location Status */}
                {locationError && (
                  <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {locationError}
                    <Button variant="link" size="sm" onClick={requestLocation} className="ml-auto">
                      Retry
                    </Button>
                  </div>
                )}

                {userLocation && (
                  <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg text-sm text-primary flex items-center gap-2">
                    <Navigation className="w-4 h-4" />
                    Location found! Showing distances from your position.
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Map & Results */}
          <section className="py-8">
            <div className="container mx-auto px-4">
              <div className="grid lg:grid-cols-2 gap-6 min-h-[600px]">
                {/* Map */}
                <div className="h-[400px] lg:h-full lg:sticky lg:top-24 rounded-xl overflow-hidden shadow-lg">
                  <SearchMap
                    destinations={filteredDestinations}
                    userLocation={userLocation}
                    selectedDestination={selectedDestination}
                    onSelectDestination={setSelectedDestination}
                  />
                </div>

                {/* Results List */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-muted-foreground">
                      {filteredDestinations.length} destination{filteredDestinations.length !== 1 ? 's' : ''} found
                    </p>
                  </div>

                  {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  ) : filteredDestinations.length === 0 ? (
                    <div className="text-center py-20">
                      <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-serif text-xl font-bold mb-2">No destinations found</h3>
                      <p className="text-muted-foreground">Try adjusting your search or filters</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredDestinations.map((destination) => (
                        <DestinationSearchCard
                          key={destination.id}
                          destination={destination}
                          isSelected={selectedDestination?.id === destination.id}
                          onSelect={() => setSelectedDestination(destination)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Search;
