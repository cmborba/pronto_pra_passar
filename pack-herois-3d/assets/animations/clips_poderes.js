// Clips de PODERES de heróis. Servem para qualquer personagem (mesmo esqueleto); os efeitos visuais
// (capa, fio, feixe dos olhos, sopro, fumaça, escudo) aparecem só em quem tem o acessório correspondente.
// Mesmas convenções de clips.js: rotações em graus, poses esparsas, ph = fase 0..1.
// Chaves de acessório: capa [abertura°, tremulação, envergadura], fioR/fioL [m], feixe [m], sopro [0..1],
// escudo [visível 0/1], nuvem [0..1]. Ver assets/characters/acessorios.js.

const TAU = Math.PI * 2;
const smooth = (x) => x * x * (3 - 2 * x);
const R = (x = 0, y = 0, z = 0) => [x, y, z];

// keyframes suaves [[fase, valor], ...]
function k(ph, pts) {
  if (ph <= pts[0][0]) return pts[0][1];
  for (let i = 1; i < pts.length; i++) {
    if (ph <= pts[i][0]) {
      const [p0, v0] = pts[i - 1];
      const [p1, v1] = pts[i];
      return v0 + (v1 - v0) * smooth((ph - p0) / (p1 - p0));
    }
  }
  return pts[pts.length - 1][1];
}

// Base de "pernas firmes" (base aberta, joelhos levemente dobrados)
const base = (dobra = 0) => ({
  legL: R(-8 - dobra, 0, 9), legR: R(6 - dobra, 0, -9),
  shinL: R(14 + dobra * 1.6), shinR: R(12 + dobra * 1.6),
});

export const CLIPS_PODERES = {
  // ---------- aracnídeo ----------
  lancar_teia: {
    description: 'Lança um fio pelo pulso: prepara, estica o braço e o fio dispara à frente (use com o acessório "fio"). Segura a pose',
    loop: false, duration: 0.9, affects: ['torso', 'head', 'arms', 'legs', 'face'], mirrorable: true,
    params: {
      side: { default: 'R', description: "'R' ou 'L': braço que lança" },
      mira: { default: 0, description: 'graus acima da horizontal (0 = para a frente; 60 = para o céu)' },
      alcance: { default: 7, description: 'comprimento do fio (m)' },
    },
    pose(ph, t, p) {
      const tiro = k(ph, [[0, 0], [0.28, 0], [0.4, 1]]);
      return {
        ...base(6),
        armR: R(k(ph, [[0, -10], [0.25, -55], [0.4, -92 - p.mira]]), 0, -8), forearmR: R(k(ph, [[0, -20], [0.25, -95], [0.4, -4]])),
        handR: R(k(ph, [[0.3, 0], [0.42, 25], [0.6, 0]])),
        armL: R(-35, 0, 22), forearmL: R(-85),
        chest: R(4 - p.mira * 0.15 * tiro, -14 * tiro, 0), head: R(-4 - p.mira * 0.5 * tiro, -6 * tiro, 0),
        fioR: R(k(ph, [[0.3, 0], [0.62, p.alcance], [1, p.alcance]])),
        face: { eyeOpen: 1.1 },
      };
    },
  },
  escalar: {
    description: 'Escalar uma parede: braços e pernas alternados, corpo colado na parede (vire o personagem para a parede e suba com anim.pos)',
    loop: true, duration: 1.1, affects: ['torso', 'head', 'arms', 'legs'], grounded: false,
    params: {},
    pose(ph) {
      const s = Math.sin(ph * TAU);
      return {
        spine: R(8), chest: R(6), head: R(-22),
        armL: R(-150 + 30 * s, 0, 18), forearmL: R(-55 - 25 * s),
        armR: R(-150 - 30 * s, 0, -18), forearmR: R(-55 + 25 * s),
        legL: R(-55 - 25 * s, 0, 14), shinL: R(80 + 25 * s),
        legR: R(-55 + 25 * s, 0, -14), shinR: R(80 - 25 * s),
      };
    },
  },
  balancar: {
    description: 'Balançar pendurado num fio (pêndulo): braço esticado para cima segurando o fio, pernas juntas. Mova o personagem em arco com anim.pos',
    loop: true, duration: 2.4, affects: ['torso', 'head', 'arms', 'legs'], grounded: false,
    params: { fio: { default: 4.5, description: 'comprimento do fio (m), para quem tem o acessório "fio"' } },
    pose(ph, t, p) {
      const s = Math.sin(ph * TAU);
      return {
        hips: R(-18 * s), hipsPos: R(0, 0.05, 0),
        armR: R(-178, 0, -4), forearmR: R(-6), handR: R(0),
        armL: R(-30 + 15 * s, 0, 55), forearmL: R(-40),
        legL: R(-25 + 20 * s, 0, 3), shinL: R(55), legR: R(-15 + 20 * s, 0, -3), shinR: R(70),
        head: R(-10 + 6 * s), chest: R(-4),
        fioR: R(p.fio),
      };
    },
  },
  puxar_fio: {
    description: 'Puxar um fio/corda com as duas mãos, com toda a força: inclina para trás, braços estendidos para cima à frente e os pés escorregando (cabo de guerra)',
    loop: true, duration: 0.9, affects: ['torso', 'head', 'arms', 'legs', 'face'],
    params: { mira: { default: 35, description: 'graus acima da horizontal para onde o fio vai' } },
    pose(ph, t, p) {
      const s = Math.sin(ph * TAU);
      const puxa = 0.5 + 0.5 * Math.sin(ph * TAU - 1);
      const arm = -90 - p.mira * 0.9 + 10 * puxa;
      return {
        hips: R(-14 - 4 * puxa), spine: R(-6), chest: R(-4 + 4 * puxa), head: R(-p.mira * 0.4),
        armR: R(arm, 0, -6), forearmR: R(-10 - 30 * puxa), handR: R(0),
        armL: R(arm + 6, 0, 6), forearmL: R(-14 - 30 * puxa), handL: R(0),
        legL: R(-30 + 6 * s, 0, 8), shinL: R(40 + 8 * s), legR: R(6 - 8 * s, 0, -8), shinR: R(22 - 6 * s),
        hipsPos: R(0, -0.05, -0.04 * puxa),
        face: { eyeOpen: 0.7 + 0.2 * puxa, browTilt: 1 },
      };
    },
  },
  sentir_perigo: {
    description: 'Sentir perigo: agacha em alerta, olha rápido para um lado e para o outro, olhos arregalados. Segura a pose',
    loop: false, duration: 1.2, affects: ['torso', 'head', 'arms', 'legs', 'face'],
    params: {},
    pose(ph) {
      const d = k(ph, [[0, 0], [0.2, 1]]);
      const olha = k(ph, [[0.15, 0], [0.35, 38], [0.55, -38], [0.8, 20], [1, 20]]);
      return {
        legL: R(-40 * d, 0, 14), legR: R(-25 * d, 0, -14), shinL: R(75 * d), shinR: R(55 * d),
        spine: R(12 * d), chest: R(8 * d),
        armL: R(-45 * d, 0, 40 * d), forearmL: R(-70 * d), armR: R(-45 * d, 0, -40 * d), forearmR: R(-70 * d),
        head: R(-6 * d, olha, 0), neck: R(0, olha * 0.3, 0),
        face: { eyeOpen: 1 + 0.3 * d, browRaise: d, look: [olha / 60, 0] },
      };
    },
  },

  // ---------- voador ----------
  voar: {
    description: 'Voar: corpo deitado no ar, punho à frente, pernas esticadas para trás, capa tremulando. Mova com anim.pos',
    loop: true, duration: 1.6, affects: ['torso', 'head', 'arms', 'legs', 'face'], grounded: false,
    params: { punhos: { default: 1, description: '1 = um punho à frente; 2 = os dois' } },
    pose(ph, t, p) {
      const s = Math.sin(ph * TAU);
      return {
        hips: R(80 + 3 * s), hipsPos: R(0, 0.32 + 0.04 * s, 0),
        armR: R(-176, 0, -6), forearmR: R(-4),
        armL: p.punhos === 2 ? R(-176, 0, 6) : R(12, 0, 10), forearmL: p.punhos === 2 ? R(-4) : R(-8),
        legL: R(6 + 3 * s, 0, 4), shinL: R(10), legR: R(14 - 3 * s, 0, -4), shinR: R(24),
        chest: R(-6), head: R(-58),
        capa: R(-6, 0.9, 0.15),
        face: { eyeOpen: 1.05 },
      };
    },
  },
  levantar_peso: {
    description: 'Levantar algo muito pesado: agacha, firma e ergue os braços acima da cabeça. Segura a pose (o objeto sobe junto com anim.pos)',
    loop: false, duration: 1.6, affects: ['torso', 'head', 'arms', 'legs', 'face'],
    params: {},
    pose(ph) {
      const agacha = k(ph, [[0, 0], [0.3, 1], [0.6, 0.15], [1, 0.1]]);
      const sobe = k(ph, [[0.3, 0], [0.7, 1]]);
      const treme = Math.sin(ph * 90) * (1 - sobe) * agacha;
      return {
        legL: R(-55 * agacha, 0, 16), legR: R(-55 * agacha, 0, -16), shinL: R(95 * agacha + 4), shinR: R(95 * agacha + 4),
        spine: R(18 * agacha), chest: R(10 * agacha - 6 * sobe),
        armL: R(k(ph, [[0, -20], [0.3, -70], [0.7, -172]]), 0, 18 - 4 * treme), forearmL: R(k(ph, [[0, -30], [0.3, -40], [0.7, -12]])),
        armR: R(k(ph, [[0, -20], [0.3, -70], [0.7, -172]]), 0, -18 + 4 * treme), forearmR: R(k(ph, [[0, -30], [0.3, -40], [0.7, -12]])),
        head: R(-14 * sobe + 6 * agacha),
        face: { eyeOpen: 0.75 + 0.35 * sobe, browTilt: 1 - sobe },
      };
    },
  },
  visao_calor: {
    description: 'Visão de calor: firma a base, cerra os punhos e dois feixes saem dos olhos (acessório "feixes_olhos"). Segura a pose',
    loop: false, duration: 1.4, affects: ['torso', 'head', 'arms', 'legs', 'face'],
    params: { alcance: { default: 7, description: 'comprimento dos feixes (m)' } },
    pose(ph, t, p) {
      const f = k(ph, [[0, 0], [0.25, 1]]);
      return {
        ...base(10 * f),
        armL: R(8, 0, 18 * f + 4), forearmL: R(-30 * f), armR: R(8, 0, -18 * f - 4), forearmR: R(-30 * f),
        chest: R(6 * f), head: R(6 * f),
        feixe: R(k(ph, [[0.22, 0], [0.42, p.alcance]])),
        face: { eyeOpen: 1 - 0.3 * f, browTilt: f },
      };
    },
  },
  sopro_congelante: {
    description: 'Sopro congelante: enche o peito inclinando para trás e sopra um jato gelado à frente (acessório "sopro"). Segura a pose',
    loop: false, duration: 1.6, affects: ['torso', 'head', 'arms', 'legs', 'face'],
    params: {},
    pose(ph) {
      const enche = k(ph, [[0, 0], [0.3, 1], [0.42, 0]]);
      const sopra = k(ph, [[0.35, 0], [0.5, 1]]);
      return {
        ...base(8),
        spine: R(-10 * enche + 8 * sopra), chest: R(-12 * enche + 10 * sopra), head: R(-16 * enche + 6 * sopra),
        armL: R(-20 * enche + 10 * sopra, 0, 30 * enche + 12), forearmL: R(-50 * enche - 20), armR: R(-20 * enche + 10 * sopra, 0, -30 * enche - 12), forearmR: R(-50 * enche - 20),
        sopro: R(sopra),
        face: { eyeOpen: 1 - 0.25 * sopra, browTilt: 0.6 * sopra },
      };
    },
  },

  // ---------- vigilante ----------
  lancar_gancho: {
    description: 'Disparar um gancho para o alto (acessório "fio" com ponta de gancho): mira, recua com o tranco e o cabo estica. Segura a pose',
    loop: false, duration: 1.0, affects: ['torso', 'head', 'arms', 'legs', 'face'], mirrorable: true,
    params: { side: { default: 'R', description: "'R' ou 'L': braço que dispara" }, alcance: { default: 9, description: 'comprimento do cabo (m)' } },
    pose(ph, t, p) {
      const mira = k(ph, [[0, 0], [0.3, 1]]);
      const tranco = k(ph, [[0.35, 0], [0.42, 1], [0.6, 0]]);
      return {
        ...base(8),
        armR: R(-140 * mira + 12 * tranco, 0, -6), forearmR: R(-10 + 20 * tranco),
        armL: R(-50 * mira, 0, 25), forearmL: R(-95 * mira),
        chest: R(-8 * mira - 4 * tranco), head: R(-28 * mira),
        fioR: R(k(ph, [[0.38, 0], [0.75, p.alcance]])),
        face: { eyeOpen: 0.85 },
      };
    },
  },
  planar: {
    description: 'Planar com a capa aberta como asas: corpo inclinado, braços abertos segurando a capa. Mova em descida com anim.pos',
    loop: true, duration: 2.0, affects: ['torso', 'head', 'arms', 'legs'], grounded: false,
    params: {},
    pose(ph) {
      const s = Math.sin(ph * TAU);
      return {
        hips: R(58 + 3 * s), hipsPos: R(0, 0.28, 0),
        armL: R(-35, 0, 80 + 5 * s), forearmL: R(-8), armR: R(-35, 0, -80 - 5 * s), forearmR: R(-8),
        legL: R(8, 0, 5), shinL: R(18), legR: R(10, 0, -5), shinR: R(22),
        chest: R(-6), head: R(-45),
        capa: R(25, 0.9, 1),
      };
    },
  },
  lutar: {
    description: 'Lutar: guarda alta com jab, cruzado e passo de base, em ciclo',
    loop: true, duration: 1.1, affects: ['torso', 'head', 'arms', 'legs', 'face'],
    params: {},
    pose(ph) {
      const jab = k(ph, [[0, 0], [0.12, 1], [0.3, 0]]);
      const cruz = k(ph, [[0.45, 0], [0.58, 1], [0.78, 0]]);
      const pulo = Math.abs(Math.sin(ph * TAU * 2));
      return {
        legL: R(-22, 0, 8), shinL: R(26), legR: R(18, 0, -8), shinR: R(30),
        hipsPos: R(0, 0.02 * pulo, 0),
        spine: R(8), chest: R(4, -22 * jab + 28 * cruz, 0), head: R(4, 8 * jab - 10 * cruz, 0),
        armR: R(-55 - 35 * jab, 0, -12 + 8 * jab), forearmR: R(-115 + 105 * jab),
        armL: R(-55 - 35 * cruz, 0, 12 - 8 * cruz), forearmL: R(-115 + 105 * cruz),
        face: { eyeOpen: 0.85, browTilt: 0.8 },
      };
    },
  },
  lancar_dispositivo: {
    description: 'Arremessar um dispositivo por cima do ombro (bumerangue, bomba de fumaça): recua o braço e lança à frente. Segura a pose',
    loop: false, duration: 0.9, affects: ['torso', 'head', 'arms', 'legs'], mirrorable: true,
    params: { side: { default: 'R', description: "'R' ou 'L': braço que arremessa" } },
    pose(ph) {
      const recua = k(ph, [[0, 0], [0.35, 1], [0.5, 0]]);
      const vai = k(ph, [[0.35, 0], [0.55, 1]]);
      return {
        legL: R(-28 * vai - 6, 0, 9), shinL: R(18), legR: R(16, 0, -9), shinR: R(14),
        armR: R(40 * recua - 150 * vai + 80 * vai * vai, 0, -18), forearmR: R(-110 * recua - 6),
        armL: R(-60 * recua - 20, 0, 20), forearmL: R(-30),
        chest: R(-8 * recua + 14 * vai, 28 * recua - 18 * vai, 0), head: R(-6, -10 * recua, 0),
      };
    },
  },
  soltar_fumaca: {
    description: 'Bomba de fumaça: agacha, bate a mão no chão e some numa nuvem (acessório "nuvem"). Segura a pose',
    loop: false, duration: 1.3, affects: ['torso', 'head', 'arms', 'legs', 'face'],
    params: {},
    pose(ph) {
      const d = k(ph, [[0, 0], [0.3, 1]]);
      return {
        legL: R(-70 * d, 0, 16), legR: R(-20 * d, 0, -12), shinL: R(110 * d), shinR: R(120 * d),
        spine: R(28 * d), chest: R(12 * d), head: R(-10 * d),
        armR: R(-40 * d, 0, -10), forearmR: R(-8), armL: R(-30 * d, 0, 45 * d), forearmL: R(-60 * d),
        nuvem: R(k(ph, [[0.28, 0], [0.55, 1], [1, 1.2]])),
        face: { eyeOpen: 0.8 },
      };
    },
  },

  // ---------- escudo ----------
  arremessar_escudo: {
    description: 'Arremessar o escudo do antebraço esquerdo de lado, como disco: gira o tronco, solta e o escudo some do braço (o voo é um objeto "escudo_heroi" com anim)',
    loop: false, duration: 1.1, affects: ['torso', 'head', 'arms', 'legs'],
    params: {},
    pose(ph) {
      const carga = k(ph, [[0, 0], [0.35, 1], [0.5, 0]]);
      const solta = k(ph, [[0.35, 0], [0.55, 1]]);
      return {
        legL: R(-30 * solta - 5, 0, 12), shinL: R(22), legR: R(18, 0, -12), shinR: R(24),
        spine: R(6), chest: R(6, 40 * carga - 30 * solta, 0), head: R(0, -30 * carga + 20 * solta, 0),
        armL: R(-70 * carga - 85 * solta + 70 * carga * solta, 0, -45 * carga + 70 * solta), forearmL: R(-110 * carga - 8 * solta),
        armR: R(-30, 0, -30 - 20 * solta), forearmR: R(-60),
        escudo: R(ph < 0.48 ? 1 : 0),
      };
    },
  },
  defender: {
    description: 'Defender com o escudo: base baixa e o antebraço esquerdo erguido à frente do corpo. Segura a pose',
    loop: false, duration: 0.5, affects: ['torso', 'head', 'arms', 'legs', 'face'],
    params: {},
    pose(ph) {
      const d = k(ph, [[0, 0], [1, 1]]);
      return {
        legL: R(-35 * d, 0, 14), legR: R(15 * d, 0, -14), shinL: R(55 * d), shinR: R(40 * d),
        spine: R(10 * d), chest: R(6 * d),
        armL: R(-60 * d, -90 * d, -40 * d), forearmL: R(-125 * d),
        armR: R(-30 * d, 0, -25), forearmR: R(-80 * d),
        head: R(4 * d), escudo: R(1),
        face: { eyeOpen: 0.85, browTilt: 0.7 * d },
      };
    },
  },
};
