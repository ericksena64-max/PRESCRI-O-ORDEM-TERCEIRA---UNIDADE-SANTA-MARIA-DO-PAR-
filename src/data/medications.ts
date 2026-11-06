import { Medication } from '../types';
import { ANALGESICS_MEDICATIONS } from './medications/analgesics';
import { ANTI_INFLAMMATORIES_MEDICATIONS } from './medications/antiinflammatories';
import { ANTIMICROBIALS_MEDICATIONS } from './medications/antimicrobials';
import { GASTROINTESTINAL_MEDICATIONS } from './medications/gastrointestinal';
import { RESPIRATORY_MEDICATIONS } from './medications/respiratory';
import { CORTICOSTEROIDS_MEDICATIONS } from './medications/corticosteroids';
import { ANTIHISTAMINES_MEDICATIONS } from './medications/antihistamines';
import { CARDIOVASCULAR_MEDICATIONS } from './medications/cardiovascular';
import { METABOLIC_MEDICATIONS } from './medications/metabolic';
import { PSYCHIATRY_MEDICATIONS } from './medications/psychiatry';
import { TOPICALS_MEDICATIONS } from './medications/topicals';
import { WOMENS_HEALTH_MEDICATIONS } from './medications/womensHealth';

/**
 * Farmacopeia Clínica Brasileira Completa - Prescrição Ordem Terceira
 * Abrange medicamentos essenciais, de emergência, atenção primária (SUS/RENAME)
 * e consultórios especializados em todo o território nacional.
 */
export const MEDICATIONS_DATABASE: Medication[] = [
  ...ANALGESICS_MEDICATIONS,
  ...ANTI_INFLAMMATORIES_MEDICATIONS,
  ...ANTIMICROBIALS_MEDICATIONS,
  ...GASTROINTESTINAL_MEDICATIONS,
  ...CORTICOSTEROIDS_MEDICATIONS,
  ...RESPIRATORY_MEDICATIONS,
  ...ANTIHISTAMINES_MEDICATIONS,
  ...CARDIOVASCULAR_MEDICATIONS,
  ...METABOLIC_MEDICATIONS,
  ...PSYCHIATRY_MEDICATIONS,
  ...TOPICALS_MEDICATIONS,
  ...WOMENS_HEALTH_MEDICATIONS
];
