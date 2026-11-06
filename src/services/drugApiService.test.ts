import test from 'node:test';
import assert from 'node:assert/strict';
import {
  extractContraindications,
  normalizeRoute,
  extractDosageSummary,
  convertApiDrugToMedication,
  ApiDrugSuggestion
} from './drugApiService';

test('extractContraindications extracts clean sentences and removes section headers', () => {
  const rawFdaText = '4 CONTRAINDICATIONS: Hypersensitivity to amoxicillin or other beta-lactams. Severe renal impairment requires dose adjustment. History of cholestatic jaundice.';
  const extracted = extractContraindications(rawFdaText);
  assert.ok(extracted.length > 0);
  assert.ok(extracted.some(s => s.toLowerCase().includes('hypersensitivity')));
  assert.ok(!extracted[0].startsWith('4 CONTRAINDICATIONS'));
});

test('normalizeRoute maps FDA routes into Portuguese medical routes', () => {
  assert.equal(normalizeRoute('ORAL'), 'Uso oral');
  assert.equal(normalizeRoute(['TOPICAL']), 'Uso tópico');
  assert.equal(normalizeRoute('OPHTHALMIC'), 'Uso oftálmico');
  assert.equal(normalizeRoute('RESPIRATORY (INHALATION)'), 'Inalação oral');
  assert.equal(normalizeRoute('SUBLINGUAL'), 'Uso sublingual');
  assert.equal(normalizeRoute(undefined), 'Uso oral');
});

test('extractDosageSummary extracts concise dosage advice', () => {
  const raw = 'DOSAGE AND ADMINISTRATION: The usual adult dose is 500 mg every 8 hours or 875 mg every 12 hours for 7 to 10 days. Take with food.';
  const summary = extractDosageSummary(raw);
  assert.ok(summary.includes('500 mg every 8 hours'));
  assert.ok(!summary.startsWith('DOSAGE AND ADMINISTRATION:'));
});

test('convertApiDrugToMedication maps API drug with contraindications to prescription item', () => {
  const apiDrug: ApiDrugSuggestion = {
    id: 'fda-1',
    name: 'Amoxicillin (Amoxil)',
    genericName: 'Amoxicillin',
    brandName: 'Amoxil',
    dosageForm: '500mg Capsule',
    route: 'Uso oral',
    suggestedDosage: 'Take 500mg every 8 hours for 7 days.',
    contraindications: ['Known allergy to penicillins or cephalosporins.'],
    warnings: ['Clostridioides difficile-associated diarrhea.'],
    source: 'openfda'
  };

  const med = convertApiDrugToMedication(apiDrug);
  assert.equal(med.name, 'Amoxicillin (Amoxil)');
  assert.equal(med.type, 'antimicrobiano');
  assert.ok(med.instructions?.includes('allergy to penicillins'));
  assert.equal(med.defaultRoute, 'Uso oral');
});
