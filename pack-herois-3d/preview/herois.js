// Galeria de heróis: escolha um herói e teste cada poder (clips + acessórios animados).
// Lista automaticamente todo preset que tem "poderes" (presets.js), então heróis novos aparecem sozinhos.
// Parâmetros de URL (capturas): ?heroi=major_cometa &poder=0 &t=1.2 &cam=0|1|2 &todos=1

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { PRESET_NAMES, PRESETS, makePreset, CLIPS, playClip, makeScenery } from '../assets/index.js';

const q = new URLSearchParams(location.search);
const $ = (id) => document.getElementById(id);
const erro = (msg) => { $('info').innerHTML = `<b style="color:#ffb4b4">Erro:</b> ${msg}`; };
addEventListener('error', (e) => erro(e.message));
addEventListener('unhandledrejection', (e) => erro(String(e.reason)));

// ---- cena ----
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.95;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color('#9fd3f2');
scene.fog = new THREE.Fog('#9fd3f2', 22, 60);
scene.add(new THREE.HemisphereLight('#ffffff', '#8a8f9c', 1.15));
const sol = new THREE.DirectionalLight('#fff4e0', 2.4);
sol.position.set(5, 9, 7);
sol.castShadow = true;
sol.shadow.mapSize.set(2048, 2048);
Object.assign(sol.shadow.camera, { left: -8, right: 8, top: 8, bottom: -4, near: 1, far: 40 });
scene.add(sol);

const chao = new THREE.Mesh(new THREE.PlaneGeometry(120, 120), new THREE.MeshStandardMaterial({ color: '#c9cdd3', roughness: 1 }));
chao.rotation.x = -Math.PI / 2;
chao.receiveShadow = true;
scene.add(chao);
// cenário urbano de fundo (assets do pack)
const fundo = [
  ['rua_reta', [0, 0, 0], 90, { length: 60 }],
  ['predio_apartamentos', [-9, 0, -14], 0, { floors: 5 }],
  ['loja', [5, 0, -12], 0, {}],
  ['predio_apartamentos', [16, 0, -16], 0, { floors: 7, wall: '#d9e4ef' }],
  ['poste_luz', [-3.5, 0.2, -5.6], 0, {}],
  ['arvore_redonda', [3.8, 0.2, -5.4], 0, { seed: 4 }],
];
for (const [id, pos, giro, params] of fundo) {
  const o = makeScenery(id, params);
  o.position.set(...pos);
  o.rotation.y = THREE.MathUtils.degToRad(giro);
  scene.add(o);
}

const camera = new THREE.PerspectiveCamera(40, innerWidth / innerHeight, 0.1, 200);
const controls = new OrbitControls(camera, renderer.domElement);

// ---- palco de cada poder (só na galeria: altura no ar, parede, objeto levantado, escudo voando) ----
const parede = new THREE.Mesh(new THREE.BoxGeometry(4, 6, 0.4), new THREE.MeshStandardMaterial({ color: '#d8c3a5', roughness: 1 }));
parede.position.set(0, 3, -0.75);
parede.castShadow = parede.receiveShadow = true;
scene.add(parede);
const carro = makeScenery('carro_hatch', { color: '#d9473a' });
carro.rotation.y = Math.PI / 2;
scene.add(carro);
const escudoVoando = makeScenery('escudo_heroi');
scene.add(escudoVoando);

const smooth = (x) => { x = Math.min(1, Math.max(0, x)); return x * x * (3 - 2 * x); };
const PALCO = {
  voar: { y: 1.4, cam: 1 },
  planar: { y: 1.8, cam: 1 },
  balancar: { y: 2.0, cam: 1 },
  escalar: { y: 1.0, giro: 180, parede: true, cam: 1 },
  levantar_peso: { carro: true, cam: 1, dist: 7 },
  visao_calor: { cam: 1, dist: 6 },
  sopro_congelante: { cam: 1, dist: 6 },
  lancar_teia: { cam: 1, dist: 6 },
  lancar_gancho: { cam: 1, dist: 7 },
  arremessar_escudo: { escudo: true, cam: 1, dist: 7 },
};

// ---- estado ----
const HEROIS = PRESET_NAMES.filter((n) => PRESETS[n].poderes?.length)
  .sort((a, b) => (PRESETS[a].config.acessorios?.length ? 0 : 1) - (PRESETS[b].config.acessorios?.length ? 0 : 1));
let heroi = HEROIS.includes(q.get('heroi')) ? q.get('heroi') : HEROIS[0];
let poderIdx = Number(q.get('poder') ?? 0);
let todos = q.get('todos') === '1';
let camIdx = q.has('cam') ? Number(q.get('cam')) : -1;
const grupo = new THREE.Group();
scene.add(grupo);
let bonecos = [];

const nomeBonito = (n) => n.split('_').map((p) => p[0].toUpperCase() + p.slice(1)).join(' ');

function montar() {
  grupo.clear();
  const nomes = todos ? HEROIS : [heroi];
  bonecos = nomes.map((n, i) => {
    const c = makePreset(n);
    c.baseX = (i - (nomes.length - 1) / 2) * 1.35;
    grupo.add(c.root);
    return c;
  });
  desenharUI();
  posicionarCamera();
}

function poderAtual() { return PRESETS[heroi].poderes[Math.min(poderIdx, PRESETS[heroi].poderes.length - 1)]; }

function desenharUI() {
  $('herois').replaceChildren(...HEROIS.map((n) => {
    const b = document.createElement('button');
    const cor = PRESETS[n].config.top.color;
    b.innerHTML = `<span class="cor" style="background:${cor}"></span>${nomeBonito(n)}`;
    b.className = !todos && n === heroi ? 'on' : '';
    b.onclick = () => { heroi = n; poderIdx = 0; todos = false; camIdx = -1; montar(); };
    return b;
  }));
  $('poderes').replaceChildren(...PRESETS[heroi].poderes.map((p, i) => {
    const b = document.createElement('button');
    b.innerHTML = `<span>${p.nome}</span><code>${p.clip}</code>`;
    b.className = !todos && i === poderIdx ? 'on' : '';
    b.onclick = () => { poderIdx = i; todos = false; tempo = 0; camIdx = -1; if (bonecos.length !== 1) montar(); else { desenharUI(); posicionarCamera(); } };
    return b;
  }));
  $('todos').className = todos ? 'on' : '';
  const p = poderAtual();
  const clip = CLIPS[todos ? 'heroi_pose' : p.clip];
  $('info').innerHTML = todos
    ? `<b>Todos os heróis</b> em <code>heroi_pose</code>. Toque num herói para testar os poderes.`
    : `<b>${nomeBonito(heroi)}</b>: ${PRESETS[heroi].role}<br><br><b>${p.nome}</b> · <code>${p.clip}</code> (${clip.loop ? 'loop' : 'uma vez'}, ${clip.duration}s)<br>${clip.description}.`;
}

function posicionarCamera() {
  const palco = todos ? {} : (PALCO[poderAtual().clip] || {});
  const i = camIdx >= 0 ? camIdx : (palco.cam ?? 0);
  const d = todos ? 9 : (palco.dist ?? 4.2);
  const alvoY = (palco.y ?? 0) + 1.0;
  const vistas = [[0, 0.35, 1], [0.62, 0.45, 0.78], [-0.7, 0.4, -0.7]];
  const [vx, vy, vz] = vistas[i % 3];
  camera.position.set(vx * d, alvoY + vy * d * 0.5, vz * d);
  controls.target.set(0, alvoY, 0);
  controls.update();
}

$('play').onclick = () => { pausado = !pausado; $('play').textContent = pausado ? 'Tocar' : 'Pausar'; };
$('cam').onclick = () => { camIdx = ((camIdx < 0 ? 0 : camIdx) + 1) % 3; posicionarCamera(); };
$('todos').onclick = () => { todos = !todos; camIdx = -1; montar(); };
addEventListener('resize', () => { renderer.setSize(innerWidth, innerHeight); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); });

let pausado = q.has('t');
let tempo = Number(q.get('t') ?? 0);
$('play').textContent = pausado ? 'Tocar' : 'Pausar';
window.__setTime = (t) => { pausado = true; tempo = t; };

montar();

let antes = performance.now();
function quadro() {
  const agora = performance.now();
  const dt = Math.min(0.1, (agora - antes) / 1000);
  antes = agora;
  if (!pausado) tempo += dt;
  const p = todos ? { clip: 'heroi_pose' } : poderAtual();
  const clip = CLIPS[p.clip];
  const vel = p.velocidade ?? 1;
  const palco = todos ? {} : (PALCO[p.clip] || {});
  const ciclo = clip.duration / vel + 1.0;
  const t = clip.loop ? tempo * vel : (tempo % ciclo) * vel;
  for (const c of bonecos) {
    playClip(c, p.clip, t, { params: p.params });
    c.root.position.set(c.baseX, palco.y ?? 0, 0);
    c.root.rotation.y = THREE.MathUtils.degToRad(palco.giro ?? 0);
  }
  // palco
  parede.visible = !!palco.parede;
  if (palco.parede) bonecos[0].root.position.y = 0.4 + ((tempo * 0.6) % 2.4);
  carro.visible = !!palco.carro;
  if (palco.carro) {
    const ph = Math.min(1, t / clip.duration);
    carro.position.set(0, 0.0 + 2.05 * smooth((ph - 0.32) / 0.38), 0);
  }
  escudoVoando.visible = false;
  if (palco.escudo) {
    const u = ((t / clip.duration) - 0.48) / 0.9;
    if (u > 0 && u < 1) {
      escudoVoando.visible = true;
      escudoVoando.position.set(0.35 + 1.5 * Math.sin(u * Math.PI), 1.0, 0.4 + 6 * Math.sin(u * Math.PI));
      escudoVoando.rotation.set(-Math.PI / 2, 0, u * 40);
    }
  }
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(quadro);
}
quadro();
window.__ready = true;
