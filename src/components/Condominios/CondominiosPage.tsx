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
  Star,
  TreePine,
  Droplets,
  Car,
  Check,
  Phone,
  AlertCircle,
} from 'lucide-react';

type Language = 'pt' | 'en';

/* --- Bilingual Dictionary -------------------------------------------- */
const translations = {
  pt: {
    brandSub: 'CONDOMÍNIOS & PRÉDIOS',
    nav: {
      included: 'O Que Inclui',
      calculator: 'Simulador',
      discounts: 'Descontos',
      howItWorks: 'Como Funciona',
      faq: 'FAQ',
      ctaBtn: 'Simular Custo',
      alVertical: 'Alojamento Local',
    },
    hero: {
      pill: 'Para Administradores e Gestores de Condomínio',
      headline1: 'O seu condomínio é a',
      headline2: 'primeira impressão',
      headline3: 'de quem visita',
      subtitle: 'Limpeza profissional e rigorosa de partes comuns (halls, escadas, elevadores) com preço transparente de 11 €/hora. Sem orçamentos escondidos e sem fidelização.',
      ctaCalc: 'Simular Custo Mensal',
      ctaWhatsApp: 'Falar no WhatsApp',
      guarantee: '✓ Preço transparente €11/h  •  ✓ Seguro de responsabilidade civil  •  ✓ Sem fidelização',
      stat1Num: '11 €/h',
      stat1Label: 'Base Transparente',
      stat1Desc: 'Sem taxas ocultas. Cálculo direto e justo por tempo real de limpeza.',
      stat2Num: '-15%',
      stat2Label: 'Desconto por Volume',
      stat2Desc: 'Tarifas especiais para gestoras e administradores com 5+ edifícios.',
      stat3Num: '100%',
      stat3Label: 'Flexibilidade Total',
      stat3Desc: 'Contratos sem período mínimo obrigatório. Cancele quando quiser.',
    },
    included: {
      tag: 'ÂMBITO DO SERVIÇO',
      title: 'Limpeza completa das partes comuns',
      subtitle: 'Tudo o que o seu prédio necessita para se manter impecável, higienizado e valorizado em cada visita.',
      items: [
        {
          icon: 'DoorOpen',
          title: 'Entrada & Hall Principal',
          desc: 'Pavimentos, tapetes de entrada, vidros da porta principal, intercomunicador, caixilharia e iluminação.',
        },
        {
          icon: 'ArrowUpDown',
          title: 'Escadas & Corrimãos',
          desc: 'Varredura e lavagem de todos os degraus, patamares intermédios e desinfeção profunda de corrimãos.',
        },
        {
          icon: 'Building2',
          title: 'Elevadores',
          desc: 'Limpeza de painéis interiores, botoneiras, espelhos, portas e aspiração das calhas metálicas.',
        },
        {
          icon: 'Layers',
          title: 'Corredores & Patamares',
          desc: 'Lavagem de pisos em todos os andares, limpeza de rodapés, portas de serviço e interruptores de luz.',
        },
        {
          icon: 'Mail',
          title: 'Zona de Caixas de Correio',
          desc: 'Higienização da frente das caixas postais, organização da área e remoção de publicidade abandonada.',
        },
        {
          icon: 'Sparkles',
          title: 'Vidros & Portas Comuns',
          desc: 'Limpeza de vidros das entradas, portas corta-fogo comuns e puxadores de contacto frequente.',
        },
      ],
      notIncludedTitle: 'Nota de Transparência — O que está disponível como Add-on:',
      notIncludedText: 'O serviço base cobre exclusivamente as partes comuns do edifício. Extras como garagens, jardins e piscinas são configuráveis no simulador abaixo. A limpeza do interior de apartamentos é um serviço separado (Alojamento Local).',
    },
    calculator: {
      tag: 'SIMULADOR ONLINE',
      title: 'Calcule a estimativa mensal do seu condomínio',
      subtitle: 'Sem formulários obrigatórios nem esperas por orçamentos. Ajuste as opções e veja o valor em tempo real.',
      step1Title: '1. Tamanho do Edifício',
      step2Title: '2. Frequência de Limpeza',
      step3Title: '3. Extras Opcionais',
      buildingOptions: [
        {
          value: 'small',
          title: 'Pequeno',
          sub: '2 a 4 pisos • até 8 frações',
          hoursText: '~1.25h por visita',
          hours: 1.25,
        },
        {
          value: 'medium',
          title: 'Médio',
          sub: '5 a 8 pisos • até 20 frações',
          hoursText: '~2.5h por visita',
          hours: 2.5,
        },
        {
          value: 'large',
          title: 'Grande',
          sub: '9+ pisos • mais de 20 frações',
          hoursText: '~4.0h por visita',
          hours: 4.0,
        },
      ],
      frequencyOptions: [
        { value: '1x', title: '1× / semana', sub: '~4.3 visitas/mês', visits: 4.33 },
        { value: '2x', title: '2× / semana', sub: '~8.7 visitas/mês', visits: 8.66, popular: true },
        { value: '3x', title: '3× / semana', sub: '~13 visitas/mês', visits: 13 },
        { value: 'daily', title: 'Diário (5×/sem)', sub: '~21.7 visitas/mês', visits: 21.67 },
      ],
      addons: [
        {
          id: 'garden',
          name: 'Manutenção de Jardim & Espaços Verdes',
          desc: 'Corte de relva, rega, limpeza de folhas e manutenção geral',
          priceTag: '+100 € / visita',
          type: 'per_visit',
          cost: 100,
          icon: 'TreePine',
        },
        {
          id: 'pool',
          name: 'Manutenção de Piscina do Condomínio',
          desc: 'Controlo de pH, cloro, aspiração e limpeza de filtros',
          priceTag: '+350 € / mês',
          type: 'monthly',
          cost: 350,
          icon: 'Droplets',
        },
        {
          id: 'garage',
          name: 'Limpeza de Garagem & Caves',
          desc: 'Varredura e lavagem mecanizada de piso de estacionamento (+1.5h)',
          priceTag: '+1.5h / visita',
          type: 'extra_hours',
          cost: 1.5,
          icon: 'Car',
        },
      ],
      badgeResult: 'Estimativa Mensal',
      perMonth: '/ mês',
      breakdownBaseLabel: 'Horas mensais estimadas',
      breakdownRateLabel: 'Tarifa base por hora',
      breakdownBaseTotal: 'Subtotal limpeza comum',
      disclaimer: 'Estimativa de referência para edifícios padrão. O valor final é confirmado após uma avaliação presencial gratuita ao edifício.',
      ctaBtn: 'Pedir Avaliação Presencial Gratuita',
      phoneHelp: 'Prefere falar agora? Ligue diretamente para',
    },
    discounts: {
      tag: 'GESTÃO DE CARTEIRAS',
      title: 'Preços especiais para empresas e gestoras de condomínio',
      subtitle: 'Administra múltiplos prédios? Reduza os custos operacionais com as nossas tabelas de volume.',
      tiers: [
        {
          buildings: '1 Edifício',
          rate: '11,00 €',
          per: '/ hora',
          saving: 'Tarifa Standard',
          target: 'Ideal para condomínios geridos diretamente pelos condóminos.',
          featured: false,
        },
        {
          buildings: '2 a 4 Edifícios',
          rate: '10,12 €',
          per: '/ hora',
          saving: 'Poupança de 8%',
          target: 'Para pequenas gestoras de propriedades e administradores com mais de um imóvel.',
          featured: false,
        },
        {
          buildings: '5 ou mais Edifícios',
          rate: '9,35 €',
          per: '/ hora',
          saving: 'Poupança de 15%',
          target: 'Para empresas profissionais de administração de condomínios.',
          featured: true,
          badge: 'Melhor Valor',
        },
      ],
    },
    howItWorks: {
      tag: 'PROCESSO SIMPLES',
      title: '4 passos para um condomínio impecável',
      subtitle: 'Sem burocracias nem reuniões intermináveis. Começamos a trabalhar quando o condomínio desejar.',
      steps: [
        {
          num: '01',
          title: 'Simulação Online',
          desc: 'Utilize o simulador acima para obter uma estimativa inicial em segundos.',
        },
        {
          num: '02',
          title: 'Visita de Avaliação Gratuita',
          desc: 'Visitamos o edifício em 15 minutos para confirmar áreas e necessidades específicas, sem qualquer custo.',
        },
        {
          num: '03',
          title: 'Plano & Horário à Medida',
          desc: 'Definimos os dias e horas que causam menor impacto na rotina dos moradores.',
        },
        {
          num: '04',
          title: 'Limpeza Contínua com Supervisão',
          desc: 'Equipa fixa dedicada com supervisão regular para garantir que o padrão nunca degrada.',
        },
      ],
    },
    trust: {
      tag: 'SEGURANÇA & CONFIANÇA',
      title: 'Porque os condomínios confiam na Impporta',
      subtitle: 'Proteção total para o administrador e total transparência para os condóminos.',
      items: [
        {
          icon: 'Shield',
          title: 'Seguro de Responsabilidade Civil',
          desc: 'Cobertura integral contra eventuais danos materiais durante os serviços em áreas comuns.',
        },
        {
          icon: 'Clock',
          title: 'Sem Fidelização Obrigatória',
          desc: 'Trabalhamos pela qualidade do nosso serviço, não por contratos que amarram o condomínio.',
        },
        {
          icon: 'Users',
          title: 'Equipas Fixas e Fardadas',
          desc: 'Profissionais de confiança que conhecem as regras e particularidades do seu prédio.',
        },
      ],
    },
    faq: {
      tag: 'DÚVIDAS FREQUENTES',
      title: 'Perguntas frequentes sobre limpeza de condomínio',
      items: [
        {
          q: 'Qual é a tarifa horária cobrada?',
          a: 'A nossa tarifa base é de 11,00 €/hora para 1 edifício. Para gestoras de condomínio com 2 a 4 edifícios o valor desce para 10,12 €/hora (-8%), e para 5 ou mais edifícios desce para 9,35 €/hora (-15%).',
        },
        {
          q: 'O valor do simulador é vinculativo?',
          a: 'O simulador apresenta uma estimativa rigorosa baseada em edifícios médios. O valor final é confirmado após uma breve visita gratuita de 15 minutos ao prédio para avaliar a disposição das escadas, garagens ou particularidades.',
        },
        {
          q: 'Os produtos e equipamentos de limpeza estão incluídos?',
          a: 'Sim, a Impporta fornece todos os produtos profissionais de limpeza, desinfetantes, panos de microfibra, baldes e aspiradores adequados a cada tipo de piso (mármore, cerâmica ou madeira).',
        },
        {
          q: 'Como é feito o controlo da assiduidade e qualidade?',
          a: 'As nossas equipas têm registo digital de entrada e saída em cada visita. Além disso, efetuamos vistorias periódicas de supervisão para assegurar que a qualidade se mantém constante ao longo dos meses.',
        },
        {
          q: 'Limpam o interior dos apartamentos?',
          a: 'Não neste serviço. Este serviço é estritamente dedicado às partes comuns (halls, escadas, elevadores). Para anfitriões com apartamentos em Alojamento Local / Airbnb, dispomos de um serviço especializado com faturação à parte.',
        },
        {
          q: 'Existe contrato de permanência obrigatória?',
          a: 'Não. Não exigimos períodos mínimos de fidelização. Acreditamos que a relação se constrói pela consistência da qualidade.',
        },
      ],
    },
    ctaBox: {
      title: 'Pronto para melhorar a limpeza do seu condomínio?',
      sub: 'Agende uma visita técnica de 15 minutos totalmente gratuita e sem compromisso. Confirmamos o orçamento no próprio dia.',
      btnPrimary: 'Pedir Avaliação Gratuita no WhatsApp',
      btnSecondary: 'Ligar (+351 927 322 095)',
    },
    footer: {
      tagline: 'Limpeza profissional de partes comuns e gestão de condomínios em Lisboa, Cascais, Oeiras, Sintra e arredores.',
      colServices: 'Serviços',
      colZones: 'Zonas Atendidas',
      colContact: 'Contacto',
      otherVertical: 'Alojamento Local / Airbnb',
      rights: 'Todos os direitos reservados.',
    },
  },
  en: {
    brandSub: 'CONDOMINIUMS & BUILDINGS',
    nav: {
      included: "What's Included",
      calculator: 'Calculator',
      discounts: 'Volume Discounts',
      howItWorks: 'How It Works',
      faq: 'FAQ',
      ctaBtn: 'Estimate Cost',
      alVertical: 'Short-Term Rental',
    },
    hero: {
      pill: 'For Condominium Administrators & Property Managers',
      headline1: 'Your building is the',
      headline2: 'first impression',
      headline3: 'for every visitor',
      subtitle: 'Professional common-area cleaning (lobbies, stairs, elevators) with transparent pricing at €11/hour. No hidden costs, no lock-in contracts.',
      ctaCalc: 'Calculate Monthly Cost',
      ctaWhatsApp: 'Chat on WhatsApp',
      guarantee: '✓ Transparent €11/h  •  ✓ Full liability insurance  •  ✓ No lock-in contracts',
      stat1Num: '€11 /h',
      stat1Label: 'Transparent Base Rate',
      stat1Desc: 'No hidden fees. Honest calculation based on actual cleaning time.',
      stat2Num: '-15%',
      stat2Label: 'Volume Discount',
      stat2Desc: 'Special rates for property managers handling 5+ buildings.',
      stat3Num: '100%',
      stat3Label: 'Total Flexibility',
      stat3Desc: 'No mandatory minimum duration. Cancel anytime with zero hassle.',
    },
    included: {
      tag: 'SCOPE OF SERVICE',
      title: 'Complete common-area building cleaning',
      subtitle: 'Everything your building needs to stay spotless, hygienic, and preserved on every visit.',
      items: [
        {
          icon: 'DoorOpen',
          title: 'Entrance & Main Lobby',
          desc: 'Floors, entrance mats, front glass doors, intercoms, doorframes, and lobby lighting.',
        },
        {
          icon: 'ArrowUpDown',
          title: 'Stairs & Handrails',
          desc: 'Sweeping and washing of all steps, landing platforms, and deep sanitization of handrails.',
        },
        {
          icon: 'Building2',
          title: 'Elevators',
          desc: 'Interior walls, control panels, mirrors, doors, and vacuuming of metal tracks.',
        },
        {
          icon: 'Layers',
          title: 'Corridors & Landings',
          desc: 'Floor washing on every story, baseboards, service doors, and light switches.',
        },
        {
          icon: 'Mail',
          title: 'Mailbox Area',
          desc: 'Cleaning of mailbox panels, organizing the space, and clearing abandoned junk mail.',
        },
        {
          icon: 'Sparkles',
          title: 'Common Glass & Doors',
          desc: 'Cleaning of common glass windows, fire doors, and high-frequency touch handles.',
        },
      ],
      notIncludedTitle: 'Transparency Note — Optional Add-ons Available:',
      notIncludedText: 'The baseline service covers common areas only. Extras such as underground garages, garden landscaping, and pool care can be toggled in the calculator below. Private apartment interior cleaning is a separate service (Airbnb / STR).',
    },
    calculator: {
      tag: 'ONLINE CALCULATOR',
      title: 'Estimate your building’s monthly cost',
      subtitle: 'No sign-ups or waiting for quotes. Adjust your building parameters and see the live estimate.',
      step1Title: '1. Building Size',
      step2Title: '2. Cleaning Frequency',
      step3Title: '3. Optional Add-ons',
      buildingOptions: [
        {
          value: 'small',
          title: 'Small Building',
          sub: '2 to 4 floors • up to 8 units',
          hoursText: '~1.25h per visit',
          hours: 1.25,
        },
        {
          value: 'medium',
          title: 'Medium Building',
          sub: '5 to 8 floors • up to 20 units',
          hoursText: '~2.5h per visit',
          hours: 2.5,
        },
        {
          value: 'large',
          title: 'Large Building',
          sub: '9+ floors • 20+ units',
          hoursText: '~4.0h per visit',
          hours: 4.0,
        },
      ],
      frequencyOptions: [
        { value: '1x', title: '1× / week', sub: '~4.3 visits/mo', visits: 4.33 },
        { value: '2x', title: '2× / week', sub: '~8.7 visits/mo', visits: 8.66, popular: true },
        { value: '3x', title: '3× / week', sub: '~13 visits/mo', visits: 13 },
        { value: 'daily', title: 'Daily (5×/wk)', sub: '~21.7 visits/mo', visits: 21.67 },
      ],
      addons: [
        {
          id: 'garden',
          name: 'Garden & Green Area Maintenance',
          desc: 'Lawn mowing, watering, leaf clearing, and general trimming',
          priceTag: '+€100 / visit',
          type: 'per_visit',
          cost: 100,
          icon: 'TreePine',
        },
        {
          id: 'pool',
          name: 'Condo Pool Maintenance',
          desc: 'pH control, chlorination, vacuuming, and filter cleaning',
          priceTag: '+€350 / month',
          type: 'monthly',
          cost: 350,
          icon: 'Droplets',
        },
        {
          id: 'garage',
          name: 'Garage & Basement Cleaning',
          desc: 'Sweeping and pressure washing of vehicle parking levels (+1.5h)',
          priceTag: '+1.5h / visit',
          type: 'extra_hours',
          cost: 1.5,
          icon: 'Car',
        },
      ],
      badgeResult: 'Estimated Monthly Total',
      perMonth: '/ month',
      breakdownBaseLabel: 'Estimated monthly hours',
      breakdownRateLabel: 'Base hourly rate',
      breakdownBaseTotal: 'Common area subtotal',
      disclaimer: 'Reference estimate for typical buildings. The final exact price is confirmed during a free on-site assessment.',
      ctaBtn: 'Request Free On-Site Assessment',
      phoneHelp: 'Prefer to speak directly? Call',
    },
    discounts: {
      tag: 'PORTFOLIO MANAGEMENT',
      title: 'Volume discounts for property management companies',
      subtitle: 'Managing multiple buildings? Reduce your operational overhead with our tiered volume pricing.',
      tiers: [
        {
          buildings: '1 Building',
          rate: '€11.00',
          per: '/ hour',
          saving: 'Standard Rate',
          target: 'Ideal for self-administered individual residential buildings.',
          featured: false,
        },
        {
          buildings: '2 to 4 Buildings',
          rate: '€10.12',
          per: '/ hour',
          saving: '8% Discount',
          target: 'For small property management firms and independent administrators.',
          featured: false,
        },
        {
          buildings: '5+ Buildings',
          rate: '€9.35',
          per: '/ hour',
          saving: '15% Discount',
          target: 'For commercial property management corporations and large portfolios.',
          featured: true,
          badge: 'Best Value',
        },
      ],
    },
    howItWorks: {
      tag: 'SIMPLE WORKFLOW',
      title: '4 steps to a pristine building',
      subtitle: 'Zero bureaucracy or endless meetings. We start whenever your building needs.',
      steps: [
        {
          num: '01',
          title: 'Online Estimate',
          desc: 'Use the calculator above to get an instant baseline estimate.',
        },
        {
          num: '02',
          title: 'Free On-Site Assessment',
          desc: 'We visit the property for 15 minutes to confirm details with zero obligation.',
        },
        {
          num: '03',
          title: 'Tailored Schedule',
          desc: 'We establish cleaning windows that minimize any disturbance to residents.',
        },
        {
          num: '04',
          title: 'Consistent Quality & Supervision',
          desc: 'Dedicated fixed team with periodic managerial checks so quality never drifts.',
        },
      ],
    },
    trust: {
      tag: 'TRUST & SAFETY',
      title: 'Why condominium administrators trust Impporta',
      subtitle: 'Complete protection for the administrator and total transparency for all residents.',
      items: [
        {
          icon: 'Shield',
          title: 'Comprehensive Liability Insurance',
          desc: 'Full coverage for any accidental damages in common areas during cleaning operations.',
        },
        {
          icon: 'Clock',
          title: 'No Lock-in Contracts',
          desc: 'We retain clients through the consistency of our work, not legal obligations.',
        },
        {
          icon: 'Users',
          title: 'Fixed, Uniformed Teams',
          desc: 'Vetted, reliable professionals who know the specific rules and layout of your building.',
        },
      ],
    },
    faq: {
      tag: 'FREQUENTLY ASKED QUESTIONS',
      title: 'Common questions about building cleaning',
      items: [
        {
          q: 'What is your hourly rate?',
          a: 'Our baseline rate is €11.00/hour for 1 building. For property managers with 2–4 buildings, it drops to €10.12/hour (-8%), and for 5+ buildings it drops to €9.35/hour (-15%).',
        },
        {
          q: 'Is the calculator estimate binding?',
          a: 'The calculator provides an accurate estimate based on standard building layouts. The final price is confirmed following a quick, free 15-minute on-site assessment.',
        },
        {
          q: 'Are cleaning products and equipment included?',
          a: 'Yes, Impporta supplies all professional-grade cleaning chemicals, disinfectants, microfiber materials, and floor equipment suited for marble, ceramic, and wood surfaces.',
        },
        {
          q: 'How do you monitor attendance and quality?',
          a: 'Our teams check in and out digitally on every visit. Furthermore, our supervisors conduct routine inspections to guarantee consistent 5-star standards.',
        },
        {
          q: 'Do you clean private apartment interiors?',
          a: 'Not under this service. This contract strictly covers common residential areas (halls, stairs, elevators). For short-term rental / Airbnb turnover, we have a specialized division.',
        },
        {
          q: 'Is there a minimum contract commitment?',
          a: 'No. We do not enforce lock-in durations. You can cancel at any time if our service does not meet your expectations.',
        },
      ],
    },
    ctaBox: {
      title: 'Ready to elevate the cleanliness of your building?',
      sub: 'Schedule a free 15-minute on-site assessment with zero obligation. We provide the final proposal on the same day.',
      btnPrimary: 'Request Free Assessment on WhatsApp',
      btnSecondary: 'Call (+351 927 322 095)',
    },
    footer: {
      tagline: 'Professional common-area cleaning and facility management for condominiums across Lisbon, Cascais, Oeiras, Sintra & surrounds.',
      colServices: 'Services',
      colZones: 'Regions Covered',
      colContact: 'Contact',
      otherVertical: 'Airbnb & Short-Term Rental',
      rights: 'All rights reserved.',
    },
  },
};

/* --- Icon Component Map ---------------------------------------------- */
function renderIcon(name: string) {
  switch (name) {
    case 'DoorOpen': return <DoorOpen size={22} />;
    case 'ArrowUpDown': return <ArrowUpDown size={22} />;
    case 'Building2': return <Building2 size={22} />;
    case 'Layers': return <Layers size={22} />;
    case 'Mail': return <Mail size={22} />;
    case 'Shield': return <Shield size={22} />;
    case 'Clock': return <Clock size={22} />;
    case 'Users': return <Users size={22} />;
    case 'TreePine': return <TreePine size={20} />;
    case 'Droplets': return <Droplets size={20} />;
    case 'Car': return <Car size={20} />;
    default: return <CheckCircle2 size={22} />;
  }
}

const HOURLY_RATE = 11;
const WHATSAPP_NUM = '351927322095';

export default function CondominiosPage() {
  const [lang, setLang] = useState<Language>('pt');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaqs, setOpenFaqs] = useState<number[]>([0]);

  // Calculator State
  const [buildingSize, setBuildingSize] = useState('medium');
  const [frequency, setFrequency] = useState('2x');
  const [addons, setAddons] = useState<Record<string, boolean>>({
    garden: false,
    pool: false,
    garage: false,
  });

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

  const toggleFaq = (index: number) => {
    setOpenFaqs((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const toggleAddon = (id: string) => {
    setAddons((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const t = translations[lang];

  // Calculation Math
  const currentBuilding =
    t.calculator.buildingOptions.find((b) => b.value === buildingSize) ||
    t.calculator.buildingOptions[1];
  const currentFreq =
    t.calculator.frequencyOptions.find((f) => f.value === frequency) ||
    t.calculator.frequencyOptions[1];

  const garageExtra = addons.garage ? 1.5 : 0;
  const hoursPerVisit = currentBuilding.hours + garageExtra;
  const visitsPerMonth = currentFreq.visits;
  const monthlyCleaningHours = hoursPerVisit * visitsPerMonth;
  const baseMonthlyPrice = monthlyCleaningHours * HOURLY_RATE;

  let addonMonthlyCost = 0;
  const activeAddonLines: { name: string; cost: number }[] = [];

  if (addons.garden) {
    const gardenTotal = 100 * visitsPerMonth;
    addonMonthlyCost += gardenTotal;
    activeAddonLines.push({
      name: lang === 'pt' ? `Jardim (${visitsPerMonth.toFixed(1)}x/mês)` : `Garden (${visitsPerMonth.toFixed(1)}x/mo)`,
      cost: gardenTotal,
    });
  }

  if (addons.pool) {
    addonMonthlyCost += 350;
    activeAddonLines.push({
      name: lang === 'pt' ? 'Piscina (mensal)' : 'Pool (monthly)',
      cost: 350,
    });
  }

  if (addons.garage) {
    activeAddonLines.push({
      name: lang === 'pt' ? `Garagem (+1.5h/visita incluído)` : `Garage (+1.5h/visit included)`,
      cost: 1.5 * visitsPerMonth * HOURLY_RATE,
    });
  }

  const estimatedTotal = baseMonthlyPrice + (addons.garden ? 100 * visitsPerMonth : 0) + (addons.pool ? 350 : 0);

  // Dynamic WhatsApp Booking Link
  const selectedAddonsText = [
    addons.garage ? (lang === 'pt' ? 'Garagem (+1.5h)' : 'Garage (+1.5h)') : null,
    addons.garden ? (lang === 'pt' ? 'Jardim' : 'Garden') : null,
    addons.pool ? (lang === 'pt' ? 'Piscina' : 'Pool') : null,
  ]
    .filter(Boolean)
    .join(', ');

  const whatsappText = encodeURIComponent(
    lang === 'pt'
      ? `Olá! Gostaria de pedir uma avaliação presencial gratuita para limpeza de condomínio:\n\n• Prédio: ${currentBuilding.title} (${currentBuilding.sub})\n• Frequência: ${currentFreq.title}\n• Extras: ${selectedAddonsText || 'Nenhum'}\n• Estimativa Calculada: €${estimatedTotal.toFixed(0)}/mês (${monthlyCleaningHours.toFixed(1)}h/mês)`
      : `Hello! I would like to request a free on-site assessment for building cleaning:\n\n• Building: ${currentBuilding.title} (${currentBuilding.sub})\n• Frequency: ${currentFreq.title}\n• Add-ons: ${selectedAddonsText || 'None'}\n• Estimated Cost: €${estimatedTotal.toFixed(0)}/month (${monthlyCleaningHours.toFixed(1)}h/mo)`
  );

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUM}?text=${whatsappText}`;
  const whatsappUrlGeneric = `https://wa.me/${WHATSAPP_NUM}`;

  const scrollToCalculator = () => {
    document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="landing-root">
      {/* -- Sticky Header ----------------------------------------------- */}
      <header className="landing-header">
        <div className="landing-header-container">
          <div className="landing-brand">
            <div className="brand-text-group">
              <span className="brand-name">Impporta</span>
              <span className="brand-sub">{t.brandSub}</span>
            </div>
          </div>

          {/* Vertical Toggle — Prominent Switcher */}
          <div className="header-vertical-toggle">
            <Link href="/" className="vertical-toggle-btn">
              <span className="vertical-toggle-icon">🏠</span>
              <span className="vertical-toggle-label">{lang === 'pt' ? 'Alojamento Local' : 'Airbnb & AL'}</span>
            </Link>
            <Link href="/condominios" className="vertical-toggle-btn active">
              <span className="vertical-toggle-icon">🏢</span>
              <span className="vertical-toggle-label">{lang === 'pt' ? 'Condomínios' : 'Condominiums'}</span>
              <span className="vertical-toggle-pill">€11/h</span>
            </Link>
          </div>

          <nav className="landing-nav">
            <a href="#included" className="nav-item">{t.nav.included}</a>
            <a href="#calculator" className="nav-item">{t.nav.calculator}</a>
            <a href="#discounts" className="nav-item">{t.nav.discounts}</a>
            <a href="#faq" className="nav-item">{t.nav.faq}</a>
          </nav>

          <div className="landing-header-actions">
            {/* Language Toggle */}
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

            <button onClick={scrollToCalculator} className="btn-trial-nav hidden-mobile">
              {t.nav.ctaBtn}
            </button>

            {/* Mobile Hamburger Toggle Button */}
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
            {/* Prominent Vertical Switcher in Mobile Drawer */}
            <div className="mobile-drawer-service-selector">
              <span className="mobile-drawer-label">{lang === 'pt' ? 'Serviço Ativo:' : 'Current Service:'}</span>
              <div className="mobile-service-cards">
                <Link
                  href="/"
                  className="mobile-service-card"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="service-card-icon">🏠</span>
                  <div className="service-card-info">
                    <span className="service-card-title">Alojamento Local / Airbnb</span>
                    <span className="service-card-desc">{lang === 'pt' ? 'Turnover e proteção 5★ entre hóspedes' : 'Turnover cleaning & 5-star protection'}</span>
                  </div>
                </Link>
                <Link
                  href="/condominios"
                  className="mobile-service-card active"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="service-card-icon">🏢</span>
                  <div className="service-card-info">
                    <span className="service-card-title">{lang === 'pt' ? 'Condomínios & Prédios' : 'Condominiums & Buildings'}</span>
                    <span className="service-card-desc">{lang === 'pt' ? 'Limpeza de partes comuns a €11/hora' : 'Common-area cleaning at €11/hour'}</span>
                  </div>
                  <Check size={16} className="text-accent" />
                </Link>
              </div>
            </div>

            <nav className="mobile-drawer-nav">
              <a
                href="#included"
                className="mobile-nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.nav.included}
              </a>
              <a
                href="#calculator"
                className="mobile-nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.nav.calculator}
              </a>
              <a
                href="#discounts"
                className="mobile-nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.nav.discounts}
              </a>
              <a
                href="#how-it-works"
                className="mobile-nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.nav.howItWorks}
              </a>
              <a
                href="#faq"
                className="mobile-nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.nav.faq}
              </a>
            </nav>

            <div className="mobile-drawer-actions">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  scrollToCalculator();
                }}
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

      {/* -- Hero Section -------------------------------------------------- */}
      <section className="hero-section">
        <div className="hero-glow-blob" />
        <div className="hero-container">
          <div className="hero-pill animate-fade-in">
            <span className="pill-dot" />
            <span className="pill-text">{t.hero.pill}</span>
          </div>

          <h1 className="hero-headline">
            {t.hero.headline1} <br />
            <span className="hero-gradient-condo">{t.hero.headline2}</span> <br />
            {t.hero.headline3}
          </h1>

          <p className="hero-subheadline">{t.hero.subtitle}</p>

          <div className="hero-cta-group">
            <button onClick={scrollToCalculator} className="btn-primary-hero">
              <span>{t.hero.ctaCalc}</span>
              <ArrowRight size={18} />
            </button>
            <a
              href={whatsappUrlGeneric}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary-hero"
            >
              <MessageSquare size={18} className="text-accent" />
              <span>{t.hero.ctaWhatsApp}</span>
            </a>
          </div>

          <div className="hero-guarantee-note">
            <CheckCircle2 size={15} className="text-accent" />
            <span>{t.hero.guarantee}</span>
          </div>

          {/* Hero Highlights / Stat Cards */}
          <div className="hero-stats-banner">
            <div className="stat-card-hero stat-solution">
              <div className="stat-icon-wrapper text-accent">
                <Building2 size={20} />
              </div>
              <div className="stat-content">
                <div className="stat-number text-accent">{t.hero.stat1Num}</div>
                <div className="stat-label">{t.hero.stat1Label}</div>
                <div className="stat-desc">{t.hero.stat1Desc}</div>
              </div>
            </div>

            <div className="stat-card-hero">
              <div className="stat-icon-wrapper text-warning">
                <Star size={20} />
              </div>
              <div className="stat-content">
                <div className="stat-number text-warning">{t.hero.stat2Num}</div>
                <div className="stat-label">{t.hero.stat2Label}</div>
                <div className="stat-desc">{t.hero.stat2Desc}</div>
              </div>
            </div>

            <div className="stat-card-hero stat-solution">
              <div className="stat-icon-wrapper text-accent">
                <Shield size={20} />
              </div>
              <div className="stat-content">
                <div className="stat-number text-accent">{t.hero.stat3Num}</div>
                <div className="stat-label">{t.hero.stat3Label}</div>
                <div className="stat-desc">{t.hero.stat3Desc}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -- What's Included (Partes Comuns) ------------------------------- */}
      <section id="included" className="section-wrapper bg-surface-alt">
        <div className="content-container">
          <div className="section-heading-center">
            <div className="section-tag">{t.included.tag}</div>
            <h2 className="section-title">{t.included.title}</h2>
            <p className="section-subtitle">{t.included.subtitle}</p>
          </div>

          <div className="condo-feature-grid">
            {t.included.items.map((item, i) => (
              <div key={i} className="condo-feature-card">
                <div className="condo-feature-icon-box">{renderIcon(item.icon)}</div>
                <h3 className="condo-feature-title">{item.title}</h3>
                <p className="condo-feature-desc">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Not Included / Add-ons Notice */}
          <div className="condo-not-included-banner">
            <div className="condo-not-included-header">
              <AlertCircle size={18} className="text-warning flex-shrink-0" />
              <span className="condo-not-included-title">{t.included.notIncludedTitle}</span>
            </div>
            <p className="condo-feature-desc" style={{ margin: 0 }}>{t.included.notIncludedText}</p>
            <div className="condo-not-included-pills">
              <div className="condo-not-included-pill">
                <span className="badge-tag">Jardim:</span> ~100 €/visita
              </div>
              <div className="condo-not-included-pill">
                <span className="badge-tag">Piscina:</span> ~350 €/mês
              </div>
              <div className="condo-not-included-pill">
                <span className="badge-tag">Garagem:</span> +1.5h/visita
              </div>
              <div className="condo-not-included-pill">
                <span className="badge-tag">Apartamentos:</span> Ver Alojamento Local
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -- Interactive Live Pricing Calculator --------------------------- */}
      <section id="calculator" className="section-wrapper">
        <div className="content-container">
          <div className="section-heading-center">
            <div className="section-tag">{t.calculator.tag}</div>
            <h2 className="section-title">{t.calculator.title}</h2>
            <p className="section-subtitle">{t.calculator.subtitle}</p>
          </div>

          <div className="condo-calc-wrapper">
            {/* Left Column: Interactive Controls */}
            <div className="condo-calc-inputs">
              {/* Step 1: Building Size */}
              <div className="condo-calc-card">
                <div className="condo-calc-step-header">
                  <span className="condo-calc-step-num">1</span>
                  <span className="condo-calc-step-title">{t.calculator.step1Title}</span>
                </div>
                <div className="condo-size-grid">
                  {t.calculator.buildingOptions.map((opt) => {
                    const isSelected = buildingSize === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        className={`condo-size-btn ${isSelected ? 'active' : ''}`}
                        onClick={() => setBuildingSize(opt.value)}
                      >
                        <span className="condo-size-title">{opt.title}</span>
                        <span className="condo-size-sub">{opt.sub}</span>
                        <span className="condo-size-hours">{opt.hoursText}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Frequency */}
              <div className="condo-calc-card">
                <div className="condo-calc-step-header">
                  <span className="condo-calc-step-num">2</span>
                  <span className="condo-calc-step-title">{t.calculator.step2Title}</span>
                </div>
                <div className="condo-freq-grid">
                  {t.calculator.frequencyOptions.map((freqOpt) => {
                    const isSelected = frequency === freqOpt.value;
                    return (
                      <button
                        key={freqOpt.value}
                        type="button"
                        className={`condo-freq-btn ${isSelected ? 'active' : ''}`}
                        onClick={() => setFrequency(freqOpt.value)}
                      >
                        <span className="condo-freq-title">{freqOpt.title}</span>
                        <span className="condo-freq-sub">{freqOpt.sub}</span>
                        {freqOpt.popular && (
                          <span className="condo-freq-popular">
                            {lang === 'pt' ? 'Popular' : 'Popular'}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Optional Add-ons */}
              <div className="condo-calc-card">
                <div className="condo-calc-step-header">
                  <span className="condo-calc-step-num">3</span>
                  <span className="condo-calc-step-title">{t.calculator.step3Title}</span>
                </div>
                <div className="condo-addon-list">
                  {t.calculator.addons.map((addon) => {
                    const isChecked = addons[addon.id] || false;
                    return (
                      <div
                        key={addon.id}
                        className={`condo-addon-card ${isChecked ? 'active' : ''}`}
                        onClick={() => toggleAddon(addon.id)}
                      >
                        <div className="condo-addon-left">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="condo-addon-checkbox"
                          />
                          <div>
                            <div className="condo-addon-name">{addon.name}</div>
                            <div className="condo-addon-desc">{addon.desc}</div>
                          </div>
                        </div>
                        <div className="condo-addon-price-badge">{addon.priceTag}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Live Result Box */}
            <div className="condo-calc-result-sticky">
              <div className="condo-calc-result-box">
                <div className="condo-calc-result-badge">
                  <CheckCircle2 size={14} />
                  <span>{t.calculator.badgeResult}</span>
                </div>

                <div className="condo-calc-price-wrap">
                  <span className="condo-calc-currency">€</span>
                  <span className="condo-calc-amount">{estimatedTotal.toFixed(0)}</span>
                  <span className="condo-calc-period">{t.calculator.perMonth}</span>
                </div>

                {/* Transparent Math Breakdown */}
                <div className="condo-calc-breakdown-list">
                  <div className="condo-calc-breakdown-item">
                    <span>{t.calculator.breakdownBaseLabel}:</span>
                    <span className="val">{monthlyCleaningHours.toFixed(1)} h/{lang === 'pt' ? 'mês' : 'mo'}</span>
                  </div>
                  <div className="condo-calc-breakdown-item">
                    <span>{t.calculator.breakdownRateLabel}:</span>
                    <span className="val">€{HOURLY_RATE.toFixed(2)}/h</span>
                  </div>
                  <div className="condo-calc-breakdown-item">
                    <span>{t.calculator.breakdownBaseTotal}:</span>
                    <span className="val">€{baseMonthlyPrice.toFixed(0)}</span>
                  </div>
                  {activeAddonLines.map((line, idx) => (
                    <div key={idx} className="condo-calc-breakdown-item accent">
                      <span>+ {line.name}:</span>
                      <span className="val">€{line.cost.toFixed(0)}</span>
                    </div>
                  ))}
                </div>

                <p className="condo-calc-note">{t.calculator.disclaimer}</p>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-calc-submit"
                >
                  <span>{t.calculator.ctaBtn}</span>
                  <ArrowRight size={18} />
                </a>

                <div className="condo-calc-phone-link">
                  <span>{t.calculator.phoneHelp} </span>
                  <a href={`tel:+${WHATSAPP_NUM}`}>+351 927 322 095</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -- Volume Discounts for Property Managers ------------------------ */}
      <section id="discounts" className="section-wrapper bg-surface-alt">
        <div className="content-container">
          <div className="section-heading-center">
            <div className="section-tag">{t.discounts.tag}</div>
            <h2 className="section-title">{t.discounts.title}</h2>
            <p className="section-subtitle">{t.discounts.subtitle}</p>
          </div>

          <div className="condo-volume-grid">
            {t.discounts.tiers.map((tier, i) => (
              <div
                key={i}
                className={`condo-volume-card ${tier.featured ? 'featured' : ''}`}
              >
                {tier.badge && <div className="condo-volume-badge-top">{tier.badge}</div>}
                <div className="condo-volume-buildings">{tier.buildings}</div>
                <div className="condo-volume-rate">
                  {tier.rate} <span className="per">{tier.per}</span>
                </div>
                <div className="condo-volume-saving">{tier.saving}</div>
                <p className="condo-volume-target">{tier.target}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -- How It Works (4 Simple Steps) --------------------------------- */}
      <section id="how-it-works" className="section-wrapper">
        <div className="content-container">
          <div className="section-heading-center">
            <div className="section-tag">{t.howItWorks.tag}</div>
            <h2 className="section-title">{t.howItWorks.title}</h2>
            <p className="section-subtitle">{t.howItWorks.subtitle}</p>
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

      {/* -- Trust Pillars & Security -------------------------------------- */}
      <section className="section-wrapper bg-surface-alt">
        <div className="content-container">
          <div className="section-heading-center">
            <div className="section-tag">{t.trust.tag}</div>
            <h2 className="section-title">{t.trust.title}</h2>
            <p className="section-subtitle">{t.trust.subtitle}</p>
          </div>

          <div className="condo-trust-grid">
            {t.trust.items.map((item, i) => (
              <div key={i} className="condo-trust-card">
                <div className="condo-trust-icon">{renderIcon(item.icon)}</div>
                <h3 className="condo-trust-title">{item.title}</h3>
                <p className="condo-trust-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -- FAQ Section --------------------------------------------------- */}
      <section id="faq" className="section-wrapper">
        <div className="content-container">
          <div className="section-heading-center">
            <div className="section-tag">{t.faq.tag}</div>
            <h2 className="section-title">{t.faq.title}</h2>
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

      {/* -- Final Conversion CTA Box -------------------------------------- */}
      <section className="section-wrapper bg-surface-alt">
        <div className="content-container">
          <div className="condo-cta-box">
            <div className="condo-cta-content">
              <h2 className="condo-cta-title">{t.ctaBox.title}</h2>
              <p className="condo-cta-sub">{t.ctaBox.sub}</p>
            </div>
            <div className="condo-cta-actions">
              <a
                href={whatsappUrlGeneric}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary-hero"
              >
                <MessageSquare size={18} />
                <span>{t.ctaBox.btnPrimary}</span>
              </a>
              <a href={`tel:+${WHATSAPP_NUM}`} className="btn-secondary-hero">
                <Phone size={18} className="text-accent" />
                <span>{t.ctaBox.btnSecondary}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* -- Footer -------------------------------------------------------- */}
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
              <a href="#discounts">{lang === 'pt' ? 'Descontos de Volume' : 'Volume Rates'}</a>
              <Link href="/" style={{ color: 'var(--accent)', fontWeight: 700 }}>
                {t.footer.otherVertical}
              </Link>
            </div>
            <div className="footer-column">
              <span className="footer-col-title">{t.footer.colZones}</span>
              <span>Lisboa & Parque das Nações</span>
              <span>Cascais, Estoril & Carcavelos</span>
              <span>Oeiras, Paço de Arcos & Algés</span>
              <span>Sintra, Colares & Queluz</span>
              <span>Almada & Margem Sul</span>
            </div>
            <div className="footer-column">
              <span className="footer-col-title">{t.footer.colContact}</span>
              <a href={whatsappUrlGeneric} target="_blank" rel="noopener noreferrer">
                WhatsApp (+351 927 322 095)
              </a>
              <a href={`tel:+${WHATSAPP_NUM}`}>+351 927 322 095</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Impporta. {t.footer.rights}</p>
        </div>
      </footer>

      {/* -- Mobile Sticky Floating Bottom CTA Bar ------------------------ */}
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
        <button onClick={scrollToCalculator} className="mobile-floating-trial-btn">
          <span>{t.nav.ctaBtn}</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
