import React, { useEffect, useMemo, useState } from 'react';
import { AihData, DoctorProfile, InpatientInfo, PatientInfo } from '../types';
import { CidSearchAutocomplete } from './CidSearchAutocomplete';
import {
  downloadAihPdf,
  printAihPdf
} from '../services/aihPdfService';
import {
  CATALOGO_PROCEDIMENTOS_AIH,
  PROCEDIMENTO_OBSERVACAO_URGENCIA,
  ProcedimentoSigtapAih,
  CidCompativelAih,
  REGRAS_AIH,
  TEMPLATES_JUSTIFICATIVA_AIH,
  findProcedimentoByCid,
  findProcedimentoByCodigo,
  isCidSintomaticoBloqueado,
  isCidCausaExternaObrigatoria,
  getSugestoesCausaExterna
} from '../data/aihSigtapCatalog';
import { findCidByCode, findCidByTerm, resolveCidAndDescription } from '../data/cid10';
import {
  buildDefaultAdmissao,
  loadProntuarioFromStorage
} from '../data/prontuarioHospitalar';
import {
  FileSpreadsheet,
  User,
  Activity,
  FileCheck,
  RefreshCw,
  Printer,
  Download,
  Zap,
  ChevronDown,
  ChevronUp,
  Sparkles,
  CheckCircle2,
  ShieldAlert,
  Search,
  Clock
} from 'lucide-react';
import { getTodayIso } from '../utils/dateUtils';

interface AihFormProps {
  data: AihData;
  onChange: React.Dispatch<React.SetStateAction<AihData>>;
  doctor: DoctorProfile;
  patient: PatientInfo;
  inpatientInfo?: InpatientInfo;
  onUpdatePatient?: (patient: PatientInfo | ((prev: PatientInfo) => PatientInfo)) => void;
}

export const AihForm: React.FC<AihFormProps> = ({
  data,
  onChange,
  doctor,
  patient,
  inpatientInfo,
  onUpdatePatient
}) => {
  const [showAllFields, setShowAllFields] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<'cadastral' | 'causas' | 'pagina2'>('pagina2');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [buscaCidOuProc, setBuscaCidOuProc] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('TODAS');
  const [showCatalogoSigtap, setShowCatalogoSigtap] = useState(true);
  const [feedbackImportacao, setFeedbackImportacao] = useState(false);

  // Preenchimento Automático do Médico, Hospital e Data Atual do Sistema
  useEffect(() => {
    const todayIso = getTodayIso();
    onChange(prev => ({
      ...prev,
      estabelecimentoSolicitante:
        prev.estabelecimentoSolicitante || doctor.clinicName || 'Hospital Ordem Terceira',
      cnesSolicitante: prev.cnesSolicitante || '2332156',
      estabelecimentoExecutante:
        prev.estabelecimentoExecutante || doctor.clinicName || 'Hospital Ordem Terceira',
      cnesExecutante: prev.cnesExecutante || '2332156',
      nomeProfissionalSolicitante: doctor.fullName || prev.nomeProfissionalSolicitante,
      numeroDocumentoProfissional: doctor.crm || prev.numeroDocumentoProfissional,
      dataSolicitacao: prev.dataSolicitacao || todayIso,
      registroConselho: doctor.crm
        ? `CRM/${doctor.uf || 'PA'} ${doctor.crm}`
        : prev.registroConselho
    }));
  }, [doctor.fullName, doctor.crm, doctor.uf, doctor.clinicName, onChange]);

  const updateField = <K extends keyof AihData>(field: K, value: AihData[K]) => {
    onChange(prev => ({ ...prev, [field]: value }));
  };

  // =========================================================================
  // 1. FLUXO BIDIRECIONAL: CID-10 <-> PROCEDIMENTO PRINCIPAL SUS (SIGTAP 2026)
  // =========================================================================
  const mapClinicaToAih = (clinicaCatalogo: ProcedimentoSigtapAih['clinica']): string => {
    if (clinicaCatalogo.startsWith('01')) return 'Cirúrgica';
    if (clinicaCatalogo.startsWith('02')) return 'Obstétrica';
    if (clinicaCatalogo.startsWith('04')) return 'Pediátrica';
    return 'Médica';
  };

  const selecionarPorCid = (cidInput: string, fallbackDesc?: string) => {
    const cidLimpo = cidInput.toUpperCase().trim();
    const matchInfo = findProcedimentoByCid(cidLimpo);
    const resolvedCid = findCidByCode(cidLimpo);

    onChange(prev => {
      if (matchInfo) {
        return {
          ...prev,
          cid10Principal: matchInfo.cidMatch.cid,
          diagnosticoInicial: fallbackDesc || matchInfo.cidMatch.descricao,
          codigoProcedimento: matchInfo.procedimento.codigo_sigtap,
          descricaoProcedimentoSolicitado: matchInfo.procedimento.procedimento_sus,
          clinica: mapClinicaToAih(matchInfo.procedimento.clinica)
        };
      }
      return {
        ...prev,
        cid10Principal: resolvedCid?.code || cidLimpo,
        diagnosticoInicial: fallbackDesc || resolvedCid?.description || prev.diagnosticoInicial
      };
    });
  };

  const selecionarPorDiagnostico = (textoDiag: string) => {
    const matched = resolveCidAndDescription(textoDiag);
    onChange(prev => {
      if (matched) {
        const procInfo = findProcedimentoByCid(matched.code);
        return {
          ...prev,
          diagnosticoInicial: textoDiag,
          cid10Principal: matched.code,
          codigoProcedimento: procInfo ? procInfo.procedimento.codigo_sigtap : prev.codigoProcedimento,
          descricaoProcedimentoSolicitado: procInfo ? procInfo.procedimento.procedimento_sus : prev.descricaoProcedimentoSolicitado,
          clinica: procInfo ? mapClinicaToAih(procInfo.procedimento.clinica) : prev.clinica
        };
      }
      return {
        ...prev,
        diagnosticoInicial: textoDiag
      };
    });
  };

  const selecionarProcedimentoCatalogo = (
    proc: ProcedimentoSigtapAih,
    cidObj?: CidCompativelAih
  ) => {
    const cidEscolhido = cidObj || proc.cids_compativeis[0];
    onChange(prev => ({
      ...prev,
      codigoProcedimento: proc.codigo_sigtap,
      descricaoProcedimentoSolicitado: proc.procedimento_sus,
      clinica: mapClinicaToAih(proc.clinica),
      cid10Principal: cidEscolhido ? cidEscolhido.cid : prev.cid10Principal,
      diagnosticoInicial: cidEscolhido ? cidEscolhido.descricao : prev.diagnosticoInicial
    }));
  };

  // Procedimento atualmente selecionado no catálogo (para exibir Média de Permanência e CIDs compatíveis no topo)
  const procedimentoAtivoCatalogo = useMemo(() => {
    if (data.codigoProcedimento) {
      const byCode = findProcedimentoByCodigo(data.codigoProcedimento);
      if (byCode) return byCode;
    }
    if (data.cid10Principal) {
      const byCid = findProcedimentoByCid(data.cid10Principal);
      if (byCid) return byCid.procedimento;
    }
    return null;
  }, [data.codigoProcedimento, data.cid10Principal]);

  // =========================================================================
  // 2. IMPORTAR DADOS DA FICHA DE ADMISSÃO (1 CLIQUE)
  // =========================================================================
  const importarDaAdmissao = () => {
    const todayIso = getTodayIso();
    const defaultInpatient: InpatientInfo = inpatientInfo || {
      bed: patient.bed || '',
      ward: patient.ward || 'Enfermaria Clínica',
      admissionDate: todayIso,
      diagnosis: '',
      allergies: '',
      prescriptionDate: todayIso
    };
    const patientKey = patient.document || patient.name || 'default';
    const loaded = loadProntuarioFromStorage(
      patientKey,
      buildDefaultAdmissao(patient, doctor, defaultInpatient),
      []
    );
    const adm = loaded.admissao;

    const vitaisPartes: string[] = [];
    if (adm.sinaisVitais.pa) vitaisPartes.push(`PA ${adm.sinaisVitais.pa} mmHg`);
    if (adm.sinaisVitais.fc) vitaisPartes.push(`FC ${adm.sinaisVitais.fc} bpm`);
    if (adm.sinaisVitais.fr) vitaisPartes.push(`FR ${adm.sinaisVitais.fr} irpm`);
    if (adm.sinaisVitais.spo2) vitaisPartes.push(`SpO2 ${adm.sinaisVitais.spo2}%`);
    if (adm.sinaisVitais.temp) vitaisPartes.push(`Tax ${adm.sinaisVitais.temp}°C`);
    if (adm.sinaisVitais.glasgow) vitaisPartes.push(`Glasgow ${adm.sinaisVitais.glasgow}`);

    const exameResumo = [
      adm.exameSegmentar.geral,
      adm.exameSegmentar.acv,
      adm.exameSegmentar.ar,
      adm.exameSegmentar.abdome,
      adm.exameSegmentar.extremidadesNeuro
    ]
      .filter(Boolean)
      .join(' ');

    const blocosSinais: string[] = [];
    if (adm.queixaPrincipal) blocosSinais.push(`QP: ${adm.queixaPrincipal}.`);
    if (adm.hda) blocosSinais.push(`HDA: ${adm.hda}`);
    if (vitaisPartes.length > 0) {
      blocosSinais.push(`Sinais Vitais Admissionais: ${vitaisPartes.join(' | ')}.`);
    }
    if (exameResumo) {
      blocosSinais.push(`Exame Físico: ${exameResumo}`);
    }

    const diagPrincipalAdm = adm.diagnosticos[0];
    const matchCid = diagPrincipalAdm?.cidCode
      ? findProcedimentoByCid(diagPrincipalAdm.cidCode)
      : null;

    onChange(prev => ({
      ...prev,
      estabelecimentoSolicitante: doctor.clinicName || prev.estabelecimentoSolicitante || 'Hospital Ordem Terceira',
      cnesSolicitante: prev.cnesSolicitante || '2332156',
      estabelecimentoExecutante: doctor.clinicName || prev.estabelecimentoExecutante || 'Hospital Ordem Terceira',
      cnesExecutante: prev.cnesExecutante || '2332156',
      nomePaciente: patient.name || prev.nomePaciente,
      numeroProntuario: patient.document || prev.numeroProntuario,
      cnsPaciente: patient.cns || prev.cnsPaciente,
      dataNascimento: patient.birthDate || prev.dataNascimento,
      principaisSinaisSintomas: blocosSinais.join('\n\n') || prev.principaisSinaisSintomas,
      condicoesJustificamInternacao:
        prev.condicoesJustificamInternacao || TEMPLATES_JUSTIFICATIVA_AIH[0].texto,
      cid10Principal: matchCid
        ? matchCid.cidMatch.cid
        : diagPrincipalAdm?.cidCode || prev.cid10Principal,
      diagnosticoInicial: matchCid
        ? matchCid.cidMatch.descricao
        : diagPrincipalAdm?.descricao || prev.diagnosticoInicial,
      codigoProcedimento: matchCid
        ? matchCid.procedimento.codigo_sigtap
        : prev.codigoProcedimento,
      descricaoProcedimentoSolicitado: matchCid
        ? matchCid.procedimento.procedimento_sus
        : prev.descricaoProcedimentoSolicitado,
      clinica: matchCid
        ? mapClinicaToAih(matchCid.procedimento.clinica)
        : prev.clinica,
      pressaoArterial: adm.sinaisVitais.pa || prev.pressaoArterial,
      frequenciaCardiaca: adm.sinaisVitais.fc || prev.frequenciaCardiaca,
      pulso: adm.sinaisVitais.fc || prev.pulso,
      frequenciaRespiratoria: adm.sinaisVitais.fr || prev.frequenciaRespiratoria,
      febre: adm.sinaisVitais.temp || prev.febre,
      exameCirculatorio: adm.exameSegmentar.acv || prev.exameCirculatorio,
      exameAparelhoRespiratorio: adm.exameSegmentar.ar || prev.exameAparelhoRespiratorio,
      outrosAchadosClinicos: adm.exameSegmentar.abdome || prev.outrosAchadosClinicos,
      medicamentosEmUso:
        adm.medicacoesReconciliadas.length > 0
          ? adm.medicacoesReconciliadas
              .map(m => `${m.medicamento} ${m.dose} (${m.frequencia})`)
              .join('; ')
          : prev.medicamentosEmUso,
      nomeProfissionalSolicitante: doctor.fullName || prev.nomeProfissionalSolicitante,
      numeroDocumentoProfissional: doctor.crm || prev.numeroDocumentoProfissional,
      dataSolicitacao: todayIso,
      registroConselho: `CRM/${doctor.uf || 'PA'} ${doctor.crm || ''}`
    }));

    setFeedbackImportacao(true);
    setTimeout(() => setFeedbackImportacao(false), 3500);
  };

  // =========================================================================
  // 3. TRAVAS ANTI-GLOSA SUS (CAPÍTULO R / I46.9 E CAUSA EXTERNA S / T)
  // =========================================================================
  const cidSintomaticoBloqueado = useMemo(
    () => isCidSintomaticoBloqueado(data.cid10Principal),
    [data.cid10Principal]
  );

  const exigeCausaExterna = useMemo(
    () => isCidCausaExternaObrigatoria(data.cid10Principal),
    [data.cid10Principal]
  );

  const sugestoesCausaExterna = useMemo(
    () => (exigeCausaExterna ? getSugestoesCausaExterna(data.cid10Principal) : []),
    [exigeCausaExterna, data.cid10Principal]
  );

  const categoriasDisponiveis = useMemo(() => {
    const set = new Set<string>();
    CATALOGO_PROCEDIMENTOS_AIH.forEach(p => set.add(p.categoria));
    return ['TODAS', ...Array.from(set)];
  }, []);

  const resultadosCatalogo = useMemo(() => {
    const termo = buscaCidOuProc.toLowerCase().trim();
    return CATALOGO_PROCEDIMENTOS_AIH.filter(proc => {
      if (categoriaFiltro !== 'TODAS' && proc.categoria !== categoriaFiltro) {
        return false;
      }
      if (!termo) return true;
      return (
        proc.procedimento_sus.toLowerCase().includes(termo) ||
        proc.codigo_sigtap.toLowerCase().includes(termo) ||
        proc.categoria.toLowerCase().includes(termo) ||
        proc.cids_compativeis.some(
          c =>
            c.cid.toLowerCase().includes(termo) ||
            c.cid.toLowerCase().replace('.', '').includes(termo.replace('.', '')) ||
            c.descricao.toLowerCase().includes(termo)
        )
      );
    });
  }, [buscaCidOuProc, categoriaFiltro]);

  const handleDirectPdfDownload = async () => {
    try {
      setIsGeneratingPdf(true);
      await downloadAihPdf(data, doctor, patient);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleDirectPdfPrint = async () => {
    try {
      setIsGeneratingPdf(true);
      await printAihPdf(data, doctor, patient);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const inputClass =
    'w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-hidden transition-all font-medium text-slate-900';
  const labelClass = 'block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1';

  return (
    <div className="space-y-4">
      {/* Top Banner & Action Bar */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 text-white p-4 rounded-2xl shadow-md border border-blue-800/50">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-500/20 border border-sky-400/30 text-sky-300">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm sm:text-base font-extrabold tracking-tight">
                  Laudo de Solicitação de AIH — Oficial SUS (SIGTAP 2026)
                </h2>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  CID-10 ↔ SIGTAP Bidirecional
                </span>
              </div>
              <p className="text-[11px] text-blue-200/80">
                Validação anti-glosa em tempo real, vínculo automático CID ↔ Procedimento e injeção no PDF oficial de 2 páginas.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={importarDaAdmissao}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/30 hover:bg-indigo-500/45 text-indigo-100 text-xs font-bold border border-indigo-400/40 transition-all cursor-pointer"
              title="Puxar automaticamente HDA, Exame Físico, Sinais Vitais e CID da Ficha de Admissão"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span>Importar da Admissão</span>
            </button>

            <button
              type="button"
              onClick={handleDirectPdfDownload}
              disabled={isGeneratingPdf}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-extrabold shadow-xs transition-all cursor-pointer disabled:opacity-50"
              title="Injeta os dados diretamente no template oficial AIH_.pdf de 2 páginas"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar PDF Oficial</span>
            </button>

            <button
              type="button"
              onClick={handleDirectPdfPrint}
              disabled={isGeneratingPdf}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold shadow-xs transition-all cursor-pointer disabled:opacity-50"
              title="Gera o PDF oficial mesclado e abre a impressão nativa"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir AIH</span>
            </button>
          </div>
        </div>
      </div>

      {/* Feedback de Importação da Admissão */}
      {feedbackImportacao && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl flex items-center gap-2 text-xs font-bold animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            Sinais e Sintomas (HDA + Exame Físico + Sinais Vitais) e Diagnóstico sincronizados com a Ficha de Admissão!
          </span>
        </div>
      )}

      {/* =====================================================================
          TRAVA ANTI-GLOSA 1: CID SINTOMÁTICO (CAPÍTULO R OU I46.9)
          ===================================================================== */}
      {cidSintomaticoBloqueado && (
        <div className="p-3.5 rounded-xl border-2 border-red-300 bg-red-50 text-red-950 space-y-2 shadow-xs">
          <div className="flex items-start gap-2.5 text-xs">
            <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-extrabold uppercase text-red-800">
                Trava Anti-Glosa SUS — CID Sintomático Detectado ({data.cid10Principal})
              </p>
              <p className="font-semibold leading-relaxed text-red-900">
                {REGRAS_AIH.aviso_bloqueio}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 pl-7 flex-wrap">
            <button
              type="button"
              onClick={() => {
                onChange(prev => ({
                  ...prev,
                  codigoProcedimento: PROCEDIMENTO_OBSERVACAO_URGENCIA.codigo_sigtap,
                  descricaoProcedimentoSolicitado: PROCEDIMENTO_OBSERVACAO_URGENCIA.procedimento_sus,
                  clinica: 'Médica'
                }));
              }}
              className="px-3 py-1 rounded-lg bg-red-700 hover:bg-red-800 text-white text-[11px] font-bold transition cursor-pointer"
            >
              Vincular a Observação/Diagnóstico em Urgência (03.01.01.017-0)
            </button>
          </div>
        </div>
      )}

      {/* =====================================================================
          TRAVA ANTI-GLOSA 2: CAUSA EXTERNA OBRIGATÓRIA (CAPÍTULOS S E T)
          ===================================================================== */}
      {exigeCausaExterna && (
        <div
          className={`p-3.5 rounded-xl border-2 space-y-2.5 shadow-xs ${
            !data.cid10Secundario.trim()
              ? 'border-amber-400 bg-amber-50 text-amber-950'
              : 'border-emerald-300 bg-emerald-50/70 text-emerald-950'
          }`}
        >
          <div className="flex items-start gap-2.5 text-xs">
            <ShieldAlert
              className={`w-5 h-5 shrink-0 mt-0.5 ${
                !data.cid10Secundario.trim() ? 'text-amber-600' : 'text-emerald-600'
              }`}
            />
            <div className="space-y-1 flex-1">
              <p className="font-extrabold uppercase">
                {!data.cid10Secundario.trim()
                  ? `Causa Externa Obrigatória para CID ${data.cid10Principal} (Capítulos S e T)`
                  : `Causa Externa Preenchida (${data.cid10Secundario})`}
              </p>
              <p className="text-[11px] font-medium leading-relaxed">
                Quando o CID Principal inicia com <strong>S</strong> ou <strong>T</strong> (ex: Acidente Ofídico, Escorpiônico, Intoxicações ou Traumas), o SUS exige obrigatoriamente o preenchimento do <strong>CID Secundário de Causa Externa (Cap. V, W, X ou Y)</strong>.
              </p>
            </div>
          </div>

          <div className="space-y-1.5 pl-7">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-600">
              Sugestões Automáticas de Causa Externa (Clique para preencher o CID Secundário):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {sugestoesCausaExterna.map(sug => {
                const isSelected = data.cid10Secundario.toUpperCase() === sug.cid.toUpperCase();
                return (
                  <button
                    key={sug.cid}
                    type="button"
                    onClick={() => updateField('cid10Secundario', sug.cid)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition cursor-pointer ${
                      isSelected
                        ? 'bg-amber-700 text-white border-amber-700'
                        : 'bg-white hover:bg-amber-100 text-slate-800 border-amber-300'
                    }`}
                  >
                    <span className="font-mono">{sug.cid}</span> — {sug.descricao}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          SELETOR INTELIGENTE BIDIRECIONAL: CID-10 <-> PROCEDIMENTO SIGTAP 2026
          ===================================================================== */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-blue-200 space-y-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-600 text-white">
              <Search className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900">
                Catálogo Casado SIGTAP 2026 ↔ CID-10 ({CATALOGO_PROCEDIMENTOS_AIH.length} Procedimentos)
              </h3>
              <p className="text-[11px] text-slate-500">
                Selecione pelo Procedimento ou pelo CID-10 para vínculo bidirecional imediato sem risco de glosa.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {procedimentoAtivoCatalogo && (
              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-blue-800 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                Média de Permanência: {procedimentoAtivoCatalogo.media_permanencia_dias}{' '}
                {procedimentoAtivoCatalogo.media_permanencia_dias === 1 ? 'dia' : 'dias'}
              </span>
            )}
            <button
              type="button"
              onClick={() => setShowCatalogoSigtap(prev => !prev)}
              className="text-xs font-bold text-blue-700 hover:text-blue-900 bg-slate-100 hover:bg-blue-50 px-2.5 py-1 rounded-lg border border-slate-200 transition cursor-pointer"
            >
              {showCatalogoSigtap ? 'Recolher Catálogo' : 'Abrir Catálogo'}
            </button>
          </div>
        </div>

        {/* Se um procedimento já estiver selecionado, destaca no topo apenas os CIDs oficialmente compatíveis */}
        {procedimentoAtivoCatalogo && procedimentoAtivoCatalogo.cids_compativeis.length > 0 && (
          <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 space-y-1.5">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-blue-950">
                CIDs-10 Oficialmente Compatíveis com {procedimentoAtivoCatalogo.codigo_sigtap} ({procedimentoAtivoCatalogo.procedimento_sus}):
              </span>
              <span className="text-[10px] font-bold text-blue-700">
                Clique para definir o CID-10 Principal
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {procedimentoAtivoCatalogo.cids_compativeis.map(c => {
                const isActive =
                  data.cid10Principal.toUpperCase().replace('.', '') ===
                  c.cid.toUpperCase().replace('.', '');
                return (
                  <button
                    key={c.cid}
                    type="button"
                    onClick={() => selecionarProcedimentoCatalogo(procedimentoAtivoCatalogo, c)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition cursor-pointer flex items-center gap-1 ${
                      isActive
                        ? 'bg-blue-700 text-white border-blue-700 shadow-2xs'
                        : 'bg-white hover:bg-blue-100 text-slate-800 border-blue-200'
                    }`}
                  >
                    <span className="font-mono font-extrabold">{c.cid}</span>
                    <span>— {c.descricao}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {showCatalogoSigtap && (
          <div className="space-y-2.5 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
              <div className="sm:col-span-7">
                <input
                  type="text"
                  value={buscaCidOuProc}
                  onChange={e => setBuscaCidOuProc(e.target.value)}
                  placeholder="Buscar por CID (ex: J18.9, I50, N10, T63.0, K35) ou Procedimento SUS..."
                  className={inputClass}
                />
              </div>
              <div className="sm:col-span-5">
                <select
                  value={categoriaFiltro}
                  onChange={e => setCategoriaFiltro(e.target.value)}
                  className={inputClass}
                >
                  {categoriasDisponiveis.map(cat => (
                    <option key={cat} value={cat}>
                      {cat === 'TODAS' ? `Todas as Especialidades (${CATALOGO_PROCEDIMENTOS_AIH.length} Procedimentos)` : cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
              {resultadosCatalogo.map(proc => {
                const isProcSelected = data.codigoProcedimento === proc.codigo_sigtap;
                return (
                  <div
                    key={proc.codigo_sigtap}
                    className={`p-2.5 rounded-xl border transition ${
                      isProcSelected
                        ? 'border-blue-600 bg-blue-50/50 shadow-2xs'
                        : 'border-slate-200 hover:border-blue-300 bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-mono text-[10.5px] font-extrabold text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                          {proc.codigo_sigtap}
                        </span>
                        <span className="text-[10px] font-bold text-slate-600 bg-white border border-slate-200 px-1.5 py-0.5 rounded">
                          {proc.categoria}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        Média: {proc.media_permanencia_dias}{' '}
                        {proc.media_permanencia_dias === 1 ? 'dia' : 'dias'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => selecionarProcedimentoCatalogo(proc)}
                      className="text-left text-xs font-extrabold text-slate-900 hover:text-blue-700 block mb-1.5 cursor-pointer"
                    >
                      {proc.procedimento_sus}
                    </button>

                    <div className="flex flex-wrap gap-1">
                      {proc.cids_compativeis.map(c => {
                        const isCidAtivo =
                          data.cid10Principal.toUpperCase().replace('.', '') ===
                          c.cid.toUpperCase().replace('.', '');
                        return (
                          <button
                            key={c.cid}
                            type="button"
                            onClick={() => selecionarProcedimentoCatalogo(proc, c)}
                            className={`text-left text-[10.5px] px-2 py-0.5 rounded border transition flex items-center gap-1 cursor-pointer ${
                              isCidAtivo
                                ? 'bg-blue-600 text-white border-blue-600 font-bold'
                                : 'bg-white text-slate-700 border-slate-200 hover:border-blue-400'
                            }`}
                            title={`${c.cid} - ${c.descricao}`}
                          >
                            <span className="font-mono font-bold">{c.cid}</span>
                            <span className="truncate max-w-[180px]">- {c.descricao}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* =====================================================================
          MODO RÁPIDO: CAMPOS EM DESTAQUE PARA PREENCHIMENTO ÁGIL
          ===================================================================== */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border-2 border-blue-600/80 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-600 text-white">
              <Zap className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-blue-950">
                Dados Principais do Laudo AIH
              </h3>
              <p className="text-[11px] text-slate-500">
                Preencha ou revise Paciente, CID-10, Procedimento SIGTAP e Justificativa Clínica.
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Sincronizado com Espelho A4
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          {/* 1. NOME DO PACIENTE (Campo 5) */}
          <div className="sm:col-span-8">
            <label className={labelClass}>
              5 - Nome do Paciente *
            </label>
            <input
              type="text"
              value={data.nomePaciente}
              onChange={e => {
                const val = e.target.value;
                updateField('nomePaciente', val);
                if (onUpdatePatient) {
                  onUpdatePatient(prev => ({ ...prev, name: val }));
                }
              }}
              placeholder="Digite o nome completo do paciente..."
              className={`${inputClass} text-sm font-bold border-blue-300 bg-blue-50/30`}
            />
          </div>

          {/* 6. Nº DO PRONTUÁRIO */}
          <div className="sm:col-span-4">
            <label className={labelClass}>6 - Nº do Prontuário</label>
            <input
              type="text"
              value={data.numeroProntuario}
              onChange={e => {
                const val = e.target.value;
                updateField('numeroProntuario', val);
                if (onUpdatePatient) {
                  onUpdatePatient(prev => ({ ...prev, document: val }));
                }
              }}
              placeholder="Nº Prontuário ou CPF"
              className={inputClass}
            />
          </div>

          {/* 2. DIAGNÓSTICO INICIAL (Campo 23) + CID-10 PRINCIPAL (Campo 24) + CID SECUNDÁRIO (Campo 25) */}
          <div className="sm:col-span-12 space-y-2 pt-1">
            <label className={labelClass}>
              23 - Diagnóstico Inicial & 24 - CID-10 Principal (Vínculo Automático SIGTAP) *
            </label>
            <CidSearchAutocomplete
              selectedCidCode={data.cid10Principal}
              selectedCidDescription={data.diagnosticoInicial || 'Diagnóstico Clínico'}
              onSelectCid={cid => {
                selecionarPorCid(cid.code, cid.description);
              }}
              onClearCid={() => updateField('cid10Principal', '')}
              label="Pesquisar CID-10 (Selecionar o CID preenche automaticamente o Procedimento SIGTAP compatível)"
            />

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
              <div className="sm:col-span-6">
                <label className={labelClass}>23 - Diagnóstico Inicial (Descrição)</label>
                <input
                  type="text"
                  value={data.diagnosticoInicial}
                  onChange={e => selecionarPorDiagnostico(e.target.value)}
                  onBlur={e => {
                    const matched = resolveCidAndDescription(e.target.value);
                    if (matched) {
                      selecionarPorCid(matched.code, matched.description);
                    }
                  }}
                  placeholder="Ex: Pneumonia não especificada"
                  className={inputClass}
                />
              </div>
              <div className="sm:col-span-3">
                <label className={labelClass}>24 - CID-10 Principal *</label>
                <input
                  type="text"
                  value={data.cid10Principal}
                  onChange={e => selecionarPorCid(e.target.value)}
                  onBlur={e => {
                    const resolved = findCidByCode(e.target.value);
                    if (resolved) {
                      selecionarPorCid(resolved.code, resolved.description);
                    }
                  }}
                  placeholder="Ex: J18.9"
                  className={`${inputClass} font-mono font-extrabold border-blue-300 bg-blue-50/30 uppercase`}
                />
              </div>
              <div className="sm:col-span-3">
                <label className={labelClass}>
                  25 - CID-10 Secundário {exigeCausaExterna ? '* (Causa Externa)' : ''}
                </label>
                <input
                  type="text"
                  value={data.cid10Secundario}
                  onChange={e => updateField('cid10Secundario', e.target.value.toUpperCase())}
                  placeholder={exigeCausaExterna ? 'Obrigatório (Ex: X20.9)' : 'Ex: I10 / X20.9'}
                  className={`${inputClass} font-mono uppercase ${
                    exigeCausaExterna && !data.cid10Secundario.trim()
                      ? 'border-2 border-amber-500 bg-amber-50/50'
                      : ''
                  }`}
                />
              </div>
            </div>
          </div>

          {/* 3. PROCEDIMENTO SOLICITADO (Campo 27, 28, 29, 30) */}
          <div className="sm:col-span-12 space-y-2 pt-1">
            <div className="flex items-center justify-between flex-wrap gap-1">
              <label className={labelClass}>
                27 & 28 - Procedimento Principal SUS (Tabela SIGTAP) *
              </label>
              {procedimentoAtivoCatalogo && (
                <span className="text-[11px] font-bold text-blue-700">
                  Tempo Médio de Permanência Esperado: {procedimentoAtivoCatalogo.media_permanencia_dias} dias
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-3">
                <label className={labelClass}>28 - Código SIGTAP *</label>
                <input
                  type="text"
                  value={data.codigoProcedimento}
                  onChange={e => {
                    const val = e.target.value;
                    updateField('codigoProcedimento', val);
                    const found = findProcedimentoByCodigo(val);
                    if (found) {
                      selecionarProcedimentoCatalogo(found);
                    }
                  }}
                  placeholder="03.03.14.015-1"
                  className={`${inputClass} font-mono font-bold text-blue-950 border-blue-300 bg-blue-50/30`}
                />
              </div>
              <div className="sm:col-span-5">
                <label className={labelClass}>27 - Descrição do Procedimento Solicitado *</label>
                <input
                  type="text"
                  value={data.descricaoProcedimentoSolicitado}
                  onChange={e => updateField('descricaoProcedimentoSolicitado', e.target.value)}
                  placeholder="Descrição do procedimento hospitalar..."
                  className={`${inputClass} font-bold border-blue-300 bg-blue-50/30`}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>29 - Clínica</label>
                <select
                  value={data.clinica}
                  onChange={e => updateField('clinica', e.target.value)}
                  className={inputClass}
                >
                  <option value="Médica">03 - Médica</option>
                  <option value="Cirúrgica">01 - Cirúrgica</option>
                  <option value="Obstétrica">02 - Obstétrica</option>
                  <option value="Pediátrica">04 - Pediátrica</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>30 - Caráter</label>
                <select
                  value={data.caraterInternacao}
                  onChange={e => updateField('caraterInternacao', e.target.value)}
                  className={inputClass}
                >
                  <option value="02 - URGÊNCIA">02 - Urgência</option>
                  <option value="01 - ELETIVO">01 - Eletivo</option>
                  <option value="03 - ACIDENTE TRAB.">03 - Acid. Trab.</option>
                </select>
              </div>
            </div>
          </div>

          {/* 4. SINAIS E SINTOMAS, JUSTIFICATIVA E PROVAS DIAGNÓSTICAS (Campos 20, 21 e 22) */}
          <div className="sm:col-span-12 space-y-3 pt-1">
            <div>
              <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  20 - Principais Sinais e Sintomas Clínicos (HDA + Exame Físico + Sinais Vitais) *
                </label>
                <button
                  type="button"
                  onClick={importarDaAdmissao}
                  className="text-[10px] font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2 py-0.5 rounded transition cursor-pointer"
                >
                  Puxar da Ficha de Admissão
                </button>
              </div>
              <textarea
                rows={3}
                value={data.principaisSinaisSintomas}
                onChange={e => updateField('principaisSinaisSintomas', e.target.value)}
                placeholder=""
                className={inputClass}
              />
            </div>

            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  21 - Condições que Justificam a Internação *
                </label>
                <div className="flex flex-wrap gap-1">
                  {TEMPLATES_JUSTIFICATIVA_AIH.map((t, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => updateField('condicoesJustificamInternacao', t.texto)}
                      className="text-[10px] font-semibold bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 px-2 py-0.5 rounded border border-slate-200 transition cursor-pointer"
                    >
                      + {t.label}
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                rows={2}
                value={data.condicoesJustificamInternacao}
                onChange={e => updateField('condicoesJustificamInternacao', e.target.value)}
                placeholder="Ex: Necessidade de antibioticoterapia venosa, suporte de O2 e monitorização clínica..."
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                22 - Principais Resultados de Provas Diagnósticas (Exames Laboratoriais / Imagem realizados na entrada)
              </label>
              <textarea
                rows={2}
                value={data.resultadosProvasDiagnosticas}
                onChange={e => updateField('resultadosProvasDiagnosticas', e.target.value)}
                placeholder=""
                className={inputClass}
              />
            </div>
          </div>

          {/* 5. CAMPOS AUTOMÁTICOS DO SISTEMA (33 - NOME DO PROFISSIONAL, 32 - CRM, 34 - DATA) */}
          <div className="sm:col-span-12 bg-slate-50 border border-slate-200 rounded-xl p-3 grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-6">
              <label className={labelClass}>
                33 - Nome do Profissional Solicitante <span className="text-emerald-700">(Automático)</span>
              </label>
              <input
                type="text"
                value={data.nomeProfissionalSolicitante}
                onChange={e => updateField('nomeProfissionalSolicitante', e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="sm:col-span-3">
              <label className={labelClass}>
                34 - Data da Solicitação <span className="text-emerald-700">(Automático)</span>
              </label>
              <input
                type="date"
                value={data.dataSolicitacao}
                onChange={e => updateField('dataSolicitacao', e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="sm:col-span-3">
              <label className={labelClass}>35 - Registro do Conselho (CRM)</label>
              <input
                type="text"
                value={data.registroConselho}
                onChange={e => updateField('registroConselho', e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Botão para alternar exibição dos campos complementares */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => setShowAllFields(prev => !prev)}
          className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 shadow-2xs flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          {showAllFields ? (
            <>
              <ChevronUp className="w-4 h-4 text-blue-600" />
              <span>Ocultar seções complementares</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 text-blue-600" />
              <span>Editar campos complementares (Cadastro/CNS/Mãe/Endereço, Causas Externas e Folha Clínica da Página 2)</span>
            </>
          )}
        </button>
      </div>

      {showAllFields && (
        <div className="space-y-4">
          {/* Navegação entre seções secundárias */}
          <div className="flex gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveAccordion('cadastral')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeAccordion === 'cadastral'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Página 1: Cadastro, CNS, Mãe & Endereço
            </button>
            <button
              type="button"
              onClick={() => setActiveAccordion('pagina2')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeAccordion === 'pagina2'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Página 2: Folha Clínica (Dados Vitais & Exames)
            </button>
            <button
              type="button"
              onClick={() => setActiveAccordion('causas')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeAccordion === 'causas'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Página 1: Causas Externas & Autorização
            </button>
          </div>

          {/* ABA: PÁGINA 2 - FOLHA CLÍNICA */}
          {activeAccordion === 'pagina2' && (
            <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200/90 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <Activity className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                  Folha Clínica da Página 2 — Sinais, Dados Vitais e Exames
                </h3>
              </div>

              {/* Sinais / Sintomas e Dados Vitais */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-3">
                  <label className={labelClass}>Alteração de Consciência</label>
                  <select
                    value={data.alteracaoConsciencia || 'nao'}
                    onChange={e => updateField('alteracaoConsciencia', e.target.value as 'sim' | 'nao')}
                    className={inputClass}
                  >
                    <option value="nao">Não</option>
                    <option value="sim">Sim</option>
                  </select>
                </div>
                <div className="sm:col-span-3">
                  <label className={labelClass}>Febre</label>
                  <input
                    type="text"
                    value={data.febre || ''}
                    onChange={e => updateField('febre', e.target.value)}
                    placeholder="Ex: 38,5 °C ou Ausente"
                    className={inputClass}
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className={labelClass}>Desnutrição</label>
                  <input
                    type="text"
                    value={data.desnutricao || ''}
                    onChange={e => updateField('desnutricao', e.target.value)}
                    placeholder="Ex: Grau I, Ausente..."
                    className={inputClass}
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className={labelClass}>Desidratação</label>
                  <select
                    value={data.desidratacao || 'nao'}
                    onChange={e => updateField('desidratacao', e.target.value as 'sim' | 'nao' | 'ignorado')}
                    className={inputClass}
                  >
                    <option value="nao">Não</option>
                    <option value="sim">Sim</option>
                    <option value="ignorado">Ignorado</option>
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <label className={labelClass}>Pulso</label>
                  <input
                    type="text"
                    value={data.pulso || ''}
                    onChange={e => updateField('pulso', e.target.value)}
                    placeholder="Ex: 80 bpm"
                    className={inputClass}
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className={labelClass}>Pressão Arterial</label>
                  <input
                    type="text"
                    value={data.pressaoArterial || ''}
                    onChange={e => updateField('pressaoArterial', e.target.value)}
                    placeholder="Ex: 120x80 mmHg"
                    className={inputClass}
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className={labelClass}>F. Respiratória</label>
                  <input
                    type="text"
                    value={data.frequenciaRespiratoria || ''}
                    onChange={e => updateField('frequenciaRespiratoria', e.target.value)}
                    placeholder="Ex: 18 irpm"
                    className={inputClass}
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className={labelClass}>F. Cardíaca</label>
                  <input
                    type="text"
                    value={data.frequenciaCardiaca || ''}
                    onChange={e => updateField('frequenciaCardiaca', e.target.value)}
                    placeholder="Ex: 80 bpm"
                    className={inputClass}
                  />
                </div>

                <div className="sm:col-span-12">
                  <label className={labelClass}>Medicamentos em Uso</label>
                  <textarea
                    rows={2}
                    value={data.medicamentosEmUso || ''}
                    onChange={e => updateField('medicamentosEmUso', e.target.value)}
                    placeholder="Medicamentos de uso contínuo..."
                    className={inputClass}
                  />
                </div>

                <div className="sm:col-span-12">
                  <label className={labelClass}>Motivo do Encaminhamento</label>
                  <textarea
                    rows={2}
                    value={data.motivoEncaminhamento || ''}
                    onChange={e => updateField('motivoEncaminhamento', e.target.value)}
                    placeholder="Justificativa do encaminhamento e necessidade de internação..."
                    className={inputClass}
                  />
                </div>

                <div className="sm:col-span-4">
                  <label className={labelClass}>Exame Circulatório</label>
                  <input
                    type="text"
                    value={data.exameCirculatorio || ''}
                    onChange={e => updateField('exameCirculatorio', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="sm:col-span-4">
                  <label className={labelClass}>Exame Aparelho Respiratório</label>
                  <input
                    type="text"
                    value={data.exameAparelhoRespiratorio || ''}
                    onChange={e => updateField('exameAparelhoRespiratorio', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="sm:col-span-4">
                  <label className={labelClass}>Outros Achados Clínicos</label>
                  <input
                    type="text"
                    value={data.outrosAchadosClinicos || ''}
                    onChange={e => updateField('outrosAchadosClinicos', e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div className="sm:col-span-6">
                  <label className={labelClass}>Exames Lab (Urina, Hemograma, etc.)</label>
                  <input
                    type="text"
                    value={data.examesLaboratoriais || ''}
                    onChange={e => updateField('examesLaboratoriais', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="sm:col-span-6">
                  <label className={labelClass}>Radiografias</label>
                  <input
                    type="text"
                    value={data.radiografias || ''}
                    onChange={e => updateField('radiografias', e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ABA: PÁGINA 1 - CADASTRO */}
          {activeAccordion === 'cadastral' && (
            <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200/90 space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <User className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                  Dados Cadastrais e Endereço do Paciente
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-6">
                  <label className={labelClass}>7 - Cartão Nacional de Saúde (CNS - 15 dígitos)</label>
                  <input
                    type="text"
                    maxLength={15}
                    value={data.cnsPaciente}
                    onChange={e => updateField('cnsPaciente', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className={labelClass}>8 - Data de Nascimento</label>
                  <input
                    type="date"
                    value={data.dataNascimento}
                    onChange={e => updateField('dataNascimento', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className={labelClass}>9 - Sexo</label>
                  <select
                    value={data.sexo}
                    onChange={e => updateField('sexo', e.target.value as AihData['sexo'])}
                    className={inputClass}
                  >
                    <option value="">Selecione</option>
                    <option value="1">1 - Masculino</option>
                    <option value="3">3 - Feminino</option>
                  </select>
                </div>

                <div className="sm:col-span-6">
                  <label className={labelClass}>11 - Nome da Mãe</label>
                  <input
                    type="text"
                    value={data.nomeMaeOuResponsavel}
                    onChange={e => updateField('nomeMaeOuResponsavel', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="sm:col-span-6">
                  <label className={labelClass}>12 - Telefone de Contato</label>
                  <input
                    type="text"
                    value={data.telefoneContato}
                    onChange={e => updateField('telefoneContato', e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div className="sm:col-span-12">
                  <label className={labelClass}>15 - Endereço (Rua, Nº, Bairro)</label>
                  <input
                    type="text"
                    value={data.endereco}
                    onChange={e => updateField('endereco', e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div className="sm:col-span-5">
                  <label className={labelClass}>16 - Município de Residência</label>
                  <input
                    type="text"
                    value={data.municipioResidencia}
                    onChange={e => updateField('municipioResidencia', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className={labelClass}>17 - Cód. IBGE Município</label>
                  <input
                    type="text"
                    value={data.codIbgeMunicipio}
                    onChange={e => updateField('codIbgeMunicipio', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>18 - UF</label>
                  <input
                    type="text"
                    maxLength={2}
                    value={data.uf}
                    onChange={e => updateField('uf', e.target.value.toUpperCase())}
                    className={inputClass}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>19 - CEP</label>
                  <input
                    type="text"
                    value={data.cep}
                    onChange={e => updateField('cep', e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ABA: CAUSAS EXTERNAS & AUTORIZAÇÃO */}
          {activeAccordion === 'causas' && (
            <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200/90 space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <FileCheck className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                  Causas Externas (Acidentes/Violências) e Autorização
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-6">
                  <label className={labelClass}>36-38 - Causa Externa</label>
                  <select
                    value={data.causaExterna || 'nenhuma'}
                    onChange={e => updateField('causaExterna', e.target.value as AihData['causaExterna'])}
                    className={inputClass}
                  >
                    <option value="nenhuma">Não se aplica</option>
                    <option value="transito">36 - Acidente de Trânsito</option>
                    <option value="trabalho_tipico">37 - Acidente de Trabalho Típico</option>
                    <option value="trabalho_trajeto">38 - Acidente de Trabalho Trajeto</option>
                  </select>
                </div>
                <div className="sm:col-span-6">
                  <label className={labelClass}>45 - Vínculo Previdenciário</label>
                  <select
                    value={data.vinculoPrevidencia || 'nao_segurado'}
                    onChange={e => updateField('vinculoPrevidencia', e.target.value as AihData['vinculoPrevidencia'])}
                    className={inputClass}
                  >
                    <option value="nao_segurado">Não Segurado</option>
                    <option value="empregado">Empregado</option>
                    <option value="empregador">Empregador</option>
                    <option value="autonomo">Autônomo</option>
                    <option value="desempregado">Desempregado</option>
                    <option value="aposentado">Aposentado</option>
                  </select>
                </div>

                <div className="sm:col-span-6">
                  <label className={labelClass}>46 - Nome do Profissional Autorizador</label>
                  <input
                    type="text"
                    value={data.nomeProfissionalAutorizador || ''}
                    onChange={e => updateField('nomeProfissionalAutorizador', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className={labelClass}>47 - Cód. Órgão Emissor</label>
                  <input
                    type="text"
                    value={data.codOrgaoEmissor || ''}
                    onChange={e => updateField('codOrgaoEmissor', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className={labelClass}>52 - Nº da Autorização AIH</label>
                  <input
                    type="text"
                    value={data.numeroAih || ''}
                    onChange={e => updateField('numeroAih', e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
