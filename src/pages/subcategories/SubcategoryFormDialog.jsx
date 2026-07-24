import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useCreateSubcategory, useUpdateSubcategory } from '@/hooks/useSubcategories';
import { useCategoryDropdown } from '@/hooks/useCategories';

export function SubcategoryFormDialog({ open, onOpenChange, subcategory }) {
  const isEdit = !!subcategory;
  const { data: categoriesRes } = useCategoryDropdown();
  const categories = categoriesRes?.data || [];

  const { mutateAsync: createSub, isPending: creating } = useCreateSubcategory();
  const { mutateAsync: updateSub, isPending: updating } = useUpdateSubcategory();

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
    defaultValues: { name: '', category: '', description: '', status: 'active', order: 0 },
  });

  useEffect(() => {
    if (open) {
      reset(
        subcategory
          ? {
              name: subcategory.name,
              category: subcategory.category?._id || subcategory.category,
              description: subcategory.description,
              status: subcategory.status,
              order: subcategory.order,
            }
          : { name: '', category: '', description: '', status: 'active', order: 0 }
      );
    }
  }, [open, subcategory, reset]);

  const onSubmit = async (values) => {
    if (isEdit) {
      await updateSub({ id: subcategory._id, payload: values });
    } else {
      await createSub(values);
    }
    onOpenChange(false);
  };

  const isSubmitting = creating || updating;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Subcategory' : 'Create Subcategory'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update subcategory details' : 'Add a subcategory under a parent category'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Parent Category</Label>
            <Controller
              control={control}
              name="category"
              rules={{ required: 'Category is required' }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="e.g. Gujarati Jokes" {...register('name', { required: 'Name is required' })} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
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

          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={3} placeholder="Optional short description" {...register('description')} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving…' : isEdit ? 'Save changes' : 'Create subcategory'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
