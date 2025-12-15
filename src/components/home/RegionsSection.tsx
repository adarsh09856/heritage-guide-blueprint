import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const regions = [
  {
    name: 'Asia',
    image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=600',
    count: 124,
    gradient: 'from-rose-500/80 to-orange-500/80'
  },
  {
    name: 'Europe',
    image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600',
    count: 98,
    gradient: 'from-blue-500/80 to-indigo-500/80'
  },
  {
    name: 'Africa',
    image: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=600',
    count: 67,
    gradient: 'from-amber-500/80 to-yellow-500/80'
  },
  {
    name: 'Americas',
    image: 'https://images.unsplash.com/photo-1518639192441-8fce0a366e2e?w=600',
    count: 85,
    gradient: 'from-emerald-500/80 to-teal-500/80'
  },
  {
    name: 'Middle East',
    image: 'https://images.unsplash.com/photo-1547483238-f400e65ccd56?w=600',
    count: 54,
    gradient: 'from-purple-500/80 to-pink-500/80'
  },
  {
    name: 'Oceania',
    image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=600',
    count: 32,
    gradient: 'from-cyan-500/80 to-blue-500/80'
  }
];

export function RegionsSection() {
  return (
    <section className="py-20 bg-secondary/20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-gold font-medium tracking-wide uppercase text-sm">By Region</span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold mt-2">
            Explore by Destination
          </h2>
          <p className="text-muted-foreground mt-4">
            Discover heritage sites across continents, each region offering unique cultural treasures.
          </p>
        </div>

        {/* Regions Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {regions.map((region, index) => (
            <Link 
              key={region.name}
              to={`/destinations?region=${region.name}`}
              className="group relative aspect-[3/4] overflow-hidden rounded-2xl animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <img
                src={region.image}
                alt={region.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${region.gradient} opacity-60 group-hover:opacity-70 transition-opacity`} />
              
              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                <h3 className="font-serif text-xl md:text-2xl font-bold text-center">{region.name}</h3>
                <p className="text-white/80 text-sm mt-1">{region.count} sites</p>
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default RegionsSection;
