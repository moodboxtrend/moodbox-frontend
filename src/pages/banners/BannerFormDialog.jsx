import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useCreateBanner, useUpdateBanner } from '@/hooks/useBanners';
import { CONTENT_TYPES } from '@/constants/app';

const DEFAULT_VALUES = {
  quoteText: '',
  emoji: '✨',
  type: 'general',
  bgGradientStart: '#1B1830',
  bgGradientEnd: '#2D2459',
  buttonText: 'Explore',
  status: 'active',
  order: 0,
};

function BannerPreview({ quoteText, emoji, bgGradientStart, bgGradientEnd, buttonText }) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-3 min-h-[140px] justify-between select-none"
      style={{ background: `linear-gradient(135deg, ${bgGradientStart}, ${bgGradientEnd})` }}
    >
      <div className="flex items-start gap-3">
        <span className="text-4xl leading-none">{emoji || '✨'}</span>
        <p className="text-white font-semibold text-base leading-snug flex-1">
          {quoteText || 'Your banner text will appear here…'}
        </p>
      </div>
      <div>
        <span className="inline-block rounded-full px-4 py-1.5 text-xs font-bold text-white border border-white/40 bg-white/10 backdrop-blur">
          {buttonText || 'Explore'}
        </span>
      </div>
    </div>
  );
}

export function BannerFormDialog({ open, onOpenChange, banner }) {
  const isEdit = !!banner;
  const { mutateAsync: createBanner, isPending: creating } = useCreateBanner();
  const { mutateAsync: updateBanner, isPending: updating } = useUpdateBanner();

  const { register, handleSubmit, control, reset, watch, formState: { errors } } = useForm({
    defaultValues: DEFAULT_VALUES,
  });

  const watched = watch();

  useEffect(() => {
    if (open) {
      reset(
        banner
          ? {
              quoteText: banner.quoteText,
              emoji: banner.emoji,
              type: banner.type,
              bgGradientStart: banner.bgGradientStart,
              bgGradientEnd: banner.bgGradientEnd,
              buttonText: banner.buttonText,
              status: banner.status,
              order: banner.order,
            }
          : DEFAULT_VALUES
      );
    }
  }, [open, banner, reset]);

  const onSubmit = async (values) => {
    const body = { ...values, order: Number(values.order) };
    if (isEdit) {
      await updateBanner({ id: banner._id, body });
    } else {
      await createBanner(body);
    }
    onOpenChange(false);
  };

  const isSubmitting = creating || updating;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Banner' : 'Create Banner'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update the banner details and gradient' : 'Add a new home screen banner slide'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Live Preview */}
          <div className="space-y-1.5">
            <Label>Live Preview</Label>
            <BannerPreview
              quoteText={watched.quoteText}
              emoji={watched.emoji}
              bgGradientStart={watched.bgGradientStart}
              bgGradientEnd={watched.bgGradientEnd}
              buttonText={watched.buttonText}
            />
          </div>

          {/* Quote Text */}
          <div className="space-y-1.5">
            <Label htmlFor="quoteText">Banner Text *</Label>
            <Input
              id="quoteText"
              placeholder={`"A good laugh is sunshine in the house."`}
              {...register('quoteText', { required: 'Banner text is required' })}
            />
            {errors.quoteText && <p className="text-xs text-destructive">{errors.quoteText.message}</p>}
          </div>

          {/* Emoji + Button Text row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="emoji">Emoji</Label>
              <Input id="emoji" placeholder="✨" {...register('emoji')} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="buttonText">Button Label</Label>
              <Input id="buttonText" placeholder="Explore" {...register('buttonText')} />
            </div>
          </div>

          {/* Gradient colors */}
          <div className="space-y-1.5">
            <Label>Background Gradient</Label>
            <div className="flex items-center gap-3">
              <div className="space-y-1 flex-1">
                <p className="text-xs text-muted-foreground">Start color</p>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    className="h-9 w-12 cursor-pointer rounded border border-border bg-transparent p-0.5"
                    {...register('bgGradientStart')}
                  />
                  <Input placeholder="#1B1830" {...register('bgGradientStart')} className="flex-1 font-mono text-sm" />
                </div>
              </div>
              <div className="pt-5 text-muted-foreground">→</div>
              <div className="space-y-1 flex-1">
                <p className="text-xs text-muted-foreground">End color</p>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    className="h-9 w-12 cursor-pointer rounded border border-border bg-transparent p-0.5"
                    {...register('bgGradientEnd')}
                  />
                  <Input placeholder="#2D2459" {...register('bgGradientEnd')} className="flex-1 font-mono text-sm" />
                </div>
              </div>
            </div>
          </div>

          {/* Gradient presets */}
          <div className="space-y-1.5">
            <Label>Quick Gradient Presets</Label>
            <Controller
              control={control}
              name="bgGradientStart"
              render={({ field: startField }) => (
                <Controller
                  control={control}
                  name="bgGradientEnd"
                  render={({ field: endField }) => (
                    <div className="flex flex-wrap gap-2">
                      {[
                        { label: 'Purple Night', start: '#1B1830', end: '#2D2459' },
                        { label: 'Rose Dark', start: '#2A1828', end: '#4A1D38' },
                        { label: 'Ocean Deep', start: '#1A1C38', end: '#252D5E' },
                        { label: 'Forest', start: '#0D2116', end: '#1A4231' },
                        { label: 'Amber', start: '#261A08', end: '#4A2F05' },
                        { label: 'Crimson', start: '#1E0808', end: '#3D1010' },
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          title={preset.label}
                          onClick={() => {
                            startField.onChange(preset.start);
                            endField.onChange(preset.end);
                          }}
                          className="h-8 w-8 rounded-lg border-2 border-transparent hover:border-primary transition-all shadow-sm"
                          style={{ background: `linear-gradient(135deg, ${preset.start}, ${preset.end})` }}
                        />
                      ))}
                    </div>
                  )}
                />
              )}
            />
          </div>

          {/* Type + Status row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Category Type</Label>
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

          {/* Order */}
          <div className="space-y-1.5">
            <Label htmlFor="order">Display Order</Label>
            <Input id="order" type="number" {...register('order')} />
            <p className="text-xs text-muted-foreground">Lower numbers appear first in the banner carousel</p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving…' : isEdit ? 'Save changes' : 'Create banner'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
