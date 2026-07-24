import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { userService } from '@/services/miscServices';

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit } = useForm({ defaultValues: { name: user?.name } });

  const initials = user?.name?.split(' ').map((n) => n[0]).slice(0, 2).join('') || 'A';

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      const { data } = await userService.update(user.id, { name: values.name });
      setUser((u) => ({ ...u, name: data.name }));
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader title="Profile" description="Your account information" />
      <Card className="max-w-lg">
        <CardContent className="p-6 space-y-5">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user?.avatar?.url} />
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user?.name}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <p className="text-xs text-muted-foreground capitalize mt-0.5">{user?.role}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Full Name</Label>
              <Input {...register('name', { required: true })} />
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
