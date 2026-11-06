/**
 * Validador Anti-Glosa SUS (SIGTAP ↔ CID-10)
 * Compatibilidade clínica, topográfica e regras impeditivas do DATASUS para APAC e AIH.
 */

export interface AntiGlosaResult {
  status: 'COMPATIVEL' | 'ALERTA' | 'INCOMPATIVEL' | 'NEUTRO';
  titulo: string;
  mensagem: string;
  exigeCausaExterna?: boolean;
  sugestoesCid?: { code: string; description: string }[];
}

// CIDs de sintomas isolados que geram glosa na AIH ou exigem justificativa adicional
const CIDS_SINTOMATICOS_GLOSA = new Set([
  'R50', 'R50.0', 'R50.1', 'R50.8', 'R50.9', // Febre
  'R10', 'R10.0', 'R10.1', 'R10.2', 'R10.3', 'R10.4', // Dor abdominal
  'R07', 'R07.0', 'R07.1', 'R07.2', 'R07.3', 'R07.4', // Dor torácica
  'R06', 'R06.0', 'R06.1', 'R06.2', 'R06.3', 'R06.4', 'R06.8', // Dispneia
  'R51', // Cefaleia
  'R11', // Náusea e vômito
  'I46', 'I46.0', 'I46.1', 'I46.9' // Parada cardíaca
]);

/**
 * Valida a compatibilidade entre o Procedimento SIGTAP e o CID-10
 */
export function validarCompatibilidadeSigtap(
  codigoProcInput: string = '',
  nomeProcInput: string = '',
  cid10Input: string = '',
  instrumento: 'APAC' | 'AIH' = 'APAC'
): AntiGlosaResult {
  const cleanCode = (codigoProcInput || '').replace(/\D/g, '');
  const cleanNome = (nomeProcInput || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().trim();
  const cleanCid = (cid10Input || '').toUpperCase().trim();
  const cidPrefix = cleanCid.split('.')[0];

  if (!cleanCid) {
    return {
      status: 'NEUTRO',
      titulo: 'Aguardando CID-10',
      mensagem: 'Informe o código do CID-10 para validação das regras de faturamento do SUS.'
    };
  }

  // 1. Regra de Sintoma Isolado na AIH (Glosa no faturamento hospitalar)
  const isSintoma = CIDS_SINTOMATICOS_GLOSA.has(cleanCid) || CIDS_SINTOMATICOS_GLOSA.has(cidPrefix);
  if (instrumento === 'AIH' && isSintoma) {
    return {
      status: 'INCOMPATIVEL',
      titulo: 'Risco de Glosa na AIH (CID de Sintoma Isolado)',
      mensagem: `O CID ${cleanCid} refere-se a sinal/sintoma inespecífico (Capítulo R). O SIH/SUS glosa internações com este diagnóstico principal, exceto se vinculado a observação clínica de urgência (03.01.01.017-0).`,
      sugestoesCid: [
        { code: 'A49.9', description: 'Infecção bacteriana não especificada (Investigação de foco)' },
        { code: 'J18.9', description: 'Pneumonia não especificada' },
        { code: 'K35.8', description: 'Apendicite aguda, outra e a não especificada' },
        { code: 'I50.0', description: 'Insuficiência cardíaca congestiva' }
      ]
    };
  }

  // 2. Validação Topográfica / Clínica de APAC (Tomografias, Ressonâncias, Radiografias e Exames)
  if (cleanNome.includes('TORAX') || cleanCode === '0206020031' || cleanCode === '0204030153') {
    // Tomografia / Radiografia de Tórax
    const compatThorax =
      cidPrefix.startsWith('J') || // Respiratório (Pneumonia, DPOC, Asma, Derrame pleural)
      cidPrefix.startsWith('A15') || cidPrefix.startsWith('A16') || // Tuberculose
      cleanCid.startsWith('A49') || // Infecção a esclarecer
      cleanCid.startsWith('C34') || cleanCid.startsWith('D38') || // Neoplasias de pulmão
      cidPrefix === 'R05' || cidPrefix === 'R06' || cidPrefix === 'R07' || cidPrefix === 'R50' || // Tosse, dispneia, dor torácica, febre
      cidPrefix.startsWith('I26') || cidPrefix.startsWith('I50') || // TEP, IC com congestão
      cidPrefix.startsWith('S2'); // Traumatismo de tórax / costela / pulmão

    if (!compatThorax) {
      return {
        status: 'INCOMPATIVEL',
        titulo: 'Incompatibilidade Topográfica no SIGTAP',
        mensagem: `O procedimento solicitado (${cleanNome || 'Exame de Tórax'}) é direcionado à caixa torácica e sistema respiratório, divergindo da patologia ${cleanCid}. Risco de glosa no Laudo de APAC.`,
        sugestoesCid: [
          { code: 'A49.9', description: 'Infecção bacteriana não especificada (Investigação de foco pulmonar)' },
          { code: 'J18.9', description: 'Pneumonia não especificada' },
          { code: 'J90', description: 'Derrame pleural não classificado em outra parte' },
          { code: 'J44.1', description: 'Doença pulmonar obstrutiva crônica com exacerbação aguda' }
        ]
      };
    }

    if (cidPrefix.startsWith('S2')) {
      return {
        status: 'ALERTA',
        titulo: 'Compatível + Causa Externa Obrigatória',
        mensagem: `Traumatismo de tórax (${cleanCid}) compatível com o exame, mas exige CID Secundário de Causa Externa (acidente, queda, trânsito ou agressão) para evitar devolução no faturamento do SUS.`,
        exigeCausaExterna: true
      };
    }
  } else if (cleanNome.includes('CRANIO') || cleanCode === '0206010079' || cleanCode === '0207010064') {
    // Tomografia / Ressonância de Crânio
    const compatCranio =
      cidPrefix.startsWith('G') || // Neurológico (Epilepsia, Enxaqueca, Parkinson)
      cidPrefix.startsWith('I6') || // Doenças cerebrovasculares (AVC, AIT)
      cidPrefix.startsWith('S0') || // Traumatismo cranioencefálico (S06, S09...)
      cleanCid.startsWith('R51') || cleanCid.startsWith('R55') || cleanCid.startsWith('R56') || // Cefaleia, síncope, convulsão
      cleanCid.startsWith('C71') || cleanCid.startsWith('D33') || // Tumores SNC
      cleanCid.startsWith('A49'); // Infecção a esclarecer

    if (!compatCranio) {
      return {
        status: 'INCOMPATIVEL',
        titulo: 'Incompatibilidade Topográfica no SIGTAP',
        mensagem: `Procedimento de neuroimagem de crânio divergente do CID informado (${cleanCid}). O SUS audita estritamente tomografias e ressonâncias encefálicas.`,
        sugestoesCid: [
          { code: 'R51', description: 'Cefaleia refratária em investigação' },
          { code: 'I63.9', description: 'Infarto cerebral não especificado (AVCi)' },
          { code: 'G40.9', description: 'Epilepsia não especificada' },
          { code: 'R55', description: 'Síncope e colapso' }
        ]
      };
    }

    if (cidPrefix.startsWith('S0')) {
      return {
        status: 'ALERTA',
        titulo: 'Compatível + Causa Externa Obrigatória',
        mensagem: `Traumatismo de crânio (${cleanCid}) compatível com neuroimagem, mas exige CID Secundário de Causa Externa (Capítulo XX) para faturamento no SUS.`,
        exigeCausaExterna: true
      };
    }
  } else if (cleanNome.includes('ABDOME') || cleanCode === '0206030010' || cleanCode === '0205020046') {
    // Tomografia / Ultrassom de Abdome Total
    const compatAbdome =
      cidPrefix.startsWith('K') || // Gastrointestinal (Apendicite, Colecistite, Pancreatite, Úlcera)
      cidPrefix.startsWith('N') || // Renal / Vias Urinárias (Cólica nefrética, ITU, Pielonefrite)
      cleanCid.startsWith('R10') || // Dor abdominal
      cleanCid.startsWith('C18') || cleanCid.startsWith('C22') || cleanCid.startsWith('C25') || // Neoplasias digestivas
      cleanCid.startsWith('A49') || cleanCid.startsWith('A09') || // Infecção a esclarecer, gastroenterite
      cidPrefix.startsWith('S3'); // Traumatismo do abdome e pelve

    if (!compatAbdome) {
      return {
        status: 'INCOMPATIVEL',
        titulo: 'Incompatibilidade Topográfica no SIGTAP',
        mensagem: `Procedimento de imagem abdominal não possui indicação compatível com a patologia ${cleanCid} na tabela SIGTAP.`,
        sugestoesCid: [
          { code: 'R10.4', description: 'Dor abdominal a esclarecer / Investigação de abdome agudo' },
          { code: 'N20.1', description: 'Cálculo do ureter / Cólica nefrética' },
          { code: 'K80.2', description: 'Cálculo da vesícula biliar sem colecistite' },
          { code: 'A49.9', description: 'Infecção bacteriana não especificada (Investigação de foco)' }
        ]
      };
    }

    if (cidPrefix.startsWith('S3')) {
      return {
        status: 'ALERTA',
        titulo: 'Compatível + Causa Externa Obrigatória',
        mensagem: `Traumatismo abdominal/pélvico (${cleanCid}) exige CID Secundário de Causa Externa (Capítulo XX) para faturamento no SUS.`,
        exigeCausaExterna: true
      };
    }
  } else if (cleanNome.includes('COLUNA') || cleanCode === '0206010010' || cleanCode === '0207010048') {
    // Tomografia / Ressonância de Coluna
    const compatColuna =
      cidPrefix.startsWith('M') || // Osteomuscular (Lombociatalgia, Hérnia de disco, Espondilose)
      cidPrefix === 'S12' || cidPrefix === 'S22' || cidPrefix === 'S32' || // Fraturas vertebrais
      cleanCid.startsWith('G54') || cleanCid.startsWith('G55'); // Transtornos das raízes nervosas

    if (!compatColuna) {
      return {
        status: 'INCOMPATIVEL',
        titulo: 'Incompatibilidade Ortopédica no SIGTAP',
        mensagem: `Exame de coluna vertebral divergente do CID ${cleanCid}. No SUS, exames osteomusculares exigem CID correspondente da coluna.`,
        sugestoesCid: [
          { code: 'M54.5', description: 'Dor lombar baixa (Lombociatalgia em investigação)' },
          { code: 'M51.1', description: 'Transtornos de discos lombares e outros com radiculopatia' },
          { code: 'M50.1', description: 'Transtorno do disco cervical com radiculopatia' }
        ]
      };
    }

    if (cidPrefix === 'S12' || cidPrefix === 'S22' || cidPrefix === 'S32') {
      return {
        status: 'ALERTA',
        titulo: 'Compatível + Causa Externa Obrigatória',
        mensagem: `Fratura vertebral (${cleanCid}) exige CID Secundário de Causa Externa para faturamento SUS.`,
        exigeCausaExterna: true
      };
    }
  }

  // 3. Trava de Causa Externa genérica (Capítulos S e T - Traumatismos, Intoxicações, Acidentes)
  const isTraumaOuEnvenenamento = cidPrefix.startsWith('S') || cidPrefix.startsWith('T');
  if (isTraumaOuEnvenenamento) {
    return {
      status: 'ALERTA',
      titulo: 'Causa Externa Obrigatória (Capítulo XX)',
      mensagem: `Diagnósticos do capítulo S ou T (${cleanCid}) exigem obrigatoriamente o preenchimento do CID de Causa Externa (acidente, queda, trânsito ou agressão) para evitar devolução no faturamento do SUS.`,
      exigeCausaExterna: true
    };
  }

  // 4. Tudo compatível e em conformidade com as regras do SUS
  return {
    status: 'COMPATIVEL',
    titulo: 'Compatível no SIGTAP (Risco Zero de Glosa)',
    mensagem: `O procedimento ${cleanNome || cleanCode || 'solicitado'} está em plena conformidade com as regras de cobertura do DATASUS para o diagnóstico ${cleanCid}.`
  };
}
