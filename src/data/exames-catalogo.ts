export interface ExameItem {
  id: string;
  codigoSigtap: string;
  codigoFormatado: string;
  nomeOficial: string;
  termoClinico: string;
  sigla: string;
  categoria: CategoriaExameKey;
  instrumento: string;
  complexidade: string;
  exigeCid: boolean;
  exigeCns: boolean;
  amostra: string;
  tubo: string;
  prazoEstimado: string;
}

export type CategoriaExameKey =
  | 'Hematologia'
  | 'Coagulação'
  | 'Bioquímica e Eletrólitos'
  | 'Função Hepática'
  | 'Marcadores Cardíacos e Críticos'
  | 'Microbiologia e Culturas'
  | 'Urinálise e Parasitologia'
  | 'Sorologias e Hormônios';

export interface CategoriaConfig {
  key: CategoriaExameKey;
  nome: string;
  descricao: string;
  corBadge: string;
  corBg: string;
  corBorda: string;
}

export const CATEGORIAS_CONFIG: Record<CategoriaExameKey, CategoriaConfig> = {
  Hematologia: {
    key: 'Hematologia',
    nome: 'Hematologia',
    descricao: 'Série vermelha, branca, plaquetária, cinética de ferro e imuno-hematologia.',
    corBadge: 'bg-rose-100 text-rose-800 border-rose-300',
    corBg: 'from-rose-50/70 to-pink-50/30',
    corBorda: 'border-rose-200'
  },
  Coagulação: {
    key: 'Coagulação',
    nome: 'Coagulação',
    descricao: 'Hemostasia primária e secundária, tempo de protrombina, TTPA e D-Dímero.',
    corBadge: 'bg-sky-100 text-sky-800 border-sky-300',
    corBg: 'from-sky-50/70 to-blue-50/30',
    corBorda: 'border-sky-200'
  },
  'Bioquímica e Eletrólitos': {
    key: 'Bioquímica e Eletrólitos',
    nome: 'Bioquímica & Eletrólitos',
    descricao: 'Função renal, glicose, perfil lipídico e eletrólitos séricos.',
    corBadge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    corBg: 'from-emerald-50/70 to-teal-50/30',
    corBorda: 'border-emerald-200'
  },
  'Função Hepática': {
    key: 'Função Hepática',
    nome: 'Função Hepática & Enzimas',
    descricao: 'Transaminases, canaliculares, síntese hepática e enzimas digestivas.',
    corBadge: 'bg-amber-100 text-amber-900 border-amber-300',
    corBg: 'from-amber-50/70 to-yellow-50/30',
    corBorda: 'border-amber-200'
  },
  'Marcadores Cardíacos e Críticos': {
    key: 'Marcadores Cardíacos e Críticos',
    nome: 'Cardiologia & Paciente Crítico',
    descricao: 'Injúria miocárdica, gasometria, lactato e biomarcadores inflamatórios.',
    corBadge: 'bg-red-100 text-red-800 border-red-300',
    corBg: 'from-red-50/70 to-orange-50/30',
    corBorda: 'border-red-200'
  },
  'Microbiologia e Culturas': {
    key: 'Microbiologia e Culturas',
    nome: 'Microbiologia & Tuberculose',
    descricao: 'Culturas bacteriológicas, baciloscopia (BAAR), GeneXpert TRM-TB e Gram.',
    corBadge: 'bg-purple-100 text-purple-800 border-purple-300',
    corBg: 'from-purple-50/70 to-fuchsia-50/30',
    corBorda: 'border-purple-200'
  },
  'Urinálise e Parasitologia': {
    key: 'Urinálise e Parasitologia',
    nome: 'Urinálise & Coprologia',
    descricao: 'Exame de urina tipo 1, proteinúria, parasitológico e sangue oculto.',
    corBadge: 'bg-teal-100 text-teal-800 border-teal-300',
    corBg: 'from-teal-50/70 to-cyan-50/30',
    corBorda: 'border-teal-200'
  },
  'Sorologias e Hormônios': {
    key: 'Sorologias e Hormônios',
    nome: 'Sorologias & Hormônios',
    descricao: 'Rastreio infeccioso (HIV, Sífilis, Hepatites) e função tireoidiana/gestacional.',
    corBadge: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    corBg: 'from-indigo-50/70 to-violet-50/30',
    corBorda: 'border-indigo-200'
  }
};

export interface PerfilRapido {
  id: string;
  nome: string;
  subtitulo: string;
  descricao: string;
  corBotao: string;
  corAtivo: string;
  badge: string;
  exameIds: string[];
}

export const PERFIS_RAPIDOS: PerfilRapido[] = [
  {
    id: 'rotina-admissao',
    nome: 'Rotina Admissão',
    subtitulo: 'Checklist Admissional',
    descricao: 'HMG, Glicemia, Ureia, Creatinina, Na+, K+, TAP, TTPA, TGO, TGP, PCR e EAS',
    corBotao: 'bg-blue-50 border-blue-200 text-blue-900 hover:bg-blue-100',
    corAtivo: 'bg-blue-600 text-white border-blue-700 shadow-md shadow-blue-500/20',
    badge: '12 Exames',
    exameIds: ['hmg', 'glic', 'ure', 'cre', 'na', 'k', 'tap', 'ttpa', 'tgo', 'tgp', 'pcr', 'eas']
  },
  {
    id: 'protocolo-sepse',
    nome: 'Protocolo Sepse',
    subtitulo: 'Urgência & UTI',
    descricao: 'HMG, Lactato, Gasometria, Creatinina, Ureia, Bilirrubinas, PCR, Procalcitonina, TAP, TTPA, Hemocultura',
    corBotao: 'bg-rose-50 border-rose-200 text-rose-900 hover:bg-rose-100',
    corAtivo: 'bg-rose-600 text-white border-rose-700 shadow-md shadow-rose-500/20',
    badge: 'Sepse 1h',
    exameIds: ['hmg', 'lac', 'gaso', 'cre', 'ure', 'btf', 'pcr', 'pct', 'tap', 'ttpa', 'hmc']
  },
  {
    id: 'hepatograma',
    nome: 'Hepatograma',
    subtitulo: 'Painel Hepático',
    descricao: 'TGO, TGP, Gama GT, Fosfatase Alcalina, Bilirrubinas T/F, Albumina e TAP/INR',
    corBotao: 'bg-amber-50 border-amber-200 text-amber-900 hover:bg-amber-100',
    corAtivo: 'bg-amber-600 text-white border-amber-700 shadow-md shadow-amber-500/20',
    badge: '7 Exames',
    exameIds: ['tgo', 'tgp', 'ggt', 'fa', 'btf', 'alb', 'tap']
  },
  {
    id: 'coagulograma',
    nome: 'Coagulograma',
    subtitulo: 'Hemostasia / Pré-Op',
    descricao: 'TAP/INR, TTPA, Contagem de Plaquetas, Fibrinogênio e D-Dímero',
    corBotao: 'bg-sky-50 border-sky-200 text-sky-900 hover:bg-sky-100',
    corAtivo: 'bg-sky-600 text-white border-sky-700 shadow-md shadow-sky-500/20',
    badge: '5 Exames',
    exameIds: ['tap', 'ttpa', 'plq', 'fibr', 'ddim']
  },
  {
    id: 'dor-toracica-sca',
    nome: 'Dor Torácica / SCA',
    subtitulo: 'Protocolo Coronário',
    descricao: 'Troponina, CK-MB, CPK, D-Dímero, BNP, Hemograma, Creatinina, Na+ e K+',
    corBotao: 'bg-red-50 border-red-200 text-red-900 hover:bg-red-100',
    corAtivo: 'bg-red-600 text-white border-red-700 shadow-md shadow-red-500/20',
    badge: 'SCA / TEV',
    exameIds: ['trop', 'ckmb', 'cpk', 'ddim', 'bnp', 'hmg', 'cre', 'na', 'k']
  },
  {
    id: 'investigacao-tb',
    nome: 'Investigação TB',
    subtitulo: 'Tuberculose Respiratória',
    descricao: 'BAAR (escarro), GeneXpert (TRM-TB), PPD, IGRA e Hemograma',
    corBotao: 'bg-purple-50 border-purple-200 text-purple-900 hover:bg-purple-100',
    corAtivo: 'bg-purple-600 text-white border-purple-700 shadow-md shadow-purple-500/20',
    badge: 'SUS / TB',
    exameIds: ['baar', 'trm-tb', 'ppd', 'igra', 'hmg']
  }
];

export const EXAMES_CATALOGO: ExameItem[] = [
  {
    "id": "hmg",
    "codigoSigtap": "0202020380",
    "codigoFormatado": "02.02.02.038-0",
    "nomeOficial": "HEMOGRAMA COMPLETO",
    "termoClinico": "Hemograma Completo",
    "sigla": "HMG",
    "categoria": "Hematologia",
    "instrumento": "BPA-C / AIH",
    "complexidade": "Média Complexidade (MAC)",
    "exigeCid": false,
    "exigeCns": true,
    "amostra": "Sangue Total (EDTA)",
    "tubo": "Tubo Roxo (EDTA)",
    "prazoEstimado": "1 a 2 horas (Urgência)"
  },
  {
    "id": "plq",
    "codigoSigtap": "0202020151",
    "codigoFormatado": "02.02.02.015-1",
    "nomeOficial": "CONTAGEM DE PLAQUETAS",
    "termoClinico": "Contagem de Plaquetas",
    "sigla": "PLQ",
    "categoria": "Hematologia",
    "instrumento": "BPA-C / AIH",
    "complexidade": "Média Complexidade (MAC)",
    "exigeCid": false,
    "exigeCns": true,
    "amostra": "Sangue Total (EDTA)",
    "tubo": "Tubo Roxo (EDTA)",
    "prazoEstimado": "Mesmo dia"
  },
  {
    "id": "ret",
    "codigoSigtap": "0202020178",
    "codigoFormatado": "02.02.02.017-8",
    "nomeOficial": "CONTAGEM DE RETICULOCITOS",
    "termoClinico": "Contagem de Reticulócitos",
    "sigla": "RET",
    "categoria": "Hematologia",
    "instrumento": "BPA-C / AIH",
    "complexidade": "Média Complexidade (MAC)",
    "exigeCid": false,
    "exigeCns": true,
    "amostra": "Sangue Total (EDTA)",
    "tubo": "Tubo Roxo (EDTA)",
    "prazoEstimado": "Mesmo dia"
  },
  {
    "id": "vhs",
    "codigoSigtap": "0202020160",
    "codigoFormatado": "02.02.02.016-0",
    "nomeOficial": "DETERMINACAO DE VELOCIDADE DE HEMOSSEDIMENTACAO (VHS)",
    "termoClinico": "VHS",
    "sigla": "VHS",
    "categoria": "Hematologia",
    "instrumento": "BPA-C / AIH",
    "complexidade": "Média Complexidade (MAC)",
    "exigeCid": false,
    "exigeCns": true,
    "amostra": "Sangue Total (Citrato / EDTA)",
    "tubo": "Tubo Preto ou Roxo",
    "prazoEstimado": "Mesmo dia"
  },
  {
    "id": "abo-rh",
    "codigoSigtap": "0202020356",
    "codigoFormatado": "02.02.02.035-6",
    "nomeOficial": "DETERMINACAO DE GRUPO SANGUINEO E FATOR RH",
    "termoClinico": "Tipagem Sanguínea ABO / Rh",
    "sigla": "ABO/RH",
    "categoria": "Hematologia",
    "instrumento": "BPA-C / AIH",
    "complexidade": "Média Complexidade (MAC)",
    "exigeCid": false,
    "exigeCns": true,
    "amostra": "Sangue Total (EDTA)",
    "tubo": "Tubo Roxo",
    "prazoEstimado": "Mesmo dia"
  },
  {
    "id": "coombs-d",
    "codigoSigtap": "0202020364",
    "codigoFormatado": "02.02.02.036-4",
    "nomeOficial": "TESTE DE COOMBS DIRETO",
    "termoClinico": "Coombs Direto",
    "sigla": "COOMBS-D",
    "categoria": "Hematologia",
    "instrumento": "BPA-I / AIH",
    "complexidade": "Média Complexidade (MAC)",
    "exigeCid": false,
    "exigeCns": true,
    "amostra": "Sangue Total (EDTA)",
    "tubo": "Tubo Roxo",
    "prazoEstimado": "Mesmo dia"
  },
  {
    "id": "coombs-i",
    "codigoSigtap": "0202020372",
    "codigoFormatado": "02.02.02.037-2",
    "nomeOficial": "TESTE DE COOMBS INDIRETO",
    "termoClinico": "Coombs Indireto (PAI)",
    "sigla": "COOMBS-I",
    "categoria": "Hematologia",
    "instrumento": "BPA-I / AIH",
    "complexidade": "Média Complexidade (MAC)",
    "exigeCid": false,
    "exigeCns": true,
    "amostra": "Sangue Total (EDTA)",
    "tubo": "Tubo Roxo",
    "prazoEstimado": "Mesmo dia"
  },
  {
    "id": "fe",
    "codigoSigtap": "0202010430",
    "codigoFormatado": "02.02.01.043-0",
    "nomeOficial": "DOSAGEM DE FERRO SERICO",
    "termoClinico": "Ferro Sérico",
    "sigla": "FE",
    "categoria": "Hematologia",
    "instrumento": "BPA-C / AIH",
    "complexidade": "Média Complexidade (MAC)",
    "exigeCid": false,
    "exigeCns": true,
    "amostra": "Soro Sanguíneo",
    "tubo": "Tubo Amarelo (Gel Separador / Ativador de Coágulo)",
    "prazoEstimado": "Mesmo dia"
  },
  {
    "id": "ferrit",
    "codigoSigtap": "0202010449",
    "codigoFormatado": "02.02.01.044-9",
    "nomeOficial": "DOSAGEM DE FERRITINA",
    "termoClinico": "Ferritina",
    "sigla": "FERRIT",
    "categoria": "Hematologia",
    "instrumento": "BPA-I / AIH",
    "complexidade": "Média Complexidade (MAC)",
    "exigeCid": false,
    "exigeCns": true,
    "amostra": "Soro Sanguíneo",
    "tubo": "Tubo Amarelo (Gel Separador / Ativador de Coágulo)",
    "prazoEstimado": "Mesmo dia"
  },
  {
    "id": "tap",
    "codigoSigtap": "0202020143",
    "codigoFormatado": "02.02.02.014-3",
    "nomeOficial": "DETERMINACAO DE TEMPO DE PROTROMBINA",
    "termoClinico": "TAP / TP (com INR)",
    "sigla": "TAP",
    "categoria": "Coagulação",
    "instrumento": "BPA-C / AIH",
    "complexidade": "Média Complexidade (MAC)",
    "exigeCid": false,
    "exigeCns": true,
    "amostra": "Plasma Citratado",
    "tubo": "Tubo Azul (Citrato de Sódio)",
    "prazoEstimado": "Mesmo dia"
  },
  {
    "id": "ttpa",
    "codigoSigtap": "0202020135",
    "codigoFormatado": "02.02.02.013-5",
    "nomeOficial": "DETERMINACAO DE TEMPO DE TROMBOPLASTINA PARCIAL ATIVADA (TTP)",
    "termoClinico": "TTPA / KTTP",
    "sigla": "TTPA",
    "categoria": "Coagulação",
    "instrumento": "BPA-C / AIH",
    "complexidade": "Média Complexidade (MAC)",
    "exigeCid": false,
    "exigeCns": true,
    "amostra": "Plasma Citratado",
    "tubo": "Tubo Azul (Citrato de Sódio)",
    "prazoEstimado": "Mesmo dia"
  },
  {
    "id": "fibr",
    "codigoSigtap": "0202020208",
    "codigoFormatado": "02.02.02.020-8",
    "nomeOficial": "DOSAGEM DE FIBRINOGENIO",
    "termoClinico": "Fibrinogênio",
    "sigla": "FIBR",
    "categoria": "Coagulação",
    "instrumento": "BPA-I / AIH",
    "complexidade": "Média Complexidade (MAC)",
    "exigeCid": false,
    "exigeCns": true,
    "amostra": "Plasma Citratado",
    "tubo": "Tubo Azul (Citrato de Sódio)",
    "prazoEstimado": "Mesmo dia"
  },
  {
    "id": "ddim",
    "codigoSigtap": "0202020429",
    "codigoFormatado": "02.02.02.042-9",
    "nomeOficial": "DOSAGEM DE D-DIMERO",
    "termoClinico": "D-Dímero",
    "sigla": "DDIM",
    "categoria": "Coagulação",
    "instrumento": "BPA-I / AIH",
    "complexidade": "Média Complexidade (MAC)",
    "exigeCid": true,
    "exigeCns": true,
    "amostra": "Plasma Citratado",
    "tubo": "Tubo Azul (Citrato de Sódio)",
    "prazoEstimado": "Mesmo dia"
  },
  {
    "id": "glic",
    "codigoSigtap": "0202010473",
    "codigoFormatado": "02.02.01.047-3",
    "nomeOficial": "DOSAGEM DE GLICOSE",
    "termoClinico": "Glicemia em Jejum / Sérica",
    "sigla": "GLIC",
    "categoria": "Bioquímica e Eletrólitos",
    "instrumento": "BPA-C / AIH",
    "complexidade": "Média Complexidade (MAC)",
    "exigeCid": false,
    "exigeCns": true,
    "amostra": "Soro Sanguíneo",
    "tubo": "Tubo Amarelo (Gel Separador / Ativador de Coágulo)",
    "prazoEstimado": "1 a 2 horas (Urgência)"
  },
  {
    "id": "hba1c",
    "codigoSigtap": "0202010503",
    "codigoFormatado": "02.02.01.050-3",
    "nomeOficial": "DOSAGEM DE HEMOGLOBINA GLICOSILADA",
    "termoClinico": "Hemoglobina Glicada (HbA1c)",
    "sigla": "HBA1C",
    "categoria": "Bioquímica e Eletrólitos",
    "instrumento": "BPA-I / AIH",
    "complexidade": "Média Complexidade (MAC)",
    "exigeCid": false,
    "exigeCns": true,
    "amostra": "Sangue Total (EDTA)",
    "tubo": "Tubo Roxo (EDTA)",
    "prazoEstimado": "Mesmo dia"
  },
  {
    "id": "ure",
    "codigoSigtap": "0202010694",
    "codigoFormatado": "02.02.01.069-4",
    "nomeOficial": "DOSAGEM DE UREIA",
    "termoClinico": "Ureia",
    "sigla": "URE",
    "categoria": "Bioquímica e Eletrólitos",
    "instrumento": "BPA-C / AIH",
    "complexidade": "Média Complexidade (MAC)",
    "exigeCid": false,
    "exigeCns": true,
    "amostra": "Soro Sanguíneo",
    "tubo": "Tubo Amarelo (Gel Separador / Ativador de Coágulo)",
    "prazoEstimado": "Mesmo dia"
  },
  {
    "id": "cre",
    "codigoSigtap": "0202010317",
    "codigoFormatado": "02.02.01.031-7",
    "nomeOficial": "DOSAGEM DE CREATININA",
    "termoClinico": "Creatinina",
    "sigla": "CRE",
    "categoria": "Bioquímica e Eletrólitos",
    "instrumento": "BPA-C / AIH",
    "complexidade": "Média Complexidade (MAC)",
    "exigeCid": false,
    "exigeCns": true,
    "amostra": "Soro Sanguíneo",
    "tubo": "Tubo Amarelo (Gel Separador / Ativador de Coágulo)",
    "prazoEstimado": "Mesmo dia"
  },
  {
    "id": "na",
    "codigoSigtap": "0202010635",
    "codigoFormatado": "02.02.01.063-5",
    "nomeOficial": "DOSAGEM DE SODIO",
    "termoClinico": "Sódio (Na+)",
    "sigla": "NA",
    "categoria": "Bioquímica e Eletrólitos",
    "instrumento": "BPA-C / AIH",
    "complexidade": "Média Complexidade (MAC)",
    "exigeCid": false,
    "exigeCns": true,
    "amostra": "Soro Sanguíneo",
    "tubo": "Tubo Amarelo (Gel Separador / Ativador de Coágulo)",
    "prazoEstimado": "Mesmo dia"
  },
  {
    "id": "k",
    "codigoSigtap": "0202010600",
    "codigoFormatado": "02.02.01.060-0",
    "nomeOficial": "DOSAGEM DE POTASSIO",
    "termoClinico": "Potássio (K+)",
    "sigla": "K",
    "categoria": "Bioquímica e Eletrólitos",
    "instrumento": "BPA-C / AIH",
    "complexidade": "Média Complexidade (MAC)",
    "exigeCid": false,
    "exigeCns": true,
    "amostra": "Soro Sanguíneo",
    "tubo": "Tubo Amarelo (Gel Separador / Ativador de Coágulo)",
    "prazoEstimado": "Mesmo dia"
  },
  {
    "id": "ca-t",
    "codigoSigtap": "0202010287",
    "codigoFormatado": "02.02.01.028-7",
    "nomeOficial": "DOSAGEM DE CALCIO",
    "termoClinico": "Cálcio Total",
    "sigla": "CA-T",
    "categoria": "Bioquímica e Eletrólitos",
    "instrumento": "BPA-C / AIH",
    "complexidade": "Média Complexidade (MAC)",
    "exigeCid": false,
    "exigeCns": true,
    "amostra": "Soro Sanguíneo",
    "tubo": "Tubo Amarelo (Gel Separador / Ativador de Coágulo)",
    "prazoEstimado": "Mesmo dia"
  },
  {
    "id": "ca-i",
    "codigoSigtap": "0202010295",
    "codigoFormatado": "02.02.01.029-5",
    "nomeOficial": "DOSAGEM DE CALCIO IONICO",
    "termoClinico": "Cálcio Iônico",
    "sigla": "CA-I",
    "categoria": "Bioquímica e Eletrólitos",
    "instrumento": "BPA-I / AIH",
    "complexidade": "Média Complexidade (MAC)",
    "exigeCid": false,
    "exigeCns": true,
    "amostra": "Soro Sanguíneo",
    "tubo": "Tubo Amarelo (Gel Separador / Ativador de Coágulo)",
    "prazoEstimado": "Mesmo dia"
  },
  {
    "id": "mg",
    "codigoSigtap": "0202010562",
    "codigoFormatado": "02.02.01.056-2",
    "nomeOficial": "DOSAGEM DE MAGNESIO",
    "termoClinico": "Magnésio (Mg2+)",
    "sigla": "MG",
    "categoria": "Bioquímica e Eletrólitos",
    "instrumento": "BPA-C / AIH",
    "complexidade": "Média Complexidade (MAC)",
    "exigeCid": false,
    "exigeCns": true,
    "amostra": "Soro Sanguíneo",
    "tubo": "Tubo Amarelo (Gel Separador / Ativador de Coágulo)",
    "prazoEstimado": "Mesmo dia"
  },
  {
    "id": "p",
    "codigoSigtap": "0202010465",
    "codigoFormatado": "02.02.01.046-5",
    "nomeOficial": "DOSAGEM DE FOSFORO",
    "termoClinico": "Fósforo Sérico",
    "sigla": "P",
    "categoria": "Bioquímica e Eletrólitos",
    "instrumento": "BPA-C / AIH",
    "complexidade": "Média Complexidade (MAC)",
    "exigeCid": false,
    "exigeCns": true,
    "amostra": "Soro Sanguíneo",
    "tubo": "Tubo Amarelo (Gel Separador / Ativador de Coágulo)",
    "prazoEstimado": "Mesmo dia"
  },
  {
    "id": "cl",
    "codigoSigtap": "0202010309",
    "codigoFormatado": "02.02.01.030-9",
    "nomeOficial": "DOSAGEM DE CLORETOS",
    "termoClinico": "Cloreto (Cl-)",
    "sigla": "CL",
    "categoria": "Bioquímica e Eletrólitos",
    "instrumento": "BPA-C / AIH",
    "complexidade": "Média Complexidade (MAC)",
    "exigeCid": false,
    "exigeCns": true,
    "amostra": "Soro Sanguíneo",
    "tubo": "Tubo Amarelo (Gel Separador / Ativador de Coágulo)",
    "prazoEstimado": "Mesmo dia"
  },
  {
    "id": "tgo",
    "codigoSigtap": "0202010643",
    "codigoFormatado": "02.02.01.064-3",
    "nomeOficial": "DOSAGEM DE TRANSAMINASE GLUTAMICO-OXALACETICA (TGO)",
    "termoClinico": "TGO (AST)",
    "sigla": "TGO",
    "categoria": "Função Hepática",
    "instrumento": "BPA-C / AIH",
    "complexidade": "Média Complexidade (MAC)",
    "exigeCid": false,
    "exigeCns": true,
    "amostra": "Soro Sanguíneo",
    "tubo": "Tubo Amarelo (Gel Separador / Ativador de Coágulo)",
    "prazoEstimado": "Mesmo dia"
  },
  {
    "id": "tgp",
    "codigoSigtap": "0202010651",
    "codigoFormatado": "02.02.01.065-1",
    "nomeOficial": "DOSAGEM DE TRANSAMINASE GLUTAMICO-PIRUVICA (TGP)",
    "termoClinico": "TGP (ALT)",
    "sigla": "TGP",
    "categoria": "Função Hepática",
    "instrumento": "BPA-C / AIH",
    "complexidade": "Média Complexidade (MAC)",
    "exigeCid": false,
    "exigeCns": true,
    "amostra": "Soro Sanguíneo",
    "tubo": "Tubo Amarelo (Gel Separador / Ativador de Coágulo)",
    "prazoEstimado": "Mesmo dia"
  },
  {
    "id": "ggt",
    "codigoSigtap": "0202010481",
    "codigoFormatado": "02.02.01.048-1",
    "nomeOficial": "DOSAGEM DE GAMA-GLUTAMIL-TRANSFERASE (GAMA GT)",
    "termoClinico": "Gama GT (GGT)",
    "sigla": "GGT",
    "categoria": "Função Hepática",
    "instrumento": "BPA-C / AIH",
    "complexidade": "Média Complexidade (MAC)",
    "exigeCid": false,
    "exigeCns": true,
    "amostra": "Soro Sanguíneo",
    "tubo": "Tubo Amarelo (Gel Separador / Ativador de Coágulo)",
    "prazoEstimado": "Mesmo dia"
  },
  {
    "id": "fa",
    "codigoSigtap": "0202010457",
    "codigoFormatado": "02.02.01.045-7",
    "nomeOficial": "DOSAGEM DE FOSFATASE ALCALINA",
    "termoClinico": "Fosfatase Alcalina (FA)",
    "sigla": "FA",
    "categoria": "Função Hepática",
    "instrumento": "BPA-C / AIH",
    "complexidade": "Média Complexidade (MAC)",
    "exigeCid": false,
    "exigeCns": true,
    "amostra": "Soro Sanguíneo",
    "tubo": "Tubo Amarelo (Gel Separador / Ativador de Coágulo)",
    "prazoEstimado": "Mesmo dia"
  },
  {
    "id": "btf",
    "codigoSigtap": "0202010201",
    "codigoFormatado": "02.02.01.020-1",
    "nomeOficial": "DOSAGEM DE BILIRRUBINA TOTAL E FRACOES",
    "termoClinico": "Bilirrubinas Totais e Frações",
    "sigla": "BTF",
    "categoria": "Função Hepática",
    "instrumento": "BPA-C / AIH",
    "complexidade": "Média Complexidade (MAC)",
    "exigeCid": false,
    "exigeCns": true,
    "amostra": "Soro Sanguíneo",
    "tubo": "Tubo Amarelo (Gel Separador / Ativador de Coágulo)",
    "prazoEstimado": "Mesmo dia"
  },
  {
    "id": "ptf",
    "codigoSigtap": "0202010619",
    "codigoFormatado": "02.02.01.061-9",
    "nomeOficial": "DOSAGEM DE PROTEINAS TOTAIS E FRACOES",
    "termoClinico": "Proteínas Totais e Frações",
    "sigla": "PTF",
    "categoria": "Função Hepática",
    "instrumento": "BPA-C / AIH",
    "complexidade": "Média Complexidade (MAC)",
    "exigeCid": false,
    "exigeCns": true,
    "amostra": "Soro Sanguíneo",
    "tubo": "Tubo Amarelo (Gel Separador / Ativador de Coágulo)",
    "prazoEstimado": "Mesmo dia"
  },
  {
    "id": "alb",
    "codigoSigtap": "0202010120",
    "codigoFormatado": "02.02.01.012-0",
    "nomeOficial": "DOSAGEM DE ALBUMINA",
    "termoClinico": "Albumina Sérica",
    "sigla": "ALB",
    "categoria": "Função Hepática",
    "instrumento": "BPA-C / AIH",
    "complexidade": "Média Complexidade (MAC)",
    "exigeCid": false,
    "exigeCns": true,
    "amostra": "Soro Sanguíneo",
    "tubo": "Tubo Amarelo (Gel Separador / Ativador de Coágulo)",
    "prazoEstimado": "Mesmo dia"
  },
  {
    "id": "amil",
    "codigoSigtap": "0202010180",
    "codigoFormatado": "02.02.01.018-0",
    "nomeOficial": "DOSAGEM DE AMILASE",
    "termoClinico": "Amilase",
    "sigla": "AMIL",
    "categoria": "Função Hepática",
    "instrumento": "BPA-C / AIH",
    "complexidade": "Média Complexidade (MAC)",
    "exigeCid": false,
    "exigeCns": true,
    "amostra": "Soro Sanguíneo",
    "tubo": "Tubo Amarelo (Gel Separador / Ativador de Coágulo)",
    "prazoEstimado": "Mesmo dia"
  },
  {
    "id": "lip",
    "codigoSigtap": "0202010554",
    "codigoFormatado": "02.02.01.055-4",
    "nomeOficial": "DOSAGEM DE LIPASE",
    "termoClinico": "Lipase",
    "sigla": "LIP",
    "categoria": "Função Hepática",
    "instrumento": "BPA-C / AIH",
    "complexidade": "Média Complexidade (MAC)",
    "exigeCid": false,
    "exigeCns": true,
    "amostra": "Soro Sanguíneo",
    "tubo": "Tubo Amarelo (Gel Separador / Ativador de Coágulo)",
    "prazoEstimado": "Mesmo dia"
  },
  {
    "id": "ct",
    "codigoSigtap": "0202010325",
    "codigoFormatado": "02.02.01.032-5",
    "nomeOficial": "DOSAGEM DE COLESTEROL TOTAL",
    "termoClinico": "Colesterol Total",
    "sigla": "CT",
    "categoria": "Bioquímica e Eletrólitos",
    "instrumento": "BPA-C / AIH",
    "complexidade": "Média Complexidade (MAC)",
    "exigeCid": false,
    "exigeCns": true,
    "amostra": "Soro Sanguíneo",
    "tubo": "Tubo Amarelo (Gel Separador / Ativador de Coágulo)",
    "prazoEstimado": "Mesmo dia"
  },
  {
    "id": "hdl",
    "codigoSigtap": "0202010341",
    "codigoFormatado": "02.02.01.034-1",
    "nomeOficial": "DOSAGEM DE COLESTEROL HDL",
    "termoClinico": "Colesterol HDL",
    "sigla": "HDL",
    "categoria": "Bioquímica e Eletrólitos",
    "instrumento": "BPA-C / AIH",
    "complexidade": "Média Complexidade (MAC)",
    "exigeCid": false,
    "exigeCns": true,
    "amostra": "Soro Sanguíneo",
    "tubo": "Tubo Amarelo (Gel Separador / Ativador de Coágulo)",
    "prazoEstimado": "Mesmo dia"
  },
  {
    "id": "ldl",
    "codigoSigtap": "0202010350",
    "codigoFormatado": "02.02.01.035-0",
    "nomeOficial": "DOSAGEM DE COLESTEROL LDL",
    "termoClinico": "Colesterol LDL",
    "sigla": "LDL",
    "categoria": "Bioquímica e Eletrólitos",
    "instrumento": "BPA-C / AIH",
    "complexidade": "Média Complexidade (MAC)",
    "exigeCid": false,
    "exigeCns": true,
    "amostra": "Soro Sanguíneo",
    "tubo": "Tubo Amarelo (Gel Separador / Ativador de Coágulo)",
    "prazoEstimado": "Mesmo dia"
  },
  {
    "id": "trig",
    "codigoSigtap": "0202010678",
    "codigoFormatado": "02.02.01.067-8",
    "nomeOficial": "DOSAGEM DE TRIGLICERIDEOS",
    "termoClinico": "Triglicerídeos",
    "sigla": "TRIG",
    "categoria": "Bioquímica e Eletrólitos",
    "instrumento": "BPA-C / AIH",
    "complexidade": "Média Complexidade (MAC)",
    "exigeCid": false,
    "exigeCns": true,
    "amostra": "Soro Sanguíneo",
    "tubo": "Tubo Amarelo (Gel Separador / Ativador de Coágulo)",
    "prazoEstimado": "Mesmo dia"
  },
  {
    "id": "acurico",
    "codigoSigtap": "0202010104",
    "codigoFormatado": "02.02.01.010-4",
    "nomeOficial": "DOSAGEM DE ACIDO URICO",
    "termoClinico": "Ácido Úrico",
    "sigla": "ACURICO",
    "categoria": "Bioquímica e Eletrólitos",
    "instrumento": "BPA-C / AIH",
    "complexidade": "Média Complexidade (MAC)",
    "exigeCid": false,
    "exigeCns": true,
    "amostra": "Soro Sanguíneo",
    "tubo": "Tubo Amarelo (Gel Separador / Ativador de Coágulo)",
    "prazoEstimado": "Mesmo dia"
  },
  {
    "id": "gaso",
    "codigoSigtap": "0202010164",
    "codigoFormatado": "02.02.01.016-4",
    "nomeOficial": "DETERMINACAO DE PH E GASES SANGUINEOS",
    "termoClinico": "Gasometria Arterial / Venosa",
    "sigla": "GASO",
    "categoria": "Marcadores Cardíacos e Críticos",
    "instrumento": "BPA-I / AIH",
    "complexidade": "Média Complexidade (MAC)",
    "exigeCid": false,
    "exigeCns": true,
    "amostra": "Sangue Arterial / Venoso com Heparina",
    "tubo": "Seringa Heparinizada (Gelo)",
    "prazoEstimado": "1 a 2 horas (Urgência)"
  },
  {
    "id": "lac",
    "codigoSigtap": "0202010139",
    "codigoFormatado": "02.02.01.013-9",
    "nomeOficial": "DOSAGEM DE ACIDO LATICO (LACTATO)",
    "termoClinico": "Lactato",
    "sigla": "LAC",
    "categoria": "Marcadores Cardíacos e Críticos",
    "instrumento": "BPA-I / AIH",
    "complexidade": "Média Complexidade (MAC)",
    "exigeCid": false,
    "exigeCns": true,
    "amostra": "Plasma Fluoretado ou Soro",
    "tubo": "Tubo Cinza ou Amarelo",
    "prazoEstimado": "1 a 2 horas (Urgência)"
  },
  {
    "id": "pcr",
    "codigoSigtap": "0202030970",
    "codigoFormatado": "02.02.03.097-0",
    "nomeOficial": "DETERMINACAO QUANTITATIVA DE PROTEINA C REATIVA",
    "termoClinico": "PCR (Proteína C Reativa)",
    "sigla": "PCR",
    "categoria": "Marcadores Cardíacos e Críticos",
    "instrumento": "BPA-I / AIH",
    "complexidade": "Média Complexidade (MAC)",
    "exigeCid": false,
    "exigeCns": true,
    "amostra": "Soro Sanguíneo",
    "tubo": "Tubo Amarelo (Gel Separador / Ativador de Coágulo)",
    "prazoEstimado": "1 a 2 horas (Urgência)"
  },
  {
    "id": "pct",
    "codigoSigtap": "0202031119",
    "codigoFormatado": "02.02.03.111-9",
    "nomeOficial": "DOSAGEM DE PROCALCITONINA",
    "termoClinico": "Procalcitonina",
    "sigla": "PCT",
    "categoria": "Marcadores Cardíacos e Críticos",
    "instrumento": "BPA-I / AIH",
    "complexidade": "Alta Complexidade (MAC/APAC)",
    "exigeCid": true,
    "exigeCns": true,
    "amostra": "Soro Sanguíneo",
    "tubo": "Tubo Amarelo (Gel Separador / Ativador de Coágulo)",
    "prazoEstimado": "1 a 2 horas (Urgência)"
  },
  {
    "id": "cpk",
    "codigoSigtap": "0202010392",
    "codigoFormatado": "02.02.01.039-2",
    "nomeOficial": "DOSAGEM DE CREATINOFOSFOQUINASE (CPK)",
    "termoClinico": "CPK Total",
    "sigla": "CPK",
    "categoria": "Marcadores Cardíacos e Críticos",
    "instrumento": "BPA-C / AIH",
    "complexidade": "Média Complexidade (MAC)",
    "exigeCid": false,
    "exigeCns": true,
    "amostra": "Soro Sanguíneo",
    "tubo": "Tubo Amarelo (Gel Separador / Ativador de Coágulo)",
    "prazoEstimado": "1 a 2 horas (Urgência)"
  },
  {
    "id": "ckmb",
    "codigoSigtap": "0202010384",
    "codigoFormatado": "02.02.01.038-4",
    "nomeOficial": "DOSAGEM DE CREATINOFOSFOQUINASE FRACAO MB",
    "termoClinico": "CK-MB",
    "sigla": "CKMB",
    "categoria": "Marcadores Cardíacos e Críticos",
    "instrumento": "BPA-C / AIH",
    "complexidade": "Média Complexidade (MAC)",
    "exigeCid": false,
    "exigeCns": true,
    "amostra": "Soro Sanguíneo",
    "tubo": "Tubo Amarelo (Gel Separador / Ativador de Coágulo)",
    "prazoEstimado": "1 a 2 horas (Urgência)"
  },
  {
    "id": "trop",
    "codigoSigtap": "0202010686",
    "codigoFormatado": "02.02.01.068-6",
    "nomeOficial": "DOSAGEM DE TROPONINA",
    "termoClinico": "Troponina I ou T",
    "sigla": "TROP",
    "categoria": "Marcadores Cardíacos e Críticos",
    "instrumento": "BPA-I / AIH",
    "complexidade": "Média Complexidade (MAC)",
    "exigeCid": true,
    "exigeCns": true,
    "amostra": "Soro Sanguíneo",
    "tubo": "Tubo Amarelo (Gel Separador / Ativador de Coágulo)",
    "prazoEstimado": "1 a 2 horas (Urgência)"
  },
  {
    "id": "ldh",
    "codigoSigtap": "0202010422",
    "codigoFormatado": "02.02.01.042-2",
    "nomeOficial": "DOSAGEM DE DESIDROGENASE LATICA",
    "termoClinico": "DHL / LDH",
    "sigla": "LDH",
    "categoria": "Marcadores Cardíacos e Críticos",
    "instrumento": "BPA-C / AIH",
    "complexidade": "Média Complexidade (MAC)",
    "exigeCid": false,
    "exigeCns": true,
    "amostra": "Soro Sanguíneo",
    "tubo": "Tubo Amarelo (Gel Separador / Ativador de Coágulo)",
    "prazoEstimado": "1 a 2 horas (Urgência)"
  },
  {
    "id": "baar",
    "codigoSigtap": "0202080080",
    "codigoFormatado": "02.02.08.008-0",
    "nomeOficial": "BACILOSCOPIA DIRETA (BAAR)",
    "termoClinico": "Pesquisa de BAAR no Escarro",
    "sigla": "BAAR",
    "categoria": "Microbiologia e Culturas",
    "instrumento": "BPA-C / AIH",
    "complexidade": "Atenção Básica / MAC",
    "exigeCid": true,
    "exigeCns": true,
    "amostra": "Escarro matinal (amostra com escarro purulento)",
    "tubo": "Pote Universal Estéril",
    "prazoEstimado": "24 horas"
  },
  {
    "id": "trm-tb",
    "codigoSigtap": "0202080160",
    "codigoFormatado": "02.02.08.016-0",
    "nomeOficial": "TESTE RAPIDO MOLECULAR PARA TUBERCULOSE",
    "termoClinico": "TRM-TB (GeneXpert)",
    "sigla": "TRM-TB",
    "categoria": "Microbiologia e Culturas",
    "instrumento": "BPA-I / AIH",
    "complexidade": "Média Complexidade (MAC)",
    "exigeCid": true,
    "exigeCns": true,
    "amostra": "Escarro fresco (volume mínimo 1-2 mL)",
    "tubo": "Pote Universal Estéril com Tampa Rosca",
    "prazoEstimado": "24 horas"
  },
  {
    "id": "cult-tb",
    "codigoSigtap": "0202080055",
    "codigoFormatado": "02.02.08.005-5",
    "nomeOficial": "CULTURA DE BACTERIAS PARA IDENTIFICACAO DE MICOBACTERIAS",
    "termoClinico": "Cultura para Micobactérias",
    "sigla": "CULT-TB",
    "categoria": "Microbiologia e Culturas",
    "instrumento": "BPA-I / AIH",
    "complexidade": "Média Complexidade (MAC)",
    "exigeCid": true,
    "exigeCns": true,
    "amostra": "Escarro ou Lavado Broncoalveolar",
    "tubo": "Frasco Estéril",
    "prazoEstimado": "24h a 48h"
  },
  {
    "id": "ppd",
    "codigoSigtap": "0202070378",
    "codigoFormatado": "02.02.07.037-8",
    "nomeOficial": "TESTE DO DERIVADO PROTEICO PURIFICADO (PPD)",
    "termoClinico": "PPD (Prova Tuberculínica)",
    "sigla": "PPD",
    "categoria": "Microbiologia e Culturas",
    "instrumento": "BPA-C / AIH",
    "complexidade": "Atenção Básica / MAC",
    "exigeCid": true,
    "exigeCns": true,
    "amostra": "Aplicação intradérmica de Derivado Proteico Purificado",
    "tubo": "Aplicação Intradérmica (Leitura 72h)",
    "prazoEstimado": "24 horas"
  },
  {
    "id": "igra",
    "codigoSigtap": "0202031259",
    "codigoFormatado": "02.02.03.125-9",
    "nomeOficial": "ENSAIO DE LIBERACAO DE INTERFERON-GAMA (IGRA)",
    "termoClinico": "IGRA (QuantiFERON-TB)",
    "sigla": "IGRA",
    "categoria": "Microbiologia e Culturas",
    "instrumento": "BPA-I / APAC",
    "complexidade": "Alta Complexidade (MAC/APAC)",
    "exigeCid": true,
    "exigeCns": true,
    "amostra": "Sangue Total (Tubos específicos para teste QuantiFERON)",
    "tubo": "Kit 4 Tubos Específicos",
    "prazoEstimado": "24 horas"
  },
  {
    "id": "hmc",
    "codigoSigtap": "0202080071",
    "codigoFormatado": "02.02.08.007-1",
    "nomeOficial": "HEMOCULTURA",
    "termoClinico": "Hemocultura (por amostra)",
    "sigla": "HMC",
    "categoria": "Microbiologia e Culturas",
    "instrumento": "BPA-I / AIH",
    "complexidade": "Média Complexidade (MAC)",
    "exigeCid": false,
    "exigeCns": true,
    "amostra": "Sangue Total inoculado em frasco de hemocultura",
    "tubo": "Frascos Aeróbio + Anaeróbio",
    "prazoEstimado": "24h a 48h"
  },
  {
    "id": "urc",
    "codigoSigtap": "0202080020",
    "codigoFormatado": "02.02.08.002-0",
    "nomeOficial": "CULTURA DE BACTERIAS P/ IDENTIFICACAO (UROCULTURA)",
    "termoClinico": "Urocultura com Antibiograma (TSA)",
    "sigla": "URC",
    "categoria": "Microbiologia e Culturas",
    "instrumento": "BPA-C / AIH",
    "complexidade": "Média Complexidade (MAC)",
    "exigeCid": false,
    "exigeCns": true,
    "amostra": "Urina de Jato Médio após higiene íntima",
    "tubo": "Frasco Universal Estéril",
    "prazoEstimado": "24h a 48h"
  },
  {
    "id": "gram",
    "codigoSigtap": "0202080012",
    "codigoFormatado": "02.02.08.001-2",
    "nomeOficial": "BACTERIOSCOPIA (POR COLORACAO)",
    "termoClinico": "Coloração de Gram",
    "sigla": "GRAM",
    "categoria": "Microbiologia e Culturas",
    "instrumento": "BPA-C / AIH",
    "complexidade": "Média Complexidade (MAC)",
    "exigeCid": false,
    "exigeCns": true,
    "amostra": "Amostra clínica / secreção / raspado",
    "tubo": "Lâmina / Swab estéril",
    "prazoEstimado": "24 horas"
  },
  {
    "id": "hiv",
    "codigoSigtap": "0202030309",
    "codigoFormatado": "02.02.03.030-9",
    "nomeOficial": "PESQUISA DE ANTICORPOS CONTRA O VIRUS DA IMUNODEFICIENCIA HUMANA (HIV-1 OU HIV-2)",
    "termoClinico": "Sorologia Anti-HIV",
    "sigla": "HIV",
    "categoria": "Sorologias e Hormônios",
    "instrumento": "BPA-I / AIH",
    "complexidade": "Média Complexidade (MAC)",
    "exigeCid": true,
    "exigeCns": true,
    "amostra": "Soro Sanguíneo",
    "tubo": "Tubo Amarelo (Gel Separador / Ativador de Coágulo)",
    "prazoEstimado": "24 horas"
  },
  {
    "id": "vdrl",
    "codigoSigtap": "0202031118",
    "codigoFormatado": "02.02.03.111-8",
    "nomeOficial": "TESTE NAO TREPONEMICO P/ DETECCAO DE SIFILIS",
    "termoClinico": "VDRL",
    "sigla": "VDRL",
    "categoria": "Sorologias e Hormônios",
    "instrumento": "BPA-C / AIH",
    "complexidade": "Média Complexidade (MAC)",
    "exigeCid": true,
    "exigeCns": true,
    "amostra": "Soro Sanguíneo",
    "tubo": "Tubo Amarelo (Gel Separador / Ativador de Coágulo)",
    "prazoEstimado": "24 horas"
  },
  {
    "id": "fta-abs",
    "codigoSigtap": "0202031100",
    "codigoFormatado": "02.02.03.110-0",
    "nomeOficial": "TESTE TREPONEMICO P/ DETECCAO DE SIFILIS",
    "termoClinico": "FTA-ABS",
    "sigla": "FTA-ABS",
    "categoria": "Sorologias e Hormônios",
    "instrumento": "BPA-I / AIH",
    "complexidade": "Média Complexidade (MAC)",
    "exigeCid": true,
    "exigeCns": true,
    "amostra": "Soro Sanguíneo",
    "tubo": "Tubo Amarelo (Gel Separador / Ativador de Coágulo)",
    "prazoEstimado": "24 horas"
  },
  {
    "id": "hbsag",
    "codigoSigtap": "0202030783",
    "codigoFormatado": "02.02.03.078-3",
    "nomeOficial": "PESQUISA DE ANTIGENO DE SUPERFICIE DO VIRUS DA HEPATITE B (HBSAG)",
    "termoClinico": "HBsAg",
    "sigla": "HBSAG",
    "categoria": "Sorologias e Hormônios",
    "instrumento": "BPA-I / AIH",
    "complexidade": "Média Complexidade (MAC)",
    "exigeCid": true,
    "exigeCns": true,
    "amostra": "Soro Sanguíneo",
    "tubo": "Tubo Amarelo (Gel Separador / Ativador de Coágulo)",
    "prazoEstimado": "24 horas"
  },
  {
    "id": "anti-hcv",
    "codigoSigtap": "0202030759",
    "codigoFormatado": "02.02.03.075-9",
    "nomeOficial": "PESQUISA DE ANTICORPOS CONTRA O VIRUS DA HEPATITE C (ANTI-HCV)",
    "termoClinico": "Anti-HCV",
    "sigla": "ANTI-HCV",
    "categoria": "Sorologias e Hormônios",
    "instrumento": "BPA-I / AIH",
    "complexidade": "Média Complexidade (MAC)",
    "exigeCid": true,
    "exigeCns": true,
    "amostra": "Soro Sanguíneo",
    "tubo": "Tubo Amarelo (Gel Separador / Ativador de Coágulo)",
    "prazoEstimado": "24 horas"
  },
  {
    "id": "eas",
    "codigoSigtap": "0202050018",
    "codigoFormatado": "02.02.05.001-8",
    "nomeOficial": "ANALISE DE CARACTERES FISICOS, ELEMENTOS E SEDIMENTO DA URINA",
    "termoClinico": "EAS / Urina Tipo 1",
    "sigla": "EAS",
    "categoria": "Urinálise e Parasitologia",
    "instrumento": "BPA-C / AIH",
    "complexidade": "Média Complexidade (MAC)",
    "exigeCid": false,
    "exigeCns": true,
    "amostra": "Urina de Jato Médio (1ª da manhã ou 2h sem urinar)",
    "tubo": "Frasco Estéril Coletor",
    "prazoEstimado": "Mesmo dia"
  },
  {
    "id": "prot-24h",
    "codigoSigtap": "0202050115",
    "codigoFormatado": "02.02.05.011-5",
    "nomeOficial": "DETERMINACAO DE PROTEINURIA (24 HORAS)",
    "termoClinico": "Proteinúria de 24h",
    "sigla": "PROT-24H",
    "categoria": "Urinálise e Parasitologia",
    "instrumento": "BPA-C / AIH",
    "complexidade": "Média Complexidade (MAC)",
    "exigeCid": false,
    "exigeCns": true,
    "amostra": "Urina de 24 Horas",
    "tubo": "Galão Coletor de 24h",
    "prazoEstimado": "Mesmo dia"
  },
  {
    "id": "epf",
    "codigoSigtap": "0202050107",
    "codigoFormatado": "02.02.05.010-7",
    "nomeOficial": "EXAME PARASITOLOGICO DE FEZES",
    "termoClinico": "EPF (Parasitológico de Fezes)",
    "sigla": "EPF",
    "categoria": "Urinálise e Parasitologia",
    "instrumento": "BPA-C / AIH",
    "complexidade": "Média Complexidade (MAC)",
    "exigeCid": false,
    "exigeCns": true,
    "amostra": "Fezes frescas",
    "tubo": "Pote Coletor de Fezes",
    "prazoEstimado": "Mesmo dia"
  },
  {
    "id": "pso",
    "codigoSigtap": "0202050093",
    "codigoFormatado": "02.02.05.009-3",
    "nomeOficial": "PESQUISA DE SANGUE OCULTO NAS FEZES",
    "termoClinico": "Pesquisa de Sangue Oculto",
    "sigla": "PSO",
    "categoria": "Urinálise e Parasitologia",
    "instrumento": "BPA-C / AIH",
    "complexidade": "Média Complexidade (MAC)",
    "exigeCid": false,
    "exigeCns": true,
    "amostra": "Fezes frescas",
    "tubo": "Pote Coletor de Fezes",
    "prazoEstimado": "Mesmo dia"
  },
  {
    "id": "bhcg",
    "codigoSigtap": "0202060218",
    "codigoFormatado": "02.02.06.021-8",
    "nomeOficial": "DOSAGEM DE GONADOTROFINA CORIONICA HUMANA (HCG)",
    "termoClinico": "Beta-hCG",
    "sigla": "BHCG",
    "categoria": "Sorologias e Hormônios",
    "instrumento": "BPA-C / AIH",
    "complexidade": "Média Complexidade (MAC)",
    "exigeCid": false,
    "exigeCns": true,
    "amostra": "Soro Sanguíneo",
    "tubo": "Tubo Amarelo (Gel Separador / Ativador de Coágulo)",
    "prazoEstimado": "24 horas"
  },
  {
    "id": "tsh",
    "codigoSigtap": "0202060250",
    "codigoFormatado": "02.02.06.025-0",
    "nomeOficial": "DOSAGEM DE HORMONIO TIREOESTIMULANTE (TSH)",
    "termoClinico": "TSH",
    "sigla": "TSH",
    "categoria": "Sorologias e Hormônios",
    "instrumento": "BPA-I / AIH",
    "complexidade": "Média Complexidade (MAC)",
    "exigeCid": false,
    "exigeCns": true,
    "amostra": "Soro Sanguíneo",
    "tubo": "Tubo Amarelo (Gel Separador / Ativador de Coágulo)",
    "prazoEstimado": "24 horas"
  },
  {
    "id": "t4l",
    "codigoSigtap": "0202060382",
    "codigoFormatado": "02.02.06.038-2",
    "nomeOficial": "DOSAGEM DE TIROXINA LIVRE (T4 LIVRE)",
    "termoClinico": "T4 Livre",
    "sigla": "T4L",
    "categoria": "Sorologias e Hormônios",
    "instrumento": "BPA-I / AIH",
    "complexidade": "Média Complexidade (MAC)",
    "exigeCid": false,
    "exigeCns": true,
    "amostra": "Soro Sanguíneo",
    "tubo": "Tubo Amarelo (Gel Separador / Ativador de Coágulo)",
    "prazoEstimado": "24 horas"
  },
  {
    "id": "bnp",
    "codigoSigtap": "0202010716",
    "codigoFormatado": "02.02.01.071-6",
    "nomeOficial": "DOSAGEM DE PEPTIDEO NATRIURETICO TIPO B (BNP / NT-PROBNP)",
    "termoClinico": "BNP / NT-proBNP",
    "sigla": "BNP",
    "categoria": "Marcadores Cardíacos e Críticos",
    "instrumento": "BPA-I / AIH",
    "complexidade": "Média Complexidade (MAC)",
    "exigeCid": true,
    "exigeCns": true,
    "amostra": "Plasma com EDTA ou Soro",
    "tubo": "Tubo Roxo (EDTA)",
    "prazoEstimado": "1 a 2 horas (Urgência)"
  }
];

/**
 * Remove acentuação e converte para minúsculas para busca veloz
 */
export function normalizeSearchTerm(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}

/**
 * Busca omnibox inteligente por sigla, termo clínico, nome oficial ou código SIGTAP
 */
export function searchExames(query: string): ExameItem[] {
  const q = normalizeSearchTerm(query);
  if (!q) return EXAMES_CATALOGO;

  return EXAMES_CATALOGO.filter(item => {
    const siglaNorm = normalizeSearchTerm(item.sigla);
    const termoNorm = normalizeSearchTerm(item.termoClinico);
    const oficialNorm = normalizeSearchTerm(item.nomeOficial);
    const codigoLimpo = item.codigoSigtap;
    const codigoFormatado = item.codigoFormatado;

    // Correspondência exata da sigla tem prioridade máxima
    if (siglaNorm === q) return true;
    if (siglaNorm.startsWith(q)) return true;
    if (termoNorm.includes(q)) return true;
    if (oficialNorm.includes(q)) return true;
    if (codigoLimpo.includes(q.replace(/\D/g, ''))) return true;
    if (codigoFormatado.includes(q)) return true;
    return false;
  }).sort((a, b) => {
    // Coloca matches de sigla no topo
    const aSigla = normalizeSearchTerm(a.sigla);
    const bSigla = normalizeSearchTerm(b.sigla);
    if (aSigla === q) return -1;
    if (bSigla === q) return 1;
    if (aSigla.startsWith(q) && !bSigla.startsWith(q)) return -1;
    if (!aSigla.startsWith(q) && bSigla.startsWith(q)) return 1;
    return a.termoClinico.localeCompare(b.termoClinico);
  });
}

export function getExameById(id: string): ExameItem | undefined {
  return EXAMES_CATALOGO.find(e => e.id === id);
}

export function getExamesByCategoria(categoria: CategoriaExameKey): ExameItem[] {
  return EXAMES_CATALOGO.filter(e => e.categoria === categoria);
}
