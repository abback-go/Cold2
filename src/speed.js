export const INITIAL_SPEED = 200;
export const MAX_SPEED = 600;
export const SPEED_INCREMENT = 50;
export const LEVEL_DURATION_SEC = 10;
export const BASE_INTERVAL = 1500;

export function currentLevel(elapsedSec) {
  if (elapsedSec <= 0) return 0;
  return Math.floor(elapsedSec / LEVEL_DURATION_SEC);
}

export function currentSpeed(elapsedSec) {
  const level = currentLevel(elapsedSec);
  const speed = INITIAL_SPEED + level * SPEED_INCREMENT;
  return Math.min(speed, MAX_SPEED);
}

export function spawnInterval(speed) {
  if (speed <= INITIAL_SPEED) return BASE_INTERVAL;
  return BASE_INTERVAL * (INITIAL_SPEED / speed);
}
