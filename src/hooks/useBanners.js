import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { bannerService } from '@/services/bannerService';

const KEY = 'banners';

export const useBanners = () =>
  useQuery({
    queryKey: [KEY],
    queryFn: bannerService.list,
  });

export const useCreateBanner = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: bannerService.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [KEY] });
      toast.success('Banner created');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create banner'),
  });
};

export const useUpdateBanner = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }) => bannerService.update(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [KEY] });
      toast.success('Banner updated');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update banner'),
  });
};

export const useDeleteBanner = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: bannerService.remove,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [KEY] });
      toast.success('Banner deleted');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete banner'),
  });
};

export const useReorderBanners = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: bannerService.reorder,
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
    onError: (err) => toast.error(err.response?.data?.message || 'Reorder failed'),
  });
};
