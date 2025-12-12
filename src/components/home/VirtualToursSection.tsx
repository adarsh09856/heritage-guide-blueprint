import { sampleVirtualTours } from '@/data/sampleData';
import { TourCard } from '@/components/cards/TourCard';
import { Button } from '@/components/ui/button';
import { ArrowRight, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

export function VirtualToursSection() {
  return (
    <section className="py-20 bg-secondary/30 section-pattern">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-forest/10 mb-4">
            <Globe className="w-4 h-4 text-forest" />
            <span className="text-forest text-sm font-medium">Experience From Anywhere</span>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold">
            Immersive Virtual Tours
          </h2>
          <p className="text-muted-foreground mt-4">
            Step inside ancient temples, explore hidden chambers, and walk through history with our cutting-edge 360° and 3D virtual experiences.
          </p>
        </div>

        {/* Tours Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {sampleVirtualTours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to="/virtual-tours">
            <Button variant="forest" size="lg">
              Explore All Virtual Tours
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default VirtualToursSection;
