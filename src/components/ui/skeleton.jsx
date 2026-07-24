import { cn } from '@/utils/cn';

function Skeleton({ className, ...props }) {
  return <div className={cn('animate-pulse rounded-lg bg-muted', className)} {...props} />;
}

export { Skeleton };
