import { CidItem } from '../types';
import rawCidData from './cid10_full.json';

/**
 * Catálogo Oficial Completo do CID-10 DATASUS (12.430 registros)
 * Extraído diretamente da publicação oficial sem exclusão de qualquer patologia.
 */
export const CID10_DATABASE: CidItem[] = rawCidData as CidItem[];

export const COMMON_DIAGNOSTIC_PRESETS: { label: string; code: string; description: string }[] = [
  { label: 'Infecção a esclarecer', code: 'A49.9', description: 'Infecção bacteriana não especificada (Infecção a esclarecer / foco a esclarecer)' },
  { label: 'IVAS / Gripe', code: 'J06.9', description: 'Infecção aguda das vias aéreas superiores (IVAS) não especificada' },
  { label: 'Pneumonia', code: 'J18.9', description: 'Pneumonia não especificada' },
  { label: 'Amigdalite', code: 'J03.9', description: 'Amigdalite aguda não especificada' },
  { label: 'Sinusite Aguda', code: 'J01.9', description: 'Sinusite aguda não especificada' },
  { label: 'Gastroenterite', code: 'A09', description: 'Diarreia e gastroenterite de origem infecciosa presumível' },
  { label: 'Lombalgia', code: 'M54.5', description: 'Dor lombar baixa (Lombalgia aguda ou crônica)' },
  { label: 'Cefaleia / Enxaqueca', code: 'R51', description: 'Cefaleia (Dor de cabeça)' },
  { label: 'ITU / Cistite', code: 'N39.0', description: 'Infecção do trato urinário (ITU) de localização não especificada' },
  { label: 'Gastrite / Azia', code: 'K29.7', description: 'Gastrite não especificada' },
  { label: 'Crise Asmática', code: 'J45.9', description: 'Asma não especificada (Crise asmática)' },
  { label: 'Hipertensão (HAS)', code: 'I10', description: 'Hipertensão essencial (primária) / Pressão alta' },
  { label: 'Diabetes Tipo 2', code: 'E11.9', description: 'Diabetes mellitus não-insulino-dependente (Tipo 2) sem complicações' },
  { label: 'Ansiedade', code: 'F41.1', description: 'Ansiedade generalizada' },
  { label: 'Aptidão Física', code: 'Z02.5', description: 'Exame para participação em esportes (Aptidão física)' }
];

/**
 * Mapeamento de termos clínicos populares, abreviações médicas e sinônimos para CID-10
 */
export const CLINICAL_TERM_ALIASES: { keywords: string[]; code: string }[] = [
  { keywords: ['iam', 'infarto', 'infarto agudo', 'ataque cardiaco'], code: 'I21.9' },
  { keywords: ['avc', 'ave', 'derrame', 'acidente vascular'], code: 'I64' },
  { keywords: ['has', 'pressao alta', 'hipertensao', 'hipertensao arterial'], code: 'I10' },
  { keywords: ['dm', 'dm2', 'diabetes', 'diabete', 'diabetes tipo 2', 'glicemia alta'], code: 'E11.9' },
  { keywords: ['dm1', 'diabetes tipo 1'], code: 'E10.9' },
  { keywords: ['cetoacidose', 'cetoacidose diabetica', 'cad'], code: 'E14.1' },
  { keywords: ['itu', 'infeccao urinaria', 'cistite', 'urina solta'], code: 'N39.0' },
  { keywords: ['calculo renal', 'colica renal', 'colica nefretica', 'pedra no rim', 'pedra nos rins', 'nefrolitiase'], code: 'N23' },
  { keywords: ['dpoc', 'enfisema'], code: 'J44.9' },
  { keywords: ['asma', 'crise asmatica', 'broncoespasmo', 'falta de ar'], code: 'J45.9' },
  { keywords: ['pneumonia', 'pac'], code: 'J18.9' },
  { keywords: ['ivas', 'infeccao de vias aereas', 'resfriado'], code: 'J06.9' },
  { keywords: ['gripe', 'influenza'], code: 'J11.1' },
  { keywords: ['amigdalite', 'dor de garganta', 'faringoamigdalite'], code: 'J03.9' },
  { keywords: ['sinusite', 'rinossinusite'], code: 'J01.9' },
  { keywords: ['geca', 'diarreia', 'gastroenterite', 'virose', 'desarranjo'], code: 'A09' },
  { keywords: ['gastrite', 'queimacao', 'azia'], code: 'K29.7' },
  { keywords: ['refluxo', 'drge'], code: 'K21.9' },
  { keywords: ['apendicite', 'apendicite aguda'], code: 'K35.8' },
  { keywords: ['colecistite', 'colecistite aguda'], code: 'K81.0' },
  { keywords: ['colelitiase', 'pedra na vesicula'], code: 'K80.2' },
  { keywords: ['pancreatite', 'pancreatite aguda'], code: 'K85.9' },
  { keywords: ['sepse', 'choque septico', 'septicemia'], code: 'A41.9' },
  { keywords: ['erisipela'], code: 'A46' },
  { keywords: ['celulite', 'celulite infecciosa'], code: 'L03.9' },
  { keywords: ['dengue'], code: 'A90' },
  { keywords: ['lombalgia', 'dor lombar', 'dor nas costas', 'dor na coluna', 'lumbago'], code: 'M54.5' },
  { keywords: ['cervicalgia', 'dor no pescoco', 'torcicolo'], code: 'M54.2' },
  { keywords: ['fibromialgia'], code: 'M79.7' },
  { keywords: ['mialgia', 'dor muscular'], code: 'M79.1' },
  { keywords: ['tendinite', 'tenossinovite'], code: 'M65.9' },
  { keywords: ['manguito', 'manguito rotador', 'tendinite no ombro'], code: 'M75.1' },
  { keywords: ['cefaleia', 'dor de cabeca'], code: 'R51' },
  { keywords: ['enxaqueca', 'migranea'], code: 'G43.9' },
  { keywords: ['ansiedade', 'tag', 'crise de ansiedade'], code: 'F41.1' },
  { keywords: ['panico', 'sindrome do panico'], code: 'F41.0' },
  { keywords: ['depressao', 'quadro depressivo'], code: 'F32.9' },
  { keywords: ['insonia'], code: 'F51.0' },
  { keywords: ['infeccao a esclarecer', 'foco a esclarecer', 'foco infeccioso a esclarecer'], code: 'A49.9' },
  { keywords: ['insuficiencia cardiaca', 'icc', 'descompensacao cardiaca'], code: 'I50.9' },
  { keywords: ['angina', 'dor no peito anginosa', 'angina estavel'], code: 'I20.9' },
  { keywords: ['angina instavel'], code: 'I20.0' },
  { keywords: ['tvp', 'trombose', 'trombose venosa profunda'], code: 'I80.2' },
  { keywords: ['tep', 'embolia pulmonar', 'tromboembolismo pulmonar'], code: 'I26.9' },
  { keywords: ['ira', 'insuficiencia renal aguda'], code: 'N17.9' },
  { keywords: ['drc', 'doenca renal cronica'], code: 'N18.9' },
  { keywords: ['desidratacao'], code: 'E86' },
  { keywords: ['convulsao', 'crise convulsiva', 'epilepsia'], code: 'G40.9' },
  { keywords: ['urticaria', 'alergia na pele'], code: 'L50.9' },
  { keywords: ['conjuntivite', 'olho vermelho'], code: 'H10.9' },
  { keywords: ['otite', 'dor de ouvido'], code: 'H66.9' },
  { keywords: ['vertigem', 'labirintite', 'tontura'], code: 'H81.1' },
  { keywords: ['febre'], code: 'R50.9' },
  { keywords: ['covid', 'covid-19', 'coronavirus', 'sars-cov-2'], code: 'U07.1' }
];

export function normalizeStr(str: string): string {
  return (str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

// Índice otimizado O(1) em memória para busca instantânea de códigos e termos
interface CidIndexedItem {
  item: CidItem;
  cleanCode: string;       // ex: 'j189'
  normCode: string;        // ex: 'j18.9'
  normDesc: string;        // ex: 'pneumonia nao especificada'
  normCat: string;         // ex: 'respiratorias'
}

const CID_BY_CODE_MAP = new Map<string, CidItem>();
export const INDEXED_CID_LIST: CidIndexedItem[] = [];

// Inicialização imediata do índice
for (let i = 0; i < CID10_DATABASE.length; i++) {
  const item = CID10_DATABASE[i];
  const clean = item.code.toUpperCase().replace(/[\s.]/g, '');
  const withDot = item.code.toUpperCase().trim();

  // Indexação rápida por código limpo e com ponto
  if (!CID_BY_CODE_MAP.has(clean)) {
    CID_BY_CODE_MAP.set(clean, item);
  }
  if (!CID_BY_CODE_MAP.has(withDot)) {
    CID_BY_CODE_MAP.set(withDot, item);
  }

  INDEXED_CID_LIST.push({
    item,
    cleanCode: clean.toLowerCase(),
    normCode: normalizeStr(item.code),
    normDesc: normalizeStr(item.description),
    normCat: normalizeStr(item.category)
  });
}

/**
 * Encontra um CID pelo código com tolerância a pontos e maiúsculas/minúsculas.
 * Ex: 'J189' -> J18.9, 'j18.9' -> J18.9, 'i10' -> I10
 */
export function findCidByCode(code: string): CidItem | undefined {
  if (!code) return undefined;
  const clean = code.toUpperCase().trim().replace(/[\s.]/g, '');
  if (!clean) return undefined;

  // 1. Busca exata O(1) pelo código
  const exact = CID_BY_CODE_MAP.get(clean) || CID_BY_CODE_MAP.get(code.toUpperCase().trim());
  if (exact) return exact;

  // 2. Busca por prefixo se tiver pelo menos 3 caracteres (ex: 'J18' -> 'J18.0' ou 'J18.9')
  if (clean.length >= 3) {
    const cleanLower = clean.toLowerCase();
    const prefix = INDEXED_CID_LIST.find(entry => entry.cleanCode.startsWith(cleanLower));
    if (prefix) return prefix.item;
  }

  return undefined;
}

/**
 * Encontra um CID pelo nome clínico da patologia, sinônimo ou termo de busca.
 * Ex: 'pneumonia' -> J18.9, 'hipertensão' -> I10, 'lombalgia' -> M54.5, 'dengue' -> A90
 */
export function findCidByTerm(term: string): CidItem | undefined {
  if (!term) return undefined;
  const q = normalizeStr(term);
  if (!q) return undefined;

  // 1. Verifica se foi digitado diretamente um código CID
  const directCid = findCidByCode(term);
  if (directCid) return directCid;

  // 2. Busca nos aliases clínicos de alta precisão
  for (const alias of CLINICAL_TERM_ALIASES) {
    const matched = alias.keywords.some(k => {
      const normK = normalizeStr(k);
      return q === normK || q.startsWith(normK) || normK.startsWith(q);
    });
    if (matched) {
      const item = findCidByCode(alias.code);
      if (item) return item;
    }
  }

  // 3. Busca por correspondência exata na descrição
  const exactDesc = INDEXED_CID_LIST.find(entry => entry.normDesc === q);
  if (exactDesc) return exactDesc.item;

  // 4. Busca se a descrição começa com o termo
  const startsWithDesc = INDEXED_CID_LIST.find(entry => entry.normDesc.startsWith(q));
  if (startsWithDesc) return startsWithDesc.item;

  // 5. Busca por palavra-chave na descrição
  const keywordMatch = INDEXED_CID_LIST.find(entry => entry.normDesc.includes(q));
  if (keywordMatch) return keywordMatch.item;

  return undefined;
}

/**
 * Resolve bidirecionalmente uma entrada que pode ser tanto código CID quanto nome de patologia.
 * Retorna `{ code: string, description: string }` se houver correspondência, ou `null`.
 */
export function resolveCidAndDescription(input: string): { code: string; description: string } | null {
  if (!input || !input.trim()) return null;
  const trimmed = input.trim();

  // Se tem padrão de código CID (ex: J18, J18.9, I10, A499)
  if (/^[A-Za-z]\d{2}(\.?\d{1,2})?$/i.test(trimmed)) {
    const byCode = findCidByCode(trimmed);
    if (byCode) return { code: byCode.code, description: byCode.description };
  }

  // Tenta pelo código primeiro
  const byCode = findCidByCode(trimmed);
  if (byCode) return { code: byCode.code, description: byCode.description };

  // Tenta pelo termo da patologia
  const byTerm = findCidByTerm(trimmed);
  if (byTerm) return { code: byTerm.code, description: byTerm.description };

  return null;
}
