// Personagens prontos. Todos usam o MESMO esqueleto; só mudam cores, roupa, cabelo, chapéu e proporções.
// Cada preset tem "role" (papel narrativo sugerido) para o Claude escolher quem usar em cada cena.

import { makeCharacter } from './makeCharacter.js';

const SKIN = {
  clara: '#f3cfae',
  media: '#e0ac69',
  parda: '#c68642',
  escura: '#8d5524',
  muitoEscura: '#5c3a21',
};

// ---- fábrica de heróis: um herói novo é só uma ficha de dados ----
// criarHeroi({ papel, cores: { traje, calca, mascara, lentes, contorno, destaque, luvas, botas },
//              corpo: { altura, porte, cabeca }, lentes: { forma, escala }, simbolo, corSimbolo,
//              acessorios: [...], poderes: [{ nome, clip, params?, velocidade? }] })
// Formas de lente: gota, redonda, fenda. Emblemas e acessórios: ver acessorios.js (EMBLEMAS, ACESSORIOS).
export function criarHeroi(f) {
  const c = f.cores;
  return {
    role: f.papel,
    poderes: f.poderes || [],
    config: {
      skin: c.mascara, height: f.corpo?.altura ?? 1, build: f.corpo?.porte ?? 1, headScale: f.corpo?.cabeca ?? 1,
      top: { color: c.traje, sleeves: 'long' },
      bottom: { color: c.calca || c.traje, type: 'pants' },
      shoes: c.botas || c.destaque,
      hair: { style: 'none', color: c.mascara },
      hero: {
        mask: c.mascara, eyes: c.lentes || '#ffffff', outline: c.contorno || '#0b0f18', accent: c.destaque,
        gloves: c.luvas || c.destaque, boots: c.botas || c.destaque,
        simbolo: f.simbolo, corSimbolo: f.corSimbolo, escalaSimbolo: f.escalaSimbolo, lentes: f.lentes,
      },
      acessorios: f.acessorios || [],
    },
  };
}

export const PRESETS = {
  construtor: {
    role: 'Protagonista / narrador. Mestre de obras: explica o passo a passo da construção.',
    config: {
      skin: SKIN.media, height: 1, build: 1.05,
      top: { color: '#f28c28', stripe: '#f2f2f2', sleeves: 'short' },
      bottom: { color: '#3d5a80', type: 'pants' },
      shoes: '#5a3e2b',
      hair: { style: 'short', color: '#2f2118' },
      hat: { type: 'hardhat', color: '#ffc61a' },
      face: { mustache: true, facialHairColor: '#2f2118' },
    },
  },
  engenheiro: {
    role: 'Especialista técnico. Entra para explicar cálculo, projeto e normas. Já vem com prancheta na mão esquerda.',
    config: {
      skin: SKIN.clara, height: 1.02, build: 0.95,
      top: { color: '#7fb3d5', sleeves: 'long' },
      bottom: { color: '#4a4f57', type: 'pants' },
      shoes: '#2d2d2d',
      hair: { style: 'short', color: '#6b4a2b' },
      hat: { type: 'hardhat', color: '#f5f5f5' },
      face: { glasses: true },
      held: { L: 'clipboard' },
    },
  },
  engenheira: {
    role: 'Especialista técnica / supervisora de obra. Voz de autoridade amigável.',
    config: {
      skin: SKIN.escura, height: 0.96, build: 0.92,
      top: { color: '#ff8a3d', stripe: '#e8e8e8', sleeves: 'long' },
      bottom: { color: '#4a4f57', type: 'pants' },
      shoes: '#3a2a20',
      hair: { style: 'ponytail', color: '#1c1410' },
      hat: { type: 'hardhat', color: '#f5f5f5' },
    },
  },
  servente: {
    role: 'Ajudante de obra. Faz o trabalho braçal (cava, carrega, empurra). Já vem com pá na mão direita.',
    config: {
      skin: SKIN.muitoEscura, height: 1, build: 1.1,
      top: { color: '#9aa0a6', sleeves: 'short' },
      bottom: { color: '#b59a6a', type: 'shorts' },
      shoes: '#3b3b3b',
      hair: { style: 'short', color: '#16110d' },
      hat: { type: 'hardhat', color: '#2f6fd6' },
      held: { R: 'shovel' },
    },
  },
  homem: {
    role: 'Morador / pessoa comum (dono da casa, passante, curioso fazendo a pergunta do vídeo).',
    config: {
      skin: SKIN.clara, height: 1, build: 1,
      top: { color: '#5fae6b', sleeves: 'short' },
      bottom: { color: '#3d5a80', type: 'pants' },
      shoes: '#f2f2f2',
      hair: { style: 'fringe', color: '#6b4a2b' },
    },
  },
  mulher: {
    role: 'Moradora / pessoa comum (vizinha, mãe, passageira).',
    config: {
      skin: SKIN.media, height: 0.95, build: 0.92,
      top: { color: '#d96c8c', sleeves: 'short' },
      bottom: { color: '#7a5aa6', type: 'skirt' },
      shoes: '#5b2a3a',
      hair: { style: 'long', color: '#2a1a12' },
    },
  },
  velhinho: {
    role: 'Idoso curioso ou sábio. Bom para perguntas ("como isso se sustenta?") e humor.',
    config: {
      skin: SKIN.clara, height: 0.94, build: 1.08, stoop: 12,
      top: { color: '#8a6d4b', sleeves: 'long' },
      bottom: { color: '#c9b88f', type: 'pants' },
      shoes: '#4a3728',
      hair: { style: 'sides', color: '#e8e8e8' },
      face: { glasses: true, mustache: true, facialHairColor: '#e8e8e8', brow: '#cfcfcf' },
    },
  },
  velhinha: {
    role: 'Idosa curiosa ou sábia. Boa para reações e comentários simpáticos.',
    config: {
      skin: SKIN.parda, height: 0.9, build: 1, stoop: 10,
      top: { color: '#b08fd0', sleeves: 'long' },
      bottom: { color: '#8e6fb0', type: 'skirt' },
      shoes: '#3a3a3a',
      hair: { style: 'bun', color: '#efefef' },
      face: { glasses: true, brow: '#cfcfcf' },
    },
  },
  crianca: {
    role: 'Criança curiosa (menino). Faz as perguntas ingênuas que puxam a explicação.',
    config: {
      skin: SKIN.parda, height: 0.64, headScale: 1.18, build: 0.95,
      top: { color: '#f2d13a', sleeves: 'short' },
      bottom: { color: '#3d5a80', type: 'shorts' },
      shoes: '#d94f4f',
      hair: { style: 'short', color: '#2a1a12' },
      hat: { type: 'cap', color: '#d94f4f' },
    },
  },
  menina: {
    role: 'Criança curiosa (menina). Faz perguntas e reage com surpresa.',
    config: {
      skin: SKIN.escura, height: 0.62, headScale: 1.18, build: 0.92,
      top: { color: '#e8586a', sleeves: 'short' },
      bottom: { color: '#e8586a', type: 'skirt' },
      shoes: '#f2f2f2',
      hair: { style: 'ponytail', color: '#1c1410' },
    },
  },
  motorista: {
    role: 'Motorista (carro, ônibus, caminhão, metrô). Use com a animação sit (params: { arms: "wheel" }).',
    config: {
      skin: SKIN.media, height: 1, build: 1.15,
      top: { color: '#34495e', sleeves: 'short' },
      bottom: { color: '#2c3e50', type: 'pants' },
      shoes: '#222222',
      hair: { style: 'short', color: '#4a3020' },
      hat: { type: 'cap', color: '#1f2d3d' },
      face: { beard: true, facialHairColor: '#4a3020' },
    },
  },

  // NOVA LINHA: heróis animados originais de estética HQ/acrobática.
  // O desenho, símbolo e paleta são próprios; não reproduzem heróis licenciados.
  heroi_vertice: {
    poderes: [{ nome: 'Pose heroica', clip: 'heroi_pose' }, { nome: 'Correr', clip: 'run' }, { nome: 'Salto heroico', clip: 'salto_heroico' }, { nome: 'Aterrissagem', clip: 'aterrissagem_heroica' }, { nome: 'Lutar', clip: 'lutar' }],
    role: 'Protagonista mascarado. Apresenta curiosidades, corre, salta, explica e reage diante da câmera.',
    config: {
      skin: '#14243e', height: 1.02, build: 0.95, headScale: 1.07,
      top: { color: '#182c53', sleeves: 'long' },
      bottom: { color: '#12213b', type: 'pants' },
      shoes: '#f27a21',
      hair: { style: 'none', color: '#14243e' },
      hero: { mask: '#182c53', eyes: '#effbff', outline: '#06111e', accent: '#ff7a00', gloves: '#ff7a00', boots: '#ff7a00' },
    },
  },
  heroina_pulso: {
    poderes: [{ nome: 'Pose heroica', clip: 'heroi_pose' }, { nome: 'Correr', clip: 'run' }, { nome: 'Salto heroico', clip: 'salto_heroico' }, { nome: 'Aterrissagem', clip: 'aterrissagem_heroica' }, { nome: 'Lutar', clip: 'lutar' }],
    role: 'Heroína parceira. Explica ciência, reações e energia com ação acrobática.',
    config: {
      skin: '#174047', height: 0.95, build: 0.90, headScale: 1.04,
      top: { color: '#0a4248', sleeves: 'long' },
      bottom: { color: '#14303b', type: 'pants' },
      shoes: '#3ce5d3',
      hair: { style: 'none', color: '#174047' },
      hero: { mask: '#0a4248', eyes: '#ffffff', outline: '#001f27', accent: '#3ce5d3', gloves: '#3ce5d3', boots: '#3ce5d3' },
    },
  },
  heroi_impacto: {
    poderes: [{ nome: 'Pose heroica', clip: 'heroi_pose' }, { nome: 'Correr', clip: 'run' }, { nome: 'Salto heroico', clip: 'salto_heroico' }, { nome: 'Aterrissagem', clip: 'aterrissagem_heroica' }, { nome: 'Lutar', clip: 'lutar' }],
    role: 'Herói forte e bem-humorado. Entra em cena para demonstrar forças e mecanismos.',
    config: {
      skin: '#392343', height: 1.05, build: 1.13, headScale: 1.00,
      top: { color: '#40244c', sleeves: 'long' },
      bottom: { color: '#251a35', type: 'pants' },
      shoes: '#fbd060',
      hair: { style: 'none', color: '#392343' },
      hero: { mask: '#40244c', eyes: '#ffffff', outline: '#21102c', accent: '#fbd060', gloves: '#fbd060', boots: '#fbd060' },
    },
  },

  // NOVA LINHA 2: heróis de humor, arquétipos clássicos com visual e emblemas próprios (criados com criarHeroi).
  aracnildo: criarHeroi({
    papel: 'Herói-aranha atrapalhado e simpático. Lança fios, escala paredes, salta, balança entre prédios e sente perigos.',
    cores: { traje: '#8fd14f', calca: '#5b2a86', mascara: '#5b2a86', lentes: '#ffffff', contorno: '#1d0f2e', destaque: '#ffd23f', luvas: '#5b2a86', botas: '#5b2a86' },
    corpo: { altura: 0.98, porte: 0.88, cabeca: 1.1 },
    lentes: { forma: 'gota', escala: 1.05 },
    simbolo: 'aranha_fofa', corSimbolo: '#5b2a86', escalaSimbolo: 1.15,
    acessorios: [
      { tipo: 'olhos_extras', quantidade: 4, cor: '#ffd23f', borda: '#1d0f2e' },
      { tipo: 'lancadores', cor: '#ffd23f' },
      { tipo: 'fio', lados: ['R', 'L'], ponta: 'teia', cor: '#f4f8ff' },
    ],
    poderes: [
      { nome: 'Lançar fio', clip: 'lancar_teia' },
      { nome: 'Escalar parede', clip: 'escalar' },
      { nome: 'Saltar', clip: 'salto_heroico' },
      { nome: 'Balançar', clip: 'balancar' },
      { nome: 'Sentir perigo', clip: 'sentir_perigo' },
    ],
  }),
  major_cometa: criarHeroi({
    papel: 'Herói voador, forte e um pouco exibido. Voa, levanta peso, corre muito rápido, tem visão de calor e sopro congelante.',
    cores: { traje: '#f5f3ee', calca: '#ff7a1a', mascara: '#ff7a1a', lentes: '#e9fbff', contorno: '#2a1606', destaque: '#1aa6a6', luvas: '#1aa6a6', botas: '#1aa6a6' },
    corpo: { altura: 1.04, porte: 1.1, cabeca: 1.0 },
    lentes: { forma: 'fenda' },
    simbolo: 'cometa', corSimbolo: '#ff7a1a', escalaSimbolo: 1.1,
    acessorios: [
      { tipo: 'capa', cor: '#1aa6a6', forro: '#0f6d6d', comprimento: 0.82 },
      { tipo: 'feixes_olhos', cor: '#ff3b1f' },
      { tipo: 'sopro', cor: '#9fe3ff' },
    ],
    poderes: [
      { nome: 'Voar', clip: 'voar' },
      { nome: 'Levantar peso', clip: 'levantar_peso' },
      { nome: 'Supervelocidade', clip: 'run', velocidade: 2.4 },
      { nome: 'Visão de calor', clip: 'visao_calor' },
      { nome: 'Sopro congelante', clip: 'sopro_congelante' },
    ],
  }),
  coruja_noturna: criarHeroi({
    papel: 'Vigilante noturna séria (mas dorminhoca de dia). Usa gancho, plana com a capa, luta, lança dispositivos e some na fumaça.',
    cores: { traje: '#4a3e5c', calca: '#2a2433', mascara: '#3b2f4a', lentes: '#ffd36b', contorno: '#120d18', destaque: '#f2b134', luvas: '#2a2433', botas: '#2a2433' },
    corpo: { altura: 1.0, porte: 1.0, cabeca: 1.02 },
    lentes: { forma: 'redonda', escala: 1.08 },
    simbolo: 'coruja', corSimbolo: '#f2b134', escalaSimbolo: 1.1,
    acessorios: [
      { tipo: 'tufos_coruja', cor: '#3b2f4a', borda: '#f2b134' },
      { tipo: 'capa', formato: 'asa', cor: '#2a2433', forro: '#5a4a70', comprimento: 0.95 },
      { tipo: 'cinto', cor: '#f2b134', bolsa: '#c98f1a', bolsas: 5 },
      { tipo: 'fio', lados: ['R'], ponta: 'gancho', cor: '#d8d8e0', raio: 0.01 },
      { tipo: 'nuvem', cor: '#5f5a6e' },
    ],
    poderes: [
      { nome: 'Gancho', clip: 'lancar_gancho' },
      { nome: 'Planar', clip: 'planar' },
      { nome: 'Lutar', clip: 'lutar' },
      { nome: 'Lançar dispositivo', clip: 'lancar_dispositivo' },
      { nome: 'Fumaça', clip: 'soltar_fumaca' },
    ],
  }),
  capitao_tampa: criarHeroi({
    papel: 'Capitão destemido com capacete de panela e escudo-tampa. Arremessa o escudo, defende, corre, salta e luta.',
    cores: { traje: '#2f7d4a', calca: '#1f4f31', mascara: '#2f7d4a', lentes: '#ffffff', contorno: '#0d2416', destaque: '#c8893a', luvas: '#c8893a', botas: '#6b4423' },
    corpo: { altura: 1.03, porte: 1.08, cabeca: 1.0 },
    simbolo: 'espiral', corSimbolo: '#c8893a', escalaSimbolo: 1.2,
    acessorios: [
      { tipo: 'capacete', formato: 'panela', cor: '#b9c2cc', borda: '#c8893a', pegador: '#2b2f34' },
      { tipo: 'escudo', lado: 'L', cor: '#b9c2cc', borda: '#c8893a', miolo: '#d5dbe2', simbolo: 'espiral', corSimbolo: '#c8893a' },
    ],
    poderes: [
      { nome: 'Arremessar escudo', clip: 'arremessar_escudo' },
      { nome: 'Defender', clip: 'defender' },
      { nome: 'Correr', clip: 'run' },
      { nome: 'Saltar', clip: 'salto_heroico' },
      { nome: 'Lutar', clip: 'lutar' },
    ],
  }),
};

export const PRESET_NAMES = Object.keys(PRESETS);

// makePreset('construtor', { top: { color: '#ff0000' } }) → personagem com ajustes por cima do preset.
export function makePreset(name, overrides = {}) {
  const p = PRESETS[name];
  if (!p) throw new Error(`Preset de personagem desconhecido: "${name}". Opções: ${PRESET_NAMES.join(', ')}`);
  return makeCharacter({ ...p.config, ...overrides, name: overrides.name || name,
    top: { ...(p.config.top || {}), ...(overrides.top || {}) },
    bottom: { ...(p.config.bottom || {}), ...(overrides.bottom || {}) },
    hair: { ...(p.config.hair || {}), ...(overrides.hair || {}) },
    hat: { ...(p.config.hat || {}), ...(overrides.hat || {}) },
    face: { ...(p.config.face || {}), ...(overrides.face || {}) },
    held: { ...(p.config.held || {}), ...(overrides.held || {}) },
    hero: p.config.hero ? { ...p.config.hero, ...(overrides.hero || {}) } : overrides.hero,
    acessorios: overrides.acessorios || p.config.acessorios || [],
    role: p.role,
  });
}
