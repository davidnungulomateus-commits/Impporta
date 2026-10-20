'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { UserProfile } from '@/lib/cleaning-types';
import { supabase } from '@/lib/supabase';

export type ProfileType = 'worker' | 'owner' | 'admin' | 'agent' | 'user' | 'client';

interface ProfileContextType {
  profile: ProfileType;
  setProfile: (profile: ProfileType) => void;
  isExploreVisible: boolean;
  setIsExploreVisible: (visible: boolean) => void;
  activeUserId: string;
  setActiveUserId: (id: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  authenticatedUser: UserProfile | null;
  setAuthenticatedUser: (user: UserProfile | null) => void;
  logout: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<ProfileType>('worker');
  const [isExploreVisible, setIsExploreVisible] = useState<boolean>(false);
  const [activeUserId, setActiveUserId] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [authenticatedUser, setAuthenticatedUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!mounted || !user) return;
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (data) { setAuthenticatedUser(data as UserProfile); setProfile(data.role as ProfileType); setActiveUserId(user.id); }
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => { if (!session) { setAuthenticatedUser(null); setActiveUserId(''); } });
    return () => { mounted = false; listener.subscription.unsubscribe(); };
  }, []);

  const logout = () => {
    void supabase.auth.signOut();
    setAuthenticatedUser(null);
    setActiveUserId('');
  };

  return (
    <ProfileContext.Provider value={{ 
      profile, setProfile, 
      isExploreVisible, setIsExploreVisible, 
      activeUserId, setActiveUserId,
      isSidebarOpen, setIsSidebarOpen,
      authenticatedUser, setAuthenticatedUser,
      logout
    }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}
