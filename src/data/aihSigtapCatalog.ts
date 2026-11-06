export interface CidCompativelAih {
  cid: string;
  descricao: string;
}

export interface ProcedimentoSigtapAih {
  categoria: string;
  codigo_sigtap: string;
  procedimento_sus: string;
  clinica: '01 - Cirúrgica' | '02 - Obstétrica' | '03 - Médica' | '04 - Pediátrica';
  media_permanencia_dias: number;
  cids_compativeis: CidCompativelAih[];
}

export const REGRAS_AIH = {
  versao_sigtap: '2026',
  bloqueio_cid_sintomatico: ['R509', 'R104', 'R074', 'R060', 'R51', 'R11', 'I469'],
  aviso_bloqueio:
    'Atenção: CIDs de sintomas isolados geram glosa na AIH. Selecione a hipótese diagnóstica etiológica ou vincule ao procedimento de observação/diagnóstico em urgência (03.01.01.017-0).'
};

export const CAUSA_EXTERNA_SUGESTOES: {
  cidPrefix: string[];
  sugestoes: { cid: string; descricao: string }[];
}[] = [
  {
    cidPrefix: ['T63.0', 'T630'],
    sugestoes: [
      { cid: 'X20.9', descricao: 'Contato com serpentes e lagartos venenosos (local não especificado)' },
      { cid: 'X20.0', descricao: 'Contato com serpentes e lagartos venenosos (residência)' },
      { cid: 'X20.7', descricao: 'Contato com serpentes e lagartos venenosos (fazenda/zona rural)' }
    ]
  },
  {
    cidPrefix: ['T63.2', 'T632'],
    sugestoes: [
      { cid: 'X22.9', descricao: 'Contato com escorpiões (local não especificado)' },
      { cid: 'X22.0', descricao: 'Contato com escorpiões (residência)' }
    ]
  },
  {
    cidPrefix: ['T63.3', 'T63.4', 'T633', 'T634'],
    sugestoes: [
      { cid: 'X21.9', descricao: 'Contato com aranhas venenosas' },
      { cid: 'X23.9', descricao: 'Contato com abelhas, vespas e marimbondos' },
      { cid: 'X25.9', descricao: 'Contato com outros artrópodes venenosos' }
    ]
  },
  {
    cidPrefix: ['T60', 'T60.0', 'T600'],
    sugestoes: [
      { cid: 'X48.9', descricao: 'Envenenamento acidental por pesticidas / organofosforados' },
      { cid: 'X68.9', descricao: 'Autointoxicação intencional por pesticidas / carbamatos (chumbinho)' },
      { cid: 'Y18.9', descricao: 'Envenenamento por pesticidas, intenção não determinada' }
    ]
  },
  {
    cidPrefix: ['T42', 'T42.4', 'T50', 'T50.9'],
    sugestoes: [
      { cid: 'X41.9', descricao: 'Envenenamento acidental por anticonvulsivantes / sedativos / benzodiazepínicos' },
      { cid: 'X61.9', descricao: 'Autointoxicação intencional por sedativos / psicotrópicos' },
      { cid: 'X44.9', descricao: 'Envenenamento acidental por outras drogas e medicamentos' },
      { cid: 'X64.9', descricao: 'Autointoxicação intencional por outras drogas e medicamentos' }
    ]
  }
];

export const CAUSA_EXTERNA_GERAL_SUGESTOES: { cid: string; descricao: string }[] = [
  { cid: 'X20.9', descricao: 'Acidente Ofídico (Serpente)' },
  { cid: 'X22.9', descricao: 'Acidente Escorpiônico (Escorpião)' },
  { cid: 'X48.9', descricao: 'Intoxicação Acidental por Pesticidas' },
  { cid: 'X68.9', descricao: 'Autointoxicação por Pesticidas (Chumbinho)' },
  { cid: 'X44.9', descricao: 'Intoxicação Medicamentosa Acidental' },
  { cid: 'W19.9', descricao: 'Queda sem especificação' },
  { cid: 'V89.2', descricao: 'Acidente de trânsito com veículo a motor' }
];

export const TEMPLATES_JUSTIFICATIVA_AIH = [
  {
    label: 'ATB Venoso + Suporte O2',
    texto:
      'Necessidade de antibioticoterapia bactericida por via endovenosa, suplementação contínua de oxigênio por cateter nasal, hidratação venosa e monitorização clínica seriada de sinais vitais.'
  },
  {
    label: 'Instabilidade / Risco de Sepse',
    texto:
      'Paciente com escore qSOFA/SOFA alterado, taquipneico e leucocitose com desvio à esquerda. Exige protocolo de sepse, coleta de culturas, antibiótico venoso de amplo espectro e controle de diurese/perfusão.'
  },
  {
    label: 'Monitorização Cardíaca / Neurológica',
    texto:
      'Necessidade de internação hospitalar para controle pressórico parenteral, monitorização eletrocardiográfica e vigilância neurológica contínua pelo risco de deterioração aguda.'
  },
  {
    label: 'Urgência Cirúrgica',
    texto:
      'Quadro de abdome agudo cirúrgico exigindo jejum absoluto, analgesia parenteral, antibioticoprofilaxia venosa e preparo pré-operatório para intervenção cirúrgica de urgência.'
  }
];

export const CATALOGO_PROCEDIMENTOS_AIH: ProcedimentoSigtapAih[] = [
  {
    categoria: 'Pneumologia e Vias Aéreas',
    codigo_sigtap: '03.03.14.015-1',
    procedimento_sus: 'TRATAMENTO DE PNEUMONIAS OU INFLUENZA (GRIPE)',
    clinica: '03 - Médica',
    media_permanencia_dias: 4,
    cids_compativeis: [
      { cid: 'J18.9', descricao: 'Pneumonia não especificada' },
      { cid: 'J18.0', descricao: 'Broncopneumonia não especificada' },
      { cid: 'J15.9', descricao: 'Pneumonia bacteriana não especificada' },
      { cid: 'J15.8', descricao: 'Outras pneumonias bacterianas' },
      { cid: 'J12.9', descricao: 'Pneumonia viral não especificada' },
      { cid: 'J11.0', descricao: 'Influenza (gripe) com pneumonia, vírus não identificado' }
    ]
  },
  {
    categoria: 'Pneumologia e Vias Aéreas',
    codigo_sigtap: '03.03.14.004-6',
    procedimento_sus: 'TRATAMENTO DE DOENCA PULMONAR OBSTRUTIVA CRONICA (DPOC)',
    clinica: '03 - Médica',
    media_permanencia_dias: 5,
    cids_compativeis: [
      { cid: 'J44.0', descricao: 'DPOC com infecção respiratória aguda do trato respiratório inferior' },
      { cid: 'J44.1', descricao: 'DPOC com exacerbação aguda não especificada' },
      { cid: 'J44.9', descricao: 'Doença pulmonar obstrutiva crônica não especificada' },
      { cid: 'J43.9', descricao: 'Enfisema não especificado' }
    ]
  },
  {
    categoria: 'Pneumologia e Vias Aéreas',
    codigo_sigtap: '03.03.14.002-0',
    procedimento_sus: 'TRATAMENTO DE ASMA',
    clinica: '03 - Médica',
    media_permanencia_dias: 3,
    cids_compativeis: [
      { cid: 'J45.9', descricao: 'Asma não especificada (Crise asmática)' },
      { cid: 'J45.0', descricao: 'Asma predominantemente alérgica' },
      { cid: 'J46', descricao: 'Estado de mal asmático (Asma grave aguda)' }
    ]
  },
  {
    categoria: 'Pneumologia e Vias Aéreas',
    codigo_sigtap: '03.03.14.003-8',
    procedimento_sus: 'TRATAMENTO DE BRONQUIOLITE AGUDA / BRONQUITE AGUDA',
    clinica: '03 - Médica',
    media_permanencia_dias: 3,
    cids_compativeis: [
      { cid: 'J21.0', descricao: 'Bronquiolite aguda devida a vírus sincicial respiratório (VSR)' },
      { cid: 'J21.9', descricao: 'Bronquiolite aguda não especificada' },
      { cid: 'J20.9', descricao: 'Bronquite aguda não especificada' }
    ]
  },
  {
    categoria: 'Cardiologia e Vascular',
    codigo_sigtap: '03.03.06.021-2',
    procedimento_sus: 'TRATAMENTO DE INSUFICIENCIA CARDIACA',
    clinica: '03 - Médica',
    media_permanencia_dias: 5,
    cids_compativeis: [
      { cid: 'I50.0', descricao: 'Insuficiência cardíaca congestiva (ICC)' },
      { cid: 'I50.1', descricao: 'Insuficiência ventricular esquerda (Edema agudo de pulmão cardiogênico)' },
      { cid: 'I50.9', descricao: 'Insuficiência cardíaca não especificada' },
      { cid: 'I11.0', descricao: 'Doença cardíaca hipertensiva com insuficiência cardíaca' }
    ]
  },
  {
    categoria: 'Cardiologia e Vascular',
    codigo_sigtap: '03.03.06.010-7',
    procedimento_sus: 'TRATAMENTO DE CRISE HIPERTENSIVA',
    clinica: '03 - Médica',
    media_permanencia_dias: 2,
    cids_compativeis: [
      { cid: 'I10', descricao: 'Hipertensão essencial (primária) em urgência/emergência' },
      { cid: 'I11.9', descricao: 'Doença cardíaca hipertensiva sem insuficiência cardíaca' },
      { cid: 'I67.4', descricao: 'Encefalopatia hipertensiva' },
      { cid: 'I15.9', descricao: 'Hipertensão secundária não especificada' }
    ]
  },
  {
    categoria: 'Cardiologia e Vascular',
    codigo_sigtap: '03.03.06.028-0',
    procedimento_sus: 'TRATAMENTO DE SINDROME CORONARIANA AGUDA',
    clinica: '03 - Médica',
    media_permanencia_dias: 4,
    cids_compativeis: [
      { cid: 'I20.0', descricao: 'Angina instável' },
      { cid: 'I20.9', descricao: 'Angina pectoris não especificada' },
      { cid: 'I24.9', descricao: 'Doença isquêmica aguda do coração não especificada' }
    ]
  },
  {
    categoria: 'Cardiologia e Vascular',
    codigo_sigtap: '03.03.06.019-0',
    procedimento_sus: 'TRATAMENTO DE INFARTO AGUDO DO MIOCARDIO',
    clinica: '03 - Médica',
    media_permanencia_dias: 6,
    cids_compativeis: [
      { cid: 'I21.0', descricao: 'Infarto agudo transmural da parede anterior do miocárdio' },
      { cid: 'I21.1', descricao: 'Infarto agudo transmural da parede inferior do miocárdio' },
      { cid: 'I21.4', descricao: 'Infarto agudo subendocárdico do miocárdio (IAMSSST)' },
      { cid: 'I21.9', descricao: 'Infarto agudo do miocárdio não especificado' }
    ]
  },
  {
    categoria: 'Cardiologia e Vascular',
    codigo_sigtap: '03.03.06.002-6',
    procedimento_sus: 'TRATAMENTO DE ARRITMIAS CARDIACAS',
    clinica: '03 - Médica',
    media_permanencia_dias: 3,
    cids_compativeis: [
      { cid: 'I48', descricao: 'Flutter e fibrilação atrial' },
      { cid: 'I47.1', descricao: 'Taquicardia supraventricular' },
      { cid: 'I47.2', descricao: 'Taquicardia ventricular' },
      { cid: 'I44.2', descricao: 'Bloqueio atrioventricular total (BAVT)' },
      { cid: 'I49.9', descricao: 'Arritmia cardíaca não especificada' }
    ]
  },
  {
    categoria: 'Cardiologia e Vascular',
    codigo_sigtap: '03.03.06.029-8',
    procedimento_sus: 'TRATAMENTO DE TROMBOSE VENOSA PROFUNDA / EMBOLIA PULMONAR',
    clinica: '03 - Médica',
    media_permanencia_dias: 5,
    cids_compativeis: [
      { cid: 'I80.2', descricao: 'Flebite e tromboflebite de outros vasos profundos dos membros inferiores (TVP)' },
      { cid: 'I80.3', descricao: 'Flebite e tromboflebite dos membros inferiores, não especificada' },
      { cid: 'I26.9', descricao: 'Embolia pulmonar sem menção de cor pulmonale agudo (TEP)' }
    ]
  },
  {
    categoria: 'Neurologia',
    codigo_sigtap: '03.03.04.014-9',
    procedimento_sus: 'TRATAMENTO DE ACIDENTE VASCULAR CEREBRAL (AVC ISQUEMICO OU HEMORRAGICO AGUDO)',
    clinica: '03 - Médica',
    media_permanencia_dias: 6,
    cids_compativeis: [
      { cid: 'I64', descricao: 'Acidente vascular cerebral, não especificado como hemorrágico ou isquêmico' },
      { cid: 'I63.9', descricao: 'Infarto cerebral não especificado (AVC Isquêmico)' },
      { cid: 'I61.9', descricao: 'Hemorragia intracerebral não especificada (AVC Hemorrágico)' },
      { cid: 'G45.9', descricao: 'Isquemia cerebral transitória não especificada (AIT)' }
    ]
  },
  {
    categoria: 'Neurologia',
    codigo_sigtap: '03.03.04.016-5',
    procedimento_sus: 'TRATAMENTO DE EPILEPSIA / CRISES CONVULSIVAS',
    clinica: '03 - Médica',
    media_permanencia_dias: 3,
    cids_compativeis: [
      { cid: 'G40.9', descricao: 'Epilepsia, não especificada' },
      { cid: 'G40.3', descricao: 'Epilepsia e síndromes epilépticas generalizadas idiopáticas' },
      { cid: 'G41.0', descricao: 'Estado de mal epiléptico grande mal (tônico-clônico)' },
      { cid: 'G41.9', descricao: 'Estado de mal epiléptico, não especificado' }
    ]
  },
  {
    categoria: 'Infectologia e Sepse',
    codigo_sigtap: '03.03.01.006-1',
    procedimento_sus: 'TRATAMENTO DE OUTRAS DOENCAS BACTERIANAS (SEPSE / ERISIPELA)',
    clinica: '03 - Médica',
    media_permanencia_dias: 6,
    cids_compativeis: [
      { cid: 'A41.9', descricao: 'Septicemia não especificada (Sepse / Choque Séptico)' },
      { cid: 'A41.5', descricao: 'Septicemia por outros microorganismos gram-negativos' },
      { cid: 'A41.0', descricao: 'Septicemia por Staphylococcus aureus' },
      { cid: 'A46', descricao: 'Erisipela' },
      { cid: 'A49.9', descricao: 'Infecção bacteriana não especificada' }
    ]
  },
  {
    categoria: 'Infectologia e Sepse',
    codigo_sigtap: '03.03.01.003-7',
    procedimento_sus: 'TRATAMENTO DE DOENCAS INFECCIOSAS INTESTINAIS (GECA)',
    clinica: '03 - Médica',
    media_permanencia_dias: 2,
    cids_compativeis: [
      { cid: 'A09', descricao: 'Diarreia e gastroenterite de origem infecciosa presumível' },
      { cid: 'A08.4', descricao: 'Infecção intestinal viral, não especificada' },
      { cid: 'A04.9', descricao: 'Infecção intestinal bacteriana não especificada' },
      { cid: 'A06.0', descricao: 'Disenteria amebiana aguda' }
    ]
  },
  {
    categoria: 'Infectologia e Sepse',
    codigo_sigtap: '03.03.01.001-0',
    procedimento_sus: 'TRATAMENTO DE DENGUE CLASSICO / COM SINAIS DE ALARME',
    clinica: '03 - Médica',
    media_permanencia_dias: 3,
    cids_compativeis: [
      { cid: 'A90', descricao: 'Dengue (dengue clássico)' },
      { cid: 'A97.0', descricao: 'Dengue sem sinais de alarme' },
      { cid: 'A97.1', descricao: 'Dengue com sinais de alarme' }
    ]
  },
  {
    categoria: 'Infectologia e Sepse',
    codigo_sigtap: '03.03.01.002-9',
    procedimento_sus: 'TRATAMENTO DE FEBRE HEMORRAGICA DO DENGUE / DENGUE GRAVE',
    clinica: '03 - Médica',
    media_permanencia_dias: 5,
    cids_compativeis: [
      { cid: 'A91', descricao: 'Febre hemorrágica devida ao vírus do dengue' },
      { cid: 'A97.2', descricao: 'Dengue grave' }
    ]
  },
  {
    categoria: 'Infectologia e Sepse',
    codigo_sigtap: '03.03.01.021-5',
    procedimento_sus: 'TRATAMENTO DE TUBERCULOSE',
    clinica: '03 - Médica',
    media_permanencia_dias: 8,
    cids_compativeis: [
      { cid: 'A15.0', descricao: 'Tuberculose pulmonar, com confirmação por exame microscópico da expectoração (BAAR+)' },
      { cid: 'A15.3', descricao: 'Tuberculose pulmonar, com confirmação por meio não especificado' },
      { cid: 'A16.2', descricao: 'Tuberculose pulmonar, sem menção de confirmação bacteriológica ou histológica' },
      { cid: 'A19.9', descricao: 'Tuberculose miliar não especificada' }
    ]
  },
  {
    categoria: 'Infectologia e Sepse',
    codigo_sigtap: '03.03.01.013-4',
    procedimento_sus: 'TRATAMENTO DE MALARIA',
    clinica: '03 - Médica',
    media_permanencia_dias: 4,
    cids_compativeis: [
      { cid: 'B50.9', descricao: 'Malária por Plasmodium falciparum, não especificada' },
      { cid: 'B50.0', descricao: 'Malária por Plasmodium falciparum com complicações cerebrais' },
      { cid: 'B51.9', descricao: 'Malária por Plasmodium vivax sem complicações' },
      { cid: 'B54', descricao: 'Malária não especificada' }
    ]
  },
  {
    categoria: 'Pele e Partes Moles',
    codigo_sigtap: '03.03.08.009-4',
    procedimento_sus: 'TRATAMENTO DE OUTRAS AFECCOES DA PELE E DO TECIDO SUBCUTANEO (CELULITE / ABSCESSO)',
    clinica: '03 - Médica',
    media_permanencia_dias: 4,
    cids_compativeis: [
      { cid: 'L03.9', descricao: 'Celulite não especificada' },
      { cid: 'L03.1', descricao: 'Celulite de outras partes dos membros (MMII / MMSS)' },
      { cid: 'L02.9', descricao: 'Abscesso cutâneo, furúnculo e antraz não especificados' },
      { cid: 'L02.4', descricao: 'Abscesso cutâneo, furúnculo e antraz do(s) membro(s)' },
      { cid: 'L08.9', descricao: 'Infecção localizada da pele e do tecido subcutâneo, não especificada' },
      { cid: 'L97', descricao: 'Úlcera dos membros inferiores (Pé diabético / Úlcera infectada)' }
    ]
  },
  {
    categoria: 'Nefrologia e Urologia',
    codigo_sigtap: '03.03.15.005-0',
    procedimento_sus: 'TRATAMENTO DE PIELONEFRITE / ITU ALTA',
    clinica: '03 - Médica',
    media_permanencia_dias: 4,
    cids_compativeis: [
      { cid: 'N10', descricao: 'Nefrite túbulo-intersticial aguda (Pielonefrite aguda)' },
      { cid: 'N12', descricao: 'Nefrite túbulo-intersticial não especificada como aguda ou crônica' },
      { cid: 'N11.9', descricao: 'Nefrite túbulo-intersticial crônica não especificada' },
      { cid: 'N39.0', descricao: 'Infecção do trato urinário de localização não especificada' }
    ]
  },
  {
    categoria: 'Nefrologia e Urologia',
    codigo_sigtap: '03.03.15.002-5',
    procedimento_sus: 'TRATAMENTO DE INSUFICIENCIA RENAL AGUDA',
    clinica: '03 - Médica',
    media_permanencia_dias: 5,
    cids_compativeis: [
      { cid: 'N17.9', descricao: 'Insuficiência renal aguda não especificada (IRA)' },
      { cid: 'N17.0', descricao: 'Insuficiência renal aguda com necrose tubular' },
      { cid: 'N19', descricao: 'Insuficiência renal não especificada' }
    ]
  },
  {
    categoria: 'Nefrologia e Urologia',
    codigo_sigtap: '03.03.15.003-3',
    procedimento_sus: 'TRATAMENTO DE CALCULOSE URINARIA (COLICA NEFRETICA)',
    clinica: '03 - Médica',
    media_permanencia_dias: 2,
    cids_compativeis: [
      { cid: 'N20.0', descricao: 'Cálculo do rim (Nefrolitíase)' },
      { cid: 'N20.1', descricao: 'Cálculo do ureter (Ureterolitíase)' },
      { cid: 'N20.9', descricao: 'Calculose urinária, não especificada' },
      { cid: 'N23', descricao: 'Cólica nefrética não especificada' }
    ]
  },
  {
    categoria: 'Gastroenterologia e Hepatologia',
    codigo_sigtap: '03.03.07.012-9',
    procedimento_sus: 'TRATAMENTO DE DOENCAS DO ESOFAGO, ESTOMAGO E DUODENO (HDA / ULCERA / GASTRITE)',
    clinica: '03 - Médica',
    media_permanencia_dias: 3,
    cids_compativeis: [
      { cid: 'K92.0', descricao: 'Hematêmese (HDA)' },
      { cid: 'K92.1', descricao: 'Melena' },
      { cid: 'K92.2', descricao: 'Hemorragia gastrointestinal, sem outra especificação' },
      { cid: 'K25.0', descricao: 'Úlcera gástrica aguda com hemorragia' },
      { cid: 'K26.0', descricao: 'Úlcera duodenal aguda com hemorragia' },
      { cid: 'K29.0', descricao: 'Gastrite hemorrágica aguda' },
      { cid: 'K29.1', descricao: 'Outras gastrites agudas' }
    ]
  },
  {
    categoria: 'Gastroenterologia e Hepatologia',
    codigo_sigtap: '03.03.07.011-0',
    procedimento_sus: 'TRATAMENTO DE DOENCAS DO FIGADO, VIAS BILIARES E PANCREAS',
    clinica: '03 - Médica',
    media_permanencia_dias: 5,
    cids_compativeis: [
      { cid: 'K85.9', descricao: 'Pancreatite aguda, sem outra especificação' },
      { cid: 'K85.1', descricao: 'Pancreatite biliar aguda' },
      { cid: 'K81.0', descricao: 'Colecistite aguda' },
      { cid: 'K80.0', descricao: 'Calculose da vesícula biliar com colecistite aguda' },
      { cid: 'K83.0', descricao: 'Colangite' },
      { cid: 'K74.6', descricao: 'Outras formas de cirrose hepática e as não especificadas' },
      { cid: 'K72.9', descricao: 'Insuficiência hepática, sem outra especificação (Encefalopatia)' },
      { cid: 'K70.3', descricao: 'Cirrose hepática alcoólica' }
    ]
  },
  {
    categoria: 'Endocrinologia, Nutrição e Hematologia',
    codigo_sigtap: '03.03.03.003-8',
    procedimento_sus: 'TRATAMENTO DE DIABETES MELLITUS',
    clinica: '03 - Médica',
    media_permanencia_dias: 4,
    cids_compativeis: [
      { cid: 'E10.1', descricao: 'Diabetes mellitus insulino-dependente - com cetoacidose (CAD)' },
      { cid: 'E11.0', descricao: 'Diabetes mellitus não-insulino-dependente - com coma (Estado Hiperosmolar)' },
      { cid: 'E11.1', descricao: 'Diabetes mellitus não-insulino-dependente - com cetoacidose' },
      { cid: 'E10.9', descricao: 'Diabetes mellitus tipo 1 descompensado sem complicações especificadas' },
      { cid: 'E11.9', descricao: 'Diabetes mellitus tipo 2 descompensado sem complicações especificadas' },
      { cid: 'E14.1', descricao: 'Diabetes mellitus não especificado - com cetoacidose' }
    ]
  },
  {
    categoria: 'Endocrinologia, Nutrição e Hematologia',
    codigo_sigtap: '03.03.03.004-6',
    procedimento_sus: 'TRATAMENTO DE DISTURBIOS METABOLICOS E HIDROELETROLITICOS',
    clinica: '03 - Médica',
    media_permanencia_dias: 3,
    cids_compativeis: [
      { cid: 'E86', descricao: 'Depleção de volume (Desidratação / Hipovolemia)' },
      { cid: 'E87.0', descricao: 'Hiperosmolaridade e hipernatremia' },
      { cid: 'E87.1', descricao: 'Hiposmolaridade e hiponatremia' },
      { cid: 'E87.2', descricao: 'Acidose metabólica' },
      { cid: 'E87.5', descricao: 'Hipercalemia (Hiperpotassemia)' },
      { cid: 'E87.6', descricao: 'Hipocalemia (Hipopotassemia)' }
    ]
  },
  {
    categoria: 'Endocrinologia, Nutrição e Hematologia',
    codigo_sigtap: '03.03.02.005-9',
    procedimento_sus: 'TRATAMENTO DE ANEMIAS',
    clinica: '03 - Médica',
    media_permanencia_dias: 3,
    cids_compativeis: [
      { cid: 'D50.9', descricao: 'Anemia por deficiência de ferro não especificada' },
      { cid: 'D50.0', descricao: 'Anemia por deficiência de ferro secundária a perda de sangue (crônica)' },
      { cid: 'D64.9', descricao: 'Anemia não especificada' },
      { cid: 'D62', descricao: 'Anemia aguda pós-hemorrágica' }
    ]
  },
  {
    categoria: 'Toxicologia e Causas Externas',
    codigo_sigtap: '03.08.02.003-2',
    procedimento_sus: 'TRATAMENTO DE INTOXICACAO OU ENVENENAMENTO (MEDICAMENTOS / ANIMAIS PECONHENTOS)',
    clinica: '03 - Médica',
    media_permanencia_dias: 2,
    cids_compativeis: [
      { cid: 'T63.0', descricao: 'Efeito tóxico do veneno de serpente (Acidente Ofídico / Bothrops / Lachesis)' },
      { cid: 'T63.2', descricao: 'Efeito tóxico do veneno de escorpião (Acidente Escorpiônico)' },
      { cid: 'T63.4', descricao: 'Efeito tóxico do veneno de outros artrópodes' },
      { cid: 'T60.0', descricao: 'Efeito tóxico de inseticidas organofosforados e carbamatos (Chumbinho)' },
      { cid: 'T50.9', descricao: 'Efeito tóxico de outras drogas, medicamentos e substâncias biológicas' },
      { cid: 'T42.4', descricao: 'Intoxicação por benzodiazepínicos' }
    ]
  },
  {
    categoria: 'Cirurgia Geral (Grupo 04)',
    codigo_sigtap: '04.07.02.003-9',
    procedimento_sus: 'APENDICECTOMIA',
    clinica: '01 - Cirúrgica',
    media_permanencia_dias: 2,
    cids_compativeis: [
      { cid: 'K35.9', descricao: 'Apendicite aguda, sem outra especificação' },
      { cid: 'K35.0', descricao: 'Apendicite aguda com peritonite generalizada' },
      { cid: 'K35.1', descricao: 'Apendicite aguda com abscesso peritoneal' }
    ]
  },
  {
    categoria: 'Cirurgia Geral (Grupo 04)',
    codigo_sigtap: '04.07.03.002-6',
    procedimento_sus: 'COLECISTECTOMIA',
    clinica: '01 - Cirúrgica',
    media_permanencia_dias: 2,
    cids_compativeis: [
      { cid: 'K80.0', descricao: 'Calculose da vesícula biliar com colecistite aguda' },
      { cid: 'K80.2', descricao: 'Calculose da vesícula biliar sem colecistite (Colelitíase)' },
      { cid: 'K81.0', descricao: 'Colecistite aguda' }
    ]
  },
  {
    categoria: 'Cirurgia Geral (Grupo 04)',
    codigo_sigtap: '04.07.04.010-2',
    procedimento_sus: 'HERNIOPLASTIA INGUINAL / CRURAL (UNILATERAL)',
    clinica: '01 - Cirúrgica',
    media_permanencia_dias: 1,
    cids_compativeis: [
      { cid: 'K40.9', descricao: 'Hérnia inguinal unilateral ou não especificada, sem obstrução ou gangrena' },
      { cid: 'K40.3', descricao: 'Hérnia inguinal unilateral ou não especificada, com obstrução, sem gangrena (Encarcerada)' }
    ]
  },
  {
    categoria: 'Cirurgia Geral (Grupo 04)',
    codigo_sigtap: '04.01.01.002-3',
    procedimento_sus: 'DRENAGEM DE ABSCESSO DA PELE E TECIDO SUBCUTANEO',
    clinica: '01 - Cirúrgica',
    media_permanencia_dias: 2,
    cids_compativeis: [
      { cid: 'L02.9', descricao: 'Abscesso cutâneo, furúnculo e antraz não especificados' },
      { cid: 'L02.2', descricao: 'Abscesso cutâneo, furúnculo e antraz do tronco' },
      { cid: 'L02.4', descricao: 'Abscesso cutâneo, furúnculo e antraz do(s) membro(s)' }
    ]
  },
  {
    categoria: 'Obstetrícia (Grupo 03 e 04)',
    codigo_sigtap: '04.11.01.003-4',
    procedimento_sus: 'PARTO NORMAL',
    clinica: '02 - Obstétrica',
    media_permanencia_dias: 2,
    cids_compativeis: [
      { cid: 'O80.0', descricao: 'Parto espontâneo cefálico' },
      { cid: 'O80.9', descricao: 'Parto único espontâneo, não especificado' }
    ]
  },
  {
    categoria: 'Obstetrícia (Grupo 03 e 04)',
    codigo_sigtap: '04.11.01.002-6',
    procedimento_sus: 'PARTO CESARIANO',
    clinica: '02 - Obstétrica',
    media_permanencia_dias: 2,
    cids_compativeis: [
      { cid: 'O82.0', descricao: 'Parto por cesariana eletiva' },
      { cid: 'O82.1', descricao: 'Parto por cesariana de emergência' },
      { cid: 'O82.9', descricao: 'Parto por cesariana, não especificada' }
    ]
  },
  {
    categoria: 'Obstetrícia (Grupo 03 e 04)',
    codigo_sigtap: '04.09.06.007-0',
    procedimento_sus: 'CURETAGEM POS-ABORTAMENTO / PUERPERAL',
    clinica: '02 - Obstétrica',
    media_permanencia_dias: 1,
    cids_compativeis: [
      { cid: 'O03.4', descricao: 'Aborto espontâneo - incompleto, sem complicações' },
      { cid: 'O06.4', descricao: 'Aborto não especificado - incompleto, sem complicações' },
      { cid: 'O02.1', descricao: 'Aborto retido' }
    ]
  },
  {
    categoria: 'Obstetrícia (Grupo 03 e 04)',
    codigo_sigtap: '03.03.10.004-4',
    procedimento_sus: 'TRATAMENTO DE INTERCORRENCIAS CLINICAS NA GRAVIDEZ',
    clinica: '02 - Obstétrica',
    media_permanencia_dias: 3,
    cids_compativeis: [
      { cid: 'O23.4', descricao: 'Infecção não especificada do trato urinário na gravidez' },
      { cid: 'O21.0', descricao: 'Hiperêmese gravídica leve' },
      { cid: 'O14.9', descricao: 'Pré-eclâmpsia não especificada' },
      { cid: 'O24.4', descricao: 'Diabetes mellitus que surge durante a gravidez' }
    ]
  }
];

export const PROCEDIMENTO_OBSERVACAO_URGENCIA: ProcedimentoSigtapAih = {
  categoria: 'Observação / Diagnóstico em Urgência',
  codigo_sigtap: '03.01.01.017-0',
  procedimento_sus: 'ATENDIMENTO DE URGENCIA C/ OBSERVACAO ATE 24 HORAS EM ATENCAO ESPECIALIZADA',
  clinica: '03 - Médica',
  media_permanencia_dias: 1,
  cids_compativeis: []
};

export function findProcedimentoByCid(cidInput: string): {
  procedimento: ProcedimentoSigtapAih;
  cidMatch: CidCompativelAih;
} | null {
  const clean = cidInput.toUpperCase().trim().replace(/\./g, '');
  if (!clean) return null;

  for (const proc of CATALOGO_PROCEDIMENTOS_AIH) {
    const match = proc.cids_compativeis.find(
      c => c.cid.toUpperCase().replace(/\./g, '') === clean
    );
    if (match) {
      return { procedimento: proc, cidMatch: match };
    }
  }
  return null;
}

export function findProcedimentoByCodigo(codigoInput: string): ProcedimentoSigtapAih | null {
  const clean = codigoInput.replace(/\D/g, '');
  if (!clean) return null;
  if (clean === '0301010170') return PROCEDIMENTO_OBSERVACAO_URGENCIA;
  return (
    CATALOGO_PROCEDIMENTOS_AIH.find(p => p.codigo_sigtap.replace(/\D/g, '') === clean) || null
  );
}

export function isCidSintomaticoBloqueado(cidInput: string): boolean {
  const clean = cidInput.toUpperCase().trim().replace(/\./g, '');
  if (!clean) return false;
  if (clean.startsWith('R') || clean === 'I469') return true;
  return REGRAS_AIH.bloqueio_cid_sintomatico.includes(clean);
}

export function isCidCausaExternaObrigatoria(cidInput: string): boolean {
  const clean = cidInput.toUpperCase().trim();
  if (!clean) return false;
  return clean.startsWith('S') || clean.startsWith('T');
}

export function getSugestoesCausaExterna(cidInput: string): { cid: string; descricao: string }[] {
  const clean = cidInput.toUpperCase().trim();
  for (const group of CAUSA_EXTERNA_SUGESTOES) {
    if (group.cidPrefix.some(prefix => clean.startsWith(prefix))) {
      return group.sugestoes;
    }
  }
  return CAUSA_EXTERNA_GERAL_SUGESTOES;
}
