// Conselho (skill /council e agentes council-* em ~/.claude/agents): quem é quem, como reconhecer um membro pelo
// pedido do Agent e o visual de cada um na War Room. Puro: sem Node nem DOM.
import type { AppearanceParts } from './appearance';

export interface CouncilMember {
  /** Chave do agente sem o prefixo: "socrates" = council-socrates. */
  key: string;
  /** Nome exibido no escritório. */
  name: string;
  look: 'f' | 'm';
  /** Emblema do balão de fala. */
  emblem: string;
  /** Visual fixo (por cima da aparência da semente). */
  parts: AppearanceParts;
}

// Os lugares à mesa da War Room vão do meio para as pontas, por ordem de chegada (client/src/world/layout/warroom.ts).
export const COUNCIL: readonly CouncilMember[] = Object.freeze([
  { key: 'socrates', name: 'Sócrates', look: 'm', emblem: '🏛️', parts: { hairStyle: 'bald', hair: '#d8d4cc', facialHair: 'beard', topStyle: 'sweater', top: '#ece6d6', skin: '#d9a77c' } },
  { key: 'aristotle', name: 'Aristóteles', look: 'm', emblem: '📚', parts: { hairStyle: 'curly', hair: '#6b5a48', facialHair: 'beard', topStyle: 'sweater', top: '#3f5d8a', skin: '#d9a77c' } },
  { key: 'machiavelli', name: 'Maquiavel', look: 'm', emblem: '🦊', parts: { hairStyle: 'short', hair: '#2b2420', facialHair: 'none', topStyle: 'jacket', top: '#7a1f2b', topAccent: '#1d1a1a', skin: '#e8b98f' } },
  { key: 'sun-tzu', name: 'Sun Tzu', look: 'm', emblem: '⚔️', parts: { hairStyle: 'bun', hair: '#1b1b1b', facialHair: 'mustache', topStyle: 'jacket', top: '#8a6a1f', topAccent: '#3a2a10', skin: '#e3b58b' } },
  { key: 'musashi', name: 'Musashi', look: 'm', emblem: '🗡️', parts: { hairStyle: 'ponytail', hair: '#141414', facialHair: 'stubble', topStyle: 'jacket', top: '#2e3a4f', topAccent: '#151b26', skin: '#e3b58b' } },
  { key: 'aurelius', name: 'Marco Aurélio', look: 'm', emblem: '🛡️', parts: { hairStyle: 'curly', hair: '#8a7a66', facialHair: 'beard', topStyle: 'sweater', top: '#6a2a6e', skin: '#d9a77c' } },
  { key: 'lao-tzu', name: 'Lao Tzu', look: 'm', emblem: '☯️', parts: { hairStyle: 'long', hair: '#e6e6e6', facialHair: 'goatee', topStyle: 'hoodie', top: '#5d7a5a', skin: '#e3b58b' } },
  { key: 'ada', name: 'Ada Lovelace', look: 'f', emblem: '🧮', parts: { hairStyle: 'bun', hair: '#3a2618', topStyle: 'blouse', top: '#4a2d5e', bottomStyle: 'skirt', bottom: '#2d1d3a', skin: '#f1cfb0' } },
  { key: 'feynman', name: 'Feynman', look: 'm', emblem: '⚛️', parts: { hairStyle: 'wavy', hair: '#4a3a2c', facialHair: 'none', topStyle: 'shirt_tie', top: '#e8e8e8', topAccent: '#2a4a8a', skin: '#efc5a0' } },
  { key: 'torvalds', name: 'Torvalds', look: 'm', emblem: '🐧', parts: { hairStyle: 'side_part', hair: '#c9a46a', facialHair: 'none', accessory: 'glasses', topStyle: 'tshirt', top: '#2b2b2b', skin: '#f1cfb0' } },
  { key: 'watts', name: 'Alan Watts', look: 'm', emblem: '🌊', parts: { hairStyle: 'side_part', hair: '#b8b2a8', facialHair: 'none', topStyle: 'shirt_tie', top: '#d9cfb8', topAccent: '#6a4a2a', skin: '#efc5a0' } },
  { key: 'karpathy', name: 'Karpathy', look: 'm', emblem: '🧠', parts: { hairStyle: 'buzz', hair: '#2a2420', facialHair: 'stubble', topStyle: 'hoodie', top: '#3a5a7a', skin: '#efc5a0' } },
  { key: 'sutskever', name: 'Sutskever', look: 'm', emblem: '🔭', parts: { hairStyle: 'bald', hair: '#3a3028', facialHair: 'stubble', topStyle: 'sweater', top: '#5a5a5a', skin: '#efc5a0' } },
] satisfies CouncilMember[]);

const BY_KEY = new Map(COUNCIL.map((m) => [m.key, m]));

// Chaves mais longas primeiro: "sun-tzu" e "lao-tzu" antes de qualquer prefixo.
const KEYS = [...BY_KEY.keys()].sort((a, b) => b.length - a.length).join('|');
/** O texto inteiro é o tipo do agente (subagent_type ou name): "council-socrates". */
const TYPE_RE = new RegExp(`^\\s*council-(${KEYS})\\s*$`, 'i');
/** As frases do prompt da skill: "Read your agent definition at ~/.claude/agents/council-X.md" e "You are council-X". */
const PROMPT_RE = new RegExp(`(?:agent definition at \\S*council-(${KEYS})\\.md|\\byou are council-(${KEYS})(?![a-z-]))`, 'i');

export function councilMember(key: string | undefined): CouncilMember | undefined {
  return key ? BY_KEY.get(key) : undefined;
}

/**
 * Membro do conselho no pedido do Agent: pelo tipo (subagent_type ou name = "council-X") ou pelas frases do prompt da
 * skill /council, que dispara cada membro como "general-purpose" com "Read your agent definition at
 * ~/.claude/agents/council-{name}.md" (ou "You are council-{name}"). Só citar o arquivo de um membro não basta.
 */
export function councilMemberOf(...texts: (string | undefined)[]): string | undefined {
  for (const t of texts) {
    if (!t) continue;
    const m = TYPE_RE.exec(t) ?? PROMPT_RE.exec(t);
    const key = m?.slice(1).find(Boolean);
    if (key) return key.toLowerCase();
  }
  return undefined;
}

/**
 * Trechos curtos para o balão a partir do texto que o membro está escrevendo: tira marcação de Markdown,
 * quebra em frases e junta as curtas até ~`max` caracteres. No máximo `limit` trechos.
 */
export function councilLines(text: string, max = 90, limit = 4): string[] {
  const clean = text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^\s*[-*>]\s+/gm, '')
    .replace(/\*\*|__|`/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!clean) return [];
  const sentences = clean.split(/(?<=[.!?…:])\s+/);
  const out: string[] = [];
  let cur = '';
  for (const s of sentences) {
    if (out.length >= limit) break;
    if (cur && (cur + ' ' + s).length > max) {
      out.push(cur);
      cur = '';
      if (out.length >= limit) break;
    }
    cur = cur ? `${cur} ${s}` : s;
  }
  if (cur && out.length < limit) out.push(cur);
  return out.map((l) => (l.length > max ? `${l.slice(0, max - 1).trimEnd()}…` : l));
}
