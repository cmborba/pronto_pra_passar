# Herois Poderes Demo

- **Ideia do criador:** demonstração vertical de 10 s com os quatro heróis de humor apresentando seus poderes. Cenário urbano simples, sem voz.
- **Duração:** 10 segundos · **Estado:** storyboard → prévia → final (sem narração)

| Tempo | Herói | O que acontece | Clips / recursos |
|---|---|---|---|
| 0–2,4 s | Aracnildo | entra balançando no fio, aterrissa e lança um fio no cone | `balancar` + `anim.pos` em arco, `aterrissagem_heroica`, `lancar_teia` |
| 2,4–3,5 s | Major Cometa | atravessa o céu voando, capa tremulando | `voar` + `anim.pos` |
| 3,5–4,8 s | Major Cometa | visão de calor incendeia o muro | `visao_calor` (feixes), fluxos `fogo`, `fumaca`, `fagulha` |
| 4,8–7,2 s | Coruja Noturna | plana do alto com a capa-asa e some na fumaça | `planar` + `anim.pos`, `soltar_fumaca` (nuvem) + fluxo `fumaca` |
| 7,2–9,0 s | Capitão Tampa | arremessa o escudo, derruba o cone, o escudo volta e ele defende | `arremessar_escudo`, objeto `escudo_heroi` com `anim`, `defender`, `tremor` |
| 9,0–10 s | Todos | pose final em grupo, Cometa flutuando | `heroi_pose`, pergunta final |

Refazer: `node projects/herois-poderes-demo/gerar-storyboard.mjs` e `node tools/render.mjs projects/herois-poderes-demo`.
