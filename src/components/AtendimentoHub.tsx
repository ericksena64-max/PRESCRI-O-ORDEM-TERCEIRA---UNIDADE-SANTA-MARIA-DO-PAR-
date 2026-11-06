import React, { useState } from 'react';
import {
  Pill,
  FileText,
  Clock,
  Edit3,
  Eye,
  Stethoscope,
  UserPlus,
  RotateCcw
} from 'lucide-react';
import {
  DoctorProfile,
  PatientInfo,
  PrescriptionItem,
  PrescriptionType,
  AtestadoData,
  DeclaracaoData
} from '../types';
import { PrescriptionForm } from './PrescriptionForm';
import { AtestadoForm } from './AtestadoForm';
import { DeclaracaoForm } from './DeclaracaoForm';
import { DocumentPreviewA4 } from './DocumentPreviewA4';
import { formatDatePtBr } from '../utils/documentLogic';

export type AtendimentoSubTab = 'receita' | 'atestado' | 'declaracao';

interface AtendimentoHubProps {
  doctor: DoctorProfile;
  patient: PatientInfo;
  setPatient: (patient: PatientInfo | ((prev: PatientInfo) => PatientInfo)) => void;
  prescriptionType: PrescriptionType;
  setPrescriptionType: React.Dispatch<React.SetStateAction<PrescriptionType>>;
  prescriptionItems: PrescriptionItem[];
  setPrescriptionItems: React.Dispatch<React.SetStateAction<PrescriptionItem[]>>;
  generalRecommendations: string;
  setGeneralRecommendations: React.Dispatch<React.SetStateAction<string>>;
  prescriptionDate: string;
  setPrescriptionDate: React.Dispatch<React.SetStateAction<string>>;
  prescriptionCid: { code: string; description: string } | undefined;
  setDiagnosticCid: React.Dispatch<React.SetStateAction<{ code: string; description: string } | undefined>>;
  atestado: AtestadoData;
  setAtestado: React.Dispatch<React.SetStateAction<AtestadoData>>;
  declaracao: DeclaracaoData;
  setDeclaracao: React.Dispatch<React.SetStateAction<DeclaracaoData>>;
  subTab: AtendimentoSubTab;
  setSubTab: (tab: AtendimentoSubTab) => void;
  onSaveToHistory: (summary: string) => void;
  onNewPatient?: () => void;
}

export const AtendimentoHub: React.FC<AtendimentoHubProps> = ({
  doctor,
  patient,
  setPatient,
  prescriptionType,
  setPrescriptionType,
  prescriptionItems,
  setPrescriptionItems,
  generalRecommendations,
  setGeneralRecommendations,
  prescriptionDate,
  setPrescriptionDate,
  prescriptionCid,
  setDiagnosticCid,
  atestado,
  setAtestado,
  declaracao,
  setDeclaracao,
  subTab,
  setSubTab,
  onSaveToHistory,
  onNewPatient
}) => {
  const [mobileView, setMobileView] = useState<'form' | 'preview'>('form');
  const [isEditingPatientBanner, setIsEditingPatientBanner] = useState(false);

  // Configuração das sub-abas do atendimento clínico
  const subTabsConfig: {
    id: AtendimentoSubTab;
    label: string;
    sublabel: string;
    icon: React.ElementType;
    badge: string;
    badgeColor: string;
  }[] = [
    {
      id: 'receita',
      label: 'Receituário Médico',
      sublabel: 'Simples • Controle Especial • Antimicrobianos',
      icon: Pill,
      badge: `${prescriptionItems.length} ${prescriptionItems.length === 1 ? 'item' : 'itens'}`,
      badgeColor: 'bg-blue-100 text-blue-900 border-blue-200'
    },
    {
      id: 'atestado',
      label: 'Atestado Médico',
      sublabel: 'Repouso • Acompanhamento • Dias por extenso',
      icon: FileText,
      badge: `${atestado.days} ${atestado.days === 1 ? 'dia' : 'dias'}`,
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-200'
    },
    {
      id: 'declaracao',
      label: 'Declaração de Comparecimento',
      sublabel: 'Horário de Entrada e Saída • Período Integral',
      icon: Clock,
      badge: declaracao.isAllDay ? 'Integral' : `${declaracao.startTime} às ${declaracao.endTime}`,
      badgeColor: 'bg-sky-100 text-sky-900 border-sky-200'
    }
  ];

  return (
    <div className="w-full min-w-0 space-y-4">
      {/* ======================================================== */}
      {/* 1. BANNER UNIFICADO DE IDENTIFICAÇÃO DO PACIENTE          */}
      {/* ======================================================== */}
      <div className="no-print bg-gradient-to-r from-[#002255] via-[#003594] to-[#0044B2] text-white p-4 sm:p-5 rounded-2xl border border-blue-800/80 shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-80 opacity-10 pointer-events-none flex items-center justify-end pr-8">
          <Stethoscope className="w-56 h-56 text-sky-300" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            <div className="h-12 w-12 rounded-xl bg-white/15 border border-white/25 text-white flex items-center justify-center shadow-md shrink-0">
              <Stethoscope className="w-6 h-6 text-sky-300" strokeWidth={2.25} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider bg-sky-400/20 text-sky-200 px-2 py-0.5 rounded-full border border-sky-300/30">
                  Consulta & Ambulatório
                </span>
                <span className="text-xs text-blue-100 font-medium">
                  Atendimento em: <strong className="text-white">{formatDatePtBr(prescriptionDate)}</strong>
                </span>
                {prescriptionType !== 'simples' && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-200 border border-amber-400/30">
                    {prescriptionType === 'controle_especial' ? 'Controle Especial (Portaria 344/98)' : 'Antimicrobianos (RDC 20/2011)'}
                  </span>
                )}
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
                {patient.document && <span>CPF/Doc: <strong className="text-white">{patient.document}</strong></span>}
                {patient.cns && <span>CNS: <strong className="text-white">{patient.cns}</strong></span>}
                {patient.weight && <span>Peso: <strong className="text-white">{patient.weight} kg</strong></span>}
                {prescriptionCid && (
                  <span className="bg-blue-950/60 border border-blue-400/30 px-2 py-0.5 rounded-md text-sky-200">
                    CID-10: <strong className="text-white">{prescriptionCid.code} ({prescriptionCid.description})</strong>
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
                title="Limpar todos os dados do paciente atual e iniciar um novo atendimento"
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
              <span>{isEditingPatientBanner ? 'Fechar Edição' : 'Editar Dados do Paciente'}</span>
            </button>
          </div>
        </div>

        {/* Gaveta de Edição Completa dos Dados do Paciente */}
        {isEditingPatientBanner && (
          <div className="mt-4 pt-4 border-t border-white/15 text-slate-900 bg-white p-4 rounded-xl shadow-inner animate-in fade-in duration-150 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Cadastro Rápido — Dados Sincronizados em Todas as Abas
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
              <div className="sm:col-span-6">
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
              <label className="block text-xs font-bold text-slate-700 mb-1">Documento (CPF / RG)</label>
              <input
                type="text"
                value={patient.document}
                onChange={e => setPatient({ ...patient, document: e.target.value })}
                placeholder="000.000.000-00"
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
            <div className="sm:col-span-3">
              <label className="block text-xs font-bold text-slate-700 mb-1">Idade</label>
              <input
                type="text"
                value={patient.age || ''}
                onChange={e => setPatient({ ...patient, age: e.target.value })}
                placeholder="Ex: 35 anos"
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-medium"
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
                placeholder="Ex: 65"
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
              />
            </div>
            <div className="sm:col-span-4">
              <label className="block text-xs font-bold text-slate-700 mb-1">Endereço Residencial</label>
              <input
                type="text"
                value={patient.address || ''}
                onChange={e => setPatient({ ...patient, address: e.target.value })}
                placeholder="Rua, número, bairro - Cidade/UF"
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
              />
            </div>
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 2. SUB-MENU DE ATENDIMENTO: RECEITA • ATESTADO • DECLARAÇÃO */}
      {/* ======================================================== */}
      <div className="no-print bg-white p-2 sm:p-2.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
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
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <span className={`p-2 rounded-lg shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-white text-[#0038A8] border border-slate-200 shadow-2xs group-hover:bg-blue-50'
                  }`}>
                    <Icon className="w-4 h-4" strokeWidth={2.25} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1.5">
                      <h3 className="text-xs sm:text-[13px] font-black truncate leading-tight">
                        {tab.label}
                      </h3>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 border ${
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
      {/* 3. CONTEÚDO ATIVO DO SUB-MÓDULO: 2 COLUNAS (FORM + PREVIEW) */}
      {/* ======================================================== */}
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
              <span>Editar</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileView('preview')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 ${
                mobileView === 'preview' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Ver A4</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Coluna Esquerda: Formulário Ativo */}
          <div className={`lg:col-span-6 space-y-6 ${mobileView === 'preview' ? 'hidden lg:block' : 'block'}`}>
            {subTab === 'receita' && (
              <PrescriptionForm
                prescriptionType={prescriptionType}
                setPrescriptionType={setPrescriptionType}
                patient={patient}
                setPatient={setPatient}
                items={prescriptionItems}
                setItems={setPrescriptionItems}
                generalRecommendations={generalRecommendations}
                setGeneralRecommendations={setGeneralRecommendations}
                date={prescriptionDate}
                setDate={setPrescriptionDate}
                diagnosticCid={prescriptionCid}
                setDiagnosticCid={setDiagnosticCid}
                onNewPatient={onNewPatient}
              />
            )}

            {subTab === 'atestado' && (
              <AtestadoForm
                atestado={atestado}
                setAtestado={setAtestado}
                patient={patient}
                onUpdatePatient={setPatient}
                onNewPatient={onNewPatient}
              />
            )}

            {subTab === 'declaracao' && (
              <DeclaracaoForm
                declaracao={declaracao}
                setDeclaracao={setDeclaracao}
                patient={patient}
                onUpdatePatient={setPatient}
                onNewPatient={onNewPatient}
              />
            )}
          </div>

          {/* Coluna Direita: Live Realistic A4 Preview */}
          <div className={`lg:col-span-6 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto print:static print:max-h-none print:overflow-visible ${
            mobileView === 'form' ? 'hidden lg:block' : 'block'
          }`}>
            <DocumentPreviewA4
              mode={subTab === 'receita' ? 'prescricao' : subTab}
              doctor={doctor}
              patient={patient}
              prescriptionType={prescriptionType}
              items={prescriptionItems}
              generalRecommendations={generalRecommendations}
              prescriptionDate={prescriptionDate}
              diagnosticCid={prescriptionCid}
              atestado={atestado}
              declaracao={declaracao}
              inpatient={{} as any}
              inpatientItems={[]}
              onSaveToHistory={onSaveToHistory}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
