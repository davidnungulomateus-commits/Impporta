'use client';

import React from 'react';
import OwnerDashboard from '@/components/Cleaning/OwnerDashboard';
import PortalNav from '@/components/Layout/PortalNav';

export default function OwnerRoute() {
  return <><PortalNav /><OwnerDashboard ownerId="owner-001" /></>;
}
