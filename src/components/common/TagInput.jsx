import { useState } from 'react';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export function TagInput({ value = [], onChange, placeholder = 'Type and press Enter' }) {
  const [input, setInput] = useState('');

  const addTag = () => {
    const tag = input.trim();
    if (tag && !value.includes(tag)) {
      onChange([...value, tag]);
    }
    setInput('');
  };

  const removeTag = (tag) => onChange(value.filter((t) => t !== tag));

  return (
    <div className="rounded-xl border border-input bg-background px-3 py-2 flex flex-wrap gap-1.5 items-center focus-within:ring-2 focus-within:ring-ring">
      {value.map((tag) => (
        <Badge key={tag} variant="secondary" className="gap-1">
          {tag}
          <button type="button" onClick={() => removeTag(tag)}>
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag();
          }
        }}
        onBlur={addTag}
        placeholder={value.length === 0 ? placeholder : ''}
        className="border-0 shadow-none h-7 flex-1 min-w-[120px] px-1 focus-visible:ring-0"
      />
    </div>
  );
}
