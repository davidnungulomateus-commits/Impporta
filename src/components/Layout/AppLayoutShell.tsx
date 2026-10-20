'use client';

import React, { Suspense } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Layout/Sidebar';
import TopBar from '@/components/Layout/TopBar';
import DebugRoleSwitcher from '@/components/UI/DebugRoleSwitcher';

export default function AppLayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isFullPage = pathname === '/' || pathname === '/condominios' || pathname === '/worker' || pathname === '/owner' || pathname === '/admin';

  if (isFullPage) {
    return (
      <div className="landing-layout-wrapper">
        {children}
        <DebugRoleSwitcher />
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Suspense fallback={null}>
        <Sidebar />
      </Suspense>
      <div className="main-area">
        <TopBar />
        <main className="page-content">
          {children}
        </main>
      </div>
      <DebugRoleSwitcher />
    </div>
  );
}
