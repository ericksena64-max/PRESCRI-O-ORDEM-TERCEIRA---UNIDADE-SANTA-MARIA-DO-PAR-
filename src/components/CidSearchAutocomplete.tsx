import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Shield, Sparkles } from 'lucide-react';
import { CidItem } from '../types';
import { CID10_DATABASE, COMMON_DIAGNOSTIC_PRESETS } from '../data/cid10';
import { searchCid10 } from '../utils/documentLogic';

interface CidSearchAutocompleteProps {
  selectedCidCode?: string;
  selectedCidDescription?: string;
  onSelectCid: (cid: { code: string; description: string; category?: string }) => void;
  onClearCid: () => void;
  label?: string;
  descriptionHint?: string;
  showQuickPresets?: boolean;
  required?: boolean;
  placeholder?: string;
}

export const CidSearchAutocomplete: React.FC<CidSearchAutocompleteProps> = ({
  selectedCidCode = '',
  selectedCidDescription = '',
  onSelectCid,
  onClearCid,
  label = 'Classificação Internacional de Doenças (CID-10)',
  descriptionHint = 'Busque por código CID ou nome clínico da patologia',
  showQuickPresets = true,
  required = false,
  placeholder = 'Buscar CID-10 por código ou doença (ex: J06, gripe, lombalgia, gastrite, cefaleia, HAS)...'
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<CidItem[]>([]);
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

  // Filter CID-10 matches
  useEffect(() => {
    if (query.trim().length > 0) {
      setResults(searchCid10(query, 12));
    } else {
      setResults(CID10_DATABASE.slice(0, 10));
    }
  }, [query]);

  const handleSelect = (item: { code: string; description: string; category?: string }) => {
    onSelectCid(item);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="space-y-2.5">
      {/* Label and description header */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <span className="h-7 w-7 rounded-lg bg-gradient-to-br from-blue-600 to-sky-500 text-white flex items-center justify-center shadow-xs">
            <Shield className="w-3.5 h-3.5" strokeWidth={2.25} />
          </span>
          <span>{label} {required && <span className="text-red-500">*</span>}</span>
        </label>
        {descriptionHint && (
          <span className="text-[11px] text-slate-400 hidden sm:inline-block">
            {descriptionHint}
          </span>
        )}
      </div>

      {/* Selected Diagnosis Banner if already chosen */}
      {selectedCidCode ? (
        <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-xl flex items-center justify-between shadow-2xs animate-in fade-in duration-150">
          <div className="flex items-start sm:items-center gap-2.5">
            <span className="px-2.5 py-1 bg-blue-700 text-white font-black text-xs rounded-lg tracking-wide shrink-0 shadow-xs">
              CID {selectedCidCode}
            </span>
            <span className="text-xs font-semibold text-blue-950 leading-snug">
              {selectedCidDescription}
            </span>
          </div>

          <button
            type="button"
            onClick={onClearCid}
            className="text-xs text-red-600 hover:text-red-800 hover:bg-red-50 p-1.5 rounded-lg font-medium transition-colors ml-2 shrink-0 flex items-center gap-1"
            title="Remover diagnóstico"
          >
            <X className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Remover</span>
          </button>
        </div>
      ) : (
        /* Autocomplete Search Input Bar */
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                if (results.length > 0) {
                  handleSelect(results[0]);
                }
              }
            }}
            placeholder={placeholder}
            className="w-full pl-10 pr-20 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-hidden bg-slate-50/60 focus:bg-white transition-all"
          />

          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-3 top-2 text-xs text-slate-400 hover:text-slate-600 px-1 py-0.5"
            >
              Limpar
            </button>
          )}

          {/* Autocomplete Dropdown */}
          {isOpen && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 max-h-64 overflow-y-auto divide-y divide-slate-100 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="p-2 bg-slate-50 flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <span>Diagnósticos CID-10 ({results.length})</span>
                <span>Selecione para preencher</span>
              </div>

              {results.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400">
                  <p className="mb-2">Nenhum código ou patologia encontrada para "{query}".</p>
                  <button
                    type="button"
                    onClick={() => handleSelect({
                      code: 'A49.9',
                      description: query.trim(),
                      category: 'Personalizado'
                    })}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors"
                  >
                    Usar "{query}" como diagnóstico (CID A49.9)
                  </button>
                </div>
              ) : (
                <>
                  {results.map(item => (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => handleSelect(item)}
                      className="w-full text-left p-2.5 hover:bg-blue-50 text-xs transition-colors flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <span className="font-bold text-blue-700 bg-blue-50 group-hover:bg-white px-2 py-0.5 rounded-md border border-blue-200 shrink-0">
                          {item.code}
                        </span>
                        <span className="text-slate-800 font-medium group-hover:text-blue-950">
                          {item.description}
                        </span>
                      </div>
                      <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-500 shrink-0">
                        {item.category}
                      </span>
                    </button>
                  ))}
                  {query.trim().length > 0 && !results.some(r => r.description.toLowerCase() === query.trim().toLowerCase()) && (
                    <div className="p-2 bg-slate-50 border-t border-slate-200">
                      <button
                        type="button"
                        onClick={() => handleSelect({
                          code: 'A49.9',
                          description: query.trim(),
                          category: 'Personalizado'
                        })}
                        className="w-full text-left px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-between"
                      >
                        <span>Usar "{query.trim()}" (Infecção / Diagnóstico Livre)</span>
                        <span className="text-[10px] opacity-90 font-mono">CID A49.9</span>
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Quick Diagnostic Presets (1-click common outpatient diagnoses) */}
      {showQuickPresets && !selectedCidCode && (
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <Sparkles className="w-3 h-3 text-blue-600" />
            <span className="text-[11px] font-semibold text-slate-500">
              Diagnósticos padrão frequentes (1 clique):
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {COMMON_DIAGNOSTIC_PRESETS.map(preset => (
              <button
                key={preset.code}
                type="button"
                onClick={() => handleSelect(preset)}
                className="text-[11px] px-2.5 py-1 bg-white hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 border border-slate-200 rounded-lg text-slate-700 transition-all font-medium flex items-center gap-1.5 shadow-2xs"
                title={`${preset.code} - ${preset.description}`}
              >
                <span className="font-bold text-blue-800 text-[10px]">{preset.code}</span>
                <span>{preset.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
