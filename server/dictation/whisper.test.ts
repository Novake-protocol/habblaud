import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { findWhisper, parseWhisperJson } from './whisper';

describe('Whisper local', () => {
  it('lê texto e idioma do JSON do whisper-cli, sem marcas de silêncio', () => {
    const raw = JSON.stringify({ result: { language: 'pt' }, transcription: [{ text: ' Crie um agente' }, { text: ' para o relatório. [BLANK_AUDIO]' }] });
    expect(parseWhisperJson(raw)).toEqual({ text: 'Crie um agente para o relatório.', lang: 'pt' });
    expect(parseWhisperJson('{}')).toEqual({ text: '', lang: '' });
  });

  it('acha binários e o melhor modelo multilíngue (nunca um .en)', () => {
    // as pastas dos modelos saem do `join` da plataforma em que o teste roda
    const m = (f: string) => join('/h', '.local', 'share', 'whisper', f);
    const have = new Set(['/opt/homebrew/bin/whisper-cli', '/opt/homebrew/bin/ffmpeg', join('/h', '.whisper', 'ggml-base.en.bin'), m('ggml-base.bin'), m('ggml-small.bin')]);
    const setup = findWhisper({ HOME: '/h', PATH: '' }, (p) => have.has(p), 'darwin');
    expect(setup).toEqual({ bin: '/opt/homebrew/bin/whisper-cli', ffmpeg: '/opt/homebrew/bin/ffmpeg', model: m('ggml-small.bin'), langs: ['pt', 'en'] });
    have.delete(m('ggml-small.bin'));
    have.delete(m('ggml-base.bin'));
    expect(findWhisper({ HOME: '/h', PATH: '' }, (p) => have.has(p), 'darwin')).toHaveProperty('missing');
    expect(findWhisper({ HOME: '/h', PATH: '' }, () => false, 'darwin')).toEqual({ missing: 'whisper-cli (brew install whisper-cpp)' });
    expect(findWhisper({ HOME: '/h', PATH: '', HABBLAUD_DICTATION_LANGS: 'en, pt, xx-bad' }, () => true)).toMatchObject({ langs: ['en', 'pt'] });
  });

  it('Windows: acha whisper-cli.exe e ffmpeg.exe no PATH (separado por ;) e o modelo na pasta do usuário', () => {
    const home = String.raw`C:\Users\ana`;
    const cli = String.raw`C:\whisper\whisper-cli.exe`;
    const ff = String.raw`C:\ffmpeg\bin\ffmpeg.exe`;
    const model = join(home, '.local', 'share', 'whisper', 'ggml-small.bin');
    const have = new Set([cli, ff, model]);
    const env = { USERPROFILE: home, PATH: String.raw`C:\nada;C:\whisper;C:\ffmpeg\bin` };
    expect(findWhisper(env, (p) => have.has(p), 'win32')).toEqual({ bin: cli, ffmpeg: ff, model, langs: ['pt', 'en'] });
    have.delete(ff);
    expect(findWhisper(env, (p) => have.has(p), 'win32')).toEqual({ missing: 'ffmpeg (winget install Gyan.FFmpeg)' });
  });
});
