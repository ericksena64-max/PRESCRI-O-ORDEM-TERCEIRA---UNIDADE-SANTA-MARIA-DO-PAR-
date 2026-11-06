import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Search, Plus, ShieldAlert, HelpCircle } from 'lucide-react';
import { FastHugCategory, HospitalMedication } from '../types';
import { searchHospitalMedications } from '../data/hospitalMedications';

interface HospitalMedicationPickerProps {
  category: FastHugCategory;
  placeholder?: string;
  onSelect: (medication: HospitalMedication) => void;
  onAddCustom: (name: string) => void;
}

export const HospitalMedicationPicker: React.FC<HospitalMedicationPickerProps> = ({
  category,
  placeholder = 'Buscar no banco hospitalar...',
  onSelect,
  onAddCustom
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const results = useMemo(() => searchHospitalMedications(category, query), [category, query]);

  // Agrupa preservando a ordem de aparição dos subgrupos
  const grouped = useMemo(() => {
    const map = new Map<string, HospitalMedication[]>();
    results.forEach(med => {
      const list = map.get(med.group) || [];
      list.push(med);
      map.set(med.group, list);
    });
    return Array.from(map.entries());
  }, [results]);

  const handleSelect = (med: HospitalMedication) => {
    onSelect(med);
    setQuery('');
    setIsOpen(false);
  };

  const handleCustom = () => {
    onAddCustom(query.trim());
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={e => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-9 pr-24 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-hidden bg-slate-50/60 focus:bg-white transition-all"
        />
        <button
          type="button"
          onClick={handleCustom}
          className="absolute right-1.5 top-1.5 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold rounded-lg border border-slate-300 transition-colors flex items-center gap-1"
          title="Adicionar item avulso (texto livre)"
        >
          <Plus className="w-3 h-3" />
          Avulso
        </button>
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-2xl z-40 max-h-80 overflow-y-auto">
          <div className="p-2 bg-slate-50 flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider sticky top-0 border-b border-slate-100">
            <span>Sugestões hospitalares ({results.length})</span>
            <span className="normal-case font-medium text-slate-400">Clique para adicionar</span>
          </div>

          {results.length === 0 ? (
            <div className="p-5 text-center text-xs text-slate-500">
              <HelpCircle className="w-7 h-7 text-slate-300 mx-auto mb-1.5" />
              <p className="font-semibold text-slate-700">Nada encontrado para "{query}"</p>
              <button
                type="button"
                onClick={handleCustom}
                className="mt-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors"
              >
                Adicionar "{query}" como item avulso
              </button>
            </div>
          ) : (
            grouped.map(([group, meds]) => (
              <div key={group}>
                <div className="px-3 py-1 bg-blue-50/60 text-[10px] font-bold text-blue-900 uppercase tracking-wider border-y border-blue-100/70">
                  {group}
                </div>
                {meds.map(med => (
                  <button
                    key={med.id}
                    type="button"
                    onClick={() => handleSelect(med)}
                    className="w-full text-left px-3 py-2 hover:bg-blue-50 transition-colors flex items-start justify-between gap-3 group border-b border-slate-50 last:border-b-0"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-bold text-slate-900 group-hover:text-blue-800">{med.name}</span>
                        {med.controlled && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-sm bg-amber-100 text-amber-800 font-bold border border-amber-300 flex items-center gap-0.5">
                            <ShieldAlert className="w-2.5 h-2.5" />
                            Controlado
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {[med.dose, med.route, med.frequency].filter(Boolean).join(' • ') || 'Prescrição de enfermagem / cuidado'}
                      </p>
                    </div>
                    <span className="shrink-0 mt-0.5 p-1 rounded-md bg-blue-50 text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Plus className="w-3.5 h-3.5" />
                    </span>
                  </button>
                ))}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
