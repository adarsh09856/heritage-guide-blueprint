import { Globe, Users, Camera, Map } from 'lucide-react';

const stats = [
  {
    icon: Globe,
    value: '500+',
    label: 'Heritage Sites',
    description: 'UNESCO World Heritage locations'
  },
  {
    icon: Camera,
    value: '150+',
    label: 'Virtual Tours',
    description: 'Immersive 360° experiences'
  },
  {
    icon: Users,
    value: '50K+',
    label: 'Travelers',
    description: 'Happy explorers worldwide'
  },
  {
    icon: Map,
    value: '85+',
    label: 'Countries',
    description: 'Global coverage'
  }
];

export function StatsSection() {
  return (
    <section className="py-16 bg-earth relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 section-pattern" />
      
      {/* Decorative Elements */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-gold/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-forest/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={stat.label}
              className="text-center animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-sand/10 mb-4">
                <stat.icon className="w-8 h-8 text-gold" />
              </div>
              <div className="font-serif text-3xl md:text-4xl font-bold text-sand">{stat.value}</div>
              <div className="text-gold font-medium mt-1">{stat.label}</div>
              <div className="text-sand/60 text-sm mt-1">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default StatsSection;
