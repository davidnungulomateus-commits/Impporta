'use client';

import React from 'react';
import WorkerDashboard from '@/components/Cleaning/WorkerDashboard';
import PortalNav from '@/components/Layout/PortalNav';

export default function WorkerRoute() {
  return <><PortalNav /><WorkerDashboard workerId="worker-001" /></>;
}
