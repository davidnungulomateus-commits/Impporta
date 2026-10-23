'use client';

import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Tabs from '@radix-ui/react-tabs';
import { CleaningStore } from '@/lib/cleaning-store';
import {
  UserProfile,
  Cleaning,
  WorkerEquipment,
  PayoutRequest,
} from '@/lib/cleaning-types';
import {
  CHECKLIST_42_SECTIONS,
  ALL_42_CHECKLIST_POINTS
} from '@/lib/checklist-data';
import {
  MapPin,
  Calendar,
  Clock,
  Euro,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Camera,
  Upload,
  ArrowUpRight,
  Package,
  FileText,
  User,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Plus,
  X,
  Check,
  Building2,
  Navigation,
  ArrowRight,
  ShieldCheck,
  Lock,
  Award,
  FileCheck
} from 'lucide-react';

interface WorkerDashboardProps {
  workerId?: string;
  onSwitchToHome?: () => void;
}

export default function WorkerDashboard({ workerId = 'worker-001', onSwitchToHome }: WorkerDashboardProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [cleanings, setCleanings] = useState<Cleaning[]>([]);
  const [equipment, setEquipment] = useState<WorkerEquipment[]>([]);
  const [payouts, setPayouts] = useState<PayoutRequest[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  // Modals
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [showCleanModal, setShowCleanModal] = useState(false);
  const [showEquipModal, setShowEquipModal] = useState(false);

  // Active cleaning execution state
  const [activeCleaning, setActiveCleaning] = useState<Cleaning | null>(null);
  const [beforePhotos, setBeforePhotos] = useState<{ url: string; room: string }[]>([]);
  const [afterPhotos, setAfterPhotos] = useState<{ url: string; room: string }[]>([]);
  const [currentRoom, setCurrentRoom] = useState('Cozinha');
  const [workerNotes, setWorkerNotes] = useState('');
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});

  // Payout form
  const [payoutAmount, setPayoutAmount] = useState('');
  const [receiptFile, setReceiptFile] = useState<string | null>(null);
  const [receiptFileName, setReceiptFileName] = useState('');
  const [payoutError, setPayoutError] = useState('');
  const [payoutSuccess, setPayoutSuccess] = useState(false);

  // Profile Edit form
  const [editName, setEditName] = useState('');
  const [editIban, setEditIban] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editNif, setEditNif] = useState('');
  const [editAvatar, setEditAvatar] = useState('');

  // Load data
  useEffect(() => {
    const prof = CleaningStore.getProfileById(workerId);
    if (prof) {
      setProfile(prof);
      setEditName(prof.name);
      setEditIban(prof.iban);
      setEditAddress(prof.address);
      setEditPhone(prof.phone);
      setEditNif(prof.nif);
      setEditAvatar(prof.avatar_url);
    }
    const workerCleanings = CleaningStore.getCleaningsByWorker(workerId);
    setCleanings(workerCleanings);
    setEquipment(CleaningStore.getEquipmentByWorker(workerId));
    setPayouts(CleaningStore.getPayoutsByWorker(workerId));
  }, [workerId, refreshKey]);

  const refreshAll = () => setRefreshKey(k => k + 1);

  // Financial summary
  const summary = profile ? CleaningStore.getWorkerFinancialSummary(profile.id) : {
    totalCleaningsCompleted: 0,
    totalEarnedAllTime: 0,
    totalPaidOut: 0,
    pendingPayoutRequests: 0,
    availableToWithdraw: 0
  };

  const nextCleaning = cleanings.find(c => c.status === 'scheduled' || c.status === 'in_progress');

  // Handle Profile Save
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    const updated: UserProfile = {
      ...profile,
      name: editName,
      iban: editIban,
      address: editAddress,
      phone: editPhone,
      nif: editNif,
      avatar_url: editAvatar || profile.avatar_url
    };
    CleaningStore.updateProfile(updated);
    setProfile(updated);
    setShowProfileModal(false);
    refreshAll();
  };

  // Open Clean Execution Modal
  const handleOpenCleaningModal = (c: Cleaning) => {
    setActiveCleaning(c);
    setWorkerNotes(c.worker_notes || '');
    const bPhotos = (c.photos || []).filter(p => p.photo_type === 'before').map(p => ({ url: p.photo_url, room: p.room_tag }));
    const aPhotos = (c.photos || []).filter(p => p.photo_type === 'after').map(p => ({ url: p.photo_url, room: p.room_tag }));
    setBeforePhotos(bPhotos);
    setAfterPhotos(aPhotos);
    setShowCleanModal(true);
  };

  // Simulate Photo Upload
  const handleAddPhoto = (e: React.ChangeEvent<HTMLInputElement>, type: 'before' | 'after') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const url = uploadEvent.target?.result as string;
        if (type === 'before') {
          setBeforePhotos(prev => [...prev, { url, room: currentRoom }]);
        } else {
          setAfterPhotos(prev => [...prev, { url, room: currentRoom }]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Quick preset sample photo for fast demo
  const handleAddPresetPhoto = (type: 'before' | 'after') => {
    const samples = {
      before: [
        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=600&auto=format&fit=crop&q=80'
      ],
      after: [
        'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&auto=format&fit=crop&q=80'
      ]
    };
    const pool = samples[type];
    const randomUrl = pool[Math.floor(Math.random() * pool.length)];
    if (type === 'before') {
      setBeforePhotos(prev => [...prev, { url: randomUrl, room: currentRoom }]);
    } else {
      setAfterPhotos(prev => [...prev, { url: randomUrl, room: currentRoom }]);
    }
  };

  // Start Cleaning
  const handleStartCleaning = () => {
    if (!activeCleaning) return;
    if (beforePhotos.length === 0) {
      alert('Por favor adicione pelo menos uma fotografia do local ANTES de iniciar a limpeza.');
      return;
    }
    CleaningStore.startCleaning(activeCleaning.id, beforePhotos);
    setShowCleanModal(false);
    refreshAll();
  };

  // Finish Cleaning
  const handleFinishCleaning = () => {
    if (!activeCleaning) return;
    if (afterPhotos.length === 0) {
      alert('Por favor adicione pelo menos uma fotografia do local DEPOIS de terminar a limpeza.');
      return;
    }
    CleaningStore.finishCleaning(activeCleaning.id, afterPhotos, workerNotes, checklist);
    setShowCleanModal(false);
    refreshAll();
  };

  // Request Payout with Recibo Verde
  const handlePayoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPayoutError('');
    const amt = parseFloat(payoutAmount);
    if (isNaN(amt) || amt <= 0) {
      setPayoutError('Insira um montante válido para o levantamento.');
      return;
    }
    if (amt > summary.availableToWithdraw) {
      setPayoutError(`O montante não pode exceder o saldo disponível (${summary.availableToWithdraw.toFixed(2)} €).`);
      return;
    }
    if (!receiptFile) {
      setPayoutError('O upload do Recibo Verde é obrigatório para processar o pagamento.');
      return;
    }
    if (!profile?.iban) {
      setPayoutError('Por favor adicione o seu IBAN no seu perfil antes de pedir levantamento.');
      return;
    }

    CleaningStore.requestPayout(
      profile.id,
      profile.name,
      amt,
      receiptFile,
      receiptFileName || 'Recibo_Verde.pdf'
    );
    setPayoutSuccess(true);
    setTimeout(() => {
      setPayoutSuccess(false);
      setShowPayoutModal(false);
      setPayoutAmount('');
      setReceiptFile(null);
      refreshAll();
    }, 1500);
  };

  // Handle Receipt Upload
  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFileName(file.name);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setReceiptFile(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUseSampleReceipt = () => {
    setReceiptFileName('ReciboVerde_AT_MariaSantos_Out2026.pdf');
    setReceiptFile('data:application/pdf;base64,JVBERi0xLjQKJcTl8uXrp/Og0MTGCjQgMCBvYmoKPDwKL0tpZHMgWzUgMCBSXQovQ291bnQgMQovVHlwZSAvUGFnZXMKPj4KZW5kb2Jq');
  };

  return (
    <div className="dashboard-page dashboard-page--worker" style={{ background: '#f7f4ee', minHeight: '100vh', padding: '32px 24px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        
        {/* Neatify Header Card */}
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
            <div
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '20px',
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#9bb6f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid rgba(155, 182, 246, 0.3)'
              }}
            >
              <User size={34} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h1 style={{ fontSize: '1.6rem', fontWeight: '900', margin: 0, letterSpacing: '-0.02em' }}>
                  {profile?.name || 'Profissional Impporta'}
                </h1>
                <span style={{
                  background: 'rgba(155, 182, 246, 0.15)',
                  color: '#9bb6f6',
                  border: '1px solid rgba(155, 182, 246, 0.4)',
                  fontSize: '0.75rem',
                  fontWeight: '800',
                  padding: '3px 10px',
                  borderRadius: '999px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <ShieldCheck size={14} color="#f59e0b" /> Profissional Verificado
                </span>
              </div>
              <p style={{ margin: '6px 0 0 0', color: '#9ca3af', fontSize: '0.85rem' }}>
                {profile?.address || 'Lisboa'} {profile?.phone ? `• ${profile.phone}` : ''}
              </p>
              <div style={{ display: 'flex', gap: '16px', marginTop: '6px', fontSize: '0.8rem', color: '#9bb6f6' }}>
                <span><strong>IBAN:</strong> {profile?.iban ? profile.iban : '⚠️ Adicionar IBAN'}</span>
                <span><strong>NIF:</strong> {profile?.nif || '⚠️ Adicionar NIF'}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowProfileModal(true)}
              style={{
                padding: '10px 18px',
                borderRadius: '999px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#ffffff',
                fontWeight: '700',
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <User size={15} /> Meu Perfil & IBAN
            </button>
            <button
              onClick={() => setShowPayoutModal(true)}
              style={{
                padding: '10px 22px',
                borderRadius: '999px',
                border: 'none',
                background: '#9bb6f6',
                color: '#0f172a',
                fontWeight: '900',
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 12px rgba(155, 182, 246, 0.4)'
              }}
            >
              <Euro size={16} /> Pedir Levantamento
            </button>
            {onSwitchToHome && (
              <button
                onClick={onSwitchToHome}
                style={{
                  padding: '10px 18px',
                  borderRadius: '999px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'transparent',
                  color: '#9ca3af',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Terminar Sessão
              </button>
            )}
          </div>
        </div>

        {/* Warning if IBAN missing */}
        {(!profile?.iban || profile.iban.length < 15) && (
          <div style={{
            background: '#fffbeb',
            border: '1px solid #fef3c7',
            color: '#b45309',
            padding: '14px 20px',
            borderRadius: '16px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.875rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertCircle size={20} />
              <span><strong>Atenção:</strong> Forneça o seu IBAN e a sua morada no perfil para poder receber as transferências dos seus serviços.</span>
            </div>
            <button
              onClick={() => setShowProfileModal(true)}
              style={{
                background: '#f59e0b',
                color: '#fff',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '8px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              Configurar Agora
            </button>
          </div>
        )}

        {/* KPI Summary Cards (Neatify Crisp Cards) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}>
          {/* Card 1: Completed Cleanings */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '20px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 4px 16px rgba(0,0,0,0.02)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: '700', textTransform: 'uppercase' }}>
                Limpezas Feitas
              </span>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 size={20} />
              </div>
            </div>
            <div style={{ marginTop: '16px' }}>
              <div style={{ fontSize: '2.2rem', fontWeight: '800', color: '#0b192c' }}>
                {summary.totalCleaningsCompleted}
              </div>
              <span style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: '700' }}>
                100% validadas por foto
              </span>
            </div>
          </div>

          {/* Card 2: Total Earned */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '20px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 4px 16px rgba(0,0,0,0.02)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: '700', textTransform: 'uppercase' }}>
                Total Acumulado
              </span>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Euro size={20} />
              </div>
            </div>
            <div style={{ marginTop: '16px' }}>
              <div style={{ fontSize: '2.2rem', fontWeight: '800', color: '#0b192c' }}>
                {summary.totalEarnedAllTime.toFixed(2)} €
              </div>
              <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                {summary.totalPaidOut.toFixed(2)} € já transferidos
              </span>
            </div>
          </div>

          {/* Card 3: Available to Withdraw (Highlighted) */}
          <div style={{
            background: '#0b192c',
            color: '#ffffff',
            borderRadius: '20px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 12px 24px rgba(11, 25, 44, 0.15)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: '700', textTransform: 'uppercase' }}>
                Saldo Disponível
              </span>
              <button
                onClick={() => setShowPayoutModal(true)}
                style={{
                  background: '#38bdf8',
                  color: '#0b192c',
                  border: 'none',
                  padding: '4px 12px',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  fontWeight: '800',
                  cursor: 'pointer'
                }}
              >
                Retirar
              </button>
            </div>
            <div style={{ marginTop: '16px' }}>
              <div style={{ fontSize: '2.2rem', fontWeight: '800', color: '#ffffff' }}>
                {summary.availableToWithdraw.toFixed(2)} €
              </div>
              <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                {summary.pendingPayoutRequests > 0
                  ? `${summary.pendingPayoutRequests.toFixed(2)} € em análise`
                  : 'Pronto para levantamento'}
              </span>
            </div>
          </div>

          {/* Card 4: Next Appointment */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '20px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 4px 16px rgba(0,0,0,0.02)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: '700', textTransform: 'uppercase' }}>
                Próxima Limpeza
              </span>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#fdf4ff', color: '#c026d3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={20} />
              </div>
            </div>
            <div style={{ marginTop: '16px' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0b192c' }}>
                {nextCleaning ? `${nextCleaning.scheduled_date} (${nextCleaning.time_slot})` : 'Nenhum agendamento'}
              </div>
              <span style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: '700' }}>
                {nextCleaning ? `Remuneração: + ${nextCleaning.price_worker.toFixed(2)} €` : 'Aguarde novos serviços'}
              </span>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            HERO CARD: PRÓXIMA LIMPEZA
            ───────────────────────────────────────────────────────────── */}
        <div style={{ marginBottom: '36px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0b192c', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={20} color="#0284c7" /> Detalhes da Próxima Limpeza
            </h2>
            <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>
              • DADOS DO SERVIÇO & CÓDIGOS DE ACESSO
            </span>
          </div>

          {nextCleaning ? (
            <div style={{
              background: '#ffffff',
              border: '2px solid #38bdf8',
              borderRadius: '24px',
              padding: '32px',
              boxShadow: '0 8px 30px rgba(11, 25, 44, 0.08)'
            }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      background: nextCleaning.status === 'in_progress' ? '#fef3c7' : '#f0f7ff',
                      color: nextCleaning.status === 'in_progress' ? '#b45309' : '#0369a1',
                      fontSize: '0.75rem',
                      fontWeight: '800',
                      padding: '4px 12px',
                      borderRadius: '999px',
                      textTransform: 'uppercase'
                    }}>
                      {nextCleaning.status === 'in_progress' ? 'Limpeza Em Curso' : 'Próxima Limpeza'}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                      Tipologia: <strong>{nextCleaning.property?.typology}</strong>
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0b192c', margin: '12px 0 6px 0', letterSpacing: '-0.02em' }}>
                    {nextCleaning.property?.name}
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4b5563', fontSize: '0.95rem' }}>
                    <MapPin size={18} color="#ef4444" />
                    <span>{nextCleaning.property?.address}, {nextCleaning.property?.city} ({nextCleaning.property?.postal_code})</span>
                  </div>
                </div>

                {/* Earnings & Quick GPS */}
                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                  <div style={{ background: '#f0f7ff', border: '1px solid #bae6fd', padding: '12px 20px', borderRadius: '16px' }}>
                    <span style={{ fontSize: '0.75rem', color: '#0369a1', display: 'block', fontWeight: '600' }}>Remuneração Deste Trabalho:</span>
                    <span style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0284c7' }}>
                      + {nextCleaning.price_worker.toFixed(2)} €
                    </span>
                  </div>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${nextCleaning.property?.address}, ${nextCleaning.property?.city}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.85rem',
                      fontWeight: '700',
                      color: '#0b192c',
                      textDecoration: 'none',
                      background: '#f0f7ff',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      border: '1px solid #bae6fd'
                    }}
                  >
                    <Navigation size={15} color="#0284c7" /> Abrir no GPS (Waze / Google Maps)
                  </a>
                </div>
              </div>

              {/* Grid: Horário e Código de Entrada */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '20px',
                marginTop: '24px',
                paddingTop: '20px',
                borderTop: '1px solid #f3f4f6'
              }}>
                <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.85rem', marginBottom: '6px' }}>
                    <Clock size={16} /> Horário Previsto
                  </div>
                  <div style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0b192c' }}>
                    {nextCleaning.scheduled_date} • {nextCleaning.time_slot}
                  </div>
                </div>

                <div style={{ background: '#fffbeb', padding: '18px', borderRadius: '16px', border: '1px solid #fde68a' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#92400e', fontSize: '0.85rem', marginBottom: '6px' }}>
                    <KeyRound size={16} /> Código de Entrada & Keybox
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#78350f' }}>
                    {nextCleaning.property?.access_code || 'Chaves na portaria'}
                  </div>
                </div>
              </div>

              {/* Owner Notes */}
              <div style={{
                marginTop: '20px',
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: '16px',
                padding: '18px 20px'
              }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e40af', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FileText size={16} /> Notas e Instruções do Proprietário:
                </span>
                <p style={{ margin: '8px 0 0 0', color: '#1e3a8a', fontSize: '0.95rem', lineHeight: '1.5' }}>
                  {nextCleaning.owner_notes || nextCleaning.property?.default_notes || 'Sem instruções adicionais.'}
                </p>
              </div>

              {/* Action Button: Iniciar ou Finalizar com Fotos */}
              <div style={{ marginTop: '28px', display: 'flex', justifyContent: 'flex-end', gap: '14px' }}>
                <button
                  onClick={() => handleOpenCleaningModal(nextCleaning)}
                  style={{
                    padding: '14px 32px',
                    borderRadius: '12px',
                    border: 'none',
                    background: nextCleaning.status === 'in_progress' ? '#2563eb' : '#0b192c',
                    color: '#ffffff',
                    fontWeight: '800',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    boxShadow: '0 6px 20px rgba(11, 25, 44, 0.25)'
                  }}
                >
                  <Camera size={20} color="#38bdf8" />
                  {nextCleaning.status === 'in_progress'
                    ? 'Continuar Limpeza & Enviar Fotos do Depois'
                    : 'Iniciar Limpeza (Check-in & Fotos Antes)'}
                </button>
              </div>
            </div>
          ) : (
            <div style={{
              background: '#ffffff',
              border: '1px dashed #d1d5db',
              borderRadius: '24px',
              padding: '48px',
              textAlign: 'center',
              color: '#6b7280'
            }}>
              <Calendar size={44} style={{ margin: '0 auto 14px auto', color: '#0284c7' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0b192c' }}>
                Nenhuma limpeza agendada para hoje
              </h3>
              <p style={{ maxWidth: '440px', margin: '6px auto 0 auto', fontSize: '0.9rem' }}>
                Assim que o administrador ou um proprietário agendar um serviço, ele surgirá aqui no seu painel.
              </p>
            </div>
          )}
        </div>

        {/* ─────────────────────────────────────────────────────────────
            INSTITUTIONAL TRUST & COMPLIANCE PILL
            ───────────────────────────────────────────────────────────── */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #bae6fd',
          borderRadius: '16px',
          padding: '14px 20px',
          marginBottom: '28px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          boxShadow: '0 2px 8px rgba(2, 132, 199, 0.04)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f0f7ff', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#0b192c' }}>
                Conta Profissional Verificada
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                Retenção de IRS e Recibos Verdes em conformidade AT
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span className="trust-badge-pill green">
              <Lock size={12} /> IBAN Criptografado
            </span>
            <span className="trust-badge-pill green">
              <FileCheck size={12} /> Finanças AT OK
            </span>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            RADIX TABS: NAVEGAÇÃO ORGANIZADA
            ───────────────────────────────────────────────────────────── */}
        <Tabs.Root defaultValue="cleanings" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Tabs.List style={{
            display: 'inline-flex',
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '999px',
            padding: '4px',
            gap: '4px',
            maxWidth: 'fit-content',
            boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
            overflowX: 'auto'
          }}>
            <Tabs.Trigger value="cleanings" className="radix-tabs-trigger">
              <Calendar size={16} /> Horários & Limpezas ({cleanings.length})
            </Tabs.Trigger>
            <Tabs.Trigger value="equipment" className="radix-tabs-trigger">
              <Package size={16} /> Produtos & Equipamentos ({equipment.length})
            </Tabs.Trigger>
            <Tabs.Trigger value="payouts" className="radix-tabs-trigger">
              <Euro size={16} /> Levantamentos & Recibos ({payouts.length})
            </Tabs.Trigger>
          </Tabs.List>

          {/* TAB 1: LIMPEZAS & CALENDÁRIO */}
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
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0d2e23', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={20} color="#2563eb" /> Calendário & Histórico de Limpezas
                  </h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: '#6b7280' }}>
                    Clique em qualquer serviço para abrir a ficha técnica, consultar notas e enviar fotos do Antes e Depois.
                  </p>
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#065f46', background: '#ecfdf5', padding: '6px 14px', borderRadius: '999px', border: '1px solid #a7f3d0' }}>
                  {cleanings.filter(c => c.status === 'completed').length} de {cleanings.length} Concluídas
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
                {cleanings.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => handleOpenCleaningModal(c)}
                    style={{
                      border: '1px solid #e5e7eb',
                      borderRadius: '16px',
                      padding: '20px',
                      cursor: 'pointer',
                      background: '#ffffff',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: '800', fontSize: '1.05rem', color: '#0d2e23' }}>
                          {c.property?.name || 'Apartamento'}
                        </span>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: '800',
                          padding: '4px 10px',
                          borderRadius: '999px',
                          background: c.status === 'completed' ? '#ecfdf5' : c.status === 'in_progress' ? '#fef3c7' : '#eff6ff',
                          color: c.status === 'completed' ? '#065f46' : c.status === 'in_progress' ? '#b45309' : '#1e40af'
                        }}>
                          {c.status === 'completed' ? 'Concluída' : c.status === 'in_progress' ? 'Em Curso' : 'Agendada'}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#6b7280', marginTop: '8px' }}>
                        <Clock size={14} /> {c.scheduled_date} • {c.time_slot}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#4b5563', marginTop: '4px' }}>
                        <MapPin size={14} color="#059669" /> {c.property?.city} • {c.property?.typology}
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #f3f4f6' }}>
                      <span style={{ fontSize: '0.9rem', color: '#065f46', fontWeight: '800' }}>
                        + {c.price_worker.toFixed(2)} €
                      </span>
                      <span style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        {c.status === 'completed' ? 'Ver Fotos' : 'Executar'} <ChevronRight size={14} />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Tabs.Content>

          {/* TAB 2: EQUIPAMENTOS RECEBIDOS */}
          <Tabs.Content value="equipment">
            <div style={{
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '24px',
              padding: '28px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.02)'
            }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0d2e23', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Package size={20} color="#65a30d" /> Meus Equipamentos & Produtos
                  </h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: '#6b7280' }}>
                    Todos os produtos profissionais fornecidos pela Impporta para a execução dos serviços.
                  </p>
                </div>
                <button
                  onClick={() => setShowEquipModal(true)}
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: '700',
                    padding: '8px 18px',
                    borderRadius: '999px',
                    background: '#ecfdf5',
                    color: '#065f46',
                    border: '1px solid #a7f3d0',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Plus size={16} /> Pedir Reposição de Produtos
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '14px' }}>
                {equipment.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px 20px',
                      borderRadius: '16px',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        background: item.category === 'equipamento' ? '#eff6ff' : '#ecfdf5',
                        color: item.category === 'equipamento' ? '#2563eb' : '#059669',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Package size={18} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0d2e23' }}>
                          {item.item_name}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: '2px' }}>
                          Entregue: {item.delivered_at} • {item.category.toUpperCase()}
                        </div>
                      </div>
                    </div>

                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      padding: '4px 12px',
                      borderRadius: '999px',
                      background: item.status === 'substituicao_pedida' ? '#fef3c7' : '#ecfdf5',
                      color: item.status === 'substituicao_pedida' ? '#b45309' : '#065f46'
                    }}>
                      {item.status === 'substituicao_pedida' ? 'Reposição Pedida' : 'Em Posse'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Tabs.Content>

          {/* TAB 3: HISTÓRICO DE LEVANTAMENTOS */}
          <Tabs.Content value="payouts">
            <div style={{
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '24px',
              padding: '28px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.02)'
            }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0b192c', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Euro size={20} color="#0284c7" /> Histórico de Levantamentos & Recibos Verdes
                  </h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: '#6b7280' }}>
                    Consulte os recibos verdes anexados e o estado de pagamento via transferência bancária.
                  </p>
                </div>
                <button
                  onClick={() => setShowPayoutModal(true)}
                  disabled={summary.availableToWithdraw <= 0}
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: '800',
                    padding: '10px 20px',
                    borderRadius: '12px',
                    background: summary.availableToWithdraw > 0 ? '#0b192c' : '#e5e7eb',
                    color: summary.availableToWithdraw > 0 ? '#ffffff' : '#9ca3af',
                    border: 'none',
                    cursor: summary.availableToWithdraw > 0 ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Euro size={16} color="#38bdf8" /> Retirar Saldo Disponível ({summary.availableToWithdraw.toFixed(2)} €)
                </button>
              </div>

              {payouts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                  <FileText size={36} style={{ margin: '0 auto 8px auto', color: '#9ca3af' }} />
                  <p>Ainda não submeteu nenhum pedido de levantamento.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {payouts.map((p) => (
                    <div
                      key={p.id}
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '16px 20px',
                        borderRadius: '16px',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0d2e23' }}>
                          {p.amount.toFixed(2)} €
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: '2px' }}>
                          Pedido em: {p.created_at} • IBAN: {profile?.iban || 'IBAN registado'}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: '800',
                          padding: '4px 12px',
                          borderRadius: '999px',
                          background: p.status === 'approved' ? '#ecfdf5' : p.status === 'rejected' ? '#fef2f2' : '#fef3c7',
                          color: p.status === 'approved' ? '#065f46' : p.status === 'rejected' ? '#b91c1c' : '#b45309'
                        }}>
                          {p.status === 'approved' ? '✓ Pago / Transferido' : p.status === 'rejected' ? '✕ Rejeitado' : '⏳ Aguarda Conferência'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </div>

      {/* ================= MODAL: EXECUÇÃO DA LIMPEZA (FOTOS ANTES / DEPOIS - RADIX DIALOG) ================= */}
      <Dialog.Root open={showCleanModal && !!activeCleaning} onOpenChange={setShowCleanModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="radix-dialog-overlay" />
          <Dialog.Content className="radix-dialog-content" style={{ maxWidth: '820px', width: '94vw' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#0284c7', fontWeight: '800', textTransform: 'uppercase' }}>
                  Auditoria Fotográfica da Limpeza
                </span>
                <Dialog.Title style={{ fontSize: '1.5rem', fontWeight: '800', margin: '4px 0 0 0', color: '#0b192c' }}>
                  {activeCleaning?.property?.name}
                </Dialog.Title>
                <Dialog.Description style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>
                  Envio de registos fotográficos obrigatórios e checklist para validação do serviço.
                </Dialog.Description>
              </div>
              <Dialog.Close asChild>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
                  <X size={24} />
                </button>
              </Dialog.Close>
            </div>

            {/* Divisão selector */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '8px' }}>
                Selecionar Divisão para as Fotografias:
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['Cozinha', 'Casa de Banho', 'Quarto Principal', 'Sala de Estar', 'Varanda / Geral'].map((room) => (
                  <button
                    key={room}
                    onClick={() => setCurrentRoom(room)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '999px',
                      border: currentRoom === room ? '2px solid #0b192c' : '1px solid #d1d5db',
                      background: currentRoom === room ? '#0b192c' : '#ffffff',
                      color: currentRoom === room ? '#ffffff' : '#374151',
                      fontWeight: '700',
                      fontSize: '0.85rem',
                      cursor: 'pointer'
                    }}
                  >
                    {room}
                  </button>
                ))}
              </div>
            </div>

            {/* SECTOR 1: FOTOS DO ANTES */}
            <div style={{
              background: '#fffbeb',
              border: '1px solid #fde68a',
              borderRadius: '20px',
              padding: '24px',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '800', color: '#92400e', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Camera size={20} /> 1. Fotografias do "ANTES" (Estado de Chegada)
                  </h4>
                  <span style={{ fontSize: '0.8rem', color: '#b45309' }}>
                    Obrigatório: Fotografe o espaço antes de mexer em qualquer objeto.
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <label style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    background: '#f59e0b',
                    color: '#fff',
                    fontWeight: '700',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <Upload size={14} /> Carregar Foto
                    <input type="file" accept="image/*" onChange={(e) => handleAddPhoto(e, 'before')} style={{ display: 'none' }} />
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAddPresetPhoto('before')}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: '#fff',
                      border: '1px solid #f59e0b',
                      color: '#b45309',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    + Exemplo Rápido
                  </button>
                </div>
              </div>

              {beforePhotos.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '12px' }}>
                  {beforePhotos.map((photo, i) => (
                    <div key={i} style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', height: '110px', border: '1px solid #fde68a' }}>
                      <img src={photo.url} alt="Antes" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <span style={{ position: 'absolute', bottom: 6, left: 6, background: 'rgba(0,0,0,0.75)', color: '#fff', fontSize: '0.65rem', padding: '2px 8px', borderRadius: '4px' }}>
                        {photo.room}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px', color: '#b45309', fontSize: '0.9rem' }}>
                  Nenhuma foto do ANTES adicionada ainda.
                </div>
              )}
            </div>

            {/* SECTOR 2: CHECKLIST DE TAREFAS (42 PONTOS DE TURNOVER) */}
            {(() => {
              const verifiedCount = ALL_42_CHECKLIST_POINTS.filter((p) => !!checklist[p.id]).length;
              const totalCount = ALL_42_CHECKLIST_POINTS.length;
              const progressPercent = Math.round((verifiedCount / totalCount) * 100);

              const handleToggleAll = (checked: boolean) => {
                const next: Record<string, boolean> = {};
                ALL_42_CHECKLIST_POINTS.forEach((pt) => {
                  next[pt.id] = checked;
                });
                setChecklist(next);
              };

              const handleToggleCategory = (catId: string, checked: boolean) => {
                const cat = CHECKLIST_42_SECTIONS.find((c) => c.id === catId);
                if (!cat) return;
                const next = { ...checklist };
                cat.points.forEach((pt) => {
                  next[pt.id] = checked;
                });
                setChecklist(next);
              };

              return (
                <div style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '20px',
                  padding: '24px',
                  marginBottom: '24px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '900', color: '#0d2e23', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FileCheck size={20} color="#0d2e23" /> Checklist Digital Impporta (42 Pontos de Turnover)
                      </h4>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        Auditoria detalhada por setor: {verifiedCount} de {totalCount} pontos validados ({progressPercent}%)
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => handleToggleAll(true)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          background: '#ffffff',
                          color: '#0f172a',
                          fontSize: '0.75rem',
                          fontWeight: '800',
                          cursor: 'pointer'
                        }}
                      >
                        Validar Todos (42)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleAll(false)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          background: '#ffffff',
                          color: '#64748b',
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        Desmarcar
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden', marginBottom: '20px' }}>
                    <div
                      style={{
                        width: `${progressPercent}%`,
                        height: '100%',
                        background: progressPercent === 100 ? '#16a34a' : '#0284c7',
                        transition: 'width 0.25s ease'
                      }}
                    />
                  </div>

                  {/* 5 Sectors */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {CHECKLIST_42_SECTIONS.map((section) => {
                      const sectionCompleted = section.points.filter((p) => checklist[p.id]).length;
                      const isAllSectionChecked = sectionCompleted === section.points.length;

                      return (
                        <div
                          key={section.id}
                          style={{
                            background: '#ffffff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '16px',
                            padding: '16px 18px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '0.92rem', fontWeight: '800', color: '#111625' }}>
                                {section.title}
                              </span>
                              <span style={{
                                fontSize: '0.72rem',
                                fontWeight: '800',
                                padding: '2px 8px',
                                borderRadius: '999px',
                                background: isAllSectionChecked ? '#dcfce7' : '#eff6ff',
                                color: isAllSectionChecked ? '#166534' : '#1e40af'
                              }}>
                                {sectionCompleted}/{section.points.length} feitos
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleToggleCategory(section.id, !isAllSectionChecked)}
                              style={{
                                padding: '4px 10px',
                                borderRadius: '6px',
                                border: '1px solid #cbd5e1',
                                background: '#f8fafc',
                                color: '#334155',
                                fontSize: '0.72rem',
                                fontWeight: '700',
                                cursor: 'pointer'
                              }}
                            >
                              {isAllSectionChecked ? 'Desmarcar Secção' : 'Marcar Secção'}
                            </button>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '8px 14px' }}>
                            {section.points.map((pt) => {
                              const isChecked = !!checklist[pt.id];
                              return (
                                <label
                                  key={pt.id}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '8px',
                                    fontSize: '0.82rem',
                                    cursor: 'pointer',
                                    color: isChecked ? '#111625' : '#475569',
                                    background: isChecked ? '#f0fdf4' : 'transparent',
                                    padding: '6px 8px',
                                    borderRadius: '8px',
                                    border: isChecked ? '1px solid #bbf7d0' : '1px solid transparent',
                                    transition: 'all 0.12s ease'
                                  }}
                                >
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={(e) => setChecklist({ ...checklist, [pt.id]: e.target.checked })}
                                    style={{
                                      width: '16px',
                                      height: '16px',
                                      accentColor: '#16a34a',
                                      marginTop: '2px',
                                      flexShrink: 0
                                    }}
                                  />
                                  <span style={{ lineHeight: '1.4' }}>
                                    <strong style={{ color: '#0f172a', marginRight: '4px' }}>{pt.number}.</strong>
                                    {pt.label}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* SECTOR 3: FOTOS DO DEPOIS */}
            <div style={{
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
              borderRadius: '20px',
              padding: '24px',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '800', color: '#065f46', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={20} /> 2. Fotografias do "DEPOIS" (Conclusão do Serviço)
                  </h4>
                  <span style={{ fontSize: '0.8rem', color: '#047857' }}>
                    Fotografe cada divisão concluída e arrumada para validação e pagamento.
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <label style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    background: '#0d2e23',
                    color: '#ffffff',
                    fontWeight: '700',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <Upload size={14} /> Carregar Foto
                    <input type="file" accept="image/*" onChange={(e) => handleAddPhoto(e, 'after')} style={{ display: 'none' }} />
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAddPresetPhoto('after')}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: '#fff',
                      border: '1px solid #0d2e23',
                      color: '#0d2e23',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    + Exemplo Rápido
                  </button>
                </div>
              </div>

              {afterPhotos.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '12px' }}>
                  {afterPhotos.map((photo, i) => (
                    <div key={i} style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', height: '110px', border: '1px solid #a7f3d0' }}>
                      <img src={photo.url} alt="Depois" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <span style={{ position: 'absolute', bottom: 6, left: 6, background: 'rgba(0,0,0,0.75)', color: '#fff', fontSize: '0.65rem', padding: '2px 8px', borderRadius: '4px' }}>
                        {photo.room}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px', color: '#047857', fontSize: '0.9rem' }}>
                  Nenhuma foto do DEPOIS adicionada ainda.
                </div>
              )}
            </div>

            {/* Worker Notes */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '6px' }}>
                Notas de Conclusão para o Proprietário:
              </label>
              <textarea
                value={workerNotes}
                onChange={(e) => setWorkerNotes(e.target.value)}
                placeholder="Ex: Deixei a chave guardada na keybox como combinado. Espaço ficou perfeitamente higienizado."
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  border: '1px solid #d1d5db',
                  fontSize: '0.9rem',
                  minHeight: '70px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setShowCleanModal(false)}
                style={{
                  padding: '12px 20px',
                  borderRadius: '12px',
                  border: '1px solid #d1d5db',
                  background: 'transparent',
                  color: '#4b5563',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>

              {activeCleaning?.status === 'scheduled' ? (
                <button
                  type="button"
                  onClick={handleStartCleaning}
                  style={{
                    padding: '12px 28px',
                    borderRadius: '12px',
                    border: 'none',
                    background: '#f59e0b',
                    color: '#fff',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Clock size={18} /> Iniciar Limpeza (Check-in)
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinishCleaning}
                  style={{
                    padding: '12px 32px',
                    borderRadius: '12px',
                    border: 'none',
                    background: '#0b192c',
                    color: '#ffffff',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Check size={18} color="#38bdf8" /> Finalizar Limpeza & Concluir
                </button>
              )}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* ================= MODAL: RETIRAR DINHEIRO (RECIBO VERDE - RADIX DIALOG) ================= */}
      <Dialog.Root open={showPayoutModal} onOpenChange={setShowPayoutModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="radix-dialog-overlay" />
          <Dialog.Content className="radix-dialog-content" style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#0284c7', fontWeight: '800', textTransform: 'uppercase' }}>
                  Retirar Saldo • Pagamentos
                </span>
                <Dialog.Title style={{ fontSize: '1.4rem', fontWeight: '800', margin: '4px 0 0 0', color: '#0b192c' }}>
                  Pedido de Levantamento
                </Dialog.Title>
                <Dialog.Description style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>
                  Transferência bancária direta após validação de Recibo Verde fiscal.
                </Dialog.Description>
              </div>
              <Dialog.Close asChild>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
                  <X size={24} />
                </button>
              </Dialog.Close>
            </div>

            {payoutSuccess ? (
              <div style={{ textAlign: 'center', padding: '30px', color: '#059669' }}>
                <CheckCircle2 size={48} style={{ margin: '0 auto 12px auto' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0 }}>Pedido Submetido com Sucesso!</h3>
                <p style={{ fontSize: '0.9rem', color: '#6b7280', marginTop: '8px' }}>
                  O seu Recibo Verde foi enviado para conferência do administrador. A transferência será emitida para o seu IBAN.
                </p>
              </div>
            ) : (
              <form onSubmit={handlePayoutSubmit}>
                {payoutError && (
                  <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', color: '#b91c1c', padding: '12px 16px', borderRadius: '12px', fontSize: '0.85rem', marginBottom: '18px' }}>
                    {payoutError}
                  </div>
                )}

                {/* IBAN Box */}
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '18px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '700' }}>IBAN de Destino Cadastrado:</span>
                    <button
                      type="button"
                      onClick={() => { setShowPayoutModal(false); setShowProfileModal(true); }}
                      style={{ fontSize: '0.75rem', color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '700' }}
                    >
                      Alterar IBAN
                    </button>
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0d2e23', marginTop: '6px', fontFamily: 'monospace' }}>
                    {profile?.iban || '⚠️ Não configurado no perfil'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                    Beneficiário: {profile?.name} • NIF: {profile?.nif || 'N/A'}
                  </div>
                </div>

                {/* Amount input */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#374151' }}>
                      Montante a Retirar (€):
                    </label>
                    <span style={{ fontSize: '0.8rem', color: '#059669', fontWeight: '700' }}>
                      Disponível: {summary.availableToWithdraw.toFixed(2)} €
                    </span>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="number"
                      step="0.01"
                      min="1"
                      max={summary.availableToWithdraw}
                      value={payoutAmount}
                      onChange={(e) => setPayoutAmount(e.target.value)}
                      placeholder="Ex: 50.00"
                      style={{
                        width: '100%',
                        padding: '12px 16px 12px 40px',
                        borderRadius: '12px',
                        border: '1px solid #d1d5db',
                        fontSize: '1.15rem',
                        fontWeight: '800',
                        boxSizing: 'border-box'
                      }}
                    />
                    <Euro size={18} style={{ position: 'absolute', left: 14, top: 15, color: '#9ca3af' }} />
                  </div>
                </div>

                {/* Recibo Verde Upload */}
                <div style={{
                  border: '2px dashed #0b192c',
                  borderRadius: '20px',
                  padding: '24px',
                  background: '#f8fafc',
                  textAlign: 'center',
                  marginBottom: '24px'
                }}>
                  <FileText size={36} style={{ color: '#0b192c', margin: '0 auto 8px auto' }} />
                  <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '800', color: '#0b192c' }}>
                    Anexar Recibo Verde das Finanças
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: '#0284c7', margin: '4px 0 14px 0' }}>
                    Obrigatório por lei em Portugal para liberação do pagamento.
                  </p>

                  {receiptFile ? (
                    <div style={{ background: '#fff', border: '1px solid #a7f3d0', padding: '10px 16px', borderRadius: '10px', display: 'inline-flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#065f46' }}>
                      <CheckCircle2 size={16} color="#059669" />
                      <strong>{receiptFileName}</strong>
                      <button
                        type="button"
                        onClick={() => { setReceiptFile(null); setReceiptFileName(''); }}
                        style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer' }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                      <label style={{
                        padding: '10px 18px',
                        borderRadius: '10px',
                        background: '#0b192c',
                        color: '#fff',
                        fontWeight: '700',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <Upload size={16} color="#38bdf8" /> Carregar PDF ou Foto
                        <input type="file" accept=".pdf,image/*" onChange={handleReceiptUpload} style={{ display: 'none' }} />
                      </label>
                      <button
                        type="button"
                        onClick={handleUseSampleReceipt}
                        style={{
                          padding: '10px 14px',
                          borderRadius: '10px',
                          background: '#fff',
                          border: '1px solid #0b192c',
                          color: '#0b192c',
                          fontSize: '0.8rem',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        Usar Exemplo
                      </button>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setShowPayoutModal(false)}
                    style={{
                      padding: '12px 20px',
                      borderRadius: '12px',
                      border: '1px solid #d1d5db',
                      background: 'transparent',
                      color: '#4b5563',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: '12px 28px',
                      borderRadius: '12px',
                      border: 'none',
                      background: '#0b192c',
                      color: '#ffffff',
                      fontWeight: '800',
                      fontSize: '0.95rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <Euro size={18} color="#38bdf8" /> Confirmar Levantamento
                  </button>
                </div>
              </form>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* ================= MODAL: EDITAR PERFIL & IBAN (RADIX DIALOG) ================= */}
      <Dialog.Root open={showProfileModal} onOpenChange={setShowProfileModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="radix-dialog-overlay" />
          <Dialog.Content className="radix-dialog-content" style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#0284c7', fontWeight: '800', textTransform: 'uppercase' }}>
                  Dados Pessoais & Bancários
                </span>
                <Dialog.Title style={{ fontSize: '1.4rem', fontWeight: '800', margin: '4px 0 0 0', color: '#0b192c' }}>
                  Meu Perfil de Trabalhador
                </Dialog.Title>
                <Dialog.Description style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>
                  Os pagamentos são processados para o IBAN português aqui cadastrado.
                </Dialog.Description>
              </div>
              <Dialog.Close asChild>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
                  <X size={24} />
                </button>
              </Dialog.Close>
            </div>

            <form onSubmit={handleSaveProfile}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '6px' }}>
                    Nome Completo:
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #d1d5db', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '6px' }}>
                    IBAN para Pagamento (PT50...):
                  </label>
                  <input
                    type="text"
                    required
                    value={editIban}
                    onChange={(e) => setEditIban(e.target.value)}
                    placeholder="PT50 0033 0000 1234 5678 9012 3"
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #d1d5db', boxSizing: 'border-box', fontFamily: 'monospace', fontWeight: '700' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '6px' }}>
                      NIF:
                    </label>
                    <input
                      type="text"
                      required
                      value={editNif}
                      onChange={(e) => setEditNif(e.target.value)}
                      placeholder="245678910"
                      style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #d1d5db', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '6px' }}>
                      Telefone / WhatsApp:
                    </label>
                    <input
                      type="text"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      placeholder="+351 912 345 678"
                      style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #d1d5db', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '6px' }}>
                    Morada Completa:
                  </label>
                  <input
                    type="text"
                    required
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    placeholder="Rua, Número, Andar e Código Postal"
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #d1d5db', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '6px' }}>
                    URL da Fotografia de Perfil:
                  </label>
                  <input
                    type="text"
                    value={editAvatar}
                    onChange={(e) => setEditAvatar(e.target.value)}
                    placeholder="https://..."
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #d1d5db', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '28px' }}>
                <Dialog.Close asChild>
                  <button
                    type="button"
                    style={{
                      padding: '12px 20px',
                      borderRadius: '10px',
                      border: '1px solid #d1d5db',
                      background: 'transparent',
                      color: '#4b5563',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    Cancelar
                  </button>
                </Dialog.Close>
                <button
                  type="submit"
                  style={{
                    padding: '12px 26px',
                    borderRadius: '10px',
                    border: 'none',
                    background: '#0b192c',
                    color: '#ffffff',
                    fontWeight: '800',
                    cursor: 'pointer'
                  }}
                >
                  Guardar Perfil
                </button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* ================= MODAL: PEDIR REPOSIÇÃO DE EQUIPAMENTOS (RADIX DIALOG) ================= */}
      <Dialog.Root open={showEquipModal} onOpenChange={setShowEquipModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="radix-dialog-overlay" />
          <Dialog.Content className="radix-dialog-content" style={{ maxWidth: '540px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <Dialog.Title style={{ fontSize: '1.3rem', fontWeight: '800', margin: 0, color: '#0b192c' }}>
                  Pedir Reposição de Produtos
                </Dialog.Title>
                <Dialog.Description style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '4px' }}>
                  Selecione o produto que terminou para notificarmos o administrador da Impporta para reabastecimento.
                </Dialog.Description>
              </div>
              <Dialog.Close asChild>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
                  <X size={20} />
                </button>
              </Dialog.Close>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px' }}>
              {equipment.map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    CleaningStore.requestEquipmentReplacement(item.id);
                    alert(`Pedido de reposição para "${item.item_name}" enviado ao Administrador!`);
                    setShowEquipModal(false);
                    refreshAll();
                  }}
                  style={{
                    padding: '14px 18px',
                    borderRadius: '14px',
                    border: '1px solid #e2e8f0',
                    background: '#f8fafc',
                    textAlign: 'left',
                    fontWeight: '700',
                    fontSize: '0.9rem',
                    color: '#0b192c',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'border-color 0.15s, background 0.15s'
                  }}
                >
                  <span>{item.item_name}</span>
                  <ArrowUpRight size={16} color="#059669" />
                </button>
              ))}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
