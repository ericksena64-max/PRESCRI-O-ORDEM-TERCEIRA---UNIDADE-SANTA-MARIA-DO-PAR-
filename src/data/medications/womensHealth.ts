import { Medication } from '../../types';

export const WOMENS_HEALTH_MEDICATIONS: Medication[] = [
  // ==========================================
  // GINECOLOGIA, VULVOVAGINITES E SAÚDE DA MULHER
  // ==========================================
  {
    id: 'fluconazol-150-cap',
    name: 'Fluconazol 150mg',
    genericName: 'Fluconazol',
    brandName: 'Zoltec 150mg',
    class: 'Antifúngico Triazólico Oral Dose Única',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '150mg - Cápsulas duras (caixa com 1 ou 2)',
    availablePresentations: [
      '150mg - Cápsula dose única (caixa com 1)',
      '150mg - Cápsulas (caixa com 2)',
      '150mg - Cápsulas (caixa com 4)'
    ],
    defaultPosology: 'Candidíase vulvovaginal aguda: tomar 1 cápsula (150mg) por via oral em dose única. Se recorrente: 1 cápsula no dia 1, dia 4 e dia 7.',
    instructions: 'Ingerir com água independente das refeições. Contraindicado na gestação.'
  },
  {
    id: 'metronidazol-gel-vaginal',
    name: 'Metronidazol Gel Vaginal 100mg/g com Aplicadores',
    genericName: 'Metronidazol Gel Vaginal',
    brandName: 'Flagyl Ginecológico Gel',
    class: 'Antibacteriano e Antiprotozoário Ginecológico Tópico',
    type: 'simples',
    defaultRoute: 'Uso vaginal',
    defaultPresentation: '100mg/g - Bisnaga com 50g + 10 aplicadores descartáveis de 5g',
    availablePresentations: ['Bisnaga 50g com 10 aplicadores'],
    defaultPosology: 'Vaginose bacteriana: aplicar 1 aplicador cheio (5g) profundamente na vagina à noite ao deitar durante 5 a 7 noites consecutivas.',
    instructions: 'Permanecer deitada após aplicação. Abster-se de relações sexuais e consumo de álcool durante o tratamento.'
  },
  {
    id: 'miconazol-creme-vaginal',
    name: 'Nitrato de Miconazol Creme Vaginal 20mg/g (2%)',
    genericName: 'Nitrato de Miconazol',
    brandName: 'Gyno-Daktarin Creme Vaginal',
    class: 'Antifúngico Ginecológico de Amplo Espectro',
    type: 'simples',
    defaultRoute: 'Uso vaginal',
    defaultPresentation: '20mg/g (2%) - Bisnaga com 80g + 14 aplicadores descartáveis',
    availablePresentations: ['Bisnaga 80g com 14 aplicadores'],
    defaultPosology: 'Aplicar 1 aplicador cheio profundamente na vagina 1 vez ao dia à noite ao deitar durante 7 a 14 dias.',
    instructions: 'Seguro para uso a partir do 2º trimestre de gravidez sob indicação obstétrica.'
  },
  {
    id: 'nistatina-creme-vaginal',
    name: 'Nistatina Creme Vaginal 25.000 UI/g',
    genericName: 'Nistatina Creme Vaginal',
    brandName: 'Micostatin Creme Vaginal',
    class: 'Antifúngico Polieno Vaginal',
    type: 'simples',
    defaultRoute: 'Uso vaginal',
    defaultPresentation: '25.000 UI/g - Bisnaga com 60g + 14 aplicadores',
    availablePresentations: ['Bisnaga 60g com 14 aplicadores'],
    defaultPosology: 'Aplicar 1 aplicador cheio na vagina à noite ao deitar durante 14 noites consecutivas.',
    instructions: 'Não interromper durante o fluxo menstrual.'
  },
  {
    id: 'clotrimazol-creme-vaginal-gino',
    name: 'Clotrimazol Creme Vaginal 2% (Gino-Canesten 3 Dias)',
    genericName: 'Clotrimazol',
    brandName: 'Gino-Canesten 2% (3 dias)',
    class: 'Antifúngico Imidazólico de Curta Duração',
    type: 'simples',
    defaultRoute: 'Uso vaginal',
    defaultPresentation: '20mg/g (2%) - Bisnaga com 20g + 3 aplicadores descartáveis',
    availablePresentations: [
      '2% - Bisnaga com 3 aplicadores (3 dias)',
      '1% - Bisnaga com 6 aplicadores (6 dias)',
      '500mg - Comprimido vaginal dose única'
    ],
    defaultPosology: 'Aplicar 1 aplicador cheio profundamente na vagina à noite ao deitar durante 3 noites consecutivas.',
    instructions: 'Tratamento rápido e eficaz de candidíase vulvovaginal.'
  },
  {
    id: 'promestrieno-creme-vaginal',
    name: 'Promestrieno Creme Vaginal 10mg/g (Colpotrofine)',
    genericName: 'Promestrieno',
    brandName: 'Colpotrofine 10mg/g',
    class: 'Estrogênio Tópico Vaginal para Atrofia Urogenital da Menopausa',
    type: 'simples',
    defaultRoute: 'Uso vaginal',
    defaultPresentation: '10mg/g - Bisnaga com 30g + 20 aplicadores descartáveis',
    availablePresentations: ['Bisnaga 30g com 20 aplicadores'],
    defaultPosology: 'Aplicar 1 aplicador preenchido (1g) na vagina à noite por 20 dias consecutivos; após, manutenção de 2 a 3 vezes por semana.',
    instructions: 'Ação estrogênica puramente local sem absorção sistêmica significativa e sem estímulo no endométrio ou mamas.'
  },
  {
    id: 'acido-mefenamico-500-cp',
    name: 'Ácido Mefenâmico 500mg (Ponstan)',
    genericName: 'Ácido Mefenâmico',
    brandName: 'Ponstan 500mg',
    class: 'AINE Específico para Dismenorreia e Sangramento Menstrual Excessivo',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '500mg - Comprimidos (caixa com 24)',
    availablePresentations: ['500mg - Comprimidos (caixa com 24)'],
    defaultPosology: 'Tomar 1 comprimido por via oral a cada 8 horas, às refeições, a partir do início das cólicas menstruais por até 3 a 5 dias.',
    instructions: 'Inibe a síntese de prostaglandinas no miométrio, diminuindo a dor espasmódica e o fluxo menstrual em até 30%.'
  },
  {
    id: 'acido-tranexamico-250-cp',
    name: 'Ácido Tranexâmico 250mg (Transamin)',
    genericName: 'Ácido Tranexâmico',
    brandName: 'Transamin 250mg',
    class: 'Antifibrinolítico para Hemorragias e Menorragia',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '250mg - Comprimidos (caixa com 12 ou 20)',
    availablePresentations: [
      '250mg - Comprimidos (caixa com 12)',
      '250mg/5mL - Ampola injetável EV'
    ],
    defaultPosology: 'Sangramento menstrual excessivo: tomar 2 comprimidos (500mg) por via oral de 8/8h durante os dias de maior sangramento.',
    instructions: 'Bloqueia a quebra do coágulo de fibrina reduzindo perdas hemorrágicas.'
  },

  // ==========================================
  // UROLOGIA E SAÚDE DO HOMEM
  // ==========================================
  {
    id: 'fenazopiridina-200-drg',
    name: 'Cloridrato de Fenazopiridina 200mg (Pyridium)',
    genericName: 'Cloridrato de Fenazopiridina',
    brandName: 'Pyridium / Urovit 200mg',
    class: 'Analgésico e Anestésico Específico do Trato Urinário',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '200mg - Drágeas (caixa com 18)',
    availablePresentations: [
      '100mg - Drágeas (caixa com 25)',
      '200mg - Drágeas (caixa com 18)'
    ],
    defaultPosology: 'Tomar 1 drágea por via oral a cada 8 horas após as refeições por no máximo 2 a 3 dias associado ao antibiótico.',
    instructions: 'ORIENTAR O PACIENTE: colore a urina de cor alaranjada ou avermelhada intensa (pode manchar roupas íntimas e lentes de contato). Não exceder 2 a 3 dias.'
  },
  {
    id: 'tansulosina-04-cap',
    name: 'Cloridrato de Tansulosina 0,4mg Liberação Prolongada',
    genericName: 'Cloridrato de Tansulosina',
    brandName: 'Secotex 0,4mg / Tansulita',
    class: 'Bloqueador Alfa-1A Adrenérgico Urosseletivo para Hiperplasia Prostática Benigna (HPB)',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '0,4mg - Cápsulas duras de liberação modificada (caixa com 30)',
    availablePresentations: ['0,4mg - Cápsulas (caixa com 30)'],
    defaultPosology: 'Tomar 1 cápsula por via oral uma vez ao dia cerca de 30 minutos após a mesma refeição (habitualmente o café da manhã).',
    instructions: 'Engolir a cápsula inteira sem mastigar. Melhora o jato urinário e relaxa a musculatura do colo vesical e próstata. Pode causar ejaculação retrógrada benigna.'
  },
  {
    id: 'finasterida-5-cp',
    name: 'Finasterida 5mg',
    genericName: 'Finasterida',
    brandName: 'Proscar 5mg',
    class: 'Inibidor da 5-Alfa-Redutase para HPB',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '5mg - Comprimidos revestidos (caixa com 30)',
    availablePresentations: [
      '1mg - Comprimidos para alopecia (caixa com 30)',
      '5mg - Comprimidos para HPB (caixa com 30)'
    ],
    defaultPosology: 'Tomar 1 comprimido (5mg) por via oral uma vez ao dia com água, de uso contínuo.',
    instructions: 'Reduz o volume da próstata ao longo de 6 meses de uso contínuo. Reduz pela metade os valores basais de PSA sérico.'
  },
  {
    id: 'doxazosina-2-cp',
    name: 'Mesilato de Doxazosina 2mg',
    genericName: 'Mesilato de Doxazosina',
    brandName: 'Carduran 2mg',
    class: 'Bloqueador Alfa-1 Adrenérgico para HPB e Hipertensão',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '2mg - Comprimidos (caixa com 30)',
    availablePresentations: [
      '2mg - Comprimidos (caixa com 30)',
      '4mg - Comprimidos (caixa com 30)'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral à noite ao deitar com água.',
    instructions: 'Tomar à noite para prevenir hipotensão postural (efeito da primeira dose).'
  },
  {
    id: 'oxibutinina-5-cp',
    name: 'Cloridrato de Oxibutinina 5mg (Retemic)',
    genericName: 'Cloridrato de Oxibutinina',
    brandName: 'Retemic 5mg',
    class: 'Anticolinérgico Antiespasmódico Vesical / Bexiga Hiperativa',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '5mg - Comprimidos (caixa com 30 ou 60)',
    availablePresentations: [
      '5mg - Comprimidos (caixa com 30)',
      '1mg/mL - Xarope frasco 120mL'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral 2 a 3 vezes ao dia com água.',
    instructions: 'Tratamento de incontinência urinária de urgência e noctúria. Efeito colateral comum: boca seca.'
  },
  {
    id: 'tadalafila-5-diario',
    name: 'Tadalafila 5mg Uso Diário Contínuo',
    genericName: 'Tadalafila',
    brandName: 'Cialis Diário 5mg',
    class: 'Inibidor Seletivo da Fosfodiesterase Tipo 5 (PDE-5) / HPB e Disfunção Erétil',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '5mg - Comprimidos revestidos (caixa com 30)',
    availablePresentations: [
      '5mg - Comprimidos diários (caixa com 30)',
      '20mg - Comprimidos sob demanda (caixa com 4)'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral uma vez ao dia sempre no mesmo horário com água, independente das refeições.',
    instructions: 'CONTRAINDICADO ABSOLUTO O USO CONCOMITANTE COM NITRATOS (Monocordil, Isordil, Nitroglicerina, Propatilnitrato) devido ao risco fatal de choque circulatório.'
  },
  {
    id: 'sildenafila-50-cp',
    name: 'Citrato de Sildenafila 50mg',
    genericName: 'Citrato de Sildenafila',
    brandName: 'Viagra 50mg / Pramil',
    class: 'Inibidor de PDE-5 Sob Demanda',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '50mg - Comprimidos revestidos (caixa com 4)',
    availablePresentations: [
      '25mg - Comprimidos (caixa com 4)',
      '50mg - Comprimidos (caixa com 4)'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral cerca de 1 hora antes da atividade sexual prevista.',
    instructions: 'CONTRAINDICAÇÃO ABSOLUTA COM NITRATOS. Evitar refeições muito gordurosas que atrasam o início da ação.'
  }
];
