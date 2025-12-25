import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useCreateStory } from '@/hooks/useStories';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Loader2, PenTool } from 'lucide-react';
import { Link } from 'react-router-dom';

const schema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title must be less than 200 characters'),
  excerpt: z.string().min(10, 'Excerpt must be at least 10 characters').max(500, 'Excerpt must be less than 500 characters'),
  content: z.string().min(50, 'Content must be at least 50 characters').max(50000, 'Content is too long'),
  image_url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  tags: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function SubmitStoryDialog() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const createMutation = useCreateStory();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      excerpt: '',
      content: '',
      image_url: '',
      tags: '',
    }
  });

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const onSubmit = async (data: FormData) => {
    if (!user) {
      toast.error('Please sign in to submit a story');
      return;
    }

    try {
      const tags = data.tags 
        ? data.tags.split(',').map(t => t.trim()).filter(Boolean)
        : [];

      await createMutation.mutateAsync({
        title: data.title,
        slug: generateSlug(data.title),
        excerpt: data.excerpt,
        content: data.content,
        image_url: data.image_url || null,
        tags,
        author_id: user.id,
        is_published: false, // Always submit as draft
      });

      toast.success('Story submitted successfully!', {
        description: 'Your story has been submitted for review. Our team will review it shortly.',
      });
      
      reset();
      setOpen(false);
    } catch (error: any) {
      toast.error('Failed to submit story', {
        description: error.message || 'Please try again later.',
      });
    }
  };

  // If not logged in, show login prompt
  if (!user) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="heritage" size="lg">
            <PenTool className="w-5 h-5" />
            Submit Your Story
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Sign in Required</DialogTitle>
            <DialogDescription>
              Please sign in to submit your heritage story.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 pt-4">
            <p className="text-muted-foreground text-sm">
              Share your knowledge, discoveries, and insights about world heritage sites with our community.
            </p>
            <Link to="/login" onClick={() => setOpen(false)}>
              <Button variant="heritage" className="w-full">
                Sign In to Continue
              </Button>
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="heritage" size="lg">
          <PenTool className="w-5 h-5" />
          Submit Your Story
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submit Your Heritage Story</DialogTitle>
          <DialogDescription>
            Share your insights, discoveries, or experiences related to world heritage sites. Your story will be reviewed before publishing.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pt-4">
          <div>
            <Label htmlFor="title">Story Title *</Label>
            <Input 
              id="title" 
              {...register('title')} 
              placeholder="e.g., The Secret Tunnels of Ancient Rome"
            />
            {errors.title && <p className="text-sm text-destructive mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <Label htmlFor="excerpt">Brief Summary *</Label>
            <Textarea 
              id="excerpt" 
              {...register('excerpt')} 
              rows={2}
              placeholder="A short summary of your story (will appear in previews)"
            />
            {errors.excerpt && <p className="text-sm text-destructive mt-1">{errors.excerpt.message}</p>}
          </div>

          <div>
            <Label htmlFor="content">Full Story *</Label>
            <Textarea 
              id="content" 
              {...register('content')} 
              rows={10}
              placeholder="Write your full story here. Include details about the heritage site, your experience, historical context, or discoveries..."
            />
            {errors.content && <p className="text-sm text-destructive mt-1">{errors.content.message}</p>}
          </div>

          <div>
            <Label htmlFor="image_url">Cover Image URL (optional)</Label>
            <Input 
              id="image_url" 
              {...register('image_url')} 
              placeholder="https://example.com/your-image.jpg"
            />
            {errors.image_url && <p className="text-sm text-destructive mt-1">{errors.image_url.message}</p>}
          </div>

          <div>
            <Label htmlFor="tags">Tags (optional)</Label>
            <Input 
              id="tags" 
              {...register('tags')} 
              placeholder="archaeology, discovery, UNESCO (comma separated)"
            />
            <p className="text-xs text-muted-foreground mt-1">Separate tags with commas</p>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              📝 Your story will be submitted as a draft and reviewed by our editorial team before publishing.
            </p>
          </div>

          <Button 
            type="submit" 
            variant="heritage" 
            className="w-full" 
            disabled={createMutation.isPending}
          >
            {createMutation.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            Submit Story for Review
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
