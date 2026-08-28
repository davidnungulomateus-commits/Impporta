'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type ProfileType = 'agent' | 'user' | 'worker' | 'client';

interface ProfileContextType {
  profile: ProfileType;
  setProfile: (profile: ProfileType) => void;
  isExploreVisible: boolean;
  setIsExploreVisible: (visible: boolean) => void;
  activeUserId: string;
  setActiveUserId: (id: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<ProfileType>('client');
  const [isExploreVisible, setIsExploreVisible] = useState<boolean>(false);
  const [activeUserId, setActiveUserId] = useState<string>('00000000-0000-0000-0000-000000000001');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  return (
    <ProfileContext.Provider value={{ 
      profile, setProfile, 
      isExploreVisible, setIsExploreVisible, 
      activeUserId, setActiveUserId,
      isSidebarOpen, setIsSidebarOpen
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
