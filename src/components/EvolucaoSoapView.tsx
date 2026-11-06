import React, { useState } from 'react';
import {
  Clock,
  Plus,
  Save,
  Copy,
  Trash2,
  Droplets,
  CheckCircle2,
  Sparkles,
  Stethoscope
} from 'lucide-react';
import { EvolucaoSoapItem, SinaisVitaisAdmissao, DoctorProfile, PatientInfo } from '../types';
import { EVOLUCAO_ESTAVEL_TEMPLATE } from '../data/prontuarioHospitalar';

interface EvolucaoSoapViewProps {
  evolucoes: EvolucaoSoapItem[];
  onChangeEvolucoes: (updated: EvolucaoSoapItem[]) => void;
  doctor: DoctorProfile;
  patient: PatientInfo;
}

export const EvolucaoSoapView: React.FC<EvolucaoSoapViewProps> = ({
  evolucoes,
  onChangeEvolucoes,
  doctor,
  patient
}) => {
  const [selecionadoId, setSelecionadoId] = useState<string | null>(
    evolucoes.length > 0 ? evolucoes[0].id : null
  );
  const [isNovoModo, setIsNovoModo] = useState(false);

  // Form State para Nova Evolução
  const [subjetivo, setSubjetivo] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [avaliacao, setAvaliacao] = useState('');
  const [plano, setPlano] = useState('');
  const [sinaisVitais, setSinaisVitais] = useState<SinaisVitaisAdmissao>({
    pa: '120x80',
    fc: '78',
    fr: '16',
    spo2: '98',
    temp: '36.5',
    glicemia: '105',
    glasgow: '15'
  });
  const [entradasMl, setEntradasMl] = useState('1800');
  const [saidasMl, setSaidasMl] = useState('1500');
  const [evaDor, setEvaDor] = useState('0');
  const [salvoFeedback, setSalvoFeedback] = useState(false);

  // Calcula balanço hídrico final
  const calcBalanco = () => {
    const e = parseFloat(entradasMl) || 0;
    const s = parseFloat(saidasMl) || 0;
    const b = e - s;
    return b >= 0 ? `+${b} mL` : `${b} mL`;
  };

  const evolucaoAtiva = evolucoes.find(e => e.id === selecionadoId);

  const iniciarNovaEvolucao = () => {
    setIsNovoModo(true);
    setSelecionadoId(null);
    setSubjetivo('');
    setObjetivo('');
    setAvaliacao('');
    setPlano('');
    setEvaDor('0');
  };

  // Clona a última evolução registrada para economizar tempo de digitação
  const clonarUltimaEvolucao = () => {
    if (evolucoes.length === 0) return;
    const ultima = evolucoes[0];

    setIsNovoModo(true);
    setSelecionadoId(null);
    setSubjetivo(ultima.subjetivo);
    setObjetivo(ultima.objetivo);
    setAvaliacao(ultima.avaliacao);
    setPlano(ultima.plano);
    setSinaisVitais({ ...ultima.sinaisVitais });
    if (ultima.balancoHidrico) {
      setEntradasMl(ultima.balancoHidrico.entradasMl);
      setSaidasMl(ultima.balancoHidrico.saidasMl);
    }
  };

  // Carrega modelo de paciente clinicamente estável
  const aplicarModeloEstavel = () => {
    setSubjetivo(EVOLUCAO_ESTAVEL_TEMPLATE.subjetivo);
    setObjetivo(EVOLUCAO_ESTAVEL_TEMPLATE.objetivo);
    setAvaliacao(EVOLUCAO_ESTAVEL_TEMPLATE.avaliacao);
    setPlano(EVOLUCAO_ESTAVEL_TEMPLATE.plano);
  };

  const salvarNovaEvolucao = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjetivo.trim() && !objetivo.trim() && !avaliacao.trim() && !plano.trim()) {
      alert('Preencha ao menos uma das seções do SOAP para salvar a evolução.');
      return;
    }

    const novaEvolucao: EvolucaoSoapItem = {
      id: `evo-${Date.now()}`,
      dataHora: new Date().toISOString(),
      medico: doctor.fullName || 'Dr(a). Médico Assistente',
      crm: `CRM/${doctor.uf || 'PA'} ${doctor.crm || '00000'}`,
      leito: patient.bed || 'Leito de Internação',
      diasInternacao: evolucoes.length + 1,
      sinaisVitais,
      balancoHidrico: {
        entradasMl,
        saidasMl,
        balancoFinalMl: calcBalanco()
      },
      subjetivo: evaDor !== '0' ? `[Escala de Dor EVA: ${evaDor}/10] ${subjetivo}` : subjetivo,
      objetivo,
      avaliacao,
      plano
    };

    const atualizadas = [novaEvolucao, ...evolucoes];
    onChangeEvolucoes(atualizadas);
    setSelecionadoId(novaEvolucao.id);
    setIsNovoModo(false);
    setSalvoFeedback(true);
    setTimeout(() => setSalvoFeedback(false), 2500);
  };

  const excluirEvolucao = (id: string) => {
    if (!window.confirm('Deseja excluir esta nota de evolução do histórico?')) return;
    const filtradas = evolucoes.filter(e => e.id !== id);
    onChangeEvolucoes(filtradas);
    if (selecionadoId === id) {
      setSelecionadoId(filtradas.length > 0 ? filtradas[0].id : null);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-5 w-full">
      {/* ======================================================== */}
      {/* COLUNA ESQUERDA: LINHA DO TEMPO CRONOLÓGICA DAS EVOLUÇÕES*/}
      {/* ======================================================== */}
      <div className="w-full lg:w-4/12 flex flex-col gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">Histórico de Evoluções</h2>
          </div>
          <button
            type="button"
            onClick={iniciarNovaEvolucao}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Nova Nota
          </button>
        </div>

        {/* Timeline Items */}
        <div className="relative pl-5 border-l-2 border-slate-200 space-y-4 max-h-[720px] overflow-y-auto pr-1">
          {evolucoes.length === 0 ? (
            <div className="p-4 bg-white rounded-xl border border-dashed border-slate-300 text-center text-xs text-slate-400">
              Nenhuma evolução diária registrada ainda. Clique em "Nova Nota" para iniciar.
            </div>
          ) : (
            evolucoes.map(item => {
              const dataObj = new Date(item.dataHora);
              const isSelected = !isNovoModo && selecionadoId === item.id;

              return (
                <div key={item.id} className="relative group">
                  {/* Pin da Timeline */}
                  <span
                    className={`absolute -left-[27px] top-3 w-4 h-4 rounded-full border-2 bg-white transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-600 ring-4 ring-blue-100 scale-110'
                        : 'border-slate-300 group-hover:border-blue-400'
                    }`}
                  />

                  <div
                    onClick={() => {
                      setIsNovoModo(false);
                      setSelecionadoId(item.id);
                    }}
                    className={`cursor-pointer rounded-xl p-3.5 border transition-all text-left ${
                      isSelected
                        ? 'bg-blue-50/70 border-blue-400 shadow-xs ring-1 ring-blue-300'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <span className="font-extrabold text-blue-900 bg-blue-100/60 px-2 py-0.5 rounded-md text-[10.5px]">
                        D{item.diasInternacao} de Internação
                      </span>
                      <span className="text-[11px] font-semibold text-slate-600">
                        {dataObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}{' '}
                        às {dataObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <p className="text-xs font-bold text-slate-900 line-clamp-2 my-1 leading-snug">
                      {item.avaliacao || item.subjetivo || 'Evolução médica diária de rotina.'}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                      <span className="truncate max-w-[140px] font-medium">{item.medico}</span>
                      <div className="flex items-center gap-1.5 font-mono text-[10px]">
                        <span className="bg-slate-100 px-1.5 py-0.5 rounded font-bold text-slate-700">
                          PA {item.sinaisVitais.pa || '-'}
                        </span>
                        {item.balancoHidrico && (
                          <span className="bg-sky-50 text-sky-800 px-1.5 py-0.5 rounded font-bold">
                            BH {item.balancoHidrico.balancoFinalMl}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* COLUNA DIREITA: VISUALIZAÇÃO OU FORMULÁRIO DE EVOLUÇÃO   */}
      {/* ======================================================== */}
      <div className="w-full lg:w-8/12 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col min-h-[600px]">
        {/* Topo do Painel de Trabalho */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50/70 rounded-t-xl flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <span className="h-8 w-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Stethoscope className="w-4 h-4" strokeWidth={2.25} />
            </span>
            <div>
              <h3 className="text-sm font-black text-slate-900">
                {isNovoModo ? 'Nova Evolução Médica Diária (SOAP)' : 'Registro Clínico Arquivado'}
              </h3>
              <p className="text-xs text-slate-500">
                {isNovoModo
                  ? 'Preenchimento estruturado diário com balanço hídrico'
                  : evolucaoAtiva
                  ? `Registrado em ${new Date(evolucaoAtiva.dataHora).toLocaleString('pt-BR')} por ${evolucaoAtiva.medico}`
                  : 'Selecione uma nota ou crie uma nova'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isNovoModo ? (
              <>
                <button
                  type="button"
                  onClick={clonarUltimaEvolucao}
                  className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shadow-2xs"
                  title="Clona a última evolução para apenas editar alterações"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Última</span>
                </button>
                <button
                  type="button"
                  onClick={aplicarModeloEstavel}
                  className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shadow-2xs"
                  title="Carrega modelo padrão de estabilidade clínica"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Modelo Estável</span>
                </button>
              </>
            ) : evolucaoAtiva ? (
              <button
                type="button"
                onClick={() => excluirEvolucao(evolucaoAtiva.id)}
                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors border border-transparent hover:border-slate-200"
                title="Excluir evolução"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            ) : null}
          </div>
        </div>

        {/* FEEDBACK DE SALVAMENTO */}
        {salvoFeedback && (
          <div className="mx-4 mt-3 p-2 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-lg text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Evolução diária salva com sucesso no prontuário do paciente!</span>
          </div>
        )}

        {/* MODO 1: DETALHE DA NOTA ARQUIVADA */}
        {!isNovoModo && evolucaoAtiva ? (
          <div className="p-5 space-y-4 overflow-y-auto">
            {/* Cards de Sinais Vitais Arquivados */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 p-3 bg-slate-50/80 rounded-xl border border-slate-200 text-center">
              <div>
                <span className="text-[10px] text-slate-500 font-bold block uppercase">PA</span>
                <span className="font-mono text-xs sm:text-sm font-black text-slate-900">
                  {evolucaoAtiva.sinaisVitais.pa || '-'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold block uppercase">FC</span>
                <span className="font-mono text-xs sm:text-sm font-black text-slate-900">
                  {evolucaoAtiva.sinaisVitais.fc ? `${evolucaoAtiva.sinaisVitais.fc} bpm` : '-'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold block uppercase">FR</span>
                <span className="font-mono text-xs sm:text-sm font-black text-slate-900">
                  {evolucaoAtiva.sinaisVitais.fr ? `${evolucaoAtiva.sinaisVitais.fr} ipm` : '-'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold block uppercase">SatO2</span>
                <span className="font-mono text-xs sm:text-sm font-black text-slate-900">
                  {evolucaoAtiva.sinaisVitais.spo2 ? `${evolucaoAtiva.sinaisVitais.spo2}%` : '-'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold block uppercase">Temp</span>
                <span className="font-mono text-xs sm:text-sm font-black text-slate-900">
                  {evolucaoAtiva.sinaisVitais.temp ? `${evolucaoAtiva.sinaisVitais.temp} °C` : '-'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold block uppercase">Glicemia</span>
                <span className="font-mono text-xs sm:text-sm font-black text-slate-900">
                  {evolucaoAtiva.sinaisVitais.glicemia ? `${evolucaoAtiva.sinaisVitais.glicemia} mg/dL` : '-'}
                </span>
              </div>
            </div>

            {/* Balanço Hídrico das 24h */}
            {evolucaoAtiva.balancoHidrico && (
              <div className="flex items-center justify-between p-3 bg-sky-50/70 border border-sky-200 rounded-xl text-xs text-sky-950 flex-wrap gap-2">
                <span className="font-bold flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-sky-600" />
                  Balanço Hídrico das 24 horas:
                </span>
                <div className="flex items-center gap-4 font-mono font-bold">
                  <span>Entradas: <strong className="text-emerald-700">+{evolucaoAtiva.balancoHidrico.entradasMl} mL</strong></span>
                  <span>Saídas: <strong className="text-rose-700">-{evolucaoAtiva.balancoHidrico.saidasMl} mL</strong></span>
                  <span className="px-2 py-0.5 rounded bg-sky-200 text-sky-900 font-black">
                    Final: {evolucaoAtiva.balancoHidrico.balancoFinalMl}
                  </span>
                </div>
              </div>
            )}

            {/* Estrutura SOAP em Destaque */}
            <div className="space-y-3.5 text-xs">
              {/* S */}
              <div className="p-3.5 rounded-xl border-l-4 border-amber-500 bg-amber-50/40 border border-amber-200/60">
                <h4 className="text-xs font-black uppercase tracking-wider text-amber-900 mb-1 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  S — Subjetivo (Sintomas, Queixas, Dor, Alimentação e Sono)
                </h4>
                <p className="text-slate-800 leading-relaxed whitespace-pre-line font-medium">
                  {evolucaoAtiva.subjetivo || 'Paciente sem queixas agudas relatadas.'}
                </p>
              </div>

              {/* O */}
              <div className="p-3.5 rounded-xl border-l-4 border-blue-500 bg-blue-50/40 border border-blue-200/60">
                <h4 className="text-xs font-black uppercase tracking-wider text-blue-900 mb-1 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  O — Objetivo (Exame Físico Direcionado e Laboratoriais)
                </h4>
                <p className="text-slate-800 leading-relaxed whitespace-pre-line font-medium">
                  {evolucaoAtiva.objetivo}
                </p>
              </div>

              {/* A */}
              <div className="p-3.5 rounded-xl border-l-4 border-purple-500 bg-purple-50/40 border border-purple-200/60">
                <h4 className="text-xs font-black uppercase tracking-wider text-purple-900 mb-1 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                  A — Avaliação (Diagnósticos Ativos, Estabilidade e Resolução)
                </h4>
                <p className="text-slate-800 leading-relaxed whitespace-pre-line font-medium">
                  {evolucaoAtiva.avaliacao}
                </p>
              </div>

              {/* P */}
              <div className="p-3.5 rounded-xl border-l-4 border-emerald-500 bg-emerald-50/40 border border-emerald-200/60">
                <h4 className="text-xs font-black uppercase tracking-wider text-emerald-900 mb-1 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  P — Plano Terapêutico (Medicações, Desmames e Programação de Alta)
                </h4>
                <p className="text-slate-800 leading-relaxed whitespace-pre-line font-medium">
                  {evolucaoAtiva.plano}
                </p>
              </div>
            </div>

            {/* Rodapé da Nota */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span>Leito: <strong className="text-slate-800">{evolucaoAtiva.leito}</strong></span>
              <span>
                Médico: <strong className="text-slate-800">{evolucaoAtiva.medico}</strong> ({evolucaoAtiva.crm})
              </span>
            </div>
          </div>
        ) : isNovoModo ? (
          /* MODO 2: FORMULÁRIO DE NOVA EVOLUÇÃO (SOAP) */
          <form onSubmit={salvarNovaEvolucao} className="p-5 space-y-4 overflow-y-auto">
            {/* Grade de Sinais Vitais do Plantão */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-800 block">Sinais Vitais do Plantão:</span>
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                <div>
                  <label className="text-[10px] font-semibold text-slate-500 block">PA (mmHg)</label>
                  <input
                    type="text"
                    value={sinaisVitais.pa}
                    onChange={e => setSinaisVitais({ ...sinaisVitais, pa: e.target.value })}
                    placeholder="120x80"
                    className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-500 block">FC (bpm)</label>
                  <input
                    type="text"
                    value={sinaisVitais.fc}
                    onChange={e => setSinaisVitais({ ...sinaisVitais, fc: e.target.value })}
                    placeholder="78"
                    className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-500 block">FR (ipm)</label>
                  <input
                    type="text"
                    value={sinaisVitais.fr}
                    onChange={e => setSinaisVitais({ ...sinaisVitais, fr: e.target.value })}
                    placeholder="16"
                    className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-500 block">SatO2 (%)</label>
                  <input
                    type="text"
                    value={sinaisVitais.spo2}
                    onChange={e => setSinaisVitais({ ...sinaisVitais, spo2: e.target.value })}
                    placeholder="98"
                    className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-500 block">Tax (°C)</label>
                  <input
                    type="text"
                    value={sinaisVitais.temp}
                    onChange={e => setSinaisVitais({ ...sinaisVitais, temp: e.target.value })}
                    placeholder="36.5"
                    className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-500 block">Glicemia</label>
                  <input
                    type="text"
                    value={sinaisVitais.glicemia}
                    onChange={e => setSinaisVitais({ ...sinaisVitais, glicemia: e.target.value })}
                    placeholder="105"
                    className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs font-mono font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Balanço Hídrico & Escala de Dor */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-3 bg-sky-50/50 rounded-xl border border-sky-200">
              <div className="sm:col-span-3">
                <label className="text-[10.5px] font-bold text-sky-900 block mb-0.5">Entradas 24h (mL)</label>
                <input
                  type="text"
                  value={entradasMl}
                  onChange={e => setEntradasMl(e.target.value)}
                  placeholder="Ex: 2100"
                  className="w-full bg-white border border-sky-300 rounded px-2 py-1 text-xs font-mono font-bold"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="text-[10.5px] font-bold text-sky-900 block mb-0.5">Saídas / Diurese (mL)</label>
                <input
                  type="text"
                  value={saidasMl}
                  onChange={e => setSaidasMl(e.target.value)}
                  placeholder="Ex: 1600"
                  className="w-full bg-white border border-sky-300 rounded px-2 py-1 text-xs font-mono font-bold"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="text-[10.5px] font-bold text-sky-900 block mb-0.5">Balanço Final</label>
                <div className="px-2 py-1 bg-sky-100 rounded text-xs font-mono font-black text-sky-950 text-center">
                  {calcBalanco()}
                </div>
              </div>

              <div className="sm:col-span-3">
                <label className="text-[10.5px] font-bold text-slate-700 block mb-0.5">Dor (EVA 0 a 10)</label>
                <select
                  value={evaDor}
                  onChange={e => setEvaDor(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs font-bold"
                >
                  <option value="0">0 - Sem dor</option>
                  <option value="2">2 - Dor leve</option>
                  <option value="4">4 - Dor moderada</option>
                  <option value="6">6 - Dor moderada a intensa</option>
                  <option value="8">8 - Dor intensa</option>
                  <option value="10">10 - Dor insuportável</option>
                </select>
              </div>
            </div>

            {/* S - Subjetivo */}
            <div>
              <label className="block text-xs font-bold text-amber-900 uppercase mb-1 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                S — Subjetivo (Sintomas referidos, noite, aceitação da dieta, evacuações)
              </label>
              <textarea
                rows={2}
                value={subjetivo}
                onChange={e => setSubjetivo(e.target.value)}
                placeholder="Paciente refere melhora das dores, boa aceitação da dieta, nega náuseas ou picos febris..."
                className="w-full p-2.5 text-xs border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-amber-500 font-medium"
              />
            </div>

            {/* O - Objetivo */}
            <div>
              <label className="block text-xs font-bold text-blue-900 uppercase mb-1 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                O — Objetivo (Exame físico direcionado do dia e resultados laboratoriais)
              </label>
              <textarea
                rows={3}
                value={objetivo}
                onChange={e => setObjetivo(e.target.value)}
                placeholder="BEG, eupneico em ar ambiente. ACV: RCR 2T BNF sem sopros. AR: MV+ bilateral. ABD: Flácido, RHA+, indolor..."
                className="w-full p-2.5 text-xs border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>

            {/* A - Avaliação */}
            <div>
              <label className="block text-xs font-bold text-purple-900 uppercase mb-1 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                A — Avaliação (Estabilidade clínica, status infeccioso, resolução das hipóteses)
              </label>
              <textarea
                rows={2}
                value={avaliacao}
                onChange={e => setAvaliacao(e.target.value)}
                placeholder="1. D2 de Ceftriaxona para infecção com melhora clínica e laboratorial evidente. 2. Estável hemodinamicamente..."
                className="w-full p-2.5 text-xs border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-purple-500 font-medium"
              />
            </div>

            {/* P - Plano Terapêutico */}
            <div>
              <label className="block text-xs font-bold text-emerald-900 uppercase mb-1 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                P — Plano Terapêutico (Medicações, desmames, fisioterapia e programação de alta)
              </label>
              <textarea
                rows={3}
                value={plano}
                onChange={e => setPlano(e.target.value)}
                placeholder="1. Manter antibioticoterapia venosa. 2. Estimular deambulação assistida. 3. Previsão de alta hospitalar em 24-48h..."
                className="w-full p-2.5 text-xs border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            {/* Botões do Rodapé */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setIsNovoModo(false);
                  if (evolucoes.length > 0) setSelecionadoId(evolucoes[0].id);
                }}
                className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-800"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-black shadow-md transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Salvar Evolução Médica</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="p-12 text-center text-slate-400 italic">
            Selecione uma nota na linha do tempo ao lado ou clique em "+ Nova Nota".
          </div>
        )}
      </div>
    </div>
  );
};
