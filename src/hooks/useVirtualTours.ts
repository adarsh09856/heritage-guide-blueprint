import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type VirtualTour = Tables<'virtual_tours'>;
type VirtualTourInsert = TablesInsert<'virtual_tours'>;
type VirtualTourUpdate = TablesUpdate<'virtual_tours'>;

export function useVirtualTours(options?: { published?: boolean }) {
  return useQuery({
    queryKey: ['virtual_tours', options],
    queryFn: async () => {
      let query = supabase
        .from('virtual_tours')
        .select(`
          *,
          destinations (
            id,
            title,
            slug
          )
        `)
        .order('created_at', { ascending: false });
      
      if (options?.published !== undefined) {
        query = query.eq('is_published', options.published);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    }
  });
}

export function useVirtualTour(id: string) {
  return useQuery({
    queryKey: ['virtual_tour', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('virtual_tours')
        .select(`
          *,
          destinations (*)
        `)
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id
  });
}

export function useCreateVirtualTour() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (tour: VirtualTourInsert) => {
      const { data, error } = await supabase
        .from('virtual_tours')
        .insert(tour)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['virtual_tours'] });
    }
  });
}

export function useUpdateVirtualTour() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: VirtualTourUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('virtual_tours')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['virtual_tours'] });
      queryClient.invalidateQueries({ queryKey: ['virtual_tour', data.id] });
    }
  });
}

export function useDeleteVirtualTour() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('virtual_tours')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['virtual_tours'] });
    }
  });
}
