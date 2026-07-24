import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { STORY_TYPES, AGE_RATINGS } from '@/constants/app';

export function StoryExtraFields({ register, watch, setValue }) {
  const storyType = watch('storyDetails.storyType');
  const ageRating = watch('storyDetails.ageRating');

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="space-y-1.5">
        <Label>Reading Time (min)</Label>
        <Input type="number" {...register('storyDetails.readingTime')} />
      </div>
      <div className="space-y-1.5">
        <Label>Story Type</Label>
        <Select value={storyType} onValueChange={(v) => setValue('storyDetails.storyType', v)}>
          <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
          <SelectContent>
            {STORY_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label>Age Rating</Label>
        <Select value={ageRating} onValueChange={(v) => setValue('storyDetails.ageRating', v)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {AGE_RATINGS.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
