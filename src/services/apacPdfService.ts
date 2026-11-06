import { PDFDocument, StandardFonts, rgb, PDFFont, PDFPage } from 'pdf-lib';
import { ApacData, DoctorProfile, PatientInfo } from '../types';
import { getTodayIso } from '../utils/dateUtils';
import { EXAMES_CATALOGO } from '../data/exames-catalogo';

/**
 * Presets rápidos de procedimentos ambulatoriais comuns (SIGTAP / SUS)
 * para acelerar o Cenário de Uso Principal (Regra 4).
 */
export interface ApacProcedurePreset {
  codigo: string;
  nome: string;
  qtde: string;
  cidSugerido?: string;
  descricaoDiagnosticoSugerida?: string;
}

export const APAC_COMMON_PROCEDURES: ApacProcedurePreset[] = [
  {
    codigo: '0206010079',
    nome: 'TOMOGRAFIA COMPUTADORIZADA DE CRANIO',
    qtde: '01',
    cidSugerido: 'R51',
    descricaoDiagnosticoSugerida: 'Investigacao diagnostica de cefaleia / sindrome neurologica a esclarecer'
  },
  {
    codigo: '0206020031',
    nome: 'TOMOGRAFIA COMPUTADORIZADA DE TORAX',
    qtde: '01',
    cidSugerido: 'A49.9',
    descricaoDiagnosticoSugerida: 'Infeccao a esclarecer / investigacao de foco pulmonar'
  },
  {
    codigo: '0206030010',
    nome: 'TOMOGRAFIA COMPUTADORIZADA DE ABDOME TOTAL',
    qtde: '01',
    cidSugerido: 'R10.4',
    descricaoDiagnosticoSugerida: 'Dor abdominal a esclarecer / investigacao diagnostica'
  },
  {
    codigo: '0206010010',
    nome: 'TOMOGRAFIA COMPUTADORIZADA DE COLUNA LOMBO-SACRA',
    qtde: '01',
    cidSugerido: 'M54.5',
    descricaoDiagnosticoSugerida: 'Dor lombar baixa / lombociatalgia em investigacao'
  },
  {
    codigo: '0204030153',
    nome: 'RADIOGRAFIA DE TORAX (PA E PERFIL)',
    qtde: '01',
    cidSugerido: 'J18.9',
    descricaoDiagnosticoSugerida: 'Sindrome respiratoria / infeccao respiratoria a esclarecer'
  },
  {
    codigo: '0207010064',
    nome: 'RESSONANCIA MAGNETICA DE CRANIO',
    qtde: '01',
    cidSugerido: 'G40.9',
    descricaoDiagnosticoSugerida: 'Investigacao neurologica especializada'
  },
  {
    codigo: '0207010048',
    nome: 'RESSONANCIA MAGNETICA DE COLUNA LOMBO-SACRA',
    qtde: '01',
    cidSugerido: 'M51.1',
    descricaoDiagnosticoSugerida: 'Investigacao de radiculopatia / discopatia lombar'
  },
  {
    codigo: '0205020046',
    nome: 'ULTRASSONOGRAFIA DE ABDOME TOTAL',
    qtde: '01',
    cidSugerido: 'R10.4',
    descricaoDiagnosticoSugerida: 'Dor abdominal a esclarecer'
  },
  {
    codigo: '0202010600',
    nome: 'EXAMES LABORATORIAIS / CULTURAS PARA INFECCAO A ESCLARECER',
    qtde: '01',
    cidSugerido: 'A49.9',
    descricaoDiagnosticoSugerida: 'Infeccao bacteriana nao especificada (Infeccao a esclarecer)'
  }
];

export interface ApacUnifiedProcedure {
  codigo: string; // 10 dígitos limpos (ex: 0206020031)
  codigoFormatado?: string;
  nome: string;
  qtde?: string;
  cidSugerido?: string;
  descricaoDiagnosticoSugerida?: string;
}

/**
 * Busca inteligente em todos os procedimentos da APAC e exames SADT (SIGTAP)
 * por código (10 dígitos) ou por nome clínico da solicitação.
 */
export function searchApacProcedures(query: string, limit = 8): ApacUnifiedProcedure[] {
  const rawQ = (query || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  const qDigits = (query || '').replace(/\D/g, '');
  const terms = rawQ.split(/\s+/).filter(Boolean);

  const results: ApacUnifiedProcedure[] = [];
  const seenCodes = new Set<string>();

  const matchesTerms = (target: string) => {
    if (terms.length === 0) return true;
    return terms.every(t => target.includes(t));
  };

  // 1. Presets de APAC (Tomografias, Ressonâncias, Radiografias, Ultrassons...)
  for (const preset of APAC_COMMON_PROCEDURES) {
    const normNome = preset.nome.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const cleanCod = preset.codigo.replace(/\D/g, '');
    const match = terms.length === 0 || matchesTerms(normNome) || (qDigits.length >= 3 && cleanCod.includes(qDigits));
    if (match && !seenCodes.has(cleanCod)) {
      results.push({
        codigo: cleanCod,
        nome: preset.nome,
        qtde: preset.qtde || '01',
        cidSugerido: preset.cidSugerido,
        descricaoDiagnosticoSugerida: preset.descricaoDiagnosticoSugerida
      });
      seenCodes.add(cleanCod);
      if (results.length >= limit) return results;
    }
  }

  // 2. Catálogo Oficial de Exames SADT (Creatinina, Ureia, Hemograma, Eletrólitos, Culturas...)
  for (const ex of EXAMES_CATALOGO) {
    const cleanCod = ex.codigoSigtap.replace(/\D/g, '');
    const normNome = ex.nomeOficial.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const normTermo = ex.termoClinico.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const normSigla = ex.sigla.toLowerCase();
    const fullSearchText = `${normNome} ${normTermo} ${normSigla}`;
    const match =
      terms.length === 0 ||
      matchesTerms(fullSearchText) ||
      normSigla === rawQ ||
      (qDigits.length >= 3 && cleanCod.includes(qDigits));

    if (match && !seenCodes.has(cleanCod)) {
      results.push({
        codigo: cleanCod,
        codigoFormatado: ex.codigoFormatado,
        nome: ex.nomeOficial,
        qtde: '01'
      });
      seenCodes.add(cleanCod);
      if (results.length >= limit) return results;
    }
  }

  return results;
}

/**
 * Encontra um procedimento pelo código exato ou pelo termo
 */
export function findApacProcedureByCodeOrName(input: string): ApacUnifiedProcedure | undefined {
  if (!input || !input.trim()) return undefined;
  const list = searchApacProcedures(input, 1);
  return list[0];
}

/**
 * Remove caracteres fora do conjunto WinAnsi (ISO-8859-1) suportado pelas StandardFonts do pdf-lib,
 * evitando exceções ao desenhar caracteres especiais.
 */
function sanitizePdfText(input?: string): string {
  if (!input) return '';
  return input
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[^\x20-\x7E\xA0-\xFF\n]/g, '')
    .trim();
}

/**
 * Converte data YYYY-MM-DD em partes [DD, MM, AAAA] ou retorna partes vazias se incompleta.
 */
function splitDateParts(dateStr?: string): [string, string, string] {
  if (!dateStr) return ['', '', ''];
  const clean = dateStr.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) {
    const [yyyy, mm, dd] = clean.split('-');
    return [dd, mm, yyyy];
  }
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(clean)) {
    const [dd, mm, yyyy] = clean.split('/');
    return [dd, mm, yyyy];
  }
  return [clean, '', ''];
}

/**
 * Separa um telefone "(91) 98888-7777" em [ddd, numeroLimpo].
 */
function splitPhone(phone?: string): [string, string] {
  if (!phone) return ['', ''];
  const digits = phone.replace(/\D/g, '');
  if (digits.length >= 10) {
    return [digits.slice(0, 2), digits.slice(2, 11)];
  }
  return ['', digits.slice(0, 9)];
}

/**
 * Desenha dígitos espaçados individualmente dentro das caixinhas (tick boxes) do formulário SUS.
 */
function drawBoxedDigits(
  page: PDFPage,
  font: PDFFont,
  rawText: string | undefined,
  startX: number,
  y: number,
  cellWidth: number,
  maxDigits: number,
  fontSize = 8.5
) {
  if (!rawText) return;
  const cleaned = sanitizePdfText(rawText).replace(/[^0-9A-Za-z]/g, '');
  if (!cleaned) return;
  const chars = cleaned.slice(0, maxDigits).split('');
  chars.forEach((ch, idx) => {
    const charWidth = font.widthOfTextAtSize(ch, fontSize);
    const cellCenterX = startX + idx * cellWidth + cellWidth / 2;
    page.drawText(ch, {
      x: cellCenterX - charWidth / 2,
      y,
      size: fontSize,
      font,
      color: rgb(0.05, 0.08, 0.18)
    });
  });
}

/**
 * Desenha texto simples com truncamento seguro na largura máxima do campo.
 */
function drawFieldText(
  page: PDFPage,
  font: PDFFont,
  text: string | undefined,
  x: number,
  y: number,
  maxWidth: number,
  fontSize = 8.5
) {
  const clean = sanitizePdfText(text);
  if (!clean) return;
  let fitted = clean;
  while (fitted.length > 1 && font.widthOfTextAtSize(fitted, fontSize) > maxWidth) {
    fitted = fitted.slice(0, -1);
  }
  page.drawText(fitted, {
    x,
    y,
    size: fontSize,
    font,
    color: rgb(0.05, 0.08, 0.18)
  });
}

/**
 * Desenha texto multilinha (ex.: Campo 36 Descrição do Diagnóstico e Campo 40 Observações).
 */
function drawMultilineFieldText(
  page: PDFPage,
  font: PDFFont,
  text: string | undefined,
  x: number,
  startY: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number,
  fontSize = 8
) {
  const clean = sanitizePdfText(text);
  if (!clean) return;

  const paragraphs = clean.split('\n');
  const lines: string[] = [];

  for (const para of paragraphs) {
    const words = para.split(/\s+/).filter(Boolean);
    if (words.length === 0) {
      lines.push('');
      continue;
    }
    let currentLine = words[0];
    for (let i = 1; i < words.length; i++) {
      const candidate = `${currentLine} ${words[i]}`;
      if (font.widthOfTextAtSize(candidate, fontSize) <= maxWidth) {
        currentLine = candidate;
      } else {
        lines.push(currentLine);
        currentLine = words[i];
      }
    }
    lines.push(currentLine);
  }

  lines.slice(0, maxLines).forEach((line, idx) => {
    page.drawText(line, {
      x,
      y: startY - idx * lineHeight,
      size: fontSize,
      font,
      color: rgb(0.05, 0.08, 0.18)
    });
  });
}

/**
 * Regra 3 — Preenchimento Automático (Contexto do Sistema):
 * Mescla o JSON do estado do React com as variáveis do médico logado e a data atual do sistema.
 */
export function mergeApacWithSystemContext(
  data: ApacData,
  doctor?: DoctorProfile,
  patient?: PatientInfo
): ApacData {
  const todayIso = getTodayIso();
  // Preferência do médico logado (fixo no login) ou seleção na tela
  const tipoDoc: 'CNS' | 'CPF' = doctor?.documentType || data.tipoDocumentoSolicitante || (doctor?.cns ? 'CNS' : 'CPF');
  const rawDoc = tipoDoc === 'CNS'
    ? (doctor?.cns || data.cnsProfissionalSolicitante || '')
    : (doctor?.cpf || data.cnsProfissionalSolicitante || '');
  const cleanDocNum = (rawDoc || '').replace(/\D/g, '');

  return {
    ...data,
    estabelecimentoSolicitante:
      data.estabelecimentoSolicitante || doctor?.clinicName || 'HOSPITAL ORDEM TERCEIRA',
    nomePaciente: data.nomePaciente || patient?.name || '',
    nomeProfissionalSolicitante:
      data.nomeProfissionalSolicitante || doctor?.fullName || '',
    dataSolicitacao: data.dataSolicitacao || todayIso,
    tipoDocumentoSolicitante: tipoDoc,
    cnsProfissionalSolicitante: cleanDocNum || data.cnsProfissionalSolicitante,
    registroConselhoSolicitante:
      data.registroConselhoSolicitante ||
      (doctor?.crm ? `CRM/${doctor.uf || 'PA'} ${doctor.crm}` : '')
  };
}

/**
 * Função principal em TypeScript que recebe o JSON do estado do React (ApacData),
 * injeta diretamente nas coordenadas exatas do template original `/templates/Formulario_APAC_LAUDO.pdf`
 * (595.28 x 841.89 pt, campos 1 a 55) usando `pdf-lib` e retorna os bytes do PDF pronto.
 */
export async function generateApacPdfBytes(
  rawApacData: ApacData,
  doctor?: DoctorProfile,
  patient?: PatientInfo,
  templateBuffer?: ArrayBuffer | Uint8Array
): Promise<Uint8Array> {
  const data = mergeApacWithSystemContext(rawApacData, doctor, patient);

  let pdfBytes: ArrayBuffer | Uint8Array;
  if (templateBuffer) {
    pdfBytes = templateBuffer;
  } else {
    const response = await fetch('/templates/Formulario_APAC_LAUDO.pdf');
    if (!response.ok) {
      throw new Error(`Falha ao carregar o template Formulario_APAC_LAUDO.pdf (${response.status})`);
    }
    pdfBytes = await response.arrayBuffer();
  }

  const pdfDoc = await PDFDocument.load(pdfBytes);
  const page = pdfDoc.getPage(0);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // ─────────────────────────────────────────────────────────────────────────
  // SEÇÃO 1: IDENTIFICAÇÃO DO ESTABELECIMENTO DE SAÚDE (SOLICITANTE) (Campos 1 e 2)
  // ─────────────────────────────────────────────────────────────────────────
  // 1 - Nome do Estabelecimento de Saúde Solicitante: Box x:[32.4..454.4] y:[735.8..754.2]
  drawFieldText(page, fontBold, data.estabelecimentoSolicitante.toUpperCase(), 36, 740, 412, 9);

  // 2 - CNES Solicitante (7 dígitos): Box x:[459.8..562.4] y:[735.8..754.2]
  drawBoxedDigits(page, fontBold, data.cnesSolicitante, 460, 740, 14.65, 7, 9);

  // ─────────────────────────────────────────────────────────────────────────
  // SEÇÃO 2: IDENTIFICAÇÃO DO PACIENTE (Campos 3 a 17)
  // ─────────────────────────────────────────────────────────────────────────
  // 3 - Nome do Paciente: Box x:[32.4..400.4] y:[694.9..713.1]
  drawFieldText(page, fontBold, data.nomePaciente.toUpperCase(), 36, 699.5, 360, 9.5);

  // 4 - Sexo (Mas. / Fem.): Box x:[402..474.7] y:[695.1..713.2]
  const sexoNorm = (data.sexo || '').toUpperCase();
  if (sexoNorm.startsWith('M')) {
    drawFieldText(page, fontBold, 'X', 423.5, 699.5, 12, 9.5);
  } else if (sexoNorm.startsWith('F')) {
    drawFieldText(page, fontBold, 'X', 459.5, 699.5, 12, 9.5);
  }

  // 5 - Nº do Prontuário: Box x:[476.8..562.4] y:[694.9..713.1]
  drawFieldText(page, fontBold, data.numeroProntuario, 480, 699.5, 78, 8.5);

  // 6 - Cartão Nacional de Saúde (CNS) (15 dígitos): Box x:[31.3..297.6] y:[671.4..689.6]
  drawBoxedDigits(page, fontBold, data.cpfOuCns, 32.2, 675, 17.7, 15, 8.5);

  // 7 - Data de Nascimento: Box x:[305.8..393.7] y:[671.4..689.6]
  const [nascDia, nascMes, nascAno] = splitDateParts(data.dataNascimento);
  drawFieldText(page, fontBold, nascDia, 314, 675, 20, 8.5);
  drawFieldText(page, fontBold, nascMes, 338, 675, 20, 8.5);
  drawFieldText(page, fontBold, nascAno, 361, 675, 30, 8.5);

  // 8 - Raça/Cor: Box x:[400.6..463.3] y:[672.6..689.6]
  drawFieldText(page, fontRegular, data.racaCor, 404, 675, 56, 8);

  // 8.1 - Etnia: Box x:[468.1..562.3] y:[672.6..690.4]
  drawFieldText(page, fontRegular, data.etnia, 471, 675, 88, 8);

  // 9 - Nome da Mãe: Box x:[32.4..400] y:[647.7..666]
  drawFieldText(page, fontRegular, data.nomeMae.toUpperCase(), 36, 651.5, 360, 8.5);

  // 10 - Telefone de Contato (DDD + Número): Box x:[404.2..562] y:[647.7..666]
  const [ddd1, tel1] = splitPhone(data.telefoneCelular);
  drawBoxedDigits(page, fontRegular, ddd1, 404.3, 650, 15.75, 2, 8);
  drawBoxedDigits(page, fontRegular, tel1, 435.8, 650, 15.75, 8, 8);

  // 11 - Nome do Responsável: Box x:[32.2..400.4] y:[623.1..641.4]
  drawFieldText(page, fontRegular, data.nomeResponsavel.toUpperCase(), 36, 627, 360, 8.5);

  // 12 - Telefone de Contato Responsável: Box x:[403.9..561.6] y:[623.1..641.4]
  const [ddd2, tel2] = splitPhone(data.telefoneContato);
  drawBoxedDigits(page, fontRegular, ddd2, 404.0, 625.5, 15.75, 2, 8);
  drawBoxedDigits(page, fontRegular, tel2, 435.5, 625.5, 15.75, 8, 8);

  // 13 - Endereço (Rua, Nº, Bairro): Box x:[32.4..562] y:[602..620.1]
  drawFieldText(page, fontRegular, data.endereco.toUpperCase(), 36, 606, 520, 8.5);

  // 14 - Município de Residência: Box x:[32.4..355] y:[577.6..595.9]
  drawFieldText(page, fontRegular, data.municipioResidencia.toUpperCase(), 36, 581, 314, 8.5);

  // 15 - Cód. IBGE Município: Box x:[354.7..436] y:[577.6..595.9]
  drawFieldText(page, fontRegular, data.codIbgeMunicipio, 362, 581, 70, 8.5);

  // 16 - UF: Box x:[436..469.8] y:[577.6..595.9]
  drawFieldText(page, fontBold, data.uf.toUpperCase(), 446, 581, 22, 8.5);

  // 17 - CEP (8 dígitos): Box x:[469.6..562] y:[577.6..595.9]
  drawBoxedDigits(page, fontRegular, data.cep, 469.8, 580, 11.5, 8, 8);

  // ─────────────────────────────────────────────────────────────────────────
  // SEÇÃO 3: PROCEDIMENTO SOLICITADO (Campos 18, 19 e 20)
  // ─────────────────────────────────────────────────────────────────────────
  // 18 - Código do Procedimento Principal (10 dígitos): Box x:[32.4..211.6] y:[534.6..555.2]
  drawBoxedDigits(page, fontBold, data.codigoProcedimentoPrincipal, 32.5, 538.5, 16.2, 10, 8.5);

  // 19 - Nome do Procedimento Principal: Box x:[215.8..495] y:[534.6..555.2]
  drawFieldText(page, fontBold, data.nomeProcedimentoPrincipal.toUpperCase(), 219, 539, 272, 9);

  // 20 - Qtde Principal: Box x:[499.2..553.4] y:[534.6..555.2]
  drawFieldText(page, fontBold, data.quantidadePrincipal, 518, 539, 32, 9);

  // ─────────────────────────────────────────────────────────────────────────
  // SEÇÃO 4: PROCEDIMENTO(S) SECUNDÁRIO(S) (Campos 21 a 35 — até 5 linhas)
  // ─────────────────────────────────────────────────────────────────────────
  const secRowYs = [494.5, 468, 441.5, 415, 388.5];
  (data.procedimentosSecundarios || []).slice(0, 5).forEach((item, index) => {
    const rowY = secRowYs[index];
    if (item.codigo) {
      drawBoxedDigits(page, fontRegular, item.codigo, 32.5, rowY, 16.2, 10, 8);
    }
    if (item.nome) {
      drawFieldText(page, fontRegular, item.nome.toUpperCase(), 219, rowY, 290, 8);
    }
    if (item.quantidade) {
      drawFieldText(page, fontRegular, item.quantidade, 528, rowY, 30, 8);
    }
  });

  // ─────────────────────────────────────────────────────────────────────────
  // SEÇÃO 5: JUSTIFICATIVA DO(S) PROCEDIMENTO(S) SOLICITADO(S) (Campos 36 a 40)
  // ─────────────────────────────────────────────────────────────────────────
  // 36 - Descrição do Diagnóstico: Box x:[32.4..336.4] y:[335.8..358.6]
  drawMultilineFieldText(page, fontBold, data.descricaoDiagnostico.toUpperCase(), 36, 344, 295, 9, 2, 8.5);

  // 37 - CID10 Principal: Box x:[336.1..398.2] y:[335.8..358.6]
  drawFieldText(page, fontBold, data.cid10Principal.toUpperCase(), 348, 342, 48, 10);

  // 38 - CID10 Secundário: Box x:[397.9..467.6] y:[335.8..358.6]
  drawFieldText(page, fontBold, data.cid10Secundario.toUpperCase(), 412, 342, 50, 9.5);

  // 39 - CID10 Causas Associadas: Box x:[467.3..562.4] y:[335.8..358.6]
  drawFieldText(page, fontBold, data.cid10CausasAssociadas.toUpperCase(), 482, 342, 72, 9.5);

  // 40 - Observações: Box x:[32.4..562.4] y:[245.1..328.2]
  drawMultilineFieldText(page, fontRegular, data.observacoes, 36, 312, 520, 12, 5, 8.5);

  // ─────────────────────────────────────────────────────────────────────────
  // SEÇÃO 6: SOLICITAÇÃO (Campos 41 a 45 — Preenchimento Automático pela Regra 3)
  // ─────────────────────────────────────────────────────────────────────────
  // 41 - Nome do Profissional Solicitante: Box x:[32.5..298.1] y:[200.6..218.8]
  drawFieldText(page, fontBold, data.nomeProfissionalSolicitante.toUpperCase(), 36, 204.5, 258, 9);

  // 42 - Data da Solicitação: Box x:[301.2..382] y:[200.6..218.8]
  const [solDia, solMes, solAno] = splitDateParts(data.dataSolicitacao);
  drawFieldText(page, fontBold, solDia, 308, 204.5, 18, 8.5);
  drawFieldText(page, fontBold, solMes, 331, 204.5, 18, 8.5);
  drawFieldText(page, fontBold, solAno, 353, 204.5, 28, 8.5);

  // 43 - Documento (CNS / CPF): O template original já tem um 'X' em CNS (x=54, y=180).
  // Se o médico usar CPF, cobrimos o X de CNS com branco e marcamos CPF.
  if (data.tipoDocumentoSolicitante === 'CPF') {
    page.drawRectangle({ x: 51, y: 179, width: 10, height: 11, color: rgb(1, 1, 1) });
    drawFieldText(page, fontBold, 'X', 103.5, 182.5, 10, 9);
  }

  // 44 - Nº Documento (CNS/CPF) do Profissional Solicitante: Box x:[145.6..382] y:[177.1..195.3]
  drawBoxedDigits(page, fontBold, data.cnsProfissionalSolicitante, 145.7, 181, 15.7, 15, 8.5);

  // 45 - Assinatura e Carimbo (Nº Registro do Conselho): Box x:[384.5..562.4] y:[177.1..219.7]
  // CAMPO 45 FICA EM BRANCO para assinatura e carimbo físico manual do profissional solicitante.

  // ─────────────────────────────────────────────────────────────────────────
  // SEÇÃO 7: AUTORIZAÇÃO (Campos 46 a 53 — Opcionais)
  // ─────────────────────────────────────────────────────────────────────────
  // 46 - Nome do Profissional Autorizador: Box x:[32.5..287.5] y:[132.7..147.6]
  drawFieldText(page, fontRegular, data.nomeProfissionalAutorizador.toUpperCase(), 36, 135.5, 246, 8);

  // 47 - Cód. Órgão Emissor: Box x:[287.3..378] y:[132.7..147.6]
  drawFieldText(page, fontRegular, data.codOrgaoEmissor, 292, 135.5, 80, 8);

  // 48 - Documento Autorizador (CNS / CPF)
  if (data.tipoDocumentoAutorizador === 'CNS') {
    drawFieldText(page, fontBold, 'X', 52, 105.5, 10, 8.5);
  } else if (data.tipoDocumentoAutorizador === 'CPF') {
    drawFieldText(page, fontBold, 'X', 103.5, 105.5, 10, 8.5);
  }

  // 49 - Nº Documento (CNS/CPF) do Profissional Autorizador: Box x:[145.6..378] y:[98..121]
  drawBoxedDigits(page, fontRegular, data.cnsProfissionalAutorizador, 145.7, 102, 15.7, 15, 8);

  // 50 - Data da Autorização: Box x:[32.5..118.2] y:[65..82.5]
  const [autDia, autMes, autAno] = splitDateParts(data.dataAutorizacao);
  drawFieldText(page, fontRegular, autDia, 40, 68, 18, 8);
  drawFieldText(page, fontRegular, autMes, 62, 68, 18, 8);
  drawFieldText(page, fontRegular, autAno, 84, 68, 28, 8);

  // 51 - Assinatura e Carimbo Autorizador: Box x:[118..378] y:[65..82.5]
  drawFieldText(page, fontRegular, data.registroConselhoAutorizador, 124, 68, 245, 8);

  // 52 - Nº da Autorização (APAC): Box x:[384..562] y:[82.3..153.1]
  drawFieldText(page, fontBold, data.numeroAutorizacaoApac, 395, 112, 158, 10);

  // 53 - Período de Validade da APAC: Box x:[385..562.4] y:[64.3..79.4]
  const [valIniD, valIniM, valIniA] = splitDateParts(data.periodoValidadeInicio);
  const [valFimD, valFimM, valFimA] = splitDateParts(data.periodoValidadeFim);
  if (valIniD) {
    drawFieldText(page, fontRegular, `${valIniD}/${valIniM}/${valIniA}`, 395, 67, 70, 7.5);
  }
  if (valFimD) {
    drawFieldText(page, fontRegular, `${valFimD}/${valFimM}/${valFimA}`, 488, 67, 70, 7.5);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SEÇÃO 8: IDENTIFICAÇÃO DO ESTABELECIMENTO EXECUTANTE (Campos 54 e 55)
  // ─────────────────────────────────────────────────────────────────────────
  // 54 - Nome Fantasia do Estabelecimento de Saúde Executante: Box x:[35.8..423] y:[28.3..41.6]
  drawFieldText(page, fontRegular, data.nomeFantasiaExecutante.toUpperCase(), 38, 31, 380, 8);

  // 55 - CNES Executante (7 dígitos): Box x:[440.8..543.4] y:[27.8..41.1]
  drawBoxedDigits(page, fontRegular, data.cnesExecutante, 441, 31, 14.65, 7, 8);

  return await pdfDoc.save();
}

/**
 * Gera o PDF oficial mesclado via `pdf-lib` e dispara o download imediato no navegador.
 */
export async function downloadApacPdf(
  apacData: ApacData,
  doctor?: DoctorProfile,
  patient?: PatientInfo
): Promise<void> {
  const bytes = await generateApacPdfBytes(apacData, doctor, patient);
  const blob = new Blob([bytes as unknown as BlobPart], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);

  const safeName = (apacData.nomePaciente || patient?.name || 'PACIENTE')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .toUpperCase();

  const a = document.createElement('a');
  a.href = url;
  a.download = `LAUDO_APAC_${safeName}_${getTodayIso()}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

/**
 * Gera o PDF oficial mesclado via `pdf-lib` e abre diretamente a caixa de diálogo de impressão nativa.
 */
export async function printApacPdf(
  apacData: ApacData,
  doctor?: DoctorProfile,
  patient?: PatientInfo
): Promise<void> {
  const bytes = await generateApacPdfBytes(apacData, doctor, patient);
  const blob = new Blob([bytes as unknown as BlobPart], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);

  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.src = url;

  document.body.appendChild(iframe);

  iframe.onload = () => {
    setTimeout(() => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch {
        window.open(url, '_blank');
      }
    }, 250);
  };
}
