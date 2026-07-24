import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, FolderTree, ListTree, FileText, BarChart3, Settings, Users, Sparkles, Image, Smartphone,
} from 'lucide-react';
import { cn } from '@/utils/cn';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/categories', label: 'Categories', icon: FolderTree },
  { to: '/subcategories', label: 'Subcategories', icon: ListTree },
  { to: '/posts', label: 'Posts', icon: FileText },
  { to: '/banners', label: 'Banners', icon: Image },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/store-assets', label: 'Play Store Kit', icon: Smartphone },
  { to: '/users', label: 'Team', icon: Users },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ open, onClose }) {
  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={onClose} />}
      <aside
        className={cn(
          'fixed lg:sticky top-0 left-0 z-40 h-screen w-64 shrink-0 transition-transform lg:translate-x-0',
          'glass border-r border-white/20 dark:border-white/5 flex flex-col',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center gap-2.5 px-6 h-16 shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white shadow-glass">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight">MoodBox</span>
        </div>

        <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 py-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                )
              }
            >
              <Icon className="h-[18px] w-[18px]" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 text-xs text-muted-foreground border-t border-border/60">
          MoodBox Admin v1.0
        </div>
      </aside>
    </>
  );
}
