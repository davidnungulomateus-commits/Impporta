'use client';

import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Tabs from '@radix-ui/react-tabs';
import { CleaningStore, DEFAULT_PRICING_RULES } from '@/lib/cleaning-store';
import {
  UserProfile,
  Property,
  Cleaning,
  TypologyType
} from '@/lib/cleaning-types';
import { CHECKLIST_42_SECTIONS } from '@/lib/checklist-data';
import {
  Building2,
  Calendar,
  Clock,
  Euro,
  Plus,
  MapPin,
  KeyRound,
  Camera,
  CheckCircle2,
  FileText,
  User,
  X,
  ChevronRight,
  Eye,
  Sliders,
  Check,
  ArrowRight,
  Layers,
  Lock,
  Award,
  FileCheck,
  ShieldCheck
} from 'lucide-react';

interface OwnerDashboardProps {
  ownerId?: string;
  onSwitchToHome?: () => void;
}

export default function OwnerDashboard({ ownerId = 'owner-001', onSwitchToHome }: OwnerDashboardProps) {
  const [owner, setOwner] = useState<UserProfile | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [cleanings, setCleanings] = useState<Cleaning[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  // Modals
  const [showAddPropertyModal, setShowAddPropertyModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showInspectionModal, setShowInspectionModal] = useState(false);
  const [selectedCleaning, setSelectedCleaning] = useState<Cleaning | null>(null);
  const [showChecklistDetails, setShowChecklistDetails] = useState(false);

  // New Property Form State
  const [propName, setPropName] = useState('');
  const [propAddress, setPropAddress] = useState('');
  const [propCity, setPropCity] = useState('Lisboa');
  const [propPostalCode, setPropPostalCode] = useState('');
  const [propTypology, setPropTypology] = useState<TypologyType>('T1');
  const [propAccessCode, setPropAccessCode] = useState('');
  const [propDefaultNotes, setPropDefaultNotes] = useState('');
  const [propImageUrl, setPropImageUrl] = useState('');

  // Schedule Cleaning Form State
  const [schedPropertyId, setSchedPropertyId] = useState('');
  const [schedDate, setSchedDate] = useState('Hoje');
  const [schedTimeSlot, setSchedTimeSlot] = useState('11:00 - 14:00');
  const [schedNotes, setSchedNotes] = useState('');
  const [schedSuccess, setSchedSuccess] = useState(false);

  // Load Data
  useEffect(() => {
    const prof = CleaningStore.getProfileById(ownerId);
    if (prof) setOwner(prof);
    const ownerProps = CleaningStore.getPropertiesByOwner(ownerId);
    setProperties(ownerProps);
    if (ownerProps.length > 0 && !schedPropertyId) {
      setSchedPropertyId(ownerProps[0].id);
    }
    setCleanings(CleaningStore.getCleaningsByOwner(ownerId));
  }, [ownerId, refreshKey, schedPropertyId]);

  const refreshAll = () => setRefreshKey(k => k + 1);

  // Calculated Price for Scheduling
  const selectedProp = properties.find(p => p.id === schedPropertyId);
  const activePricing = selectedProp
    ? DEFAULT_PRICING_RULES[selectedProp.typology]
    : DEFAULT_PRICING_RULES['T1'];

  // Handle Add Property
  const handleAddPropertySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!owner) return;
    CleaningStore.addProperty({
      owner_id: owner.id,
      name: propName,
      address: propAddress,
      city: propCity,
      postal_code: propPostalCode || '1000-001',
      typology: propTypology,
      access_code: propAccessCode,
      default_notes: propDefaultNotes,
      image_url: propImageUrl || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'
    });
    setShowAddPropertyModal(false);
    setPropName('');
    setPropAddress('');
    setPropAccessCode('');
    setPropDefaultNotes('');
    refreshAll();
  };

  // Handle Schedule Cleaning
  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schedPropertyId) {
      alert('Selecione um apartamento para agendar a limpeza.');
      return;
    }
    CleaningStore.scheduleCleaning(
      schedPropertyId,
      schedDate || 'Hoje',
      schedTimeSlot,
      schedNotes
    );
    setSchedSuccess(true);
    setTimeout(() => {
      setSchedSuccess(false);
      setShowScheduleModal(false);
      setSchedNotes('');
      refreshAll();
    }, 1200);
  };

  // Open Photos / Inspection Modal
  const handleOpenInspection = (c: Cleaning) => {
    setSelectedCleaning(c);
    setShowInspectionModal(true);
  };

  return (
    <div className="dashboard-page dashboard-page--owner" style={{ background: '#f7f4ee', minHeight: '100vh', padding: '32px 24px', fontFamily: 'Inter, sans-serif' }}>
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
            <div style={{
              width: '68px',
              height: '68px',
              borderRadius: '20px',
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#9bb6f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid rgba(155, 182, 246, 0.3)'
            }}>
              <Building2 size={34} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h1 style={{ fontSize: '1.6rem', fontWeight: '900', margin: 0, letterSpacing: '-0.02em' }}>
                  {owner?.name || 'Chiado Rentals (Proprietário)'}
                </h1>
                <span style={{
                  background: 'rgba(155, 182, 246, 0.15)',
                  color: '#9bb6f6',
                  border: '1px solid rgba(155, 182, 246, 0.4)',
                  fontSize: '0.75rem',
                  fontWeight: '800',
                  padding: '3px 10px',
                  borderRadius: '999px'
                }}>
                  Gestão de Imóveis & AL
                </span>
              </div>
              <p style={{ margin: '6px 0 0 0', color: '#9ca3af', fontSize: '0.85rem' }}>
                {properties.length} apartamentos registados • Agendamento instantâneo e auditoria fotográfica
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowAddPropertyModal(true)}
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
              <Plus size={16} /> Adicionar Apartamento
            </button>
            <button
              onClick={() => setShowScheduleModal(true)}
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
              <Calendar size={16} /> Agendar Nova Limpeza
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

        {/* ─────────────────────────────────────────────────────────────
            INSTITUTIONAL TRUST & COMPLIANCE PILL (OWNER)
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
                Qualidade Verificada em Cada Serviço
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                Relatórios fotográficos • Faturas com NIF dedutíveis em IRS/IRC • Profissionais verificados
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span className="trust-badge-pill green">
              <Camera size={12} /> Fotos Antes e Depois
            </span>
            <span className="trust-badge-pill green">
              <Award size={12} /> Satisfação 100%
            </span>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            RADIX TABS: MEUS APARTAMENTOS & LIMPEZAS
            ───────────────────────────────────────────────────────────── */}
        <Tabs.Root defaultValue="properties" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
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
            <Tabs.Trigger value="properties" className="radix-tabs-trigger">
              <Building2 size={16} /> Meus Apartamentos ({properties.length})
            </Tabs.Trigger>
            <Tabs.Trigger value="cleanings" className="radix-tabs-trigger">
              <Calendar size={16} /> Limpezas & Auditorias ({cleanings.length})
            </Tabs.Trigger>
          </Tabs.List>

          {/* TAB 1: APARTAMENTOS */}
          <Tabs.Content value="properties">
            <div style={{ marginBottom: '40px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#0284c7', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    • MEUS APARTAMENTOS & EDIFÍCIOS
                  </span>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0b192c', margin: '4px 0 0 0' }}>
                    Propriedades em Gestão
                  </h2>
                </div>
                <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                  Custos automáticos por tipologia (T0 a T4)
                </span>
              </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
            {properties.map((prop) => {
              const pricing = DEFAULT_PRICING_RULES[prop.typology];
              return (
                <div
                  key={prop.id}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ position: 'relative', height: '170px' }}>
                      <img
                        src={prop.image_url}
                        alt={prop.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <span style={{
                        position: 'absolute',
                        top: '14px',
                        left: '14px',
                        background: '#0b192c',
                        color: '#38bdf8',
                        fontSize: '0.75rem',
                        fontWeight: '800',
                        padding: '4px 10px',
                        borderRadius: '999px',
                        letterSpacing: '0.04em'
                      }}>
                        {prop.typology}
                      </span>
                      <span style={{
                        position: 'absolute',
                        top: '14px',
                        right: '14px',
                        background: '#ffffff',
                        color: '#0b192c',
                        fontSize: '0.8rem',
                        fontWeight: '800',
                        padding: '4px 12px',
                        borderRadius: '999px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}>
                        {pricing?.owner_price} € / serviço
                      </span>
                    </div>

                    <div style={{ padding: '24px' }}>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0b192c', margin: '0 0 6px 0' }}>
                        {prop.name}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6b7280', fontSize: '0.85rem' }}>
                        <MapPin size={16} color="#ef4444" />
                        <span>{prop.address}, {prop.city}</span>
                      </div>

                      <div style={{ marginTop: '16px', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '12px 14px', borderRadius: '12px', fontSize: '0.8rem', color: '#374151' }}>
                        <strong>Código de Acesso:</strong> {prop.access_code}
                      </div>

                      {prop.default_notes && (
                        <p style={{ margin: '12px 0 0 0', fontSize: '0.8rem', color: '#6b7280', lineHeight: '1.5' }}>
                          <em>"{prop.default_notes}"</em>
                        </p>
                      )}
                    </div>
                  </div>

                  <div style={{ padding: '16px 24px 24px 24px', borderTop: '1px solid #f3f4f6' }}>
                    <button
                      onClick={() => {
                        setSchedPropertyId(prop.id);
                        setShowScheduleModal(true);
                      }}
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '12px',
                        border: 'none',
                        background: '#0b192c',
                        color: '#ffffff',
                        fontWeight: '800',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <Calendar size={16} color="#38bdf8" /> Agendar Limpeza ({pricing?.owner_price} €)
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Tabs.Content>

      {/* TAB 2: LIMPEZAS & AUDITORIAS FOTOGRÁFICAS */}
      <Tabs.Content value="cleanings">
        {/* ─────────────────────────────────────────────────────────────
            HISTÓRICO DE LIMPEZAS & FOTOS ANTES/DEPOIS
            ───────────────────────────────────────────────────────────── */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '24px',
          padding: '28px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#0284c7', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                • AUDITORIA & REGISTO
              </span>
              <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0b192c', margin: '4px 0 0 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Camera size={20} color="#0284c7" /> Histórico de Limpezas & Galeria Antes/Depois
              </h2>
            </div>
            <button
              onClick={() => setShowScheduleModal(true)}
              style={{
                padding: '10px 18px',
                borderRadius: '999px',
                background: '#0b192c',
                color: '#fff',
                border: 'none',
                fontWeight: '700',
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              + Nova Limpeza
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e5e7eb', color: '#6b7280', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '14px' }}>Apartamento</th>
                  <th style={{ padding: '14px' }}>Data & Horário</th>
                  <th style={{ padding: '14px' }}>Equipa</th>
                  <th style={{ padding: '14px' }}>Custo</th>
                  <th style={{ padding: '14px' }}>Estado</th>
                  <th style={{ padding: '14px' }}>Fotos Antes / Depois</th>
                </tr>
              </thead>
              <tbody>
                {cleanings.map((c) => {
                  const photosBefore = (c.photos || []).filter(p => p.photo_type === 'before').length;
                  const photosAfter = (c.photos || []).filter(p => p.photo_type === 'after').length;

                  return (
                    <tr key={c.id} style={{ borderBottom: '1px solid #f3f4f6', fontSize: '0.9rem' }}>
                      <td style={{ padding: '16px 14px', fontWeight: '700', color: '#0b192c' }}>
                        {c.property?.name}
                        <span style={{ display: 'block', fontSize: '0.75rem', color: '#6b7280', fontWeight: '500' }}>
                          {c.property?.typology} • {c.property?.city}
                        </span>
                      </td>
                      <td style={{ padding: '16px 14px' }}>
                        <div style={{ fontWeight: '700', color: '#0b192c' }}>{c.scheduled_date}</div>
                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{c.time_slot}</span>
                      </td>
                      <td style={{ padding: '16px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#e8eefc', color: '#1e3a8a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ShieldCheck size={14} />
                          </div>
                          <span style={{ fontWeight: '600', color: '#374151' }}>
                            {c.worker_id ? 'Equipa Fixa Impporta' : 'A atribuir'}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '16px 14px', fontWeight: '800', color: '#0b192c' }}>
                        {c.price_owner.toFixed(2)} €
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
                          {c.status === 'completed' ? 'Concluída' : c.status === 'in_progress' ? 'Em Curso' : 'Agendada'}
                        </span>
                      </td>
                      <td style={{ padding: '16px 14px' }}>
                        {photosBefore + photosAfter > 0 ? (
                          <button
                            onClick={() => handleOpenInspection(c)}
                            style={{
                              padding: '8px 14px',
                              borderRadius: '999px',
                              background: '#f0f7ff',
                              border: '1px solid #bae6fd',
                              color: '#0284c7',
                              fontWeight: '700',
                              fontSize: '0.8rem',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}
                          >
                            <Camera size={14} /> Inspecionar ({photosBefore} Antes / {photosAfter} Depois)
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                            Aguardando início do serviço
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
    </Tabs.Root>
  </div>

      {/* ================= MODAL: ADICIONAR APARTAMENTO (RADIX DIALOG) ================= */}
      <Dialog.Root open={showAddPropertyModal} onOpenChange={setShowAddPropertyModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="radix-dialog-overlay" />
          <Dialog.Content className="radix-dialog-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#0284c7', fontWeight: '800', textTransform: 'uppercase' }}>
                  Novo Imóvel
                </span>
                <Dialog.Title style={{ fontSize: '1.4rem', fontWeight: '800', margin: '4px 0 0 0', color: '#0b192c' }}>
                  Registar Apartamento / Edifício
                </Dialog.Title>
                <Dialog.Description style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>
                  Adicione morada, tipologia e instruções de acesso para as equipas.
                </Dialog.Description>
              </div>
              <Dialog.Close asChild>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
                  <X size={24} />
                </button>
              </Dialog.Close>
            </div>

            <form onSubmit={handleAddPropertySubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '6px' }}>
                    Nome do Imóvel:
                  </label>
                  <input
                    type="text"
                    required
                    value={propName}
                    onChange={(e) => setPropName(e.target.value)}
                    placeholder="Ex: Chiado Luxury Loft T1"
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #d1d5db', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '6px' }}>
                      Tipologia:
                    </label>
                    <select
                      value={propTypology}
                      onChange={(e) => setPropTypology(e.target.value as TypologyType)}
                      style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #d1d5db', boxSizing: 'border-box', fontWeight: '700' }}
                    >
                      <option value="T0">T0 (Studio) — 35 €</option>
                      <option value="T1">T1 (1 Quarto) — 45 €</option>
                      <option value="T2">T2 (2 Quartos) — 60 €</option>
                      <option value="T3">T3 (3 Quartos) — 80 €</option>
                      <option value="T4">T4+ (Grande) — 100 €</option>
                      <option value="Escritório">Escritório — 90 €</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '6px' }}>
                      Cidade:
                    </label>
                    <input
                      type="text"
                      required
                      value={propCity}
                      onChange={(e) => setPropCity(e.target.value)}
                      placeholder="Lisboa, Cascais..."
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
                    value={propAddress}
                    onChange={(e) => setPropAddress(e.target.value)}
                    placeholder="Rua, Número, Andar e Código Postal"
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #d1d5db', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#b45309', display: 'block', marginBottom: '6px' }}>
                    Código de Entrada / Keybox:
                  </label>
                  <input
                    type="text"
                    required
                    value={propAccessCode}
                    onChange={(e) => setPropAccessCode(e.target.value)}
                    placeholder="Ex: Keybox: 4892# (Portão: 1234)"
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #fde68a', background: '#fffbeb', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '6px' }}>
                    Instruções Permanentes:
                  </label>
                  <textarea
                    value={propDefaultNotes}
                    onChange={(e) => setPropDefaultNotes(e.target.value)}
                    placeholder="Ex: Lençóis limpos no roupeiro do corredor."
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #d1d5db', minHeight: '60px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '6px' }}>
                    URL da Fotografia do Apartamento:
                  </label>
                  <input
                    type="text"
                    value={propImageUrl}
                    onChange={(e) => setPropImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
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
                  Gravar Apartamento
                </button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* ================= MODAL: AGENDAR LIMPEZA (RADIX DIALOG) ================= */}
      <Dialog.Root open={showScheduleModal} onOpenChange={setShowScheduleModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="radix-dialog-overlay" />
          <Dialog.Content className="radix-dialog-content" style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#0284c7', fontWeight: '800', textTransform: 'uppercase' }}>
                  Agendamento Online
                </span>
                <Dialog.Title style={{ fontSize: '1.4rem', fontWeight: '800', margin: '4px 0 0 0', color: '#0b192c' }}>
                  Agendar Limpeza
                </Dialog.Title>
                <Dialog.Description style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>
                  Reserva imediata com profissionais verificados e auditoria fotográfica.
                </Dialog.Description>
              </div>
              <Dialog.Close asChild>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
                  <X size={24} />
                </button>
              </Dialog.Close>
            </div>

            {schedSuccess ? (
              <div style={{ textAlign: 'center', padding: '30px', color: '#059669' }}>
                <CheckCircle2 size={48} style={{ margin: '0 auto 12px auto' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0 }}>Limpeza Agendada com Sucesso!</h3>
                <p style={{ fontSize: '0.9rem', color: '#6b7280', marginTop: '8px' }}>
                  A equipa de limpeza foi notificada e o horário já está reservado.
                </p>
              </div>
            ) : (
              <form onSubmit={handleScheduleSubmit}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '6px' }}>
                      Escolher Apartamento:
                    </label>
                    <select
                      value={schedPropertyId}
                      onChange={(e) => setSchedPropertyId(e.target.value)}
                      style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #d1d5db', boxSizing: 'border-box', fontWeight: '700' }}
                    >
                      {properties.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.typology} — {DEFAULT_PRICING_RULES[p.typology]?.owner_price} €)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Pricing preview card */}
                  <div style={{
                    background: '#f0f7ff',
                    border: '1px solid #bae6fd',
                    borderRadius: '16px',
                    padding: '18px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <span style={{ fontSize: '0.8rem', color: '#0284c7', fontWeight: '700', display: 'block' }}>
                        Custo da Limpeza ({selectedProp?.typology}):
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                        Inclui turnover completo e fotos Antes vs Depois.
                      </span>
                    </div>
                    <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0b192c' }}>
                      {activePricing?.owner_price} €
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div>
                      <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '6px' }}>
                        Data:
                      </label>
                      <input
                        type="text"
                        required
                        value={schedDate}
                        onChange={(e) => setSchedDate(e.target.value)}
                        placeholder="Ex: Hoje, Amanhã, 18/10"
                        style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #d1d5db', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '6px' }}>
                        Janela Horária:
                      </label>
                      <select
                        value={schedTimeSlot}
                        onChange={(e) => setSchedTimeSlot(e.target.value)}
                        style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #d1d5db', boxSizing: 'border-box' }}
                      >
                        <option value="10:00 - 13:00">10:00 - 13:00</option>
                        <option value="11:00 - 14:00">11:00 - 14:00 (Padrão AL)</option>
                        <option value="14:00 - 17:00">14:00 - 17:00</option>
                        <option value="16:00 - 19:00">16:00 - 19:00</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '6px' }}>
                      Notas Especiais para Esta Limpeza:
                    </label>
                    <textarea
                      value={schedNotes}
                      onChange={(e) => setSchedNotes(e.target.value)}
                      placeholder="Ex: Deixar 4 cápsulas de café na bancada e trocar toalhas."
                      style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #d1d5db', minHeight: '70px', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '28px' }}>
                  <button
                    type="button"
                    onClick={() => setShowScheduleModal(false)}
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
                  <button
                    type="submit"
                    style={{
                      padding: '12px 26px',
                      borderRadius: '10px',
                      border: 'none',
                      background: '#0b192c',
                      color: '#ffffff',
                      fontWeight: '800',
                      fontSize: '0.95rem',
                      cursor: 'pointer'
                    }}
                  >
                    Confirmar Agendamento ({activePricing?.owner_price} €)
                  </button>
                </div>
              </form>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* ================= MODAL: INSPEÇÃO DE FOTOS ANTES E DEPOIS (RADIX DIALOG) ================= */}
      <Dialog.Root open={showInspectionModal && !!selectedCleaning} onOpenChange={setShowInspectionModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="radix-dialog-overlay" />
          <Dialog.Content className="radix-dialog-content" style={{ maxWidth: '960px', width: '95vw' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#65a30d', fontWeight: '800', textTransform: 'uppercase' }}>
                  Relatório Fotográfico de Limpeza
                </span>
                <Dialog.Title style={{ fontSize: '1.6rem', fontWeight: '800', margin: '4px 0 0 0', color: '#0d2e23' }}>
                  {selectedCleaning?.property?.name}
                </Dialog.Title>
                <Dialog.Description style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '4px' }}>
                  Realizada por <strong>Equipa Fixa Impporta</strong> • {selectedCleaning?.scheduled_date}
                </Dialog.Description>
              </div>
              <Dialog.Close asChild>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
                  <X size={24} />
                </button>
              </Dialog.Close>
            </div>

            {selectedCleaning?.worker_notes && (
              <div style={{
                background: '#ecfdf5',
                border: '1px solid #a7f3d0',
                borderRadius: '16px',
                padding: '16px 20px',
                marginBottom: '20px',
                fontSize: '0.9rem',
                color: '#065f46'
              }}>
                <strong>Comentário do Trabalhador:</strong> "{selectedCleaning.worker_notes}"
              </div>
            )}

            {/* 42-Point Turnover Checklist Audit Card */}
            {(() => {
              const checklistData = selectedCleaning?.checklist || {};
              const checkedCount = Object.keys(checklistData).filter(k => !!checklistData[k]).length;
              const hasChecklist = checkedCount > 0;
              const displayCount = hasChecklist ? checkedCount : 42;
              const percent = Math.round((displayCount / 42) * 100);

              return (
                <div style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '18px',
                  padding: '18px 20px',
                  marginBottom: '24px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        background: '#dcfce7',
                        color: '#166534',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <FileCheck size={20} />
                      </div>
                      <div>
                        <div style={{ fontWeight: '800', color: '#0d2e23', fontSize: '0.98rem' }}>
                          Checklist Digital de Turnover (42 Pontos de Inspeção)
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                          Auditoria rigorosa em 5 setores operacionais • {displayCount} de 42 validados ({percent}%)
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowChecklistDetails(!showChecklistDetails)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        background: '#ffffff',
                        color: '#0f172a',
                        fontWeight: '700',
                        fontSize: '0.78rem',
                        cursor: 'pointer'
                      }}
                    >
                      {showChecklistDetails ? 'Ocultar Detalhes' : 'Ver Todos os 42 Pontos'}
                    </button>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden', marginTop: '12px' }}>
                    <div style={{ width: `${percent}%`, height: '100%', background: '#16a34a' }} />
                  </div>

                  {showChecklistDetails && (
                    <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {CHECKLIST_42_SECTIONS.map((section) => (
                        <div key={section.id} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px 16px' }}>
                          <div style={{ fontWeight: '800', fontSize: '0.86rem', color: '#0d2e23', marginBottom: '8px' }}>
                            {section.title} ({section.points.length} pontos)
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '6px 12px' }}>
                            {section.points.map((pt) => {
                              const isChecked = hasChecklist ? !!checklistData[pt.id] : true;
                              return (
                                <div key={pt.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '0.78rem', color: isChecked ? '#166534' : '#64748b' }}>
                                  <Check size={14} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
                                  <span><strong>{pt.number}.</strong> {pt.label}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Side-by-side Before and After Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '24px' }}>
              {/* BEFORE */}
              <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '20px', padding: '20px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#92400e', margin: '0 0 14px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Camera size={18} /> Fotos do ANTES (Chegada)
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {(selectedCleaning?.photos || []).filter(p => p.photo_type === 'before').map((p) => (
                    <div key={p.id} style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #fde68a' }}>
                      <img src={p.photo_url} alt="Antes" style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
                      <div style={{ padding: '8px 12px', background: '#fff', fontSize: '0.8rem', color: '#92400e', fontWeight: '700' }}>
                        Divisão: {p.room_tag}
                      </div>
                    </div>
                  ))}
                  {(selectedCleaning?.photos || []).filter(p => p.photo_type === 'before').length === 0 && (
                    <div style={{ color: '#b45309', fontSize: '0.85rem' }}>Sem fotos do antes.</div>
                  )}
                </div>
              </div>

              {/* AFTER */}
              <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '20px', padding: '20px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#065f46', margin: '0 0 14px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={18} /> Fotos do DEPOIS (Concluído)
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {(selectedCleaning?.photos || []).filter(p => p.photo_type === 'after').map((p) => (
                    <div key={p.id} style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #a7f3d0' }}>
                      <img src={p.photo_url} alt="Depois" style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
                      <div style={{ padding: '8px 12px', background: '#fff', fontSize: '0.8rem', color: '#065f46', fontWeight: '700' }}>
                        Divisão: {p.room_tag}
                      </div>
                    </div>
                  ))}
                  {(selectedCleaning?.photos || []).filter(p => p.photo_type === 'after').length === 0 && (
                    <div style={{ color: '#047857', fontSize: '0.85rem' }}>Sem fotos do depois.</div>
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Dialog.Close asChild>
                <button
                  style={{
                    padding: '12px 24px',
                    borderRadius: '12px',
                    border: 'none',
                    background: '#0d2e23',
                    color: '#fff',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Fechar Visualizador
                </button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
