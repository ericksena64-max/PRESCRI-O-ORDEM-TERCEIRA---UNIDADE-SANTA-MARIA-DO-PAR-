import React from 'react';
import {
  CheckCircle2,
  Shield,
  UserCheck,
  UserPlus
} from 'lucide-react';
import { AtestadoData, PatientInfo } from '../types';
import { formatDaysInWords, calculateEndDate } from '../utils/documentLogic';
import { CidSearchAutocomplete } from './CidSearchAutocomplete';

interface AtestadoFormProps {
  atestado: AtestadoData;
  setAtestado: React.Dispatch<React.SetStateAction<AtestadoData>>;
  patient?: PatientInfo;
  onUpdatePatient?: (patient: PatientInfo | ((prev: PatientInfo) => PatientInfo)) => void;
  onNewPatient?: () => void;
}

const COMMON_DAYS = [1, 2, 3, 5, 7, 10, 14, 15, 30];

export const AtestadoForm: React.FC<AtestadoFormProps> = ({
  atestado,
  setAtestado,
  patient,
  onUpdatePatient,
  onNewPatient
}) => {

  const handleDaysChange = (newDays: number) => {
    const days = Math.max(1, newDays);
    const end = calculateEndDate(atestado.startDate, days);
    setAtestado(prev => ({
      ...prev,
      days,
      endDate: end
    }));
  };

  const handleStartDateChange = (newStartDate: string) => {
    const end = calculateEndDate(newStartDate, atestado.days);
    setAtestado(prev => ({
      ...prev,
      startDate: newStartDate,
      endDate: end
    }));
  };

  const handleTemplateChange = (type: AtestadoData['type']) => {
    let customText = '';
    if (type === 'aptidao') {
      customText = 'Atesto para os devidos fins que o(a) paciente acima identificado(a) foi avaliado(a) clinicamente nesta data, encontrando-se APTO(A) do ponto de vista cardiovascular e musculoesquelético para a prática de atividades físicas e esportivas moderadas a intensas.';
    } else if (type === 'acompanhante') {
      customText = 'Atesto para os devidos fins que o(a) Sr(a). [Nome do Acompanhante], portador(a) do documento nº [Documento], permaneceu como acompanhante legal e indispensável durante o atendimento e internação do(a) paciente.';
    } else if (type === 'comparecimento_pericia') {
      customText = 'Atesto para os devidos fins periciais e administrativos que o(a) paciente acima qualificado(a) esteve sob meus cuidados médicos para realização de exames, perícia médica e avaliação diagnóstica.';
    }

    setAtestado(prev => ({
      ...prev,
      type,
      customText
    }));
  };

  return (
    <div className="space-y-6">
      {/* Patient info card */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
        <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-4 flex items-center justify-between flex-wrap gap-2">
          <span className="flex items-center gap-2.5">
            <span className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-sky-500 text-white flex items-center justify-center shadow-xs">
              <UserCheck className="w-4 h-4" strokeWidth={2.25} />
            </span>
            <span>Dados do Paciente</span>
          </span>
          {onNewPatient ? (
            <button
              type="button"
              onClick={onNewPatient}
              title="Limpar todos os dados do paciente atual para iniciar novo atendimento"
              className="text-xs font-bold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all normal-case tracking-normal cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Novo Paciente</span>
            </button>
          ) : (
            <span className="text-xs text-slate-400 font-normal">Identificação para o atestado</span>
          )}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8">
            <label htmlFor="atestado-patient-name" className="block text-xs font-semibold text-slate-600 mb-1">
              Nome Completo do Paciente *
            </label>
            <input
              id="atestado-patient-name"
              type="text"
              value={atestado.patientName || patient?.name || ''}
              onChange={e => {
                const val = e.target.value;
                setAtestado(prev => ({ ...prev, patientName: val }));
                if (onUpdatePatient) {
                  onUpdatePatient(prev => ({ ...prev, name: val }));
                }
              }}
              placeholder="Ex: Nome Completo do Paciente"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-hidden font-medium"
            />
          </div>

          <div className="sm:col-span-4">
            <label htmlFor="atestado-patient-doc" className="block text-xs font-semibold text-slate-600 mb-1">
              CPF ou RG
            </label>
            <input
              id="atestado-patient-doc"
              type="text"
              value={atestado.patientDoc || patient?.document || ''}
              onChange={e => {
                const val = e.target.value;
                setAtestado(prev => ({ ...prev, patientDoc: val }));
                if (onUpdatePatient) {
                  onUpdatePatient(prev => ({ ...prev, document: val }));
                }
              }}
              placeholder="000.000.000-00"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Purpose / Template */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
        <label className="block text-sm font-semibold text-slate-800 mb-2">
          Finalidade do Atestado
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          <button
            type="button"
            onClick={() => handleTemplateChange('repouso')}
            className={`p-3 rounded-lg border text-left transition-all ${
              atestado.type === 'repouso'
                ? 'border-blue-700 bg-blue-50/70 text-blue-950 ring-1 ring-blue-700'
                : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="font-semibold text-xs flex items-center justify-between">
              <span>Repouso / Doença</span>
              {atestado.type === 'repouso' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-700" />}
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">Afastamento por dias</p>
          </button>

          <button
            type="button"
            onClick={() => handleTemplateChange('aptidao')}
            className={`p-3 rounded-lg border text-left transition-all ${
              atestado.type === 'aptidao'
                ? 'border-blue-700 bg-blue-50/70 text-blue-950 ring-1 ring-blue-700'
                : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="font-semibold text-xs flex items-center justify-between">
              <span>Aptidão Física</span>
              {atestado.type === 'aptidao' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-700" />}
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">Academia e esportes</p>
          </button>

          <button
            type="button"
            onClick={() => handleTemplateChange('acompanhante')}
            className={`p-3 rounded-lg border text-left transition-all ${
              atestado.type === 'acompanhante'
                ? 'border-blue-700 bg-blue-50/70 text-blue-950 ring-1 ring-blue-700'
                : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="font-semibold text-xs flex items-center justify-between">
              <span>Acompanhante</span>
              {atestado.type === 'acompanhante' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-700" />}
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">Fins trabalhistas</p>
          </button>

          <button
            type="button"
            onClick={() => handleTemplateChange('personalizado')}
            className={`p-3 rounded-lg border text-left transition-all ${
              atestado.type === 'personalizado'
                ? 'border-blue-700 bg-blue-50/70 text-blue-950 ring-1 ring-blue-700'
                : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="font-semibold text-xs flex items-center justify-between">
              <span>Personalizado</span>
              {atestado.type === 'personalizado' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-700" />}
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">Texto livre</p>
          </button>
        </div>

        {/* Days & Dates configuration (for Repouso) */}
        {atestado.type === 'repouso' && (
          <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Período de Afastamento:
              </label>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {COMMON_DAYS.map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => handleDaysChange(d)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      atestado.days === d
                        ? 'bg-blue-700 text-white shadow-xs'
                        : 'bg-white border border-slate-300 text-slate-700 hover:bg-blue-50 hover:border-blue-300'
                    }`}
                  >
                    {d} {d === 1 ? 'dia' : 'dias'}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <div className="w-32">
                  <label htmlFor="custom-days-input" className="block text-[11px] font-semibold text-slate-500 mb-1">
                    Outro número:
                  </label>
                  <input
                    id="custom-days-input"
                    type="number"
                    min={1}
                    max={180}
                    value={atestado.days}
                    onChange={e => handleDaysChange(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm font-semibold focus:ring-1 focus:ring-blue-600"
                  />
                </div>
                <div className="flex-1 text-xs text-blue-950 bg-white p-2.5 rounded-lg border border-blue-200">
                  <span className="font-bold">Extenso automático:</span> {formatDaysInWords(atestado.days)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-blue-100">
              <div>
                <label htmlFor="start-date-input" className="block text-xs font-semibold text-slate-700 mb-1">
                  A partir de (Data inicial):
                </label>
                <input
                  id="start-date-input"
                  type="date"
                  value={atestado.startDate}
                  onChange={e => handleStartDateChange(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium"
                />
              </div>

              <div>
                <label htmlFor="end-date-input" className="block text-xs font-semibold text-slate-700 mb-1">
                  Até (Data final):
                </label>
                <input
                  id="end-date-input"
                  type="date"
                  value={atestado.endDate}
                  onChange={e => setAtestado({ ...atestado, endDate: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium"
                />
              </div>
            </div>
          </div>
        )}

        {/* Aptidão Física details */}
        {atestado.type === 'aptidao' && (
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <label htmlFor="aptidao-text-area" className="block text-xs font-semibold text-slate-700">
              Declaração de Aptidão Física:
            </label>
            <textarea
              id="aptidao-text-area"
              rows={3}
              value={atestado.customText}
              onChange={e => setAtestado({ ...atestado, customText: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
            />
          </div>
        )}

        {/* Custom text for Personalizado or Acompanhante */}
        {(atestado.type === 'personalizado' || atestado.type === 'acompanhante' || atestado.type === 'comparecimento_pericia') && (
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <label htmlFor="custom-justification-area" className="block text-xs font-semibold text-slate-700">
              Texto do Atestado:
            </label>
            <textarea
              id="custom-justification-area"
              rows={4}
              value={atestado.customText}
              onChange={e => setAtestado({ ...atestado, customText: e.target.value })}
              placeholder="Digite o texto detalhado do atestado médico..."
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:ring-1 focus:ring-blue-600"
            />
          </div>
        )}
      </div>

      {/* CID-10 Section with CFM Ethics Toggle */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <label htmlFor="cid-search-input" className="text-sm font-semibold text-slate-800 flex items-center gap-2.5">
            <span className="h-7 w-7 rounded-lg bg-blue-50 text-blue-700 border border-blue-200/80 flex items-center justify-center shadow-2xs">
              <Shield className="w-4 h-4" strokeWidth={2.25} />
            </span>
            <span>Classificação Internacional de Doenças (CID-10)</span>
          </label>
          <span className="text-[11px] text-slate-400">Resoluções CFM 1.658/02 e 1.851/08</span>
        </div>

        {/* CFM Toggle */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
          <button
            type="button"
            onClick={() => setAtestado({ ...atestado, cidOption: 'sem_cid' })}
            className={`p-2.5 rounded-lg border text-left transition-all ${
              atestado.cidOption === 'sem_cid'
                ? 'border-blue-700 bg-blue-50 text-blue-950 font-semibold ring-1 ring-blue-700'
                : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <div className="text-xs font-semibold">Sem CID (Sigilo Médico)</div>
            <div className="text-[10px] text-slate-500">Padrão ético recomendado pelo CFM</div>
          </button>

          <button
            type="button"
            onClick={() => setAtestado({ ...atestado, cidOption: 'com_cid' })}
            className={`p-2.5 rounded-lg border text-left transition-all ${
              atestado.cidOption === 'com_cid'
                ? 'border-blue-700 bg-blue-50 text-blue-950 font-semibold ring-1 ring-blue-700'
                : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <div className="text-xs font-semibold">Com CID (A pedido do paciente)</div>
            <div className="text-[10px] text-slate-500">Conforme Art. 73 do Código de Ética Médica</div>
          </button>
        </div>

        {atestado.cidOption === 'com_cid' && (
          <div className="pt-2">
            <CidSearchAutocomplete
              selectedCidCode={atestado.cidCode}
              selectedCidDescription={atestado.cidDescription}
              onSelectCid={cid => setAtestado(prev => ({
                ...prev,
                cidCode: cid.code,
                cidDescription: cid.description
              }))}
              onClearCid={() => setAtestado(prev => ({
                ...prev,
                cidCode: '',
                cidDescription: ''
              }))}
              label="Indicação Diagnóstica do Atestado (CID-10)"
              descriptionHint="Selecione o CID-10 solicitado pelo paciente para justificar o repouso"
              showQuickPresets={true}
              placeholder="Digite o código ou nome da patologia (ex: J06, gripe, amigdalite, lombalgia, gastroenterite)..."
            />
          </div>
        )}
      </div>
    </div>
  );
};
