# Aracnildo pulls the Moon (versão em inglês)

Versão para o canal em inglês do vídeo `projects/aracnildo-puxa-a-lua` (mesma animação, mesmos fatos e fontes: veja o `ideia.md` de lá).

- **Nome do personagem:** mantido "Aracnildo" (soa curioso para o público gringo).
- **Voz:** ElevenLabs, Charlie (grave, confiante, enérgica), velocidade 0,95. A voz padrão do pack continua sendo o Rodrigo (português).
- **Duração:** ~34,5 s (narração de 32 s + pose final com a pergunta).
- **Textos da tela:** `textos.json`. A narração (`narracao.txt`) tem as mesmas 11 frases, na mesma ordem, que a versão em português.

Refazer:
```bash
ELEVENLABS_API_KEY=proxy-injected NODE_USE_ENV_PROXY=1 node tools/voz.mjs gerar projects/aracnildo-pulls-the-moon --voz IKne3meq5aSn9XLyUdCD --velocidade 0.95
node projects/aracnildo-puxa-a-lua/gerar-storyboard.mjs projects/aracnildo-pulls-the-moon
node tools/render.mjs projects/aracnildo-pulls-the-moon
```
