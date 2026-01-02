import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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

async function getMapboxTokenFromDB(): Promise<string | null> {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { data, error } = await supabase
      .from("app_settings")
      .select("value")
      .eq("key", "MAPBOX_PUBLIC_TOKEN")
      .single();

    if (error || !data?.value) {
      return null;
    }

    return data.value;
  } catch (e) {
    console.error("Error fetching Mapbox token from DB:", e);
    return null;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Try database first, then fall back to env variable
    const dbToken = await getMapboxTokenFromDB();
    const mapboxToken = dbToken || Deno.env.get('MAPBOX_PUBLIC_TOKEN');
    
    if (!mapboxToken) {
      throw new Error('Mapbox token not configured. Please set it in Admin Settings or Cloud Secrets.');
    }

    console.log('Using Mapbox token from:', dbToken ? 'database' : 'environment');

    const { lat, lng, query, radius = 50000, limit = 20 } = await req.json();
    console.log('Request params:', { lat, lng, query, radius, limit });

    let results: PlaceResult[] = [];

    if (query) {
      // Search by query - use broader search without type restriction
      const searchUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?` +
        `access_token=${mapboxToken}` +
        `&limit=${Math.min(limit, 10)}` +
        (lat && lng ? `&proximity=${lng},${lat}` : '');

      console.log('Search URL:', searchUrl.replace(mapboxToken, 'TOKEN'));
      
      const searchRes = await fetch(searchUrl);
      const searchData = await searchRes.json();
      
      console.log('Search response features count:', searchData.features?.length || 0);

      if (searchData.features) {
        results = searchData.features.map((feature: any) => {
          const placeName = feature.place_name || '';
          const textName = feature.text || '';
          const context = feature.context || [];
          
          // Extract category from place_type
          const placeType = feature.place_type?.[0] || 'place';
          const category = formatCategory(placeType, feature.properties?.category);
          
          return {
            id: feature.id,
            name: textName,
            category: category,
            address: placeName,
            coordinates: {
              lng: feature.center[0],
              lat: feature.center[1]
            },
            distance: lat && lng ? calculateDistance(lat, lng, feature.center[1], feature.center[0]) : undefined
          };
        });
      }
    } else if (lat && lng) {
      // For nearby places, search for common tourism-related terms
      const tourismTerms = [
        'museum',
        'temple', 
        'monument',
        'palace',
        'fort',
        'beach',
        'park',
        'church',
        'historical',
        'heritage'
      ];

      console.log('Fetching nearby places at:', lat, lng);
      
      // Search for each tourism term
      for (const term of tourismTerms) {
        try {
          const termUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(term)}.json?` +
            `access_token=${mapboxToken}` +
            `&proximity=${lng},${lat}` +
            `&limit=5`;

          const termRes = await fetch(termUrl);
          const termData = await termRes.json();

          if (termData.features) {
            for (const feature of termData.features) {
              const distance = calculateDistance(lat, lng, feature.center[1], feature.center[0]);
              
              // Only include places within radius (in km)
              if (distance <= radius / 1000) {
                const existingIndex = results.findIndex(r => r.id === feature.id);
                if (existingIndex === -1) {
                  results.push({
                    id: feature.id,
                    name: feature.text || feature.place_name?.split(',')[0] || 'Unknown',
                    category: formatCategory(feature.place_type?.[0], term),
                    address: feature.place_name || '',
                    coordinates: {
                      lng: feature.center[0],
                      lat: feature.center[1]
                    },
                    distance
                  });
                }
              }
            }
          }
        } catch (e) {
          console.error(`Error searching for ${term}:`, e);
        }
      }

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

function formatCategory(placeType: string, hint?: string): string {
  const typeMap: Record<string, string> = {
    'poi': 'Point of Interest',
    'place': 'Place',
    'locality': 'Town',
    'neighborhood': 'Neighborhood',
    'address': 'Address',
    'region': 'Region',
    'country': 'Country',
    'district': 'District'
  };
  
  if (hint) {
    return hint.charAt(0).toUpperCase() + hint.slice(1);
  }
  
  return typeMap[placeType] || 'Attraction';
}

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
