import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/utils/cn';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors gap-1',
  {
    variants: {
      variant: {
        default: 'bg-primary/10 text-primary border-primary/20',
        secondary: 'bg-secondary text-secondary-foreground border-transparent',
        success: 'bg-success/10 text-success border-success/20',
        warning: 'bg-warning/10 text-warning border-warning/20',
        destructive: 'bg-destructive/10 text-destructive border-destructive/20',
        accent: 'bg-accent/15 text-accent-foreground border-accent/30',
        outline: 'text-foreground border-border',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);

function Badge({ className, variant, ...props }) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
