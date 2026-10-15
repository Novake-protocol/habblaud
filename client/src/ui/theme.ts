// Visual da interface (fork NovaK): claro "Casa NovaK" (padrão), "Noite orbital" ou seguir o sistema.
// Põe data-theme na raiz da UI e no <html> e acerta as metas color-scheme/theme-color (barras do celular, controles
// nativos, tela do app instalado). Os tokens ficam em theme-novak.css.

export type UiTheme = 'light' | 'dark' | 'auto';
export const UI_THEMES: readonly UiTheme[] = ['light', 'dark', 'auto'];

/** Cor da barra do navegador/celular em cada tema (o fundo dos painéis). */
export const THEME_COLOR = { light: '#f6f2eb', dark: '#0c0a16' } as const;

/** Tema efetivo: 'auto' segue prefers-color-scheme. */
export function resolveTheme(pref: UiTheme, prefersDark: boolean): 'light' | 'dark' {
  return pref === 'auto' ? (prefersDark ? 'dark' : 'light') : pref;
}

const media = (): MediaQueryList | null => (typeof matchMedia === 'function' ? matchMedia('(prefers-color-scheme: dark)') : null);

function meta(name: string): HTMLMetaElement {
  let m = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!m) {
    m = document.createElement('meta');
    m.name = name;
    document.head.append(m);
  }
  return m;
}

let current: { root: HTMLElement; pref: UiTheme } | null = null;
let listening = false;

function paint(): void {
  if (!current) return;
  const theme = resolveTheme(current.pref, !!media()?.matches);
  // DOM falso dos testes (sem dataset/head): só o que existir.
  for (const el of [current.root, typeof document === 'undefined' ? undefined : document.documentElement]) if (el?.dataset) el.dataset.theme = theme;
  if (typeof document === 'undefined' || !document.head) return;
  meta('color-scheme').content = theme;
  meta('theme-color').content = THEME_COLOR[theme];
}

/** Aplica o tema escolhido (e volta a aplicar quando o sistema troca, no modo 'auto'). */
export function applyUiTheme(root: HTMLElement, pref: UiTheme): void {
  current = { root, pref };
  paint();
  const mq = media();
  if (mq && !listening) {
    listening = true;
    mq.addEventListener('change', paint);
  }
}
