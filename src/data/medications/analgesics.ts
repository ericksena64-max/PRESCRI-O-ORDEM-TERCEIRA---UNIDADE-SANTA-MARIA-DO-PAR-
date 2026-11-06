import { Medication } from '../../types';

export const ANALGESICS_MEDICATIONS: Medication[] = [
  {
    id: 'dipirona-500-cp',
    name: 'Dipirona Monoidratada 500mg',
    genericName: 'Dipirona Monoidratada',
    brandName: 'Novalgina / Anador',
    class: 'Analgésico e Antitérmico',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '500mg - Comprimidos (caixa com 20 ou 30)',
    availablePresentations: [
      '500mg - Comprimidos (caixa com 20)',
      '1g - Comprimidos simples (caixa com 10)',
      '1g - Comprimidos efervescentes (caixa com 10)',
      '500mg/mL - Gotas (frasco com 20mL)',
      '50mg/mL - Solução oral (frasco com 100mL)'
    ],
    defaultPosology: 'Tomar 1 a 2 comprimidos por via oral a cada 6 horas em caso de dor ou febre (máx. 4g ao dia).',
    instructions: 'Ingerir com água. Não ultrapassar 4 doses diárias.'
  },
  {
    id: 'dipirona-1g-cp',
    name: 'Dipirona Monoidratada 1g',
    genericName: 'Dipirona Monoidratada',
    brandName: 'Novalgina 1g',
    class: 'Analgésico e Antitérmico Potente',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '1g - Comprimidos (caixa com 10 ou 20)',
    availablePresentations: [
      '1g - Comprimidos simples (caixa com 10)',
      '1g - Comprimidos efervescentes (caixa com 10)'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral a cada 6 ou 8 horas em caso de dor intensa ou febre.',
    instructions: 'Tomar no máximo 4 comprimidos em 24 horas.'
  },
  {
    id: 'dipirona-gotas-500',
    name: 'Dipirona Gotas 500mg/mL',
    genericName: 'Dipirona Monoidratada',
    brandName: 'Novalgina Gotas',
    class: 'Analgésico e Antitérmico Pediátrico / Adulto',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '500mg/mL - Frasco conta-gotas 20mL',
    availablePresentations: [
      '500mg/mL - Frasco conta-gotas 20mL',
      '50mg/mL - Solução oral pediátrica frasco 100mL'
    ],
    defaultPosology: 'Adultos: tomar 40 gotas a cada 6 horas se dor ou febre. Crianças: 1 gota por kg de peso (máx. 40 gotas) de 6/6h.',
    instructions: 'Contraindicado em menores de 3 meses ou < 5 kg. 1 gota = 25mg de dipirona.'
  },
  {
    id: 'dipirona-ampola-1g',
    name: 'Dipirona Sódica 1g/2mL Solução Injetável',
    genericName: 'Dipirona Sódica',
    brandName: 'Novalgina Injetável',
    class: 'Analgésico e Antitérmico Parenteral',
    type: 'simples',
    defaultRoute: 'Uso intravenoso',
    defaultPresentation: '1g/2mL - Ampola (500mg/mL)',
    availablePresentations: [
      '1g/2mL - Ampola EV/IM',
      '2.5g/5mL - Ampola EV'
    ],
    defaultPosology: 'Administrar 1 ampola diluída em 100mL de SF 0,9% EV correr em 20 a 30 minutos a cada 6 horas se dor.',
    instructions: 'Injeção EV lenta para evitar hipotensão transitória.'
  },
  {
    id: 'paracetamol-750-cp',
    name: 'Paracetamol 750mg',
    genericName: 'Paracetamol',
    brandName: 'Tylenol 750mg',
    class: 'Analgésico e Antitérmico',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '750mg - Comprimidos (caixa com 20)',
    availablePresentations: [
      '750mg - Comprimidos (caixa com 20)',
      '500mg - Comprimidos (caixa com 20)',
      '200mg/mL - Gotas frasco com 15mL'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral a cada 6 ou 8 horas em caso de dor ou febre (máx. 3g ao dia).',
    instructions: 'Uso com cautela em hepatopatas. Não exceder a dose diária recomendada.'
  },
  {
    id: 'paracetamol-500-cp',
    name: 'Paracetamol 500mg',
    genericName: 'Paracetamol',
    brandName: 'Tylenol 500mg',
    class: 'Analgésico e Antitérmico',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '500mg - Comprimidos (caixa com 20)',
    availablePresentations: [
      '500mg - Comprimidos (caixa com 20)',
      '750mg - Comprimidos (caixa com 20)'
    ],
    defaultPosology: 'Tomar 1 a 2 comprimidos por via oral a cada 6 horas se dor ou febre.',
    instructions: 'Não associar a outros medicamentos contendo paracetamol.'
  },
  {
    id: 'paracetamol-gotas-200',
    name: 'Paracetamol Gotas 200mg/mL',
    genericName: 'Paracetamol',
    brandName: 'Tylenol Gotas Bebê / Criança',
    class: 'Analgésico e Antitérmico Pediátrico',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '200mg/mL - Frasco conta-gotas 15mL',
    availablePresentations: [
      '200mg/mL - Frasco com 15mL',
      '32mg/mL - Xarope frasco com 60mL'
    ],
    defaultPosology: 'Administrar 1 a 1,5 gotas por kg de peso corporal a cada 6 horas (dose máx: 35 gotas por tomada).',
    instructions: '1 gota contém 10mg. Não exceder 5 tomadas ao dia.'
  },
  {
    id: 'paracetamol-codeina-tylex-30',
    name: 'Paracetamol + Fosfato de Codeína (500mg + 30mg)',
    genericName: 'Paracetamol + Fosfato de Codeína',
    brandName: 'Tylex 30mg / Paco',
    class: 'Analgésico Opióide Fraco Combinado',
    type: 'controle_especial',
    controlledCategory: 'Lista C1 (Receita de Controle Especial em 2 vias)',
    defaultRoute: 'Uso oral',
    defaultPresentation: '500mg + 30mg - Comprimidos (caixa com 12 ou 24)',
    availablePresentations: [
      '500mg + 30mg - Comprimidos (caixa com 12)',
      '500mg + 30mg - Comprimidos (caixa com 24)',
      '500mg + 7,5mg - Comprimidos (caixa com 12)'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral a cada 6 ou 8 horas em caso de dor moderada a intensa refratária.',
    instructions: 'Pode causar sonolência, constipação e náuseas. Evitar bebidas alcoólicas.'
  },
  {
    id: 'paracetamol-codeina-tylex-75',
    name: 'Paracetamol + Fosfato de Codeína (500mg + 7,5mg)',
    genericName: 'Paracetamol + Fosfato de Codeína',
    brandName: 'Tylex 7,5mg',
    class: 'Analgésico Opióide Fraco Combinado',
    type: 'controle_especial',
    controlledCategory: 'Lista C1 (Receita de Controle Especial em 2 vias)',
    defaultRoute: 'Uso oral',
    defaultPresentation: '500mg + 7,5mg - Comprimidos (caixa com 12 ou 24)',
    availablePresentations: ['500mg + 7,5mg - Comprimidos (caixa com 12)'],
    defaultPosology: 'Tomar 1 comprimido por via oral a cada 6 a 8 horas se dor moderada.',
    instructions: 'Receita retida de controle especial.'
  },
  {
    id: 'tramadol-50-cp',
    name: 'Cloridrato de Tramadol 50mg',
    genericName: 'Cloridrato de Tramadol',
    brandName: 'Tramal / Dorless',
    class: 'Analgésico Opióide de Ação Central',
    type: 'controle_especial',
    controlledCategory: 'Lista A1 / C1 (Receita de Controle Especial em 2 vias)',
    defaultRoute: 'Uso oral',
    defaultPresentation: '50mg - Cápsulas (caixa com 10 ou 20)',
    availablePresentations: [
      '50mg - Cápsulas (caixa com 10)',
      '50mg - Cápsulas (caixa com 20)',
      '100mg - Cápsulas retard (caixa com 10)',
      '100mg/mL - Gotas (frasco com 10mL)',
      '50mg/mL - Solução injetável ampola 1mL e 2mL'
    ],
    defaultPosology: 'Tomar 1 cápsula por via oral a cada 8 horas em caso de dor intensa refratária.',
    instructions: 'Pode causar sonolência, tontura e náuseas. Não dirigir sob efeito.'
  },
  {
    id: 'tramadol-paracetamol-ultracet',
    name: 'Cloridrato de Tramadol + Paracetamol (37,5mg + 325mg)',
    genericName: 'Cloridrato de Tramadol + Paracetamol',
    brandName: 'Ultracet',
    class: 'Analgésico Opióide Combinado',
    type: 'controle_especial',
    controlledCategory: 'Lista C1 (Receita de Controle Especial em 2 vias)',
    defaultRoute: 'Uso oral',
    defaultPresentation: '37,5mg + 325mg - Comprimidos revestidos (caixa com 20)',
    availablePresentations: [
      '37,5mg + 325mg - Comprimidos (caixa com 10)',
      '37,5mg + 325mg - Comprimidos (caixa com 20)'
    ],
    defaultPosology: 'Tomar 1 a 2 comprimidos a cada 6 ou 8 horas se dor aguda intensa (máximo 8 comprimidos ao dia).',
    instructions: 'Não associar a outros medicamentos que contenham paracetamol.'
  },
  {
    id: 'tramadol-ampola-100',
    name: 'Cloridrato de Tramadol 100mg/2mL Solução Injetável',
    genericName: 'Cloridrato de Tramadol',
    brandName: 'Tramal Ampola',
    class: 'Analgésico Opióide Parenteral',
    type: 'controle_especial',
    controlledCategory: 'Lista A1 / C1 (Controle Especial)',
    defaultRoute: 'Uso intravenoso',
    defaultPresentation: '100mg/2mL - Ampola EV/IM',
    availablePresentations: [
      '50mg/mL - Ampola 1mL',
      '100mg/2mL - Ampola 2mL'
    ],
    defaultPosology: 'Diluir 1 ampola (100mg) em 100mL de SF 0,9% e infundir por via intravenosa lenta em 30 minutos.',
    instructions: 'Administração lenta para minimizar náuseas e vômitos. Associar antiemético se necessário.'
  },
  {
    id: 'morfina-10-cp',
    name: 'Sulfato de Morfina 10mg',
    genericName: 'Sulfato de Morfina',
    brandName: 'Dimorf 10mg',
    class: 'Analgésico Opióide Forte',
    type: 'controle_especial',
    controlledCategory: 'Lista A1 (Notificação de Receita A - Amarela)',
    defaultRoute: 'Uso oral',
    defaultPresentation: '10mg - Comprimidos (caixa com 50)',
    availablePresentations: [
      '10mg - Comprimidos (caixa com 50)',
      '30mg - Comprimidos (caixa com 50)',
      '10mg/mL - Ampola 1mL EV/SC'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral a cada 4 horas se dor refratária de forte intensidade (sob prescrição oncológica/dor crônica).',
    instructions: 'Medicamento sujeito a Notificação de Receita A (Amarela). Risco de dependência.'
  },
  {
    id: 'morfina-ampola-10mg',
    name: 'Sulfato de Morfina 10mg/mL Solução Injetável',
    genericName: 'Sulfato de Morfina',
    brandName: 'Dimorf Ampola',
    class: 'Analgésico Opióide Forte Parenteral',
    type: 'controle_especial',
    controlledCategory: 'Lista A1 (Notificação de Receita A - Amarela)',
    defaultRoute: 'Uso intravenoso',
    defaultPresentation: '10mg/mL - Ampola 1mL',
    availablePresentations: [
      '10mg/mL - Ampola 1mL',
      '0,2mg/mL - Ampola peridural/raquidiana'
    ],
    defaultPosology: 'Diluir 1 ampola (10mg) em 9mL de AD ou SF 0,9% (1mg/mL). Fazer 2 a 4mg EV lento a cada 4 horas se dor intensa.',
    instructions: 'Monitorar frequência respiratória, saturação de oxigênio e nível de consciência.'
  },
  {
    id: 'oxicodona-10-cp',
    name: 'Cloridrato de Oxicodona 10mg Liberação Prolongada',
    genericName: 'Cloridrato de Oxicodona',
    brandName: 'Oxycontin 10mg',
    class: 'Analgésico Opióide Semissintético Forte',
    type: 'controle_especial',
    controlledCategory: 'Lista A1 (Notificação de Receita A - Amarela)',
    defaultRoute: 'Uso oral',
    defaultPresentation: '10mg - Comprimidos de liberação prolongada (caixa com 30)',
    availablePresentations: [
      '10mg - Comprimidos (caixa com 30)',
      '20mg - Comprimidos (caixa com 30)'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral a cada 12 horas, deglutido inteiro.',
    instructions: 'Nunca partir, mastigar ou triturar os comprimidos de liberação prolongada.'
  },
  {
    id: 'fentanila-adesivo-25',
    name: 'Fentanila Transdérmica 25mcg/h Adesivo',
    genericName: 'Fentanila',
    brandName: 'Durogesic D-Trans 25mcg/h',
    class: 'Analgésico Opióide Transdérmico Potente',
    type: 'controle_especial',
    controlledCategory: 'Lista A1 (Notificação de Receita A - Amarela)',
    defaultRoute: 'Uso tópico',
    defaultPresentation: '25mcg/h - Sistema adesivo transdérmico (caixa com 5 adesivos)',
    availablePresentations: [
      '25mcg/h - Adesivos (caixa com 5)',
      '50mcg/h - Adesivos (caixa com 5)'
    ],
    defaultPosology: 'Aplicar 1 adesivo sobre a pele limpa, seca e íntegra (tórax ou braço), trocando a cada 72 horas (3 dias).',
    instructions: 'Não expor a fonte de calor direta. Descarte seguro dobrando o adesivo sobre si mesmo.'
  },
  {
    id: 'neosaldina-cp',
    name: 'Dipirona + Mucato de Isometepteno + Cafeína',
    genericName: 'Dipirona + Mucato de Isometepteno + Cafeína',
    brandName: 'Neosaldina / Neosa',
    class: 'Analgésico Antienxaquecoso',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '300mg + 30mg + 30mg - Drágeas (blister com 10 ou 30)',
    availablePresentations: [
      'Drágeas (blister com 10 ou 30)',
      'Gotas frasco com 15mL'
    ],
    defaultPosology: 'Tomar 1 a 2 drágeas por via oral em dose única ao início dos sintomas de cefaleia. Se persistir, repetir após 6 horas (máx. 8 drágeas/dia).',
    instructions: 'Tomar com água. Evitar o uso crônico diário para não desencadear cefaleia por sobreuso de analgésicos.'
  },
  {
    id: 'cefalium-cp',
    name: 'Mesilato de Di-hidroergotamina + Dipirona + Cafeína + Cafeína + Metoclopramida',
    genericName: 'Di-hidroergotamina + Dipirona + Cafeína + Metoclopramida',
    brandName: 'Cefalium / Cefaliv / Ormigrein',
    class: 'Antienxaquecoso Específico',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '1mg + 350mg + 100mg + 100mg - Comprimidos (caixa com 12 ou 16)',
    availablePresentations: ['Comprimidos (caixa com 12 ou 16)'],
    defaultPosology: 'Tomar 1 a 2 comprimidos ao primeiro sinal da crise de enxaqueca; se necessário, 1 comprimido a cada 30 minutos (máx. 6 comprimidos/dia).',
    instructions: 'Contraindicado na gravidez, cardiopatia isquêmica e hipertensão não controlada.'
  },
  {
    id: 'naratriptana-25-cp',
    name: 'Cloridrato de Naratriptana 2,5mg',
    genericName: 'Cloridrato de Naratriptana',
    brandName: 'Naramig',
    class: 'Antienxaquecoso / Agonista Seletivo 5-HT1',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '2,5mg - Comprimidos revestidos (caixa com 4 ou 10)',
    availablePresentations: ['2,5mg - Comprimidos (caixa com 4 ou 10)'],
    defaultPosology: 'Tomar 1 comprimido por via oral ao primeiro sinal de crise de enxaqueca com água. Se a dor retornar, tomar 1 segundo comprimido após 4 horas.',
    instructions: 'Dose máxima diária de 5mg (2 comprimidos). Não utilizar em conjunto com ergotamina.'
  },
  {
    id: 'sumatriptana-50-cp',
    name: 'Succinato de Sumatriptana 50mg',
    genericName: 'Succinato de Sumatriptana',
    brandName: 'Imigran 50mg',
    class: 'Antienxaquecoso / Triptano',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '50mg - Comprimidos revestidos (caixa com 2)',
    availablePresentations: [
      '50mg - Comprimidos (caixa com 2)',
      '100mg - Comprimidos (caixa com 2)'
    ],
    defaultPosology: 'Tomar 1 comprimido de 50mg por via oral na fase álgica da crise de enxaqueca. Intervalo mínimo de 2 horas se nova tomada.',
    instructions: 'Dose máxima de 200mg em 24h. Contraindicado em histórico de IAM, AVC ou HAS descontrolada.'
  },
  {
    id: 'zolmitriptana-25-cp',
    name: 'Zolmitriptana 2,5mg',
    genericName: 'Zolmitriptana',
    brandName: 'Zomig',
    class: 'Antienxaquecoso Triptano Orodispersível',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '2,5mg - Comprimidos orodispersíveis (caixa com 2)',
    availablePresentations: ['2,5mg - Comprimidos orodispersíveis (caixa com 2)'],
    defaultPosology: 'Colocar 1 comprimido sobre a língua ao primeiro sinal de enxaqueca. Deixar dissolver completamente na saliva.',
    instructions: 'Não necessita de ingestão com água.'
  }
];
