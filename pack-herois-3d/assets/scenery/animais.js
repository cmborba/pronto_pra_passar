// Animais e objetos de natureza/cultura: boto (golfinho de rio), sonar, termômetro, bandeirinhas, fogueira, chapéu.
// Tudo função do tempo (update) ou de etapa (setProgress), para o render ser exato.

import * as THREE from 'three';
import { register, rng } from './kit.js';

const smooth = (x) => { x = Math.min(1, Math.max(0, x)); return x * x * (3 - 2 * x); };
const pele = (cor, extra = {}) => new THREE.MeshPhysicalMaterial({ color: cor, roughness: 0.38, metalness: 0, clearcoat: 0.6, clearcoatRoughness: 0.25, ...extra });
const fosco = (cor, extra = {}) => new THREE.MeshStandardMaterial({ color: cor, roughness: 0.85, ...extra });

register('boto', {
  category: 'animais',
  label: 'Boto (golfinho de rio)',
  description: 'Boto-cor-de-rosa da Amazônia: corpo rosado com brilho de pele molhada, testa redonda (melão), bico comprido, nadadeiras grandes e cauda que bate sozinha. Frente para +Z. setProgress(0..1) VIRA O PESCOÇO (0,5 = reto; 1 = 90° para a esquerda dele; 0 = 90° para a direita). Para nadar/saltar use movimentos ou anim (pos + giro no eixo x).',
  params: {
    comprimento: [2.4, 'comprimento total (m); filhote ~0,9'],
    cor: ['#ef9fb3', 'cor das costas'],
    barriga: ['#f8c9d4', 'cor da barriga'],
    cicatrizes: [false, 'marcas de briga (machos mais rosados)'],
    batida: [1.2, 'batidas da cauda por segundo'],
    progress: [0.5, 'pescoço: 0,5 reto, 0/1 = 90° para cada lado'],
  },
  variants: {
    filhote: { comprimento: 0.9, cor: '#8b97a7', barriga: '#b8c2cf' },
    macho: { cor: '#f58fab', barriga: '#fbc3d1', cicatrizes: true },
    cinza: { cor: '#9aa0b0', barriga: '#c9ccd6' },
  },
  make(g, p) {
    const s = p.comprimento / 2.4;
    const R = 0.34 * s;
    const raiz = new THREE.Group();
    raiz.position.y = R;
    g.add(raiz);
    const mCosta = pele(p.cor);
    const mBarriga = pele(p.barriga);
    const mEscuro = fosco('#2a1b22');
    const m = (geo, mat, pos, esc, rot, pai) => {
      const o = new THREE.Mesh(geo, mat);
      if (pos) o.position.set(...pos);
      if (esc) o.scale.set(...esc);
      if (rot) o.rotation.set(...rot);
      pai.add(o);
      return o;
    };
    const esf = new THREE.SphereGeometry(1, 28, 20);
    // corpo em torpedo (perfil contínuo) com cor que passa das costas para a barriga
    const cA = new THREE.Color(p.cor);
    const cB = new THREE.Color(p.barriga);
    const torpedo = (perfil, seg = 36) => {
      const geo = new THREE.LatheGeometry(perfil.map(([r, z]) => new THREE.Vector2(r * s, z * s)), seg);
      geo.rotateX(Math.PI / 2); // eixo do torno (y) passa a ser +Z (o perfil vai de trás para a frente)
      geo.computeVertexNormals();
      const pos = geo.attributes.position;
      const nor = geo.attributes.normal;
      const cores = new Float32Array(pos.count * 3);
      const c = new THREE.Color();
      for (let i = 0; i < pos.count; i++) {
        const k = smooth((nor.getY(i) + 0.25) / 0.7);
        c.copy(cB).lerp(cA, k);
        cores.set([c.r, c.g, c.b], i * 3);
      }
      geo.setAttribute('color', new THREE.BufferAttribute(cores, 3));
      return geo;
    };
    const mCorpo = pele('#ffffff', { vertexColors: true });
    const tronco = new THREE.Group();
    raiz.add(tronco);
    const corpo = new THREE.Mesh(torpedo([[0.001, -0.62], [0.16, -0.55], [0.27, -0.35], [0.335, -0.05], [0.34, 0.2], [0.32, 0.45], [0.27, 0.68], [0.2, 0.82], [0.001, 0.86]]), mCorpo);
    corpo.scale.set(1, 0.97, 1);
    tronco.add(corpo);
    // crista dorsal baixa (o boto não tem barbatana alta)
    m(esf, mCosta, [0, R * 0.92, -0.25 * s], [0.05 * s, 0.07 * s, 0.32 * s], null, tronco);
    // nadadeiras peitorais grandes, em pá
    const nadadeiras = [];
    for (const sx of [-1, 1]) {
      const piv = new THREE.Group();
      piv.position.set(sx * R * 0.8, -R * 0.45, 0.45 * s);
      tronco.add(piv);
      m(esf, mCosta, [sx * 0.2 * s, -0.04 * s, -0.08 * s], [0.24 * s, 0.035 * s, 0.13 * s], [0, sx * 0.5, sx * -0.45], piv);
      nadadeiras.push({ piv, sx });
    }
    // cabeça (vira até 90°: vértebras do pescoço não fundidas)
    const pescoco = new THREE.Group();
    pescoco.position.set(0, 0.0, 0.66 * s);
    tronco.add(pescoco);
    const melao = new THREE.Mesh(torpedo([[0.001, -0.18], [0.2, -0.12], [0.255, 0.02], [0.24, 0.16], [0.19, 0.27], [0.11, 0.34], [0.001, 0.36]]), mCorpo);
    melao.position.set(0, 0.02 * s, 0.02 * s);
    melao.scale.set(1, 1.05, 1);
    pescoco.add(melao);
    const bico = new THREE.Mesh(new THREE.CylinderGeometry(0.04 * s, 0.085 * s, 0.6 * s, 18), mBarriga);
    bico.rotation.x = Math.PI / 2 + 0.1;
    bico.position.set(0, -0.08 * s, 0.6 * s);
    pescoco.add(bico);
    m(esf, mBarriga, [0, -0.11 * s, 0.9 * s], [0.042 * s, 0.038 * s, 0.05 * s], null, pescoco);
    for (const sx of [-1, 1]) {
      m(esf, mEscuro, [sx * 0.205 * s, -0.035 * s, 0.24 * s], [0.026 * s, 0.026 * s, 0.02 * s], null, pescoco);
      m(esf, new THREE.MeshBasicMaterial({ color: '#ffffff' }), [sx * 0.212 * s, -0.025 * s, 0.252 * s], [0.008 * s, 0.008 * s, 0.006 * s], null, pescoco);
    }
    m(esf, mEscuro, [0, 0.265 * s, -0.04 * s], [0.035 * s, 0.012 * s, 0.025 * s], null, pescoco); // espiráculo (furo de respirar)
    // cauda: pedúnculo que bate para cima e para baixo + nadadeira caudal larga
    const cauda = new THREE.Group();
    cauda.position.set(0, 0, -0.45 * s);
    tronco.add(cauda);
    const ped = new THREE.Mesh(torpedo([[0.001, -0.75], [0.06, -0.72], [0.1, -0.5], [0.16, -0.25], [0.21, 0.0], [0.22, 0.12], [0.001, 0.14]]), mCorpo);
    ped.scale.set(0.8, 1.05, 1);
    cauda.add(ped);
    const ponta = new THREE.Group();
    ponta.position.z = -0.72 * s;
    cauda.add(ponta);
    for (const sx of [-1, 1]) {
      m(esf, mCosta, [sx * 0.17 * s, 0, -0.07 * s], [0.21 * s, 0.022 * s, 0.1 * s], [0, sx * -0.6, 0], ponta);
    }
    if (p.cicatrizes) {
      const rnd = rng(9);
      const marca = new THREE.MeshBasicMaterial({ color: '#ffd6df' });
      for (let i = 0; i < 9; i++) {
        const a = (rnd() - 0.5) * 2.2;
        const z = (rnd() - 0.4) * 1.2 * s;
        const risco = new THREE.Mesh(new THREE.BoxGeometry(0.012 * s, 0.006 * s, (0.12 + rnd() * 0.18) * s), marca);
        const raio = R * Math.sqrt(Math.max(0.15, 1 - (z / (0.92 * s)) ** 2)) * 1.005;
        risco.position.set(Math.sin(a) * raio, Math.cos(a) * raio + 0.01 * s, z + 0.05 * s);
        risco.rotation.set(0, (rnd() - 0.5) * 0.9, -a);
        tronco.add(risco);
      }
    }
    let pesc = p.progress;
    const set = (v) => { pesc = v; pescoco.rotation.y = (v - 0.5) * Math.PI; pescoco.rotation.z = (v - 0.5) * -0.25; };
    set(pesc);
    g.userData.setProgress = set;
    g.userData.update = (t) => {
      const f = t * p.batida * Math.PI * 2;
      cauda.rotation.x = 0.32 * Math.sin(f);
      ponta.rotation.x = 0.35 * Math.sin(f - 0.9);
      tronco.rotation.x = -0.05 * Math.sin(f + 1.2);
      for (const { piv, sx } of nadadeiras) piv.rotation.z = sx * 0.18 * Math.sin(f * 0.5);
      pescoco.rotation.x = 0.04 * Math.sin(f * 0.5 + 0.5);
    };
    g.userData.update(0);
  },
});

register('sonar', {
  category: 'animais',
  label: 'Ondas de sonar (ecolocalização)',
  description: 'Cliques em arco saindo para a frente (+Z) e o eco voltando (amarelo), em ciclo. Para boto, morcego, submarino ou radar. Ponha na cabeça do animal (ou siga com a mesma anim/movimento).',
  params: {
    alcance: [3, 'até onde vão os cliques (m)'],
    cor: ['#8fe3ff', 'cor dos cliques'],
    eco: [true, 'mostra o eco voltando'],
    ritmo: [1.4, 'ciclos por segundo'],
    altura: [3.1, 'altura do centro acima da base (no animal, use a altura da cabeça)'],
  },
  variants: { radar: { cor: '#7dff9a', eco: false } },
  make(g, p) {
    const base = new THREE.Group();
    base.position.y = p.altura;
    g.add(base);
    const arco = (cor, op) => {
      const gr = new THREE.Group();
      const mat = new THREE.MeshBasicMaterial({ color: cor, transparent: true, opacity: op, depthWrite: false, side: THREE.DoubleSide });
      // arco centrado no eixo +X do toro; os grupos o deitam/levantam e apontam para +Z
      const fazArco = (deitado) => {
        const t = new THREE.Mesh(new THREE.TorusGeometry(1, 0.025, 6, 32, 1.3), mat);
        t.rotation.z = -0.65;
        const meio = new THREE.Group();
        meio.add(t);
        if (deitado) meio.rotation.x = Math.PI / 2;
        const fora = new THREE.Group();
        fora.add(meio);
        fora.rotation.y = -Math.PI / 2;
        return fora;
      };
      gr.add(fazArco(false), fazArco(true));
      base.add(gr);
      return { gr, mat };
    };
    const ida = [0, 1, 2, 3].map(() => arco(p.cor, 0.9));
    const volta = p.eco ? [0, 1].map(() => arco('#ffe066', 0.9)) : [];
    const desenhar = (t) => {
      const ciclo = (t * p.ritmo) % 1;
      ida.forEach(({ gr, mat }, i) => {
        const u = (ciclo + i / ida.length) % 1;
        const r = 0.1 + u * p.alcance;
        gr.scale.set(r, r, r);
        gr.position.z = 0;
        mat.opacity = 0.9 * (1 - u);
      });
      volta.forEach(({ gr, mat }, i) => {
        const u = (ciclo + 0.5 + i * 0.25) % 1;
        const r = 0.2 + (1 - u) * p.alcance * 0.5;
        gr.scale.set(-r * 0.6, r * 0.6, -r * 0.6);
        gr.position.z = p.alcance * 0.5 + (1 - u) * 0.1;
        mat.opacity = 0.75 * Math.sin(u * Math.PI);
      });
    };
    g.userData.update = desenhar;
    desenhar(0);
    g.traverse((o) => { if (o.isMesh) { o.castShadow = false; o.receiveShadow = false; } });
  },
});

register('termometro', {
  category: 'animais',
  label: 'Termômetro gigante',
  description: 'Termômetro de vidro com bulbo e coluna vermelha. setProgress(0..1) SOBE a coluna (de "minimo" a "maximo" °C nas marcas). Bom para calor, febre, seca, aquecimento.',
  params: { altura: [2.4, 'altura (m)'], progress: [0.5, 'nível 0..1'] },
  variants: { pequeno: { altura: 1.2 } },
  make(g, p) {
    const H = p.altura;
    const vidro = new THREE.MeshPhysicalMaterial({ color: '#e8f4ff', roughness: 0.05, transmission: 0.6, transparent: true, opacity: 0.45, depthWrite: false });
    const verm = new THREE.MeshStandardMaterial({ color: '#e5322d', emissive: '#e5322d', emissiveIntensity: 0.35, roughness: 0.4 });
    const r = H * 0.06;
    const bulbo = new THREE.Mesh(new THREE.SphereGeometry(r * 1.7, 24, 16), verm);
    bulbo.position.y = r * 1.7;
    const tubo = new THREE.Mesh(new THREE.CapsuleGeometry(r, H - r * 3.4, 8, 20), vidro);
    tubo.position.y = r * 1.7 + (H - r * 1.7) / 2;
    const coluna = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.55, r * 0.55, 1, 16), verm);
    g.add(bulbo, tubo, coluna);
    const base = new THREE.Mesh(new THREE.BoxGeometry(r * 4.2, H * 1.02, r * 0.6), new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.6 }));
    base.position.set(0, H / 2 + r * 0.6, -r * 1.3);
    g.add(base);
    for (let i = 0; i <= 8; i++) {
      const marca = new THREE.Mesh(new THREE.BoxGeometry(r * (i % 2 ? 0.9 : 1.6), r * 0.12, r * 0.1), new THREE.MeshBasicMaterial({ color: '#222' }));
      marca.position.set(r * 1.4, r * 3.6 + (H - r * 5) * (i / 8), -r * 0.95);
      g.add(marca);
    }
    const set = (v) => {
      const k = Math.min(1, Math.max(0, v));
      const h = r * 1.5 + (H - r * 4.5) * k;
      coluna.scale.y = h;
      coluna.position.y = r * 2.2 + h / 2;
    };
    set(p.progress);
    g.userData.setProgress = set;
  },
});

register('bandeirinhas', {
  category: 'animais',
  label: 'Bandeirinhas de festa junina',
  description: 'Varal de bandeirinhas coloridas entre dois postes (ao longo de X), balançando sozinho com o vento.',
  params: { comprimento: [10, 'distância entre os postes (m)'], altura: [3.6, 'altura do varal'], cores: [['#e5322d', '#f2c94c', '#2f80ed', '#27ae60', '#f2994a', '#bb6bd9'], 'cores das bandeiras'] },
  variants: { curto: { comprimento: 6 } },
  make(g, p) {
    const L = p.comprimento;
    const madeira = fosco('#8a5a34');
    for (const sx of [-1, 1]) {
      const poste = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, p.altura + 0.3, 8), madeira);
      poste.position.set((sx * L) / 2, (p.altura + 0.3) / 2, 0);
      g.add(poste);
    }
    const n = Math.max(6, Math.round(L / 0.42));
    const flags = [];
    const tri = new THREE.Shape();
    tri.moveTo(-0.16, 0);
    tri.lineTo(0.16, 0);
    tri.lineTo(0.16, -0.32);
    tri.lineTo(0, -0.22);
    tri.lineTo(-0.16, -0.32);
    tri.closePath();
    const geo = new THREE.ShapeGeometry(tri);
    const corda = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([...Array(11)].map((_, i) => {
      const x = -L / 2 + (L * i) / 10;
      return new THREE.Vector3(x, p.altura - 0.5 * (1 - ((2 * x) / L) ** 2), 0);
    })), 40, 0.012, 4), fosco('#ddd'));
    g.add(corda);
    for (let i = 0; i < n; i++) {
      const x = -L / 2 + (L * (i + 0.5)) / n;
      const f = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: p.cores[i % p.cores.length], side: THREE.DoubleSide, roughness: 0.7 }));
      f.position.set(x, p.altura - 0.5 * (1 - ((2 * x) / L) ** 2), 0);
      g.add(f);
      flags.push({ f, i });
    }
    g.userData.update = (t) => { for (const { f, i } of flags) f.rotation.x = 0.35 * Math.sin(t * 2.2 + i * 0.7); };
    g.userData.update(0);
  },
});

register('fogueira', {
  category: 'animais',
  label: 'Fogueira',
  description: 'Fogueira de toras cruzadas com brasa que pulsa sozinha. Junte um fluxo de "fogo" e de "fagulha" saindo do centro (y ~0,3).',
  params: { tamanho: [1, 'escala'] },
  variants: { grande: { tamanho: 1.6 } },
  make(g, p) {
    const s = p.tamanho;
    const madeira = fosco('#6b4423');
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const tora = new THREE.Mesh(new THREE.CylinderGeometry(0.07 * s, 0.09 * s, 1.1 * s, 8), madeira);
      tora.position.set(Math.cos(a) * 0.22 * s, 0.32 * s, Math.sin(a) * 0.22 * s);
      tora.rotation.set(Math.sin(a) * 0.55, 0, -Math.cos(a) * 0.55);
      g.add(tora);
    }
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * Math.PI * 2;
      const pedra = new THREE.Mesh(new THREE.IcosahedronGeometry(0.12 * s, 0), fosco('#7d7f86'));
      pedra.position.set(Math.cos(a) * 0.62 * s, 0.07 * s, Math.sin(a) * 0.62 * s);
      g.add(pedra);
    }
    const brasa = new THREE.Mesh(new THREE.SphereGeometry(0.25 * s, 14, 10), new THREE.MeshStandardMaterial({ color: '#ff7a1a', emissive: '#ff5a00', emissiveIntensity: 1.4 }));
    brasa.position.y = 0.12 * s;
    brasa.scale.y = 0.5;
    g.add(brasa);
    const luz = new THREE.PointLight('#ff8a3a', 6 * s, 9 * s, 2);
    luz.position.y = 0.8 * s;
    g.add(luz);
    g.userData.update = (t) => {
      const k = 1 + 0.18 * Math.sin(t * 9) + 0.1 * Math.sin(t * 23);
      brasa.material.emissiveIntensity = 1.4 * k;
      luz.intensity = 6 * s * k;
    };
  },
});

register('chapeu_panama', {
  category: 'animais',
  label: 'Chapéu panamá',
  description: 'Chapéu branco de aba com fita preta (o chapéu do moço da lenda do boto). Use anim.pos para tirá-lo da cabeça de um personagem.',
  params: { cor: ['#f4f1e8', 'cor do chapéu'], fita: ['#1e1e1e', 'cor da fita'], tamanho: [1, 'escala'] },
  variants: { palha: { cor: '#e2c98f', fita: '#7a4a2b' } },
  make(g, p) {
    const s = p.tamanho;
    const m = fosco(p.cor);
    const aba = new THREE.Mesh(new THREE.CylinderGeometry(0.3 * s, 0.3 * s, 0.02 * s, 28), m);
    aba.position.y = 0.01 * s;
    const copa = new THREE.Mesh(new THREE.CylinderGeometry(0.15 * s, 0.17 * s, 0.17 * s, 24), m);
    copa.position.y = 0.1 * s;
    const fita = new THREE.Mesh(new THREE.CylinderGeometry(0.172 * s, 0.172 * s, 0.045 * s, 24), fosco(p.fita));
    fita.position.y = 0.045 * s;
    g.add(aba, copa, fita);
  },
});
