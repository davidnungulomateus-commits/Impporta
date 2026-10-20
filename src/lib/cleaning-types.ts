export type RoleType = 'worker' | 'owner' | 'admin';

export type TypologyType = 'T0' | 'T1' | 'T2' | 'T3' | 'T4' | 'Escritório';

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  password?: string;
  role: RoleType;
  phone: string;
  nif: string;
  iban: string;
  address: string;
  avatar_url: string;
}

export interface Property {
  id: string;
  owner_id: string;
  name: string;
  address: string;
  city: string;
  postal_code: string;
  typology: TypologyType;
  access_code: string;
  default_notes: string;
  image_url?: string;
  created_at?: string;
}

export type CleaningStatus = 'scheduled' | 'in_progress' | 'completed' | 'approved' | 'cancelled';

export interface CleaningPhoto {
  id: string;
  cleaning_id: string;
  photo_type: 'before' | 'after';
  photo_url: string;
  room_tag: string;
  uploaded_at: string;
}

export interface Cleaning {
  id: string;
  property_id: string;
  property?: Property;
  worker_id?: string;
  worker?: UserProfile;
  scheduled_date: string;
  time_slot: string; // ex: "11:00 - 14:00"
  status: CleaningStatus;
  price_owner: number;
  price_worker: number;
  owner_notes: string;
  worker_notes?: string;
  started_at?: string;
  completed_at?: string;
  photos?: CleaningPhoto[];
  checklist?: Record<string, boolean>;
}

export interface WorkerEquipment {
  id: string;
  worker_id: string;
  item_name: string;
  category: 'equipamento' | 'consumivel';
  status: 'entregue' | 'substituicao_pedida';
  delivered_at: string;
}

export interface PayoutRequest {
  id: string;
  worker_id: string;
  worker_name?: string;
  amount: number;
  receipt_url: string;
  receipt_filename: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes?: string;
  created_at: string;
  paid_at?: string;
}

export interface PricingRule {
  typology: TypologyType;
  owner_price: number;
  worker_payout: number;
  estimated_hours: number;
  features: string[];
}
