import React, { useState } from 'react';
import {
  BedDouble,
  Trash2,
  ChevronUp,
  ChevronDown,
  ShieldAlert,
  AlertTriangle,
  RotateCcw,
  ClipboardList,
  Info,
  Clock,
  UserPlus,
  Zap,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  Syringe
} from 'lucide-react';
import { InpatientInfo, InpatientItem, PatientInfo, FastHugCategory, HospitalMedication } from '../types';
import {
  FAST_HUG_SECTIONS,
  INPATIENT_ROUTES,
  INPATIENT_FREQUENCIES,
  INPATIENT_POSOLOGY_GROUPS,
  INPATIENT_QUICK_POSOLOGIES,
  INPATIENT_SCHEDULE_OPTIONS,
  buildDefaultFastHugTemplate,
  buildScribdImageTemplate,
  medicationToInpatientItem,
  newInpatientItemId
} from '../data/hospitalMedications';
import { HospitalMedicationPicker } from './HospitalMedicationPicker';
import { CidSearchAutocomplete } from './CidSearchAutocomplete';
import { resolveCidAndDescription } from '../data/cid10';
import { ProtocolosHospitalaresModal } from './ProtocolosHospitalaresModal';
import { ProtocoloHospitalar, instantiateProtocolo } from '../data/protocolosHospitalares';
import { getTodayIso } from '../utils/dateUtils';

interface InpatientPrescriptionFormProps {
  patient: PatientInfo;
  setPatient: React.Dispatch<React.SetStateAction<PatientInfo>>;
  info: InpatientInfo;
  setInfo: React.Dispatch<React.SetStateAction<InpatientInfo>>;
  items: InpatientItem[];
  setItems: React.Dispatch<React.SetStateAction<InpatientItem[]>>;
  onNewPatient?: () => void;
}

const INPUT_CLASS =
  'w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-hidden';
const SMALL_INPUT_CLASS =
  'w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-600 outline-hidden';

export const InpatientPrescriptionForm: React.FC<InpatientPrescriptionFormProps> = ({
  patient,
  setPatient,
  info,
  setInfo,
  items,
  setItems,
  onNewPatient
}) => {
  const [showProtocolosModal, setShowProtocolosModal] = useState(false);
  const [renovacaoToast, setRenovacaoToast] = useState<string | null>(null);
  const [antibioticosAvisos, setAntibioticosAvisos] = useState<string[]>([]);

  const handleApplyProtocolo = (proto: ProtocoloHospitalar, modo: 'substituir' | 'mesclar') => {
    const newItems = instantiateProtocolo(proto);
    if (modo === 'substituir') {
      setItems(newItems);
    } else {
      setItems(prev => [...prev, ...newItems]);
    }
    setInfo(prev => ({
      ...prev,
      diagnosis: proto.diagnosticoSugerido,
      cid: { code: proto.cid10Sugerido.code, description: proto.cid10Sugerido.description }
    }));
    setRenovacaoToast(`Protocolo "${proto.titulo}" aplicado com sucesso!`);
    setTimeout(() => setRenovacaoToast(null), 3500);
  };

  const renewPrescriptionDPlusOne = () => {
    if (items.length === 0) {
      alert('Nenhum item na prescrição para renovar.');
      return;
    }

    const warnings: string[] = [];
    let totalAntibioticosAvancados = 0;

    const novosItens = items.map(item => {
      const isAtb = item.category === 'antibioticos' || Boolean(item.diaAtual);
      if (!isAtb) {
        return item;
      }

      let currDia = item.diaAtual;
      let totalDia = item.diaTotal;

      const match = (item.name + ' ' + (item.notes || '')).match(/\b(?:D|Dia\s*)(\d+)(?:\s*(?:\/|de)\s*(\d+))?\b/i);
      if (!currDia && match) {
        currDia = parseInt(match[1], 10);
        if (match[2]) {
          totalDia = parseInt(match[2], 10);
        }
      }

      if (currDia !== undefined && !isNaN(currDia)) {
        const nextDia = currDia + 1;
        totalAntibioticosAvancados++;

        let updatedName = item.name;
        if (/\b(?:D|Dia\s*)(\d+)(\s*(?:\/|de)\s*(\d+))?\b/i.test(updatedName)) {
          updatedName = updatedName.replace(
            /\b(?:D|Dia\s*)(\d+)(\s*(?:\/|de)\s*(\d+))?\b/i,
            (m, d, sep, tot) => (tot ? `D${nextDia}/${tot}` : `D${nextDia}`)
          );
        }

        let updatedNotes = item.notes;
        if (updatedNotes && /\b(?:D|Dia\s*)(\d+)(\s*(?:\/|de)\s*(\d+))?\b/i.test(updatedNotes)) {
          updatedNotes = updatedNotes.replace(
            /\b(?:D|Dia\s*)(\d+)(\s*(?:\/|de)\s*(\d+))?\b/i,
            (m, d, sep, tot) => (tot ? `D${nextDia}/${tot}` : `D${nextDia}`)
          );
        }

        if (totalDia && nextDia >= totalDia) {
          warnings.push(`${item.name}: atingiu ${nextDia}/${totalDia} dias programados.`);
        }

        return {
          ...item,
          name: updatedName,
          notes: updatedNotes,
          diaAtual: nextDia,
          diaTotal: totalDia,
          isAlterado: true
        };
      }

      totalAntibioticosAvancados++;
      return {
        ...item,
        diaAtual: 2,
        isAlterado: true
      };
    });

    setItems(novosItens);
    setInfo(prev => ({
      ...prev,
      prescriptionDate: getTodayIso()
    }));
    setAntibioticosAvisos(warnings);
    setRenovacaoToast(
      totalAntibioticosAvancados > 0
        ? `Prescrição renovada! ${totalAntibioticosAvancados} antibiótico(s) avançado(s) para D+1.`
        : `Prescrição renovada com sucesso para hoje!`
    );
    setTimeout(() => setRenovacaoToast(null), 4000);
  };
  const addFromDatabase = (med: HospitalMedication) => {
    setItems(prev => [...prev, medicationToInpatientItem(med)]);
  };

  const addCustom = (category: FastHugCategory, name: string) => {
    setItems(prev => [
      ...prev,
      {
        id: newInpatientItemId(),
        category,
        name,
        dose: '',
        route: category === 'demais' || category === 'dieta' ? '' : 'EV',
        frequency: '',
        notes: ''
      }
    ]);
  };

  const updateItem = (id: string, field: keyof InpatientItem, value: string | boolean) => {
    setItems(prev => prev.map(item => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  // Move dentro da própria seção, ignorando itens de outras seções intercalados
  const moveItem = (id: string, direction: -1 | 1) => {
    setItems(prev => {
      const idx = prev.findIndex(i => i.id === id);
      if (idx < 0) return prev;
      const category = prev[idx].category;
      let target = idx + direction;
      while (target >= 0 && target < prev.length && prev[target].category !== category) {
        target += direction;
      }
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  };

  const applyDefaultTemplate = () => {
    if (items.length > 0 && !window.confirm('Substituir a prescrição atual pelo modelo padrão FAST-HUG?')) {
      return;
    }
    setItems(buildDefaultFastHugTemplate());
  };

  const applyScribdTemplate = () => {
    if (items.length > 0 && !window.confirm('Substituir a prescrição atual pelo modelo oficial da folha hospitalar (18 itens)?')) {
      return;
    }
    setItems(buildScribdImageTemplate());
  };

  const clearAll = () => {
    if (items.length > 0 && !window.confirm('Remover todos os itens da prescrição de internação?')) {
      return;
    }
    setItems([]);
  };

  const hasControlled = items.some(i => i.controlled);

  return (
    <div className="space-y-6">
      {/* Datalists compartilhados pelos campos de via e frequência */}
      <datalist id="inpatient-routes">
        {INPATIENT_ROUTES.map(r => (
          <option key={r} value={r} />
        ))}
      </datalist>
      <datalist id="inpatient-frequencies">
        {INPATIENT_FREQUENCIES.map(f => (
          <option key={f} value={f} />
        ))}
      </datalist>

      {/* Patient & Admission Card */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
        <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-4 flex items-center justify-between flex-wrap gap-2">
          <span className="flex items-center gap-2.5">
            <span className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-sky-500 text-white flex items-center justify-center shadow-xs">
              <BedDouble className="w-4 h-4" strokeWidth={2.25} />
            </span>
            <span>Paciente Internado</span>
          </span>
          {onNewPatient ? (
            <button
              type="button"
              onClick={onNewPatient}
              title="Limpar todos os dados do paciente atual para iniciar nova internação"
              className="text-xs font-bold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all normal-case tracking-normal cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Novo Paciente</span>
            </button>
          ) : (
            <span className="text-xs text-slate-400 font-normal hidden sm:inline">Identificação da internação</span>
          )}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6">
            <label htmlFor="inp-patient-name" className="block text-xs font-semibold text-slate-600 mb-1">
              Nome Completo do Paciente *
            </label>
            <input
              id="inp-patient-name"
              type="text"
              value={patient.name}
              onChange={e => setPatient({ ...patient, name: e.target.value })}
              placeholder="Ex: Nome Completo do Paciente"
              className={`${INPUT_CLASS} font-medium`}
            />
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="inp-patient-doc" className="block text-xs font-semibold text-slate-600 mb-1">
              Identificador / Prontuário / CPF
            </label>
            <input
              id="inp-patient-doc"
              type="text"
              value={patient.document}
              onChange={e => setPatient({ ...patient, document: e.target.value })}
              placeholder="Prontuário ou CPF"
              className={INPUT_CLASS}
            />
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="inp-patient-birth" className="block text-xs font-semibold text-slate-600 mb-1">
              Data de Nascimento
            </label>
            <input
              id="inp-patient-birth"
              type="date"
              value={patient.birthDate || ''}
              onChange={e => setPatient({ ...patient, birthDate: e.target.value })}
              className={INPUT_CLASS}
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="inp-patient-age" className="block text-xs font-semibold text-slate-600 mb-1">
              Idade
            </label>
            <input
              id="inp-patient-age"
              type="text"
              value={patient.age || ''}
              onChange={e => setPatient({ ...patient, age: e.target.value })}
              placeholder="Ex: 62 anos"
              className={INPUT_CLASS}
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="inp-patient-weight" className="block text-xs font-semibold text-slate-600 mb-1">
              Peso (kg)
            </label>
            <input
              id="inp-patient-weight"
              type="number"
              min={1}
              max={300}
              step={0.5}
              value={patient.weight || ''}
              onChange={e => setPatient({ ...patient, weight: parseFloat(e.target.value) || '' })}
              placeholder="Ex: 70"
              className={INPUT_CLASS}
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="inp-patient-height" className="block text-xs font-semibold text-slate-600 mb-1">
              Altura
            </label>
            <input
              id="inp-patient-height"
              type="text"
              value={patient.height || ''}
              onChange={e => setPatient({ ...patient, height: e.target.value })}
              placeholder="Ex: 1,70 m"
              className={INPUT_CLASS}
            />
          </div>

          <div className="sm:col-span-4">
            <label htmlFor="inp-ward" className="block text-xs font-semibold text-slate-600 mb-1">
              Unidade / Enfermaria
            </label>
            <input
              id="inp-ward"
              type="text"
              value={info.ward}
              onChange={e => setInfo({ ...info, ward: e.target.value })}
              placeholder="Ex: Enfermaria Clínica"
              className={INPUT_CLASS}
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="inp-bed" className="block text-xs font-semibold text-slate-600 mb-1">
              Leito
            </label>
            <input
              id="inp-bed"
              type="text"
              value={info.bed}
              onChange={e => setInfo({ ...info, bed: e.target.value })}
              placeholder="Ex: 05-B"
              className={INPUT_CLASS}
            />
          </div>

          <div className="sm:col-span-6">
            <label htmlFor="inp-admission" className="block text-xs font-semibold text-slate-600 mb-1">
              Data da Admissão
            </label>
            <input
              id="inp-admission"
              type="date"
              value={info.admissionDate}
              onChange={e => setInfo({ ...info, admissionDate: e.target.value })}
              className={INPUT_CLASS}
            />
          </div>

          <div className="sm:col-span-6">
            <label htmlFor="inp-date" className="block text-xs font-semibold text-slate-600 mb-1">
              Data da Prescrição
            </label>
            <input
              id="inp-date"
              type="date"
              value={info.prescriptionDate}
              onChange={e => setInfo({ ...info, prescriptionDate: e.target.value })}
              className={INPUT_CLASS}
            />
          </div>

          <div className="sm:col-span-12">
            <label htmlFor="inp-allergies" className="block text-xs font-semibold text-rose-700 mb-1 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              Alergias (confirmar com o paciente/acompanhante)
            </label>
            <input
              id="inp-allergies"
              type="text"
              value={info.allergies}
              onChange={e => setInfo({ ...info, allergies: e.target.value })}
              placeholder="Ex: Dipirona (urticária) — ou — Nega alergias medicamentosas"
              className="w-full px-3 py-2 border border-rose-200 bg-rose-50/30 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-hidden"
            />
          </div>

          <div className="sm:col-span-12">
            <label htmlFor="inp-diagnosis" className="block text-xs font-semibold text-slate-600 mb-1">
              Hipótese Diagnóstica / Motivo da Internação
            </label>
            <input
              id="inp-diagnosis"
              type="text"
              value={info.diagnosis}
              onChange={e => {
                const val = e.target.value;
                const matched = resolveCidAndDescription(val);
                setInfo(prev => ({
                  ...prev,
                  diagnosis: val,
                  cid: matched ? { code: matched.code, description: matched.description } : prev.cid
                }));
              }}
              onBlur={e => {
                const matched = resolveCidAndDescription(e.target.value);
                if (matched) {
                  setInfo(prev => ({
                    ...prev,
                    cid: { code: matched.code, description: matched.description },
                    diagnosis: prev.diagnosis || matched.description
                  }));
                }
              }}
              placeholder="Ex: Pneumonia adquirida na comunidade — CURB-65: 2"
              className={INPUT_CLASS}
            />
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100">
          <CidSearchAutocomplete
            selectedCidCode={info.cid?.code}
            selectedCidDescription={info.cid?.description}
            onSelectCid={cid => setInfo(prev => ({
              ...prev,
              cid: { code: cid.code, description: cid.description },
              diagnosis: prev.diagnosis.trim() ? prev.diagnosis : cid.description
            }))}
            onClearCid={() => setInfo(prev => ({ ...prev, cid: undefined }))}
            label="CID-10 da Internação (Opcional)"
            descriptionHint="Aparece no cabeçalho da prescrição"
            showQuickPresets={false}
            placeholder="Buscar CID-10 (ex: J18, I50, N39, A09)..."
          />
        </div>
      </div>

      {/* Inpatient Protocol Banner */}
      <div className="bg-gradient-to-br from-[#071326] via-[#0b1e3b] to-[#0d274c] text-white rounded-xl p-5 border border-blue-900/60 shadow-md">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-sky-400 flex items-center justify-center shadow-md ring-1 ring-sky-300/40">
              <ClipboardList className="w-5 h-5 text-white" strokeWidth={2.25} />
            </span>
            <div>
              <h2 className="text-sm font-extrabold tracking-tight">Prescrição de Internação — Ordem Clínica Hospitalar (1 a 7)</h2>
              <p className="text-xs text-blue-200/80 mt-0.5">
                1 Dieta • 2 Hidratação • 3 Antibiótico • 4 Analgesia • 5 Sintomáticos • 6 Profilaxias • 7 Demais
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setShowProtocolosModal(true)}
              className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 rounded-lg text-xs font-black shadow-md ring-2 ring-amber-300/80 transition-all flex items-center gap-1.5 cursor-pointer transform hover:scale-[1.02]"
              title="Abre o menu com 7 Protocolos Hospitalares prontos (Pneumonia, IC, Sepse, DPOC, AVC, Pré-Op, Diabetes)"
            >
              <Zap className="w-3.5 h-3.5 fill-slate-950" />
              <span>Protocolos (1 Clique)</span>
            </button>

            <button
              type="button"
              onClick={renewPrescriptionDPlusOne}
              className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white rounded-lg text-xs font-black shadow-md ring-1 ring-emerald-300/60 transition-all flex items-center gap-1.5 cursor-pointer"
              title="Copia e renova a prescrição, avançando automaticamente a contagem de dias dos antibióticos (D+1)"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Renovar Prescrição (D+1)</span>
            </button>

            <button
              type="button"
              onClick={applyScribdTemplate}
              className="px-3 py-1.5 bg-slate-800/90 hover:bg-slate-700 text-white border border-slate-600 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              title="Carrega exatamente os 18 itens da folha real hospitalar (Dipirona, Tramadol, HGT, Captopril, Amiodarona...)"
            >
              <ClipboardList className="w-3.5 h-3.5" />
              Folha Real (18 Itens)
            </button>
            <button
              type="button"
              onClick={applyDefaultTemplate}
              className="px-3 py-1.5 bg-blue-950/80 hover:bg-blue-900 text-blue-200 border border-blue-700/70 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
              title="Carrega o modelo de internação FAST-HUG básico para revisão"
            >
              <ClipboardList className="w-3.5 h-3.5" />
              FAST-HUG
            </button>
            <button
              type="button"
              onClick={clearAll}
              className="px-2.5 py-1.5 bg-red-950/50 hover:bg-red-900/70 text-red-200 border border-red-800/60 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-red-400" />
              Limpar
            </button>
          </div>
        </div>

        {/* FEEDBACK DE RENOVAÇÃO / TOAST */}
        {renovacaoToast && (
          <div className="mt-3 p-3 bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 rounded-lg flex items-center justify-between text-xs font-bold animate-in fade-in">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              {renovacaoToast}
            </span>
          </div>
        )}

        {/* AVISOS DE LIMITE DE DIAS DE ANTIBIÓTICOS */}
        {antibioticosAvisos.length > 0 && (
          <div className="mt-3 p-3 bg-amber-500/20 border border-amber-400/50 text-amber-200 rounded-lg text-xs space-y-1">
            <div className="flex items-center gap-2 font-black text-amber-300">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Atenção Clínica — Antibióticos em Limite Programado:</span>
            </div>
            <ul className="list-disc pl-5 space-y-0.5 text-amber-100">
              {antibioticosAvisos.map((av, idx) => (
                <li key={idx}>
                  <strong>{av}</strong> Avaliar se o tratamento deve ser concluído ou prorrogado.
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-1.5">
          {FAST_HUG_SECTIONS.map(section => {
            const count = items.filter(i => i.category === section.key).length;
            return (
              <span
                key={section.key}
                title={`${section.title}: ${section.description}`}
                className="inline-flex items-center gap-1.5 pl-1.5 pr-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-medium text-blue-100"
              >
                <span className="h-5 w-5 rounded-full bg-sky-500/90 text-white text-[11px] font-black flex items-center justify-center">
                  {section.letter}
                </span>
                <span>{section.shortTitle}</span>
                <span className={`ml-0.5 text-[10px] font-bold ${count > 0 ? 'text-emerald-300' : 'text-slate-400'}`}>
                  {count > 0 ? `✓ ${count}` : '—'}
                </span>
              </span>
            );
          })}
        </div>

        <p className="mt-3 text-[11px] text-blue-200/70 flex items-start gap-1.5 leading-snug">
          <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-sky-400" />
          <span>
            As doses do banco hospitalar são sugestões padrão. Revise peso, função renal/hepática, alergias e
            interações antes de assinar.
          </span>
        </p>
      </div>

      {hasControlled && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2 text-xs text-amber-900">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            Há medicamentos <strong>controlados</strong> na prescrição. Siga o fluxo de dispensação e registro do
            seu serviço (Portaria SVS/MS nº 344/98).
          </span>
        </div>
      )}

      {/* 7 Seções de Internação */}
      {FAST_HUG_SECTIONS.map(section => {
        const sectionItems = items.filter(i => i.category === section.key);
        return (
          <div key={section.key} className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <span className="h-9 w-9 rounded-xl text-white font-black text-sm flex items-center justify-center shadow-xs shrink-0 bg-gradient-to-br from-blue-600 to-sky-500">
                  {section.letter}
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    {section.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-snug">{section.description}</p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-blue-900 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full shrink-0">
                {sectionItems.length} {sectionItems.length === 1 ? 'item' : 'itens'}
              </span>
            </div>

            <HospitalMedicationPicker
              category={section.key}
              placeholder={`Buscar em ${section.title.toLowerCase()}...`}
              onSelect={addFromDatabase}
              onAddCustom={name => addCustom(section.key, name)}
            />

            {sectionItems.length === 0 ? (
              <div className="mt-3 text-center py-4 px-3 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                <p className="text-xs text-slate-500 italic">{section.emptyText}</p>
              </div>
            ) : (
              <div className="mt-3 space-y-3">
                {sectionItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50/40 hover:bg-slate-50 hover:border-slate-300 transition-all"
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <span className="w-6 h-6 rounded-full bg-blue-700 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <input
                        type="text"
                        value={item.name}
                        onChange={e => updateItem(item.id, 'name', e.target.value)}
                        placeholder="Medicamento / prescrição"
                        className="font-bold text-slate-900 text-sm bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-600 focus:bg-white px-1 py-0.5 rounded-sm outline-hidden flex-1 min-w-0"
                      />
                      {item.isAlterado && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-emerald-100 text-emerald-800 font-extrabold shrink-0 mt-1 animate-pulse">
                          D+1
                        </span>
                      )}
                      {item.controlled && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-amber-100 text-amber-800 font-semibold shrink-0 mt-1">
                          Controlado
                        </span>
                      )}
                      <div className="flex items-center gap-0.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => moveItem(item.id, -1)}
                          disabled={index === 0}
                          title="Mover para cima"
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded-sm"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveItem(item.id, 1)}
                          disabled={index === sectionItems.length - 1}
                          title="Mover para baixo"
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded-sm"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          title="Remover item"
                          className="p-1 text-red-400 hover:text-red-600 rounded-sm transition-colors ml-0.5"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Controle Clínico de Dias do Antibiótico (D1, D2, D3...) */}
                    {(section.key === 'antibioticos' || item.category === 'antibioticos') && (
                      <div className="mb-2 p-2 bg-rose-50/70 border border-rose-200 rounded-lg flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5">
                          <Syringe className="w-3.5 h-3.5 text-rose-600" />
                          <span className="text-xs font-bold text-rose-900">Tempo de Antimicrobiano:</span>
                          <span className="px-2 py-0.5 rounded-md bg-white border border-rose-300 text-xs font-black text-rose-700 font-mono shadow-2xs">
                            D{item.diaAtual || 1} / {item.diaTotal || 7}
                          </span>
                          {item.diaAtual && item.diaTotal && item.diaAtual >= item.diaTotal && (
                            <span className="px-1.5 py-0.5 rounded-sm bg-rose-200 text-rose-900 text-[10px] font-black uppercase">
                              Último dia
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 text-xs">
                          <button
                            type="button"
                            onClick={() => {
                              const curr = item.diaAtual || 1;
                              if (curr > 1) updateItem(item.id, 'diaAtual' as any, (curr - 1) as any);
                            }}
                            className="px-2 py-0.5 rounded-md bg-white hover:bg-rose-100 text-rose-800 border border-rose-300 font-black cursor-pointer"
                            title="Diminuir 1 dia (D-1)"
                          >
                            -1 Dia
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const curr = item.diaAtual || 1;
                              updateItem(item.id, 'diaAtual' as any, (curr + 1) as any);
                            }}
                            className="px-2 py-0.5 rounded-md bg-rose-600 hover:bg-rose-700 text-white font-black shadow-2xs cursor-pointer"
                            title="Avançar 1 dia (D+1)"
                          >
                            +1 Dia (D+1)
                          </button>
                          <span className="text-slate-400">|</span>
                          <span className="text-[11px] text-rose-900 font-semibold">Total:</span>
                          <select
                            aria-label="Duração total programada"
                            value={item.diaTotal || 7}
                            onChange={e => updateItem(item.id, 'diaTotal' as any, parseInt(e.target.value, 10) as any)}
                            className="px-1.5 py-0.5 text-xs font-bold bg-white border border-rose-300 rounded-md text-rose-900 cursor-pointer outline-hidden"
                          >
                            <option value="3">3 dias</option>
                            <option value="5">5 dias</option>
                            <option value="7">7 dias</option>
                            <option value="10">10 dias</option>
                            <option value="14">14 dias</option>
                            <option value="21">21 dias</option>
                          </select>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                      <div className="sm:col-span-3">
                        <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                          Qtde / Dose (Editável)
                        </label>
                        <input
                          type="text"
                          value={item.dose}
                          onChange={e => updateItem(item.id, 'dose', e.target.value)}
                          placeholder="Ex: 1 g, 500 mg, 1 amp..."
                          className={SMALL_INPUT_CLASS}
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Via</label>
                        <div className="flex gap-1">
                          <input
                            type="text"
                            list="inpatient-routes"
                            value={item.route}
                            onChange={e => updateItem(item.id, 'route', e.target.value)}
                            placeholder="EV, VO..."
                            className={SMALL_INPUT_CLASS}
                          />
                          <select
                            aria-label="Selecionar via"
                            value=""
                            onChange={e => {
                              if (e.target.value) updateItem(item.id, 'route', e.target.value);
                            }}
                            className="px-1.5 py-1 text-[11px] bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg text-slate-700 font-semibold cursor-pointer outline-hidden shrink-0"
                            title="Escolher via de administração"
                          >
                            <option value="">▾</option>
                            {INPATIENT_ROUTES.map(r => (
                              <option key={r} value={r}>
                                {r}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="sm:col-span-4">
                        <label className="block text-[11px] font-semibold text-blue-900 mb-0.5 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-blue-600" />
                          Posologia / Frequência / Hora (Editável)
                        </label>
                        <div className="flex gap-1">
                          <input
                            type="text"
                            value={item.frequency}
                            onChange={e => updateItem(item.id, 'frequency', e.target.value)}
                            placeholder="Ex: 12/12h, 24/24h, 6/6h S.N., ACM..."
                            className={`${SMALL_INPUT_CLASS} font-semibold text-blue-950 border-blue-300`}
                          />
                          <select
                            aria-label="Mais opções de posologia e horários"
                            value=""
                            onChange={e => {
                              if (e.target.value) updateItem(item.id, 'frequency', e.target.value);
                            }}
                            className="px-2 py-1 text-[11px] bg-blue-50 hover:bg-blue-100 border border-blue-300 rounded-lg text-blue-900 font-bold cursor-pointer outline-hidden shrink-0 max-w-[115px]"
                            title="Escolher entre todas as opções de posologia e horários"
                          >
                            <option value="">Opções ▾</option>
                            {INPATIENT_POSOLOGY_GROUPS.map(group => (
                              <optgroup key={group.label} label={group.label}>
                                {group.options.map(opt => (
                                  <option key={opt} value={opt}>
                                    {opt}
                                  </option>
                                ))}
                              </optgroup>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                          Aprazamento / Horário (Opcional)
                        </label>
                        <div className="flex gap-1">
                          <input
                            type="text"
                            value={item.schedule || ''}
                            onChange={e => updateItem(item.id, 'schedule', e.target.value)}
                            placeholder="Ex: 08h - 20h (ou em branco)"
                            className={SMALL_INPUT_CLASS}
                          />
                          <select
                            aria-label="Sugestões de horários"
                            value=""
                            onChange={e => {
                              if (e.target.value) updateItem(item.id, 'schedule', e.target.value);
                            }}
                            className="px-1.5 py-1 text-[11px] bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg text-slate-700 font-semibold cursor-pointer outline-hidden shrink-0"
                            title="Sugestões de aprazamento"
                          >
                            <option value="">▾</option>
                            {INPATIENT_SCHEDULE_OPTIONS.map(s => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Quick-click Posology / Hour buttons so any medication (Ceftriaxona, etc.) can be adjusted with 1 click */}
                    <div className="mt-2 flex items-center gap-1 flex-wrap">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mr-1">
                        Posologia rápida:
                      </span>
                      {INPATIENT_QUICK_POSOLOGIES.map(pos => {
                        const isSelected = item.frequency.trim().toLowerCase() === pos.toLowerCase();
                        return (
                          <button
                            key={pos}
                            type="button"
                            onClick={() => updateItem(item.id, 'frequency', pos)}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold border transition-all ${
                              isSelected
                                ? 'bg-blue-700 text-white border-blue-700 shadow-2xs'
                                : 'bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-800 border-slate-200'
                            }`}
                          >
                            {pos}
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-2">
                      <input
                        type="text"
                        value={item.notes || ''}
                        onChange={e => updateItem(item.id, 'notes', e.target.value)}
                        placeholder="Observações / diluição / esquema complementar (ex: diluir em 100 mL SF 0,9%, correr em 30 min)"
                        className="w-full px-2.5 py-1 text-[11px] bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:ring-1 focus:ring-blue-600 outline-hidden text-slate-600"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
      <ProtocolosHospitalaresModal
        isOpen={showProtocolosModal}
        onClose={() => setShowProtocolosModal(false)}
        onApplyProtocolo={handleApplyProtocolo}
      />
    </div>
  );
};
