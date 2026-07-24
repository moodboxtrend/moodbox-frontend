import { Inbox } from 'lucide-react';
import { cn } from '@/utils/cn';

export function EmptyState({ icon: Icon = Inbox, title = 'Nothing here yet', description, action, className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 py-16 text-center', className)}>
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Icon className="h-7 w-7" />
      </div>
      <div className="space-y-1">
        <p className="font-display font-medium text-foreground">{title}</p>
        {description && <p className="text-sm text-muted-foreground max-w-sm">{description}</p>}
      </div>
      {action}
    </div>
  );
}
