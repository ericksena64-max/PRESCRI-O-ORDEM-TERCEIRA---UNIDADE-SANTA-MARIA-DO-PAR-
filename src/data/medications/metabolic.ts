import { Medication } from '../../types';

export const METABOLIC_MEDICATIONS: Medication[] = [
  // ==========================================
  // ESTATINAS E HIPOLIPEMIANTES
  // ==========================================
  {
    id: 'atorvastatina-20-cp',
    name: 'Atorvastatina Cálcica 20mg',
    genericName: 'Atorvastatina Cálcica',
    brandName: 'Lipitor 20mg / Citalor',
    class: 'Hipolipemiante Inibidor da HMG-CoA Redutase (Estatina Potente)',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '20mg - Comprimidos revestidos (caixa com 30)',
    availablePresentations: [
      '10mg - Comprimidos (caixa com 30)',
      '20mg - Comprimidos (caixa com 30)',
      '40mg - Comprimidos (caixa com 30)',
      '80mg - Comprimidos (caixa com 30)'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral 1 vez ao dia à noite ao deitar com água, de uso contínuo.',
    instructions: 'Pode ser tomado a qualquer horário do dia, preferencialmente à noite. Orientar relato de dores musculares intensas ou fraqueza inexplicada.'
  },
  {
    id: 'atorvastatina-40-cp',
    name: 'Atorvastatina Cálcica 40mg',
    genericName: 'Atorvastatina Cálcica',
    brandName: 'Lipitor 40mg',
    class: 'Estatina de Alta Intensidade Pós-SCA',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '40mg - Comprimidos revestidos (caixa com 30)',
    availablePresentations: ['40mg - Comprimidos (caixa com 30)'],
    defaultPosology: 'Tomar 1 comprimido por via oral uma vez ao dia à noite, de uso contínuo.',
    instructions: 'Estatina de alta intensidade para prevenção secundária de IAM e AVC.'
  },
  {
    id: 'rosuvastatina-10-cp',
    name: 'Rosuvastatina Cálcica 10mg',
    genericName: 'Rosuvastatina Cálcica',
    brandName: 'Crestor 10mg / Vivacor',
    class: 'Estatina Sintética de Alta Potência',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '10mg - Comprimidos revestidos (caixa com 30)',
    availablePresentations: [
      '5mg - Comprimidos (caixa com 30)',
      '10mg - Comprimidos (caixa com 30)',
      '20mg - Comprimidos (caixa com 30)'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral 1 vez ao dia à noite ou pela manhã, de uso contínuo.',
    instructions: 'Alta eficácia na redução de LDL-colesterol com meia-vida longa.'
  },
  {
    id: 'sinvastatina-20-cp',
    name: 'Sinvastatina 20mg',
    genericName: 'Sinvastatina',
    brandName: 'Zocor 20mg',
    class: 'Hipolipemiante Estatina Convencional',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '20mg - Comprimidos revestidos (caixa com 30)',
    availablePresentations: [
      '10mg - Comprimidos (caixa com 30)',
      '20mg - Comprimidos (caixa com 30)',
      '40mg - Comprimidos (caixa com 30)'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral 1 vez ao dia à noite ao deitar com água, de uso contínuo.',
    instructions: 'Deve ser tomada OBRIGATORIAMENTE À NOITE (pico de síntese hepática do colesterol ocorre na madrugada e meia-vida é curta).'
  },
  {
    id: 'ezetimiba-10-cp',
    name: 'Ezetimiba 10mg',
    genericName: 'Ezetimiba',
    brandName: 'Zetia 10mg',
    class: 'Inibidor da Absorção Intestinal de Colesterol',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '10mg - Comprimidos (caixa com 30)',
    availablePresentations: ['10mg - Comprimidos (caixa com 30)'],
    defaultPosology: 'Tomar 1 comprimido por via oral uma vez ao dia com ou sem alimentos, de uso contínuo, associado ou não a estatina.',
    instructions: 'Inibe a proteína transportadora NPC1L1 na borda em escova do enterócito.'
  },
  {
    id: 'ciprofibrato-100-cp',
    name: 'Ciprofibrato 100mg',
    genericName: 'Ciprofibrato',
    brandName: 'Lipless 100mg',
    class: 'Fibrato Redutor de Triglicerídeos',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '100mg - Comprimidos (caixa com 30)',
    availablePresentations: ['100mg - Comprimidos (caixa com 30)'],
    defaultPosology: 'Tomar 1 comprimido por via oral 1 vez ao dia com uma refeição.',
    instructions: 'Primeira escolha em hipertrigliceridemia grave (> 500 mg/dL) para prevenção de pancreatite aguda.'
  },

  // ==========================================
  // ANTIDIABÉTICOS ORAIS
  // ==========================================
  {
    id: 'metformina-850-cp',
    name: 'Cloridrato de Metformina 850mg',
    genericName: 'Cloridrato de Metformina',
    brandName: 'Glifage 850mg',
    class: 'Antidiabético Oral / Biguanida Sensibilizadora de Insulina',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '850mg - Comprimidos (caixa com 30 ou 60)',
    availablePresentations: [
      '500mg - Comprimidos (caixa com 30)',
      '850mg - Comprimidos (caixa com 30)',
      '500mg XR - Liberação prolongada (caixa com 30)',
      '750mg XR - Liberação prolongada (caixa com 30)',
      '1000mg XR - Liberação prolongada (caixa com 30)'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral 2 vezes ao dia, imediatamente após o almoço e jantar, de uso contínuo.',
    instructions: 'Tomar SEMPRE DURANTE OU LOGO APÓS AS REFEIÇÕES para minimizar efeitos gastrointestinais (náusea, diarreia, flatulência).'
  },
  {
    id: 'metformina-xr-500',
    name: 'Cloridrato de Metformina 500mg XR Liberação Prolongada',
    genericName: 'Cloridrato de Metformina XR',
    brandName: 'Glifage XR 500mg',
    class: 'Biguanida de Liberação Prolongada (Melhor Tolerância Gástrica)',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '500mg XR - Comprimidos de liberação prolongada (caixa com 30)',
    availablePresentations: [
      '500mg XR - Comprimidos (caixa com 30)',
      '750mg XR - Comprimidos (caixa com 30)',
      '1000mg XR - Comprimidos (caixa com 30)'
    ],
    defaultPosology: 'Tomar 1 a 2 comprimidos por via oral uma vez ao dia no jantar com água, deglutidos inteiros.',
    instructions: 'Engolir inteiro sem mastigar. Excelente tolerabilidade em pacientes que tiveram intolerância à metformina simples.'
  },
  {
    id: 'gliclazida-60-mr',
    name: 'Gliclazida 60mg Liberação Modificada MR',
    genericName: 'Gliclazida MR',
    brandName: 'Diamicron MR 60mg',
    class: 'Sulfonilureia Secretagoga de Insulina de 2ª Geração',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '60mg MR - Comprimidos de liberação modificada birranhurados (caixa com 30 ou 60)',
    availablePresentations: [
      '30mg MR - Comprimidos (caixa com 30)',
      '60mg MR - Comprimidos (caixa com 30)'
    ],
    defaultPosology: 'Tomar 1/2 a 1 comprimido por via oral uma vez ao dia pela manhã, OBRIGATORIAMENTE JUNTO COM O CAFÉ DA MANHÃ.',
    instructions: 'Tomar sempre acompanhado de refeição contendo carboidratos para evitar hipoglicemia. Orientar sintomas de hipoglicemia.'
  },
  {
    id: 'glimepirida-2-cp',
    name: 'Glimepirida 2mg',
    genericName: 'Glimepirida',
    brandName: 'Amaryl 2mg',
    class: 'Sulfonilureia de Ação Prolongada',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '2mg - Comprimidos (caixa com 30)',
    availablePresentations: [
      '2mg - Comprimidos (caixa com 30)',
      '4mg - Comprimidos (caixa com 30)'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral pela manhã com a primeira refeição.',
    instructions: 'Tomar sempre junto ao desjejum.'
  },
  {
    id: 'dapagliflozina-10-cp',
    name: 'Dapagliflozina 10mg',
    genericName: 'Dapagliflozina',
    brandName: 'Forxiga 10mg',
    class: 'Inibidor de SGLT2 (Cardioprotetor e Nefroprotetor)',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '10mg - Comprimidos revestidos (caixa com 30)',
    availablePresentations: ['10mg - Comprimidos (caixa com 30)'],
    defaultPosology: 'Tomar 1 comprimido por via oral 1 vez ao dia pela manhã com água, de uso contínuo.',
    instructions: 'Benefício comprovado na redução de internações por Insuficiência Cardíaca e progressão de DRC. Orientar higiene íntima rigorosa (risco de micose genital).'
  },
  {
    id: 'empagliflozina-25-cp',
    name: 'Empagliflozina 25mg',
    genericName: 'Empagliflozina',
    brandName: 'Jardiance 25mg',
    class: 'Inibidor de SGLT2 Glicosúrico',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '25mg - Comprimidos revestidos (caixa com 30)',
    availablePresentations: [
      '10mg - Comprimidos (caixa com 30)',
      '25mg - Comprimidos (caixa com 30)'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral 1 vez ao dia pela manhã, de uso contínuo.',
    instructions: 'Manter boa hidratação hídrica ao longo do dia.'
  },
  {
    id: 'sitagliptina-100-cp',
    name: 'Fosfato de Sitagliptina 100mg',
    genericName: 'Fosfato de Sitagliptina',
    brandName: 'Januvia 100mg',
    class: 'Inibidor da DPP-4 (Incretinomimético Oral)',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '100mg - Comprimidos revestidos (caixa com 28)',
    availablePresentations: [
      '50mg - Comprimidos (caixa com 28)',
      '100mg - Comprimidos (caixa com 28)'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral 1 vez ao dia com ou sem alimentos.',
    instructions: 'Baixíssimo risco de hipoglicemia e neutro no peso corporal.'
  },
  {
    id: 'vildagliptina-50-cp',
    name: 'Vildagliptina 50mg',
    genericName: 'Vildagliptina',
    brandName: 'Galvus 50mg',
    class: 'Inibidor da Dipeptidil Peptidase-4 (DPP-4)',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '50mg - Comprimidos (caixa com 28 ou 56)',
    availablePresentations: ['50mg - Comprimidos (caixa com 56)'],
    defaultPosology: 'Tomar 1 comprimido por via oral 2 vezes ao dia (pela manhã e à noite).',
    instructions: 'Pode ser associada à metformina.'
  },

  // ==========================================
  // AGONISTAS DO RECEPTOR GLP-1 E INJETÁVEIS
  // ==========================================
  {
    id: 'semaglutida-ozempic-1mg',
    name: 'Semaglutida Injetável 1mg (Ozempic)',
    genericName: 'Semaglutida',
    brandName: 'Ozempic 1mg/dose',
    class: 'Agonista do Receptor de GLP-1 Injetável Semanal',
    type: 'simples',
    defaultRoute: 'Uso subcutâneo',
    defaultPresentation: 'Sistema de aplicação em caneta preenchida com 4 agulhas descartáveis (1,34mg/mL)',
    availablePresentations: [
      '0,25mg / 0,5mg - Caneta de iniciação',
      '1mg - Caneta de manutenção'
    ],
    defaultPosology: 'Aplicar 1 dose por via subcutânea no abdômen ou coxa 1 vez por semana, sempre no mesmo dia da semana.',
    instructions: 'Armazenar em geladeira (2 a 8°C). Após aberto, pode permanecer em temp. ambiente (< 30°C) por 56 dias. Titular dose iniciando com 0,25mg/sem por 4 semanas.'
  },
  {
    id: 'semaglutida-oral-rybelsus-7',
    name: 'Semaglutida Oral 7mg (Rybelsus)',
    genericName: 'Semaglutida Oral',
    brandName: 'Rybelsus 7mg',
    class: 'Agonista de GLP-1 Oral',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '7mg - Comprimidos (caixa com 30)',
    availablePresentations: [
      '3mg - Comprimidos iniciais (caixa com 30)',
      '7mg - Comprimidos (caixa com 30)',
      '14mg - Comprimidos (caixa com 30)'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral pela manhã EM JEJUM ABSOLUTO com no máximo MEIO COPO DE ÁGUA PURA (até 120mL), aguardando no mínimo 30 minutos antes de comer, beber ou tomar outros medicamentos.',
    instructions: 'SEGUIR RIGOROSAMENTE AS REGRAS DE INGESTÃO (o comprimido necessita do carreador SNAC no estômago vazio com pouca água).'
  },
  {
    id: 'liraglutida-saxenda',
    name: 'Liraglutida 6mg/mL Caneta Injetável SC (Saxenda / Victoza)',
    genericName: 'Liraglutida',
    brandName: 'Saxenda / Victoza',
    class: 'Agonista do Receptor de GLP-1 Diário',
    type: 'simples',
    defaultRoute: 'Uso subcutâneo',
    defaultPresentation: 'Caneta preenchida multidose 3mL (6mg/mL)',
    availablePresentations: ['Caneta 3mL (embalagem com 3 canetas)'],
    defaultPosology: 'Aplicar por via subcutânea 1 vez ao dia no mesmo horário, iniciando em 0,6mg/dia e titulando semanalmente até dose alvo.',
    instructions: 'Manter refrigerado antes do primeiro uso.'
  },

  // ==========================================
  // INSULINAS
  // ==========================================
  {
    id: 'insulina-nph-100',
    name: 'Insulina Humana NPH 100 UI/mL',
    genericName: 'Insulina Humana NPH (DNA Recombinante)',
    brandName: 'Novolin N / Humulin N 100 UI/mL',
    class: 'Insulina Basal de Ação Intermediária',
    type: 'simples',
    defaultRoute: 'Uso subcutâneo',
    defaultPresentation: '100 UI/mL - Frasco com 10mL (ou carpule 3mL para caneta)',
    availablePresentations: [
      '100 UI/mL - Frasco 10mL',
      '100 UI/mL - Carpules 3mL para caneta aplicadora'
    ],
    defaultPosology: 'Aplicar a dose prescrita em UI por via subcutânea (ex: antes do desjejum e/ou ao deitar às 22h).',
    instructions: 'HOMOGENEIZAR SUAVEMENTE rolando o frasco entre as mãos 10 a 20 vezes antes de aspirar (aspecto leitoso homogêneo). Revezar locais de aplicação.'
  },
  {
    id: 'insulina-regular-100',
    name: 'Insulina Humana Regular 100 UI/mL',
    genericName: 'Insulina Humana Regular Solúvel',
    brandName: 'Novolin R / Humulin R 100 UI/mL',
    class: 'Insulina Pós-prandial de Ação Rápida',
    type: 'simples',
    defaultRoute: 'Uso subcutâneo',
    defaultPresentation: '100 UI/mL - Frasco com 10mL',
    availablePresentations: [
      '100 UI/mL - Frasco 10mL',
      '100 UI/mL - Carpules 3mL'
    ],
    defaultPosology: 'Aplicar a dose prescrita por via subcutânea cerca de 30 minutos ANTES das principais refeições com base na glicemia capilar.',
    instructions: 'Aspecto límpido transparente. Em ambiente hospitalar, é a única insulina utilizada por via intravenosa contínua.'
  },
  {
    id: 'insulina-glargina-lantus',
    name: 'Insulina Glargina 100 UI/mL (Lantus / Basaglar)',
    genericName: 'Insulina Glargina',
    brandName: 'Lantus / Basaglar 100 UI/mL',
    class: 'Análogo de Insulina Basal de Ação Prolongada Sem Pico',
    type: 'simples',
    defaultRoute: 'Uso subcutâneo',
    defaultPresentation: '100 UI/mL - Sistema caneta descartável SoloStar com 3mL (ou frasco 10mL)',
    availablePresentations: ['100 UI/mL - Caneta preenchida 3mL'],
    defaultPosology: 'Aplicar a dose prescrita em UI por via subcutânea 1 vez ao dia no mesmo horário (ex: às 22h).',
    instructions: 'Solução transparente sem pico plasmático, fornecendo cobertura basal de 24 horas com menor risco de hipoglicemia noturna.'
  },

  // ==========================================
  // TIREOIDE, METABOLISMO ÓSSEO E SUPLEMENTOS
  // ==========================================
  {
    id: 'levotiroxina-50-cp',
    name: 'Levotiroxina Sódica 50mcg (Puran T4)',
    genericName: 'Levotiroxina Sódica',
    brandName: 'Puran T4 / Euthyrox 50mcg',
    class: 'Hormônio Tireoidiano Sintético (T4)',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '50mcg - Comprimidos (caixa com 30)',
    availablePresentations: [
      '25mcg - Comprimidos (caixa com 30)',
      '50mcg - Comprimidos (caixa com 30)',
      '75mcg - Comprimidos (caixa com 30)',
      '88mcg - Comprimidos (caixa com 30)',
      '100mcg - Comprimidos (caixa com 30)',
      '112mcg - Comprimidos (caixa com 30)',
      '125mcg - Comprimidos (caixa com 30)'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral pela manhã em jejum absoluto com água, aguardando no mínimo 30 a 60 minutos antes de se alimentar.',
    instructions: 'JEJUM RIGOROSO COM ÁGUA PURA. Não tomar com café, leite ou outros medicamentos (cálcio, ferro, omeprazol) pois impedem a absorção.'
  },
  {
    id: 'levotiroxina-75-cp',
    name: 'Levotiroxina Sódica 75mcg',
    genericName: 'Levotiroxina Sódica',
    brandName: 'Puran T4 75mcg',
    class: 'Hormônio Tireoidiano',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '75mcg - Comprimidos (caixa com 30)',
    availablePresentations: ['75mcg - Comprimidos (caixa com 30)'],
    defaultPosology: 'Tomar 1 comprimido por via oral pela manhã em jejum de 30 a 60 minutos com água.',
    instructions: 'Manter uso diário.'
  },
  {
    id: 'alendronato-70-cp',
    name: 'Alendronato de Sódio Tri-hidratado 70mg Semanal',
    genericName: 'Alendronato de Sódio',
    brandName: 'Fosamax 70mg / Bonalen',
    class: 'Bisfosfonato Inibidor da Reabsorção Óssea / Osteoporose',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '70mg - Comprimidos (caixa com 4)',
    availablePresentations: ['70mg - Comprimidos (caixa com 4)'],
    defaultPosology: 'Tomar 1 comprimido por via oral 1 vez por semana pela manhã ao acordar com um copo cheio de água (mínimo 200mL).',
    instructions: 'PERMANECER EM PÉ OU SENTADO POR PELO MENOS 30 MINUTOS após a ingestão (NUNCA DEITAR para evitar esofagite erosiva grave). Aguardar 30 minutos antes do café.'
  },
  {
    id: 'vitamina-d3-gotas-adde',
    name: 'Colecalciferol (Vitamina D3) Gotas 1.000 UI/gota',
    genericName: 'Colecalciferol',
    brandName: 'Addera D3 Gotas',
    class: 'Vitamina Lipossolúvel Reguladora do Cálcio e Imunidade',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: 'Gotas frasco conta-gotas com 10mL (1 gota = 1.000 UI)',
    availablePresentations: [
      '1.000 UI/gota - Frasco 10mL',
      '7.000 UI - Cápsulas semanais (caixa com 4)',
      '50.000 UI - Cápsulas para ataque de hipovitaminose D (caixa com 4)'
    ],
    defaultPosology: 'Tomar 2 gotas (2.000 UI) por via oral 1 vez ao dia junto a uma refeição principal.',
    instructions: 'Melhor absorvida quando administrada junto com alimentos que contenham gordura.'
  },
  {
    id: 'vitamina-d3-7000-cap',
    name: 'Colecalciferol (Vitamina D3) 7.000 UI Semanal',
    genericName: 'Colecalciferol',
    brandName: 'Addera D3 7.000 UI',
    class: 'Suplemento Semanal de Vitamina D3',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '7.000 UI - Cápsulas moles (caixa com 4 ou 8)',
    availablePresentations: ['7.000 UI - Cápsulas (caixa com 8)'],
    defaultPosology: 'Tomar 1 cápsula por via oral uma vez por semana junto ao almoço, de uso contínuo.',
    instructions: 'Excelente comodidade de tomada semanal.'
  },
  {
    id: 'sulfato-ferroso-40-cp',
    name: 'Sulfato Ferroso 40mg de Ferro Elementar',
    genericName: 'Sulfato Ferroso',
    brandName: 'Fer-In-Sol / Sulfato Ferroso SUS',
    class: 'Antianêmico / Suplemento de Ferro Oral',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '40mg de Fe elementar (200mg sal) - Comprimidos revestidos (caixa com 50)',
    availablePresentations: [
      '40mg - Comprimidos (caixa com 50)',
      '25mg/mL - Gotas pediátricas frasco 30mL'
    ],
    defaultPosology: 'Tomar 1 a 2 comprimidos por via oral ao dia, 1 hora antes do almoço com água ou suco cítrico (rico em vitamina C).',
    instructions: 'A vitamina C potencializa a absorção do ferro. Evitar café, chás ou laticínios concomitantes. Pode escurecer as fezes (preto).'
  },
  {
    id: 'acido-folico-5-cp',
    name: 'Ácido Fólico 5mg',
    genericName: 'Ácido Fólico (Vitamina B9)',
    brandName: 'Folifolin 5mg / Endofolin',
    class: 'Vitamina Antianêmica e Prevenção de Defeitos do Tubo Neural',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '5mg - Comprimidos (caixa com 30)',
    availablePresentations: ['5mg - Comprimidos (caixa com 30)'],
    defaultPosology: 'Pré-concepção e primeiro trimestre da gestação: tomar 1 comprimido por via oral 1 vez ao dia com água.',
    instructions: 'Iniciar idealmente 3 meses antes da concepção para prevenir defeitos de fechamento do tubo neural no embrião.'
  },
  {
    id: 'citoneurin-5000-drg',
    name: 'Citoneurin 5.000 (Vitaminas B1 + B6 + B12)',
    genericName: 'Tiamina + Piridoxina + Cianocobalamina',
    brandName: 'Citoneurin 5.000',
    class: 'Complexo B Antineurítico de Alta Dose',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: 'Drágeas (caixa com 30 ou 60)',
    availablePresentations: [
      'Drágeas (caixa com 30)',
      'Ampolas injetáveis IM (caixa com 3 ampolas)'
    ],
    defaultPosology: 'Tomar 1 drágea por via oral 1 vez ao dia após o almoço por 30 a 60 dias.',
    instructions: 'Indicado para neuropatias periféricas, lombociatalgias e carência de vitamina B12.'
  }
];
