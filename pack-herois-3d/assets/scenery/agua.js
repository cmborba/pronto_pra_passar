// Água: nível que sobe (maré, enchente, represa) e onda que avança. Superfícies animadas em função de t.

import * as THREE from 'three';
import { register, rng } from './kit.js';

const smooth = (x) => { x = Math.min(1, Math.max(0, x)); return x * x * (3 - 2 * x); };

register('agua_nivel', {
  category: 'agua',
  label: 'Nível de água',
  description: 'Bloco de água com superfície ondulando sozinha. setProgress(0..1) faz o NÍVEL SUBIR de 0 até "altura" (maré alta, enchente, alagamento). Translúcida: casas e pernas aparecem por baixo.',
  params: {
    tamanho: [[20, 20], '[largura x, comprimento z] em metros'],
    altura: [2, 'altura máxima do nível (m)'],
    cor: ['#2f8fd6', 'cor da água'],
    espuma: [true, 'pontinhos de espuma na superfície'],
    progress: [1, 'nível 0..1'],
  },
  variants: { enchente: { cor: '#7a6a4a' }, mar: { tamanho: [60, 40], altura: 3 } },
  make(g, p) {
    const [W, L] = p.tamanho;
    const seg = Math.max(8, Math.min(60, Math.round(Math.max(W, L) / 1.2)));
    const supGeo = new THREE.PlaneGeometry(W, L, seg, seg);
    supGeo.rotateX(-Math.PI / 2);
    const base = supGeo.attributes.position.array.slice();
    const agua = new THREE.MeshStandardMaterial({ color: p.cor, roughness: 0.2, metalness: 0.1, transparent: true, opacity: 0.86, flatShading: true });
    const sup = new THREE.Mesh(supGeo, agua);
    const corpo = new THREE.Mesh(new THREE.BoxGeometry(W, 1, L), new THREE.MeshStandardMaterial({ color: p.cor, roughness: 0.3, transparent: true, opacity: 0.6, depthWrite: false }));
    g.add(corpo, sup);
    const espumas = [];
    if (p.espuma) {
      const rnd = rng(5);
      const geo = new THREE.IcosahedronGeometry(1, 0);
      const mat = new THREE.MeshStandardMaterial({ color: '#ffffff', emissive: '#dff3ff', emissiveIntensity: 0.45, roughness: 1, flatShading: true });
      for (let i = 0; i < Math.round((W * L) / 14); i++) {
        const m = new THREE.Mesh(geo, mat);
        m.userData.b = [(rnd() - 0.5) * W * 0.96, (rnd() - 0.5) * L * 0.96, 0.08 + rnd() * 0.12, rnd() * 6];
        g.add(m);
        espumas.push(m);
      }
    }
    let nivel = 0.02;
    let tempo = 0;
    const onda = (x, z, t) => 0.12 * Math.sin(x * 0.7 + t * 1.8) + 0.08 * Math.sin(z * 0.9 - t * 1.3) + 0.05 * Math.sin((x + z) * 1.7 + t * 2.6);
    const desenhar = () => {
      const pos = supGeo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const x = base[i * 3];
        const z = base[i * 3 + 2];
        pos.setY(i, nivel + onda(x, z, tempo));
      }
      pos.needsUpdate = true;
      supGeo.computeVertexNormals();
      corpo.scale.y = Math.max(0.01, nivel - 0.05);
      corpo.position.y = Math.max(0.01, nivel - 0.05) / 2;
      corpo.visible = nivel > 0.08;
      for (const m of espumas) {
        const [x, z, s, f] = m.userData.b;
        m.position.set(x, nivel + onda(x, z, tempo) + 0.03, z);
        m.scale.set(s * 1.6, s * 0.5, s);
        m.rotation.y = f + tempo * 0.3;
      }
    };
    g.userData.setProgress = (v) => { nivel = 0.02 + smooth(v) * p.altura; desenhar(); };
    g.userData.update = (t) => { tempo = t; desenhar(); };
    g.userData.setProgress(p.progress);
    sup.receiveShadow = true;
  },
});

register('onda', {
  category: 'agua',
  label: 'Onda gigante',
  description: 'Crista de onda com espuma, voltada para +Z (avança para a frente). Mova com "movimentos" ou anim.pos; a espuma borbulha sozinha. Combine com agua_nivel subindo atrás e um fluxo de "agua" na crista.',
  params: {
    largura: [16, 'largura da onda (m)'],
    altura: [4, 'altura da crista (m)'],
    cor: ['#2f8fd6', 'cor da água'],
  },
  variants: { pequena: { largura: 8, altura: 1.8 } },
  make(g, p) {
    const H = p.altura;
    const W = p.largura;
    // perfil da onda (lado): sobe suave atrás, crista curvada para a frente
    const perfil = new THREE.Shape();
    perfil.moveTo(-H * 2.6, 0);
    perfil.bezierCurveTo(-H * 1.6, H * 0.15, -H * 0.9, H * 0.8, -H * 0.25, H * 1.0);
    perfil.bezierCurveTo(H * 0.25, H * 1.08, H * 0.6, H * 0.9, H * 0.55, H * 0.6);
    perfil.bezierCurveTo(H * 0.35, H * 0.7, H * 0.2, H * 0.55, H * 0.3, H * 0.25);
    perfil.lineTo(H * 0.45, 0);
    perfil.closePath();
    const geo = new THREE.ExtrudeGeometry(perfil, { depth: W, bevelEnabled: false, curveSegments: 10 });
    geo.translate(0, 0, -W / 2);
    geo.rotateY(-Math.PI / 2); // perfil (x) passa a apontar para +Z
    const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: p.cor, roughness: 0.25, metalness: 0.1, flatShading: true, transparent: true, opacity: 0.92 }));
    m.castShadow = true;
    g.add(m);
    const rnd = rng(8);
    const espuma = [];
    const mat = new THREE.MeshStandardMaterial({ color: '#ffffff', emissive: '#dff3ff', emissiveIntensity: 0.45, roughness: 1, flatShading: true });
    for (let i = 0; i < Math.round(W * 3); i++) {
      const b = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 0), mat);
      b.userData.b = [(rnd() - 0.5) * W, H * (0.25 + rnd() * 0.35), H * (0.8 + rnd() * 0.3), 0.15 + rnd() * 0.3, rnd() * 6];
      g.add(b);
      espuma.push(b);
    }
    const desenhar = (t) => {
      for (const b of espuma) {
        const [x, z, y, s, f] = b.userData.b;
        b.position.set(x, y + 0.12 * Math.sin(t * 6 + f), z + 0.1 * Math.sin(t * 4 + f));
        b.scale.setScalar(s * (1 + 0.25 * Math.sin(t * 5 + f)));
      }
    };
    g.userData.update = desenhar;
    desenhar(0);
  },
});
