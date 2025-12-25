import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, EyeOff, Globe, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useVirtualTours, useCreateVirtualTour, useUpdateVirtualTour, useDeleteVirtualTour } from '@/hooks/useVirtualTours';
import { VirtualTourForm } from './forms/VirtualTourForm';
import { VirtualTourPlayer } from '@/components/destination/VirtualTourPlayer';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/types';

type VirtualTour = Tables<'virtual_tours'>;

export const VirtualToursManager = () => {
  const { data: tours = [], isLoading } = useVirtualTours();
  const createMutation = useCreateVirtualTour();
  const updateMutation = useUpdateVirtualTour();
  const deleteMutation = useDeleteVirtualTour();

  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<VirtualTour | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [previewingTour, setPreviewingTour] = useState<VirtualTour | null>(null);

  const filtered = tours.filter(t =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = async (data: any) => {
    try {
      await createMutation.mutateAsync(data);
      toast.success('Virtual tour created!');
      setIsFormOpen(false);
    } catch (error) {
      toast.error('Failed to create virtual tour');
    }
  };

  const handleUpdate = async (data: any) => {
    if (!editingItem) return;
    try {
      await updateMutation.mutateAsync({ id: editingItem.id, ...data });
      toast.success('Virtual tour updated!');
      setEditingItem(null);
    } catch (error) {
      toast.error('Failed to update virtual tour');
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteMutation.mutateAsync(deletingId);
      toast.success('Virtual tour deleted!');
      setDeletingId(null);
    } catch (error) {
      toast.error('Failed to delete virtual tour');
    }
  };

  const togglePublish = async (item: VirtualTour) => {
    try {
      await updateMutation.mutateAsync({ id: item.id, is_published: !item.is_published });
      toast.success(item.is_published ? 'Unpublished' : 'Published');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-2xl font-bold">Virtual Tours</h1>
          <p className="text-muted-foreground">Manage 360° tours and video content</p>
        </div>
        <Button variant="gold" onClick={() => setIsFormOpen(true)}>
          <Plus className="w-4 h-4" />
          Add Virtual Tour
        </Button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search tours..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((tour) => (
            <div key={tour.id} className="bg-background rounded-xl shadow-heritage-sm overflow-hidden">
              <div className="relative h-40">
                <img 
                  src={tour.thumbnail_url || '/placeholder.svg'}
                  alt={tour.title}
                  className="w-full h-full object-cover"
                />
                <div 
                  className="absolute inset-0 bg-foreground/20 flex items-center justify-center cursor-pointer hover:bg-foreground/30 transition-colors"
                  onClick={() => setPreviewingTour(tour)}
                >
                  <div className="w-12 h-12 rounded-full bg-gold/90 flex items-center justify-center">
                    <Play className="w-6 h-6 text-foreground fill-current ml-0.5" />
                  </div>
                </div>
                <div className="absolute top-3 right-3 flex gap-1">
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={(e) => { e.stopPropagation(); togglePublish(tour); }}
                  >
                    {tour.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={(e) => { e.stopPropagation(); setEditingItem(tour); }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="h-8 w-8 text-destructive"
                    onClick={(e) => { e.stopPropagation(); setDeletingId(tour.id); }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                {!tour.is_published && (
                  <div className="absolute top-3 left-3 px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                    Draft
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-1">{tour.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{tour.description}</p>
                <div className="flex items-center gap-2 mt-3">
                  <span className="px-2 py-1 bg-secondary rounded-full text-xs uppercase">
                    {tour.tour_type || '360'}
                  </span>
                  {tour.duration && (
                    <span className="text-xs text-muted-foreground">{tour.duration}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              No virtual tours found
            </div>
          )}
        </div>
      )}

      {/* Preview Dialog */}
      <Dialog open={!!previewingTour} onOpenChange={() => setPreviewingTour(null)}>
        <DialogContent className="max-w-4xl p-0">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle>Preview: {previewingTour?.title}</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            {previewingTour && (
              <VirtualTourPlayer tour={previewingTour} />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Virtual Tour</DialogTitle>
          </DialogHeader>
          <VirtualTourForm onSubmit={handleCreate} isLoading={createMutation.isPending} />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Virtual Tour</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <VirtualTourForm 
              initialData={editingItem} 
              onSubmit={handleUpdate} 
              isLoading={updateMutation.isPending} 
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Virtual Tour?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
