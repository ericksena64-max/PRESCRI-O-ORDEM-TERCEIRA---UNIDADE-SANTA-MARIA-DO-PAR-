export type PrescriptionType = 'simples' | 'antimicrobiano' | 'controle_especial';

export interface Medication {
  id: string;
  name: string;
  genericName: string;
  brandName?: string;
  class: string;
  type: PrescriptionType;
  defaultRoute: string;
  defaultPresentation: string;
  availablePresentations: string[];
  defaultPosology: string;
  instructions?: string;
  controlledCategory?: string; // e.g. "Lista C1", "Lista B1"
}

export interface PrescriptionItem {
  id: string;
  medicationName: string;
  presentation: string;
  quantity: string;
  route: string;
  posology: string;
  instructions?: string;
  type: PrescriptionType;
  controlledCategory?: string;
}

export interface DoctorProfile {
  fullName: string;
  crm: string;
  cpf?: string;
  cns?: string;
  documentType?: 'CNS' | 'CPF'; // Documento preferencial fixo para laudos SUS (APAC/AIH)
  uf: string;
  specialty: string;
  rqe?: string;
  phone: string;
  email: string;
  clinicName: string;
  clinicAddress: string;
  clinicCityState: string;
  clinicCep: string;
  clinicPhone: string;
  razaoSocial?: string;
  cnpj?: string;
  cnes?: string;
  clinicLogoUrl?: string;
  digitalSignatureUrl?: string;
  signatureStyle: 'digital_drawn' | 'classic_stamp' | 'simple_line';
}

export interface DoctorAccount {
  id: string;
  fullName: string;
  crm: string;
  cpf: string;
  cns?: string;
  documentType?: 'CNS' | 'CPF';
  password: string;
  uf: string;
  specialty: string;
  rqe?: string;
  createdAt: string;
}

export interface PatientInfo {
  name: string;
  document: string; // CPF, RG ou Prontuário/Identificador
  cns?: string; // Cartão Nacional de Saúde (15 dígitos)
  age?: string;
  birthDate?: string; // Data de nascimento (YYYY-MM-DD ou DD/MM/AAAA)
  weight?: string | number; // Peso em kg
  height?: string; // Altura (ex: 1,70 m ou 170 cm)
  gender?: string;
  address?: string;
  bed?: string;
  ward?: string;
}

export interface AtestadoData {
  patientName: string;
  patientDoc: string;
  days: number;
  startDate: string;
  endDate: string;
  type: 'repouso' | 'aptidao' | 'acompanhante' | 'comparecimento_pericia' | 'personalizado';
  cidOption: 'sem_cid' | 'com_cid' | 'a_pedido_paciente';
  cidCode: string;
  cidDescription: string;
  customText?: string;
  activityType?: string; // for aptidao fisica
  date: string;
  city: string;
}

export interface DeclaracaoData {
  patientName: string;
  patientDoc: string;
  date: string;
  startTime: string;
  endTime: string;
  isAllDay: boolean;
  purpose: string;
  isAcompanhante: boolean;
  acompanhanteName?: string;
  acompanhanteDoc?: string;
  city: string;
}

export interface CidItem {
  code: string;
  description: string;
  category: string;
}

/**
 * Prescrição de Internação Hospitalar (Enfermaria)
 * Ordem clínica hospitalar padrão:
 * 1. Dieta
 * 2. Hidratação
 * 3. Antibióticos
 * 4. Analgesia
 * 5. Sintomáticos
 * 6. Profilaxias (TEV e Úlcera de Estresse)
 * 7. Demais medicações e cuidados
 */
export type InpatientCategory =
  | 'dieta'
  | 'hidratacao'
  | 'antibiotico'
  | 'analgesia'
  | 'sintomaticos'
  | 'profilaxias'
  | 'demais';

export type FastHugCategory = InpatientCategory;

export interface HospitalMedication {
  id: string;
  name: string;
  category: FastHugCategory;
  group: string; // subgrupo exibido na busca (ex.: Antibióticos, Opioides)
  dose: string;
  route: string;
  frequency: string;
  schedule?: string; // Horários sugeridos de aprazamento (ex.: 08h - 20h)
  notes?: string;
  controlled?: boolean; // medicamento sujeito a controle especial (Portaria 344/98)
}

export interface InpatientItem {
  id: string;
  category: FastHugCategory;
  name: string;
  dose: string;
  route: string;
  frequency: string;
  schedule?: string; // Horário / aprazamento específico indicado pelo médico ou enfermagem
  notes?: string;
  controlled?: boolean;
  diaAtual?: number; // Para antimicrobianos / antibióticos (ex: D1, D3)
  diaTotal?: number; // Duração programada do tratamento (ex: D7, D14)
  isAlterado?: boolean; // Destaque visual de alteração / renovação para a equipe de enfermagem
}

export interface InpatientInfo {
  ward: string; // Enfermaria / unidade
  bed: string; // Leito
  admissionDate: string; // YYYY-MM-DD
  prescriptionDate: string; // YYYY-MM-DD
  diagnosis: string; // Hipótese diagnóstica / motivo da internação
  cid?: { code: string; description: string };
  allergies: string;
}

export interface DocumentHistoryItem {
  id: string;
  createdAt: string;
  type: 'prescricao' | 'atestado' | 'declaracao' | 'internacao' | 'exames' | 'aih' | 'apac' | 'admissao' | 'evolucao';
  patientName: string;
  summary: string;
  payload: any;
}

/**
 * =========================================================================
 * MÓDULO DE PRONTUÁRIO DE INTERNAÇÃO: ADMISSÃO & EVOLUÇÃO MÉDICA DIÁRIA (SOAP)
 * =========================================================================
 */
export type OrigemAdmissao = 'pronto_socorro' | 'ambulatorio' | 'transferencia' | 'domicilio';

export interface MedicacaoReconciliada {
  id: string;
  medicamento: string;
  dose: string;
  frequencia: string;
  conduta: 'manter' | 'suspender' | 'substituir';
  motivo?: string;
}

export interface SinaisVitaisAdmissao {
  pa: string; // mmHg (ex: 120x80)
  fc: string; // bpm (ex: 80)
  fr: string; // ipm (ex: 18)
  spo2: string; // % (ex: 98)
  temp: string; // °C (ex: 36.5)
  glicemia: string; // mg/dL (ex: 110)
  glasgow: string; // 3 a 15 (ex: 15)
}

export interface ExameSegmentarAdmissao {
  geral: string;
  acv: string;
  ar: string;
  abdome: string;
  extremidadesNeuro: string;
}

export interface AvaliacaoRiscosAdmissao {
  riscoTev: 'baixo' | 'moderado' | 'alto';
  riscoQueda: 'baixo' | 'medio' | 'alto';
  riscoLpp: 'baixo' | 'moderado' | 'elevado';
}

export interface HipoteseDiagnosticaItem {
  id: string;
  cidCode?: string;
  descricao: string;
}

export interface PlanoTerapeuticoAdmissao {
  dieta: string;
  hidratacao: string;
  sintomaticos: string;
  antibioticos: string;
  examesControle: string;
  pareceres: string;
}

export interface FichaAdmissaoHospitalar {
  id: string;
  dataHoraAdmissao: string; // ISO ou YYYY-MM-DDTHH:mm
  origem: OrigemAdmissao;
  medicoAdmissao: string;
  crmAdmissao: string;

  // Anamnese
  queixaPrincipal: string;
  hda: string;
  appCheckboxes: {
    has: boolean;
    dm2: boolean;
    ic: boolean;
    drc: boolean;
    dpoc_asma: boolean;
    fa: boolean;
    ave: boolean;
    cirurgias: boolean;
  };
  appOutros: string;
  temAlergia: 'nao_relata' | 'alergico';
  alergiasDescricao: string;
  medicacoesReconciliadas: MedicacaoReconciliada[];

  // Exame Físico
  sinaisVitais: SinaisVitaisAdmissao;
  exameSegmentar: ExameSegmentarAdmissao;

  // Riscos
  riscos: AvaliacaoRiscosAdmissao;

  // Diagnóstico & Conduta
  diagnosticos: HipoteseDiagnosticaItem[];
  planoTerapeutico: PlanoTerapeuticoAdmissao;
  observacoesGerais?: string;
}

export interface BalancoHidrico24h {
  entradasMl: string; // mL
  saidasMl: string; // mL
  balancoFinalMl: string; // mL (+ ou -)
}

export interface EvolucaoSoapItem {
  id: string;
  dataHora: string; // ISO string
  medico: string;
  crm: string;
  leito: string;
  diasInternacao: number;
  sinaisVitais: SinaisVitaisAdmissao;
  balancoHidrico?: BalancoHidrico24h;
  subjetivo: string;
  objetivo: string;
  avaliacao: string;
  plano: string;
}

/**
 * LAUDO PARA SOLICITAÇÃO DE AUTORIZAÇÃO DE INTERNAÇÃO HOSPITALAR (AIH) — Anexo I (SUS)
 * Documento Oficial de 2 Páginas
 */
export interface AihData {
  // 1-4 Identificação do Estabelecimento de Saúde
  estabelecimentoSolicitante: string; // 1
  cnesSolicitante: string; // 2
  estabelecimentoExecutante: string; // 3
  cnesExecutante: string; // 4

  // 5-19 Identificação do Paciente
  nomePaciente: string; // 5
  numeroProntuario: string; // 6
  cnsPaciente: string; // 7 (Cartão Nacional de Saúde - 15 dígitos)
  dataNascimento: string; // 8 (YYYY-MM-DD)
  sexo: '1' | '3' | 'M' | 'F' | ''; // 9 (1: Masc, 3: Fem)
  racaCor?: string; // 10
  etnia?: string; // 10.1
  nomeMaeOuResponsavel: string; // 11
  telefoneContato: string; // 12
  nomeResponsavel?: string; // 13
  telefoneResponsavel?: string; // 14
  endereco: string; // 15
  municipioResidencia: string; // 16
  codIbgeMunicipio: string; // 17
  uf: string; // 18
  cep: string; // 19

  // 20-26 Justificativa da Internação
  principaisSinaisSintomas: string; // 20
  condicoesJustificamInternacao: string; // 21
  resultadosProvasDiagnosticas: string; // 22
  diagnosticoInicial: string; // 23
  cid10Principal: string; // 24
  cid10Secundario: string; // 25
  cid10CausasAssociadas: string; // 26

  // 27-35 Procedimento Solicitado
  descricaoProcedimentoSolicitado: string; // 27
  codigoProcedimento: string; // 28
  clinica: string; // 29 (ex: 01 - Clínica Médica, 02 - Cirúrgica, 03 - Obstétrica, 04 - Pediátrica)
  caraterInternacao: string; // 30 (ex: 01 - Eletivo, 02 - Urgência, 03 - Acidente no local trabalho)
  tipoDocumentoProfissional: 'CNS' | 'CPF'; // 31
  numeroDocumentoProfissional: string; // 32 (15 dígitos)
  nomeProfissionalSolicitante: string; // 33
  dataSolicitacao: string; // 34 (YYYY-MM-DD)
  registroConselho: string; // 35 (CRM e UF)

  // 36-45 Preencher em caso de causas externas (Acidentes ou Violências)
  causaExterna?: 'transito' | 'trabalho_tipico' | 'trabalho_trajeto' | 'nenhuma';
  cnpjSeguradora?: string; // 39
  numeroBilhete?: string; // 40
  serie?: string; // 41
  cnpjEmpresa?: string; // 42
  cnaeEmpresa?: string; // 43
  cbor?: string; // 44
  vinculoPrevidencia?: 'empregado' | 'empregador' | 'autonomo' | 'desempregado' | 'aposentado' | 'nao_segurado'; // 45

  // 46-52 Autorização
  nomeProfissionalAutorizador?: string; // 46
  codOrgaoEmissor?: string; // 47
  tipoDocAutorizador?: 'CNS' | 'CPF'; // 48
  numDocAutorizador?: string; // 49
  dataAutorizacao?: string; // 50
  registroConselhoAutorizador?: string; // 51
  numeroAih?: string; // 52

  // PÁGINA 2: SINAIS / SINTOMAS & DADOS VITAIS
  alteracaoConsciencia?: 'sim' | 'nao';
  febre?: string;
  desnutricao?: string;
  desidratacao?: 'sim' | 'nao' | 'ignorado';
  pulso?: string;
  pressaoArterial?: string;
  frequenciaRespiratoria?: string;
  frequenciaCardiaca?: string;

  // PÁGINA 2: MEDICAMENTOS EM USO & MOTIVO DO ENCAMINHAMENTO
  medicamentosEmUso?: string;
  motivoEncaminhamento?: string;

  // PÁGINA 2: EXAMES CLÍNICOS
  exameCirculatorio?: string;
  outrosAchadosClinicos?: string;
  exameAparelhoRespiratorio?: string;

  // PÁGINA 2: EXAMES COMPLEMENTARES
  examesLaboratoriais?: string;
  idadeGestacional?: string;
  mauFormacao?: string;
  ultrassom?: 'sim' | 'nao' | 'ignorado';
  ultrassomObs?: string;
  outrosExames?: string;
  radiografias?: string;

  // PÁGINA 2: EXAME OBSTÉTRICO
  dinamicaUterina?: string;
  dilatacaoColo?: string;
  roturaMembrana?: 'sim' | 'nao';
  apagamento?: string;
  alturaApresentacao?: string;
  posicaoColo?: string;
}

export interface ApacSecundarioItem {
  id: string;
  codigo: string;
  nome: string;
  quantidade: string;
}

/**
 * APAC — AUTORIZAÇÃO DE PROCEDIMENTOS AMBULATORIAIS (SUS)
 * Laudo de Solicitação / Autorização (pg. 1/2 e pg. 2/2)
 */
export interface ApacData {
  // IDENTIFICAÇÃO DO ESTABELECIMENTO DE SAÚDE (SOLICITANTE)
  estabelecimentoSolicitante: string;
  cnesSolicitante: string;

  // IDENTIFICAÇÃO DO PACIENTE
  nomePaciente: string;
  numeroProntuario: string;
  situacaoRua: boolean; // Sim / Não
  cpfOuCns: string;
  dataNascimento: string; // YYYY-MM-DD
  sexo: 'Masc.' | 'Fem.' | 'M' | 'F' | '';
  racaCor: string;
  etnia: string;
  nomeMae: string;
  telefoneCelular: string;
  nomeResponsavel: string;
  telefoneContato: string;
  endereco: string;
  municipioResidencia: string;
  codIbgeMunicipio: string;
  uf: string;
  cep: string;

  // PROCEDIMENTO SOLICITADO
  codigoProcedimentoPrincipal: string;
  servico: string;
  classificacao: string;
  nomeProcedimentoPrincipal: string;
  quantidadePrincipal: string;

  // PROCEDIMENTO(S) SECUNDÁRIO(S) (até 10)
  procedimentosSecundarios: ApacSecundarioItem[];

  // DADOS DO DIAGNÓSTICO HISTOPATOLÓGICO (Opcional)
  dataDiagnosticoHisto?: string;
  cid10Histo?: string;
  descricaoDiagnosticoHisto?: string;

  // JUSTIFICATIVA DO(S) PROCEDIMENTO(S) SOLICITADO(S)
  descricaoDiagnostico: string;
  cid10Principal: string;
  cid10Secundario: string;
  cid10CausasAssociadas: string;
  observacoes: string;

  // SOLICITAÇÃO (Campos 41 a 45)
  nomeProfissionalSolicitante: string;
  dataSolicitacao: string;
  tipoDocumentoSolicitante?: 'CNS' | 'CPF';
  cnsProfissionalSolicitante: string;
  registroConselhoSolicitante: string;

  // AUTORIZAÇÃO (Campos 46 a 53)
  nomeProfissionalAutorizador: string;
  codOrgaoEmissor: string;
  numeroAutorizacaoApac: string;
  tipoDocumentoAutorizador?: 'CNS' | 'CPF';
  cnsProfissionalAutorizador: string;
  dataAutorizacao: string;
  registroConselhoAutorizador: string;
  periodoValidadeInicio: string;
  periodoValidadeFim: string;

  // IDENTIFICAÇÃO DO ESTABELECIMENTO DE SAÚDE (EXECUTANTE) (Campos 54 e 55)
  nomeFantasiaExecutante: string;
  cnesExecutante: string;
}
