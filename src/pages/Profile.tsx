import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile, useUpdateProfile } from '@/hooks/useProfile';
import { useBookmarks } from '@/hooks/useBookmarks';
import { 
  User, Settings, Bookmark, MapPin, Calendar, 
  Edit, Camera, LogOut, Globe, Heart, Loader2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut, isLoading: authLoading } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: bookmarks } = useBookmarks();
  const updateProfile = useUpdateProfile();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    display_name: '',
    avatar_url: ''
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (profile) {
      setFormData({
        display_name: profile.display_name || '',
        avatar_url: profile.avatar_url || ''
      });
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    try {
      await updateProfile.mutateAsync(formData);
      toast({ title: 'Profile updated!' });
      setIsEditing(false);
    } catch (error) {
      toast({ title: 'Failed to update profile', variant: 'destructive' });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  const stats = [
    { label: 'Saved Places', value: bookmarks?.length || 0, icon: Bookmark },
    { label: 'Tours Taken', value: 0, icon: Globe },
    { label: 'Countries', value: 0, icon: MapPin },
  ];

  return (
    <>
      <Helmet>
        <title>My Profile | Heritage Guide</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />

        <section className="pt-24 pb-12 bg-gradient-to-b from-secondary/50 to-background">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-start gap-8">
              <div className="relative">
                <img 
                  src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.display_name || user.email || '')}&background=random`}
                  alt={profile?.display_name || 'User'}
                  className="w-32 h-32 rounded-full object-cover border-4 border-background shadow-heritage-lg"
                />
                <button className="absolute bottom-0 right-0 p-2 bg-primary rounded-full text-primary-foreground shadow-md hover:bg-primary/90 transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="font-serif text-3xl font-bold mb-2">{profile?.display_name || 'Heritage Explorer'}</h1>
                    <p className="text-muted-foreground mb-4">{user.email}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Member since {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
                      <Edit className="w-4 h-4" />
                      Edit Profile
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-8 max-w-lg">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center p-4 bg-card rounded-xl">
                  <stat.icon className="w-5 h-5 mx-auto mb-2 text-gold" />
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {isEditing && (
          <section className="py-8 border-b border-border">
            <div className="container mx-auto px-4">
              <div className="max-w-xl bg-card rounded-xl p-6 border border-border">
                <h2 className="font-serif text-lg font-semibold mb-4">Edit Profile</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Display Name</Label>
                    <Input 
                      id="name" 
                      value={formData.display_name}
                      onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="heritage" onClick={handleSaveProfile} disabled={updateProfile.isPending}>
                      {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl font-semibold">Saved Destinations</h2>
              <Link to="/destinations"><Button variant="ghost">View All</Button></Link>
            </div>

            {bookmarks && bookmarks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {bookmarks.map((bookmark: any) => (
                  <Link 
                    key={bookmark.id}
                    to={`/destinations/${bookmark.destination_id}`}
                    className="group card-heritage overflow-hidden"
                  >
                    <div className="relative h-40">
                      <img 
                        src={bookmark.destinations?.images?.[0] || 'https://images.unsplash.com/photo-1569060708400-2b0f1d024648?w=400'}
                        alt={bookmark.destinations?.title || 'Destination'}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <button className="absolute top-3 right-3 p-2 bg-background/80 backdrop-blur-sm rounded-full text-destructive">
                        <Heart className="w-4 h-4 fill-current" />
                      </button>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-1">{bookmark.destinations?.title || 'Unknown'}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {bookmark.destinations?.country || 'Unknown location'}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-secondary/30 rounded-xl">
                <Bookmark className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-semibold mb-2">No saved destinations yet</h3>
                <p className="text-muted-foreground mb-4">Start exploring and save your favorite places!</p>
                <Link to="/destinations"><Button variant="heritage">Explore Destinations</Button></Link>
              </div>
            )}
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-md">
              <h2 className="font-serif text-xl font-semibold mb-4">Account Settings</h2>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="w-4 h-4" />
                  Notification Preferences
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <User className="w-4 h-4" />
                  Privacy Settings
                </Button>
                <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Profile;
