import { describe, it, expect } from 'vitest';
import { createScore, addTime, addBonus, formatScore, BONUS_PER_BONFIRE } from '../../src/score.js';

describe('createScore', () => {
  it('starts at zero survival and zero bonus', () => {
    const s = createScore();
    expect(s.survivalSec).toBe(0);
    expect(s.bonus).toBe(0);
  });
});

describe('addTime', () => {
  it('accumulates seconds', () => {
    let s = createScore();
    s = addTime(s, 1.0);
    s = addTime(s, 0.5);
    expect(s.survivalSec).toBeCloseTo(1.5, 5);
  });

  it('ignores negative deltas (defensive against time jumps)', () => {
    let s = createScore();
    s = addTime(s, 2.0);
    s = addTime(s, -10.0);
    expect(s.survivalSec).toBe(2.0);
  });

  it('returns a new object (immutable)', () => {
    const a = createScore();
    const b = addTime(a, 1.0);
    expect(a.survivalSec).toBe(0);
    expect(b.survivalSec).toBe(1.0);
    expect(a).not.toBe(b);
  });
});

describe('addBonus', () => {
  it('adds BONUS_PER_BONFIRE to bonus total', () => {
    let s = createScore();
    s = addBonus(s);
    expect(s.bonus).toBe(BONUS_PER_BONFIRE);
  });

  it('stacks multiple bonuses', () => {
    let s = createScore();
    s = addBonus(s);
    s = addBonus(s);
    s = addBonus(s);
    expect(s.bonus).toBe(BONUS_PER_BONFIRE * 3);
  });

  it('does not affect survivalSec', () => {
    let s = createScore();
    s = addTime(s, 5);
    s = addBonus(s);
    expect(s.survivalSec).toBe(5);
    expect(s.bonus).toBe(BONUS_PER_BONFIRE);
  });
});

describe('formatScore', () => {
  it('formats survival to 1 decimal place', () => {
    const s = { survivalSec: 17.345, bonus: 0 };
    expect(formatScore(s)).toBe('생존 17.3초 + 보너스 0');
  });

  it('formats with bonus', () => {
    const s = { survivalSec: 23.05, bonus: 15 };
    expect(formatScore(s)).toBe('생존 23.1초 + 보너스 15');
  });

  it('handles zero state', () => {
    expect(formatScore(createScore())).toBe('생존 0.0초 + 보너스 0');
  });
});

describe('BONUS_PER_BONFIRE constant', () => {
  it('is 5 (per design doc D6)', () => {
    expect(BONUS_PER_BONFIRE).toBe(5);
  });
});
