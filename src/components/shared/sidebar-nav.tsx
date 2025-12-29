'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Trophy, User, ClipboardEdit, LogOut } from 'lucide-react';
import { useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

const navItems = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/quiz', label: 'Start Quiz', icon: ClipboardEdit },
  { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { href: '/account', label: 'My Account', icon: User },
];

export function SidebarNav() {
  const pathname = usePathname();
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  return (
    <SidebarMenu>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname.startsWith(item.href) && item.href !== '/';
        const isHome = item.href === '/home' && pathname === '/home';
        return (
          <SidebarMenuItem key={item.href}>
            <Link href={item.href} passHref>
              <SidebarMenuButton
                asChild
                isActive={isHome || (isActive && item.href !== '/home')}
                tooltip={{ children: item.label, side: 'right' }}
              >
                <div>
                  <Icon />
                  <span>{item.label}</span>
                </div>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        );
      })}
       <SidebarMenuItem className="mt-auto">
          <SidebarMenuButton
            onClick={handleLogout}
            tooltip={{ children: 'Logout', side: 'right' }}
          >
            <div>
              <LogOut />
              <span>Logout</span>
            </div>
          </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
