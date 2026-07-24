import { useQuery } from '@tanstack/react-query';
import { dashboardService, analyticsService } from '@/services/miscServices';

export const useDashboardSummary = () =>
  useQuery({ queryKey: ['dashboard-summary'], queryFn: dashboardService.summary, refetchInterval: 60_000 });

export const useDashboardCharts = () =>
  useQuery({ queryKey: ['dashboard-charts'], queryFn: dashboardService.charts });

export const useAnalyticsOverview = () =>
  useQuery({ queryKey: ['analytics-overview'], queryFn: analyticsService.overview });
