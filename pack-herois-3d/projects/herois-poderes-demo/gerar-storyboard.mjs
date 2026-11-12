// Demonstração de 10 s dos quatro heróis de humor (sem voz): cada um mostra poderes; final com o grupo.
// Rode: node projects/herois-poderes-demo/gerar-storyboard.mjs
import fs from 'node:fs';

const S = [];
const add = (inicio, fim, c) => S.push({ inicio, fim, ...c });
const r2 = (n) => Math.round(n * 100) / 100;
const ASF = 0.06;
const CAL = 0.2;
const rad = (d) => (d * Math.PI) / 180;
const ease = (u) => u * u * (3 - 2 * u);

// keyframes [[t, [x,y,z]]] amostrados de uma função de t (0..1) entre t0 e t1
const trilha = (t0, t1, f, passo = 0.08) => {
  const ks = [];
  for (let t = t0; t <= t1 + 1e-6; t += passo) {
    const u = Math.min(1, (t - t0) / (t1 - t0));
    ks.push([r2(t), f(u).map(r2)]);
  }
  return ks;
};

// cenário urbano simples (mesmo da demo do heroi_vertice)
const cidade = () => [
  { id: 'rua', asset: 'rua_reta', pos: [0, 0, 0], params: { length: 90 } },
  { id: 'predioL', asset: 'predio_apartamentos', variante: 'rosa', pos: [-12.4, 0, -16], giro: 90, params: { floors: 5 } },
  { id: 'lojaL', asset: 'loja', variante: 'padaria', pos: [-11, 0, -2], giro: 90 },
  { id: 'predioL2', asset: 'predio_apartamentos', variante: 'azul', pos: [-12.4, 0, 12], giro: 90, params: { floors: 4 } },
  { id: 'lojaR', asset: 'loja', variante: 'mercado', pos: [11, 0, -12], giro: -90 },
  { id: 'predioR', asset: 'predio_apartamentos', pos: [12.4, 0, 2], giro: -90, params: { floors: 6 } },
  { id: 'lojaR2', asset: 'loja', pos: [11, 0, 16], giro: -90 },
  { id: 'posteL1', asset: 'poste_luz', pos: [-4.9, CAL, -20], giro: 90 },
  { id: 'posteL2', asset: 'poste_luz', pos: [-4.9, CAL, 4], giro: 90 },
  { id: 'posteR1', asset: 'poste_luz', pos: [4.9, CAL, -8], giro: -90 },
  { id: 'arvL', asset: 'arvore_redonda', pos: [-4.7, CAL, -8], escala: 0.7, params: { seed: 3 } },
  { id: 'arvR', asset: 'arvore_redonda', pos: [4.7, CAL, 4], escala: 0.7, params: { seed: 6 } },
  { id: 'arvR2', asset: 'arvore_redonda', variante: 'escura', pos: [4.7, CAL, -24], escala: 0.7, params: { seed: 9 } },
];
const transito = (de, ate) => [
  { id: 'carro1', asset: 'carro_hatch', variante: 'vermelho', pos: [-1.7, ASF, -24 - de * 3], giro: 180, movimentos: [{ de, ate, para: [-1.7, -24 - ate * 3] }] },
  { id: 'carro2', asset: 'carro_sedan', variante: 'taxi', pos: [1.7, ASF, -46 + de * 4], giro: 0, movimentos: [{ de, ate, para: [1.7, -46 + ate * 4] }] },
];
const NA_RUA = { fundo: 'cidade', horario: 'dia' };
const nome = (texto, de, ate) => ({ texto, de, ate, estilo: 'rodape' });

// ---- 1. 0–2,4 s: ARACNILDO balança no fio, aterrissa e lança um fio ----
{
  const ANC = [0.2, 7.0, 0]; // ponto onde o fio está preso
  const L = 5.6;
  const arco = trilha(0, 1.55, (u) => {
    const th = rad(-44 + 56 * ease(u));
    return [ANC[0] + L * Math.sin(th), ANC[1] - L * Math.cos(th), ANC[2]];
  });
  const [, fimArco] = arco[arco.length - 1];
  const POUSO = [r2(fimArco[0] + 0.6), ASF, 0];
  const queda = trilha(1.55, 1.85, (u) => [fimArco[0] + 0.6 * u, fimArco[1] + (ASF - fimArco[1]) * u * u, 0]).slice(1);
  add(0, 2.4, {
    transicao: 'fade',
    ambiente: NA_RUA,
    objetos: [...cidade(), ...transito(0, 2.4), { id: 'alvo', asset: 'cone', pos: [-0.5, ASF, 2.6] }],
    personagens: [{
      id: 'aranha', preset: 'aracnildo', pos: POUSO, giro: 90,
      anim: { pos: [...arco, ...queda], suave: false },
      viraPara: [{ em: 1.9, alvo: 'alvo' }],
      acoes: [
        { clip: 'balancar', de: 0, ate: 1.6, velocidade: 0.8, params: { fio: 4.0 }, suavizacao: 0.01 },
        { clip: 'aterrissagem_heroica', de: 1.6, ate: 1.95, velocidade: 2.2 },
        { clip: 'lancar_teia', de: 1.95, ate: 2.4, velocidade: 1.6, expressao: 'happy' },
      ],
    }],
    fluxos: [{ material: 'poeira', origem: [POUSO[0], ASF, 0], taxa: 40, tamanho: 0.25, vida: 0.8, dispersao: 0.6, de: 1.82, ate: 2.05 }],
    camera: { tipo: 'travelling', de: { pos: [-0.6, 2.2, 9.2], olha: [-1.6, 3.0, 0] }, para: { pos: [0.6, 1.5, 8.2], olha: [0.8, 1.3, 0] }, fov: 52 },
    textos: [{ texto: '4 HERÓIS, 4 PODERES', de: 0.15, ate: 2.4, estilo: 'titulo' }, nome('ARACNILDO', 0.4, 2.4)],
  });
}

// ---- 2. 2,4–3,5 s: MAJOR COMETA voa pelo céu ----
add(2.4, 3.5, {
  transicao: 'flash',
  ambiente: NA_RUA,
  objetos: [...cidade(), ...transito(2.4, 3.5)],
  personagens: [{
    id: 'cometa', preset: 'major_cometa', pos: [-3.4, 2.9, 1.0], giro: -90,
    anim: { pos: trilha(2.4, 3.5, (u) => [3.4 - 6.8 * u, 3.9 - 1.0 * u + 0.25 * Math.sin(u * Math.PI), 1.0]), suave: false },
    acoes: [{ clip: 'voar', de: 2.4, ate: 3.5 }],
  }],
  camera: { tipo: 'travelling', de: { pos: [0.4, 1.1, 8.0], olha: [0.8, 3.4, 1] }, para: { pos: [-0.4, 1.1, 8.0], olha: [-1.4, 3.0, 1] }, fov: 50 },
  textos: [nome('MAJOR COMETA', 2.5, 3.5)],
});

// ---- 3. 3,5–4,8 s: MAJOR COMETA usa a visão de calor no muro ----
add(3.5, 4.8, {
  ambiente: NA_RUA,
  objetos: [...cidade(), ...transito(3.5, 4.8), { id: 'muro', asset: 'muro', variante: 'tijolo', pos: [-3.3, ASF, 3.6], giro: 125 }],
  personagens: [{
    id: 'cometa', preset: 'major_cometa', pos: [0.5, ASF, 0.6], giro: -52,
    viraPara: [{ em: 3.5, alvo: [-3.3, 3.6] }],
    acoes: [{ clip: 'visao_calor', de: 3.5, ate: 4.8, params: { alcance: 4.55 } }],
  }],
  fluxos: [
    { material: 'fogo', origem: [-3.05, 1.55, 3.3], taxa: 30, tamanho: 0.3, dispersao: 0.15, de: 3.95, ate: 4.8 },
    { material: 'fumaca', origem: [-3.05, 1.8, 3.3], taxa: 8, tamanho: 0.45, de: 4.05, ate: 4.8 },
    { material: 'fagulha', origem: [-3.05, 1.55, 3.3], destino: [-2.2, 1.0, 3.6], taxa: 40, espalha: 1.2, de: 3.95, ate: 4.8 },
  ],
  camera: { tipo: 'travelling', de: { pos: [0.25, 1.8, 11.4], olha: [-1.3, 1.35, 2.0] }, para: { pos: [0.2, 1.8, 11.1], olha: [-1.3, 1.35, 2.0] }, fov: 52 },
  textos: [nome('MAJOR COMETA', 3.5, 4.8)],
});

// ---- 4. 4,8–7,2 s: CORUJA NOTURNA plana do prédio e some na fumaça ----
{
  const POUSO = [0.3, ASF, 2.0];
  const voo = trilha(4.8, 6.05, (u) => [-6.2 + 6.5 * ease(Math.min(1, u * 1.05)), 5.6 + (ASF - 5.6) * Math.pow(u, 1.4), -1.2 + 3.2 * u]);
  add(4.8, 7.2, {
    transicao: 'flash',
    ambiente: NA_RUA,
    objetos: [...cidade(), ...transito(4.8, 7.2)],
    personagens: [{
      id: 'coruja', preset: 'coruja_noturna', pos: POUSO, giro: 64,
      anim: { pos: voo, suave: false },
      viraPara: [{ em: 6.05, alvo: 'camera' }],
      acoes: [
        { clip: 'planar', de: 4.8, ate: 6.05, suavizacao: 0.01 },
        { clip: 'soltar_fumaca', de: 6.05, ate: 7.2 },
      ],
    }],
    fluxos: [{ material: 'fumaca', origem: [POUSO[0], 0.4, POUSO[2]], taxa: 14, tamanho: 0.7, dispersao: 0.6, de: 6.35, ate: 7.2 }],
    camera: { tipo: 'travelling', de: { pos: [2.4, 1.6, 12], olha: [-2.6, 3.3, 0] }, para: { pos: [1.8, 1.4, 10.5], olha: [0, 1.1, 2] }, fov: 50 },
    textos: [nome('CORUJA NOTURNA', 4.9, 7.2)],
  });
}

// ---- 5. 7,2–9,0 s: CAPITÃO TAMPA arremessa o escudo, derruba o cone e defende ----
{
  const MAO = [-0.35, 1.05, 2.25];
  const CONE = [-4.2, ASF, -0.6];
  const voo = [
    [7.0, MAO], [7.72, MAO],
    ...trilha(7.72, 8.12, (u) => [MAO[0] + (CONE[0] - MAO[0]) * u, MAO[1] + (0.55 - MAO[1]) * u + 0.35 * Math.sin(u * Math.PI), MAO[2] + (CONE[2] + 0.3 - MAO[2]) * u]).slice(1),
    ...trilha(8.12, 8.66, (u) => [CONE[0] + (MAO[0] - CONE[0]) * u, 0.55 + (MAO[1] - 0.55) * u + 0.7 * Math.sin(u * Math.PI), CONE[2] + 0.3 + (MAO[2] - CONE[2] - 0.3) * u - 1.2 * Math.sin(u * Math.PI)]).slice(1),
  ];
  add(7.2, 9.0, {
    transicao: 'flash',
    ambiente: NA_RUA,
    objetos: [
      ...cidade(), ...transito(7.2, 9.0),
      { id: 'cone', asset: 'cone', pos: CONE, anim: { giro: [[8.1, 0], [8.35, -95]], eixo: 'z' } },
      { id: 'escudo', asset: 'escudo_heroi', pos: MAO, aparece: 7.72, some: 8.66, anim: { pos: voo, suave: false, gira: 1100, eixo: 'z' } },
    ],
    personagens: [{
      id: 'tampa', preset: 'capitao_tampa', pos: [0, ASF, 2], giro: -62,
      acoes: [
        { clip: 'arremessar_escudo', de: 7.2, ate: 8.55, velocidade: 1.0 },
        { clip: 'defender', de: 8.55, ate: 9.0, expressao: 'happy' },
      ],
    }],
    fluxos: [
      { material: 'fagulha', origem: [CONE[0], 0.5, CONE[2]], destino: [CONE[0] - 0.6, 1.0, CONE[2] + 0.6], taxa: 70, espalha: 1.4, de: 8.08, ate: 8.3 },
      { material: 'poeira', origem: [CONE[0], ASF, CONE[2]], taxa: 30, tamanho: 0.25, vida: 0.8, de: 8.1, ate: 8.35 },
    ],
    efeitos: [{ tipo: 'tremor', de: 8.1, ate: 8.3, intensidade: 0.4 }],
    camera: { tipo: 'fixa', pos: [1.2, 1.5, 9.4], olha: [-1.6, 0.95, 0.9], fov: 52 },
    textos: [nome('CAPITÃO TAMPA', 7.3, 9.0)],
  });
}

// ---- 6. 9,0–10 s: os quatro juntos (três na frente, o Cometa flutuando atrás) ----
const FRENTE = [['aracnildo', -1.35], ['coruja_noturna', 0], ['capitao_tampa', 1.35]];
add(9.0, 10, {
  transicao: 'flash',
  ambiente: NA_RUA,
  objetos: [...cidade(), ...transito(9.0, 10)],
  personagens: [
    ...FRENTE.map(([preset, x], i) => ({
      id: `h${i}`, preset, pos: [x, ASF, 2.6], giro: 0,
      viraPara: [{ em: 9.0, alvo: 'camera' }],
      acoes: [{ clip: 'heroi_pose', de: 9.0, ate: 10, expressao: 'happy', suavizacao: 0.01 }],
    })),
    { id: 'h3', preset: 'major_cometa', pos: [0, 2.15, 1.0], giro: 0,
      anim: { oscila: { eixo: 'y', amp: 0.08, freq: 0.9 } },
      acoes: [{ clip: 'heroi_pose', de: 9.0, ate: 10, expressao: 'happy', suavizacao: 0.01 }] },
  ],
  fluxos: [{ material: 'luz', origem: [0, 1.95, 1.0], destino: [0, 0.6, 1.0], taxa: 14, tamanho: 0.03, dispersao: 0.35, de: 9.0, ate: 10 }],
  camera: { tipo: 'travelling', de: { pos: [0, 1.5, 12.4], olha: [0, 1.75, 2] }, para: { pos: [0, 1.5, 11.8], olha: [0, 1.7, 2] }, fov: 52 },
  textos: [{ texto: 'QUAL É O SEU FAVORITO?', de: 9.1, ate: 10, estilo: 'pergunta' }],
});

const sb = {
  versao: 1,
  titulo: 'Heróis de humor — demonstração de poderes',
  formato: { largura: 1080, altura: 1920, fps: 30 },
  duracao: 10,
  legendas: { ativo: false },
  ambiente: { horario: 'dia', fundo: 'cidade', chao: 'asfalto' },
  cenas: S,
};
fs.writeFileSync(new URL('./storyboard.json', import.meta.url), JSON.stringify(sb, null, 2) + '\n');
console.log(`storyboard.json: ${S.length} cenas, ${sb.duracao} s`);
