import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
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

const Admin = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

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
