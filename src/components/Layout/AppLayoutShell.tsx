'use client';

import React, { Suspense } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Layout/Sidebar';
import TopBar from '@/components/Layout/TopBar';

export default function AppLayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLandingPage = pathname === '/';

  if (isLandingPage) {
    return <div className="landing-layout-wrapper">{children}</div>;
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
    </div>
  );
}
