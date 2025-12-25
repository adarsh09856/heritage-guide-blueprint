import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, EyeOff, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDestinations, useCreateDestination, useUpdateDestination, useDeleteDestination } from '@/hooks/useDestinations';
import { DestinationForm } from './forms/DestinationForm';
import { BulkImportDestinations } from './BulkImportDestinations';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/types';

type Destination = Tables<'destinations'>;

export const DestinationsManager = () => {
  const { data: destinations = [], isLoading } = useDestinations();
  const createMutation = useCreateDestination();
  const updateMutation = useUpdateDestination();
  const deleteMutation = useDeleteDestination();

  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Destination | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = destinations.filter(d =>
    d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (d.country?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  const handleCreate = async (data: any) => {
    try {
      await createMutation.mutateAsync(data);
      toast.success('Destination created!');
      setIsFormOpen(false);
    } catch (error) {
      toast.error('Failed to create destination');
    }
  };

  const handleUpdate = async (data: any) => {
    if (!editingItem) return;
    try {
      await updateMutation.mutateAsync({ id: editingItem.id, ...data });
      toast.success('Destination updated!');
      setEditingItem(null);
    } catch (error) {
      toast.error('Failed to update destination');
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteMutation.mutateAsync(deletingId);
      toast.success('Destination deleted!');
      setDeletingId(null);
    } catch (error) {
      toast.error('Failed to delete destination');
    }
  };

  const togglePublish = async (item: Destination) => {
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
          <h1 className="font-serif text-2xl font-bold">Destinations</h1>
          <p className="text-muted-foreground">Manage heritage site listings</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setIsImportOpen(true)}>
            <Upload className="w-4 h-4" />
            Bulk Import
          </Button>
          <Button variant="gold" onClick={() => setIsFormOpen(true)}>
            <Plus className="w-4 h-4" />
            Add Destination
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search destinations..."
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
          {filtered.map((dest) => (
            <div key={dest.id} className="bg-background rounded-xl shadow-heritage-sm overflow-hidden">
              <div className="relative h-40">
                <img 
                  src={dest.images?.[0] || '/placeholder.svg'}
                  alt={dest.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 flex gap-1">
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => togglePublish(dest)}
                  >
                    {dest.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => setEditingItem(dest)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="h-8 w-8 text-destructive"
                    onClick={() => setDeletingId(dest.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                {!dest.is_published && (
                  <div className="absolute top-3 left-3 px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                    Draft
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-1">{dest.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{dest.country}, {dest.region}</p>
                <div className="flex items-center justify-between">
                  <span className="px-2 py-1 bg-secondary rounded-full text-xs">
                    {dest.heritage_type}
                  </span>
                  {dest.is_featured && (
                    <span className="px-2 py-1 bg-gold/20 text-gold text-xs rounded-full">Featured</span>
                  )}
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              No destinations found
            </div>
          )}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Destination</DialogTitle>
          </DialogHeader>
          <DestinationForm onSubmit={handleCreate} isLoading={createMutation.isPending} />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Destination</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <DestinationForm 
              initialData={editingItem} 
              onSubmit={handleUpdate} 
              isLoading={updateMutation.isPending} 
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Destination?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this destination.
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

      {/* Bulk Import Dialog */}
      <BulkImportDestinations open={isImportOpen} onOpenChange={setIsImportOpen} />
    </>
  );
};
