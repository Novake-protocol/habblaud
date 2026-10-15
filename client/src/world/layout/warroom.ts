// Coluna 2 do núcleo: War Room (norte), onde o conselho do /council delibera, e a Biblioteca (sul).
import type { WallStyle } from '../../art/api';
import { COL_W, DOOR_W, DOOR_X, NORTH_Y, ROOM_H, SOUTH_Y } from '../constants';
import { AreaBuilder } from './builder';
import type { AreaLayout, SpotDef } from './types';

export const WARROOM_ID = 'core:warroom';
export const LIBRARY_ID = 'core:biblioteca';

const COL = 2;

export const WARROOM_WALLS = {
  // identidade do Grupo NovaK: marfim e mármore com acabamento em ouro; o violeta fica no tapete da mesa
  warroom: { base: '#f3eee6', trim: '#c6a45b', pattern: 'marble' } satisfies WallStyle,
  library: { base: '#efe7d8', trim: '#a88b4a', pattern: 'wood_panel' } satisfies WallStyle,
};

/** Primeira e última coluna local da mesa do conselho (3 mesas de reunião de 3 tiles lado a lado). */
const TABLE_X0 = 3;
const TABLE_X1 = 11;

export function layoutWarRoom(): AreaLayout {
  const b = new AreaBuilder(WARROOM_ID, 'warroom', { x: COL * COL_W, y: NORTH_Y, w: COL_W, h: ROOM_H });
  const wall = WARROOM_WALLS.warroom;
  b.floor('marble', 0, 0, 16, 12, 701);
  b.rug(1.9, 3.0, 11.2, 6.0, '#c6a45b', 704);
  b.rug(2.2, 3.3, 10.6, 5.4, '#5b24d6', 702);
  b.rug(DOOR_X - 0.25, 9.5, DOOR_W + 0.5, 1.25, '#3d1a8f', 703);
  b.face(0.5, 15, wall);
  b.south(0.5, 15, 11, wall, [{ lx: DOOR_X, w: DOOR_W }]);
  b.cap(0, 0, 0.5, 12, wall);
  b.cap(15.5, 0, 0.5, 12, wall);
  b.walk(1, 2, 14, 9);
  b.area.door = { x: COL * COL_W + DOOR_X, y: NORTH_Y + 11, w: DOOR_W, h: 1 };
  b.walk(DOOR_X, 11, DOOR_W, 1);

  // parede: quadro com a pauta, placa "War Room", relógio e quadro de mapas
  b.wall('whiteboard', 3.5, undefined, { order: 0.6 });
  b.area.signId = b.wall('sign', 8, undefined, { order: 0.95 });
  b.wall('clock', 11.5, undefined, { order: 0.7 });
  b.wall('painting', 13, undefined, { order: 0.5 });
  b.spot('whiteboard', 3, 2, 'up', { dx: 8, dy: 2 });

  b.furn('plant_tall', 1, 2, 'bonsai', { order: 0.2 });
  b.furn('floor_lamp', 5, 2, undefined, { order: 0.22 });
  b.furn('floor_lamp', 10, 2, undefined, { order: 0.23 });
  b.furn('plant_tall', 14, 2, 'ficus', { order: 0.21 });

  // mesa longa do conselho: uma fileira de cadeiras de cada lado (de frente uma para a outra)
  for (let i = 0; i < 3; i++) b.furn('meeting_table', TABLE_X0 + i * 3, 5, undefined, { order: 0.4 + i * 0.02 });
  for (let lx = TABLE_X0; lx <= TABLE_X1; lx++) {
    const o = 0.55 + (lx - TABLE_X0) * 0.01;
    b.seat('council', 'office_chair_front', lx, 4, 'down', 'red', { order: o, rank: seatRank(lx, 'N') });
    b.seat('council', 'office_chair', lx, 7, 'up', 'red', { order: o + 0.1, rank: seatRank(lx, 'S') });
  }

  // cantos de baixo: arquivo e plantas; pontos em pé para quem chega quando a mesa está cheia
  b.furn('filing_cabinet', 1, 10, undefined, { order: 0.3 });
  b.furn('binder_shelf', 2, 10, undefined, { order: 0.31 });
  b.furn('plant_small', 3, 10, 'succulent', { order: 0.32 });
  b.furn('plant_small', 12, 10, 'fern', { order: 0.33 });
  b.furn('trash_bin', 13, 10, undefined, { order: 0.34 });
  b.furn('plant_tall', 14, 10, 'monstera', { order: 0.35 });
  for (const lx of [1, 2, 13, 14]) b.spot('stand', lx, 6, lx < 8 ? 'right' : 'left', { dy: -1 });
  return b.build();
}

/** Preferência dos lugares: do meio da mesa para as pontas, alternando os lados (o conselho senta junto). */
function seatRank(lx: number, side: 'N' | 'S'): number {
  const mid = (TABLE_X0 + TABLE_X1) / 2;
  return Math.abs(lx - mid) * 2 + (side === 'S' ? 1 : 0);
}

/** Lugares da mesa do conselho, do mais ao menos preferido. */
export function councilSeats(spots: readonly SpotDef[]): SpotDef[] {
  return spots.filter((s) => s.kind === 'council').sort((a, b) => (a.rank ?? 99) - (b.rank ?? 99));
}

export function layoutLibrary(): AreaLayout {
  const b = new AreaBuilder(LIBRARY_ID, 'library', { x: COL * COL_W, y: SOUTH_Y, w: COL_W, h: ROOM_H });
  const wall = WARROOM_WALLS.library;
  b.floor('wood', 0, 0, 16, 12, 801);
  b.rug(2, 4.6, 6, 3.8, '#5b24d6', 802);
  b.rug(9.5, 4.6, 5, 3.8, '#c6a45b', 803);
  b.face(0.5, 15, wall, [{ lx: DOOR_X, w: DOOR_W }]);
  b.wall('door_frame', DOOR_X + DOOR_W / 2, undefined, { order: 0.05 });
  b.south(0.5, 15, 11, { ...wall, exterior: true });
  b.cap(0, 0, 0.5, 12, wall);
  b.cap(15.5, 0, 0.5, 12, wall);
  b.walk(1, 2, 14, 9);
  b.walk(DOOR_X, 0, DOOR_W, 2);
  b.area.door = { x: COL * COL_W + DOOR_X, y: SOUTH_Y, w: DOOR_W, h: 2 };

  // estantes na parede norte (a passagem da porta, colunas 6–9, fica livre)
  for (const lx of [1, 3, 10, 12]) {
    b.furn('bookshelf', lx, 2, undefined, { order: 0.3 + lx * 0.01 });
    b.spot('shelf', lx, 3, 'up', { dx: 8, dy: -2 });
  }
  b.furn('plant_small', 5, 2, 'fern', { order: 0.2 });
  b.furn('plant_tall', 14, 2, 'palm', { order: 0.21 });
  b.wall('clock', 5.5, undefined, { order: 0.6 });

  // leitura: poltronas em volta de uma mesinha e um canto com puffs
  b.seat('armchair', 'armchair', 2, 6, 'right', 'right', { order: 0.5 });
  b.furn('coffee_table', 3, 6, undefined, { order: 0.45 });
  b.seat('armchair', 'armchair', 5, 6, 'left', 'left', { order: 0.51 });
  b.furn('floor_lamp', 6, 5, undefined, { order: 0.44 });
  b.seat('beanbag', 'beanbag', 10, 6, 'down', 'green', { order: 0.55 });
  b.seat('beanbag', 'beanbag', 12, 6, 'down', 'yellow', { order: 0.56 });
  b.furn('floor_lamp', 14, 6, undefined, { order: 0.46 });

  b.furn('bookshelf', 1, 10, undefined, { order: 0.3 });
  b.furn('plant_tall', 3, 10, 'ficus', { order: 0.31 });
  b.furn('plant_small', 12, 10, 'flower', { order: 0.32 });
  b.furn('bookshelf', 13, 10, undefined, { order: 0.33 });
  return b.build();
}
