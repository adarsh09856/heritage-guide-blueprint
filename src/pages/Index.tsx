import { Helmet } from 'react-helmet-async';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedDestinations } from '@/components/home/FeaturedDestinations';
import { VirtualToursSection } from '@/components/home/VirtualToursSection';
import { StoriesSection } from '@/components/home/StoriesSection';
import { CtaSection } from '@/components/home/CtaSection';
import { StatsSection } from '@/components/home/StatsSection';
import { RegionsSection } from '@/components/home/RegionsSection';
import { UpcomingEventsSection } from '@/components/home/UpcomingEventsSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { NewsletterSection } from '@/components/home/NewsletterSection';

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Heritage Guide | Discover World Heritage Sites & Virtual Tours</title>
        <meta 
          name="description" 
          content="Explore 500+ UNESCO World Heritage Sites through immersive virtual tours. Discover ancient temples, historic cities, and natural wonders from around the world." 
        />
        <meta name="keywords" content="heritage tourism, virtual tours, UNESCO sites, travel guide, cultural heritage" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <HeroSection />
          <StatsSection />
          <FeaturedDestinations />
          <RegionsSection />
          <VirtualToursSection />
          <UpcomingEventsSection />
          <StoriesSection />
          <TestimonialsSection />
          <CtaSection />
          <NewsletterSection />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
