import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, EyeOff, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useStories, useCreateStory, useUpdateStory, useDeleteStory } from '@/hooks/useStories';
import { StoryForm } from './forms/StoryForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/types';

type Story = Tables<'stories'>;

export const StoriesManager = () => {
  const { data: stories = [], isLoading } = useStories();
  const createMutation = useCreateStory();
  const updateMutation = useUpdateStory();
  const deleteMutation = useDeleteStory();

  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Story | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = stories.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = async (data: any) => {
    try {
      await createMutation.mutateAsync(data);
      toast.success('Story created!');
      setIsFormOpen(false);
    } catch (error) {
      toast.error('Failed to create story');
    }
  };

  const handleUpdate = async (data: any) => {
    if (!editingItem) return;
    try {
      await updateMutation.mutateAsync({ id: editingItem.id, ...data });
      toast.success('Story updated!');
      setEditingItem(null);
    } catch (error) {
      toast.error('Failed to update story');
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteMutation.mutateAsync(deletingId);
      toast.success('Story deleted!');
      setDeletingId(null);
    } catch (error) {
      toast.error('Failed to delete story');
    }
  };

  const togglePublish = async (item: Story) => {
    try {
      await updateMutation.mutateAsync({ 
        id: item.id, 
        is_published: !item.is_published,
        published_at: !item.is_published ? new Date().toISOString() : null
      });
      toast.success(item.is_published ? 'Unpublished' : 'Published');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-2xl font-bold">Stories</h1>
          <p className="text-muted-foreground">Manage heritage stories and articles</p>
        </div>
        <Button variant="gold" onClick={() => setIsFormOpen(true)}>
          <Plus className="w-4 h-4" />
          Write Story
        </Button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search stories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : (
        <div className="space-y-4">
          {filtered.map((story) => (
            <div key={story.id} className="bg-background rounded-xl shadow-heritage-sm p-4 flex items-center gap-4">
              <img 
                src={story.image_url || '/placeholder.svg'}
                alt={story.title}
                className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold truncate">{story.title}</h3>
                  {!story.is_published && (
                    <span className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded">Draft</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-1">{story.excerpt}</p>
                <div className="flex items-center gap-3 mt-2">
                  {story.tags?.slice(0, 3).map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-secondary text-xs rounded-full">{tag}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => togglePublish(story)}
                >
                  {story.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => setEditingItem(story)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-destructive"
                  onClick={() => setDeletingId(story.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
              No stories found
            </div>
          )}
        </div>
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Write Story</DialogTitle>
            <DialogDescription>Create a new heritage story to share with your audience.</DialogDescription>
          </DialogHeader>
          <StoryForm onSubmit={handleCreate} isLoading={createMutation.isPending} />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Story</DialogTitle>
            <DialogDescription>Update the details of this heritage story.</DialogDescription>
          </DialogHeader>
          {editingItem && (
            <StoryForm 
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
            <AlertDialogTitle>Delete Story?</AlertDialogTitle>
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
