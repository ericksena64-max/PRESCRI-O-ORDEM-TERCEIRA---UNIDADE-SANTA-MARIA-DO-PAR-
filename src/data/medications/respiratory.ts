import { Medication } from '../../types';

export const RESPIRATORY_MEDICATIONS: Medication[] = [
  // ==========================================
  // BRONCODILATADORES E INALATÓRIOS
  // ==========================================
  {
    id: 'salbutamol-spray-aerolin',
    name: 'Sulfato de Salbutamol Spray 100mcg/dose',
    genericName: 'Sulfato de Salbutamol',
    brandName: 'Aerolin Spray 100mcg',
    class: 'Broncodilatador Beta-2 Agonista de Curta Ação (SABA)',
    type: 'simples',
    defaultRoute: 'Uso inalatório',
    defaultPresentation: '100mcg/dose - Frasco aerossol com 200 doses',
    availablePresentations: [
      '100mcg/dose - Spray 200 doses',
      '5mg/mL - Gotas para nebulização (frasco 10mL)'
    ],
    defaultPosology: 'Crise de broncoespasmo/asma: inalar 2 a 4 jatos com espaçador a cada 20 minutos na primeira hora; manutenção de 2 jatos de 4/4h ou 6/6h.',
    instructions: 'Agitar bem o frasco antes de cada disparo. Utilizar preferencialmente com espaçador valvulado para garantir a deposição pulmonar.'
  },
  {
    id: 'salbutamol-gotas-nebulizacao',
    name: 'Sulfato de Salbutamol Solução para Nebulização 5mg/mL',
    genericName: 'Sulfato de Salbutamol',
    brandName: 'Aerolin Gotas Nebulização',
    class: 'Broncodilatador para Nebulização',
    type: 'simples',
    defaultRoute: 'Uso inalatório',
    defaultPresentation: '5mg/mL - Frasco com 10mL',
    availablePresentations: ['5mg/mL - Frasco 10mL'],
    defaultPosology: 'Crianças: 1 gota para cada 2 a 3 kg (dose mínima 5 gotas, máxima 10 a 20 gotas) diluídas em 3 a 5mL de SF 0,9% em nebulizador com O2.',
    instructions: '1 gota contém 0,25mg de salbutamol. Pode causar tremor de extremidades e taquicardia transitória.'
  },
  {
    id: 'fenoterol-gotas-berotec',
    name: 'Bromidrato de Fenoterol 5mg/mL (Berotec)',
    genericName: 'Bromidrato de Fenoterol',
    brandName: 'Berotec Gotas',
    class: 'Broncodilatador Beta-2 Agonista Inalatório',
    type: 'simples',
    defaultRoute: 'Uso inalatório',
    defaultPresentation: '5mg/mL - Frasco conta-gotas 20mL',
    availablePresentations: ['5mg/mL - Frasco 20mL'],
    defaultPosology: 'Crianças: 1 gota para cada 3 kg de peso (mínimo 3 gotas, máximo 8 a 10 gotas) + 3mL de SF 0,9% via inalação. Adultos: 10 a 20 gotas.',
    instructions: 'Utilizar sempre diluído em soro fisiológico sob fluxo de oxigênio a 6-8 L/min.'
  },
  {
    id: 'ipratropio-gotas-atrovent',
    name: 'Brometo de Ipratrópio 0,25mg/mL (Atrovent)',
    genericName: 'Brometo de Ipratrópio',
    brandName: 'Atrovent Gotas',
    class: 'Broncodilatador Anticolinérgico Inalatório (SAMA)',
    type: 'simples',
    defaultRoute: 'Uso inalatório',
    defaultPresentation: '0,25mg/mL - Frasco conta-gotas 20mL',
    availablePresentations: ['0,25mg/mL - Frasco 20mL'],
    defaultPosology: 'Crianças < 6 anos: 10 a 20 gotas diluídas em 3 a 5mL de SF 0,9% por inalação. Adultos e > 6 anos: 20 a 40 gotas de 6/6h ou 8/8h.',
    instructions: 'Evitar contato do aerossol com os olhos para não dilatar a pupila (midríase). Excelente sinergia quando associado a beta-2 agonistas.'
  },
  {
    id: 'beclometasona-250-spray',
    name: 'Dipropionato de Beclometasona 250mcg Spray Inalatório',
    genericName: 'Dipropionato de Beclometasona',
    brandName: 'Clenil HFA 250mcg',
    class: 'Corticosteroide Inalatório Manutenção da Asma',
    type: 'simples',
    defaultRoute: 'Uso inalatório',
    defaultPresentation: '250mcg/dose - Frasco com 200 doses',
    availablePresentations: [
      '50mcg/dose - Spray 200 doses',
      '200mcg/dose - Spray 200 doses',
      '250mcg/dose - Spray 200 doses'
    ],
    defaultPosology: 'Inalar 1 a 2 jatos por via oral 2 vezes ao dia (a cada 12 horas), de uso contínuo preventivo.',
    instructions: 'ENXAGUAR A BOCA e gargarejar com água após o uso para prevenir candidíase oral (sapinho) e disfonia.'
  },
  {
    id: 'budesonida-spray-nasal-50',
    name: 'Budesonida Spray Nasal Aquoso 50mcg/dose',
    genericName: 'Budesonida',
    brandName: 'Busonid / Noex 50mcg',
    class: 'Corticosteroide Nasal Tópico para Rinite Alérgica',
    type: 'simples',
    defaultRoute: 'Uso nasal',
    defaultPresentation: '50mcg/dose - Frasco spray com 120 doses',
    availablePresentations: [
      '32mcg/dose - Frasco 120 doses',
      '50mcg/dose - Frasco 120 doses',
      '64mcg/dose - Frasco 120 doses'
    ],
    defaultPosology: 'Aplicar 1 a 2 jatos em cada narina 1 a 2 vezes ao dia (pela manhã e/ou noite).',
    instructions: 'Assoar o nariz antes da aplicação. Direcionar o bico levemente para a lateral da narina (longe do septo nasal).'
  },
  {
    id: 'fluticasona-spray-nasal-avamys',
    name: 'Furoato de Fluticasona 27,5mcg Spray Nasal',
    genericName: 'Furoato de Fluticasona',
    brandName: 'Avamys 27,5mcg',
    class: 'Corticosteroide Nasal Moderno de Alta Afinidade',
    type: 'simples',
    defaultRoute: 'Uso nasal',
    defaultPresentation: '27,5mcg/dose - Frasco spray com 120 doses',
    availablePresentations: ['27,5mcg/dose - Frasco 120 doses'],
    defaultPosology: 'Aplicar 2 jatos em cada narina uma vez ao dia pela manhã.',
    instructions: 'Dispositivo ergonômico lateral. Uso diário contínuo no controle de rinite crônica alérgica.'
  },
  {
    id: 'formoterol-budesonida-symbicort',
    name: 'Fumarato de Formoterol + Budesonida (6mcg + 200mcg)',
    genericName: 'Formoterol + Budesonida',
    brandName: 'Symbicort Turbuhaler / Alenia 6/200',
    class: 'Broncodilatador LABA + Corticosteroide Inalatório',
    type: 'simples',
    defaultRoute: 'Uso inalatório',
    defaultPresentation: '6/200mcg - Inalador de pó com 60 ou 120 doses',
    availablePresentations: [
      '6/200mcg - Inalador 60 doses',
      '12/400mcg - Inalador 60 doses'
    ],
    defaultPosology: 'Inalar 1 a 2 doses 2 vezes ao dia (de 12 em 12 horas) de uso contínuo, podendo usar 1 jato extra de resgate se falta de ar (estratégia SMART).',
    instructions: 'Enxaguar a boca após a inalação do pó.'
  },
  {
    id: 'tiotropio-spiriva-respimat',
    name: 'Brometo de Tiotrópio 2,5mcg (Spiriva Respimat)',
    genericName: 'Brometo de Tiotrópio',
    brandName: 'Spiriva Respimat 2,5mcg',
    class: 'Anticolinérgico Inalatório de Longa Ação (LAMA) para DPOC/Asma',
    type: 'simples',
    defaultRoute: 'Uso inalatório',
    defaultPresentation: '2,5mcg/puff - Inalador Respimat com cartucho de 60 puffs',
    availablePresentations: ['2,5mcg/puff - Respimat 60 doses'],
    defaultPosology: 'Inalar 2 puffs uma vez ao dia no mesmo horário, todos os dias.',
    instructions: 'Girar, abrir a tampa e pressionar o botão disparador inalando a névoa suave e profunda.'
  },
  {
    id: 'montelucaste-10-cp',
    name: 'Montelucaste de Sódio 10mg',
    genericName: 'Montelucaste de Sódio',
    brandName: 'Singulair 10mg / Piemonte',
    class: 'Antagonista dos Receptores de Leucotrienos',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '10mg - Comprimidos revestidos (caixa com 30)',
    availablePresentations: [
      '4mg - Sachês de grânulos orais pediátricos (caixa com 30)',
      '5mg - Comprimidos mastigáveis pediátricos (caixa com 30)',
      '10mg - Comprimidos (caixa com 30)'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral uma vez ao dia à noite ao deitar, de uso contínuo.',
    instructions: 'Excelente adjuvante no tratamento de asma noturna, rinite alérgica concomitante e broncoespasmo induzido por exercício.'
  },

  // ==========================================
  // MUCOLÍTICOS, EXPECTORANTES E ANTITUSSÍGENOS
  // ==========================================
  {
    id: 'acetilcisteina-600-sache',
    name: 'Acetilcisteína 600mg Granulado Efervescente',
    genericName: 'Acetilcisteína',
    brandName: 'Fluimucil 600mg',
    class: 'Mucolítico e Antioxidante Pulmonar',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '600mg - Envelopes de granulado (caixa com 16)',
    availablePresentations: [
      '600mg - Envelopes (caixa com 16)',
      '200mg - Envelopes (caixa com 16)',
      '40mg/mL - Xarope adulto frasco 120mL',
      '20mg/mL - Xarope pediátrico frasco 120mL'
    ],
    defaultPosology: 'Dissolver 1 envelope em meio copo de água e tomar por via oral 1 vez ao dia, preferencialmente à noite, por 5 a 7 dias.',
    instructions: 'Fluifica as secreções brônquicas facilitando a expectoração. Manter boa hidratação oral concomitante.'
  },
  {
    id: 'ambroxol-30-xarope',
    name: 'Cloridrato de Ambroxol Xarope Adulto 30mg/5mL',
    genericName: 'Cloridrato de Ambroxol',
    brandName: 'Mucosolvan Adulto',
    class: 'Mucolítico e Expectorante',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '30mg/5mL - Frasco com 120mL com copo-medida',
    availablePresentations: [
      '30mg/5mL - Xarope adulto 120mL',
      '15mg/5mL - Xarope pediátrico 120mL'
    ],
    defaultPosology: 'Tomar 5mL por via oral 3 vezes ao dia (a cada 8 horas) por 5 dias.',
    instructions: 'Tomar após as refeições.'
  },
  {
    id: 'acebrofilina-50-xarope',
    name: 'Acebrofilina Xarope Adulto 50mg/5mL',
    genericName: 'Acebrofilina',
    brandName: 'Brondilat Adulto 50mg/5mL',
    class: 'Mucorregulador e Broncodilatador Oral',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '50mg/5mL - Frasco com 120mL',
    availablePresentations: [
      '50mg/5mL - Xarope adulto 120mL',
      '25mg/5mL - Xarope pediátrico 120mL'
    ],
    defaultPosology: 'Tomar 10mL por via oral a cada 12 horas por 7 a 10 dias.',
    instructions: 'Associa efeito mucolítico ao efeito broncodilatador suave.'
  },
  {
    id: 'dropropizina-xarope-adulto',
    name: 'Dropropizina Xarope Adulto 3mg/mL',
    genericName: 'Dropropizina',
    brandName: 'Vibral / Notuss Adulto',
    class: 'Antitussígeno de Ação Periférica (Tosse Seca)',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '3mg/mL - Frasco com 120mL',
    availablePresentations: [
      '3mg/mL - Xarope adulto 120mL',
      '1,5mg/mL - Xarope pediátrico 120mL'
    ],
    defaultPosology: 'Tomar 10mL por via oral a cada 8 horas se tosse seca irritativa.',
    instructions: 'Acalma os receptores traqueobrônquicos sem deprimir o centro respiratório central.'
  },
  {
    id: 'levodropropizina-xarope',
    name: 'Levodropropizina Xarope 30mg/5mL',
    genericName: 'Levodropropizina',
    brandName: 'Antux Xarope 30mg/5mL',
    class: 'Antitussígeno Não Opióide de Ação Periférica',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '30mg/5mL - Frasco com 100mL',
    availablePresentations: ['30mg/5mL - Frasco 100mL'],
    defaultPosology: 'Tomar 10mL por via oral até 3 vezes ao dia com intervalos de no mínimo 6 horas se tosse seca incômoda.',
    instructions: 'Tomar entre as refeições.'
  },
  {
    id: 'soro-nasal-09',
    name: 'Cloreto de Sódio 0,9% Solução Nasal em Jato Contínuo',
    genericName: 'Cloreto de Sódio 0,9%',
    brandName: 'Maresis / Rinosoro Jet / Sorine',
    class: 'Higienizador e Descongestionante Fisiológico Nasal',
    type: 'simples',
    defaultRoute: 'Uso nasal',
    defaultPresentation: '0,9% - Frasco aerossol pressurizado com 100mL com bico anatômico',
    availablePresentations: [
      '0,9% - Spray jato contínuo 100mL',
      '3% - Spray hipertônico 100mL',
      '0,9% - Gotas frasco 30mL'
    ],
    defaultPosology: 'Aplicar 1 a 2 jatos prolongados em cada narina 4 a 6 vezes ao dia ou conforme necessidade de desobstrução.',
    instructions: 'Lavar as narinas abundantemente. Pode ser utilizado sem restrição de tempo, sem risco de efeito rebote ou taquifilaxia.'
  },
  {
    id: 'oximetazolina-spray-05',
    name: 'Cloridrato de Oximetazolina Spray Nasal 0,5mg/mL',
    genericName: 'Cloridrato de Oximetazolina',
    brandName: 'Afrin / Aturgyl 0,5mg/mL',
    class: 'Descongestionante Nasal Vasoconstritor Tópico',
    type: 'simples',
    defaultRoute: 'Uso nasal',
    defaultPresentation: '0,5mg/mL - Frasco nebulizador com 20mL',
    availablePresentations: ['0,5mg/mL - Frasco spray 20mL'],
    defaultPosology: 'Aplicar 2 a 3 nebulizações em cada narina 2 vezes ao dia (de 12 em 12 horas) por no máximo 3 a 5 dias.',
    instructions: 'ATENÇÃO: NÃO UTILIZAR POR MAIS DE 5 DIAS CONSECUTIVOS pelo risco de rinite medicamentosa rebote e dependência vasomotora.'
  }
];
