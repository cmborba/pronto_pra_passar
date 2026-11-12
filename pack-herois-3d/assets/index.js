// Ponto de entrada do kit de assets. Tudo que o Claude precisa importar está aqui.
//
//   import { makePreset, animate, moveSpeed } from './assets/index.js';

export { makeCharacter, DEFAULT_CONFIG, applyFaceState } from './characters/makeCharacter.js';
export { PRESETS, PRESET_NAMES, makePreset } from './characters/presets.js';
export { HAIR_STYLES, HAT_TYPES, HELD_ITEMS } from './characters/parts.js';
export { JOINTS, GROUPS, DIMS, EXTRA_KEYS, ACCESSORY_KEYS } from './characters/skeleton.js';
export {
  ACESSORIOS, EMBLEMAS, registrarAcessorio, registrarEmblema, montarAcessorios, montarEscudo, malhaEmblema,
} from './characters/acessorios.js';
export { CLIPS, CLIP_NAMES, EXPRESSIONS, curve } from './animations/clips.js';
export {
  sampleClip, playClip, animate, evaluateTimeline, applyPose,
  blendPoses, overlayPose, mirrorPose, moveSpeed,
} from './animations/animator.js';
export {
  SCENERY, SCENERY_IDS, CATEGORIES, SKIES, makeScenery, setProgress, updateScenery, rollWheels, sceneryBox,
  setupEnvironment, setEnvironmentTime,
} from './scenery/index.js';
