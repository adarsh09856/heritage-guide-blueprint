import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Compass } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background section-pattern">
      <div className="text-center max-w-lg px-4">
        <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center">
          <Compass className="w-12 h-12 text-foreground" />
        </div>
        <h1 className="font-serif text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="font-serif text-2xl font-semibold mb-4">Lost in History</h2>
        <p className="text-muted-foreground mb-8">
          The page you're looking for seems to have vanished into the sands of time. Let us guide you back to familiar territory.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/">
            <Button variant="heritage" size="lg">
              <Home className="w-5 h-5" />
              Return Home
            </Button>
          </Link>
          <Link to="/destinations">
            <Button variant="outline" size="lg">
              <Compass className="w-5 h-5" />
              Explore Destinations
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
