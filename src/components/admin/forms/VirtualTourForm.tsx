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
import { useFileUpload } from '@/hooks/useFileUpload';
import { Loader2, Upload, Image as ImageIcon } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import type { Tables } from '@/integrations/supabase/types';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional().nullable(),
  destination_id: z.string().optional().nullable(),
  thumbnail_url: z.string().optional().nullable(),
  tour_url: z.string().optional().nullable(),
  tour_type: z.string().optional().nullable(),
  duration: z.string().optional().nullable(),
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
  const { upload, isUploading } = useFileUpload();
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      destination_id: initialData?.destination_id || null,
      thumbnail_url: initialData?.thumbnail_url || '',
      tour_url: initialData?.tour_url || '',
      tour_type: initialData?.tour_type || '360',
      duration: initialData?.duration || '',
      is_published: initialData ? initialData.is_published : true,
    }
  });

  const handleFormSubmit = (data: FormData) => {
    // Clean up empty strings to null for optional fields
    const cleanedData = {
      ...data,
      description: data.description || null,
      destination_id: data.destination_id || null,
      thumbnail_url: data.thumbnail_url || null,
      tour_url: data.tour_url || null,
      duration: data.duration || null,
    };
    onSubmit(cleanedData);
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      const url = await upload(file, 'images');
      setValue('thumbnail_url', url);
      toast({ title: 'Thumbnail uploaded successfully' });
    } catch (error) {
      toast({ title: 'Failed to upload thumbnail', variant: 'destructive' });
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      const url = await upload(file, 'videos');
      setValue('tour_url', url);
      toast({ title: 'Video uploaded successfully' });
    } catch (error) {
      toast({ title: 'Failed to upload video', variant: 'destructive' });
    }
  };

  const thumbnailUrl = watch('thumbnail_url');

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div>
        <Label htmlFor="title">Title *</Label>
        <Input id="title" {...register('title')} />
        {errors.title && <p className="text-sm text-destructive mt-1">{errors.title.message}</p>}
      </div>

      <div>
        <Label htmlFor="destination_id">Linked Destination</Label>
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
        <Label>Thumbnail Image</Label>
        <div className="space-y-2">
          {thumbnailUrl && (
            <div className="w-32 h-20 rounded overflow-hidden">
              <img src={thumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex gap-2 items-center">
            <label className="cursor-pointer">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleThumbnailUpload} 
                className="hidden" 
                disabled={isUploading}
              />
              <Button type="button" variant="outline" size="sm" asChild disabled={isUploading}>
                <span>
                  {isUploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
                  Upload Image
                </span>
              </Button>
            </label>
            <span className="text-sm text-muted-foreground">or</span>
            <Input 
              {...register('thumbnail_url')} 
              placeholder="https://..." 
              className="flex-1"
            />
          </div>
        </div>
      </div>

      <div>
        <Label>Tour Content</Label>
        <p className="text-sm text-muted-foreground mb-2">
          Upload a video or provide an external tour URL (YouTube, Vimeo, Matterport, etc.)
        </p>
        <div className="flex gap-2 items-center">
          <label className="cursor-pointer">
            <input 
              type="file" 
              accept="video/*" 
              onChange={handleVideoUpload} 
              className="hidden" 
              disabled={isUploading}
            />
            <Button type="button" variant="outline" size="sm" asChild disabled={isUploading}>
              <span>
                {isUploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
                Upload Video
              </span>
            </Button>
          </label>
          <span className="text-sm text-muted-foreground">or</span>
          <Input 
            {...register('tour_url')} 
            placeholder="https://youtube.com/... or https://matterport.com/..." 
            className="flex-1"
          />
        </div>
        {watch('tour_url') && (
          <p className="text-xs text-muted-foreground mt-1">
            Current: {watch('tour_url')?.substring(0, 50)}...
          </p>
        )}
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
