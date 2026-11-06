import React, { useState } from 'react';
import {
  X,
  Zap,
  Check,
  ChevronDown,
  ChevronUp,
  Stethoscope,
  Search,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { PROTOCOLOS_HOSPITALARES, ProtocoloHospitalar } from '../data/protocolosHospitalares';

interface ProtocolosHospitalaresModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyProtocolo: (protocolo: ProtocoloHospitalar, modo: 'substituir' | 'mesclar') => void;
}

export const ProtocolosHospitalaresModal: React.FC<ProtocolosHospitalaresModalProps> = ({
  isOpen,
  onClose,
  onApplyProtocolo
}) => {
  const [busca, setBusca] = useState('');
  const [protocoloExpandido, setProtocoloExpandido] = useState<string | null>(PROTOCOLOS_HOSPITALARES[0].id);
  const [modoAplicacao, setModoAplicacao] = useState<'substituir' | 'mesclar'>('substituir');

  if (!isOpen) return null;

  const protocolosFiltrados = PROTOCOLOS_HOSPITALARES.filter(p => {
    const termo = busca.toLowerCase().trim();
    if (!termo) return true;
    return (
      p.titulo.toLowerCase().includes(termo) ||
      p.subtitulo.toLowerCase().includes(termo) ||
      p.especialidade.toLowerCase().includes(termo) ||
      p.cid10Sugerido.code.toLowerCase().includes(termo) ||
      p.cid10Sugerido.description.toLowerCase().includes(termo) ||
      p.itens.some(i => i.name.toLowerCase().includes(termo))
    );
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center shadow-md">
              <Zap className="w-5 h-5 fill-white" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                <span>Protocolos Clínicos Hospitalares (1 Clique)</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-amber-950">
                  Alta Agilidade
                </span>
              </h2>
              <p className="text-xs text-blue-200/90 mt-0.5">
                Modelos completos organizados na ordem clínica padrão (1 Dieta a 7 Demais Cuidados)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar: Search + Mode Switch */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={busca}
              onChange={e => setBusca(e.target.value)}
              placeholder="Buscar por patologia, antibiótico, CID-10 ou especialidade..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-hidden font-medium"
            />
          </div>

          <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-300 text-xs font-semibold">
            <span className="text-[11px] text-slate-500 px-2 font-bold uppercase tracking-wider">Ação:</span>
            <button
              type="button"
              onClick={() => setModoAplicacao('substituir')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                modoAplicacao === 'substituir'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Substituir Prescrição
            </button>
            <button
              type="button"
              onClick={() => setModoAplicacao('mesclar')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                modoAplicacao === 'mesclar'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Adicionar aos Itens Existentes
            </button>
          </div>
        </div>

        {/* Protocols List */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {protocolosFiltrados.length === 0 ? (
            <div className="text-center py-12 px-4 text-slate-400">
              <Stethoscope className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-semibold">Nenhum protocolo encontrado para &quot;{busca}&quot;</p>
              <p className="text-xs mt-1">Tente buscar por &apos;Pneumonia&apos;, &apos;IC&apos;, &apos;Sepse&apos;, &apos;AVC&apos; ou &apos;Cirurgia&apos;.</p>
            </div>
          ) : (
            protocolosFiltrados.map(protocolo => {
              const isExpanded = protocoloExpandido === protocolo.id;
              return (
                <div
                  key={protocolo.id}
                  className={`rounded-xl border transition-all ${
                    isExpanded
                      ? 'border-blue-500 bg-white shadow-sm ring-1 ring-blue-500/20'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="p-4 flex items-start justify-between gap-3 flex-wrap sm:flex-nowrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide border ${protocolo.badgeCor}`}>
                          {protocolo.especialidade}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200/80 text-slate-800 font-mono">
                          CID: {protocolo.cid10Sugerido.code}
                        </span>
                        <span className="text-[11px] font-bold text-slate-500">
                          {protocolo.itens.length} itens clínicos
                        </span>
                      </div>
                      <h3 className="font-extrabold text-sm sm:text-base text-slate-900 leading-snug">
                        {protocolo.titulo}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {protocolo.subtitulo}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <button
                        type="button"
                        onClick={() => setProtocoloExpandido(isExpanded ? null : protocolo.id)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <span>{isExpanded ? 'Ocultar itens' : 'Ver itens'}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onApplyProtocolo(protocolo, modoAplicacao);
                          onClose();
                        }}
                        className="px-4 py-1.5 rounded-lg text-xs font-extrabold bg-blue-600 hover:bg-blue-700 text-white shadow-xs hover:shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Check className="w-4 h-4 stroke-[2.5]" />
                        <span>Aplicar Protocolo</span>
                      </button>
                    </div>
                  </div>

                  {/* Expanded Items Preview */}
                  {isExpanded && (
                    <div className="border-t border-slate-100 bg-slate-50/70 p-4 rounded-b-xl space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                        <span>Ordem Clínica do Protocolo:</span>
                        <span className="text-blue-700 font-normal normal-case">
                          Atualiza diagnóstico para: <strong>{protocolo.diagnosticoSugerido}</strong> ({protocolo.cid10Sugerido.code})
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {protocolo.itens.map((item, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs shadow-2xs flex items-start gap-2"
                          >
                            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-extrabold flex items-center justify-center shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-slate-900 truncate">{item.name}</p>
                              <p className="text-[11px] text-slate-500">
                                {[item.dose, item.route, item.frequency].filter(Boolean).join(' • ')}
                                {item.diaAtual && ` • D${item.diaAtual}/${item.diaTotal || '?'}`}
                              </p>
                              {item.notes && (
                                <p className="text-[10px] text-slate-400 italic truncate mt-0.5">
                                  {item.notes}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100/80 border-t border-slate-200 flex items-center justify-between shrink-0 text-xs text-slate-600">
          <span className="flex items-center gap-1.5 font-medium">
            <Sparkles className="w-4 h-4 text-amber-500" />
            7 protocolos baseados no FAST-HUG e diretrizes médicas hospitalares.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
