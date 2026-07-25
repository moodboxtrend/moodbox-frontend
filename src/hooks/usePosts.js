import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { postService } from '@/services/postService';

export const usePosts = (params) =>
  useQuery({
    queryKey: ['posts', params],
    queryFn: () => postService.list(params),
    keepPreviousData: true,
  });

export const usePost = (id) =>
  useQuery({
    queryKey: ['post', id],
    queryFn: () => postService.get(id),
    enabled: !!id,
  });

export const useCreatePost = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: postService.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Post created successfully');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create post'),
  });
};

export const useUpdatePost = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }) => postService.update(id, formData),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Post updated successfully');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update post'),
  });
};

export const useDeletePost = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: postService.remove,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Post deleted');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete post'),
  });
};

export const useBulkDeletePosts = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: postService.bulkDelete,
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['posts'] });
      toast.success(`${res.data.deletedCount} posts deleted`);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Bulk delete failed'),
  });
};

export const useBulkUpdatePostStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ ids, status }) => postService.bulkStatus(ids, status),
    onSuccess: (res, variables) => {
      qc.invalidateQueries({ queryKey: ['posts'] });
      toast.success(`${res.data.modifiedCount} posts marked as ${variables.status}`);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Bulk update failed'),
  });
};

export const useResetViews = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ ids, all }) => postService.resetViews(ids, all),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['posts'] });
      qc.invalidateQueries({ queryKey: ['analytics'] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success(res.message || 'Views reset to 0');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to reset views'),
  });
};
