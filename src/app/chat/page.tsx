'use client';

import React, { Suspense, useState, useMemo, useEffect, useRef } from 'react';
import ChatBox from '@/components/Chat/ChatBox';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useProfile } from '@/context/ProfileContext';
import { Search, MessageSquare, AlertCircle, Plus } from 'lucide-react';
import { useConversations } from '@/hooks/useChat';

function ChatContent() {
  const searchParams = useSearchParams();
  const { profile, activeUserId } = useProfile();
  const isWorkerProfile = profile === 'worker';
  const isWorkerChat = searchParams.get('worker') === 'true';

  const { conversations, loading, ensureConversation } = useConversations(activeUserId, profile);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const creatingRef = useRef(false);
  const router = useRouter();

  // Auto-select based on URL query params
  useEffect(() => {
    if (loading || creatingRef.current) return;

    const checkAndCreate = async () => {
      const targetAgentId = searchParams.get('agentId');
      const targetClientId = searchParams.get('clientId');

      if (!targetAgentId && !targetClientId) {
        if (!activeConvId && conversations.length > 0) {
          setActiveConvId(conversations[0]?.id ?? null);
        }
        return;
      }

      creatingRef.current = true;

      try {
        if (targetAgentId) {
          const found = conversations.find(c => c.agentId === targetAgentId);
          if (found) { 
            setActiveConvId(found.id); 
            router.replace('/chat');
            return; 
          }
          
          if (profile === 'client' || profile === 'user' || profile === 'worker') {
            const newId = await ensureConversation(activeUserId, targetAgentId);
            if (newId) setActiveConvId(newId);
            router.replace('/chat');
          }
        }
        else if (targetClientId) {
          const found = conversations.find(c => c.clientId === targetClientId);
          if (found) { 
            setActiveConvId(found.id); 
            router.replace('/chat');
            return; 
          }
          
          if (profile === 'agent' || profile === 'worker') {
            const newId = await ensureConversation(targetClientId, activeUserId);
            if (newId) setActiveConvId(newId);
            router.replace('/chat');
          }
        }
      } finally {
        // Keep the lock active for an extra moment to let the route change register
        setTimeout(() => {
          creatingRef.current = false;
        }, 500);
      }
    };

    checkAndCreate();
  }, [conversations, loading, searchParams, activeConvId, ensureConversation, profile, activeUserId]);

  const filteredConversations = useMemo(() => {
    return conversations.filter(conv => {
      // Role-based visibility is now handled by the hook's SQL query,
      // but we keep a local check for extra safety if needed.
      const matchesSearch =
        conv.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conv.agentName.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchesSearch) return false;

      if (statusFilter === 'Needs Approval') return conv.dealStatus === 'Waiting for Approval';
      if (statusFilter === 'Has Deal') return conv.hasDeal;
      if (statusFilter === 'No Deal') return !conv.hasDeal;

      return true;
    });
  }, [conversations, searchTerm, statusFilter, profile, activeUserId]);

  const activeConv = useMemo(
    () => filteredConversations.find(c => c.id === activeConvId) ?? filteredConversations[0] ?? null,
    [filteredConversations, activeConvId]
  );

  return (
    <main className="premium-chat-container">
      {/* Ambient background glows */}
      <div className="premium-ambient-glow">
        <div className="premium-ambient-blob-1" />
        <div className="premium-ambient-blob-2" />
      </div>

      {/* Conversation List Sidebar */}
      <div className={`premium-sidebar ${activeConvId ? 'hidden-mobile' : ''}`}>
        {/* Header */}
        <div className="premium-sidebar-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              {isWorkerProfile ? <AlertCircle size={20} color="var(--primary)" /> : <MessageSquare size={20} color="var(--primary)" />}
              {isWorkerProfile ? 'Moderation' : 'Messages'}
            </h2>
            <Link href={profile === 'worker' ? '/users' : '/agents'}>
              <button className="btn btn-ghost" style={{ padding: '6px' }} title="Talk to a user">
                <Plus size={18} />
              </button>
            </Link>
          </div>

          {/* Search */}
          <div className="premium-search-box">
            <Search size={14} color="var(--text-secondary)" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="premium-search-input"
            />
          </div>

          {/* Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="premium-filter-select"
          >
            <option value="All">All</option>
            <option value="Needs Approval">Needs Approval</option>
            <option value="Has Deal">Active Deals</option>
            <option value="No Deal">No Deals</option>
          </select>
        </div>

        {/* Conversation Items */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {loading ? (
            <div style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <div style={{ fontSize: '0.9rem' }}>Loading...</div>
            </div>
          ) : filteredConversations.length > 0 ? (
            filteredConversations.map(conv => {
              const isActive = conv.id === activeConv?.id;
              
              const isOwnerAgent = conv.agentId === activeUserId;
              const isOwnerClient = conv.clientId === activeUserId;
              
              let primaryName = '';
              let subLabel = '';
              
              if (isOwnerAgent) {
                primaryName = conv.clientName;
                subLabel = 'Client';
              } else if (isOwnerClient) {
                primaryName = conv.agentName;
                subLabel = 'Agent';
              } else {
                primaryName = conv.clientName;
                subLabel = `with ${conv.agentName}`;
              }

              return (
                <div
                  key={conv.id}
                  onClick={() => setActiveConvId(conv.id)}
                  className={`premium-conv-item ${isActive ? 'active' : ''}`}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div className={`premium-avatar ${isActive ? 'active-avatar' : ''}`}>
                        {primaryName.substring(0, 2).toUpperCase()}
                        <div className="premium-status-dot" />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{primaryName}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{subLabel}</div>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', marginTop: '2px' }}>
                      {conv.time}
                    </span>
                  </div>

                  <p style={{
                    fontSize: '0.78rem', color: 'var(--text-secondary)', marginLeft: '52px',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    marginBottom: '6px'
                  }}>
                    {conv.lastMessage}
                  </p>

                  {conv.hasDeal && (
                    <div style={{ marginLeft: '52px' }}>
                      <span className={`badge ${
                        conv.dealStatus === 'Waiting for Approval' ? 'badge-warning' :
                        conv.dealStatus === 'Rejected' ? 'badge-danger' : 'badge-success'
                      }`} style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: '6px' }}>
                        {conv.dealStatus ?? 'Active'}
                      </span>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <MessageSquare size={32} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
              <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>No messages yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`chat-main ${!activeConvId ? 'hidden-mobile' : ''}`}>
        <ChatBox
          isWorker={isWorkerProfile || isWorkerChat}
          activeConv={activeConv}
          onBack={() => setActiveConvId(null)}
        />
      </div>
    </main>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>}>
      <ChatContent />
    </Suspense>
  );
}
