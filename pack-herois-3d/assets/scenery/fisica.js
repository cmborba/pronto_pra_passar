// Física visual: ondas sonoras (efeito Doppler / barreira do som), cone de vapor e anel de choque (estrondo sônico).
// Objetos "andam" para +Z (a frente). Todos ignoram sombra; use com câmera lenta (anim/etapa devagar).

import * as THREE from 'three';
import { register, rng } from './kit.js';

const smooth = (x) => { x = Math.min(1, Math.max(0, x)); return x * x * (3 - 2 * x); };

register('ondas_som', {
  category: 'fisica',
  label: 'Ondas sonoras (Mach)',
  description: 'Frentes de onda do som emitidas por algo que anda para +Z (o diagrama clássico da aula de física, em 3D). setProgress(0..1) muda a velocidade: Mach = 1,25 × progress. Abaixo de Mach 1 as ondas ficam espaçadas na frente; em 0,8 (Mach 1) todas se tocam na frente (a barreira do som); acima, formam o cone de Mach. A fonte fica em y = "altura".',
  params: {
    raio: [3, 'raio da onda mais antiga (m)'],
    ondas: [7, 'quantidade de frentes de onda'],
    altura: [3, 'altura da fonte (o centro das ondas) acima da base'],
    cor: ['#8fd3ff', 'cor das ondas'],
    progress: [0.8, 'velocidade: Mach = 1,25 × progress'],
  },
  variants: { subsonico: { progress: 0.4 }, supersonico: { progress: 1 } },
  make(g, p) {
    const base = new THREE.Group();
    base.position.y = p.altura;
    g.add(base);
    const casca = new THREE.MeshStandardMaterial({ color: p.cor, emissive: p.cor, emissiveIntensity: 0.35, transparent: true, opacity: 0.1, depthWrite: false, side: THREE.DoubleSide, roughness: 1 });
    const linha = new THREE.MeshBasicMaterial({ color: '#e6f7ff', transparent: true, opacity: 0.85 });
    const ondas = [];
    for (let i = 1; i <= p.ondas; i++) {
      const o = new THREE.Group();
      base.add(o);
      o.add(new THREE.Mesh(new THREE.SphereGeometry(1, 28, 18), casca));
      // anel no plano vertical que contém a direção do movimento (lido de lado) e outro deitado
      const a1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.012, 6, 64), linha);
      a1.rotation.y = Math.PI / 2;
      const a2 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.008, 6, 64), linha);
      a2.rotation.x = Math.PI / 2;
      o.add(a1, a2);
      ondas.push({ o, k: i / p.ondas, a1, a2 });
    }
    // ponto da fonte
    base.add(new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 8), new THREE.MeshBasicMaterial({ color: '#ffffff' })));
    let mach = 1;
    let tempo = 0;
    const desenhar = () => {
      for (const { o, k, a1, a2 } of ondas) {
        const r = p.raio * k * (1 + 0.015 * Math.sin(tempo * 3 + k * 9));
        o.scale.setScalar(r);
        o.position.z = -mach * p.raio * k; // emitida quando a fonte estava mais atrás
        const esp = 1 / Math.max(0.3, r);
        a1.scale.set(1, 1, esp);
        a2.scale.set(1, 1, esp);
      }
    };
    g.userData.setProgress = (v) => { mach = 1.25 * v; desenhar(); };
    g.userData.update = (t) => { tempo = t; desenhar(); };
    g.userData.setProgress(p.progress);
    g.traverse((o) => { if (o.isMesh) { o.castShadow = false; o.receiveShadow = false; } });
  },
});

register('cone_vapor', {
  category: 'fisica',
  label: 'Cone de vapor',
  description: 'Nuvem branca em forma de cone em volta de algo perto da velocidade do som (a umidade do ar condensa quando a pressão cai). Bico para +Z. setProgress(0..1) faz a nuvem aparecer e crescer; ela tremula sozinha. O eixo fica em y = "altura".',
  params: {
    comprimento: [2.4, 'comprimento do cone (m)'],
    raio: [1.1, 'raio da boca (m)'],
    altura: [1.2, 'altura do eixo acima da base'],
    progress: [1, 'quanto já se formou 0..1'],
  },
  variants: { pequeno: { comprimento: 1.4, raio: 0.7 } },
  make(g, p) {
    const base = new THREE.Group();
    base.position.y = p.altura;
    g.add(base);
    const rnd = rng(17);
    const camadas = [];
    for (const [esc, op] of [[1, 0.5], [1.12, 0.26], [0.86, 0.32]]) {
      const geo = new THREE.ConeGeometry(p.raio * esc, p.comprimento * esc, 28, 8, true);
      const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const y = pos.getY(i);
        const borda = (p.comprimento * esc / 2 - y) / (p.comprimento * esc); // 0 no bico, 1 na boca
        const ruido = 1 + (rnd() - 0.5) * 0.35 * borda;
        pos.setX(i, pos.getX(i) * ruido);
        pos.setZ(i, pos.getZ(i) * ruido);
        pos.setY(i, y - borda * borda * rnd() * 0.25 * p.comprimento);
      }
      geo.computeVertexNormals();
      geo.rotateX(Math.PI / 2); // bico (topo do cone) para +Z
      geo.translate(0, 0, -p.comprimento * esc / 2 + 0.35);
      const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: '#ffffff', emissive: '#eef7ff', emissiveIntensity: 0.4, transparent: true, opacity: op, depthWrite: false, side: THREE.DoubleSide, roughness: 1, flatShading: true }));
      base.add(m);
      camadas.push({ m, op });
    }
    let prog = p.progress;
    let tempo = 0;
    const desenhar = () => {
      const k = smooth(prog);
      camadas.forEach(({ m, op }, i) => {
        m.visible = k > 0.01;
        m.material.opacity = op * k;
        const s = 0.3 + 0.7 * k;
        const tre = 1 + 0.04 * Math.sin(tempo * 7 + i * 2);
        m.scale.set(s * tre, s / tre, 0.4 + 0.6 * k);
      });
    };
    g.userData.setProgress = (v) => { prog = v; desenhar(); };
    g.userData.update = (t) => { tempo = t; desenhar(); };
    desenhar();
    g.traverse((o) => { if (o.isMesh) { o.castShadow = false; o.receiveShadow = false; } });
  },
});

register('anel_choque', {
  category: 'fisica',
  label: 'Anel de choque (estrondo)',
  description: 'Onda de choque que se espalha pelo chão a partir do centro (estrondo sônico, explosão, impacto). setProgress(0..1) faz o anel e a cúpula translúcida crescerem até "raio" e sumirem.',
  params: {
    raio: [20, 'raio final (m)'],
    cor: ['#ffffff', 'cor'],
    progress: [0.4, 'quanto já se espalhou 0..1'],
  },
  variants: { pequeno: { raio: 6 } },
  make(g, p) {
    const anel = new THREE.Mesh(new THREE.TorusGeometry(1, 0.06, 8, 72), new THREE.MeshBasicMaterial({ color: p.cor, transparent: true, opacity: 0.9, depthWrite: false }));
    anel.rotation.x = Math.PI / 2;
    anel.position.y = 0.15;
    const cupula = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 12, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshStandardMaterial({ color: '#dff2ff', emissive: '#dff2ff', emissiveIntensity: 0.3, transparent: true, opacity: 0.2, depthWrite: false, side: THREE.DoubleSide }));
    g.add(anel, cupula);
    const set = (v) => {
      const k = smooth(v);
      const r = Math.max(0.01, p.raio * k);
      anel.scale.set(r, r, 1 + r * 0.25);
      cupula.scale.set(r, r * 0.35, r);
      const f = v <= 0.001 ? 0 : 1 - smooth((v - 0.35) / 0.65);
      anel.material.opacity = 0.9 * f;
      cupula.material.opacity = 0.22 * f;
      anel.visible = cupula.visible = f > 0.01;
    };
    set(p.progress);
    g.userData.setProgress = set;
    g.traverse((o) => { if (o.isMesh) { o.castShadow = false; o.receiveShadow = false; } });
  },
});
