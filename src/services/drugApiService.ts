import { Medication, PrescriptionType } from '../types';

export interface ApiDrugSuggestion {
  id: string;
  name: string;
  genericName: string;
  brandName?: string;
  substanceName?: string;
  dosageForm?: string;
  route: string;
  suggestedDosage: string;
  contraindications: string[];
  warnings: string[];
  indications?: string;
  source: 'openfda' | 'local_database';
  isControlled?: boolean;
}

// In-memory cache for fast responsive searches
const searchCache = new Map<string, ApiDrugSuggestion[]>();

/**
 * Normalizes and extracts clear contraindication sentences from clinical text.
 */
export function extractContraindications(rawText?: string | string[]): string[] {
  if (!rawText) return [];
  const text = Array.isArray(rawText) ? rawText.join(' ') : rawText;
  if (!text) return [];

  // Remove section headers like "4 CONTRAINDICATIONS" or "CONTRAINDICATIONS"
  const cleaned = text
    .replace(/^CONTRAINDICATIONS:?/i, '')
    .replace(/^4\s+CONTRAINDICATIONS/i, '')
    .trim();

  // Split by bullet points, newlines, or numbered items
  const lines = cleaned
    .split(/(?:\r?\n|•|\u2022|\d+\.\s+)/)
    .map(line => line.trim())
    .filter(line => line.length > 10 && line.length < 300);

  if (lines.length > 0) {
    return lines.slice(0, 4);
  }

  // Fallback: split by sentences
  const sentences = cleaned
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 15 && s.length < 250);

  return sentences.slice(0, 3);
}

/**
 * Normalizes FDA routes into Portuguese clinical routes
 */
export function normalizeRoute(rawRoute?: string | string[]): string {
  if (!rawRoute) return 'Uso oral';
  const route = (Array.isArray(rawRoute) ? rawRoute[0] : rawRoute).toUpperCase();

  if (route.includes('ORAL')) return 'Uso oral';
  if (route.includes('TOPICAL')) return 'Uso tópico';
  if (route.includes('OPHTHALMIC')) return 'Uso oftálmico';
  if (route.includes('OTIC')) return 'Uso otológico';
  if (route.includes('NASAL')) return 'Uso nasal';
  if (route.includes('INHALATION') || route.includes('RESPIRATORY')) return 'Inalação oral';
  if (route.includes('SUBLINGUAL')) return 'Uso sublingual';
  if (route.includes('INTRAMUSCULAR')) return 'Uso intramuscular';
  if (route.includes('SUBCUTANEOUS')) return 'Uso subcutâneo';
  if (route.includes('INTRAVENOUS')) return 'Uso intravenoso';
  if (route.includes('RECTAL')) return 'Uso retal';

  return 'Uso oral';
}

/**
 * Cleans and summarizes dosage instructions from FDA label
 */
export function extractDosageSummary(rawDosage?: string | string[]): string {
  if (!rawDosage) return 'Conforme prescrição médica e orientação individualizada.';
  const text = Array.isArray(rawDosage) ? rawDosage.join(' ') : rawDosage;
  if (!text) return 'Conforme prescrição médica e orientação individualizada.';

  // Look for common concise dosage instructions
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => 
      s.toLowerCase().includes('dose') || 
      s.toLowerCase().includes('mg') || 
      s.toLowerCase().includes('daily') || 
      s.toLowerCase().includes('take') || 
      s.toLowerCase().includes('administer') ||
      s.toLowerCase().includes('hour')
    );

  if (sentences.length > 0) {
    // Return first clean sentence under 180 chars
    const candidate = sentences[0].replace(/^DOSAGE AND ADMINISTRATION:?/i, '').trim();
    if (candidate.length > 10 && candidate.length < 200) {
      return candidate;
    }
  }

  return text.slice(0, 140).trim() + (text.length > 140 ? '...' : '');
}

/**
 * Searches the public OpenFDA drug database in real time.
 */
export async function fetchDrugsFromPublicApi(query: string): Promise<ApiDrugSuggestion[]> {
  const cleanQuery = query.trim().toLowerCase();
  if (cleanQuery.length < 2) return [];

  if (searchCache.has(cleanQuery)) {
    return searchCache.get(cleanQuery)!;
  }

  try {
    // Search OpenFDA drug label API for generic_name or brand_name
    const url = `https://api.fda.gov/drug/label.json?search=(openfda.generic_name:"${encodeURIComponent(cleanQuery)}"+openfda.brand_name:"${encodeURIComponent(cleanQuery)}"+openfda.substance_name:"${encodeURIComponent(cleanQuery)}")&limit=6`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    if (!data.results || !Array.isArray(data.results)) {
      return [];
    }

    const results: ApiDrugSuggestion[] = data.results.map((item: any, index: number) => {
      const openfda = item.openfda || {};
      const brandName = openfda.brand_name ? openfda.brand_name[0] : undefined;
      const genericName = openfda.generic_name ? openfda.generic_name[0] : (openfda.substance_name ? openfda.substance_name[0] : query);
      const substanceName = openfda.substance_name ? openfda.substance_name[0] : undefined;
      const route = normalizeRoute(openfda.route);
      const contraindications = extractContraindications(item.contraindications);
      const warnings = extractContraindications(item.boxed_warning || item.warnings).slice(0, 2);
      const dosageSummary = extractDosageSummary(item.dosage_and_administration);
      const indications = item.indications_and_usage ? (Array.isArray(item.indications_and_usage) ? item.indications_and_usage[0].slice(0, 120) : item.indications_and_usage.slice(0, 120)) : undefined;

      const titleName = brandName 
        ? `${brandName} (${genericName})`
        : genericName;

      return {
        id: `fda-${index}-${openfda.spl_id?.[0] || Math.random().toString(36).substr(2, 6)}`,
        name: titleName,
        genericName,
        brandName,
        substanceName,
        dosageForm: openfda.dosage_form?.[0] || 'Comprimidos / Uso Geral',
        route,
        suggestedDosage: dosageSummary,
        contraindications,
        warnings,
        indications,
        source: 'openfda'
      };
    });

    searchCache.set(cleanQuery, results);
    return results;
  } catch (err) {
    // Network or abort error: gracefully return empty array (fallback handled by consumer)
    return [];
  }
}

/**
 * Converts a suggestion into a standard Medication item for prescription
 */
export function convertApiDrugToMedication(drug: ApiDrugSuggestion): Medication {
  const isAntimicrobial = drug.genericName.toLowerCase().includes('cillin') ||
    drug.genericName.toLowerCase().includes('mycin') ||
    drug.genericName.toLowerCase().includes('floxacin') ||
    drug.genericName.toLowerCase().includes('amoxic') ||
    drug.genericName.toLowerCase().includes('azithro');

  const isControlled = drug.genericName.toLowerCase().includes('pram') ||
    drug.genericName.toLowerCase().includes('zepam') ||
    drug.genericName.toLowerCase().includes('zolpidem') ||
    drug.genericName.toLowerCase().includes('traline') ||
    drug.genericName.toLowerCase().includes('xetine');

  let type: PrescriptionType = 'simples';
  if (isControlled) type = 'controle_especial';
  else if (isAntimicrobial) type = 'antimicrobiano';

  return {
    id: `api-med-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    name: drug.name,
    genericName: drug.genericName,
    brandName: drug.brandName,
    class: drug.indications || 'Medicamento Validado via Base Pública FDA/NIH',
    type,
    defaultRoute: drug.route,
    defaultPresentation: drug.dosageForm || 'Forma padrão',
    availablePresentations: [drug.dosageForm || 'Forma padrão'],
    defaultPosology: drug.suggestedDosage || 'Tomar conforme posologia clínica individualizada.',
    instructions: drug.contraindications.length > 0 
      ? `Contraindicações relevantes: ${drug.contraindications[0]}`
      : undefined,
    controlledCategory: isControlled ? 'Lista C1/B1 (Controle Especial)' : undefined
  };
}
