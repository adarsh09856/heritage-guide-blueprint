import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function CtaSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-earth via-earth to-forest relative overflow-hidden">
      {/* Pattern Overlay */}
      <div className="absolute inset-0 opacity-5 section-pattern" />
      
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-forest/20 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sand/10 backdrop-blur-sm border border-sand/20 mb-8">
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="text-sand text-sm font-medium">AI-Powered Trip Planning</span>
          </div>
          
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-sand leading-tight mb-6">
            Plan Your Perfect Heritage Journey
          </h2>
          
          <p className="text-sand/80 text-lg max-w-2xl mx-auto mb-10">
            Let our intelligent itinerary builder craft a personalized trip based on your interests, travel style, and preferred destinations. Discover hidden gems and must-see wonders.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/trip-planner">
              <Button variant="gold" size="xl">
                <Sparkles className="w-5 h-5" />
                Create My Itinerary
              </Button>
            </Link>
            <Link to="/destinations">
              <Button variant="hero" size="xl">
                Browse Destinations
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CtaSection;
