#!/usr/bin/env node
// Headless-Chromium driver for pronto-pra-passar (Vite dev server on :4028).
// Reads one command per line from stdin, so it works with a heredoc or under tmux.
//
//   node .claude/skills/run-pronto-pra-passar/driver.mjs <<'EOF'
//   nav /
//   wait-for text=Começar Quiz Gratuito
//   screenshot landing
//   EOF
//
// Env: BASE_URL (default http://localhost:4028), SHOTS (default /tmp/pronto-shots),
//      VIEWPORT (default 1280x900, e.g. 390x844 for phone).
import { createRequire } from 'node:module';
import readline from 'node:readline';
import fs from 'node:fs';
import path from 'node:path';

// ESM `import 'playwright'` ignores NODE_PATH, so the container's preinstalled Playwright
// isn't found that way. require() does honor NODE_PATH, so load it through createRequire.
const { chromium } = createRequire(import.meta.url)('playwright');

const BASE = process.env.BASE_URL || 'http://localhost:4028';
const SHOTS = process.env.SHOTS || '/tmp/pronto-shots';
const [vw, vh] = (process.env.VIEWPORT || '1280x900').split('x').map(Number);
fs.mkdirSync(SHOTS, { recursive: true });

const browser = await chromium.launch({ args: ['--no-sandbox'] });
const context = await browser.newContext({ viewport: { width: vw, height: vh } });
// index.html pulls two scripts from static.rocket.new (Rocket.new editor overlay). They are
// not part of the app and are often blocked by sandbox proxies; abort them so pages don't hang.
await context.route(/static\.rocket\.new/, (r) => r.abort());
const page = await context.newPage();
const errors = [];
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
const failed = [];
page.on('requestfailed', (r) => failed.push(`${r.failure()?.errorText}  ${r.url().slice(0, 120)}`));

let n = 0;
const sel = (s) => (s.startsWith('text=') ? page.getByText(s.slice(5), { exact: false }).first() : page.locator(s).first());

const cmds = {
  async nav(arg) {
    const url = /^https?:/.test(arg) ? arg : BASE + (arg || '/');
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    return page.url();
  },
  async 'wait-for'(arg) { await sel(arg).waitFor({ state: 'visible', timeout: 20000 }); return 'visible'; },
  async click(arg) { await sel(arg).click({ timeout: 10000 }); return 'clicked'; },
  async fill(arg) { const [s, ...rest] = arg.split(' '); await sel(s).fill(rest.join(' ')); return 'filled'; },
  async press(arg) { await page.keyboard.press(arg); return 'pressed'; },
  async sleep(arg) { await page.waitForTimeout(Number(arg) || 500); return 'ok'; },
  async screenshot(arg) {
    const f = path.join(SHOTS, `${String(++n).padStart(2, '0')}-${arg || 'shot'}.png`);
    await page.screenshot({ path: f, fullPage: false });
    return f;
  },
  async 'screenshot-full'(arg) {
    const f = path.join(SHOTS, `${String(++n).padStart(2, '0')}-${arg || 'full'}.png`);
    await page.screenshot({ path: f, fullPage: true });
    return f;
  },
  async text(arg) { return (await sel(arg || 'body').innerText()).slice(0, 2000); },
  async eval(arg) { return JSON.stringify(await page.evaluate(arg)); },
  async url() { return page.url(); },
  async 'console-errors'() { return errors.length ? errors.join('\n') : '(none)'; },
  async 'failed-requests'() { return failed.length ? failed.join('\n') : '(none)'; },
  // Answer the 7-question quiz: picks the first option on each question, then Finalizar.
  async 'answer-quiz'() {
    for (let i = 0; i < 20; i++) {
      await page.locator('main button.text-left').first().click({ timeout: 10000 });
      const finish = page.getByRole('button', { name: /Finalizar/ });
      if (await finish.isVisible()) {
        await finish.click();
        // The results chart renders where the button was; a parked cursor opens a Recharts tooltip.
        await page.mouse.move(0, 0);
        return `answered ${i + 1} questions, clicked Finalizar`;
      }
      await page.getByRole('button', { name: /Próximo/ }).click();
      await page.waitForTimeout(400); // the app animates between questions with a setTimeout
    }
    throw new Error('quiz did not reach Finalizar in 20 steps');
  },
};

const rl = readline.createInterface({ input: process.stdin });
for await (const raw of rl) {
  const line = raw.trim();
  if (!line || line.startsWith('#')) continue;
  const i = line.indexOf(' ');
  const [cmd, arg] = i < 0 ? [line, ''] : [line.slice(0, i), line.slice(i + 1)];
  if (cmd === 'quit') break;
  const fn = cmds[cmd];
  if (!fn) { console.log(`? unknown command: ${cmd} (have: ${Object.keys(cmds).join(', ')}, quit)`); continue; }
  try { console.log(`> ${line}\n${await fn(arg)}`); }
  catch (e) { console.log(`> ${line}\nERROR: ${e.message.split('\n')[0]}`); process.exitCode = 1; }
}
await browser.close();
