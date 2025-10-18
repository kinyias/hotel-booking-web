import Footer from '@/components/layouts/Footer';
import Header from '@/components/layouts/Header';
import { AuthProvider } from '@/providers/AuthProvider';
import React from 'react';

function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="min-h-screen">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default HomeLayout;
