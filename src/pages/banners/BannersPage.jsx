import { useState } from 'react';
import { Plus, Pencil, Trash2, GripVertical, Image, ArrowUp, ArrowDown } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { EmptyState } from '@/components/common/EmptyState';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { useBanners, useUpdateBanner, useDeleteBanner, useReorderBanners } from '@/hooks/useBanners';
import { BannerFormDialog } from './BannerFormDialog';

function BannerPreviewCard({ banner }) {
  return (
    <div
      className="rounded-xl h-20 flex items-center px-4 gap-3 shrink-0 w-52"
      style={{ background: `linear-gradient(135deg, ${banner.bgGradientStart}, ${banner.bgGradientEnd})` }}
    >
      <span className="text-2xl">{banner.emoji}</span>
      <p className="text-white text-xs font-medium line-clamp-3 leading-snug flex-1">{banner.quoteText}</p>
    </div>
  );
}

export default function BannersPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data, isLoading } = useBanners();
  const { mutate: updateBanner } = useUpdateBanner();
  const { mutateAsync: deleteBanner, isPending: deleting } = useDeleteBanner();
  const { mutate: reorder } = useReorderBanners();

  const banners = (data?.data || []).slice().sort((a, b) => a.order - b.order);

  const handleToggleStatus = (b) => {
    updateBanner({ id: b._id, body: { status: b.status === 'active' ? 'inactive' : 'active' } });
  };

  const handleMove = (index, direction) => {
    const list = [...banners];
    const swapIndex = index + direction;
    if (swapIndex < 0 || swapIndex >= list.length) return;
    const items = list.map((item, i) => {
      if (i === index) return { id: item._id, order: list[swapIndex].order };
      if (i === swapIndex) return { id: item._id, order: list[index].order };
      return { id: item._id, order: item.order };
    });
    reorder(items);
  };

  return (
    <div>
      <PageHeader
        title="Banners"
        description="Manage home screen banner slides shown in the Flutter app"
        actions={
          <Button onClick={() => { setEditing(null); setFormOpen(true); }}>
            <Plus className="h-4 w-4" /> New Banner
          </Button>
        }
      />

      {/* Info card */}
      <Card className="mb-4 p-4 border-primary/20 bg-primary/5">
        <p className="text-sm text-muted-foreground">
          💡 Banners appear as a horizontal carousel on the home screen of the app. Use the arrows to reorder them.
          Only <span className="font-semibold text-foreground">Active</span> banners are shown to app users.
        </p>
      </Card>

      <Card>
        {isLoading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
          </div>
        ) : banners.length === 0 ? (
          <EmptyState
            icon={Image}
            title="No banners yet"
            description="Create your first banner slide for the app home screen"
            action={
              <Button onClick={() => setFormOpen(true)}>
                <Plus className="h-4 w-4" /> New Banner
              </Button>
            }
          />
        ) : (
          <div className="divide-y divide-border">
            {/* Table header */}
            <div className="grid grid-cols-[40px_1fr_200px_100px_120px_90px_100px] items-center gap-3 px-4 py-2 text-xs font-medium text-muted-foreground">
              <span></span>
              <span>Preview &amp; Text</span>
              <span>Button Label</span>
              <span>Type</span>
              <span>Order</span>
              <span>Status</span>
              <span className="text-right">Actions</span>
            </div>

            {banners.map((banner, index) => (
              <div
                key={banner._id}
                className="grid grid-cols-[40px_1fr_200px_100px_120px_90px_100px] items-center gap-3 px-4 py-3 hover:bg-secondary/40 transition"
              >
                {/* Drag handle visual */}
                <GripVertical className="h-4 w-4 text-muted-foreground/40" />

                {/* Preview card */}
                <div className="flex items-center gap-3 min-w-0">
                  <BannerPreviewCard banner={banner} />
                  <p className="text-sm text-muted-foreground line-clamp-2 max-w-xs hidden xl:block">
                    {banner.quoteText}
                  </p>
                </div>

                {/* Button label */}
                <span className="text-sm font-mono text-muted-foreground truncate">{banner.buttonText}</span>

                {/* Type badge */}
                <Badge variant="secondary" className="capitalize w-fit">{banner.type}</Badge>

                {/* Order arrows */}
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium w-6 text-center">{banner.order}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    disabled={index === 0}
                    onClick={() => handleMove(index, -1)}
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    disabled={index === banners.length - 1}
                    onClick={() => handleMove(index, 1)}
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </Button>
                </div>

                {/* Status toggle */}
                <Switch
                  checked={banner.status === 'active'}
                  onCheckedChange={() => handleToggleStatus(banner)}
                />

                {/* Actions */}
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => { setEditing(banner); setFormOpen(true); }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(banner)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <BannerFormDialog open={formOpen} onOpenChange={setFormOpen} banner={editing} />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        title={`Delete banner?`}
        description={`This will permanently remove "${deleteTarget?.quoteText?.slice(0, 60)}…" from the app.`}
        isLoading={deleting}
        onConfirm={async () => {
          try {
            await deleteBanner(deleteTarget._id);
            setDeleteTarget(null);
          } catch {
            // error toast handled by hook
          }
        }}
      />
    </div>
  );
}
