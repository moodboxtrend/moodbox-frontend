import { Eye, TrendingUp, FolderTree } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { EmptyState } from '@/components/common/EmptyState';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { useAnalyticsOverview } from '@/hooks/useDashboard';

export default function AnalyticsPage() {
  const { data, isLoading } = useAnalyticsOverview();
  const overview = data?.data || {};

  return (
    <div>
      <PageHeader title="Analytics" description="Views and content performance" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Total Views" value={overview.totalViews ?? '—'} icon={Eye} isLoading={isLoading} />
        <StatCard
          label="Top Post Views"
          value={overview.mostViewedPosts?.[0]?.views ?? '—'}
          icon={TrendingUp}
          accent="accent"
          isLoading={isLoading}
        />
        <StatCard
          label="Popular Categories"
          value={overview.popularCategories?.length ?? '—'}
          icon={FolderTree}
          accent="success"
          isLoading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Popular Categories</CardTitle>
            <CardDescription>By total views</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-64 rounded-xl bg-muted animate-pulse" />
            ) : (overview.popularCategories || []).length === 0 ? (
              <EmptyState title="No data yet" />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={overview.popularCategories} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="totalViews" fill="#6D4AFF" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Most Viewed Posts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {(overview.mostViewedPosts || []).length === 0 && !isLoading ? (
              <EmptyState title="No posts yet" />
            ) : (
              (overview.mostViewedPosts || []).map((p, i) => (
                <div key={p._id} className="flex items-center gap-3 py-2.5 border-b border-border/60 last:border-0">
                  <span className="h-7 w-7 shrink-0 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-medium font-mono">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{p.title}</p>
                    <p className="text-xs text-muted-foreground">{p.category?.name}</p>
                  </div>
                  <span className="text-sm font-mono text-muted-foreground">{p.views} views</span>
                  <StatusBadge status={p.status} />
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
