import { describe, it, expect } from 'vitest';
import {
  currentSpeed,
  spawnInterval,
  currentLevel,
  INITIAL_SPEED,
  MAX_SPEED,
  BASE_INTERVAL,
  SPEED_INCREMENT,
  LEVEL_DURATION_SEC,
} from '../../src/speed.js';

describe('currentSpeed', () => {
  it('returns INITIAL_SPEED at t=0', () => {
    expect(currentSpeed(0)).toBe(INITIAL_SPEED);
  });

  it('returns INITIAL_SPEED just before first level boundary (t=9.9)', () => {
    expect(currentSpeed(9.9)).toBe(INITIAL_SPEED);
  });

  it('increments by SPEED_INCREMENT after first level (t=10)', () => {
    expect(currentSpeed(10)).toBe(INITIAL_SPEED + SPEED_INCREMENT);
  });

  it('reaches MAX_SPEED at t=80 with default values', () => {
    expect(currentSpeed(80)).toBe(MAX_SPEED);
  });

  it('clamps at MAX_SPEED for very long sessions', () => {
    expect(currentSpeed(200)).toBe(MAX_SPEED);
    expect(currentSpeed(1000)).toBe(MAX_SPEED);
  });

  it('returns INITIAL_SPEED for negative time (defensive)', () => {
    expect(currentSpeed(-1)).toBe(INITIAL_SPEED);
  });
});

describe('spawnInterval', () => {
  it('returns BASE_INTERVAL at INITIAL_SPEED', () => {
    expect(spawnInterval(INITIAL_SPEED)).toBe(BASE_INTERVAL);
  });

  it('returns BASE_INTERVAL/3 at MAX_SPEED (3x speed = 1/3 interval)', () => {
    expect(spawnInterval(MAX_SPEED)).toBe(BASE_INTERVAL / 3);
  });

  it('scales inversely with speed', () => {
    const doubleSpeed = INITIAL_SPEED * 2;
    expect(spawnInterval(doubleSpeed)).toBe(BASE_INTERVAL / 2);
  });

  it('guards against zero or negative speed (no Infinity)', () => {
    expect(spawnInterval(0)).toBe(BASE_INTERVAL);
    expect(spawnInterval(-100)).toBe(BASE_INTERVAL);
  });
});

describe('currentLevel', () => {
  it('returns 0 at t=0', () => {
    expect(currentLevel(0)).toBe(0);
  });

  it('returns 1 at t=10', () => {
    expect(currentLevel(10)).toBe(1);
  });

  it('returns 8 at t=80 (max speed reached)', () => {
    expect(currentLevel(80)).toBe(8);
  });

  it('keeps incrementing past max-speed time (visual progress)', () => {
    expect(currentLevel(120)).toBe(12);
  });
});

describe('constants sanity', () => {
  it('INITIAL_SPEED is 200', () => {
    expect(INITIAL_SPEED).toBe(200);
  });
  it('MAX_SPEED is 600', () => {
    expect(MAX_SPEED).toBe(600);
  });
  it('BASE_INTERVAL is 1500ms', () => {
    expect(BASE_INTERVAL).toBe(1500);
  });
  it('SPEED_INCREMENT is 50', () => {
    expect(SPEED_INCREMENT).toBe(50);
  });
  it('LEVEL_DURATION_SEC is 10', () => {
    expect(LEVEL_DURATION_SEC).toBe(10);
  });
});
