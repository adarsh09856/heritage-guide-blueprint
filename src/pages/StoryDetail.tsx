import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { sampleStories, sampleDestinations } from '@/data/sampleData';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Clock, Share2, Bookmark, MapPin } from 'lucide-react';

const StoryDetail = () => {
  const { id } = useParams();
  const story = sampleStories.find(s => s.id === id);
  const relatedDestination = story?.destinationId 
    ? sampleDestinations.find(d => d.id === story.destinationId)
    : null;

  if (!story) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-2xl font-bold mb-4">Story not found</h1>
          <Link to="/stories">
            <Button variant="heritage">
              <ArrowLeft className="w-4 h-4" />
              Back to Stories
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{story.title} | Heritage Guide Stories</title>
        <meta name="description" content={story.excerpt} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />

        {/* Hero Image */}
        <section className="relative h-[50vh] min-h-[400px]">
          <img
            src={story.imageUrl}
            alt={story.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/40 to-transparent" />
          
          <Link 
            to="/stories" 
            className="absolute top-24 left-4 md:left-8 flex items-center gap-2 text-sand hover:text-gold transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Stories</span>
          </Link>

          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
            <div className="container mx-auto max-w-4xl">
              <div className="flex flex-wrap gap-2 mb-4">
                {story.tags.map((tag) => (
                  <span 
                    key={tag}
                    className="px-3 py-1 bg-sand/20 backdrop-blur-sm text-sand text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="font-serif text-3xl md:text-5xl font-bold text-sand mb-6">
                {story.title}
              </h1>
              <div className="flex items-center gap-6">
                {story.authorAvatar && (
                  <img 
                    src={story.authorAvatar}
                    alt={story.author}
                    className="w-12 h-12 rounded-full object-cover border-2 border-sand"
                  />
                )}
                <div>
                  <p className="text-sand font-medium">{story.author}</p>
                  <p className="text-sand/60 text-sm flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(story.publishedAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      5 min read
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Actions */}
              <div className="flex items-center justify-end gap-2 mb-8 pb-8 border-b border-border">
                <Button variant="ghost" size="sm">
                  <Bookmark className="w-4 h-4" />
                  Save
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
              </div>

              {/* Article Body */}
              <article className="prose prose-lg max-w-none">
                <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                  {story.excerpt}
                </p>
                
                <p className="leading-relaxed mb-6">
                  The discovery has sent ripples through the archaeological community, offering unprecedented insights into ancient civilizations and their sophisticated understanding of architecture, astronomy, and urban planning. Researchers from leading institutions around the world have begun collaborative efforts to study and preserve these remarkable findings.
                </p>

                <h2 className="font-serif text-2xl font-semibold mt-10 mb-4">The Discovery</h2>
                <p className="leading-relaxed mb-6">
                  Using advanced ground-penetrating radar and LIDAR technology, the team was able to map extensive underground structures that had remained hidden for centuries. The initial scans revealed a complex network of chambers, corridors, and what appears to be ceremonial spaces.
                </p>

                <blockquote className="border-l-4 border-gold pl-6 my-8 italic text-muted-foreground">
                  "This discovery fundamentally changes our understanding of the site's historical significance and the capabilities of its builders."
                </blockquote>

                <p className="leading-relaxed mb-6">
                  The findings suggest that the site was not merely a place of worship or habitation, but served multiple functions including astronomical observation, water management, and possibly even a center for advanced metallurgical practices.
                </p>

                <h2 className="font-serif text-2xl font-semibold mt-10 mb-4">Preservation Efforts</h2>
                <p className="leading-relaxed mb-6">
                  With new discoveries come new responsibilities. Conservation teams have been mobilized to ensure that the newly uncovered areas are protected from environmental damage and human interference. Advanced climate control systems are being installed to maintain optimal conditions within the chambers.
                </p>

                <p className="leading-relaxed mb-6">
                  International cooperation has been crucial in these efforts, with funding and expertise flowing in from organizations dedicated to cultural heritage preservation. The hope is that these discoveries will eventually be accessible to the public through carefully managed virtual tours and limited in-person visits.
                </p>

                <h2 className="font-serif text-2xl font-semibold mt-10 mb-4">What's Next</h2>
                <p className="leading-relaxed mb-6">
                  The research team plans to continue their investigation over the coming years, with several expeditions already scheduled. Each new scan reveals additional details, and archaeologists believe there may be even more significant discoveries waiting beneath the surface.
                </p>

                <p className="leading-relaxed">
                  For now, the world watches with anticipation as each new piece of the puzzle is uncovered, bringing us closer to understanding the remarkable achievements of our ancestors.
                </p>
              </article>

              {/* Related Destination */}
              {relatedDestination && (
                <div className="mt-12 p-6 bg-secondary/30 rounded-xl">
                  <h3 className="font-serif text-lg font-semibold mb-4">Related Destination</h3>
                  <Link 
                    to={`/destinations/${relatedDestination.id}`}
                    className="flex items-center gap-4 group"
                  >
                    <img 
                      src={relatedDestination.images[0]}
                      alt={relatedDestination.title}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="font-semibold group-hover:text-primary transition-colors">
                        {relatedDestination.title}
                      </h4>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {relatedDestination.country}
                      </p>
                    </div>
                  </Link>
                </div>
              )}

              {/* Author Bio */}
              <div className="mt-12 p-6 bg-card rounded-xl border border-border">
                <div className="flex items-start gap-4">
                  {story.authorAvatar && (
                    <img 
                      src={story.authorAvatar}
                      alt={story.author}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <h3 className="font-semibold mb-1">About {story.author}</h3>
                    <p className="text-sm text-muted-foreground">
                      A renowned archaeologist and heritage researcher with over 15 years of experience exploring ancient civilizations. Their work has been featured in National Geographic, Smithsonian, and numerous academic journals.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default StoryDetail;
