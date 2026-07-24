import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Search, Pencil, Trash2, FileText, Download, CheckSquare, Star, TrendingUp,
} from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { EmptyState } from '@/components/common/EmptyState';
import { Pagination } from '@/components/common/Pagination';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { usePosts, useDeletePost, useBulkDeletePosts, useBulkUpdatePostStatus } from '@/hooks/usePosts';
import { useCategoryDropdown } from '@/hooks/useCategories';
import { useDebounce } from '@/hooks/useDebounce';
import { postService } from '@/services/postService';
import { CONTENT_TYPES } from '@/constants/app';

export default function PostsListPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [category, setCategory] = useState('all');
  const [contentType, setContentType] = useState('all');
  const [selected, setSelected] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  const debouncedSearch = useDebounce(search);
  const { data: categoriesRes } = useCategoryDropdown();
  const categories = categoriesRes?.data || [];

  const { data, isLoading } = usePosts({
    page, limit: 10, search: debouncedSearch,
    status: status === 'all' ? undefined : status,
    category: category === 'all' ? undefined : category,
    contentType: contentType === 'all' ? undefined : contentType,
  });

  const { mutateAsync: deletePost, isPending: deleting } = useDeletePost();
  const { mutateAsync: bulkDelete, isPending: bulkDeleting } = useBulkDeletePosts();
  const { mutate: bulkStatus } = useBulkUpdatePostStatus();

  const posts = data?.data || [];
  const meta = data?.meta;

  const toggleAll = () => setSelected(selected.length === posts.length ? [] : posts.map((p) => p._id));
  const toggleOne = (id) => setSelected((s) => (s.includes(id) ? s.filter((i) => i !== id) : [...s, id]));

  return (
    <div>
      <PageHeader
        title="Posts"
        description="Manage jokes, recipes, and stories"
        actions={
          <Button onClick={() => navigate('/posts/new')}>
            <Plus className="h-4 w-4" /> New Post
          </Button>
        }
      />

      <Card className="mb-4">
        <div className="p-4 flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search posts, tags…" className="pl-9" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <Select value={category} onValueChange={(v) => { setCategory(v); setPage(1); }}>
            <SelectTrigger className="lg:w-44"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((c) => <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={contentType} onValueChange={(v) => { setContentType(v); setPage(1); }}>
            <SelectTrigger className="lg:w-40"><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {CONTENT_TYPES.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
            <SelectTrigger className="lg:w-40"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
            </SelectContent>
          </Select>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline"><Download className="h-4 w-4" /> Export</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => postService.exportCsv(selected.length ? selected : undefined)}>
                Export as CSV {selected.length > 0 && `(${selected.length} selected)`}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => postService.exportExcel(selected.length ? selected : undefined)}>
                Export as Excel {selected.length > 0 && `(${selected.length} selected)`}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {selected.length > 0 && (
          <div className="px-4 pb-4 flex items-center gap-2 flex-wrap border-t border-border pt-3">
            <span className="text-sm text-muted-foreground mr-2">{selected.length} selected</span>
            <Button size="sm" variant="outline" onClick={() => bulkStatus({ ids: selected, status: 'published' })}>
              <CheckSquare className="h-3.5 w-3.5" /> Publish
            </Button>
            <Button size="sm" variant="outline" onClick={() => bulkStatus({ ids: selected, status: 'draft' })}>
              Mark as Draft
            </Button>
            <Button size="sm" variant="destructive" onClick={() => setBulkDeleteOpen(true)}>
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </Button>
          </div>
        )}
      </Card>

      <Card>
        {isLoading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
          </div>
        ) : posts.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No posts found"
            description="Create your first post to start publishing content"
            action={<Button onClick={() => navigate('/posts/new')}><Plus className="h-4 w-4" /> New Post</Button>}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="px-4 py-3 w-10">
                    <Checkbox checked={selected.length === posts.length} onCheckedChange={toggleAll} />
                  </th>
                  <th className="px-2 py-3 font-medium">Post</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Views</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post._id} className="border-b border-border/60 last:border-0 hover:bg-secondary/40 transition">
                    <td className="px-4 py-3">
                      <Checkbox checked={selected.includes(post._id)} onCheckedChange={() => toggleOne(post._id)} />
                    </td>
                    <td className="px-2 py-3">
                      <div className="flex items-center gap-3">
                        {post.featuredImage?.url ? (
                          <img src={post.featuredImage.url} alt="" className="h-10 w-10 rounded-lg object-cover shrink-0" />
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                            <FileText className="h-4 w-4" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-medium truncate max-w-xs">{post.title}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <Badge variant="outline" className="text-[10px] py-0">{post.contentType}</Badge>
                            {post.isFeatured && <Star className="h-3 w-3 text-accent" />}
                            {post.isTrending && <TrendingUp className="h-3 w-3 text-success" />}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {post.category?.name}
                      {post.subcategory?.name && <div className="text-xs">{post.subcategory.name}</div>}
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={post.status} /></td>
                    <td className="px-4 py-3 text-muted-foreground font-mono">{post.views}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {post.publishDate ? new Date(post.publishDate).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => navigate(`/posts/${post._id}/edit`)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(post)}>
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

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        title={`Delete "${deleteTarget?.title}"?`}
        description="This will permanently remove the post and its image."
        isLoading={deleting}
        onConfirm={async () => {
          await deletePost(deleteTarget._id);
          setDeleteTarget(null);
        }}
      />

      <ConfirmDialog
        open={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
        title={`Delete ${selected.length} posts?`}
        description="This will permanently remove all selected posts."
        isLoading={bulkDeleting}
        onConfirm={async () => {
          await bulkDelete(selected);
          setSelected([]);
          setBulkDeleteOpen(false);
        }}
      />
    </div>
  );
}
