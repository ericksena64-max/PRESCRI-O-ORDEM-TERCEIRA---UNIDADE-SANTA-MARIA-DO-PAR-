/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import {
  Header,
  ActiveTab
} from './components/Header';
import { InternacaoHub, InpatientSubTab } from './components/InternacaoHub';
import { AtendimentoHub, AtendimentoSubTab } from './components/AtendimentoHub';
import { DoctorSettingsModal } from './components/DoctorSettingsModal';
import { DoctorEntryModal } from './components/DoctorEntryModal';
import { DocumentHistoryModal } from './components/DocumentHistoryModal';
import { GoogleDriveSyncModal } from './components/GoogleDriveSyncModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import {
  DoctorProfile,
  PatientInfo,
  PrescriptionItem,
  PrescriptionType,
  AtestadoData,
  DeclaracaoData,
  DocumentHistoryItem,
  InpatientInfo,
  InpatientItem,
  AihData,
  ApacData
} from './types';
import {
  INITIAL_PATIENT,
  INITIAL_PRESCRIPTION_ITEMS,
  INITIAL_ATESTADO,
  INITIAL_DECLARACAO,
  INITIAL_AIH,
  INITIAL_APAC,
  loadSavedDoctorProfile
} from './data/defaultData';
import {
  buildDefaultFastHugTemplate,
  buildInitialInpatientInfo
} from './data/hospitalMedications';
import {
  getActiveDoctorSession,
  clearActiveDoctorSession
} from './services/doctorAuthService';
import { downloadApacPdf, printApacPdf } from './services/apacPdfService';
import { downloadAihPdf, printAihPdf } from './services/aihPdfService';
import { clearDefaultProntuarioFromStorage } from './data/prontuarioHospitalar';
import { getTodayIso, addDaysIso } from './utils/dateUtils';

export default function App() {
  // Navigation & View Mode
  const [activeTab, setActiveTab] = useState<ActiveTab>('atendimento');
  const [atendimentoSubTab, setAtendimentoSubTab] = useState<AtendimentoSubTab>('receita');
  const [patientSessionKey, setPatientSessionKey] = useState<number>(0);

  // Doctor & Clinic Customization State (loaded from localStorage)
  const [doctor, setDoctor] = useState<DoctorProfile>(() => loadSavedDoctorProfile());

  // Patient Info State
  const [patient, setPatient] = useState<PatientInfo>(INITIAL_PATIENT);

  // Prescription State
  const [prescriptionType, setPrescriptionType] = useState<PrescriptionType>('simples');
  const [prescriptionItems, setPrescriptionItems] = useState<PrescriptionItem[]>(INITIAL_PRESCRIPTION_ITEMS);
  const [generalRecommendations, setGeneralRecommendations] = useState(
    '• Manter repouso relativo nos primeiros 3 dias.\n• Ingerir líquidos em abundância (2 a 3 litros/dia).\n• Retornar ao consultório ou pronto atendimento em caso de febre persistente após 48h.'
  );
  const [prescriptionDate, setPrescriptionDate] = useState<string>(() => getTodayIso());
  const [prescriptionCid, setPrescriptionCid] = useState<{ code: string; description: string } | undefined>(undefined);

  // Atestado State
  const [atestado, setAtestado] = useState<AtestadoData>(INITIAL_ATESTADO);

  // Declaração State
  const [declaracao, setDeclaracao] = useState<DeclaracaoData>(INITIAL_DECLARACAO);

  // Internação (FAST-HUG & Suíte Hospitalar) State
  const [inpatientInfo, setInpatientInfo] = useState<InpatientInfo>(() => buildInitialInpatientInfo());
  const [inpatientItems, setInpatientItems] = useState<InpatientItem[]>(() => buildDefaultFastHugTemplate());
  const [inpatientSubTab, setInpatientSubTab] = useState<InpatientSubTab>('prescricao');

  // Laudo AIH State (Anexo I - Portaria SAS/MS)
  const [aihData, setAihData] = useState<AihData>(INITIAL_AIH);

  // Laudo APAC State (Procedimentos Ambulatoriais de Alta Complexidade / Especializados)
  const [apacData, setApacData] = useState<ApacData>(INITIAL_APAC);

  // Modals & Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return getActiveDoctorSession() !== null;
  });
  const [isDoctorEntryOpen, setIsDoctorEntryOpen] = useState<boolean>(() => {
    return getActiveDoctorSession() === null;
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isGoogleDriveOpen, setIsGoogleDriveOpen] = useState(false);
  const [history, setHistory] = useState<DocumentHistoryItem[]>([]);

  const handleLogoutOrSwitchDoctor = () => {
    clearActiveDoctorSession();
    setIsAuthenticated(false);
    setIsDoctorEntryOpen(true);
  };

  // Sync patient data reactively across all documents and tabs when edited
  const handleUpdatePatient = (newPatient: PatientInfo | ((prev: PatientInfo) => PatientInfo)) => {
    setPatient(prev => {
      const updated = typeof newPatient === 'function' ? newPatient(prev) : newPatient;
      // Sync to atestado & declaracao & internacao & aih & apac
      setAtestado(a => ({
        ...a,
        patientName: updated.name ?? a.patientName,
        patientDoc: updated.document ?? a.patientDoc
      }));
      setDeclaracao(d => ({
        ...d,
        patientName: updated.name ?? d.patientName,
        patientDoc: updated.document ?? d.patientDoc
      }));
      setInpatientInfo(info => ({
        ...info,
        bed: updated.bed !== undefined ? updated.bed : info.bed,
        ward: updated.ward !== undefined ? updated.ward : info.ward
      }));
      setAihData(aih => ({
        ...aih,
        nomePaciente: updated.name ?? aih.nomePaciente,
        numeroProntuario: updated.document || aih.numeroProntuario,
        cnsPaciente: updated.cns || aih.cnsPaciente,
        dataNascimento: updated.birthDate || aih.dataNascimento,
        endereco: updated.address || aih.endereco
      }));
      setApacData(apac => ({
        ...apac,
        nomePaciente: updated.name ?? apac.nomePaciente,
        numeroProntuario: updated.document || apac.numeroProntuario,
        cpfOuCns: updated.cns || updated.document || apac.cpfOuCns,
        dataNascimento: updated.birthDate || apac.dataNascimento,
        endereco: updated.address || apac.endereco
      }));
      return updated;
    });
  };

  // Limpa todos os dados do paciente atual e prepara um novo atendimento em todas as abas
  const handleNewPatient = () => {
    const todayIso = getTodayIso();
    clearDefaultProntuarioFromStorage();
    setPatient({ ...INITIAL_PATIENT });
    setPrescriptionType('simples');
    setPrescriptionItems([]);
    setGeneralRecommendations(
      '• Manter repouso relativo nos primeiros 3 dias.\n• Ingerir líquidos em abundância (2 a 3 litros/dia).\n• Retornar ao consultório ou pronto atendimento em caso de febre persistente após 48h.'
    );
    setPrescriptionDate(todayIso);
    setPrescriptionCid(undefined);
    setAtestado({
      ...INITIAL_ATESTADO,
      patientName: '',
      patientDoc: '',
      startDate: todayIso,
      endDate: addDaysIso(2),
      date: todayIso,
      customText: ''
    });
    setDeclaracao({
      ...INITIAL_DECLARACAO,
      patientName: '',
      patientDoc: '',
      date: todayIso,
      acompanhanteName: '',
      acompanhanteDoc: ''
    });
    setInpatientInfo(buildInitialInpatientInfo());
    setInpatientItems(buildDefaultFastHugTemplate());
    setAihData({
      ...INITIAL_AIH,
      nomePaciente: '',
      numeroProntuario: '',
      cnsPaciente: '',
      dataNascimento: '',
      sexo: '',
      nomeMaeOuResponsavel: '',
      telefoneContato: '',
      endereco: '',
      dataSolicitacao: todayIso
    });
    setApacData({
      ...INITIAL_APAC,
      nomePaciente: '',
      numeroProntuario: '',
      cpfOuCns: '',
      dataNascimento: '',
      sexo: '',
      racaCor: '',
      etnia: '',
      nomeMae: '',
      telefoneCelular: '',
      nomeResponsavel: '',
      telefoneContato: '',
      endereco: '',
      dataSolicitacao: todayIso
    });
    setPatientSessionKey(prev => prev + 1);
  };

  const handleSaveToHistory = (summary: string) => {
    const newItem: DocumentHistoryItem = {
      id: `hist-${Date.now()}`,
      createdAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      type: activeTab === 'internacao'
        ? (inpatientSubTab === 'admissao' ? 'admissao' : inpatientSubTab === 'exames' ? 'exames' : inpatientSubTab === 'aih' ? 'aih' : inpatientSubTab === 'apac' ? 'apac' : 'internacao')
        : (atendimentoSubTab === 'receita' ? 'prescricao' : atendimentoSubTab),
      patientName: patient.name || 'Paciente',
      summary,
      payload: null
    };
    setHistory(prev => [newItem, ...prev.slice(0, 19)]);
  };

  const handlePrint = async () => {
    if (activeTab === 'internacao') {
      if (inpatientSubTab === 'aih') {
        await printAihPdf(aihData, doctor, patient);
        return;
      }
      if (inpatientSubTab === 'apac') {
        await printApacPdf(apacData, doctor, patient);
        return;
      }
      window.print();
      return;
    }
    window.print();
  };

  const handleDownloadPdf = async () => {
    if (activeTab === 'internacao') {
      if (inpatientSubTab === 'aih') {
        await downloadAihPdf(aihData, doctor, patient);
        return;
      }
      if (inpatientSubTab === 'apac') {
        await downloadApacPdf(apacData, doctor, patient);
        return;
      }
      const downloadBtn = document.querySelector('button[title*="Baixar"], button:has(svg.lucide-download)') as HTMLButtonElement | null;
      if (downloadBtn) {
        downloadBtn.click();
      } else {
        window.print();
      }
      return;
    }
    const downloadBtn = document.querySelector('button[title*="Baixar"], button:has(svg.lucide-download)') as HTMLButtonElement | null;
    if (downloadBtn) {
      downloadBtn.click();
    } else {
      window.print();
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={tab => {
          if (tab === 'configuracoes') {
            setIsSettingsOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        doctor={doctor}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenDoctorEntry={handleLogoutOrSwitchDoctor}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenGoogleDrive={() => setIsGoogleDriveOpen(true)}
        onPrint={handlePrint}
        onDownloadPdf={handleDownloadPdf}
      />

      {/* Main Workspace */}
      <main className="flex-1 w-full min-w-0 mx-auto p-3 sm:p-5 lg:p-6 transition-all max-w-[1720px]">
        {/* 1. MÓDULO UNIFICADO DE INTERNAÇÃO HOSPITALAR (Prescrição • Exames • AIH • APAC) */}
        {activeTab === 'internacao' ? (
          <InternacaoHub
            key={`internacao-${patientSessionKey}`}
            doctor={doctor}
            patient={patient}
            setPatient={handleUpdatePatient}
            inpatientInfo={inpatientInfo}
            setInpatientInfo={setInpatientInfo}
            inpatientItems={inpatientItems}
            setInpatientItems={setInpatientItems}
            aihData={aihData}
            setAihData={setAihData}
            apacData={apacData}
            setApacData={setApacData}
            subTab={inpatientSubTab}
            setSubTab={setInpatientSubTab}
            onSaveToHistory={handleSaveToHistory}
            onNewPatient={handleNewPatient}
            onSaveDoctorProfile={setDoctor}
          />
        ) : (
          /* 2. ATENDIMENTO AO PACIENTE INTEGRADO (Receita • Atestado • Declaração) */
          <AtendimentoHub
            key={`atendimento-${patientSessionKey}`}
            doctor={doctor}
            patient={patient}
            setPatient={handleUpdatePatient}
            prescriptionType={prescriptionType}
            setPrescriptionType={setPrescriptionType}
            prescriptionItems={prescriptionItems}
            setPrescriptionItems={setPrescriptionItems}
            generalRecommendations={generalRecommendations}
            setGeneralRecommendations={setGeneralRecommendations}
            prescriptionDate={prescriptionDate}
            setPrescriptionDate={setPrescriptionDate}
            prescriptionCid={prescriptionCid}
            setDiagnosticCid={setPrescriptionCid}
            atestado={atestado}
            setAtestado={setAtestado}
            declaracao={declaracao}
            setDeclaracao={setDeclaracao}
            subTab={atendimentoSubTab}
            setSubTab={setAtendimentoSubTab}
            onSaveToHistory={handleSaveToHistory}
            onNewPatient={handleNewPatient}
          />
        )}
      </main>

      {/* Doctor Entry Screen Modal (Password-Protected Authentication, Local Registration & Recovery) */}
      <DoctorEntryModal
        isOpen={isDoctorEntryOpen || !isAuthenticated}
        onClose={() => setIsDoctorEntryOpen(false)}
        doctor={doctor}
        onSaveDoctor={updatedProfile => {
          setDoctor(updatedProfile);
          setIsAuthenticated(true);
          setIsDoctorEntryOpen(false);
        }}
        canDismiss={isAuthenticated}
      />

      {/* Settings Modal (Doctor & Clinic Customization) */}
      <DoctorSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        doctor={doctor}
        setDoctor={setDoctor}
      />

      {/* History Modal */}
      <DocumentHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onClearHistory={() => setHistory([])}
      />

      {/* Google Drive Hospital Cloud Backup Modal */}
      <GoogleDriveSyncModal
        isOpen={isGoogleDriveOpen}
        onClose={() => setIsGoogleDriveOpen(false)}
        patient={patient}
        activeClinicalData={{
          inpatientInfo,
          inpatientItems,
          prescriptionItems,
          atestado
        }}
      />

      {/* Offline Status Indicator (Non-intrusive notification) */}
      <OfflineIndicator />
    </div>
  );
}
