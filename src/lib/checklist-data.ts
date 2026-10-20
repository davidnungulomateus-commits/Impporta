export interface ChecklistPoint {
  id: string;
  number: number;
  label: string;
}

export interface ChecklistCategory {
  id: string;
  title: string;
  iconName: string;
  points: ChecklistPoint[];
}

export const CHECKLIST_42_SECTIONS: ChecklistCategory[] = [
  {
    id: 'kitchen',
    title: '1. Cozinha e Eletrodomésticos',
    iconName: 'Utensils',
    points: [
      { id: 'p1', number: 1, label: 'Verificação do frigorífico (vazio, limpo, sem restos de comida de hóspedes anteriores e desodorizado).' },
      { id: 'p2', number: 2, label: 'Limpeza interior e exterior do micro-ondas.' },
      { id: 'p3', number: 3, label: 'Limpeza da placa/fogão e exaustor (remoção de gorduras).' },
      { id: 'p4', number: 4, label: 'Limpeza interior e exterior do forno (se aplicável).' },
      { id: 'p5', number: 5, label: 'Loiça, copos e talheres lavados, secos e devidamente arrumados nos armários.' },
      { id: 'p6', number: 6, label: 'Máquina de lavar loiça verificada (filtro limpo e sem loiça lá dentro).' },
      { id: 'p7', number: 7, label: 'Pequenos eletrodomésticos limpos (torradeira, cafeteira/máquina de café esvaziada e limpa).' },
      { id: 'p8', number: 8, label: 'Bancadas, lava-loiça e torneiras desinfetadas e abrilhantadas.' },
      { id: 'p9', number: 9, label: 'Caixote do lixo limpo, desinfetado e com saco novo colocado.' }
    ]
  },
  {
    id: 'bedrooms',
    title: '2. Quartos e Camas',
    iconName: 'Bed',
    points: [
      { id: 'p10', number: 10, label: 'Remoção de toda a roupa de cama usada.' },
      { id: 'p11', number: 11, label: 'Verificação minuciosa de esquecimentos de objetos pessoais (debaixo dos colchões, almofadas, gavetas e roupeiros).' },
      { id: 'p12', number: 12, label: 'Colocação de novo jogo de roupa de cama limpa (estilo hoteleiro, esticada e sem rugas).' },
      { id: 'p13', number: 13, label: 'Almofadas e edredões ajeitados e limpos.' },
      { id: 'p14', number: 14, label: 'Limpeza de pó em mesas de cabeceira, cabeceiras de cama e superfícies.' },
      { id: 'p15', number: 15, label: 'Limpeza de pó no interior de roupeiros e gavetas.' },
      { id: 'p16', number: 16, label: 'Aspiração e limpeza de pavimentos nos quartos (incluindo rodapés e cantos difíceis).' },
      { id: 'p17', number: 17, label: 'Verificação de cortinados, estores e iluminação do quarto.' },
      { id: 'p18', number: 18, label: 'Arejamento final do espaço (quando aplicável).' }
    ]
  },
  {
    id: 'bathrooms',
    title: '3. Casas de Banho',
    iconName: 'Bath',
    points: [
      { id: 'p19', number: 19, label: 'Remoção de todas as toalhas usadas e tapetes de banho.' },
      { id: 'p20', number: 20, label: 'Desinfeção profunda e lavagem da sanita (interior, exterior e assento).' },
      { id: 'p21', number: 21, label: 'Limpeza e descalcificação do lavatório, torneiras e bancada.' },
      { id: 'p22', number: 22, label: 'Limpeza completa da base de duche / banheira (remoção de resíduos de sabonete e calcário).' },
      { id: 'p23', number: 23, label: 'Limpeza e desinfeção dos vidros do duche ou cortina.' },
      { id: 'p24', number: 24, label: 'Limpeza de espelhos sem manchas ou marcas de água.' },
      { id: 'p25', number: 25, label: 'Reposição de papel higiénico (mínimo de rolos exigidos pela norma).' },
      { id: 'p26', number: 26, label: 'Colocação de atoalhados limpos (toalhas de banho, de rosto e tapete de banho) devidamente dobrados.' },
      { id: 'p27', number: 27, label: 'Esvaziamento do caixote do lixo com colocação de saco novo.' },
      { id: 'p28', number: 28, label: 'Varrimento e lavagem final do chão da casa de banho.' }
    ]
  },
  {
    id: 'living_room',
    title: '4. Sala e Áreas Comuns / Hall',
    iconName: 'Sofa',
    points: [
      { id: 'p29', number: 29, label: 'Limpeza de pó em mesas de centro, móvel de TV e superfícies de apoio.' },
      { id: 'p30', number: 30, label: 'Organização de sofás, almofadas decorativas e mantas.' },
      { id: 'p31', number: 31, label: 'Limpeza de ecrãs (televisão) com produto adequado (sem riscos).' },
      { id: 'p32', number: 32, label: 'Aspiração e limpeza de tapetes, carpetes e pavimentos em toda a área social.' },
      { id: 'p33', number: 33, label: 'Limpeza de portas, puxadores e interruptores de luz (pontos de maior toque).' },
      { id: 'p34', number: 34, label: 'Limpeza de vidros interiores e caixilharia (quando contemplado ou necessário).' },
      { id: 'p35', number: 35, label: 'Verificação do bom funcionamento das lâmpadas e substituição se necessário.' },
      { id: 'p36', number: 36, label: 'Limpeza do hall de entrada e desobstrução de zonas de passagem.' }
    ]
  },
  {
    id: 'final_inspection',
    title: '5. Inspeção Final e Segurança',
    iconName: 'ShieldCheck',
    points: [
      { id: 'p37', number: 37, label: 'Verificação geral de danos, riscos ou anomalias no imóvel (para efeitos de acionamento do AirCover).' },
      { id: 'p38', number: 38, label: 'Controlo de stock de consumíveis de reserva e aviso de necessidade de reposição.' },
      { id: 'p39', number: 39, label: 'Desligar luzes desnecessárias, climatização (AC/aquecedores) e verificar tomadas.' },
      { id: 'p40', number: 40, label: 'Fecho e tranca de todas as janelas e portas exteriores.' },
      { id: 'p41', number: 41, label: 'Execução do relatório fotográfico final (10 a 15 fotografias com carimbo temporal).' },
      { id: 'p42', number: 42, label: 'Envio imediato do relatório de fotos e checklist validada via WhatsApp para a central/proprietário.' }
    ]
  }
];

export const ALL_42_CHECKLIST_POINTS: ChecklistPoint[] = CHECKLIST_42_SECTIONS.flatMap(s => s.points);
