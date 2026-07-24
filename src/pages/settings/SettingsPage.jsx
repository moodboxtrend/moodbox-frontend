import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { PageHeader } from '@/components/common/PageHeader';
import { ImageUploadField } from '@/components/common/ImageUploadField';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { settingsService } from '@/services/miscServices';

export default function SettingsPage() {
  const qc = useQueryClient();
  const [logoFile, setLogoFile] = useState(null);
  const [faviconFile, setFaviconFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const { data, isLoading } = useQuery({ queryKey: ['settings'], queryFn: settingsService.get });
  const settings = data?.data;

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (settings) {
      reset({
        websiteName: settings.websiteName,
        seoTitle: settings.seo?.defaultTitle,
        seoDescription: settings.seo?.defaultDescription,
        facebook: settings.social?.facebook,
        instagram: settings.social?.instagram,
        twitter: settings.social?.twitter,
        youtube: settings.social?.youtube,
        whatsapp: settings.social?.whatsapp,
      });
    }
  }, [settings, reset]);

  const onSubmit = async (values) => {
    setIsSaving(true);
    try {
      await settingsService.update({
        websiteName: values.websiteName,
        seo: { defaultTitle: values.seoTitle, defaultDescription: values.seoDescription },
        social: {
          facebook: values.facebook, instagram: values.instagram, twitter: values.twitter,
          youtube: values.youtube, whatsapp: values.whatsapp,
        },
      });
      if (logoFile) {
        const fd = new FormData(); fd.append('image', logoFile);
        await settingsService.uploadLogo(fd);
      }
      if (faviconFile) {
        const fd = new FormData(); fd.append('image', faviconFile);
        await settingsService.uploadFavicon(fd);
      }
      qc.invalidateQueries({ queryKey: ['settings'] });
      toast.success('Settings updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Configure your website branding, SEO defaults, and social links"
        actions={
          <Button onClick={handleSubmit(onSubmit)} disabled={isSaving}>
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save Settings
          </Button>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Branding</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>Website Name</Label>
              <Input {...register('websiteName')} />
            </div>
            <div className="space-y-1.5">
              <Label>Logo</Label>
              <ImageUploadField value={settings?.logo?.url} onChange={setLogoFile} />
            </div>
            <div className="space-y-1.5">
              <Label>Favicon</Label>
              <ImageUploadField value={settings?.favicon?.url} onChange={setFaviconFile} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>SEO Defaults</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>Default SEO Title</Label>
              <Input maxLength={70} {...register('seoTitle')} />
            </div>
            <div className="space-y-1.5">
              <Label>Default SEO Description</Label>
              <Textarea rows={3} maxLength={160} {...register('seoDescription')} />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Social Links</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label>Facebook</Label><Input placeholder="https://facebook.com/…" {...register('facebook')} /></div>
            <div className="space-y-1.5"><Label>Instagram</Label><Input placeholder="https://instagram.com/…" {...register('instagram')} /></div>
            <div className="space-y-1.5"><Label>Twitter / X</Label><Input placeholder="https://x.com/…" {...register('twitter')} /></div>
            <div className="space-y-1.5"><Label>YouTube</Label><Input placeholder="https://youtube.com/…" {...register('youtube')} /></div>
            <div className="space-y-1.5"><Label>WhatsApp</Label><Input placeholder="https://wa.me/…" {...register('whatsapp')} /></div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
