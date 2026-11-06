import { Medication } from '../../types';

export const PSYCHIATRY_MEDICATIONS: Medication[] = [
  // ==========================================
  // INIBIDORES SELETIVOS DA RECAPTAÇÃO DE SEROTONINA (ISRS) - LISTA C1
  // ==========================================
  {
    id: 'sertralina-50-cp',
    name: 'Cloridrato de Sertralina 50mg',
    genericName: 'Cloridrato de Sertralina',
    brandName: 'Zoloft / Assert / Tolrest 50mg',
    class: 'Antidepressivo / Inibidor Seletivo da Recaptação de Serotonina (ISRS)',
    type: 'controle_especial',
    controlledCategory: 'Lista C1 (Receita de Controle Especial em 2 vias)',
    defaultRoute: 'Uso oral',
    defaultPresentation: '50mg - Comprimidos revestidos (caixa com 30)',
    availablePresentations: [
      '25mg - Comprimidos (caixa com 30)',
      '50mg - Comprimidos (caixa com 30)',
      '100mg - Comprimidos (caixa com 30)'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral uma vez ao dia pela manhã (ou à noite), de uso contínuo.',
    instructions: 'Efeito terapêutico pleno observado a partir de 2 a 4 semanas. Não interromper o tratamento sem orientação médica.'
  },
  {
    id: 'escitalopram-10-cp',
    name: 'Oxalato de Escitalopram 10mg',
    genericName: 'Oxalato de Escitalopram',
    brandName: 'Lexapro / Reconter 10mg',
    class: 'Antidepressivo ISRS de Alta Seletividade',
    type: 'controle_especial',
    controlledCategory: 'Lista C1 (Receita de Controle Especial em 2 vias)',
    defaultRoute: 'Uso oral',
    defaultPresentation: '10mg - Comprimidos revestidos (caixa com 30)',
    availablePresentations: [
      '10mg - Comprimidos (caixa com 30)',
      '15mg - Comprimidos (caixa com 30)',
      '20mg - Comprimidos (caixa com 30)',
      '20mg/mL - Gotas frasco 15mL'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral uma vez ao dia pela manhã com água, de uso contínuo.',
    instructions: 'Excelente perfil de segurança e menor potencial de interações medicamentosas. Receita retida de controle especial (Lista C1).'
  },
  {
    id: 'fluoxetina-20-cap',
    name: 'Cloridrato de Fluoxetina 20mg',
    genericName: 'Cloridrato de Fluoxetina',
    brandName: 'Prozac / Daforin 20mg',
    class: 'Antidepressivo ISRS Clássico de Longa Meia-vida',
    type: 'controle_especial',
    controlledCategory: 'Lista C1 (Receita de Controle Especial em 2 vias)',
    defaultRoute: 'Uso oral',
    defaultPresentation: '20mg - Cápsulas duras (caixa com 30)',
    availablePresentations: [
      '20mg - Cápsulas (caixa com 30)',
      '20mg/mL - Gotas frasco 20mL'
    ],
    defaultPosology: 'Tomar 1 cápsula por via oral pela manhã com o desjejum, de uso contínuo.',
    instructions: 'Tomar pela manhã pelo potencial estimulante/ativador inicial. Menor risco de síndrome de descontinuação.'
  },
  {
    id: 'paroxetina-20-cp',
    name: 'Cloridrato de Paroxetina 20mg',
    genericName: 'Cloridrato de Paroxetina',
    brandName: 'Pondera / Aropax 20mg',
    class: 'Antidepressivo ISRS Potente para Transtornos de Ansiedade e Pânico',
    type: 'controle_especial',
    controlledCategory: 'Lista C1 (Receita de Controle Especial em 2 vias)',
    defaultRoute: 'Uso oral',
    defaultPresentation: '20mg - Comprimidos revestidos (caixa com 30)',
    availablePresentations: [
      '20mg - Comprimidos (caixa com 30)',
      '25mg CR - Liberação modificada (caixa com 30)'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral pela manhã com alimentos, de uso contínuo.',
    instructions: 'Desmame deve ser gradual para evitar sintomas de retirada.'
  },
  {
    id: 'citalopram-20-cp',
    name: 'Bromidrato de Citalopram 20mg',
    genericName: 'Bromidrato de Citalopram',
    brandName: 'Cipramil / Procimax 20mg',
    class: 'Antidepressivo ISRS',
    type: 'controle_especial',
    controlledCategory: 'Lista C1 (Receita de Controle Especial em 2 vias)',
    defaultRoute: 'Uso oral',
    defaultPresentation: '20mg - Comprimidos revestidos (caixa com 30)',
    availablePresentations: ['20mg - Comprimidos (caixa com 30)'],
    defaultPosology: 'Tomar 1 comprimido por via oral pela manhã, de uso contínuo.',
    instructions: 'Receita C1 em 2 vias.'
  },

  // ==========================================
  // INIBIDORES DUAIS (ISRSN) E OUTROS ANTIDEPRESSIVOS - LISTA C1
  // ==========================================
  {
    id: 'venlafaxina-75-xr',
    name: 'Cloridrato de Venlafaxina 75mg Liberação Prolongada',
    genericName: 'Cloridrato de Venlafaxina XR',
    brandName: 'Efexor XR / Alenthus 75mg',
    class: 'Antidepressivo Inibidor Dual da Recaptação de Serotonina e Noradrenalina (ISRSN)',
    type: 'controle_especial',
    controlledCategory: 'Lista C1 (Receita de Controle Especial em 2 vias)',
    defaultRoute: 'Uso oral',
    defaultPresentation: '75mg - Cápsulas duras de liberação prolongada (caixa com 30)',
    availablePresentations: [
      '37,5mg - Cápsulas (caixa com 30)',
      '75mg - Cápsulas (caixa com 30)',
      '150mg - Cápsulas (caixa com 30)'
    ],
    defaultPosology: 'Tomar 1 cápsula por via oral uma vez ao dia pela manhã durante uma refeição, deglutida inteira.',
    instructions: 'Não mastigar os microgrânulos. Monitorar pressão arterial em doses elevadas.'
  },
  {
    id: 'desvenlafaxina-50-cp',
    name: 'Succinato de Desvenlafaxina Monoidratado 50mg',
    genericName: 'Succinato de Desvenlafaxina',
    brandName: 'Pristiq / Deller 50mg',
    class: 'Antidepressivo Dual de Dose Fixa Única Diária',
    type: 'controle_especial',
    controlledCategory: 'Lista C1 (Receita de Controle Especial em 2 vias)',
    defaultRoute: 'Uso oral',
    defaultPresentation: '50mg - Comprimidos de liberação prolongada (caixa com 30)',
    availablePresentations: [
      '50mg - Comprimidos (caixa com 30)',
      '100mg - Comprimidos (caixa com 30)'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral uma vez ao dia pela manhã com água.',
    instructions: 'Metabolismo independente do citocromo CYP2D6.'
  },
  {
    id: 'duloxetina-30-cap',
    name: 'Cloridrato de Duloxetina 30mg',
    genericName: 'Cloridrato de Duloxetina',
    brandName: 'Cymbalta / Velija 30mg',
    class: 'Antidepressivo Dual e Analgésico para Dor Crônica Neuropática / Fibromialgia',
    type: 'controle_especial',
    controlledCategory: 'Lista C1 (Receita de Controle Especial em 2 vias)',
    defaultRoute: 'Uso oral',
    defaultPresentation: '30mg - Cápsulas duras de liberação retardada (caixa com 30)',
    availablePresentations: [
      '30mg - Cápsulas (caixa com 30)',
      '60mg - Cápsulas (caixa com 30)'
    ],
    defaultPosology: 'Tomar 1 cápsula por via oral uma vez ao dia pela manhã ou noite com água.',
    instructions: 'Padrão ouro para depressão com sintomas dolorosos somáticos, fibromialgia e neuropatia diabética dolorosa.'
  },
  {
    id: 'bupropiona-150-xl',
    name: 'Cloridrato de Bupropiona 150mg Liberação Prolongada XL',
    genericName: 'Cloridrato de Bupropiona XL',
    brandName: 'Wellbutrin XL / Bup 150mg',
    class: 'Inibidor da Recaptação de Dopamina e Noradrenalina / Cessação do Tabagismo',
    type: 'controle_especial',
    controlledCategory: 'Lista C1 (Receita de Controle Especial em 2 vias)',
    defaultRoute: 'Uso oral',
    defaultPresentation: '150mg - Comprimidos de liberação prolongada (caixa com 30)',
    availablePresentations: [
      '150mg - Comprimidos (caixa com 30)',
      '300mg - Comprimidos (caixa com 30)'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral pela manhã, deglutido inteiro.',
    instructions: 'Não causa disfunção sexual e auxilia na perda de peso e cessação do tabagismo. CONTRAINDICADO em pacientes com epilepsia ou transtornos alimentares.'
  },
  {
    id: 'mirtazapina-30-cp',
    name: 'Mirtazapina 30mg Orodispersível SolTab',
    genericName: 'Mirtazapina',
    brandName: 'Remeron SolTab / Menelat 30mg',
    class: 'Antidepressivo Tetracíclico Noradrenérgico e Específico Serotoninérgico (NaSSA)',
    type: 'controle_especial',
    controlledCategory: 'Lista C1 (Receita de Controle Especial em 2 vias)',
    defaultRoute: 'Uso oral',
    defaultPresentation: '30mg - Comprimidos orodispersíveis (caixa com 30)',
    availablePresentations: [
      '15mg - Comprimidos (caixa com 30)',
      '30mg - Comprimidos (caixa com 30)',
      '45mg - Comprimidos (caixa com 30)'
    ],
    defaultPosology: 'Colocar 1 comprimido sobre a língua à noite ao deitar. Dissolve imediatamente sem necessidade de água.',
    instructions: 'Excelente efeito sedativo e orexígeno (aumenta apetite). Primeira escolha em depressão com insônia grave e perda de peso.'
  },
  {
    id: 'trazodona-50-cp',
    name: 'Cloridrato de Trazodona 50mg',
    genericName: 'Cloridrato de Trazodona',
    brandName: 'Donaren 50mg',
    class: 'Antidepressivo Antagonista 5-HT2 e Inibidor da Recaptação (SARI) / Hipnótico',
    type: 'controle_especial',
    controlledCategory: 'Lista C1 (Receita de Controle Especial em 2 vias)',
    defaultRoute: 'Uso oral',
    defaultPresentation: '50mg - Comprimidos birranhurados (caixa com 30 ou 60)',
    availablePresentations: [
      '50mg - Comprimidos (caixa com 60)',
      '100mg - Comprimidos (caixa com 30)',
      '150mg XR - Liberação prolongada (caixa com 30)'
    ],
    defaultPosology: 'Tomar 1 comprimido (50mg) por via oral cerca de 30 a 60 minutos antes de dormir.',
    instructions: 'Muito prescrito para insônia em pacientes com ansiedade ou depressão sem causar dependência química.'
  },
  {
    id: 'amitriptilina-25-cp',
    name: 'Cloridrato de Amitriptilina 25mg',
    genericName: 'Cloridrato de Amitriptilina',
    brandName: 'Tryptanol 25mg',
    class: 'Antidepressivo Tricíclico (Cefaleia, Enxaqueca, Dor Crônica)',
    type: 'controle_especial',
    controlledCategory: 'Lista C1 (Receita de Controle Especial em 2 vias)',
    defaultRoute: 'Uso oral',
    defaultPresentation: '25mg - Comprimidos revestidos (caixa com 30)',
    availablePresentations: [
      '25mg - Comprimidos (caixa com 30)',
      '75mg - Comprimidos (caixa com 30)'
    ],
    defaultPosology: 'Profilaxia de enxaqueca / dor crônica / insônia: tomar 1 comprimido (25mg) por via oral à noite ao deitar.',
    instructions: 'Efeito sedativo e anticolinérgico (boca seca, constipação). Cautela em idosos e cardiopatas.'
  },
  {
    id: 'nortriptilina-25-cap',
    name: 'Cloridrato de Nortriptilina 25mg',
    genericName: 'Cloridrato de Nortriptilina',
    brandName: 'Pamelor 25mg',
    class: 'Antidepressivo Tricíclico com Menor Efeito Hipotensivo',
    type: 'controle_especial',
    controlledCategory: 'Lista C1 (Receita de Controle Especial em 2 vias)',
    defaultRoute: 'Uso oral',
    defaultPresentation: '25mg - Cápsulas duras (caixa com 30)',
    availablePresentations: [
      '10mg - Cápsulas (caixa com 30)',
      '25mg - Cápsulas (caixa com 30)',
      '50mg - Cápsulas (caixa com 30)'
    ],
    defaultPosology: 'Tomar 1 cápsula por via oral à noite ao deitar com água.',
    instructions: 'Melhor tolerado em idosos do que a amitriptilina.'
  },

  // ==========================================
  // BENZODIAZEPÍNICOS - LISTA B1 (NOTIFICAÇÃO DE RECEITA AZUL)
  // ==========================================
  {
    id: 'clonazepam-2-cp',
    name: 'Clonazepam 2mg',
    genericName: 'Clonazepam',
    brandName: 'Rivotril 2mg',
    class: 'Ansiolítico e Anticonvulsivante Benzodiazepínico',
    type: 'controle_especial',
    controlledCategory: 'Lista B1 (Notificação de Receita B - Azul)',
    defaultRoute: 'Uso oral',
    defaultPresentation: '2mg - Comprimidos birranhurados (caixa com 30)',
    availablePresentations: [
      '0,5mg - Comprimidos (caixa com 30)',
      '2mg - Comprimidos (caixa com 30)',
      '2,5mg/mL - Gotas frasco 20mL (1 gota = 0,1mg)'
    ],
    defaultPosology: 'Tomar 1/2 a 1 comprimido por via oral à noite ao deitar (ou sob demanda para crises agudas de ansiedade/pânico).',
    instructions: 'Requer NOTIFICAÇÃO DE RECEITA B (AZUL). Risco de dependência química e tolerância em uso prolongado. Não suspender abruptamente.'
  },
  {
    id: 'clonazepam-gotas-25',
    name: 'Clonazepam Gotas 2,5mg/mL',
    genericName: 'Clonazepam',
    brandName: 'Rivotril Gotas',
    class: 'Benzodiazepínico em Gotas para Titulação Fina',
    type: 'controle_especial',
    controlledCategory: 'Lista B1 (Notificação de Receita B - Azul)',
    defaultRoute: 'Uso oral',
    defaultPresentation: '2,5mg/mL - Frasco conta-gotas com 20mL',
    availablePresentations: ['2,5mg/mL - Frasco 20mL'],
    defaultPosology: 'Tomar 5 a 10 gotas por via oral diluídas em um pouco de água à noite ou conforme crise.',
    instructions: '1 gota = 0,1mg de clonazepam. Risco de dependência.'
  },
  {
    id: 'diazepam-10-cp',
    name: 'Diazepam 10mg',
    genericName: 'Diazepam',
    brandName: 'Valium 10mg',
    class: 'Benzodiazepínico Clássico de Meia-vida Longa / Relaxante Muscular Central',
    type: 'controle_especial',
    controlledCategory: 'Lista B1 (Notificação de Receita B - Azul)',
    defaultRoute: 'Uso oral',
    defaultPresentation: '10mg - Comprimidos (caixa com 30)',
    availablePresentations: [
      '5mg - Comprimidos (caixa com 30)',
      '10mg - Comprimidos (caixa com 30)',
      '10mg/2mL - Ampola injetável EV/IM'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral à noite ao deitar se espasmo muscular severo ou ansiedade aguda.',
    instructions: 'Meia-vida de até 48 horas (metabólitos ativos). Acúmulo em idosos.'
  },
  {
    id: 'diazepam-ampola-10mg',
    name: 'Diazepam 10mg/2mL Solução Injetável',
    genericName: 'Diazepam',
    brandName: 'Valium Injetável',
    class: 'Anticonvulsivante Parenteral de Emergência',
    type: 'controle_especial',
    controlledCategory: 'Lista B1 (Notificação de Receita B - Azul)',
    defaultRoute: 'Uso intravenoso',
    defaultPresentation: '10mg/2mL - Ampola EV/IM',
    availablePresentations: ['10mg/2mL - Ampola'],
    defaultPosology: 'Crise convulsiva / Estado de mal epiléptico: 10mg (1 ampola) EV direto puro e lento (1mL por minuto). Pode repetir após 10 minutos se crise persistir.',
    instructions: 'Injeção EV pura sem diluição (precipita em soro). Não injetar rápido (risco de parada respiratória).'
  },
  {
    id: 'alprazolam-05-cp',
    name: 'Alprazolam 0,5mg',
    genericName: 'Alprazolam',
    brandName: 'Frontal 0,5mg / Apraz',
    class: 'Ansiolítico Benzodiazepínico Potente de Curta Duração',
    type: 'controle_especial',
    controlledCategory: 'Lista B1 (Notificação de Receita B - Azul)',
    defaultRoute: 'Uso oral',
    defaultPresentation: '0,5mg - Comprimidos (caixa com 30)',
    availablePresentations: [
      '0,25mg - Comprimidos (caixa com 30)',
      '0,5mg - Comprimidos (caixa com 30)',
      '1mg - Comprimidos (caixa com 30)',
      '2mg - Comprimidos (caixa com 30)'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral de 8/8h ou 12/12h conforme crise de ansiedade/pânico.',
    instructions: 'Rápido início de ação (15 a 30 minutos). Alto potencial de dependência.'
  },
  {
    id: 'zolpidem-10-cp',
    name: 'Hemitartarato de Zolpidem 10mg',
    genericName: 'Hemitartarato de Zolpidem',
    brandName: 'Stilnox 10mg / Patz SL',
    class: 'Hipnótico Não Benzodiazepínico / Agonista Seletivo Ômega-1',
    type: 'controle_especial',
    controlledCategory: 'Lista B1 (Notificação de Receita B - Azul)',
    defaultRoute: 'Uso oral',
    defaultPresentation: '10mg - Comprimidos revestidos (caixa com 20 ou 30)',
    availablePresentations: [
      '10mg - Comprimidos (caixa com 20)',
      '5mg - Comprimidos sublinguais SL (caixa com 30)'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral IMEDIATAMENTE ANTES DE DEITAR NA CAMA.',
    instructions: 'Ação rápida (10 a 20 minutos). O paciente já deve estar deitado pronto para dormir para evitar sonambulismo e amnésia retrógrada.'
  },

  // ==========================================
  // ANTIPSICÓTICOS E ESTABILIZADORES - LISTA C1
  // ==========================================
  {
    id: 'quetiapina-25-cp',
    name: 'Fumarato de Quetiapina 25mg',
    genericName: 'Fumarato de Quetiapina',
    brandName: 'Seroquel 25mg / Queropax',
    class: 'Antipsicótico Atípico / Sedativo em Baixa Dose',
    type: 'controle_especial',
    controlledCategory: 'Lista C1 (Receita de Controle Especial em 2 vias)',
    defaultRoute: 'Uso oral',
    defaultPresentation: '25mg - Comprimidos revestidos (caixa com 30)',
    availablePresentations: [
      '25mg - Comprimidos (caixa com 30)',
      '100mg - Comprimidos (caixa com 30)',
      '200mg - Comprimidos (caixa com 30)',
      '50mg XRO - Liberação prolongada (caixa com 30)'
    ],
    defaultPosology: 'Tomar 1 a 2 comprimidos (25 a 50mg) por via oral à noite ao deitar com água.',
    instructions: 'Baixa dose tem forte efeito sedativo por bloqueio anti-histamínico H1. Não causa sintomas extrapiramidais significativos.'
  },
  {
    id: 'risperidona-1-cp',
    name: 'Risperidona 1mg',
    genericName: 'Risperidona',
    brandName: 'Risperdal 1mg / Zargus',
    class: 'Antipsicótico Atípico Antagonista D2 e 5-HT2A',
    type: 'controle_especial',
    controlledCategory: 'Lista C1 (Receita de Controle Especial em 2 vias)',
    defaultRoute: 'Uso oral',
    defaultPresentation: '1mg - Comprimidos revestidos (caixa com 30)',
    availablePresentations: [
      '1mg - Comprimidos (caixa com 30)',
      '2mg - Comprimidos (caixa com 30)',
      '1mg/mL - Solução oral frasco com seringa dosadora 30mL'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral à noite ao deitar (ou fracionado de 12/12h).',
    instructions: 'Monitorar ganho de peso e prolactina.'
  },
  {
    id: 'olanzapina-5-cp',
    name: 'Olanzapina 5mg',
    genericName: 'Olanzapina',
    brandName: 'Zyprexa 5mg',
    class: 'Antipsicótico Atípico de Amplo Espectro',
    type: 'controle_especial',
    controlledCategory: 'Lista C1 (Receita de Controle Especial em 2 vias)',
    defaultRoute: 'Uso oral',
    defaultPresentation: '5mg - Comprimidos revestidos (caixa com 30)',
    availablePresentations: [
      '5mg - Comprimidos (caixa com 30)',
      '10mg - Comprimidos (caixa com 30)'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral à noite ao deitar.',
    instructions: 'Monitorar perfil lipídico e glicêmico (risco de ganho ponderal).'
  },
  {
    id: 'haloperidol-5-cp',
    name: 'Haloperidol 5mg',
    genericName: 'Haloperidol',
    brandName: 'Haldol 5mg',
    class: 'Antipsicótico Típico de Alta Potência',
    type: 'controle_especial',
    controlledCategory: 'Lista C1 (Receita de Controle Especial em 2 vias)',
    defaultRoute: 'Uso oral',
    defaultPresentation: '5mg - Comprimidos (caixa com 30)',
    availablePresentations: [
      '1mg - Comprimidos (caixa com 30)',
      '5mg - Comprimidos (caixa com 30)',
      '2mg/mL - Gotas frasco 20mL',
      '5mg/mL - Ampola injetável 1mL IM/EV',
      '50mg/mL - Haldol Decanoato ampola IM mensal'
    ],
    defaultPosology: 'Tomar 1 comprimido (5mg) por via oral à noite ou fracionado.',
    instructions: 'Monitorar sintomas extrapiramidais (rigidez, tremor, distonia). Se ocorrer distonia aguda, administrar prometazina ou biperideno.'
  },
  {
    id: 'haloperidol-ampola-5mg',
    name: 'Haloperidol 5mg/mL Solução Injetável',
    genericName: 'Haloperidol',
    brandName: 'Haldol Injetável',
    class: 'Antipsicótico Parenteral para Agitação Psicomotora Aguda',
    type: 'controle_especial',
    controlledCategory: 'Lista C1 (Receita de Controle Especial em 2 vias)',
    defaultRoute: 'Uso intramuscular',
    defaultPresentation: '5mg/mL - Ampola 1mL IM',
    availablePresentations: ['5mg/mL - Ampola 1mL'],
    defaultPosology: 'Agitação psicomotora / Delirium hiperativo: 5mg (1 ampola) IM profunda, associado ou não a prometazina 50mg IM (esquema Haldol + Fenergan).',
    instructions: 'Padrão ouro em emergências psiquiátricas para contenção química segura do paciente agitado.'
  },
  {
    id: 'carbonato-litio-300',
    name: 'Carbonato de Lítio 300mg',
    genericName: 'Carbonato de Lítio',
    brandName: 'Carbolitium 300mg',
    class: 'Estabilizador do Humor / Prevenção de Crises Maníacas e Suicídio',
    type: 'controle_especial',
    controlledCategory: 'Lista C1 (Receita de Controle Especial em 2 vias)',
    defaultRoute: 'Uso oral',
    defaultPresentation: '300mg - Comprimidos revestidos (caixa com 50)',
    availablePresentations: [
      '300mg - Comprimidos (caixa com 50)',
      '450mg CR - Liberação controlada (caixa com 30)'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral 2 a 3 vezes ao dia com água logo após refeições.',
    instructions: 'OBRIGATÓRIO monitorar litemia a cada 3 a 6 meses (janela terapêutica estreita entre 0,6 e 1,0 mEq/L), além de função renal e TSH. Manter hidratação regular.'
  },
  {
    id: 'acido-valproico-500',
    name: 'Valproato de Sódio / Ácido Valproico 500mg',
    genericName: 'Ácido Valproico / Valproato de Sódio',
    brandName: 'Depakene / Depakote ER 500mg',
    class: 'Anticonvulsivante e Estabilizador do Humor',
    type: 'controle_especial',
    controlledCategory: 'Lista C1 (Receita de Controle Especial em 2 vias)',
    defaultRoute: 'Uso oral',
    defaultPresentation: '500mg - Comprimidos de liberação prolongada ER (caixa com 30)',
    availablePresentations: [
      '250mg - Cápsulas (caixa com 30)',
      '500mg - Comprimidos ER (caixa com 30)',
      '250mg/5mL - Xarope frasco 100mL'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral 2 vezes ao dia às refeições.',
    instructions: 'ALTAMENTE TERATOGÊNICO: contraindicado em mulheres em idade fértil sem contracepção eficaz (risco elevado de malformações e espinha bífida).'
  },
  {
    id: 'carbamazepina-200-cp',
    name: 'Carbamazepina 200mg',
    genericName: 'Carbamazepina',
    brandName: 'Tegretol 200mg',
    class: 'Anticonvulsivante e Tratamento da Neuralgia do Trigêmeo',
    type: 'controle_especial',
    controlledCategory: 'Lista C1 (Receita de Controle Especial em 2 vias)',
    defaultRoute: 'Uso oral',
    defaultPresentation: '200mg - Comprimidos (caixa com 30)',
    availablePresentations: [
      '200mg - Comprimidos (caixa com 30)',
      '400mg CR - Comprimidos (caixa com 30)',
      '20mg/mL - Suspensão oral 100mL'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral 2 a 3 vezes ao dia após refeições.',
    instructions: 'Primeira escolha para Neuralgia do Trigêmeo. Monitorar hemograma e sódio sérico (risco de hiponatremia).'
  },
  {
    id: 'pregabalina-75-cap',
    name: 'Pregabalina 75mg',
    genericName: 'Pregabalina',
    brandName: 'Lyrica 75mg / Prebictal',
    class: 'Modulador dos Canais de Cálcio Alfa-2-Delta / Dor Neuropática e Ansiedade',
    type: 'controle_especial',
    controlledCategory: 'Lista C1 (Receita de Controle Especial em 2 vias)',
    defaultRoute: 'Uso oral',
    defaultPresentation: '75mg - Cápsulas duras (caixa com 30)',
    availablePresentations: [
      '75mg - Cápsulas (caixa com 30)',
      '150mg - Cápsulas (caixa com 30)'
    ],
    defaultPosology: 'Tomar 1 cápsula por via oral à noite ao deitar (ou 75mg de 12/12h).',
    instructions: 'Excelente eficácia em dor neuropática periférica, fibromialgia e TAG. Pode causar tontura e sonolência no início.'
  },
  {
    id: 'metilfenidato-10-cp',
    name: 'Cloridrato de Metilfenidato 10mg (Ritalina)',
    genericName: 'Cloridrato de Metilfenidato',
    brandName: 'Ritalina 10mg',
    class: 'Psicoestimulante para TDAH e Narcolepsia',
    type: 'controle_especial',
    controlledCategory: 'Lista A3 (Notificação de Receita A - Amarela)',
    defaultRoute: 'Uso oral',
    defaultPresentation: '10mg - Comprimidos (caixa com 30 ou 60)',
    availablePresentations: [
      '10mg - Comprimidos (caixa com 30)',
      '10mg LA - Liberação modificada (caixa com 30)',
      '18mg / 36mg / 54mg - Concerta OROS (caixa com 30)'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral pela manhã e 1 comprimido no almoço com alimentos.',
    instructions: 'NOTIFICAÇÃO DE RECEITA A (AMARELA). Não tomar após as 16h para não prejudicar o sono.'
  },
  {
    id: 'lisdexanfetamina-30-cap',
    name: 'Dimesilato de Lisdexanfetamina 30mg (Venvanse)',
    genericName: 'Dimesilato de Lisdexanfetamina',
    brandName: 'Venvanse 30mg / Juneve',
    class: 'Psicoestimulante de Ação Prolongada para TDAH e TCA',
    type: 'controle_especial',
    controlledCategory: 'Lista A3 (Notificação de Receita A - Amarela)',
    defaultRoute: 'Uso oral',
    defaultPresentation: '30mg - Cápsulas (caixa com 28)',
    availablePresentations: [
      '30mg - Cápsulas (caixa com 28)',
      '50mg - Cápsulas (caixa com 28)',
      '70mg - Cápsulas (caixa com 28)'
    ],
    defaultPosology: 'Tomar 1 cápsula por via oral pela manhã com ou sem alimentos.',
    instructions: 'NOTIFICAÇÃO DE RECEITA A (AMARELA). Pró-fármaco com duração de 12 a 14 horas e menor potencial de abuso.'
  }
];
