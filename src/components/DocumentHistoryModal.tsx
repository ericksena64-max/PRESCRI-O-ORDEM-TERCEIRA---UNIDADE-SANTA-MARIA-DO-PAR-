import React from 'react';
import { X, History, Trash2, Clock, FileText, Pill, BedDouble } from 'lucide-react';
import { DocumentHistoryItem } from '../types';

interface DocumentHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: DocumentHistoryItem[];
  onClearHistory: () => void;
}

export const DocumentHistoryModal: React.FC<DocumentHistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onClearHistory
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-5 py-4 bg-gradient-to-r from-[#071326] via-[#0b1e3b] to-[#0d274c] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-gradient-to-br from-blue-600 to-sky-500 text-white shadow-sm ring-1 ring-sky-300/40">
              <History className="w-4 h-4" strokeWidth={2.25} />
            </span>
            <h2 className="font-bold text-sm">Histórico de Atendimentos Recentes</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-300 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 max-h-96 overflow-y-auto divide-y divide-slate-100">
          {history.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">
              <History className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p>Nenhum documento emitido nesta sessão.</p>
              <p className="text-slate-400 mt-1">Ao imprimir ou baixar PDF, o registro aparecerá aqui.</p>
            </div>
          ) : (
            history.map(item => (
              <div key={item.id} className="py-3 flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-blue-600 to-sky-500 text-white shadow-xs mt-0.5">
                    {item.type === 'prescricao' && <Pill className="w-4 h-4" strokeWidth={2.25} />}
                    {item.type === 'atestado' && <FileText className="w-4 h-4" strokeWidth={2.25} />}
                    {item.type === 'declaracao' && <Clock className="w-4 h-4" strokeWidth={2.25} />}
                    {item.type === 'internacao' && <BedDouble className="w-4 h-4" strokeWidth={2.25} />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{item.patientName}</p>
                    <p className="text-xs text-slate-600">{item.summary}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{item.createdAt}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {history.length > 0 && (
          <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
            <button
              onClick={onClearHistory}
              className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1 font-medium"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Limpar Histórico
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-700 transition-colors"
            >
              Fechar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
