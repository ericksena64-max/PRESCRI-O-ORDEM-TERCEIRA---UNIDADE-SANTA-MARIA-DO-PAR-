import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  Clock,
  Printer,
  CheckCircle2,
  FileCheck
} from 'lucide-react';
import {
  FichaAdmissaoHospitalar,
  EvolucaoSoapItem,
  PatientInfo,
  DoctorProfile,
  InpatientInfo,
  InpatientItem,
  AihData
} from '../types';
import {
  buildDefaultAdmissao,
  buildDefaultEvolucoes,
  saveProntuarioToStorage,
  loadProntuarioFromStorage,
  hasSavedProntuario,
  sanitizeAdmissaoLegacyMocks
} from '../data/prontuarioHospitalar';
import { FichaAdmissaoForm } from './FichaAdmissaoForm';
import { EvolucaoSoapView } from './EvolucaoSoapView';
import { ProntuarioImpressaoA4 } from './ProntuarioImpressaoA4';
import { SumarioAltaHospitalar } from './SumarioAltaHospitalar';

export type ProntuarioSubTab = 'admissao' | 'evolucoes' | 'impressao' | 'alta';

interface ProntuarioEnfermariaHubProps {
  doctor: DoctorProfile;
  patient: PatientInfo;
  setPatient: (patient: PatientInfo | ((prev: PatientInfo) => PatientInfo)) => void;
  inpatientInfo: InpatientInfo;
  inpatientItems?: InpatientItem[];
  aihData?: AihData;
  onSaveToHistory?: (summary: string) => void;
  onNewPatient?: () => void;
}

export const ProntuarioEnfermariaHub: React.FC<ProntuarioEnfermariaHubProps> = ({
  doctor,
  patient,
  setPatient,
  inpatientInfo,
  inpatientItems = [],
  aihData,
  onSaveToHistory,
  onNewPatient
}) => {
  const [activeTab, setActiveTab] = useState<ProntuarioSubTab>('admissao');
  const [lastSavedTime, setLastSavedTime] = useState<string>('agora');
  const [isAutoSaving, setIsAutoSaving] = useState(false);

  // Inicializa estado com dados padrão sincronizados com o paciente/médico atual
  const [admissao, setAdmissao] = useState<FichaAdmissaoHospitalar>(() => {
    const fallback = buildDefaultAdmissao(patient, doctor, inpatientInfo);
    const loaded = loadProntuarioFromStorage(
      patient.document || patient.name || 'default',
      fallback,
      []
    );
    return loaded.admissao;
  });

  const [evolucoes, setEvolucoes] = useState<EvolucaoSoapItem[]>(() => {
    const fallback = buildDefaultEvolucoes(patient, doctor, inpatientInfo);
    const loaded = loadProntuarioFromStorage(
      patient.document || patient.name || 'default',
      buildDefaultAdmissao(patient, doctor, inpatientInfo),
      fallback
    );
    return loaded.evolucoes;
  });

  // Salva no localStorage quando o paciente ou os dados mudam
  const patientKey = patient.document || patient.name || 'default';
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Refs sempre atualizadas: evitam closures obsoletas no auto-save periódico
  const latestRef = useRef({ patientKey, admissao, evolucoes });
  latestRef.current = { patientKey, admissao, evolucoes };

  const executarSalvar = () => {
    const { patientKey: key, admissao: adm, evolucoes: evos } = latestRef.current;
    setIsAutoSaving(true);
    saveProntuarioToStorage(key, adm, evos);
    if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
    feedbackTimeoutRef.current = setTimeout(() => {
      setIsAutoSaving(false);
      setLastSavedTime(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 400);
  };

  // Troca de paciente: se já existir prontuário salvo para o novo identificador, carrega-o
  // (evita gravar a ficha de um paciente sob o identificador de outro). Debounce para não
  // disparar a cada tecla enquanto o identificador é digitado.
  const loadedKeyRef = useRef(patientKey);
  useEffect(() => {
    setAdmissao(prev => sanitizeAdmissaoLegacyMocks(prev));
  }, []);

  useEffect(() => {
    if (patientKey === loadedKeyRef.current) return;
    const timer = setTimeout(() => {
      loadedKeyRef.current = patientKey;
      if (hasSavedProntuario(patientKey)) {
        const loaded = loadProntuarioFromStorage(
          patientKey,
          buildDefaultAdmissao(patient, doctor, inpatientInfo),
          buildDefaultEvolucoes(patient, doctor, inpatientInfo)
        );
        setAdmissao(loaded.admissao);
        setEvolucoes(loaded.evolucoes);
      }
    }, 800);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientKey]);

  // Auto-save a cada 30 segundos (intervalo estável, não reinicia a cada digitação)
  useEffect(() => {
    const interval = setInterval(executarSalvar, 30000);
    return () => {
      clearInterval(interval);
      if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
      // Garante gravação final ao desmontar (troca de aba)
      const { patientKey: key, admissao: adm, evolucoes: evos } = latestRef.current;
      saveProntuarioToStorage(key, adm, evos);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Salva também nas alterações pontuais (com debounce de 2 segundos)
  useEffect(() => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(executarSalvar, 2000);
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [admissao, evolucoes]);

  const tabsConfig: {
    id: ProntuarioSubTab;
    label: string;
    sublabel: string;
    icon: React.ElementType;
    badge: string;
    badgeColor: string;
  }[] = [
    {
      id: 'admissao',
      label: '1. Ficha de Admissão',
      sublabel: 'Anamnese Inicial • Exame Físico • Riscos',
      icon: FileText,
      badge: admissao.queixaPrincipal ? 'Preenchida' : 'Inicial',
      badgeColor: 'bg-blue-100 text-blue-900 border-blue-200'
    },
    {
      id: 'evolucoes',
      label: '2. Evoluções Diárias (SOAP)',
      sublabel: 'Linha do Tempo • Balanço Hídrico • Notas',
      icon: Clock,
      badge: `${evolucoes.length} ${evolucoes.length === 1 ? 'nota' : 'notas'}`,
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-200'
    },
    {
      id: 'impressao',
      label: '3. Histórico / Impressão A4',
      sublabel: 'Prontuário Completo • Folha Físico A4',
      icon: Printer,
      badge: 'Imprimir',
      badgeColor: 'bg-purple-100 text-purple-900 border-purple-200'
    },
    {
      id: 'alta',
      label: '4. Sumário de Alta & Receita',
      sublabel: 'Desospitalização • Receita Domiciliar A4',
      icon: FileCheck,
      badge: 'Kit de Alta',
      badgeColor: 'bg-teal-100 text-teal-900 border-teal-200'
    }
  ];

  return (
    <div className="space-y-4">
      {/* ======================================================== */}
      {/* BARRA DE NAVEGAÇÃO INTERNA DAS 4 ABAS DO PRONTUÁRIO      */}
      {/* ======================================================== */}
      <div className="no-print bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 w-full sm:w-auto flex-1">
          {tabsConfig.map(tab => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`p-3 rounded-xl border text-left transition-all duration-150 flex items-center justify-between gap-2.5 group relative ${
                  isSelected
                    ? 'bg-gradient-to-r from-blue-600 to-sky-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                    : 'bg-slate-50 hover:bg-slate-100/90 border-slate-200 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`p-2 rounded-lg shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-white text-blue-700 border border-slate-200 shadow-2xs group-hover:bg-blue-50'
                  }`}>
                    <Icon className="w-4 h-4" strokeWidth={2.25} />
                  </span>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-black truncate leading-tight">
                      {tab.label}
                    </h4>
                    <p className={`text-[10px] truncate mt-0.5 leading-tight ${
                      isSelected ? 'text-blue-100' : 'text-slate-500'
                    }`}>
                      {tab.sublabel}
                    </p>
                  </div>
                </div>

                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 border ${
                  isSelected
                    ? 'bg-white text-slate-900 border-transparent shadow-2xs'
                    : `${tab.badgeColor}`
                }`}>
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Indicador de Auto-save / Sincronização LocalStorage */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center text-xs text-slate-500 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
          {isAutoSaving ? (
            <span className="flex items-center gap-1.5 text-blue-600 font-bold">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
              Sincronizando...
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Auto-salvo às {lastSavedTime}
            </span>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* CONTEÚDO ATIVO DA ABA SELECIONADA                        */}
      {/* ======================================================== */}
      <div>
        {/* ABA 1: FICHA DE ADMISSÃO HOSPITALAR */}
        {activeTab === 'admissao' && (
          <FichaAdmissaoForm
            data={admissao}
            onChange={setAdmissao}
            patient={patient}
            setPatient={setPatient}
            doctor={doctor}
            inpatientInfo={inpatientInfo}
            onNewPatient={onNewPatient}
          />
        )}

        {/* ABA 2: EVOLUÇÕES DIÁRIAS (SOAP) */}
        {activeTab === 'evolucoes' && (
          <EvolucaoSoapView
            evolucoes={evolucoes}
            onChangeEvolucoes={setEvolucoes}
            doctor={doctor}
            patient={patient}
          />
        )}

        {/* ABA 3: HISTÓRICO / IMPRESSÃO A4 */}
        {activeTab === 'impressao' && (
          <ProntuarioImpressaoA4
            admissao={admissao}
            evolucoes={evolucoes}
            patient={patient}
            doctor={doctor}
            inpatientInfo={inpatientInfo}
            onSaveToHistory={onSaveToHistory}
          />
        )}

        {/* ABA 4: SUMÁRIO DE ALTA HOSPITALAR & RECEITA DOMICILIAR */}
        {activeTab === 'alta' && (
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
