'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Camera,
  AlertTriangle,
  Sparkles,
  Calendar,
  MessageSquare,
  ArrowRight,
  Layers,
  Shield,
  Zap,
  Coffee,
  Check,
  MapPin,
  Flame,
  KeyRound,
  FileCheck,
  Globe,
  ChevronDown
} from 'lucide-react';

type Language = 'pt' | 'en';

function CustomSelect({
  value,
  options,
  onChange,
}: {
  value: string;
  options: { label: string; value: string }[];
  onChange: (val: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((o) => o.value === value) || options[0];

  return (
    <div className="custom-select-wrapper" ref={dropdownRef}>
      <button
        type="button"
        className={`custom-select-btn ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="select-text">{selectedOption?.label}</span>
        <ChevronDown size={15} className={`select-chevron ${isOpen ? 'open' : ''}`} />
      </button>

      {isOpen && (
        <div className="custom-select-dropdown animate-fade-in">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                className={`custom-select-option ${isSelected ? 'selected' : ''}`}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
              >
                <span>{opt.label}</span>
                {isSelected && <Check size={14} className="text-accent" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function LandingPage() {
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

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    units: '1 unit',
    neighborhood: 'Baixa / Chiado',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const neighborhoods = [
    'Baixa / Chiado',
    'Alfama / Castelo',
    'Bairro Alto / Misericórdia',
    'Príncipe Real',
    'Arroios / Anjos',
    'Campo de Ourique / Estrela',
    'Avenidas Novas / Saldanha',
    'Santos / Alcântara',
    'Belém / Ajuda',
    'Parque das Nações',
    lang === 'pt' ? 'Outra zona na Grande Lisboa' : 'Other in Greater Lisbon',
  ];

  const submittedWhatsAppMessage = encodeURIComponent(
    lang === 'pt'
      ? `Olá! Gostaria de pedir a primeira limpeza gratuita para o meu Alojamento Local.\n\n👤 Nome: ${formData.name}\n📱 Contacto: ${formData.phone}\n🏠 Unidades: ${formData.units}\n📍 Bairro: ${formData.neighborhood}`
      : `Hello! I would like to request the first free turnover clean for my short-term rental.\n\n👤 Name: ${formData.name}\n📱 Phone: ${formData.phone}\n🏠 Units: ${formData.units}\n📍 Neighborhood: ${formData.neighborhood}`
  );
  const submittedWhatsAppUrl = `https://wa.me/351927322095?text=${submittedWhatsAppMessage}`;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setFormSubmitted(true);
    if (typeof window !== 'undefined') {
      window.open(submittedWhatsAppUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const whatsappMessage = encodeURIComponent(
    lang === 'pt'
      ? `Olá! Gostaria de experimentar a primeira limpeza gratuita para o meu Alojamento Local (${formData.units}) em ${formData.neighborhood}.`
      : `Hello! I would like to try the first free turnover clean for my short-term rental (${formData.units}) in ${formData.neighborhood}.`
  );
  const whatsappUrl = `https://wa.me/351927322095?text=${whatsappMessage}`;

  const scrollToForm = () => {
    const el = document.getElementById('claim-trial');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Slider interaction
  const handleSliderMove = (clientX: number, rect: DOMRect) => {
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPosition(percent);
  };

  const t = {
    pt: {
      brandSub: 'Limpeza de Alojamento Local Lisboa',
      nav: {
        whyUs: 'Porquê Nós',
        inclusions: 'O Que Inclui',
        pricing: 'Preços',
        howItWorks: 'Como Funciona',
        faq: 'Perguntas Frequentes',
        freeCleanBtn: '1ª Limpeza Grátis',
      },
      hero: {
        pill: 'Concebido para Anfitriões de Airbnb & AL com 1–5 Unidades em Lisboa',
        headlinePart1: 'A sua próxima avaliação de 1 estrela',
        headlinePart2: 'começa na casa de banho.',
        subheadline: 'Um turnover mal feito não perde apenas um hóspede — perde os próximos dez. Protegemos a sua receita de AL com limpezas 100% verificadas por foto, padrão de hotel e com entrega garantida antes do check-in das 15:00.',
        ctaPrimary: 'Pedir 1ª Limpeza Gratuita',
        ctaSecondary: 'Falar por WhatsApp',
        guarantee: 'Sem contratos de fidelização · Cancele quando quiser',
      },
      stats: {
        stat1Num: '~3.000 €',
        stat1Label: 'Custo de 1 Mau Turnover',
        stat1Desc: 'Média de receita perdida por anfitrião em reembolsos, cancelamentos e queda no algoritmo do Airbnb.',
        stat2Num: '-15% a -20%',
        stat2Label: 'Queda nas Reservas',
        stat2Desc: 'Causada por uma simples descida de 0.5 estrelas na pontuação de limpeza em plataformas de AL.',
        stat3Num: '100% Verificado',
        stat3Label: 'Fotos & Relatório de Danos',
        stat3Desc: 'Verificação fotográfica com carimbo de data/hora enviada para o seu telemóvel antes da entrada do hóspede.',
      },
      pain: {
        tag: 'A Realidade do Alojamento Local',
        title: 'Porque é que as limpezas tradicionais falham no AL em Lisboa',
        subtitle: 'As limpezas domésticas funcionam com rotinas semanais. O Alojamento Local exige turnovers rápidos e rigorosos, onde um único cabelo esquecido arruína o estatuto de Superhost.',
        card1Badge: 'Janela Apertada',
        card1Title: 'A janela impossível das 10h às 15h',
        card1Text: 'Checkout às 10h00, novo check-in às 15h00. Sem margem para erros, sem atrasos e sem tempo para ter de atravessar Lisboa para corrigir falhas.',
        card2Badge: 'Roleta de Qualidade',
        card2Title: 'Qualidade inconsistente em cada limpeza',
        card2Text: 'Uma limpeza corre bem, a seguinte deixa camas mal feitas ou pó. Não devia ter de inspecionar fisicamente cada unidade para poder dormir tranquilo.',
        card3Badge: 'Zero Provas',
        card3Title: 'Sem visibilidade quando está longe',
        card3Text: 'Recebe apenas uma mensagem a dizer "feito", mas e o frigorífico, os lençóis ou o ralo? Precisa de prova fotográfica, não de confiança cega.',
        card4Badge: 'Horários Rígidos',
        card4Title: 'Horários rígidos de 9h às 17h não servem o AL',
        card4Text: 'Reservas de última hora, check-ins antecipados e turnovers seguidos não funcionam com empresas convencionais. Adaptamo-nos ao seu calendário.',
      },
      slider: {
        tag: 'Padrão Visual de Entrega',
        title: 'Do caos pós-checkout ao padrão 5 estrelas pronto para o hóspede',
        subtitle: 'Arraste a barra interativa abaixo para inspecionar o nosso padrão de turnover.',
        readyBadge: '14:30 — Padrão 5 Estrelas Pronto',
        tagReady1: 'Cantos de cama com dobra de hotel',
        tagReady2: 'Amenities e café repostos',
        tagReady3: 'Casa de banho e espelhos imaculados',
        tagReady4: 'Relatório de danos verificado',
        messyBadge: '10:05 — Caos Pós-Checkout do Hóspede',
        tagMessy1: 'Lençóis amarrotados e toalhas usadas',
        tagMessy2: 'Frascos vazios e lixo por despejar',
        tagMessy3: 'Marcas de água e cabelos esquecidos',
        note: 'Arraste a barra horizontalmente para comparar o resultado do turnover',
      },
      inclusions: {
        tag: 'Pacote Completo de Turnover',
        title: 'O que está incluído em cada limpeza',
        subtitle: 'Cada turnover é executado com base numa lista de verificação de 42 pontos criada para proteger o seu estatuto de Superhost.',
        card1Title: 'Limpeza Profunda de Turnover',
        card1Desc: 'Cozinha impecável, desinfeção de casas de banho, chão sem cabelos, rodapés limpos e espelhos brilhantes em todo o apartamento.',
        card1Tag: 'Incluído em todas as limpezas',
        card2Title: 'Camas Feitas com Padrão de Hotel',
        card2Desc: 'Troca de roupa de cama com cantos hospitalares dobrados, almofadas afofadas e conjuntos de toalhas organizados sobre a cama.',
        card2Tag: 'Padrão de hotelaria',
        card3Title: 'Reposição de Consumíveis',
        card3Desc: 'Produtos de higiene, cápsulas de café, chá e papel fornecidos pelo anfitrião repostos de raiz (pack de abastecimento opcional disponível).',
        card3Tag: 'Consumíveis do anfitrião ou pack extra',
        card4Title: 'Lista de Verificação com Fotos',
        card4Desc: 'Fotografias de alta resolução de cada divisão enviadas para o seu WhatsApp imediatamente após a conclusão do turnover.',
        card4Tag: '100% de prova no seu telemóvel',
        card5Title: 'Relatório de Danos Pré-Chegada',
        card5Desc: 'Documentamos qualquer dano, quebras ou anomalias com fotos antes da chegada do próximo hóspede para proteger o seu depósito no Airbnb.',
        card5Tag: 'Protege os seus pedidos no AirCover',
        card6Title: 'Profissionais Verificados e Especializados',
        card6Desc: 'Profissionais com antecedentes verificados e formação especializada em Alojamento Local e hotelaria.',
        card6Tag: 'Equipa de Confiança',
      },
      pricing: {
        tag: 'Tabela de Preços Transparente',
        title: 'Preços fixos e transparentes por turnover',
        subtitle: 'Sem orçamentos escondidos nem taxas surpresa de fim de semana. Conheça o seu custo exato de limpeza antes de marcar.',
        perTurnover: '/ turnover',
        t0Badge: 'Estúdio / AL',
        t0Title: 'Estúdio / T0',
        t1Badge: '1 Quarto',
        t1Title: 'Apartamento T1',
        t1Ribbon: 'Mais Comum em Lisboa',
        t2Badge: '2 Quartos',
        t2Title: 'Apartamento T2',
        t3Badge: '3 Quartos',
        t3Title: 'Apartamento T3',
        featureFullClean: 'Limpeza completa de turnover',
        featureBedLinen: 'Troca e arrumação de roupa de cama',
        featurePhotoChecklist: 'Relatório fotográfico no WhatsApp',
        featureDamageReport: 'Verificação e relatório de danos',
        featureT1Full: 'Quarto, sala, casa de banho e cozinha',
        featureT2Beds: 'Até 2 quartos e 2 casas de banho',
        featureT3Large: 'Unidade grande e desinfeção profunda',
        bookTrialBtn: 'Pedir Limpeza Grátis',
        bookT1Btn: 'Obter Limpeza T1 Grátis',
        volumeBanner: 'Gere entre 3 e 5 unidades em Lisboa? Descontos de volume e gestão de chaves dedicadas são ativados automaticamente.',
        trialBoxBadge: 'Oferta Sem Risco',
        trialBoxTitle: '1ª Limpeza gratuita — sem compromisso nem contrato.',
        trialBoxDesc: 'Experimente o nosso padrão no seu próximo checkout. Se não considerar a melhor limpeza que o seu AL já teve, não paga absolutamente nada.',
        claimCleanBtn: 'Pedir a Minha Limpeza Grátis',
      },
      howItWorks: {
        tag: 'Processo & Confiança',
        title: 'Como funciona em 3 passos simples',
        subtitle: 'Criámos o nosso processo para poupar mais de 10 horas semanais de stress operacional aos anfitriões de Lisboa.',
        step1Num: '01',
        step1Title: 'Envie o seu calendário',
        step1Text: 'Sincronize o seu link iCal do Airbnb ou envie facilmente as datas de checkout na nossa conversa de WhatsApp.',
        step2Num: '02',
        step2Title: 'Limpamos e enviamos fotos de prova',
        step2Text: 'A nossa equipa cumpre a lista de 42 pontos, repõe os consumíveis e envia as fotos com carimbo de data/hora.',
        step3Num: '03',
        step3Title: 'Reveja e relaxe',
        step3Text: 'O seu hóspede entra num alojamento impecável. Fatura mensal consolidada. Cancele quando quiser, sem fidelização.',
        badge1: 'Equipa Verificada & de Confiança',
        badge2: 'Lista de 42 Pontos com Foto',
        badge3: 'Gestão Segura de Cofres/Chaves',
        badge4: 'Entrega Garantida até às 15:00',
        cohortBadge: 'Vagas de Lançamento em Lisboa',
        cohortTitle: 'A integrar novos anfitriões na Baixa, Alfama, Chiado, Arroios e Príncipe Real',
        cohortSub: 'Limitamos o número de anfitriões parceiros para assegurar que todas as unidades cumprem rigorosamente o horário das 15:00 sem exceções.',
      },
      neighborhoods: {
        title: 'Cobertura em todas as principais zonas de AL de Lisboa',
      },
      faq: {
        tag: 'Perguntas Frequentes',
        title: 'Respostas para Anfitriões de AL em Lisboa',
        q1: 'Como funciona o teste da "1ª Limpeza Grátis"?',
        a1: 'Basta preencher o formulário abaixo ou enviar mensagem no WhatsApp. Agendamos o seu próximo turnover, executamos a limpeza completa de 42 pontos e enviamos o relatório fotográfico. Não são pedidos dados de pagamento nem há qualquer compromisso.',
        q2: 'Como é que a equipa acede às chaves e ao imóvel?',
        a2: 'A maioria dos anfitriões utiliza fechaduras inteligentes ou cofres de chaves (Master Lock, Igloohome, Nuki). Seguimos protocolos rigorosos de segurança e as chaves são guardadas no cofre imediatamente após a saída da equipa.',
        q3: 'O que acontece se o hóspede deixar danos ou sujidade extrema?',
        a3: 'A equipa fotografa de imediato os danos e avisa-o pelo WhatsApp antes de avançar com o turnover, fornecendo a documentação exata necessária para abrir pedidos de caução no Airbnb AirCover.',
        q4: 'Como é gerida a lavagem de roupas de cama e toalhas?',
        a4: 'Fazemos a lavagem no local se a unidade tiver máquinas de lavar e secar, ou trocamos pelo conjunto sobresselente do anfitrião. Para quem tem várias unidades, também articulamos com serviços de lavandaria externa.',
      },
      form: {
        tag: 'Vagas Limitadas de Lançamento',
        headline: 'Peça a sua primeira limpeza de turnover gratuita.',
        sub: 'Sem cartão de crédito. Sem contratos de fidelização. Veja a diferença que turnovers com fotos verificadas trazem ao seu AL em Lisboa.',
        perk1: 'Limpeza profunda completa com lista de 42 pontos',
        perk2: 'Relatório fotográfico enviado para o seu WhatsApp',
        perk3: 'Inspecção de danos e quebras antes da nova entrada',
        waBoxTitle: 'Prefere resposta imediata?',
        waBoxDesc: 'Fale diretamente com a nossa equipa de operações de Lisboa no WhatsApp.',
        waBtn: 'Falar no WhatsApp Agora',
        boxTitle: 'Pedir Limpeza de Teste Gratuita',
        boxSubtitle: 'Preencha 4 dados rápidos para reservar a sua vaga.',
        nameLabel: 'O seu Nome',
        namePlaceholder: 'ex: Manuel Silva',
        phoneLabel: 'Número de WhatsApp / Telemóvel',
        phonePlaceholder: 'ex: +351 912 345 678',
        unitsLabel: 'Número de Unidades',
        zoneLabel: 'Bairro em Lisboa',
        submitBtn: 'Marcar Limpeza Gratuita',
        privacyNote: 'Sem spam. Apenas entraremos em contacto para agendar a sua limpeza de turnover.',
        successTitle: 'Pedido de Limpeza Gratuita Recebido!',
        successDesc: (name: string, phone: string) =>
          `Obrigado, ${name}! A nossa equipa de Lisboa entrará em contacto para o seu WhatsApp (${phone}) em menos de 15 minutos para confirmar o seu agendamento.`,
        fastTrackBtn: 'Acelerar no WhatsApp',
      },
      footer: {
        tagline: 'Serviço especializado de limpeza e turnover para anfitriões de Airbnb e Alojamento Local em Lisboa.',
        colServices: 'Tipologias',
        colZones: 'Bairros',
        colContact: 'Contacto & Suporte',
        rights: 'Todos os direitos reservados. Serviços de limpeza e gestão de instalações em Portugal.',
      },
    },
    en: {
      brandSub: 'Lisbon STR Cleaning',
      nav: {
        whyUs: 'Why Us',
        inclusions: 'Inclusions',
        pricing: 'Pricing',
        howItWorks: 'How It Works',
        faq: 'FAQ',
        freeCleanBtn: 'First Clean Free',
      },
      hero: {
        pill: 'Engineered for 1–5 Unit Airbnb & AL Hosts in Lisbon',
        headlinePart1: 'Your next 1-star review',
        headlinePart2: 'starts in the bathroom.',
        subheadline: 'A dirty turnover doesn\'t just lose one guest — it loses the next ten. We protect your AL revenue with 100% photo-verified, hotel-standard turnovers guaranteed ready before your 3:00 PM check-in.',
        ctaPrimary: 'Get Your First Clean Free',
        ctaSecondary: 'Message on WhatsApp',
        guarantee: 'Zero contract lock-in · Cancel anytime',
      },
      stats: {
        stat1Num: '~$3,000',
        stat1Label: 'Cost of 1 Bad Clean',
        stat1Desc: 'Average revenue lost per host in refunds, cancelled bookings, and Airbnb algorithm penalties.',
        stat2Num: '-15% to -20%',
        stat2Label: 'Inquiry Drop',
        stat2Desc: 'Caused by a mere 0.5-star drop in cleanliness score on short-term rental platforms.',
        stat3Num: '100% Verified',
        stat3Label: 'Photo Proof & Inspection',
        stat3Desc: 'Timestamped photo verification sent to your phone after every clean before the next guest arrives.',
      },
      pain: {
        tag: 'The Reality of STR Hosting',
        title: 'Why traditional cleaners fail Airbnb hosts in Lisbon',
        subtitle: 'Domestic cleaners work on weekly routines. Alojamento Local runs on tight, unpredictable guest turnovers where a single missed hair costs superhost status.',
        card1Badge: 'Turnaround Crunch',
        card1Title: 'The impossible 10am–3pm window',
        card1Text: 'Checkout at 10:00 AM, next arrival at 3:00 PM. No room for delays, no second chances, and no time for you to rush across Lisbon to fix missed spots.',
        card2Badge: 'Quality Roulette',
        card2Title: 'Inconsistent quality every turnover',
        card2Text: 'One clean is great, the next leaves unmade beds or a dusty shower corner. You shouldn\'t have to physically inspect every unit yourself to sleep at night.',
        card3Badge: 'Zero Proof',
        card3Title: 'No visibility when you\'re off-site',
        card3Text: 'You receive a vague "done" text, but what about the fridge, linen tucks, or bathroom drain? You need timestamped photo proof, not blind trust.',
        card4Badge: 'Rigid Schedules',
        card4Title: 'Rigid 9–5 cleaners don\'t fit STR',
        card4Text: 'Last-minute bookings, early check-ins, and back-to-back turnovers don\'t adhere to standard cleaning agencies. We adapt to your guest calendar.',
      },
      slider: {
        tag: 'Visual Standard',
        title: 'From post-checkout chaos to 5-star guest-ready',
        subtitle: 'Drag the interactive slider below to inspect our turnover reset standard.',
        readyBadge: '2:30 PM — 5-Star Guest Ready',
        tagReady1: 'Crisp hotel hospital corners',
        tagReady2: 'Restocked coffee & amenities',
        tagReady3: 'Sanitized bathroom & spotless mirrors',
        tagReady4: 'Verified damage-free report',
        messyBadge: '10:05 AM — Post-Checkout Mess',
        tagMessy1: 'Disheveled bedsheets & used towels',
        tagMessy2: 'Empty shampoo & unemptied bins',
        tagMessy3: 'Watermarks & missed hairs',
        note: 'Drag the bar horizontally to inspect our turnover difference',
      },
      inclusions: {
        tag: 'Full Turnover Bundle',
        title: 'What is included in every clean',
        subtitle: 'Every turnover is completed against a 42-point short-term rental checklist built to protect your Superhost status.',
        card1Title: 'Full Turnover Deep Cleaning',
        card1Desc: 'Spotless kitchen, sanitized bathrooms, hair-free floors, dusted baseboards, and sparkling mirrors throughout the apartment.',
        card1Tag: 'Standard in every clean',
        card2Title: 'Bed Making & Linen Care',
        card2Desc: 'Fresh linen change with tight hospital corners, pillow fluffing, and neatly folded bath towel sets staged on the bed.',
        card2Tag: 'Hotel standard',
        card3Title: 'Consumables Restocking',
        card3Desc: 'Host-supplied toiletries, Nespresso capsules, tea, and paper goods restocked by default. (Optional supply replenishment packs available).',
        card3Tag: 'Host supplies or pack add-on',
        card4Title: 'Photo-Verified Checklist',
        card4Desc: 'High-resolution photos of every completed zone sent to your WhatsApp immediately upon turnover completion.',
        card4Tag: '100% proof sent to phone',
        card5Title: 'Pre-Arrival Damage Reporting',
        card5Desc: 'We document and flag any guest damage, broken glass, or maintenance issues with timestamped photos before the next guest arrives.',
        card5Tag: 'Protects your deposit claims',
        card6Title: 'Vetted & STR-Trained Cleaners',
        card6Desc: 'Background-checked professionals with specialized training in short-term rental standards and hospitality.',
        card6Tag: 'Trusted Team',
      },
      pricing: {
        tag: 'Transparent Rate Card',
        title: 'Clear, fixed pricing per turnover',
        subtitle: 'No hidden quotes, no surprise weekend surcharges. Know your exact cleaning cost before booking.',
        perTurnover: '/ turnover',
        t0Badge: 'Studio / AL',
        t0Title: 'Studio / T0',
        t1Badge: '1 Bedroom',
        t1Title: 'T1 Apartment',
        t1Ribbon: 'Most Common in Lisbon',
        t2Badge: '2 Bedroom',
        t2Title: 'T2 Apartment',
        t3Badge: '3 Bedroom',
        t3Title: 'T3 Apartment',
        featureFullClean: 'Full apartment turnover clean',
        featureBedLinen: '1 Bed linen change & staging',
        featurePhotoChecklist: 'Photo checklist to WhatsApp',
        featureDamageReport: 'Damage inspection report',
        featureT1Full: 'Full bedroom, living, bath & kitchen',
        featureT2Beds: 'Up to 2 bedrooms & 2 bathrooms',
        featureT3Large: 'Large unit turnover & deep sanitization',
        bookTrialBtn: 'Book Free Trial',
        bookT1Btn: 'Get T1 Clean Free',
        volumeBanner: 'Managing 3 to 5 units in Lisbon? Volume pricing and dedicated key-holding discounts automatically kick in.',
        trialBoxBadge: 'Risk-Free Offer',
        trialBoxTitle: 'First clean free — no commitment, no contract.',
        trialBoxDesc: 'Test our turnover standard on your next guest checkout. If you don\'t think it\'s the best clean your AL has ever had, you owe nothing.',
        claimCleanBtn: 'Claim Your Free Clean',
      },
      howItWorks: {
        tag: 'Process Trust',
        title: 'How it works in 3 simple steps',
        subtitle: 'We built our process to save Lisbon hosts 10+ hours a week in operational chaos.',
        step1Num: '01',
        step1Title: 'Send your schedule',
        step1Text: 'Connect your Airbnb/iCal link or simply drop checkout dates in our dedicated WhatsApp thread.',
        step2Num: '02',
        step2Title: 'We clean & send photo proof',
        step2Text: 'Our insured cleaner arrives on time, follows the 42-point checklist, restocks amenities, and sends timestamped photo verification.',
        step3Num: '03',
        step3Title: 'You review & relax',
        step3Text: 'Your guest checks in to a pristine apartment. You receive a monthly consolidated invoice. Cancel anytime with zero lock-in contracts.',
        badge1: 'Vetted & Trusted Cleaners',
        badge2: '42-Point Photo Checklist',
        badge3: 'Secure Key Lockbox Handling',
        badge4: 'Guaranteed Ready by 3:00 PM',
        cohortBadge: 'Lisbon Launch Cohort',
        cohortTitle: 'Currently onboarding hosts in Alfama, Chiado, Arroios & Príncipe Real',
        cohortSub: 'We limit our Lisbon partner roster to ensure every unit receives guaranteed 3:00 PM turnaround times without compromise.',
      },
      neighborhoods: {
        title: 'Covering all core Airbnb hubs in Lisbon',
      },
      faq: {
        tag: 'Frequently Asked Questions',
        title: 'Answers for Lisbon AL Hosts',
        q1: 'How does the "First Clean Free" trial work?',
        a1: 'Submit the form below or message us on WhatsApp. We will schedule your upcoming turnover, complete the full 42-point turnover clean, and send you the verified photo report. No payment details required and zero obligation.',
        q2: 'How do your cleaners handle keys and access?',
        a2: 'Most hosts use smart locks or secure lockboxes (e.g. Master Lock, Igloohome, Nuki). Our vetted cleaners follow strict key security protocols and return keys immediately to lockboxes upon departure.',
        q3: 'What happens if a guest leaves damage or a severe mess?',
        a3: 'Our cleaners immediately take photos of the damage and notify you via WhatsApp before proceeding, providing the exact documentation needed for Airbnb AirCover deposit claims.',
        q4: 'How do you manage linen and towel laundry?',
        a4: 'We handle on-site washing if unit washers/dryers allow, or swap with host-supplied backup sets. For multi-unit hosts, off-site linen service coordination is also available.',
      },
      form: {
        tag: 'Limited Launch Spots',
        headline: 'Claim your first turnover clean free.',
        sub: 'No credit card required. No lock-in contracts. See the difference verified photo turnovers make for your Lisbon AL.',
        perk1: 'Full 42-point turnover deep clean',
        perk2: 'Timestamped photo report to your WhatsApp',
        perk3: 'Pre-arrival damage & inspection check',
        waBoxTitle: 'Prefer instant response?',
        waBoxDesc: 'Chat directly with our Lisbon operations team on WhatsApp.',
        waBtn: 'Chat on WhatsApp Now',
        boxTitle: 'Get Your Free Trial Clean',
        boxSubtitle: 'Fill in 4 quick details to claim your spot.',
        nameLabel: 'Your Name',
        namePlaceholder: 'e.g. Manuel Silva',
        phoneLabel: 'WhatsApp / Phone Number',
        phonePlaceholder: 'e.g. +351 912 345 678',
        unitsLabel: 'Number of Units',
        zoneLabel: 'Lisbon Neighborhood',
        submitBtn: 'Book Your Free Clean',
        privacyNote: 'No spam. We only contact you to schedule your turnover clean.',
        successTitle: 'Trial Clean Request Received!',
        successDesc: (name: string, phone: string) =>
          `Thank you, ${name}! Our Lisbon team will message your WhatsApp (${phone}) within 15 minutes to confirm your turnover date.`,
        fastTrackBtn: 'Fast-track on WhatsApp',
      },
      footer: {
        tagline: 'Dedicated short-term rental turnover cleaning for Airbnb & Alojamento Local hosts in Lisbon.',
        colServices: 'Services',
        colZones: 'Neighborhoods',
        colContact: 'Contact & Support',
        rights: 'All rights reserved. Registered cleaning & facility management in Portugal.',
      },
    },
  }[lang];

  return (
    <div className="landing-root">
      {/* ── Sticky Announcement / Header ───────────────────────────────── */}
      <header className="landing-header">
        <div className="landing-header-container">
          <div className="landing-brand">
            <div className="brand-badge-icon">
              <Sparkles size={18} />
            </div>
            <div className="brand-text-group">
              <span className="brand-name">Impporta AL</span>
              <span className="brand-sub">{t.brandSub}</span>
            </div>
          </div>

          <nav className="landing-nav">
            <a href="#pain-points" className="nav-item">{t.nav.whyUs}</a>
            <a href="#what-is-included" className="nav-item">{t.nav.inclusions}</a>
            <a href="#pricing" className="nav-item">{t.nav.pricing}</a>
            <a href="#how-it-works" className="nav-item">{t.nav.howItWorks}</a>
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
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp-sm"
              title="WhatsApp"
            >
              <MessageSquare size={15} />
              <span className="hidden-mobile">WhatsApp</span>
            </a>
            <button onClick={scrollToForm} className="btn-trial-nav">
              {t.nav.freeCleanBtn}
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero Section ────────────────────────────────────────────────── */}
      <section className="hero-section">
        <div className="hero-glow-blob" />
        <div className="hero-container">
          {/* Target Audience Badge */}
          <div className="hero-pill animate-fade-in">
            <span className="pill-dot" />
            <span className="pill-text">{t.hero.pill}</span>
          </div>

          {/* Core Pain-Driven Headline */}
          <h1 className="hero-headline">
            {t.hero.headlinePart1} <br />
            <span className="hero-gradient-text">{t.hero.headlinePart2}</span>
          </h1>

          <p className="hero-subheadline">
            {t.hero.subheadline}
          </p>

          {/* Hero CTAs */}
          <div className="hero-cta-group">
            <button onClick={scrollToForm} className="btn-primary-hero">
              <span>{t.hero.ctaPrimary}</span>
              <ArrowRight size={18} />
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary-hero"
            >
              <MessageSquare size={18} className="text-accent" />
              <span>{t.hero.ctaSecondary}</span>
            </a>
          </div>

          <div className="hero-guarantee-note">
            <CheckCircle2 size={15} className="text-accent" />
            <span>{t.hero.guarantee}</span>
          </div>

          {/* ── Required Stat Callout Box ──────────────────────────────────── */}
          <div className="hero-stats-banner">
            <div className="stat-card-hero stat-highlight">
              <div className="stat-icon-wrapper text-danger">
                <AlertTriangle size={20} />
              </div>
              <div className="stat-content">
                <div className="stat-number text-danger">{t.stats.stat1Num}</div>
                <div className="stat-label">{t.stats.stat1Label}</div>
                <div className="stat-desc">{t.stats.stat1Desc}</div>
              </div>
            </div>

            <div className="stat-card-hero">
              <div className="stat-icon-wrapper text-warning">
                <Flame size={20} />
              </div>
              <div className="stat-content">
                <div className="stat-number text-warning">{t.stats.stat2Num}</div>
                <div className="stat-label">{t.stats.stat2Label}</div>
                <div className="stat-desc">{t.stats.stat2Desc}</div>
              </div>
            </div>

            <div className="stat-card-hero stat-solution">
              <div className="stat-icon-wrapper text-accent">
                <Camera size={20} />
              </div>
              <div className="stat-content">
                <div className="stat-number text-accent">{t.stats.stat3Num}</div>
                <div className="stat-label">{t.stats.stat3Label}</div>
                <div className="stat-desc">{t.stats.stat3Desc}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pain Points Section ─────────────────────────────────────────── */}
      <section id="pain-points" className="section-wrapper bg-surface-alt">
        <div className="content-container">
          <div className="section-heading-center">
            <div className="section-tag">{t.pain.tag}</div>
            <h2 className="section-title">{t.pain.title}</h2>
            <p className="section-subtitle">{t.pain.subtitle}</p>
          </div>

          <div className="pain-grid">
            <div className="pain-card">
              <div className="pain-icon-box">
                <Clock size={24} />
              </div>
              <div className="pain-badge">{t.pain.card1Badge}</div>
              <h3 className="pain-title">{t.pain.card1Title}</h3>
              <p className="pain-text">{t.pain.card1Text}</p>
            </div>

            <div className="pain-card">
              <div className="pain-icon-box">
                <Layers size={24} />
              </div>
              <div className="pain-badge">{t.pain.card2Badge}</div>
              <h3 className="pain-title">{t.pain.card2Title}</h3>
              <p className="pain-text">{t.pain.card2Text}</p>
            </div>

            <div className="pain-card">
              <div className="pain-icon-box">
                <Camera size={24} />
              </div>
              <div className="pain-badge">{t.pain.card3Badge}</div>
              <h3 className="pain-title">{t.pain.card3Title}</h3>
              <p className="pain-text">{t.pain.card3Text}</p>
            </div>

            <div className="pain-card">
              <div className="pain-icon-box">
                <Calendar size={24} />
              </div>
              <div className="pain-badge">{t.pain.card4Badge}</div>
              <h3 className="pain-title">{t.pain.card4Title}</h3>
              <p className="pain-text">{t.pain.card4Text}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Interactive Before & After Turnover Slider ──────────────────── */}
      <section className="section-wrapper">
        <div className="content-container">
          <div className="section-heading-center">
            <div className="section-tag">{t.slider.tag}</div>
            <h2 className="section-title">{t.slider.title}</h2>
            <p className="section-subtitle">{t.slider.subtitle}</p>
          </div>

          <div
            className="slider-container"
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onTouchStart={() => setIsDragging(true)}
            onTouchEnd={() => setIsDragging(false)}
            onMouseMove={(e) => {
              if (!isDragging) return;
              const rect = e.currentTarget.getBoundingClientRect();
              handleSliderMove(e.clientX, rect);
            }}
            onTouchMove={(e) => {
              if (!isDragging || !e.touches[0]) return;
              const rect = e.currentTarget.getBoundingClientRect();
              handleSliderMove(e.touches[0].clientX, rect);
            }}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              handleSliderMove(e.clientX, rect);
            }}
          >
            {/* After (Right Reveal) */}
            <div className="slider-image-layer slider-after">
              <div className="room-mockup ready-state">
                <div className="room-badge success">
                  <Sparkles size={14} /> {t.slider.readyBadge}
                </div>
                <div className="staged-details">
                  <div className="detail-tag"><Check size={12} /> {t.slider.tagReady1}</div>
                  <div className="detail-tag"><Check size={12} /> {t.slider.tagReady2}</div>
                  <div className="detail-tag"><Check size={12} /> {t.slider.tagReady3}</div>
                  <div className="detail-tag"><Check size={12} /> {t.slider.tagReady4}</div>
                </div>
              </div>
            </div>

            {/* Before (Clipped) */}
            <div
              className="slider-image-layer slider-before"
              style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
            >
              <div className="room-mockup messy-state">
                <div className="room-badge warning">
                  <Clock size={14} /> {t.slider.messyBadge}
                </div>
                <div className="staged-details messy-tags">
                  <div className="detail-tag alert"><AlertTriangle size={12} /> {t.slider.tagMessy1}</div>
                  <div className="detail-tag alert"><AlertTriangle size={12} /> {t.slider.tagMessy2}</div>
                  <div className="detail-tag alert"><AlertTriangle size={12} /> {t.slider.tagMessy3}</div>
                </div>
              </div>
            </div>

            {/* Divider Handle */}
            <div className="slider-divider" style={{ left: `${sliderPosition}%` }}>
              <div className="slider-handle">
                <div className="handle-arrows">‹ ›</div>
              </div>
            </div>
          </div>

          <div className="slider-footer-note">
            <span>{t.slider.note}</span>
          </div>
        </div>
      </section>

      {/* ── What's Included (Service Bundle) ────────────────────────────── */}
      <section id="what-is-included" className="section-wrapper bg-surface-alt">
        <div className="content-container">
          <div className="section-heading-center">
            <div className="section-tag">{t.inclusions.tag}</div>
            <h2 className="section-title">{t.inclusions.title}</h2>
            <p className="section-subtitle">{t.inclusions.subtitle}</p>
          </div>

          <div className="inclusions-grid">
            <div className="inclusion-card">
              <div className="inclusion-header">
                <div className="inclusion-icon"><Sparkles size={20} /></div>
                <h3 className="inclusion-title">{t.inclusions.card1Title}</h3>
              </div>
              <p className="inclusion-desc">{t.inclusions.card1Desc}</p>
              <div className="inclusion-tag">{t.inclusions.card1Tag}</div>
            </div>

            <div className="inclusion-card">
              <div className="inclusion-header">
                <div className="inclusion-icon"><Zap size={20} /></div>
                <h3 className="inclusion-title">{t.inclusions.card2Title}</h3>
              </div>
              <p className="inclusion-desc">{t.inclusions.card2Desc}</p>
              <div className="inclusion-tag">{t.inclusions.card2Tag}</div>
            </div>

            <div className="inclusion-card">
              <div className="inclusion-header">
                <div className="inclusion-icon"><Coffee size={20} /></div>
                <h3 className="inclusion-title">{t.inclusions.card3Title}</h3>
              </div>
              <p className="inclusion-desc">{t.inclusions.card3Desc}</p>
              <div className="inclusion-tag">{t.inclusions.card3Tag}</div>
            </div>

            <div className="inclusion-card highlight-card">
              <div className="inclusion-header">
                <div className="inclusion-icon"><Camera size={20} /></div>
                <h3 className="inclusion-title">{t.inclusions.card4Title}</h3>
              </div>
              <p className="inclusion-desc">{t.inclusions.card4Desc}</p>
              <div className="inclusion-tag text-accent font-bold">{t.inclusions.card4Tag}</div>
            </div>

            <div className="inclusion-card">
              <div className="inclusion-header">
                <div className="inclusion-icon"><AlertTriangle size={20} /></div>
                <h3 className="inclusion-title">{t.inclusions.card5Title}</h3>
              </div>
              <p className="inclusion-desc">{t.inclusions.card5Desc}</p>
              <div className="inclusion-tag">{t.inclusions.card5Tag}</div>
            </div>

            <div className="inclusion-card">
              <div className="inclusion-header">
                <div className="inclusion-icon"><ShieldCheck size={20} /></div>
                <h3 className="inclusion-title">{t.inclusions.card6Title}</h3>
              </div>
              <p className="inclusion-desc">{t.inclusions.card6Desc}</p>
              <div className="inclusion-tag">{t.inclusions.card6Tag}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Transparent Pricing Section ─────────────────────────────────── */}
      <section id="pricing" className="section-wrapper">
        <div className="content-container">
          <div className="section-heading-center">
            <div className="section-tag">{t.pricing.tag}</div>
            <h2 className="section-title">{t.pricing.title}</h2>
            <p className="section-subtitle">{t.pricing.subtitle}</p>
          </div>

          {/* Pricing Grid */}
          <div className="pricing-grid">
            <div className="pricing-card">
              <div className="pricing-tier-badge">{t.pricing.t0Badge}</div>
              <h3 className="pricing-typology">{t.pricing.t0Title}</h3>
              <div className="pricing-figure">
                <span className="currency">€</span>
                <span className="amount">42</span>
                <span className="period">{t.pricing.perTurnover}</span>
              </div>
              <ul className="pricing-features">
                <li><Check size={14} className="text-accent" /> {t.pricing.featureFullClean}</li>
                <li><Check size={14} className="text-accent" /> {t.pricing.featureBedLinen}</li>
                <li><Check size={14} className="text-accent" /> {t.pricing.featurePhotoChecklist}</li>
                <li><Check size={14} className="text-accent" /> {t.pricing.featureDamageReport}</li>
              </ul>
              <button onClick={scrollToForm} className="btn-pricing">{t.pricing.bookTrialBtn}</button>
            </div>

            <div className="pricing-card popular-card">
              <div className="popular-ribbon">{t.pricing.t1Ribbon}</div>
              <div className="pricing-tier-badge">{t.pricing.t1Badge}</div>
              <h3 className="pricing-typology">{t.pricing.t1Title}</h3>
              <div className="pricing-figure">
                <span className="currency">€</span>
                <span className="amount">48</span>
                <span className="period">{t.pricing.perTurnover}</span>
              </div>
              <ul className="pricing-features">
                <li><Check size={14} className="text-accent" /> {t.pricing.featureT1Full}</li>
                <li><Check size={14} className="text-accent" /> {t.pricing.featureBedLinen}</li>
                <li><Check size={14} className="text-accent" /> {t.pricing.featurePhotoChecklist}</li>
                <li><Check size={14} className="text-accent" /> {t.pricing.featureDamageReport}</li>
              </ul>
              <button onClick={scrollToForm} className="btn-pricing btn-pricing-highlight">
                {t.pricing.bookT1Btn}
              </button>
            </div>

            <div className="pricing-card">
              <div className="pricing-tier-badge">{t.pricing.t2Badge}</div>
              <h3 className="pricing-typology">{t.pricing.t2Title}</h3>
              <div className="pricing-figure">
                <span className="currency">€</span>
                <span className="amount">58</span>
                <span className="period">{t.pricing.perTurnover}</span>
              </div>
              <ul className="pricing-features">
                <li><Check size={14} className="text-accent" /> {t.pricing.featureT2Beds}</li>
                <li><Check size={14} className="text-accent" /> {t.pricing.featureBedLinen}</li>
                <li><Check size={14} className="text-accent" /> {t.pricing.featurePhotoChecklist}</li>
                <li><Check size={14} className="text-accent" /> {t.pricing.featureDamageReport}</li>
              </ul>
              <button onClick={scrollToForm} className="btn-pricing">{t.pricing.bookTrialBtn}</button>
            </div>

            <div className="pricing-card">
              <div className="pricing-tier-badge">{t.pricing.t3Badge}</div>
              <h3 className="pricing-typology">{t.pricing.t3Title}</h3>
              <div className="pricing-figure">
                <span className="currency">€</span>
                <span className="amount">64</span>
                <span className="period">{t.pricing.perTurnover}</span>
              </div>
              <ul className="pricing-features">
                <li><Check size={14} className="text-accent" /> {t.pricing.featureT3Large}</li>
                <li><Check size={14} className="text-accent" /> {t.pricing.featureBedLinen}</li>
                <li><Check size={14} className="text-accent" /> {t.pricing.featurePhotoChecklist}</li>
                <li><Check size={14} className="text-accent" /> {t.pricing.featureDamageReport}</li>
              </ul>
              <button onClick={scrollToForm} className="btn-pricing">{t.pricing.bookTrialBtn}</button>
            </div>
          </div>

          {/* Volume Note */}
          <div className="volume-discount-banner">
            <div className="volume-icon"><KeyRound size={20} /></div>
            <div className="volume-text">
              {t.pricing.volumeBanner}
            </div>
          </div>

          {/* Pricing CTA Banner */}
          <div className="trial-callout-box">
            <div className="trial-callout-content">
              <div className="trial-badge">{t.pricing.trialBoxBadge}</div>
              <h3 className="trial-title">{t.pricing.trialBoxTitle}</h3>
              <p className="trial-desc">{t.pricing.trialBoxDesc}</p>
            </div>
            <button onClick={scrollToForm} className="btn-primary-hero">
              {t.pricing.claimCleanBtn}
            </button>
          </div>
        </div>
      </section>

      {/* ── Trust / Credibility Section ─────────────────────────────────── */}
      <section id="how-it-works" className="section-wrapper bg-surface-alt">
        <div className="content-container">
          <div className="section-heading-center">
            <div className="section-tag">{t.howItWorks.tag}</div>
            <h2 className="section-title">{t.howItWorks.title}</h2>
            <p className="section-subtitle">{t.howItWorks.subtitle}</p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">{t.howItWorks.step1Num}</div>
              <div className="step-icon-wrap"><Calendar size={24} /></div>
              <h3 className="step-title">{t.howItWorks.step1Title}</h3>
              <p className="step-text">{t.howItWorks.step1Text}</p>
            </div>

            <div className="step-card">
              <div className="step-number">{t.howItWorks.step2Num}</div>
              <div className="step-icon-wrap"><Camera size={24} /></div>
              <h3 className="step-title">{t.howItWorks.step2Title}</h3>
              <p className="step-text">{t.howItWorks.step2Text}</p>
            </div>

            <div className="step-card">
              <div className="step-number">{t.howItWorks.step3Num}</div>
              <div className="step-icon-wrap"><CheckCircle2 size={24} /></div>
              <h3 className="step-title">{t.howItWorks.step3Title}</h3>
              <p className="step-text">{t.howItWorks.step3Text}</p>
            </div>
          </div>

          {/* Insurance & Trust Badges */}
          <div className="trust-badges-row">
            <div className="trust-badge-item">
              <ShieldCheck size={20} className="text-accent" />
              <span>{t.howItWorks.badge1}</span>
            </div>
            <div className="trust-badge-item">
              <FileCheck size={20} className="text-accent" />
              <span>{t.howItWorks.badge2}</span>
            </div>
            <div className="trust-badge-item">
              <KeyRound size={20} className="text-accent" />
              <span>{t.howItWorks.badge3}</span>
            </div>
            <div className="trust-badge-item">
              <Clock size={20} className="text-accent" />
              <span>{t.howItWorks.badge4}</span>
            </div>
          </div>

          {/* Launch Cohort Testimonial Placeholder */}
          <div className="cohort-banner">
            <div className="cohort-badge">{t.howItWorks.cohortBadge}</div>
            <div className="cohort-title">{t.howItWorks.cohortTitle}</div>
            <p className="cohort-sub">{t.howItWorks.cohortSub}</p>
          </div>
        </div>
      </section>

      {/* ── Lisbon Neighborhoods ────────────────────────────────────────── */}
      <section className="section-wrapper neighborhoods-section">
        <div className="content-container">
          <div className="neighborhoods-box">
            <div className="neighborhoods-header">
              <MapPin size={22} className="text-accent" />
              <h3>{t.neighborhoods.title}</h3>
            </div>
            <div className="neighborhood-chips">
              {neighborhoods.map((n) => (
                <span key={n} className="chip">
                  <Check size={12} /> {n}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ Section ─────────────────────────────────────────────────── */}
      <section id="faq" className="section-wrapper bg-surface-alt">
        <div className="content-container">
          <div className="section-heading-center">
            <div className="section-tag">{t.faq.tag}</div>
            <h2 className="section-title">{t.faq.title}</h2>
          </div>

          <div className="faq-grid">
            <div className="faq-card">
              <h4 className="faq-q">{t.faq.q1}</h4>
              <p className="faq-a">{t.faq.a1}</p>
            </div>

            <div className="faq-card">
              <h4 className="faq-q">{t.faq.q2}</h4>
              <p className="faq-a">{t.faq.a2}</p>
            </div>

            <div className="faq-card">
              <h4 className="faq-q">{t.faq.q3}</h4>
              <p className="faq-a">{t.faq.a3}</p>
            </div>

            <div className="faq-card">
              <h4 className="faq-q">{t.faq.q4}</h4>
              <p className="faq-a">{t.faq.a4}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Low-Friction Trial Booking Form & WhatsApp CTA ───────────────── */}
      <section id="claim-trial" className="section-wrapper trial-form-section">
        <div className="content-container">
          <div className="form-container-card">
            <div className="form-left">
              <div className="section-tag">{t.form.tag}</div>
              <h2 className="form-headline">{t.form.headline}</h2>
              <p className="form-sub">{t.form.sub}</p>

              <div className="form-perks">
                <div className="perk-item">
                  <CheckCircle2 size={18} className="text-accent" />
                  <span>{t.form.perk1}</span>
                </div>
                <div className="perk-item">
                  <CheckCircle2 size={18} className="text-accent" />
                  <span>{t.form.perk2}</span>
                </div>
                <div className="perk-item">
                  <CheckCircle2 size={18} className="text-accent" />
                  <span>{t.form.perk3}</span>
                </div>
              </div>

              {/* Direct WhatsApp Action */}
              <div className="whatsapp-callout-box">
                <div className="wa-title">{t.form.waBoxTitle}</div>
                <p className="wa-desc">{t.form.waBoxDesc}</p>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp-full"
                >
                  <MessageSquare size={18} />
                  <span>{t.form.waBtn}</span>
                </a>
              </div>
            </div>

            <div className="form-right">
              {formSubmitted ? (
                <div className="form-success-box animate-fade-in">
                  <div className="success-icon"><CheckCircle2 size={48} /></div>
                  <h3 className="success-title">{t.form.successTitle}</h3>
                  <p className="success-desc">
                    {t.form.successDesc(formData.name, formData.phone)}
                  </p>
                  <a
                    href={submittedWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary-hero mt-4"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    <MessageSquare size={18} /> {t.form.fastTrackBtn}
                  </a>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="booking-form">
                  <h3 className="form-box-title">{t.form.boxTitle}</h3>
                  <p className="form-box-subtitle">{t.form.boxSubtitle}</p>

                  <div className="form-group">
                    <label htmlFor="host-name">{t.form.nameLabel}</label>
                    <input
                      id="host-name"
                      type="text"
                      required
                      placeholder={t.form.namePlaceholder}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="host-phone">{t.form.phoneLabel}</label>
                    <input
                      id="host-phone"
                      type="tel"
                      required
                      placeholder={t.form.phonePlaceholder}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>{t.form.unitsLabel}</label>
                      <CustomSelect
                        value={formData.units}
                        options={[
                          { value: '1 unit', label: lang === 'pt' ? '1 unidade' : '1 unit' },
                          { value: '2 units', label: lang === 'pt' ? '2 unidades' : '2 units' },
                          { value: '3 units', label: lang === 'pt' ? '3 unidades' : '3 units' },
                          { value: '4 units', label: lang === 'pt' ? '4 unidades' : '4 units' },
                          { value: '5+ units', label: lang === 'pt' ? '5+ unidades' : '5+ units' },
                        ]}
                        onChange={(val) => setFormData({ ...formData, units: val })}
                      />
                    </div>

                    <div className="form-group">
                      <label>{t.form.zoneLabel}</label>
                      <CustomSelect
                        value={formData.neighborhood}
                        options={neighborhoods.map((n) => ({ value: n, label: n }))}
                        onChange={(val) => setFormData({ ...formData, neighborhood: val })}
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn-form-submit">
                    <span>{t.form.submitBtn}</span>
                    <ArrowRight size={16} />
                  </button>

                  <div className="form-privacy-note">
                    <Shield size={12} /> {t.form.privacyNote}
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="landing-footer">
        <div className="landing-footer-container">
          <div className="footer-left">
            <div className="landing-brand">
              <div className="brand-badge-icon"><Sparkles size={16} /></div>
              <span className="brand-name">Impporta AL</span>
            </div>
            <p className="footer-tagline">
              {t.footer.tagline}
            </p>
          </div>

          <div className="footer-links">
            <div className="footer-column">
              <span className="footer-col-title">{t.footer.colServices}</span>
              <a href="#pricing">Estúdio / T0 (€42)</a>
              <a href="#pricing">T1 Turnover (€48)</a>
              <a href="#pricing">T2 Turnover (€58)</a>
              <a href="#pricing">T3 Turnover (€64)</a>
            </div>
            <div className="footer-column">
              <span className="footer-col-title">{t.footer.colZones}</span>
              <span>Baixa & Chiado</span>
              <span>Alfama & Castelo</span>
              <span>Príncipe Real & Arroios</span>
              <span>Campo de Ourique & Estrela</span>
            </div>
            <div className="footer-column">
              <span className="footer-col-title">{t.footer.colContact}</span>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">WhatsApp Support</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Impporta AL Lisboa. {t.footer.rights}</p>
        </div>
      </footer>
    </div>
  );
}
