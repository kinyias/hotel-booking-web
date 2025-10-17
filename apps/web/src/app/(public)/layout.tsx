import Footer from '@/components/layouts/Footer'
import Header from '@/components/layouts/Header'
import React from 'react'

function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='min-h-screen'>
        <Header />
        <main className="flex-1">
            {children}
        </main>
        <Footer />
    </div>
  )
}

export default HomeLayout