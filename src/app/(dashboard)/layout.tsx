'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import Sidebar from '@/components/Sidebar';
import TopNav from '@/components/TopNav';

/** Dashboard Layout wrapping all authenticated views */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, darkMode, activePage, setActivePage } = useApp();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Route guard
  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, router, mounted]);

  // Sync activePage with pathname
  useEffect(() => {
    if (!mounted) return;
    
    // Normalize path by stripping starting slash
    const path = pathname.replace(/^\//, '') as any;
    
    const validPages = [
      'dashboard',
      'products-list',
      'add-product',
      'category-list',
      'orders-list',
      'order-details',
      'customers-list',
      'customer-details',
      'manage-reviews',
      'referrals',
      'settings',
      'invoice-list',
      'invoice-preview',
      'invoice-edit',
      'invoice-add',
      'user-list',
      'user-view'
    ];

    if (path && validPages.includes(path)) {
      if (path !== activePage) {
        setActivePage(path);
      }
    } else if (pathname === '/') {
      if (activePage !== 'dashboard') {
        setActivePage('dashboard');
      }
    }
  }, [pathname, activePage, setActivePage, mounted]);

  if (!mounted || !isAuthenticated) {
    // Return empty fallback during initial client mount/loading
    return (
      <div className="min-h-screen bg-bg-app flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  const navigateTo = (page: string) => {
    setActivePage(page as any);
    router.push(page === 'dashboard' ? '/' : `/${page}`);
  };

  return (
    <div className="min-h-screen bg-bg-app text-text-primary transition-colors duration-205">
      {/* Sidebar Panel */}
      <Sidebar activePage={activePage} setActivePage={navigateTo} />

      {/* Top Navbar */}
      <TopNav
        activePage={activePage}
        setActivePage={navigateTo}
        darkMode={darkMode}
        setDarkMode={() => { }}
      />

      {/* Main content body */}
      <main className="pl-0 lg:pl-[260px] pt-16 min-h-screen transition-all duration-300">
        <div className="w-full px-4 py-4 sm:px-6 sm:py-6 lg:w-11/12 lg:max-w-none lg:px-0 lg:py-8 mx-auto space-y-6 animate-fadeIn">
          {children}
        </div>
      </main>
    </div>
  );
}
