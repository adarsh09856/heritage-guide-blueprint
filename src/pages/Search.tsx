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
          {/* Hero Search Header */}
          <section className="relative bg-gradient-to-br from-primary/5 via-gold/5 to-background py-12 overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
            </div>
            
            <div className="container mx-auto px-4 relative">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
                    <Globe className="w-4 h-4" />
                    <span>Discover Heritage Sites Worldwide</span>
                  </div>
                  <h1 className="font-serif text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    Find Your Next Adventure
                  </h1>
                  <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Explore cultural treasures around the world and see how far they are from your location
                  </p>
                </div>

                {/* Search & Filters */}
                <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg border border-border/50">
                  <div className="flex flex-col gap-4">
                    {/* Main search row */}
                    <div className="flex flex-col md:flex-row gap-3">
                      <div className="flex-1 relative">
                        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          placeholder="Search destinations, countries, or heritage types..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-12 h-14 text-base rounded-xl border-border/50 bg-background"
                        />
                      </div>
                      
                      <Button 
                        variant={userLocation ? "default" : "outline"}
                        size="lg"
                        className="h-14 px-6 rounded-xl gap-2"
                        onClick={requestLocation}
                        disabled={isLocating}
                      >
                        {isLocating ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Locate className="w-5 h-5" />
                        )}
                        <span className="hidden md:inline">{userLocation ? 'Located' : 'Find Me'}</span>
                      </Button>
                    </div>
                    
                    {/* Filters row */}
                    <div className="flex flex-wrap gap-3">
                      <Select value={filterRegion} onValueChange={setFilterRegion}>
                        <SelectTrigger className="w-full md:w-[180px] h-11 rounded-xl">
                          <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                          <SelectValue placeholder="All Regions" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Regions</SelectItem>
                          {regions.map(region => (
                            <SelectItem key={region} value={region}>{region}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
                        <SelectTrigger className="w-full md:w-[180px] h-11 rounded-xl">
                          <SortAsc className="w-4 h-4 mr-2 text-muted-foreground" />
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="distance">Nearest First</SelectItem>
                          <SelectItem value="name">Name A-Z</SelectItem>
                          <SelectItem value="rating">Top Rated</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Location Status */}
                  {locationError && (
                    <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-sm text-destructive flex items-center gap-3">
                      <MapPin className="w-5 h-5 shrink-0" />
                      <span className="flex-1">{locationError}</span>
                      <Button variant="outline" size="sm" onClick={requestLocation}>
                        Retry
                      </Button>
                    </div>
                  )}

                  {userLocation && !locationError && (
                    <div className="mt-4 p-4 bg-primary/10 border border-primary/20 rounded-xl text-sm flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <Navigation className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Location detected</p>
                        <p className="text-muted-foreground text-xs">Distances are calculated from your current position</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Map & Results */}
          <section className="py-8 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="grid lg:grid-cols-5 gap-6 min-h-[700px]">
                {/* Map - Takes more space */}
                <div className="lg:col-span-3 h-[450px] lg:h-auto lg:sticky lg:top-24 rounded-2xl overflow-hidden shadow-xl border border-border/50">
                  <SearchMap
                    destinations={filteredDestinations}
                    userLocation={userLocation}
                    selectedDestination={selectedDestination}
                    onSelectDestination={setSelectedDestination}
                  />
                </div>

                {/* Results List */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between bg-card rounded-xl p-4 border border-border/50">
                    <div>
                      <h2 className="font-serif font-bold text-lg">Destinations</h2>
                      <p className="text-muted-foreground text-sm">
                        {filteredDestinations.length} site{filteredDestinations.length !== 1 ? 's' : ''} found
                      </p>
                    </div>
                    {userLocation && (
                      <div className="text-right text-sm">
                        <p className="text-muted-foreground">Sorted by</p>
                        <p className="font-medium text-primary capitalize">{sortBy}</p>
                      </div>
                    )}
                  </div>

                  {isLoading ? (
                    <div className="flex items-center justify-center py-20 bg-card rounded-xl border border-border/50">
                      <div className="text-center">
                        <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-3" />
                        <p className="text-muted-foreground">Loading destinations...</p>
                      </div>
                    </div>
                  ) : filteredDestinations.length === 0 ? (
                    <div className="text-center py-20 bg-card rounded-xl border border-border/50">
                      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                        <MapPin className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <h3 className="font-serif text-xl font-bold mb-2">No destinations found</h3>
                      <p className="text-muted-foreground max-w-sm mx-auto">Try adjusting your search or filters to discover more heritage sites</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[600px] lg:max-h-none overflow-y-auto pr-1">
                      {filteredDestinations.map((destination) => (
                        <DestinationSearchCard
                          key={destination.id}
                          destination={destination}
                          isSelected={selectedDestination?.id === destination.id}
                          onSelect={() => setSelectedDestination(destination)}
                          userLocation={userLocation}
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
