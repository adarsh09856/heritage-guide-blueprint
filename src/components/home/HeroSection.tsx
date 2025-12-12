import { Button } from '@/components/ui/button';
import { ArrowRight, Compass, Globe, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroBackground from '@/assets/hero-background.jpg';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBackground})` }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-foreground/60 via-foreground/40 to-foreground/80" />
      
      {/* Animated Pattern */}
      <div className="absolute inset-0 opacity-10 section-pattern" />
      
      {/* Content */}
      <div className="container relative z-10 px-4 pt-20 pb-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sand/10 backdrop-blur-sm border border-sand/20 mb-8 animate-fade-in">
            <Globe className="w-4 h-4 text-gold" />
            <span className="text-sand text-sm font-medium">Explore 500+ UNESCO World Heritage Sites</span>
          </div>
          
          {/* Heading */}
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-sand leading-tight mb-6 animate-slide-up">
            Discover the World's
            <span className="block text-gradient mt-2">Cultural Treasures</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-sand/80 text-lg md:text-xl max-w-2xl mx-auto mb-10 animate-slide-up stagger-1">
            Immerse yourself in virtual tours, uncover ancient histories, and plan unforgettable journeys to humanity's greatest heritage sites.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up stagger-2">
            <Link to="/destinations">
              <Button variant="gold" size="xl">
                <Compass className="w-5 h-5" />
                Explore Destinations
              </Button>
            </Link>
            <Link to="/virtual-tours">
              <Button variant="hero" size="xl">
                <Play className="w-5 h-5" />
                Start Virtual Tour
              </Button>
            </Link>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto mt-16 animate-fade-in stagger-3">
            {[
              { value: '500+', label: 'Heritage Sites' },
              { value: '150+', label: 'Virtual Tours' },
              { value: '50k+', label: 'Travelers' }
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-serif font-bold text-gold">{stat.value}</div>
                <div className="text-sand/60 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
        <div className="w-6 h-10 rounded-full border-2 border-sand/30 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-sand/50 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
