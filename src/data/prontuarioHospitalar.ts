import {
  FichaAdmissaoHospitalar,
  EvolucaoSoapItem,
  PatientInfo,
  DoctorProfile,
  InpatientInfo
} from '../types';

export const HDA_TEMPLATES = [
  {
    id: 'dor_toracica',
    title: 'Dor Torácica / SCA',
    tag: 'Cardiológico',
    text: 'Paciente refere dor precordial em aperto de forte intensidade (EVA 8/10), de início súbito em repouso há cerca de 3 horas, com irradiação para membro superior esquerdo e região mandibular. Associada a sudorese fria profusa, náuseas e sensação de morte iminente. Nega alívio ao repouso, uso de nitratos ou mudanças posturais. Nega febre, tosse ou queixas respiratórias prévias.'
  },
  {
    id: 'dispneia_pac',
    title: 'Dispneia / Pneumonia (PAC)',
    tag: 'Respiratório',
    text: 'Paciente refere quadro iniciado há 5 dias com astenia, tosse produtiva com expectoração amarelada/esverdeada e febre diária aferida em até 38,8°C. Há 24 horas evoluiu com piora progressiva da dispneia aos médios e mínimos esforços, taquipneia e dor pleurítica em hemitórax direito. Nega hemoptise ou viagens recentes. Fez uso prévio de sintomáticos em domicílio sem melhora.'
  },
  {
    id: 'sepse_foco',
    title: 'Sepse / Foco Infeccioso a Esclarecer',
    tag: 'Infeccioso',
    text: 'Paciente admitido com rebaixamento do nível de consciência, sonolência e desorientação temporal iniciados há cerca de 48 horas. Familiares relatam episódios de febre alta com calafrios e tremores, associados a recusa alimentar e acentuada prostração. Notada redução volumétrica importante do débito urinário nas últimas 24 horas (oligúria) com urina turva e fétida. Hipotenso na triagem inicial do pronto-socorro.'
  },
  {
    id: 'abdome_agudo',
    title: 'Abdome Agudo Inflamatório',
    tag: 'Cirúrgico',
    text: 'Paciente refere dor abdominal iniciada há 48 horas em região periumbilical de caráter contínuo, que após 12 horas migrou e se fixou em fossa ilíaca direita (FID) com piora acentuada da intensidade (EVA 9/10). Associada a náuseas frequentes, 3 episódios de vômitos alimentares, febrícula e parada de eliminação de gases e fezes há 24 horas. Nega diarreia ou sintomas urinários.'
  },
  {
    id: 'avc_agudo',
    title: 'Déficit Neurológico / Suspeita de AVC',
    tag: 'Neurológico',
    text: 'Paciente trazido pelo SAMU com quadro agudo de perda de força motora em dimídio direito associada a assimetria facial (desvio de rima para a esquerda) e afasia motora/disartria importante. Último momento visto bem (ictus) há 2 horas e 15 minutos. Nega trauma craniano recente, síncope, crise convulsiva ou cefaleia prévia. Portador de hipertensão arterial de longa data com adesão irregular.'
  }
];

export const EXAME_FISICO_NORMAL = {
  geral: 'Bom estado geral (BEG), lúcido e orientado no tempo e no espaço (LOTE), acianótico, anictérico, corado, hidratado. Perfusão capilar periférica preservada (< 2 segundos). Ausência de linfonodomegalias cervicais, axilares ou inguinais palpáveis.',
  acv: 'Aparelho Cardiovascular: Ritmo cardíaco regular em 2 tempos (RCR 2T), bulhas normofonéticas (BRNF) sem sopros, estalidos ou atritos pericárdicos audíveis. Ictus cordis normoposicionado e não visível.',
  ar: 'Aparelho Respiratório: Tórax simétrico, expansibilidade preservada bilateralmente. Murmúrio vesicular presente e bem distribuído universalmente (MV+ bilateral), sem ruídos adventícios (sem estertores, creptações, sibilos ou estridor). Eupneico em ar ambiente.',
  abdome: 'Abdome: Plano, simétrico, flácido, indolor à palpação superficial e profunda em todos os quadrantes. Ruídos hidroaéreos presentes e normoativos (RHA+). Sem visceromegalias (fígado e baço não palpáveis). Sem massas palpáveis. Descompressão brusca indolor (sinais de Blumberg, Murphy e Rovsing negativos).',
  extremidadesNeuro: 'Extremidades: Sem edemas periféricos em membros inferiores (sem cacifo 0/4+). Panturrilhas livres, simétricas e indolores à palpação profunda (sinal de Homans negativo). Pulsos periféricos (radiais, femorais, poplíteos, tibiais posteriores e pediosos) cheios, palpáveis e simétricos bilateralmente. Exame neurológico sumário sem déficits motores ou sensitivos focais, pupilas isocóricas e fotorreagentes.'
};

export const EVOLUCAO_ESTAVEL_TEMPLATE = {
  subjetivo: 'Paciente refere noite calma e repousante, sem queixas álgicas agudas no momento. Boa aceitação da dieta fornecida pelo hospital. Nega náuseas, vômitos, picos febris ou calafrios nas últimas 24 horas. Diurese espontânea presente, clara e com bom volume. Evacuação presente de consistência habitual, eliminações de flatos preservadas.',
  objetivo: 'BEG, lúcido e orientado (Glasgow 15), corado, hidratado, eupneico em ar ambiente, acianótico e anictérico.\nACV: RCR 2T BNF sem sopros audíveis.\nAR: MV presente bilateralmente sem ruídos adventícios.\nABD: Plano, flácido, RHA+, indolor à palpação, sem sinais de peritonismo.\nEXT: Bem perfundido, sem edemas ou empastamentos em MMII.\nAcessos venosos periféricos limpos, pérvios e sem sinais flogísticos.',
  avaliacao: '1. Paciente em evolução clínica favorável, hemodinamicamente estável e afebril.\n2. Controle sintomático adequado com o esquema medicamentoso atual.\n3. Ausência de sinais de instabilidade, infecção secundária ou descompensação clínica.',
  plano: '1. Manter dieta habitual branda com boa hidratação oral.\n2. Manter prescrição médica vigente com ajustes pontuais de analgesia e profilaxias.\n3. Avaliar desmame de medicação venosa para via oral se mantida estabilidade.\n4. Estimular deambulação assistida e fisioterapia motora.\n5. Previsão de alta hospitalar programada em 24-48 horas conforme evolução dos exames.'
};

export function buildDefaultAdmissao(
  patient: PatientInfo,
  doctor: DoctorProfile,
  _inpatientInfo: InpatientInfo
): FichaAdmissaoHospitalar {
  const now = new Date();
  const dataHoraLocal = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);

  return {
    id: `adm-${patient.document || '001'}`,
    dataHoraAdmissao: dataHoraLocal,
    origem: 'pronto_socorro',
    medicoAdmissao: doctor.fullName || 'Dr. Médico Plantonista',
    crmAdmissao: `CRM/${doctor.uf || 'PA'} ${doctor.crm || '00000'}`,

    queixaPrincipal: '',
    hda: '',
    appCheckboxes: {
      has: false,
      dm2: false,
      ic: false,
      drc: false,
      dpoc_asma: false,
      fa: false,
      ave: false,
      cirurgias: false
    },
    appOutros: '',
    temAlergia: 'nao_relata',
    alergiasDescricao: '',
    medicacoesReconciliadas: [],

    sinaisVitais: {
      pa: '',
      fc: '',
      fr: '',
      spo2: '',
      temp: '',
      glicemia: '',
      glasgow: ''
    },
    exameSegmentar: {
      geral: EXAME_FISICO_NORMAL.geral,
      acv: EXAME_FISICO_NORMAL.acv,
      ar: EXAME_FISICO_NORMAL.ar,
      abdome: EXAME_FISICO_NORMAL.abdome,
      extremidadesNeuro: EXAME_FISICO_NORMAL.extremidadesNeuro
    },

    riscos: {
      riscoTev: 'baixo',
      riscoQueda: 'baixo',
      riscoLpp: 'baixo'
    },

    diagnosticos: [],

    planoTerapeutico: {
      dieta: '',
      hidratacao: '',
      sintomaticos: '',
      antibioticos: '',
      examesControle: '',
      pareceres: ''
    },

    observacoesGerais: ''
  };
}

export function buildDefaultEvolucoes(
  patient: PatientInfo,
  doctor: DoctorProfile,
  inpatientInfo: InpatientInfo
): EvolucaoSoapItem[] {
  const ontem = new Date(Date.now() - 86400000).toISOString();
  const hoje = new Date().toISOString();

  return [
    {
      id: 'evo-hoje',
      dataHora: hoje,
      medico: doctor.fullName || 'Dr. Médico Assistente',
      crm: `CRM/${doctor.uf || 'PA'} ${doctor.crm || '00000'}`,
      leito: inpatientInfo.bed || patient.bed || 'Leito 04 - Enfermaria',
      diasInternacao: 2,
      sinaisVitais: {
        pa: '120x78',
        fc: '76',
        fr: '16',
        spo2: '98',
        temp: '36.4',
        glicemia: '104',
        glasgow: '15'
      },
      balancoHidrico: {
        entradasMl: '1850',
        saidasMl: '1520',
        balancoFinalMl: '+330'
      },
      subjetivo: 'Paciente refere melhora substancial da dor em fossa ilíaca após início do antibiótico e analgésico venosos. Dormiu bem. Aceitou 100% da dieta líquida/pastosa. Nega novos picos febris, náuseas ou vômitos nas últimas 24h. Diurese espontânea preservada (~1.500 mL/24h, clara). Eliminações de flatos presentes.',
      objetivo: 'BEG, LOTE, corado, hidratado, anictérico e acianótico.\nACV: RCR em 2T com BRNF sem sopros audíveis. FC 76 bpm.\nAR: Murmúrio vesicular presente universalmente, sem ruídos adventícios. FR 16 ipm.\nABD: Plano, flácido, discretamente doloroso à palpação profunda em FID sem sinais de peritonismo (Blumberg francamente negativo hoje). RHA normoativos.\nEXT: Sem edemas, pulsos distais cheios e simétricos.\nExames complementares (D2): Hemograma com leucócitos 9.800 (queda de 14.500), PCR em queda de 84 para 28 mg/L. Função renal normal (Cr 0.8 / Ur 28).',
      avaliacao: '1. Apendicite aguda flegmonosa em resolução clínica e laboratorial evidente.\n2. Excelente tolerância digestiva e recuperação do trânsito gastrointestinal.\n3. Paciente hemodinamicamente estável, afebril há > 24 horas, em D2 de Ceftriaxona + Metronidazol.',
      plano: '1. Progredir dieta para branda obstipante conforme aceitação.\n2. Manter antibioticoterapia venosa até completar D3 e avaliar transição para via oral (Ciprofloxacino + Metronidazol VO).\n3. Desmamar analgesia de horário para S.N. (apenas se dor residual).\n4. Manter Losartana 50mg pela manhã.\n5. Previsão de alta hospitalar nas próximas 24 a 48 horas se mantida estabilidade clínica.'
    },
    {
      id: 'evo-ontem',
      dataHora: ontem,
      medico: doctor.fullName || 'Dr. Médico Assistente',
      crm: `CRM/${doctor.uf || 'PA'} ${doctor.crm || '00000'}`,
      leito: inpatientInfo.bed || patient.bed || 'Leito 04 - Enfermaria',
      diasInternacao: 1,
      sinaisVitais: {
        pa: '130x85',
        fc: '86',
        fr: '18',
        spo2: '97',
        temp: '37.3',
        glicemia: '118',
        glasgow: '15'
      },
      balancoHidrico: {
        entradasMl: '2100',
        saidasMl: '1400',
        balancoFinalMl: '+700'
      },
      subjetivo: 'Paciente admitido há cerca de 12 horas. Relata dor contínua em FID com intensidade moderada (EVA 6/10), atenuada com dipirona. Nega vômitos recentes, refere sensação de empachamento pós-prandial. Eliminações de flatos presentes.',
      objetivo: 'REG, lúcido e orientado, corado, hidratado.\nACV: RCR 2T BNF sem sopros.\nAR: MV presente bilateralmente sem ruídos.\nABD: Doloroso à palpação em fossa ilíaca direita, descompressão brusca inconclusiva, RHA diminuídos.\nEXT: Perfusão < 2s, sem edemas.',
      avaliacao: 'D1 de internação por suspeita de abdome agudo inflamatório (apendicite aguda inicial). Estável hemodinamicamente.',
      plano: '1. Dieta líquida restrita.\n2. Iniciar Ceftriaxona 1g EV 12/12h + Metronidazol 500mg EV 8/8h.\n3. Sinais vitais de 6/6h com registro de débito urinário.\n4. Aguardar ultrassonografia abdominal solicitada.'
    }
  ];
}

const STORAGE_KEY_PREFIX = 'ordem_terceira_prontuario_v3_';

const LEGACY_MOCK_QP = 'Dor abdominal e febre há 2 dias';
const LEGACY_MOCK_HDA_PREFIX = 'Paciente admitido na unidade de internação/enfermaria com história de dor abdominal';

export function sanitizeAdmissaoLegacyMocks(adm: FichaAdmissaoHospitalar): FichaAdmissaoHospitalar {
  const cleanQp = adm.queixaPrincipal?.trim() === LEGACY_MOCK_QP ? '' : adm.queixaPrincipal;
  const cleanHda = adm.hda?.trim().startsWith(LEGACY_MOCK_HDA_PREFIX) ? '' : adm.hda;
  if (cleanQp !== adm.queixaPrincipal || cleanHda !== adm.hda) {
    return {
      ...adm,
      queixaPrincipal: cleanQp,
      hda: cleanHda
    };
  }
  return adm;
}

/** Indica se já existe prontuário salvo localmente para o identificador do paciente */
export function hasSavedProntuario(patientId: string): boolean {
  if (!patientId || patientId === 'default') return false;
  try {
    return localStorage.getItem(`${STORAGE_KEY_PREFIX}${patientId}`) !== null;
  } catch {
    return false;
  }
}

export function saveProntuarioToStorage(
  patientId: string,
  admissao: FichaAdmissaoHospitalar,
  evolucoes: EvolucaoSoapItem[]
) {
  if (!patientId || patientId === 'default') return;
  try {
    const key = `${STORAGE_KEY_PREFIX}${patientId}`;
    const payload = JSON.stringify({
      admissao: sanitizeAdmissaoLegacyMocks(admissao),
      evolucoes,
      savedAt: new Date().toISOString()
    });
    localStorage.setItem(key, payload);
  } catch (err) {
    console.warn('Erro ao salvar prontuário no localStorage:', err);
  }
}

export function loadProntuarioFromStorage(
  patientId: string,
  fallbackAdmissao: FichaAdmissaoHospitalar,
  fallbackEvolucoes: EvolucaoSoapItem[]
): { admissao: FichaAdmissaoHospitalar; evolucoes: EvolucaoSoapItem[] } {
  if (!patientId || patientId === 'default') {
    return { admissao: fallbackAdmissao, evolucoes: fallbackEvolucoes };
  }
  try {
    const key = `${STORAGE_KEY_PREFIX}${patientId}`;
    const raw = localStorage.getItem(key);
    if (!raw) {
      return { admissao: fallbackAdmissao, evolucoes: fallbackEvolucoes };
    }
    const parsed = JSON.parse(raw);
    const savedAdm = parsed && typeof parsed.admissao === 'object' ? parsed.admissao : null;
    const mergedAdm: FichaAdmissaoHospitalar = savedAdm
      ? sanitizeAdmissaoLegacyMocks({
          ...fallbackAdmissao,
          ...savedAdm,
          sinaisVitais: { ...fallbackAdmissao.sinaisVitais, ...(savedAdm.sinaisVitais || {}) },
          exameSegmentar: { ...fallbackAdmissao.exameSegmentar, ...(savedAdm.exameSegmentar || {}) }
        })
      : fallbackAdmissao;
    return {
      admissao: mergedAdm,
      evolucoes: Array.isArray(parsed?.evolucoes) ? parsed.evolucoes : fallbackEvolucoes
    };
  } catch (err) {
    console.warn('Erro ao carregar prontuário do localStorage:', err);
    return { admissao: fallbackAdmissao, evolucoes: fallbackEvolucoes };
  }
}

export function clearDefaultProntuarioFromStorage() {
  try {
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}default`);
    localStorage.removeItem('ordem_terceira_prontuario_v2_default');
    localStorage.removeItem('ordem_terceira_prontuario_v1_default');
  } catch (err) {
    console.warn('Erro ao limpar rascunho padrão do prontuário:', err);
  }
}
