export function fnv1aHash(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

export interface SeededRng {
  next(): number;
  int(minInclusive: number, maxInclusive: number): number;
  shuffle<T>(items: readonly T[]): T[];
}

export function createSeededRng(seed: string): SeededRng {
  let state = fnv1aHash(seed) || 0x6d2b79f5;

  const next = (): number => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const int = (minInclusive: number, maxInclusive: number): number => {
    const span = maxInclusive - minInclusive + 1;
    return minInclusive + Math.floor(next() * span);
  };

  const shuffle = <T>(items: readonly T[]): T[] => {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = int(0, i);
      const temp = copy[i]!;
      copy[i] = copy[j]!;
      copy[j] = temp;
    }
    return copy;
  };

  return { next, int, shuffle };
}

/**
 * Детерминированный множитель j в диапазоне [0.95, 1.05] от сида матча и номера обмена.
 */
export function getDeterministicJitter(seed: string, step: number): number {
  const rng = createSeededRng(`${seed}:exchange:${step}`);
  const raw = 0.95 + rng.next() * 0.1;
  return Number(raw.toFixed(4));
}

export function deterministicCoinFlip(seed: string, tag: string): "A" | "B" {
  const rng = createSeededRng(`${seed}:${tag}`);
  return rng.next() < 0.5 ? "A" : "B";
}
