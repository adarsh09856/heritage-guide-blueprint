import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { regions, heritageTypes, eras } from '@/data/sampleData';
import { Loader2 } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  region: z.string().min(1, 'Region is required'),
  country: z.string().optional(),
  heritage_type: z.string().min(1, 'Heritage type is required'),
  era: z.string().optional(),
  description: z.string().optional(),
  history: z.string().optional(),
  best_time_to_visit: z.string().optional(),
  is_published: z.boolean().optional(),
  is_featured: z.boolean().optional(),
  images: z.array(z.string()).optional(),
  features: z.array(z.string()).optional(),
});

type FormData = z.infer<typeof schema>;

interface DestinationFormProps {
  initialData?: Tables<'destinations'>;
  onSubmit: (data: FormData) => void;
  isLoading?: boolean;
}

export const DestinationForm = ({ initialData, onSubmit, isLoading }: DestinationFormProps) => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initialData?.title || '',
      slug: initialData?.slug || '',
      region: initialData?.region || '',
      country: initialData?.country || '',
      heritage_type: initialData?.heritage_type || '',
      era: initialData?.era || '',
      description: initialData?.description || '',
      history: initialData?.history || '',
      best_time_to_visit: initialData?.best_time_to_visit || '',
      is_published: initialData?.is_published || false,
      is_featured: initialData?.is_featured || false,
      images: initialData?.images || [],
      features: initialData?.features || [],
    }
  });

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="region">Region *</Label>
          <Select 
            value={watch('region')} 
            onValueChange={(v) => setValue('region', v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent>
              {regions.map(r => (
                <SelectItem key={r} value={r}>{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.region && <p className="text-sm text-destructive mt-1">{errors.region.message}</p>}
        </div>
        <div>
          <Label htmlFor="country">Country</Label>
          <Input id="country" {...register('country')} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="heritage_type">Heritage Type *</Label>
          <Select 
            value={watch('heritage_type')} 
            onValueChange={(v) => setValue('heritage_type', v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {heritageTypes.map(t => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.heritage_type && <p className="text-sm text-destructive mt-1">{errors.heritage_type.message}</p>}
        </div>
        <div>
          <Label htmlFor="era">Era</Label>
          <Select 
            value={watch('era') || ''} 
            onValueChange={(v) => setValue('era', v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select era" />
            </SelectTrigger>
            <SelectContent>
              {eras.map(e => (
                <SelectItem key={e} value={e}>{e}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register('description')} rows={3} />
      </div>

      <div>
        <Label htmlFor="history">History</Label>
        <Textarea id="history" {...register('history')} rows={4} />
      </div>

      <div>
        <Label htmlFor="best_time_to_visit">Best Time to Visit</Label>
        <Input id="best_time_to_visit" {...register('best_time_to_visit')} />
      </div>

      <div>
        <Label htmlFor="images">Image URLs (comma separated)</Label>
        <Textarea 
          id="images" 
          placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
          defaultValue={initialData?.images?.join(', ') || ''}
          onChange={(e) => setValue('images', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
          rows={2}
        />
      </div>

      <div>
        <Label htmlFor="features">Features (comma separated)</Label>
        <Input 
          id="features" 
          placeholder="UNESCO Site, Ancient Ruins, Museum"
          defaultValue={initialData?.features?.join(', ') || ''}
          onChange={(e) => setValue('features', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
        />
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Switch 
            id="is_published" 
            checked={watch('is_published')} 
            onCheckedChange={(v) => setValue('is_published', v)}
          />
          <Label htmlFor="is_published">Published</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch 
            id="is_featured" 
            checked={watch('is_featured')} 
            onCheckedChange={(v) => setValue('is_featured', v)}
          />
          <Label htmlFor="is_featured">Featured</Label>
        </div>
      </div>

      <Button type="submit" variant="gold" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        {initialData ? 'Update Destination' : 'Create Destination'}
      </Button>
    </form>
  );
};
