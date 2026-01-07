'use client';
import React from 'react';
import { SidebarTrigger } from '../ui/sidebar';
import { usePathname, useRouter } from 'next/navigation';
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
import { Bell, CheckCheck, Trash2, X } from 'lucide-react';
import { Badge } from '../ui/badge';
import {
  useNotifications,
  useUnreadCount,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
  Notification,
} from '@/features/notifications';
import { formatDistanceToNow } from 'date-fns';
import { ScrollArea } from '../ui/scroll-area';


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

function NotificationItem({ notification }: { notification: Notification }) {
  const router = useRouter();
  const markAsReadMutation = useMarkAsReadMutation();
  const deleteMutation = useDeleteNotificationMutation();

  const handleClick = () => {
    if (!notification.isRead) {
      markAsReadMutation.mutate(notification.id);
    }
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteMutation.mutate(notification.id);
  };

  return (
    <div
      className={`p-3 hover:bg-accent cursor-pointer transition-colors ${
        !notification.isRead ? 'bg-blue-50 dark:bg-blue-950/20' : ''
      }`}
      onClick={handleClick}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-medium text-sm truncate">{notification.title}</p>
            {!notification.isRead && (
              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {notification.message}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 flex-shrink-0"
          onClick={handleDelete}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}

export default function AdminHeader() {
  const pathname = usePathname();
  const breadcrumbTitles = findBreadcrumb(pathname);
  const { user } = useAuth();
  const [open, setOpen] = React.useState(false);

  const { data: unreadCountData } = useUnreadCount();
  const { data: notificationsData } = useNotifications(1, 10);
  const markAllAsReadMutation = useMarkAllAsReadMutation();

  const unreadCount = unreadCountData?.count || 0;
  const notifications = notificationsData?.data || [];

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

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
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-semibold">Notifications</h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleMarkAllAsRead}
                      className="h-8 text-xs"
                    >
                      <CheckCheck className="h-4 w-4 mr-1" />
                      Mark all read
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <ScrollArea className="h-[400px]">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Bell className="h-12 w-12 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">No notifications</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {notifications.map((notification) => (
                      <NotificationItem key={notification.id} notification={notification} />
                    ))}
                  </div>
                )}
              </ScrollArea>
            </PopoverContent>
          </Popover>
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

