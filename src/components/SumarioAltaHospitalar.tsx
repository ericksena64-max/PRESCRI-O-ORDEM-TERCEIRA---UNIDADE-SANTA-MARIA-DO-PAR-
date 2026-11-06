import React, { useState, useMemo } from 'react';
import {
  FileCheck,
  Printer,
  Sparkles,
  Plus,
  Trash2,
  Pill,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Sun,
  Sunset,
  Moon
} from 'lucide-react';
import {
  DoctorProfile,
  PatientInfo,
  InpatientInfo,
  InpatientItem,
  AihData
} from '../types';
import {
  buildDefaultAdmissao,
  buildDefaultEvolucoes,
  loadProntuarioFromStorage
} from '../data/prontuarioHospitalar';
import { findCidByCode, resolveCidAndDescription } from '../data/cid10';

export interface MedicamentoAltaItem {
  id: string;
  nome: string;
  apresentacao: string;
  via: 'Uso Oral' | 'Uso Subcutâneo' | 'Uso Tópico' | 'Uso Inalatório' | 'Uso Intramuscular';
  posologia: string;
  duracao: string;
  quantidadeTotal: string;
  horariosVisuais: {
    manha: boolean;
    tarde: boolean;
    noite: boolean;
    sos: boolean;
  };
  orientacaoEspecial?: string;
}

export const COMBOS_RECEITA_ALTA: {
  label: string;
  itens: Omit<MedicamentoAltaItem, 'id'>[];
}[] = [
  {
    label: 'Switch Oral Pneumonia (Amox+Clav)',
    itens: [
      {
        nome: 'Amoxicilina + Clavulanato de Potássio',
        apresentacao: '875mg + 125mg Comprimido',
        via: 'Uso Oral',
        posologia: 'Tomar 01 comprimido de 12 em 12 horas (às 08:00 e às 20:00), após as refeições.',
        duracao: 'Por 5 dias (completar 7 dias de tratamento total)',
        quantidadeTotal: '10 comprimidos (1 caixa)',
        horariosVisuais: { manha: true, tarde: false, noite: true, sos: false },
        orientacaoEspecial: 'Tomar junto com alimento para evitar desconforto gástrico.'
      },
      {
        nome: 'Dipirona Monoidratada',
        apresentacao: '500mg Comprimido',
        via: 'Uso Oral',
        posologia: 'Tomar 01 a 02 comprimidos até de 6 em 6 horas se dor ou febre (Tax >= 37.8°C).',
        duracao: 'Se necessário',
        quantidadeTotal: '01 cartela (10 comprimidos)',
        horariosVisuais: { manha: false, tarde: false, noite: false, sos: true }
      }
    ]
  },
  {
    label: 'Alta Pós-Operatório Cirurgia Geral',
    itens: [
      {
        nome: 'Dipirona Monoidratada',
        apresentacao: '1g Comprimido',
        via: 'Uso Oral',
        posologia: 'Tomar 01 comprimido de 6 em 6 horas nos primeiros 3 dias.',
        duracao: 'Por 3 a 5 dias',
        quantidadeTotal: '20 comprimidos',
        horariosVisuais: { manha: true, tarde: true, noite: true, sos: false }
      },
      {
        nome: 'Cetoprofeno',
        apresentacao: '100mg Comprimido Revestido',
        via: 'Uso Oral',
        posologia: 'Tomar 01 comprimido de 12 em 12 horas, logo após o café da manhã e jantar.',
        duracao: 'Por 3 dias',
        quantidadeTotal: '06 comprimidos',
        horariosVisuais: { manha: true, tarde: false, noite: true, sos: false },
        orientacaoEspecial: 'Não ultrapassar 3 dias de uso contínuo.'
      },
      {
        nome: 'Omeprazol',
        apresentacao: '20mg Cápsula',
        via: 'Uso Oral',
        posologia: 'Tomar 01 cápsula pela manhã, em jejum (30 minutos antes do café).',
        duracao: 'Enquanto usar o anti-inflamatório (5 dias)',
        quantidadeTotal: '01 caixa',
        horariosVisuais: { manha: true, tarde: false, noite: false, sos: false }
      }
    ]
  },
  {
    label: 'Alta Pielonefrite / ITU Complicada',
    itens: [
      {
        nome: 'Ciprofloxacino',
        apresentacao: '500mg Comprimido',
        via: 'Uso Oral',
        posologia: 'Tomar 01 comprimido de 12 em 12 horas (08:00 e 20:00).',
        duracao: 'Por 7 dias',
        quantidadeTotal: '14 comprimidos',
        horariosVisuais: { manha: true, tarde: false, noite: true, sos: false },
        orientacaoEspecial: 'Ingerir bastante água ao longo do dia.'
      }
    ]
  },
  {
    label: 'Desospitalização IC / HAS',
    itens: [
      {
        nome: 'Losartana Potássica',
        apresentacao: '50mg Comprimido',
        via: 'Uso Oral',
        posologia: 'Tomar 01 comprimido de 12 em 12 horas (08:00 e 20:00).',
        duracao: 'Uso Contínuo',
        quantidadeTotal: 'Uso Contínuo (60 comp/mês)',
        horariosVisuais: { manha: true, tarde: false, noite: true, sos: false }
      },
      {
        nome: 'Carvedilol',
        apresentacao: '12,5mg Comprimido',
        via: 'Uso Oral',
        posologia: 'Tomar 01 comprimido de 12 em 12 horas (08:00 e 20:00).',
        duracao: 'Uso Contínuo',
        quantidadeTotal: 'Uso Contínuo (60 comp/mês)',
        horariosVisuais: { manha: true, tarde: false, noite: true, sos: false }
      },
      {
        nome: 'Espironolactona',
        apresentacao: '25mg Comprimido',
        via: 'Uso Oral',
        posologia: 'Tomar 01 comprimido no almoço (às 12:00).',
        duracao: 'Uso Contínuo',
        quantidadeTotal: 'Uso Contínuo (30 comp/mês)',
        horariosVisuais: { manha: false, tarde: true, noite: false, sos: false }
      },
      {
        nome: 'Furosemida',
        apresentacao: '40mg Comprimido',
        via: 'Uso Oral',
        posologia: 'Tomar 01 comprimido às 08:00 da manhã.',
        duracao: 'Uso Contínuo',
        quantidadeTotal: 'Uso Contínuo (30 comp/mês)',
        horariosVisuais: { manha: true, tarde: false, noite: false, sos: false },
        orientacaoEspecial: 'Evitar tomar à noite para não prejudicar o sono.'
      }
    ]
  }
];

const TEMPLATES_SINAIS_ALARME = [
  {
    label: 'Infeccioso / Respiratório',
    texto:
      'Retornar imediatamente à Urgência/Pronto-Socorro em caso de: retorno da febre (Tax >= 37.8°C), falta de ar ou cansaço aos esforços, dor no peito, confusão mental/sonolência ou intolerância às medicações por via oral (vômitos persistentes).'
  },
  {
    label: 'Pós-Operatório Cirúrgico',
    texto:
      'Retornar imediatamente à Urgência em caso de: sangramento ou saída de secreção purulenta (pus) pela ferida operatória, vermelhidão/calor local intenso, febre, parada de eliminação de gases/fezes, vômitos ou dor abdominal intensa que não cede com analgésicos.'
  },
  {
    label: 'Cardiovascular / IC',
    texto:
      'Retornar imediatamente à Urgência em caso de: ganho rápido de peso (> 2kg em 3 dias), inchaço progressivo nas pernas, falta de ar ao deitar (necessidade de mais travesseiros), dor torácica, palpitações ou tontura/desmaio.'
  }
];

interface SumarioAltaHospitalarProps {
  doctor: DoctorProfile;
  patient: PatientInfo;
  inpatientInfo: InpatientInfo;
  inpatientItems?: InpatientItem[];
  aihData?: AihData;
}

export const SumarioAltaHospitalar: React.FC<SumarioAltaHospitalarProps> = ({
  doctor,
  patient,
  inpatientInfo,
  inpatientItems = [],
  aihData
}) => {
  const [abaAtiva, setAbaAtiva] = useState<'editor' | 'preview_sumario' | 'preview_receita'>('editor');
  const [modoImpressao, setModoImpressao] = useState<'ambos' | 'apenas_sumario' | 'apenas_receita'>('ambos');

  const nowLocalIso = useMemo(() => {
    const now = new Date();
    return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  }, []);

  const dataAdmissaoInicial = useMemo(() => {
    if (inpatientInfo.admissionDate) {
      return inpatientInfo.admissionDate.includes('T')
        ? inpatientInfo.admissionDate.slice(0, 16)
        : `${inpatientInfo.admissionDate}T08:00`;
    }
    return nowLocalIso;
  }, [inpatientInfo.admissionDate, nowLocalIso]);

  const [dataAdmissao, setDataAdmissao] = useState(dataAdmissaoInicial);
  const [dataAlta, setDataAlta] = useState(nowLocalIso);
  const [motivoSaidaSus, setMotivoSaidaSus] = useState('12 - Alta melhorado');
  const [cidPrincipalAlta, setCidPrincipalAlta] = useState<string>(
    aihData?.cid10Principal || inpatientInfo.cid?.code || ''
  );
  const [cidSecundarioAlta, setCidSecundarioAlta] = useState<string>(aihData?.cid10Secundario || '');
  const [diagnosticoDefinitivo, setDiagnosticoDefinitivo] = useState<string>(
    aihData?.diagnosticoInicial || inpatientInfo.diagnosis || inpatientInfo.cid?.description || ''
  );

  const [resumoClinicoEvolucao, setResumoClinicoEvolucao] = useState('');
  const [procedimentosTerapeutica, setProcedimentosTerapeutica] = useState('');
  const [comparativoExames, setComparativoExames] = useState('');
  const [condicaoSaida, setCondicaoSaida] = useState(
    'BEG, lúcido e orientado (LOTE), afebril, eupneico em ar ambiente, hemodinamicamente estável, aceitando dieta por via oral e deambulando.'
  );
  const [orientacoesDieteticasGerais, setOrientacoesDieteticasGerais] = useState(
    'Dieta oral livre conforme tolerância, hidratação oral vigorosa e repouso relativo domiciliar.'
  );
  const [sinaisAlarme, setSinaisAlarme] = useState(TEMPLATES_SINAIS_ALARME[0].texto);
  const [encaminhamentoRetorno, setEncaminhamentoRetorno] = useState(
    'Retorno na Unidade Básica de Saúde (UBS / ESF de referência) em 7 a 10 dias com este Sumário de Alta para reavaliação clínica e continuidade do cuidado longitudinal.'
  );

  // Estados do Receituário de Alta
  const [itensReceita, setItensReceita] = useState<MedicamentoAltaItem[]>([]);
  const [novoMedNome, setNovoMedNome] = useState('');
  const [novoMedApres, setNovoMedApres] = useState('');
  const [novoMedVia, setNovoMedVia] = useState<MedicamentoAltaItem['via']>('Uso Oral');
  const [novoMedPosologia, setNovoMedPosologia] = useState('');
  const [novoMedDuracao, setNovoMedDuracao] = useState('');
  const [novoMedQtd, setNovoMedQtd] = useState('');
  const [novoMedHorarios, setNovoMedHorarios] = useState({
    manha: true,
    tarde: false,
    noite: true,
    sos: false
  });
  const [feedbackConsolidado, setFeedbackConsolidado] = useState(false);

  // Cálculo automático de Dias de Internação
  const diasPermanencia = useMemo(() => {
    const dtAdm = new Date(dataAdmissao);
    const dtAlt = new Date(dataAlta);
    if (isNaN(dtAdm.getTime()) || isNaN(dtAlt.getTime())) return 1;
    const diffMs = dtAlt.getTime() - dtAdm.getTime();
    return Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  }, [dataAdmissao, dataAlta]);

  // Consolidar Tudo em 1 Clique a partir do Prontuário / AIH / Prescrição do paciente atual
  const consolidarDadosProntuario = () => {
    const patientKey = patient.document || patient.name || 'default';
    const loaded = loadProntuarioFromStorage(
      patientKey,
      buildDefaultAdmissao(patient, doctor, inpatientInfo),
      buildDefaultEvolucoes(patient, doctor, inpatientInfo)
    );
    const adm = loaded.admissao;
    const evos = loaded.evolucoes;

    if (adm.dataHoraAdmissao) {
      setDataAdmissao(adm.dataHoraAdmissao);
    }

    const diagAdm = adm.diagnosticos[0];
    if (diagAdm?.cidCode && !cidPrincipalAlta) {
      setCidPrincipalAlta(diagAdm.cidCode);
    }
    if (diagAdm?.descricao && !diagnosticoDefinitivo) {
      setDiagnosticoDefinitivo(diagAdm.descricao);
    }
    if (aihData?.cid10Principal && !cidPrincipalAlta) {
      setCidPrincipalAlta(aihData.cid10Principal);
    }
    if (aihData?.diagnosticoInicial && !diagnosticoDefinitivo) {
      setDiagnosticoDefinitivo(aihData.diagnosticoInicial);
    }

    const partesResumo: string[] = [];
    if (adm.queixaPrincipal) {
      partesResumo.push(`Queixa Admissional: ${adm.queixaPrincipal}.`);
    }
    if (adm.hda) {
      partesResumo.push(`HDA: ${adm.hda}`);
    } else if (aihData?.principaisSinaisSintomas) {
      partesResumo.push(aihData.principaisSinaisSintomas);
    }
    if (evos.length > 0) {
      const ultimaEvo = evos[0];
      if (ultimaEvo.avaliacao) {
        partesResumo.push(`Evolução na Enfermaria: ${ultimaEvo.avaliacao}`);
      }
    }
    if (partesResumo.length > 0) {
      setResumoClinicoEvolucao(partesResumo.join('\n\n'));
    }

    const partesTerapeutica: string[] = [];
    if (aihData?.codigoProcedimento || aihData?.descricaoProcedimentoSolicitado) {
      partesTerapeutica.push(
        `Procedimento SUS: ${aihData.codigoProcedimento || ''} ${aihData.descricaoProcedimentoSolicitado || ''}`.trim()
      );
    }
    const atbs = inpatientItems.filter(i => i.category === 'antibiotico');
    if (atbs.length > 0) {
      partesTerapeutica.push(
        `Antibioticoterapia Hospitalar: ${atbs.map(a => `${a.name} ${a.dose} ${a.route} ${a.frequency}`).join(' + ')}`
      );
    }
    if (partesTerapeutica.length > 0) {
      setProcedimentosTerapeutica(partesTerapeutica.join('\n'));
    }

    if (aihData?.resultadosProvasDiagnosticas || aihData?.examesLaboratoriais) {
      setComparativoExames(
        [aihData.resultadosProvasDiagnosticas, aihData.examesLaboratoriais].filter(Boolean).join('\n')
      );
    }

    setFeedbackConsolidado(true);
    setTimeout(() => setFeedbackConsolidado(false), 3000);
  };

  const aplicarComboReceita = (itensCombo: Omit<MedicamentoAltaItem, 'id'>[]) => {
    const novos: MedicamentoAltaItem[] = itensCombo.map((item, idx) => ({
      ...item,
      id: `med-${Date.now()}-${idx}`
    }));
    setItensReceita(prev => [...prev, ...novos]);
  };

  const adicionarMedicamentoManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoMedNome.trim() || !novoMedPosologia.trim()) return;

    const novo: MedicamentoAltaItem = {
      id: `med-${Date.now()}`,
      nome: novoMedNome.trim(),
      apresentacao: novoMedApres.trim() || 'Comprimido',
      via: novoMedVia,
      posologia: novoMedPosologia.trim(),
      duracao: novoMedDuracao.trim() || 'Conforme orientação',
      quantidadeTotal: novoMedQtd.trim() || '01 caixa',
      horariosVisuais: { ...novoMedHorarios }
    };

    setItensReceita([...itensReceita, novo]);
    setNovoMedNome('');
    setNovoMedApres('');
    setNovoMedPosologia('');
    setNovoMedDuracao('');
    setNovoMedQtd('');
  };

  const removerMedicamento = (id: string) => {
    setItensReceita(itensReceita.filter(m => m.id !== id));
  };

  const acionarImpressao = (modo: 'ambos' | 'apenas_sumario' | 'apenas_receita') => {
    setModoImpressao(modo);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const nomeEstabelecimento =
    aihData?.estabelecimentoSolicitante || doctor.clinicName || 'SANTA CASA DE MISERICÓRDIA / HOSPITAL ORDEM TERCEIRA';
  const cnesEstabelecimento = aihData?.cnesSolicitante || doctor.cnes || '2332156';
  const municipioEstabelecimento = doctor.clinicCityState || 'Belém - PA';

  return (
    <div className="w-full space-y-5 text-slate-800">
      {/* BARRA DE TOPO E AÇÕES RÁPIDAS (OCULTA NA IMPRESSÃO) */}
      <div className="no-print print:hidden flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-xs">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900">
              Sumário de Alta Hospitalar & Receituário de Desospitalização
            </h2>
            <p className="text-xs text-slate-500">
              Fechamento clínico da internação, contrarreferência APS/UBS e geração integrada da Receita Domiciliar
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={consolidarDadosProntuario}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            Consolidar Dados da Internação
          </button>

          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setAbaAtiva('editor')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
                abaAtiva === 'editor'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Editor Integrado
            </button>
            <button
              type="button"
              onClick={() => setAbaAtiva('preview_sumario')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
                abaAtiva === 'preview_sumario'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Ver Sumário A4
            </button>
            <button
              type="button"
              onClick={() => setAbaAtiva('preview_receita')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
                abaAtiva === 'preview_receita'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Ver Receita A4 ({itensReceita.length})
            </button>
          </div>

          <button
            type="button"
            onClick={() => acionarImpressao('ambos')}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Imprimir Kit de Alta (Sumário + Receita)
          </button>
        </div>
      </div>

      {feedbackConsolidado && (
        <div className="no-print print:hidden p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          Dados da Admissão, Evoluções SOAP, Prescrição e Laudo AIH consolidados no Sumário de Alta!
        </div>
      )}

      {/* ========================================================= */}
      {/* MODO EDITOR: 2 COLUNAS (SUMÁRIO À ESQ / RECEITA À DIR)    */}
      {/* ========================================================= */}
      {abaAtiva === 'editor' && (
        <div className="no-print print:hidden grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* COLUNA ESQUERDA (7 COLUNAS): DADOS DO SUMÁRIO DE ALTA */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 space-y-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                1. Dados de Desfecho e Resumo da Internação
              </h3>
              <span className="text-xs font-bold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full border border-blue-200">
                Permanência: {diasPermanencia} {diasPermanencia === 1 ? 'dia' : 'dias'}
              </span>
            </div>

            {/* Datas e Motivo de Saída SIHD/SUS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                  Data/Hora da Admissão
                </label>
                <input
                  type="datetime-local"
                  value={dataAdmissao}
                  onChange={e => setDataAdmissao(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-xs text-slate-700 font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                  Data/Hora da Alta *
                </label>
                <input
                  type="datetime-local"
                  value={dataAlta}
                  onChange={e => setDataAlta(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                  Motivo de Encerramento (SUS) *
                </label>
                <select
                  value={motivoSaidaSus}
                  onChange={e => setMotivoSaidaSus(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-xs font-semibold"
                >
                  <option value="12 - Alta melhorado">12 - Alta melhorado</option>
                  <option value="11 - Alta curado">11 - Alta curado</option>
                  <option value="15 - Alta com previsão de retorno">15 - Alta c/ previsão de retorno</option>
                  <option value="14 - Alta a pedido">14 - Alta a pedido (Termo assinado)</option>
                  <option value="31 - Transferência p/ outro hospital">31 - Transferência externa</option>
                </select>
              </div>
            </div>

            {/* Diagnósticos e CIDs de Alta */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Diagnóstico Definitivo de Alta *
                </label>
                <input
                  type="text"
                  value={diagnosticoDefinitivo}
                  onChange={e => {
                    const val = e.target.value;
                    setDiagnosticoDefinitivo(val);
                    const matched = resolveCidAndDescription(val);
                    if (matched) {
                      setCidPrincipalAlta(matched.code);
                    }
                  }}
                  onBlur={e => {
                    const matched = resolveCidAndDescription(e.target.value);
                    if (matched) {
                      setCidPrincipalAlta(matched.code);
                    }
                  }}
                  placeholder="Diagnóstico principal no encerramento (ex: Pneumonia não especificada)"
                  className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  CID-10 Principal *
                </label>
                <input
                  type="text"
                  value={cidPrincipalAlta}
                  onChange={e => {
                    const val = e.target.value.toUpperCase();
                    setCidPrincipalAlta(val);
                    const resolved = findCidByCode(val);
                    if (resolved && (!diagnosticoDefinitivo || diagnosticoDefinitivo === 'Diagnóstico Clínico')) {
                      setDiagnosticoDefinitivo(resolved.description);
                    }
                  }}
                  onBlur={e => {
                    const resolved = findCidByCode(e.target.value);
                    if (resolved) {
                      setCidPrincipalAlta(resolved.code);
                      setDiagnosticoDefinitivo(resolved.description);
                    }
                  }}
                  placeholder="Ex: J18.9"
                  className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold uppercase"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  CID-10 Secundário
                </label>
                <input
                  type="text"
                  value={cidSecundarioAlta}
                  onChange={e => setCidSecundarioAlta(e.target.value.toUpperCase())}
                  onBlur={e => {
                    const resolved = findCidByCode(e.target.value);
                    if (resolved) {
                      setCidSecundarioAlta(resolved.code);
                    }
                  }}
                  placeholder="Ex: I10"
                  className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-mono uppercase"
                />
              </div>
            </div>

            {/* Resumo Clínico e Evolução no Leito */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                Resumo da História Clínica e Evolução na Enfermaria *
              </label>
              <textarea
                rows={4}
                value={resumoClinicoEvolucao}
                onChange={e => setResumoClinicoEvolucao(e.target.value)}
                placeholder=""
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs leading-relaxed"
              />
            </div>

            {/* Terapêutica Hospitalar Realizada */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                Procedimentos, Cirurgias e Antibióticos Realizados na Internação
              </label>
              <textarea
                rows={2}
                value={procedimentosTerapeutica}
                onChange={e => setProcedimentosTerapeutica(e.target.value)}
                placeholder=""
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs"
              />
            </div>

            {/* Exames Relevantes (Admissão vs Alta) */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                Resumo de Exames Complementares (Admissão × Pré-Alta)
              </label>
              <textarea
                rows={3}
                value={comparativoExames}
                onChange={e => setComparativoExames(e.target.value)}
                placeholder=""
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs font-mono"
              />
            </div>

            {/* Condição Clínica na Saída */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                Exame Físico e Condição Clínica no Momento da Alta
              </label>
              <textarea
                rows={2}
                value={condicaoSaida}
                onChange={e => setCondicaoSaida(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs"
              />
            </div>

            {/* Sinais de Alarme e Contrarreferência */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                  <label className="text-xs font-bold text-red-800 uppercase flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                    Orientações de Sinais de Alarme (Quando retornar ao Pronto-Socorro)
                  </label>
                  <div className="flex gap-1 flex-wrap">
                    {TEMPLATES_SINAIS_ALARME.map((t, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSinaisAlarme(t.texto)}
                        className="text-[10px] font-semibold bg-red-50 hover:bg-red-100 text-red-700 px-2 py-0.5 rounded border border-red-200 transition cursor-pointer"
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  rows={2}
                  value={sinaisAlarme}
                  onChange={e => setSinaisAlarme(e.target.value)}
                  className="w-full border border-red-200 bg-red-50/20 rounded-lg p-2.5 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                  Plano de Seguimento / Contrarreferência (APS / UBS / Ambulatório)
                </label>
                <textarea
                  rows={2}
                  value={encaminhamentoRetorno}
                  onChange={e => setEncaminhamentoRetorno(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs"
                />
              </div>
            </div>
          </div>

          {/* COLUNA DIREITA (5 COLUNAS): GERADOR DE RECEITA PARA CASA */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 flex flex-col gap-4 h-fit shadow-xs">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Pill className="w-4 h-4 text-emerald-600" />
                2. Receituário Domiciliar (Sincronizado com o Sumário)
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Os medicamentos abaixo saem tanto no corpo do Sumário de Alta quanto na folha de Receita Médica do paciente.
              </p>
            </div>

            {/* Botões de Combos Rápidos de Desospitalização */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1.5">
                Protocolos Rápidos de Transição (1 Clique):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {COMBOS_RECEITA_ALTA.map((combo, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => aplicarComboReceita(combo.itens)}
                    className="text-[11px] font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-md transition cursor-pointer"
                  >
                    + {combo.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Formulário Rápido para Adicionar Medicamento */}
            <form
              onSubmit={adicionarMedicamentoManual}
              className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5"
            >
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-7">
                  <input
                    type="text"
                    placeholder="Nome do Fármaco (ex: Amoxicilina)"
                    value={novoMedNome}
                    onChange={e => setNovoMedNome(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold"
                  />
                </div>
                <div className="col-span-5">
                  <input
                    type="text"
                    placeholder="Dose/Apres (ex: 500mg Comp)"
                    value={novoMedApres}
                    onChange={e => setNovoMedApres(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-5">
                  <select
                    value={novoMedVia}
                    onChange={e => setNovoMedVia(e.target.value as MedicamentoAltaItem['via'])}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-xs"
                  >
                    <option value="Uso Oral">Uso Oral</option>
                    <option value="Uso Subcutâneo">Uso Subcutâneo</option>
                    <option value="Uso Tópico">Uso Tópico</option>
                    <option value="Uso Inalatório">Uso Inalatório</option>
                    <option value="Uso Intramuscular">Uso Intramuscular</option>
                  </select>
                </div>
                <div className="col-span-7">
                  <input
                    type="text"
                    placeholder="Posologia (ex: Tomar 01 comp de 8/8h)"
                    value={novoMedPosologia}
                    onChange={e => setNovoMedPosologia(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Duração (ex: Por 7 dias)"
                  value={novoMedDuracao}
                  onChange={e => setNovoMedDuracao(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs"
                />
                <input
                  type="text"
                  placeholder="Quantidade (ex: 21 comp)"
                  value={novoMedQtd}
                  onChange={e => setNovoMedQtd(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs"
                />
              </div>

              {/* Seletores Visuais de Período do Dia */}
              <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      setNovoMedHorarios({ ...novoMedHorarios, manha: !novoMedHorarios.manha })
                    }
                    className={`px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 border transition cursor-pointer ${
                      novoMedHorarios.manha
                        ? 'bg-amber-100 border-amber-400 text-amber-900'
                        : 'bg-white border-slate-200 text-slate-400'
                    }`}
                  >
                    <Sun className="w-3 h-3" /> Manhã
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setNovoMedHorarios({ ...novoMedHorarios, tarde: !novoMedHorarios.tarde })
                    }
                    className={`px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 border transition cursor-pointer ${
                      novoMedHorarios.tarde
                        ? 'bg-orange-100 border-orange-400 text-orange-900'
                        : 'bg-white border-slate-200 text-slate-400'
                    }`}
                  >
                    <Sunset className="w-3 h-3" /> Tarde
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setNovoMedHorarios({ ...novoMedHorarios, noite: !novoMedHorarios.noite })
                    }
                    className={`px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 border transition cursor-pointer ${
                      novoMedHorarios.noite
                        ? 'bg-indigo-100 border-indigo-400 text-indigo-900'
                        : 'bg-white border-slate-200 text-slate-400'
                    }`}
                  >
                    <Moon className="w-3 h-3" /> Noite
                  </button>
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Incluir
                </button>
              </div>
            </form>

            {/* Lista de Medicamentos da Receita */}
            <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
              {itensReceita.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                  Nenhum medicamento adicionado à receita domiciliar.
                </div>
              ) : (
                itensReceita.map((med, index) => (
                  <div
                    key={med.id}
                    className="p-3 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition flex items-start justify-between gap-2"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                          {index + 1}
                        </span>
                        <span className="font-bold text-xs text-slate-900">
                          {med.nome} — {med.apresentacao}
                        </span>
                        <span className="text-[10px] font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                          {med.quantidadeTotal}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 pl-7">{med.posologia}</p>
                      <div className="flex items-center gap-2 pl-7 pt-0.5 flex-wrap">
                        <span className="text-[10px] font-semibold text-slate-500">
                          {med.duracao}
                        </span>
                        {med.horariosVisuais.manha && (
                          <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">
                            ☀️ Manhã
                          </span>
                        )}
                        {med.horariosVisuais.tarde && (
                          <span className="text-[10px] bg-orange-100 text-orange-800 px-1.5 py-0.5 rounded font-bold">
                            🌤️ Tarde
                          </span>
                        )}
                        {med.horariosVisuais.noite && (
                          <span className="text-[10px] bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded font-bold">
                            🌙 Noite
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removerMedicamento(med.id)}
                      className="text-slate-400 hover:text-red-600 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DOCUMENTO 1: SUMÁRIO DE ALTA HOSPITALAR A4 (VISÍVEL NO PREVIEW OU PRINT) */}
      {/* ========================================================================= */}
      <div
        className={`${
          abaAtiva === 'preview_sumario'
            ? 'block'
            : modoImpressao !== 'apenas_receita'
            ? 'hidden print:block'
            : 'hidden'
        } ${
          modoImpressao === 'ambos' ? 'print:break-after-page' : ''
        } bg-white border border-slate-300 p-6 max-w-[210mm] mx-auto text-black font-sans text-xs leading-snug shadow-md print:shadow-none print:border-none print:p-0`}
      >
        {/* CABEÇALHO DO SUMÁRIO */}
        <div className="border-2 border-black p-3 mb-3 flex items-center justify-between">
          <div>
            <p className="font-black text-sm uppercase">{nomeEstabelecimento}</p>
            <p className="text-[10px] font-semibold uppercase">
              CNES: {cnesEstabelecimento} — {municipioEstabelecimento}
            </p>
          </div>
          <div className="text-right">
            <span className="inline-block border-2 border-black px-2.5 py-1 font-black text-xs uppercase tracking-wider">
              Sumário de Alta Hospitalar
            </span>
          </div>
        </div>

        {/* IDENTIFICAÇÃO DO PACIENTE E INTERNAÇÃO */}
        <div className="border-2 border-black mb-3">
          <div className="grid grid-cols-12 divide-x divide-black border-b border-black">
            <div className="col-span-6 p-1.5">
              <span className="block text-[9px] font-bold uppercase text-neutral-600">Paciente</span>
              <span className="font-bold uppercase text-xs">{patient.name || '______________________'}</span>
            </div>
            <div className="col-span-3 p-1.5">
              <span className="block text-[9px] font-bold uppercase text-neutral-600">
                Cartão SUS (CNS)
              </span>
              <span className="font-mono font-bold">{patient.cns || aihData?.cnsPaciente || '-'}</span>
            </div>
            <div className="col-span-3 p-1.5">
              <span className="block text-[9px] font-bold uppercase text-neutral-600">
                Prontuário / Documento
              </span>
              <span className="font-mono font-bold">{patient.document || aihData?.numeroProntuario || '-'}</span>
            </div>
          </div>

          <div className="grid grid-cols-12 divide-x divide-black">
            <div className="col-span-3 p-1.5">
              <span className="block text-[9px] font-bold uppercase text-neutral-600">
                Data da Admissão
              </span>
              <span className="font-bold">
                {new Date(dataAdmissao).toLocaleString('pt-BR', {
                  dateStyle: 'short',
                  timeStyle: 'short'
                })}
              </span>
            </div>
            <div className="col-span-3 p-1.5">
              <span className="block text-[9px] font-bold uppercase text-neutral-600">
                Data da Alta
              </span>
              <span className="font-bold">
                {new Date(dataAlta).toLocaleString('pt-BR', {
                  dateStyle: 'short',
                  timeStyle: 'short'
                })}
              </span>
            </div>
            <div className="col-span-2 p-1.5">
              <span className="block text-[9px] font-bold uppercase text-neutral-600">
                Permanência
              </span>
              <span className="font-bold">{diasPermanencia} dias</span>
            </div>
            <div className="col-span-4 p-1.5">
              <span className="block text-[9px] font-bold uppercase text-neutral-600">
                Modalidade da Alta
              </span>
              <span className="font-bold uppercase">{motivoSaidaSus}</span>
            </div>
          </div>
        </div>

        {/* DIAGNÓSTICOS */}
        <div className="border-2 border-black mb-3">
          <div className="bg-neutral-200 border-b border-black px-2 py-0.5 font-bold uppercase text-[10px]">
            1. Diagnóstico Definitivo e Codificação CID-10
          </div>
          <div className="grid grid-cols-12 divide-x divide-black">
            <div className="col-span-8 p-1.5">
              <span className="block text-[9px] font-bold uppercase text-neutral-600">
                Diagnóstico Principal na Alta
              </span>
              <span className="font-bold uppercase">{diagnosticoDefinitivo || '-'}</span>
            </div>
            <div className="col-span-2 p-1.5">
              <span className="block text-[9px] font-bold uppercase text-neutral-600">
                CID-10 Principal
              </span>
              <span className="font-mono font-bold text-sm">{cidPrincipalAlta || '-'}</span>
            </div>
            <div className="col-span-2 p-1.5">
              <span className="block text-[9px] font-bold uppercase text-neutral-600">
                CID-10 Secundário
              </span>
              <span className="font-mono font-bold text-sm">{cidSecundarioAlta || '-'}</span>
            </div>
          </div>
        </div>

        {/* RESUMO CLÍNICO E TERAPÊUTICA */}
        <div className="border-2 border-black mb-3">
          <div className="bg-neutral-200 border-b border-black px-2 py-0.5 font-bold uppercase text-[10px]">
            2. Resumo Clínico, Evolução e Terapêutica Realizada na Internação
          </div>
          <div className="p-2 border-b border-black whitespace-pre-line min-h-[48px]">
            {resumoClinicoEvolucao}
          </div>
          <div className="p-2 bg-neutral-50 whitespace-pre-line font-medium">
            {procedimentosTerapeutica || 'Tratamento clínico de suporte realizado.'}
          </div>
        </div>

        {/* EXAMES COMPLEMENTARES */}
        <div className="border-2 border-black mb-3">
          <div className="bg-neutral-200 border-b border-black px-2 py-0.5 font-bold uppercase text-[10px]">
            3. Exames Complementares Relevantes (Admissão × Pré-Alta)
          </div>
          <div className="p-2 font-mono text-[10.5px] whitespace-pre-line">
            {comparativoExames || 'Sem exames registrados.'}
          </div>
        </div>

        {/* MEDICAÇÕES PRESCRITAS PARA CASA (RESUMO NO SUMÁRIO) */}
        <div className="border-2 border-black mb-3">
          <div className="bg-neutral-200 border-b border-black px-2 py-0.5 font-bold uppercase text-[10px]">
            4. Conciliação Medicamentosa para Uso Domiciliar (Receita Entregue)
          </div>
          <div className="p-2">
            {itensReceita.length === 0 ? (
              <p>Manter medicações habituais conforme orientação ambulatorial.</p>
            ) : (
              <ul className="list-decimal list-inside space-y-1">
                {itensReceita.map(m => (
                  <li key={m.id}>
                    <span className="font-bold">
                      {m.nome} ({m.apresentacao}):
                    </span>{' '}
                    {m.posologia} — <em>({m.duracao})</em>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* CONDIÇÃO DE SAÍDA, SINAIS DE ALARME E CONTRARREFERÊNCIA */}
        <div className="border-2 border-black mb-4">
          <div className="bg-neutral-200 border-b border-black px-2 py-0.5 font-bold uppercase text-[10px]">
            5. Condição de Alta, Sinais de Alarme e Contrarreferência (APS / UBS)
          </div>
          <div className="p-2 border-b border-black">
            <span className="font-bold uppercase text-[10px] block">Condição Clínica na Saída:</span>
            <p>{condicaoSaida}</p>
          </div>
          <div className="p-2 border-b border-black">
            <span className="font-bold uppercase text-[10px] block">
              Orientações Gerais e Sinais de Alarme (Retorno Imediato):
            </span>
            <p className="mb-1">{orientacoesDieteticasGerais}</p>
            <p className="font-semibold">{sinaisAlarme}</p>
          </div>
          <div className="p-2">
            <span className="font-bold uppercase text-[10px] block">
              Encaminhamento / Seguimento Pós-Alta (Contrarreferência):
            </span>
            <p>{encaminhamentoRetorno}</p>
          </div>
        </div>

        {/* ASSINATURAS */}
        <div className="grid grid-cols-2 gap-8 pt-6 text-center">
          <div className="border-t border-black pt-1">
            <p className="font-bold uppercase">{doctor.fullName}</p>
            <p className="text-[10px]">
              Médico Assistente — CRM-{doctor.uf} {doctor.crm}
            </p>
          </div>
          <div className="border-t border-black pt-1">
            <p className="font-bold uppercase">Ciente do Paciente / Responsável</p>
            <p className="text-[10px]">Recebi a 1ª via deste Sumário e a Receita Médica orientada</p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* DOCUMENTO 2: RECEITUÁRIO DOMICILIAR DE ALTA A4 (FOLHA EXCLUSIVA PACIENTE) */}
      {/* ========================================================================= */}
      <div
        className={`${
          abaAtiva === 'preview_receita'
            ? 'block'
            : modoImpressao !== 'apenas_sumario'
            ? 'hidden print:block'
            : 'hidden'
        } bg-white border border-slate-300 p-6 max-w-[210mm] mx-auto text-black font-sans text-xs leading-normal shadow-md print:shadow-none print:border-none print:p-0`}
      >
        {/* CABEÇALHO DA RECEITA */}
        <div className="border-b-2 border-black pb-3 mb-4 flex items-center justify-between">
          <div>
            <p className="font-black text-base uppercase">{nomeEstabelecimento}</p>
            <p className="text-[11px] font-semibold">
              {municipioEstabelecimento} — CNES {cnesEstabelecimento}
            </p>
          </div>
          <div className="text-right">
            <span className="border-2 border-black px-3 py-1 font-black text-sm uppercase">
              Receituário de Alta
            </span>
          </div>
        </div>

        {/* PACIENTE */}
        <div className="bg-neutral-100 border border-black p-2.5 mb-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase block text-neutral-600">Paciente:</span>
            <span className="font-black text-sm uppercase">{patient.name || '______________________'}</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold uppercase block text-neutral-600">Data da Emissão:</span>
            <span className="font-bold text-xs">
              {new Date(dataAlta).toLocaleDateString('pt-BR')}
            </span>
          </div>
        </div>

        {/* LISTA DE MEDICAMENTOS FORMATADA PARA FÁCIL LEITURA DO PACIENTE */}
        <div className="space-y-4 min-h-[450px]">
          {itensReceita.map((med, idx) => (
            <div key={med.id} className="border border-black rounded p-3">
              <div className="flex items-center justify-between border-b border-dashed border-neutral-400 pb-1.5 mb-2">
                <div className="font-black text-sm">
                  {idx + 1}. {med.nome} ({med.apresentacao}) — <span className="underline">{med.via}</span>
                </div>
                <div className="font-bold text-xs bg-neutral-200 px-2 py-0.5 rounded border border-black">
                  Qtd: {med.quantidadeTotal}
                </div>
              </div>

              <p className="text-sm font-semibold mb-1.5">{med.posologia}</p>

              <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1">
                <span className="font-bold">Duração: {med.duracao}</span>
                <div className="flex items-center gap-2 font-bold">
                  {med.horariosVisuais.manha && (
                    <span className="border border-black px-2 py-0.5 rounded">☀️ MANHÃ</span>
                  )}
                  {med.horariosVisuais.tarde && (
                    <span className="border border-black px-2 py-0.5 rounded">🌤️ TARDE</span>
                  )}
                  {med.horariosVisuais.noite && (
                    <span className="border border-black px-2 py-0.5 rounded">🌙 NOITE</span>
                  )}
                  {med.horariosVisuais.sos && (
                    <span className="border border-black px-2 py-0.5 rounded">⚠️ SE DOR OU FEBRE</span>
                  )}
                </div>
              </div>

              {med.orientacaoEspecial && (
                <p className="text-[11px] italic mt-1.5 text-neutral-700">
                  Obs: {med.orientacaoEspecial}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* QUADRO RESUMO DE CUIDADOS E ALERTA NO RODAPÉ DA RECEITA */}
        <div className="border-2 border-black p-2.5 mt-6 mb-8 bg-neutral-50">
          <p className="font-bold uppercase text-[10px] mb-1">
            ⚠️ Atenção — Sinais de Alerta para Retorno ao Hospital:
          </p>
          <p className="text-[11px]">{sinaisAlarme}</p>
        </div>

        {/* ASSINATURA DO MÉDICO */}
        <div className="w-72 mx-auto text-center border-t border-black pt-1.5">
          <p className="font-bold uppercase text-xs">{doctor.fullName}</p>
          <p className="text-[11px]">
            CRM-{doctor.uf} {doctor.crm}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SumarioAltaHospitalar;
