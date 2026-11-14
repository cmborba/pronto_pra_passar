// "O animal raro que o Major Cometa achou na Amazônia: o boto-cor-de-rosa" (~88 s, narração ElevenLabs).
// História encadeada com viradas (comando mestre). Cenas alinhadas às 23 frases de frases.json.
// Rode: node projects/boto-cor-de-rosa/gerar-storyboard.mjs [pasta-de-outra-versao]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ARG = process.argv.slice(2).find((a) => !a.startsWith('--'));
const PASTA = ARG ? path.resolve(ARG) : path.dirname(fileURLToPath(import.meta.url));
const TXT = {
  titulo: 'O boto-cor-de-rosa', gancho: 'ALGO ROSA NO RIO?', lente: 'SUPERVISÃO ×40', tamanho: 'até 2,5 m',
  surpresa: 'NÃO NASCE ROSA?!', filhote: 'filhote: cinza', adulto: 'adulto: rosa', cicatriz: 'cicatrizes = mais rosa',
  pescoco: '90°', cheia: 'FLORESTA ALAGADA', barro: 'visibilidade: quase zero', sonar: 'clique → eco',
  tefe: 'LAGO TEFÉ · 2023', calor: '39 °C', mortos: '209 botos e tucuxis', hoje: 'hoje', dez: '+10 anos', vinte: '+20 anos',
  perigo: 'EM PERIGO · IUCN', lenda: 'A LENDA DO BOTO', pergunta: 'VOCÊ JÁ OUVIU ESSA LENDA?',
  ...(fs.existsSync(path.join(PASTA, 'textos.json')) ? JSON.parse(fs.readFileSync(path.join(PASTA, 'textos.json'), 'utf8')) : {}),
};
const F = JSON.parse(fs.readFileSync(path.join(PASTA, 'frases.json'), 'utf8')).map((f) => [f.inicio, f.fim]);
if (F.length !== 23) throw new Error(`A narração precisa ter 23 frases (tem ${F.length}).`);

const r2 = (n) => Math.round(n * 100) / 100;
const rad = (d) => (d * Math.PI) / 180;
const ease = (u) => u * u * (3 - 2 * u);
const corte = (a, b) => r2((F[a][1] + F[b][0]) / 2);
const S = [];
const add = (inicio, fim, c) => S.push({ inicio, fim, ...c });
const trilha = (t0, t1, f, passo = 0.06) => {
  const ks = [];
  for (let t = t0; t <= t1 + 1e-6; t += passo) ks.push([r2(t), f(Math.min(1, (t - t0) / (t1 - t0))).map(r2)]);
  return ks;
};
const etiqueta = (texto, extra) => ({ tipo: 'etiqueta', texto, tamanho: 1.15, ponto: '#ef6f95', ...extra });

// ---------------- o rio ----------------
const NIVEL = 1.22; // superfície da água (agua_nivel altura 1.2)
const NADA = r2(NIVEL - 0.68 + 0.12); // boto com as costas para fora da água
const FUNDO = 0.25; // boto mergulhado
const DIA = { fundo: 'floresta', horario: 'dia', chao: 'grama' };
const TARDE = { fundo: 'floresta', horario: 'tarde', chao: 'grama' };
const rio = (extra = {}) => ({ id: 'rio', asset: 'agua_nivel', pos: [0, 0, 0], params: { tamanho: [36, 170], altura: 1.2, cor: '#4f8a88', progress: 1, ...(extra.params || {}) }, ...extra, ...(extra.params ? { params: { tamanho: [36, 170], altura: 1.2, cor: '#4f8a88', progress: 1, ...extra.params } } : {}) });
function floresta(z0, z1, semente = 1, dentroDaAgua = false, clareira = null) {
  const o = [];
  let i = 0;
  const tipos = [['arvore_redonda', 'grande'], ['arvore_redonda', 'escura'], ['palmeira', 'alta'], ['arvore_redonda', undefined], ['arvore_frutifera', 'laranja'], ['palmeira', undefined]];
  for (let z = Math.floor(z0 / 8) * 8; z <= z1; z += 8) {
    for (const lado of [-1, 1]) {
      for (const [col, xb] of [[0, 20], [1, 27], [2, 35]]) {
        const h = Math.sin((z + col * 13 + semente * 7) * 12.9898 + lado * 3.1) * 43758.5453;
        const j = h - Math.floor(h);
        const [asset, variante] = tipos[(i + col + (lado > 0 ? 2 : 0)) % tipos.length];
        o.push({ id: `t${i}_${col}_${lado > 0 ? 'd' : 'e'}`, asset, ...(variante ? { variante } : {}), pos: [lado * (xb + j * 4), 0, r2(z + (j - 0.5) * 5)], escala: r2(1.3 + j * 0.9), params: { seed: (i + col) % 9 } });
      }
    }
    i++;
  }
  if (dentroDaAgua) {
    // floresta alagada: troncos dentro do rio
    for (let z = Math.floor(z0 / 6) * 6; z <= z1; z += 6) {
      for (const x of [-9, -3.5, 3, 8.5]) {
        const h = Math.sin((z * 3.7 + x * 1.3 + semente) * 12.9898) * 43758.5453;
        const j = h - Math.floor(h);
        const px = r2(x + (j - 0.5) * 3);
        const pz = r2(z + (j - 0.5) * 3);
        if (clareira && Math.hypot(px - clareira[0], pz - clareira[1]) < clareira[2]) continue;
        o.push({ id: `ta${z}_${x}`, asset: j > 0.5 ? 'arvore_redonda' : 'palmeira', ...(j > 0.75 ? { variante: 'escura' } : {}), pos: [px, 0, pz], escala: r2(1.2 + j * 0.6), params: { seed: Math.floor(j * 9) } });
      }
    }
  }
  return o;
}
const boto = (id, extra = {}) => ({ id, asset: 'boto', pos: [0, NADA, 0], ...extra });

// cortes
const C = [];
C[1] = corte(0, 1);
C[2] = corte(2, 3);
C[3] = corte(3, 4);
C[4] = corte(4, 5);
C[5] = corte(5, 6);
C[6] = corte(6, 7);
C[7] = corte(8, 9);
C[8] = corte(11, 12);
C[9] = corte(12, 13);
C[10] = corte(13, 14);
C[11] = corte(14, 15);
C[12] = corte(15, 16);
C[13] = corte(16, 17);
C[14] = corte(17, 18);
C[15] = corte(18, 19);
C[16] = corte(19, 20);
C[17] = corte(20, 21);
const FIM = r2(F[22][1] + 2.2);

// ---- 1. gancho: voando sobre a Amazônia ao pôr do sol ----
const VA = [-30, 27, -34];
const VB = [-6, 21, 4];
const T_PARA = r2(C[1] - 1.2);
// câmera e herói usam a mesma suavização no mesmo intervalo: a câmera olha sempre para ele
const voo = trilha(0, C[1], (u) => VA.map((a, i) => a + (VB[i] - a) * ease(u)));
const OFF_A = [-9, 3.5, 13];
const OFF_B = [-5.5, 1.6, 7.5];
add(0, C[1], {
  transicao: 'fade',
  ambiente: TARDE,
  objetos: [...floresta(-60, 40, 1), rio(), boto('boto', { pos: [4, FUNDO, 18], giro: 160, movimentos: [{ de: 0, ate: C[1], para: [2, 8] }] })],
  personagens: [{ id: 'cometa', preset: 'major_cometa', pos: VA, giro: 52, anim: { pos: voo, suave: false },
    acoes: [{ clip: 'voar', de: 0, ate: C[1], suavizacao: 0.01 }] }],
  fluxos: [{ material: 'luz', origem: [VB[0] + 0.35, VB[1] + 0.6, VB[2] + 0.5], destino: [3, NIVEL, 15], taxa: 50, tamanho: 0.06, dispersao: 0.05, espalha: 1.2, arco: 0, de: r2(T_PARA + 0.4), ate: C[1] }],
  camera: { tipo: 'travelling', de: { pos: VA.map((v, i) => r2(v + OFF_A[i])), olha: [VA[0], VA[1] + 0.6, VA[2]] }, para: { pos: VB.map((v, i) => r2(v + OFF_B[i])), olha: [VB[0], VB[1] + 0.3, VB[2]] }, fov: 46 },
  textos: [{ texto: TXT.gancho, de: 0.25, ate: C[1], estilo: 'titulo' }],
});

// ---- 2. supervisão: "Peixe? Não..." ----
add(C[1], C[2], {
  transicao: 'flash',
  ambiente: TARDE,
  objetos: [...floresta(-20, 50, 1), rio(), boto('boto', { pos: [2.5, r2(NIVEL - 0.72), 13], giro: 200, movimentos: [{ de: C[1], ate: C[2], para: [1.6, 10.6] }] })],
  elementos: [{ tipo: 'lente', pos: [0.5, 0.36], tamanho: 0.38, texto: TXT.lente, de: C[1], ate: C[2] }],
  efeitos: [{ tipo: 'zoom', de: C[1], ate: C[2], para: 1.35 }],
  camera: { tipo: 'travelling', de: { pos: [1.8, 13, 17.5], olha: [2.2, NIVEL - 0.3, 12.2] }, para: { pos: [1.9, 6.2, 13.6], olha: [1.9, NIVEL - 0.4, 11.0] }, fov: 40 },
});

// ---- 3. É o boto! o salto e o tamanho ----
const S0 = [0.5, NADA - 0.4, -4];
const S1 = [0.5, NADA - 0.4, 5];
const T_S0 = r2(C[2] + 0.15);
const T_S1 = r2(C[2] + 2.0);
const salto = [
  ...trilha(T_S0, T_S1, (u) => [S0[0], S0[1] + 3.1 * 4 * u * (1 - u), S0[2] + (S1[2] - S0[2]) * u]),
  ...trilha(T_S1 + 0.06, C[3], (u) => [S1[0] + 1.5 * u, NADA, S1[2] + 5 * u]).slice(1),
];
add(C[2], C[3], {
  ambiente: DIA,
  objetos: [...floresta(-40, 50, 2), rio(), boto('boto', { variante: 'macho', pos: S0, giro: 0,
    anim: { pos: salto, suave: false, giro: [[T_S0, -42], [r2((T_S0 + T_S1) / 2), 0], [T_S1, 48], [r2(T_S1 + 0.5), 0]], eixo: 'x' } })],
  fluxos: [
    { material: 'agua', origem: [S0[0], NIVEL, S0[2]], destino: [S0[0], NIVEL + 1.2, S0[2] + 1], taxa: 120, espalha: 1.6, arco: 1.4, de: T_S0, ate: r2(T_S0 + 0.35) },
    { material: 'agua', origem: [S1[0], NIVEL, S1[2]], destino: [S1[0], NIVEL + 1.4, S1[2] + 1.2], taxa: 160, espalha: 2.2, arco: 1.6, de: r2(T_S1 - 0.05), ate: r2(T_S1 + 0.4) },
    { material: 'bolha', origem: [S1[0], NIVEL - 0.2, S1[2]], taxa: 25, de: T_S1, ate: r2(T_S1 + 1.2) },
  ],
  elementos: [etiqueta(TXT.tamanho, { pos: [0.5, 0.26], tamanho: 1.4, de: r2(F[3][0] + 3.6), ate: C[3] })],
  camera: { tipo: 'travelling', de: { pos: [7.5, 1.6, 4], olha: [0.5, 2.6, 0.5] }, para: { pos: [6.2, 1.5, 9.5], olha: [1.4, 1.4, 7] }, fov: 46 },
});

// ---- 4. a primeira surpresa: não nasce rosa ----
add(C[3], C[4], {
  transicao: 'flash',
  ambiente: DIA,
  objetos: [...floresta(-30, 40, 3), rio(), boto('boto', { variante: 'macho', pos: [0, NADA, -2], giro: 0, movimentos: [{ de: C[3], ate: C[4], para: [0, 1.5] }] })],
  fluxos: [{ material: 'bolha', origem: { ancora: 'boto', desloca: [0, 0.6, -1.2] }, taxa: 10 }],
  camera: { tipo: 'travelling', de: { pos: [2.3, 1.9, 2.4], olha: [0, 1.25, -1.0] }, para: { pos: [1.4, 1.6, 4.4], olha: [0, 1.25, 1.2] }, fov: 42 },
  textos: [{ texto: TXT.surpresa, de: r2(F[4][0] + 1.6), ate: C[4], estilo: 'destaque' }],
});

// ---- 5. filhote cinza, adulto rosa ----
add(C[4], C[5], {
  ambiente: DIA,
  objetos: [...floresta(-40, 40, 4), rio(),
    boto('mae', { pos: [-0.8, NADA, -8], giro: 0, movimentos: [{ de: C[4], ate: C[5], para: [-0.8, 4] }] }),
    boto('filhote', { variante: 'filhote', pos: [0.7, r2(NIVEL - 0.255 + 0.07), -7.4], giro: 0, params: { batida: 2 }, movimentos: [{ de: C[4], ate: C[5], para: [0.7, 4.6] }] })],
  elementos: [
    etiqueta(TXT.filhote, { ancora: 'filhote', alturaRel: 2.4, ponto: '#8b97a7', de: r2(F[5][0] + 0.3), ate: C[5] }),
    etiqueta(TXT.adulto, { ancora: 'mae', alturaRel: 2.2, de: r2(F[5][0] + 1.6), ate: C[5] }),
  ],
  camera: { tipo: 'enquadrar', alvo: 'filhote', plano: 'medio', angulo: 58, elevacao: 18, deriva: 16, aproxima: 0.9, fov: 46 },
});

// ---- 6. machos mais rosados: as cicatrizes das brigas ----
const centro6 = [0, 0];
const roda = (fase) => trilha(C[5], C[6], (u) => {
  const a = fase + u * Math.PI * 2.2;
  return [centro6[0] + Math.cos(a) * 1.4, NADA + 0.08 * Math.sin(u * 20 + fase), centro6[1] + Math.sin(a) * 1.4];
});
add(C[5], C[6], {
  transicao: 'flash',
  ambiente: DIA,
  objetos: [...floresta(-30, 30, 5), rio(),
    boto('m1', { variante: 'macho', pos: [1.4, NADA, 0], giro: 0, anim: { pos: roda(0), suave: false, gira: r2(-(2.2 * 360) / (C[6] - C[5])), eixo: 'y' } }),
    boto('m2', { variante: 'macho', pos: [-1.4, NADA, 0], giro: 180, anim: { pos: roda(Math.PI), suave: false, gira: r2(-(2.2 * 360) / (C[6] - C[5])), eixo: 'y' } })],
  fluxos: [
    { material: 'agua', origem: [0, NIVEL, 0], destino: [0, NIVEL + 0.8, 0], taxa: 70, espalha: 2.6, arco: 1, de: r2(C[5] + 0.4), ate: r2(C[5] + 2.2) },
    { material: 'agua', origem: [0.6, NIVEL, 0.4], destino: [0.2, NIVEL + 1, 1], taxa: 60, espalha: 2, arco: 1.2, de: r2(C[6] - 2.2), ate: r2(C[6] - 0.6) },
  ],
  elementos: [etiqueta(TXT.cicatriz, { pos: [0.5, 0.25], tamanho: 1.2, de: r2(F[6][0] + 2.4), ate: C[6] })],
  camera: { tipo: 'travelling', de: { pos: [5.5, 3.6, 6.5], olha: [0, NIVEL, 0] }, para: { pos: [2.6, 2.2, 3.6], olha: [0, NIVEL + 0.1, 0] }, fov: 44 },
});

// ---- 7. o pescoço que vira 90° ----
add(C[6], C[7], {
  ambiente: DIA,
  objetos: [...floresta(-30, 30, 6), rio(),
    boto('boto', { variante: 'macho', pos: [0, NADA + 0.05, 0], giro: 0,
      etapa: [[r2(F[8][0] + 0.4), 0.5], [r2(F[8][0] + 1.6), 1], [r2(F[8][0] + 2.8), 1], [r2(F[8][0] + 3.8), 0], [r2(C[7] - 0.3), 0.5]] })],
  fluxos: [{ material: 'bolha', origem: [0, NIVEL - 0.1, -0.9], taxa: 8 }],
  elementos: [etiqueta(TXT.pescoco, { pos: [0.5, 0.27], tamanho: 1.8, de: r2(F[8][0] + 1.4), ate: C[7] })],
  camera: { tipo: 'enquadrar', alvo: 'boto', plano: 'medio', angulo: 30, elevacao: 22, deriva: 70, aproxima: 0.85, fov: 44 },
});

// ---- 8. por quê? a floresta alagada ----
const zz = trilha(r2(F[11][0] - 0.2), C[8], (u) => [Math.sin(u * Math.PI * 3) * 2.4, NADA + 0.6, -10 + 20 * u]);
add(C[7], C[8], {
  transicao: 'flash',
  ambiente: DIA,
  objetos: [...floresta(-30, 30, 7, true, [0, 2, 3.2]), rio({ params: { altura: 2.4, progress: 0.25 }, etapa: [[r2(F[10][0]), 0.25], [r2(F[11][0] + 0.3), 1]] }),
    boto('boto', { variante: 'macho', pos: zz[0][1], giro: 0, anim: { pos: zz, suave: false } })],
  fluxos: [{ material: 'agua', origem: [-14, 0.3, -12], destino: [-8, 0.2, -6], taxa: 40, espalha: 3, arco: 0.6, de: r2(F[10][0]), ate: r2(F[11][0] + 0.4) }],
  textos: [{ texto: TXT.cheia, de: r2(F[10][0] + 0.6), ate: C[8], estilo: 'destaque' }],
  camera: { tipo: 'travelling', de: { pos: [0.8, 13, 17], olha: [0, 4, -2] }, para: { pos: [0.6, 3.4, 9.5], olha: [0, 2.3, 1] }, fov: 50 },
});

// ---- 9. água barrenta: quase não enxerga ----
add(C[8], C[9], {
  ambiente: DIA,
  objetos: [...floresta(-30, 30, 7, true, [0, 0, 6]), rio({ params: { altura: 2.4, cor: '#7a6646', progress: 1 } }),
    boto('boto', { variante: 'macho', pos: [-3, 1.84, -4], giro: 40, movimentos: [{ de: C[8], ate: C[9], para: [1, 0.5] }] })],
  fluxos: [{ material: 'poeira', origem: [0, 1.6, 0], taxa: 14, tamanho: 0.7, dispersao: 4, vida: 2.4, subida: 0.2 }],
  elementos: [etiqueta(TXT.barro, { pos: [0.5, 0.26], tamanho: 1.2, ponto: '#7a6646', de: r2(F[12][0] + 0.8), ate: C[9] }),
    { tipo: 'icone', icone: 'interrogacao', pos: [0.5, 0.4], tamanho: 0.13, pulsa: true, de: r2(F[12][0] + 1.2), ate: C[9] }],
  camera: { tipo: 'travelling', de: { pos: [3.5, 3.1, 4.5], olha: [-1.5, 2.2, -2] }, para: { pos: [2.6, 2.8, 4.0], olha: [-0.3, 2.2, -0.8] }, fov: 46 },
});

// ---- 10. o sonar ----
const PEIXE = [2.4, 2.2, 3.6];
const T_BOTE = r2(C[10] - 0.9);
add(C[9], C[10], {
  ambiente: DIA,
  objetos: [...floresta(-30, 30, 7, true, [0.5, 0, 7]), rio({ params: { altura: 2.4, cor: '#7a6646', progress: 1 } }),
    boto('boto', { variante: 'macho', pos: [-1.5, 1.84, -2.2], giro: 34, movimentos: [{ de: C[9], ate: T_BOTE, para: [-0.6, -0.9] }, { de: T_BOTE, ate: r2(T_BOTE + 0.5), para: [PEIXE[0] - 0.6, PEIXE[2] - 0.8] }] }),
    { id: 'sonar', asset: 'sonar', pos: [-1.5, 1.84, -2.2], giro: 34, params: { altura: 0.4, alcance: 4.6, ritmo: 1.6 },
      movimentos: [{ de: C[9], ate: T_BOTE, para: [-0.6, -0.9] }], some: T_BOTE },
    { id: 'peixe', asset: 'forma', pos: PEIXE, params: { tipo: 'capsula', tamanho: [0.16, 0.5, 0.16], cor: '#c9d3dc', brilho: true, apoiada: false }, giro: 90, anim: { giro: [[0, 90]], eixo: 'z', oscila: { eixo: 'x', amp: 0.15, freq: 0.8 } }, some: r2(T_BOTE + 0.45) }],
  fluxos: [{ material: 'bolha', origem: [PEIXE[0], PEIXE[1], PEIXE[2]], taxa: 40, de: r2(T_BOTE + 0.4), ate: C[10] }],
  elementos: [etiqueta(TXT.sonar, { pos: [0.5, 0.26], tamanho: 1.3, ponto: '#8fe3ff', de: r2(F[13][0] + 1.2), ate: C[10] })],
  camera: { tipo: 'travelling', de: { pos: [4.8, 4.0, -5.2], olha: [-0.4, 2.0, -0.8] }, para: { pos: [4.6, 3.6, -3.4], olha: [0.4, 2.0, 0.6] }, fov: 50 },
});

// ---- 11. "mas nem o sonar salvou o boto..." (a água baixa, o céu fecha) ----
add(C[10], C[11], {
  transicao: 'fade',
  ambiente: TARDE,
  objetos: [...floresta(-40, 40, 8), rio({ params: { progress: 1 }, etapa: [[C[10], 1], [C[11], 0.35]] }),
    boto('boto', { pos: [0, NADA, -2], giro: 0, params: { batida: 0.5 }, anim: { pos: [[C[10], [0, NADA, -2]], [C[11], [0, r2(0.02 + 0.35 * 1.2 - 0.5), 0]]] } })],
  personagens: [{ id: 'cometa', preset: 'major_cometa', pos: [1.7, 2.3, 1.0], giro: -160, anim: { oscila: { eixo: 'y', amp: 0.1, freq: 0.5 } }, acoes: [{ clip: 'think', de: C[10], ate: C[11], expressao: 'worried' }] }],
  camera: { tipo: 'travelling', de: { pos: [2, 2.2, 6], olha: [0, 1, -1] }, para: { pos: [6, 13, 16], olha: [0, 0.5, -1] }, fov: 46 },
});

// ---- 12. história real: Lago Tefé, 2023 ----
const LAGO = (prog) => ({ id: 'lago', asset: 'agua_nivel', pos: [0, 0, 0], params: { tamanho: [60, 80], altura: 1.2, cor: '#7c6a45', progress: prog } });
const lama = () => [-1, 1].flatMap((sx, k) => [0, 1, 2].map((i) => ({ id: `lama${k}${i}`, asset: 'chao', variante: 'terra', pos: [sx * (16 + i * 7), 0.02, -20 + i * 14], params: { size: 14, seed: i + k * 3 } })));
const SOL = [-35, 22, -110];
add(C[11], C[12], {
  transicao: 'flash',
  ambiente: { fundo: 'floresta', horario: 'tarde', chao: 'areia' },
  objetos: [LAGO(0.18), ...lama(), ...floresta(-60, 40, 9),
    { id: 'sol', asset: 'forma', pos: SOL, params: { tipo: 'esfera', tamanho: [16, 16, 16], cor: '#ffb347', emissivo: true, apoiada: false }, anim: { pulsa: 0.02 } },
    { id: 'termo', asset: 'termometro', pos: [4.2, 0.3, 6], giro: -20, params: { altura: 2.6, progress: 0.35 }, etapa: [[r2(F[15][0] + 1), 0.35], [r2(F[15][1] - 0.6), 0.95]] },
    boto('boto', { variante: 'cinza', pos: [-2.5, 0.0, -3], giro: 60, params: { batida: 0.35 }, movimentos: [{ de: C[11], ate: C[12], para: [-1.2, -2.2] }] })],
  fluxos: [{ material: 'vapor', origem: [0, 0.4, -4], taxa: 6, tamanho: 1.2, dispersao: 9, vida: 3.5, subida: 0.6 }],
  elementos: [
    etiqueta(TXT.tefe, { pos: [0.5, 0.2], tamanho: 1.3, ponto: '#e5322d', de: r2(F[15][0] + 0.3), ate: C[12] }),
    etiqueta(TXT.calor, { ancora: 'termo', alturaRel: 1.08, tamanho: 1.6, ponto: '#e5322d', de: r2(F[15][1] - 1.4), ate: C[12] }),
  ],
  camera: { tipo: 'travelling', de: { pos: [10, 6.5, 18], olha: [-2, 1.5, -8] }, para: { pos: [7.5, 3.4, 12], olha: [1.5, 1.6, 2] }, fov: 48 },
});

// ---- 13. mais de 200 mortos (respeito: sem mostrar animais mortos) ----
add(C[12], C[13], {
  ambiente: { fundo: 'floresta', horario: 'tarde', chao: 'areia' },
  objetos: [LAGO(0.18), ...lama(), ...floresta(-60, 40, 9),
    { id: 'sol', asset: 'forma', pos: SOL, params: { tipo: 'esfera', tamanho: [16, 16, 16], cor: '#ffb347', emissivo: true, apoiada: false } }],
  fluxos: [{ material: 'vapor', origem: [0, 0.4, -6], taxa: 6, tamanho: 1.2, dispersao: 10, vida: 3.5, subida: 0.6 }],
  efeitos: [{ tipo: 'pretoebranco', de: C[12], ate: C[13], zoom: 1.12 }],
  elementos: [etiqueta(TXT.mortos, { pos: [0.5, 0.24], tamanho: 1.35, ponto: '#e5322d', de: r2(F[16][0] + 1.6), ate: C[13] })],
  camera: { tipo: 'travelling', de: { pos: [0, 12, 26], olha: [0, 0, -10] }, para: { pos: [0, 9, 18], olha: [0, 0, -12] }, fov: 48 },
});

// ---- 14. a população cai pela metade a cada 10 anos ----
const fila = [];
const BY = r2(NIVEL - 0.68 * 0.55 + 0.08);
for (let i = 0; i < 8; i++) {
  const t1 = r2(F[17][0] + 3.2);
  const t2 = r2(F[17][0] + 5.0);
  const some = i % 2 === 1 ? t1 : i % 4 === 2 ? t2 : undefined;
  const x = -5.6 + i * 1.6;
  const pulo = r2(C[13] + 0.3 + i * 0.25);
  fila.push(boto(`b${i}`, { pos: [x, BY, 0], giro: 90, escala: 0.55, ...(some ? { some } : {}),
    anim: { pos: [[C[13], [x, BY, 0]], [pulo, [x, BY, 0]], [r2(pulo + 0.35), [x + 0.5, BY + 1.0, 0]], [r2(pulo + 0.7), [x + 1, BY, 0]], [C[14], [x + 1, BY, 0]]], suave: true } }));
}
add(C[13], C[14], {
  transicao: 'fade',
  ambiente: { fundo: 'floresta', horario: 'nublado', chao: 'grama' },
  objetos: [...floresta(-30, 30, 10), rio(), ...fila],
  elementos: [
    etiqueta(`${TXT.hoje}: 8`, { pos: [0.5, 0.22], tamanho: 1.3, de: r2(F[17][0] + 0.6), ate: r2(F[17][0] + 3.2) }),
    etiqueta(`${TXT.dez}: 4`, { pos: [0.5, 0.22], tamanho: 1.3, ponto: '#f2994a', de: r2(F[17][0] + 3.2), ate: r2(F[17][0] + 5.0) }),
    etiqueta(`${TXT.vinte}: 2`, { pos: [0.5, 0.22], tamanho: 1.3, ponto: '#e5322d', de: r2(F[17][0] + 5.0), ate: C[14] }),
  ],
  camera: { tipo: 'travelling', de: { pos: [0.8, 2.9, 10.5], olha: [0.8, 1.15, 0] }, para: { pos: [0.8, 2.6, 9.2], olha: [0.8, 1.15, 0] }, fov: 52 },
});

// ---- 15. ameaçado de extinção ----
add(C[14], C[15], {
  ambiente: TARDE,
  objetos: [...floresta(-40, 40, 11), rio(), boto('boto', { variante: 'macho', pos: [0, NADA, -3], giro: 10, params: { batida: 0.7 }, movimentos: [{ de: C[14], ate: C[15], para: [0.4, 1] }] })],
  personagens: [{ id: 'cometa', preset: 'major_cometa', pos: [-1.1, 2.9, 1.9], giro: 167, anim: { oscila: { eixo: 'y', amp: 0.1, freq: 0.5 } }, acoes: [{ clip: 'shake_head', de: C[14], ate: C[15], expressao: 'sad' }] }],
  fluxos: [{ material: 'bolha', origem: { ancora: 'boto', desloca: [0, 0.6, -1.2] }, taxa: 8 }],
  elementos: [etiqueta(TXT.perigo, { pos: [0.5, 0.24], tamanho: 1.35, ponto: '#e5322d', de: r2(F[18][0] + 0.2), ate: C[15] })],
  camera: { tipo: 'travelling', de: { pos: [2, 2.4, 5.5], olha: [0, 1.2, -2] }, para: { pos: [6, 16, 22], olha: [0, 1, -1] }, fov: 46 },
});

// ---------------- a lenda: festa junina na beira do rio, à noite ----------------
const NOITE = { fundo: 'floresta', horario: 'noite', chao: 'grama' };
const festa = () => [
  { id: 'band1', asset: 'bandeirinhas', pos: [0, 0, 4], params: { comprimento: 12, altura: 3.8 } },
  { id: 'band2', asset: 'bandeirinhas', pos: [0, 0, 9], params: { comprimento: 12, altura: 3.6 } },
  { id: 'fogueira', asset: 'fogueira', pos: [3.2, 0, 6.5], params: { tamanho: 1.3 } },
  { id: 'margem', asset: 'agua_nivel', pos: [0, 0, -14], params: { tamanho: [60, 18], altura: 1.2, cor: '#2c4f63', progress: 1 } },
  { id: 'poste', asset: 'poste_luz', pos: [-6.5, 0, 7], params: { height: 4 } },
  ...floresta(-30, -20, 12),
];
const MOCO = { top: { color: '#f4f1e8', sleeves: 'long' }, bottom: { color: '#f4f1e8', type: 'pants' }, shoes: '#f4f1e8', hair: { style: 'short', color: '#1d1410' }, acessorios: [{ tipo: 'furo_boto' }] };
const CHAPEU_Y = 1.665;
const MOCO_A = [-1.2, -4.5];
const MOCO_B = [-0.6, 5.2];
add(C[15], C[16], {
  transicao: 'flash',
  ambiente: NOITE,
  objetos: [...festa(),
    boto('pulo', { variante: 'macho', pos: [-1.5, 0, -16], giro: 90, anim: { pos: trilha(r2(C[15] + 0.4), r2(C[15] + 1.8), (u) => [-3 + 4 * u, 0.2 + 2.4 * 4 * u * (1 - u), -16]), suave: false, giro: [[r2(C[15] + 0.4), -40], [r2(C[15] + 1.8), 50]], eixo: 'x' } }),
    { id: 'chapeu', asset: 'chapeu_panama', pos: [MOCO_A[0], CHAPEU_Y, MOCO_A[1]], movimentos: [{ de: r2(C[15] + 2.2), ate: r2(C[16] - 0.4), para: MOCO_B }] }],
  personagens: [{ id: 'moco', preset: 'homem', pos: MOCO_A, giro: 0, overrides: MOCO,
    movimentos: [{ de: r2(C[15] + 2.2), ate: r2(C[16] - 0.4), para: MOCO_B, clip: 'walk' }],
    acoes: [{ clip: 'heroi_pose', de: r2(C[16] - 0.4), ate: C[16], camada: 1, mascara: ['arms'] }] }],
  fluxos: [
    { material: 'fogo', origem: [3.2, 0.35, 6.5], taxa: 30, tamanho: 0.45 },
    { material: 'fagulha', origem: [3.2, 0.8, 6.5], destino: [3.4, 3, 6.3], taxa: 20, espalha: 1.5 },
    { material: 'agua', origem: [1, 1.2, -16], destino: [1.5, 1.8, -15.5], taxa: 120, espalha: 2, arco: 1.4, de: r2(C[15] + 1.7), ate: r2(C[15] + 2.1) },
  ],
  textos: [{ texto: TXT.lenda, de: r2(F[19][0] + 0.2), ate: C[16], estilo: 'destaque' }],
  camera: { tipo: 'travelling', de: { pos: [1.5, 2.4, 14], olha: [-1, 1.4, -8] }, para: { pos: [0.6, 1.8, 9.6], olha: [-0.6, 1.5, 5] }, fov: 46 },
});

// ---- 16. o chapéu esconde o furo de respirar (e ele esguicha!) ----
const T_TIRA = r2(F[20][0] + 0.9);
const CH0 = [MOCO_B[0], CHAPEU_Y, MOCO_B[1]];
add(C[16], C[17], {
  ambiente: NOITE,
  objetos: [...festa(),
    { id: 'chapeu', asset: 'chapeu_panama', pos: CH0, anim: { pos: [[C[16], CH0], [T_TIRA, CH0], [r2(T_TIRA + 0.45), [CH0[0] + 0.5, CH0[1] + 0.55, CH0[2] + 0.1]], [C[17], [CH0[0] + 0.55, CH0[1] + 0.6, CH0[2] + 0.1]]], suave: true, giro: [[T_TIRA, 0], [r2(T_TIRA + 0.45), -25]], eixo: 'z' } }],
  personagens: [{ id: 'moco', preset: 'homem', pos: MOCO_B, giro: 0, overrides: MOCO,
    acoes: [{ clip: 'wave', de: r2(T_TIRA - 0.2), ate: C[17], expressao: 'surprised' }] }],
  fluxos: [{ material: 'agua', origem: [MOCO_B[0], 1.74, MOCO_B[1] - 0.02], destino: [MOCO_B[0], 3.0, MOCO_B[1] + 0.15], taxa: 70, tamanho: 0.06, espalha: 0.35, arco: 0.15, de: r2(T_TIRA + 0.55), ate: r2(T_TIRA + 1.6) },
    { material: 'fogo', origem: [3.2, 0.35, 6.5], taxa: 30, tamanho: 0.45 }],
  efeitos: [{ tipo: 'zoom', de: r2(T_TIRA + 0.4), ate: C[17], para: 1.15 }],
  camera: { tipo: 'travelling', de: { pos: [MOCO_B[0] + 0.6, 1.75, MOCO_B[1] + 3.2], olha: [MOCO_B[0], 1.45, MOCO_B[1]] }, para: { pos: [MOCO_B[0] + 0.35, 1.9, MOCO_B[1] + 2.3], olha: [MOCO_B[0], 1.6, MOCO_B[1]] }, fov: 44 },
});

// ---- 17. final: o Major Cometa no rio, ao pôr do sol, com o boto saltando ----
const CF = [0, 3.0, 6];
add(C[17], FIM, {
  transicao: 'flash',
  ambiente: TARDE,
  objetos: [...floresta(-40, 40, 13), rio(),
    boto('final', { variante: 'macho', pos: [-1, 0, -6], giro: 90, anim: { pos: trilha(r2(C[17] + 0.8), r2(C[17] + 2.4), (u) => [-3.5 + 5 * u, NADA - 0.4 + 2.6 * 4 * u * (1 - u), -6]), suave: false, giro: [[r2(C[17] + 0.8), -40], [r2(C[17] + 2.4), 50]], eixo: 'x' } })],
  personagens: [{ id: 'cometa', preset: 'major_cometa', pos: CF, giro: 0, anim: { oscila: { eixo: 'y', amp: 0.12, freq: 0.6 } },
    acoes: [{ clip: 'wave', de: C[17], ate: FIM, expressao: 'happy' }] }],
  fluxos: [{ material: 'agua', origem: [1.5, NIVEL, -6], destino: [2, NIVEL + 1.2, -5.5], taxa: 130, espalha: 2, arco: 1.4, de: r2(C[17] + 2.3), ate: r2(C[17] + 2.7) }],
  textos: [{ texto: TXT.pergunta, de: r2(F[21][0]), ate: FIM, estilo: 'pergunta' }],
  camera: { tipo: 'travelling', de: { pos: [1.6, 3.8, 11.5], olha: [-0.4, 2.8, 0] }, para: { pos: [1.2, 3.7, 10.2], olha: [-0.3, 2.9, 0] }, fov: 50 },
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
