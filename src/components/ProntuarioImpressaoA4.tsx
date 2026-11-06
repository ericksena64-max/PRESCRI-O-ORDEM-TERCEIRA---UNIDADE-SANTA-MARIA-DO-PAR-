import React from 'react';
import {
  Printer,
  Copy,
  Check
} from 'lucide-react';
import {
  FichaAdmissaoHospitalar,
  EvolucaoSoapItem,
  PatientInfo,
  DoctorProfile,
  InpatientInfo
} from '../types';

interface ProntuarioImpressaoA4Props {
  admissao: FichaAdmissaoHospitalar;
  evolucoes: EvolucaoSoapItem[];
  patient: PatientInfo;
  doctor: DoctorProfile;
  inpatientInfo: InpatientInfo;
  onSaveToHistory?: (summary: string) => void;
}

export const ProntuarioImpressaoA4: React.FC<ProntuarioImpressaoA4Props> = ({
  admissao,
  evolucoes,
  patient,
  doctor,
  inpatientInfo,
  onSaveToHistory
}) => {
  const [copied, setCopied] = React.useState(false);

  const handlePrint = () => {
    if (onSaveToHistory) {
      onSaveToHistory(`Prontuário e Evoluções: ${patient.name || 'Paciente'}`);
    }
    window.print();
  };

  const handleCopyText = () => {
    const lines = [
      `PRONTUÁRIO HOSPITALAR — ${doctor.clinicName.toUpperCase()}`,
      `PACIENTE: ${patient.name || 'Não informado'} | LEITO: ${patient.bed || inpatientInfo.bed || '-'}`,
      `DATA DA ADMISSÃO: ${admissao.dataHoraAdmissao.replace('T', ' ')}`,
      `----------------------------------------`,
      `1. FICHA DE ADMISSÃO (ANAMNESE & EXAME FÍSICO)`,
      `Queixa Principal: ${admissao.queixaPrincipal}`,
      `HDA: ${admissao.hda}`,
      `Alergias: ${admissao.temAlergia === 'alergico' ? admissao.alergiasDescricao : 'Não relata alergias'}`,
      `Exame Físico: PA ${admissao.sinaisVitais.pa} | FC ${admissao.sinaisVitais.fc} | SatO2 ${admissao.sinaisVitais.spo2}%`,
      `Geral: ${admissao.exameSegmentar.geral}`,
      `ACV: ${admissao.exameSegmentar.acv}`,
      `AR: ${admissao.exameSegmentar.ar}`,
      `Abdome: ${admissao.exameSegmentar.abdome}`,
      `Extremidades/Neuro: ${admissao.exameSegmentar.extremidadesNeuro}`,
      `Hipóteses Diagnósticas: ${admissao.diagnosticos.map(d => `${d.cidCode ? d.cidCode + ' - ' : ''}${d.descricao}`).join('; ')}`,
      `----------------------------------------`,
      `2. EVOLUÇÕES DIÁRIAS (SOAP)`,
      ...evolucoes.map(e => `[${new Date(e.dataHora).toLocaleString('pt-BR')}] D${e.diasInternacao} - ${e.medico}\nPA ${e.sinaisVitais.pa} | FC ${e.sinaisVitais.fc}\nS: ${e.subjetivo}\nO: ${e.objetivo}\nA: ${e.avaliacao}\nP: ${e.plano}\n`)
    ];

    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Barra de Ações (Oculta na impressão) */}
      <div className="no-print bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Prontuário Hospitalar Completo (Formato Físico A4)
          </h3>
          <p className="text-xs text-slate-500">
            Ficha admissional e linha do tempo de evoluções pronta para anexar à pasta física do leito
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyText}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copiado!' : 'Copiar Texto'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-lg transition-all shadow-xs flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Prontuário A4</span>
          </button>
        </div>
      </div>

      {/* FOLHA OFICIAL A4 FORMATADA (Com visual formal hospitalar) */}
      <div className="print-area bg-white mx-auto shadow-md border border-slate-300 rounded-none print:border-none print:shadow-none p-8 sm:p-10 max-w-[900px] text-slate-900 leading-normal text-xs font-serif relative overflow-hidden">
        {/* Marca d'água Hospitalar Oficial de Santa Maria do Pará */}
        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-[0.045] pointer-events-none select-none z-0">
          <img
            src="/assets/hospital_watermark.png"
            alt="Marca d'água Ordem Terceira Santa Maria"
            className="w-[480px] max-h-[480px] object-contain"
          />
        </div>

        <div className="relative z-10">
          {/* CABEÇALHO DO HOSPITAL */}
          <div className="border-b-2 border-slate-900 pb-3 mb-4 text-center">
            <div className="flex justify-center mb-2">
              <div className="h-14 w-14 rounded-xl border border-slate-200 p-1 bg-white flex items-center justify-center shadow-xs">
                <img
                  src="/assets/logo_hospital_white.png"
                  alt="Emblema Ordem Terceira Santa Maria"
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
            <h1 className="text-base sm:text-lg font-black uppercase tracking-wide text-slate-950 font-sans">
              {doctor.clinicName || 'HOSPITAL ORDEM TERCEIRA'}
            </h1>
          <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider font-sans">
            {doctor.razaoSocial || 'Venerável Ordem Terceira de São Francisco de Assis'}
          </p>
          <p className="text-[10px] text-slate-600 font-sans mt-0.5">
            {doctor.clinicAddress} • {doctor.clinicCityState} • Tel: {doctor.clinicPhone || '(91) 8814-1247'}
          </p>
          <div className="mt-1.5 inline-block border-y border-slate-900 py-0.5 px-4">
            <span className="text-xs font-black uppercase tracking-widest font-sans text-slate-900">
              PRONTUÁRIO CLÍNICO DE INTERNAÇÃO — ADMISSÃO E EVOLUÇÕES (SOAP)
            </span>
          </div>
        </div>

        {/* GRADE DE IDENTIFICAÇÃO DO PACIENTE */}
        <table className="w-full border-collapse border border-slate-900 text-[11px] font-sans mb-4">
          <tbody>
            <tr>
              <td colSpan={2} className="border border-slate-900 p-1.5">
                <span className="text-slate-500 font-normal">Nome do Paciente: </span>
                <span className="font-extrabold uppercase text-slate-950">{patient.name || 'NÃO INFORMADO'}</span>
              </td>
              <td className="border border-slate-900 p-1.5 w-[25%]">
                <span className="text-slate-500 font-normal">Prontuário: </span>
                <span className="font-bold">{patient.document || '—'}</span>
              </td>
              <td className="border border-slate-900 p-1.5 w-[20%]">
                <span className="text-slate-500 font-normal">Leito: </span>
                <span className="font-bold text-blue-950">{patient.bed || inpatientInfo.bed || '—'}</span>
              </td>
            </tr>
            <tr>
              <td className="border border-slate-900 p-1.5 w-[25%]">
                <span className="text-slate-500 font-normal">Idade: </span>
                <span className="font-bold">{patient.age || '—'}</span>
              </td>
              <td className="border border-slate-900 p-1.5 w-[25%]">
                <span className="text-slate-500 font-normal">Peso: </span>
                <span className="font-bold">{patient.weight ? `${patient.weight} kg` : '—'}</span>
              </td>
              <td className="border border-slate-900 p-1.5">
                <span className="text-slate-500 font-normal">Enfermaria: </span>
                <span className="font-bold">{patient.ward || inpatientInfo.ward || 'Enfermaria'}</span>
              </td>
              <td className="border border-slate-900 p-1.5">
                <span className="text-slate-500 font-normal">Data Admissão: </span>
                <span className="font-bold">{admissao.dataHoraAdmissao.replace('T', ' ')}</span>
              </td>
            </tr>
          </tbody>
        </table>

        {/* ======================================================== */}
        {/* 1. SEÇÃO ADMISSIONAL CONDENSADA                          */}
        {/* ======================================================== */}
        <div className="mb-6 space-y-3">
          <div className="bg-slate-100 border border-slate-900 px-2.5 py-1 flex items-center justify-between font-sans">
            <span className="font-black text-xs uppercase tracking-wide">
              1. FICHA CLÍNICA DE ADMISSÃO HOSPITALAR
            </span>
            <span className="text-[10px] text-slate-600 font-bold">
              Origem: {admissao.origem.toUpperCase().replace('_', ' ')}
            </span>
          </div>

          <div className="space-y-2 text-slate-800 text-[11px] leading-relaxed">
            <p>
              <strong className="font-sans font-bold text-slate-950">Queixa Principal (QP): </strong>
              {admissao.queixaPrincipal}
            </p>

            <p>
              <strong className="font-sans font-bold text-slate-950">História da Doença Atual (HDA): </strong>
              {admissao.hda}
            </p>

            <p>
              <strong className="font-sans font-bold text-slate-950">Antecedentes Pessoais (APP): </strong>
              {Object.entries(admissao.appCheckboxes)
                .filter(([_, v]) => v)
                .map(([k]) => k.toUpperCase())
                .join(', ') || 'Nenhum relatado'}
              {admissao.appOutros && ` • ${admissao.appOutros}`}
            </p>

            {/* Alergias */}
            <p>
              <strong className="font-sans font-bold text-slate-950">Alergias: </strong>
              {admissao.temAlergia === 'alergico' ? (
                <span className="bg-yellow-200 px-1 py-0.5 font-bold text-rose-950 border border-rose-400">
                  ⚠️ ALÉRGICO A: {admissao.alergiasDescricao}
                </span>
              ) : (
                <span className="text-slate-700">Não relata alergias medicamentosas</span>
              )}
            </p>

            {/* Sinais Vitais da Admissão */}
            <div className="border border-slate-400 p-2 bg-slate-50/50 font-sans text-[10.5px]">
              <strong className="block font-bold mb-0.5 text-slate-950">Sinais Vitais na Admissão:</strong>
              <span>PA: <strong>{admissao.sinaisVitais.pa || '-'} mmHg</strong></span>
              <span className="ml-3">FC: <strong>{admissao.sinaisVitais.fc || '-'} bpm</strong></span>
              <span className="ml-3">FR: <strong>{admissao.sinaisVitais.fr || '-'} ipm</strong></span>
              <span className="ml-3">SatO2: <strong>{admissao.sinaisVitais.spo2 || '-'}%</strong></span>
              <span className="ml-3">Temp: <strong>{admissao.sinaisVitais.temp || '-'} °C</strong></span>
              <span className="ml-3">Glicemia: <strong>{admissao.sinaisVitais.glicemia || '-'} mg/dL</strong></span>
              <span className="ml-3">Glasgow: <strong>{admissao.sinaisVitais.glasgow || '-'}</strong></span>
            </div>

            {/* Exame Segmentar */}
            <div className="space-y-1 text-[10.5px]">
              <p><strong>Exame Físico Geral: </strong>{admissao.exameSegmentar.geral}</p>
              <p><strong>Aparelho Cardiovascular (ACV): </strong>{admissao.exameSegmentar.acv}</p>
              <p><strong>Aparelho Respiratório (AR): </strong>{admissao.exameSegmentar.ar}</p>
              <p><strong>Abdome: </strong>{admissao.exameSegmentar.abdome}</p>
              <p><strong>Extremidades / Neurológico: </strong>{admissao.exameSegmentar.extremidadesNeuro}</p>
            </div>

            {/* Diagnósticos e Riscos */}
            <div className="pt-1 border-t border-slate-200 flex items-start justify-between gap-4 font-sans text-[10.5px] flex-wrap">
              <div>
                <strong>Hipóteses Diagnósticas (HD): </strong>
                {admissao.diagnosticos.map(d => `${d.cidCode ? d.cidCode + ' - ' : ''}${d.descricao}`).join('; ')}
              </div>
              <div className="text-slate-600">
                <span>Risco TEV: <strong>{admissao.riscos.riscoTev.toUpperCase()}</strong></span> •{' '}
                <span>Queda: <strong>{admissao.riscos.riscoQueda.toUpperCase()}</strong></span> •{' '}
                <span>Braden: <strong>{admissao.riscos.riscoLpp.toUpperCase()}</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. HISTÓRICO DE EVOLUÇÕES MÉDICAS (SOAP)                 */}
        {/* ======================================================== */}
        <div className="space-y-4">
          <div className="bg-slate-100 border border-slate-900 px-2.5 py-1 font-sans">
            <span className="font-black text-xs uppercase tracking-wide">
              2. EVOLUÇÕES MÉDICAS DIÁRIAS (SOAP) — LINHA DO TEMPO CRONOLÓGICA
            </span>
          </div>

          {evolucoes.length === 0 ? (
            <p className="italic text-slate-500 py-3 text-center">Nenhuma evolução diária registrada.</p>
          ) : (
            evolucoes.map(evo => (
              <div key={evo.id} className="border border-slate-400 p-3.5 space-y-2 break-inside-avoid">
                {/* Header da Evolução */}
                <div className="flex items-center justify-between border-b border-slate-300 pb-1 font-sans text-[11px]">
                  <div>
                    <span className="font-black text-slate-950 uppercase">
                      DIA {evo.diasInternacao} DE INTERNAÇÃO — {new Date(evo.dataHora).toLocaleString('pt-BR')}
                    </span>
                    <span className="ml-2 text-slate-600 font-semibold">({evo.leito})</span>
                  </div>
                  <div className="font-mono text-[10.5px] font-bold">
                    PA: {evo.sinaisVitais.pa || '-'} | FC: {evo.sinaisVitais.fc || '-'} | FR: {evo.sinaisVitais.fr || '-'} | Sat: {evo.sinaisVitais.spo2 || '-'}%
                  </div>
                </div>

                {/* Balanço Hídrico se houver */}
                {evo.balancoHidrico && (
                  <div className="font-sans text-[10px] text-slate-600 font-semibold">
                    Balanço Hídrico 24h: Entradas: +{evo.balancoHidrico.entradasMl} mL • Saídas: -{evo.balancoHidrico.saidasMl} mL • Final: <strong className="text-slate-950">{evo.balancoHidrico.balancoFinalMl}</strong>
                  </div>
                )}

                {/* Bloco SOAP */}
                <div className="space-y-1.5 text-[11px] leading-relaxed">
                  <p>
                    <strong className="font-sans font-bold text-amber-900">S (Subjetivo): </strong>
                    {evo.subjetivo}
                  </p>
                  <p>
                    <strong className="font-sans font-bold text-blue-900">O (Objetivo): </strong>
                    {evo.objetivo}
                  </p>
                  <p>
                    <strong className="font-sans font-bold text-purple-900">A (Avaliação): </strong>
                    {evo.avaliacao}
                  </p>
                  <p>
                    <strong className="font-sans font-bold text-emerald-900">P (Plano): </strong>
                    {evo.plano}
                  </p>
                </div>

                {/* Linha de Assinatura e Carimbo Médico */}
                <div className="pt-2 mt-2 border-t border-dashed border-slate-300 flex items-end justify-between font-sans text-[10px]">
                  <span className="text-slate-500">Documento clínico registrado no prontuário eletrônico hospitalar</span>
                  <div className="text-right">
                    <p className="font-bold text-slate-950 uppercase">{evo.medico}</p>
                    <p className="text-slate-600">{evo.crm}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* RODAPÉ DO PRONTUÁRIO */}
        <div className="pt-6 mt-8 border-t border-slate-300 text-center font-sans text-[10px] text-slate-500">
          <p>
            {doctor.clinicName} • Prontuário Médico do Paciente • Impresso em {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}
          </p>
        </div>
        </div>
      </div>
    </div>
  );
};
