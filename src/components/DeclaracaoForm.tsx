import React from 'react';
import { Clock, User, UserPlus, CheckSquare, Square } from 'lucide-react';
import { DeclaracaoData, PatientInfo } from '../types';

interface DeclaracaoFormProps {
  declaracao: DeclaracaoData;
  setDeclaracao: React.Dispatch<React.SetStateAction<DeclaracaoData>>;
  patient?: PatientInfo;
  onUpdatePatient?: (patient: PatientInfo | ((prev: PatientInfo) => PatientInfo)) => void;
  onNewPatient?: () => void;
}

const COMMON_PURPOSES = [
  'consulta médica eletiva e avaliação diagnóstica',
  'atendimento médico ambulatorial e realização de exames complementares',
  'procedimento clínico e acompanhamento pós-operatório',
  'consulta de retorno e acompanhamento terapêutico'
];

export const DeclaracaoForm: React.FC<DeclaracaoFormProps> = ({
  declaracao,
  setDeclaracao,
  patient,
  onUpdatePatient,
  onNewPatient
}) => {
  const handlePeriodPreset = (start: string, end: string, isAllDay = false) => {
    setDeclaracao(prev => ({
      ...prev,
      startTime: start,
      endTime: end,
      isAllDay
    }));
  };

  return (
    <div className="space-y-6">
      {/* Patient info card */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
        <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-4 flex items-center justify-between flex-wrap gap-2">
          <span className="flex items-center gap-2.5">
            <span className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-sky-500 text-white flex items-center justify-center shadow-xs">
              <User className="w-4 h-4" strokeWidth={2.25} />
            </span>
            <span>Dados do Paciente Atendido</span>
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
            <span className="text-xs text-slate-400 font-normal">Identificação para a declaração</span>
          )}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8">
            <label htmlFor="declaracao-patient-name" className="block text-xs font-semibold text-slate-600 mb-1">
              Nome do Paciente *
            </label>
            <input
              id="declaracao-patient-name"
              type="text"
              value={declaracao.patientName || patient?.name || ''}
              onChange={e => {
                const val = e.target.value;
                setDeclaracao(prev => ({ ...prev, patientName: val }));
                if (onUpdatePatient) {
                  onUpdatePatient(prev => ({ ...prev, name: val }));
                }
              }}
              placeholder="Ex: Nome Completo do Paciente"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-hidden font-medium"
            />
          </div>

          <div className="sm:col-span-4">
            <label htmlFor="declaracao-patient-doc" className="block text-xs font-semibold text-slate-600 mb-1">
              CPF ou RG
            </label>
            <input
              id="declaracao-patient-doc"
              type="text"
              value={declaracao.patientDoc || patient?.document || ''}
              onChange={e => {
                const val = e.target.value;
                setDeclaracao(prev => ({ ...prev, patientDoc: val }));
                if (onUpdatePatient) {
                  onUpdatePatient(prev => ({ ...prev, document: val }));
                }
              }}
              placeholder="000.000.000-00"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Date & Hours Card */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
        <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2.5">
          <span className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-sky-500 text-white flex items-center justify-center shadow-xs">
            <Clock className="w-4 h-4" strokeWidth={2.25} />
          </span>
          <span>Horário de Comparecimento</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div>
            <label htmlFor="declaracao-date" className="block text-xs font-semibold text-slate-600 mb-1">
              Data do Atendimento
            </label>
            <input
              id="declaracao-date"
              type="date"
              value={declaracao.date}
              onChange={e => setDeclaracao({ ...declaracao, date: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-1 focus:ring-blue-500 outline-hidden"
            />
          </div>

          <div>
            <label htmlFor="declaracao-start-time" className="block text-xs font-semibold text-slate-600 mb-1">
              Hora de Início
            </label>
            <input
              id="declaracao-start-time"
              type="time"
              value={declaracao.startTime}
              onChange={e => setDeclaracao({ ...declaracao, startTime: e.target.value })}
              disabled={declaracao.isAllDay}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-1 focus:ring-blue-500 outline-hidden disabled:bg-slate-100"
            />
          </div>

          <div>
            <label htmlFor="declaracao-end-time" className="block text-xs font-semibold text-slate-600 mb-1">
              Hora de Término
            </label>
            <input
              id="declaracao-end-time"
              type="time"
              value={declaracao.endTime}
              onChange={e => setDeclaracao({ ...declaracao, endTime: e.target.value })}
              disabled={declaracao.isAllDay}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-1 focus:ring-blue-500 outline-hidden disabled:bg-slate-100"
            />
          </div>
        </div>

        {/* Shortcuts */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-slate-500 font-medium">Preenchimento rápido:</span>
          <button
            type="button"
            onClick={() => handlePeriodPreset('08:00', '12:00', false)}
            className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-blue-50 hover:text-blue-700 rounded-md border border-slate-200 transition-colors"
          >
            Manhã (08h às 12h)
          </button>
          <button
            type="button"
            onClick={() => handlePeriodPreset('13:30', '17:30', false)}
            className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-blue-50 hover:text-blue-700 rounded-md border border-slate-200 transition-colors"
          >
            Tarde (13h30 às 17h30)
          </button>
          <button
            type="button"
            onClick={() => handlePeriodPreset('08:00', '18:00', true)}
            className={`px-2.5 py-1 text-xs rounded-md border transition-colors ${
              declaracao.isAllDay
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-slate-100 hover:bg-blue-50 hover:text-blue-700 border-slate-200'
            }`}
          >
            Dia Todo
          </button>
        </div>
      </div>

      {/* Purpose / Motivo */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
        <label htmlFor="declaracao-purpose" className="block text-sm font-semibold text-slate-800 mb-2">
          Finalidade do Atendimento
        </label>
        <textarea
          id="declaracao-purpose"
          rows={2}
          value={declaracao.purpose}
          onChange={e => setDeclaracao({ ...declaracao, purpose: e.target.value })}
          placeholder="Ex: realização de consulta médica eletiva e exames complementares"
          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-hidden resize-none"
        />

        <div className="mt-2 flex flex-wrap gap-1.5">
          {COMMON_PURPOSES.map((purp, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setDeclaracao({ ...declaracao, purpose: purp })}
              className="text-[11px] px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
            >
              {purp.slice(0, 36)}...
            </button>
          ))}
        </div>
      </div>

      {/* Acompanhante Toggle */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
        <button
          type="button"
          onClick={() => setDeclaracao({ ...declaracao, isAcompanhante: !declaracao.isAcompanhante })}
          className="flex items-center gap-2.5 text-sm font-semibold text-slate-800 hover:text-blue-700 transition-colors w-full text-left"
        >
          {declaracao.isAcompanhante ? (
            <CheckSquare className="w-5 h-5 text-blue-600 shrink-0" />
          ) : (
            <Square className="w-5 h-5 text-slate-400 shrink-0" />
          )}
          <span>Emitir declaração em favor de Acompanhante Legal</span>
        </button>

        {declaracao.isAcompanhante && (
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-12 gap-3 bg-blue-50/40 p-3 rounded-lg">
            <div className="sm:col-span-8">
              <label htmlFor="acompanhante-name" className="block text-xs font-semibold text-slate-700 mb-1">
                Nome do Acompanhante *
              </label>
              <input
                id="acompanhante-name"
                type="text"
                value={declaracao.acompanhanteName || ''}
                onChange={e => setDeclaracao({ ...declaracao, acompanhanteName: e.target.value })}
                placeholder="Ex: João da Silva Almeida (Acompanhante)"
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div className="sm:col-span-4">
              <label htmlFor="acompanhante-doc" className="block text-xs font-semibold text-slate-700 mb-1">
                CPF / RG do Acompanhante
              </label>
              <input
                id="acompanhante-doc"
                type="text"
                value={declaracao.acompanhanteDoc || ''}
                onChange={e => setDeclaracao({ ...declaracao, acompanhanteDoc: e.target.value })}
                placeholder="000.000.000-00"
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
              />
            </div>
            <p className="sm:col-span-12 text-[11px] text-blue-800">
              O documento declarará que o(a) acompanhante esteve presente prestando assistência ao paciente durante todo o período.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
