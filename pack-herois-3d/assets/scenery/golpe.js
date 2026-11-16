// Golpes, dinheiro, escritório e polícia: bengala, guarda-chuva, bolsa, carteira, celular, extrato, placa com texto,
// cofre, pilha de papéis, carimbo, mesa, viatura e saco de lixo com dinheiro.
// Textos (placa, extrato, viatura) são desenhados em canvas quando há navegador; sem navegador (testes) vira cor lisa.
// Tudo função do tempo (update) ou de etapa (setProgress), para o render ser exato.

import * as THREE from 'three';
import { register } from './kit.js';

const fosco = (cor, extra = {}) => new THREE.MeshStandardMaterial({ color: cor, roughness: 0.8, ...extra });
const brilhante = (cor, extra = {}) => new THREE.MeshStandardMaterial({ color: cor, roughness: 0.3, metalness: 0.4, ...extra });
const caixa = (w, h, d, mat, pos, pai) => {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  if (pos) m.position.set(...pos);
  pai.add(m);
  return m;
};
const cil = (r1, r2, h, mat, pos, pai, seg = 12) => {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r1, r2, h, seg), mat);
  if (pos) m.position.set(...pos);
  pai.add(m);
  return m;
};
const temCanvas = () => typeof document !== 'undefined' && !!document.createElement;

// desenha um canvas (larg×alt px) com a função "pintar" e devolve um material; sem navegador devolve cor lisa
function materialTexto(larg, alt, fundo, pintar) {
  if (!temCanvas()) return { mat: new THREE.MeshBasicMaterial({ color: fundo }), redesenhar: () => {} };
  const cv = document.createElement('canvas');
  cv.width = larg;
  cv.height = alt;
  const ctx = cv.getContext('2d');
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  const redesenhar = (...a) => { ctx.clearRect(0, 0, larg, alt); pintar(ctx, larg, alt, ...a); tex.needsUpdate = true; };
  redesenhar();
  return { mat: new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }), redesenhar };
}
// texto centralizado que encolhe até caber na largura
function escrever(ctx, texto, x, y, maxL, tamanho, cor, peso = 900, alinhar = 'center') {
  let t = tamanho;
  ctx.textAlign = alinhar;
  ctx.textBaseline = 'middle';
  do { ctx.font = `${peso} ${t}px "Arial Black", Arial, sans-serif`; t -= 2; } while (ctx.measureText(texto).width > maxL && t > 8);
  ctx.fillStyle = cor;
  ctx.fillText(texto, x, y);
}

register('bengala', {
  category: 'golpe',
  label: 'Bengala',
  description: 'Bengala de madeira com cabo curvo. A base fica no chão (y=0); para dar uma bengalada, gire no eixo x/z com anim.giro e mova com anim.pos (o pivô é a ponta de baixo).',
  params: { altura: [0.9, 'altura (m)'], cor: ['#7a4a26', 'madeira'] },
  variants: { escura: { cor: '#3b2414' } },
  make(g, p) {
    const m = fosco(p.cor);
    cil(0.018, 0.022, p.altura, m, [0, p.altura / 2, 0], g, 8);
    const cabo = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.02, 8, 16, Math.PI), m);
    cabo.position.set(0.06, p.altura, 0);
    g.add(cabo);
    cil(0.026, 0.026, 0.03, fosco('#222'), [0, 0.015, 0], g, 8);
  },
});

register('guarda_chuva', {
  category: 'golpe',
  label: 'Guarda-chuva',
  description: 'Guarda-chuva de cabo em J. Ponta de baixo no chão (y=0). setProgress: 0 = fechado, 1 = aberto. Gire com anim.giro (eixo x/z) para uma guarda-chuvada.',
  params: { cor: ['#e5322d', 'tecido'], comprimento: [0.95, 'comprimento (m)'], progress: [0, '0 fechado, 1 aberto'] },
  variants: { azul: { cor: '#2f6fd6' }, xadrez: { cor: '#6b3fa0' }, aberto: { progress: 1 } },
  make(g, p) {
    const L = p.comprimento;
    const haste = fosco('#2a2a2a');
    cil(0.012, 0.012, L, haste, [0, L / 2, 0], g, 6);
    const cabo = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.016, 8, 16, Math.PI), fosco('#5a3418'));
    cabo.position.set(0.05, 0.02, 0);
    cabo.rotation.z = Math.PI;
    g.add(cabo);
    const tecido = new THREE.Mesh(new THREE.ConeGeometry(1, 1, 10, 1, true), fosco(p.cor, { side: THREE.DoubleSide }));
    g.add(tecido);
    const ponta = cil(0.008, 0.008, 0.08, haste, [0, L + 0.04, 0], g, 6);
    const aplicar = (k) => {
      const r = 0.06 + 0.5 * k;
      const h = 0.55 - 0.3 * k;
      tecido.scale.set(r, h, r);
      tecido.position.y = L - h / 2;
      ponta.position.y = L + 0.04;
    };
    aplicar(p.progress);
    g.userData.setProgress = aplicar;
  },
});

register('bolsa', {
  category: 'golpe',
  label: 'Bolsa de mão',
  description: 'Bolsa de senhora com alça e fecho dourado. Base em y=0.',
  params: { cor: ['#b23a5a', 'couro'], tamanho: [1, 'escala'] },
  variants: { marrom: { cor: '#7a4a26' }, preta: { cor: '#2a2a2e' } },
  make(g, p) {
    const s = p.tamanho;
    const m = fosco(p.cor, { roughness: 0.55 });
    caixa(0.36 * s, 0.26 * s, 0.13 * s, m, [0, 0.13 * s, 0], g);
    caixa(0.37 * s, 0.07 * s, 0.14 * s, fosco(p.cor, { roughness: 0.45, color: new THREE.Color(p.cor).multiplyScalar(0.8) }), [0, 0.24 * s, 0.002], g);
    caixa(0.05 * s, 0.04 * s, 0.02 * s, brilhante('#f2c94c'), [0, 0.22 * s, 0.075 * s], g);
    const alca = new THREE.Mesh(new THREE.TorusGeometry(0.12 * s, 0.012 * s, 6, 16, Math.PI), m);
    alca.position.y = 0.27 * s;
    g.add(alca);
  },
});

register('carteira', {
  category: 'golpe',
  label: 'Carteira de dinheiro',
  description: 'Carteira de couro com notas aparecendo. Base em y=0. Use tamanho 2–3 para ficar visível em plano aberto.',
  params: { cor: ['#6b4423', 'couro'], tamanho: [1, 'escala'] },
  variants: { grande: { tamanho: 2.5 } },
  make(g, p) {
    const s = p.tamanho;
    caixa(0.2 * s, 0.035 * s, 0.12 * s, fosco(p.cor, { roughness: 0.5 }), [0, 0.0175 * s, 0], g);
    caixa(0.17 * s, 0.01 * s, 0.1 * s, fosco('#5fbf6a'), [0.02 * s, 0.04 * s, 0.01 * s], g).rotation.y = 0.15;
  },
});

register('celular', {
  category: 'golpe',
  label: 'Celular',
  description: 'Celular com tela acesa (bolha de mensagem). Em pé, base em y=0, tela para +Z. Use tamanho 3–8 para close.',
  params: { tamanho: [1, 'escala'], tela: ['#d9fdd3', 'cor da tela'], texto: ['Vó, troquei de número', 'mensagem na tela'] },
  variants: { gigante: { tamanho: 8 } },
  make(g, p) {
    const s = p.tamanho;
    caixa(0.08 * s, 0.16 * s, 0.01 * s, brilhante('#1d1f24', { metalness: 0.2 }), [0, 0.08 * s, 0], g);
    const { mat } = materialTexto(256, 512, p.tela, (ctx, w, h) => {
      ctx.fillStyle = '#efe7de';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#128c7e';
      ctx.fillRect(0, 0, w, 70);
      escrever(ctx, 'Neto ❤️', w / 2, 36, w - 30, 30, '#ffffff', 700);
      ctx.fillStyle = p.tela;
      ctx.beginPath();
      ctx.roundRect(24, 120, w - 48, 150, 18);
      ctx.fill();
      const palavras = String(p.texto).split(' ');
      const l1 = palavras.slice(0, Math.ceil(palavras.length / 2)).join(' ');
      const l2 = palavras.slice(Math.ceil(palavras.length / 2)).join(' ');
      escrever(ctx, l1, w / 2, 170, w - 70, 30, '#1d1f24', 700);
      escrever(ctx, l2, w / 2, 215, w - 70, 30, '#1d1f24', 700);
    });
    const tela = new THREE.Mesh(new THREE.PlaneGeometry(0.07 * s, 0.145 * s), mat);
    tela.position.set(0, 0.08 * s, 0.0052 * s);
    g.add(tela);
  },
});

register('extrato', {
  category: 'golpe',
  label: 'Extrato do benefício',
  description: 'Painel grande de extrato (papel em pé num suporte), com título, linhas de lançamento e UMA linha em destaque vermelho. Frente para +Z, base em y=0. setProgress revela as linhas de cima para baixo (1 = todas).',
  params: {
    largura: [2.4, 'largura do papel (m)'],
    altura: [3.2, 'altura do papel (m)'],
    titulo: ['EXTRATO DO BENEFÍCIO', 'título'],
    linhas: [['Aposentadoria ........ + R$ 1.518,00', 'Empréstimo ........... − R$ 120,00', 'MENSALIDADE ASSOCIATIVA − R$ 45,00', 'Saldo ................ R$ 1.353,00'], 'linhas de texto'],
    destaque: [2, 'índice da linha em destaque (−1 = nenhuma)'],
    progress: [1, 'quantas linhas aparecem (0..1)'],
  },
  variants: { vazio: { progress: 0 } },
  make(g, p) {
    const W = p.largura;
    const H = p.altura;
    const base = H * 0.18;
    caixa(0.06, base, 0.06, fosco('#7b8794'), [-W * 0.3, base / 2, -0.05], g);
    caixa(0.06, base, 0.06, fosco('#7b8794'), [W * 0.3, base / 2, -0.05], g);
    caixa(W + 0.12, H + 0.12, 0.05, fosco('#c9ced6'), [0, base + H / 2, -0.03], g);
    const n = p.linhas.length;
    const { mat, redesenhar } = materialTexto(768, 1024, '#ffffff', (ctx, w, h, prog = p.progress) => {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#1f4e9c';
      ctx.fillRect(0, 0, w, 150);
      escrever(ctx, p.titulo, w / 2, 78, w - 60, 54, '#ffffff');
      const mostrar = Math.round(prog * n);
      for (let i = 0; i < mostrar; i++) {
        const y = 250 + i * 150;
        const dest = i === p.destaque;
        if (dest) {
          ctx.fillStyle = '#ffe1e1';
          ctx.fillRect(20, y - 60, w - 40, 120);
          ctx.strokeStyle = '#e5322d';
          ctx.lineWidth = 10;
          ctx.strokeRect(20, y - 60, w - 40, 120);
        } else {
          ctx.fillStyle = '#eef1f6';
          ctx.fillRect(20, y + 62, w - 40, 4);
        }
        escrever(ctx, p.linhas[i], 46, y, w - 92, 40, dest ? '#c81e1e' : '#2b2f38', dest ? 900 : 700, 'left');
      }
    });
    const papel = new THREE.Mesh(new THREE.PlaneGeometry(W, H), mat);
    papel.position.set(0, base + H / 2, 0);
    g.add(papel);
    let ultimo = -1;
    g.userData.setProgress = (k) => {
      const q = Math.round(k * n);
      if (q !== ultimo) { ultimo = q; redesenhar(k); }
    };
  },
});

register('placa', {
  category: 'golpe',
  label: 'Placa com texto',
  description: 'Placa retangular com texto (e subtítulo), em dois postes ou solta (poste:false, para segurar à frente do peito ou pendurar). Frente para +Z, base em y=0.',
  params: {
    texto: ['ASSOCIAÇÃO', 'texto principal'],
    sub: ['', 'subtítulo (linha menor)'],
    largura: [3, 'largura (m)'],
    altura: [1, 'altura (m)'],
    fundo: ['#1f4e9c', 'cor de fundo'],
    cor: ['#ffffff', 'cor do texto'],
    poste: [true, 'com dois postes'],
    alturaPoste: [1.4, 'altura dos postes (m)'],
  },
  variants: {
    reu: { texto: 'RÉU', largura: 0.55, altura: 0.32, fundo: '#ffffff', cor: '#111111', poste: false },
    inss: { texto: 'INSS', fundo: '#1f4e9c', largura: 2, altura: 0.8 },
  },
  make(g, p) {
    const y0 = p.poste ? p.alturaPoste : 0;
    if (p.poste) {
      for (const sx of [-1, 1]) cil(0.04, 0.04, y0 + p.altura * 0.5, fosco('#7b8794'), [sx * p.largura * 0.38, (y0 + p.altura * 0.5) / 2, -0.06], g, 8);
    }
    caixa(p.largura, p.altura, 0.06, fosco(p.fundo), [0, y0 + p.altura / 2, -0.035], g);
    const ar = p.largura / p.altura;
    const W = 1024;
    const H = Math.max(64, Math.round(W / ar));
    const { mat } = materialTexto(W, H, p.fundo, (ctx, w, h) => {
      ctx.fillStyle = p.fundo;
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = p.cor;
      ctx.lineWidth = Math.max(4, h * 0.04);
      ctx.strokeRect(h * 0.05, h * 0.05, w - h * 0.1, h * 0.9);
      if (p.sub) {
        escrever(ctx, p.texto, w / 2, h * 0.4, w * 0.9, h * 0.42, p.cor);
        escrever(ctx, p.sub, w / 2, h * 0.76, w * 0.85, h * 0.18, p.cor, 700);
      } else escrever(ctx, p.texto, w / 2, h * 0.53, w * 0.88, h * 0.62, p.cor);
    });
    const frente = new THREE.Mesh(new THREE.PlaneGeometry(p.largura, p.altura), mat);
    frente.position.set(0, y0 + p.altura / 2, 0);
    g.add(frente);
  },
});

register('cofre', {
  category: 'golpe',
  label: 'Cofre com dinheiro',
  description: 'Cofre de aço com porta aberta e pilhas de moedas/notas lá dentro. Frente para +Z, base em y=0. setProgress = quanto dinheiro tem dentro (0 vazio, 1 transbordando). Junte um fluxo "moeda" caindo dentro (y ~1).',
  params: { tamanho: [1.3, 'aresta (m)'], cor: ['#59606b', 'aço'], porta: [0.75, 'abertura da porta 0..1'], progress: [0.5, 'quantidade de dinheiro'] },
  variants: { cheio: { progress: 1 }, vazio: { progress: 0 } },
  make(g, p) {
    const S = p.tamanho;
    const aco = brilhante(p.cor, { metalness: 0.6, roughness: 0.35 });
    const e = 0.08 * S;
    caixa(S, e, S, aco, [0, e / 2, 0], g);
    caixa(S, e, S, aco, [0, S - e / 2, 0], g);
    caixa(e, S, S, aco, [-S / 2 + e / 2, S / 2, 0], g);
    caixa(e, S, S, aco, [S / 2 - e / 2, S / 2, 0], g);
    caixa(S, S, e, aco, [0, S / 2, -S / 2 + e / 2], g);
    caixa(S - 2 * e, S * 0.02, S - 2 * e, fosco('#2b2f36'), [0, S * 0.5, 0], g);
    const dob = new THREE.Group();
    dob.position.set(S / 2, 0, S / 2);
    g.add(dob);
    caixa(S, S, e, aco, [-S / 2, S / 2, e / 2], dob);
    const roda = new THREE.Mesh(new THREE.TorusGeometry(S * 0.14, S * 0.025, 8, 20), brilhante('#d6dbe2', { metalness: 0.8 }));
    roda.position.set(-S / 2, S / 2, e + 0.01);
    dob.add(roda);
    dob.rotation.y = p.porta * 1.9;
    const ouro = brilhante('#ffcf3a', { metalness: 0.7, roughness: 0.25, emissive: '#5a3c00', emissiveIntensity: 0.25 });
    const verde = fosco('#5fbf6a');
    const pilhas = [];
    const andares = [[e, S * 0.5 - S * 0.01], [S * 0.51, S - e]];
    for (const [ya, yb] of andares) {
      for (let i = 0; i < 3; i++) {
        const x = (-0.28 + i * 0.28) * S;
        const moedas = cil(S * 0.1, S * 0.1, 1, ouro, [x, 0, 0.05 * S], g, 16);
        const notas = caixa(S * 0.18, 1, S * 0.12, verde, [x, 0, -0.22 * S], g);
        pilhas.push({ moedas, notas, ya, yb, i });
      }
    }
    const aplicar = (k) => {
      for (const pl of pilhas) {
        const andar = pl.ya > S * 0.4 ? 1 : 0;
        const kk = Math.min(1, Math.max(0, k * 2 - andar - pl.i * 0.15));
        const hmax = (pl.yb - pl.ya) * 0.9;
        for (const [m, f] of [[pl.moedas, 0.8], [pl.notas, 1]]) {
          const h = Math.max(0.001, hmax * kk * f);
          m.scale.y = h;
          m.position.y = pl.ya + h / 2;
          m.visible = kk > 0.02;
        }
      }
    };
    aplicar(p.progress);
    g.userData.setProgress = aplicar;
  },
});

register('pilha_papeis', {
  category: 'golpe',
  label: 'Pilha de papéis',
  description: 'Pilha de documentos/formulários sobre a base (y=0). setProgress = altura da pilha (0 vazia, 1 = 60 cm). Ótimo com fluxo "papel" caindo em cima e o carimbo batendo.',
  params: { largura: [0.6, 'largura da folha (m)'], progress: [0.6, 'altura da pilha'] },
  variants: { alta: { progress: 1 } },
  make(g, p) {
    const folhas = [];
    const N = 24;
    for (let i = 0; i < N; i++) {
      const f = caixa(p.largura, 0.022, p.largura * 0.72, fosco(i % 3 ? '#ffffff' : '#eef3fb'), [Math.sin(i * 7.1) * 0.03, 0.011 + i * 0.025, Math.cos(i * 5.3) * 0.03], g);
      f.rotation.y = Math.sin(i * 3.7) * 0.12;
      folhas.push(f);
    }
    const aplicar = (k) => { const v = Math.round(k * N); folhas.forEach((f, i) => { f.visible = i < Math.max(1, v); }); };
    aplicar(p.progress);
    g.userData.setProgress = aplicar;
  },
});

register('carimbo', {
  category: 'golpe',
  label: 'Carimbo',
  description: 'Carimbo de madeira com base de borracha vermelha. Base em y=0. Para carimbar: anim.pos subindo e descendo rápido (ou oscila no eixo y). Use tamanho 2–3 para close.',
  params: { tamanho: [1, 'escala'], cor: ['#c81e1e', 'tinta'] },
  variants: { grande: { tamanho: 2.5 } },
  make(g, p) {
    const s = p.tamanho;
    caixa(0.12 * s, 0.02 * s, 0.08 * s, fosco(p.cor), [0, 0.01 * s, 0], g);
    caixa(0.13 * s, 0.03 * s, 0.09 * s, fosco('#8a5a34'), [0, 0.035 * s, 0], g);
    cil(0.018 * s, 0.022 * s, 0.09 * s, fosco('#8a5a34'), [0, 0.095 * s, 0], g, 10);
    const bola = new THREE.Mesh(new THREE.SphereGeometry(0.035 * s, 12, 10), fosco('#2a2a2e'));
    bola.position.y = 0.15 * s;
    g.add(bola);
  },
});

register('mesa', {
  category: 'golpe',
  label: 'Mesa de escritório',
  description: 'Mesa de escritório de madeira com tampo a 0,76 m (ponha objetos em cima com y=0,78). Base em y=0.',
  params: { largura: [1.8, 'largura (m)'], profundidade: [0.9, 'profundidade (m)'], cor: ['#a9743f', 'madeira'] },
  variants: { escura: { cor: '#5b3a22' }, branca: { cor: '#e8e6e0' } },
  make(g, p) {
    const W = p.largura;
    const D = p.profundidade;
    caixa(W, 0.05, D, fosco(p.cor), [0, 0.755, 0], g);
    for (const sx of [-1, 1]) caixa(0.06, 0.73, D * 0.9, fosco(new THREE.Color(p.cor).multiplyScalar(0.75)), [sx * (W / 2 - 0.06), 0.365, 0], g);
    caixa(W - 0.2, 0.4, 0.03, fosco(new THREE.Color(p.cor).multiplyScalar(0.85)), [0, 0.5, -D / 2 + 0.05], g);
  },
});

register('viatura', {
  category: 'golpe',
  label: 'Viatura de polícia',
  description: 'Viatura branca com faixa azul, texto na lateral e giroflex que pisca sozinho (vermelho/azul). Frente para +Z, base em y=0. Rodas giram ao mover.',
  params: { texto: ['POLÍCIA FEDERAL', 'texto da lateral'], faixa: ['#1f4e9c', 'cor da faixa'], sirene: [true, 'giroflex piscando'] },
  variants: { parada: { sirene: false } },
  make(g, p) {
    const branco = brilhante('#f4f6f8', { metalness: 0.3, roughness: 0.35 });
    caixa(2.0, 0.7, 4.6, branco, [0, 0.65, 0], g);
    caixa(1.8, 0.6, 2.4, branco, [0, 1.3, -0.2], g);
    const vidro = brilhante('#2b3a4a', { metalness: 0.5, roughness: 0.15 });
    caixa(1.82, 0.42, 2.0, vidro, [0, 1.32, -0.2], g);
    caixa(2.02, 0.22, 4.62, fosco(p.faixa), [0, 0.68, 0], g);
    for (const lado of [-1, 1]) {
      const { mat } = materialTexto(1024, 128, p.faixa, (ctx, w, h) => {
        ctx.fillStyle = p.faixa;
        ctx.fillRect(0, 0, w, h);
        escrever(ctx, p.texto, w / 2, h / 2, w * 0.92, 92, '#ffffff');
      });
      const pl = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 0.42), mat);
      pl.position.set(lado * 1.012, 0.68, 0);
      pl.rotation.y = lado * Math.PI / 2;
      g.add(pl);
    }
    caixa(1.5, 0.08, 0.04, fosco('#222'), [0, 0.45, 2.31], g);
    for (const sx of [-0.7, 0.7]) caixa(0.35, 0.16, 0.04, new THREE.MeshStandardMaterial({ color: '#fff7d6', emissive: '#fff2b0', emissiveIntensity: 0.8 }), [sx, 0.8, 2.31], g);
    const pneu = fosco('#1a1a1c');
    for (const [x, z] of [[-0.95, 1.5], [0.95, 1.5], [-0.95, -1.5], [0.95, -1.5]]) {
      const r = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.3, 16), pneu);
      r.rotation.z = Math.PI / 2;
      const pivo = new THREE.Group();
      pivo.position.set(x, 0.38, z);
      pivo.userData.wheelRadius = 0.38;
      pivo.add(r);
      g.add(pivo);
    }
    caixa(1.2, 0.08, 0.3, fosco('#2a2a2e'), [0, 1.64, -0.2], g);
    const vermelho = new THREE.MeshStandardMaterial({ color: '#ff2a2a', emissive: '#ff0000', emissiveIntensity: 0.2 });
    const azul = new THREE.MeshStandardMaterial({ color: '#2a6bff', emissive: '#0040ff', emissiveIntensity: 0.2 });
    caixa(0.55, 0.16, 0.28, vermelho, [-0.3, 1.76, -0.2], g);
    caixa(0.55, 0.16, 0.28, azul, [0.3, 1.76, -0.2], g);
    const lv = new THREE.PointLight('#ff3030', 0, 14, 2);
    lv.position.set(-0.6, 2.1, -0.2);
    const la = new THREE.PointLight('#3060ff', 0, 14, 2);
    la.position.set(0.6, 2.1, -0.2);
    g.add(lv, la);
    for (const l of [lv, la]) l.userData.foraDaCaixa = true;
    g.userData.update = (t) => {
      if (!p.sirene) return;
      const fase = Math.floor(t * 6) % 2;
      vermelho.emissiveIntensity = fase ? 2.4 : 0.2;
      azul.emissiveIntensity = fase ? 0.2 : 2.4;
      lv.intensity = fase ? 22 : 0;
      la.intensity = fase ? 0 : 22;
    };
  },
});

register('saco_lixo', {
  category: 'golpe',
  label: 'Saco de lixo com dinheiro',
  description: 'Saco de lixo preto amarrado. setProgress abre o saco e mostra maços de notas saindo (0 fechado, 1 aberto e transbordando). Base em y=0.',
  params: { tamanho: [1, 'escala'], progress: [0, 'abertura'] },
  variants: { aberto: { progress: 1 } },
  make(g, p) {
    const s = p.tamanho;
    const plastico = new THREE.MeshPhysicalMaterial({ color: '#16171b', roughness: 0.3, clearcoat: 0.8, clearcoatRoughness: 0.2 });
    const corpo = new THREE.Mesh(new THREE.IcosahedronGeometry(0.4 * s, 2), plastico);
    corpo.scale.set(1, 1.15, 0.9);
    corpo.position.y = 0.42 * s;
    g.add(corpo);
    const no = new THREE.Mesh(new THREE.ConeGeometry(0.1 * s, 0.22 * s, 8), plastico);
    no.position.y = 0.95 * s;
    g.add(no);
    const macos = [];
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * Math.PI * 2;
      const m = caixa(0.22 * s, 0.06 * s, 0.11 * s, fosco('#5fbf6a'), [0, 0, 0], g);
      caixa(0.04 * s, 0.065 * s, 0.115 * s, fosco('#f2f2ea'), [0, 0, 0], m);
      macos.push({ m, a, r: 0.35 + (i % 3) * 0.12 });
    }
    const aplicar = (k) => {
      no.visible = k < 0.2;
      corpo.scale.set(1 + 0.08 * k, 1.15 - 0.25 * k, 0.9 + 0.08 * k);
      for (const [i, mc] of macos.entries()) {
        const kk = Math.min(1, Math.max(0, k * 1.6 - i * 0.07));
        mc.m.visible = kk > 0.02;
        mc.m.position.set(Math.cos(mc.a) * mc.r * s * kk, (0.03 + 0.75 * (1 - kk) + (i % 2) * 0.06) * s, Math.sin(mc.a) * mc.r * s * kk + 0.1 * s);
        mc.m.rotation.y = mc.a;
      }
    };
    aplicar(p.progress);
    g.userData.setProgress = aplicar;
  },
});
