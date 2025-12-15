import { Button } from '@/components/ui/button';
import { ArrowRight, Compass, Globe, Play, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import heroBackground from '@/assets/hero-background.jpg';

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/search');
    }
  };

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
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-10 animate-slide-up stagger-2">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-sand/50" />
              <Input
                placeholder="Search destinations, countries, heritage types..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-32 h-14 bg-sand/10 border-sand/20 text-sand placeholder:text-sand/50 rounded-full text-base backdrop-blur-sm"
              />
              <Button 
                type="submit" 
                variant="gold" 
                className="absolute right-2 rounded-full px-6"
              >
                Search
              </Button>
            </div>
          </form>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up stagger-3">
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
