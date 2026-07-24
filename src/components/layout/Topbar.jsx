import { useNavigate } from 'react-router-dom';
import { Menu, Sun, Moon, LogOut, User, KeyRound } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { GlobalSearch } from './GlobalSearch';

export function Topbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const initials = user?.name?.split(' ').map((n) => n[0]).slice(0, 2).join('') || 'A';

  return (
    <header className="sticky top-0 z-20 h-16 glass border-b border-white/20 dark:border-white/5 flex items-center gap-4 px-4 sm:px-6">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
        <Menu className="h-5 w-5" />
      </Button>

      <div className="hidden sm:block flex-1">
        <GlobalSearch />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <Button variant="ghost" size="icon" onClick={toggleTheme} title="Toggle theme">
          {theme === 'dark' ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-xl pl-1 pr-2 py-1 hover:bg-secondary transition">
              <Avatar>
                <AvatarImage src={user?.avatar?.url} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <span className="hidden sm:block text-sm font-medium">{user?.name}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/settings/profile')}>
              <User className="h-4 w-4" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/settings/change-password')}>
              <KeyRound className="h-4 w-4" /> Change password
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem destructive onClick={() => logout().then(() => navigate('/login'))}>
              <LogOut className="h-4 w-4" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
