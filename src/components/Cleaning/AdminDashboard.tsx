'use client';

import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Tabs from '@radix-ui/react-tabs';
import { CleaningStore, DEFAULT_PRICING_RULES } from '@/lib/cleaning-store';
import {
  UserProfile,
  Property,
  Cleaning,
  WorkerEquipment,
  PayoutRequest,
  TypologyType
} from '@/lib/cleaning-types';
import {
  ShieldCheck,
  Building2,
  Calendar,
  Clock,
  Euro,
  Users,
  Package,
  FileText,
  CheckCircle2,
  XCircle,
  Edit,
  Plus,
  Trash2,
  ExternalLink,
  Check,
  X,
  AlertCircle,
  Eye,
  Camera,
  ArrowRight,
  UserCheck,
  RefreshCw,
  Lock,
  Award,
  FileCheck
} from 'lucide-react';

interface AdminDashboardProps {
  onSwitchToHome?: () => void;
}

export default function AdminDashboard({ onSwitchToHome }: AdminDashboardProps) {
  const [cleanings, setCleanings] = useState<Cleaning[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [equipment, setEquipment] = useState<WorkerEquipment[]>([]);
  const [payouts, setPayouts] = useState<PayoutRequest[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  // Active Tab: 'cleanings' | 'payouts' | 'properties' | 'equipment'
  const [activeTab, setActiveTab] = useState<'cleanings' | 'payouts' | 'properties' | 'equipment'>('cleanings');

  // Modals
  const [editingCleaning, setEditingCleaning] = useState<Cleaning | null>(null);
  const [showAddCleaningModal, setShowAddCleaningModal] = useState(false);
  const [showAddEquipModal, setShowAddEquipModal] = useState(false);
  const [reviewingPayout, setReviewingPayout] = useState<PayoutRequest | null>(null);
  const [viewingPhotos, setViewingPhotos] = useState<Cleaning | null>(null);
  const [payoutNotes, setPayoutNotes] = useState('');

  // Worker Reassignment Modal State
  const [reassignCleaning, setReassignCleaning] = useState<Cleaning | null>(null);
  const [selectedNewWorkerId, setSelectedNewWorkerId] = useState('');
  const [conflictAlert, setConflictAlert] = useState<string | null>(null);

  // Add Cleaning State
  const [newPropId, setNewPropId] = useState('');
  const [newWorkerId, setNewWorkerId] = useState('');
  const [newDate, setNewDate] = useState('Hoje');
  const [newTimeSlot, setNewTimeSlot] = useState('11:00 - 14:00');
  const [newNotes, setNewNotes] = useState('');

  // Add Equipment State
  const [targetWorkerId, setTargetWorkerId] = useState('');
  const [equipItemName, setEquipItemName] = useState('');
  const [equipCategory, setEquipCategory] = useState<'equipamento' | 'consumivel'>('equipamento');

  // Load Data
  useEffect(() => {
    setCleanings(CleaningStore.getCleanings());
    setProperties(CleaningStore.getProperties());
    setProfiles(CleaningStore.getProfiles());
    setPayouts(CleaningStore.getPayouts());
    const allEq: WorkerEquipment[] = [];
    CleaningStore.getProfiles().forEach(p => {
      allEq.push(...CleaningStore.getEquipmentByWorker(p.id));
    });
    setEquipment(allEq);
  }, [refreshKey]);

  const refreshAll = () => setRefreshKey(k => k + 1);

  const workers = profiles.filter(p => p.role === 'worker');
  const owners = profiles.filter(p => p.role === 'owner');

  // Direct Worker Assignment from Dropdown or Modal
  const handleAssignWorker = (cleaningId: string, workerId: string) => {
    const res = CleaningStore.assignWorker(cleaningId, workerId);
    if (res.conflictWarning) {
      alert(res.conflictWarning);
    }
    refreshAll();
  };

  // Open Reassign Modal
  const handleOpenReassignModal = (c: Cleaning) => {
    setReassignCleaning(c);
    setSelectedNewWorkerId(c.worker_id || '');
    setConflictAlert(null);
  };

  // Confirm Reassignment
  const handleConfirmReassign = () => {
    if (!reassignCleaning) return;
    const res = CleaningStore.assignWorker(reassignCleaning.id, selectedNewWorkerId);
    if (res.conflictWarning) {
      setConflictAlert(res.conflictWarning);
      refreshAll();
      setTimeout(() => {
        setReassignCleaning(null);
        setConflictAlert(null);
      }, 1500);
    } else {
      setReassignCleaning(null);
      refreshAll();
    }
  };

  // Update Cleaning
  const handleSaveCleaningEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCleaning) return;
    CleaningStore.updateCleaning(editingCleaning.id, {
      scheduled_date: editingCleaning.scheduled_date,
      time_slot: editingCleaning.time_slot,
      status: editingCleaning.status,
      worker_id: editingCleaning.worker_id,
      price_owner: Number(editingCleaning.price_owner),
      price_worker: Number(editingCleaning.price_worker),
      owner_notes: editingCleaning.owner_notes
    });
    setEditingCleaning(null);
    refreshAll();
  };

  // Add Cleaning
  const handleAddCleaningSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPropId) return;
    CleaningStore.scheduleCleaning(newPropId, newDate, newTimeSlot, newNotes, newWorkerId);
    setShowAddCleaningModal(false);
    setNewNotes('');
    refreshAll();
  };

  // Review Payout
  const handlePayoutDecision = (status: 'approved' | 'rejected') => {
    if (!reviewingPayout) return;
    CleaningStore.reviewPayout(reviewingPayout.id, status, payoutNotes);
    setReviewingPayout(null);
    setPayoutNotes('');
    refreshAll();
  };

  // Add Equipment
  const handleAddEquipmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetWorkerId || !equipItemName) return;
    CleaningStore.addEquipment(targetWorkerId, equipItemName, equipCategory);
    setShowAddEquipModal(false);
    setEquipItemName('');
    refreshAll();
  };

  // Quick Stats
  const totalRevenue = cleanings.reduce((sum, c) => sum + Number(c.price_owner), 0);
  const totalWorkerPayouts = cleanings.filter(c => c.status === 'completed' || c.status === 'approved').reduce((sum, c) => sum + Number(c.price_worker), 0);
  const platformMargin = totalRevenue - totalWorkerPayouts;
  const pendingPayoutsCount = payouts.filter(p => p.status === 'pending').length;
  const addOnEconomics = [
    { service: 'Jardinagem', sell: 75, contractor: 50, margin: 25, unit: '/ visita' },
    { service: 'Limpeza de piscinas', sell: 120, contractor: 80, margin: 40, unit: '/ visita' },
    { service: 'Vidros exteriores', sell: 65, contractor: 45, margin: 20, unit: '/ serviço' },
    { service: 'Pintura interior', sell: 14, contractor: 10, margin: 4, unit: '/ m²' },
  ];

  return (
    <div style={{ background: '#f7f4ee', minHeight: '100vh', padding: '32px 24px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        
        {/* Neatify Admin Header Card */}
        <div style={{
          background: '#111625',
          color: '#ffffff',
          borderRadius: '24px',
          padding: '28px 32px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
          boxShadow: '0 12px 32px rgba(17, 22, 37, 0.2)',
          marginBottom: '28px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              background: 'rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f59e0b',
              border: '2px solid rgba(155, 182, 246, 0.3)'
            }}>
              <ShieldCheck size={36} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h1 style={{ fontSize: '1.6rem', fontWeight: '900', margin: 0, letterSpacing: '-0.02em' }}>
                  Torre de Controlo Impporta
                </h1>
                <span style={{
                  background: '#9bb6f6',
                  color: '#0f172a',
                  fontSize: '0.75rem',
                  fontWeight: '900',
                  padding: '3px 10px',
                  borderRadius: '999px',
                  textTransform: 'uppercase'
                }}>
                  Super Admin
                </span>
              </div>
              <p style={{ margin: '6px 0 0 0', color: '#9ca3af', fontSize: '0.85rem' }}>
                Gestão central de horários, atribuição flexível de trabalhadores, auditoria de recibos verdes e stock
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setShowAddCleaningModal(true)}
              style={{
                padding: '12px 24px',
                borderRadius: '999px',
                border: 'none',
                background: '#9bb6f6',
                color: '#0f172a',
                fontWeight: '900',
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(155, 182, 246, 0.4)'
              }}
            >
              <Plus size={16} /> Criar Limpeza
            </button>
          </div>
        </div>

        {/* KPI Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          <div style={{ background: '#ffffff', border: '1px solid #e7e3da', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
            <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: '700', textTransform: 'uppercase' }}>Total de Limpezas</span>
            <div style={{ fontSize: '2.2rem', fontWeight: '900', color: '#111625', marginTop: '6px' }}>
              {cleanings.length}
            </div>
            <span style={{ fontSize: '0.75rem', color: '#7c9de9', fontWeight: '800' }}>Em curso e agendadas</span>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #e7e3da', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
            <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: '700', textTransform: 'uppercase' }}>Receita Total Cobrada</span>
            <div style={{ fontSize: '2.2rem', fontWeight: '900', color: '#2563eb', marginTop: '6px' }}>
              {totalRevenue.toFixed(2)} €
            </div>
            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Faturação a proprietários</span>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #e7e3da', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
            <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: '700', textTransform: 'uppercase' }}>Ganhos Trabalhadores</span>
            <div style={{ fontSize: '2.2rem', fontWeight: '900', color: '#16a34a', marginTop: '6px' }}>
              {totalWorkerPayouts.toFixed(2)} €
            </div>
            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Margem Impporta: {platformMargin.toFixed(2)} €</span>
          </div>

          <div style={{ background: '#111625', color: '#ffffff', borderRadius: '20px', padding: '24px', boxShadow: '0 12px 24px rgba(17, 22, 37, 0.15)' }}>
            <span style={{ fontSize: '0.75rem', color: '#9bb6f6', fontWeight: '800', textTransform: 'uppercase' }}>Recibos Verdes Pendentes</span>
            <div style={{ fontSize: '2.2rem', fontWeight: '900', color: '#ffffff', marginTop: '6px' }}>
              {pendingPayoutsCount}
            </div>
            <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Aguardam conferência fiscal</span>
          </div>
        </div>

        <div style={{ background: '#18372d', color: '#ffffff', borderRadius: '20px', padding: '24px', marginBottom: '28px', boxShadow: '0 12px 28px rgba(24,55,45,.14)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
            <div>
              <div style={{ color: '#b9e4c4', fontSize: '.7rem', fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase' }}>Gestão interna · Add-ons</div>
              <h2 style={{ margin: '6px 0 0', fontSize: '1.35rem' }}>Economia dos serviços complementares</h2>
            </div>
            <span style={{ color: '#b9e4c4', fontSize: '.75rem' }}>Valores alvo sem IVA</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '10px' }}>
            {addOnEconomics.map((item) => (
              <div key={item.service} style={{ padding: '14px', background: 'rgba(255,255,255,.08)', border: '1px solid rgba(185,228,196,.22)', borderRadius: '14px' }}>
                <div style={{ fontWeight: 800, fontSize: '.85rem' }}>{item.service}</div>
                <div style={{ marginTop: '10px', fontSize: '.75rem', color: '#c9d8ce' }}>Venda: {item.sell.toFixed(2)} € {item.unit}</div>
                <div style={{ fontSize: '.75rem', color: '#c9d8ce' }}>Subcontratação: {item.contractor.toFixed(2)} € {item.unit}</div>
                <div style={{ marginTop: '7px', color: '#8bcf9d', fontWeight: 900 }}>Margem bruta: {item.margin.toFixed(2)} € {item.unit}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '14px', color: '#b9cabe', fontSize: '.72rem', lineHeight: 1.5 }}>Confirmar sempre o orçamento do prestador antes de aceitar o serviço. Acrescentar deslocação, materiais, acesso em altura e reparações quando aplicável.</div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            INSTITUTIONAL TRUST & AUDIT INDICATOR (ADMIN)
            ───────────────────────────────────────────────────────────── */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e7e3da',
          borderRadius: '16px',
          padding: '14px 20px',
          marginBottom: '28px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          boxShadow: '0 2px 8px rgba(17, 22, 37, 0.04)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#e8eefc', color: '#1e3a8a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#111625' }}>
                Torre de Controlo & Conformidade Institucional Impporta
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                Auditoria de Recibos Verdes (Finanças AT) • Validação de IBANs bancários
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span className="trust-badge-pill green">
              <FileCheck size={12} /> Validação AT Ativa
            </span>
            <span className="trust-badge-pill dark">
              <Lock size={12} /> IBAN Seguro
            </span>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            RADIX TABS: ADMIN MANAGEMENT SECTIONS
            ───────────────────────────────────────────────────────────── */}
        <Tabs.Root value={activeTab} onValueChange={(val) => setActiveTab(val as any)} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Tabs.List style={{
            display: 'inline-flex',
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '999px',
            padding: '4px',
            gap: '4px',
            maxWidth: 'fit-content',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            overflowX: 'auto',
            marginBottom: '8px'
          }}>
            <Tabs.Trigger value="cleanings" className="radix-tabs-trigger">
              <Calendar size={16} /> Limpezas & Atribuição ({cleanings.length})
            </Tabs.Trigger>
            <Tabs.Trigger value="payouts" className="radix-tabs-trigger">
              <Euro size={16} /> Recibos Verdes ({pendingPayoutsCount})
            </Tabs.Trigger>
            <Tabs.Trigger value="properties" className="radix-tabs-trigger">
              <Building2 size={16} /> Apartamentos Registados ({properties.length})
            </Tabs.Trigger>
            <Tabs.Trigger value="equipment" className="radix-tabs-trigger">
              <Package size={16} /> Equipamentos & Stock
            </Tabs.Trigger>
          </Tabs.List>

          {/* TAB 1: CLEANINGS & WORKER ASSIGNMENT */}
          <Tabs.Content value="cleanings">
          <div style={{
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '24px',
            padding: '28px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.02)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#7c9de9', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  • DISPATCHING & ATRIBUIÇÃO
                </span>
                <h3 style={{ margin: '4px 0 0 0', fontSize: '1.25rem', fontWeight: '900', color: '#111625' }}>
                  Gestão de Limpezas & Trabalhadores Atribuídos ({cleanings.length})
                </h3>
              </div>
              <button
                onClick={() => setShowAddCleaningModal(true)}
                style={{ padding: '10px 20px', borderRadius: '999px', background: '#111625', color: '#fff', border: 'none', fontWeight: '800', fontSize: '0.85rem', cursor: 'pointer' }}
              >
                + Nova Limpeza
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e5e7eb', color: '#6b7280', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                    <th style={{ padding: '14px' }}>Imóvel</th>
                    <th style={{ padding: '14px' }}>Data / Horário</th>
                    <th style={{ padding: '14px' }}>Trabalhador Atribuído (Trocar)</th>
                    <th style={{ padding: '14px' }}>Preço Cliente / Ganho Trab.</th>
                    <th style={{ padding: '14px' }}>Estado</th>
                    <th style={{ padding: '14px' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {cleanings.map((c) => (
                    <tr key={c.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '16px 14px', fontWeight: '700', color: '#111625' }}>
                        {c.property?.name}
                        <span style={{ display: 'block', fontSize: '0.75rem', color: '#6b7280', fontWeight: '500' }}>
                          {c.property?.typology} • {c.property?.address}
                        </span>
                      </td>

                      <td style={{ padding: '16px 14px' }}>
                        <div style={{ fontWeight: '700', color: '#111625' }}>{c.scheduled_date}</div>
                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{c.time_slot}</span>
                      </td>

                      {/* WORKER ASSIGNMENT DROPDOWN / QUICK REASSIGN */}
                      <td style={{ padding: '16px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <select
                            value={c.worker_id || ''}
                            onChange={(e) => handleAssignWorker(c.id, e.target.value)}
                            style={{
                              padding: '6px 12px',
                              borderRadius: '8px',
                              border: c.worker_id ? '1px solid #a7f3d0' : '1px solid #f59e0b',
                              background: c.worker_id ? '#f4fbf6' : '#fffbeb',
                              color: c.worker_id ? '#065f46' : '#b45309',
                              fontWeight: '700',
                              fontSize: '0.85rem',
                              cursor: 'pointer'
                            }}
                          >
                            <option value="">⚠️ Sem trabalhador (Em aberto)</option>
                            {workers.map(w => (
                              <option key={w.id} value={w.id}>
                                {w.name} ({w.phone})
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => handleOpenReassignModal(c)}
                            title="Reatribuir com verificação detalhada"
                            style={{
                              padding: '6px 10px',
                              borderRadius: '8px',
                              background: '#f8fafc',
                              border: '1px solid #e2e8f0',
                              color: '#374151',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center'
                            }}
                          >
                            <UserCheck size={14} color="#059669" />
                          </button>
                        </div>
                      </td>

                      <td style={{ padding: '16px 14px' }}>
                        <div style={{ fontWeight: '800', color: '#0d2e23' }}>{c.price_owner.toFixed(2)} €</div>
                        <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: '700' }}>
                          Trab: {c.price_worker.toFixed(2)} €
                        </span>
                      </td>

                      <td style={{ padding: '16px 14px' }}>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: '800',
                          padding: '4px 10px',
                          borderRadius: '999px',
                          background: c.status === 'completed' ? '#ecfdf5' : c.status === 'in_progress' ? '#fef3c7' : '#eff6ff',
                          color: c.status === 'completed' ? '#065f46' : c.status === 'in_progress' ? '#b45309' : '#1e40af'
                        }}>
                          {c.status}
                        </span>
                      </td>

                      <td style={{ padding: '16px 14px' }}>
                        <button
                          onClick={() => setViewingPhotos(c)}
                          disabled={!c.photos?.length}
                          title={c.photos?.length ? 'Ver fotografias do serviço' : 'Ainda sem fotografias'}
                          style={{
                            padding: '6px 10px',
                            marginRight: '6px',
                            borderRadius: '8px',
                            border: '1px solid #cbd5e1',
                            background: c.photos?.length ? '#eff6ff' : '#f8fafc',
                            color: c.photos?.length ? '#1d4ed8' : '#94a3b8',
                            cursor: c.photos?.length ? 'pointer' : 'not-allowed',
                            fontWeight: '700',
                            fontSize: '0.8rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        ><Camera size={14} /> Fotos ({c.photos?.length || 0})</button>
                        <button
                          onClick={() => setEditingCleaning(c)}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '8px',
                            border: '1px solid #d1d5db',
                            background: '#ffffff',
                            color: '#374151',
                            cursor: 'pointer',
                            fontWeight: '700',
                            fontSize: '0.8rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Edit size={14} /> Editar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          </Tabs.Content>

          {/* TAB 2: PAYOUTS & RECIBOS VERDES AUDIT */}
          <Tabs.Content value="payouts">
          <div style={{
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '24px',
            padding: '28px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.02)'
          }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem', fontWeight: '800', color: '#0d2e23' }}>
              Pedidos de Levantamento & Auditoria de Recibos Verdes
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '24px' }}>
              Valide os Recibos Verdes emitidos contra as Finanças pelos trabalhadores antes de aprovar a transferência bancária para o respetivo IBAN.
            </p>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e5e7eb', color: '#6b7280', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                    <th style={{ padding: '14px' }}>Trabalhador</th>
                    <th style={{ padding: '14px' }}>Valor a Pagar</th>
                    <th style={{ padding: '14px' }}>IBAN de Destino</th>
                    <th style={{ padding: '14px' }}>Ficheiro Recibo Verde</th>
                    <th style={{ padding: '14px' }}>Estado</th>
                    <th style={{ padding: '14px' }}>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {payouts.map((p) => {
                    const workerObj = profiles.find(pr => pr.id === p.worker_id);
                    return (
                      <tr key={p.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '16px 14px', fontWeight: '700', color: '#0d2e23' }}>
                          {p.worker_name || workerObj?.name}
                          <span style={{ display: 'block', fontSize: '0.75rem', color: '#6b7280', fontWeight: '500' }}>
                            NIF: {workerObj?.nif || 'Não indicado'}
                          </span>
                        </td>
                        <td style={{ padding: '16px 14px', fontSize: '1.15rem', fontWeight: '800', color: '#065f46' }}>
                          {p.amount.toFixed(2)} €
                        </td>
                        <td style={{ padding: '16px 14px', fontFamily: 'monospace', fontSize: '0.85rem', color: '#374151', fontWeight: '600' }}>
                          {workerObj?.iban || 'Sem IBAN'}
                        </td>
                        <td style={{ padding: '16px 14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <FileText size={16} color="#059669" />
                            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#065f46' }}>
                              {p.receipt_filename}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: '16px 14px' }}>
                          <span style={{
                            fontSize: '0.75rem',
                            fontWeight: '800',
                            padding: '4px 10px',
                            borderRadius: '999px',
                            background: p.status === 'approved' ? '#ecfdf5' : p.status === 'rejected' ? '#fef2f2' : '#fef3c7',
                            color: p.status === 'approved' ? '#065f46' : p.status === 'rejected' ? '#b91c1c' : '#b45309'
                          }}>
                            {p.status === 'approved' ? 'Pago' : p.status === 'rejected' ? 'Rejeitado' : 'Pendente de Revisão'}
                          </span>
                        </td>
                        <td style={{ padding: '16px 14px' }}>
                          {p.status === 'pending' ? (
                            <button
                              onClick={() => { setReviewingPayout(p); setPayoutNotes(''); }}
                              style={{
                                padding: '8px 16px',
                                borderRadius: '999px',
                                background: '#0d2e23',
                                color: '#fff',
                                border: 'none',
                                fontWeight: '700',
                                fontSize: '0.8rem',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px'
                              }}
                            >
                              Conferir Recibo & Pagar <ArrowRight size={14} color="#a3e635" />
                            </button>
                          ) : (
                            <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                              {p.admin_notes || 'Processado'}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          </Tabs.Content>

          {/* TAB 3: PROPERTIES MANAGEMENT */}
          <Tabs.Content value="properties">
          <div style={{
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '24px',
            padding: '28px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.02)'
          }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.25rem', fontWeight: '800', color: '#0d2e23' }}>
              Todos os Apartamentos Registados ({properties.length})
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
              {properties.map(p => (
                <div key={p.id} style={{ border: '1px solid #e5e7eb', borderRadius: '16px', padding: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '800', color: '#0d2e23' }}>{p.name}</h4>
                    <span style={{ fontSize: '0.75rem', padding: '3px 10px', borderRadius: '999px', background: '#eff6ff', color: '#2563eb', fontWeight: '800' }}>
                      {p.typology}
                    </span>
                  </div>
                  <p style={{ margin: '6px 0', fontSize: '0.85rem', color: '#6b7280' }}>{p.address}, {p.city}</p>
                  <div style={{ fontSize: '0.8rem', background: '#fffbeb', color: '#92400e', padding: '8px 12px', borderRadius: '8px', marginTop: '10px' }}>
                    <strong>Acesso:</strong> {p.access_code}
                  </div>
                </div>
              ))}
            </div>
          </div>
          </Tabs.Content>

          {/* TAB 4: EQUIPMENT & STOCK */}
          <Tabs.Content value="equipment">
          <div style={{
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '24px',
            padding: '28px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.02)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: '#0d2e23' }}>
                  Gestão de Equipamentos & Produtos dos Trabalhadores
                </h3>
                <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '0.85rem' }}>
                  Atribua kits de limpeza ou atenda a pedidos de reposição dos trabalhadores.
                </p>
              </div>
              <button
                onClick={() => setShowAddEquipModal(true)}
                style={{ padding: '10px 20px', borderRadius: '999px', background: '#0d2e23', color: '#fff', border: 'none', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer' }}
              >
                + Atribuir Material
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {equipment.map(item => {
                const workerObj = profiles.find(p => p.id === item.worker_id);
                return (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px 20px',
                      borderRadius: '16px',
                      border: '1px solid #e5e7eb',
                      background: item.status === 'substituicao_pedida' ? '#fffbeb' : '#f8fafc'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <Package size={22} color={item.status === 'substituicao_pedida' ? '#b45309' : '#059669'} />
                      <div>
                        <div style={{ fontWeight: '800', fontSize: '0.95rem', color: '#0d2e23' }}>
                          {item.item_name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                          Em posse de: <strong>{workerObj?.name || 'Trabalhador'}</strong> • Categoria: {item.category.toUpperCase()} • Entregue em: {item.delivered_at}
                        </div>
                      </div>
                    </div>

                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: '800',
                      padding: '4px 12px',
                      borderRadius: '999px',
                      background: item.status === 'substituicao_pedida' ? '#fef3c7' : '#ecfdf5',
                      color: item.status === 'substituicao_pedida' ? '#b45309' : '#065f46'
                    }}>
                      {item.status === 'substituicao_pedida' ? '⚠️ Reposição Pedida' : 'Entregue'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          </Tabs.Content>
        </Tabs.Root>

        {/* ================= MODAL 1: REATRIBUIR TRABALHADOR (RADIX DIALOG) ================= */}
        <Dialog.Root open={!!reassignCleaning} onOpenChange={(open) => { if (!open) setReassignCleaning(null); }}>
          <Dialog.Portal>
            <Dialog.Overlay className="radix-dialog-overlay" />
            <Dialog.Content className="radix-dialog-content" style={{ maxWidth: '580px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: '#65a30d', fontWeight: '800', textTransform: 'uppercase' }}>
                    Dispatching Inteligente
                  </span>
                  <Dialog.Title style={{ margin: '4px 0 0 0', fontSize: '1.4rem', fontWeight: '800', color: '#0d2e23' }}>
                    Atribuir / Trocar Trabalhador
                  </Dialog.Title>
                  <Dialog.Description style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>
                    Reatribuição instantânea e verificação de conflitos de agenda.
                  </Dialog.Description>
                </div>
                <Dialog.Close asChild>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
                    <X size={20} />
                  </button>
                </Dialog.Close>
              </div>

              {reassignCleaning && (
                <>
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px', marginBottom: '20px' }}>
                    <div style={{ fontWeight: '800', fontSize: '1rem', color: '#0d2e23' }}>
                      {reassignCleaning.property?.name}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '4px' }}>
                      Horário: <strong>{reassignCleaning.scheduled_date} ({reassignCleaning.time_slot})</strong>
                    </div>
                  </div>

                  {conflictAlert && (
                    <div style={{ background: '#fffbeb', border: '1px solid #fde68a', color: '#b45309', padding: '12px', borderRadius: '12px', fontSize: '0.85rem', marginBottom: '16px' }}>
                      {conflictAlert}
                    </div>
                  )}

                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '8px' }}>
                      Selecione o Trabalhador para Executar Este Serviço:
                    </label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto' }}>
                      {workers.map(w => {
                        const isSelected = selectedNewWorkerId === w.id;
                        return (
                          <div
                            key={w.id}
                            onClick={() => setSelectedNewWorkerId(w.id)}
                            style={{
                              padding: '14px 18px',
                              borderRadius: '12px',
                              border: isSelected ? '2px solid #0d2e23' : '1px solid #e2e8f0',
                              background: isSelected ? '#f4fbf6' : '#ffffff',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <img
                                src={w.avatar_url || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100'}
                                alt={w.name}
                                style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                              />
                              <div>
                                <div style={{ fontWeight: '800', fontSize: '0.95rem', color: '#0d2e23' }}>{w.name}</div>
                                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{w.phone} • IBAN: {w.iban ? 'Configurado' : 'Pendente'}</div>
                              </div>
                            </div>
                            {isSelected && <Check size={18} color="#059669" />}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                    <Dialog.Close asChild>
                      <button
                        type="button"
                        style={{ padding: '12px 20px', borderRadius: '10px', border: '1px solid #d1d5db', background: 'transparent', fontWeight: '700', cursor: 'pointer' }}
                      >
                        Cancelar
                      </button>
                    </Dialog.Close>
                    <button
                      type="button"
                      onClick={handleConfirmReassign}
                      style={{
                        padding: '12px 26px',
                        borderRadius: '10px',
                        border: 'none',
                        background: '#0d2e23',
                        color: '#ffffff',
                        fontWeight: '800',
                        cursor: 'pointer'
                      }}
                    >
                      Confirmar Atribuição
                    </button>
                  </div>
                </>
              )}
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        {/* ================= MODAL 2: EDITAR LIMPEZA (RADIX DIALOG) ================= */}
        <Dialog.Root open={!!editingCleaning} onOpenChange={(open) => { if (!open) setEditingCleaning(null); }}>
          <Dialog.Portal>
            <Dialog.Overlay className="radix-dialog-overlay" />
            <Dialog.Content className="radix-dialog-content" style={{ maxWidth: '580px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <Dialog.Title style={{ margin: 0, fontSize: '1.4rem', fontWeight: '800', color: '#0d2e23' }}>
                    Editar Limpeza & Alterar Horário
                  </Dialog.Title>
                  <Dialog.Description style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>
                    Ajuste parâmetros operacionais, preços e estado do serviço.
                  </Dialog.Description>
                </div>
                <Dialog.Close asChild>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
                    <X size={20} />
                  </button>
                </Dialog.Close>
              </div>

              {editingCleaning && (
                <form onSubmit={handleSaveCleaningEdit}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                      <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '4px' }}>
                        Data:
                      </label>
                      <input
                        type="text"
                        value={editingCleaning.scheduled_date}
                        onChange={(e) => setEditingCleaning({ ...editingCleaning, scheduled_date: e.target.value })}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '4px' }}>
                        Janela Horária:
                      </label>
                      <input
                        type="text"
                        value={editingCleaning.time_slot}
                        onChange={(e) => setEditingCleaning({ ...editingCleaning, time_slot: e.target.value })}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '4px' }}>
                        Trabalhador Atribuído:
                      </label>
                      <select
                        value={editingCleaning.worker_id || ''}
                        onChange={(e) => setEditingCleaning({ ...editingCleaning, worker_id: e.target.value })}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box', fontWeight: '700' }}
                      >
                        {workers.map(w => (
                          <option key={w.id} value={w.id}>{w.name} ({w.phone})</option>
                        ))}
                      </select>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '4px' }}>
                          Preço Cobrado (€):
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={editingCleaning.price_owner}
                          onChange={(e) => setEditingCleaning({ ...editingCleaning, price_owner: parseFloat(e.target.value) || 0 })}
                          style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '4px' }}>
                          Remuneração Trabalhador (€):
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={editingCleaning.price_worker}
                          onChange={(e) => setEditingCleaning({ ...editingCleaning, price_worker: parseFloat(e.target.value) || 0 })}
                          style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box' }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '4px' }}>
                        Estado da Limpeza:
                      </label>
                      <select
                        value={editingCleaning.status}
                        onChange={(e) => setEditingCleaning({ ...editingCleaning, status: e.target.value as any })}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box', fontWeight: '700' }}
                      >
                        <option value="scheduled">Agendada</option>
                        <option value="in_progress">Em Curso</option>
                        <option value="completed">Concluída</option>
                        <option value="approved">Aprovada</option>
                        <option value="cancelled">Cancelada</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
                    <Dialog.Close asChild>
                      <button
                        type="button"
                        style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #d1d5db', background: 'transparent', cursor: 'pointer' }}
                      >
                        Cancelar
                      </button>
                    </Dialog.Close>
                    <button
                      type="submit"
                      style={{ padding: '10px 22px', borderRadius: '8px', border: 'none', background: '#0d2e23', color: '#fff', fontWeight: '700', cursor: 'pointer' }}
                    >
                      Gravar Alterações
                    </button>
                  </div>
                </form>
              )}
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        {/* ================= MODAL 3: CONFERIR RECIBO VERDE & APROVAR PAYOUT (RADIX DIALOG) ================= */}
        <Dialog.Root open={!!reviewingPayout} onOpenChange={(open) => { if (!open) setReviewingPayout(null); }}>
          <Dialog.Portal>
            <Dialog.Overlay className="radix-dialog-overlay" />
            <Dialog.Content className="radix-dialog-content" style={{ maxWidth: '580px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: '#65a30d', fontWeight: '800', textTransform: 'uppercase' }}>
                    Auditoria Fiscal & Pagamento
                  </span>
                  <Dialog.Title style={{ margin: '4px 0 0 0', fontSize: '1.4rem', fontWeight: '800', color: '#0d2e23' }}>
                    Conferir Recibo Verde de {reviewingPayout?.worker_name}
                  </Dialog.Title>
                  <Dialog.Description style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>
                    Validação jurídica e fiscal antes da liberação de transferência bancária.
                  </Dialog.Description>
                </div>
                <Dialog.Close asChild>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
                    <X size={20} />
                  </button>
                </Dialog.Close>
              </div>

              {reviewingPayout && (
                <>
                  <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '16px', padding: '18px', marginBottom: '20px' }}>
                    <div style={{ fontSize: '0.85rem', color: '#047857' }}>Valor Solicitado pelo Trabalhador:</div>
                    <div style={{ fontSize: '2rem', fontWeight: '800', color: '#065f46' }}>
                      {reviewingPayout.amount.toFixed(2)} €
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#047857', marginTop: '6px' }}>
                      Ficheiro anexado: <strong>{reviewingPayout.receipt_filename}</strong>
                    </div>
                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '6px' }}>
                      Nota / Comprovativo da Transferência Bancária:
                    </label>
                    <textarea
                      value={payoutNotes}
                      onChange={(e) => setPayoutNotes(e.target.value)}
                      placeholder="Ex: Transferência Millennium BCP efetuada com sucesso. Recibo Verde validado no portal AT."
                      style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #d1d5db', minHeight: '70px', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                    <button
                      type="button"
                      onClick={() => handlePayoutDecision('rejected')}
                      style={{
                        padding: '12px 20px',
                        borderRadius: '10px',
                        border: '1px solid #ef4444',
                        background: 'transparent',
                        color: '#ef4444',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      Rejeitar Pedido
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePayoutDecision('approved')}
                      style={{
                        padding: '12px 26px',
                        borderRadius: '10px',
                        border: 'none',
                        background: '#0d2e23',
                        color: '#fff',
                        fontWeight: '800',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Check size={16} color="#a3e635" /> Aprovar & Registar Pagamento
                    </button>
                  </div>
                </>
              )}
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        {/* ================= MODAL 4: CRIAR LIMPEZA (RADIX DIALOG) ================= */}
        <Dialog.Root open={showAddCleaningModal} onOpenChange={setShowAddCleaningModal}>
          <Dialog.Portal>
            <Dialog.Overlay className="radix-dialog-overlay" />
            <Dialog.Content className="radix-dialog-content" style={{ maxWidth: '580px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <Dialog.Title style={{ margin: 0, fontSize: '1.4rem', fontWeight: '800', color: '#0d2e23' }}>
                    Criar Nova Limpeza (Admin)
                  </Dialog.Title>
                  <Dialog.Description style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>
                    Agendamento direto com cálculo automático de margem e remuneração.
                  </Dialog.Description>
                </div>
                <Dialog.Close asChild>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
                    <X size={20} />
                  </button>
                </Dialog.Close>
              </div>

              <form onSubmit={handleAddCleaningSubmit}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '4px' }}>
                      Apartamento:
                    </label>
                    <select
                      value={newPropId}
                      onChange={(e) => setNewPropId(e.target.value)}
                      required
                      style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #d1d5db', boxSizing: 'border-box', fontWeight: '700' }}
                    >
                      <option value="">Selecione um imóvel...</option>
                      {properties.map(p => (
                        <option key={p.id} value={p.id}>{p.name} ({p.typology})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '4px' }}>
                      Trabalhador a Atribuir:
                    </label>
                    <select
                      value={newWorkerId}
                      onChange={(e) => setNewWorkerId(e.target.value)}
                      style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #d1d5db', boxSizing: 'border-box', fontWeight: '700' }}
                    >
                      <option value="">A atribuir mais tarde</option>
                      {workers.map(w => (
                        <option key={w.id} value={w.id}>{w.name}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '4px' }}>
                        Data:
                      </label>
                      <input
                        type="text"
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        placeholder="Ex: Hoje, Amanhã, 18/10"
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '4px' }}>
                        Horário:
                      </label>
                      <input
                        type="text"
                        value={newTimeSlot}
                        onChange={(e) => setNewTimeSlot(e.target.value)}
                        placeholder="Ex: 11:00 - 14:00"
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '4px' }}>
                      Notas & Instruções Especiais:
                    </label>
                    <textarea
                      value={newNotes}
                      onChange={(e) => setNewNotes(e.target.value)}
                      placeholder="Notas para o trabalhador..."
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', minHeight: '60px', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #d1d5db', background: 'transparent', cursor: 'pointer' }}
                    >
                      Cancelar
                    </button>
                  </Dialog.Close>
                  <button
                    type="submit"
                    style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', background: '#0d2e23', color: '#fff', fontWeight: '800', cursor: 'pointer' }}
                  >
                    Criar Limpeza
                  </button>
                </div>
              </form>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        {/* ================= MODAL 5: ATRIBUIR EQUIPAMENTO (RADIX DIALOG) ================= */}
        <Dialog.Root open={showAddEquipModal} onOpenChange={setShowAddEquipModal}>
          <Dialog.Portal>
            <Dialog.Overlay className="radix-dialog-overlay" />
            <Dialog.Content className="radix-dialog-content" style={{ maxWidth: '540px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <Dialog.Title style={{ margin: 0, fontSize: '1.4rem', fontWeight: '800', color: '#0d2e23' }}>
                    Atribuir Material ou Equipamento
                  </Dialog.Title>
                  <Dialog.Description style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>
                    Registo de entrega de equipamentos e consumíveis a profissionais.
                  </Dialog.Description>
                </div>
                <Dialog.Close asChild>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
                    <X size={20} />
                  </button>
                </Dialog.Close>
              </div>

              <form onSubmit={handleAddEquipmentSubmit}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '4px' }}>
                      Trabalhador:
                    </label>
                    <select
                      value={targetWorkerId}
                      onChange={(e) => setTargetWorkerId(e.target.value)}
                      required
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box', fontWeight: '700' }}
                    >
                      <option value="">Selecione o trabalhador...</option>
                      {workers.map(w => (
                        <option key={w.id} value={w.id}>{w.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '4px' }}>
                      Nome do Item / Material:
                    </label>
                    <input
                      type="text"
                      required
                      value={equipItemName}
                      onChange={(e) => setEquipItemName(e.target.value)}
                      placeholder="Ex: Aspirador Rowenta Pro, Detergente 5L..."
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '4px' }}>
                      Categoria:
                    </label>
                    <select
                      value={equipCategory}
                      onChange={(e) => setEquipCategory(e.target.value as any)}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box', fontWeight: '700' }}
                    >
                      <option value="equipamento">Equipamento (Aspirador, Mopa, Panos)</option>
                      <option value="consumivel">Consumível (Detergentes, Químicos, Sacos)</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #d1d5db', background: 'transparent', cursor: 'pointer' }}
                    >
                      Cancelar
                    </button>
                  </Dialog.Close>
                  <button
                    type="submit"
                    style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', background: '#0d2e23', color: '#fff', fontWeight: '800', cursor: 'pointer' }}
                  >
                    Confirmar Entrega
                  </button>
                </div>
              </form>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        <Dialog.Root open={!!viewingPhotos} onOpenChange={(open) => { if (!open) setViewingPhotos(null); }}>
          <Dialog.Portal>
            <Dialog.Overlay style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,.55)', zIndex: 100 }} />
            <Dialog.Content style={{ position: 'fixed', zIndex: 101, left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: 'min(920px, calc(100vw - 32px))', maxHeight: 'min(760px, calc(100vh - 32px))', overflowY: 'auto', background: '#fff', borderRadius: '22px', padding: '24px', boxShadow: '0 24px 80px rgba(15,23,42,.28)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '18px' }}>
                <div>
                  <Dialog.Title style={{ margin: 0, color: '#111625', fontSize: '1.25rem' }}>Fotografias do serviço</Dialog.Title>
                  <div style={{ marginTop: '4px', color: '#6b7280', fontSize: '.85rem' }}>{viewingPhotos?.property?.name} · {viewingPhotos?.scheduled_date}</div>
                </div>
                <Dialog.Close asChild><button style={{ border: 0, background: 'transparent', cursor: 'pointer', color: '#64748b' }}><X size={20} /></button></Dialog.Close>
              </div>
              {viewingPhotos?.photos?.length ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                  {viewingPhotos.photos.map((photo) => (
                    <figure key={photo.id} style={{ margin: 0, border: '1px solid #e2e8f0', borderRadius: '14px', overflow: 'hidden', background: '#f8fafc' }}>
                      <img src={photo.photo_url} alt={`${photo.photo_type === 'before' ? 'Antes' : 'Depois'} - ${photo.room_tag}`} style={{ display: 'block', width: '100%', height: '220px', objectFit: 'cover' }} />
                      <figcaption style={{ padding: '10px 12px', fontSize: '.8rem', color: '#334155', fontWeight: 700 }}>{photo.photo_type === 'before' ? 'Antes' : 'Depois'} · {photo.room_tag}</figcaption>
                    </figure>
                  ))}
                </div>
              ) : <p style={{ color: '#64748b' }}>Este serviço ainda não tem fotografias carregadas.</p>}
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </div>
  );
}
