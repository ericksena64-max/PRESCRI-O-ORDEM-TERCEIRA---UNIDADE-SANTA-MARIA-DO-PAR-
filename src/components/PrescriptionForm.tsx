import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  AlertTriangle,
  Sparkles,
  Info,
  Check,
  Baby,
  Scale,
  UserRound,
  UserPlus,
  Pill
} from 'lucide-react';
import { PrescriptionItem, PrescriptionType, PatientInfo, Medication } from '../types';
import { DrugDatabaseSearch } from './DrugDatabaseSearch';
import { PediatricDosageCalculator } from './PediatricDosageCalculator';
import { CidSearchAutocomplete } from './CidSearchAutocomplete';

interface PrescriptionFormProps {
  prescriptionType: PrescriptionType;
  setPrescriptionType: (t: PrescriptionType) => void;
  patient: PatientInfo;
  setPatient: React.Dispatch<React.SetStateAction<PatientInfo>>;
  items: PrescriptionItem[];
  setItems: React.Dispatch<React.SetStateAction<PrescriptionItem[]>>;
  generalRecommendations: string;
  setGeneralRecommendations: (s: string) => void;
  date: string;
  setDate: (d: string) => void;
  diagnosticCid?: { code: string; description: string };
  setDiagnosticCid?: (cid?: { code: string; description: string }) => void;
  onNewPatient?: () => void;
}

const POSOLOGY_SHORTCUTS = [
  'Tomar 1 comprimido por via oral a cada 6 horas em caso de dor ou febre.',
  'Tomar 1 comprimido por via oral a cada 8 horas por 5 dias.',
  'Tomar 1 comprimido por via oral a cada 12 horas por 7 dias.',
  'Tomar 1 comprimido por via oral pela manhã em jejum de uso contínuo.',
  'Tomar 1 cápsula por via oral 1 vez ao dia à noite ao deitar.'
];

const RECOMMENDATION_CHIPS = [
  'Manter repouso relativo e evitar esforços físicos intensos.',
  'Ingerir líquidos em abundância (mínimo de 2 a 3 litros de água ao dia).',
  'Alimentação leve e fracionada, evitando alimentos gordurosos e ultraprocessados.',
  'Retornar ao pronto atendimento ou consultório em caso de febre persistente, dispneia ou piora clínica.',
  'Evitar automedicação concomitante durante o tratamento.'
];

export const PrescriptionForm: React.FC<PrescriptionFormProps> = ({
  prescriptionType,
  setPrescriptionType,
  patient,
  setPatient,
  items,
  setItems,
  generalRecommendations,
  setGeneralRecommendations,
  date,
  setDate,
  diagnosticCid,
  setDiagnosticCid,
  onNewPatient
}) => {
  const [showPediatricCalc, setShowPediatricCalc] = useState(false);

  // Add medication from database or API autocomplete
  const handleSelectMedication = (med: Medication) => {
    const newItem: PrescriptionItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      medicationName: med.name,
      presentation: med.defaultPresentation,
      quantity: '1 caixa',
      route: med.defaultRoute,
      posology: med.defaultPosology,
      instructions: med.instructions || '',
      type: med.type,
      controlledCategory: med.controlledCategory
    };

    setItems(prev => [...prev, newItem]);

    // Auto-adjust prescription type if user selected a controlled or antimicrobial item
    if (med.type === 'controle_especial' && prescriptionType !== 'controle_especial') {
      setPrescriptionType('controle_especial');
    } else if (med.type === 'antimicrobiano' && prescriptionType === 'simples') {
      setPrescriptionType('antimicrobiano');
    }
  };

  const handleInsertPediatricItem = (item: PrescriptionItem) => {
    setItems(prev => [...prev, item]);
    if (item.type === 'controle_especial' && prescriptionType !== 'controle_especial') {
      setPrescriptionType('controle_especial');
    } else if (item.type === 'antimicrobiano' && prescriptionType === 'simples') {
      setPrescriptionType('antimicrobiano');
    }
  };

  // Add custom empty item
  const handleAddCustom = (name?: string) => {
    const newItem: PrescriptionItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      medicationName: name || '',
      presentation: 'Comprimidos / Frasco',
      quantity: '1 caixa',
      route: 'Uso oral',
      posology: 'Tomar 1 comprimido por via oral a cada 8 horas...',
      instructions: '',
      type: 'simples'
    };
    setItems(prev => [...prev, newItem]);
  };

  const handleUpdateItem = (id: string, field: keyof PrescriptionItem, value: any) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const handleRemoveItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    setItems(prev => {
      const arr = [...prev];
      const temp = arr[index - 1];
      arr[index - 1] = arr[index];
      arr[index] = temp;
      return arr;
    });
  };

  const handleMoveDown = (index: number) => {
    if (index === items.length - 1) return;
    setItems(prev => {
      const arr = [...prev];
      const temp = arr[index + 1];
      arr[index + 1] = arr[index];
      arr[index] = temp;
      return arr;
    });
  };

  const hasControlledItem = items.some(i => i.type === 'controle_especial');
  const hasAntimicrobialItem = items.some(i => i.type === 'antimicrobiano');

  return (
    <div className="space-y-6">
      {/* Patient Card */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
        <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-4 flex items-center justify-between flex-wrap gap-2">
          <span className="flex items-center gap-2.5">
            <span className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-sky-500 text-white flex items-center justify-center shadow-xs">
              <UserRound className="w-4 h-4" strokeWidth={2.25} />
            </span>
            <span>Dados do Paciente & Emissão</span>
          </span>
          <div className="flex items-center gap-2">
            {onNewPatient && (
              <button
                type="button"
                onClick={onNewPatient}
                title="Limpar todos os dados do paciente atual para iniciar novo atendimento"
                className="text-xs font-bold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all normal-case tracking-normal cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Novo Paciente</span>
              </button>
            )}
          </div>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6">
            <label htmlFor="patient-name" className="block text-xs font-semibold text-slate-600 mb-1">
              Nome Completo do Paciente *
            </label>
            <input
              id="patient-name"
              type="text"
              value={patient.name}
              onChange={e => setPatient({ ...patient, name: e.target.value })}
              placeholder="Ex: Nome Completo do Paciente"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-hidden font-medium"
            />
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="patient-doc" className="block text-xs font-semibold text-slate-600 mb-1">
              CPF ou RG
            </label>
            <input
              id="patient-doc"
              type="text"
              value={patient.document}
              onChange={e => setPatient({ ...patient, document: e.target.value })}
              placeholder="000.000.000-00"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-hidden"
            />
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="prescription-date" className="block text-xs font-semibold text-slate-600 mb-1">
              Data de Emissão
            </label>
            <input
              id="prescription-date"
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-hidden"
            />
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="patient-age" className="block text-xs font-semibold text-slate-600 mb-1">
              Idade
            </label>
            <input
              id="patient-age"
              type="text"
              value={patient.age || ''}
              onChange={e => setPatient({ ...patient, age: e.target.value })}
              placeholder="Ex: 4 anos"
              className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-blue-600 outline-hidden"
            />
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="patient-weight" className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1 text-blue-900">
              <Scale className="w-3.5 h-3.5" />
              <span>Peso Corporal (kg)</span>
            </label>
            <input
              id="patient-weight"
              type="number"
              min={1}
              max={150}
              step={0.5}
              value={patient.weight || ''}
              onChange={e => setPatient({ ...patient, weight: parseFloat(e.target.value) || '' })}
              placeholder="Ex: 14"
              className="w-full px-3 py-1.5 border border-blue-300 bg-blue-50/30 rounded-lg text-xs font-bold text-blue-950 focus:bg-white focus:ring-1 focus:ring-blue-600 outline-hidden"
            />
          </div>

          <div className="sm:col-span-6 flex items-end">
            <button
              type="button"
              onClick={() => setShowPediatricCalc(!showPediatricCalc)}
              className="w-full py-1.5 px-3 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Baby className="w-4 h-4 text-blue-700" />
              <span>{showPediatricCalc ? 'Ocultar Calculadora Pediátrica' : '🍼 Abrir Calculadora de Doses por Peso'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Pediatric Dosage Calculator (When opened) */}
      {showPediatricCalc && (
        <PediatricDosageCalculator
          initialWeight={patient.weight ? parseFloat(String(patient.weight)) : 12}
          onWeightChange={w => setPatient(p => ({ ...p, weight: w }))}
          onInsertPrescriptionItem={handleInsertPediatricItem}
        />
      )}

      {/* Prescription Type Selector */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
        <label className="block text-xs font-semibold text-slate-600 mb-2">
          Modalidade do Receituário:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setPrescriptionType('simples')}
            className={`p-3 rounded-lg border text-left transition-all ${
              prescriptionType === 'simples'
                ? 'border-blue-700 bg-blue-50/70 text-blue-950 shadow-xs ring-1 ring-blue-700'
                : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="font-semibold text-xs flex items-center justify-between">
              <span>Receituário Simples</span>
              {prescriptionType === 'simples' && <Check className="w-4 h-4 text-blue-700" />}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Uso geral (AINEs, analgésicos, anti-hipertensivos, xaropes)</p>
          </button>

          <button
            type="button"
            onClick={() => setPrescriptionType('antimicrobiano')}
            className={`p-3 rounded-lg border text-left transition-all ${
              prescriptionType === 'antimicrobiano'
                ? 'border-blue-700 bg-blue-50/70 text-blue-950 shadow-xs ring-1 ring-blue-700'
                : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="font-semibold text-xs flex items-center justify-between">
              <span>Antimicrobianos (2 Vias)</span>
              {prescriptionType === 'antimicrobiano' && <Check className="w-4 h-4 text-blue-700" />}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">RDC 20/2011 Anvisa (Amoxicilina, Azitromicina, Ciprofloxacino)</p>
          </button>

          <button
            type="button"
            onClick={() => setPrescriptionType('controle_especial')}
            className={`p-3 rounded-lg border text-left transition-all ${
              prescriptionType === 'controle_especial'
                ? 'border-amber-600 bg-amber-50/70 text-amber-900 shadow-xs ring-1 ring-amber-600'
                : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="font-semibold text-xs flex items-center justify-between">
              <span>Controle Especial (C1/B1)</span>
              {prescriptionType === 'controle_especial' && <Check className="w-4 h-4 text-amber-600" />}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Portaria 344/98 (Psicotrópicos, Antidepressivos, Ansiolíticos)</p>
          </button>
        </div>

        {hasControlledItem && prescriptionType !== 'controle_especial' && (
          <div className="mt-3 p-2.5 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2 text-xs text-amber-800">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Há medicamentos controlados na lista. Recomendado alternar para <strong>Controle Especial (2 Vias)</strong>.</span>
            <button
              onClick={() => setPrescriptionType('controle_especial')}
              className="ml-auto underline font-bold hover:text-amber-950"
            >
              Ativar
            </button>
          </div>
        )}

        {hasAntimicrobialItem && prescriptionType === 'simples' && !hasControlledItem && (
          <div className="mt-3 p-2.5 bg-sky-50 border border-sky-200 rounded-lg flex items-center gap-2 text-xs text-sky-900">
            <AlertTriangle className="w-4 h-4 text-sky-600 shrink-0" />
            <span>Há antimicrobianos na lista. Recomendado alternar para <strong>Antimicrobianos (RDC 20/2011 - 2 Vias)</strong>.</span>
            <button
              onClick={() => setPrescriptionType('antimicrobiano')}
              className="ml-auto underline font-bold hover:text-sky-950"
            >
              Ativar
            </button>
          </div>
        )}
      </div>

      {/* Autocomplete Medication Search via Public Health API & Local Database */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs relative">
        <DrugDatabaseSearch
          onSelectMedication={handleSelectMedication}
          onAddCustom={handleAddCustom}
        />
      </div>

      {/* Prescription Items List */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider flex items-center gap-2.5">
            <span className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-sky-500 text-white flex items-center justify-center shadow-xs">
              <Pill className="w-4 h-4" strokeWidth={2.25} />
            </span>
            <span>Itens Prescritos ({items.length})</span>
          </h2>
          <button
            type="button"
            onClick={() => handleAddCustom()}
            className="text-xs px-3 py-1.5 bg-gradient-to-r from-blue-600 to-sky-500 text-white hover:from-blue-500 hover:to-sky-400 rounded-lg font-semibold flex items-center gap-1.5 shadow-xs transition-all"
          >
            <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
            Adicionar Medicamento
          </button>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-10 px-4 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">Nenhum medicamento na prescrição</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Utilize o campo de busca acima para autocompletar e adicionar itens com posologias sugeridas.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 hover:bg-slate-50 hover:border-slate-300 transition-all relative group"
              >
                {/* Header of Item */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="w-6 h-6 rounded-full bg-blue-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <input
                      type="text"
                      value={item.medicationName}
                      onChange={e => handleUpdateItem(item.id, 'medicationName', e.target.value)}
                      placeholder="Nome do Medicamento e Dosagem"
                      className="font-bold text-slate-900 text-sm bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-600 focus:bg-white px-1 py-0.5 rounded-sm outline-hidden flex-1"
                    />
                    {item.type === 'controle_especial' && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-amber-100 text-amber-800 font-semibold shrink-0">
                        Controle Especial
                      </span>
                    )}
                    {item.type === 'antimicrobiano' && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-blue-100 text-blue-800 font-semibold shrink-0">
                        Antimicrobiano
                      </span>
                    )}
                  </div>

                  {/* Actions (Reorder & Remove) */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      title="Mover para cima"
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded-sm"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveDown(index)}
                      disabled={index === items.length - 1}
                      title="Mover para baixo"
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded-sm"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      title="Remover medicamento"
                      className="p-1 text-red-400 hover:text-red-600 rounded-sm transition-colors ml-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Subfields: Apresentação, Quantidade, Via */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 mb-3">
                  <div className="sm:col-span-5">
                    <label className="block text-[11px] font-semibold text-slate-500 mb-0.5">
                      Apresentação / Forma
                    </label>
                    <input
                      type="text"
                      value={item.presentation}
                      onChange={e => handleUpdateItem(item.id, 'presentation', e.target.value)}
                      placeholder="Ex: 500mg - Comprimidos (caixa com 20)"
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-600 outline-hidden"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-[11px] font-semibold text-slate-500 mb-0.5">
                      Quantidade
                    </label>
                    <input
                      type="text"
                      value={item.quantity}
                      onChange={e => handleUpdateItem(item.id, 'quantity', e.target.value)}
                      placeholder="Ex: 1 caixa / 2 frascos"
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-600 outline-hidden"
                    />
                  </div>

                  <div className="sm:col-span-4">
                    <label className="block text-[11px] font-semibold text-slate-500 mb-0.5">
                      Via de Administração
                    </label>
                    <select
                      value={item.route}
                      onChange={e => handleUpdateItem(item.id, 'route', e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-600 outline-hidden"
                    >
                      <option value="Uso oral">Uso oral</option>
                      <option value="Uso tópico">Uso tópico</option>
                      <option value="Inalação oral">Inalação oral</option>
                      <option value="Uso nasal">Uso nasal</option>
                      <option value="Uso oftálmico">Uso oftálmico</option>
                      <option value="Uso otológico">Uso otológico</option>
                      <option value="Uso sublingual">Uso sublingual</option>
                      <option value="Uso intramuscular">Uso intramuscular</option>
                      <option value="Uso subcutâneo">Uso subcutâneo</option>
                      <option value="Uso retal">Uso retal</option>
                    </select>
                  </div>
                </div>

                {/* Posologia Textarea */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-semibold text-slate-600">
                      Posologia e Modo de Usar *
                    </label>
                    <span className="text-[10px] text-slate-400">Instruções claras para o paciente</span>
                  </div>
                  <textarea
                    rows={2}
                    value={item.posology}
                    onChange={e => handleUpdateItem(item.id, 'posology', e.target.value)}
                    placeholder="Instruções de horário, dosagem e duração..."
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-600 outline-hidden resize-none font-medium text-slate-800"
                  />
                </div>

                {/* Quick posology suggestions chips */}
                <div className="mt-2 flex flex-wrap items-center gap-1">
                  <span className="text-[10px] text-slate-400 mr-1">Atalhos rápidos:</span>
                  {POSOLOGY_SHORTCUTS.map((pos, pIdx) => (
                    <button
                      key={pIdx}
                      type="button"
                      onClick={() => handleUpdateItem(item.id, 'posology', pos)}
                      className="text-[10px] px-2 py-0.5 rounded-sm bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-600 hover:text-blue-700 transition-colors"
                    >
                      {pos.split(' ')[2]} {pos.split(' ')[3]} {pos.split(' ')[4] || ''}
                    </button>
                  ))}
                </div>

                {/* Instructions / Observations */}
                <div className="mt-2">
                  <input
                    type="text"
                    value={item.instructions || ''}
                    onChange={e => handleUpdateItem(item.id, 'instructions', e.target.value)}
                    placeholder="Orientações adicionais (opcional, ex: Ingerir com água, após refeições)"
                    className="w-full px-2.5 py-1 text-[11px] bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:ring-1 focus:ring-blue-600 outline-hidden text-slate-600"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* General & Non-pharmacological Recommendations */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="general-recommendations" className="text-sm font-semibold text-slate-800 flex items-center gap-2.5">
            <span className="h-7 w-7 rounded-lg bg-blue-50 text-blue-700 border border-blue-200/80 flex items-center justify-center shadow-2xs">
              <Info className="w-4 h-4" strokeWidth={2.25} />
            </span>
            <span>Orientações Gerais / Não Farmacológicas</span>
          </label>
          <span className="text-xs text-slate-400">Repouso, hidratação, dieta, retorno</span>
        </div>

        <textarea
          id="general-recommendations"
          rows={3}
          value={generalRecommendations}
          onChange={e => setGeneralRecommendations(e.target.value)}
          placeholder="Ex: Ingerir no mínimo 2 a 3 litros de água ao dia. Manter repouso relativo..."
          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-hidden resize-none text-slate-700"
        />

        <div className="mt-2 flex flex-wrap gap-1.5">
          {RECOMMENDATION_CHIPS.map((chip, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                if (generalRecommendations.includes(chip)) return;
                setGeneralRecommendations(
                  generalRecommendations ? `${generalRecommendations}\n• ${chip}` : `• ${chip}`
                );
              }}
              className="text-[11px] px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
            >
              + {chip.slice(0, 32)}...
            </button>
          ))}
        </div>
      </div>

      {/* Smart CID-10 Diagnosis Search (Optional diagnostic indication on prescription) */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs relative">
        <CidSearchAutocomplete
          selectedCidCode={diagnosticCid?.code}
          selectedCidDescription={diagnosticCid?.description}
          onSelectCid={cid => setDiagnosticCid?.({ code: cid.code, description: cid.description })}
          onClearCid={() => setDiagnosticCid?.(undefined)}
          label="Diagnóstico Clínico / CID-10 na Prescrição (Opcional)"
          descriptionHint="Agiliza dispensação de medicamentos e justificativas clínicas"
          showQuickPresets={true}
          placeholder="Buscar CID-10 para a prescrição (ex: J06, amigdalite, hipertensão, diabetes, lombalgia)..."
        />
      </div>
    </div>
  );
};
