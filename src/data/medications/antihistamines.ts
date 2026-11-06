import { Medication } from '../../types';

export const ANTIHISTAMINES_MEDICATIONS: Medication[] = [
  // ==========================================
  // ANTI-HISTAMÍNICOS DE 2ª GERAÇÃO (NÃO SEDANTES)
  // ==========================================
  {
    id: 'loratadina-10-cp',
    name: 'Loratadina 10mg',
    genericName: 'Loratadina',
    brandName: 'Claritin 10mg',
    class: 'Anti-histamínico H1 de 2ª Geração Não Sedante',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '10mg - Comprimidos (caixa com 12)',
    availablePresentations: [
      '10mg - Comprimidos (caixa com 12)',
      '1mg/mL - Xarope frasco 100mL'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral uma vez ao dia pela manhã por 5 a 10 dias.',
    instructions: 'Não causa sonolência na maioria dos indivíduos. Ingerir com água com ou sem alimentos.'
  },
  {
    id: 'loratadina-xarope-1mg',
    name: 'Loratadina Xarope Pediátrico 1mg/mL',
    genericName: 'Loratadina',
    brandName: 'Claritin Xarope',
    class: 'Anti-histamínico Pediátrico',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '1mg/mL - Frasco com 100mL com copo dosador',
    availablePresentations: ['1mg/mL - Frasco 100mL'],
    defaultPosology: 'Crianças de 2 a 12 anos (> 30kg: 10mL 1x/dia; < 30kg: 5mL 1x/dia) por via oral.',
    instructions: 'Tomar 1 vez ao dia.'
  },
  {
    id: 'desloratadina-5-cp',
    name: 'Desloratadina 5mg',
    genericName: 'Desloratadina',
    brandName: 'Desalex 5mg',
    class: 'Anti-histamínico H1 Não Sedante de Longa Ação',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '5mg - Comprimidos revestidos (caixa com 10 ou 30)',
    availablePresentations: [
      '5mg - Comprimidos (caixa com 30)',
      '0,5mg/mL - Xarope frasco 60mL e 100mL'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral 1 vez ao dia, no mesmo horário, por 10 a 30 dias.',
    instructions: 'Ação rápida e prolongada por 24 horas sem efeito sedativo.'
  },
  {
    id: 'fexofenadina-180-cp',
    name: 'Cloridrato de Fexofenadina 180mg',
    genericName: 'Cloridrato de Fexofenadina',
    brandName: 'Allegra 180mg',
    class: 'Anti-histamínico H1 Não Sedativo de Alta Eficácia',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '180mg - Comprimidos revestidos (caixa com 10)',
    availablePresentations: [
      '120mg - Comprimidos (caixa com 10)',
      '180mg - Comprimidos (caixa com 10)',
      '60mg/mL - Suspensão oral pediátrica frasco 60mL'
    ],
    defaultPosology: 'Urticária e rinite alérgica: tomar 1 comprimido de 180mg por via oral 1 vez ao dia com água.',
    instructions: 'Não ingerir concomitantemente com suco de maçã, laranja ou toranja (grapefruit) para não reduzir a absorção.'
  },
  {
    id: 'cetirizina-10-cp',
    name: 'Dicloridrato de Cetirizina 10mg',
    genericName: 'Dicloridrato de Cetirizina',
    brandName: 'Zyrtec 10mg',
    class: 'Anti-histamínico H1',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '10mg - Comprimidos revestidos (caixa com 12)',
    availablePresentations: [
      '10mg - Comprimidos (caixa com 12)',
      '10mg/mL - Gotas frasco 20mL'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral uma vez ao dia à noite.',
    instructions: 'Excelente eficácia em prurido e lesões cutâneas alérgicas.'
  },
  {
    id: 'levocetirizina-5-cp',
    name: 'Dicloridrato de Levocetirizina 5mg',
    genericName: 'Dicloridrato de Levocetirizina',
    brandName: 'Zyxem 5mg',
    class: 'Enantiômero Puro Anti-histamínico',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '5mg - Comprimidos revestidos (caixa com 10 ou 30)',
    availablePresentations: [
      '5mg - Comprimidos (caixa com 30)',
      '0,5mg/mL - Solução oral frasco 60mL'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral uma vez ao dia à noite com água.',
    instructions: 'Ação rápida em rinite alérgica e urticária crônica espontânea.'
  },
  {
    id: 'bilastina-20-cp',
    name: 'Bilastina 20mg',
    genericName: 'Bilastina',
    brandName: 'Alektos 20mg',
    class: 'Anti-histamínico de Última Geração Zero Sedação',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '20mg - Comprimidos (caixa com 30)',
    availablePresentations: [
      '20mg - Comprimidos (caixa com 30)',
      '2,5mg/mL - Solução oral frasco 120mL'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral 1 vez ao dia, 1 hora antes ou 2 horas após as refeições ou sucos de frutas.',
    instructions: 'Obrigatório ingerir em jejum com água (alimentos reduzem em até 30% a biodisponibilidade).'
  },

  // ==========================================
  // ANTI-HISTAMÍNICOS CLÁSSICOS (1ª GERAÇÃO)
  // ==========================================
  {
    id: 'dexclorfeniramina-2-cp',
    name: 'Maleato de Dexclorfeniramina 2mg (Polaramine)',
    genericName: 'Maleato de Dexclorfeniramina',
    brandName: 'Polaramine 2mg',
    class: 'Anti-histamínico Clássico Sedante',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '2mg - Comprimidos (caixa com 20)',
    availablePresentations: [
      '2mg - Comprimidos (caixa com 20)',
      '2mg/5mL - Solução oral frasco 120mL',
      'Gotas frasco 20mL',
      'Creme dermatológico 10mg/g bisnaga 30g'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral a cada 6 ou 8 horas se prurido ou sintomas alérgicos agudos.',
    instructions: 'Causa sonolência significativa e boca seca. Não dirigir veículos durante o uso.'
  },
  {
    id: 'celestamine-cp',
    name: 'Maleato de Dexclorfeniramina + Betametasona',
    genericName: 'Dexclorfeniramina + Betametasona',
    brandName: 'Celestamine',
    class: 'Anti-histamínico + Corticoide Combinado',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '2mg + 0,25mg - Comprimidos (caixa com 20)',
    availablePresentations: [
      'Comprimidos (caixa com 20)',
      'Xarope frasco com 120mL'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral a cada 8 ou 12 horas por no máximo 5 a 7 dias.',
    instructions: 'Contém corticoide. Uso de curto prazo para crises alérgicas agudas intensas com edema.'
  },
  {
    id: 'prometazina-25-cp',
    name: 'Cloridrato de Prometazina 25mg',
    genericName: 'Cloridrato de Prometazina',
    brandName: 'Fenergan 25mg',
    class: 'Anti-histamínico Fenotiazínico Potente com Ação Sedativa',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '25mg - Comprimidos revestidos (caixa com 20)',
    availablePresentations: [
      '25mg - Comprimidos (caixa com 20)',
      '50mg/2mL - Ampola injetável IM profunda'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral à noite ao deitar se prurido intenso ou alergia cutânea.',
    instructions: 'Forte ação sedativa e anticolinérgica. Não ingerir com bebidas alcoólicas.'
  },
  {
    id: 'prometazina-ampola-50mg',
    name: 'Cloridrato de Prometazina 50mg/2mL Injetável',
    genericName: 'Cloridrato de Prometazina',
    brandName: 'Fenergan Ampola',
    class: 'Anti-histamínico Parenteral Sedativo',
    type: 'simples',
    defaultRoute: 'Uso intramuscular',
    defaultPresentation: '50mg/2mL - Ampola IM',
    availablePresentations: ['50mg/2mL - Ampola IM profunda'],
    defaultPosology: 'Aplicar 1 ampola (50mg) por via intramuscular profunda no glúteo em dose única.',
    instructions: 'EXCLUSIVAMENTE INTRAMUSCULAR PROFUNDA. Risco grave de necrose tecidual se extravasamento ou aplicação intra-arterial acidental.'
  },
  {
    id: 'hidroxizina-25-cp',
    name: 'Dicloridrato de Hidroxizina 25mg',
    genericName: 'Dicloridrato de Hidroxizina',
    brandName: 'Hixizine 25mg',
    class: 'Anti-histamínico e Antipruriginoso Oral',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '25mg - Comprimidos (caixa com 30)',
    availablePresentations: [
      '25mg - Comprimidos (caixa com 30)',
      '2mg/mL - Xarope frasco com 120mL'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral à noite ao deitar (ou 1 comprimido de 12/12h se prurido severo).',
    instructions: 'Primeira escolha para alívio sintomático de prurido intenso por dermatite atópica e urticária.'
  },

  // ==========================================
  // ANTIVERTIGINOSOS E LABIRINTOPATIAS
  // ==========================================
  {
    id: 'betaistina-24-cp',
    name: 'Dicloridrato de Betaistina 24mg',
    genericName: 'Dicloridrato de Betaistina',
    brandName: 'Labirin / Betaserc 24mg',
    class: 'Antivertiginoso / Análogo da Histamina para Síndrome de Ménière',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '24mg - Comprimidos (caixa com 30 ou 60)',
    availablePresentations: [
      '16mg - Comprimidos (caixa com 30)',
      '24mg - Comprimidos (caixa com 60)'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral 2 vezes ao dia (de 12 em 12 horas), durante as refeições, por 30 a 60 dias.',
    instructions: 'Tomar junto com alimentos para prevenir azia ou gastrite. Indicado para vertigem, zumbido e sensação de plenitude auricular.'
  },
  {
    id: 'cinarizina-75-cp',
    name: 'Cinarizina 75mg',
    genericName: 'Cinarizina',
    brandName: 'Stugeron 75mg',
    class: 'Vasodilatador Periférico e Antivertiginoso',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '75mg - Comprimidos (caixa com 30)',
    availablePresentations: [
      '25mg - Comprimidos (caixa com 30)',
      '75mg - Comprimidos (caixa com 30)'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral 1 vez ao dia à noite ao deitar com água após refeição.',
    instructions: 'Evitar uso prolongado em idosos pelo risco de sintomas extrapiramidais e parkinsonismo farmacológico.'
  },
  {
    id: 'flunarizina-10-cp',
    name: 'Dicloridrato de Flunarizina 10mg',
    genericName: 'Dicloridrato de Flunarizina',
    brandName: 'Vertix / Flunarin 10mg',
    class: 'Bloqueador dos Canais de Cálcio e Antivertiginoso',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '10mg - Comprimidos (caixa com 30 ou 50)',
    availablePresentations: ['10mg - Comprimidos (caixa com 50)'],
    defaultPosology: 'Tomar 1 comprimido por via oral à noite ao deitar.',
    instructions: 'Pode provocar aumento de apetite, ganho de peso e sonolência.'
  }
];
