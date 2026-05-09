import { describe, it, expect } from 'vitest';
import { isColliding, hitsAny } from '../../src/collision.js';

const player = { x: 100, y: 400, w: 40, h: 40 };

describe('isColliding (AABB)', () => {
  it('detects exact overlap', () => {
    const obstacle = { x: 100, y: 400, w: 40, h: 40 };
    expect(isColliding(player, obstacle)).toBe(true);
  });

  it('detects partial overlap', () => {
    const obstacle = { x: 120, y: 420, w: 30, h: 30 };
    expect(isColliding(player, obstacle)).toBe(true);
  });

  it('rejects 1px gap on the right', () => {
    const obstacle = { x: 141, y: 400, w: 30, h: 30 }; // player ends at 140
    expect(isColliding(player, obstacle)).toBe(false);
  });

  it('rejects 1px gap on the left', () => {
    const obstacle = { x: 69, y: 400, w: 30, h: 30 }; // player starts at 100
    expect(isColliding(player, obstacle)).toBe(false);
  });

  it('rejects 1px gap above', () => {
    const obstacle = { x: 100, y: 369, w: 30, h: 30 }; // player starts at 400
    expect(isColliding(player, obstacle)).toBe(false);
  });

  it('rejects when far apart', () => {
    const obstacle = { x: 500, y: 100, w: 30, h: 30 };
    expect(isColliding(player, obstacle)).toBe(false);
  });

  it('treats edge-touching as non-collision (right edge of player = left edge of obstacle)', () => {
    const obstacle = { x: 140, y: 400, w: 30, h: 30 }; // exactly touching
    expect(isColliding(player, obstacle)).toBe(false);
  });
});

describe('hitsAny', () => {
  it('returns null when no obstacles collide', () => {
    const obstacles = [
      { x: 500, y: 100, w: 30, h: 30 },
      { x: 600, y: 200, w: 30, h: 30 },
    ];
    expect(hitsAny(player, obstacles)).toBe(null);
  });

  it('returns the first colliding obstacle', () => {
    const a = { x: 500, y: 100, w: 30, h: 30 };
    const b = { x: 100, y: 400, w: 40, h: 40 }; // collides
    const c = { x: 110, y: 410, w: 30, h: 30 }; // also collides
    const obstacles = [a, b, c];
    expect(hitsAny(player, obstacles)).toBe(b);
  });

  it('handles empty obstacle array', () => {
    expect(hitsAny(player, [])).toBe(null);
  });
});
