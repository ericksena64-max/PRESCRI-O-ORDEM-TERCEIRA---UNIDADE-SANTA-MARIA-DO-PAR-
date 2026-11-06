import React, { useState } from 'react';
import {
  BedDouble,
  FlaskConical,
  FileSpreadsheet,
  ClipboardCheck,
  Eye,
  Edit3,
  Stethoscope,
  UserPlus,
  RotateCcw,
  FileCheck
} from 'lucide-react';
import {
  DoctorProfile,
  PatientInfo,
  InpatientInfo,
  InpatientItem,
  AihData,
  ApacData
} from '../types';
import { InpatientPrescriptionForm } from './InpatientPrescriptionForm';
import { ExamesLaboratoriaisView } from './ExamesLaboratoriaisView';
import { AihForm } from './AihForm';
import { ApacForm } from './ApacForm';
import { DocumentPreviewA4 } from './DocumentPreviewA4';
import { ProntuarioEnfermariaHub } from './ProntuarioEnfermariaHub';
import { SumarioAltaHospitalar } from './SumarioAltaHospitalar';
import { formatDatePtBr } from '../utils/documentLogic';

export type InpatientSubTab = 'admissao' | 'prescricao' | 'exames' | 'aih' | 'apac' | 'alta';

interface InternacaoHubProps {
  doctor: DoctorProfile;
  patient: PatientInfo;
  setPatient: (patient: PatientInfo | ((prev: PatientInfo) => PatientInfo)) => void;
  inpatientInfo: InpatientInfo;
  setInpatientInfo: React.Dispatch<React.SetStateAction<InpatientInfo>>;
  inpatientItems: InpatientItem[];
  setInpatientItems: React.Dispatch<React.SetStateAction<InpatientItem[]>>;
  aihData: AihData;
  setAihData: React.Dispatch<React.SetStateAction<AihData>>;
  apacData: ApacData;
  setApacData: React.Dispatch<React.SetStateAction<ApacData>>;
  subTab: InpatientSubTab;
  setSubTab: (tab: InpatientSubTab) => void;
  onSaveToHistory: (summary: string) => void;
  onNewPatient?: () => void;
  onSaveDoctorProfile?: (profile: DoctorProfile) => void;
}

export const InternacaoHub: React.FC<InternacaoHubProps> = ({
  doctor,
  patient,
  setPatient,
  inpatientInfo,
  setInpatientInfo,
  inpatientItems,
  setInpatientItems,
  aihData,
  setAihData,
  apacData,
  setApacData,
  subTab,
  setSubTab,
  onSaveToHistory,
  onNewPatient,
  onSaveDoctorProfile
}) => {
  const [mobileView, setMobileView] = useState<'form' | 'preview'>('form');
  const [isEditingPatientBanner, setIsEditingPatientBanner] = useState(false);

  // Sub-tabs da internação com contadores e metadados
  const subTabsConfig: {
    id: InpatientSubTab;
    label: string;
    sublabel: string;
    icon: React.ElementType;
    badge: string;
    badgeColor: string;
  }[] = [
    {
      id: 'admissao',
      label: 'Admissão & Evolução (SOAP)',
      sublabel: 'Anamnese • Exame Físico • Linha do Tempo',
      icon: Stethoscope,
      badge: 'Prontuário',
      badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-200'
    },
    {
      id: 'prescricao',
      label: 'Prescrição Médica',
      sublabel: 'Enfermaria • Ordem 1 a 7 • Aprazamento A4',
      icon: BedDouble,
      badge: `${inpatientItems.length} ${inpatientItems.length === 1 ? 'item' : 'itens'}`,
      badgeColor: 'bg-blue-100 text-blue-900 border-blue-200'
    },
    {
      id: 'exames',
      label: 'Exames Laboratoriais (SADT)',
      sublabel: 'Catálogo SUS • Combos 1-Clique • Guia A4',
      icon: FlaskConical,
      badge: 'SADT / SIGTAP',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-200'
    },
    {
      id: 'aih',
      label: 'Laudo de AIH (SUS)',
      sublabel: 'Anexo I • Injeção Vetorial Oficial (2 Páginas)',
      icon: FileSpreadsheet,
      badge: aihData.nomePaciente ? 'Preenchida' : 'Pendente',
      badgeColor: aihData.nomePaciente
        ? 'bg-sky-100 text-sky-900 border-sky-200'
        : 'bg-amber-100 text-amber-900 border-amber-200'
    },
    {
      id: 'apac',
      label: 'Laudo de APAC (SUS)',
      sublabel: 'Alta Complexidade • Laudo Oficial SUS',
      icon: ClipboardCheck,
      badge: apacData.nomePaciente ? 'Preenchida' : 'Disponível',
      badgeColor: 'bg-purple-100 text-purple-900 border-purple-200'
    },
    {
      id: 'alta',
      label: 'Sumário de Alta & Receita',
      sublabel: 'Desospitalização • Receita Domiciliar A4',
      icon: FileCheck,
      badge: 'Kit de Alta',
      badgeColor: 'bg-teal-100 text-teal-900 border-teal-200'
    }
  ];

  return (
    <div className="w-full min-w-0 space-y-4">
      {/* ======================================================== */}
      {/* 1. BANNER UNIFICADO DE IDENTIFICAÇÃO DO PACIENTE INTERNADO */}
      {/* ======================================================== */}
      <div className="no-print bg-gradient-to-r from-[#002255] via-[#003594] to-[#0044B2] text-white p-4 sm:p-5 rounded-2xl border border-blue-800/80 shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-80 opacity-10 pointer-events-none flex items-center justify-end pr-8">
          <BedDouble className="w-56 h-56 text-sky-300" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            <div className="h-12 w-12 rounded-xl bg-white/15 border border-white/25 text-white flex items-center justify-center shadow-md shrink-0">
              <BedDouble className="w-6 h-6 text-sky-300" strokeWidth={2.25} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider bg-sky-400/20 text-sky-200 px-2 py-0.5 rounded-full border border-sky-300/30">
                  Enfermaria Hospitalar
                </span>
                <span className="text-xs text-blue-100 font-medium">
                  {inpatientInfo.ward || 'Enfermaria Clínica'} • Leito: <strong className="text-white">{inpatientInfo.bed || 'Não informado'}</strong>
                </span>
                <span className="text-xs text-blue-100 font-medium">
                  • Admissão: <strong className="text-white">{formatDatePtBr(inpatientInfo.admissionDate)}</strong>
                </span>
              </div>

              <div
                onClick={() => setIsEditingPatientBanner(prev => !prev)}
                className="cursor-pointer group flex items-center gap-2 mt-1"
                title="Clique para preencher os dados do paciente"
              >
                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight truncate group-hover:text-sky-200 transition-colors">
                  {patient.name || (
                    <span className="text-sky-200/90 font-semibold italic flex items-center gap-1.5 text-base sm:text-lg">
                      Preencher Dados do Paciente <Edit3 className="w-4 h-4 inline text-sky-300" />
                    </span>
                  )}
                </h2>
              </div>

              <div className="flex items-center gap-3 text-xs text-blue-100/90 mt-1 flex-wrap">
                {patient.age && <span>Idade: <strong className="text-white">{patient.age}</strong></span>}
                {patient.document && <span>Prontuário/CPF: <strong className="text-white">{patient.document}</strong></span>}
                {patient.cns && <span>CNS: <strong className="text-white">{patient.cns}</strong></span>}
                {patient.weight && <span>Peso: <strong className="text-white">{patient.weight} kg</strong></span>}
                {inpatientInfo.diagnosis && (
                  <span className="bg-blue-950/60 border border-blue-400/30 px-2 py-0.5 rounded-md text-sky-200">
                    Diagnóstico: <strong className="text-white">{inpatientInfo.diagnosis}</strong>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Ações do Paciente */}
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            {onNewPatient && (
              <button
                type="button"
                onClick={() => {
                  onNewPatient();
                  setIsEditingPatientBanner(true);
                }}
                title="Limpar todos os dados do paciente atual e iniciar nova admissão/prescrição"
                className="px-3.5 py-2 bg-emerald-500/20 hover:bg-emerald-500/35 text-emerald-100 text-xs font-bold rounded-xl border border-emerald-400/40 transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5 text-emerald-300" />
                <span>Novo Paciente</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsEditingPatientBanner(!isEditingPatientBanner)}
              className="px-3.5 py-2 bg-white/15 hover:bg-white/25 text-white text-xs font-bold rounded-xl border border-white/25 transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-sky-300" />
              <span>{isEditingPatientBanner ? 'Fechar Edição' : 'Editar Dados do Leito / Paciente'}</span>
            </button>
          </div>
        </div>

        {/* Gaveta de Edição Completa dos Dados de Internação e do Paciente */}
        {isEditingPatientBanner && (
          <div className="mt-4 pt-4 border-t border-white/15 text-slate-900 bg-white p-4 rounded-xl shadow-inner animate-in fade-in duration-150 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Cadastro Rápido Hospitalar — Sincronizado em Todas as Abas
              </span>
              {onNewPatient && (
                <button
                  type="button"
                  onClick={onNewPatient}
                  className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Limpar / Novo Paciente</span>
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-5">
              <label className="block text-xs font-bold text-slate-700 mb-1">Nome Completo do Paciente *</label>
              <input
                type="text"
                value={patient.name}
                onChange={e => setPatient({ ...patient, name: e.target.value })}
                placeholder="Ex: Nome Completo do Paciente"
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-bold"
              />
            </div>
            <div className="sm:col-span-3">
              <label className="block text-xs font-bold text-slate-700 mb-1">Prontuário / CPF</label>
              <input
                type="text"
                value={patient.document}
                onChange={e => setPatient({ ...patient, document: e.target.value })}
                placeholder="Ex: 000.000.000-00 ou 123456"
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-bold"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Leito</label>
              <input
                type="text"
                value={inpatientInfo.bed}
                onChange={e => {
                  const val = e.target.value;
                  setInpatientInfo({ ...inpatientInfo, bed: val });
                  setPatient({ ...patient, bed: val });
                }}
                placeholder="Ex: 05-B"
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-bold"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Enfermaria</label>
              <input
                type="text"
                value={inpatientInfo.ward}
                onChange={e => {
                  const val = e.target.value;
                  setInpatientInfo({ ...inpatientInfo, ward: val });
                  setPatient({ ...patient, ward: val });
                }}
                placeholder="Ex: Enfermaria Clínica"
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-bold"
              />
            </div>
            <div className="sm:col-span-3">
              <label className="block text-xs font-bold text-slate-700 mb-1">Cartão SUS (CNS)</label>
              <input
                type="text"
                value={patient.cns || ''}
                onChange={e => setPatient({ ...patient, cns: e.target.value })}
                placeholder="700000000000000 (15 dígitos)"
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
              />
            </div>
            <div className="sm:col-span-3">
              <label className="block text-xs font-bold text-slate-700 mb-1">Data de Nascimento</label>
              <input
                type="date"
                value={patient.birthDate || ''}
                onChange={e => setPatient({ ...patient, birthDate: e.target.value })}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Idade</label>
              <input
                type="text"
                value={patient.age || ''}
                onChange={e => setPatient({ ...patient, age: e.target.value })}
                placeholder="Ex: 45 anos"
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Peso (kg)</label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={patient.weight || ''}
                onChange={e => setPatient({ ...patient, weight: parseFloat(e.target.value) || '' })}
                placeholder="Ex: 70"
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Data Admissão</label>
              <input
                type="date"
                value={inpatientInfo.admissionDate}
                onChange={e => setInpatientInfo({ ...inpatientInfo, admissionDate: e.target.value })}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-bold"
              />
            </div>
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 2. SUB-MENU HOSPITALAR: 6 MÓDULOS DE INTERNAÇÃO           */}
      {/* ======================================================== */}
      <div className="no-print bg-white p-2 sm:p-2.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {subTabsConfig.map(tab => {
            const Icon = tab.icon;
            const isSelected = subTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSubTab(tab.id)}
                className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all duration-200 flex items-center justify-between gap-2 group relative overflow-hidden ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#0038A8] to-[#0B4EA2] text-white border-[#0038A8] shadow-md shadow-blue-900/20'
                    : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className={`p-2 rounded-lg shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-white text-[#0038A8] border border-slate-200 shadow-2xs group-hover:bg-blue-50'
                  }`}>
                    <Icon className="w-4 h-4" strokeWidth={2.25} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="text-xs sm:text-[13px] font-black truncate leading-tight">
                        {tab.label}
                      </h3>
                      <span className={`text-[9.5px] font-black px-1.5 py-0.5 rounded-full shrink-0 border ${
                        isSelected
                          ? 'bg-white text-[#0038A8] border-transparent shadow-2xs'
                          : `${tab.badgeColor}`
                      }`}>
                        {tab.badge}
                      </span>
                    </div>
                    <p className={`text-[10px] truncate mt-0.5 leading-tight ${
                      isSelected ? 'text-blue-100' : 'text-slate-500'
                    }`}>
                      {tab.sublabel}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. CONTEÚDO ATIVO DO SUB-MÓDULO SELECIONADO               */}
      {/* ======================================================== */}
      <div>
        {/* SUB-MÓDULO 0: ADMISSÃO & EVOLUÇÃO MÉDICA DIÁRIA (SOAP) */}
        {subTab === 'admissao' && (
          <ProntuarioEnfermariaHub
            doctor={doctor}
            patient={patient}
            setPatient={setPatient}
            inpatientInfo={inpatientInfo}
            inpatientItems={inpatientItems}
            aihData={aihData}
            onSaveToHistory={onSaveToHistory}
            onNewPatient={onNewPatient}
          />
        )}

        {/* SUB-MÓDULO 1: PRESCRIÇÃO MÉDICA DE ENFERMARIA */}
        {subTab === 'prescricao' && (
          <div className="space-y-4">
            {/* Mobile View Toggle */}
            <div className="no-print lg:hidden flex items-center justify-center">
              <div className="bg-white p-1 rounded-xl shadow-xs border border-slate-200 flex gap-1 w-full max-w-xs">
                <button
                  type="button"
                  onClick={() => setMobileView('form')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 ${
                    mobileView === 'form' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Prescrição</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMobileView('preview')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 ${
                    mobileView === 'preview' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Ver A4 (Paisagem)</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
              {/* Coluna Esquerda: Formulário de Prescrição */}
              <div className={`xl:col-span-5 space-y-4 ${mobileView === 'preview' ? 'hidden lg:block' : 'block'}`}>
                <InpatientPrescriptionForm
                  patient={patient}
                  setPatient={setPatient}
                  info={inpatientInfo}
                  setInfo={setInpatientInfo}
                  items={inpatientItems}
                  setItems={setInpatientItems}
                  onNewPatient={onNewPatient}
                />
              </div>

              {/* Coluna Direita: Live Realistic A4 Preview (Landscape) */}
              <div className={`xl:col-span-7 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto print:static print:max-h-none print:overflow-visible ${
                mobileView === 'form' ? 'hidden lg:block' : 'block'
              }`}>
                <DocumentPreviewA4
                  mode="internacao"
                  doctor={doctor}
                  patient={patient}
                  prescriptionType="simples"
                  items={[]}
                  generalRecommendations=""
                  prescriptionDate={inpatientInfo.prescriptionDate}
                  diagnosticCid={inpatientInfo.cid}
                  atestado={{} as any}
                  declaracao={{} as any}
                  inpatient={inpatientInfo}
                  inpatientItems={inpatientItems}
                  aih={aihData}
                  apac={apacData}
                  onSaveToHistory={onSaveToHistory}
                />
              </div>
            </div>
          </div>
        )}

        {/* SUB-MÓDULO 2: EXAMES LABORATORIAIS (SADT) */}
        {subTab === 'exames' && (
          <ExamesLaboratoriaisView
            doctor={doctor}
            patient={patient}
            setPatient={setPatient}
            aihData={aihData}
            setAihData={setAihData}
            apacData={apacData}
            setApacData={setApacData}
            onSaveToHistory={onSaveToHistory}
          />
        )}

        {/* SUB-MÓDULO 3: LAUDO DE AIH (SUS - ANEXO I) */}
        {subTab === 'aih' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
              {/* Coluna Esquerda: Formulário da AIH */}
              <div className="xl:col-span-5">
                <AihForm
                  data={aihData}
                  onChange={setAihData}
                  doctor={doctor}
                  patient={patient}
                  inpatientInfo={inpatientInfo}
                  onUpdatePatient={setPatient}
                />
              </div>

              {/* Coluna Direita: Live Preview da AIH com injeção vetorial */}
              <div className="xl:col-span-7 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto print:static print:max-h-none print:overflow-visible">
                <DocumentPreviewA4
                  mode="aih"
                  doctor={doctor}
                  patient={patient}
                  prescriptionType="simples"
                  items={[]}
                  generalRecommendations=""
                  prescriptionDate={aihData.dataSolicitacao}
                  diagnosticCid={undefined}
                  atestado={{} as any}
                  declaracao={{} as any}
                  inpatient={inpatientInfo}
                  inpatientItems={inpatientItems}
                  aih={aihData}
                  apac={apacData}
                  onSaveToHistory={onSaveToHistory}
                />
              </div>
            </div>
          </div>
        )}

        {/* SUB-MÓDULO 4: LAUDO DE APAC (SUS) */}
        {subTab === 'apac' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
              {/* Coluna Esquerda: Formulário APAC */}
              <div className="xl:col-span-5">
                <ApacForm
                  data={apacData}
                  onChange={setApacData}
                  doctor={doctor}
                  patient={patient}
                  onUpdatePatient={setPatient}
                  onSaveDoctorProfile={onSaveDoctorProfile}
                />
              </div>

              {/* Coluna Direita: Live Preview APAC */}
              <div className="xl:col-span-7 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto print:static print:max-h-none print:overflow-visible">
                <DocumentPreviewA4
                  mode="apac"
                  doctor={doctor}
                  patient={patient}
                  prescriptionType="simples"
                  items={[]}
                  generalRecommendations=""
                  prescriptionDate={apacData.dataSolicitacao}
                  diagnosticCid={undefined}
                  atestado={{} as any}
                  declaracao={{} as any}
                  inpatient={inpatientInfo}
                  inpatientItems={inpatientItems}
                  aih={aihData}
                  apac={apacData}
                  onSaveToHistory={onSaveToHistory}
                />
              </div>
            </div>
          </div>
        )}
        {/* SUB-MÓDULO 5: SUMÁRIO DE ALTA HOSPITALAR & RECEITUÁRIO DOMICILIAR */}
        {subTab === 'alta' && (
          <SumarioAltaHospitalar
            doctor={doctor}
            patient={patient}
            inpatientInfo={inpatientInfo}
            inpatientItems={inpatientItems}
            aihData={aihData}
          />
        )}
      </div>
    </div>
  );
};
