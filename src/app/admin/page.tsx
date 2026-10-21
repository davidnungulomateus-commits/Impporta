'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import AdminDashboard from '@/components/Cleaning/AdminDashboard';

export default function AdminRoute() {
  const router = useRouter();
  const [state, setState] = useState<'checking' | 'allowed' | 'denied'>('checking');

  useEffect(() => {
    let active = true;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace('/auth/login?next=/admin'); return; }
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
      if (!active) return;
      if (profile?.role === 'admin') setState('allowed');
      else setState('denied');
    })();
    return () => { active = false; };
  }, [router]);

  if (state === 'checking') return <main style={{ maxWidth: 520, margin: '18vh auto', padding: 24 }}><p>A verificar o acesso de administrador…</p></main>;
  if (state === 'denied') return <main style={{ maxWidth: 520, margin: '18vh auto', padding: 24 }}><h1>Acesso não autorizado</h1><p>A sua conta não tem permissões de administrador.</p></main>;
  return <AdminDashboard />;
}
