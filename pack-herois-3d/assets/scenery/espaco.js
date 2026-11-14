// Espaço e impactos: cratera (com bairro dentro), meteoro em bola de fogo, pedra que brilha e sonda de perfuração.

import * as THREE from 'three';
import { register, rng } from './kit.js';

const smooth = (x) => { x = Math.min(1, Math.max(0, x)); return x * x * (3 - 2 * x); };

register('cratera', {
  category: 'espaco',
  label: 'Cratera de impacto',
  description: 'Cratera redonda com borda elevada (anel de morros) e fundo plano. Com "casas" > 0 ganha um bairro inteiro dentro (casinhas com janelas acesas, ruas e postes), como a Cratera de Colônia, em São Paulo. setProgress(0..1) FORMA a cratera (a borda sobe). Vista de cima mostra o círculo perfeito.',
  params: {
    raio: [60, 'raio até o topo da borda (m)'],
    altura: [8, 'altura da borda (m)'],
    casas: [0, 'quantas casinhas dentro (0 = cratera vazia)'],
    cor: ['#3f7a48', 'cor da borda (vegetação)'],
    fundo: ['#5d7a4c', 'cor do fundo'],
    progress: [1, 'quanto a cratera já se formou 0..1'],
  },
  variants: { colonia: { casas: 150 }, recente: { cor: '#8a7a62', fundo: '#5a4a3a' } },
  make(g, p) {
    const R = p.raio;
    const h = p.altura;
    const rnd = rng(41);
    const corpo = new THREE.Group();
    g.add(corpo);
    const perfil = [[0.001, 0.05], [R * 0.7, 0.05], [R * 0.82, h * 0.35], [R * 0.93, h * 0.85], [R, h], [R * 1.1, h * 0.7], [R * 1.28, h * 0.25], [R * 1.5, 0.02]];
    const geo = new THREE.LatheGeometry(perfil.map(([r, y]) => new THREE.Vector2(r, y)), 48);
    const pos = geo.attributes.position;
    const cores = new Float32Array(pos.count * 3);
    const cB = new THREE.Color(p.cor);
    const cF = new THREE.Color(p.fundo);
    const c = new THREE.Color();
    const ruido = new Map();
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      const r = Math.hypot(x, z);
      // mesma variação para vértices coincidentes (costura do torno)
      const chave = `${Math.round(r * 10)}:${Math.round(Math.atan2(z, x) * 20 + 100) % 126}`;
      if (!ruido.has(chave)) ruido.set(chave, rnd());
      const k = ruido.get(chave);
      if (y > 0.1) pos.setY(i, y * (0.8 + 0.4 * k));
      c.copy(cF).lerp(cB, smooth((r - R * 0.68) / (R * 0.2))).multiplyScalar(0.88 + 0.24 * k);
      cores.set([c.r, c.g, c.b], i * 3);
    }
    geo.setAttribute('color', new THREE.BufferAttribute(cores, 3));
    geo.computeVertexNormals();
    const terreno = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, flatShading: true }));
    terreno.receiveShadow = true;
    corpo.add(terreno);

    if (p.casas > 0) {
      const n = Math.floor(p.casas);
      const M = new THREE.Matrix4();
      const Q = new THREE.Quaternion();
      const P = new THREE.Vector3();
      const S = new THREE.Vector3();
      const paredes = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ roughness: 0.9 }), n);
      const telhadoGeo = new THREE.ConeGeometry(0.82, 0.6, 4);
      telhadoGeo.rotateY(Math.PI / 4);
      const telhados = new THREE.InstancedMesh(telhadoGeo, new THREE.MeshStandardMaterial({ roughness: 0.9 }), n);
      const janelas = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: '#ffd98a', emissive: '#ffc85a', emissiveIntensity: 1.6 }), n * 2);
      const coresParede = ['#f2e2bf', '#e8d0b0', '#d9e4ef', '#f0c9b0', '#cfe3c4', '#f2e6a6'].map((x) => new THREE.Color(x));
      const coresTelhado = ['#c8593a', '#a8402c', '#7b8794', '#d2693a'].map((x) => new THREE.Color(x));
      const passo = (R * 1.3) / Math.ceil(Math.sqrt(n * 1.6));
      const vagas = [];
      for (let gx = -R * 0.65; gx <= R * 0.65; gx += passo) {
        for (let gz = -R * 0.65; gz <= R * 0.65; gz += passo) {
          const rua = Math.abs(gx) < passo * 0.5 || Math.abs(gz) < passo * 0.5;
          if (!rua && Math.hypot(gx, gz) < R * 0.62) vagas.push([gx, gz, rnd()]);
        }
      }
      vagas.sort((a, b) => a[2] - b[2]);
      const usadas = vagas.slice(0, n);
      usadas.forEach(([x, z], i) => {
        const w = 2.6 + rnd() * 1.6;
        const d = 2.6 + rnd() * 1.4;
        const a = 2.4 + (rnd() < 0.15 ? 2.6 : rnd() * 0.8);
        const px = x + (rnd() - 0.5) * passo * 0.35;
        const pz = z + (rnd() - 0.5) * passo * 0.35;
        const giro = Math.round(rnd() * 3) * (Math.PI / 2);
        Q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), giro);
        M.compose(P.set(px, a / 2 + 0.05, pz), Q, S.set(w, a, d));
        paredes.setMatrixAt(i, M);
        paredes.setColorAt(i, coresParede[i % coresParede.length]);
        M.compose(P.set(px, a + 0.05 + 0.5, pz), Q, S.set(w * 0.95, 1.7, d * 0.95));
        telhados.setMatrixAt(i, M);
        telhados.setColorAt(i, coresTelhado[i % coresTelhado.length]);
        // duas janelas acesas (frente e lado)
        const fx = Math.sin(giro);
        const fz = Math.cos(giro);
        M.compose(P.set(px + fx * (d / 2 + 0.02) * (Math.abs(fx) > 0.5 ? w / d : 1), a * 0.55, pz + fz * (d / 2 + 0.02)), Q, S.set(w * 0.34, a * 0.3, 0.06));
        janelas.setMatrixAt(i * 2, M);
        M.compose(P.set(px - fx * (d / 2 + 0.02) * (Math.abs(fx) > 0.5 ? w / d : 1), a * 0.55, pz - fz * (d / 2 + 0.02)), Q, S.set(w * 0.3, a * 0.28, 0.06));
        janelas.setMatrixAt(i * 2 + 1, M);
      });
      for (const im of [paredes, telhados, janelas]) { im.count = im === janelas ? usadas.length * 2 : usadas.length; im.instanceMatrix.needsUpdate = true; if (im.instanceColor) im.instanceColor.needsUpdate = true; im.frustumCulled = false; corpo.add(im); }
      paredes.castShadow = true;
      telhados.castShadow = true;
      // ruas em cruz + anel
      const asfalto = new THREE.MeshStandardMaterial({ color: '#3a3d44', roughness: 1 });
      for (const rot of [0, Math.PI / 2]) {
        const rua = new THREE.Mesh(new THREE.BoxGeometry(R * 1.3, 0.06, passo * 0.55), asfalto);
        rua.position.y = 0.09;
        rua.rotation.y = rot;
        corpo.add(rua);
      }
      const anel = new THREE.Mesh(new THREE.TorusGeometry(R * 0.66, passo * 0.22, 4, 48), asfalto);
      anel.rotation.x = Math.PI / 2;
      anel.scale.z = 0.04;
      anel.position.y = 0.09;
      corpo.add(anel);
      // postes: pontinhos de luz ao longo das ruas
      const lamp = new THREE.InstancedMesh(new THREE.SphereGeometry(0.28, 8, 6), new THREE.MeshBasicMaterial({ color: '#ffe9a8' }), 40);
      for (let i = 0; i < 40; i++) {
        const t = (i % 20) / 19 - 0.5;
        const eixo = i < 20;
        M.compose(P.set(eixo ? t * R * 1.2 : passo * 0.4, 3.2, eixo ? passo * 0.4 : t * R * 1.2), Q.identity(), S.set(1, 1, 1));
        lamp.setMatrixAt(i, M);
      }
      lamp.frustumCulled = false;
      corpo.add(lamp);
    }
    const set = (v) => { corpo.scale.y = Math.max(0.02, smooth(v)); };
    set(p.progress);
    g.userData.setProgress = set;
  },
});

register('meteoro', {
  category: 'espaco',
  label: 'Meteoro (bola de fogo)',
  description: 'Bola de fogo com núcleo claro, halo e cauda comprida, voando para +Z (a cauda fica para trás). Tremula sozinha e ilumina em volta. Mova com movimentos ou anim.pos; gire com "giro" e anim (eixo x) para descer inclinada.',
  params: { raio: [0.6, 'raio do núcleo (m)'], cauda: [14, 'comprimento da cauda (em raios)'], cor: ['#ff8a2a', 'cor do fogo'], luz: [true, 'ilumina o cenário em volta'] },
  variants: { verde: { cor: '#5dffc8' }, gigante: { raio: 3, luz: false } },
  make(g, p) {
    const r = p.raio;
    const nucleo = new THREE.Mesh(new THREE.IcosahedronGeometry(r, 2), new THREE.MeshBasicMaterial({ color: '#fff6d8', fog: false }));
    const halo = new THREE.Mesh(new THREE.SphereGeometry(r * 1.9, 20, 14), new THREE.MeshBasicMaterial({ color: p.cor, transparent: true, opacity: 0.45, depthWrite: false, fog: false, blending: THREE.AdditiveBlending }));
    halo.userData.foraDaCaixa = true;
    g.add(nucleo, halo);
    const caudas = [];
    for (const [esc, comp, op, cor] of [[1.25, 1, 0.5, '#fff0c0'], [1.9, 0.75, 0.32, p.cor], [2.6, 0.5, 0.2, '#ff4a1a']]) {
      const L = r * p.cauda * comp;
      const geo = new THREE.ConeGeometry(r * esc, L, 16, 1, true);
      geo.rotateX(-Math.PI / 2); // ponta para -Z (lá atrás)
      geo.translate(0, 0, -L / 2); // base larga na cabeça
      const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: cor, transparent: true, opacity: op, depthWrite: false, side: THREE.DoubleSide, fog: false, blending: THREE.AdditiveBlending }));
      m.userData.foraDaCaixa = true;
      g.add(m);
      caudas.push(m);
    }
    let luz = null;
    if (p.luz) {
      luz = new THREE.PointLight(p.cor, 60 * r, 60, 1.6);
      g.add(luz);
    }
    g.userData.update = (t) => {
      const k = 1 + 0.12 * Math.sin(t * 31) + 0.08 * Math.sin(t * 57);
      halo.scale.setScalar(k);
      caudas.forEach((m, i) => { m.scale.x = m.scale.y = 1 + 0.1 * Math.sin(t * 23 + i * 2); });
      if (luz) luz.intensity = 60 * r * k;
    };
    for (const f of g.children) f.position.y += r * 1.05; // núcleo acima da base (y = 0)
    g.traverse((o) => { if (o.isMesh) { o.castShadow = false; o.receiveShadow = false; o.frustumCulled = false; } });
  },
});

register('pedra_brilhante', {
  category: 'espaco',
  label: 'Pedra que brilha (meteorito misterioso)',
  description: 'Pedra escura e irregular com rachaduras que brilham e um halo de luz que pulsa e ilumina em volta. setProgress(0..1) controla o brilho (0 = apagada).',
  params: { tamanho: [0.5, 'raio aproximado (m)'], cor: ['#5dffc8', 'cor do brilho'], progress: [1, 'brilho 0..1'] },
  variants: { laranja: { cor: '#ff8a2a' }, grande: { tamanho: 1.2 } },
  make(g, p) {
    const T = p.tamanho;
    const rnd = rng(77);
    const geo = new THREE.IcosahedronGeometry(1, 2);
    const pos = geo.attributes.position;
    const amp = new Map();
    for (let i = 0; i < pos.count; i++) {
      const chave = `${pos.getX(i).toFixed(2)}:${pos.getY(i).toFixed(2)}:${pos.getZ(i).toFixed(2)}`;
      if (!amp.has(chave)) amp.set(chave, 0.86 + rnd() * 0.3);
      const k = amp.get(chave);
      pos.setXYZ(i, pos.getX(i) * k, pos.getY(i) * k, pos.getZ(i) * k);
    }
    geo.computeVertexNormals();
    const base = new THREE.Group();
    base.position.y = T * 0.92;
    base.scale.set(T, T * 0.78, T * 0.9);
    g.add(base);
    const rocha = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: '#2b2e36', roughness: 0.75, metalness: 0.3, flatShading: true }));
    rocha.castShadow = true;
    // miolo luminoso: aparece nas partes mais fundas da casca (as "rachaduras")
    const miolo = new THREE.Mesh(new THREE.IcosahedronGeometry(0.93, 1), new THREE.MeshBasicMaterial({ color: p.cor }));
    miolo.rotation.set(0.4, 0.9, 0.2);
    const halo = new THREE.Mesh(new THREE.SphereGeometry(1.45, 20, 14), new THREE.MeshBasicMaterial({ color: p.cor, transparent: true, opacity: 0.05, depthWrite: false, blending: THREE.AdditiveBlending }));
    const halo2 = new THREE.Mesh(new THREE.SphereGeometry(2.0, 20, 14), new THREE.MeshBasicMaterial({ color: p.cor, transparent: true, opacity: 0.035, depthWrite: false, blending: THREE.AdditiveBlending }));
    halo.userData.foraDaCaixa = true;
    halo2.userData.foraDaCaixa = true;
    base.add(rocha, miolo, halo, halo2);
    const luz = new THREE.PointLight(p.cor, 4, 11, 1.8);
    luz.position.y = T * 1.4;
    g.add(luz);
    let brilho = p.progress;
    let tempo = 0;
    const desenhar = () => {
      const k = brilho * (1 + 0.22 * Math.sin(tempo * 3.1) + 0.08 * Math.sin(tempo * 11));
      miolo.visible = brilho > 0.02;
      halo.material.opacity = 0.05 * k;
      halo2.material.opacity = 0.018 * k;
      halo.scale.setScalar(1 + 0.06 * Math.sin(tempo * 3.1));
      luz.intensity = 4.5 * T * 2 * k;
    };
    g.userData.setProgress = (v) => { brilho = v; desenhar(); };
    g.userData.update = (t) => { tempo = t; desenhar(); };
    desenhar();
  },
});

register('sonda', {
  category: 'espaco',
  label: 'Sonda de perfuração',
  description: 'Tripé de perfuração geológica com broca girando sozinha. setProgress(0..1) faz subir o testemunho (o cilindro de rocha tirado do fundo), com camadas coloridas.',
  params: { altura: [4, 'altura do tripé (m)'], progress: [0, 'quanto do testemunho já subiu 0..1'] },
  variants: {},
  make(g, p) {
    const H = p.altura;
    const metal = new THREE.MeshStandardMaterial({ color: '#f2c94c', roughness: 0.5, metalness: 0.3 });
    const aco = new THREE.MeshStandardMaterial({ color: '#7b8794', roughness: 0.4, metalness: 0.6 });
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * Math.PI * 2 + 0.5;
      const perna = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, H * 1.08, 8), metal);
      perna.position.set(Math.cos(a) * H * 0.2, H / 2, Math.sin(a) * H * 0.2);
      perna.rotation.set(Math.sin(a) * 0.38, 0, -Math.cos(a) * 0.38);
      perna.castShadow = true;
      g.add(perna);
    }
    const topo = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.35, 0.5), metal);
    topo.position.y = H;
    g.add(topo);
    const broca = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, H * 0.95, 8), aco);
    broca.position.y = H * 0.5;
    g.add(broca);
    const rosca = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.035, 6, 12), aco);
    rosca.rotation.x = Math.PI / 2;
    rosca.position.y = 0.25;
    g.add(rosca);
    // testemunho: cilindro em camadas que sobe ao lado
    const nucleo = new THREE.Group();
    nucleo.position.set(0.7, 0, 0.4);
    g.add(nucleo);
    const camadas = ['#7a5a3a', '#b8a078', '#5a5f6a', '#d9c7a0', '#3a3d44', '#9a6a4a'];
    camadas.forEach((cor, i) => {
      const fatia = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.42, 14), new THREE.MeshStandardMaterial({ color: cor, roughness: 0.9 }));
      fatia.position.y = 0.21 + i * 0.42;
      nucleo.add(fatia);
    });
    const set = (v) => { nucleo.scale.y = Math.max(0.001, smooth(v)); nucleo.visible = v > 0.01; };
    set(p.progress);
    g.userData.setProgress = set;
    g.userData.update = (t) => { broca.rotation.y = t * 9; rosca.rotation.z = t * 9; rosca.position.y = 0.25 + 0.06 * Math.sin(t * 6); };
  },
});
