import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDestinations } from '@/hooks/useDestinations';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  excerpt: z.string().optional().nullable(),
  content: z.string().optional().nullable(),
  image_url: z.string().optional().nullable(),
  destination_id: z.string().optional().nullable(),
  tags: z.array(z.string()).optional(),
  is_published: z.boolean().optional(),
  author_id: z.string().optional().nullable(),
});

type FormData = z.infer<typeof schema>;

interface StoryFormProps {
  initialData?: Tables<'stories'>;
  onSubmit: (data: FormData) => void;
  isLoading?: boolean;
}

export const StoryForm = ({ initialData, onSubmit, isLoading }: StoryFormProps) => {
  const { data: destinations = [] } = useDestinations();
  const { user } = useAuth();
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initialData?.title || '',
      slug: initialData?.slug || '',
      excerpt: initialData?.excerpt || '',
      content: initialData?.content || '',
      image_url: initialData?.image_url || '',
      destination_id: initialData?.destination_id || null,
      tags: initialData?.tags || [],
      is_published: initialData?.is_published || false,
      author_id: initialData?.author_id || user?.id || null,
    }
  });

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleFormSubmit = (data: FormData) => {
    // Clean up empty strings to null for optional fields
    const cleanedData = {
      ...data,
      excerpt: data.excerpt || null,
      content: data.content || null,
      image_url: data.image_url || null,
      destination_id: data.destination_id || null,
      author_id: data.author_id || user?.id || null,
    };
    onSubmit(cleanedData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            {...register('title')}
            onChange={(e) => {
              register('title').onChange(e);
              if (!initialData) {
                setValue('slug', generateSlug(e.target.value));
              }
            }}
          />
          {errors.title && <p className="text-sm text-destructive mt-1">{errors.title.message}</p>}
        </div>
        <div>
          <Label htmlFor="slug">Slug *</Label>
          <Input id="slug" {...register('slug')} />
          {errors.slug && <p className="text-sm text-destructive mt-1">{errors.slug.message}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="destination_id">Related Destination</Label>
        <Select 
          value={watch('destination_id') || 'none'} 
          onValueChange={(v) => setValue('destination_id', v === 'none' ? null : v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select destination" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            {destinations.map(d => (
              <SelectItem key={d.id} value={d.id}>{d.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea id="excerpt" {...register('excerpt')} rows={2} placeholder="Brief summary of the story..." />
      </div>

      <div>
        <Label htmlFor="content">Content</Label>
        <Textarea id="content" {...register('content')} rows={10} placeholder="Full story content..." />
      </div>

      <div>
        <Label htmlFor="image_url">Cover Image URL</Label>
        <Input id="image_url" {...register('image_url')} placeholder="https://..." />
      </div>

      <div>
        <Label htmlFor="tags">Tags (comma separated)</Label>
        <Input 
          id="tags" 
          placeholder="History, Archaeology, UNESCO"
          defaultValue={initialData?.tags?.join(', ') || ''}
          onChange={(e) => setValue('tags', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
        />
      </div>

      <div className="flex items-center gap-2">
        <Switch 
          id="is_published" 
          checked={watch('is_published')} 
          onCheckedChange={(v) => setValue('is_published', v)}
        />
        <Label htmlFor="is_published">Published</Label>
      </div>

      <Button type="submit" variant="gold" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        {initialData ? 'Update Story' : 'Create Story'}
      </Button>
    </form>
  );
};
