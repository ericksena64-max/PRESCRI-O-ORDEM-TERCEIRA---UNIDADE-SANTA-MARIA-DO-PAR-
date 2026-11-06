import { Medication } from '../../types';

export const GASTROINTESTINAL_MEDICATIONS: Medication[] = [
  // ==========================================
  // INIBIDORES DA BOMBA DE PRÓTONS (IBPs) E ANTIÁCIDOS
  // ==========================================
  {
    id: 'omeprazol-20-cp',
    name: 'Omeprazol 20mg',
    genericName: 'Omeprazol',
    brandName: 'Losec / Gastrium',
    class: 'Inibidor da Bomba de Prótons (IBP)',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '20mg - Cápsulas duras com microgrânulos gastrorresistentes (caixa com 28)',
    availablePresentations: [
      '20mg - Cápsulas (caixa com 28 ou 56)',
      '40mg - Cápsulas (caixa com 28)',
      '40mg - Frasco-ampola pó injetável IV'
    ],
    defaultPosology: 'Tomar 1 cápsula por via oral pela manhã em jejum absoluto com água, aguardando 30 minutos para desjejuar.',
    instructions: 'Ingerir com água cerca de 30 a 60 minutos antes da primeira refeição. Engolir inteira sem mastigar os microgrânulos.'
  },
  {
    id: 'omeprazol-40-iv',
    name: 'Omeprazol Sódico 40mg Pó Injetável IV',
    genericName: 'Omeprazol Sódico',
    brandName: 'Losec IV 40mg',
    class: 'Inibidor da Bomba de Prótons Parenteral',
    type: 'simples',
    defaultRoute: 'Uso intravenoso',
    defaultPresentation: '40mg - Frasco-ampola com diluente próprio 10mL',
    availablePresentations: ['40mg - Frasco-ampola EV'],
    defaultPosology: 'Administrar 40mg EV em bolus lento de 5 minutos ou em infusão de 30 minutos a cada 12 ou 24 horas.',
    instructions: 'Excelente para profilaxia de úlcera de estresse e hemorragia digestiva alta.'
  },
  {
    id: 'pantoprazol-40-cp',
    name: 'Pantoprazol Sódico Sesqui-hidratado 40mg',
    genericName: 'Pantoprazol',
    brandName: 'Pantozol 40mg',
    class: 'Inibidor da Bomba de Prótons',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '40mg - Comprimidos revestidos gastrorresistentes (caixa com 28)',
    availablePresentations: [
      '20mg - Comprimidos (caixa com 28)',
      '40mg - Comprimidos (caixa com 28)',
      '40mg - Frasco-ampola pó injetável EV'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral pela manhã em jejum durante 4 a 8 semanas.',
    instructions: 'Menor potencial de interação medicamentosa que o omeprazol (especialmente com clopidogrel).'
  },
  {
    id: 'esomeprazol-40-cp',
    name: 'Esomeprazol Magnésico Tri-hidratado 40mg',
    genericName: 'Esomeprazol Magnésico',
    brandName: 'Nexium 40mg',
    class: 'Inibidor da Bomba de Prótons Isômero Puro',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '40mg - Comprimidos revestidos (caixa com 28)',
    availablePresentations: [
      '20mg - Comprimidos (caixa com 28)',
      '40mg - Comprimidos (caixa com 28)'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral pela manhã em jejum por 4 a 8 semanas.',
    instructions: 'Pode ser disperso em meio copo de água sem gás se o paciente tiver disfagia.'
  },
  {
    id: 'famotidina-40-cp',
    name: 'Famotidina 40mg',
    genericName: 'Famotidina',
    brandName: 'Famox 40mg',
    class: 'Antagonista dos Receptores H2 da Histamina',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '40mg - Comprimidos revestidos (caixa com 30)',
    availablePresentations: [
      '20mg - Comprimidos (caixa com 30)',
      '40mg - Comprimidos (caixa com 30)'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral à noite ao deitar ou de 12/12h.',
    instructions: 'Alternativa aos IBPs ou para escape ácido noturno.'
  },
  {
    id: 'sucralfato-1g-cp',
    name: 'Sucralfato 1g',
    genericName: 'Sucralfato',
    brandName: 'Sucrafilm 1g / Sucralfato',
    class: 'Protetor de Mucosa Gástrica',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '1g - Comprimidos mastigáveis (caixa com 30)',
    availablePresentations: [
      '1g - Comprimidos (caixa com 30)',
      '200mg/mL - Flaconetes de suspensão 10mL'
    ],
    defaultPosology: 'Tomar 1 comprimido (ou flaconete) 1 hora antes das principais refeições e ao deitar (4 vezes ao dia).',
    instructions: 'Forma barreira protetora física sobre úlceras. Tomar com o estômago vazio.'
  },
  {
    id: 'hidroxido-aluminio-magnesio',
    name: 'Hidróxido de Alumínio + Hidróxido de Magnésio + Simeticona',
    genericName: 'Hidróxido de Alumínio + Hidróxido de Magnésio + Simeticona',
    brandName: 'Mylanta Plus / Simeco Plus',
    class: 'Antiácido e Antiflatulento',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: 'Suspensão oral - Frasco com 240mL',
    availablePresentations: [
      'Suspensão frasco 240mL',
      'Pastilhas mastigáveis blister com 20'
    ],
    defaultPosology: 'Tomar 1 a 2 colheres de sopa (10 a 20mL) por via oral 1 hora após as refeições e ao deitar, se azia ou queimação.',
    instructions: 'Agitar bem antes de usar. Não tomar outros medicamentos 2 horas antes ou depois.'
  },

  // ==========================================
  // ANTIEMÉTICOS E PROCINÉTICOS
  // ==========================================
  {
    id: 'ondansetrona-8-flash',
    name: 'Cloridrato de Ondansetrona 8mg Orodispersível',
    genericName: 'Cloridrato de Ondansetrona',
    brandName: 'Vonau Flash / Zofran 8mg',
    class: 'Antiemético Antagonista Seletivo 5-HT3',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '8mg - Comprimidos orodispersíveis (caixa com 10)',
    availablePresentations: [
      '4mg - Comprimidos orodispersíveis (caixa com 10)',
      '8mg - Comprimidos orodispersíveis (caixa com 10)',
      '4mg/2mL - Ampola injetável EV/IM',
      '8mg/4mL - Ampola injetável EV/IM'
    ],
    defaultPosology: 'Colocar 1 comprimido sobre a língua a cada 8 horas se náuseas ou vômitos. Dissolve instantaneamente.',
    instructions: 'Não necessita de ingestão com água. Excelente tolerabilidade sem causar sedação ou efeitos extrapiramidais.'
  },
  {
    id: 'ondansetrona-4-flash',
    name: 'Cloridrato de Ondansetrona 4mg Orodispersível',
    genericName: 'Cloridrato de Ondansetrona',
    brandName: 'Vonau Flash 4mg',
    class: 'Antiemético Antagonista 5-HT3 Pediátrico / Adulto',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '4mg - Comprimidos orodispersíveis (caixa com 10)',
    availablePresentations: ['4mg - Comprimidos orodispersíveis (caixa com 10)'],
    defaultPosology: 'Crianças > 15 kg: 4mg a cada 8 horas se vômitos. Adultos: 4 a 8mg de 8/8h.',
    instructions: 'Dispersa na língua em segundos.'
  },
  {
    id: 'ondansetrona-ampola-8mg',
    name: 'Cloridrato de Ondansetrona 8mg/4mL Solução Injetável',
    genericName: 'Cloridrato de Ondansetrona',
    brandName: 'Zofran Injetável 8mg',
    class: 'Antiemético Parenteral',
    type: 'simples',
    defaultRoute: 'Uso intravenoso',
    defaultPresentation: '8mg/4mL - Ampola EV/IM',
    availablePresentations: [
      '4mg/2mL - Ampola',
      '8mg/4mL - Ampola'
    ],
    defaultPosology: 'Administrar 1 ampola (8mg) diluída em 20mL a 50mL de SF 0,9% EV lento em 2 a 5 minutos a cada 8 horas.',
    instructions: 'Antiemético de primeira linha em urgências hospitalares.'
  },
  {
    id: 'metoclopramida-10-cp',
    name: 'Cloridrato de Metoclopramida 10mg',
    genericName: 'Cloridrato de Metoclopramida',
    brandName: 'Plasil 10mg',
    class: 'Antiemético e Procinético Dopaminérgico D2',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '10mg - Comprimidos (caixa com 20)',
    availablePresentations: [
      '10mg - Comprimidos (caixa com 20)',
      '4mg/mL - Gotas frasco 20mL',
      '10mg/2mL - Ampola injetável EV/IM'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral a cada 8 horas, 30 minutos antes das principais refeições se náuseas ou plenitude.',
    instructions: 'Uso com cautela em jovens e idosos devido a risco de sintomas extrapiramidais (acatisia, distonia cervical).'
  },
  {
    id: 'metoclopramida-ampola-10mg',
    name: 'Cloridrato de Metoclopramida 10mg/2mL Injetável',
    genericName: 'Cloridrato de Metoclopramida',
    brandName: 'Plasil Ampola',
    class: 'Antiemético e Procinético Parenteral',
    type: 'simples',
    defaultRoute: 'Uso intravenoso',
    defaultPresentation: '10mg/2mL - Ampola EV/IM',
    availablePresentations: ['10mg/2mL - Ampola'],
    defaultPosology: 'Diluir em 20mL de SF 0,9% e administrar EV lentamente (mínimo de 3 minutos) a cada 8 horas se náuseas.',
    instructions: 'Injeção rápida pode causar ansiedade intensa, inquietação motora e acatisia súbita.'
  },
  {
    id: 'bromoprida-10-cp',
    name: 'Bromoprida 10mg',
    genericName: 'Bromoprida',
    brandName: 'Digesan 10mg / Plamet',
    class: 'Antiemético e Regulador da Motilidade Digestiva',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '10mg - Cápsulas ou comprimidos (caixa com 20)',
    availablePresentations: [
      '10mg - Cápsulas (caixa com 20)',
      '4mg/mL - Gotas frasco 20mL',
      '10mg/2mL - Ampola EV/IM'
    ],
    defaultPosology: 'Tomar 1 cápsula por via oral a cada 8 ou 12 horas, cerca de 30 minutos antes das refeições.',
    instructions: 'Menor incidência de efeitos extrapiramidais que a metoclopramida.'
  },
  {
    id: 'domperidona-10-cp',
    name: 'Domperidona 10mg',
    genericName: 'Domperidona',
    brandName: 'Motilium 10mg',
    class: 'Procinético Gástrico Sem Ação no SNC',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '10mg - Comprimidos (caixa com 30)',
    availablePresentations: [
      '10mg - Comprimidos (caixa com 30)',
      '1mg/mL - Suspensão oral frasco 100mL'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral 3 vezes ao dia, 15 a 30 minutos antes das refeições.',
    instructions: 'Não atravessa facilmente a barreira hematoencefálica, com menor risco de efeitos colaterais centrais.'
  },
  {
    id: 'dramin-b6-cp',
    name: 'Dimenidrinato + Cloridrato de Piridoxina (50mg + 10mg)',
    genericName: 'Dimenidrinato + Piridoxina (Vitamina B6)',
    brandName: 'Dramin B6',
    class: 'Antiemético e Antivertiginoso',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '50mg + 10mg - Comprimidos revestidos (caixa com 20 ou 30)',
    availablePresentations: [
      '50mg + 10mg - Comprimidos (caixa com 20)',
      'Gotas pediátricas frasco 20mL',
      'Ampola injetável IM/EV (Dramin B6 DL)'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral a cada 6 ou 8 horas se náuseas, vômitos ou cinetose (enjoo de viagem).',
    instructions: 'Pode causar sonolência significativa. Evitar ingestão concomitante com bebidas alcoólicas.'
  },
  {
    id: 'dramin-b6-ampola',
    name: 'Dimenidrinato + Vitamina B6 Injetável (Dramin B6 DL)',
    genericName: 'Dimenidrinato + Piridoxina',
    brandName: 'Dramin B6 DL Ampola',
    class: 'Antiemético Parenteral',
    type: 'simples',
    defaultRoute: 'Uso intravenoso',
    defaultPresentation: 'Ampola com 1mL (30mg dimenidrinato + 50mg piridoxina)',
    availablePresentations: ['Ampola 1mL EV/IM'],
    defaultPosology: 'Diluir 1 ampola em 100mL de SF 0,9% EV e infundir em 20 minutos se náuseas agudas.',
    instructions: 'Provoca sonolência moderada a intensa.'
  },

  // ==========================================
  // ANTIESPASMÓDICOS E GASES
  // ==========================================
  {
    id: 'butilbrometo-escopolamina-10',
    name: 'Butilbrometo de Escopolamina 10mg (Buscopan Simples)',
    genericName: 'Butilbrometo de Escopolamina',
    brandName: 'Buscopan',
    class: 'Antiespasmódico Anticolinérgico Gastrointestinal',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '10mg - Drágeas (caixa com 20)',
    availablePresentations: [
      '10mg - Drágeas (caixa com 20)',
      '10mg/mL - Gotas frasco 20mL',
      '20mg/mL - Ampola injetável EV/IM'
    ],
    defaultPosology: 'Tomar 1 a 2 drágeas por via oral a cada 6 ou 8 horas se cólicas abdominais ou dores em cólica.',
    instructions: 'Específico para contrações espásticas das vias digestivas, biliares e urogenitais. Efeito colateral: boca seca leve.'
  },
  {
    id: 'buscopan-composto-cp',
    name: 'Butilbrometo de Escopolamina + Dipirona (10mg + 250mg)',
    genericName: 'Butilbrometo de Escopolamina + Dipirona',
    brandName: 'Buscopan Composto',
    class: 'Antiespasmódico e Analgésico Potente',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '10mg + 250mg - Drágeas (caixa com 20)',
    availablePresentations: [
      'Drágeas (caixa com 20)',
      'Gotas frasco com 20mL',
      'Ampola injetável EV/IM 5mL'
    ],
    defaultPosology: 'Tomar 1 a 2 drágeas por via oral a cada 6 ou 8 horas se dor em cólica abdominal.',
    instructions: 'Ingerir com água sem mastigar.'
  },
  {
    id: 'buscopan-composto-ampola',
    name: 'Butilbrometo de Escopolamina + Dipirona Ampola 5mL',
    genericName: 'Escopolamina + Dipirona Injetável',
    brandName: 'Buscopan Composto Injetável',
    class: 'Antiespasmódico Parenteral',
    type: 'simples',
    defaultRoute: 'Uso intravenoso',
    defaultPresentation: 'Ampola de 5mL (20mg escopolamina + 2.500mg dipirona)',
    availablePresentations: ['Ampola 5mL EV/IM'],
    defaultPosology: 'Diluir 1 ampola (5mL) em 100mL de SF 0,9% EV e infundir lentamente em 20 minutos.',
    instructions: 'Infundir lentamente para evitar hipotensão arterial. Padrão ouro em cólica biliar e renal em pronto-socorro.'
  },
  {
    id: 'simeticona-125-cap',
    name: 'Simeticona 125mg Cápsulas Gelatinosas Moles',
    genericName: 'Simeticona',
    brandName: 'Luftal Max 125mg',
    class: 'Antiflatulento / Antigases',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '125mg - Cápsulas gelatinosas moles (caixa com 10)',
    availablePresentations: [
      '125mg - Cápsulas moles (caixa com 10)',
      '40mg - Comprimidos (caixa com 20)',
      '75mg/mL - Gotas frasco 15mL'
    ],
    defaultPosology: 'Tomar 1 cápsula por via oral a cada 6 ou 8 horas, após as refeições e ao deitar, se gases ou estufamento.',
    instructions: 'Não é absorvido sistemicamente, agindo alterando a tensão superficial das bolhas de ar.'
  },
  {
    id: 'simeticona-gotas-75',
    name: 'Simeticona Gotas 75mg/mL',
    genericName: 'Simeticona',
    brandName: 'Luftal Gotas',
    class: 'Antiflatulento Pediátrico / Adulto',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '75mg/mL - Frasco conta-gotas com 15mL',
    availablePresentations: ['75mg/mL - Frasco 15mL'],
    defaultPosology: 'Lactentes: 4 a 6 gotas a cada 8 horas. Crianças: 10 a 15 gotas de 8/8h. Adultos: 30 a 40 gotas de 8/8h.',
    instructions: 'Pode ser adicionado à mamadeira ou água.'
  },
  {
    id: 'pinaverio-100-cp',
    name: 'Brometo de Pinavério 100mg',
    genericName: 'Brometo de Pinavério',
    brandName: 'Dicetel 100mg',
    class: 'Bloqueador dos Canais de Cálcio Intestinal / Síndrome do Intestino Irritável',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '100mg - Comprimidos revestidos (caixa com 30)',
    availablePresentations: [
      '50mg - Comprimidos (caixa com 30)',
      '100mg - Comprimidos (caixa com 30)'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral 2 vezes ao dia, no meio das refeições, com um copo cheio de água.',
    instructions: 'Ingerir sempre sentado ou em pé com água durante as refeições; nunca deitar logo após para não irritar o esôfago.'
  },

  // ==========================================
  // ANTIDIARREICOS, PROBIÓTICOS E LAXATIVOS
  // ==========================================
  {
    id: 'loperamida-2-cp',
    name: 'Cloridrato de Loperamida 2mg',
    genericName: 'Cloridrato de Loperamida',
    brandName: 'Imosec 2mg',
    class: 'Antidiarreico Opioide Sintético Periférico',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '2mg - Comprimidos (caixa com 12)',
    availablePresentations: ['2mg - Comprimidos (caixa com 12)'],
    defaultPosology: 'Tomar 2 comprimidos (4mg) inicialmente, seguidos de 1 comprimido (2mg) após cada evacuação líquida (máx. 16mg/dia). Suspender quando fezes formadas.',
    instructions: 'CONTRAINDICADO em diarreias infecciosas com febre ou sangue nas fezes (disenteria) e suspeita de colite pseudomembranosa.'
  },
  {
    id: 'racecadotrila-100-cap',
    name: 'Racecadotrila 100mg',
    genericName: 'Racecadotrila',
    brandName: 'Tiorfan 100mg',
    class: 'Antissecretor Intestinal / Inibidor da Encefalinase',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '100mg - Cápsulas (caixa com 9)',
    availablePresentations: [
      '100mg - Cápsulas (caixa com 9)',
      '10mg e 30mg - Sachês infantis'
    ],
    defaultPosology: 'Tomar 1 cápsula de 100mg por via oral a cada 8 horas, antes das refeições, até melhora da diarreia (máx. 7 dias).',
    instructions: 'Reduz a hipersecreção de água e eletrólitos sem diminuir a motilidade intestinal e sem causar distensão.'
  },
  {
    id: 'floratil-200-cap',
    name: 'Saccharomyces boulardii 200mg',
    genericName: 'Saccharomyces boulardii-17',
    brandName: 'Floratil 200mg / Flomicin',
    class: 'Probiótico Restaurador da Flora Intestinal',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '200mg - Cápsulas (caixa com 6 ou 10)',
    availablePresentations: [
      '200mg - Cápsulas (caixa com 10)',
      '100mg - Cápsulas (caixa com 12)',
      '200mg - Sachês de pó oral (caixa com 4)'
    ],
    defaultPosology: 'Tomar 1 cápsula de 200mg por via oral 2 vezes ao dia por 3 a 5 dias.',
    instructions: 'Ingerir com água ou suco. Pode ser aberto e misturado a líquidos não quentes. Não usar com antifúngicos orais.'
  },
  {
    id: 'enterogermina-flaconetes',
    name: 'Esporos de Bacillus clausii 2 a 4 Bilhões',
    genericName: 'Bacillus clausii',
    brandName: 'Enterogermina / Enterogermina Plus',
    class: 'Probiótico em Flaconete Pronto para Uso',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: 'Flaconetes orais com 5mL de suspensão pronta (caixa com 10)',
    availablePresentations: ['Flaconetes 5mL (caixa com 5 ou 10)'],
    defaultPosology: 'Tomar 1 a 2 flaconetes por via oral ao dia.',
    instructions: 'Solução pronta para beber sem sabor. Exclusivamente uso oral, NUNCA INJETAR.'
  },
  {
    id: 'sais-reidratacao-oral-sro',
    name: 'Sais de Reidratação Oral (SRO) Envelope',
    genericName: 'Glicose + Cloreto de Sódio + Citrato + Cloreto de Potássio',
    brandName: 'Reidrat / Hidrax / SRO Fórmula OMS',
    class: 'Solução Eletrolítica de Reidratação Oral',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: 'Envelopes de 27,9g para diluição em 1 Litro de água (caixa com 4)',
    availablePresentations: ['Envelopes para 1 Litro de água filtrada'],
    defaultPosology: 'Dissolver 1 envelope em 1 Litro de água filtrada ou fervida. Beber pequenos goles frequentes ao longo do dia após cada episódio de perda diarreica.',
    instructions: 'Após preparado, conservar na geladeira e consumir em até 24 horas. Descartar sobras após 24 horas.'
  },
  {
    id: 'lactulose-xarope-667',
    name: 'Lactulose Xarope 667mg/mL',
    genericName: 'Lactulose',
    brandName: 'Lactulona / Farlac',
    class: 'Laxativo Osmótico e Prebiótico',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '667mg/mL - Frasco com 120mL com copo-medida',
    availablePresentations: ['667mg/mL - Frasco 120mL'],
    defaultPosology: 'Tomar 15 a 30mL por via oral 1 vez ao dia pela manhã ou divididos em 2 tomadas, ajustando conforme consistência das fezes.',
    instructions: 'Ação previsível e segura, podendo ser usado por períodos prolongados sob supervisão médica.'
  },
  {
    id: 'macrogol-4000-sache',
    name: 'Macrogol 4000 (Polietilenoglicol sem eletrólitos)',
    genericName: 'Macrogol 4000',
    brandName: 'Muvinlax / Peg 4000',
    class: 'Laxativo Osmótico Não Absorvível',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: 'Sachês de pó para solução oral (caixa com 14 ou 20)',
    availablePresentations: ['Sachês de pó (caixa com 20)'],
    defaultPosology: 'Dissolver 1 sachê em um copo de água (100 a 150mL) e tomar 1 a 2 vezes ao dia.',
    instructions: 'Não causa cólica nem dependência do peristaltismo. Ingerir bastante líquido durante o dia.'
  },
  {
    id: 'picossulfato-gotas-75',
    name: 'Picossulfato de Sódio Gotas 7,5mg/mL',
    genericName: 'Picossulfato de Sódio',
    brandName: 'Guttalax Gotas',
    class: 'Laxativo Estimulante do Trato Cólico',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '7,5mg/mL - Frasco conta-gotas 20mL',
    availablePresentations: ['7,5mg/mL - Frasco 20mL'],
    defaultPosology: 'Adultos: 10 a 20 gotas por via oral à noite ao deitar com água. O efeito ocorre em 6 a 12 horas.',
    instructions: 'Uso pontual; não utilizar de forma contínua sem orientação médica.'
  },
  {
    id: 'bisacodil-5-drg',
    name: 'Bisacodil 5mg',
    genericName: 'Bisacodil',
    brandName: 'Dulcolax 5mg',
    class: 'Laxativo Estimulante',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '5mg - Drágeas gastrorresistentes (caixa com 20)',
    availablePresentations: ['5mg - Drágeas (caixa com 20)'],
    defaultPosology: 'Tomar 1 a 2 drágeas por via oral à noite ao deitar com água.',
    instructions: 'Engolir inteira sem mastigar. Não tomar junto com leite ou antiácidos.'
  },
  {
    id: 'oleo-mineral-puro',
    name: 'Óleo Mineral 100% Puro',
    genericName: 'Óleo Mineral (Petrolato Líquido)',
    brandName: 'Nujol / Óleo Mineral USP',
    class: 'Laxativo Emoliente e Lubrificante Fecal',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: 'Frasco com 100mL',
    availablePresentations: ['Frasco com 100mL'],
    defaultPosology: 'Tomar 1 colher de sopa (15mL) 1 a 2 vezes ao dia, preferencialmente à noite ao deitar.',
    instructions: 'Tomar no mínimo 2 horas distante das principais refeições para não prejudicar absorção de vitaminas lipossolúveis (A, D, E, K).'
  },
  {
    id: 'fleet-enema-retal',
    name: 'Fosfato de Sódio Monobásico + Dibásico Enema Retal (Fleet Enema)',
    genericName: 'Fosfato de Sódio Monobásico e Dibásico',
    brandName: 'Fleet Enema / Phosfoenema 130mL',
    class: 'Laxativo Retal Osmótico de Rápida Ação',
    type: 'simples',
    defaultRoute: 'Uso retal',
    defaultPresentation: 'Frasco aplicador pronto para uso com cânula lubrificada 130mL',
    availablePresentations: ['Frasco 130mL retal'],
    defaultPosology: 'Aplicar 1 frasco por via retal em dose única. Reter o líquido até sentir forte vontade de evacuar (2 a 5 minutos).',
    instructions: 'Deitar de lado com joelhos dobrados (posição de Sims). Uso pontual para desimpactação fecal ou preparo de exames.'
  }
];
