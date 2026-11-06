import React, { useState } from 'react';
import { WifiOff, X } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  const [dismissed, setDismissed] = useState(false);

  if (isOnline || dismissed) return null;

  return (
    <aside
      aria-label="Notificação de status offline"
      className="fixed bottom-4 left-4 right-4 sm:right-auto sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-2 duration-300"
    >
      <div className="bg-slate-900/95 backdrop-blur-md text-white p-3.5 rounded-xl shadow-2xl border border-amber-500/40 flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
            <WifiOff className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-amber-400">Modo Offline Ativo</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              <span className="text-[10px] text-slate-400">Rede do hospital oscilando</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
              Você pode continuar prescrevendo normalmente. Todas as funções (busca de medicamentos, CID-10, cálculos de dosagem e impressão A4) continuam funcionando sem internet.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="p-1 text-slate-400 hover:text-white rounded-md transition-colors"
          title="Fechar aviso"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
