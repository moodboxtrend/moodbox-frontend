import { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { WALLPAPER_ORIENTATIONS } from '@/constants/app';
import { Image } from 'lucide-react';

export function WallpaperExtraFields({ register, watch, setValue }) {
  const orientation = watch('wallpaperDetails.orientation') || 'Portrait';

  useEffect(() => {
    if (!watch('wallpaperDetails.resolution')) {
      setValue('wallpaperDetails.resolution', '1080x1920');
    }
  }, [setValue, watch]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Resolution</Label>
          <Input placeholder="e.g. 1080x1920" {...register('wallpaperDetails.resolution')} />
        </div>
        <div className="space-y-1.5">
          <Label>Orientation</Label>
          <Select value={orientation} onValueChange={(v) => setValue('wallpaperDetails.orientation', v)}>
            <SelectTrigger><SelectValue placeholder="Select orientation" /></SelectTrigger>
            <SelectContent>
              {WALLPAPER_ORIENTATIONS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="p-3 bg-muted/30 border rounded-lg flex items-center space-x-3 text-xs text-muted-foreground">
        <Image className="h-5 w-5 text-primary flex-shrink-0" />
        <span>
          Upload full vertical image (1080×1920) in the <strong>Featured Image</strong> field on the right. It will display in 9:16 portrait ratio on mobile devices with 1-tap Set Wallpaper support.
        </span>
      </div>
    </div>
  );
}
