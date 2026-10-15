import { describe, expect, it } from 'vitest';
import { parseAppearanceParts } from './appearance';
import { COUNCIL, councilLines, councilMember, councilMemberOf } from './council';

// Prompts literais da skill /council (~/.claude/skills/council/SKILL.md).
const ROUND1 = `You are operating as a council member in a structured deliberation.
Read your agent definition at ~/.claude/agents/council-socrates.md and follow it precisely.

The problem under deliberation:
Should we ship today?`;
const ROUND2 = `You are council-sun-tzu in Round 2 of a structured deliberation.
Read your agent definition at ~/.claude/agents/council-sun-tzu.md.`;

describe('councilMemberOf', () => {
  it('reconhece o membro pelo prompt da skill (subagent_type general-purpose)', () => {
    expect(councilMemberOf('general-purpose', undefined, 'Round 1', ROUND1)).toBe('socrates');
    expect(councilMemberOf('general-purpose', ROUND2)).toBe('sun-tzu');
  });

  it('reconhece pelo subagent_type direto', () => {
    expect(councilMemberOf('council-lao-tzu')).toBe('lao-tzu');
    expect(councilMemberOf('Council-Ada')).toBe('ada');
  });

  it('o primeiro texto com membro vence', () => {
    expect(councilMemberOf('council-feynman', 'council-torvalds')).toBe('feynman');
  });

  it('ignora nomes que não são do conselho', () => {
    expect(councilMemberOf('general-purpose', 'Explore', 'run /council later', 'council-multi-model')).toBeUndefined();
    // citar o arquivo de um membro (editar o agente, a síntese que cita os outros) não faz de ninguém conselheiro
    expect(councilMemberOf('general-purpose', 'Edit ~/.claude/agents/council-torvalds.md to add a rule')).toBeUndefined();
    expect(councilMemberOf('Synthesize: council-feynman said X, council-ada said Y')).toBeUndefined();
    expect(councilMemberOf('council-adams')).toBeUndefined();
    expect(councilMemberOf(undefined, '')).toBeUndefined();
  });
});

describe('catálogo', () => {
  it('13 membros com chaves únicas e visual válido', () => {
    expect(COUNCIL).toHaveLength(13);
    expect(new Set(COUNCIL.map((m) => m.key)).size).toBe(13);
    for (const m of COUNCIL) expect(parseAppearanceParts(m.parts)).not.toBeNull();
    expect(councilMember('machiavelli')?.name).toBe('Maquiavel');
    expect(councilMember('nope')).toBeUndefined();
  });
});

describe('councilLines', () => {
  it('limpa Markdown e quebra em trechos curtos', () => {
    const lines = councilLines('## Essential Question\n**What are we optimizing?** Speed hides risk. The verdict: wait one week.', 40);
    expect(lines.join(' ')).not.toMatch(/[#*]/);
    expect(lines.every((l) => l.length <= 40)).toBe(true);
    expect(lines).toContain('Speed hides risk. The verdict:');
  });

  it('respeita o limite e corta trechos longos com reticências', () => {
    const lines = councilLines('a'.repeat(200), 50, 2);
    expect(lines).toHaveLength(1);
    expect(lines[0].endsWith('…')).toBe(true);
    expect(councilLines('Um. Dois. Três. Quatro. Cinco.', 4, 3)).toHaveLength(3);
    expect(councilLines('   ')).toEqual([]);
  });
});
