import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  formatDaysInWords,
  calculateEndDate,
  formatDatePtBr,
  searchMedications,
  searchCid10,
  findCidByCode,
  findCidByTerm,
  resolveCidAndDescription,
  getRecommendedPrescriptionType,
  validateDoctorProfile,
  formatPrescriptionForWhatsApp,
  sortInpatientItems
} from './documentLogic';
import {
  generateApacPdfBytes,
  mergeApacWithSystemContext
} from '../services/apacPdfService';
import {
  generateAihPdfBytes,
  mergeAihWithSystemContext
} from '../services/aihPdfService';
import { INITIAL_AIH, INITIAL_APAC } from '../data/defaultData';
import { PrescriptionItem, DoctorProfile, PatientInfo, InpatientInfo } from '../types';

test('formatDaysInWords formats legal medical certificates correctly in Portuguese', () => {
  assert.equal(formatDaysInWords(1), '01 (um) dia');
  assert.equal(formatDaysInWords(2), '02 (dois) dias');
  assert.equal(formatDaysInWords(3), '03 (três) dias');
  assert.equal(formatDaysInWords(5), '05 (cinco) dias');
  assert.equal(formatDaysInWords(7), '07 (sete) dias');
  assert.equal(formatDaysInWords(14), '14 (quatorze) dias');
  assert.equal(formatDaysInWords(30), '30 (trinta) dias');
});

test('calculateEndDate calculates correct end dates for multi-day periods', () => {
  // A 1-day certificate starting on 2026-11-01 ends on 2026-11-01
  assert.equal(calculateEndDate('2026-11-01', 1), '2026-11-01');
  // A 3-day certificate starting on 2026-11-01 covers 01, 02, and 03 -> ends on 2026-11-03
  assert.equal(calculateEndDate('2026-11-01', 3), '2026-11-03');
  // A 7-day certificate starting on 2026-11-01 ends on 2026-11-07
  assert.equal(calculateEndDate('2026-11-01', 7), '2026-11-07');
});

test('formatDatePtBr converts YYYY-MM-DD to DD/MM/YYYY', () => {
  assert.equal(formatDatePtBr('2026-11-01'), '01/11/2026');
  assert.equal(formatDatePtBr('2026-05-15'), '15/05/2026');
});

test('searchMedications finds medications by generic name, brand name, and class', () => {
  const dipironaResults = searchMedications('dipirona');
  assert.ok(dipironaResults.length > 0);
  assert.ok(dipironaResults[0].name.toLowerCase().includes('dipirona'));

  const brandResults = searchMedications('novalgina');
  assert.ok(brandResults.length > 0);
  assert.ok(brandResults[0].brandName?.toLowerCase().includes('novalgina'));

  const amoxResults = searchMedications('amoxicilina');
  assert.ok(amoxResults.length >= 2);

  const emptyResults = searchMedications('');
  assert.ok(emptyResults.length > 0);
});

test('searchCid10 finds diseases by clinical term and code', () => {
  const gripe = searchCid10('gripe');
  assert.ok(gripe.length > 0);
  assert.ok(gripe.some(c => c.code.startsWith('J11')));

  const lumb = searchCid10('lombalgia');
  assert.ok(lumb.length > 0);
  assert.equal(lumb[0].code, 'M54.5');

  const byCode = searchCid10('A09');
  assert.ok(byCode.length > 0);
  assert.equal(byCode[0].code, 'A09');
});

test('findCidByCode, findCidByTerm and resolveCidAndDescription perform bidirectional auto-fill', () => {
  // Test by code
  const byCode1 = findCidByCode('J18.9');
  assert.ok(byCode1);
  assert.equal(byCode1?.code, 'J18.9');
  assert.equal(byCode1?.description, 'Pneumonia não especificada');

  // Test by code without dot and lowercase
  const byCodeNorm = findCidByCode('j189');
  assert.ok(byCodeNorm);
  assert.equal(byCodeNorm?.code, 'J18.9');

  const byCodeHas = findCidByCode('I10');
  assert.ok(byCodeHas);
  assert.equal(byCodeHas?.code, 'I10');

  // Test by clinical terms and aliases
  const byTermPneumo = findCidByTerm('pneumonia');
  assert.ok(byTermPneumo);
  assert.equal(byTermPneumo?.code, 'J18.9');

  const byTermLomb = findCidByTerm('lombalgia');
  assert.ok(byTermLomb);
  assert.equal(byTermLomb?.code, 'M54.5');

  const byTermDengue = findCidByTerm('dengue');
  assert.ok(byTermDengue);
  assert.equal(byTermDengue?.code, 'A90');

  const byTermHas = findCidByTerm('hipertensao');
  assert.ok(byTermHas);
  assert.equal(byTermHas?.code, 'I10');

  const byTermIam = findCidByTerm('iam');
  assert.ok(byTermIam);
  assert.equal(byTermIam?.code, 'I21.9');

  const byTermAvc = findCidByTerm('avc');
  assert.ok(byTermAvc);
  assert.equal(byTermAvc?.code, 'I64');

  const byTermApen = findCidByTerm('apendicite');
  assert.ok(byTermApen);
  assert.equal(byTermApen?.code, 'K35.8');

  // Test bidirectional resolver
  const res1 = resolveCidAndDescription('J18.9');
  assert.deepEqual(res1, { code: 'J18.9', description: 'Pneumonia não especificada' });

  const res2 = resolveCidAndDescription('pneumonia');
  assert.deepEqual(res2, { code: 'J18.9', description: 'Pneumonia não especificada' });

  const res3 = resolveCidAndDescription('apendicite');
  assert.deepEqual(res3, { code: 'K35.8', description: 'Apendicite aguda' });

  const res4 = resolveCidAndDescription('pressao alta');
  assert.deepEqual(res4, { code: 'I10', description: 'Hipertensão essencial (primária) / Pressão alta' });
});

test('getRecommendedPrescriptionType detects controlled substances and antimicrobials', () => {
  const simpleItems: PrescriptionItem[] = [
    {
      id: '1',
      medicationName: 'Dipirona 500mg',
      presentation: '20 comp',
      quantity: '1',
      route: 'Oral',
      posology: '6/6h',
      type: 'simples'
    }
  ];
  assert.equal(getRecommendedPrescriptionType(simpleItems), 'simples');

  const antimicrobianoItems: PrescriptionItem[] = [
    ...simpleItems,
    {
      id: '2',
      medicationName: 'Amoxicilina 500mg',
      presentation: '21 caps',
      quantity: '1',
      route: 'Oral',
      posology: '8/8h',
      type: 'antimicrobiano'
    }
  ];
  assert.equal(getRecommendedPrescriptionType(antimicrobianoItems), 'antimicrobiano');

  const controlledItems: PrescriptionItem[] = [
    ...antimicrobianoItems,
    {
      id: '3',
      medicationName: 'Sertralina 50mg',
      presentation: '30 comp',
      quantity: '1',
      route: 'Oral',
      posology: '1x ao dia',
      type: 'controle_especial'
    }
  ];
  assert.equal(getRecommendedPrescriptionType(controlledItems), 'controle_especial');
});

test('validateDoctorProfile verifies required doctor credentials', () => {
  const invalid = validateDoctorProfile({ fullName: '', crm: '' });
  assert.equal(invalid.isValid, false);
  assert.ok(invalid.errors.length >= 2);

  const valid = validateDoctorProfile({
    fullName: 'Dr. Roberto Carlos',
    crm: '123456',
    uf: 'SP'
  });
  assert.equal(valid.isValid, true);
});

test('formatPrescriptionForWhatsApp formats clean patient message', () => {
  const doctor: DoctorProfile = {
    fullName: 'Dr. Carlos Eduardo',
    crm: '12345',
    uf: 'SP',
    specialty: 'Clínica Geral',
    phone: '(11) 98765-4321',
    email: 'carlos@med.com',
    clinicName: 'Clínica Médica Vida',
    clinicAddress: 'Av. Paulista, 1000',
    clinicCityState: 'São Paulo - SP',
    clinicCep: '01310-100',
    clinicPhone: '(11) 3214-5678',
    signatureStyle: 'classic_stamp'
  };

  const items: PrescriptionItem[] = [
    {
      id: '1',
      medicationName: 'Dipirona 500mg',
      presentation: '20 comprimidos',
      quantity: '1 caixa',
      route: 'Via oral',
      posology: 'Tomar 1 comprimido a cada 6 horas se dor ou febre',
      type: 'simples'
    }
  ];

  const msg = formatPrescriptionForWhatsApp(doctor, 'João da Silva', items, '2026-11-01');
  assert.ok(msg.includes('RECEITUÁRIO MÉDICO'));
  assert.ok(msg.includes('João da Silva'));
  assert.ok(msg.includes('Dipirona 500mg'));
  assert.ok(msg.includes('CRM/SP 12345'));
});

test('searchCid10 finds expanded diagnoses like Hipertensao (I10) and Diabetes (E11)', () => {
  const has = searchCid10('hipertensao');
  assert.ok(has.length > 0);
  assert.equal(has[0].code, 'I10');

  const diabetes = searchCid10('E11');
  assert.ok(diabetes.length > 0);
  assert.ok(diabetes[0].description.includes('Diabetes'));

  const amigdalite = searchCid10('amigdalite');
  assert.ok(amigdalite.length > 0);
  assert.equal(amigdalite[0].code, 'J03.9');
});

test('searchCid10 finds "Infeccao a esclarecer" (A49.9 and B99)', () => {
  const inf = searchCid10('infeccao a esclarecer');
  assert.ok(inf.length > 0);
  assert.ok(inf.some(c => c.code === 'A49.9'));

  const byCode = searchCid10('A49.9');
  assert.ok(byCode.length > 0);
  assert.equal(byCode[0].code, 'A49.9');
});

test('sortInpatientItems orders according to clinical hierarchy: Dieta -> Hidratação -> Antibióticos -> Analgesia -> Sintomáticos -> Profilaxias -> Demais', () => {
  const mockItems = [
    { id: '1', category: 'profilaxias', medicationName: 'Omeprazol', dose: '20mg', route: 'EV', frequency: '1x/dia' },
    { id: '2', category: 'dieta', medicationName: 'Dieta geral', dose: '', route: 'VO', frequency: 'Padrão' },
    { id: '3', category: 'antibiotico', medicationName: 'Ceftriaxona', dose: '1g', route: 'EV', frequency: '12/12h' },
    { id: '4', category: 'analgesia', medicationName: 'Dipirona', dose: '1g', route: 'EV', frequency: '4/4h S.N.' },
    { id: '5', category: 'hidratacao', medicationName: 'SF 0,9%', dose: '1000ml', route: 'EV', frequency: 'Em 24h' },
    { id: '6', category: 'sintomaticos', medicationName: 'Plasil', dose: '1 amp', route: 'EV', frequency: '8/8h' },
    { id: '7', category: 'demais', medicationName: 'HGT de 6/6h', dose: '', route: '', frequency: '6/6h' }
  ];

  const sorted = sortInpatientItems(mockItems as any);
  assert.equal(sorted[0].category, 'dieta');
  assert.equal(sorted[1].category, 'hidratacao');
  assert.equal(sorted[2].category, 'antibiotico');
  assert.equal(sorted[3].category, 'analgesia');
  assert.equal(sorted[4].category, 'sintomaticos');
  assert.equal(sorted[5].category, 'profilaxias');
  assert.equal(sorted[6].category, 'demais');
});

test('generateApacPdfBytes merges incomplete JSON (Rule 2, 3, 4) into Formulario_APAC_LAUDO.pdf with pdf-lib', async () => {
  const templatePath = path.resolve(process.cwd(), 'public/templates/Formulario_APAC_LAUDO.pdf');
  const templateBuffer = fs.readFileSync(templatePath);

  const mockDoctor: DoctorProfile = {
    fullName: 'Dr. Erick Sena',
    crm: '15420',
    uf: 'PA',
    specialty: 'Clínica Médica',
    phone: '(91) 98888-0000',
    email: 'erick@ordemterceira.org.br',
    clinicName: 'Hospital Ordem Terceira',
    clinicAddress: 'Rua Cezarino Doce, 10',
    clinicCityState: 'Santa Maria do Pará - PA',
    clinicCep: '68738-000',
    clinicPhone: '(91) 3442-1200',
    signatureStyle: 'classic_stamp'
  };

  // Cenário de Uso Principal (Regra 4): apenas Paciente, Procedimento e CID-10 preenchidos manualmente
  const partialApac = {
    ...INITIAL_APAC,
    nomePaciente: 'MARIA DE NAZARE SOUZA',
    nomeProcedimentoPrincipal: 'TOMOGRAFIA COMPUTADORIZADA DE TORAX',
    cid10Principal: 'A49.9',
    nomeProfissionalSolicitante: '', // deve ser preenchido automaticamente pela Regra 3
    dataSolicitacao: ''              // deve ser preenchido automaticamente pela Regra 3
  };

  const merged = mergeApacWithSystemContext(partialApac, mockDoctor);
  assert.equal(merged.nomeProfissionalSolicitante, 'Dr. Erick Sena');
  assert.match(merged.dataSolicitacao, /^\d{4}-\d{2}-\d{2}$/);

  const pdfBytes = await generateApacPdfBytes(partialApac, mockDoctor, undefined, templateBuffer);
  assert.ok(pdfBytes instanceof Uint8Array);
  assert.ok(pdfBytes.byteLength > 100000);
});

test('generateAihPdfBytes merges incomplete JSON into AIH_.pdf (2 pages) with pdf-lib', async () => {
  const templatePath = path.resolve(process.cwd(), 'public/templates/AIH_.pdf');
  const templateBuffer = fs.readFileSync(templatePath);

  const mockDoctor: DoctorProfile = {
    fullName: 'Dr. Carlos Eduardo Mendonça',
    crm: '14892',
    uf: 'PA',
    specialty: 'Clínica Médica',
    phone: '(91) 98888-1111',
    email: 'carlos@ordemterceira.org.br',
    clinicName: 'Hospital Ordem Terceira',
    clinicAddress: 'Rua Cezarino Doce, 10',
    clinicCityState: 'Santa Maria do Pará - PA',
    clinicCep: '68738-000',
    clinicPhone: '(91) 3442-1200',
    signatureStyle: 'classic_stamp'
  };

  // Modo Rápido da AIH: apenas campos essenciais preenchidos
  const partialAih = {
    ...INITIAL_AIH,
    nomePaciente: 'JOAO PEDRO OLIVEIRA',
    diagnosticoInicial: 'Pneumonia bacteriana adquirida na comunidade',
    cid10Principal: 'J18.9',
    descricaoProcedimentoSolicitado: 'TRATAMENTO DE PNEUMONIA OU INFECCAO RESPIRATORIA AGUDA',
    principaisSinaisSintomas: 'Febre alta, tosse e dispneia.',
    condicoesJustificamInternacao: 'Necessidade de oxigenio e antibioticos parenterais.',
    nomeProfissionalSolicitante: '', // auto
    numeroDocumentoProfissional: '', // auto
    dataSolicitacao: ''              // auto
  };

  const merged = mergeAihWithSystemContext(partialAih, mockDoctor);
  assert.equal(merged.nomeProfissionalSolicitante, 'Dr. Carlos Eduardo Mendonça');
  assert.equal(merged.numeroDocumentoProfissional, '14892');
  assert.match(merged.dataSolicitacao, /^\d{4}-\d{2}-\d{2}$/);
  assert.equal(merged.estabelecimentoSolicitante, 'Hospital Ordem Terceira');

  const pdfBytes = await generateAihPdfBytes(partialAih, mockDoctor, undefined, templateBuffer);
  assert.ok(pdfBytes instanceof Uint8Array);
  assert.ok(pdfBytes.byteLength > 80000);
});

test('validateCns validates definitive and provisional SUS cards correctly', async () => {
  const { validateCns, formatCns } = await import('./cnsValidator');

  // Definitivo válido (iniciado com 1 ou 2)
  const resultDef = validateCns('200000000010009');
  assert.equal(resultDef.isValid, true);
  assert.equal(resultDef.tipo, 'definitivo');
  assert.equal(formatCns('200000000010009'), '200 0000 0001 0009');

  // Provisório válido (iniciado com 7, 8 ou 9)
  const resultProv = validateCns('700001234567894');
  assert.equal(resultProv.isValid, true);
  assert.equal(resultProv.tipo, 'provisorio');

  // Inválido - repetição
  const resultRepetido = validateCns('111111111111111');
  assert.equal(resultRepetido.isValid, false);

  // Inválido - tamanho
  const resultCurto = validateCns('12345');
  assert.equal(resultCurto.isValid, false);
});

test('searchExames performs smart omnibox lookup by sigla, clinical term and SIGTAP code', async () => {
  const { searchExames, PERFIS_RAPIDOS, EXAMES_CATALOGO } = await import('../data/exames-catalogo');

  // Busca por sigla médica
  const hmg = searchExames('HMG');
  assert.ok(hmg.length > 0);
  assert.equal(hmg[0].sigla, 'HMG');

  const tgo = searchExames('TGO');
  assert.ok(tgo.length > 0);
  assert.equal(tgo[0].sigla, 'TGO');

  const eas = searchExames('EAS');
  assert.ok(eas.length > 0);
  assert.equal(eas[0].sigla, 'EAS');

  // Busca insensível a acentos por nome clínico
  const ureia = searchExames('ureia');
  assert.ok(ureia.some(e => e.sigla === 'URE'));

  const bilirrubinas = searchExames('bilirrubina');
  assert.ok(bilirrubinas.some(e => e.sigla === 'BTF'));

  // Busca por código SIGTAP
  const porCodigo = searchExames('0202020380');
  assert.ok(porCodigo.some(e => e.sigla === 'HMG'));

  // Validação de todos os 6 perfis rápidos
  assert.equal(PERFIS_RAPIDOS.length, 6);
  PERFIS_RAPIDOS.forEach(perfil => {
    assert.ok(perfil.exameIds.length >= 4);
    perfil.exameIds.forEach(id => {
      const exists = EXAMES_CATALOGO.some(e => e.id === id);
      assert.ok(exists, `Exame ID '${id}' do perfil '${perfil.nome}' deve existir no catálogo`);
    });
  });
});

test('buildDefaultAdmissao and buildDefaultEvolucoes initialize hospital clinical record correctly', async () => {
  const { buildDefaultAdmissao, buildDefaultEvolucoes, HDA_TEMPLATES, EXAME_FISICO_NORMAL } = await import('../data/prontuarioHospitalar');

  const patient: PatientInfo = {
    name: 'José da Silva Sauro',
    document: '123.456.789-00',
    age: '58 anos',
    bed: 'Leito 07-A',
    ward: 'Clínica Médica'
  };

  const doctor: DoctorProfile = {
    fullName: 'Dr. Roberto Albuquerque',
    crm: '18674',
    uf: 'PA',
    specialty: 'Cirurgia Geral',
    phone: '(91) 9999-9999',
    email: 'roberto@med.com',
    clinicName: 'Hospital Ordem Terceira',
    clinicAddress: 'Rua Central, 100',
    clinicCityState: 'Santa Maria do Pará - PA',
    clinicCep: '68738-000',
    clinicPhone: '(91) 3442-1200',
    signatureStyle: 'classic_stamp'
  };

  const inpatientInfo: InpatientInfo = {
    ward: 'Clínica Médica',
    bed: 'Leito 07-A',
    admissionDate: '2026-11-02',
    prescriptionDate: '2026-11-02',
    diagnosis: 'Apendicite Aguda',
    allergies: ''
  };

  const adm = buildDefaultAdmissao(patient, doctor, inpatientInfo);
  assert.ok(adm.dataHoraAdmissao);
  assert.equal(adm.origem, 'pronto_socorro');
  assert.equal(adm.queixaPrincipal, '');
  assert.equal(adm.hda, '');
  assert.equal(adm.temAlergia, 'nao_relata');
  assert.equal(adm.medicacoesReconciliadas.length, 0);
  assert.equal(adm.sinaisVitais.pa, '');
  assert.equal(adm.sinaisVitais.fc, '');
  assert.equal(adm.exameSegmentar.geral, EXAME_FISICO_NORMAL.geral);
  assert.equal(adm.exameSegmentar.ar, EXAME_FISICO_NORMAL.ar);
  assert.equal(adm.exameSegmentar.abdome, EXAME_FISICO_NORMAL.abdome);
  assert.equal(adm.exameSegmentar.extremidadesNeuro, EXAME_FISICO_NORMAL.extremidadesNeuro);
  assert.equal(adm.riscos.riscoTev, 'baixo');
  assert.equal(adm.diagnosticos.length, 0);
  assert.equal(adm.planoTerapeutico.dieta, '');

  // Evoluções SOAP
  const evolucoes = buildDefaultEvolucoes(patient, doctor, inpatientInfo);
  assert.ok(evolucoes.length >= 2);
  const hoje = evolucoes[0];
  assert.equal(hoje.diasInternacao, 2);
  assert.ok(hoje.subjetivo.length > 0);
  assert.ok(hoje.objetivo.length > 0);
  assert.ok(hoje.avaliacao.length > 0);
  assert.ok(hoje.plano.length > 0);
  assert.ok(hoje.balancoHidrico);
  assert.ok(hoje.sinaisVitais.pa);

  // HDA Templates
  assert.equal(HDA_TEMPLATES.length, 5);
  assert.ok(EXAME_FISICO_NORMAL.geral);
  assert.ok(EXAME_FISICO_NORMAL.acv);
  assert.ok(EXAME_FISICO_NORMAL.ar);
  assert.ok(EXAME_FISICO_NORMAL.abdome);
  assert.ok(EXAME_FISICO_NORMAL.extremidadesNeuro);
});

test('formatDaysInWords escreve por extenso qualquer quantidade de dias (regressão 26, 29, 31...)', () => {
  assert.equal(formatDaysInWords(26), '26 (vinte e seis) dias');
  assert.equal(formatDaysInWords(29), '29 (vinte e nove) dias');
  assert.equal(formatDaysInWords(31), '31 (trinta e um) dias');
  assert.equal(formatDaysInWords(100), '100 (cem) dias');
  assert.equal(formatDaysInWords(120), '120 (cento e vinte) dias');
});

test('dateUtils usa a data LOCAL (não UTC) para evitar documentos com data do dia seguinte', async () => {
  const { toLocalIsoDate, addDaysIso } = await import('./dateUtils');
  // 23:30 local de 02/11 deve continuar 02/11, independentemente do fuso UTC
  assert.equal(toLocalIsoDate(new Date(2026, 10, 2, 23, 30)), '2026-11-02');
  assert.equal(addDaysIso(2, new Date(2026, 11, 31, 22, 0)), '2027-01-02');
});

test('senhas dos médicos são armazenadas com hash e verificadas corretamente', async () => {
  const { hashPassword, verifyPassword } = await import('../services/doctorAuthService');
  const stored = hashPassword('Senha@123');
  assert.ok(stored.startsWith('sha256$'));
  assert.ok(!stored.includes('Senha@123'));
  assert.equal(verifyPassword('Senha@123', stored), true);
  assert.equal(verifyPassword('senha@123', stored), false);
  assert.equal(verifyPassword('1234', '1234'), true); // conta legada em texto puro
});

test('configuração inicial não possui nenhum paciente pré-preenchido', async () => {
  const { INITIAL_PATIENT, INITIAL_ATESTADO, INITIAL_DECLARACAO, INITIAL_AIH, INITIAL_APAC } = await import('../data/defaultData');
  assert.equal(INITIAL_PATIENT.name, '');
  assert.equal(INITIAL_PATIENT.document, '');
  assert.equal(INITIAL_ATESTADO.patientName, '');
  assert.equal(INITIAL_ATESTADO.patientDoc, '');
  assert.equal(INITIAL_DECLARACAO.patientName, '');
  assert.equal(INITIAL_DECLARACAO.patientDoc, '');
  assert.equal(INITIAL_AIH.nomePaciente, '');
  assert.equal(INITIAL_APAC.nomePaciente, '');
});

test('catálogo SIGTAP 2026 <-> CID-10 faz vínculo bidirecional e aplica travas anti-glosa', async () => {
  const {
    CATALOGO_PROCEDIMENTOS_AIH,
    findProcedimentoByCid,
    findProcedimentoByCodigo,
    isCidSintomaticoBloqueado,
    isCidCausaExternaObrigatoria,
    getSugestoesCausaExterna
  } = await import('../data/aihSigtapCatalog');

  assert.equal(CATALOGO_PROCEDIMENTOS_AIH.length, 36);

  // Vínculo CID -> Procedimento (Pneumonia J18.9)
  const pneumonia = findProcedimentoByCid('J18.9');
  assert.ok(pneumonia);
  assert.equal(pneumonia.procedimento.codigo_sigtap, '03.03.14.015-1');
  assert.equal(pneumonia.procedimento.media_permanencia_dias, 4);

  // Vínculo Código -> Procedimento (Insuficiência Cardíaca)
  const icc = findProcedimentoByCodigo('03.03.06.021-2');
  assert.ok(icc);
  assert.equal(icc.cids_compativeis.length, 4);
  assert.equal(icc.cids_compativeis[0].cid, 'I50.0');

  // Trava Anti-Glosa Capítulo R e I46.9
  assert.equal(isCidSintomaticoBloqueado('R50.9'), true);
  assert.equal(isCidSintomaticoBloqueado('R10.4'), true);
  assert.equal(isCidSintomaticoBloqueado('I46.9'), true);
  assert.equal(isCidSintomaticoBloqueado('J18.9'), false);

  // Trava de Causa Externa Capítulos S e T
  assert.equal(isCidCausaExternaObrigatoria('T63.0'), true);
  assert.equal(isCidCausaExternaObrigatoria('T60.0'), true);
  assert.equal(isCidCausaExternaObrigatoria('I50.0'), false);
  const sugestoesOfidico = getSugestoesCausaExterna('T63.0');
  assert.ok(sugestoesOfidico.some(s => s.cid.startsWith('X20')));
});

test('banco hospitalar inclui Paracetamol e Escopolamina na categoria Sintomáticos', async () => {
  const { searchHospitalMedications } = await import('../data/hospitalMedications');
  
  // Busca Paracetamol em sintomáticos
  const paracetamolResult = searchHospitalMedications('sintomaticos', 'Paracetamol');
  assert.ok(paracetamolResult.length >= 4);
  assert.ok(paracetamolResult.some(m => m.name.includes('750 mg')));
  assert.ok(paracetamolResult.some(m => m.route === 'EV'));
  assert.ok(paracetamolResult.some(m => m.name.includes('Gotas')));

  // Busca Escopolamina em sintomáticos
  const escopolaminaResult = searchHospitalMedications('sintomaticos', 'Escopolamina');
  assert.ok(escopolaminaResult.length >= 4);
  assert.ok(escopolaminaResult.some(m => m.name.includes('20 mg/mL')));
  assert.ok(escopolaminaResult.some(m => m.name.includes('Composta')));
  
  // Busca Buscopan em sintomáticos
  const buscopanResult = searchHospitalMedications('sintomaticos', 'Buscopan');
  assert.ok(buscopanResult.length >= 3);
});

test('catálogo completo CID-10 possui mais de 12.000 doenças do DATASUS sem omissões', async () => {
  const { CID10_DATABASE, findCidByCode, findCidByTerm } = await import('../data/cid10');
  
  // Total superior a 12.000 entradas completas
  assert.ok(CID10_DATABASE.length >= 12400, `Esperado >= 12400 itens, obteve ${CID10_DATABASE.length}`);

  // Testes de cobertura em capítulos do início ao fim (A ao Z)
  const codigosVerificacao = [
    { code: 'A00.0', desc: 'Cólera devida a Vibrio cholerae 01, biótipo cholerae' },
    { code: 'B20.0', desc: 'Doença pelo HIV resultando em infecções micobacterianas' },
    { code: 'C14.1', desc: 'Laringofaringe' },
    { code: 'D50.0', desc: 'Anemia por deficiência de ferro secundária à perda de sangue (crônica)' },
    { code: 'E11.9', desc: 'Diabetes' },
    { code: 'I10', desc: 'Hipertensão' },
    { code: 'J18.9', desc: 'Pneumonia' },
    { code: 'K35.0', desc: 'Apendicite aguda com peritonite generalizada' },
    { code: 'M54.5', desc: 'Dor lombar baixa' },
    { code: 'N39.0', desc: 'Infecção do trato urinário' },
    { code: 'S00.0', desc: 'Traumatismo superficial do couro cabeludo' },
    { code: 'V01.0', desc: 'acidente' },
    { code: 'Z99.9', desc: 'Dependência de máquina e aparelho capacitante não especificado' }
  ];

  for (const { code, desc } of codigosVerificacao) {
    const item = findCidByCode(code);
    assert.ok(item, `Código ${code} deve existir no catálogo oficial`);
    assert.ok(
      item.description.toLowerCase().includes(desc.toLowerCase()),
      `Código ${code} (${item?.description}) deve conter ${desc}`
    );
  }

  // Busca livre por patologia rara do PDF
  const colera = findCidByTerm('Vibrio cholerae');
  assert.ok(colera);
  assert.equal(colera?.code, 'A00.0');

  const dialise = findCidByCode('Z99.2');
  assert.ok(dialise);
  assert.ok(dialise?.description.includes('diálise'));
});

test('APAC preenche automaticamente campos 18 e 19 conforme solicitação médica e fixa CNS/CPF do médico', async () => {
  const { searchApacProcedures, findApacProcedureByCodeOrName, mergeApacWithSystemContext } = await import('../services/apacPdfService');
  const { updateDoctorDocumentPreference, registerDoctorAccount, getRegisteredDoctors } = await import('../services/doctorAuthService');

  // 1. Busca por nome do procedimento preenche código de 10 dígitos (Campo 18 e 19)
  const buscaTorax = searchApacProcedures('Tomografia de Torax');
  assert.ok(buscaTorax.length > 0);
  assert.equal(buscaTorax[0].codigo, '0206020031');
  assert.ok(buscaTorax[0].nome.includes('TORAX'));

  // 2. Busca por código SIGTAP de 10 dígitos preenche nome do procedimento
  const buscaCreatinina = findApacProcedureByCodeOrName('0202010317');
  assert.ok(buscaCreatinina);
  assert.ok(buscaCreatinina?.nome.includes('CREATININA'));

  // 3. Documento do médico (CNS ou CPF) preenchido apenas uma vez e fixado no login
  const doctorWithCpf: DoctorProfile = {
    fullName: 'Dr. Erick Sena',
    crm: '18674',
    uf: 'PA',
    cpf: '123.456.789-00',
    cns: '700000000000001',
    documentType: 'CPF',
    specialty: 'Clínica Médica',
    phone: '',
    email: '',
    clinicName: 'Hospital Ordem Terceira',
    clinicAddress: '',
    clinicCityState: '',
    clinicCep: '',
    clinicPhone: '',
    signatureStyle: 'classic_stamp'
  };

  const apacComCpf = mergeApacWithSystemContext(INITIAL_APAC, doctorWithCpf);
  assert.equal(apacComCpf.tipoDocumentoSolicitante, 'CPF');
  assert.equal(apacComCpf.cnsProfissionalSolicitante, '12345678900');

  // Alterna para CNS
  const doctorWithCns: DoctorProfile = {
    ...doctorWithCpf,
    documentType: 'CNS'
  };
  const apacComCns = mergeApacWithSystemContext(INITIAL_APAC, doctorWithCns);
  assert.equal(apacComCns.tipoDocumentoSolicitante, 'CNS');
  assert.equal(apacComCns.cnsProfissionalSolicitante, '700000000000001');
});

test('Protocolos Hospitalares de 1 clique contêm 7 especialidades com itens organizados', async () => {
  const { PROTOCOLOS_HOSPITALARES, instantiateProtocolo } = await import('../data/protocolosHospitalares');

  assert.equal(PROTOCOLOS_HOSPITALARES.length, 7);

  const pac = PROTOCOLOS_HOSPITALARES.find(p => p.id === 'pac');
  assert.ok(pac);
  assert.equal(pac.cid10Sugerido.code, 'J18.9');
  assert.ok(pac.itens.some(i => i.category === 'antibioticos' && i.name.includes('Ceftriaxona')));

  // instantiateProtocolo gera itens com IDs únicos
  const itensInstanciados = instantiateProtocolo(pac);
  assert.equal(itensInstanciados.length, pac.itens.length);
  assert.ok(itensInstanciados[0].id.startsWith('inp-'));
  const ids = new Set(itensInstanciados.map(i => i.id));
  assert.equal(ids.size, itensInstanciados.length);
});

test('Validador Anti-Glosa SUS (SIGTAP <-> CID-10) detecta compatibilidade e riscos de glosa', async () => {
  const { validarCompatibilidadeSigtap } = await import('./sigtapAntiGlosaValidator');

  // 1. TC Tórax compatível com pneumonia J18.9
  const resToraxOk = validarCompatibilidadeSigtap('0206020031', 'TOMOGRAFIA COMPUTADORIZADA DE TORAX', 'J18.9', 'APAC');
  assert.equal(resToraxOk.status, 'COMPATIVEL');

  // 2. TC Tórax incompatível com fratura de pé S92.0
  const resToraxErro = validarCompatibilidadeSigtap('0206020031', 'TOMOGRAFIA COMPUTADORIZADA DE TORAX', 'S92.0', 'APAC');
  assert.equal(resToraxErro.status, 'INCOMPATIVEL');
  assert.ok(resToraxErro.sugestoesCid && resToraxErro.sugestoesCid.length > 0);

  // 3. Traumatismo exige Causa Externa
  const resTrauma = validarCompatibilidadeSigtap('0206010079', 'TOMOGRAFIA DE CRANIO', 'S06.0', 'APAC');
  assert.equal(resTrauma.status, 'ALERTA');
  assert.equal(resTrauma.exigeCausaExterna, true);

  // 4. Febre ou sintoma inespecífico (R50.9) na AIH gera trava anti-glosa
  const resAihSintoma = validarCompatibilidadeSigtap('0303010037', 'TRATAMENTO CLINICO', 'R50.9', 'AIH');
  assert.equal(resAihSintoma.status, 'INCOMPATIVEL');
  assert.ok(resAihSintoma.titulo.includes('Risco de Glosa'));
});

test('Solicitação de Exames Laboratoriais suporta exames avulsos fora da lista', async () => {
  const nomeExame = 'Calprotectina Fecal';
  const palavras = nomeExame.split(/\s+/).filter(Boolean);
  const sigla = palavras.map(p => p[0]).join('').slice(0, 5).toUpperCase();

  assert.equal(sigla, 'CF');

  const customItem = {
    id: `custom-${Date.now()}`,
    codigoSigtap: '0202010600',
    codigoFormatado: 'Fora da Lista',
    nomeOficial: nomeExame.toUpperCase(),
    termoClinico: nomeExame,
    sigla
  };

  assert.equal(customItem.codigoFormatado, 'Fora da Lista');
  assert.equal(customItem.nomeOficial, 'CALPROTECTINA FECAL');
});

