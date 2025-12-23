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
import { Loader2 } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  destination_id: z.string().optional(),
  thumbnail_url: z.string().optional(),
  tour_url: z.string().optional(),
  tour_type: z.string().optional(),
  duration: z.string().optional(),
  is_published: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

interface VirtualTourFormProps {
  initialData?: Tables<'virtual_tours'>;
  onSubmit: (data: FormData) => void;
  isLoading?: boolean;
}

export const VirtualTourForm = ({ initialData, onSubmit, isLoading }: VirtualTourFormProps) => {
  const { data: destinations = [] } = useDestinations();
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      destination_id: initialData?.destination_id || '',
      thumbnail_url: initialData?.thumbnail_url || '',
      tour_url: initialData?.tour_url || '',
      tour_type: initialData?.tour_type || '360',
      duration: initialData?.duration || '',
      is_published: initialData ? initialData.is_published : true, // Default to published for new items
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
        <Label htmlFor="destination_id">Linked Destination</Label>
        <Select 
          value={watch('destination_id') || ''} 
          onValueChange={(v) => setValue('destination_id', v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select destination" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">None</SelectItem>
            {destinations.map(d => (
              <SelectItem key={d.id} value={d.id}>{d.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register('description')} rows={3} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="tour_type">Tour Type</Label>
          <Select 
            value={watch('tour_type') || '360'} 
            onValueChange={(v) => setValue('tour_type', v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="360">360° Tour</SelectItem>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="3d">3D Model</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="duration">Duration</Label>
          <Input id="duration" {...register('duration')} placeholder="e.g., 15 mins" />
        </div>
      </div>

      <div>
        <Label htmlFor="thumbnail_url">Thumbnail URL</Label>
        <Input id="thumbnail_url" {...register('thumbnail_url')} placeholder="https://..." />
      </div>

      <div>
        <Label htmlFor="tour_url">Tour URL</Label>
        <Input id="tour_url" {...register('tour_url')} placeholder="https://..." />
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
        {initialData ? 'Update Tour' : 'Create Tour'}
      </Button>
    </form>
  );
};
