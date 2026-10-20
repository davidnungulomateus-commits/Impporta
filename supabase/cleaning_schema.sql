-- =============================================================
-- Impporta Platform — Cleaning Operations Schema & Seed
-- Run this in your Supabase SQL Editor
-- =============================================================

-- 1. Extend profiles with cleaning platform fields
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS phone text DEFAULT '',
  ADD COLUMN IF NOT EXISTS nif text DEFAULT '',
  ADD COLUMN IF NOT EXISTS iban text DEFAULT '',
  ADD COLUMN IF NOT EXISTS address text DEFAULT '';

-- Update profile role constraint if needed
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
  CHECK (role IN ('user', 'agent', 'worker', 'owner', 'client', 'admin'));

-- 2. Properties (Apartments, Buildings)
CREATE TABLE IF NOT EXISTS public.properties (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id      uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  name          text NOT NULL,
  address       text NOT NULL,
  city          text NOT NULL DEFAULT 'Lisboa',
  postal_code   text NOT NULL DEFAULT '1000-001',
  typology      text NOT NULL DEFAULT 'T1' CHECK (typology IN ('T0', 'T1', 'T2', 'T3', 'T4', 'Escritório')),
  access_code   text NOT NULL DEFAULT '',
  default_notes text NOT NULL DEFAULT '',
  image_url     text,
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);

-- 3. Cleanings (Jobs)
CREATE TABLE IF NOT EXISTS public.cleanings (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id     uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  worker_id       uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  scheduled_date  text NOT NULL,
  time_slot       text NOT NULL DEFAULT '11:00 - 14:00',
  status          text NOT NULL DEFAULT 'scheduled' 
                  CHECK (status IN ('scheduled', 'in_progress', 'completed', 'approved', 'cancelled')),
  price_owner     numeric(10,2) NOT NULL DEFAULT 45.00,
  price_worker    numeric(10,2) NOT NULL DEFAULT 32.00,
  owner_notes     text DEFAULT '',
  worker_notes    text DEFAULT '',
  checklist_data  jsonb DEFAULT '{}'::jsonb,
  started_at      timestamptz,
  completed_at    timestamptz,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

-- Ensure column exists if table was already created
ALTER TABLE public.cleanings ADD COLUMN IF NOT EXISTS checklist_data jsonb DEFAULT '{}'::jsonb;

-- 4. Cleaning Photos (Before and After)
CREATE TABLE IF NOT EXISTS public.cleaning_photos (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cleaning_id   uuid NOT NULL REFERENCES public.cleanings(id) ON DELETE CASCADE,
  photo_type    text NOT NULL CHECK (photo_type IN ('before', 'after')),
  photo_url     text NOT NULL,
  room_tag      text NOT NULL DEFAULT 'Geral',
  uploaded_at   timestamptz DEFAULT now()
);

-- 5. Worker Equipment & Products
CREATE TABLE IF NOT EXISTS public.worker_equipment (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id     uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  item_name     text NOT NULL,
  category      text NOT NULL DEFAULT 'equipamento' CHECK (category IN ('equipamento', 'consumivel')),
  status        text NOT NULL DEFAULT 'entregue' CHECK (status IN ('entregue', 'substituicao_pedida')),
  delivered_at  timestamptz DEFAULT now()
);

-- 6. Payout Requests (Cash withdrawals with Green Receipts / Recibos Verdes)
CREATE TABLE IF NOT EXISTS public.payout_requests (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id         uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount            numeric(10,2) NOT NULL,
  receipt_url       text NOT NULL,
  receipt_filename  text NOT NULL DEFAULT 'recibo_verde.pdf',
  status            text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes       text DEFAULT '',
  created_at        timestamptz DEFAULT now(),
  paid_at           timestamptz
);

-- Enable RLS
ALTER TABLE public.properties       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cleanings        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cleaning_photos  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.worker_equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payout_requests  ENABLE ROW LEVEL SECURITY;

-- Permissive public policies for app functionality
CREATE POLICY "properties_all" ON public.properties FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "cleanings_all" ON public.cleanings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "cleaning_photos_all" ON public.cleaning_photos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "worker_equipment_all" ON public.worker_equipment FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "payout_requests_all" ON public.payout_requests FOR ALL USING (true) WITH CHECK (true);

-- 7. Storage for cleaning evidence and payout receipts
-- Keep the bucket private: production access should be granted through
-- authenticated, ownership-aware policies rather than public URLs.
INSERT INTO storage.buckets (id, name, public)
VALUES ('cleaning-media', 'cleaning-media', false)
ON CONFLICT (id) DO UPDATE SET public = false;

DROP POLICY IF EXISTS "cleaning_media_read" ON storage.objects;
DROP POLICY IF EXISTS "cleaning_media_insert" ON storage.objects;
DROP POLICY IF EXISTS "cleaning_media_update" ON storage.objects;
DROP POLICY IF EXISTS "cleaning_media_delete" ON storage.objects;

CREATE POLICY "cleaning_media_read"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'cleaning-media');

CREATE POLICY "cleaning_media_insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'cleaning-media');

CREATE POLICY "cleaning_media_update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'cleaning-media')
  WITH CHECK (bucket_id = 'cleaning-media');

CREATE POLICY "cleaning_media_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'cleaning-media');
