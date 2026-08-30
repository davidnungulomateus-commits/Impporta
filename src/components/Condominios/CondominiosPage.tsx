'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Building2,
  CheckCircle2,
  ArrowRight,
  MessageSquare,
  Plus,
  Menu,
  X,
  DoorOpen,
  ArrowUpDown,
  Mail,
  Layers,
  Shield,
  Clock,
  Users,
  Sparkles,
  TreePine,
  Droplets,
  Car,
  ChevronDown,
} from 'lucide-react';

type Language = 'pt' | 'en';

/* ─── Bilingual Dictionary ──────────────────────────────────────────── */
const translations = {
  pt: {
    brandSub: 'CONDOMÍNIOS',
    nav: {
      included: 'O Que Inclui',
      calculator: 'Simulador',
      howItWorks: 'Como Funciona',
      faq: 'FAQ',
      ctaBtn: 'Pedir Avaliação Gratuita',
      alVertical: 'Alojamento Local',
    },
    hero: {
      pill: 'Para Administradores de Condomínio',
      headline1: 'O seu condomínio é a',
      headline2: 'primeira impressão',
      headline3: 'de quem visita',
      subtitle: 'Limpeza profissional de partes comuns com preço transparente por hora. Sem surpresas, sem orçamentos escondidos — veja o custo agora.',
      ctaCalc: 'Simular Preço',
      ctaWhatsApp: 'Falar no WhatsApp',
    },
    included: {
      sectionTag: 'O Que Está Incluído',
      sectionTitle: 'Limpeza completa das partes comuns',
      sectionSub: 'Tudo o que o seu condomínio precisa para causar a melhor impressão, incluído no preço por hora.',
      items: [
        { icon: 'DoorOpen', title: 'Entrada e Hall', desc: 'Pavimento, paredes, porta de entrada, intercomunicador e iluminação.' },
        { icon: 'Stairs', title: 'Escadas e Corrimãos', desc: 'Limpeza de todos os degraus, patamares e corrimãos em cada piso.' },
        { icon: 'Building2', title: 'Elevador', desc: 'Superfícies interiores, botões, espelhos e calhas de porta.' },
        { icon: 'Layers', title: 'Corredores', desc: 'Pavimentos, rodapés e iluminação de todos os andares.' },
        { icon: 'Mail', title: 'Zona de Caixas de Correio', desc: 'Limpeza e organização da área de correspondência.' },
        { icon: 'Sparkles', title: 'Vidros e Portas Comuns', desc: 'Portas de entrada, vidros de patamares e superfícies de contacto.' },
      ],
    },
    notIncluded: {
      title: 'Não Incluído (Disponível como Extra)',
      items: [
        'Interior de apartamentos — serviço separado',
        'Jardim — disponível como add-on (~€100/visita)',
        'Piscina — disponível como add-on (~€350/mês)',
        'Garagem — disponível como add-on (horas extra)',
      ],
    },
    calculator: {
      sectionTag: 'Simulador de Preços',
      sectionTitle: 'Calcule o custo mensal do seu condomínio',
      sectionSub: 'Selecione o tamanho do edifício e a frequência pretendida — o preço atualiza automaticamente.',
      buildingLabel: 'Tamanho do Edifício',
      buildingOptions: [
        { value: 'small', label: 'Pequeno (2-4 pisos / até 8 frações)', hours: 1.25 },
        { value: 'medium', label: 'Médio (5-8 pisos / até 20 frações)', hours: 2.5 },
        { value: 'large', label: 'Grande (9+ pisos / 20+ frações)', hours: 4 },
      ],
      frequencyLabel: 'Frequência',
      frequencyOptions: [
        { value: '1x', label: '1× por semana', visits: 4.33 },
        { value: '2x', label: '2× por semana', visits: 8.66 },
        { value: '3x', label: '3× por semana', visits: 13 },
        { value: 'daily', label: 'Diário (5×/semana)', visits: 21.67 },
      ],
      addonsLabel: 'Extras (opcional)',
      addons: [
        { id: 'garden', label: 'Manutenção de jardim', price: 100, unit: '/visita', icon: 'TreePine' },
        { id: 'pool', label: 'Manutenção de piscina', price: 350, unit: '/mês', icon: 'Droplets' },
        { id: 'garage', label: 'Limpeza de garagem', price: 0, extraHours: 1.5, unit: '(+1.5h/visita)', icon: 'Car' },
      ],
      resultLabel: 'Estimativa Mensal',
      breakdownHours: 'horas/mês',
      breakdownRate: '/hora',
      disclaimer: 'Estimativa — o preço final pode variar consoante avaliação presencial do edifício.',
      ctaBtn: 'Pedir Avaliação Gratuita',
    },
    volume: {
      sectionTag: 'Gestão de Múltiplos Edifícios',
      sectionTitle: 'Desconto por volume para gestoras de condomínios',
      tiers: [
        { buildings: '1 edifício', rate: '€11/hora', discount: '', highlight: false },
        { buildings: '2–4 edifícios', rate: '€10,12/hora', discount: '-8%', highlight: true },
        { buildings: '5+ edifícios', rate: '€9,35/hora', discount: '-15%', highlight: true },
      ],
      note: 'Ideal para administradores de condomínios e empresas de gestão de propriedades.',
    },
    howItWorks: {
      sectionTag: 'Como Funciona',
      sectionTitle: '4 passos para um condomínio impecável',
      steps: [
        { num: '01', title: 'Simule Online', desc: 'Use o nosso simulador para obter uma estimativa instantânea.' },
        { num: '02', title: 'Avaliação Gratuita', desc: 'Visitamos o edifício para confirmar o preço final, sem compromisso.' },
        { num: '03', title: 'Início do Serviço', desc: 'Definimos horário e frequência de acordo com as suas necessidades.' },
        { num: '04', title: 'Qualidade Contínua', desc: 'Relatórios regulares e supervisão para manter o padrão.' },
      ],
    },
    trust: {
      sectionTitle: 'Porque confiar na Impporta',
      items: [
        { icon: 'Shield', title: 'Seguro de Responsabilidade Civil', desc: 'Cobertura completa para trabalhos em espaços comuns.' },
        { icon: 'Clock', title: 'Contrato Flexível', desc: 'Sem período mínimo obrigatório. Cancele quando quiser.' },
        { icon: 'Users', title: 'Equipa Fixa Dedicada', desc: 'Os mesmos profissionais em todas as visitas — conhecem o seu edifício.' },
      ],
    },
    faq: {
      sectionTag: 'Perguntas Frequentes',
      sectionTitle: 'Dúvidas sobre limpeza de condomínio?',
      items: [
        { q: 'Qual é o preço por hora?', a: 'O nosso preço base é €11/hora. Para gestoras com 2-4 edifícios aplicamos -8% (€10,12/h), e para 5+ edifícios -15% (€9,35/h).' },
        { q: 'A estimativa do simulador é vinculativa?', a: 'Não — é uma estimativa baseada em edifícios típicos. O preço final é confirmado após uma avaliação gratuita e presencial do edifício.' },
        { q: 'Incluem limpeza do interior dos apartamentos?', a: 'Não. Este serviço cobre apenas as partes comuns (hall, escadas, elevador, corredores). Para limpeza de apartamentos, consulte o nosso serviço de Alojamento Local.' },
        { q: 'Trabalham aos fins de semana?', a: 'Sim. Podemos agendar limpezas em qualquer dia da semana, incluindo sábados e domingos, sem custo adicional.' },
        { q: 'Existe um período mínimo de contrato?', a: 'Não. Oferecemos contratos flexíveis sem período mínimo obrigatório. Pode cancelar a qualquer momento.' },
        { q: 'Como funciona a manutenção de jardim e piscina?', a: 'São add-ons separados. Jardim custa ~€100/visita e piscina ~€350/mês. São cotados separadamente do preço da limpeza de partes comuns.' },
      ],
    },
    footer: {
      tagline: 'Limpeza profissional de partes comuns para condomínios em Lisboa, Cascais, Oeiras, Sintra e arredores.',
      colServices: 'Serviços',
      colZones: 'Zonas',
      colContact: 'Contacto',
      otherVertical: 'Limpeza Alojamento Local',
      rights: 'Todos os direitos reservados.',
    },
  },
  en: {
    brandSub: 'CONDOMINIUMS',
    nav: {
      included: "What's Included",
      calculator: 'Price Calculator',
      howItWorks: 'How It Works',
      faq: 'FAQ',
      ctaBtn: 'Request Free Assessment',
      alVertical: 'Short-Term Rental',
    },
    hero: {
      pill: 'For Condominium Administrators',
      headline1: 'Your building is the',
      headline2: 'first impression',
      headline3: 'for every visitor',
      subtitle: 'Professional common-area cleaning with transparent per-hour pricing. No surprises, no hidden quotes — see the cost now.',
      ctaCalc: 'Calculate Price',
      ctaWhatsApp: 'Chat on WhatsApp',
    },
    included: {
      sectionTag: "What's Included",
      sectionTitle: 'Complete common-area cleaning',
      sectionSub: 'Everything your building needs to make the best impression, included in the hourly rate.',
      items: [
        { icon: 'DoorOpen', title: 'Entrance & Lobby', desc: 'Floors, walls, entrance door, intercom and lighting.' },
        { icon: 'Stairs', title: 'Stairs & Handrails', desc: 'Cleaning of all steps, landings and handrails on every floor.' },
        { icon: 'Building2', title: 'Elevator', desc: 'Interior surfaces, buttons, mirrors and door tracks.' },
        { icon: 'Layers', title: 'Corridors', desc: 'Floors, baseboards and lighting on all floors.' },
        { icon: 'Mail', title: 'Mailbox Area', desc: 'Cleaning and tidying of the mail area.' },
        { icon: 'Sparkles', title: 'Common Glass & Doors', desc: 'Entrance doors, landing glass and high-touch surfaces.' },
      ],
    },
    notIncluded: {
      title: 'Not Included (Available as Add-On)',
      items: [
        'Apartment interiors — separate service',
        'Garden — available as add-on (~€100/visit)',
        'Pool — available as add-on (~€350/month)',
        'Garage — available as add-on (extra hours)',
      ],
    },
    calculator: {
      sectionTag: 'Price Calculator',
      sectionTitle: 'Calculate your monthly cost',
      sectionSub: 'Select your building size and desired frequency — the price updates automatically.',
      buildingLabel: 'Building Size',
      buildingOptions: [
        { value: 'small', label: 'Small (2-4 floors / up to 8 units)', hours: 1.25 },
        { value: 'medium', label: 'Medium (5-8 floors / up to 20 units)', hours: 2.5 },
        { value: 'large', label: 'Large (9+ floors / 20+ units)', hours: 4 },
      ],
      frequencyLabel: 'Frequency',
      frequencyOptions: [
        { value: '1x', label: '1× per week', visits: 4.33 },
        { value: '2x', label: '2× per week', visits: 8.66 },
        { value: '3x', label: '3× per week', visits: 13 },
        { value: 'daily', label: 'Daily (5×/week)', visits: 21.67 },
      ],
      addonsLabel: 'Add-ons (optional)',
      addons: [
        { id: 'garden', label: 'Garden maintenance', price: 100, unit: '/visit', icon: 'TreePine' },
        { id: 'pool', label: 'Pool maintenance', price: 350, unit: '/month', icon: 'Droplets' },
        { id: 'garage', label: 'Garage cleaning', price: 0, extraHours: 1.5, unit: '(+1.5h/visit)', icon: 'Car' },
      ],
      resultLabel: 'Monthly Estimate',
      breakdownHours: 'hours/month',
      breakdownRate: '/hour',
      disclaimer: 'Estimate — final price may vary based on an on-site building assessment.',
      ctaBtn: 'Request Free Assessment',
    },
    volume: {
      sectionTag: 'Multi-Building Management',
      sectionTitle: 'Volume discounts for property managers',
      tiers: [
        { buildings: '1 building', rate: '€11/hour', discount: '', highlight: false },
        { buildings: '2–4 buildings', rate: '€10.12/hour', discount: '-8%', highlight: true },
        { buildings: '5+ buildings', rate: '€9.35/hour', discount: '-15%', highlight: true },
      ],
      note: 'Ideal for condominium administrators and property management companies.',
    },
    howItWorks: {
      sectionTag: 'How It Works',
      sectionTitle: '4 steps to an impeccable building',
      steps: [
        { num: '01', title: 'Simulate Online', desc: 'Use our calculator to get an instant estimate.' },
        { num: '02', title: 'Free Assessment', desc: 'We visit the building to confirm the final price, no commitment.' },
        { num: '03', title: 'Start Service', desc: 'We set the schedule and frequency according to your needs.' },
        { num: '04', title: 'Ongoing Quality', desc: 'Regular reports and supervision to maintain standards.' },
      ],
    },
    trust: {
      sectionTitle: 'Why trust Impporta',
      items: [
        { icon: 'Shield', title: 'Liability Insurance', desc: 'Full coverage for work in common spaces.' },
        { icon: 'Clock', title: 'Flexible Contract', desc: 'No mandatory minimum period. Cancel anytime.' },
        { icon: 'Users', title: 'Dedicated Fixed Team', desc: 'The same professionals on every visit — they know your building.' },
      ],
    },
    faq: {
      sectionTag: 'Frequently Asked Questions',
      sectionTitle: 'Questions about building cleaning?',
      items: [
        { q: 'What is the hourly rate?', a: 'Our base rate is €11/hour. Property managers with 2-4 buildings get -8% (€10.12/h), and 5+ buildings get -15% (€9.35/h).' },
        { q: 'Is the calculator estimate binding?', a: "No — it's an estimate based on typical buildings. The final price is confirmed after a free on-site building assessment." },
        { q: 'Do you clean apartment interiors?', a: 'No. This service covers common areas only (lobby, stairs, elevator, corridors). For apartment cleaning, see our Short-Term Rental service.' },
        { q: 'Do you work on weekends?', a: 'Yes. We can schedule cleanings on any day of the week, including Saturdays and Sundays, at no extra cost.' },
        { q: 'Is there a minimum contract period?', a: 'No. We offer flexible contracts with no mandatory minimum period. You can cancel at any time.' },
        { q: 'How do garden and pool maintenance work?', a: "They're separate add-ons. Garden costs ~€100/visit and pool ~€350/month. They're quoted separately from the common-area cleaning rate." },
      ],
    },
    footer: {
      tagline: 'Professional common-area cleaning for condominiums across Lisbon, Cascais, Oeiras, Sintra and surrounding areas.',
      colServices: 'Services',
      colZones: 'Regions',
      colContact: 'Contact',
      otherVertical: 'Airbnb / AL Cleaning',
      rights: 'All rights reserved.',
    },
  },
};

/* ─── Icon Map ──────────────────────────────────────────────────────── */
const iconMap: Record<string, React.ReactNode> = {
  DoorOpen: <DoorOpen size={22} />,
  Stairs: <ArrowUpDown size={22} />,
  Building2: <Building2 size={22} />,
  Layers: <Layers size={22} />,
  Mail: <Mail size={22} />,
  Sparkles: <Sparkles size={22} />,
  Shield: <Shield size={22} />,
  Clock: <Clock size={22} />,
  Users: <Users size={22} />,
  TreePine: <TreePine size={22} />,
  Droplets: <Droplets size={22} />,
  Car: <Car size={22} />,
};

const HOURLY_RATE = 11;
const WHATSAPP_NUM = '351927322095';

/* ─── Component ─────────────────────────────────────────────────────── */
export default function CondominiosPage() {
  const [lang, setLang] = useState<Language>('pt');

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('impporta-lang') as Language;
      if (savedLang && (savedLang === 'pt' || savedLang === 'en')) {
        setLang(savedLang);
      }
    } catch {
      // ignore
    }
  }, []);

  const changeLanguage = (newLang: Language) => {
    setLang(newLang);
    try {
      localStorage.setItem('impporta-lang', newLang);
      document.documentElement.lang = newLang;
    } catch {
      // ignore
    }
  };

  // Calculator state
  const [buildingSize, setBuildingSize] = useState('small');
  const [frequency, setFrequency] = useState('2x');
  const [addons, setAddons] = useState<Record<string, boolean>>({ garden: false, pool: false, garage: false });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaqs, setOpenFaqs] = useState<number[]>([]);

  const toggleFaq = (index: number) => {
    setOpenFaqs((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const toggleAddon = (id: string) => {
    setAddons((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const t = translations[lang];

  // Calculator logic
  const buildingOption = t.calculator.buildingOptions.find((b) => b.value === buildingSize) || t.calculator.buildingOptions[0];
  const frequencyOption = t.calculator.frequencyOptions.find((f) => f.value === frequency) || t.calculator.frequencyOptions[1];

  const garageAddon = t.calculator.addons.find((a) => a.id === 'garage');
  const garageExtraHours = addons.garage && garageAddon && 'extraHours' in garageAddon ? (garageAddon as any).extraHours : 0;

  const hoursPerVisit = buildingOption.hours + garageExtraHours;
  const visitsPerMonth = frequencyOption.visits;
  const monthlyHours = hoursPerVisit * visitsPerMonth;
  const basePrice = monthlyHours * HOURLY_RATE;

  let addonTotal = 0;
  const addonLines: { label: string; amount: number }[] = [];

  if (addons.garden) {
    const gardenCost = 100 * visitsPerMonth;
    addonTotal += gardenCost;
    addonLines.push({ label: t.calculator.addons[0].label, amount: gardenCost });
  }
  if (addons.pool) {
    addonTotal += 350;
    addonLines.push({ label: t.calculator.addons[1].label, amount: 350 });
  }

  const totalPrice = basePrice + addonTotal;

  const whatsappMsg = encodeURIComponent(
    lang === 'pt'
      ? `Olá! Gostaria de pedir uma avaliação gratuita para limpeza de condomínio.\n\nEdifício: ${buildingOption.label}\nFrequência: ${frequencyOption.label}\nEstimativa: €${totalPrice.toFixed(0)}/mês`
      : `Hello! I'd like to request a free building cleaning assessment.\n\nBuilding: ${buildingOption.label}\nFrequency: ${frequencyOption.label}\nEstimate: €${totalPrice.toFixed(0)}/month`
  );
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUM}?text=${whatsappMsg}`;
  const whatsappUrlGeneric = `https://wa.me/${WHATSAPP_NUM}`;

  const scrollToCalc = () => {
    document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="landing-root">
      {/* ── Header ────────────────────────────────────────────────────── */}
      <header className="landing-header">
        <div className="landing-header-container">
          <div className="landing-brand">
            <div className="brand-text-group">
              <span className="brand-name">Impporta</span>
              <span className="brand-sub">{t.brandSub}</span>
            </div>
          </div>

          <nav className="landing-nav">
            <a href="#included" className="nav-item">{t.nav.included}</a>
            <a href="#calculator" className="nav-item">{t.nav.calculator}</a>
            <a href="#how-it-works" className="nav-item">{t.nav.howItWorks}</a>
            <a href="#faq" className="nav-item">{t.nav.faq}</a>
            <Link href="/" className="nav-item" style={{ color: 'var(--accent)' }}>{t.nav.alVertical}</Link>
          </nav>

          <div className="landing-header-actions">
            <div className="lang-switcher">
              <button
                type="button"
                onClick={() => changeLanguage('pt')}
                className={`lang-btn ${lang === 'pt' ? 'active' : ''}`}
                title="Português"
              >
                PT
              </button>
              <span className="lang-divider">|</span>
              <button
                type="button"
                onClick={() => changeLanguage('en')}
                className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
                title="English"
              >
                EN
              </button>
            </div>

            <a
              href={whatsappUrlGeneric}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp-sm hidden-mobile"
              title="WhatsApp"
            >
              <MessageSquare size={15} />
              <span>WhatsApp</span>
            </a>
            <button onClick={scrollToCalc} className="btn-trial-nav hidden-mobile">
              {t.nav.ctaBtn}
            </button>

            <button
              type="button"
              className="mobile-hamburger-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="mobile-drawer animate-fade-in">
            <nav className="mobile-drawer-nav">
              <a href="#included" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                {t.nav.included}
              </a>
              <a href="#calculator" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                {t.nav.calculator}
              </a>
              <a href="#how-it-works" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                {t.nav.howItWorks}
              </a>
              <a href="#faq" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                {t.nav.faq}
              </a>
              <Link href="/" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--accent)' }}>
                {t.nav.alVertical}
              </Link>
            </nav>
            <div className="mobile-drawer-actions">
              <button
                onClick={() => { setMobileMenuOpen(false); scrollToCalc(); }}
                className="btn-primary-hero"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <span>{t.nav.ctaBtn}</span>
                <ArrowRight size={16} />
              </button>
              <a
                href={whatsappUrlGeneric}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp-full"
                onClick={() => setMobileMenuOpen(false)}
              >
                <MessageSquare size={18} />
                <span>WhatsApp (+351 927 322 095)</span>
              </a>
            </div>
          </div>
        )}
      </header>

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="hero-section">
        <div className="hero-glow-blob" />
        <div className="hero-container">
          <div className="hero-pill animate-fade-in">
            <span className="pill-dot" />
            <span className="pill-text">{t.hero.pill}</span>
          </div>

          <h1 className="hero-headline">
            {t.hero.headline1} <br />
            <span className="hero-gradient-text">{t.hero.headline2}</span><br />
            {t.hero.headline3}
          </h1>

          <p className="hero-subtitle">{t.hero.subtitle}</p>

          <div className="hero-actions">
            <button onClick={scrollToCalc} className="btn-primary-hero">
              <span>{t.hero.ctaCalc}</span>
              <ArrowRight size={16} />
            </button>
            <a
              href={whatsappUrlGeneric}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-hero"
            >
              <MessageSquare size={16} />
              <span>{t.hero.ctaWhatsApp}</span>
            </a>
          </div>
        </div>
      </section>

      {/* ── What's Included ──────────────────────────────────────────── */}
      <section id="included" className="landing-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">{t.included.sectionTag}</span>
            <h2 className="section-title">{t.included.sectionTitle}</h2>
            <p className="section-sub">{t.included.sectionSub}</p>
          </div>
          <div className="condo-grid-6">
            {t.included.items.map((item, i) => (
              <div key={i} className="condo-feature-card">
                <div className="condo-feature-icon">{iconMap[item.icon]}</div>
                <h3 className="condo-feature-title">{item.title}</h3>
                <p className="condo-feature-desc">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Not Included */}
          <div className="condo-not-included">
            <h3 className="condo-not-included-title">{t.notIncluded.title}</h3>
            <ul className="condo-not-included-list">
              {t.notIncluded.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Pricing Calculator ───────────────────────────────────────── */}
      <section id="calculator" className="landing-section condo-calc-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">{t.calculator.sectionTag}</span>
            <h2 className="section-title">{t.calculator.sectionTitle}</h2>
            <p className="section-sub">{t.calculator.sectionSub}</p>
          </div>

          <div className="condo-calc-wrapper">
            <div className="condo-calc-inputs">
              {/* Building Size */}
              <div className="condo-calc-group">
                <label className="condo-calc-label">{t.calculator.buildingLabel}</label>
                <div className="condo-calc-options">
                  {t.calculator.buildingOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      className={`condo-calc-option-btn ${buildingSize === opt.value ? 'active' : ''}`}
                      onClick={() => setBuildingSize(opt.value)}
                    >
                      <Building2 size={16} />
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Frequency */}
              <div className="condo-calc-group">
                <label className="condo-calc-label">{t.calculator.frequencyLabel}</label>
                <div className="condo-calc-freq-grid">
                  {t.calculator.frequencyOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      className={`condo-calc-freq-btn ${frequency === opt.value ? 'active' : ''}`}
                      onClick={() => setFrequency(opt.value)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add-ons */}
              <div className="condo-calc-group">
                <label className="condo-calc-label">{t.calculator.addonsLabel}</label>
                <div className="condo-calc-addons">
                  {t.calculator.addons.map((addon) => (
                    <label key={addon.id} className={`condo-addon-row ${addons[addon.id] ? 'checked' : ''}`}>
                      <input
                        type="checkbox"
                        checked={addons[addon.id] || false}
                        onChange={() => toggleAddon(addon.id)}
                        className="condo-addon-checkbox"
                      />
                      <span className="condo-addon-icon">{iconMap[addon.icon]}</span>
                      <span className="condo-addon-label">{addon.label}</span>
                      <span className="condo-addon-price">
                        {addon.price > 0 ? `€${addon.price}${addon.unit}` : addon.unit}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Result Panel */}
            <div className="condo-calc-result">
              <div className="condo-calc-result-inner">
                <span className="condo-calc-result-label">{t.calculator.resultLabel}</span>
                <div className="condo-calc-price">
                  <span className="condo-calc-currency">€</span>
                  <span className="condo-calc-amount">{totalPrice.toFixed(0)}</span>
                  <span className="condo-calc-period">/{lang === 'pt' ? 'mês' : 'month'}</span>
                </div>

                <div className="condo-calc-breakdown">
                  <div className="condo-calc-breakdown-row">
                    <span>{monthlyHours.toFixed(1)} {t.calculator.breakdownHours}</span>
                    <span>× €{HOURLY_RATE}{t.calculator.breakdownRate}</span>
                    <span className="condo-calc-breakdown-val">€{basePrice.toFixed(0)}</span>
                  </div>
                  {addonLines.map((line, i) => (
                    <div key={i} className="condo-calc-breakdown-row condo-calc-addon-line">
                      <span>+ {line.label}</span>
                      <span className="condo-calc-breakdown-val">€{line.amount.toFixed(0)}</span>
                    </div>
                  ))}
                </div>

                <p className="condo-calc-disclaimer">{t.calculator.disclaimer}</p>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary-hero condo-calc-cta"
                >
                  <span>{t.calculator.ctaBtn}</span>
                  <ArrowRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Volume Discounts ─────────────────────────────────────────── */}
      <section className="landing-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">{t.volume.sectionTag}</span>
            <h2 className="section-title">{t.volume.sectionTitle}</h2>
          </div>
          <div className="condo-volume-grid">
            {t.volume.tiers.map((tier, i) => (
              <div key={i} className={`condo-volume-card ${tier.highlight ? 'highlight' : ''}`}>
                <span className="condo-volume-buildings">{tier.buildings}</span>
                <span className="condo-volume-rate">{tier.rate}</span>
                {tier.discount && <span className="condo-volume-badge">{tier.discount}</span>}
              </div>
            ))}
          </div>
          <p className="condo-volume-note">{t.volume.note}</p>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────── */}
      <section id="how-it-works" className="landing-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">{t.howItWorks.sectionTag}</span>
            <h2 className="section-title">{t.howItWorks.sectionTitle}</h2>
          </div>
          <div className="condo-steps-grid">
            {t.howItWorks.steps.map((step, i) => (
              <div key={i} className="condo-step-card">
                <span className="condo-step-num">{step.num}</span>
                <h3 className="condo-step-title">{step.title}</h3>
                <p className="condo-step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust Section ────────────────────────────────────────────── */}
      <section className="landing-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">{t.trust.sectionTitle}</h2>
          </div>
          <div className="condo-trust-grid">
            {t.trust.items.map((item, i) => (
              <div key={i} className="condo-trust-card">
                <div className="condo-trust-icon">{iconMap[item.icon]}</div>
                <h3 className="condo-trust-title">{item.title}</h3>
                <p className="condo-trust-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ Accordion ────────────────────────────────────────────── */}
      <section id="faq" className="landing-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">{t.faq.sectionTag}</span>
            <h2 className="section-title">{t.faq.sectionTitle}</h2>
          </div>
          <div className="faq-accordion-list">
            {t.faq.items.map((faq, i) => {
              const isOpen = openFaqs.includes(i);
              return (
                <div key={i} className={`faq-accordion-card ${isOpen ? 'open' : ''}`}>
                  <button
                    className="faq-accordion-trigger"
                    onClick={() => toggleFaq(i)}
                    aria-expanded={isOpen}
                  >
                    <span className="faq-question-text">{faq.q}</span>
                    <span className={`faq-plus-badge ${isOpen ? 'rotated' : ''}`}>
                      <Plus size={16} />
                    </span>
                  </button>
                  {isOpen && (
                    <div className="faq-accordion-body animate-fade-in">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer className="landing-footer">
        <div className="landing-footer-container">
          <div className="footer-left">
            <div className="landing-brand">
              <span className="brand-name">Impporta</span>
            </div>
            <p className="footer-tagline">{t.footer.tagline}</p>
          </div>

          <div className="footer-links">
            <div className="footer-column">
              <span className="footer-col-title">{t.footer.colServices}</span>
              <a href="#included">{lang === 'pt' ? 'Partes Comuns' : 'Common Areas'}</a>
              <a href="#calculator">{lang === 'pt' ? 'Simulador de Preço' : 'Price Calculator'}</a>
              <Link href="/">{t.footer.otherVertical}</Link>
            </div>
            <div className="footer-column">
              <span className="footer-col-title">{t.footer.colZones}</span>
              <span>Lisboa & Parque das Nações</span>
              <span>Cascais, Estoril & Carcavelos</span>
              <span>Oeiras, Paço de Arcos & Algés</span>
              <span>Sintra, Colares & Queluz</span>
              <span>Almada & Costa da Caparica</span>
            </div>
            <div className="footer-column">
              <span className="footer-col-title">{t.footer.colContact}</span>
              <a href={whatsappUrlGeneric} target="_blank" rel="noopener noreferrer">WhatsApp Support</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Impporta. {t.footer.rights}</p>
        </div>
      </footer>

      {/* ── Mobile Floating Bar ──────────────────────────────────────── */}
      <div className="mobile-floating-bar">
        <a
          href={whatsappUrlGeneric}
          target="_blank"
          rel="noopener noreferrer"
          className="mobile-floating-wa-btn"
          aria-label="WhatsApp"
        >
          <MessageSquare size={18} />
          <span>WhatsApp</span>
        </a>
        <button onClick={scrollToCalc} className="mobile-floating-trial-btn">
          <span>{t.nav.ctaBtn}</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
