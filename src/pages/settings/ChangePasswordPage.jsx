import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authService } from '@/services/authService';

export default function ChangePasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      await authService.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      toast.success('Password changed successfully');
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader title="Change Password" description="Update your account password" />
      <Card className="max-w-lg">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Current Password</Label>
              <Input type="password" {...register('currentPassword', { required: 'Required' })} />
              {errors.currentPassword && <p className="text-xs text-destructive">{errors.currentPassword.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>New Password</Label>
              <Input type="password" {...register('newPassword', { required: 'Required', minLength: { value: 6, message: 'Min 6 characters' } })} />
              {errors.newPassword && <p className="text-xs text-destructive">{errors.newPassword.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Confirm New Password</Label>
              <Input type="password" {...register('confirm', { validate: (v) => v === watch('newPassword') || 'Passwords do not match' })} />
              {errors.confirm && <p className="text-xs text-destructive">{errors.confirm.message}</p>}
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />} Update Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
