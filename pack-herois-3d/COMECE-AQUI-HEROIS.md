# PACK DE HERÓIS ANIMADOS — PRIMEIRA VERSÃO

Aproveita o motor do kit enviado e acrescenta **3 personagens 3D originais** em estética de desenho animado de super-herói, com máscara, lentes expressivas, símbolo angular de energia, luvas e botas. Não contém símbolos, uniformes ou logotipos do Homem-Aranha.

## Novos personagens

- `heroi_vertice`: azul-marinho, laranja e branco. Personagem principal.
- `heroina_pulso`: verde-petróleo com turquesa. Parceira de ciência.
- `heroi_impacto`: roxo com dourado. Demonstrações de força e física.

## Novos movimentos

- `heroi_pose` — apresentação com respiração e atitude.
- `salto_heroico` — impulso, voo e pouso no lugar.
- `aterrissagem_heroica` — aterrissagem com recuperação.

Além disso, todos os personagens já aceitam os movimentos existentes: `walk`, `run`, `point`, `talk`, `think`, `cheer`, `crouch` e outros.

## Visualizar

1. Extraia o ZIP no seu computador.
2. Na pasta, execute `npm install` e `npm run catalog` (Node.js 18+).
3. Rode `npm run preview` e abra `http://localhost:5173`.
4. Escolha `heroi_vertice` e teste os novos movimentos.
5. Para renderizar vídeo, siga as instruções do `README.md`, com Chrome/Chromium e FFmpeg instalados.

## Exemplo de personagem/animação no código

```js
import { makePreset, playClip } from './assets/index.js';
const protagonista = makePreset('heroi_vertice');
scene.add(protagonista.root);
playClip(protagonista, 'heroi_pose', 1.0);
```

## Prompt pronto para Claude Code

> Leia AGENTE.md e o catálogo atual. Vamos usar como protagonista o personagem `heroi_vertice`, um herói 3D **original**, em estética colorida de desenho animado de HQ. O vídeo terá cenas dinâmicas, narrativa em português do Brasil, cortes frequentes e 9:16. Use as animações `heroi_pose`, `salto_heroico`, `aterrissagem_heroica`, `run`, `talk` e `point` conforme o roteiro. Primeiro proponha uma sinopse e um storyboard; depois produza o vídeo. Não use uniformes, logotipos nem personagens de terceiros.

## Status desta versão

Implementação de código + configuração e documentação. O resultado gráfico final precisa ser testado no navegador com as dependências instaladas. O mecanismo preservado segue **low-poly**, com o rosto dos heróis mais suave; ainda não é uma produção 3D com toon outlines avançados ou efeitos de filme de animação. Não inclui modelos externos FBX/GLB. Para efeitos elaborados de contornos, cabos ou teias e cenários de quadrinhos é necessária uma próxima etapa de desenvolvimento.

---

# EXTENSÃO 2 — HERÓIS DE HUMOR E PODERES

Quatro heróis originais de humor, inspirados em arquétipos clássicos do gênero (aranha, voador, vigilante noturno, capitão com escudo), com **visual, nomes e emblemas próprios**. Não usam nomes, uniformes, logotipos ou símbolos de personagens existentes.

| Preset | Quem é | Poderes (clip) |
|---|---|---|
| `aracnildo` | herói-aranha atrapalhado, verde-limão e roxo, quatro olhinhos extras | lançar fio (`lancar_teia`), escalar (`escalar`), saltar (`salto_heroico`), balançar (`balancar`), sentir perigo (`sentir_perigo`) |
| `major_cometa` | voador exibido, branco e laranja, capa azul-petróleo, emblema de cometa | voar (`voar`), levantar peso (`levantar_peso`), supervelocidade (`run` rápido), visão de calor (`visao_calor`), sopro congelante (`sopro_congelante`) |
| `coruja_noturna` | vigilante coruja, roxo-grafite e âmbar, capa-asa, cinto de bolsinhas | gancho (`lancar_gancho`), planar (`planar`), lutar (`lutar`), lançar dispositivo (`lancar_dispositivo`), fumaça (`soltar_fumaca`) |
| `capitao_tampa` | capitão de capacete-panela e escudo-tampa com espiral | arremessar escudo (`arremessar_escudo` + objeto `escudo_heroi`), defender (`defender`), correr, saltar, lutar |

## Ver e testar

`npm run preview` e abra `http://localhost:5173/preview/herois.html` (menu **Heróis**): escolha o herói e toque em cada poder. A demo de 10 s está em `projects/herois-poderes-demo` (player: `/engine/player.html?projeto=projects/herois-poderes-demo`).

## Como funciona (para criar dezenas de heróis)

- **Herói = ficha de dados.** Em `assets/characters/presets.js`, `criarHeroi({ papel, cores, corpo, lentes, simbolo, acessorios, poderes })`. Lentes: `gota`, `redonda`, `fenda`.
- **Acessórios reutilizáveis** (`assets/characters/acessorios.js`): `capa` (reta ou `asa`), `capacete` (`panela` ou elmo), `tufos_coruja`, `olhos_extras`, `cinto`, `lancadores`, `fio` (ponta `teia` ou `gancho`), `feixes_olhos`, `sopro`, `nuvem`, `escudo`, `emblema`. Novo acessório: `registrarAcessorio('nome', (ctx, opcoes) => ...)`.
- **Emblemas** (formas 2D): `raio`, `cometa`, `espiral`, `aranha_fofa`, `coruja`, `brilho`. Novo emblema: `registrarEmblema('nome', () => [THREE.Shape])`.
- **Efeitos animados pela pose.** Os clips de poder escrevem chaves extras na pose (`capa`, `fioR`, `fioL`, `feixe`, `sopro`, `escudo`, `nuvem`) e cada acessório reage a elas. Por isso os efeitos funcionam igual no player, no render e na galeria, e qualquer personagem pode usar qualquer clip (sem o acessório, faz só o movimento).
- **Clips de poder** (`assets/animations/clips_poderes.js`) são genéricos e entram no catálogo automaticamente.
- **Voo, balanço, planar e arcos:** mova o personagem com `anim.pos` no storyboard (keyframes `[t, [x, y, z]]`; use `suave: false` para trilhas densas).
- **Acabamento de desenho:** heróis ganham contorno e sombreamento liso automaticamente; outros personagens podem usar `contorno: true`.

`npm run check` testa cada poder de cada herói (sem NaN e com o acessório correspondente).
