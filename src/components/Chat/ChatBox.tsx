'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import DealModal from './DealModal';
import { Send, Plus, FileText, Smile, Paperclip, Mic, MoreVertical, CheckCheck, Trash2, ChevronDown, ChevronUp, LogOut, MessageSquare, ArrowLeft } from 'lucide-react';
import { ShieldCheck } from 'lucide-react';
import { useProfile } from '@/context/ProfileContext';
import { useDeals, DealData } from '@/context/DealContext';
import { supabase } from '@/lib/supabase';
import { useChat } from '@/hooks/useChat';
import type { ConversationMeta } from '@/hooks/useChat';



interface ChatBoxProps {
  isWorker?: boolean;
  activeConv?: ConversationMeta | null;
  onBack?: () => void;
}

export default function ChatBox({ isWorker, activeConv, onBack }: ChatBoxProps) {
  const { profile, activeUserId } = useProfile();
  const { deals, addDeal, updateDeal, deleteDeal } = useDeals();

  // ----- real-time chat hook -----
  const { messages, loading: msgsLoading, sendMessage } = useChat(activeConv?.id ?? null);

  // ----- UI state -----
  const [inputText, setInputText]     = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showEmoji, setShowEmoji]     = useState(false);
  const [isDealsExpanded, setIsDealsExpanded] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeDeal, setActiveDeal]   = useState<DealData | undefined>();
  const [recordingTime, setRecordingTime] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef   = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef   = useRef<Blob[]>([]);
  const timerRef         = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Derive who we're talking to
  const interlocutorName = (() => {
    if (!activeConv) return 'Select a conversation';
    
    // Identify the "other" person
    const isOwnerAgent = activeConv.agentId === activeUserId;
    const isOwnerClient = activeConv.clientId === activeUserId;
    
    if (isOwnerAgent) return activeConv.clientName;
    if (isOwnerClient) return activeConv.agentName;
    
    // Moderator view
    return `${activeConv.clientName} & ${activeConv.agentName}`;
  })();

  // ---- send handler ----
  const handleSend = useCallback(async (type: 'text' | 'image' | 'video' | 'audio' | 'system' = 'text', mediaUrl?: string) => {
    if (type === 'text' && !inputText.trim()) return;
    if (!activeConv) return;

    let convId = activeConv.id;

    const { error } = await sendMessage({
      content: type === 'text' ? inputText.trim() : '',
      type,
      sender_id: activeUserId,
      sender_role: (profile === 'user' || profile === 'client') ? 'client' : profile as any,
      media_url: mediaUrl,
      conversationId: convId,
    });

    if (error) console.error('Send error:', error);
    if (type === 'text') setInputText('');
    setShowEmoji(false);
  }, [inputText, activeConv, profile, activeUserId, sendMessage]);

  // ---- file upload ----
  const uploadFile = async (file: File, bucket = 'chat-media') => {
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${file.name.split('.').pop()}`;
    const { error } = await supabase.storage.from(bucket).upload(path, file);
    if (error) throw error;
    return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading(true);
      const fileType = file.type.toLowerCase();
      let url = '';

      if (fileType.startsWith('image/')) {
        url = await uploadFile(file);
        await handleSend('image', url);
      } else if (fileType.startsWith('video/')) {
        url = await uploadFile(file);
        await handleSend('video', url);
      } else if (fileType.startsWith('audio/')) {
        url = await uploadFile(file);
        await handleSend('audio', url);
      } else {
        // Document or other file types
        url = await uploadFile(file);
        // Send as text message with markdown link
        if (!activeConv) return;
        const { error } = await sendMessage({
          content: `📎 [${file.name}](${url})`,
          type: 'text',
          sender_id: activeUserId,
          sender_role: (profile === 'user' || profile === 'client') ? 'client' : profile as any,
          conversationId: activeConv.id,
        });
        if (error) console.error('Send file link error:', error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = ''; // clear input
    }
  };

  // ---- audio recording ----
  const handleAudioToggle = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      audioChunksRef.current = [];
      setRecordingTime(0);

      mr.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
      mr.onstop = async () => {
        if (!audioChunksRef.current.length) return;
        setIsUploading(true);
        try {
          const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const url = await uploadFile(new File([blob], 'audio.webm', { type: 'audio/webm' }));
          await handleSend('audio', url);
        } catch (err) { console.error(err); }
        finally { setIsUploading(false); stream.getTracks().forEach(t => t.stop()); }
      };
      mr.start();
      setIsRecording(true);
      timerRef.current = setInterval(() => setRecordingTime(p => p + 1), 1000);
    } catch (err) { console.error('Mic error:', err); }
  };

  const cancelRecording = () => {
    audioChunksRef.current = [];
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  const handleCreateDeal = (deal: DealData | Omit<DealData, 'id' | 'createdAt' | 'currentStep'>) => {
    'id' in deal && deal.id ? updateDeal(deal as DealData) : addDeal(deal as any);
    setIsModalOpen(false);
    setIsDealsExpanded(true);
  };

  if (!activeConv) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        {/* Ambient background glows for empty state */}
        <div className="premium-ambient-glow">
          <div className="premium-ambient-blob-1" />
          <div className="premium-ambient-blob-2" />
        </div>
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', zIndex: 1, padding: 24 }}>
          <MessageSquare size={48} style={{ margin: '0 auto 20px', opacity: 0.25, color: 'var(--accent)' }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>Start a Conversation</h2>
          <p style={{ marginTop: 8, fontSize: '0.88rem', maxWidth: '300px', lineHeight: 1.5 }}>Select an active deal negotiation or agent from the left sidebar to begin.</p>
        </div>
      </div>
    );
  }

  const initials = interlocutorName.substring(0, 2).toUpperCase();

  return (
    <div className="premium-chat-main">
      {/* ── Header / Titlebar ── */}
      <div className="premium-chat-titlebar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {onBack && (
            <button 
              onClick={onBack} 
              className="show-mobile premium-icon-btn"
              style={{ padding: 8, marginLeft: -12 }}
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <div className="premium-avatar active-avatar">
            {initials}
            <div className="premium-status-dot" />
          </div>
          <div style={{ minWidth: 0 }}>
            <h2 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{interlocutorName}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--accent)', fontWeight: 700, letterSpacing: '0.02em', textTransform: 'uppercase' }}>Escrow Negotiation Active</span>
            </div>
          </div>
        </div>
        <button className="premium-icon-btn"><MoreVertical size={20} /></button>
      </div>

      {/* ── Pinned Deals ── */}
      {deals.length > 0 && (
        <div className="premium-deal-banner">
          <div onClick={() => setIsDealsExpanded(!isDealsExpanded)} className="premium-deal-header" style={{ cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--accent)', boxShadow: '0 0 0 4px var(--accent-dim)' }} />
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Pinned Escrow Agreement ({deals.length})</span>
            </div>
            {isDealsExpanded ? <ChevronUp size={14} color="var(--text-secondary)" /> : <ChevronDown size={14} color="var(--text-secondary)" />}
          </div>
          <div style={{ maxHeight: isDealsExpanded ? 240 : 0, overflow: 'hidden', transition: 'max-height 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>
            <div style={{ overflowY: 'auto', maxHeight: 240 }}>
              {deals.map(deal => (
                <div key={deal.id} onClick={() => { setActiveDeal(deal); setIsModalOpen(true); }} className="premium-deal-row">
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', minWidth: 0 }}>
                    <div style={{ backgroundColor: 'var(--premium-card-bg)', padding: 8, borderRadius: 10, border: '1px solid var(--premium-card-border)', flexShrink: 0 }}><FileText size={18} color="var(--accent)" /></div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{deal.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 2, fontWeight: 500 }}>
                        {deal.items.reduce((a, i) => a + i.quantity, 0)} units · €{deal.items.reduce((a, i) => a + i.unitPrice * i.quantity, 0).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexShrink: 0 }}>
                    <span style={{ 
                      backgroundColor: deal.status === 'Pending' ? 'rgba(245,158,11,0.08)' : 'rgba(34,197,94,0.08)', 
                      color: deal.status === 'Pending' ? '#f59e0b' : '#22c55e', 
                      border: deal.status === 'Pending' ? '1px solid rgba(245,158,11,0.15)' : '1px solid rgba(34,197,94,0.15)',
                      padding: '3px 10px', 
                      borderRadius: 20, 
                      fontSize: '0.68rem', 
                      fontWeight: 700 
                    }}>{deal.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Messages ── */}
      <div className="premium-message-stream">
        {msgsLoading && (
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.8rem', padding: 20 }}>Loading escrow logs...</div>
        )}
        {!msgsLoading && messages.length === 0 && activeConv && (
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 'auto' }}>
            <p style={{ fontWeight: 600 }}>Secured channel initialized. Begin messaging.</p>
          </div>
        )}

        {messages.map(msg => {
          if (msg.sender_role === 'system') {
            return (
              <div key={msg.id} style={{ alignSelf: 'center', backgroundColor: 'var(--premium-card-bg)', color: 'var(--text-secondary)', padding: '6px 14px', borderRadius: 12, fontSize: '0.75rem', fontWeight: 600, border: '1px solid var(--premium-card-border)', letterSpacing: '0.01em', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                🛡️ {msg.content}
              </div>
            );
          }

          const isOwn =
            (profile === 'user'   && msg.sender_role === 'client') ||
            (profile === 'agent'  && msg.sender_role === 'agent')  ||
            (profile === 'worker' && msg.sender_role === 'worker') ||
            (profile === 'client' && msg.sender_role === 'client');

          return (
            <div key={msg.id} style={{ alignSelf: isOwn ? 'flex-end' : 'flex-start', maxWidth: '70%', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div className={`premium-bubble ${isOwn ? 'premium-bubble-own' : 'premium-bubble-other'}`}>
                {msg.type === 'text' && (() => {
                  const match = msg.content.match(/^📎 \[(.*?)\]\((.*?)\)$/);
                  if (match) {
                    const [_, fileName, fileUrl] = match;
                    return (
                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="premium-doc-attachment"
                      >
                        <Paperclip size={18} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{fileName}</span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Download Document</span>
                        </div>
                      </a>
                    );
                  }
                  return <p style={{ fontSize: '0.92rem', lineHeight: 1.5, margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{msg.content}</p>;
                })()}
                {msg.type === 'image' && <img src={msg.media_url} alt="shared" style={{ maxWidth: '100%', borderRadius: 12, border: '1px solid var(--premium-card-border)', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }} />}
                {msg.type === 'video' && <video src={msg.media_url} controls style={{ maxWidth: '100%', borderRadius: 12, border: '1px solid var(--premium-card-border)' }} />}
                {msg.type === 'audio' && <audio src={msg.media_url} controls style={{ maxWidth: '100%', borderRadius: 12 }} />}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, alignSelf: isOwn ? 'flex-end' : 'flex-start', opacity: 0.5, padding: '0 4px' }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                {isOwn && <CheckCheck size={12} color={msg.status === 'read' ? 'var(--accent)' : undefined} />}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Input Area ── */}
      <div style={{ padding: '20px 28px 24px', background: 'transparent', display: 'flex', flexDirection: 'column', gap: 12, zIndex: 10 }}>
        {/* Moderator panel */}
        {isWorker && activeConv?.hasDeal && (
          <div style={{ backgroundColor: 'rgba(34,197,94,0.04)', padding: '10px 16px', borderRadius: 14, border: '1px solid rgba(34,197,94,0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ShieldCheck size={16} color="var(--accent)" />
              <span style={{ fontWeight: 800, fontSize: '0.72rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Auditor Mode Active</span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => handleSend('system')} className="btn btn-ghost btn-sm" style={{ padding: '4px 10px', fontSize: '0.7rem', borderRadius: 8 }}>
                Log System Audit
              </button>
            </div>
          </div>
        )}

        {/* Recording UI */}
        {isRecording ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--premium-input-bg)', padding: '12px 20px', borderRadius: 24, border: '1px solid var(--premium-input-border)', borderLeftColor: 'var(--accent)', borderLeftWidth: '2px', backdropFilter: 'blur(15px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                {[1,2,3,4,5].map(i => (
                  <div key={i} style={{ width: 3, height: 12, backgroundColor: 'var(--accent)', borderRadius: 2, animation: `waveform 1s ease-in-out infinite ${i * 0.15}s` }} />
                ))}
              </div>
              <span style={{ fontWeight: 800, color: 'var(--accent)', fontSize: '0.85rem' }}>{fmt(recordingTime)}</span>
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <button onClick={cancelRecording} style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleAudioToggle} style={{ backgroundColor: 'var(--accent)', color: 'white', padding: '6px 14px', borderRadius: 12, fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px var(--accent-glow)' }}>Send Voice</button>
            </div>
          </div>
        ) : (
          <div className="premium-input-box">
            {isUploading && (
              <div style={{ position: 'absolute', inset: 0, backgroundColor: 'var(--premium-sidebar-bg)', borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, zIndex: 5, backdropFilter: 'blur(8px)' }}>
                <div style={{ width: 16, height: 16, border: '2px solid var(--accent)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.02em' }}>Securing file transfer…</span>
              </div>
            )}
            <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
            <button onClick={() => fileInputRef.current?.click()} className="premium-icon-btn"><Paperclip size={18} /></button>
            <button onClick={handleAudioToggle} className="premium-icon-btn" style={{ marginRight: 4 }}><Mic size={18} /></button>

            <textarea
              placeholder="Write a message to begin deal discussion..."
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              rows={1}
              className="premium-input-textarea"
            />

            <button onClick={() => handleSend()} className="premium-send-button">
              <Send size={16} />
            </button>
          </div>
        )}

        {/* Agent: Create deal button */}
        {profile === 'agent' && (
          <button onClick={() => { setActiveDeal(undefined); setIsModalOpen(true); }} style={{ alignSelf: 'flex-start', padding: '6px 14px', borderRadius: 20, backgroundColor: 'rgba(34,197,94,0.05)', color: 'var(--accent)', fontSize: '0.72rem', fontWeight: 800, border: '1px solid rgba(34,197,94,0.12)', display: 'flex', alignItems: 'center', gap: 6, letterSpacing: '0.04em', cursor: 'pointer', transition: 'all 0.2s' }}>
            <Plus size={12} strokeWidth={3} /> CREATE NEW CONTRACT
          </button>
        )}
      </div>

      <DealModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setActiveDeal(undefined); }}
        userRole={profile === 'user' ? 'client' : profile as any}
        onCreateDeal={handleCreateDeal}
        onDelete={deleteDeal}
        initialDeal={activeDeal}
      />
    </div>
  );
}


