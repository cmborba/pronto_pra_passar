# Heroi Vertice Demo

- **Ideia do criador:** testar o pack de heróis 3D com uma demonstração visual de 10 s, estilo desenho animado de super-herói, com o personagem original `heroi_vertice`. Formato 9:16, cenário urbano simples, sem voz.
- **Duração pedida:** 10 segundos
- **Estado:** storyboard → prévia → final (sem narração por enquanto)

## Sequência (storyboard gerado por `gerar-storyboard.mjs`)

| Tempo | Ação | Animações do pack | Câmera |
|---|---|---|---|
| 0–2 s | aparece em pé na rua, em pose heroica, com brilho de energia | `heroi_pose` + fluxo `luz` | `enquadrar` baixo, aproximando |
| 2–4 s | corre pelo meio da rua em direção à câmera | `run` (movimento) + fluxo `poeira` | `travelling` recuando à frente dele |
| 4–7 s | agacha, salta em arco (3 m de altura, 7,5 m à frente) e desce | `salto_heroico` (velocidade 0.6) + `anim.pos` no arco + `poeira`/`fagulha` | `travelling` baixo, de frente |
| 7–10 s | aterrissa com impacto e termina em pose heroica | `aterrissagem_heroica` → `heroi_pose` + `tremor` + `poeira`/`fagulha`/`luz` | `enquadrar` baixo, orbitando |

Cenário: `rua_reta`, prédios, lojas, postes, árvores e trânsito ao fundo (`fundo: cidade`).

## Como refazer

```bash
node projects/heroi-vertice-demo/gerar-storyboard.mjs
node tools/validar.mjs projects/heroi-vertice-demo
node tools/render.mjs projects/heroi-vertice-demo --previa   # 540×960
node tools/render.mjs projects/heroi-vertice-demo            # 1080×1920
```

Player interativo: `npm run preview` e abrir `http://localhost:5173/engine/player.html?projeto=projects/heroi-vertice-demo`.
