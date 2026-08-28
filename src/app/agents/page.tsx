'use client';

import React from 'react';
import { MessageSquare, Star, ShieldCheck, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useProfile } from '@/context/ProfileContext';
import { supabase } from '@/lib/supabase';

export default function MyAgentsPage() {
  const { profile } = useProfile();
  const [contacts, setContacts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      let q = supabase.from('profiles').select('*');
      
      if (profile === 'user' || profile === 'client') {
        // Clients see Agents
        q = q.eq('role', 'agent');
      } else if (profile === 'agent') {
        // Agents see Clients
        q = q.in('role', ['client', 'user']);
      } else if (profile === 'worker') {
        // Workers see all Agents
        q = q.eq('role', 'agent');
      }
      
      const { data } = await q;
      if (data) {
        setContacts(data.map(d => ({
          id: d.id,
          name: d.name,
          role: d.role,
          specialty: d.role === 'agent' ? 'Sourcing Specialist' : 'Verified Client',
          rating: 4.9,
          activeDeals: 2,
          totalDeals: 10,
          lastActive: 'Just now',
          initials: d.name?.substring(0, 2).toUpperCase() ?? 'U',
        })));
      }
      setLoading(false);
    };
    fetch();
  }, [profile]);

  const title = profile === 'worker' ? 'Platform Agents'
    : profile === 'agent' ? 'My Clients'
    : 'My Sourcing Team';

  const subtitle = profile === 'worker'
    ? 'Overview of all active sourcing agents operating on the platform.'
    : profile === 'agent'
    ? 'Manage and communicate with clients you are currently serving.'
    : "Professionals you've worked with or been assigned by our team.";

  return (
    <div className="page-container animate-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 className="page-title">{title}</h1>
          <p className="page-subtitle">{subtitle}</p>
        </div>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
          <div className="animate-pulse" style={{ fontSize: '0.9rem' }}>Loading contacts…</div>
        </div>
      )}

      {!loading && contacts.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
          <ShieldCheck size={36} style={{ color: 'var(--text-tertiary)', margin: '0 auto 14px', display: 'block' }} />
          <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 6 }}>No contacts yet</div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', maxWidth: 320, margin: '0 auto 20px' }}>
            Once you're connected with {profile === 'agent' ? 'clients' : 'agents'}, they'll appear here.
          </p>
          <Link href="/chat?worker=true">
            <button className="btn btn-primary">Talk with a Worker</button>
          </Link>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
        {contacts.map(agent => (
          <div key={agent.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Header */}
            <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
              <div style={{
                width: 44, height: 44, borderRadius: 'var(--radius-md)',
                background: 'var(--accent-dim)', color: 'var(--accent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: '0.9rem', flexShrink: 0,
              }}>
                {agent.initials}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                  <span style={{ fontWeight: 700, fontSize: '0.92rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{agent.name}</span>
                  <ShieldCheck size={13} color="var(--accent)" style={{ flexShrink: 0 }} />
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{agent.specialty}</div>
              </div>
              <span className="badge badge-warning" style={{ flexShrink: 0 }}>
                <Star size={10} fill="var(--warning)" />
                {agent.rating}
              </span>
            </div>

            {/* Stats */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8,
              background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)',
              padding: '12px', border: '1px solid var(--border-subtle)',
            }}>
              {[
                { label: 'Active', value: agent.activeDeals, accent: true },
                { label: 'Total', value: agent.totalDeals, accent: false },
                { label: 'Last Active',  value: agent.lastActive,  accent: false },
              ].map(s => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.62rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontWeight: 800, fontSize: '0.85rem', color: s.accent ? 'var(--accent)' : 'var(--text-primary)' }}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 8 }}>
              <Link href={`/chat?${agent.role === 'agent' ? 'agentId' : 'clientId'}=${agent.id}`} style={{ flex: 1 }}>
                <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  <MessageSquare size={13} /> Message
                </button>
              </Link>
              <button className="btn btn-ghost" style={{ padding: '8px 12px' }}>
                <ExternalLink size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {!loading && profile !== 'worker' && (
        <div className="card card-accent" style={{ marginTop: 20, textAlign: 'center', padding: '28px' }}>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 6 }}>Need a specialized agent?</div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginBottom: 16, maxWidth: 400, margin: '0 auto 16px' }}>
            Our platform workers can connect you with the right professional for your sourcing needs.
          </p>
          <Link href="/chat?worker=true">
            <button className="btn btn-primary">Talk with a Worker</button>
          </Link>
        </div>
      )}
    </div>
  );
}
