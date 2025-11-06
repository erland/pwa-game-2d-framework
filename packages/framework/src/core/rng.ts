export interface RNG { next(): number; }
export class MathRNG implements RNG { next() { return Math.random(); } }

export class LCG implements RNG {
  private seed: number;
  constructor(seed = 123456789) { this.seed = seed >>> 0; }
  next() {
    let x = this.seed;
    x ^= x << 13; x >>>= 0;
    x ^= x >>> 17; x >>>= 0;
    x ^= x << 5;  x >>>= 0;
    this.seed = x >>> 0;
    return (this.seed % 0xFFFF_FFFF) / 0xFFFF_FFFF;
  }
}

/** Deterministic RNG for tests: cycles through provided values.
 *  - If a value is already in [0,1), return it as-is (ideal for unit tests).
 *  - Otherwise, map to [0,1) using the fractional part (handles big ints/negatives).
 */
export class SeqRNG implements RNG {
  private i = 0;
  constructor(private seq: number[]) {}
  next(): number {
    if (this.seq.length === 0) return 0;
    const raw = this.seq[this.i++ % this.seq.length];
    if (!Number.isFinite(raw)) return 0;

    if (raw >= 0 && raw < 1) return raw; // pass-through unit floats

    // map anything else to [0,1)
    const frac = raw - Math.trunc(raw);
    return frac >= 0 ? frac : frac + 1;
  }
}

/** Map float RNG.next() in [0,1) to an integer in [0, maxExclusive). */
export function randomInt(rng: RNG, maxExclusive: number): number {
  if (maxExclusive <= 1) return 0;
  return Math.floor(rng.next() * maxExclusive);
}

