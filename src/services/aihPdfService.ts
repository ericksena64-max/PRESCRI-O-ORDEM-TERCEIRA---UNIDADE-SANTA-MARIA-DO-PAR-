import { PDFDocument, StandardFonts, rgb, PDFFont, PDFPage } from 'pdf-lib';
import { AihData, DoctorProfile, PatientInfo } from '../types';
import { getTodayIso } from '../utils/dateUtils';

export interface AihProcedurePreset {
  codigo: string;
  descricao: string;
  clinica: string;
  cidPrincipalSugerido: string;
  diagnosticoSugerido: string;
  principaisSinaisSintomasSugerido: string;
  condicoesJustificamSugerido: string;
}

export const AIH_COMMON_PROCEDURES: AihProcedurePreset[] = [
  {
    codigo: '03.03.01.015-8',
    descricao: 'TRATAMENTO DE PNEUMONIA OU INFECCAO RESPIRATORIA AGUDA',
    clinica: '01 - CLINICA MEDICA',
    cidPrincipalSugerido: 'J18.9',
    diagnosticoSugerido: 'Pneumonia bacteriana adquirida na comunidade',
    principaisSinaisSintomasSugerido: 'Febre persistente, tosse produtiva mucopurulenta, dispneia e dor toracica ventilatorio-dependente.',
    condicoesJustificamSugerido: 'Quadro infeccioso respiratorio agudo com necessidade de antibioticoterapia parenteral supervisionada e oxigenoterapia.'
  },
  {
    codigo: '03.03.01.022-0',
    descricao: 'TRATAMENTO DE INFECCAO A ESCLARECER / SEPSE',
    clinica: '01 - CLINICA MEDICA',
    cidPrincipalSugerido: 'A49.9',
    diagnosticoSugerido: 'Infeccao bacteriana nao especificada (Infeccao a esclarecer)',
    principaisSinaisSintomasSugerido: 'Febre alta diaria, taquicardia, prostracao importante, leucocitose com desvio a esquerda e foco infeccioso em investigacao.',
    condicoesJustificamSugerido: 'Sindrome infecciosa aguda com criterios de resposta inflamatoria sistemica, demandando investigacao diagnostica intrahospitalar e antibioticoterapia venosa.'
  },
  {
    codigo: '03.03.06.019-8',
    descricao: 'TRATAMENTO DE INSUFICIENCIA CARDIACA CONGESTIVA DESCOMPENSADA',
    clinica: '01 - CLINICA MEDICA',
    cidPrincipalSugerido: 'I50.0',
    diagnosticoSugerido: 'Insuficiencia cardiaca congestiva descompensada',
    principaisSinaisSintomasSugerido: 'Dispneia progressiva em repouso, ortopneia, edema acentuado de membros inferiores e estertoracao bibasal.',
    condicoesJustificamSugerido: 'Descompensacao clinica e hemodinamica (perfil B/C) necessitando de diuréticos de alca parenterais, vasodilatadores e monitorizacao.'
  },
  {
    codigo: '03.03.04.018-9',
    descricao: 'TRATAMENTO DE INFECCAO DO TRATO URINARIO ALTA / PIELONEFRITE',
    clinica: '01 - CLINICA MEDICA',
    cidPrincipalSugerido: 'N10',
    diagnosticoSugerido: 'Pielonefrite aguda nao obstrutiva',
    principaisSinaisSintomasSugerido: 'Febre com calafrios, dor lombar intensa unilateral com sinal de Giordano positivo, disuria e nauseas.',
    condicoesJustificamSugerido: 'Infeccao urinaria complicada alta com intolerancia a via oral, demandando hidratacao e antibioticoterapia endovenosa.'
  },
  {
    codigo: '04.07.01.004-4',
    descricao: 'APENDICECTOMIA DE URGENCIA',
    clinica: '02 - CIRURGICA',
    cidPrincipalSugerido: 'K35.8',
    diagnosticoSugerido: 'Apendicite aguda',
    principaisSinaisSintomasSugerido: 'Dor abdominal periumbilical irradiada para fossa iliaca direita com descompressao dolorosa (sinal de Blumberg positivo) e febre.',
    condicoesJustificamSugerido: 'Abdome agudo inflamatorio cirurgico com indicacao formal de laparotomia / apendicectomia de urgencia.'
  },
  {
    codigo: '04.07.03.003-7',
    descricao: 'COLECISTECTOMIA',
    clinica: '02 - CIRURGICA',
    cidPrincipalSugerido: 'K80.0',
    diagnosticoSugerido: 'Colecistite calculosa aguda',
    principaisSinaisSintomasSugerido: 'Dor intensa em hipocondrio direito com sinal de Murphy positivo, febre, nauseas e vômitos refratarios.',
    condicoesJustificamSugerido: 'Abdome agudo colecistico com espessamento da parede vesicular ao ultrassom, necessitando intervencao cirurgica.'
  },
  {
    codigo: '03.10.01.003-9',
    descricao: 'PARTO NORMAL (ASSISTENCIA AO PARTO SEM DISTOCIA)',
    clinica: '03 - OBSTETRICA',
    cidPrincipalSugerido: 'O80.0',
    diagnosticoSugerido: 'Parto unico espontaneo cefalico',
    principaisSinaisSintomasSugerido: 'Contracoes uterinas ritmicas e dolorosas frequentes (3 em 10 min), dilatacao cervical progressiva e perda de tampao mucoso.',
    condicoesJustificamSugerido: 'Trabalho de parto ativo em curso, necessitando de internacao obstetrica e monitoramento feto-materno.'
  }
];

function sanitizePdfText(input?: string): string {
  if (!input) return '';
  return input
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[^\x20-\x7E\xA0-\xFF\n]/g, '')
    .trim();
}

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

function splitPhone(phone?: string): [string, string] {
  if (!phone) return ['', ''];
  const digits = phone.replace(/\D/g, '');
  if (digits.length >= 10) {
    return [digits.slice(0, 2), digits.slice(2, 11)];
  }
  return ['', digits.slice(0, 9)];
}

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

export function mergeAihWithSystemContext(
  data: AihData,
  doctor?: DoctorProfile,
  patient?: PatientInfo
): AihData {
  const todayIso = getTodayIso();
  return {
    ...data,
    estabelecimentoSolicitante:
      data.estabelecimentoSolicitante || doctor?.clinicName || 'HOSPITAL ORDEM TERCEIRA',
    cnesSolicitante: data.cnesSolicitante || '2332156',
    estabelecimentoExecutante:
      data.estabelecimentoExecutante || doctor?.clinicName || 'HOSPITAL ORDEM TERCEIRA',
    cnesExecutante: data.cnesExecutante || '2332156',
    nomePaciente: data.nomePaciente || patient?.name || '',
    numeroProntuario: data.numeroProntuario || patient?.document || '',
    dataNascimento: data.dataNascimento || patient?.birthDate || '',
    nomeProfissionalSolicitante:
      data.nomeProfissionalSolicitante || doctor?.fullName || '',
    numeroDocumentoProfissional:
      data.numeroDocumentoProfissional || doctor?.crm || '',
    dataSolicitacao: data.dataSolicitacao || todayIso,
    registroConselho:
      data.registroConselho ||
      (doctor?.crm ? `CRM/${doctor.uf || 'PA'} ${doctor.crm}` : '')
  };
}

export async function generateAihPdfBytes(
  rawAihData: AihData,
  doctor?: DoctorProfile,
  patient?: PatientInfo,
  templateBuffer?: ArrayBuffer | Uint8Array
): Promise<Uint8Array> {
  const data = mergeAihWithSystemContext(rawAihData, doctor, patient);

  let pdfBytes: ArrayBuffer | Uint8Array;
  if (templateBuffer) {
    pdfBytes = templateBuffer;
  } else {
    const response = await fetch('/templates/AIH_.pdf');
    if (!response.ok) {
      throw new Error(`Falha ao carregar o template AIH_.pdf (${response.status})`);
    }
    pdfBytes = await response.arrayBuffer();
  }

  const pdfDoc = await PDFDocument.load(pdfBytes);
  const page1 = pdfDoc.getPage(0);
  const page2 = pdfDoc.getPage(1);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // =========================================================================
  // PÁGINA 1
  // =========================================================================

  // 1 e 2 - Estabelecimento Solicitante e CNES
  drawFieldText(page1, fontBold, data.estabelecimentoSolicitante.toUpperCase(), 38, 727, 395, 8.5);
  drawBoxedDigits(page1, fontBold, data.cnesSolicitante, 439, 726, 17, 7, 8.5);

  // 3 e 4 - Estabelecimento Executante e CNES
  drawFieldText(page1, fontBold, data.estabelecimentoExecutante.toUpperCase(), 38, 707, 395, 8.5);
  drawBoxedDigits(page1, fontBold, data.cnesExecutante, 439, 706, 17, 7, 8.5);

  // 5 - Nome do Paciente (Campo Principal 1)
  drawFieldText(page1, fontBold, data.nomePaciente.toUpperCase(), 38, 671, 415, 9.5);

  // 6 - Nº do Prontuário
  drawFieldText(page1, fontBold, data.numeroProntuario, 465, 671, 85, 8.5);

  // 7 - Cartão Nacional de Saúde (CNS - 15 dígitos)
  drawBoxedDigits(page1, fontBold, data.cnsPaciente, 36, 650, 16, 15, 8.5);

  // 8 - Data de Nascimento
  const [nascDia, nascMes, nascAno] = splitDateParts(data.dataNascimento);
  drawFieldText(page1, fontBold, nascDia ? `${nascDia}/${nascMes}/${nascAno}` : '', 272, 650, 80, 8.5);

  // 9 - Sexo (Masc 1 / Fem 3)
  const sexoNorm = (data.sexo || '').toUpperCase();
  if (sexoNorm.startsWith('1') || sexoNorm.startsWith('M')) {
    drawFieldText(page1, fontBold, 'X', 388, 652, 10, 8.5);
  } else if (sexoNorm.startsWith('3') || sexoNorm.startsWith('F')) {
    drawFieldText(page1, fontBold, 'X', 431, 652, 10, 8.5);
  }

  // 10 - Raça/Cor & 10.1 - Etnia
  drawFieldText(page1, fontRegular, data.racaCor, 460, 650, 52, 8);
  drawFieldText(page1, fontRegular, data.etnia, 518, 650, 40, 8);

  // 11 - Nome da Mãe
  drawFieldText(page1, fontRegular, data.nomeMaeOuResponsavel.toUpperCase(), 38, 631, 335, 8.5);

  // 12 - Telefone Paciente
  const [ddd1, tel1] = splitPhone(data.telefoneContato);
  drawFieldText(page1, fontRegular, ddd1, 387, 630, 24, 8);
  drawFieldText(page1, fontRegular, tel1, 420, 630, 120, 8);

  // 13 - Nome do Responsável
  drawFieldText(page1, fontRegular, (data.nomeResponsavel || '').toUpperCase(), 38, 612, 335, 8.5);

  // 14 - Telefone Responsável
  const [ddd2, tel2] = splitPhone(data.telefoneResponsavel);
  drawFieldText(page1, fontRegular, ddd2, 387, 611, 24, 8);
  drawFieldText(page1, fontRegular, tel2, 420, 611, 120, 8);

  // 15 - Endereço
  drawFieldText(page1, fontRegular, data.endereco.toUpperCase(), 38, 594, 510, 8.5);

  // 16 - Município de Residência
  drawFieldText(page1, fontRegular, data.municipioResidencia.toUpperCase(), 38, 575, 245, 8.5);

  // 17 - Cód. IBGE Município
  drawFieldText(page1, fontRegular, data.codIbgeMunicipio, 298, 575, 90, 8.5);

  // 18 - UF
  drawFieldText(page1, fontBold, data.uf.toUpperCase(), 400, 575, 24, 8.5);

  // 19 - CEP (8 dígitos)
  drawBoxedDigits(page1, fontRegular, data.cep, 430, 575, 14, 8, 8);

  // 20 - Principais Sinais e Sintomas Clínicos (Campo Principal 4)
  drawMultilineFieldText(page1, fontRegular, data.principaisSinaisSintomas, 38, 537, 515, 11, 7, 8);

  // 21 - Condições que Justificam a Internação (Campo Principal 5)
  drawMultilineFieldText(page1, fontRegular, data.condicoesJustificamInternacao, 38, 440, 515, 11, 3, 8);

  // 22 - Principais Resultados de Provas Diagnósticas
  drawMultilineFieldText(page1, fontRegular, data.resultadosProvasDiagnosticas, 38, 391, 515, 11, 3, 8);

  // 23 - Diagnóstico Inicial (Campo Principal 2)
  drawFieldText(page1, fontBold, data.diagnosticoInicial.toUpperCase(), 38, 344, 210, 8.5);

  // 24 - CID 10 Principal (Campo Principal 3)
  drawFieldText(page1, fontBold, data.cid10Principal.toUpperCase(), 258, 344, 85, 9.5);

  // 25 - CID 10 Secundário
  drawFieldText(page1, fontBold, data.cid10Secundario.toUpperCase(), 355, 344, 85, 9);

  // 26 - CID 10 Causas Associadas
  drawFieldText(page1, fontBold, data.cid10CausasAssociadas.toUpperCase(), 448, 344, 95, 9);

  // 27 - Descrição do Procedimento Solicitado (Campo Principal 6)
  drawFieldText(page1, fontBold, data.descricaoProcedimentoSolicitado.toUpperCase(), 38, 308, 325, 8.5);

  // 28 - Código do Procedimento (10 dígitos)
  drawBoxedDigits(page1, fontBold, data.codigoProcedimento, 370, 308, 18.5, 10, 8.5);

  // 29 - Clínica
  drawFieldText(page1, fontBold, data.clinica.toUpperCase(), 38, 288, 70, 8);

  // 30 - Caráter da Internação
  drawFieldText(page1, fontBold, data.caraterInternacao.toUpperCase(), 115, 288, 110, 8);

  // 31 - Tipo Doc Profissional
  if (data.tipoDocumentoProfissional === 'CPF') {
    drawFieldText(page1, fontBold, 'X', 242, 288, 10, 8.5);
  } else {
    drawFieldText(page1, fontBold, 'X', 238, 288, 10, 8.5);
  }

  // 32 - Nº Documento do Profissional Solicitante (15 dígitos)
  drawBoxedDigits(page1, fontBold, data.numeroDocumentoProfissional, 321, 288, 15.5, 15, 8.5);

  // 33 - Nome do Profissional Solicitante (Automático)
  drawFieldText(page1, fontBold, data.nomeProfissionalSolicitante.toUpperCase(), 38, 267, 245, 8.5);

  // 34 - Data da Solicitação (Automático)
  const [solDia, solMes, solAno] = splitDateParts(data.dataSolicitacao);
  drawFieldText(page1, fontBold, solDia ? `${solDia}/${solMes}/${solAno}` : '', 292, 267, 85, 8.5);

  // 35 - Assinatura e Carimbo (Registro do Conselho)
  drawFieldText(page1, fontBold, data.registroConselho.toUpperCase(), 385, 267, 165, 8);

  // 36-38 - Causas Externas Checkboxes
  if (data.causaExterna === 'transito') drawFieldText(page1, fontBold, 'X', 44, 222, 10, 8.5);
  if (data.causaExterna === 'trabalho_tipico') drawFieldText(page1, fontBold, 'X', 44, 212, 10, 8.5);
  if (data.causaExterna === 'trabalho_trajeto') drawFieldText(page1, fontBold, 'X', 44, 202, 10, 8.5);

  // 39 a 44 - Seguradora / Empresa
  drawFieldText(page1, fontRegular, data.cnpjSeguradora, 178, 221, 245, 8);
  drawFieldText(page1, fontRegular, data.numeroBilhete, 434, 221, 75, 8);
  drawFieldText(page1, fontRegular, data.serie, 517, 221, 40, 8);
  drawFieldText(page1, fontRegular, data.cnpjEmpresa, 178, 201, 235, 8);
  drawFieldText(page1, fontRegular, data.cnaeEmpresa, 423, 201, 85, 8);
  drawFieldText(page1, fontRegular, data.cbor, 517, 201, 40, 8);

  // 45 - Vínculo Previdência
  if (data.vinculoPrevidencia === 'empregado') drawFieldText(page1, fontBold, 'X', 38, 179, 10, 8.5);
  if (data.vinculoPrevidencia === 'empregador') drawFieldText(page1, fontBold, 'X', 124, 179, 10, 8.5);
  if (data.vinculoPrevidencia === 'autonomo') drawFieldText(page1, fontBold, 'X', 211, 179, 10, 8.5);
  if (data.vinculoPrevidencia === 'desempregado') drawFieldText(page1, fontBold, 'X', 301, 179, 10, 8.5);
  if (data.vinculoPrevidencia === 'aposentado') drawFieldText(page1, fontBold, 'X', 395, 179, 10, 8.5);
  if (data.vinculoPrevidencia === 'nao_segurado') drawFieldText(page1, fontBold, 'X', 482, 179, 10, 8.5);

  // 46-52 - Autorização
  drawFieldText(page1, fontRegular, (data.nomeProfissionalAutorizador || '').toUpperCase(), 38, 140, 255, 8);
  drawFieldText(page1, fontRegular, data.codOrgaoEmissor, 306, 140, 85, 8);
  drawFieldText(page1, fontBold, data.numeroAih, 404, 140, 145, 9);
  drawBoxedDigits(page1, fontRegular, data.numDocAutorizador, 167, 120, 15, 15, 8);
  const [autDia, autMes, autAno] = splitDateParts(data.dataAutorizacao);
  drawFieldText(page1, fontRegular, autDia ? `${autDia}/${autMes}/${autAno}` : '', 38, 100, 85, 8);
  drawFieldText(page1, fontRegular, data.registroConselhoAutorizador, 157, 100, 200, 8);

  // =========================================================================
  // PÁGINA 2 (FOLHA CLÍNICA)
  // =========================================================================

  // SINAIS / SINTOMAS
  if (data.alteracaoConsciencia === 'sim') drawFieldText(page2, fontBold, 'X', 160, 731, 10, 8.5);
  if (data.alteracaoConsciencia === 'nao') drawFieldText(page2, fontBold, 'X', 188, 731, 10, 8.5);
  drawFieldText(page2, fontRegular, data.febre, 75, 717, 215, 8.5);
  drawFieldText(page2, fontRegular, data.desnutricao, 135, 703, 155, 8.5);
  if (data.desidratacao === 'sim') drawFieldText(page2, fontBold, 'X', 120, 689, 10, 8.5);
  if (data.desidratacao === 'nao') drawFieldText(page2, fontBold, 'X', 152, 689, 10, 8.5);
  if (data.desidratacao === 'ignorado') drawFieldText(page2, fontBold, 'X', 195, 689, 10, 8.5);

  // DADOS VITAIS
  drawFieldText(page2, fontBold, data.pulso, 350, 731, 195, 8.5);
  drawFieldText(page2, fontBold, data.pressaoArterial, 385, 717, 160, 8.5);
  drawFieldText(page2, fontBold, data.frequenciaRespiratoria, 385, 703, 160, 8.5);
  drawFieldText(page2, fontBold, data.frequenciaCardiaca, 375, 689, 170, 8.5);

  // MEDICAMENTOS EM USO
  drawMultilineFieldText(page2, fontRegular, data.medicamentosEmUso, 38, 653, 520, 11, 10, 8.5);

  // MOTIVO DO ENCAMINHAMENTO
  drawMultilineFieldText(page2, fontRegular, data.motivoEncaminhamento, 38, 498, 520, 11, 11, 8.5);

  // EXAMES CLÍNICOS
  drawFieldText(page2, fontRegular, data.exameCirculatorio, 135, 334, 420, 8);
  drawFieldText(page2, fontRegular, data.outrosAchadosClinicos, 190, 320, 365, 8);
  drawFieldText(page2, fontRegular, data.exameAparelhoRespiratorio, 185, 306, 370, 8);

  // EXAMES COMPLEMENTARES
  drawFieldText(page2, fontRegular, data.examesLaboratoriais, 235, 269, 320, 8);
  drawFieldText(page2, fontRegular, data.idadeGestacional, 140, 255, 415, 8);
  drawFieldText(page2, fontRegular, data.mauFormacao, 115, 241, 440, 8);
  if (data.ultrassom === 'sim') drawFieldText(page2, fontBold, 'X', 105, 227, 10, 8.5);
  if (data.ultrassom === 'nao') drawFieldText(page2, fontBold, 'X', 135, 227, 10, 8.5);
  if (data.ultrassom === 'ignorado') drawFieldText(page2, fontBold, 'X', 175, 227, 10, 8.5);
  drawFieldText(page2, fontRegular, data.ultrassomObs, 240, 227, 315, 8);
  drawFieldText(page2, fontRegular, data.outrosExames, 120, 213, 435, 8);
  drawFieldText(page2, fontRegular, data.radiografias, 105, 199, 450, 8);

  // EXAME OBSTÉTRICO
  drawFieldText(page2, fontRegular, data.dinamicaUterina, 130, 163, 425, 8);
  drawFieldText(page2, fontRegular, data.dilatacaoColo, 130, 149, 425, 8);
  if (data.roturaMembrana === 'sim') drawFieldText(page2, fontBold, 'X', 160, 135, 10, 8.5);
  if (data.roturaMembrana === 'nao') drawFieldText(page2, fontBold, 'X', 190, 135, 10, 8.5);
  drawFieldText(page2, fontRegular, data.apagamento, 110, 121, 445, 8);
  drawFieldText(page2, fontRegular, data.alturaApresentacao, 155, 107, 400, 8);
  drawFieldText(page2, fontRegular, data.posicaoColo, 120, 93, 435, 8);

  return await pdfDoc.save();
}

export async function downloadAihPdf(
  aihData: AihData,
  doctor?: DoctorProfile,
  patient?: PatientInfo
): Promise<void> {
  const bytes = await generateAihPdfBytes(aihData, doctor, patient);
  const blob = new Blob([bytes as unknown as BlobPart], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);

  const safeName = (aihData.nomePaciente || patient?.name || 'PACIENTE')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .toUpperCase();

  const a = document.createElement('a');
  a.href = url;
  a.download = `LAUDO_AIH_${safeName}_${getTodayIso()}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

export async function printAihPdf(
  aihData: AihData,
  doctor?: DoctorProfile,
  patient?: PatientInfo
): Promise<void> {
  const bytes = await generateAihPdfBytes(aihData, doctor, patient);
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
