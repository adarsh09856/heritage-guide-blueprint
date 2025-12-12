import { Helmet } from 'react-helmet-async';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { sampleDestinations, regions, heritageTypes } from '@/data/sampleData';
import { 
  Sparkles, Calendar, MapPin, Clock, Plus, Trash2, 
  Download, Share2, ChevronRight, Loader2
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ItineraryDay {
  day: number;
  destination: string;
  activities: string[];
  tips: string;
}

const TripPlanner = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [itinerary, setItinerary] = useState<ItineraryDay[] | null>(null);
  
  const [preferences, setPreferences] = useState({
    destinations: [] as string[],
    days: 7,
    interests: '',
    travelStyle: 'balanced',
    startDate: ''
  });

  const handleDestinationToggle = (destId: string) => {
    setPreferences(prev => ({
      ...prev,
      destinations: prev.destinations.includes(destId)
        ? prev.destinations.filter(d => d !== destId)
        : [...prev.destinations, destId]
    }));
  };

  const generateItinerary = async () => {
    if (preferences.destinations.length === 0) {
      toast({
        title: "Select destinations",
        description: "Please select at least one destination for your trip.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    // Simulate AI generation - in production this would call an edge function
    await new Promise(resolve => setTimeout(resolve, 2500));

    const selectedDests = sampleDestinations.filter(d => 
      preferences.destinations.includes(d.id)
    );

    const generatedItinerary: ItineraryDay[] = [];
    const daysPerDest = Math.ceil(preferences.days / selectedDests.length);

    let currentDay = 1;
    selectedDests.forEach((dest, index) => {
      const daysForThis = index === selectedDests.length - 1 
        ? preferences.days - currentDay + 1 
        : daysPerDest;

      for (let i = 0; i < daysForThis && currentDay <= preferences.days; i++) {
        generatedItinerary.push({
          day: currentDay,
          destination: dest.title,
          activities: [
            i === 0 ? `Arrive at ${dest.title}, check into accommodation` : `Morning exploration of ${dest.title}`,
            `Visit main heritage sites and monuments`,
            `Afternoon: ${['Local cuisine tour', 'Museum visit', 'Cultural workshop', 'Guided historical tour'][i % 4]}`,
            `Evening: ${['Traditional dinner experience', 'Night market exploration', 'Sunset viewing point', 'Local entertainment'][i % 4]}`
          ],
          tips: dest.bestTimeToVisit 
            ? `Best visited: ${dest.bestTimeToVisit}. ${['Wear comfortable shoes', 'Bring sun protection', 'Book guides in advance', 'Try local street food'][i % 4]}.`
            : `${['Wear comfortable shoes', 'Bring sun protection', 'Book guides in advance', 'Try local street food'][i % 4]}.`
        });
        currentDay++;
      }
    });

    setItinerary(generatedItinerary);
    setIsGenerating(false);

    toast({
      title: "Itinerary generated!",
      description: `Your ${preferences.days}-day heritage journey is ready.`
    });
  };

  return (
    <>
      <Helmet>
        <title>AI Trip Planner | Heritage Guide</title>
        <meta name="description" content="Create your perfect heritage journey with our AI-powered trip planner. Generate personalized itineraries based on your interests and travel style." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />

        {/* Hero */}
        <section className="pt-24 pb-12 bg-gradient-to-b from-gold/10 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/20 mb-6">
                <Sparkles className="w-4 h-4 text-gold" />
                <span className="text-foreground text-sm font-medium">AI-Powered Planning</span>
              </div>
              <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6">
                Plan Your Heritage Journey
              </h1>
              <p className="text-muted-foreground text-lg">
                Tell us your preferences and let our AI create a personalized itinerary for your dream heritage tour.
              </p>
            </div>
          </div>
        </section>

        {/* Planner */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Preferences Form */}
              <div className="space-y-8">
                <div className="card-heritage p-6">
                  <h2 className="font-serif text-xl font-semibold mb-6">Trip Preferences</h2>
                  
                  {/* Destination Selection */}
                  <div className="mb-6">
                    <Label className="text-base font-medium mb-3 block">
                      Select Destinations ({preferences.destinations.length} selected)
                    </Label>
                    <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2">
                      {sampleDestinations.map((dest) => (
                        <button
                          key={dest.id}
                          onClick={() => handleDestinationToggle(dest.id)}
                          className={`flex items-center gap-2 p-3 rounded-lg border text-left transition-all ${
                            preferences.destinations.includes(dest.id)
                              ? 'border-gold bg-gold/10'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <img 
                            src={dest.images[0]} 
                            alt={dest.title}
                            className="w-10 h-10 rounded object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{dest.title}</p>
                            <p className="text-xs text-muted-foreground">{dest.country}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Trip Duration */}
                  <div className="mb-6">
                    <Label htmlFor="days" className="text-base font-medium mb-3 block">
                      Trip Duration
                    </Label>
                    <div className="flex items-center gap-4">
                      <Input
                        id="days"
                        type="number"
                        min={1}
                        max={30}
                        value={preferences.days}
                        onChange={(e) => setPreferences({ ...preferences, days: parseInt(e.target.value) || 1 })}
                        className="w-24"
                      />
                      <span className="text-muted-foreground">days</span>
                    </div>
                  </div>

                  {/* Start Date */}
                  <div className="mb-6">
                    <Label htmlFor="startDate" className="text-base font-medium mb-3 block">
                      Start Date (Optional)
                    </Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={preferences.startDate}
                      onChange={(e) => setPreferences({ ...preferences, startDate: e.target.value })}
                      className="w-48"
                    />
                  </div>

                  {/* Travel Style */}
                  <div className="mb-6">
                    <Label className="text-base font-medium mb-3 block">Travel Style</Label>
                    <div className="flex flex-wrap gap-2">
                      {['relaxed', 'balanced', 'active'].map((style) => (
                        <button
                          key={style}
                          onClick={() => setPreferences({ ...preferences, travelStyle: style })}
                          className={`px-4 py-2 rounded-full capitalize transition-all ${
                            preferences.travelStyle === style
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-secondary hover:bg-secondary/80'
                          }`}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Interests */}
                  <div className="mb-6">
                    <Label htmlFor="interests" className="text-base font-medium mb-3 block">
                      Special Interests (Optional)
                    </Label>
                    <Textarea
                      id="interests"
                      placeholder="e.g., archaeology, photography, local cuisine, ancient history..."
                      value={preferences.interests}
                      onChange={(e) => setPreferences({ ...preferences, interests: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <Button 
                    variant="gold" 
                    size="lg" 
                    className="w-full"
                    onClick={generateItinerary}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Generating Itinerary...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Generate Itinerary
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Generated Itinerary */}
              <div>
                {itinerary ? (
                  <div className="card-heritage p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-serif text-xl font-semibold">Your Itinerary</h2>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Share2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {itinerary.map((day) => (
                        <div key={day.day} className="relative pl-6 pb-6 border-l-2 border-gold/30 last:pb-0">
                          <div className="absolute -left-2.5 top-0 w-5 h-5 rounded-full bg-gold flex items-center justify-center text-xs font-bold text-foreground">
                            {day.day}
                          </div>
                          <div className="bg-secondary/30 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-3">
                              <MapPin className="w-4 h-4 text-primary" />
                              <h3 className="font-semibold">{day.destination}</h3>
                            </div>
                            <ul className="space-y-2 mb-3">
                              {day.activities.map((activity, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm">
                                  <ChevronRight className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                                  <span>{activity}</span>
                                </li>
                              ))}
                            </ul>
                            <p className="text-xs text-muted-foreground bg-background/50 p-2 rounded">
                              💡 {day.tips}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 pt-6 border-t border-border">
                      <Button variant="heritage" className="w-full">
                        <Calendar className="w-4 h-4" />
                        Book This Trip
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="card-heritage p-12 text-center">
                    <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6">
                      <Sparkles className="w-10 h-10 text-gold" />
                    </div>
                    <h3 className="font-serif text-xl font-semibold mb-3">
                      Your Itinerary Will Appear Here
                    </h3>
                    <p className="text-muted-foreground">
                      Select your destinations and preferences, then click "Generate Itinerary" to create your personalized heritage journey.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default TripPlanner;
