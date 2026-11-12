// Demonstração de 10 s do herói original `heroi_vertice` (sem voz): pose → corrida → salto → aterrissagem.
// Rode: node projects/heroi-vertice-demo/gerar-storyboard.mjs
import fs from 'node:fs';

const S = [];
const add = (inicio, fim, c) => S.push({ inicio, fim, ...c });
const r2 = (n) => Math.round(n * 100) / 100;

const ASF = 0.06; // altura do asfalto
const CAL = 0.2; // altura da calçada

// Cenário urbano simples, repetido igual em todas as cenas (continuidade).
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
  { id: 'posteR2', asset: 'poste_luz', pos: [4.9, CAL, 16], giro: -90 },
  { id: 'arvL', asset: 'arvore_redonda', pos: [-4.7, CAL, -8], escala: 0.7, params: { seed: 3 } },
  { id: 'arvR', asset: 'arvore_redonda', pos: [4.7, CAL, 4], escala: 0.7, params: { seed: 6 } },
  { id: 'arvR2', asset: 'arvore_redonda', variante: 'escura', pos: [4.7, CAL, -24], escala: 0.7, params: { seed: 9 } },
  { id: 'hidrante', asset: 'hidrante', pos: [-4.3, CAL, 9] },
  { id: 'lixeira', asset: 'lixeira', pos: [4.3, CAL, 10], giro: -90 },
];

// Trânsito ao fundo (dá vida à rua): um carro e um ônibus se afastando, outro carro vindo.
const transito = (de, ate) => [
  { id: 'carro1', asset: 'carro_hatch', variante: 'vermelho', pos: [-1.7, ASF, -22 + de * -3], giro: 180,
    movimentos: [{ de, ate, para: [-1.7, -22 - ate * 3] }] },
  { id: 'onibus', asset: 'onibus', pos: [-1.7, ASF, -36 - de * 2], giro: 180,
    movimentos: [{ de, ate, para: [-1.7, -36 - ate * 2] }] },
  { id: 'carro2', asset: 'carro_sedan', variante: 'taxi', pos: [1.7, ASF, -44 + de * 4], giro: 0,
    movimentos: [{ de, ate, para: [1.7, -44 + ate * 4] }] },
];

const HEROI = 'heroi_vertice';
const NA_RUA = { fundo: 'cidade', horario: 'dia' };

// ---- 1. 0–2 s: o herói aparece em pé, em pose heroica ----
add(0, 2, {
  transicao: 'fade',
  ambiente: NA_RUA,
  objetos: [...cidade(), ...transito(0, 2)],
  personagens: [{
    id: 'heroi', preset: HEROI, pos: [0, ASF, 3], giro: 0,
    viraPara: [{ em: 0, alvo: 'camera' }],
    acoes: [{ clip: 'heroi_pose', de: 0, ate: 2, expressao: 'happy', suavizacao: 0.01 }],
  }],
  fluxos: [
    // brilho de energia subindo em volta do herói (aura de apresentação)
    { material: 'luz', origem: { ancora: 'heroi', desloca: [0, 0.1, -0.55] }, destino: { ancora: 'heroi', desloca: [0, 2.4, -0.55] },
      taxa: 12, dispersao: 0.4, espalha: 0.6, tamanho: 0.025, de: 0.3, ate: 2 },
  ],
  camera: { tipo: 'enquadrar', alvo: 'heroi', plano: 'geral', angulo: 12, elevacao: 3, deriva: -14, aproxima: 0.82, fov: 40 },
  textos: [{ texto: 'HERÓI VÉRTICE', de: 0.25, ate: 2, estilo: 'titulo' }],
});

// ---- 2. 2–4 s: corre em direção à câmera ----
add(2, 4, {
  ambiente: NA_RUA,
  objetos: [...cidade(), ...transito(2, 4)],
  personagens: [{
    id: 'heroi', preset: HEROI, pos: [0, ASF, -9], giro: 0,
    movimentos: [{ de: 2, ate: 4, para: [0, 4.5], clip: 'run' }],
    acoes: [{ clip: 'run', de: 2, ate: 4, camada: 1, mascara: ['face'], expressao: 'happy' }],
  }],
  fluxos: [
    { material: 'poeira', origem: { ancora: 'heroi', desloca: [0, 0.05, -0.4] }, taxa: 14, tamanho: 0.22, vida: 0.8, de: 2.1, ate: 4 },
  ],
  camera: { tipo: 'travelling', easing: 'linear',
    de: { pos: [1.1, 0.75, 7.5], olha: [0, 1.3, -9] },
    para: { pos: [1.4, 0.8, 11], olha: [0, 1.1, 3] }, fov: 40 },
});

// ---- 3. 4–7 s: salto heroico (impulso, voo em arco e descida) ----
const T0 = 4.4; // sai do chão
const T1 = 7.0; // toca o chão
const H = 3.0; // altura do arco (m)
const Z0 = 4.5;
const Z1 = 12;
const arco = [[4.0, [0, ASF, Z0]]];
for (let t = T0; t <= T1 + 1e-6; t += 0.1) {
  const u = Math.min(1, (t - T0) / (T1 - T0));
  arco.push([r2(t), [0, r2(ASF + H * 4 * u * (1 - u)), r2(Z0 + (Z1 - Z0) * u)]]);
}
add(4, 7, {
  transicao: 'flash',
  ambiente: NA_RUA,
  objetos: [...cidade(), ...transito(4, 7)],
  personagens: [{
    id: 'heroi', preset: HEROI, pos: [0, ASF, Z0], giro: 0,
    anim: { pos: arco, suave: false },
    acoes: [{ clip: 'salto_heroico', de: 4, ate: 7, velocidade: 0.6, suavizacao: 0.01 }],
  }],
  fluxos: [
    // nuvem de poeira no impulso
    { material: 'poeira', origem: [0, ASF, Z0], taxa: 40, tamanho: 0.3, vida: 1.0, dispersao: 0.7, de: 4.25, ate: 4.6 },
    // faíscas de energia saindo das botas no impulso
    { material: 'fagulha', origem: [0, 0.15, Z0], destino: [0, 1.4, Z0 - 1.2], taxa: 60, espalha: 1.4, de: 4.3, ate: 4.75 },
  ],
  camera: { tipo: 'travelling',
    de: { pos: [1.9, 0.85, 15], olha: [0, 2.3, 5] },
    para: { pos: [1.5, 0.75, 19.5], olha: [0, 1.5, 11.5] }, fov: 50 },
});

// ---- 4. 7–10 s: aterrissa e faz a pose final ----
add(7, 10, {
  transicao: 'flash',
  ambiente: NA_RUA,
  objetos: [...cidade(), ...transito(7, 10)],
  personagens: [{
    id: 'heroi', preset: HEROI, pos: [0, ASF, Z1], giro: 0,
    viraPara: [{ em: 7, alvo: 'camera' }],
    acoes: [
      { clip: 'aterrissagem_heroica', de: 7, ate: 8.4, suavizacao: 0.01 },
      { clip: 'heroi_pose', de: 8.4, ate: 10, expressao: 'happy', suavizacao: 0.5 },
    ],
  }],
  fluxos: [
    // impacto: poeira espalhando no chão e faíscas
    { material: 'poeira', origem: { ancora: 'heroi', desloca: [0, 0.05, -0.3] }, taxa: 45, tamanho: 0.24, vida: 0.8, dispersao: 1.3, de: 7, ate: 7.3 },
    { material: 'fagulha', origem: { ancora: 'heroi', desloca: [0, 0.1, 0] }, destino: { ancora: 'heroi', desloca: [0, 0.7, 0] },
      taxa: 60, espalha: 2.4, de: 7, ate: 7.3 },
    { material: 'luz', origem: { ancora: 'heroi', desloca: [0, 0.1, -0.55] }, destino: { ancora: 'heroi', desloca: [0, 2.4, -0.55] },
      taxa: 12, dispersao: 0.4, espalha: 0.6, tamanho: 0.025, de: 8.4, ate: 10 },
  ],
  efeitos: [{ tipo: 'tremor', de: 7, ate: 7.45, intensidade: 0.7 }],
  camera: { tipo: 'enquadrar', alvo: 'heroi', plano: 'geral', angulo: -18, elevacao: 4, deriva: 22, aproxima: 0.8, fov: 40 },
  textos: [{ texto: 'MISSÃO CUMPRIDA!', de: 8.5, ate: 10, estilo: 'destaque' }],
});

const sb = {
  versao: 1,
  titulo: 'Herói Vértice — demonstração de animação',
  formato: { largura: 1080, altura: 1920, fps: 30 },
  duracao: 10,
  legendas: { ativo: false },
  ambiente: { horario: 'dia', fundo: 'cidade', chao: 'asfalto' },
  cenas: S,
};

fs.writeFileSync(new URL('./storyboard.json', import.meta.url), JSON.stringify(sb, null, 2) + '\n');
console.log(`storyboard.json: ${S.length} cenas, ${sb.duracao} s`);
