/**
 * Utilitários de data no FUSO HORÁRIO LOCAL.
 *
 * `new Date().toISOString()` retorna a data em UTC: no Pará (UTC-3), a partir das 21h
 * isso gera a data do DIA SEGUINTE em receitas, atestados, AIH e APAC.
 * Use estas funções sempre que precisar de "hoje" no formato YYYY-MM-DD.
 */

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

/** Converte um Date em 'YYYY-MM-DD' usando o horário local */
export function toLocalIsoDate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Data de hoje (local) em 'YYYY-MM-DD' */
export function getTodayIso(): string {
  return toLocalIsoDate(new Date());
}

/** Data de hoje (local) somada de N dias, em 'YYYY-MM-DD' (seguro em mudanças de horário) */
export function addDaysIso(days: number, from: Date = new Date()): string {
  const d = new Date(from.getFullYear(), from.getMonth(), from.getDate() + days);
  return toLocalIsoDate(d);
}

/** Data/hora local no formato de <input type="datetime-local"> ('YYYY-MM-DDTHH:mm') */
export function getNowDateTimeLocal(): string {
  const d = new Date();
  return `${toLocalIsoDate(d)}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
