import { Medication } from '../../types';

export const CARDIOVASCULAR_MEDICATIONS: Medication[] = [
  // ==========================================
  // BLOQUEADORES DOS RECEPTORES DE ANGIOTENSINA (BRAs)
  // ==========================================
  {
    id: 'losartana-50-cp',
    name: 'Losartana Potássica 50mg',
    genericName: 'Losartana Potássica',
    brandName: 'Aradois / Cozaar 50mg',
    class: 'Anti-hipertensivo / Bloqueador dos Receptores de Angiotensina II (BRA)',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '50mg - Comprimidos revestidos (caixa com 30)',
    availablePresentations: [
      '50mg - Comprimidos (caixa com 30)',
      '100mg - Comprimidos (caixa com 30)'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral uma vez ao dia pela manhã, de uso contínuo.',
    instructions: 'Monitorar pressão arterial periodicamente e função renal/potássio sérico anualmente.'
  },
  {
    id: 'losartana-100-cp',
    name: 'Losartana Potássica 100mg',
    genericName: 'Losartana Potássica',
    brandName: 'Aradois 100mg',
    class: 'Anti-hipertensivo BRA Dose Máxima',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '100mg - Comprimidos revestidos (caixa com 30)',
    availablePresentations: ['100mg - Comprimidos (caixa com 30)'],
    defaultPosology: 'Tomar 1 comprimido por via oral 1 vez ao dia (ou 50mg de 12/12h), de uso contínuo.',
    instructions: 'Tomar sempre no mesmo horário com água.'
  },
  {
    id: 'losartana-hct-50-12',
    name: 'Losartana Potássica + Hidroclorotiazida (50mg + 12,5mg)',
    genericName: 'Losartana Potássica + Hidroclorotiazida',
    brandName: 'Aradois HCT / Hyzaar',
    class: 'Anti-hipertensivo BRA + Diurético Tiazídico Combinado',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '50mg + 12,5mg - Comprimidos revestidos (caixa com 30)',
    availablePresentations: [
      '50mg + 12,5mg - Comprimidos (caixa com 30)',
      '100mg + 25mg - Comprimidos (caixa com 30)'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral uma vez ao dia pela manhã, de uso contínuo.',
    instructions: 'Associação sinérgica de primeira linha para controle pressórico.'
  },
  {
    id: 'valsartana-160-cp',
    name: 'Valsartana 160mg',
    genericName: 'Valsartana',
    brandName: 'Diovan 160mg',
    class: 'Anti-hipertensivo e Protetor Cardiovascular BRA',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '160mg - Comprimidos revestidos (caixa com 28)',
    availablePresentations: [
      '80mg - Comprimidos (caixa com 28)',
      '160mg - Comprimidos (caixa com 28)',
      '320mg - Comprimidos (caixa com 28)'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral 1 vez ao dia pela manhã, de uso contínuo.',
    instructions: 'Excelente proteção cardiovascular pós-infarto e na insuficiência cardíaca.'
  },
  {
    id: 'olmesartana-20-cp',
    name: 'Olmesartana Medoxomila 20mg',
    genericName: 'Olmesartana Medoxomila',
    brandName: 'Benicar 20mg',
    class: 'Anti-hipertensivo BRA Potente',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '20mg - Comprimidos revestidos (caixa com 30)',
    availablePresentations: [
      '20mg - Comprimidos (caixa com 30)',
      '40mg - Comprimidos (caixa com 30)'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral 1 vez ao dia pela manhã.',
    instructions: 'Manter uso diário ininterrupto.'
  },

  // ==========================================
  // INIBIDORES DA ECA (IECAs)
  // ==========================================
  {
    id: 'enalapril-10-cp',
    name: 'Maleato de Enalapril 10mg',
    genericName: 'Maleato de Enalapril',
    brandName: 'Renitec 10mg',
    class: 'Inibidor da Enzima Conversora de Angiotensina (IECA)',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '10mg - Comprimidos (caixa com 30)',
    availablePresentations: [
      '5mg - Comprimidos (caixa com 30)',
      '10mg - Comprimidos (caixa com 30)',
      '20mg - Comprimidos (caixa com 30)'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral a cada 12 horas (ou 20mg 1x ao dia), de uso contínuo.',
    instructions: 'Se surgir tosse seca persistente (efeito colateral de classe dos IECAs por acúmulo de bradicinina), retornar para substituição por BRA.'
  },
  {
    id: 'captopril-25-cp',
    name: 'Captopril 25mg',
    genericName: 'Captopril',
    brandName: 'Capoten 25mg',
    class: 'IECA de Curta Ação / Urgências Hipertensivas',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '25mg - Comprimidos (caixa com 30)',
    availablePresentations: [
      '25mg - Comprimidos (caixa com 30)',
      '50mg - Comprimidos (caixa com 30)'
    ],
    defaultPosology: 'Urgência hipertensiva em pronto atendimento: 1 comprimido de 25mg sublingual/oral; manutenção ambulatorial: 1 comprimido de 8/8h em jejum.',
    instructions: 'Deve ser tomado 1 hora antes das refeições.'
  },
  {
    id: 'ramipril-5-cp',
    name: 'Ramipril 5mg',
    genericName: 'Ramipril',
    brandName: 'Triatec 5mg',
    class: 'IECA Protetor Endotelial e Renal de Longa Ação',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '5mg - Comprimidos (caixa com 30)',
    availablePresentations: [
      '2,5mg - Comprimidos (caixa com 30)',
      '5mg - Comprimidos (caixa com 30)'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral uma vez ao dia pela manhã, de uso contínuo.',
    instructions: 'Tomar com água antes ou após refeições.'
  },

  // ==========================================
  // BLOQUEADORES DOS CANAIS DE CÁLCIO (BCCs)
  // ==========================================
  {
    id: 'anlodipino-5-cp',
    name: 'Besilato de Anlodipino 5mg',
    genericName: 'Besilato de Anlodipino',
    brandName: 'Norvasc 5mg',
    class: 'Bloqueador dos Canais de Cálcio Di-hidropiridínico',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '5mg - Comprimidos (caixa com 30)',
    availablePresentations: [
      '5mg - Comprimidos (caixa com 30)',
      '10mg - Comprimidos (caixa com 30)'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral uma vez ao dia pela manhã, de uso contínuo.',
    instructions: 'Pode causar edema maleolar periférico vespertino benigno. Não requer suspensão a menos que sintomático.'
  },
  {
    id: 'anlodipino-10-cp',
    name: 'Besilato de Anlodipino 10mg',
    genericName: 'Besilato de Anlodipino',
    brandName: 'Norvasc 10mg',
    class: 'Bloqueador dos Canais de Cálcio Anti-hipertensivo',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '10mg - Comprimidos (caixa com 30)',
    availablePresentations: ['10mg - Comprimidos (caixa com 30)'],
    defaultPosology: 'Tomar 1 comprimido por via oral 1 vez ao dia pela manhã.',
    instructions: 'Tomar diariamente com água.'
  },
  {
    id: 'nifedipino-retard-20',
    name: 'Nifedipino 20mg Retard',
    genericName: 'Nifedipino Retard',
    brandName: 'Adalat Retard 20mg',
    class: 'Bloqueador dos Canais de Cálcio de Liberação Retardada',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '20mg - Comprimidos revestidos de liberação prolongada (caixa com 30)',
    availablePresentations: [
      '20mg - Comprimidos Retard (caixa com 30)',
      '30mg - Comprimidos OROS (caixa com 30)'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral a cada 12 horas, deglutido inteiro.',
    instructions: 'NUNCA partir ou mastigar o comprimido de liberação prolongada.'
  },

  // ==========================================
  // DIURÉTICOS
  // ==========================================
  {
    id: 'hidroclorotiazida-25-cp',
    name: 'Hidroclorotiazida 25mg',
    genericName: 'Hidroclorotiazida',
    brandName: 'Clorana 25mg',
    class: 'Diurético Tiazídico Anti-hipertensivo',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '25mg - Comprimidos (caixa com 30)',
    availablePresentations: [
      '25mg - Comprimidos (caixa com 30)',
      '50mg - Comprimidos (caixa com 30)'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral 1 vez ao dia pela manhã com o café, de uso contínuo.',
    instructions: 'Tomar pela manhã para evitar noctúria (acordar à noite para urinar). Monitorar potássio e ácido úrico.'
  },
  {
    id: 'clortalidona-25-cp',
    name: 'Clortalidona 25mg',
    genericName: 'Clortalidona',
    brandName: 'Higroton 25mg',
    class: 'Diurético Tiazida-like de Meia-vida Longa',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '25mg - Comprimidos (caixa com 30)',
    availablePresentations: [
      '12,5mg - Comprimidos (caixa com 30)',
      '25mg - Comprimidos (caixa com 30)'
    ],
    defaultPosology: 'Tomar 1/2 a 1 comprimido por via oral pela manhã em jejum ou desjejum.',
    instructions: 'Ação diurética por até 48 a 72 horas.'
  },
  {
    id: 'indapamida-15-sr',
    name: 'Indapamida 1,5mg Liberação Prolongada',
    genericName: 'Indapamida SR',
    brandName: 'Natrilix SR 1,5mg',
    class: 'Diurético Tiazida-like Neutro Metabólico',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '1,5mg - Comprimidos revestidos de liberação prolongada (caixa com 30)',
    availablePresentations: ['1,5mg - Comprimidos (caixa com 30)'],
    defaultPosology: 'Tomar 1 comprimido por via oral pela manhã, deglutido inteiro.',
    instructions: 'Excelente perfil metabólico sem alteração significativa da glicemia ou lípides.'
  },
  {
    id: 'furosemida-40-cp',
    name: 'Furosemida 40mg',
    genericName: 'Furosemida',
    brandName: 'Lasix 40mg',
    class: 'Diurético de Alça de Alta Potência',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '40mg - Comprimidos (caixa com 20 ou 30)',
    availablePresentations: [
      '40mg - Comprimidos (caixa com 20)',
      '20mg/2mL - Ampola injetável EV/IM'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral pela manhã em jejum (ou até 80mg se edema moderado a grave).',
    instructions: 'Tomar pela manhã. Indicado para controle de edema secundário a insuficiência cardíaca, cirrose e síndrome nefrótica.'
  },
  {
    id: 'furosemida-ampola-20mg',
    name: 'Furosemida 20mg/2mL Solução Injetável',
    genericName: 'Furosemida',
    brandName: 'Lasix Injetável',
    class: 'Diurético de Alça Parenteral de Emergência',
    type: 'simples',
    defaultRoute: 'Uso intravenoso',
    defaultPresentation: '20mg/2mL - Ampola EV/IM',
    availablePresentations: ['20mg/2mL - Ampola'],
    defaultPosology: 'Edema agudo de pulmão / descompensação cardíaca: 20 a 40mg (1 a 2 ampolas) EV em bolus lento de 2 minutos.',
    instructions: 'Ação diurética e venodilatadora quase imediata (5 a 15 minutos).'
  },
  {
    id: 'espironolactona-25-cp',
    name: 'Espironolactona 25mg',
    genericName: 'Espironolactona',
    brandName: 'Aldactone 25mg',
    class: 'Antagonista da Aldosterona / Diurético Poupador de Potássio',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '25mg - Comprimidos (caixa com 30)',
    availablePresentations: [
      '25mg - Comprimidos (caixa com 30)',
      '50mg - Comprimidos (caixa com 30)',
      '100mg - Comprimidos (caixa com 30)'
    ],
    defaultPosology: 'Insuficiência cardíaca com fração de ejeção reduzida: tomar 1 comprimido (25mg) por via oral 1 vez ao dia pela manhã.',
    instructions: 'Reduz mortalidade na IC. Monitorar potássio sérico (risco de hipercalemia se associado a IECA/BRA).'
  },

  // ==========================================
  // BETABLOQUEADORES
  // ==========================================
  {
    id: 'atenolol-50-cp',
    name: 'Atenolol 50mg',
    genericName: 'Atenolol',
    brandName: 'Atenol 50mg',
    class: 'Betabloqueador Cardiosseletivo Beta-1',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '50mg - Comprimidos (caixa com 30)',
    availablePresentations: [
      '25mg - Comprimidos (caixa com 30)',
      '50mg - Comprimidos (caixa com 30)',
      '100mg - Comprimidos (caixa com 30)'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral uma vez ao dia pela manhã, de uso contínuo.',
    instructions: 'Nunca suspender abruptamente. Monitorar frequência cardíaca (manter FC de repouso entre 55 e 70 bpm).'
  },
  {
    id: 'carvedilol-625-cp',
    name: 'Carvedilol 6,25mg',
    genericName: 'Carvedilol',
    brandName: 'Coreg / Dilatrend 6,25mg',
    class: 'Betabloqueador Não Seletivo com Bloqueio Alfa-1 Vasodilatador',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '6,25mg - Comprimidos (caixa com 30)',
    availablePresentations: [
      '3,125mg - Comprimidos (caixa com 30)',
      '6,25mg - Comprimidos (caixa com 30)',
      '12,5mg - Comprimidos (caixa com 30)',
      '25mg - Comprimidos (caixa com 30)'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral a cada 12 horas, junto com as refeições, para desacelerar absorção e evitar hipotensão ortostática.',
    instructions: 'Pilar no tratamento da Insuficiência Cardíaca e pós-IAM. Titulação lenta a cada 2 a 4 semanas.'
  },
  {
    id: 'metoprolol-succinato-50',
    name: 'Succinato de Metoprolol 50mg Liberação Prolongada',
    genericName: 'Succinato de Metoprolol',
    brandName: 'Seloken / Selozok 50mg',
    class: 'Betabloqueador Beta-1 Seletivo de Liberação Controlada (CR/XL)',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '50mg - Comprimidos de liberação controlada (caixa com 30)',
    availablePresentations: [
      '25mg - Comprimidos (caixa com 30)',
      '50mg - Comprimidos (caixa com 30)',
      '100mg - Comprimidos (caixa com 30)'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral 1 vez ao dia pela manhã com água.',
    instructions: 'Pode ser partido ao meio no sulco, mas nunca mastigado.'
  },
  {
    id: 'bisoprolol-5-cp',
    name: 'Fumarato de Bisoprolol 5mg',
    genericName: 'Fumarato de Bisoprolol',
    brandName: 'Concor 5mg',
    class: 'Betabloqueador Altamente Cardiosseletivo Beta-1',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '5mg - Comprimidos revestidos (caixa com 30)',
    availablePresentations: [
      '1,25mg - Comprimidos (caixa com 30)',
      '2,5mg - Comprimidos (caixa com 30)',
      '5mg - Comprimidos (caixa com 30)',
      '10mg - Comprimidos (caixa com 30)'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral 1 vez ao dia pela manhã.',
    instructions: 'Excelente tolerância em coronariopatas e pacientes com insuficiência cardíaca.'
  },
  {
    id: 'propranolol-40-cp',
    name: 'Cloridrato de Propranolol 40mg',
    genericName: 'Cloridrato de Propranolol',
    brandName: 'Inderal 40mg',
    class: 'Betabloqueador Não Seletivo (Cefaleia, Tremor, Hipertensão Portal)',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '40mg - Comprimidos (caixa com 30)',
    availablePresentations: [
      '10mg - Comprimidos (caixa com 30)',
      '40mg - Comprimidos (caixa com 30)',
      '80mg - Comprimidos (caixa com 30)'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral a cada 12 horas antes das refeições.',
    instructions: 'Contraindicado em asmáticos (risco de broncoespasmo grave por bloqueio Beta-2).'
  },

  // ==========================================
  // ANTIAGREGANTES PLAQUETÁRIOS E ANTICOAGULANTES
  // ==========================================
  {
    id: 'aas-100-prevent',
    name: 'Ácido Acetilsalicílico 100mg (Aspirina Prevent)',
    genericName: 'Ácido Acetilsalicílico',
    brandName: 'Aspirina Prevent / Somalgin Cardio',
    class: 'Antiagregante Plaquetário Inibidor Irreversível de COX-1',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '100mg - Comprimidos tamponados / gastrorresistentes (caixa com 30)',
    availablePresentations: ['100mg - Comprimidos (caixa com 30)'],
    defaultPosology: 'Tomar 1 comprimido por via oral uma vez ao dia logo após o almoço, de uso contínuo.',
    instructions: 'Prevenção secundária cardiovascular (pós-IAM, pós-AVC, DAC crônica). Tomar com alimentos.'
  },
  {
    id: 'clopidogrel-75-cp',
    name: 'Bissulfato de Clopidogrel 75mg',
    genericName: 'Bissulfato de Clopidogrel',
    brandName: 'Plavix 75mg',
    class: 'Antiagregante Plaquetário Inibidor de P2Y12',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '75mg - Comprimidos revestidos (caixa com 28)',
    availablePresentations: ['75mg - Comprimidos (caixa com 28)'],
    defaultPosology: 'Tomar 1 comprimido por via oral 1 vez ao dia no mesmo horário, com ou sem alimentos, de uso contínuo.',
    instructions: 'Uso contínuo após implante de stent coronariano ou em caso de alergia comprovada ao AAS.'
  },
  {
    id: 'ticagrelor-90-cp',
    name: 'Ticagrelor 90mg',
    genericName: 'Ticagrelor',
    brandName: 'Brilinta 90mg',
    class: 'Antiplaquetário Inibidor Reversível de P2Y12 Pós-SCA',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '90mg - Comprimidos revestidos (caixa com 60)',
    availablePresentations: ['90mg - Comprimidos (caixa com 60)'],
    defaultPosology: 'Tomar 1 comprimido por via oral 2 vezes ao dia (de 12 em 12 horas) associado a AAS 100mg/dia por 12 meses pós-infarto.',
    instructions: 'Pode provocar dispneia transitória autolimitada nos primeiros dias.'
  },
  {
    id: 'varfarina-5-cp',
    name: 'Varfarina Sódica 5mg',
    genericName: 'Varfarina Sódica',
    brandName: 'Marevan / Coumadin 5mg',
    class: 'Anticoagulante Oral Antagonista da Vitamina K',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '5mg - Comprimidos birranhurados (caixa com 30)',
    availablePresentations: ['5mg - Comprimidos (caixa com 30)'],
    defaultPosology: 'Tomar a dose prescrita por via oral 1 vez ao dia no final da tarde/noite, ajustada conforme o RNI/INR.',
    instructions: 'Alvo terapêutico de INR habitualmente entre 2,0 e 3,0 (ou 2,5 a 3,5 para prótese mecânica). Manter dieta estável de folhas verdes.'
  },
  {
    id: 'rivaroxabana-20-cp',
    name: 'Rivaroxabana 20mg',
    genericName: 'Rivaroxabana',
    brandName: 'Xarelto 20mg',
    class: 'Anticoagulante Oral Direto Inibidor do Fator Xa (DOAC)',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '20mg - Comprimidos revestidos (caixa com 28)',
    availablePresentations: [
      '10mg - Comprimidos (caixa com 10)',
      '15mg - Comprimidos (caixa com 28)',
      '20mg - Comprimidos (caixa com 28)'
    ],
    defaultPosology: 'Fibrilação atrial não valvar / prevenção de AVC: tomar 1 comprimido de 20mg por via oral 1 vez ao dia, OBRIGATORIAMENTE JUNTO COM UMA REFEIÇÃO.',
    instructions: 'O comprimido de 20mg DEVE ser tomado com alimentos para absorção adequada (> 80%). Não necessita controle de INR.'
  },
  {
    id: 'apixabana-5-cp',
    name: 'Apixabana 5mg',
    genericName: 'Apixabana',
    brandName: 'Eliquis 5mg',
    class: 'Anticoagulante Oral Direto Inibidor do Fator Xa (DOAC)',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '5mg - Comprimidos revestidos (caixa com 60)',
    availablePresentations: [
      '2,5mg - Comprimidos (caixa com 60)',
      '5mg - Comprimidos (caixa com 60)'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral a cada 12 horas com água, com ou sem alimentos, de uso contínuo.',
    instructions: 'Dose reduzida para 2,5mg 12/12h se preencher 2 dos 3 critérios: idade >= 80 anos, peso <= 60kg, ou creatinina >= 1,5 mg/dL.'
  },
  {
    id: 'enoxaparina-40-seringa',
    name: 'Enoxaparina Sódica 40mg/0,4mL Seringa Preenchida SC',
    genericName: 'Enoxaparina Sódica',
    brandName: 'Clexane 40mg',
    class: 'Heparina de Baixo Peso Molecular (HBPM)',
    type: 'simples',
    defaultRoute: 'Uso subcutâneo',
    defaultPresentation: '40mg/0,4mL - Seringa preenchida com sistema de segurança (caixa com 2 ou 10)',
    availablePresentations: [
      '20mg/0,2mL - Seringa SC',
      '40mg/0,4mL - Seringa SC',
      '60mg/0,6mL - Seringa SC',
      '80mg/0,8mL - Seringa SC'
    ],
    defaultPosology: 'Profilaxia de TEV em pacientes cirúrgicos/clínicos: aplicar 40mg por via subcutânea profunda no abdômen uma vez ao dia.',
    instructions: 'Injetar no tecido subcutâneo da parede abdominal anterolateral ou posterolateral. Não expelir a bolha de ar antes da injeção. Não esfregar o local após.'
  },

  // ==========================================
  // OUTROS ANTI-HIPERTENSIVOS, VASODILATADORES E ANTIARRÍTMICOS
  // ==========================================
  {
    id: 'hidralazina-25-cp',
    name: 'Cloridrato de Hidralazina 25mg',
    genericName: 'Cloridrato de Hidralazina',
    brandName: 'Apresolina 25mg',
    class: 'Vasodilatador Direto Arteriolar',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '25mg - Drágeas (caixa com 20)',
    availablePresentations: [
      '25mg - Drágeas (caixa com 20)',
      '50mg - Drágeas (caixa com 20)',
      '20mg/mL - Ampola EV'
    ],
    defaultPosology: 'Tomar 1 drágea por via oral 2 a 3 vezes ao dia com alimentos.',
    instructions: 'Opção segura de controle pressórico na gestação (pré-eclâmpsia).'
  },
  {
    id: 'metildopa-250-cp',
    name: 'Metildopa 250mg',
    genericName: 'Metildopa',
    brandName: 'Aldomet 250mg',
    class: 'Anti-hipertensivo Agonista Alfa-2 Central / 1ª Linha na Gestação',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '250mg - Comprimidos revestidos (caixa com 30)',
    availablePresentations: [
      '250mg - Comprimidos (caixa com 30)',
      '500mg - Comprimidos (caixa com 30)'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral 2 a 3 vezes ao dia durante a gestação conforme níveis pressóricos.',
    instructions: 'Anti-hipertensivo de primeira escolha no tratamento da Hipertensão Arterial na Gestação.'
  },
  {
    id: 'amiodarona-200-cp',
    name: 'Cloridrato de Amiodarona 200mg',
    genericName: 'Cloridrato de Amiodarona',
    brandName: 'Ancoron 200mg',
    class: 'Antiarrítmico Classe III de Vaughan-Williams',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '200mg - Comprimidos (caixa com 30)',
    availablePresentations: [
      '200mg - Comprimidos (caixa com 30)',
      '150mg/3mL - Ampola injetável EV'
    ],
    defaultPosology: 'Dose de manutenção: tomar 1 comprimido (200mg) por via oral 1 vez ao dia após refeição.',
    instructions: 'Monitorar TSH/T4L (risco de hipotireoidismo ou tireotoxicose), função hepática e radiografia de tórax periodicamente.'
  },
  {
    id: 'monocordil-20-cp',
    name: 'Mononitrato de Isossorbida 20mg (Monocordil)',
    genericName: 'Mononitrato de Isossorbida',
    brandName: 'Monocordil 20mg',
    class: 'Vasodilatador Coronariano / Nitrato Antianginoso',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '20mg - Comprimidos (caixa com 30)',
    availablePresentations: [
      '20mg - Comprimidos (caixa com 30)',
      '40mg - Comprimidos (caixa com 30)'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral 2 vezes ao dia (ex: 8h e 16h, garantindo período livre de nitrato de 12 a 14h para evitar tolerância farmacológica).',
    instructions: 'PROIBIDO USO CONCOMITANTE COM SILDENAFILA OU TADALAFILA (risco de vasodilatação maciça, hipotensão grave e morte).'
  },
  {
    id: 'isordil-5-sl',
    name: 'Dinitrato de Isossorbida 5mg Sublingual',
    genericName: 'Dinitrato de Isossorbida',
    brandName: 'Isordil Sublingual 5mg',
    class: 'Nitrato Sublingual de Alívio Imediato da Angina',
    type: 'simples',
    defaultRoute: 'Uso sublingual',
    defaultPresentation: '5mg - Comprimidos sublinguais (caixa com 30)',
    availablePresentations: ['5mg - Comprimidos sublinguais (caixa com 30)'],
    defaultPosology: 'Dissolver 1 comprimido sob a língua ao primeiro sinal de dor precordial típica de angina de peito.',
    instructions: 'Deixar dissolver sob a língua. Sentar-se antes de tomar para evitar desmaio por hipotensão ortostática.'
  }
];
