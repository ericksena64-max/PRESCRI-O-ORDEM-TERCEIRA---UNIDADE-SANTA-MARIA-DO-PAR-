import React, { useState } from 'react';
import {
  Baby,
  Plus,
  Check,
  AlertTriangle,
  Scale,
  Search,
  Clock
} from 'lucide-react';
import { PEDIATRIC_DRUG_RULES, searchPediatricDrugs } from '../data/pediatricRules';
import { PrescriptionItem, PrescriptionType } from '../types';

interface PediatricDosageCalculatorProps {
  initialWeight?: number;
  onInsertPrescriptionItem: (item: PrescriptionItem) => void;
  onWeightChange?: (weight: number) => void;
}

const COMMON_WEIGHTS = [5, 8, 10, 12, 14, 16, 18, 20, 25, 30];

export const PediatricDosageCalculator: React.FC<PediatricDosageCalculatorProps> = ({
  initialWeight = 12,
  onInsertPrescriptionItem,
  onWeightChange
}) => {
  const [weight, setWeight] = useState<number>(initialWeight);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRuleId, setSelectedRuleId] = useState<string>('ped-dipirona-gotas');
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  const selectedRule = PEDIATRIC_DRUG_RULES.find(r => r.id === selectedRuleId) || PEDIATRIC_DRUG_RULES[0];

  const handleWeightChange = (newWeight: number) => {
    const val = Math.max(1, Math.min(120, parseFloat(newWeight.toFixed(1))));
    setWeight(val);
    if (onWeightChange) {
      onWeightChange(val);
    }
  };

  const filteredRules = searchPediatricDrugs(searchTerm);
  const calculation = selectedRule.calculateDose(weight);

  const handleInsert = () => {
    let type: PrescriptionType = 'simples';
    if (selectedRule.category === 'antibiotico') {
      type = 'antimicrobiano';
    }

    const newItem: PrescriptionItem = {
      id: `ped-item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      medicationName: selectedRule.name,
      presentation: selectedRule.presentation,
      quantity: '1 frasco',
      route: selectedRule.route,
      posology: calculation.posologyText,
      instructions: `${calculation.instructions} (Calculado para paciente pediátrico de ${weight} kg)`,
      type
    };

    onInsertPrescriptionItem(newItem);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 1200);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50/80 via-sky-50/40 to-white rounded-2xl p-5 border border-blue-200 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-blue-100">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-blue-700 text-white flex items-center justify-center shadow-xs">
            <Baby className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 tracking-tight flex items-center gap-1.5">
              <span>Calculadora de Dosagem Pediátrica</span>
              <span className="text-[10px] bg-blue-100 text-blue-900 font-bold px-2 py-0.5 rounded-full">
                mg/kg & gotas
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Cálculo preciso e seguro baseado no peso do paciente pediátrico
            </p>
          </div>
        </div>
      </div>

      {/* Weight Controls */}
      <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <label htmlFor="pediatric-weight-input" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Scale className="w-4 h-4 text-blue-700" />
            <span>Peso da Criança (kg):</span>
          </label>

          {/* Stepper & input */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleWeightChange(weight - 1)}
              className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 flex items-center justify-center text-sm transition-colors"
              title="Diminuir 1 kg"
            >
              -1
            </button>

            <div className="relative">
              <input
                id="pediatric-weight-input"
                type="number"
                min={1}
                max={90}
                step={0.5}
                value={weight}
                onChange={e => handleWeightChange(parseFloat(e.target.value) || 1)}
                className="w-24 text-center py-1.5 px-2 bg-slate-50 border border-slate-300 rounded-lg font-black text-slate-900 text-base focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
              />
              <span className="absolute right-2 top-2 text-xs font-bold text-slate-400 pointer-events-none">kg</span>
            </div>

            <button
              type="button"
              onClick={() => handleWeightChange(weight + 1)}
              className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 flex items-center justify-center text-sm transition-colors"
              title="Aumentar 1 kg"
            >
              +1
            </button>
          </div>
        </div>

        {/* Quick weight chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] text-slate-400 font-medium mr-1">Pesos comuns:</span>
          {COMMON_WEIGHTS.map(w => (
            <button
              key={w}
              type="button"
              onClick={() => handleWeightChange(w)}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                weight === w
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600'
              }`}
            >
              {w} kg
            </button>
          ))}
        </div>
      </div>

      {/* Medication Selector & Search */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700">
            Selecione o Medicamento Pediátrico:
          </label>
          <span className="text-[11px] text-slate-400">{filteredRules.length} medicamentos</span>
        </div>

        {/* Search filter input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Filtrar por nome (ex: Dipirona, Amox, Prednisolona, Berotec, Vonau)..."
            className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-blue-600 outline-hidden"
          />
        </div>

        {/* Horizontal scroll chips of pediatric medications */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-40 overflow-y-auto p-1 bg-white/70 rounded-xl border border-slate-200">
          {filteredRules.map(rule => (
            <button
              key={rule.id}
              type="button"
              onClick={() => setSelectedRuleId(rule.id)}
              className={`p-2 rounded-lg text-left text-xs transition-all border ${
                selectedRuleId === rule.id
                  ? 'bg-blue-700 text-white font-bold border-blue-700 shadow-xs'
                  : 'bg-white hover:bg-blue-50 text-slate-800 border-slate-200 hover:border-blue-300'
              }`}
            >
              <div className="truncate">{rule.name}</div>
              <div className={`text-[10px] mt-0.5 truncate ${selectedRuleId === rule.id ? 'text-blue-100' : 'text-slate-400'}`}>
                {rule.presentation.split('-')[0]}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Calculation Result Card */}
      <div className="bg-white rounded-xl p-4 border-2 border-blue-600 shadow-md space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-extrabold text-sm text-slate-900">{selectedRule.name}</span>
              <span className="text-[10px] bg-blue-100 text-blue-900 font-bold px-2 py-0.5 rounded-full">
                {selectedRule.concentration}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{selectedRule.presentation}</p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Dose Calculada:</span>
            <div className="text-lg font-black text-blue-700 leading-tight">
              {calculation.calculatedValue} {calculation.unit}
            </div>
          </div>
        </div>

        {/* Warning if any */}
        {calculation.warning && (
          <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>{calculation.warning}</span>
          </div>
        )}

        {/* Ready Posology Preview */}
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-800 space-y-1">
          <p className="font-bold text-blue-950 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-700" />
            Posologia Sugerida:
          </p>
          <p className="leading-relaxed font-semibold text-slate-900">
            {calculation.posologyText}
          </p>
          <p className="text-[11px] text-slate-500 italic pt-1 border-t border-slate-200">
            {calculation.instructions}
          </p>
        </div>

        {/* Action Button: Insert in Prescription */}
        <button
          type="button"
          onClick={handleInsert}
          className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-700/20 flex items-center justify-center gap-2"
        >
          {copiedSuccess ? (
            <>
              <Check className="w-4 h-4 text-emerald-200" />
              <span>Inserido na Prescrição com Sucesso!</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>Inserir Medicamento Pediátrico na Prescrição</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
