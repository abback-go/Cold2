import { describe, it, expect } from 'vitest';
import {
  pickSafeLane,
  laneToX,
  createObstacle,
  isBonfire,
  LANE_COUNT,
  DANGER_ZONE_Y,
  OBSTACLE_W,
  OBSTACLE_H,
  CANVAS_WIDTH,
} from '../../src/obstacle.js';

describe('laneToX', () => {
  it('returns the centered x for lane 0', () => {
    const x = laneToX(0);
    const laneWidth = CANVAS_WIDTH / LANE_COUNT;
    expect(x).toBeCloseTo(laneWidth / 2 - OBSTACLE_W / 2, 5);
  });

  it('returns increasing x for higher lanes', () => {
    const x0 = laneToX(0);
    const x1 = laneToX(1);
    const x2 = laneToX(2);
    expect(x1).toBeGreaterThan(x0);
    expect(x2).toBeGreaterThan(x1);
  });

  it('throws on out-of-range lane', () => {
    expect(() => laneToX(-1)).toThrow();
    expect(() => laneToX(LANE_COUNT)).toThrow();
  });
});

describe('pickSafeLane (solvability guarantee)', () => {
  it('all lanes safe when no obstacles in danger zone', () => {
    const inFlight = [];
    const rng = () => 0; // deterministic
    const lane = pickSafeLane(inFlight, rng);
    expect(lane).toBeGreaterThanOrEqual(0);
    expect(lane).toBeLessThan(LANE_COUNT);
  });

  it('only safe lane returned when 2 lanes blocked in danger zone', () => {
    const inFlight = [
      { lane: 0, y: 50, type: 'obstacle' },
      { lane: 1, y: 100, type: 'obstacle' },
    ];
    const rng = () => 0;
    expect(pickSafeLane(inFlight, rng)).toBe(2);
  });

  it('guarantees at least one lane always free across many random spawns', () => {
    let lastSpawnLane = -1;
    let inFlight = [];
    const rng = () => Math.random();
    for (let i = 0; i < 1000; i++) {
      const lane = pickSafeLane(inFlight, rng);
      // Must produce a valid lane
      expect(lane).toBeGreaterThanOrEqual(0);
      expect(lane).toBeLessThan(LANE_COUNT);
      // Add new obstacle at top
      inFlight.push({ lane, y: 0, type: 'obstacle' });
      // Drop obstacles past danger zone (simulate falling)
      inFlight = inFlight
        .map(o => ({ ...o, y: o.y + 80 }))
        .filter(o => o.y < 480);
      // After spawn, never have ALL lanes covered in danger zone
      const inDanger = inFlight.filter(o => o.y < DANGER_ZONE_Y);
      const lanesCovered = new Set(inDanger.map(o => o.lane));
      expect(lanesCovered.size).toBeLessThan(LANE_COUNT);
      lastSpawnLane = lane;
    }
  });

  it('ignores obstacles past danger zone (already passed)', () => {
    const inFlight = [
      { lane: 0, y: DANGER_ZONE_Y + 50, type: 'obstacle' }, // safe (past)
      { lane: 1, y: DANGER_ZONE_Y + 50, type: 'obstacle' }, // safe (past)
    ];
    const rng = () => 0;
    const lane = pickSafeLane(inFlight, rng);
    // All 3 lanes should be considered safe
    expect([0, 1, 2]).toContain(lane);
  });
});

describe('createObstacle', () => {
  it('places obstacle at top of canvas in given lane', () => {
    const o = createObstacle(1, 'obstacle');
    expect(o.lane).toBe(1);
    expect(o.y).toBeLessThanOrEqual(0);
    expect(o.x).toBe(laneToX(1));
    expect(o.w).toBe(OBSTACLE_W);
    expect(o.h).toBe(OBSTACLE_H);
    expect(o.type).toBe('obstacle');
  });

  it('creates bonfire type', () => {
    const o = createObstacle(2, 'bonfire');
    expect(o.type).toBe('bonfire');
  });
});

describe('isBonfire', () => {
  it('returns true for bonfire', () => {
    expect(isBonfire({ type: 'bonfire' })).toBe(true);
  });
  it('returns false for obstacle', () => {
    expect(isBonfire({ type: 'obstacle' })).toBe(false);
  });
});

describe('constants sanity', () => {
  it('LANE_COUNT is 3', () => {
    expect(LANE_COUNT).toBe(3);
  });
  it('DANGER_ZONE_Y is 160 (top 1/3 of 480 canvas)', () => {
    expect(DANGER_ZONE_Y).toBe(160);
  });
  it('OBSTACLE dimensions are 30x30', () => {
    expect(OBSTACLE_W).toBe(30);
    expect(OBSTACLE_H).toBe(30);
  });
  it('CANVAS_WIDTH is 640', () => {
    expect(CANVAS_WIDTH).toBe(640);
  });
});
