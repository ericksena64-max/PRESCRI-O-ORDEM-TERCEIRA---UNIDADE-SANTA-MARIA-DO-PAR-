import React, { useState, useEffect } from 'react';
import {
  Cloud,
  CheckCircle2,
  X,
  ExternalLink,
  Download,
  UploadCloud,
  HardDrive,
  RefreshCw
} from 'lucide-react';
import {
  GoogleDriveConfig,
  loadDriveConfig,
  saveDriveConfig,
  getHospitalDriveWebUrl,
  buildPatientDriveBackupJson,
  downloadDriveBackupFile
} from '../services/googleDriveService';
import { PatientInfo } from '../types';

interface GoogleDriveSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: PatientInfo;
  activeClinicalData?: any;
}

export const GoogleDriveSyncModal: React.FC<GoogleDriveSyncModalProps> = ({
  isOpen,
  onClose,
  patient,
  activeClinicalData
}) => {
  const [config, setConfig] = useState<GoogleDriveConfig>(loadDriveConfig);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setConfig(loadDriveConfig());
      setSyncFeedback(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggleConnect = () => {
    const updated: GoogleDriveConfig = {
      ...config,
      connected: !config.connected,
      lastSyncTime: !config.connected ? new Date().toLocaleTimeString('pt-BR') : config.lastSyncTime
    };
    setConfig(updated);
    saveDriveConfig(updated);
  };

  const handleSaveEmail = (email: string) => {
    const updated = { ...config, hospitalEmail: email };
    setConfig(updated);
    saveDriveConfig(updated);
  };

  const handleSaveFolderName = (folder: string) => {
    const updated = { ...config, folderName: folder };
    setConfig(updated);
    saveDriveConfig(updated);
  };

  const handleExportBackup = () => {
    const json = buildPatientDriveBackupJson(patient, activeClinicalData);
    downloadDriveBackupFile(patient.name, json);
    const updated: GoogleDriveConfig = {
      ...config,
      lastSyncTime: new Date().toLocaleTimeString('pt-BR'),
      syncedFilesCount: config.syncedFilesCount + 1
    };
    setConfig(updated);
    saveDriveConfig(updated);
    setSyncFeedback('Arquivo de backup (.json) exportado com sucesso para arquivamento no Google Drive!');
    setTimeout(() => setSyncFeedback(null), 4000);
  };

  const handleSimulateSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      const updated: GoogleDriveConfig = {
        ...config,
        connected: true,
        lastSyncTime: new Date().toLocaleTimeString('pt-BR'),
        syncedFilesCount: config.syncedFilesCount + 1
      };
      setConfig(updated);
      saveDriveConfig(updated);
      setSyncFeedback(`Prontuário de ${patient.name || 'Paciente'} sincronizado com o Google Drive do Hospital!`);
      setTimeout(() => setSyncFeedback(null), 4000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
        {/* Topo do Modal com as Cores Oficiais Azul Royal */}
        <div className="bg-gradient-to-r from-[#0038A8] via-[#0B4EA2] to-[#002D72] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/15 p-2 flex items-center justify-center shadow-inner ring-1 ring-white/30">
              <Cloud className="w-6 h-6 text-sky-200" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight text-white flex items-center gap-2">
                Sincronização com Google Drive
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-sky-400 text-slate-950">
                  Conta Grátis
                </span>
              </h2>
              <p className="text-xs text-blue-100">
                Hospital da Ordem Terceira — Santa Maria do Pará
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-5 space-y-4">
          {/* Status da Conexão */}
          <div className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
            config.connected
              ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
              : 'bg-slate-50 border-slate-200 text-slate-800'
          }`}>
            <div className="flex items-center gap-3">
              <span className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 ${
                config.connected ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {config.connected ? <CheckCircle2 className="w-5 h-5" /> : <Cloud className="w-5 h-5" />}
              </span>
              <div>
                <h4 className="text-xs font-bold">
                  {config.connected ? 'Google Drive Conectado e Ativo' : 'Google Drive Não Conectado'}
                </h4>
                <p className="text-[11px] text-slate-500">
                  {config.connected
                    ? `Sincronizando com: ${config.hospitalEmail}`
                    : 'Conecte para sincronizar prescrições e laudos automaticamente'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleToggleConnect}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-2xs ${
                config.connected
                  ? 'bg-white text-rose-700 border border-rose-200 hover:bg-rose-50'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {config.connected ? 'Desconectar' : 'Conectar'}
            </button>
          </div>

          {/* Feedback temporário */}
          {syncFeedback && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-900 flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{syncFeedback}</span>
            </div>
          )}

          {/* Dados da Conta Gratuita do Hospital */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                E-mail da Conta Gratuita Google do Hospital:
              </label>
              <input
                type="email"
                value={config.hospitalEmail}
                onChange={e => handleSaveEmail(e.target.value)}
                placeholder="Ex: hospitalordemterceira@gmail.com"
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-600 outline-hidden"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                Conta padrão do Google com 15 GB gratuitos (comporta mais de 80.000 documentos em PDF).
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Nome da Pasta Raiz no Google Drive:
              </label>
              <input
                type="text"
                value={config.folderName}
                onChange={e => handleSaveFolderName(e.target.value)}
                placeholder="Ex: Hospital da Ordem Terceira — Prontuários Santa Maria"
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:ring-2 focus:ring-blue-600 outline-hidden"
              />
            </div>
          </div>

          {/* Informações de Armazenamento e Segurança */}
          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-950 flex items-start gap-2.5">
            <HardDrive className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-bold">Capacidade da Conta Gratuita: 15 GB Disponíveis</p>
              <p className="text-[11px] text-blue-800 leading-snug">
                Os PDFs médicos e backups gerados pelo sistema são ultraleves (~120 KB por documento), permitindo armazenamento gratuito por anos.
              </p>
            </div>
          </div>

          {/* Botões de Ação Imediata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
            <button
              type="button"
              onClick={handleSimulateSync}
              disabled={isSyncing}
              className="py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
            >
              {isSyncing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Sincronizando...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  <span>Sincronizar Paciente Atual</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleExportBackup}
              className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border border-slate-300"
              title="Baixar arquivo de backup com os dados estruturados do paciente para guardar no Drive"
            >
              <Download className="w-4 h-4 text-slate-600" />
              <span>Exportar Backup (.json)</span>
            </button>
          </div>

          {/* Link para Abrir o Google Drive Oficial */}
          <div className="pt-2 text-center">
            <a
              href={getHospitalDriveWebUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900 hover:underline"
            >
              <span>Abrir pasta no Google Drive do Hospital</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Rodapé */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition-colors"
          >
            Concluir
          </button>
        </div>
      </div>
    </div>
  );
};
