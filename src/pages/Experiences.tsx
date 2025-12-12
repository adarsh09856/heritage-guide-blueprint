import { Helmet } from 'react-helmet-async';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useExperiences } from '@/hooks/useExperiences';
import { sampleExperiences } from '@/data/sampleData';
import { Compass, Clock, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

const Experiences = () => {
  const { data: dbExperiences, isLoading } = useExperiences({ published: true });

  const typeLabels: Record<string, string> = {
    'workshop': 'Workshop',
    'guided-tour': 'Guided Tour',
    'cultural-event': 'Cultural Event',
    'culinary': 'Culinary'
  };

  const typeColors: Record<string, string> = {
    'workshop': 'bg-gold text-foreground',
    'guided-tour': 'bg-forest text-sand',
    'cultural-event': 'bg-terracotta text-sand',
    'culinary': 'bg-earth text-sand'
  };

  // Use database data or fall back to sample data
  const experiences = dbExperiences?.length ? dbExperiences.map((e: any) => ({
    id: e.id,
    title: e.title,
    description: e.description || '',
    type: e.type,
    duration: e.duration || '',
    price: e.price,
    imageUrl: e.image_url || ''
  })) : sampleExperiences;

  return (
    <>
      <Helmet>
        <title>Experiences | Heritage Guide - Cultural Activities & Tours</title>
        <meta 
          name="description" 
          content="Book authentic cultural experiences including workshops, guided tours, culinary adventures, and local events at heritage destinations worldwide." 
        />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Navbar />
        
        {/* Hero */}
        <section className="pt-24 pb-16 bg-gradient-to-b from-gold/10 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/20 mb-6">
                <Compass className="w-4 h-4 text-gold" />
                <span className="text-foreground text-sm font-medium">Cultural Experiences</span>
              </div>
              <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6">
                Live the Heritage
              </h1>
              <p className="text-muted-foreground text-lg">
                Go beyond sightseeing with authentic cultural experiences. Learn traditional crafts, taste local cuisines, and connect with local communities.
              </p>
            </div>
          </div>
        </section>

        {/* Experience Categories */}
        <section className="py-8 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center justify-center gap-3">
              {Object.entries(typeLabels).map(([key, label]) => (
                <Button key={key} variant="outline" size="sm">
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Experiences Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-80 rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {experiences.map((experience: any) => (
                  <div key={experience.id} className="card-heritage overflow-hidden group">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={experience.imageUrl}
                        alt={experience.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge className={typeColors[experience.type] || 'bg-primary'}>
                          {typeLabels[experience.type] || experience.type}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-serif text-lg font-semibold mb-2">
                        {experience.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {experience.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {experience.duration}
                          </span>
                          {experience.price && (
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              From ${experience.price}
                            </span>
                          )}
                        </div>
                        <Button variant="heritage" size="sm">
                          Book Now
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {experiences.length < 6 && [1, 2, 3].slice(0, 6 - experiences.length).map((i) => (
                  <div key={`placeholder-${i}`} className="card-heritage p-6 flex items-center justify-center min-h-[320px]">
                    <div className="text-center">
                      <Compass className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-serif text-lg font-semibold mb-2">More Coming Soon</h3>
                      <p className="text-sm text-muted-foreground">New experiences being added</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Experiences;
