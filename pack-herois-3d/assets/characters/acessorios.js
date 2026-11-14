// Acessórios e emblemas reutilizáveis para heróis (e qualquer personagem).
//
// Um personagem lista as peças no config:  acessorios: [{ tipo: 'capa', cor: '#1aa6a6' }, { tipo: 'cinto' }]
// Cada tipo é uma função registrada em ACESSORIOS que monta a peça nas juntas. Se a peça se mexe com a
// animação, ela devolve um "controle" { chave, aplicar(valor, t) }: o clip escreve a chave na pose
// (ex.: capa: [abertura, tremulação, envergadura]) e o animador chama aplicar() a cada quadro.
// Sem a chave na pose, aplicar(undefined, t) usa o repouso. Assim tudo continua função pura de t.
//
// Para criar um acessório novo: registrarAcessorio('nome', (ctx, opcoes) => { ...; return controle? }).
// Para um emblema novo: registrarEmblema('nome', () => [THREE.Shape, ...]) com ~0,2 m de altura.

import * as THREE from 'three';
import { DIMS, ACCESSORY_KEYS } from './skeleton.js';
import { mat, rbox, sphere, cylinder, mesh } from './helpers.js';

const rad = THREE.MathUtils.degToRad;
const TAU = Math.PI * 2;

// ---------------- emblemas (formas 2D, ~0,2 m) ----------------
export const EMBLEMAS = {};
export function registrarEmblema(nome, fazer) { EMBLEMAS[nome] = fazer; }

const poligono = (pts) => {
  const s = new THREE.Shape();
  pts.forEach(([x, y], i) => (i ? s.lineTo(x, y) : s.moveTo(x, y)));
  s.closePath();
  return s;
};
const circulo = (x, y, r, buraco = 0) => {
  const s = new THREE.Shape();
  s.absarc(x, y, r, 0, TAU, false);
  if (buraco) {
    const h = new THREE.Path();
    h.absarc(x, y, buraco, 0, TAU, true);
    s.holes.push(h);
  }
  return s;
};

// raio angular (marca da linha original do pack)
registrarEmblema('raio', () => [poligono([[-0.035, 0.10], [0.055, 0.10], [0.006, 0.024], [0.059, 0.024], [-0.045, -0.11], [-0.018, -0.02], [-0.062, -0.02]])]);
// cometa: núcleo redondo + cauda em três pontas
registrarEmblema('cometa', () => [
  circulo(0.035, 0.035, 0.05),
  poligono([[0.0, 0.075], [-0.1, 0.0], [-0.03, 0.03], [-0.1, -0.06], [-0.02, 0.0], [-0.06, -0.1], [0.07, 0.0]]),
]);
// espiral de duas voltas (contorno grosso)
registrarEmblema('espiral', () => {
  const ext = [];
  const int = [];
  const N = 60;
  for (let i = 0; i <= N; i++) {
    const a = (i / N) * TAU * 1.9;
    const r = 0.018 + 0.033 * a / TAU * 1.6;
    ext.push([Math.cos(a) * (r + 0.014), Math.sin(a) * (r + 0.014)]);
    int.push([Math.cos(a) * Math.max(0.004, r - 0.012), Math.sin(a) * Math.max(0.004, r - 0.012)]);
  }
  return [poligono([...ext, ...int.reverse()])];
});
// aranha "fofa": corpo redondo e oito perninhas curtas (desenho próprio, não é marca de nenhum herói)
registrarEmblema('aranha_fofa', () => {
  const formas = [circulo(0, -0.01, 0.042), circulo(0, 0.045, 0.026)];
  for (const sx of [-1, 1]) {
    for (let k = 0; k < 4; k++) {
      const a = rad(-50 + k * 32);
      const x0 = sx * 0.03 * Math.cos(a);
      const y0 = 0.03 * Math.sin(a) - 0.01;
      const x1 = sx * 0.085 * Math.cos(a);
      const y1 = 0.085 * Math.sin(a) - 0.01 + (k < 2 ? -0.02 : 0.02);
      const nx = -(y1 - y0);
      const ny = x1 - x0;
      const l = Math.hypot(nx, ny) / 0.006;
      formas.push(poligono([[x0 + nx / l, y0 + ny / l], [x1 + nx / l, y1 + ny / l], [x1 - nx / l, y1 - ny / l], [x0 - nx / l, y0 - ny / l]]));
    }
  }
  return formas;
});
// coruja: dois anéis (olhos), bico e dois tufos
registrarEmblema('coruja', () => [
  circulo(-0.042, 0.01, 0.04, 0.018), circulo(0.042, 0.01, 0.04, 0.018),
  poligono([[-0.016, -0.03], [0.016, -0.03], [0, -0.07]]),
  poligono([[-0.075, 0.035], [-0.09, 0.1], [-0.035, 0.05]]), poligono([[0.075, 0.035], [0.09, 0.1], [0.035, 0.05]]),
]);
// estrela de quatro pontas (genérica)
registrarEmblema('brilho', () => [poligono([[0, 0.1], [0.022, 0.022], [0.1, 0], [0.022, -0.022], [0, -0.1], [-0.022, -0.022], [-0.1, 0], [-0.022, 0.022]])]);

// Malha de um emblema (plana, voltada para +Z), centrada na origem.
export function malhaEmblema(nome, cor, escala = 1) {
  const fazer = EMBLEMAS[nome];
  if (!fazer) throw new Error(`Emblema desconhecido: "${nome}". Opções: ${Object.keys(EMBLEMAS).join(', ')}`);
  const m = new THREE.Mesh(new THREE.ShapeGeometry(fazer(), 12), mat(cor));
  m.scale.setScalar(escala);
  m.castShadow = true;
  return m;
}

// ---------------- registro de acessórios ----------------
export const ACESSORIOS = {};
export function registrarAcessorio(tipo, montar) { ACESSORIOS[tipo] = montar; }
export const TIPOS_ACESSORIO = () => Object.keys(ACESSORIOS);

// Chaves de pose que os acessórios entendem (o validador e o check aceitam estas chaves).
export const CHAVES_ACESSORIO = ACCESSORY_KEYS;

// Monta todos os acessórios do config. ctx = { joints, head, faceRig, c }. Devolve a lista de controles.
export function montarAcessorios(ctx, lista = []) {
  const controles = [];
  for (const item of lista) {
    const montar = ACESSORIOS[item.tipo];
    if (!montar) throw new Error(`Acessório desconhecido: "${item.tipo}". Opções: ${TIPOS_ACESSORIO().join(', ')}`);
    const ctrl = montar(ctx, item);
    if (ctrl) controles.push(...(Array.isArray(ctrl) ? ctrl : [ctrl]));
  }
  return controles;
}

const brilho = (cor, opac = 1) => new THREE.MeshBasicMaterial({ color: cor, transparent: opac < 1, opacity: opac, depthWrite: opac >= 1 });
const marcar = (o, extra = {}) => { o.traverse((m) => { if (m.isMesh) Object.assign(m.userData, { semContorno: true, ...extra }); }); return o; };

// emblema extra em qualquer junta (o emblema do peito dos heróis usa hero.simbolo)
registrarAcessorio('emblema', ({ joints }, o) => {
  const m = malhaEmblema(o.forma, o.cor || '#ffffff', o.escala || 1);
  m.position.set(...(o.pos || [0, 0.155, 0.146]));
  joints[o.junta || 'chest'].add(m);
});

// FURO DE RESPIRAR no alto da cabeça (lenda do boto: o chapéu esconde o espiráculo)
registrarAcessorio('furo_boto', ({ head }, o) => {
  const { cy, ry } = DIMS.head;
  const furo = mesh(new THREE.SphereGeometry(1, 16, 10), o.cor || '#2a1b22', { pos: [0, cy + ry * 0.985, -0.01], scale: [0.05, 0.012, 0.035], parent: head });
  const borda = mesh(new THREE.TorusGeometry(0.055, 0.012, 6, 20), o.borda || '#c98a8f', { pos: [0, cy + ry * 0.975, -0.01], rot: [Math.PI / 2, 0, 0], scale: [1, 0.7, 1], parent: head });
  marcar(furo); marcar(borda);
});

// CAPA: três painéis finos articulados presos nas costas (ondulam em cadeia).
// Pose: capa: [abertura°, tremulação, envergadura 0..1]. formato: 'reta' (padrão) ou 'asa' (planar).
registrarAcessorio('capa', ({ joints, c }, o) => {
  const w = (c.build || 1) * (o.largura || 1);
  const comp = o.comprimento || 0.86;
  const asa = o.formato === 'asa';
  const larguras = asa ? [0.44, 0.62, 0.74] : [0.42, 0.48, 0.54];
  const pivo = new THREE.Group();
  pivo.position.set(0, 0.29, -0.135);
  joints.chest.add(pivo);
  const h = comp / 3;
  const elos = [];
  let pai = pivo;
  larguras.forEach((lw, i) => {
    const elo = new THREE.Group();
    if (i) elo.position.set(0, -h, 0);
    pai.add(elo);
    mesh(rbox(lw * w, h * 1.04, 0.014, 0.006), o.cor, { pos: [0, -h / 2, 0], parent: elo });
    if (o.forro) mesh(rbox(lw * w * 0.95, h * 0.98, 0.004, 0.002), o.forro, { pos: [0, -h / 2, 0.009], parent: elo });
    elos.push(elo);
    pai = elo;
  });
  if (asa) {
    // pontas recortadas na barra (lembram penas)
    for (const k of [-2, -1, 0, 1, 2]) mesh(rbox(0.11 * w, 0.12, 0.014, 0.006), o.cor, { pos: [k * 0.14 * w, -h - 0.04, 0], rot: [0, 0, k * 0.12], parent: elos[2] });
  }
  if (o.gola !== false) mesh(rbox(0.46 * w, 0.055, 0.045, 0.02), o.forro || o.cor, { pos: [0, 0, 0.012], parent: pivo });
  return {
    chave: 'capa',
    aplicar(v, t) {
      const [abre, tremula, enverg] = v || [0, 0.5, 0];
      const f = 1 + (tremula ?? 0.5);
      const e = Math.max(0, enverg || 0);
      elos.forEach((elo, i) => {
        elo.rotation.x = rad((i ? 2 : 6) + abre * (i ? 0.25 : 0.7) + (2 + 2.5 * i) * f * Math.sin(t * 5.1 - i * 0.9));
        elo.scale.x = 1 + e * (asa ? [1.4, 1.7, 1.6][i] : 0.5);
      });
    },
  };
});

// CINTO com bolsinhas e fivela (vigilante)
registrarAcessorio('cinto', ({ joints, c }, o) => {
  const w = c.build || 1;
  const cor = o.cor || '#c9a227';
  mesh(rbox(0.36 * w, 0.055, 0.245, 0.018), cor, { pos: [0, 0.075, 0], parent: joints.hips });
  mesh(rbox(0.08, 0.06, 0.02, 0.01), o.fivela || '#f2e6b0', { pos: [0, 0.075, 0.125], parent: joints.hips });
  const n = o.bolsas ?? 3;
  for (let i = 0; i < n; i++) {
    const a = rad(-60 + (120 * i) / Math.max(1, n - 1));
    const x = Math.sin(a) * 0.17 * w;
    const z = Math.cos(a) * 0.115;
    if (Math.abs(x) < 0.05) continue;
    mesh(rbox(0.055, 0.07, 0.045, 0.012), o.bolsa || cor, { pos: [x, 0.06, z], rot: [0, a, 0], parent: joints.hips });
  }
});

// CAPACETE em forma de panela (com pegador) ou elmo liso
registrarAcessorio('capacete', ({ head }, o) => {
  const { rx, ry, rz, cy } = DIMS.head;
  const cor = o.cor || '#9aa3ad';
  const domo = mesh(new THREE.SphereGeometry(1, 24, 12, 0, TAU, 0, Math.PI * 0.42), cor, {
    pos: [0, cy + 0.02, 0], scale: [rx * 1.08, ry * 1.1, rz * 1.08], parent: head,
  });
  void domo;
  if (o.formato === 'panela') {
    // aba (borda da panela) e pegador no topo
    const aba = mesh(cylinder(rx * 1.12, rx * 1.12, 0.03, 24), o.borda || '#c8893a', { pos: [0, cy + ry * 0.36, 0], parent: head });
    aba.scale.z = rz / rx;
    mesh(cylinder(0.025, 0.035, 0.06, 10), o.pegador || '#2b2f34', { pos: [0, cy + ry * 1.12, 0], parent: head });
    mesh(sphere(0.045, 12, 8), o.pegador || '#2b2f34', { pos: [0, cy + ry * 1.12 + 0.05, 0], parent: head });
  } else {
    mesh(rbox(0.05, 0.08, rz * 1.9, 0.02), o.crista || o.borda || '#c8893a', { pos: [0, cy + ry * 1.08, 0], parent: head });
  }
});

// MÁSCARA DE CORUJA: penas abertas para os lados (não orelhas), discos faciais em volta das lentes e bico
registrarAcessorio('tufos_coruja', ({ head, faceRig }, o) => {
  const { rx, ry, cy } = DIMS.head;
  const cor = o.cor || '#3b2f4a';
  const borda = o.borda || '#f2b134';
  for (const sx of [-1, 1]) {
    // três penas em leque, deitadas para fora acima das lentes
    for (let i = 0; i < 3; i++) {
      const g = new THREE.Group();
      g.position.set(sx * rx * (0.5 + i * 0.13), cy + ry * (0.62 - i * 0.1), 0.06 - i * 0.03);
      g.rotation.set(-0.2, 0, sx * (-1.05 - i * 0.28));
      head.add(g);
      const pena = mesh(sphere(0.05, 8, 6), cor, { pos: [0, 0.07, 0], scale: [0.55, 1.6 - i * 0.25, 0.35], parent: g });
      void pena;
    }
  }
  // disco facial (anel) em volta de cada lente
  for (const eye of faceRig.eyes) {
    const anel = new THREE.Mesh(new THREE.TorusGeometry(0.098, 0.022, 6, 20), mat(borda));
    anel.scale.set(1, 1, 0.5);
    eye.add(anel);
  }
  // bico pequeno entre as lentes
  const bico = mesh(new THREE.ConeGeometry(0.03, 0.08, 6), borda, { pos: [0, cy + 0.12, DIMS.head.rz * 0.98], rot: [Math.PI / 2 + 0.5, 0, 0], parent: head });
  void bico;
});

// OLHOS EXTRAS (aranha): lentes pequenas na testa
registrarAcessorio('olhos_extras', ({ head }, o) => {
  const { cy } = DIMS.head;
  const n = o.quantidade || 4;
  for (let i = 0; i < n; i++) {
    const x = (i - (n - 1) / 2) * 0.062;
    const y = cy + 0.115 + (Math.abs(x) < 0.05 ? 0.02 : 0);
    const k = 1 - (x / DIMS.head.rx) ** 2 - ((y - cy) / DIMS.head.ry) ** 2;
    const z = DIMS.head.rz * Math.sqrt(Math.max(0.02, k));
    const g = new THREE.Group();
    g.position.set(x, y, z + 0.004);
    g.lookAt(x * 3, y + (y - cy) * 2, z * 3);
    head.add(g);
    mesh(sphere(0.026, 12, 8), o.borda || '#14161c', { scale: [1, 1, 0.3], parent: g });
    mesh(sphere(0.019, 12, 8), o.cor || '#ffffff', { pos: [0, 0, 0.006], scale: [1, 1, 0.3], parent: g });
    marcar(g);
    g.children[1].userData.lente = true;
  }
});

// LANÇADORES nos pulsos (carretéis)
registrarAcessorio('lancadores', ({ joints }, o) => {
  for (const s of ['L', 'R']) {
    const m = mesh(cylinder(0.05, 0.05, 0.07, 10), o.cor || '#c9a227', { pos: [0, -0.2, 0.045], rot: [Math.PI / 2, 0, 0], parent: joints['forearm' + s] });
    void m;
  }
});

// FIO (teia, gancho): linha que sai da mão ao longo do braço. Pose: fioR / fioL: [comprimento m]
registrarAcessorio('fio', ({ joints }, o) => {
  const ctrls = [];
  for (const s of o.lados || ['R']) {
    const g = new THREE.Group();
    g.position.set(0, -0.05, 0);
    joints['hand' + s].add(g);
    const linha = new THREE.Mesh(new THREE.CylinderGeometry(o.raio || 0.012, o.raio || 0.012, 1, 6), brilho(o.cor || '#f4f8ff'));
    g.add(linha);
    let ponta = null;
    if (o.ponta === 'gancho') {
      ponta = new THREE.Group();
      g.add(ponta);
      mesh(cylinder(0.02, 0.02, 0.12, 6), '#3a3f47', { parent: ponta });
      for (const a of [0, 2.1, 4.2]) mesh(rbox(0.02, 0.1, 0.02, 0.006), '#3a3f47', { pos: [Math.cos(a) * 0.04, -0.07, Math.sin(a) * 0.04], rot: [Math.sin(a) * 0.8, 0, -Math.cos(a) * 0.8], parent: ponta });
    } else if (o.ponta === 'teia') {
      ponta = new THREE.Mesh(new THREE.CircleGeometry(0.16, 6), brilho(o.cor || '#f4f8ff', 0.85));
      ponta.material.side = THREE.DoubleSide;
      ponta.rotation.x = Math.PI / 2;
      g.add(ponta);
    }
    marcar(g, { manterMaterial: true });
    ctrls.push({
      chave: 'fio' + s,
      aplicar(v) {
        const L = Math.max(0, v?.[0] || 0);
        g.visible = L > 0.02;
        linha.scale.y = Math.max(0.001, L);
        linha.position.y = -L / 2;
        if (ponta) ponta.position.y = -L;
      },
    });
  }
  return ctrls;
});

// FEIXES DOS OLHOS (visão de calor). Pose: feixe: [comprimento m]
registrarAcessorio('feixes_olhos', ({ head, faceRig }, o) => {
  const g = new THREE.Group();
  head.add(g);
  const nucleo = brilho(o.nucleo || '#fff2c4');
  const halo = brilho(o.cor || '#ff3b1f', 0.75);
  const raios = faceRig.eyes.map((eye) => {
    const r = new THREE.Group();
    r.position.copy(eye.position);
    g.add(r);
    const a = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 1, 8), nucleo);
    const b = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.03, 1, 10), halo);
    for (const m of [a, b]) { m.rotation.x = Math.PI / 2; r.add(m); }
    return { r, a, b };
  });
  marcar(g, { manterMaterial: true });
  return {
    chave: 'feixe',
    aplicar(v, t) {
      const L = Math.max(0, v?.[0] || 0);
      g.visible = L > 0.02;
      for (const { a, b } of raios) {
        for (const m of [a, b]) { m.scale.set(1, L, 1); m.position.z = L / 2; }
        b.scale.x = b.scale.z = 1 + 0.15 * Math.sin(t * 40);
      }
    },
  };
});

// SOPRO (congelante, vento): cone translúcido saindo da boca. Pose: sopro: [intensidade 0..1]
registrarAcessorio('sopro', ({ head }, o) => {
  const { cy, rz } = DIMS.head;
  const g = new THREE.Group();
  g.position.set(0, cy - 0.07, rz * 0.95);
  head.add(g);
  const camadas = [0, 1, 2].map((i) => {
    const m = new THREE.Mesh(new THREE.ConeGeometry(0.35 + i * 0.12, 1.6, 14, 1, true), brilho(i ? '#d9f3ff' : (o.cor || '#9fe3ff'), 0.42 - i * 0.1));
    m.material.side = THREE.DoubleSide;
    m.rotation.x = -Math.PI / 2;
    g.add(m);
    return m;
  });
  marcar(g, { manterMaterial: true });
  return {
    chave: 'sopro',
    aplicar(v, t) {
      const k = Math.max(0, Math.min(1, v?.[0] || 0));
      g.visible = k > 0.02;
      camadas.forEach((m, i) => {
        const s = k * (1 + 0.08 * Math.sin(t * 23 + i * 2));
        m.scale.set(s, s * (1 + i * 0.15), s);
        m.position.z = 0.8 * s * (1 + i * 0.15);
      });
    },
  };
});

// NUVEM (fumaça aos pés). Pose: nuvem: [intensidade 0..1]
registrarAcessorio('nuvem', ({ joints }, o) => {
  const g = new THREE.Group();
  joints.hips.parent.add(g); // no root: não gira com o quadril
  const bolas = [];
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * TAU;
    const m = new THREE.Mesh(new THREE.IcosahedronGeometry(0.28 + (i % 3) * 0.07, 1), new THREE.MeshStandardMaterial({ color: o.cor || '#6d6a78', roughness: 1, transparent: true, opacity: 0.85 }));
    m.userData.base = [Math.cos(a) * 0.45, 0.25 + (i % 2) * 0.25, Math.sin(a) * 0.45];
    g.add(m);
    bolas.push(m);
  }
  marcar(g, { manterMaterial: true });
  return {
    chave: 'nuvem',
    aplicar(v, t) {
      const k = Math.max(0, Math.min(1.5, v?.[0] || 0));
      g.visible = k > 0.02;
      bolas.forEach((m, i) => {
        const [x, y, z] = m.userData.base;
        m.position.set(x * (0.6 + k), y * k + 0.08 * Math.sin(t * 2 + i), z * (0.6 + k));
        m.scale.setScalar(k * (1 + 0.1 * Math.sin(t * 3 + i)));
      });
    },
  };
});

// ESCUDO redondo no antebraço (reaproveitado pelo asset de cenário "escudo_heroi"). Pose: escudo: [visível 0/1]
export function montarEscudo(o = {}) {
  const g = new THREE.Group();
  const R = o.raio || 0.3;
  const corpo = mesh(cylinder(R, R, 0.04, 28), o.cor || '#b9c2cc', { rot: [Math.PI / 2, 0, 0], parent: g });
  void corpo;
  const aro = new THREE.Mesh(new THREE.TorusGeometry(R, 0.03, 8, 32), mat(o.borda || '#c8893a'));
  g.add(aro);
  mesh(cylinder(R * 0.62, R * 0.62, 0.05, 28), o.miolo || o.cor || '#b9c2cc', { rot: [Math.PI / 2, 0, 0], parent: g });
  const emb = malhaEmblema(o.simbolo || 'espiral', o.corSimbolo || '#c8893a', R * 3.2);
  emb.position.z = 0.03;
  g.add(emb);
  if (o.pegador !== false) {
    mesh(cylinder(0.035, 0.045, 0.05, 10), '#2b2f34', { pos: [0, 0, 0.05], rot: [Math.PI / 2, 0, 0], parent: g });
    mesh(sphere(0.04, 10, 8), '#2b2f34', { pos: [0, 0, 0.085], parent: g });
  }
  return g;
}

registrarAcessorio('escudo', ({ joints }, o) => {
  const s = o.lado || 'L';
  const g = montarEscudo(o);
  // preso por fora do antebraço, face voltada para a frente do braço
  g.position.set(s === 'L' ? 0.1 : -0.1, -0.13, 0.02);
  g.rotation.set(0, s === 'L' ? Math.PI / 2 : -Math.PI / 2, 0);
  joints['forearm' + s].add(g);
  return { chave: 'escudo', aplicar(v) { g.visible = (v?.[0] ?? 1) > 0.5; } };
});
