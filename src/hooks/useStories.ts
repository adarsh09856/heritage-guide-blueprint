import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type Story = Tables<'stories'>;
type StoryInsert = TablesInsert<'stories'>;
type StoryUpdate = TablesUpdate<'stories'>;

export function useStories(options?: { published?: boolean; limit?: number }) {
  return useQuery({
    queryKey: ['stories', options],
    queryFn: async () => {
      let query = supabase
        .from('stories')
        .select(`
          *,
          profiles:author_id (
            display_name,
            avatar_url
          ),
          destinations:destination_id (
            id,
            title,
            slug
          )
        `)
        .order('published_at', { ascending: false });
      
      if (options?.published !== undefined) {
        query = query.eq('is_published', options.published);
      }
      
      if (options?.limit) {
        query = query.limit(options.limit);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    }
  });
}

export function useStory(id: string) {
  return useQuery({
    queryKey: ['story', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stories')
        .select(`
          *,
          profiles:author_id (
            display_name,
            avatar_url
          ),
          destinations:destination_id (*)
        `)
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id
  });
}

export function useStoryBySlug(slug: string) {
  return useQuery({
    queryKey: ['story', 'slug', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stories')
        .select(`
          *,
          profiles:author_id (
            display_name,
            avatar_url
          ),
          destinations:destination_id (*)
        `)
        .eq('slug', slug)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!slug
  });
}

export function useCreateStory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (story: StoryInsert) => {
      const { data, error } = await supabase
        .from('stories')
        .insert(story)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stories'] });
    }
  });
}

export function useUpdateStory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: StoryUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('stories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['stories'] });
      queryClient.invalidateQueries({ queryKey: ['story', data.id] });
    }
  });
}

export function useDeleteStory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('stories')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stories'] });
    }
  });
}
