// Voz PAGA: ElevenLabs. O áudio já vem com o tempo de cada caractere (endpoint "with-timestamps"),
// então não precisa do Whisper. A chave fica no arquivo .env (ELEVENLABS_API_KEY) e nunca é impressa.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const API = 'https://api.elevenlabs.io/v1';
// Vozes prontas da conta (multilíngues). Escolha a sua com `node tools/voz.mjs vozes`.
export const MODELO_PADRAO = 'eleven_multilingual_v2';

function cabecalho(chave) {
  if (!chave) throw new Error('Falta a chave do ElevenLabs. Crie o arquivo .env (copie o .env.example) e preencha ELEVENLABS_API_KEY=...');
  return { 'xi-api-key': chave, 'Content-Type': 'application/json' };
}

async function erroApi(r) {
  let corpo = '';
  try { corpo = await r.text(); } catch { /* ignora */ }
  const dica = r.status === 401 ? 'A chave é inválida ou não tem permissão.'
    : r.status === 402 || /quota|credit/i.test(corpo) ? 'Os créditos do plano acabaram.'
      : r.status === 422 ? 'O ElevenLabs recusou o pedido (verifique o voiceId e o texto).'
        : r.status === 429 ? 'Muitos pedidos ao mesmo tempo. Espere um pouco.' : '';
  return new Error(`ElevenLabs respondeu ${r.status}. ${dica} ${corpo.slice(0, 200)}`.trim());
}

export async function listarVozes(chave) {
  const r = await fetch(`${API}/voices`, { headers: cabecalho(chave) });
  if (!r.ok) throw await erroApi(r);
  const j = await r.json();
  return (j.voices || []).map((v) => ({
    id: v.voice_id, nome: v.name, categoria: v.category,
    idioma: v.labels?.language || (v.verified_languages || []).map((l) => l.language).join(',') || '',
    descricao: v.labels?.descriptive || v.labels?.description || '',
  }));
}

// Converte o alinhamento por caractere em palavras (separadas por espaço) com início/fim em segundos.
export function palavrasDoAlinhamento(texto, alinhamento) {
  const chars = alinhamento.characters;
  const ini = alinhamento.character_start_times_seconds;
  const fim = alinhamento.character_end_times_seconds;
  const palavras = [];
  let atual = null;
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    if (/\s/.test(ch)) {
      if (atual) { palavras.push(atual); atual = null; }
      continue;
    }
    if (!atual) atual = { palavra: '', inicio: ini[i], fim: fim[i] };
    atual.palavra += ch;
    atual.fim = fim[i];
  }
  if (atual) palavras.push(atual);
  return palavras.map((p) => ({ palavra: p.palavra, inicio: +p.inicio.toFixed(3), fim: +p.fim.toFixed(3) }));
}

// Divide o texto em pedaços curtos (frases inteiras). Textos longos num pedido só fazem a voz
// perder qualidade no meio (som abafado/metálico a partir de ~30 s), então cada pedaço vira um pedido.
export function dividirTexto(texto, limite = 380) {
  const frases = texto.replace(/\s+/g, ' ').trim().match(/[^.!?…]+[.!?…]+["”')\]]*\s*|[^.!?…]+$/g) || [texto];
  const partes = [];
  let atual = '';
  for (const f of frases) {
    if (atual && (atual + f).length > limite) { partes.push(atual.trim()); atual = ''; }
    atual += f;
  }
  if (atual.trim()) partes.push(atual.trim());
  return partes;
}

function duracao(arq) {
  const r = spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', arq], { encoding: 'utf8' });
  return parseFloat(r.stdout) || 0;
}

async function pedido({ texto, voiceId, chave, modelId, velocidade, anteriores, proximo, estilo }) {
  const url = `${API}/text-to-speech/${encodeURIComponent(voiceId)}/with-timestamps?output_format=mp3_44100_128`;
  const corpo = {
    text: texto,
    model_id: modelId,
    voice_settings: { stability: 0.45, similarity_boost: 0.8, style: estilo, use_speaker_boost: true, speed: velocidade },
  };
  if (anteriores.length) corpo.previous_request_ids = anteriores.slice(-3);
  if (proximo) corpo.next_text = proximo;
  const r = await fetch(url, { method: 'POST', headers: cabecalho(chave), body: JSON.stringify(corpo) });
  if (!r.ok) throw await erroApi(r);
  const j = await r.json();
  if (!j.audio_base64 || !j.alignment) throw new Error('Resposta do ElevenLabs sem áudio ou sem alinhamento.');
  return { j, id: r.headers.get('request-id') };
}

export async function gerarElevenLabs({ texto, voiceId, chave, modelId = MODELO_PADRAO, velocidade = 1.0, estilo = 0.0, saida }) {
  if (!voiceId) throw new Error('Falta escolher a voz do ElevenLabs: rode `node tools/voz.mjs vozes` e use `configurar-paga --voz <id>`.');
  const partes = dividirTexto(texto);
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'voz-'));
  const anteriores = [];
  const palavras = [];
  const arquivos = [];
  let deslocamento = 0;
  for (let i = 0; i < partes.length; i++) {
    const { j, id } = await pedido({ texto: partes[i], voiceId, chave, modelId, velocidade, anteriores, proximo: partes[i + 1], estilo });
    if (id) anteriores.push(id);
    const arq = path.join(tmp, `p${String(i).padStart(3, '0')}.mp3`);
    fs.writeFileSync(arq, Buffer.from(j.audio_base64, 'base64'));
    arquivos.push(arq);
    for (const p of palavrasDoAlinhamento(partes[i], j.alignment)) {
      palavras.push({ palavra: p.palavra, inicio: +(p.inicio + deslocamento).toFixed(3), fim: +(p.fim + deslocamento).toFixed(3) });
    }
    deslocamento += duracao(arq);
    process.stdout.write(`  parte ${i + 1}/${partes.length} pronta\n`);
  }
  // junta os pedaços em PCM e codifica uma vez só (sem perder qualidade em cada emenda)
  const entradas = arquivos.flatMap((a) => ['-i', a]);
  const filtro = arquivos.map((_, k) => `[${k}:a]`).join('') + `concat=n=${arquivos.length}:v=0:a=1[a]`;
  const ff = spawnSync('ffmpeg', ['-y', '-v', 'error', ...entradas, '-filter_complex', filtro, '-map', '[a]', '-c:a', 'libmp3lame', '-b:a', '192k', saida], { encoding: 'utf8' });
  if (ff.status !== 0) throw new Error(`Falha ao juntar as partes da voz: ${ff.stderr}`);
  fs.rmSync(tmp, { recursive: true, force: true });
  const fimFala = palavras.length ? palavras[palavras.length - 1].fim : 0;
  return { palavras, duracaoFala: fimFala, partes: partes.length };
}
