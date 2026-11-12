// "Aracnildo puxa a Lua" (~33 s, narração ElevenLabs). Cenas alinhadas às frases de frases.json.
// Rode: node projects/aracnildo-puxa-a-lua/gerar-storyboard.mjs [pasta-do-projeto] [--checar]
//   pasta-do-projeto: outra versão (outro idioma) com a própria narração (frases.json) e textos.json;
//   sem ela, usa esta pasta. A animação é a mesma; os cortes seguem as frases da narração de cada versão
//   (a narração precisa ter as mesmas 11 frases, na mesma ordem).
//   --checar  imprime onde os pontos importantes de cada cena caem na tela 9:16 (x, y de 0 a 1)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ARG = process.argv.slice(2).find((a) => !a.startsWith('--'));
const PASTA = ARG ? path.resolve(ARG) : path.dirname(fileURLToPath(import.meta.url));
const TXT = {
  titulo: 'Aracnildo puxa a Lua', gancho: 'PUXOU A LUA!', dia: 'DIA 1', mare: 'MARÉ GIGANTE!',
  quebrou: 'ELA QUEBROU!', olhar: 'LUA É PRA OLHAR!', pergunta: 'VOCÊ PUXARIA?',
  ...(fs.existsSync(path.join(PASTA, 'textos.json')) ? JSON.parse(fs.readFileSync(path.join(PASTA, 'textos.json'), 'utf8')) : {}),
};

const F = JSON.parse(fs.readFileSync(path.join(PASTA, 'frases.json'), 'utf8')).map((f) => [f.inicio, f.fim]);
if (F.length !== 11) throw new Error(`A narração precisa ter 11 frases (tem ${F.length}). Confira a pontuação de narracao.txt.`);
const r2 = (n) => Math.round(n * 100) / 100;
const corte = (a, b) => r2((F[a][1] + F[b][0]) / 2); // meio da pausa entre a frase a e a b
const FIM = r2(F[F.length - 1][1] + 2.5);
const rad = (d) => (d * Math.PI) / 180;
const ease = (u) => u * u * (3 - 2 * u);
const add3 = (a, b, k = 1) => a.map((v, i) => r2(v + b[i] * k));
const S = [];
const add = (inicio, fim, c) => S.push({ inicio, fim, ...c });

// ---- projeção na tela 9:16 (mesma câmera do motor) ----
const sub = (a, b) => a.map((v, i) => v - b[i]);
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const norm = (a) => { const n = Math.hypot(...a); return a.map((v) => v / n); };
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
function base(cam, olha) {
  const fw = norm(sub(olha, cam));
  const rt = norm(cross(fw, [0, 1, 0]));
  return { fw, rt, up: cross(rt, fw) };
}
function proj(cam, olha, fov, p) {
  const { fw, rt, up } = base(cam, olha);
  const d = sub(p, cam);
  const z = dot(d, fw);
  const tv = Math.tan(rad(fov / 2));
  return z <= 0 ? null : [0.5 + 0.5 * (dot(d, rt) / z) / (tv * 1080 / 1920), 0.5 - 0.5 * (dot(d, up) / z) / tv];
}
// ponto do mundo que aparece em (sx, sy) da tela, a `dist` metros da câmera
function naTela(cam, olha, fov, sx, sy, dist) {
  const { fw, rt, up } = base(cam, olha);
  const tv = Math.tan(rad(fov / 2));
  const x = (sx - 0.5) * 2 * tv * 1080 / 1920;
  const y = (0.5 - sy) * 2 * tv;
  const d = norm(fw.map((v, i) => v + rt[i] * x + up[i] * y));
  return cam.map((v, i) => r2(v + d[i] * dist));
}
const trilha = (t0, t1, f, passo = 0.08) => {
  const ks = [];
  for (let t = t0; t <= t1 + 1e-6; t += passo) ks.push([r2(t), f(Math.min(1, (t - t0) / (t1 - t0))).map(r2)]);
  return ks;
};

// ---------------- mundo: telhado na cidade, à noite ----------------
const NOITE = { fundo: 'cidade', horario: 'noite', chao: 'asfalto' };
const TELHADO = 18.6; // laje do prédio de 6 andares (parapeito: 19.4 em z 4.9..5.15)
const H = [1.5, TELHADO, -0.5]; // onde o Aracnildo fica no telhado (longe do parapeito da frente)
const GIRO = -160; // virado para a Lua
const dirH = [Math.sin(rad(GIRO)), 0, Math.cos(rad(GIRO))];
const elev = rad(40);
const dirLua = [dirH[0] * Math.cos(elev), Math.sin(elev), dirH[2] * Math.cos(elev)];
const LUA = add3(H, dirLua, 60); // centro da Lua no céu
const MAOS = add3(add3(H, dirH, 0.42), [0, 1.32, 0]); // onde o fio sai, puxando

const cidade = (de, ate) => [
  { id: 'predioH', asset: 'predio_apartamentos', pos: [0, 0, 0], params: { floors: 6, wall: '#cfd6e6' } },
  { id: 'predioE', asset: 'predio_apartamentos', variante: 'rosa', pos: [-16.5, 0, -1], params: { floors: 5 } },
  { id: 'predioD', asset: 'predio_apartamentos', variante: 'azul', pos: [16.5, 0, -1], params: { floors: 7 } },
  { id: 'predioF', asset: 'predio_apartamentos', pos: [0, 0, -24], params: { floors: 9, wall: '#e3d4b8' } },
  { id: 'rua', asset: 'rua_reta', pos: [0, 0, 14], giro: 90, params: { length: 90 } },
  { id: 'poste1', asset: 'poste_luz', pos: [-6, 0.2, 9.4], giro: 0 },
  { id: 'poste2', asset: 'poste_luz', pos: [9, 0.2, 9.4], giro: 0 },
  { id: 'arv1', asset: 'arvore_redonda', pos: [3.5, 0.2, 9.3], escala: 0.7, params: { seed: 3 } },
  { id: 'carro', asset: 'carro_hatch', variante: 'amarelo', pos: [r2(-30 + 4 * de), 0.06, 15.7], giro: 90, movimentos: [{ de, ate, para: [r2(-30 + 4 * ate), 15.7] }] },
];
const lua = (escala, extra = {}) => ({
  id: 'lua', asset: 'lua', pos: LUA, params: { raio: 3.2, apoiada: false, brilho: 0.75 },
  ...(typeof escala === 'number' ? { escala } : { anim: { escala } }), ...extra,
});
const teia = (extra = {}) => ({ id: 'teia', asset: 'tubo', pos: MAOS, params: { pontos: [[0, 0, 0], LUA.map((v, i) => r2(v - MAOS[i]))], raio: 0.045, cor: '#f4f8ff' }, ...extra });
const aranha = (extra) => ({ id: 'aranha', preset: 'aracnildo', pos: H, giro: GIRO, ...extra });

// câmera "atrás do herói, olhando a Lua": escolhida por busca (herói embaixo, Lua em cima)
function acharCamAtras(fov, alvoHeroi, alvoLua) {
  let melhor = null;
  for (let b = 3; b <= 9; b += 0.5) for (let h = 0.2; h <= 3; h += 0.2) for (let k = 4; k <= 40; k += 2) for (let lado = -1.5; lado <= 1.5; lado += 0.5) {
    const pos = add3(add3(add3(H, dirH, -b), [0, h, 0]), [dirH[2], 0, -dirH[0]], lado);
    if (pos[2] > 4.6 || pos[1] < TELHADO + 0.4 || Math.abs(pos[0]) > 6.5) continue; // dentro do telhado, sem parapeito no caminho
    const olha = add3(H, dirLua, k);
    const a = proj(pos, olha, fov, add3(H, [0, 0.9, 0]));
    const l = proj(pos, olha, fov, LUA);
    const pe = proj(pos, olha, fov, H);
    if (!a || !l || !pe) continue;
    const e = (a[1] - alvoHeroi[1]) ** 2 + (a[0] - alvoHeroi[0]) ** 2 + (l[1] - alvoLua[1]) ** 2 + (l[0] - alvoLua[0]) ** 2 + 2 * Math.max(0, pe[1] - 0.88) ** 2 + b * 0.002;
    if (!melhor || e < melhor.e) melhor = { e, pos: pos.map(r2), olha: olha.map(r2) };
  }
  return melhor;
}
const camAtras = acharCamAtras(54, [0.42, 0.72], [0.55, 0.3]);
const camAtras7 = acharCamAtras(58, [0.38, 0.74], [0.55, 0.32]);

// ---- 1. gancho: olhinhos arregalados e fio para o alto ----
const C1 = corte(0, 1);
add(0, C1, {
  ambiente: NOITE,
  objetos: [...cidade(0, C1), lua(1)],
  personagens: [aranha({
    acoes: [
      { clip: 'heroi_pose', de: 0, ate: 0.9, expressao: 'surprised', suavizacao: 0.01 },
      { clip: 'lancar_teia', de: 0.9, ate: C1, params: { mira: 68, alcance: 16 } },
    ],
  })],
  fluxos: [{ material: 'luz', origem: add3(H, [0, 0.3, 0]), destino: add3(H, [0, 2.6, 0]), taxa: 10, tamanho: 0.025, dispersao: 0.6, de: 0, ate: C1 }],
  camera: { tipo: 'travelling', de: { pos: add3(add3(H, dirH, 3.0), [0.5, 0.2, 0]), olha: add3(H, [0, 1.15, 0]) }, para: { pos: add3(add3(H, dirH, 2.4), [0.4, 0.15, 0]), olha: add3(H, [0, 1.35, 0]) }, fov: 52 },
  textos: [{ texto: TXT.gancho, de: 0.15, ate: C1, estilo: 'titulo' }],
});

// ---- 2. gruda e puxa ----
const C2 = corte(1, 2);
add(C1, C2, {
  transicao: 'flash',
  ambiente: NOITE,
  objetos: [...cidade(C1, C2), lua([[C1, 1], [C2, 1.35]]), teia({ aparece: r2(C1 + 0.15) })],
  personagens: [aranha({
    anim: { pos: [[C1, H], [C2, add3(H, dirH, 0.35)]], suave: false },
    acoes: [{ clip: 'puxar_fio', de: C1, ate: C2, params: { mira: 40 }, velocidade: 1.2 }],
  })],
  fluxos: [{ material: 'poeira', origem: add3(H, [0, 0.05, 0]), taxa: 10, tamanho: 0.18, vida: 0.7, de: C1 + 0.4, ate: C2 }],
  camera: { tipo: 'travelling', de: { pos: camAtras.pos, olha: camAtras.olha }, para: { pos: add3(camAtras.pos, dirH, -0.6), olha: camAtras.olha }, fov: 54 },
  textos: [{ texto: TXT.dia, de: r2(C1 + 0.2), ate: r2(C1 + 2.4), estilo: 'destaque' }],
});

// ---- 3. a Lua vem vindo e fica GIGANTE ----
const C3 = corte(3, 4);
const camRua = { pos: [7, 1.8, 40], olha: [-4, 27, -14] };
add(C2, C3, {
  ambiente: NOITE,
  objetos: [...cidade(C2, C3), lua([[C2, 1.35], [C3 - 0.6, 3.0]]), teia()],
  personagens: [aranha({ pos: add3(H, dirH, 0.35), acoes: [{ clip: 'puxar_fio', de: C2, ate: C3, params: { mira: 40 }, velocidade: 1.4 }] })],
  efeitos: [{ tipo: 'tremor', de: r2(C3 - 1.0), ate: r2(C3 - 0.3), intensidade: 0.35 }],
  camera: { tipo: 'travelling', de: camRua, para: { pos: [6, 1.6, 36], olha: [-4, 28, -14] }, fov: 50 },
});

// ---------------- praia (mesma noite, Lua gigante) ----------------
const PRAIA = { fundo: 'litoral', horario: 'noite', chao: 'areia' };
const CAM4 = { de: { pos: [-3, 2.0, -0.5], olha: [1, 6.5, 30] }, para: { pos: [-2.4, 2.2, 1.0], olha: [1, 7, 30] } };
const CAM5 = { pos: [3, 2.4, 0.5], olha: [0, 5.2, 30] };
const LUA4 = naTela(CAM4.de.pos, CAM4.de.olha, 52, 0.56, 0.26, 95);
const LUA5 = naTela(CAM5.pos, CAM5.olha, 56, 0.6, 0.17, 95);
const LUA_PRAIA = LUA4;
const praia = (luaPos = LUA_PRAIA) => [
  { id: 'casa1', asset: 'casa_simples', pos: [-9, 0, -4] },
  { id: 'casa2', asset: 'casa_simples', variante: 'azul', pos: [0, 0, -5] },
  { id: 'casa3', asset: 'casa_simples', variante: 'amarela', pos: [9, 0, -4] },
  { id: 'palm1', asset: 'palmeira', pos: [-14, 0, 5], params: { seed: 2 }, anim: { giro: [[0, 0]], oscila: { eixo: 'x', amp: 0.06, freq: 0.7 } } },
  { id: 'palm2', asset: 'palmeira', variante: 'alta', pos: [5, 0, 6], params: { seed: 4 } },
  { id: 'palm3', asset: 'palmeira', pos: [12, 0, 11], params: { seed: 7 } },
  { id: 'predioP', asset: 'predio_apartamentos', variante: 'azul', pos: [24, 0, -6], params: { floors: 4 } },
  { id: 'luaP', asset: 'lua', pos: luaPos, escala: 3, params: { raio: 3.2, apoiada: false, brilho: 0.75 } },
];

// ---- 4. a Lua puxa o mar: maré subindo ----
const C4 = corte(5, 6);
add(C3, C4, {
  transicao: 'flash',
  ambiente: PRAIA,
  objetos: [...praia(), { id: 'mar', asset: 'agua_nivel', pos: [0, 0, 14], params: { tamanho: [80, 52], altura: 2.6, progress: 0 }, etapa: [[C3, 0], [C4, 0.38]] }],
  fluxos: [
    { material: 'agua', origem: [-6, 0.4, 6], destino: [-6, 0.2, 1], taxa: 30, espalha: 2.5, arco: 1.2, de: r2(C3 + 1.2), ate: C4 },
    { material: 'agua', origem: [6, 0.4, 7], destino: [7, 0.2, 2], taxa: 30, espalha: 2.5, arco: 1.2, de: r2(C3 + 1.8), ate: C4 },
  ],
  camera: { tipo: 'travelling', ...CAM4, fov: 52 },
  textos: [{ texto: TXT.mare, de: r2(F[5][0]), ate: C4, estilo: 'destaque' }],
});

// ---- 5. a onda cobre a praia e tudo alaga ----
const C5 = r2(F[6][0] + 2.0);
add(C4, C5, {
  ambiente: PRAIA,
  objetos: [
    ...praia(LUA5),
    { id: 'mar', asset: 'agua_nivel', pos: [0, 0, 14], params: { tamanho: [80, 52], altura: 2.6, progress: 0.38 }, etapa: [[C4, 0.38], [C5, 0.8]] },
    { id: 'onda', asset: 'onda', pos: [0, 0.9, 40], giro: 180, params: { largura: 52, altura: 6.5, cor: '#3aa6ee' }, movimentos: [{ de: C4, ate: r2(C5 - 0.1), para: [0, 10] }] },
  ],
  fluxos: [{ material: 'agua', origem: { ancora: 'onda', desloca: [0, 4.4, 1.2] }, destino: { ancora: 'onda', desloca: [0, 1.4, 6] }, taxa: 90, espalha: 9, arco: 1.5, de: C4, ate: C5 }],
  efeitos: [{ tipo: 'tremor', de: r2(C5 - 0.6), ate: C5, intensidade: 0.4 }],
  camera: { tipo: 'fixa', ...CAM5, fov: 56 },
});

// ---- 6. o Aracnildo sente o perigo e escala a parede ----
const C6 = corte(6, 7);
const PAREDE = [16.3, 1.9, 1]; // parede lateral do prédio da praia (x = 16.8), já com a água pelas pernas
add(C5, C6, {
  ambiente: PRAIA,
  objetos: [...praia(), { id: 'mar', asset: 'agua_nivel', pos: [0, 0, 14], params: { tamanho: [80, 52], altura: 2.6, progress: 0.8 }, etapa: [[C5, 0.8], [C6, 0.95]] }],
  personagens: [aranha({
    pos: PAREDE, giro: 90,
    anim: { pos: [[C5, PAREDE], [C6, add3(PAREDE, [0, 3.4, 0])]], suave: false },
    acoes: [
      { clip: 'escalar', de: C5, ate: C6, velocidade: 1.3 },
      { clip: 'sentir_perigo', de: C5, ate: r2(C5 + 1.2), velocidade: 1.2, camada: 1, mascara: ['head', 'face'] },
    ],
  })],
  fluxos: [{ material: 'agua', origem: add3(PAREDE, [-0.6, 0.6, 0.6]), destino: add3(PAREDE, [-1.6, 0.3, 1.8]), taxa: 25, espalha: 1.5, arco: 0.8, de: C5, ate: C6 }],
  camera: { tipo: 'travelling', de: { pos: [9.5, 3.2, 8.5], olha: [16.3, 3.4, 1] }, para: { pos: [10, 4.6, 8.2], olha: [16.3, 4.8, 1] }, fov: 52 },
});

// ---- 7. perto demais: a Lua racha ----
const C7 = corte(7, 8);
const RACHA = r2(F[7][0] + 1.3);
add(C6, C7, {
  transicao: 'flash',
  ambiente: NOITE,
  objetos: [...cidade(C6, C7), lua(3, { etapa: [[RACHA, 0], [r2(RACHA + 0.25), 0.1], [C7, 0.55]] }), teia({ some: r2(RACHA + 0.3) })],
  personagens: [aranha({
    pos: add3(H, dirH, 0.35),
    acoes: [
      { clip: 'puxar_fio', de: C6, ate: r2(RACHA + 0.3), params: { mira: 40 }, velocidade: 1.4 },
      { clip: 'surprised', de: r2(RACHA + 0.3), ate: C7 },
    ],
  })],
  fluxos: [{ material: 'poeira', origem: LUA, taxa: 30, tamanho: 1.6, dispersao: 4, vida: 1.6, de: RACHA, ate: r2(RACHA + 1.2) }],
  efeitos: [{ tipo: 'tremor', de: RACHA, ate: r2(RACHA + 0.5), intensidade: 0.6 }],
  camera: { tipo: 'travelling', de: { pos: camAtras7.pos, olha: camAtras7.olha }, para: { pos: add3(camAtras7.pos, dirH, -0.8), olha: camAtras7.olha }, fov: 58 },
  textos: [{ texto: TXT.quebrou, de: r2(RACHA + 0.2), ate: C7, estilo: 'destaque' }],
});

// ---- 8. vira um anel de pedras; o Aracnildo foge balançando ----
// anel que passa exatamente pela Lua: plano inclinado para trás, centro bem abaixo do horizonte
const R_ANEL = 320;
const T_ANEL = rad(26.6);
const CENTRO_ANEL = add3(LUA, [0, -Math.cos(T_ANEL), -Math.sin(T_ANEL)], R_ANEL);
const anel = (prog) => ({
  id: 'anel', asset: 'anel_pedras', pos: CENTRO_ANEL,
  params: { raio: R_ANEL, largura: 24, inclinacao: -r2(90 - 26.6), origem: 90, pedras: 3200, tamanhoPedra: 1.5, velocidade: 0, apoiada: false, progress: Array.isArray(prog) ? prog[0][1] : prog },
  ...(Array.isArray(prog) ? { etapa: prog } : {}),
});
const C8 = corte(8, 9);
const ANC = [8, 31, 9];
const L_FIO = 9;
const balanco = trilha(C7, C8, (u) => {
  const th = rad(-55 + 110 * ease(u));
  return [ANC[0] + L_FIO * Math.sin(th), ANC[1] - L_FIO * Math.cos(th), ANC[2]];
});
add(C7, C8, {
  ambiente: NOITE,
  objetos: [...cidade(C7, C8), lua(3, { etapa: [[C7, 0.55], [C8, 1]] }), anel([[r2(C7 + 0.1), 0], [r2(C8 - 0.3), 1]])],
  personagens: [aranha({
    pos: balanco[0][1], giro: 90,
    anim: { pos: balanco, suave: false },
    acoes: [{ clip: 'balancar', de: C7, ate: C8, velocidade: 0.7, params: { fio: L_FIO * 0.8 } }],
  })],
  camera: { tipo: 'travelling', de: { pos: [12, 2, 42], olha: [4.5, 30, -6] }, para: { pos: [11, 2, 38], olha: [4.5, 31, -6] }, fov: 56 },
});

// ---- 9. final: sentado no telhado, olhando o anel ----
const SENTADO = [1.5, r2(19.4 - 0.34 * 0.98), 4.95];
add(C8, FIM, {
  transicao: 'fade',
  ambiente: NOITE,
  objetos: [...cidade(C8, FIM), lua(3, { params: { raio: 3.2, apoiada: false, brilho: 0.75, progress: 1 } }), anel(1)],
  personagens: [aranha({
    pos: SENTADO, giro: 0,
    acoes: [
      { clip: 'sit', de: C8, ate: FIM, params: { seatHeight: 0.34, arms: 'lap' }, suavizacao: 0.01 },
      { clip: 'think', de: C8, ate: r2(F[9][1] + 0.1), camada: 1, mascara: ['head', 'face'] },
    ],
  })],
  camera: { tipo: 'travelling', de: { pos: [3.0, 18.9, 9.6], olha: [0.9, 22.6, 1] }, para: { pos: [2.7, 19.0, 8.8], olha: [1.0, 22.4, 1] }, fov: 54 },
  textos: [
    { texto: TXT.olhar, de: r2(F[9][0]), ate: r2(F[10][0] - 0.1), estilo: 'destaque' },
    { texto: TXT.pergunta, de: r2(F[10][0]), ate: FIM, estilo: 'pergunta' },
  ],
});

const sb = {
  versao: 1,
  titulo: TXT.titulo,
  formato: { largura: 1080, altura: 1920, fps: 30 },
  duracao: FIM,
  audio: 'narracao.mp3',
  palavras: 'palavras.json',
  legendas: { ativo: true, palavrasPorBloco: 1 },
  ambiente: NOITE,
  cenas: S,
};
fs.writeFileSync(path.join(PASTA, 'storyboard.json'), JSON.stringify(sb, null, 2) + '\n');
console.log(`storyboard.json: ${S.length} cenas, ${FIM} s; cortes ${S.map((c) => c.inicio).join(' / ')}`);

// ---------------- conferência de enquadramento ----------------
if (process.argv.includes('--checar')) {
  const fmt = (q) => (!q ? 'atrás' : `${q[0].toFixed(2)},${q[1].toFixed(2)}${q[0] < 0 || q[0] > 1 || q[1] < 0 || q[1] > 1 ? ' FORA' : ''}`);
  const anelPonto = (a) => {
    const i = rad(-(90 - 26.6));
    const lz = R_ANEL * Math.sin(rad(a));
    return [CENTRO_ANEL[0] + R_ANEL * Math.cos(rad(a)), CENTRO_ANEL[1] - lz * Math.sin(i), CENTRO_ANEL[2] + lz * Math.cos(i)];
  };
  const C = (c, fov) => ({ pos: c.pos, olha: c.olha, fov });
  const checks = [
    ['1 gancho', C(S[0].camera.de, 52), { heroi: add3(H, [0, 1, 0]), maos: MAOS }],
    ['2 puxa', C(camAtras, 54), { heroi: add3(H, [0, 0.9, 0]), pe: H, lua: LUA }],
    ['3 rua', C(camRua, 50), { heroi: add3(H, [0, 1, 0]), lua: LUA, telhado: [0, 19.4, 5] }],
    ['4 praia', C(CAM4.de, 52), { lua: LUA4, casa2: [0, 3, -5], mar: [0, 1, 20] }],
    ['5 onda', C(CAM5, 56), { lua: LUA5, crista0: [0, 7.4, 40], crista1: [0, 7.4, 10] }],
    ['6 parede', C(S[5].camera.de, 52), { heroi: add3(PAREDE, [0, 1, 0]), topo: add3(PAREDE, [0, 5, 0]) }],
    ['7 racha', C(camAtras7, 58), { heroi: add3(H, [0, 0.9, 0]), pe: H, lua: LUA }],
    ['8 anel', C(S[7].camera.de, 56), { lua: LUA, a85: anelPonto(85), a95: anelPonto(95), balanco0: balanco[0][1], balanco1: balanco[balanco.length - 1][1], ancora: ANC }],
    ['9 final', C(S[8].camera.de, 54), { lua: LUA, sentado: add3(SENTADO, [0, 1.1, 0]), a85: anelPonto(85), a95: anelPonto(95) }],
  ];
  for (const [nome, c, pts] of checks) console.log(nome.padEnd(10), Object.entries(pts).map(([k, p]) => `${k}:${fmt(proj(c.pos, c.olha, c.fov, p))}`).join('  '));
}
