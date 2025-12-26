import { Link } from 'react-router-dom';
import { Story } from '@/types/heritage';
import { ArrowRight, Calendar } from 'lucide-react';

interface StoryCardProps {
  story: Story;
}

export function StoryCard({ story }: StoryCardProps) {
  return (
    <article className="group card-heritage overflow-hidden">
      <Link to={`/stories/${story.id}`}>
        <div className="relative h-48 overflow-hidden">
          <img
            src={story.imageUrl}
            alt={story.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
        </div>
      </Link>
      
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          {story.tags.slice(0, 2).map((tag) => (
            <span 
              key={tag}
              className="px-2 py-1 text-xs font-medium bg-secondary rounded-full text-secondary-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <Link to={`/stories/${story.id}`}>
          <h3 className="font-serif text-lg font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {story.title}
          </h3>
        </Link>
        
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
          {story.excerpt}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {story.authorAvatar && (
              <img 
                src={story.authorAvatar} 
                alt={story.author}
                className="w-8 h-8 rounded-full object-cover"
              />
            )}
            <div>
              <p className="text-sm font-medium">{story.author}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(story.publishedAt).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </p>
            </div>
          </div>
          
          <Link 
            to={`/stories/${story.id}`}
            className="flex items-center gap-1 text-primary text-sm font-medium hover:gap-2 transition-all"
          >
            Read
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default StoryCard;
