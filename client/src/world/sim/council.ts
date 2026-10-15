// Conselho do /council na War Room: lugar à mesa e as falas (trechos do que cada membro escreve) em balões.
import { councilLines, councilMember } from '../../../../shared/council';
import { tr } from '../../../../shared/i18n';
import type { Activity } from '../../../../shared/types';
import { councilSeats, WARROOM_ID } from '../layout/warroom';
import type { SpotDef } from '../layout/types';

/** Intervalo entre um balão e o próximo do mesmo membro. */
export const COUNCIL_GAP_MS = 700;
/** Tempo de leitura de um balão: base + por caractere, com teto. */
const SAY_BASE_MS = 2200;
const SAY_PER_CHAR_MS = 45;
const SAY_MAX_MS = 6500;
/** Fila máxima de falas por membro (o texto novo substitui o que sobrou do anterior). */
const QUEUE_MAX = 5;
/**
 * Tamanho de cada trecho: o balão é de uma linha (cabe ~34 caracteres com o emblema). Com QUEUE_MAX, a fala toda cabe
 * nos 25 s em que o servidor ainda mostra o membro depois de concluir.
 */
const LINE_MAX = 34;

export interface CouncilVoice {
  councilSay: string[];
  councilNextAt: number;
}

/** Lugar à mesa (preferência do meio para as pontas); sem lugar, um ponto em pé da War Room. */
export function chooseCouncilSeat(spots: readonly SpotDef[], isFree: (id: string) => boolean): SpotDef | null {
  const seat = councilSeats(spots).find((s) => isFree(s.id));
  if (seat) return seat;
  return spots.find((s) => s.areaId === WARROOM_ID && s.kind === 'stand' && isFree(s.id)) ?? null;
}

/** Quanto tempo um balão de fala fica na tela. */
export function sayMs(text: string): number {
  return Math.min(SAY_MAX_MS, SAY_BASE_MS + text.length * SAY_PER_CHAR_MS);
}

/** O que o membro "diz" ao começar uma atividade (vazio = nada a dizer; o balão comum da atividade basta). */
export function councilSpeech(act: Activity, title?: string): string[] {
  if (act.kind === 'prompt') return councilLines(title ? tr('Analisando: {0}', [title]) : tr('Analisando o problema…'), LINE_MAX, 1);
  if (act.kind === 'respond' && act.detail) return councilLines(act.detail, LINE_MAX, QUEUE_MAX);
  return [];
}

/** Ainda tem o que dizer: concluiu, mas termina de falar à mesa antes de levar o veredito. */
export function stillSpeaking(v: CouncilVoice): boolean {
  return v.councilSay.length > 0;
}

/** Atividade nova de um membro: põe as falas na fila (uma resposta nova descarta o que sobrou da anterior). */
export function queueCouncilSpeech(v: CouncilVoice, act: Activity, title: string | undefined): void {
  const lines = councilSpeech(act, title);
  if (!lines.length) return;
  v.councilSay = act.kind === 'respond' ? lines.slice(0, QUEUE_MAX) : [...v.councilSay, ...lines].slice(-QUEUE_MAX);
}

/**
 * Próxima fala da fila, se já for a vez: devolve [emblema, texto, duração] e agenda a seguinte. `busyUntil` = até
 * quando o balão atual (entrega, por exemplo) ocupa a cabeça.
 */
export function nextCouncilLine(v: CouncilVoice, key: string, now: number, busyUntil: number): [string, string, number] | null {
  if (!v.councilSay.length || now < v.councilNextAt || now < busyUntil) return null;
  const text = v.councilSay.shift()!;
  const ms = sayMs(text);
  v.councilNextAt = now + ms + COUNCIL_GAP_MS;
  return [councilMember(key)?.emblem ?? '🏛️', text, ms];
}
