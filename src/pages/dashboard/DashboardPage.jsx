import {
  FolderTree, ListTree, FileText, CalendarClock, ImageIcon, Cloud, TrendingUp,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid,
} from 'recharts';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { StatusBadge } from '@/components/common/StatusBadge';
import { EmptyState } from '@/components/common/EmptyState';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useDashboardSummary, useDashboardCharts } from '@/hooks/useDashboard';
import { formatDistanceToNow } from 'date-fns';

const COLORS = ['#6D4AFF', '#FFB020', '#22C55E', '#F43F5E', '#3B82F6', '#A855F7'];

const formatBytes = (bytes = 0) => {
  if (!bytes) return '0 MB';
  const mb = bytes / (1024 * 1024);
  return mb > 1024 ? `${(mb / 1024).toFixed(2)} GB` : `${mb.toFixed(1)} MB`;
};

export default function DashboardPage() {
  const { data: summaryRes, isLoading: summaryLoading } = useDashboardSummary();
  const { data: chartsRes, isLoading: chartsLoading } = useDashboardCharts();

  const s = summaryRes?.data || {};
  const c = chartsRes?.data || {};

  return (
    <div>
      <PageHeader title="Dashboard" description="Overview of your MoodBox content" />

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Categories" value={s.totalCategories ?? '—'} icon={FolderTree} isLoading={summaryLoading} />
        <StatCard label="Total Subcategories" value={s.totalSubcategories ?? '—'} icon={ListTree} accent="accent" isLoading={summaryLoading} />
        <StatCard label="Total Posts" value={s.totalPosts ?? '—'} icon={FileText} accent="success" isLoading={summaryLoading} />
        <StatCard label="Today's Posts" value={s.todaysPosts ?? '—'} icon={CalendarClock} isLoading={summaryLoading} />
        <StatCard label="Images Uploaded" value={s.imagesUploaded ?? '—'} icon={ImageIcon} accent="accent" isLoading={summaryLoading} />
        <StatCard
          label="Cloudinary Usage"
          value={s.cloudinaryUsage ? formatBytes(s.cloudinaryUsage.storageUsedBytes) : '—'}
          icon={Cloud}
          isLoading={summaryLoading}
        />
        <StatCard
          label="Most Viewed Category"
          value={s.mostViewedCategory?.name || '—'}
          icon={TrendingUp}
          accent="success"
          isLoading={summaryLoading}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Posts — Last 30 Days</CardTitle>
            <CardDescription>Daily publishing activity</CardDescription>
          </CardHeader>
          <CardContent>
            {chartsLoading ? (
              <div className="h-64 rounded-xl bg-muted animate-pulse" />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={c.postsPerDay || []}>
                  <defs>
                    <linearGradient id="colorPosts" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6D4AFF" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#6D4AFF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="_id" tick={{ fontSize: 11 }} tickFormatter={(v) => v?.slice(5)} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="count" stroke="#6D4AFF" fill="url(#colorPosts)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Posts by Category</CardTitle>
            <CardDescription>Content distribution</CardDescription>
          </CardHeader>
          <CardContent>
            {chartsLoading ? (
              <div className="h-64 rounded-xl bg-muted animate-pulse" />
            ) : (c.postsByCategory || []).length === 0 ? (
              <EmptyState title="No data yet" description="Publish posts to see distribution" />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={c.postsByCategory}
                    dataKey="count"
                    nameKey="name"
                    innerRadius={50}
                    outerRadius={85}
                    paddingAngle={3}
                  >
                    {(c.postsByCategory || []).map((entry, index) => (
                      <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent posts + Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Posts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {(s.recentPosts || []).length === 0 && !summaryLoading ? (
              <EmptyState title="No posts yet" description="Create your first post to get started" />
            ) : (
              (s.recentPosts || []).map((p) => (
                <div key={p._id} className="flex items-center justify-between py-2.5 border-b border-border/60 last:border-0">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{p.title}</p>
                    <p className="text-xs text-muted-foreground">{p.category?.name} • {p.author?.name}</p>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Latest Activities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {(s.latestActivities || []).length === 0 && !summaryLoading ? (
              <EmptyState title="No activity yet" description="Actions taken by your team will show up here" />
            ) : (
              (s.latestActivities || []).map((a) => (
                <div key={a._id} className="flex items-start gap-3 py-2.5 border-b border-border/60 last:border-0">
                  <Avatar className="h-7 w-7 mt-0.5">
                    <AvatarFallback className="text-[10px]">{a.user?.name?.[0] || '?'}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-sm truncate">{a.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(a.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
