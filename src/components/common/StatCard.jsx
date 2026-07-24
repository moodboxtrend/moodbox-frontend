import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/utils/cn';

export function StatCard({ label, value, icon: Icon, trend, accent = 'primary', isLoading }) {
  return (
    <Card className="relative overflow-hidden">
      <div
        className={cn(
          'absolute -right-6 -top-6 h-24 w-24 rounded-full blur-2xl opacity-30',
          accent === 'primary' && 'bg-primary',
          accent === 'accent' && 'bg-accent',
          accent === 'success' && 'bg-success'
        )}
      />
      <CardContent className="p-5 relative">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            {isLoading ? (
              <div className="h-8 w-20 mt-1.5 rounded-lg bg-muted animate-pulse" />
            ) : (
              <p className="text-2xl font-display font-semibold mt-1 font-mono">{value}</p>
            )}
            {trend && <p className="text-xs text-success mt-1">{trend}</p>}
          </div>
          {Icon && (
            <div
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-xl',
                accent === 'primary' && 'bg-primary/10 text-primary',
                accent === 'accent' && 'bg-accent/15 text-accent-foreground',
                accent === 'success' && 'bg-success/10 text-success'
              )}
            >
              <Icon className="h-5 w-5" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
