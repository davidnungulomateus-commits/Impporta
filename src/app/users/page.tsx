'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Users, 
  Search, 
  MessageSquare, 
  MapPin, 
  Calendar,
  Filter,
  MoreVertical,
  Mail,
  ShieldCheck,
  Settings
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useProfile } from '@/context/ProfileContext';

type ClientProfile = {
  id: string;
  name: string;
  avatar_url: string;
  created_at: string;
  role: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<ClientProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const { profile } = useProfile();

  useEffect(() => {
    if (profile !== 'worker') {
      router.push('/');
    }
  }, [profile, router]);

  useEffect(() => {
    if (profile !== 'worker') return;
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .in('role', ['client', 'user'])
        .order('name');
      
      if (data) setUsers(data);
      setLoading(false);
    };
    fetchUsers();
  }, [profile]);

  if (profile !== 'worker') {
    return null; // Prevents flashing the page before redirect
  }

  const handleMessage = async (userId: string, role: string) => {
    // In a real app, we'd check if a conversation exists between worker and this user
    // For now, we'll just redirect to chat with the userId as a hint
    router.push(`/chat?${role === 'agent' ? 'agentId' : 'clientId'}=${userId}`);
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container animate-in">
      <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{ 
              backgroundColor: 'var(--accent-dim)', 
              padding: '8px', 
              borderRadius: '12px',
              color: 'var(--accent)'
            }}>
              <Users size={24} />
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.5px' }}>User Directory</h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
            Manage all registered clients and platform members.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', width: '100%', maxWidth: '400px' }}>
          <div style={{ 
            backgroundColor: 'var(--bg-surface)', 
            padding: '10px 16px', 
            borderRadius: '14px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)',
            flex: 1
          }}>
            <Search size={16} color="var(--text-secondary)" />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem', background: 'transparent' }}
            />
          </div>
          <button className="btn btn-ghost" style={{ padding: '10px' }}>
            <Filter size={18} />
          </button>
        </div>
      </header>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px' }}>
          <div className="animate-spin" style={{ width: '40px', height: '40px', border: '4px solid var(--accent)', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto' }}></div>
          <p style={{ marginTop: '20px', color: 'var(--text-secondary)' }}>Loading user directory...</p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '20px' 
        }}>
          {filteredUsers.map(user => (
            <div key={user.id} className="card" style={{ 
              padding: '20px', 
              position: 'relative',
              transition: 'all 0.2s ease',
              cursor: 'default'
            }}>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                <div style={{ 
                  width: '56px', 
                  height: '56px', 
                  borderRadius: '16px', 
                  backgroundColor: 'var(--neutral)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  flexShrink: 0
                }}>
                  {user.name?.charAt(0) || 'U'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</h3>
                    <button style={{ color: 'var(--text-secondary)' }}><MoreVertical size={16} /></button>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldCheck size={12} color="var(--accent)" />
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase' }}>
                      {user.role}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)' }}>
                  <Mail size={14} />
                  <span style={{ fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name?.toLowerCase().replace(/\s+/g, '.')}@example.com</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)' }}>
                  <Calendar size={14} />
                  <span style={{ fontSize: '0.8rem' }}>Joined {new Date(user.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  onClick={() => handleMessage(user.id, user.role)}
                  className="btn btn-primary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  <MessageSquare size={16} />
                  Message
                </button>
                <button className="btn btn-ghost" style={{ padding: '10px' }}>
                  <Settings size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredUsers.length === 0 && (
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <Users size={64} color="var(--border)" style={{ marginBottom: '24px' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>No users found</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Try adjusting your search filters.</p>
        </div>
      )}
    </div>
  );
}
