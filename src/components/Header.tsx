import React from 'react';
import {
  Settings,
  Printer,
  Download,
  History,
  UserCheck,
  BedDouble,
  Stethoscope,
  Cloud
} from 'lucide-react';
import { DoctorProfile } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

export type ActiveTab = 'atendimento' | 'internacao' | 'configuracoes' | 'prescricao' | 'atestado' | 'declaracao';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  doctor: DoctorProfile;
  onOpenSettings: () => void;
  onOpenDoctorEntry?: () => void;
  onOpenHistory: () => void;
  onOpenGoogleDrive?: () => void;
  onPrint: () => void;
  onDownloadPdf: () => void;
  isDownloadingPdf?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  doctor,
  onOpenSettings,
  onOpenDoctorEntry,
  onOpenHistory,
  onOpenGoogleDrive,
  onPrint,
  onDownloadPdf,
  isDownloadingPdf
}) => {
  const isAtendimentoActive =
    activeTab === 'atendimento' ||
    activeTab === 'prescricao' ||
    activeTab === 'atestado' ||
    activeTab === 'declaracao';

  return (
    <header className="no-print w-full overflow-hidden bg-gradient-to-r from-[#002766] via-[#0038A8] to-[#0B4EA2] text-white border-b border-blue-900/60 sticky top-0 z-30 shadow-lg">
      <div className="w-full max-w-[1720px] mx-auto px-3 sm:px-4 lg:px-6">
        {/* ROW 1: Brand + (Desktop Navigation) + Quick Actions */}
        <div className="flex items-center justify-between min-h-15 py-2 gap-2 lg:gap-3">
          {/* Official Ordem Terceira Logo & Brand */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-2xl bg-white p-1 flex items-center justify-center shadow-md shadow-black/20 overflow-hidden shrink-0 ring-2 ring-white/60">
              <img
                src="/assets/logo_hospital_white.png"
                alt="Logotipo Hospital da Ordem Terceira Santa Maria"
                className="h-full w-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/brand/hospital_white_santa_maria.png';
                }}
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-extrabold text-sm sm:text-base text-white tracking-tight whitespace-nowrap">
                  Hospital <span className="text-sky-300">Ordem Terceira</span>
                </span>
                <span className="bg-white/15 text-sky-200 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-white/20 hidden sm:inline-block lg:hidden xl:inline-block whitespace-nowrap">
                  Santa Maria do Pará
                </span>
              </div>
              <button
                type="button"
                onClick={onOpenDoctorEntry || onOpenSettings}
                title="Bloquear acesso ou trocar de médico prescritor (exige senha)"
                className="text-[11px] sm:text-xs text-blue-100 hover:text-white flex items-center gap-1 truncate max-w-[180px] sm:max-w-[260px] lg:max-w-[220px] xl:max-w-[320px] font-medium transition-colors group"
              >
                <UserCheck className="w-3.5 h-3.5 text-sky-300 shrink-0" strokeWidth={2.25} />
                <span className="truncate">{doctor.fullName} • CRM/{doctor.uf} {doctor.crm}</span>
                <span className="text-[10px] text-sky-300 group-hover:text-white underline ml-0.5 shrink-0">
                  (Sair/Trocar)
                </span>
              </button>
            </div>
          </div>

          {/* Desktop Navigation Tabs (lg and above) */}
          <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2 shrink-0">
            {/* 1. ATENDIMENTO AO PACIENTE */}
            <button
              type="button"
              onClick={() => setActiveTab('atendimento')}
              className={`group flex items-center gap-2 px-3 xl:px-3.5 py-1.5 rounded-xl text-xs xl:text-sm font-semibold transition-all duration-200 ${
                isAtendimentoActive
                  ? 'bg-white text-[#0038A8] shadow-md shadow-black/20 ring-2 ring-white/80'
                  : 'text-blue-100 hover:text-white hover:bg-white/10'
              }`}
              title="Atendimento Clínico ao Paciente: Receituário Médico, Atestado e Declaração de Comparecimento"
            >
              <span className={`p-1 rounded-lg transition-colors ${
                isAtendimentoActive
                  ? 'bg-blue-50 text-[#0038A8] shadow-2xs'
                  : 'bg-white/10 text-sky-300 group-hover:bg-white/20 group-hover:text-white'
              }`}>
                <Stethoscope className="h-3.5 w-3.5" strokeWidth={2.25} />
              </span>
              <div className="flex flex-col text-left leading-tight">
                <span className="font-bold flex items-center gap-1.5 whitespace-nowrap">
                  <span>Atendimento</span>
                  <span className="hidden xl:inline">ao Paciente</span>
                  <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-wider ${
                    isAtendimentoActive
                      ? 'bg-[#0038A8] text-white'
                      : 'bg-sky-400 text-slate-950'
                  }`}>
                    3 em 1
                  </span>
                </span>
                <span className={`text-[9px] font-medium hidden 2xl:inline whitespace-nowrap ${
                  isAtendimentoActive ? 'text-blue-900 font-semibold' : 'text-blue-200'
                }`}>
                  Receita • Atestado • Declaração
                </span>
              </div>
            </button>

            {/* 2. INTERNAÇÃO HOSPITALAR */}
            <button
              type="button"
              onClick={() => setActiveTab('internacao')}
              className={`group flex items-center gap-2 px-3 xl:px-3.5 py-1.5 rounded-xl text-xs xl:text-sm font-semibold transition-all duration-200 ${
                activeTab === 'internacao'
                  ? 'bg-white text-[#0038A8] shadow-md shadow-black/20 ring-2 ring-white/80'
                  : 'text-blue-100 hover:text-white hover:bg-white/10'
              }`}
              title="Centro de Internação Hospitalar: Admissão, Evolução SOAP, Prescrição, Exames, AIH e APAC"
            >
              <span className={`p-1 rounded-lg transition-colors ${
                activeTab === 'internacao'
                  ? 'bg-blue-50 text-[#0038A8] shadow-2xs'
                  : 'bg-white/10 text-sky-300 group-hover:bg-white/20 group-hover:text-white'
              }`}>
                <BedDouble className="h-3.5 w-3.5" strokeWidth={2.25} />
              </span>
              <div className="flex flex-col text-left leading-tight">
                <span className="font-bold flex items-center gap-1.5 whitespace-nowrap">
                  <span>Internação</span>
                  <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-wider ${
                    activeTab === 'internacao'
                      ? 'bg-[#0038A8] text-white'
                      : 'bg-sky-400 text-slate-950'
                  }`}>
                    5 em 1
                  </span>
                </span>
                <span className={`text-[9px] font-medium hidden 2xl:inline whitespace-nowrap ${
                  activeTab === 'internacao' ? 'text-blue-900 font-semibold' : 'text-blue-200'
                }`}>
                  Admissão • Prescrição • Exames • AIH
                </span>
              </div>
            </button>

            {/* 3. CONFIGURAÇÕES */}
            <button
              type="button"
              onClick={onOpenSettings}
              className={`group flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-xl text-xs xl:text-sm font-medium transition-all duration-200 ${
                activeTab === 'configuracoes'
                  ? 'bg-white/20 text-white font-semibold ring-1 ring-white/40'
                  : 'text-blue-100 hover:text-white hover:bg-white/10'
              }`}
              title="Personalizar Médico e Consultório"
            >
              <span className="p-1 rounded-lg bg-white/10 text-sky-300 group-hover:bg-white/20 group-hover:text-white transition-colors">
                <Settings className="h-3.5 w-3.5" strokeWidth={2.25} />
              </span>
              <span className="hidden 2xl:inline whitespace-nowrap">Consultório & CRM</span>
              <span className="2xl:hidden">Config</span>
            </button>
          </nav>

          {/* Quick Document Actions */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            <PWAInstallButton />

            {/* Botão Sincronizar Google Drive */}
            {onOpenGoogleDrive && (
              <button
                type="button"
                onClick={onOpenGoogleDrive}
                title="Sincronizar com Google Drive do Hospital (Conta Gratuita 15 GB)"
                className="px-2 sm:px-2.5 py-1.5 text-white bg-white/15 hover:bg-white/25 border border-white/25 rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold shadow-2xs shrink-0"
              >
                <Cloud className="h-3.5 w-3.5 text-sky-300" strokeWidth={2.25} />
                <span className="hidden xl:inline">Google Drive</span>
              </button>
            )}

            <button
              type="button"
              onClick={onOpenHistory}
              title="Histórico de Documentos"
              className="px-2 sm:px-2.5 py-1.5 text-white bg-white/15 hover:bg-white/25 rounded-xl transition-all hidden md:flex items-center gap-1 text-xs font-semibold border border-white/20 shadow-2xs shrink-0"
            >
              <History className="h-3.5 w-3.5 text-sky-300" strokeWidth={2.25} />
              <span className="hidden 2xl:inline">Histórico</span>
            </button>

            <button
              type="button"
              onClick={onDownloadPdf}
              disabled={isDownloadingPdf}
              className="px-2.5 sm:px-3 py-1.5 bg-white/15 text-white hover:bg-white/25 border border-white/25 rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1 disabled:opacity-50 shrink-0 whitespace-nowrap"
            >
              <Download className="h-3.5 w-3.5 text-sky-300" strokeWidth={2.25} />
              <span className="hidden sm:inline">{isDownloadingPdf ? 'Gerando...' : 'Baixar PDF'}</span>
              <span className="sm:hidden">PDF</span>
            </button>

            <button
              type="button"
              onClick={onPrint}
              className="px-2.5 sm:px-3.5 py-1.5 bg-gradient-to-r from-sky-400 to-blue-300 hover:from-sky-300 hover:to-blue-200 text-slate-950 font-black rounded-xl text-xs shadow-md transition-all flex items-center gap-1 shrink-0 whitespace-nowrap"
            >
              <Printer className="h-3.5 w-3.5" strokeWidth={2.5} />
              <span className="hidden sm:inline">Imprimir</span>
            </button>
          </div>
        </div>

        {/* ROW 2: Tablet & Mobile Navigation Bar (< lg) — Zero Overflow */}
        <nav className="flex lg:hidden items-center gap-1.5 pt-1.5 pb-2.5 border-t border-white/15">
          <button
            type="button"
            onClick={() => setActiveTab('atendimento')}
            className={`flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              isAtendimentoActive
                ? 'bg-white text-[#0038A8] shadow-sm'
                : 'bg-white/10 text-blue-100 hover:text-white hover:bg-white/15'
            }`}
          >
            <Stethoscope className="h-3.5 w-3.5 shrink-0" strokeWidth={2.25} />
            <span className="truncate">Atendimento</span>
            <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase shrink-0 ${
              isAtendimentoActive ? 'bg-[#0038A8] text-white' : 'bg-sky-400 text-slate-950'
            }`}>
              3 em 1
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('internacao')}
            className={`flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'internacao'
                ? 'bg-white text-[#0038A8] shadow-sm'
                : 'bg-white/10 text-blue-100 hover:text-white hover:bg-white/15'
            }`}
          >
            <BedDouble className="h-3.5 w-3.5 shrink-0" strokeWidth={2.25} />
            <span className="truncate">Internação</span>
            <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase shrink-0 ${
              activeTab === 'internacao' ? 'bg-[#0038A8] text-white' : 'bg-sky-400 text-slate-950'
            }`}>
              5 em 1
            </span>
          </button>

          <button
            type="button"
            onClick={onOpenSettings}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shrink-0 transition-all ${
              activeTab === 'configuracoes'
                ? 'bg-white text-[#0038A8] shadow-sm'
                : 'bg-white/10 text-blue-100 hover:text-white hover:bg-white/15'
            }`}
          >
            <Settings className="h-3.5 w-3.5 shrink-0" strokeWidth={2.25} />
            <span>CRM & Clínica</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
