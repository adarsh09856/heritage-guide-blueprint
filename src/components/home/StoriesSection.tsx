import { sampleStories } from '@/data/sampleData';
import { StoryCard } from '@/components/cards/StoryCard';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export function StoriesSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-earth/10 mb-4">
              <BookOpen className="w-4 h-4 text-earth" />
              <span className="text-earth text-sm font-medium">Heritage Stories</span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold">
              Tales from History
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl">
              Discover fascinating stories, archaeological findings, and conservation efforts from experts and explorers around the world.
            </p>
          </div>
          <Link to="/stories" className="mt-6 md:mt-0">
            <Button variant="outline" className="group">
              Read All Stories
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sampleStories.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default StoriesSection;
