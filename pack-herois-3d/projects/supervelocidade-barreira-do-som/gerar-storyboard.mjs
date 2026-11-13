// "Supervelocidade: a barreira do som" (~39 s, narração ElevenLabs). Cenas alinhadas às 13 frases de frases.json.
// Rode: node projects/supervelocidade-barreira-do-som/gerar-storyboard.mjs [pasta-de-outra-versao] [--checar]
//   pasta-de-outra-versao: versão em outro idioma, com a própria narração (mesmas 13 frases) e textos.json.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ARG = process.argv.slice(2).find((a) => !a.startsWith('--'));
const PASTA = ARG ? path.resolve(ARG) : path.dirname(fileURLToPath(import.meta.url));
const TXT = {
  titulo: 'Supervelocidade: a barreira do som', gancho: 'MACH 1?', bolt: '12 m/s · 43 km/h', recorde: 'RECORDE HUMANO',
  v1: '50 m/s', v2: '150 m/s', v3: '250 m/s', som: '343 m/s · 1.235 km/h', vezes: '28× MAIS RÁPIDO',
  mach: 'MACH 1 = 343 m/s', nuvem: 'pressão cai → vapor vira nuvem', bum: 'BUM!', calor: '+58 °C', g: '35 G', pergunta: 'VOCÊ AINDA IA QUERER SUPERVELOCIDADE?',
  ...(fs.existsSync(path.join(PASTA, 'textos.json')) ? JSON.parse(fs.readFileSync(path.join(PASTA, 'textos.json'), 'utf8')) : {}),
};
const F = JSON.parse(fs.readFileSync(path.join(PASTA, 'frases.json'), 'utf8')).map((f) => [f.inicio, f.fim]);
if (F.length !== 13) throw new Error(`A narração precisa ter 13 frases (tem ${F.length}). Confira a pontuação de narracao.txt.`);

const r2 = (n) => Math.round(n * 100) / 100;
const rad = (d) => (d * Math.PI) / 180;
const corte = (a, b) => r2((F[a][1] + F[b][0]) / 2);
const S = [];
const add = (inicio, fim, c) => S.push({ inicio, fim, ...c });
const ASF = 0.06;
const CAL = 0.2;
const DIA = { fundo: 'cidade', horario: 'dia', chao: 'asfalto' };
const HEROI = 'major_cometa';
const etiqueta = (texto, extra) => ({ tipo: 'etiqueta', texto, tamanho: 1.15, ponto: '#ff7a1a', ...extra });

// ---- cidade ao longo da rua (eixo Z); só o trecho [z0, z1] para a cena ficar leve ----
function cidade(z0, z1, de = 0, ate = 1) {
  const o = [{ id: 'rua', asset: 'rua_reta', pos: [0, 0, r2((z0 + z1) / 2)], params: { length: Math.ceil(z1 - z0 + 60) } }];
  const variantesLoja = ['padaria', 'mercado', undefined];
  let i = 0;
  for (let z = Math.floor((z0 - 10) / 22) * 22; z <= z1 + 25; z += 22, i++) {
    for (const lado of [-1, 1]) {
      const k = (i + (lado > 0 ? 1 : 0)) % 4;
      const id = `b${lado > 0 ? 'D' : 'E'}${i}`;
      if (k === 3) o.push({ id, asset: 'predio_apartamentos', pos: [lado * 12.4, 0, z], giro: -90 * lado, params: { floors: 4 + (i % 3) } });
      else o.push({ id, asset: 'loja', ...(variantesLoja[k] ? { variante: variantesLoja[k] } : {}), pos: [lado * 11, 0, z], giro: -90 * lado });
      if ((i + (lado > 0 ? 1 : 0)) % 2 === 0) o.push({ id: `p${id}`, asset: 'poste_luz', pos: [lado * 4.9, CAL, z + 11], giro: -90 * lado });
      else if (i % 3 === 0) o.push({ id: `a${id}`, asset: 'arvore_redonda', pos: [lado * 4.7, CAL, z + 11], escala: 0.7, params: { seed: i } });
    }
  }
  o.push({ id: 'carro', asset: 'carro_hatch', variante: 'vermelho', pos: [-1.7, ASF, r2(z1 + 20 - 6 * de)], giro: 180, movimentos: [{ de, ate, para: [-1.7, r2(z1 + 20 - 6 * ate)] }] });
  return o;
}

// cortes nas pausas da narração
const C1 = corte(0, 1);
const C2 = corte(1, 2);
const C3 = corte(3, 4);
const C4 = corte(4, 5);
const C5 = corte(5, 6);
const C6 = corte(6, 7);
const C7 = r2(F[8][0] - 0.12); // logo antes do BUM
const C8 = corte(9, 10);
const C9 = corte(10, 11);
const C10 = corte(11, 12);
const FIM = r2(F[12][1] + 2.2);
const BUM = r2(F[8][0]);

// ---- 1. gancho: na largada ----
add(0, C1, {
  ambiente: DIA,
  objetos: [...cidade(-40, 60, 0, C1), { id: 'largada', asset: 'forma', pos: [0, ASF, 0.7], params: { tamanho: [6.6, 0.02, 0.35], cor: '#ffffff' } }],
  personagens: [{ id: 'cometa', preset: HEROI, pos: [0, ASF, 0], giro: 0,
    acoes: [{ clip: 'crouch', de: 0, ate: C1, expressao: 'angry' }, { clip: 'nod', de: r2(C1 - 1.2), ate: C1, camada: 1, mascara: ['head'] }] }],
  fluxos: [{ material: 'poeira', origem: [0, ASF, -0.2], taxa: 6, tamanho: 0.2, vida: 1.2, de: 0.4, ate: C1 }],
  camera: { tipo: 'enquadrar', alvo: 'cometa', plano: 'geral', angulo: 22, elevacao: 3, deriva: -12, aproxima: 0.78, fov: 46 },
  textos: [{ texto: TXT.gancho, de: 0.15, ate: C1, estilo: 'titulo' }],
});

// ---- 2. recorde humano: 12 m/s ----
const vBolt = 12;
const zB = r2(vBolt * (C2 - C1));
const zH1 = r2(vBolt * (C2 - 0.6 - C1));
add(C1, C2, {
  transicao: 'flash',
  ambiente: DIA,
  objetos: [...cidade(-20, 120, C1, C2), { id: 'largada', asset: 'forma', pos: [0, ASF, 0.7], params: { tamanho: [6.6, 0.02, 0.35], cor: '#ffffff' } }],
  personagens: [
    { id: 'corredor', preset: 'homem', pos: [-1.0, ASF, 0], giro: 0,
      overrides: { top: { color: '#f2c94c', sleeves: 'short' }, bottom: { color: '#2f7d4a', type: 'shorts' }, hair: { style: 'short' }, shoes: '#ffffff' },
      movimentos: [{ de: C1, ate: C2, para: [-1.0, zB], clip: 'run' }] },
    { id: 'cometa', preset: HEROI, pos: [0.9, ASF, 0], giro: 0,
      movimentos: [{ de: C1, ate: r2(C2 - 0.6), para: [0.9, zH1], clip: 'run' }, { de: r2(C2 - 0.6), ate: C2, para: [0.9, r2(zH1 + 32)], clip: 'run' }],
      acoes: [{ clip: 'talk', de: C1, ate: r2(C2 - 0.6), camada: 1, mascara: ['face'], expressao: 'happy' }] },
  ],
  fluxos: [{ material: 'poeira', origem: { ancora: 'cometa', desloca: [0, 0.05, -0.4] }, taxa: 30, tamanho: 0.3, vida: 0.8, de: r2(C2 - 0.6), ate: C2 }],
  elementos: [
    etiqueta(TXT.bolt, { ancora: 'corredor', alturaRel: 1.25, de: r2(F[1][0] + 0.8), ate: C2 }),
    etiqueta(TXT.recorde, { ancora: 'corredor', alturaRel: 1.6, ponto: '#2f7d4a', tamanho: 0.9, de: r2(F[1][0]), ate: C2 }),
  ],
  camera: { tipo: 'enquadrar', alvo: 'corredor', plano: 'geral', angulo: 62, elevacao: 6, deriva: 8, fov: 48 },
});

// ---- 3. o som: 343 m/s, 28 vezes mais rápido ----
const z3a = r2(zH1 + 32);
const v3 = 40;
const z3b = r2(z3a + v3 * (C3 - C2));
const marcas = [C2, r2(F[2][0] + 0.2), r2(F[2][0] + 0.9), r2(F[2][0] + 1.6), C3];
add(C2, C3, {
  ambiente: DIA,
  objetos: cidade(z3a - 10, z3b + 20, C2, C3),
  personagens: [{ id: 'cometa', preset: HEROI, pos: [1.3, ASF, z3a], giro: 0,
    movimentos: [{ de: C2, ate: C3, para: [1.3, z3b], clip: 'run' }],
    acoes: [{ clip: 'run', de: C2, ate: C3, camada: 1, mascara: ['face'], expressao: 'surprised' }] }],
  fluxos: [
    { material: 'ar', origem: { ancora: 'cometa', desloca: [0, 1.2, 2.2] }, destino: { ancora: 'cometa', desloca: [0, 1.0, -5] }, taxa: 60, dispersao: 0.9, espalha: 1.2, vida: 0.35 },
    { material: 'poeira', origem: { ancora: 'cometa', desloca: [0, 0.05, -0.6] }, taxa: 20, tamanho: 0.25, vida: 0.6 },
  ],
  rastros: [{ seguir: 'cometa', largura: 0.5, altura: 0.03, cor: '#9fe3ff', brilho: true, recuo: 0.8 }],
  elementos: [
    etiqueta(TXT.v1, { ancora: 'cometa', alturaRel: 1.3, de: marcas[0], ate: marcas[1] }),
    etiqueta(TXT.v2, { ancora: 'cometa', alturaRel: 1.3, de: marcas[1], ate: marcas[2] }),
    etiqueta(TXT.v3, { ancora: 'cometa', alturaRel: 1.3, de: marcas[2], ate: marcas[3] }),
    etiqueta(TXT.som, { ancora: 'cometa', alturaRel: 1.3, ponto: '#3d8bfd', de: marcas[3], ate: C3 }),
    etiqueta(TXT.vezes, { pos: [0.5, 0.2], tamanho: 1.3, ponto: '#ff3b1f', de: r2(F[3][0]), ate: C3 }),
  ],
  camera: { tipo: 'enquadrar', alvo: 'cometa', plano: 'geral', angulo: 75, elevacao: 5, deriva: 10, fov: 48 },
});

// ---- 4 a 7. CONGELA: câmera lenta e câmera girando em volta dele ----
const P0 = [0, ASF, 0];
const VEL_LENTA = 0.02;
const FASE0 = 0.17; // meio da passada do "run"
const congelado = (de, ate, extra = {}) => ({
  id: 'cometa', preset: HEROI, pos: P0, giro: 0,
  acoes: [{ clip: 'run', de, ate, velocidade: VEL_LENTA, fase: r2(FASE0 + (de - C3) * VEL_LENTA * 1), suavizacao: 0.01, expressao: 'surprised' }],
  ...extra,
});
// poeira e cascalho parados no ar
const suspensos = () => [[-0.4, 0.25, -0.5, 0.07], [0.3, 0.4, -0.9, 0.05], [0.1, 0.15, -1.4, 0.09], [-0.2, 0.55, -1.1, 0.04], [0.5, 0.3, -0.3, 0.05]].map(([x, y, z, s], i) => (
  { id: `pedrinha${i}`, asset: 'forma', pos: [x, y, z], params: { tipo: 'esfera', tamanho: [s, s, s], cor: '#b9b2a4', apoiada: false }, anim: { oscila: { eixo: 'y', amp: 0.01, freq: 0.2 } } }));
const ondas = (etapa) => ({ id: 'ondas', asset: 'ondas_som', pos: [0, 0, 0.1], params: { raio: 1.8, ondas: 6, altura: 1.2, progress: etapa[0][1] }, etapa });
const vapor = (etapa) => ({ id: 'vapor', asset: 'cone_vapor', pos: [0, 0, 0], params: { comprimento: 2.1, raio: 0.95, altura: 1.15, progress: etapa[0][1] }, etapa });

add(C3, C4, {
  transicao: 'flash',
  ambiente: DIA,
  objetos: [...cidade(-30, 40, C3, C4), ...suspensos(), ondas([[C3, 0.3], [C4, 0.35]])],
  personagens: [congelado(C3, C4)],
  efeitos: [{ tipo: 'zoom', de: C3, ate: C4, para: 1.08 }],
  camera: { tipo: 'enquadrar', alvo: 'cometa', plano: 'geral', angulo: 90, elevacao: 8, deriva: 20, fov: 46 },
});
add(C4, C5, {
  ambiente: DIA,
  objetos: [...cidade(-30, 40, C4, C5), ...suspensos(), ondas([[C4, 0.35], [r2(C5 - 0.4), 0.8]])],
  personagens: [congelado(C4, C5)],
  fluxos: [{ material: 'ar', origem: [0, 1.2, 4.5], destino: [0, 1.2, 0.5], taxa: 8, dispersao: 0.6, espalha: 0.3, vida: 3.5 }],
  elementos: [etiqueta(TXT.mach, { pos: [0.5, 0.22], tamanho: 1.3, ponto: '#3d8bfd', de: r2(F[5][0] + 2.0), ate: C5 })],
  camera: { tipo: 'enquadrar', alvo: 'cometa', plano: 'geral', angulo: 110, elevacao: 9, deriva: 100, fov: 50 },
});
add(C5, C6, {
  ambiente: DIA,
  objetos: [...cidade(-30, 40, C5, C6), ...suspensos(), ondas([[C5, 0.8], [C6, 0.84]]), vapor([[r2(C5 + 0.2), 0], [r2(C6 - 0.6), 1]])],
  personagens: [congelado(C5, C6)],
  fluxos: [{ material: 'vapor', origem: [0, 1.2, -0.6], taxa: 6, tamanho: 0.35, vida: 3, de: r2(C5 + 0.6), ate: C6 }],
  elementos: [etiqueta(TXT.nuvem, { pos: [0.5, 0.22], tamanho: 1.1, ponto: '#8fd3ff', de: r2(F[6][0] + 0.3), ate: C6 })],
  camera: { tipo: 'enquadrar', alvo: 'cometa', plano: 'geral', angulo: 210, elevacao: 10, deriva: 90, fov: 50 },
});
add(C6, C7, {
  ambiente: DIA,
  objetos: [...cidade(-30, 40, C6, C7), ...suspensos(), ondas([[C6, 0.84], [C7, 1]]), vapor([[C6, 1]])],
  personagens: [congelado(C6, C7)],
  camera: { tipo: 'enquadrar', alvo: 'cometa', plano: 'geral', angulo: 300, elevacao: 24, deriva: 40, aproxima: 1.35, fov: 52 },
});

// ---- 8. BUM! O tempo volta, o estrondo e ele seguindo pela rua ----
const SAIDA = r2(BUM + 0.08);
const zFim8 = 220;
const tPos = (z) => r2(SAIDA + (z / zFim8) * (C8 - 0.4 - SAIDA)); // quando ele passa em z
const aneis = [[0, BUM, 26], [70, tPos(70), 22], [140, tPos(140), 22]];
add(C7, C8, {
  ambiente: DIA,
  objetos: [
    ...cidade(-30, zFim8 + 20, C7, C8),
    ...aneis.map(([z, t, raio], i) => ({ id: `choque${i}`, asset: 'anel_choque', pos: [0, ASF, z], params: { raio, progress: 0 }, etapa: [[t, 0], [r2(t + 1.4), 1]] })),
    { id: 'vapor', asset: 'cone_vapor', pos: [0, 0, 0], params: { comprimento: 2.1, raio: 0.95, altura: 1.15 }, movimentos: [{ de: SAIDA, ate: r2(C8 - 0.4), para: [0, zFim8] }] },
  ],
  personagens: [{ id: 'cometa', preset: HEROI, pos: P0, giro: 0,
    movimentos: [{ de: SAIDA, ate: r2(C8 - 0.4), para: [0, zFim8], clip: 'run' }],
    acoes: [{ clip: 'run', de: C7, ate: SAIDA, velocidade: VEL_LENTA, fase: r2(FASE0 + (C7 - C3) * VEL_LENTA) }] }],
  fluxos: [
    { material: 'poeira', origem: [0, ASF, 0], taxa: 120, tamanho: 0.9, vida: 1.6, dispersao: 3, espalha: 6, de: BUM, ate: r2(BUM + 0.5) },
    { material: 'fagulha', origem: [0, 0.4, 0], destino: [0, 1.5, 3], taxa: 90, espalha: 5, de: BUM, ate: r2(BUM + 0.35) },
  ],
  efeitos: [{ tipo: 'tremor', de: BUM, ate: r2(BUM + 0.8), intensidade: 1 }],
  camera: { tipo: 'travelling', de: { pos: [3.6, 1.7, -6.5], olha: [0, 1.3, 6] }, para: { pos: [3.4, 2.1, -7.5], olha: [0, 1.5, 40] }, fov: 54 },
  textos: [{ texto: TXT.bum, de: BUM, ate: r2(BUM + 1.6), estilo: 'destaque' }],
});

// ---- 9. o ar no rosto esquenta ~58 °C ----
add(C8, C9, {
  transicao: 'flash',
  ambiente: DIA,
  objetos: cidade(-110, 120, C8, C9),
  personagens: [{ id: 'cometa', preset: HEROI, pos: [0, ASF, -100], giro: 0,
    movimentos: [{ de: C8, ate: C9, para: [0, 100], clip: 'run' }],
    acoes: [{ clip: 'run', de: C8, ate: C9, camada: 1, mascara: ['face'], expressao: 'worried' }] }],
  fluxos: [
    { material: 'vapor', origem: { ancora: 'cometa', desloca: [0, 1.95, -0.1] }, taxa: 18, tamanho: 0.25, vida: 0.7, subida: 1 },
    { material: 'ar', origem: { ancora: 'cometa', desloca: [0, 1.7, 1.6] }, destino: { ancora: 'cometa', desloca: [0, 1.5, -3] }, taxa: 50, dispersao: 0.5, espalha: 0.8, vida: 0.3 },
    { material: 'fagulha', origem: { ancora: 'cometa', desloca: [0, 1.75, 0.3] }, destino: { ancora: 'cometa', desloca: [0, 2.2, -0.8] }, taxa: 25, espalha: 0.6, de: r2(F[10][0] + 0.8), ate: C9 },
  ],
  elementos: [etiqueta(TXT.calor, { ancora: 'cometa', alturaRel: 1.12, dx: 0.17, tamanho: 1.4, ponto: '#ff3b1f', de: r2(F[10][0] + 1.2), ate: C9 })],
  camera: { tipo: 'enquadrar', alvo: 'cometa', plano: 'medio', angulo: 18, elevacao: 4, deriva: -10, fov: 46 },
});

// ---- 10. a freada: 35 G ----
const Z0 = -34;
const ZBATE = 0.15;
const T_BATE = r2(C10 - 0.75);
const freada = [];
for (let t = C9; t <= T_BATE + 1e-6; t += 0.06) {
  const u = Math.min(1, (t - C9) / (T_BATE - C9));
  freada.push([r2(t), [0, ASF, r2(Z0 + (ZBATE - Z0) * (1 - (1 - u) ** 2.2))]]);
}
const zEm = (t) => freada.reduce((a, k) => (k[0] <= t ? k[1][2] : a), Z0);
const faiscas = [0, 0.25, 0.5, 0.75].map((f) => r2(C9 + f * (T_BATE - C9)));
add(C9, C10, {
  ambiente: DIA,
  objetos: [...cidade(-50, 40, C9, C10), { id: 'lixeira', asset: 'lixeira', pos: [0.15, ASF, 1.0], giro: 180, anim: { giro: [[T_BATE, 0], [r2(T_BATE + 0.3), -85]], eixo: 'x' } }],
  personagens: [{ id: 'cometa', preset: HEROI, pos: [0, ASF, Z0], giro: 0,
    anim: { pos: freada, suave: false },
    acoes: [{ clip: 'derrapar', de: C9, ate: T_BATE, expressao: 'surprised' }, { clip: 'surprised', de: T_BATE, ate: C10 }] }],
  fluxos: [
    ...faiscas.map((t) => ({ material: 'fagulha', origem: [0, 0.12, zEm(t) + 0.4], destino: [0, 0.4, zEm(t) - 1.6], taxa: 80, espalha: 1.2, de: t, ate: r2(t + (T_BATE - C9) / 4) })),
    ...faiscas.map((t) => ({ material: 'fumaca', origem: [0, 0.1, zEm(t)], taxa: 10, tamanho: 0.45, vida: 1.6, de: t, ate: r2(t + (T_BATE - C9) / 4) })),
    { material: 'poeira', origem: [0, ASF, 0.6], taxa: 70, tamanho: 0.4, vida: 1, dispersao: 1, de: T_BATE, ate: r2(T_BATE + 0.3) },
  ],
  efeitos: [{ tipo: 'tremor', de: T_BATE, ate: r2(T_BATE + 0.45), intensidade: 0.7 }],
  elementos: [etiqueta(TXT.g, { pos: [0.72, 0.3], tamanho: 1.6, ponto: '#ff3b1f', de: r2(F[11][0] + 1.4), ate: C10 })],
  camera: { tipo: 'fixa', pos: [-2.6, 2.1, 6.4], olha: [0.2, 0.8, -8], fov: 50 },
});

// ---- 11. final: tonto no chão ----
add(C10, FIM, {
  ambiente: DIA,
  objetos: [...cidade(-50, 40, C10, FIM), { id: 'lixeira', asset: 'lixeira', pos: [0.95, ASF, 0.9], giro: 180, anim: { giro: [[C10, -85]], eixo: 'x' } }],
  personagens: [{ id: 'cometa', preset: HEROI, pos: [0, ASF, 0.2], giro: 0,
    acoes: [{ clip: 'tonto_no_chao', de: C10, ate: FIM, suavizacao: 0.01 }] }],
  fluxos: [{ material: 'fumaca', origem: [0.1, 0.15, 0.7], taxa: 4, tamanho: 0.4, vida: 2.2 }],
  elementos: [
    { tipo: 'icone', icone: 'estrela', ancora: 'cometa', alturaRel: 0.95, dx: -0.12, tamanho: 0.08, pulsa: true },
    { tipo: 'icone', icone: 'estrela', ancora: 'cometa', alturaRel: 1.0, dx: 0.12, tamanho: 0.07, pulsa: true },
  ],
  camera: { tipo: 'enquadrar', alvo: 'cometa', plano: 'medio', angulo: 0, elevacao: 12, aproxima: 0.85, fov: 46 },
  textos: [{ texto: TXT.pergunta, de: r2(F[12][0]), ate: FIM, estilo: 'pergunta' }],
});

const sb = {
  versao: 1,
  titulo: TXT.titulo,
  formato: { largura: 1080, altura: 1920, fps: 30 },
  duracao: FIM,
  audio: 'narracao.mp3',
  palavras: 'palavras.json',
  legendas: { ativo: true, palavrasPorBloco: 1 },
  ambiente: DIA,
  cenas: S,
};
fs.writeFileSync(path.join(PASTA, 'storyboard.json'), JSON.stringify(sb, null, 2) + '\n');
console.log(`storyboard.json: ${S.length} cenas, ${FIM} s; cortes ${S.map((c) => c.inicio).join(' / ')}`);
