import { DoctorProfile, PatientInfo, AtestadoData, DeclaracaoData, PrescriptionItem, AihData, ApacData } from '../types';
import { getTodayIso, addDaysIso } from '../utils/dateUtils';

export const DEFAULT_DOCTOR_PROFILE: DoctorProfile = {
  fullName: 'Dr. Carlos Eduardo Mendonça',
  crm: '148.920',
  cpf: '',
  cns: '',
  documentType: 'CPF',
  uf: 'PA',
  specialty: 'Clínica Médica & Emergências Pediátricas',
  rqe: 'RQE nº 54.892',
  phone: '(91) 98765-4321',
  email: 'medico@ordemterceira.org.br',
  clinicName: 'Hospital Ordem Terceira',
  razaoSocial: 'Venerável Ordem Terceira de São Francisco',
  cnpj: '04.935.409/0002-31',
  clinicAddress: 'Rua Cezarino Doce, nº 10, Centro',
  clinicCityState: 'Santa Maria do Pará - PA',
  clinicCep: '68738-000',
  clinicPhone: '(91) 8814-1247',
  signatureStyle: 'classic_stamp'
};

export const DEMO_PRESET_PROFILES: { name: string; profile: DoctorProfile }[] = [
  {
    name: 'Hospital Ordem Terceira (Santa Maria do Pará)',
    profile: DEFAULT_DOCTOR_PROFILE
  },
  {
    name: 'Dra. Camila Ramos Ribeiro (Pediatria - Ordem Terceira)',
    profile: {
      fullName: 'Dra. Camila Ramos Ribeiro',
      crm: '89.412',
      uf: 'PA',
      specialty: 'Pediatria e Terapia Intensiva Pediátrica',
      rqe: 'RQE nº 32.145',
      phone: '(91) 99887-1234',
      email: 'dra.camila@ordemterceira.org.br',
      clinicName: 'Hospital Ordem Terceira',
      razaoSocial: 'Venerável Ordem Terceira de São Francisco',
      cnpj: '04.935.409/0002-31',
      clinicAddress: 'Rua Cezarino Doce, nº 10, Centro',
      clinicCityState: 'Santa Maria do Pará - PA',
      clinicCep: '68738-000',
      clinicPhone: '(91) 8814-1247',
      signatureStyle: 'classic_stamp'
    }
  },
  {
    name: 'Ambulatório & Pronto Atendimento (Ordem Terceira)',
    profile: {
      fullName: 'Dr. Rodrigo Barata Vasconcelos',
      crm: '112.450',
      uf: 'PA',
      specialty: 'Medicina de Família e Comunidade & Urgências',
      rqe: 'RQE nº 41.200',
      phone: '(91) 98112-3344',
      email: 'plantao.santamaria@ordemterceira.org.br',
      clinicName: 'Hospital Ordem Terceira',
      razaoSocial: 'Venerável Ordem Terceira de São Francisco',
      cnpj: '04.935.409/0002-31',
      clinicAddress: 'Rua Cezarino Doce, nº 10, Centro',
      clinicCityState: 'Santa Maria do Pará - PA',
      clinicCep: '68738-000',
      clinicPhone: '(91) 8814-1247',
      signatureStyle: 'classic_stamp'
    }
  }
];

export const INITIAL_PATIENT: PatientInfo = {
  name: '',
  document: '',
  cns: '',
  age: '',
  birthDate: '',
  weight: '',
  height: '',
  gender: '',
  address: '',
  bed: '',
  ward: ''
};

export const INITIAL_PRESCRIPTION_ITEMS: PrescriptionItem[] = [
  {
    id: 'init-1',
    medicationName: 'Dipirona Monoidratada 500mg',
    presentation: '500mg - Comprimidos (caixa com 20)',
    quantity: '1 caixa',
    route: 'Uso oral',
    posology: 'Tomar 1 comprimido por via oral a cada 6 horas em caso de dor ou febre (máx. 4 comprimidos ao dia).',
    instructions: 'Ingerir com bastante água.',
    type: 'simples'
  },
  {
    id: 'init-2',
    medicationName: 'Amoxicilina + Clavulanato 875mg + 125mg',
    presentation: '875mg + 125mg - Comprimidos (caixa com 14)',
    quantity: '1 caixa',
    route: 'Uso oral',
    posology: 'Tomar 1 comprimido por via oral de 12 em 12 horas durante 7 dias consecutivos.',
    instructions: 'Ingerir no início da refeição para evitar desconforto gástrico. Não interromper o ciclo.',
    type: 'antimicrobiano'
  }
];

export const INITIAL_ATESTADO: AtestadoData = {
  patientName: '',
  patientDoc: '',
  days: 3,
  startDate: getTodayIso(),
  endDate: addDaysIso(2),
  type: 'repouso',
  cidOption: 'com_cid',
  cidCode: 'J06.9',
  cidDescription: 'Infecção aguda das vias aéreas superiores (IVAS) não especificada',
  customText: '',
  date: getTodayIso(),
  city: 'Santa Maria do Pará - PA'
};

export const INITIAL_DECLARACAO: DeclaracaoData = {
  patientName: '',
  patientDoc: '',
  date: getTodayIso(),
  startTime: '08:30',
  endTime: '11:15',
  isAllDay: false,
  purpose: 'realização de consulta médica eletiva e exames laboratoriais complementares',
  isAcompanhante: false,
  city: 'Santa Maria do Pará - PA'
};

const DOCTOR_STORAGE_KEY = 'ordem_terceira_doctor_profile_v3';

export function loadSavedDoctorProfile(): DoctorProfile {
  try {
    const raw = localStorage.getItem(DOCTOR_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_DOCTOR_PROFILE, ...parsed };
    }
  } catch (e) {
    console.warn('Erro ao carregar perfil do médico do localStorage', e);
  }
  return DEFAULT_DOCTOR_PROFILE;
}

export const INITIAL_AIH: AihData = {
  // 1-4 Identificação do Estabelecimento de Saúde
  estabelecimentoSolicitante: 'Hospital Ordem Terceira',
  cnesSolicitante: '2332156',
  estabelecimentoExecutante: 'Hospital Ordem Terceira',
  cnesExecutante: '2332156',

  // 5-16 Identificação do Paciente
  nomePaciente: '',
  numeroProntuario: '',
  cnsPaciente: '',
  dataNascimento: '',
  sexo: '',
  nomeMaeOuResponsavel: '',
  telefoneContato: '',
  endereco: '',
  municipioResidencia: 'Santa Maria do Pará',
  codIbgeMunicipio: '150700',
  uf: 'PA',
  cep: '68738-000',

  // 17-23 Justificativa da Internação
  principaisSinaisSintomas:
    'Febre persistente (Tax 38,5°C) há 4 dias associada a tosse produtiva com expectoração mucopurulenta, dispneia aos moderados esforços e dor torácica ventilatório-dependente em hemitórax direito.',
  condicoesJustificamInternacao:
    'Pneumonia adquirida na comunidade com escore CURB-65 = 2 (hipoxemia relativa e taquipneia), necessitando de antibioticoterapia parenteral supervisionada, oxigenoterapia e vigilância clínica.',
  resultadosProvasDiagnosticas:
    'Leucocitose com desvio à esquerda (14.800 leucócitos/mm³, 8% bastões). PCR: 98 mg/L. Radiografia de tórax: consolidação alveolar em lobo médio direito sem derrame pleural evidente. SpO₂ em ar ambiente: 91%.',
  diagnosticoInicial: 'Pneumonia bacteriana adquirida na comunidade / Infecção respiratória',
  cid10Principal: 'J18.9',
  cid10Secundario: 'A49.9',
  cid10CausasAssociadas: '',

  // 24-32 Procedimento Solicitado
  descricaoProcedimentoSolicitado: 'TRATAMENTO DE PNEUMONIA OU INFECCAO RESPIRATORIA AGUDA',
  codigoProcedimento: '03.03.01.015-8',
  clinica: '01 - CLÍNICA MÉDICA',
  caraterInternacao: '02 - URGÊNCIA',
  tipoDocumentoProfissional: 'CPF',
  numeroDocumentoProfissional: '000.000.000-00',
  nomeProfissionalSolicitante: 'Dr. Carlos Eduardo Mendonça',
  dataSolicitacao: getTodayIso(),
  registroConselho: 'CRM/PA 148.920',

  // 33-42 Causas externas
  causaExterna: 'nenhuma',

  // 46-52 Autorização
  nomeProfissionalAutorizador: '',
  codOrgaoEmissor: 'SES/PA',
  tipoDocAutorizador: 'CNS',
  numDocAutorizador: '',
  dataAutorizacao: '',
  registroConselhoAutorizador: '',
  numeroAih: '',

  // Página 2: Sinais/Sintomas & Dados Vitais
  alteracaoConsciencia: 'nao',
  febre: '38,5 °C',
  desnutricao: 'Ausente',
  desidratacao: 'nao',
  pulso: '82 bpm',
  pressaoArterial: '120x80 mmHg',
  frequenciaRespiratoria: '20 irpm',
  frequenciaCardiaca: '82 bpm',

  // Página 2: Medicamentos em Uso & Motivo do Encaminhamento
  medicamentosEmUso: 'Losartana 50mg 1x/dia, Metformina 850mg 2x/dia',
  motivoEncaminhamento: 'Necessidade de suporte ventilatório, monitorização contínua e antibioticoterapia endovenosa supervisionada.',

  // Página 2: Exames Clínicos
  exameCirculatorio: 'Bulhas rítmicas normofonéticas em 2 tempos, sem sopros audíveis. Pulsos periféricos palpáveis e simétricos.',
  outrosAchadosClinicos: 'Estado geral regular, lúcido e orientado, corado, hidratado, acianótico, anictérico.',
  exameAparelhoRespiratorio: 'Murmúrio vesicular presente bilateralmente com estertores crepitantes em base pulmonar direita. Frequência: 20 irpm.',

  // Página 2: Exames Complementares
  examesLaboratoriais: 'Hemograma: Hb 13,2, Leucócitos 14.800 (8% bastões). PCR: 98 mg/L. Ureia 34, Creatinina 0,9.',
  idadeGestacional: '',
  mauFormacao: 'Não',
  ultrassom: 'ignorado',
  ultrassomObs: '',
  outrosExames: 'Gasometria arterial com SpO₂ 91% em ar ambiente.',
  radiografias: 'Rx de tórax em PA e Perfil com condensação alveolar em terço inferior direito.'
};

export const INITIAL_APAC: ApacData = {
  // IDENTIFICAÇÃO DO ESTABELECIMENTO DE SAÚDE (SOLICITANTE)
  estabelecimentoSolicitante: 'Hospital Ordem Terceira',
  cnesSolicitante: '2332156',

  // IDENTIFICAÇÃO DO PACIENTE
  nomePaciente: '',
  numeroProntuario: '',
  situacaoRua: false,
  cpfOuCns: '',
  dataNascimento: '',
  sexo: '',
  racaCor: '',
  etnia: '',
  nomeMae: '',
  telefoneCelular: '',
  nomeResponsavel: '',
  telefoneContato: '',
  endereco: '',
  municipioResidencia: 'Santa Maria do Pará',
  codIbgeMunicipio: '150700',
  uf: 'PA',
  cep: '68738-000',

  // PROCEDIMENTO SOLICITADO
  codigoProcedimentoPrincipal: '03.01.01.007-2',
  servico: '100',
  classificacao: '001',
  nomeProcedimentoPrincipal: 'CONSULTA MEDICA EM ATENCAO ESPECIALIZADA / PROCEDIMENTOS CLINICOS AMBULATORIAIS',
  quantidadePrincipal: '01',

  // PROCEDIMENTOS SECUNDÁRIOS
  procedimentosSecundarios: [
    { id: 'sec-1', codigo: '02.02.01.012-0', nome: 'DOSAGEM DE HEMOGLOBINA GLICADA', quantidade: '01' },
    { id: 'sec-2', codigo: '02.02.01.028-6', nome: 'DOSAGEM DE CREATININA', quantidade: '01' },
    { id: 'sec-3', codigo: '02.02.01.064-2', nome: 'DOSAGEM DE UREIA', quantidade: '01' }
  ],

  // DADOS DO DIAGNÓSTICO HISTOPATOLÓGICO
  dataDiagnosticoHisto: '',
  cid10Histo: '',
  descricaoDiagnosticoHisto: '',

  // JUSTIFICATIVA DO(S) PROCEDIMENTO(S) SOLICITADO(S)
  descricaoDiagnostico: 'Acompanhamento clínico ambulatorial especializado e investigação diagnóstica complementar',
  cid10Principal: 'A49.9',
  cid10Secundario: '',
  cid10CausasAssociadas: '',
  observacoes: 'Paciente em investigação diagnóstica especializada. Necessita realização de procedimentos ambulatoriais para estratificação clínica e definição terapêutica.',

  // PÁGINA 2: SOLICITAÇÃO
  nomeProfissionalSolicitante: '',
  dataSolicitacao: getTodayIso(),
  tipoDocumentoSolicitante: 'CPF',
  cnsProfissionalSolicitante: '',
  registroConselhoSolicitante: '',

  // PÁGINA 2: AUTORIZAÇÃO
  nomeProfissionalAutorizador: '',
  codOrgaoEmissor: 'SES/PA',
  numeroAutorizacaoApac: '',
  cnsProfissionalAutorizador: '',
  dataAutorizacao: '',
  registroConselhoAutorizador: '',
  periodoValidadeInicio: getTodayIso(),
  periodoValidadeFim: addDaysIso(90),

  // PÁGINA 2: IDENTIFICAÇÃO DO ESTABELECIMENTO DE SAÚDE (EXECUTANTE)
  nomeFantasiaExecutante: 'Hospital Ordem Terceira',
  cnesExecutante: '2332156'
};

export function saveDoctorProfileToStorage(profile: DoctorProfile): void {
  try {
    localStorage.setItem(DOCTOR_STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.warn('Erro ao salvar perfil do médico no localStorage', e);
  }
}
