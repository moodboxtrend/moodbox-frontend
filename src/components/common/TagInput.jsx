import { useState } from 'react';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export function TagInput({ value = [], onChange, placeholder = 'Type tags (comma separated)' }) {
  const [input, setInput] = useState('');

  const processInputText = (text) => {
    if (!text) return;
    const parts = text.split(',');
    const newTags = [];
    const currentList = [...value];

    parts.forEach((part) => {
      const trimmed = part.trim();
      if (trimmed && !currentList.includes(trimmed) && !newTags.includes(trimmed)) {
        newTags.push(trimmed);
        currentList.push(trimmed);
      }
    });

    if (newTags.length > 0) {
      onChange(currentList);
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    if (val.includes(',')) {
      const parts = val.split(',');
      const trailing = parts.pop();
      processInputText(parts.join(','));
      setInput(trailing);
    } else {
      setInput(val);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === ',' || e.key === 'Enter') {
      e.preventDefault();
      if (input.trim()) {
        processInputText(input);
        setInput('');
      }
    }
  };

  const handleBlur = () => {
    if (input.trim()) {
      processInputText(input);
      setInput('');
    }
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
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder={value.length === 0 ? placeholder : ''}
        className="border-0 shadow-none h-7 flex-1 min-w-[120px] px-1 focus-visible:ring-0"
      />
    </div>
  );
}

