# Catálogo de assets — Kit de vídeo 3D simples

> Gerado automaticamente por `npm run catalog` a partir do código em `assets/`. Não edite à mão.
> Você (Claude) é o **diretor**: escolhe personagens e animações deste catálogo e escreve só o roteiro de cenas.
> **Não reescreva os personagens nem as animações.** Se faltar algo, crie um asset novo em `assets/` e rode `npm run catalog`.

## 1. Como usar

```js
import * as THREE from 'three';
import { makePreset, animate, moveSpeed } from './assets/index.js';

const guia = makePreset('construtor');            // personagem pronto
scene.add(guia.root);                             // guia.root é um THREE.Group
guia.root.position.set(0, 0, 0);
guia.root.rotation.y = Math.PI / 2;               // vira para +X (padrão: olha para +Z)

// A CADA FRAME, com t em segundos (nunca use relógio/requestAnimationFrame para animar):
animate(guia, [
  [ { clip: 'walk', start: 0, end: 3 },
    { clip: 'point', start: 3, end: 6, params: { dir: 'up' } } ],           // camada 0: corpo
  [ { clip: 'talk', start: 1, end: 6, mask: ['head', 'face'] } ],           // camada 1: sobrepõe só cabeça/rosto
], t);

// Enquanto ele anda, mova o personagem na velocidade certa (pés não patinam):
guia.root.position.x = moveSpeed(guia, 'walk') * Math.min(t, 3);
```

- **Variações**: `makePreset('construtor', { name: 'construtor2', top: { color: '#c0392b' }, hat: { color: '#ffffff' } })`. Dê um `name` único para cada cópia (muda o ritmo do piscar).
- **Personagem novo do zero**: `makeCharacter({ ... })` (ver opções na seção 4).
- **Um clip só**: `playClip(personagem, 'wave', t)`.
- **Resultado é função pura de `t`**: pode renderizar qualquer frame em qualquer ordem (obrigatório para gerar vídeo frame a frame no HyperFrames/Remotion).
- Prévia visual: `npm run preview` e abra http://localhost:5173 (escolha personagem, animação e expressão).

## 2. Convenções

| Item | Valor |
|---|---|
| Unidades | metros; pés em y = 0 |
| Direção | o personagem olha para **+Z**; `root.rotation.y` gira o personagem |
| Lado | esquerdo do personagem = **+X** |
| Altura | adulto ≈ 1.72 m; criança usa escala ≈ 0.64 |
| Esqueleto | o MESMO para todos: hips, spine, chest, neck, head, armL, forearmL, handL, armR, forearmR, handR, legL, shinL, footL, legR, shinR, footR |
| Grupos de máscara | `torso`, `head`, `face`, `armL`, `armR`, `arms`, `legs`, `legL`, `legR` |
| Escala dos clips | `seatHeight` e afins estão em metros do personagem **antes** da escala `height` |

## 3. Personagens prontos

| id | papel sugerido | altura aprox. | chapéu | cabelo | camisa | veste | na mão |
|---|---|---|---|---|---|---|---|
| `construtor` | Protagonista / narrador. Mestre de obras: explica o passo a passo da construção. | 1.72 m | hardhat | short | #f28c28 (manga curta) | pants | — |
| `engenheiro` | Especialista técnico. Entra para explicar cálculo, projeto e normas. Já vem com prancheta na mão esquerda. | 1.75 m | hardhat | short | #7fb3d5 (manga longa) | pants | clipboard (esquerda) |
| `engenheira` | Especialista técnica / supervisora de obra. Voz de autoridade amigável. | 1.65 m | hardhat | ponytail | #ff8a3d (manga longa) | pants | — |
| `servente` | Ajudante de obra. Faz o trabalho braçal (cava, carrega, empurra). Já vem com pá na mão direita. | 1.72 m | hardhat | short | #9aa0a6 (manga curta) | shorts | shovel (direita) |
| `homem` | Morador / pessoa comum (dono da casa, passante, curioso fazendo a pergunta do vídeo). | 1.72 m | — | fringe | #5fae6b (manga curta) | pants | — |
| `mulher` | Moradora / pessoa comum (vizinha, mãe, passageira). | 1.63 m | — | long | #d96c8c (manga curta) | skirt | — |
| `velhinho` | Idoso curioso ou sábio. Bom para perguntas ("como isso se sustenta?") e humor. | 1.62 m | — | sides | #8a6d4b (manga longa) | pants | — |
| `velhinha` | Idosa curiosa ou sábia. Boa para reações e comentários simpáticos. | 1.55 m | — | bun | #b08fd0 (manga longa) | skirt | — |
| `crianca` | Criança curiosa (menino). Faz as perguntas ingênuas que puxam a explicação. | 1.1 m | cap | short | #f2d13a (manga curta) | shorts | — |
| `menina` | Criança curiosa (menina). Faz perguntas e reage com surpresa. | 1.07 m | — | ponytail | #e8586a (manga curta) | skirt | — |
| `motorista` | Motorista (carro, ônibus, caminhão, metrô). Use com a animação sit (params: { arms: "wheel" }). | 1.72 m | cap | short | #34495e (manga curta) | pants | — |
| `heroi_vertice` | Protagonista mascarado. Apresenta curiosidades, corre, salta, explica e reage diante da câmera. | 1.75 m | — | none | #182c53 (manga longa) | pants | — |
| `heroina_pulso` | Heroína parceira. Explica ciência, reações e energia com ação acrobática. | 1.63 m | — | none | #0a4248 (manga longa) | pants | — |
| `heroi_impacto` | Herói forte e bem-humorado. Entra em cena para demonstrar forças e mecanismos. | 1.81 m | — | none | #40244c (manga longa) | pants | — |
| `aracnildo` | Herói-aranha atrapalhado e simpático. Lança fios, escala paredes, salta, balança entre prédios e sente perigos. | 1.69 m | — | none | #8fd14f (manga longa) | pants | — |
| `major_cometa` | Herói voador, forte e um pouco exibido. Voa, levanta peso, corre muito rápido, tem visão de calor e sopro congelante. | 1.79 m | — | none | #f5f3ee (manga longa) | pants | — |
| `coruja_noturna` | Vigilante noturna séria (mas dorminhoca de dia). Usa gancho, plana com a capa, luta, lança dispositivos e some na fumaça. | 1.72 m | — | none | #4a3e5c (manga longa) | pants | — |
| `capitao_tampa` | Capitão destemido com capacete de panela e escudo-tampa. Arremessa o escudo, defende, corre, salta e luta. | 1.77 m | — | none | #2f7d4a (manga longa) | pants | — |

Dicas de elenco: `construtor` é o protagonista/narrador; `engenheiro`/`engenheira` explicam o técnico; `servente` faz o braçal; `homem`, `mulher`, `velhinho`, `velhinha`, `crianca`, `menina` são moradores/curiosos que fazem as perguntas; `motorista` dirige. Mantenha o MESMO personagem para o MESMO papel durante o vídeo inteiro (consistência).

## 4. Opções para criar/ajustar personagens (`makeCharacter` / overrides de `makePreset`)

| Campo | Valores |
|---|---|
| `skin` | cor hex (ex.: #f3cfae, #e0ac69, #c68642, #8d5524, #5c3a21) |
| `height` | escala uniforme (adulto 1, criança ≈ 0.64) |
| `build` | largura do corpo (0.85 magro … 1.3 largo) |
| `headScale` | cabeça maior/menor (crianças ≈ 1.18) |
| `top` | `{ color, stripe (cor das faixas ou null), sleeves: 'short' \| 'long' }` |
| `bottom` | `{ color, type: 'pants' \| 'shorts' \| 'skirt' }` |
| `shoes` | cor hex |
| `hair` | `{ style: 'bald' | 'short' | 'fringe' | 'long' | 'ponytail' | 'bun' | 'curly' | 'sides', color }` (com chapéu, o topo do cabelo some) |
| `hat` | `{ type: 'none' | 'hardhat' | 'cap', color }` |
| `face` | `{ brow, glasses, mustache, beard, facialHairColor }` |
| `held` | `{ R, L }` com 'none' | 'hammer' | 'clipboard' | 'shovel' |
| `stoop` | costas curvadas em graus (idosos ≈ 10) |

## 5. Animações

Todas funcionam em QUALQUER personagem. "Loop" repete; os demais tocam uma vez e **seguram a pose final**.

| clip | o que faz | loop | duração | afeta | parâmetros |
|---|---|---|---|---|---|
| `idle` | Em pé parado, respirando e balançando de leve. Pose padrão quando nada está acontecendo. | sim | 4s | torso, head, arms, legs | — |
| `walk` | Andar em linha reta. Mova o personagem à frente na velocidade certa (use walkSpeed) para os pés não "patinarem". Desloca-se a 0.943 m/s (adulto, speed=1). | sim | 1s | torso, head, arms, legs | — |
| `run` | Correr. Mais rápido, braços dobrados, tronco inclinado e pequenos saltos. Desloca-se a 2.781 m/s (adulto, speed=1). | sim | 0.6s | torso, head, arms, legs | — |
| `wave` | Acenar com a mão (cumprimento). Bom para apresentar o personagem ou se despedir. | sim | 1.2s | armR, head, face | `side` (padrão "R"): 'R' acena com o braço direito, 'L' com o esquerdo |
| `point` | Apontar com o braço para mostrar algo. Pose de uma vez só: o braço sobe e fica apontando. | não | 0.5s | armR, head | `side` (padrão "R"): 'R' ou 'L': qual braço aponta<br>`dir` (padrão "forward"): forward | forwardUp | up | side (para fora do corpo) | down |
| `talk` | Falar gesticulando: mão direita e esquerda acompanham a fala, cabeça mexe, boca abre e fecha. Use enquanto toca a narração. | sim | 2.4s | armR, armL, head, face, torso | `mouthOpen` (padrão null): Opcional 0..1: abertura da boca vinda do áudio (lip-sync). Se omitido, usa fala simulada.<br>`energy` (padrão 1): Intensidade dos gestos (0.5 calmo ... 1.5 empolgado) |
| `hammer` | Martelar (bater prego, construir). Funciona melhor com o item "hammer" na mão direita. | sim | 0.9s | armR, armL, torso, head, legs | `side` (padrão "R"): 'R' ou 'L': qual braço bate |
| `carry` | Carregar uma caixa/saco com os dois braços à frente. Use walking=1 para andar carregando, 0 para ficar parado. Desloca-se a 0.943 m/s (adulto, speed=1). | sim | 1s | torso, head, arms, legs | `walking` (padrão 1): 0 = parado carregando, 1 = andando carregando |
| `push` | Empurrar algo pesado à frente (carrinho de mão, parede, porta), inclinado e com passos curtos. Desloca-se a 0.597 m/s (adulto, speed=1). | sim | 1.2s | torso, head, arms, legs | — |
| `dig` | Cavar com a pá (use o item "shovel"). Abaixa, enfia, levanta. | sim | 1.6s | torso, head, arms, legs | — |
| `cheer` | Comemorar pulando com os braços para cima (sucesso, "funcionou!", final do vídeo). | sim | 0.8s | torso, head, arms, legs, face | — |
| `surprised` | Susto/surpresa: recua o corpo, abre os braços, olhos e boca arregalados. Pose de uma vez só. | não | 0.35s | torso, head, arms, face | — |
| `think` | Pensar: mão no queixo, cabeça inclinada, olhando para cima. Bom antes de uma explicação ou pergunta. | sim | 3s | torso, head, arms, face | — |
| `look_around` | Olhar ao redor, virando a cabeça e o corpo devagar para os lados. | sim | 4s | head, torso, face | — |
| `nod` | Balançar a cabeça dizendo "sim". | não | 0.9s | head, face | — |
| `shake_head` | Balançar a cabeça dizendo "não". | não | 0.9s | head, face | — |
| `shrug` | Dar de ombros ("não sei" / "talvez"): braços abertos e cabeça inclinada. Pose de uma vez só. | não | 0.45s | arms, head, torso, face | — |
| `crouch` | Agachar para olhar/mexer em algo no chão (inspecionar fundação, fiação, encanamento). | não | 0.6s | torso, head, arms, legs | — |
| `sit` | Sentar (cadeira, banco, banco do carro). Ajuste seatHeight à altura do assento e arms ao uso. | não | 0.5s | torso, head, arms, legs | `seatHeight` (padrão 0.34): Altura do assento em metros (unidades do personagem, antes da escala). 0.34 = pés tocam o chão.<br>`arms` (padrão "lap"): 'lap' (mãos no colo), 'wheel' (mãos no volante, para dirigir) ou 'table' (braços sobre a mesa) |
| `read_clipboard` | Ler/anotar na prancheta (use com engenheiro, que já tem prancheta na mão esquerda). | sim | 3s | arms, head, torso, face | — |
| `heroi_pose` | Pose heroica de apresentação com braços abertos, cabeça erguida e atitude. | sim | 2.2s | torso, head, arms, legs, face | — |
| `salto_heroico` | Impulso, voo e aterrissagem estilizada em um ciclo de 1,8 s; salto parado. | não | 1.8s | torso, head, arms, legs | — |
| `aterrissagem_heroica` | Aterrissagem agachada e abertura de braços, seguida de pose heroica. | não | 1.2s | torso, head, arms, legs | — |
| `lancar_teia` | Lança um fio pelo pulso: prepara, estica o braço e o fio dispara à frente (use com o acessório "fio"). Segura a pose | não | 0.9s | torso, head, arms, legs, face | `side` (padrão "R"): 'R' ou 'L': braço que lança<br>`mira` (padrão 0): graus acima da horizontal (0 = para a frente; 60 = para o céu)<br>`alcance` (padrão 7): comprimento do fio (m) |
| `escalar` | Escalar uma parede: braços e pernas alternados, corpo colado na parede (vire o personagem para a parede e suba com anim.pos) | sim | 1.1s | torso, head, arms, legs | — |
| `balancar` | Balançar pendurado num fio (pêndulo): braço esticado para cima segurando o fio, pernas juntas. Mova o personagem em arco com anim.pos | sim | 2.4s | torso, head, arms, legs | `fio` (padrão 4.5): comprimento do fio (m), para quem tem o acessório "fio" |
| `puxar_fio` | Puxar um fio/corda com as duas mãos, com toda a força: inclina para trás, braços estendidos para cima à frente e os pés escorregando (cabo de guerra) | sim | 0.9s | torso, head, arms, legs, face | `mira` (padrão 35): graus acima da horizontal para onde o fio vai |
| `derrapar` | Frear derrapando depois de correr muito rápido: tronco jogado para trás, uma perna esticada à frente travando, braços girando. Mova o personagem desacelerando (anim.pos) e ponha fagulhas/fumaça nos pés | sim | 0.5s | torso, head, arms, legs, face | — |
| `tonto_no_chao` | Sentado no chão, tonto depois de uma batida: pernas esticadas à frente, apoiado nos braços, cabeça rodando em círculo | sim | 1.6s | torso, head, arms, legs, face | — |
| `sentir_perigo` | Sentir perigo: agacha em alerta, olha rápido para um lado e para o outro, olhos arregalados. Segura a pose | não | 1.2s | torso, head, arms, legs, face | — |
| `voar` | Voar: corpo deitado no ar, punho à frente, pernas esticadas para trás, capa tremulando. Mova com anim.pos | sim | 1.6s | torso, head, arms, legs, face | `punhos` (padrão 1): 1 = um punho à frente; 2 = os dois |
| `levantar_peso` | Levantar algo muito pesado: agacha, firma e ergue os braços acima da cabeça. Segura a pose (o objeto sobe junto com anim.pos) | não | 1.6s | torso, head, arms, legs, face | — |
| `visao_calor` | Visão de calor: firma a base, cerra os punhos e dois feixes saem dos olhos (acessório "feixes_olhos"). Segura a pose | não | 1.4s | torso, head, arms, legs, face | `alcance` (padrão 7): comprimento dos feixes (m) |
| `sopro_congelante` | Sopro congelante: enche o peito inclinando para trás e sopra um jato gelado à frente (acessório "sopro"). Segura a pose | não | 1.6s | torso, head, arms, legs, face | — |
| `lancar_gancho` | Disparar um gancho para o alto (acessório "fio" com ponta de gancho): mira, recua com o tranco e o cabo estica. Segura a pose | não | 1s | torso, head, arms, legs, face | `side` (padrão "R"): 'R' ou 'L': braço que dispara<br>`alcance` (padrão 9): comprimento do cabo (m) |
| `planar` | Planar com a capa aberta como asas: corpo inclinado, braços abertos segurando a capa. Mova em descida com anim.pos | sim | 2s | torso, head, arms, legs | — |
| `lutar` | Lutar: guarda alta com jab, cruzado e passo de base, em ciclo | sim | 1.1s | torso, head, arms, legs, face | — |
| `lancar_dispositivo` | Arremessar um dispositivo por cima do ombro (bumerangue, bomba de fumaça): recua o braço e lança à frente. Segura a pose | não | 0.9s | torso, head, arms, legs | `side` (padrão "R"): 'R' ou 'L': braço que arremessa |
| `soltar_fumaca` | Bomba de fumaça: agacha, bate a mão no chão e some numa nuvem (acessório "nuvem"). Segura a pose | não | 1.3s | torso, head, arms, legs, face | — |
| `arremessar_escudo` | Arremessar o escudo do antebraço esquerdo de lado, como disco: gira o tronco, solta e o escudo some do braço (o voo é um objeto "escudo_heroi" com anim) | não | 1.1s | torso, head, arms, legs | — |
| `defender` | Defender com o escudo: base baixa e o antebraço esquerdo erguido à frente do corpo. Segura a pose | não | 0.5s | torso, head, arms, legs, face | — |

Regras da linha do tempo (`animate`):
- Cada **camada** é uma lista de segmentos `{ clip, start, end?, speed?, params?, fade?, mask?, expression? }` em ordem de início.
- Camada 0 = corpo base (sem segmento ativo → `idle`). Camadas seguintes **sobrepõem só** as juntas do clip; use `mask` (ex.: `['head','face']`, `['armR']`) para limitar.
- Entre segmentos seguidos da mesma camada há transição suave de `fade` segundos (padrão 0.3).
- `speed` acelera/desacelera o clip. Clips de um lado só aceitam `params: { side: 'L' }`.
- Para andar/correr/empurrar/carregar, mova `root.position` com `moveSpeed(personagem, clip, params)`.
- Lip-sync: no clip `talk`, passe `params: { mouthOpen }` (0..1, vindo do volume do áudio) a cada frame; sem isso a boca usa fala simulada.

## 6. Expressões

`neutral`, `happy`, `laugh`, `sad`, `angry`, `surprised`, `worried`, `thinking`, `sleepy` — use `expression: 'happy'` no segmento (ou em `playClip`). O clip pode ter rosto próprio (ex.: `talk`); a expressão informada prevalece. Os personagens piscam sozinhos.

## 7. Cenário

Mesmas convenções dos personagens (metros, frente para **+Z**, origem no centro da base, `y = 0` é o chão). Todos os assets têm **variantes** prontas (`makeScenery('casa_simples', { variant: 'verde' })`) e parâmetros (`makeScenery('arvore_redonda', { height: 8, seed: 4 })`); o `seed` varia o formato de árvores, mantendo o mesmo resultado para o mesmo número.

```js
import { makeScenery, setProgress, updateScenery, rollWheels, setupEnvironment, makePreset } from './assets/index.js';

setupEnvironment(scene, { time: 'dia', area: 20 });          // céu, luz e sombra padrão ('dia' | 'tarde' | 'nublado')
const chao = makeScenery('chao', { type: 'grama', size: 60 }); scene.add(chao);
const casa = makeScenery('casa_simples', { variant: 'verde' });
casa.position.set(-8, 0, -6); casa.rotation.y = Math.PI / 2;  // gira a fachada (padrão: olha para +Z)
scene.add(casa);

const obra = makeScenery('casa_obra'); scene.add(obra);
setProgress(obra, t / 20);                                    // etapa 0..1 em função do tempo (frame a frame)

const taxi = makeScenery('carro_sedan', { variant: 'taxi' }); scene.add(taxi);
taxi.position.z = 4 * t; rollWheels(taxi, 4 * t);             // anda e as rodas giram juntas
updateScenery(betoneira, t);                                  // tambor da betoneira gira
```

**Alturas do piso** (onde pôr `personagem.root.position.y`): chão/grama 0; asfalto 0.06; calçada 0.20 (meio-fio); tabuleiro da ponte = parâmetro `height`.
**Escala de referência:** adulto 1.72 m; porta ≈ 2.1 m; pé-direito 2.8 m; carro 4.4 m.
**Peso:** cada malha é um objeto; prédios com muitas janelas têm 100–200. Evite muitas cópias dos maiores (`predio_apartamentos`, `predio_estrutura`) na mesma cena.
**Como animar:** `setProgress(obj, 0..1)` nos assets marcados "etapas"; `updateScenery(obj, t)` nos marcados "tempo"; `rollWheels(obj, metros)` em veículos, carrinho de mão e rolo compressor.

### Casas

| id | o que é | tamanho (x × z × altura) | parâmetros | variantes | animação |
|---|---|---|---|---|---|
| `casa_simples` | Casa térrea de telhado de duas águas, porta central, duas janelas na frente e chaminé. 6 × 7 m. | 6.8 × 8.3 × 5.2 m | `wall` ("#f2e2bf"): cor da parede<br>`roof` ("#d2693a"): cor das telhas<br>`door` ("#7a4a2b"): cor da porta<br>`trim` ("#ffffff"): cor de portas e janelas (molduras)<br>`chimney` (true): mostrar chaminé | `verde`, `azul`, `amarela` | — |
| `casa_colonial` | Casa grande de telhado de quatro águas com varanda de colunas, portas duplas e janelas com venezianas. 9 × 7 m (+2 m de varanda). | 10 × 9.8 × 5.3 m | `wall` ("#f6edd2"): cor da parede<br>`roof` ("#c8593a"): cor das telhas<br>`shutter` ("#3f7f5a"): cor das venezianas<br>`trim` ("#ffffff"): cor das colunas e molduras | `rosa`, `azul` | — |
| `sobrado` | Casa de dois andares com garagem, porta de entrada, sacada sobre a garagem e telhado de duas águas. 6,5 × 8 m, 5,6 m de parede. | 7.3 × 9.5 × 7.8 m | `wall` ("#e6dcc8"): cor da parede<br>`roof` ("#a8402c"): cor das telhas<br>`garage` ("#9aa3ad"): cor do portão da garagem<br>`trim` ("#ffffff"): cor das molduras | `cinza`, `salmao` | — |
| `casa_moderna` | Casa de linhas retas: dois volumes, laje plana, janelas grandes e garagem. 9 × 7 m, 6 m de altura. | 9.5 × 7.7 × 6.3 m | `wall` ("#f1f1ee"): cor do volume de baixo<br>`accent` ("#8f9aa5"): cor do volume de cima<br>`wood` ("#a9743f"): cor do portão e detalhes de madeira | `escura`, `quente` | — |

### Prédios e pontes

| id | o que é | tamanho (x × z × altura) | parâmetros | variantes | animação |
|---|---|---|---|---|---|
| `predio_apartamentos` | Prédio residencial com térreo de entrada, janelas e sacadas em cada andar, platibanda e caixa d'água. 14 × 10 m; cada andar 3 m. | 14.3 × 11.4 × 20.4 m | `floors` (6): número de andares (incluindo o térreo)<br>`wall` ("#e9d8b4"): cor da parede<br>`accent` ("#b9855a"): cor do térreo, sacadas e detalhes<br>`balconies` (true): sacadas na frente | `azul`, `rosa`, `alto` | — |
| `arranha_ceu` | Torre de escritórios com fachada de vidro, faixas de laje a cada andar, base (pódio), coroa e antena. 16 × 16 m; cada andar 4 m. | 22.1 × 22.2 × 71.8 m | `floors` (14): número de andares (cada um tem 4 m)<br>`glass` ("#5b8fb9"): cor do vidro<br>`band` ("#dfe7ee"): cor das faixas de laje | `verde`, `escuro`, `alto` | — |
| `loja` | Loja de rua com vitrine grande, porta de vidro, toldo listrado e letreiro. 8 × 8 m, 4 m de altura. | 8.4 × 9.6 × 4.3 m | `wall` ("#f0e6d2"): cor da parede<br>`awning` ("#d9473a"): cor do toldo (alterna com branco)<br>`sign` ("#3d6fb6"): cor do letreiro | `padaria`, `mercado` | — |
| `galpao` | Galpão industrial de telhado metálico, portão de enrolar, janelas altas e chaminé. 24 × 14 m, 6 m de parede. | 25 × 15 × 15.5 m | `wall` ("#c9cdd2"): cor das paredes<br>`roof` ("#6d7783"): cor do telhado<br>`door` ("#d9473a"): cor do portão | `azul`, `verde` | — |
| `ponte_viga` | Ponte de concreto sobre um rio: tabuleiro com pista, guarda-corpo, dois pilares com travessa e encontros nas pontas. Vão de 24 m ao longo de X, 8 m de largura. | 40.5 × 14 × 5.6 m | `length` (24): comprimento do vão em metros (ao longo de X)<br>`height` (4.5): altura do tabuleiro acima da água<br>`river` (true): mostrar o rio embaixo | `longa`, `baixa` | — |

### Em construção (animáveis)

| id | o que é | tamanho (x × z × altura) | parâmetros | variantes | animação |
|---|---|---|---|---|---|
| `casa_obra` | Casa sendo construída: setProgress(p) mostra fundação (0–0.12), pilares (–0.25), paredes de tijolo (–0.55), laje (–0.65), madeiramento (–0.82) e telhas (–1). 6 × 7 m. | 6.8 × 7.9 × 5 m | `progress` (1): etapa inicial 0..1 (depois use setProgress)<br>`brick` ("#b8573b"): cor dos tijolos<br>`tile` ("#d2693a"): cor das telhas | `fundacao`, `paredes`, `madeiramento` | etapas (`setProgress`) |
| `predio_estrutura` | Esqueleto de concreto (pilares e lajes) subindo andar por andar: setProgress(p) constrói de 0 a todos os andares. 15 × 10 m, andares de 3,2 m. | 16.2 × 11.2 × 26.4 m | `floors` (8): número de andares<br>`progress` (1): etapa inicial 0..1<br>`concrete` ("#b9b9b4"): cor do concreto | `baixo`, `meio` | etapas (`setProgress`) |
| `rua_camadas` | Bloco em corte mostrando as camadas de uma rua: solo compactado, sub-base de brita, base, asfalto base e capa de rolamento (+ faixa). setProgress(p) empilha as camadas. 8 × 8 m, 1,35 m de altura. | 8 × 8 × 1.4 m | `progress` (1): etapa inicial 0..1 | `subleito`, `quase` | etapas (`setProgress`) |
| `corte_terreno` | Bloco de solo em corte com grama, terra, argila e rocha — para explicar fundações e muros de arrimo. setProgress(p) revela as camadas de baixo para cima. 8 × 6 m, 2,4 m de altura. | 8 × 6 × 2.4 m | `progress` (1): etapa inicial 0..1 | `so_rocha` | etapas (`setProgress`) |
| `guindaste` | Guindaste de torre com lança, contrapeso, cabo e gancho. setProgress(p) gira a lança uma volta. Torre de 22 m. | 21 × 4 × 26.9 m | `height` (22): altura da torre<br>`jib` (16): comprimento da lança<br>`angle` (0): giro inicial da lança (radianos) | `baixo` | etapas (`setProgress`) |

### Árvores e plantas

| id | o que é | tamanho (x × z × altura) | parâmetros | variantes | animação |
|---|---|---|---|---|---|
| `arvore_redonda` | Árvore clássica de tronco marrom e copa arredondada de várias bolas. Altura padrão 5 m. | 3.8 × 3.2 × 4.4 m | `height` (5): altura total em metros<br>`leaf` ("#5fae4e"): cor da copa<br>`trunk` ("#8a5a34"): cor do tronco<br>`seed` (1): número que varia o formato da copa | `clara`, `escura`, `grande`, `outono` | — |
| `arvore_frutifera` | Árvore de copa redonda com frutas (bolinhas coloridas), tipo laranjeira ou macieira. 4 m. | 3.7 × 2.8 × 4.1 m | `fruit` ("#e8452c"): cor das frutas<br>`leaf` ("#4f9d4a"): cor da copa<br>`seed` (2): varia o formato | `laranja`, `limao` | — |
| `arvore_pinheiro` | Árvore em forma de cone, feita de camadas empilhadas. Altura padrão 6 m. | 3 × 3 × 6.2 m | `height` (6): altura total<br>`leaf` ("#2f7d4a"): cor da folhagem<br>`layers` (4): número de camadas (3 a 6) | `clara`, `alta`, `nevada` | — |
| `palmeira` | Palmeira de tronco levemente curvo em gomos e folhas compridas. 7 m. | 4.5 × 4.5 × 7.8 m | `height` (7): altura total<br>`leaf` ("#4faa52"): cor das folhas<br>`seed` (1): varia a curvatura | `baixa`, `alta` | — |
| `arbusto` | Moita baixa de bolas verdes, para cercas vivas e jardins. 1,2 m. | 1.8 × 1.6 × 1.5 m | `leaf` ("#4f9d4a"): cor<br>`flowers` (false): com florzinhas<br>`seed` (1): varia o formato | `florido`, `claro` | — |

### Ruas e terreno

| id | o que é | tamanho (x × z × altura) | parâmetros | variantes | animação |
|---|---|---|---|---|---|
| `rua_reta` | Trecho de rua com asfalto, faixa central, meio-fio e calçadas dos dois lados. Corre ao longo de Z. | 11.7 × 20 × 0.2 m | `length` (20): comprimento em metros (ao longo de Z)<br>`lanes` (2): número de faixas (2 ou 4)<br>`laneWidth` (3.4): largura de cada faixa<br>`sidewalk` (2.2): largura da calçada (0 = sem calçada)<br>`crosswalk` (false): faixa de pedestre no meio | `larga`, `sem_calcada`, `com_faixa` | — |
| `cruzamento` | Encontro de duas ruas em cruz, com faixas de pedestre nas quatro pontas e quarteirões de calçada nos cantos. 7 m de pista, braços de 8 m. | 27 × 27 × 0.2 m | `arm` (8): comprimento de cada braço a partir do centro do cruzamento<br>`lanes` (2): faixas por rua | `longo` | — |
| `chao` | Placa de chão quadrada com manchas de cor: grama, terra, areia, concreto ou asfalto. | 20 × 20 × 0.3 m | `type` ("grama"): 'grama' | 'terra' | 'areia' | 'concreto' | 'asfalto'<br>`size` (20): lado da placa em metros<br>`seed` (1): varia as manchas | `terra`, `areia`, `concreto`, `asfalto` | — |
| `campo_futebol` | Gramado listrado com linhas brancas (área, círculo central) e duas traves. 40 × 26 m (reduzido). | 30 × 44 × 2.8 m | `length` (40): comprimento (ao longo de Z)<br>`width` (26): largura (ao longo de X) | `pequeno` | — |

### Veículos

| id | o que é | tamanho (x × z × altura) | parâmetros | variantes | animação |
|---|---|---|---|---|---|
| `carro_sedan` | Carro de passeio com porta-malas. 1,8 × 4,4 m. Rodas giram com rollWheels(). | 2.1 × 4.5 × 1.5 m | `color` ("#d9473a"): cor da carroceria<br>`taxi` (false): luminoso de táxi no teto | `azul`, `branco`, `taxi`, `verde` | rodas (`rollWheels`) |
| `carro_hatch` | Carro compacto de traseira alta. 1,8 × 3,8 m. | 2.1 × 3.9 × 1.5 m | `color` ("#3d6fb6"): cor da carroceria | `vermelho`, `amarelo`, `preto` | rodas (`rollWheels`) |
| `onibus` | Ônibus urbano com janelões, letreiro e portas. 2,5 × 10 m, 3,1 m de altura. | 2.6 × 10.1 × 3.3 m | `color` ("#f2c94c"): cor da carroceria<br>`stripe` ("#3d6fb6"): cor da faixa | `vermelho`, `azul`, `verde` | rodas (`rollWheels`) |
| `caminhao_cacamba` | Caminhão basculante para terra e entulho. setProgress(0..1) levanta a caçamba. 2,5 × 10 m. | 2.6 × 9.1 × 2.9 m | `cab` ("#f28c28"): cor da cabine<br>`bed` ("#7b8794"): cor da caçamba<br>`tilt` (0): inclinação inicial da caçamba 0..1 | `amarelo`, `azul`, `levantada` | etapas (`setProgress`), rodas (`rollWheels`) |
| `betoneira` | Caminhão de concreto com tambor listrado que gira (updateScenery(obj, t)). 2,5 × 9 m. | 2.6 × 9.5 × 4.4 m | `cab` ("#f2f2f2"): cor da cabine<br>`drum` ("#f28c28"): cor do tambor | `verde`, `azul` | tempo (`updateScenery`), rodas (`rollWheels`) |
| `rolo_compressor` | Máquina de compactar asfalto e solo, com dois tambores de aço e cabine aberta. 1,9 × 3,6 m. Os tambores giram com rollWheels(). | 1.7 × 4.4 × 3.1 m | `color` ("#f2c94c"): cor do corpo | `laranja`, `azul` | rodas (`rollWheels`) |
| `vibroacabadora` | Máquina que espalha o asfalto quente em camada uniforme: caçamba na frente (recebe a massa do caminhão), esteiras e a régua alisadora atrás. 2,9 × 6 m. | 3.4 × 6 × 3.2 m | `color` ("#f2c94c"): cor do corpo | `laranja`, `azul` | — |
| `espargidor` | Caminhão-tanque que espalha o ligante asfáltico líquido (imprimação e pintura de ligação). setProgress(1) liga o jato e deixa a faixa escura atrás. 2,6 × 10 m. | 2.9 × 17.3 × 3.3 m | `cab` ("#f2f2f2"): cor da cabine<br>`tank` ("#2f3338"): cor do tanque<br>`spraying` (false): jato ligado | `jorrando`, `vermelho` | etapas (`setProgress`), rodas (`rollWheels`) |

### Objetos de rua e obra

| id | o que é | tamanho (x × z × altura) | parâmetros | variantes | animação |
|---|---|---|---|---|---|
| `cone` | Cone laranja com faixa branca e base quadrada. 0,6 m. | 0.4 × 0.4 × 0.7 m | `color` ("#f28c28"): cor do cone | `amarelo` | — |
| `barreira` | Cavalete com tábuas listradas vermelho/branco para isolar uma área. 2 × 1 m. | 2 × 0.7 × 1.1 m | `length` (2): comprimento | `longa` | — |
| `pilha_tijolos` | Pilha de tijolos sobre um pallet de madeira. 1,2 × 0,8 m, 0,8 m de altura. | 1.2 × 0.9 × 0.8 m | `brick` ("#b8573b"): cor dos tijolos<br>`rows` (6): fileiras de altura | `baixa`, `clara` | — |
| `saco_cimento` | Pilha de sacos de cimento com etiqueta azul. 0,6 m de lado. | 1.3 × 0.4 × 0.4 m | `count` (6): quantidade de sacos (1 a 12) | `um`, `muitos` | — |
| `carrinho_mao` | Carrinho de obra com caçamba, uma roda e dois cabos. 0,7 × 1,5 m. A roda gira com rollWheels(). | 0.7 × 2.1 × 0.7 m | `color` ("#f2c94c"): cor da caçamba | `azul`, `vermelho` | rodas (`rollWheels`) |
| `escada` | Escada de madeira inclinada (encostada). 2,4 m. | 0.6 × 0.7 × 2.4 m | `height` (2.4): altura | `alta` | — |
| `poste_luz` | Poste de rua com braço e lâmpada acesa. 6 m. | 0.3 × 1.5 × 6 m | `height` (6): altura<br>`color` ("#7b8794"): cor do poste | `baixo` | — |
| `semaforo` | Semáforo de poste com três luzes; escolha qual está acesa. | 0.4 × 0.5 × 3.9 m | `state` ("vermelho"): 'vermelho' | 'amarelo' | 'verde' | `amarelo`, `verde` | — |
| `placa_pare` | Placa octogonal vermelha em poste. 2,4 m. | 1.2 × 0.1 × 2.9 m | — | — | — |
| `banco` | Banco de madeira com pés de ferro. 1,6 × 0,6 m. | 1.6 × 0.6 × 1 m | `color` ("#a9743f"): cor da madeira | `verde` | — |
| `cerca` | Trecho de cerca de madeira com mourões e duas travas. 4 m (ajustável). | 4.1 × 0.1 × 1 m | `length` (4): comprimento<br>`color` ("#a9743f"): cor | `branca` | — |
| `muro` | Trecho de muro de alvenaria com capeamento. 4 m de comprimento, 2,2 m de altura. | 4.1 × 0.3 × 2.3 m | `length` (4): comprimento<br>`height` (2.2): altura<br>`color` ("#e8dcc4"): cor do reboco | `tijolo`, `cinza` | — |
| `hidrante` | Hidrante vermelho de calçada. 0,7 m. | 0.4 × 0.3 × 0.8 m | — | — | — |
| `lixeira` | Lixeira de rua com tampa. 0,9 m. | 0.6 × 0.7 × 0.9 m | `color` ("#4f9d5a"): cor | `azul`, `amarela` | — |
| `caixa_madeira` | Caixote de madeira com travessas em X. 0,8 m. | 0.9 × 0.9 × 0.8 m | `size` (0.8): lado | `grande` | — |
| `bueiro` | Grade de escoamento de água da chuva, ao nível do asfalto junto ao meio-fio. 0,9 × 0,5 m. | 0.9 × 0.6 × 0.1 m | — | — | — |

### Formas e peças livres (para montar qualquer coisa)

| id | o que é | tamanho (x × z × altura) | parâmetros | variantes | animação |
|---|---|---|---|---|---|
| `forma` | Peça básica para montar qualquer coisa (tanque, bloco, pilar, bola, lâmpada, quadro...). Empilhe várias para criar máquinas, diagramas e cenários novos. Combine com "anim", "opacidade" e "fluxos". | 1 × 1 × 1 m | `tipo` ("caixa"): 'caixa' | 'cilindro' | 'esfera' | 'cone' | 'toro' | 'capsula'<br>`tamanho` ([1,1,1]): [largura, altura, profundidade] em metros<br>`cor` ("#8a95a3"): cor<br>`brilho` (false): superfície metálica/brilhante<br>`emissivo` (false): brilha sozinha (lâmpada, brasa, tela)<br>`apoiada` (true): true: a base fica no chão (y=0); false: centrada em y=0 | `tanque`, `bola`, `lampada` | — |
| `tubo` | Tubulação por pontos [x,y,z] (cano, fio, mangueira, veia). Use junto de um fluxo com "caminho" igual aos pontos para mostrar o que passa dentro, e "opacidade" 0.35 para enxergar o fluxo. | 3.3 × 0.3 × 2.3 m | `pontos` ([[0,0,0],[0,2,0],[3,2,0]]): lista de pontos [x,y,z] (relativos ao objeto)<br>`raio` (0.15): raio do tubo<br>`cor` ("#9aa7b5"): cor | `vermelho`, `azul`, `cobre` | — |
| `escudo_heroi` | Escudo redondo com aro e emblema próprio, igual ao do Capitão Tampa. Em pé (face para +Z); para o voo do arremesso use anim (pos + gira com eixo "z" ou "y"). 0,6 m. | 0.7 × 0.2 × 0.7 m | `cor` ("#b9c2cc"): cor do escudo<br>`borda` ("#c8893a"): cor do aro<br>`miolo` ("#d5dbe2"): cor do centro<br>`simbolo` ("espiral"): emblema (raio, cometa, espiral, aranha_fofa, coruja, brilho)<br>`corSimbolo` ("#c8893a"): cor do emblema | `cometa` | — |

### Máquinas e processos animados

| id | o que é | tamanho (x × z × altura) | parâmetros | variantes | animação |
|---|---|---|---|---|---|
| `engrenagem` | Engrenagem que gira sozinha (eixo para a câmera, +Z). Use duas lado a lado com velocidades opostas e "fase" diferente para mostrar transmissão. update(t). | 2.4 × 0.4 × 2.4 m | `dentes` (12): número de dentes<br>`raio` (1): raio<br>`cor` ("#c9a227"): cor<br>`velocidade` (60): graus por segundo (negativo = outro sentido)<br>`fase` (0): ângulo inicial em graus | `prata`, `vermelha` | tempo (`updateScenery`) |
| `helice` | Hélice, pá de ventilador ou turbina que gira sozinha (eixo +Z). update(t). | 2.5 × 0.4 × 2.4 m | `pas` (4): número de pás<br>`raio` (1.2): raio<br>`cor` ("#e8eef5"): cor das pás<br>`velocidade` (360): graus por segundo | `turbina`, `ventilador` | tempo (`updateScenery`) |
| `esteira` | Esteira com material andando sobre ela (pedra, areia, grão, carvão...). Pode ser inclinada. update(t). | 6.4 × 1.1 × 1.1 m | `comprimento` (6): comprimento em metros<br>`largura` (0.9): largura<br>`inclinacao` (0): graus de subida<br>`material` ("pedra"): 'pedra' | 'brita' | 'areia' | 'terra' | 'concreto' | 'grao' | 'carvao'<br>`velocidade` (1): velocidade (1 = normal) | `subindo`, `graos`, `areia` | tempo (`updateScenery`) |
| `monte` | Pilha de pedra, areia, terra, grão, carvão ou asfalto. setProgress(0..1) faz o monte CRESCER (combine com um fluxo caindo em cima). | 3.2 × 3.1 × 1 m | `material` ("pedra"): 'pedra' | 'brita' | 'areia' | 'terra' | 'concreto' | 'grao' | 'carvao' | 'asfalto'<br>`raio` (1.6): raio da base<br>`progress` (1): tamanho inicial 0..1 | `areia`, `terra`, `grao`, `pequeno` | etapas (`setProgress`) |
| `tanque` | Reservatório (água, leite, grão, combustível) com casca transparente e o conteúdo visível. setProgress(0..1) muda o NÍVEL (encher/esvaziar). | 2.6 × 2.6 × 3.1 m | `raio` (1.2): raio<br>`altura` (3): altura<br>`liquido` ("#3fa5e0"): cor do conteúdo<br>`casca` ("#cfd8e3"): cor da casca<br>`nivel` (0.6): nível inicial 0..1 | `agua`, `leite`, `oleo`, `grao` | etapas (`setProgress`) |
| `misturador` | Tanque aberto com pás girando e o conteúdo sendo misturado (massa, tinta, concreto, comida). Visto de cima fica bonito. update(t). | 2.8 × 2.8 × 2.3 m | `raio` (1.4): raio<br>`conteudo` ("#9a8f7a"): cor da mistura<br>`pas` ("#f2c94c"): cor das pás<br>`velocidade` (90): graus por segundo | `tinta`, `concreto`, `massa` | tempo (`updateScenery`) |
| `escavadeira` | Escavadeira que cava, gira e despeja em ciclo (update). Para mostrar terraplenagem, mineração, obra. Cava na frente (+Z) e despeja à esquerda (-X, uns 5 m); ponha um "monte" lá. Use "fase" = -(início da cena) para o ciclo começar com a cena. | 3.6 × 10.2 × 3.9 m | `cor` ("#f2c94c"): cor do corpo<br>`ciclo` (6): segundos por ciclo de escavação<br>`fase` (0): segundos de deslocamento do ciclo (use -início da cena) | `laranja`, `rapida` | tempo (`updateScenery`) |
| `fabrica_processo` | Linha de processamento animada: 3 silos de matéria-prima, esteira subindo até um tambor rotativo aquecido (com chama), chaminé soltando fumaça e torre com bica de descarga. Serve para usinas, fábricas de cimento, de ração, de plástico etc. update(t). 22 × 14 m. Caminhão no ponto [9.5, 0, 3.6] (giro 0) recebe a carga. | 25.2 × 15 × 22 m | `material` ("pedra"): material nas esteiras: 'pedra' | 'areia' | 'grao' | 'carvao'<br>`carregando` (true): bica despejando material para o caminhão<br>`velocidade` (1): velocidade da linha | `graos`, `areia` | tempo (`updateScenery`) |

### Água (nível subindo, ondas)

| id | o que é | tamanho (x × z × altura) | parâmetros | variantes | animação |
|---|---|---|---|---|---|
| `agua_nivel` | Bloco de água com superfície ondulando sozinha. setProgress(0..1) faz o NÍVEL SUBIR de 0 até "altura" (maré alta, enchente, alagamento). Translúcida: casas e pernas aparecem por baixo. | 20 × 20 × 2.3 m | `tamanho` ([20,20]): [largura x, comprimento z] em metros<br>`altura` (2): altura máxima do nível (m)<br>`cor` ("#2f8fd6"): cor da água<br>`espuma` (true): pontinhos de espuma na superfície<br>`progress` (1): nível 0..1 | `enchente`, `mar` | etapas (`setProgress`), tempo (`updateScenery`) |
| `onda` | Crista de onda com espuma, voltada para +Z (avança para a frente). Mova com "movimentos" ou anim.pos; a espuma borbulha sozinha. Combine com agua_nivel subindo atrás e um fluxo de "agua" na crista. | 16.4 × 13.2 × 4.7 m | `largura` (16): largura da onda (m)<br>`altura` (4): altura da crista (m)<br>`cor` ("#2f8fd6"): cor da água | `pequena` | tempo (`updateScenery`) |

### Céu e espaço (Lua, anéis)

| id | o que é | tamanho (x × z × altura) | parâmetros | variantes | animação |
|---|---|---|---|---|---|
| `lua` | Lua low-poly brilhante com crateras. setProgress(0..1) RACHA a Lua em 3 pedaços que se afastam girando (0 = inteira). Para o céu use apoiada: false, ponha alta e longe e use anim.escala para ela "chegar perto". | 8.7 × 8.7 × 8.7 m | `raio` (3): raio em metros<br>`cor` ("#efe8d2"): cor da superfície<br>`brilho` (0.55): quanto brilha sozinha (0..1.5)<br>`halo` (true): halo de luz em volta<br>`apoiada` (true): true: base no chão; false: centro na origem (céu)<br>`progress` (0): quanto já rachou 0..1 | `cheia`, `rachada` | etapas (`setProgress`) |
| `anel_pedras` | Anel de pedras e poeira (como os de Saturno), girando devagar. setProgress(0..1) FORMA o anel: as pedras se espalham a partir do ponto "origem" (graus) até fechar a volta. Use apoiada: false para pôr o centro onde quiser. | 129.6 × 49.6 × 123.2 m | `raio` (60): raio do anel (m)<br>`largura` (8): largura da faixa (m)<br>`inclinacao` (70): inclinação do plano do anel (graus; 0 = deitado)<br>`origem` (90): ângulo (graus) de onde as pedras partem<br>`pedras` (700): quantidade de pedras<br>`tamanhoPedra` (1): multiplica o tamanho das pedras (anéis grandes e distantes: 3 a 5)<br>`cor` ("#cfc4a8"): cor das pedras<br>`velocidade` (2): giro (graus/s)<br>`apoiada` (true): true: ponto mais baixo no chão; false: centro na origem<br>`progress` (1): quanto do anel já se formou 0..1 | `formando` | etapas (`setProgress`), tempo (`updateScenery`) |

### Física (ondas sonoras, choque, vapor)

| id | o que é | tamanho (x × z × altura) | parâmetros | variantes | animação |
|---|---|---|---|---|---|
| `ondas_som` | Frentes de onda do som emitidas por algo que anda para +Z (o diagrama clássico da aula de física, em 3D). setProgress(0..1) muda a velocidade: Mach = 1,25 × progress. Abaixo de Mach 1 as ondas ficam espaçadas na frente; em 0,8 (Mach 1) todas se tocam na frente (a barreira do som); acima, formam o cone de Mach. A fonte fica em y = "altura". | 6.1 × 6.1 × 6.1 m | `raio` (3): raio da onda mais antiga (m)<br>`ondas` (7): quantidade de frentes de onda<br>`altura` (3): altura da fonte (o centro das ondas) acima da base<br>`cor` ("#8fd3ff"): cor das ondas<br>`progress` (0.8): velocidade: Mach = 1,25 × progress | `subsonico`, `supersonico` | etapas (`setProgress`), tempo (`updateScenery`) |
| `cone_vapor` | Nuvem branca em forma de cone em volta de algo perto da velocidade do som (a umidade do ar condensa quando a pressão cai). Bico para +Z. setProgress(0..1) faz a nuvem aparecer e crescer; ela tremula sozinha. O eixo fica em y = "altura". | 2.7 × 3.3 × 2.6 m | `comprimento` (2.4): comprimento do cone (m)<br>`raio` (1.1): raio da boca (m)<br>`altura` (1.2): altura do eixo acima da base<br>`progress` (1): quanto já se formou 0..1 | `pequeno` | etapas (`setProgress`), tempo (`updateScenery`) |
| `anel_choque` | Onda de choque que se espalha pelo chão a partir do centro (estrondo sônico, explosão, impacto). setProgress(0..1) faz o anel e a cúpula translúcida crescerem até "raio" e sumirem. | 14.9 × 14.9 × 2.5 m | `raio` (20): raio final (m)<br>`cor` ("#ffffff"): cor<br>`progress` (0.4): quanto já se espalhou 0..1 | `pequeno` | etapas (`setProgress`) |

### Animais, natureza e cultura (boto, sonar, festa junina)

| id | o que é | tamanho (x × z × altura) | parâmetros | variantes | animação |
|---|---|---|---|---|---|
| `boto` | Boto-cor-de-rosa da Amazônia: corpo rosado com brilho de pele molhada, testa redonda (melão), bico comprido, nadadeiras grandes e cauda que bate sozinha. Frente para +Z. setProgress(0..1) VIRA O PESCOÇO (0,5 = reto; 1 = 90° para a esquerda dele; 0 = 90° para a direita). Para nadar/saltar use movimentos ou anim (pos + giro no eixo x). | 1.5 × 3 × 0.7 m | `comprimento` (2.4): comprimento total (m); filhote ~0,9<br>`cor` ("#ef9fb3"): cor das costas<br>`barriga` ("#f8c9d4"): cor da barriga<br>`cicatrizes` (false): marcas de briga (machos mais rosados)<br>`batida` (1.2): batidas da cauda por segundo<br>`progress` (0.5): pescoço: 0,5 reto, 0/1 = 90° para cada lado | `filhote`, `macho`, `cinza` | etapas (`setProgress`), tempo (`updateScenery`) |
| `sonar` | Cliques em arco saindo para a frente (+Z) e o eco voltando (amarelo), em ciclo. Para boto, morcego, submarino ou radar. Ponha na cabeça do animal (ou siga com a mesma anim/movimento). | 2.9 × 3.3 × 2.9 m | `alcance` (3): até onde vão os cliques (m)<br>`cor` ("#8fe3ff"): cor dos cliques<br>`eco` (true): mostra o eco voltando<br>`ritmo` (1.4): ciclos por segundo<br>`altura` (3.1): altura do centro acima da base (no animal, use a altura da cabeça) | `radar` | tempo (`updateScenery`) |
| `termometro` | Termômetro de vidro com bulbo e coluna vermelha. setProgress(0..1) SOBE a coluna (de "minimo" a "maximo" °C nas marcas). Bom para calor, febre, seca, aquecimento. | 0.6 × 0.5 × 2.5 m | `altura` (2.4): altura (m)<br>`progress` (0.5): nível 0..1 | `pequeno` | etapas (`setProgress`) |
| `bandeirinhas` | Varal de bandeirinhas coloridas entre dois postes (ao longo de X), balançando sozinho com o vento. | 10.2 × 0.2 × 3.9 m | `comprimento` (10): distância entre os postes (m)<br>`altura` (3.6): altura do varal<br>`cores` (["#e5322d","#f2c94c","#2f80ed","#27ae60","#f2994a","#bb6bd9"]): cores das bandeiras | `curto` | tempo (`updateScenery`) |
| `fogueira` | Fogueira de toras cruzadas com brasa que pulsa sozinha. Junte um fluxo de "fogo" e de "fagulha" saindo do centro (y ~0,3). | 1.4 × 1.4 × 1.1 m | `tamanho` (1): escala | `grande` | tempo (`updateScenery`) |
| `chapeu_panama` | Chapéu branco de aba com fita preta (o chapéu do moço da lenda do boto). Use anim.pos para tirá-lo da cabeça de um personagem. | 0.6 × 0.6 × 0.2 m | `cor` ("#f4f1e8"): cor do chapéu<br>`fita` ("#1e1e1e"): cor da fita<br>`tamanho` (1): escala | `palha` | — |

- `rua_camadas` empilha, de baixo para cima: solo compactado (subleito) → sub-base de brita → base de brita graduada → asfalto base (binder) → capa de rolamento (asfalto).
- `corte_terreno` empilha, de baixo para cima: rocha → argila → terra → grama.
- `casa_obra`: fundação (0–0.1) → pilares (–0.25) → paredes de tijolo (–0.55) → laje (–0.65) → madeiramento (–0.82) → telhas (–1).
- `predio_estrutura`: cada andar sobe (pilares, depois laje) em sequência até o último.

## 8. Limites conhecidos (seja honesto no roteiro)

- Corpo de peças rígidas (sem pele/skinning): braços e pernas não deformam; mãos sem dedos.
- Na caminhada o pé pode afundar até ~3 cm no chão no fim do passo e o pé de apoio desliza ~0.15 m/s: invisível em plano aberto, evite close nos pés.
- `sit` não cria a cadeira: posicione o assento em `seatHeight`; mãos em `arms: 'wheel'` não seguram um volante real.
- `think` levanta a mão esquerda até o queixo: com a prancheta do `engenheiro` fica estranho; use `read_clipboard`.
- Itens nas mãos são rígidos e não mudam a pose automaticamente (use `hammer` com martelo, `dig` com pá).
- Cenário: fachadas só têm janelas/portas "coladas" (sem buracos nas paredes) e não há interior das casas. O telhado não tem calhas nem beiral detalhado.
- `predio_apartamentos` e `predio_estrutura` têm muitas peças; não há estádio, metrô, elevador nem interior de prédio ainda.
- Veículos: sem interior detalhado e sem motorista. Para pôr o `motorista`, posicione-o dentro e use `sit` com `arms: 'wheel'`.
