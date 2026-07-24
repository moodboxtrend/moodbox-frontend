import { useState } from 'react';
import { Plus, Search, Pencil, Trash2, FolderTree } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { EmptyState } from '@/components/common/EmptyState';
import { Pagination } from '@/components/common/Pagination';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useCategories, useToggleCategoryStatus, useDeleteCategory } from '@/hooks/useCategories';
import { useDebounce } from '@/hooks/useDebounce';
import { CONTENT_TYPES, CATEGORY_TYPE_COLORS } from '@/constants/app';
import { CategoryFormDialog } from './CategoryFormDialog';

export default function CategoriesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('all');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const debouncedSearch = useDebounce(search);
  const { data, isLoading } = useCategories({
    page, limit: 10, search: debouncedSearch, type: type === 'all' ? undefined : type,
  });
  const { mutate: toggleStatus } = useToggleCategoryStatus();
  const { mutateAsync: deleteCategory, isPending: deleting } = useDeleteCategory();

  const categories = data?.data || [];
  const meta = data?.meta;

  return (
    <div>
      <PageHeader
        title="Categories"
        description="Manage top-level content categories"
        actions={
          <Button onClick={() => { setEditing(null); setFormOpen(true); }}>
            <Plus className="h-4 w-4" /> New Category
          </Button>
        }
      />

      <Card className="mb-4">
        <div className="p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search categories…"
              className="pl-9"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <Select value={type} onValueChange={(v) => { setType(v); setPage(1); }}>
            <SelectTrigger className="sm:w-44"><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {CONTENT_TYPES.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card>
        {isLoading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
          </div>
        ) : categories.length === 0 ? (
          <EmptyState
            icon={FolderTree}
            title="No categories found"
            description="Create your first category to start organizing content"
            action={<Button onClick={() => setFormOpen(true)}><Plus className="h-4 w-4" /> New Category</Button>}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">Type</th>
                  <th className="px-6 py-3 font-medium">Posts</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat._id} className="border-b border-border/60 last:border-0 hover:bg-secondary/40 transition">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        {cat.image?.url ? (
                          <img src={cat.image.url} alt="" className="h-9 w-9 rounded-lg object-cover" />
                        ) : (
                          <div
                            className="h-9 w-9 rounded-lg flex items-center justify-center text-lg shadow-sm"
                            style={{ backgroundColor: cat.color ? `${cat.color}25` : 'rgba(109, 74, 255, 0.1)', color: cat.color || '#6D4AFF' }}
                          >
                            {cat.emoji || '🎁'}
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="font-medium">{cat.name}</span>
                          {cat.color && (
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                              <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: cat.color }} />
                              {cat.color}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <Badge variant={CATEGORY_TYPE_COLORS[cat.type] || 'secondary'}>{cat.type}</Badge>
                    </td>
                    <td className="px-6 py-3 text-muted-foreground">{cat.postCount ?? 0}</td>
                    <td className="px-6 py-3">
                      <Switch checked={cat.status === 'active'} onCheckedChange={() => toggleStatus(cat._id)} />
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => { setEditing(cat); setFormOpen(true); }}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(cat)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-4"><Pagination meta={meta} onPageChange={setPage} /></div>
          </div>
        )}
      </Card>

      <CategoryFormDialog open={formOpen} onOpenChange={setFormOpen} category={editing} />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        title={`Delete "${deleteTarget?.name}"?`}
        description="This cannot be undone. Categories with existing subcategories or posts cannot be deleted."
        isLoading={deleting}
        onConfirm={async () => {
          try {
            await deleteCategory(deleteTarget._id);
            setDeleteTarget(null);
          } catch {
            // error toast handled by hook
          }
        }}
      />
    </div>
  );
}
