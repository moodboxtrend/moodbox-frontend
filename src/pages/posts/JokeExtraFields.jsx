import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { JOKE_TYPES, LANGUAGES } from '@/constants/app';

export function JokeExtraFields({ watch, setValue }) {
  const jokeType = watch('jokeDetails.jokeType');
  const language = watch('jokeDetails.language');

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="space-y-1.5">
        <Label>Joke Type</Label>
        <Select value={jokeType} onValueChange={(v) => setValue('jokeDetails.jokeType', v)}>
          <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
          <SelectContent>
            {JOKE_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label>Language</Label>
        <Select value={language} onValueChange={(v) => setValue('jokeDetails.language', v)}>
          <SelectTrigger><SelectValue placeholder="Select language" /></SelectTrigger>
          <SelectContent>
            {LANGUAGES.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
