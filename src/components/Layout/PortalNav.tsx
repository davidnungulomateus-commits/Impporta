'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Home, LogOut } from 'lucide-react';
import { useProfile } from '@/context/ProfileContext';

export default function PortalNav() {
  const router = useRouter();
  const { logout } = useProfile();

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  return (
    <nav
      aria-label="Navegação do portal"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        minHeight: 64,
        padding: '10px clamp(18px, 4vw, 56px)',
        background: 'rgba(255, 255, 255, 0.94)',
        borderBottom: '1px solid #e5e7eb',
        boxShadow: '0 4px 18px rgba(15, 23, 42, 0.06)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <button
        type="button"
        onClick={() => router.push('/')}
        style={{ border: 0, background: 'transparent', color: '#111827', fontWeight: 800, fontSize: 18, cursor: 'pointer' }}
      >
        Impporta
      </button>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button
          type="button"
          onClick={() => router.push('/')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '9px 14px', border: '1px solid #dbe3ef', borderRadius: 10, background: '#fff', color: '#334155', fontWeight: 700, cursor: 'pointer' }}
        >
          <Home size={16} aria-hidden="true" />
          <span>Landing page</span>
        </button>
        <button
          type="button"
          onClick={handleLogout}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '9px 14px', border: 0, borderRadius: 10, background: '#111827', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
        >
          <LogOut size={16} aria-hidden="true" />
          <span>Terminar sessão</span>
        </button>
      </div>
    </nav>
  );
}
