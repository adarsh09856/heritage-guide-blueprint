import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Database, Users, FileImage, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { sampleDestinations, sampleVirtualTours, sampleStories, sampleExperiences } from '@/data/sampleData';
import { useState } from 'react';

export const SettingsManager = () => {
  const [isSeeding, setIsSeeding] = useState(false);

  const seedDatabase = async () => {
    setIsSeeding(true);
    try {
      // Seed destinations
      for (const dest of sampleDestinations) {
        const { error } = await supabase.from('destinations').upsert({
          id: dest.id,
          title: dest.title,
          slug: dest.id,
          region: dest.region,
          country: dest.country,
          heritage_type: dest.heritageType,
          era: dest.era,
          description: dest.description,
          history: dest.history,
          images: dest.images,
          features: dest.features,
          best_time_to_visit: dest.bestTimeToVisit,
          rating: dest.rating,
          review_count: dest.reviewCount,
          is_featured: dest.isFeatured,
          is_published: true,
          coordinates: dest.coordinates ? { lat: dest.coordinates.lat, lng: dest.coordinates.lng } : null,
        }, { onConflict: 'id' });
        if (error) console.error('Destination error:', error);
      }

      // Seed virtual tours
      for (const tour of sampleVirtualTours) {
        const { error } = await supabase.from('virtual_tours').upsert({
          id: tour.id,
          title: tour.title,
          description: tour.description,
          destination_id: tour.destinationId,
          thumbnail_url: tour.thumbnailUrl,
          tour_url: tour.tourUrl,
          tour_type: tour.tourType,
          duration: tour.duration,
          is_published: true,
        }, { onConflict: 'id' });
        if (error) console.error('Tour error:', error);
      }

      // Seed stories
      for (const story of sampleStories) {
        const { error } = await supabase.from('stories').upsert({
          id: story.id,
          title: story.title,
          slug: story.id,
          excerpt: story.excerpt,
          content: story.content,
          image_url: story.imageUrl,
          tags: story.tags,
          destination_id: story.destinationId,
          published_at: story.publishedAt,
          is_published: true,
        }, { onConflict: 'id' });
        if (error) console.error('Story error:', error);
      }

      // Seed experiences
      for (const exp of sampleExperiences) {
        const { error } = await supabase.from('experiences').upsert({
          id: exp.id,
          title: exp.title,
          description: exp.description,
          destination_id: exp.destinationId,
          type: exp.type,
          duration: exp.duration,
          price: exp.price,
          image_url: exp.imageUrl,
          is_published: true,
        }, { onConflict: 'id' });
        if (error) console.error('Experience error:', error);
      }

      // Seed sample events
      const sampleEvents = [
        {
          title: 'Cherry Blossom Festival',
          description: 'Experience the beauty of cherry blossoms in historic Japanese gardens.',
          location: 'Kyoto, Japan',
          event_date: '2025-04-01',
          end_date: '2025-04-15',
          image_url: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800',
          culture_tag: 'Japanese',
          is_published: true,
        },
        {
          title: 'Day of the Dead Celebration',
          description: 'Join the colorful Día de los Muertos festivities in Mexico.',
          location: 'Oaxaca, Mexico',
          event_date: '2025-11-01',
          end_date: '2025-11-02',
          image_url: 'https://images.unsplash.com/photo-1509721434272-b79147e0e708?w=800',
          culture_tag: 'Mexican',
          is_published: true,
        },
        {
          title: 'Holi Festival of Colors',
          description: 'Celebrate the vibrant festival of colors in India.',
          location: 'Rajasthan, India',
          event_date: '2025-03-14',
          image_url: 'https://images.unsplash.com/photo-1520262454473-a1a82276a574?w=800',
          culture_tag: 'Indian',
          is_published: true,
        },
      ];

      for (const event of sampleEvents) {
        const { error } = await supabase.from('events').insert(event);
        if (error && !error.message.includes('duplicate')) console.error('Event error:', error);
      }

      toast.success('Database seeded with sample data!');
    } catch (error) {
      console.error('Seed error:', error);
      toast.error('Failed to seed database');
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-2xl font-bold mb-2">Settings</h1>
      <p className="text-muted-foreground mb-8">Manage your site configuration</p>
      
      <div className="space-y-6">
        {/* General Settings */}
        <div className="bg-background rounded-xl p-6 shadow-heritage-sm">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            General Settings
          </h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="siteName">Site Name</Label>
              <Input id="siteName" defaultValue="Heritage Guide" />
            </div>
            <div>
              <Label htmlFor="siteDescription">Site Description</Label>
              <Input id="siteDescription" defaultValue="Discover World Heritage Sites" />
            </div>
            <Button variant="heritage">Save Changes</Button>
          </div>
        </div>

        {/* Database Seeding */}
        <div className="bg-background rounded-xl p-6 shadow-heritage-sm">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Database className="w-5 h-5" />
            Database Management
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Populate the database with sample heritage destinations, tours, stories, and experiences.
          </p>
          <Button variant="gold" onClick={seedDatabase} disabled={isSeeding}>
            {isSeeding ? 'Seeding...' : 'Seed Sample Data'}
          </Button>
        </div>

        {/* Stats */}
        <div className="bg-background rounded-xl p-6 shadow-heritage-sm">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Platform Statistics
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">Total Users</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">Total Bookmarks</p>
            </div>
          </div>
        </div>

        {/* Storage */}
        <div className="bg-background rounded-xl p-6 shadow-heritage-sm">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <FileImage className="w-5 h-5" />
            Storage Buckets
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span>Images</span>
              <span className="text-muted-foreground">Public</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span>Videos</span>
              <span className="text-muted-foreground">Public</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span>Documents</span>
              <span className="text-muted-foreground">Public</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
