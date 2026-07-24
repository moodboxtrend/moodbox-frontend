import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { categoryService } from '@/services/categoryService';

export const useCategories = (params) =>
  useQuery({
    queryKey: ['categories', params],
    queryFn: () => categoryService.list(params),
    keepPreviousData: true,
  });

export const useCategoryDropdown = (params) =>
  useQuery({
    queryKey: ['categories-dropdown', params],
    queryFn: () => categoryService.dropdown(params),
    staleTime: 60_000,
  });

export const useCreateCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: categoryService.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] });
      qc.invalidateQueries({ queryKey: ['categories-dropdown'] });
      toast.success('Category created successfully');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create category'),
  });
};

export const useUpdateCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }) => categoryService.update(id, formData),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] });
      qc.invalidateQueries({ queryKey: ['categories-dropdown'] });
      qc.invalidateQueries({ queryKey: ['subcategories'] });
      qc.invalidateQueries({ queryKey: ['subcategories-dropdown'] });
      toast.success('Category updated successfully');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update category'),
  });
};

export const useToggleCategoryStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: categoryService.toggleStatus,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] });
      qc.invalidateQueries({ queryKey: ['subcategories'] });
      qc.invalidateQueries({ queryKey: ['subcategories-dropdown'] });
      toast.success('Category and subcategories status updated');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update status'),
  });
};

export const useDeleteCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: categoryService.remove,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category deleted');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete category'),
  });
};
