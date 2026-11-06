import { InpatientItem, FastHugCategory } from '../types';
import { newInpatientItemId } from './hospitalMedications';

export interface ProtocoloHospitalar {
  id: string;
  titulo: string;
  subtitulo: string;
  especialidade: string;
  diagnosticoSugerido: string;
  cid10Sugerido: { code: string; description: string };
  badgeCor: string;
  itens: Omit<InpatientItem, 'id'>[];
}

export const PROTOCOLOS_HOSPITALARES: ProtocoloHospitalar[] = [
  {
    id: 'pac',
    titulo: 'Pneumonia Adquirida na Comunidade (PAC)',
    subtitulo: 'Terapia empírica hospitalar com Ceftriaxona + Azitromicina, profilaxias e suporte respiratório.',
    especialidade: 'Infectologia / Pneumologia',
    diagnosticoSugerido: 'Pneumonia adquirida na comunidade — enfermaria clínica (CURB-65: 2)',
    cid10Sugerido: { code: 'J18.9', description: 'Pneumonia não especificada' },
    badgeCor: 'bg-blue-100 text-blue-800 border-blue-200',
    itens: [
      {
        category: 'dieta',
        name: 'Dieta Branda Normocalórica e Normoproteica',
        dose: '',
        route: 'VO',
        frequency: 'ACM',
        notes: 'Oferecer líquidos e manter boa ingesta hídrica.'
      },
      {
        category: 'hidratacao',
        name: 'Soro Fisiológico 0,9% 500 mL',
        dose: '500 mL',
        route: 'EV',
        frequency: '12/12h',
        schedule: '08h - 20h',
        notes: 'Infundir em bomba ou gotejamento conforme balanço hídrico.'
      },
      {
        category: 'antibioticos',
        name: 'Ceftriaxona 1g frasco-ampola',
        dose: '1g (diluído em 100 mL de SF 0,9%)',
        route: 'EV',
        frequency: '12/12h',
        schedule: '10h - 22h',
        diaAtual: 1,
        diaTotal: 7,
        notes: 'Infundir em 30 minutos. Dia 1 de 7 programados.'
      },
      {
        category: 'antibioticos',
        name: 'Azitromicina 500 mg comprimido',
        dose: '500 mg',
        route: 'VO',
        frequency: '24/24h (1x/dia)',
        schedule: '14h',
        diaAtual: 1,
        diaTotal: 5,
        notes: 'Administrar 1h antes ou 2h após a refeição. Dia 1 de 5.'
      },
      {
        category: 'analgesia',
        name: 'Dipirona sódica 500 mg/mL injetável',
        dose: '1g (2 mL)',
        route: 'EV',
        frequency: '6/6h S.N.',
        notes: 'Infundir lentamente se Tax ≥ 37,8 °C ou dor pleurítica.'
      },
      {
        category: 'sintomaticos',
        name: 'Bromoprida 5 mg/mL injetável',
        dose: '10 mg (1 ampola)',
        route: 'EV',
        frequency: '8/8h S.N.',
        notes: 'Se náuseas ou vômitos.'
      },
      {
        category: 'sintomaticos',
        name: 'NBZ: Berotec 10 gts + Atrovent 20 gts + SF 0,9% 5 mL',
        dose: '5 mL',
        route: 'NBZ',
        frequency: '6/6h S.N.',
        notes: 'Se broncoespasmo, dispneia ou sibilos auscultatórios.'
      },
      {
        category: 'profilaxias',
        name: 'Enoxaparina sódica 40 mg/0,4 mL',
        dose: '40 mg (0,4 mL)',
        route: 'SC',
        frequency: '24/24h',
        schedule: '20h',
        notes: 'Profilaxia de TEV em paciente agudamente enfermo. Ajustar se ClCr < 30 mL/min.'
      },
      {
        category: 'profilaxias',
        name: 'Omeprazol 40 mg pó liofilizado injetável',
        dose: '40 mg',
        route: 'EV',
        frequency: 'Em jejum 1x/dia',
        schedule: '06h',
        notes: 'Profilaxia de úlcera de estresse. Diluir em 100 mL de SF 0,9%.'
      },
      {
        category: 'demais',
        name: 'Cabeceira elevada a 30° - 45°',
        dose: '',
        route: '',
        frequency: 'Contínuo',
        notes: 'Prevenção de broncoaspiração.'
      },
      {
        category: 'demais',
        name: 'Oxigênio suplementar por cateter nasal a 2-3 L/min',
        dose: '2-3 L/min',
        route: 'Inalatória',
        frequency: 'S.N. se SpO₂ < 92%',
        notes: 'Meta de oximetria: 93% a 96%.'
      },
      {
        category: 'demais',
        name: 'SV (Sinais Vitais completos: PA, FC, FR, Tax e SpO₂)',
        dose: '',
        route: '',
        frequency: '6/6h',
        notes: 'Comunicar médico de plantão se alteração de parâmetros.'
      }
    ]
  },
  {
    id: 'ic-descompensada',
    titulo: 'Insuficiência Cardíaca Descompensada (Perfil B Congestivo)',
    subtitulo: 'Descongestão vigorosa com diurético de alça EV, restrição hídrica, vasodilatação e balanço hídrico.',
    especialidade: 'Cardiologia',
    diagnosticoSugerido: 'Insuficiência cardíaca descompensada — Perfil B (Quente e Úmido)',
    cid10Sugerido: { code: 'I50.0', description: 'Insuficiência cardíaca congestiva' },
    badgeCor: 'bg-rose-100 text-rose-800 border-rose-200',
    itens: [
      {
        category: 'dieta',
        name: 'Dieta Hipossódica com Restrição Hídrica Estrita (Máx. 1000 mL/dia)',
        dose: 'Máx. 1000 mL/24h',
        route: 'VO',
        frequency: 'ACM',
        notes: 'Somar água, chá, sucos e infusões medicamentosas.'
      },
      {
        category: 'hidratacao',
        name: 'Manter acesso venoso periférico salinizado (SEM soro de manutenção)',
        dose: '',
        route: 'EV',
        frequency: 'Contínuo',
        notes: 'Salinizar com 5 mL de SF 0,9% após cada dose de medicação. Restrição hídrica rigorosa.'
      },
      {
        category: 'analgesia',
        name: 'Dipirona sódica 500 mg comprimido',
        dose: '500 mg a 1g',
        route: 'VO',
        frequency: '8/8h S.N.',
        notes: 'Se dor ou febre. Evitar AINEs absolutamente.'
      },
      {
        category: 'sintomaticos',
        name: 'Ondansetrona 2 mg/mL injetável',
        dose: '4 mg (2 mL)',
        route: 'EV',
        frequency: '8/8h S.N.',
        notes: 'Se náuseas ou estase gastrointestinal congestiva.'
      },
      {
        category: 'profilaxias',
        name: 'Enoxaparina sódica 40 mg/0,4 mL',
        dose: '40 mg',
        route: 'SC',
        frequency: '24/24h',
        schedule: '20h',
        notes: 'Profilaxia de TEV em IC descompensada.'
      },
      {
        category: 'profilaxias',
        name: 'Omeprazol 20 mg cápsula',
        dose: '20 mg',
        route: 'VO',
        frequency: 'Em jejum 1x/dia',
        schedule: '06h',
        notes: 'Tomar pela manhã com pequena quantidade de água.'
      },
      {
        category: 'demais',
        name: 'Furosemida 20 mg/2 mL injetável',
        dose: '40 mg (2 ampolas)',
        route: 'EV',
        frequency: '12/12h',
        schedule: '08h - 16h',
        notes: 'Infundir em bolus lento. Monitorar débito urinário e potássio sérico.'
      },
      {
        category: 'demais',
        name: 'Espironolactona 25 mg comprimido',
        dose: '25 mg',
        route: 'VO',
        frequency: '1x/dia pela manhã',
        schedule: '08h',
        notes: 'Monitorar K+ e função renal (manter K+ entre 4,0 e 5,0 mEq/L).'
      },
      {
        category: 'demais',
        name: 'Balanço Hídrico Parcial e Total de 24 horas',
        dose: '',
        route: '',
        frequency: '24/24h',
        notes: 'Registrar todas as entradas e saídas. Meta: balanço diário negativo de 500 a 1000 mL.'
      },
      {
        category: 'demais',
        name: 'Pesagem Diária do Paciente em Jejum',
        dose: '',
        route: '',
        frequency: '1x/dia',
        schedule: '07h',
        notes: 'Pesar na mesma balança pela manhã após esvaziar a bexiga.'
      },
      {
        category: 'demais',
        name: 'Cabeceira elevada a 45° - Fowler',
        dose: '',
        route: '',
        frequency: 'Contínuo',
        notes: 'Alívio da ortopneia e congestão pulmonar.'
      },
      {
        category: 'demais',
        name: 'SV com controle rigoroso de PA, FC e SpO₂',
        dose: '',
        route: '',
        frequency: '6/6h',
        notes: 'Comunicar se PAS < 90 ou > 160 mmHg, FC < 50 ou > 110 bpm, SpO₂ < 92%.'
      }
    ]
  },
  {
    id: 'sepse-infeccao',
    titulo: 'Sepse / Infecção Grave a Esclarecer',
    subtitulo: 'Ressuscitação volêmica guiada, antibioticoterapia de amplo espectro precoce e monitorização clínica.',
    especialidade: 'Infectologia / Terapia Intensiva',
    diagnosticoSugerido: 'Sepse de foco pulmonar/urinário a esclarecer — qSOFA positivo',
    cid10Sugerido: { code: 'A41.9', description: 'Septicemia não especificada' },
    badgeCor: 'bg-purple-100 text-purple-800 border-purple-200',
    itens: [
      {
        category: 'dieta',
        name: 'Dieta Branda conforme aceitação ou Dieta Zero temporária se instabilidade',
        dose: '',
        route: 'VO',
        frequency: 'ACM',
        notes: 'Suspender se rebaixamento do nível de consciência ou hipotensão.'
      },
      {
        category: 'hidratacao',
        name: 'Soro Ringer Lactato 1000 mL',
        dose: '1000 mL',
        route: 'EV',
        frequency: 'Correr em 2 a 4 horas',
        notes: 'Ressuscitação volêmica inicial. Reavaliar perfusão periférica, tempo de enchimento capilar e PAM.'
      },
      {
        category: 'hidratacao',
        name: 'Soro Fisiológico 0,9% 500 mL + KCL 19,1% 10 mL',
        dose: '500 mL',
        route: 'EV',
        frequency: '12/12h',
        schedule: '12h - 00h',
        notes: 'Manutenção hidroeletrolítica após hidratação rápida.'
      },
      {
        category: 'antibioticos',
        name: 'Ceftriaxona 1g frasco-ampola',
        dose: '2g (2 frascos diluídos em 100 mL de SF 0,9%)',
        route: 'EV',
        frequency: '24/24h',
        schedule: '10h',
        diaAtual: 1,
        diaTotal: 7,
        notes: 'Iniciar IMEDIATAMENTE após coleta das hemoculturas (Dia 1 de 7).'
      },
      {
        category: 'antibioticos',
        name: 'Metronidazol 5 mg/mL bolsa de infusão (Se suspeita de foco intra-abdominal)',
        dose: '500 mg (100 mL)',
        route: 'EV',
        frequency: '8/8h',
        schedule: '06h - 14h - 22h',
        diaAtual: 1,
        diaTotal: 7,
        notes: 'Infundir em 30 a 60 min. Cobertura anaeróbia.'
      },
      {
        category: 'analgesia',
        name: 'Dipirona sódica 500 mg/mL injetável',
        dose: '1g (2 mL)',
        route: 'EV',
        frequency: '6/6h S.N.',
        notes: 'Se Tax ≥ 37,8 °C ou dor.'
      },
      {
        category: 'sintomaticos',
        name: 'Ondansetrona 2 mg/mL injetável',
        dose: '8 mg (4 mL)',
        route: 'EV',
        frequency: '8/8h S.N.',
        notes: 'Se náuseas ou êmese.'
      },
      {
        category: 'profilaxias',
        name: 'Enoxaparina sódica 40 mg/0,4 mL',
        dose: '40 mg',
        route: 'SC',
        frequency: '24/24h',
        schedule: '20h',
        notes: 'Profilaxia TEV.'
      },
      {
        category: 'profilaxias',
        name: 'Omeprazol 40 mg pó liofilizado injetável',
        dose: '40 mg',
        route: 'EV',
        frequency: '1x/dia',
        schedule: '06h',
        notes: 'Profilaxia de úlcera péptica.'
      },
      {
        category: 'demais',
        name: 'Coleta de 2 pares de Hemoculturas + Urocultura com Antibiograma',
        dose: '',
        route: '',
        frequency: 'Imediato',
        notes: 'Coletar de 2 sítios venosos distintos ANTES de infundir a primeira dose do antibiótico.'
      },
      {
        category: 'demais',
        name: 'Lactato sérico arterial ou venoso seriado',
        dose: '',
        route: '',
        frequency: 'Na admissão e repetir em 4h',
        notes: 'Avaliar clareamento de lactato e resposta à reposição volêmica.'
      },
      {
        category: 'demais',
        name: 'Controle de Diurese Horária em SVD (Sonda Vesical de Demora)',
        dose: '',
        route: '',
        frequency: '1/1h',
        notes: 'Meta: diurese ≥ 0,5 mL/kg/h. Comunicar oligúria imediatamente.'
      },
      {
        category: 'demais',
        name: 'SV com monitorização contínua de PAM, FC, FR e SatO₂',
        dose: '',
        route: '',
        frequency: '2/2h ou 4/4h',
        notes: 'Comunicar imediatamente se PAM < 65 mmHg, PAS < 90 mmHg ou FC > 120 bpm.'
      }
    ]
  },
  {
    id: 'dpoc-exacerbado',
    titulo: 'DPOC Exacerbado / Crise de Broncoespasmo',
    subtitulo: 'Broncodilatação inalatória combinada, corticoterapia sistêmica, antibioticoterapia e alvo de O₂ controlado.',
    especialidade: 'Pneumologia',
    diagnosticoSugerido: 'Doença pulmonar obstrutiva crônica agudizada / Broncoespasmo moderado a grave',
    cid10Sugerido: { code: 'J44.1', description: 'Doença pulmonar obstrutiva crônica com exacerbação aguda' },
    badgeCor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    itens: [
      {
        category: 'dieta',
        name: 'Dieta Branda Fracionada',
        dose: '',
        route: 'VO',
        frequency: 'ACM',
        notes: 'Pequenos volumes para evitar desconforto respiratório pós-prandial.'
      },
      {
        category: 'hidratacao',
        name: 'Soro Fisiológico 0,9% 500 mL',
        dose: '500 mL',
        route: 'EV',
        frequency: '12/12h',
        schedule: '10h - 22h',
        notes: 'Fluorescer secreções sem sobrecarga volêmica.'
      },
      {
        category: 'antibioticos',
        name: 'Amoxicilina + Clavulanato de Potássio 1g + 200 mg frasco injetável',
        dose: '1,2 g diluído em 100 mL de SF 0,9%',
        route: 'EV',
        frequency: '8/8h',
        schedule: '06h - 14h - 22h',
        diaAtual: 1,
        diaTotal: 7,
        notes: 'Infundir em 30 a 40 minutos (Dia 1 de 7).'
      },
      {
        category: 'analgesia',
        name: 'Dipirona sódica 500 mg/mL injetável',
        dose: '1g (2 mL)',
        route: 'EV',
        frequency: '6/6h S.N.',
        notes: 'Se febre ou dor torácica muscular.'
      },
      {
        category: 'sintomaticos',
        name: 'NBZ: Fenoterol (Berotec) 10 gts + Ipratrópio (Atrovent) 20 gts + SF 0,9% 5 mL',
        dose: '5 mL',
        route: 'NBZ',
        frequency: '4/4h S.N.',
        notes: 'Nebulizar com ar comprimido ou O2 a 5 L/min. Monitorar FC.'
      },
      {
        category: 'sintomaticos',
        name: 'Salbutamol spray 100 mcg/jato (com espaçador)',
        dose: '4 jatos',
        route: 'Inalatória',
        frequency: '6/6h',
        schedule: '06h - 12h - 18h - 00h',
        notes: 'Aguardar 30 segundos entre os jatos.'
      },
      {
        category: 'profilaxias',
        name: 'Enoxaparina sódica 40 mg/0,4 mL',
        dose: '40 mg',
        route: 'SC',
        frequency: '24/24h',
        schedule: '20h',
        notes: 'Profilaxia de TEV.'
      },
      {
        category: 'profilaxias',
        name: 'Omeprazol 40 mg pó liofilizado injetável',
        dose: '40 mg',
        route: 'EV',
        frequency: '1x/dia em jejum',
        schedule: '06h',
        notes: 'Proteção gástrica durante corticoterapia sistêmica.'
      },
      {
        category: 'demais',
        name: 'Prednisona 20 mg comprimido',
        dose: '40 mg (2 comprimidos)',
        route: 'VO',
        frequency: '1x/dia pela manhã',
        schedule: '08h',
        notes: 'Corticoterapia sistêmica de resgate por 5 dias.'
      },
      {
        category: 'demais',
        name: 'Oxigênio suplementar por cateter nasal a 1 a 2 L/min',
        dose: '1-2 L/min',
        route: 'Inalatória',
        frequency: 'Contínuo se SpO₂ < 88%',
        notes: 'ATENÇÃO DPOC: Manter meta de saturação estrita entre 88% e 92% para evitar narcose por CO2.'
      },
      {
        category: 'demais',
        name: 'Gasometria arterial de controle',
        dose: '',
        route: '',
        frequency: 'Conforme evolução clínica',
        notes: 'Avaliar retenção de PaCO2 e acidose respiratória.'
      },
      {
        category: 'demais',
        name: 'SV com ênfase em FR, SpO₂ e esforço respiratório',
        dose: '',
        route: '',
        frequency: '4/4h',
        notes: 'Comunicar imediatamente se tiragem intercostal, fala entrecortada ou FR > 28 irpm.'
      }
    ]
  },
  {
    id: 'pre-op-abdome',
    titulo: 'Pré-Operatório / Abdome Agudo Cirúrgico',
    subtitulo: 'Jejum absoluto, reposição volêmica balanceada, analgesia escalonada e profilaxia perioperatória.',
    especialidade: 'Cirurgia Geral',
    diagnosticoSugerido: 'Abdome agudo em investigação / Preparo pré-operatório programado',
    cid10Sugerido: { code: 'R10.0', description: 'Abdome agudo' },
    badgeCor: 'bg-amber-100 text-amber-800 border-amber-200',
    itens: [
      {
        category: 'dieta',
        name: 'Dieta Zero (Jejum absoluto a partir das 00h)',
        dose: 'Jejum absoluto',
        route: 'VO',
        frequency: 'Contínuo',
        notes: 'Suspender água e medicações orais para cirurgia com anestesia geral/raqui.'
      },
      {
        category: 'hidratacao',
        name: 'Soro Ringer Lactato 1000 mL + Soro Glicosado 5% 1000 mL',
        dose: '2000 mL/24h',
        route: 'EV',
        frequency: '28 gotas/minuto (ou 84 mL/h em BIC)',
        notes: 'Hidratação basal e suporte calórico mínimo durante o jejum.'
      },
      {
        category: 'analgesia',
        name: 'Dipirona sódica 500 mg/mL injetável',
        dose: '1g (2 mL)',
        route: 'EV',
        frequency: '6/6h fixo ou S.N.',
        schedule: '06h - 12h - 18h - 00h',
        notes: 'Infundir lentamente.'
      },
      {
        category: 'analgesia',
        name: 'Cloridrato de tramadol 100 mg/2 mL + SF 0,9% 100 mL',
        dose: '50 a 100 mg',
        route: 'EV',
        frequency: '8/8h S.N.',
        notes: 'Infundir em 30 minutos se dor moderada a intensa (EVA ≥ 6).'
      },
      {
        category: 'sintomaticos',
        name: 'Metoclopramida (Plasil) 5 mg/mL injetável',
        dose: '10 mg (1 ampola)',
        route: 'EV',
        frequency: '8/8h S.N.',
        notes: 'Se náuseas, vômitos ou estase gástrica.'
      },
      {
        category: 'sintomaticos',
        name: 'Butilescopolamina 20 mg/mL injetável (Buscopan simples)',
        dose: '20 mg (1 ampola)',
        route: 'EV',
        frequency: '8/8h S.N.',
        notes: 'Se dor em cólica gastrointestinal ou biliar. Diluir em 20 mL de AD/SF.'
      },
      {
        category: 'profilaxias',
        name: 'Omeprazol 40 mg pó liofilizado injetável',
        dose: '40 mg',
        route: 'EV',
        frequency: '1x/dia em jejum',
        schedule: '06h',
        notes: 'Prevenção de gastrite de estresse.'
      },
      {
        category: 'profilaxias',
        name: 'Meias elásticas de compressão pneumática intermitente',
        dose: '',
        route: '',
        frequency: 'Contínuo',
        notes: 'Profilaxia mecânica de TEV pré e pós-operatória.'
      },
      {
        category: 'demais',
        name: 'Tipagem Sanguínea (ABO/Rh) + Prova Cruzada e Reserva de 2 CH',
        dose: '',
        route: '',
        frequency: 'Rotina pré-op',
        notes: 'Confirmar reserva hemoterápica com a agência transfusional.'
      },
      {
        category: 'demais',
        name: 'Acesso venoso periférico calibroso (Gelco 18G ou 16G em MSD)',
        dose: '',
        route: '',
        frequency: 'Contínuo',
        notes: 'Acesso seguro para indução anestésica e reposição hemodinâmica rápida.'
      },
      {
        category: 'demais',
        name: 'SV de 6/6h e comunicar dor intensa refratária',
        dose: '',
        route: '',
        frequency: '6/6h',
        notes: 'Avaliar descompressão brusca e sinais de peritonite.'
      }
    ]
  },
  {
    id: 'avci-subagudo',
    titulo: 'Acidente Vascular Cerebral Isquêmico (AVCi Subagudo)',
    subtitulo: 'Prevenção secundária com antiagregação, estatinas de alta potência, controle pressórico e deglutição segura.',
    especialidade: 'Neurologia / Clínica Médica',
    diagnosticoSugerido: 'AVC isquêmico subagudo — enfermaria clínica (prevenção secundária)',
    cid10Sugerido: { code: 'I63.9', description: 'Infarto cerebral não especificado' },
    badgeCor: 'bg-teal-100 text-teal-800 border-teal-200',
    itens: [
      {
        category: 'dieta',
        name: 'Dieta Pastosa Homogênea com Líquidos Espessados (Prevenção de Broncoaspiração)',
        dose: '',
        route: 'VO',
        frequency: 'ACM',
        notes: 'Realizar teste da deglutição com fonoaudiologia antes da primeira ingesta oral.'
      },
      {
        category: 'hidratacao',
        name: 'Soro Fisiológico 0,9% 1000 mL',
        dose: '1000 mL/24h',
        route: 'EV',
        frequency: '42 mL/h em BIC',
        notes: 'Euvolemia. NUNCA usar soluções hipotônicas ou glicosadas puras no AVC agudo.'
      },
      {
        category: 'analgesia',
        name: 'Dipirona sódica 500 mg comprimido',
        dose: '1g (2 comprimidos)',
        route: 'VO',
        frequency: '6/6h S.N.',
        notes: 'Se cefaleia ou febre. Manter normotermia rigorosa (Tax < 37,5 °C).'
      },
      {
        category: 'sintomaticos',
        name: 'Lactulose 667 mg/mL xarope',
        dose: '15 a 30 mL',
        route: 'VO',
        frequency: '12/12h',
        schedule: '08h - 20h',
        notes: 'Evitar constipação e manobra de Valsalva.'
      },
      {
        category: 'profilaxias',
        name: 'Ácido Acetilsalicílico (AAS) 100 mg comprimido',
        dose: '100 mg',
        route: 'VO',
        frequency: '1x/dia após o almoço',
        schedule: '12h',
        notes: 'Antiagregação plaquetária. Confirmar TC de crânio sem hemorragia.'
      },
      {
        category: 'profilaxias',
        name: 'Atorvastatina 40 mg comprimido',
        dose: '40 mg',
        route: 'VO',
        frequency: '1x/dia à noite',
        schedule: '21h',
        notes: 'Estatina de alta intensidade para estabilização de placa.'
      },
      {
        category: 'profilaxias',
        name: 'Enoxaparina sódica 40 mg/0,4 mL',
        dose: '40 mg',
        route: 'SC',
        frequency: '24/24h',
        schedule: '20h',
        notes: 'Profilaxia de TEV em paciente neurológico com déficit motor.'
      },
      {
        category: 'profilaxias',
        name: 'Omeprazol 20 mg cápsula',
        dose: '20 mg',
        route: 'VO',
        frequency: 'Em jejum 1x/dia',
        schedule: '06h',
        notes: 'Proteção gástrica associada ao AAS.'
      },
      {
        category: 'demais',
        name: 'Cabeceira elevada a 30° continuamente',
        dose: '',
        route: '',
        frequency: 'Contínuo',
        notes: 'Otimizar drenagem venosa cerebral e prevenir broncoaspiração.'
      },
      {
        category: 'demais',
        name: 'Mudança de decúbito de 2/2 horas',
        dose: '',
        route: '',
        frequency: '2/2h',
        notes: 'Prevenção de lesão por pressão (LPP) no lado plégico/parético.'
      },
      {
        category: 'demais',
        name: 'Controle de PA: Tolerância permissiva da pressão arterial',
        dose: '',
        route: '',
        frequency: '4/4h',
        notes: 'NÃO reduzir bruscamente a PA. Tratar somente se PAS > 220 ou PAD > 120 mmHg (ou > 185/110 pós-trombólise).'
      },
      {
        category: 'demais',
        name: 'Controle de HGT de 6/6h e correção com Insulina Regular',
        dose: '',
        route: '',
        frequency: '6/6h',
        notes: 'Meta glicêmica estrita: 140 a 180 mg/dL. Evitar hiperglicemia e hipoglicemia.'
      }
    ]
  },
  {
    id: 'diabetes-descompensado',
    titulo: 'Diabetes Descompensado / Manejo Glicêmico Hospitalar',
    subtitulo: 'Esquema de insulina basal-bolus ou correção conforme HGT, controle hidroeletrolítico e prevenção de hipoglicemia.',
    especialidade: 'Endocrinologia / Clínica Médica',
    diagnosticoSugerido: 'Diabetes mellitus tipo 2 descompensado sem cetoacidose',
    cid10Sugerido: { code: 'E11.6', description: 'Diabetes mellitus tipo 2 com outras complicações especificadas' },
    badgeCor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    itens: [
      {
        category: 'dieta',
        name: 'Dieta para Diabético (Fracionada, Normocalórica, Isenta de Açúcares Simples)',
        dose: '',
        route: 'VO',
        frequency: 'ACM',
        notes: '6 refeições ao dia fracionadas.'
      },
      {
        category: 'hidratacao',
        name: 'Soro Fisiológico 0,9% 1000 mL',
        dose: '1000 mL/24h',
        route: 'EV',
        frequency: '42 mL/h em BIC',
        notes: 'Hidratação de manutenção e reposição volêmica suave.'
      },
      {
        category: 'analgesia',
        name: 'Dipirona sódica 500 mg comprimido',
        dose: '500 mg a 1g',
        route: 'VO',
        frequency: '6/6h S.N.',
        notes: 'Se dor ou febre.'
      },
      {
        category: 'sintomaticos',
        name: 'Ondansetrona 4 mg comprimido',
        dose: '4 mg',
        route: 'VO',
        frequency: '8/8h S.N.',
        notes: 'Se náuseas ou gastroparesia diabética.'
      },
      {
        category: 'profilaxias',
        name: 'Enoxaparina sódica 40 mg/0,4 mL',
        dose: '40 mg',
        route: 'SC',
        frequency: '24/24h',
        schedule: '20h',
        notes: 'Profilaxia de TEV.'
      },
      {
        category: 'profilaxias',
        name: 'Omeprazol 20 mg cápsula',
        dose: '20 mg',
        route: 'VO',
        frequency: 'Em jejum 1x/dia',
        schedule: '06h',
        notes: 'Proteção gástrica matinal.'
      },
      {
        category: 'demais',
        name: 'HGT de 6/6h e Insulina Regular SC conforme escala hospitalar',
        dose: 'Conforme escala',
        route: 'SC',
        frequency: '6/6h',
        schedule: '06h - 12h - 18h - 00h',
        notes: 'Escala: 151-200 = 2U | 201-250 = 4U | 251-300 = 6U | 301-350 = 8U | > 350 = 10U e comunicar médico.'
      },
      {
        category: 'demais',
        name: 'Conduta em Hipoglicemia (Se HGT < 70 mg/dL): Glicose 50% 40 mL EV',
        dose: '40 mL (4 ampolas)',
        route: 'EV',
        frequency: 'S.N. se HGT < 70 mg/dL',
        notes: 'Infundir imediatamente em bolus EV e retestar HGT em 15 minutos.'
      },
      {
        category: 'demais',
        name: 'Insulina NPH humana 100 UI/mL',
        dose: '14 UI pela manhã (08h) e 8 UI à noite (21h)',
        route: 'SC',
        frequency: '12/12h',
        schedule: '08h - 21h',
        notes: 'Aplicar 30 minutos antes das refeições principais. Ajustar conforme mapa glicêmico.'
      },
      {
        category: 'demais',
        name: 'Exame diário dos pés e monitorização de lesões cutâneas',
        dose: '',
        route: '',
        frequency: '1x/dia',
        notes: 'Avaliar perfusão, integridade da pele e pontos de pressão.'
      }
    ]
  }
];

/**
 * Converte um protocolo para uma lista de InpatientItem com novos IDs únicos
 */
export function instantiateProtocolo(protocolo: ProtocoloHospitalar): InpatientItem[] {
  return protocolo.itens.map(item => ({
    ...item,
    id: newInpatientItemId()
  }));
}
