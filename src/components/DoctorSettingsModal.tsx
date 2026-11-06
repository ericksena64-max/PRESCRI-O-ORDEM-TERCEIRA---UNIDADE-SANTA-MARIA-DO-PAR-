import React, { useRef, useState, useEffect } from 'react';
import {
  X,
  Save,
  Building,
  User,
  PenTool,
  RotateCcw,
  Check,
  Stethoscope,
  Sparkles,
  CreditCard
} from 'lucide-react';
import { DoctorProfile } from '../types';
import { DEMO_PRESET_PROFILES, saveDoctorProfileToStorage } from '../data/defaultData';
import { validateDoctorProfile } from '../utils/documentLogic';
import { formatCpfMask, updateDoctorDocumentPreference } from '../services/doctorAuthService';

interface DoctorSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: DoctorProfile;
  setDoctor: (d: DoctorProfile) => void;
}

const BRAZILIAN_UFS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

export const DoctorSettingsModal: React.FC<DoctorSettingsModalProps> = ({
  isOpen,
  onClose,
  doctor,
  setDoctor
}) => {
  const [formData, setFormData] = useState<DoctorProfile>(doctor);
  const [errors, setErrors] = useState<string[]>([]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Digital signature canvas
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData(doctor);
      setErrors([]);
      setSavedSuccess(false);
    }
  }, [isOpen, doctor]);

  // Load existing signature onto canvas if present
  useEffect(() => {
    if (isOpen && formData.digitalSignatureUrl && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const img = new Image();
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
        };
        img.src = formData.digitalSignatureUrl;
      }
    }
  }, [isOpen, formData.digitalSignatureUrl]);

  if (!isOpen) return null;

  // Canvas drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      setFormData(prev => ({
        ...prev,
        digitalSignatureUrl: dataUrl,
        signatureStyle: 'digital_drawn'
      }));
    }
  };

  const clearSignature = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
    setFormData(prev => ({
      ...prev,
      digitalSignatureUrl: undefined,
      signatureStyle: 'classic_stamp'
    }));
  };

  const handleApplyPreset = (preset: DoctorProfile) => {
    setFormData(preset);
  };

  const handleSave = () => {
    const validation = validateDoctorProfile(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setDoctor(formData);
    saveDoctorProfileToStorage(formData);
    if (formData.crm && formData.documentType) {
      updateDoctorDocumentPreference({
        crm: formData.crm,
        documentType: formData.documentType,
        documentNumber: formData.documentType === 'CNS' ? (formData.cns || '') : (formData.cpf || '')
      });
    }
    setSavedSuccess(true);
    setErrors([]);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#071326] via-[#0b1e3b] to-[#0d274c] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-blue-600 to-sky-500 text-white rounded-xl shadow-md ring-1 ring-sky-300/40">
              <Stethoscope className="w-5 h-5" strokeWidth={2.25} />
            </div>
            <div>
              <h2 className="font-bold text-base">Personalização do Médico & Local de Atendimento</h2>
              <p className="text-xs text-blue-200/80">Configure seus dados para o cabeçalho, rodapé e carimbo de todos os documentos</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Quick presets */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-blue-700" />
              <span className="text-xs font-semibold text-slate-700">Carregar perfil pré-configurado da Ordem Terceira:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {DEMO_PRESET_PROFILES.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(p.profile)}
                  className="text-xs px-2.5 py-1 bg-white hover:bg-blue-50 border border-slate-300 hover:border-blue-400 text-slate-700 hover:text-blue-900 rounded-md transition-all font-medium"
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {errors.length > 0 && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 space-y-1">
              {errors.map((err, i) => (
                <p key={i}>• {err}</p>
              ))}
            </div>
          )}

          {/* Dados do Médico */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 text-blue-900 border-b border-slate-100 pb-2">
              <span className="h-6 w-6 rounded-lg bg-gradient-to-br from-blue-600 to-sky-500 text-white flex items-center justify-center shadow-2xs">
                <User className="w-3.5 h-3.5" strokeWidth={2.25} />
              </span>
              <span>1. Identificação Profissional do Médico</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-7">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nome Completo do Médico *
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Ex: Dr. Carlos Eduardo Mendonça"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-600 outline-hidden"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  CRM *
                </label>
                <input
                  type="text"
                  value={formData.crm}
                  onChange={e => setFormData({ ...formData, crm: e.target.value })}
                  placeholder="148.920"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-600 outline-hidden"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  UF *
                </label>
                <select
                  value={formData.uf}
                  onChange={e => setFormData({ ...formData, uf: e.target.value })}
                  className="w-full px-2 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-600 outline-hidden"
                >
                  {BRAZILIAN_UFS.map(uf => (
                    <option key={uf} value={uf}>{uf}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-7">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Especialidade Médica
                </label>
                <input
                  type="text"
                  value={formData.specialty}
                  onChange={e => setFormData({ ...formData, specialty: e.target.value })}
                  placeholder="Ex: Clínica Médica & Emergências Pediátricas"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-600 outline-hidden"
                />
              </div>

              <div className="sm:col-span-5">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  RQE (Opcional)
                </label>
                <input
                  type="text"
                  value={formData.rqe || ''}
                  onChange={e => setFormData({ ...formData, rqe: e.target.value })}
                  placeholder="Ex: RQE nº 54.892"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-600 outline-hidden"
                />
              </div>

              {/* Documento Fixo para Laudos SUS (APAC / AIH) */}
              <div className="sm:col-span-12 p-3 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-blue-700" />
                    Documento Fixo para Laudos SUS (APAC e AIH)
                  </span>
                  <span className="text-[10px] font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                    Preencher apenas uma vez
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Escolha se deseja utilizar seu <strong>CNS (Cartão SUS)</strong> ou <strong>CPF</strong> nos laudos do SUS. O número preenchido ficará fixo na sua conta e será usado automaticamente nos campos 43/44 da APAC e da AIH.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
                  <div className="sm:col-span-4">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Documento Preferencial *
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, documentType: 'CNS' })}
                        className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                          formData.documentType === 'CNS'
                            ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        CNS
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, documentType: 'CPF' })}
                        className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                          formData.documentType === 'CPF'
                            ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        CPF
                      </button>
                    </div>
                  </div>

                  <div className="sm:col-span-4">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      CNS do Médico (15 dígitos)
                    </label>
                    <input
                      type="text"
                      maxLength={15}
                      value={formData.cns || ''}
                      onChange={e => setFormData({ ...formData, cns: e.target.value.replace(/\D/g, '').slice(0, 15) })}
                      placeholder="Ex: 700000000000000"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-mono font-medium focus:ring-2 focus:ring-blue-600 outline-hidden bg-white"
                    />
                  </div>

                  <div className="sm:col-span-4">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      CPF do Médico (11 dígitos)
                    </label>
                    <input
                      type="text"
                      maxLength={14}
                      value={formData.cpf || ''}
                      onChange={e => setFormData({ ...formData, cpf: formatCpfMask(e.target.value) })}
                      placeholder="000.000.000-00"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-mono font-medium focus:ring-2 focus:ring-blue-600 outline-hidden bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-6">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  WhatsApp / Celular Médico
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(91) 98765-4321"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-600 outline-hidden"
                />
              </div>

              <div className="sm:col-span-6">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  E-mail do Médico
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="medico@ordemterceira.org.br"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-600 outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Local de Atendimento */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 text-blue-900 border-b border-slate-100 pb-2">
              <span className="h-6 w-6 rounded-lg bg-gradient-to-br from-blue-600 to-sky-500 text-white flex items-center justify-center shadow-2xs">
                <Building className="w-3.5 h-3.5" strokeWidth={2.25} />
              </span>
              <span>2. Local de Atendimento & Endereço</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-7">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nome da Unidade / Hospital
                </label>
                <input
                  type="text"
                  value={formData.clinicName}
                  onChange={e => setFormData({ ...formData, clinicName: e.target.value })}
                  placeholder="Ex: Hospital Ordem Terceira"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-600 outline-hidden"
                />
              </div>

              <div className="sm:col-span-5">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Telefone da Recepção
                </label>
                <input
                  type="text"
                  value={formData.clinicPhone}
                  onChange={e => setFormData({ ...formData, clinicPhone: e.target.value })}
                  placeholder="(91) 8814-1247"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-600 outline-hidden"
                />
              </div>

              <div className="sm:col-span-7">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Razão Social da Instituição
                </label>
                <input
                  type="text"
                  value={formData.razaoSocial || ''}
                  onChange={e => setFormData({ ...formData, razaoSocial: e.target.value })}
                  placeholder="Venerável Ordem Terceira de São Francisco"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-600 outline-hidden"
                />
              </div>

              <div className="sm:col-span-5">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  CNPJ (Filial)
                </label>
                <input
                  type="text"
                  value={formData.cnpj || ''}
                  onChange={e => setFormData({ ...formData, cnpj: e.target.value })}
                  placeholder="04.935.409/0002-31"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-600 outline-hidden"
                />
              </div>

              <div className="sm:col-span-12">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Endereço Completo (Rua, Número, Sala/Andar, Bairro)
                </label>
                <input
                  type="text"
                  value={formData.clinicAddress}
                  onChange={e => setFormData({ ...formData, clinicAddress: e.target.value })}
                  placeholder="Travessa Frei Gil de Vila Nova, s/n - Campina"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-600 outline-hidden"
                />
              </div>

              <div className="sm:col-span-8">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Cidade - UF
                </label>
                <input
                  type="text"
                  value={formData.clinicCityState}
                  onChange={e => setFormData({ ...formData, clinicCityState: e.target.value })}
                  placeholder="Santa Maria do Pará - PA"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-600 outline-hidden"
                />
              </div>

              <div className="sm:col-span-4">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  CEP
                </label>
                <input
                  type="text"
                  value={formData.clinicCep}
                  onChange={e => setFormData({ ...formData, clinicCep: e.target.value })}
                  placeholder="66015-180"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-600 outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Carimbo & Assinatura Digital */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 text-blue-900">
                <span className="h-6 w-6 rounded-lg bg-gradient-to-br from-blue-600 to-sky-500 text-white flex items-center justify-center shadow-2xs">
                  <PenTool className="w-3.5 h-3.5" strokeWidth={2.25} />
                </span>
                <span>3. Assinatura Digital & Carimbo Médico</span>
              </h3>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={clearSignature}
                  className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 px-2 py-0.5 rounded-sm hover:bg-slate-100"
                >
                  <RotateCcw className="w-3 h-3" />
                  Limpar Traço
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Desenhe sua assinatura no quadro abaixo:
                </label>
                <div className="border border-slate-300 rounded-xl bg-slate-50/60 p-2 touch-none">
                  <canvas
                    ref={canvasRef}
                    width={280}
                    height={100}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="w-full h-24 bg-white rounded-lg border border-dashed border-slate-200 cursor-crosshair shadow-inner"
                  />
                  <p className="text-[10px] text-slate-400 mt-1 text-center">
                    Use o mouse ou o dedo no touchscreen para assinar
                  </p>
                </div>
              </div>

              {/* Live Stamp Preview */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pré-visualização do Carimbo Formal:
                </label>
                <div className="h-28 border-2 border-dashed border-slate-300 rounded-xl p-3 flex flex-col items-center justify-center text-center bg-white">
                  {formData.digitalSignatureUrl ? (
                    <img
                      src={formData.digitalSignatureUrl}
                      alt="Assinatura"
                      className="max-h-12 object-contain mb-1"
                    />
                  ) : (
                    <div className="text-xs font-serif italic text-slate-400 mb-1">[Espaço para Assinatura]</div>
                  )}
                  <div className="border-t border-slate-400 pt-1 w-full max-w-[200px]">
                    <p className="text-[11px] font-bold text-slate-900 leading-tight">{formData.fullName || 'Nome do Médico'}</p>
                    <p className="text-[10px] text-slate-600 leading-tight">CRM/{formData.uf || 'UF'} {formData.crm || '000000'}</p>
                    {formData.specialty && <p className="text-[9px] text-slate-500 leading-tight">{formData.specialty}</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer controls */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            * Dados salvos localmente e aplicados instantaneamente.
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-700/20 transition-all flex items-center gap-1.5"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Salvo com Sucesso!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Salvar Dados</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
