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

const experienceTypes = ['workshop', 'guided-tour', 'cultural-event', 'culinary', 'crafts', 'dance', 'music', 'festival'];

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  type: z.string().min(1, 'Type is required'),
  description: z.string().optional(),
  destination_id: z.string().optional(),
  image_url: z.string().optional(),
  duration: z.string().optional(),
  price: z.number().optional(),
  is_published: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

interface ExperienceFormProps {
  initialData?: Tables<'experiences'>;
  onSubmit: (data: FormData) => void;
  isLoading?: boolean;
}

export const ExperienceForm = ({ initialData, onSubmit, isLoading }: ExperienceFormProps) => {
  const { data: destinations = [] } = useDestinations();
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initialData?.title || '',
      type: initialData?.type || '',
      description: initialData?.description || '',
      destination_id: initialData?.destination_id || '',
      image_url: initialData?.image_url || '',
      duration: initialData?.duration || '',
      price: initialData?.price || undefined,
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">Type *</Label>
          <Select 
            value={watch('type')} 
            onValueChange={(v) => setValue('type', v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {experienceTypes.map(t => (
                <SelectItem key={t} value={t} className="capitalize">{t.replace('-', ' ')}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.type && <p className="text-sm text-destructive mt-1">{errors.type.message}</p>}
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
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register('description')} rows={4} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="duration">Duration</Label>
          <Input id="duration" {...register('duration')} placeholder="e.g., 2 hours" />
        </div>
        <div>
          <Label htmlFor="price">Price ($)</Label>
          <Input 
            id="price" 
            type="number" 
            step="0.01"
            {...register('price', { valueAsNumber: true })} 
          />
        </div>
      </div>

      <div>
        <Label htmlFor="image_url">Image URL</Label>
        <Input id="image_url" {...register('image_url')} placeholder="https://..." />
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
        {initialData ? 'Update Experience' : 'Create Experience'}
      </Button>
    </form>
  );
};
