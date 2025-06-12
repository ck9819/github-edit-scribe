
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/client';

export const useSupabaseQuery = (table, queryKey, filters = {}) => {
  return useQuery({
    queryKey: [queryKey, filters],
    queryFn: async () => {
      let query = supabase.from(table).select('*');
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          query = query.eq(key, value);
        }
      });
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
};

export const useSupabaseInsert = (table, queryKey) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newData) => {
      const { data, error } = await supabase
        .from(table)
        .insert([newData])
        .select();
      
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
  });
};

export const useSupabaseUpdate = (table, queryKey) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }) => {
      const { data, error } = await supabase
        .from(table)
        .update(updates)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
  });
};

export const useSupabaseDelete = (table, queryKey) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
  });
};
