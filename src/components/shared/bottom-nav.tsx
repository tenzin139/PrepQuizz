'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Trophy, User, ClipboardEdit } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/quiz', label: 'Quiz', icon: ClipboardEdit },
  { href: '/leaderboard', label: 'Board', icon: Trophy },
  { href: '/account', label: 'Account', icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 border-t bg-background/95 backdrop-blur-sm md:hidden">
      <nav className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);
          return (
            <Link href={item.href} key={item.href} className="flex flex-col items-center justify-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
              <Icon className={cn("h-6 w-6", isActive && "text-primary")} />
              <span className={cn(isActive && "text-primary font-medium")}>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
