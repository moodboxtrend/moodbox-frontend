import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useCreateCategory, useUpdateCategory } from '@/hooks/useCategories';
import { CONTENT_TYPES } from '@/constants/app';

export function CategoryFormDialog({ open, onOpenChange, category }) {
  const isEdit = !!category;
  const { mutateAsync: createCategory, isPending: creating } = useCreateCategory();
  const { mutateAsync: updateCategory, isPending: updating } = useUpdateCategory();

  const { register, handleSubmit, control, reset, watch, setValue, formState: { errors } } = useForm({
    defaultValues: { name: '', type: 'general', emoji: '🎁', color: '#6D4AFF', status: 'active', order: 0 },
  });

  const currentColor = watch('color') || '#6D4AFF';

  useEffect(() => {
    if (open) {
      reset(
        category
          ? {
              name: category.name,
              type: category.type,
              emoji: category.emoji || '🎁',
              color: category.color || '#6D4AFF',
              status: category.status,
              order: category.order,
            }
          : { name: '', type: 'general', emoji: '🎁', color: '#6D4AFF', status: 'active', order: 0 }
      );
    }
  }, [open, category, reset]);

  const onSubmit = async (values) => {
    const formData = new FormData();
    Object.entries(values).forEach(([k, v]) => formData.append(k, v));

    if (isEdit) {
      await updateCategory({ id: category._id, formData });
    } else {
      await createCategory(formData);
    }
    onOpenChange(false);
  };

  const isSubmitting = creating || updating;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Category' : 'Create Category'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update category details' : 'Add a new top-level content category'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="e.g. Jokes" {...register('name', { required: 'Name is required' })} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="emoji">Emoji Icon</Label>
              <Input id="emoji" placeholder="e.g. 😂" {...register('emoji')} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="color">Theme Color</Label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  id="colorPicker"
                  value={currentColor.startsWith('#') && currentColor.length === 7 ? currentColor : '#6D4AFF'}
                  onChange={(e) => setValue('color', e.target.value)}
                  className="h-9 w-10 p-0.5 rounded cursor-pointer border border-input bg-transparent"
                />
                <Input id="color" placeholder="#6D4AFF" className="flex-1" {...register('color')} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CONTENT_TYPES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="order">Display order</Label>
            <Input id="order" type="number" {...register('order')} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving…' : isEdit ? 'Save changes' : 'Create category'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
