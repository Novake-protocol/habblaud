// Temas de sala (puros), na paleta do Grupo NovaK: marfim, areia, violeta #5b24d6 e ouro #c6a45b, com tons de apoio
// (sálvia, terracota, rosé, azul-tinta) para as salas continuarem distinguíveis. Sementes consecutivas (slots
// vizinhos) recebem temas diferentes; a ordem da lista alterna famílias de cor de propósito.
import type { RoomTheme } from './api';

const THEMES: readonly RoomTheme[] = [
  { carpet: '#d6cdea', carpet2: '#cbc0e2', wall: { base: '#fffdf8', trim: '#8f78c9', pattern: 'plain' }, accent: '#5b24d6', deskVariant: 'white', chairVariant: 'violet' },
  { carpet: '#e2d6bf', carpet2: '#d8caaf', wall: { base: '#f6f2eb', trim: '#b8964f', pattern: 'stripes' }, accent: '#c6a45b', deskVariant: 'wood', chairVariant: 'black' },
  { carpet: '#cad3bf', carpet2: '#bec9b2', wall: { base: '#f4f3ea', trim: '#8f9f7e', pattern: 'wood_panel' }, accent: '#5f8f5a', deskVariant: 'wood', chairVariant: 'green' },
  { carpet: '#bdb6cc', carpet2: '#b1a9c2', wall: { base: '#efecf3', trim: '#5b5270', pattern: 'plain' }, accent: '#7a4fe0', deskVariant: 'dark', chairVariant: 'black' },
  { carpet: '#e6d0c0', carpet2: '#dcc3b1', wall: { base: '#faf3ec', trim: '#c08a6a', pattern: 'plain' }, accent: '#c9713f', deskVariant: 'wood', chairVariant: 'red' },
  { carpet: '#e0d9ec', carpet2: '#d5cce4', wall: { base: '#fbf9fd', trim: '#a99bd0', pattern: 'stripes' }, accent: '#9a7be6', deskVariant: 'white', chairVariant: 'gray' },
  { carpet: '#a9a3b8', carpet2: '#9e97ae', wall: { base: '#e9e6ee', trim: '#4a4258', pattern: 'brick' }, accent: '#d8b87a', deskVariant: 'dark', chairVariant: 'violet' },
  { carpet: '#e4cfd3', carpet2: '#d9c1c6', wall: { base: '#fbf3f3', trim: '#bf8f99', pattern: 'stripes' }, accent: '#b04a6a', deskVariant: 'white', chairVariant: 'black' },
  { carpet: '#c9d0de', carpet2: '#bdc5d6', wall: { base: '#f3f5f9', trim: '#7f8db0', pattern: 'wood_panel' }, accent: '#3f5fb0', deskVariant: 'wood', chairVariant: 'blue' },
  { carpet: '#d8c8ae', carpet2: '#ccba9e', wall: { base: '#f5efe4', trim: '#8a6a3f', pattern: 'wood_panel' }, accent: '#8c6a1f', deskVariant: 'dark', chairVariant: 'gray' },
];

export const THEME_COUNT = THEMES.length;

export function roomTheme(seed: number): RoomTheme {
  const n = THEMES.length;
  const t = THEMES[((Math.floor(seed) % n) + n) % n];
  return { ...t, wall: { ...t.wall } };
}
