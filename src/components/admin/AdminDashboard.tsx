import { MapPin, Globe, BookOpen, Users, Calendar, Sparkles, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDestinations } from '@/hooks/useDestinations';
import { useVirtualTours } from '@/hooks/useVirtualTours';
import { useStories } from '@/hooks/useStories';
import { useEvents } from '@/hooks/useEvents';
import { useExperiences } from '@/hooks/useExperiences';

interface AdminDashboardProps {
  onSectionChange: (section: string) => void;
}

export const AdminDashboard = ({ onSectionChange }: AdminDashboardProps) => {
  const { data: destinations = [] } = useDestinations();
  const { data: tours = [] } = useVirtualTours();
  const { data: stories = [] } = useStories();
  const { data: events = [] } = useEvents();
  const { data: experiences = [] } = useExperiences();

  const publishedDests = destinations.filter(d => d.is_published).length;
  const publishedTours = tours.filter(t => t.is_published).length;
  const publishedStories = stories.filter(s => s.is_published).length;

  const stats = [
    { label: 'Destinations', value: destinations.length, published: publishedDests, icon: MapPin, color: 'bg-earth/10 text-earth' },
    { label: 'Virtual Tours', value: tours.length, published: publishedTours, icon: Globe, color: 'bg-forest/10 text-forest' },
    { label: 'Stories', value: stories.length, published: publishedStories, icon: BookOpen, color: 'bg-gold/10 text-gold' },
    { label: 'Events', value: events.length, icon: Calendar, color: 'bg-terracotta/10 text-terracotta' },
    { label: 'Experiences', value: experiences.length, icon: Sparkles, color: 'bg-primary/10 text-primary' },
  ];

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your content overview.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-background rounded-xl p-5 shadow-heritage-sm">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            {stat.published !== undefined && (
              <p className="text-xs text-forest mt-1">{stat.published} published</p>
            )}
          </div>
        ))}
      </div>

      {/* Recent Destinations Table */}
      <div className="bg-background rounded-xl shadow-heritage-sm">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-semibold">Recent Destinations</h2>
            <Button variant="ghost" size="sm" onClick={() => onSectionChange('destinations')}>
              View All
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Destination</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Region</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Type</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-right px-6 py-3 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {destinations.slice(0, 5).map((dest) => (
                <tr key={dest.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={dest.images?.[0] || '/placeholder.svg'} 
                        alt={dest.title}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium">{dest.title}</p>
                        <p className="text-sm text-muted-foreground">{dest.country}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">{dest.region}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-secondary rounded-full text-xs font-medium">
                      {dest.heritage_type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      dest.is_published ? 'bg-forest/10 text-forest' : 'bg-muted text-muted-foreground'
                    }`}>
                      {dest.is_published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {destinations.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    No destinations yet. Create your first one!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
