'use client';

import { BedSingle, CirclePercent, Contact, FileText, Hotel, Layers, Receipt, Scale, Settings, Sparkles, Star, Tags } from 'lucide-react';
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
import { usePermission } from '@/providers/PermissionProvider';
interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  submenu?: SubMenuItem[];
  action: string;
}
interface SubMenuItem {
  title: string;
  href: string;
  action: string;
}
export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: ROUTES.ADMIN_DASHBOARD,
    icon: Home,
    action: "dashboard.read",
  },
  {
    title: 'Hotel',
    href: ROUTES.ADMIN_HOTELS,
    icon: Hotel,
    action: "hotels.admin.list",
    submenu: [
      { title: 'Hotels', href: ROUTES.ADMIN_HOTELS, action: "hotels.admin.list" },
      { title: 'Members', href: ROUTES.ADMIN_MEMBER_HOTELS, action: "hotels.admin.list" },
      { title: 'Inventory', href: ROUTES.ADMIN_INVENTORY, action: "inventories.list" },
    ]
  },
  {
    title: "Room types",
    href: ROUTES.ADMIN_ROOM_TYPES,
    icon: BedSingle,
    action: "room-types.list",
  },
  {
    title: 'Amenities',
    href: ROUTES.ADMIN_AMENITIES,
    icon: Sparkles,
    action: "amenities.list",
  },
  {
    title: 'Bookings',
    href: ROUTES.ADMIN_BOOKINGS,
    icon: Receipt,
    action: "bookings.list",
  },
  {
    title: 'News',
    href: ROUTES.ADMIN_NEWS,
    icon: FileText,
    action: "news.read",
  },
  {
    title: 'Reviews',
    href: ROUTES.ADMIN_REVIEWS,
    icon: Star,
    action: "reviews.moderate",
  },
  {
    title: 'Promotions',
    href: ROUTES.ADMIN_PROMOTIONS,
    icon: Tags,
    action: "promotions.list",
  },
  {
    title: 'Commissions',
    href: ROUTES.ADMIN_COMMISSIONS,
    icon: CirclePercent,
    action: "commission-packages.list",
  },
  {
    title: 'Users',
    href: ROUTES.ADMIN_USERS,
    icon: Users,
    action: "users.list",
    submenu: [
      { title: 'Users', href: ROUTES.ADMIN_USERS, action: "users.list" },
      { title: 'Roles', href: ROUTES.ADMIN_ROLES, action: "roles.list" },
      { title: 'Permissions', href: ROUTES.ADMIN_PERMISSIONS, action: "permissions.list" },
      { title: 'Actions', href: ROUTES.ADMIN_ACTIONS, action: "actions.list" },
    ]
  },
  {
    title: "Contacts",
    href: ROUTES.ADMIN_CONTACTS,
    icon: Contact,
    action: "contacts.read",
  },
  {
    title: "Policies",
    href: ROUTES.ADMIN_POLICIES,
    icon: Scale,
    action: "policies.read",
  },
  {
    title: 'Settings',
    href: ROUTES.ADMIN_SETTINGS,
    icon: Settings,
    action: "banners.read",
  },
];
export default function AdminSidebar() {
  const pathname = usePathname();
  const { can } = usePermission();
  
  function filterMenu(menu: NavItem[], can: (action: string) => boolean): NavItem[] {
    return menu
      .filter((item) => !item.action || can(item.action))
      .map((item) => ({
        ...item,
        submenu: item.submenu
          ? item.submenu.filter((subItem) => !subItem.action || can(subItem.action))
          : undefined,
      }));
  }
  
  const filteredMenu = filterMenu(navItems, can);
  // const filteredMenu = navItems;
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
              {filteredMenu.map((item) => {
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
