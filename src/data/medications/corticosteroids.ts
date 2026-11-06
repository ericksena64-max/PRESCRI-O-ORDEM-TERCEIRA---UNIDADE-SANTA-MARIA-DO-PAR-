import { Medication } from '../../types';

export const CORTICOSTEROIDS_MEDICATIONS: Medication[] = [
  {
    id: 'prednisona-20-cp',
    name: 'Prednisona 20mg',
    genericName: 'Prednisona',
    brandName: 'Meticorten 20mg',
    class: 'Glicocorticoide Oral Sistêmico',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '20mg - Comprimidos (caixa com 10 ou 20)',
    availablePresentations: [
      '5mg - Comprimidos (caixa com 20)',
      '20mg - Comprimidos (caixa com 20)'
    ],
    defaultPosology: 'Tomar 1 a 2 comprimidos por via oral pela manhã em dose única com o desjejum por 5 dias.',
    instructions: 'Tomar preferencialmente pela manhã (respeitando o ritmo circadiano do cortisol) com alimentos para reduzir irritação gástrica.'
  },
  {
    id: 'prednisona-5-cp',
    name: 'Prednisona 5mg',
    genericName: 'Prednisona',
    brandName: 'Meticorten 5mg',
    class: 'Glicocorticoide Oral Sistêmico Dose Baixa',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '5mg - Comprimidos (caixa com 20)',
    availablePresentations: ['5mg - Comprimidos (caixa com 20)'],
    defaultPosology: 'Tomar pela manhã com alimentos conforme esquema de desmame ou manutenção.',
    instructions: 'Tomar pela manhã.'
  },
  {
    id: 'prednisolona-3mg-solucao',
    name: 'Fosfato Sódico de Prednisolona 3mg/mL Solução Oral',
    genericName: 'Fosfato Sódico de Prednisolona',
    brandName: 'Prelone / Predsim 3mg/mL',
    class: 'Corticosteroide Pediátrico Líquido',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '3mg/mL - Frasco com 60mL ou 120mL com seringa dosadora',
    availablePresentations: [
      '3mg/mL - Frasco 60mL',
      '3mg/mL - Frasco 120mL',
      '1mg/mL - Frasco 100mL',
      '20mg - Comprimidos (caixa com 10)'
    ],
    defaultPosology: 'Dose: 1 a 2 mg/kg/dia por via oral em tomada única pela manhã com café por 3 a 5 dias (dose máxima 40mg a 60mg/dia).',
    instructions: 'Não necessita de desmame progressivo se o uso for inferior a 7 a 10 dias. Agitar o frasco.'
  },
  {
    id: 'dexametasona-4-cp',
    name: 'Dexametasona 4mg',
    genericName: 'Dexametasona',
    brandName: 'Decadron 4mg',
    class: 'Glicocorticoide de Alta Potência Sem Efeito Mineralocorticoide',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '4mg - Comprimidos (caixa com 10)',
    availablePresentations: [
      '4mg - Comprimidos (caixa com 10)',
      '0,1mg/mL - Elixir frasco 120mL',
      '4mg/mL - Ampola injetável 2,5mL (10mg/2,5mL) EV/IM'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral pela manhã por 3 a 5 dias.',
    instructions: 'Potência anti-inflamatória cerca de 25 vezes maior que a hidrocortisona, com retenção hídrica mínima.'
  },
  {
    id: 'dexametasona-elixir-pediatrico',
    name: 'Dexametasona Elixir 0,1mg/mL Pediátrico',
    genericName: 'Dexametasona',
    brandName: 'Decadron Elixir',
    class: 'Glicocorticoide Pediátrico Oral',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '0,1mg/mL - Frasco com 120mL',
    availablePresentations: ['0,1mg/mL - Frasco 120mL'],
    defaultPosology: 'Laringite / Crupe viral: 0,15 a 0,6 mg/kg em dose única ou por via oral pela manhã por até 3 dias.',
    instructions: 'Excelente absorção oral.'
  },
  {
    id: 'dexametasona-ampola-10mg',
    name: 'Fosfato Dissódico de Dexametasona 10mg/2,5mL Injetável',
    genericName: 'Dexametasona Fosfato',
    brandName: 'Decadron Injetável',
    class: 'Glicocorticoide Parenteral de Alta Potência',
    type: 'simples',
    defaultRoute: 'Uso intravenoso',
    defaultPresentation: '10mg/2,5mL (4mg/mL) - Frasco-ampola EV/IM',
    availablePresentations: [
      '4mg/mL - Ampola 1mL',
      '10mg/2,5mL - Frasco-ampola'
    ],
    defaultPosology: 'Administrar 4mg a 10mg EV lento ou IM profundo a cada 12 ou 24 horas.',
    instructions: 'Em emergências (edema de glote, broncoespasmo severo, anafilaxia após adrenalina).'
  },
  {
    id: 'diprospan-injetavel-deposito',
    name: 'Dipropionato de Betametasona + Fosfato Dissódico (Diprospan)',
    genericName: 'Dipropionato de Betametasona + Betametasona Fosfato',
    brandName: 'Diprospan / BetaTrinta',
    class: 'Corticosteroide Injetável de Ação Rápida e Prolongada (Depósito)',
    type: 'simples',
    defaultRoute: 'Uso intramuscular',
    defaultPresentation: '5mg + 2mg por mL - Ampola de 1mL com seringa descartável',
    availablePresentations: ['Ampola 1mL com seringa preenchida'],
    defaultPosology: 'Aplicar 1 ampola (1mL) por via intramuscular profunda no glúteo em dose única.',
    instructions: 'EXCLUSIVAMENTE INTRAMUSCULAR PROFUNDA. NUNCA ADMINISTRAR POR VIA INTRAVENOSA OU SUBCUTÂNEA (risco de atrofia tecidual grave).'
  },
  {
    id: 'hidrocortisona-500-iv',
    name: 'Succinato Sódico de Hidrocortisona 500mg Pó Injetável',
    genericName: 'Succinato Sódico de Hidrocortisona',
    brandName: 'Flebocortid / Solu-Cortef 500mg',
    class: 'Glicocorticoide de Ação Rápida para Emergências',
    type: 'simples',
    defaultRoute: 'Uso intravenoso',
    defaultPresentation: '500mg - Frasco-ampola com diluente estéril',
    availablePresentations: [
      '100mg - Frasco-ampola',
      '500mg - Frasco-ampola'
    ],
    defaultPosology: 'Administrar 200mg a 500mg EV em bolus lento de 3 a 5 minutos na crise asmática aguda, choque anafilático ou insuficiência adrenal aguda.',
    instructions: 'Corticosteroide de início de ação mais veloz por via intravenosa.'
  },
  {
    id: 'metilprednisolona-500-iv',
    name: 'Succinato Sódico de Metilprednisolona 500mg (Solu-Medrol)',
    genericName: 'Succinato Sódico de Metilprednisolona',
    brandName: 'Solu-Medrol 500mg',
    class: 'Corticosteroide para Pulsoterapia e Emergência',
    type: 'simples',
    defaultRoute: 'Uso intravenoso',
    defaultPresentation: '500mg - Frasco-ampola com diluente próprio',
    availablePresentations: [
      '125mg - Frasco-ampola',
      '500mg - Frasco-ampola'
    ],
    defaultPosology: 'Pulsoterapia: 500mg a 1g diluído em 250mL a 500mL de SG 5% correr EV em 2 a 3 horas uma vez ao dia por 3 dias consecutivos.',
    instructions: 'Monitorar pressão arterial, glicemia e eletrocardiograma durante a infusão.'
  },
  {
    id: 'deflazacorte-30-cp',
    name: 'Deflazacorte 30mg',
    genericName: 'Deflazacorte',
    brandName: 'Calcort 30mg',
    class: 'Oxazolina Glicocorticoide com Menor Efeito Ósseo/Glicêmico',
    type: 'simples',
    defaultRoute: 'Uso oral',
    defaultPresentation: '30mg - Comprimidos (caixa com 10)',
    availablePresentations: [
      '6mg - Comprimidos (caixa com 20)',
      '30mg - Comprimidos (caixa com 10)'
    ],
    defaultPosology: 'Tomar 1 comprimido por via oral pela manhã por 5 a 7 dias.',
    instructions: 'Apresenta menor propensão a causar desmineralização óssea e hiperglicemia.'
  }
];
