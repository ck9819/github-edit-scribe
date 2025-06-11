
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Company = Database['public']['Tables']['company']['Row'];
type CompanyInsert = Database['public']['Tables']['company']['Insert'];
type ItemMaster = Database['public']['Tables']['itemmaster']['Row'];
type ItemMasterInsert = Database['public']['Tables']['itemmaster']['Insert'];
type Sales = Database['public']['Tables']['sales']['Row'];
type SalesInsert = Database['public']['Tables']['sales']['Insert'];

// Company hooks
export const useCompanies = () => {
  return useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('company')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useCompany = (buyerName: string) => {
  return useQuery({
    queryKey: ['company', buyerName],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('company')
        .select('*')
        .eq('buyername', buyerName)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!buyerName,
  });
};

export const useAddCompany = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (company: CompanyInsert) => {
      const { data, error } = await supabase
        .from('company')
        .insert(company)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
  });
};

// Item hooks
export const useItems = () => {
  return useQuery({
    queryKey: ['items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('itemmaster')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useGenerateItemId = () => {
  return useMutation({
    mutationFn: async (prefix: string = 'SKU') => {
      const { data, error } = await supabase.rpc('get_next_serial_number', {
        form_type_param: prefix
      });
      
      if (error) throw error;
      
      const paddedNumber = String(data).padStart(5, '0');
      return `YPE/${prefix}/${paddedNumber}`;
    },
  });
};

export const useAddItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (item: ItemMasterInsert) => {
      const { data, error } = await supabase
        .from('itemmaster')
        .insert(item)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
};

// Sales hooks
export const useSalesEnquiries = () => {
  return useQuery({
    queryKey: ['sales'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useSalesEnquiry = (id: string) => {
  return useQuery({
    queryKey: ['sales', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .eq('enquiry_id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};

export const useAddSalesEnquiry = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (sales: SalesInsert) => {
      const { data, error } = await supabase
        .from('sales')
        .insert(sales)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
    },
  });
};

// Serial number generation
export const useGenerateSerialNumber = () => {
  return useMutation({
    mutationFn: async ({ prefix, startYear, endYear }: { prefix: string; startYear: string; endYear: string }) => {
      const formType = prefix.split('/')[1];
      
      const { data, error } = await supabase.rpc('get_next_serial_number', {
        form_type_param: formType
      });
      
      if (error) throw error;
      
      const paddedNumber = String(data).padStart(5, '0');
      return `${prefix}/${startYear}-${endYear}/${paddedNumber}`;
    },
  });
};
