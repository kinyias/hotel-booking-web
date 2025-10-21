'use client';
import React from 'react';
import { SidebarTrigger } from '../ui/sidebar';
import { usePathname } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { navItems } from './AdminSidebar';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useAuth } from '@/providers/AuthProvider';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { Bell } from 'lucide-react';
import { Badge } from '../ui/badge';
function findBreadcrumb(pathname: string) {
  for (const item of navItems) {
    if (item.href === pathname) {
      return [item]; // direct match
    }
    if (item.submenu) {
      const subItem = item.submenu.find((sub) => sub.href === pathname);
      if (subItem) {
        return [item, subItem]; // parent + child
      }
    }
  }
  return [];
}
export default function AdminHeader() {
  const pathname = usePathname();
  const breadcrumbTitles = findBreadcrumb(pathname);
  const { user } = useAuth();
  return (
    <div className="border-b print:hidden">
      <div className="flex h-16 items-center px-4">
        <SidebarTrigger className="mr-2" />
        <div className="flex items-center gap-2 font-semibold">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
              </BreadcrumbItem>
              {breadcrumbTitles.map((item, index) => (
                <React.Fragment key={index}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href={item.href}>
                      {item.title}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full relative"
              >
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  3
                </Badge>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <h3 className="font-semibold text-sm">Notifications</h3>
                <div className="space-y-3">
                  <div className="flex gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">
                        New booking received
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Room 204 - Deluxe Suite
                      </p>
                      <p className="text-xs text-muted-foreground">
                        2 minutes ago
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">Check-out reminder</p>
                      <p className="text-xs text-muted-foreground">
                        Room 105 - Standard Room
                      </p>
                      <p className="text-xs text-muted-foreground">
                        15 minutes ago
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                    <div className="h-2 w-2 rounded-full bg-muted mt-2" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">
                        Maintenance completed
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Room 308 is now available
                      </p>
                      <p className="text-xs text-muted-foreground">
                        1 hour ago
                      </p>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" className="w-full text-xs">
                  View all notifications
                </Button>
              </div>
            </PopoverContent>
          </Popover>{' '}
          <Avatar>
            <AvatarImage src={user?.avatar.secureUrl} />
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
          <div className="text-sm">
            <p className="font-semibold">{user?.lastName || 'Admin'}</p>
            <p className="text-muted-foreground text-xs">Superadmin</p>
          </div>
        </div>
      </div>
    </div>
  );
}
