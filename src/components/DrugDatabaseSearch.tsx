import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Plus,
  ShieldAlert,
  Database,
  Loader2,
  HelpCircle,
  Pill
} from 'lucide-react';
import { Medication } from '../types';
import {
  fetchDrugsFromPublicApi,
  convertApiDrugToMedication,
  ApiDrugSuggestion
} from '../services/drugApiService';
import { searchMedications } from '../utils/documentLogic';
import { MEDICATIONS_DATABASE } from '../data/medications';

interface DrugDatabaseSearchProps {
  onSelectMedication: (medication: Medication) => void;
  onAddCustom?: (name: string) => void;
}

const POPULAR_QUICK_SEARCHES = [
  'Dipirona',
  'Amoxicilina',
  'Ibuprofeno',
  'Omeprazol',
  'Azitromicina',
  'Sertralina',
  'Ciprofloxacino',
  'Losartana',
  'Prednisona',
  'Ondansetrona',
  'Benzetacil',
  'Dexametasona'
];

export const DrugDatabaseSearch: React.FC<DrugDatabaseSearchProps> = ({
  onSelectMedication,
  onAddCustom
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoadingApi, setIsLoadingApi] = useState(false);
  const [apiSuggestions, setApiSuggestions] = useState<ApiDrugSuggestion[]>([]);
  const [localMatches, setLocalMatches] = useState<Medication[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search local database immediately + debounce fetch from Public Health API
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setLocalMatches(MEDICATIONS_DATABASE.slice(0, 10));
      setApiSuggestions([]);
      setIsLoadingApi(false);
      return;
    }

    // 1. Instant local match
    const local = searchMedications(trimmed, 10);
    setLocalMatches(local);

    // 2. Debounced query to Public Health API (OpenFDA / NIH)
    setIsLoadingApi(true);
    let cancelled = false; // evita que uma resposta antiga sobrescreva a busca mais recente
    const timeoutId = setTimeout(async () => {
      try {
        const apiResults = await fetchDrugsFromPublicApi(trimmed);
        if (!cancelled) setApiSuggestions(apiResults);
      } catch (e) {
        console.warn('API de medicamentos offline ou sem resultados', e);
      } finally {
        if (!cancelled) setIsLoadingApi(false);
      }
    }, 350);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [query]);

  // Handle selecting a local medication
  const handleSelectLocal = (med: Medication) => {
    onSelectMedication(med);
    setQuery('');
    setIsOpen(false);
  };

  // Handle selecting an API medication
  const handleSelectApiDrug = (apiDrug: ApiDrugSuggestion) => {
    const med = convertApiDrugToMedication(apiDrug);
    onSelectMedication(med);
    setQuery('');
    setIsOpen(false);
  };

  const handleCustomAdd = () => {
    if (onAddCustom && query.trim()) {
      onAddCustom(query.trim());
      setQuery('');
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="flex items-center justify-between mb-2">
        <label htmlFor="drug-database-search-input" className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
          <span className="h-7 w-7 rounded-lg bg-gradient-to-br from-blue-600 to-sky-500 text-white flex items-center justify-center shadow-xs">
            <Database className="w-3.5 h-3.5" strokeWidth={2.25} />
          </span>
          <span>Autocompletar Inteligente de Medicamentos</span>
        </label>
        <span className="text-[11px] font-semibold text-blue-900 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
          OpenFDA & Farmacopeia
        </span>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <div className="absolute left-3.5 top-3 text-slate-400">
          {isLoadingApi ? (
            <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </div>

        <input
          id="drug-database-search-input"
          type="text"
          value={query}
          onChange={e => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Busque por princípio ativo, marca ou dosagem (ex: Amoxicilina, Dipirona, Ibuprofeno, Sertralina)..."
          className="w-full pl-10 pr-24 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-hidden bg-slate-50/60 focus:bg-white transition-all shadow-inner"
        />

        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-20 top-2.5 text-xs text-slate-400 hover:text-slate-600 px-1 py-0.5"
          >
            Limpar
          </button>
        )}

        {onAddCustom && query.trim().length > 0 && (
          <button
            type="button"
            onClick={handleCustomAdd}
            className="absolute right-2 top-2 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors border border-slate-300"
          >
            + Avulso
          </button>
        )}
      </div>

      {/* Status indicator when API is loading */}
      {isLoadingApi && (
        <div className="mt-1 flex items-center gap-1.5 text-[11px] text-blue-800 font-medium px-1">
          <Loader2 className="w-3 h-3 animate-spin" />
          <span>Consultando base pública OpenFDA e checando contraindicações...</span>
        </div>
      )}

      {/* Dropdown Suggestions List */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto divide-y divide-slate-100 animate-in fade-in slide-in-from-top-1 duration-150">
          {/* Header */}
          <div className="p-2.5 bg-slate-50 flex items-center justify-between text-[11px] font-bold text-slate-600">
            <span>SUGESTÕES DE MEDICAMENTOS, DOSAGENS E CONTRAINDICAÇÕES</span>
            <span>{isLoadingApi ? 'Atualizando...' : `${localMatches.length + apiSuggestions.length} resultados`}</span>
          </div>

          {/* 1. Real-time Public Health API Results (OpenFDA) */}
          {apiSuggestions.length > 0 && (
            <div className="p-2 bg-blue-50/30 border-b border-blue-100">
              <div className="px-2 py-1 text-[11px] font-bold text-blue-950 flex items-center gap-1.5 uppercase tracking-wider">
                <Database className="w-3.5 h-3.5 text-blue-600" />
                <span>Resultados da API Pública de Saúde (OpenFDA / NIH):</span>
              </div>

              <div className="space-y-2 mt-1">
                {apiSuggestions.map(drug => (
                  <div
                    key={drug.id}
                    className="p-3 bg-white rounded-lg border border-blue-200 hover:border-blue-400 hover:shadow-xs transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-slate-900">{drug.name}</span>
                          <span className="text-[10px] bg-blue-100 text-blue-900 font-bold px-2 py-0.5 rounded-full border border-blue-200">
                            Base Pública FDA
                          </span>
                          <span className="text-[10px] bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded-full">
                            {drug.route}
                          </span>
                        </div>

                        {drug.dosageForm && (
                          <p className="text-xs text-slate-500 mt-0.5 font-medium">
                            Apresentação: {drug.dosageForm}
                          </p>
                        )}

                        {/* Dosage guidance */}
                        <div className="mt-2 text-xs text-slate-700 bg-slate-50 p-2 rounded-md border border-slate-100">
                          <span className="font-bold text-blue-900">Dosagem Sugerida:</span> {drug.suggestedDosage}
                        </div>

                        {/* Real-time Contraindications Warning */}
                        {drug.contraindications.length > 0 && (
                          <div className="mt-2 p-2 bg-amber-50 rounded-md border border-amber-200">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-1">
                              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                              <span>Contraindicações Clínicas Relevantes:</span>
                            </div>
                            <ul className="text-[11px] text-amber-950 space-y-0.5 list-disc list-inside">
                              {drug.contraindications.map((ci, cIdx) => (
                                <li key={cIdx} className="leading-snug">{ci}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Add button */}
                      <button
                        type="button"
                        onClick={() => handleSelectApiDrug(drug)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1 shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Adicionar</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. Brazilian Local Database Matches */}
          {localMatches.length > 0 && (
            <div className="p-2 space-y-1">
              <div className="px-2 py-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Pill className="w-3.5 h-3.5 text-slate-400" />
                <span>Farmacopeia Brasileira & Prescrições Frequentes:</span>
              </div>

              {localMatches.map(med => (
                <div
                  key={med.id}
                  onClick={() => handleSelectLocal(med)}
                  className="p-2.5 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors flex items-start justify-between gap-3 group border border-transparent hover:border-slate-200"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-slate-900 group-hover:text-blue-700">
                        {med.name}
                      </span>
                      {med.type === 'controle_especial' && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded-sm bg-amber-100 text-amber-800 font-semibold border border-amber-300">
                          Controle Especial
                        </span>
                      )}
                      {med.type === 'antimicrobiano' && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded-sm bg-blue-100 text-blue-800 font-semibold border border-blue-300">
                          Antimicrobiano
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                      <span>{med.class}</span>
                      {med.brandName && <span className="text-slate-400">• Marca: {med.brandName}</span>}
                    </div>
                    <p className="text-xs text-slate-700 mt-1 bg-slate-50 p-1.5 rounded-md border border-slate-100">
                      <strong className="text-slate-900">Posologia padrão:</strong> {med.defaultPosology}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectLocal(med);
                    }}
                    className="mt-1 px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md text-xs font-semibold flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Adicionar</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {apiSuggestions.length === 0 && localMatches.length === 0 && !isLoadingApi && (
            <div className="p-6 text-center text-sm text-slate-500">
              <HelpCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="font-semibold text-slate-700">Nenhum resultado para "{query}"</p>
              <p className="text-xs text-slate-400 mt-1">
                Tente buscar pelo nome em inglês (ex: "Amoxicillin") ou utilize a inclusão manual:
              </p>
              {onAddCustom && (
                <button
                  type="button"
                  onClick={handleCustomAdd}
                  className="mt-3 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors"
                >
                  Adicionar "{query}" como medicamento avulso
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Quick Search Chips */}
      <div className="mt-3">
        <p className="text-xs text-slate-500 mb-1.5 font-medium">Princípios ativos frequentes para consulta rápida:</p>
        <div className="flex flex-wrap gap-1.5">
          {POPULAR_QUICK_SEARCHES.map(chipName => (
            <button
              key={chipName}
              type="button"
              onClick={() => {
                setQuery(chipName);
                setIsOpen(true);
              }}
              className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 border border-slate-200 rounded-md text-xs text-slate-700 transition-all font-medium flex items-center gap-1"
            >
              <Plus className="w-3 h-3 text-slate-400" />
              {chipName}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
