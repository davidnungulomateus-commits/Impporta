-- =============================================================
-- Impporta Platform — Complete Schema + RLS Policies
-- Run this in your Supabase SQL Editor
-- =============================================================

-- 1. Enable pgcrypto for password hashing in seed data
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ─────────────────────────────────────────────────────────────
-- TABLES
-- ─────────────────────────────────────────────────────────────

-- profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id          uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name        text NOT NULL DEFAULT '',
  role        text NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'agent', 'worker')),
  avatar_url  text,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

-- conversations
CREATE TABLE IF NOT EXISTS public.conversations (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id   uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  agent_id    uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

-- messages
CREATE TABLE IF NOT EXISTS public.messages (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id       uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  sender_role     text NOT NULL CHECK (sender_role IN ('client', 'agent', 'worker', 'system')),
  content         text NOT NULL DEFAULT '',
  type            text NOT NULL DEFAULT 'text' CHECK (type IN ('text', 'image', 'video', 'audio', 'system')),
  media_url       text,
  status          text DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'read')),
  created_at      timestamptz DEFAULT now()
);

-- deals
CREATE TABLE IF NOT EXISTS public.deals (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES public.conversations(id) ON DELETE CASCADE,
  title           text NOT NULL,
  status          text DEFAULT 'Pending' CHECK (status IN ('Pending', 'Waiting for Approval', 'Accepted', 'Rejected')),
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────
-- TRIGGER: auto-update updated_at
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_conversations_updated_at ON public.conversations;
CREATE TRIGGER set_conversations_updated_at
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Update conversations.updated_at when a new message arrives
CREATE OR REPLACE FUNCTION public.touch_conversation_on_message()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  UPDATE public.conversations SET updated_at = now() WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS touch_conversation ON public.messages;
CREATE TRIGGER touch_conversation
  AFTER INSERT ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.touch_conversation_on_message();

-- ─────────────────────────────────────────────────────────────
-- ENABLE ROW LEVEL SECURITY
-- ─────────────────────────────────────────────────────────────
ALTER TABLE public.profiles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals         ENABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────────────────────────
-- RLS POLICIES — profiles
-- Everyone can read all profiles (needed for directory/chat headers)
-- Only the profile owner can update their own row
-- ─────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "profiles: public read"  ON public.profiles;
DROP POLICY IF EXISTS "profiles: owner update" ON public.profiles;
DROP POLICY IF EXISTS "profiles: owner insert" ON public.profiles;

CREATE POLICY "profiles: public read"
  ON public.profiles FOR SELECT
  USING (true);  -- any authenticated or anonymous request can read

CREATE POLICY "profiles: owner insert"
  ON public.profiles FOR INSERT
  WITH CHECK (true);  -- allow inserts (needed for signup)

CREATE POLICY "profiles: owner update"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- ─────────────────────────────────────────────────────────────
-- RLS POLICIES — conversations
-- ─────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "convs: public read"   ON public.conversations;
DROP POLICY IF EXISTS "convs: public insert" ON public.conversations;
DROP POLICY IF EXISTS "convs: public update" ON public.conversations;

CREATE POLICY "convs: public read"
  ON public.conversations FOR SELECT
  USING (true);

CREATE POLICY "convs: public insert"
  ON public.conversations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "convs: public update"
  ON public.conversations FOR UPDATE
  USING (true);

-- ─────────────────────────────────────────────────────────────
-- RLS POLICIES — messages
-- ─────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "msgs: public read"   ON public.messages;
DROP POLICY IF EXISTS "msgs: public insert" ON public.messages;

CREATE POLICY "msgs: public read"
  ON public.messages FOR SELECT
  USING (true);

CREATE POLICY "msgs: public insert"
  ON public.messages FOR INSERT
  WITH CHECK (true);

-- ─────────────────────────────────────────────────────────────
-- RLS POLICIES — deals
-- ─────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "deals: public read"   ON public.deals;
DROP POLICY IF EXISTS "deals: public insert" ON public.deals;
DROP POLICY IF EXISTS "deals: public update" ON public.deals;

CREATE POLICY "deals: public read"
  ON public.deals FOR SELECT
  USING (true);

CREATE POLICY "deals: public insert"
  ON public.deals FOR INSERT
  WITH CHECK (true);

CREATE POLICY "deals: public update"
  ON public.deals FOR UPDATE
  USING (true);

-- ─────────────────────────────────────────────────────────────
-- ENABLE REALTIME on all tables
-- ─────────────────────────────────────────────────────────────
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
