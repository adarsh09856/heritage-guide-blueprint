import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Destinations from "./pages/Destinations";
import DestinationDetail from "./pages/DestinationDetail";
import VirtualTours from "./pages/VirtualTours";
import Stories from "./pages/Stories";
import StoryDetail from "./pages/StoryDetail";
import Experiences from "./pages/Experiences";
import Events from "./pages/Events";
import TripPlanner from "./pages/TripPlanner";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Search from "./pages/Search";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/destinations" element={<Destinations />} />
              <Route path="/destinations/:id" element={<DestinationDetail />} />
              <Route path="/virtual-tours" element={<VirtualTours />} />
              <Route path="/stories" element={<Stories />} />
              <Route path="/stories/:id" element={<StoryDetail />} />
              <Route path="/experiences" element={<Experiences />} />
              <Route path="/events" element={<Events />} />
              <Route path="/trip-planner" element={<TripPlanner />} />
              <Route path="/admin/*" element={<Admin />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/search" element={<Search />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
