import { DoctorAccount, DoctorProfile } from '../types';
import { DEFAULT_DOCTOR_PROFILE } from '../data/defaultData';

const DOCTORS_DB_STORAGE_KEY = 'ordem_terceira_doctors_db_v1';
const ACTIVE_SESSION_KEY = 'ordem_terceira_active_doctor_session_v1';

/* ------------------------------------------------------------------ */
/* Hash de senha (SHA-256 síncrono, sem dependências)                  */
/* As senhas NUNCA devem ser gravadas em texto puro no localStorage.   */
/* ------------------------------------------------------------------ */
const PASSWORD_HASH_PREFIX = 'sha256$';

function sha256Hex(message: string): string {
  const K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];
  const bytes = Array.from(new TextEncoder().encode(message));
  const bitLen = bytes.length * 8;
  bytes.push(0x80);
  while (bytes.length % 64 !== 56) bytes.push(0);
  const hi = Math.floor(bitLen / 0x100000000);
  const lo = bitLen >>> 0;
  for (let i = 3; i >= 0; i--) bytes.push((hi >>> (i * 8)) & 0xff);
  for (let i = 3; i >= 0; i--) bytes.push((lo >>> (i * 8)) & 0xff);

  const H = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
  const W = new Array<number>(64);
  const rotr = (x: number, n: number) => (x >>> n) | (x << (32 - n));

  for (let off = 0; off < bytes.length; off += 64) {
    for (let t = 0; t < 16; t++) {
      const j = off + t * 4;
      W[t] = ((bytes[j] << 24) | (bytes[j + 1] << 16) | (bytes[j + 2] << 8) | bytes[j + 3]) >>> 0;
    }
    for (let t = 16; t < 64; t++) {
      const s0 = rotr(W[t - 15], 7) ^ rotr(W[t - 15], 18) ^ (W[t - 15] >>> 3);
      const s1 = rotr(W[t - 2], 17) ^ rotr(W[t - 2], 19) ^ (W[t - 2] >>> 10);
      W[t] = (W[t - 16] + s0 + W[t - 7] + s1) >>> 0;
    }
    let [a, b, c, d, e, f, g, h] = H;
    for (let t = 0; t < 64; t++) {
      const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
      const ch = (e & f) ^ (~e & g);
      const t1 = (h + S1 + ch + K[t] + W[t]) >>> 0;
      const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const t2 = (S0 + maj) >>> 0;
      h = g; g = f; f = e; e = (d + t1) >>> 0;
      d = c; c = b; b = a; a = (t1 + t2) >>> 0;
    }
    H[0] = (H[0] + a) >>> 0; H[1] = (H[1] + b) >>> 0; H[2] = (H[2] + c) >>> 0; H[3] = (H[3] + d) >>> 0;
    H[4] = (H[4] + e) >>> 0; H[5] = (H[5] + f) >>> 0; H[6] = (H[6] + g) >>> 0; H[7] = (H[7] + h) >>> 0;
  }
  return H.map(x => x.toString(16).padStart(8, '0')).join('');
}

function generateSalt(): string {
  try {
    const arr = new Uint8Array(12);
    crypto.getRandomValues(arr);
    return Array.from(arr, b => b.toString(16).padStart(2, '0')).join('');
  } catch {
    return `${Date.now().toString(16)}${Math.random().toString(16).slice(2, 10)}`;
  }
}

/** Gera o hash armazenável da senha: sha256$<salt>$<hash> (com estiramento de 1000 rodadas) */
export function hashPassword(password: string, salt: string = generateSalt()): string {
  let digest = `${salt}:${password}`;
  for (let i = 0; i < 1000; i++) digest = sha256Hex(digest);
  return `${PASSWORD_HASH_PREFIX}${salt}$${digest}`;
}

/** Confere a senha digitada contra o valor armazenado (aceita contas antigas em texto puro) */
export function verifyPassword(password: string, stored: string): boolean {
  if (!stored) return false;
  if (!stored.startsWith(PASSWORD_HASH_PREFIX)) return stored === password; // legado
  const [, salt] = stored.split('$');
  return hashPassword(password, salt) === stored;
}

/** Remove a senha (mesmo em hash) antes de gravar a sessão ativa */
function stripPassword(account: DoctorAccount): DoctorAccount {
  return { ...account, password: '' };
}

/**
 * Normalizes CRM by removing dots, spaces, hyphens and leading zeros for consistent matching
 */
export function normalizeCrm(crm: string): string {
  return (crm || '').replace(/[^0-9a-zA-Z]/g, '').toUpperCase().trim();
}

/**
 * Normalizes CPF to 11 digits only
 */
export function normalizeCpf(cpf: string): string {
  return (cpf || '').replace(/\D/g, '').slice(0, 11);
}

/**
 * Formats CPF as 000.000.000-00 while typing
 */
export function formatCpfMask(value: string): string {
  const digits = normalizeCpf(value);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
}

/**
 * Ensures doctor name has "Dr(a)." prefix if not already present
 */
export function formatDoctorName(rawName: string): string {
  const trimmed = (rawName || '').trim();
  if (!trimmed) return '';
  if (!/^(dr\(a\)\.|dr\.|dra\.|dr|dra)\s+/i.test(trimmed)) {
    return `Dr(a). ${trimmed}`;
  }
  return trimmed;
}

/**
 * Loads all registered doctors from the local database
 */
export function getRegisteredDoctors(): DoctorAccount[] {
  try {
    const raw = localStorage.getItem(DOCTORS_DB_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Erro ao ler banco de dados local de médicos:', e);
  }
  return [];
}

/**
 * Saves the doctors list to the local database
 */
function saveRegisteredDoctors(accounts: DoctorAccount[]): void {
  try {
    localStorage.setItem(DOCTORS_DB_STORAGE_KEY, JSON.stringify(accounts));
  } catch (e) {
    console.warn('Erro ao salvar banco de dados local de médicos:', e);
  }
}

/**
 * Finds a doctor account by CRM
 */
export function findDoctorByCrm(crm: string): DoctorAccount | undefined {
  const target = normalizeCrm(crm);
  if (!target) return undefined;
  const accounts = getRegisteredDoctors();
  return accounts.find(acc => normalizeCrm(acc.crm) === target);
}

/**
 * Registers a new doctor account in the local database
 */
export function registerDoctorAccount(params: {
  name: string;
  crm: string;
  cpf: string;
  cns?: string;
  documentType?: 'CNS' | 'CPF';
  password: string;
  uf?: string;
  specialty?: string;
}): { success: boolean; error?: string; account?: DoctorAccount } {
  const cleanName = params.name.trim();
  const cleanCrm = params.crm.trim();
  const cleanCpf = normalizeCpf(params.cpf);
  const password = params.password;

  if (!cleanName || cleanName.length < 3) {
    return { success: false, error: 'Informe o primeiro e último nome do médico.' };
  }
  if (!cleanCrm || normalizeCrm(cleanCrm).length < 2) {
    return { success: false, error: 'Informe um número de CRM válido.' };
  }
  if (cleanCpf.length !== 11) {
    return { success: false, error: 'O CPF deve conter 11 dígitos numéricos.' };
  }
  if (!password || password.length < 4) {
    return { success: false, error: 'A senha deve ter pelo menos 4 caracteres.' };
  }

  const accounts = getRegisteredDoctors();

  // Check if CRM is already registered
  const existingCrm = accounts.find(a => normalizeCrm(a.crm) === normalizeCrm(cleanCrm));
  if (existingCrm) {
    return {
      success: false,
      error: `Já existe um cadastro para o CRM ${cleanCrm} (${existingCrm.fullName}). Utilize a aba de Login ou Recuperar Senha.`
    };
  }

  // Check if CPF is already registered
  const existingCpf = accounts.find(a => normalizeCpf(a.cpf) === cleanCpf);
  if (existingCpf) {
    return {
      success: false,
      error: `Este CPF já está vinculado ao cadastro de ${existingCpf.fullName} (CRM ${existingCpf.crm}).`
    };
  }

  const cleanCns = params.cns ? params.cns.replace(/\D/g, '').slice(0, 15) : undefined;
  const docType = params.documentType || (cleanCns ? 'CNS' : 'CPF');

  const newAccount: DoctorAccount = {
    id: `doc-${Date.now()}`,
    fullName: formatDoctorName(cleanName),
    crm: cleanCrm,
    cpf: formatCpfMask(cleanCpf),
    cns: cleanCns,
    documentType: docType,
    password: hashPassword(password),
    uf: params.uf || 'PA',
    specialty: params.specialty || 'Clínica Médica',
    createdAt: new Date().toISOString()
  };

  const updated = [...accounts, newAccount];
  saveRegisteredDoctors(updated);
  setActiveDoctorSession(newAccount);

  return { success: true, account: newAccount };
}

/**
 * Authenticates a doctor using CRM and Password
 */
export function authenticateDoctor(params: {
  crm: string;
  password: string;
  name?: string;
}): { success: boolean; error?: string; account?: DoctorAccount } {
  const cleanCrm = normalizeCrm(params.crm);
  if (!cleanCrm) {
    return { success: false, error: 'Informe o número do CRM.' };
  }
  if (!params.password) {
    return { success: false, error: 'Digite sua senha de acesso.' };
  }

  const accounts = getRegisteredDoctors();
  const account = accounts.find(a => normalizeCrm(a.crm) === cleanCrm);

  if (!account) {
    return {
      success: false,
      error: 'CRM não encontrado no banco de dados local. Clique em "Criar Cadastro" para cadastrar seu acesso.'
    };
  }

  if (!verifyPassword(params.password, account.password)) {
    return {
      success: false,
      error: 'Senha incorreta para este CRM. Tente novamente ou clique em "Esqueci minha senha".'
    };
  }

  // Migra contas antigas (senha em texto puro) para hash na primeira autenticação
  if (!account.password.startsWith(PASSWORD_HASH_PREFIX)) {
    account.password = hashPassword(params.password);
    saveRegisteredDoctors(accounts);
  }

  // If the user typed an updated name during login, optionally keep the registered name or update it
  if (params.name && params.name.trim().length >= 3) {
    account.fullName = formatDoctorName(params.name);
    saveRegisteredDoctors(accounts);
  }

  setActiveDoctorSession(account);
  return { success: true, account };
}

/**
 * Recovers / resets a doctor's password by validating CRM + CPF
 */
export function resetDoctorPasswordByCrmAndCpf(params: {
  crm: string;
  cpf: string;
  newPassword: string;
}): { success: boolean; error?: string; account?: DoctorAccount } {
  const cleanCrm = normalizeCrm(params.crm);
  const cleanCpf = normalizeCpf(params.cpf);

  if (!cleanCrm) {
    return { success: false, error: 'Informe o número do CRM cadastrado.' };
  }
  if (cleanCpf.length !== 11) {
    return { success: false, error: 'Informe os 11 dígitos do CPF vinculado ao cadastro.' };
  }
  if (!params.newPassword || params.newPassword.length < 4) {
    return { success: false, error: 'A nova senha deve ter pelo menos 4 caracteres.' };
  }

  const accounts = getRegisteredDoctors();
  const index = accounts.findIndex(
    a => normalizeCrm(a.crm) === cleanCrm && normalizeCpf(a.cpf) === cleanCpf
  );

  if (index === -1) {
    const crmExists = accounts.some(a => normalizeCrm(a.crm) === cleanCrm);
    if (!crmExists) {
      return { success: false, error: 'Nenhum médico encontrado com este CRM no banco de dados local.' };
    }
    return {
      success: false,
      error: 'O CPF informado não corresponde ao CPF cadastrado para este CRM.'
    };
  }

  accounts[index] = {
    ...accounts[index],
    password: hashPassword(params.newPassword)
  };

  saveRegisteredDoctors(accounts);
  setActiveDoctorSession(accounts[index]);

  return { success: true, account: accounts[index] };
}

/**
 * Persists active authenticated session
 */
export function setActiveDoctorSession(account: DoctorAccount): void {
  try {
    localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(stripPassword(account)));
    localStorage.setItem('ordem_terceira_doctor_authenticated', 'true');
  } catch (e) {
    console.warn('Erro ao salvar sessão ativa do médico:', e);
  }
}

/**
 * Clears active authenticated session (Logout / Lock)
 */
export function clearActiveDoctorSession(): void {
  try {
    localStorage.removeItem(ACTIVE_SESSION_KEY);
    localStorage.removeItem('ordem_terceira_doctor_authenticated');
  } catch (e) {
    console.warn('Erro ao encerrar sessão do médico:', e);
  }
}

/**
 * Checks if there is a currently authenticated doctor session
 */
export function getActiveDoctorSession(): DoctorAccount | null {
  try {
    const isAuth = localStorage.getItem('ordem_terceira_doctor_authenticated') === 'true';
    const raw = localStorage.getItem(ACTIVE_SESSION_KEY);
    if (isAuth && raw) {
      return JSON.parse(raw) as DoctorAccount;
    }
  } catch (e) {
    console.warn('Erro ao verificar sessão ativa:', e);
  }
  return null;
}

/**
 * Converts a DoctorAccount into a complete DoctorProfile preserving hospital letterhead settings
 */
export function accountToDoctorProfile(account: DoctorAccount, currentProfile?: DoctorProfile): DoctorProfile {
  const base = currentProfile || DEFAULT_DOCTOR_PROFILE;
  return {
    ...base,
    fullName: account.fullName,
    crm: account.crm,
    cpf: account.cpf || base.cpf,
    cns: account.cns || base.cns,
    documentType: account.documentType || base.documentType || (account.cns ? 'CNS' : 'CPF'),
    uf: account.uf || base.uf || 'PA',
    specialty: account.specialty || base.specialty || 'Clínica Médica'
  };
}

/**
 * Atualiza e fixa a preferência de documento (CNS ou CPF) do médico logado
 */
export function updateDoctorDocumentPreference(params: {
  crm: string;
  documentType: 'CNS' | 'CPF';
  documentNumber: string;
}): boolean {
  try {
    const cleanCrm = normalizeCrm(params.crm);
    if (!cleanCrm) return false;
    const accounts = getRegisteredDoctors();
    const idx = accounts.findIndex(a => normalizeCrm(a.crm) === cleanCrm);
    if (idx >= 0) {
      const cleanDigits = params.documentNumber.replace(/\D/g, '');
      accounts[idx].documentType = params.documentType;
      if (params.documentType === 'CNS') {
        accounts[idx].cns = cleanDigits.slice(0, 15);
      } else {
        accounts[idx].cpf = formatCpfMask(cleanDigits.slice(0, 11));
      }
      saveRegisteredDoctors(accounts);
      setActiveDoctorSession(accounts[idx]);
      return true;
    }
  } catch (e) {
    console.warn('Erro ao atualizar documento preferencial do médico:', e);
  }
  return false;
}
