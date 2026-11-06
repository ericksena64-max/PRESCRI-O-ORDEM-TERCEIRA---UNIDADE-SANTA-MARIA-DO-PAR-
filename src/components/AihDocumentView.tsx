import React from 'react';
import { AihData, DoctorProfile } from '../types';
import { mergeAihWithSystemContext } from '../services/aihPdfService';

interface AihDocumentViewProps {
  data: AihData;
  doctor: DoctorProfile;
}

const PDF_WIDTH = 595.0;
const PDF_HEIGHT = 842.0;

function pctX(ptX: number): string {
  return `${((ptX / PDF_WIDTH) * 100).toFixed(3)}%`;
}

function pctBottom(ptY: number): string {
  return `${((ptY / PDF_HEIGHT) * 100).toFixed(3)}%`;
}

function splitDateParts(dateStr?: string): [string, string, string] {
  if (!dateStr) return ['', '', ''];
  const clean = dateStr.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) {
    const [yyyy, mm, dd] = clean.split('-');
    return [dd, mm, yyyy];
  }
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(clean)) {
    const [dd, mm, yyyy] = clean.split('/');
    return [dd, mm, yyyy];
  }
  return [clean, '', ''];
}

function splitPhone(phone?: string): [string, string] {
  if (!phone) return ['', ''];
  const digits = phone.replace(/\D/g, '');
  if (digits.length >= 10) {
    return [digits.slice(0, 2), digits.slice(2, 11)];
  }
  return ['', digits.slice(0, 9)];
}

const BoxedDigitsOverlay: React.FC<{
  value?: string;
  startX: number;
  y: number;
  cellWidth: number;
  maxDigits: number;
}> = ({ value, startX, y, cellWidth, maxDigits }) => {
  if (!value) return null;
  const chars = value.replace(/[^0-9A-Za-z]/g, '').slice(0, maxDigits).split('');
  return (
    <>
      {chars.map((ch, idx) => {
        const centerX = startX + idx * cellWidth + cellWidth / 2;
        return (
          <span
            key={idx}
            style={{
              left: pctX(centerX),
              bottom: pctBottom(y),
              transform: 'translateX(-50%)'
            }}
            className="absolute font-mono font-bold text-[9.5px] sm:text-[10.5px] text-slate-950 leading-none select-none pointer-events-none"
          >
            {ch}
          </span>
        );
      })}
    </>
  );
};

export const AihDocumentView: React.FC<AihDocumentViewProps> = ({ data: rawData, doctor }) => {
  const data = mergeAihWithSystemContext(rawData, doctor);

  const [nascDia, nascMes, nascAno] = splitDateParts(data.dataNascimento);
  const [solDia, solMes, solAno] = splitDateParts(data.dataSolicitacao);
  const [autDia, autMes, autAno] = splitDateParts(data.dataAutorizacao);
  const [ddd1, tel1] = splitPhone(data.telefoneContato);
  const [ddd2, tel2] = splitPhone(data.telefoneResponsavel);

  const sexoNorm = (data.sexo || '').toUpperCase();

  return (
    <div className="w-full space-y-6 select-none">
      {/* =====================================================================
          FOLHA 1: IDENTIFICAÇÃO, JUSTIFICATIVA, PROCEDIMENTO, CAUSAS EXTERNAS
          ===================================================================== */}
      <div className="relative w-full bg-white overflow-hidden shadow-xs border border-slate-300" style={{ aspectRatio: `${PDF_WIDTH} / ${PDF_HEIGHT}` }}>
        <img
          src="/templates/AIH_page1.png"
          alt="Formulário Oficial AIH - Página 1"
          className="w-full h-full object-fill pointer-events-none select-none block"
        />

        {/* 1 - NOME DO ESTABELECIMENTO SOLICITANTE */}
        <div style={{ left: pctX(38), bottom: pctBottom(726), maxWidth: pctX(395) }} className="absolute font-bold text-[9.5px] sm:text-[10px] text-slate-950 uppercase truncate leading-none">
          {data.estabelecimentoSolicitante}
        </div>

        {/* 2 - CNES SOLICITANTE */}
        <BoxedDigitsOverlay value={data.cnesSolicitante} startX={439} y={725} cellWidth={17} maxDigits={7} />

        {/* 3 - NOME DO ESTABELECIMENTO EXECUTANTE */}
        <div style={{ left: pctX(38), bottom: pctBottom(706), maxWidth: pctX(395) }} className="absolute font-bold text-[9.5px] sm:text-[10px] text-slate-950 uppercase truncate leading-none">
          {data.estabelecimentoExecutante}
        </div>

        {/* 4 - CNES EXECUTANTE */}
        <BoxedDigitsOverlay value={data.cnesExecutante} startX={439} y={705} cellWidth={17} maxDigits={7} />

        {/* 5 - NOME DO PACIENTE */}
        <div style={{ left: pctX(38), bottom: pctBottom(670), maxWidth: pctX(415) }} className="absolute font-extrabold text-[10.5px] sm:text-[11.5px] text-slate-950 uppercase truncate leading-none">
          {data.nomePaciente}
        </div>

        {/* 6 - Nº DO PRONTUÁRIO */}
        <div style={{ left: pctX(465), bottom: pctBottom(670), maxWidth: pctX(85) }} className="absolute font-bold text-[10px] text-slate-950 truncate leading-none">
          {data.numeroProntuario}
        </div>

        {/* 7 - CARTÃO NACIONAL DE SAÚDE (CNS) */}
        <BoxedDigitsOverlay value={data.cnsPaciente} startX={36} y={649} cellWidth={16} maxDigits={15} />

        {/* 8 - DATA DE NASCIMENTO */}
        <div style={{ left: pctX(275), bottom: pctBottom(650) }} className="absolute font-bold text-[9.5px] text-slate-950 leading-none">
          {nascDia ? `${nascDia}/${nascMes}/${nascAno}` : ''}
        </div>

        {/* 9 - SEXO */}
        {(sexoNorm.startsWith('1') || sexoNorm.startsWith('M')) && (
          <div style={{ left: pctX(388), bottom: pctBottom(651) }} className="absolute font-black text-[10.5px] text-slate-950 leading-none">
            X
          </div>
        )}
        {(sexoNorm.startsWith('3') || sexoNorm.startsWith('F')) && (
          <div style={{ left: pctX(431), bottom: pctBottom(651) }} className="absolute font-black text-[10.5px] text-slate-950 leading-none">
            X
          </div>
        )}

        {/* 10 - RAÇA/COR & 10.1 - ETNIA */}
        <div style={{ left: pctX(460), bottom: pctBottom(650), maxWidth: pctX(52) }} className="absolute font-semibold text-[9px] text-slate-950 truncate leading-none">
          {data.racaCor}
        </div>
        <div style={{ left: pctX(518), bottom: pctBottom(650), maxWidth: pctX(40) }} className="absolute font-semibold text-[9px] text-slate-950 truncate leading-none">
          {data.etnia}
        </div>

        {/* 11 - NOME DA MÃE */}
        <div style={{ left: pctX(38), bottom: pctBottom(630), maxWidth: pctX(335) }} className="absolute font-semibold text-[9.5px] text-slate-950 uppercase truncate leading-none">
          {data.nomeMaeOuResponsavel}
        </div>

        {/* 12 - TELEFONE DE CONTATO */}
        <div style={{ left: pctX(387), bottom: pctBottom(630) }} className="absolute font-semibold text-[9px] text-slate-950 leading-none">
          {ddd1}
        </div>
        <div style={{ left: pctX(420), bottom: pctBottom(630), maxWidth: pctX(120) }} className="absolute font-semibold text-[9px] text-slate-950 leading-none">
          {tel1}
        </div>

        {/* 13 - NOME DO RESPONSÁVEL */}
        <div style={{ left: pctX(38), bottom: pctBottom(611), maxWidth: pctX(335) }} className="absolute font-semibold text-[9.5px] text-slate-950 uppercase truncate leading-none">
          {data.nomeResponsavel}
        </div>

        {/* 14 - TELEFONE DE CONTATO RESPONSÁVEL */}
        <div style={{ left: pctX(387), bottom: pctBottom(611) }} className="absolute font-semibold text-[9px] text-slate-950 leading-none">
          {ddd2}
        </div>
        <div style={{ left: pctX(420), bottom: pctBottom(611), maxWidth: pctX(120) }} className="absolute font-semibold text-[9px] text-slate-950 leading-none">
          {tel2}
        </div>

        {/* 15 - ENDEREÇO */}
        <div style={{ left: pctX(38), bottom: pctBottom(593), maxWidth: pctX(510) }} className="absolute font-semibold text-[9.5px] text-slate-950 uppercase truncate leading-none">
          {data.endereco}
        </div>

        {/* 16 - MUNICÍPIO DE RESIDÊNCIA */}
        <div style={{ left: pctX(38), bottom: pctBottom(574), maxWidth: pctX(245) }} className="absolute font-semibold text-[9.5px] text-slate-950 uppercase truncate leading-none">
          {data.municipioResidencia}
        </div>

        {/* 17 - CÓD. IBGE MUNICÍPIO */}
        <div style={{ left: pctX(298), bottom: pctBottom(574), maxWidth: pctX(90) }} className="absolute font-mono font-bold text-[9.5px] text-slate-950 leading-none">
          {data.codIbgeMunicipio}
        </div>

        {/* 18 - UF */}
        <div style={{ left: pctX(400), bottom: pctBottom(574) }} className="absolute font-bold text-[9.5px] text-slate-950 uppercase leading-none">
          {data.uf}
        </div>

        {/* 19 - CEP */}
        <BoxedDigitsOverlay value={data.cep} startX={430} y={574} cellWidth={14} maxDigits={8} />

        {/* 20 - PRINCIPAIS SINAIS E SINTOMAS CLÍNICOS */}
        <div style={{ left: pctX(38), bottom: pctBottom(452), width: pctX(515), height: '9.8%' }} className="absolute font-medium text-[8.5px] sm:text-[9.5px] text-slate-950 leading-snug overflow-hidden whitespace-pre-wrap">
          {data.principaisSinaisSintomas}
        </div>

        {/* 21 - CONDIÇÕES QUE JUSTIFICAM A INTERNAÇÃO */}
        <div style={{ left: pctX(38), bottom: pctBottom(408), width: pctX(515), height: '4.8%' }} className="absolute font-medium text-[8.5px] sm:text-[9.5px] text-slate-950 leading-snug overflow-hidden whitespace-pre-wrap">
          {data.condicoesJustificamInternacao}
        </div>

        {/* 22 - PRINCIPAIS RESULTADOS DE PROVAS DIAGNÓSTICAS */}
        <div style={{ left: pctX(38), bottom: pctBottom(360), width: pctX(515), height: '5.2%' }} className="absolute font-medium text-[8.5px] sm:text-[9.5px] text-slate-950 leading-snug overflow-hidden whitespace-pre-wrap">
          {data.resultadosProvasDiagnosticas}
        </div>

        {/* 23 - DIAGNÓSTICO INICIAL */}
        <div style={{ left: pctX(38), bottom: pctBottom(343), maxWidth: pctX(210) }} className="absolute font-extrabold text-[9.5px] text-slate-950 uppercase truncate leading-none">
          {data.diagnosticoInicial}
        </div>

        {/* 24 - CID 10 PRINCIPAL */}
        <div style={{ left: pctX(258), bottom: pctBottom(343) }} className="absolute font-black text-[10.5px] sm:text-[11.5px] text-slate-950 uppercase leading-none">
          {data.cid10Principal}
        </div>

        {/* 25 - CID 10 SECUNDÁRIO */}
        <div style={{ left: pctX(355), bottom: pctBottom(343) }} className="absolute font-bold text-[10px] text-slate-950 uppercase leading-none">
          {data.cid10Secundario}
        </div>

        {/* 26 - CID 10 CAUSAS ASSOCIADAS */}
        <div style={{ left: pctX(448), bottom: pctBottom(343) }} className="absolute font-bold text-[10px] text-slate-950 uppercase leading-none">
          {data.cid10CausasAssociadas}
        </div>

        {/* 27 - DESCRIÇÃO DO PROCEDIMENTO SOLICITADO */}
        <div style={{ left: pctX(38), bottom: pctBottom(307), maxWidth: pctX(325) }} className="absolute font-extrabold text-[9.5px] sm:text-[10px] text-slate-950 uppercase truncate leading-none">
          {data.descricaoProcedimentoSolicitado}
        </div>

        {/* 28 - CÓDIGO DO PROCEDIMENTO */}
        <BoxedDigitsOverlay value={data.codigoProcedimento} startX={370} y={307} cellWidth={18.5} maxDigits={10} />

        {/* 29 - CLÍNICA */}
        <div style={{ left: pctX(38), bottom: pctBottom(287), maxWidth: pctX(70) }} className="absolute font-bold text-[8.5px] text-slate-950 truncate leading-none">
          {data.clinica}
        </div>

        {/* 30 - CARÁTER DA INTERNAÇÃO */}
        <div style={{ left: pctX(115), bottom: pctBottom(287), maxWidth: pctX(110) }} className="absolute font-bold text-[8.5px] text-slate-950 truncate leading-none">
          {data.caraterInternacao}
        </div>

        {/* 31 - TIPO DOCUMENTO PROFISSIONAL */}
        <div style={{ left: pctX(238), bottom: pctBottom(287) }} className="absolute font-bold text-[9px] text-slate-950 leading-none">
          {data.tipoDocumentoProfissional === 'CPF' ? 'CPF' : 'CNS'}
        </div>

        {/* 32 - Nº DOCUMENTO PROFISSIONAL */}
        <BoxedDigitsOverlay value={data.numeroDocumentoProfissional} startX={321} y={287} cellWidth={15.5} maxDigits={15} />

        {/* 33 - NOME DO PROFISSIONAL SOLICITANTE */}
        <div style={{ left: pctX(38), bottom: pctBottom(266), maxWidth: pctX(245) }} className="absolute font-extrabold text-[9.5px] sm:text-[10px] text-slate-950 uppercase truncate leading-none">
          {data.nomeProfissionalSolicitante}
        </div>

        {/* 34 - DATA DA SOLICITAÇÃO */}
        <div style={{ left: pctX(292), bottom: pctBottom(266) }} className="absolute font-bold text-[9.5px] text-slate-950 leading-none">
          {solDia ? `${solDia}/${solMes}/${solAno}` : ''}
        </div>

        {/* 35 - ASSINATURA E CARIMBO (REGISTRO DO CONSELHO) */}
        <div style={{ left: pctX(385), bottom: pctBottom(256), width: pctX(165) }} className="absolute text-center flex flex-col items-center justify-center pointer-events-none">
          {doctor.digitalSignatureUrl && (
            <img src={doctor.digitalSignatureUrl} alt="Assinatura" className="max-h-5 object-contain mb-0.5" />
          )}
          <span className="font-bold text-[8px] sm:text-[8.5px] text-slate-950 uppercase leading-tight truncate w-full">
            {data.nomeProfissionalSolicitante}
          </span>
          <span className="font-bold text-[8px] sm:text-[8.5px] text-blue-950 leading-tight">
            {data.registroConselho}
          </span>
        </div>

        {/* 36 a 38 - CAUSAS EXTERNAS CHECKBOXES */}
        {data.causaExterna === 'transito' && (
          <div style={{ left: pctX(44), bottom: pctBottom(222) }} className="absolute font-black text-[9px] text-slate-950 leading-none">
            X
          </div>
        )}
        {data.causaExterna === 'trabalho_tipico' && (
          <div style={{ left: pctX(44), bottom: pctBottom(212) }} className="absolute font-black text-[9px] text-slate-950 leading-none">
            X
          </div>
        )}
        {data.causaExterna === 'trabalho_trajeto' && (
          <div style={{ left: pctX(44), bottom: pctBottom(202) }} className="absolute font-black text-[9px] text-slate-950 leading-none">
            X
          </div>
        )}

        {/* 39 a 44 - SEGURADORA E EMPRESA */}
        <div style={{ left: pctX(178), bottom: pctBottom(221), maxWidth: pctX(245) }} className="absolute font-semibold text-[8.5px] text-slate-950 truncate leading-none">
          {data.cnpjSeguradora}
        </div>
        <div style={{ left: pctX(434), bottom: pctBottom(221), maxWidth: pctX(75) }} className="absolute font-semibold text-[8.5px] text-slate-950 truncate leading-none">
          {data.numeroBilhete}
        </div>
        <div style={{ left: pctX(517), bottom: pctBottom(221) }} className="absolute font-semibold text-[8.5px] text-slate-950 leading-none">
          {data.serie}
        </div>
        <div style={{ left: pctX(178), bottom: pctBottom(201), maxWidth: pctX(235) }} className="absolute font-semibold text-[8.5px] text-slate-950 truncate leading-none">
          {data.cnpjEmpresa}
        </div>
        <div style={{ left: pctX(423), bottom: pctBottom(201), maxWidth: pctX(85) }} className="absolute font-semibold text-[8.5px] text-slate-950 truncate leading-none">
          {data.cnaeEmpresa}
        </div>
        <div style={{ left: pctX(517), bottom: pctBottom(201) }} className="absolute font-semibold text-[8.5px] text-slate-950 leading-none">
          {data.cbor}
        </div>

        {/* 45 - VÍNCULO COM A PREVIDÊNCIA */}
        {data.vinculoPrevidencia === 'empregado' && (
          <div style={{ left: pctX(38), bottom: pctBottom(179) }} className="absolute font-black text-[9px] text-slate-950 leading-none">
            X
          </div>
        )}
        {data.vinculoPrevidencia === 'empregador' && (
          <div style={{ left: pctX(124), bottom: pctBottom(179) }} className="absolute font-black text-[9px] text-slate-950 leading-none">
            X
          </div>
        )}
        {data.vinculoPrevidencia === 'autonomo' && (
          <div style={{ left: pctX(211), bottom: pctBottom(179) }} className="absolute font-black text-[9px] text-slate-950 leading-none">
            X
          </div>
        )}
        {data.vinculoPrevidencia === 'desempregado' && (
          <div style={{ left: pctX(301), bottom: pctBottom(179) }} className="absolute font-black text-[9px] text-slate-950 leading-none">
            X
          </div>
        )}
        {data.vinculoPrevidencia === 'aposentado' && (
          <div style={{ left: pctX(395), bottom: pctBottom(179) }} className="absolute font-black text-[9px] text-slate-950 leading-none">
            X
          </div>
        )}
        {data.vinculoPrevidencia === 'nao_segurado' && (
          <div style={{ left: pctX(482), bottom: pctBottom(179) }} className="absolute font-black text-[9px] text-slate-950 leading-none">
            X
          </div>
        )}

        {/* 46 a 52 - AUTORIZAÇÃO */}
        <div style={{ left: pctX(38), bottom: pctBottom(140), maxWidth: pctX(255) }} className="absolute font-semibold text-[9px] text-slate-950 uppercase truncate leading-none">
          {data.nomeProfissionalAutorizador}
        </div>
        <div style={{ left: pctX(306), bottom: pctBottom(140), maxWidth: pctX(85) }} className="absolute font-semibold text-[9px] text-slate-950 truncate leading-none">
          {data.codOrgaoEmissor}
        </div>
        <div style={{ left: pctX(404), bottom: pctBottom(140), maxWidth: pctX(145) }} className="absolute font-mono font-bold text-[10px] text-slate-950 truncate leading-none">
          {data.numeroAih}
        </div>
        <BoxedDigitsOverlay value={data.numDocAutorizador} startX={167} y={120} cellWidth={15} maxDigits={15} />
        <div style={{ left: pctX(38), bottom: pctBottom(100) }} className="absolute font-semibold text-[9px] text-slate-950 leading-none">
          {autDia ? `${autDia}/${autMes}/${autAno}` : ''}
        </div>
        <div style={{ left: pctX(157), bottom: pctBottom(100), maxWidth: pctX(200) }} className="absolute font-semibold text-[9px] text-slate-950 truncate leading-none">
          {data.registroConselhoAutorizador}
        </div>
      </div>

      {/* =====================================================================
          FOLHA 2: FOLHA CLÍNICA (DADOS VITAIS, EXAMES, MEDICAMENTOS)
          ===================================================================== */}
      <div className="relative w-full bg-white overflow-hidden shadow-xs border border-slate-300" style={{ aspectRatio: `${PDF_WIDTH} / ${PDF_HEIGHT}` }}>
        <img
          src="/templates/AIH_page2.png"
          alt="Formulário Oficial AIH - Página 2"
          className="w-full h-full object-fill pointer-events-none select-none block"
        />

        {/* SINAIS / SINTOMAS */}
        {data.alteracaoConsciencia === 'sim' && (
          <div style={{ left: pctX(160), bottom: pctBottom(731) }} className="absolute font-black text-[9px] text-slate-950 leading-none">
            X
          </div>
        )}
        {data.alteracaoConsciencia === 'nao' && (
          <div style={{ left: pctX(188), bottom: pctBottom(731) }} className="absolute font-black text-[9px] text-slate-950 leading-none">
            X
          </div>
        )}
        <div style={{ left: pctX(75), bottom: pctBottom(717), maxWidth: pctX(215) }} className="absolute font-semibold text-[9px] text-slate-950 leading-none">
          {data.febre}
        </div>
        <div style={{ left: pctX(135), bottom: pctBottom(703), maxWidth: pctX(155) }} className="absolute font-semibold text-[9px] text-slate-950 leading-none">
          {data.desnutricao}
        </div>
        {data.desidratacao === 'sim' && (
          <div style={{ left: pctX(120), bottom: pctBottom(689) }} className="absolute font-black text-[9px] text-slate-950 leading-none">
            X
          </div>
        )}
        {data.desidratacao === 'nao' && (
          <div style={{ left: pctX(152), bottom: pctBottom(689) }} className="absolute font-black text-[9px] text-slate-950 leading-none">
            X
          </div>
        )}
        {data.desidratacao === 'ignorado' && (
          <div style={{ left: pctX(195), bottom: pctBottom(689) }} className="absolute font-black text-[9px] text-slate-950 leading-none">
            X
          </div>
        )}

        {/* DADOS VITAIS */}
        <div style={{ left: pctX(350), bottom: pctBottom(731), maxWidth: pctX(195) }} className="absolute font-bold text-[9.5px] text-slate-950 leading-none">
          {data.pulso}
        </div>
        <div style={{ left: pctX(385), bottom: pctBottom(717), maxWidth: pctX(160) }} className="absolute font-bold text-[9.5px] text-slate-950 leading-none">
          {data.pressaoArterial}
        </div>
        <div style={{ left: pctX(385), bottom: pctBottom(703), maxWidth: pctX(160) }} className="absolute font-bold text-[9.5px] text-slate-950 leading-none">
          {data.frequenciaRespiratoria}
        </div>
        <div style={{ left: pctX(375), bottom: pctBottom(689), maxWidth: pctX(170) }} className="absolute font-bold text-[9.5px] text-slate-950 leading-none">
          {data.frequenciaCardiaca}
        </div>

        {/* MEDICAMENTOS EM USO */}
        <div style={{ left: pctX(38), bottom: pctBottom(525), width: pctX(520), height: '14.5%' }} className="absolute font-medium text-[9px] sm:text-[9.5px] text-slate-950 leading-snug overflow-hidden whitespace-pre-wrap">
          {data.medicamentosEmUso}
        </div>

        {/* MOTIVO DO ENCAMINHAMENTO */}
        <div style={{ left: pctX(38), bottom: pctBottom(365), width: pctX(520), height: '17%' }} className="absolute font-medium text-[9px] sm:text-[9.5px] text-slate-950 leading-snug overflow-hidden whitespace-pre-wrap">
          {data.motivoEncaminhamento}
        </div>

        {/* EXAMES CLÍNICOS */}
        <div style={{ left: pctX(135), bottom: pctBottom(334), maxWidth: pctX(420) }} className="absolute font-medium text-[8.5px] text-slate-950 truncate leading-none">
          {data.exameCirculatorio}
        </div>
        <div style={{ left: pctX(190), bottom: pctBottom(320), maxWidth: pctX(365) }} className="absolute font-medium text-[8.5px] text-slate-950 truncate leading-none">
          {data.outrosAchadosClinicos}
        </div>
        <div style={{ left: pctX(185), bottom: pctBottom(306), maxWidth: pctX(370) }} className="absolute font-medium text-[8.5px] text-slate-950 truncate leading-none">
          {data.exameAparelhoRespiratorio}
        </div>

        {/* EXAMES COMPLEMENTARES */}
        <div style={{ left: pctX(235), bottom: pctBottom(269), maxWidth: pctX(320) }} className="absolute font-medium text-[8.5px] text-slate-950 truncate leading-none">
          {data.examesLaboratoriais}
        </div>
        <div style={{ left: pctX(140), bottom: pctBottom(255), maxWidth: pctX(415) }} className="absolute font-medium text-[8.5px] text-slate-950 truncate leading-none">
          {data.idadeGestacional}
        </div>
        <div style={{ left: pctX(115), bottom: pctBottom(241), maxWidth: pctX(440) }} className="absolute font-medium text-[8.5px] text-slate-950 truncate leading-none">
          {data.mauFormacao}
        </div>
        {data.ultrassom === 'sim' && (
          <div style={{ left: pctX(105), bottom: pctBottom(227) }} className="absolute font-black text-[9px] text-slate-950 leading-none">
            X
          </div>
        )}
        {data.ultrassom === 'nao' && (
          <div style={{ left: pctX(135), bottom: pctBottom(227) }} className="absolute font-black text-[9px] text-slate-950 leading-none">
            X
          </div>
        )}
        {data.ultrassom === 'ignorado' && (
          <div style={{ left: pctX(175), bottom: pctBottom(227) }} className="absolute font-black text-[9px] text-slate-950 leading-none">
            X
          </div>
        )}
        <div style={{ left: pctX(240), bottom: pctBottom(227), maxWidth: pctX(315) }} className="absolute font-medium text-[8.5px] text-slate-950 truncate leading-none">
          {data.ultrassomObs}
        </div>
        <div style={{ left: pctX(120), bottom: pctBottom(213), maxWidth: pctX(435) }} className="absolute font-medium text-[8.5px] text-slate-950 truncate leading-none">
          {data.outrosExames}
        </div>
        <div style={{ left: pctX(105), bottom: pctBottom(199), maxWidth: pctX(450) }} className="absolute font-medium text-[8.5px] text-slate-950 truncate leading-none">
          {data.radiografias}
        </div>

        {/* EXAME OBSTÉTRICO */}
        <div style={{ left: pctX(130), bottom: pctBottom(163), maxWidth: pctX(425) }} className="absolute font-medium text-[8.5px] text-slate-950 truncate leading-none">
          {data.dinamicaUterina}
        </div>
        <div style={{ left: pctX(130), bottom: pctBottom(149), maxWidth: pctX(425) }} className="absolute font-medium text-[8.5px] text-slate-950 truncate leading-none">
          {data.dilatacaoColo}
        </div>
        {data.roturaMembrana === 'sim' && (
          <div style={{ left: pctX(160), bottom: pctBottom(135) }} className="absolute font-black text-[9px] text-slate-950 leading-none">
            X
          </div>
        )}
        {data.roturaMembrana === 'nao' && (
          <div style={{ left: pctX(190), bottom: pctBottom(135) }} className="absolute font-black text-[9px] text-slate-950 leading-none">
            X
          </div>
        )}
        <div style={{ left: pctX(110), bottom: pctBottom(121), maxWidth: pctX(445) }} className="absolute font-medium text-[8.5px] text-slate-950 truncate leading-none">
          {data.apagamento}
        </div>
        <div style={{ left: pctX(155), bottom: pctBottom(107), maxWidth: pctX(400) }} className="absolute font-medium text-[8.5px] text-slate-950 truncate leading-none">
          {data.alturaApresentacao}
        </div>
        <div style={{ left: pctX(120), bottom: pctBottom(93), maxWidth: pctX(435) }} className="absolute font-medium text-[8.5px] text-slate-950 truncate leading-none">
          {data.posicaoColo}
        </div>
      </div>
    </div>
  );
};
