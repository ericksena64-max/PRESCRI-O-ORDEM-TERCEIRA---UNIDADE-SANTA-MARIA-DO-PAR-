import { Medication } from '../../types';

export const TOPICALS_MEDICATIONS: Medication[] = [
  // ==========================================
  // FERIDAS, CICATRIZAÇÃO E QUEIMADURAS
  // ==========================================
  {
    id: 'sulfadiazina-prata-pomada',
    name: 'Sulfadiazina de Prata 1% (10mg/g) Pomada Dérmica',
    genericName: 'Sulfadiazina de Prata',
    brandName: 'Dermazine / Silvazine 1%',
    class: 'Antimicrobiano Tópico para Queimaduras e Úlceras',
    type: 'simples',
    defaultRoute: 'Uso tópico',
    defaultPresentation: '1% (10mg/g) - Pote com 50g ou 400g',
    availablePresentations: [
      '1% - Pote 50g',
      '1% - Pote 400g hospitalar'
    ],
    defaultPosology: 'Lavar a lesão com soro fisiológico 0,9%, aplicar camada de 1 a 2mm sobre toda a área cruenta 1 a 2 vezes ao dia e ocluir com gaze estéril.',
    instructions: 'Ação bactericida de largo espectro contra Pseudomonas e bactérias de queimadura. Não usar em caso de hipersensibilidade a sulfas.'
  },
  {
    id: 'nebacetin-pomada',
    name: 'Sulfato de Neomicina + Bacitracina Zíncica (Nebacetin)',
    genericName: 'Sulfato de Neomicina + Bacitracina Zíncica',
    brandName: 'Nebacetin Pomada',
    class: 'Antibacteriano Tópico Cicatrizante',
    type: 'simples',
    defaultRoute: 'Uso tópico',
    defaultPresentation: '5mg/g + 250UI/g - Bisnaga com 15g ou 50g',
    availablePresentations: [
      'Bisnaga com 15g',
      'Bisnaga com 50g'
    ],
    defaultPosology: 'Lavar o local afetado com água e sabão e aplicar camada fina sobre a pele de 2 a 5 vezes ao dia até cicatrização das lesões.',
    instructions: 'Uso externo dermatológico. Não aplicar sobre áreas extensas de pele lesada ou queimaduras de 3º grau para evitar absorção sistêmica.'
  },
  {
    id: 'mupirocina-pomada-20',
    name: 'Mupirocina 2% (20mg/g) Pomada Tópica',
    genericName: 'Mupirocina',
    brandName: 'Bactroban 2%',
    class: 'Antibacteriano Tópico de Alta Eficácia / Padrão Ouro para Impetigo',
    type: 'antimicrobiano',
    defaultRoute: 'Uso tópico',
    defaultPresentation: '20mg/g (2%) - Bisnaga com 15g',
    availablePresentations: ['20mg/g - Bisnaga 15g'],
    defaultPosology: 'Aplicar quantidade suficiente sobre as crostas e lesões 3 vezes ao dia durante 7 a 10 dias.',
    instructions: 'Especialmente eficaz contra Staphylococcus aureus (inclusive cepas comunitárias) e Streptococcus pyogenes. Remover crostas amolecidas com água morna antes da aplicação.'
  },
  {
    id: 'colagenase-cloranfenicol-pomada',
    name: 'Colagenase com Cloranfenicol Pomada Desbridante',
    genericName: 'Colagenase + Cloranfenicol',
    brandName: 'Iruxol / Kollagenase com Cloranfenicol',
    class: 'Desbridante Enzimático e Antibacteriano Tópico',
    type: 'simples',
    defaultRoute: 'Uso tópico',
    defaultPresentation: '0,6U/g + 10mg/g - Bisnaga com 30g com espátula',
    availablePresentations: ['Bisnaga com 30g'],
    defaultPosology: 'Limpar a ferida com soro fisiológico, remover tecidos necrosados soltos e aplicar uma camada uniforme de cerca de 2mm 1 vez ao dia, cobrindo com curativo úmido.',
    instructions: 'Promove a digestão e limpeza enzimática de tecido necrótico em úlceras de perna e escaras de decúbito.'
  },
  {
    id: 'bepantol-derma-pomada',
    name: 'Dexpantenol 50mg/g Pomada Cicatrizante e Hidratante',
    genericName: 'Dexpantenol (Pró-vitamina B5)',
    brandName: 'Bepantol Derma / Baby',
    class: 'Cicatrizante, Protetor Cutâneo e Emoliente',
    type: 'simples',
    defaultRoute: 'Uso tópico',
    defaultPresentation: '50mg/g - Bisnaga com 30g ou 60g',
    availablePresentations: ['Bisnaga com 30g'],
    defaultPosology: 'Aplicar uma camada fina sobre a pele limpa e seca 1 a 3 vezes ao dia conforme necessidade.',
    instructions: 'Estimula a proliferação celular e a regeneração do epitélio cutâneo.'
  },
  {
    id: 'oxido-zinco-nistatina-pomada',
    name: 'Óxido de Zinco + Nistatina Pomada para Assaduras',
    genericName: 'Óxido de Zinco + Nistatina',
    brandName: 'Dermodex Tratamento / Nistatina + Óxido de Zinco',
    class: 'Antifúngico e Protetor de Barreira Cutânea Infantil',
    type: 'simples',
    defaultRoute: 'Uso tópico',
    defaultPresentation: '100.000 UI/g + 200mg/g - Bisnaga com 60g',
    availablePresentations: ['Bisnaga com 60g'],
    defaultPosology: 'Aplicar nas áreas afetadas da região das fraldas a cada troca de fralda após higienização cuidadosa.',
    instructions: 'Trata a dermatite de fralda sobreinfectada por Candida albicans e forma película protetora contra umidade.'
  },

  // ==========================================
  // CORTICOIDES TÓPICOS
  // ==========================================
  {
    id: 'betnovate-creme-01',
    name: 'Valerato de Betametasona 0,1% Creme Tópico',
    genericName: 'Valerato de Betametasona',
    brandName: 'Betnovate 1mg/g',
    class: 'Corticosteroide Tópico de Média a Alta Potência',
    type: 'simples',
    defaultRoute: 'Uso tópico',
    defaultPresentation: '1mg/g (0,1%) - Bisnaga com 30g',
    availablePresentations: [
      '0,1% - Creme bisnaga 30g',
      '0,1% - Pomada bisnaga 30g'
    ],
    defaultPosology: 'Aplicar camada fina sobre as lesões de eczema ou dermatite 1 a 2 vezes ao dia por até 14 dias.',
    instructions: 'Evitar aplicação prolongada na face e em dobras cutâneas para não causar estrias ou atrofia.'
  },
  {
    id: 'clobetasol-005-pomada',
    name: 'Propionato de Clobetasol 0,05% Pomada',
    genericName: 'Propionato de Clobetasol',
    brandName: 'Psorex 0,5mg/g',
    class: 'Corticosteroide Tópico Superpotente (Classe I)',
    type: 'simples',
    defaultRoute: 'Uso tópico',
    defaultPresentation: '0,5mg/g (0,05%) - Bisnaga com 30g',
    availablePresentations: ['0,05% - Pomada bisnaga 30g'],
    defaultPosology: 'Aplicar fina camada sobre placas espessas de psoríase ou líquen 1 vez ao dia por no máximo 2 a 3 semanas.',
    instructions: 'NUNCA APLICAR NA FACE OU VIRILHA. Potência altíssima com risco de absorção sistêmica se ocluído.'
  },
  {
    id: 'quadriderm-creme',
    name: 'Betametasona + Gentamicina + Tolnaftato + Clioquinol',
    genericName: 'Betametasona + Gentamicina + Tolnaftato + Clioquinol',
    brandName: 'Quadriderm Creme Tópico',
    class: 'Anti-inflamatório, Antibacteriano e Antifúngico Tópico Quádruplo',
    type: 'simples',
    defaultRoute: 'Uso tópico',
    defaultPresentation: 'Bisnaga com 20g',
    availablePresentations: ['Bisnaga com 20g'],
    defaultPosology: 'Aplicar fina camada sobre a área afetada 2 a 3 vezes ao dia por 7 a 14 dias.',
    instructions: 'Indicado para dermatites complicadas por infecções mistas bacterianas e fúngicas.'
  },

  // ==========================================
  // OFTALMOLOGIA
  // ==========================================
  {
    id: 'tobramicina-colirio-03',
    name: 'Sulfato de Tobramicina 0,3% Colírio Solução Oftálmica',
    genericName: 'Sulfato de Tobramicina',
    brandName: 'Tobrex Colírio 0,3%',
    class: 'Antibiótico Oftálmico Aminoglicosídeo',
    type: 'simples',
    defaultRoute: 'Uso oftálmico',
    defaultPresentation: '0,3% (3mg/mL) - Frasco conta-gotas estéril com 5mL',
    availablePresentations: [
      '0,3% - Colírio frasco 5mL',
      '0,3% - Pomada oftálmica bisnaga 3,5g'
    ],
    defaultPosology: 'Pingar 1 a 2 gotas no saco conjuntival do olho afetado a cada 4 horas por 7 dias.',
    instructions: 'Evitar encostar a ponta do conta-gotas nos olhos ou dedos para não contaminar o frasco. Não usar lentes de contato durante o tratamento.'
  },
  {
    id: 'tobradex-colirio',
    name: 'Tobramicina + Dexametasona Colírio Suspensão Oftálmica',
    genericName: 'Tobramicina + Dexametasona',
    brandName: 'Tobradex Colírio',
    class: 'Antibiótico + Corticosteroide Oftálmico',
    type: 'simples',
    defaultRoute: 'Uso oftálmico',
    defaultPresentation: '0,3% + 0,1% - Frasco conta-gotas com 5mL',
    availablePresentations: ['Frasco com 5mL'],
    defaultPosology: 'Pingar 1 a 2 gotas no olho afetado a cada 4 a 6 horas por 5 a 7 dias.',
    instructions: 'Agitar bem antes de usar. Contraindicado em ceratite por herpes simples ou infecções fúngicas oculares.'
  },
  {
    id: 'moxifloxacino-colirio-05',
    name: 'Cloridrato de Moxifloxacino 0,5% Colírio Solução',
    genericName: 'Cloridrato de Moxifloxacino',
    brandName: 'Vigamox Colírio 0,5%',
    class: 'Fluoroquinolona Oftálmica de 4ª Geração Sem Conservantes Citotóxicos',
    type: 'simples',
    defaultRoute: 'Uso oftálmico',
    defaultPresentation: '0,5% (5mg/mL) - Frasco conta-gotas com 5mL',
    availablePresentations: ['0,5% - Colírio 5mL'],
    defaultPosology: 'Pingar 1 gota no olho afetado 3 vezes ao dia por 7 dias.',
    instructions: 'Excelente penetração na câmara anterior e amplo espectro.'
  },
  {
    id: 'carmelose-colirio-optive',
    name: 'Carmelose Sódica 0,5% Colírio Lubrificante (Optive / Refresh)',
    genericName: 'Carmelose Sódica',
    brandName: 'Optive / Refresh Tears 0,5%',
    class: 'Lágrima Artificial e Lubrificante Ocular',
    type: 'simples',
    defaultRoute: 'Uso oftálmico',
    defaultPresentation: '0,5% - Frasco conta-gotas com 15mL',
    availablePresentations: [
      'Frasco com 15mL',
      'Flaconetes monodose estéreis sem conservantes'
    ],
    defaultPosology: 'Instilar 1 a 2 gotas no(s) olho(s) afetado(s) 3 a 5 vezes ao dia ou sempre que houver sensação de olho seco, areia ou ardência.',
    instructions: 'Compatível com uso de lentes de contato.'
  },

  // ==========================================
  // OTOLOGIA
  // ==========================================
  {
    id: 'ciprofloxacino-hidrocortisona-otociriax',
    name: 'Ciprofloxacino + Hidrocortisona Gotas Otológicas (Otociriax)',
    genericName: 'Ciprofloxacino + Hidrocortisona',
    brandName: 'Otociriax / Oto-Betnovate',
    class: 'Gotas Auriculares Antibióticas e Anti-inflamatórias para Otite Externa',
    type: 'simples',
    defaultRoute: 'Uso otológico',
    defaultPresentation: 'Frasco conta-gotas com 5mL ou 10mL',
    availablePresentations: ['Frasco com 10mL'],
    defaultPosology: 'Instilar 3 a 4 gotas no conduto auditivo externo afetado a cada 8 ou 12 horas por 7 dias.',
    instructions: 'Aquecer o frasco nas mãos por 1 a 2 minutos antes de pingar para evitar vertigem por estímulo calórico. Permanecer com a cabeça inclinada por 5 minutos.'
  },
  {
    id: 'otosporin-gotas-otologicas',
    name: 'Polimixina B + Neomicina + Hidrocortisona (Otosporin)',
    genericName: 'Sulfato de Polimixina B + Neomicina + Hidrocortisona',
    brandName: 'Otosporin Gotas Otológicas',
    class: 'Gotas Otológicas Clássicas para Otite Externa Aguda',
    type: 'simples',
    defaultRoute: 'Uso otológico',
    defaultPresentation: 'Frasco com 10mL',
    availablePresentations: ['Frasco com 10mL'],
    defaultPosology: 'Instilar 3 gotas no ouvido afetado de 8 em 8 horas por 7 dias.',
    instructions: 'CONTRAINDICADO SE HOUVER SUSPEITA DE PERFURAÇÃO DA MEMBRANA TIMPÂNICA (risco de ototoxicidade por neomicina).'
  },
  {
    id: 'cerumin-gotas-auriculares',
    name: 'Trietanolamina + Hidroxiquinolina Gotas Auriculares (Cerumin)',
    genericName: 'Trietanolamina + Hidroxiquinolina',
    brandName: 'Cerumin Gotas',
    class: 'Ceruminolítico para Remoção de Rolha de Cerúmen',
    type: 'simples',
    defaultRoute: 'Uso otológico',
    defaultPresentation: 'Frasco conta-gotas com 8mL',
    availablePresentations: ['Frasco com 8mL'],
    defaultPosology: 'Pingar 4 a 5 gotas no canal auditivo 3 vezes ao dia, mantendo a cabeça lateralizada por 15 minutos, durante 3 a 5 dias antes da lavagem otológica.',
    instructions: 'Amolece o tampão de cera facilitando a lavagem ou remoção mecânica pelo médico.'
  }
];
