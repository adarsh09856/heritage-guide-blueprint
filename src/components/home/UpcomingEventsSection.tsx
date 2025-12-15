import { useEvents } from '@/hooks/useEvents';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const sampleEvents = [
  {
    id: '1',
    title: 'Diwali Festival of Lights',
    event_date: '2024-11-01',
    location: 'Varanasi, India',
    image_url: 'https://images.unsplash.com/photo-1574265935521-6f37b00a564f?w=400',
    culture_tag: 'Hindu'
  },
  {
    id: '2', 
    title: 'Cherry Blossom Festival',
    event_date: '2024-04-05',
    location: 'Kyoto, Japan',
    image_url: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=400',
    culture_tag: 'Japanese'
  },
  {
    id: '3',
    title: 'Inti Raymi Sun Festival',
    event_date: '2024-06-24',
    location: 'Cusco, Peru',
    image_url: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=400',
    culture_tag: 'Incan'
  }
];

export function UpcomingEventsSection() {
  const { data: events } = useEvents({ published: true, upcoming: true });
  
  const displayEvents = events?.length ? events.slice(0, 3) : sampleEvents;

  return (
    <section className="py-20 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-terracotta/10 mb-4">
            <Calendar className="w-4 h-4 text-terracotta" />
            <span className="text-terracotta text-sm font-medium">Don't Miss Out</span>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold">
            Upcoming Events & Festivals
          </h2>
          <p className="text-muted-foreground mt-4">
            Experience the world's most vibrant cultural celebrations and heritage events.
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {displayEvents.map((event, index) => (
            <div 
              key={event.id} 
              className="group relative overflow-hidden rounded-2xl animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={event.image_url || 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400'}
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-transparent" />
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                {event.culture_tag && (
                  <span className="px-3 py-1 bg-gold text-foreground text-xs font-medium rounded-full mb-3 inline-block">
                    {event.culture_tag}
                  </span>
                )}
                <h3 className="font-serif text-xl font-bold text-sand mb-2">{event.title}</h3>
                <div className="flex items-center gap-4 text-sand/80 text-sm">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {event.event_date ? format(new Date(event.event_date), 'MMM d, yyyy') : 'TBA'}
                  </span>
                  {event.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {event.location}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to="/events">
            <Button variant="outline" size="lg" className="group">
              View All Events
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default UpcomingEventsSection;
