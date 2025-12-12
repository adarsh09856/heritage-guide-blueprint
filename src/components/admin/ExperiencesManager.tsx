import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, EyeOff, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useExperiences, useCreateExperience, useUpdateExperience, useDeleteExperience } from '@/hooks/useExperiences';
import { ExperienceForm } from './forms/ExperienceForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/types';

type Experience = Tables<'experiences'>;

export const ExperiencesManager = () => {
  const { data: experiences = [], isLoading } = useExperiences();
  const createMutation = useCreateExperience();
  const updateMutation = useUpdateExperience();
  const deleteMutation = useDeleteExperience();

  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Experience | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = experiences.filter(e =>
    e.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = async (data: any) => {
    try {
      await createMutation.mutateAsync(data);
      toast.success('Experience created!');
      setIsFormOpen(false);
    } catch (error) {
      toast.error('Failed to create experience');
    }
  };

  const handleUpdate = async (data: any) => {
    if (!editingItem) return;
    try {
      await updateMutation.mutateAsync({ id: editingItem.id, ...data });
      toast.success('Experience updated!');
      setEditingItem(null);
    } catch (error) {
      toast.error('Failed to update experience');
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteMutation.mutateAsync(deletingId);
      toast.success('Experience deleted!');
      setDeletingId(null);
    } catch (error) {
      toast.error('Failed to delete experience');
    }
  };

  const togglePublish = async (item: Experience) => {
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
          <h1 className="font-serif text-2xl font-bold">Experiences</h1>
          <p className="text-muted-foreground">Manage cultural experiences and activities</p>
        </div>
        <Button variant="gold" onClick={() => setIsFormOpen(true)}>
          <Plus className="w-4 h-4" />
          Add Experience
        </Button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search experiences..."
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
          {filtered.map((exp) => (
            <div key={exp.id} className="bg-background rounded-xl shadow-heritage-sm overflow-hidden">
              <div className="relative h-40">
                <img 
                  src={exp.image_url || '/placeholder.svg'}
                  alt={exp.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 flex gap-1">
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => togglePublish(exp)}
                  >
                    {exp.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => setEditingItem(exp)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="h-8 w-8 text-destructive"
                    onClick={() => setDeletingId(exp.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                {!exp.is_published && (
                  <div className="absolute top-3 left-3 px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                    Draft
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-1">{exp.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{exp.description}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="px-2 py-1 bg-secondary rounded-full text-xs capitalize">
                    {exp.type}
                  </span>
                  {exp.price && (
                    <span className="text-sm font-medium">${exp.price}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
              No experiences found
            </div>
          )}
        </div>
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Experience</DialogTitle>
          </DialogHeader>
          <ExperienceForm onSubmit={handleCreate} isLoading={createMutation.isPending} />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Experience</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <ExperienceForm 
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
            <AlertDialogTitle>Delete Experience?</AlertDialogTitle>
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
