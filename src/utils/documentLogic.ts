import { Medication, CidItem, PrescriptionItem, DoctorProfile, InpatientItem, InpatientInfo } from '../types';
import { MEDICATIONS_DATABASE } from '../data/medications';
import { CID10_DATABASE, INDEXED_CID_LIST, findCidByCode, findCidByTerm, resolveCidAndDescription } from '../data/cid10';
import { FAST_HUG_SECTIONS } from '../data/hospitalMedications';

export { findCidByCode, findCidByTerm, resolveCidAndDescription };

/**
 * Converts integer numbers (0 to 999) to Portuguese words for official Brazilian medical documents.
 * Example: 3 -> "03 (três) dias"
 */
export function formatDaysInWords(days: number): string {
  const n = Math.max(0, Math.floor(Number(days) || 0));
  const padded = n < 10 ? `0${n}` : `${n}`;
  const suffix = n === 1 ? 'dia' : 'dias';
  return `${padded} (${numberToWordsPt(n)}) ${suffix}`;
}

/**
 * Escreve números inteiros de 0 a 999 por extenso em português (ex.: 26 -> "vinte e seis").
 */
export function numberToWordsPt(n: number): string {
  const units = ['zero', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove',
    'dez', 'onze', 'doze', 'treze', 'quatorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'];
  const tens = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];
  const hundreds = ['', 'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos',
    'seiscentos', 'setecentos', 'oitocentos', 'novecentos'];

  if (!Number.isFinite(n) || n < 0 || n > 999) return `${n}`;
  if (n < 20) return units[n];
  if (n === 100) return 'cem';
  if (n < 100) {
    const t = Math.floor(n / 10);
    const u = n % 10;
    return u === 0 ? tens[t] : `${tens[t]} e ${units[u]}`;
  }
  const h = Math.floor(n / 100);
  const rest = n % 100;
  return rest === 0 ? (h === 1 ? 'cem' : hundreds[h]) : `${hundreds[h]} e ${numberToWordsPt(rest)}`;
}

/**
 * Adds N days to a date string (YYYY-MM-DD) and returns the formatted date.
 */
export function calculateEndDate(startDateStr: string, days: number): string {
  if (!startDateStr) return '';
  const [year, month, day] = startDateStr.split('-').map(Number);
  const start = new Date(year, month - 1, day);
  // If atestado is 3 days starting today, it covers today, tomorrow, and day after (3 days total: days - 1)
  const daysToAdd = Math.max(0, days - 1);
  const end = new Date(start);
  end.setDate(start.getDate() + daysToAdd);

  const y = end.getFullYear();
  const m = String(end.getMonth() + 1).padStart(2, '0');
  const d = String(end.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Formats a YYYY-MM-DD date to PT-BR dd/mm/yyyy
 */
export function formatDatePtBr(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
}

/**
 * Formats date to extended legal Brazilian Portuguese:
 * e.g. "São Paulo - SP, 01 de novembro de 2026"
 */
export function formatExtendedDate(dateStr: string, city: string = 'São Paulo - SP'): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  const months = [
    'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
  ];

  const dayStr = String(date.getDate()).padStart(2, '0');
  const monthStr = months[date.getMonth()];
  const yearStr = date.getFullYear();

  return `${city}, ${dayStr} de ${monthStr} de ${yearStr}`;
}

/**
 * Normalizes text for search (removes diacritics, lowercase)
 */
export function normalizeSearch(str: string): string {
  return (str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/**
 * Fast search and ranking for medications database
 */
export function searchMedications(query: string, limit = 8): Medication[] {
  const q = normalizeSearch(query);
  if (!q) return MEDICATIONS_DATABASE.slice(0, limit);

  return MEDICATIONS_DATABASE.filter(med => {
    const nameMatch = normalizeSearch(med.name).includes(q);
    const genericMatch = normalizeSearch(med.genericName).includes(q);
    const brandMatch = med.brandName ? normalizeSearch(med.brandName).includes(q) : false;
    const classMatch = normalizeSearch(med.class).includes(q);
    return nameMatch || genericMatch || brandMatch || classMatch;
  }).slice(0, limit);
}

/**
 * Search CID-10 database by code or clinical term, prioritizing exact matches
 */
export function searchCid10(query: string, limit = 8): CidItem[] {
  const q = normalizeSearch(query);
  if (!q) return CID10_DATABASE.slice(0, limit);

  // Check direct match via resolver (handles codes like J18.9, aliases like "pneumonia", "iam", "has")
  const directMatch = resolveCidAndDescription(query);
  const directItem = directMatch ? findCidByCode(directMatch.code) : undefined;

  const results: CidItem[] = [];
  const seenCodes = new Set<string>();

  if (directItem) {
    results.push(directItem);
    seenCodes.add(directItem.code);
  }

  // 1. Matches where code starts with query (e.g. "J18" -> J18.0, J18.1...)
  for (let i = 0; i < INDEXED_CID_LIST.length; i++) {
    const entry = INDEXED_CID_LIST[i];
    if (seenCodes.has(entry.item.code)) continue;
    if (entry.cleanCode.startsWith(q) || entry.normCode.startsWith(q)) {
      results.push(entry.item);
      seenCodes.add(entry.item.code);
      if (results.length >= limit) return results;
    }
  }

  // 2. Matches where description starts with query
  for (let i = 0; i < INDEXED_CID_LIST.length; i++) {
    const entry = INDEXED_CID_LIST[i];
    if (seenCodes.has(entry.item.code)) continue;
    if (entry.normDesc.startsWith(q)) {
      results.push(entry.item);
      seenCodes.add(entry.item.code);
      if (results.length >= limit) return results;
    }
  }

  // 3. Matches where description or category contains query
  for (let i = 0; i < INDEXED_CID_LIST.length; i++) {
    const entry = INDEXED_CID_LIST[i];
    if (seenCodes.has(entry.item.code)) continue;
    if (entry.normDesc.includes(q) || entry.normCat.includes(q) || entry.normCode.includes(q)) {
      results.push(entry.item);
      seenCodes.add(entry.item.code);
      if (results.length >= limit) return results;
    }
  }

  return results;
}

/**
 * Checks if a prescription contains items requiring 2-via special control
 */
export function getRecommendedPrescriptionType(items: PrescriptionItem[]): 'simples' | 'antimicrobiano' | 'controle_especial' {
  if (items.some(i => i.type === 'controle_especial')) return 'controle_especial';
  if (items.some(i => i.type === 'antimicrobiano')) return 'antimicrobiano';
  return 'simples';
}

/**
 * Validates doctor profile fields
 */
export function validateDoctorProfile(doctor: Partial<DoctorProfile>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!doctor.fullName || doctor.fullName.trim().length < 3) {
    errors.push('Nome do médico é obrigatório.');
  }
  if (!doctor.crm || doctor.crm.trim().length < 2) {
    errors.push('Número do CRM é obrigatório.');
  }
  if (!doctor.uf || doctor.uf.trim().length < 2) {
    errors.push('UF do CRM é obrigatório.');
  }
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Generates WhatsApp-friendly formatted text for a prescription
 */
export function formatPrescriptionForWhatsApp(
  doctor: DoctorProfile,
  patientName: string,
  items: PrescriptionItem[],
  date: string,
  recommendations?: string
): string {
  const header = `🩺 *RECEITUÁRIO MÉDICO*\n${doctor.clinicName}\n${doctor.fullName} - CRM/${doctor.uf} ${doctor.crm}\n${doctor.specialty || ''}\n`;
  const patient = `\n👤 *Paciente:* ${patientName || 'Não informado'}\n📅 *Data:* ${formatDatePtBr(date)}\n`;
  
  let list = '\n📋 *Medicamentos Prescritos:*\n';
  items.forEach((item, index) => {
    list += `\n*${index + 1}. ${item.medicationName}*`;
    if (item.presentation) list += ` (${item.presentation})`;
    if (item.quantity) list += ` - Qtd: ${item.quantity}`;
    list += `\n   📍 *Via:* ${item.route}`;
    list += `\n   ⏱️ *Posologia:* ${item.posology}`;
    if (item.instructions) list += `\n   💡 *Obs:* ${item.instructions}`;
    list += '\n';
  });

  let footer = '';
  if (recommendations) {
    footer += `\n📌 *Recomendações Gerais:*\n${recommendations}\n`;
  }
  footer += `\n📍 *Local de Atendimento:*\n${doctor.clinicAddress} - ${doctor.clinicCityState}`;
  if (doctor.clinicPhone) footer += `\n📞 ${doctor.clinicPhone}`;

  return `${header}${patient}${list}${footer}`.trim();
}

/**
 * Generates WhatsApp-friendly text for medical certificate
 */
export function formatAtestadoForWhatsApp(
  doctor: DoctorProfile,
  patientName: string,
  daysFormatted: string,
  startDate: string,
  endDate: string,
  reason: string,
  cidText?: string
): string {
  const motivo = reason?.trim() ? `por motivo de saúde (${reason})` : 'por motivo de saúde';
  return `📋 *ATESTADO MÉDICO*\n${doctor.clinicName}\n${doctor.fullName} - CRM/${doctor.uf} ${doctor.crm}\n\n` +
    `Atesto para os devidos fins que o(a) Sr(a). *${patientName}* necessita de *${daysFormatted}* de repouso ${motivo}, ` +
    `a contar de *${formatDatePtBr(startDate)}* até *${formatDatePtBr(endDate)}*.\n\n` +
    (cidText ? `*Diagnóstico:* ${cidText}\n\n` : '') +
    `📍 ${doctor.clinicAddress} - ${doctor.clinicCityState}\n` +
    `Emitido em ${formatExtendedDate(startDate, doctor.clinicCityState)}`;
}

/**
 * Monta a linha principal de um item da prescrição de internação.
 * Ex.: "Dipirona sódica 500 mg/mL — 1 g (2 mL) — EV — 6/6h"
 */
export function formatInpatientItemLine(item: InpatientItem): string {
  return [item.name, item.dose, item.route, item.frequency]
    .map(part => (part || '').trim())
    .filter(Boolean)
    .join(' — ');
}

/**
 * Ordem clínica hospitalar padrão para prescrição de internação:
 * 1. Dieta -> 2. Hidratação -> 3. Antibióticos -> 4. Analgesia -> 5. Sintomáticos -> 6. Profilaxias -> 7. Demais
 */
export const INPATIENT_CATEGORY_ORDER: Record<string, number> = {
  dieta: 1,
  hidratacao: 2,
  antibiotico: 3,
  analgesia: 4,
  sintomaticos: 5,
  profilaxias: 6,
  demais: 7
};

export function sortInpatientItems(items: InpatientItem[]): InpatientItem[] {
  return [...items].sort((a, b) => {
    const orderA = INPATIENT_CATEGORY_ORDER[a.category] ?? 99;
    const orderB = INPATIENT_CATEGORY_ORDER[b.category] ?? 99;
    return orderA - orderB;
  });
}

/**
 * Agrupa os itens por seção na ordem hospitalar padrão.
 * Quando onlyPopulated = true, retorna apenas as seções que contêm ao menos 1 item,
 * eliminando seções vazias e espaços em branco.
 */
export function groupInpatientItemsByCategory(items: InpatientItem[], onlyPopulated = false) {
  const sorted = sortInpatientItems(items);
  const grouped = FAST_HUG_SECTIONS.map(section => ({
    section,
    items: sorted.filter(item => item.category === section.key)
  }));
  return onlyPopulated ? grouped.filter(g => g.items.length > 0) : grouped;
}

/**
 * Gera texto formatado (WhatsApp / área de transferência) da prescrição de internação.
 */
export function formatInpatientForWhatsApp(
  doctor: DoctorProfile,
  patientName: string,
  patientAge: string | undefined,
  patientWeight: string | number | undefined,
  info: InpatientInfo,
  items: InpatientItem[]
): string {
  let text = `🏥 *PRESCRIÇÃO MÉDICA — INTERNAÇÃO*\n${doctor.clinicName}\n${doctor.fullName} - CRM/${doctor.uf} ${doctor.crm}\n`;
  text += `\n👤 *Paciente:* ${patientName || 'Não informado'}`;
  if (patientAge) text += ` (${patientAge})`;
  if (patientWeight) text += `\n⚖️ *Peso:* ${patientWeight} kg`;
  text += `\n🛏️ *Leito:* ${info.bed || 'Não informado'}${info.ward ? ` • ${info.ward}` : ''}`;
  text += `\n📅 *Prescrição:* ${formatDatePtBr(info.prescriptionDate)} • *Internação:* ${formatDatePtBr(info.admissionDate)}`;
  text += `\n⚠️ *Alergias:* ${info.allergies?.trim() || 'Não informadas'}`;
  const dx = [info.cid ? `${info.cid.code} - ${info.cid.description}` : '', info.diagnosis].filter(Boolean).join(' | ');
  if (dx) text += `\n🩺 *Hipótese diagnóstica:* ${dx}`;
  text += '\n';

  let counter = 1;
  groupInpatientItemsByCategory(items, true).forEach(({ section, items: sectionItems }) => {
    text += `\n*${section.title.toUpperCase()}*\n`;
    sectionItems.forEach(item => {
      text += `${counter}. ${formatInpatientItemLine(item)}${item.controlled ? ' ⚠️(controlado)' : ''}\n`;
      if (item.notes) text += `   • ${item.notes}\n`;
      counter += 1;
    });
  });

  text += `\n📍 ${doctor.clinicAddress} - ${doctor.clinicCityState}`;
  return text.trim();
}
