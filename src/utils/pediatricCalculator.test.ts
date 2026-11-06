import test from 'node:test';
import assert from 'node:assert/strict';
import { findPediatricDrug } from '../data/pediatricRules';

test('Dipirona Gotas calculates 1 drop per kg up to max limit', () => {
  const dipirona = findPediatricDrug('ped-dipirona-gotas');
  assert.ok(dipirona);

  // 12 kg child
  const dose12 = dipirona.calculateDose(12);
  assert.equal(dose12.calculatedValue, '12');
  assert.equal(dose12.unit, 'gotas');
  assert.ok(dose12.posologyText.includes('12 gotas'));

  // 45 kg child (capped at max 40 gotas)
  const dose45 = dipirona.calculateDose(45);
  assert.equal(dose45.calculatedValue, '40');

  // Baby under 5kg shows warning
  const dose4 = dipirona.calculateDose(4);
  assert.ok(dose4.warning?.includes('Contraindicado'));
});

test('Paracetamol Gotas calculates 1 to 1.5 drops per kg', () => {
  const paracetamol = findPediatricDrug('ped-paracetamol-gotas');
  assert.ok(paracetamol);

  const dose10 = paracetamol.calculateDose(10);
  assert.equal(dose10.calculatedValue, '10 a 15');
  assert.equal(dose10.unit, 'gotas');
  assert.ok(dose10.posologyText.includes('10 a 15 gotas'));
});

test('Amoxicilina 250mg/5mL calculates 50mg/kg/day divided in 3 doses (weight / 3 mL)', () => {
  const amox = findPediatricDrug('ped-amoxicilina-250');
  assert.ok(amox);

  // 12 kg child -> 4.0 mL
  const dose12 = amox.calculateDose(12);
  assert.equal(dose12.calculatedValue, '4');
  assert.equal(dose12.unit, 'mL');
  assert.ok(dose12.posologyText.includes('4 mL por via oral de 8 em 8 horas durante 10 dias'));

  // 15 kg child -> 5.0 mL
  const dose15 = amox.calculateDose(15);
  assert.equal(dose15.calculatedValue, '5');
});

test('Amoxicilina + Clavulanato 400mg/5mL BID calculates 0.3125 mL/kg/dose', () => {
  const amoxClav = findPediatricDrug('ped-amox-clav-400');
  assert.ok(amoxClav);

  // 16 kg child -> 16 * 0.3125 = 5.0 mL
  const dose16 = amoxClav.calculateDose(16);
  assert.equal(dose16.calculatedValue, '5');
  assert.equal(dose16.unit, 'mL');
  assert.ok(dose16.posologyText.includes('12 horas'));
});

test('Prednisolona 3mg/mL calculates 1mg/kg/day (weight / 3 mL)', () => {
  const pred = findPediatricDrug('ped-prednisolona-3');
  assert.ok(pred);

  // 15 kg child -> 15 / 3 = 5 mL
  const dose15 = pred.calculateDose(15);
  assert.equal(dose15.calculatedValue, '5');
  assert.equal(dose15.unit, 'mL');
  assert.ok(dose15.posologyText.includes('5 mL por via oral 1 vez ao dia'));
});

test('Fenoterol nebulization calculates 1 drop per 3 kg (min 3, max 10)', () => {
  const fenoterol = findPediatricDrug('ped-fenoterol-gotas');
  assert.ok(fenoterol);

  // 6 kg -> min 3 drops
  const dose6 = fenoterol.calculateDose(6);
  assert.equal(dose6.calculatedValue, '3');

  // 15 kg -> 15 / 3 = 5 drops
  const dose15 = fenoterol.calculateDose(15);
  assert.equal(dose15.calculatedValue, '5');

  // 40 kg -> max 10 drops
  const dose40 = fenoterol.calculateDose(40);
  assert.equal(dose40.calculatedValue, '10');
});

test('SRO calculates 10 mL/kg per episode', () => {
  const sro = findPediatricDrug('ped-sro-hidratacao');
  assert.ok(sro);

  const dose14 = sro.calculateDose(14);
  assert.equal(dose14.calculatedValue, '140');
  assert.ok(dose14.posologyText.includes('140 mL'));
});
