'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Search, Bell, Sun, Moon, ChevronRight, Menu } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useProfile } from '@/context/ProfileContext';

const routeLabels: Record<string, string> = {
  '/':        'Dashboard',
  '/chat':    'Messages',
  '/deals':   'Deals',
  '/agents':  'Agents',
  '/explore': 'Explore',
  '/users':   'Users',
  '/settings':'Settings',
};

export default function TopBar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { setIsSidebarOpen } = useProfile();
  const [mounted, setMounted] = React.useState(false);
  const label = routeLabels[pathname] ?? 'Page';

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="topbar">
      {/* Mobile Menu Toggle */}
      <button 
        className="topbar-icon-btn show-mobile" 
        style={{ marginRight: '8px' }}
        onClick={() => setIsSidebarOpen(true)}
        aria-label="Open menu"
      >
        <Menu size={18} />
      </button>
      {/* Breadcrumb */}
      <div className="topbar-breadcrumb">
        <span style={{ color: 'var(--text-secondary)' }}>Impporta</span>
        <ChevronRight size={13} color="var(--text-tertiary)" />
        <span>{label}</span>
      </div>

      {/* Search */}
      <div className="topbar-search">
        <Search size={13} color="var(--text-tertiary)" />
        <input placeholder="Search deals, agents…" />
        <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', background: 'var(--bg-elevated)', padding: '2px 6px', borderRadius: '4px', fontFamily: 'var(--font-mono)', border: '1px solid var(--border)' }}>⌘K</span>
      </div>

      {/* Actions */}
      <button className="topbar-icon-btn" aria-label="Notifications">
        <Bell size={15} />
      </button>

      <button
        className="topbar-icon-btn theme-toggle"
        onClick={toggleTheme}
        aria-label="Toggle theme"
      >
        {mounted ? (theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />) : <Sun size={15} />}
      </button>

      {/* Profile dot */}
      <div style={{
        width: 28, height: 28,
        borderRadius: '50%',
        background: 'var(--accent)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '0.68rem', fontWeight: 800, color: '#fff',
        cursor: 'pointer', marginLeft: 4,
        boxShadow: '0 0 0 2px var(--accent-glow)'
      }}>
        DC
      </div>
    </header>
  );
}
