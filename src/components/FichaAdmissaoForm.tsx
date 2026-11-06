import React, { useState } from 'react';
import {
  FileText,
  Activity,
  Heart,
  Wind,
  ShieldAlert,
  AlertTriangle,
  Plus,
  Trash2,
  Sparkles,
  ClipboardList,
  UserPlus,
  Pill
} from 'lucide-react';
import {
  FichaAdmissaoHospitalar,
  OrigemAdmissao,
  MedicacaoReconciliada,
  PatientInfo,
  DoctorProfile,
  InpatientInfo,
  HipoteseDiagnosticaItem
} from '../types';
import {
  EXAME_FISICO_NORMAL
} from '../data/prontuarioHospitalar';
import { CidSearchAutocomplete } from './CidSearchAutocomplete';
import { resolveCidAndDescription } from '../data/cid10';

interface FichaAdmissaoFormProps {
  data: FichaAdmissaoHospitalar;
  onChange: (updated: FichaAdmissaoHospitalar) => void;
  patient: PatientInfo;
  setPatient: (patient: PatientInfo | ((prev: PatientInfo) => PatientInfo)) => void;
  doctor: DoctorProfile;
  inpatientInfo: InpatientInfo;
  onNewPatient?: () => void;
}

const INPUT_CLASS =
  'w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-hidden font-medium';
const TEXTAREA_CLASS =
  'w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-hidden leading-relaxed';

export const FichaAdmissaoForm: React.FC<FichaAdmissaoFormProps> = ({
  data,
  onChange,
  patient,
  setPatient,
  doctor,
  inpatientInfo,
  onNewPatient
}) => {
  const [novoMedReconciliado, setNovoMedReconciliado] = useState<Partial<MedicacaoReconciliada>>({
    medicamento: '',
    dose: '',
    frequencia: '',
    conduta: 'manter',
    motivo: ''
  });

  // Atualizador imutável de campos raiz
  const updateField = <K extends keyof FichaAdmissaoHospitalar>(field: K, value: FichaAdmissaoHospitalar[K]) => {
    onChange({ ...data, [field]: value });
  };

  // Preenchimento do Exame Físico Normal / Sem Alterações
  const preencherExameFisicoNormal = () => {
    onChange({
      ...data,
      exameSegmentar: {
        geral: EXAME_FISICO_NORMAL.geral,
        acv: EXAME_FISICO_NORMAL.acv,
        ar: EXAME_FISICO_NORMAL.ar,
        abdome: EXAME_FISICO_NORMAL.abdome,
        extremidadesNeuro: EXAME_FISICO_NORMAL.extremidadesNeuro
      }
    });
  };

  // Reconciliação medicamentosa
  const adicionarMedicacaoReconciliada = () => {
    if (!novoMedReconciliado.medicamento?.trim()) return;
    const item: MedicacaoReconciliada = {
      id: `rec-${Date.now()}`,
      medicamento: novoMedReconciliado.medicamento.trim(),
      dose: novoMedReconciliado.dose?.trim() || '',
      frequencia: novoMedReconciliado.frequencia?.trim() || '',
      conduta: novoMedReconciliado.conduta || 'manter',
      motivo: novoMedReconciliado.motivo?.trim() || ''
    };
    updateField('medicacoesReconciliadas', [...data.medicacoesReconciliadas, item]);
    setNovoMedReconciliado({
      medicamento: '',
      dose: '',
      frequencia: '',
      conduta: 'manter',
      motivo: ''
    });
  };

  const removerMedicacaoReconciliada = (id: string) => {
    updateField(
      'medicacoesReconciliadas',
      data.medicacoesReconciliadas.filter(m => m.id !== id)
    );
  };

  // Diagnósticos
  const adicionarCidDiagnostico = (cid: { code: string; description: string }) => {
    const existe = data.diagnosticos.some(d => d.cidCode === cid.code);
    if (existe) return;
    const novoItem: HipoteseDiagnosticaItem = {
      id: `diag-${Date.now()}`,
      cidCode: cid.code,
      descricao: cid.description
    };
    updateField('diagnosticos', [...data.diagnosticos, novoItem]);
  };

  const removerDiagnostico = (id: string) => {
    updateField('diagnosticos', data.diagnosticos.filter(d => d.id !== id));
  };

  const [diagnosticoLivreInput, setDiagnosticoLivreInput] = useState('');
  const adicionarDiagnosticoLivre = () => {
    if (!diagnosticoLivreInput.trim()) return;
    const resolved = resolveCidAndDescription(diagnosticoLivreInput.trim());
    const novoItem: HipoteseDiagnosticaItem = {
      id: `diag-livre-${Date.now()}`,
      cidCode: resolved ? resolved.code : undefined,
      descricao: resolved ? resolved.description : diagnosticoLivreInput.trim()
    };
    updateField('diagnosticos', [...data.diagnosticos, novoItem]);
    setDiagnosticoLivreInput('');
  };

  return (
    <div className="space-y-6">
      {/* ======================================================== */}
      {/* A. CABEÇALHO & CONTEXTO DA ADMISSÃO                      */}
      {/* ======================================================== */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="h-9 w-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <FileText className="w-5 h-5" strokeWidth={2.25} />
            </span>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                A. Cabeçalho & Contexto da Admissão Hospitalar
              </h2>
              <p className="text-xs text-slate-500">
                Registro de entrada e procedência do paciente na enfermaria / leito
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onNewPatient && (
              <button
                type="button"
                onClick={onNewPatient}
                title="Limpar todos os dados do paciente atual para iniciar nova admissão"
                className="text-xs font-bold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Novo Paciente</span>
              </button>
            )}
            <span className="text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full border border-blue-200">
              Admissão Hospitalar
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nome Completo do Paciente *
            </label>
            <input
              type="text"
              value={patient.name}
              onChange={e => setPatient(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: Nome Completo do Paciente"
              className={`${INPUT_CLASS} font-bold`}
            />
          </div>

          <div className="sm:col-span-3">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Prontuário / CPF / Documento
            </label>
            <input
              type="text"
              value={patient.document}
              onChange={e => setPatient(prev => ({ ...prev, document: e.target.value }))}
              placeholder="Prontuário ou CPF"
              className={INPUT_CLASS}
            />
          </div>

          <div className="sm:col-span-3">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Data e Hora da Admissão *
            </label>
            <input
              type="datetime-local"
              value={data.dataHoraAdmissao}
              onChange={e => updateField('dataHoraAdmissao', e.target.value)}
              className={INPUT_CLASS}
            />
          </div>

          <div className="sm:col-span-3">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Origem / Procedência *
            </label>
            <select
              value={data.origem}
              onChange={e => updateField('origem', e.target.value as OrigemAdmissao)}
              className={INPUT_CLASS}
            >
              <option value="pronto_socorro">🚨 Pronto-Socorro / Urgência</option>
              <option value="ambulatorio">🏥 Ambulatório de Especialidades</option>
              <option value="transferencia">🚑 Transferência Inter-hospitalar (SAMU/Regulação)</option>
              <option value="domicilio">🏠 Domicílio / Busca Espontânea</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Leito de Destino
            </label>
            <input
              type="text"
              value={patient.bed || inpatientInfo.bed || ''}
              onChange={e => {
                const val = e.target.value;
                setPatient(prev => ({ ...prev, bed: val }));
              }}
              placeholder="Ex: Leito 04 - B"
              className={INPUT_CLASS}
            />
          </div>

          <div className="sm:col-span-3">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Enfermaria / Setor
            </label>
            <input
              type="text"
              value={patient.ward || inpatientInfo.ward || 'Enfermaria Clínica'}
              onChange={e => {
                const val = e.target.value;
                setPatient(prev => ({ ...prev, ward: val }));
              }}
              placeholder="Ex: Enfermaria Clínica"
              className={INPUT_CLASS}
            />
          </div>

          <div className="sm:col-span-3">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Médico Responsável Admissional
            </label>
            <input
              type="text"
              value={data.medicoAdmissao || doctor.fullName}
              onChange={e => updateField('medicoAdmissao', e.target.value)}
              placeholder={doctor.fullName || 'Dr(a). Nome do Médico'}
              className={INPUT_CLASS}
            />
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* B. HISTÓRIA CLÍNICA (ANAMNESE)                           */}
      {/* ======================================================== */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="h-9 w-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <ClipboardList className="w-5 h-5" strokeWidth={2.25} />
            </span>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                B. História Clínica (Anamnese)
              </h2>
              <p className="text-xs text-slate-500">
                Queixa principal, HDA, antecedentes, alergias e reconciliação medicamentosa
              </p>
            </div>
          </div>
        </div>

        {/* Queixa Principal */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1">
            Queixa Principal (QP) *
          </label>
          <input
            type="text"
            value={data.queixaPrincipal}
            onChange={e => updateField('queixaPrincipal', e.target.value)}
            placeholder=""
            className={`${INPUT_CLASS} font-semibold text-blue-950 border-blue-200 bg-blue-50/20`}
          />
        </div>

        {/* História da Doença Atual (HDA) */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5">
            História da Doença Atual (HDA) *
          </label>
          <textarea
            rows={4}
            value={data.hda}
            onChange={e => updateField('hda', e.target.value)}
            placeholder=""
            className={TEXTAREA_CLASS}
          />
        </div>

        {/* Antecedentes Pessoais Patológicos (APP) */}
        <div className="p-3.5 bg-slate-50/70 border border-slate-200 rounded-xl space-y-2.5">
          <label className="block text-xs font-bold text-slate-800">
            Antecedentes Pessoais Patológicos (Comorbidades e Fatores de Risco)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { key: 'has', label: 'HAS (Hipertensão)' },
              { key: 'dm2', label: 'Diabetes Mellitus' },
              { key: 'ic', label: 'Insuf. Cardíaca' },
              { key: 'drc', label: 'Doença Renal (DRC)' },
              { key: 'dpoc_asma', label: 'DPOC / Asma' },
              { key: 'fa', label: 'Fibrilação Atrial' },
              { key: 'ave', label: 'AVE prévio' },
              { key: 'cirurgias', label: 'Cirurgias Prévias' }
            ].map(item => {
              const checked = data.appCheckboxes[item.key as keyof typeof data.appCheckboxes];
              return (
                <label
                  key={item.key}
                  className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer select-none transition-all ${
                    checked
                      ? 'bg-blue-600 text-white font-bold border-blue-600 shadow-2xs'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={e => {
                      updateField('appCheckboxes', {
                        ...data.appCheckboxes,
                        [item.key]: e.target.checked
                      });
                    }}
                    className="rounded text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                  />
                  <span>{item.label}</span>
                </label>
              );
            })}
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Detalhamento de comorbidades, cirurgias prévias, hábitos (tabagismo/etilismo):
            </label>
            <input
              type="text"
              value={data.appOutros}
              onChange={e => updateField('appOutros', e.target.value)}
              placeholder="Ex: Colecistectomia há 4 anos. Ex-tabagista (20 anos-maço). Nega etilismo."
              className={INPUT_CLASS}
            />
          </div>
        </div>

        {/* Alergias Medicamentosas com Badge em Vermelho Vivo */}
        <div className={`p-4 rounded-xl border transition-all ${
          data.temAlergia === 'alergico'
            ? 'bg-rose-50/70 border-rose-300 ring-2 ring-rose-200'
            : 'bg-slate-50/50 border-slate-200'
        }`}>
          <div className="flex items-center justify-between gap-3 flex-wrap mb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className={`w-4 h-4 ${data.temAlergia === 'alergico' ? 'text-rose-600 animate-pulse' : 'text-slate-500'}`} />
              <span className="text-xs font-bold text-slate-800">
                Alergias Medicamentosas (Segurança do Paciente)
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  onChange({ ...data, temAlergia: 'nao_relata', alergiasDescricao: '' });
                }}
                className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                  data.temAlergia === 'nao_relata'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'bg-white text-slate-700 border border-slate-300 hover:bg-emerald-50'
                }`}
              >
                ✓ Não Relata Alergias
              </button>
              <button
                type="button"
                onClick={() => {
                  onChange({ ...data, temAlergia: 'alergico' });
                }}
                className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                  data.temAlergia === 'alergico'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-white text-rose-700 border border-rose-300 hover:bg-rose-50'
                }`}
              >
                ⚠️ Relata Alergias
              </button>
            </div>
          </div>

          {data.temAlergia === 'alergico' && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white shadow-2xs animate-pulse">
                  ALERTA MÁXIMO
                </span>
                <span className="text-[11px] font-semibold text-rose-800">
                  Especifique os fármacos e a reação ocorrida:
                </span>
              </div>
              <input
                type="text"
                value={data.alergiasDescricao}
                onChange={e => updateField('alergiasDescricao', e.target.value)}
                placeholder="Ex: DIPIRONA (Edema de glote/urticária), PENICILINA (Choque anafilático), AINEs..."
                className="w-full px-3 py-2 text-xs bg-white border-2 border-rose-400 rounded-lg text-rose-950 font-bold focus:ring-2 focus:ring-rose-600 outline-hidden"
              />
            </div>
          )}
        </div>

        {/* Reconciliação Medicamentosa */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Pill className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-900">
                Reconciliação Medicamentosa (Uso Domiciliar e Conduta na Admissão)
              </h3>
            </div>
            <span className="text-[11px] font-semibold text-slate-500">
              {data.medicacoesReconciliadas.length} medicamento(s) listado(s)
            </span>
          </div>

          {/* Tabela de Medicamentos */}
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[10.5px] uppercase font-bold text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="p-2.5">Medicamento / Dose</th>
                  <th className="p-2.5">Frequência</th>
                  <th className="p-2.5">Conduta na Internação</th>
                  <th className="p-2.5">Motivo / Justificativa</th>
                  <th className="p-2.5 text-center w-12">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {data.medicacoesReconciliadas.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-slate-400 italic">
                      Nenhum medicamento domiciliar registrado ou paciente nega uso contínuo.
                    </td>
                  </tr>
                ) : (
                  data.medicacoesReconciliadas.map(med => (
                    <tr key={med.id} className="hover:bg-slate-50/60">
                      <td className="p-2.5 font-bold text-slate-900">{med.medicamento} {med.dose}</td>
                      <td className="p-2.5">{med.frequencia}</td>
                      <td className="p-2.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          med.conduta === 'manter'
                            ? 'bg-emerald-100 text-emerald-800'
                            : med.conduta === 'suspender'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {med.conduta.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-2.5 text-slate-600 text-[11px]">{med.motivo || '—'}</td>
                      <td className="p-2.5 text-center">
                        <button
                          type="button"
                          onClick={() => removerMedicacaoReconciliada(med.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded"
                          title="Remover"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Adicionar Linha de Reconciliação */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-2 items-end">
            <div className="sm:col-span-4">
              <label className="block text-[10.5px] font-semibold text-slate-600 mb-0.5">Medicamento e Dose</label>
              <input
                type="text"
                value={novoMedReconciliado.medicamento || ''}
                onChange={e => setNovoMedReconciliado({ ...novoMedReconciliado, medicamento: e.target.value })}
                placeholder="Ex: Metformina 850mg"
                className={INPUT_CLASS}
              />
            </div>
            <div className="sm:col-span-3">
              <label className="block text-[10.5px] font-semibold text-slate-600 mb-0.5">Frequência</label>
              <input
                type="text"
                value={novoMedReconciliado.frequencia || ''}
                onChange={e => setNovoMedReconciliado({ ...novoMedReconciliado, frequencia: e.target.value })}
                placeholder="Ex: 2x ao dia"
                className={INPUT_CLASS}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[10.5px] font-semibold text-slate-600 mb-0.5">Conduta</label>
              <select
                value={novoMedReconciliado.conduta || 'manter'}
                onChange={e => setNovoMedReconciliado({ ...novoMedReconciliado, conduta: e.target.value as any })}
                className={INPUT_CLASS}
              >
                <option value="manter">Manter</option>
                <option value="suspender">Suspender</option>
                <option value="substituir">Substituir</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[10.5px] font-semibold text-slate-600 mb-0.5">Motivo</label>
              <input
                type="text"
                value={novoMedReconciliado.motivo || ''}
                onChange={e => setNovoMedReconciliado({ ...novoMedReconciliado, motivo: e.target.value })}
                placeholder="Ex: Jejum cirúrgico"
                className={INPUT_CLASS}
              />
            </div>
            <div className="sm:col-span-1">
              <button
                type="button"
                onClick={adicionarMedicacaoReconciliada}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center justify-center transition-colors shadow-2xs"
                title="Adicionar medicamento à tabela"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* C. EXAME FÍSICO ADMISSIONAL                              */}
      {/* ======================================================== */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <span className="h-9 w-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Activity className="w-5 h-5" strokeWidth={2.25} />
            </span>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                C. Exame Físico Admissional Completo
              </h2>
              <p className="text-xs text-slate-500">
                Sinais vitais imediatos e avaliação segmentar de sistemas
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={preencherExameFisicoNormal}
            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 shadow-2xs"
            title="Preenche todos os campos segmentares com o padrão fisiológico normal em 1 clique"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Preencher Exame Físico Normal / Sem Alterações</span>
          </button>
        </div>

        {/* Grade Rápida de Sinais Vitais */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/50">
            <span className="text-[10px] font-bold text-slate-500 block uppercase">PA (mmHg)</span>
            <input
              type="text"
              value={data.sinaisVitais.pa}
              onChange={e => updateField('sinaisVitais', { ...data.sinaisVitais, pa: e.target.value })}
              placeholder="120x80"
              className="w-full mt-1 px-2 py-1 bg-white border border-slate-300 rounded text-xs font-mono font-bold text-slate-900 outline-hidden"
            />
          </div>

          <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/50">
            <span className="text-[10px] font-bold text-slate-500 block uppercase">FC (bpm)</span>
            <input
              type="text"
              value={data.sinaisVitais.fc}
              onChange={e => updateField('sinaisVitais', { ...data.sinaisVitais, fc: e.target.value })}
              placeholder="80"
              className="w-full mt-1 px-2 py-1 bg-white border border-slate-300 rounded text-xs font-mono font-bold text-slate-900 outline-hidden"
            />
          </div>

          <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/50">
            <span className="text-[10px] font-bold text-slate-500 block uppercase">FR (ipm)</span>
            <input
              type="text"
              value={data.sinaisVitais.fr}
              onChange={e => updateField('sinaisVitais', { ...data.sinaisVitais, fr: e.target.value })}
              placeholder="18"
              className="w-full mt-1 px-2 py-1 bg-white border border-slate-300 rounded text-xs font-mono font-bold text-slate-900 outline-hidden"
            />
          </div>

          <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/50">
            <span className="text-[10px] font-bold text-slate-500 block uppercase">SatO2 (%)</span>
            <input
              type="text"
              value={data.sinaisVitais.spo2}
              onChange={e => updateField('sinaisVitais', { ...data.sinaisVitais, spo2: e.target.value })}
              placeholder="98"
              className="w-full mt-1 px-2 py-1 bg-white border border-slate-300 rounded text-xs font-mono font-bold text-slate-900 outline-hidden"
            />
          </div>

          <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/50">
            <span className="text-[10px] font-bold text-slate-500 block uppercase">Temp (°C)</span>
            <input
              type="text"
              value={data.sinaisVitais.temp}
              onChange={e => updateField('sinaisVitais', { ...data.sinaisVitais, temp: e.target.value })}
              placeholder="36.5"
              className="w-full mt-1 px-2 py-1 bg-white border border-slate-300 rounded text-xs font-mono font-bold text-slate-900 outline-hidden"
            />
          </div>

          <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/50">
            <span className="text-[10px] font-bold text-slate-500 block uppercase">Glicemia (mg/dL)</span>
            <input
              type="text"
              value={data.sinaisVitais.glicemia}
              onChange={e => updateField('sinaisVitais', { ...data.sinaisVitais, glicemia: e.target.value })}
              placeholder="105"
              className="w-full mt-1 px-2 py-1 bg-white border border-slate-300 rounded text-xs font-mono font-bold text-slate-900 outline-hidden"
            />
          </div>

          <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/50">
            <span className="text-[10px] font-bold text-slate-500 block uppercase">Glasgow (3-15)</span>
            <input
              type="text"
              value={data.sinaisVitais.glasgow}
              onChange={e => updateField('sinaisVitais', { ...data.sinaisVitais, glasgow: e.target.value })}
              placeholder="15"
              className="w-full mt-1 px-2 py-1 bg-white border border-slate-300 rounded text-xs font-mono font-bold text-slate-900 outline-hidden"
            />
          </div>
        </div>

        {/* Exame Segmentar */}
        <div className="space-y-3 pt-2">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Geral (Estado Geral, Mucosas, Hidratação, Perfusão Capilar):
            </label>
            <textarea
              rows={2}
              value={data.exameSegmentar.geral}
              onChange={e => updateField('exameSegmentar', { ...data.exameSegmentar, geral: e.target.value })}
              className={TEXTAREA_CLASS}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-500" />
                Aparelho Cardiovascular (ACV):
              </label>
              <textarea
                rows={2}
                value={data.exameSegmentar.acv}
                onChange={e => updateField('exameSegmentar', { ...data.exameSegmentar, acv: e.target.value })}
                className={TEXTAREA_CLASS}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                <Wind className="w-3.5 h-3.5 text-sky-500" />
                Aparelho Respiratório (AR):
              </label>
              <textarea
                rows={2}
                value={data.exameSegmentar.ar}
                onChange={e => updateField('exameSegmentar', { ...data.exameSegmentar, ar: e.target.value })}
                className={TEXTAREA_CLASS}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Abdome (Inspeção, Palpação, RHA, Sinais Peritoneais: Blumberg, Murphy, Rovsing):
            </label>
            <textarea
              rows={2}
              value={data.exameSegmentar.abdome}
              onChange={e => updateField('exameSegmentar', { ...data.exameSegmentar, abdome: e.target.value })}
              className={TEXTAREA_CLASS}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Extremidades e Neurológico (Edemas, Pulsos Distais, Déficits Focais):
            </label>
            <textarea
              rows={2}
              value={data.exameSegmentar.extremidadesNeuro}
              onChange={e => updateField('exameSegmentar', { ...data.exameSegmentar, extremidadesNeuro: e.target.value })}
              className={TEXTAREA_CLASS}
            />
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* D. AVALIAÇÃO DE RISCOS ADMISSIONAL                      */}
      {/* ======================================================== */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="h-9 w-9 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
              <ShieldAlert className="w-5 h-5" strokeWidth={2.25} />
            </span>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                D. Avaliação de Riscos Admissional (Protocolos de Segurança)
              </h2>
              <p className="text-xs text-slate-500">
                Classificação de risco de TEV, queda e lesão por pressão (Braden)
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Risco de TEV */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-slate-900 block">Risco de TEV (Trombose Venosa)</span>
            <div className="flex gap-1.5">
              {(['baixo', 'moderado', 'alto'] as const).map(nivel => (
                <button
                  key={nivel}
                  type="button"
                  onClick={() => updateField('riscos', { ...data.riscos, riscoTev: nivel })}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                    data.riscos.riscoTev === nivel
                      ? nivel === 'alto'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : nivel === 'moderado'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {nivel}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-600 leading-tight">
              {data.riscos.riscoTev === 'alto' && '⚠️ Indicação de profilaxia química (Enoxaparina 40mg SC) + mecânica.'}
              {data.riscos.riscoTev === 'moderado' && '⚠️ Considerar Enoxaparina 40mg SC ou profilaxia mecânica.'}
              {data.riscos.riscoTev === 'baixo' && '✓ Deambulação precoce e estímulo à hidratação oral.'}
            </p>
          </div>

          {/* Risco de Queda */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-slate-900 block">Risco de Queda (Escore Morse)</span>
            <div className="flex gap-1.5">
              {(['baixo', 'medio', 'alto'] as const).map(nivel => (
                <button
                  key={nivel}
                  type="button"
                  onClick={() => updateField('riscos', { ...data.riscos, riscoQueda: nivel })}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                    data.riscos.riscoQueda === nivel
                      ? nivel === 'alto'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : nivel === 'medio'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {nivel === 'medio' ? 'Médio' : nivel}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-600 leading-tight">
              {data.riscos.riscoQueda === 'alto' && '⚠️ Pulseira amarela, grades no leito e auxílio na deambulação.'}
              {data.riscos.riscoQueda === 'medio' && '⚠️ Grades elevadas e leito travado.'}
              {data.riscos.riscoQueda === 'baixo' && '✓ Orientações gerais de segurança no quarto.'}
            </p>
          </div>

          {/* Risco de LPP */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-slate-900 block">Lesão por Pressão (Braden)</span>
            <div className="flex gap-1.5">
              {(['baixo', 'moderado', 'elevado'] as const).map(nivel => (
                <button
                  key={nivel}
                  type="button"
                  onClick={() => updateField('riscos', { ...data.riscos, riscoLpp: nivel })}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                    data.riscos.riscoLpp === nivel
                      ? nivel === 'elevado'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : nivel === 'moderado'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {nivel}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-600 leading-tight">
              {data.riscos.riscoLpp === 'elevado' && '⚠️ Mudança de decúbito de 2/2h + colchão piramidal/pneumático.'}
              {data.riscos.riscoLpp === 'moderado' && '⚠️ Hidratação da pele e vigilância de proeminências ósseas.'}
              {data.riscos.riscoLpp === 'baixo' && '✓ Paciente com mobilidade preservada no leito.'}
            </p>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* E. HIPÓTESES DIAGNÓSTICAS (HD)                           */}
      {/* ======================================================== */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="h-9 w-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" strokeWidth={2.25} />
            </span>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                E. Hipóteses Diagnósticas (HD)
              </h2>
              <p className="text-xs text-slate-500">
                CID-10 oficial e hipóteses diagnósticas da admissão hospitalar
              </p>
            </div>
          </div>
        </div>

        {/* Busca de CID-10 e Diagnósticos Livres */}
        <div className="space-y-3">
          <CidSearchAutocomplete
            onSelectCid={cid => adicionarCidDiagnostico(cid)}
            onClearCid={() => {}}
            label="Buscar Hipótese Diagnóstica (CID-10 Oficial)"
            placeholder="Digite o código ou patologia (ex: K35, J18, I10, E11, Infecção a esclarecer)..."
            descriptionHint="Selecione para vincular diretamente ao prontuário admissional"
          />

          {/* Adicionar Diagnóstico Livre */}
          <div className="flex gap-2">
            <input
              type="text"
              value={diagnosticoLivreInput}
              onChange={e => setDiagnosticoLivreInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  adicionarDiagnosticoLivre();
                }
              }}
              placeholder="Ou digite um diagnóstico clínico livre (ex: Abdome agudo inflamatório em investigação)..."
              className={INPUT_CLASS}
            />
            <button
              type="button"
              onClick={adicionarDiagnosticoLivre}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold shrink-0 transition-colors shadow-2xs"
            >
              + Adicionar
            </button>
          </div>

          {/* Lista de Diagnósticos Vinculados */}
          <div className="flex flex-wrap gap-2 pt-1">
            {data.diagnosticos.map(d => (
              <span
                key={d.id}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-900 border border-purple-200 shadow-2xs"
              >
                {d.cidCode && <strong className="text-purple-700">{d.cidCode} — </strong>}
                <span>{d.descricao}</span>
                <button
                  type="button"
                  onClick={() => removerDiagnostico(d.id)}
                  className="hover:text-rose-600 ml-1 p-0.5 rounded-full"
                  title="Remover diagnóstico"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
