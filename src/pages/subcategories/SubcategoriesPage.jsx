import { useState } from 'react';
import { Plus, Search, Pencil, Trash2, ListTree, GripVertical, ArrowUp, ArrowDown } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { EmptyState } from '@/components/common/EmptyState';
import { Pagination } from '@/components/common/Pagination';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useSubcategories, useToggleSubcategoryStatus, useDeleteSubcategory, useReorderSubcategories } from '@/hooks/useSubcategories';
import { useCategoryDropdown } from '@/hooks/useCategories';
import { useDebounce } from '@/hooks/useDebounce';
import { SubcategoryFormDialog } from './SubcategoryFormDialog';

export default function SubcategoriesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [draggedIdx, setDraggedIdx] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);

  const debouncedSearch = useDebounce(search);
  const { data: categoriesRes } = useCategoryDropdown();
  const categories = categoriesRes?.data || [];

  const { data, isLoading } = useSubcategories({
    page,
    limit: categoryFilter !== 'all' ? 50 : 20,
    search: debouncedSearch,
    category: categoryFilter === 'all' ? undefined : categoryFilter,
  });
  const { mutate: toggleStatus } = useToggleSubcategoryStatus();
  const { mutateAsync: deleteSubcategory, isPending: deleting } = useDeleteSubcategory();
  const { mutate: reorderSubcategories } = useReorderSubcategories();

  const subcategories = data?.data || [];
  const meta = data?.meta;

  const handleDrop = (targetIndex) => {
    if (draggedIdx === null || draggedIdx === targetIndex) return;
    const newList = [...subcategories];
    const [draggedItem] = newList.splice(draggedIdx, 1);
    newList.splice(targetIndex, 0, draggedItem);

    const items = newList.map((item, idx) => ({ id: item._id, order: idx }));
    reorderSubcategories(items);
    setDraggedIdx(null);
    setDragOverIdx(null);
  };

  const handleMove = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= subcategories.length) return;
    const newList = [...subcategories];
    const [item] = newList.splice(index, 1);
    newList.splice(targetIndex, 0, item);

    const items = newList.map((it, idx) => ({ id: it._id, order: idx }));
    reorderSubcategories(items);
  };

  return (
    <div>
      <PageHeader
        title="Subcategories"
        description="Manage subcategories within each content category"
        actions={
          <Button onClick={() => { setEditing(null); setFormOpen(true); }}>
            <Plus className="h-4 w-4" /> New Subcategory
          </Button>
        }
      />

      {/* Info card */}
      <Card className="mb-4 p-4 border-primary/20 bg-primary/5">
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          💡 Drag subcategory rows using the drag handle <GripVertical className="h-4 w-4 inline text-foreground" /> or use the arrow buttons to change order. The order is automatically saved and updated across the app.
        </p>
      </Card>

      <Card className="mb-4">
        <div className="p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search subcategories…"
              className="pl-9"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <Select value={categoryFilter} onValueChange={(v) => { setCategoryFilter(v); setPage(1); }}>
            <SelectTrigger className="sm:w-52"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((c) => <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card>
        {isLoading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
          </div>
        ) : subcategories.length === 0 ? (
          <EmptyState
            icon={ListTree}
            title="No subcategories found"
            description="Create a subcategory to organize content within a category"
            action={<Button onClick={() => setFormOpen(true)}><Plus className="h-4 w-4" /> New Subcategory</Button>}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="w-24 px-4 py-3 font-medium text-center">Order</th>
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">Parent Category</th>
                  <th className="px-6 py-3 font-medium">Posts</th>
                  <th className="px-6 py-3 font-medium">Status (show in app)</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subcategories.map((sub, index) => {
                  const isDragging = draggedIdx === index;
                  const isDragOver = dragOverIdx === index;

                  return (
                    <tr
                      key={sub._id}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', String(index));
                        setDraggedIdx(index);
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragOverIdx(index);
                      }}
                      onDragLeave={() => setDragOverIdx(null)}
                      onDrop={(e) => {
                        e.preventDefault();
                        handleDrop(index);
                      }}
                      onDragEnd={() => {
                        setDraggedIdx(null);
                        setDragOverIdx(null);
                      }}
                      className={`border-b border-border/60 last:border-0 hover:bg-secondary/40 transition select-none ${
                        isDragging ? 'opacity-40 bg-secondary/60' : ''
                      } ${isDragOver ? 'bg-primary/10 border-t-2 border-t-primary' : ''}`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <GripVertical className="h-4 w-4 text-muted-foreground/60 cursor-grab active:cursor-grabbing hover:text-foreground" />
                          <span className="text-xs font-mono text-muted-foreground w-4 text-center">{sub.order ?? index}</span>
                          <div className="flex flex-col">
                            <button
                              type="button"
                              disabled={index === 0}
                              onClick={() => handleMove(index, -1)}
                              className="p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30"
                              title="Move Up"
                            >
                              <ArrowUp className="h-3 w-3" />
                            </button>
                            <button
                              type="button"
                              disabled={index === subcategories.length - 1}
                              onClick={() => handleMove(index, 1)}
                              className="p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30"
                              title="Move Down"
                            >
                              <ArrowDown className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3 font-medium">{sub.name}</td>
                      <td className="px-6 py-3 text-muted-foreground">{sub.category?.name}</td>
                      <td className="px-6 py-3 text-muted-foreground">{sub.postCount ?? 0}</td>
                      <td className="px-6 py-3">
                        <Switch checked={sub.status === 'active'} onCheckedChange={() => toggleStatus(sub._id)} />
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => { setEditing(sub); setFormOpen(true); }}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(sub)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="px-4"><Pagination meta={meta} onPageChange={setPage} /></div>
          </div>
        )}
      </Card>

      <SubcategoryFormDialog open={formOpen} onOpenChange={setFormOpen} subcategory={editing} />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        title={`Delete "${deleteTarget?.name}"?`}
        description="This cannot be undone. Subcategories with existing posts cannot be deleted."
        isLoading={deleting}
        onConfirm={async () => {
          try {
            await deleteSubcategory(deleteTarget._id);
            setDeleteTarget(null);
          } catch {
            // handled by hook
          }
        }}
      />
    </div>
  );
}

