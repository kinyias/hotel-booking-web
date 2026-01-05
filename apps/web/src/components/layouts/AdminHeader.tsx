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
          <Avatar>
            <AvatarImage src={user?.avatar?.url} />
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
          <div className="text-sm">
            <p className="font-semibold">{user?.lastName || 'Admin'}</p>
            <p className="text-muted-foreground text-xs">{user?.roles[0].name}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
