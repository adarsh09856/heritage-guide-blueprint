import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Travel Photographer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    content: 'Heritage Guide transformed how I plan my photography trips. The virtual tours helped me scout locations before visiting. Absolutely incredible!',
    rating: 5
  },
  {
    name: 'Marcus Weber',
    role: 'History Professor',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
    content: 'An invaluable resource for my research and teaching. The depth of historical information on each site is remarkable.',
    rating: 5
  },
  {
    name: 'Aisha Patel',
    role: 'Adventure Traveler',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    content: 'I\'ve used this platform to plan three heritage trips so far. The AI itinerary builder saved me hours of research!',
    rating: 5
  }
];

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-gold font-medium tracking-wide uppercase text-sm">Testimonials</span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold mt-2">
            What Travelers Say
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.name}
              className="relative bg-card rounded-2xl p-8 shadow-heritage-md hover:shadow-heritage-lg transition-shadow animate-slide-up"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Quote Icon */}
              <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
                <Quote className="w-6 h-6 text-gold" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>

              {/* Content */}
              <p className="text-muted-foreground mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-medium">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;
