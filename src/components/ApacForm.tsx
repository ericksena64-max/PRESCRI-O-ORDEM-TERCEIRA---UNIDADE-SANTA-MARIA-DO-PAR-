import React, { useEffect, useState, useMemo, useRef } from 'react';
import { ApacData, ApacSecundarioItem, DoctorProfile, PatientInfo } from '../types';
import { CidSearchAutocomplete } from './CidSearchAutocomplete';
import { AntiGlosaBadge } from './AntiGlosaBadge';
import { findCidByCode, resolveCidAndDescription } from '../data/cid10';
import {
  APAC_COMMON_PROCEDURES,
  downloadApacPdf,
  printApacPdf,
  searchApacProcedures,
  findApacProcedureByCodeOrName,
  ApacUnifiedProcedure
} from '../services/apacPdfService';
import {
  updateDoctorDocumentPreference,
  formatCpfMask
} from '../services/doctorAuthService';
import { saveDoctorProfileToStorage } from '../data/defaultData';
import {
  ClipboardCheck,
  User,
  Building2,
  Stethoscope,
  FileCheck,
  RefreshCw,
  Plus,
  Trash2,
  Printer,
  Download,
  Zap,
  ChevronDown,
  ChevronUp,
  Sparkles,
  CheckCircle2,
  CreditCard,
  Save,
  Search,
  Layers
} from 'lucide-react';
import { getTodayIso } from '../utils/dateUtils';

interface ApacFormProps {
  data: ApacData;
  onChange: React.Dispatch<React.SetStateAction<ApacData>>;
  doctor: DoctorProfile;
  patient: PatientInfo;
  onUpdatePatient?: (patient: PatientInfo | ((prev: PatientInfo) => PatientInfo)) => void;
  onSaveDoctorProfile?: (profile: DoctorProfile) => void;
}

export const ApacForm: React.FC<ApacFormProps> = ({
  data,
  onChange,
  doctor,
  patient,
  onUpdatePatient,
  onSaveDoctorProfile
}) => {
  const [showAllFields, setShowAllFields] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [docSavedFeedback, setDocSavedFeedback] = useState(false);

  // Autocomplete do Procedimento Solicitado (Campo 19 e 18)
  const [procQuery, setProcQuery] = useState(data.nomeProcedimentoPrincipal || '');
  const [isProcDropdownOpen, setIsProcDropdownOpen] = useState(false);
  const procContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setProcQuery(data.nomeProcedimentoPrincipal || '');
  }, [data.nomeProcedimentoPrincipal]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (procContainerRef.current && !procContainerRef.current.contains(e.target as Node)) {
        setIsProcDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const procResults = useMemo(() => {
    if (!isProcDropdownOpen) return [];
    return searchApacProcedures(procQuery, 8);
  }, [procQuery, isProcDropdownOpen]);

  // Preenchimento Automático com médico ativo, data do sistema e documento (CNS ou CPF) fixo do perfil
  useEffect(() => {
    const todayIso = getTodayIso();
    const docType: 'CNS' | 'CPF' = data.tipoDocumentoSolicitante || doctor.documentType || (doctor.cns ? 'CNS' : 'CPF');
    const docNum = docType === 'CNS'
      ? (doctor.cns || data.cnsProfissionalSolicitante || '')
      : (doctor.cpf ? doctor.cpf.replace(/\D/g, '') : (data.cnsProfissionalSolicitante || ''));

    onChange(prev => ({
      ...prev,
      estabelecimentoSolicitante:
        prev.estabelecimentoSolicitante || doctor.clinicName || 'Hospital Ordem Terceira',
      nomeProfissionalSolicitante: doctor.fullName || prev.nomeProfissionalSolicitante,
      dataSolicitacao: prev.dataSolicitacao || todayIso,
      tipoDocumentoSolicitante: docType,
      cnsProfissionalSolicitante: prev.cnsProfissionalSolicitante || docNum.replace(/\D/g, ''),
      registroConselhoSolicitante: doctor.crm
        ? `CRM/${doctor.uf || 'PA'} ${doctor.crm}`
        : prev.registroConselhoSolicitante
    }));
  }, [doctor.fullName, doctor.crm, doctor.uf, doctor.clinicName, doctor.documentType, doctor.cns, doctor.cpf, onChange]);

  const updateField = <K extends keyof ApacData>(field: K, value: ApacData[K]) => {
    onChange(prev => ({ ...prev, [field]: value }));
  };

  const handleFixDoctorDocument = () => {
    const newDocType = data.tipoDocumentoSolicitante || doctor.documentType || 'CPF';
    const cleanDigits = (data.cnsProfissionalSolicitante || '').replace(/\D/g, '');
    if (doctor.crm) {
      updateDoctorDocumentPreference({
        crm: doctor.crm,
        documentType: newDocType,
        documentNumber: cleanDigits
      });
      const updatedDoctor: DoctorProfile = {
        ...doctor,
        documentType: newDocType,
        cns: newDocType === 'CNS' ? cleanDigits.slice(0, 15) : doctor.cns,
        cpf: newDocType === 'CPF' ? formatCpfMask(cleanDigits.slice(0, 11)) : doctor.cpf
      };
      if (onSaveDoctorProfile) onSaveDoctorProfile(updatedDoctor);
      saveDoctorProfileToStorage(updatedDoctor);
      setDocSavedFeedback(true);
      setTimeout(() => setDocSavedFeedback(false), 2500);
    }
  };

  const handleSelectProcedure = (proc: ApacUnifiedProcedure) => {
    onChange(prev => ({
      ...prev,
      codigoProcedimentoPrincipal: proc.codigo,
      nomeProcedimentoPrincipal: proc.nome,
      quantidadePrincipal: proc.qtde || '01',
      cid10Principal: prev.cid10Principal || proc.cidSugerido || '',
      descricaoDiagnostico: prev.descricaoDiagnostico || proc.descricaoDiagnosticoSugerida || ''
    }));
    setProcQuery(proc.nome);
    setIsProcDropdownOpen(false);
  };

  const handleCodeChange = (rawCode: string) => {
    const cleanDigits = rawCode.replace(/\D/g, '').slice(0, 10);
    updateField('codigoProcedimentoPrincipal', cleanDigits);

    if (cleanDigits.length >= 8) {
      const found = findApacProcedureByCodeOrName(cleanDigits);
      if (found) {
        onChange(prev => ({
          ...prev,
          codigoProcedimentoPrincipal: found.codigo,
          nomeProcedimentoPrincipal: found.nome,
          quantidadePrincipal: found.qtde || prev.quantidadePrincipal || '01',
          cid10Principal: prev.cid10Principal || found.cidSugerido || '',
          descricaoDiagnostico: prev.descricaoDiagnostico || found.descricaoDiagnosticoSugerida || ''
        }));
        setProcQuery(found.nome);
      }
    }
  };

  const handleSyncFromPatientAndDoctor = () => {
    const todayIso = getTodayIso();
    onChange(prev => ({
      ...prev,
      estabelecimentoSolicitante: doctor.clinicName || 'Hospital Ordem Terceira',
      nomePaciente: patient.name || prev.nomePaciente,
      numeroProntuario: patient.document || prev.numeroProntuario,
      dataNascimento: patient.birthDate || prev.dataNascimento,
      nomeProfissionalSolicitante: doctor.fullName || prev.nomeProfissionalSolicitante,
      dataSolicitacao: todayIso,
      registroConselhoSolicitante: `CRM/${doctor.uf || 'PA'} ${doctor.crm || ''}`
    }));
  };

  const handleSelectPresetProcedure = (preset: (typeof APAC_COMMON_PROCEDURES)[number]) => {
    onChange(prev => ({
      ...prev,
      codigoProcedimentoPrincipal: preset.codigo,
      nomeProcedimentoPrincipal: preset.nome,
      quantidadePrincipal: preset.qtde || '01',
      cid10Principal: prev.cid10Principal || preset.cidSugerido || '',
      descricaoDiagnostico:
        prev.descricaoDiagnostico || preset.descricaoDiagnosticoSugerida || ''
    }));
  };

  const addSecundario = () => {
    if (data.procedimentosSecundarios.length >= 5) return;
    const newItem: ApacSecundarioItem = {
      id: `sec-${Date.now()}`,
      codigo: '',
      nome: '',
      quantidade: '01'
    };
    updateField('procedimentosSecundarios', [...data.procedimentosSecundarios, newItem]);
  };

  const updateSecundario = (id: string, field: keyof ApacSecundarioItem, value: string) => {
    updateField(
      'procedimentosSecundarios',
      data.procedimentosSecundarios.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const removeSecundario = (id: string) => {
    updateField(
      'procedimentosSecundarios',
      data.procedimentosSecundarios.filter(item => item.id !== id)
    );
  };

  const handleDirectPdfDownload = async () => {
    try {
      setIsGeneratingPdf(true);
      await downloadApacPdf(data, doctor, patient);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleDirectPdfPrint = async () => {
    try {
      setIsGeneratingPdf(true);
      await printApacPdf(data, doctor, patient);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const inputClass =
    'w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-hidden transition-all font-medium text-slate-900';
  const labelClass = 'block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1';

  return (
    <div className="space-y-5">
      {/* Top Banner & Action Bar */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 text-white p-4 rounded-2xl shadow-md border border-blue-800/50">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-500/20 border border-sky-400/30 text-sky-300">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-extrabold tracking-tight">
                  Laudo APAC — Página Única Oficial SUS (Campos 1 a 55)
                </h2>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Fidelidade 100% PDF (pdf-lib)
                </span>
              </div>
              <p className="text-[11px] text-blue-200/80">
                Validação flexível: imprima ou baixe o PDF oficial mesmo com campos em branco.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSyncFromPatientAndDoctor}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/15 transition-all cursor-pointer"
              title="Puxar dados do paciente e médico logado"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sincronizar</span>
            </button>

            <button
              type="button"
              onClick={handleDirectPdfDownload}
              disabled={isGeneratingPdf}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-extrabold shadow-xs transition-all cursor-pointer disabled:opacity-50"
              title="Injeta os dados diretamente no Formulario_APAC_LAUDO.pdf via pdf-lib"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar PDF Oficial</span>
            </button>

            <button
              type="button"
              onClick={handleDirectPdfPrint}
              disabled={isGeneratingPdf}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold shadow-xs transition-all cursor-pointer disabled:opacity-50"
              title="Gera o PDF oficial mesclado e abre a impressão"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir APAC</span>
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================================
          CENÁRIO DE USO PRINCIPAL (REGRA 4) + PREENCHIMENTO AUTOMÁTICO (REGRA 3)
          ===================================================================== */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border-2 border-blue-600/80 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-600 text-white">
              <Zap className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-blue-950">
                Preenchimento Rápido — Cenário de Uso Principal
              </h3>
              <p className="text-[11px] text-slate-500">
                Preencha apenas Paciente, Procedimento e CID-10. O Médico Solicitante e a Data já estão preenchidos automaticamente.
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Pronto para Impressão
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          {/* 1. NOME DO PACIENTE (Campo 3) */}
          <div className="sm:col-span-8">
            <label className={labelClass}>
              3 - Nome do Paciente <span className="text-blue-600 font-extrabold">(Campo Principal 1)</span>
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

          {/* 5. Nº DO PRONTUÁRIO / CNS RÁPIDO */}
          <div className="sm:col-span-4">
            <label className={labelClass}>5 - Nº do Prontuário (Opcional)</label>
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

          {/* 2. PROCEDIMENTO SOLICITADO (Campos 19, 18, 20) */}
          <div className="sm:col-span-12 space-y-2">
            <div className="flex items-center justify-between">
              <label className={labelClass}>
                19 - Procedimento Solicitado <span className="text-blue-600 font-extrabold">(Campo Principal 2 — Ex: Tomografia, Radiografia)</span>
              </label>
              <span className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                Clique em um atalho ou digite livremente:
              </span>
            </div>

            {/* Atalhos Rápidos de Exames / Procedimentos */}
            <div className="flex flex-wrap gap-1.5">
              {APAC_COMMON_PROCEDURES.map(proc => {
                const isSelected =
                  data.nomeProcedimentoPrincipal.toUpperCase() === proc.nome.toUpperCase();
                return (
                  <button
                    key={proc.codigo}
                    type="button"
                    onClick={() => handleSelectPresetProcedure(proc)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                        : 'bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-800 border-slate-200'
                    }`}
                  >
                    {proc.nome}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
              <div ref={procContainerRef} className="sm:col-span-7 relative">
                <input
                  type="text"
                  value={procQuery}
                  onChange={e => {
                    const val = e.target.value;
                    setProcQuery(val);
                    updateField('nomeProcedimentoPrincipal', val);
                    setIsProcDropdownOpen(true);
                  }}
                  onFocus={() => setIsProcDropdownOpen(true)}
                  placeholder="19 - Nome do Procedimento Solicitado (ou busque por exame)..."
                  className={`${inputClass} text-sm font-bold border-blue-300 bg-blue-50/30`}
                />
                {isProcDropdownOpen && procResults.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 max-h-64 overflow-y-auto">
                    <div className="p-2 bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                      <span>Procedimentos Encontrados ({procResults.length})</span>
                      <span className="text-[9px] text-blue-600 font-semibold">Preenche Campo 18 e 19</span>
                    </div>
                    {procResults.map((proc, i) => (
                      <button
                        key={`${proc.codigo}-${i}`}
                        type="button"
                        onClick={() => handleSelectProcedure(proc)}
                        className="w-full text-left p-2.5 hover:bg-blue-50 border-b border-slate-50 last:border-b-0 flex items-start justify-between gap-2 group transition-colors cursor-pointer"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-slate-900 group-hover:text-blue-800">
                            {proc.nome}
                          </p>
                          {proc.descricaoDiagnosticoSugerida && (
                            <p className="text-[10px] text-slate-500 truncate">
                              {proc.descricaoDiagnosticoSugerida}
                            </p>
                          )}
                        </div>
                        <span className="font-mono text-[11px] font-bold px-2 py-0.5 bg-blue-100 text-blue-900 rounded-md shrink-0">
                          {proc.codigo}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="sm:col-span-3">
                <input
                  type="text"
                  maxLength={10}
                  value={data.codigoProcedimentoPrincipal}
                  onChange={e => handleCodeChange(e.target.value)}
                  placeholder="18 - Código (10 dígitos)"
                  className={`${inputClass} font-mono font-bold text-blue-950`}
                  title="18 - Código do Procedimento Principal (Preenchimento automático)"
                />
              </div>
              <div className="sm:col-span-2">
                <input
                  type="text"
                  value={data.quantidadePrincipal}
                  onChange={e => updateField('quantidadePrincipal', e.target.value)}
                  placeholder="20 - Qtde (01)"
                  className={inputClass}
                  title="20 - Quantidade"
                />
              </div>
            </div>
          </div>

          {/* 3. CID 10 PRINCIPAL (Campo 37) + DESCRIÇÃO DO DIAGNÓSTICO (Campo 36) */}
          <div className="sm:col-span-12 space-y-2 pt-1">
            <label className={labelClass}>
              37 - CID-10 Principal & 36 - Descrição do Diagnóstico <span className="text-blue-600 font-extrabold">(Campo Principal 3)</span>
            </label>
            <CidSearchAutocomplete
              selectedCidCode={data.cid10Principal}
              selectedCidDescription={data.descricaoDiagnostico || 'Diagnóstico Clínico'}
              onSelectCid={cid => {
                onChange(prev => ({
                  ...prev,
                  cid10Principal: cid.code,
                  descricaoDiagnostico: cid.description
                }));
              }}
              onClearCid={() => updateField('cid10Principal', '')}
              label="Buscar CID-10 (inclui 'Infecção a esclarecer' - A49.9)"
            />

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
              <div className="sm:col-span-4">
                <label className={labelClass}>37 - Código CID-10 Principal</label>
                <input
                  type="text"
                  value={data.cid10Principal}
                  onChange={e => {
                    const val = e.target.value.toUpperCase();
                    const resolved = findCidByCode(val);
                    onChange(prev => ({
                      ...prev,
                      cid10Principal: val,
                      descricaoDiagnostico: resolved ? resolved.description : prev.descricaoDiagnostico
                    }));
                  }}
                  onBlur={e => {
                    const resolved = findCidByCode(e.target.value);
                    if (resolved) {
                      onChange(prev => ({
                        ...prev,
                        cid10Principal: resolved.code,
                        descricaoDiagnostico: resolved.description
                      }));
                    }
                  }}
                  placeholder="Ex: A49.9, R51, M54.5"
                  className={`${inputClass} font-extrabold border-blue-300 bg-blue-50/30`}
                />
              </div>
              <div className="sm:col-span-8">
                <label className={labelClass}>36 - Descrição do Diagnóstico (Opcional)</label>
                <input
                  type="text"
                  value={data.descricaoDiagnostico}
                  onChange={e => {
                    const val = e.target.value;
                    const matched = resolveCidAndDescription(val);
                    onChange(prev => ({
                      ...prev,
                      descricaoDiagnostico: val,
                      cid10Principal: matched ? matched.code : prev.cid10Principal
                    }));
                  }}
                  onBlur={e => {
                    const matched = resolveCidAndDescription(e.target.value);
                    if (matched) {
                      onChange(prev => ({
                        ...prev,
                        cid10Principal: matched.code,
                        descricaoDiagnostico: matched.description
                      }));
                    }
                  }}
                  placeholder="Ex: Infecção a esclarecer / Investigação diagnóstica"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Validador Anti-Glosa SUS (SIGTAP <-> CID-10) */}
            <div className="pt-2">
              <AntiGlosaBadge
                codigoProcedimento={data.codigoProcedimentoPrincipal}
                nomeProcedimento={data.nomeProcedimentoPrincipal}
                cid10={data.cid10Principal}
                instrumento="APAC"
                onApplySuggestedCid={sug => {
                  onChange(prev => ({
                    ...prev,
                    cid10Principal: sug.code,
                    descricaoDiagnostico: sug.description
                  }));
                }}
              />
            </div>
          </div>

          {/* 4. CAMPOS AUTOMÁTICOS DO SISTEMA (REGRA 3): 41 - PROFISSIONAL SOLICITANTE & 42 - DATA DA SOLICITAÇÃO */}
          <div className="sm:col-span-12 bg-slate-50 border border-slate-200 rounded-xl p-3 grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-6">
              <label className={labelClass}>
                41 - Nome do Profissional Solicitante <span className="text-emerald-700">(Auto - Login)</span>
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
                42 - Data da Solicitação <span className="text-emerald-700">(Auto - Hoje)</span>
              </label>
              <input
                type="date"
                value={data.dataSolicitacao}
                onChange={e => updateField('dataSolicitacao', e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="sm:col-span-3">
              <label className={labelClass}>45 - Carimbo / CRM</label>
              <input
                type="text"
                value={data.registroConselhoSolicitante}
                onChange={e => updateField('registroConselhoSolicitante', e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Botão para expandir/recolher todos os 55 campos opcionais do formulário */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => setShowAllFields(prev => !prev)}
          className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 shadow-2xs flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          {showAllFields ? (
            <>
              <ChevronUp className="w-4 h-4 text-blue-600" />
              <span>Ocultar campos complementares (Mostrando todos os 55 campos da APAC)</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 text-blue-600" />
              <span>Editar demais campos do formulário APAC (Campos 1 a 55 completos — Opcional)</span>
            </>
          )}
        </button>
      </div>

      {showAllFields && (
        <div className="space-y-5">
          {/* 1. ESTABELECIMENTO SOLICITANTE (Campos 1 e 2) */}
          <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200/90 space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                Identificação do Estabelecimento de Saúde (Solicitante) — Campos 1 e 2
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-8">
                <label className={labelClass}>1 - Nome do Estabelecimento de Saúde Solicitante</label>
                <input
                  type="text"
                  value={data.estabelecimentoSolicitante}
                  onChange={e => updateField('estabelecimentoSolicitante', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="sm:col-span-4">
                <label className={labelClass}>2 - CNES (7 dígitos)</label>
                <input
                  type="text"
                  maxLength={7}
                  value={data.cnesSolicitante}
                  onChange={e => updateField('cnesSolicitante', e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* 2. DEMAIS DADOS DO PACIENTE (Campos 4 a 17) */}
          <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200/90 space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <User className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                Identificação Complementar do Paciente — Campos 4 a 17
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-6">
                <label className={labelClass}>6 - Cartão Nacional de Saúde (CNS - 15 dígitos)</label>
                <input
                  type="text"
                  maxLength={15}
                  value={data.cpfOuCns}
                  onChange={e => updateField('cpfOuCns', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="sm:col-span-3">
                <label className={labelClass}>7 - Data de Nascimento</label>
                <input
                  type="date"
                  value={data.dataNascimento}
                  onChange={e => updateField('dataNascimento', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="sm:col-span-3">
                <label className={labelClass}>4 - Sexo</label>
                <select
                  value={data.sexo}
                  onChange={e => updateField('sexo', e.target.value as ApacData['sexo'])}
                  className={inputClass}
                >
                  <option value="Masc.">Masculino</option>
                  <option value="Fem.">Feminino</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <label className={labelClass}>8 - Raça/Cor</label>
                <input
                  type="text"
                  value={data.racaCor}
                  onChange={e => updateField('racaCor', e.target.value)}
                  placeholder="Ex: Parda, Branca..."
                  className={inputClass}
                />
              </div>
              <div className="sm:col-span-3">
                <label className={labelClass}>8.1 - Etnia</label>
                <input
                  type="text"
                  value={data.etnia}
                  onChange={e => updateField('etnia', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="sm:col-span-6">
                <label className={labelClass}>9 - Nome da Mãe</label>
                <input
                  type="text"
                  value={data.nomeMae}
                  onChange={e => updateField('nomeMae', e.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-4">
                <label className={labelClass}>10 - Telefone de Contato (DDD + Nº)</label>
                <input
                  type="text"
                  value={data.telefoneCelular}
                  onChange={e => updateField('telefoneCelular', e.target.value)}
                  placeholder="(91) 98888-0000"
                  className={inputClass}
                />
              </div>
              <div className="sm:col-span-5">
                <label className={labelClass}>11 - Nome do Responsável</label>
                <input
                  type="text"
                  value={data.nomeResponsavel}
                  onChange={e => updateField('nomeResponsavel', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="sm:col-span-3">
                <label className={labelClass}>12 - Tel. Responsável</label>
                <input
                  type="text"
                  value={data.telefoneContato}
                  onChange={e => updateField('telefoneContato', e.target.value)}
                  placeholder="(91) 98888-0000"
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-12">
                <label className={labelClass}>13 - Endereço (Rua, Nº, Bairro)</label>
                <input
                  type="text"
                  value={data.endereco}
                  onChange={e => updateField('endereco', e.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-5">
                <label className={labelClass}>14 - Município de Residência</label>
                <input
                  type="text"
                  value={data.municipioResidencia}
                  onChange={e => updateField('municipioResidencia', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="sm:col-span-3">
                <label className={labelClass}>15 - Cód. IBGE Município</label>
                <input
                  type="text"
                  value={data.codIbgeMunicipio}
                  onChange={e => updateField('codIbgeMunicipio', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="sm:col-span-1">
                <label className={labelClass}>16 - UF</label>
                <input
                  type="text"
                  maxLength={2}
                  value={data.uf}
                  onChange={e => updateField('uf', e.target.value.toUpperCase())}
                  className={inputClass}
                />
              </div>
              <div className="sm:col-span-3">
                <label className={labelClass}>17 - CEP</label>
                <input
                  type="text"
                  value={data.cep}
                  onChange={e => updateField('cep', e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* 3. PROCEDIMENTOS SECUNDÁRIOS (Campos 21 a 35 — até 5 linhas) */}
          <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200/90 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                  Procedimento(s) Secundário(s) — Campos 21 a 35 (Até 5 linhas)
                </h3>
              </div>
              <button
                type="button"
                onClick={addSecundario}
                disabled={data.procedimentosSecundarios.length >= 5}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200 transition-all cursor-pointer disabled:opacity-40"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar Secundário</span>
              </button>
            </div>

            {data.procedimentosSecundarios.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-1">
                Nenhum procedimento secundário adicionado.
              </p>
            ) : (
              <div className="space-y-2">
                {data.procedimentosSecundarios.slice(0, 5).map((item, idx) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center bg-slate-50 p-2 rounded-xl border border-slate-200"
                  >
                    <div className="sm:col-span-3">
                      <input
                        type="text"
                        value={item.codigo}
                        onChange={e => updateSecundario(item.id, 'codigo', e.target.value)}
                        placeholder={`Código (${idx + 1})`}
                        className={inputClass}
                      />
                    </div>
                    <div className="sm:col-span-6">
                      <input
                        type="text"
                        value={item.nome}
                        onChange={e => updateSecundario(item.id, 'nome', e.target.value)}
                        placeholder="Nome do Procedimento Secundário"
                        className={inputClass}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        value={item.quantidade}
                        onChange={e => updateSecundario(item.id, 'quantidade', e.target.value)}
                        placeholder="Qtde"
                        className={inputClass}
                      />
                    </div>
                    <div className="sm:col-span-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeSecundario(item.id)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 4. JUSTIFICATIVA COMPLEMENTAR E SOLICITAÇÃO / AUTORIZAÇÃO (Campos 38 a 55) */}
          <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200/90 space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <FileCheck className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                Justificativa Complementar, Solicitação, Autorização e Executante — Campos 38 a 55
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-6">
                <label className={labelClass}>38 - CID-10 Secundário</label>
                <input
                  type="text"
                  value={data.cid10Secundario}
                  onChange={e => updateField('cid10Secundario', e.target.value.toUpperCase())}
                  className={inputClass}
                />
              </div>
              <div className="sm:col-span-6">
                <label className={labelClass}>39 - CID-10 Causas Associadas</label>
                <input
                  type="text"
                  value={data.cid10CausasAssociadas}
                  onChange={e => updateField('cid10CausasAssociadas', e.target.value.toUpperCase())}
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-12">
                <label className={labelClass}>40 - Observações / Justificativa Clínica</label>
                <textarea
                  rows={3}
                  value={data.observacoes}
                  onChange={e => updateField('observacoes', e.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-4">
                <label className={labelClass}>43 - Tipo Doc. Solicitante</label>
                <select
                  value={data.tipoDocumentoSolicitante || doctor.documentType || 'CPF'}
                  onChange={e => {
                    const newType = e.target.value as 'CNS' | 'CPF';
                    updateField('tipoDocumentoSolicitante', newType);
                    const defaultVal = newType === 'CNS' ? (doctor.cns || '') : (doctor.cpf ? doctor.cpf.replace(/\D/g, '') : '');
                    if (defaultVal) {
                      updateField('cnsProfissionalSolicitante', defaultVal);
                    }
                  }}
                  className={inputClass}
                >
                  <option value="CPF">CPF</option>
                  <option value="CNS">CNS (Cartão SUS)</option>
                </select>
              </div>
              <div className="sm:col-span-8">
                <div className="flex items-center justify-between mb-0.5">
                  <label className={labelClass}>
                    44 - Nº Documento ({data.tipoDocumentoSolicitante || doctor.documentType || 'CPF'}) do Profissional Solicitante
                  </label>
                  <span className="text-[10px] text-blue-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Fixo no seu login
                  </span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={15}
                    value={data.cnsProfissionalSolicitante}
                    onChange={e => {
                      const val = e.target.value.replace(/\D/g, '');
                      updateField('cnsProfissionalSolicitante', val);
                    }}
                    placeholder={data.tipoDocumentoSolicitante === 'CNS' ? 'CNS com 15 dígitos' : 'CPF com 11 dígitos'}
                    className={`${inputClass} font-mono`}
                  />
                  <button
                    type="button"
                    onClick={handleFixDoctorDocument}
                    title="Fixar este documento na sua conta de médico para não precisar preencher novamente"
                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-300 text-xs font-bold rounded-lg shrink-0 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5 text-blue-700" />
                    Fixar no Login
                  </button>
                </div>
                {docSavedFeedback && (
                  <p className="text-[11px] text-emerald-700 font-bold mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Documento ({data.tipoDocumentoSolicitante}) fixado com sucesso no perfil do médico!
                  </p>
                )}
              </div>

              {/* 45 - Assinatura e Carimbo (Fica em branco para carimbo e assinatura física) */}
              <div className="sm:col-span-12 p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs text-slate-600">
                <span className="font-semibold flex items-center gap-2">
                  <span className="px-1.5 py-0.5 bg-slate-200 text-slate-800 font-mono text-[10px] rounded font-bold">45</span>
                  <span>Assinatura e Carimbo do Profissional Solicitante</span>
                </span>
                <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Fica em branco no documento (para carimbo e assinatura física manual)
                </span>
              </div>

              <div className="sm:col-span-5">
                <label className={labelClass}>46 - Nome do Profissional Autorizador</label>
                <input
                  type="text"
                  value={data.nomeProfissionalAutorizador}
                  onChange={e => updateField('nomeProfissionalAutorizador', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="sm:col-span-3">
                <label className={labelClass}>47 - Cód. Órgão Emissor</label>
                <input
                  type="text"
                  value={data.codOrgaoEmissor}
                  onChange={e => updateField('codOrgaoEmissor', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="sm:col-span-4">
                <label className={labelClass}>52 - Nº da Autorização (APAC)</label>
                <input
                  type="text"
                  value={data.numeroAutorizacaoApac}
                  onChange={e => updateField('numeroAutorizacaoApac', e.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-4">
                <label className={labelClass}>50 - Data da Autorização</label>
                <input
                  type="date"
                  value={data.dataAutorizacao}
                  onChange={e => updateField('dataAutorizacao', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="sm:col-span-4">
                <label className={labelClass}>53 - Validade Início</label>
                <input
                  type="date"
                  value={data.periodoValidadeInicio}
                  onChange={e => updateField('periodoValidadeInicio', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="sm:col-span-4">
                <label className={labelClass}>53 - Validade Fim</label>
                <input
                  type="date"
                  value={data.periodoValidadeFim}
                  onChange={e => updateField('periodoValidadeFim', e.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-8">
                <label className={labelClass}>
                  54 - Nome Fantasia do Estabelecimento de Saúde Executante
                </label>
                <input
                  type="text"
                  value={data.nomeFantasiaExecutante}
                  onChange={e => updateField('nomeFantasiaExecutante', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="sm:col-span-4">
                <label className={labelClass}>55 - CNES Executante</label>
                <input
                  type="text"
                  maxLength={7}
                  value={data.cnesExecutante}
                  onChange={e => updateField('cnesExecutante', e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
