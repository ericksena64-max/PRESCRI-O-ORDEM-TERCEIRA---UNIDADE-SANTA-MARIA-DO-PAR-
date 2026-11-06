import { Medication } from '../../types';

export const ANTIMICROBIALS_MEDICATIONS: Medication[] = [
  // ==========================================
  // PENICILINAS E BETA-LACTÂMICOS
  // ==========================================
  {
    id: 'amoxicilina-500-cp',
    name: 'Amoxicilina 500mg',
    genericName: 'Amoxicilina',
    brandName: 'Amoxil 500mg',
    class: 'Antibiótico / Aminopenicilina',
    type: 'antimicrobiano',
    defaultRoute: 'Uso oral',
    defaultPresentation: '500mg - Cápsulas (caixa com 21)',
    availablePresentations: [
      '500mg - Cápsulas (caixa com 21)',
      '875mg - Comprimidos (caixa com 14)',
      '250mg/5mL - Pó suspensão oral (frasco 150mL)',
      '400mg/5mL - Pó suspensão oral (frasco 100mL)'
    ],
    defaultPosology: 'Tomar 1 cápsula por via oral a cada 8 horas durante 7 a 10 dias.',
    instructions: 'Receita de controle especial em 2 vias. Não interromper o tratamento mesmo com melhora dos sintomas.'
  },
  {
    id: 'amoxicilina-875-cp',
    name: 'Amoxicilina 875mg',
    genericName: 'Amoxicilina',
    brandName: 'Amoxil 875mg',
    class: 'Antibiótico Aminopenicilina Posologia 12/12h',
    type: 'antimicrobiano',
    defaultRoute: 'Uso oral',
    defaultPresentation: '875mg - Comprimidos (caixa com 14 ou 20)',
    availablePresentations: ['875mg - Comprimidos (caixa com 14)'],
    defaultPosology: 'Tomar 1 comprimido por via oral a cada 12 horas durante 7 a 10 dias.',
    instructions: 'Receita retida de controle especial (RDC 20/2011). Ingerir com água antes ou após refeições.'
  },
  {
    id: 'amoxicilina-susp-250',
    name: 'Amoxicilina Suspensão 250mg/5mL Pediátrica',
    genericName: 'Amoxicilina',
    brandName: 'Amoxil Suspensão Pediátrica',
    class: 'Antibiótico Pediátrico',
    type: 'antimicrobiano',
    defaultRoute: 'Uso oral',
    defaultPresentation: '250mg/5mL - Frasco com pó para 150mL',
    availablePresentations: [
      '250mg/5mL - Frasco 150mL',
      '400mg/5mL - Frasco 100mL'
    ],
    defaultPosology: 'Dose calculada: 50mg/kg/dia dividida a cada 8 horas por 7 a 10 dias. Agitar bem antes de usar.',
    instructions: 'Reconstituir com água filtrada até a marca. Após reconstituição, conservar em geladeira ou temp. ambiente por até 14 dias.'
  },
  {
    id: 'amoxicilina-clavulanato-875',
    name: 'Amoxicilina + Clavulanato de Potássio (875mg + 125mg)',
    genericName: 'Amoxicilina + Clavulanato de Potássio',
    brandName: 'Clavulin BD / Novamox',
    class: 'Antibiótico / Aminopenicilina + Inibidor de Beta-lactamase',
    type: 'antimicrobiano',
    defaultRoute: 'Uso oral',
    defaultPresentation: '875mg + 125mg - Comprimidos revestidos (caixa com 14 ou 20)',
    availablePresentations: [
      '875mg + 125mg - Comprimidos (caixa com 14)',
      '500mg + 125mg - Comprimidos (caixa com 21)',
      '400mg + 57mg/5mL - Suspensão oral (frasco 70mL)'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral a cada 12 horas, no início de uma refeição, durante 7 a 10 dias.',
    instructions: 'Tomar logo antes das refeições para otimizar absorção do clavulanato e diminuir intolerância gastrointestinal.'
  },
  {
    id: 'amoxicilina-clavulanato-500',
    name: 'Amoxicilina + Clavulanato de Potássio (500mg + 125mg)',
    genericName: 'Amoxicilina + Clavulanato de Potássio',
    brandName: 'Clavulin 500mg',
    class: 'Antibiótico Beta-lactâmico com Inibidor de Beta-lactamase',
    type: 'antimicrobiano',
    defaultRoute: 'Uso oral',
    defaultPresentation: '500mg + 125mg - Comprimidos (caixa com 21)',
    availablePresentations: ['500mg + 125mg - Comprimidos (caixa com 21)'],
    defaultPosology: 'Tomar 1 comprimido por via oral a cada 8 horas, às refeições, por 7 a 10 dias.',
    instructions: 'Receita retida de controle especial (RDC 20/2011).'
  },
  {
    id: 'amoxicilina-clavulanato-susp-400',
    name: 'Amoxicilina + Clavulanato Suspensão 400mg + 57mg/5mL',
    genericName: 'Amoxicilina + Clavulanato de Potássio',
    brandName: 'Clavulin BD Pediátrico',
    class: 'Antibiótico Pediátrico 12/12h',
    type: 'antimicrobiano',
    defaultRoute: 'Uso oral',
    defaultPresentation: '400mg + 57mg/5mL - Frasco com pó para 70mL',
    availablePresentations: [
      '400mg + 57mg/5mL - Frasco 70mL',
      '250mg + 62,5mg/5mL - Frasco 75mL'
    ],
    defaultPosology: 'Dose: 45 a 90 mg/kg/dia base amoxicilina dividida em 2 tomadas (de 12 em 12 horas) por 7 a 10 dias.',
    instructions: 'Reconstituir com água. Manter sob refrigeração (2 a 8°C) após reconstituição. Agitar antes de usar.'
  },
  {
    id: 'ampicilina-500-cp',
    name: 'Ampicilina 500mg',
    genericName: 'Ampicilina',
    brandName: 'Binotal 500mg',
    class: 'Aminopenicilina',
    type: 'antimicrobiano',
    defaultRoute: 'Uso oral',
    defaultPresentation: '500mg - Comprimidos (caixa com 24)',
    availablePresentations: [
      '500mg - Comprimidos (caixa com 24)',
      '1g - Frasco-ampola injetável EV/IM'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral a cada 6 horas, 1 hora antes ou 2 horas após refeições, por 7 a 10 dias.',
    instructions: 'A absorção é prejudicada por alimentos; ingerir com estômago vazio e bastante água.'
  },
  {
    id: 'benzetacil-1200',
    name: 'Benzilpenicilina Benzatina 1.200.000 UI Injetável',
    genericName: 'Benzilpenicilina Benzatina',
    brandName: 'Benzetacil 1.200.000 UI',
    class: 'Penicilina Natural de Depósito IM',
    type: 'antimicrobiano',
    defaultRoute: 'Uso intramuscular',
    defaultPresentation: '1.200.000 UI - Frasco-ampola com suspensão injetável',
    availablePresentations: [
      '1.200.000 UI - Ampola IM',
      '600.000 UI - Ampola IM Pediátrica'
    ],
    defaultPosology: 'Faringoamigdalite estreptocócica: 1 ampola (1.200.000 UI) IM dose única profunda. Sífilis primária: 2.400.000 UI IM dose única (1 ampola em cada glúteo).',
    instructions: 'EXCLUSIVAMENTE INTRAMUSCULAR PROFUNDA no glúteo (ventro-glúteo ou quadrante superior externo). Nunca administrar por via intravenosa.'
  },
  {
    id: 'benzetacil-600',
    name: 'Benzilpenicilina Benzatina 600.000 UI Injetável Pediátrica',
    genericName: 'Benzilpenicilina Benzatina',
    brandName: 'Benzetacil 600.000 UI',
    class: 'Penicilina de Depósito Pediátrica',
    type: 'antimicrobiano',
    defaultRoute: 'Uso intramuscular',
    defaultPresentation: '600.000 UI - Frasco-ampola com suspensão injetável',
    availablePresentations: ['600.000 UI - Ampola IM'],
    defaultPosology: 'Crianças < 27 kg: 600.000 UI em dose única por via intramuscular profunda.',
    instructions: 'Exclusivamente IM profunda. Verificar antecedentes alérgicos a penicilinas.'
  },
  {
    id: 'penicilina-v-potassica',
    name: 'Fenoximetilpenicilina Potássica 500.000 UI (Penicilina V)',
    genericName: 'Fenoximetilpenicilina Potássica',
    brandName: 'Pen-Ve-Oral',
    class: 'Penicilina Natural Oral',
    type: 'antimicrobiano',
    defaultRoute: 'Uso oral',
    defaultPresentation: '500.000 UI - Comprimidos (caixa com 20)',
    availablePresentations: ['500.000 UI - Comprimidos (caixa com 20)'],
    defaultPosology: 'Tomar 1 comprimido por via oral a cada 6 horas, em jejum, por 10 dias (tratamento de faringite estreptocócica).',
    instructions: 'Tomar 1 hora antes ou 2 horas após as refeições.'
  },
  {
    id: 'oxacilina-ampola-500',
    name: 'Oxacilina Sódica 500mg Pó Injetável',
    genericName: 'Oxacilina Sódica',
    brandName: 'Oxacilina Hospitalar',
    class: 'Penicilina Penicilinase-resistente Anti-estafilocócica',
    type: 'antimicrobiano',
    defaultRoute: 'Uso intravenoso',
    defaultPresentation: '500mg - Frasco-ampola pó injetável',
    availablePresentations: ['500mg - Frasco-ampola EV'],
    defaultPosology: 'Adultos: 1g a 2g EV a cada 4 horas em infusão lenta de 30 a 60 minutos (para infecções estafilocócicas MSSA).',
    instructions: 'Uso restrito hospitalar/ambulatorial com prescrição médica.'
  },
  {
    id: 'piperacilina-tazobactam-45',
    name: 'Piperacilina Sódica + Tazobactam Sódico 4,5g Pó Injetável',
    genericName: 'Piperacilina + Tazobactam',
    brandName: 'Tazocin 4,5g',
    class: 'Penicilina Antipseudomonas de Amplo Espectro',
    type: 'antimicrobiano',
    defaultRoute: 'Uso intravenoso',
    defaultPresentation: '4,5g - Frasco-ampola pó para solução injetável',
    availablePresentations: ['4,5g - Frasco-ampola EV'],
    defaultPosology: 'Administrar 4,5g diluído em 100mL de SF 0,9% EV em infusão estendida de 3 a 4 horas a cada 6 ou 8 horas.',
    instructions: 'Ajustar para função renal. Indicado para sepse intra-abdominal e pneumonias nosocomiais.'
  },

  // ==========================================
  // CEFALOSPORINAS
  // ==========================================
  {
    id: 'cefalexina-500-cp',
    name: 'Cefalexina 500mg',
    genericName: 'Cefalexina Monoidratada',
    brandName: 'Keflex 500mg',
    class: 'Cefalosporina de 1ª Geração',
    type: 'antimicrobiano',
    defaultRoute: 'Uso oral',
    defaultPresentation: '500mg - Drágeas (caixa com 28)',
    availablePresentations: [
      '500mg - Drágeas (caixa com 28)',
      '500mg - Drágeas (caixa com 40)',
      '250mg/5mL - Suspensão oral (frasco 100mL)'
    ],
    defaultPosology: 'Tomar 1 drágea por via oral a cada 6 horas durante 7 a 10 dias.',
    instructions: 'Indicado para infecções de pele (celulite, erisipela, furúnculos) e trato urinário. Não falhar horários.'
  },
  {
    id: 'cefalexina-susp-250',
    name: 'Cefalexina Suspensão Oral 250mg/5mL',
    genericName: 'Cefalexina Monoidratada',
    brandName: 'Keflex Suspensão Pediátrica',
    class: 'Cefalosporina Pediátrica de 1ª Geração',
    type: 'antimicrobiano',
    defaultRoute: 'Uso oral',
    defaultPresentation: '250mg/5mL - Frasco para 100mL',
    availablePresentations: ['250mg/5mL - Frasco 100mL'],
    defaultPosology: 'Dose: 25 a 50 mg/kg/dia dividida a cada 6 horas por 7 a 10 dias. Agitar antes de usar.',
    instructions: 'Conservar após reconstituição conforme rótulo.'
  },
  {
    id: 'cefadroxila-500-cap',
    name: 'Cefadroxila 500mg',
    genericName: 'Cefadroxila',
    brandName: 'Cefamox 500mg',
    class: 'Cefalosporina de 1ª Geração Posologia 12/12h',
    type: 'antimicrobiano',
    defaultRoute: 'Uso oral',
    defaultPresentation: '500mg - Cápsulas (caixa com 14)',
    availablePresentations: [
      '500mg - Cápsulas (caixa com 14)',
      '250mg/5mL - Suspensão oral frasco 100mL'
    ],
    defaultPosology: 'Tomar 1 cápsula por via oral a cada 12 horas por 7 a 10 dias.',
    instructions: 'Vantagem posológica de tomada a cada 12 horas.'
  },
  {
    id: 'cefuroxima-500-cp',
    name: 'Axetilcefuroxima 500mg (Cefuroxima)',
    genericName: 'Axetilcefuroxima',
    brandName: 'Zinnat 500mg',
    class: 'Cefalosporina de 2ª Geração Oral',
    type: 'antimicrobiano',
    defaultRoute: 'Uso oral',
    defaultPresentation: '500mg - Comprimidos revestidos (caixa com 10 ou 14)',
    availablePresentations: [
      '250mg - Comprimidos (caixa com 10)',
      '500mg - Comprimidos (caixa com 14)',
      '250mg/5mL - Suspensão oral 70mL'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral a cada 12 horas, logo após uma refeição, por 7 a 10 dias.',
    instructions: 'Ingerir com alimentos para absorção máxima.'
  },
  {
    id: 'ceftriaxona-1g-iv',
    name: 'Ceftriaxona Dissódica 1g IV Solução Injetável',
    genericName: 'Ceftriaxona Dissódica',
    brandName: 'Rocefin IV 1g',
    class: 'Cefalosporina de 3ª Geração Parenteral',
    type: 'antimicrobiano',
    defaultRoute: 'Uso intravenoso',
    defaultPresentation: '1g - Frasco-ampola com diluente estéril 10mL',
    availablePresentations: [
      '1g - Frasco-ampola EV',
      '1g - Frasco-ampola IM com lidocaína'
    ],
    defaultPosology: 'Adultos: 1g a 2g IV em dose única diária (diluída em 100mL de SF 0,9% em 30 min) por 7 a 14 dias.',
    instructions: 'Uso parenteral hospitalar ou ambulatorial.'
  },
  {
    id: 'ceftriaxona-1g-im',
    name: 'Ceftriaxona Dissódica 1g IM + Diluente com Lidocaína',
    genericName: 'Ceftriaxona Dissódica',
    brandName: 'Rocefin IM 1g',
    class: 'Cefalosporina de 3ª Geração IM',
    type: 'antimicrobiano',
    defaultRoute: 'Uso intramuscular',
    defaultPresentation: '1g - Frasco-ampola + ampola de lidocaína 1% 3,5mL',
    availablePresentations: [
      '1g - Frasco-ampola IM com diluente de lidocaína',
      '500mg - Frasco-ampola IM com diluente de lidocaína'
    ],
    defaultPosology: 'Uretrite / Cervicite por gonococo: 500mg a 1g IM dose única profunda. Outras infecções: 1g a 2g IM 1x ao dia.',
    instructions: 'EXCLUSIVAMENTE INTRAMUSCULAR PROFUNDA devido ao diluente de lidocaína. Nunca fazer EV com diluente de lidocaína.'
  },
  {
    id: 'cefepima-1g-inj',
    name: 'Cloridrato de Cefepima 1g Pó Injetável',
    genericName: 'Cloridrato de Cefepima',
    brandName: 'Maxcef 1g',
    class: 'Cefalosporina de 4ª Geração Antipseudomonas',
    type: 'antimicrobiano',
    defaultRoute: 'Uso intravenoso',
    defaultPresentation: '1g - Frasco-ampola pó injetável EV/IM',
    availablePresentations: [
      '1g - Frasco-ampola',
      '2g - Frasco-ampola'
    ],
    defaultPosology: 'Adultos: 1g a 2g IV a cada 8 ou 12 horas diluído em 100mL de SF 0,9% correr em 30 minutos.',
    instructions: 'Ajustar rigidamente de acordo com clearance de creatinina.'
  },

  // ==========================================
  // MACROLÍDEOS
  // ==========================================
  {
    id: 'azitromicina-500-cp',
    name: 'Azitromicina Di-hidratada 500mg',
    genericName: 'Azitromicina Di-hidratada',
    brandName: 'Astro / Zitromax',
    class: 'Antibiótico / Azalídeo / Macrolídeo',
    type: 'antimicrobiano',
    defaultRoute: 'Uso oral',
    defaultPresentation: '500mg - Comprimidos revestidos (caixa com 3 ou 5)',
    availablePresentations: [
      '500mg - Comprimidos (caixa com 3)',
      '500mg - Comprimidos (caixa com 5)',
      '600mg - Pó para suspensão oral (frasco 15mL)',
      '900mg - Pó para suspensão oral (frasco 22,5mL)'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral uma vez ao dia, 1 hora antes ou 2 horas após as refeições, por 3 a 5 dias.',
    instructions: 'Tratamento curto de 3 a 5 dias devido à longa meia-vida tecidual. Não associar com antiácidos contendo alumínio ou magnésio no mesmo momento.'
  },
  {
    id: 'azitromicina-susp-600',
    name: 'Azitromicina Suspensão Oral 200mg/5mL (600mg)',
    genericName: 'Azitromicina Di-hidratada',
    brandName: 'Astro Pediátrico 600mg',
    class: 'Macrolídeo Pediátrico Dose Única Diária',
    type: 'antimicrobiano',
    defaultRoute: 'Uso oral',
    defaultPresentation: '200mg/5mL (40mg/mL) - Frasco 15mL com seringa dosadora',
    availablePresentations: [
      '600mg - Frasco 15mL',
      '900mg - Frasco 22,5mL'
    ],
    defaultPosology: 'Dose: 10mg/kg/dia por via oral em tomada única diária durante 3 a 5 dias.',
    instructions: 'Agitar bem antes de cada administração.'
  },
  {
    id: 'claritromicina-500-cp',
    name: 'Claritromicina 500mg',
    genericName: 'Claritromicina',
    brandName: 'Klaricid 500mg',
    class: 'Antibiótico Macrolídeo',
    type: 'antimicrobiano',
    defaultRoute: 'Uso oral',
    defaultPresentation: '500mg - Comprimidos revestidos (caixa com 14 ou 21)',
    availablePresentations: [
      '500mg - Comprimidos (caixa com 14)',
      '500mg UD - Liberação prolongada (caixa com 10)',
      '125mg/5mL - Suspensão oral frasco 60mL',
      '250mg/5mL - Suspensão oral frasco 60mL'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral a cada 12 horas por 7 a 14 dias.',
    instructions: 'Ingerir com ou sem alimentos. Atenção a interações via CYP3A4.'
  },

  // ==========================================
  // FLUOROQUINOLONAS
  // ==========================================
  {
    id: 'ciprofloxacino-500-cp',
    name: 'Cloridrato de Ciprofloxacino 500mg',
    genericName: 'Cloridrato de Ciprofloxacino',
    brandName: 'Cipro 500mg / Quinoflox',
    class: 'Antibiótico / Fluoroquinolona',
    type: 'antimicrobiano',
    defaultRoute: 'Uso oral',
    defaultPresentation: '500mg - Comprimidos revestidos (caixa com 14)',
    availablePresentations: [
      '500mg - Comprimidos (caixa com 14)',
      '200mg/100mL - Solução injetável para infusão EV'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral a cada 12 horas durante 7 a 14 dias.',
    instructions: 'Beber bastante água. Não ingerir junto com laticínios ou suplementos de cálcio/ferro (espaçar por 2 horas). Cautela com tendinopatias.'
  },
  {
    id: 'levofloxacino-500-cp',
    name: 'Levofloxacino Hemidratado 500mg',
    genericName: 'Levofloxacino Hemidratado',
    brandName: 'Levaquin / Tamiram 500mg',
    class: 'Fluoroquinolona Respiratória',
    type: 'antimicrobiano',
    defaultRoute: 'Uso oral',
    defaultPresentation: '500mg - Comprimidos revestidos (caixa com 7 ou 10)',
    availablePresentations: [
      '500mg - Comprimidos (caixa com 7)',
      '750mg - Comprimidos (caixa com 7)',
      '500mg/100mL - Bolsa injetável para infusão EV'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral 1 vez ao dia (no mesmo horário) durante 7 a 10 dias.',
    instructions: 'Tomar com água. Evitar exposição solar intensa. Monitorar dor em tendões.'
  },
  {
    id: 'moxifloxacino-400-cp',
    name: 'Cloridrato de Moxifloxacino 400mg',
    genericName: 'Cloridrato de Moxifloxacino',
    brandName: 'Avalox 400mg',
    class: 'Fluoroquinolona Respiratória de 4ª Geração',
    type: 'antimicrobiano',
    defaultRoute: 'Uso oral',
    defaultPresentation: '400mg - Comprimidos revestidos (caixa com 7)',
    availablePresentations: ['400mg - Comprimidos (caixa com 7)'],
    defaultPosology: 'Tomar 1 comprimido por via oral 1 vez ao dia durante 7 a 10 dias.',
    instructions: 'Não necessita de ajuste de dose em disfunção renal.'
  },
  {
    id: 'norfloxacino-400-cp',
    name: 'Norfloxacino 400mg',
    genericName: 'Norfloxacino',
    brandName: 'Floxacin 400mg',
    class: 'Fluoroquinolona Urinária',
    type: 'antimicrobiano',
    defaultRoute: 'Uso oral',
    defaultPresentation: '400mg - Comprimidos revestidos (caixa com 14)',
    availablePresentations: ['400mg - Comprimidos (caixa com 14)'],
    defaultPosology: 'Tomar 1 comprimido por via oral a cada 12 horas em jejum por 3 a 7 dias (infecções urinárias).',
    instructions: 'Tomar com um copo cheio de água em jejum.'
  },

  // ==========================================
  // OUTROS ANTIBIÓTICOS ORAIS E TÓPICOS
  // ==========================================
  {
    id: 'sulfametoxazol-trimetoprima-800',
    name: 'Sulfametoxazol + Trimetoprima (800mg + 160mg)',
    genericName: 'Sulfametoxazol + Trimetoprima',
    brandName: 'Bactrim F / Infectrin F',
    class: 'Antimicrobiano Sulfonamida Combinada',
    type: 'antimicrobiano',
    defaultRoute: 'Uso oral',
    defaultPresentation: '800mg + 160mg - Comprimidos (caixa com 10 ou 20)',
    availablePresentations: [
      '800mg + 160mg - Comprimidos (caixa com 10)',
      '400mg + 80mg - Comprimidos (caixa com 20)',
      '200mg + 40mg/5mL - Suspensão oral pediátrica frasco 100mL'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral a cada 12 horas, após as refeições, por 7 a 14 dias.',
    instructions: 'Beber bastante água para prevenir cristalúria. Contraindicado em gestantes a termo e portadores de deficiência de G6PD.'
  },
  {
    id: 'nitrofurantoina-100-cap',
    name: 'Nitrofurantoína 100mg Macrocristais',
    genericName: 'Nitrofurantoína',
    brandName: 'Macrodantina 100mg',
    class: 'Antisséptico e Antibacteriano Urinário',
    type: 'antimicrobiano',
    defaultRoute: 'Uso oral',
    defaultPresentation: '100mg - Cápsulas duras (caixa com 28)',
    availablePresentations: ['100mg - Cápsulas (caixa com 28)'],
    defaultPosology: 'Cistite aguda: tomar 1 cápsula por via oral a cada 6 horas, com as refeições, durante 7 dias.',
    instructions: 'Tomar sempre acompanhado de refeições ou leite para evitar náuseas e maximizar absorção. Pode colorir a urina de castanho-amarelado.'
  },
  {
    id: 'fosfomicina-3g-sache',
    name: 'Fosfomicina Trometamol 3g Granulado Oral',
    genericName: 'Fosfomicina Trometamol',
    brandName: 'Monuril 3g',
    class: 'Antibacteriano Urinário Dose Única',
    type: 'antimicrobiano',
    defaultRoute: 'Uso oral',
    defaultPresentation: '3g - Envelope granulado para solução oral (dose única)',
    availablePresentations: ['3g - Sachê dose única'],
    defaultPosology: 'Dissolver todo o conteúdo de 1 envelope em meio copo de água (50 a 75mL) e beber em dose única, preferencialmente à noite ao deitar com a bexiga vazia.',
    instructions: 'Tratamento de dose única para cistite bacteriana aguda não complicada. Fácil posologia e alta adesão.'
  },
  {
    id: 'doxiciclina-100-cp',
    name: 'Cloridrato de Doxiciclina 100mg',
    genericName: 'Cloridrato de Doxiciclina',
    brandName: 'Vibramicina 100mg',
    class: 'Tetraciclina',
    type: 'antimicrobiano',
    defaultRoute: 'Uso oral',
    defaultPresentation: '100mg - Comprimidos solúveis / revestidos (caixa com 15)',
    availablePresentations: ['100mg - Comprimidos (caixa com 15)'],
    defaultPosology: 'Tomar 1 comprimido por via oral a cada 12 horas por 7 a 14 dias.',
    instructions: 'Tomar com um copo cheio de água em pé ou sentado (nunca deitar antes de 30 minutos para evitar esofagite medicamentosa). Evitar exposição solar.'
  },
  {
    id: 'metronidazol-400-cp',
    name: 'Metronidazol 400mg',
    genericName: 'Metronidazol',
    brandName: 'Flagyl 400mg',
    class: 'Antimicrobiano Anaerobicida e Antiprotozoário',
    type: 'antimicrobiano',
    defaultRoute: 'Uso oral',
    defaultPresentation: '400mg - Comprimidos (caixa com 24)',
    availablePresentations: [
      '250mg - Comprimidos (caixa com 20)',
      '400mg - Comprimidos (caixa com 24)',
      '100mg/g - Gel vaginal 50g com aplicadores',
      '500mg/100mL - Solução para infusão EV'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral a cada 8 horas (ou de 12/12h se 500mg) por 7 dias.',
    instructions: 'PROIBIDO CONSUMO DE ÁLCOOL durante o tratamento e até 48 horas após o término (efeito antabuse grave com rubor, vômitos e palpitações).'
  },
  {
    id: 'clindamicina-300-cap',
    name: 'Cloridrato de Clindamicina 300mg',
    genericName: 'Cloridrato de Clindamicina',
    brandName: 'Dalacin C 300mg',
    class: 'Lincosamida Anti-estafilocócica e Anaerobicida',
    type: 'antimicrobiano',
    defaultRoute: 'Uso oral',
    defaultPresentation: '300mg - Cápsulas duras (caixa com 16)',
    availablePresentations: [
      '300mg - Cápsulas (caixa com 16)',
      '150mg/mL - Ampola 4mL (600mg) EV/IM'
    ],
    defaultPosology: 'Tomar 1 cápsula por via oral a cada 6 ou 8 horas por 7 a 10 dias.',
    instructions: 'Excelente opção para pacientes alérgicos à penicilina com infecção de pele ou dentária. Suspender se houver diarreia persistente.'
  },
  {
    id: 'vancomicina-500-inj',
    name: 'Cloridrato de Vancomicina 500mg Pó Injetável',
    genericName: 'Cloridrato de Vancomicina',
    brandName: 'Vancocina 500mg',
    class: 'Glicopeptídeo Anti-MRSA Hospitalar',
    type: 'antimicrobiano',
    defaultRoute: 'Uso intravenoso',
    defaultPresentation: '500mg - Frasco-ampola pó injetável',
    availablePresentations: [
      '500mg - Frasco-ampola',
      '1g - Frasco-ampola'
    ],
    defaultPosology: 'Dose baseada no peso (15 a 20 mg/kg/dose) EV a cada 8 a 12 horas. Infundir em pelo menos 60 a 120 minutos.',
    instructions: 'Infundir lentamente para prevenir a Síndrome do Homem Vermelho. Monitorar função renal.'
  },
  {
    id: 'meropenem-1g-inj',
    name: 'Meropenem Tri-hidratado 1g Pó Injetável',
    genericName: 'Meropenem Tri-hidratado',
    brandName: 'Meronem 1g',
    class: 'Carbapenêmico Hospitalar de Amplo Espectro',
    type: 'antimicrobiano',
    defaultRoute: 'Uso intravenoso',
    defaultPresentation: '1g - Frasco-ampola pó para injeção EV',
    availablePresentations: [
      '500mg - Frasco-ampola',
      '1g - Frasco-ampola'
    ],
    defaultPosology: 'Adultos: 1g EV a cada 8 horas em infusão estendida de 3 horas.',
    instructions: 'Uso hospitalar estrito.'
  },

  // ==========================================
  // ANTIVIRAIS
  // ==========================================
  {
    id: 'aciclovir-200-cp',
    name: 'Aciclovir 200mg',
    genericName: 'Aciclovir',
    brandName: 'Zovirax 200mg',
    class: 'Antiviral Anti-herpético',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '200mg - Comprimidos (caixa com 25 ou 30)',
    availablePresentations: [
      '200mg - Comprimidos (caixa com 25)',
      '400mg - Comprimidos (caixa com 30)',
      '50mg/g - Creme dermatológico bisnaga 10g'
    ],
    defaultPosology: 'Herpes simples genital/labial: tomar 1 comprimido (200mg) por via oral 5 vezes ao dia (a cada 4 horas, pulando a dose da madrugada) por 5 dias.',
    instructions: 'Iniciar ao primeiro sinal da infecção (pródomo/formigamento) para eficácia ideal. Manter boa hidratação.'
  },
  {
    id: 'aciclovir-zoster-800',
    name: 'Aciclovir 800mg (Dose para Herpes Zóster)',
    genericName: 'Aciclovir',
    brandName: 'Zovirax Herpes Zóster',
    class: 'Antiviral para Herpes Zóster',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '400mg - Comprimidos (caixa com 70 para dose de 800mg 5x/dia)',
    availablePresentations: [
      '400mg - Comprimidos (caixa com 70)',
      '200mg - Comprimidos'
    ],
    defaultPosology: 'Tomar 800mg (2 comprimidos de 400mg ou 4 de 200mg) por via oral 5 vezes ao dia (a cada 4 horas) durante 7 dias.',
    instructions: 'Iniciar preferencialmente nas primeiras 72 horas do aparecimento das vesículas para prevenir neuralgia pós-herpética.'
  },
  {
    id: 'valaciclovir-500-cp',
    name: 'Cloridrato de Valaciclovir 500mg',
    genericName: 'Cloridrato de Valaciclovir',
    brandName: 'Valtrex 500mg',
    class: 'Pró-fármaco do Aciclovir com Maior Biodisponibilidade',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '500mg - Comprimidos revestidos (caixa com 10 ou 42)',
    availablePresentations: ['500mg - Comprimidos (caixa com 10 ou 42)'],
    defaultPosology: 'Herpes Zóster: 1.000mg (2 comprimidos de 500mg) por via oral de 8/8h por 7 dias. Herpes genital: 500mg de 12/12h por 5 dias.',
    instructions: 'Maior comodidade posológica que o aciclovir oral.'
  },
  {
    id: 'oseltamivir-75-cap',
    name: 'Fosfato de Oseltamivir 75mg',
    genericName: 'Fosfato de Oseltamivir',
    brandName: 'Tamiflu 75mg',
    class: 'Antiviral Inibidor da Neuraminidase / Anti-influenza',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '75mg - Cápsulas duras (caixa com 10)',
    availablePresentations: [
      '75mg - Cápsulas (caixa com 10)',
      '45mg - Cápsulas pediátricas (caixa com 10)',
      '30mg - Cápsulas pediátricas (caixa com 10)'
    ],
    defaultPosology: 'Tratamento de Síndrome Gripal / SRAG por Influenza: tomar 1 cápsula de 75mg por via oral a cada 12 horas por 5 dias.',
    instructions: 'Iniciar preferencialmente até 48 horas após o início dos sintomas gripais para máxima eficácia clínica.'
  },

  // ==========================================
  // ANTIPARASITÁRIOS
  // ==========================================
  {
    id: 'albendazol-400-cp',
    name: 'Albendazol 400mg',
    genericName: 'Albendazol',
    brandName: 'Zentel 400mg',
    class: 'Antiparasitário Anti-helmíntico de Amplo Espectro',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '400mg - Comprimido mastigável (caixa com 1)',
    availablePresentations: [
      '400mg - Comprimido mastigável (caixa com 1 ou 3)',
      '40mg/mL - Suspensão oral frasco com 10mL'
    ],
    defaultPosology: 'Ascaridíase, oxiuríase, ancilostomíase: tomar 1 comprimido (400mg) em dose única, mastigado com alimentos. Giardíase: 1 comprimido 1x/dia por 5 dias.',
    instructions: 'Mastigar o comprimido junto com uma refeição gordurosa para melhor absorção. Contraindicado na gestação.'
  },
  {
    id: 'ivermectina-6-cp',
    name: 'Ivermectina 6mg',
    genericName: 'Ivermectina',
    brandName: 'Revectina 6mg',
    class: 'Antiparasitário / Acaricida Oral',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '6mg - Comprimidos (blister com 2 ou 4)',
    availablePresentations: ['6mg - Comprimidos (caixa com 2 ou 4)'],
    defaultPosology: 'Escabiose / Estrongiloidíase / Pediculose: dose aproximada de 200mcg/kg (ex: 15-30kg: 0,5 cp; 31-60kg: 1 cp; 61-90kg: 2 cp; >90kg: 3 cp) em dose única em jejum com água. Repetir após 14 dias se escabiose.',
    instructions: 'Tomar em jejum com água pura, aguardando 1 hora antes de comer. Não administrar em gestantes ou crianças menores de 5 anos (< 15 kg).'
  },
  {
    id: 'nitazoxanida-500-cp',
    name: 'Nitazoxanida 500mg',
    genericName: 'Nitazoxanida',
    brandName: 'Annita 500mg',
    class: 'Antiparasitário de Amplo Espectro (Helmintos e Protozoários)',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '500mg - Comprimidos revestidos (caixa com 6)',
    availablePresentations: [
      '500mg - Comprimidos (caixa com 6)',
      '20mg/mL - Pó para suspensão oral frasco 45mL e 100mL'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral a cada 12 horas, junto com as refeições, durante 3 dias.',
    instructions: 'Pode alterar a cor da urina e esclera para amarelo esverdeado fluorescente transitório sem gravidade.'
  },
  {
    id: 'secnidazol-1g-cp',
    name: 'Secnidazol 1g',
    genericName: 'Secnidazol',
    brandName: 'Secnidal 1g',
    class: 'Antiparasitário Nitroimidazólico Dose Única',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '1g - Comprimidos revestidos (caixa com 2)',
    availablePresentations: ['1g - Comprimidos (caixa com 2)'],
    defaultPosology: 'Amebíase intestinal, giardíase e tricomoníase: tomar 2 comprimidos de 1g (total de 2g) em dose única oral durante uma das refeições.',
    instructions: 'Tratar o parceiro sexual se tricomoníase. Proibido consumo de álcool por 48 horas.'
  },
  {
    id: 'mebendazol-100-cp',
    name: 'Mebendazol 100mg',
    genericName: 'Mebendazol',
    brandName: 'Pantelmim 100mg',
    class: 'Anti-helmíntico Polivalente',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '100mg - Comprimidos (caixa com 6)',
    availablePresentations: [
      '100mg - Comprimidos (caixa com 6)',
      '20mg/mL - Suspensão oral frasco 30mL'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral de 12 em 12 horas durante 3 dias consecutivos.',
    instructions: 'Não necessita de jejum. Repetir após 2 semanas em caso de enterobíase.'
  }
];
