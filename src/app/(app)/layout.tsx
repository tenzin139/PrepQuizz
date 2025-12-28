import { SidebarNav } from '@/components/shared/sidebar-nav';
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarTrigger,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LoggedInUser } from '@/lib/mock-data';
import { AppLogo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import Link from 'next/link';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <AppLogo className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">Prep Quiz</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarNav />
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={LoggedInUser.profilePicture} alt={LoggedInUser.name} />
              <AvatarFallback>{LoggedInUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold">{LoggedInUser.name}</span>
              <span className="text-sm text-muted-foreground">{LoggedInUser.state}</span>
            </div>
            <Button variant="ghost" size="icon" className="ml-auto" asChild>
              <Link href="/login">
                <LogOut />
                <span className="sr-only">Log out</span>
              </Link>
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:hidden">
          <SidebarTrigger />
          <div className="flex items-center gap-2 font-bold">
            <AppLogo className="h-6 w-6 text-primary" />
            <span>Prep Quiz</span>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
