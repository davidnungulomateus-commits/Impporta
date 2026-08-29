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
  ChevronDown,
  RefreshCw,
  Eye,
  DollarSign,
  Plus,
  Menu,
  X
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
    neighborhood: 'Lisboa - Baixa / Chiado',
    customLocation: '',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [openFaqs, setOpenFaqs] = useState<number[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleFaq = (index: number) => {
    setOpenFaqs((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  // Extensive locations list covering Lisboa, Cascais, Oeiras, Sintra and surroundings
  const locationOptions = [
    // Lisboa
    { value: 'Lisboa - Baixa / Chiado', label: 'Lisboa - Baixa / Chiado' },
    { value: 'Lisboa - Alfama / Castelo / Graça', label: 'Lisboa - Alfama / Castelo / Graça' },
    { value: 'Lisboa - Bairro Alto / Príncipe Real', label: 'Lisboa - Bairro Alto / Príncipe Real' },
    { value: 'Lisboa - Arroios / Anjos / Penha de França', label: 'Lisboa - Arroios / Anjos / Penha de França' },
    { value: 'Lisboa - Campo de Ourique / Estrela / Lapa', label: 'Lisboa - Campo de Ourique / Estrela / Lapa' },
    { value: 'Lisboa - Avenidas Novas / Saldanha / Alvalade', label: 'Lisboa - Avenidas Novas / Saldanha / Alvalade' },
    { value: 'Lisboa - Belém / Ajuda / Restelo', label: 'Lisboa - Belém / Ajuda / Restelo' },
    { value: 'Lisboa - Parque das Nações / Expo', label: 'Lisboa - Parque das Nações / Expo' },
    { value: 'Lisboa - Santos / Alcântara', label: 'Lisboa - Santos / Alcântara' },
    { value: 'Lisboa - Lumiar / Telheiras / Benfica', label: 'Lisboa - Lumiar / Telheiras / Benfica' },
    // Cascais
    { value: 'Cascais - Centro & Baía', label: 'Cascais - Centro & Baía' },
    { value: 'Cascais - Estoril & Parede', label: 'Cascais - Estoril & Parede' },
    { value: 'Cascais - Carcavelos & São Pedro', label: 'Cascais - Carcavelos & São Pedro' },
    { value: 'Cascais - São Domingos de Rana / Alcabideche', label: 'Cascais - São Domingos de Rana / Alcabideche' },
    { value: 'Cascais - Guincho & Quinta da Marinha', label: 'Cascais - Guincho & Quinta da Marinha' },
    // Oeiras
    { value: 'Oeiras - Centro & Paço de Arcos', label: 'Oeiras - Centro & Paço de Arcos' },
    { value: 'Oeiras - Algés, Linda-a-Velha & Cruz Quebrada', label: 'Oeiras - Algés, Linda-a-Velha & Cruz Quebrada' },
    { value: 'Oeiras - Carnaxide & Queijas', label: 'Oeiras - Carnaxide & Queijas' },
    { value: 'Oeiras - Porto Salvo & Barcarena', label: 'Oeiras - Porto Salvo & Barcarena' },
    // Sintra
    { value: 'Sintra - Vila & Centro Histórico', label: 'Sintra - Vila & Centro Histórico' },
    { value: 'Sintra - Colares, Praia das Maçãs & Azenhas do Mar', label: 'Sintra - Colares, Praia das Maçãs & Azenhas do Mar' },
    { value: 'Sintra - Queluz, Belas & Massamá', label: 'Sintra - Queluz, Belas & Massamá' },
    { value: 'Sintra - Mem Martins, Rio de Mouro & Algueirão', label: 'Sintra - Mem Martins, Rio de Mouro & Algueirão' },
    // Arredores & Margem Sul
    { value: 'Amadora & Odivelas', label: 'Amadora & Odivelas' },
    { value: 'Loures & Sacavém', label: 'Loures & Sacavém' },
    { value: 'Margem Sul - Almada / Costa da Caparica', label: 'Margem Sul - Almada / Costa da Caparica' },
    { value: 'Outro', label: lang === 'pt' ? 'Outra localização (escrever)' : 'Other location (type below)' },
  ];

  // Grouped location chips for visual display
  const locationGroups = [
    {
      region: lang === 'pt' ? 'Lisboa Centro' : 'Lisbon Central',
      places: ['Baixa & Chiado', 'Alfama & Castelo', 'Bairro Alto & Príncipe Real', 'Arroios & Anjos', 'Campo de Ourique & Estrela', 'Saldanha & Avenidas Novas', 'Belém & Ajuda', 'Parque das Nações'],
    },
    {
      region: lang === 'pt' ? 'Linha de Cascais' : 'Cascais Coast',
      places: ['Cascais Centro', 'Estoril', 'Parede', 'Carcavelos', 'São Pedro do Estoril', 'São Domingos de Rana', 'Guincho'],
    },
    {
      region: 'Oeiras',
      places: ['Oeiras Centro', 'Paço de Arcos', 'Algés', 'Linda-a-Velha', 'Carnaxide', 'Porto Salvo'],
    },
    {
      region: lang === 'pt' ? 'Sintra & Litoral' : 'Sintra & Coast',
      places: ['Sintra Vila', 'Colares', 'Praia das Maçãs', 'Azenhas do Mar', 'Queluz & Belas', 'Mem Martins & Rio de Mouro'],
    },
    {
      region: lang === 'pt' ? 'Outros Arredores' : 'Surrounding Areas',
      places: ['Amadora', 'Odivelas', 'Loures', 'Almada', 'Costa da Caparica'],
    },
  ];

  const resolvedLocation =
    formData.neighborhood === 'Outro' && formData.customLocation.trim()
      ? formData.customLocation.trim()
      : formData.neighborhood;

  const submittedWhatsAppMessage = encodeURIComponent(
    lang === 'pt'
      ? `Olá! Gostaria de pedir a primeira limpeza gratuita para o meu Alojamento Local.\n\n👤 Nome: ${formData.name}\n📱 Contacto: ${formData.phone}\n🏠 Unidades: ${formData.units}\n📍 Localização: ${resolvedLocation}`
      : `Hello! I would like to request the first free turnover clean for my short-term rental.\n\n👤 Name: ${formData.name}\n📱 Phone: ${formData.phone}\n🏠 Units: ${formData.units}\n📍 Location: ${resolvedLocation}`
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
      ? `Olá! Gostaria de experimentar a primeira limpeza gratuita para o meu Alojamento Local (${formData.units}) em ${resolvedLocation}.`
      : `Hello! I would like to try the first free turnover clean for my short-term rental (${formData.units}) in ${resolvedLocation}.`
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
      brandSub: 'Lisboa · Cascais · Oeiras · Sintra',
      nav: {
        whyUs: 'Dores & Soluções',
        inclusions: 'O Que Inclui',
        pricing: 'Preços',
        howItWorks: 'Como Funciona',
        faq: 'Perguntas Frequentes',
        freeCleanBtn: '1ª Limpeza Grátis',
      },
      hero: {
        pill: 'Concebido para Anfitriões de Airbnb & AL em Lisboa, Cascais, Oeiras e Sintra',
        headlinePart1: 'A sua próxima avaliação de 1 estrela',
        headlinePart2: 'começa na casa de banho.',
        subheadline: 'Não vendemos apenas limpezas domésticas — entregamos Operações de Turnover e Proteção de Avaliações. Protegemos a sua receita em Lisboa, Cascais, Oeiras e Sintra com 100% de prova fotográfica, zero estrangulamentos de lavandaria e entregas garantidas antes das 15:00.',
        ctaPrimary: 'Pedir 1ª Limpeza Gratuita',
        ctaSecondary: 'Falar por WhatsApp',
        guarantee: 'Sem contratos de fidelização · Cancele quando quiser',
      },
      stats: {
        stat1Num: '~3.000 €',
        stat1Label: 'Custo de 1 Mau Turnover',
        stat1Desc: 'Média de receita perdida por anfitrião em reembolsos a hóspedes, noites canceladas e penalizações no algoritmo do Airbnb.',
        stat2Num: '-15% a -20%',
        stat2Label: 'Queda nas Reservas',
        stat2Desc: 'Causada por uma descida de apenas 0.5 estrelas na pontuação de limpeza em plataformas de AL.',
        stat3Num: '100% Verificado',
        stat3Label: 'Auditoria de 10–15 Fotos',
        stat3Desc: 'Relatório fotográfico com carimbo de data/hora enviado para o WhatsApp antes da entrada do hóspede contra pedidos falsos de reembolso.',
      },
      pain: {
        tag: 'Dores Reais de Anfitriões vs. A Nossa Solução',
        title: 'Porque é que 90% das limpezas tradicionais falham no Alojamento Local',
        subtitle: 'Analisámos os maiores pesadelos reportados por anfitriões de AL e desenhámos uma operação profissional que elimina cada um desses riscos.',
        card1Badge: 'Queda de Padrão ("Standard Drift")',
        card1Title: 'Começam bem, mas a qualidade cai ao fim de poucas semanas',
        card1Text: 'Cabelos esquecidos no ralo ou nos lençóis, micro-ondas e frigoríficos engordurados, café por limpar e pó debaixo da cama custam o estatuto de Superhost.',
        card1Sol: 'Nossa Solução: Lista digital rigorosa de 42 pontos com fotos obrigatórias e normas de hotelaria em todas as limpezas sem exceção.',
        card2Badge: 'O Estrangulamento da Lavandaria',
        card2Title: 'Esperar 1–2h por máquinas atrasa a janela das 10h às 15h',
        card2Text: 'Lavandaria no imóvel é o maior desperdício de tempo. Se a máquina de secar demorar, o turnover atrasa e o próximo check-in entra em pânico.',
        card2Sol: 'Nossa Solução: Sistema de rotação rápida de lençóis e parceria de lavandaria externa — turnovers até 50% mais rápidos e sempre a horas.',
        card3Badge: 'Faltas & Zero Backup',
        card3Title: 'Faxineiros que faltam à última hora em domingos e feriados',
        card3Text: 'Ficar sem ninguém a uma hora do checkout num domingo de época alta obriga o anfitrião a largar tudo e correr para limpar o alojamento.',
        card3Sol: 'Nossa Solução: SLA de Backup 100% Garantido 7 dias/semana — se um profissional adoecer, um substituto treinado assume automaticamente.',
        card4Badge: 'Extorsão de Reembolsos',
        card4Title: 'Hóspedes que inventam queixas para exigir noites grátis',
        card4Text: 'Sem prova documental de como o apartamento foi entregue, o suporte do Airbnb tende a dar razão ao hóspede e retirar dinheiro ao anfitrião.',
        card4Sol: 'Nossa Solução: Auditoria de 10–15 fotos com carimbo de data/hora enviada para o seu WhatsApp antes de cada check-in como prova irrefutável.',
        card5Badge: 'Danos Ocultos & AirCover',
        card5Title: 'Danos não reportados a tempo impedem acionar o AirCover',
        card5Text: 'Quando o anfitrião descobre móveis partidos, nódoas ou comandos desaparecidos já o novo hóspede entrou, perdendo o direito à caução.',
        card5Sol: 'Nossa Solução: "Inspeção de Chegada" nos primeiros 15 minutos com fotos imediatas para reportar ao Airbnb antes da nova entrada.',
        card6Badge: 'Consumíveis & Manutenção',
        card6Title: 'Falta de papel higiénico, cápsulas de café e luzes fundidas',
        card6Text: 'Cleaners comuns ignoram lâmpadas fundidas, comandos sem pilhas e deixam o hóspede sem café de boas-vindas nem amenidades.',
        card6Sol: 'Nossa Solução: Controlo e reposição de consumíveis em cada turnover + verificação técnica preventiva de lâmpadas, AC e canalização.',
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
        card1Desc: 'Cozinha impecável, desinfeção de casas de banho, chão sem cabelos, rodapés limpos, interior de micro-ondas e espelhos brilhantes.',
        card1Tag: 'Incluído em todas as limpezas',
        card2Title: 'Camas Feitas com Padrão de Hotel',
        card2Desc: 'Troca de roupa de cama com cantos hospitalares dobrados, almofadas afofadas e conjuntos de toalhas organizados sobre a cama.',
        card2Tag: 'Padrão de hotelaria',
        card3Title: 'Reposição de Consumíveis',
        card3Desc: 'Produtos de higiene, cápsulas de café, chá e papel fornecidos pelo anfitrião repostos de raiz (pack de abastecimento opcional disponível).',
        card3Tag: 'Consumíveis do anfitrião ou pack extra',
        card4Title: 'Auditoria com 10–15 Fotos',
        card4Desc: 'Fotografias com carimbo de data/hora de cada divisão enviadas para o seu WhatsApp imediatamente após a conclusão do turnover.',
        card4Tag: '100% de prova contra extorsões',
        card5Title: 'Relatório de Danos Pré-Chegada',
        card5Desc: 'Inspeção nos primeiros 15 minutos: documentamos qualquer quebra com fotos antes da chegada do próximo hóspede para acionar o AirCover.',
        card5Tag: 'Protege os seus pedidos no AirCover',
        card6Title: 'Profissionais Verificados e Especializados',
        card6Desc: 'Profissionais com antecedentes verificados e formação especializada em turnovers rápidos de Alojamento Local e hotelaria.',
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
        t1Ribbon: 'Mais Comum na Região',
        t2Badge: '2 Quartos',
        t2Title: 'Apartamento T2',
        t3Badge: '3 Quartos',
        t3Title: 'Apartamento T3',
        featureFullClean: 'Limpeza completa de turnover (42 pontos)',
        featureBedLinen: 'Troca e arrumação de roupa de cama',
        featurePhotoChecklist: 'Auditoria de fotos no WhatsApp',
        featureDamageReport: 'Inspeção de danos para AirCover',
        featureT1Full: 'Quarto, sala, casa de banho e cozinha',
        featureT2Beds: 'Até 2 quartos e 2 casas de banho',
        featureT3Large: 'Unidade grande e desinfeção profunda',
        bookTrialBtn: 'Pedir Limpeza Grátis',
        bookT1Btn: 'Obter Limpeza T1 Grátis',
        volumeBanner: 'Gere entre 3 e 5 unidades em Lisboa, Cascais, Oeiras ou Sintra? Descontos de volume e gestão de chaves dedicadas são ativados automaticamente.',
        trialBoxBadge: 'Oferta Sem Risco',
        trialBoxTitle: '1ª Limpeza gratuita — sem compromisso nem contrato.',
        trialBoxDesc: 'Experimente o nosso padrão no seu próximo checkout. Se não considerar a melhor limpeza que o seu AL já teve, não paga absolutamente nada.',
        claimCleanBtn: 'Pedir a Minha Limpeza Grátis',
      },
      howItWorks: {
        tag: 'Processo & Confiança',
        title: 'Como funciona em 3 passos simples',
        subtitle: 'Criámos o nosso processo para poupar mais de 10 horas semanais de stress operacional aos anfitriões da Grande Lisboa.',
        step1Num: '01',
        step1Title: 'Sincronize o seu calendário',
        step1Text: 'Integre o link iCal do Airbnb/PMS ou envie simplesmente as datas de checkout na nossa conversa de WhatsApp.',
        step2Num: '02',
        step2Title: 'Limpamos e enviamos auditoria fotográfica',
        step2Text: 'A nossa equipa cumpre a lista de 42 pontos, inspeciona danos em 15 minutos, repõe consumíveis e envia 10–15 fotos com carimbo de hora.',
        step3Num: '03',
        step3Title: 'Reveja e relaxe com proteção total',
        step3Text: 'O seu hóspede entra num alojamento impecável. Fatura mensal consolidada. Cancele quando quiser, sem fidelização.',
        badge1: 'Equipa Verificada & de Confiança',
        badge2: 'Auditoria com 10–15 Fotos',
        badge3: 'Gestão Segura de Cofres/Chaves',
        badge4: 'Entrega Garantida até às 15:00',
        cohortBadge: 'Vagas de Lançamento Ativas',
        cohortTitle: 'A integrar anfitriões em Lisboa, Cascais, Oeiras, Sintra e arredores',
        cohortSub: 'Limitamos o número de anfitriões parceiros para assegurar que todas as unidades cumprem rigorosamente o horário das 15:00 sem exceções.',
      },
      neighborhoods: {
        title: 'Cobertura em Lisboa, Cascais, Oeiras, Sintra e Arredores',
        subtitle: 'Equipas móveis permanentes distribuídas por todas as zonas turísticas e de lazer.',
      },
      faq: {
        tag: 'Perguntas Frequentes & Respostas Operacionais',
        title: 'Como resolvemos os maiores problemas do Alojamento Local',
        q1: 'Como resolvem a quebra de qualidade que acontece ao fim de algumas semanas ("Standard Drift")?',
        a1: 'Não confiamos na memória ou no acaso. Cada turnover segue uma lista digital obrigatória de 42 pontos (incluindo filtros de exaustor, interior de micro-ondas, gavetas e cantos de duche). O profissional só pode marcar o imóvel como "Pronto" após fazer o upload das fotos comprobatórias.',
        q2: 'Como evitam atrasos causados pela lavandaria na janela apertada das 10h às 15h?',
        a2: 'Lavar lençóis no próprio imóvel é a principal causa de atrasos e pânico em turnovers consecutivos. Trabalhamos com rotação de jogos de lençóis e parceiros de lavandaria profissional externa. A nossa equipa chega com conjuntos limpos e engomados, troca de imediato e leva a roupa usada, reduzindo o tempo no imóvel em até 50%.',
        q3: 'O que acontece se o vosso profissional faltar num domingo ou feriado de época alta?',
        a3: 'Dispomos de um SLA de Backup 100% Garantido. Ao contrário de uma empregada individual, a nossa empresa mantém profissionais de reserva em permanência 7 dias por semana. Se alguém adoecer, destacamos um substituto treinado imediatamente, sem que o anfitrião precise de se preocupar.',
        q4: 'Como é que nos protegem contra pedidos desonestos de reembolso de hóspedes no Airbnb?',
        a4: 'Enviamos uma auditoria de 10 a 15 fotos em alta resolução com carimbo de data e hora para o seu WhatsApp logo após a conclusão da limpeza. Se um hóspede tentar forjar uma reclamação de falta de limpeza, terá provas irrefutáveis com data/hora para o suporte do Airbnb recusar o pedido de reembolso.',
        q5: 'Como funciona a deteção e reporte de danos para acionar o AirCover a tempo?',
        a5: 'Nos primeiros 15 minutos após a entrada no apartamento, a equipa executa a "Inspeção de Chegada". Qualquer móvel partido, nódoas graves ou eletrodomésticos danificados pelo hóspede anterior são fotografados e enviados de imediato para que possa abrir o pedido de caução antes da entrada seguinte.',
        q6: 'Fazem reposição de consumíveis e inspeção de manutenção básica?',
        a6: 'Sim. Repomos papel higiénico, sacos de lixo, champô/gel de banho, detergente e cápsulas de café. Além disso, verificamos lâmpadas fundidas, comandos de TV/AC sem pilhas e torneiras a pingar, alertando-o imediatamente para evitar surpresas desagradáveis com o próximo hóspede.',
        q7: 'Como funciona a integração com o meu calendário de reservas (iCal / PMS)?',
        a7: 'Basta partilhar o link iCal do seu anúncio do Airbnb/Booking ou ligar o seu sistema de gestão. As nossas equipas são agendadas automaticamente em função das entradas e saídas, adaptando-se a reservas de última hora e gap nights sem necessidade de trocas constantes de mensagens.',
        q8: 'Como funciona a 1ª Limpeza Gratuita de Teste?',
        a8: 'Basta preencher o formulário no final da página ou enviar mensagem no WhatsApp. Agendamos o seu próximo turnover, executamos o serviço completo de 42 pontos e enviamos o relatório fotográfico detalhado. Não é necessário cartão de crédito nem há qualquer contrato de fidelização.',
      },
      form: {
        tag: 'Vagas Limitadas de Lançamento',
        headline: 'Peça a sua primeira limpeza de turnover gratuita.',
        sub: 'Sem cartão de crédito. Sem contratos de fidelização. Disponível para alojamentos em Lisboa, Cascais, Oeiras, Sintra e arredores.',
        perk1: 'Limpeza profunda completa com lista de 42 pontos',
        perk2: 'Auditoria fotográfica com 10–15 fotos no seu WhatsApp',
        perk3: 'Inspeção de danos e stock antes da nova entrada',
        waBoxTitle: 'Prefere resposta imediata?',
        waBoxDesc: 'Fale diretamente com a nossa equipa de operações no WhatsApp.',
        waBtn: 'Falar no WhatsApp Agora',
        boxTitle: 'Pedir Limpeza de Teste Gratuita',
        boxSubtitle: 'Preencha os dados para agendar a sua limpeza sem custos.',
        nameLabel: 'O seu Nome',
        namePlaceholder: 'ex: Manuel Silva',
        phoneLabel: 'Número de WhatsApp / Telemóvel',
        phonePlaceholder: 'ex: +351 912 345 678',
        unitsLabel: 'Número de Unidades',
        zoneLabel: 'Localização do Imóvel',
        customLocationLabel: 'Escreva a localização ou morada do seu AL',
        customLocationPlaceholder: 'ex: Sintra - Colares, Carcavelos, Parede, etc.',
        submitBtn: 'Marcar Limpeza Gratuita',
        privacyNote: 'Sem spam. Apenas entraremos em contacto para agendar a sua limpeza de turnover.',
        successTitle: 'Pedido de Limpeza Gratuita Recebido!',
        successDesc: (name: string, phone: string) =>
          `Obrigado, ${name}! A nossa equipa entrará em contacto para o seu WhatsApp (${phone}) em menos de 15 minutos para confirmar o seu agendamento.`,
        fastTrackBtn: 'Acelerar no WhatsApp',
      },
      footer: {
        tagline: 'Operações de Turnover e Proteção de Avaliações para anfitriões de Airbnb e Alojamento Local em Lisboa, Cascais, Oeiras, Sintra e arredores.',
        colServices: 'Tipologias',
        colZones: 'Zonas Atendidas',
        colContact: 'Contacto & Suporte',
        rights: 'Todos os direitos reservados. Serviços de limpeza e gestão de instalações em Portugal.',
      },
    },
    en: {
      brandSub: 'Lisbon · Cascais · Oeiras · Sintra',
      nav: {
        whyUs: 'Pain Points & Solutions',
        inclusions: 'Inclusions',
        pricing: 'Pricing',
        howItWorks: 'How It Works',
        faq: 'FAQ',
        freeCleanBtn: 'First Clean Free',
      },
      hero: {
        pill: 'Engineered for Airbnb & AL Hosts in Lisbon, Cascais, Oeiras & Sintra',
        headlinePart1: 'Your next 1-star review',
        headlinePart2: 'starts in the bathroom.',
        subheadline: 'We don\'t just sell standard cleaning — we deliver Turnover Operations & Guest Review Protection. We protect your AL revenue across Lisbon, Cascais, Oeiras & Sintra with 10–15 timestamped audit photos, zero laundry bottlenecks, and guaranteed 3:00 PM guest-ready turnovers.',
        ctaPrimary: 'Get Your First Clean Free',
        ctaSecondary: 'Message on WhatsApp',
        guarantee: 'Zero contract lock-in · Cancel anytime',
      },
      stats: {
        stat1Num: '~$3,000',
        stat1Label: 'Cost of 1 Bad Clean',
        stat1Desc: 'Average revenue lost per host in guest refunds, cancelled bookings, and Airbnb search algorithm penalties.',
        stat2Num: '-15% to -20%',
        stat2Label: 'Inquiry Drop',
        stat2Desc: 'Caused by a mere 0.5-star drop in cleanliness score on short-term rental platforms.',
        stat3Num: '100% Verified',
        stat3Label: '10–15 Photo Audit',
        stat3Desc: 'Timestamped photo audit sent to WhatsApp before check-in to safeguard against dishonest refund claims.',
      },
      pain: {
        tag: 'Real Host Pain Points vs. Our Solutions',
        title: 'Why 90% of traditional cleaners fail short-term rental hosts',
        subtitle: 'We analyzed the top operational stressors reported by Airbnb and AL hosts and engineered a systematic operation that solves every single one.',
        card1Badge: 'Quality Drift & Detail Traps',
        card1Title: 'Starts great, but cleanliness drifts after a few weeks',
        card1Text: 'Stray hairs in showers or bedsheets, greasy microwave interiors, uncleaned coffee machines, and dust under couches trigger 1-star reviews.',
        card1Sol: 'Our Solution: Strict 42-point digital checklist with mandatory photo verification and hotel-grade presentation SOPs on every clean.',
        card2Badge: 'The Laundry Bottleneck',
        card2Title: 'Waiting 1–2h on in-unit washers delays the 10am–3pm window',
        card2Text: 'On-site laundry is the #1 time-suck. If slow dryer cycles hold up the cleaner, back-to-back turnovers result in late guest check-ins.',
        card2Sol: 'Our Solution: Off-site laundry & linen swap service — cleaners arrive with fresh hotel linens, reducing on-site turnover time by up to 50%.',
        card3Badge: 'No-Shows & Flakes',
        card3Title: 'Cleaners canceling last-minute on Sundays and peak holidays',
        card3Text: 'Solo cleaners calling in sick an hour before checkout leaves hosts scrambling to drive across town and clean the apartment themselves.',
        card3Sol: 'Our Solution: 100% Guaranteed Backup SLA 7 days a week — if a cleaner is ill, a trained backup is automatically deployed.',
        card4Badge: 'Guest Refund Extortion',
        card4Title: 'Dishonest guests manufacturing flaws to demand refunds',
        card4Text: 'Without timestamped evidence of how the property was delivered, Airbnb support usually favors the guest and deducts payouts.',
        card4Sol: 'Our Solution: 10–15 timestamped photos sent to your WhatsApp right upon completion, providing indisputable legal proof.',
        card5Badge: 'Unreported Damage & AirCover',
        card5Title: 'Undetected damage prevents filing timely AirCover claims',
        card5Text: 'If cleaners fail to spot broken furniture, carpet stains, or missing remotes before the next guest arrives, your deposit claim is void.',
        card5Sol: 'Our Solution: 15-Minute "Arrival Inspection" with immediate photo dispatch to document outgoing damage before new guests arrive.',
        card6Badge: 'Consumables & Neglected Maintenance',
        card6Title: 'Empty toiletries, missing coffee pods, and unspotted burnt bulbs',
        card6Text: 'Standard maids ignore burnt-out bulbs, dead remote batteries, and forget to restock essential welcome amenities.',
        card6Sol: 'Our Solution: Rigorous consumables inventory tracking and proactive hardware checks (AC remotes, lights, plumbing leaks).',
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
        card1Desc: 'Spotless kitchen, sanitized bathrooms, hair-free floors, dusted baseboards, inside microwave cleaning, and sparkling mirrors.',
        card1Tag: 'Standard in every clean',
        card2Title: 'Bed Making & Linen Care',
        card2Desc: 'Fresh linen change with tight hospital corners, pillow fluffing, and neatly folded bath towel sets staged on the bed.',
        card2Tag: 'Hotel standard',
        card3Title: 'Consumables Restocking',
        card3Desc: 'Host-supplied toiletries, Nespresso capsules, tea, and paper goods restocked by default. (Optional supply replenishment packs available).',
        card3Tag: 'Host supplies or pack add-on',
        card4Title: '10–15 Photo Audit Checklist',
        card4Desc: 'High-resolution timestamped photos of every completed zone sent to your WhatsApp immediately upon turnover completion.',
        card4Tag: '100% proof against refund claims',
        card5Title: 'Pre-Arrival Damage Reporting',
        card5Desc: '15-minute arrival audit: we document and flag any guest damage or broken items with photos before the next guest arrives.',
        card5Tag: 'Protects your deposit claims',
        card6Title: 'Vetted & STR-Trained Cleaners',
        card6Desc: 'Background-checked professionals with specialized training in fast short-term rental turnover standards and hospitality.',
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
        t1Ribbon: 'Most Common across Region',
        t2Badge: '2 Bedroom',
        t2Title: 'T2 Apartment',
        t3Badge: '3 Bedroom',
        t3Title: 'T3 Apartment',
        featureFullClean: 'Full turnover clean (42 points)',
        featureBedLinen: '1 Bed linen change & staging',
        featurePhotoChecklist: '10–15 Photo audit to WhatsApp',
        featureDamageReport: 'Arrival damage inspection for AirCover',
        featureT1Full: 'Full bedroom, living, bath & kitchen',
        featureT2Beds: 'Up to 2 bedrooms & 2 bathrooms',
        featureT3Large: 'Large unit turnover & deep sanitization',
        bookTrialBtn: 'Book Free Trial',
        bookT1Btn: 'Get T1 Clean Free',
        volumeBanner: 'Managing 3 to 5 units in Lisbon, Cascais, Oeiras or Sintra? Volume pricing and dedicated key-holding discounts automatically kick in.',
        trialBoxBadge: 'Risk-Free Offer',
        trialBoxTitle: 'First clean free — no commitment, no contract.',
        trialBoxDesc: 'Test our turnover standard on your next guest checkout. If you don\'t think it\'s the best clean your AL has ever had, you owe nothing.',
        claimCleanBtn: 'Claim Your Free Clean',
      },
      howItWorks: {
        tag: 'Process Trust',
        title: 'How it works in 3 simple steps',
        subtitle: 'We built our process to save hosts 10+ hours a week in operational chaos.',
        step1Num: '01',
        step1Title: 'Sync your calendar',
        step1Text: 'Connect your Airbnb/PMS iCal link or simply drop checkout dates in our dedicated WhatsApp operations thread.',
        step2Num: '02',
        step2Title: 'We clean & send photo audit',
        step2Text: 'Our cleaner arrives on time, performs a 15-min damage check, follows the 42-point checklist, and sends 10–15 timestamped audit photos.',
        step3Num: '03',
        step3Title: 'You review & relax with full protection',
        step3Text: 'Your guest checks in to a pristine apartment. You receive a monthly consolidated invoice. Cancel anytime with zero lock-in contracts.',
        badge1: 'Vetted & Trusted Cleaners',
        badge2: '10–15 Photo Audit Checklist',
        badge3: 'Secure Key Lockbox Handling',
        badge4: 'Guaranteed Ready by 3:00 PM',
        cohortBadge: 'Active Launch Cohort',
        cohortTitle: 'Onboarding hosts across Lisbon, Cascais, Oeiras, Sintra & surrounds',
        cohortSub: 'We limit our partner roster to ensure every unit receives guaranteed 3:00 PM turnaround times without compromise.',
      },
      neighborhoods: {
        title: 'Covering Lisbon, Cascais, Oeiras, Sintra & Surrounding Hubs',
        subtitle: 'Dedicated mobile turnover teams across all major short-term rental zones.',
      },
      faq: {
        tag: 'Frequently Asked Questions & Operational Answers',
        title: 'How we solve the top short-term rental challenges',
        q1: 'How do you solve quality slippage over time ("Standard Drift")?',
        a1: 'We don\'t rely on memory or casual routines. Every single turnover follows an enforced 42-point digital checklist (including oven interiors, range hoods, cabinet interiors, and shower grout). Cleaners cannot mark an apartment "Ready" without uploading standardized inspection photos.',
        q2: 'How do you avoid laundry bottlenecks during the tight 10am–3pm window?',
        a2: 'Running in-unit laundry is the #1 cause of turnover delays. We operate on a linen rotation system (3+ sets) and partner with commercial off-site laundries. Cleaners walk in with fresh hotel-pressed linens, swap them immediately, and bag dirty linens, cutting turnover time by up to 50%.',
        q3: 'What happens if a cleaner is sick or cancels on a Sunday / peak holiday?',
        a3: 'We provide a 100% Guaranteed Backup SLA. Unlike independent solo cleaners, we maintain full-time standby replacement staff 7 days a week. If a primary cleaner is unavailable, a vetted backup is deployed automatically with zero host effort.',
        q4: 'How do you protect hosts against dishonest guests demanding refunds on Airbnb?',
        a4: 'Immediately upon finishing every clean, we send a 10–15 photo high-resolution audit with timestamps directly to your WhatsApp. If a guest manufactures a claim to extract discounts, you have concrete time-stamped proof for Airbnb support to dismiss the claim.',
        q5: 'How does damage reporting work to ensure AirCover claims are accepted?',
        a5: 'During the first 15 minutes of entering the property, cleaners execute an "Arrival Inspection Checklist". Any pre-existing damage, broken glass, carpet stains, or missing remotes from departing guests are photographed immediately so you can file an AirCover claim before the next guest arrives.',
        q6: 'Do you restock consumables and check basic property maintenance?',
        a6: 'Yes. We restock toilet paper, trash bags, hand soap, shower gel, dish tabs, and coffee capsules. We also test lights, AC/TV remotes, and check for plumbing leaks, alerting you proactively before guest check-in.',
        q7: 'Can you integrate with my Airbnb booking calendar or PMS?',
        a7: 'Yes! Connect your Airbnb/Booking.com iCal link or PMS. Our dispatch system automatically schedules turnover slots as bookings come in, adjusting seamlessly to last-minute bookings or schedule changes.',
        q8: 'How does the "First Clean Free" trial work?',
        a8: 'Fill out the form below or drop us a WhatsApp message. We will book your upcoming checkout turnover, perform the full 42-point service, and send you the timestamped photo report. No payment details required and zero obligation.',
      },
      form: {
        tag: 'Limited Launch Spots',
        headline: 'Claim your first turnover clean free.',
        sub: 'No credit card required. No lock-in contracts. Available across Lisbon, Cascais, Oeiras, Sintra & surrounds.',
        perk1: 'Full 42-point turnover deep clean',
        perk2: 'Timestamped 10–15 photo audit sent to WhatsApp',
        perk3: '15-Minute damage & consumables inspection check',
        waBoxTitle: 'Prefer instant response?',
        waBoxDesc: 'Chat directly with our operations team on WhatsApp.',
        waBtn: 'Chat on WhatsApp Now',
        boxTitle: 'Get Your Free Trial Clean',
        boxSubtitle: 'Fill in your details to claim your free turnover clean.',
        nameLabel: 'Your Name',
        namePlaceholder: 'e.g. Manuel Silva',
        phoneLabel: 'WhatsApp / Phone Number',
        phonePlaceholder: 'e.g. +351 912 345 678',
        unitsLabel: 'Number of Units',
        zoneLabel: 'Property Location',
        customLocationLabel: 'Type your exact location or address',
        customLocationPlaceholder: 'e.g. Sintra - Colares, Carcavelos, Parede, etc.',
        submitBtn: 'Book Your Free Clean',
        privacyNote: 'No spam. We only contact you to schedule your turnover clean.',
        successTitle: 'Trial Clean Request Received!',
        successDesc: (name: string, phone: string) =>
          `Thank you, ${name}! Our team will message your WhatsApp (${phone}) within 15 minutes to confirm your turnover date.`,
        fastTrackBtn: 'Fast-track on WhatsApp',
      },
      footer: {
        tagline: 'Turnover Operations & Guest Review Protection for Airbnb & Alojamento Local hosts across Lisbon, Cascais, Oeiras, Sintra and surrounding areas.',
        colServices: 'Services',
        colZones: 'Regions Covered',
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
              className="btn-whatsapp-sm hidden-mobile"
              title="WhatsApp"
            >
              <MessageSquare size={15} />
              <span>WhatsApp</span>
            </a>
            <button onClick={scrollToForm} className="btn-trial-nav hidden-mobile">
              {t.nav.freeCleanBtn}
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
            <nav className="mobile-drawer-nav">
              <a
                href="#pain-points"
                className="mobile-nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.nav.whyUs}
              </a>
              <a
                href="#what-is-included"
                className="mobile-nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.nav.inclusions}
              </a>
              <a
                href="#pricing"
                className="mobile-nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.nav.pricing}
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
                  scrollToForm();
                }}
                className="btn-primary-hero"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <span>{t.nav.freeCleanBtn}</span>
                <ArrowRight size={16} />
              </button>

              <a
                href={whatsappUrl}
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

      {/* ── Pain Points & Solutions Section (Reddit/Community Research) ─── */}
      <section id="pain-points" className="section-wrapper bg-surface-alt">
        <div className="content-container">
          <div className="section-heading-center">
            <div className="section-tag">{t.pain.tag}</div>
            <h2 className="section-title">{t.pain.title}</h2>
            <p className="section-subtitle">{t.pain.subtitle}</p>
          </div>

          <div className="pain-grid pain-grid-6">
            {/* Card 1: Quality Drift */}
            <div className="pain-card">
              <div className="pain-icon-box">
                <Sparkles size={22} />
              </div>
              <div className="pain-badge">{t.pain.card1Badge}</div>
              <h3 className="pain-title">{t.pain.card1Title}</h3>
              <p className="pain-text">{t.pain.card1Text}</p>
              <div className="pain-solution-box">
                <CheckCircle2 size={15} className="text-accent flex-shrink-0" />
                <span>{t.pain.card1Sol}</span>
              </div>
            </div>

            {/* Card 2: Laundry Bottleneck */}
            <div className="pain-card">
              <div className="pain-icon-box">
                <RefreshCw size={22} />
              </div>
              <div className="pain-badge">{t.pain.card2Badge}</div>
              <h3 className="pain-title">{t.pain.card2Title}</h3>
              <p className="pain-text">{t.pain.card2Text}</p>
              <div className="pain-solution-box">
                <CheckCircle2 size={15} className="text-accent flex-shrink-0" />
                <span>{t.pain.card2Sol}</span>
              </div>
            </div>

            {/* Card 3: No-shows / Backup */}
            <div className="pain-card">
              <div className="pain-icon-box">
                <Clock size={22} />
              </div>
              <div className="pain-badge">{t.pain.card3Badge}</div>
              <h3 className="pain-title">{t.pain.card3Title}</h3>
              <p className="pain-text">{t.pain.card3Text}</p>
              <div className="pain-solution-box">
                <CheckCircle2 size={15} className="text-accent flex-shrink-0" />
                <span>{t.pain.card3Sol}</span>
              </div>
            </div>

            {/* Card 4: Guest Extortion */}
            <div className="pain-card">
              <div className="pain-icon-box">
                <Camera size={22} />
              </div>
              <div className="pain-badge">{t.pain.card4Badge}</div>
              <h3 className="pain-title">{t.pain.card4Title}</h3>
              <p className="pain-text">{t.pain.card4Text}</p>
              <div className="pain-solution-box">
                <CheckCircle2 size={15} className="text-accent flex-shrink-0" />
                <span>{t.pain.card4Sol}</span>
              </div>
            </div>

            {/* Card 5: Damage & AirCover */}
            <div className="pain-card">
              <div className="pain-icon-box">
                <Eye size={22} />
              </div>
              <div className="pain-badge">{t.pain.card5Badge}</div>
              <h3 className="pain-title">{t.pain.card5Title}</h3>
              <p className="pain-text">{t.pain.card5Text}</p>
              <div className="pain-solution-box">
                <CheckCircle2 size={15} className="text-accent flex-shrink-0" />
                <span>{t.pain.card5Sol}</span>
              </div>
            </div>

            {/* Card 6: Consumables & Maintenance */}
            <div className="pain-card">
              <div className="pain-icon-box">
                <Coffee size={22} />
              </div>
              <div className="pain-badge">{t.pain.card6Badge}</div>
              <h3 className="pain-title">{t.pain.card6Title}</h3>
              <p className="pain-text">{t.pain.card6Text}</p>
              <div className="pain-solution-box">
                <CheckCircle2 size={15} className="text-accent flex-shrink-0" />
                <span>{t.pain.card6Sol}</span>
              </div>
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
              <img
                src="/images/after-turnover.jpg"
                alt="5-Star Guest Ready Turnover"
                className="slider-photo"
                draggable={false}
              />
              <div className="slider-overlay ready-overlay">
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
              <img
                src="/images/before-turnover.jpg"
                alt="Post Checkout Mess"
                className="slider-photo"
                draggable={false}
              />
              <div className="slider-overlay messy-overlay">
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

          {/* Trust Badges */}
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

      {/* ── Lisboa, Cascais, Oeiras, Sintra & Surroundings ─────────────────── */}
      <section className="section-wrapper neighborhoods-section">
        <div className="content-container">
          <div className="neighborhoods-box">
            <div className="neighborhoods-header">
              <MapPin size={24} className="text-accent" />
              <div>
                <h3>{t.neighborhoods.title}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {t.neighborhoods.subtitle}
                </p>
              </div>
            </div>

            <div className="location-groups-grid">
              {locationGroups.map((grp) => (
                <div key={grp.region} className="location-group-card">
                  <div className="location-group-title">{grp.region}</div>
                  <div className="neighborhood-chips">
                    {grp.places.map((place) => (
                      <span key={place} className="chip">
                        <Check size={12} /> {place}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ Accordion Section (Click question with plus icon to reveal answer) ─ */}
      <section id="faq" className="section-wrapper bg-surface-alt">
        <div className="content-container">
          <div className="section-heading-center">
            <div className="section-tag">{t.faq.tag}</div>
            <h2 className="section-title">{t.faq.title}</h2>
          </div>

          <div className="faq-accordion-list">
            {[
              { q: t.faq.q1, a: t.faq.a1 },
              { q: t.faq.q2, a: t.faq.a2 },
              { q: t.faq.q3, a: t.faq.a3 },
              { q: t.faq.q4, a: t.faq.a4 },
              { q: t.faq.q5, a: t.faq.a5 },
              { q: t.faq.q6, a: t.faq.a6 },
              { q: t.faq.q7, a: t.faq.a7 },
              { q: t.faq.q8, a: t.faq.a8 },
            ].map((faq, idx) => {
              const isOpen = openFaqs.includes(idx);
              return (
                <div
                  key={idx}
                  className={`faq-accordion-card ${isOpen ? 'open' : ''}`}
                >
                  <button
                    type="button"
                    className="faq-accordion-trigger"
                    onClick={() => toggleFaq(idx)}
                    aria-expanded={isOpen}
                  >
                    <span className="faq-question-title">{faq.q}</span>
                    <div className={`faq-plus-badge ${isOpen ? 'open' : ''}`}>
                      <Plus size={18} />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="faq-accordion-body animate-fade-in">
                      <p className="faq-answer-text">{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
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
                        options={locationOptions}
                        onChange={(val) => setFormData({ ...formData, neighborhood: val })}
                      />
                    </div>
                  </div>

                  {/* Custom Location Write-in Input */}
                  {formData.neighborhood === 'Outro' && (
                    <div className="form-group animate-fade-in" style={{ marginTop: '4px' }}>
                      <label htmlFor="custom-location">{t.form.customLocationLabel}</label>
                      <input
                        id="custom-location"
                        type="text"
                        required
                        placeholder={t.form.customLocationPlaceholder}
                        value={formData.customLocation}
                        onChange={(e) => setFormData({ ...formData, customLocation: e.target.value })}
                      />
                    </div>
                  )}

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
              <span>Lisboa & Parque das Nações</span>
              <span>Cascais, Estoril & Carcavelos</span>
              <span>Oeiras, Paço de Arcos & Algés</span>
              <span>Sintra, Colares & Queluz</span>
              <span>Almada & Costa da Caparica</span>
            </div>
            <div className="footer-column">
              <span className="footer-col-title">{t.footer.colContact}</span>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">WhatsApp Support</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Impporta AL. {t.footer.rights}</p>
        </div>
      </footer>

      {/* ── Mobile Sticky Floating Bottom CTA Bar ─────────────────────── */}
      <div className="mobile-floating-bar">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mobile-floating-wa-btn"
          aria-label="WhatsApp"
        >
          <MessageSquare size={18} />
          <span>WhatsApp</span>
        </a>
        <button
          onClick={scrollToForm}
          className="mobile-floating-trial-btn"
        >
          <span>{t.nav.freeCleanBtn}</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
