import { hash32 } from './hash';

export interface PersonName {
  name: string;
  look: 'f' | 'm';
}

// Nomes dos personagens: os agentes operacionais do NovaK (OneDrive/nova-workspace/AGENTS.md), não nomes de pessoas.
// Com mais agentes no escritório do que nomes, o pool repete com sufixo ("FORGE 2"). `look` só varia o visual.
const AGENTS: readonly PersonName[] = [
  { name: 'NOVA', look: 'f' },
  { name: 'FORGE', look: 'm' },
  { name: 'SIGNAL', look: 'f' },
  { name: 'SEC', look: 'm' },
  { name: 'AEGIS', look: 'f' },
  { name: 'FRONT', look: 'm' },
  { name: 'BRAND', look: 'f' },
  { name: 'DEVOPS', look: 'm' },
  { name: 'GROWTH', look: 'f' },
  { name: 'QA', look: 'm' },
  { name: 'CHAOS', look: 'f' },
  { name: 'ARCHEX', look: 'm' },
];

export const NAME_POOL: readonly PersonName[] = Object.freeze(AGENTS.map((a) => Object.freeze({ ...a })));

/**
 * Escolhe um nome determinístico para `id`, evitando os já usados.
 * Se o pool esgotar, acrescenta um sufixo numérico ("FORGE 2").
 */
export function pickName(id: string, used: ReadonlySet<string>): PersonName {
  const n = NAME_POOL.length;
  const start = hash32(id) % n;
  for (let i = 0; i < n; i++) {
    const cand = NAME_POOL[(start + i) % n];
    if (!used.has(cand.name)) return cand;
  }
  const base = NAME_POOL[start];
  for (let k = 2; ; k++) {
    const name = `${base.name} ${k}`;
    if (!used.has(name)) return { name, look: base.look };
  }
}
