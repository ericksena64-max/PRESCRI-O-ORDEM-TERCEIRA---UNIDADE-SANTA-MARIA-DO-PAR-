import { Medication } from '../../types';

export const ANTI_INFLAMMATORIES_MEDICATIONS: Medication[] = [
  {
    id: 'ibuprofeno-600',
    name: 'Ibuprofeno 600mg',
    genericName: 'Ibuprofeno',
    brandName: 'Alivium / Advil 600mg',
    class: 'Anti-inflamatório Não Esteroidal (AINE)',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '600mg - Comprimidos (caixa com 20)',
    availablePresentations: [
      '600mg - Comprimidos (caixa com 20)',
      '400mg - Cápsulas líquidas (caixa com 16)',
      '100mg/mL - Gotas (frasco com 20mL)',
      '50mg/mL - Gotas pediátricas (frasco com 30mL)'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral a cada 8 horas, preferencialmente após as refeições, por até 5 dias.',
    instructions: 'Tomar com alimentos. Contraindicado em casos de úlcera péptica ativa, insuficiência renal grave ou hipersensibilidade ao AAS.'
  },
  {
    id: 'ibuprofeno-400',
    name: 'Ibuprofeno 400mg',
    genericName: 'Ibuprofeno',
    brandName: 'Advil 400mg / Spidufen',
    class: 'Anti-inflamatório e Analgésico',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '400mg - Cápsulas gelatinosas moles (caixa com 16)',
    availablePresentations: [
      '400mg - Cápsulas moles (caixa com 16)',
      '400mg - Envelopes granulados efervescentes (caixa com 10)'
    ],
    defaultPosology: 'Tomar 1 cápsula por via oral a cada 6 ou 8 horas se dor ou inflamação.',
    instructions: 'Ingerir após as refeições.'
  },
  {
    id: 'ibuprofeno-gotas-100',
    name: 'Ibuprofeno Gotas 100mg/mL',
    genericName: 'Ibuprofeno',
    brandName: 'Alivium 100mg/mL',
    class: 'Anti-inflamatório Pediátrico / Adulto',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '100mg/mL - Frasco conta-gotas 20mL',
    availablePresentations: [
      '100mg/mL - Frasco 20mL',
      '50mg/mL - Frasco 30mL'
    ],
    defaultPosology: 'Crianças: 1 gota por kg de peso corporal (dose máx. 20 gotas/dose) de 6/6h ou 8/8h. Adultos: 20 a 40 gotas de 8/8h.',
    instructions: '1 gota contém 5mg de ibuprofeno (100mg/mL tem 1 gota/kg; já 50mg/mL tem 2 gotas/kg).'
  },
  {
    id: 'cetoprofeno-100-cp',
    name: 'Cetoprofeno 100mg',
    genericName: 'Cetoprofeno',
    brandName: 'Profenid 100mg',
    class: 'Anti-inflamatório Não Esteroidal (AINE)',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '100mg - Comprimidos (caixa com 20)',
    availablePresentations: [
      '100mg - Comprimidos (caixa com 20)',
      '150mg - Comprimidos de liberação prolongada (caixa com 10)',
      '20mg/mL - Gotas frasco 20mL',
      '100mg - Pó injetável ampola IV/IM'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral a cada 12 horas, após as refeições, por 3 a 5 dias.',
    instructions: 'Tomar com o estômago cheio para reduzir desconforto gástrico.'
  },
  {
    id: 'cetoprofeno-150-bi-profenid',
    name: 'Cetoprofeno 150mg Bi-Profenid',
    genericName: 'Cetoprofeno',
    brandName: 'Bi-Profenid 150mg',
    class: 'Anti-inflamatório de Dupla Liberação',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '150mg - Comprimidos birranhurados (caixa com 10)',
    availablePresentations: ['150mg - Comprimidos birranhurados (caixa com 10)'],
    defaultPosology: 'Tomar 1 comprimido por via oral 1 vez ao dia (ou 1/2 comprimido de 12/12h), com água, após refeição, por 3 a 5 dias.',
    instructions: 'Ingerir sem mastigar com um copo cheio de água.'
  },
  {
    id: 'cetoprofeno-ampola-100',
    name: 'Cetoprofeno 100mg Pó Injetável IV/IM',
    genericName: 'Cetoprofeno',
    brandName: 'Profenid Injetável',
    class: 'Anti-inflamatório Parenteral',
    type: 'simples',
    defaultRoute: 'Uso intravenoso',
    defaultPresentation: '100mg - Frasco-ampola + diluente',
    availablePresentations: [
      '100mg - Frasco-ampola EV',
      '100mg/2mL - Ampola IM profunda'
    ],
    defaultPosology: 'Diluir em 100mL de SF 0,9% ou SG 5% e infundir por via EV em 20 minutos de 12/12h por até 48 horas.',
    instructions: 'Infusão intravenosa lenta.'
  },
  {
    id: 'cetorolaco-10-sl',
    name: 'Cetorolaco de Trometamol 10mg Sublingual',
    genericName: 'Cetorolaco de Trometamol',
    brandName: 'Toragesic / Deocil',
    class: 'AINE Potente de Ação Rápida',
    type: 'simples',
    defaultRoute: 'Uso sublingual',
    defaultPresentation: '10mg - Comprimidos sublinguais (caixa com 10 ou 20)',
    availablePresentations: [
      '10mg - Comprimidos sublinguais (caixa com 10)',
      '10mg - Comprimidos sublinguais (caixa com 20)',
      '30mg/mL - Ampola injetável 1mL'
    ],
    defaultPosology: 'Dissolver 1 comprimido sob a língua a cada 6 ou 8 horas se dor aguda intensa. Tempo máx. de uso: 5 dias.',
    instructions: 'Não mastigar nem engolir inteiro. Deixar dissolver sob a língua. Uso restrito a 5 dias.'
  },
  {
    id: 'cetorolaco-ampola-30',
    name: 'Cetorolaco de Trometamol 30mg/mL Solução Injetável',
    genericName: 'Cetorolaco de Trometamol',
    brandName: 'Toragesic Ampola',
    class: 'AINE Parenteral de Alta Potência Analgésica',
    type: 'simples',
    defaultRoute: 'Uso intravenoso',
    defaultPresentation: '30mg/mL - Ampola 1mL',
    availablePresentations: ['30mg/mL - Ampola 1mL EV/IM'],
    defaultPosology: 'Administrar 1 ampola (30mg) diluída em 50mL a 100mL de SF 0,9% EV em 15 minutos de 8/8h (máx. 90mg/dia).',
    instructions: 'Excelente para cólica renal aguda e pós-operatório. Não exceder 2 dias de uso parenteral.'
  },
  {
    id: 'nimesulida-100-cp',
    name: 'Nimesulida 100mg',
    genericName: 'Nimesulida',
    brandName: 'Nisulid / Scaflam',
    class: 'Anti-inflamatório Inibidor Preferencial COX-2',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '100mg - Comprimidos (caixa com 12)',
    availablePresentations: [
      '100mg - Comprimidos (caixa com 12)',
      '100mg - Comprimidos dispersíveis (caixa com 12)',
      '50mg/mL - Gotas (frasco com 15mL)'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral a cada 12 horas, após as refeições, por no máximo 5 dias.',
    instructions: 'Não exceder 5 a 7 dias de tratamento devido a risco de toxicidade hepática. Contraindicado em hepatopatas e menores de 12 anos.'
  },
  {
    id: 'diclofenaco-potassico-50',
    name: 'Diclofenaco Potássico 50mg',
    genericName: 'Diclofenaco Potássico',
    brandName: 'Cataflam 50mg',
    class: 'Anti-inflamatório Não Esteroidal de Rápida Ação',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '50mg - Drágeas (caixa com 20)',
    availablePresentations: [
      '50mg - Drágeas (caixa com 20)',
      '15mg/mL - Suspensão gotas oral 20mL'
    ],
    defaultPosology: 'Tomar 1 drágea por via oral a cada 8 horas, após as refeições, por até 5 dias.',
    instructions: 'Ingerir com bastante líquido após alimentar-se.'
  },
  {
    id: 'diclofenaco-sodico-50',
    name: 'Diclofenaco Sódico 50mg',
    genericName: 'Diclofenaco Sódico',
    brandName: 'Voltaren 50mg',
    class: 'Anti-inflamatório Não Esteroidal (AINE)',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '50mg - Comprimidos revestidos gastrorresistentes (caixa com 20)',
    availablePresentations: [
      '50mg - Comprimidos (caixa com 20)',
      '100mg - Comprimidos de liberação prolongada Retard (caixa com 10)',
      '75mg/3mL - Ampola injetável IM profunda'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral a cada 8 horas após as refeições por 3 a 5 dias.',
    instructions: 'Ingerir inteiro sem mastigar. Cautela em hipertensos e cardiopatas.'
  },
  {
    id: 'diclofenaco-ampola-75',
    name: 'Diclofenaco Sódico 75mg/3mL Injetável',
    genericName: 'Diclofenaco Sódico',
    brandName: 'Voltaren Injetável',
    class: 'Anti-inflamatório Injetável IM',
    type: 'simples',
    defaultRoute: 'Uso intramuscular',
    defaultPresentation: '75mg/3mL - Ampola',
    availablePresentations: ['75mg/3mL - Ampola IM'],
    defaultPosology: 'Aplicar 1 ampola (75mg) por via intramuscular profunda no glúteo, 1 vez ao dia (máx. 2 ampolas com intervalo de 12h por até 2 dias).',
    instructions: 'Exclusivamente por via intramuscular profunda no quadrante superior externo do glúteo.'
  },
  {
    id: 'meloxicam-15-cp',
    name: 'Meloxicam 15mg',
    genericName: 'Meloxicam',
    brandName: 'Movatec 15mg',
    class: 'Anti-inflamatório Não Esteroidal Oxicam',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '15mg - Comprimidos (caixa com 10)',
    availablePresentations: [
      '15mg - Comprimidos (caixa com 10)',
      '7,5mg - Comprimidos (caixa com 10)',
      '15mg/1,5mL - Ampola IM'
    ],
    defaultPosology: 'Tomar 1 comprimido de 15mg por via oral 1 vez ao dia, após almoço ou jantar, por 5 a 7 dias.',
    instructions: 'Comodidade posológica de tomada única diária.'
  },
  {
    id: 'tenoxicam-20-cp',
    name: 'Tenoxicam 20mg',
    genericName: 'Tenoxicam',
    brandName: 'Tilatil 20mg',
    class: 'Anti-inflamatório e Antirreumático',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '20mg - Comprimidos revestidos (caixa com 10)',
    availablePresentations: [
      '20mg - Comprimidos (caixa com 10)',
      '20mg - Frasco-ampola pó injetável IV/IM'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral 1 vez ao dia, no mesmo horário, após uma refeição, por 5 dias.',
    instructions: 'Tomar com água após o almoço.'
  },
  {
    id: 'piroxicam-20-cp',
    name: 'Piroxicam 20mg',
    genericName: 'Piroxicam',
    brandName: 'Feldene 20mg',
    class: 'Anti-inflamatório Não Esteroidal',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '20mg - Cápsulas duras (caixa com 15)',
    availablePresentations: [
      '20mg - Cápsulas (caixa com 15)',
      '20mg - Comprimidos solúveis (caixa com 10)'
    ],
    defaultPosology: 'Tomar 1 cápsula por via oral uma vez ao dia, após refeição, por 5 a 7 dias.',
    instructions: 'Ingerir com bastante água.'
  },
  {
    id: 'celecoxibe-200-cp',
    name: 'Celecoxibe 200mg',
    genericName: 'Celecoxibe',
    brandName: 'Celebra 200mg',
    class: 'AINE Inibidor Seletivo de COX-2',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '200mg - Cápsulas (caixa com 10 ou 30)',
    availablePresentations: [
      '200mg - Cápsulas (caixa com 10)',
      '200mg - Cápsulas (caixa com 30)'
    ],
    defaultPosology: 'Tomar 1 cápsula por via oral 1 vez ao dia (ou 1 cápsula de 12/12h se dor aguda), por 5 a 10 dias.',
    instructions: 'Menor risco de lesão gástrica quando comparado aos AINEs não seletivos. Monitorar pressão arterial.'
  },
  {
    id: 'etoricoxibe-90-cp',
    name: 'Etoricoxibe 90mg',
    genericName: 'Etoricoxibe',
    brandName: 'Arcoxia 90mg',
    class: 'AINE Inibidor Altamente Seletivo COX-2',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '90mg - Comprimidos revestidos (caixa com 7 ou 14)',
    availablePresentations: [
      '60mg - Comprimidos (caixa com 14)',
      '90mg - Comprimidos (caixa com 7)',
      '120mg - Comprimidos (caixa com 7)'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral 1 vez ao dia, independentemente das refeições, por até 7 dias.',
    instructions: 'Contraindicado em hipertensão arterial não controlada (> 140/90 mmHg).'
  },
  {
    id: 'naproxeno-500-cp',
    name: 'Naproxeno 500mg',
    genericName: 'Naproxeno',
    brandName: 'Flanax 550mg / Naprosyn',
    class: 'Anti-inflamatório de Perfil Cardiovascular Mais Seguro',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '500mg - Comprimidos (caixa com 15 ou 20)',
    availablePresentations: [
      '250mg - Comprimidos (caixa com 15)',
      '500mg - Comprimidos (caixa com 20)',
      '550mg (sódico) - Comprimidos (caixa com 10)'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral a cada 12 horas, após as refeições, por 5 a 7 dias.',
    instructions: 'Considerado o AINE com menor risco cardiovascular relativo entre os convencionais.'
  },
  {
    id: 'colquicina-05-cp',
    name: 'Colquicina 0,5mg',
    genericName: 'Colquicina',
    brandName: 'Colchis 0,5mg',
    class: 'Antigotoso Específico',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '0,5mg - Comprimidos (caixa com 20 ou 30)',
    availablePresentations: ['0,5mg - Comprimidos (caixa com 20 ou 30)'],
    defaultPosology: 'Crise de gota aguda: 1mg (2 cp) imediatamente, seguido de 0,5mg (1 cp) 1 hora depois; após, 0,5mg de 12/12h até remissão.',
    instructions: 'Suspender ou reduzir a dose se surgirem náuseas, diarreia ou dor abdominal.'
  },
  {
    id: 'alopurinol-300-cp',
    name: 'Alopurinol 300mg',
    genericName: 'Alopurinol',
    brandName: 'Zyloric 300mg',
    class: 'Inibidor da Xantina Oxidase / Hipouricemiante',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '300mg - Comprimidos (caixa com 30)',
    availablePresentations: [
      '100mg - Comprimidos (caixa com 30)',
      '300mg - Comprimidos (caixa com 30)'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral 1 vez ao dia após o almoço, de uso contínuo (prevenção de crises de gota e cálculos de ácido úrico).',
    instructions: 'Não iniciar durante o pico agudo de uma crise de gota. Beber bastante líquido (2 a 3 litros/dia).'
  },
  {
    id: 'ciclobenzaprina-5',
    name: 'Cloridrato de Ciclobenzaprina 5mg',
    genericName: 'Cloridrato de Ciclobenzaprina',
    brandName: 'Miosan / Musculare',
    class: 'Miorrelaxante de Ação Central',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '5mg - Comprimidos (caixa com 15 ou 30)',
    availablePresentations: [
      '5mg - Comprimidos (caixa com 30)',
      '10mg - Comprimidos (caixa com 30)'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral à noite ao deitar (ou de 12/12h se espasmo severo) por 5 a 7 dias.',
    instructions: 'Pode provocar sonolência e boca seca. Evitar dirigir veículos ou operar máquinas durante o uso.'
  },
  {
    id: 'ciclobenzaprina-10',
    name: 'Cloridrato de Ciclobenzaprina 10mg',
    genericName: 'Cloridrato de Ciclobenzaprina',
    brandName: 'Miosan 10mg',
    class: 'Miorrelaxante de Ação Central',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '10mg - Comprimidos (caixa com 15 ou 30)',
    availablePresentations: ['10mg - Comprimidos (caixa com 30)'],
    defaultPosology: 'Tomar 1 comprimido por via oral à noite ao deitar por até 7 dias.',
    instructions: 'Ação sedativa intensa; preferir uso antes de dormir.'
  },
  {
    id: 'torsilax-composto',
    name: 'Paracetamol + Diclofenaco + Carisoprodol + Cafeína',
    genericName: 'Paracetamol + Diclofenaco + Carisoprodol + Cafeína',
    brandName: 'Torsilax / Tandrilax',
    class: 'Anti-inflamatório e Relaxante Muscular Combinado',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: 'Comprimidos (caixa com 15 ou 30)',
    availablePresentations: ['Comprimidos (caixa com 15 ou 30)'],
    defaultPosology: 'Tomar 1 comprimido por via oral a cada 12 horas (ou no máx. de 8/8h), após refeições, por 3 a 5 dias.',
    instructions: 'Não ultrapassar 5 a 7 dias devido ao carisoprodol (risco de dependência e sonolência).'
  },
  {
    id: 'dorflex-composto',
    name: 'Dipirona + Citrato de Orfenadrina + Cafeína Anidra',
    genericName: 'Dipirona + Citrato de Orfenadrina + Cafeína',
    brandName: 'Dorflex',
    class: 'Analgésico e Relaxante Muscular',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: 'Comprimidos (blister com 10, 24 ou 36)',
    availablePresentations: [
      'Comprimidos (blister com 24 ou 36)',
      'Gotas frasco com 20mL'
    ],
    defaultPosology: 'Tomar 1 a 2 comprimidos por via oral a cada 6 ou 8 horas se dor muscular e cefaleia tensional.',
    instructions: 'Não mastigar. Não exceder 6 comprimidos ao dia.'
  },
  {
    id: 'alginac-1000',
    name: 'Diclofenaco Sódico + Vitaminas B1, B6, B12',
    genericName: 'Diclofenaco + Tiamina + Piridoxina + Cianocobalamina',
    brandName: 'Alginac 1.000',
    class: 'Anti-inflamatório e Antineurítico',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: 'Comprimidos revestidos (caixa com 15 ou 30)',
    availablePresentations: [
      'Comprimidos (caixa com 15 ou 30)',
      'Ampola injetável IM profunda (caixa com 3 ampolas I + 3 ampolas II)'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral 2 a 3 vezes ao dia, após as refeições, por 5 a 7 dias.',
    instructions: 'Especialmente indicado para lombalgias, lombociatalgias e nevralgias.'
  },
  {
    id: 'tizanidina-2-cp',
    name: 'Cloridrato de Tizanidina 2mg',
    genericName: 'Cloridrato de Tizanidina',
    brandName: 'Sirdalud 2mg',
    class: 'Miorrelaxante Agonista Alfa-2 Adrenérgico Central',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '2mg - Comprimidos (caixa com 30)',
    availablePresentations: [
      '2mg - Comprimidos (caixa com 30)',
      '4mg - Comprimidos (caixa com 30)'
    ],
    defaultPosology: 'Tomar 1 comprimido (2mg) por via oral 3 vezes ao dia se espasmos musculares dolorosos.',
    instructions: 'Pode provocar hipotensão e sedação leve.'
  },
  {
    id: 'baclofeno-10-cp',
    name: 'Baclofeno 10mg',
    genericName: 'Baclofeno',
    brandName: 'Lioresal 10mg',
    class: 'Antiespástico Agonista GABAB',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '10mg - Comprimidos (caixa com 20 ou 60)',
    availablePresentations: ['10mg - Comprimidos (caixa com 60)'],
    defaultPosology: 'Iniciar com 1/2 comprimido (5mg) 3 vezes ao dia, aumentando gradualmente conforme tolerância clínica.',
    instructions: 'Nunca suspender de forma abrupta para evitar síndrome de abstinência.'
  }
];
