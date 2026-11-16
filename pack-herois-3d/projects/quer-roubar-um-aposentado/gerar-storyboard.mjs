// "Não roube um aposentado sem ver esse vídeo" (~90 s, voz do criador na ElevenLabs).
// Formato de dicas: Aracnildo, Coruja Noturna e Major Cometa tentam, falham na rua e montam o esquema dos descontos
// do INSS — até a Operação Sem Desconto. Cortes rápidos (~2,3 s) alinhados às 37 frases de frases.json.
// Rode: node projects/quer-roubar-um-aposentado/gerar-storyboard.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PASTA = path.dirname(fileURLToPath(import.meta.url));
const F = JSON.parse(fs.readFileSync(path.join(PASTA, 'frases.json'), 'utf8')).map((f) => [f.inicio, f.fim]);
const PAL = JSON.parse(fs.readFileSync(path.join(PASTA, 'palavras.json'), 'utf8'));
if (F.length !== 37) throw new Error(`A narração precisa ter 37 frases (tem ${F.length}).`);

const r2 = (n) => Math.round(n * 100) / 100;
const corte = (a, b) => r2((F[a][1] + F[b][0]) / 2);
const add3 = (a, b) => a.map((v, i) => r2(v + b[i]));
// instante em que a palavra começa (primeira ocorrência depois de "apos")
const W = (palavra, apos = 0) => {
  const alvo = palavra.toLowerCase();
  const w = PAL.find((p) => p.inicio >= apos - 0.01 && p.palavra.toLowerCase().replace(/[^\p{L}\d]/gu, '').startsWith(alvo));
  if (!w) throw new Error(`palavra "${palavra}" não encontrada depois de ${apos}`);
  return r2(w.inicio);
};
const S = [];
const add = (inicio, fim, c) => S.push({ inicio, fim, ...c });
const etiqueta = (texto, extra) => ({ tipo: 'etiqueta', texto, tamanho: 1.2, ponto: '#ffd60a', ...extra });
const selo = (texto, de, ate) => ({ texto, de, ate, estilo: 'selo' });

// ---------------- elenco (traço grosso de cartoon) ----------------
const TRACO = { contornoEspessura: 1.6 };
const aranha = (extra) => ({ id: 'aranha', preset: 'aracnildo', overrides: TRACO, ...extra });
const coruja = (extra) => ({ id: 'coruja', preset: 'coruja_noturna', overrides: TRACO, ...extra });
const cometa = (extra) => ({ id: 'cometa', preset: 'major_cometa', overrides: TRACO, ...extra });
const vovo = (extra) => ({ id: 'vovo', preset: 'velhinha', overrides: { ...TRACO, face: { glasses: true }, top: { color: '#c86f9b', sleeves: 'long' } }, ...extra });
const agente = (id, extra) => ({ id, preset: 'homem', overrides: { ...TRACO, top: { color: '#1d2433', sleeves: 'long' }, bottom: { color: '#1d2433', type: 'pants' }, hat: { type: 'cap', color: '#1d2433' } }, ...extra });

// ---------------- lugares ----------------
const RUA = { fundo: 'cidade', horario: 'dia', chao: 'concreto' };
const TARDE = { fundo: 'cidade', horario: 'tarde', chao: 'concreto' };
const SALA = { fundo: 'interior', horario: 'dia', chao: 'piso' };
const rua = () => [
  { id: 'casa', asset: 'casa_simples', variante: 'amarela', pos: [0, 0, -9] },
  { id: 'padaria', asset: 'loja', variante: 'padaria', pos: [-11, 0, -9] },
  { id: 'sobrado', asset: 'sobrado', variante: 'salmao', pos: [11, 0, -10] },
  { id: 'poste', asset: 'poste_luz', pos: [-3.2, 0, 0.2], giro: 90 },
  { id: 'arvore', asset: 'arvore_redonda', pos: [6.5, 0, -3] },
  { id: 'banco', asset: 'banco', pos: [3, 0, -2.5] },
];
const PV = [0.6, 0, 0.6]; // vovó na calçada
const PA = [-3.25, 0, 0.75]; // Aracnildo atrás do poste
const MAO_V = add3(PV, [0.32, 0.62, 0.08]); // altura da mão da vovó
const bolsa = (extra) => ({ id: 'bolsa', asset: 'bolsa', pos: add3(MAO_V, [0, -0.25, 0]), params: { tamanho: 1.4 }, ...extra });
const bengala = (extra) => ({ id: 'bengala', asset: 'bengala', pos: add3(PV, [-0.38, 0, 0.12]), ...extra });

// escritório da "associação"
const escritorio = () => [
  { id: 'mesa', asset: 'mesa', pos: [0, 0, 0], params: { largura: 2.2 } },
  { id: 'cofre', asset: 'cofre', pos: [2.6, 0, -0.6], giro: -20, params: { progress: 0.15 } },
  { id: 'placaAssoc', asset: 'placa', pos: [0, 2.2, -2.2], params: { texto: 'ASSOCIAÇÃO', sub: 'dos Aposentados Felizes', largura: 3.4, altura: 1.1, fundo: '#1f8a5b', poste: false } },
  { id: 'estante', asset: 'forma', pos: [-2.8, 0, -1.6], params: { tamanho: [1.4, 2.2, 0.5], cor: '#8a5a34' } },
];
const TAMPO = 0.78;

// cortes no meio das pausas (frases contadas a partir de 0)
const C = (a) => corte(a, a + 1); // corte depois da frase a
const FIM = r2(F[36][1] + 1.9);

// =============== 1. gancho: o "tutorial proibido" ===============
add(0, C(0), {
  transicao: 'fade',
  ambiente: RUA,
  objetos: [...rua(), bolsa(), bengala()],
  personagens: [
    vovo({ pos: add3(PV, [2.2, 0, 0]), giro: -90, movimentos: [{ de: 0, ate: C(0), para: [PV[0], PV[2]], clip: 'walk', velocidade: 0.8 }] }),
    aranha({ pos: PA, giro: 90, acoes: [{ clip: 'sentir_perigo', de: 0, ate: C(0) }] }),
    coruja({ pos: [-5.2, 0, -1.2], giro: 70, acoes: [{ clip: 'look_around', de: 0, ate: C(0) }] }),
    cometa({ pos: [-6.6, 0, -2.4], giro: 60, acoes: [{ clip: 'think', de: 0, ate: C(0) }] }),
  ],
  camera: { tipo: 'travelling', de: { pos: [0.5, 1.0, 8.6], olha: [-2.6, 0.6, -0.6] }, para: { pos: [-0.4, 1.0, 7.4], olha: [-2.4, 0.6, -0.6] }, fov: 50 },
  textos: [selo('⚠️ TUTORIAL PROIBIDO', 0.1, C(0)), { texto: 'NÃO *ROUBE*|UM *APOSENTADO*|SEM VER ISSO', de: 0.2, ate: C(0), estilo: 'manchete' }],
});

// =============== DICA 1: teia atrás do poste ===============
const T1b = W('se', F[1][0] + 1.5);
add(C(0), T1b, {
  ambiente: RUA,
  objetos: rua(),
  personagens: [aranha({ pos: PA, giro: 30, acoes: [{ clip: 'heroi_pose', de: C(0), ate: T1b }] })],
  fluxos: [{ material: 'luz', origem: add3(PA, [0, 1.1, 0]), destino: add3(PA, [0, 2.6, 0]), taxa: 14, tamanho: 0.03, espalha: 0.7 }],
  camera: { tipo: 'enquadrar', alvo: 'aranha', plano: 'medio', angulo: -25, deriva: 40, elevacao: -4, fov: 44 },
  textos: [selo('DICA 1', C(0), T1b)],
});

const T_TEIA = W('puxa', F[1][0]);
add(T1b, C(1), {
  ambiente: RUA,
  objetos: [...rua(), bolsa(), bengala()],
  personagens: [
    aranha({ pos: PA, giro: 90, acoes: [{ clip: 'crouch', de: T1b, ate: T_TEIA, suavizacao: 0.05 }, { clip: 'lancar_teia', de: T_TEIA, ate: C(1), params: { alcance: 3.6, mira: 0 } }] }),
    vovo({ pos: PV, giro: 0, acoes: [{ clip: 'idle', de: T1b, ate: C(1) }] }),
  ],
  fluxos: [{ material: 'luz', origem: add3(PA, [0.4, 1.25, 0]), destino: add3(MAO_V, [0, 0, 0]), taxa: 24, tamanho: 0.04, de: T_TEIA, ate: C(1) }],
  camera: { tipo: 'travelling', de: { pos: [-5.9, 1.5, 2.3], olha: [-0.4, 0.8, 0.5] }, para: { pos: [-5.6, 1.4, 2.0], olha: [-0.2, 0.8, 0.5] }, fov: 50 },
});

// a bolsa voa pela teia
const PB_MEIO = add3(PA, [1.6, 0.6, 0]);
add(C(1), C(2), {
  ambiente: RUA,
  objetos: [...rua(), bengala(), bolsa({ anim: { pos: [[C(1), add3(MAO_V, [0, -0.25, 0])], [C(2), PB_MEIO]], giro: [[C(1), 0], [C(2), 200]] } })],
  personagens: [
    aranha({ pos: PA, giro: 90, acoes: [{ clip: 'puxar_fio', de: C(1), ate: C(2), expressao: 'happy' }] }),
    vovo({ pos: PV, giro: -90, acoes: [{ clip: 'surprised', de: C(1), ate: C(2) }] }),
  ],
  fluxos: [{ material: 'ar', origem: { ancora: 'bolsa', desloca: [0.3, 0.1, 0] }, destino: add3(MAO_V, [0.5, 0, 0]), taxa: 18 }],
  camera: { tipo: 'travelling', de: { pos: [-1.2, 1.2, 7.8], olha: [-1.2, 0.8, 0.6] }, para: { pos: [-1.4, 1.1, 7.0], olha: [-1.4, 0.8, 0.6] }, fov: 50 },
});

// a vovó puxa de volta
const PA_PUXADO = add3(PV, [-1.15, 0, 0.05]);
add(C(2), C(3), {
  ambiente: RUA,
  objetos: [...rua(), bengala(), bolsa({ pos: add3(MAO_V, [-0.25, -0.2, 0]) })],
  personagens: [
    vovo({ pos: PV, giro: -90, acoes: [{ clip: 'puxar_fio', de: C(2), ate: C(3), expressao: 'angry' }] }),
    aranha({ pos: PA, giro: 90, anim: { pos: [[C(2), PA], [C(3), PA_PUXADO]] }, acoes: [{ clip: 'derrapar', de: C(2), ate: C(3), expressao: 'surprised' }] }),
  ],
  fluxos: [{ material: 'poeira', origem: { ancora: 'aranha', desloca: [0, 0.1, 0] }, taxa: 16, tamanho: 0.3, vida: 0.8 }],
  camera: { tipo: 'enquadrar', alvo: 'vovo', plano: 'medio', angulo: 50, deriva: -20, elevacao: 4, fov: 44 },
});

// bengalada!
const T_BENG = W('bengalada', F[4][0]);
const T_HIT = r2(T_BENG + 0.45);
const MAO_E = add3(PV, [-0.32, 0.62, 0.1]);
add(C(3), C(4), {
  ambiente: RUA,
  objetos: [...rua(), bolsa({ pos: add3(MAO_V, [-0.25, -0.2, 0]) }),
    bengala({ pos: MAO_E, anim: { giro: [[C(3), 0], [T_BENG, -35], [T_HIT, 95], [C(4), 80]], eixo: 'z' } })],
  personagens: [
    vovo({ pos: PV, giro: -90, acoes: [{ clip: 'lutar', de: C(3), ate: C(4), expressao: 'angry', velocidade: 1.4 }] }),
    aranha({ pos: PA_PUXADO, giro: 90, acoes: [{ clip: 'surprised', de: C(3), ate: T_HIT }, { clip: 'tonto_no_chao', de: T_HIT, ate: C(4), suavizacao: 0.08 }] }),
  ],
  fluxos: [{ material: 'luz', origem: add3(PA_PUXADO, [0, 1.0, 0]), destino: add3(PA_PUXADO, [0, 1.6, 0]), taxa: 30, tamanho: 0.06, espalha: 1, de: T_HIT, ate: C(4) }],
  efeitos: [{ tipo: 'tremor', de: T_HIT, ate: r2(T_HIT + 0.45), intensidade: 0.7 }],
  elementos: [{ tipo: 'icone', icone: 'estrela', ancora: 'aranha', alturaRel: 0.8, tamanho: 0.16, de: T_HIT, ate: C(4) }],
  camera: { tipo: 'travelling', de: { pos: [-0.2, 1.3, 4.6], olha: [-0.2, 0.9, 0.6] }, para: { pos: [-0.25, 1.1, 3.8], olha: [-0.35, 0.8, 0.6] }, fov: 48 },
});

// =============== DICA 2: invisível ===============
const PC = [-4.4, 0, 2.2];
add(C(4), C(5), {
  ambiente: RUA,
  objetos: rua(),
  personagens: [
    coruja({ pos: PC, giro: 20, acoes: [{ clip: 'heroi_pose', de: C(4), ate: C(5) }] }),
    aranha({ pos: PA_PUXADO, giro: 90, acoes: [{ clip: 'tonto_no_chao', de: C(4), ate: C(5) }] }),
  ],
  fluxos: [{ material: 'luz', origem: add3(PC, [0, 1.0, 0]), destino: add3(PC, [0, 2.4, 0]), taxa: 14, tamanho: 0.03, espalha: 0.8 }],
  camera: { tipo: 'enquadrar', alvo: 'coruja', plano: 'medio', angulo: 10, deriva: -35, elevacao: -6, fov: 42 },
  textos: [selo('DICA 2', C(4), C(5))],
});

const PC2 = add3(PV, [-1.0, 0, 0.6]);
add(C(5), C(6), {
  ambiente: RUA,
  objetos: [...rua(), bolsa(), bengala()],
  personagens: [
    coruja({ pos: PC, giro: 90, anim: { opacidade: [[C(5), 1], [r2(C(5) + 1.2), 0.18]] }, movimentos: [{ de: r2(C(5) + 0.3), ate: C(6), para: [PC2[0], PC2[2]], clip: 'walk', velocidade: 0.6 }] }),
    vovo({ pos: PV, giro: 0, acoes: [{ clip: 'idle', de: C(5), ate: C(6) }] }),
  ],
  fluxos: [{ material: 'luz', origem: { ancora: 'coruja', desloca: [0, 1, 0] }, taxa: 10, tamanho: 0.04, espalha: 0.6, de: C(5), ate: r2(C(5) + 1.4) }],
  camera: { tipo: 'travelling', de: { pos: [-3.5, 1.2, 6.2], olha: [-2.8, 1.0, 1.4] }, para: { pos: [-1.6, 1.2, 5.6], olha: [-0.8, 1.0, 1.2] }, fov: 46 },
  textos: [{ texto: 'MODO INVISÍVEL 👻', de: r2(C(5) + 0.8), ate: C(6), estilo: 'destaque' }],
});

// a vovó sente cheiro de golpe
add(C(6), C(7), {
  ambiente: RUA,
  objetos: [...rua(), bolsa(), bengala(), { id: 'guarda', asset: 'guarda_chuva', pos: add3(MAO_V, [0, -0.6, 0.1]), params: { progress: 0 } }],
  personagens: [
    vovo({ pos: PV, giro: 0, acoes: [{ clip: 'sentir_perigo', de: C(6), ate: C(7), expressao: 'angry' }] }),
    coruja({ pos: PC2, giro: 60, anim: { opacidade: [[C(6), 0.18]] }, acoes: [{ clip: 'idle', de: C(6), ate: C(7) }] }),
  ],
  fluxos: [{ material: 'ar', origem: add3(PV, [-1.0, 1.3, 0.6]), destino: add3(PV, [0, 1.45, 0.15]), taxa: 14, tamanho: 0.06 }],
  efeitos: [{ tipo: 'zoom', de: C(6), ate: C(7), para: 1.15 }],
  elementos: [{ tipo: 'icone', icone: 'alerta', ancora: 'vovo', alturaRel: 1.05, tamanho: 0.15, de: r2(C(6) + 0.6), ate: C(7), pulsa: true }],
  camera: { tipo: 'enquadrar', alvo: 'vovo', plano: 'close', angulo: 10, elevacao: 3, fov: 38 },
});

// guarda-chuvada
const T_GC = W('cabeça', F[8][0]);
add(C(7), C(8), {
  ambiente: RUA,
  objetos: [...rua(), bolsa(), bengala(),
    { id: 'guarda', asset: 'guarda_chuva', pos: MAO_E, params: { progress: 0 }, anim: { giro: [[C(7), 0], [r2(T_GC - 0.4), -40], [T_GC, 100], [C(8), 90]], eixo: 'z' } }],
  personagens: [
    vovo({ pos: PV, giro: -90, acoes: [{ clip: 'lutar', de: C(7), ate: C(8), expressao: 'angry', velocidade: 1.3 }] }),
    coruja({ pos: add3(PV, [-1.05, 0, 0.1]), giro: 90, anim: { opacidade: [[C(7), 0.18], [T_GC, 0.18], [r2(T_GC + 0.15), 1]] },
      acoes: [{ clip: 'surprised', de: C(7), ate: T_GC }, { clip: 'tonto_no_chao', de: r2(T_GC + 0.1), ate: C(8), suavizacao: 0.08 }] }),
  ],
  efeitos: [{ tipo: 'tremor', de: T_GC, ate: r2(T_GC + 0.4), intensidade: 0.7 }],
  elementos: [{ tipo: 'icone', icone: 'estrela', ancora: 'coruja', alturaRel: 0.8, tamanho: 0.16, de: T_GC, ate: C(8) }],
  camera: { tipo: 'enquadrar', alvo: 'vovo', plano: 'medio', angulo: -60, deriva: 15, elevacao: 8, fov: 44, olhaDesloca: [-0.5, 0, 0] },
});

// =============== DICA 3: esquece a rua ===============
add(C(8), C(9), {
  ambiente: RUA,
  objetos: rua(),
  personagens: [
    aranha({ pos: [-0.8, 0, 1.4], giro: 20, acoes: [{ clip: 'tonto_no_chao', de: C(8), ate: C(9) }] }),
    coruja({ pos: [0.6, 0, 1.6], giro: -30, acoes: [{ clip: 'tonto_no_chao', de: C(8), ate: C(9), fase: 0.4 }] }),
    vovo({ pos: [1.6, 0, 0.4], giro: 90, movimentos: [{ de: C(8), ate: C(9), para: [5, 0.2], clip: 'walk' }] }),
  ],
  camera: { tipo: 'travelling', de: { pos: [0, 3.2, 4.6], olha: [0, 0.3, 1.2] }, para: { pos: [0, 7.5, 6.5], olha: [0.4, 0, 1.0] }, fov: 46 },
  textos: [selo('DICA 3', C(8), C(9))],
});

// abre uma associação
const T_PLACA = W('associação', F[10][0]);
add(C(9), C(10), {
  transicao: 'flash',
  ambiente: RUA,
  objetos: [{ id: 'loja', asset: 'loja', pos: [0, 0, -2], params: { wall: '#f4f1e8', awning: '#1f8a5b', sign: '#1f8a5b' } },
    { id: 'placaAssoc', asset: 'placa', pos: [0, 0, 2.6], aparece: T_PLACA, params: { texto: 'ASSOCIAÇÃO', sub: 'dos Aposentados Felizes', largura: 3.2, altura: 1.1, fundo: '#1f8a5b', alturaPoste: 1.6 } },
    { id: 'arvore', asset: 'arvore_redonda', pos: [-6, 0, -1] }],
  personagens: [
    aranha({ pos: [-2.4, 0, 3.4], giro: 20, acoes: [{ clip: 'cheer', de: T_PLACA, ate: C(10) }] }),
    coruja({ pos: [2.4, 0, 3.4], giro: -20, acoes: [{ clip: 'nod', de: T_PLACA, ate: C(10) }] }),
  ],
  fluxos: [{ material: 'luz', origem: [0, 2.3, 2.7], destino: [0, 4, 3], taxa: 30, tamanho: 0.05, espalha: 1.5, de: T_PLACA, ate: r2(T_PLACA + 0.6) }],
  camera: { tipo: 'travelling', de: { pos: [0, 1.4, 11], olha: [0, 1.8, 1] }, para: { pos: [0, 1.6, 9.2], olha: [0, 2.0, 1] }, fov: 46 },
});

// chama o Major Cometa (pousa voando)
const T12b = W('e', W('inss', F[11][0]));
const PM = [0, 0, 4.2];
add(C(10), T12b, {
  ambiente: RUA,
  objetos: [{ id: 'loja', asset: 'loja', pos: [0, 0, -2], params: { wall: '#f4f1e8', awning: '#1f8a5b', sign: '#1f8a5b' } },
    { id: 'placaAssoc', asset: 'placa', pos: [0, 0, 2.6], params: { texto: 'ASSOCIAÇÃO', sub: 'dos Aposentados Felizes', largura: 3.2, altura: 1.1, fundo: '#1f8a5b', alturaPoste: 1.6 } }],
  personagens: [
    cometa({ pos: add3(PM, [-9, 7, 4]), giro: 120, anim: { pos: [[C(10), add3(PM, [-9, 7, 4])], [r2(C(10) + 1.3), add3(PM, [-0.3, 0.6, 0.2])], [r2(C(10) + 1.6), PM]] },
      acoes: [{ clip: 'voar', de: C(10), ate: r2(C(10) + 1.3) }, { clip: 'aterrissagem_heroica', de: r2(C(10) + 1.3), ate: T12b }] }),
  ],
  fluxos: [{ material: 'ar', origem: { ancora: 'cometa', desloca: [0, 1, -0.8] }, taxa: 22, de: C(10), ate: r2(C(10) + 1.3) },
    { material: 'poeira', origem: add3(PM, [0, 0.1, 0]), taxa: 40, tamanho: 0.5, de: r2(C(10) + 1.5), ate: r2(C(10) + 1.9) }],
  efeitos: [{ tipo: 'tremor', de: r2(C(10) + 1.55), ate: r2(C(10) + 1.9), intensidade: 0.5 }],
  camera: { tipo: 'travelling', de: { pos: [3.5, 1.4, 12.5], olha: [-1.5, 2.5, 4] }, para: { pos: [2.5, 1.3, 10.5], olha: [0, 1.2, 4] }, fov: 52 },
});

// assina o acordo e o dinheiro passa a cair direto
const T_ASS = r2(T12b + 0.2);
add(T12b, C(11), {
  ambiente: SALA,
  objetos: [...escritorio(),
    { id: 'contrato', asset: 'placa', pos: [-0.2, TAMPO, 0.05], params: { texto: 'ACORDO', sub: 'INSS  ✕  Associação', largura: 0.9, altura: 0.6, fundo: '#ffffff', cor: '#1f4e9c', poste: false } },
    { id: 'carimbo', asset: 'carimbo', pos: [0.55, TAMPO, 0.2], params: { tamanho: 2.2 }, anim: { pos: [[T_ASS, [0.55, TAMPO + 0.4, 0.2]], [r2(T_ASS + 0.2), [0.0, TAMPO + 0.6, 0.2]], [r2(T_ASS + 0.35), [-0.2, TAMPO, 0.25]], [r2(T_ASS + 0.6), [0.55, TAMPO + 0.3, 0.2]]] } }],
  personagens: [cometa({ pos: [0.2, 0, -0.95], giro: 0, acoes: [{ clip: 'hammer', de: T12b, ate: C(11), velocidade: 1.4 }] })],
  fluxos: [{ material: 'moeda', origem: [3.2, 3.2, -0.6], destino: [2.6, 1.3, -0.5], taxa: 14, de: r2(T_ASS + 1.2), ate: C(11), arco: 0.2 }],
  elementos: [{ tipo: 'icone', icone: 'dinheiro', ancora: 'cofre', alturaRel: 1.3, tamanho: 0.14, de: r2(T_ASS + 1.4), ate: C(11), pulsa: true }],
  camera: { tipo: 'enquadrar', alvo: 'mesa', plano: 'medio', angulo: 15, deriva: 20, elevacao: 22, fov: 44 },
});

// a regra: autorização de cada aposentado
add(C(11), C(12), {
  ambiente: SALA,
  objetos: [...escritorio(), { id: 'regra', asset: 'placa', pos: [0, TAMPO, 0.1], aparece: r2(C(11) + 0.2), params: { texto: 'REGRA', sub: 'só com autorização do aposentado', largura: 1.6, altura: 0.8, fundo: '#c81e1e', poste: false } }],
  personagens: [
    cometa({ pos: [-1.5, 0, 0.9], giro: 20, acoes: [{ clip: 'surprised', de: C(11), ate: C(12) }] }),
    coruja({ pos: [1.5, 0, 0.9], giro: -20, acoes: [{ clip: 'shrug', de: C(11), ate: C(12) }] }),
  ],
  elementos: [{ tipo: 'icone', icone: 'proibido', pos: [0.5, 0.3], tamanho: 0.18, de: r2(C(11) + 0.5), ate: C(12) }],
  camera: { tipo: 'travelling', de: { pos: [0.4, 1.6, 4.6], olha: [0, 1.0, 0] }, para: { pos: [0.1, 1.5, 3.8], olha: [0, 1.0, 0] }, fov: 50 },
});

// assinatura e biometria (a vovó em casa)
add(C(12), C(13), {
  ambiente: RUA,
  objetos: [{ id: 'casa', asset: 'casa_simples', variante: 'amarela', pos: [0, 0, -4.5] }, { id: 'arvore', asset: 'arvore_redonda', pos: [-5, 0, -2] },
    { id: 'cel', asset: 'celular', pos: [0.45, 0.95, 1.1], params: { tamanho: 3, texto: 'Assinatura e biometria', tela: '#dbe9ff' }, anim: { oscila: { eixo: 'y', amp: 0.03, freq: 0.7 } } }],
  personagens: [vovo({ pos: [0, 0, 0.8], giro: 0, acoes: [{ clip: 'point', de: C(12), ate: C(13), params: { dir: 'forward' } }] })],
  elementos: [etiqueta('✍️ assinatura', { pos: [0.3, 0.27], de: r2(F[13][0]) }), etiqueta('🖐️ biometria', { pos: [0.7, 0.33], de: W('biometria', F[13][0]) })],
  camera: { tipo: 'enquadrar', alvo: 'vovo', plano: 'medio', angulo: 20, deriva: -10, elevacao: 6, fov: 42 },
});

// =============== DICA 4: fabrica ===============
add(C(13), C(14), {
  ambiente: SALA,
  objetos: [...escritorio(), { id: 'pilha', asset: 'pilha_papeis', pos: [0, TAMPO, 0], etapa: [[C(13), 0.1], [C(14), 0.6]] }],
  personagens: [cometa({ pos: [0, 0, 1.6], giro: 0, anim: { pos: [[C(13), [1.6, 0, 1.4]], [r2(C(13) + 0.4), [-1.6, 0, 1.4]], [r2(C(13) + 0.8), [1.6, 0, 1.0]], [C(14), [-1.6, 0, 1.4]]], suave: false },
    acoes: [{ clip: 'run', de: C(13), ate: C(14), velocidade: 2.4 }] })],
  fluxos: [{ material: 'papel', origem: { ancora: 'cometa', desloca: [0, 1.2, 0] }, taxa: 30, espalha: 1.2, dispersao: 0.5 },
    { material: 'ar', origem: { ancora: 'cometa', desloca: [0, 1, -0.5] }, taxa: 20 }],
  camera: { tipo: 'enquadrar', alvo: 'mesa', plano: 'geral', angulo: 0, elevacao: 18, fov: 50 },
  textos: [selo('DICA 4', C(13), C(14))],
});

const T_AUDIO = W('áudio', F[15][0]);
add(C(14), C(15), {
  ambiente: SALA,
  objetos: [...escritorio(), { id: 'pilha', asset: 'pilha_papeis', pos: [-0.3, TAMPO, 0], etapa: [[C(14), 0.6], [C(15), 1]] },
    { id: 'carimbo', asset: 'carimbo', pos: [0.4, TAMPO, 0.15], params: { tamanho: 2.2 }, anim: { oscila: { eixo: 'y', amp: 0.12, freq: 4 } } },
    { id: 'som', asset: 'ondas_som', pos: [1.0, TAMPO + 0.1, 0.2], aparece: T_AUDIO, params: { raio: 0.35, ondas: 5, altura: 0.25 } }],
  fluxos: [{ material: 'papel', origem: [-0.3, TAMPO + 1.5, 0], destino: [-0.3, TAMPO + 0.5, 0], taxa: 12, espalha: 0.4 }],
  elementos: [
    etiqueta('assinatura falsa', { pos: [0.5, 0.2], ponto: '#e5322d', de: r2(F[15][0]) }),
    etiqueta('documento falso', { pos: [0.5, 0.27], ponto: '#e5322d', de: W('documento', F[15][0]) }),
    etiqueta('áudio falso 🎙️', { pos: [0.5, 0.34], ponto: '#e5322d', de: T_AUDIO }),
  ],
  camera: { tipo: 'travelling', de: { pos: [0.9, 1.6, 1.6], olha: [0, 0.95, 0] }, para: { pos: [0.5, 1.4, 1.2], olha: [0, 0.95, 0] }, fov: 46 },
});

// =============== DICA 5: promete tudo ===============
const P5 = F[16][0];
add(C(15), C(16), {
  ambiente: RUA,
  objetos: [{ id: 'loja', asset: 'loja', pos: [0, 0, -3], params: { wall: '#f4f1e8', awning: '#1f8a5b', sign: '#1f8a5b' } },
    { id: 'p1', asset: 'placa', pos: [-2.4, 0, 0.5], giro: 15, aparece: W('academia', P5), params: { texto: '🏋️ ACADEMIA', largura: 1.8, altura: 0.6, fundo: '#ff8a1f', alturaPoste: 1.1 } },
    { id: 'p2', asset: 'placa', pos: [0, 0, 0], aparece: W('advogado', P5), params: { texto: '⚖️ ADVOGADO', largura: 1.8, altura: 0.6, fundo: '#6b3fa0', alturaPoste: 1.6 } },
    { id: 'p3', asset: 'placa', pos: [2.4, 0, 0.5], giro: -15, aparece: W('plano', P5), params: { texto: '🏥 PLANO DE SAÚDE', largura: 2, altura: 0.6, fundo: '#1f8a5b', alturaPoste: 1.1 } }],
  personagens: [aranha({ pos: [0, 0, 2.2], giro: 0, acoes: [{ clip: 'talk', de: C(15), ate: C(16), fala: true }] })],
  camera: { tipo: 'travelling', de: { pos: [0, 1.2, 9.5], olha: [0, 1.4, 0.5] }, para: { pos: [0, 1.4, 7.5], olha: [0, 1.5, 0.5] }, fov: 48 },
  textos: [selo('DICA 5', C(15), C(16))],
});

// a vovó nunca vai usar / nem sabe que é sócia (em casa, de crochê)
add(C(16), C(17), {
  ambiente: SALA,
  objetos: [{ id: 'sofa', asset: 'forma', pos: [0, 0, -0.3], params: { tamanho: [2, 0.45, 0.9], cor: '#7b5ea8' } }, { id: 'encosto', asset: 'forma', pos: [0, 0, -0.75], params: { tamanho: [2, 1.0, 0.2], cor: '#6a4f94' } },
    { id: 'tv', asset: 'forma', pos: [0, 0, 3.2], params: { tamanho: [1.2, 0.9, 0.3], cor: '#22252b' } },
    { id: 'mesinha', asset: 'forma', pos: [1.5, 0, 0.1], params: { tamanho: [0.6, 0.5, 0.6], cor: '#a9743f' } }, { id: 'xicara', asset: 'forma', pos: [1.5, 0.5, 0.1], params: { tipo: 'cilindro', tamanho: [0.16, 0.14, 0.16], cor: '#ffffff' } }],
  fluxos: [{ material: 'vapor', origem: [1.5, 0.66, 0.1], taxa: 5, tamanho: 0.08, subida: 0.6 }],
  personagens: [vovo({ pos: [0, 0.11, -0.25], giro: 0, acoes: [{ clip: 'sit', de: C(16), ate: C(17) }, { clip: 'shake_head', de: r2(C(16) + 0.4), ate: C(17), camada: 1, mascara: ['head', 'face'] }] })],
  elementos: [{ tipo: 'icone', icone: 'x', pos: [0.25, 0.28], tamanho: 0.14, de: r2(C(16) + 0.3) }, etiqueta('academia? nunca fui', { pos: [0.6, 0.25], ponto: '#e5322d', de: r2(C(16) + 0.3) })],
  camera: { tipo: 'enquadrar', alvo: 'vovo', plano: 'medio', angulo: -20, deriva: 15, elevacao: 8, fov: 44 },
});

add(C(17), C(18), {
  ambiente: SALA,
  objetos: [{ id: 'sofa', asset: 'forma', pos: [0, 0, -0.3], params: { tamanho: [2, 0.45, 0.9], cor: '#7b5ea8' } }, { id: 'encosto', asset: 'forma', pos: [0, 0, -0.75], params: { tamanho: [2, 1.0, 0.2], cor: '#6a4f94' } },
    { id: 'carteirinha', asset: 'placa', pos: [0.75, 1.05, 0.5], giro: -10, aparece: r2(C(17) + 0.3), params: { texto: 'SÓCIA Nº 4.817.302', sub: 'Associação dos Aposentados Felizes', largura: 0.9, altura: 0.5, fundo: '#ffffff', cor: '#1f8a5b', poste: false } }],
  personagens: [vovo({ pos: [0, 0.11, -0.25], giro: 0, acoes: [{ clip: 'sit', de: C(17), ate: C(18) }, { clip: 'shrug', de: r2(C(17) + 0.3), ate: C(18), camada: 1, mascara: ['head', 'face', 'armL', 'armR'] }] })],
  elementos: [{ tipo: 'icone', icone: 'interrogacao', ancora: 'vovo', alturaRel: 1.2, tamanho: 0.15, de: r2(C(17) + 0.3), pulsa: true }],
  camera: { tipo: 'enquadrar', alvo: 'vovo', plano: 'close', angulo: 25, deriva: -10, elevacao: 4, fov: 40 },
});

// =============== DICA 6: desconta pouquinho ===============
const LINHAS = ['Aposentadoria ........ + R$ 1.518,00', 'Remédio .............. − R$ 89,90', 'MENSALIDADE ASSOCIATIVA  − R$ 45,00', 'Saldo ................ R$ 1.383,10'];
const extrato = (extra) => ({ id: 'extrato', asset: 'extrato', pos: [0, 0, 0], params: { linhas: LINHAS, destaque: 2 }, ...extra });
add(C(18), C(19), {
  ambiente: SALA,
  objetos: [extrato({ etapa: [[C(18), 0.25], [r2(C(18) + 1.6), 1]] })],
  personagens: [coruja({ pos: [-1.9, 0, 0.8], giro: 30, acoes: [{ clip: 'point', de: C(18), ate: C(19) }] })],
  fluxos: [{ material: 'moeda', origem: [1.0, 1.95, 0.1], destino: [2.6, 0.2, 0.8], taxa: 6, de: r2(C(18) + 1.5), ate: C(19) }],
  camera: { tipo: 'travelling', de: { pos: [0.6, 2.4, 6.2], olha: [0, 2.2, 0] }, para: { pos: [0.3, 2.3, 5.2], olha: [0, 2.2, 0] }, fov: 46 },
  textos: [selo('DICA 6', C(18), C(19))],
});

add(C(19), C(20), {
  ambiente: SALA,
  objetos: [extrato({ etapa: [[C(19), 0.75], [r2(C(19) + 0.35), 1]] })],
  fluxos: [{ material: 'moeda', origem: [1.05, 1.95, 0.1], destino: [3.0, 1.4, 0.8], taxa: 10 }],
  elementos: [{ tipo: 'seta', direcao: 'direita', pos: [0.14, 0.5], tamanho: 0.14, cor: '#e5322d' }],
  efeitos: [{ tipo: 'zoom', de: C(19), ate: C(20), para: 1.18 }],
  camera: { tipo: 'travelling', de: { pos: [0.1, 1.95, 2.3], olha: [0, 1.95, 0] }, para: { pos: [0.05, 1.95, 1.9], olha: [0, 1.95, 0] }, fov: 50 },
});

// =============== multiplica por milhões ===============
const COFRE_G = [0, 0, 0];
const multidao = [];
for (let i = 0; i < 14; i++) {
  const a = (i / 14) * Math.PI * 2;
  const r = 6 + (i % 3) * 1.6;
  multidao.push({ id: `v${i}`, preset: i % 2 ? 'velhinho' : 'velhinha', overrides: TRACO, pos: [r2(Math.cos(a) * r), 0, r2(Math.sin(a) * r)], viraPara: [{ em: 0, alvo: [0, 0] }],
    acoes: [{ clip: i % 3 ? 'idle' : 'look_around', de: 0, ate: 999, fase: i * 0.3 }] });
}
add(C(20), C(21), {
  ambiente: RUA,
  objetos: [{ id: 'cofre', asset: 'cofre', pos: COFRE_G, params: { tamanho: 2.2, progress: 0.3 } }],
  personagens: multidao.map((m) => ({ ...m, acoes: [], movimentos: [{ de: C(20), ate: C(21), para: [r2(m.pos[0] * 0.8), r2(m.pos[2] * 0.8)], clip: 'walk', velocidade: 0.7 }] })),
  fluxos: multidao.filter((_, i) => i % 2 === 0).map((m) => ({ material: 'moeda', origem: add3(m.pos, [0, 1.1, 0]), destino: [0, 2.0, 0], taxa: 5, arco: 0.6 })),
  camera: { tipo: 'travelling', de: { pos: [0, 9, 14], olha: [0, 0.8, 0] }, para: { pos: [5, 16, 13], olha: [0, 0.5, 0] }, fov: 50 },
});

// 2019–2024: o cofre enche
const T_BI = W('seis', F[22][0]);
add(C(21), T_BI, {
  ambiente: SALA,
  objetos: [...escritorio().filter((o) => o.id !== 'cofre'), { id: 'cofre', asset: 'cofre', pos: [0, 0, 0.6], params: { tamanho: 1.6 }, etapa: [[C(21), 0.3], [T_BI, 0.9]] }],
  personagens: [
    aranha({ pos: [-1.6, 0, 1.6], giro: 40, acoes: [{ clip: 'cheer', de: C(21), ate: T_BI }] }),
    cometa({ pos: [1.6, 0, 1.6], giro: -40, acoes: [{ clip: 'cheer', de: C(21), ate: T_BI, fase: 0.3 }] }),
  ],
  fluxos: [{ material: 'moeda', origem: [0, 3.2, 0.6], destino: [0, 1.4, 0.7], taxa: 20, espalha: 0.3 }],
  elementos: [etiqueta('2019 → 2024', { pos: [0.5, 0.2], tamanho: 1.4 })],
  camera: { tipo: 'enquadrar', alvo: 'cofre', plano: 'geral', angulo: 0, deriva: 25, elevacao: 14, fov: 48 },
});

add(T_BI, C(22), {
  ambiente: SALA,
  objetos: [{ id: 'cofre', asset: 'cofre', pos: [0, 0, 0.6], params: { tamanho: 1.6, progress: 1 }, anim: { pulsa: 0.03 } }],
  fluxos: [{ material: 'nota', origem: [0, 3.5, 0.9], destino: [0, 0.2, 1.6], taxa: 26, espalha: 1.6 }, { material: 'moeda', origem: [0, 1.4, 1.3], destino: [0.6, 0.1, 2.4], taxa: 14 }],
  efeitos: [{ tipo: 'zoom', de: T_BI, ate: C(22), para: 1.12 }],
  camera: { tipo: 'travelling', de: { pos: [0.4, 0.5, 5.6], olha: [0, 1.3, 0.6] }, para: { pos: [0.2, 0.45, 4.6], olha: [0, 1.4, 0.6] }, fov: 50 },
  textos: [{ texto: 'R$ *6,3*|*BILHÕES*', de: r2(T_BI + 0.2), ate: C(22), estilo: 'manchete' }],
});

// =============== a virada: só esqueceram de um detalhe ===============
add(C(22), C(23), {
  ambiente: SALA,
  objetos: [...escritorio().filter((o) => o.id !== 'cofre'), { id: 'cofre', asset: 'cofre', pos: [0, 0, 0.6], params: { tamanho: 1.6, progress: 1 } }],
  personagens: [
    aranha({ pos: [-1.4, 0, 1.8], giro: 20, acoes: [{ clip: 'cheer', de: C(22), ate: r2(C(22) + 0.5) }, { clip: 'surprised', de: r2(C(22) + 0.5), ate: C(23) }] }),
    coruja({ pos: [0, 0, 2.2], giro: 0, acoes: [{ clip: 'surprised', de: r2(C(22) + 0.4), ate: C(23) }] }),
    cometa({ pos: [1.4, 0, 1.8], giro: -20, acoes: [{ clip: 'cheer', de: C(22), ate: r2(C(22) + 0.6) }, { clip: 'surprised', de: r2(C(22) + 0.6), ate: C(23) }] }),
  ],
  fluxos: [{ material: 'nota', origem: [0, 3.2, 1.0], destino: [0, 0.1, 2.0], taxa: 10, espalha: 1.8, de: C(22), ate: r2(C(22) + 0.6) }],
  efeitos: [{ tipo: 'pretoebranco', de: r2(C(22) + 0.4), ate: C(23), zoom: 1.12 }],
  elementos: [{ tipo: 'icone', icone: 'alerta', pos: [0.5, 0.24], tamanho: 0.18, de: r2(C(22) + 0.4), pulsa: true }],
  camera: { tipo: 'enquadrar', alvo: 'coruja', plano: 'medio', angulo: 0, elevacao: 4, fov: 50, aproxima: 0.8 },
});

// a CGU bate na porta
const T_PERG = W('o', W('perguntou', F[24][0]));
add(C(23), C(24), {
  ambiente: RUA,
  objetos: [{ id: 'casa', asset: 'casa_simples', variante: 'amarela', pos: [0, 0, -4.5] }, { id: 'arvore', asset: 'arvore_redonda', pos: [-5, 0, -2] }, { id: 'cerca', asset: 'cerca', pos: [3.5, 0, 0], params: { length: 4 } }],
  personagens: [
    { id: 'cgu', preset: 'engenheira', overrides: { ...TRACO, hat: { type: 'none' }, top: { color: '#1f4e9c', sleeves: 'long' } }, pos: [-1.6, 0, 1.8], giro: 0,
      movimentos: [{ de: C(23), ate: r2(C(23) + 1.6), para: [-0.7, 0.2], clip: 'walk' }], viraPara: [{ em: r2(C(23) + 1.6), alvo: [0.5, 0] }], acoes: [{ clip: 'read_clipboard', de: r2(C(23) + 1.6), ate: T_PERG }, { clip: 'talk', de: T_PERG, ate: C(24) }] },
    vovo({ pos: [0.6, 0, -0.8], giro: 0, viraPara: [{ em: r2(C(23) + 1.6), alvo: [-0.7, 0.2] }], acoes: [{ clip: 'idle', de: C(23), ate: T_PERG }, { clip: 'shake_head', de: r2(T_PERG + 0.4), ate: C(24), expressao: 'angry' }] }),
  ],
  elementos: [etiqueta('CGU · 1.300 entrevistas', { pos: [0.5, 0.2], ponto: '#1f4e9c', de: W('mil', F[24][0]) }), { tipo: 'icone', icone: 'x', pos: [0.75, 0.32], tamanho: 0.13, de: r2(T_PERG + 0.6) }],
  camera: { tipo: 'travelling', de: { pos: [3.6, 1.5, 5.2], olha: [-0.2, 1.1, 0] }, para: { pos: [2.4, 1.4, 3.6], olha: [-0.1, 1.2, -0.2] }, fov: 46 },
});

// abril de 2025: a viatura chega
const VIAT = (extra) => ({ id: 'viatura', asset: 'viatura', pos: [0, 0, 0], giro: 90, ...extra });
const RUA_ASSOC = () => [{ id: 'loja', asset: 'loja', pos: [0, 0, -4], params: { wall: '#f4f1e8', awning: '#1f8a5b', sign: '#1f8a5b' } },
  { id: 'placaAssoc', asset: 'placa', pos: [0, 0, 0.6], params: { texto: 'ASSOCIAÇÃO', sub: 'dos Aposentados Felizes', largura: 3.2, altura: 1.1, fundo: '#1f8a5b', alturaPoste: 1.6 } },
  { id: 'arvore', asset: 'arvore_redonda', pos: [-6, 0, -2] }];
add(C(24), C(25), {
  transicao: 'flash',
  ambiente: TARDE,
  objetos: [...RUA_ASSOC(), VIAT({ pos: [-16, 0, 3.6], anim: { pos: [[C(24), [-16, 0, 3.6]], [r2(C(25) - 0.2), [-1.2, 0, 3.6]]] } })],
  fluxos: [{ material: 'poeira', origem: { ancora: 'viatura', desloca: [0, 0.2, -2.2] }, taxa: 14, tamanho: 0.5 }],
  camera: { tipo: 'travelling', de: { pos: [3, 0.6, 9.5], olha: [-4, 0.9, 3.6] }, para: { pos: [2.5, 0.7, 8.5], olha: [-1.5, 1.0, 3.6] }, fov: 48 },
  textos: [selo('ABRIL DE 2025', r2(F[25][0]), C(25))],
});

add(C(25), C(26), {
  ambiente: TARDE,
  objetos: [...RUA_ASSOC(), VIAT({ pos: [-1.2, 0, 3.6] })],
  fluxos: [{ material: 'fumaca', origem: [-3.6, 0.3, 3.6], taxa: 4, tamanho: 0.5 }],
  personagens: [agente('pf1', { pos: [-0.2, 0, 5.4], giro: 180, movimentos: [{ de: C(25), ate: C(26), para: [-0.2, 1.8], clip: 'run' }] })],
  efeitos: [{ tipo: 'zoom', de: C(25), ate: C(26), para: 1.1 }],
  camera: { tipo: 'enquadrar', alvo: 'viatura', plano: 'medio', angulo: 200, deriva: -30, elevacao: 6, fov: 48 },
  textos: [{ texto: 'OPERAÇÃO|*SEM DESCONTO*', de: r2(C(25) + 0.05), ate: C(26), estilo: 'manchete' }],
});

// PF na porta, acordos suspensos, bens bloqueados
const P27 = F[27][0];
add(C(26), C(27), {
  ambiente: TARDE,
  objetos: [{ id: 'loja', asset: 'loja', pos: [0, 0, -4], params: { wall: '#f4f1e8', awning: '#1f8a5b', sign: '#1f8a5b' } },
    { id: 'placaAssoc', asset: 'placa', pos: [0, 0, 0.6], params: { texto: 'ASSOCIAÇÃO', sub: 'dos Aposentados Felizes', largura: 3.2, altura: 1.1, fundo: '#1f8a5b', alturaPoste: 1.6 },
      anim: { giro: [[W('acordos', P27), 0], [r2(W('acordos', P27) + 0.5), -80]], eixo: 'z' } },
    { id: 'b1', asset: 'barreira', pos: [-2.2, 0, 2.4], aparece: W('bens', P27) }, { id: 'b2', asset: 'barreira', pos: [2.2, 0, 2.4], aparece: W('bens', P27) },
    { id: 'bloq', asset: 'placa', pos: [0, 0, 2.6], aparece: W('bloqueados', P27), params: { texto: 'BLOQUEADO', largura: 2.2, altura: 0.6, fundo: '#c81e1e', alturaPoste: 0.9 } },
    VIAT({ pos: [-7, 0, 5.5], giro: 60 })],
  personagens: [agente('pf1', { pos: [-0.9, 0, -1.2], giro: 180, acoes: [{ clip: 'point', de: C(26), ate: C(27) }] }), agente('pf2', { pos: [0.9, 0, -1.4], giro: 180, acoes: [{ clip: 'hammer', de: C(26), ate: C(27), velocidade: 1.6 }] })],
  elementos: [etiqueta('acordos suspensos', { pos: [0.5, 0.2], ponto: '#e5322d', de: W('acordos', P27) })],
  camera: { tipo: 'travelling', de: { pos: [3.5, 1.6, 8], olha: [0, 1.4, -1] }, para: { pos: [1.8, 1.5, 6.5], olha: [0, 1.3, -0.5] }, fov: 50 },
});

// dinheiro vivo em saco de lixo
const T_SACO = W('saco', F[28][0]);
add(C(27), C(28), {
  ambiente: SALA,
  objetos: [{ id: 'saco', asset: 'saco_lixo', pos: [0, 0, 0], params: { tamanho: 1.3 }, etapa: [[r2(T_SACO - 0.3), 0], [r2(T_SACO + 0.8), 1]] }, { id: 'saco2', asset: 'saco_lixo', pos: [-1.1, 0, -0.6] }, { id: 'armario', asset: 'forma', pos: [0.4, 0, -1.6], params: { tamanho: [2.4, 2, 0.6], cor: '#b9a27f' } }],
  personagens: [agente('pf1', { pos: [1.3, 0, 0.6], giro: -110, acoes: [{ clip: 'crouch', de: C(27), ate: C(28) }] })],
  fluxos: [{ material: 'nota', origem: [0, 1.2, 0.1], destino: [0.3, 0.1, 1.0], taxa: 18, espalha: 1.4, de: T_SACO, ate: C(28) }],
  elementos: [{ tipo: 'icone', icone: 'dinheiro', ancora: 'saco', alturaRel: 1.4, tamanho: 0.15, de: T_SACO, pulsa: true }],
  camera: { tipo: 'travelling', de: { pos: [1.6, 2.0, 4.4], olha: [0.2, 0.6, 0] }, para: { pos: [0.9, 1.7, 3.6], olha: [0.2, 0.5, 0] }, fov: 50 },
});

// os três viram réus
const PLAQ = (id, x) => ({ id, asset: 'placa', variante: 'reu', pos: [x, 0.95, 1.33], anim: { oscila: { eixo: 'y', amp: 0.015, freq: 0.6 } } });
add(C(28), C(29), {
  ambiente: TARDE,
  objetos: [{ id: 'muro', asset: 'muro', variante: 'cinza', pos: [0, 0, -0.6], params: { length: 6, height: 2.6 } }, VIAT({ pos: [5.5, 0, 2.5], giro: -30 }), PLAQ('r1', -1.2), PLAQ('r2', 0), PLAQ('r3', 1.2)],
  personagens: [
    aranha({ pos: [-1.2, 0, 1.0], giro: 0, acoes: [{ clip: 'idle', de: C(28), ate: C(29), expressao: 'sad' }] }),
    coruja({ pos: [0, 0, 1.0], giro: 0, acoes: [{ clip: 'idle', de: C(28), ate: C(29), expressao: 'sad', fase: 0.3 }] }),
    cometa({ pos: [1.2, 0, 1.0], giro: 0, acoes: [{ clip: 'idle', de: C(28), ate: C(29), expressao: 'sad', fase: 0.6 }] }),
  ],
  fluxos: [{ material: 'luz', origem: [5.5, 2.0, 2.5], destino: [5.5, 3.2, 2.5], taxa: 8, tamanho: 0.06 }],
  efeitos: [{ tipo: 'zoom', de: C(28), ate: C(29), para: 1.1 }],
  camera: { tipo: 'travelling', de: { pos: [0, 1.4, 8.6], olha: [0, 1.1, 1] }, para: { pos: [0, 1.35, 7.4], olha: [0, 1.1, 1] }, fov: 48 },
});

// =============== a parte que quase ninguém conta ===============
const T31b = W('e', W('volta', F[30][0]));
add(C(29), T31b, {
  ambiente: RUA,
  objetos: [{ id: 'inss', asset: 'placa', variante: 'inss', pos: [0, 0, -3] }, { id: 'predio', asset: 'predio_apartamentos', pos: [0, 0, -14], params: { floors: 4 } }],
  personagens: multidao.slice(0, 10).map((m, i) => ({ ...m, pos: [r2(-4 + (i % 5) * 2), 0, r2(1 + Math.floor(i / 5) * 1.6)], viraPara: [{ em: C(29), alvo: [0, -3] }],
    acoes: [{ clip: i % 2 ? 'wave' : 'point', de: C(29), ate: T31b, fase: i * 0.2 }] })),
  fluxos: [{ material: 'papel', origem: [0, 2.0, 2.0], destino: [0, 2.2, -3], taxa: 14, espalha: 3 }],
  elementos: [etiqueta('+ de 6 milhões pediram de volta', { pos: [0.5, 0.22], tamanho: 1.3, de: W('mais', F[30][0]) })],
  camera: { tipo: 'travelling', de: { pos: [0, 2.2, 9.5], olha: [0, 1.4, -1] }, para: { pos: [0, 3.2, 8.5], olha: [0, 1.2, -1] }, fov: 50 },
});

add(T31b, C(30), {
  ambiente: RUA,
  objetos: [{ id: 'gov', asset: 'cofre', pos: [0, 0, -1.2], params: { tamanho: 2, progress: 1 } }, { id: 'rot', asset: 'placa', pos: [0, 2.1, -1.4], params: { texto: 'GOVERNO', largura: 2.2, altura: 0.6, fundo: '#1f4e9c', poste: false } }],
  personagens: [vovo({ pos: [1.6, 0, 1.4], giro: -40, acoes: [{ clip: 'cheer', de: T31b, ate: C(30) }] })],
  fluxos: [{ material: 'moeda', origem: [0.2, 1.2, -0.4], destino: [1.6, 1.3, 1.4], taxa: 18 }],
  elementos: [etiqueta('R$ 3,6 bilhões devolvidos', { pos: [0.5, 0.22], tamanho: 1.3, ponto: '#5fbf6a', de: W('três', T31b) })],
  camera: { tipo: 'enquadrar', alvo: 'gov', plano: 'geral', angulo: 25, deriva: -15, elevacao: 10, fov: 48 },
});

// com dinheiro público
const T_VOCE = W('quem', F[32][0]);
add(C(30), T_VOCE, {
  ambiente: RUA,
  objetos: [{ id: 'gov', asset: 'cofre', pos: [0, 0, -1.2], params: { tamanho: 2 }, etapa: [[C(30), 0.4], [C(31), 1]] }, { id: 'rot', asset: 'placa', pos: [0, 2.1, -1.4], params: { texto: 'IMPOSTOS', largura: 2.2, altura: 0.6, fundo: '#c81e1e', poste: false } }],
  personagens: [
    { id: 'h1', preset: 'homem', overrides: TRACO, pos: [-3, 0, 2.5], viraPara: [{ em: 0, alvo: [0, -1.2] }], acoes: [{ clip: 'shrug', de: C(30), ate: T_VOCE }] },
    { id: 'm1', preset: 'mulher', overrides: TRACO, pos: [3, 0, 2.5], viraPara: [{ em: 0, alvo: [0, -1.2] }], acoes: [{ clip: 'shrug', de: C(30), ate: T_VOCE }] },
    { id: 'c1', preset: 'motorista', overrides: TRACO, pos: [0, 0, 3.6], viraPara: [{ em: 0, alvo: [0, -1.2] }], acoes: [{ clip: 'shrug', de: C(30), ate: T_VOCE }] },
  ],
  fluxos: [{ material: 'moeda', origem: [-3, 1.2, 2.5], destino: [0, 2.1, -1], taxa: 10 }, { material: 'moeda', origem: [3, 1.2, 2.5], destino: [0, 2.1, -1], taxa: 10 }, { material: 'moeda', origem: [0, 1.2, 3.6], destino: [0, 2.1, -1], taxa: 10 }],
  camera: { tipo: 'travelling', de: { pos: [0, 4, 9.5], olha: [0, 1, 0] }, para: { pos: [0, 2.2, 8], olha: [0, 1.2, 0] }, fov: 50 },
});

// quem pagou foi você
add(T_VOCE, C(32), {
  ambiente: TARDE,
  objetos: [{ id: 'muro', asset: 'muro', variante: 'cinza', pos: [0, 0, -1.2], params: { length: 6, height: 2.6 } }],
  personagens: [coruja({ pos: [0, 0, 0], giro: 0, acoes: [{ clip: 'point', de: r2(T_VOCE + 0.1), ate: C(32), params: { dir: 'forward' } }] })],
  fluxos: [{ material: 'ar', origem: [0.35, 1.35, 0.5], destino: [0.4, 1.4, 2.2], taxa: 10, tamanho: 0.05 }],
  efeitos: [{ tipo: 'zoom', de: T_VOCE, ate: C(32), para: 1.2 }],
  camera: { tipo: 'enquadrar', alvo: 'coruja', plano: 'close', angulo: 0, elevacao: 2, fov: 44 },
  textos: [{ texto: 'VOCÊ 🫵', de: W('você', F[32][0]), ate: C(32), estilo: 'destaque' }],
});

// =============== última dica: conferir o extrato ===============
add(C(32), C(33), {
  ambiente: SALA,
  objetos: [{ id: 'sofa', asset: 'forma', pos: [0, 0, -0.3], params: { tamanho: [2.2, 0.45, 0.9], cor: '#7b5ea8' } }, { id: 'encosto', asset: 'forma', pos: [0, 0, -0.75], params: { tamanho: [2.2, 1.0, 0.2], cor: '#6a4f94' } },
    { id: 'cel', asset: 'celular', pos: [0.05, 0.85, 0.35], params: { tamanho: 2.6, texto: 'Extrato: confere os descontos', tela: '#ffe1e1' }, anim: { oscila: { eixo: 'y', amp: 0.02, freq: 0.8 } } }],
  personagens: [
    vovo({ pos: [-0.5, 0.11, -0.25], giro: 0, acoes: [{ clip: 'sit', de: C(32), ate: C(33) }, { clip: 'nod', de: r2(C(32) + 1.2), ate: C(33), camada: 1, mascara: ['head', 'face'] }] }),
    { id: 'neto', preset: 'crianca', overrides: TRACO, pos: [0.6, 0.11, -0.2], giro: -15, acoes: [{ clip: 'sit', de: C(32), ate: C(33) }, { clip: 'point', de: r2(C(32) + 0.6), ate: C(33), camada: 1, mascara: ['armR', 'head'] }] },
  ],
  camera: { tipo: 'enquadrar', alvo: 'vovo', plano: 'medio', angulo: 15, deriva: 15, elevacao: 10, fov: 46, olhaDesloca: [0.5, 0, 0] },
  textos: [selo('ÚLTIMA DICA ✅', C(32), C(33))],
});

add(C(33), C(34), {
  ambiente: SALA,
  objetos: [{ id: 'extrato', asset: 'extrato', pos: [0, 0, 0], params: { linhas: ['Aposentadoria ........ + R$ 1.518,00', 'Remédio .............. − R$ 89,90', 'Desconto associativo:  PROIBIDO', 'Saldo ................ R$ 1.428,10'], destaque: -1 }, etapa: [[C(33), 0.25], [r2(C(33) + 1.2), 1]] }],
  personagens: [vovo({ pos: [1.7, 0, 0.9], giro: -30, acoes: [{ clip: 'cheer', de: C(33), ate: C(34) }] })],
  elementos: [{ tipo: 'icone', icone: 'v', pos: [0.78, 0.36], tamanho: 0.16, de: r2(C(33) + 0.3) }, etiqueta('lei nova proíbe o desconto', { pos: [0.5, 0.2], ponto: '#5fbf6a', de: r2(C(33) + 0.2) })],
  camera: { tipo: 'travelling', de: { pos: [0.6, 2.0, 7.2], olha: [0.3, 1.8, 0] }, para: { pos: [0.4, 1.9, 6.4], olha: [0.3, 1.8, 0] }, fov: 48 },
});

// pergunta final
add(C(34), FIM, {
  ambiente: RUA,
  objetos: [...rua(), PLAQ('r1', -2.0), PLAQ('r2', -0.8), PLAQ('r3', 2.0)].map((o) => (o.id === 'r3' ? { ...o, pos: [2.0, 0.95, 1.33] } : o)),
  personagens: [
    vovo({ pos: [0.6, 0, 1.0], giro: 0, acoes: [{ clip: 'heroi_pose', de: C(34), ate: FIM }] }),
    aranha({ pos: [-2.0, 0, 1.0], giro: 15, acoes: [{ clip: 'wave', de: C(34), ate: FIM, expressao: 'sad' }] }),
    coruja({ pos: [-0.8, 0, 1.0], giro: 10, acoes: [{ clip: 'shrug', de: C(34), ate: FIM }] }),
    cometa({ pos: [2.0, 0, 1.0], giro: -15, acoes: [{ clip: 'wave', de: C(34), ate: FIM, fase: 0.4 }] }),
  ],
  camera: { tipo: 'travelling', de: { pos: [0, 1.4, 8], olha: [0, 1.1, 1] }, para: { pos: [0, 1.3, 6.6], olha: [0, 1.1, 1] }, fov: 46 },
  textos: [
    { texto: 'Seu avô ou sua avó já teve desconto que não autorizou? 👇', de: r2(F[35][0]), ate: FIM, estilo: 'pergunta' },
    { texto: 'Ficção inspirada na Op. Sem Desconto', de: r2(F[35][0]), ate: FIM, estilo: 'rodape' },
  ],
});

const sb = {
  versao: 1,
  titulo: 'Não roube um aposentado sem ver esse vídeo',
  formato: { largura: 1080, altura: 1920, fps: 30 },
  duracao: FIM,
  audio: 'narracao.mp3',
  palavras: 'palavras.json',
  legendas: { ativo: true, palavrasPorBloco: 1 },
  ambiente: RUA,
  cenas: S,
};
fs.writeFileSync(path.join(PASTA, 'storyboard.json'), JSON.stringify(sb, null, 2) + '\n');
console.log(`storyboard.json: ${S.length} cenas, ${FIM} s`);
