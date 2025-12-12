import { Helmet } from 'react-helmet-async';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useEvents } from '@/hooks/useEvents';
import { Calendar, MapPin, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

const Events = () => {
  const { data: events, isLoading } = useEvents({ published: true, upcoming: true });

  // Sample events if database is empty
  const sampleEvents = [
    {
      id: '1',
      title: 'Angkor Wat Sunrise Festival',
      description: 'Join us for a special celebration of the spring equinox at Angkor Wat, featuring traditional Khmer ceremonies and cultural performances.',
      event_date: '2025-03-21T05:00:00Z',
      end_date: '2025-03-21T12:00:00Z',
      location: 'Angkor Wat, Cambodia',
      culture_tag: 'Khmer',
      image_url: 'https://images.unsplash.com/photo-1569060708400-2b0f1d024648?w=600'
    },
    {
      id: '2',
      title: 'Petra by Candlelight',
      description: 'Experience the magic of Petra illuminated by over 1,500 candles. Walk through the Siq to the Treasury for an unforgettable evening.',
      event_date: '2025-04-15T19:00:00Z',
      end_date: '2025-04-15T22:00:00Z',
      location: 'Petra, Jordan',
      culture_tag: 'Nabataean',
      image_url: 'https://images.unsplash.com/photo-1579606032821-4e6161c81571?w=600'
    },
    {
      id: '3',
      title: 'Inti Raymi - Festival of the Sun',
      description: 'Witness the ancient Incan celebration of the winter solstice in Cusco, featuring elaborate costumes and traditional rituals.',
      event_date: '2025-06-24T08:00:00Z',
      end_date: '2025-06-24T18:00:00Z',
      location: 'Cusco, Peru',
      culture_tag: 'Incan',
      image_url: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=600'
    },
    {
      id: '4',
      title: 'Colosseum Night Tours',
      description: 'Explore the Colosseum after dark with exclusive access to underground chambers and arena floor. Limited spots available.',
      event_date: '2025-05-01T20:00:00Z',
      end_date: '2025-09-30T23:00:00Z',
      location: 'Rome, Italy',
      culture_tag: 'Roman',
      image_url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600'
    }
  ];

  const displayEvents = events?.length ? events : sampleEvents;

  return (
    <>
      <Helmet>
        <title>Events & Festivals | Heritage Guide</title>
        <meta 
          name="description" 
          content="Discover upcoming cultural events, festivals, and heritage celebrations around the world. Experience living traditions and historic celebrations." 
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />

        {/* Hero */}
        <section className="pt-24 pb-16 bg-gradient-to-b from-terracotta/10 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-terracotta/10 mb-6">
                <Calendar className="w-4 h-4 text-terracotta" />
                <span className="text-terracotta text-sm font-medium">Upcoming Events</span>
              </div>
              <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6">
                Events & Festivals
              </h1>
              <p className="text-muted-foreground text-lg">
                Experience living traditions, ancient ceremonies, and cultural celebrations that bring heritage sites to life.
              </p>
            </div>
          </div>
        </section>

        {/* Events Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="grid md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-80 rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {displayEvents.map((event) => (
                  <div key={event.id} className="card-heritage overflow-hidden group">
                    <div className="relative h-48">
                      <img 
                        src={event.image_url || 'https://images.unsplash.com/photo-1569060708400-2b0f1d024648?w=600'}
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {event.culture_tag && (
                        <span className="absolute top-4 left-4 px-3 py-1 bg-gold text-foreground text-sm font-medium rounded-full">
                          {event.culture_tag}
                        </span>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="font-serif text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {event.description}
                      </p>
                      <div className="space-y-2 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {event.event_date 
                              ? format(new Date(event.event_date), 'MMMM d, yyyy')
                              : 'Date TBA'
                            }
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{event.location || 'Location TBA'}</span>
                        </div>
                        {event.end_date && event.event_date && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>
                              {format(new Date(event.event_date), 'h:mm a')} - {format(new Date(event.end_date), 'h:mm a')}
                            </span>
                          </div>
                        )}
                      </div>
                      <Button variant="outline" size="sm" className="group/btn">
                        Learn More
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-16 bg-gradient-to-r from-earth to-forest text-sand">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-serif text-2xl md:text-3xl font-bold mb-4">
              Never Miss an Event
            </h2>
            <p className="text-sand/80 mb-6 max-w-md mx-auto">
              Subscribe to our newsletter for updates on upcoming cultural events and festivals.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
              <input 
                type="email"
                placeholder="Enter your email"
                className="px-4 py-3 rounded-lg bg-sand/10 border border-sand/20 text-sand placeholder:text-sand/50 flex-1"
              />
              <Button variant="gold">Subscribe</Button>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Events;
