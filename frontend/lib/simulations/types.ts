/**
 * TypeScript Branded Types for Rigorous Physiological Dimensional Safety
 * Enforces strict compilation-level isolation between distinct physical units.
 */

export type Branded<T, B> = T & { readonly __brand: B };

export type Millivolts = Branded<number, 'Millivolts'>;
export type MillimetersMercury = Branded<number, 'MillimetersMercury'>; // mmHg
export type Milliliters = Branded<number, 'Milliliters'>; // mL
export type LitersPerMinute = Branded<number, 'LitersPerMinute'>; // L/min
export type BeatsPerMinute = Branded<number, 'BeatsPerMinute'>; // bpm
export type Percent = Branded<number, 'Percent'>; // 0 - 100%
export type MillilitersPerMinute = Branded<number, 'MillilitersPerMinute'>; // mL/min

export function asMillivolts(n: number): Millivolts {
  return n as Millivolts;
}

export function asMmHg(n: number): MillimetersMercury {
  return n as MillimetersMercury;
}

export function asMilliliters(n: number): Milliliters {
  return n as Milliliters;
}

export function asLitersPerMinute(n: number): LitersPerMinute {
  return n as LitersPerMinute;
}

export function asBeatsPerMinute(n: number): BeatsPerMinute {
  return n as BeatsPerMinute;
}

export function asPercent(n: number): Percent {
  return n as Percent;
}

export function asMillilitersPerMinute(n: number): MillilitersPerMinute {
  return n as MillilitersPerMinute;
}

