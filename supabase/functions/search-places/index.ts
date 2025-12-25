import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PlaceResult {
  id: string;
  name: string;
  category: string;
  address: string;
  coordinates: { lat: number; lng: number };
  distance?: number;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const mapboxToken = Deno.env.get('MAPBOX_PUBLIC_TOKEN');
    if (!mapboxToken) {
      throw new Error('Mapbox token not configured');
    }

    const { lat, lng, query, radius = 50000, limit = 20 } = await req.json();

    // Categories for tourism/heritage places
    const tourismCategories = [
      'historic_site',
      'museum',
      'monument',
      'archaeological_site',
      'landmark',
      'temple',
      'church',
      'castle',
      'palace',
      'national_park',
      'nature_reserve',
      'tourist_attraction',
      'heritage',
      'cultural'
    ].join(',');

    let results: PlaceResult[] = [];

    if (query) {
      // Search by query using Mapbox Geocoding API
      const searchUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?` +
        `access_token=${mapboxToken}` +
        `&types=poi` +
        `&limit=${limit}` +
        (lat && lng ? `&proximity=${lng},${lat}` : '');

      console.log('Searching places with query:', query);
      const searchRes = await fetch(searchUrl);
      const searchData = await searchRes.json();

      if (searchData.features) {
        results = searchData.features.map((feature: any) => ({
          id: feature.id,
          name: feature.text,
          category: feature.properties?.category || 'Point of Interest',
          address: feature.place_name,
          coordinates: {
            lng: feature.center[0],
            lat: feature.center[1]
          },
          distance: lat && lng ? calculateDistance(lat, lng, feature.center[1], feature.center[0]) : undefined
        }));
      }
    } else if (lat && lng) {
      // Search nearby using Mapbox Tilequery for POIs
      // First, use reverse geocoding to get nearby places
      const nearbyUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?` +
        `access_token=${mapboxToken}` +
        `&types=poi` +
        `&limit=${limit}`;

      console.log('Fetching nearby places at:', lat, lng);
      const nearbyRes = await fetch(nearbyUrl);
      const nearbyData = await nearbyRes.json();

      // Also search for specific tourism-related terms nearby
      const tourismSearches = ['museum', 'temple', 'monument', 'castle', 'historic', 'heritage', 'palace', 'park'];
      const additionalResults: PlaceResult[] = [];

      for (const term of tourismSearches.slice(0, 3)) { // Limit API calls
        const termUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${term}.json?` +
          `access_token=${mapboxToken}` +
          `&types=poi` +
          `&proximity=${lng},${lat}` +
          `&limit=5`;

        try {
          const termRes = await fetch(termUrl);
          const termData = await termRes.json();
          
          if (termData.features) {
            termData.features.forEach((feature: any) => {
              const distance = calculateDistance(lat, lng, feature.center[1], feature.center[0]);
              if (distance <= radius / 1000) { // Convert to km
                additionalResults.push({
                  id: feature.id,
                  name: feature.text,
                  category: term.charAt(0).toUpperCase() + term.slice(1),
                  address: feature.place_name,
                  coordinates: {
                    lng: feature.center[0],
                    lat: feature.center[1]
                  },
                  distance
                });
              }
            });
          }
        } catch (e) {
          console.error(`Error searching for ${term}:`, e);
        }
      }

      // Combine results
      if (nearbyData.features) {
        results = nearbyData.features.map((feature: any) => ({
          id: feature.id,
          name: feature.text,
          category: feature.properties?.category || 'Point of Interest',
          address: feature.place_name,
          coordinates: {
            lng: feature.center[0],
            lat: feature.center[1]
          },
          distance: calculateDistance(lat, lng, feature.center[1], feature.center[0])
        }));
      }

      // Merge and dedupe
      const seen = new Set(results.map(r => r.id));
      additionalResults.forEach(r => {
        if (!seen.has(r.id)) {
          results.push(r);
          seen.add(r.id);
        }
      });

      // Sort by distance
      results.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    }

    console.log(`Found ${results.length} places`);

    return new Response(JSON.stringify({ places: results.slice(0, limit) }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error searching places:', errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}
