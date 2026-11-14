// "O mistério da pedra que caiu do céu" — PARTE 1/3: o buraco na cidade (~64 s, narração ElevenLabs).
// Minissérie com Coruja Noturna + Aracnildo. Cenas alinhadas às 21 frases de frases.json.
// Rode: node projects/pedra-do-ceu-parte-1/gerar-storyboard.mjs [pasta-de-outra-versao]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ARG = process.argv.slice(2).find((a) => !a.startsWith('--'));
const PASTA = ARG ? path.resolve(ARG) : path.dirname(fileURLToPath(import.meta.url));
const TXT = {
  titulo: 'O mistério da pedra que caiu do céu — parte 1', selo: 'PARTE 1/3', manchete: 'O MISTÉRIO|DA *PEDRA* QUE|CAIU DO *CÉU*',
  medida: '≈ 3,6 km', passado: 'MILHÕES DE ANOS ATRÁS', nome: 'CRATERA DE COLÔNIA · SÃO PAULO', moradores: 'milhares de moradores',
  dentro: 'DENTRO DA CRATERA!', prova: 'zircão deformado = prova do impacto', quente: 'AINDA QUENTE?!', daqui: 'ELA NÃO É DAQUI',
  continua: 'CONTINUA…', segue: 'SEGUE PRA|VER A|*PARTE 2*', pergunta: 'O que é essa pedra? 👇',
  ...(fs.existsSync(path.join(PASTA, 'textos.json')) ? JSON.parse(fs.readFileSync(path.join(PASTA, 'textos.json'), 'utf8')) : {}),
};
const F = JSON.parse(fs.readFileSync(path.join(PASTA, 'frases.json'), 'utf8')).map((f) => [f.inicio, f.fim]);
if (F.length !== 21) throw new Error(`A narração precisa ter 21 frases (tem ${F.length}).`);

const r2 = (n) => Math.round(n * 100) / 100;
const corte = (a, b) => r2((F[a][1] + F[b][0]) / 2);
const add3 = (a, b) => a.map((v, i) => r2(v + b[i]));
const S = [];
const add = (inicio, fim, c) => S.push({ inicio, fim, ...c });
const etiqueta = (texto, extra) => ({ tipo: 'etiqueta', texto, tamanho: 1.15, ponto: '#5dffc8', ...extra });

// ---------------- elenco (traço grosso de cartoon) ----------------
const TRACO = { contornoEspessura: 1.6 };
const coruja = (extra) => ({ id: 'coruja', preset: 'coruja_noturna', overrides: TRACO, ...extra });
const aranha = (extra) => ({ id: 'aranha', preset: 'aracnildo', overrides: TRACO, ...extra });

// ---------------- lugares ----------------
const NOITE_CIDADE = { fundo: 'cidade', horario: 'madrugada', chao: 'asfalto' };
const NOITE = { fundo: 'cidade', horario: 'madrugada', chao: 'grama' };
const DIA = { fundo: 'cidade', horario: 'dia', chao: 'grama' };
const PASSADO = { fundo: 'campo', horario: 'tarde', chao: 'grama' };
const TELHADO = 18.6;
const predios = () => [
  { id: 'predio', asset: 'predio_apartamentos', pos: [0, 0, 0], params: { floors: 6, wall: '#cfd6e6' } },
  { id: 'predioE', asset: 'predio_apartamentos', variante: 'rosa', pos: [-17, 0, -3], params: { floors: 5 } },
  { id: 'predioD', asset: 'predio_apartamentos', variante: 'azul', pos: [17, 0, -5], params: { floors: 4 } },
];
const R = 60; // raio da cratera
const cratera = (extra = {}) => ({ id: 'cratera', asset: 'cratera', variante: 'colonia', pos: [0, 0, 0], ...extra });
const MIRANTE_Y = 9.8;
const mirante = () => ({ id: 'mirante', asset: 'forma', pos: [0, 9.2, 61.5], params: { tamanho: [7, 0.6, 6], cor: '#6f7a70' } });
const POS_C = [-0.9, MIRANTE_Y, 60]; // Coruja no mirante
const POS_A = [0.9, MIRANTE_Y, 60.2]; // Aracnildo no mirante

// cortes (no meio das pausas da narração)
const C1 = corte(0, 1);
const C2 = corte(1, 2);
const C3 = corte(2, 3);
const C4 = corte(3, 4);
const C5 = corte(4, 5);
const C6 = corte(5, 6);
const C7 = corte(6, 7);
const C8 = corte(7, 8);
const C9 = corte(8, 9);
const C10 = corte(9, 10);
const C11 = corte(11, 12);
const C12 = corte(12, 13);
const C13 = corte(13, 14);
const C14 = corte(15, 16);
const C15 = corte(16, 17);
const C16 = corte(18, 19);
const C17 = corte(19, 20);
const FIM = r2(F[20][1] + 2.6);

// ---- 1. a luz risca o céu ----
const T_SOME = r2(C1 - 0.9);
add(0, C1, {
  transicao: 'fade',
  ambiente: NOITE_CIDADE,
  objetos: [...predios(),
    { id: 'meteoro', asset: 'meteoro', pos: [14, 62, 30], giro: 188, params: { raio: 1.1, cauda: 16, luz: false }, some: T_SOME,
      anim: { pos: [[0.25, [14, 62, 30]], [T_SOME, [-12, 13, -175]]], suave: false, giro: [[0, -15]], eixo: 'x' } },
    { id: 'clarao', asset: 'forma', pos: [-12, 14, -178], params: { tipo: 'esfera', tamanho: [34, 22, 10], cor: '#fff0c0', emissivo: true, apoiada: false }, aparece: T_SOME, anim: { escala: [[T_SOME, 0.2], [r2(T_SOME + 0.25), 1.5], [C1, 0.5]] } }],
  personagens: [coruja({ pos: [-1.6, TELHADO, 1.5], giro: 180, acoes: [{ clip: 'look_around', de: 0, ate: 1.2 }, { clip: 'surprised', de: 1.2, ate: C1 }] })],
  efeitos: [{ tipo: 'tremor', de: T_SOME, ate: r2(T_SOME + 0.5), intensidade: 0.35 }],
  camera: { tipo: 'travelling', de: { pos: [0.6, 20.3, 6.4], olha: [-2, 27, -30] }, para: { pos: [0.2, 20.1, 5.2], olha: [-3, 22.5, -30] }, fov: 52 },
  textos: [{ texto: TXT.selo, de: 0.15, ate: C1, estilo: 'selo' }, { texto: TXT.manchete, de: 0.35, ate: C1, estilo: 'manchete' }],
});

// ---- 2. a Coruja viu tudo ----
add(C1, C2, {
  ambiente: NOITE_CIDADE,
  objetos: predios(),
  personagens: [coruja({ pos: [-1.6, TELHADO, 1.5], giro: 180, acoes: [{ clip: 'think', de: C1, ate: r2(C1 + 1.1), suavizacao: 0.01 }, { clip: 'point', de: r2(C1 + 1.1), ate: C2 }] })],
  fluxos: [{ material: 'luz', origem: [-1.6, 19.2, 0.4], destino: [-1.6, 21.4, 0.2], taxa: 12, tamanho: 0.02, dispersao: 0.5, espalha: 0.5 }],
  efeitos: [{ tipo: 'zoom', de: C1, ate: C2, para: 1.12 }],
  camera: { tipo: 'enquadrar', alvo: 'coruja', plano: 'medio', angulo: 24, elevacao: 2, deriva: -14, aproxima: 0.8, fov: 42 },
});

// ---- 3. ...e arrastou o Aracnildo ----
const SENT = [1.3, r2(19.4 - 0.34 * 0.98), 4.95];
const PC = [-0.9, TELHADO, 3.1];
const T_GANCHO = r2(C2 + 0.75);
const T_PUXA = r2(T_GANCHO + 0.15);
add(C2, C3, {
  ambiente: NOITE_CIDADE,
  objetos: predios(),
  personagens: [
    coruja({ pos: PC, giro: 0, anim: { pos: [[C2, PC], [T_GANCHO, PC], [r2(T_GANCHO + 0.7), add3(PC, [1, 7, 5])], [C3, add3(PC, [2, 22, 13])]], suave: true },
      acoes: [{ clip: 'lancar_gancho', de: C2, ate: T_GANCHO, velocidade: 1.5, params: { alcance: 12 }, suavizacao: 0.01 }, { clip: 'balancar', de: T_GANCHO, ate: C3, params: { fio: 8 } }] }),
    aranha({ pos: SENT, giro: 0, anim: { pos: [[C2, SENT], [T_PUXA, SENT], [r2(T_PUXA + 0.7), add3(SENT, [0.2, 6.2, 5])], [C3, add3(SENT, [0.6, 21, 13])]], suave: true },
      acoes: [{ clip: 'sit', de: C2, ate: T_PUXA, params: { seatHeight: 0.34 }, suavizacao: 0.01 }, { clip: 'derrapar', de: T_PUXA, ate: C3, expressao: 'surprised', suavizacao: 0.12 }] }),
  ],
  fluxos: [{ material: 'poeira', origem: [SENT[0], 19.5, SENT[2]], taxa: 40, tamanho: 0.2, vida: 0.6, de: T_PUXA, ate: r2(T_PUXA + 0.3) }],
  camera: { tipo: 'travelling', de: { pos: [2.8, 20.7, 9.2], olha: [0.3, 19.75, 3.8] }, para: { pos: [3.2, 20.4, 10.5], olha: [0.6, 23, 5] }, fov: 50 },
});

// ---- 4. o buraco gigante (a câmera sobe e revela) ----
const T_CHEGA = r2(C3 + 1.5);
add(C3, C4, {
  transicao: 'flash',
  ambiente: NOITE,
  objetos: [cratera(), mirante()],
  personagens: [
    coruja({ pos: [POS_C[0], MIRANTE_Y, 63.4], giro: 180, movimentos: [{ de: C3, ate: T_CHEGA, para: [POS_C[0], POS_C[2]], clip: 'walk' }], acoes: [{ clip: 'point', de: T_CHEGA, ate: C4 }] }),
    aranha({ pos: [POS_A[0], MIRANTE_Y, 63.8], giro: 180, movimentos: [{ de: r2(C3 + 0.2), ate: r2(T_CHEGA + 0.2), para: [POS_A[0], POS_A[2]], clip: 'walk' }], acoes: [{ clip: 'surprised', de: r2(T_CHEGA + 0.2), ate: C4 }] }),
  ],
  camera: { tipo: 'travelling', de: { pos: [2.4, 11.0, 66.6], olha: [0, 10.6, 60] }, para: { pos: [5, 36, 92], olha: [0, 0, 8] }, fov: 50 },
});

// ---- 5. círculo quase perfeito: 3,6 km (vista de cima) ----
add(C4, C5, {
  ambiente: NOITE,
  objetos: [cratera(), mirante()],
  elementos: [
    { tipo: 'seta', direcao: 'horizontal', pos: [0.5, 0.5], tamanho: 0.8, cor: '#ffd60a', balanca: false, de: r2(F[4][0] + 1.6), ate: C5 },
    etiqueta(TXT.medida, { pos: [0.5, 0.415], tamanho: 1.7, ponto: '#ffd60a', de: r2(F[4][0] + 2.0), ate: C5 }),
  ],
  fluxos: [{ material: 'luz', origem: [0, 12, 0], destino: [0, 40, 0], taxa: 14, tamanho: 0.5, dispersao: 40, espalha: 30 }],
  efeitos: [{ tipo: 'zoom', de: C4, ate: C5, para: 1.08 }],
  camera: { tipo: 'travelling', de: { pos: [0, 120, 110], olha: [0, 0, 0] }, para: { pos: [0, 250, 10], olha: [0, 0, 0] }, fov: 50 },
});

// ---- 6. o Aracnildo tem certeza ----
add(C5, C6, {
  ambiente: NOITE,
  objetos: [cratera(), mirante()],
  personagens: [
    coruja({ pos: POS_C, giro: 180, acoes: [{ clip: 'think', de: C5, ate: C6 }] }),
    aranha({ pos: POS_A, giro: 180, viraPara: [{ em: r2(C5 + 1.6), alvo: 'coruja' }],
      acoes: [{ clip: 'point', de: C5, ate: r2(C5 + 1.6) }, { clip: 'cheer', de: r2(C5 + 1.6), ate: C6, expressao: 'happy' }] }),
  ],
  elementos: [{ tipo: 'icone', icone: 'lampada', ancora: 'aranha', alturaRel: 1.32, tamanho: 0.13, pulsa: true, de: r2(C5 + 0.5), ate: C6 }],
  camera: { tipo: 'travelling', de: { pos: [0.9, 11.25, 54.2], olha: [0, 10.85, 60.1] }, para: { pos: [0.5, 11.2, 55.2], olha: [0.1, 10.9, 60.1] }, fov: 46 },
});

// ---- 7. "Só que não." ----
add(C6, C7, {
  ambiente: NOITE,
  objetos: [cratera(), mirante()],
  personagens: [coruja({ pos: POS_C, giro: 180, acoes: [{ clip: 'shake_head', de: C6, ate: C7, velocidade: 1.4, suavizacao: 0.01 }] }),
    aranha({ pos: POS_A, giro: 90, acoes: [{ clip: 'shrug', de: C6, ate: C7, suavizacao: 0.01 }] })],
  elementos: [{ tipo: 'icone', icone: 'x', pos: [0.74, 0.3], tamanho: 0.2, de: r2(C6 + 0.1), ate: C7 }],
  efeitos: [{ tipo: 'zoom', de: C6, ate: C7, para: 1.1 }],
  camera: { tipo: 'enquadrar', alvo: 'coruja', plano: 'medio', angulo: -16, elevacao: 2, fov: 40 },
});

// ---- 8. milhões de anos atrás: o impacto ----
const T_IMP = r2(F[7][0] + 1.7);
add(C7, C8, {
  transicao: 'flash',
  ambiente: PASSADO,
  objetos: [
    { id: 'cratera', asset: 'cratera', variante: 'recente', pos: [0, 0, 0], params: { progress: 0 }, etapa: [[T_IMP, 0], [r2(T_IMP + 1.1), 1]] },
    { id: 'meteoro', asset: 'meteoro', variante: 'gigante', pos: [8, 150, 150], giro: 183, some: T_IMP, anim: { pos: [[C7, [8, 150, 150]], [T_IMP, [0, 3, 0]]], suave: false, giro: [[0, -45]], eixo: 'x' } },
    { id: 'choque', asset: 'anel_choque', pos: [0, 0.2, 0], params: { raio: 130, progress: 0 }, etapa: [[T_IMP, 0], [r2(T_IMP + 1.5), 1]] },
    { id: 'clarao', asset: 'forma', pos: [0, 6, 0], params: { tipo: 'esfera', tamanho: [40, 40, 40], cor: '#fff3c9', emissivo: true, apoiada: false }, aparece: T_IMP, some: r2(T_IMP + 0.7), anim: { escala: [[T_IMP, 0.2], [r2(T_IMP + 0.35), 1.6], [r2(T_IMP + 0.7), 0.4]] } },
  ],
  fluxos: [
    { material: 'poeira', origem: [0, 2, 0], taxa: 90, tamanho: 6, dispersao: 30, vida: 2.4, subida: 6, de: T_IMP, ate: C8 },
    { material: 'pedra', origem: [0, 3, 0], destino: [0, 40, 60], taxa: 120, tamanho: 1.2, espalha: 50, arco: 30, de: T_IMP, ate: r2(T_IMP + 0.6) },
  ],
  efeitos: [{ tipo: 'tremor', de: T_IMP, ate: C8, intensidade: 1 }],
  camera: { tipo: 'travelling', de: { pos: [46, 9, 185], olha: [4, 48, 60] }, para: { pos: [44, 12, 180], olha: [0, 12, 0] }, fov: 52 },
  textos: [{ texto: TXT.passado, de: r2(F[7][0] + 0.15), ate: C8, estilo: 'destaque' }],
});

// ---- 9. é a Cratera de Colônia ----
add(C8, C9, {
  ambiente: PASSADO,
  objetos: [{ id: 'cratera', asset: 'cratera', variante: 'recente', pos: [0, 0, 0] }],
  fluxos: [
    { material: 'fumaca', origem: [0, 2, 0], taxa: 10, tamanho: 7, dispersao: 22, vida: 4, subida: 5 },
    { material: 'fogo', origem: [0, 1, 0], taxa: 20, tamanho: 3.5, dispersao: 16, de: C8, ate: r2(C8 + 2) },
  ],
  elementos: [etiqueta(TXT.nome, { pos: [0.5, 0.2], tamanho: 1.2, ponto: '#ff8a2a', de: r2(F[8][0] + 0.3), ate: C9 })],
  camera: { tipo: 'travelling', de: { pos: [60, 16, 150], olha: [0, 8, 0] }, para: { pos: [18, 110, 150], olha: [0, 0, 0] }, fov: 52 },
});

// ---- 10. hoje: milhares de pessoas moram dentro dela ----
add(C9, C10, {
  transicao: 'flash',
  ambiente: DIA,
  objetos: [cratera(), { id: 'bus', asset: 'onibus', pos: [-34, 0.12, 0], giro: 90, escala: 0.5, movimentos: [{ de: C9, ate: C10, para: [30, 0] }] }],
  elementos: [etiqueta(TXT.moradores, { pos: [0.5, 0.22], tamanho: 1.3, ponto: '#ffd60a', de: r2(F[9][0] + 1.8), ate: C10 })],
  camera: { tipo: 'travelling', de: { pos: [0, 70, 140], olha: [0, 0, 0] }, para: { pos: [9, 12, 44], olha: [0, 1.5, 0] }, fov: 50 },
});

// ---- 11. rua, casa, ônibus... tudo dentro de uma cratera ----
add(C10, C11, {
  ambiente: DIA,
  objetos: [cratera(),
    { id: 'bus', asset: 'onibus', variante: 'azul', pos: [0.2, 0.12, -30], giro: 0, escala: 0.5, movimentos: [{ de: C10, ate: r2(C11 - 0.4), para: [0.2, 26] }] },
    { id: 'carro', asset: 'carro_hatch', variante: 'amarelo', pos: [-28, 0.12, 0.3], giro: 90, escala: 0.6, movimentos: [{ de: r2(C10 + 0.6), ate: C11, para: [26, 0.3] }] }],
  personagens: [
    { id: 'm1', preset: 'mulher', pos: [-0.9, 0.1, 6], giro: 180, movimentos: [{ de: C10, ate: C11, para: [-0.9, 12], clip: 'walk' }] },
    { id: 'c1', preset: 'crianca', pos: [1.1, 0.1, 13.5], giro: 0, acoes: [{ clip: 'wave', de: r2(C10 + 0.8), ate: C11, expressao: 'happy' }] },
    { id: 'v1', preset: 'velhinho', pos: [-1.2, 0.1, 15.5], giro: 60, acoes: [{ clip: 'look_around', de: C10, ate: C11 }] },
  ],
  camera: { tipo: 'travelling', de: { pos: [1.4, 1.5, 19.5], olha: [0, 1.3, 8] }, para: { pos: [2.6, 9.5, 27], olha: [0, 3, -14] }, fov: 50 },
  textos: [{ texto: TXT.dentro, de: r2(F[11][0]), ate: C11, estilo: 'destaque' }],
});

// ---- 12. por décadas, ninguém conseguia provar ----
const SONDA = [-8, 0.06, 38.8];
const CIENT = [-5.8, 0.06, 39.7];
add(C11, C12, {
  ambiente: DIA,
  objetos: [cratera(), { id: 'sonda', asset: 'sonda', pos: SONDA }],
  personagens: [{ id: 'geo', preset: 'engenheira', pos: CIENT, giro: 20, acoes: [{ clip: 'read_clipboard', de: C11, ate: r2(C11 + 1.8) }, { clip: 'think', de: r2(C11 + 1.8), ate: C12 }] }],
  fluxos: [{ material: 'poeira', origem: [SONDA[0], 0.2, SONDA[2]], taxa: 14, tamanho: 0.3, vida: 0.9 }],
  elementos: [{ tipo: 'icone', icone: 'interrogacao', ancora: 'geo', alturaRel: 1.3, tamanho: 0.13, pulsa: true, de: r2(C11 + 1.0), ate: C12 }],
  camera: { tipo: 'travelling', de: { pos: [-4.6, 4.0, 46.6], olha: [-7.1, 1.7, 39.2] }, para: { pos: [-5.0, 3.7, 45.6], olha: [-7.0, 1.7, 39.2] }, fov: 46 },
});

// ---- 13. a prova estava no fundo: o cristal deformado ----
const NUC = add3(SONDA, [0.7, 0, 0.4]);
const T_SOBE = r2(F[13][0] + 1.9);
const CRISTAL = add3(NUC, [0, 2.75, 0]);
add(C12, C13, {
  ambiente: DIA,
  objetos: [cratera(), { id: 'sonda', asset: 'sonda', pos: SONDA, params: { progress: 0 }, etapa: [[C12, 0], [T_SOBE, 1]] },
    { id: 'cristal', asset: 'forma', pos: CRISTAL, params: { tipo: 'cone', tamanho: [0.16, 0.3, 0.16], cor: '#c79bff', brilho: true, emissivo: true, apoiada: true }, aparece: T_SOBE, anim: { gira: 140, pulsa: 0.08 } }],
  personagens: [{ id: 'geo', preset: 'engenheira', pos: CIENT, giro: 20, acoes: [{ clip: 'surprised', de: T_SOBE, ate: r2(T_SOBE + 1.2) }, { clip: 'cheer', de: r2(T_SOBE + 1.2), ate: C13, expressao: 'happy' }] }],
  fluxos: [
    { material: 'poeira', origem: [SONDA[0], 0.2, SONDA[2]], taxa: 14, tamanho: 0.3, vida: 0.9, de: C12, ate: T_SOBE },
    { material: 'luz', origem: CRISTAL, destino: add3(CRISTAL, [0, 0.9, 0]), taxa: 20, tamanho: 0.02, dispersao: 0.15, espalha: 0.5, de: T_SOBE, ate: C13 },
  ],
  elementos: [
    { tipo: 'lente', pos: [0.5, 0.42], tamanho: 0.36, cor: '#c79bff', de: r2(T_SOBE + 0.5), ate: C13 },
    etiqueta(TXT.prova, { pos: [0.5, 0.2], tamanho: 1.02, ponto: '#c79bff', de: r2(T_SOBE + 0.9), ate: C13 }),
  ],
  camera: { tipo: 'travelling', de: { pos: [-5.0, 3.7, 45.6], olha: [-7.0, 1.7, 39.2] }, para: { pos: add3(CRISTAL, [1.0, 0.25, 1.7]), olha: add3(CRISTAL, [0, 0.12, 0]) }, fov: 44 },
});

// ---- 14. mistério resolvido? ainda não ----
add(C13, C14, {
  transicao: 'flash',
  ambiente: NOITE,
  objetos: [cratera(), mirante()],
  personagens: [
    coruja({ pos: POS_C, giro: 180, acoes: [{ clip: 'think', de: C13, ate: r2(F[15][0] - 0.1), suavizacao: 0.01 }, { clip: 'shake_head', de: r2(F[15][0] - 0.1), ate: C14, velocidade: 1.3 }] }),
    aranha({ pos: POS_A, giro: 180, acoes: [{ clip: 'cheer', de: C13, ate: r2(F[15][0] - 0.1), expressao: 'happy', suavizacao: 0.01 }, { clip: 'shrug', de: r2(F[15][0] - 0.1), ate: C14 }] }),
  ],
  camera: { tipo: 'travelling', de: { pos: [-1.0, 11.2, 54.8], olha: [0, 10.85, 60.1] }, para: { pos: [-0.6, 11.15, 55.6], olha: [0, 10.9, 60.1] }, fov: 46 },
});

// ---- 15. o sentido de perigo dispara ----
add(C14, C15, {
  ambiente: NOITE,
  objetos: [cratera(), mirante(), { id: 'luzverde', asset: 'pedra_brilhante', pos: [POS_A[0], 8.0, 58.3], params: { tamanho: 0.3 } }],
  personagens: [
    aranha({ pos: POS_A, giro: 180, acoes: [{ clip: 'sentir_perigo', de: C14, ate: C15, suavizacao: 0.01 }] }),
    coruja({ pos: POS_C, giro: 180, viraPara: [{ em: r2(C14 + 0.6), alvo: 'aranha' }], acoes: [{ clip: 'surprised', de: r2(C14 + 0.6), ate: C15 }] }),
  ],
  elementos: [
    { tipo: 'icone', icone: 'exclamacao', ancora: 'aranha', alturaRel: 1.28, dx: -0.14, tamanho: 0.11, pulsa: true, de: r2(C14 + 0.3), ate: C15 },
    { tipo: 'icone', icone: 'exclamacao', ancora: 'aranha', alturaRel: 1.34, dx: 0.14, tamanho: 0.13, pulsa: true, de: r2(C14 + 0.5), ate: C15 },
  ],
  efeitos: [{ tipo: 'zoom', de: C14, ate: C15, para: 1.22 }, { tipo: 'tremor', de: r2(C14 + 0.3), ate: r2(C14 + 0.9), intensidade: 0.3 }],
  camera: { tipo: 'enquadrar', alvo: 'aranha', plano: 'medio', angulo: 14, elevacao: 0, deriva: -10, fov: 40 },
});

// ---- 16. a pedra brilhando na lama... e ainda quente ----
const ROCHA = [0, 0.02, 41];
const lama = () => ({ id: 'lama', asset: 'chao', variante: 'terra', pos: [0, -0.2, 41], params: { size: 9, seed: 4 } });
const rocha = (extra = {}) => ({ id: 'rocha', asset: 'pedra_brilhante', pos: ROCHA, params: { tamanho: 0.45 }, ...extra });
add(C15, C16, {
  transicao: 'fade',
  ambiente: NOITE,
  objetos: [cratera(), lama(), rocha({ etapa: [[C15, 0.45], [C16, 1]] })],
  personagens: [
    coruja({ pos: [-1.3, 0.1, 46.5], giro: 180, movimentos: [{ de: C15, ate: r2(C15 + 2.2), para: [-1.1, 43.6], clip: 'walk' }], acoes: [{ clip: 'crouch', de: r2(C15 + 2.2), ate: C16 }] }),
    aranha({ pos: [1.0, 0.1, 47.6], giro: 180, movimentos: [{ de: r2(C15 + 0.5), ate: r2(C15 + 2.8), para: [0.9, 44.8], clip: 'walk', velocidade: 0.7 }], acoes: [{ clip: 'surprised', de: r2(C15 + 2.8), ate: C16, expressao: 'worried' }] }),
  ],
  fluxos: [
    { material: 'vapor', origem: add3(ROCHA, [0, 0.5, 0]), taxa: 6, tamanho: 0.045, vida: 1.4, subida: 1.0 },
    { material: 'fagulha', origem: add3(ROCHA, [0, 0.4, 0]), destino: add3(ROCHA, [0.2, 1.6, 0.2]), taxa: 10, espalha: 0.9, de: r2(F[18][0] - 0.2), ate: C16 },
  ],
  camera: { tipo: 'travelling', de: { pos: [0.7, 0.42, 36.6], olha: [0, 0.75, 41.4] }, para: { pos: [0.35, 0.4, 38.5], olha: [0, 0.8, 41.8] }, fov: 46 },
  textos: [{ texto: TXT.quente, de: r2(F[18][0]), ate: C16, estilo: 'destaque' }],
});

// ---- 17. ela não é daqui (macro) ----
add(C16, C17, {
  ambiente: NOITE,
  objetos: [cratera(), lama(), rocha()],
  fluxos: [{ material: 'vapor', origem: add3(ROCHA, [0, 0.5, 0]), taxa: 6, tamanho: 0.04, vida: 1.3, subida: 1.0 }],
  efeitos: [{ tipo: 'zoom', de: C16, ate: C17, para: 1.18 }],
  camera: { tipo: 'travelling', de: { pos: [2.3, 1.3, 37.6], olha: [0, 0.3, 41] }, para: { pos: [1.7, 1.0, 38.4], olha: [0, 0.3, 41] }, fov: 34 },
  textos: [{ texto: TXT.daqui, de: r2(F[19][0]), ate: C17, estilo: 'destaque' }],
});

// ---- 18. gancho: segue pra ver a parte 2 (ponto de vista da pedra) ----
add(C17, FIM, {
  ambiente: NOITE,
  objetos: [cratera(), lama(), { id: 'brilho', asset: 'pedra_brilhante', pos: [0, -0.75, 41.9], params: { tamanho: 0.5 } }],
  personagens: [
    coruja({ pos: [-0.45, 0.1, 43.0], giro: 180, viraPara: [{ em: C17, alvo: [0, 41] }], acoes: [{ clip: 'crouch', de: C17, ate: FIM, suavizacao: 0.01 }] }),
    aranha({ pos: [0.5, 0.1, 43.15], giro: 180, viraPara: [{ em: C17, alvo: [0, 41] }], acoes: [{ clip: 'crouch', de: C17, ate: FIM, suavizacao: 0.01, expressao: 'worried' }, { clip: 'sentir_perigo', de: r2(C17 + 1.6), ate: FIM, camada: 1, mascara: ['head', 'face'] }] }),
  ],
  fluxos: [{ material: 'luz', origem: [0, 0.15, 41.6], destino: [0, 1.6, 42.2], taxa: 16, tamanho: 0.018, dispersao: 0.3, espalha: 0.8 }],
  efeitos: [{ tipo: 'zoom', de: C17, ate: FIM, para: 1.1 }],
  camera: { tipo: 'travelling', de: { pos: [0.02, 0.3, 40.1], olha: [0, 0.9, 43.0] }, para: { pos: [0.02, 0.28, 40.6], olha: [0, 0.95, 43.0] }, fov: 56 },
  textos: [
    { texto: TXT.continua, de: r2(F[20][0] - 0.1), ate: FIM, estilo: 'selo' },
    { texto: TXT.pergunta, de: r2(F[20][1] + 0.3), ate: FIM, estilo: 'rodape' },
    { texto: TXT.segue, de: r2(F[20][0] + 0.1), ate: FIM, estilo: 'manchete' },
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
