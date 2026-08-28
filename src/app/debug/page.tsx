'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function DebugPage() {
  const [results, setResults] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      const out: any = {};

      // 1. Check environment variables
      out.env = {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL || '❌ MISSING',
        key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
          ? '✅ present (' + process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.slice(0, 20) + '...)'
          : (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
            ? '✅ publishable key present'
            : '❌ MISSING'),
      };

      // 2. Raw fetch all profiles (no filter)
      const { data: allProfiles, error: allErr } = await supabase
        .from('profiles')
        .select('*');
      out.allProfiles = { data: allProfiles, error: allErr?.message };

      // 3. Fetch agents
      const { data: agents, error: agentsErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'agent');
      out.agents = { data: agents, error: agentsErr?.message };

      // 4. Fetch users (clients)
      const { data: users, error: usersErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'user');
      out.users = { data: users, error: usersErr?.message };

      // 5. Fetch workers
      const { data: workers, error: workersErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'worker');
      out.workers = { data: workers, error: workersErr?.message };

      // 6. Fetch conversations
      const { data: convs, error: convsErr } = await supabase
        .from('conversations')
        .select('*');
      out.conversations = { data: convs, error: convsErr?.message };

      setResults(out);
      setLoading(false);
    };
    run();
  }, []);

  const Section = ({ title, result }: { title: string; result: any }) => (
    <div style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: 8, color: result?.error ? '#EF4444' : '#10B981' }}>
        {result?.error ? '❌' : '✅'} {title}
        {result?.data && ` — ${Array.isArray(result.data) ? result.data.length + ' rows' : ''}`}
      </h2>
      {result?.error && (
        <div style={{ backgroundColor: '#FEF2F2', padding: '10px 14px', borderRadius: 10, color: '#EF4444', fontSize: '0.85rem', marginBottom: 8, fontFamily: 'monospace' }}>
          Error: {result.error}
        </div>
      )}
      {result?.data && (
        <pre style={{ backgroundColor: '#F8FAFC', padding: 14, borderRadius: 10, fontSize: '0.75rem', overflow: 'auto', maxHeight: 200, border: '1px solid #E2E8F0' }}>
          {JSON.stringify(result.data, null, 2)}
        </pre>
      )}
    </div>
  );

  return (
    <div style={{ padding: '40px', fontFamily: 'monospace', maxWidth: 900 }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: 8 }}>🔍 Supabase Debug Panel</h1>
      <p style={{ color: '#64748B', marginBottom: 32, fontFamily: 'sans-serif', fontSize: '0.9rem' }}>
        This page tests the connection and shows raw data from your Supabase project.
        <br />Delete <code>src/app/debug/page.tsx</code> when done.
      </p>

      {loading ? (
        <p>Running queries...</p>
      ) : (
        <>
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: 8 }}>🔑 Environment</h2>
            <pre style={{ backgroundColor: '#F8FAFC', padding: 14, borderRadius: 10, fontSize: '0.75rem', border: '1px solid #E2E8F0' }}>
              {JSON.stringify(results.env, null, 2)}
            </pre>
          </div>

          <Section title="All Profiles (no filter)" result={results.allProfiles} />
          <Section title="Agents (role=agent)" result={results.agents} />
          <Section title="Clients (role=user)" result={results.users} />
          <Section title="Workers (role=worker)" result={results.workers} />
          <Section title="Conversations" result={results.conversations} />
        </>
      )}
    </div>
  );
}
