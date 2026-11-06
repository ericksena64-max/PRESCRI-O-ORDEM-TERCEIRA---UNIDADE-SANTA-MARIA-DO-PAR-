import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search,
  Sparkles,
  Trash2,
  Printer,
  ChevronDown,
  ChevronUp,
  FlaskConical,
  FileSpreadsheet,
  X,
  Clock,
  ArrowRight,
  ShieldAlert,
  Layers,
  Copy,
  Check,
  Plus,
  FileText
} from 'lucide-react';
import { DoctorProfile, PatientInfo, AihData, ApacData } from '../types';
import {
  EXAMES_CATALOGO,
  CATEGORIAS_CONFIG,
  PERFIS_RAPIDOS,
  searchExames,
  ExameItem,
  CategoriaExameKey
} from '../data/exames-catalogo';
import { CidSearchAutocomplete } from './CidSearchAutocomplete';
import { validateCns, formatCns } from '../utils/cnsValidator';
import { formatDatePtBr } from '../utils/documentLogic';
import { getTodayIso } from '../utils/dateUtils';

export interface SelectedExameItem {
  exame: ExameItem;
  quantidade: number;
  observacao?: string;
  urgente?: boolean;
}

interface ExamesLaboratoriaisViewProps {
  doctor: DoctorProfile;
  patient: PatientInfo;
  setPatient: React.Dispatch<React.SetStateAction<PatientInfo>>;
  aihData?: AihData;
  setAihData?: React.Dispatch<React.SetStateAction<AihData>>;
  apacData?: ApacData;
  setApacData?: React.Dispatch<React.SetStateAction<ApacData>>;
  onSaveToHistory?: (summary: string) => void;
}

export const ExamesLaboratoriaisView: React.FC<ExamesLaboratoriaisViewProps> = ({
  doctor,
  patient,
  setPatient: _setPatient,
  aihData: _aihData,
  setAihData,
  apacData: _apacData,
  setApacData,
  onSaveToHistory
}) => {
  // Estado dos exames selecionados (carrinho)
  const [selectedExames, setSelectedExames] = useState<Map<string, SelectedExameItem>>(() => {
    // Inicializa pré-carregados apenas: Hemograma, Creatinina e PCR
    const initial = new Map<string, SelectedExameItem>();
    const initialIds = ['hmg', 'cre', 'pcr'];
    initialIds.forEach(id => {
      const ex = EXAMES_CATALOGO.find(e => e.id === id);
      if (ex) {
        initial.set(ex.id, { exame: ex, quantidade: 1 });
      }
    });
    return initial;
  });

  // Estado do Omnibox
  const [searchQuery, setSearchQuery] = useState('');
  const [isOmniboxOpen, setIsOmniboxOpen] = useState(false);
  const [selectedSearchIndex, setSelectedSearchIndex] = useState(0);
  const omniboxInputRef = useRef<HTMLInputElement>(null);
  const omniboxContainerRef = useRef<HTMLDivElement>(null);

  // Estado dos acordeões de categorias (todas abertas por padrão)
  const [openCategories, setOpenCategories] = useState<Record<CategoriaExameKey, boolean>>({
    Hematologia: true,
    Coagulação: true,
    'Bioquímica e Eletrólitos': true,
    'Função Hepática': true,
    'Marcadores Cardíacos e Críticos': true,
    'Microbiologia e Culturas': true,
    'Urinálise e Parasitologia': true,
    'Sorologias e Hormônios': true
  });

  // Dados clínicos da solicitação
  const [indicacaoClinica, setIndicacaoClinica] = useState('Avaliação clínica e controle laboratorial de rotina.');
  const [selectedCid, setSelectedCid] = useState<{ code: string; description: string } | undefined>(undefined);
  const [jejumObrigatorio, setJejumObrigatorio] = useState(true);
  const [dataSolicitacao, setDataSolicitacao] = useState(() => getTodayIso());
  const [horaSolicitacao, setHoraSolicitacao] = useState(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  });

  // Modo de visualização: 'catalogo' ou 'impressao' (Guia A4 SADT)
  const [viewMode, setViewMode] = useState<'catalogo' | 'impressao'>('catalogo');
  const [copiedText, setCopiedText] = useState(false);
  const [aihLinkedSuccess, setAihLinkedSuccess] = useState(false);
  const [apacLinkedSuccess, setApacLinkedSuccess] = useState(false);

  // Estado para inserção de exame fora da lista
  const [customExameNome, setCustomExameNome] = useState('');
  const [customExameAmostra, setCustomExameAmostra] = useState('');
  const [customExameUrgente, setCustomExameUrgente] = useState(false);
  const [outrosExamesTexto, setOutrosExamesTexto] = useState('');

  const handleAddCustomExame = (e?: React.FormEvent, nomeManual?: string) => {
    if (e) e.preventDefault();
    const nomeLimpo = (nomeManual || customExameNome).trim();
    if (!nomeLimpo) return;

    // Gera uma sigla concisa a partir do nome
    const palavras = nomeLimpo.split(/\s+/).filter(Boolean);
    let sigla = 'OUTRO';
    if (palavras.length === 1) {
      sigla = palavras[0].slice(0, 4).toUpperCase();
    } else if (palavras.length >= 2) {
      sigla = palavras.map(p => p[0]).join('').slice(0, 5).toUpperCase();
    }

    const customId = `custom-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const customExame: ExameItem = {
      id: customId,
      codigoSigtap: '0202010600',
      codigoFormatado: 'Fora da Lista',
      nomeOficial: nomeLimpo.toUpperCase(),
      termoClinico: nomeLimpo,
      sigla,
      categoria: 'Bioquímica e Eletrólitos',
      instrumento: 'BPA-I / SADT',
      complexidade: 'Média Complexidade (MAC)',
      exigeCid: false,
      exigeCns: false,
      amostra: customExameAmostra.trim() || 'Amostra Biológica',
      tubo: customExameAmostra.trim() || 'Conforme orientação do laboratório',
      prazoEstimado: 'Rotina'
    };

    setSelectedExames(prev => {
      const next = new Map(prev);
      next.set(customId, {
        exame: customExame,
        quantidade: 1,
        urgente: customExameUrgente
      });
      return next;
    });

    setCustomExameNome('');
    setCustomExameAmostra('');
    setCustomExameUrgente(false);
  };

  // Atalho de teclado global: tecla "/" foca o omnibox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignora se estiver digitando em outro input/textarea
      const target = e.target as HTMLElement;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      if (e.key === '/') {
        e.preventDefault();
        omniboxInputRef.current?.focus();
        setIsOmniboxOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fecha omnibox ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (omniboxContainerRef.current && !omniboxContainerRef.current.contains(e.target as Node)) {
        setIsOmniboxOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Resultados da busca omnibox
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchExames(searchQuery).slice(0, 8);
  }, [searchQuery]);

  // Navegação no dropdown via teclado (Setas e Enter)
  const handleOmniboxKeyDown = (e: React.KeyboardEvent) => {
    if (!isOmniboxOpen || searchResults.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedSearchIndex(prev => (prev + 1) % searchResults.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedSearchIndex(prev => (prev - 1 + searchResults.length) % searchResults.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const chosen = searchResults[selectedSearchIndex];
      if (chosen) {
        toggleExame(chosen);
        setSearchQuery('');
        setIsOmniboxOpen(false);
      }
    } else if (e.key === 'Escape') {
      setIsOmniboxOpen(false);
    }
  };

  // Alterna a seleção de um exame
  const toggleExame = (exame: ExameItem) => {
    setSelectedExames(prev => {
      const next = new Map(prev);
      if (next.has(exame.id)) {
        next.delete(exame.id);
      } else {
        next.set(exame.id, { exame, quantidade: 1 });
      }
      return next;
    });
  };

  // Altera quantidade de amostras (ex: 2 frascos de Hemocultura)
  const setItemQuantidade = (id: string, quantidade: number) => {
    if (quantidade < 1) return;
    setSelectedExames(prev => {
      const next = new Map(prev);
      const item = next.get(id);
      if (item) {
        next.set(id, { ...item, quantidade });
      }
      return next;
    });
  };

  // Alterna status de urgência do item
  const toggleUrgente = (id: string) => {
    setSelectedExames(prev => {
      const next = new Map(prev);
      const item = next.get(id);
      if (item) {
        next.set(id, { ...item, urgente: !item.urgente });
      }
      return next;
    });
  };

  // Remove um exame
  const removeExame = (id: string) => {
    setSelectedExames(prev => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  };

  // Limpa todos os exames selecionados
  const clearAllExames = () => {
    if (selectedExames.size > 0 && !window.confirm('Deseja remover todos os exames da solicitação atual?')) {
      return;
    }
    setSelectedExames(new Map());
  };

  // Seleciona ou remove perfil rápido completo
  const togglePerfilRapido = (perfil: (typeof PERFIS_RAPIDOS)[0]) => {
    const todosSelecionados = perfil.exameIds.every(id => selectedExames.has(id));

    setSelectedExames(prev => {
      const next = new Map(prev);
      if (todosSelecionados) {
        // Desmarca todos do perfil
        perfil.exameIds.forEach(id => next.delete(id));
      } else {
        // Marca todos do perfil
        perfil.exameIds.forEach(id => {
          const ex = EXAMES_CATALOGO.find(e => e.id === id);
          if (ex) {
            // Se for hemocultura no protocolo de sepse, sugere 2 amostras
            const qtd = (id === 'hmc' && perfil.id === 'protocolo-sepse') || (id === 'baar' && perfil.id === 'investigacao-tb') ? 2 : 1;
            next.set(ex.id, { exame: ex, quantidade: qtd });
          }
        });
      }
      return next;
    });
  };

  // Seleciona todos os exames de uma categoria específica
  const selectAllCategory = (categoria: CategoriaExameKey) => {
    const examesDaCat = EXAMES_CATALOGO.filter(e => e.categoria === categoria);
    setSelectedExames(prev => {
      const next = new Map(prev);
      examesDaCat.forEach(ex => {
        if (!next.has(ex.id)) {
          next.set(ex.id, { exame: ex, quantidade: 1 });
        }
      });
      return next;
    });
  };

  // Desmarca todos os exames de uma categoria específica
  const deselectAllCategory = (categoria: CategoriaExameKey) => {
    const examesDaCat = EXAMES_CATALOGO.filter(e => e.categoria === categoria);
    setSelectedExames(prev => {
      const next = new Map(prev);
      examesDaCat.forEach(ex => next.delete(ex.id));
      return next;
    });
  };

  // Toggle de todos os acordeões de categoria
  const toggleAllAccordions = (expand: boolean) => {
    const updated = {} as Record<CategoriaExameKey, boolean>;
    (Object.keys(CATEGORIAS_CONFIG) as CategoriaExameKey[]).forEach(k => {
      updated[k] = expand;
    });
    setOpenCategories(updated);
  };

  // Validação de CNS do paciente
  const cnsValidation = useMemo(() => {
    if (!patient.cns) return null;
    return validateCns(patient.cns);
  }, [patient.cns]);

  // Lista dos exames selecionados como array
  const selectedList = useMemo(() => Array.from(selectedExames.values()), [selectedExames]);

  // Verifica se há exames que exigem CID-10 ou CNS obrigatório
  const examesExigindoCid = useMemo(() => selectedList.filter(item => item.exame.exigeCid), [selectedList]);
  const examesExigindoCns = useMemo(() => selectedList.filter(item => item.exame.exigeCns), [selectedList]);

  const hasCidInconsistency = examesExigindoCid.length > 0 && !selectedCid;
  const hasCnsInconsistency = examesExigindoCns.length > 0 && (!patient.cns || !cnsValidation?.isValid);

  // Vincula os exames selecionados como procedimentos secundários da AIH ativa
  const vincularAihSecundarios = () => {
    if (!setAihData) return;

    const novosProcedimentos = selectedList.map(item => ({
      codigo: item.exame.codigoSigtap,
      descricao: `${item.exame.termoClinico} (${item.exame.sigla})`,
      quantidade: item.quantidade
    }));

    setAihData(prev => ({
      ...prev,
      procedimentosSecundarios: novosProcedimentos,
      cid10Secundario: selectedCid?.code || prev.cid10Secundario
    }));

    setAihLinkedSuccess(true);
    setTimeout(() => setAihLinkedSuccess(false), 3000);
  };

  // Vincula os exames selecionados como procedimento principal (Campo 18 e 19) e secundários na APAC
  const vincularApac = () => {
    if (!setApacData || selectedList.length === 0) return;

    // O 1º exame da solicitação médica vira o Procedimento Principal (Campos 18 e 19)
    const principal = selectedList[0];
    const secundarios = selectedList.slice(1, 6).map((item, idx) => ({
      id: `sec-${Date.now()}-${idx}`,
      codigo: item.exame.codigoSigtap.replace(/\D/g, ''),
      nome: item.exame.nomeOficial,
      quantidade: String(item.quantidade).padStart(2, '0')
    }));

    setApacData(prev => ({
      ...prev,
      codigoProcedimentoPrincipal: principal.exame.codigoSigtap.replace(/\D/g, ''),
      nomeProcedimentoPrincipal: principal.exame.nomeOficial,
      quantidadePrincipal: String(principal.quantidade).padStart(2, '0'),
      procedimentosSecundarios: secundarios,
      cid10Principal: selectedCid?.code || prev.cid10Principal || 'A49.9',
      descricaoDiagnostico: selectedCid?.description || indicacaoClinica || prev.descricaoDiagnostico,
      observacoes: `Solicitação médica de exames laboratoriais complementares. ${indicacaoClinica}`
    }));

    setApacLinkedSuccess(true);
    setTimeout(() => setApacLinkedSuccess(false), 3000);
  };

  // Formata texto limpo para cópia / WhatsApp
  const handleCopyFormattedText = () => {
    const lines: string[] = [
      `🧪 *SOLICITAÇÃO DE EXAMES LABORATORIAIS (SADT / SUS)*`,
      `🏥 *Hospital:* ${doctor.clinicName}`,
      `👤 *Paciente:* ${patient.name || 'Não informado'} (${patient.age || 'Sem idade'}) • Leito: ${patient.bed || 'Ambulatório'}`,
      patient.document ? `📄 *Prontuário/CPF:* ${patient.document}` : '',
      patient.cns ? `💳 *Cartão SUS (CNS):* ${formatCns(patient.cns)}` : '',
      `📋 *Indicação Clínica:* ${indicacaoClinica}`,
      selectedCid ? `🩺 *CID-10:* ${selectedCid.code} - ${selectedCid.description}` : '',
      ``,
      `*EXAMES SOLICITADOS (${selectedList.length}):*`
    ].filter(Boolean);

    selectedList.forEach((item, idx) => {
      lines.push(`${idx + 1}. [${item.exame.sigla}] ${item.exame.termoClinico} (SIGTAP: ${item.exame.codigoFormatado}) - Qtd: ${item.quantidade}${item.urgente ? ' [URGENTE]' : ''}`);
    });

    lines.push(``);
    lines.push(`👨‍⚕️ *Médico Solicitante:* ${doctor.fullName} - CRM/${doctor.uf} ${doctor.crm}`);
    lines.push(`📅 *Data:* ${formatDatePtBr(dataSolicitacao)} às ${horaSolicitacao}`);

    navigator.clipboard.writeText(lines.join('\n'));
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  // Dispara impressão do documento SADT A4
  const handlePrintSadt = () => {
    if (onSaveToHistory) {
      onSaveToHistory(`Pedido de Exames SADT (${selectedList.length} itens) - ${patient.name || 'Paciente'}`);
    }
    setViewMode('impressao');
    setTimeout(() => {
      window.print();
    }, 250);
  };

  // Sugestões de hipóteses diagnósticas comuns
  const sugestoesIndicacao = [
    'Avaliação pré-operatória e risco cirúrgico',
    'Protocolo de Sepse / Foco infeccioso a esclarecer',
    'Síndrome Coronariana Aguda / Dor torácica típica',
    'Controle glicêmico e metabólico do paciente internado',
    'Investigação de Icterícia e dor abdominal aguda',
    'Suspeita de Tuberculose pulmonar ativa'
  ];

  return (
    <div className="w-full space-y-5">
      {/* Dynamic Print CSS - GARANTIA RIGOROSA DE 1 ÚNICA PÁGINA A4 */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait !important;
            margin: 6mm 8mm !important;
          }
          html, body {
            width: 100% !important;
            height: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            overflow: hidden !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
          .sadt-print-sheet {
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            max-height: 284mm !important;
            min-height: 0 !important;
            height: 100% !important;
            page-break-after: avoid !important;
            page-break-before: avoid !important;
            page-break-inside: avoid !important;
          }
          .sadt-print-sheet * {
            page-break-inside: avoid !important;
          }
          table, tr, td, th {
            page-break-inside: avoid !important;
            page-break-after: avoid !important;
          }
        }
      `}</style>

      {/* HEADER DA ABA SADT (Hidden during print) */}
      <div className="no-print bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-5 rounded-2xl border border-blue-900/60 shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-80 opacity-10 pointer-events-none flex items-center justify-end pr-8">
          <FlaskConical className="w-48 h-48 text-sky-400" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-400/30">
                <FlaskConical className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                Solicitação de Exames Laboratoriais
              </h1>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-sky-500 text-slate-950 px-2 py-0.5 rounded-full shadow-2xs">
                SADT • SUS • SIGTAP
              </span>
            </div>
            <p className="text-xs sm:text-sm text-blue-200/80 max-w-2xl">
              Catálogo oficial DATASUS integrado com busca omnibox veloz, combos clínicos em 1 clique e conferência automática de Cartão SUS e CID-10.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {viewMode === 'impressao' ? (
              <button
                type="button"
                onClick={() => setViewMode('catalogo')}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-700"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                Voltar à Edição
              </button>
            ) : null}

            <button
              type="button"
              onClick={handleCopyFormattedText}
              className="px-3 py-2 bg-blue-900/80 hover:bg-blue-800 text-blue-100 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 border border-blue-700/60"
              title="Copiar texto da solicitação"
            >
              {copiedText ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedText ? 'Copiado!' : 'Copiar'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrintSadt}
              disabled={selectedList.length === 0}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white rounded-xl text-xs sm:text-sm font-black shadow-md shadow-blue-500/30 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir SADT ({selectedList.length})</span>
            </button>
          </div>
        </div>

        {/* 1. BUSCA OMNIBOX INTELIGENTE */}
        <div ref={omniboxContainerRef} className="mt-5 relative z-20">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-sky-400" />
            <input
              ref={omniboxInputRef}
              type="text"
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setIsOmniboxOpen(true);
                setSelectedSearchIndex(0);
              }}
              onFocus={() => setIsOmniboxOpen(true)}
              onKeyDown={handleOmniboxKeyDown}
              placeholder="Digite a sigla (ex: HMG, TGO, TAP, EAS), nome clínico (Ureia, Bilirrubinas) ou código SIGTAP..."
              className="w-full pl-12 pr-28 py-3 bg-white/10 hover:bg-white/15 focus:bg-white text-white focus:text-slate-900 placeholder:text-blue-200/60 focus:placeholder:text-slate-400 text-sm font-semibold rounded-xl border border-white/20 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 outline-hidden transition-all shadow-inner"
            />
            <div className="absolute right-3 top-2.5 flex items-center gap-1.5">
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-white/10 text-blue-200 font-mono text-[11px] font-bold border border-white/15">
                Atalho: /
              </span>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-1 rounded-md text-blue-200 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Dropdown de Auto-Complete do Omnibox */}
          {isOmniboxOpen && (searchResults.length > 0 || searchQuery.trim().length > 0) && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 text-slate-900 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="p-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <span>{searchResults.length > 0 ? `Resultados Encontrados (${searchResults.length})` : 'Exame Não Listado no Catálogo Padrão'}</span>
                <span className="font-normal text-slate-400">Pressione ↑ ↓ e Enter para adicionar</span>
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {searchResults.map((exame, idx) => {
                  const isSelected = selectedExames.has(exame.id);
                  const isFocused = idx === selectedSearchIndex;
                  return (
                    <div
                      key={exame.id}
                      onClick={() => {
                        toggleExame(exame);
                        setSearchQuery('');
                        setIsOmniboxOpen(false);
                      }}
                      onMouseEnter={() => setSelectedSearchIndex(idx)}
                      className={`p-3 cursor-pointer flex items-center justify-between gap-3 transition-colors ${
                        isFocused ? 'bg-sky-50/90' : isSelected ? 'bg-blue-50/50' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className={`px-2 py-1 rounded-lg text-xs font-black uppercase tracking-wider shrink-0 ${
                          isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-800 border border-slate-200'
                        }`}>
                          {exame.sigla}
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-sm text-slate-950 truncate">
                              {exame.termoClinico}
                            </span>
                            <span className="text-[10px] font-medium text-slate-400 font-mono">
                              SIGTAP: {exame.codigoFormatado}
                            </span>
                            {exame.exigeCid && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-sm bg-amber-100 text-amber-800 border border-amber-200">
                                Exige CID-10
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 truncate mt-0.5">
                            {exame.categoria} • {exame.amostra} ({exame.tubo})
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] font-medium text-slate-400 hidden sm:inline">
                          {exame.prazoEstimado}
                        </span>
                        <span className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-blue-600 hover:text-white'
                        }`}>
                          {isSelected ? <Check className="w-4 h-4" /> : '+ Adicionar'}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Opção Rápida de Adicionar o Termo Digitado como Exame Fora da Lista */}
                {searchQuery.trim().length > 0 && (
                  <div
                    onClick={() => {
                      handleAddCustomExame(undefined, searchQuery.trim());
                      setSearchQuery('');
                      setIsOmniboxOpen(false);
                    }}
                    className="p-3 bg-amber-50 hover:bg-amber-100 cursor-pointer flex items-center justify-between gap-3 text-amber-950 font-semibold border-t border-amber-200 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="p-1 rounded bg-amber-500 text-white font-black text-xs">✚</span>
                      <span className="text-xs">
                        Adicionar <strong>&quot;{searchQuery.trim()}&quot;</strong> como exame fora da lista
                      </span>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded-full">
                      Exame Avulso
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 2. BARRA DE COMBOS / PERFIS RÁPIDOS (1 CLIQUE) */}
        <div className="mt-5 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-sky-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Perfis Rápidos de Prescrição (Seleção em 1 Clique):
            </span>
            <span className="text-[11px] text-blue-200/60 hidden sm:inline">
              Clique para ativar ou desativar o pacote completo
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {PERFIS_RAPIDOS.map(perfil => {
              const selecionadosDoPerfil = perfil.exameIds.filter(id => selectedExames.has(id)).length;
              const isAtivo = selecionadosDoPerfil === perfil.exameIds.length && perfil.exameIds.length > 0;
              const isParcial = selecionadosDoPerfil > 0 && !isAtivo;

              return (
                <button
                  key={perfil.id}
                  type="button"
                  onClick={() => togglePerfilRapido(perfil)}
                  className={`p-2.5 rounded-xl border text-left transition-all relative overflow-hidden group ${
                    isAtivo
                      ? perfil.corAtivo
                      : isParcial
                      ? 'bg-blue-900/60 border-sky-400/80 text-white shadow-xs'
                      : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-xs font-bold leading-tight truncate">
                      {perfil.nome}
                    </span>
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full shrink-0 ${
                      isAtivo
                        ? 'bg-white text-slate-900'
                        : isParcial
                        ? 'bg-sky-400 text-slate-950 font-black'
                        : 'bg-white/10 text-blue-200'
                    }`}>
                      {isAtivo ? '✓ Ativo' : isParcial ? `${selecionadosDoPerfil}/${perfil.exameIds.length}` : perfil.badge}
                    </span>
                  </div>
                  <p className="text-[10.5px] opacity-75 line-clamp-1 leading-snug">
                    {perfil.subtitulo}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* SEÇÃO PRINCIPAL (2 COLUNAS) OU MODO DE IMPRESSÃO A4 */}
      {viewMode === 'catalogo' ? (
        <div className="no-print grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* ========================================== */}
          {/* COLUNA ESQUERDA: CATÁLOGO POR CATEGORIAS   */}
          {/* ========================================== */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-4">
            {/* QUADRO PARA INSERIR EXAME FORA DA LISTA */}
            <div className="bg-gradient-to-r from-amber-50/90 via-orange-50/30 to-amber-50/70 p-4 rounded-2xl border-2 border-amber-300 shadow-xs space-y-3">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2.5">
                  <span className="h-8 w-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black text-base shadow-xs">
                    ✚
                  </span>
                  <div>
                    <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-amber-950">
                      Quadro para Inserir Exame Fora da Lista
                    </h3>
                    <p className="text-[11px] text-amber-900/80">
                      Cadastre exames laboratoriais complementares ou procedimentos diagnósticos não tabelados
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-200 text-amber-950 border border-amber-300">
                  Exame Avulso
                </span>
              </div>

              <form onSubmit={handleAddCustomExame} className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 pt-1">
                <div className="sm:col-span-6">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Nome do Exame Fora da Lista *
                  </label>
                  <input
                    type="text"
                    value={customExameNome}
                    onChange={e => setCustomExameNome(e.target.value)}
                    placeholder="Ex: Calprotectina fecal, Anti-TPO, Dosagem de Lítio, Cobre..."
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-hidden text-slate-900 placeholder:text-slate-400"
                  />
                </div>

                <div className="sm:col-span-4">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Amostra / Tubo / Frasco (Opcional)
                  </label>
                  <input
                    type="text"
                    value={customExameAmostra}
                    onChange={e => setCustomExameAmostra(e.target.value)}
                    placeholder="Ex: Fezes frescas, Soro tubo amarelo, EDTA..."
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-hidden text-slate-800 placeholder:text-slate-400"
                  />
                </div>

                <div className="sm:col-span-2 flex items-end">
                  <button
                    type="submit"
                    disabled={!customExameNome.trim()}
                    className="w-full py-2 px-3 bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white rounded-lg text-xs font-black shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Adicionar</span>
                  </button>
                </div>
              </form>
            </div>
            {/* Controles de Expansão e Filtro Rápido */}
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-lg bg-blue-50 text-blue-600">
                  <Layers className="w-4 h-4" />
                </span>
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Catálogo por Especialidade
                </span>
                <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                  ({EXAMES_CATALOGO.length} exames disponíveis)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleAllAccordions(true)}
                  className="px-2 py-1 text-slate-600 hover:text-slate-900 text-xs font-semibold rounded-md hover:bg-slate-100 transition-colors"
                >
                  Expandir Todos
                </button>
                <span className="text-slate-300">|</span>
                <button
                  type="button"
                  onClick={() => toggleAllAccordions(false)}
                  className="px-2 py-1 text-slate-600 hover:text-slate-900 text-xs font-semibold rounded-md hover:bg-slate-100 transition-colors"
                >
                  Recolher Todos
                </button>
              </div>
            </div>

            {/* Categorias Accordions */}
            {(Object.keys(CATEGORIAS_CONFIG) as CategoriaExameKey[]).map(catKey => {
              const config = CATEGORIAS_CONFIG[catKey];
              const examesDaCat = EXAMES_CATALOGO.filter(e => e.categoria === catKey);
              const selecionadosCount = examesDaCat.filter(e => selectedExames.has(e.id)).length;
              const isOpen = openCategories[catKey] ?? true;

              return (
                <div
                  key={catKey}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    selecionadosCount > 0
                      ? 'border-blue-300 bg-white shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  {/* Category Header */}
                  <div
                    onClick={() => setOpenCategories(prev => ({ ...prev, [catKey]: !prev[catKey] }))}
                    className={`p-3.5 flex items-center justify-between cursor-pointer select-none bg-gradient-to-r ${config.corBg} border-b ${config.corBorda}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="h-7 w-7 rounded-lg bg-white shadow-2xs flex items-center justify-center text-slate-700 font-bold text-xs border border-slate-200">
                        {examesDaCat.length}
                      </span>
                      <div>
                        <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                          {config.nome}
                          {selecionadosCount > 0 && (
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-600 text-white shadow-2xs">
                              {selecionadosCount} selecionado{selecionadosCount > 1 ? 's' : ''}
                            </span>
                          )}
                        </h3>
                        <p className="text-[11px] text-slate-500 leading-tight hidden sm:block">
                          {config.descricao}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          if (selecionadosCount === examesDaCat.length) {
                            deselectAllCategory(catKey);
                          } else {
                            selectAllCategory(catKey);
                          }
                        }}
                        className="px-2 py-1 text-[11px] font-bold text-blue-700 hover:text-blue-900 bg-white/80 hover:bg-white rounded-md border border-blue-200 shadow-2xs transition-colors"
                      >
                        {selecionadosCount === examesDaCat.length ? 'Desmarcar todos' : 'Marcar todos'}
                      </button>

                      <span className="p-1 text-slate-400 hover:text-slate-600">
                        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </span>
                    </div>
                  </div>

                  {/* Category Items Grid */}
                  {isOpen && (
                    <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {examesDaCat.map(exame => {
                        const isChecked = selectedExames.has(exame.id);
                        return (
                          <label
                            key={exame.id}
                            className={`p-2.5 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all select-none ${
                              isChecked
                                ? 'bg-blue-50/80 border-blue-400 shadow-2xs ring-1 ring-blue-400/30'
                                : 'bg-slate-50/50 hover:bg-slate-100/70 border-slate-200'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleExame(exame)}
                              className="mt-1 h-4 w-4 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 shrink-0 cursor-pointer"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-1">
                                <span className="font-extrabold text-xs text-slate-900 group-hover:text-blue-700">
                                  {exame.termoClinico}
                                </span>
                                <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-md uppercase tracking-wider shrink-0 ${
                                  isChecked
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-slate-700 border border-slate-200'
                                }`}>
                                  {exame.sigla}
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-1 flex-wrap">
                                <span className="font-mono text-slate-600 font-medium">
                                  {exame.codigoFormatado}
                                </span>
                                <span>•</span>
                                <span className="truncate" title={`${exame.amostra} (${exame.tubo})`}>
                                  {exame.tubo}
                                </span>
                              </div>

                              {(exame.exigeCid || exame.exigeCns) && (
                                <div className="mt-1.5 flex items-center gap-1 flex-wrap">
                                  {exame.exigeCid && (
                                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-sm bg-amber-100 text-amber-800 border border-amber-300">
                                      Exige CID
                                    </span>
                                  )}
                                  {exame.exigeCns && (
                                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-sm bg-blue-100 text-blue-800 border border-blue-300">
                                      BPA-I / CNS
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ======================================================== */}
          {/* COLUNA DIREITA: EXAMES SELECIONADOS ("CARRINHO SADT")    */}
          {/* ======================================================== */}
          <div className="lg:col-span-5 xl:col-span-4 sticky top-20 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
              {/* Card Header */}
              <div className="p-4 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-md bg-sky-500/20 text-sky-400">
                    <FlaskConical className="w-4 h-4" />
                  </span>
                  <h2 className="text-sm font-extrabold tracking-tight">
                    Solicitação SADT
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-sky-400 text-slate-950 shadow-2xs">
                    {selectedList.length} {selectedList.length === 1 ? 'exame' : 'exames'}
                  </span>
                  {selectedList.length > 0 && (
                    <button
                      type="button"
                      onClick={clearAllExames}
                      className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                      title="Limpar seleção"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Patient Identification Quick Card */}
              <div className="p-3 bg-slate-50 border-b border-slate-200 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-600 uppercase text-[10px]">Paciente:</span>
                  <span className="font-bold text-blue-900">
                    {patient.bed ? `Leito: ${patient.bed}` : 'Ambulatório / SADT'}
                  </span>
                </div>
                <p className="font-black text-slate-950 truncate text-sm">
                  {patient.name || 'Paciente Não Identificado'}
                </p>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 flex-wrap">
                  {patient.age && <span>{patient.age}</span>}
                  {patient.document && <span>• Doc: {patient.document}</span>}
                  {patient.cns && (
                    <span className={`font-semibold ${cnsValidation?.isValid ? 'text-emerald-700' : 'text-rose-700 font-bold'}`}>
                      • CNS: {formatCns(patient.cns)} {cnsValidation?.isValid ? '✓' : '(Inválido)'}
                    </span>
                  )}
                </div>
              </div>

              {/* Inconsistências / Alertas DATASUS */}
              {(hasCidInconsistency || hasCnsInconsistency) && (
                <div className="p-3 bg-amber-50 border-b border-amber-200 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900">
                    <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Conferência de Faturamento SUS:</span>
                  </div>
                  {hasCidInconsistency && (
                    <p className="text-[11px] text-amber-800 leading-snug">
                      • <strong>{examesExigindoCid.length}</strong> exame(s) exigem indicação de <strong>CID-10</strong> obrigatório para aprovação no DATASUS.
                    </p>
                  )}
                  {hasCnsInconsistency && (
                    <p className="text-[11px] text-amber-800 leading-snug">
                      • <strong>{examesExigindoCns.length}</strong> exame(s) exigem <strong>Cartão SUS (CNS) válido</strong> com dígito verificador.
                    </p>
                  )}
                </div>
              )}

              {/* Clinical Indication & CID-10 Form */}
              <div className="p-4 space-y-3 border-b border-slate-200 bg-white">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Indicação Clínica / Suspeita Diagnóstica *
                  </label>
                  <textarea
                    rows={2}
                    value={indicacaoClinica}
                    onChange={e => setIndicacaoClinica(e.target.value)}
                    placeholder="Ex: Investigação de sepse foco pulmonar, reavaliação de anemia..."
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-hidden"
                  />
                  {/* Chips de preenchimento rápido */}
                  <div className="flex items-center gap-1 flex-wrap mt-1.5">
                    {sugestoesIndicacao.slice(0, 3).map((sug, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setIndicacaoClinica(sug)}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-900 border border-slate-200 transition-colors"
                      >
                        {sug.split(' ')[0]} {sug.split(' ')[1]}...
                      </button>
                    ))}
                  </div>
                </div>

                {/* Seleção Rápida de CID-10 */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    CID-10 Principal (Opcional / Obrigatório p/ procedimentos especiais)
                  </label>
                  <CidSearchAutocomplete
                    selectedCidCode={selectedCid?.code}
                    selectedCidDescription={selectedCid?.description}
                    onSelectCid={cid => setSelectedCid({ code: cid.code, description: cid.description })}
                    onClearCid={() => setSelectedCid(undefined)}
                    placeholder="Buscar CID-10 (ex: A49.9, J18, I20, K52)..."
                  />
                </div>

                {/* Checkbox de Jejum e Horários */}
                <div className="pt-2 flex items-center justify-between text-xs text-slate-700">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={jejumObrigatorio}
                      onChange={e => setJejumObrigatorio(e.target.checked)}
                      className="rounded-sm border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="font-semibold">Requer jejum de 8 a 12h</span>
                  </label>

                  <div className="flex items-center gap-1.5">
                    <input
                      type="date"
                      value={dataSolicitacao}
                      onChange={e => setDataSolicitacao(e.target.value)}
                      className="text-xs border border-slate-300 rounded-md px-1.5 py-0.5 font-semibold text-slate-700"
                      title="Data da Solicitação"
                    />
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="time"
                      value={horaSolicitacao}
                      onChange={e => setHoraSolicitacao(e.target.value)}
                      className="text-xs border border-slate-300 rounded-md px-1.5 py-0.5 font-semibold text-slate-700"
                      title="Hora da Solicitação"
                    />
                  </div>
                </div>

                {/* Quadro de Exames Fora da Lista / Observações Complementares ao Laboratório */}
                <div className="pt-2 border-t border-slate-200">
                  <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-blue-600" />
                      <span>Quadro de Exames Fora da Lista / Obs.</span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-normal">Sai na folha impressa</span>
                  </label>
                  <textarea
                    rows={2}
                    value={outrosExamesTexto}
                    onChange={e => setOutrosExamesTexto(e.target.value)}
                    placeholder="Ex: Realizar também pesquisa de sangue oculto em 3 amostras, dosagem de lítio ou outras orientações ao laboratório..."
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-hidden text-slate-800 placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Lista com Rolagem dos Itens Selecionados */}
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 p-2">
                {selectedList.length === 0 ? (
                  <div className="py-8 text-center text-slate-400">
                    <FlaskConical className="w-8 h-8 text-slate-300 mx-auto mb-2 opacity-50" />
                    <p className="text-xs font-semibold">Nenhum exame selecionado ainda.</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Utilize a barra de busca, o quadro de exames fora da lista ou escolha um dos combos rápidos acima.
                    </p>
                  </div>
                ) : (
                  selectedList.map((item, idx) => (
                    <div
                      key={item.exame.id}
                      className="p-2 flex items-center justify-between gap-2 hover:bg-slate-50 rounded-lg group"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-[11px] font-bold text-slate-400 w-4 text-center shrink-0">
                          {idx + 1}
                        </span>
                        <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-blue-100 text-blue-900 shrink-0 uppercase">
                          {item.exame.sigla}
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="text-xs font-bold text-slate-900 truncate">
                              {item.exame.termoClinico}
                            </p>
                            {item.exame.codigoFormatado === 'Fora da Lista' && (
                              <span className="text-[9px] px-1.5 py-0.2 bg-amber-100 text-amber-900 font-extrabold rounded-sm border border-amber-300">
                                Avulso
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 truncate">
                            {item.exame.tubo}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {/* Seletor de quantidade de amostras */}
                        <div className="flex items-center border border-slate-200 rounded-md bg-white">
                          <button
                            type="button"
                            onClick={() => setItemQuantidade(item.exame.id, item.quantidade - 1)}
                            className="px-1.5 py-0.5 text-xs text-slate-500 hover:text-slate-800 disabled:opacity-30"
                            disabled={item.quantidade <= 1}
                          >
                            -
                          </button>
                          <span className="px-1.5 text-xs font-bold text-slate-800">
                            {item.quantidade}x
                          </span>
                          <button
                            type="button"
                            onClick={() => setItemQuantidade(item.exame.id, item.quantidade + 1)}
                            className="px-1.5 py-0.5 text-xs text-slate-500 hover:text-slate-800"
                          >
                            +
                          </button>
                        </div>

                        {/* Botão de urgência */}
                        <button
                          type="button"
                          onClick={() => toggleUrgente(item.exame.id)}
                          className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold transition-colors ${
                            item.urgente
                              ? 'bg-rose-600 text-white'
                              : 'bg-slate-100 text-slate-500 hover:text-rose-600'
                          }`}
                          title="Marcar como URGENTE"
                        >
                          {item.urgente ? 'URG' : 'Rotina'}
                        </button>

                        {/* Botão de remover */}
                        <button
                          type="button"
                          onClick={() => removeExame(item.exame.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                          title="Remover exame"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Rodapé de Ações do Carrinho */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-2">
                <button
                  type="button"
                  onClick={handlePrintSadt}
                  disabled={selectedList.length === 0}
                  className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white rounded-xl text-sm font-black shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Printer className="w-4 h-4" />
                  <span>Gerar Pedido / Imprimir SADT</span>
                </button>

                {setAihData && (
                  <button
                    type="button"
                    onClick={vincularAihSecundarios}
                    disabled={selectedList.length === 0}
                    className="w-full py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                    title="Copia os exames selecionados como procedimentos secundários da AIH ativa"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" />
                    <span>
                      {aihLinkedSuccess ? '✓ Exames Vinculados à AIH!' : 'Vincular à AIH Ativa (Procedimentos Secundários)'}
                    </span>
                  </button>
                )}

                {setApacData && (
                  <button
                    type="button"
                    onClick={vincularApac}
                    disabled={selectedList.length === 0}
                    className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-300 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                    title="Preenche automaticamente os campos 18, 19 e secundários do Laudo de APAC com a solicitação médica"
                  >
                    <Layers className="w-3.5 h-3.5 text-blue-700" />
                    <span>
                      {apacLinkedSuccess ? '✓ Vinculado à APAC (Campos 18/19)!' : 'Vincular à APAC (Campos 18 e 19 Automáticos)'}
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* ========================================================================= */}
      {/* 4. GUIA OFICIAL DE SOLICITAÇÃO SADT PRONTA PARA IMPRESSÃO EM FOLHA A4     */}
      {/* ========================================================================= */}
      <div className={`${viewMode === 'impressao' ? 'block' : 'hidden'} print:block w-full flex justify-center`}>
        <div className="sadt-print-sheet bg-white text-slate-900 border border-slate-300 shadow-xl w-full max-w-[210mm] max-h-[295mm] p-5 sm:p-6 flex flex-col justify-between font-sans relative overflow-hidden">
          {/* Marca d'água Hospitalar Oficial de Santa Maria do Pará */}
          <div className="absolute inset-0 flex flex-col items-center justify-center opacity-[0.04] pointer-events-none select-none z-0">
            <img
              src="/assets/hospital_watermark.png"
              alt="Marca d'água Ordem Terceira Santa Maria"
              className="w-[380px] max-h-[380px] object-contain"
            />
          </div>

          <div className="relative z-10 flex-1 flex flex-col justify-between">
            <div>
              {/* Cabeçalho Hospitalar Oficial */}
              <div className="border-b-2 border-slate-950 pb-2 mb-2 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="h-11 w-11 rounded-lg border border-slate-300 p-0.5 bg-white flex items-center justify-center shadow-2xs shrink-0">
                    <img
                      src="/assets/logo_hospital_white.png"
                      alt="Logo Hospital Ordem Terceira Santa Maria"
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div>
                    <h1 className="text-sm sm:text-base font-black uppercase tracking-tight text-slate-950 leading-tight">
                      {doctor.clinicName || 'Hospital Ordem Terceira'}
                    </h1>
                    <p className="text-[10px] font-bold text-slate-800 uppercase tracking-wider leading-tight">
                      {doctor.razaoSocial || 'Venerável Ordem Terceira de São Francisco de Assis'}
                    </p>
                    <p className="text-[9px] text-slate-600 leading-tight">
                      CNES: {doctor.cnes || '2408990'} • CNPJ: {doctor.cnpj || '04.935.409/0002-31'}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-900 bg-blue-50 px-2 py-0.5 rounded-sm border border-blue-200">
                    SUS • SADT AMBULATÓRIO / ENFERMARIA
                  </span>
                  <p className="text-[10px] font-bold text-slate-900 mt-0.5">
                    Data: {formatDatePtBr(dataSolicitacao)} às {horaSolicitacao}
                  </p>
                </div>
              </div>

              {/* Título do Documento */}
              <div className="text-center my-1.5 bg-slate-100 py-1 border border-slate-300 rounded-md">
                <h2 className="text-xs sm:text-sm font-black tracking-wider uppercase text-slate-950">
                  GUIA DE SOLICITAÇÃO DE EXAMES LABORATORIAIS (SADT)
                </h2>
              </div>

              {/* Grade de Identificação do Paciente */}
              <table className="w-full border-collapse border border-slate-950 text-slate-950 text-[10px] mb-2 leading-tight">
                <tbody>
                  <tr>
                    <td colSpan={2} className="border border-slate-950 px-2 py-0.5 w-[65%]">
                      <span className="font-semibold text-slate-700">Nome do Paciente: </span>
                      <span className="font-extrabold uppercase text-slate-950">{patient.name || 'Paciente'}</span>
                    </td>
                    <td className="border border-slate-950 px-2 py-0.5 w-[35%]">
                      <span className="font-semibold text-slate-700">Data Nasc / Idade: </span>
                      <span className="font-bold text-slate-950">
                        {patient.birthDate ? formatDatePtBr(patient.birthDate) : ''} {patient.age ? `(${patient.age})` : ''}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-slate-950 px-2 py-0.5 w-[35%]">
                      <span className="font-semibold text-slate-700">Prontuário / CPF: </span>
                      <span className="font-bold text-slate-950">{patient.document || 'Não informado'}</span>
                    </td>
                    <td className="border border-slate-950 px-2 py-0.5 w-[30%]">
                      <span className="font-semibold text-slate-700">Cartão SUS (CNS): </span>
                      <span className="font-bold text-slate-950">{patient.cns ? formatCns(patient.cns) : 'Não informado'}</span>
                    </td>
                    <td className="border border-slate-950 px-2 py-0.5 w-[35%]">
                      <span className="font-semibold text-slate-700">Leito / Unidade: </span>
                      <span className="font-bold text-slate-950">{patient.bed || 'Ambulatório'}</span>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="border border-slate-950 px-2 py-0.5 bg-slate-50/70">
                      <span className="font-semibold text-slate-700">Indicação Clínica / Suspeita: </span>
                      <span className="font-bold text-slate-950">{indicacaoClinica}</span>
                      {selectedCid && (
                        <span className="ml-2 font-bold text-blue-950 bg-blue-100 px-1.5 py-0.2 rounded-2xs text-[9.5px]">
                          CID-10: {selectedCid.code} ({selectedCid.description})
                        </span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Lista dos Exames Solicitados */}
              <div className="mb-2">
                <div className="flex items-center justify-between mb-0.5 text-[10.5px]">
                  <span className="font-extrabold uppercase text-slate-900 tracking-wider">
                    Relação de Exames Solicitados ({selectedList.length} itens):
                  </span>
                  {jejumObrigatorio && (
                    <span className="font-bold text-amber-900 bg-amber-50 px-1.5 py-0.2 rounded-2xs border border-amber-300 text-[9.5px]">
                      * Requer Jejum Recomendado de 8 a 12 horas
                    </span>
                  )}
                </div>

                <table className="w-full border-collapse border border-slate-950 text-slate-950 text-[9.5px] leading-tight">
                  <thead>
                    <tr className="bg-slate-100 text-[9.5px]">
                      <th className="border border-slate-950 px-1 py-0.5 text-center font-bold w-[24px]">#</th>
                      <th className="border border-slate-950 px-1.5 py-0.5 text-center font-bold w-[55px]">Sigla</th>
                      <th className="border border-slate-950 px-2 py-0.5 text-left font-bold">Descrição do Exame (SIGTAP / Avulso)</th>
                      <th className="border border-slate-950 px-1.5 py-0.5 text-center font-bold w-[85px]">Código SUS</th>
                      <th className="border border-slate-950 px-1.5 py-0.5 text-left font-bold w-[140px]">Amostra / Tubo</th>
                      <th className="border border-slate-950 px-1 py-0.5 text-center font-bold w-[32px]">Qtd</th>
                      <th className="border border-slate-950 px-1 py-0.5 text-center font-bold w-[50px]">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedList.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="border border-slate-950 px-3 py-4 text-center text-slate-400 italic">
                          Nenhum exame selecionado.
                        </td>
                      </tr>
                    ) : (
                      selectedList.map((item, index) => (
                        <tr key={item.exame.id} className="break-inside-avoid">
                          <td className="border border-slate-950 px-1 py-0.5 text-center font-bold align-middle">
                            {index + 1}
                          </td>
                          <td className="border border-slate-950 px-1.5 py-0.5 text-center font-black align-middle text-blue-950">
                            {item.exame.sigla}
                          </td>
                          <td className="border border-slate-950 px-2 py-0.5 font-bold align-middle">
                            <span>{item.exame.termoClinico}</span>
                            {item.exame.codigoFormatado === 'Fora da Lista' ? (
                              <span className="text-[8.5px] font-bold text-amber-800 ml-1.5 bg-amber-50 px-1 rounded-2xs border border-amber-200">
                                Exame fora da lista
                              </span>
                            ) : (
                              item.exame.nomeOficial !== item.exame.termoClinico && (
                                <span className="text-[8.5px] font-normal text-slate-600 block">
                                  {item.exame.nomeOficial}
                                </span>
                              )
                            )}
                          </td>
                          <td className="border border-slate-950 px-1.5 py-0.5 text-center font-mono text-[9px] align-middle font-medium">
                            {item.exame.codigoFormatado}
                          </td>
                          <td className="border border-slate-950 px-1.5 py-0.5 text-[9px] align-middle text-slate-800">
                            {item.exame.tubo}
                          </td>
                          <td className="border border-slate-950 px-1 py-0.5 text-center font-bold align-middle">
                            {item.quantidade}
                          </td>
                          <td className="border border-slate-950 px-1 py-0.5 text-center font-extrabold text-[9px] align-middle">
                            {item.urgente ? (
                              <span className="text-red-700">URGENTE</span>
                            ) : (
                              <span className="text-slate-600">Rotina</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* QUADRO DE EXAMES FORA DA LISTA / OBSERVAÇÕES ESPECIAIS AO LABORATÓRIO */}
              {(outrosExamesTexto.trim().length > 0 || selectedList.some(i => i.exame.codigoFormatado === 'Fora da Lista')) && (
                <div className="border border-slate-950 rounded-md p-1.5 bg-slate-50/80 my-1.5 text-slate-950">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase mb-0.5 border-b border-slate-300 pb-0.5">
                    <span className="flex items-center gap-1">
                      <span>✚ Quadro de Exames Fora da Lista / Observações Complementares:</span>
                    </span>
                    <span className="text-[8.5px] font-bold text-slate-600">Instruções Médicas ao Laboratório</span>
                  </div>
                  {outrosExamesTexto.trim() ? (
                    <p className="text-[9.5px] font-semibold whitespace-pre-line leading-tight text-slate-900 pt-0.5">
                      {outrosExamesTexto}
                    </p>
                  ) : (
                    <p className="text-[9px] font-medium text-slate-700 leading-tight pt-0.5">
                      Realizar os exames avulsos indicados na tabela acima conforme padrões de qualidade, controle analítico e metodologia de referência laboratorial.
                    </p>
                  )}
                </div>
              )}

              {/* Aviso ao Laboratório */}
              <div className="border border-slate-950 rounded-md p-1 bg-slate-50/80 text-center my-1.5">
                <p className="font-black text-[9px] text-slate-950 tracking-wide uppercase">
                  TODOS OS EXAMES SOLICITADOS DEVERÃO SER REALIZADOS CONFORME A SOLICITAÇÃO MÉDICA
                </p>
              </div>
            </div>

            {/* Rodapé com Assinatura e Carimbo Médico */}
            <div className="border-t-2 border-slate-950 pt-2 mt-auto">
              <div className="grid grid-cols-12 gap-3 items-end">
                <div className="col-span-7 text-[9px] text-slate-600 space-y-0.5">
                  <p className="font-bold text-slate-900">
                    {doctor.clinicName} • {doctor.razaoSocial}
                  </p>
                  <p>
                    {doctor.clinicAddress} — {doctor.clinicCityState}
                  </p>
                  <p className="text-[8.5px] text-slate-500">
                    Documento SADT emitido em página única conforme padrões DATASUS / SIA-SUS.
                  </p>
                </div>

                <div className="col-span-5 flex flex-col items-center justify-end text-center">
                  {doctor.digitalSignatureUrl ? (
                    <img
                      src={doctor.digitalSignatureUrl}
                      alt="Assinatura"
                      className="max-h-8 object-contain mb-0.5"
                    />
                  ) : (
                    <div className="h-6"></div>
                  )}
                  <div className="border-t border-slate-950 pt-0.5 w-full max-w-[230px]">
                    <p className="font-black text-[11px] text-slate-950 uppercase leading-tight">
                      {doctor.fullName || 'Dr(a). Médico Solicitante'}
                    </p>
                    <p className="text-[10px] font-bold text-blue-950 leading-tight">
                      CRM/{doctor.uf || 'PA'} {doctor.crm || '000000'}
                      {doctor.rqe && <span className="ml-1">• RQE {doctor.rqe}</span>}
                    </p>
                    {doctor.specialty && (
                      <p className="text-[9px] text-slate-600 leading-tight">
                        {doctor.specialty}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
