import { Helmet } from 'react-helmet-async';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { StoryCard } from '@/components/cards/StoryCard';
import { useStories } from '@/hooks/useStories';
import { sampleStories } from '@/data/sampleData';
import { BookOpen, PenTool } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const Stories = () => {
  const { data: dbStories, isLoading } = useStories({ published: true });

  // Use database data or fall back to sample data
  const stories = dbStories?.length ? dbStories.map((s: any) => ({
    id: s.id,
    title: s.title,
    excerpt: s.excerpt || '',
    content: s.content || '',
    author: s.profiles?.display_name || 'Anonymous',
    authorAvatar: s.profiles?.avatar_url,
    imageUrl: s.image_url || '',
    publishedAt: s.published_at || s.created_at,
    tags: s.tags || [],
    destinationId: s.destination_id
  })) : sampleStories;

  const featuredStory = stories[0];

  return (
    <>
      <Helmet>
        <title>Heritage Stories | Heritage Guide - Tales from History</title>
        <meta 
          name="description" 
          content="Discover fascinating stories about world heritage sites, archaeological discoveries, conservation efforts, and expert insights from historians and explorers." 
        />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Navbar />
        
        {/* Hero */}
        <section className="pt-24 pb-16 bg-gradient-to-b from-earth/10 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-earth/10 mb-6">
                <BookOpen className="w-4 h-4 text-earth" />
                <span className="text-earth text-sm font-medium">Heritage Stories</span>
              </div>
              <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6">
                Tales from History
              </h1>
              <p className="text-muted-foreground text-lg mb-8">
                Discover fascinating stories, archaeological findings, and conservation efforts from experts and explorers around the world.
              </p>
              <Button variant="heritage" size="lg">
                <PenTool className="w-5 h-5" />
                Submit Your Story
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Story */}
        {!isLoading && featuredStory && (
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="relative rounded-2xl overflow-hidden">
                <img 
                  src={featuredStory.imageUrl}
                  alt={featuredStory.title}
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/60 to-transparent" />
                <div className="absolute inset-0 flex items-center">
                  <div className="max-w-xl p-8 md:p-12">
                    <span className="px-3 py-1 bg-gold text-foreground text-sm font-medium rounded-full">
                      Featured Story
                    </span>
                    <h2 className="font-serif text-2xl md:text-4xl font-bold text-sand mt-4 mb-4">
                      {featuredStory.title}
                    </h2>
                    <p className="text-sand/80 mb-6 line-clamp-3">
                      {featuredStory.excerpt}
                    </p>
                    <div className="flex items-center gap-3">
                      {featuredStory.authorAvatar && (
                        <img 
                          src={featuredStory.authorAvatar}
                          alt={featuredStory.author}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      )}
                      <div>
                        <p className="text-sand font-medium">{featuredStory.author}</p>
                        <p className="text-sand/60 text-sm">
                          {featuredStory.publishedAt && new Date(featuredStory.publishedAt).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Stories Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="font-serif text-2xl md:text-3xl font-bold mb-8">
              Latest Stories
            </h2>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-80 rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stories.map((story: any) => (
                  <StoryCard key={story.id} story={story} />
                ))}
              </div>
            )}
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Stories;
