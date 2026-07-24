import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, FileText, FolderTree, ListTree } from 'lucide-react';
import { searchService } from '@/services/miscServices';
import { useDebounce } from '@/hooks/useDebounce';
import { Input } from '@/components/ui/input';

export function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const debounced = useDebounce(query, 350);

  const { data } = useQuery({
    queryKey: ['global-search', debounced],
    queryFn: () => searchService.global(debounced),
    enabled: debounced.length > 1,
  });

  const results = data?.data;
  const hasResults = results && (results.posts.length || results.categories.length || results.subcategories.length);

  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search posts, categories…"
        className="pl-9"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 150)}
      />
      {focused && debounced.length > 1 && (
        <div className="absolute mt-2 w-full rounded-xl border border-border bg-popover shadow-glass-lg z-50 max-h-80 overflow-y-auto scrollbar-thin animate-fade-in">
          {!hasResults && <p className="px-4 py-3 text-sm text-muted-foreground">No results found</p>}
          {results?.posts?.map((p) => (
            <div key={p._id} className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-secondary text-sm cursor-pointer">
              <FileText className="h-4 w-4 text-primary shrink-0" />
              <span className="truncate">{p.title}</span>
            </div>
          ))}
          {results?.categories?.map((c) => (
            <div key={c._id} className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-secondary text-sm cursor-pointer">
              <FolderTree className="h-4 w-4 text-accent-foreground shrink-0" />
              <span className="truncate">{c.name}</span>
            </div>
          ))}
          {results?.subcategories?.map((s) => (
            <div key={s._id} className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-secondary text-sm cursor-pointer">
              <ListTree className="h-4 w-4 text-success shrink-0" />
              <span className="truncate">{s.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
