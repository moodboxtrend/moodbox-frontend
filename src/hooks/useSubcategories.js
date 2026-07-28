import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { subcategoryService } from '@/services/subcategoryService';

export const useSubcategories = (params) =>
  useQuery({
    queryKey: ['subcategories', params],
    queryFn: () => subcategoryService.list(params),
    keepPreviousData: true,
  });

export const useSubcategoryDropdown = (categoryId) =>
  useQuery({
    queryKey: ['subcategories-dropdown', categoryId],
    queryFn: () => subcategoryService.dropdown({ category: categoryId }),
    enabled: !!categoryId,
    staleTime: 60_000,
  });

export const useCreateSubcategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: subcategoryService.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['subcategories'] });
      qc.invalidateQueries({ queryKey: ['subcategories-dropdown'] });
      toast.success('Subcategory created successfully');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create subcategory'),
  });
};

export const useUpdateSubcategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => subcategoryService.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['subcategories'] });
      toast.success('Subcategory updated successfully');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update subcategory'),
  });
};

export const useToggleSubcategoryStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: subcategoryService.toggleStatus,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['subcategories'] });
      toast.success('Status updated');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update status'),
  });
};

export const useDeleteSubcategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: subcategoryService.remove,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['subcategories'] });
      toast.success('Subcategory deleted');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete subcategory'),
  });
};

export const useReorderSubcategories = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: subcategoryService.reorder,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['subcategories'] });
      qc.invalidateQueries({ queryKey: ['subcategories-dropdown'] });
      toast.success('Subcategories reordered successfully');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to reorder subcategories'),
  });
};

