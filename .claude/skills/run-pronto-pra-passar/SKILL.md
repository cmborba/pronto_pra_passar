---
name: run-pronto-pra-passar
description: Build, start, run and drive the pronto-pra-passar web app (QuizConcurso quiz, Vite + React). Use when asked to run or start the app, start the dev server, build it, take a screenshot of a page, click through the quiz, or check that a UI change renders.
---

pronto-pra-passar is a Vite + React single-page app (a "QuizConcurso" preparation quiz backed by Supabase and Stripe). An agent drives it by starting the Vite dev server on port 4028 and piping commands into `.claude/skills/run-pronto-pra-passar/driver.mjs`, a small headless-Chromium REPL built on the container's preinstalled Playwright. All paths below are relative to the repo root.

## Prerequisites

Node 22 and npm 10 (what this container has). No `apt-get` packages were needed. The driver uses the preinstalled Playwright and Chromium; do not `npm install playwright` or run `playwright install`.

## Setup

```bash
npm install --no-audit --no-fund
```

`.env` is committed and already holds the `VITE_*` values. `src/lib/supabase.js` throws at import time if `VITE_SUPABASE_URL` or `VITE_SUPABASE_ANON_KEY` is missing, which blanks every page.

## Build

```bash
npm run build
```

Output goes to `build/` (not `dist/`); takes about 7 s. A chunk-size warning is expected.

## Run (agent path)

Start the dev server in the background and poll until it serves:

```bash
(npm start > /tmp/pronto-vite.log 2>&1 &)
timeout 60 bash -c 'until curl -sf http://localhost:4028 >/dev/null; do sleep 1; done' && echo UP
```

Drive it. One command per line on stdin; this is the full happy path (landing → quiz → results), about 10 s:

```bash
node .claude/skills/run-pronto-pra-passar/driver.mjs <<'EOF'
nav /
wait-for text=Começar Quiz Gratuito
screenshot landing
click text=Começar Quiz Gratuito
wait-for text=Questão
screenshot quiz-q1
answer-quiz
wait-for text=Resultado
sleep 3000
url
screenshot results
failed-requests
quit
EOF
```

Expected: `url` prints `http://localhost:4028/free-results-page` and `answer-quiz` prints `answered 7 questions, clicked Finalizar`. Screenshots land in `/tmp/pronto-shots/NN-<name>.png` (`NN` restarts at 01 on every driver run; override the folder with `SHOTS=`). Open them and look: the landing is a blue hero with a green "Começar Quiz Gratuito" button; results show "Parabéns, Candidato!", a % ring and a 7-bar weekly chart.

To jump straight to the results page, seed `localStorage` first:

```bash
node .claude/skills/run-pronto-pra-passar/driver.mjs <<'EOF'
nav /
eval localStorage.setItem('quizResults', JSON.stringify({answers:{1:'2_to_4h'},totalScore:20,maxScore:30,completedAt:new Date().toISOString(),timeElapsed:42}))
nav /free-results-page
wait-for text=Plano Semanal
sleep 4000
eval document.querySelectorAll('.recharts-bar-rectangle path').length
screenshot results-seeded
quit
EOF
```

| command | what it does |
|---|---|
| `nav <path\|url>` | go to `BASE_URL` + path (default base `http://localhost:4028`) |
| `wait-for <css>` / `wait-for text=<text>` | wait up to 20 s until visible |
| `click <css\|text=…>` · `fill <css> <value>` · `press <key>` | input (goes through Playwright, so React `onChange` fires) |
| `answer-quiz` | on `/interactive-quiz-flow`: picks the first option on each question, then clicks Finalizar |
| `screenshot [name]` · `screenshot-full [name]` | viewport / full-page PNG |
| `text [css]` · `eval <js>` · `url` | read the page |
| `console-errors` · `failed-requests` | what broke since launch |
| `sleep <ms>` · `quit` | |

Env: `VIEWPORT=390x844` for a phone-sized run, `BASE_URL=` to point at another server.

Stop the server (frees the port; `$!` would only be the npm wrapper):

```bash
lsof -ti:4028 -sTCP:LISTEN | xargs -r kill
```

## Run (human path)

```bash
npm start   # -> http://localhost:4028 ; Ctrl-C to stop
```

## Test

There is no test script or test file in the repo (the `@testing-library/*` deps are unused). Verification is the driver flow above plus `npm run build`.

## Gotchas

- **This `.env` points at production.** Real Supabase project and a `pk_live_` Stripe key. The quiz flow is safe: it only writes `localStorage.quizResults`. Signing up, logging in or submitting `/payment-checkout` would hit the live backend. Don't do those from an agent run unless asked.
- **Every driver run is a fresh browser profile.** `localStorage` is empty, so `/free-results-page` immediately redirects to `/interactive-quiz-flow`. Seed `quizResults` (see above) or run the quiz in the same driver session.
- **Hover state leaks into screenshots.** After `click`, the cursor stays where it was. On the results page that's over the chart, which opens a Recharts tooltip. `answer-quiz` moves the mouse to (0,0) after Finalizar. If a tooltip shows up in a screenshot after your own `click`, this is why.
- **The weekly chart animates.** Screenshot the results page less than about 2 s after it loads and the Recharts bars are still height 0, so the chart looks empty. Wait about 3 s, or check `.recharts-bar-rectangle path` heights with `eval`.
- **`index.html` loads two scripts from `static.rocket.new`** (the Rocket.new editor overlay, not app code). The driver aborts them so pages don't stall. They show as `net::ERR_FAILED` in `failed-requests`, which is expected.
- **The sandbox proxy blocks `*.supabase.co` and `images.unsplash.com`.** Anything that reads Supabase (product list on `/payment-checkout`, auth, `/admin-dashboard` data) fails with `net::ERR_TUNNEL_CONNECTION_FAILED`, and hero images are missing. Pages still render their shell. Without a session, `/admin-dashboard` shows the landing content and `/payment-checkout` shows "Você precisa criar uma conta…".
- **`console-errors` always shows `<path> attribute d: Expected arc flag`.** This is a real app bug: the loading spinner in `src/components/ui/Button.jsx` has `0 714 12` where `0 0 1 4 12` was meant. It is harmless, so don't treat it as a regression.
- **`vite.config.mjs` uses `strictPort: true` on 4028.** A second `npm start` fails instead of moving to another port. Stop the old one first.
- **`.gitignore` lists `src/App.jsx`, `src/Routes.jsx`, `src/index.jsx` and `vite.config.*`** (Rocket.new boilerplate), but they are tracked, so edits still show up in git. A newly created file matching those patterns would not.

## Troubleshooting

- **`Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'playwright'`**: a plain ESM `import 'playwright'` ignores `NODE_PATH`, where the container's Playwright lives. The driver loads it with `createRequire(import.meta.url)('playwright')`. Keep that if you edit the driver.
- **`Error: Port 4028 is already in use`** from `npm start`: a server is already running. Reuse it, or run the `lsof … | xargs -r kill` line.
- **`wait-for text=Plano Semanal` times out after `nav /free-results-page`**: no `quizResults` in `localStorage`, so the app bounced you to the quiz. Seed it first.
