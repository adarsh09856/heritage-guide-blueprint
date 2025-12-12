import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  location: z.string().optional(),
  event_date: z.string().optional(),
  end_date: z.string().optional(),
  image_url: z.string().optional(),
  culture_tag: z.string().optional(),
  is_published: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

interface EventFormProps {
  initialData?: Tables<'events'>;
  onSubmit: (data: FormData) => void;
  isLoading?: boolean;
}

export const EventForm = ({ initialData, onSubmit, isLoading }: EventFormProps) => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      location: initialData?.location || '',
      event_date: initialData?.event_date ? initialData.event_date.split('T')[0] : '',
      end_date: initialData?.end_date ? initialData.end_date.split('T')[0] : '',
      image_url: initialData?.image_url || '',
      culture_tag: initialData?.culture_tag || '',
      is_published: initialData?.is_published || false,
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Label htmlFor="title">Title *</Label>
        <Input id="title" {...register('title')} />
        {errors.title && <p className="text-sm text-destructive mt-1">{errors.title.message}</p>}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register('description')} rows={4} />
      </div>

      <div>
        <Label htmlFor="location">Location</Label>
        <Input id="location" {...register('location')} placeholder="City, Country" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="event_date">Start Date</Label>
          <Input id="event_date" type="date" {...register('event_date')} />
        </div>
        <div>
          <Label htmlFor="end_date">End Date</Label>
          <Input id="end_date" type="date" {...register('end_date')} />
        </div>
      </div>

      <div>
        <Label htmlFor="image_url">Image URL</Label>
        <Input id="image_url" {...register('image_url')} placeholder="https://..." />
      </div>

      <div>
        <Label htmlFor="culture_tag">Culture Tag</Label>
        <Input id="culture_tag" {...register('culture_tag')} placeholder="e.g., Japanese, Mexican, Indian" />
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
        {initialData ? 'Update Event' : 'Create Event'}
      </Button>
    </form>
  );
};
