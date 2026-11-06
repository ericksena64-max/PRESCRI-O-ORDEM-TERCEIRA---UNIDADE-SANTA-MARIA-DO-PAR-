import { FastHugCategory, HospitalMedication, InpatientInfo, InpatientItem } from '../types';
import { getTodayIso } from '../utils/dateUtils';

/**
 * Metadados das seções da prescrição de internação na ordem hospitalar solicitada:
 * 1. Dieta
 * 2. Hidratação
 * 3. Antibióticos
 * 4. Analgesia
 * 5. Sintomáticos
 * 6. Profilaxias (TEV e Úlcera de Estresse)
 * 7. Demais medicações e cuidados
 */
export interface InpatientSectionMeta {
  key: FastHugCategory;
  order: number;
  letter: string;
  title: string;
  shortTitle: string;
  english: string;
  description: string;
  emptyText: string;
}

export type FastHugSectionMeta = InpatientSectionMeta;

export const INPATIENT_SECTIONS: InpatientSectionMeta[] = [
  {
    key: 'dieta',
    order: 1,
    letter: '1',
    title: '1. Dieta',
    shortTitle: 'Dieta',
    english: 'Diet',
    description: 'Consistência e via da dieta oral, nutrição enteral, suplementos ou jejum.',
    emptyText: 'Sem dieta prescrita'
  },
  {
    key: 'hidratacao',
    order: 2,
    letter: '2',
    title: '2. Hidratação Venosa',
    shortTitle: 'Hidratação',
    english: 'Hydration',
    description: 'Cristaloides, soroterapia de manutenção, expansão volêmica e reposições.',
    emptyText: 'Sem hidratação venosa prescrita'
  },
  {
    key: 'antibiotico',
    order: 3,
    letter: '3',
    title: '3. Antibióticos',
    shortTitle: 'Antibiótico',
    english: 'Antibiotics',
    description: 'Antimicrobianos parenterais e orais (terapêuticos e profiláticos) e antivirais.',
    emptyText: 'Sem antibióticos prescritos no momento'
  },
  {
    key: 'analgesia',
    order: 4,
    letter: '4',
    title: '4. Analgesia',
    shortTitle: 'Analgesia',
    english: 'Analgesia',
    description: 'Analgésicos simples, anti-inflamatórios, opioides e antiespasmódicos.',
    emptyText: 'Sem analgesia prescrita'
  },
  {
    key: 'sintomaticos',
    order: 5,
    letter: '5',
    title: '5. Sintomáticos',
    shortTitle: 'Sintomáticos',
    english: 'Symptomatics',
    description: 'Antitérmicos, antiespasmódicos, antieméticos, protetores gástricos imediatos, laxativos, antigases e broncodilatadores.',
    emptyText: 'Sem sintomáticos prescritos'
  },
  {
    key: 'profilaxias',
    order: 6,
    letter: '6',
    title: '6. Profilaxias',
    shortTitle: 'Profilaxias',
    english: 'Prophylaxis',
    description: 'Profilaxia de TEV (enoxaparina, heparina, meias) e profilaxia de úlcera de estresse (omeprazol, pantoprazol).',
    emptyText: 'Sem profilaxias prescritas'
  },
  {
    key: 'demais',
    order: 7,
    letter: '7+',
    title: '7. Demais Medicações & Cuidados',
    shortTitle: 'Demais',
    english: 'Other orders',
    description: 'Cabeceira, cuidados de enfermagem, sinais vitais, controle glicêmico, corticoides, cardiovasculares e neurológicos.',
    emptyText: 'Sem outras prescrições'
  }
];

export const FAST_HUG_SECTIONS = INPATIENT_SECTIONS;

export const FAST_HUG_LABELS: Record<FastHugCategory, string> = INPATIENT_SECTIONS.reduce(
  (acc, s) => ({ ...acc, [s.key]: s.title }),
  {} as Record<FastHugCategory, string>
);

export const INPATIENT_ROUTES = [
  'EV', 'VO', 'SC', 'IM', 'SL', 'NBZ', 'SNE', 'VR', 'Inalatória', 'Nebulização', 'Retal', 'Tópica'
];

export interface PosologyGroup {
  label: string;
  options: string[];
}

export const INPATIENT_POSOLOGY_GROUPS: PosologyGroup[] = [
  {
    label: 'Intervalos de Horas (Rotina Fixa)',
    options: [
      '12/12h',
      '24/24h',
      '8/8h',
      '6/6h',
      '4/4h',
      '3/3h',
      '2/2h',
      '1/1h',
      '48/48h',
      '1x/dia',
      '2x/dia',
      '3x/dia',
      '4x/dia',
      '6 refeições/dia'
    ]
  },
  {
    label: 'Antibióticos & Ceftriaxona (Horários Hospitalares)',
    options: [
      '12/12h (08h - 20h)',
      '12/12h (06h - 18h)',
      '12/12h (10h - 22h)',
      '24/24h (às 08h)',
      '24/24h (às 10h)',
      '24/24h (às 12h)',
      '24/24h (às 14h)',
      '24/24h (às 16h)',
      '24/24h (às 18h)',
      '24/24h (às 20h)',
      '24/24h (às 22h)',
      '8/8h (06h - 14h - 22h)',
      '8/8h (08h - 16h - 24h)',
      '6/6h (06h - 12h - 18h - 24h)',
      '4/4h (02h - 06h - 10h - 14h - 18h - 22h)'
    ]
  },
  {
    label: 'Horários Específicos & Refeições',
    options: [
      'Em jejum 1x/dia',
      '1x/dia pela manhã (08h)',
      '1x/dia à tarde (14h)',
      '1x/dia à noite (22h)',
      'Às 08h e 20h (12/12h)',
      'Às 06h, 14h e 22h (8/8h)',
      'Às 06h, 12h, 18h e 24h (6/6h)',
      '30 min antes das refeições',
      'Após o almoço',
      'Antes das refeições e ao deitar',
      'À noite ao deitar'
    ]
  },
  {
    label: 'Se Necessário (S.N.) & A Critério Médico (ACM)',
    options: [
      '4/4h S.N.',
      '6/6h S.N.',
      '8/8h S.N.',
      '12/12h S.N.',
      'S.N.',
      'ACM',
      '4/4h ACM',
      '6/6h ACM',
      '8/8h ACM',
      '12/12h ACM',
      '6/6h S.N. se dor ou febre (Tax ≥ 37,8°C)',
      '4/4h S.N. se dor ou febre',
      '8/8h S.N. se náuseas ou vômitos',
      '8/8h S.N. se dor moderada a intensa',
      '4/4h S.N. se dor intensa',
      'S.N. se PA > 170x90 mmHg',
      'S.N. se PA ≥ 180x110 mmHg',
      'Conforme esquema de HGT',
      'S.N. se HGT < 70 mg/dL',
      'S.N. se SpO₂ < 92%',
      'S.N. se broncoespasmo / dispneia',
      'À noite S.N. se insônia'
    ]
  },
  {
    label: 'Tempo de Infusão / Velocidade / Ataque',
    options: [
      'Em 24h',
      'Em 12h',
      'Em 8h',
      'Em 6h',
      'Diluir em 100 mL de SF 0,9% em 30 min',
      'Diluir em 100 mL de SF 0,9% em 60 min',
      'Diluir em 250 mL de SF 0,9% em 2h',
      'Correr em 30 min',
      'Correr em 1h',
      'Correr em 2h',
      'Correr em 3h (infusão estendida)',
      'Contínuo (BIC)',
      'Contínuo',
      'Dose única',
      'Dose de ataque agora'
    ]
  }
];

export const INPATIENT_QUICK_POSOLOGIES = [
  '12/12h',
  '24/24h',
  '24/24h (08h)',
  '24/24h (20h)',
  '12/12h (08h-20h)',
  '8/8h',
  '6/6h',
  '4/4h',
  '4/4h S.N.',
  '6/6h S.N.',
  '8/8h S.N.',
  'Em jejum 1x/dia',
  'Em 24h',
  'ACM',
  '8/8h ACM',
  'Se dor ou febre (S.N.)',
  'Se cólica abdominal (S.N.)',
  'Se náuseas ou vômitos (S.N.)',
  'Se PA > 170x90 mmHg',
  'Dose única',
  'Contínuo (BIC)'
];

export const INPATIENT_SCHEDULE_OPTIONS = [
  '08h - 20h (12/12h)',
  '10h - 22h (12/12h)',
  '06h - 18h (12/12h)',
  '08h (24/24h)',
  '10h (24/24h)',
  '14h (24/24h)',
  '20h (24/24h)',
  '22h (24/24h)',
  '06h (Em jejum)',
  '06h - 14h - 22h (8/8h)',
  '08h - 16h - 24h (8/8h)',
  '06h - 12h - 18h - 24h (6/6h)',
  '02h - 06h - 10h - 14h - 18h - 22h (4/4h)',
  'Contínuo 24h',
  'S.N. / Se Necessário',
  'ACM / A Critério Médico'
];

export const INPATIENT_FREQUENCIES = INPATIENT_POSOLOGY_GROUPS.flatMap(g => g.options);

// Atalho de construção para manter o catálogo legível
const m = (
  id: string,
  category: FastHugCategory,
  group: string,
  name: string,
  dose: string,
  route: string,
  frequency: string,
  notes?: string,
  controlled?: boolean
): HospitalMedication => ({ id, category, group, name, dose, route, frequency, notes, controlled });

/**
 * Banco de medicamentos e prescrições de uso hospitalar (enfermaria adulta).
 * Organizado na ordem padrão da prescrição médica hospitalar:
 * 1. Dieta | 2. Hidratação | 3. Antibióticos | 4. Analgesia | 5. Sintomáticos | 6. Profilaxias | 7. Demais
 */
export const HOSPITAL_MEDICATIONS: HospitalMedication[] = [
  // ───────────── 1 · DIETA ─────────────
  m('f-dieta-geral', 'dieta', 'Dieta oral', 'Dieta geral (livre)', '', 'VO', '6 refeições/dia', 'Fracionada. Aceitar conforme tolerância.'),
  m('f-dieta-branda', 'dieta', 'Dieta oral', 'Dieta branda', '', 'VO', '6 refeições/dia', 'Alimentos de fácil mastigação e digestão.'),
  m('f-dieta-pastosa', 'dieta', 'Dieta oral', 'Dieta pastosa', '', 'VO', '6 refeições/dia', 'Indicada em disfagia leve. Manter cabeceira elevada durante e 30 min após as refeições.'),
  m('f-dieta-liquida', 'dieta', 'Dieta oral', 'Dieta líquida completa', '', 'VO', '6 refeições/dia', 'Progredir conforme tolerância.'),
  m('f-dieta-hipossodica', 'dieta', 'Dieta oral', 'Dieta hipossódica', '', 'VO', '6 refeições/dia', 'Restrição de sal (cardiopatas, hipertensos, hepatopatas, nefropatas).'),
  m('f-dieta-diabetico', 'dieta', 'Dieta oral', 'Dieta para diabético (hipoglicídica)', '', 'VO', '6 refeições/dia', 'Evitar açúcares simples; fracionar carboidratos.'),
  m('f-dieta-hipo-diab', 'dieta', 'Dieta oral', 'Dieta hipossódica + hipoglicídica', '', 'VO', '6 refeições/dia', 'Para paciente cardiopata e diabético.'),
  m('f-dieta-suplemento', 'dieta', 'Dieta oral', 'Suplemento nutricional oral hipercalórico/hiperproteico', '200 mL', 'VO', '12/12h', 'Entre as refeições principais.'),
  m('f-dieta-enteral', 'dieta', 'Dieta enteral', 'Dieta enteral polimérica padrão (1 kcal/mL)', '300 mL', 'SNE', '4/4h', 'Cabeceira ≥ 30°. Lavar a sonda com 20 mL de água filtrada após cada etapa.'),
  m('f-dieta-agua-sne', 'dieta', 'Dieta enteral', 'Água filtrada por sonda', '100 mL', 'SNE', '4/4h', 'Nos intervalos da dieta enteral.'),
  m('f-jejum-zero', 'dieta', 'Jejum', 'Dieta zero (jejum)', '', '', 'Contínuo', 'Manter hidratação venosa. Reavaliar liberação de dieta conforme evolução clínica.'),
  m('f-jejum-proc', 'dieta', 'Jejum', 'Jejum para procedimento/exame', '', '', 'A partir das 00h', 'Manter apenas medicações essenciais com pequenos goles de água.'),

  // ───────────── 2 · HIDRATAÇÃO ─────────────
  m('f-hid-sf1000-24h', 'hidratacao', 'Cristaloides', 'SF 0,9% 1000 mL', '1000 mL', 'EV', 'Em 24h', 'Ajustar velocidade de infusão conforme balanço hídrico.'),
  m('f-hid-sf500', 'hidratacao', 'Cristaloides', 'Soro fisiológico 0,9%', '500 mL', 'EV', '8/8h', 'Velocidade: 167 mL/h. Ajustar conforme balanço hídrico.'),
  m('f-hid-sf1000', 'hidratacao', 'Cristaloides', 'Soro fisiológico 0,9%', '1.000 mL', 'EV', '12/12h', 'Velocidade: 83 mL/h. Ajustar conforme balanço hídrico.'),
  m('f-hid-rl', 'hidratacao', 'Cristaloides', 'Ringer lactato', '1.000 mL', 'EV', '12/12h', 'Velocidade: 83 mL/h. Cautela em hepatopatas graves.'),
  m('f-hid-sg5', 'hidratacao', 'Cristaloides', 'Soro glicosado 5%', '500 mL', 'EV', '8/8h', 'Velocidade: 167 mL/h. Monitorar glicemia capilar.'),
  m('f-hid-manut', 'hidratacao', 'Manutenção', 'Hidratação de manutenção: SG 5% 500 mL + NaCl 20% 10 mL + KCl 19,1% 5 mL', '500 mL', 'EV', '8/8h', 'Ajustar eletrólitos conforme exames e função renal. Não usar se hipercalemia.'),
  m('f-hid-bolus', 'hidratacao', 'Expansão volêmica', 'Expansão volêmica: SF 0,9% ou Ringer lactato', '500 mL', 'EV', 'Dose única', 'Infundir em 30 min. Reavaliar resposta clínica antes de repetir.'),

  // ───────────── 3 · ANTIBIÓTICOS ─────────────
  m('o-ceftriaxona', 'antibiotico', 'Cefalosporinas', 'Ceftriaxona 1 g', '1 g', 'EV', '12/12h', 'Diluir em 100 mL de SF 0,9% ou AD. Ajustar horário/posologia conforme indicação médica.'),
  m('o-ceftriaxona-2g-24h', 'antibiotico', 'Cefalosporinas', 'Ceftriaxona 2 g (1x/dia)', '2 g', 'EV', '24/24h', 'Diluir em 100 mL de SF 0,9%, correr em 30 min.'),
  m('o-ceftriaxona-1g-24h', 'antibiotico', 'Cefalosporinas', 'Ceftriaxona 1 g (1x/dia)', '1 g', 'EV', '24/24h', 'Diluir em 100 mL de SF 0,9%, correr em 30 min.'),
  m('o-ceftriaxona-2g-12h', 'antibiotico', 'Cefalosporinas', 'Ceftriaxona 2 g (SNC / Meningite)', '2 g', 'EV', '12/12h', 'Dose para infecções de SNC/endocardite.'),
  m('o-ampsulb', 'antibiotico', 'Penicilinas', 'Ampicilina + sulbactam 2 g + 1 g', '3 g', 'EV', '6/6h', 'Diluir em 100 mL de SF 0,9%. Ajustar à função renal. Registrar data de início.'),
  m('o-amoxclav', 'antibiotico', 'Penicilinas', 'Amoxicilina + clavulanato 1.000 mg + 200 mg', '1,2 g', 'EV', '8/8h', 'Ajustar à função renal. Registrar data de início.'),
  m('o-pip-tazo', 'antibiotico', 'Antipseudomonas', 'Piperacilina + tazobactam 4 g + 0,5 g', '4,5 g', 'EV', '6/6h', 'Ajustar à função renal. Registrar data de início e reavaliar com culturas (descalonamento).'),
  m('o-cefazolina', 'antibiotico', 'Cefalosporinas', 'Cefazolina 1 g', '1 g', 'EV', '8/8h', 'Ajustar à função renal. Registrar data de início.'),
  m('o-cefepime', 'antibiotico', 'Cefalosporinas', 'Cefepime 2 g', '2 g', 'EV', '8/8h', 'Ajustar à função renal. Registrar data de início e reavaliar com culturas.'),
  m('o-meropenem', 'antibiotico', 'Carbapenêmicos', 'Meropenem 1 g', '1 g', 'EV', '8/8h', 'Ajustar à função renal. Reservar para infecções graves/multirresistentes. Registrar data de início.'),
  m('o-cipro', 'antibiotico', 'Quinolonas', 'Ciprofloxacino 400 mg/200 mL', '400 mg', 'EV', '12/12h', 'Ajustar à função renal. Registrar data de início.'),
  m('o-levo', 'antibiotico', 'Quinolonas', 'Levofloxacino 750 mg/150 mL', '750 mg', 'EV', '24/24h', 'Ajustar à função renal. Registrar data de início.'),
  m('o-metro', 'antibiotico', 'Nitroimidazólicos', 'Metronidazol 500 mg/100 mL', '500 mg', 'EV', '8/8h', 'Registrar data de início.'),
  m('o-clinda', 'antibiotico', 'Lincosamidas', 'Clindamicina 150 mg/mL', '600 mg', 'EV', '8/8h', 'Diluir em 100 mL de SF 0,9%, infundir em 30 min. Registrar data de início.'),
  m('o-azitro', 'antibiotico', 'Macrolídeos', 'Azitromicina 500 mg', '500 mg', 'EV', '24/24h', 'Diluir em 250 mL de SF 0,9%, infundir em 60 min.'),
  m('o-gentamicina', 'antibiotico', 'Aminoglicosídeos', 'Gentamicina', '5 mg/kg', 'EV', '24/24h', 'Calcular dose pelo peso. Nefrotóxica/ototóxica: monitorar creatinina. Registrar data de início.'),
  m('o-vanco', 'antibiotico', 'Glicopeptídeos', 'Vancomicina 500 mg', '15 mg/kg', 'EV', '12/12h', 'Calcular dose pelo peso e ajustar à função renal. Infundir em ≥ 60 min. Monitorar creatinina.'),
  m('o-oxacilina', 'antibiotico', 'Penicilinas antiestafilocócicas', 'Oxacilina 500 mg', '2 g', 'EV', '4/4h', 'Para infecções graves por S. aureus sensível a meticilina. Registrar data de início.'),
  m('o-penicilina-cr', 'antibiotico', 'Penicilinas naturais', 'Penicilina G potássica (cristalina) 5.000.000 UI', '4.000.000 UI', 'EV', '4/4h', 'Ajustar à indicação e função renal. Registrar data de início.'),
  m('o-penicilina-benz', 'antibiotico', 'Penicilinas naturais', 'Penicilina G benzatina 1.200.000 UI', '1.200.000 UI', 'IM', 'Dose única', 'Aplicar IM profunda. Esquema conforme indicação clínica.'),
  m('o-aciclovir', 'antibiotico', 'Antivirais', 'Aciclovir 250 mg', '10 mg/kg', 'EV', '8/8h', 'Calcular dose pelo peso. Hidratar e ajustar à função renal.'),
  m('o-oseltamivir', 'antibiotico', 'Antivirais', 'Oseltamivir 75 mg', '75 mg', 'VO', '12/12h', 'Por 5 dias. Ajustar à função renal.'),

  // ───────────── 4 · ANALGESIA ─────────────
  m('a-dipirona-ev-4h', 'analgesia', 'Analgésicos e antitérmicos', 'Dipirona 1 g', '1 g', 'EV', '4/4h S.N.', 'Se dor ou febre (Tax ≥ 37,8 °C).'),
  m('a-dipirona-ev', 'analgesia', 'Analgésicos e antitérmicos', 'Dipirona sódica 500 mg/mL', '1 g (2 mL)', 'EV', '6/6h S.N.', 'Infundir lentamente. Administrar se Tax ≥ 37,8 °C ou dor.'),
  m('a-dipirona-vo', 'analgesia', 'Analgésicos e antitérmicos', 'Dipirona sódica 500 mg comprimido', '1 g (2 comprimidos)', 'VO', '6/6h S.N.', 'Administrar se Tax ≥ 37,8 °C ou dor.'),
  m('a-paracetamol-vo', 'analgesia', 'Analgésicos e antitérmicos', 'Paracetamol 750 mg comprimido', '750 mg (1 comprimido)', 'VO', '6/6h S.N.', 'Máx. 3 g/dia (2 g/dia em hepatopatas ou etilistas).'),
  m('a-paracetamol-ev', 'analgesia', 'Analgésicos e antitérmicos', 'Paracetamol 10 mg/mL solução para infusão', '1 g (100 mL)', 'EV', '6/6h S.N.', 'Infundir em 15 min. Máx. 4 g/dia.'),
  m('a-cetoprofeno', 'analgesia', 'Anti-inflamatórios', 'Cetoprofeno 100 mg', '100 mg', 'EV', '12/12h', 'Diluir em 100 mL de SF 0,9%, infundir em 20 min. Máx. 3 dias. Evitar em DRC, úlcera péptica e anticoagulados.'),
  m('a-cetorolaco', 'analgesia', 'Anti-inflamatórios', 'Cetorolaco de trometamina 30 mg/mL', '30 mg (1 mL)', 'EV', '8/8h S.N.', 'Infundir lentamente. Máx. 5 dias. Evitar em DRC, úlcera péptica e anticoagulados.'),
  m('a-tramadol-100', 'analgesia', 'Opioides', 'Tramadol 100 mg + SF 0,9% 100 mL', '100 mg', 'EV', '8/8h S.N.', 'Infundir em 30 min se dor moderada a intensa.', true),
  m('a-tramadol', 'analgesia', 'Opioides', 'Cloridrato de tramadol 100 mg/2 mL', '50 mg (1 mL)', 'EV', '8/8h S.N.', 'Diluir em 100 mL de SF 0,9% e infundir em 30 min. Máx. 400 mg/dia.', true),
  m('a-codeina', 'analgesia', 'Opioides', 'Paracetamol 500 mg + codeína 30 mg', '1 comprimido', 'VO', '8/8h S.N.', 'Observar sonolência e constipação.', true),
  m('a-morfina', 'analgesia', 'Opioides', 'Sulfato de morfina 10 mg/mL', '2 mg (0,2 mL diluídos em 10 mL de AD)', 'EV', '4/4h S.N.', 'Se dor intensa (EVA ≥ 7). Infundir lentamente. Monitorar FR, sedação e SpO₂.', true),
  m('a-buscopan', 'analgesia', 'Antiespasmódicos', 'Butilescopolamina 20 mg/mL', '20 mg (1 mL)', 'EV', '8/8h S.N.', 'Dor abdominal em cólica. Administrar lentamente.'),
  m('a-buscopan-comp', 'analgesia', 'Antiespasmódicos', 'Butilescopolamina 4 mg + dipirona 500 mg/mL', '1 ampola (5 mL)', 'EV', '8/8h S.N.', 'Administrar lentamente.'),
  m('a-gabapentina', 'analgesia', 'Dor neuropática', 'Gabapentina 300 mg', '300 mg', 'VO', '8/8h', 'Dor neuropática. Ajustar em insuficiência renal; pode causar sonolência.'),

  // ───────────── 5 · SINTOMÁTICOS ─────────────
  // Antitérmicos e Analgésicos Sintomáticos (Paracetamol e Dipirona)
  m('s-paracetamol-750-vo', 'sintomaticos', 'Antitérmicos e analgésicos', 'Paracetamol 750 mg comprimido', '750 mg (1 comprimido)', 'VO', '6/6h S.N.', 'Se dor ou febre (Tax ≥ 37,8 °C). Máx. 3 g/dia (2 g/dia em hepatopatas ou etilistas). Tylenol.'),
  m('s-paracetamol-500-vo', 'sintomaticos', 'Antitérmicos e analgésicos', 'Paracetamol 500 mg comprimido', '500 mg (1 comprimido)', 'VO', '6/6h S.N.', 'Se dor ou febre (Tax ≥ 37,8 °C). Tylenol.'),
  m('s-paracetamol-gts', 'sintomaticos', 'Antitérmicos e analgésicos', 'Paracetamol 200 mg/mL solução oral (Gotas)', '40 a 50 gotas', 'VO', '6/6h S.N.', 'Se dor ou febre (Tax ≥ 37,8 °C). 1 gota/kg até máx. 50 gotas. Tylenol gotas.'),
  m('s-paracetamol-ev', 'sintomaticos', 'Antitérmicos e analgésicos', 'Paracetamol 10 mg/mL solução para infusão (EV)', '1 g (100 mL)', 'EV', '6/6h S.N.', 'Infundir em 15 min se febre ou dor. Máx. 4 g/dia.'),
  m('s-dipirona-ev', 'sintomaticos', 'Antitérmicos e analgésicos', 'Dipirona sódica 500 mg/mL', '1 g (2 mL)', 'EV', '6/6h S.N.', 'Infundir lentamente se Tax ≥ 37,8 °C ou dor.'),
  m('s-dipirona-vo', 'sintomaticos', 'Antitérmicos e analgésicos', 'Dipirona sódica 500 mg comprimido', '1 g (2 comprimidos)', 'VO', '6/6h S.N.', 'Se dor ou febre (Tax ≥ 37,8 °C).'),

  // Antiespasmódicos (Escopolamina / Butilescopolamina / Buscopan)
  m('s-escopolamina-ev', 'sintomaticos', 'Antiespasmódicos', 'Escopolamina / Buscopan (Butilescopolamina) 20 mg/mL', '20 mg (1 ampola de 1 mL)', 'EV', '8/8h S.N.', 'Se dor abdominal em cólica ou espasmos. Diluir em 10 a 20 mL de AD/SF e infundir lentamente.'),
  m('s-escopolamina-comp-ev', 'sintomaticos', 'Antiespasmódicos', 'Escopolamina Composta (Butilescopolamina 20 mg + Dipirona 2,5 g)', '1 ampola (5 mL)', 'EV', '8/8h S.N.', 'Buscopan Composto injetável. Diluir em 100 mL de SF 0,9% e infundir lentamente se dor em cólica moderada/intensa.'),
  m('s-escopolamina-vo', 'sintomaticos', 'Antiespasmódicos', 'Escopolamina / Buscopan (Butilescopolamina) 10 mg drágea', '1 a 2 drágeas (10 a 20 mg)', 'VO', '8/8h S.N.', 'Se dor ou cólica abdominal espástica.'),
  m('s-escopolamina-comp-vo', 'sintomaticos', 'Antiespasmódicos', 'Escopolamina Composta (Butilescopolamina 10 mg + Dipirona 250 mg drágea)', '1 a 2 drágeas', 'VO', '8/8h S.N.', 'Buscopan Composto drágeas. Se dor abdominal espástica.'),
  m('s-escopolamina-gts', 'sintomaticos', 'Antiespasmódicos', 'Escopolamina / Buscopan (Butilescopolamina) 10 mg/mL gotas', '20 a 40 gotas', 'VO', '8/8h S.N.', 'Se cólicas gastrointestinais ou biliares.'),

  // Antieméticos
  m('o-plasil-fixo', 'sintomaticos', 'Antieméticos', 'Plasil (Metoclopramida) 10 mg', '1 ampola', 'EV', '8/8h', 'Infundir lentamente.'),
  m('o-ondansetrona', 'sintomaticos', 'Antieméticos', 'Ondansetrona 2 mg/mL', '4 mg (2 mL)', 'EV', '8/8h S.N.', 'Se náuseas ou vômitos. Infundir lentamente (≥ 30 s).'),
  m('o-metoclopramida', 'sintomaticos', 'Antieméticos', 'Metoclopramida 5 mg/mL', '10 mg (1 ampola)', 'EV', '8/8h S.N.', 'Se náuseas ou vômitos. Infundir lentamente.'),
  m('o-bromoprida', 'sintomaticos', 'Antieméticos', 'Bromoprida 5 mg/mL', '10 mg (1 ampola)', 'EV', '8/8h S.N.', 'Se náuseas ou vômitos. Infundir lentamente.'),
  m('o-nbz-berotec-atrovent', 'sintomaticos', 'Broncodilatadores', 'NBZ: Berotec 10 gts + Atrovent 20 gts + SF 0,9% 5 mL', '5 mL', 'NBZ', '4/4h S.N.', 'Se broncoespasmo ou dispneia.'),
  m('o-bricanyl', 'sintomaticos', 'Broncodilatadores', 'Bricanyl (Terbutalina) 0,5 mg/mL', '½ ampola', 'SC', '8/8h ACM', 'Broncoespasmo refratário. Monitorar FC.'),
  m('o-salbutamol', 'sintomaticos', 'Broncodilatadores', 'Salbutamol spray 100 mcg/dose', '4 jatos (com espaçador)', 'Inalatória', '6/6h S.N.', 'Se falta de ar ou sibilos.'),
  m('o-berotec', 'sintomaticos', 'Broncodilatadores', 'Fenoterol 5 mg/mL + ipratrópio 0,25 mg/mL', 'Fenoterol 10 gts + ipratrópio 20 gts + SF 0,9% 5 mL', 'NBZ', '6/6h S.N.', 'Oxigênio ou ar comprimido a 6 L/min. Monitorar FC.'),
  m('o-simeticona', 'sintomaticos', 'Gastrointestinais', 'Simeticona 125 mg comprimido', '1 comprimido', 'VO', '6/6h S.N.', 'Se gases ou distensão abdominal.'),
  m('o-lactulose', 'sintomaticos', 'Laxativos', 'Lactulose 667 mg/mL', '15 mL', 'VO', '12/12h', 'Ajustar ao ritmo intestinal (meta: 2–3 evacuações pastosas/dia).'),
  m('o-bisacodil', 'sintomaticos', 'Laxativos', 'Bisacodil 5 mg comprimido', '10 mg (2 comprimidos)', 'VO', 'À noite S.N.', 'Se constipação (> 48 h sem evacuar).'),
  m('o-clister', 'sintomaticos', 'Laxativos', 'Clister glicerinado', '1 unidade', 'VR', 'ACM', 'Via retal a critério médico.'),
  m('o-glicerina', 'sintomaticos', 'Laxativos', 'Glicerina 12% supositório', '1 supositório', 'Retal', 'S.N.', 'Se constipação sem resposta aos laxativos orais.'),
  m('o-prometazina', 'sintomaticos', 'Antialérgicos', 'Prometazina 25 mg/mL', '1 ampola', 'IM', '8/8h S.N.', 'Se prurido ou reação alérgica. NÃO administrar EV.'),
  m('o-dexclor', 'sintomaticos', 'Antialérgicos', 'Dexclorfeniramina 2 mg', '2 mg', 'VO', '8/8h S.N.', 'Causa sonolência.'),
  m('o-loratadina', 'sintomaticos', 'Antialérgicos', 'Loratadina 10 mg', '10 mg', 'VO', '1x/dia', 'Se prurido ou rinite alérgica.'),

  // ───────────── 6 · PROFILAXIAS ─────────────
  m('u-omep-20-ev', 'profilaxias', 'Profilaxia de úlcera', 'Omeprazol 20 mg', '20 mg', 'EV', 'Em jejum 1x/dia', 'Administrar em jejum pela manhã.'),
  m('u-omep-ev', 'profilaxias', 'Profilaxia de úlcera', 'Omeprazol 40 mg pó liofilizado', '40 mg', 'EV', 'Em jejum 1x/dia', 'Em jejum. Diluir em 100 mL de SF 0,9% e infundir em 20–30 min.'),
  m('u-omep-vo', 'profilaxias', 'Profilaxia de úlcera', 'Omeprazol 20 mg cápsula', '20 mg', 'VO', 'Em jejum 1x/dia', 'Em jejum, 30 min antes do café da manhã.'),
  m('u-panto-ev', 'profilaxias', 'Profilaxia de úlcera', 'Pantoprazol 40 mg pó liofilizado', '40 mg', 'EV', 'Em jejum 1x/dia', 'Diluir em 100 mL de SF 0,9% e infundir em 15 min.'),
  m('u-panto-vo', 'profilaxias', 'Profilaxia de úlcera', 'Pantoprazol 40 mg comprimido', '40 mg', 'VO', 'Em jejum 1x/dia', 'Em jejum.'),
  m('u-esomep-ev', 'profilaxias', 'Profilaxia de úlcera', 'Esomeprazol 40 mg pó liofilizado', '40 mg', 'EV', '24/24h', 'Infundir em 10–30 min.'),
  m('u-sucralfato', 'profilaxias', 'Protetores de mucosa', 'Sucralfato 1 g', '1 g', 'VO', '6/6h', '1 hora antes das refeições. Separar de outras medicações VO por 2 horas.'),
  m('t-enox40', 'profilaxias', 'Profilaxia TEV', 'Enoxaparina sódica 40 mg/0,4 mL', '40 mg (0,4 mL)', 'SC', '24/24h', 'Reduzir dose se ClCr < 30 mL/min. Monitorar plaquetas e sinais de sangramento.'),
  m('t-hnf', 'profilaxias', 'Profilaxia TEV', 'Heparina sódica não fracionada 5.000 UI/0,25 mL', '5.000 UI (0,25 mL)', 'SC', '8/8h', 'Preferir se ClCr < 30 mL/min. Monitorar plaquetas e sinais de sangramento.'),
  m('t-fonda', 'profilaxias', 'Profilaxia TEV', 'Fondaparinux sódico 2,5 mg/0,5 mL', '2,5 mg (0,5 mL)', 'SC', '24/24h', 'Contraindicado se ClCr < 30 mL/min.'),
  m('t-meias', 'profilaxias', 'Profilaxia TEV mecânica', 'Meias elásticas de compressão graduada', '', '', 'Contínuo', 'Se contraindicação à anticoagulação. Verificar integridade da pele e perfusão distal.'),
  m('t-cpi', 'profilaxias', 'Profilaxia TEV mecânica', 'Compressão pneumática intermitente', '', '', 'Contínuo', 'Se contraindicação à anticoagulação e disponibilidade do serviço.'),
  m('t-deamb', 'profilaxias', 'Profilaxia TEV mecânica', 'Deambulação precoce assistida', '', '', '3x/dia', 'Se condições clínicas permitirem.'),
  m('t-enox-plena', 'profilaxias', 'Anticoagulação plena', 'Enoxaparina sódica (dose terapêutica)', '1 mg/kg', 'SC', '12/12h', 'Calcular a dose pelo peso. Ajustar se ClCr < 30 mL/min. Monitorar plaquetas e sangramento.'),

  // ───────────── 7 · DEMAIS MEDICAÇÕES & CUIDADOS ─────────────
  // Controle glicêmico (Esquema HGT completo estilo hospitalar)
  m(
    'g-hgt-esquema-completo',
    'demais',
    'Controle glicêmico',
    'HGT de 6/6 horas e Insulina Regular SC conforme esquema: 151-200 = 2U / 201-250 = 4U / 251-300 = 6U / 301-350 = 8U / 351-400 = 10U / Se > 401 = 12U e comunicar. Se HGT < 70 GH 50% 40 mL EV',
    'Conforme HGT',
    'SC',
    '6/6h',
    ''
  ),
  m('g-hgt-6', 'demais', 'Controle glicêmico', 'Glicemia capilar (HGT)', '', '', '6/6h', 'Registrar em prontuário. Comunicar HGT < 70 ou > 300 mg/dL.'),
  m('g-hgt-ac', 'demais', 'Controle glicêmico', 'Glicemia capilar (HGT) antes das refeições e ao deitar', '', '', '4x/dia', 'Registrar em prontuário. Comunicar HGT < 70 ou > 300 mg/dL.'),
  m('g-hgt-3', 'demais', 'Controle glicêmico', 'Glicemia capilar (HGT)', '', '', '4/4h', 'Se dieta zero, nutrição enteral contínua ou instabilidade glicêmica.'),
  m('g-insulina-reg', 'demais', 'Controle glicêmico', 'Insulina humana regular 100 UI/mL — esquema de correção', 'Conforme HGT', 'SC', 'Conforme esquema de HGT', '151–200: 2 UI | 201–250: 4 UI | 251–300: 6 UI | 301–350: 8 UI | 351–400: 10 UI | > 400: 12 UI e comunicar médico.'),
  m('g-insulina-nph', 'demais', 'Controle glicêmico', 'Insulina humana NPH 100 UI/mL', '10 UI', 'SC', '12/12h', 'Dose inicial de exemplo; ajustar ao peso, dieta e glicemias.'),
  m('g-glicose50', 'demais', 'Controle glicêmico', 'Glicose 50% (GH 50%)', '40 mL', 'EV', 'S.N. se HGT < 70 mg/dL', 'Repetir HGT em 15 min e comunicar médico.'),
  m('g-glucagon', 'demais', 'Controle glicêmico', 'Glucagon 1 mg', '1 mg', 'IM', 'S.N.', 'Hipoglicemia grave sem acesso venoso periférico.'),

  // Cuidados de enfermagem e posicionamento
  m('h-cabeceira', 'demais', 'Cuidados de enfermagem', 'Cabeceira elevada 30–45°', '', '', 'Contínuo', 'Prevenção de broncoaspiração.'),
  m('h-decubito', 'demais', 'Cuidados de enfermagem', 'Mudança de decúbito', '', '', '2/2h', 'Prevenção de lesão por pressão em pacientes acamados.'),
  m('h-repouso', 'demais', 'Cuidados de enfermagem', 'Repouso relativo no leito', '', '', 'Contínuo', 'Com grades elevadas.'),
  m('h-deambulacao', 'demais', 'Cuidados de enfermagem', 'Deambulação assistida', '', '', '3x/dia', 'Com auxílio da equipe de enfermagem/fisioterapia.'),
  m('h-ssvv', 'demais', 'Sinais vitais', 'SV (Sinais Vitais: PA, FC, FR, Tax e SpO₂)', '', '', '6/6h', 'Registrar em prontuário.'),
  m('h-ssvv-4', 'demais', 'Sinais vitais', 'SV (Sinais Vitais: PA, FC, FR, Tax e SpO₂)', '', '', '4/4h', 'Registrar em prontuário.'),
  m('h-diurese', 'demais', 'Monitorização', 'Controle de diurese e balanço hídrico', '', '', '24/24h', 'Comunicar diurese < 0,5 mL/kg/h.'),
  m('h-comunicar', 'demais', 'Sinais de alerta', 'Comunicar médico se alteração de sinais vitais', '', '', 'S.N.', 'Se PAS < 90 ou > 180 mmHg, FC < 50 ou > 120 bpm, FR > 24 irpm, Tax ≥ 37,8 °C, SpO₂ < 92%, dor intensa.'),
  m('h-o2-3l', 'demais', 'Oxigenoterapia', 'O2 suplementar a 3 L/min', '3 L/min', 'Inalatória', 'S.N. se SpO₂ < 92%', 'Cateter nasal.'),
  m('h-o2', 'demais', 'Oxigenoterapia', 'Oxigênio suplementar por cateter nasal', '2–3 L/min', 'Inalatória', 'S.N. se SpO₂ < 92%', 'Meta 88–92% em pacientes com DPOC.'),
  m('h-avp', 'demais', 'Cuidados de enfermagem', 'Manter acesso venoso periférico salinizado', '', '', 'Contínuo', 'Salinizar com SF 0,9% 10 mL após cada medicação EV.'),
  m('h-lpp', 'demais', 'Cuidados de enfermagem', 'Prevenção de lesão por pressão', '', '', 'Contínuo', 'Avaliar escala de Braden; hidratar a pele.'),
  m('h-higiene', 'demais', 'Cuidados de enfermagem', 'Higiene e conforto (banho no leito se necessário)', '', '', '24/24h', ''),
  m('h-fisio', 'demais', 'Cuidados de enfermagem', 'Fisioterapia respiratória e motora', '', '', '2x/dia', ''),
  m('h-restricao', 'demais', 'Cuidados de enfermagem', 'Restrição hídrica', '1.000 mL/dia', 'VO', 'Contínuo', 'Incluir todos os líquidos.'),

  // Corticoides
  m('o-hidrocortisona', 'demais', 'Corticoides', 'Hidrocortisona 100 mg', '100 mg', 'EV', '8/8h', 'Reavaliar necessidade diariamente.'),
  m('o-dexa', 'demais', 'Corticoides', 'Dexametasona 4 mg/mL', '4 mg', 'EV', '12/12h', 'Reavaliar necessidade diariamente. Monitorar glicemia.'),
  m('o-pred', 'demais', 'Corticoides', 'Prednisona 20 mg comprimido', '40 mg (2 comprimidos)', 'VO', '1x/dia', 'Pela manhã. Monitorar glicemia.'),

  // Cardiovasculares, anti-hipertensivos, diuréticos e antiarrítmicos
  m('o-captopril-50-sl', 'demais', 'Cardiovasculares e diuréticos', 'Captopril 50 mg SE PA > 170x90 mmHg', '50 mg', 'SL', 'S.N. se PA > 170x90 mmHg', ''),
  m('o-captopril-25-sl', 'demais', 'Cardiovasculares e diuréticos', 'Captopril 25 mg SE PA > 170x90 mmHg', '25 mg', 'SL', 'S.N. se PA > 170x90 mmHg', ''),
  m('o-furosemida-acm', 'demais', 'Cardiovasculares e diuréticos', 'Furosemida 20 mg (1 ampola)', '1 ampola', 'EV', 'ACM', 'A critério médico.'),
  m('o-furosemida', 'demais', 'Cardiovasculares e diuréticos', 'Furosemida 10 mg/mL', '40 mg (2 ampolas)', 'EV', '12/12h', 'Avaliar balanço hídrico, eletrólitos e função renal.'),
  m('o-amiodarona-ataque', 'demais', 'Cardiovasculares e diuréticos', 'Amiodarona: ataque: Em média 5 mg/kg em 250 mL de SG 5%, administrados por 20 min a 2 horas. Pode ser repetido 2 a 3x em 24h', '5 mg/kg', 'EV', 'ACM', ''),
  m('o-amiodarona-manut', 'demais', 'Cardiovasculares e diuréticos', 'Amiodarona Dose de manutenção: 10 a 20 mg/kg/dia (600 a 800 mg/24h, até 1200 mg/24h) em 250 mL de SG 5% por 5 dias', '600-800 mg', 'EV', 'Em 24h', ''),
  m('o-espironolactona', 'demais', 'Cardiovasculares e diuréticos', 'Espironolactona 25 mg', '25 mg', 'VO', '1x/dia', 'Monitorar potássio e creatinina.'),
  m('o-hctz', 'demais', 'Cardiovasculares e diuréticos', 'Hidroclorotiazida 25 mg', '25 mg', 'VO', '1x/dia', 'Pela manhã. Monitorar sódio e potássio.'),
  m('o-captopril', 'demais', 'Cardiovasculares e diuréticos', 'Captopril 25 mg', '25 mg', 'VO', '8/8h', 'Suspender se hipotensão, hipercalemia ou piora da função renal.'),
  m('o-losartana', 'demais', 'Cardiovasculares e diuréticos', 'Losartana potássica 50 mg', '50 mg', 'VO', '12/12h', 'Suspender se hipotensão, hipercalemia ou piora da função renal.'),
  m('o-anlodipino', 'demais', 'Cardiovasculares e diuréticos', 'Besilato de anlodipino 5 mg', '5 mg', 'VO', '1x/dia', ''),
  m('o-atenolol', 'demais', 'Cardiovasculares e diuréticos', 'Atenolol 50 mg', '50 mg', 'VO', '1x/dia', 'Suspender se FC < 50 bpm ou PAS < 100 mmHg.'),
  m('o-carvedilol', 'demais', 'Cardiovasculares e diuréticos', 'Carvedilol 6,25 mg', '6,25 mg', 'VO', '12/12h', 'Administrar com alimento. Suspender se FC < 50 bpm ou PAS < 100 mmHg.'),
  m('o-aas', 'demais', 'Cardiovasculares e diuréticos', 'Ácido acetilsalicílico 100 mg', '100 mg', 'VO', '1x/dia', 'Após o almoço.'),
  m('o-clopidogrel', 'demais', 'Cardiovasculares e diuréticos', 'Clopidogrel 75 mg', '75 mg', 'VO', '1x/dia', ''),
  m('o-sinvastatina', 'demais', 'Cardiovasculares e diuréticos', 'Sinvastatina 20 mg', '20 mg', 'VO', 'À noite ao deitar', ''),
  m('o-atorvastatina', 'demais', 'Cardiovasculares e diuréticos', 'Atorvastatina 40 mg', '40 mg', 'VO', 'À noite ao deitar', ''),
  m('o-isordil', 'demais', 'Cardiovasculares e diuréticos', 'Dinitrato de isossorbida 5 mg sublingual', '5 mg', 'SL', 'S.N.', 'Se dor precordial. Realizar ECG e comunicar médico.'),

  // Sedação / Ansiedade / Neurológicos
  m('s-haldol-prometazina', 'demais', 'Sedação e conforto', 'Haldol 1 ampola + Prometazina 1 ampola', '1 + 1 amp', 'IM', 'ACM', 'Se agitação psicomotora intensa.', true),
  m('s-haloperidol', 'demais', 'Sedação e conforto', 'Haloperidol 5 mg/mL', '1 ampola (5 mg)', 'IM', 'ACM', 'Se agitação intensa. Atenção ao QTc.', true),
  m('s-midazolam', 'demais', 'Sedação e conforto', 'Midazolam 5 mg/mL', '5 mg (1 mL)', 'IM', 'ACM', 'Se crise convulsiva/agitação. Monitorar FR e SpO₂.', true),
  m('s-diazepam', 'demais', 'Sedação e conforto', 'Diazepam 5 mg comprimido', '5 mg', 'VO', 'À noite S.N. se insônia', 'Cautela em idosos e hepatopatas.', true),
  m('s-clonazepam', 'demais', 'Sedação e conforto', 'Clonazepam 0,5 mg comprimido', '0,5 mg', 'VO', 'À noite S.N. se insônia', 'Cautela em idosos.', true),
  m('s-quetiapina', 'demais', 'Sedação e conforto', 'Quetiapina 25 mg comprimido', '25 mg', 'VO', 'À noite S.N. se insônia', 'Pode causar hipotensão ortostática.', true),
  m('s-melatonina', 'demais', 'Sedação e conforto', 'Melatonina 3 mg', '3 mg', 'VO', 'À noite S.N. se insônia', '30 min antes de dormir.'),
  m('o-fenitoina', 'demais', 'Neurológicos', 'Fenitoína 100 mg', '100 mg', 'VO', '8/8h', 'Manutenção anticonvulsivante. Monitorar nível sérico.'),
  m('o-fenobarbital', 'demais', 'Neurológicos', 'Fenobarbital 100 mg', '100 mg', 'VO', '12/12h', 'Manutenção anticonvulsivante. Observar sedação.', true),
  m('o-levetiracetam', 'demais', 'Neurológicos', 'Levetiracetam 500 mg', '500 mg', 'VO', '12/12h', 'Ajustar à função renal.'),

  // Eletrólitos e vitaminas
  m('o-kcl', 'demais', 'Eletrólitos e vitaminas', 'Reposição de potássio: KCl 19,1% 10 mL em 500 mL de SF 0,9%', '500 mL', 'EV', 'Dose única', 'Infundir em 4–6 h. NUNCA administrar KCl puro ou em bolus. Dosar K⁺ em 6–12 h e ajustar à função renal.'),
  m('o-gluconato-ca', 'demais', 'Eletrólitos e vitaminas', 'Gluconato de cálcio 10%', '10 mL (1 g) em 100 mL de SG 5%', 'EV', 'Dose única', 'Infundir em 20–30 min. Não misturar com bicarbonato ou fosfato.'),
  m('o-mgso4', 'demais', 'Eletrólitos e vitaminas', 'Sulfato de magnésio 50%', '2 mL (1 g) em 100 mL de SG 5%', 'EV', 'Dose única', 'Infundir em 60 min. Monitorar reflexos e FR; ajustar à função renal.'),
  m('o-tiamina', 'demais', 'Eletrólitos e vitaminas', 'Tiamina (vitamina B1) 300 mg', '300 mg', 'VO', '1x/dia', 'Etilistas, desnutridos ou antes de infusão de glicose em risco de Wernicke.'),
  m('o-acido-folico', 'demais', 'Eletrólitos e vitaminas', 'Ácido fólico 5 mg', '5 mg', 'VO', '1x/dia', ''),
  m('o-sulfato-ferroso', 'demais', 'Eletrólitos e vitaminas', 'Sulfato ferroso 40 mg de ferro elementar', '40 mg', 'VO', '1x/dia', 'Longe das refeições. Pode escurecer as fezes.'),

  // Emergências e intercorrências
  m('o-adrenalina', 'demais', 'Emergências e intercorrências', 'Adrenalina 1 mg/mL', '0,5 mg (0,5 mL)', 'IM', 'Se necessário (anafilaxia)', 'Face lateral da coxa; pode repetir em 5–15 min. Acionar médico imediatamente.'),
  m('o-naloxona', 'demais', 'Emergências e intercorrências', 'Naloxona 0,4 mg/mL', '0,4 mg (1 mL)', 'EV', 'Se necessário (depressão respiratória/intoxicação opioide)', 'FR < 8 irpm ou sonolência excessiva. Acionar médico.')
];

/**
 * Normaliza texto para busca (sem acentos e minúsculo).
 */
function normalize(str: string): string {
  return (str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/**
 * Busca medicamentos/prescrições hospitalares dentro de uma categoria.
 */
export function searchHospitalMedications(category: FastHugCategory, query: string): HospitalMedication[] {
  const q = normalize(query);
  const pool = HOSPITAL_MEDICATIONS.filter(med => med.category === category);
  if (!q) return pool;
  return pool.filter(med =>
    normalize(med.name).includes(q) ||
    normalize(med.group).includes(q) ||
    normalize(med.notes || '').includes(q)
  );
}

let itemCounter = 0;
export function newInpatientItemId(): string {
  itemCounter += 1;
  return `inp-${Date.now()}-${itemCounter}-${Math.random().toString(36).slice(2, 6)}`;
}

/**
 * Converte um item do banco em um item editável da prescrição.
 */
export function medicationToInpatientItem(med: HospitalMedication): InpatientItem {
  return {
    id: newInpatientItemId(),
    category: med.category,
    name: med.name,
    dose: med.dose,
    route: med.route,
    frequency: med.frequency,
    schedule: med.schedule || '',
    notes: med.notes,
    controlled: med.controlled
  };
}

/**
 * Modelo padrão de prescrição de internação na ordem hospitalar solicitada:
 * 1. Dieta -> 2. Hidratação -> 3. Antibióticos -> 4. Analgesia -> 5. Sintomáticos -> 6. Profilaxias -> 7. Demais
 */
const DEFAULT_TEMPLATE_IDS = [
  'f-dieta-geral',            // 1. Dieta
  'f-hid-sf1000-24h',         // 2. Hidratação
  'o-ceftriaxona',            // 3. Antibióticos (Ceftriaxona editável)
  'a-dipirona-ev-4h',         // 4. Analgesia (Dipirona 1g EV 4/4h S.N.)
  'a-tramadol-100',           // 4. Analgesia (Tramadol 100mg + SF 0,9% 100mL EV 8/8h S.N.)
  'o-plasil-fixo',            // 5. Sintomáticos (Plasil 1 amp EV 8/8h)
  'o-nbz-berotec-atrovent',   // 5. Sintomáticos (NBZ Berotec + Atrovent + SF 0,9% 5mL 4/4h S.N.)
  'u-omep-20-ev',             // 6. Profilaxias (Omeprazol 20mg EV em jejum 1x/dia)
  't-enox40',                 // 6. Profilaxias (Enoxaparina 40mg SC 24/24h)
  'g-hgt-esquema-completo',   // 7. Demais (HGT 6/6h + Insulina Regular conforme esquema + Se HGT < 70 GH 50% 40mL)
  'o-captopril-50-sl',        // 7. Demais (Captopril 50mg SL se PA > 170x90mmHg)
  'h-o2-3l',                  // 7. Demais (O2 suplementar a 3L/min)
  'h-cabeceira',              // 7. Demais (Cabeceira elevada 30-45°)
  'h-ssvv'                    // 7. Demais (SV de 6/6h)
];

export function buildDefaultFastHugTemplate(): InpatientItem[] {
  return DEFAULT_TEMPLATE_IDS
    .map(id => HOSPITAL_MEDICATIONS.find(med => med.id === id))
    .filter((med): med is HospitalMedication => !!med)
    .map(medicationToInpatientItem);
}

/**
 * Modelo idêntico à folha de prescrição médica hospitalar de enfermaria (Scribd):
 * Contém exatamente os itens da folha real com destaque S.N. e ACM.
 */
export function buildScribdImageTemplate(): InpatientItem[] {
  return [
    {
      id: newInpatientItemId(),
      category: 'dieta',
      name: 'DIETA',
      dose: '',
      route: '',
      frequency: '',
      notes: ''
    },
    {
      id: newInpatientItemId(),
      category: 'analgesia',
      name: 'DIPIRONA 1G EV DE 4/4H S.N.',
      dose: '',
      route: '',
      frequency: '',
      notes: ''
    },
    {
      id: newInpatientItemId(),
      category: 'profilaxias',
      name: 'OMEPRAZOL 20MG EV EM JEJUM 1X/DIA',
      dose: 'G',
      route: '',
      frequency: '',
      notes: ''
    },
    {
      id: newInpatientItemId(),
      category: 'analgesia',
      name: 'TRAMADOL 100MG + SF0,9%100ML EV DE 8/8H S.N.',
      dose: '',
      route: '',
      frequency: '',
      notes: ''
    },
    {
      id: newInpatientItemId(),
      category: 'demais',
      name: 'HGT de 6/6 horas e Insulina Regular SC conforme esquema: 151- 200 = 2U / 201-250 = 4U / 251-300 = 6U / 301-350 = 8U / 351-350 = 8U / 351-400 = 10U / Se>401 = 12U e comunicar. Se HGT < 70 GH 50% 40ML',
      dose: '',
      route: '',
      frequency: '',
      notes: ''
    },
    {
      id: newInpatientItemId(),
      category: 'demais',
      name: '',
      dose: '',
      route: '',
      frequency: '',
      notes: ''
    },
    {
      id: newInpatientItemId(),
      category: 'demais',
      name: 'CAPTOPRIL 50 MG SL SE PA > 170X90mmHg',
      dose: '',
      route: '',
      frequency: '',
      notes: ''
    },
    {
      id: newInpatientItemId(),
      category: 'demais',
      name: 'HIDROCORTISONA 100MG EV DE 8/8H',
      dose: '',
      route: '',
      frequency: '',
      notes: ''
    },
    {
      id: newInpatientItemId(),
      category: 'sintomaticos',
      name: 'NBZ : BEROTEC 10 GTS+ ATROVENT + SF0,9%5ML DE 4/4H S.N.',
      dose: '',
      route: '',
      frequency: '',
      notes: ''
    },
    {
      id: newInpatientItemId(),
      category: 'sintomaticos',
      name: 'BRICANYL ½ AMP SC DE 8/8H ACM',
      dose: '',
      route: '',
      frequency: '',
      notes: ''
    },
    {
      id: newInpatientItemId(),
      category: 'sintomaticos',
      name: 'PLASIL 1 AMPOLA EV DE 8/8H',
      dose: '',
      route: '',
      frequency: '',
      notes: ''
    },
    {
      id: newInpatientItemId(),
      category: 'demais',
      name: 'HALDOL 1 AMPOLA + PROMETAZINA 1 AMPOLA IM ACM',
      dose: '',
      route: '',
      frequency: '',
      notes: '',
      controlled: true
    },
    {
      id: newInpatientItemId(),
      category: 'demais',
      name: 'FUROSEMIDA 1 AMPOLA EV ACM',
      dose: '',
      route: '',
      frequency: '',
      notes: ''
    },
    {
      id: newInpatientItemId(),
      category: 'demais',
      name: 'O2 SUPLEMENTAR A 3L/MIN',
      dose: '',
      route: '',
      frequency: '',
      notes: ''
    },
    {
      id: newInpatientItemId(),
      category: 'sintomaticos',
      name: 'CLISTER GLICERINADO VR ACM',
      dose: '',
      route: '',
      frequency: '',
      notes: ''
    },
    {
      id: newInpatientItemId(),
      category: 'hidratacao',
      name: 'SF 0,9% 1000ML EV EM 24H',
      dose: '',
      route: '',
      frequency: '',
      notes: ''
    },
    {
      id: newInpatientItemId(),
      category: 'demais',
      name: 'SV DE 6/6H',
      dose: '',
      route: '',
      frequency: '',
      notes: ''
    },
    {
      id: newInpatientItemId(),
      category: 'demais',
      name: 'AMIODARONA: ataque: Em média 5 mg/kg em 250 ml de solução de glicose a 5%, administrados por um período de 20 minutos a 2 horas. Pode ser repetido de 2 a 3 vezes por um período de 24 horas. ACM',
      dose: '',
      route: '',
      frequency: '',
      notes: ''
    },
    {
      id: newInpatientItemId(),
      category: 'demais',
      name: 'AMIODARONA Dose de manutenção: 10 a 20 mg/kg/dia (em média 600 a 800 mg/24 h até 1200 mg/24 h) em 250 ml de SG 5% por 5 dias. ACM',
      dose: '',
      route: '',
      frequency: '',
      notes: ''
    }
  ];
}

export function buildInitialInpatientInfo(): InpatientInfo {
  const today = getTodayIso();
  return {
    ward: 'Enfermaria Clínica',
    bed: '',
    admissionDate: today,
    prescriptionDate: today,
    diagnosis: '',
    allergies: ''
  };
}
