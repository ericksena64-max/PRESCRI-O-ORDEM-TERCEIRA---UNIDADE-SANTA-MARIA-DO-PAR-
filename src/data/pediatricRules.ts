export interface PediatricDrugRule {
  id: string;
  name: string;
  genericName: string;
  category: 'analgesico' | 'antibiotico' | 'antiinflamatorio' | 'antialergico' | 'antiemetico' | 'corticoide' | 'respiratorio' | 'hidratacao' | 'vitaminas';
  presentation: string;
  formType: 'gotas' | 'suspensao_ml' | 'spray_jatos' | 'xarope_ml' | 'comprimido' | 'sache';
  concentration: string;
  route: string;
  frequency: string;
  minAgeMonths?: number;
  minWeightKg?: number;
  maxDosePerDay?: string;
  maxDosePerIntake?: string;
  calculationType: 'gotas_por_kg' | 'mg_kg_dia_dividido' | 'ml_kg_dose' | 'ml_kg_dia_dividido' | 'jatos_por_kg' | 'tabela_peso' | 'idade_faixa';
  calculateDose: (weightKg: number, ageYears?: number) => {
    calculatedValue: string;
    unit: string;
    posologyText: string;
    instructions: string;
    warning?: string;
  };
}

export const PEDIATRIC_DRUG_RULES: PediatricDrugRule[] = [
  // 1. Dipirona Gotas 500mg/mL
  {
    id: 'ped-dipirona-gotas',
    name: 'Dipirona Gotas 500mg/mL',
    genericName: 'Dipirona Monoidratada',
    category: 'analgesico',
    presentation: 'Frasco conta-gotas 500mg/mL (20mL)',
    formType: 'gotas',
    concentration: '500mg/mL (25mg por gota)',
    route: 'Uso oral',
    frequency: 'A cada 6 horas se dor ou febre (>37,8°C)',
    minAgeMonths: 3,
    minWeightKg: 5,
    maxDosePerIntake: '40 a 50 gotas por dose',
    maxDosePerDay: '4 doses/dia (máx. 200 gotas)',
    calculationType: 'gotas_por_kg',
    calculateDose: (weight) => {
      const w = Math.max(1, weight);
      // Regra prática padrão: 1 gota por kg de peso (15-20mg/kg/dose)
      const drops = Math.min(Math.round(w * 1), 40);
      const warning = w < 5 ? 'Contraindicado em crianças menores de 3 meses ou com peso inferior a 5 kg.' : undefined;
      return {
        calculatedValue: `${drops}`,
        unit: 'gotas',
        posologyText: `Dar ${drops} gotas por via oral a cada 6 horas em caso de dor ou febre (temperatura axilar ≥ 37,8°C).`,
        instructions: 'Diluir em pequena quantidade de água. Não ultrapassar 4 doses ao dia.',
        warning
      };
    }
  },

  // 2. Paracetamol Gotas 200mg/mL
  {
    id: 'ped-paracetamol-gotas',
    name: 'Paracetamol Gotas 200mg/mL',
    genericName: 'Paracetamol',
    category: 'analgesico',
    presentation: 'Frasco conta-gotas 200mg/mL (15mL)',
    formType: 'gotas',
    concentration: '200mg/mL (10mg por gota)',
    route: 'Uso oral',
    frequency: 'A cada 6 horas se dor ou febre',
    minWeightKg: 3,
    maxDosePerIntake: '35 a 55 gotas (ou 1000mg)',
    maxDosePerDay: 'Máximo 5 vezes ao dia',
    calculationType: 'gotas_por_kg',
    calculateDose: (weight) => {
      const w = Math.max(1, weight);
      // 10 a 15 mg/kg/dose = 1 a 1,5 gotas por kg
      const minDrops = Math.round(w * 1);
      const maxDrops = Math.min(Math.round(w * 1.5), 50);
      return {
        calculatedValue: `${minDrops} a ${maxDrops}`,
        unit: 'gotas',
        posologyText: `Dar ${minDrops} a ${maxDrops} gotas por via oral a cada 6 horas em caso de febre ou dor.`,
        instructions: 'Pode ser administrado diretamente na boca ou diluído em líquidos.',
        warning: undefined
      };
    }
  },

  // 3. Ibuprofeno Gotas 50mg/mL
  {
    id: 'ped-ibuprofeno-50',
    name: 'Ibuprofeno Gotas 50mg/mL (Infantil)',
    genericName: 'Ibuprofeno',
    category: 'antiinflamatorio',
    presentation: 'Frasco conta-gotas 50mg/mL (30mL)',
    formType: 'gotas',
    concentration: '50mg/mL (2,5mg por gota)',
    route: 'Uso oral',
    frequency: 'A cada 6 ou 8 horas por até 3 a 5 dias',
    minAgeMonths: 6,
    minWeightKg: 5,
    maxDosePerIntake: '80 gotas (200mg)',
    calculationType: 'gotas_por_kg',
    calculateDose: (weight) => {
      const w = Math.max(1, weight);
      // 5-10 mg/kg/dose = 2 a 4 gotas/kg
      const drops = Math.min(Math.round(w * 2), 80);
      return {
        calculatedValue: `${drops}`,
        unit: 'gotas',
        posologyText: `Dar ${drops} gotas por via oral de 6 em 6 horas ou de 8 em 8 horas se dor ou febre, por até 3 a 5 dias.`,
        instructions: 'Administrar preferencialmente após as refeições ou leite para proteger a mucosa gástrica.',
        warning: w < 5 ? 'Não recomendado para menores de 6 meses ou peso < 5kg sem avaliação especializada.' : undefined
      };
    }
  },

  // 4. Ibuprofeno Gotas 100mg/mL
  {
    id: 'ped-ibuprofeno-100',
    name: 'Ibuprofeno Gotas 100mg/mL',
    genericName: 'Ibuprofeno',
    category: 'antiinflamatorio',
    presentation: 'Frasco conta-gotas 100mg/mL (20mL)',
    formType: 'gotas',
    concentration: '100mg/mL (5mg por gota)',
    route: 'Uso oral',
    frequency: 'A cada 6 ou 8 horas',
    minAgeMonths: 6,
    minWeightKg: 5,
    maxDosePerIntake: '40 gotas (200mg)',
    calculationType: 'gotas_por_kg',
    calculateDose: (weight) => {
      const w = Math.max(1, weight);
      // 1 gota por kg de 100mg/mL
      const drops = Math.min(Math.round(w * 1), 40);
      return {
        calculatedValue: `${drops}`,
        unit: 'gotas',
        posologyText: `Dar ${drops} gotas por via oral a cada 6 ou 8 horas se dor ou febre.`,
        instructions: 'Dose máxima de 40 gotas por tomada.',
        warning: undefined
      };
    }
  },

  // 5. Amoxicilina Suspensão 250mg/5mL
  {
    id: 'ped-amoxicilina-250',
    name: 'Amoxicilina Suspensão 250mg/5mL',
    genericName: 'Amoxicilina',
    category: 'antibiotico',
    presentation: 'Frasco com pó para suspensão 250mg/5mL (150mL)',
    formType: 'suspensao_ml',
    concentration: '250mg/5mL (50mg por mL)',
    route: 'Uso oral',
    frequency: 'A cada 8 horas durante 10 dias',
    maxDosePerIntake: '10 mL por dose (500mg)',
    calculationType: 'mg_kg_dia_dividido',
    calculateDose: (weight) => {
      const w = Math.max(1, weight);
      // 50 mg/kg/dia = 1 mL/kg/dia dividido em 3 doses (8/8h) -> peso / 3 mL por dose
      const mlPerDose = Math.min(parseFloat((w / 3).toFixed(1)), 10);
      return {
        calculatedValue: `${mlPerDose}`,
        unit: 'mL',
        posologyText: `Dar ${mlPerDose} mL por via oral de 8 em 8 horas durante 10 dias consecutivos.`,
        instructions: 'Agitar bem o frasco antes de cada uso. Utilizar seringa dosadora para medir com precisão. Completar os 10 dias de tratamento.',
        warning: undefined
      };
    }
  },

  // 6. Amoxicilina + Clavulanato Suspensão 250mg+62,5mg/5mL
  {
    id: 'ped-amox-clav-250',
    name: 'Amoxicilina + Clavulanato Suspensão 250mg+62,5mg/5mL',
    genericName: 'Amoxicilina + Clavulanato de Potássio',
    category: 'antibiotico',
    presentation: 'Frasco pó para suspensão 250mg+62,5mg/5mL (75mL)',
    formType: 'suspensao_ml',
    concentration: '250mg Amox + 62,5mg Clav / 5mL',
    route: 'Uso oral',
    frequency: 'A cada 8 horas durante 10 dias',
    maxDosePerIntake: '10 mL por dose',
    calculationType: 'mg_kg_dia_dividido',
    calculateDose: (weight) => {
      const w = Math.max(1, weight);
      const mlPerDose = Math.min(parseFloat((w / 3).toFixed(1)), 10);
      return {
        calculatedValue: `${mlPerDose}`,
        unit: 'mL',
        posologyText: `Dar ${mlPerDose} mL por via oral a cada 8 horas durante 10 dias.`,
        instructions: 'Oferecer no início da alimentação para reduzir desconforto digestivo. Manter em geladeira após reconstituído.',
        warning: undefined
      };
    }
  },

  // 7. Amoxicilina + Clavulanato Suspensão 400mg+57mg/5mL (BID)
  {
    id: 'ped-amox-clav-400',
    name: 'Amoxicilina + Clavulanato Suspensão 400mg+57mg/5mL (12/12h)',
    genericName: 'Amoxicilina + Clavulanato de Potássio',
    category: 'antibiotico',
    presentation: 'Frasco com pó para suspensão oral (70mL)',
    formType: 'suspensao_ml',
    concentration: '400mg Amox + 57mg Clav / 5mL',
    route: 'Uso oral',
    frequency: 'A cada 12 horas durante 7 a 10 dias',
    maxDosePerIntake: '10 mL por dose',
    calculationType: 'ml_kg_dose',
    calculateDose: (weight) => {
      const w = Math.max(1, weight);
      // Dose: 0,3125 mL/kg/dose de 12/12h (50mg/kg/dia)
      const mlPerDose = Math.min(parseFloat((w * 0.3125).toFixed(1)), 10);
      return {
        calculatedValue: `${mlPerDose}`,
        unit: 'mL',
        posologyText: `Dar ${mlPerDose} mL por via oral a cada 12 horas durante 10 dias.`,
        instructions: 'Tomar no início da refeição. Conservar em geladeira.',
        warning: undefined
      };
    }
  },

  // 8. Azitromicina Suspensão 200mg/5mL
  {
    id: 'ped-azitromicina-200',
    name: 'Azitromicina Suspensão 200mg/5mL',
    genericName: 'Azitromicina',
    category: 'antibiotico',
    presentation: 'Frasco pó para suspensão 200mg/5mL (15mL ou 22,5mL)',
    formType: 'suspensao_ml',
    concentration: '200mg/5mL (40mg/mL)',
    route: 'Uso oral',
    frequency: '1 vez ao dia durante 5 dias consecutivos',
    maxDosePerDay: '12,5 mL (500mg/dia)',
    calculationType: 'ml_kg_dose',
    calculateDose: (weight) => {
      const w = Math.max(1, weight);
      // 10 mg/kg/dia = 0,25 mL/kg/dia em tomada única
      const mlDose = Math.min(parseFloat((w * 0.25).toFixed(1)), 12.5);
      return {
        calculatedValue: `${mlDose}`,
        unit: 'mL',
        posologyText: `Dar ${mlDose} mL por via oral 1 vez ao dia (em jejum ou 2h após refeição) durante 5 dias consecutivos.`,
        instructions: 'Agitar antes de usar. Administrar sempre no mesmo horário.',
        warning: undefined
      };
    }
  },

  // 9. Cefalexina Suspensão 250mg/5mL
  {
    id: 'ped-cefalexina-250',
    name: 'Cefalexina Suspensão 250mg/5mL',
    genericName: 'Cefalexina',
    category: 'antibiotico',
    presentation: 'Frasco pó para suspensão 250mg/5mL (100mL)',
    formType: 'suspensao_ml',
    concentration: '250mg/5mL (50mg/mL)',
    route: 'Uso oral',
    frequency: 'A cada 6 horas durante 7 a 10 dias',
    maxDosePerIntake: '10 mL (500mg)',
    calculationType: 'mg_kg_dia_dividido',
    calculateDose: (weight) => {
      const w = Math.max(1, weight);
      // 50 mg/kg/dia = 1 mL/kg/dia dividido por 4 doses (6/6h) = peso / 4
      const mlPerDose = Math.min(parseFloat((w / 4).toFixed(1)), 10);
      return {
        calculatedValue: `${mlPerDose}`,
        unit: 'mL',
        posologyText: `Dar ${mlPerDose} mL por via oral a cada 6 horas durante 7 a 10 dias.`,
        instructions: 'Guardar a suspensão na geladeira após o preparo.',
        warning: undefined
      };
    }
  },

  // 10. Prednisolona Solução Oral 3mg/mL (Prelone)
  {
    id: 'ped-prednisolona-3',
    name: 'Prednisolona Solução Oral 3mg/mL (Prelone)',
    genericName: 'Fosfato Sódico de Prednisolona',
    category: 'corticoide',
    presentation: 'Frasco com 60mL ou 120mL com seringa dosadora',
    formType: 'suspensao_ml',
    concentration: '3mg/mL',
    route: 'Uso oral',
    frequency: '1 vez ao dia pela manhã por 3 a 5 dias',
    maxDosePerDay: '20 mL (60mg/dia)',
    calculationType: 'ml_kg_dose',
    calculateDose: (weight) => {
      const w = Math.max(1, weight);
      // 1 mg/kg/dia = peso / 3 mL por dia pela manhã
      const mlDose = Math.min(parseFloat((w / 3).toFixed(1)), 20);
      return {
        calculatedValue: `${mlDose}`,
        unit: 'mL',
        posologyText: `Dar ${mlDose} mL por via oral 1 vez ao dia pela manhã, após o café da manhã, durante 3 a 5 dias.`,
        instructions: 'Administrar pela manhã. Não requer desmame em tratamentos curtos (< 7 dias).',
        warning: undefined
      };
    }
  },

  // 11. Dexametasona Elixir 0,5mg/5mL
  {
    id: 'ped-dexametasona-elixir',
    name: 'Dexametasona Elixir 0,5mg/5mL',
    genericName: 'Dexametasona',
    category: 'corticoide',
    presentation: 'Frasco com 120mL (0,1mg/mL)',
    formType: 'xarope_ml',
    concentration: '0,5mg/5mL (0,1mg/mL)',
    route: 'Uso oral',
    frequency: 'A cada 12 horas por 3 dias',
    maxDosePerDay: '15 mL/dia',
    calculationType: 'ml_kg_dose',
    calculateDose: (weight) => {
      const w = Math.max(1, weight);
      // 0,15 mg/kg/dia = 1,5 mL/kg/dia divididos de 12/12h -> ~0,75 mL/kg/dose
      const mlDose = Math.min(parseFloat((w * 0.75).toFixed(1)), 15);
      return {
        calculatedValue: `${mlDose}`,
        unit: 'mL',
        posologyText: `Dar ${mlDose} mL por via oral a cada 12 horas durante 3 dias.`,
        instructions: 'Ingerir com alimentos pela manhã e à noite.',
        warning: undefined
      };
    }
  },

  // 12. Ondansetrona Solução Oral 2mg/mL ou Comprimido Orodispersível
  {
    id: 'ped-ondansetrona-solucao',
    name: 'Ondansetrona Solução Oral 2mg/mL (Vonau)',
    genericName: 'Cloridrato de Ondansetrona',
    category: 'antiemetico',
    presentation: 'Frasco com 30mL ou 50mL (2mg/mL)',
    formType: 'suspensao_ml',
    concentration: '2mg/mL',
    route: 'Uso oral',
    frequency: 'A cada 8 horas se náuseas ou vômitos',
    calculationType: 'tabela_peso',
    calculateDose: (weight) => {
      const w = Math.max(1, weight);
      let doseMg = 2;
      let doseMl = 1;

      if (w < 8) {
        doseMg = 1;
        doseMl = 0.5;
      } else if (w <= 15) {
        doseMg = 2;
        doseMl = 1;
      } else if (w <= 30) {
        doseMg = 4;
        doseMl = 2;
      } else {
        doseMg = 8;
        doseMl = 4;
      }

      return {
        calculatedValue: `${doseMl}`,
        unit: 'mL',
        posologyText: `Dar ${doseMl} mL (equivalente a ${doseMg}mg) por via oral a cada 8 horas em caso de náuseas ou vômitos.`,
        instructions: 'Pode ser administrado antes das refeições ou quando a criança apresentar enjoo.',
        warning: undefined
      };
    }
  },

  // 13. Dimenidrinato + Piridoxina (Dramin B6 Gotas 25mg/mL)
  {
    id: 'ped-dramin-b6-gotas',
    name: 'Dimenidrinato + Piridoxina Gotas (Dramin B6)',
    genericName: 'Dimenidrinato + Cloridrato de Piridoxina',
    category: 'antiemetico',
    presentation: 'Frasco conta-gotas com 20mL (25mg/mL)',
    formType: 'gotas',
    concentration: '25mg/mL (1,25mg por gota)',
    route: 'Uso oral',
    frequency: 'A cada 8 horas se náuseas ou vômitos',
    minAgeMonths: 24,
    minWeightKg: 10,
    maxDosePerIntake: '40 gotas',
    calculationType: 'gotas_por_kg',
    calculateDose: (weight) => {
      const w = Math.max(1, weight);
      const drops = Math.min(Math.round(w * 1), 40);
      const warning = w < 10 ? 'Contraindicado em crianças menores de 2 anos.' : undefined;
      return {
        calculatedValue: `${drops}`,
        unit: 'gotas',
        posologyText: `Dar ${drops} gotas por via oral a cada 8 horas em caso de náuseas ou vômitos.`,
        instructions: 'Pode causar sonolência.',
        warning
      };
    }
  },

  // 14. Bromoprida Gotas 4mg/mL
  {
    id: 'ped-bromoprida-gotas',
    name: 'Bromoprida Gotas Pediátricas 4mg/mL',
    genericName: 'Bromoprida',
    category: 'antiemetico',
    presentation: 'Frasco conta-gotas 4mg/mL (20mL)',
    formType: 'gotas',
    concentration: '4mg/mL (0,16mg por gota)',
    route: 'Uso oral',
    frequency: 'A cada 8 horas antes das refeições',
    maxDosePerIntake: '50 gotas (10mg)',
    calculationType: 'gotas_por_kg',
    calculateDose: (weight) => {
      const w = Math.max(1, weight);
      // 0,8 a 1 gota/kg/dose de 8/8h
      const drops = Math.min(Math.round(w * 1), 40);
      return {
        calculatedValue: `${drops}`,
        unit: 'gotas',
        posologyText: `Dar ${drops} gotas por via oral de 8 em 8 horas, 15 a 30 minutos antes das refeições, se náuseas ou vômitos.`,
        instructions: 'Pingar diretamente na colher ou copo com água.',
        warning: undefined
      };
    }
  },

  // 15. Salbutamol Spray 100mcg/dose (Aerolin)
  {
    id: 'ped-salbutamol-spray',
    name: 'Salbutamol Spray 100mcg/dose (Aerolin)',
    genericName: 'Sulfato de Salbutamol',
    category: 'respiratorio',
    presentation: 'Aerossol dosimetrado 100mcg/dose (frasco 200 doses)',
    formType: 'spray_jatos',
    concentration: '100mcg por jato',
    route: 'Inalação oral com espaçador',
    frequency: 'A cada 4 ou 6 horas se tosse, falta de ar ou chiado no peito',
    maxDosePerIntake: '4 a 6 jatos por tomada na crise',
    calculationType: 'jatos_por_kg',
    calculateDose: (weight) => {
      const w = Math.max(1, weight);
      // 1 jato para cada 2 a 3 kg (usual: 2 a 4 jatos)
      let puffs = 2;
      if (w <= 10) puffs = 2;
      else if (w <= 20) puffs = 3;
      else puffs = 4;

      return {
        calculatedValue: `${puffs}`,
        unit: 'jatos (puffs)',
        posologyText: `Inalar ${puffs} jatos (puffs) através de espaçador valvulado com máscara facial a cada 4 ou 6 horas em caso de tosse persistente ou chiado no peito.`,
        instructions: 'Agitar bem o frasco antes de acoplar no espaçador. Administrar 1 jato por vez e aguardar 10 respirações da criança.',
        warning: undefined
      };
    }
  },

  // 16. Fenoterol Gotas 5mg/mL (Berotec para Nebulização)
  {
    id: 'ped-fenoterol-gotas',
    name: 'Fenoterol Gotas 5mg/mL (Berotec)',
    genericName: 'Bromidrato de Fenoterol',
    category: 'respiratorio',
    presentation: 'Frasco conta-gotas com 20mL (5mg/mL)',
    formType: 'gotas',
    concentration: '5mg/mL (0,25mg por gota)',
    route: 'Inalação / Micronebulização',
    frequency: 'A cada 4 a 6 horas em nebulização',
    maxDosePerIntake: '10 gotas por inalação',
    calculationType: 'gotas_por_kg',
    calculateDose: (weight) => {
      const w = Math.max(1, weight);
      // 1 gota para cada 3 kg de peso (mínimo 3 gotas, máximo 10 gotas)
      const raw = Math.round(w / 3);
      const drops = Math.max(3, Math.min(raw, 10));
      return {
        calculatedValue: `${drops}`,
        unit: 'gotas',
        posologyText: `Diluir ${drops} gotas em 3 a 5 mL de Soro Fisiológico 0,9% no copinho do micronebulizador e inalar a cada 4 a 6 horas se crise de broncoespasmo.`,
        instructions: 'Utilizar com fluxo de oxigênio ou ar comprimido a 4-6 L/min.',
        warning: undefined
      };
    }
  },

  // 17. Hidroxizina Xarope 10mg/5mL (2mg/mL)
  {
    id: 'ped-hidroxizina-xarope',
    name: 'Hidroxizina Xarope 10mg/5mL (Hixizine)',
    genericName: 'Cloridrato de Hidroxizina',
    category: 'antialergico',
    presentation: 'Frasco com 120mL com copo-medida (2mg/mL)',
    formType: 'xarope_ml',
    concentration: '10mg/5mL (2mg/mL)',
    route: 'Uso oral',
    frequency: 'A cada 8 horas por 5 a 7 dias',
    minWeightKg: 6,
    calculationType: 'ml_kg_dia_dividido',
    calculateDose: (weight) => {
      const w = Math.max(1, weight);
      // 1 a 2 mg/kg/dia = 0,5 a 1 mL/kg/dia dividido em 3 doses de 8/8h
      const mlPerDose = Math.min(parseFloat(( (w * 0.75) / 3 ).toFixed(1)), 10);
      const safeMl = Math.max(1, mlPerDose);
      return {
        calculatedValue: `${safeMl}`,
        unit: 'mL',
        posologyText: `Dar ${safeMl} mL por via oral de 8 em 8 horas se prurido (coceira) ou alergia na pele, por 5 a 7 dias.`,
        instructions: 'Pode causar sonolência.',
        warning: w < 6 ? 'Administrar com cautela em crianças com menos de 6 kg.' : undefined
      };
    }
  },

  // 18. Desloratadina Xarope 0,5mg/mL
  {
    id: 'ped-desloratadina-xarope',
    name: 'Desloratadina Xarope 0,5mg/mL',
    genericName: 'Desloratadina',
    category: 'antialergico',
    presentation: 'Frasco com 60mL com seringa dosadora',
    formType: 'xarope_ml',
    concentration: '0,5mg/mL',
    route: 'Uso oral',
    frequency: '1 vez ao dia à noite',
    minAgeMonths: 6,
    calculationType: 'idade_faixa',
    calculateDose: (_weight, ageYears = 3) => {
      let ml = 2.5;
      if (ageYears < 1) ml = 2.0; // 6-11 meses: 2mL (1mg)
      else if (ageYears <= 5) ml = 2.5; // 1-5 anos: 2,5mL (1,25mg)
      else if (ageYears <= 11) ml = 5.0; // 6-11 anos: 5mL (2,5mg)
      else ml = 10.0; // > 12 anos: 10mL (5mg)

      return {
        calculatedValue: `${ml}`,
        unit: 'mL',
        posologyText: `Dar ${ml} mL por via oral 1 vez ao dia à noite por 7 a 10 dias.`,
        instructions: 'Anti-histamínico de segunda geração (não sedante).',
        warning: undefined
      };
    }
  },

  // 19. Soro de Reidratação Oral (SRO)
  {
    id: 'ped-sro-hidratacao',
    name: 'Sais para Reidratação Oral (SRO)',
    genericName: 'Sais de Reidratação Oral',
    category: 'hidratacao',
    presentation: 'Envelope de pó para diluição em 1 litro de água',
    formType: 'sache',
    concentration: 'Solução balanceada de glicose e eletrólitos',
    route: 'Uso oral',
    frequency: 'Após cada evacuação diarreica ou episódio de vômito',
    calculationType: 'ml_kg_dose',
    calculateDose: (weight) => {
      const w = Math.max(1, weight);
      // 10 mL/kg por evacuação líquida
      const volumeMl = Math.round(w * 10);
      return {
        calculatedValue: `${volumeMl}`,
        unit: 'mL',
        posologyText: `Oferecer ${volumeMl} mL por via oral aos poucos (em colheradas ou pequenos goles) após cada episódio de vômito ou evacuação líquida.`,
        instructions: 'Diluir o conteúdo de 1 sachê em 1 litro de água tratada ou fervida. Manter em geladeira por no máximo 24 horas.',
        warning: undefined
      };
    }
  },

  // 20. Sulfato Ferroso Gotas (25mg/mL de Fe elementar)
  {
    id: 'ped-sulfato-ferroso-gotas',
    name: 'Sulfato Ferroso Gotas (25mg/mL Fe elementar)',
    genericName: 'Sulfato Ferroso',
    category: 'vitaminas',
    presentation: 'Frasco conta-gotas 30mL (1 gota = 1mg Fe elementar)',
    formType: 'gotas',
    concentration: '25mg/mL (1 gota = 1mg Fe)',
    route: 'Uso oral',
    frequency: '1 vez ao dia antes do almoço',
    calculationType: 'gotas_por_kg',
    calculateDose: (weight) => {
      const w = Math.max(1, weight);
      // Dose profilática: 1 gota/kg/dia
      const drops = Math.min(Math.round(w * 1), 30);
      return {
        calculatedValue: `${drops}`,
        unit: 'gotas',
        posologyText: `Dar ${drops} gotas por via oral 1 vez ao dia, preferencialmente 30 minutos antes do almoço acompanhado de suco de laranja ou fruta cítrica.`,
        instructions: 'Evitar dar junto com leite ou derivados de cálcio para não prejudicar a absorção.',
        warning: undefined
      };
    }
  }
];

export function findPediatricDrug(id: string): PediatricDrugRule | undefined {
  return PEDIATRIC_DRUG_RULES.find(d => d.id === id);
}

export function searchPediatricDrugs(query: string): PediatricDrugRule[] {
  const q = query.trim().toLowerCase();
  if (!q) return PEDIATRIC_DRUG_RULES;
  return PEDIATRIC_DRUG_RULES.filter(d => 
    d.name.toLowerCase().includes(q) ||
    d.genericName.toLowerCase().includes(q) ||
    d.category.toLowerCase().includes(q)
  );
}
