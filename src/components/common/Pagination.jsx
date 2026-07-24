import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Pagination({ meta, onPageChange }) {
  if (!meta || meta.totalPages <= 1) return null;
  const { page, totalPages, total, limit } = meta;

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="flex items-center justify-between px-1 py-4 text-sm">
      <p className="text-muted-foreground">
        Showing <span className="font-medium text-foreground">{from}-{to}</span> of{' '}
        <span className="font-medium text-foreground">{total}</span>
      </p>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" disabled={!meta.hasPrevPage} onClick={() => onPageChange(page - 1)}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="px-2 text-muted-foreground">
          Page {page} of {totalPages}
        </span>
        <Button variant="outline" size="sm" disabled={!meta.hasNextPage} onClick={() => onPageChange(page + 1)}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
