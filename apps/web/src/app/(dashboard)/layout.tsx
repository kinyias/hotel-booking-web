import { AuthProvider } from '@/providers/AuthProvider';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import AdminSidebar from '@/components/layouts/AdminSidebar';
import AdminHeader from '@/components/layouts/AdminHeader';
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <AuthProvider>
        <SidebarProvider>
          <AdminSidebar />
          <SidebarInset>
            <main className={cn('flex min-h-screen flex-col')}>
              <AdminHeader />
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
      </AuthProvider>
    </div>
  );
}
