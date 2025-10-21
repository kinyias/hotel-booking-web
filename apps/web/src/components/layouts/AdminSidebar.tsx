'use client';

import { FileText, Hotel, Receipt, Settings, Star, Tags } from 'lucide-react';
import {
  ChevronDown,
  Home,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { ROUTES } from '@/constants';
interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  submenu?: { title: string; href: string }[];
}

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: ROUTES.ADMIN_DASHBOARD,
    icon: Home,
  },
  {
    title: 'Hotel',
    href: ROUTES.ADMIN_HOTELS,
    icon: Hotel,
  },
  {
    title: 'Boookings',
    href: ROUTES.ADMIN_BOOKINGS,
    icon: Receipt,
  },
  {
    title: 'News',
    href: ROUTES.ADMIN_NEWS,
    icon: FileText,
  },
  {
    title: 'Reviews',
    href: ROUTES.ADMIN_REVIEWS,
    icon: Star,
  },
  {
    title: 'Users',
    href: ROUTES.ADMIN_USERS,
    icon: Users,
    submenu: [
      { title: 'Users', href: ROUTES.ADMIN_USERS },
      { title: 'Roles', href: ROUTES.ADMIN_ROLES },
      { title: 'Permissions', href: ROUTES.ADMIN_PERMISSIONS },
      { title: 'Actions', href: ROUTES.ADMIN_ACTIONS },
    ]
  },
  {
    title: 'Settings',
    href: ROUTES.ADMIN_SETTINGS,
    icon: Settings,
  },
];
export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="h-screen">
      <SidebarHeader>
        <SidebarGroup>
          <SidebarGroupLabel>
            <h1 className="text-2xl text-black font-bold">Admin Panel</h1>
          </SidebarGroupLabel>
        </SidebarGroup>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname?.startsWith(item.href + '/');

                if (item.submenu) {
                  return (
                    <Collapsible
                      key={item.title}
                      defaultOpen={pathname?.startsWith(item.href)}
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton isActive={isActive}>
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                            <ChevronDown className="ml-auto h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.submenu.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={pathname === subItem.href}
                                >
                                  <Link href={subItem.href}>
                                    {subItem.title}
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {/* <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === '/dashboard/profile'}
            >
              <Link href="/dashboard/profile">
                <CircleUser className="h-4 w-4" />
                <span>Profile</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === '/dashboard/settings'}
            >
              <Link href="/dashboard/settings">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter> */}
    </Sidebar>
  );
}
