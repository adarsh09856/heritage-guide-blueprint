import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type Destination = Tables<'destinations'>;
type DestinationInsert = TablesInsert<'destinations'>;
type DestinationUpdate = TablesUpdate<'destinations'>;

export function useDestinations(options?: { featured?: boolean; published?: boolean }) {
  return useQuery({
    queryKey: ['destinations', options],
    queryFn: async () => {
      let query = supabase
        .from('destinations')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (options?.featured) {
        query = query.eq('is_featured', true);
      }
      
      if (options?.published !== undefined) {
        query = query.eq('is_published', options.published);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as Destination[];
    }
  });
}

export function useDestination(id: string) {
  return useQuery({
    queryKey: ['destination', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      return data as Destination | null;
    },
    enabled: !!id
  });
}

export function useDestinationBySlug(slug: string) {
  return useQuery({
    queryKey: ['destination', 'slug', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();
      
      if (error) throw error;
      return data as Destination | null;
    },
    enabled: !!slug
  });
}

export function useCreateDestination() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (destination: DestinationInsert) => {
      const { data, error } = await supabase
        .from('destinations')
        .insert(destination)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['destinations'] });
    }
  });
}

export function useUpdateDestination() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: DestinationUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('destinations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['destinations'] });
      queryClient.invalidateQueries({ queryKey: ['destination', data.id] });
    }
  });
}

export function useDeleteDestination() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('destinations')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['destinations'] });
    }
  });
}
