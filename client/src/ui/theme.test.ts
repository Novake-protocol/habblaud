import { describe, expect, it } from 'vitest';
import { DEFAULT_PREFS, sanitizePrefs } from './prefs';
import { resolveTheme } from './theme';

describe('visual da interface (fork NovaK)', () => {
  it('claro por padrão; "auto" segue o sistema', () => {
    expect(DEFAULT_PREFS.uiTheme).toBe('light');
    expect(resolveTheme('light', true)).toBe('light');
    expect(resolveTheme('dark', false)).toBe('dark');
    expect(resolveTheme('auto', true)).toBe('dark');
    expect(resolveTheme('auto', false)).toBe('light');
  });

  it('preferência inválida ou ausente volta ao claro', () => {
    expect(sanitizePrefs({ uiTheme: 'dark' }).uiTheme).toBe('dark');
    expect(sanitizePrefs({ uiTheme: 'neon' }).uiTheme).toBe('light');
    expect(sanitizePrefs({}).uiTheme).toBe('light');
  });
});
