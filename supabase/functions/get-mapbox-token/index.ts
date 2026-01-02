import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

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
      console.log("No Mapbox token in database, falling back to env");
      return null;
    }

    console.log("Using Mapbox token from database");
    return data.value;
  } catch (e) {
    console.error("Error fetching Mapbox token from DB:", e);
    return null;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Try database first, then fall back to env variable
    const dbToken = await getMapboxTokenFromDB();
    const token = dbToken || Deno.env.get("MAPBOX_PUBLIC_TOKEN");
    
    if (!token) {
      throw new Error("MAPBOX_PUBLIC_TOKEN is not configured. Please set it in Admin Settings or Cloud Secrets.");
    }

    return new Response(
      JSON.stringify({ token }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error getting Mapbox token:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
