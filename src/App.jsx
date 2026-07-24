import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

import LoginPage from '@/pages/auth/LoginPage';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import CategoriesPage from '@/pages/categories/CategoriesPage';
import SubcategoriesPage from '@/pages/subcategories/SubcategoriesPage';
import PostsListPage from '@/pages/posts/PostsListPage';
import PostFormPage from '@/pages/posts/PostFormPage';
import AnalyticsPage from '@/pages/analytics/AnalyticsPage';
import SettingsPage from '@/pages/settings/SettingsPage';
import ProfilePage from '@/pages/settings/ProfilePage';
import ChangePasswordPage from '@/pages/settings/ChangePasswordPage';
import UsersPage from '@/pages/users/UsersPage';
import BannersPage from '@/pages/banners/BannersPage';
import PlayStoreAssetsPage from '@/pages/store-assets/PlayStoreAssetsPage';
import NotFoundPage from '@/pages/NotFoundPage';


const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false, staleTime: 10_000 },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <AuthProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                className: 'text-sm font-body',
                style: { borderRadius: '0.75rem' },
              }}
            />
            <Routes>
              {/* Public auth route */}
              <Route path="/login" element={<LoginPage />} />

              {/* Protected admin routes */}
              <Route
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/" element={<DashboardPage />} />
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/subcategories" element={<SubcategoriesPage />} />
                <Route path="/posts" element={<PostsListPage />} />
                <Route path="/posts/new" element={<PostFormPage />} />
                <Route path="/posts/:id/edit" element={<PostFormPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/banners" element={<BannersPage />} />
                <Route path="/store-assets" element={<PlayStoreAssetsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/settings/profile" element={<ProfilePage />} />
                <Route path="/settings/change-password" element={<ChangePasswordPage />} />
              </Route>

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
