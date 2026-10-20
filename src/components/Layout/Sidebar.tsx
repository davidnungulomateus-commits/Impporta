'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  LayoutDashboard,
  MessageSquare,
  Handshake,
  UserRound,
  Settings,
  LogOut,
  Briefcase,
  Users,
  Compass,
  Globe,
} from 'lucide-react';
import { useProfile, ProfileType } from '@/context/ProfileContext';

import { supabase } from '@/lib/supabase';

const profileOptions: { label: string; value: ProfileType; icon: React.ElementType }[] = [
  { label: 'Trabalhador', value: 'worker', icon: UserRound },
  { label: 'Proprietário', value: 'owner',  icon: Users },
  { label: 'Admin',       value: 'admin',  icon: Briefcase },
];

export default function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isWorkerChat = searchParams.get('worker') === 'true';
  const { profile, setProfile, isExploreVisible, activeUserId, setActiveUserId, isSidebarOpen, setIsSidebarOpen } = useProfile();
  
  // Dynamic Dev Users
  const [dbUsers, setDbUsers] = React.useState<Record<ProfileType, { id: string; name: string }[]>>({
    client: [],
    agent: [],
    worker: [],
    owner: [],
    admin: [],
    user: []
  });

  React.useEffect(() => {
    const fetchProfiles = async () => {
      const { data } = await supabase.from('profiles').select('id, name, role');
      if (data) {
        const grouped: Record<ProfileType, { id: string; name: string }[]> = {
          client: [],
          agent: [],
          worker: [],
          owner: [],
          admin: [],
          user: []
        };
        data.forEach(p => {
          // Map DB 'user' role to UI 'client' role if needed, or keep both
          const roleKey = (p.role === 'user') ? 'client' : p.role as ProfileType;
          if (grouped[roleKey]) {
            grouped[roleKey].push({ id: p.id, name: p.name });
          }
        });
        setDbUsers(grouped);

        // If activeUserId is invalid/default, auto-select the first valid one for current role
        const currentRoleUsers = grouped[profile === 'user' ? 'client' : profile];
        if (currentRoleUsers.length > 0 && !currentRoleUsers.find((u: any) => u.id === activeUserId)) {
          setActiveUserId(currentRoleUsers[0].id);
        }
      }
    };
    fetchProfiles();
  }, [profile, setActiveUserId]);

  const handleProfileChange = (newProfile: ProfileType) => {
    setProfile(newProfile);
    const roleKey = (newProfile === 'user') ? 'client' : newProfile;
    if (dbUsers[roleKey]?.length > 0) {
      setActiveUserId(dbUsers[roleKey][0].id);
    }
    if (window.innerWidth <= 1024) setIsSidebarOpen(false);
  };

  const navItems = [
    { name: 'Início (Neatify)', href: '/',       icon: LayoutDashboard },
    { name: 'Portal Trabalhador', href: '/worker', icon: UserRound },
    { name: 'Portal Proprietário', href: '/owner', icon: Users },
    { name: 'Painel Admin',     href: '/admin',   icon: Briefcase },
    { name: 'Mensagens',        href: '/chat',    icon: MessageSquare },
  ];

  const bottomItems = [
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <>
      <div 
        className={`sidebar-overlay ${isSidebarOpen ? 'visible' : ''}`} 
        onClick={() => setIsSidebarOpen(false)} 
      />
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <img 
            src="/logo.png" 
            alt="Impporta Logo" 
            style={{ width: 36, height: 36, objectFit: 'contain' }} 
          />
          <span className="sidebar-logo-text">Impporta</span>
        </div>

        {/* Profile Switcher */}
        <div className="profile-switcher">
          {profileOptions.map(({ label, value, icon: Icon }) => (
            <button
              key={value}
              onClick={() => handleProfileChange(value)}
              className={`profile-btn ${profile === value ? 'active' : ''}`}
            >
              <Icon size={12} />
              {label}
            </button>
          ))}
        </div>

        {/* Dev User Dropdown */}
        <div style={{ padding: '0 16px 12px' }}>
          <select 
            value={activeUserId}
            onChange={(e) => setActiveUserId(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '8px 10px', 
              borderRadius: 'var(--radius-sm)', 
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-elevated)',
              color: 'var(--text-primary)',
              fontSize: '0.82rem',
              fontWeight: 600,
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            {dbUsers[profile === 'user' ? 'client' : profile].map(user => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </select>
        </div>

        {/* Main Nav */}
        <div style={{ paddingTop: 8 }}>
          <p className="nav-section">Navigation</p>
          {navItems.map(({ name, href, icon: Icon }) => {
            const isActive =
              (pathname === href || (href !== '/' && pathname.startsWith(href))) &&
              !(href === '/chat' && isWorkerChat);
            return (
              <Link 
                key={name} 
                href={href} 
                className={`nav-link ${isActive ? 'active' : ''}`}
                onClick={() => { if (window.innerWidth <= 1024) setIsSidebarOpen(false); }}
              >
                <Icon size={15} strokeWidth={isActive ? 2.5 : 2} />
                {name}
              </Link>
            );
          })}

          {/* Worker CTA */}
          <div style={{ padding: '8px 12px 0' }}>
            <Link 
              href="/chat?worker=true" 
              className={`nav-cta ${isWorkerChat ? 'active' : ''}`}
              onClick={() => { if (window.innerWidth <= 1024) setIsSidebarOpen(false); }}
            >
              <Users size={14} />
              Talk with Worker
            </Link>
          </div>
        </div>

        {/* Account Section */}
        <div style={{ marginTop: 16 }}>
          <p className="nav-section">Account</p>
          {bottomItems.map(({ name, href, icon: Icon }) => (
            <Link 
              key={name} 
              href={href} 
              className={`nav-link ${pathname === href ? 'active' : ''}`}
              onClick={() => { if (window.innerWidth <= 1024) setIsSidebarOpen(false); }}
            >
              <Icon size={15} />
              {name}
            </Link>
          ))}
          <Link href="/" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 18px', color: 'var(--text-secondary)' }}>
            <Globe size={15} />
            English
          </Link>
        </div>

        {/* Footer / User */}
        <div className="sidebar-footer">
          <div className="user-card">
            <div className="user-avatar">DC</div>
            <div style={{ flex: 1 }}>
              <div className="user-name">David Client</div>
              <div className="user-role">{profile.charAt(0).toUpperCase() + profile.slice(1)} Mode</div>
            </div>
          </div>
          <button
            className="nav-link"
            style={{ width: '100%', color: 'var(--negative)', marginTop: 4, borderRadius: 'var(--radius-sm)' }}
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
