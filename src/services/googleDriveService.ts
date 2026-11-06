import { getTodayIso } from '../utils/dateUtils';

/**
 * Serviço de Integração e Sincronização com o Google Drive do Hospital
 * Compatível com Contas Gratuitas do Google (@gmail.com / 15 GB gratuitos) e Google Workspace
 */

export interface GoogleDriveConfig {
  connected: boolean;
  hospitalEmail: string;
  folderName: string;
  autoSyncOnSave: boolean;
  lastSyncTime?: string;
  syncedFilesCount: number;
}

const DRIVE_CONFIG_STORAGE_KEY = 'ordem_terceira_gdrive_config';

export const DEFAULT_DRIVE_CONFIG: GoogleDriveConfig = {
  connected: false,
  hospitalEmail: 'hospitalordemterceira@gmail.com',
  folderName: 'Hospital da Ordem Terceira — Prontuários Santa Maria',
  autoSyncOnSave: true,
  syncedFilesCount: 0
};

export function loadDriveConfig(): GoogleDriveConfig {
  try {
    const raw = localStorage.getItem(DRIVE_CONFIG_STORAGE_KEY);
    if (!raw) return DEFAULT_DRIVE_CONFIG;
    return { ...DEFAULT_DRIVE_CONFIG, ...JSON.parse(raw) };
  } catch (err) {
    return DEFAULT_DRIVE_CONFIG;
  }
}

export function saveDriveConfig(config: GoogleDriveConfig): void {
  try {
    localStorage.setItem(DRIVE_CONFIG_STORAGE_KEY, JSON.stringify(config));
  } catch (err) {
    console.warn('Erro ao salvar configuração do Google Drive:', err);
  }
}

/**
 * Gera o link direto para o Google Drive da conta do hospital
 */
export function getHospitalDriveWebUrl(): string {
  return 'https://drive.google.com/drive/my-drive';
}

/**
 * Cria o pacote de exportação em JSON estruturado para backup no Google Drive
 */
export function buildPatientDriveBackupJson(patient: any, clinicalData: any): string {
  const backup = {
    instituicao: 'Hospital da Ordem Terceira — Santa Maria do Pará',
    exportadoEm: new Date().toISOString(),
    paciente: {
      nome: patient.name,
      documento: patient.document,
      leito: patient.bed,
      enfermaria: patient.ward,
      idade: patient.age,
      peso: patient.weight
    },
    dadosClinicos: clinicalData
  };
  return JSON.stringify(backup, null, 2);
}

/**
 * Faz download do arquivo de backup JSON do paciente para envio imediato ao Drive
 */
export function downloadDriveBackupFile(patientName: string, jsonData: string): void {
  const safeName = (patientName || 'Paciente').replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `PRONTUARIO_${safeName}_${getTodayIso()}.json`;
  const blob = new Blob([jsonData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
