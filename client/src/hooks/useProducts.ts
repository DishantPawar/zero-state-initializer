
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { Product, InsertProduct } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await apiRequest('/api/products');
      return response as Product[];
    }
  });
};

export const useProduct = (id: string | undefined) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      if (!id) return null;
      const response = await apiRequest(`/api/products/${id}`);
      return response as Product;
    },
    enabled: !!id
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (product: InsertProduct) => {
      const response = await apiRequest('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      return response as Product;
    },
    onSuccess: (newProduct) => {
      // Invalidate and refetch products list
      queryClient.invalidateQueries({ queryKey: ['products'] });
      // Also add the new product to cache immediately for instant display
      queryClient.setQueryData(['products'], (oldData: Product[] | undefined) => {
        if (oldData) {
          return [...oldData, newProduct];
        }
        return [newProduct];
      });
      toast({
        title: "Success",
        description: "Product created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create product: " + error.message,
        variant: "destructive",
      });
    }
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<InsertProduct> & { id: string }) => {
      const response = await apiRequest(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      return response as Product;
    },
    onSuccess: (updatedProduct, variables) => {
      const { id } = variables;
      
      // Update products list cache
      queryClient.setQueryData(['products'], (oldData: Product[] | undefined) => {
        if (oldData) {
          return oldData.map(product => 
            product.id === id ? updatedProduct : product
          );
        }
        return [updatedProduct];
      });
      
      // Update individual product cache
      queryClient.setQueryData(['product', id], updatedProduct);
      
      // Invalidate to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', id] });
      
      toast({
        title: "Success",
        description: "Product updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update product: " + error.message,
        variant: "destructive",
      });
    }
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiRequest(`/api/products/${id}`, {
        method: 'DELETE'
      });
      return id;
    },
    onSuccess: (deletedId) => {
      // Remove from products list cache immediately
      queryClient.setQueryData(['products'], (oldData: Product[] | undefined) => {
        if (oldData) {
          return oldData.filter(product => product.id !== deletedId);
        }
        return [];
      });
      
      // Remove individual product cache
      queryClient.removeQueries({ queryKey: ['product', deletedId] });
      
      // Invalidate to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['products'] });
      
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete product: " + error.message,
        variant: "destructive",
      });
    }
  });
};
