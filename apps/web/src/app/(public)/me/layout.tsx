import { AccountSidebar } from '@/components/layouts/AccountSidebar';
import PageTitle from '@/components/sections/PageTitle';
import React from 'react';

export default function TaiKhoanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <PageTitle
        title="Account"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Account', href: '/me' },
        ]}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <AccountSidebar />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">{children}</div>
        </div>
      </div>
    </div>
  );
}