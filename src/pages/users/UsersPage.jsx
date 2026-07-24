import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Plus, Trash2, Pencil, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '@/components/common/PageHeader';
import { EmptyState } from '@/components/common/EmptyState';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { Users as UsersIcon } from 'lucide-react';
import { userService } from '@/services/miscServices';
import { useAuth } from '@/contexts/AuthContext';

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const qc = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data, isLoading } = useQuery({ queryKey: ['users'], queryFn: userService.list });
  const users = data?.data || [];

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
    defaultValues: { name: '', email: '', password: '', role: 'editor' },
  });

  const openCreate = () => { setEditing(null); reset({ name: '', email: '', password: '', role: 'editor' }); setFormOpen(true); };
  const openEdit = (u) => { setEditing(u); reset({ name: u.name, email: u.email, role: u.role }); setFormOpen(true); };

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      if (editing) {
        await userService.update(editing._id, { name: values.name, role: values.role });
        toast.success('User updated successfully');
      } else {
        await userService.create(values);
        toast.success('User created successfully');
      }
      qc.invalidateQueries({ queryKey: ['users'] });
      setFormOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleActive = async (u) => {
    try {
      await userService.update(u._id, { isActive: !u.isActive });
      qc.invalidateQueries({ queryKey: ['users'] });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update user');
    }
  };

  return (
    <div>
      <PageHeader
        title="Team"
        description="Manage admin and editor accounts"
        actions={<Button onClick={openCreate}><Plus className="h-4 w-4" /> Add User</Button>}
      />

      <Card>
        {isLoading ? (
          <div className="p-6 text-center text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin mx-auto" /></div>
        ) : users.length === 0 ? (
          <EmptyState icon={UsersIcon} title="No team members yet" description="Add editors to help manage content" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="px-6 py-3 font-medium">User</th>
                  <th className="px-6 py-3 font-medium">Role</th>
                  <th className="px-6 py-3 font-medium">Active</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const initials = u.name?.split(' ').map((n) => n[0]).slice(0, 2).join('');
                  return (
                    <tr key={u._id} className="border-b border-border/60 last:border-0 hover:bg-secondary/40 transition">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={u.avatar?.url} />
                            <AvatarFallback>{initials}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{u.name}</p>
                            <p className="text-xs text-muted-foreground">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3"><Badge variant="secondary" className="capitalize">{u.role}</Badge></td>
                      <td className="px-6 py-3">
                        <Switch checked={u.isActive} onCheckedChange={() => toggleActive(u)} disabled={u._id === currentUser?.id} />
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openEdit(u)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost" size="icon" disabled={u._id === currentUser?.id}
                            onClick={() => setDeleteTarget(u)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit User' : 'Add User'}</DialogTitle>
            <DialogDescription>{editing ? 'Update team member details' : 'Invite a new admin or editor'}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Full Name</Label>
              <Input {...register('name', { required: 'Required' })} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input type="email" disabled={!!editing} {...register('email', { required: !editing && 'Required' })} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
            {!editing && (
              <div className="space-y-1.5">
                <Label>Password</Label>
                <Input type="password" {...register('password', { required: !editing && 'Required', minLength: { value: 6, message: 'Min 6 characters' } })} />
                {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
              </div>
            )}
            <div className="space-y-1.5">
              <Label>Role</Label>
              <Controller
                control={control} name="role"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving…' : 'Save'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        title={`Remove "${deleteTarget?.name}"?`}
        description="They will lose access to the admin panel immediately."
        isLoading={isDeleting}
        onConfirm={async () => {
          setIsDeleting(true);
          try {
            await userService.remove(deleteTarget._id);
            qc.invalidateQueries({ queryKey: ['users'] });
            toast.success('User removed');
            setDeleteTarget(null);
          } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to remove user');
          } finally {
            setIsDeleting(false);
          }
        }}
      />
    </div>
  );
}
