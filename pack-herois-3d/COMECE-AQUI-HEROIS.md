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
