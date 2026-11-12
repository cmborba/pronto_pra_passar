// Céu e espaço: Lua (que racha em pedaços) e anel de pedras (que se forma a partir de um ponto).
// Para o céu, use "apoiada": false e ponha o objeto alto e longe. Eles ignoram a neblina (fog).

import * as THREE from 'three';
import { register, rng } from './kit.js';

const smooth = (x) => { x = Math.min(1, Math.max(0, x)); return x * x * (3 - 2 * x); };

register('lua', {
  category: 'ceu',
  label: 'Lua',
  description: 'Lua low-poly brilhante com crateras. setProgress(0..1) RACHA a Lua em 3 pedaços que se afastam girando (0 = inteira). Para o céu use apoiada: false, ponha alta e longe e use anim.escala para ela "chegar perto".',
  params: {
    raio: [3, 'raio em metros'],
    cor: ['#efe8d2', 'cor da superfície'],
    brilho: [0.55, 'quanto brilha sozinha (0..1.5)'],
    halo: [true, 'halo de luz em volta'],
    apoiada: [true, 'true: base no chão; false: centro na origem (céu)'],
    progress: [0, 'quanto já rachou 0..1'],
  },
  variants: { cheia: { brilho: 0.8 }, rachada: { progress: 0.5 } },
  make(g, p) {
    const R = p.raio;
    const base = new THREE.Group();
    base.position.y = p.apoiada ? R * (p.halo ? 1.45 : 1) : 0;
    g.add(base);
    const sup = new THREE.MeshStandardMaterial({ color: p.cor, emissive: p.cor, emissiveIntensity: p.brilho, roughness: 1, flatShading: true, fog: false });
    const cratera = new THREE.MeshStandardMaterial({ color: '#c9bfa3', emissive: '#c9bfa3', emissiveIntensity: p.brilho * 0.8, roughness: 1, flatShading: true, fog: false });
    const miolo = new THREE.MeshStandardMaterial({ color: '#9a8c74', emissive: '#7a6a52', emissiveIntensity: p.brilho * 0.5, roughness: 1, flatShading: true, fog: false, side: THREE.DoubleSide });
    const rnd = rng(11);
    const fatias = [];
    const N = 3;
    for (let k = 0; k < N; k++) {
      const phi0 = (k / N) * Math.PI * 2;
      const dphi = (Math.PI * 2) / N;
      const peca = new THREE.Group();
      base.add(peca);
      peca.add(new THREE.Mesh(new THREE.SphereGeometry(R, 14, 10, phi0, dphi), sup));
      // tampas das faces de corte (meio disco no plano que contém o eixo y)
      for (const phi of [phi0, phi0 + dphi]) {
        const tampa = new THREE.Mesh(new THREE.CircleGeometry(R * 0.995, 14, -Math.PI / 2, Math.PI), miolo);
        tampa.rotation.y = Math.PI - phi;
        peca.add(tampa);
      }
      // crateras nesta fatia
      for (let c = 0; c < 4; c++) {
        const phi = phi0 + dphi * (0.2 + 0.6 * rnd());
        const th = 0.5 + rnd() * 2.1;
        const r = R * (0.1 + rnd() * 0.12);
        const m = new THREE.Mesh(new THREE.SphereGeometry(1, 8, 6), cratera);
        m.scale.set(r, r, r * 0.35);
        const dir = new THREE.Vector3(-Math.cos(phi) * Math.sin(th), Math.cos(th), Math.sin(phi) * Math.sin(th));
        m.position.copy(dir).multiplyScalar(R * 0.985);
        m.lookAt(dir.clone().multiplyScalar(R * 2));
        peca.add(m);
      }
      const meio = phi0 + dphi / 2;
      fatias.push({ peca, dir: new THREE.Vector3(-Math.cos(meio), 0.15 * (k - 1), Math.sin(meio)).normalize(), gira: (k % 2 ? 1 : -1) * (0.6 + 0.3 * k) });
    }
    let halo = null;
    if (p.halo) {
      halo = new THREE.Mesh(new THREE.SphereGeometry(R * 1.45, 20, 14), new THREE.MeshBasicMaterial({ color: '#fff3c9', transparent: true, opacity: 0.16, depthWrite: false, fog: false }));
      base.add(halo);
    }
    // rachaduras finas que aparecem antes de abrir (0 a 0,2)
    const linhaMat = new THREE.MeshBasicMaterial({ color: '#4a3f30', transparent: true, opacity: 0, fog: false });
    const linhas = [];
    for (let k = 0; k < N; k++) {
      const l = new THREE.Mesh(new THREE.TorusGeometry(R * 1.002, R * 0.018, 4, 40, Math.PI), linhaMat);
      l.rotation.set(0, Math.PI - (k / N) * Math.PI * 2, Math.PI / 2);
      base.add(l);
      linhas.push(l);
    }
    const set = (v) => {
      const abre = smooth((v - 0.12) / 0.88);
      fatias.forEach(({ peca, dir, gira }) => {
        peca.position.copy(dir).multiplyScalar(R * 1.8 * abre);
        peca.rotation.set(gira * 0.7 * abre, gira * 0.4 * abre, gira * abre);
      });
      linhaMat.opacity = Math.min(1, v / 0.08) * (1 - abre);
      linhas.forEach((l) => { l.visible = v > 0.001 && abre < 0.98; });
      if (halo) halo.material.opacity = 0.16 * (1 - abre);
    };
    set(p.progress);
    g.userData.setProgress = set;
    g.traverse((o) => { if (o.isMesh) { o.castShadow = false; o.receiveShadow = false; } });
  },
});

register('anel_pedras', {
  category: 'ceu',
  label: 'Anel de pedras',
  description: 'Anel de pedras e poeira (como os de Saturno), girando devagar. setProgress(0..1) FORMA o anel: as pedras se espalham a partir do ponto "origem" (graus) até fechar a volta. Use apoiada: false para pôr o centro onde quiser.',
  params: {
    raio: [60, 'raio do anel (m)'],
    largura: [8, 'largura da faixa (m)'],
    inclinacao: [70, 'inclinação do plano do anel (graus; 0 = deitado)'],
    origem: [90, 'ângulo (graus) de onde as pedras partem'],
    pedras: [700, 'quantidade de pedras'],
    tamanhoPedra: [1, 'multiplica o tamanho das pedras (anéis grandes e distantes: 3 a 5)'],
    cor: ['#cfc4a8', 'cor das pedras'],
    velocidade: [2, 'giro (graus/s)'],
    apoiada: [true, 'true: ponto mais baixo no chão; false: centro na origem'],
    progress: [1, 'quanto do anel já se formou 0..1'],
  },
  variants: { formando: { progress: 0.3 } },
  make(g, p) {
    const plano = new THREE.Group();
    const inc = THREE.MathUtils.degToRad(p.inclinacao);
    plano.rotation.x = inc;
    plano.position.y = p.apoiada ? p.raio * Math.sin(inc) + p.largura + 2 : 0;
    g.add(plano);
    const roda = new THREE.Group();
    plano.add(roda);
    const rnd = rng(23);
    const N = Math.max(10, Math.floor(p.pedras));
    const geo = new THREE.IcosahedronGeometry(1, 0);
    const mat = new THREE.MeshStandardMaterial({ color: p.cor, emissive: p.cor, emissiveIntensity: 0.45, roughness: 1, flatShading: true, fog: false });
    const inst = new THREE.InstancedMesh(geo, mat, N);
    inst.frustumCulled = false;
    roda.add(inst);
    const dados = [];
    for (let i = 0; i < N; i++) {
      dados.push({
        a: (i / N) * Math.PI * 2 + rnd() * 0.02,
        r: p.raio + (rnd() - 0.5) * p.largura,
        y: (rnd() - 0.5) * p.largura * 0.12,
        s: (0.25 + Math.pow(rnd(), 3) * 1.6) * p.tamanhoPedra,
        rot: [rnd() * 6, rnd() * 6, rnd() * 6],
        atraso: rnd(),
      });
    }
    // faixa de poeira translúcida
    const poeira = new THREE.Mesh(new THREE.RingGeometry(p.raio - p.largura * 0.6, p.raio + p.largura * 0.6, 96, 1, 0, Math.PI * 2),
      new THREE.MeshBasicMaterial({ color: p.cor, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false, fog: false }));
    poeira.rotation.x = -Math.PI / 2;
    roda.add(poeira);
    const origem = THREE.MathUtils.degToRad(p.origem);
    const M = new THREE.Matrix4();
    const Q = new THREE.Quaternion();
    const E = new THREE.Euler();
    const P = new THREE.Vector3();
    const S = new THREE.Vector3();
    let prog = p.progress;
    let giro = 0;
    const desenhar = () => {
      // as pedras saem da origem e avançam nos dois sentidos; ao fim, cobrem a volta toda
      const alcance = smooth(prog) * Math.PI;
      dados.forEach((d, i) => {
        let da = d.a - origem;
        da = Math.atan2(Math.sin(da), Math.cos(da)); // -π..π
        const lim = alcance * (0.75 + 0.25 * d.atraso);
        const vis = Math.abs(da) <= lim + 1e-6 && prog > 0;
        const k = vis ? Math.min(1, (lim - Math.abs(da)) / 0.25 + 0.15) : 0;
        // enquanto o anel se forma, as pedras ainda "escorrem" da origem
        const a = origem + da * (0.35 + 0.65 * smooth(prog * 1.2));
        P.set(Math.cos(a) * d.r, d.y, Math.sin(a) * d.r);
        E.set(d.rot[0] + giro, d.rot[1], d.rot[2]);
        Q.setFromEuler(E);
        S.setScalar(d.s * k);
        M.compose(P, Q, S);
        inst.setMatrixAt(i, M);
      });
      inst.instanceMatrix.needsUpdate = true;
      poeira.material.opacity = 0.22 * smooth((prog - 0.4) / 0.6);
    };
    g.userData.setProgress = (v) => { prog = v; desenhar(); };
    g.userData.update = (t) => { giro = t * 0.3; roda.rotation.y = -THREE.MathUtils.degToRad(p.velocidade * t); desenhar(); };
    desenhar();
    g.traverse((o) => { if (o.isMesh) { o.castShadow = false; o.receiveShadow = false; } });
    // ponto da origem no espaço do objeto (útil para pôr a Lua exatamente onde o anel nasce)
    g.userData.pontoOrigem = () => new THREE.Vector3(Math.cos(origem) * p.raio, 0, Math.sin(origem) * p.raio).applyEuler(plano.rotation).add(plano.position);
  },
});
