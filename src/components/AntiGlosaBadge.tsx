import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon, Info, ArrowRight } from 'lucide-react';
import { validarCompatibilidadeSigtap } from '../utils/sigtapAntiGlosaValidator';

interface AntiGlosaBadgeProps {
  codigoProcedimento?: string;
  nomeProcedimento?: string;
  cid10?: string;
  instrumento?: 'APAC' | 'AIH';
  onApplySuggestedCid?: (cid: { code: string; description: string }) => void;
}

export const AntiGlosaBadge: React.FC<AntiGlosaBadgeProps> = ({
  codigoProcedimento = '',
  nomeProcedimento = '',
  cid10 = '',
  instrumento = 'APAC',
  onApplySuggestedCid
}) => {
  const result = validarCompatibilidadeSigtap(
    codigoProcedimento,
    nomeProcedimento,
    cid10,
    instrumento
  );

  if (result.status === 'NEUTRO') {
    return (
      <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-500">
        <Info className="w-4 h-4 text-slate-400 shrink-0" />
        <span>{result.mensagem}</span>
      </div>
    );
  }

  if (result.status === 'COMPATIVEL') {
    return (
      <div className="p-3 rounded-xl bg-emerald-50/90 border border-emerald-200/90 text-emerald-950 shadow-xs transition-all">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 font-bold text-xs text-emerald-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{result.titulo}</span>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-200/70 text-emerald-900 border border-emerald-300">
            SIGTAP 2026 OK
          </span>
        </div>
        <p className="text-xs text-emerald-700/90 mt-1 leading-relaxed">
          {result.mensagem}
        </p>
      </div>
    );
  }

  if (result.status === 'ALERTA') {
    return (
      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 shadow-xs">
        <div className="flex items-center gap-2 font-bold text-xs text-amber-800">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{result.titulo}</span>
        </div>
        <p className="text-xs text-amber-800/90 mt-1 leading-relaxed">
          {result.mensagem}
        </p>
      </div>
    );
  }

  // INCOMPATIVEL
  return (
    <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-300 text-rose-950 shadow-xs">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 font-extrabold text-xs text-rose-800">
          <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{result.titulo}</span>
        </div>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-200 text-rose-900 border border-rose-300">
          Risco de Devolução
        </span>
      </div>
      <p className="text-xs text-rose-800 mt-1.5 leading-relaxed font-medium">
        {result.mensagem}
      </p>

      {result.sugestoesCid && result.sugestoesCid.length > 0 && onApplySuggestedCid && (
        <div className="mt-2.5 pt-2 border-t border-rose-200/80">
          <span className="text-[11px] font-bold text-rose-900 block mb-1.5">
            CIDs compatíveis sugeridos pelo DATASUS:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {result.sugestoesCid.map(sug => (
              <button
                key={sug.code}
                type="button"
                onClick={() => onApplySuggestedCid(sug)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white hover:bg-rose-100 text-rose-900 border border-rose-300 shadow-2xs transition-colors cursor-pointer"
                title={sug.description}
              >
                <span className="font-mono font-bold text-rose-700">{sug.code}</span>
                <span className="text-[11px] truncate max-w-[200px]">{sug.description}</span>
                <ArrowRight className="w-3 h-3 text-rose-500" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
