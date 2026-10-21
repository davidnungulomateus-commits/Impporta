'use client';

import React, { useState } from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import * as Dialog from '@radix-ui/react-dialog';
import {
  ArrowRight,
  CheckCircle2,
  Calendar,
  Building2,
  Users,
  ShieldCheck,
  Star,
  Play,
  Plus,
  X,
  Phone,
  Mail,
  Check,
  ChevronDown,
  Clock,
  Euro,
  Lock,
  FileCheck,
  Shield,
  Award,
  HelpCircle,
  MessageSquare,
  LogIn,
  Gift,
  Info,
  Shirt,
  Camera
} from 'lucide-react';
import { useProfile, ProfileType } from '@/context/ProfileContext';
import { CleaningStore } from '@/lib/cleaning-store';
import {
  PLATFORM_LOGOS,
  AirbnbLogo,
  BookingLogo,
  VrboLogo,
  HostkitLogo,
  HostifyLogo,
  TalkguestLogo,
  GuestyLogo,
  LodgifyLogo
} from './PlatformLogos';
import { CHECKLIST_42_SECTIONS } from '@/lib/checklist-data';

export type ALTypologyKey = 'T0' | 'T1' | 'T2' | 'T3' | 'T4';

export interface ALTypologyPricing {
  code: ALTypologyKey;
  label: string;
  sublabel: string;
  bedrooms: number;
  includedBathrooms: number;
  basePrice: number;
  laundryAddition: number;
  note?: string;
}

export const AL_PRICING_CONFIG: Record<ALTypologyKey, ALTypologyPricing> = {
  T0: {
    code: 'T0',
    label: 'T0 / Estúdio',
    sublabel: 'Até 1 WC base',
    bedrooms: 0,
    includedBathrooms: 1,
    basePrice: 42,
    laundryAddition: 14,
  },
  T1: {
    code: 'T1',
    label: 'T1 (1 Quarto)',
    sublabel: 'Até 1 WC base',
    bedrooms: 1,
    includedBathrooms: 1,
    basePrice: 48,
    laundryAddition: 18,
  },
  T2: {
    code: 'T2',
    label: 'T2 (2 Quartos)',
    sublabel: 'Até 1 WC base',
    bedrooms: 2,
    includedBathrooms: 1,
    basePrice: 58,
    laundryAddition: 26,
  },
  T3: {
    code: 'T3',
    label: 'T3 (3 Quartos)',
    sublabel: 'Até 2 WCs base',
    bedrooms: 3,
    includedBathrooms: 2,
    basePrice: 78,
    laundryAddition: 34,
  },
  T4: {
    code: 'T4',
    label: 'T4 / Moradia (4 Quartos)',
    sublabel: 'Até 2 WCs base',
    bedrooms: 4,
    includedBathrooms: 2,
    basePrice: 98,
    laundryAddition: 42,
    note: 'Inclui até 2 casas de banho base. Para T3 e T4, a campanha de 1.ª limpeza atribui um crédito máximo de 58 € (equivalente ao valor base de um T2).',
  },
};

export const AL_EXTRAS_CONFIG = [
  {
    id: 'consumables',
    label: 'Kit de Reposição de Consumíveis',
    description: 'Papel higiénico, gel de banho, pastilhas máquina, café',
    price: 8,
  },
  {
    id: 'express',
    label: 'Taxa Express / Mesmo Dia',
    description: 'Pedidos com menos de 24h de aviso',
    price: 15,
  },
  {
    id: 'exterior_glass',
    label: 'Limpeza de Vidros Exteriores / Terraços Grandes',
    description: 'Higienização dedicada de varandas amplas, terraços e envidraçados exteriores',
    price: 20,
  },
] as const;

export type ALExtraId = typeof AL_EXTRAS_CONFIG[number]['id'];

export type CondoSizeKey = 'up_to_3' | '4_to_5' | '6_to_8' | '9_to_12' | '13_to_15';
export type CondoFrequencyKey = 1 | 2 | 3;

export interface CondoSizePricing {
  key: CondoSizeKey;
  title: string;
  floorsLabel: string;
  durationEstimate: string;
  prices: Record<CondoFrequencyKey, number>;
}

export const CONDO_SIZE_CONFIG: Record<CondoSizeKey, CondoSizePricing> = {
  up_to_3: {
    key: 'up_to_3',
    title: 'Pequeno (Até 3 Pisos / Patamares)',
    floorsLabel: 'Até 3 Pisos',
    durationEstimate: '~1h00 por visita',
    prices: { 1: 85, 2: 155, 3: 220 },
  },
  '4_to_5': {
    key: '4_to_5',
    title: 'Médio-Pequeno (4 a 5 Pisos / Patamares)',
    floorsLabel: '4 a 5 Pisos',
    durationEstimate: '~1h30 por visita',
    prices: { 1: 115, 2: 210, 3: 295 },
  },
  '6_to_8': {
    key: '6_to_8',
    title: 'Médio (6 a 8 Pisos / Patamares)',
    floorsLabel: '6 a 8 Pisos',
    durationEstimate: '~2h00 por visita',
    prices: { 1: 145, 2: 265, 3: 375 },
  },
  '9_to_12': {
    key: '9_to_12',
    title: 'Grande (9 a 12 Pisos / Patamares)',
    floorsLabel: '9 a 12 Pisos',
    durationEstimate: '~2h45 por visita',
    prices: { 1: 195, 2: 355, 3: 505 },
  },
  '13_to_15': {
    key: '13_to_15',
    title: 'Extra Grande (13 a 15 Pisos / Patamares)',
    floorsLabel: '13 a 15 Pisos',
    durationEstimate: '~3h30 por visita',
    prices: { 1: 245, 2: 445, 3: 630 },
  },
};

export const CONDO_EXTRAS_CONFIG = [
  {
    id: 'garage_small',
    label: 'Limpeza de Garagem — Até 15 lugares (1x/mês)',
    price: 35,
  },
  {
    id: 'garage_large',
    label: 'Limpeza de Garagem — 16 a 30 lugares (1x/mês)',
    price: 55,
  },
  {
    id: 'trash_bins',
    label: 'Gestão Semanal de Contentores do Lixo (Colocação e recolha na rua)',
    price: 25,
  },
] as const;

export type CondoExtraId = typeof CONDO_EXTRAS_CONFIG[number]['id'];

interface NeatifyLandingProps {
  onNavigateToPortal?: (role: ProfileType) => void;
}

export default function NeatifyLanding({ onNavigateToPortal }: NeatifyLandingProps) {
  const { setProfile, authenticatedUser, setAuthenticatedUser, setActiveUserId } = useProfile();
  const [lang, setLang] = useState<'pt' | 'en'>('pt');
  const t = (pt: string, en: string) => (lang === 'en' ? en : pt);

  const [billingCycle, setBillingCycle] = useState<'onetime' | 'weekly' | 'biweekly' | 'monthly'>('weekly');
  const [quickQuoteOpen, setQuickQuoteOpen] = useState(false);
  const [checklistModalOpen, setChecklistModalOpen] = useState(false);
  const [quoteSent, setQuoteSent] = useState(false);
  const [quoteServiceType, setQuoteServiceType] = useState<'al' | 'condo'>('al');
  const [quoteTypology, setQuoteTypology] = useState('T1');
  const [quoteFrequency, setQuoteFrequency] = useState('semanal');
  const [quoteCondoSize, setQuoteCondoSize] = useState<CondoSizeKey>('4_to_5');
  const [quoteCondoFreq, setQuoteCondoFreq] = useState<CondoFrequencyKey>(2);
  const [activeNavRole, setActiveNavRole] = useState<'owner' | 'worker'>('owner');
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginRole, setLoginRole] = useState<'owner' | 'worker'>('owner');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Simulator Active Tab ('al' = Alojamento Local | 'condo' = Condomínios)
  const [simulatorActiveTab, setSimulatorActiveTab] = useState<'al' | 'condo'>('al');

  // Impporta AL - Pricing Simulator State
  const [simulatorTypology, setSimulatorTypology] = useState<ALTypologyKey>('T1');
  const [simulatorLaundry, setSimulatorLaundry] = useState(false);
  const [simulatorExtraBathrooms, setSimulatorExtraBathrooms] = useState<number>(0);
  const [simulatorSelectedExtras, setSimulatorSelectedExtras] = useState<ALExtraId[]>([]);
  const [simulatorTurnoversPerMonth, setSimulatorTurnoversPerMonth] = useState<number>(6);
  const [simulatorPropertiesCount, setSimulatorPropertiesCount] = useState<number>(1);
  const [simulatorIncludeVat, setSimulatorIncludeVat] = useState(false);

  // Impporta Condomínios - Pricing Simulator State
  const [condoSize, setCondoSize] = useState<CondoSizeKey>('4_to_5');
  const [condoFrequency, setCondoFrequency] = useState<CondoFrequencyKey>(2);
  const [condoSelectedExtras, setCondoSelectedExtras] = useState<CondoExtraId[]>([]);
  const [condoFractions, setCondoFractions] = useState<number>(8);
  const [condoIncludeVat, setCondoIncludeVat] = useState<boolean>(true);
  const [showFullPricingTable, setShowFullPricingTable] = useState<boolean>(false);

  const [trialModalOpen, setTrialModalOpen] = useState(false);
  const [trialSuccess, setTrialSuccess] = useState(false);
  const [trialForm, setTrialForm] = useState({ name: '', phone: '', address: '', link: '' });

  const handleSelectRole = (role: ProfileType) => {
    const targetRole: 'owner' | 'worker' = role === 'worker' ? 'worker' : 'owner';
    if (authenticatedUser && authenticatedUser.role === targetRole) {
      setProfile(targetRole);
      if (onNavigateToPortal) {
        onNavigateToPortal(targetRole);
      }
      return;
    }
    setLoginRole(targetRole);
    setLoginError('');
    setLoginModalOpen(true);
  };

  const services = [
    {
      id: 0,
      number: '01',
      title: t('Alojamento Local & Airbnb (Turnover)', 'Short-Term Rentals & Airbnb (Turnover)'),
      category: 'Commercial cleaning',
      description: t(
        'Limpeza especializada entre estadias de hóspedes com troca de lençóis, higienização hospitalar, reposição de consumíveis e relatório fotográfico obrigatório de Antes e Depois.',
        'Specialized turnover cleaning between guest stays with hotel linen rotation, hospital-grade sanitization, consumables restocking, and mandatory Before & After photo reports.'
      ),
      tags: lang === 'en'
        ? ['STR Turnover', 'Check-in / Check-out', 'Before/After Photos', 'Damage Report']
        : ['Turnover AL', 'Check-in / Check-out', 'Fotos Antes/Depois', 'Relatório de Danos'],
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 1,
      number: '02',
      title: t('Limpeza de Condomínios & Partes Comuns', 'Condominium & Common Area Cleaning'),
      category: 'Common cleaning',
      description: t(
        'Manutenção rigorosa de escadarias, halls de entrada, elevadores, garagens e vidros de prédios com equipas fixas e fornecimento de todos os produtos profissionais.',
        'Thorough maintenance of staircases, entrance lobbies, elevators, garages, and building glass with dedicated fixed teams and all professional supplies included.'
      ),
      tags: lang === 'en'
        ? ['Stairs & Lobbies', 'Elevators', 'Glass & Windows', 'Disinfection']
        : ['Escadas & Halls', 'Elevadores', 'Vidros', 'Desinfeção'],
      image: '/service-condominio.jpg',
    },
    {
      id: 2,
      number: '03',
      title: t('Limpeza de Escritórios & Espaços Comerciais', 'Office & Commercial Space Cleaning'),
      category: 'Workspace cleaning',
      description: t(
        'Higienização de postos de trabalho, salas de reuniões, copas e sanitários em horários flexíveis (após o expediente) sem perturbar a produtividade da sua empresa.',
        'Sanitization of workstations, meeting rooms, break areas, and restrooms on flexible after-hours schedules without disrupting your company’s productivity.'
      ),
      tags: lang === 'en'
        ? ['Workstations', 'Meeting Rooms', 'Pantries & Kitchens', 'After-Hours Schedule']
        : ['Postos de Trabalho', 'Salas de Reunião', 'Copas & Cozinhas', 'Horário Pós-laboral'],
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 3,
      number: '04',
      title: t('Limpeza Pós-Obras & Limpeza Profunda', 'Post-Construction & Deep Cleaning'),
      category: 'Industrial & Specialised cleaning',
      description: t(
        'Remoção minuciosa de poeiras de gesso, tintas, resíduos de obra e desengorduramento pesado com aspiradores industriais e químicos de alta eficácia.',
        'Detailed removal of plaster dust, paint residue, construction debris, and heavy degreasing using industrial vacuums and high-efficacy professional chemicals.'
      ),
      tags: lang === 'en'
        ? ['Post-Construction', 'Floor Stripping', 'End of Tenancy', 'Reinforced Crew']
        : ['Pós-Obras', 'Decapagem de Chão', 'Fim de Arrendamento', 'Equipa Reforçada'],
      image: 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=800&auto=format&fit=crop&q=80',
    }
  ];

  return (
    <div style={{ background: '#f7f4ee', color: '#111625', fontFamily: 'Inter, sans-serif', minHeight: '100vh', overflowX: 'hidden' }}>
      
      {/* ─────────────────────────────────────────────────────────────
          0. TOP URGENCY NOTICE (SPARKLES INSPIRATION)
          ───────────────────────────────────────────────────────────── */}
      <div style={{
        background: '#ebe7fe',
        color: '#4338ca',
        padding: '10px 16px',
        textAlign: 'center',
        fontSize: '0.82rem',
        fontWeight: '700',
        letterSpacing: '0.01em',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px'
      }}>
        <span>{t('4 vagas disponíveis esta semana em Lisboa & Cascais.', '4 slots available this week in Lisbon & Cascais.')}</span>
        <button
          onClick={() => setQuickQuoteOpen(true)}
          style={{ textDecoration: 'underline', fontWeight: '800', cursor: 'pointer', background: 'none', border: 'none', color: '#4338ca' }}
        >
          {t('Reserve antes que esgotem →', 'Book before they fill up →')}
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          1. FLOATING NAVIGATION BAR (UI/UX Pro Max Glassmorphism)
          ───────────────────────────────────────────────────────────── */}
      <header className="uipro-navbar-wrapper">
        <nav className="uipro-navbar-glass neatify-nav-container">
          {/* Brand Logo on the Left (Text-Only Brand) */}
          <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <span className="neatify-brand-text" style={{
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
              fontSize: '1.55rem',
              fontWeight: 900,
              color: '#111625',
              letterSpacing: '-0.045em',
              lineHeight: 1
            }}>
              Impporta
            </span>
          </div>

          {/* Desktop Nav Links */}
          <div className="uipro-nav-links">
            <a href="#about" className="uipro-nav-link">{t('Sobre Nós', 'About Us')}</a>
            <a href="#services" className="uipro-nav-link">{t('Serviços', 'Services')}</a>
            <a href="#pricing" className="uipro-nav-link">{t('Simulador de Preços', 'Pricing Calculator')}</a>
            <a href="#team" className="uipro-nav-link">{t('Equipa Fixa', 'Dedicated Team')}</a>
          </div>

          {/* Action Buttons on the Right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            {/* Language Switcher Pill (PT | EN) */}
            <div
              role="group"
              aria-label={t('Selecionar idioma', 'Select language')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                background: '#efece4',
                border: '1px solid #dcd7cc',
                borderRadius: '999px',
                padding: '3px',
                gap: '2px'
              }}
            >
              {(['pt', 'en'] as const).map((code) => {
                const active = lang === code;
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setLang(code)}
                    style={{
                      padding: '5px 10px',
                      borderRadius: '999px',
                      border: 'none',
                      background: active ? '#111625' : 'transparent',
                      color: active ? '#ffffff' : '#475569',
                      fontWeight: '800',
                      fontSize: '0.74rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      cursor: 'pointer',
                      transition: 'all 0.18s ease',
                      lineHeight: 1
                    }}
                  >
                    {code.toUpperCase()}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => {
                setLoginRole('owner');
                setLoginError('');
                setLoginModalOpen(true);
              }}
              className="uipro-btn-primary"
              style={{
                padding: '10px 22px',
                borderRadius: '999px',
                border: '1.5px solid #111625',
                background: '#111625',
                color: '#ffffff',
                fontWeight: '800',
                fontSize: '0.9rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 3px 12px rgba(17, 22, 37, 0.18)',
                whiteSpace: 'nowrap'
              }}
            >
              <LogIn size={16} color="#9bb6f6" /> {t('Entrar', 'Sign In')}
            </button>
          </div>
        </nav>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          2. HERO SECTION (CLEAN 2-COLUMN HERO WITHOUT CARD RECTANGLES)
          ───────────────────────────────────────────────────────────── */}
      <section className="landing-hero" style={{ maxWidth: '1240px', margin: '40px auto 70px auto', padding: '0 clamp(24px, 5vw, 56px)' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '48px',
          alignItems: 'center'
        }}>
          {/* Left Column: Headline & CTA directly on background */}
          <div>
            {/* Integrations Pill with Real Logos */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '8px',
              background: '#f7f4ee',
              border: '1px solid #e7e3da',
              padding: '6px 14px',
              borderRadius: '999px',
              marginBottom: '20px',
              maxWidth: '560px',
              boxShadow: '0 2px 8px rgba(17, 22, 37, 0.04)'
            }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '0.72rem',
                fontWeight: '900',
                color: '#111625',
                background: '#ffffff',
                border: '1px solid #dcd7cc',
                padding: '3px 9px',
                borderRadius: '999px',
                letterSpacing: '0.04em',
                textTransform: 'uppercase'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16a34a', display: 'inline-block' }} />
                {t('Integrações', 'Integrations')}
              </span>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <AirbnbLogo size="sm" />
                <span style={{ color: '#dcd7cc', fontSize: '0.75rem', userSelect: 'none' }}>•</span>
                <BookingLogo size="sm" />
                <span style={{ color: '#dcd7cc', fontSize: '0.75rem', userSelect: 'none' }}>•</span>
                <HostkitLogo size="sm" />
                <span style={{ fontSize: '0.76rem', fontWeight: '800', color: '#64748b' }}>
                  {t('& +5 canais', '& +5 channels')}
                </span>
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="landing-hero-title" style={{
              fontSize: 'clamp(2.4rem, 4.2vw, 3.6rem)',
              fontWeight: '900',
              lineHeight: '1.08',
              color: '#111625',
              letterSpacing: '-0.035em',
              textTransform: 'uppercase',
              margin: '0 0 18px 0'
            }}>
              {t('Limpeza de excelência', 'Excellence in cleaning')} <br />
              <span style={{ color: '#111625' }}>{t('para quem não tem ', 'for those with ')}</span><br />
              <span style={{ color: '#688af2', fontStyle: 'italic', fontWeight: '800' }}>{t('tempo a perder.', 'no time to waste.')}</span>
            </h1>

            <p style={{
              fontSize: '1.05rem',
              lineHeight: '1.6',
              color: '#475569',
              maxWidth: '500px',
              margin: '0 0 32px 0'
            }}>
              {t(
                'A plataforma inteligente que liga anfitriões de Alojamento Local e condomínios a profissionais verificados, com relatórios fotográficos de Antes e Depois em cada visita.',
                'The smart platform connecting Short-Term Rental hosts and condominiums with verified professionals, featuring mandatory Before & After photo reports on every visit.'
              )}
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
              <button
                onClick={() => setQuickQuoteOpen(true)}
                className="uipro-btn-primary"
                style={{
                  padding: '15px 30px',
                  borderRadius: '999px',
                  border: 'none',
                  background: '#111625',
                  color: '#ffffff',
                  fontWeight: '800',
                  fontSize: '0.92rem',
                  letterSpacing: '0.01em',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 16px rgba(17, 22, 37, 0.25)'
                }}
              >
                {t('AGENDAR LIMPEZA', 'BOOK CLEANING')} <ArrowRight size={16} color="#9bb6f6" />
              </button>

              <a
                href="#pricing"
                className="uipro-btn-secondary"
                style={{
                  padding: '15px 28px',
                  borderRadius: '999px',
                  border: '1.5px solid #dcd7cc',
                  background: '#ffffff',
                  color: '#111625',
                  fontWeight: '800',
                  fontSize: '0.92rem',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                }}
              >
                {t('SIMULAR PREÇOS', 'CALCULATE PRICING')}
              </a>
            </div>
          </div>

          {/* Right Column: Hero Visual Photography with Floating Verification Badge */}
            <div className="landing-hero-media" style={{ position: 'relative' }}>
            <div style={{
              borderRadius: '28px',
              overflow: 'hidden',
              boxShadow: '0 20px 48px rgba(17, 22, 37, 0.12)',
              aspectRatio: '4/3',
              position: 'relative',
              border: '1px solid #e7e3da'
            }}>
              <img
                src="/hero-linen.jpg"
                alt={t('Preparação e limpeza de excelência de quartos e camas', 'Excellence in bedroom and hotel linen preparation')}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(17, 22, 37, 0.18) 0%, transparent 45%)'
              }} />
            </div>

            {/* Floating verification badge */}
            <div style={{
              position: 'absolute',
              bottom: '-18px',
              left: '24px',
              background: '#ffffff',
              border: '1px solid #e7e3da',
              borderRadius: '20px',
              padding: '14px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: '0 12px 30px rgba(0,0,0,0.08)'
            }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: '#e8eefc',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <CheckCircle2 size={22} color="#2563eb" />
              </div>
              <div>
                <div style={{ fontWeight: '900', fontSize: '0.95rem', color: '#111625' }}>
                  {t('100% Verificado', '100% Verified')}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#52525b', marginTop: '2px', fontWeight: '500' }}>
                  {t('Fotos do Antes e Depois em todas as limpezas', 'Before & After photos on every cleaning')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. LOGO TRUST & INTEGRATIONS STRIP (Airbnb, Booking.com, Vrbo, Hostkit, Hostify, Talkguest, Guesty, Lodgify)
          ───────────────────────────────────────────────────────────── */}
      <section style={{ maxWidth: '1240px', margin: '48px auto 36px auto', padding: '0 clamp(24px, 5vw, 56px)' }}>
        <div style={{ textAlign: 'center', marginBottom: '14px' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {t('• SINCRONIZAÇÃO AUTOMÁTICA DE CALENDÁRIOS (ICAL & PMS) •', '• AUTOMATIC CALENDAR & PMS SYNC (ICAL & API) •')}
          </span>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px',
          padding: '16px 0',
          borderTop: '1px solid #e7e3da',
          borderBottom: '1px solid #e7e3da'
        }}>
          {PLATFORM_LOGOS.map((platform) => {
            const LogoComponent = platform.component;
            return (
              <div
                key={platform.id}
                style={{
                  background: '#f7f4ee',
                  border: '1px solid #e7e3da',
                  borderRadius: '12px',
                  padding: '9px 18px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                }}
              >
                <LogoComponent size="md" />
              </div>
            );
          })}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. ABOUT US & IMPACT CARDS
          ───────────────────────────────────────────────────────────── */}
      <section id="about" style={{ maxWidth: '1240px', margin: '80px auto', padding: '0 clamp(24px, 5vw, 56px)' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '40px',
          alignItems: 'center'
        }}>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#0284c7', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {t('• SOBRE NÓS & MISSÃO', '• ABOUT US & MISSION')}
            </span>
            <h2 style={{
              fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
              fontWeight: '800',
              lineHeight: '1.2',
              color: '#0b192c',
              margin: '12px 0 20px 0'
            }}>
              {t(
                'Descubra como o nosso compromisso com a qualidade, fiabilidade e rigor transforma os seus espaços em ambientes impecáveis.',
                'Discover how our commitment to quality, reliability, and precision transforms your properties into spotless spaces.'
              )}
            </h2>
            <p style={{ fontSize: '1rem', color: '#4b5563', lineHeight: '1.6', marginBottom: '24px' }}>
              {t(
                'Damos tranquilidade aos anfitriões e administradores de condomínios. Cada serviço conta com registo exato de início e fim, auditoria fotográfica de cada divisão e apoio operacional contínuo.',
                'We bring peace of mind to hosts and property managers. Every service includes exact check-in/out timestamps, room-by-room photo auditing, and continuous operational support.'
              )}
            </p>
            <button
              onClick={() => handleSelectRole('owner')}
              style={{
                padding: '12px 24px',
                borderRadius: '10px',
                border: '1px solid #0b192c',
                background: '#0b192c',
                color: '#ffffff',
                fontWeight: '700',
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {t('Conhecer a Plataforma', 'Explore the Platform')} <ArrowRight size={16} color="#38bdf8" />
            </button>
          </div>

          {/* Stats Cards Grid (Neatify Dark Forest Cards) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{
              background: '#0b192c',
              borderRadius: '20px',
              padding: '28px',
              color: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#38bdf8', letterSpacing: '0.05em' }}>
                {t('IMÓVEIS ASSISTIDOS', 'PROPERTIES SERVICED')}
              </span>
              <div style={{ marginTop: '20px' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#ffffff' }}>500+</div>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#9ca3af' }}>
                  {t('Apartamentos e condomínios em Lisboa, Cascais e Sintra', 'Apartments and condominiums across Lisbon, Cascais, and Sintra')}
                </p>
              </div>
            </div>

            <div style={{
              background: '#0b192c',
              borderRadius: '20px',
              padding: '28px',
              color: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#38bdf8', letterSpacing: '0.05em' }}>
                {t('AUDITORIA DE FOTOS', 'PHOTO AUDIT')}
              </span>
              <div style={{ marginTop: '20px' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#38bdf8' }}>100%</div>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#9ca3af' }}>
                  {t('Garantia de inspecção Antes vs Depois em cada limpeza', 'Guaranteed Before vs After inspection on every cleaning')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. DARK ACCORDION SECTION (Neatify 01, 02, 03, 04)
          ───────────────────────────────────────────────────────────── */}
      <section id="services" style={{ background: '#111625', color: '#ffffff', padding: '90px clamp(32px, 8vw, 120px)', margin: '40px 0' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '20px', marginBottom: '48px' }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#9bb6f6', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {t('• NOSSOS SERVIÇOS', '• OUR SERVICES')}
              </span>
              <h2 style={{
                fontSize: 'clamp(2rem, 3.5vw, 3rem)',
                fontWeight: '900',
                margin: '10px 0 0 0',
                letterSpacing: '-0.02em',
                lineHeight: '1.15'
              }}>
                {t('Descubra os nossos serviços', 'Discover our services')} <br />
                {t('e como ', 'and how ')}<span style={{ color: '#9bb6f6', fontStyle: 'italic', fontWeight: '600' }}>{t('fazemos melhor.', 'we do it better.')}</span>
              </h2>
            </div>
            <p style={{ maxWidth: '420px', color: '#9ca3af', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
              {t(
                'Seja para o seu alojamento local ou condomínio, as nossas equipas dedicadas asseguram limpeza profissional e pontualidade irrepreensível.',
                'Whether for your short-term rental or condominium, our dedicated teams ensure professional cleaning and uncompromising punctuality.'
              )}
            </p>
          </div>

          {/* Radix Services Accordion */}
          <Accordion.Root type="single" defaultValue="service-0" collapsible style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {services.map((item) => (
              <Accordion.Item
                key={item.id}
                value={`service-${item.id}`}
                style={{
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '16px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  overflow: 'hidden',
                  transition: 'background 0.2s, border-color 0.2s'
                }}
              >
                <Accordion.Header style={{ all: 'unset', display: 'block' }}>
                  <Accordion.Trigger
                    style={{
                      width: '100%',
                      padding: '26px clamp(24px, 3.5vw, 40px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      border: 'none',
                      background: 'transparent',
                      textAlign: 'left',
                      color: 'inherit'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                      <span style={{
                        fontSize: '1.1rem',
                        fontWeight: '800',
                        color: '#9bb6f6'
                      }}>
                        {item.number}
                      </span>
                      <h3 style={{
                        fontSize: '1.25rem',
                        fontWeight: '700',
                        margin: 0,
                        color: '#ffffff'
                      }}>
                        {item.title}
                      </h3>
                    </div>

                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <ChevronDown size={18} className="accordion-chevron" />
                    </div>
                  </Accordion.Trigger>
                </Accordion.Header>

                <Accordion.Content className="radix-accordion-content">
                  <div style={{
                    padding: '0 clamp(24px, 3.5vw, 40px) 32px clamp(24px, 3.5vw, 40px)',
                    background: '#ffffff',
                    color: '#111827',
                    borderTop: '1px solid #f3f4f6'
                  }}>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                      gap: '24px',
                      alignItems: 'center',
                      paddingTop: '20px'
                    }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: '#7c9de9' }}>
                          {item.category}
                        </span>
                        <p style={{ fontSize: '0.95rem', color: '#4b5563', lineHeight: '1.6', margin: '10px 0 16px 0' }}>
                          {item.description}
                        </p>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
                          {item.tags.map((tagText, idx) => (
                            <span key={idx} style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              background: '#e8eefc',
                              color: '#1e3a8a',
                              fontSize: '0.75rem',
                              fontWeight: '700',
                              padding: '4px 10px',
                              borderRadius: '999px',
                              border: '1px solid #c7d7fd'
                            }}>
                              <Check size={12} strokeWidth={3} /> {tagText}
                            </span>
                          ))}
                        </div>
                        <button
                          onClick={() => handleSelectRole('owner')}
                          className="uipro-btn-primary"
                          style={{
                            padding: '12px 24px',
                            borderRadius: '999px',
                            border: 'none',
                            background: '#9bb6f6',
                            color: '#0f172a',
                            fontWeight: '800',
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          {t('Agendar Este Serviço', 'Book This Service')} <ArrowRight size={14} color="#0f172a" />
                        </button>
                      </div>

                      <div style={{ height: '220px', borderRadius: '12px', overflow: 'hidden' }}>
                        <img
                          src={item.image}
                          alt={item.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                    </div>
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. PRICING SECTION - IMPPORTA AL PRICING SIMULATOR
          ───────────────────────────────────────────────────────────── */}
      {(() => {
        const currentPlan = AL_PRICING_CONFIG[simulatorTypology];
        const vatMultiplier = simulatorIncludeVat ? 1.23 : 1;

        const getAlLabel = (key: ALTypologyKey) => {
          const map: Record<ALTypologyKey, [string, string]> = {
            T0: ['T0 / Estúdio', 'T0 / Studio'],
            T1: ['T1 (1 Quarto)', 'T1 (1 Bedroom)'],
            T2: ['T2 (2 Quartos)', 'T2 (2 Bedrooms)'],
            T3: ['T3 (3 Quartos)', 'T3 (3 Bedrooms)'],
            T4: ['T4 / Moradia (4 Quartos)', 'T4 / Villa (4 Bedrooms)'],
          };
          return t(map[key][0], map[key][1]);
        };

        const getAlSublabel = (key: ALTypologyKey) => {
          const baths = AL_PRICING_CONFIG[key].includedBathrooms;
          return baths === 1
            ? t('Até 1 WC base', 'Up to 1 base WC')
            : t('Até 2 WCs base', 'Up to 2 base WCs');
        };

        const getCondoTitle = (key: CondoSizeKey) => {
          const map: Record<CondoSizeKey, [string, string]> = {
            up_to_3: ['Pequeno (Até 3 Pisos / Patamares)', 'Small (Up to 3 Floors / Landings)'],
            '4_to_5': ['Médio-Pequeno (4 a 5 Pisos / Patamares)', 'Medium-Small (4 to 5 Floors / Landings)'],
            '6_to_8': ['Médio (6 a 8 Pisos / Patamares)', 'Medium (6 to 8 Floors / Landings)'],
            '9_to_12': ['Grande (9 a 12 Pisos / Patamares)', 'Large (9 to 12 Floors / Landings)'],
            '13_to_15': ['Extra Grande (13 a 15 Pisos / Patamares)', 'Extra Large (13 to 15 Floors / Landings)'],
          };
          return t(map[key][0], map[key][1]);
        };

        const getCondoFloorsLabel = (key: CondoSizeKey) => {
          const map: Record<CondoSizeKey, [string, string]> = {
            up_to_3: ['Até 3 Pisos', 'Up to 3 Floors'],
            '4_to_5': ['4 a 5 Pisos', '4 to 5 Floors'],
            '6_to_8': ['6 a 8 Pisos', '6 to 8 Floors'],
            '9_to_12': ['9 a 12 Pisos', '9 to 12 Floors'],
            '13_to_15': ['13 a 15 Pisos', '13 to 15 Floors'],
          };
          return t(map[key][0], map[key][1]);
        };

        const getCondoDuration = (key: CondoSizeKey) => {
          const map: Record<CondoSizeKey, [string, string]> = {
            up_to_3: ['~1h00 por visita', '~1h00 per visit'],
            '4_to_5': ['~1h30 por visita', '~1h30 per visit'],
            '6_to_8': ['~2h00 por visita', '~2h00 per visit'],
            '9_to_12': ['~2h45 por visita', '~2h45 per visit'],
            '13_to_15': ['~3h30 por visita', '~3h30 per visit'],
          };
          return t(map[key][0], map[key][1]);
        };

        const getCondoExtraLabel = (id: CondoExtraId) => {
          const map: Record<CondoExtraId, [string, string]> = {
            garage_small: ['Limpeza de Garagem — Até 15 lugares (1x/mês)', 'Garage Cleaning — Up to 15 spaces (1x/month)'],
            garage_large: ['Limpeza de Garagem — 16 a 30 lugares (1x/mês)', 'Garage Cleaning — 16 to 30 spaces (1x/month)'],
            trash_bins: ['Gestão Semanal de Contentores do Lixo (Colocação e recolha na rua)', 'Weekly Trash Bin Management (Curbside placement & collection)'],
          };
          return t(map[id][0], map[id][1]);
        };

        // Format currency in PT format (e.g. 42 € or 51,66 €)
        const formatEuro = (val: number, forceDecimals = false) => {
          const rounded = Math.round(val * 100) / 100;
          if (!forceDecimals && rounded % 1 === 0) {
            return `${rounded} €`;
          }
          return `${rounded.toFixed(2).replace('.', ',')} €`;
        };

        // A & B. Base & Laundry (Excl. VAT)
        const baseCostExclVat = currentPlan.basePrice;
        const laundryCostExclVat = simulatorLaundry ? currentPlan.laundryAddition : 0;

        const subtotalTurnoverExclVat = baseCostExclVat + laundryCostExclVat;

        // C. Volume / Frequency Discount Rule (applies to Base Cleaning component only)
        let discountRate = 0;
        let discountReason = '';
        if (simulatorTurnoversPerMonth >= 15 || simulatorPropertiesCount >= 5) {
          discountRate = 0.10;
          discountReason =
            simulatorTurnoversPerMonth >= 15 && simulatorPropertiesCount >= 5
              ? t('15+ turnovers/mês e 5+ imóveis', '15+ turnovers/mo & 5+ properties')
              : simulatorTurnoversPerMonth >= 15
              ? t('15+ turnovers/mês', '15+ turnovers/mo')
              : t('5+ imóveis na carteira', '5+ properties in portfolio');
        } else if (
          simulatorTurnoversPerMonth >= 8 ||
          (simulatorPropertiesCount >= 3 && simulatorPropertiesCount <= 4)
        ) {
          discountRate = 0.05;
          discountReason =
            simulatorTurnoversPerMonth >= 8 && simulatorPropertiesCount >= 3
              ? t('8+ turnovers/mês e 3–4 imóveis', '8+ turnovers/mo & 3–4 properties')
              : simulatorTurnoversPerMonth >= 8
              ? t('8+ turnovers/mês', '8+ turnovers/mo')
              : t('3 a 4 imóveis na carteira', '3 to 4 properties in portfolio');
        }

        const discountPerTurnoverExclVat = baseCostExclVat * discountRate;
        const discountedBaseExclVat = baseCostExclVat - discountPerTurnoverExclVat;
        const finalTurnoverExclVat = subtotalTurnoverExclVat - discountPerTurnoverExclVat;

        // D. VAT Rule (23%)
        const displayedTurnoverTotal = finalTurnoverExclVat * vatMultiplier;
        const displayedSubtotalTurnover = subtotalTurnoverExclVat * vatMultiplier;
        const vatAmountPerTurnover = finalTurnoverExclVat * 0.23;

        // Monthly Estimate
        const monthlyTotalExclVat = finalTurnoverExclVat * simulatorTurnoversPerMonth;
        const displayedMonthlyTotal = monthlyTotalExclVat * vatMultiplier;
        const monthlyVolumeSavingsDisplay =
          discountPerTurnoverExclVat * simulatorTurnoversPerMonth * vatMultiplier;

        // 3. Promotional Offer: "1.ª Limpeza Gratuita"
        // Valid 100% for T0, T1, T2; for T3 & T4 max credit equivalent to T2 base (58 €)
        const isCappedPromoTypology = simulatorTypology === 'T3' || simulatorTypology === 'T4';
        const promoCreditExclVat = isCappedPromoTypology ? 58 : baseCostExclVat;
        const displayedPromoCredit = promoCreditExclVat * vatMultiplier;
        const displayedFirstMonthWithPromo = Math.max(0, displayedMonthlyTotal - displayedPromoCredit);

        // 5. Dynamic WhatsApp Message & URL
        const whatsappLines = lang === 'en'
          ? [
              'Hello Impporta! I would like to book my *Free 1st Trial Cleaning* and receive a proposal for my Short-Term Rental:',
              '',
              `• *Property Size:* ${getAlLabel(simulatorTypology)}`,
              `• *Laundry Service:* ${
                simulatorLaundry
                  ? `Cleaning + Industrial External Laundry (+${currentPlan.laundryAddition} €)`
                  : "Base Cleaning Only (owner's linen)"
              }`,
              `• *Estimated Volume:* ${simulatorTurnoversPerMonth} turnovers/month (${simulatorPropertiesCount} ${
                simulatorPropertiesCount === 1 ? 'property' : 'properties'
              } in portfolio)${discountRate > 0 ? ` — ${Math.round(discountRate * 100)}% Volume Discount applied` : ''}`,
              `• *Calculated Price per Turnover:* ${formatEuro(displayedTurnoverTotal)} (${
                simulatorIncludeVat ? 'incl. 23% VAT' : 'excl. VAT'
              })`,
              `• *Monthly Estimate (${simulatorTurnoversPerMonth} turnovers):* ${formatEuro(displayedMonthlyTotal)} (${
                simulatorIncludeVat ? 'incl. VAT' : 'excl. VAT'
              })`,
              `• *1st Month Savings (1st Cleaning Promo):* -${formatEuro(displayedPromoCredit)}`,
            ]
          : [
              'Olá Impporta! Gostaria de agendar a minha *1.ª Limpeza Gratuita* e receber proposta para o meu Alojamento Local:',
              '',
              `• *Tipologia:* ${currentPlan.label}`,
              `• *Serviço de Lavandaria:* ${
                simulatorLaundry
                  ? `Limpeza + Lavandaria Externa Industrial (+${currentPlan.laundryAddition} €)`
                  : 'Apenas Limpeza Base (roupa do proprietário)'
              }`,
              `• *Volume Estimado:* ${simulatorTurnoversPerMonth} turnovers/mês (${simulatorPropertiesCount} ${
                simulatorPropertiesCount === 1 ? 'imóvel' : 'imóveis'
              } na carteira)${discountRate > 0 ? ` — Desconto Volume ${Math.round(discountRate * 100)}% aplicado` : ''}`,
              `• *Preço Calculado por Turnover:* ${formatEuro(displayedTurnoverTotal)} (${
                simulatorIncludeVat ? 'c/ IVA 23% incluído' : 's/ IVA'
              })`,
              `• *Estimativa Mensal (${simulatorTurnoversPerMonth} turnovers):* ${formatEuro(displayedMonthlyTotal)} (${
                simulatorIncludeVat ? 'c/ IVA' : 's/ IVA'
              })`,
              `• *Poupança 1.º Mês (Campanha 1.ª Limpeza):* -${formatEuro(displayedPromoCredit)}`,
            ];

        const whatsappUrl = `https://wa.me/351927322095?text=${encodeURIComponent(
          whatsappLines.join('\n')
        )}`;

        // ─── CONDOMÍNIOS CALCULATIONS ───
        const currentCondoSize = CONDO_SIZE_CONFIG[condoSize];
        const condoVatMultiplier = condoIncludeVat ? 1.23 : 1;
        const condoBaseMonthlyExclVat = currentCondoSize.prices[condoFrequency];
        const selectedCondoExtraObjects = CONDO_EXTRAS_CONFIG.filter((ext) =>
          condoSelectedExtras.includes(ext.id)
        );
        const condoExtrasMonthlyExclVat = selectedCondoExtraObjects.reduce(
          (acc, item) => acc + item.price,
          0
        );
        const condoTotalMonthlyExclVat = condoBaseMonthlyExclVat + condoExtrasMonthlyExclVat;
        const condoTotalMonthlyWithVat = Math.round(condoTotalMonthlyExclVat * 1.23 * 100) / 100;
        const condoDisplayedMonthlyTotal = condoIncludeVat
          ? condoTotalMonthlyWithVat
          : condoTotalMonthlyExclVat;
        const condoVatAmountMonthly = condoTotalMonthlyExclVat * 0.23;
        const safeFractions = Math.max(2, Math.min(60, condoFractions || 8));
        const condoCostPerFraction = condoDisplayedMonthlyTotal / safeFractions;

        const toggleCondoExtra = (id: CondoExtraId) => {
          setCondoSelectedExtras((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
          );
        };

        const condoExtrasListText =
          selectedCondoExtraObjects.length > 0
            ? selectedCondoExtraObjects.map((e) => getCondoExtraLabel(e.id)).join(', ')
            : t('Nenhum', 'None');

        const condoFormattedTotalNumber =
          condoDisplayedMonthlyTotal % 1 === 0
            ? `${condoDisplayedMonthlyTotal}`
            : condoDisplayedMonthlyTotal.toFixed(2).replace('.', ',');

        const condoWhatsappMessage = lang === 'en'
          ? `Hello! I simulated condominium cleaning on the Impporta website: Building with ${getCondoFloorsLabel(condoSize).toLowerCase()}, frequency ${condoFrequency}x/week, Extras: ${condoExtrasListText}, ${safeFractions} units. Estimated value: ${condoFormattedTotalNumber}€/month (${
              condoIncludeVat ? 'incl. VAT' : 'excl. VAT'
            } — ${formatEuro(condoCostPerFraction, true)}/unit). I would like to receive the formal proposal for our Condominium Assembly and book the free 1st demo cleaning.`
          : `Olá! Simulei a limpeza de condomínio no site da Impporta: Prédio de ${currentCondoSize.floorsLabel.toLowerCase()}, frequência ${condoFrequency}x/semana, Extras: ${condoExtrasListText}, ${safeFractions} frações. Valor estimado: ${condoFormattedTotalNumber}€/mês (${
              condoIncludeVat ? 'c/ IVA incluído' : 's/ IVA'
            } — ${formatEuro(condoCostPerFraction, true)}/fração). Gostaria de receber a proposta formal para apresentar ao condomínio e agendar a 1.ª limpeza de demonstração gratuita.`;

        const condoWhatsappUrl = `https://wa.me/351927322095?text=${encodeURIComponent(
          condoWhatsappMessage
        )}`;

        return (
          <section id="pricing" className="pricing-simulator" style={{ maxWidth: '1240px', margin: '56px auto', padding: '0 clamp(16px, 4vw, 48px)' }}>
            {/* Compact Header + Tab Switcher in a tight layout */}
            <div style={{ textAlign: 'center', marginBottom: '22px' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#efece4',
                color: '#111625',
                border: '1px solid #dcd7cc',
                padding: '4px 12px',
                borderRadius: '999px',
                fontSize: '0.72rem',
                fontWeight: '800',
                letterSpacing: '0.07em',
                textTransform: 'uppercase',
                marginBottom: '8px'
              }}>
                {t('SIMULADOR DE PREÇOS • LISBOA & CASCAIS', 'PRICING CALCULATOR • LISBON & CASCAIS')}
              </span>
              <h2 style={{
                fontSize: 'clamp(1.65rem, 3vw, 2.35rem)',
                fontWeight: '900',
                color: '#111625',
                margin: '4px 0 8px 0',
                letterSpacing: '-0.03em',
                textTransform: 'uppercase'
              }}>
                {simulatorActiveTab === 'al'
                  ? t('Simulador de Turnover & Estimativa Mensal', 'Turnover & Monthly Estimate Calculator')
                  : t('Simulador de Limpeza de Condomínios', 'Condominium Cleaning Calculator')}
              </h2>
              <p style={{ color: '#52525b', fontSize: '0.88rem', maxWidth: '620px', margin: '0 auto 16px auto', lineHeight: '1.45' }}>
                {simulatorActiveTab === 'al'
                  ? t(
                      'Preço fixo por intervenção com 1.ª Limpeza Gratuita incluída.',
                      'Fixed price per turnover with your 1st Cleaning Free included.'
                    )
                  : t(
                      'Avença mensal e quota por condómino com 1.ª Limpeza de Demonstração Gratuita.',
                      'Monthly retainer and cost per unit with a Free 1st Demo Cleaning.'
                    )}
              </p>

              {/* TOP TAB SWITCHER: Tab 1 (Alojamento Local) vs Tab 2 (Condomínios) */}
              <div style={{
                display: 'inline-flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '6px',
                background: '#efece4',
                padding: '5px',
                borderRadius: '999px',
                border: '1px solid #dcd7cc'
              }}>
                <button
                  type="button"
                  onClick={() => setSimulatorActiveTab('al')}
                  style={{
                    padding: '9px 20px',
                    borderRadius: '999px',
                    border: 'none',
                    background: simulatorActiveTab === 'al' ? '#111625' : 'transparent',
                    color: simulatorActiveTab === 'al' ? '#ffffff' : '#52525b',
                    fontWeight: '900',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '7px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Building2 size={15} color={simulatorActiveTab === 'al' ? '#9bb6f6' : 'currentColor'} />
                  {t('Alojamento Local (Airbnb)', 'Short-Term Rentals (Airbnb)')}
                </button>
                <button
                  type="button"
                  onClick={() => setSimulatorActiveTab('condo')}
                  style={{
                    padding: '9px 20px',
                    borderRadius: '999px',
                    border: 'none',
                    background: simulatorActiveTab === 'condo' ? '#111625' : 'transparent',
                    color: simulatorActiveTab === 'condo' ? '#ffffff' : '#52525b',
                    fontWeight: '900',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '7px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Users size={15} color={simulatorActiveTab === 'condo' ? '#9bb6f6' : 'currentColor'} />
                  {t('Condomínios (Partes Comuns)', 'Condominiums (Common Areas)')}
                </button>
              </div>
            </div>

            {simulatorActiveTab === 'al' ? (
              <>
                {/* COMPACT AL SIMULATOR CONTAINER (Fits in 1 Screen) */}
                <div className="pricing-simulator-grid" style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: '20px',
                  alignItems: 'stretch',
                  marginBottom: '18px'
                }}>
                  {/* LEFT PANEL: Compact Controls */}
                  <div className="pricing-controls" style={{
                    background: '#ffffff',
                    borderRadius: '22px',
                    border: '1px solid #e7e3da',
                    padding: '22px 20px',
                    boxShadow: '0 6px 24px rgba(17, 22, 37, 0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '16px'
                  }}>
                    {/* 1. Tipologia do Imóvel (Single-Row 5-Pill Grid) */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '4px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: '0.78rem', fontWeight: '800', color: '#111625', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          <span className="uipro-step-badge">01</span>
                          {t('Tipologia *', 'Property Size *')}
                        </span>
                        <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#1e40af', background: '#eff6ff', padding: '2px 8px', borderRadius: '999px' }}>
                          {getAlSublabel(simulatorTypology)}
                        </span>
                      </div>

                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
                        gap: '6px'
                      }}>
                        {(['T0', 'T1', 'T2', 'T3', 'T4'] as const).map((key) => {
                          const item = AL_PRICING_CONFIG[key];
                          const isSelected = simulatorTypology === key;
                          return (
                            <button
                              key={key}
                              type="button"
                              onClick={() => setSimulatorTypology(key)}
                              className="uipro-card-interactive"
                              style={{
                                padding: '10px 4px',
                                borderRadius: '12px',
                                border: isSelected ? '2px solid #111625' : '1px solid #e2e8f0',
                                background: isSelected ? '#111625' : '#f8fafc',
                                color: isSelected ? '#ffffff' : '#1e293b',
                                textAlign: 'center',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '3px',
                                cursor: 'pointer'
                              }}
                            >
                              <span style={{ fontSize: '0.84rem', fontWeight: '900' }}>
                                {key === 'T0' ? t('T0', 'T0') : key === 'T4' ? 'T4+' : key}
                              </span>
                              <span style={{
                                fontSize: '0.74rem',
                                fontWeight: '800',
                                color: isSelected ? '#9bb6f6' : '#475569'
                              }}>
                                {formatEuro(item.basePrice * vatMultiplier)}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 2. Serviço de Lavandaria (Compact 2-Column Segmented Toggle) */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: '0.78rem', fontWeight: '800', color: '#111625', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          <span className="uipro-step-badge">02</span>
                          {t('Lavandaria', 'Laundry')}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '600' }}>
                          {simulatorLaundry
                            ? t('Recolha + engomadoria hoteleira em rotação', 'Pickup + hotel ironing rotation')
                            : t('Usando roupa limpa do proprietário', "Using owner's clean linen")}
                        </span>
                      </div>

                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '8px'
                      }}>
                        <button
                          type="button"
                          onClick={() => setSimulatorLaundry(false)}
                          className={`uipro-card-interactive ${!simulatorLaundry ? 'pricing-option-active' : ''}`}
                          style={{
                            padding: '10px 12px',
                            borderRadius: '12px',
                            border: !simulatorLaundry ? '2px solid #111625' : '1px solid #e2e8f0',
                            background: !simulatorLaundry ? '#111625' : '#f8fafc',
                            color: !simulatorLaundry ? '#ffffff' : '#1e293b',
                            textAlign: 'left',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: '6px',
                            cursor: 'pointer'
                          }}
                        >
                          <div>
                            <div style={{ fontSize: '0.8rem', fontWeight: '800' }}>{t('Apenas Limpeza', 'Cleaning Only')}</div>
                            <div style={{ fontSize: '0.68rem', opacity: 0.8 }}>{t('Roupa local', 'Local linen')}</div>
                          </div>
                          <span style={{ fontSize: '0.76rem', fontWeight: '900', color: !simulatorLaundry ? '#9bb6f6' : '#475569' }}>
                            {formatEuro(currentPlan.basePrice * vatMultiplier)}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSimulatorLaundry(true)}
                          className={`uipro-card-interactive ${simulatorLaundry ? 'pricing-option-active' : ''}`}
                          style={{
                            padding: '10px 12px',
                            borderRadius: '12px',
                            border: simulatorLaundry ? '2px solid #111625' : '1px solid #e2e8f0',
                            background: simulatorLaundry ? '#111625' : '#f8fafc',
                            color: simulatorLaundry ? '#ffffff' : '#1e293b',
                            textAlign: 'left',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: '6px',
                            cursor: 'pointer'
                          }}
                        >
                          <div>
                            <div style={{ fontSize: '0.8rem', fontWeight: '800' }}>{t('+ Lavandaria', '+ Laundry')}</div>
                            <div style={{ fontSize: '0.68rem', opacity: 0.8 }}>{t('Rotação hoteleira', 'Hotel rotation')}</div>
                          </div>
                          <span style={{ fontSize: '0.76rem', fontWeight: '900', color: simulatorLaundry ? '#9bb6f6' : '#1e40af' }}>
                            +{formatEuro(currentPlan.laundryAddition * vatMultiplier)}
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* 3. Volume Mensal & Imóveis (Side-by-Side Steppers in 1 Compact Box) */}
                    <div style={{
                      padding: '14px 16px',
                      borderRadius: '16px',
                      background: '#faf9f6',
                      border: '1px solid #e7e3da',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: '0.78rem', fontWeight: '800', color: '#111625', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          <span className="uipro-step-badge">03</span>
                          {t('Volume & Desconto', 'Volume & Discount')}
                        </span>
                        {discountRate > 0 ? (
                          <span style={{
                            fontSize: '0.68rem',
                            fontWeight: '900',
                            background: '#dcfce7',
                            color: '#15803d',
                            padding: '2px 8px',
                            borderRadius: '999px'
                          }}>
                            -{Math.round(discountRate * 100)}% {t('Ativo', 'Active')}
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: '600' }}>
                            {t('8+ limpezas / 3+ imóveis = -5% | 15+ / 5+ = -10%', '8+ cleanings / 3+ props = -5% | 15+ / 5+ = -10%')}
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        {/* Stepper 1: Turnovers / month */}
                        <div style={{
                          background: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '12px',
                          padding: '8px 10px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          <div style={{ fontSize: '0.74rem', fontWeight: '700', color: '#334155', lineHeight: '1.2' }}>
                            {t('Turnovers / mês', 'Turnovers / mo')}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <button
                              type="button"
                              onClick={() => setSimulatorTurnoversPerMonth((p) => Math.max(1, p - 1))}
                              style={{ width: '24px', height: '24px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc', fontWeight: '800', cursor: 'pointer' }}
                            >
                              −
                            </button>
                            <span style={{ fontSize: '0.84rem', fontWeight: '900', color: '#111625', minWidth: '22px', textAlign: 'center' }}>
                              {simulatorTurnoversPerMonth}
                            </span>
                            <button
                              type="button"
                              onClick={() => setSimulatorTurnoversPerMonth((p) => Math.min(30, p + 1))}
                              style={{ width: '24px', height: '24px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc', fontWeight: '800', cursor: 'pointer' }}
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Stepper 2: Properties */}
                        <div style={{
                          background: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '12px',
                          padding: '8px 10px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          <div style={{ fontSize: '0.74rem', fontWeight: '700', color: '#334155', lineHeight: '1.2' }}>
                            {t('Nº Imóveis', 'Properties')}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <button
                              type="button"
                              onClick={() => setSimulatorPropertiesCount((p) => Math.max(1, p - 1))}
                              style={{ width: '24px', height: '24px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc', fontWeight: '800', cursor: 'pointer' }}
                            >
                              −
                            </button>
                            <span style={{ fontSize: '0.84rem', fontWeight: '900', color: '#111625', minWidth: '22px', textAlign: 'center' }}>
                              {simulatorPropertiesCount}
                            </span>
                            <button
                              type="button"
                              onClick={() => setSimulatorPropertiesCount((p) => Math.min(15, p + 1))}
                              style={{ width: '24px', height: '24px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc', fontWeight: '800', cursor: 'pointer' }}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 4. Visualização Fiscal (IVA 23%) — Single-line Segmented Row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: '0.76rem', fontWeight: '800', color: '#111625', textTransform: 'uppercase' }}>
                        <span className="uipro-step-badge">04</span>
                        {t('Exibição de IVA (23%)', 'VAT Display (23%)')}
                      </span>
                      <div style={{
                        display: 'inline-flex',
                        background: '#f1f5f9',
                        padding: '4px',
                        borderRadius: '10px',
                        border: '1px solid #e2e8f0',
                        gap: '4px'
                      }}>
                        <button
                          type="button"
                          onClick={() => setSimulatorIncludeVat(false)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '7px',
                            border: 'none',
                            background: !simulatorIncludeVat ? '#111625' : 'transparent',
                            color: !simulatorIncludeVat ? '#ffffff' : '#475569',
                            fontWeight: '800',
                            fontSize: '0.74rem',
                            cursor: 'pointer'
                          }}
                        >
                          {t('Sem IVA (Empresas)', 'Excl. VAT')}
                        </button>
                        <button
                          type="button"
                          onClick={() => setSimulatorIncludeVat(true)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '7px',
                            border: 'none',
                            background: simulatorIncludeVat ? '#111625' : 'transparent',
                            color: simulatorIncludeVat ? '#ffffff' : '#475569',
                            fontWeight: '800',
                            fontSize: '0.74rem',
                            cursor: 'pointer'
                          }}
                        >
                          {t('Com IVA (+23%)', 'Incl. VAT (+23%)')}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT PANEL: Compact Summary Card */}
                  <div
                    className="pricing-summary"
                    style={{
                      background: '#111625',
                      color: '#ffffff',
                      borderRadius: '22px',
                      padding: '22px 22px',
                      boxShadow: '0 14px 36px rgba(17, 22, 37, 0.22)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '14px',
                      border: '1px solid #1e293b'
                    }}
                  >
                    {/* Top Promo Strip */}
                    <div style={{
                      background: 'rgba(155, 182, 246, 0.14)',
                      border: '1px solid rgba(155, 182, 246, 0.38)',
                      borderRadius: '14px',
                      padding: '10px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '8px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '9px',
                          background: '#9bb6f6',
                          color: '#0f172a',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <Gift size={17} strokeWidth={2.3} />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.82rem', fontWeight: '900', color: '#ffffff', lineHeight: '1.2' }}>
                            {t('1.ª Limpeza de Teste: 0 € (Grátis)', '1st Trial Cleaning: 0 € (Free)')}
                          </div>
                          <div style={{ fontSize: '0.68rem', color: '#cbd5e1' }}>
                            {t('Creditada no 3.º serviço • Sem fidelização', 'Credited on 3rd service • No lock-in')}
                          </div>
                        </div>
                      </div>
                      <span style={{
                        background: 'rgba(34, 197, 94, 0.2)',
                        border: '1px solid rgba(74, 222, 128, 0.45)',
                        color: '#86efac',
                        padding: '3px 9px',
                        borderRadius: '999px',
                        fontSize: '0.72rem',
                        fontWeight: '900',
                        whiteSpace: 'nowrap'
                      }}>
                        {t('Poupança:', 'Savings:')} -{formatEuro(displayedPromoCredit)}
                      </span>
                    </div>

                    {/* Side-by-Side Turnover Price + Monthly Estimate */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '12px',
                      alignItems: 'stretch'
                    }}>
                      {/* Box A: Price per Turnover */}
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.09)',
                        borderRadius: '14px',
                        padding: '12px 14px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}>
                        <span style={{ fontSize: '0.68rem', fontWeight: '800', color: '#9bb6f6', textTransform: 'uppercase' }}>
                          {t('Por Turnover', 'Per Turnover')} ({simulatorTypology})
                        </span>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', margin: '4px 0' }}>
                          <span style={{ fontSize: '1.9rem', fontWeight: '900', color: '#ffffff', letterSpacing: '-0.03em' }}>
                            {formatEuro(displayedTurnoverTotal)}
                          </span>
                          {discountRate > 0 && (
                            <span style={{ fontSize: '0.82rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                              {formatEuro(displayedSubtotalTurnover)}
                            </span>
                          )}
                        </div>
                        <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                          {simulatorLaundry ? t('Limpeza + Lavandaria', 'Cleaning + Laundry') : t('Apenas Limpeza Base', 'Base Cleaning Only')}
                        </span>
                      </div>

                      {/* Box B: Monthly Estimate */}
                      <div style={{
                        background: 'rgba(155, 182, 246, 0.1)',
                        border: '1px solid rgba(155, 182, 246, 0.28)',
                        borderRadius: '14px',
                        padding: '12px 14px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}>
                        <span style={{ fontSize: '0.68rem', fontWeight: '800', color: '#9bb6f6', textTransform: 'uppercase' }}>
                          {t(`Estimativa (${simulatorTurnoversPerMonth}/mês)`, `Estimate (${simulatorTurnoversPerMonth}/mo)`)}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', margin: '4px 0' }}>
                          <span style={{ fontSize: '1.65rem', fontWeight: '900', color: '#ffffff' }}>
                            {formatEuro(displayedMonthlyTotal)}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{t('/mês', '/mo')}</span>
                        </div>
                        <span style={{ fontSize: '0.68rem', color: '#86efac', fontWeight: '800' }}>
                          {t('1.º mês c/ oferta:', '1st mo w/ promo:')} {formatEuro(displayedFirstMonthWithPromo)}
                        </span>
                      </div>
                    </div>

                    {/* Compact 2x2 Trust Pills */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '6px 10px',
                      fontSize: '0.74rem',
                      color: '#cbd5e1',
                      paddingTop: '4px'
                    }}>
                      {[
                        t('Produtos e máquinas incluídos', 'Products & equipment included'),
                        t('Checklist 42 pontos (AirCover)', '42-point checklist (AirCover)'),
                        t('10–15 fotos no WhatsApp', '10–15 WhatsApp photos'),
                        t('Sem fidelização contratual', 'No lock-in contract')
                      ].map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <CheckCircle2 size={14} color="#4ade80" style={{ flexShrink: 0 }} />
                          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA + VAT Note */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="uipro-btn-whatsapp"
                        style={{
                          width: '100%',
                          padding: '13px 18px',
                          borderRadius: '999px',
                          border: 'none',
                          background: '#25D366',
                          color: '#052e16',
                          fontWeight: '900',
                          fontSize: '0.88rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          boxShadow: '0 6px 18px rgba(37, 211, 102, 0.3)',
                          textDecoration: 'none',
                          boxSizing: 'border-box'
                        }}
                      >
                        <MessageSquare size={17} fill="#052e16" color="#052e16" />
                        {t('Agendar a Minha 1.ª Limpeza Gratuita', 'Book My Free 1st Cleaning')}
                        <ArrowRight size={16} />
                      </a>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px', fontSize: '0.68rem', color: '#94a3b8' }}>
                        <span>
                          {simulatorIncludeVat
                            ? t('* Valores c/ IVA 23% incluído.', '* Prices include 23% VAT.')
                            : t('* Acresce IVA à taxa legal (23%).', '* Plus 23% legal VAT.')}
                        </span>
                        <button
                          type="button"
                          onClick={() => setTrialModalOpen(true)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#9bb6f6',
                            fontWeight: '700',
                            fontSize: '0.72rem',
                            cursor: 'pointer',
                            textDecoration: 'underline',
                            padding: 0
                          }}
                        >
                          {t('Ou pedir por formulário →', 'Or via web form →')}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* COLLAPSIBLE OFFICIAL PRICING TABLE TOGGLE */}
                <div style={{ textAlign: 'center' }}>
                  <button
                    type="button"
                    onClick={() => setShowFullPricingTable((prev) => !prev)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 18px',
                      borderRadius: '999px',
                      border: '1px solid #dcd7cc',
                      background: '#ffffff',
                      color: '#111625',
                      fontSize: '0.78rem',
                      fontWeight: '800',
                      cursor: 'pointer'
                    }}
                  >
                    <span>
                      {showFullPricingTable
                        ? t('Ocultar Tabela Completa de Preços', 'Hide Full Pricing Table')
                        : t('Ver Tabela Completa de Preços (T0 a T4)', 'View Full Pricing Table (T0 to T4)')}
                    </span>
                    <ChevronDown
                      size={15}
                      style={{
                        transform: showFullPricingTable ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease'
                      }}
                    />
                  </button>
                </div>

                {showFullPricingTable && (
                  <div style={{
                    marginTop: '14px',
                    background: '#ffffff',
                    borderRadius: '20px',
                    border: '1px solid #e7e3da',
                    padding: '20px 24px',
                    boxShadow: '0 4px 20px rgba(17, 22, 37, 0.02)'
                  }}>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                        <thead>
                          <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#475569', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            <th style={{ padding: '10px 12px' }}>{t('Tipologia', 'Property Size')}</th>
                            <th style={{ padding: '10px 12px' }}>{t('WCs Base', 'Base WCs')}</th>
                            <th style={{ padding: '10px 12px' }}>{t('Limpeza Base', 'Base Cleaning')}</th>
                            <th style={{ padding: '10px 12px' }}>{t('Lavandaria', 'Laundry')}</th>
                            <th style={{ padding: '10px 12px' }}>{t('Total c/ Lavandaria', 'Total w/ Laundry')}</th>
                            <th style={{ padding: '10px 12px', textAlign: 'right' }}>{t('Oferta 1.ª Limpeza', '1st Cleaning Offer')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(['T0', 'T1', 'T2', 'T3', 'T4'] as const).map((key, i) => {
                            const item = AL_PRICING_CONFIG[key];
                            const withL = item.basePrice + item.laundryAddition;
                            const isSelected = simulatorTypology === key;
                            const isCapped = key === 'T3' || key === 'T4';
                            return (
                              <tr
                                key={key}
                                onClick={() => setSimulatorTypology(key)}
                                className="uipro-table-row"
                                style={{
                                  borderBottom: '1px solid #f1f5f9',
                                  background: isSelected ? 'rgba(155, 182, 246, 0.16)' : i % 2 === 0 ? '#ffffff' : '#fafaf9'
                                }}
                              >
                                <td style={{ padding: '10px 12px', fontWeight: '800', color: '#111625' }}>
                                  {getAlLabel(key)}
                                </td>
                                <td style={{ padding: '10px 12px', color: '#475569' }}>
                                  {t(`Até ${item.includedBathrooms} WC`, `Up to ${item.includedBathrooms} WC`)}
                                </td>
                                <td style={{ padding: '10px 12px', fontWeight: '800', color: '#111625' }}>
                                  {formatEuro(item.basePrice * vatMultiplier)}
                                </td>
                                <td style={{ padding: '10px 12px', color: '#475569', fontWeight: '700' }}>
                                  +{formatEuro(item.laundryAddition * vatMultiplier)}
                                </td>
                                <td style={{ padding: '10px 12px', fontWeight: '900', color: '#2563eb' }}>
                                  {formatEuro(withL * vatMultiplier)}
                                </td>
                                <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                                  <span style={{
                                    display: 'inline-block',
                                    background: '#dcfce7',
                                    color: '#15803d',
                                    fontSize: '0.7rem',
                                    fontWeight: '900',
                                    padding: '2px 8px',
                                    borderRadius: '999px'
                                  }}>
                                    {isCapped
                                      ? t(`Crédito -${formatEuro(58 * vatMultiplier)}`, `Credit -${formatEuro(58 * vatMultiplier)}`)
                                      : t('0 € Grátis', '0 € Free')}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* COMPACT CONDOMÍNIOS SIMULATOR CONTAINER (Fits in 1 Screen) */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: '20px',
                  alignItems: 'stretch',
                  marginBottom: '18px'
                }}>
                  {/* LEFT PANEL: Compact Condominium Controls */}
                  <div style={{
                    background: '#ffffff',
                    borderRadius: '22px',
                    border: '1px solid #e7e3da',
                    padding: '22px 20px',
                    boxShadow: '0 6px 24px rgba(17, 22, 37, 0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '16px'
                  }}>
                    {/* 1. Dimensão do Prédio (5-Pill Grid) */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '4px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: '0.78rem', fontWeight: '800', color: '#111625', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          <span className="uipro-step-badge">01</span>
                          {t('Pisos do Prédio *', 'Building Floors *')}
                        </span>
                        <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#1e40af', background: '#eff6ff', padding: '2px 8px', borderRadius: '999px' }}>
                          {getCondoDuration(condoSize)}
                        </span>
                      </div>

                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
                        gap: '6px'
                      }}>
                        {(['up_to_3', '4_to_5', '6_to_8', '9_to_12', '13_to_15'] as const).map((sizeKey) => {
                          const item = CONDO_SIZE_CONFIG[sizeKey];
                          const isSelected = condoSize === sizeKey;
                          const shortLabel =
                            sizeKey === 'up_to_3' ? t('≤3 Pisos', '≤3 Fl') :
                            sizeKey === '4_to_5' ? t('4–5 Pisos', '4–5 Fl') :
                            sizeKey === '6_to_8' ? t('6–8 Pisos', '6–8 Fl') :
                            sizeKey === '9_to_12' ? t('9–12 Pisos', '9–12 Fl') :
                            t('13–15 Pisos', '13–15 Fl');
                          return (
                            <button
                              key={sizeKey}
                              type="button"
                              onClick={() => setCondoSize(sizeKey)}
                              className="uipro-card-interactive"
                              style={{
                                padding: '10px 4px',
                                borderRadius: '12px',
                                border: isSelected ? '2px solid #111625' : '1px solid #e2e8f0',
                                background: isSelected ? '#111625' : '#f8fafc',
                                color: isSelected ? '#ffffff' : '#1e293b',
                                textAlign: 'center',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '3px',
                                cursor: 'pointer'
                              }}
                            >
                              <span style={{ fontSize: '0.76rem', fontWeight: '900' }}>{shortLabel}</span>
                              <span style={{ fontSize: '0.7rem', fontWeight: '800', color: isSelected ? '#9bb6f6' : '#475569' }}>
                                {formatEuro(item.prices[condoFrequency] * condoVatMultiplier)}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 2. Frequência Semanal (3-Column Compact Row) */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: '0.78rem', fontWeight: '800', color: '#111625', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          <span className="uipro-step-badge">02</span>
                          {t('Frequência Semanal', 'Weekly Frequency')}
                        </span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                        {([
                          { freq: 1 as const, label: t('1x / semana', '1x / week'), sub: t('4–5 visitas', '4–5 visits') },
                          { freq: 2 as const, label: t('2x / semana ★', '2x / week ★'), sub: t('Mais Popular', 'Most Popular') },
                          { freq: 3 as const, label: t('3x / semana', '3x / week'), sub: t('12–13 visitas', '12–13 visits') }
                        ]).map((opt) => {
                          const isSelected = condoFrequency === opt.freq;
                          return (
                            <button
                              key={opt.freq}
                              type="button"
                              onClick={() => setCondoFrequency(opt.freq)}
                              className="uipro-card-interactive"
                              style={{
                                padding: '9px 6px',
                                borderRadius: '12px',
                                border: isSelected ? '2px solid #111625' : '1px solid #e2e8f0',
                                background: isSelected ? '#111625' : '#f8fafc',
                                color: isSelected ? '#ffffff' : '#1e293b',
                                textAlign: 'center',
                                cursor: 'pointer'
                              }}
                            >
                              <div style={{ fontSize: '0.8rem', fontWeight: '900' }}>{opt.label}</div>
                              <div style={{ fontSize: '0.66rem', color: isSelected ? '#9bb6f6' : '#64748b', fontWeight: '600' }}>{opt.sub}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 3. Extras Mensais do Condomínio (Compact Chips) */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: '0.78rem', fontWeight: '800', color: '#111625', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          <span className="uipro-step-badge">03</span>
                          {t('Extras Opcionais', 'Optional Add-ons')}
                        </span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {CONDO_EXTRAS_CONFIG.map((extra) => {
                          const isChecked = condoSelectedExtras.includes(extra.id);
                          return (
                            <div
                              key={extra.id}
                              onClick={() => toggleCondoExtra(extra.id)}
                              className="uipro-card-interactive"
                              style={{
                                padding: '8px 12px',
                                borderRadius: '11px',
                                border: isChecked ? '2px solid #111625' : '1px solid #e2e8f0',
                                background: isChecked ? '#faf9f6' : '#ffffff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '8px',
                                cursor: 'pointer'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{
                                  width: '16px',
                                  height: '16px',
                                  borderRadius: '4px',
                                  border: isChecked ? 'none' : '2px solid #cbd5e1',
                                  background: isChecked ? '#111625' : '#ffffff',
                                  color: '#ffffff',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  flexShrink: 0
                                }}>
                                  {isChecked && <Check size={11} strokeWidth={3} />}
                                </div>
                                <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#111625' }}>
                                  {getCondoExtraLabel(extra.id)}
                                </span>
                              </div>
                              <span style={{ fontSize: '0.74rem', fontWeight: '800', color: '#1e40af', whiteSpace: 'nowrap' }}>
                                +{formatEuro(extra.price * condoVatMultiplier)}/{t('mês', 'mo')}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* 4. Frações & IVA (Side-by-Side Row) */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '10px',
                      paddingTop: '4px',
                      borderTop: '1px solid #f1f5f9'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: '0.76rem', fontWeight: '800', color: '#111625', textTransform: 'uppercase' }}>
                          <span className="uipro-step-badge">04</span>
                          {t('Frações:', 'Units:')}
                        </span>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#f8fafc', padding: '3px 6px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                          <button
                            type="button"
                            onClick={() => setCondoFractions((prev) => Math.max(2, prev - 1))}
                            style={{ width: '22px', height: '22px', borderRadius: '5px', border: 'none', background: '#ffffff', fontWeight: '900', cursor: 'pointer' }}
                          >
                            −
                          </button>
                          <span style={{ fontSize: '0.82rem', fontWeight: '900', minWidth: '24px', textAlign: 'center' }}>{safeFractions}</span>
                          <button
                            type="button"
                            onClick={() => setCondoFractions((prev) => Math.min(60, prev + 1))}
                            style={{ width: '22px', height: '22px', borderRadius: '5px', border: 'none', background: '#ffffff', fontWeight: '900', cursor: 'pointer' }}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div style={{
                        display: 'inline-flex',
                        background: '#f1f5f9',
                        padding: '3px',
                        borderRadius: '9px',
                        border: '1px solid #e2e8f0',
                        gap: '3px'
                      }}>
                        <button
                          type="button"
                          onClick={() => setCondoIncludeVat(true)}
                          style={{
                            padding: '5px 10px',
                            borderRadius: '6px',
                            border: 'none',
                            background: condoIncludeVat ? '#111625' : 'transparent',
                            color: condoIncludeVat ? '#ffffff' : '#475569',
                            fontWeight: '800',
                            fontSize: '0.72rem',
                            cursor: 'pointer'
                          }}
                        >
                          {t('C/ IVA (23%)', 'Incl. VAT')}
                        </button>
                        <button
                          type="button"
                          onClick={() => setCondoIncludeVat(false)}
                          style={{
                            padding: '5px 10px',
                            borderRadius: '6px',
                            border: 'none',
                            background: !condoIncludeVat ? '#111625' : 'transparent',
                            color: !condoIncludeVat ? '#ffffff' : '#475569',
                            fontWeight: '800',
                            fontSize: '0.72rem',
                            cursor: 'pointer'
                          }}
                        >
                          {t('Sem IVA', 'Excl. VAT')}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT PANEL: Compact Condominium Summary */}
                  <div
                    style={{
                      background: '#111625',
                      color: '#ffffff',
                      borderRadius: '22px',
                      padding: '22px 22px',
                      boxShadow: '0 14px 36px rgba(17, 22, 37, 0.22)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '14px',
                      border: '1px solid #1e293b'
                    }}
                  >
                    {/* Top Promo Strip */}
                    <div style={{
                      background: 'rgba(155, 182, 246, 0.14)',
                      border: '1px solid rgba(155, 182, 246, 0.38)',
                      borderRadius: '14px',
                      padding: '10px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '9px',
                        background: '#9bb6f6',
                        color: '#0f172a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <Gift size={17} strokeWidth={2.3} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.82rem', fontWeight: '900', color: '#ffffff' }}>
                          {t('1.ª Limpeza de Demonstração Gratuita', '1st Demo Cleaning Free')}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: '#cbd5e1' }}>
                          {t('Teste a qualidade sem compromisso antes da Assembleia', 'Test our quality with no obligation before the HOA meeting')}
                        </div>
                      </div>
                    </div>

                    {/* Side-by-Side Monthly Price + Per-Fraction Cost */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '12px',
                      alignItems: 'stretch'
                    }}>
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.09)',
                        borderRadius: '14px',
                        padding: '12px 14px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}>
                        <span style={{ fontSize: '0.68rem', fontWeight: '800', color: '#9bb6f6', textTransform: 'uppercase' }}>
                          {t('Avença Mensal', 'Monthly Plan')} ({condoFrequency}x/{t('sem', 'wk')})
                        </span>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', margin: '4px 0' }}>
                          <span style={{ fontSize: '1.85rem', fontWeight: '900', color: '#ffffff', letterSpacing: '-0.03em' }}>
                            {formatEuro(condoDisplayedMonthlyTotal)}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>/{t('mês', 'mo')}</span>
                        </div>
                        <span style={{ fontSize: '0.68rem', color: condoIncludeVat ? '#86efac' : '#fbbf24' }}>
                          {condoIncludeVat ? t('IVA (23%) incluído', '23% VAT included') : t('Valor s/ IVA (+23%)', 'Excl. VAT (+23%)')}
                        </span>
                      </div>

                      <div style={{
                        background: 'rgba(34, 197, 94, 0.14)',
                        border: '1px solid rgba(74, 222, 128, 0.4)',
                        borderRadius: '14px',
                        padding: '12px 14px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}>
                        <span style={{ fontSize: '0.68rem', fontWeight: '800', color: '#86efac', textTransform: 'uppercase' }}>
                          {t(`Por Condómino (${safeFractions} frações)`, `Per Unit (${safeFractions} units)`)}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', margin: '4px 0' }}>
                          <span style={{ fontSize: '1.65rem', fontWeight: '900', color: '#ffffff' }}>
                            {formatEuro(condoCostPerFraction, true)}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>/{t('mês', 'mo')}</span>
                        </div>
                        <span style={{ fontSize: '0.68rem', color: '#f1f5f9', fontWeight: '700' }}>
                          {t('Pronto para Assembleia', 'Ready for HOA Meeting')}
                        </span>
                      </div>
                    </div>

                    {/* Compact 2x2 Guarantees */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '6px 10px',
                      fontSize: '0.74rem',
                      color: '#cbd5e1'
                    }}>
                      {[
                        t('Produtos e máquinas incluídos', 'Products & equipment included'),
                        t('Relatório fotográfico WhatsApp', 'WhatsApp photo report'),
                        t('Substituição em dias de baixa', 'Sick-day backup guaranteed'),
                        t('Sem contrato de fidelização', 'No lock-in contract')
                      ].map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <CheckCircle2 size={14} color="#4ade80" style={{ flexShrink: 0 }} />
                          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item}</span>
                        </div>
                      ))}
                    </div>

                    {/* WhatsApp CTA */}
                    <div>
                      <a
                        href={condoWhatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="uipro-btn-whatsapp"
                        style={{
                          width: '100%',
                          padding: '13px 18px',
                          borderRadius: '999px',
                          border: 'none',
                          background: '#25D366',
                          color: '#052e16',
                          fontWeight: '900',
                          fontSize: '0.86rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          boxShadow: '0 6px 18px rgba(37, 211, 102, 0.3)',
                          textDecoration: 'none',
                          boxSizing: 'border-box',
                          textAlign: 'center'
                        }}
                      >
                        <MessageSquare size={17} fill="#052e16" color="#052e16" style={{ flexShrink: 0 }} />
                        <span>{t('Pedir Proposta Formal & Agendar Limpeza Gratuita', 'Request Formal Proposal & Book Free Cleaning')}</span>
                        <ArrowRight size={16} style={{ flexShrink: 0 }} />
                      </a>
                    </div>
                  </div>
                </div>

                {/* COLLAPSIBLE OFFICIAL CONDO PRICING TABLE */}
                <div style={{ textAlign: 'center' }}>
                  <button
                    type="button"
                    onClick={() => setShowFullPricingTable((prev) => !prev)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 18px',
                      borderRadius: '999px',
                      border: '1px solid #dcd7cc',
                      background: '#ffffff',
                      color: '#111625',
                      fontSize: '0.78rem',
                      fontWeight: '800',
                      cursor: 'pointer'
                    }}
                  >
                    <span>
                      {showFullPricingTable
                        ? t('Ocultar Tabela de Condomínios', 'Hide Condominium Table')
                        : t('Ver Tabela Completa de Preços de Condomínios', 'View Full Condominium Pricing Table')}
                    </span>
                    <ChevronDown
                      size={15}
                      style={{
                        transform: showFullPricingTable ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease'
                      }}
                    />
                  </button>
                </div>

                {showFullPricingTable && (
                  <div style={{
                    marginTop: '14px',
                    background: '#ffffff',
                    borderRadius: '20px',
                    border: '1px solid #e7e3da',
                    padding: '20px 24px',
                    boxShadow: '0 4px 20px rgba(17, 22, 37, 0.02)'
                  }}>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                        <thead>
                          <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#475569', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            <th style={{ padding: '10px 12px' }}>{t('Dimensão do Prédio', 'Building Size')}</th>
                            <th style={{ padding: '10px 12px' }}>{t('Tempo / Visita', 'Time / Visit')}</th>
                            <th style={{ padding: '10px 12px' }}>{t('1x / Semana', '1x / Week')}</th>
                            <th style={{ padding: '10px 12px' }}>{t('2x / Semana (Popular)', '2x / Week (Popular)')}</th>
                            <th style={{ padding: '10px 12px' }}>{t('3x / Semana', '3x / Week')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(['up_to_3', '4_to_5', '6_to_8', '9_to_12', '13_to_15'] as const).map((sizeKey, i) => {
                            const row = CONDO_SIZE_CONFIG[sizeKey];
                            const isSelected = condoSize === sizeKey;
                            return (
                              <tr
                                key={sizeKey}
                                onClick={() => setCondoSize(sizeKey)}
                                className="uipro-table-row"
                                style={{
                                  borderBottom: '1px solid #f1f5f9',
                                  background: isSelected ? 'rgba(155, 182, 246, 0.16)' : i % 2 === 0 ? '#ffffff' : '#fafaf9'
                                }}
                              >
                                <td style={{ padding: '10px 12px', fontWeight: '800', color: '#111625' }}>
                                  {getCondoTitle(sizeKey)}
                                </td>
                                <td style={{ padding: '10px 12px', color: '#475569' }}>
                                  {getCondoDuration(sizeKey)}
                                </td>
                                {([1, 2, 3] as const).map((freq) => {
                                  const baseVal = row.prices[freq];
                                  const withVatVal = baseVal * 1.23;
                                  const isActiveCell = isSelected && condoFrequency === freq;
                                  return (
                                    <td
                                      key={freq}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setCondoSize(sizeKey);
                                        setCondoFrequency(freq);
                                      }}
                                      style={{
                                        padding: '10px 12px',
                                        fontWeight: isActiveCell || freq === 2 ? '900' : '700',
                                        color: isActiveCell ? '#2563eb' : '#111625'
                                      }}
                                    >
                                      {condoIncludeVat
                                        ? `${formatEuro(withVatVal, true)}/${t('mês', 'mo')}`
                                        : `${formatEuro(baseVal)}/${t('mês', 'mo')}`}
                                    </td>
                                  );
                                })}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            )}
          </section>
        );
      })()}

      <section id="addons" className="addon-services-section">
        <div className="addon-services-header">
          <span className="addon-eyebrow">SERVIÇOS EXTRA · SOB ORÇAMENTO</span>
          <h2>Uma só equipa para cuidar de tudo.</h2>
          <p>Adicione serviços exteriores e de manutenção à sua operação, com profissionais selecionados pela Impporta e uma margem clara em cada intervenção.</p>
        </div>
        <div className="addon-services-grid">
          {[
            { icon: '✦', title: 'Jardinagem', detail: 'Manutenção de jardins pequenos e médios', price: 'desde 75 € / visita' },
            { icon: '◌', title: 'Limpeza de piscinas', detail: 'Limpeza, análise e manutenção de rotina', price: 'desde 120 € / visita' },
            { icon: '▣', title: 'Vidros exteriores', detail: 'Vidros e caixilharia acessíveis', price: 'desde 65 € / serviço' },
            { icon: '＋', title: 'Pintura', detail: 'Pintura interior com preparação standard', price: 'desde 14 € / m²' },
          ].map((service) => (
            <article className="addon-service-card" key={service.title}>
              <div className="addon-service-icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.detail}</p>
              <strong>{service.price}</strong>
            </article>
          ))}
        </div>
        <p className="addon-disclaimer">Valores indicativos, sem IVA. O preço final depende do acesso, área, estado do local, materiais e deslocação. Trabalhos em altura, recuperação de piscinas e pintura com reparações são sempre orçamentados.</p>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6.1 TEAM SECTION: TENHA SEMPRE A MESMA PESSOA (SPARKLES INSPIRATION)
          ───────────────────────────────────────────────────────────── */}
      <section id="team" style={{ maxWidth: '1240px', margin: '20px auto 80px auto', padding: '0 clamp(24px, 5vw, 56px)' }}>
        <div style={{
          background: '#ffffff',
          borderRadius: '32px',
          padding: '48px 36px',
          border: '1px solid #e7e3da',
          boxShadow: '0 8px 32px rgba(17, 22, 37, 0.03)'
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '24px', marginBottom: '36px' }}>
            <div>
              <span style={{
                display: 'inline-block',
                background: '#efece4',
                color: '#111625',
                border: '1px solid #dcd7cc',
                padding: '4px 14px',
                borderRadius: '999px',
                fontSize: '0.75rem',
                fontWeight: '800',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '12px'
              }}>
                {t('EQUIPA FIXA', 'DEDICATED TEAM')}
              </span>
              <h2 style={{
                fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
                fontWeight: '900',
                color: '#111625',
                letterSpacing: '-0.03em',
                textTransform: 'uppercase',
                margin: 0
              }}>
                {t('Tenha sempre a mesma pessoa em cada visita', 'Always have the same professional at every visit')}
              </h2>
            </div>
            <p style={{ maxWidth: '440px', color: '#52525b', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
              {t(
                'Os nossos profissionais são rigorosamente verificados, formados com protocolo hoteleiro e segurados. Saberá sempre quem está a cuidar do seu imóvel.',
                'Our professionals are thoroughly vetted, trained in hotel-grade protocols, and fully insured. You will always know who is taking care of your property.'
              )}
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px'
          }}>
            {[
              {
                name: t('Preparação Hoteleira & Têxteis', 'Hotel Preparation & Linens'),
                role: t('Profissional Fixo Alocado', 'Dedicated Assigned Professional'),
                reviews: t('Cama & Toalhas de Hotel', 'Hotel Bed & Towels'),
                img: '/team-turnover.jpg'
              },
              {
                name: t('Higienização & Desinfeção', 'Sanitization & Disinfection'),
                role: t('Protocolo de Cozinha & Sanitários', 'Kitchen & Bathroom Protocol'),
                reviews: t('Produtos Profissionais', 'Professional Products'),
                img: '/team-higienizacao.jpg'
              },
              {
                name: t('Auditoria & Registo Visual', 'Audit & Visual Reporting'),
                role: t('Checklist de 42 Pontos', '42-Point Checklist'),
                reviews: t('10–15 Fotos via WhatsApp', '10–15 WhatsApp Photos'),
                img: '/team-inspecao.jpg'
              }
            ].map((member, i) => (
              <div
                key={i}
                style={{
                  position: 'relative',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  aspectRatio: '3/4',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.06)'
                }}
              >
                <img
                  src={member.img}
                  alt={member.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(17, 22, 37, 0.85) 0%, rgba(17, 22, 37, 0) 50%)'
                }} />
                
                {/* Gold Star Pin */}
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'rgba(255, 255, 255, 0.95)',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#f59e0b',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }}>
                  <Star size={16} fill="#f59e0b" color="#f59e0b" />
                </div>

                {/* Name Tag Badge at Bottom */}
                <div style={{
                  position: 'absolute',
                  bottom: '18px',
                  left: '18px',
                  right: '18px',
                  background: 'rgba(17, 22, 37, 0.85)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '16px',
                  padding: '12px 16px',
                  color: '#ffffff'
                }}>
                  <div style={{ fontWeight: '800', fontSize: '0.95rem' }}>{member.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#9bb6f6', fontWeight: '700', marginTop: '2px' }}>
                    {member.role} • {member.reviews}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6.5 HOW A TURNOVER WORKS IN 3 STEPS (COMO FUNCIONA)
          ───────────────────────────────────────────────────────────── */}
      <section style={{ background: '#ffffff', borderTop: '1px solid #e7e3da', borderBottom: '1px solid #e7e3da', padding: '72px clamp(24px, 6vw, 80px)' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span style={{
              display: 'inline-block',
              background: '#e8eefc',
              color: '#1e3a8a',
              border: '1px solid #c7d7fd',
              padding: '5px 16px',
              borderRadius: '999px',
              fontSize: '0.75rem',
              fontWeight: '800',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '12px'
            }}>
              {t('PROTOCOLO OPERACIONAL IMPPORTA AL', 'IMPPORTA AL OPERATIONAL PROTOCOL')}
            </span>
            <h2 style={{ fontSize: 'clamp(1.85rem, 3.2vw, 2.5rem)', fontWeight: '900', color: '#111625', margin: '8px 0', textTransform: 'uppercase', letterSpacing: '-0.025em' }}>
              {t('Como funciona um turnover em 3 passos', 'How a turnover works in 3 steps')}
            </h2>
            <p style={{ color: '#52525b', fontSize: '0.96rem', maxWidth: '660px', margin: '0 auto', lineHeight: '1.6' }}>
              {t(
                'Da saída do hóspede anterior até à confirmação por WhatsApp: uma operação cronometrada entre as 11h00 e as 15h00 para garantir 5 estrelas no próximo check-in.',
                'From the previous guest check-out to WhatsApp confirmation: a timed operation between 11:00 AM and 3:00 PM to guarantee 5 stars at the next check-in.'
              )}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px' }}>
            {[
              {
                step: '01',
                time: t('11:00 • Entrada & Auditoria', '11:00 • Entry & Audit'),
                title: t('Check-out & Inspeção de Danos', 'Check-out & Damage Inspection'),
                desc: t(
                  'Entrada imediata após a saída do hóspede com inspeção de 15 minutos ao estado do imóvel, registo de eventuais danos ou objetos esquecidos e verificação de stock de consumíveis.',
                  'Immediate entry after guest check-out with a 15-minute property inspection, logging any damages or left-behind items, and checking amenity supplies.'
                ),
                badge: t('Checklist de 42 Pontos', '42-Point Checklist'),
                icon: FileCheck
              },
              {
                step: '02',
                time: t('11:15 – 14:15 • Intervenção Técnica', '11:15 – 14:15 • Technical Cleaning'),
                title: t('Limpeza Hoteleira + Lavandaria', 'Hotel Cleaning + Laundry'),
                desc: t(
                  'Higienização profunda de cozinha, casas de banho, quartos e sala com produtos e equipamentos profissionais incluídos, mais substituição de roupa de cama e toalhas engomadas.',
                  'Deep sanitization of kitchen, bathrooms, bedrooms, and living areas with professional products and equipment included, plus crisp ironed bed linen and towel replacement.'
                ),
                badge: t('Produtos & Equipamentos Incluídos', 'Products & Equipment Included'),
                icon: Shirt
              },
              {
                step: '03',
                time: t('Antes das 15:00 • Validação Final', 'Before 15:00 • Final Validation'),
                title: t('10–15 Fotos no WhatsApp & Pronto para Check-in', '10–15 WhatsApp Photos & Check-in Ready'),
                desc: t(
                  'Envio de 10 a 15 fotografias datadas de todas as divisões diretamente por WhatsApp após cada serviço, confirmando que o alojamento está 100% pronto para o novo hóspede.',
                  'Delivery of 10 to 15 timestamped photos of every room directly via WhatsApp after each service, confirming the property is 100% ready for the next guest.'
                ),
                badge: t('Relatório Fotográfico Obrigatório', 'Mandatory Photo Report'),
                icon: Camera
              }
            ].map((item) => {
              const StepIcon = item.icon;
              return (
                <div
                  key={item.step}
                  style={{
                    background: '#f7f4ee',
                    border: '1px solid #e7e3da',
                    borderRadius: '24px',
                    padding: '32px 28px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '14px',
                        background: '#111625',
                        color: '#f7f4ee',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <StepIcon size={22} />
                      </div>
                      <span style={{
                        fontSize: '2rem',
                        fontWeight: '900',
                        color: '#dcd7cc',
                        letterSpacing: '-0.04em',
                        lineHeight: 1
                      }}>
                        {item.step}
                      </span>
                    </div>

                    <div style={{
                      fontSize: '0.74rem',
                      fontWeight: '800',
                      color: '#2563eb',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      marginBottom: '6px'
                    }}>
                      {item.time}
                    </div>

                    <h3 style={{ fontSize: '1.18rem', fontWeight: '900', color: '#111625', margin: '0 0 10px 0', lineHeight: '1.3' }}>
                      {item.title}
                    </h3>

                    <p style={{ fontSize: '0.9rem', color: '#52525b', lineHeight: '1.6', margin: '0 0 20px 0' }}>
                      {item.desc}
                    </p>
                  </div>

                  <div style={{
                    paddingTop: '14px',
                    borderTop: '1px solid #e7e3da',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '8px',
                    fontSize: '0.8rem',
                    fontWeight: '800',
                    color: '#111625'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckCircle2 size={15} color="#16a34a" />
                      <span>{item.badge}</span>
                    </div>
                    {item.step === '01' && (
                      <button
                        type="button"
                        onClick={() => setChecklistModalOpen(true)}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          background: '#ffffff',
                          color: '#2563eb',
                          fontSize: '0.74rem',
                          fontWeight: '800',
                          cursor: 'pointer'
                        }}
                      >
                        {t('Ver 42 Pontos', 'View 42 Points')} →
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6.6 FREQUENTLY ASKED QUESTIONS (Radix Accordion)
          ───────────────────────────────────────────────────────────── */}
      <section style={{ maxWidth: '960px', margin: '70px auto', padding: '0 clamp(24px, 5vw, 56px)' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span style={{
            display: 'inline-block',
            background: '#efece4',
            color: '#111625',
            border: '1px solid #dcd7cc',
            padding: '4px 14px',
            borderRadius: '999px',
            fontSize: '0.75rem',
            fontWeight: '800',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '12px'
          }}>
            {t('DÚVIDAS FREQUENTES', 'FAQ')}
          </span>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: '900', color: '#111625', margin: '8px 0', textTransform: 'uppercase' }}>
            {t('Perguntas Frequentes', 'Frequently Asked Questions')}
          </h2>
          <p style={{ color: '#52525b', fontSize: '0.92rem' }}>
            {t('Tudo o que precisa de saber sobre o funcionamento da Impporta', 'Everything you need to know about how Impporta works')}
          </p>
        </div>

        <Accordion.Root type="single" defaultValue="faq-0" collapsible style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            {
              id: 'faq-0',
              q: t(
                'Como funciona o relatório fotográfico obrigatório de Antes e Depois?',
                'How does the mandatory Before & After photo report work?'
              ),
              a: t(
                'Antes de iniciar a intervenção, o profissional faz check-in no telemóvel e regista fotos de todas as divisões (quartos, cozinha, casa de banho) para auditar eventuais danos ou estado do hóspede anterior. No final, submete fotos do resultado limpo. O proprietário recebe notificação imediata com acesso às fotografias.',
                'Before starting the cleaning, the professional checks in on their phone and takes photos of every room (bedrooms, kitchen, bathroom) to audit any damages or the state left by the previous guest. Upon completion, they submit photos of the clean property. The owner receives an instant notification with access to the photos.'
              )
            },
            {
              id: 'faq-1',
              q: t(
                'Quem fornece os produtos e materiais profissionais de limpeza?',
                'Who supplies the professional cleaning products and equipment?'
              ),
              a: t(
                'A Impporta Clean equipa cada profissional com um kit completo de químicos certificados ecológicos, desinfetantes de nível hospitalar, aspiradores e panos de microfibra com código de cores (para prevenir contaminação cruzada entre sanitários e copas).',
                'Impporta Clean equips every professional with a complete kit of certified eco-friendly chemicals, hospital-grade disinfectants, vacuum cleaners, and color-coded microfiber cloths (to prevent cross-contamination between bathrooms and kitchens).'
              )
            },
            {
              id: 'faq-2',
              q: t(
                'Como são feitos os pagamentos e o envio dos Recibos Verdes?',
                'How do payments and invoicing work?'
              ),
              a: t(
                'Os proprietários efetuam o pagamento através de métodos bancários seguros ou cartão, com emissão de fatura-recibo com NIF elegível para dedução fiscal. Os trabalhadores acumulam o saldo no painel e solicitam o levantamento anexando o Recibo Verde das Finanças, que é validado pela administração e transferido para o seu IBAN.',
                'Property owners pay via secure bank transfer or card, receiving an official tax-deductible invoice with NIF. Cleaners accumulate their balance on the dashboard and request payouts by attaching their official tax receipt (Recibo Verde), which is verified by administration and transferred to their IBAN.'
              )
            },
            {
              id: 'faq-3',
              q: t(
                'O que acontece em caso de cancelamento de última hora ou imprevisto?',
                'What happens in case of a last-minute emergency or sick day?'
              ),
              a: t(
                'A nossa central de coordenação assegura equipas de reserva em Lisboa, Cascais, Sintra e Oeiras. Caso um trabalhador tenha um imprevisto, o administrador reatribui o serviço imediatamente no painel para que o seu hóspede nunca chegue a uma casa por limpar.',
                'Our coordination center maintains backup teams across Lisbon, Cascais, Sintra, and Oeiras. If a cleaner has an unexpected issue, our coordinator immediately reassigns the job so your guest never arrives at an uncleaned property.'
              )
            }
          ].map((faq) => (
            <Accordion.Item
              key={faq.id}
              value={faq.id}
              style={{
                background: '#ffffff',
                border: '1px solid #e7e3da',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
              }}
            >
              <Accordion.Header style={{ all: 'unset', display: 'block' }}>
                <Accordion.Trigger
                  style={{
                    width: '100%',
                    padding: '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    fontWeight: '800',
                    fontSize: '1rem',
                    color: '#111625'
                  }}
                >
                  <span>{faq.q}</span>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: '#e8eefc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#0f172a',
                    flexShrink: 0
                  }}>
                    <ChevronDown size={18} />
                  </div>
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="radix-accordion-content">
                <div style={{ padding: '0 24px 20px 24px', color: '#52525b', fontSize: '0.92rem', lineHeight: '1.6', borderTop: '1px solid #f3f4f6', paddingTop: '14px' }}>
                  {faq.a}
                </div>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6.7 RADIX DIALOG: QUICK QUOTE / SIMULAÇÃO DE ORÇAMENTO
          ───────────────────────────────────────────────────────────── */}
      <Dialog.Root open={quickQuoteOpen} onOpenChange={setQuickQuoteOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="radix-dialog-overlay" />
          <Dialog.Content className="radix-dialog-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: '#7c9de9', fontWeight: '800', textTransform: 'uppercase' }}>
                  {t('Agendamento & Orçamento Imediato', 'Instant Booking & Quote')}
                </span>
                <Dialog.Title style={{ fontSize: '1.35rem', fontWeight: '900', color: '#111625', margin: '4px 0 0 0' }}>
                  {quoteServiceType === 'al'
                    ? t('Agendar Limpeza de Alojamento Local', 'Book Short-Term Rental Cleaning')
                    : t('Agendar Limpeza de Condomínio', 'Book Condominium Cleaning')}
                </Dialog.Title>
              </div>
              <Dialog.Close asChild>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
                  <X size={22} />
                </button>
              </Dialog.Close>
            </div>

            <Dialog.Description style={{ fontSize: '0.88rem', color: '#52525b', marginBottom: '16px' }}>
              {t(
                'Selecione o tipo de serviço para calcular o valor e agendar com equipa qualificada, produtos e relatório fotográfico incluídos.',
                'Select the service type to calculate the price and book with a qualified team, professional supplies, and photo report included.'
              )}
            </Dialog.Description>

            {/* Service Type Selector: Alojamento Local vs. Condomínio */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '6px',
              background: '#efece4',
              padding: '5px',
              borderRadius: '14px',
              marginBottom: '18px'
            }}>
              <button
                type="button"
                onClick={() => setQuoteServiceType('al')}
                style={{
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: 'none',
                  background: quoteServiceType === 'al' ? '#111625' : 'transparent',
                  color: quoteServiceType === 'al' ? '#ffffff' : '#475569',
                  fontWeight: quoteServiceType === 'al' ? '800' : '700',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease'
                }}
              >
                {t('Alojamento Local (AL)', 'Short-Term Rental')}
              </button>
              <button
                type="button"
                onClick={() => setQuoteServiceType('condo')}
                style={{
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: 'none',
                  background: quoteServiceType === 'condo' ? '#111625' : 'transparent',
                  color: quoteServiceType === 'condo' ? '#ffffff' : '#475569',
                  fontWeight: quoteServiceType === 'condo' ? '800' : '700',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease'
                }}
              >
                {t('Condomínio (Prédios)', 'Condominium')}
              </button>
            </div>

            {quoteSent ? (
              <div style={{ textAlign: 'center', padding: '32px 16px', color: '#111625' }}>
                <CheckCircle2 size={48} style={{ margin: '0 auto 12px auto', color: '#16a34a' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: '900' }}>
                  {t('Pedido de Reserva Registado!', 'Booking Request Registered!')}
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#52525b', marginTop: '6px' }}>
                  {t(
                    'Redirecionando para o Portal do Proprietário para finalizar o agendamento...',
                    'Redirecting to the Owner Portal to complete your booking...'
                  )}
                </p>
              </div>
            ) : quoteServiceType === 'al' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '6px' }}>
                    {t('Tipologia do Imóvel:', 'Property Size:')}
                  </label>
                  <select
                    value={quoteTypology}
                    onChange={(e) => setQuoteTypology(e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #d1d5db', background: '#fff', fontSize: '0.9rem' }}
                  >
                    <option value="T0">{t('T0 / Estúdio (42 € / limpeza base | 56 € c/ lavandaria)', 'T0 / Studio (42 € base cleaning | 56 € w/ laundry)')}</option>
                    <option value="T1">{t('Apartamento T1 (48 € / limpeza base | 66 € c/ lavandaria)', 'T1 Apartment (48 € base cleaning | 66 € w/ laundry)')}</option>
                    <option value="T2">{t('Apartamento T2 (58 € / limpeza base | 84 € c/ lavandaria)', 'T2 Apartment (58 € base cleaning | 84 € w/ laundry)')}</option>
                    <option value="T3">{t('Apartamento T3 (78 € / limpeza base | 112 € c/ lavandaria)', 'T3 Apartment (78 € base cleaning | 112 € w/ laundry)')}</option>
                    <option value="T4+">{t('T4 / Moradia (98 € / limpeza base | 140 € c/ lavandaria)', 'T4 / Villa (98 € base cleaning | 140 € w/ laundry)')}</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '6px' }}>
                    {t('Frequência Prevista:', 'Expected Frequency:')}
                  </label>
                  <select
                    value={quoteFrequency}
                    onChange={(e) => setQuoteFrequency(e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #d1d5db', background: '#fff', fontSize: '0.9rem' }}
                  >
                    <option value="pontual">{t('Pontual (Turnover por saída de hóspede)', 'Per Turnover (Guest check-out)')}</option>
                    <option value="semanal">{t('Semanal (Recorrência regular)', 'Weekly (Regular recurrence)')}</option>
                    <option value="quinzenal">{t('Quinzenal (Manutenção de época média/baixa)', 'Bi-weekly (Mid/low season maintenance)')}</option>
                    <option value="mensal">{t('Mensal (Inspeção & Manutenção periódica)', 'Monthly (Periodic inspection & maintenance)')}</option>
                  </select>
                </div>

                <div style={{ background: '#e8eefc', border: '1px solid #c7d7fd', borderRadius: '16px', padding: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.78rem', color: '#1e3a8a', fontWeight: '700', textTransform: 'uppercase' }}>
                      {t('Valor Fixo por Serviço (s/ IVA):', 'Fixed Price per Service (excl. VAT):')}
                    </span>
                    <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#111625' }}>
                      {quoteTypology === 'T0' ? '42 €' : quoteTypology === 'T1' ? '48 €' : quoteTypology === 'T2' ? '58 €' : quoteTypology === 'T3' ? '78 €' : '98 €'}
                      <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#6b7280' }}> / turnover</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className="trust-badge-pill green">
                      <ShieldCheck size={14} /> {t('Seguro Fidelidade 500k€', '500k€ Liability Insurance')}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                  <Dialog.Close asChild>
                    <button style={{ padding: '10px 18px', borderRadius: '999px', border: '1px solid #d1d5db', background: '#fff', color: '#4b5563', fontWeight: '700', cursor: 'pointer' }}>
                      {t('Fechar', 'Close')}
                    </button>
                  </Dialog.Close>
                  <button
                    onClick={() => {
                      setQuoteSent(true);
                      setTimeout(() => {
                        setQuickQuoteOpen(false);
                        handleSelectRole('owner');
                      }, 1200);
                    }}
                    style={{
                      padding: '12px 24px',
                      borderRadius: '999px',
                      border: 'none',
                      background: '#9bb6f6',
                      color: '#0f172a',
                      fontWeight: '900',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 4px 14px rgba(155, 182, 246, 0.4)'
                    }}
                  >
                    {t('Prosseguir para Agendamento', 'Proceed to Booking')} <ArrowRight size={16} color="#0f172a" />
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '6px' }}>
                    {t('Dimensão do Prédio (Pisos / Patamares):', 'Building Size (Floors / Landings):')}
                  </label>
                  <select
                    value={quoteCondoSize}
                    onChange={(e) => setQuoteCondoSize(e.target.value as CondoSizeKey)}
                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #d1d5db', background: '#fff', fontSize: '0.9rem' }}
                  >
                    <option value="up_to_3">{t('Pequeno — Até 3 Pisos (~1h00 / visita)', 'Small — Up to 3 Floors (~1h00 / visit)')}</option>
                    <option value="4_to_5">{t('Médio-Pequeno — 4 a 5 Pisos (~1h30 / visita)', 'Medium-Small — 4 to 5 Floors (~1h30 / visit)')}</option>
                    <option value="6_to_8">{t('Médio — 6 a 8 Pisos (~2h00 / visita)', 'Medium — 6 to 8 Floors (~2h00 / visit)')}</option>
                    <option value="9_to_12">{t('Grande — 9 a 12 Pisos (~2h45 / visita)', 'Large — 9 to 12 Floors (~2h45 / visit)')}</option>
                    <option value="13_to_15">{t('Extra Grande — 13 a 15 Pisos (~3h30 / visita)', 'Extra Large — 13 to 15 Floors (~3h30 / visit)')}</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '6px' }}>
                    {t('Frequência de Limpeza Semanal:', 'Weekly Cleaning Frequency:')}
                  </label>
                  <select
                    value={quoteCondoFreq}
                    onChange={(e) => setQuoteCondoFreq(Number(e.target.value) as CondoFrequencyKey)}
                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #d1d5db', background: '#fff', fontSize: '0.9rem' }}
                  >
                    <option value={1}>{t('1x por semana (4 a 5 visitas/mês)', '1x per week (4 to 5 visits/month)')}</option>
                    <option value={2}>{t('2x por semana — Mais Popular (8 a 9 visitas/mês)', '2x per week — Most Popular (8 to 9 visits/month)')}</option>
                    <option value={3}>{t('3x por semana (12 a 13 visitas/mês)', '3x per week (12 to 13 visits/month)')}</option>
                  </select>
                </div>

                {(() => {
                  const baseMonthly = CONDO_SIZE_CONFIG[quoteCondoSize].prices[quoteCondoFreq];
                  const withVatMonthly = (baseMonthly * 1.23).toFixed(2).replace('.', ',');
                  return (
                    <div style={{ background: '#e8eefc', border: '1px solid #c7d7fd', borderRadius: '16px', padding: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                      <div>
                        <span style={{ fontSize: '0.78rem', color: '#1e3a8a', fontWeight: '700', textTransform: 'uppercase' }}>
                          {t('Avença Mensal do Condomínio:', 'Monthly Condominium Plan:')}
                        </span>
                        <div style={{ fontSize: '1.55rem', fontWeight: '900', color: '#111625' }}>
                          {withVatMonthly} €
                          <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#6b7280' }}>
                            {' '}/ {t('mês c/ IVA', 'mo incl. VAT')} ({baseMonthly} € {t('s/ IVA', 'excl. VAT')})
                          </span>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span className="trust-badge-pill green">
                          <Gift size={14} /> {t('1.ª Limpeza Grátis', '1st Cleaning Free')}
                        </span>
                      </div>
                    </div>
                  );
                })()}

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px', flexWrap: 'wrap' }}>
                  <Dialog.Close asChild>
                    <button style={{ padding: '10px 18px', borderRadius: '999px', border: '1px solid #d1d5db', background: '#fff', color: '#4b5563', fontWeight: '700', cursor: 'pointer' }}>
                      {t('Fechar', 'Close')}
                    </button>
                  </Dialog.Close>
                  <button
                    onClick={() => {
                      setQuoteSent(true);
                      setTimeout(() => {
                        setQuickQuoteOpen(false);
                        handleSelectRole('owner');
                      }, 1200);
                    }}
                    style={{
                      padding: '12px 24px',
                      borderRadius: '999px',
                      border: 'none',
                      background: '#9bb6f6',
                      color: '#0f172a',
                      fontWeight: '900',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 4px 14px rgba(155, 182, 246, 0.4)'
                    }}
                  >
                    {t('Prosseguir para Agendamento', 'Proceed to Booking')} <ArrowRight size={16} color="#0f172a" />
                  </button>
                </div>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* ─────────────────────────────────────────────────────────────
          6.75 RADIX DIALOG: 1ª LIMPEZA DE TESTE GRATUITA
          ───────────────────────────────────────────────────────────── */}
      <Dialog.Root open={trialModalOpen} onOpenChange={setTrialModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="radix-dialog-overlay" />
          <Dialog.Content className="radix-dialog-content" style={{ maxWidth: '520px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.74rem',
                  color: '#2563eb',
                  background: '#eff6ff',
                  padding: '3px 10px',
                  borderRadius: '999px',
                  fontWeight: '800',
                  textTransform: 'uppercase'
                }}>
                  <Gift size={13} />
                  {t('Oferta de Entrada Impporta AL', 'Impporta AL Welcome Offer')}
                </span>
                <Dialog.Title style={{ fontSize: '1.4rem', fontWeight: '900', color: '#111625', margin: '6px 0 0 0' }}>
                  {t('Pedir 1ª Limpeza de Teste Gratuita', 'Claim 1st Free Trial Cleaning')}
                </Dialog.Title>
              </div>
              <Dialog.Close asChild>
                <button
                  type="button"
                  aria-label={t('Fechar', 'Close')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}
                >
                  <X size={22} />
                </button>
              </Dialog.Close>
            </div>

            <Dialog.Description style={{ fontSize: '0.88rem', color: '#52525b', marginBottom: '18px', lineHeight: '1.5' }}>
              {t(
                'Comprove a qualidade e o rigor fotográfico da Impporta num dos seus alojamentos locais. 100% gratuito e sem compromisso de permanência.',
                'Experience Impporta’s hotel quality and photo reporting in one of your short-term rentals. 100% free with no lock-in commitment.'
              )}
            </Dialog.Description>

            {trialSuccess ? (
              <div style={{ textAlign: 'center', padding: '36px 16px', color: '#111625' }}>
                <CheckCircle2 size={52} style={{ margin: '0 auto 14px auto', color: '#16a34a' }} />
                <h3 style={{ fontSize: '1.3rem', fontWeight: '900' }}>
                  {t('Pedido de Teste Registado!', 'Trial Request Registered!')}
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#52525b', marginTop: '8px', lineHeight: '1.5' }}>
                  {t(
                    'A nossa equipa de coordenação entrará em contacto em menos de 30 minutos para confirmar o calendário do turnover e coordenar os acessos.',
                    'Our coordination team will contact you within 30 minutes to confirm the turnover schedule and coordinate property access.'
                  )}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setTrialModalOpen(false);
                    setTrialSuccess(false);
                  }}
                  style={{
                    marginTop: '20px',
                    padding: '12px 28px',
                    borderRadius: '999px',
                    border: 'none',
                    background: '#111625',
                    color: '#ffffff',
                    fontWeight: '800',
                    cursor: 'pointer'
                  }}
                >
                  {t('Concluir', 'Done')}
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setTrialSuccess(true);
                }}
                style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
              >
                {/* Package summary preview badge */}
                <div style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '14px',
                  padding: '12px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.85rem'
                }}>
                  <div>
                    <div style={{ fontWeight: '800', color: '#111625' }}>
                      {AL_PRICING_CONFIG[simulatorTypology].label} • {simulatorLaundry ? t('Com Lavandaria Externa', 'With External Laundry') : t('Apenas Limpeza Base', 'Base Cleaning Only')}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                      {t('Checklist de 42 pontos • Fotos via WhatsApp • Produtos profissionais incluídos', '42-point checklist • WhatsApp photos • Professional supplies included')}
                    </div>
                  </div>
                  <span style={{
                    fontSize: '0.85rem',
                    fontWeight: '900',
                    color: '#15803d',
                    background: '#dcfce7',
                    padding: '4px 10px',
                    borderRadius: '999px',
                    whiteSpace: 'nowrap'
                  }}>
                    {t('0 € (Grátis)', '0 € (Free)')}
                  </span>
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '5px' }}>
                    {t('Nome do Anfitrião / Empresa Gestora:', 'Host / Management Company Name:')}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={t('ex: Sofia Antunes (ou Gestão AL Lda)', 'e.g. Sofia Antunes (or AL Management Ltd)')}
                    value={trialForm.name}
                    onChange={(e) => setTrialForm({ ...trialForm, name: e.target.value })}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #d1d5db', fontSize: '0.9rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '5px' }}>
                    {t('Contacto Telefónico / WhatsApp:', 'Phone / WhatsApp Contact:')}
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="ex: 912 345 678"
                    value={trialForm.phone}
                    onChange={(e) => setTrialForm({ ...trialForm, phone: e.target.value })}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #d1d5db', fontSize: '0.9rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '5px' }}>
                    {t('Localização / Morada do Imóvel:', 'Property Location / Address:')}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={t('ex: Rua Augusta, Lisboa (ou Cascais)', 'e.g. Rua Augusta, Lisbon (or Cascais)')}
                    value={trialForm.address}
                    onChange={(e) => setTrialForm({ ...trialForm, address: e.target.value })}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #d1d5db', fontSize: '0.9rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '5px' }}>
                    {t('Link do Anúncio no Airbnb / Booking (Opcional):', 'Airbnb / Booking Listing URL (Optional):')}
                  </label>
                  <input
                    type="url"
                    placeholder="https://airbnb.pt/rooms/..."
                    value={trialForm.link}
                    onChange={(e) => setTrialForm({ ...trialForm, link: e.target.value })}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #d1d5db', fontSize: '0.9rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                  <button
                    type="submit"
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: '999px',
                      border: 'none',
                      background: '#111625',
                      color: '#ffffff',
                      fontWeight: '900',
                      fontSize: '0.92rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 14px rgba(17, 22, 37, 0.25)'
                    }}
                  >
                    <Gift size={16} color="#9bb6f6" /> {t('Confirmar Pedido de Limpeza Gratuita', 'Confirm Free Trial Cleaning Request')}
                  </button>

                  <a
                    href={`https://wa.me/351927322095?text=${encodeURIComponent(
                      t(
                        `Olá Impporta! Gostaria de agendar a minha 1.ª Limpeza de Teste Gratuita para o meu AL (${AL_PRICING_CONFIG[simulatorTypology].label}) com ${
                          simulatorLaundry ? 'Limpeza + Lavandaria Externa Industrial' : 'Apenas Limpeza Base'
                        }.`,
                        `Hello Impporta! I would like to book my 1st Free Trial Cleaning for my Short-Term Rental (${AL_PRICING_CONFIG[simulatorTypology].label}) with ${
                          simulatorLaundry ? 'Cleaning + Industrial External Laundry' : 'Base Cleaning Only'
                        }.`
                      )
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '999px',
                      border: '1.5px solid #25D366',
                      background: '#f0fdf4',
                      color: '#166534',
                      fontWeight: '800',
                      fontSize: '0.86rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      textDecoration: 'none',
                      boxSizing: 'border-box'
                    }}
                  >
                    <MessageSquare size={16} color="#16a34a" /> {t('Pedir Diretamente via WhatsApp', 'Request Directly via WhatsApp')}
                  </a>
                </div>
              </form>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* ─────────────────────────────────────────────────────────────
          6.8 RADIX DIALOG: LOGIN MODAL
          ───────────────────────────────────────────────────────────── */}
      <Dialog.Root open={loginModalOpen} onOpenChange={setLoginModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="radix-dialog-overlay" />
          <Dialog.Content className="radix-dialog-content" style={{ maxWidth: '440px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: '#7c9de9', fontWeight: '800', textTransform: 'uppercase' }}>
                  {t('Acesso à Plataforma', 'Platform Access')}
                </span>
                <Dialog.Title style={{ fontSize: '1.35rem', fontWeight: '900', color: '#111625', margin: '4px 0 0 0' }}>
                  {t('Iniciar Sessão', 'Sign In')}
                </Dialog.Title>
              </div>
              <Dialog.Close asChild>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
                  <X size={22} />
                </button>
              </Dialog.Close>
            </div>

            <Dialog.Description style={{ fontSize: '0.88rem', color: '#52525b', marginBottom: '20px' }}>
              {t(
                'Selecione o seu perfil e aceda diretamente à sua área pessoal na Impporta.',
                'Select your role and access your personal Impporta dashboard.'
              )}
            </Dialog.Description>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setLoginError('');
                setLoginLoading(true);
                setTimeout(() => {
                  const res = CleaningStore.authenticateUser(loginEmail, loginPassword, loginRole);
                  setLoginLoading(false);
                  if (res.error || !res.user) {
                    setLoginError(res.error || t('Não foi possível iniciar sessão.', 'Could not sign in.'));
                    return;
                  }
                  setAuthenticatedUser(res.user);
                  setActiveUserId(res.user.id);
                  setProfile(loginRole);
                  setLoginModalOpen(false);
                  if (onNavigateToPortal) {
                    onNavigateToPortal(loginRole);
                  }
                }, 350);
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              {/* Profile selector tabs */}
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '8px' }}>
                  {t('Perfil de Acesso:', 'Access Role:')}
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', background: '#efece4', padding: '4px', borderRadius: '12px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginRole('owner');
                      setLoginError('');
                    }}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: 'none',
                      background: loginRole === 'owner' ? '#111625' : 'transparent',
                      color: loginRole === 'owner' ? '#ffffff' : '#52525b',
                      fontWeight: loginRole === 'owner' ? '800' : '600',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Building2 size={15} color={loginRole === 'owner' ? '#9bb6f6' : 'currentColor'} /> {t('Proprietário', 'Owner')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginRole('worker');
                      setLoginError('');
                    }}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: 'none',
                      background: loginRole === 'worker' ? '#111625' : 'transparent',
                      color: loginRole === 'worker' ? '#ffffff' : '#52525b',
                      fontWeight: loginRole === 'worker' ? '800' : '600',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Users size={15} color={loginRole === 'worker' ? '#9bb6f6' : 'currentColor'} /> {t('Trabalhador', 'Cleaner')}
                  </button>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '6px' }}>
                  {t('Email de Acesso:', 'Email Address:')}
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                  <input
                    type="email"
                    required
                    placeholder={loginRole === 'owner' ? t('ex: nome@empresa.pt', 'e.g. name@company.com') : t('ex: nome@impporta.pt', 'e.g. name@impporta.pt')}
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 12px 11px 36px',
                      borderRadius: '10px',
                      border: '1px solid #d1d5db',
                      background: '#fff',
                      fontSize: '0.9rem',
                      color: '#111625',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '6px' }}>
                  {t('Palavra-passe:', 'Password:')}
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                  <input
                    type="password"
                    required
                    placeholder={t('Introduza a sua palavra-passe', 'Enter your password')}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 12px 11px 36px',
                      borderRadius: '10px',
                      border: '1px solid #d1d5db',
                      background: '#fff',
                      fontSize: '0.9rem',
                      color: '#111625',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {loginError && (
                <div style={{
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  color: '#b91c1c',
                  fontSize: '0.82rem',
                  fontWeight: '700',
                  padding: '10px 12px',
                  borderRadius: '10px'
                }}>
                  {loginError}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <Dialog.Close asChild>
                  <button type="button" style={{ padding: '10px 18px', borderRadius: '999px', border: '1px solid #d1d5db', background: '#fff', color: '#4b5563', fontWeight: '700', cursor: 'pointer' }}>
                    {t('Cancelar', 'Cancel')}
                  </button>
                </Dialog.Close>
                <button
                  type="submit"
                  disabled={loginLoading}
                  style={{
                    padding: '11px 22px',
                    borderRadius: '999px',
                    border: 'none',
                    background: '#111625',
                    color: '#ffffff',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(17, 22, 37, 0.25)'
                  }}
                >
                  <LogIn size={16} color="#9bb6f6" /> {loginLoading ? t('A entrar...', 'Signing in...') : t('Entrar no Portal', 'Sign In to Portal')}
                </button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* ─────────────────────────────────────────────────────────────
          MODAL: CHECKLIST DIGITAL IMPPORTA (42 PONTOS DE TURNOVER)
          ───────────────────────────────────────────────────────────── */}
      <Dialog.Root open={checklistModalOpen} onOpenChange={setChecklistModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="radix-dialog-overlay" />
          <Dialog.Content className="radix-dialog-content" style={{ maxWidth: '840px', width: '95vw', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: '#2563eb', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {t('Auditoria Operacional de Alojamento Local', 'Short-Term Rental Operational Audit')}
                </span>
                <Dialog.Title style={{ fontSize: '1.45rem', fontWeight: '900', color: '#111625', margin: '4px 0 0 0' }}>
                  {t('Checklist Digital Impporta (42 Pontos de Turnover)', 'Impporta Digital Checklist (42 Turnover Points)')}
                </Dialog.Title>
                <Dialog.Description style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px', lineHeight: '1.5' }}>
                  {t(
                    'Cada turnover é executado rigorosamente contra estes 42 pontos de inspeção divididos em 5 setores operacionais, com relatório fotográfico obrigatório de 10 a 15 fotos enviado via WhatsApp.',
                    'Every turnover is strictly executed against these 42 inspection points across 5 operational sectors, backed by a mandatory 10–15 photo report sent via WhatsApp.'
                  )}
                </Dialog.Description>
              </div>
              <Dialog.Close asChild>
                <button
                  type="button"
                  style={{
                    background: '#f1f5f9',
                    border: 'none',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#64748b',
                    flexShrink: 0
                  }}
                >
                  <X size={18} />
                </button>
              </Dialog.Close>
            </div>

            {/* Sectors Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              {CHECKLIST_42_SECTIONS.map((section) => (
                <div
                  key={section.id}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '16px',
                    padding: '16px 20px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <h4 style={{ margin: 0, fontSize: '0.96rem', fontWeight: '800', color: '#0d2e23', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FileCheck size={18} color="#2563eb" /> {section.title}
                    </h4>
                    <span style={{ fontSize: '0.72rem', fontWeight: '800', padding: '3px 8px', borderRadius: '999px', background: '#e0f2fe', color: '#0369a1' }}>
                      {section.points.length} {t('Pontos', 'Points')}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '8px 14px' }}>
                    {section.points.map((pt) => (
                      <div key={pt.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.8rem', color: '#334155', lineHeight: '1.4' }}>
                        <span style={{
                          background: '#111625',
                          color: '#ffffff',
                          fontWeight: '800',
                          fontSize: '0.7rem',
                          borderRadius: '6px',
                          padding: '1px 6px',
                          flexShrink: 0,
                          marginTop: '1px'
                        }}>
                          {pt.number}
                        </span>
                        <span>{pt.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Modal CTA */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
              <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                {t('Proteção AirCover e padrão hoteleiro 5 estrelas garantidos.', 'AirCover protection and 5-star hotel standard guaranteed.')}
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Dialog.Close asChild>
                  <button
                    type="button"
                    style={{
                      padding: '10px 18px',
                      borderRadius: '999px',
                      border: '1px solid #d1d5db',
                      background: '#ffffff',
                      color: '#475569',
                      fontWeight: '700',
                      fontSize: '0.82rem',
                      cursor: 'pointer'
                    }}
                  >
                    {t('Fechar', 'Close')}
                  </button>
                </Dialog.Close>
                <button
                  type="button"
                  onClick={() => {
                    setChecklistModalOpen(false);
                    setQuickQuoteOpen(true);
                  }}
                  style={{
                    padding: '10px 22px',
                    borderRadius: '999px',
                    border: 'none',
                    background: '#111625',
                    color: '#ffffff',
                    fontWeight: '800',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  {t('Agendar Limpeza com Esta Checklist', 'Book Cleaning with This Checklist')} <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* ─────────────────────────────────────────────────────────────
          7. FOOTER (Deep Obsidian & Golden Star)
          ───────────────────────────────────────────────────────────── */}
      <footer style={{ background: '#111625', color: '#9ca3af', padding: '60px clamp(32px, 8vw, 120px) 30px clamp(32px, 8vw, 120px)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '30px', marginBottom: '40px' }}>
          <div>
            <div style={{
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
              color: '#ffffff',
              fontSize: '1.65rem',
              fontWeight: 900,
              letterSpacing: '-0.045em',
              lineHeight: 1
            }}>
              Impporta
            </div>
            <p style={{ maxWidth: '320px', fontSize: '0.85rem', marginTop: '12px', lineHeight: '1.5', color: '#94a3b8' }}>
              {t(
                'A plataforma inteligente para gestão de limpezas de Alojamento Local e condomínios em Portugal.',
                'The smart platform for Short-Term Rental and condominium cleaning management in Portugal.'
              )}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ color: '#ffffff', fontWeight: '800', fontSize: '0.9rem', marginBottom: '12px' }}>
                {t('Acesso Rápido', 'Quick Links')}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                <span onClick={() => handleSelectRole('worker')} style={{ cursor: 'pointer', color: '#9bb6f6' }}>
                  {t('Portal do Trabalhador', 'Cleaner Portal')}
                </span>
                <span onClick={() => handleSelectRole('owner')} style={{ cursor: 'pointer', color: '#9bb6f6' }}>
                  {t('Portal do Proprietário', 'Owner Portal')}
                </span>
              </div>
            </div>

            <div>
              <div style={{ color: '#ffffff', fontWeight: '800', fontSize: '0.9rem', marginBottom: '12px' }}>
                {t('Contacto & Suporte', 'Contact & Support')}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px', fontSize: '0.85rem' }}>
                <span>{t('Lisboa • Cascais • Oeiras • Sintra', 'Lisbon • Cascais • Oeiras • Sintra')}</span>
                <a
                  href="mailto:help@impporta.com"
                  style={{ color: '#9ca3af', textDecoration: 'none' }}
                >
                  help@impporta.com
                </a>
                <a
                  href={`https://wa.me/351927322095?text=${encodeURIComponent(
                    t(
                      'Olá Impporta! Gostaria de falar com a equipa de suporte.',
                      'Hello Impporta! I would like to speak with the support team.'
                    )
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '7px',
                    padding: '7px 14px',
                    borderRadius: '999px',
                    background: '#25D366',
                    color: '#052e16',
                    fontWeight: '800',
                    fontSize: '0.8rem',
                    textDecoration: 'none',
                    marginTop: '2px',
                    boxShadow: '0 4px 12px rgba(37, 211, 102, 0.25)'
                  }}
                >
                  <MessageSquare size={14} fill="#052e16" color="#052e16" />
                  <span>{t('Falar no WhatsApp', 'Chat on WhatsApp')}</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: '1240px', margin: '0 auto', textAlign: 'center', fontSize: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '20px', color: '#64748b' }}>
          {t('© 2026 Impporta. Todos os direitos reservados.', '© 2026 Impporta. All rights reserved.')}
        </div>
      </footer>
    </div>
  );
}

