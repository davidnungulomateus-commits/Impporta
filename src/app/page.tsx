'use client';

import React, { useState } from 'react';
import NeatifyLanding from '@/components/Cleaning/NeatifyLanding';
import WorkerDashboard from '@/components/Cleaning/WorkerDashboard';
import OwnerDashboard from '@/components/Cleaning/OwnerDashboard';
import AdminDashboard from '@/components/Cleaning/AdminDashboard';
import { useProfile, ProfileType } from '@/context/ProfileContext';

export default function HomePage() {
  const { setProfile, authenticatedUser, logout } = useProfile();
  const [currentView, setCurrentView] = useState<'landing' | 'worker' | 'owner' | 'admin'>('landing');

  const handleRoleSelect = (role: ProfileType) => {
    setProfile(role);
    if (role === 'worker') setCurrentView('worker');
    else if (role === 'owner') setCurrentView('owner');
    else if (role === 'admin') setCurrentView('admin');
  };

  const handleLogout = () => {
    logout();
    setCurrentView('landing');
  };

  return (
    <div style={{ position: 'relative' }}>
      {(currentView === 'landing' || !authenticatedUser) && (
        <NeatifyLanding onNavigateToPortal={(role) => handleRoleSelect(role)} />
      )}
      {currentView === 'worker' && authenticatedUser?.role === 'worker' && (
        <WorkerDashboard workerId={authenticatedUser.id} onSwitchToHome={handleLogout} />
      )}
      {currentView === 'owner' && authenticatedUser?.role === 'owner' && (
        <OwnerDashboard ownerId={authenticatedUser.id} onSwitchToHome={handleLogout} />
      )}
      {currentView === 'admin' && authenticatedUser?.role === 'admin' && (
        <AdminDashboard onSwitchToHome={handleLogout} />
      )}
    </div>
  );
}
