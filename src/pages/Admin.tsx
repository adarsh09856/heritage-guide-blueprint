import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { DestinationsManager } from '@/components/admin/DestinationsManager';
import { VirtualToursManager } from '@/components/admin/VirtualToursManager';
import { StoriesManager } from '@/components/admin/StoriesManager';
import { ExperiencesManager } from '@/components/admin/ExperiencesManager';
import { EventsManager } from '@/components/admin/EventsManager';
import { UsersManager } from '@/components/admin/UsersManager';
import { MediaManager } from '@/components/admin/MediaManager';
import { SettingsManager } from '@/components/admin/SettingsManager';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const Admin = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const { user, isAdmin, isEditor, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to access the admin dashboard.",
          variant: "destructive"
        });
        navigate('/login');
      } else if (!isAdmin && !isEditor) {
        toast({
          title: "Access denied",
          description: "You don't have permission to access the admin dashboard.",
          variant: "destructive"
        });
        navigate('/');
      }
    }
  }, [user, isAdmin, isEditor, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || (!isAdmin && !isEditor)) {
    return null;
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <AdminDashboard onSectionChange={setActiveSection} />;
      case 'destinations':
        return <DestinationsManager />;
      case 'tours':
        return <VirtualToursManager />;
      case 'stories':
        return <StoriesManager />;
      case 'experiences':
        return <ExperiencesManager />;
      case 'events':
        return <EventsManager />;
      case 'users':
        return <UsersManager />;
      case 'media':
        return <MediaManager />;
      case 'settings':
        return <SettingsManager />;
      default:
        return <AdminDashboard onSectionChange={setActiveSection} />;
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | Heritage Guide</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <AdminLayout activeSection={activeSection} onSectionChange={setActiveSection}>
        {renderSection()}
      </AdminLayout>
    </>
  );
};

export default Admin;
