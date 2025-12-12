import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type Experience = Tables<'experiences'>;
type ExperienceInsert = TablesInsert<'experiences'>;
type ExperienceUpdate = TablesUpdate<'experiences'>;

export function useExperiences(options?: { published?: boolean; type?: string }) {
  return useQuery({
    queryKey: ['experiences', options],
    queryFn: async () => {
      let query = supabase
        .from('experiences')
        .select(`
          *,
          destinations:destination_id (
            id,
            title,
            slug
          )
        `)
        .order('created_at', { ascending: false });
      
      if (options?.published !== undefined) {
        query = query.eq('is_published', options.published);
      }
      
      if (options?.type) {
        query = query.eq('type', options.type);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    }
  });
}

export function useExperience(id: string) {
  return useQuery({
    queryKey: ['experience', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('experiences')
        .select(`
          *,
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

export function useCreateExperience() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (experience: ExperienceInsert) => {
      const { data, error } = await supabase
        .from('experiences')
        .insert(experience)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
    }
  });
}

export function useUpdateExperience() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: ExperienceUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('experiences')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
      queryClient.invalidateQueries({ queryKey: ['experience', data.id] });
    }
  });
}

export function useDeleteExperience() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('experiences')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
    }
  });
}
