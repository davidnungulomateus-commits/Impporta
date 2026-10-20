'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useProfile, ProfileType } from '@/context/ProfileContext';
import { CleaningStore, INITIAL_PROFILES } from '@/lib/cleaning-store';
import {
  Users,
  UserCheck,
  Building2,
  Briefcase,
  Layers,
  X,
  Check,
  ChevronUp,
  SlidersHorizontal,
  Home
} from 'lucide-react';

export default function DebugRoleSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { profile, setProfile, setAuthenticatedUser, setActiveUserId } = useProfile();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Determine current active view based on pathname or profile
  const getCurrentRole = (): { key: string; label: string; badge: string; color: string } => {
    if (pathname === '/worker') {
      return { key: 'worker', label: 'Trabalhador', badge: 'W', color: '#f59e0b' };
    }
    if (pathname === '/admin') {
      return { key: 'admin', label: 'Admin', badge: 'A', color: '#8b5cf6' };
    }
    if (pathname === '/owner') {
      return { key: 'owner', label: 'Proprietário', badge: 'P', color: '#3b82f6' };
    }
    return { key: 'client', label: 'Cliente (Landing)', badge: 'C', color: '#10b981' };
  };

  const currentRole = getCurrentRole();

  const handleSwitch = (target: 'client' | 'worker' | 'owner' | 'admin') => {
    setIsOpen(false);

    if (target === 'client') {
      setProfile('client');
      router.push('/');
      return;
    }

    if (target === 'worker') {
      const workerUser = INITIAL_PROFILES.find((p) => p.role === 'worker') || null;
      setProfile('worker');
      if (workerUser) {
        setAuthenticatedUser(workerUser);
        setActiveUserId(workerUser.id);
      }
      router.push('/worker');
      return;
    }

    if (target === 'owner') {
      const ownerUser = INITIAL_PROFILES.find((p) => p.role === 'owner') || null;
      setProfile('owner');
      if (ownerUser) {
        setAuthenticatedUser(ownerUser);
        setActiveUserId(ownerUser.id);
      }
      router.push('/owner');
      return;
    }

    if (target === 'admin') {
      const adminUser = INITIAL_PROFILES.find((p) => p.role === 'admin') || null;
      setProfile('admin');
      if (adminUser) {
        setAuthenticatedUser(adminUser);
        setActiveUserId(adminUser.id);
      }
      router.push('/admin');
      return;
    }
  };

  return (
    <div
      ref={menuRef}
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 99999,
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
        userSelect: 'none'
      }}
    >
      {/* Floating Popup Menu */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            bottom: '64px',
            right: '0',
            width: '280px',
            background: '#ffffff',
            borderRadius: '20px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 20px 40px rgba(17, 22, 37, 0.18), 0 4px 12px rgba(0,0,0,0.08)',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            animation: 'fadeInUp 0.18s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px', borderBottom: '1px solid #f1f5f9' }}>
            <div>
              <span style={{ fontSize: '0.7rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                DEBUG VIEW SWITCHER
              </span>
              <div style={{ fontSize: '0.86rem', fontWeight: '800', color: '#0f172a' }}>
                Alternar Visão da Aplicação
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Fechar"
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                border: 'none',
                background: '#f1f5f9',
                color: '#64748b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={14} />
            </button>
          </div>

          {/* Role Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {/* 1. Client / Landing */}
            <button
              type="button"
              onClick={() => handleSwitch('client')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                borderRadius: '12px',
                border: currentRole.key === 'client' ? '2px solid #10b981' : '1px solid #e2e8f0',
                background: currentRole.key === 'client' ? '#ecfdf5' : '#fafaf9',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#d1fae5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Home size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: '800', color: '#0f172a' }}>Cliente (Landing)</div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Página pública & Simulador</div>
                </div>
              </div>
              {currentRole.key === 'client' && <Check size={16} color="#047857" strokeWidth={3} />}
            </button>

            {/* 2. Worker (Trabalhador) */}
            <button
              type="button"
              onClick={() => handleSwitch('worker')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                borderRadius: '12px',
                border: currentRole.key === 'worker' ? '2px solid #f59e0b' : '1px solid #e2e8f0',
                background: currentRole.key === 'worker' ? '#fffbeb' : '#fafaf9',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <UserCheck size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: '800', color: '#0f172a' }}>Trabalhador (Worker)</div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Check-in & Fotos Antes/Depois</div>
                </div>
              </div>
              {currentRole.key === 'worker' && <Check size={16} color="#b45309" strokeWidth={3} />}
            </button>

            {/* 3. Owner (Proprietário) */}
            <button
              type="button"
              onClick={() => handleSwitch('owner')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                borderRadius: '12px',
                border: currentRole.key === 'owner' ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                background: currentRole.key === 'owner' ? '#eff6ff' : '#fafaf9',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#dbeafe', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Building2 size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: '800', color: '#0f172a' }}>Proprietário (Owner)</div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Imóveis & Agendamentos</div>
                </div>
              </div>
              {currentRole.key === 'owner' && <Check size={16} color="#1d4ed8" strokeWidth={3} />}
            </button>

            {/* 4. Admin */}
            <button
              type="button"
              onClick={() => handleSwitch('admin')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                borderRadius: '12px',
                border: currentRole.key === 'admin' ? '2px solid #8b5cf6' : '1px solid #e2e8f0',
                background: currentRole.key === 'admin' ? '#f5f3ff' : '#fafaf9',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#ede9fe', color: '#6d28d9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Briefcase size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: '800', color: '#0f172a' }}>Administrador (Admin)</div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Gestão de Limpezas & Pagamentos</div>
                </div>
              </div>
              {currentRole.key === 'admin' && <Check size={16} color="#6d28d9" strokeWidth={3} />}
            </button>
          </div>
        </div>
      )}

      {/* Floating Circle Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Abrir seletor de visão de debug"
        style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          border: '2px solid rgba(255, 255, 255, 0.95)',
          background: '#111625',
          color: '#ffffff',
          boxShadow: '0 8px 24px rgba(17, 22, 37, 0.28), 0 2px 6px rgba(0,0,0,0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          position: 'relative',
          transition: 'transform 0.18s ease, box-shadow 0.18s ease',
          outline: 'none'
        }}
      >
        <SlidersHorizontal size={20} color="#9bb6f6" />

        {/* Small Role Indicator Pill on the Circle */}
        <span
          style={{
            position: 'absolute',
            top: '-3px',
            right: '-3px',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: currentRole.color,
            color: '#ffffff',
            fontSize: '0.7rem',
            fontWeight: '900',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid #ffffff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.18)'
          }}
        >
          {currentRole.badge}
        </span>
      </button>
    </div>
  );
}
