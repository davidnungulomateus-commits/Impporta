import {
  UserProfile,
  Property,
  Cleaning,
  CleaningPhoto,
  WorkerEquipment,
  PayoutRequest,
  PricingRule,
  TypologyType
} from './cleaning-types';

export const DEFAULT_PRICING_RULES: Record<TypologyType, PricingRule> = {
  T0: {
    typology: 'T0',
    owner_price: 35,
    worker_payout: 25,
    estimated_hours: 2,
    features: ['Limpeza de Superfícies & Poeiras', 'Desinfeção Completa WC', 'Troca de Lençóis & Toalhas', 'Aspirar & Lavar Chão', 'Relatório Fotográfico Antes/Depois']
  },
  T1: {
    typology: 'T1',
    owner_price: 45,
    worker_payout: 32,
    estimated_hours: 3,
    features: ['Turnover AL Completo 1 Quarto', 'Limpeza Profunda de Cozinha', 'Desinfeção Hospitalar WC', 'Reposição de Amenities & Chaves', 'Verificação de Danos de Hóspedes', 'Relatório Fotográfico Antes/Depois']
  },
  T2: {
    typology: 'T2',
    owner_price: 60,
    worker_payout: 42,
    estimated_hours: 4,
    features: ['Turnover AL 2 Quartos & Sala', 'Troca de Lençóis Dupla', 'Cozinha, Frigorífico & Forno', 'Desinfeção Sanitária Completa', 'Despejar Lixos & Reciclagem', 'Relatório Fotográfico Antes/Depois']
  },
  T3: {
    typology: 'T3',
    owner_price: 80,
    worker_payout: 55,
    estimated_hours: 5,
    features: ['Apartamento Familiar / Duplex', '3 Quartos com Camas Feitas', '2+ Casas de Banho Higienizadas', 'Varandas & Vidros Interiores', 'Auditoria Completa de Inventário', 'Relatório Fotográfico Antes/Depois']
  },
  T4: {
    typology: 'T4',
    owner_price: 100,
    worker_payout: 70,
    estimated_hours: 6,
    features: ['Grande Tipologia / Vivenda AL', 'Equipa Dedicada', 'Lavagem e Aspiração Exaustiva', 'Limpeza Detalhada de Eletrodomésticos', 'Relatório Fotográfico Completo']
  },
  'Escritório': {
    typology: 'Escritório',
    owner_price: 90,
    worker_payout: 65,
    estimated_hours: 4,
    features: ['Postos de Trabalho & Secretárias', 'Higienização de Teclados e Ecrãs', 'Copa, Micro-ondas & Frigorífico', 'Despejo de Papeleiras & Reciclagem', 'Controlo de Acessos Noturno']
  },
};

export const INITIAL_PROFILES: UserProfile[] = [
  {
    id: 'worker-001',
    name: 'Maria Santos',
    email: 'trabalhador@impporta.pt',
    password: 'password123',
    role: 'worker',
    phone: '+351 912 345 678',
    nif: '245678910',
    iban: 'PT50 0033 0000 1234 5678 9012 3',
    address: 'Rua Augusta 120, 3º Dto, 1100-053 Lisboa',
    avatar_url: '/team-turnover.jpg',
  },
  {
    id: 'worker-002',
    name: 'Ana Rodrigues',
    email: 'ana.rodrigues@impporta.pt',
    password: 'password123',
    role: 'worker',
    phone: '+351 923 456 789',
    nif: '256789012',
    iban: 'PT50 0018 0000 9876 5432 1098 7',
    address: 'Av. da Liberdade 45, 1º Esq, 1250-140 Lisboa',
    avatar_url: '/team-higienizacao.jpg',
  },
  {
    id: 'owner-001',
    name: 'João Pereira (Chiado Rentals)',
    email: 'proprietario@impporta.pt',
    password: 'password123',
    role: 'owner',
    phone: '+351 934 567 890',
    nif: '509876543',
    iban: 'PT50 0035 0000 4567 8901 2345 6',
    address: 'Largo do Chiado 8, 1200-108 Lisboa',
    avatar_url: '/team-inspecao.jpg',
  },
  {
    id: 'admin-001',
    name: 'Administrador Impporta',
    email: 'admin@impporta.pt',
    password: 'password123',
    role: 'admin',
    phone: '+351 210 000 111',
    nif: '510203040',
    iban: 'PT50 0007 0000 1122 3344 5566 7',
    address: 'Parque das Nações, Edifício Impporta, 1990-090 Lisboa',
    avatar_url: '/team-inspecao.jpg',
  }
];

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'prop-001',
    owner_id: 'owner-001',
    name: 'Chiado Luxury Loft T1',
    address: 'Rua do Alecrim 34, 2º Andar',
    city: 'Lisboa',
    postal_code: '1200-018',
    typology: 'T1',
    access_code: 'Keybox: 4892# (Portão principal: 1234)',
    default_notes: 'Lençóis lavados e toalhas limpas guardadas no armário embutido do corredor. Por favor verificar cafeteira Nespresso.',
    image_url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80',
    created_at: '2026-05-01T10:00:00Z',
  },
  {
    id: 'prop-002',
    owner_id: 'owner-001',
    name: 'Alfama River View T2',
    address: 'Calçada de São Vicente 12',
    city: 'Lisboa',
    postal_code: '1100-575',
    typology: 'T2',
    access_code: 'Smart Lock Nuki: Código temporário 8391',
    default_notes: 'Atenção especial ao chão de tábua corrida antiga (usar produto neutro de madeira). Regar as plantas da varanda se a terra estiver seca.',
    image_url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=80',
    created_at: '2026-05-05T10:00:00Z',
  },
  {
    id: 'prop-003',
    owner_id: 'owner-001',
    name: 'Cascais Marina Suite T0',
    address: 'Avenida Dom Carlos I 88, Fração B',
    city: 'Cascais',
    postal_code: '2750-310',
    typology: 'T0',
    access_code: 'Portaria com vigilante até às 19h. Chave na receção em nome de Maria / Impporta.',
    default_notes: 'Studio compacto. Verificar se o AC está desligado e janela fechada antes de sair.',
    image_url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=80',
    created_at: '2026-05-10T10:00:00Z',
  }
];

export const INITIAL_CLEANINGS: Cleaning[] = [
  {
    id: 'clean-001',
    property_id: 'prop-001',
    worker_id: 'worker-001',
    scheduled_date: 'Hoje',
    time_slot: '11:00 - 14:00',
    status: 'scheduled',
    price_owner: 45,
    price_worker: 32,
    owner_notes: 'Hóspedes saem pontualmente às 11h. Novo check-in às 15h. Por favor trocar toalhas e colocar conjunto de boas-vindas com pastéis na mesa.',
    photos: []
  },
  {
    id: 'clean-002',
    property_id: 'prop-002',
    worker_id: 'worker-001',
    scheduled_date: 'Amanhã',
    time_slot: '10:00 - 14:00',
    status: 'scheduled',
    price_owner: 60,
    price_worker: 42,
    owner_notes: 'Limpeza padrão de turnover entre hóspedes. Lixo do quintal pequeno já foi retirado.',
    photos: []
  },
  {
    id: 'clean-003',
    property_id: 'prop-003',
    worker_id: 'worker-001',
    scheduled_date: 'Ontem',
    time_slot: '12:00 - 14:00',
    status: 'completed',
    price_owner: 35,
    price_worker: 25,
    owner_notes: 'Deixar 2 garrafas de água fresca no frigorífico.',
    worker_notes: 'Limpeza concluída com excelência. Espaço ficou brilhante e impecável.',
    started_at: '2026-10-13T12:05:00Z',
    completed_at: '2026-10-13T13:50:00Z',
    photos: [
      {
        id: 'photo-b1',
        cleaning_id: 'clean-003',
        photo_type: 'before',
        photo_url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80',
        room_tag: 'Cozinha',
        uploaded_at: '2026-10-13T12:10:00Z'
      },
      {
        id: 'photo-a1',
        cleaning_id: 'clean-003',
        photo_type: 'after',
        photo_url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80',
        room_tag: 'Cozinha',
        uploaded_at: '2026-10-13T13:45:00Z'
      },
      {
        id: 'photo-b2',
        cleaning_id: 'clean-003',
        photo_type: 'before',
        photo_url: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=600&auto=format&fit=crop&q=80',
        room_tag: 'Quarto',
        uploaded_at: '2026-10-13T12:12:00Z'
      },
      {
        id: 'photo-a2',
        cleaning_id: 'clean-003',
        photo_type: 'after',
        photo_url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&auto=format&fit=crop&q=80',
        room_tag: 'Quarto',
        uploaded_at: '2026-10-13T13:48:00Z'
      }
    ],
    checklist: Object.fromEntries(Array.from({ length: 42 }, (_, i) => [`p${i + 1}`, true]))
  }
];

export const INITIAL_EQUIPMENT: WorkerEquipment[] = [
  {
    id: 'eq-001',
    worker_id: 'worker-001',
    item_name: 'Aspirador Profissional Rowenta Silence Force',
    category: 'equipamento',
    status: 'entregue',
    delivered_at: '2026-04-10'
  },
  {
    id: 'eq-002',
    worker_id: 'worker-001',
    item_name: 'Mopa Microfibra Giratória com Balde Duplo',
    category: 'equipamento',
    status: 'entregue',
    delivered_at: '2026-04-10'
  },
  {
    id: 'eq-003',
    worker_id: 'worker-001',
    item_name: 'Kit de Panos Microfibra Color-Coded (6 unidades)',
    category: 'equipamento',
    status: 'entregue',
    delivered_at: '2026-04-10'
  },
  {
    id: 'eq-004',
    worker_id: 'worker-001',
    item_name: 'Detergente Multiusos Profissional 5L',
    category: 'consumivel',
    status: 'entregue',
    delivered_at: '2026-05-01'
  },
  {
    id: 'eq-005',
    worker_id: 'worker-001',
    item_name: 'Desengordurante de Cozinha Concentrado 1L',
    category: 'consumivel',
    status: 'entregue',
    delivered_at: '2026-05-01'
  },
  {
    id: 'eq-006',
    worker_id: 'worker-001',
    item_name: 'Desinfetante Anticalcário WC 1L',
    category: 'consumivel',
    status: 'entregue',
    delivered_at: '2026-05-01'
  }
];

export const INITIAL_PAYOUTS: PayoutRequest[] = [
  {
    id: 'payout-001',
    worker_id: 'worker-001',
    worker_name: 'Maria Santos',
    amount: 145.00,
    receipt_url: '#',
    receipt_filename: 'ReciboVerde_MariaSantos_Out2026.pdf',
    status: 'approved',
    admin_notes: 'Transferência efetuada com sucesso via Millennium BCP ref: TRF-83921.',
    created_at: '2026-10-01T10:00:00Z',
    paid_at: '2026-10-02T15:30:00Z'
  }
];

const STORAGE_KEYS = {
  PROFILES: 'impporta_cleaning_profiles_v2',
  PROPERTIES: 'impporta_cleaning_properties_v2',
  CLEANINGS: 'impporta_cleaning_cleanings_v2',
  EQUIPMENT: 'impporta_cleaning_equipment_v2',
  PAYOUTS: 'impporta_cleaning_payouts_v2',
};

export function getStoredData<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

export function saveStoredData<T>(key: string, data: T) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.warn('Storage save failed:', err);
  }
}

export class CleaningStore {
  // Profiles
  static getProfiles(): UserProfile[] {
    const stored = getStoredData(STORAGE_KEYS.PROFILES, INITIAL_PROFILES);
    return stored.map(p => {
      const init = INITIAL_PROFILES.find(ip => ip.id === p.id);
      return init ? { ...init, ...p, email: p.email || init.email, password: p.password || init.password } : p;
    });
  }

  static getProfileById(id: string): UserProfile | undefined {
    return this.getProfiles().find(p => p.id === id);
  }

  static authenticateUser(
    email: string,
    password: string,
    role: 'owner' | 'worker'
  ): { user?: UserProfile; error?: string } {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { error: 'Por favor introduza um endereço de email válido.' };
    }
    if (!password || password.length < 4) {
      return { error: 'Por favor introduza a sua palavra-passe (mínimo 4 caracteres).' };
    }

    const profiles = this.getProfiles();
    const existing = profiles.find(p => p.email?.toLowerCase() === cleanEmail);

    if (existing) {
      if (existing.role !== role) {
        return { error: 'Este email está registado noutro perfil de acesso.' };
      }
      if (existing.password && existing.password !== password) {
        return { error: 'Credenciais inválidas. Verifique a sua palavra-passe.' };
      }
      return { user: existing };
    }

    // Create an isolated profile for this user so they never see other users' data
    const localName = cleanEmail.split('@')[0].replace(/[._-]/g, ' ');
    const formattedName = localName.replace(/\b\w/g, l => l.toUpperCase());
    const newProfile: UserProfile = {
      id: `${role}-${Date.now()}`,
      name: formattedName,
      email: cleanEmail,
      password,
      role,
      phone: '',
      nif: '',
      iban: '',
      address: 'Lisboa',
      avatar_url: role === 'worker' ? '/team-turnover.jpg' : '/team-inspecao.jpg',
    };
    const updatedProfiles = [...profiles, newProfile];
    saveStoredData(STORAGE_KEYS.PROFILES, updatedProfiles);
    return { user: newProfile };
  }

  static updateProfile(updated: UserProfile): void {
    const profiles = this.getProfiles().map(p => p.id === updated.id ? updated : p);
    saveStoredData(STORAGE_KEYS.PROFILES, profiles);
  }

  // Properties
  static getProperties(): Property[] {
    return getStoredData(STORAGE_KEYS.PROPERTIES, INITIAL_PROPERTIES);
  }

  static getPropertiesByOwner(ownerId: string): Property[] {
    return this.getProperties().filter(p => p.owner_id === ownerId);
  }

  static addProperty(newProp: Omit<Property, 'id' | 'created_at'>): Property {
    const props = this.getProperties();
    const created: Property = {
      ...newProp,
      id: 'prop-' + Date.now(),
      created_at: new Date().toISOString()
    };
    props.unshift(created);
    saveStoredData(STORAGE_KEYS.PROPERTIES, props);
    return created;
  }

  // Cleanings
  static getCleanings(): Cleaning[] {
    const cleanings = getStoredData(STORAGE_KEYS.CLEANINGS, INITIAL_CLEANINGS);
    const properties = this.getProperties();
    const profiles = this.getProfiles();

    return cleanings.map(c => ({
      ...c,
      property: properties.find(p => p.id === c.property_id),
      worker: profiles.find(p => p.id === c.worker_id)
    }));
  }

  static getCleaningsByWorker(workerId: string): Cleaning[] {
    return this.getCleanings().filter(c => c.worker_id === workerId);
  }

  static getCleaningsByOwner(ownerId: string): Cleaning[] {
    const props = this.getPropertiesByOwner(ownerId).map(p => p.id);
    return this.getCleanings().filter(c => props.includes(c.property_id));
  }

  static getNextCleaningForWorker(workerId: string): Cleaning | undefined {
    const workerCleanings = this.getCleaningsByWorker(workerId);
    return workerCleanings.find(c => c.status === 'scheduled' || c.status === 'in_progress');
  }

  static scheduleCleaning(
    propertyId: string,
    scheduledDate: string,
    timeSlot: string,
    ownerNotes: string,
    workerId?: string
  ): Cleaning {
    const props = this.getProperties();
    const prop = props.find(p => p.id === propertyId);
    const rule = prop ? DEFAULT_PRICING_RULES[prop.typology] : DEFAULT_PRICING_RULES['T1'];

    const newCleaning: Cleaning = {
      id: 'clean-' + Date.now(),
      property_id: propertyId,
      worker_id: workerId || 'worker-001',
      scheduled_date: scheduledDate,
      time_slot: timeSlot,
      status: 'scheduled',
      price_owner: rule.owner_price,
      price_worker: rule.worker_payout,
      owner_notes: ownerNotes,
      photos: []
    };

    const cleanings = getStoredData(STORAGE_KEYS.CLEANINGS, INITIAL_CLEANINGS);
    cleanings.unshift(newCleaning);
    saveStoredData(STORAGE_KEYS.CLEANINGS, cleanings);
    return newCleaning;
  }

  // Assign or Reassign worker to cleaning (with conflict detection)
  static assignWorker(cleaningId: string, newWorkerId: string): { success: boolean; conflictWarning?: string } {
    const cleanings = getStoredData(STORAGE_KEYS.CLEANINGS, INITIAL_CLEANINGS);
    const idx = cleanings.findIndex(c => c.id === cleaningId);
    if (idx === -1) return { success: false };

    const targetCleaning = cleanings[idx];
    // Check if new worker already has a cleaning in the same date/timeslot
    const conflict = cleanings.find(c => 
      c.id !== cleaningId &&
      c.worker_id === newWorkerId &&
      c.scheduled_date === targetCleaning.scheduled_date &&
      c.time_slot === targetCleaning.time_slot &&
      (c.status === 'scheduled' || c.status === 'in_progress')
    );

    let conflictWarning: string | undefined;
    if (conflict) {
      conflictWarning = `Atenção: O trabalhador já tem outra limpeza marcada para ${conflict.scheduled_date} (${conflict.time_slot}).`;
    }

    cleanings[idx] = {
      ...cleanings[idx],
      worker_id: newWorkerId || undefined
    };
    saveStoredData(STORAGE_KEYS.CLEANINGS, cleanings);
    return { success: true, conflictWarning };
  }

  static startCleaning(cleaningId: string, beforePhotos: { url: string; room: string }[]): void {
    const cleanings = getStoredData(STORAGE_KEYS.CLEANINGS, INITIAL_CLEANINGS);
    const idx = cleanings.findIndex(c => c.id === cleaningId);
    if (idx !== -1) {
      const existingPhotos = cleanings[idx].photos || [];
      const newPhotos: CleaningPhoto[] = beforePhotos.map((p, i) => ({
        id: `photo-b-${Date.now()}-${i}`,
        cleaning_id: cleaningId,
        photo_type: 'before',
        photo_url: p.url,
        room_tag: p.room,
        uploaded_at: new Date().toISOString()
      }));

      cleanings[idx] = {
        ...cleanings[idx],
        status: 'in_progress',
        started_at: new Date().toISOString(),
        photos: [...existingPhotos, ...newPhotos]
      };
      saveStoredData(STORAGE_KEYS.CLEANINGS, cleanings);
    }
  }

  static finishCleaning(
    cleaningId: string,
    afterPhotos: { url: string; room: string }[],
    workerNotes: string,
    checklist?: Record<string, boolean>
  ): void {
    const cleanings = getStoredData(STORAGE_KEYS.CLEANINGS, INITIAL_CLEANINGS);
    const idx = cleanings.findIndex(c => c.id === cleaningId);
    if (idx !== -1) {
      const existingPhotos = cleanings[idx].photos || [];
      const newPhotos: CleaningPhoto[] = afterPhotos.map((p, i) => ({
        id: `photo-a-${Date.now()}-${i}`,
        cleaning_id: cleaningId,
        photo_type: 'after',
        photo_url: p.url,
        room_tag: p.room,
        uploaded_at: new Date().toISOString()
      }));

      cleanings[idx] = {
        ...cleanings[idx],
        status: 'completed',
        completed_at: new Date().toISOString(),
        worker_notes: workerNotes,
        photos: [...existingPhotos, ...newPhotos],
        checklist: checklist || cleanings[idx].checklist
      };
      saveStoredData(STORAGE_KEYS.CLEANINGS, cleanings);
    }
  }

  static updateCleaning(cleaningId: string, updates: Partial<Cleaning>): void {
    const cleanings = getStoredData(STORAGE_KEYS.CLEANINGS, INITIAL_CLEANINGS);
    const idx = cleanings.findIndex(c => c.id === cleaningId);
    if (idx !== -1) {
      cleanings[idx] = { ...cleanings[idx], ...updates };
      saveStoredData(STORAGE_KEYS.CLEANINGS, cleanings);
    }
  }

  // Equipment
  static getEquipmentByWorker(workerId: string): WorkerEquipment[] {
    const items = getStoredData(STORAGE_KEYS.EQUIPMENT, INITIAL_EQUIPMENT);
    return items.filter(e => e.worker_id === workerId);
  }

  static requestEquipmentReplacement(equipmentId: string): void {
    const items = getStoredData(STORAGE_KEYS.EQUIPMENT, INITIAL_EQUIPMENT);
    const updated = items.map(e => e.id === equipmentId ? { ...e, status: 'substituicao_pedida' as const } : e);
    saveStoredData(STORAGE_KEYS.EQUIPMENT, updated);
  }

  static addEquipment(workerId: string, item_name: string, category: 'equipamento' | 'consumivel'): void {
    const items = getStoredData(STORAGE_KEYS.EQUIPMENT, INITIAL_EQUIPMENT);
    items.unshift({
      id: 'eq-' + Date.now(),
      worker_id: workerId,
      item_name,
      category,
      status: 'entregue',
      delivered_at: new Date().toISOString().split('T')[0]
    });
    saveStoredData(STORAGE_KEYS.EQUIPMENT, items);
  }

  // Payouts & Recibos Verdes
  static getPayouts(): PayoutRequest[] {
    return getStoredData(STORAGE_KEYS.PAYOUTS, INITIAL_PAYOUTS);
  }

  static getPayoutsByWorker(workerId: string): PayoutRequest[] {
    return this.getPayouts().filter(p => p.worker_id === workerId);
  }

  static requestPayout(
    workerId: string,
    workerName: string,
    amount: number,
    receiptDataUrl: string,
    filename: string
  ): PayoutRequest {
    const payouts = this.getPayouts();
    const newRequest: PayoutRequest = {
      id: 'payout-' + Date.now(),
      worker_id: workerId,
      worker_name: workerName,
      amount,
      receipt_url: receiptDataUrl,
      receipt_filename: filename,
      status: 'pending',
      created_at: new Date().toISOString()
    };
    payouts.unshift(newRequest);
    saveStoredData(STORAGE_KEYS.PAYOUTS, payouts);
    return newRequest;
  }

  static reviewPayout(payoutId: string, status: 'approved' | 'rejected', notes: string): void {
    const payouts = this.getPayouts();
    const idx = payouts.findIndex(p => p.id === payoutId);
    if (idx !== -1) {
      payouts[idx] = {
        ...payouts[idx],
        status,
        admin_notes: notes,
        paid_at: status === 'approved' ? new Date().toISOString() : undefined
      };
      saveStoredData(STORAGE_KEYS.PAYOUTS, payouts);
    }
  }

  // Worker Financial calculations
  static getWorkerFinancialSummary(workerId: string) {
    const cleanings = this.getCleaningsByWorker(workerId);
    const payouts = this.getPayoutsByWorker(workerId);

    const completedCleanings = cleanings.filter(c => c.status === 'completed' || c.status === 'approved');
    const totalEarnedAllTime = completedCleanings.reduce((sum, c) => sum + Number(c.price_worker), 0);

    const totalPaidOut = payouts
      .filter(p => p.status === 'approved')
      .reduce((sum, p) => sum + Number(p.amount), 0);

    const pendingPayoutRequests = payouts
      .filter(p => p.status === 'pending')
      .reduce((sum, p) => sum + Number(p.amount), 0);

    const availableToWithdraw = Math.max(0, totalEarnedAllTime - totalPaidOut - pendingPayoutRequests);

    return {
      totalCleaningsCompleted: completedCleanings.length,
      totalEarnedAllTime,
      totalPaidOut,
      pendingPayoutRequests,
      availableToWithdraw
    };
  }
}
