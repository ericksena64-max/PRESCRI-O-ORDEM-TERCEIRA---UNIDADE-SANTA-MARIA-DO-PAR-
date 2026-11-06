import React from 'react';
import { ApacData, DoctorProfile } from '../types';
import { mergeApacWithSystemContext } from '../services/apacPdfService';

interface ApacDocumentViewProps {
  data: ApacData;
  doctor: DoctorProfile;
}

const PDF_WIDTH = 595.28;
const PDF_HEIGHT = 841.89;

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

/**
 * Renderiza dígitos espaçados exatamente sobre as caixinhas (tick boxes) do PDF original.
 */
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
            className="absolute font-mono font-bold text-[10px] sm:text-[11px] text-slate-950 leading-none select-none pointer-events-none"
          >
            {ch}
          </span>
        );
      })}
    </>
  );
};

/**
 * Renderiza a folha única (1 página, campos 1 a 55) idêntica ao arquivo `Formulario_APAC_LAUDO.pdf`
 * (`01-Laudo Solic. Proc. Amb Atualizada_21-10-10.vsd`).
 */
export const ApacDocumentView: React.FC<ApacDocumentViewProps> = ({ data: rawData, doctor }) => {
  const data = mergeApacWithSystemContext(rawData, doctor);

  const [nascDia, nascMes, nascAno] = splitDateParts(data.dataNascimento);
  const [solDia, solMes, solAno] = splitDateParts(data.dataSolicitacao);
  const [autDia, autMes, autAno] = splitDateParts(data.dataAutorizacao);
  const [valIniD, valIniM, valIniA] = splitDateParts(data.periodoValidadeInicio);
  const [valFimD, valFimM, valFimA] = splitDateParts(data.periodoValidadeFim);
  const [ddd1, tel1] = splitPhone(data.telefoneCelular);
  const [ddd2, tel2] = splitPhone(data.telefoneContato);

  const sexoNorm = (data.sexo || '').toUpperCase();
  const secRowYs = [494.5, 468, 441.5, 415, 388.5];

  return (
    <div className="w-full select-none">
      {/* Container proporcional exato ao A4 do Formulario_APAC_LAUDO.pdf (595.28 x 841.89 pt) */}
      <div
        className="relative w-full bg-white overflow-hidden shadow-xs"
        style={{ aspectRatio: `${PDF_WIDTH} / ${PDF_HEIGHT}` }}
      >
        {/* Background: Imagem vetorial rasterizada em alta resolução do Formulario_APAC_LAUDO.pdf original */}
        <img
          src="/templates/Formulario_APAC_LAUDO.png"
          alt="Formulário Oficial APAC - SUS (fls. 1/2)"
          className="w-full h-full object-fill pointer-events-none select-none block"
        />

        {/* 1 - NOME DO ESTABELECIMENTO DE SAÚDE SOLICITANTE */}
        <div
          style={{ left: pctX(36), bottom: pctBottom(739), maxWidth: pctX(412) }}
          className="absolute font-bold text-[10px] sm:text-[11px] text-slate-950 uppercase truncate leading-none"
        >
          {data.estabelecimentoSolicitante}
        </div>

        {/* 2 - CNES SOLICITANTE */}
        <BoxedDigitsOverlay value={data.cnesSolicitante} startX={460} y={739} cellWidth={14.65} maxDigits={7} />

        {/* 3 - NOME DO PACIENTE */}
        <div
          style={{ left: pctX(36), bottom: pctBottom(698.5), maxWidth: pctX(360) }}
          className="absolute font-extrabold text-[11px] sm:text-[12px] text-slate-950 uppercase truncate leading-none"
        >
          {data.nomePaciente}
        </div>

        {/* 4 - SEXO (Mas. / Fem.) */}
        {sexoNorm.startsWith('M') && (
          <div
            style={{ left: pctX(423), bottom: pctBottom(698.5) }}
            className="absolute font-black text-[11px] text-slate-950 leading-none"
          >
            X
          </div>
        )}
        {sexoNorm.startsWith('F') && (
          <div
            style={{ left: pctX(459), bottom: pctBottom(698.5) }}
            className="absolute font-black text-[11px] text-slate-950 leading-none"
          >
            X
          </div>
        )}

        {/* 5 - Nº DO PRONTUÁRIO */}
        <div
          style={{ left: pctX(480), bottom: pctBottom(698.5), maxWidth: pctX(78) }}
          className="absolute font-bold text-[10px] text-slate-950 truncate leading-none"
        >
          {data.numeroProntuario}
        </div>

        {/* 6 - CARTÃO NACIONAL DE SAÚDE (CNS) */}
        <BoxedDigitsOverlay value={data.cpfOuCns} startX={32.2} y={674.5} cellWidth={17.7} maxDigits={15} />

        {/* 7 - DATA DE NASCIMENTO */}
        <div
          style={{ left: pctX(313), bottom: pctBottom(674.5) }}
          className="absolute font-bold text-[10px] text-slate-950 leading-none"
        >
          {nascDia}
        </div>
        <div
          style={{ left: pctX(337), bottom: pctBottom(674.5) }}
          className="absolute font-bold text-[10px] text-slate-950 leading-none"
        >
          {nascMes}
        </div>
        <div
          style={{ left: pctX(360), bottom: pctBottom(674.5) }}
          className="absolute font-bold text-[10px] text-slate-950 leading-none"
        >
          {nascAno}
        </div>

        {/* 8 - RAÇA/COR & 8.1 - ETNIA */}
        <div
          style={{ left: pctX(404), bottom: pctBottom(674.5), maxWidth: pctX(56) }}
          className="absolute font-semibold text-[9.5px] text-slate-950 truncate leading-none"
        >
          {data.racaCor}
        </div>
        <div
          style={{ left: pctX(471), bottom: pctBottom(674.5), maxWidth: pctX(88) }}
          className="absolute font-semibold text-[9.5px] text-slate-950 truncate leading-none"
        >
          {data.etnia}
        </div>

        {/* 9 - NOME DA MÃE */}
        <div
          style={{ left: pctX(36), bottom: pctBottom(651), maxWidth: pctX(360) }}
          className="absolute font-semibold text-[10px] text-slate-950 uppercase truncate leading-none"
        >
          {data.nomeMae}
        </div>

        {/* 10 - TELEFONE DE CONTATO */}
        <BoxedDigitsOverlay value={ddd1} startX={404.3} y={649.5} cellWidth={15.75} maxDigits={2} />
        <BoxedDigitsOverlay value={tel1} startX={435.8} y={649.5} cellWidth={15.75} maxDigits={8} />

        {/* 11 - NOME DO RESPONSÁVEL */}
        <div
          style={{ left: pctX(36), bottom: pctBottom(626.5), maxWidth: pctX(360) }}
          className="absolute font-semibold text-[10px] text-slate-950 uppercase truncate leading-none"
        >
          {data.nomeResponsavel}
        </div>

        {/* 12 - TELEFONE DE CONTATO (RESPONSÁVEL) */}
        <BoxedDigitsOverlay value={ddd2} startX={404.0} y={625} cellWidth={15.75} maxDigits={2} />
        <BoxedDigitsOverlay value={tel2} startX={435.5} y={625} cellWidth={15.75} maxDigits={8} />

        {/* 13 - ENDEREÇO (RUA, Nº, BAIRRO) */}
        <div
          style={{ left: pctX(36), bottom: pctBottom(605.5), maxWidth: pctX(520) }}
          className="absolute font-semibold text-[10px] text-slate-950 uppercase truncate leading-none"
        >
          {data.endereco}
        </div>

        {/* 14 - MUNICÍPIO DE RESIDÊNCIA */}
        <div
          style={{ left: pctX(36), bottom: pctBottom(580.5), maxWidth: pctX(314) }}
          className="absolute font-semibold text-[10px] text-slate-950 uppercase truncate leading-none"
        >
          {data.municipioResidencia}
        </div>

        {/* 15 - CÓD. IBGE MUNICÍPIO */}
        <div
          style={{ left: pctX(362), bottom: pctBottom(580.5), maxWidth: pctX(70) }}
          className="absolute font-mono font-bold text-[10px] text-slate-950 truncate leading-none"
        >
          {data.codIbgeMunicipio}
        </div>

        {/* 16 - UF */}
        <div
          style={{ left: pctX(446), bottom: pctBottom(580.5) }}
          className="absolute font-bold text-[10px] text-slate-950 uppercase leading-none"
        >
          {data.uf}
        </div>

        {/* 17 - CEP */}
        <BoxedDigitsOverlay value={data.cep} startX={469.8} y={580} cellWidth={11.5} maxDigits={8} />

        {/* 18 - CÓDIGO DO PROCEDIMENTO PRINCIPAL */}
        <BoxedDigitsOverlay
          value={data.codigoProcedimentoPrincipal}
          startX={32.5}
          y={538}
          cellWidth={16.2}
          maxDigits={10}
        />

        {/* 19 - NOME DO PROCEDIMENTO PRINCIPAL */}
        <div
          style={{ left: pctX(219), bottom: pctBottom(538.5), maxWidth: pctX(272) }}
          className="absolute font-extrabold text-[10.5px] sm:text-[11.5px] text-slate-950 uppercase truncate leading-none"
        >
          {data.nomeProcedimentoPrincipal}
        </div>

        {/* 20 - QTDE. PRINCIPAL */}
        <div
          style={{ left: pctX(518), bottom: pctBottom(538.5) }}
          className="absolute font-bold text-[10.5px] text-slate-950 leading-none"
        >
          {data.quantidadePrincipal}
        </div>

        {/* 21 a 35 - PROCEDIMENTOS SECUNDÁRIOS (5 LINHAS) */}
        {(data.procedimentosSecundarios || []).slice(0, 5).map((item, idx) => {
          const rowY = secRowYs[idx];
          return (
            <React.Fragment key={item.id || idx}>
              <BoxedDigitsOverlay value={item.codigo} startX={32.5} y={rowY} cellWidth={16.2} maxDigits={10} />
              <div
                style={{ left: pctX(219), bottom: pctBottom(rowY), maxWidth: pctX(290) }}
                className="absolute font-semibold text-[9.5px] text-slate-950 uppercase truncate leading-none"
              >
                {item.nome}
              </div>
              <div
                style={{ left: pctX(528), bottom: pctBottom(rowY) }}
                className="absolute font-semibold text-[9.5px] text-slate-950 leading-none"
              >
                {item.quantidade}
              </div>
            </React.Fragment>
          );
        })}

        {/* 36 - DESCRIÇÃO DO DIAGNÓSTICO */}
        <div
          style={{ left: pctX(36), bottom: pctBottom(338), width: pctX(296), maxHeight: '2.2%' }}
          className="absolute font-bold text-[9.5px] sm:text-[10.5px] text-slate-950 uppercase leading-tight overflow-hidden"
        >
          {data.descricaoDiagnostico}
        </div>

        {/* 37 - CID10 PRINCIPAL */}
        <div
          style={{ left: pctX(348), bottom: pctBottom(341) }}
          className="absolute font-black text-[11px] sm:text-[12px] text-slate-950 uppercase leading-none"
        >
          {data.cid10Principal}
        </div>

        {/* 38 - CID10 SECUNDÁRIO */}
        <div
          style={{ left: pctX(412), bottom: pctBottom(341) }}
          className="absolute font-bold text-[10.5px] text-slate-950 uppercase leading-none"
        >
          {data.cid10Secundario}
        </div>

        {/* 39 - CID10 CAUSAS ASSOCIADAS */}
        <div
          style={{ left: pctX(482), bottom: pctBottom(341) }}
          className="absolute font-bold text-[10.5px] text-slate-950 uppercase leading-none"
        >
          {data.cid10CausasAssociadas}
        </div>

        {/* 40 - OBSERVAÇÕES */}
        <div
          style={{ left: pctX(36), bottom: pctBottom(250), width: pctX(520), height: '8.2%' }}
          className="absolute font-medium text-[9.5px] sm:text-[10px] text-slate-900 whitespace-pre-wrap leading-snug overflow-hidden"
        >
          {data.observacoes}
        </div>

        {/* 41 - NOME DO PROFISSIONAL SOLICITANTE (Automático pela Regra 3) */}
        <div
          style={{ left: pctX(36), bottom: pctBottom(204), maxWidth: pctX(258) }}
          className="absolute font-extrabold text-[10px] sm:text-[11px] text-slate-950 uppercase truncate leading-none"
        >
          {data.nomeProfissionalSolicitante}
        </div>

        {/* 42 - DATA DA SOLICITAÇÃO (Automático pela Regra 3) */}
        <div
          style={{ left: pctX(307), bottom: pctBottom(204) }}
          className="absolute font-bold text-[10px] text-slate-950 leading-none"
        >
          {solDia}
        </div>
        <div
          style={{ left: pctX(330), bottom: pctBottom(204) }}
          className="absolute font-bold text-[10px] text-slate-950 leading-none"
        >
          {solMes}
        </div>
        <div
          style={{ left: pctX(352), bottom: pctBottom(204) }}
          className="absolute font-bold text-[10px] text-slate-950 leading-none"
        >
          {solAno}
        </div>

        {/* 43 - DOCUMENTO (CNS / CPF) */}
        {data.tipoDocumentoSolicitante === 'CPF' && (
          <>
            <div
              style={{ left: pctX(51), bottom: pctBottom(180), width: pctX(10), height: '1.3%' }}
              className="absolute bg-white"
            />
            <div
              style={{ left: pctX(103), bottom: pctBottom(182) }}
              className="absolute font-black text-[10px] text-slate-950 leading-none"
            >
              X
            </div>
          </>
        )}

        {/* 44 - Nº DOCUMENTO (CNS/CPF) DO PROFISSIONAL SOLICITANTE */}
        <BoxedDigitsOverlay
          value={data.cnsProfissionalSolicitante}
          startX={145.7}
          y={180.5}
          cellWidth={15.7}
          maxDigits={15}
        />

        {/* 45 - ASSINATURA E CARIMBO (Nº REGISTRO DO CONSELHO) - CAMPO FICA EM BRANCO PARA ASSINATURA MANUAL E CARIMBO FÍSICO */}
        <div
          style={{ left: pctX(390), bottom: pctBottom(182), width: pctX(168), height: `${((38 / PDF_HEIGHT) * 100).toFixed(3)}%` }}
          className="absolute flex items-center justify-center pointer-events-none"
        >
          {/* Deixado em branco para carimbo e assinatura física do médico solicitante */}
        </div>

        {/* 46 - NOME DO PROFISSIONAL AUTORIZADOR */}
        <div
          style={{ left: pctX(36), bottom: pctBottom(135), maxWidth: pctX(246) }}
          className="absolute font-semibold text-[9.5px] text-slate-950 uppercase truncate leading-none"
        >
          {data.nomeProfissionalAutorizador}
        </div>

        {/* 47 - CÓD. ÓRGÃO EMISSOR */}
        <div
          style={{ left: pctX(292), bottom: pctBottom(135), maxWidth: pctX(80) }}
          className="absolute font-semibold text-[9.5px] text-slate-950 truncate leading-none"
        >
          {data.codOrgaoEmissor}
        </div>

        {/* 49 - Nº DOCUMENTO (CNS/CPF) DO PROFISSIONAL AUTORIZADOR */}
        <BoxedDigitsOverlay
          value={data.cnsProfissionalAutorizador}
          startX={145.7}
          y={101.5}
          cellWidth={15.7}
          maxDigits={15}
        />

        {/* 50 - DATA DA AUTORIZAÇÃO */}
        <div
          style={{ left: pctX(39), bottom: pctBottom(67.5) }}
          className="absolute font-semibold text-[9.5px] text-slate-950 leading-none"
        >
          {autDia}
        </div>
        <div
          style={{ left: pctX(61), bottom: pctBottom(67.5) }}
          className="absolute font-semibold text-[9.5px] text-slate-950 leading-none"
        >
          {autMes}
        </div>
        <div
          style={{ left: pctX(83), bottom: pctBottom(67.5) }}
          className="absolute font-semibold text-[9.5px] text-slate-950 leading-none"
        >
          {autAno}
        </div>

        {/* 51 - ASSINATURA E CARIMBO AUTORIZADOR */}
        <div
          style={{ left: pctX(124), bottom: pctBottom(67.5), maxWidth: pctX(245) }}
          className="absolute font-semibold text-[9.5px] text-slate-950 truncate leading-none"
        >
          {data.registroConselhoAutorizador}
        </div>

        {/* 52 - Nº DA AUTORIZAÇÃO (APAC) */}
        <div
          style={{ left: pctX(395), bottom: pctBottom(112), maxWidth: pctX(158) }}
          className="absolute font-mono font-bold text-[11px] text-slate-950 truncate leading-none"
        >
          {data.numeroAutorizacaoApac}
        </div>

        {/* 53 - PERÍODO DE VALIDADE DA APAC */}
        {valIniD && (
          <div
            style={{ left: pctX(394), bottom: pctBottom(66.5) }}
            className="absolute font-semibold text-[9px] text-slate-950 leading-none"
          >
            {`${valIniD}/${valIniM}/${valIniA}`}
          </div>
        )}
        {valFimD && (
          <div
            style={{ left: pctX(486), bottom: pctBottom(66.5) }}
            className="absolute font-semibold text-[9px] text-slate-950 leading-none"
          >
            {`${valFimD}/${valFimM}/${valFimA}`}
          </div>
        )}

        {/* 54 - NOME FANTASIA DO ESTABELECIMENTO DE SAÚDE EXECUTANTE */}
        <div
          style={{ left: pctX(38), bottom: pctBottom(30.5), maxWidth: pctX(380) }}
          className="absolute font-semibold text-[9.5px] text-slate-950 uppercase truncate leading-none"
        >
          {data.nomeFantasiaExecutante}
        </div>

        {/* 55 - CNES EXECUTANTE */}
        <BoxedDigitsOverlay value={data.cnesExecutante} startX={441} y={30.5} cellWidth={14.65} maxDigits={7} />
      </div>
    </div>
  );
};
