import React, { useState, useEffect } from 'react';
import {
  User,
  ShieldCheck,
  Lock,
  KeyRound,
  CreditCard,
  Eye,
  EyeOff,
  ArrowRight,
  UserPlus,
  LogIn,
  CheckCircle2,
  AlertCircle,
  Database,
  X
} from 'lucide-react';
import { DoctorProfile } from '../types';
import { saveDoctorProfileToStorage } from '../data/defaultData';
import {
  getRegisteredDoctors,
  findDoctorByCrm,
  registerDoctorAccount,
  authenticateDoctor,
  resetDoctorPasswordByCrmAndCpf,
  formatCpfMask,
  accountToDoctorProfile
} from '../services/doctorAuthService';

interface DoctorEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: DoctorProfile;
  onSaveDoctor: (profile: DoctorProfile) => void;
  canDismiss?: boolean;
}

type AuthMode = 'login' | 'register' | 'recover';

export const DoctorEntryModal: React.FC<DoctorEntryModalProps> = ({
  isOpen,
  onClose,
  doctor,
  onSaveDoctor,
  canDismiss = false
}) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [name, setName] = useState('');
  const [crm, setCrm] = useState('');
  const [cpf, setCpf] = useState('');
  const [cns, setCns] = useState('');
  const [documentType, setDocumentType] = useState<'CNS' | 'CPF'>('CPF');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [registeredCount, setRegisteredCount] = useState(0);

  // Initialize modal state
  useEffect(() => {
    if (isOpen) {
      const accounts = getRegisteredDoctors();
      setRegisteredCount(accounts.length);

      // If no doctor is registered yet in local DB, start on 'register' tab to streamline first setup,
      // otherwise default to 'login' tab
      if (accounts.length === 0) {
        setMode('register');
        setName('');
        setCrm('');
      } else {
        setMode('login');
        const cleanName = (doctor.fullName || '').replace(/^(dr\(a\)\.|dr\.|dra\.|dr|dra)\s+/i, '').trim();
        setName(cleanName);
        setCrm(doctor.crm || '');
      }

      setCpf('');
      setPassword('');
      setConfirmPassword('');
      setErrorMessage(null);
      setSuccessMessage(null);
    }
  }, [isOpen, doctor]);

  // Auto-fill doctor name in Login mode when typing a known CRM from the local DB
  const handleCrmChange = (value: string) => {
    setCrm(value);
    setErrorMessage(null);

    if (mode === 'login' && value.trim().length >= 2) {
      const found = findDoctorByCrm(value);
      if (found) {
        const cleanFoundName = found.fullName.replace(/^(dr\(a\)\.|dr\.|dra\.|dr|dra)\s+/i, '').trim();
        setName(cleanFoundName);
      }
    }
  };

  if (!isOpen) return null;

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setErrorMessage(null);
    setSuccessMessage(null);
    setPassword('');
    setConfirmPassword('');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('Por favor, informe seu primeiro e último nome.');
      return;
    }

    const result = authenticateDoctor({
      crm,
      password,
      name
    });

    if (!result.success || !result.account) {
      setErrorMessage(result.error || 'Não foi possível autenticar.');
      return;
    }

    const updatedProfile = accountToDoctorProfile(result.account, doctor);
    onSaveDoctor(updatedProfile);
    saveDoctorProfileToStorage(updatedProfile);
    onClose();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password !== confirmPassword) {
      setErrorMessage('A confirmação de senha não confere com a senha digitada.');
      return;
    }

    const result = registerDoctorAccount({
      name,
      crm,
      cpf,
      cns: cns.replace(/\D/g, '').slice(0, 15),
      documentType,
      password,
      uf: doctor.uf || 'PA',
      specialty: doctor.specialty || 'Clínica Médica'
    });

    if (!result.success || !result.account) {
      setErrorMessage(result.error || 'Erro ao realizar cadastro.');
      return;
    }

    const updatedProfile = accountToDoctorProfile(result.account, doctor);
    onSaveDoctor(updatedProfile);
    saveDoctorProfileToStorage(updatedProfile);
    setRegisteredCount(getRegisteredDoctors().length);
    setSuccessMessage('Cadastro realizado com sucesso! Acessando o sistema...');

    setTimeout(() => {
      onClose();
    }, 600);
  };

  const handleRecoverSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password !== confirmPassword) {
      setErrorMessage('A confirmação da nova senha não confere.');
      return;
    }

    const result = resetDoctorPasswordByCrmAndCpf({
      crm,
      cpf,
      newPassword: password
    });

    if (!result.success || !result.account) {
      setErrorMessage(result.error || 'Não foi possível redefinir a senha.');
      return;
    }

    const updatedProfile = accountToDoctorProfile(result.account, doctor);
    onSaveDoctor(updatedProfile);
    saveDoctorProfileToStorage(updatedProfile);
    setSuccessMessage(`Senha redefinida com sucesso para ${result.account.fullName}! Entrando...`);

    setTimeout(() => {
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden relative my-4">
        {/* Top Decorative Banner with Hospital Branding */}
        <div className="bg-gradient-to-r from-[#002766] via-[#0038A8] to-[#0B4EA2] text-white p-6 relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-36 h-36 opacity-15 pointer-events-none">
            <img
              src="/assets/brand/hospital_emblem_transparent.png"
              alt="Logo"
              className="w-full h-full object-contain filter brightness-200"
            />
          </div>

          {canDismiss && (
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-white p-1 flex items-center justify-center shadow-md shrink-0 ring-2 ring-white/70 overflow-hidden">
              <img
                src="/assets/logo_hospital_white.png"
                alt="Emblema Ordem Terceira Santa Maria"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-sky-300">
                Hospital Ordem Terceira • Santa Maria
              </span>
              <h2 className="text-xl font-black text-white tracking-tight">
                {mode === 'login' && 'Acesso do Médico'}
                {mode === 'register' && 'Cadastro de Médico'}
                {mode === 'recover' && 'Recuperação de Senha'}
              </h2>
              <p className="text-xs text-blue-200 mt-0.5">
                {mode === 'login' && 'Acesso individual protegido por senha para prescrição'}
                {mode === 'register' && 'Cadastre Nome, CRM, CPF e Senha no banco local'}
                {mode === 'recover' && 'Valide seu CRM e CPF para redefinir sua senha'}
              </p>
            </div>
          </div>

          {/* Navigation Mode Switcher Pills */}
          <div className="mt-5 grid grid-cols-3 gap-1.5 bg-slate-950/50 p-1 rounded-xl border border-blue-800/50">
            <button
              type="button"
              onClick={() => switchMode('login')}
              className={`py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                mode === 'login'
                  ? 'bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Entrar</span>
            </button>

            <button
              type="button"
              onClick={() => switchMode('register')}
              className={`py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                mode === 'register'
                  ? 'bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Cadastrar</span>
            </button>

            <button
              type="button"
              onClick={() => switchMode('recover')}
              className={`py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                mode === 'recover'
                  ? 'bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Recuperar</span>
            </button>
          </div>
        </div>

        {/* Feedback Banners */}
        {errorMessage && (
          <div className="mx-6 mt-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mx-6 mt-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* 1. LOGIN FORM (First/Last Name + CRM + Password) */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="p-6 space-y-4">
            {/* First & Last Name */}
            <div>
              <label htmlFor="login-doctor-name" className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5 flex items-center gap-2">
                <span className="h-6 w-6 rounded-lg bg-gradient-to-br from-blue-600 to-sky-500 text-white flex items-center justify-center shadow-2xs">
                  <User className="w-3.5 h-3.5" strokeWidth={2.25} />
                </span>
                <span>Primeiro e Último Nome *</span>
              </label>
              <input
                id="login-doctor-name"
                type="text"
                value={name}
                onChange={e => {
                  setName(e.target.value);
                  setErrorMessage(null);
                }}
                placeholder="Ex: Carlos Mendonça"
                autoFocus
                className="w-full px-3.5 py-2.5 text-sm font-semibold rounded-xl border border-slate-300 bg-slate-50/40 text-slate-900 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all outline-hidden"
              />
            </div>

            {/* CRM */}
            <div>
              <label htmlFor="login-doctor-crm" className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5 flex items-center gap-2">
                <span className="h-6 w-6 rounded-lg bg-gradient-to-br from-blue-600 to-sky-500 text-white flex items-center justify-center shadow-2xs">
                  <ShieldCheck className="w-3.5 h-3.5" strokeWidth={2.25} />
                </span>
                <span>CRM *</span>
              </label>
              <input
                id="login-doctor-crm"
                type="text"
                value={crm}
                onChange={e => handleCrmChange(e.target.value)}
                placeholder="Ex: 148920"
                className="w-full px-3.5 py-2.5 text-sm font-semibold rounded-xl border border-slate-300 bg-slate-50/40 text-slate-900 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all outline-hidden"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="login-doctor-password" className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
                  <span className="h-6 w-6 rounded-lg bg-gradient-to-br from-blue-600 to-sky-500 text-white flex items-center justify-center shadow-2xs">
                    <Lock className="w-3.5 h-3.5" strokeWidth={2.25} />
                  </span>
                  <span>Senha de Acesso *</span>
                </label>
                <button
                  type="button"
                  onClick={() => switchMode('recover')}
                  className="text-[11px] font-semibold text-blue-700 hover:text-blue-900 underline"
                >
                  Esqueci minha senha
                </button>
              </div>
              <div className="relative">
                <input
                  id="login-doctor-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value);
                    setErrorMessage(null);
                  }}
                  placeholder="Digite sua senha pessoal"
                  className="w-full pl-3.5 pr-10 py-2.5 text-sm font-semibold rounded-xl border border-slate-300 bg-slate-50/40 text-slate-900 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 p-0.5"
                  title={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2 space-y-3">
              <button
                type="submit"
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-700 to-sky-600 hover:from-blue-600 hover:to-sky-500 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-950/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Entrar com Senha</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => switchMode('register')}
                  className="text-xs font-semibold text-slate-600 hover:text-blue-700 transition-colors"
                >
                  Ainda não possui senha cadastrada? <span className="text-blue-700 font-bold underline">Criar Cadastro Local</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* 2. REGISTER FORM (First/Last Name + CRM + CPF + Password) */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="p-6 space-y-3.5">
            {/* First & Last Name */}
            <div>
              <label htmlFor="reg-doctor-name" className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1 flex items-center gap-2">
                <span className="h-6 w-6 rounded-lg bg-gradient-to-br from-blue-600 to-sky-500 text-white flex items-center justify-center shadow-2xs">
                  <User className="w-3.5 h-3.5" strokeWidth={2.25} />
                </span>
                <span>Primeiro e Último Nome *</span>
              </label>
              <input
                id="reg-doctor-name"
                type="text"
                value={name}
                onChange={e => {
                  setName(e.target.value);
                  setErrorMessage(null);
                }}
                placeholder="Ex: Carlos Mendonça"
                autoFocus
                className="w-full px-3.5 py-2 text-sm font-semibold rounded-xl border border-slate-300 bg-slate-50/40 text-slate-900 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all outline-hidden"
              />
            </div>

            {/* CRM & CPF Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="reg-doctor-crm" className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1 flex items-center gap-2">
                  <span className="h-6 w-6 rounded-lg bg-gradient-to-br from-blue-600 to-sky-500 text-white flex items-center justify-center shadow-2xs">
                    <ShieldCheck className="w-3.5 h-3.5" strokeWidth={2.25} />
                  </span>
                  <span>CRM *</span>
                </label>
                <input
                  id="reg-doctor-crm"
                  type="text"
                  value={crm}
                  onChange={e => {
                    setCrm(e.target.value);
                    setErrorMessage(null);
                  }}
                  placeholder="Ex: 148920"
                  className="w-full px-3.5 py-2 text-sm font-semibold rounded-xl border border-slate-300 bg-slate-50/40 text-slate-900 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all outline-hidden"
                />
              </div>

              <div>
                <label htmlFor="reg-doctor-cpf" className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1 flex items-center gap-2">
                  <span className="h-6 w-6 rounded-lg bg-gradient-to-br from-blue-600 to-sky-500 text-white flex items-center justify-center shadow-2xs">
                    <CreditCard className="w-3.5 h-3.5" strokeWidth={2.25} />
                  </span>
                  <span>CPF *</span>
                </label>
                <input
                  id="reg-doctor-cpf"
                  type="text"
                  value={cpf}
                  onChange={e => {
                    setCpf(formatCpfMask(e.target.value));
                    setErrorMessage(null);
                  }}
                  placeholder="000.000.000-00"
                  maxLength={14}
                  className="w-full px-3.5 py-2 text-sm font-semibold rounded-xl border border-slate-300 bg-slate-50/40 text-slate-900 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all outline-hidden"
                />
              </div>
            </div>

            {/* Documento Fixo para Laudos SUS (CNS / CPF) */}
            <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-blue-700" />
                  Documento para Laudos SUS (APAC / AIH)
                </span>
                <span className="text-[10px] font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                  Fixo no seu login
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Documento Principal:
                  </label>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => setDocumentType('CPF')}
                      className={`flex-1 py-1 px-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                        documentType === 'CPF'
                          ? 'bg-blue-700 text-white border-blue-700 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      CPF
                    </button>
                    <button
                      type="button"
                      onClick={() => setDocumentType('CNS')}
                      className={`flex-1 py-1 px-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                        documentType === 'CNS'
                          ? 'bg-blue-700 text-white border-blue-700 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      CNS
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="reg-doctor-cns" className="block text-[11px] font-semibold text-slate-600 mb-1">
                    CNS do Médico (15 dígitos)
                  </label>
                  <input
                    id="reg-doctor-cns"
                    type="text"
                    maxLength={15}
                    value={cns}
                    onChange={e => setCns(e.target.value.replace(/\D/g, '').slice(0, 15))}
                    placeholder="Ex: 700000000000000"
                    className="w-full px-2.5 py-1 text-xs font-mono font-semibold rounded-lg border border-slate-300 bg-white text-slate-900 focus:border-blue-600 outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="reg-doctor-password" className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1 flex items-center gap-2">
                  <span className="h-6 w-6 rounded-lg bg-gradient-to-br from-blue-600 to-sky-500 text-white flex items-center justify-center shadow-2xs">
                    <Lock className="w-3.5 h-3.5" strokeWidth={2.25} />
                  </span>
                  <span>Criar Senha *</span>
                </label>
                <div className="relative">
                  <input
                    id="reg-doctor-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => {
                      setPassword(e.target.value);
                      setErrorMessage(null);
                    }}
                    placeholder="Mín. 4 dígitos"
                    className="w-full pl-3.5 pr-9 py-2 text-sm font-semibold rounded-xl border border-slate-300 bg-slate-50/40 text-slate-900 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-700 p-0.5"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="reg-doctor-confirm" className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1 flex items-center gap-2">
                  <span className="h-6 w-6 rounded-lg bg-gradient-to-br from-blue-600 to-sky-500 text-white flex items-center justify-center shadow-2xs">
                    <Lock className="w-3.5 h-3.5" strokeWidth={2.25} />
                  </span>
                  <span>Confirmar Senha *</span>
                </label>
                <input
                  id="reg-doctor-confirm"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => {
                    setConfirmPassword(e.target.value);
                    setErrorMessage(null);
                  }}
                  placeholder="Repita a senha"
                  className="w-full px-3.5 py-2 text-sm font-semibold rounded-xl border border-slate-300 bg-slate-50/40 text-slate-900 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all outline-hidden"
                />
              </div>
            </div>

            <p className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200 leading-snug">
              🔒 O <strong>CPF</strong> fica salvo exclusivamente no banco de dados local deste dispositivo e serve como chave de segurança caso precise recuperar sua senha.
            </p>

            <div className="pt-1">
              <button
                type="submit"
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-700 to-sky-600 hover:from-blue-600 hover:to-sky-500 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-950/20 transition-all flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Salvar Cadastro e Entrar</span>
              </button>
            </div>
          </form>
        )}

        {/* 3. RECOVER PASSWORD FORM (Validate CRM + CPF to set New Password) */}
        {mode === 'recover' && (
          <form onSubmit={handleRecoverSubmit} className="p-6 space-y-3.5">
            <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-xl text-xs text-blue-950 leading-relaxed">
              Informe seu <strong>CRM</strong> e o <strong>CPF</strong> vinculado ao seu cadastro local para criar uma nova senha de acesso imediato.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="rec-doctor-crm" className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1 flex items-center gap-2">
                  <span className="h-6 w-6 rounded-lg bg-gradient-to-br from-blue-600 to-sky-500 text-white flex items-center justify-center shadow-2xs">
                    <ShieldCheck className="w-3.5 h-3.5" strokeWidth={2.25} />
                  </span>
                  <span>CRM Cadastrado *</span>
                </label>
                <input
                  id="rec-doctor-crm"
                  type="text"
                  value={crm}
                  onChange={e => {
                    setCrm(e.target.value);
                    setErrorMessage(null);
                  }}
                  placeholder="Ex: 148920"
                  autoFocus
                  className="w-full px-3.5 py-2 text-sm font-semibold rounded-xl border border-slate-300 bg-slate-50/40 text-slate-900 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all outline-hidden"
                />
              </div>

              <div>
                <label htmlFor="rec-doctor-cpf" className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1 flex items-center gap-2">
                  <span className="h-6 w-6 rounded-lg bg-gradient-to-br from-blue-600 to-sky-500 text-white flex items-center justify-center shadow-2xs">
                    <CreditCard className="w-3.5 h-3.5" strokeWidth={2.25} />
                  </span>
                  <span>Confirme seu CPF *</span>
                </label>
                <input
                  id="rec-doctor-cpf"
                  type="text"
                  value={cpf}
                  onChange={e => {
                    setCpf(formatCpfMask(e.target.value));
                    setErrorMessage(null);
                  }}
                  placeholder="000.000.000-00"
                  maxLength={14}
                  className="w-full px-3.5 py-2 text-sm font-semibold rounded-xl border border-slate-300 bg-slate-50/40 text-slate-900 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="rec-new-password" className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1 flex items-center gap-2">
                  <span className="h-6 w-6 rounded-lg bg-gradient-to-br from-blue-600 to-sky-500 text-white flex items-center justify-center shadow-2xs">
                    <KeyRound className="w-3.5 h-3.5" strokeWidth={2.25} />
                  </span>
                  <span>Nova Senha *</span>
                </label>
                <div className="relative">
                  <input
                    id="rec-new-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => {
                      setPassword(e.target.value);
                      setErrorMessage(null);
                    }}
                    placeholder="Mín. 4 dígitos"
                    className="w-full pl-3.5 pr-9 py-2 text-sm font-semibold rounded-xl border border-slate-300 bg-slate-50/40 text-slate-900 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-700 p-0.5"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="rec-confirm-password" className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1 flex items-center gap-2">
                  <span className="h-6 w-6 rounded-lg bg-gradient-to-br from-blue-600 to-sky-500 text-white flex items-center justify-center shadow-2xs">
                    <Lock className="w-3.5 h-3.5" strokeWidth={2.25} />
                  </span>
                  <span>Repetir Nova Senha *</span>
                </label>
                <input
                  id="rec-confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => {
                    setConfirmPassword(e.target.value);
                    setErrorMessage(null);
                  }}
                  placeholder="Confirme a senha"
                  className="w-full px-3.5 py-2 text-sm font-semibold rounded-xl border border-slate-300 bg-slate-50/40 text-slate-900 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all outline-hidden"
                />
              </div>
            </div>

            <div className="pt-1 flex items-center gap-2">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="px-4 py-3 border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
              >
                Voltar
              </button>
              <button
                type="submit"
                className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-700 to-sky-600 hover:from-blue-600 hover:to-sky-500 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-950/20 transition-all flex items-center justify-center gap-2"
              >
                <KeyRound className="w-4 h-4" />
                <span>Redefinir Senha e Entrar</span>
              </button>
            </div>
          </form>
        )}

        {/* Footer Database Status Bar */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1.5 font-medium">
            <Database className="w-3.5 h-3.5 text-blue-600" />
            <span>Banco Local Criptografado</span>
          </span>
          <span className="font-semibold text-slate-600">
            {registeredCount} {registeredCount === 1 ? 'médico cadastrado' : 'médicos cadastrados'}
          </span>
        </div>
      </div>
    </div>
  );
};
