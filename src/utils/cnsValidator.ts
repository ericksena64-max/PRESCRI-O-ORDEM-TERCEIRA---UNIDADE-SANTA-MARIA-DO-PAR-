/**
 * Validador oficial de Cartão Nacional de Saúde (CNS) conforme algoritmo DATASUS (Módulo 11).
 *
 * Suporta:
 * 1. Cartões definitivos iniciados por 1 ou 2.
 * 2. Cartões provisórios iniciados por 7, 8 ou 9.
 */

export interface CnsValidationResult {
  isValid: boolean;
  tipo?: 'definitivo' | 'provisorio';
  error?: string;
  formatted?: string;
}

export function validateCns(cnsRaw: string): CnsValidationResult {
  if (!cnsRaw) {
    return { isValid: false, error: 'CNS não informado' };
  }

  // Remove caracteres não numéricos
  const cns = cnsRaw.replace(/\D/g, '');

  if (cns.length !== 15) {
    return { isValid: false, error: 'O CNS deve conter exatamente 15 dígitos numéricos' };
  }

  // Não aceita números com todos os dígitos iguais
  if (/^(\d)\1{14}$/.test(cns)) {
    return { isValid: false, error: 'Número de CNS inválido (dígitos repetidos)' };
  }

  const primeiroDigito = cns[0];

  // Cartões que iniciam com 1 ou 2 (Definitivo)
  if (primeiroDigito === '1' || primeiroDigito === '2') {
    let soma = 0;
    for (let i = 0; i < 15; i++) {
      soma += parseInt(cns[i], 10) * (15 - i);
    }

    const resto = soma % 11;
    if (resto === 0) {
      return {
        isValid: true,
        tipo: 'definitivo',
        formatted: formatCns(cns)
      };
    }

    // Regra alternativa padrão DATASUS para quando o resto da divisão por 11 tem correção
    const base = cns.substring(0, 11);
    let somaBase = 0;
    for (let i = 0; i < 11; i++) {
      somaBase += parseInt(base[i], 10) * (15 - i);
    }

    let dv = 11 - (somaBase % 11);
    let resultado = '';
    if (dv === 11) dv = 0;

    if (dv === 10) {
      somaBase += 2;
      let dv2 = 11 - (somaBase % 11);
      if (dv2 === 11) dv2 = 0;
      resultado = `${base}001${dv2}`;
    } else {
      resultado = `${base}000${dv}`;
    }

    if (cns === resultado) {
      return {
        isValid: true,
        tipo: 'definitivo',
        formatted: formatCns(cns)
      };
    }

    return { isValid: false, error: 'Dígito verificador do CNS inválido' };
  }

  // Cartões que iniciam com 7, 8 ou 9 (Provisório)
  if (primeiroDigito === '7' || primeiroDigito === '8' || primeiroDigito === '9') {
    let soma = 0;
    for (let i = 0; i < 15; i++) {
      soma += parseInt(cns[i], 10) * (15 - i);
    }

    if (soma % 11 === 0) {
      return {
        isValid: true,
        tipo: 'provisorio',
        formatted: formatCns(cns)
      };
    }

    return { isValid: false, error: 'Dígito verificador do CNS provisório inválido' };
  }

  return { isValid: false, error: 'O CNS deve iniciar com 1, 2, 7, 8 ou 9' };
}

/**
 * Formata o CNS no padrão visual do DATASUS: 000 0000 0000 0000
 */
export function formatCns(cnsRaw: string): string {
  const clean = cnsRaw.replace(/\D/g, '').slice(0, 15);
  if (clean.length !== 15) return clean;
  return `${clean.slice(0, 3)} ${clean.slice(3, 7)} ${clean.slice(7, 11)} ${clean.slice(11, 15)}`;
}
