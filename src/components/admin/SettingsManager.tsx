import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Database, Users, FileImage, Shield, Mail, Eye, EyeOff, Map, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { supabase } from '@/integrations/supabase/client';
import { sampleDestinations, sampleVirtualTours, sampleStories, sampleExperiences } from '@/data/sampleData';
import { useState, useEffect } from 'react';

interface AppSetting {
  id: string;
  key: string;
  value: string | null;
  is_secret: boolean;
  description: string | null;
}

export const SettingsManager = () => {
  const [isSeeding, setIsSeeding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<AppSetting[]>([]);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [showGmailGuide, setShowGmailGuide] = useState(false);
  const [showMapboxGuide, setShowMapboxGuide] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from('app_settings')
      .select('*')
      .order('key');
    
    if (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
      return;
    }

    setSettings(data || []);
    const values: Record<string, string> = {};
    data?.forEach(setting => {
      values[setting.key] = setting.value || '';
    });
    setFormValues(values);
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      for (const [key, value] of Object.entries(formValues)) {
        const { error } = await supabase
          .from('app_settings')
          .update({ value })
          .eq('key', key);
        
        if (error) throw error;
      }
      toast.success('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleSecretVisibility = (key: string) => {
    setShowSecrets(prev => ({ ...prev, [key]: !prev[key] }));
  };

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

  const emailSettings = settings.filter(s => s.key.includes('GMAIL') || s.key === 'CONTACT_EMAIL');
  const generalSettings = settings.filter(s => s.key === 'SITE_NAME');
  const mapSettings = settings.filter(s => s.key === 'MAPBOX_PUBLIC_TOKEN');

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
            {generalSettings.map(setting => (
              <div key={setting.key}>
                <Label htmlFor={setting.key}>{setting.description || setting.key}</Label>
                <Input
                  id={setting.key}
                  value={formValues[setting.key] || ''}
                  onChange={(e) => setFormValues(prev => ({ ...prev, [setting.key]: e.target.value }))}
                  placeholder={setting.description || ''}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Email Configuration */}
        <div className="bg-background rounded-xl p-6 shadow-heritage-sm">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Email Configuration (Gmail SMTP)
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Configure Gmail SMTP for sending contact form emails and notifications.
          </p>
          
          {/* Gmail Setup Guide */}
          <Collapsible open={showGmailGuide} onOpenChange={setShowGmailGuide} className="mb-4">
            <CollapsibleTrigger className="flex items-center gap-2 text-sm text-primary hover:underline w-full justify-between bg-muted/50 p-3 rounded-lg">
              <span className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4" />
                Gmail App Password Setup Guide
              </span>
              {showGmailGuide ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <div className="bg-muted/30 rounded-lg p-4 text-sm space-y-3 border border-border">
                <h4 className="font-semibold text-foreground">Step-by-Step Guide:</h4>
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                  <li>
                    <strong className="text-foreground">Enable 2-Step Verification</strong>
                    <p className="ml-5 mt-1">Go to <a href="https://myaccount.google.com/security" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Account Security</a> and enable 2-Step Verification if not already enabled.</p>
                  </li>
                  <li>
                    <strong className="text-foreground">Generate App Password</strong>
                    <p className="ml-5 mt-1">Visit <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">App Passwords</a> in your Google Account.</p>
                  </li>
                  <li>
                    <strong className="text-foreground">Create New App Password</strong>
                    <p className="ml-5 mt-1">Select "Mail" as the app and "Other" as the device. Enter a name like "Heritage Site".</p>
                  </li>
                  <li>
                    <strong className="text-foreground">Copy the Password</strong>
                    <p className="ml-5 mt-1">Google will generate a 16-character password. Copy it (spaces are optional).</p>
                  </li>
                  <li>
                    <strong className="text-foreground">Enter Credentials Below</strong>
                    <p className="ml-5 mt-1">
                      <strong>Gmail User:</strong> Your full Gmail address (e.g., yourname@gmail.com)<br/>
                      <strong>Gmail App Password:</strong> The 16-character password you just copied<br/>
                      <strong>Contact Email:</strong> Email where you want to receive contact form submissions
                    </p>
                  </li>
                </ol>
                <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                  <p className="text-amber-700 dark:text-amber-400 text-xs">
                    <strong>⚠️ Important:</strong> Never use your regular Gmail password. App Passwords are specifically designed for third-party apps and can be revoked anytime without affecting your main account.
                  </p>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <div className="space-y-4">
            {emailSettings.map(setting => (
              <div key={setting.key}>
                <Label htmlFor={setting.key}>{setting.description || setting.key}</Label>
                <div className="relative">
                  <Input
                    id={setting.key}
                    type={setting.is_secret && !showSecrets[setting.key] ? 'password' : 'text'}
                    value={formValues[setting.key] || ''}
                    onChange={(e) => setFormValues(prev => ({ ...prev, [setting.key]: e.target.value }))}
                    placeholder={setting.is_secret ? '••••••••' : setting.description || ''}
                    className="pr-10"
                  />
                  {setting.is_secret && (
                    <button
                      type="button"
                      onClick={() => toggleSecretVisibility(setting.key)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showSecrets[setting.key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mapbox Configuration */}
        <div className="bg-background rounded-xl p-6 shadow-heritage-sm">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Map className="w-5 h-5" />
            Map Configuration (Mapbox)
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Configure Mapbox for interactive maps and location search.
          </p>

          {/* Mapbox Setup Guide */}
          <Collapsible open={showMapboxGuide} onOpenChange={setShowMapboxGuide} className="mb-4">
            <CollapsibleTrigger className="flex items-center gap-2 text-sm text-primary hover:underline w-full justify-between bg-muted/50 p-3 rounded-lg">
              <span className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4" />
                Mapbox Token Setup Guide
              </span>
              {showMapboxGuide ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <div className="bg-muted/30 rounded-lg p-4 text-sm space-y-3 border border-border">
                <h4 className="font-semibold text-foreground">Step-by-Step Guide:</h4>
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                  <li>
                    <strong className="text-foreground">Create Mapbox Account</strong>
                    <p className="ml-5 mt-1">Go to <a href="https://account.mapbox.com/auth/signup/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Mapbox Sign Up</a> and create a free account.</p>
                  </li>
                  <li>
                    <strong className="text-foreground">Access Your Tokens</strong>
                    <p className="ml-5 mt-1">Visit <a href="https://account.mapbox.com/access-tokens/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Access Tokens</a> page in your Mapbox dashboard.</p>
                  </li>
                  <li>
                    <strong className="text-foreground">Copy Default Public Token</strong>
                    <p className="ml-5 mt-1">You can use the "Default public token" that Mapbox creates automatically, or create a new one with custom scopes.</p>
                  </li>
                  <li>
                    <strong className="text-foreground">Paste Token Below</strong>
                    <p className="ml-5 mt-1">Copy the token (starts with "pk.") and paste it in the Mapbox Public Token field below.</p>
                  </li>
                </ol>
                <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <p className="text-blue-700 dark:text-blue-400 text-xs">
                    <strong>💡 Free Tier:</strong> Mapbox offers 50,000 free map loads per month. This is sufficient for most small to medium websites.
                  </p>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <div className="space-y-4">
            {mapSettings.map(setting => (
              <div key={setting.key}>
                <Label htmlFor={setting.key}>{setting.description || setting.key}</Label>
                <div className="relative">
                  <Input
                    id={setting.key}
                    type={setting.is_secret && !showSecrets[setting.key] ? 'password' : 'text'}
                    value={formValues[setting.key] || ''}
                    onChange={(e) => setFormValues(prev => ({ ...prev, [setting.key]: e.target.value }))}
                    placeholder={setting.is_secret ? '••••••••' : setting.description || ''}
                    className="pr-10"
                  />
                  {setting.is_secret && (
                    <button
                      type="button"
                      onClick={() => toggleSecretVisibility(setting.key)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showSecrets[setting.key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <Button variant="heritage" onClick={handleSaveSettings} disabled={isSaving} className="w-full">
          {isSaving ? 'Saving...' : 'Save All Settings'}
        </Button>

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
