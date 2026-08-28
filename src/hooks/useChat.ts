'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export type Message = {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_role: 'client' | 'agent' | 'worker' | 'system';
  content: string;
  type: 'text' | 'image' | 'video' | 'audio' | 'system';
  media_url?: string;
  created_at: string;
  status?: 'sent' | 'delivered' | 'read';
};

export type ConversationMeta = {
  id: string;
  clientName: string;
  agentName: string;
  clientId: string;
  agentId: string;
  hasDeal: boolean;
  dealStatus: string | null;
  lastMessage: string;
  lastMessageAt: string;
  time: string;
};

/**
 * useChat — provides real-time messages via Supabase Realtime (postgres_changes).
 * This is equivalent to Socket.io rooms but uses Supabase's built-in WebSocket layer.
 */
export function useChat(conversationId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  // Fetch initial messages
  const fetchMessages = useCallback(async () => {
    if (!conversationId) {
      setMessages([]);
      return;
    }
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setMessages(data ?? []);
    }
    setLoading(false);
  }, [conversationId]);

  // Subscribe to new messages via Supabase Realtime (WebSocket)
  useEffect(() => {
    fetchMessages();

    if (!conversationId) return;

    // Unsubscribe from previous channel if switching conversations
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    const channelName = `chat:${conversationId}`;
    channelRef.current = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          if (payload.new.conversation_id !== conversationId) return;
          setMessages((prev) => {
            if (prev.some((m) => m.id === payload.new.id)) return prev;
            return [...prev, payload.new as Message];
          });
        }
      )
      .subscribe();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [conversationId, fetchMessages]);

  const sendMessage = useCallback(
    async (params: {
      content: string;
      type?: Message['type'];
      sender_id: string;
      sender_role: Message['sender_role'];
      media_url?: string;
      conversationId?: string; // override if ghost convo just got a real ID
    }) => {
      const convId = params.conversationId ?? conversationId;
      if (!convId) return { error: 'No conversation selected' };

      const newMessage = {
        conversation_id: convId,
        sender_id: params.sender_id,
        sender_role: params.sender_role,
        content: params.content,
        type: params.type ?? 'text',
        media_url: params.media_url ?? null,
        status: 'sent',
      };

      const { error: insertError } = await supabase.from('messages').insert([newMessage]);
      return { error: insertError?.message ?? null };
    },
    [conversationId]
  );

  return { messages, loading, error, sendMessage, refetch: fetchMessages };
}

/**
 * useConversations — fetches and subscribes to the conversations list in real-time.
 */
export function useConversations(userId: string, role: string) {
  const [conversations, setConversations] = useState<ConversationMeta[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConversations = useCallback(async (uid: string, r: string) => {
    let q = supabase
      .from('conversations')
      .select(`
        id,
        client_id,
        agent_id,
        created_at,
        updated_at,
        client:profiles!conversations_client_id_fkey(name),
        agent:profiles!conversations_agent_id_fkey(name),
        deals(status)
      `);

    // Visibility Logic
    if (r === 'agent') {
      q = q.eq('agent_id', uid);
    } else if (r === 'client' || r === 'user') {
      q = q.eq('client_id', uid);
    }
    // workers see all (no filter)

    const { data, error } = await q.order('updated_at', { ascending: false });

    if (data) {
      // For each conversation, fetch the last message
      const convIds = data.map((c: any) => c.id);
      let lastMsgs: Record<string, any> = {};
      if (convIds.length > 0) {
        const { data: msgData } = await supabase
          .from('messages')
          .select('conversation_id, content, created_at, type')
          .in('conversation_id', convIds)
          .order('created_at', { ascending: false });

        // Keep only the latest per conversation
        (msgData ?? []).forEach((m: any) => {
          if (!lastMsgs[m.conversation_id]) {
            lastMsgs[m.conversation_id] = m;
          }
        });
      }

      const mapped: ConversationMeta[] = data.map((c: any) => {
        const lastMsg = lastMsgs[c.id];
        const lastContent = lastMsg
          ? lastMsg.type === 'text'
            ? lastMsg.content
            : `📎 ${lastMsg.type}`
          : 'No messages yet';
        const lastTime = lastMsg
          ? new Date(lastMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        return {
          id: c.id,
          clientName: c.client?.name || 'Unknown Client',
          agentName: c.agent?.name || 'Unassigned',
          clientId: c.client_id,
          agentId: c.agent_id,
          hasDeal: c.deals?.length > 0,
          dealStatus: c.deals?.[0]?.status ?? null,
          lastMessage: lastContent,
          lastMessageAt: lastMsg?.created_at ?? c.created_at,
          time: lastTime,
        };
      });

      setConversations(mapped);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchConversations(userId, role);

    // Subscribe to new conversations being created
    const channel = supabase
      .channel('conversations:changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations' }, () => {
        fetchConversations(userId, role);
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, () => {
        // Refresh conversation list to update "last message"
        fetchConversations(userId, role);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchConversations]);

  /**
   * Ensure a conversation exists between a client and agent.
   * Returns the real conversation ID (creates one if needed).
   */
  const ensureConversation = useCallback(
    async (clientId: string, agentId: string): Promise<string | null> => {
      // Check if one already exists
      const { data: existing } = await supabase
        .from('conversations')
        .select('id')
        .eq('client_id', clientId)
        .eq('agent_id', agentId)
        .maybeSingle();

      if (existing) return existing.id;

      // Create new
      const { data: created, error } = await supabase
        .from('conversations')
        .insert([{ client_id: clientId, agent_id: agentId }])
        .select('id')
        .single();

      if (error) {
        console.error('Failed to create conversation:', error.message, 'Code:', error.code, 'Details:', error.details);
        return null;
      }
      return created.id;
    },
    []
  );

  return { conversations, loading, refetch: fetchConversations, ensureConversation };
}
