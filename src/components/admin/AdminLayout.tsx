import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { 
  LayoutDashboard, MapPin, Globe, BookOpen, Users, 
  Settings, Calendar, Sparkles, Eye, LogOut, FileImage, Navigation
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const navItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'destinations', icon: MapPin, label: 'Destinations' },
  { id: 'tours', icon: Globe, label: 'Virtual Tours' },
  { id: 'map-explorer', icon: Navigation, label: 'Map Explorer' },
  { id: 'stories', icon: BookOpen, label: 'Stories' },
  { id: 'experiences', icon: Sparkles, label: 'Experiences' },
  { id: 'events', icon: Calendar, label: 'Events' },
  { id: 'users', icon: Users, label: 'Users', adminOnly: true },
  { id: 'media', icon: FileImage, label: 'Media' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

export const AdminLayout = ({ children, activeSection, onSectionChange }: AdminLayoutProps) => {
  const { user, userRole, signOut, isAdmin, isEditor } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (!isAdmin && !isEditor) {
      navigate('/');
    }
  }, [user, isAdmin, isEditor, navigate]);

  if (!user || (!isAdmin && !isEditor)) {
    return null;
  }

  const visibleNavItems = navItems.filter(item => !item.adminOnly || isAdmin);

  return (
    <div className="min-h-screen bg-muted">
      {/* Admin Header */}
      <header className="bg-background border-b border-border px-6 py-4 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 font-serif text-xl font-semibold">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center">
                <Globe className="w-4 h-4 text-foreground" />
              </div>
              Heritage Guide
            </Link>
            <span className="px-2 py-1 bg-primary text-primary-foreground text-xs font-medium rounded capitalize">
              {userRole || 'user'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <Eye className="w-4 h-4" />
                View Site
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={() => signOut()}>
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-background border-r border-border min-h-[calc(100vh-65px)] p-4 sticky top-[65px]">
          <nav className="space-y-1">
            {visibleNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === item.id 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
