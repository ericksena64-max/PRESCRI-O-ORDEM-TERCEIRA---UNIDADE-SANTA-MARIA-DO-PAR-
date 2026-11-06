import React, { useRef, useState } from 'react';
import {
  Printer,
  Download,
  Copy,
  Check,
  AlertCircle
} from 'lucide-react';
import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';
import {
  DoctorProfile,
  PatientInfo,
  PrescriptionItem,
  PrescriptionType,
  AtestadoData,
  DeclaracaoData,
  InpatientInfo,
  InpatientItem,
  AihData,
  ApacData
} from '../types';
import {
  formatDaysInWords,
  formatDatePtBr,
  formatExtendedDate,
  formatPrescriptionForWhatsApp,
  formatAtestadoForWhatsApp,
  formatInpatientForWhatsApp
} from '../utils/documentLogic';
import { AihDocumentView } from './AihDocumentView';
import { ApacDocumentView } from './ApacDocumentView';
import { downloadApacPdf, printApacPdf } from '../services/apacPdfService';
import { downloadAihPdf, printAihPdf } from '../services/aihPdfService';
import { getTodayIso } from '../utils/dateUtils';

interface DocumentPreviewA4Props {
  mode: 'prescricao' | 'atestado' | 'declaracao' | 'internacao' | 'aih' | 'apac';
  doctor: DoctorProfile;
  patient: PatientInfo;
  // Prescription specific
  prescriptionType: PrescriptionType;
  items: PrescriptionItem[];
  generalRecommendations?: string;
  prescriptionDate: string;
  diagnosticCid?: { code: string; description: string };
  // Atestado specific
  atestado: AtestadoData;
  // Declaracao specific
  declaracao: DeclaracaoData;
  // Internação (FAST-HUG) specific
  inpatient: InpatientInfo;
  inpatientItems: InpatientItem[];
  // AIH specific
  aih?: AihData;
  // APAC specific
  apac?: ApacData;
  // Global actions
  onSaveToHistory?: (summary: string) => void;
}

export const DocumentPreviewA4: React.FC<DocumentPreviewA4Props> = ({
  mode,
  doctor,
  patient,
  prescriptionType,
  items,
  generalRecommendations,
  prescriptionDate,
  diagnosticCid,
  atestado,
  declaracao,
  inpatient,
  inpatientItems,
  aih,
  apac,
  onSaveToHistory
}) => {
  const printAreaRef = useRef<HTMLDivElement>(null);
  const [activeVia, setActiveVia] = useState<'1' | '2'>('1');
  const [copied, setCopied] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const isControlledOrAntimicrobial = prescriptionType === 'controle_especial' || prescriptionType === 'antimicrobiano';

  // Formata a linha descritiva completa da coluna "Item" na prescrição hospitalar,
  // combinando nome, dose, via e posologia/hora (sem duplicar se já estiverem no nome)
  // e destacando "S.N." e "ACM" em amarelo conforme o modelo hospitalar.
  const formatHospitalItemLine = (item: InpatientItem): string => {
    const baseName = (item.name || 'Item sem descrição').trim();
    const lowerBase = baseName.toLowerCase();
    const parts: string[] = [baseName];

    const dose = (item.dose || '').trim();
    if (
      dose &&
      dose.toLowerCase() !== 'conforme hgt' &&
      dose.toLowerCase() !== 'g' &&
      !lowerBase.includes(dose.toLowerCase())
    ) {
      parts.push(dose);
    }

    const route = (item.route || '').trim();
    if (route) {
      const routeRegex = new RegExp(`\\b${route.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (!routeRegex.test(baseName)) {
        parts.push(route);
      }
    }

    const freq = (item.frequency || '').trim();
    if (freq && freq.toLowerCase() !== 'conforme hgt') {
      if (!lowerBase.includes(freq.toLowerCase())) {
        // Se começa com intervalo numérico (ex: 4/4h, 6/6h, 8/8h, 12/12h, 24/24h), adiciona "DE "
        if (/^\d+\/\d+h/i.test(freq)) {
          parts.push(`DE ${freq.toUpperCase()}`);
        } else {
          parts.push(freq.toUpperCase());
        }
      }
    }

    if (item.diaAtual) {
      const atbTag = `[D${item.diaAtual}/${item.diaTotal || 7}]`;
      if (!baseName.includes(`D${item.diaAtual}`)) {
        parts.push(atbTag);
      }
    }

    const line = parts.join(' ');
    // Mantém esquemas longos (como HGT ou Amiodarona) legíveis e converte itens curtos para caixa alta hospitalar
    return baseName.length > 75 ? line : line.toUpperCase();
  };

  const renderHighlightedItemText = (text: string) => {
    const tokens = text.split(/(\bS\.N\.|\bSN\b|\bSE NECESS[ÁA]RIO\b|\bACM\b)/gi);
    return tokens.map((tok, i) => {
      if (/^(\bS\.N\.|\bSN\b|\bSE NECESS[ÁA]RIO\b|\bACM\b)$/i.test(tok)) {
        return (
          <span
            key={i}
            className="bg-yellow-300 text-slate-950 font-black px-1 py-px rounded-2xs print:bg-yellow-300"
          >
            {tok.toUpperCase()}
          </span>
        );
      }
      return <React.Fragment key={i}>{tok}</React.Fragment>;
    });
  };

  // Direct print trigger
  const handlePrint = async () => {
    if (onSaveToHistory) {
      const summary = mode === 'prescricao'
        ? `Receita (${items.length} itens) - ${patient.name}`
        : mode === 'atestado'
        ? `Atestado (${atestado.days} dias) - ${patient.name}`
        : mode === 'internacao'
        ? `Prescrição de internação FAST-HUG (${inpatientItems.length} itens) - ${patient.name}`
        : mode === 'apac'
        ? `Laudo APAC - ${apac?.nomePaciente || patient.name}`
        : mode === 'aih'
        ? `Laudo AIH - ${aih?.nomePaciente || patient.name}`
        : `Declaração - ${patient.name}`;
      onSaveToHistory(summary);
    }
    if (mode === 'apac' && apac) {
      await printApacPdf(apac, doctor, patient);
      return;
    }
    if (mode === 'aih' && aih) {
      await printAihPdf(aih, doctor, patient);
      return;
    }
    window.print();
  };

  // Direct PDF Download with pdf-lib (for APAC and AIH) or jsPDF & html2canvas-pro
  const handleDownloadPdf = async () => {
    setIsExportingPdf(true);
    setExportError(null);

    try {
      if (mode === 'apac' && apac) {
        await downloadApacPdf(apac, doctor, patient);
        if (onSaveToHistory) {
          onSaveToHistory(`PDF Oficial APAC: ${apac.nomePaciente || patient.name}`);
        }
        return;
      }

      if (mode === 'aih' && aih) {
        await downloadAihPdf(aih, doctor, patient);
        if (onSaveToHistory) {
          onSaveToHistory(`PDF Oficial AIH: ${aih.nomePaciente || patient.name}`);
        }
        return;
      }

      if (!printAreaRef.current) return;
      const element = printAreaRef.current;
      const isLandscape = mode === 'internacao';
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        imageTimeout: 15000,
        windowWidth: isLandscape ? 1500 : 1200
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const pdf = new jsPDF({
        orientation: isLandscape ? 'landscape' : 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      if (pdfHeight <= pageHeight + 3) {
        // Documento de uma página (tolerância para bordas do A4)
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, Math.min(pdfHeight, pageHeight));
      } else {
        // Documento longo (ex.: prescrição de internação): divide em várias páginas A4
        let heightLeft = pdfHeight;
        let position = 0;
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
        while (heightLeft > 0) {
          position = heightLeft - pdfHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
          heightLeft -= pageHeight;
        }
      }

      const safePatientName = (patient.name || 'Paciente').replace(/[^a-zA-Z0-9]/g, '_');
      const filename = `${mode.toUpperCase()}_${safePatientName}_${getTodayIso()}.pdf`;
      pdf.save(filename);

      if (onSaveToHistory) {
        onSaveToHistory(`PDF Baixado: ${filename}`);
      }
    } catch (err) {
      console.error('Erro ao gerar PDF:', err);
      setExportError(
        'A geração direta encontrou um problema no navegador. Você pode usar o botão "Imprimir" e selecionar "Salvar como PDF".'
      );
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Texto formatado do documento atual (usado em "Copiar")
  const buildShareText = (): string => {
    if (mode === 'prescricao') {
      return formatPrescriptionForWhatsApp(doctor, patient.name, items, prescriptionDate, generalRecommendations);
    }
    if (mode === 'atestado') {
      return formatAtestadoForWhatsApp(
        doctor,
        atestado.patientName,
        formatDaysInWords(atestado.days),
        atestado.startDate,
        atestado.endDate,
        atestado.type,
        atestado.cidOption === 'com_cid' && atestado.cidCode ? `CID-10: ${atestado.cidCode} - ${atestado.cidDescription}` : undefined
      );
    }
    if (mode === 'internacao') {
      return formatInpatientForWhatsApp(doctor, patient.name, patient.age, patient.weight, inpatient, inpatientItems);
    }
    if (mode === 'aih' && aih) {
      return `📋 *LAUDO DE SOLICITAÇÃO DE AIH (SUS - ANEXO I)*\n` +
        `Estabelecimento: ${aih.estabelecimentoSolicitante} (CNES: ${aih.cnesSolicitante})\n` +
        `Paciente: ${aih.nomePaciente} • Prontuário: ${aih.numeroProntuario}\n` +
        `Diagnóstico: ${aih.diagnosticoInicial} (CID-10: ${aih.cid10Principal})\n` +
        `Procedimento: ${aih.descricaoProcedimentoSolicitado} (${aih.codigoProcedimento})\n` +
        `Médico Solicitante: ${aih.nomeProfissionalSolicitante} - ${aih.registroConselho}`;
    }
    if (mode === 'apac' && apac) {
      return `📋 *LAUDO DE SOLICITAÇÃO / AUTORIZAÇÃO APAC (SUS)*\n` +
        `Estabelecimento: ${apac.estabelecimentoSolicitante} (CNES: ${apac.cnesSolicitante})\n` +
        `Paciente: ${apac.nomePaciente} • CNS/CPF: ${apac.cpfOuCns}\n` +
        `Procedimento: ${apac.nomeProcedimentoPrincipal} (${apac.codigoProcedimentoPrincipal})\n` +
        `Diagnóstico: ${apac.descricaoDiagnostico} (CID-10: ${apac.cid10Principal})\n` +
        `Médico: ${apac.nomeProfissionalSolicitante} - ${apac.registroConselhoSolicitante}`;
    }
    return `🕒 *DECLARAÇÃO DE COMPARECIMENTO*\n${doctor.clinicName}\n${doctor.fullName} - CRM/${doctor.uf} ${doctor.crm}\n\n` +
      `Declaro que o(a) paciente *${declaracao.patientName}* compareceu no dia *${formatDatePtBr(declaracao.date)}* das *${declaracao.startTime}* às *${declaracao.endTime}* para ${declaracao.purpose}.\n\n` +
      `📍 ${doctor.clinicAddress} - ${doctor.clinicCityState}`;
  };

  // Copy text representation to clipboard
  const handleCopyText = () => {
    navigator.clipboard.writeText(buildShareText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Current document date in extended format
  const currentDate = mode === 'prescricao'
    ? prescriptionDate
    : mode === 'atestado'
    ? atestado.startDate
    : mode === 'internacao'
    ? inpatient.prescriptionDate
    : mode === 'aih' && aih
    ? aih.dataSolicitacao
    : mode === 'apac' && apac
    ? apac.dataSolicitacao
    : declaracao.date;

  const extendedDateString = formatExtendedDate(currentDate, doctor.clinicCityState);

  const isLandscape = mode === 'internacao';
  const isSusDocument = mode === 'aih' || mode === 'apac';

  return (
    <div className="flex flex-col items-center">
      {/* Dynamic @page media style for browser print (A4 landscape vs portrait) */}
      <style>{`
        @media print {
          @page {
            size: ${isLandscape ? 'A4 landscape' : 'A4 portrait'} !important;
            margin: ${isLandscape ? '6mm 8mm' : isSusDocument ? '5mm 6mm' : '10mm 12mm'} !important;
          }
        }
      `}</style>

      {exportError && (
        <div className={`no-print w-full ${isLandscape ? 'max-w-[297mm]' : 'max-w-[210mm]'} mb-3 p-3 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 text-xs flex items-center justify-between gap-3 shadow-xs`}>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{exportError}</span>
          </div>
          <button
            type="button"
            onClick={handlePrint}
            className="px-2.5 py-1 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-lg shrink-0 transition-colors"
          >
            Abrir Impressão
          </button>
        </div>
      )}

      {/* Top Preview Controls Bar (Hidden during print) */}
      <div className={`no-print w-full ${isLandscape ? 'max-w-[297mm]' : 'max-w-[210mm]'} mb-4 bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-2`}>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            {isLandscape
              ? 'Pré-Visualização A4 (Paisagem)'
              : mode === 'aih'
              ? 'Laudo de Solicitação de AIH (Anexo I - SUS)'
              : mode === 'apac'
              ? 'Laudo APAC (pg. 1 e 2 - SUS)'
              : 'Pré-Visualização A4'}
          </span>

          {mode === 'prescricao' && isControlledOrAntimicrobial && (
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setActiveVia('1')}
                className={`px-2 py-1 rounded-md font-semibold transition-all ${
                  activeVia === '1' ? 'bg-white shadow-xs text-blue-900 font-bold' : 'text-slate-600'
                }`}
              >
                1ª Via (Farmácia)
              </button>
              <button
                type="button"
                onClick={() => setActiveVia('2')}
                className={`px-2 py-1 rounded-md font-semibold transition-all ${
                  activeVia === '2' ? 'bg-white shadow-xs text-blue-900 font-bold' : 'text-slate-600'
                }`}
              >
                2ª Via (Paciente)
              </button>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleCopyText}
            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
            title="Copiar texto formatado"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copiado!' : 'Copiar'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isExportingPdf}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExportingPdf ? 'Exportando...' : 'Baixar PDF'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir</span>
          </button>
        </div>
      </div>

      {/* A4 Sheet Container */}
      <div
        ref={printAreaRef}
        id="a4-document-sheet"
        className={`a4-sheet bg-white text-slate-900 shadow-xl border border-slate-200 w-full ${
          isLandscape
            ? 'max-w-[297mm] min-h-[205mm] p-6 sm:p-7'
            : mode === 'apac' || mode === 'aih'
            ? 'max-w-[210mm] p-0'
            : isSusDocument
            ? 'max-w-[210mm] min-h-[297mm] p-4 sm:p-6'
            : 'max-w-[210mm] min-h-[297mm] p-8 sm:p-12'
        } flex flex-col justify-between transition-all relative overflow-hidden`}
        style={{
          fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
          boxSizing: 'border-box'
        }}
      >
        {/* Subtle Watermark for Official Ordem Terceira Appearance */}
        {!isSusDocument && (
          <div className="absolute inset-0 flex flex-col items-center justify-center opacity-[0.045] pointer-events-none select-none z-0">
            <img
              src="/assets/hospital_watermark.png"
              alt="Marca d'água Ordem Terceira Santa Maria"
              className={isLandscape ? 'w-[540px] max-h-[540px] object-contain' : 'w-[450px] max-h-[450px] object-contain'}
            />
          </div>
        )}

        {isSusDocument ? (
          <div className="relative z-10 w-full">
            {mode === 'aih' && aih && <AihDocumentView data={aih} doctor={doctor} />}
            {mode === 'apac' && apac && <ApacDocumentView data={apac} doctor={doctor} />}
          </div>
        ) : (
          <>
            {/* TOP SECTION: Letterhead & Patient Header */}
            <div className="relative z-10">
          {/* Portrait modes keep the classic centered Hospital Ordem Terceira letterhead */}
          {!isLandscape && (
            <>
              <div className="border-b-2 border-slate-900 pb-4 mb-6 text-center">
                <div className="flex justify-center mb-2">
                  <div className="h-16 w-16 rounded-xl border border-slate-200 p-1 bg-white flex items-center justify-center shadow-xs">
                    <img
                      src="/assets/logo_hospital_white.png"
                      alt="Emblema Ordem Terceira Santa Maria"
                      className="h-full w-full object-contain"
                    />
                  </div>
                </div>
                <h1 className="text-base sm:text-lg font-black text-slate-950 tracking-wide uppercase font-serif">
                  {doctor.clinicName || 'Hospital Ordem Terceira'}
                </h1>
                <p className="text-xs font-bold text-blue-950 uppercase tracking-wider mt-0.5">
                  {doctor.razaoSocial || 'Venerável Ordem Terceira de São Francisco'}
                </p>
                <p className="text-[11px] font-medium text-slate-700 mt-0.5">
                  CNPJ (Filial): {doctor.cnpj || '04.935.409/0002-31'}
                </p>
                <p className="text-[10.5px] text-slate-600 mt-0.5">
                  {doctor.clinicAddress || 'Rua Cezarino Doce, nº 10, Centro'} — {doctor.clinicCityState || 'Santa Maria do Pará - PA'}
                  {doctor.clinicCep ? ` • CEP ${doctor.clinicCep}` : ''}
                  {doctor.clinicPhone ? ` • Tel: ${doctor.clinicPhone}` : ''}
                </p>
              </div>

              {/* Document Title Banner for Portrait Modes */}
              <div className="text-center my-4">
                <h2 className="text-base sm:text-lg font-black tracking-widest uppercase text-slate-950 underline underline-offset-4 decoration-2 decoration-blue-700">
                  {mode === 'prescricao' && (
                    prescriptionType === 'controle_especial'
                      ? 'RECEITUÁRIO DE CONTROLE ESPECIAL'
                      : prescriptionType === 'antimicrobiano'
                      ? 'RECEITUÁRIO DE ANTIMICROBIANOS'
                      : 'RECEITUÁRIO MÉDICO'
                  )}
                  {mode === 'atestado' && 'ATESTADO MÉDICO'}
                  {mode === 'declaracao' && 'DECLARAÇÃO DE COMPARECIMENTO'}
                </h2>

                {mode === 'prescricao' && isControlledOrAntimicrobial && (
                  <p className="text-[11px] font-bold text-slate-600 mt-1 uppercase tracking-wider">
                    {activeVia === '1' ? '1ª VIA - RETENÇÃO DA FARMÁCIA / DROGARIA' : '2ª VIA - ORIENTAÇÃO AO PACIENTE'}
                  </p>
                )}
              </div>

              {/* Portrait Patient Card */}
              <div className="bg-slate-50/80 border border-slate-300 rounded-lg p-3 my-4 text-xs">
                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-7">
                    <span className="font-bold text-slate-600 uppercase text-[10px] block">Nome do Paciente:</span>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-sm text-slate-950">
                        {patient.name || 'Nome do Paciente'}
                      </span>
                      {patient.age && (
                        <span className="text-xs text-slate-600 font-semibold">
                          ({patient.age})
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="col-span-5 text-right flex flex-col items-end">
                    <div>
                      <span className="font-bold text-slate-600 uppercase text-[10px] inline-block mr-1">Doc:</span>
                      <span className="font-bold text-xs text-slate-800">
                        {patient.document || 'Não informado'}
                      </span>
                    </div>
                    {patient.weight && (
                      <div className="mt-0.5">
                        <span className="font-bold text-blue-900 text-[11px] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                          Peso: {patient.weight} kg
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* DOCUMENT BODY ACCORDING TO MODE */}
          <div className="py-1 min-h-[300px]">
            {/* 0. INPATIENT PRESCRIPTION IN LANDSCAPE A4 — CLASSIC HOSPITAL SPREADSHEET LAYOUT */}
            {mode === 'internacao' && (
              <div className="w-full">
                {/* Unified Hospital Header & Prescription Table */}
                <table className="w-full border-collapse border border-slate-950 text-slate-950 text-[11.5px] leading-snug">
                  <tbody>
                    {/* Header Row 1 */}
                    <tr>
                      <td
                        rowSpan={4}
                        className="border border-slate-950 px-2 py-1.5 text-center align-middle w-[22%]"
                      >
                        <div className="flex flex-col items-center justify-center">
                          <img
                            src="/assets/logo_hospital_white.png"
                            alt="Logo Hospital Ordem Terceira Santa Maria"
                            className="h-10 w-10 object-contain mb-1"
                          />
                          <span className="text-[17px] font-black text-slate-950 tracking-tight leading-tight uppercase">
                            Prescrição Médica
                          </span>
                          <span className="text-[9px] font-bold text-blue-950 tracking-wider uppercase">
                            Ordem Terceira • Santa Maria
                          </span>
                        </div>
                      </td>
                      <td colSpan={2} className="border border-slate-950 px-2 py-1 align-middle w-[43%]">
                        <span className="font-normal text-slate-800">Identificador: </span>
                        <span className="font-bold text-slate-950">{patient.document || ''}</span>
                      </td>
                      <td className="border border-slate-950 px-2 py-1 align-middle w-[20%]">
                        <span className="font-normal text-slate-800">Admissão: </span>
                        <span className="font-bold text-slate-950">{formatDatePtBr(inpatient.admissionDate)}</span>
                      </td>
                      <td className="border border-slate-950 px-2 py-1 align-middle w-[16%]">
                        <span className="font-normal text-slate-800">Leito: </span>
                        <span className="font-bold text-slate-950">{inpatient.bed || ''}</span>
                      </td>
                    </tr>

                    {/* Header Row 2 */}
                    <tr>
                      <td colSpan={2} className="border border-slate-950 px-2 py-1 align-middle">
                        <span className="font-normal text-slate-800">Nome: </span>
                        <span className="font-extrabold text-slate-950 uppercase">{patient.name || ''}</span>
                      </td>
                      <td colSpan={2} className="border border-slate-950 px-2 py-1 align-middle">
                        <span className="font-normal text-slate-800">Data nascimento: </span>
                        <span className="font-bold text-slate-950">
                          {patient.birthDate ? formatDatePtBr(patient.birthDate) : ''}
                        </span>
                      </td>
                    </tr>

                    {/* Header Row 3 */}
                    <tr>
                      <td className="border border-slate-950 px-2 py-1 align-middle w-[21%]">
                        <span className="font-normal text-slate-800">Idade: </span>
                        <span className="font-bold text-slate-950">{patient.age || ''}</span>
                      </td>
                      <td className="border border-slate-950 px-2 py-1 align-middle w-[22%]">
                        <span className="font-normal text-slate-800">Peso: </span>
                        <span className="font-bold text-slate-950">
                          {patient.weight ? `${patient.weight} kg` : ''}
                        </span>
                      </td>
                      <td className="border border-slate-950 px-2 py-1 align-middle w-[20%]">
                        <span className="font-normal text-slate-800">Altura: </span>
                        <span className="font-bold text-slate-950">{patient.height || ''}</span>
                      </td>
                      <td className="border border-slate-950 px-2 py-1 align-middle w-[16%]">
                        <span className="font-normal text-slate-800">Unidade: </span>
                        <span className="font-bold text-slate-950">{inpatient.ward || ''}</span>
                      </td>
                    </tr>

                    {/* Header Row 4 */}
                    <tr>
                      <td colSpan={3} className="border border-slate-950 px-2 py-1 align-middle text-[10.5px]">
                        {inpatient.allergies?.trim() ? (
                          <span className="font-bold text-rose-900 mr-3">
                            Alergias: {inpatient.allergies}
                          </span>
                        ) : null}
                        {(inpatient.diagnosis?.trim() || inpatient.cid) ? (
                          <span className="font-semibold text-slate-800">
                            Diagnóstico: {inpatient.cid ? `CID ${inpatient.cid.code} — ` : ''}
                            {inpatient.diagnosis}
                          </span>
                        ) : null}
                      </td>
                      <td className="border border-slate-950 px-2 py-1 align-middle">
                        <span className="font-normal text-slate-800">Data: </span>
                        <span className="font-black text-slate-950">{formatDatePtBr(inpatient.prescriptionDate)}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Prescription Items Grid directly joined below the header box */}
                <table className="w-full border-collapse border-x border-b border-slate-950 text-slate-950 text-[11px] leading-snug -mt-px">
                  <thead>
                    <tr className="bg-slate-50/60 text-slate-950">
                      <th className="border border-slate-950 px-1 py-1 text-center font-bold w-[32px]"></th>
                      <th className="border border-slate-950 px-2 py-1 text-center font-bold">Item</th>
                      <th className="border border-slate-950 px-1 py-1 text-center font-bold w-[65px]">Qtde</th>
                      <th className="border border-slate-950 px-1 py-1 text-center font-bold w-[50px]">Via</th>
                      <th className="border border-slate-950 px-1 py-1 text-center font-bold w-[80px]">Freq</th>
                      <th className="border border-slate-950 px-1 py-1 text-center font-bold w-[65px]"></th>
                      <th className="border border-slate-950 px-1 py-1 text-center font-bold w-[65px]"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {inpatientItems.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="border border-slate-950 px-3 py-6 text-center text-slate-400 italic">
                          Nenhum item adicionado à prescrição médica de internação.
                        </td>
                      </tr>
                    ) : (
                      inpatientItems.map((item, index) => {
                        const hasContent = Boolean(item.name?.trim());
                        const mainLine = hasContent ? formatHospitalItemLine(item) : '';
                        const lowerLine = mainLine.toLowerCase();

                        // No modelo hospitalar (Scribd), se a dose, via ou frequência já compõem
                        // a instrução descrita na coluna Item, as colunas auxiliares permanecem limpas,
                        // exibindo apenas valores específicos (como 'G' ou unidades de apresentação).
                        const displayDose = item.dose && item.dose.toLowerCase() !== 'conforme hgt' && !lowerLine.includes(item.dose.toLowerCase())
                          ? item.dose
                          : (item.dose?.trim().toLowerCase() === 'g' ? 'G' : '');

                        const displayRoute = item.route && !lowerLine.includes(item.route.toLowerCase())
                          ? item.route
                          : '';

                        const displayFrequency = item.frequency && item.frequency.toLowerCase() !== 'conforme hgt' && !lowerLine.includes(item.frequency.toLowerCase())
                          ? item.frequency
                          : '';

                        return (
                          <tr key={item.id} className="break-inside-avoid min-h-[22px]">
                            <td className="border border-slate-950 px-1 py-1 text-center font-semibold align-top text-slate-900">
                              {index + 1}
                            </td>
                            <td className="border border-slate-950 px-2 py-1 align-top font-semibold text-slate-950">
                              {hasContent ? (
                                <>
                                  <div>{renderHighlightedItemText(mainLine)}</div>
                                  {item.notes && item.notes.trim() !== '' && (
                                    <div className="text-[10px] font-normal text-slate-800 leading-tight mt-0.5">
                                      {renderHighlightedItemText(item.notes)}
                                    </div>
                                  )}
                                </>
                              ) : (
                                <span>&nbsp;</span>
                              )}
                            </td>
                            <td className="border border-slate-950 px-1 py-1 text-center align-top font-medium text-[11px]">
                              {displayDose}
                            </td>
                            <td className="border border-slate-950 px-1 py-1 text-center align-top font-semibold text-[11px]">
                              {displayRoute}
                            </td>
                            <td className="border border-slate-950 px-1 py-1 text-center align-top font-semibold text-[10.5px]">
                              {displayFrequency}
                            </td>
                            <td className="border border-slate-950 px-1 py-1 text-center align-middle font-mono text-[10px] text-slate-800">
                              {item.schedule || ''}
                            </td>
                            <td className="border border-slate-950 px-1 py-1 text-center align-middle font-mono text-[10px] text-slate-800">
                              {/* Visto / Aprazamento de Enfermagem */}
                            </td>
                          </tr>
                        );
                      })
                    )}

                    {/* Preenchimento de linhas vazias para completar as 19 linhas padrão da folha hospitalar */}
                    {inpatientItems.length > 0 && inpatientItems.length < 19 && (
                      Array.from({ length: 19 - inpatientItems.length }).map((_, i) => {
                        const rowNumber = inpatientItems.length + i + 1;
                        return (
                          <tr key={`blank-row-${rowNumber}`} className="h-[23px]">
                            <td className="border border-slate-950 px-1 py-0.5 text-center font-semibold text-slate-700 text-[10.5px]">
                              {rowNumber}
                            </td>
                            <td className="border border-slate-950 px-2 py-0.5">&nbsp;</td>
                            <td className="border border-slate-950 px-1 py-0.5 text-center">&nbsp;</td>
                            <td className="border border-slate-950 px-1 py-0.5 text-center">&nbsp;</td>
                            <td className="border border-slate-950 px-1 py-0.5 text-center">&nbsp;</td>
                            <td className="border border-slate-950 px-1 py-0.5 text-center">&nbsp;</td>
                            <td className="border border-slate-950 px-1 py-0.5 text-center">&nbsp;</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}
            {/* Optional Diagnostic Indication / CID-10 for Prescription */}
            {mode === 'prescricao' && diagnosticCid && (
              <div className="mb-4 px-3 py-1.5 bg-blue-50/70 border border-blue-200 rounded-lg text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-blue-900 uppercase text-[10px] tracking-wider">
                    Indicação Clínica (CID-10):
                  </span>
                  <span className="font-extrabold text-blue-950">
                    {diagnosticCid.code} - {diagnosticCid.description}
                  </span>
                </div>
              </div>
            )}

            {/* 1. PRESCRIPTION BODY */}
            {mode === 'prescricao' && (
              <div className="space-y-5">
                {items.length === 0 ? (
                  <p className="text-sm text-slate-400 italic text-center py-12">
                    Nenhum medicamento adicionado à prescrição.
                  </p>
                ) : (
                  items.map((item, idx) => (
                    <div key={item.id} className="border-b border-slate-100 pb-3 last:border-b-0">
                      {/* Name & Quantity */}
                      <div className="flex items-baseline justify-between gap-2">
                        <div className="flex items-baseline gap-2">
                          <span className="font-black text-sm text-slate-900">{idx + 1}.</span>
                          <span className="font-extrabold text-sm text-slate-950">
                            {item.medicationName}
                          </span>
                          {item.presentation && (
                            <span className="text-xs text-slate-600 font-medium">
                              ({item.presentation})
                            </span>
                          )}
                        </div>
                        {item.quantity && (
                          <span className="font-bold text-xs text-slate-900 shrink-0">
                            --------- {item.quantity}
                          </span>
                        )}
                      </div>

                      {/* Route & Posology */}
                      <div className="ml-5 mt-1">
                        <p className="text-xs font-semibold text-blue-900 tracking-wide">
                          {item.route}
                        </p>
                        <p className="text-xs font-medium text-slate-900 leading-relaxed mt-0.5">
                          {item.posology}
                        </p>
                        {item.instructions && (
                          <p className="text-[11px] text-slate-600 italic mt-0.5">
                            * {item.instructions}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                )}

                {/* Non-pharmacological recommendations */}
                {generalRecommendations && (
                  <div className="mt-6 pt-4 border-t-2 border-dashed border-slate-200">
                    <p className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                      Orientações Gerais / Recomendações:
                    </p>
                    <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-line font-medium">
                      {generalRecommendations}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* 2. ATESTADO BODY */}
            {mode === 'atestado' && (
              <div className="py-6 px-2 space-y-6">
                <p className="text-sm sm:text-base leading-relaxed text-slate-900 text-justify font-serif indent-8">
                  {atestado.type === 'repouso' && (
                    <>
                      Atesto para os devidos fins de comprovação e justificativa legal que o(a) paciente{' '}
                      <strong>{atestado.patientName || patient.name || 'Paciente'}</strong>
                      {patient.document ? `, portador(a) do documento de identificação nº ${patient.document}, ` : ' '}
                      esteve sob meus cuidados profissionais nesta data, necessitando de{' '}
                      <span className="font-bold underline">
                        {formatDaysInWords(atestado.days)}
                      </span>{' '}
                      de repouso e afastamento de suas atividades habituais, laborais e escolares por motivo de saúde,{' '}
                      a contar de <strong>{formatDatePtBr(atestado.startDate)}</strong> até{' '}
                      <strong>{formatDatePtBr(atestado.endDate)}</strong>.
                    </>
                  )}

                  {atestado.type === 'aptidao' && (
                    <>
                      {atestado.customText ||
                        `Atesto para os devidos fins que o(a) paciente ${atestado.patientName || patient.name || 'Paciente'} foi submetido(a) a exame clínico e anamnese nesta data, encontrando-se APTO(A) para a prática de atividades físicas, esportivas e recreativas.`}
                    </>
                  )}

                  {atestado.type === 'acompanhante' && (
                    <>
                      {atestado.customText ||
                        `Atesto para os devidos fins trabalhistas e administrativos que o(a) paciente necessitou de acompanhamento presencial ininterrupto durante seu atendimento e permanência nesta unidade de saúde.`}
                    </>
                  )}

                  {(atestado.type === 'personalizado' || atestado.type === 'comparecimento_pericia') && (
                    <>
                      {atestado.customText ||
                        `Atesto para os devidos fins que o(a) paciente esteve em consulta médica nesta unidade de atendimento.`}
                    </>
                  )}
                </p>

                {/* CID-10 mention according to CFM ethics */}
                {atestado.cidOption === 'com_cid' && atestado.cidCode && (
                  <div className="p-3 bg-slate-50 border border-slate-300 rounded-lg text-xs">
                    <p className="text-slate-800 font-medium">
                      <strong>Diagnóstico (CID-10):</strong> {atestado.cidCode} - {atestado.cidDescription}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5 italic">
                      * Inclusão autorizada expressamente pelo(a) paciente em cumprimento ao Art. 73 do Código de Ética Médica e Resolução CFM nº 1.658/2002.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* 3. DECLARAÇÃO DE COMPARECIMENTO BODY */}
            {mode === 'declaracao' && (
              <div className="py-6 px-2 space-y-6">
                <p className="text-sm sm:text-base leading-relaxed text-slate-900 text-justify font-serif indent-8">
                  {declaracao.isAcompanhante ? (
                    <>
                      Declaro para os devidos fins de comprovação que o(a) Sr(a).{' '}
                      <strong>{declaracao.acompanhanteName || '[Nome do Acompanhante]'}</strong>
                      {declaracao.acompanhanteDoc ? `, portador(a) do documento nº ${declaracao.acompanhanteDoc}, ` : ' '}
                      compareceu a este estabelecimento de saúde prestando acompanhamento legal e indispensável ao(à) paciente{' '}
                      <strong>{declaracao.patientName || patient.name || '[Nome do Paciente]'}</strong>,{' '}
                      no dia <strong>{formatDatePtBr(declaracao.date)}</strong>
                      {declaracao.isAllDay ? (
                        <span> durante todo o período de atendimento </span>
                      ) : (
                        <span> no período das <strong>{declaracao.startTime}</strong> às <strong>{declaracao.endTime}</strong> </span>
                      )}
                      para fins de {declaracao.purpose || 'atendimento médico'}.
                    </>
                  ) : (
                    <>
                      Declaro para os devidos fins que o(a) paciente{' '}
                      <strong>{declaracao.patientName || patient.name || 'Paciente'}</strong>
                      {patient.document ? `, portador(a) do documento nº ${patient.document}, ` : ' '}
                      compareceu a esta unidade de atendimento no dia{' '}
                      <strong>{formatDatePtBr(declaracao.date)}</strong>
                      {declaracao.isAllDay ? (
                        <span> durante todo o período integral de consultas e exames </span>
                      ) : (
                        <span> no horário das <strong>{declaracao.startTime}</strong> às <strong>{declaracao.endTime}</strong> </span>
                      )}
                      para fins de {declaracao.purpose || 'consulta e avaliação médica'}.
                    </>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM SECTION: Date, Doctor Signature, and Footer */}
        <div className="relative z-10 pt-2 mt-2">
          {isLandscape ? (
            /* LANDSCAPE FOOTER: Legal notice on left, Doctor signature on right */
            <div className="border-t-2 border-slate-900 pt-2 grid grid-cols-12 gap-4 items-center">
              {/* Left: Legal & Hospital Notice */}
              <div className="col-span-7 text-[10px] text-slate-600 leading-snug space-y-0.5">
                <p className="font-bold text-slate-800">
                  Validade: 24 horas a contar da emissão • Santa Maria do Pará - PA, {formatDatePtBr(inpatient.prescriptionDate)}
                </p>
                <p>
                  É vedado o cumprimento de prescrição médica com rasuras ou ilegível. Toda alteração de conduta deve ser datada e assinada.
                </p>
                <p className="text-[9px] text-slate-500">
                  {doctor.clinicName} • {doctor.razaoSocial || 'Venerável Ordem Terceira de São Francisco'} • CNPJ: {doctor.cnpj || '04.935.409/0002-31'} • Tel: {doctor.clinicPhone || '(91) 3442-1200'}
                </p>
              </div>

              {/* Right: Doctor Signature & Stamp */}
              <div className="col-span-5 flex flex-col items-center justify-center text-center">
                {doctor.digitalSignatureUrl ? (
                  <img
                    src={doctor.digitalSignatureUrl}
                    alt="Assinatura Digital"
                    className="max-h-12 object-contain mb-0.5"
                  />
                ) : (
                  <div className="h-6"></div>
                )}
                <div className="border-t border-slate-900 pt-1 w-full max-w-[280px]">
                  <p className="font-extrabold text-xs text-slate-950 uppercase tracking-wide">
                    {doctor.fullName || 'Dr(a). Médico Responsável'}
                  </p>
                  <p className="text-[11px] font-bold text-blue-950">
                    CRM/{doctor.uf || 'PA'} {doctor.crm || '000000'}
                    {doctor.rqe && <span className="ml-1 text-slate-600 font-medium">• RQE {doctor.rqe}</span>}
                  </p>
                  {doctor.specialty && (
                    <p className="text-[10px] text-slate-600 font-medium">
                      {doctor.specialty}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* PORTRAIT FOOTER */
            <>
              {/* Extended City and Date */}
              <div className="text-right text-xs text-slate-800 font-medium mb-6">
                {extendedDateString}
              </div>

              {/* Portaria 344/98 Anvisa Footer (When Controlled Prescription) */}
              {mode === 'prescricao' && prescriptionType === 'controle_especial' && (
                <div className="mb-6 border border-slate-400 rounded-md p-2.5 text-[9px] bg-slate-50/50">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Comprador */}
                    <div className="border-r border-slate-300 pr-3">
                      <p className="font-bold text-slate-900 uppercase mb-1">Identificação do Comprador:</p>
                      <div className="space-y-1">
                        <p>Nome: __________________________________________________</p>
                        <p>Doc. Identidade (RG): _________________ Órgão: ____________</p>
                        <p>Endereço: ______________________________________________</p>
                        <p>Cidade / UF: _________________________ Telefone: _________</p>
                      </div>
                    </div>
                    {/* Fornecedor */}
                    <div>
                      <p className="font-bold text-slate-900 uppercase mb-1">Identificação do Fornecedor:</p>
                      <div className="space-y-1">
                        <p>Farmácia / Drogaria: ___________________________________</p>
                        <p>Nome do Farmacêutico: _________________________________</p>
                        <p>CRF / UF: ___________________ Data: _____/_____/_________</p>
                        <p>Assinatura Farmacêutico: ________________________________</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Doctor Signature & Stamp Center/Right */}
              <div className="flex flex-col items-center justify-center my-4">
                {/* Signature stroke if available */}
                {doctor.digitalSignatureUrl ? (
                  <img
                    src={doctor.digitalSignatureUrl}
                    alt="Assinatura Digital"
                    className="max-h-16 object-contain mb-1"
                  />
                ) : (
                  <div className="h-10"></div>
                )}

                {/* Signature Line & Doctor details - displayed exclusively at the bottom */}
                <div className="border-t-2 border-slate-900 pt-1.5 text-center w-full max-w-[320px]">
                  <p className="font-extrabold text-xs sm:text-sm text-slate-950 uppercase tracking-wide">
                    {doctor.fullName || 'Dr(a). Médico Responsável'}
                  </p>
                  <p className="text-xs font-bold text-blue-950 mt-0.5">
                    CRM/{doctor.uf || 'UF'} {doctor.crm || '000000'}
                    {doctor.rqe && <span className="ml-1.5 text-slate-600 font-medium">• RQE {doctor.rqe}</span>}
                  </p>
                  {doctor.specialty && (
                    <p className="text-[11px] text-slate-700 font-medium mt-0.5">
                      {doctor.specialty}
                    </p>
                  )}
                </div>
              </div>

              {/* Document Footer with Clinic Address and Legal Notice */}
              <footer className="document-footer border-t border-slate-200 pt-2 text-center text-[10px] text-slate-500 mt-2">
                <p className="font-semibold text-slate-700">
                  {doctor.clinicName} • {doctor.razaoSocial || 'Venerável Ordem Terceira de São Francisco'} • CNPJ: {doctor.cnpj || '04.935.409/0002-31'}
                </p>
                <p>
                  {doctor.clinicAddress} • {doctor.clinicCityState} • CEP {doctor.clinicCep}
                  {doctor.clinicPhone && ` • Tel: ${doctor.clinicPhone}`}
                </p>
                <p className="text-[9px] text-slate-400 mt-0.5">
                  Documento médico gerado conforme resoluções do Conselho Federal de Medicina (CFM) e legislação sanitária vigente.
                </p>
              </footer>
            </>
          )}
        </div>
          </>
        )}
      </div>
    </div>
  );
};
